---
title: Troubleshoot issues with Azure Event Hubs for Apache Kafka
description: This article shows how to troubleshoot issues with Azure Event Hubs for Apache Kafka
ms.topic: article
ms.date: 06/23/2020
---

# Apache Kafka troubleshooting guide for Event Hubs
This article provides troubleshooting tips for issues that you may run into when using Event Hubs for Apache Kafka. 

## Server Busy exception
You may receive Server Busy exception due to Kafka throttling. With AMQP clients, Event Hubs immediately returns a **Server Busy** exception upon service throttling. It's equivalent to a "try again later" message. In Kafka, messages are delayed before being completed. The delay length is returned in milliseconds as `throttle_time_ms` in the produce/fetch response. In most cases, these delayed requests aren't logged as ServerBusy exceptions on Event Hubs dashboards. Instead, the response's `throttle_time_ms` value should be used as an indicator that throughput has exceeded the provisioned quota.

If the traffic is excessive, the service has the following behavior:

- If produce request's delay exceeds request timeout, Event Hubs returns **Policy Violation** error code.
- If fetch request's delay exceeds request timeout, Event Hubs logs the request as throttled and responds with empty set of records and no error code.

[Dedicated clusters](event-hubs-dedicated-overview.md) don't have throttling mechanisms. You're free to consume all of your cluster resources.

## No records received
You may see consumers not getting any records and constantly rebalancing. In this scenario, consumers don't get any records and constantly rebalance. There's no exception or error when it happens, but the Kafka logs will show that the consumers are stuck trying to rejoin the group and assign partitions. There are a few possible causes:

- Make sure that your `request.timeout.ms` is at least the recommended value of 60000 and your `session.timeout.ms` is at least the recommended value of 30000. Having these settings too low could cause consumer timeouts, which then cause rebalances (which then cause more timeouts, which cause more rebalancing, and so on) 
- If your configuration matches those recommended values, and you're still seeing constant rebalancing, feel free to open up an issue (make sure to include your entire configuration in the issue so that we can help debug)!

## Compression/Message format version issue
Kafka supports compression, and Event Hubs for Kafka currently doesn't. Errors that mention a message-format version (for example, `The message format version on the broker does not support the request.`) are caused when a client tries to send compressed Kafka messages to our brokers.

If compressed data is necessary, compressing your data before sending it to the brokers and decompressing after receiving is a valid workaround. The message body is just a byte array to the service, so client-side compression/decompression won't cause any issues.

## UnknownServerException
You may receive an UnknownServerException from Kafka client libraries similar to the following example: 

```
org.apache.kafka.common.errors.UnknownServerException: The server experienced an unexpected error when processing the request
```

Open a ticket with Microsoft support.  Debug-level logging and exception timestamps in UTC are helpful in debugging the issue. 

## Other issues
Check the following items if you see issues when using Kafka on Event Hubs.

- **Firewall blocking traffic** - Make sure that port **9093** isn't blocked by your firewall.
- **TopicAuthorizationException** - The most common causes of this exception are:
    - A typo in the connection string in your configuration file, or
    - Trying to use Event Hubs for Kafka on a Basic tier namespace. Event Hubs for Kafka is [only supported for Standard and Dedicated tier namespaces](https://azure.microsoft.com/pricing/details/event-hubs/).
- **Kafka version mismatch** - Event Hubs for Kafka Ecosystems supports Kafka versions 1.0 and later. Some applications using Kafka version 0.10 and later could occasionally work because of the Kafka protocol's backwards compatibility, but we strongly recommend against using old API versions. Kafka versions 0.9 and earlier don't support the required SASL protocols and can't connect to Event Hubs.
- **Strange encodings on AMQP headers when consuming with Kafka** - when sending events to an event hub over AMQP, any AMQP payload headers are serialized in AMQP encoding. Kafka consumers don't deserialize the headers from AMQP. To read header values, manually decode the AMQP headers. Alternatively, you can avoid using AMQP headers if you know that you'll be consuming via Kafka protocol. For more information, see [this GitHub issue](https://github.com/Azure/azure-event-hubs-for-kafka/issues/56).
- **SASL authentication** - Getting your framework to cooperate with the SASL authentication protocol required by Event Hubs can be more difficult than meets the eye. See if you can troubleshoot the configuration using your framework's resources on SASL authentication. 

## Limits
Apache Kafka vs. Event Hubs Kafka. For the most part, the Event Hubs for Kafka Ecosystems has the same defaults, properties, error codes, and general behavior that Apache Kafka does. The instances where these two explicitly differ (or where Event Hubs imposes a limit that Kafka doesn't) are listed below:

- The max length of the `group.id` property is 256 characters
- The max size of `offset.metadata.max.bytes` is 1024 bytes
- Offset commits are throttled at 4 calls/second per partition with a max internal log size of 1 MB


## Next steps
To learn more about Event Hubs and Event Hubs for Kafka, see the following articles:  

- [Apache Kafka developer guide for Event Hubs](apache-kafka-developer-guide.md)
- [Apache Kafka migration guide for Event Hubs](apache-kafka-migration-guide.md)
- [Frequently asked questions - Event Hubs for Apache Kafka](apache-kafka-frequently-asked-questions.md)
- [Recommended configurations](https://github.com/Azure/azure-event-hubs-for-kafka/blob/master/CONFIGURATION.md)
