(function (Drupal) {
  Drupal.behaviors.visualDebugger = {

    body: document.body,

    // App constants.
    constants: {
      baseZIndex: 0,
    },

    // The class names being used in this script.
    classNames: {
      classNameVisualDebugger: 'visual-debugger',
      classNameInitialized: 'visual-debugger--initialized',
      classNameBaseLayer: 'visual-debugger--base-layer',
      classNameInstanceLayer: 'visual-debugger--instance-layer',
      classNameInstanceLayerUnchecked: 'visual-debugger--instance-layer--unchecked',
      classNameInstanceLayerChecked: 'visual-debugger--instance-layer--checked',
      classNameObjectType: 'object-type',
      classNameObjectTypeTyped: (objectType) => `object-type--${objectType}`,
    },

    // layerAttributes.
    layerAttributes: {
      layerIdAttributeName: 'data-vd-id',
      layerTargetIdAttributeName: 'data-vd-target-id',
    },

    // This array holds relevant info about the debug layers, once filled:
    // 1. instanceActiveElement: The actual data for each layer.
    // 3. instanceLayer: The debug layer generated dynamically.
    // 2. instanceRefElement: The original referenced layer.
    themeDebugNodes: null,

    // Resize Observer.
    triggerResizeObserver(themeDebugNodes) {
      const { layerIdAttributeName, layerTargetIdAttributeName } = this.layerAttributes;
      const resizeObserver = new ResizeObserver((element) => {
        const affectedLayer = element[0].target;
        const instanceLayerId = affectedLayer.getAttribute(layerIdAttributeName);
        const instanceLayerRef = this.body.querySelector(`[${layerTargetIdAttributeName}="${instanceLayerId}"]`);
        this.setInstanceLayerSizeAndPosition(instanceLayerRef, affectedLayer);
      });

      // Loop through all theme debug nodes.
      themeDebugNodes.forEach((instance) => {
        const { instanceRefElement } = instance;
        resizeObserver.observe(instanceRefElement);
      });
    },

    // Mutation Observer.
    triggerMutationObserver: function(themeDebugNodes) {
      const mutationObserver = new MutationObserver(() => {
        themeDebugNodes.forEach((instance) => {
          this.setInstanceLayerSizeAndPosition(
            instance.instanceLayer,
            instance.instanceRefElement
          );
        });
      });

      mutationObserver.observe(this.body, {
        attributes: true,
        attributeFilter: ['style'],
      });
    },

    // Regular expressions.
    regExs: {

      // Validate theme DEBUG.
      regexGetTemplateDebug: () => new RegExp("THEME DEBUG"),

      // Validate template hook.
      regexGetTemplateHook: () => new RegExp("THEME HOOK: '([^']*)'"),

      // Validate template suggestions list.
      regexGetTemplateSuggestions: () => new RegExp(
        "FILE NAME SUGGESTIONS:\s*\n\s*([^']*)\s*\n*\s*"
      ),

      // Validate template file path.
      regexGetTemplateFilePath: () => new RegExp("BEGIN OUTPUT from '([^']*)'"),

      // Validate complete theme analysis.
      regexGetTemplateEndOutput: () => new RegExp("END OUTPUT from '([^']*)'"),
    },

    // Strores the controller layer.
    controllerElement: null,

    // Gets processed unique property hooks.
    getUniquePropertyHooks(source) {
      return source
        .map(node => node.instanceActiveElement.propertyHook)
        .filter((value, index, self) => {
          return self.indexOf(value) === index;
        })
        .sort();
    },

    // Gets the DOM depth of the referenced element.
    getCalculatedDomDepth(element) {
      let depth = 0;
      while (element.parentNode) {
        depth++;
        element = element.parentNode;
      }
      return depth;
    },

    // Base Layer.
    getBaseLayer() {
      const thisLayer = document.createElement('div');
      const {
        classNameVisualDebugger,
        classNameBaseLayer
      } = this.classNames;
      thisLayer.classList.add(classNameVisualDebugger);
      thisLayer.classList.add(classNameBaseLayer);
      return thisLayer;
    },

    // Filters all checked nodes.
    getCheckedNodes() {
      return this.themeDebugNodes.filter((node) => {
        return node.instanceLayer.classList.contains(this.classNames.classNameInstanceLayerChecked);
      });
    },

    // Instance Layer.
    generateInstanceLayer(thisThemeElement, instanceLayerRef, instanceLayerId) {

      // This instance layer.
      const thisLayer = document.createElement('div');

      // Controller element instance.
      const controllerElementInstance = this.controllerElement;

      // Layer attributes.
      const { layerTargetIdAttributeName } = this.layerAttributes;

      // Set instance classes.
      const {
        classNameInstanceLayer,
        classNameInstanceLayerChecked,
        classNameInstanceLayerUnchecked,
        classNameObjectType,
        classNameObjectTypeTyped
      } = this.classNames;
      thisLayer.classList.add(
        classNameInstanceLayer,
        classNameObjectType,
        classNameObjectTypeTyped(thisThemeElement.getObjectType()),
        classNameInstanceLayerUnchecked
      );
      thisLayer.setAttribute(layerTargetIdAttributeName, instanceLayerId);

      // Set the size and position of the instance layer.
      this.setInstanceLayerSizeAndPosition(thisLayer, instanceLayerRef);

      // Set a checkbox selector for the instance layer.
      const thisThemeElementPropertyHook = thisThemeElement;
      const checkboxSelector = document.createElement('input');
      checkboxSelector.setAttribute('type', 'checkbox');

      // Set a 'change' event listener.
      checkboxSelector.addEventListener('change', () => {

      });
      thisLayer.appendChild(checkboxSelector);

      // Set a mouseenter event listener.
      thisLayer.addEventListener(
        'mouseenter',
        () => {
          checkboxSelector.focus({ preventScroll: true });
          controllerElementInstance.setActiveThemeElement(thisThemeElementPropertyHook);
        }
      );

      // Set a mouseleave event listener.
      thisLayer.addEventListener(
        'mouseleave',
        () => {
          checkboxSelector.blur();
          controllerElementInstance.resetActiveThemeElement(thisThemeElementPropertyHook);
        }
      );

      // Set a 'click' event listener.
      thisLayer.addEventListener(
        'click',
        () => {

          // Uncheck siblings if checked...
          const activatedCheckboxes = this.getCheckedNodes();
          activatedCheckboxes.forEach((node) => {
            if (node.instanceLayer !== thisLayer)
              node.instanceLayer.click();
          });

          // Toggle the checkbox and classes.
          checkboxSelector.checked = !checkboxSelector.checked; 
          thisLayer.classList.toggle(classNameInstanceLayerChecked);
          thisLayer.classList.toggle(classNameInstanceLayerUnchecked);

          // Update the default theme element.
          if (checkboxSelector.checked === true) {
            checkboxSelector.focus();
            controllerElementInstance.setDefaultThemeElement(thisThemeElement);
          } else {
            checkboxSelector.blur();
            controllerElementInstance.resetDefaultThemeElement(thisThemeElement);
          }
        }
      );

      // Establish a resize observer.
      const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          this.setInstanceLayerSizeAndPosition(thisLayer, instanceLayerRef);
        });
      });
      resizeObserver.observe(instanceLayerRef);

      return thisLayer;
    },

    // Instance Layer Size and Position calculations.
    setInstanceLayerSizeAndPosition(instanceLayerTarget, instanceLayerRef) {
      const instanceLayerRefRect = instanceLayerRef.getBoundingClientRect();
      const top = Math.round(instanceLayerRefRect.top + window.scrollY);
      const left = Math.round(instanceLayerRefRect.left + window.scrollX);      
      let { width, height } = instanceLayerRefRect;
      height = Math.round(height);
      width = Math.round(width);

      // Set the size and position of the instance layer.
      instanceLayerTarget.style.width = `${Math.round(width)}px`;
      instanceLayerTarget.style.height = `${Math.round(height)}px`;
      instanceLayerTarget.style.top = `${top}px`;
      instanceLayerTarget.style.left = `${left}px`;
    },

    // Code initialization.
    attach: function (context, settings) {
      const { body } = this;
      const { classNameInitialized } = this.classNames;
      if (!body.classList.contains(classNameInitialized)) {
        body.classList.add(classNameInitialized);
        this.main(context, settings, body);
      }
    },

    // Main portion of the code.
    main: function(context, settings, body) {

      // Regular expressions.
      const {
        regexGetTemplateDebug,
        regexGetTemplateHook,
        regexGetTemplateSuggestions,
        regexGetTemplateFilePath,
      } = this.regExs;

      const { layerIdAttributeName } = this.layerAttributes;

      // Initialize the controller element.
      const controllerElementInstance = Drupal.controllerElement;
      this.controllerElement = controllerElementInstance;

      // Initialize the base element.
      const baseLayer = this.getBaseLayer();
      body.appendChild(baseLayer);

      // Initialize an array to hold comment nodes.
      let themeDebugNodes = [];

      // Initialize the object that holds theme elements.
      let activeElement = Drupal.themeElement;
      activeElement.init();

      // Get all nodes in the document and loop through...
      const allNodes = document.querySelectorAll("*");
      allNodes.forEach((node) => {

        // Loop through all child nodes.
        const childNodes = node.childNodes;
        Array.from(childNodes).forEach((child) => {

          // Analyze comment nodes only.
          if (child.nodeType !== Node.COMMENT_NODE) return;

          // A THEME instance is found and initiated.
          if (regexGetTemplateDebug().test(child.textContent)) {
            activeElement.setActivated();
            return;
          }

          // If there is no active template, return.
          if (activeElement === null) return;

          // Gets the template hook.
          const templateHookMatch = child.textContent.match(regexGetTemplateHook());
          if (templateHookMatch) {
            activeElement.setPropertyHook(templateHookMatch[1]);
            activeElement.setObjectType(templateHookMatch[1]);
            return;
          }

          // Gets the template suggestions.
          const templateSuggestions = child.textContent.match(
            regexGetTemplateSuggestions()
          );
          if (templateSuggestions) {
            const splitSuggestions = templateSuggestions[1].trim().split(/\n\s*/);
            const splitSuggestionsProcessed = splitSuggestions.map((themeSuggestion) => {
              const splitThemeSuggestion = themeSuggestion.split(' ');
              return {
                suggestion: splitThemeSuggestion[1],
                activated: (splitThemeSuggestion[0] === 'x'),
              }
            });
            activeElement.setSuggestions(splitSuggestionsProcessed);
            return;
          }

          // Gets the template file path and fills dataNode.
          const templateFilePathMatch = child.textContent.match(
            regexGetTemplateFilePath()
          );
          if (templateFilePathMatch) {

            // Set the file path.
            activeElement.setFilePath(templateFilePathMatch[1]);

            // Get the next element sibling (dataNode).
            const dataNode = child.nextElementSibling;

            // Confirm it is a DOM element.
            if (
              (
                dataNode &&
                dataNode.nodeType === Node.ELEMENT_NODE
              ) && activeElement.dataNode === null
            ) {
              activeElement.setDataNode(dataNode);
              const instanceActiveElement = Object.assign({}, activeElement);
              const instanceLayerId = `element-${Math.random().toString(36).substring(7)}`;
              const instanceLayer = this.generateInstanceLayer(instanceActiveElement, dataNode, instanceLayerId);
              const themeDebugNode = {
                'instanceActiveElement': instanceActiveElement,
                'instanceLayer': instanceLayer,
                'instanceRefElement': dataNode,
              }
              dataNode.setAttribute(layerIdAttributeName, instanceLayerId);
              themeDebugNodes.push(themeDebugNode);
              baseLayer.appendChild(instanceLayer);
            }

            activeElement.reset();
          }
        });
      });

      console.warn(themeDebugNodes);

      this.themeDebugNodes = themeDebugNodes;
      
      // Activate observers.
      this.triggerMutationObserver(themeDebugNodes);
      // this.triggerResizeObserver(themeDebugNodes);

      // Remove duplicates.
      let uniquePropertyHooks = this.getUniquePropertyHooks(themeDebugNodes);

      console.log(uniquePropertyHooks); // Logs the array of unique propertyHook values

      // Load data into the controller element.
      console.warn(controllerElementInstance);
      controllerElementInstance.init(baseLayer, themeDebugNodes);
      body.appendChild(controllerElementInstance.generateControllerLayer());
      controllerElementInstance.executePostActivation();
    },
    detach: function (context, settings, trigger) {
      // Code to be run on page unload and
      // whenever the detach behavior is called.
    }
  };
})(Drupal);
