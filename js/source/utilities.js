/**
 * Delivers reusable code and resources across the application.
 */
Drupal.vdUtilities = {

  // Element IDs.
  ids: {
    idControllerSelectedElementInfo: 'visual-debugger--controller--info',
    idControllerSelectedElementSuggestionsValue: 'visual-debugger--controller--suggestions',
    idControllerSelectedElementFilePathValue: 'visual-debugger--controller--file-path',
    idControllerSelectedElementCacheHit: 'visual-debugger--controller--cache-hit',
    idControllerSelectedElementCacheMaxAge: 'visual-debugger--controller--cache-max-age',
    idControllerSelectedElementCacheTags: 'visual-debugger--controller--cache-tags',
    idControllerSelectedElementCacheContexts: 'visual-debugger--controller--cache-contexts',
    idControllerSelectedElementCacheKeys: 'visual-debugger--controller--cache-keys',
    idControllerSelectedElementPreBubblingCacheTags: 'visual-debugger--controller--pre-bubbling-cache-tags',
    idControllerSelectedElementPreBubblingCacheContexts: 'visual-debugger--controller--pre-bubbling-cache-contexts',
    idControllerSelectedElementPreBubblingCacheKeys: 'visual-debugger--controller--pre-bubbling-cache-keys',
    idControllerSelectedElementPreBubblingCacheMaxAge: 'visual-debugger--controller--pre-bubbling-cache-max-age',
    idControllerSelectedElementRenderingTime: 'visual-debugger--controller--rendering-time',
  },

  // Class names.
  classNames: {
    classNameIconCheckboxChecked: 'icon-checkbox-checked',
    classNameIconCheckboxUnchecked: 'icon-checkbox-unchecked',
    classNameCheckboxToggleWrapper: 'checkbox-toggle-wrapper',
    classNameCheckboxToggle: 'checkbox-toggle',
    classNameInputActivated: 'item-activated',
    classNameInputDeactivated: 'item-deactivated',
    classNameInputWrapperActivated: 'wrapper-activated',
    classNameInputWrapperDeactivated: 'wrapper-deactivated',
    classNameInputWrapperDisabled: 'disabled',
    classNameSelectedElementInfoWrapper: 'content-item__info-wrapper',
    classNameSelectedElementInfo: 'content-item__info',
    classNameSelectedElementSuggestionsWrapper: 'content-item__suggestions-wrapper',
    classNameSelectedElementSuggestions: 'content-item__suggestions',
    classNameSelectedElementTemplateFilePathWrapper: 'content-item__template-file-path-wrapper',
    classNameSelectedElementTemplateFilePath: 'content-item__template-file-path',
    classNameSelectedElementTemplateFilePathLabel: 'label',
  },

  // layerAttributes.
  layerAttributes: {
    layerTargetIdAttributeName: 'data-vd-target-id',
    listItemActivatedAttributeName: 'data-vd-list-item-activated',
    instanceLayerActivatedAttributeName: 'data-vd-instance-layer-activated',
    layerAttributeIsVisible: 'data-vd-visible',
  },

  // Strings.
  strings: {
    stringThemeElementInfo: Drupal.t('Object Type'),
    stringThemeElementThemeSuggestions: Drupal.t('Theme Suggestions'),
    stringThemeElementFilePath: Drupal.t('Template File Path'),
    stringThemeElementFilePathInlineLabel: Drupal.t('File Path'),
    stringThemeElementCacheHit: Drupal.t('Cache Hit'),
    stringThemeElementCacheMaxAge: Drupal.t('Cache Max-Age'),
    stringThemeElementCacheTags: Drupal.t('Cache Tags'),
    stringThemeElementCacheContexts: Drupal.t('Cache Contexts'),
    stringThemeElementCacheKeys: Drupal.t('Cache Keys'),
    stringThemeElementPreBubblingCacheTags: Drupal.t('Pre-Bubbling Cache Tags'),
    stringThemeElementPreBubblingCacheContexts: Drupal.t('Pre-Bubbling Cache Contexts'),
    stringThemeElementPreBubblingCacheKeys: Drupal.t('Pre-Bubbling Cache Keys'),
    stringThemeElementPreBubblingCacheMaxAge: Drupal.t('Pre-Bubbling Cache Max-Age'),
    stringThemeElementRenderingTime: Drupal.t('Rendering Time'),
  },

  /**
   * Gets all siblings of a given element.
   * @param {object} element 
   * @returns {array}
   *   An array of sibling elements.
   */
  getSiblings(element) {
    const parent = element.parentNode;
    const children = Array.from(parent.children);
    return children.filter(child => child !== element);
  },

  // Setter methods.
  generateUniqueIdentifier: () => `element-${Math.random().toString(36).substring(7)}`,

  /**
   * Generates an on/off switch with a callback event on 'change'.
   * @param {string} label
   *   The label for the switch.
   * @param {boolean} activated
   *   Sets the default initial state.
   * @param {array} eventListeners
   *   An array of object pairs consisting on listeners and callbacks.
   * @param {object} wrapperAttributesList
   *   The attributes to be added to the wrapper div.
   * @param {string} IconOn
   *   The class name for the icon when activated.
   * @param {string} IconOff 
   *   The class name for the icon when deactivated.
   * @returns {object}
   *   An HTML element containing the on/off input and its parts.
   */
  generateOnOffSwitch(
    label,
    activated = true,
    eventListeners = null,
    wrapperAttributesList = [],
    wrapperClassList = [],
    IconOn = this.classNames.classNameIconCheckboxChecked,
    IconOff = this.classNames.classNameIconCheckboxUnchecked,
  ) {
    const {
      classNameCheckboxToggleWrapper,
      classNameCheckboxToggle,
      classNameInputActivated,
      classNameInputDeactivated,
      classNameInputWrapperActivated,
      classNameInputWrapperDeactivated,
    } = this.classNames;

    const self = this;

    const checkboxUniqueId = this.generateUniqueIdentifier();

    // Create a wrapper div for the activation elements within the form.
    const wrapperDiv = document.createElement('div');
    for (let key in wrapperAttributesList) {
      wrapperDiv.setAttribute(key, wrapperAttributesList[key]);
    }
    wrapperDiv.classList.add(
      ...wrapperClassList,
      classNameCheckboxToggleWrapper,
      classNameInputWrapperDeactivated,
    );

    // Create a checkbox input element for debugger activation
    const itemInput = document.createElement('input');
    itemInput.type = 'checkbox';
    itemInput.id = checkboxUniqueId;
    itemInput.style.pointerEvents = 'none';
    itemInput.classList.add(classNameCheckboxToggle);

    // Applies the initial controller state based on default value received.
    itemInput.checked = activated;

    // If requested, attach a 'click' event listener on the wrapper div.
    if (eventListeners !== null) {
      eventListeners.forEach((eventListener) => {
        wrapperDiv.addEventListener(
          eventListener.eventListener,
          eventListener.eventCallback
        );
      });
      // wrapperDiv.addEventListener('click', clickEventListener);
    }

    // Attach default 'change' event listener to the checkbox.
    itemInput.addEventListener('change', () => {
      wrapperDiv.classList.toggle(classNameInputWrapperActivated);
      wrapperDiv.classList.toggle(classNameInputWrapperDeactivated);
    });

    // Create icons for the debugger activation checkbox.
    const createIconElement = (iconClass, activatedClass) => {
      const iconElement = document.createElement('span');
      iconElement.style.pointerEvents = 'none';
      iconElement.classList.add(iconClass, activatedClass);
      return iconElement;
    }
    const iconSelectedTrue = createIconElement(IconOn, classNameInputActivated);
    const iconSelectedFalse = createIconElement(IconOff, classNameInputDeactivated);

    wrapperDiv.append(
      itemInput,
      iconSelectedTrue,
      iconSelectedFalse
    );

    // Create a label element for the debugger activation checkbox.
    if (label.length > 0) {
      const itemLabel = document.createElement('label');
      itemLabel.setAttribute('for', checkboxUniqueId);
      itemLabel.style.pointerEvents = 'none';
      itemLabel.textContent = label;
      wrapperDiv.appendChild(itemLabel);
    }

    return wrapperDiv;
  },

  /**
    * Filters all checked nodes.
    * @param {array}
    *   An array of nodes to be analyzed.
    * @returns {boolean}
    *   An array of nodes.
    */
  getCheckedNodes(nodes) {
    const { classNameInputWrapperActivated } = this.classNames; 
    return nodes.filter((node) => {
      return node.classList.contains(classNameInputWrapperActivated);
    });
  },


  getNodesWithCache(nodes) {
    return nodes.filter(node => node.instanceActiveElement.cacheHit);
  }
}