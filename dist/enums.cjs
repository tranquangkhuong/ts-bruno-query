"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/enums.ts
var enums_exports = {};
__export(enums_exports, {
  QueryOperator: () => QueryOperator,
  SortDirection: () => SortDirection
});
module.exports = __toCommonJS(enums_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  QueryOperator,
  SortDirection
});
