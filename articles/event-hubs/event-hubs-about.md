---
title: What is Azure Event Hubs - Real-time data streaming platform
description: Azure Event Hubs is a fully managed, real-time data streaming platform with native Apache Kafka support. Learn about capabilities, use cases, and how to get started.
ms.topic: overview
ms.date: 12/16/2025
---

# What is Azure Event Hubs?

Azure Event Hubs is a fully managed, real-time data streaming platform that can ingest millions of events per second with low latency. As a native Azure service with built-in Apache Kafka compatibility, Event Hubs enables you to run existing Kafka workloads without code changes or cluster management overhead.

Organizations use Event Hubs to build data pipelines for IoT telemetry, application logging, clickstream analytics, financial transaction processing, and other scenarios that require high-throughput, reliable event ingestion. Event Hubs integrates with Azure analytics services to enable real-time insights and long-term data retention.

## At a glance

| Attribute | Details |
|-----------|----------|
| **Service type** | Fully managed event streaming platform (PaaS) |
| **Protocols supported** | Apache Kafka, AMQP 1.0, HTTPS |
| **Data retention** | Up to 7 days (Standard), 90 days (Premium/Dedicated) |
| **Pricing tiers** | [Standard, Premium, Dedicated](event-hubs-quotas.md) |
| **SLA** | [Up to 99.99%](https://azure.microsoft.com/support/legal/sla/event-hubs/) |

## Why choose Azure Event Hubs?

- **Zero infrastructure management**: Fully managed service with automatic patching, scaling, and monitoring. No clusters to provision or maintain.
- **Enterprise-grade reliability**: Up to 99.99% SLA with availability zone support and [geo-replication](use-geo-replication.md) for business continuity.
- **Kafka without the complexity**: Run Kafka workloads with better cost efficiency and no operational overhead. No separate Kafka clusters required.
- **Seamless Azure integration**: Native integration with [Stream Analytics](../stream-analytics/stream-analytics-introduction.md), [Azure Functions](../azure-functions/functions-overview.md), [Data Explorer](/azure/data-explorer/data-explorer-overview), and many other Azure services.
- **Flexible pricing**: Choose from consumption-based or dedicated capacity models. Scale from megabytes to terabytes based on demand.

:::image type="content" source="./media/event-hubs-about/event-streaming-platform.png" alt-text="Diagram that shows how Azure Event Hubs fits in an event streaming platform." lightbox="./media/event-hubs-about/event-streaming-platform.png":::

## When to use Event Hubs

Event Hubs is designed for high-throughput, low-latency event streaming scenarios. Consider Event Hubs when you need to:

| Scenario | Description |
|----------|-------------|
| **Real-time analytics** | Process streaming data to generate immediate insights, dashboards, and alerts |
| **IoT telemetry ingestion** | Collect device data from millions of IoT sensors, vehicles, or industrial equipment |
| **Application logging** | Centralize logs from distributed applications for monitoring and troubleshooting |
| **Clickstream analytics** | Analyze user behavior patterns across web and mobile applications |
| **Financial transactions** | Process high-volume trading data, fraud detection signals, and payment events |
| **Event sourcing** | Implement event-driven architectures with durable, ordered event storage |

### Choosing between Azure messaging services

Azure offers multiple messaging services. Use this guidance to select the right service:

| Service | Best for | Message pattern |
|---------|----------|-----------------|
| **Event Hubs** | High-throughput event streaming, telemetry, log aggregation | Many producers, multiple consumers, time-ordered events |
| **Service Bus** | Enterprise messaging with transactions, sessions, dead-lettering | Point-to-point or pub/sub with delivery guarantees |
| **Event Grid** | Reactive event-driven architectures, serverless triggers | Push-based event routing with filtering |

For detailed guidance, see [Choose between Azure messaging services](../service-bus-messaging/compare-messaging-services.md).

## How it works

Event Hubs provides a unified streaming platform with time-based retention, decoupling event producers from consumers. Both can perform large-scale data ingestion and processing through multiple protocols.

:::image type="content" source="./media/event-hubs-about/components.png" alt-text="Diagram that shows the main components of Event Hubs.":::

### Core components

| Component | Description |
|-----------|-------------|
| **Producer applications** | Applications that send events to Event Hubs using [Event Hubs SDKs](sdks.md), Kafka producer clients, or HTTPS |
| **Namespace** | Management container for one or more event hubs. Handles [streaming capacity](event-hubs-scalability.md), [network security](network-security.md), and [geo-disaster recovery](event-hubs-geo-dr.md) at the namespace level |
| **Event hub / Kafka topic** | An append-only distributed log that organizes events. Contains one or more [partitions](event-hubs-features.md#partitions) for parallel processing |
| **Partitions** | Ordered sequences of events used to scale throughput. Think of partitions as lanes on a freeway—more partitions enable higher throughput |
| **Consumer applications** | Applications that read events by tracking their position (offset) in each partition. Can use [Event Hubs SDKs](sdks.md) or Kafka consumer clients |
| **Consumer group** | A logical view of the event hub that enables multiple consumer applications to read the same stream independently, each maintaining its own position |

### Event flow

1. **Ingest**: Producer applications send events to an event hub. Events are assigned to partitions based on partition key or round-robin distribution.
2. **Store**: Events are durably stored with configurable retention (1-90 days depending on tier). The [Capture](event-hubs-capture-overview.md) feature can also write events to long-term storage.
3. **Process**: Consumer applications read events from partitions using consumer groups. Each consumer tracks its offset using [checkpointing](event-hubs-features.md#checkpointing) for reliable processing.

For a detailed explanation, see [Event Hubs features](event-hubs-features.md).

## Key capabilities

### Core platform features

#### Apache Kafka compatibility

Event Hubs is a multi-protocol event streaming engine that natively supports Apache Kafka, AMQP 1.0, and HTTPS. You can bring Kafka workloads to Event Hubs without code changes, cluster management, or third-party Kafka services.

Event Hubs is built as a cloud-native broker engine, delivering better performance and cost efficiency than self-managed Kafka clusters. For more information, see [Azure Event Hubs for Apache Kafka](azure-event-hubs-apache-kafka-overview.md).

#### Flexible scaling

Start with data streams in megabytes and grow to gigabytes or terabytes. The [auto-inflate](event-hubs-auto-inflate.md) feature automatically scales throughput units to meet demand. For predictable high-volume workloads, [dedicated clusters](event-hubs-dedicated-overview.md) provide reserved capacity.

#### Large message support (preview)

While most streaming scenarios involve lightweight messages under 1 MB, Event Hubs accommodates events up to 20 MB with [dedicated clusters](event-hubs-dedicated-overview.md). For more information, see [Send and receive large messages](event-hubs-quickstart-stream-large-messages.md).

### Data management

#### Schema Registry

[Azure Schema Registry](schema-registry-overview.md) provides a centralized repository for managing schemas of event streaming applications. It ensures data compatibility and consistency across producers and consumers, supports schema evolution, and integrates with Kafka applications using Avro and JSON schemas.

:::image type="content" source="./media/event-hubs-about/schema-registry.png" alt-text="Diagram that shows Schema Registry and Event Hubs integration.":::

#### Capture

[Capture](event-hubs-capture-overview.md) your streaming data in near real time to Azure Blob Storage or Azure Data Lake Storage for long-term retention or batch analytics. Capture runs automatically on the same stream used for real-time processing.

:::image type="content" source="./media/event-hubs-capture-overview/event-hubs-capture-msi.png" alt-text="Diagram that shows capturing Event Hubs data into Azure Storage or Azure Data Lake Storage by using Managed Identity.":::

### Azure integrations

#### Stream Analytics integration

Event Hubs integrates with [Azure Stream Analytics](../stream-analytics/stream-analytics-introduction.md) for real-time stream processing. Use the built-in no-code editor with drag-and-drop functionality, or write SQL-based queries for complex transformations.

:::image type="content" source="./media/event-hubs-about/process-data.png" alt-text="Screenshot that shows the Process data page with the Enable real-time insights from events tile." lightbox="./media/event-hubs-about/process-data.png":::

For more information, see [Process Event Hubs data using Stream Analytics](../stream-analytics/no-code-build-power-bi-dashboard.md).

#### Azure Data Explorer integration

[Azure Data Explorer](/azure/data-explorer/data-explorer-overview) delivers high-performance analytics on large volumes of streaming data. Integrate Event Hubs with Data Explorer for near real-time analytics and exploration.

:::image type="content" source="./media/event-hubs-about/data-explorer-integration.png" alt-text="Diagram that shows Azure Data Explorer query and output.":::

For more information, see [Ingest data from Event Hubs into Azure Data Explorer](/azure/data-explorer/ingest-data-event-hub-overview).

#### Azure Functions and serverless

Event Hubs integrates with [Azure Functions](../azure-functions/functions-bindings-event-hubs.md) for serverless event processing. The ecosystem also supports [Azure Spring Apps](/azure/developer/java/spring-framework/configure-spring-cloud-stream-binder-java-app-azure-event-hub), Kafka Connectors, Apache Spark, and Apache Flink.

### Local development

The [Event Hubs emulator](overview-emulator.md) provides a local development experience for developing and testing code against the service in isolation, free from cloud dependencies.

### Client libraries

Event Hubs provides [client libraries](sdks.md) for .NET, Java, Python, JavaScript, and Go. These SDKs support both AMQP and Kafka protocols, enabling you to choose the best fit for your application.

### Monitoring

[Monitor Event Hubs](monitor-event-hubs.md) using Azure Monitor metrics, diagnostic logs, and alerts. Track throughput, latency, errors, and consumer lag to ensure optimal performance.

## Security and compliance

Event Hubs provides enterprise-grade security features:

| Feature | Description |
|---------|-------------|
| **Authentication** | [Microsoft Entra ID](authenticate-application.md) with role-based access control (RBAC), [Shared Access Signatures](authenticate-shared-access-signature.md), or [Managed Identities](authenticate-managed-identity.md) |
| **Network security** | [Private Link](private-link-service.md) for private connectivity, [VNet service endpoints](event-hubs-service-endpoints.md), and [IP firewall rules](event-hubs-ip-filtering.md) |
| **Encryption** | Data encrypted at rest with Microsoft-managed or [customer-managed keys](configure-customer-managed-key.md), TLS 1.2 for data in transit |

For more information, see [Event Hubs security baseline](/security/benchmark/azure/baselines/event-hubs-security-baseline).

## High availability and disaster recovery

Event Hubs provides multiple layers of reliability:

- **Availability zones**: [Zone-redundant](event-hubs-availability-and-consistency.md) deployments distribute replicas across zones within a region (Premium and Dedicated tiers)
- **Geo-disaster recovery**: [Geo-DR](event-hubs-geo-dr.md) enables failover to a secondary region with metadata synchronization
- **SLA guarantees**: Up to [99.99% availability](https://azure.microsoft.com/support/legal/sla/event-hubs/) depending on tier and configuration

## Pricing tiers

For current pricing and detailed feature comparison, see [Event Hubs pricing](https://azure.microsoft.com/pricing/details/event-hubs/) and [quotas and limits](event-hubs-quotas.md).

## Related content

- [Event Hubs features and terminology](event-hubs-features.md)
- [Apache Kafka developer guide](apache-kafka-developer-guide.md)
- [Migrate from Apache Kafka to Event Hubs](apache-kafka-migration-guide.md)

