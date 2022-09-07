---
# Mandatory fields.
title: Data ingress and egress
titleSuffix: Azure Digital Twins
description: Learn about the data ingress and egress requirements for integrating Azure Digital Twins with other services.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 07/01/2022
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Data ingress and egress for Azure Digital Twins

Azure Digital Twins is typically used together with other services to create flexible, connected solutions that use your data in different kinds of ways. This article covers data ingress and egress for Azure Digital Twins and Azure services that can be used to take advantage of it.

Azure Digital Twins can receive data from upstream services such as [IoT Hub](../iot-hub/about-iot-hub.md) or [Logic Apps](../logic-apps/logic-apps-overview.md), which are used to deliver telemetry and notifications. 

Azure Digital Twins can also use [event routes](concepts-route-events.md) to send data to downstream services, such as [Azure Maps](../azure-maps/about-azure-maps.md) and [Time Series Insights](../time-series-insights/overview-what-is-tsi.md), for storage, workflow integration, analytics, and more. 

## Data ingress

Azure Digital Twins can be driven with data and events from any service—[IoT Hub](../iot-hub/about-iot-hub.md), [Logic Apps](../logic-apps/logic-apps-overview.md), your own custom service, and more. This kind of data flow allows you to collect telemetry from physical devices in your environment, and process this data using the Azure Digital Twins graph in the cloud.

Instead of having a built-in IoT Hub behind the scenes, Azure Digital Twins allows you to "bring your own" IoT Hub to use with the service. You can use an existing IoT Hub you currently have in production, or deploy a new one to be used for this purpose. This functionality gives you full access to all of the device management capabilities of IoT Hub.

To ingest data from any source into Azure Digital Twins, use an [Azure function](../azure-functions/functions-overview.md). Learn more about this pattern in [Ingest telemetry from IoT Hub](how-to-ingest-iot-hub-data.md), or try it out yourself in the Azure Digital Twins [Connect an end-to-end solution](tutorial-end-to-end.md). 

You can also learn how to connect Azure Digital Twins to a Logic Apps trigger in [Integrate with Logic Apps](how-to-integrate-logic-apps.md).

## Data egress

You may want to send Azure Digital Twins data to other downstream services for storage or additional processing. 

Digital twin data can be sent to most Azure services using *endpoints*. If your destination is [Azure Data Explorer](/azure/data-explorer/data-explorer-overview), you can use *data history* instead to automatically send twin property updates to an Azure Data Explorer cluster, where they are stored as historical data and can be queried as such. The rest of this section describes these capabilities in more detail.

>[!NOTE]
>Azure Digital Twins implements *at least once* delivery for data emitted to egress services. 

### Endpoints

To send Azure Digital Twins data to most Azure services, such as [Azure Maps](../azure-maps/about-azure-maps.md), [Time Series Insights](../time-series-insights/overview-what-is-tsi.md), or [Azure Storage](../storage/common/storage-introduction.md), start by attaching the destination service to an *endpoint*. 

Endpoints can be instances of any of these Azure services:
* [Event Hubs](../event-hubs/event-hubs-about.md)
* [Event Grid](../event-grid/overview.md)
* [Service Bus](../service-bus-messaging/service-bus-messaging-overview.md)

The endpoint is attached to an Azure Digital Twins instance using management APIs or the Azure portal, and can carry data along from the instance to other listening services. For more information about Azure Digital Twins endpoints, see [Endpoints and event routes](concepts-route-events.md).

For detailed instructions on how to send Azure Digital Twins data to Azure Maps, see [Use Azure Digital Twins to update an Azure Maps indoor map](how-to-integrate-maps.md). For detailed instructions on how to send Azure Digital Twins data to Time Series Insights, see [Integrate with Time Series Insights](how-to-integrate-time-series-insights.md).

### Data history

To send twin data to [Azure Data Explorer](/azure/data-explorer/data-explorer-overview), set up a [data history connection](concepts-data-history.md) that automatically historizes digital twin property updates from your Azure Digital Twins instance to an Azure Data Explorer cluster. The data history connection requires an [event hub](../event-hubs/event-hubs-about.md), but doesn't require an explicit endpoint.

Once the data has been historized, you can query this data in Azure Data Explorer using the [Azure Digital Twins query plugin for Azure Data Explorer](concepts-data-explorer-plugin.md).

You can also use data history in combination with [Azure Synapse Analytics](../synapse-analytics/overview-what-is.md) to aggregate data from disparate sources. This can be useful in many scenarios. Here are two examples:
* Combine information technology (IT) data from ERP or CRM systems (like Dynamics 365, SAP, or Salesforce) with operational technology (OT) data from IoT devices and production management systems. For an example that illustrates how a company might combine this data, see the following blog post: [Integrating IT and OT Data with Azure Digital Twins, Azure Data Explorer, and Azure Synapse](https://techcommunity.microsoft.com/t5/internet-of-things-blog/integrating-it-and-ot-data-with-azure-digital-twins-azure-data/ba-p/3401981).
* Integrate with the Azure AI and Cognitive Services [Multivariate Anomaly Detector](../cognitive-services/anomaly-detector/overview-multivariate.md), to quickly connect your Azure Digital Twins data with a downstream AI/machine learning solution that specializes in anomaly detection. The [Azure Digital Twins Multivariate Anomaly Detection Toolkit](/samples/azure-samples/digital-twins-mvad-integration/adt-mvad-integration/) is a sample project that provides a workflow for training multiple Multivariate Anomaly Detector models for several scenario analyses, based on historical digital twin data. It then leverages the trained models to detect abnormal operations and anomalies in modeled Azure Digital Twins environments, in near real-time. 

## Next steps

Learn more about endpoints and routing events to external services:
* [Endpoints and event routes](concepts-route-events.md)

See how to set up Azure Digital Twins to ingest data from IoT Hub:
* [Ingest telemetry from IoT Hub](how-to-ingest-iot-hub-data.md)