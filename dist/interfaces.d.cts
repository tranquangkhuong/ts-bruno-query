import { SortDirection, QueryOperator } from './enums.cjs';

/**
 * Query parameter
 */
interface QueryParameter {
    /**
     * Array of related resources to load, e.g. ['author', 'publisher', 'publisher.books']
     *
     * @type string[]
     */
    includes: string[];
    /**
     * Property to sort by, e.g. 'title'
     *
     * @type SortRule[]
     */
    sort: SortRule[];
    /**
     * Limit of resources to return
     *
     * @type number
     */
    limit: number;
    /**
     * Page number. For use with limit. E.g. 1
     *
     * @type number
     */
    page: number;
    /**
     * Array of filter groups.
     *
     * @type FilterGroup[]
     */
    filter_groups: FilterGroup[];
    /**
     * Optional parameters. For use with custom endpoints.
     *
     * Single object or array of objects with dynamic keys.
     *
     * @type Record<string, any> | Record<string, any>[]
     */
    optional?: Record<string, any> | Record<string, any>[];
}
/**
 * Filter for a single property
 */
interface Filter {
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
     */
    operator: QueryOperator;
    /**
     * Whether to negate the filter, e.g. 'not'
     */
    not?: boolean;
}
/**
 * Shorthand for a filter
 */
type FilterShorthand = [string, QueryOperator, string | number | null, boolean?];
/**
 * Filter group
 */
interface FilterGroup {
    /**
     * Whether to use OR instead of AND for the filters in this group
     *
     * @type boolean
     */
    or?: boolean;
    /**
     * Filters to apply to the group
     *
     * @type (Filter | FilterShorthand)[]
     */
    filters: (Filter | FilterShorthand)[];
}
/**
 * Sort rule
 */
interface SortRule {
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
     */
    direction: SortDirection;
}

export type { Filter, FilterGroup, FilterShorthand, QueryParameter, SortRule };
