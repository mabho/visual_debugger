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
      cacheMaxAge: this.cacheMaxAge,
      cacheTags: this.cacheTags,
      cacheContexts: this.cacheContexts,
      cacheKeys: this.cacheKeys,
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

  setCacheMaxAge(input) {
    this.cacheMaxAge = parseInt(input);
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
      stringThemeElementPreBubblingCacheMaxAge,
      stringThemeElementRenderingTime,
    } = Drupal.vdUtilities.strings;

    return [
      {
        key: 'propertyHook',
        label: stringThemeElementInfo,
        id: idControllerSelectedElementInfo,
        type: 'info',
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
        type: 'multipleCopyWithChecked',
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
        type: 'singleCopy',
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
        type: 'singleInfo',
      },
      {
        key: 'cacheMaxAge',
        label: stringThemeElementCacheMaxAge,
        id: idControllerSelectedElementCacheMaxAge,
        type: 'singleInfo',
      },
      {
        key: 'cacheTags',
        label: stringThemeElementCacheTags,
        id: idControllerSelectedElementCacheTags,
        type: 'multipleCopy',
      },
      {
        key: 'cacheContexts',
        label: stringThemeElementCacheContexts,
        id: idControllerSelectedElementCacheContexts,
        type: 'multipleCopy',
      },
      {
        key: 'cacheKeys',
        label: stringThemeElementCacheKeys,
        id: idControllerSelectedElementCacheKeys,
        type: 'multipleCopy',
      },
      {
        key: 'preBubblingCacheMaxAge',
        label: stringThemeElementPreBubblingCacheMaxAge,
        id: idControllerSelectedElementPreBubblingCacheMaxAge,
        type: 'singleInfo',
      },
      {
        key: 'renderingTime',
        label: stringThemeElementRenderingTime,
        id: idControllerSelectedElementRenderingTime,
        type: 'singleInfo',
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
        activated: (splitThemeSuggestion[0] === 'x'),
      };
    });
  },

  // Reset object to its initial state.
  reset: function() {
    Object.assign(this, this.initialState);
  },
}
