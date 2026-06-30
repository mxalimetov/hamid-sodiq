import * as yaml from 'js-yaml';
import raw from './engagement.yaml?raw';
import type { EngagementItem } from '../types';

export const engagementData = yaml.load(raw) as EngagementItem[];
