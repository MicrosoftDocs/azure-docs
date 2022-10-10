---
title: Migrate data from PostgreSQL to Azure Cosmos DB for Apache Cassandra account using Apache Kafka
description: Learn how to use Kafka Connect to synchronize data from PostgreSQL to Azure Cosmos DB for Apache Cassandra in real time.
author: seesharprun
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 04/02/2022
ms.author: sidandrews
ms.reviewer: abhishgu
---

# Migrate data from PostgreSQL to Azure Cosmos DB for Apache Cassandra account using Apache Kafka
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

API for Cassandra in Azure Cosmos DB has become a great choice for enterprise workloads running on Apache Cassandra for various reasons such as:

* **Significant cost savings:** You can save cost with Azure Cosmos DB, which includes the cost of VM’s, bandwidth, and any applicable Oracle licenses. Additionally, you don’t have to manage the data centers, servers, SSD storage, networking, and electricity costs.

* **Better scalability and availability:** It eliminates single points of failure, better scalability, and availability for your applications.

* **No overhead of managing and monitoring:** As a fully managed cloud service, Azure Cosmos DB removes the overhead of managing and monitoring a myriad of settings.

[Kafka Connect](https://kafka.apache.org/documentation/#connect) is a platform to stream data between [Apache Kafka](https://kafka.apache.org/) and other systems in a scalable and reliable manner. It supports several off the shelf connectors, which means that you don't need custom code to integrate external systems with Apache Kafka.

This article will demonstrate how to use a combination of Kafka connectors to set up a data pipeline to continuously synchronize records from a relational database such as [PostgreSQL](https://www.postgresql.org/) to [Azure Cosmos DB for Apache Cassandra](introduction.md).

## Overview

Here is high-level overview of the end to end flow presented in this article.

Data in PostgreSQL table will be pushed to Apache Kafka using the [Debezium PostgreSQL connector](https://debezium.io/documentation/reference/1.2/connectors/postgresql.html), which is a Kafka Connect **source** connector. Inserts, updates, or deletion to records in the PostgreSQL table will be captured as `change data` events and sent to Kafka topic(s). The [DataStax Apache Kafka connector](https://docs.datastax.com/en/kafka/doc/kafka/kafkaIntro.html) (Kafka Connect **sink** connector), forms the second part of the pipeline. It will synchronize the change data events from Kafka topic to Azure Cosmos DB for Apache Cassandra tables.

> [!NOTE]
> Using specific features of the DataStax Apache Kafka connector allows us to push data to multiple tables. In this example, the connector will help us persist change data records to two Cassandra tables that can support different query requirements.

## Prerequisites

* [Provision an Azure Cosmos DB for Apache Cassandra account](manage-data-dotnet.md#create-a-database-account)
* [Use cqlsh for validation](support.md#cql-shell)
* JDK 8 or above
* [Docker](https://www.docker.com/) (optional)

## Base setup

### Set up PostgreSQL database if you haven't already.

This could be an existing on-premises database or you could [download and install one](https://www.postgresql.org/download/) on your local machine. It's also possible to use a [Docker container](https://hub.docker.com/_/postgres).
[!INCLUDE [pull-image-include](../../../includes/pull-image-include.md)]

To start a container:

```bash
docker run --rm -p 5432:5432 -e POSTGRES_PASSWORD=<enter password> postgres
```

Connect to your PostgreSQL instance using [`psql`](https://www.postgresql.org/docs/current/app-psql.html) client:

```bash
psql -h localhost -p 5432 -U postgres -W -d postgres
```

Create a table to store sample order information:

```sql
CREATE SCHEMA retail;

CREATE TABLE retail.orders_info (
	orderid SERIAL NOT NULL PRIMARY KEY,
	custid INTEGER NOT NULL,
	amount INTEGER NOT NULL,
	city VARCHAR(255) NOT NULL,
	purchase_time VARCHAR(40) NOT NULL
);
```

### Using the Azure portal, create the Cassandra Keyspace and the tables required for the demo application.

> [!NOTE]
> Use the same Keyspace and table names as below

```sql
CREATE KEYSPACE retail WITH REPLICATION = {'class' : 'NetworkTopologyStrategy', 'datacenter1' : 1};

CREATE TABLE retail.orders_by_customer (order_id int, customer_id int, purchase_amount int, city text, purchase_time timestamp, PRIMARY KEY (customer_id, purchase_time)) WITH CLUSTERING ORDER BY (purchase_time DESC) AND cosmosdb_cell_level_timestamp=true AND cosmosdb_cell_level_timestamp_tombstones=true AND cosmosdb_cell_level_timetolive=true;

CREATE TABLE retail.orders_by_city (order_id int, customer_id int, purchase_amount int, city text, purchase_time timestamp, PRIMARY KEY (city,order_id)) WITH cosmosdb_cell_level_timestamp=true AND cosmosdb_cell_level_timestamp_tombstones=true AND cosmosdb_cell_level_timetolive=true;
```

### Setup Apache Kafka

This article uses a local cluster, but you can choose any other option. [Download Kafka](https://kafka.apache.org/downloads), unzip it, start the Zookeeper and Kafka cluster.

```bash
cd <KAFKA_HOME>/bin

#start zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

#start kafka (in another terminal)
bin/kafka-server-start.sh config/server.properties
```

### Setup connectors

Install the Debezium PostgreSQL and DataStax Apache Kafka connector. Download the Debezium PostgreSQL connector plug-in archive. For example, to download version 1.3.0 of the connector (latest at the time of writing), use [this link](https://repo1.maven.org/maven2/io/debezium/debezium-connector-postgres/1.3.0.Final/debezium-connector-postgres-1.3.0.Final-plugin.tar.gz). Download the DataStax Apache Kafka connector from [this link](https://downloads.datastax.com/#akc).

Unzip both the connector archives and copy the JAR files to the [Kafka Connect plugin.path](https://kafka.apache.org/documentation/#connectconfigs).


```bash
cp <path_to_debezium_connector>/*.jar <KAFKA_HOME>/libs
cp <path_to_cassandra_connector>/*.jar <KAFKA_HOME>/libs
```

> For details, please refer to the [Debezium](https://debezium.io/documentation/reference/1.2/connectors/postgresql.html#postgresql-deploying-a-connector) and [DataStax](https://docs.datastax.com/en/kafka/doc/) documentation.

## Configure Kafka Connect and start data pipeline

### Start Kafka Connect cluster

```bash
cd <KAFKA_HOME>/bin
./connect-distributed.sh ../config/connect-distributed.properties
```

### Start PostgreSQL connector instance

Save the connector configuration (JSON) to a file example `pg-source-config.json`

```json
{
    "name": "pg-orders-source",
    "config": {
        "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
        "database.hostname": "localhost",
        "database.port": "5432",
        "database.user": "postgres",
        "database.password": "password",
        "database.dbname": "postgres",
        "database.server.name": "myserver",
        "plugin.name": "wal2json",
        "table.include.list": "retail.orders_info",
        "value.converter": "org.apache.kafka.connect.json.JsonConverter"
    }
}
```

To start the PostgreSQL connector instance:

```bash
curl -X POST -H "Content-Type: application/json" --data @pg-source-config.json http://localhost:8083/connectors
```

> [!NOTE]
> To delete, you can use: `curl -X DELETE http://localhost:8083/connectors/pg-orders-source`


### Insert data

The `orders_info` table contains order details such as order ID, customer ID, city etc. Populate the table with random data using the below SQL.

```sql
insert into retail.orders_info (
    custid, amount, city, purchase_time
)
select
    random() * 10000 + 1,
    random() * 200,
    ('{New Delhi,Seattle,New York,Austin,Chicago,Cleveland}'::text[])[ceil(random()*3)],
    NOW() + (random() * (interval '1 min'))
from generate_series(1, 10) s(i);
```

It should insert 10 records into the table. Be sure to update the number of records in `generate_series(1, 10)` below as per your requirements example, to insert `100` records, use `generate_series(1, 100)`

To confirm:

```bash
select * from retail.orders_info;
```

Check the change data capture events in the Kafka topic

> [!NOTE]
> Note that the topic name is `myserver.retail.orders_info` which as per the [connector convention](https://debezium.io/documentation/reference/1.3/connectors/postgresql.html#postgresql-topic-names)

```bash
cd <KAFKA_HOME>/bin

./kafka-console-consumer.sh --topic myserver.retail.orders_info --bootstrap-server localhost:9092 --from-beginning
```

You should see the change data events in JSON format.

### Start DataStax Apache Kafka connector instance

Save the connector configuration (JSON) to a file example, `cassandra-sink-config.json` and update the properties as per your environment.

```json
{
    "name": "kafka-cosmosdb-sink",
    "config": {
        "connector.class": "com.datastax.oss.kafka.sink.CassandraSinkConnector",
        "tasks.max": "1",
        "topics": "myserver.retail.orders_info",
        "contactPoints": "<Azure Cosmos DB account name>.cassandra.cosmos.azure.com",
        "loadBalancing.localDc": "<Azure Cosmos DB region e.g. Southeast Asia>",
        "datastax-java-driver.advanced.connection.init-query-timeout": 5000,
        "ssl.hostnameValidation": true,
        "ssl.provider": "JDK",
        "ssl.keystore.path": "<path to JDK keystore path e.g. <JAVA_HOME>/jre/lib/security/cacerts>",
        "ssl.keystore.password": "<keystore password: it is 'changeit' by default>",
        "port": 10350,
        "maxConcurrentRequests": 500,
        "maxNumberOfRecordsInBatch": 32,
        "queryExecutionTimeout": 30,
        "connectionPoolLocalSize": 4,
        "auth.username": "<Azure Cosmos DB user name (same as account name)>",
        "auth.password": "<Azure Cosmos DB password>",
        "topic.myserver.retail.orders_info.retail.orders_by_customer.mapping": "order_id=value.orderid, customer_id=value.custid, purchase_amount=value.amount, city=value.city, purchase_time=value.purchase_time",
        "topic.myserver.retail.orders_info.retail.orders_by_city.mapping": "order_id=value.orderid, customer_id=value.custid, purchase_amount=value.amount, city=value.city, purchase_time=value.purchase_time",
        "key.converter": "org.apache.kafka.connect.storage.StringConverter",
        "transforms": "unwrap",
        "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
        "offset.flush.interval.ms": 10000
    }
}
```

To start the connector instance:

```bash
curl -X POST -H "Content-Type: application/json" --data @cassandra-sink-config.json http://localhost:8083/connectors
```

The connector should spring into action and the end to end pipeline from PostgreSQL to Azure Cosmos DB will be operational.

### Query Azure Cosmos DB

Check the Cassandra tables in Azure Cosmos DB. Here are some of the queries you can try:

```sql
select count(*) from retail.orders_by_customer;
select count(*) from retail.orders_by_city;

select * from retail.orders_by_customer;
select * from retail.orders_by_city;

select * from retail.orders_by_city where city='Seattle';
select * from retail.orders_by_customer where customer_id = 10;
```

You can continue to insert more data into PostgreSQL and confirm that the records are synchronized to Azure Cosmos DB.

## Next steps

* [Integrate Apache Kafka and Azure Cosmos DB for Apache Cassandra using Kafka Connect](kafka-connect.md)
* [Integrate Apache Kafka Connect on Azure Event Hubs (Preview) with Debezium for Change Data Capture](../../event-hubs/event-hubs-kafka-connect-debezium.md)
* [Migrate data from Oracle to Azure Cosmos DB for Apache Cassandra using Arcion](oracle-migrate-cosmos-db-arcion.md)
* [Provision throughput on containers and databases](../set-throughput.md)
* [Partition key best practices](../partitioning-overview.md#choose-partitionkey)
* [Estimate RU/s using the Azure Cosmos DB capacity planner](../estimate-ru-with-capacity-planner.md) articles
