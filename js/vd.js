(function (Drupal) {
  Drupal.behaviors.visualDebugger = {

    // The class names being used in this script.
    classNames: {

      // The class name applied when this code is initialized.
      classNameInitialized: 'visualDebuggerInitialized',
    },

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

    // Gets processed unique property hooks.
    getUniquePropertyHooks: (source) => {
      return source
        .map(node => node.propertyHook)
        .filter((value, index, self) => {
          return self.indexOf(value) === index;
        })
        .sort();
    },

    // Code initialization.
    attach: function (context, settings) {
      const { body } = document;
      const { classNameInitialized } = this.classNames;
      if (!body.classList.contains(classNameInitialized)) {
        body.classList.add(classNameInitialized);
        this.main(context, settings);
      }
    },

    // Main portion of the code.
    main: function(context, settings) {

      // Initialize an array to hold comment nodes
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
            themeDebugNodes.push(Object.assign({}, activeElement));
            activeElement.reset();
            return;
          }

          // Analyze comment nodes only.
          if (child.nodeType !== Node.COMMENT_NODE) return;

          // A THEME instance is found and initiated.
          if (this.regexGetTemplateDebug().test(child.textContent)) {
            activeElement.setActivated();
            return;
          }

          // If there is no active template, return.
          if (activeElement === null) return;

          // Gets the template hook.
          const templateHookMatch = child.textContent.match(this.regexGetTemplateHook());
          if (templateHookMatch) {
            activeElement.setPropertyHook(templateHookMatch[1]);
            return;
          }

          // Gets the template suggestions.
          const templateSuggestions = child.textContent.match(
            this.regexGetTemplateSuggestions()
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
            this.regexGetTemplateFilePath()
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
