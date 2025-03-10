---
title: Troubleshoot issues with Azure Event Hubs for Apache Kafka
description: This article shows how to troubleshoot issues with Azure Event Hubs for Apache Kafka
ms.topic: article
ms.subservice: kafka
ms.date: 03/06/2025
---

# Apache Kafka troubleshooting guide for Event Hubs
This article provides troubleshooting tips for issues that you might run into when using Event Hubs for Apache Kafka. 

## Server Busy exception
You might receive Server Busy exception because of Kafka throttling. With AMQP clients, Event Hubs immediately returns a **server busy** exception upon service throttling. It's equivalent to a "try again later" message. In Kafka, messages are delayed before being completed. The delay length is returned in milliseconds as `throttle_time_ms` in the produce/fetch response. In most cases, these delayed requests aren't logged as server busy exceptions on Event Hubs dashboards. Instead, the response's `throttle_time_ms` value should be used as an indicator that throughput has exceeded the provisioned quota.

If the traffic is excessive, the service has the following behavior:

- If produce request's delay exceeds request time-out(*request.timeout.ms*), Event Hubs returns **Policy Violation** error code.
- If fetch request's delay exceeds request time out, Event Hubs logs the request as throttled and responds with empty set of records and no error code.

[Dedicated clusters](event-hubs-dedicated-overview.md) don't have throttling mechanisms. You're free to consume all of your cluster resources.

## No records received
You might see consumers not getting any records and constantly rebalancing. In this scenario, consumers don't get any records and constantly rebalance. There's no exception or error when it happens, but the Kafka logs will show that the consumers are stuck trying to rejoin the group and assign partitions. There are a few possible causes:

- Make sure that your `request.timeout.ms` is at least the recommended value of 60000 and your `session.timeout.ms` is at least the recommended value of 30000. Having these settings too low could cause consumer time-outs, which then cause rebalances (which then cause more time-outs, which cause more rebalancing, and so on) 
- If your configuration matches those recommended values, and you're still seeing constant rebalancing, feel free to open up an issue (make sure to include your entire configuration in the issue so that we can help debug).

## Compression/Message format version issue
Event Hubs for Kafka currently support only `gzip` compression algorithm. If any other algorithm is used, client applications see a message-format version  error (for example, `The message format version on the broker does not support the request.`).

If an unsupported compression algorithm needs to be used, compressing your data with that specific algorithm before sending it to the brokers and decompressing after receiving is a valid workaround. The message body is just a byte array to the service, so client-side compression/decompression won't cause any issues.

## UnknownServerException
You might receive an UnknownServerException from Kafka client libraries similar to the following example: 

```
org.apache.kafka.common.errors.UnknownServerException: The server experienced an unexpected error when processing the request
```

Open a ticket with Microsoft support. Debug-level logging and exception timestamps in UTC are helpful in debugging the issue. 

## Other issues
Check the following items if you see issues when using Kafka on Event Hubs.

- **Firewall blocking traffic** - Make sure that port **9093** isn't blocked by your firewall.
- **TopicAuthorizationException** - The most common causes of this exception are:
    - A typo in the connection string in your configuration file, or
    - Trying to use Event Hubs for Kafka on a Basic tier namespace. The Event Hubs for Kafka feature isn't supported in the basic tier.
- **Kafka version mismatch** - Event Hubs for Kafka Ecosystems supports Kafka versions 1.0 and later. Some applications using Kafka version 0.10 and later could occasionally work because of the Kafka protocol's backwards compatibility, but we strongly recommend against using old API versions. Kafka versions 0.9 and earlier don't support the required SASL protocols and can't connect to Event Hubs.
- **Strange encodings on AMQP headers when consuming with Kafka** - when sending events to an event hub over AMQP, any AMQP payload headers are serialized in AMQP encoding. Kafka consumers don't deserialize the headers from AMQP. To read header values, manually decode the AMQP headers. Alternatively, you can avoid using AMQP headers if you know that you are consuming via Kafka protocol. For more information, see [this GitHub issue](https://github.com/Azure/azure-event-hubs-for-kafka/issues/56).
- **SASL authentication** - Getting your framework to cooperate with the SASL authentication protocol required by Event Hubs can be more difficult than meets the eye. See if you can troubleshoot the configuration using your framework's resources on SASL authentication. 

## Limits
Apache Kafka vs. Event Hubs Kafka. For the most part, Azure Event Hubs' Kafka interface has the same defaults, properties, error codes, and general behavior that Apache Kafka does. The instances that these two explicitly differ (or where Event Hubs imposes a limit that Kafka doesn't) are listed here:

- The max length of the `group.id` property is 256 characters
- The max size of `offset.metadata.max.bytes` is 1,024 bytes
- Offset commits are throttled to 4 calls/second per partition with a maximum internal log size of 1 MB


## Next steps
To learn more about Event Hubs and Event Hubs for Kafka, see the following articles:  

- [Apache Kafka developer guide for Event Hubs](apache-kafka-developer-guide.md)
- [Apache Kafka migration guide for Event Hubs](apache-kafka-migration-guide.md)
- [Frequently asked questions - Event Hubs for Apache Kafka](apache-kafka-frequently-asked-questions.yml)
- [Recommended configurations](apache-kafka-configurations.md)
