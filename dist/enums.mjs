// src/enums.ts
var SortDirection = /* @__PURE__ */ ((SortDirection2) => {
  SortDirection2["ASC"] = "ASC";
  SortDirection2["DESC"] = "DESC";
  return SortDirection2;
})(SortDirection || {});
var QueryOperator = /* @__PURE__ */ ((QueryOperator2) => {
  QueryOperator2["contains"] = "ct";
  QueryOperator2["startsWith"] = "sw";
  QueryOperator2["endsWith"] = "ew";
  QueryOperator2["equals"] = "eq";
  QueryOperator2["greaterThan"] = "gt";
  QueryOperator2["greaterThanOrEqual"] = "gte";
  QueryOperator2["lessThan"] = "lt";
  QueryOperator2["lessThanOrEqual"] = "lte";
  QueryOperator2["in"] = "in";
  QueryOperator2["between"] = "bt";
  return QueryOperator2;
})(QueryOperator || {});
export {
  QueryOperator,
  SortDirection
};
