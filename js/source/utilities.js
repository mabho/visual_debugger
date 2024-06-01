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
   * @param {string} IconOn
   *   The class name for the icon when activated.
   * @param {*} IconOff 
   *   The class name for the icon when deactivated.
   * @returns 
   */
  generateOnOffSwitch(
    label,
    activated = true,
    changeEventListener = null,
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

    if (changeEventListener !== null) {

      // Attach custom 'change' event listener to the checkbox.
      itemInput.addEventListener('change', changeEventListener);

      // Attach default 'change' event listener to the checkbox.
      itemInput.addEventListener('change', () => {
        // Toggle the checked and unchecked classes on the instance layer.
        wrapperDiv.classList.toggle(classNameWrapperActivated);
        wrapperDiv.classList.toggle(classNameWrapperDeactivated);
      });

      // Attach a 'click' event listener on the wrapper div.
      wrapperDiv.addEventListener(
        'click',
        () => {

          // Uncheck siblings if checked...
          const siblings = this.getSiblings(wrapperDiv);
          const activatedCheckboxes = this.getCheckedNodes(siblings);
          activatedCheckboxes.forEach((node) => {
            node.click();
          });

          // Trigger click the checkbox.
          itemInput.click();
        }
      );
    }

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