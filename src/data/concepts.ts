import * as yaml from 'js-yaml';
import raw from './concepts.yaml?raw';
import type { GraphData } from '../types';

export const conceptGraphData = yaml.load(raw) as GraphData;
