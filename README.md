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

### JSON Serialization

```typescript
import { BrunoQuery } from 'bruno-query';

const query = new BrunoQuery()
  .addIncludes('user', 'posts')
  .addSort({ key: 'name', direction: 'ASC' })
  .setLimit(10)
  .setOptional({ custom_param: 'value', another_param: 123 });

// Convert to JSON string (optional parameters are flattened)
const jsonString = query.toJSON();
console.log(jsonString);
// {"includes":["user","posts"],"sort":[{"key":"name","direction":"ASC"}],"limit":10,"custom_param":"value","another_param":123}

// Parse JSON back to BrunoQuery (non-core parameters moved to optional)
const parsedQuery = BrunoQuery.fromJSON(jsonString);
console.log(parsedQuery.toObject());
// {
//   includes: ['user', 'posts'],
//   sort: [{ key: 'name', direction: 'ASC' }],
//   limit: 10,
//   optional: { custom_param: 'value', another_param: 123 }
// }

console.log(parsedQuery.toQueryString());
// includes[]=user&includes[]=posts&sort[0][key]=name&sort[0][direction]=ASC&limit=10&custom_param=value&another_param=123
```

**Note**: JSON serialization flattens optional parameters to the root level, ensuring consistency between JSON and query string representations.

### Filter Deduplication

BrunoQuery automatically removes duplicate filters within the same filter group based on the key-value-operator-not combination. This ensures clean and efficient query strings without redundant filters.

```typescript
import { BrunoQuery, QueryOperator } from 'bruno-query';

const query = new BrunoQuery()
  .addFilterGroup({
    or: false,
    filters: [
      { key: 'name', value: 'John', operator: QueryOperator.contains },
      { key: 'name', value: 'John', operator: QueryOperator.contains }, // Duplicate - will be removed
      { key: 'age', value: 25, operator: QueryOperator.equals },
      { key: 'name', value: 'John', operator: QueryOperator.contains }, // Another duplicate - will be removed
      { key: 'status', value: 'active', operator: QueryOperator.equals }
    ]
  });

console.log(query.toObject().filter_groups[0].filters.length);
// 3 (duplicates removed)

console.log(query.toQueryString());
// filter_groups[0][filters][0][key]=name&filter_groups[0][filters][0][value]=John&filter_groups[0][filters][0][operator]=ct&filter_groups[0][filters][1][key]=age&filter_groups[0][filters][1][value]=25&filter_groups[0][filters][1][operator]=eq&filter_groups[0][filters][2][key]=status&filter_groups[0][filters][2][value]=active&filter_groups[0][filters][2][operator]=eq
```

**Note**: Deduplication only applies within the same filter group. Different filter groups can have the same filters, and filters with different values, operators, or `not` values are not considered duplicates.

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
- `addFilterGroup(...groups: FilterGroup[])` - Add filter groups (with automatic deduplication)
- `addArrayFilterGroup(groups: FilterGroup[])` - Add filter groups from array (with automatic deduplication)
- `setFilterGroup(...groups: FilterGroup[])` - Replace filter groups (with automatic deduplication)
- `setArrayFilterGroup(groups: FilterGroup[])` - Replace filter groups from array (with automatic deduplication)
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
- `toJSON()` - Get JSON string representation
- `clone()` - Create a copy of the query

### Static Methods

- `BrunoQuery.fromQueryString(queryString: string)` - Parse query string
- `BrunoQuery.fromJSON(jsonString: string)` - Parse JSON string
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