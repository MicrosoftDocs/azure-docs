---
title: Introduction to Azure Event Grid
description: This article introduces you to Azure Event Grid, and provides details about the service's HTTP and Message Queuing Telemetry Transport (MQTT) messaging capabilities. 
ms.topic: overview
author: robece
ms.author: robece
ms.custom:
  - references_regions
  - build-2024
ms.date: 02/04/2025
# Customer intent: As an architect or a developer, I want to know what Azure Event Grid is and how it can help me with creating event-driven applications. 
---

# What is Azure Event Grid?
Azure Event Grid is a highly scalable, fully managed Pub Sub message distribution service that offers flexible message consumption patterns using the MQTT and HTTP protocols. With Azure Event Grid, you can build data pipelines with device data, integrate applications, and build event-driven serverless architectures. 

Event Grid enables clients to publish and subscribe to messages over the MQTT v3.1.1 and v5.0 protocols to support Internet of Things (IoT) solutions. Through HTTP, Event Grid enables you to build event-driven solutions where a publisher service announces its system state changes (events) to subscriber applications. Event Grid can be configured to send events to subscribers (push delivery) or subscribers can connect to Event Grid to read events (pull delivery). Event Grid supports [CloudEvents 1.0](https://github.com/cloudevents/spec) specification to provide interoperability across systems. 

:::image type="content" source="media/overview/general-event-grid.png" alt-text="High-level diagram of Event Grid that shows publishers and subscribers using MQTT and HTTP protocols." lightbox="media/overview/general-event-grid-high-res.png"  border="false":::

## Core features
Here are the two main features of Azure Event Grid:  

**MQTT messaging**. IoT devices and applications can communicate with each other over MQTT. Event Grid can also be used to route MQTT messages to Azure services or custom endpoints for further data analysis, visualization, or storage. This integration with Azure services enables you to build data pipelines that start with data ingestion from your IoT devices.

**Data distribution using push and pull delivery modes**. At any point in a data pipeline, HTTP applications can consume messages using push or pull APIs. The source of the data might include MQTT clients’ data, but also includes the following data sources that send their events over HTTP:

- Azure services
- Your custom applications
- External partner (SaaS) systems

Event Grid's push delivery mechanism sends data to destinations that include your own application webhooks and Azure services. Let's look at these two features in detail: 

## MQTT messaging 
Event Grid enables your clients to communicate on [custom MQTT topic names](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901107) using a publish-subscribe messaging model. Event Grid supports clients that publish and subscribe to messages over MQTT v3.1.1, MQTT v3.1.1 over WebSockets, MQTT v5, and MQTT v5 over WebSockets. Event Grid allows you to send MQTT messages to the cloud for data analysis, storage, and visualizations, among other use cases.

Event Grid integrates with [Azure IoT Operations](../iot-operations/manage-mqtt-broker/overview-broker.md) to bridge its MQTT broker capability on the edge with Event Grid’s MQTT broker capability in the cloud. Azure IoT MQTT broker is a new distributed MQTT broker for edge computing, running on Arc enabled Kubernetes clusters. It's now available in [public preview](../iot-operations/manage-mqtt-broker/overview-broker.md) as part of Azure IoT Operations.

The MQTT broker feature in Azure Event Grid is ideal for the implementation of automotive and mobility scenarios, among others. See [the reference architecture](mqtt-automotive-connectivity-and-data-solution.md) to learn how to build secure and scalable solutions for connecting millions of vehicles to the cloud, using Azure’s messaging and data analytics services.

:::image type="content" source="media/overview/mqtt-messaging.png" alt-text="High-level diagram of Event Grid that shows bidirectional MQTT communication with publisher and subscriber clients." lightbox="media/overview/mqtt-messaging-high-res.png" border="false":::

Here are some highlights of MQTT messaging support in Azure Event Grid: 

- [MQTT v3.1.1 and MQTT v5.0](mqtt-publish-and-subscribe-portal.md) support – Use any open source MQTT client library to communicate with the service.
- Custom topics with wildcards support - Use your own topic structure.
- Publish-subscribe messaging model - Communicate efficiently using one-to-many, many-to-one, and one-to-one messaging patterns.
- [Built-in cloud integration](mqtt-routing.md) - Route your MQTT messages to Azure services or custom webhooks for further processing.
- Flexible and fine-grained [access control model](mqtt-access-control.md) - Group clients and topic to simplify access control management, and use the variable support in topic templates for a fine-grained access control.
- MQTT broker authentication methods - [X.509 certificate authentication](mqtt-client-authentication.md) is the industry authentication standard in IoT devices, [Microsoft Entra IDauthentication](mqtt-client-microsoft-entra-token-and-rbac.md) is Azure's authentication standard for applications and [OAuth 2.0 (JSON Web Token) authentication](oauth-json-web-token-authentication.md) provides a lightweight, secure, and flexible option for MQTT clients that aren't provisioned in Azure.
- Transport Layer Security (TLS) 1.2 and TLS 1.3 support - Secure your client communication using robust encryption protocols.
- Multi-session support - Connect your applications with multiple active sessions to ensure reliability and scalability.
- MQTT over WebSockets - Enable connectivity for clients in firewall-restricted environments.
- Custom domain names - Allows users to assign their own domain names to Event Grid namespace's MQTT endpoints, enhancing security and simplifying client configuration.
- Client Life Cycle events - Allow applications to react to events about the client connection status or the client resource operations.


For more information about MQTT broker, see the following articles: 

- [Overview](mqtt-overview.md) 
- [Publish and subscribe to MQTT messages](mqtt-publish-and-subscribe-portal.md)
- [Tutorial: Route MQTT messages to Azure Event Hubs using namespace topics](mqtt-routing-to-event-hubs-portal-namespace-topics.md)
- [Tutorial: Route MQTT messages to Azure Functions using custom topics](mqtt-routing-to-azure-functions-portal.md)

## Event messaging (HTTP)
Event Grid supports push and pull event delivery using HTTP. With **push delivery**, you define a destination in an event subscription, to which Event Grid sends events. With **pull delivery**, subscriber applications connect to Event Grid to consume events. Pull delivery is supported for topics in an Event Grid namespace. 

:::image type="content" source="./includes/media/differences-between-consumption-modes/push-pull-delivery-mechanism.png" alt-text="High-level diagram showing push delivery and pull delivery with the kind of resources involved." lightbox="./includes/media/differences-between-consumption-modes/push-pull-delivery-mechanism.png" border="false":::

### Event handlers
In the push delivery, an event subscription is a generic configuration resource that allows you to define the event handler or destination to which events are sent using push delivery. For example, you can send data to a Webhook, Azure Function, or Event Hubs. For a complete list of event handlers supported, see:

- [Event handlers](namespace-topics-event-handlers.md) supported on namespace topics.
- [Event handlers](event-handlers.md) supported on custom, system, domain, and partner topics.

### Push delivery vs. pull delivery

The following are general guidelines to help you decide when to use pull or push delivery.

#### Pull delivery

- You need full control as to when to receive events. For example, your application might not be up all the time, not stable enough, or you process data at certain times.
- You need full control over event consumption. For example, a downstream service or layer in your consumer application has a problem that prevents you from processing events. In that case, the pull delivery API allows the consumer app to release an already read event back to the broker so that it can be delivered later.
- You want to use [private links](../private-link/private-endpoint-overview.md) when receiving events, which is possible only with the pull delivery, not the push delivery.
- You don't have the ability to expose an endpoint and use push delivery, but you can connect to Event Grid to consume events.

#### Push delivery

- You want to avoid constant polling to determine that a system state change occurred. You rather use Event Grid to send events to you at the time state changes happen.
- You have an application that can't make outbound calls. For example, your organization might be concerned about data exfiltration. However, your application can receive events through a public endpoint.

Here are some highlights of HTTP model: 

- Flexible event consumption model – when using HTTP, consume events using pull or push delivery mode.
- System events – Get up and running quickly with built-in Azure service events.
- Your own application events - Use Event Grid to route, filter, and reliably deliver custom events from your app.
- Partner events – Subscribe to your partner SaaS provider events and process them on Azure.
- Advanced filtering – Filter on event type or other event attributes to make sure your event handlers or consumer apps receive only relevant events.
- Reliability – Push delivery features a 24-hour retry mechanism with exponential backoff to make sure events are delivered. If you use pull delivery, your application has full control over event consumption.
- High throughput - Build high-volume integrated solutions with Event Grid.
- Custom domain names - Allows users to assign their own domain names to Event Grid namespace's HTTP endpoints, enhancing security and simplifying client configuration.

For more information, see the following articles: 

- [Pull delivery overview](pull-delivery-overview.md).
- [Push delivery overview](push-delivery-overview.md).
- [Concepts](concepts.md)
- Quickstart: [Publish and subscribe to app events using namespace topics](publish-events-using-namespace-topics.md).

## Use cases
For a list of use cases where you can use Azure Event Grid, see [Use cases](use-cases.md)

## Supported regions

Here's the list of regions where the new MQTT broker and namespace topics features are available:

| Region | Region | Region | Region |
| -- | -- | -- | -- | 
| Australia East | Australia South East | Australia Central |Australia Central 2 |
| Brazil South | Brazil Southeast | Canada Central | Canada East |
| Central India | Central US | East Asia | East US |
| East US 2 | West US | France Central | France South |
| Germany North | Germany West Central | Israel Central | Italy North |
| Japan East | Japan West | Korea Central | Korea South |
| Mexico Central | North Central US | North Europe | Norway East |
| Poland Central | South Africa West | South Africa North | South Central US |
| South India | Southeast Asia | Spain Central | Sweden Central |
| Sweden South | Switzerland North | Switzerland West | UAE North |
| UAE Central | UK South | UK West | West Europe |
| West US 2 | West US 3 | West Central US |
 

## Related content

- [MQTT messaging overview](mqtt-overview.md) 
- [HTTP pull delivery overview](pull-delivery-overview.md).
- [HTTP push delivery overview](push-delivery-overview.md).
