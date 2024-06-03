/**
 * Single controller window that displays information on each of the layers
 * being inspected.
 */
Drupal.controllerElement = {

  // Body
  body: document.body,

  // Utilities
  utilities: Drupal.vdUtilities,

  // The object properties.
  activated: false,
  activeThemeElement: null,
  defaultThemeElement: null,
  controllerLayer: null,
  baseLayer: null,
  tabs: null,

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
    idControllerElementSelected: 'visual-debugger--controller-layer--selected',
    idControllerElementInfo: 'visual-debugger--controller-layer--info',
    idControllerElementSuggestions: 'visual-debugger--controller-layer--suggestions',
    idControllerElementList: 'visual-debugger--controller-layer--list',
    idControllerElementTemplateFilePath: 'visual-debugger--controller-layer--template-file-path',
    idControllerActiveElementInfo: 'visual-debugger--controller--active-element--info',
    idControllerActivationCheckbox: 'debuggerActivationCheckbox',
  },

  // Class names for the controller layer.
  classNames: {
    classNameVisualDebugger: 'visual-debugger',
    classNameBaseLayer: 'visual-debugger--controller',
    classNameBaseLayerActivated: 'visual-debugger--activated',
    classNameBaseLayerDeactivated: 'visual-debugger--deactivated',
    classNameForm: 'activation-form',
    classNameFormWrapper: 'activation-form-wrapper',
    classNameContent: 'content-auto-scroll',
    classNameElementInfoTextContent: 'tag',
    classNameElementInfoEmpty: 'tag--empty',
    classNameElementInfoObjectType: 'tag--object-type',
    classNameElementInfoPropertyHook: 'tag--prop-hook',
    classNameActiveElementLayer: 'active-element',
    classNameActiveElementInfo: 'active-element__info',
    classNameTabsNavigation: 'tabbed-navigation',
    classNameTabsNavigationTab: 'tabbed-navigation__tab',
    classNameSelectedElement: 'selected-element',
    classNameSelectedElementContent: 'selected-element__content',
    classNameSelectedElementInfoWrapper: 'selected-element__info-wrapper',
    classNameSelectedElementInfo: 'selected-element__info',
    classNameSelectedElementSuggestionsWrapper: 'selected-element__suggestions-wrapper',
    classNameSelectedElementSuggestions: 'selected-element__suggestions',
    classNameSelectedElementSuggestionsSuggestion: 'suggestion',
    classNameSelectedElementTemplateFilePathWrapper: 'selected-element__template-file-path-wrapper',
    classNameSelectedElementTemplateFilePath: 'selected-element__template-file-path',
    classNameSelectedElementTemplateFilePathLabel: 'label',
    classNameListElement: 'list',
    classNameListElementContent: 'list__content',
    classNameListElementItem: 'list-item',
    classNameListElementItemActivation: 'list-item__activation',
    classNameListElementItemVisibility: 'list-item__visibility',
    classNameAggregateElement: 'aggregate',
    classNameTarget: 'nav-target',
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
    classNameCheckboxToggle: 'checkbox-toggle',
    classNameActivated: 'item-activated',
    classNameDeactivated: 'item-deactivated',
    classNameObjectTypeTyped: (objectType) => `object-type--${objectType}`,
  },

  // layerAttributes.
  layerAttributes: {
    controllerActivatedAttributeName: 'data-vd-controller-activated',
  },

  // Drupal translatable strings for the controller layer.
  strings: {
    stringCopyToClipboard: Drupal.t('Copy to clipboard'),
    stringDeactivateDebugger: Drupal.t('Deactivate debugger'),
    stringSelectedElement: Drupal.t('Selected Element'),
    stringTabLabelSelected: Drupal.t('Selected'),
    stringTabLabelList: Drupal.t('List'),
    stringTabLabelAggregate: Drupal.t('Aggregate'),
    stringBasicInfo: Drupal.t('Object Type'),
    stringThemeSuggestions: Drupal.t('Theme Suggestions'),
    stringClickDragButton: Drupal.t('Click and drag to resize'),
    stringTemplateFilePath: Drupal.t('Template File Path'),
    stringFolderPath: Drupal.t('Folder path'),
    stringFilePath: Drupal.t('File path'),
    stringActiveElement: Drupal.t('Active Element'),
    stringNoActiveElement : Drupal.t('No active element.'),
    stringNoSelectedElement : Drupal.t('No selected element.'),
  },

  system: {
    localStorageDebuggerActivatedKey: 'debuggerActivated',
    localStorageControllerWidthKey: 'controllerWidth',
  },

  /**
   * Getter for the controller object.
   * @returns 
   */
  getControllerLayer() {
    return this.controllerLayer;
  },

  /**
   * Setter for the controller object.
   * @param {object} controllerLayer
   *   The controller object.
   */
  setControllerLayer(controllerLayer) {
    this.controllerLayer = controllerLayer;
  },

  observeInstanceLayerChanges() {
    const self = this;
    const { themeDebugNodes } = this;
    const {
      layerTargetIdAttributeName,
      instanceLayerActivatedAttributeName
    } = this.utilities.layerAttributes;

    // Observer configuration.
    const observerConfig = {
      attributes: true,
      attributeFilter: [instanceLayerActivatedAttributeName],
    };

    // Observer callback function.
    const observerCallback = function(mutations) {
      mutations.forEach((mutation) => {
        const defaultLayer = mutation.target.getAttribute(instanceLayerActivatedAttributeName) === 'true';

        // Affect only checked elements.
        if (!defaultLayer) return;

        const targetId = mutation.target.getAttribute(layerTargetIdAttributeName);
      });
    };

    // Observer instantiation.
    const observer = new MutationObserver(observerCallback);

    // Observe each instance layer.
    themeDebugNodes.forEach((node) => {
      const instanceLayer = node.instanceLayer;
      observer.observe(instanceLayer, observerConfig);
    });
  },

  /**
   * Controller initialization.
   * 
   * @param {object} baseLayer
   *   The base layer object.
   * @param {object} themeDebugNodes
   *   Carries relevant information on the instance layers.
   * @return void
   */
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

  // 
  /**
   * Toggle the debugger activation and update localStorage.
   * 
   * @param {boolean} activated
   *   The activation status.
   */
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

  /**
   * Generates a structure with copy-to-clipboard capability.
   * 
   * @param {*} itemLabel 
   * @param {*} itemLabelClass 
   * @param {*} itemContent 
   * @returns {object}
   *   The copy-to-clipboard object.
   */
  generateContentCopyData(itemLabel, itemLabelClass, itemContent) {

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
    const clipboardContent = document.createElement('input');
    const clipboardButton = document.createElement('button');

    // Label and content
    itemWrapper.classList.add(classNameContentCopyData);
    itemLabelWrapper.classList.add(
      itemLabelClass
    );
    itemLabelWrapper.textContent = itemLabel;
    clipboardContent.value = itemContent;
    clipboardContent.readOnly = true;

    // Copy-to-clipboard button.
    clipboardButton.classList.add(classNameIconCopyToClipboard);
    clipboardButton.setAttribute('aria-label', stringCopyToClipboard);
    clipboardButton.addEventListener('click', function() {
      self.clipboardCopy(clipboardContent);
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
  clipboardCopy(contentRefField) {
    const textToCopy = contentRefField.textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
    } else {
      contentRefField.select();
      document.execCommand('copy');
      contentRefField.focus();
    }
  },

  /**
   * Generates the controller layer with all its components.
   * 
   * @returns {object}
   *   The controller layer with all its components. 
   */
  generateControllerLayer() {
    const {
      classNameVisualDebugger,
      classNameBaseLayer,
      classNameForm,
      classNameFormWrapper,
      classNameCheckboxToggle,
      classNameActivated,
      classNameIconEye,
      classNameIconControllerActivated,
      classNameDeactivated,
      classNameIconEyeBlocked,
      classNameIconControllerDeactivated,
      classNameContent,
    } = this.classNames

    const { idControllerActivationCheckbox } = this.ids;

    const { controllerActivatedAttributeName } = this.layerAttributes;

    const { stringDeactivateDebugger } = this.strings;

    const self = this;

    // Create the controller layer.
    const controllerLayer = document.createElement('div');
    controllerLayer.classList.add(
      classNameVisualDebugger,
      classNameBaseLayer
    );

    // Create the controller content layer.
    const controllerContentLayer = document.createElement('div');
    controllerContentLayer.classList.add(classNameContent);

    // Create a checkbox input element for debugger activation
    const debuggerActivationCheckbox = document.createElement('input');
    debuggerActivationCheckbox.type = 'checkbox';
    debuggerActivationCheckbox.id = idControllerActivationCheckbox;
    debuggerActivationCheckbox.classList.add(classNameCheckboxToggle);

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
    iconSelectedTrue.classList.add(
      classNameIconEye,
      classNameActivated,
      classNameIconControllerActivated
    );
    const iconSelectedFalse = document.createElement('span');
    iconSelectedFalse.classList.add(
      classNameIconEyeBlocked,
      classNameDeactivated,
      classNameIconControllerDeactivated
    );

    // Create a label element for the debugger activation checkbox.
    const debuggerDeactivationLabel = document.createElement('label');
    debuggerDeactivationLabel.setAttribute('for', debuggerActivationCheckbox.id)
    debuggerDeactivationLabel.textContent = stringDeactivateDebugger;

    // Create a wrapper div for the activation elements within the form.
    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add(classNameFormWrapper);
    wrapperDiv.append(
      debuggerActivationCheckbox,
      iconSelectedTrue,
      iconSelectedFalse,
      debuggerDeactivationLabel
    );

    // Append the wrapper div to the form.
    const formElement = document.createElement('form');
    formElement.classList.add(classNameForm);
    formElement.appendChild(wrapperDiv);

    // Active element layer.
    const activeElementLayer = this.generateActiveElementLayer();

    // Create the tabbed navigation layer.
    const tabbedNavigation = this.generateTabbedNavigation();

    // Selected element layer.
    const selectedElementLayer = this.generateSelectedElementLayer();

    // List element layer.
    const listElementLayer = this.generateListElementLayer();

    // Selected element layer.
    controllerContentLayer.append(
      activeElementLayer,
      tabbedNavigation,
      selectedElementLayer,
      listElementLayer,
    );
    
    controllerLayer.append(
      formElement,
      controllerContentLayer
    );

    // Load the controller layer just created to the current object.
    this.setControllerLayer(controllerLayer);

    // Return
    return controllerLayer;
  },

  /**
   * Calculates an initial width for the controller.
   * 
   * @returns {string}
   *   A string that represents the initial width of the controller.
   */
  calculateInitialControllerWidth() {
    const { initialControllerWidth } = this.constants;
    const { localStorageControllerWidthKey } = this.system;
    const { controllerLayer } = this;
  
    const initialControllerWidthOnLocalStorage =
      localStorage.getItem(localStorageControllerWidthKey) || initialControllerWidth;
    let outputWidth = initialControllerWidthOnLocalStorage;

    // Get max-width assigned to the controller layer.
    const screenWidth = window.innerWidth;
    const controllerLayerStyle = window.getComputedStyle(controllerLayer);
    const maxWidth = controllerLayerStyle.getPropertyValue('max-width');
  
    if (maxWidth) {
      let maxWidthValue = parseFloat(maxWidth);
      const initialControllerWidthOnLocalStorageValue =
        parseFloat(initialControllerWidthOnLocalStorage);

      outputWidth =
        (maxWidth.endsWith('%'))
          ?
            Math.min(
              (maxWidthValue / 100) * screenWidth,
              initialControllerWidthOnLocalStorageValue
            )
          : Math.min(
              screenWidth,
              maxWidthValue,
              initialControllerWidthOnLocalStorageValue
            );
    }

    controllerLayer.style.width = `${outputWidth}px`;
  },

  /**
   * Generates the base container where the hovered element is displayed.
   */
  generateActiveElementLayer() {
    const {
      classNameActiveElementLayer,
      classNameActiveElementInfo,
    } = this.classNames;
    const {
      idControllerActiveElementInfo,
    } = this.ids;
    const {
      stringActiveElement,
    } = this.strings;

    // Active element layer.
    const activeElementLayer = document.createElement('div');
    activeElementLayer.classList.add(classNameActiveElementLayer);

    // Active element title.
    const activeElementLayerTitle = document.createElement('h3');
    activeElementLayerTitle.textContent = stringActiveElement;

    // Active element basic info.
    const activeElementLayerBasicInfo = document.createElement('div');
    activeElementLayerBasicInfo.setAttribute('id', idControllerActiveElementInfo);
    activeElementLayerBasicInfo.classList.add(classNameActiveElementInfo);

    // Load everything to the active element layer.
    activeElementLayer.append(
      activeElementLayerTitle,
      activeElementLayerBasicInfo,
    );

    return activeElementLayer;
  },

  /**
   * Updates the active tab and deactivates siblings.
   * @param {*} tabElement 
   * @param {*} tabId 
   */
  switchToTab(tabId) {

    // Button tab.
    const tabElement = document.querySelector(
      `[data-target-tab='${tabId}']`
    );

    // Target layer to be activated.
    const targetLayer = this.getControllerLayer().querySelector(
      `#${tabId}`
    );

    // Halt execution if 
    if (tabElement === null || targetLayer === null) return;

    // Update tab and target states.
    tabElement.classList.add('active');
    targetLayer.classList.add('active');

    // Deactivate siblings.
    const deactivateSiblings = (refLayer) => {
      const siblings = this.utilities.getSiblings(refLayer);
      siblings.forEach((sibling) => {
        sibling.classList.remove('active');
      });
    }
    deactivateSiblings(tabElement);
    deactivateSiblings(targetLayer);
  },

  /**
   * Generates the tabbed navigation structure.
   * @returns {object}
   *   The tabbed navigation structure with tabs within.
   */
  generateTabbedNavigation() {
    const {
      classNameTabsNavigation,
      classNameTabsNavigationTab,
    } = this.classNames;

    const {
      stringTabLabelSelected,
      stringTabLabelList,
    } = this.strings;

    const {
      idControllerElementSelected,
      idControllerElementList,
    } = this.ids;

    // Create the tabs.
    const tabs = [
      {
        label: stringTabLabelSelected,
        id: idControllerElementSelected,
      },
      {
        label: stringTabLabelList,
        id: idControllerElementList,
      },
    ];

    // Creates a tabs wrapper.
    const tabsNavigation = document.createElement('div');
    tabsNavigation.classList.add(classNameTabsNavigation);

    // creates one button per tab.
    tabs.forEach((tab) => {
      const tabElement = document.createElement('button');
      tabElement.setAttribute('data-target-tab', tab.id);
      tabElement.setAttribute('aria-label', tab.label);
      tabElement.classList.add(classNameTabsNavigationTab);
      tabElement.textContent = tab.label;
      tabElement.addEventListener('click', () => {
        this.switchToTab(tab.id);
      });
      tabsNavigation.appendChild(tabElement);
    });

    // Fills a variable with the tabs list.
    this.tabs = tabs;

    return tabsNavigation;
  },

  /**
   * Generates the selected element layer with all its components.
   * 
   * @returns {object}
   *   The selected element layer.
   */
  generateSelectedElementLayer() {
    const {
      classNameSelectedElement,
      classNameSelectedElementContent,
      classNameSelectedElementInfoWrapper,
      classNameSelectedElementInfo,
      classNameSelectedElementSuggestionsWrapper,
      classNameSelectedElementSuggestions,
      classNameSelectedElementTemplateFilePathWrapper,
      classNameSelectedElementTemplateFilePath,
      classNameTarget,
    } = this.classNames;
    const {
      idControllerElementSelected,
      idControllerElementInfo,
      idControllerElementSuggestions,
    } = this.ids;
    const {
      stringSelectedElement,
      stringBasicInfo,
      stringThemeSuggestions,
      stringTemplateFilePath,
    } = this.strings;

    const selectedElementLayer = document.createElement('div');
    const selectedElementLayerContent = document.createElement('div');
    const selectedElementLayerTitle = document.createElement('h3');
    selectedElementLayer.classList.add(
      classNameSelectedElement,
      classNameTarget
    );
    selectedElementLayer.setAttribute('id', idControllerElementSelected);
    selectedElementLayerTitle.textContent = stringSelectedElement;
    selectedElementLayerContent.classList.add(classNameSelectedElementContent);

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

    // Append relevant information to the content layer.
    selectedElementLayerContent.append(
      selectedElementBasicInfoWrapper,
      selectedElementSuggestionsWrapper,
      selectedElementTemplateFilePathWrapper
    );

    // Append everything to the selected element layer.
    selectedElementLayer.append(
      selectedElementLayerTitle,
      selectedElementLayerContent,
    );

    // Return
    return selectedElementLayer;
  },

  /**
   * Generates a list of template layers on the current page.
   * @returns {object}
   *   The wrapper layer with all the template layers.
   */
  generateListElementLayer() {
    const {
      classNameListElement,
      classNameListElementContent,
      classNameTarget,
      classNameListElementItem,
      classNameListElementItemActivation,
      classNameListElementItemVisibility,
      classNameIconEye,
      classNameIconEyeBlocked,
    } = this.classNames;

    const {
      classNameCheckboxToggleWrapper,
      classNameInputWrapperDisabled,
    } = this.utilities.classNames;

    const { idControllerElementList } = this.ids;

    const { stringTabLabelList } = this.strings;

    const {
      layerTargetIdAttributeName,
      listItemActivatedAttributeName,
      layerAttributeIsVisible,
    } = this.utilities.layerAttributes;

    const themeDebugNodes = this.themeDebugNodes;

    // Wrapper
    const listElementLayer = document.createElement('div');
    listElementLayer.classList.add(
      classNameListElement,
      classNameTarget,
    );
    listElementLayer.setAttribute('id', idControllerElementList);

    // Title
    const listElementLayerTitle = document.createElement('h3');
    listElementLayerTitle.textContent = stringTabLabelList;

    // Content
    const listElementLayerContent = document.createElement('div');
    listElementLayerContent.classList.add(classNameListElementContent);

    // Append Title and Content to the wrapper.
    listElementLayer.append(
      listElementLayerTitle,
      listElementLayerContent,
    );

    // Prepare the list of nodes.
    themeDebugNodes.forEach((node) => {

      const listElementItem = document.createElement('div');
      listElementItem.classList.add(classNameListElementItem);

      // Generates an on/off switcher for item activation.
      const defaultElementSwitcher = this.utilities.generateOnOffSwitch(
        node.instanceActiveElement.propertyHook,
        false,
        [
          {
            eventListener: 'click',
            eventCallback: () => {
              if (node.listItemLayer.getAttribute(layerAttributeIsVisible) === 'true')
                node.instanceLayer.click();
            }
          },
          {
            eventListener: 'change',
            eventCallback: (event) => {
              // Toggle the checked and unchecked activation attribute.
              const parentNode = event.target.parentNode;
              parentNode.setAttribute(listItemActivatedAttributeName, event.target.checked);
            },
          }
        ],
        {
          [layerTargetIdAttributeName]: node.instanceLayer.getAttribute(layerTargetIdAttributeName),
          [listItemActivatedAttributeName]: false,
          [layerAttributeIsVisible]: true
        },
        [
          classNameListElementItemActivation,
          this.classNames.classNameObjectTypeTyped(node.instanceActiveElement.objectType),
        ]
      );

      // Generates an on/off switcher for item visibility.
      const elementActivator = this.utilities.generateOnOffSwitch(
        '',
        true,
        [
          {
            eventListener: 'click',
            eventCallback: (event) => {
              if (!event.target.classList.contains(classNameCheckboxToggleWrapper)) return;
              event.target.querySelector('input').click();
            },
          },
          {
            eventListener: 'change',
            eventCallback: (event) => {

              // Toggle activation class.
              node.listItemLayer.classList.toggle(classNameInputWrapperDisabled);
              node.listItemLayer.setAttribute(layerAttributeIsVisible, event.target.checked);

              // Get the list item selected input.
              const inputField = node.listItemLayer.querySelector('input');

              // Hide or show the instance layer depending on the visibility selector.
              if (event.target.checked) {
                node.showInstanceLayer();
              } else {
                node.hideInstanceLayer();
              }
            },
          }
        ],
        {
          [layerAttributeIsVisible]: true,
        },
        [ classNameListElementItemVisibility ],
        classNameIconEye,
        classNameIconEyeBlocked
      );

      // Append the switcher element to the instance of themeDebugNodes.
      node.listItemLayer = defaultElementSwitcher;

      // Append the switcher to the list item, and then to the list content.
      listElementItem.append(
        defaultElementSwitcher,
        elementActivator
      );
      listElementLayerContent.appendChild(listElementItem);
    });

    return listElementLayer;
  },

  /**
   * Update the controller position depending on its activation status.
   */
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

  /**
   * Execute post activation tasks.
   */
  executePostActivation() {
    this.generateSliderButton();
    this.calculateInitialControllerWidth();
    this.checkControllerActivation();
    this.updateActiveElement();
    this.updateSelectedElement('selected');
    this.setSelectedElementSuggestions();
    this.setSelectedElementTemplateFilePath();
    this.switchToTab(this.ids.idControllerElementSelected);
  },

  /**
   * Generate a slider button.
   */
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
      self.resizeControllerLayer(event.clientX);
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

  /**
   * Sets a new width for the controller layer.
   */
  resizeControllerLayer(mousePosition = 0) {

    const { controllerLayer } = this;
    const controllerLayerBoundingRectClient = controllerLayer.getBoundingClientRect();

    // Calculate the new width based on the current mouse position
    requestAnimationFrame(() => {
      const newWidth =
        controllerLayerBoundingRectClient.width
        + controllerLayerBoundingRectClient.left
        - mousePosition;

      // Update the width of the controller element
      controllerLayer.style.width = `${newWidth}px`;
    });
  },

  /**
   * Raises information on controller component activation status.
   * 
   * @returns {boolean}
   *   The activation status of the controller component.
   */
  getControllerActivationStatus() {
    const { controllerActivatedAttributeName } = this.layerAttributes;
    const controllerLayer = this.getControllerLayer();
    return controllerLayer.getAttribute(controllerActivatedAttributeName) === 'true';
  },

  // Setter methods.
  setActivated() {
    this.activated = true;
  },

  getActiveElementInfoLayer() {
    return this.getControllerLayer().querySelector(
      `#${this.ids.idControllerActiveElementInfo}`
    );
  },

  /**
   * Retrieves the node where the basic information is displayed.
   * 
   * @returns {object}
   *   The node where the basic information is displayed.
   */
  getSelectedElementInfoLayer() {
    return this.getControllerLayer().querySelector(
      `#${this.ids.idControllerElementInfo}`
    );
  },

  /**
   * Retrieves the node where the suggestions are displayed.
   * 
   * @returns {object}
   *   The node where the suggestions are displayed.
   */
  getSelectedElementSuggestionsLayer() {
    return this.getControllerLayer().querySelector(
      `#${this.ids.idControllerElementSuggestions}`
    );
  },

  /**
   * Retrieves the node where the file path layer is displayed.
   * 
   * @returns {object}
   *   The node where the file path layer is displayed.
   */
  getSelectedElementTemplateFilePathLayer() {
    return this.getControllerLayer().querySelector(
      `#${this.ids.idControllerElementTemplateFilePath}`
    );
  },

  /**
   * Establishes the element that is currently selected.
   * Active is priority; default comes right after; null if none.
   * 
   * @returns {object}
   *   The object to be displayed on the controller layer.
   */
  getSelectedThemeElement() {
    return this.activeThemeElement || 
      this.defaultThemeElement || 
      null;
  },

  /**
   * Set an element info block including object type and property hook.
   * @param {object} themeElement 
   * @param {array} classes 
   * @returns 
   */
  setElementInfo(themeElement, targetLayer, infoType = 'active') {

    // Clear legacy information showing in the suggestions layer.
    targetLayer.innerHTML = '';

    const {
      classNameElementInfoTextContent,
      classNameElementInfoObjectType,
      classNameElementInfoPropertyHook,
    } = this.classNames

    // Return early if the theme element is not available.
    if (themeElement === null) {
      const emptyTag = this.generateEmptyTag(infoType);
      targetLayer.append(emptyTag);
      return;
    }

    let objectTypeText = '';

    // If an object type is available, display it.
    if (
      themeElement.hasOwnProperty('objectType') &&
      themeElement.objectType !== null
    ) {
      const objectTypeWrapper = document.createElement('div');
      objectTypeWrapper.classList.add(
        classNameElementInfoTextContent,
        classNameElementInfoObjectType,
        `${classNameElementInfoObjectType}--${themeElement.objectType}`
      );

      objectTypeText = themeElement.objectType;
      objectTypeWrapper.textContent = objectTypeText;
      targetLayer.append(objectTypeWrapper);
    }

    // If a property hook is available, display it.
    if (
      themeElement.hasOwnProperty('propertyHook') &&
      themeElement.propertyHook !== null &&
      objectTypeText !== themeElement.propertyHook
    ) {
      const propertyHookWrapper = document.createElement('div');
      propertyHookWrapper.classList.add(
        classNameElementInfoTextContent,
        classNameElementInfoPropertyHook
      );
      propertyHookWrapper.textContent = themeElement.propertyHook;
      targetLayer.append(propertyHookWrapper);
    }
  },

  /**
   * Set the suggestions of the selected element.
   */
  setSelectedElementSuggestions() {
    const selectedThemeElement = this.defaultThemeElement;
    const selectedElementSuggestionsLayer = this.getSelectedElementSuggestionsLayer();
    const {
      classNameIconSelectedTrue,
      classNameIconSelectedFalse
    } = this.classNames;

    // Clear legacy information showing in the suggestions layer.
    selectedElementSuggestionsLayer.innerHTML = '';

    // Return early if the theme element is not available.
    if (selectedThemeElement === null) {
      const emptyTag = this.generateEmptyTag('selected');
      selectedElementSuggestionsLayer.append(emptyTag);
      return;
    }

    // If suggestions are available, display them.
    if (
        selectedThemeElement &&
        selectedThemeElement.hasOwnProperty('suggestions') &&
        selectedThemeElement.suggestions !== null
    ) {
      const clipboardContent = selectedThemeElement.suggestions;
      clipboardContent.forEach((item) => {
        const themeSuggestion = this.generateContentCopyData(
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

  /**
   * Set the file path of the selected element.
   */
  setSelectedElementTemplateFilePath() {
    const selectedThemeElement = this.defaultThemeElement;
    const selectedElementTemplateFilePathWrapper = this.getSelectedElementTemplateFilePathLayer();
    const {
      classNameSelectedElementTemplateFilePath,
      classNameSelectedElementTemplateFilePathLabel
    } = this.classNames;
    const { stringFilePath } = this.strings;

    // Clear legacy information showing in the suggestions layer.
    selectedElementTemplateFilePathWrapper.innerHTML = '';

    // Return early if the theme element is not available.
    if (selectedThemeElement === null) {
      const emptyTag = this.generateEmptyTag('selected');
      selectedElementTemplateFilePathWrapper.append(emptyTag);
      return;
    }

    // If suggestions are available, display them.
    if (
        selectedThemeElement &&
        selectedThemeElement.hasOwnProperty('filePath') &&
        selectedThemeElement.filePath !== null
    ) {
      const filePath = selectedThemeElement.filePath;
      const filePathWrapper = this.generateContentCopyData(
        stringFilePath,
        classNameSelectedElementTemplateFilePathLabel,
        filePath,
        classNameSelectedElementTemplateFilePath
      );
      selectedElementTemplateFilePathWrapper.appendChild(filePathWrapper);
    }
  },

  /**
   * An empty tag ready to be appended.
   * 
   * @param {string} infoType
   *   The type of information to be displayed.
   * @returns {object}
   *   The empty tag ready to be appended.
   */
  generateEmptyTag(infoType) {
    const {
      classNameElementInfoTextContent,
      classNameElementInfoEmpty,
    } = this.classNames

    const {
      stringNoActiveElement,
      stringNoSelectedElement,
    } = this.strings;

    const noInfoWrapper = document.createElement('div');

    noInfoWrapper.classList.add(
      classNameElementInfoTextContent,
      classNameElementInfoEmpty
    );

    noInfoWrapper.textContent = (infoType == 'active')
    ?
      stringNoActiveElement
      : stringNoSelectedElement;

    return noInfoWrapper;
  },

  /**
   * Handle the change of the selected list item.
   * 
   * @param {object} defaultThemeElement
   *   The default theme element being changed.
   * @param {boolean} selected
   *   True if the item is selected; false otherwise.
   */
  handleSelectedListItemChange(defaultThemeElement, selected = true) {

    const {
      classNameCheckboxToggle,
    } = this.classNames;

    const defaultThemeDebugNode = this.themeDebugNodes.find((node) => {
      return node.instanceActiveElement === defaultThemeElement;
    });

    // Get the checkbox toggle element within.
    const inputOnOffSwitch = defaultThemeDebugNode.listItemLayer.querySelector(`.${classNameCheckboxToggle}`);
    inputOnOffSwitch.click();

    // Scroll into view if the item is selected.
    if (selected) {
      inputOnOffSwitch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },

  /**
   * Update the selected element information.
   */
  updateActiveElement() {
    const elementInfoLayer = this.getActiveElementInfoLayer();
    this.setElementInfo(this.activeThemeElement, elementInfoLayer);
  },

  /**
   * Configure the active theme element.
   * 
   * @param {object} instanceLayerRef
   *   The instance layer being highlighted.
   */
  setActiveThemeElement(instanceLayerRef) {
    this.activeThemeElement = instanceLayerRef;
    this.updateActiveElement();
  },

  /**
   * Reset the active theme element.
   */
  resetActiveThemeElement() {
    this.activeThemeElement = null;
    this.updateActiveElement();
  },

  /**
   * Update the selected element information.
   */
  updateSelectedElement() {
    const elementInfoLayer = this.getSelectedElementInfoLayer();
    this.setElementInfo(
      this.defaultThemeElement,
      elementInfoLayer,
      'selected'
    );
    this.setSelectedElementSuggestions();
    this.setSelectedElementTemplateFilePath();
  },

  /**
   * Configure the default theme element.
   * 
   * @param {object} instanceLayerRef
   *   The instance layer being highlighted.
   */
  setDefaultThemeElement(instanceLayerRef) {
    this.defaultThemeElement = instanceLayerRef;
    this.updateSelectedElement();
    this.handleSelectedListItemChange(instanceLayerRef);
  },

  /**
   * Reset the default theme element.
   * 
   * @param {object} instanceLayerRef
   *   The deactivated layer.
   */
  resetDefaultThemeElement(instanceLayerRef) {
    this.defaultThemeElement = null;
    this.updateSelectedElement();
    this.handleSelectedListItemChange(instanceLayerRef, false);
  },
}
