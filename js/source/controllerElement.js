/**
 * Single controller window that displays information on each of the layers
 * being inspected.
 */
Drupal.controllerElement = {

  // The object properties.
  activated: false,
  activeThemeElement: null,
  defaultThemeElement: null,
  controllerLayer: null,
  baseLayer: null,
  themeDebugNodes: null,

  // Element IDs.
  ids: {
    idControllerElement: 'visual-debugger--controller',
    idControllerElementInfo: 'visual-debugger--controller--info',
    idControllerElementSuggestions: 'visual-debugger--controller--suggestions',
  },

  // Class names for the controller layer.
  classNames: {
    classNameBaseLayer: 'visual-debugger--controller-layer',
    classNameBaseLayerDeactivated: 'deactivated',
    classNameSelectedElementLayer: 'visual-debugger--selected-element-layer',
    classNameSelectedElementInfo: 'visual-debugger--selected-element-layer--info',
    classNameSelectedElementSuggestions: 'visual-debugger--selected-element-layer--suggestions',
  },

  // Getter/Setter for the controller layer.
  getControllerLayer() {
    return this.controllerLayer;
  },

  setControllerLayer(controllerLayer) {
    this.controllerLayer = controllerLayer;
  },

  // Executed upon initialization.
  init(baseLayer, themeDebugNodes) {
    this.baseLayer = baseLayer;
    this.themeDebugNodes = themeDebugNodes;

    // Adjust the position of the controller window.
    const { body } = document;
    const observer = new MutationObserver((mutations) => {
      const controllerLayer = this.getControllerLayer();
      if (controllerLayer == null)
        return;

      const newPositionTop = mutations[0].target.style.paddingTop || 0;
      this.controllerLayer.style.top = newPositionTop;
    });

    observer.observe(body, {
      attributes: true,
      attributeFilter: ["style"]
    });
  },

  // Toggle the debugger activation.
  toggleDebuggerActivated(activated = true) {
    this.baseLayer.classList.toggle(
      this.classNames.classNameBaseLayerDeactivated,
      !activated
    );
  },

  // Prepare the theme suggestions.
  prepareThemeSuggestions(content) {
    const suggestionWrapper = document.createElement('div');
    const clipboardContent = document.createElement('pre');
    clipboardContent.textContent = content;
    suggestionWrapper.appendChild(clipboardContent);
    return suggestionWrapper;
  },

  // Generate the controller layer; this is the main component structure.
  generateControllerLayer() {
    const {
      classNameBaseLayer,
      classNameSelectedElementLayer,
      classNameSelectedElementInfo,
      classNameSelectedElementSuggestions
    } = this.classNames

    const {
      idSelectedElementLayer,
      idControllerElementSuggestions
    } = this.ids;

    const self = this; // Save the context of `this`

    // Create a checkbox input element for debugger activation
    const debuggerActivationCheckbox = document.createElement('input');
    debuggerActivationCheckbox.type = 'checkbox';
    debuggerActivationCheckbox.id = 'debuggerActivationCheckbox';
    debuggerActivationCheckbox.checked = true;
    debuggerActivationCheckbox.addEventListener('change', function() {
      self.toggleDebuggerActivated(this.checked)
    });

    // Create a label element for the debugger activation checkbox
    const debuggerActivationLabel = document.createElement('label');
    debuggerActivationLabel.setAttribute('for', debuggerActivationCheckbox.id)
    debuggerActivationLabel.textContent = Drupal.t('Activate debugger');

    // Create a wrapper div
    const wrapperDiv = document.createElement('div');
    wrapperDiv.appendChild(debuggerActivationCheckbox);
    wrapperDiv.appendChild(debuggerActivationLabel);

    // Append the wrapper div to the form.
    const formElement = document.createElement('form');
    formElement.appendChild(wrapperDiv);

    // Selected element layer.
    const selectedElementLayer = document.createElement('div');
    const selectedElementLayerTitle = document.createElement('h3');
    selectedElementLayer.classList.add(classNameSelectedElementLayer);
    selectedElementLayerTitle.textContent = Drupal.t('Selected Element');
    selectedElementLayer.appendChild(selectedElementLayerTitle);
    selectedElementLayer.appendChild(document.createElement('hr'));

    // Selected element basic info.
    const selectedElementBasicInfo = document.createElement('div');
    const selectedElementBasicInfoTitle = document.createElement('h4');
    selectedElementBasicInfo.setAttribute('id', idControllerElementSuggestions);
    selectedElementBasicInfo.classList.add(classNameSelectedElementInfo);
    selectedElementBasicInfoTitle.textContent = Drupal.t('Basic Information');

    // Theme suggestions layer.
    const selectedElementSuggestionsLayer = document.createElement('div');
    const selectedElementSuggestionsLayerTitle = document.createElement('h4');
    selectedElementSuggestionsLayer.setAttribute('id', idControllerElementSuggestions);
    selectedElementSuggestionsLayer.classList.add(classNameSelectedElementSuggestions);
    selectedElementSuggestionsLayerTitle.textContent = Drupal.t('Theme suggestions');
    
    // Append everything to the controller layer.
    const controllerLayer = document.createElement('div');
    controllerLayer.classList.add(classNameBaseLayer);
    controllerLayer.appendChild(formElement);
    controllerLayer.appendChild(selectedElementLayer);
    controllerLayer.appendChild(selectedElementBasicInfoTitle);
    controllerLayer.appendChild(selectedElementBasicInfo);
    controllerLayer.appendChild(selectedElementSuggestionsLayerTitle);
    controllerLayer.appendChild(selectedElementSuggestionsLayer);
    this.setControllerLayer(controllerLayer);

    // Return
    return controllerLayer;
  },

  // Setter methods.
  setActivated() {
    this.activated = true;
  },

  getSelectedElementInfoLayer() {
    return this.getControllerLayer().querySelector(
      `#${this.ids.idControllerElementInfo}`
    );
  },

  getSelectedElementSuggestionsLayer() {
    return this.getControllerLayer().querySelector(
      `#${this.ids.idControllerElementSuggestions}`
    );
  },

  // Establishes the element that is currently selected.
  // Active is priority; default comes right after; null if none.
  getSelectedThemeElement() {
    return this.activeThemeElement || 
      this.defaultThemeElement || 
      null;
  },

  // Basic information on the selected element.
  setSelectedElementInfo() {
    const selectedThemeElement =
      this.activeThemeElement || 
      this.defaultThemeElement || 
      null;

    const selectedElementInfoLayer = this.getSelectedElementInfoLayer();
    selectedElementInfoLayer.innerHTML = '';
    /*


    // Clear legacy information showing in the suggestions layer.

    // If suggestions are available, display them.
    if (
      selectedThemeElement !== null &&
      selectedThemeElement.hasOwnProperty('suggestions') &&
      selectedThemeElement.suggestions !== null
    ) {

    }
    */
  },

  setSelectedElementSuggestions() {
    const selectedThemeElement = this.getSelectedThemeElement();
    const selectedElementSuggestionsLayer = this.getSelectedElementSuggestionsLayer();

    // Clear legacy information showing in the suggestions layer.
    selectedElementSuggestionsLayer.innerHTML = '';

    // If suggestions are available, display them.
    if (
        selectedThemeElement !== null &&
        selectedThemeElement.hasOwnProperty('suggestions') &&
        selectedThemeElement.suggestions !== null
    ) {
      const clipboardContent = selectedThemeElement.suggestions;
      clipboardContent.forEach((item) => {
        const themeSuggestion = this.prepareThemeSuggestions(item.suggestion);
        selectedElementSuggestionsLayer.appendChild(themeSuggestion);
      });
    }
  },

  // Active theme element.
  setActiveThemeElement(instanceLayerRef) {
    this.activeThemeElement = instanceLayerRef;
    this.setSelectedElementInfo();
    this.setSelectedElementSuggestions();
  },

  resetActiveThemeElement(instanceLayerRef) {
    this.activeThemeElement = null;
    // this.setSelectedElementInfo();
    this.setSelectedElementSuggestions();
  },
  
  // Default theme element.
  setDefaultThemeElement(instanceLayerRef) {
    this.defaultThemeElement = instanceLayerRef;
    // this.setSelectedElementInfo();
    this.setSelectedElementSuggestions();
  },
  
  resetDefaultThemeElement() {
    this.defaultThemeElement = null;
    // this.setSelectedElementInfo();
    this.setSelectedElementSuggestions();
  },

  displayActiveElement() {
    return this.activeThemeElement;
  }
}
