<?php
namespace Drupal\dtask\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

class ChartForm extends FormBase {

  public function getFormId() {
    return 'chatform';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
     $form['row'] = [] ;
      $form['row']['container_1'] = [
        '#type' => 'container',
        '#attributes' => ['class' => ['row-container1']], // Add a CSS class for styling
      ];
      $form['row']['container_2'] = [
        '#type' => 'container',
        '#attributes' => ['class' => ['row-container1']], // Add a CSS class for styling
      ];
      $form['row']['container_1']['current_price'] = [


        '#markup' => '<p id="current-price"> $0 </p>',
        '#prefix' => '<div class="custom-center">Current Price',
        '#suffix' => '</div>',
      
      ];
    $form['row']['container_1']['graph_type'] = [
        '#type' => 'select',
        '#title' => $this->t('Graph Type'),
        '#prefix' => '<div class="dropdown-wrapper">', // Add a prefix div for styling
        '#suffix' => '</div>',
        '#options' => [
     
          'line' => $this->t('line'),
          'candle' => $this->t('candle'),
        ],
      ];

      $form['row']['container_2']['time_frame'] = [
        '#type' => 'select',
        '#title' => $this->t('Time Frame'),
        '#options' => [
          '5mins' => $this->t('5mins'),
          '1hour' => $this->t('1hour'),
          '6hour' => $this->t('6hour'),
          '24hour' => $this->t('24hour'),
        ],
        '#prefix' => '<div class="dropdown-wrapper">', // Add a prefix div for styling
        '#suffix' => '</div>'
      ];
      $form['row']['container_2']['granularity'] = [
        '#type' => 'select',
        '#title' => $this->t('Granularity'),
        '#prefix' => '<div class="dropdown-wrapper">', // Add a prefix div for styling
        '#suffix' => '</div>',
        '#options' => [
          '5' => $this->t('5secs'),
          '60' => $this->t('1min'),
          '300' => $this->t('5min'),
        ],
      ];

    return $form;
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {

  }

}
?>
