---
title: Event Hubs features and terminology
description: Learn about the core concepts, features, and terminology of Azure Event Hubs including namespaces, partitions, consumers, and protocols.
ms.topic: concept-article
ms.date: 01/12/2026
---

# Event Hubs features and terminology

This article explains the core concepts and terminology of Azure Event Hubs. For a high-level overview, see [What is Event Hubs?](./event-hubs-about.md).

## Concepts at a glance

| Concept | Description |
|---------|-------------|
| **Namespace** | Management container for one or more event hubs. Controls network access and scaling. |
| **Event hub** | An append-only log that stores events. Equivalent to a Kafka topic. |
| **Partition** | Ordered sequence of events within an event hub. Enables parallel processing. |
| **Producer/Publisher** | Application that sends events to an event hub. |
| **Consumer** | Application that reads events from an event hub. |
| **Consumer group** | Independent view of the event stream. Multiple groups can read the same data separately. |
| **Offset** | Position of an event within a partition. Used to track reading progress. |
| **Checkpointing** | Saving the current offset so consumers can resume from where they left off. |

---

## Architecture

### Namespace

An Event Hubs **namespace** is a management container for event hubs (or topics, in Kafka parlance). It provides network endpoints and controls access through features like [IP filtering](event-hubs-ip-filtering.md), [virtual network service endpoints](event-hubs-service-endpoints.md), and [Private Link](private-link-service.md).

:::image type="content" source="./media/event-hubs-features/namespace.png" alt-text="Diagram showing an Event Hubs namespace containing multiple event hubs.":::

### Partitions

[!INCLUDE [event-hubs-partitions](./includes/event-hubs-partitions.md)]

---

## Event producers

A **producer** (or publisher) is any application that sends events to an event hub.

### Publishing options

| Method | Description |
|--------|-------------|
| **Azure SDKs** | [.NET](event-hubs-dotnet-standard-getstarted-send.md), [Java](event-hubs-java-get-started-send.md), [Python](event-hubs-python-get-started-send.md), [JavaScript](event-hubs-node-get-started-send.md), [Go](event-hubs-go-get-started-send.md) |
| **REST API** | [HTTP POST requests](/rest/api/eventhub/) for lightweight clients |
| **Kafka clients** | Use existing Kafka producers without code changes |
| **AMQP 1.0** | Any AMQP client such as [Apache Qpid](https://qpid.apache.org/) |

### Key behaviors

- **Batch or individual**: Publish events one at a time or in batches. Maximum 1 MB per publish operation.
- **Partition keys**: Specify a partition key to group related events in the same partition, ensuring ordered delivery.
- **Authorization**: Use Microsoft Entra ID (OAuth2) or Shared Access Signatures (SAS) for access control.

:::image type="content" source="./media/event-hubs-features/partition_keys.png" alt-text="Diagram showing how partition keys map events to specific partitions.":::

<a name="publisher-policy"></a>

### Publisher policies

Publisher policies enable granular control when you have many independent publishers. Each publisher uses a unique identifier:

```http
//<my namespace>.servicebus.windows.net/<event hub name>/publishers/<my publisher name>
```

The publisher name must match the SAS token used for authentication. When using publisher policies, the **PartitionKey** must match the publisher name.

---

<a name="event-consumers"></a>

## Event consumers

A **consumer** is any application that reads events from an event hub. Event Hubs uses a **pull model**—consumers request events rather than having events pushed to them.

### Consumer groups

A **consumer group** is an independent view of the event stream. Multiple consumer groups can read the same event hub simultaneously, each tracking their own position.

| Guideline | Recommendation |
|-----------|----------------|
| Readers per partition | One active reader per partition within a consumer group (up to five in special scenarios) |
| Default group | Every event hub has a default consumer group (`$Default`) |
| Multiple applications | Create separate consumer groups for each application (analytics, archival, alerting) |

```http
//<my namespace>.servicebus.windows.net/<event hub name>/<Consumer Group #1>
//<my namespace>.servicebus.windows.net/<event hub name>/<Consumer Group #2>
```

:::image type="content" source="./media/event-hubs-about/event_hubs_architecture.png" alt-text="Diagram showing multiple consumer groups reading from the same event hub.":::

### Offsets

An **offset** is the position of an event within a partition—think of it as a cursor. Consumers use offsets to specify where to start reading. You can start from:

- A specific offset value
- A timestamp
- The beginning or end of the stream

:::image type="content" source="./media/event-hubs-features/partition_offset.png" alt-text="Diagram showing events in a partition with offset positions.":::

### Checkpointing

**Checkpointing** is when a consumer saves its current offset. This enables:

- **Resumption**: If a consumer disconnects, it resumes from the last checkpoint
- **Failover**: A new consumer instance can take over from where another left off
- **Replay**: Process historical events by specifying an earlier offset

> [!IMPORTANT]
> In AMQP, checkpointing is the consumer's responsibility. The Event Hubs service provides offsets, but consumers must store checkpoints.

[!INCLUDE [storage-checkpoint-store-recommendations](./includes/storage-checkpoint-store-recommendations.md)]

### Event processor clients

The Azure SDKs provide intelligent consumer clients that handle partition management, load balancing, and checkpointing automatically:

| Language | Client |
|----------|--------|
| .NET | [EventProcessorClient](/dotnet/api/azure.messaging.eventhubs.eventprocessorclient) |
| Java | [EventProcessorClient](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/eventhubs/azure-messaging-eventhubs/src/main/java/com/azure/messaging/eventhubs/EventProcessorClient.java) |
| Python | [EventHubConsumerClient](/python/api/azure-eventhub/azure.eventhub.aio.eventhubconsumerclient) |
| JavaScript | [EventHubConsumerClient](/javascript/api/@azure/event-hubs/eventhubconsumerclient) |

### Event data structure

Each event contains:

- **Body**: The event payload
- **Offset**: Position in the partition
- **Sequence number**: Order within the partition
- **User properties**: Custom metadata
- **System properties**: Service-assigned metadata (enqueue time, etc.)

---

## Data management

### Event retention

Events are automatically removed based on a time-based retention policy.

| Tier | Default | Maximum |
|------|---------|---------|
| Standard | 1 hour | 7 days |
| Premium | 1 hour | 90 days |
| Dedicated | 1 hour | 90 days |

Key points:

- Events can't be explicitly deleted
- Retention changes apply to existing events
- Events become unavailable exactly when the retention period expires

> [!NOTE]
> Event Hubs is a real-time streaming engine, not a database. For long-term storage, use [Event Hubs Capture](event-hubs-capture-overview.md) to archive events to [Azure Storage](../storage/blobs/storage-blobs-overview.md), [Data Lake Storage](../data-lake-store/data-lake-store-overview.md), or [Azure Synapse](store-captured-data-data-warehouse.md).

### Event Hubs Capture

[Capture](event-hubs-capture-overview.md) automatically saves streaming data to Azure Blob Storage or Azure Data Lake Storage. Configure a minimum size and time window to control capture frequency.

:::image type="content" source="./media/event-hubs-features/capture.png" alt-text="Diagram showing Event Hubs Capture writing data to Azure Storage.":::

| Format | Description |
|--------|-------------|
| **Avro** | Default format for captured data |
| **Parquet** | Available through the no-code editor in Azure portal ([learn more](../stream-analytics/capture-event-hub-data-parquet.md?toc=%2Fazure%2Fevent-hubs%2Ftoc.json)) |

### Log compaction

[Log compaction](log-compaction.md) retains only the latest event for each unique key, rather than using time-based retention. Useful for maintaining current state without storing full history.

---

## Protocols

Event Hubs supports multiple protocols for flexibility across different client types.

| Protocol | Send | Receive | Best for |
|----------|------|---------|----------|
| **AMQP 1.0** | Yes | Yes | High throughput, low latency, persistent connections |
| **Apache Kafka** | Yes | Yes | Existing Kafka applications (version 1.0+) |
| **HTTPS** | Yes | No | Lightweight clients, firewall-restricted environments |

### Protocol comparison

- **AMQP**: Requires persistent bidirectional socket. Higher initial cost, but better performance for frequent operations. Used by Azure SDKs.
- **Kafka**: Native support means existing Kafka applications work without code changes. Just reconfigure the bootstrap server to point to your Event Hubs namespace.
- **HTTPS**: Simple HTTP POST for sending. No receiving support. Good for occasional, low-volume publishing.

For Kafka integration details, see [Event Hubs for Apache Kafka](azure-event-hubs-apache-kafka-overview.md).

---

## Access control

### Microsoft Entra ID

Microsoft Entra ID provides OAuth 2.0 authentication with role-based access control (RBAC). Assign built-in roles to control access:

| Role | Permissions |
|------|-------------|
| **Azure Event Hubs Data Owner** | Full access to send and receive events |
| **Azure Event Hubs Data Sender** | Send events only |
| **Azure Event Hubs Data Receiver** | Receive events only |

For details, see [Authorize access with Microsoft Entra ID](authorize-access-azure-active-directory.md).

### Shared Access Signatures (SAS)

SAS tokens provide scoped access at the namespace or event hub level. A SAS token is generated from a SAS key and typically grants only **send** or **listen** permissions.

For details, see [Shared Access Signature authentication](../service-bus-messaging/service-bus-sas.md).

### Application groups

[Application groups](resource-governance-overview.md) let you define resource access policies (like throttling) for collections of client applications that share a security context (SAS policy or Microsoft Entra application ID).

---

## Related content

### Get started

- [.NET quickstart](event-hubs-dotnet-standard-getstarted-send.md)
- [Java quickstart](event-hubs-java-get-started-send.md)
- [Python quickstart](event-hubs-python-get-started-send.md)
- [JavaScript quickstart](event-hubs-node-get-started-send.md)

### Learn more

- [Scalability and throughput units](event-hubs-scalability.md)
- [Availability and consistency](event-hubs-availability-and-consistency.md)
- [Event Hubs Capture overview](event-hubs-capture-overview.md)
- [Event Hubs for Apache Kafka](azure-event-hubs-apache-kafka-overview.md)

### Reference

- [Quotas and limits](event-hubs-quotas.md)
- [Event Hubs FAQ](event-hubs-faq.yml)
- [Event Hubs samples](event-hubs-samples.md)
