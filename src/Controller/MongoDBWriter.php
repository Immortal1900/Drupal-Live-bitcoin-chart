<?php
namespace Drupal\dtask\Controller;

use DateTime;
use Drupal\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Controller\ControllerBase;
use stdClass;
use \Drupal\mongodb\DatabaseFactory;
use Symfony\Component\DependencyInjection\ContainerInterface as DependencyInjectionContainerInterface;

class MongoDBWriter extends ControllerBase{




    public $mongodbDatabaseFactory;

    public function __construct(DatabaseFactory $databaseFactory)
    {

        $this->mongodbDatabaseFactory = $databaseFactory;
    }

    public static function create(DependencyInjectionContainerInterface $container)
    {
        return new static($container->get('mongodb.database_factory'));
    }

    /**
     * {@inheritdoc}
     */
    public function saveData(Request $request)
    {
        $data = $request->request->all();

        $timestamp = \Drupal::time()->getRequestTime();
        $data['timestamp'] = $timestamp;
        $database = $this->mongodbDatabaseFactory->get("logger");

        if ($data['type'] == "line") {

            $collection = $database->selectCollection('bitcoinline');
            $collection->insertOne($data);
        } else {
            $collection = $database->selectCollection('bitcoinData');
            $collection->insertOne($data);
        }


        $c = new StdClass;
        $c->success = true;
        return new JsonResponse($c);
    }


    public function getDataforLineChart(Request $request)
    {
        $data = $request->request->all();
        $database = $this->mongodbDatabaseFactory->get("logger");
        $collection = $database->selectCollection('bitcoinline');
        $query = [];
        $btc_data = [];
        $prevTimestamp = null;
        $query = getTimeframQUery($data);
        $granularity = 60;
        if ($data['granularity']) {
            $granularity = $data['granularity'];
        }
        $rows = $collection->find($query);
        foreach ($rows as $key => $row) {
            if ($prevTimestamp === null || ($row->timestamp - $prevTimestamp) >= $granularity) {

                $prevTimestamp = $row->timestamp;

                $time =   date('Y-m-d H:i:s', $row->timestamp);
                $btc_data['price'][] = $row->price;
                $btc_data['timestamp'][] = $row->timestamp;
                $btc_data['time'][] = $time;
            }
        }
        return new JsonResponse($btc_data);
    }

    public function getDataforCandleChart(Request $request)
    {
        $database = $this->mongodbDatabaseFactory->get("logger");
        $collection = $database->selectCollection('bitcoinData');
        $btc_data = [];
        $prevTimestamp = null;
        $query = [];
        $data = $request->request->all();
        $query = getTimeframQUery($data);

        if($query == null){
            $query=[];
        }
        $granularity = 60;
        if ($data['granularity']) {
            $granularity = $data['granularity'];
        }
        $rows = $collection->find($query);
        foreach ($rows as $key => $row) {
            if ($prevTimestamp === null || ($row->timestamp - $prevTimestamp) >= $granularity) {
                $prevTimestamp = $row->timestamp;
                $time =   date('Y-m-d H:i:s', $row->timestamp);
                $btc_data['high'][] = $row->high;
                $btc_data['low'][] = $row->low;
                $btc_data['open'][] = $row->open;
                $btc_data['close'][] = $row->close;
                $btc_data['timestamp'][] = $time;
            }
        }
        return new JsonResponse($btc_data);
    }
}

?>