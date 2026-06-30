import * as yaml from 'js-yaml';
import raw from './timeline.yaml?raw';
import type { TimelineEvent } from '../types';

export const timelineData = yaml.load(raw) as TimelineEvent[];
