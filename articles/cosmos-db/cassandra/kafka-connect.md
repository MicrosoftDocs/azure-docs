---
title: Integrate Apache Kafka and Azure Cosmos DB for Apache Cassandra using Kafka Connect
description: Learn how to ingest data from Kafka to Azure Cosmos DB for Apache Cassandra using DataStax Apache Kafka Connector
author: seesharprun
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 12/14/2020
ms.author: sidandrews
ms.reviewer: abhishgu
---

# Ingest data from Apache Kafka into Azure Cosmos DB for Apache Cassandra using Kafka Connect
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

Existing Cassandra applications can easily work with the [Azure Cosmos DB for Apache Cassandra](introduction.md) because of its [CQLv4 driver compatibility](https://cassandra.apache.org/doc/latest/cassandra/getting_started/drivers.html?highlight=driver). You leverage this capability to integrate with streaming platforms such as [Apache Kafka](https://kafka.apache.org/) and bring data into Azure Cosmos DB.

Data in Apache Kafka (topics) is only useful when consumed by other applications or ingested into other systems. It's possible to build a solution using the [Kafka Producer/Consumer](https://kafka.apache.org/documentation/#api) APIs [using a language and client SDK of your choice](https://cwiki.apache.org/confluence/display/KAFKA/Clients). Kafka Connect provides an alternative solution. It's a platform to stream data between Apache Kafka and other systems in a scalable and reliable manner. Since Kafka Connect supports off the shelf connectors which includes Cassandra, you don't need to write custom code to integrate Kafka with Azure Cosmos DB for Apache Cassandra. 

In this article, we will be using the open-source [DataStax Apache Kafka connector](https://docs.datastax.com/en/kafka/doc/kafka/kafkaIntro.html), that works on top of Kafka Connect framework to ingest records from a Kafka topic into rows of one or more Cassandra tables. The example provides a reusable setup using Docker Compose. This is quite convenient since it enables you to bootstrap all the required components locally with a single command. These components include Kafka, Zookeeper, Kafka Connect worker, and the sample data generator application.

Here is a breakdown of the components and their service definitions - you can refer to the complete `docker-compose` file [in the GitHub repo](https://github.com/Azure-Samples/cosmosdb-cassandra-kafka/blob/main/docker-compose.yaml).

- Kafka and Zookeeper use [debezium](https://hub.docker.com/r/debezium/kafka/) images.
- To run as a Docker container, the DataStax Apache Kafka Connector is baked on top of an existing Docker image - [debezium/connect-base](https://github.com/debezium/docker-images/tree/master/connect-base/1.2). This image includes an installation of Kafka and its Kafka Connect libraries, thus making it really convenient to add custom connectors. You can refer to the [Dockerfile](https://github.com/Azure-Samples/cosmosdb-cassandra-kafka/blob/main/connector/Dockerfile).
- The `data-generator` service seeds randomly generated (JSON) data into the `weather-data` Kafka topic. You can refer to the code and `Dockerfile` in [the GitHub repo](https://github.com/Azure-Samples/cosmosdb-cassandra-kafka/blob/main/data-generator/)

## Prerequisites

* [Provision an Azure Cosmos DB for Apache Cassandra account](manage-data-dotnet.md#create-a-database-account)

* [Use cqlsh for validation](support.md#cql-shell)

* Install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install)

## Create Keyspace, tables and start the integration pipeline

Using the Azure portal, create the Cassandra Keyspace and the tables required for the demo application.

> [!NOTE]
> Use the same Keyspace and table names as below

```sql
CREATE KEYSPACE weather WITH REPLICATION = {'class' : 'NetworkTopologyStrategy', 'datacenter1' : 1};

CREATE TABLE weather.data_by_state (station_id text, temp int, state text, ts timestamp, PRIMARY KEY (state, ts)) WITH CLUSTERING ORDER BY (ts DESC) AND cosmosdb_cell_level_timestamp=true AND cosmosdb_cell_level_timestamp_tombstones=true AND cosmosdb_cell_level_timetolive=true;

CREATE TABLE weather.data_by_station (station_id text, temp int, state text, ts timestamp, PRIMARY KEY (station_id, ts)) WITH CLUSTERING ORDER BY (ts DESC) AND cosmosdb_cell_level_timestamp=true AND cosmosdb_cell_level_timestamp_tombstones=true AND cosmosdb_cell_level_timetolive=true;
```

Clone the GitHub repo:

```bash
git clone https://github.com/Azure-Samples/cosmosdb-cassandra-kafka
cd cosmosdb-cassandra-kafka
```

Start all the services:

```shell
docker-compose --project-name kafka-cosmos-cassandra up --build
```

> [!NOTE]
> It might take a while to download and start the containers: this is just a one time process.

To confirm whether all the containers have started:

```shell
docker-compose -p kafka-cosmos-cassandra ps
```

The data generator application will start pumping data into the `weather-data` topic in Kafka. You can also do quick sanity check to confirm. Peek into the Docker container running the Kafka connect worker:


```bash
docker exec -it kafka-cosmos-cassandra_cassandra-connector_1 bash
```

Once you drop into the container shell, just start the usual Kafka console consumer process and you should see weather data (in JSON format) flowing in.

```bash
cd ../bin
./kafka-console-consumer.sh --bootstrap-server kafka:9092 --topic weather-data
```

## Cassandra Sink connector setup

Copy the JSON contents below to a file (you can name it `cassandra-sink-config.json`). You will need to update it as per your setup and the rest of this section will provide guidance around this topic.

```json
{
    "name": "kafka-cosmosdb-sink",
    "config": {
        "connector.class": "com.datastax.oss.kafka.sink.CassandraSinkConnector",
        "tasks.max": "1",
        "topics": "weather-data",
        "contactPoints": "<cosmos db account name>.cassandra.cosmos.azure.com",
        "port": 10350,
        "loadBalancing.localDc": "<cosmos db region e.g. Southeast Asia>",
        "auth.username": "<enter username for cosmosdb account>",
        "auth.password": "<enter password for cosmosdb account>",
        "ssl.hostnameValidation": true,
        "ssl.provider": "JDK",
        "ssl.keystore.path": "/etc/alternatives/jre/lib/security/cacerts/",
        "ssl.keystore.password": "changeit",
        "datastax-java-driver.advanced.connection.init-query-timeout": 5000,
        "maxConcurrentRequests": 500,
        "maxNumberOfRecordsInBatch": 32,
        "queryExecutionTimeout": 30,
        "connectionPoolLocalSize": 4,
        "topic.weather-data.weather.data_by_state.mapping": "station_id=value.stationid, temp=value.temp, state=value.state, ts=value.created",
        "topic.weather-data.weather.data_by_station.mapping": "station_id=value.stationid, temp=value.temp, state=value.state, ts=value.created",
        "key.converter": "org.apache.kafka.connect.storage.StringConverter",
        "value.converter": "org.apache.kafka.connect.json.JsonConverter",
        "value.converter.schemas.enable": false,
        "offset.flush.interval.ms": 10000
    }
}
```

Here is a summary of the attributes:

**Basic connectivity**

- `contactPoints`: enter the contact point for Azure Cosmos DB Cassandra
- `loadBalancing.localDc`: enter the region for Azure Cosmos DB account e.g. Southeast Asia
- `auth.username`: enter the username
- `auth.password`: enter the password
- `port`: enter the port value (this is `10350`, not `9042`. leave it as is)

**SSL configuration**

Azure Cosmos DB enforces [secure connectivity over SSL](../database-security.md) and Kafka Connect connector supports SSL as well.

- `ssl.keystore.path`: path to the JDK keystore in the container - `/etc/alternatives/jre/lib/security/cacerts/`
- `ssl.keystore.password`: JDK keystore (default) password
- `ssl.hostnameValidation`: We turn own node hostname validation
- `ssl.provider`: `JDK` is used as the SSL provider

**Generic parameters**

- `key.converter`: We use the string converter `org.apache.kafka.connect.storage.StringConverter`
- `value.converter`: since the data in Kafka topics is JSON, we make use of `org.apache.kafka.connect.json.JsonConverter`
- `value.converter.schemas.enable`: Since our JSON payload doesn't have a schema associated with it (for the purposes of the demo app), we need to instruct Kafka Connect to not look for a schema by setting this attribute to `false`. Not doing so will result in failures.

### Install the connector

Install the connector using the Kafka Connect REST endpoint:

```shell
curl -X POST -H "Content-Type: application/json" --data @cassandra-sink-config.json http://localhost:8083/connectors
```

To check the status:

```
curl http://localhost:8080/connectors/kafka-cosmosdb-sink/status
```

If all goes well, the connector should start weaving its magic. It should authenticate to Azure Cosmos DB and start ingesting data from the Kafka topic (`weather-data`) into Cassandra tables - `weather.data_by_state` and `weather.data_by_station`

You can now query data in the tables. Head over to the Azure portal, bring up the hosted CQL Shell for your Azure Cosmos DB account.

:::image type="content" source="./media/kafka-connect/cqlsh.png" alt-text="Open CQLSH":::

## Query data from Azure Cosmos DB

Check the `data_by_state` and `data_by_station` tables. Here is some sample queries to get you started:

```sql
select * from weather.data_by_state where state = 'state-1';
select * from weather.data_by_state where state IN ('state-1', 'state-2');
select * from weather.data_by_state where state = 'state-3' and ts > toTimeStamp('2020-11-26');

select * from weather.data_by_station where station_id = 'station-1';
select * from weather.data_by_station where station_id IN ('station-1', 'station-2');
select * from weather.data_by_station where station_id IN ('station-2', 'station-3') and ts > toTimeStamp('2020-11-26');
```

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../includes/cosmos-db-delete-resource-group.md)]

## Next steps

* [Provision throughput on containers and databases](../set-throughput.md) 
* [Partition key best practices](../partitioning-overview.md#choose-partitionkey)
* [Estimate RU/s using the Azure Cosmos DB capacity planner](../estimate-ru-with-capacity-planner.md) articles
