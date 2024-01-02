---
title: Integrate Apache Kafka Connect on Azure Event Hubs with Debezium for Change Data Capture
description: This article provides information on how to use Debezium with Azure Event Hubs for Kafka.
ms.topic: how-to
ms.date: 10/18/2021
---

# Integrate Apache Kafka Connect support on Azure Event Hubs with Debezium for Change Data Capture

**Change Data Capture (CDC)** is a technique used to track row-level changes in database tables in response to create, update, and delete operations. [Debezium](https://debezium.io/) is a distributed platform that builds on top of Change Data Capture features available in different databases (for example, [logical decoding in PostgreSQL](https://www.postgresql.org/docs/current/static/logicaldecoding-explanation.html)). It provides a set of [Kafka Connect connectors](https://debezium.io/documentation/reference/1.2/connectors/index.html) that tap into row-level changes in database table(s) and convert them into event streams that are then sent to [Apache Kafka](https://kafka.apache.org/).

This tutorial walks you through how to set up a change data capture based system on Azure using [Event Hubs](./event-hubs-about.md?WT.mc_id=devto-blog-abhishgu) (for Kafka), [Azure DB for PostgreSQL](../postgresql/overview.md) and Debezium. It will use the [Debezium PostgreSQL connector](https://debezium.io/documentation/reference/1.2/connectors/postgresql.html) to stream database modifications from PostgreSQL to Kafka topics in Event Hubs

> [!NOTE]
> This article contains references to a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

In this tutorial, you take the following steps:

> [!div class="checklist"]
> * Create an Event Hubs namespace
> * Setup and configure Azure Database for PostgreSQL
> * Configure and run Kafka Connect with Debezium PostgreSQL connector
> * Test change data capture
> * (Optional) Consume change data events with a `FileStreamSink` connector

## Pre-requisites
To complete this walk through, you'll require:

- Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- Linux/MacOS
- Kafka release (version 1.1.1, Scala version 2.11), available from [kafka.apache.org](https://kafka.apache.org/downloads#1.1.1)
- Read through the [Event Hubs for Apache Kafka](./azure-event-hubs-kafka-overview.md) introduction article

## Create an Event Hubs namespace
An Event Hubs namespace is required to send and receive from any Event Hubs service. See [Creating an event hub](event-hubs-create.md) for instructions to create a namespace and an event hub. Get the Event Hubs connection string and fully qualified domain name (FQDN) for later use. For instructions, see [Get an Event Hubs connection string](event-hubs-get-connection-string.md). 

## Set up and configure Azure Database for PostgreSQL
[Azure Database for PostgreSQL](../postgresql/overview.md) is a relational database service based on the community version of open-source PostgreSQL database engine, and is available in three deployment options: Single Server, Flexible Server and Cosmos DB for PostgreSQL. [Follow these instructions](../postgresql/quickstart-create-server-database-portal.md) to create an Azure Database for PostgreSQL server using the Azure portal. 

## Setup and run Kafka Connect
This section will cover the following topics:

- Debezium connector installation
- Configuring Kafka Connect for Event Hubs
- Start Kafka Connect cluster with Debezium connector

### Download and setup Debezium connector
Follow the latest instructions in the [Debezium documentation](https://debezium.io/documentation/reference/1.2/connectors/postgresql.html#postgresql-deploying-a-connector) to download and set up the connector.

- Download the connector’s plug-in archive. For example, to download version `1.2.0` of the connector, use this link - https://repo1.maven.org/maven2/io/debezium/debezium-connector-postgres/1.2.0.Final/debezium-connector-postgres-1.2.0.Final-plugin.tar.gz
- Extract the JAR files and copy them to the [Kafka Connect plugin.path](https://kafka.apache.org/documentation/#connectconfigs).


### Configure Kafka Connect for Event Hubs
Minimal reconfiguration is necessary when redirecting Kafka Connect throughput from Kafka to Event Hubs.  The following `connect-distributed.properties` sample illustrates how to configure Connect to authenticate and communicate with the Kafka endpoint on Event Hubs:

> [!IMPORTANT]
> - Debezium will auto-create a topic per table and a bunch of metadata topics. Kafka **topic** corresponds to an Event Hubs instance (event hub). For Apache Kafka to Azure Event Hubs mappings, see [Kafka and Event Hubs conceptual mapping](azure-event-hubs-kafka-overview.md#apache-kafka-and-azure-event-hubs-conceptual-mapping). 
> - There are different **limits** on number of event hubs in an Event Hubs namespace depending on the tier (Basic, Standard, Premium, or Dedicated). For these limits, See [Quotas](compare-tiers.md#quotas).

```properties
bootstrap.servers={YOUR.EVENTHUBS.FQDN}:9093 # e.g. namespace.servicebus.windows.net:9093
group.id=connect-cluster-group

# connect internal topic names, auto-created if not exists
config.storage.topic=connect-cluster-configs
offset.storage.topic=connect-cluster-offsets
status.storage.topic=connect-cluster-status

# internal topic replication factors - auto 3x replication in Azure Storage
config.storage.replication.factor=1
offset.storage.replication.factor=1
status.storage.replication.factor=1

rest.advertised.host.name=connect
offset.flush.interval.ms=10000

key.converter=org.apache.kafka.connect.json.JsonConverter
value.converter=org.apache.kafka.connect.json.JsonConverter
internal.key.converter=org.apache.kafka.connect.json.JsonConverter
internal.value.converter=org.apache.kafka.connect.json.JsonConverter

internal.key.converter.schemas.enable=false
internal.value.converter.schemas.enable=false

# required EH Kafka security settings
security.protocol=SASL_SSL
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="{YOUR.EVENTHUBS.CONNECTION.STRING}";

producer.security.protocol=SASL_SSL
producer.sasl.mechanism=PLAIN
producer.sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="{YOUR.EVENTHUBS.CONNECTION.STRING}";

consumer.security.protocol=SASL_SSL
consumer.sasl.mechanism=PLAIN
consumer.sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="{YOUR.EVENTHUBS.CONNECTION.STRING}";

plugin.path={KAFKA.DIRECTORY}/libs # path to the libs directory within the Kafka release
```

> [!IMPORTANT]
> Replace `{YOUR.EVENTHUBS.CONNECTION.STRING}` with the connection string for your Event Hubs namespace. For instructions on getting the connection string, see [Get an Event Hubs connection string](event-hubs-get-connection-string.md). Here's an example configuration: `sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="Endpoint=sb://mynamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXX";`


### Run Kafka Connect
In this step, a Kafka Connect worker is started locally in distributed mode, using Event Hubs to maintain cluster state.

1. Save the above `connect-distributed.properties` file locally.  Be sure to replace all values in braces.
2. Navigate to the location of the Kafka release on your machine.
3. Run `./bin/connect-distributed.sh /PATH/TO/connect-distributed.properties` and wait for the cluster to start.

> [!NOTE]
> Kafka Connect uses the Kafka AdminClient API to automatically create topics with recommended configurations, including compaction. A quick check of the namespace in the Azure portal reveals that the Connect worker's internal topics have been created automatically.
>
> Kafka Connect internal topics **must use compaction**.  The Event Hubs team is not responsible for fixing improper configurations if internal Connect topics are incorrectly configured.

### Configure and start the Debezium PostgreSQL source connector

Create a configuration file (`pg-source-connector.json`) for the PostgreSQL source connector - replace the values as per your Azure PostgreSQL instance.

```json
{
    "name": "todo-connector",
    "config": {
        "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
        "database.hostname": "<replace with Azure PostgreSQL instance name>.postgres.database.azure.com",
        "database.port": "5432",
        "database.user": "<replace with database user name>",
        "database.password": "<replace with database password>",
        "database.dbname": "postgres",
        "database.server.name": "my-server",
        "plugin.name": "wal2json",
        "table.whitelist": "public.todos"
    }
}
```

> [!TIP]
> `database.server.name` attribute is a logical name that identifies and provides a namespace for the particular PostgreSQL database server/cluster being monitored.. For detailed info, check [Debezium documentation](https://debezium.io/documentation/reference/1.2/connectors/postgresql.html#postgresql-property-database-server-name)

To create an instance of the connector, use the Kafka Connect REST API endpoint:

```bash
curl -X POST -H "Content-Type: application/json" --data @pg-source-connector.json http://localhost:8083/connectors
```

To check the status of the connector:

```bash
curl -s http://localhost:8083/connectors/todo-connector/status
```

## Test change data capture
To see change data capture in action, you'll need to create/update/delete records in the Azure PostgreSQL database.

Start by connecting to your Azure PostgreSQL database (the example below uses [psql](https://www.postgresql.org/docs/12/app-psql.html))

```bash
psql -h <POSTGRES_INSTANCE_NAME>.postgres.database.azure.com -p 5432 -U <POSTGRES_USER_NAME> -W -d <POSTGRES_DB_NAME> --set=sslmode=require

e.g. 

psql -h my-postgres.postgres.database.azure.com -p 5432 -U testuser@my-postgres -W -d postgres --set=sslmode=require
```

**Create a table and insert records**

```sql
CREATE TABLE todos (id SERIAL, description VARCHAR(50), todo_status VARCHAR(12), PRIMARY KEY(id));

INSERT INTO todos (description, todo_status) VALUES ('setup postgresql on azure', 'complete');
INSERT INTO todos (description, todo_status) VALUES ('setup kafka connect', 'complete');
INSERT INTO todos (description, todo_status) VALUES ('configure and install connector', 'in-progress');
INSERT INTO todos (description, todo_status) VALUES ('start connector', 'pending');
```

The connector should now spring into action and send change data events to an Event Hubs topic with the following name `my-server.public.todos`, assuming you have `my-server` as the value for `database.server.name` and `public.todos` is the table whose changes you're tracking (as per `table.whitelist` configuration)

**Check Event Hubs topic**

Let's introspect the contents of the topic to make sure everything is working as expected. The below example uses [`kafkacat`](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/kafkacat), but you can also [create a consumer using any of the options listed here](apache-kafka-developer-guide.md)

Create a file named `kafkacat.conf` with the following contents:

```
metadata.broker.list=<enter event hubs namespace>.servicebus.windows.net:9093
security.protocol=SASL_SSL
sasl.mechanisms=PLAIN
sasl.username=$ConnectionString
sasl.password=<enter event hubs connection string>
```

> [!NOTE]
> Update `metadata.broker.list` and `sasl.password` attributes in `kafkacat.conf` as per Event Hubs information. 

In a different terminal, start a consumer:

```bash
export KAFKACAT_CONFIG=kafkacat.conf
export BROKER=<enter event hubs namespace>.servicebus.windows.net:9093
export TOPIC=my-server.public.todos

kafkacat -b $BROKER -t $TOPIC -o beginning
```

You should see the JSON payloads representing the change data events generated in PostgreSQL in response to the rows you had added to the `todos` table. Here's a snippet of the payload:


```json
{
    "schema": {...},
    "payload": {
        "before": null,
        "after": {
            "id": 1,
            "description": "setup postgresql on azure",
            "todo_status": "complete"
        },
        "source": {
            "version": "1.2.0.Final",
            "connector": "postgresql",
            "name": "fullfillment",
            "ts_ms": 1593018069944,
            "snapshot": "last",
            "db": "postgres",
            "schema": "public",
            "table": "todos",
            "txId": 602,
            "lsn": 184579736,
            "xmin": null
        },
        "op": "c",
        "ts_ms": 1593018069947,
        "transaction": null
    }
```

The event consists of the `payload` along with its `schema` (omitted for brevity). In `payload` section, notice how the create operation (`"op": "c"`) is represented - `"before": null` means that it was a newly `INSERT`ed row, `after` provides values for the columns in the row, `source` provides the PostgreSQL instance metadata from where this event was picked up and so on.

You can try the same with update or delete operations as well and introspect the change data events. For example, to update the task status for `configure and install connector` (assuming its `id` is `3`):

```sql
UPDATE todos SET todo_status = 'complete' WHERE id = 3;
```

## (Optional) Install FileStreamSink connector
Now that all the `todos` table changes are being captured in Event Hubs topic, you'll use the FileStreamSink connector (that is available by default in Kafka Connect) to consume these events.

Create a configuration file (`file-sink-connector.json`) for the connector - replace the `file` attribute as per your file system

```json
{
    "name": "cdc-file-sink",
    "config": {
        "connector.class": "org.apache.kafka.connect.file.FileStreamSinkConnector",
        "tasks.max": "1",
        "topics": "my-server.public.todos",
        "file": "<enter full path to file e.g. /Users/foo/todos-cdc.txt>"
    }
}
```

To create the connector and check its status:

```bash
curl -X POST -H "Content-Type: application/json" --data @file-sink-connector.json http://localhost:8083/connectors

curl http://localhost:8083/connectors/cdc-file-sink/status
```

Insert/update/delete database records and monitor the records in the configured output sink file:

```bash
tail -f /Users/foo/todos-cdc.txt
```


## Cleanup
Kafka Connect creates Event Hub topics to store configurations, offsets, and status that persist even after the Connect cluster has been taken down. Unless this persistence is desired, it's recommended that these topics are deleted. You may also want to delete the `my-server.public.todos` Event Hub that were created during this walk through.

## Next steps

To learn more about Event Hubs for Kafka, see the following articles:  

- [Mirror a Kafka broker in an event hub](event-hubs-kafka-mirror-maker-tutorial.md)
- [Connect Apache Spark to an event hub](event-hubs-kafka-spark-tutorial.md)
- [Connect Apache Flink to an event hub](event-hubs-kafka-flink-tutorial.md)
- [Explore samples on our GitHub](https://github.com/Azure/azure-event-hubs-for-kafka)
- [Connect Akka Streams to an event hub](event-hubs-kafka-akka-streams-tutorial.md)
- [Apache Kafka developer guide for Azure Event Hubs](apache-kafka-developer-guide.md)
