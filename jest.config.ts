/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';
import { createJsWithTsPreset } from 'ts-jest'

const config: Config = {
  ...createJsWithTsPreset(),
  roots: ['<rootDir>/test'],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  testEnvironment: "node"
};

export default config;
