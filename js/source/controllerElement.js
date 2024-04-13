/**
 * Single controller window that displays information on each of the layers
 * being inspected.
 */
Drupal.controllerElement = {

  // The object properties.
  activated: false,

  classNames: {
    classNameBaseLayer: 'visual-debugger--controller-layer',
    classNameBaseLayerDeactivated: 'deactivated',
  },

  baseLayer: null,

  themeDebugNodes: null,

  // Executed upon initialization.
  init(baseLayer, themeDebugNodes) {
    this.baseLayer = baseLayer;
    this.themeDebugNodes = themeDebugNodes;
  },

  setDebuggerActivated(activated = true) {
    this.baseLayer.classList.toggle(
      this.classNames.classNameBaseLayerDeactivated,
      !activated
    );
  },

  generateControllerLayer() {
    const self = this; // Save the context of `this`

    // Create a checkbox input element for debugger activation
    const debuggerActivationCheckbox = document.createElement('input');
    debuggerActivationCheckbox.type = 'checkbox';
    debuggerActivationCheckbox.id = 'debuggerActivationCheckbox';
    debuggerActivationCheckbox.checked = true;
    debuggerActivationCheckbox.addEventListener('change', function() {
      self.setDebuggerActivated(this.checked)
      // Checked.
      if(this.checked) {
        console.log('Checkbox is checked');
      }

      // Unchecked.
      else {
        console.log('Checkbox is unchecked');
      }
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

    // Append the form to the baseLayer
    const controllerLayer = document.createElement('div');
    const { classNameBaseLayer } = this.classNames;
    controllerLayer.classList.add(classNameBaseLayer);
    controllerLayer.appendChild(formElement);

    return controllerLayer;
  },

  // Setter methods.
  setActivated() {
    this.activated = true;
  },

  setActiveThemeElement(instanceLayerRef) {

  }
}
