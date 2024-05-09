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
    idControllerElement: 'visual-debugger--controller',
    idControllerElementSuggestions: 'visual-debugger--controller--suggestions',
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

  generateControllerLayer() {
    const {
      classNameBaseLayer,
      classNameSelectedElementLayer,
      classNameSelectedElementTargetLayer
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

    // Create a selected element layer
    const selectedElementLayer = document.createElement('div');
    selectedElementLayer.classList.add(classNameSelectedElementLayer);
    const selectedElementLayerTitle = document.createElement('h3');
    selectedElementLayerTitle.textContent = Drupal.t('Selected Element');
    selectedElementLayer.appendChild(selectedElementLayerTitle);
    selectedElementLayer.appendChild(document.createElement('hr'));
    const selectedElementSuggestionsLayer = document.createElement('div');
    selectedElementSuggestionsLayer.setAttribute('id', idControllerElementSuggestions);
    selectedElementSuggestionsLayer.classList.add(classNameSelectedElementTargetLayer);

    // Append everything to the controller layer.
    const controllerLayer = document.createElement('div');
    controllerLayer.classList.add(classNameBaseLayer);
    controllerLayer.appendChild(formElement);
    controllerLayer.appendChild(selectedElementLayer);
    controllerLayer.appendChild(selectedElementSuggestionsLayer);
    this.setControllerLayer(controllerLayer);

    // Return
    return controllerLayer;
  },

  // Setter methods.
  setActivated() {
    this.activated = true;
  },

  getSelectedElementSuggestionsLayer() {
    return this.getControllerLayer().querySelector(
      `#${this.ids.idControllerElementSuggestions}`
    )
  },

  setSelectedElementSuggestions(content) {
    const suggestions = this.getSelectedElementSuggestionsLayer();
    this.getSelectedElementSuggestionsLayer().innerHTML =
      (content !== null)
        ? content.map((item) => { return item.suggestion }).join('<br>')
        : null;
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
