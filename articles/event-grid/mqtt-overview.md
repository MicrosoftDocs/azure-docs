---
title: MQTT (PubSub) Broker
description: Message Queuing Telemetry Transport (MQTT) PubSub broker feature in Azure Event Grid enables MQTT clients to communicate with each other and with Azure services.
ms.topic: concept-article
ms.date: 07/30/2025
author: george-guirguis
ms.author: geguirgu
ms.subservice: mqtt
# Customer intent: I want to know how Azure Event Grid supports the MQTT protocol.
ms.custom:
  - build-2025
---

# Overview of the MQTT broker feature in Azure Event Grid

Azure Event Grid enables your Message Queuing Telemetry Transport (MQTT) clients to communicate with each other and with Azure services to support your Internet of Things (IoT) solutions. You can use the Event Grid MQTT broker feature to accomplish the following scenarios. For code samples that demonstrate these scenarios, see [this repository](https://github.com/Azure-Samples/MqttApplicationSamples).

- Ingest telemetry by using a many-to-one messaging pattern. This pattern enables the application to offload the burden of managing the high number of connections with devices to Event Grid.
- Control your MQTT clients by using the request-response (one-to-one) messaging pattern. This pattern enables any client to communicate with any other client without restrictions, regardless of the clients' roles.
- Broadcast alerts to a fleet of clients by using the one-to-many messaging pattern. This pattern enables the application to publish only one message that the service replicates for every interested client.
- Integrate data from your MQTT clients by routing MQTT messages to Azure services and webhooks through the HTTP Push delivery functionality. You can use this integration with Azure services to build data pipelines that start with data ingestion from your IoT devices.

The MQTT broker is ideal for the implementation of automotive, mobility, and manufacturing scenarios, among others. To learn how to build secure and scalable solutions for connecting millions of MQTT clients to the cloud by using the Azure messaging and data analytics services, see the [automotive](/industry/mobility/architecture/automotive-messaging-data-analytics-content) and [manufacturing](/industry/manufacturing/manufacturing-data-solutions/architecture/ra-manufacturing-data-solutions) reference architectures.

:::image type="content" source="media/overview/mqtt-messaging-high-res.png" alt-text="High-level diagram of Event Grid that shows bidirectional MQTT communication with publisher and subscriber clients." border="false":::

## Key concepts

The following key concepts are involved in the Event Grid MQTT broker feature.

### MQTT

MQTT is a publish-subscribe messaging transport protocol that was designed for constrained environments. It's a popular communication standard for IoT scenarios because of efficiency, scalability, and reliability. The MQTT broker enables clients to publish and subscribe to messages over MQTT v3.1.1, MQTT v3.1.1 over WebSocket, MQTT v5, and MQTT v5 over WebSocket. The following list shows some of the feature highlights of the MQTT broker:

- MQTT v5 features:
 	- **Last Will and Testament**: Notifies your MQTT clients of the abrupt disconnections of other MQTT clients. You can use this feature to ensure predictable and reliable flow of communication among MQTT clients during unexpected disconnections.
	- **User properties**: Allows you to add custom key/value pairs in the message header to provide more context about the message. For example, include the purpose or origin of the message so that the receiver can handle the message efficiently.
	- **Request-response pattern**: Enables your clients to take advantage of the standard request-response asynchronous pattern, specifying the response topic and correlation ID in the request for the client to respond without prior configuration.
	- **Message expiry interval**: Allows you to declare to the MQTT broker when to disregard a message that's no longer relevant or valid. Examples include disregarding stale commands or alerts.
	- **Topic aliases**: Helps your clients reduce the size of the topic field, which makes the data transfer less expensive.
	- **Maximum message size**: Allows your clients to control the maximum message size that they can handle from the server.
	- **Receive maximum**: Allows your clients to control the message rate depending on their capabilities, such as processing speed or storage capabilities.
	- **Clean start and session expiry**: Enables your clients to optimize the reliability and security of the session by preserving the client's subscription information and messages for a configurable time interval.
	- **Negative acknowledgments**: Allows your clients to efficiently react to different error codes.
   	- **Server-sent disconnect packets**: Allows your clients to efficiently handle disconnects.
   	- [MQTT Retain](mqtt-retain.md): Ensures that the broker stores the last published message on a topic and automatically delivers it to any new subscribers. This feature allows devices to instantly receive the latest known state without waiting for the next update. This capability enables faster and more reliable state synchronization across IoT systems.

- MQTT v3.1.1 features:
  	- **Last Will and Testament**: Notifies your MQTT clients of the abrupt disconnections of other MQTT clients. You can use this feature to ensure predictable and reliable flow of communication among MQTT clients during unexpected disconnections.
	- **Persistent sessions**: Ensures reliability by preserving the client's subscription information and messages when a client disconnects.
	- **Quality of Service (QoS) 0 and 1**: Provides your clients with control over the efficiency and reliability of the communication.
	- [MQTT Retain](mqtt-retain.md): Ensures that the broker stores the last published message on a topic and automatically delivers it to any new subscribers. This feature allows devices to instantly receive the latest known state without waiting for the next update. This capability enables faster and more reliable state synchronization across IoT systems.

The following sections describe the current differences between features supported by the MQTT broker and the MQTT v5 specifications. QoS 2 isn't supported.

Learn more about the [MQTT broker and current limitations](mqtt-support.md).

### Publish-subscribe messaging model

The publish-subscribe messaging model provides a scalable and asynchronous communication to clients. It enables clients to offload the burden of handling a high number of connections and messages to the service. Through the publish-subscribe messaging model, your clients can communicate efficiently by using one-to-many, many-to-one, and one-to-one messaging patterns:

- **One-to-many**: Enables clients to publish only one message that the service replicates for every interested client.
- **Many-to-one**: Enables clients to offload the burden of managing the high number of connections to the MQTT broker.
- **One-to-one**: Enables any client to communicate with any other client without restrictions, regardless of the clients' roles.

### Namespace

An Event Grid namespace is a management container for the resources that support the MQTT broker functionality, along with the resources that support the [pull delivery functionality](pull-delivery-overview.md). Your MQTT client can connect to the MQTT broker and publish-subscribe to messages. The MQTT broker authenticates your clients, authorizes publish-subscribe requests, and forwards messages to interested clients. Learn more about the [namespace concept](mqtt-event-grid-namespace-terminology.md).

### Clients

Clients refer to IoT devices or applications that publish and subscribe to MQTT messages.

IoT devices are physical objects that are connected to the internet to transmit telemetry and receive commands. These devices are sensors, appliances, machines, or other objects equipped with embedded sensors and software. The sensors and software enable them to communicate and interact with each other and the environment around them. The value of IoT devices lies in their ability to provide real-time data and insights, which enables businesses and individuals to make informed decisions and improve efficiency and productivity.

IoT applications are software designed to interact with and process data from IoT devices. They typically include components such as data collection, processing, storage, visualization, and analytics. These applications enable users to monitor and control connected devices, automate tasks, and gain insights from the data generated by IoT devices.

### Client authentication

Event Grid has a client registry that stores information about the clients permitted to connect to it. Before a client can connect, there must be an entry for that client in the client registry. As a client connects to the MQTT broker, it needs to authenticate with the MQTT broker based on credentials stored in the identity registry. The MQTT broker supports the following client authentication mechanisms:

- [X.509 certificate authentication](mqtt-client-authentication.md) is the industry authentication standard in IoT devices.
- [Microsoft Entra ID authentication](mqtt-client-microsoft-entra-token-and-rbac.md) is the Azure authentication standard for applications. Learn more about [MQTT client authentication](mqtt-client-authentication.md).
- Flexible authentications:
    - [OAuth 2.0 JSON Web Token (JWT) authentication](oauth-json-web-token-authentication.md) provides a lightweight, secure, and flexible option for MQTT clients that aren't provisioned in Azure.
    - [Custom webhook authentication](authenticate-with-namespaces-using-webhook-authentication.md) allows external HTTP endpoints (webhooks) to authenticate MQTT connections dynamically. It uses the Microsoft Entra ID JWT validation to ensure secure access.

### Access control

Access control is critical for IoT scenarios considering the enormous scale of IoT environments and the unique security challenges of constrained devices. Event Grid delivers role-based access control through a flexible access control model that you can use to manage the authorization of clients to publish or subscribe to topics.

With the enormous scale of IoT environments, assigning permission for each client to each topic is incredibly tedious. The flexible access control of Event Grid tackles this scale challenge through grouping clients and topics into client groups and topic spaces. After you create client groups and topic spaces, you can configure a permission binding to grant access to a client group to either publish or subscribe to a topic space.

:::image type="content" source="media/mqtt-overview/access-control-high-res.png" alt-text="Diagram that shows the access control model of the Event Grid MQTT broker." border="false":::

Topic spaces also provide granular access control by allowing you to control the authorization of each client within a client group to publish or subscribe to its own topic. This granular access control is achieved by using variables in topic templates. Learn more about [access control](mqtt-access-control.md).

### Routing

With Event Grid, you can route your MQTT messages to Azure services or webhooks for further processing. Accordingly, you can build end-to-end solutions by using your IoT data for data analysis, storage, and visualizations, among other use cases. By using the routing configuration, you can send all of your MQTT messages from your clients to either an [Event Grid namespace topic](concepts-event-grid-namespaces.md#namespace-topics) or an [Event Grid custom topic](custom-topics.md). After the messages are in the topic, you can configure an event subscription to consume the messages from the topic. For example, with this functionality, you can use Event Grid to route telemetry from your IoT devices to Event Hubs and then to Azure Stream Analytics to gain insights from your device telemetry. Learn more about [routing](mqtt-routing.md).

:::image type="content" source="media/mqtt-overview/routing-high-res.png" alt-text="Diagram that shows MQTT message routing in Event Grid." border="false":::

### MQTT events to Microsoft Fabric eventstreams

Route MQTT messages and cloud events from an Event Grid namespace to Microsoft Fabric eventstreams for real-time analytics, storage, and visualization of IoT data.

:::image type="content" source="./media/mqtt-overview/route-mqtt-events-to-fabric.png" alt-text="Diagram that shows how MQTT events are routed to Microsoft Fabric." lightbox="./media/mqtt-overview/route-mqtt-events-to-fabric.png":::

### Edge MQTT broker integration

Event Grid integrates with [Azure IoT Operations](../iot-operations/manage-mqtt-broker/overview-broker.md) to bridge its MQTT broker capability on the edge with the Event Grid MQTT broker feature in the cloud. Azure IoT Operations provides a new distributed MQTT broker for edge computing, running on Azure Arc-enabled Kubernetes clusters. It can connect to the Event Grid MQTT broker with Microsoft Entra ID authentication by using system-assigned managed identity, which simplifies credential management. The MQTT broker provides high availability, scalability, and security for your IoT devices and applications. Learn more about [connecting the Azure IoT Operations MQTT broker to the Event Grid MQTT broker](../iot-operations/connect-to-cloud/howto-create-dataflow.md).

### MQTT client life-cycle events

Client life-cycle events allow applications to react to events about the client connection status or the client resource operations. You can keep track of your client's connection status, react with a mitigation action for client disconnections, and track the namespace that your clients are attached to during automated failovers. Learn more about [MQTT client life-cycle events](mqtt-client-life-cycle-events.md).

### Custom domain names

Custom domain names support allows users to assign their own domain names to Event Grid namespace's MQTT and HTTP endpoints, which enhances security and simplifies client configuration. This feature helps enterprises meet their security and compliance requirements and eliminates the need to modify clients already linked to the domain. Assigning a custom domain name to multiple namespaces can also help enhance availability, manage capacity, and handle cross-region client mobility. Learn more about [custom domain names](custom-domains-namespaces.md).

### MQTT Retain 

An MQTT retained message is used to store the last known good value of a topic on the broker, ensuring that new subscribers immediately receive the most recent message without waiting for the next publish. This capability is especially useful in scenarios like device state reporting, control signals, or configuration data where the latest message must always be available to clients on connect. For more information, see [MQTT Retain support in Azure Event Grid](mqtt-retain.md).

### HTTP Publish

HTTP Publish enables applications to publish MQTT messages to the Event Grid MQTT broker over a simple HTTPS `POST` request, without maintaining an active MQTT session. It's best suited for scenarios where MQTT clients aren't feasible or necessary, such as serverless functions, cloud services, or back-end applications. HTTP Publish allows event-driven architectures to inject MQTT messages reliably and securely. Common use cases include publishing device commands, alerts, or control signals from Azure Functions, Azure Logic Apps, or API integrations. For more information, see [HTTP Publish of MQTT messages in Azure Event Grid](mqtt-http-publish.md).

## Concepts

Learn more about concepts of the MQTT broker in Event Grid:

- [Terminology](mqtt-event-grid-namespace-terminology.md)
- [Client authentication](mqtt-client-authentication.md)
- [Access control](mqtt-access-control.md)
- [MQTT protocol support](mqtt-support.md)
- [Routing MQTT messages](mqtt-routing.md)
- [MQTT client life-cycle events](mqtt-client-life-cycle-events.md)

## Related content

Learn more about the MQTT broker and its main concepts:

- [Publish and subscribe to MQTT messages](mqtt-publish-and-subscribe-portal.md)
- [Tutorial: Route MQTT messages to Azure Event Hubs by using namespace topics](mqtt-routing-to-event-hubs-portal-namespace-topics.md)
- [Tutorial: Route MQTT messages to Azure Functions by using custom topics](mqtt-routing-to-azure-functions-portal.md)
