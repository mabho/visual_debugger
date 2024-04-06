/**
 * Fills a theme element.
 */
Drupal.themeElement = {

  // The object properties.
  propertyHook: null,
  suggestions: null,
  filePath: null,
  dataNode: null,

  // Setter methods.
  setPropertyHook(input) {
    this.propertyHook = input;
  },

  setFilePath(input) {
    this.filePath = input;
  },

  setSuggestions(input) {
    this.suggestions = input;
  },

  setDataNode(dataNode) {
    this.dataNode = dataNode;
  }


}
