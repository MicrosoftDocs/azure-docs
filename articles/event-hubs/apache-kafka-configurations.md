---
title: Apache Kafka client configurations for Azure Event Hubs
description: Recommended Kafka client configurations when migrating from Apache Kafka to Azure Event Hubs. Learn which settings to adjust and which defaults to keep.
ms.topic: reference
ms.subservice: kafka
ms.custom: devx-track-extended-java
ms.date: 12/17/2025
---

# Apache Kafka client configurations for Azure Event Hubs

This guide helps Kafka developers configure their client applications when migrating from Apache Kafka to Azure Event Hubs. Event Hubs provides a Kafka-compatible endpoint, allowing you to use existing Kafka client libraries with minimal configuration changes.

## Before you begin

### What you can and can't configure

Azure Event Hubs is a fully managed service. Unlike self-managed Kafka clusters, you don't have access to broker-side configurations. This means:

| Configuration type | Configurable? | Notes |
|--------------------|---------------|-------|
| **Client-side configurations** | ✅ Yes | Producer and consumer settings in your application code |
| **Broker/server configurations** | ❌ No | Managed by Event Hubs (replication, retention policies, etc.) |
| **Topic-level configurations** | ⚠️ Limited | Partition count and retention set via Azure portal or APIs, not Kafka AdminClient |

### Use defaults unless you have a specific need

> [!IMPORTANT]
> **For most workloads, the default Kafka client configurations work well with Event Hubs.** Only modify settings when you have a specific performance requirement or encounter issues. Incorrect configuration changes can negatively impact throughput, latency, and reliability.

The tables in this article list configurations that **differ from standard Kafka defaults** or have **Event Hubs-specific constraints**. If a configuration isn't listed here, use the Kafka client default value.

### Required connection settings

All Kafka clients connecting to Event Hubs require these authentication settings:

```properties
bootstrap.servers=<your-namespace>.servicebus.windows.net:9093
security.protocol=SASL_SSL
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="<your-connection-string>";
```

For more connection options, see [Connect to Event Hubs using Kafka protocol](event-hubs-quickstart-kafka-enabled-event-hubs.md). 

## Java client configuration properties

This section covers configurations for the official Apache Kafka Java client. For the full list of Kafka producer and consumer configurations, see the [Apache Kafka documentation](https://kafka.apache.org/documentation/).

### Configurations that differ from Kafka defaults

The following settings have Event Hubs-specific constraints or recommended values that differ from standard Kafka defaults:

#### Producer and consumer

| Property | Default | Recommended for Event Hubs | Constraint | Notes |
|----------|---------|---------------------------|------------|-------|
| `metadata.max.age.ms` | 300000 | 180000 | Must be < 240000 | Azure closes idle connections after 240 seconds |
| `connections.max.idle.ms` | 540000 | 180000 | Must be < 240000 | Prevents sending on closed connections (appears as expired batches) |

#### Producer only

| Property | Default | Recommended for Event Hubs | Constraint | Notes |
|----------|---------|---------------------------|------------|-------|
| `max.request.size` | 1048576 | 1000000 | Must be < 1046528 | **Critical**: Connections close if exceeded. Reduce from default. |
| `request.timeout.ms` | 30000 | 60000 | Must be > 20000 | Event Hubs enforces 20 second minimum internally |
| `compression.type` | none | `none` or `gzip` | Only `gzip` supported | Other compression types (snappy, lz4, zstd) aren't supported |

#### Consumer only

| Property | Default | Recommended for Event Hubs | Constraint | Notes |
|----------|---------|---------------------------|------------|-------|
| `heartbeat.interval.ms` | 3000 | 3000 (keep default) | — | Don't change this value |
| `session.timeout.ms` | 45000 | 30000 | 6000–300000 | Increase if you see frequent rebalancing |
| `max.poll.interval.ms` | 300000 | 300000 (keep default) | Must be > `session.timeout.ms` | Increase only if processing takes longer than 5 minutes |

### Configurations to keep at defaults

These settings work well with Event Hubs at their default values. Only change them if you have specific requirements:

| Property | Default | When to consider changing |
|----------|---------|---------------------------|
| `retries` | 2147483647 | Rarely needs changing |
| `delivery.timeout.ms` | 120000 | Adjust if using custom retry strategy |
| `linger.ms` | 0 | Increase for high-throughput scenarios (trades latency for throughput) |
| `batch.size` | 16384 | Increase for high-throughput scenarios |
| `acks` | all | Use `1` for higher throughput with slightly less durability |
| `enable.idempotence` | true | Keep enabled for exactly-once producer semantics. Requires `request.timeout.ms` ≥ 60000, high `retries` (default is sufficient), and `acks=all` |

## librdkafka configuration properties

This section covers configurations for librdkafka-based clients (Confluent Python, Confluent .NET, Confluent Go, and others). For the complete configuration reference, see the [librdkafka documentation](https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md).

### Configurations that differ from librdkafka defaults

#### Producer and consumer

| Property | Default | Recommended for Event Hubs | Constraint | Notes |
|----------|---------|---------------------------|------------|-------|
| `socket.keepalive.enable` | false | true | — | Required to prevent idle connection closure |
| `metadata.max.age.ms` | 900000 | 180000 | Must be < 240000 | Azure closes idle connections after 240 seconds |

#### Producer only

| Property | Default | Recommended for Event Hubs | Constraint | Notes |
|----------|---------|---------------------------|------------|-------|
| `request.timeout.ms` | 5000 | 60000 | Must be > 20000 | **Critical**: librdkafka default is too low for Event Hubs |
| `compression.codec` | none | `none` or `gzip` | Only `gzip` supported | Other compression types aren't supported |

#### Consumer only

| Property | Default | Recommended for Event Hubs | Constraint | Notes |
|----------|---------|---------------------------|------------|-------|
| `heartbeat.interval.ms` | 3000 | 3000 (keep default) | — | Don't change this value |
| `session.timeout.ms` | 45000 | 30000 | 6000–300000 | Increase if you see frequent rebalancing |
| `max.poll.interval.ms` | 300000 | 300000 (keep default) | Must be > `session.timeout.ms` | Increase only if processing takes longer than 5 minutes |

### Configurations to keep at defaults

| Property | Default | When to consider changing |
|----------|---------|---------------------------|
| `retries` | 2147483647 | Rarely needs changing |
| `partitioner` | consistent_random | Handles null keys well; change only for specific key distribution needs |


## Troubleshooting common issues

If you encounter problems after migrating from Kafka to Event Hubs, check these common configuration-related issues:

| Symptom | Likely cause | Solution |
|---------|--------------|----------|
| Connection closed unexpectedly | `max.request.size` exceeds 1,046,528 bytes | Set `max.request.size=1000000` |
| Expired batches or send timeouts | Idle connections closed by Azure | Set `connections.max.idle.ms=180000` and `metadata.max.age.ms=180000` |
| Request timeouts (librdkafka) | Default `request.timeout.ms` too low | Set `request.timeout.ms=60000` |
| Frequent consumer rebalancing | `session.timeout.ms` too low or processing too slow | Increase `session.timeout.ms` or `max.poll.interval.ms`. Consider setting unique `group.instance.id` per consumer instance to reduce rebalances from transient disconnections |
| Offset commit failures | Processing takes too long between polls | Increase `max.poll.interval.ms`, reduce batch size, or parallelize processing |
| Compression errors | Unsupported compression type | Use `compression.type=gzip` or `compression.type=none` |
| Authentication failures | Incorrect connection string format | Verify `sasl.jaas.config` format and connection string value |
| High latency spikes | `linger.ms` set too high, causing batch accumulation delays | Reduce `linger.ms` value (use `0` for lowest latency) |
| Data disappearing earlier than expected | Event Hubs retention period shorter than original Kafka retention | Adjust retention in Azure portal; check [quotas and limits](event-hubs-quotas.md) for max retention per tier |
| Unexpected offset reset | Consumer offsets expired beyond Event Hubs retention period | Ensure `auto.offset.reset` is configured appropriately; increase retention or process data before offsets expire |
| Not receiving all data from all partitions | Zombie consumer application running in your environment with the same `group.id` | Isolate and kill the zombie application |

## Configuration not supported

The following Kafka features and configurations aren't available with Event Hubs:

| Feature | Reason |
|---------|--------|
| Kafka AdminClient for topic management | Use Azure portal, CLI, or ARM templates instead |
| Broker configurations | Event Hubs is fully managed |
| Transactions | Not currently supported |
| Exactly-once semantics (EOS) | Not currently supported |
| Compression types other than gzip | Only gzip compression is supported |
| Custom partitioner on server side | Partition assignment is client-side only |

## Related content

- [Azure Event Hubs for Apache Kafka overview](azure-event-hubs-apache-kafka-overview.md)
- [Quickstart: Stream data with Event Hubs using Kafka protocol](event-hubs-quickstart-kafka-enabled-event-hubs.md)
- [Migrate from Apache Kafka to Event Hubs](apache-kafka-migration-guide.md)
- [Event Hubs quotas and limits](event-hubs-quotas.md)
- [Apache Kafka documentation: Producer configs](https://kafka.apache.org/documentation/#producerconfigs)
- [Apache Kafka documentation: Consumer configs](https://kafka.apache.org/documentation/#consumerconfigs) 
