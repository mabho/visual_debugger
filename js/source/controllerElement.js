/**
 * Single controller window that displays information on each of the layers
 * being inspected.
 */
Drupal.controllerElement = {

  body: document.body,

  // The object properties.
  activated: false,
  activeThemeElement: null,
  defaultThemeElement: null,
  controllerLayer: null,
  baseLayer: null,

  // This array holds a fundamental structure being passed into the
  // controller component. Its initial value is null:
  // 1. instanceActiveElement: The actual data for each layer.
  // 3. instanceLayer: The debug layer generated dynamically.
  // 2. instanceRefElement: The original referenced layer.
  themeDebugNodes: null,

  constants: {
    initialControllerWidth: '400px',
    controllerDeactivatedGap: 10,
    controllerDeactivatedInputMargin: '200px',
  },

  // Element IDs.
  ids: {
    idControllerElement: 'visual-debugger--controller-layer',
    idControllerElementInfo: 'visual-debugger--controller-layer--info',
    idControllerElementSuggestions: 'visual-debugger--controller-layer--suggestions',
  },

  // Class names for the controller layer.
  classNames: {
    classNameVisualDebugger: 'visual-debugger',
    classNameBaseLayer: 'visual-debugger--controller-layer',
    classNameBaseLayerActivated: 'visual-debugger--activated',
    classNameBaseLayerDeactivated: 'visual-debugger--deactivated',
    classNameForm: 'visual-debugger--controller-layer--activation-form',
    classNameFormWrapper: 'visual-debugger--controller-layer--activation-form-wrapper',
    classNameSelectedElementLayer: 'visual-debugger--selected-element-layer',
    classNameSelectedElementInfo: 'visual-debugger--selected-element-layer--info',
    classNameSelectedElementInfoTextContent: 'tag',
    classNameSelectedElementInfoObjectType: 'tag--object-type',
    classNameSelectedElementInfoPropertyHook: 'tag--prop-hook',
    classNameSelectedElementSuggestions: 'visual-debugger--selected-element-layer--suggestions',
    classNameSelectedElementSuggestionsSuggestion: 'suggestion',
    classNameIconSelectedTrue: 'icon-selected-true',
    classNameIconSelectedFalse: 'icon-selected-false',
    classNameIconEye: 'icon-eye',
    classNameIconControllerActivated: 'icon-controller-activated',
    classNameIconControllerDeactivated: 'icon-controller-deactivated',
    classNameIconEyeBlocked: 'icon-eye-blocked',
    classNameIconCopyToClipboard: 'icon-copy',
    classNameIconSlideResize: 'icon-slide-resize',
    classNameClickDragButton: 'click-drag-button',
  },

  // layerAttributes.
  layerAttributes: {
    controllerActivatedAttributeName: 'data-controller-activated',
  },

  // Drupal translatable strings for the controller layer.
  strings: {
    stringCopyToClipboard: Drupal.t('Copy to clipboard'),
    stringActivateDebugger: Drupal.t('Activate debugger'),
    stringSelectedElement: Drupal.t('Selected Element'),
    stringBasicInfo: Drupal.t('Object Type'),
    stringThemeSuggestions: Drupal.t('Theme Suggestions'),
    stringClickDragButton: Drupal.t('Click and drag to resize'),
  },

  system: {
    localStorageDebuggerActivatedKey: 'debuggerActivated',
    localStorageControllerWidthKey: 'controllerWidth',
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

  // Toggle the debugger activation and update localStorage.
  toggleDebuggerActivated(activated = true) {
    const {
      classNameBaseLayerActivated,
      classNameBaseLayerDeactivated
    } = this.classNames;
    const { controllerActivatedAttributeName } = this.layerAttributes;

    // Update the *activated* status class name.
    this.body.classList.toggle(
      classNameBaseLayerActivated,
      activated
    );
    classNameBaseLayerActivated

    // Update the *deactivated* status class name.
    this.body.classList.toggle(
      classNameBaseLayerDeactivated,
      !activated
    );

    // Write the activation status to localStorage.
    localStorage.setItem(
      this.system.localStorageDebuggerActivatedKey, activated);

    // Activate/deactivate the controller layer.
    if (this.controllerLayer !== null) {
      this.controllerLayer.setAttribute(controllerActivatedAttributeName, activated);
      this.checkControllerActivation();
    }
  },

  // Prepare the theme suggestions.
  prepareThemeSuggestions(item) {
    const { body } = this;

    const {
      classNameSelectedElementSuggestionsSuggestion,
      classNameIconSelectedTrue,
      classNameIconSelectedFalse,
      classNameIconCopyToClipboard,
    } = this.classNames;

    const {
      stringCopyToClipboard,
    } = this.strings;
    const suggestionWrapper = document.createElement('div');
    const clipboardActivated = document.createElement('div');
    const clipboardContent = document.createElement('pre');
    const cliboardButton = document.createElement('button');

    suggestionWrapper.classList.add(
      classNameSelectedElementSuggestionsSuggestion);
    clipboardActivated.classList.add(
      item.activated
        ? classNameIconSelectedTrue
        : classNameIconSelectedFalse
    );
    clipboardContent.textContent = item.suggestion;

    // Setup the button that copies theme suggestion to the clipboard.
    cliboardButton.classList.add(classNameIconCopyToClipboard);
    cliboardButton.setAttribute('aria-label', stringCopyToClipboard);
    cliboardButton.addEventListener('click', function() {
      const textToCopy = clipboardContent.textContent;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        body.removeChild(textarea);
      }
    });

    suggestionWrapper.appendChild(clipboardActivated);
    suggestionWrapper.appendChild(clipboardContent);
    suggestionWrapper.appendChild(cliboardButton);
    return suggestionWrapper;
  },

  // Generate the controller layer; this is the main component structure.
  generateControllerLayer() {
    const {
      classNameVisualDebugger,
      classNameBaseLayer,
      classNameForm,
      classNameFormWrapper,
      classNameSelectedElementLayer,
      classNameSelectedElementInfo,
      classNameSelectedElementSuggestions,
      classNameIconEye,
      classNameIconControllerActivated,
      classNameIconEyeBlocked,
      classNameIconControllerDeactivated,
    } = this.classNames

    const { controllerActivatedAttributeName } = this.layerAttributes;

    const {
      idControllerElementInfo,
      idControllerElementSuggestions
    } = this.ids;

    const {
      stringActivateDebugger,
      stringSelectedElement,
      stringBasicInfo,
      stringThemeSuggestions,
    } = this.strings;

    const controllerLayer = document.createElement('div');
    const { initialControllerWidth } = this.constants;
    const { localStorageControllerWidthKey } = this.system;
    const self = this; // Save the context of `this`

    // Create a checkbox input element for debugger activation
    const debuggerActivationCheckbox = document.createElement('input');
    debuggerActivationCheckbox.type = 'checkbox';
    debuggerActivationCheckbox.id = 'debuggerActivationCheckbox';

    // Applies the initial controller state based on localStorage setting.
    const controllerActivated = (
      localStorage.getItem(self.system.localStorageDebuggerActivatedKey) || 'true'
    ) === 'true';
    debuggerActivationCheckbox.checked = controllerActivated;
    controllerLayer.setAttribute(
      controllerActivatedAttributeName,
      controllerActivated
    );
    self.toggleDebuggerActivated(controllerActivated);

    // Add an event listener to the debugger activation checkbox.
    debuggerActivationCheckbox.addEventListener('change', function() {
      self.toggleDebuggerActivated(this.checked)
    });

    // Create icons for the debugger activation checkbox.
    const iconSelectedTrue = document.createElement('span');
    iconSelectedTrue.classList.add(classNameIconEye, classNameIconControllerActivated);
    const iconSelectedFalse = document.createElement('span');
    iconSelectedFalse.classList.add(classNameIconEyeBlocked, classNameIconControllerDeactivated);

    // Create a label element for the debugger activation checkbox.
    const debuggerActivationLabel = document.createElement('label');
    debuggerActivationLabel.setAttribute('for', debuggerActivationCheckbox.id)
    debuggerActivationLabel.textContent = stringActivateDebugger;

    // Create a wrapper div.
    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add(classNameFormWrapper);
    wrapperDiv.appendChild(debuggerActivationCheckbox);
    wrapperDiv.appendChild(iconSelectedTrue);
    wrapperDiv.appendChild(iconSelectedFalse);
    wrapperDiv.appendChild(debuggerActivationLabel);

    // Append the wrapper div to the form.
    const formElement = document.createElement('form');
    formElement.classList.add(classNameForm);
    formElement.appendChild(wrapperDiv);

    // Selected element layer.
    const selectedElementLayer = document.createElement('div');
    const selectedElementLayerTitle = document.createElement('h3');
    selectedElementLayer.classList.add(classNameSelectedElementLayer);
    selectedElementLayerTitle.textContent = stringSelectedElement;
    selectedElementLayer.appendChild(selectedElementLayerTitle);
    selectedElementLayer.appendChild(document.createElement('hr'));

    // Selected element basic info.
    const selectedElementBasicInfo = document.createElement('div');
    const selectedElementBasicInfoTitle = document.createElement('h4');
    selectedElementBasicInfo.setAttribute('id', idControllerElementInfo);
    selectedElementBasicInfo.classList.add(classNameSelectedElementInfo);
    selectedElementBasicInfoTitle.textContent = stringBasicInfo;

    // Theme suggestions layer.
    const selectedElementSuggestionsLayer = document.createElement('div');
    const selectedElementSuggestionsLayerTitle = document.createElement('h4');
    selectedElementSuggestionsLayer.setAttribute('id', idControllerElementSuggestions);
    selectedElementSuggestionsLayer.classList.add(classNameSelectedElementSuggestions);
    selectedElementSuggestionsLayerTitle.textContent = stringThemeSuggestions;

    // Append everything to the controller layer.
    controllerLayer.classList.add(classNameVisualDebugger);
    controllerLayer.classList.add(classNameBaseLayer);
    controllerLayer.style.width =
      localStorage.getItem(localStorageControllerWidthKey) || initialControllerWidth;
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

  // Update the controller position depending on its activation status.
  checkControllerActivation() {
    const { controllerDeactivatedGap } = this.constants;
    const controllerActivated = this.getControllerActivationStatus();

    // If the controller is activated, display it.
    if (controllerActivated) {
      this.controllerLayer.style.right = '0px';
      return;
    }

    // Calculate the new position of the controller when toggled off.
    const controllerWidth = parseInt(this.controllerLayer.style.width);
    const newControllerPosition = (controllerWidth - controllerDeactivatedGap) * -1;
    this.controllerLayer.style.right = `${newControllerPosition}px`;
  },

  // This method needs to be requested after controller is activated.
  executePostActivation() {
    this.generateSliderButton();
    this.checkControllerActivation();
  },

  // Create a slider button.
  generateSliderButton() {
    const self = this;
    const {
      classNameClickDragButton,
      classNameIconSlideResize,
    } = this.classNames; 
    const { stringClickDragButton } = this.strings;
    const { localStorageControllerWidthKey } = this.system;
    const controllerLayer = this.getControllerLayer();
    const controllerLayerBoundingRectClient = controllerLayer.getBoundingClientRect();

    // Flag to indicate whether the mouse button is pressed
    let isMouseDown = false;

    // const controllerLayerBoundingRectClient = controllerLayer.getBoundingClientRect();
    const sliderButton = document.createElement('button');
    sliderButton.classList.add(classNameClickDragButton);
    sliderButton.classList.add(classNameIconSlideResize);
    sliderButton.setAttribute("aria-label", stringClickDragButton);

    // Add the mousedown event listener to the button
    sliderButton.addEventListener('mousedown', function(event) {
      if (!self.getControllerActivationStatus()) {
        isMouseDown = false;
        return;
      }
      isMouseDown = true;
    });

    // Add the mousemove event listener to the document.
    document.addEventListener('mousemove', function(event) {
      if (!isMouseDown) return;

      // Calculate the new width based on the current mouse position
      const newWidth =
        controllerLayerBoundingRectClient.width
          + controllerLayerBoundingRectClient.left
          - event.clientX;

      // Update the width of the controller element
      controllerLayer.style.width = `${newWidth}px`;
    });

    // Add the mouseup event listener to the document
    document.addEventListener('mouseup', function(event) {
      isMouseDown = false;
      localStorage.setItem(
        localStorageControllerWidthKey,
        controllerLayer.style.width
      );
    });

    controllerLayer.appendChild(sliderButton);
  },

  // Get an updated status on controller activation
  getControllerActivationStatus() {
    const { controllerActivatedAttributeName } = this.layerAttributes;
    const controllerLayer = this.getControllerLayer();
    return controllerLayer.getAttribute(controllerActivatedAttributeName) === 'true';
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
    const selectedThemeElement = this.getSelectedThemeElement();
    let objectTypeText = '';
    const {
      classNameSelectedElementInfoTextContent,
      classNameSelectedElementInfoObjectType,
    } = this.classNames;

    // Clear legacy information showing in the suggestions layer.
    const selectedElementInfoLayer = this.getSelectedElementInfoLayer();
    selectedElementInfoLayer.innerHTML = '';

    // If an object type is available, display it.
    if (
      selectedThemeElement !== null &&
      selectedThemeElement.hasOwnProperty('objectType') &&
      selectedThemeElement.objectType !== null
    ) {
      const objectTypeWrapper = document.createElement('div');
      objectTypeWrapper.classList.add(
        classNameSelectedElementInfoTextContent,
        classNameSelectedElementInfoObjectType,
        `${classNameSelectedElementInfoObjectType}--${selectedThemeElement.objectType}`,
      );
      objectTypeText = selectedThemeElement.objectType;
      objectTypeWrapper.textContent = objectTypeText;
      selectedElementInfoLayer.appendChild(objectTypeWrapper);
    }

    // If a property hook is available, display it.
    if (
      selectedThemeElement !== null &&
      selectedThemeElement.hasOwnProperty('propertyHook') &&
      selectedThemeElement.propertyHook !== null &&
      objectTypeText !== selectedThemeElement.propertyHook
    ) {
      const elementTypeWrapper = document.createElement('div');
      elementTypeWrapper.classList.add(
        classNameSelectedElementInfoTextContent);
      elementTypeWrapper.textContent = selectedThemeElement.propertyHook;
      selectedElementInfoLayer.appendChild(elementTypeWrapper)
    }
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
        const themeSuggestion = this.prepareThemeSuggestions(item);
        selectedElementSuggestionsLayer.appendChild(themeSuggestion);
      });
    }
  },

  updateSelectedElement() {
    this.setSelectedElementInfo();
    this.setSelectedElementSuggestions();
  },

  // Active theme element.
  setActiveThemeElement(instanceLayerRef) {
    this.activeThemeElement = instanceLayerRef;
    this.updateSelectedElement();
  },

  resetActiveThemeElement(instanceLayerRef) {
    this.activeThemeElement = null;
    this.updateSelectedElement();
  },
  
  // Default theme element.
  setDefaultThemeElement(instanceLayerRef) {
    this.defaultThemeElement = instanceLayerRef;
    this.updateSelectedElement();
  },

  resetDefaultThemeElement() {
    this.defaultThemeElement = null;
    this.updateSelectedElement();
  },

  displayActiveElement() {
    return this.activeThemeElement;
  }
}
