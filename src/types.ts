export interface GraphNode {
  id: string;
  label: string;
  type: 'concept' | 'episode' | 'article' | 'quote' | 'event' | 'document';
  description?: string;
  details?: string;
  source?: string;
  url?: string;
  year?: number;
  connections: string[];
}

export interface GraphEdge {
  source: string;
  target: string;
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface LibraryItem {
  id: string;
  title: string;
  author: string;
  topic: string;
  year: number;
  commentary: string;
  notes: string;
  coverUrl?: string;
  isbn?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'geopolitical' | 'analysis' | 'prediction' | 'reform' | 'institutional';
  analysis?: string;
  prediction?: string;
  status?: 'ongoing' | 'completed' | 'proposed' | 'monitoring';
  source?: string;
}

export type TabId = 'graph' | 'library' | 'timeline';

export interface SimNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pinned: boolean;
  type: GraphNode['type'];
  label: string;
}
