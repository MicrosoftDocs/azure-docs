---
title: Integrate with Apache Kafka Connect
description: This article provides a walkthrough that shows you how to use Kafka Connect with Azure Event Hubs for Kafka.
ms.topic: how-to
ms.date: 07/31/2024
# customer intent: As a developer, I want to know how to use Apache Kafka Connect with Azure Event Hubs for Kafka. 
---

# Integrate Apache Kafka Connect support on Azure Event Hubs
[Apache Kafka Connect](https://kafka.apache.org/documentation/#connect) is a framework to connect and import/export data from/to any external system such as MySQL, HDFS, and file system through a Kafka cluster. This article walks you through using Kafka Connect framework with Event Hubs.

This article walks you through integrating Kafka Connect with an event hub and deploying basic `FileStreamSource` and `FileStreamSink` connectors. While these connectors aren't meant for production use, they demonstrate an end-to-end Kafka Connect scenario where Azure Event Hubs acts as a Kafka broker.

> [!NOTE]
> This sample is available on [GitHub](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/connect).

## Prerequisites
To complete this walkthrough, make sure you have the following prerequisites:

- Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- [Git](https://www.git-scm.com/downloads)
- Linux/macOS
- Latest Kafka release available from [kafka.apache.org](https://kafka.apache.org/downloads)
- Read through the [Event Hubs for Apache Kafka](./azure-event-hubs-apache-kafka-overview.md) introduction article

## Create an Event Hubs namespace
An Event Hubs namespace is required to send and receive from any Event Hubs service. See [Creating an event hub](event-hubs-create.md) for instructions to create a namespace and an event hub. Get the Event Hubs connection string and fully qualified domain name (FQDN) for later use. For instructions, see [Get an Event Hubs connection string](event-hubs-get-connection-string.md). 

## Clone the example project
Clone the Azure Event Hubs repository and navigate to the tutorials/connect subfolder: 

```bash
git clone https://github.com/Azure/azure-event-hubs-for-kafka.git
cd azure-event-hubs-for-kafka/tutorials/connect
```

## Configure Kafka Connect for Event Hubs
Minimal reconfiguration is necessary when redirecting Kafka Connect throughput from Kafka to Event Hubs. The following `connect-distributed.properties` sample illustrates how to configure Connect to authenticate and communicate with the Kafka endpoint on Event Hubs:

```properties
# e.g. namespace.servicebus.windows.net:9093
bootstrap.servers={YOUR.EVENTHUBS.FQDN}:9093
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

# path to the libs directory within the Kafka release
plugin.path={KAFKA.DIRECTORY}/libs 
```

> [!IMPORTANT]
> Replace `{YOUR.EVENTHUBS.CONNECTION.STRING}` with the connection string for your Event Hubs namespace. For instructions on getting the connection string, see [Get an Event Hubs connection string](event-hubs-get-connection-string.md). Here's an example configuration: `sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="Endpoint=sb://mynamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXX";`


## Run Kafka Connect

In this step, a Kafka Connect worker is started locally in distributed mode, using Event Hubs to maintain cluster state.

1. Save the `connect-distributed.properties` file locally. Be sure to replace all values in braces.
2. Navigate to the location of the Kafka release on your machine.
4. Run `./bin/connect-distributed.sh /PATH/TO/connect-distributed.properties`. The Connect worker REST API is ready for interaction when you see `'INFO Finished starting connectors and tasks'`. 

> [!NOTE]
> Kafka Connect uses the Kafka AdminClient API to automatically create topics with recommended configurations, including compaction. A quick check of the namespace in the Azure portal reveals that the Connect worker's internal topics have been created automatically.
>
>Kafka Connect internal topics **must use compaction**.  The Event Hubs team is not responsible for fixing improper configurations if internal Connect topics are incorrectly configured.

### Create connectors
This section walks you through spinning up `FileStreamSource` and `FileStreamSink` connectors. 

1. Create a directory for input and output data files.
    ```bash
    mkdir ~/connect-quickstart
    ```

2. Create two files: one file with seed data from which the `FileStreamSource` connector reads, and another to which our `FileStreamSink` connector writes.
    ```bash
    seq 1000 > ~/connect-quickstart/input.txt
    touch ~/connect-quickstart/output.txt
    ```

3. Create a `FileStreamSource` connector. Be sure to replace the curly braces with your home directory path.
    ```bash
    curl -s -X POST -H "Content-Type: application/json" --data '{"name": "file-source","config": {"connector.class":"org.apache.kafka.connect.file.FileStreamSourceConnector","tasks.max":"1","topic":"connect-quickstart","file": "{YOUR/HOME/PATH}/connect-quickstart/input.txt"}}' http://localhost:8083/connectors
    ```
    You should see the event hub `connect-quickstart` on your Event Hubs instance after running the command.
4. Check status of source connector.
    ```bash
    curl -s http://localhost:8083/connectors/file-source/status
    ```
    Optionally, you can use [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/releases) to verify that events arrived in the `connect-quickstart` topic.

5. Create a FileStreamSink Connector. Again, make sure you replace the curly braces with your home directory path.
    ```bash
    curl -X POST -H "Content-Type: application/json" --data '{"name": "file-sink", "config": {"connector.class":"org.apache.kafka.connect.file.FileStreamSinkConnector", "tasks.max":"1", "topics":"connect-quickstart", "file": "{YOUR/HOME/PATH}/connect-quickstart/output.txt"}}' http://localhost:8083/connectors
    ```
 
6. Check the status of sink connector.
    ```bash
    curl -s http://localhost:8083/connectors/file-sink/status
    ```

7. Verify that data has been replicated between files and that the data is identical across both files.
    ```bash
    # read the file
    cat ~/connect-quickstart/output.txt
    # diff the input and output files
    diff ~/connect-quickstart/input.txt ~/connect-quickstart/output.txt
    ```

### Cleanup
Kafka Connect creates Event Hubs topics to store configurations, offsets, and status that persist even after the Connect cluster has been taken down. Unless this persistence is desired, we recommend that you delete these topics. You might also want to delete the `connect-quickstart` Event Hubs that were created during this walkthrough.

## Related content

To learn more about Event Hubs for Kafka, see the following articles:  

- [Apache Kafka developer guide for Azure Event Hubs](apache-kafka-developer-guide.md)
- [Explore samples on our GitHub](https://github.com/Azure/azure-event-hubs-for-kafka)


