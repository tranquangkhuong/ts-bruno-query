import { QueryOperator, SortDirection } from './enum';
import {
  Filter,
  FilterGroup,
  FilterShorthand,
  QueryParameter,
  SortRule,
} from './interface';

// Re-export enums and interfaces for external use
export * from './interface';
export * from './enum';

/**
 * Query Builder for Bruno Library in PHP
 *
 * @see {@link https://github.com/esbenp/bruno}
 */
export class BrunoQuery {
  public static readonly DEFAULT_LIMIT = 15;
  public static readonly DEFAULT_PAGE = 1;

  /**
   * Private data for the query parameters
   *
   * @type QueryParameter
   * @see {@link QueryParameter}
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
   * @param includes - Related resources to load. E.g. `'author', 'publisher', 'publisher.books'`
   * @returns `this`
   */
  addIncludes(...includes: string[]): this {
    return this.addArrayIncludes(includes);
  }

  /**
   * Add includes to the query parameters from array
   *
   * @param includes - Array of related resources to load. E.g. `['author', 'publisher', 'publisher.books']`
   * @returns `this`
   */
  addArrayIncludes(includes: string[]): this {
    this._params.includes.push(...includes);
    return this;
  }

  /**
   * Set includes to the query parameters (replace existing)
   *
   * @param includes - Related resources to load. E.g. `'author', 'publisher', 'publisher.books'`
   * @returns `this`
   */
  setIncludes(...includes: string[]): this {
    return this.setArrayIncludes(includes);
  }

  /**
   * Set includes to the query parameters from array (replace existing)
   *
   * @param includes - Array of related resources to load. E.g. `['author', 'publisher', 'publisher.books']`
   * @returns `this`
   */
  setArrayIncludes(includes: string[]): this {
    this._params.includes = [...includes];
    return this;
  }

  /**
   * Add sort rules to the query parameters
   *
   * @param sort - Sort rules. E.g. `{ key: 'name', direction: SortDirection.ASC }`
   * @returns `this`
   * @see {@link SortRule}
   */
  addSort(...sort: SortRule[]): this {
    return this.addArraySort(sort);
  }

  /**
   * Add sort rules to the query parameters from array
   *
   * @param sort - Array of sort rules. E.g. `[{ key: 'name', direction: SortDirection.ASC }]`
   * @returns `this`
   * @see {@link SortRule}
   */
  addArraySort(sort: SortRule[]): this {
    this._params.sort.push(...sort);
    return this;
  }

  /**
   * Set sort rules to the query parameters (replace existing)
   *
   * @param sort - Sort rules. E.g. `{ key: 'name', direction: SortDirection.ASC }`
   * @returns `this`
   * @see {@link SortRule}
   */
  setSort(...sort: SortRule[]): this {
    return this.setArraySort(sort);
  }

  /**
   * Set sort rules to the query parameters from array (replace existing)
   *
   * @param sort - Array of sort rules. E.g. `[{ key: 'name', direction: SortDirection.ASC }]`
   * @returns `this`
   * @see {@link SortRule}
   */
  setArraySort(sort: SortRule[]): this {
    this._params.sort = [...sort];
    return this;
  }

  /**
   * Add filter groups to the query parameters
   *
   * @param groups - Filter groups. E.g. `{ or: false, filters: [{ key: 'name', value: 'Optimus', operator: 'sw' }] }`
   * @returns `this`
   * @see {@link FilterGroup}
   */
  addFilterGroup(...groups: FilterGroup[]): this {
    return this.addArrayFilterGroup(groups);
  }

  /**
   * Add filter groups to the query parameters from array
   *
   * @param groups - Array of filter groups. E.g. `[{ or: false, filters: [{ key: 'name', value: 'Optimus', operator: 'sw' }] }]`
   * @returns `this`
   * @see {@link FilterGroup}
   */
  addArrayFilterGroup(groups: FilterGroup[]): this {
    this._params.filter_groups.push(...groups);
    return this;
  }

  /**
   * Set filter groups to the query parameters (replace existing)
   *
   * @param groups - Filter groups. E.g. `{ or: false, filters: [{ key: 'name', value: 'Optimus', operator: 'sw' }] }`
   * @returns `this`
   * @see {@link FilterGroup}
   */
  setFilterGroup(...groups: FilterGroup[]): this {
    return this.setArrayFilterGroup(groups);
  }

  /**
   * Set filter groups to the query parameters from array (replace existing)
   *
   * @param groups - Array of filter groups. E.g. `[{ or: false, filters: [{ key: 'name', value: 'Optimus', operator: 'sw' }] }]`
   * @returns `this`
   * @see {@link FilterGroup}
   */
  setArrayFilterGroup(groups: FilterGroup[]): this {
    this._params.filter_groups = [...groups];
    return this;
  }

  /**
   * Set the limit of the query parameters
   *
   * @param limit - Limit of resources to return
   * @returns `this`
   */
  setLimit(limit: number): this {
    this._params.limit = limit < 0 ? BrunoQuery.DEFAULT_LIMIT : limit;
    return this;
  }

  /**
   * Set the page number of the query parameters
   *
   * @param page - Page number
   * @returns `this`
   */
  setPage(page: number): this {
    this._params.page = page < 0 ? BrunoQuery.DEFAULT_PAGE : page;
    return this;
  }

  /**
   * Set optional parameters that are not available in BrunoQuery
   *
   * @param optional - Optional parameters (single object or array of objects)
   * @returns `this`
   * @see {@link Record}
   */
  setOptional(optional: Record<string, any> | Record<string, any>[]): this {
    this._params.optional = optional;
    return this;
  }

  /**
   * Add optional parameters to existing optional parameters
   *
   * @param optional - Optional parameters to add (single object or array of objects)
   * @returns `this`
   * @see {@link Record}
   */
  addOptional(optional: Record<string, any> | Record<string, any>[]): this {
    if (!this._params.optional) {
      // If no existing optional, just set it
      this._params.optional = optional;
    } else if (
      Array.isArray(this._params.optional) &&
      Array.isArray(optional)
    ) {
      // Both are arrays, merge them
      this._params.optional.push(...optional);
    } else if (
      Array.isArray(this._params.optional) &&
      !Array.isArray(optional)
    ) {
      // Existing is array, new is object, add to array
      this._params.optional.push(optional);
    } else if (
      !Array.isArray(this._params.optional) &&
      Array.isArray(optional)
    ) {
      // Existing is object, new is array, convert to array
      this._params.optional = [this._params.optional, ...optional];
    } else {
      // Both are objects, merge them
      this._params.optional = { ...this._params.optional, ...optional };
    }
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
    this._params.limit = BrunoQuery.DEFAULT_LIMIT;
    this._params.page = BrunoQuery.DEFAULT_PAGE;
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
      sort: this._params.sort.map((s: SortRule) => ({ ...s })),
      limit: this._params.limit,
      page: this._params.page,
      filter_groups: this._params.filter_groups.map((group: FilterGroup) => ({
        or: group.or || false,
        filters: group.filters
          ? group.filters.map((filter: any) =>
              Array.isArray(filter) ? [...filter] : { ...filter }
            )
          : [],
      })),
      ...(this._params.optional && {
        optional: Array.isArray(this._params.optional)
          ? this._params.optional.map((obj) => ({ ...obj }))
          : { ...this._params.optional },
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
    const normalizeFilterGroups = this._params.filter_groups.map(
      (group: FilterGroup) => ({
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
      })
    );

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
  toURL(baseUrl: string = ''): string {
    const queryString = this.toQueryString();
    let fullUrl = `${baseUrl}${
      baseUrl.includes('?') ? '&' : '?'
    }${queryString}`;
    fullUrl = fullUrl.replace(/&{2,}/g, '&');
    fullUrl = fullUrl.replace(/\?&/g, '?');

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

    return queryParts.join('&');
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
    if (this._params.includes.length === 0) return;

    this._params.includes.forEach((include: string): void => {
      queryParts.push(`includes[]=${encodeURIComponent(include)}`);
    });
  }

  /**
   * Handle the sort parameter
   *
   * @param queryParts - Array of query parts
   */
  private handleSort(queryParts: string[]): void {
    if (this._params.sort.length === 0) return;

    this._params.sort.forEach((sortRule: SortRule, index: number): void => {
      const key = `sort[${index}][key]=${encodeURIComponent(sortRule.key)}`;
      const direction = `sort[${index}][direction]=${sortRule.direction}`;
      queryParts.push(key, direction);
    });
  }

  /**
   * Handle the limit and page parameters
   *
   * @param queryParts - Array of query parts
   */
  private handleLimitPage(queryParts: string[]): void {
    queryParts.push(`limit=${this._params.limit}`, `page=${this._params.page}`);
  }

  /**
   * Handle the filter groups parameter
   *
   * @param queryParts - Array of query parts
   */
  private handleFilterGroups(queryParts: string[]): void {
    if (this._params.filter_groups.length === 0) return;

    this._params.filter_groups.forEach(
      (group: FilterGroup, groupIndex: number): void => {
        if (group.or) {
          queryParts.push(`filter_groups[${groupIndex}][or]=true`);
        }
        this.handleFilters(queryParts, group, groupIndex);
      }
    );
  }

  /**
   * Handle the filters in a filter group
   *
   * @param queryParts - Array of query parts
   * @param group - Filter group
   * @param groupIndex - Index of the filter group
   */
  private handleFilters(
    queryParts: string[],
    group: FilterGroup,
    groupIndex: number
  ): void {
    const filters = group.filters || [];
    filters.forEach((filter: any, filterIndex: number) => {
      const prefix = `filter_groups[${groupIndex}][filters][${filterIndex}]`;
      const parsedFilter = this.handleParseFilter(filter);
      Object.keys(parsedFilter).forEach((key: string): void => {
        const value = (parsedFilter as any)[key];
        this.handleValue(queryParts, `${prefix}[${key}]`, value, filterIndex);
      });
    });
  }

  /**
   * Parse a filter into a Filter object
   *
   * @param filter - Filter to parse
   * @returns Filter|FilterShorthand
   */
  private handleParseFilter(
    filter: Filter | FilterShorthand
  ): Filter | FilterShorthand {
    let parsed: Filter | FilterShorthand;
    if (Array.isArray(filter)) {
      parsed = {
        key: filter[0],
        operator: filter[1],
        value: filter[2],
        ...(filter.length > 3 ? { not: filter[3] } : {}),
      };
    } else {
      parsed = filter;
    }

    return parsed;
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
      this._params.optional.forEach((optionalObj: any, index: number): void => {
        this.handleOptionalObject(queryParts, optionalObj, index);
      });
    } else {
      this.handleOptionalObject(queryParts, this._params.optional, 0);
    }
  }

  /**
   * Handle single optional object with dynamic keys
   *
   * @param queryParts - Array of query parts
   * @param optionalObj - Optional object
   * @param index - Index of the optional object
   */
  private handleOptionalObject(
    queryParts: string[],
    optionalObj: Record<string, any>,
    index: number
  ): void {
    Object.keys(optionalObj).forEach((keyName: string): void => {
      const value = (optionalObj as any)[keyName];
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        // Handle nested object
        Object.keys(value).forEach((nestedKey: string): void => {
          const nestedValue = (value as any)[nestedKey];
          this.handleValue(
            queryParts,
            `${keyName}[${nestedKey}]`,
            nestedValue,
            index
          );
        });
      } else {
        // Handle direct value
        this.handleValue(queryParts, keyName, value, index);
      }
    });
  }

  /**
   * Handle push key and value into query parts
   *
   * @param queryParts - Array of query parts
   * @param keyName - Key name
   * @param value - Value
   * @param index - Index of the filter
   */
  private handleValue(
    queryParts: string[],
    keyName: string,
    value: any,
    index: number
  ): void {
    if (Array.isArray(value)) {
      value.forEach((v: string | number | boolean | null): void => {
        // Push each value into the same key
        let val = v === null ? 'null' : v;
        queryParts.push(`${keyName}[]=${encodeURIComponent(String(val))}`);
      });
    } else if (value === null) {
      queryParts.push(`${keyName}=null`);
    } else if (typeof value === 'boolean') {
      queryParts.push(`${keyName}=${value ? 'true' : 'false'}`);
    } else {
      let val = value === null ? 'null' : value;
      queryParts.push(`${keyName}=${encodeURIComponent(val)}`);
    }
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
    limit: number = BrunoQuery.DEFAULT_LIMIT,
    page: number = BrunoQuery.DEFAULT_PAGE
  ): BrunoQuery {
    const instance = new BrunoQuery();
    instance.setLimit(limit).setPage(page);
    if (includes && includes.length) instance.addArrayIncludes(includes);
    if (sort && sort.length) instance.addArraySort(sort);
    if (filterGroups && filterGroups.length)
      instance.addArrayFilterGroup(filterGroups);

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
    const cleanQuery = queryString.startsWith('?')
      ? queryString.slice(1)
      : queryString;
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
    const includes = params.getAll('includes[]');
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
        direction:
          direction.toUpperCase() === 'ASC'
            ? SortDirection.ASC
            : SortDirection.DESC,
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
    const limit = params.get('limit');
    if (limit) {
      this.setLimit(parseInt(limit, 10));
    }

    const page = params.get('page');
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
    const groupMap: Record<number, Record<number, any>> = {};

    // Tìm tất cả các filter groups và filters
    // Convert URLSearchParams to array for ES5 compatibility
    const paramArray: Array<{ key: string; value: string }> = [];
    // Use iterator for URLSearchParams
    const entries = params.toString().split('&');
    entries.forEach((entry: string): void => {
      if (entry) {
        const [key, value] = entry.split('=');
        paramArray.push({
          key: decodeURIComponent(key),
          value: decodeURIComponent(value || ''),
        });
      }
    });
    paramArray.forEach((param: { key: string; value: string }): void => {
      const value = param.value;
      const key = param.key;
      // Match pattern: filter_groups[groupIndex][filters][filterIndex][property]
      const match = key.match(
        /^filter_groups\[(\d+)\]\[filters\]\[(\d+)\]\[([^\]]+)\]$/
      );
      if (match) {
        const [, groupIndexStr, filterIndexStr, property] = match;
        const groupIndex = parseInt(groupIndexStr, 10);
        const filterIndex = parseInt(filterIndexStr, 10);

        if (!groupMap[groupIndex]) {
          groupMap[groupIndex] = {};
        }

        if (!groupMap[groupIndex][filterIndex]) {
          groupMap[groupIndex][filterIndex] = {};
        }

        // Cập nhật property cho filter
        groupMap[groupIndex][filterIndex][property] = value;
      }
    });

    // Chuyển đổi thành FilterGroup objects và sắp xếp theo group index
    const sortedGroupEntries = Object.keys(groupMap)
      .map((key) => [key, groupMap[parseInt(key, 10)]])
      .sort(([a], [b]): number => {
        return parseInt(a as string, 10) - parseInt(b as string, 10);
      });

    sortedGroupEntries.forEach(([groupIndexStr, filtersMap]): void => {
      const groupIndex = parseInt(groupIndexStr as string, 10);
      const validFilters: Filter[] = [];

      // Sắp xếp filters theo filter index
      const sortedFilterEntries = Object.keys(filtersMap as Record<number, any>)
        .map((key) => [
          key,
          (filtersMap as Record<number, any>)[parseInt(key, 10)],
        ])
        .sort(([a], [b]): number => {
          return parseInt(a as string, 10) - parseInt(b as string, 10);
        });

      // Lọc ra các filter hợp lệ (có key và operator)
      sortedFilterEntries.forEach(([filterIndexStr, filter]): void => {
        if (filter.key && filter.operator) {
          validFilters.push(
            this.parseFilter(
              filter.key,
              filter.operator,
              filter.value,
              filter.not
            )
          );
        }
      });

      if (validFilters.length > 0) {
        const or = params.get(`filter_groups[${groupIndex}][or]`) === 'true';
        filterGroups.push({
          or,
          filters: validFilters,
        });
      }
    });

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
    const knownPrefixes = [
      'includes',
      'sort',
      'limit',
      'page',
      'filter_groups',
    ];
    const optionalKeys: string[] = [];
    // Use iterator for URLSearchParams
    const entries = params.toString().split('&');
    entries.forEach((entry: string): void => {
      if (entry) {
        const [key] = entry.split('=');
        const decodedKey = decodeURIComponent(key);
        const prefix = decodedKey.split('[')[0];
        if (knownPrefixes.indexOf(prefix) === -1) {
          optionalKeys.push(decodedKey);
        }
      }
    });

    // Group keys by their root key
    const keyGroups: Record<string, string[]> = {};
    optionalKeys.forEach((key: string): void => {
      const rootKey = key.split('[')[0];
      if (!keyGroups[rootKey]) {
        keyGroups[rootKey] = [];
      }
      keyGroups[rootKey].push(key);
    });

    // Process each root key
    Object.keys(keyGroups).forEach((rootKey: string): void => {
      const keys = keyGroups[rootKey];
      // Check if this is a simple key=value pair (no brackets)
      const simpleKeys = keys.filter((key): boolean => key === rootKey);
      if (simpleKeys.length > 0) {
        // Handle simple key=value pairs
        const value = params.get(rootKey);
        if (value !== null) {
          optionalParams[rootKey] = this.parseValue(value);
        }
        return;
      }

      // Check if this root key has indexed parameters (array format)
      const indexedKeys = keys.filter(
        (key): boolean => !!key.match(new RegExp(`^${rootKey}\\[\\d+\\]`))
      );

      if (indexedKeys.length > 0) {
        // Handle array format like optional[0][key]=name&optional[0][value]=John
        const arrayObj: Record<string, any> = {};
        const indexMap: Record<number, Record<string, any>> = {};

        indexedKeys.forEach((key: string): void => {
          const match = key.match(
            new RegExp(`^${rootKey}\\[(\\d+)\\]\\[([^\\]]+)\\]`)
          );
          if (match) {
            const [, indexStr, nestedKey] = match;
            const index = parseInt(indexStr, 10);
            const value = params.get(key);

            if (!indexMap[index]) {
              indexMap[index] = {};
            }
            if (value !== null) {
              indexMap[index][nestedKey] = this.parseValue(value);
            }
          }
        });

        // Convert index map to array
        const sortedIndices = Object.keys(indexMap)
          .map(Number)
          .sort((a, b) => a - b);

        sortedIndices.forEach((index: number): void => {
          const obj = indexMap[index];
          if (obj.key && obj.value !== undefined) {
            // Special case: if we have key-value pairs, create a simple object
            arrayObj[obj.key] = obj.value;
          } else {
            // General case: use the nested structure
            Object.assign(arrayObj, obj);
          }
        });

        if (Object.keys(arrayObj).length > 0) {
          optionalArray.push({ [rootKey]: arrayObj });
        }
      } else {
        // Handle single object format like user[name]=John&user[age]=30 or user[address][city]=Hanoi
        const rootObj: Record<string, any> = {};
        keys.forEach((key: string): void => {
          // Match pattern like user[name] or user[address][city]
          const match = key.match(new RegExp(`^${rootKey}\\[(.+)\\]$`));
          if (match) {
            const [, nestedPath] = match;
            const value = params.get(key);
            if (value !== null) {
              // Handle nested path like "address][city"
              this.setNestedValue(rootObj, nestedPath, this.parseValue(value));
            }
          }
        });

        if (Object.keys(rootObj).length > 0) {
          optionalParams[rootKey] = rootObj;
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
      ...(not === 'true' && { not: true }),
    };

    return filter;
  }

  /**
   * Parse value from string to appropriate type
   */
  private parseValue(value: string | null): any {
    if (value === null || value === 'null') return null;
    if (value === 'true') return true;
    if (value === 'false') return false;

    // Try to parse as number
    const num = parseFloat(value);
    if (!isNaN(num) && value !== '') return num;

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

  /**
   * Set nested value in object using dot notation path
   *
   * @param obj - Object to set value in
   * @param path - Path like "address][city" or "name"
   * @param value - Value to set
   */
  private setNestedValue(
    obj: Record<string, any>,
    path: string,
    value: any
  ): void {
    // Handle paths like "address][city" by splitting on "]["
    const keys = path.split('][');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;
  }
}
