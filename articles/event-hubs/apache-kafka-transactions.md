---
title: Transactions for Apache Kafka in Event Hubs on Azure Cloud
description: Learn about the transactional API in Apache Kafka and how to use that in Apache Kafka applications with Event Hubs service on Azure Cloud.
ms.topic: overview
ms.date: 04/29/2024
---

# Transactions in Apache Kafka for Azure Event Hubs

This article provides detail on how to use the [Apache Kafka](https://kafka.apache.org/) transactional API with Azure Event Hubs.

## Overview
Event Hubs provides a Kafka endpoint that can be used by your existing Kafka client applications as an alternative to running your own Kafka cluster. Event Hubs works with many of your existing Kafka applications. For more information, see [Event Hubs for Apache Kafka](azure-event-hubs-kafka-overview.md).

This document focuses on how to use Kafka’s transactional API with Azure Event Hubs seamlessly.

## Transactions in Apache Kafka
In cloud native environments, applications must be made resilient to network disruptions and namespace restarts and upgrades. Applications requiring strict processing guarantees must utilize a transactional framework or API to ensure that either all of the operations are executed, or none are so that the application and data state is reliably managed. If the set of operations fail, they can be reliably tried again atomically to ensure the right processing guarantees.

> [!NOTE]
> Transactional guarantees are typically required when there are multiple operations that need to be processed in an "all or nothing" fashion.
> 
> For all other operations, client applications are **resilient by default** to retry the operation with an exponential backoff, if the specific operation failed.


Apache Kafka provides a transactional API to ensure this level of processing guarantees across the same or different set of topic/partitions.

Transactions apply to the below cases –
1.	Transactional producers.
2.	Exactly once processing semantics.
3.	Read-Process-Write operations.


### Transactional Producers

Transactional producers ensure that data is written atomically to multiple partitions across different topics. Producers can initiate a transaction, write to multiple partitions on the same topic or across different topics, and then commit or abort the transaction.

To ensure that a producer is transactional, the below properties must be set –

```java
    producerProps.put("enable.idempotence", "true");
    producerProps.put("transactional.id", "transactional-producer-1");
    KafkaProducer<String, String> producer = new KafkaProducer(producerProps);
```

Once the producer is initialized, the below call ensures that the producer registers with the broker as a transactional producer -

```java
    producer.initTransactions();
```

The producer must then begin a transaction explicitly, perform send operations across different topics and partitions as normal, and then commit the transaction with the below call –

```java
    producer.beginTransaction();
	/*
        Send to multiple topic partitions.
    */
    producer.commitTransaction();
```

In the event that the transaction needs to be aborted due to a fault or a timeout, then the producer can call the `abortTransaction()` method.

```java
	producer.abortTransaction();
```


### Read-Process-Write

The read-process-write loop builds on the transactional producers discussed above by adding consumers in the transactional scope of the producers, so that each record is read, processed and written in an atomic fashion.
The consumer must be configured to read only non-transactional messages, or committed transactional messages by setting the below property –

```java
	consumerProps.put(“isolation.level”, “read_committed”);
	KafkaConsumer <K,V> consumer = new KafkaConsumer<>(consumerProps);
```

Once the consumer is instantiated, it can be subscribe to the topic from where the records must be read –
```java
    consumer.subscribe(“inputTopic”);
```

After this, the read-process-write loop can be executed as shown below.

```java
	while (true) {
		ConsumerRecords records = consumer.poll(Long.Max_VALUE);
		producer.beginTransaction();
		for (ConsumerRecord record : records) {
			// process record
    // Write to output topic
	producer.send(producerRecord(“outputTopic”, record));
		}
		producer.sendOffsetsToTransaction(currentOffsets(consumer), group);
		producer.commitTransaction();
	}
```

### Exactly once semantics

Exactly once semantics, as the name suggests, ensures that data is processed in an idempotent and atomic fashion. These guarantees are provided in the context of Kafka Streams only, by setting the below setting in the stream properties.

```xml
	processing.guarantee=exactly_once
```

We will cover this in [Kafka streams](apache-kafka-streams.md).


## Migration Guide
If you have existing Kafka applications that you’d like to use with Azure Event Hubs, please review the [Kafka migration guide for Azure Event Hubs](apache-kafka-migration-guide.md) to hit the ground running quickly.

## Next steps
To learn more about Event Hubs and Event Hubs for Kafka, see the following articles:  

- [Apache Kafka troubleshooting guide for Event Hubs](apache-kafka-troubleshooting-guide.md)
- [Frequently asked questions - Event Hubs for Apache Kafka](apache-kafka-frequently-asked-questions.yml)
- [Apache Kafka developer guide for Azure Event Hubs](apache-kafka-developer-guide.md)
- [Recommended configurations](apache-kafka-configurations.md)