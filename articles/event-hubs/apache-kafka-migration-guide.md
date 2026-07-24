---
title: Migrate to Azure Event Hubs for Apache Kafka
description: A concise guide for migrating Apache Kafka workloads to Azure Event Hubs, including assessment, configuration changes, and validation steps.
ms.topic: article
ms.subservice: kafka
ms.date: 12/17/2025
---

# Migrate to Azure Event Hubs for Apache Kafka

This guide provides a clear path for migrating your Apache Kafka applications to Azure Event Hubs. Event Hubs exposes a Kafka-compatible endpoint, allowing you to connect existing Kafka clients with configuration changes only—no code modifications required.

## Before you migrate

### Verify feature compatibility

Event Hubs supports most Kafka client operations, but some features aren't available. Review this table to ensure your workload is compatible:

| Feature | Supported | Notes |
|---------|-----------|-------|
| Produce messages | ✅ Yes | Standard producer API |
| Consume messages | ✅ Yes | Standard consumer API |
| Consumer groups | ✅ Yes | Offset management supported |
| Compression (gzip) | ✅ Yes | Only gzip is supported |
| Schema Registry | ✅ Yes | Use [Azure Schema Registry](schema-registry-overview.md) |
| Kafka Connect | ✅ Yes | See [Kafka Connect integration](event-hubs-kafka-connect-tutorial.md) |
| Compression (snappy, lz4, zstd) | ✅ Yes | Use gzip or none |
| Kafka Transactions | ✅ Yes | Currently in Preview. |

For the complete list of supported operations, see [Event Hubs for Apache Kafka](azure-event-hubs-apache-kafka-overview.md).

### Assess your current Kafka setup

Before migrating, document your existing configuration:

| Item | What to note | Event Hubs equivalent |
|------|--------------|----------------------|
| **Number of topics** | Total topics in use | Event hubs (1:1 mapping) |
| **Partitions per topic** | Partition count | Partitions per event hub (can be increased after creation on Premium/Dedicated tiers, but can't be decreased) |
| **Retention period** | Current retention settings | 1-7 days (Standard), 1-90 days (Premium/Dedicated) |
| **Throughput** | Peak MB/sec | [Throughput units or processing units](event-hubs-scalability.md) |
| **Message size** | Maximum message size | 1 MB (Standard/Premium), 20 MB (Dedicated) |
| **Compression type** | snappy, lz4, gzip, etc. | Change to gzip or none if using other types |

### Choose your Event Hubs tier

Select a tier based on your requirements:

| Requirement | Recommended tier |
|-------------|------------------|
| Development/testing, low throughput | Standard |
| **Production Kafka workloads**, zone redundancy, full Kafka protocol support | **Premium** |
| High throughput, large messages (>1 MB), dedicated resources | Dedicated |

> [!IMPORTANT]
> For full Kafka protocol compatibility, use **Premium** or **Dedicated** tier. The Standard tier has limitations that may affect some Kafka workloads.

For detailed tier comparison, see [Event Hubs pricing](https://azure.microsoft.com/pricing/details/event-hubs/) and [quotas](event-hubs-quotas.md).

## Migration steps

### Step 1: Create Event Hubs resources

1. **Create a namespace**: Follow [Create an Event Hubs namespace](event-hubs-create.md)
2. **Create event hubs**: Create one event hub for each Kafka topic you're migrating
3. **Get connection string**: Follow [Get connection string](event-hubs-get-connection-string.md)

Note your namespace FQDN from the connection string:
```
Endpoint=sb://NAMESPACE.servicebus.windows.net/;SharedAccessKeyName=...
```

The FQDN is: `NAMESPACE.servicebus.windows.net`

### Step 2: Update client configuration

Update your Kafka client configuration to connect to Event Hubs. Locate where `bootstrap.servers` is defined in your application and apply these settings:

```properties
bootstrap.servers=NAMESPACE.servicebus.windows.net:9093
security.protocol=SASL_SSL
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="YOUR_CONNECTION_STRING";
```

Replace:
- `NAMESPACE` with your Event Hubs namespace name
- `YOUR_CONNECTION_STRING` with your full connection string

For framework-specific configuration and recommended settings, see [Apache Kafka client configurations](apache-kafka-configurations.md).

### Step 3: Migrate existing data (optional)

If you need to migrate historical data from your existing Kafka cluster to Event Hubs, use Kafka MirrorMaker:

- [Mirror a Kafka broker to Event Hubs](event-hubs-kafka-mirror-maker-tutorial.md)

For ongoing replication or hybrid scenarios, MirrorMaker can run continuously to keep both systems synchronized during a phased migration.

### Step 4: Update consumer offsets

When consumers connect to Event Hubs for the first time, they won't have existing offsets. Configure `auto.offset.reset` based on your needs:

| Setting | Behavior |
|---------|----------|
| `earliest` | Start reading from the beginning of available data |
| `latest` | Start reading only new messages |

## Validate the migration

### Verify producer connectivity

1. Start your producer application with the updated configuration
2. Send test messages to Event Hubs
3. Confirm messages arrive in the Azure portal:
   - Navigate to your Event Hubs namespace
   - Select **Overview** > **Metrics** > **Messages**

### Verify consumer connectivity

1. Start your consumer application with the updated configuration
2. Confirm messages are being received
3. Monitor consumer lag using Azure Monitor or your application metrics

### Performance validation

Compare performance against your baseline:

| Metric | How to verify |
|--------|---------------|
| Throughput (MB/sec) | Monitor incoming/outgoing bytes in Azure portal |
| Latency | Measure end-to-end message delivery time in your application |
| Consumer lag | Check consumer group lag in Azure portal or via Kafka consumer metrics |

For performance optimization, see [Apache Kafka client configurations](apache-kafka-configurations.md).

## Decommission Kafka cluster

After successful validation:

1. **Monitor in parallel**: Run both systems for a stabilization period
2. **Redirect all traffic**: Update all producers and consumers to use Event Hubs
3. **Verify no traffic**: Confirm the Kafka cluster has no active connections
4. **Decommission**: Shut down and remove Kafka infrastructure

## Troubleshooting

If you encounter issues during migration:

| Issue | Resource |
|-------|----------|
| Connection or authentication errors | [Apache Kafka troubleshooting guide](apache-kafka-troubleshooting-guide.md) |
| Configuration problems | [Apache Kafka client configurations](apache-kafka-configurations.md) |
| General questions | [Frequently asked questions](apache-kafka-frequently-asked-questions.yml) |

## Related content

- [Event Hubs for Apache Kafka overview](azure-event-hubs-apache-kafka-overview.md)
- [Apache Kafka developer guide](apache-kafka-developer-guide.md)
- [Quickstart: Stream data using Kafka protocol](event-hubs-quickstart-kafka-enabled-event-hubs.md)
- [Event Hubs quotas and limits](event-hubs-quotas.md)