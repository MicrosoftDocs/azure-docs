---
title: Integrate Apache Kafka Connect with Azure Event Hubs | Microsoft Docs
description: Use Apache Spark with Azure Event Hubs for Kafka.
services: event-hubs
documentationcenter: .net
author: basilhariri
manager: timlt
ms.service: event-hubs
ms.topic: tutorial
ms.custom:
ms.date: 11/03/2018
ms.author: bahariri

---

# Integrate Apache Kafka Connect support on Azure Event Hubs
[Kafka Connect](https://kafka.apache.org/documentation/#connect) is a platform that provides easy integration of Apache Kafka and other services into secure and scalable pipelines. Workers can be deployed in a standalone mode (single processes) or a distributed mode (nodes in a cluster of Connect workers).  Source and sink connectors are used to define movement of data in and out of the Kafka cluster respectively. For more information, see [Kafka Connect concepts](https://docs.confluent.io/current/connect/concepts.html).

This tutorial walks you through integrating Kafka Connect with Azure Event Hubs and deploying basic FileStreamSource and FileStreamSink connectors.  While these connectors are not meant for production use, they demonstrate an end-to-end Kafka Connect scenario where Azure Event Hubs acts as a Kafka broker.

In this tutorial, you take the following steps:

> [!div class="checklist"]
> * Create an Event Hubs namespace
> * Configure Kafka Connect for Event Hubs
> * Configure Kafka Connect for Event Hubs
> * Run Kafka Connect
> * Create connectors

## Prerequisites
To complete this walkthrough, make sure you have the following prerequisites:

- Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- Linux/MacOS
- Kafka release (version 1.1.1, Scala version 2.11), available from [kafka.apache.org](https://kafka.apache.org/downloads#1.1.1)
- Read through the [Event Hubs for Apache Kafka](https://docs.microsoft.com/azure/event-hubs/event-hubs-for-kafka-ecosystem-overview) introduction article

## Create an Event Hubs namespace
An Event Hubs namespace is required to send and receive from any Event Hubs service. See [Creating a Kafka enabled Event Hub](event-hubs-create.md) for instructions on getting an Event Hubs Kafka endpoint. Get the Event Hubs connection string and fully qualified domain name (FQDN) for later use. For instructions, see [Get an Event Hubs connection string](event-hubs-get-connection-string.md). 

## Configure Kafka Connect for Event Hubs
Minimal reconfiguration is necessary when redirecting Kafka Connect throughput from Kafka to Event Hubs.  The following `connect-distributed.properties` sample illustrates how to configure Connect to authenticate and communicate with the Kafka endpoint on Event Hubs:

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

## Run Kafka Connect

In this step, a Kafka Connect worker is started locally in distributed mode, using Event Hubs to maintain cluster state.

1. Save the above `connect-distributed.properties` file locally.  Be sure to replace all values in braces.
2. Navigate to the location of the Kafka release on your machine.
4. Run `./bin/connect-distributed.sh /PATH/TO/connect-distributed.properties`.  The Connect worker REST API is ready for interaction when you see `'INFO Finished starting connectors and tasks'`. 

> [!NOTE]
> Event Hubs supports Kafka clients creating topics automatically. A quick check of the namespace in the Azure portal reveals that the Connect worker's internal topics have been created automatically.

### Create connectors
This section walks you through spinning up FileStreamSource and FileStreamSink connectors. 

1. Create a directory for input and output data files.
    ```bash
    mkdir ~/connect-quickstart
    ```

2. Create two files: one file with seed data from which the FileStreamSource connector reads, and another to which our FileStreamSink connector writes.
    ```bash
    seq 1000 > ~/connect-quickstart/input.txt
    touch ~/connect-quickstart/output.txt
    ```

3. Create a FileStreamSource connector.  Be sure to replace the curly braces with your home directory path.
    ```bash
    curl -s -X POST -H "Content-Type: application/json" --data '{"name": "file-source","config": {"connector.class":"org.apache.kafka.connect.file.FileStreamSourceConnector","tasks.max":"1","topic":"connect-quickstart","file": "{YOUR/HOME/PATH}/connect-quickstart/input.txt"}}' http://localhost:8083/connectors
    ```
    You should see the Event Hub `connect-quickstart` on your Event Hubs instance after running the above command.
4. Check status of source connector.
    ```bash
    curl -s http://localhost:8083/connectors/file-source/status
    ```
    Optionally, you can use [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/releases) to verify that events have arrived in the `connect-quickstart` topic.

5. Create a FileStreamSink Connector.  Again, make sure you replace the curly braces with your home directory path.
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
Kafka Connect creates Event Hub topics to store configurations, offsets, and status that persist even after the Connect cluster has been taken down. Unless this persistence is desired, it is recommended that these topics are deleted. You may also want to delete the `connect-quickstart` Event Hub that were created during the course of this walkthrough.

## Next steps

To learn more about Event Hubs and Event Hubs for Kafka, see the following topic:  

* [Learn about Event Hubs](event-hubs-what-is-event-hubs.md)
* [Learn about Event Hubs for Kafka](event-hubs-for-kafka-ecosystem-overview.md)
* [Explore more samples on the Event Hubs for Kafka GitHub](https://github.com/Azure/azure-event-hubs-for-kafka)
* Learn how to stream into Kafka enabled Event Hubs using [native Kafka applications](event-hubs-quickstart-kafka-enabled-event-hubs.md), [Apache Flink](event-hubs-kafka-flink-tutorial.md), or [Akka Streams](event-hubs-kafka-akka-streams-tutorial.md)