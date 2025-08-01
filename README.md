# Bruno Query

A TypeScript library for building and parsing query parameters, designed for Bruno PHP library.

## Features

- ✅ **Dynamic Optional Parameters** - Support single objects and arrays with custom keys
- ✅ **Multiple Build Formats** - TypeScript, ES Modules, and CommonJS
- ✅ **Type Safety** - Full TypeScript support with interfaces and enums
- ✅ **Flexible Query Building** - Includes, sorting, filtering, pagination
- ✅ **URL Generation** - Convert queries to URL strings
- ✅ **Query Parsing** - Parse existing query strings back to objects

## Installation

```bash
npm install bruno-query
```

## Quick Start

```typescript
import { BrunoQuery } from 'bruno-query';

// Create a query
const query = new BrunoQuery()
  .addIncludes('author', 'publisher')
  .addSort({ key: 'name', direction: 'ASC' })
  .setLimit(20)
  .setPage(1)
  .setOptional({
    category: 'books',
    status: 'active'
  });

// Get query string
const queryString = query.toQueryString();
// Result: "includes[]=author&includes[]=publisher&sort[0][key]=name&sort[0][direction]=ASC&limit=20&page=1&category=books&status=active"

// Get URL
const url = query.toURL('https://api.example.com/books');
// Result: "https://api.example.com/books?includes[]=author&includes[]=publisher&sort[0][key]=name&sort[0][direction]=ASC&limit=20&page=1&category=books&status=active"
```

## Build Configuration

The library is built into 3 formats:

```
dist/
├── ts/           # TypeScript files (development)
├── mjs/          # ES Modules (modern environments)
└── cjs/          # CommonJS (Node.js/legacy)
```

### Build Commands

```bash
# Build all formats
npm run build

# Build individual formats
npm run build:mjs    # ES Modules
npm run build:cjs    # CommonJS
npm run build:ts     # TypeScript

# Test build structure
npm run test

# Development mode
npm run dev
```

## Usage Examples

### Basic Query

```typescript
import { BrunoQuery } from 'bruno-query';

const query = new BrunoQuery()
  .addIncludes('author')
  .setLimit(10)
  .setPage(1);

console.log(query.toQueryString());
// "includes[]=author&limit=10&page=1"
```

### Advanced Query with Filters

```typescript
import { BrunoQuery, QueryOperator } from 'bruno-query';

const query = new BrunoQuery()
  .addFilterGroup({
    or: false,
    filters: [
      { key: 'category', operator: QueryOperator.equals, value: 'books' },
      { key: 'status', operator: QueryOperator.equals, value: 'active' }
    ]
  })
  .addSort({ key: 'created_at', direction: 'DESC' })
  .setOptional({
    filters: {
      category: 'books',
      status: 'active'
    },
    options: {
      includeDeleted: false
    }
  });

console.log(query.toQueryString());
```

### Parse Existing Query

```typescript
import { BrunoQuery } from 'bruno-query';

const queryString = "includes[]=author&sort[0][key]=name&limit=20&category=books";
const query = BrunoQuery.fromQueryString(queryString);

console.log(query.toObject());
// {
//   includes: ['author'],
//   sort: [{ key: 'name', direction: 'ASC' }],
//   limit: 20,
//   page: 1,
//   filter_groups: [],
//   optional: { category: 'books' }
// }
```

## API Reference

### Core Methods

- `addIncludes(...includes: string[])` - Add related resources to load
- `addSort(...sort: SortRule[])` - Add sorting rules
- `addFilterGroup(...groups: FilterGroup[])` - Add filter groups
- `setLimit(limit: number)` - Set result limit
- `setPage(page: number)` - Set page number
- `setOptional(optional: Record<string, any> | Record<string, any>[])` - Set optional parameters

### Output Methods

- `toQueryString()` - Get query string
- `toURL(baseUrl?: string)` - Get full URL
- `toObject()` - Get object representation
- `clone()` - Create a copy of the query

### Static Methods

- `BrunoQuery.fromQueryString(queryString: string)` - Parse query string
- `BrunoQuery.build(...)` - Build query with parameters

## License

MIT