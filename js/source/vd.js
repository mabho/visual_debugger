(function (Drupal) {
  Drupal.behaviors.visualDebugger = {

    // Body element.
    body: document.body,

    // Utilities.
    utilities: Drupal.vdUtilities,

    // App constants.
    constants: {
      baseZIndex: 0,
    },

    // The class names being used in this script.
    classNames: {
      classNameVisualDebugger: 'visual-debugger',
      classNameInitialized: 'visual-debugger--initialized',
      classNameBaseLayer: 'visual-debugger--base',
      classNameInstanceLayer: 'instance-element',
      classNameInstanceLayerUnchecked: 'instance-element--unchecked',
      classNameInstanceLayerChecked: 'instance-element--checked',
      classNameInstanceLayerHover: 'instance-element--hover',
      classNameObjectType: 'object-type',
      classNameObjectTypeHover: 'object-type--hover',
      classNameIconActivated: 'icon-checkbox-checked',
      classNameIconDectivated: 'icon-checkbox-unchecked',
      classNameCheckboxToggle: 'checkbox-toggle',
      classNameSpanToggle: 'span-toggle',
      classNameActivated: 'item-activated',
      classNameDeactivated: 'item-deactivated',
      classNameObjectTypeTyped: (objectType) => `object-type--${objectType}`,
    },

    // layerAttributes.
    layerAttributes: {
      layerIdAttributeName: 'data-vd-id',
    },

    // This array holds relevant info about the debug layers, once filled:
    // 1. instanceActiveElement: The actual data for each layer.
    // 3. instanceLayer: The debug layer generated dynamically.
    // 2. instanceRefElement: The original referenced layer.
    themeDebugNodes: null,

    // Resize Observer.
    triggerResizeObserver(themeDebugNodes) {
      const { body } = this;
      const {
        layerIdAttributeName,
      } = this.layerAttributes;

      const { layerTargetIdAttributeName } = this.utilities.layerAttributes;

      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach(entry => {
          const affectedLayer = entry.target;
          const instanceLayerId = affectedLayer.getAttribute(layerIdAttributeName);
          const instanceLayerRef = body.querySelector(`[${layerTargetIdAttributeName}="${instanceLayerId}"]`);
          this.setInstanceLayerSizeAndPosition(instanceLayerRef, affectedLayer);
        });
      });

      // Loop through all theme debug nodes.
      themeDebugNodes.forEach((instance) => {
        const { instanceRefElement } = instance;
        resizeObserver.observe(instanceRefElement);
      });
    },

    /**
     * Activates the Mutation Observer.
     * @param {object} themeDebugNodes
     *   This is the array of theme debug nodes.
     */
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
      regexGetTemplateDebug: () => new RegExp("^(THEME DEBUG|START RENDERED)$"),

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

      // Cache-hit.
      regexGetCacheHit: () => new RegExp("CACHE-HIT: (Yes|No)"),

      // List cache tags.
      regexGetCacheTags: () => new RegExp(
        "^\\s?CACHE TAGS:\s*\n\s*([^']*)\s*\n*\s*"
      ),

      // List cache contexts.
      regexGetCacheContexts: () => new RegExp(
        "^\\s?CACHE CONTEXTS:\s*\n\s*([^']*)\s*\n*\s*"
      ),

      // List cache keys.
      regexGetCacheKeys: () => new RegExp(
        "^\\s?CACHE KEYS:\s*\n\s*([^']*)\s*\n*\s*"
      ),

      // Cache max-age
      regexGetCacheMaxAge: () => new RegExp("^\\s?CACHE MAX-AGE: (-?[0-9]*)"),

      // List pre-bubbling cache tags.
      regexGetPreBubblingCacheTags: () => new RegExp(
        "PRE-BUBBLING CACHE TAGS:\s*\n\s*([^']*)\s*\n*\s*"
      ),

      // List pre-bubbling cache contexts.
      regexGetPreBubblingCacheContexts: () => new RegExp(
        "PRE-BUBBLING CACHE CONTEXTS:\s*\n\s*([^']*)\s*\n*\s*"
      ),

      // List pre-bubbling cache keys.
      regexGetPreBubblingCacheKeys: () => new RegExp(
        "PRE-BUBBLING CACHE KEYS:\s*\n\s*([^']*)\s*\n*\s*"
      ),

      // Pre-bubbling cache max-age.
      regexGetPreBubblingCacheMaxAge: () => new RegExp("PRE-BUBBLING CACHE MAX-AGE: (-?[0-9]*)"),

      // Rendering time.
      regexGetRenderingTime: () => new RegExp("RENDERING TIME: (-?[0-9]*\.?[0-9]*)"),
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

    /**
     * Gets the DOM depth of the referenced element.
     * @param {object} element
     *   The object being analyzed. 
     * @returns
     *   The number that corresponds to the element depth.
     */
    getCalculatedDomDepth(element) {
      let depth = 0;
      while (element.parentNode) {
        depth++;
        element = element.parentNode;
      }
      return depth;
    },

    // 
    /**
     * Generates the base layer from scratch.
     * @returns {object}
     *   The base layer object.
     */
    generateBaseLayer() {
      const thisLayer = document.createElement('div');
      const {
        classNameVisualDebugger,
        classNameBaseLayer
      } = this.classNames;
      thisLayer.classList.add(classNameVisualDebugger);
      thisLayer.classList.add(classNameBaseLayer);
      return thisLayer;
    },

    /**
     * Filters all checked nodes.
     * @returns {boolean}
     *   An array of nodes.
     */
    getCheckedNodes() {
      return this.themeDebugNodes.filter((node) => {
        return node.instanceLayer.classList.contains(this.classNames.classNameInstanceLayerChecked);
      });
    },

    /**
     * Generates an instance layer from scratch; applies all the attributes,
     * classes and event observers.
     * @param {object} thisThemeElement 
     * @param {object} instanceLayerRef 
     * @param {object} instanceLayerId 
     * @returns 
     */
    generateInstanceLayer(thisThemeElement, instanceLayerRef, instanceLayerId) {

      // This instance layer.
      const thisLayer = document.createElement('div');

      // Controller element instance.
      const controllerElementInstance = this.controllerElement;

      // Set instance classes.
      const {
        classNameInstanceLayer,
        classNameInstanceLayerChecked,
        classNameInstanceLayerUnchecked,
        classNameObjectType,
        classNameObjectTypeTyped,
        classNameIconActivated,
        classNameIconDectivated,
        classNameCheckboxToggle,
        classNameSpanToggle,
        classNameActivated,
        classNameDeactivated,
      } = this.classNames;

      // Layer attributes in Utilities.
      const {
        layerTargetIdAttributeName,
        instanceLayerActivatedAttributeName,
        layerAttributeIsVisible
      } = this.utilities.layerAttributes;

      thisLayer.classList.add(
        classNameInstanceLayer,
        classNameObjectType,
        classNameObjectTypeTyped(thisThemeElement.getObjectType()),
        classNameInstanceLayerUnchecked
      );

      
      thisLayer.setAttribute(layerTargetIdAttributeName, instanceLayerId);
      thisLayer.setAttribute(layerAttributeIsVisible, true);
      thisLayer.setAttribute(instanceLayerActivatedAttributeName, false);
      thisLayer.style.zIndex =
        this.getCalculatedDomDepth(instanceLayerRef);

      // Set the size and position of the instance layer.
      this.setInstanceLayerSizeAndPosition(thisLayer, instanceLayerRef);

      // Set a checkbox selector for the instance layer.
      const thisThemeElementPropertyHook = thisThemeElement;
      const checkboxSelector = document.createElement('input');
      checkboxSelector.setAttribute('type', 'checkbox');
      checkboxSelector.classList.add(classNameCheckboxToggle);

      // Set <span> tags for activated and deactivated icons.
      const activatedIcon = document.createElement('span');
      activatedIcon.classList.add(
        classNameSpanToggle,
        classNameActivated,
        classNameIconActivated
      );
      const deactivatedIcon = document.createElement('span');
      deactivatedIcon.classList.add(
        classNameSpanToggle,
        classNameDeactivated,
        classNameIconDectivated
      );

      thisLayer.append(
        checkboxSelector,
        activatedIcon,
        deactivatedIcon
      );

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

      // Set a 'click' event listener on the instance layer that triggers a
      // click on the checkbox within.
      thisLayer.addEventListener(
        'click',
        () => {

          // Uncheck siblings if checked...
          const activatedCheckboxes = this.getCheckedNodes();
          activatedCheckboxes.forEach((node) => {
            if (node.instanceLayer !== thisLayer)
              node.instanceLayer.click();
          });

          // Trigger click the checkbox.
          checkboxSelector.click();
        }
      );

      // On checkbox change.
      checkboxSelector.addEventListener(
        'change',
        () => {

          // Toggle the checked and unchecked activation attribute.
          thisLayer.setAttribute(instanceLayerActivatedAttributeName, checkboxSelector.checked);

          // Toggle the checked and unchecked classes on the instance layer.
          thisLayer.classList.toggle(classNameInstanceLayerChecked);
          thisLayer.classList.toggle(classNameInstanceLayerUnchecked);

          // Trigger the change in the default selected element in controller.
          if (checkboxSelector.checked === true) {
            checkboxSelector.focus();
            controllerElementInstance.setDefaultThemeElement(thisThemeElement);
          } else {
            checkboxSelector.blur();
            controllerElementInstance.resetDefaultThemeElement(thisThemeElement);
          }
        }
      );

      return thisLayer;
    },

    // 
    /**
     * Applies the top and left offset, as well as width and height of the
     * target element.
     * @param {object} instanceLayerTarget
     *   The target element to apply the size and position to.
     * @param {object} instanceLayerRef
     *   The reference element to get the size and position from.
     */
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

    /**
     * Sets the theme debug node object, which is central for this app.
     * @param {object} instanceActiveElement
     *   The actual data for each layer.
     * @param {object} instanceLayer
     *   The debug layer generated dynamically.
     * @param {object} instanceRefElement
     *   The original referenced layer.
     * @returns 
     */
    setthemeDebugNode(
      instanceActiveElement,
      instanceLayer,
      instanceRefElement,
    ) {
      const {
        layerAttributeIsVisible, 
        instanceLayerActivatedAttributeName
      } = this.utilities.layerAttributes;

      const {
        classNameInstanceLayerHover,
        classNameObjectTypeHover
      } = this.classNames;

      return {
        instanceActiveElement: instanceActiveElement,
        instanceLayer: instanceLayer,
        instanceRefElement: instanceRefElement,

        // Show this layer.
        showInstanceLayer() {
          this.instanceLayer.setAttribute(layerAttributeIsVisible, true);
        },

        // Hide this layer.
        hideInstanceLayer() {
          this.instanceLayer.setAttribute(layerAttributeIsVisible, false);
          if (this.instanceLayer.getAttribute(instanceLayerActivatedAttributeName) === 'true'){
            this.instanceLayer.click();
          }
        },

        // Trigger mouse enter.
        triggerMouseEnter() {
          this.instanceLayer.dispatchEvent(new MouseEvent('mouseenter'));
          this.instanceLayer.classList.add(
            classNameInstanceLayerHover,
            classNameObjectTypeHover

          );
        },
        
        // Trigger mouse leave.
        triggerMouseLeave() {
          this.instanceLayer.dispatchEvent(new MouseEvent('mouseleave'));
          this.instanceLayer.classList.remove(
            classNameInstanceLayerHover,
            classNameObjectTypeHover
          );
        }
      }; 
    },

    /**
     * Code initialization.
     * @param {object} context 
     * @param {object} settings 
     */
    attach: function (context, settings) {
      const { body } = this;
      const { classNameInitialized } = this.classNames;
      if (!body.classList.contains(classNameInitialized)) {
        body.classList.add(classNameInitialized);
        this.main(context, settings, body);
      }
    },

    // Main portion of the code.
    /**
     * This is the main portion of the code.
     * @param {object} context
     * @param {object} settings 
     * @param {object} body 
     */
    main: function(context, settings, body) {

      // Regular expressions.
      const {
        regexGetTemplateDebug,
        regexGetTemplateHook,
        regexGetTemplateSuggestions,
        regexGetTemplateFilePath,
        regexGetCacheHit,
        regexGetCacheMaxAge,
        regexGetPreBubblingCacheTags,
        regexGetPreBubblingCacheContexts,
        regexGetPreBubblingCacheKeys,
        regexGetPreBubblingCacheMaxAge,
        regexGetRenderingTime,
        regexGetCacheTags,
        regexGetCacheContexts,
        regexGetCacheKeys,
      } = this.regExs;

      const { layerIdAttributeName } = this.layerAttributes;

      // Initialize the controller element.
      const controllerElementInstance = Drupal.controllerElement;
      this.controllerElement = controllerElementInstance;

      // Initialize the base element.
      const baseLayer = this.generateBaseLayer();
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

          // If there is no active template, return.
          // if (activeElement === null) return;


          // A THEME instance is found and initiated.
          if (regexGetTemplateDebug().test(child.textContent)) {
            activeElement.setActivated();
            return;
          }

          // Test for a cache hit.
          const cacheHit = child.textContent.match(regexGetCacheHit());
          if (cacheHit) {
            activeElement.setCacheHit(cacheHit[1]);
            return;
          }

          // Test for cache max-age.
          const cacheMaxAge = child.textContent.match(regexGetCacheMaxAge());
          if (cacheMaxAge) {
            activeElement.setCacheMaxAge(cacheMaxAge[1]);
            return;
          }

          // Test for cache tags.
          const cacheTags = child.textContent.match(regexGetCacheTags());
          if (cacheTags) {
            activeElement.setCacheTags(cacheTags[1]);
            return;
          }

          // Test for cache contexts.
          const cacheContexts = child.textContent.match(regexGetCacheContexts());
          if (cacheContexts) {
            activeElement.setCacheContexts(cacheContexts[1]);
            return;
          }

          // Test for cache contexts.
          const cacheKeys = child.textContent.match(regexGetCacheKeys());
          if (cacheKeys) {
            activeElement.setCacheKeys(cacheKeys[1]);
            return;
          }

          // Test for pre-bubbing cache tags.
          const preBubblingCacheTags = child.textContent.match(regexGetPreBubblingCacheTags());
          if (preBubblingCacheTags) {
            activeElement.setPreBubblingCacheTags(preBubblingCacheTags[1]);
            return;
          }

          // Test for pre-bubbing cache contexts.
          const preBubblingCacheContexts = child.textContent.match(regexGetPreBubblingCacheContexts());
          if (preBubblingCacheContexts) {
            activeElement.setPreBubblingCacheContexts(preBubblingCacheContexts[1]);
            return;
          }

          // Test for pre-bubbing cache keys.
          const preBubblingCacheKeys = child.textContent.match(regexGetPreBubblingCacheKeys());
          if (preBubblingCacheKeys) {
            activeElement.setPreBubblingCacheKeys(preBubblingCacheKeys[1]);
            return;
          }

          // Test for pre-bubbing cache max-age.
          const cachePreBubblingMaxAge = child.textContent.match(regexGetPreBubblingCacheMaxAge());
          if (cachePreBubblingMaxAge) {
            activeElement.setPreBubblingCacheMaxAge(cachePreBubblingMaxAge[1]);
            return;
          }

          // Test for pre-bubbing cache max-age.
          const renderingTime = child.textContent.match(regexGetRenderingTime());
          if (renderingTime) {
            activeElement.setRenderingTime(renderingTime[1]);
            return;
          }

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
            activeElement.setSuggestions(templateSuggestions[1]);
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
              const instanceLayerId = this.utilities.generateUniqueIdentifier();
              const instanceLayer = this.generateInstanceLayer(instanceActiveElement, dataNode, instanceLayerId);
              dataNode.setAttribute(layerIdAttributeName, instanceLayerId);
              baseLayer.appendChild(instanceLayer);
              themeDebugNodes.push(
                this.setthemeDebugNode(
                  instanceActiveElement,
                  instanceLayer,
                  dataNode,
                )
              );
            }

            activeElement.reset();
          }
        });
      });

      this.themeDebugNodes = themeDebugNodes;

      // Activate observers.
      this.triggerMutationObserver(themeDebugNodes);
      this.triggerResizeObserver(themeDebugNodes);

      // Load data into the controller element.
      controllerElementInstance.init(baseLayer, themeDebugNodes);
      body.appendChild(controllerElementInstance.generateControllerLayer());
      controllerElementInstance.executePostActivation();

      // These loggers are only valid for module developers.
      // console.warn('themeDebugNodes', themeDebugNodes);

      // Gets a consolidated array of propertyHook values.
      // let uniquePropertyHooks = this.getUniquePropertyHooks(themeDebugNodes);
      // console.warn('uniquePropertyHooks', uniquePropertyHooks);
    },
    detach: function (context, settings, trigger) {
      // Code to be run on page unload and
      // whenever the detach behavior is called.
    }
  };
})(Drupal);
