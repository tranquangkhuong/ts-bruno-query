# TypeScript 2.0 Compatibility

## Problem

When building this package with modern TypeScript (3.8+), the generated `.d.ts` file uses the `type` keyword in export statements:

```typescript
export { BrunoQuery, type Filter, type FilterGroup, type FilterShorthand, QueryOperator, type QueryParameter, SortDirection, type SortRule };
```

This syntax is not compatible with TypeScript 2.0 because the `type` keyword in exports is only supported from TypeScript 3.8 onwards.

## Solution

To ensure compatibility with TypeScript 2.0, we have:

1. **Created an automatic `.d.ts` file fixer**: `scripts/fix-dts.js`
2. **Updated the build script**: Added the fix script to the build process in `package.json`

The `fix-dts.js` script automatically removes the `type` keyword from export statements after each build:

```typescript
// Before fix
export { BrunoQuery, type Filter, type FilterGroup, type FilterShorthand, QueryOperator, type QueryParameter, SortDirection, type SortRule };

// After fix
export { BrunoQuery, Filter, FilterGroup, FilterShorthand, QueryOperator, QueryParameter, SortDirection, SortRule };
```

## Usage

Simply run the build as usual:

```bash
npm run build
```

The script will automatically:
1. Build the package with modern TypeScript
2. Fix the `.d.ts` file for TypeScript 2.0 compatibility

## Notes

- The `.d.ts` file is automatically fixed after each build
- No need to change source code
- Full type safety is maintained
- Compatible with TypeScript 2.0+
