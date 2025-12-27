// TypeScript Type Test
// This file tests that all types are properly exported and accessible

import {
    BrunoQuery,
    Filter,
    FilterGroup,
    FilterShorthand,
    QueryOperator,
    QueryParameter,
    Sort,
    SortDirection
} from '../dist/index';

// Test type definitions
const testTypes = () => {
  // Test BrunoQuery class
  const query: BrunoQuery = new BrunoQuery();

  // Test enums
  const operator: QueryOperator = QueryOperator.contains;
  const direction: SortDirection = SortDirection.ASC;

  // Test type aliases (as string values)
  const operatorValue: string = 'ct';
  const directionValue: string = 'ASC';

  // Test interfaces
  const filter: Filter = {
    key: 'name',
    value: 'John',
    operator: QueryOperator.contains,
    not: false
  };

  const filterShorthand: FilterShorthand = ['name', QueryOperator.contains, 'John', false];

  const filterGroup: FilterGroup = {
    or: false,
    filters: [filter, filterShorthand]
  };

  const sort: Sort = {
    key: 'name',
    direction: SortDirection.ASC
  };

  const queryParam: QueryParameter = {
    includes: ['user'],
    sort: [sort],
    filter_groups: [filterGroup],
    limit: 10,
    page: 1,
    optional: { custom: 'value' }
  };

  // Test method signatures
  const result1: string = query.toQueryString();
  const result2: string = query.toJSON();
  const result3: string = query.toURL('https://api.example.com');
  const result4: Record<string, any> = query.toObject();
  const result5: BrunoQuery = query.clone();
  const result6: BrunoQuery = query.addIncludes('user');
  const result7: BrunoQuery = query.addSort(sort);
  const result8: BrunoQuery = query.addFilterGroup(filterGroup);
  const result9: BrunoQuery = query.setLimit(10);
  const result10: BrunoQuery = query.setPage(1);
  const result11: BrunoQuery = query.setOptional({ custom: 'value' });
  const result12: BrunoQuery = query.reset();

  // Test static methods
  const staticQuery1: BrunoQuery = BrunoQuery.build([filterGroup], ['user'], [sort], 10, 1);
  const staticQuery2: BrunoQuery = BrunoQuery.fromQueryString('test=value');
  const staticQuery3: BrunoQuery = BrunoQuery.fromJSON('{"test":"value"}');
  const staticQuery4: BrunoQuery = BrunoQuery.parse('test=value');

  console.log('✅ All TypeScript types are properly defined and accessible');
  console.log('✅ All method signatures are correctly typed');
  console.log('✅ All static methods are properly typed');
  console.log('✅ All interfaces and enums are properly exported');

  return true;
};

// Run type test
testTypes();

console.log('🎉 TypeScript type tests completed successfully!');
console.log('================================================');
