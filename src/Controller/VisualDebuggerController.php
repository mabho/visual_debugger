<?php

namespace Drupal\visual_debugger\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Returns responses for Visual Debugger routes.
 */
class VisualDebuggerController extends ControllerBase {

  /**
   * Builds the response.
   */
  public function build() {

    $build['content'] = [
      '#type' => 'item',
      '#markup' => $this->t('It works!'),
    ];

    return $build;
  }

}
