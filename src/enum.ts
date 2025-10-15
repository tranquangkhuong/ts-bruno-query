/**
 * Query operator for filter
 */
export enum QueryOperator {
  /** String contains */
  contains = 'ct',

  /** Starts with */
  startsWith = 'sw',

  /** Ends with */
  endsWith = 'ew',

  /** Equals/Exact match */
  equals = 'eq',

  /** Greater than */
  greaterThan = 'gt',

  /** Greater than or equalTo */
  greaterThanOrEqual = 'gte',

  /** Lesser than */
  lessThan = 'lt',

  /** Lesser than or equalTo */
  lessThanOrEqual = 'lte',

  /** In array */
  in = 'in',

  /** Between */
  between = 'bt',
}

/**
 * Sort direction
 */
export enum SortDirection {
  /**
   * Sort in ascending order
   */
  ASC = 'ASC',

  /**
   * Sort in descending order
   */
  DESC = 'DESC',
}
