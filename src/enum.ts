/**
 * Query operator for filter
 */
export enum QueryOperator {
  /** String contains */
  contains = "ct",

  /** Starts with */
  startsWith = "sw",

  /** Ends with */
  endsWith = "ew",

  /** Equals/Exact match */
  equals = "eq",

  /** Greater than */
  greaterThan = "gt",

  /** Greater than or equalTo */
  greaterThanEqual = "gte",

  /** Lesser than */
  lessThan = "lt",

  /** Lesser than or equalTo */
  lessThanEqual = "lte",

  /** In array */
  in = "in",

  /** Between */
  between = "bt",
}

/**
 * Type for QueryOperator values (string literals)
 */
export type QueryOperatorValue = "ct" | "sw" | "ew" | "eq" | "gt" | "gte" | "lt" | "lte" | "in" | "bt";

/**
 * Sort direction
 */
export enum SortDirection {
  /**
   * Sort in ascending order
   */
  ASC = "ASC",

  /**
   * Sort in descending order
   */
  DESC = "DESC",
}

/**
 * Type for SortDirection values (string literals)
 */
export type SortDirectionValue = "ASC" | "DESC";
