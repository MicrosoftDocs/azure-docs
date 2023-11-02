---
title: Recommended configurations for Apache Kafka clients - Azure Event Hubs
description: This article provides recommended Apache Kafka configurations for clients interacting with Azure Event Hubs for Apache Kafka. 
ms.topic: reference
ms.custom: devx-track-extended-java
ms.date: 03/30/2022
---

# Recommended configurations for Apache Kafka clients
Here are the recommended configurations for using Azure Event Hubs from Apache Kafka client applications. 

## Java client configuration properties

### Producer and consumer configurations

Property | Recommended values | Permitted range | Notes
---|---:|-----:|---
`metadata.max.age.ms` | 180000 (approximate) | < 240000 | Can be lowered to pick up metadata changes sooner.
`connections.max.idle.ms`	| 180000 | < 240000 | Azure closes inbound TCP idle > 240,000 ms, which can result in sending on dead connections (shown as expired batches because of send timeout).

### Producer configurations only
Producer configs can be found [here](https://kafka.apache.org/documentation/#producerconfigs).

Property | Recommended Values | Permitted Range | Notes
---|---:|---:|---
`max.request.size` | 1000000 | < 1046528 | The service will close connections if requests larger than 1,046,528 bytes are sent.  *This value **must** be changed and will cause issues in high-throughput produce scenarios.*
`retries` | > 0 | | May require increasing delivery.timeout.ms value, see documentation.
`request.timeout.ms` | 30000 .. 60000 | > 20000| Event Hubs will internally default to a minimum of 20,000 ms.  *While requests with lower timeout values are accepted, client behavior isn't guaranteed.*. <p>Make sure that your **request.timeout.ms** is at least the recommended value of 60000 and your **session.timeout.ms** is at least the recommended value of 30000. Having these settings too low could cause consumer timeouts, which then cause rebalances (which then cause more timeouts, which cause more rebalancing, and so on).</p>
`metadata.max.idle.ms` | 180000 | > 5000 | Controls how long the producer will cache metadata for a topic that's idle. If the elapsed time since a topic was last produced exceeds the metadata idle duration, then the topic's metadata is forgotten and the next access to it will force a metadata fetch request.
`linger.ms` | > 0 | | For high throughput scenarios, linger value should be equal to the highest tolerable value to take advantage of batching.
`delivery.timeout.ms` | | | Set according to the formula (`request.timeout.ms` + `linger.ms`) * `retries`.
`compression.type` | `none` | | Compression currently not supported..

### Consumer configurations only
Consumer configs can be found [here](https://kafka.apache.org/documentation/#consumerconfigs).

Property | Recommended Values | Permitted Range | Notes
---|---:|-----:|---
`heartbeat.interval.ms` | 3000 | | 3000 is the default value and shouldn't be changed.
`session.timeout.ms` | 30000 |6000 .. 300000| Start with 30000, increase if seeing frequent rebalancing because of missed heartbeats.<p>Make sure that your request.timeout.ms is at least the recommended value of 60000 and your session.timeout.ms is at least the recommended value of 30000. Having these settings too low could cause consumer timeouts, which then cause rebalances (which then cause more timeouts, which cause more rebalancing, and so on).</p>
`max.poll.interval.ms` | 300000 (default) |>session.timeout.ms| Used for rebalance timeout, so this should not be set too low. Must be greater than session.timeout.ms.

## librdkafka configuration properties
The main `librdkafka` configuration file ([link](https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md)) contains extended descriptions for the properties below.

### Producer and consumer configurations

Property | Recommended Values | Permitted Range | Notes
---|---:|-----:|---
`socket.keepalive.enable` | true | | Necessary if connection is expected to idle.  Azure will close inbound TCP idle > 240,000 ms.
`metadata.max.age.ms` | ~ 180000| < 240000 | Can be lowered to pick up metadata changes sooner.

### Producer configurations only

Property | Recommended Values | Permitted Range | Notes
---|---:|-----:|---
`retries` | 2 | | Default is 2147483647. 
`request.timeout.ms` | 30000 .. 60000 | > 20000| Event Hubs will internally default to a minimum of 20,000 ms.  `librdkafka` default value is 5000, which can be problematic. *While requests with lower timeout values are accepted, client behavior isn't guaranteed.*
`partitioner` | `consistent_random` | See librdkafka documentation | `consistent_random` is default and best.  Empty and null keys are handled ideally for most cases.
`compression.codec` | `none` || Compression currently not supported.

### Consumer configurations only

Property | Recommended Values | Permitted Range | Notes
---|---:|-----:|---
`heartbeat.interval.ms` | 3000 || 3000 is the default value and shouldn't be changed.
`session.timeout.ms` | 30000 |6000 .. 300000| Start with 30000, increase if seeing frequent rebalancing because of missed heartbeats.
`max.poll.interval.ms` | 300000 (default) |>session.timeout.ms| Used for rebalance timeout, so this should not be set too low. Must be greater than session.timeout.ms.


## Further notes

Check the following table of common configuration-related error scenarios.

Symptoms | Problem | Solution
----|---|-----
Offset commit failures because of rebalancing | Your consumer is waiting too long in between calls to poll() and the service is kicking the consumer out of the group. | You have several options: <ul><li>Increase poll processing timeout (`max.poll.interval.ms`)</li><li>Decrease message batch size to speed up processing</li><li>Improve processing parallelization to avoid blocking consumer.poll()</li></ul> Applying some combination of the three is likely wisest.
Network exceptions at high produce throughput | Are you using Java client + default max.request.size?  Your requests may be too large. | See Java configs above.

## Next steps
See [Azure subscription and service limits, quotas, and constraints](..//azure-resource-manager/management/azure-subscription-service-limits.md) for quotas and limits of all Azure services. 
