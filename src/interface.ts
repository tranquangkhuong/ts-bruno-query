import { QueryOperator, SortDirection } from "./enum";

/**
 * Sort rule
 */
export interface Sort {
  /**
   * Property to sort by, e.g. 'name'
   *
   * @type string
   */
  key: string;

  /**
   * Direction to sort by, e.g. 'asc' or 'desc'
   *
   * @type SortDirection
   * @see {@link SortDirection}
   */
  direction: SortDirection | string;
}

/**
 * Filter for a single property
 */
export interface Filter {
  /**
   * Property to filter by, e.g. 'name'
   *
   * @type string
   */
  key: string;

  /**
   * Value to filter by, e.g. 'John'
   *
   * @type string | number | (string | number)[] | null
   */
  value: string | number | (string | number)[] | null;

  /**
   * Operator to use for the filter, e.g. 'eq'
   *
   * @type QueryOperator
   * @see {@link QueryOperator}
   */
  operator: QueryOperator | string;

  /**
   * Whether to negate the filter, e.g. 'not'
   */
  not?: boolean;
}

/**
 * Shorthand for a filter
 *
 * @see {@link QueryOperator}
 */
export type FilterShorthand = [
  string, // key
  QueryOperator | string, // operator
  string | number | null, // value
  boolean | undefined // not
];

/**
 * Filter group
 */
export interface FilterGroup {
  /**
   * Whether to use OR instead of AND for the filters in this group
   *
   * @type boolean `true` for OR, `false` for AND
   */
  or?: boolean;

  /**
   * Filters to apply to the group
   *
   * @type (Filter | FilterShorthand)[]
   * @see {@link Filter}
   * @see {@link FilterShorthand}
   */
  filters: (Filter | FilterShorthand)[];
}

/**
 * Query parameter
 */
export interface QueryParameter {
  /**
   * Array of related resources to load, e.g. ['author', 'publisher', 'publisher.books']
   *
   * @type string[]
   */
  includes?: string[];

  /**
   * Property to sort by, e.g. 'title'
   *
   * @type Sort[]
   * @see {@link Sort}
   */
  sort?: Sort[];

  /**
   * Array of filter groups.
   *
   * @type FilterGroup[]
   * @see {@link FilterGroup}
   */
  filter_groups?: FilterGroup[];

  /**
   * Optional parameters. For use with custom endpoints.
   *
   * Single object or array of objects with dynamic keys.
   *
   * @type Record<string, any> | Record<string, any>[]
   * @see {@link Record}
   */
  optional?: Record<string, any> | Record<string, any>[];

  /**
   * Limit of resources to return
   *
   * @type number | null
   */
  limit?: number | null;

  /**
   * Offset of resources to return
   *
   * @type number | null
   */
  offset?: number | null;

  /**
   * Per page of resources to return
   *
   * Same as limit, but different name
   *
   * @type number | null
   */
  perPage?: number | null;

  /**
   * Page number. For use with limit. E.g. 1
   *
   * @type number | null
   */
  page?: number | null;
}
