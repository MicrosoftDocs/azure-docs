---
title: 'Ingest data from Kafka into Azure Data Explorer'
description: In this article, you learn how to ingest (load) data into Azure Data Explorer from Kafka.
author: orspod
ms.author: orspodek
ms.reviewer: ankhanol
ms.service: data-explorer
ms.topic: how-to
ms.date: 09/22/2020
 
#Customer intent: As an integration developer, I want to build integration pipelines from Kafka into Azure Data Explorer, so I can make data available for near real time analytics.
---
# Ingest data from Apache Kafka into Azure Data Explorer
 
Azure Data Explorer supports [data ingestion](ingest-data-overview.md) from [Apache Kafka](http://kafka.apache.org/documentation/). Apache Kafka is a distributed streaming platform for building real-time streaming data pipelines that reliably move data between systems or applications. [Kafka Connect](https://docs.confluent.io/3.0.1/connect/intro.html#kafka-connect) is a tool for scalable and reliable streaming of data between Apache Kafka and other data systems. The Azure Data Explorer [Kafka Sink](https://github.com/Azure/kafka-sink-azure-kusto/blob/master/README.md) serves as the connector from Kafka and doesn't require using code. Download the sink connector jar from this [Git repo](https://github.com/Azure/kafka-sink-azure-kusto/releases) or [Confluent Connector Hub](https://www.confluent.io/hub/microsoftcorporation/kafka-sink-azure-kusto).

This article shows how to ingest data with Kafka into Azure Data Explorer, using a self-contained Docker setup to simplify the Kafka cluster and Kafka connector cluster setup. 

For more information, see the connector [Git repo](https://github.com/Azure/kafka-sink-azure-kusto/blob/master/README.md) and [version specifics](https://github.com/Azure/kafka-sink-azure-kusto/blob/master/README.md#13-major-version-specifics).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Create [a cluster and database](create-cluster-database-portal.md) using default cache and retention policies.
* Install [Azure CLI](/cli/azure/install-azure-cli).
* Install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install).

## Create an Azure Active Directory service principal

The Azure Active Directory service principal can be created through the [Azure portal](/azure/active-directory/develop/howto-create-service-principal-portal) or programatically, as in the following example.

This service principal will be the identity leveraged by the connector to write to the Azure Data Explorer table. We'll later grant permissions for this service principal to access Azure Data Explorer.

1. Log in to your Azure subscription via Azure CLI. Then authenticate in the browser.

   ```azurecli-interactive
   az login
   ```


1. Choose the subscription you want use to run the lab. This step is needed when you have multiple subscriptions.

   ```azurecli-interactive
   az account set --subscription YOUR_SUBSCRIPTION_GUID
   ```

1. Create the service principal. In this example, the service principal is called `kusto-kafka-spn`.

   ```azurecli-interactive
   az ad sp create-for-rbac -n "kusto-kafka-spn"
   ```

1. You'll get a JSON response as shown below. Copy the `appId`, `password`, and `tenant`, as you'll need them in later steps.

    ```json
    {
      "appId": "fe7280c7-5705-4789-b17f-71a472340429",
      "displayName": "kusto-kafka-spn",
      "name": "http://kusto-kafka-spn",
      "password": "29c719dd-f2b3-46de-b71c-4004fb6116ee",
      "tenant": "42f988bf-86f1-42af-91ab-2d7cd011db42"
    }
    ```

## Create a target table in Azure Data Explorer

1. Sign in to the [Azure portal](https://portal.azure.com)

1. Go to your Azure Data Explorer cluster.

1. Create a table called `Storms` using the following command:

    ```kusto
    .create table Storms (StartTime: datetime, EndTime: datetime, EventId: int, State: string, EventType: string, Source: string)
    ```

    :::image type="content" source="media/ingest-data-kafka/create-table.png" alt-text="Create a table in Azure Data Explorer portal .":::
    
1. Create the corresponding table mapping `Storms_CSV_Mapping` for ingested data using the following command:
    
    ```kusto
    .create table Storms ingestion csv mapping 'Storms_CSV_Mapping' '[{"Name":"StartTime","datatype":"datetime","Ordinal":0}, {"Name":"EndTime","datatype":"datetime","Ordinal":1},{"Name":"EventId","datatype":"int","Ordinal":2},{"Name":"State","datatype":"string","Ordinal":3},{"Name":"EventType","datatype":"string","Ordinal":4},{"Name":"Source","datatype":"string","Ordinal":5}]'
    ```    

1. Create a batch ingestion policy on the table for configurable ingestion latency.

    > [!TIP]
    > The [ingestion batching policy](kusto/management/batchingpolicy.md) is a performance optimizer and includes three parameters. The first condition satisfied triggers ingestion into the Azure Data Explorer table.

    ```kusto
    .alter table Storms policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:00:15", "MaximumNumberOfItems": 100, "MaximumRawDataSizeMB": 300}'
    ```

1. Use the service principal from [Create an Azure Active Directory service principal](#create-an-azure-active-directory-service-principal) to grant permission to work with the database.

    ```kusto
    .add database YOUR_DATABASE_NAME admins  ('aadapp=YOUR_APP_ID;YOUR_TENANT_ID') 'AAD App'
    ```

## Run the lab

The following lab is designed to give you the experience of starting to create data, setting up the Kafka connector, and streaming this data to Azure Data Explorer with the connector. You can then look at the ingested data.

### Clone the git repo

Clone the lab's git [repo](https://github.com/Azure/azure-kusto-labs).

1. Create a local directory on your machine.

    ```
    mkdir ~/kafka-kusto-hol
    cd ~/kafka-kusto-hol
    ```

1. Clone the repo.

    ```shell
    cd ~/kafka-kusto-hol
    git clone https://github.com/Azure/azure-kusto-labs
    cd azure-kusto-labs/kafka-integration/dockerized-quickstart
    ```

#### Contents of the cloned repo

Run the following command to list the contents of the cloned repo:

```
cd ~/kafka-kusto-hol/azure-kusto-labs/kafka-integration/dockerized-quickstart
tree
```

This result of this search is:

```
├── README.md
├── adx-query.png
├── adx-sink-config.json
├── connector
│   └── Dockerfile
├── docker-compose.yaml
└── storm-events-producer
    ├── Dockerfile
    ├── StormEvents.csv
    ├── go.mod
    ├── go.sum
    ├── kafka
    │   └── kafka.go
    └── main.go
 ```

### Review the files in the cloned repo

The following sections explain the important parts of the files in the file tree above.

#### adx-sink-config.json

This file contains the Kusto sink properties file where you'll update specific configuration details:
 
```json
{
    "name": "storm",
    "config": {
        "connector.class": "com.microsoft.azure.kusto.kafka.connect.sink.KustoSinkConnector",
        "flush.size.bytes": 10000,
        "flush.interval.ms": 10000,
        "tasks.max": 1,
        "topics": "storm-events",
        "kusto.tables.topics.mapping": "[{'topic': 'storm-events','db': '<enter database name>', 'table': 'Storms','format': 'csv', 'mapping':'Storms_CSV_Mapping'}]",
        "aad.auth.authority": "<enter tenant ID>",
        "aad.auth.appid": "<enter application ID>",
        "aad.auth.appkey": "<enter client secret>",
        "kusto.ingestion.url": "https://ingest-<name of cluster>.<region>.kusto.windows.net",
        "kusto.query.url": "https://<name of cluster>.<region>.kusto.windows.net",
        "key.converter": "org.apache.kafka.connect.storage.StringConverter",
        "value.converter": "org.apache.kafka.connect.storage.StringConverter"
    }
}
```

Replace the values for the following attributes as per your Azure Data Explorer setup: `aad.auth.authority`, `aad.auth.appid`, `aad.auth.appkey`, `kusto.tables.topics.mapping` (the database name), `kusto.ingestion.url`, and `kusto.query.url`.

#### Connector - Dockerfile

This file has the commands to generate the docker image for the connector instance.  It includes the connector download from the git repo release directory.

#### Storm-events-producer directory

This directory has a Go program that reads a local "StormEvents.csv" file and publishes the data to a Kafka topic.

#### docker-compose.yaml

```yaml
version: "2"
services:
  zookeeper:
    image: debezium/zookeeper:1.2
    ports:
      - 2181:2181
  kafka:
    image: debezium/kafka:1.2
    ports:
      - 9092:9092
    links:
      - zookeeper
    depends_on:
      - zookeeper
    environment:
      - ZOOKEEPER_CONNECT=zookeeper:2181
      - KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092
  kusto-connect:
    build:
      context: ./connector
      args:
        KUSTO_KAFKA_SINK_VERSION: 1.0.1
    ports:
      - 8083:8083
    links:
      - kafka
    depends_on:
      - kafka
    environment:
      - BOOTSTRAP_SERVERS=kafka:9092
      - GROUP_ID=adx
      - CONFIG_STORAGE_TOPIC=my_connect_configs
      - OFFSET_STORAGE_TOPIC=my_connect_offsets
      - STATUS_STORAGE_TOPIC=my_connect_statuses
  events-producer:
    build:
      context: ./storm-events-producer
    links:
      - kafka
    depends_on:
      - kafka
    environment:
      - KAFKA_BOOTSTRAP_SERVER=kafka:9092
      - KAFKA_TOPIC=storm-events
      - SOURCE_FILE=StormEvents.csv
```

### Start the containers

1. In a terminal, start the containers:
    
    ```shell
    docker-compose up
    ```

    The producer application will start sending events to the `storm-events` topic. 
    You should see logs similar to the following logs:

    ```shell
    ....
    events-producer_1  | sent message to partition 0 offset 0
    events-producer_1  | event  2007-01-01 00:00:00.0000000,2007-01-01 00:00:00.0000000,13208,NORTH CAROLINA,Thunderstorm Wind,Public
    events-producer_1  | 
    events-producer_1  | sent message to partition 0 offset 1
    events-producer_1  | event  2007-01-01 00:00:00.0000000,2007-01-01 05:00:00.0000000,23358,WISCONSIN,Winter Storm,COOP Observer
    ....
    ```
    
1. To check the logs, run the following command in a separate terminal:

    ```shell
    docker-compose logs -f | grep kusto-connect
    ```
    
### Start the connector

Use a Kafka Connect REST call to start the connector.

1. In a separate terminal, launch the sink task with the following command:

    ```shell
    curl -X POST -H "Content-Type: application/json" --data @adx-sink-config.json http://localhost:8083/connectors
    ```
    
1. To check the status, run the following command in a separate terminal:
    
    ```shell
    curl http://localhost:8083/connectors/storm/status
    ```

The connector will start queueing ingestion processes to Azure Data Explorer.

> [!NOTE]
> If you have log connector issues, [create an issue](https://github.com/Azure/kafka-sink-azure-kusto/issues).

## Query and review data

### Confirm data ingestion

1. Wait for data to arrive in the `Storms` table. To confirm the transfer of data, check the row count:
    
    ```kusto
    Storms | count
    ```

1. Confirm that there are no failures in the ingestion process:

    ```kusto
    .show ingestion failures
    ```
    
    Once you see data, try out a few queries. 

### Query the data

1. To see all the records, run the following [query](write-queries.md):
    
    ```kusto
    Storms
    ```

1. Use `where` and `project` to filter specific data:
    
    ```kusto
    Storms
    | where EventType == 'Drought' and State == 'TEXAS'
    | project StartTime, EndTime, Source, EventId
    ```
    
1. Use the [`summarize`](./write-queries.md#summarize) operator:

    ```kusto
    Storms
    | summarize event_count=count() by State
    | where event_count > 10
    | project State, event_count
    | render columnchart
    ```
    
    :::image type="content" source="media/ingest-data-kafka/kusto-query.png" alt-text="Kafka query column chart results in Azure Data Explorer.":::

For more query examples and guidance, see [Write queries for Azure Data Explorer](write-queries.md) and [Kusto query language documentation](./kusto/query/index.md).

## Reset

To reset, do the following steps:

1. Stop the containers (`docker-compose down -v`)
1. Delete (`drop table Storms`)
1. Re-create the `Storms` table
1. Recreate table mapping
1. Restart containers (`docker-compose up`)

## Clean up resources

To delete the Azure Data Explorer resources, use [az cluster delete](/cli/azure/kusto/cluster#az_kusto_cluster_delete) or [az Kusto database delete](/cli/azure/kusto/database#az_kusto_database_delete):

```azurecli-interactive
az kusto cluster delete -n <cluster name> -g <resource group name>
az kusto database delete -n <database name> --cluster-name <cluster name> -g <resource group name>
```

## Next Steps

* Learn more about [Big data architecture](/azure/architecture/solution-ideas/articles/big-data-azure-data-explorer).
* Learn [how to ingest JSON formatted sample data into Azure Data Explorer](./ingest-json-formats.md?tabs=kusto-query-language).
* For additional Kafka labs:
   * [Hands on lab for ingestion from Confluent Cloud Kafka in distributed mode](https://github.com/Azure/azure-kusto-labs/blob/master/kafka-integration/confluent-cloud/README.md)
   * [Hands on lab for ingestion from HDInsight Kafka in distributed mode](https://github.com/Azure/azure-kusto-labs/tree/master/kafka-integration/distributed-mode/hdinsight-kafka)
   * [Hands on lab for ingestion from Confluent IaaS Kafka on AKS in distributed mode](https://github.com/Azure/azure-kusto-labs/blob/master/kafka-integration/distributed-mode/confluent-kafka/README.md)
