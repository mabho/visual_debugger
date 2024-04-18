/**
 * Single controller window that displays information on each of the layers
 * being inspected.
 */
Drupal.controllerElement = {

  // The object properties.
  activated: false,
  activeThemeElement: null,
  controllerLayer: null,
  baseLayer: null,
  themeDebugNodes: null,

  // Element IDs.
  ids: {
    idSelectedElementLayer: 'visual-debugger--selected-element-layer',
    idSelectedElementSuggestionsLayer: 'visual-debugger--selected-element-suggestions-layer',
  },

  // Class names for the controller layer.
  classNames: {
    classNameBaseLayer: 'visual-debugger--controller-layer',
    classNameBaseLayerDeactivated: 'deactivated',
    classNameSelectedElementLayer: 'visual-debugger--selected-element-layer',
    classNameSelectedElementTargetLayer: 'visual-debugger--selected-element-target-layer',
  },

  // Getter/Setter for the controller layer.
  getControllerLayer() {
    console.warn('getControllerLayer', this.controllerLayer);
    return this.controllerLayer;
  },

  setControllerLayer(controllerLayer) {
    console.warn('controllerLayer', controllerLayer);
    this.controllerLayer = controllerLayer;
  },

  // Executed upon initialization.
  init(baseLayer, themeDebugNodes) {
    this.baseLayer = baseLayer;
    this.themeDebugNodes = themeDebugNodes;
  },

  // Toggle the debugger activation.
  toggleDebuggerActivated(activated = true) {
    this.baseLayer.classList.toggle(
      this.classNames.classNameBaseLayerDeactivated,
      !activated
    );
  },

  generateControllerLayer() {
    const {
      classNameBaseLayer,
      classNameSelectedElementLayer,
      classNameSelectedElementTargetLayer
    } = this.classNames

    const {
      idSelectedElementLayer,
      idSelectedElementSuggestionsLayer
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
    debuggerActivationLabel.textContent = 'Activate debugger';

    // Create a wrapper div
    const wrapperDiv = document.createElement('div');
    wrapperDiv.appendChild(debuggerActivationCheckbox);
    wrapperDiv.appendChild(debuggerActivationLabel);

    // Append the wrapper div to the form.
    const formElement = document.createElement('form');
    formElement.appendChild(wrapperDiv);

    // Create a selected element layer
    const selectedElementLayer = document.createElement('div');
    selectedElementLayer.classList.add(classNameSelectedElementLayer);
    const selectedElementLayerTitle = document.createElement('h3');
    selectedElementLayerTitle.textContent = Drupal.t('Selected Element');
    selectedElementLayer.appendChild(selectedElementLayerTitle);
    selectedElementLayer.appendChild(document.createElement('hr'));
    const selectedElementSuggestionsLayer = document.createElement('div');
    selectedElementSuggestionsLayer.setAttribute('id', idSelectedElementSuggestionsLayer);
    selectedElementSuggestionsLayer.classList.add(classNameSelectedElementTargetLayer);

    // Append everything to the controller layer.
    const controllerLayer = document.createElement('div');
    controllerLayer.classList.add(classNameBaseLayer);
    controllerLayer.appendChild(formElement);
    controllerLayer.appendChild(selectedElementLayer);
    controllerLayer.appendChild(selectedElementSuggestionsLayer);
    this.setControllerLayer(controllerLayer);
    return controllerLayer;
  },

  // Setter methods.
  setActivated() {
    this.activated = true;
  },

  getSelectedElementSuggestionsLayer: () =>
    this.getControllerLayer().querySelector(
      `#${this.ids.idSelectedElementSuggestionsLayer}`
    ),

  setSelectedElementSuggestions(content) {
    const suggestions = this.getSelectedElementSuggestionsLayer();
    this.getSelectedElementSuggestionsLayer().innerHTML = (content !== null) ? content.map((item) => { return item.suggestion }).join('<br>') : null;
  },

  setActiveThemeElement(instanceLayerRef) {
    this.activeThemeElement = instanceLayerRef;
    this.setSelectedElementSuggestions(this.activeThemeElement.suggestions);
    this.displayActiveElement();
  },

  displayActiveElement() {
    return this.activeThemeElement;
  }
}
