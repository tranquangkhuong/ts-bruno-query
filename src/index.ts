import { QueryOperator, SortDirection } from "./enums";
import { Filter, FilterGroup, FilterShorthand, QueryParameter, SortRule } from "./interfaces";

/**
 * Query Builder for Bruno Library in PHP
 */
export class BrunoQuery {
  /**
   * Private data for the query parameters
   *
   * @type QueryParameter
   */
  private _params: QueryParameter = {
    includes: [],
    sort: [],
    filter_groups: [],
    limit: 15,
    page: 1,
  };

  /**
   * Add includes to the query parameters
   *
   * @param includes - Array of related resources to load, e.g. ['author', 'publisher', 'publisher.books']
   * @returns `this`
   */
  addIncludes(...includes: string[]): this {
    this._params.includes.push(...includes);
    return this;
  }

  /**
   * Add sort rules to the query parameters
   *
   * @param sort - Array of sort rules, e.g. [{ key: 'name', direction: SortDirection.ASC }]
   * @returns `this`
   */
  addSort(...sort: SortRule[]): this {
    this._params.sort.push(...sort);
    return this;
  }

  /**
   * Add filter groups to the query parameters
   *
   * @param groups - Array of filter groups
   * @returns `this`
   */
  addFilterGroup(...groups: FilterGroup[]): this {
    this._params.filter_groups.push(...groups);
    return this;
  }

  /**
   * Set the limit of the query parameters
   *
   * @param limit - Limit of resources to return
   * @returns `this`
   */
  setLimit(limit: number): this {
    this._params.limit = limit;
    return this;
  }

  /**
   * Set the page number of the query parameters
   *
   * @param page - Page number
   * @returns `this`
   */
  setPage(page: number): this {
    this._params.page = page;
    return this;
  }

  /**
   * Set optional parameters
   *
   * @param optional - Optional parameters (single object or array of objects)
   * @returns `this`
   */
  setOptional(optional: Record<string, any> | Record<string, any>[]): this {
    this._params.optional = optional;
    return this;
  }

  /**
   * Reset the query parameters to their default values
   *
   * @returns `this`
   */
  reset(): this {
    this._params.includes = [];
    this._params.sort = [];
    this._params.limit = 15;
    this._params.page = 1;
    this._params.filter_groups = [];
    delete this._params.optional;

    return this;
  }

  /**
   * Clone the query parameters to a new instance
   *
   * @returns BrunoQuery
   */
  clone(): BrunoQuery {
    const clone = new BrunoQuery();
    clone._params = {
      includes: [...this._params.includes],
      sort: this._params.sort.map((s) => ({ ...s })),
      limit: this._params.limit,
      page: this._params.page,
      filter_groups: this._params.filter_groups.map((group) => ({
        or: group.or,
        filters: group.filters.map((filter: any) =>
          Array.isArray(filter) ? [...filter] : { ...filter }
        ),
      })),
      ...(this._params.optional && {
        optional: Array.isArray(this._params.optional)
          ? this._params.optional.map(obj => ({ ...obj }))
          : { ...this._params.optional }
      }),
    };

    return clone;
  }

  /**
   * Return the query parameters as an object
   *
   * @returns Record<string, any>
   */
  toObject(): Record<string, any> {
    const normalizeFilterGroups = this._params.filter_groups.map((group) => ({
      or: group.or || false,
      filters: group.filters.map((filter: any) => {
        if (Array.isArray(filter)) {
          return {
            key: filter[0],
            operator: filter[1],
            value: filter[2],
            ...(filter.length > 3 ? { not: filter[3] } : {}),
          };
        }
        return filter;
      }),
    }));

    return {
      includes: [...this._params.includes],
      sort: [...this._params.sort],
      filter_groups: normalizeFilterGroups,
      limit: this._params.limit,
      page: this._params.page,
      ...(this._params.optional && { optional: this._params.optional }),
    };
  }

  /**
   * Return the query parameters as a URL
   *
   * @param baseUrl - Base URL to append the query parameters to
   * @returns string
   */
  toURL(baseUrl: string = ""): string {
    const queryString = this.toQueryString();
    let fullUrl = `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}${queryString}`;
    fullUrl = fullUrl.replace(/&{2,}/g, "&");
    fullUrl = fullUrl.replace(/\?&/g, "?");

    return fullUrl;
  }

  /**
   * Return the query parameters as a query string
   *
   * @returns string
   */
  toQueryString(): string {
    const queryParts: string[] = [];
    this.handleIncludes(queryParts);
    this.handleSort(queryParts);
    this.handleFilterGroups(queryParts);
    this.handleLimitPage(queryParts);
    this.handleOptional(queryParts);

    return queryParts.join("&");
  }

  /**
   * Return the query parameters as a query string
   *
   * @alias {@link toQueryString}
   * @returns string
   */
  get(): string {
    return this.toQueryString();
  }

  /**
   * Handle the includes parameter
   *
   * @param queryParts - Array of query parts
   */
  private handleIncludes(queryParts: string[]): void {
    if (this._params.includes.length == 0) return;

    this._params.includes.forEach((include) => {
      queryParts.push(`includes[]=${encodeURIComponent(include)}`);
    });
  }

  /**
   * Handle the sort parameter
   *
   * @param queryParts - Array of query parts
   */
  private handleSort(queryParts: string[]): void {
    if (this._params.sort.length == 0) return;

    this._params.sort.forEach((sortRule, index) => {
      queryParts.push(`sort[${index}][key]=${encodeURIComponent(sortRule.key)}`);
      queryParts.push(`sort[${index}][direction]=${sortRule.direction}`);
    });
  }

  /**
   * Handle the limit and page parameters
   *
   * @param queryParts - Array of query parts
   */
  private handleLimitPage(queryParts: string[]): void {
    queryParts.push(`limit=${this._params.limit}`);
    queryParts.push(`page=${this._params.page}`);
  }

  /**
   * Handle the optional parameters
   *
   * @param queryParts - Array of query parts
   */
  private handleOptional(queryParts: string[]): void {
    if (!this._params.optional) return;

    if (Array.isArray(this._params.optional)) {
      // Handle array of objects with dynamic keys
      this._params.optional.forEach((optionalObj, index) => {
        Object.entries(optionalObj).forEach(([keyName, value]) => {
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // Handle nested object
            Object.entries(value).forEach(([nestedKey, nestedValue]) => {
              if (Array.isArray(nestedValue)) {
                nestedValue.forEach((v) => {
                  queryParts.push(`${keyName}[${nestedKey}][]=${encodeURIComponent(String(v))}`);
                });
              } else if (nestedValue === null) {
                queryParts.push(`${keyName}[${nestedKey}]=null`);
              } else if (typeof nestedValue === "boolean") {
                queryParts.push(`${keyName}[${nestedKey}]=${nestedValue ? "true" : "false"}`);
              } else {
                queryParts.push(`${keyName}[${nestedKey}]=${encodeURIComponent(String(nestedValue))}`);
              }
            });
          } else {
            // Handle direct value
            if (Array.isArray(value)) {
              value.forEach((v) => {
                queryParts.push(`${keyName}[${index}][]=${encodeURIComponent(String(v))}`);
              });
            } else if (value === null) {
              queryParts.push(`${keyName}[${index}]=null`);
            } else if (typeof value === "boolean") {
              queryParts.push(`${keyName}[${index}]=${value ? "true" : "false"}`);
            } else {
              queryParts.push(`${keyName}[${index}]=${encodeURIComponent(String(value))}`);
            }
          }
        });
      });
    } else {
      // Handle single object with dynamic keys
      Object.entries(this._params.optional).forEach(([keyName, value]) => {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Handle nested object
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            if (Array.isArray(nestedValue)) {
              nestedValue.forEach((v) => {
                queryParts.push(`${keyName}[${nestedKey}][]=${encodeURIComponent(String(v))}`);
              });
            } else if (nestedValue === null) {
              queryParts.push(`${keyName}[${nestedKey}]=null`);
            } else if (typeof nestedValue === "boolean") {
              queryParts.push(`${keyName}[${nestedKey}]=${nestedValue ? "true" : "false"}`);
            } else {
              queryParts.push(`${keyName}[${nestedKey}]=${encodeURIComponent(String(nestedValue))}`);
            }
          });
        } else {
          // Handle direct value
          if (Array.isArray(value)) {
            value.forEach((v) => {
              queryParts.push(`${keyName}[]=${encodeURIComponent(String(v))}`);
            });
          } else if (value === null) {
            queryParts.push(`${keyName}=null`);
          } else if (typeof value === "boolean") {
            queryParts.push(`${keyName}=${value ? "true" : "false"}`);
          } else {
            queryParts.push(`${keyName}=${encodeURIComponent(String(value))}`);
          }
        }
      });
    }
  }

  /**
   * Handle the filter groups parameter
   *
   * @param queryParts - Array of query parts
   */
  private handleFilterGroups(queryParts: string[]): void {
    if (this._params.filter_groups.length == 0) return;

    this._params.filter_groups.forEach((group, groupIndex) => {
      if (group.or) {
        queryParts.push(`filter_groups[${groupIndex}][or]=true`);
      }
      this.handleFilters(queryParts, group, groupIndex);
    });
  }

  /**
   * Handle the filters in a filter group
   *
   * @param queryParts - Array of query parts
   * @param group - Filter group
   * @param groupIndex - Index of the filter group
   */
  private handleFilters(queryParts: string[], group: FilterGroup, groupIndex: number): void {
    const filters = group.filters || [];
    filters.forEach((filter: any, filterIndex: number) => {
      const prefix = `filter_groups[${groupIndex}][filters][${filterIndex}]`;
      Object.entries(this.handleParseFilter(filter)).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => {
            // Push each value into the same key
            queryParts.push(`${prefix}[${key}][]=${encodeURIComponent(v)}`);
          });
        } else if (value === null) {
          queryParts.push(`${prefix}[${key}]=null`);
        } else if (typeof value === "boolean") {
          queryParts.push(`${prefix}[${key}]=${value ? "true" : "false"}`);
        } else {
          queryParts.push(`${prefix}[${key}]=${encodeURIComponent(value)}`);
        }
      });
    });
  }

  /**
   * Parse a filter into a Filter object
   *
   * @param filter - Filter to parse
   * @returns Filter|FilterShorthand
   */
  private handleParseFilter(filter: Filter | FilterShorthand): Filter | FilterShorthand {
    let parsedFilter: Filter | FilterShorthand;
    if (Array.isArray(filter)) {
      parsedFilter = {
        key: filter[0],
        operator: filter[1],
        value: filter[2],
        ...(filter.length > 3 ? { not: filter[3] } : {}),
      };
    } else {
      parsedFilter = filter;
    }

    return parsedFilter;
  }

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
  static build(
    filterGroups: FilterGroup[] | null = null,
    includes: string[] | null = null,
    sort: SortRule[] | null = null,
    limit: number = 15,
    page: number = 1
  ): BrunoQuery {
    const instance = new BrunoQuery();
    if (includes?.length) instance.addIncludes(...includes);
    if (sort?.length) instance.addSort(...sort);
    if (filterGroups?.length) instance.addFilterGroup(...filterGroups);
    instance.setLimit(limit).setPage(page);

    return instance;
  }

  /**
   * Parse query string and set parameters
   *
   * @alias {@link fromQueryString}
   *
   * @param queryString - Query string to parse, e.g. "includes[]=user&sort[0][key]=name&limit=15"
   * @returns `this`
   */
  static parse(queryString: string): BrunoQuery {
    return BrunoQuery.fromQueryString(queryString);
  }

  /**
   * Parse query string and set parameters
   *
   * @param queryString - Query string to parse, e.g. "includes[]=user&sort[0][key]=name&limit=15"
   * @returns `this`
   */
  static fromQueryString(queryString: string): BrunoQuery {
    const instance = new BrunoQuery();
    instance.reset();

    // Remove leading ? if present
    const cleanQuery = queryString.startsWith("?") ? queryString.slice(1) : queryString;
    if (!cleanQuery) return instance;

    // Parse query string
    const params = new URLSearchParams(cleanQuery);
    instance.parseIncludes(params);
    instance.parseSort(params);
    instance.parseLimitPage(params);
    instance.parseFilterGroups(params);
    instance.parseOptional(params);

    return instance;
  }

  /**
   * Parse includes from URLSearchParams
   *
   * @param params - URLSearchParams
   */
  private parseIncludes(params: URLSearchParams): void {
    const includes = params.getAll("includes[]");
    if (includes.length == 0) return;
    this.addIncludes(...includes);
  }

  /**
   * Parse sort from URLSearchParams
   *
   * @param params - URLSearchParams
   */
  private parseSort(params: URLSearchParams): void {
    const sortRules: SortRule[] = [];
    let sortIndex = 0;
    while (true) {
      const key = params.get(`sort[${sortIndex}][key]`);
      const direction = params.get(`sort[${sortIndex}][direction]`);
      if (!key || !direction) break;

      sortRules.push({
        key,
        direction: direction.toUpperCase() === "ASC" ? SortDirection.ASC : SortDirection.DESC,
      });
      sortIndex++;
    }
    if (sortRules.length == 0) return;
    this.addSort(...sortRules);
  }

  /**
   * Parse limit and page from URLSearchParams
   *
   * @param params - URLSearchParams
   */
  private parseLimitPage(params: URLSearchParams): void {
    const limit = params.get("limit");
    if (limit) {
      this.setLimit(parseInt(limit, 10));
    }

    const page = params.get("page");
    if (page) {
      this.setPage(parseInt(page, 10));
    }
  }

  /**
   * Parse filter groups from URLSearchParams
   *
   * @param params - URLSearchParams
   */
  private parseFilterGroups(params: URLSearchParams): void {
    const filterGroups: FilterGroup[] = [];
    let groupIndex = 0;

    while (true) {
      const or = params.get(`filter_groups[${groupIndex}][or]`);
      const filters: Filter[] = [];
      let filterIndex = 0;

      while (true) {
        const prefix = `filter_groups[${groupIndex}][filters][${filterIndex}]`;
        const key = params.get(`${prefix}[key]`);
        const operator = params.get(`${prefix}[operator]`);
        const value = params.get(`${prefix}[value]`);
        const not = params.get(`${prefix}[not]`);

        if (!key || !operator) break;

        filters.push(this.parseFilter(key, operator, value, not));
        filterIndex++;
      }

      if (filters.length === 0) break;

      filterGroups.push({
        or: or === "true",
        filters,
      });

      groupIndex++;
    }

    if (filterGroups.length) {
      this.addFilterGroup(...filterGroups);
    }
  }

  /**
   * Parse optional parameters from URLSearchParams
   *
   * @param params - URLSearchParams
   */
  private parseOptional(params: URLSearchParams): void {
    const optionalParams: Record<string, any> = {};
    const optionalArray: Record<string, any>[] = [];

    // Get all keys that don't start with known prefixes
    const knownPrefixes = ['includes', 'sort', 'limit', 'page', 'filter_groups'];
    const optionalKeys = Array.from(params.keys()).filter(key => {
      const prefix = key.split('[')[0];
      return !knownPrefixes.includes(prefix);
    });

    // Group keys by their root key
    const keyGroups: Record<string, string[]> = {};
    optionalKeys.forEach(key => {
      const rootKey = key.split('[')[0];
      if (!keyGroups[rootKey]) {
        keyGroups[rootKey] = [];
      }
      keyGroups[rootKey].push(key);
    });

    // Process each root key
    Object.entries(keyGroups).forEach(([rootKey, keys]) => {
      const rootObj: Record<string, any> = {};
      let hasIndexedKeys = false;

      // Check if this root key has indexed parameters (array format)
      const indexedKeys = keys.filter(key => key.match(new RegExp(`^${rootKey}\\[\\d+\\]`)));
      if (indexedKeys.length > 0) {
        hasIndexedKeys = true;
        // Handle array format
        const arrayObj: Record<string, any> = {};
        indexedKeys.forEach(key => {
          const match = key.match(new RegExp(`^${rootKey}\\[(\\d+)\\]\\[([^\\]]+)\\]`));
          if (match) {
            const [, index, nestedKey] = match;
            const value = params.get(key);
            if (!arrayObj[nestedKey]) {
              arrayObj[nestedKey] = [];
            }
            if (value !== null) {
              arrayObj[nestedKey].push(this.parseValue(value));
            }
          }
        });
        rootObj[rootKey] = arrayObj;
      } else {
        // Handle single object format
        keys.forEach(key => {
          const match = key.match(new RegExp(`^${rootKey}\\[([^\\]]+)\\]`));
          if (match) {
            const [, nestedKey] = match;
            const value = params.get(key);
            if (!rootObj[rootKey]) {
              rootObj[rootKey] = {};
            }
            rootObj[rootKey][nestedKey] = this.parseValue(value);
          } else if (key === rootKey) {
            // Direct value without nested key
            const value = params.get(key);
            rootObj[rootKey] = this.parseValue(value);
          }
        });
      }

      if (Object.keys(rootObj).length > 0) {
        if (hasIndexedKeys) {
          optionalArray.push(rootObj);
        } else {
          Object.assign(optionalParams, rootObj);
        }
      }
    });

    // Set the appropriate optional parameters
    if (optionalArray.length > 0) {
      this.setOptional(optionalArray);
    } else if (Object.keys(optionalParams).length > 0) {
      this.setOptional(optionalParams);
    }
  }

  /**
   * Parse a filter from URLSearchParams
   *
   * @param key - Filter key
   * @param operator - Filter operator
   * @param value - Filter value
   * @param not - Filter not
   * @returns Filter
   */
  private parseFilter(
    key: string,
    operator: string | null,
    value: string | null,
    not: string | null
  ): Filter {
    const filter: Filter = {
      key,
      operator: this.parseOperator(operator),
      value: this.parseValue(value),
      ...(not === "true" && { not: true }),
    };

    return filter;
  }

  /**
   * Parse value from string to appropriate type
   */
  private parseValue(value: string | null): any {
    if (value === null) return null;
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "null") return null;

    // Try to parse as number
    const num = parseFloat(value);
    if (!isNaN(num) && value !== "") return num;

    return value;
  }

  /**
   * Parse operator from string to QueryOperator enum
   */
  private parseOperator(operator: string | null): QueryOperator {
    if (!operator) return QueryOperator.equals;

    // Map string operators to enum values
    const operatorMap: Record<string, QueryOperator> = {
      ct: QueryOperator.contains,
      sw: QueryOperator.startsWith,
      ew: QueryOperator.endsWith,
      eq: QueryOperator.equals,
      gt: QueryOperator.greaterThan,
      gte: QueryOperator.greaterThanOrEqual,
      lt: QueryOperator.lessThan,
      lte: QueryOperator.lessThanOrEqual,
      in: QueryOperator.in,
      bt: QueryOperator.between,
    };

    return operatorMap[operator] || QueryOperator.equals;
  }
}
