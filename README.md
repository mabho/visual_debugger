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
