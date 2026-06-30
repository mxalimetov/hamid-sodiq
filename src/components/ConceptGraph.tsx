import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { conceptGraphData } from '../data/concepts';
import { useI18n } from '../i18n/context';
import type { GraphNode, TabId } from '../types';
import './ConceptGraph.css';

const TYPE_COLORS: Record<string, string> = {
  concept: '#f59e0b',
  episode: '#3b82f6',
  article: '#10b981',
  quote: '#8b5cf6',
  event: '#ef4444',
  document: '#ec4899',
};

const NODE_RADII: Record<string, number> = {
  concept: 32,
  episode: 20,
  article: 20,
  quote: 18,
  event: 20,
  document: 18,
};

const SIM_PARAMS = {
  repulsion: 12000,
  attraction: 0.004,
  damping: 0.88,
  centerGravity: 0.008,
  minDist: 60,
  maxDist: 350,
  idealEdgeLen: 140,
};

interface SimPos {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function getNodeRadius(type: string): number {
  return NODE_RADII[type] ?? 18;
}

function getNodeColor(type: string): string {
  return TYPE_COLORS[type] ?? '#6b7280';
}

function simulateStep(
  pos: Map<string, SimPos>,
  visibleIds: Set<string>,
  edges: { source: string; target: string }[],
  pinned: Set<string>,
  w: number,
  h: number,
) {
  const items: Array<{ id: string; p: SimPos }> = [];
  for (const id of visibleIds) {
    const p = pos.get(id);
    if (p) items.push({ id, p });
  }

  for (const { id, p } of items) {
    if (!pinned.has(id)) {
      p.vx = 0;
      p.vy = 0;
    }
  }

  const pr = SIM_PARAMS;

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i].p;
      const b = items[j].p;
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1) dist = 1;
      if (dist > pr.maxDist) continue;

      const force = pr.repulsion / (dist * dist);
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      if (!pinned.has(items[i].id)) { a.vx -= fx; a.vy -= fy; }
      if (!pinned.has(items[j].id)) { b.vx += fx; b.vy += fy; }
    }
  }

  for (const edge of edges) {
    if (!visibleIds.has(edge.source) || !visibleIds.has(edge.target)) continue;
    const a = pos.get(edge.source);
    const b = pos.get(edge.target);
    if (!a || !b) continue;

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const force = (dist - pr.idealEdgeLen) * pr.attraction;
    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;

    if (!pinned.has(edge.source)) { a.vx += fx; a.vy += fy; }
    if (!pinned.has(edge.target)) { b.vx -= fx; b.vy -= fy; }
  }

  const cx = w / 2;
  const cy = h / 2;
  for (const { id, p: sp } of items) {
    if (!pinned.has(id)) {
      sp.vx += (cx - sp.x) * pr.centerGravity;
      sp.vy += (cy - sp.y) * pr.centerGravity;
    }
  }

  for (const { id, p: sp } of items) {
    if (!pinned.has(id)) {
      sp.vx *= pr.damping;
      sp.vy *= pr.damping;
      sp.x += sp.vx;
      sp.y += sp.vy;
      const r = getNodeRadius(
        conceptGraphData.nodes.find(n => n.id === id)?.type ?? 'concept',
      );
      sp.x = Math.max(r, Math.min(w - r, sp.x));
      sp.y = Math.max(r, Math.min(h - r, sp.y));
    }
  }
}

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  const spacing = 40;
  for (let x = 0; x < w; x += spacing) {
    for (let y = 0; y < h; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawEdge(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  highlighted: boolean,
) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = highlighted
    ? 'rgba(245, 158, 11, 0.4)'
    : 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = highlighted ? 2 : 1.5;
  ctx.stroke();
}

function drawNode(
  ctx: CanvasRenderingContext2D,
  node: GraphNode,
  x: number, y: number,
  radius: number,
  isHovered: boolean,
  isSelected: boolean,
) {
  const color = getNodeColor(node.type);

  if (isHovered || isSelected) {
    ctx.save();
    ctx.shadowBlur = 30;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.15;
    ctx.fill();
    ctx.restore();
  }

  if (isSelected) {
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(x, y, radius + 6, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  const gradient = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, color + '99');
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = `bold ${radius * 0.7}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const initial = node.label.charAt(0);
  ctx.fillText(initial, x, y + 1);
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number, y: number,
  radius: number,
  isHovered: boolean,
) {
  const lines = text.length > 20
    ? [text.slice(0, Math.floor(text.length / 2)), text.slice(Math.floor(text.length / 2))]
    : [text];

  ctx.save();
  ctx.shadowBlur = isHovered ? 8 : 4;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.75)';
  ctx.font = isHovered ? 'bold 13px Inter, sans-serif' : '13px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  lines.forEach((line, i) => {
    ctx.fillText(line, x, y + radius + 8 + i * 18);
  });
  ctx.restore();
}

function hitTest(
  mx: number, my: number,
  pos: Map<string, SimPos>,
  visibleIds: Set<string>,
  allNodes: GraphNode[],
): string | null {
  let closest: string | null = null;
  let closestDist = Infinity;

  for (const node of allNodes) {
    if (!visibleIds.has(node.id)) continue;
    const p = pos.get(node.id);
    if (!p) continue;
    const dx = mx - p.x;
    const dy = my - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const threshold = getNodeRadius(node.type) + 6;
    if (dist < threshold && dist < closestDist) {
      closestDist = dist;
      closest = node.id;
    }
  }

  return closest;
}

interface ConceptGraphProps {
  onNavigate: (tab: TabId) => void;
}

export default function ConceptGraph({ onNavigate }: ConceptGraphProps) {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef<Map<string, SimPos>>(new Map());
  const pinnedRef = useRef<Set<string>>(new Set());
  const hoveredRef = useRef<string | null>(null);
  const selectedRef = useRef<string | null>(null);
  const animRef = useRef<number>(0);
  const dragRef = useRef<{
    id: string | null;
    offsetX: number;
    offsetY: number;
  }>({ id: null, offsetX: 0, offsetY: 0 });

  const [size, setSize] = useState({ w: 800, h: 600 });
  const [visibleIds, setVisibleIds] = useState<Set<string>>(() => {
    const conceptIds = conceptGraphData.nodes
      .filter(n => n.type === 'concept')
      .map(n => n.id);
    return new Set(conceptIds);
  });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setSize({ w: Math.floor(width), h: Math.floor(height) });
    });

    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const concepts = conceptGraphData.nodes.filter(n => n.type === 'concept');
    const cx = size.w / 2;
    const cy = size.h / 2;
    const radius = Math.min(size.w, size.h) * 0.28;

    concepts.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / concepts.length - Math.PI / 2;
      posRef.current.set(node.id, {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
        vx: 0,
        vy: 0,
      });
    });
  }, [size]);

  const allNodes = useMemo(() => conceptGraphData.nodes, []);
  const allEdges = useMemo(() => conceptGraphData.edges, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = size.w;
    canvas.height = size.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    function tick() {
      if (!running) return;
      simulateStep(posRef.current, visibleIds, allEdges, pinnedRef.current, size.w, size.h);
      render(ctx!);
      animRef.current = requestAnimationFrame(tick);
    }

    const typeLabels: Record<string, string> = {
      concept: t('graph.legend.concept'),
      episode: t('graph.legend.episode'),
      article: t('graph.legend.article'),
      quote: t('graph.legend.quote'),
      event: t('graph.legend.event'),
      document: t('graph.legend.document'),
    };

    function render(c: CanvasRenderingContext2D) {
      drawGrid(c, size.w, size.h);

      for (const edge of allEdges) {
        if (!visibleIds.has(edge.source) || !visibleIds.has(edge.target)) continue;
        const sp = posRef.current.get(edge.source);
        const tp = posRef.current.get(edge.target);
        if (!sp || !tp) continue;
        const highlighted =
          edge.source === hoveredRef.current || edge.target === hoveredRef.current;
        drawEdge(c, sp.x, sp.y, tp.x, tp.y, highlighted);
      }

      for (const node of allNodes) {
        if (!visibleIds.has(node.id)) continue;
        const p = posRef.current.get(node.id);
        if (!p) continue;
        const isHovered = node.id === hoveredRef.current;
        const isSelected = node.id === selectedRef.current;
        const radius = getNodeRadius(node.type);
        drawNode(c, node, p.x, p.y, radius, isHovered, isSelected);
      }

      for (const node of allNodes) {
        if (!visibleIds.has(node.id)) continue;
        const p = posRef.current.get(node.id);
        if (!p) continue;
        const isHovered = node.id === hoveredRef.current;
        const radius = getNodeRadius(node.type);
        const label = node.label;
        drawLabel(c, label, p.x, p.y, radius, isHovered);
      }
    }

    animRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [visibleIds, size, allNodes, allEdges, t]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (dragRef.current.id) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = hitTest(x, y, posRef.current, visibleIds, allNodes);
    hoveredRef.current = id;
    setHoveredId(id);
    canvas.style.cursor = id ? 'pointer' : 'default';
  }, [visibleIds, allNodes]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragRef.current.id) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = hitTest(x, y, posRef.current, visibleIds, allNodes);
    if (!id) {
      setSelectedNode(null);
      selectedRef.current = null;
      return;
    }

    const node = allNodes.find(n => n.id === id);
    if (!node) return;

    if (node.type === 'concept') {
      setVisibleIds(prev => {
        const next = new Set(prev);
        const expanded = node.connections.some(c => prev.has(c));

        if (expanded) {
          for (const c of node.connections) {
            next.delete(c);
            pinnedRef.current.delete(c);
            posRef.current.delete(c);
          }
        } else {
          const parentPos = posRef.current.get(node.id);
          const toAdd = node.connections.filter(c => !prev.has(c));
          toAdd.forEach((connId, i) => {
            const angle = (2 * Math.PI * i) / toAdd.length + (Math.random() - 0.5) * 0.3;
            const dist = 130 + Math.random() * 30;
            posRef.current.set(connId, {
              x: (parentPos?.x ?? size.w / 2) + dist * Math.cos(angle),
              y: (parentPos?.y ?? size.h / 2) + dist * Math.sin(angle),
              vx: 0,
              vy: 0,
            });
            next.add(connId);
          });
        }
        return next;
      });
      setSelectedNode(node);
      selectedRef.current = id;
    } else {
      setSelectedNode(node);
      selectedRef.current = id;
    }
  }, [visibleIds, allNodes, size]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = hitTest(x, y, posRef.current, visibleIds, allNodes);
    if (!id) return;

    const p = posRef.current.get(id);
    if (!p) return;

    dragRef.current = {
      id,
      offsetX: x - p.x,
      offsetY: y - p.y,
    };
    pinnedRef.current.add(id);
  }, [visibleIds, allNodes]);

  useEffect(() => {
    if (!dragRef.current.id) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.id) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const p = posRef.current.get(dragRef.current.id);
      if (!p) return;
      p.x = Math.max(0, Math.min(size.w, x - dragRef.current.offsetX));
      p.y = Math.max(0, Math.min(size.h, y - dragRef.current.offsetY));
    };

    const handleMouseUp = () => {
      if (dragRef.current.id) {
        setTimeout(() => {
          if (dragRef.current.id) {
            pinnedRef.current.delete(dragRef.current.id);
          }
          dragRef.current.id = null;
        }, 500);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [size]);

  const handleNavigateFromNode = useCallback(() => {
    if (!selectedNode) return;
    if (selectedNode.type === 'episode' || selectedNode.type === 'event') {
      onNavigate('timeline');
    } else if (selectedNode.type === 'article' || selectedNode.type === 'document') {
      onNavigate('library');
    }
  }, [selectedNode, onNavigate]);

  const expandCount = useMemo(() => {
    let count = 0;
    for (const node of allNodes) {
      if (node.type === 'concept' && node.connections.some(c => visibleIds.has(c))) {
        count++;
      }
    }
    return count;
  }, [visibleIds, allNodes]);

  const typeLabels: Record<string, string> = {
    concept: t('graph.legend.concept'),
    episode: t('graph.legend.episode'),
    article: t('graph.legend.article'),
    quote: t('graph.legend.quote'),
    event: t('graph.legend.event'),
    document: t('graph.legend.document'),
  };

  const selectedNodeTypeLabel = typeLabels[selectedNode?.type ?? ''] ?? '';

  return (
    <div className="concept-graph-page">
      <div className="concept-graph-container" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="concept-graph-canvas"
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseLeave={() => { setHoveredId(null); hoveredRef.current = null; }}
        />

        <div className="graph-legend">
          {Object.entries(typeLabels).map(([type, label]) => (
            <div key={type} className="graph-legend-item">
              <span
                className="graph-legend-dot"
                style={{ background: getNodeColor(type) }}
              />
              <span className="graph-legend-label">{label}</span>
            </div>
          ))}
        </div>

        <div className="graph-hint">
          {t('graph.hint')}
          {expandCount > 0 && (
            <span className="graph-hint-count">
              {t('graph.conceptsExpanded')
                .replace('{count}', String(expandCount))
                .replace('{plural}', expandCount !== 1 ? 's' : '')}
            </span>
          )}
        </div>
      </div>

      {selectedNode && (
        <aside className="graph-detail-panel" role="complementary" aria-label={t('graph.details')}>
          <button
            className="graph-detail-close"
            onClick={() => { setSelectedNode(null); selectedRef.current = null; }}
            aria-label={t('graph.close')}
          >
            ✕
          </button>

          <div
            className="graph-detail-type"
            style={{ color: getNodeColor(selectedNode.type) }}
          >
            {selectedNodeTypeLabel}
          </div>

          <h2 className="graph-detail-title">{selectedNode.label}</h2>

          {selectedNode.description && (
            <p className="graph-detail-desc">{selectedNode.description}</p>
          )}

          {selectedNode.details && (
            <div className="graph-detail-section">
              <h4>{t('graph.details')}</h4>
              <p>{selectedNode.details}</p>
            </div>
          )}

          {selectedNode.source && (
            <div className="graph-detail-section">
              <h4>{t('graph.source')}</h4>
              <p className="graph-detail-source">{selectedNode.source}</p>
            </div>
          )}

          {selectedNode.year && (
            <div className="graph-detail-section">
              <h4>{t('graph.year')}</h4>
              <p>{selectedNode.year}</p>
            </div>
          )}

          {(selectedNode.type === 'episode' ||
            selectedNode.type === 'article' ||
            selectedNode.type === 'document' ||
            selectedNode.type === 'event') && (
            <button className="graph-detail-nav-btn" onClick={handleNavigateFromNode}>
              {t('graph.navigateTo').replace(
                '{tab}',
                selectedNode.type === 'episode' || selectedNode.type === 'event'
                  ? t('nav.timeline')
                  : t('nav.library'),
              )}
            </button>
          )}
        </aside>
      )}
    </div>
  );
}
