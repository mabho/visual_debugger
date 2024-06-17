Visual Debugger
---------------

### Summary

When working on Drupal frontend, developers must rely on the browser's inspector to navigate the source code and sniff the debug comments wrapping the templates being rendered.

While this approach does work, hovering and right-clicking elements on the screen; or trying to select and copy the name of a theme suggestion from the source code (hint: it doesn't work) qualifies as very poor user experience.

Visual Debugger renders placeholder layers on top of the original templates so users can quickly discover where they lie, as well as point-and-click to see details that would be otherwise scattered and hidden throughout the source code.

The details about the selected elements are displayed inside a fly-out window, so users can easily 'see' the entities carrying a Drupal template, as well as their corresponding theme suggestions and path to the active template file. Copying that information to the clipboard is a breeze.

### Basic configuration

To enable Visual Debugger:

1. Install the module with Composer. Since this is a module carrying functionality meant for developers, you will probably want to install it with a `composer require --dev`, so the module is incorporated into the `require-dev` block in `composer.json`.
2. Enable the module.
3. Make sure Twig debug mode is activated in Drupal (`admin/config/development/settings`); the module won't be able to do its job if debug comments aren't rendered in the source code. 
3. Go to the admin interface (`admin/config/development/visual-debugger`). Make sure **Use Visual Debugger on frontend theme** is activated for frontend theme debugging. Alternatively, users might also debug the backend by activating **Use Visual Debugger on admin theme**.
4. Nothing else :-)

### Theme debugging.

Developers can navigate to any page in the website and check a 'skin' layer renders on top of the page content. It should carry a series of semi-transparent layers matching each component carrying a templaste in the website source code.

When hovering any of these skin layer placeholders, user will notice block `Active Element` is updated and displays the name of the entity. Each entity is assigned a specific color, so users can quickly grasp the type of element being highlighted.

Users can then click and select any of these layers by clicking them. A checkbox visual indication will then show at the top left corner of the selected layer to highlight it is selected. The Visual Debugger fly-out window at the side of the screen will then display details on the selected layer:
- the entity type itself;
- the theme suggestions, specifying which one is active.
- the path of the template file in use.

For convenience, users might want to deactivate the Visual Debugger, and the debug skin will immediately disappear from the screen. Turning it back on is also very simple, by clicking the icon that remains visible to the top-right corner of the screen.

Users may also resize the fly-out window to make it wider or narrower by click-dragging the rounded handle at the edge of the fly-out window.

User preferences for fly-out window width and Visual Debugger activation are stored in the browser and recovered every time a new page is loaded. 

### Limmitations.

Keep in mind the script does the best it can to overlap the elements originally rendering on the page, but it might fail for dynamic, animated elements, like carousels. Also, the placeholders associated with elements that are fixed or sticky will match the initial position, but will then scroll normally with the rest of the content, diverging from its original referenced element.

Visual Debugger was originally developed with desktop screen sizes in mind. It hasn't been tested against mobile devices, and it could go terribly wrong on those screen sizes. If handling mobile screens becomes a requirement, future development might be able to improve that experience and better accomodate elements on the screen.

### Development roadmap.

This is the roadmap for module improvements:
- Apply extended cache information, when available, on elements carrying that type of information on the source code. This cache data can potentially be pulled to the frontend (still subject to an in-depth analysis for its feasibility):
  - Cache hit
  - Cache tags
  - Cache contexts
  - Cache keys
  - Pre-bubbling cache contexts
  - Pre-bubbling cache keys
- Create tabbed navigation to split the display of additional information, and help controller share a lot more valuable information to the user.
  - ~~Create new tab `Selected` to display information on the item that is currently selected by the user.~~
  - ~~Create new tab `List`. List all the page elements in the order they show up on the page. Selected item can be triggered from the items on this tab.~~
  - Create new tab `Aggretate`. Displays an aggregated/consolidated list of page elements by object type. The established color codes should be present here as a visual cue. Display the number of times each object type is present on the page.
    - Beside each object type tag, display a checkbox delivering users the ability to activate/deactivate all the components of a given type at once.
  - Create a new tab `Configuration`. This tab can be represented by a coil icon only. 
- Add the ability to deactivate/disable individual layers so that users can more easily achieve layers underneath other layers.
  - ~~On `List`, add the ability to activate/deactivate layers individually.~~
  - On `Aggregate`, add the ability to activate/deactivate groups of layers by object type.

### Development roadmap - Complete tasks.

These are the complete tasks in the development roadmap.
- ~~Retract and disable the controller window when debugging is deactivated (click-drag must not work when it is deactivated; layer details should not be exposed); there should be minimal interference of Visual Debugger when it is disabled.~~
- ~~Apply template file path to the `Selected element` block.~~
- ~~Cast all SASS variables into CSS variables so other themes can more easily override the defaults and customize the UI.~~
- Add the ability to deactivate/disable the `Selected element` from within the controller block.
- ~~Extend the custom object type colors to the overlay layers, instead of the vanilla, default yellow.~~
- ~~Change the hover behavior to be more subtle: make the custom object type color less transparent, but avoid excess (current approach seems to be exaggerated).~~
- ~~Apply a special style to the selected (default) element. Currently, it lacks a custom style. Selected elements should be highlighted all the time. The ideal solution could be one that makes its custom background (object type related) even less transparent.~~