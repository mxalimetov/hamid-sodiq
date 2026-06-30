import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import ForceGraph2D from './ForceGraph2D';
import { conceptGraphData } from '../data/concepts';
import { useI18n } from '../i18n/context';
import type { GraphNode } from '../types';
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

function getNodeRadius(type: string): number {
  return NODE_RADII[type] ?? 18;
}

function getNodeColor(type: string): string {
  return TYPE_COLORS[type] ?? '#6b7280';
}

interface ConceptGraphProps {
  onNavigate: (sectionId: string) => void;
}

export default function ConceptGraph({ onNavigate }: ConceptGraphProps) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
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

  const allNodes = useMemo(() => conceptGraphData.nodes, []);
  const allEdges = useMemo(() => conceptGraphData.edges, []);

  const graphData = useMemo(() => {
    const visibleNodes = allNodes.filter(n => visibleIds.has(n.id));
    const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
    const visibleEdges = allEdges.filter(
      e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target),
    );
    return { nodes: visibleNodes as any[], links: visibleEdges as any[] };
  }, [visibleIds, allNodes, allEdges]);

  const nodeColor = useCallback((node: any) => getNodeColor(node.type), []);

  const nodeVal = useCallback((node: any) => getNodeRadius(node.type), []);

  const linkColor = useCallback(
    (link: any) => {
      const sourceId =
        typeof link.source === 'object' ? link.source.id : link.source;
      const targetId =
        typeof link.target === 'object' ? link.target.id : link.target;
      const highlighted =
        sourceId === hoveredId || targetId === hoveredId;
      return highlighted
        ? 'rgba(245, 158, 11, 0.4)'
        : 'rgba(255, 255, 255, 0.08)';
    },
    [hoveredId],
  );

  const linkWidth = useCallback(
    (link: any) => {
      const sourceId =
        typeof link.source === 'object' ? link.source.id : link.source;
      const targetId =
        typeof link.target === 'object' ? link.target.id : link.target;
      const highlighted =
        sourceId === hoveredId || targetId === hoveredId;
      return highlighted ? 2 : 1.5;
    },
    [hoveredId],
  );

  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleNodeClick = useCallback(
    (node: any) => {
      if (!node || !node.id) return;

      const graphNode = allNodes.find(n => n.id === node.id);
      if (!graphNode) return;

      if (graphNode.type === 'concept') {
        setVisibleIds(prev => {
          const next = new Set(prev);
          const expanded = graphNode.connections.some(c => prev.has(c));

          if (expanded) {
            for (const c of graphNode.connections) {
              next.delete(c);
            }
          } else {
            for (const c of graphNode.connections) {
              next.add(c);
            }
          }
          return next;
        });
      }

      setSelectedNode(graphNode);
    },
    [allNodes],
  );

  const handleNodeHover = useCallback((node: any) => {
    setHoveredId(node?.id ?? null);
  }, []);

  const handleNavigateFromNode = useCallback(() => {
    if (!selectedNode) return;
    if (selectedNode.type === 'episode' || selectedNode.type === 'event') {
      onNavigate('section-timeline');
    } else if (
      selectedNode.type === 'article' ||
      selectedNode.type === 'document'
    ) {
      onNavigate('section-library');
    }
  }, [selectedNode, onNavigate]);

  const typeLabels: Record<string, string> = useMemo(
    () => ({
      concept: t('graph.legend.concept'),
      episode: t('graph.legend.episode'),
      article: t('graph.legend.article'),
      quote: t('graph.legend.quote'),
      event: t('graph.legend.event'),
      document: t('graph.legend.document'),
    }),
    [t],
  );

  const selectedNodeTypeLabel = typeLabels[selectedNode?.type ?? ''] ?? '';

  return (
    <div className="concept-graph-page">
      <div className="concept-graph-container" ref={containerRef}>
        <ForceGraph2D
          graphData={graphData}
          width={size.w}
          height={size.h}
          backgroundColor="#0a0e1a"
          nodeColor={nodeColor}
          nodeVal={nodeVal}
          nodeLabel={(node: any) => node.label}
          linkColor={linkColor}
          linkWidth={linkWidth}
          linkDirectionalParticleSpeed={0.005}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          onBackgroundClick={handleBackgroundClick}
          nodeCanvasObjectMode="replace"
          nodeCanvasObject={(
            node: any,
            ctx: CanvasRenderingContext2D,
            _globalScale: number,
          ) => {
            const { x, y, type, label } = node;
            const radius = getNodeRadius(type);
            const color = getNodeColor(type);
            const isHovered = node.id === hoveredId;
            const isSelected = selectedNode?.id === node.id;

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
              ctx.beginPath();
              ctx.arc(x, y, radius + 6, 0, Math.PI * 2);
              ctx.strokeStyle = color;
              ctx.lineWidth = 2;
              ctx.globalAlpha = 0.5;
              ctx.stroke();
            }

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
              x - radius * 0.3,
              y - radius * 0.3,
              0,
              x,
              y,
              radius,
            );
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
            const initial = label.charAt(0);
            ctx.fillText(initial, x, y + 1);

            const lines =
              label.length > 20
                ? [
                    label.slice(0, Math.floor(label.length / 2)),
                    label.slice(Math.floor(label.length / 2)),
                  ]
                : [label];

            ctx.save();
            ctx.shadowBlur = isHovered ? 8 : 4;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.fillStyle = isHovered
              ? 'rgba(255, 255, 255, 1)'
              : 'rgba(255, 255, 255, 0.75)';
            ctx.font = isHovered
              ? 'bold 13px Inter, sans-serif'
              : '13px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';

            lines.forEach((line, i) => {
              ctx.fillText(line, x, y + radius + 8 + i * 18);
            });
            ctx.restore();
          }}
          nodePointerAreaPaint={(
            node: any,
            paintColor: string,
            ctx: CanvasRenderingContext2D,
          ) => {
            const radius = getNodeRadius(node.type);
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = paintColor;
            ctx.fill();
          }}
          onRenderFramePre={(ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
            const spacing = 40;
            for (let x = 0; x < size.w; x += spacing) {
              for (let y = 0; y < size.h; y += spacing) {
                ctx.beginPath();
                ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          cooldownTicks={100}
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
      </div>

      {selectedNode && (
        <aside
          className="graph-detail-panel"
          role="complementary"
          aria-label={t('graph.details')}
        >
          <button
            className="graph-detail-close"
            onClick={() => {
              setSelectedNode(null);
            }}
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
            <button
              className="graph-detail-nav-btn"
              onClick={handleNavigateFromNode}
            >
              {t('graph.navigateTo')
                .replace(
                  '{tab}',
                  selectedNode.type === 'episode' ||
                    selectedNode.type === 'event'
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
