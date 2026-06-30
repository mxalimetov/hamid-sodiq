import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import ForceGraphKapsule from 'force-graph';

interface ForceGraph2DProps {
  [key: string]: any;
  graphData?: { nodes: any[]; links: any[] };
  width?: number;
  height?: number;
  backgroundColor?: string;
  nodeColor?: string | ((node: any) => string);
  nodeVal?: number | string | ((node: any) => number);
  nodeLabel?: string | ((node: any) => string);
  nodeVisibility?: boolean | string | ((node: any) => boolean);
  nodeCanvasObjectMode?: string | ((node: any) => string);
  nodeCanvasObject?: (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => void;
  nodePointerAreaPaint?: (node: any, paintColor: string, ctx: CanvasRenderingContext2D) => void;
  linkColor?: string | ((link: any) => string);
  linkWidth?: number | string | ((link: any) => number);
  linkLabel?: string | ((link: any) => string);
  linkCurvature?: number | string | ((link: any) => number);
  linkDirectionalParticles?: number | string | ((link: any) => number);
  linkDirectionalParticleSpeed?: number | string | ((link: any) => number);
  linkDirectionalParticleWidth?: number | string | ((link: any) => number);
  linkDirectionalParticleColor?: string | ((link: any) => string);
  linkVisibility?: boolean | string | ((link: any) => boolean);
  linkLineDash?: number[] | string | ((link: any) => number[]);
  onNodeClick?: (node: any, event: MouseEvent) => void;
  onNodeHover?: (node: any | null, previousNode: any | null) => void;
  onNodeDrag?: (node: any, translate: { x: number; y: number }) => void;
  onNodeDragEnd?: (node: any, translate: { x: number; y: number }) => void;
  onBackgroundClick?: (event: MouseEvent) => void;
  onLinkClick?: (link: any, event: MouseEvent) => void;
  onLinkHover?: (link: any | null, previousLink: any | null) => void;
  onRenderFramePre?: (ctx: CanvasRenderingContext2D, globalScale: number) => void;
  onRenderFramePost?: (ctx: CanvasRenderingContext2D, globalScale: number) => void;
  onEngineTick?: () => void;
  onEngineStop?: () => void;
  d3AlphaDecay?: number;
  d3VelocityDecay?: number;
  d3AlphaMin?: number;
  warmupTicks?: number;
  cooldownTicks?: number;
  cooldownTime?: number;
  dagMode?: string;
  dagLevelDistance?: number;
  dagNodeFilter?: (node: any) => boolean;
  enableNodeDrag?: boolean;
  enableZoomInteraction?: boolean;
  enablePanInteraction?: boolean;
  enablePointerInteraction?: boolean;
  minZoom?: number;
  maxZoom?: number;
  nodeRelSize?: number;
  nodeOpacity?: number;
  linkOpacity?: number;
  showPointerCursor?: boolean | ((obj: any) => boolean);
}

export interface ForceGraph2DHandle {
  d3Force: (name: string, fn?: any) => any;
  d3ReheatSimulation: () => void;
  zoomToFit: (durationMs?: number, padding?: number, nodeFilter?: (node: any) => boolean) => void;
}

const ForceGraph2D = forwardRef<ForceGraph2DHandle, ForceGraph2DProps>((props, ref) => {
  const domEl = useRef<HTMLDivElement>(null);
  const compRef = useRef<any>(null);

  useEffect(() => {
    const el = domEl.current;
    if (!el) return;
    const graph = (ForceGraphKapsule as any)()(el);
    compRef.current = graph;
    return () => {
      if (typeof (graph as any)._destructor === 'function') (graph as any)._destructor();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    d3Force: (name: string, fn?: any) => {
      const g = compRef.current;
      return fn !== undefined ? g.d3Force(name, fn) : g.d3Force(name);
    },
    d3ReheatSimulation: () => compRef.current?.d3ReheatSimulation(),
    zoomToFit: (durationMs?: number, padding?: number, nodeFilter?: (node: any) => boolean) =>
      compRef.current?.zoomToFit(durationMs, padding, nodeFilter),
  }));

  useEffect(() => {
    const g = compRef.current;
    if (!g) return;
    for (const key of Object.keys(props)) {
      if (key === 'children' || key === 'key' || key === 'ref') continue;
      const val = (props as any)[key];
      if (typeof g[key] === 'function' && val !== undefined) {
        try { g[key](val); } catch {}
      }
    }
  });

  return <div ref={domEl} style={{ width: props.width || 800, height: props.height || 600 }} />;
});

ForceGraph2D.displayName = 'ForceGraph2D';

export default ForceGraph2D;
