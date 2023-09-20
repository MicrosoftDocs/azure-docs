---
ms.date: 05/24/2023
author: jfggdl
ms.author: jafernan
title: Overview
description: Learn about Event Grid's http and MQTT messaging capabilities.
ms.topic: conceptual
ms.custom: references_regions
---

# What is Azure Event Grid?
Azure Event Grid is a highly scalable, fully managed Pub Sub message distribution service that offers flexible message consumption patterns using the MQTT and HTTP protocols. With Azure Event Grid, you can build data pipelines with device data, integrate applications, and build event-driven serverless architectures. Event Grid enables clients to publish and subscribe to messages over the MQTT v3.1.1 and v5.0 protocols to support Internet of Things (IoT) solutions. Through HTTP, Event Grid enables you to build event-driven solutions where a publisher service announces its system state changes (events) to subscriber applications. Event Grid can be configured to send events to subscribers (push delivery) or subscribers can connect to Event Grid to read events (pull delivery). Event Grid supports [CloudEvents 1.0](https://github.com/cloudevents/spec) specification to provide interoperability across systems. 

:::image type="content" source="media/overview/general-event-grid.png" alt-text="High-level diagram of Event Grid that shows publishers and subscribers using MQTT and HTTP protocols." lightbox="media/overview/general-event-grid-high-res.png"  border="false":::

Azure Event Grid is a generally available service deployed across availability zones in all regions that support them. For a list of regions supported by Event Grid, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=event-grid&regions=all).

>[!NOTE] 
>The following features have been released with our 2023-06-01-preview API:
>
>- MQTT v3.1.1 and v5.0 support (preview)
>- Pull-style event consumption using HTTP (preview)
>
>The initial regions where these features are available are: East US, Central US, South Central US, West US 2, East Asia, Southeast Asia, North Europe, West Europe, UAE North

[!INCLUDE [mqtt-pull-preview-note](./includes/mqtt-pull-preview-note.md)]

## Overview

Azure Event Grid is used at different stages of data pipelines to achieve a diverse set of integration goals. 

**MQTT messaging (preview)**. IoT devices and applications can communicate with each other over MQTT. Event Grid can also be used to route MQTT messages to Azure services or custom endpoints for further data analysis, visualization, or storage. This integration with Azure services enables you to build data pipelines that start with data ingestion from your IoT devices.

**Data distribution using push and pull delivery (preview) modes**. At any point in a data pipeline, HTTP applications can consume messages using push or pull APIs. The source of the data may include MQTT clients’ data, but also includes the following data sources that send their events over HTTP:

- Azure services
- Your custom applications
- External partner (SaaS) systems

When configuring Event Grid for push delivery, Event Grid can send data to [destinations](event-handlers.md) that include your own application webhooks and Azure services.

## Capabilities

Event Grid offers a rich mixture of features. These features include:

### MQTT messaging (preview)

- **[MQTT v3.1.1 and MQTT v5.0](mqtt-publish-and-subscribe-portal.md)** support – use any open source MQTT client library to communicate with the service.
- **Custom topics with wildcards support** - leverage your own topic structure.
- **Publish-subscribe messaging model** - communicate efficiently using one-to-many, many-to-one, and one-to-one messaging patterns.
- **[Built-in cloud integration](mqtt-routing.md)** - route your MQTT messages to Azure services or custom webhooks for further processing.
- **Flexible and fine-grained [access control model](mqtt-access-control.md)** - group clients and topic to simplify access control management, and use the variable support in topic templates for a fine-grained access control.
- **X.509 certificate [authentication](mqtt-client-authentication.md)** - authenticate your devices the standard mechanism for device authentication in the IoT industry.
- **TLS 1.2 and TLS 1.3 support** - secure your client communication using robust encryption protocols.
- **Multi-session support** - connect your applications with multiple active sessions to ensure reliability and scalability.
- **MQTT over WebSockets** - enable connectivity for clients in firewall-restricted environments.


### Event messaging (HTTP)

- **Flexible event consumption model** – when using HTTP, consume events using pull (preview) or push delivery mode.
- **System events** – Get up and running quickly with built-in Azure service events.
- **Your own application events** - Use Event Grid to route, filter, and reliably deliver custom events from your app.
- **Partner events** – Subscribe to your partner SaaS provider events and process them on Azure.
- **Advanced filtering** – Filter on event type or other event attributes to make sure your event handlers or consumer apps receive only relevant events.
- **Reliability** – Push delivery features a 24-hour retry mechanism with exponential backoff to make sure events are delivered. Using pull delivery, your application has full control over event consumption.
- **High throughput** - Build high-volume integrated solutions with Event Grid.

## Use cases:

Event Grid supports the following use cases:

### MQTT messaging

Event Grid enables your clients to communicate on [custom MQTT topic names](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901107) using a publish-subscribe messaging model. Event Grid supports clients that publish and subscribe to messages over MQTT v3.1.1, MQTT v3.1.1 over WebSockets, MQTT v5, and MQTT v5 over WebSockets. Event Grid allows you to send MQTT messages to the cloud for data analysis, storage, and visualizations, among other use cases.

The MQTT support in Event Grid is ideal for the implementation of automotive and mobility scenarios, among others. See [the reference architecture](mqtt-automotive-connectivity-and-data-solution.md) to learn how to build secure and scalable solutions for connecting millions of vehicles to the cloud, using Azure’s messaging and data analytics services.

:::image type="content" source="media/overview/mqtt-messaging.png" alt-text="High-level diagram of Event Grid that shows bidirectional MQTT communication with publisher and subscriber clients." lightbox="media/overview/mqtt-messaging-high-res.png" border="false":::

Event Grid’s MQTT support enables you to accomplish the following scenarios.

#### Ingest IoT telemetry
:::image type="content" source="media/overview/ingest-telemetry.png" alt-text="High-level diagram of Event Grid that shows IoT clients using MQTT protocol to send messages to a cloud app." lightbox="media/overview/ingest-telemetry-high-res.png" border="false":::

Ingest telemetry using a **many-to-one messaging** pattern. For example, use Event Grid to send telemetry from multiple IoT devices to a cloud application. This pattern enables the application to offload the burden of managing the high number of connections with devices to Event Grid.

#### Command and control
:::image type="content" source="media/overview/command-control.png" alt-text="High-level diagram of Event Grid that shows a cloud application sending a command message over MQTT to a device using request and response topics." lightbox="media/overview/command-control-high-res.png" border="false":::

Control your MQTT clients using the **request-response** (one-to-one) message pattern. For example, use Event Grid to send a command from a cloud application to an IoT device. 

#### Broadcast alerts
:::image type="content" source="media/overview/broadcast-alerts.png" alt-text="High-level diagram of Event Grid that shows a cloud application sending an alert message over MQTT to several devices." lightbox="media/overview/broadcast-alerts-high-res.png" border="false":::

Broadcast alerts to a fleet of clients using the **one-to-many** messaging pattern. For example, use Event Grid to send an alert from a cloud application to multiple IoT devices. This pattern enables the application to publish only one message that the service replicates for every interested client.

#### Integrate MQTT data
:::image type="content" source="media/overview/integrate-data.png" alt-text="Diagram that shows several IoT devices sending health data over MQTT to Event Grid, then to Event Hubs, and from this service to Azure Stream Analytics." lightbox="media/overview/integrate-data-high-res.png" border="false":::

Integrate data from your MQTT clients by routing MQTT messages to Azure services and Webhooks through the [HTTP Push delivery](push-delivery-overview.md#push-delivery-1) functionality. For example, use Event Grid to route telemetry from your IoT devices to Event Hubs and then to Azure Stream Analytics to gain insights from your device telemetry.

### Push delivery of discrete events

Event Grid can be configured to send events to a diverse set of Azure services or webhooks using push event delivery. Event sources include your custom applications, Azure services, and partner (SaaS) services that publish events announcing system state changes (also known as "discrete" events). In turn, Event Grid delivers those events to configured subscribers’ destinations. 

Event Grid’s push delivery allows you to realize the following use cases.

#### Build event-driven serverless solutions
:::image type="content" source="media/overview/build-event-serverless.png" alt-text="Diagram that shows Azure Functions publishing events to Event Grid using HTTP. Event Grid then sends those events to Azure Logic Apps." lightbox="media/overview/build-event-serverless-high-res.png" border="false":::

Use Event Grid to build serverless solutions with Azure Functions Apps, Logic Apps, and API Management. Using serverless services with Event Grid affords you a level of productivity, effort economy, and integration superior to that of classical computing models where you have to procure, manage, secure, and maintain all infrastructure deployed.  

#### Receive events from Azure services
:::image type="content" source="media/overview/receive-events-azure.png" alt-text="Diagram that shows Blob Storage publishing events to Event Grid over HTTP. Event Grid sends those events to event handlers, which are either webhooks or Azure services." lightbox="media/overview/receive-events-azure-high-res.png" border="false":::

Event Grid can receive events from 20+ Azure services so that you can automate your operations. For example, you can configure Event Grid to receive an event when a new blob has been created on an Azure Storage Account so that your downstream application can read and process its content. For a list of all supported Azure services and events, see [System topics](system-topics.md).

#### Receive events from your applications
:::image type="content" source="media/overview/receive-events-apps.png" alt-text="Diagram that shows customer application publishing events to Event Grid using HTTP. Event Grid sends those events to webhooks or Azure services." lightbox="media/overview/receive-events-apps-high-res.png" border="false":::

Your own service or application publishes events to Event Grid that subscriber applications process. Event Grid features [Custom Topics](custom-topics.md) to address basic integration scenarios and [Domains](event-domains.md) to offer a simple management and routing model when you need to distribute events to hundreds or thousands of different groups.

#### Receive events from partner (SaaS providers)
:::image type="content" source="media/overview/receive-saas-providers.png" alt-text="Diagram that shows an external partner application publishing event to Event Grid using HTTP. Event Grid sends those events to webhooks or Azure services." lightbox="media/overview/receive-saas-providers-high-res.png" border="false":::

A multi-tenant SaaS provider or platform can publish their events to Event Grid through a feature called [Partner Events](partner-events-overview.md). You can [subscribe to those events](subscribe-to-partner-events.md) and automate tasks, for example. Events from the following partners are currently available:

- [Auth0](auth0-overview.md)
- [Microsoft Graph API](subscribe-to-graph-api-events.md). Through Microsoft Graph API you can get events from [Azure AD](azure-active-directory-events.md), [Microsoft Outlook](outlook-events.md), [Teams](teams-events.md), Conversations, security alerts, and Universal Print.
- [Tribal Group](subscribe-to-tribal-group-events.md)
- [SAP](subscribe-to-sap-events.md)

#### Event Handlers

An event subscription is a generic configuration resource that allows you to define the event handler or destination to which events are sent using push delivery.  The following [event handlers](event-handlers.md) are supported: 

- [Webhooks](handler-webhooks.md). Azure Automation runbooks and Logic Apps are supported via webhooks.
- [Azure functions](handler-functions.md)
- [Event Hubs](handler-event-hubs.md)
- [Service Bus queues and topics](handler-service-bus.md)
- [Relay hybrid connections](handler-relay-hybrid-connections.md)
- [Storage queues](handler-storage-queues.md)

### Pull delivery of discrete events

Azure Event Grid features [pull CloudEvents delivery](pull-delivery-overview.md#push-and-pull-delivery). Using this delivery mode, clients connect to Event Grid to read events. The following use cases can be realized using pull delivery.

#### Receive events at your own pace
:::image type="content" source="media/overview/pull-events-at-your-own-pace.png" alt-text="High-level diagram of a publisher and consumer application. The publisher sends events to Event Grid at a higher pace than the subscriber's event consumption rate." lightbox="media/overview/pull-events-at-your-own-pace-high-res.png" border="false":::

One or more clients can connect to Azure Event Grid to read messages at their own pace. Event Grid affords clients full control on events consumption. Your application can receive events at certain times of the day, for example. Your solution can also increase the rate of consumption by adding more clients that read from Event Grid.

#### Consume events over a private link
:::image type="content" source="media/overview/consume-private-link-pull-api.png" alt-text="High-level diagram of a consumer app inside a VNET reading events from Event Grid over a private endpoint inside the VNET." lightbox="media/overview/consume-private-link-pull-api-high-res.png" border="false":::

You can configure **private links** to connect to Azure Event Grid to **publish and read** CloudEvents through a [private endpoint](../private-link/private-endpoint-overview.md) in your virtual network. Traffic between your virtual network and Event Grid travels the Microsoft backbone network.

>[!Important]
> [Private links](../private-link/private-link-overview.md) are available with pull delivery, not with push delivery. You can use private links when your application connects to Event Grid to publish events or receive events, not when Event Grid connects to your webhook or Azure service to deliver events. 

## How much does Event Grid cost?

Azure Event Grid offers two tiers and uses a pay-per-use pricing model. For details on pricing, see [Azure Event Grid pricing](https://azure.microsoft.com/pricing/details/event-grid/). To learn more about the capabilities for each tier, see [Choose the right Event Grid tier](choose-right-tier.md).

## Next steps

### MQTT messaging

- [Overview](mqtt-overview.md) 
- [Publish and subscribe to MQTT messages](mqtt-publish-and-subscribe-portal.md)
- [Route MQTT messages to Event Hubs](mqtt-routing-to-event-hubs-portal.md)

### Data distribution using pull or push  delivery

- [Pull delivery overview](pull-delivery-overview.md)
- [Push delivery overview](push-delivery-overview.md)
- [Concepts](concepts.md)
- Quickstart: [Publish and subscribe to app events using namespace topics](publish-events-using-namespace-topics.md)
