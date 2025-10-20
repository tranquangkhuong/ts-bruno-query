/**
 * Query operator for filter
 */
declare enum QueryOperator {
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
    between = "bt"
}
/**
 * Sort direction
 */
declare enum SortDirection {
    /**
     * Sort in ascending order
     */
    ASC = "ASC",
    /**
     * Sort in descending order
     */
    DESC = "DESC"
}

/**
 * Sort rule
 */
interface Sort {
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
type FilterShorthand = [
    string,
    // key
    QueryOperator | string,
    // operator
    string | number | null,
    // value
    boolean | undefined
];
/**
 * Filter group
 */
interface FilterGroup {
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
interface QueryParameter {
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
     * Page number. For use with limit. E.g. 1
     *
     * @type number | null
     */
    page?: number | null;
}

/**
 * Query Builder for Bruno Library in PHP
 *
 * @see {@link https://github.com/esbenp/bruno}
 */
declare class BrunoQuery {
    static DEFAULT_LIMIT: number;
    static DEFAULT_PAGE: number;
    /**
     * Private data for the query parameters
     *
     * @type QueryParameter
     * @see {@link QueryParameter}
     */
    private _params;
    /**
     * Add includes to the query parameters
     *
     * @param includes - Related resources to load. E.g. `'author', 'publisher', 'publisher.books'`
     * @returns `this`
     */
    addIncludes(...includes: string[]): this;
    /**
     * Add includes to the query parameters from array
     *
     * @param includes - Array of related resources to load. E.g. `['author', 'publisher', 'publisher.books']`
     * @returns `this`
     */
    addArrayIncludes(includes: string[]): this;
    /**
     * Set includes to the query parameters (replace existing)
     *
     * @param includes - Related resources to load. E.g. `'author', 'publisher', 'publisher.books'`
     * @returns `this`
     */
    setIncludes(...includes: string[]): this;
    /**
     * Set includes to the query parameters from array (replace existing)
     *
     * @param includes - Array of related resources to load. E.g. `['author', 'publisher', 'publisher.books']`
     * @returns `this`
     */
    setArrayIncludes(includes: string[]): this;
    /**
     * Add sort rules to the query parameters
     *
     * @param sort - Sort rules. E.g. `{ key: 'name', direction: SortDirection.ASC }`
     * @returns `this`
     * @see {@link Sort}
     */
    addSort(...sort: Sort[]): this;
    /**
     * Add sort rules to the query parameters from array
     *
     * @param sort - Array of sort rules. E.g. `[{ key: 'name', direction: SortDirection.ASC }]`
     * @returns `this`
     * @see {@link Sort}
     */
    addArraySort(sort: Sort[]): this;
    /**
     * Set sort rules to the query parameters (replace existing)
     *
     * @param sort - Sort rules. E.g. `{ key: 'name', direction: SortDirection.ASC }`
     * @returns `this`
     * @see {@link Sort}
     */
    setSort(...sort: Sort[]): this;
    /**
     * Set sort rules to the query parameters from array (replace existing)
     *
     * @param sort - Array of sort rules. E.g. `[{ key: 'name', direction: SortDirection.ASC }]`
     * @returns `this`
     * @see {@link Sort}
     */
    setArraySort(sort: Sort[]): this;
    /**
     * Add filter groups to the query parameters
     *
     * @param groups - Filter groups. E.g. `{ or: false, filters: [{ key: 'name', value: 'Optimus', operator: 'sw' }] }`
     * @returns `this`
     * @see {@link FilterGroup}
     */
    addFilterGroup(...groups: FilterGroup[]): this;
    /**
     * Add filter groups to the query parameters from array
     *
     * @param groups - Array of filter groups. E.g. `[{ or: false, filters: [{ key: 'name', value: 'Optimus', operator: 'sw' }] }]`
     * @returns `this`
     * @see {@link FilterGroup}
     */
    addArrayFilterGroup(groups: FilterGroup[]): this;
    /**
     * Set filter groups to the query parameters (replace existing)
     *
     * @param groups - Filter groups. E.g. `{ or: false, filters: [{ key: 'name', value: 'Optimus', operator: 'sw' }] }`
     * @returns `this`
     * @see {@link FilterGroup}
     */
    setFilterGroup(...groups: FilterGroup[]): this;
    /**
     * Set filter groups to the query parameters from array (replace existing)
     *
     * @param groups - Array of filter groups. E.g. `[{ or: false, filters: [{ key: 'name', value: 'Optimus', operator: 'sw' }] }]`
     * @returns `this`
     * @see {@link FilterGroup}
     */
    setArrayFilterGroup(groups: FilterGroup[]): this;
    /**
     * Set the limit of the query parameters
     *
     * @param limit - Limit of resources to return. If `null`, the limit parameter will be removed.
     * @returns `this`
     */
    setLimit(limit: number | null): this;
    /**
     * Set the page number of the query parameters
     *
     * @param page - Page number. If `null`, the page parameter will be removed.
     * @returns `this`
     */
    setPage(page: number | null): this;
    /**
     * Set optional parameters that are not available in BrunoQuery
     *
     * @param optional - Optional parameters (single object or array of objects)
     * @returns `this`
     * @see {@link Record}
     */
    setOptional(optional: Record<string, any> | Record<string, any>[]): this;
    /**
     * Add optional parameters to existing optional parameters
     *
     * @param optional - Optional parameters to add (single object or array of objects)
     * @returns `this`
     * @see {@link Record}
     */
    addOptional(optional: Record<string, any> | Record<string, any>[]): this;
    /**
     * Reset the query parameters to their default values
     *
     * @returns `this`
     */
    reset(): this;
    /**
     * Clone the query parameters to a new instance
     *
     * @returns BrunoQuery
     */
    clone(): BrunoQuery;
    /**
     * Remove duplicate filters from a filter group based on key-value-operator-not combination
     *
     * @param group - Filter group to deduplicate
     * @returns FilterGroup with duplicate filters removed
     * @private
     */
    private deduplicateFilters;
    /**
     * Return the query parameters as an object
     *
     * @returns Record<string, any>
     */
    toObject(): Record<string, any>;
    /**
     * Return the query parameters as a URL
     *
     * @param baseUrl - Base URL to append the query parameters to
     * @returns string
     */
    toURL(baseUrl?: string): string;
    /**
     * Return the query parameters as a query string
     *
     * @returns string
     */
    toQueryString(): string;
    /**
     * Return the query parameters as a query string
     *
     * @alias {@link toQueryString}
     * @returns string
     */
    get(): string;
    /**
     * Return the query parameters as a JSON string
     * Optional parameters are flattened to the root level
     *
     * @returns string
     */
    toJSON(): string;
    /**
     * Handle the includes parameter
     *
     * @param queryParts - Array of query parts
     */
    private handleIncludes;
    /**
     * Handle the sort parameter
     *
     * @param queryParts - Array of query parts
     */
    private handleSort;
    /**
     * Handle the limit and page parameters
     *
     * @param queryParts - Array of query parts
     */
    private handleLimitPage;
    /**
     * Handle the filter groups parameter
     *
     * @param queryParts - Array of query parts
     */
    private handleFilterGroups;
    /**
     * Handle the filters in a filter group
     *
     * @param queryParts - Array of query parts
     * @param group - Filter group
     * @param groupIndex - Index of the filter group
     */
    private handleFilters;
    /**
     * Parse a filter into a Filter object
     *
     * @param filter - Filter to parse
     * @returns Filter|FilterShorthand
     */
    private handleParseFilter;
    /**
     * Handle the optional parameters
     *
     * @param queryParts - Array of query parts
     */
    private handleOptional;
    /**
     * Handle single optional object with dynamic keys
     *
     * @param queryParts - Array of query parts
     * @param optionalObj - Optional object
     * @param index - Index of the optional object
     */
    private handleOptionalObject;
    /**
     * Handle push key and value into query parts
     *
     * @param queryParts - Array of query parts
     * @param keyName - Key name
     * @param value - Value
     * @param index - Index of the filter
     */
    private handleValue;
    /**
     * Build a new BrunoQuery instance
     *
     * @param filterGroups - Filter groups
     * @param includes - Includes
     * @param sort - Sort rules
     * @param limit - Limit of resources to return
     * @param page - Page number
     * @returns BrunoQuery
     */
    static build(filterGroups?: FilterGroup[] | null, includes?: string[] | null, sort?: Sort[] | null, limit?: number | null, page?: number | null): BrunoQuery;
    /**
     * Parse query string and set parameters
     *
     * @alias {@link fromQueryString}
     *
     * @param queryString - Query string to parse, e.g. "includes[]=user&sort[0][key]=name&limit=15"
     * @returns `this`
     */
    static parse(queryString: string): BrunoQuery;
    /**
     * Parse query string and set parameters
     *
     * @param queryString - Query string to parse, e.g. "includes[]=user&sort[0][key]=name&limit=15"
     * @returns `this`
     */
    static fromQueryString(queryString: string): BrunoQuery;
    /**
     * Create BrunoQuery instance from JSON string
     * Non-core parameters are moved to optional
     *
     * @param jsonString - JSON string to parse
     * @returns BrunoQuery
     */
    static fromJSON(jsonString: string): BrunoQuery;
    /**
     * Parse includes from URLSearchParams
     *
     * @param params - URLSearchParams
     */
    private parseIncludes;
    /**
     * Parse sort from URLSearchParams
     *
     * @param params - URLSearchParams
     */
    private parseSort;
    /**
     * Parse limit and page from URLSearchParams
     *
     * @param params - URLSearchParams
     */
    private parseLimitPage;
    /**
     * Parse filter groups from URLSearchParams
     *
     * @param params - URLSearchParams
     */
    private parseFilterGroups;
    /**
     * Parse optional parameters from URLSearchParams
     *
     * @param params - URLSearchParams
     */
    private parseOptional;
    /**
     * Parse a filter from URLSearchParams
     *
     * @param key - Filter key
     * @param operator - Filter operator
     * @param value - Filter value
     * @param not - Filter not
     * @returns Filter
     */
    private parseFilter;
    /**
     * Parse value from string to appropriate type
     */
    private parseValue;
    /**
     * Parse operator from string to QueryOperator enum
     */
    private parseOperator;
    /**
     * Set nested value in object using dot notation path
     *
     * @param obj - Object to set value in
     * @param path - Path like "address][city" or "name"
     * @param value - Value to set
     */
    private setNestedValue;
}

export { BrunoQuery, Filter, FilterGroup, FilterShorthand, QueryOperator, QueryParameter, Sort, SortDirection  };
