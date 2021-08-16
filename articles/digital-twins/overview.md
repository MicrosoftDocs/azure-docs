---
# Mandatory fields.
title: What is Azure Digital Twins?
titleSuffix: Azure Digital Twins
description: Overview of what can be done with Azure Digital Twins.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/12/2020
ms.topic: overview
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# What is Azure Digital Twins?

**Azure Digital Twins** is a platform as a service (PaaS) offering that enables the creation of twin graphs based on digital models of entire environments. These environments could be buildings, factories, farms, energy networks, railways, stadiums, and more—even entire cities. These digital models can be used to gain insights that drive better products, optimized operations, reduced costs, and breakthrough customer experiences.

Leverage your domain expertise on top of Azure Digital Twins to build customized, connected solutions that:
* Model any environment, and bring digital twins to life in a scalable and secure manner
* Connect assets such as IoT devices and existing business systems
* Use a robust event system to build dynamic business logic and data processing
* Integrate with Azure data, analytics, and AI services to help you track the past and then predict the future

## Azure Digital Twins capabilities

Here's a summary of the features provided by Azure Digital Twins.

### Open modeling language

In Azure Digital Twins, you define the digital entities that represent the people, places, and things in your physical environment using custom twin types called [models](concepts-models.md). 

You can think of these model definitions as a specialized vocabulary to describe your business. For a building management solution, for example, you might define models such as Building, Floor, and Elevator. You can then create **digital twins** based on these models to represent your specific environment.

[!INCLUDE [digital-twins-versus-device-twins](../../includes/digital-twins-versus-device-twins.md)]

Models are defined in a JSON-like language called [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md), and they describe twins in terms of their state properties, telemetry events, commands, components, and relationships.
* Models define semantic **relationships** between your entities so that you can connect your twins into a graph that reflects their interactions. You can think of the models as nouns in a description of your world, and the relationships as verbs.
* You can also specialize twins using model inheritance. One model can inherit from another.

DTDL is used for data models throughout other Azure IoT services, including [IoT Plug and Play (PnP)](../iot-develop/overview-iot-plug-and-play.md) and [Time Series Insights (TSI)](../time-series-insights/overview-what-is-tsi.md). This helps you keep your Azure Digital Twins solution connected and compatible with other parts of the Azure ecosystem.

### Live execution environment

Digital models in Azure Digital Twins are live, up-to-date representations of the real world. Using the relationships in your custom DTDL models, you'll connect twins into a **live graph** representing your environment.

You can visualize your Azure Digital Twins graph in [Azure Digital Twins Explorer](concepts-azure-digital-twins-explorer.md), which provides the following interface for interacting with your graph:

:::image type="content" source="media/concepts-azure-digital-twins-explorer/azure-digital-twins-explorer-demo.png" alt-text="Screenshot of Azure Digital Twins Explorer, showing a graph of nodes representing digital twins." lightbox="media/concepts-azure-digital-twins-explorer/azure-digital-twins-explorer-demo.png":::

Azure Digital Twins provides a rich **event system** to keep that graph current with data processing and business logic. You can connect external compute resources, such as [Azure Functions](../azure-functions/functions-overview.md), to drive this data processing in flexible, customized ways.

You can also extract insights from the live execution environment, using Azure Digital Twins' powerful **query API​**. The API lets you query with rich search conditions, including property values, relationships, relationship properties, model information, and more. You can also combine queries, gathering a broad range of insights about your environment and answering custom questions that are important to you.

### Input from IoT and business systems

To keep the live execution environment of Azure Digital Twins up to date with the real world, you can use [IoT Hub](../iot-hub/about-iot-hub.md) to connect your solution to IoT and IoT Edge devices. These hub-managed devices are represented as part of your twin graph, and provide the data that drives your model.

You can create a new IoT Hub for this purpose with Azure Digital Twins, or connect an existing IoT Hub along with the devices it already manages.

You can also drive Azure Digital Twins from other data sources, using REST APIs or connectors to other services like [Logic Apps](../logic-apps/logic-apps-overview.md).

### Output to ADX, TSI, storage, and analytics

The data in your Azure Digital Twins model can be routed to downstream Azure services for additional analytics or storage. This is provided through **event routes**, which use [Event Hub](../event-hubs/event-hubs-about.md), [Event Grid](../event-grid/overview.md), or [Service Bus](../service-bus-messaging/service-bus-messaging-overview.md) to drive your desired data flows.

Some things you can do with event routes include:
* Sending digital twin data to ADX for querying with the [Azure Digital Twins query plugin for Azure Data Explorer (ADX)](concepts-data-explorer-plugin.md)
* [Connecting Azure Digital Twins to Time Series Insights (TSI)](how-to-integrate-time-series-insights.md) to track time series history of each twin
* Aligning a Time Series Model in Time Series Insights with a source in Azure Digital Twins
* Storing Azure Digital Twins data in [Azure Data Lake](../storage/blobs/data-lake-storage-introduction.md)
* Analyzing Azure Digital Twins data with [Azure Synapse Analytics](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md), or other Microsoft data analytics tools
* Integrating larger workflows with Logic Apps​

This is another way that Azure Digital Twins can connect into a larger solution, and support your custom needs for continued work with these insights.

## Azure Digital Twins in a solution context

Azure Digital Twins is commonly used in combination with other Azure services as part of a larger IoT solution. 

A complete solution using Azure Digital Twins may contain the following parts:
* The Azure Digital Twins service instance. This stores your twin models and your twin graph with its state, and orchestrates event processing.
* One or more client apps that drive the Azure Digital Twins instance by configuring models, creating topology, and extracting insights from the twin graph.
* One or more external compute resources to process events generated by Azure Digital Twins, or connected data sources such as devices. One common way to provide compute resources is via [Azure Functions](../azure-functions/functions-overview.md).
* An IoT hub to provide device management and IoT data stream capabilities.
* Downstream services to handle tasks such as workflow integration (like [Logic Apps](../logic-apps/logic-apps-overview.md), cold storage, Azure Data Explorer, time series integration, or analytics).

The following diagram shows where Azure Digital Twins lies in the context of a larger Azure IoT solution.

:::image type="content" source="media/overview/solution-context.png" alt-text="Diagram showing input sources, output services, and two-way communication with both client apps and external compute resources." border="false" lightbox="media/overview/solution-context.png":::

## Service limits

You can read about the **service limits** of Azure Digital Twins in the [Azure Digital Twins service limits article](reference-service-limits.md). This can be useful while working with the service to understand the service's functional and rate limitations, as well as which limits can be adjusted if necessary.

## Terminology

You can view a list of **common IoT terms** and their uses across the Azure IoT services, including Azure Digital Twins, in the [Azure IoT Glossary](../iot-fundamentals/iot-glossary.md?toc=/azure/digital-twins/toc.json&bc=/azure/digital-twins/breadcrumb/toc.json). This resource may be a useful reference while you get started with Azure Digital Twins and building an IoT solution.

## Next steps

* Dive into working with Azure Digital Twins in [Get started with Azure Digital Twins Explorer](quickstart-azure-digital-twins-explorer.md).

* Or, start reading about Azure Digital Twins concepts with [Custom models](concepts-models.md).