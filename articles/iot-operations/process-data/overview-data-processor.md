---
title: Process messages at the edge
description: Use the Azure IoT Data Processor to aggregate, enrich, normalize, and filter the data from your devices before you send it to the cloud.
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: conceptual #Required.
ms.custom:
  - ignite-2023
ms.date: 09/08/2023

#CustomerIntent: As an OT user, I want process data at the edge so that I can send well-structured, complete, and relevant data to the cloud for storage and analysis.
---

# Process data at the edge

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Industrial assets generate data in many different formats and use various communication protocols. This diversity of data sources, coupled with varying schemas and unit measures, makes it difficult to use and analyze raw industrial data effectively. Furthermore, for compliance, security, and performance reasons, you can’t upload all datasets to the cloud.

To process this data traditionally requires expensive, complex, and time-consuming data engineering. Azure IoT Data Processor (preview) is a configurable data processing service that can manage the complexities and diversity of industrial data. Use Data Processor to make data from disparate sources more understandable, usable, and valuable.

## What is Azure IoT Data Processor?

Azure IoT Data Processor (preview) is a component of Azure IoT Operations Preview. Data Processor lets you aggregate, enrich, normalize, and filter the data from your devices. Data Processor is a pipeline-based data processing engine that lets you process data at the edge before you send it to the other services either at the edge or in the cloud:

:::image type="content" source="media/azure-iot-operations-architecture.svg" alt-text="Diagram of the Azure IoT Operations architecture that highlights the Data Processor component." lightbox="media/azure-iot-operations-architecture-high-resolution.png" border="false":::

Data Processor ingests real-time streaming data from sources such as OPC UA servers, historians, and other industrial systems. It normalizes this data by converting various data formats into a standardized, structured format, which makes it easier to query and analyze. The data processor can also contextualize the data, enriching it with reference data or last known values (LKV) to provide a comprehensive view of your industrial operations.

The output from Data Processor is clean, enriched, and standardized data that's ready for downstream applications such as real-time analytics and insights tools. The data processor significantly reduces the time required to transform raw data into actionable insights.

Key Data Processor features include:

- Flexible data normalization to convert multiple data formats into a standardized structure.

- Enrichment of data streams with reference or LKV data to enhance context and enable better insights.

- Built-in Microsoft Fabric integration to simplify the analysis of clean data.

- Ability to process data from various sources and publish the data to various destinations.

- As a data agnostic data processing platform, Data Processor can ingest data in any format, process the data, and then write it out to a destination. To support these capabilities, Data Processor can deserialize and serialize various formats. For example, it can serialize to parquet in order to write files to Microsoft Fabric.

## What is a pipeline?

A Data Processor pipeline has an input source where it reads data from, a destination where it writes processed data to, and a variable number of intermediate stages to process the data.

:::image type="content" source="media/pipeline-stages.png" alt-text="Diagram that shows how a pipeline is made up from stages." border="false":::

The intermediate stages represent the different available data processing capabilities:

- You can add as many intermediate stages as you need to a pipeline.
- You can order the intermediate stages of a pipeline as you need. You can reorder stages after you create a pipeline.
- Each stage adheres to a defined implementation interface and input/output schema contract​.
- Each stage is independent of the other stages in the pipeline.
- All stages operate within the scope of a [partition](concept-partitioning.md). Data isn't shared between different partitions.
- Data flows from one stage to the next only.

Data Processor pipelines can use the following stages:

| Stage | Description |
| ----- | ----------- |
| [Source - MQ](howto-configure-datasource-mq.md) | Retrieves data from an MQTT broker. |
| [Source - HTTP endpoint](howto-configure-datasource-http.md) | Retrieves data from an HTTP endpoint. |
| [Source - SQL](howto-configure-datasource-sql.md) | Retrieves data from a Microsoft SQL Server database. |
| [Filter](howto-configure-filter-stage.md) | Filters data coming through the stage. For example, filter out any message with temperature outside of the `50F-150F` range. |
| [Transform](howto-configure-transform-stage.md) | Normalizes the structure of the data. For example, change the structure from `{"Name": "Temp", "value": 50}` to `{"temp": 50}`. |
| [LKV](howto-configure-lkv-stage.md) | Stores selected metric values into an LKV store. For example, store only temperature and humidity measurements into LKV, ignore the rest. A subsequent stage can enrich a message with the stored LKV data. |
| [Enrich](howto-configure-enrich-stage.md) | Enriches messages with data from the reference data store. For example, add an operator name and lot number from the operations dataset. |
| [Aggregate](howto-configure-aggregate-stage.md) | Aggregates values passing through the stage. For example, when temperature values are sent every 100 milliseconds, emit an average temperature metric every 30 seconds. |
| [Call out](howto-configure-grpc-callout-stage.md) | Makes a call to an external HTTP or gRPC service. For example, call an Azure Function to convert from a custom message format to JSON. |
| [Destination - MQ](howto-configure-destination-mq-broker.md) | Writes your processed, clean and contextualized data to an MQTT topic. |
| [Destination - Reference](howto-configure-destination-reference-store.md) | Writes your processed data to the built-in reference store. Other pipelines can use the reference store to enrich their messages. |
| [Destination - gRPC](howto-configure-destination-grpc.md) | Sends your processed, clean and contextualized data to a gRPC endpoint. |
| [Destination - Fabric Lakehouse](../connect-to-cloud/howto-configure-destination-fabric.md) | Sends your processed, clean and contextualized data to a Microsoft Fabric lakehouse in the cloud. |
| [Destination - Azure Data Explorer](../connect-to-cloud/howto-configure-destination-data-explorer.md) | Sends your processed, clean and contextualized data to an Azure Data Explorer endpoint in the cloud. |


## Next step

To try out Data Processor pipelines, see the [Azure IoT Operations quickstarts](../get-started/quickstart-deploy.md).

To learn more about Data Processor, see:

- [Message structure overview](concept-message-structure.md)
- [Serialization and deserialization formats overview](concept-supported-formats.md)
