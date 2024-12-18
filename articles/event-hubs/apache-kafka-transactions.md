---
title: Transactions for Apache Kafka in Event Hubs on Azure Cloud
description: Learn about the transactional API in Apache Kafka and how to use that in Apache Kafka applications with Event Hubs service on Azure Cloud.
ms.topic: overview
ms.date: 04/29/2024
---

# Transactions in Apache Kafka for Azure Event Hubs

This article provides detail on how to use the [Apache Kafka](https://kafka.apache.org/) transactional API with Azure Event Hubs.

## Overview
Event Hubs provides a Kafka endpoint that can be used by your existing Kafka client applications as an alternative to running your own Kafka cluster. Event Hubs works with many of your existing Kafka applications. For more information, see [Event Hubs for Apache Kafka](azure-event-hubs-apache-kafka-overview.md).

This document focuses on how to use Kafka’s transactional API with Azure Event Hubs seamlessly.

> [!NOTE]
> Kafka Transactions is currently in Public preview in Premium, and Dedicated tier.
>

## Transactions in Apache Kafka
In cloud native environments, applications must be made resilient to network disruptions and namespace restarts and upgrades. Applications requiring strict processing guarantees must utilize a transactional framework or API to ensure that either all of the operations are executed, or none are so that the application and data state is reliably managed. If the set of operations fail, they can be reliably tried again atomically to ensure the right processing guarantees.

> [!NOTE]
> Transactional guarantees are typically required when there are multiple operations that need to be processed in an "all or nothing" fashion.
> 
> For all other operations, client applications are **resilient by default** to retry the operation with an exponential backoff, if the specific operation failed.


Apache Kafka provides a transactional API to ensure this level of processing guarantees across the same or different set of topic/partitions.

Transactions apply to the below cases: 

  * Transactional producers.
  * Exactly once processing semantics.

### Transactional Producers

Transactional producers ensure that data is written atomically to multiple partitions across different topics. Producers can initiate a transaction, write to multiple partitions on the same topic or across different topics, and then commit or abort the transaction.

To ensure that a producer is transactional, `enable.idempotence` should be set to true to ensure that the data is written exactly once, thus avoiding duplicates on the *send* side. Additionally, `transaction.id` should be set to uniquely identify the producer.

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

If the transaction needs to be aborted due to a fault or a timeout, then the producer can call the `abortTransaction()` method.

```java
	producer.abortTransaction();
```


### Exactly once semantics

Exactly once semantics builds on the transactional producers by adding consumers in the transactional scope of the producers, so that each record is guaranteed to be read, processed, and written **exactly once**.

First the transactional producer is instantiated - 

```java

    producerProps.put("enable.idempotence", "true");
    producerProps.put("transactional.id", "transactional-producer-1");
    KafkaProducer<K, V> producer = new KafkaProducer(producerProps);

    producer.initTransactions();

```

Then, the consumer must be configured to read only nontransactional messages, or committed transactional messages by setting the below property –

```java

	consumerProps.put("isolation.level", "read_committed");
	KafkaConsumer <K,V> consumer = new KafkaConsumer<>(consumerProps);

```

Once the consumer is instantiated, it can subscribe to the topic from where the records must be read –

```java

    consumer.subscribe(singleton("inputTopic"));

```

After the consumer polls the records from the input topic, the producer begins the transactional scope within which the record is processed and written to the output topic. Once the records are written, the updated map of offsets for all partitions is created. The producer then sends this updated offset map to the transaction before committing the transaction.

In any exception, the transaction is aborted and the producer retries the processing once again atomically.

```java
	while (true) {
		ConsumerRecords records = consumer.poll(Long.Max_VALUE);
		producer.beginTransaction();
        try {
    		for (ConsumerRecord record : records) {
    			/*
                    Process record as appropriate
                */
                // Write to output topic
    	        producer.send(producerRecord(“outputTopic”, record));
    		}
    
            /*
                Generate the offset map to be committed.
            */
            Map <TopicPartition, OffsetAndMetadata> offsetsToCommit = new Hashap<>();
            for (TopicPartition partition : records.partitions()) {
                // Calculate the offset to commit and populate the map.
                offsetsToCommit.put(partition, new OffsetAndMetadata(calculated_offset))
            }
            
            // send offsets to transaction and then commit the transaction.
    		producer.sendOffsetsToTransaction(offsetsToCommit, group);
    		producer.commitTransaction();
        } catch (Exception e)
        {
            producer.abortTransaction();
        }
	}
```

> [!WARNING]
>If the transaction is neither committed or aborted before the `max.transaction.timeout.ms`, the transaction will be aborted by Event Hubs automatically. The default `max.transaction.timeout.ms` is set to **15 minutes** by Event Hubs, but the producer can override it to a lower value by setting the `transaction.timeout.ms` property in the producer configuration properties.

## Migration Guide

If you have existing Kafka applications that you’d like to use with Azure Event Hubs, please review the [Kafka migration guide for Azure Event Hubs](apache-kafka-migration-guide.md) to hit the ground running quickly.

## Next steps

To learn more about Event Hubs and Event Hubs for Kafka, see the following articles:  

- [Apache Kafka troubleshooting guide for Event Hubs](apache-kafka-troubleshooting-guide.md)
- [Frequently asked questions - Event Hubs for Apache Kafka](apache-kafka-frequently-asked-questions.yml)
- [Apache Kafka developer guide for Azure Event Hubs](apache-kafka-developer-guide.md)
- [Recommended configurations](apache-kafka-configurations.md)