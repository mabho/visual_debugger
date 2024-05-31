/**
 * Delivers reusable code and resources across the application.
 */
Drupal.vdUtilities = {

  classNames: {
    classNameIconCheckboxChecked: 'icon-checkbox-checked',
    classNameIconCheckboxUnchecked: 'icon-checkbox-unchecked',
    classNameCheckboxToggleWrapper: 'checkbox-toggle-wrapper',
    classNameCheckboxToggle: 'checkbox-toggle',
    classNameActivated: 'item-activated',
    classNameDeactivated: 'item-deactivated',
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
      classNameActivated,
      classNameDeactivated,
    } = this.classNames;

    const self = this;

    const checkboxUniqueId = this.generateUniqueIdentifier();

    // Create a checkbox input element for debugger activation
    const itemInput = document.createElement('input');
    itemInput.type = 'checkbox';
    itemInput.id = checkboxUniqueId;
    itemInput.classList.add(classNameCheckboxToggle);

    // Applies the initial controller state based on localStorage setting.
    itemInput.checked = activated;

    // Add an event listener to the debugger activation checkbox.
    itemInput.addEventListener('change', changeEventListener);

    // Create icons for the debugger activation checkbox.
    const iconSelectedTrue = document.createElement('span');
    iconSelectedTrue.classList.add(
      IconOn,
      classNameActivated,
    );
    const iconSelectedFalse = document.createElement('span');
    iconSelectedFalse.classList.add(
      IconOff,
      classNameDeactivated,
    );

    // Create a label element for the debugger activation checkbox.
    const itemLabel = document.createElement('label');
    itemLabel.setAttribute('for', checkboxUniqueId)
    itemLabel.textContent = label;

    // Create a wrapper div for the activation elements within the form.
    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add(
      ...wrapperClassList,
      classNameCheckboxToggleWrapper
    );
    wrapperDiv.append(
      itemInput,
      iconSelectedTrue,
      iconSelectedFalse,
      itemLabel
    );

    return wrapperDiv;
  },
}