<?php

namespace Drupal\visual_debugger\Form;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\visual_debugger\VisualDebuggerConstants;

/**
 * Configure Visual Debugger settings for this site.
 */
class SettingsForm extends ConfigFormBase {

  /**
   * This is the confifgured key identifying `use_on_frontend`.
   * @var string $use_on_frontend
   */
  private $use_on_frontend;

  /**
   * This is the confifgured key identifying `use_on_admin`.
   * @var string $use_on_admin
   */
  private $use_on_admin;

  /**
   * {@inheritdoc}
   */
  public function __construct(ConfigFactoryInterface $config_factory) {
    parent::__construct($config_factory);
    $this->use_on_frontend = VisualDebuggerConstants::IS_FRONTEND_KEY;
    $this->use_on_admin = VisualDebuggerConstants::IS_ADMIN_KEY;
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'visual_debugger_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['visual_debugger.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('visual_debugger.settings');

    $form[$this->use_on_frontend] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Use Visual Debugger on frontend theme'),
      '#default_value' => $config->get($this->use_on_frontend, true),
    ];

    $form[$this->use_on_admin] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Use Visual Debugger on admin theme'),
      '#default_value' => $config->get($this->use_on_admin),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {

    // Original configuration.
    $config = $this->config('visual_debugger.settings');
    $original_frontend = (bool) $config->get($this->use_on_frontend);
    $original_admin = (bool) $config->get($this->use_on_admin);

    // New configuration.
    $new_frontend = (bool) $form_state->getValue($this->use_on_frontend);
    $new_admin = (bool) $form_state->getValue($this->use_on_admin);

    // Invalidate the cache tag if Frontend configuration is differing.
    if ($original_frontend != $new_frontend) {
      \Drupal::service('cache_tags.invalidator')->invalidateTags([VisualDebuggerConstants::FRONTEND_TAG]);
    }

    // Invalidate the cache tag if Admin configuration is differing.
    if ($original_admin != $new_admin) {
      \Drupal::service('cache_tags.invalidator')->invalidateTags([VisualDebuggerConstants::ADMIN_TAG]);
    }

    // Update configuration based on form values.
    $this->config('visual_debugger.settings')
      ->set('use_on_frontend', $new_frontend)
      ->set('use_on_admin', $new_admin)
      ->save();
    parent::submitForm($form, $form_state);
  }

}
