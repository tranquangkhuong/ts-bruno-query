// src/index.ts
var BrunoQuery = class _BrunoQuery {
  /**
   * Private data for the query parameters
   *
   * @type QueryParameter
   */
  _params = {
    includes: [],
    sort: [],
    filter_groups: [],
    limit: 15,
    page: 1
  };
  /**
   * Add includes to the query parameters
   *
   * @param includes - Array of related resources to load, e.g. ['author', 'publisher', 'publisher.books']
   * @returns `this`
   */
  addIncludes(...includes) {
    this._params.includes.push(...includes);
    return this;
  }
  /**
   * Add sort rules to the query parameters
   *
   * @param sort - Array of sort rules, e.g. [{ key: 'name', direction: SortDirection.ASC }]
   * @returns `this`
   */
  addSort(...sort) {
    this._params.sort.push(...sort);
    return this;
  }
  /**
   * Add filter groups to the query parameters
   *
   * @param groups - Array of filter groups
   * @returns `this`
   */
  addFilterGroup(...groups) {
    this._params.filter_groups.push(...groups);
    return this;
  }
  /**
   * Set the limit of the query parameters
   *
   * @param limit - Limit of resources to return
   * @returns `this`
   */
  setLimit(limit) {
    this._params.limit = limit;
    return this;
  }
  /**
   * Set the page number of the query parameters
   *
   * @param page - Page number
   * @returns `this`
   */
  setPage(page) {
    this._params.page = page;
    return this;
  }
  /**
   * Set optional parameters
   *
   * @param optional - Optional parameters (single object or array of objects)
   * @returns `this`
   */
  setOptional(optional) {
    this._params.optional = optional;
    return this;
  }
  /**
   * Reset the query parameters to their default values
   *
   * @returns `this`
   */
  reset() {
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
  clone() {
    const clone = new _BrunoQuery();
    clone._params = {
      includes: [...this._params.includes],
      sort: this._params.sort.map((s) => ({ ...s })),
      limit: this._params.limit,
      page: this._params.page,
      filter_groups: this._params.filter_groups.map((group) => ({
        or: group.or,
        filters: group.filters.map(
          (filter) => Array.isArray(filter) ? [...filter] : { ...filter }
        )
      })),
      ...this._params.optional && {
        optional: Array.isArray(this._params.optional) ? this._params.optional.map((obj) => ({ ...obj })) : { ...this._params.optional }
      }
    };
    return clone;
  }
  /**
   * Return the query parameters as an object
   *
   * @returns Record<string, any>
   */
  toObject() {
    const normalizeFilterGroups = this._params.filter_groups.map((group) => ({
      or: group.or || false,
      filters: group.filters.map((filter) => {
        if (Array.isArray(filter)) {
          return {
            key: filter[0],
            operator: filter[1],
            value: filter[2],
            ...filter.length > 3 ? { not: filter[3] } : {}
          };
        }
        return filter;
      })
    }));
    return {
      includes: [...this._params.includes],
      sort: [...this._params.sort],
      filter_groups: normalizeFilterGroups,
      limit: this._params.limit,
      page: this._params.page,
      ...this._params.optional && { optional: this._params.optional }
    };
  }
  /**
   * Return the query parameters as a URL
   *
   * @param baseUrl - Base URL to append the query parameters to
   * @returns string
   */
  toURL(baseUrl = "") {
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
  toQueryString() {
    const queryParts = [];
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
  get() {
    return this.toQueryString();
  }
  /**
   * Handle the includes parameter
   *
   * @param queryParts - Array of query parts
   */
  handleIncludes(queryParts) {
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
  handleSort(queryParts) {
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
  handleLimitPage(queryParts) {
    queryParts.push(`limit=${this._params.limit}`);
    queryParts.push(`page=${this._params.page}`);
  }
  /**
   * Handle the optional parameters
   *
   * @param queryParts - Array of query parts
   */
  handleOptional(queryParts) {
    if (!this._params.optional) return;
    if (Array.isArray(this._params.optional)) {
      this._params.optional.forEach((optionalObj, index) => {
        Object.entries(optionalObj).forEach(([keyName, value]) => {
          if (typeof value === "object" && value !== null && !Array.isArray(value)) {
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
      Object.entries(this._params.optional).forEach(([keyName, value]) => {
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
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
  handleFilterGroups(queryParts) {
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
  handleFilters(queryParts, group, groupIndex) {
    const filters = group.filters || [];
    filters.forEach((filter, filterIndex) => {
      const prefix = `filter_groups[${groupIndex}][filters][${filterIndex}]`;
      Object.entries(this.handleParseFilter(filter)).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => {
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
  handleParseFilter(filter) {
    let parsedFilter;
    if (Array.isArray(filter)) {
      parsedFilter = {
        key: filter[0],
        operator: filter[1],
        value: filter[2],
        ...filter.length > 3 ? { not: filter[3] } : {}
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
  static build(filterGroups = null, includes = null, sort = null, limit = 15, page = 1) {
    const instance = new _BrunoQuery();
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
  static parse(queryString) {
    return _BrunoQuery.fromQueryString(queryString);
  }
  /**
   * Parse query string and set parameters
   *
   * @param queryString - Query string to parse, e.g. "includes[]=user&sort[0][key]=name&limit=15"
   * @returns `this`
   */
  static fromQueryString(queryString) {
    const instance = new _BrunoQuery();
    instance.reset();
    const cleanQuery = queryString.startsWith("?") ? queryString.slice(1) : queryString;
    if (!cleanQuery) return instance;
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
  parseIncludes(params) {
    const includes = params.getAll("includes[]");
    if (includes.length == 0) return;
    this.addIncludes(...includes);
  }
  /**
   * Parse sort from URLSearchParams
   *
   * @param params - URLSearchParams
   */
  parseSort(params) {
    const sortRules = [];
    let sortIndex = 0;
    while (true) {
      const key = params.get(`sort[${sortIndex}][key]`);
      const direction = params.get(`sort[${sortIndex}][direction]`);
      if (!key || !direction) break;
      sortRules.push({
        key,
        direction: direction.toUpperCase() === "ASC" ? "ASC" /* ASC */ : "DESC" /* DESC */
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
  parseLimitPage(params) {
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
  parseFilterGroups(params) {
    const filterGroups = [];
    let groupIndex = 0;
    while (true) {
      const or = params.get(`filter_groups[${groupIndex}][or]`);
      const filters = [];
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
        filters
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
  parseOptional(params) {
    const optionalParams = {};
    const optionalArray = [];
    const knownPrefixes = ["includes", "sort", "limit", "page", "filter_groups"];
    const optionalKeys = Array.from(params.keys()).filter((key) => {
      const prefix = key.split("[")[0];
      return !knownPrefixes.includes(prefix);
    });
    const keyGroups = {};
    optionalKeys.forEach((key) => {
      const rootKey = key.split("[")[0];
      if (!keyGroups[rootKey]) {
        keyGroups[rootKey] = [];
      }
      keyGroups[rootKey].push(key);
    });
    Object.entries(keyGroups).forEach(([rootKey, keys]) => {
      const rootObj = {};
      let hasIndexedKeys = false;
      const indexedKeys = keys.filter((key) => key.match(new RegExp(`^${rootKey}\\[\\d+\\]`)));
      if (indexedKeys.length > 0) {
        hasIndexedKeys = true;
        const arrayObj = {};
        indexedKeys.forEach((key) => {
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
        keys.forEach((key) => {
          const match = key.match(new RegExp(`^${rootKey}\\[([^\\]]+)\\]`));
          if (match) {
            const [, nestedKey] = match;
            const value = params.get(key);
            if (!rootObj[rootKey]) {
              rootObj[rootKey] = {};
            }
            rootObj[rootKey][nestedKey] = this.parseValue(value);
          } else if (key === rootKey) {
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
  parseFilter(key, operator, value, not) {
    const filter = {
      key,
      operator: this.parseOperator(operator),
      value: this.parseValue(value),
      ...not === "true" && { not: true }
    };
    return filter;
  }
  /**
   * Parse value from string to appropriate type
   */
  parseValue(value) {
    if (value === null) return null;
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "null") return null;
    const num = parseFloat(value);
    if (!isNaN(num) && value !== "") return num;
    return value;
  }
  /**
   * Parse operator from string to QueryOperator enum
   */
  parseOperator(operator) {
    if (!operator) return "eq" /* equals */;
    const operatorMap = {
      ct: "ct" /* contains */,
      sw: "sw" /* startsWith */,
      ew: "ew" /* endsWith */,
      eq: "eq" /* equals */,
      gt: "gt" /* greaterThan */,
      gte: "gte" /* greaterThanOrEqual */,
      lt: "lt" /* lessThan */,
      lte: "lte" /* lessThanOrEqual */,
      in: "in" /* in */,
      bt: "bt" /* between */
    };
    return operatorMap[operator] || "eq" /* equals */;
  }
};
export {
  BrunoQuery
};
