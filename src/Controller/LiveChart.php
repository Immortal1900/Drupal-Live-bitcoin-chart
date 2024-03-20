<?php
namespace Drupal\dtask\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Form\FormBase;
use \Drupal\dtask\form\ChartForm;
use Symfony\Component\DependencyInjection\ContainerInterface as DependencyInjectionContainerInterface;


class LiveChart extends ControllerBase{




    public $form;
    public function __construct(array $form) {

        $this->form = $form;
      }
      
      public static function create(DependencyInjectionContainerInterface $container) {
        return new static(
   
            $container->get('form_builder')->getForm(ChartForm::class)
        );
      }

    public function chart(){

    $build = [];
    $build['#form'] =  \Drupal::service('renderer')->render($this->form);
    $build['#theme'] = 'custom_page';
    return $build;
    }
}

?>