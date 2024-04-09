(function (Drupal) {
  Drupal.behaviors.visualDebugger = {

    // The class names being used in this script.
    classNames: {
      classNameInitialized: 'visual-debugger--initialized',
      classNameBaseLayer: 'visual-debugger--base-layer',
      classNameInstanceLayer: 'visual-debugger--instance-layer',
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

    // Gets processed unique property hooks.
    getUniquePropertyHooks(source) {
      return source
        .map(node => node.propertyHook)
        .filter((value, index, self) => {
          return self.indexOf(value) === index;
        })
        .sort();
    },

    getBaseLayer() {
      const baseLayer = document.createElement('div');
      const { classNameBaseLayer } = this.classNames;
      baseLayer.classList.add(classNameBaseLayer);
      return baseLayer;
    },

    getInstanceLayer(instanceLayerRef) {
      const instanceLayer = document.createElement('div');
      const { classNameInstanceLayer } = this.classNames;
      const instanceLayerRefRect = instanceLayerRef.getBoundingClientRect();
      const { width, height, left, top } = instanceLayerRefRect;
      instanceLayer.classList.add(classNameInstanceLayer);
      return instanceLayer;
    },

    // Code initialization.
    attach: function (context, settings) {
      const { body } = document;
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

      // Initialize the base element.
      const baseLayer = this.getBaseLayer();
      body.appendChild(baseLayer);

      // Initialize an array to hold comment nodes.
      let themeDebugNodes = [];
      let activeElement = Drupal.themeElement;
      activeElement.init();

      // Get all nodes in the document and loop through...
      const allNodes = document.querySelectorAll("*");
      allNodes.forEach((node) => {

        // Loop through all child nodes.
        const childNodes = node.childNodes;
        Array.from(childNodes).forEach((child) => {

          // If this is a DOM element, and it is time to load it into
          // the `activeElement` object.
          if (
            child.nodeType === Node.ELEMENT_NODE &&
            activeElement.beginOutput === true &&
            activeElement.dataNode === null
          ) {
            activeElement.setDataNode(child);
            const instanceLayer = this.getInstanceLayer(child);
            baseLayer.appendChild(instanceLayer);
            themeDebugNodes.push(Object.assign({}, activeElement));
            activeElement.reset();
            return;
          }

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

          // Gets the template file path and confirms output is beginning.
          const templateFilePathMatch = child.textContent.match(
            regexGetTemplateFilePath()
          );
          if (templateFilePathMatch) {
            activeElement.setBeginOutput();
            activeElement.setFilePath(templateFilePathMatch[1]);
            return;
          }
        });
      });

      console.warn(themeDebugNodes.length);
      console.warn(themeDebugNodes);

      // Remove duplicates
      let uniquePropertyHooks = this.getUniquePropertyHooks(themeDebugNodes);

      console.log(uniquePropertyHooks); // Logs the array of unique propertyHook values

    },
    detach: function (context, settings, trigger) {
      // Code to be run on page unload and
      // whenever the detach behavior is called.
    }
  };
})(Drupal);
