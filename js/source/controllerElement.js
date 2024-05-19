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
    idControllerElementTemplateFilePath: 'visual-debugger--controller-layer--template-file-path',
  },

  // Class names for the controller layer.
  classNames: {
    classNameVisualDebugger: 'visual-debugger',
    classNameBaseLayer: 'visual-debugger--controller',
    classNameBaseLayerActivated: 'visual-debugger--activated',
    classNameBaseLayerDeactivated: 'visual-debugger--deactivated',
    classNameForm: 'activation-form',
    classNameFormWrapper: 'activation-form-wrapper',
    classNameSelectedElementLayer: 'selected-element',
    classNameSelectedElementInfoWrapper: 'selected-element__info-wrapper',
    classNameSelectedElementInfo: 'selected-element__info',
    classNameSelectedElementInfoTextContent: 'tag',
    classNameSelectedElementInfoObjectType: 'tag--object-type',
    classNameSelectedElementInfoPropertyHook: 'tag--prop-hook',
    classNameSelectedElementSuggestionsWrapper: 'selected-element__suggestions-wrapper',
    classNameSelectedElementSuggestions: 'selected-element__suggestions',
    classNameSelectedElementSuggestionsSuggestion: 'suggestion',
    classNameSelectedElementTemplateFilePathWrapper: 'selected-element__template-file-path-wrapper',
    classNameSelectedElementTemplateFilePath: 'selected-element__template-file-path',
    classNameSelectedElementTemplateFilePathLabel: 'label',
    classNameContentCopyData: 'content-copy-data',
    classNameContentCopyDataLabel: 'content-copy-data__label',
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
    stringTemplateFilePath: Drupal.t('Template File Path'),
    stringFolderPath: Drupal.t('Folder path'),
    stringFilePath: Drupal.t('File path'),
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

  prepareContentCopyData(itemLabel, itemLabelClass, itemContent) {

    // Configuration
    const { body } = this;
    const self = this;
    const {
      stringCopyToClipboard,
    } = this.strings;
    const {
      classNameContentCopyData,
      classNameIconCopyToClipboard
    } = this.classNames;

    // Elements
    const itemWrapper = document.createElement('div');
    const itemLabelWrapper = document.createElement('div');
    const clipboardContent = document.createElement('pre');
    const clipboardButton = document.createElement('button');

    // Label and content
    itemWrapper.classList.add(classNameContentCopyData);
    itemLabelWrapper.classList.add(
      itemLabelClass
    );
    itemLabelWrapper.textContent = itemLabel;
    clipboardContent.textContent = itemContent;

    // Copy-to-clipboard button.
    clipboardButton.classList.add(classNameIconCopyToClipboard);
    clipboardButton.setAttribute('aria-label', stringCopyToClipboard);
    clipboardButton.addEventListener('click', function() {
      self.clipboardCopy(clipboardContent.textContent);
    });

    itemWrapper.append(
      itemLabelWrapper,
      clipboardContent,
      clipboardButton
    );

    return itemWrapper;
  },

  /**
   * Copies the given text to the clipboard.
   * @param {string} textToCopy
   * @return {void}
   */
  clipboardCopy(textToCopy) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
    } else {
      const { body } = this;
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      body.removeChild(textarea);
    }
  },

  // Generate the controller layer; this is the main component structure.
  generateControllerLayer() {
    const {
      classNameVisualDebugger,
      classNameBaseLayer,
      classNameForm,
      classNameFormWrapper,
      classNameIconEye,
      classNameIconControllerActivated,
      classNameIconEyeBlocked,
      classNameIconControllerDeactivated,
    } = this.classNames

    const { controllerActivatedAttributeName } = this.layerAttributes;

    const { stringActivateDebugger } = this.strings;

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
    const selectedElementLayer = this.generateSelectedElementLayer();

    // Append everything to the controller layer.
    controllerLayer.classList.add(
      classNameVisualDebugger,
      classNameBaseLayer
    );

    // Slider controller.
    controllerLayer.style.width =
      localStorage.getItem(localStorageControllerWidthKey) || initialControllerWidth;

    // Activation checkbox form.
    controllerLayer.appendChild(formElement);

    // Selected element layer.
    controllerLayer.appendChild(selectedElementLayer);

    // Load the controller layer just created to the current object.
    this.setControllerLayer(controllerLayer);

    // Return
    return controllerLayer;
  },

  generateSelectedElementLayer() {
    const selectedElementLayer = document.createElement('div');
    const selectedElementLayerTitle = document.createElement('h3');
    const {
      classNameSelectedElementLayer,
      classNameSelectedElementInfoWrapper,
      classNameSelectedElementInfo,
      classNameSelectedElementSuggestionsWrapper,
      classNameSelectedElementSuggestions,
      classNameSelectedElementTemplateFilePathWrapper,
      classNameSelectedElementTemplateFilePath,
    } = this.classNames;
    const {
      idControllerElementInfo,
      idControllerElementSuggestions,
    } = this.ids;
    const {
      stringSelectedElement,
      stringBasicInfo,
      stringThemeSuggestions,
      stringTemplateFilePath,
    } = this.strings;

    selectedElementLayer.classList.add(classNameSelectedElementLayer);
    selectedElementLayerTitle.textContent = stringSelectedElement;
    selectedElementLayer.appendChild(selectedElementLayerTitle);
    selectedElementLayer.appendChild(document.createElement('hr'));

    // Selected element basic info.
    const selectedElementBasicInfoWrapper = document.createElement('div');
    const selectedElementBasicInfo = document.createElement('div');
    const selectedElementBasicInfoTitle = document.createElement('h4');
    selectedElementBasicInfoWrapper.classList.add(classNameSelectedElementInfoWrapper);
    selectedElementBasicInfo.setAttribute('id', idControllerElementInfo);
    selectedElementBasicInfo.classList.add(classNameSelectedElementInfo);
    selectedElementBasicInfoTitle.textContent = stringBasicInfo;
    selectedElementBasicInfoWrapper.append(
      selectedElementBasicInfoTitle,
      selectedElementBasicInfo
    );

    // Theme suggestions layer.
    const selectedElementSuggestionsWrapper = document.createElement('div');
    const selectedElementSuggestionsLayer = document.createElement('div');
    const selectedElementSuggestionsLayerTitle = document.createElement('h4');
    selectedElementSuggestionsWrapper.classList.add(classNameSelectedElementSuggestionsWrapper);
    selectedElementSuggestionsLayer.setAttribute('id', idControllerElementSuggestions);
    selectedElementSuggestionsLayer.classList.add(classNameSelectedElementSuggestions);
    selectedElementSuggestionsLayerTitle.textContent = stringThemeSuggestions;
    selectedElementSuggestionsWrapper.append(
      selectedElementSuggestionsLayerTitle,
      selectedElementSuggestionsLayer
    );

    // Theme file path.
    const selectedElementTemplateFilePathWrapper = document.createElement('div');
    const selectedElementTemplateFilePath = document.createElement('div');
    const selectedElementTemplateFilePathTitle = document.createElement('h4');
    selectedElementTemplateFilePathWrapper.classList.add(classNameSelectedElementTemplateFilePathWrapper);
    selectedElementTemplateFilePath.classList.add(classNameSelectedElementTemplateFilePath);
    selectedElementTemplateFilePath.setAttribute('id', this.ids.idControllerElementTemplateFilePath);
    selectedElementTemplateFilePathTitle.textContent = stringTemplateFilePath;
    selectedElementTemplateFilePathWrapper.append(
      selectedElementTemplateFilePathTitle,
      selectedElementTemplateFilePath,
    );

    // Append everything to the selected element layer.
    selectedElementLayer.append(
      selectedElementBasicInfoWrapper,
      selectedElementSuggestionsWrapper,
      selectedElementTemplateFilePathWrapper
    );

    // Return
    return selectedElementLayer;
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

      requestAnimationFrame(() => {
        // Calculate the new width based on the current mouse position
        const newWidth =
          controllerLayerBoundingRectClient.width
            + controllerLayerBoundingRectClient.left
            - event.clientX;
    
        // Update the width of the controller element
        controllerLayer.style.width = `${newWidth}px`;
      });
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

  getSelectedElementTemplateFilePathLayer() {
    return this.getControllerLayer().querySelector(
      `#${this.ids.idControllerElementTemplateFilePath}`
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
    const {
      classNameIconSelectedTrue,
      classNameIconSelectedFalse
    } = this.classNames;

    // Clear legacy information showing in the suggestions layer.
    selectedElementSuggestionsLayer.innerHTML = '';

    // If suggestions are available, display them.
    if (
        selectedThemeElement &&
        selectedThemeElement.hasOwnProperty('suggestions') &&
        selectedThemeElement.suggestions !== null
    ) {
      const clipboardContent = selectedThemeElement.suggestions;
      clipboardContent.forEach((item) => {
        const themeSuggestion = this.prepareContentCopyData(
          null,
          item.activated
            ? classNameIconSelectedTrue
            : classNameIconSelectedFalse,
          item.suggestion,
        );
        selectedElementSuggestionsLayer.appendChild(themeSuggestion);
      });
    }
  },

  setSelectedElementTemplateFilePath() {
    const selectedThemeElement = this.getSelectedThemeElement();
    const selectedElementTemplateFilePathWrapper = this.getSelectedElementTemplateFilePathLayer();
    const {
      classNameSelectedElementTemplateFilePath,
      classNameSelectedElementTemplateFilePathLabel
    } = this.classNames;
    const { stringFilePath } = this.strings;

    // Clear legacy information showing in the suggestions layer.
    selectedElementTemplateFilePathWrapper.innerHTML = '';

    // If suggestions are available, display them.
    if (
        selectedThemeElement &&
        selectedThemeElement.hasOwnProperty('filePath') &&
        selectedThemeElement.filePath !== null
    ) {
      const filePath = selectedThemeElement.filePath;
      const filePathWrapper = this.prepareContentCopyData(
        stringFilePath,
        classNameSelectedElementTemplateFilePathLabel,
        filePath,
        classNameSelectedElementTemplateFilePath
      );
      selectedElementTemplateFilePathWrapper.appendChild(filePathWrapper);
    }
  },

  updateSelectedElement() {
    this.setSelectedElementInfo();
    this.setSelectedElementSuggestions();
    this.setSelectedElementTemplateFilePath();
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
