class CodeAnalytics {
  static analyze(code) {
    if (!code) return { loc: 0, functions: 0, complexity: 1 };

    // 1. Calculate Lines of Code (LOC) ignoring empty lines
    const lines = code.split('\n').filter(line => line.trim().length > 0);
    const loc = lines.length;

    // 2. Count Function Declarations & Arrow Functions
    const funcMatches = code.match(/function\s+\w+|const\s+\w+\s*=\s*\([^)]*\)\s*=>|\([\w\s,]*\)\s*=>/g);
    const functions = funcMatches ? funcMatches.length : 0;

    // 3. Estimate Cyclomatic Complexity based on decision branches
    const decisionPoints = code.match(/if\b|else\s+if\b|for\b|while\b|case\b|\&\&|\|\||\?/g);
    const complexity = 1 + (decisionPoints ? decisionPoints.length : 0);

    return { loc, functions, complexity };
  }
} 