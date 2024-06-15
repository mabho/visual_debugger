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
  cacheMaxAge: 0,
  preBubblingCacheMaxAge: 0,
  renderingTime: 0,
  cacheTags: null,

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
      preBubblingCacheMaxAge: this.preBubblingCacheMaxAge,
      renderingTime: this.renderingTime,
      cacheTags: this.cacheTags,
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
    this.cacheTags = input;
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
    this.suggestions = input;
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

  // Reset object to its initial state.
  reset: function() {
    Object.assign(this, this.initialState);
  },
}
