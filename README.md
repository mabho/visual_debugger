Visual Debugger
---------------

### Summary

When working on Drupal frontend, developers must rely on the browser's code inspector for the debug hints being rendered in the source code.

While referred approach does work, hovering and right-clicking elements on the screen; or trying to select and copy the name of a theme suggestion from the source code (hint: it actually doesn't work) qualifies as poor user experience.

Visual Debugger renders relevant source-code debug information in a fly-out window, so users can easily 'see' the entities carrying a Drupal template, as well as their corresponding theme suggestions and path to the corresponding template file.

### Basic configuration

To enable Visual Debugger:

1. Install the module with Composer. Since this is a module carrying functionality meant for developers, you will probably want to install it with a `composer require --dev`, so the module is incorporated into the `require-dev` block in `composer.json`.
2. Enable the module
3. Make sure Drupal debugging is activated; the module won't be able to do its job if debug comments aren't rendered in the source code. 
3. Go to the admin interface (admin/config/system/visual-debugger). Make sure **Use Visual Debugger on frontend theme** is activated for frontend theme debugging. Alternatively, users might also debug the backend by activating **Use Visual Debugger on admin theme**.
4. Nothing else :-)

### Theme debugging.

Developers can navigate to any page in the website and check a 'skin' layer renders on top of the page content. It should carry a series of semi-transparent layers matching each component carrying a templaste in the website source code.

### Development roadmap.

This is the roadmap for module improvements:
- Retract and disable the controller window when debugging is deactivated (click-drag must not work when it is deactivated; layer details should not be exposed); there should be minimal interference of Visual Debugger when it is disabled.
- Apply template file path to the `Selected element` block.
- Cast all SASS variables into CSS variables so other themes can more easily override the defaults and customize the UI.
- Add the ability to deactivate/disable the `Selected element` from within the controller block.
- Extend the custom object type colors to the overlay layers, instead of the vanilla, default yellow.
- Change the hover behavior to be more subtle: make the custom object type color less transparent, but avoid excess (current approach seems to be exaggerated).
- Apply a special style to the selected (default) element. Currently, it lacks a custom style. Selected elements should be highlighted all the time. The ideal solution could be one that makes its custom background (object type related) even less transparent.
- Apply extended cache information, when available, on elements carrying that type of information on the source code. This cache data can potentially be pulled to the frontend (still subject to an in-depth analysis for its feasibility):
  - Cache hit
  - Cache tags
  - Cache contexts
  - Cache keys
  - Pre-bubbling cache contexts
  - Pre-bubbling cache keys
- Create view modes to split the display of additional information, and help controller share a lot more valuable information to the user.
  - Create new tab `Discovery`. Auto-detect information about hovered layers would be displayed inside this tab.
  - Create new tab `List`. List all the page elements in the order they show up on the page. Selected item can be triggered from the items on this tab.
  - Create new tab `Aggretate`. Displays an aggregated/consolidated list of page elements by object type. The established color codes should be present here as a visual cue. Display the number of times each object type is present on the page.
  - Create a new tab `Configuration`. This tab can be represented by a coil icon only. 
- Add the ability to deactivate/disable individual layers so that users can more easily achieve layers underneath other layers.
  - On `List`, add the ability to activate/deactivate layers individually.
  - On `Aggregate`, add the ability to activate/deactivate groups of layers by object type.
