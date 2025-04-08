import * as glob from "glob";
import { statSync } from "fs";

export const paths = (patterns: string[]): string[] => {
  return patterns.reduce((acc: string[], pattern: string): string[] => {
    return acc.concat(
      glob.sync(pattern).filter((path) => statSync(path).isFile())
    );
  }, []);
};

export const unmatchedPatterns = (patterns: string[]): string[] => {
  return patterns.reduce((acc: string[], pattern: string): string[] => {
    return acc.concat(
      glob.sync(pattern).filter((path) => statSync(path).isFile()).length == 0
        ? [pattern]
        : []
    );
  }, []);
};
