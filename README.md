# Bruno Query

[![npm version](https://img.shields.io/npm/v/bruno-query.svg)](https://www.npmjs.com/package/bruno-query)
[![npm downloads](https://img.shields.io/npm/d18m/bruno-query.svg)](https://www.npmjs.com/package/bruno-query)
[![license](https://img.shields.io/github/license/tranquangkhuong/ts-bruno-query.svg)](LICENSE)

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
import { BrunoQuery, SortDirection, QueryOperator } from 'bruno-query';

// Create a query
const query = new BrunoQuery()
  .addIncludes('author', 'publisher')
  .addSort({ key: 'name', direction: SortDirection.ASC })
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
- `addArrayIncludes(includes: string[])` - Add includes from array
- `setIncludes(...includes: string[])` - Replace includes
- `setArrayIncludes(includes: string[])` - Replace includes from array
- `addSort(...sort: SortRule[])` - Add sorting rules
- `addArraySort(sort: SortRule[])` - Add sorting rules from array
- `setSort(...sort: SortRule[])` - Replace sorting rules
- `setArraySort(sort: SortRule[])` - Replace sorting rules from array
- `addFilterGroup(...groups: FilterGroup[])` - Add filter groups
- `addArrayFilterGroup(groups: FilterGroup[])` - Add filter groups from array
- `setFilterGroup(...groups: FilterGroup[])` - Replace filter groups
- `setArrayFilterGroup(groups: FilterGroup[])` - Replace filter groups from array
- `setLimit(limit: number)` - Set result limit
- `setPage(page: number)` - Set page number
- `setOptional(optional: Record<string, any> | Record<string, any>[])` - Set optional parameters
- `addOptional(optional: Record<string, any> | Record<string, any>[])` - Add/merge optional parameters
- `reset()` - Reset all parameters to defaults

### Output Methods

- `toQueryString()` - Get query string
- `get()` - Alias of `toQueryString()`
- `toURL(baseUrl?: string)` - Get full URL
- `toObject()` - Get object representation
- `clone()` - Create a copy of the query

### Static Methods

- `BrunoQuery.fromQueryString(queryString: string)` - Parse query string
- `BrunoQuery.parse(queryString: string)` - Alias of `fromQueryString`
- `BrunoQuery.build(...)` - Build query with parameters

## Build Configuration

The library is built into 3 formats: cjs, mjs, d.ts

### Build Commands

```bash
# Build all formats
npm run build

# Development mode
npm run dev

# Test build structure
npm run test
```

## License

[MIT](LICENSE)