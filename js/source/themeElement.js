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
  beginOutput: false,

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
      beginOutput: this.beginOutput
    };
  },

  // Setter methods.
  setActivated() {
    this.activated = true;
  },

  getPropertyHook() {
    return this.propertyHook;
  },

  setPropertyHook(input) {
    this.propertyHook = input;
  },

  getObjectType() {
    return this.objectType;
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

  setBeginOutput() {
    this.beginOutput = true;
  },

  setDataNode(input) {
    this.dataNode = input;
  },

  // Reset object to its initial state.
  reset: function() {
    Object.assign(this, this.initialState);
  },
}
