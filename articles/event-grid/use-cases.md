---
title: Use cases for using Azure Event Grid
description: This article provides a list of use cases that show you how to use both Message Queuing Telemetry Transport (MQTT) and HTTP messaging capabilities of Event Grid. 
ms.topic: concept-article
author: robece
ms.author: robece
ms.custom:
  - references_regions
  - build-2024
ms.date: 02/04/2025
# Customer intent: As an architect or a developer, I want to know what Azure Event Grid is and how it can help me with creating event-driven applications. 
---

# Use cases
This article provides you with a few sample use cases for using Azure Event Grid. 

> [!NOTE]
> If you are new to Azure Event Grid, read through the [Azure Event Grid overview](overview.md) article before proceeding further. 

## MQTT messaging use cases
Azure Event Grid’s MQTT broker feature enables you to accomplish the following scenarios.

### Ingest IoT telemetry
:::image type="content" source="media/overview/ingest-telemetry.png" alt-text="High-level diagram of Event Grid that shows IoT clients using MQTT protocol to send messages to a cloud app." lightbox="media/overview/ingest-telemetry-high-res.png" border="false":::

Ingest telemetry using a **many-to-one messaging** pattern. For example, use Event Grid to send telemetry from multiple IoT devices to a cloud application. This pattern enables the application to offload the burden of managing the high number of connections with devices to Event Grid.

### Command and control
:::image type="content" source="media/overview/command-control.png" alt-text="High-level diagram of Event Grid that shows a cloud application sending a command message over MQTT to a device using request and response topics." lightbox="media/overview/command-control-high-res.png" border="false":::

Control your MQTT clients using the **request-response** (one-to-one) message pattern. For example, use Event Grid to send a command from a cloud application to an IoT device. 

### Broadcast alerts
:::image type="content" source="media/overview/broadcast-alerts.png" alt-text="High-level diagram of Event Grid that shows a cloud application sending an alert message over MQTT to several devices." lightbox="media/overview/broadcast-alerts-high-res.png" border="false":::

Broadcast alerts to a fleet of clients using the **one-to-many** messaging pattern. For example, use Event Grid to send an alert from a cloud application to multiple IoT devices. This pattern enables the application to publish only one message that the service replicates for every interested client.

### Integrate MQTT data
:::image type="content" source="media/overview/integrate-data.png" alt-text="Diagram that shows several IoT devices sending health data over MQTT to Event Grid." lightbox="media/overview/integrate-data-high-res.png" border="false":::

Integrate data from your MQTT clients by routing MQTT messages to Azure services and custom endpoints through [push delivery](overview.md#push-delivery) or [pull delivery](overview.md#pull-delivery). For example, use Event Grid to route telemetry from your IoT devices to Event Hubs and then to Azure Stream Analytics to gain insights from your device telemetry.

## Push delivery use cases
Event Grid’s push delivery allows you to realize the following use cases.

### Build event-driven serverless solutions
:::image type="content" source="media/overview/build-event-serverless.png" alt-text="Diagram that shows Azure Functions publishing events to Event Grid using HTTP. Event Grid then sends those events to Azure Logic Apps." lightbox="media/overview/build-event-serverless-high-res.png" border="false":::

Use Event Grid to build serverless solutions with Azure Functions Apps, Logic Apps, and API Management. Using serverless services with Event Grid affords you a level of productivity, effort economy, and integration superior to that of classical computing models where you have to procure, manage, secure, and maintain all infrastructure deployed.  

### Receive events from Azure services
:::image type="content" source="media/overview/receive-events-azure.png" alt-text="Diagram that shows Blob Storage publishing events to Event Grid over HTTP." lightbox="media/overview/receive-events-azure-high-res.png" border="false":::

Event Grid can receive events from 20+ Azure services so that you can automate your operations. For example, you can configure Event Grid to receive an event when a new blob has been created on an Azure Storage Account so that your downstream application can read and process its content. For a list of all supported Azure services and events, see [System topics](system-topics.md).

### Receive events from your applications
:::image type="content" source="media/overview/receive-events-apps.png" alt-text="Diagram that shows customer application publishing events to Event Grid using HTTP. Event Grid sends those events to webhooks or Azure services." lightbox="media/overview/receive-events-apps-high-res.png" border="false":::

Your own service or application publishes events to Event Grid that subscriber applications process. Event Grid features [Namespace Topics](concepts-event-grid-namespaces.md#namespace-topics) to address integration and routing requirements at scale with a simple resource model. You can also use [Custom Topics](custom-topics.md) to meet basic integration requirements and [Domains](event-domains.md) for a simple management and routing model when you need to distribute events to hundreds or thousands of different groups.

### Receive events from partner (SaaS providers)
:::image type="content" source="media/overview/receive-saas-providers.png" alt-text="Diagram that shows an external partner application publishing event to Event Grid using HTTP." lightbox="media/overview/receive-saas-providers-high-res.png" border="false":::

A multitenant SaaS provider or platform can publish their events to Event Grid through a feature called [Partner Events](partner-events-overview.md). You can [subscribe to those events](subscribe-to-partner-events.md) and automate tasks, for example. Events from the following partners are currently available:

- [Auth0](auth0-overview.md)
- [Microsoft Graph API](subscribe-to-graph-api-events.md). Through Microsoft Graph API you can get events from [Microsoft Entra ID](microsoft-entra-events.md), [Microsoft Outlook](outlook-events.md), [Teams](teams-events.md), Conversations, security alerts, and Universal Print.
- [Tribal Group](subscribe-to-tribal-group-events.md)
- [SAP](subscribe-to-sap-events.md)

## Pull delivery use cases
Azure Event Grid features [pull CloudEvents delivery](pull-delivery-overview.md#push-and-pull-delivery). With this delivery mode, clients connect to Event Grid to read events. The following use cases can be realized using pull delivery.

### Receive events at your own pace
:::image type="content" source="media/overview/pull-events-at-your-own-pace.png" alt-text="High-level diagram of a publisher and consumer application." lightbox="media/overview/pull-events-at-your-own-pace-high-res.png" border="false":::

One or more clients can connect to Azure Event Grid to read messages at their own pace. Event Grid affords clients full control on events consumption. Your application can receive events at certain times of the day, for example. Your solution can also increase the rate of consumption by adding more clients that read from Event Grid.

### Consume events over a private link
:::image type="content" source="media/overview/consume-private-link-pull-api.png" alt-text="High-level diagram of a consumer app inside a virtual network reading events from Event Grid over a private endpoint inside the virtual network." lightbox="media/overview/consume-private-link-pull-api-high-res.png" border="false":::

You can configure **private links** to connect to Azure Event Grid to **publish and read** CloudEvents through a [private endpoint](../private-link/private-endpoint-overview.md) in your virtual network. Traffic between your virtual network and Event Grid travels the Microsoft backbone network.

>[!Important]
> [Private links](../private-link/private-link-overview.md) are available with pull delivery, not with push delivery. You can use private links when your application connects to Event Grid to publish events or receive events, not when Event Grid connects to your webhook or Azure service to deliver events.

## Related content

- [MQTT messaging overview](mqtt-overview.md) 
- [HTTP pull delivery overview](pull-delivery-overview.md).
- [HTTP push delivery overview](push-delivery-overview.md).
