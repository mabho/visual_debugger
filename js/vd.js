(function (Drupal) {
  Drupal.behaviors.visualDebugger = {

    // The class names to be reused.
    classNames: {
      classNameInitialized: 'visualDebuggerInitialized',
    },

    // Validate theme DEBUG.
    regexGetTemplateDebug: () => new RegExp("THEME DEBUG"),

    // Validate template hook.
    regexGetTemplateHook: () => new RegExp("THEME HOOK: '([^']*)'"),

    // Validate template file path.
    regexGetTemplateFilePath: () => new RegExp("BEGIN OUTPUT from '([^']*)'"),

    // Validate complete theme analysis.
    regexGetTemplateEndOutput: () => new RegExp("END OUTPUT from '([^']*)'"),

    // Validate template suggestions list.
    regexGetTemplateSuggestions: () => new RegExp(
      "FILE NAME SUGGESTIONS:\s*\n\s*([^']*)\s*\n*\s*"
    ),

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

      // Get all nodes in the document
      const allNodes = document.querySelectorAll("*");

      // Initialize an array to hold comment nodes
      let commentNodes = [];
      let themeDebugNodes = [];
      let activeElement = null;

      // Loop through all nodes using forEach
      allNodes.forEach((node) => {

        // Get all child nodes of the current node
        const childNodes = node.childNodes;

        // Loop through all child nodes using forEach
        Array.from(childNodes).forEach((child) => {

          // Return if it is not a comment node.
          if (child.nodeType !== Node.COMMENT_NODE) return;

          // console.warn(child);

          // Gets the data node.
          /*
          const dataNode = child.nextElementSibling;
          console.log("data node is ", dataNode);
          if (dataNode) {
            activeElement.setDataNode(dataNode);
          }
          */

          // A THEME instance is found and initiated.
          if (this.regexGetTemplateDebug().test(child.textContent)) {
            activeElement = Drupal.themeElement;
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

          // Gets the template file path.
          const templateFilePathMatch = child.textContent.match(
            this.regexGetTemplateFilePath()
          );
          if (templateFilePathMatch) {
            activeElement.setFilePath(templateFilePathMatch[1]);
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

          // Identifies a closing output.
          const templateEndOutputMatch = child.textContent.match(
            this.regexGetTemplateEndOutput()
          );
          if (templateEndOutputMatch) {
            themeDebugNodes.push(Object.assign({}, activeElement));
          }
        });
      });

      // themeDebugNodes = themeDebugNodes.splice(205, 10);

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
