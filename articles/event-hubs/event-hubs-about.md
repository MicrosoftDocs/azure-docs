---
title: 'Azure Event Hubs: Data streaming platform with Kafka support'
description: Learn about Azure Event Hubs, which is a real-time data streaming platform with native Apache Kafka support.
ms.topic: overview
ms.date: 01/24/2024
---

# Azure Event Hubs: A real-time data streaming platform with native Apache Kafka support

Azure Event Hubs is a native data-streaming service in the cloud that can stream millions of events per second, with low latency, from any source to any destination. Event Hubs is compatible with Apache Kafka. It enables you to run existing Kafka workloads without any code changes.

Businesses can use Event Hubs to ingest and store streaming data. By using streaming data, businesses can gain valuable insights, drive real-time analytics, and respond to events as they happen. They can use this data to enhance their overall efficiency and customer experience.

:::image type="content" source="./media/event-hubs-about/event-streaming-platform.png" alt-text="Diagram that shows how Azure Event Hubs fits in an event streaming platform." lightbox="./media/event-hubs-about/event-streaming-platform.png":::

Event Hubs is the preferred event ingestion layer of any event streaming solution that you build on top of Azure. It integrates with data and analytics services inside and outside Azure to build a complete data streaming pipeline to serve the following use cases:

- [Process data from your event hub by using Azure Stream Analytics](./process-data-azure-stream-analytics.md) to generate real-time insights.
- [Analyze and explore streaming data with Azure Data Explorer](/azure/data-explorer/ingest-data-event-hub-overview).
- Create your own cloud native applications, functions, or microservices that run on streaming data from Event Hubs.
- [Stream events with schema validation by using the built-in Azure Schema Registry to ensure quality and compatibility of streaming data](schema-registry-overview.md).

## Key capabilities

Learn about the key capabilities of Azure Event Hubs in the following sections.

### Apache Kafka on Azure Event Hubs

Event Hubs is a multi-protocol event streaming engine that natively supports Advanced Message Queuing Protocol (AMQP), Apache Kafka, and HTTPS protocols. Because it supports Apache Kafka, you can bring Kafka workloads to Event Hubs without making any code changes. You don't need to set up, configure, or manage your own Kafka clusters or use a Kafka-as-a-service offering that's not native to Azure.

Event Hubs is built as a cloud native broker engine. For this reason, you can run Kafka workloads with better performance, better cost efficiency, and no operational overhead.

For more information, see [Azure Event Hubs for Apache Kafka](azure-event-hubs-kafka-overview.md).

### Schema Registry in Event Hubs

Azure Schema Registry in Event Hubs provides a centralized repository for managing schemas of event streaming applications. Schema Registry comes free with every Event Hubs namespace. It integrates with your Kafka applications or Event Hubs SDK-based applications.

:::image type="content" source="./media/event-hubs-about/schema-registry.png" alt-text="Diagram that shows Schema Registry and Event Hubs integration.":::

Schema Registry ensures data compatibility and consistency across event producers and consumers. It enables schema evolution, validation, and governance and promotes efficient data exchange and interoperability.

Schema Registry integrates with your existing Kafka applications and supports multiple schema formats, including Avro and JSON schemas.

For more information, see [Azure Schema Registry in Event Hubs](schema-registry-overview.md).

### Real-time processing of streaming events with Stream Analytics

Event Hubs integrates with Azure Stream Analytics to enable real-time stream processing. With the built-in no-code editor, you can develop a Stream Analytics job by using drag-and-drop functionality, without writing any code.

:::image type="content" source="./media/event-hubs-about/process-data.png" alt-text="Screenshot that shows the Process data page with the Enable real-time insights from events tile." lightbox="./media/event-hubs-about/process-data.png":::

Alternatively, developers can use the SQL-based Stream Analytics query language to perform real-time stream processing and take advantage of a wide range of functions for analyzing streaming data.

For more information, see articles in [the Azure Stream Analytics integration section](../stream-analytics/no-code-build-power-bi-dashboard.md) of the table of contents.

### Explore streaming data with Azure Data Explorer

Azure Data Explorer is a fully managed platform for big data analytics that delivers high performance and allows for the analysis of large volumes of data in near real time. By integrating Event Hubs with Azure Data Explorer, you can perform near real-time analytics and exploration of streaming data.

:::image type="content" source="./media/event-hubs-about/data-explorer-integration.png" alt-text="Diagram that shows Azure Data Explorer query and output.":::

For more information, see [Ingest data from an event hub into Azure Data Explorer](/azure/data-explorer/ingest-data-event-hub-overview).

### Azure functions, SDKs, and the Kafka ecosystem

With Event Hubs, you can ingest, buffer, store, and process your stream in real time to get actionable insights. Event Hubs uses a partitioned consumer model. It enables multiple applications to process the stream concurrently and lets you control the speed of processing. Event Hubs also integrates with Azure Functions for serverless architectures.

A broad ecosystem is available for the industry-standard AMQP 1.0 protocol. SDKs are available in languages like .NET, Java, Python, and JavaScript, so you can start processing your streams from Event Hubs. All supported client languages provide low-level integration.

The ecosystem also allows you to integrate with Azure Functions, Azure Spring Apps, Kafka Connectors, and other data analytics platforms and technologies, such as Apache Spark and Apache Flink.

### Flexible and cost-efficient event streaming

You can experience flexible and cost-efficient event streaming through the Standard, Premium, or Dedicated tiers for Event Hubs. These options cater to data streaming needs that range from a few MB/sec to several GB/sec. You can choose the match that's appropriate for your requirements.

### Scalable

With Event Hubs, you can start with data streams in megabytes and grow to gigabytes or terabytes. The [auto-inflate](event-hubs-auto-inflate.md) feature is one of the options available to scale the number of throughput units or processing units to meet your usage needs.

### Supports streaming large messages

In most streaming scenarios, data is characterized by being lightweight, typically less than 1 MB, and having a high throughput. There are also instances where messages can't be divided into smaller segments. Event Hubs can accommodate events up to 20 MB with self-serve scalable [dedicated clusters](event-hubs-dedicated-overview.md) at no extra charge. This capability allows Event Hubs to handle a wide range of message sizes to ensure uninterrupted business operations. For more information, see [Send and receive large messages with Azure Event Hubs](event-hubs-quickstart-stream-large-messages.md).

### Capture streaming data for long-term retention and batch analytics

Capture your data in near real time in Azure Blob Storage or Azure Data Lake Storage for long-term retention or micro-batch processing. You can achieve this behavior on the same stream that you use for deriving real-time analytics. Setting up capture of event data is fast.  

:::image type="content" source="./media/event-hubs-capture-overview/event-hubs-capture-msi.png" alt-text="Diagram that shows capturing Event Hubs data into Azure Storage or Azure Data Lake Storage by using Managed Identity.":::

## How it works

Event Hubs provides a unified event streaming platform with a time-retention buffer, decoupling event producers from event consumers. The producer and consumer applications can perform large-scale data ingestion through multiple protocols.

The following diagram shows the main components of Event Hubs architecture.

:::image type="content" source="./media/event-hubs-about/components.png" alt-text="Diagram that shows the main components of Event Hubs.":::

The key functional components of Event Hubs include:

- **Producer applications**: These applications can ingest data to an event hub by using Event Hubs SDKs or any Kafka producer client.
- **Namespace**: The management container for one or more event hubs or Kafka topics. The management tasks such as allocating streaming capacity, configuring network security, and enabling geo-disaster recovery are handled at the namespace level.
- **Event Hubs/Kafka topic**: In Event Hubs, you can organize events into an event hub or a Kafka topic. It's an append-only distributed log, which can comprise one or more partitions.
- **Partitions**: They're used to scale an event hub. They're like lanes in a freeway. If you need more streaming throughput, you can add more partitions.
- **Consumer applications**: These applications can consume data by seeking through the event log and maintaining consumer offset. Consumers can be Kafka consumer clients or Event Hubs SDK clients.
- **Consumer group**: This logical group of consumer instances reads data from an event hub or Kafka topic. It enables multiple consumers to read the same streaming data in an event hub independently at their own pace and with their own offsets.

## Related content

To get started using Event Hubs, see the following quickstarts.

### Stream data by using the Event Hubs SDK (AMQP)

You can use any of the following samples to stream data to Event Hubs by using SDKs.

- [.NET Core](event-hubs-dotnet-standard-getstarted-send.md)
- [Java](event-hubs-java-get-started-send.md)
- [Spring](/azure/developer/java/spring-framework/configure-spring-cloud-stream-binder-java-app-azure-event-hub?toc=/azure/event-hubs/TOC.json)
- [Python](event-hubs-python-get-started-send.md)
- [JavaScript](event-hubs-node-get-started-send.md)
- [Go](event-hubs-go-get-started-send.md)
- [C](event-hubs-c-getstarted-send.md) (send only)
- [Apache Storm](event-hubs-storm-getstarted-receive.md) (receive only)

### Stream data by using Apache Kafka

You can use the following samples to stream data from your Kafka applications to Event Hubs.

- [Use Event Hubs with Kafka applications](event-hubs-java-get-started-send.md)

### Schema validation with Schema Registry

You can use Event Hubs Schema Registry to perform schema validation for your event streaming applications.

- [Schema validation for Kafka applications](schema-registry-kafka-java-send-receive-quickstart.md)
