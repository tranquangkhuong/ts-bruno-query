import { SortRule, FilterGroup } from './interfaces.js';
import './enums.js';

/**
 * Query Builder for Bruno Library in PHP
 */
declare class BrunoQuery {
    /**
     * Private data for the query parameters
     *
     * @type QueryParameter
     */
    private _params;
    /**
     * Add includes to the query parameters
     *
     * @param includes - Array of related resources to load, e.g. ['author', 'publisher', 'publisher.books']
     * @returns `this`
     */
    addIncludes(...includes: string[]): this;
    /**
     * Add sort rules to the query parameters
     *
     * @param sort - Array of sort rules, e.g. [{ key: 'name', direction: SortDirection.ASC }]
     * @returns `this`
     */
    addSort(...sort: SortRule[]): this;
    /**
     * Add filter groups to the query parameters
     *
     * @param groups - Array of filter groups
     * @returns `this`
     */
    addFilterGroup(...groups: FilterGroup[]): this;
    /**
     * Set the limit of the query parameters
     *
     * @param limit - Limit of resources to return
     * @returns `this`
     */
    setLimit(limit: number): this;
    /**
     * Set the page number of the query parameters
     *
     * @param page - Page number
     * @returns `this`
     */
    setPage(page: number): this;
    /**
     * Set optional parameters
     *
     * @param optional - Optional parameters (single object or array of objects)
     * @returns `this`
     */
    setOptional(optional: Record<string, any> | Record<string, any>[]): this;
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
     * Handle the optional parameters
     *
     * @param queryParts - Array of query parts
     */
    private handleOptional;
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
     * Build a new BrunoQuery instance
     *
     * @param filterGroups - Filter groups
     * @param includes - Includes
     * @param sort - Sort rules
     * @param limit - Limit of resources to return
     * @param page - Page number
     * @returns BrunoQuery
     */
    static build(filterGroups?: FilterGroup[] | null, includes?: string[] | null, sort?: SortRule[] | null, limit?: number, page?: number): BrunoQuery;
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
}

export { BrunoQuery };
