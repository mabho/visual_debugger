/**
 * Delivers reusable code and resources across the application.
 */
Drupal.vdUtilities = {

  classNames: {
    classNameIconCheckboxChecked: 'icon-checkbox-checked',
    classNameIconCheckboxUnchecked: 'icon-checkbox-unchecked',
    classNameCheckboxToggleWrapper: 'checkbox-toggle-wrapper',
    classNameCheckboxToggle: 'checkbox-toggle',
    classNameInputActivated: 'item-activated',
    classNameInputDeactivated: 'item-deactivated',
    classNameWrapperActivated: 'wrapper-activated',
    classNameWrapperDeactivated: 'wrapper-deactivated',
  },

  // layerAttributes.
  layerAttributes: {
    layerTargetIdAttributeName: 'data-vd-target-id',
    listItemActivatedAttributeName: 'data-vd-list-item-activated',
    instanceLayerActivatedAttributeName: 'data-vd-instance-layer-activated',
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
   * @param {*} changeEventListener
   *   The event listener function for the change event.
   * @param {object} wrapperAttributesList
   *   The attributes to be added to the wrapper div.
   * @param {string} IconOn
   *   The class name for the icon when activated.
   * @param {*} IconOff 
   *   The class name for the icon when deactivated.
   * @returns 
   */
  generateOnOffSwitch(
    label,
    activated = true,
    clickEventListener = null,
    changeEventListener = null,
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
      classNameWrapperActivated,
      classNameWrapperDeactivated,
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
      classNameWrapperDeactivated,
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
    if (clickEventListener !== null) {
      wrapperDiv.addEventListener('click', clickEventListener);
    }

    if (changeEventListener !== null) {

      // Attach custom 'change' event listener to the checkbox.
      itemInput.addEventListener('change', changeEventListener);
    }

    // Attach default 'change' event listener to the checkbox.
    itemInput.addEventListener('change', () => {
      wrapperDiv.classList.toggle(classNameWrapperActivated);
      wrapperDiv.classList.toggle(classNameWrapperDeactivated);
    });

    // Create icons for the debugger activation checkbox.
    const iconSelectedTrue = document.createElement('span');
    iconSelectedTrue.classList.add(
      IconOn,
      classNameInputActivated,
    );
    const iconSelectedFalse = document.createElement('span');
    iconSelectedFalse.classList.add(
      IconOff,
      classNameInputDeactivated,
    );

    // Create a label element for the debugger activation checkbox.
    const itemLabel = document.createElement('label');
    itemLabel.setAttribute('for', checkboxUniqueId);
    itemLabel.style.pointerEvents = 'none';
    itemLabel.textContent = label;

    wrapperDiv.append(
      itemInput,
      iconSelectedTrue,
      iconSelectedFalse,
      itemLabel
    );

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
    return nodes.filter((node) => {
      return node.classList.contains(this.classNames.classNameWrapperActivated);
    });
  },
}