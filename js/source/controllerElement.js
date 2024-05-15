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
    classNameBaseLayerDeactivated: 'visual-debugger--deactivated',
    classNameForm: 'visual-debugger--controller-layer--activation-form',
    classNameSelectedElementLayer: 'visual-debugger--selected-element-layer',
    classNameSelectedElementInfo: 'visual-debugger--selected-element-layer--info',
    classNameSelectedElementInfoTextContent: 'tag',
    classNameSelectedElementSuggestions: 'visual-debugger--selected-element-layer--suggestions',
    classNameSelectedElementSuggestionsSuggestion: 'suggestion',
    classNameIconSelectedTrue: 'icon-selected-true',
    classNameIconSelectedFalse: 'icon-selected-false',
    classNameIconCopyToClipboard: 'icon-copy',
    classNameIconSlideResize: 'icon-slide-resize',
    classNameClickDragButton: 'click-drag-button',
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
    const { classNameBaseLayerDeactivated } = this.classNames;
    if (this.body !== null) {
      this.body.classList.toggle(
        classNameBaseLayerDeactivated,
        !activated
      )
    }

    localStorage.setItem(
      this.system.localStorageDebuggerActivatedKey, activated);
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
      classNameSelectedElementLayer,
      classNameSelectedElementInfo,
      classNameSelectedElementSuggestions,
    } = this.classNames

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

    const { initialControllerWidth } = this.constants;
    const { localStorageControllerWidthKey } = this.system;
    const self = this; // Save the context of `this`

    // Create a checkbox input element for debugger activation
    const debuggerActivationCheckbox = document.createElement('input');
    debuggerActivationCheckbox.type = 'checkbox';
    debuggerActivationCheckbox.id = 'debuggerActivationCheckbox';

    // Decides on initial controller state based on localStorage setting.
    debuggerActivationCheckbox.checked = (
      localStorage.getItem(self.system.localStorageDebuggerActivatedKey)|| 'true'
    ) === 'true';
    self.toggleDebuggerActivated(debuggerActivationCheckbox.checked);

    // Add an event listener to the debugger activation checkbox.
    debuggerActivationCheckbox.addEventListener('change', function() {
      self.toggleDebuggerActivated(this.checked)
    });

    // Create a label element for the debugger activation checkbox.
    const debuggerActivationLabel = document.createElement('label');
    debuggerActivationLabel.setAttribute('for', debuggerActivationCheckbox.id)
    debuggerActivationLabel.textContent = stringActivateDebugger;

    // Create a wrapper div.
    const wrapperDiv = document.createElement('div');
    wrapperDiv.appendChild(debuggerActivationCheckbox);
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
    const controllerLayer = document.createElement('div');
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

  // Create a slider button.
  generateSliderButton() {
    const {
      classNameClickDragButton,
      classNameIconSlideResize,
    } = this.classNames; 
    const { stringClickDragButton } = this.strings;
    const { localStorageControllerWidthKey } = this.system;
    const controllerLayer = this.getControllerLayer();
    const controllerLayerBoundingRectClient = controllerLayer.getBoundingClientRect();

    // const controllerLayerBoundingRectClient = controllerLayer.getBoundingClientRect();
    const sliderButton = document.createElement('button');
    sliderButton.classList.add(classNameClickDragButton);
    sliderButton.classList.add(classNameIconSlideResize);
    sliderButton.setAttribute("aria-label", stringClickDragButton);

    // Flag to indicate whether the mouse button is pressed
    let isMouseDown = false;

    // Add the mousedown event listener to the button
    sliderButton.addEventListener('mousedown', function(event) {
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

    // return sliderButton;
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
    const {
      classNameSelectedElementInfo,
      classNameSelectedElementInfoTextContent,
    } = this.classNames;

    // Clear legacy information showing in the suggestions layer.
    const selectedElementInfoLayer = this.getSelectedElementInfoLayer();
    selectedElementInfoLayer.innerHTML = '';

    // If suggestions are available, display them.
    if (
      selectedThemeElement !== null &&
      selectedThemeElement.hasOwnProperty('propertyHook') &&
      selectedThemeElement.propertyHook !== null
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
