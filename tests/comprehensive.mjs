import { BrunoQuery, QueryOperator, SortDirection } from '../dist/index.mjs';

console.log('🧪 Comprehensive BrunoQuery Test Suite (ES Modules)');
console.log('==================================================\n');

// Test 1: Basic Query Building
console.log('📋 Test 1: Basic Query Building');
const basicQuery = new BrunoQuery()
  .addIncludes('user', 'posts')
  .addSort({ key: 'name', direction: SortDirection.ASC })
  .setLimit(10)
  .setPage(1);

console.log('✅ Basic query created');
console.log('Query string:', basicQuery.toQueryString());
console.log('Object:', basicQuery.toObject());
console.log('JSON:', basicQuery.toJSON());
console.log('URL:', basicQuery.toURL('https://api.example.com'));
console.log('');

// Test 2: Complex Filter Groups
console.log('🔍 Test 2: Complex Filter Groups');
const complexQuery = new BrunoQuery()
  .addIncludes('user', 'posts', 'comments')
  .addSort({ key: 'created_at', direction: SortDirection.DESC })
  .addSort({ key: 'name', direction: SortDirection.ASC })
  .setLimit(25)
  .setPage(2)
  .addFilterGroup({
    or: false,
    filters: [
      { key: 'status', value: 'active', operator: QueryOperator.equals },
      { key: 'age', value: [18, 65], operator: QueryOperator.between },
      { key: 'name', value: 'John', operator: QueryOperator.contains, not: true }
    ]
  })
  .addFilterGroup({
    or: true,
    filters: [
      { key: 'category', value: 'tech', operator: QueryOperator.equals },
      { key: 'tags', value: 'javascript', operator: QueryOperator.contains }
    ]
  })
  .setOptional({
    custom_param: 'value',
    another_param: 123,
    nested: { key: 'value' }
  });

console.log('✅ Complex query created');
console.log('Query string:', complexQuery.toQueryString());
console.log('Object:', complexQuery.toObject());
console.log('JSON:', complexQuery.toJSON());
console.log('');

// Test 3: JSON Serialization Round-trip
console.log('🔄 Test 3: JSON Serialization Round-trip');
const originalQuery = new BrunoQuery()
  .addIncludes('user', 'posts')
  .addSort({ key: 'name', direction: SortDirection.ASC })
  .setLimit(10)
  .setOptional({ custom: 'value', test: 123 });

const jsonString = originalQuery.toJSON();
const parsedQuery = BrunoQuery.fromJSON(jsonString);

console.log('✅ JSON round-trip test');
console.log('Original JSON:', jsonString);
console.log('Parsed object:', parsedQuery.toObject());
console.log('Query strings match:', originalQuery.toQueryString() === parsedQuery.toQueryString());
console.log('');

// Test 4: Query String Parsing
console.log('📝 Test 4: Query String Parsing');
const queryString = 'includes[]=user&includes[]=posts&sort[0][key]=name&sort[0][direction]=ASC&filter_groups[0][filters][0][key]=status&filter_groups[0][filters][0][value]=active&filter_groups[0][filters][0][operator]=eq&limit=10&page=1&custom_param=value';
const parsedFromString = BrunoQuery.fromQueryString(queryString);

console.log('✅ Query string parsing test');
console.log('Input string:', queryString);
console.log('Parsed object:', parsedFromString.toObject());
console.log('Round-trip string:', parsedFromString.toQueryString());
console.log('Strings match:', queryString === parsedFromString.toQueryString());
console.log('');

// Test 5: Static Build Method
console.log('🏗️ Test 5: Static Build Method');
const builtQuery = BrunoQuery.build(
  [{ or: false, filters: [{ key: 'status', value: 'active', operator: QueryOperator.equals }] }],
  ['user', 'posts'],
  [{ key: 'name', direction: SortDirection.ASC }],
  10,
  1
);

console.log('✅ Static build test');
console.log('Built query string:', builtQuery.toQueryString());
console.log('');

// Test 6: Clone Functionality
console.log('📋 Test 6: Clone Functionality');
const original = new BrunoQuery()
  .addIncludes('user')
  .setLimit(10)
  .setOptional({ test: 'value' });

const cloned = original.clone();
cloned.addIncludes('posts').setLimit(20);

console.log('✅ Clone test');
console.log('Original includes:', original.toObject().includes);
console.log('Cloned includes:', cloned.toObject().includes);
console.log('Original limit:', original.toObject().limit);
console.log('Cloned limit:', cloned.toObject().limit);
console.log('');

// Test 7: Error Handling
console.log('🚨 Test 7: Error Handling');
try {
  BrunoQuery.fromJSON('invalid json');
  console.log('❌ Should have thrown error');
} catch (error) {
  console.log('✅ Error handling works:', error.message);
}

try {
  BrunoQuery.fromQueryString('invalid=query&malformed');
  console.log('✅ Malformed query handled gracefully');
} catch (error) {
  console.log('❌ Unexpected error:', error);
}
console.log('');

console.log('🎉 All ES Modules tests completed successfully!');
console.log('==================================================');
