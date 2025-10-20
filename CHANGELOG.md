# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.5] - 2025-10-20
### Fixed
- Removed `QueryOperatorValue`, `SortDirectionValue`. Use string instead of enum literals

## [1.0.4] - 2025-10-20
### Changed
- Changed `QueryOperatorValue`, `SortDirectionValue` to use string instead of enum literals

## [1.0.3] - 2025-10-18

### Added
- TypeScript 2.0 compatibility support
- Automatic `.d.ts` and `.d.mts` file fixing script
- Comprehensive documentation for TypeScript 2.0 compatibility
- JSON serialization support with `toJSON()` method
- JSON parsing support with `BrunoQuery.fromJSON()` static method
- **Filter deduplication**: Automatic removal of duplicate filters within the same filter group based on key-value-operator-not combination
- Deduplication test suite to verify filter uniqueness
- Comprehensive JSON serialization tests
- Smart optional parameter handling in JSON serialization

### Changed
- Export statements in declaration files now compatible with TypeScript 2.0+
- Build process now includes automatic type export fixing
- JSON serialization now flattens optional parameters to root level
- JSON parsing now moves non-core parameters to optional object

### Fixed
- Resolved TypeScript 2.0 compatibility issues with `type` keyword in export statements
- Fixed both `.d.ts` and `.d.mts` files to work with older TypeScript versions

## [1.0.2] - 2025-10-15

### Added
- Initial release of BrunoQuery TypeScript library
- Support for Bruno PHP query parameter generation
- Comprehensive API for building complex queries
- TypeScript definitions for all interfaces and enums
- Support for includes, sorting, filtering, pagination, and optional parameters
- Query string parsing capabilities
- URL generation with query parameters

### Features
- **Query Building**: Fluent API for building complex queries
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Bruno Integration**: Designed specifically for Bruno PHP library
- **Flexible Filtering**: Support for complex filter groups with AND/OR logic
- **Sorting**: Multi-field sorting with direction control
- **Pagination**: Built-in limit and page support
- **Includes**: Related resource loading support
- **Optional Parameters**: Custom parameter support for extended functionality
- **Query Parsing**: Parse existing query strings back to BrunoQuery instances
- **URL Generation**: Convert queries to URLs with proper encoding

### API
- `BrunoQuery` class with fluent interface
- `QueryOperator` enum for filter operations
- `SortDirection` enum for sort directions
- `Filter`, `FilterGroup`, `FilterShorthand` interfaces
- `QueryParameter`, `Sort` interfaces
- Static methods: `build()`, `parse()`, `fromQueryString()`

### Examples
```typescript
// Basic usage
const query = new BrunoQuery()
  .addIncludes('user', 'posts')
  .addSort({ key: 'name', direction: SortDirection.ASC })
  .setLimit(10)
  .setPage(1)
  .addFilterGroup({
    or: false,
    filters: [
      { key: 'name', value: 'John', operator: QueryOperator.contains }
    ]
  });

// Generate query string
const queryString = query.toQueryString();
// Result: "includes[]=user&includes[]=posts&sort[0][key]=name&sort[0][direction]=ASC&limit=10&page=1&filter_groups[0][filters][0][key]=name&filter_groups[0][filters][0][value]=John&filter_groups[0][filters][0][operator]=ct"

// Parse existing query
const parsedQuery = BrunoQuery.fromQueryString(queryString);
```

### TypeScript 2.0 Compatibility

Starting from version 1.0.2, this package is fully compatible with TypeScript 2.0+. The build process automatically fixes declaration files to ensure compatibility with older TypeScript versions while maintaining full functionality with modern TypeScript versions.

---

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
