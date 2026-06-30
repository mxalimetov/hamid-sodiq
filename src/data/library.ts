import * as yaml from 'js-yaml';
import raw from './library.yaml?raw';
import type { LibraryItem } from '../types';

export const libraryData = yaml.load(raw) as LibraryItem[];
