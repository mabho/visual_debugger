/**
 * Fills a theme element.
 */
Drupal.themeElement = {

  // The object properties.
  activated: false,
  propertyHook: null,
  objectType: null,
  suggestions: null,
  filePath: null,
  dataNode: null,
  cacheHit: false,
  cacheTags: null,
  cacheContexts: null,
  cacheKeys: null,
  cacheMaxAge: 0,
  preBubblingCacheTags: null,
  preBubblingCacheContexts: null,
  preBubblingCacheKeys: null,
  preBubblingCacheMaxAge: 0,
  renderingTime: 0,

  // Store the initial state.
  initialState: null,

  // Initialize the object.
  init: function() {
    // Store the initial state.
    this.initialState = {
      activated: this.activated,
      propertyHook: this.propertyHook,
      objectType: this.objectType,
      suggestions: this.suggestions,
      filePath: this.filePath,
      dataNode: this.dataNode,
      cacheHit: this.cacheHit,
      cacheTags: this.cacheTags,
      cacheContexts: this.cacheContexts,
      cacheKeys: this.cacheKeys,
      cacheMaxAge: this.cacheMaxAge,
      preBubblingCacheTags: this.preBubblingCacheTags,
      preBubblingCacheContexts: this.preBubblingCacheContexts,
      preBubblingCacheKeys: this.preBubblingCacheKeys,
      preBubblingCacheMaxAge: this.preBubblingCacheMaxAge,
      renderingTime: this.renderingTime,
    };
  },

  // Setter methods.
  setActivated() {
    this.activated = true;
  },

  setPropertyHook(input) {
    this.propertyHook = input;
  },

  setCacheHit(input) {
    this.cacheHit = input;
  },

  setCacheTags(input) {
    this.cacheTags = this.parseListRegexpOutput(input);
  },

  setCacheContexts(input) {
    this.cacheContexts = this.parseListRegexpOutput(input);
  },

  setCacheKeys(input) {
    this.cacheKeys = this.parseListRegexpOutput(input);
  },

  setCacheMaxAge(input) {
    this.cacheMaxAge = parseInt(input);
  },

  setPreBubblingCacheTags(input) {
    this.preBubblingCacheTags = this.parseListRegexpOutput(input);
  },

  setPreBubblingCacheContexts(input) {
    this.preBubblingCacheContexts = this.parseListRegexpOutput(input);
  },

  setPreBubblingCacheKeys(input) {
    this.preBubblingCacheKeys = this.parseListRegexpOutput(input);
  },

  setPreBubblingCacheMaxAge(input) {
    this.preBubblingCacheMaxAge = parseInt(input);
  },

  setRenderingTime(input) {
    this.renderingTime = parseFloat(input);
  },

  setObjectType(input) {
    this.objectType = input.split('__')[0];
  },

  setFilePath(input) {
    this.filePath = input;
  },

  setSuggestions(input) {
    this.suggestions = this.pasreListOnOffRegexpOutput(input);
  },

  setDataNode(input) {
    this.dataNode = input;
  },

  // Getter methods
  getPropertyHook() {
    return this.propertyHook;
  },

  getObjectType() {
    return this.objectType;
  },

  getDisplayElements() {
    const {
      idControllerSelectedElementInfo,
      idControllerSelectedElementSuggestionsValue,
      idControllerSelectedElementFilePathValue,
      idControllerSelectedElementCacheHit,
      idControllerSelectedElementCacheMaxAge,
      idControllerSelectedElementCacheTags,
      idControllerSelectedElementCacheContexts,
      idControllerSelectedElementCacheKeys,
      idControllerSelectedElementPreBubblingCacheTags,
      idControllerSelectedElementPreBubblingCacheContexts,
      idControllerSelectedElementPreBubblingCacheKeys,
      idControllerSelectedElementPreBubblingCacheMaxAge,
      idControllerSelectedElementRenderingTime,
    } = Drupal.vdUtilities.ids;

    const {
      classNameSelectedElementInfoWrapper,
      classNameSelectedElementInfo,
      classNameSelectedElementSuggestionsWrapper,
      classNameSelectedElementSuggestions,
      classNameSelectedElementTemplateFilePathWrapper,
      classNameSelectedElementTemplateFilePath,
      classNameSelectedElementTemplateFilePathLabel,
    } = Drupal.vdUtilities.classNames;

    const {
      stringThemeElementInfo,
      stringThemeElementThemeSuggestions,
      stringThemeElementFilePath,
      stringThemeElementFilePathInlineLabel,
      stringThemeElementCacheHit,
      stringThemeElementCacheMaxAge,
      stringThemeElementCacheTags,
      stringThemeElementCacheContexts,
      stringThemeElementCacheKeys,
      stringThemeElementPreBubblingCacheTags,
      stringThemeElementPreBubblingCacheContexts,
      stringThemeElementPreBubblingCacheKeys,
      stringThemeElementPreBubblingCacheMaxAge,
      stringThemeElementRenderingTime,
    } = Drupal.vdUtilities.strings;

    return [
      {
        key: 'propertyHook',
        label: stringThemeElementInfo,
        id: idControllerSelectedElementInfo,
        type: 'template',
        displayType: 'info',
        wrapperClasses: [
          classNameSelectedElementInfoWrapper
        ],
        valueClasses: [
          classNameSelectedElementInfo
        ]
      },
      {
        key: 'suggestions',
        label: stringThemeElementThemeSuggestions,
        id: idControllerSelectedElementSuggestionsValue,
        type: 'template',
        displayType: 'multipleCopyWithChecked',
        wrapperClasses: [
          classNameSelectedElementSuggestionsWrapper
        ],
        valueClasses: [
          classNameSelectedElementSuggestions
        ]
      },
      {
        key: 'filePath',
        label: stringThemeElementFilePath,
        inlineLabel: stringThemeElementFilePathInlineLabel,
        id: idControllerSelectedElementFilePathValue,
        type: 'template',
        displayType: 'singleCopy',
        wrapperClasses: [
          classNameSelectedElementTemplateFilePathWrapper
        ],
        valueClasses: [
          classNameSelectedElementTemplateFilePath,
        ],
      },
      {
        key: 'cacheHit',
        label: stringThemeElementCacheHit,
        id: idControllerSelectedElementCacheHit,
        type: 'cache',
        displayType: 'singleInfo',
      },
      {
        key: 'cacheTags',
        label: stringThemeElementCacheTags,
        id: idControllerSelectedElementCacheTags,
        type: 'cache',
        displayType: 'multipleCopy',
      },
      {
        key: 'cacheContexts',
        label: stringThemeElementCacheContexts,
        id: idControllerSelectedElementCacheContexts,
        type: 'cache',
        displayType: 'multipleCopy',
      },
      {
        key: 'cacheKeys',
        label: stringThemeElementCacheKeys,
        id: idControllerSelectedElementCacheKeys,
        type: 'cache',
        displayType: 'multipleCopy',
      },
      {
        key: 'cacheMaxAge',
        label: stringThemeElementCacheMaxAge,
        id: idControllerSelectedElementCacheMaxAge,
        type: 'cache',
        displayType: 'singleInfo',
      },
      {
        key: 'preBubblingCacheTags',
        label: stringThemeElementPreBubblingCacheTags,
        id: idControllerSelectedElementPreBubblingCacheTags,
        type: 'cache',
        displayType: 'multipleCopy',
      },
      {
        key: 'preBubblingCacheContexts',
        label: stringThemeElementPreBubblingCacheContexts,
        id: idControllerSelectedElementPreBubblingCacheContexts,
        type: 'cache',
        displayType: 'multipleCopy',
      },
      {
        key: 'preBubblingCacheKeys',
        label: stringThemeElementPreBubblingCacheKeys,
        id: idControllerSelectedElementPreBubblingCacheKeys,
        type: 'cache',
        displayType: 'multipleCopy',
      },
      {
        key: 'preBubblingCacheMaxAge',
        label: stringThemeElementPreBubblingCacheMaxAge,
        id: idControllerSelectedElementPreBubblingCacheMaxAge,
        type: 'cache',
        displayType: 'singleInfo',
      },
      {
        key: 'renderingTime',
        label: stringThemeElementRenderingTime,
        id: idControllerSelectedElementRenderingTime,
        type: 'cache',
        displayType: 'singleInfo',
      },
    ];
  },

  /**
   * Parses a string with a list of items.
   * @param {string} regexpOutput
   *   The outut of the regexp extraction.
   * @returns {array}
   *   The array that contains a list of extracted strings.
   */
  parseListRegexpOutput(regexpOutput) {
    return regexpOutput
      .split('\n')
      .map((line) => {
        return line.trim().replace(/^\*\s/, '');
      })
      .filter((line) => {
        return line.length > 0;
      });
  },

  pasreListOnOffRegexpOutput(regexpOutput) {
    return regexpOutput.trim()
    .split(/\n\s*/)
    .map((themeSuggestion) => {
      const splitThemeSuggestion = themeSuggestion.split(' ');
      return {
        suggestion: splitThemeSuggestion[1],
        activated: ['x', '✅'].includes(splitThemeSuggestion[0]),
      };
    });
  },

  // Reset object to its initial state.
  reset: function() {
    Object.assign(this, this.initialState);
  },
}
