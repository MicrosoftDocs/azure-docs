<properties
 pageTitle="Developer guide topics for IoT Hub | Microsoft Azure"
 description="Azure IoT Hub developer guide that includes IoT Hub endpoints, security, device identity registry, and messaging"
 services="iot-hub"
 documentationCenter=".net"
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="05/29/2016" 
 ms.author="dobett"/>

# Azure IoT Hub developer guide

Azure IoT Hub is a fully managed service that helps enable reliable and secure bi-directional communications between millions of IoT devices and an application back end.

Azure IoT Hub helps to provide:

* Secure communications by using per-device security credentials and access control.
* Reliable device-to-cloud and cloud-to-device hyper-scale messaging.
* Easy device connectivity with device libraries for the most popular languages and platforms.

This article covers the following topics:

- [Endpoints](#endpoints). This section describes the various endpoints that each IoT hub exposes for runtime and management operations.
- [Device identity registry](#device-identity-registry). This section describes what information each IoT hub's device identity registry stores, and how you can access and modify it.
- [Security](#security). This section describes the security model used to grant access to IoT Hub functionality for both devices and cloud components.
- [Messaging](#messaging). This section describes the messaging features (device-to-cloud and cloud-to-device) that IoT Hub exposes.
- [Quotas and throttling](#throttling). This section summarizes the quotas that apply to your use of IoT Hub.

## Endpoints <a id="endpoints"></a>

Azure IoT Hub is a multi-tenant service that exposes its functionality to a variety of actors. The following diagram shows the various endpoints that IoT Hub exposes.

![IoT Hub endpoints][img-endpoints]

The following is a description of the endpoints:

* **Resource provider**. The IoT Hub resource provider exposes an [Azure Resource Manager][lnk-arm] interface that enables Azure subscription owners to create and delete IoT hubs, and update IoT hub properties. IoT Hub properties govern hub-level security policies, as opposed to device-level access control (see the section [Access Control](#accesscontrol) later in this article), and functional options for cloud-to-device and device-to-cloud messaging. The resource provider also enables you to [export device identities](#importexport).
* **Device identity management**. Each IoT hub exposes a set of HTTP REST endpoints to manage device identities (create, retrieve, update, and delete). Device identities are used for device authentication and access control. For more information, see [Device identity registry](#device-identity-registry).
* **Device endpoints**. For each device provisioned in the device identity registry, IoT Hub exposes a set of endpoints that a device can use to send and receive messages:
    - *Send device-to-cloud messages*. Use this endpoint to send device-to-cloud messages. For more information, see [Device to cloud messaging](#d2c).
    - *Receive cloud-to-device messages*. A device uses this endpoint to receive targeted cloud-to-device messages. For more information, see [Cloud to device messaging](#c2d).
    - *Initiate file uploads*. A device uses this endpoint to receive an Azure Storage SAS URI from IoT Hub in order to upload a file. For more information, see [File uploads](#fileupload). 

    These endpoints are exposed using HTTP 1.1, [MQTT v3.1.1][lnk-mqtt], and [AMQP 1.0][lnk-amqp] protocols. Note that AMQP is also available over [WebSockets][lnk-websockets] on port 443.
* **Service endpoints**. Each IoT hub exposes a set of endpoints your application back end can use to communicate with your devices. These endpoints are currently only exposed using the [AMQP][lnk-amqp] protocol.
    - *Receive device-to-cloud messages*. This endpoint is compatible with [Azure Event Hubs][lnk-event-hubs]. A back-end service can use it to read all the device-to-cloud messages sent by your devices. For more information, see [Device to cloud messaging](#d2c).
    - *Send cloud-to-device messages and receive delivery acknowledgments*. These endpoints enable your application back end to send reliable cloud-to-device messages, and to receive the corresponding delivery or expiration acknowledgments. For more information, see [Cloud to device messaging](#c2d).
    - *Receive file notifications*. This messaging endpoint allows you to receive notifications of when your devices successfully upload a file. 

The [IoT Hub APIs and SDKs][lnk-sdks] article describes the various ways to access these endpoints.

Finally, it is important to note that all IoT Hub endpoints use the [TLS][lnk-tls] protocol, and no endpoint is ever exposed on unencrypted/unsecured channels.

### How to read from Event Hubs-compatible endpoints <a id="eventhubcompatible"></a>

When you use the [Azure Service Bus SDK for .NET][lnk-servicebus-sdk] or the [Event Hubs - Event Processor Host][lnk-eventprocessorhost], you can use any IoT Hub connection strings with the correct permissions, and then use **messages/events** as the Event Hub name.

When you use SDKs (or product integrations) that are unaware of IoT Hub, you must retrieve an Event Hubs-compatible endpoint and Event Hub name from the IoT Hub settings in the [Azure portal][lnk-management-portal]:

1. In the IoT hub blade, click **Settings** > **Messaging**.
2. In the **Device-to-cloud settings** section, you'll find the following values: **Event Hub-compatible endpoint**, **Event Hub-compatible name**, and **Partitions**.

    ![Device-to-cloud settings][img-eventhubcompatible]

> [AZURE.NOTE] If the SDK requires a **Hostname** or **Namespace** value, remove the scheme from the **Event Hub-compatible endpoint**. For example, if your Event Hub-compatible endpoint is **sb://iothub-ns-myiothub-1234.servicebus.windows.net/**, the **Hostname** would be **iothub-ns-myiothub-1234.servicebus.windows.net**, and the **Namespace** would be **iothub-ns-myiothub-1234**.

You can then use any shared access security policy that has the **ServiceConnect** permissions to connect to the specified Event Hub.

If you need to build an Event Hub connection string by using the previous information, use the following pattern:

```
Endpoint={Event Hub-compatible endpoint};SharedAccessKeyName={iot hub policy name};SharedAccessKey={iot hub policy key}
```

The following is a list of SDKs and integrations that you can use with Event Hub-compatible endpoints that IoT Hub exposes:

* [Java Event Hubs client](https://github.com/hdinsight/eventhubs-client)
* [Apache Storm spout](../hdinsight/hdinsight-storm-develop-csharp-event-hub-topology.md). You can view the [spout source](https://github.com/apache/storm/tree/master/external/storm-eventhubs) on GitHub.
* [Apache Spark integration](../hdinsight/hdinsight-apache-spark-eventhub-streaming.md)

## Device identity registry

Each IoT hub has a device identity registry. You can use this registry to create per-device resources in the service, such as a queue that contains in-flight cloud-to-device messages. You can also use the registry to allow access to the device-facing endpoints, as explained in the [Access Control](#accesscontrol) section.

At a high level, the device identity registry is a REST-capable collection of device identity resources. The following sections detail the device identity resource properties, and the operations the registry enables on the identities.

> [AZURE.NOTE] For more details about the HTTP protocol and the SDKs that you can use to interact with the device identity registry, see [IoT Hub APIs and SDKs][lnk-sdks].

### Device identity properties <a id="deviceproperties"></a>

Device identities are represented as JSON documents with the following properties.

| Property | Options | Description |
| -------- | ------- | ----------- |
| deviceId | required, read-only on updates | A case-sensitive string (up to 128 characters long) of ASCII 7-bit alphanumeric characters + `{'-', ':', '.', '+', '%', '_', '#', '*', '?', '!', '(', ')', ',', '=', '@', ';', '$', '''}`. |
| generationId | required, read-only | A hub-generated, case-sensitive string up to 128 characters long. This is used to distinguish devices with the same **deviceId**, when they have been deleted and re-created. |
| etag | required, read-only | A string representing a weak etag for the device identity, as per [RFC7232][lnk-rfc7232].|
| auth | optional | A composite object containing authentication information and security materials. |
| auth.symkey | optional | A composite object containing a primary and a secondary key, stored in base64 format. |
| status | required | An access indicator. Can be **Enabled** or **Disabled**. If **Enabled**, the device is allowed to connect. If **Disabled**, this device cannot access any device-facing endpoint. |
| statusReason | optional | A 128 character-long string that stores the reason for the device identity status. All UTF-8 characters are allowed. |
| statusUpdateTime | read-only | A temporal indicator, showing the date and time of the last status update. |
| connectionState | read-only | A field indicating connection status: either **Connected** or **Disconnected**. This field represents the IoT Hub view of the device connection status. **Important**: This field should be used only for development/debugging purposes. The connection state is updated only for devices using AMQP or MQTT. Also, it is based on protocol-level pings (MQTT pings, or AMQP pings), and it can have a maximum delay of only 5 minutes. For these reasons, there can be false positives, such as devices reported as connected but that are actually disconnected. |
| connectionStateUpdatedTime | read-only | A temporal indicator, showing the date and last time the connection state was updated. |
| lastActivityTime  | read-only | A temporal indicator, showing the date and last time the device connected, received, or sent a message. |

> [AZURE.NOTE] Connection state can only represent the IoT Hub view of the status of the connection. Updates to this state may be delayed, depending on network conditions and configurations.

### Device identity operations

The IoT Hub device identity registry exposes the following operations:

* Create device identity
* Update device identity
* Retrieve device identity by ID
* Delete device identity
* List up to 1000 identities
* Export all identities to blob storage
* Import identities from blob storage

All these operations allow the use of optimistic concurrency, as specified in [RFC7232][lnk-rfc7232].

> [AZURE.IMPORTANT] The only way to retrieve all identities in a hub's identity registry is to use the [Export](#importexport) functionality.

An IoT Hub device identity registry:

- Does not contain any application metadata.
- Can be accessed like a dictionary, by using the **deviceId** as the key.
- Does not support expressive queries.

An IoT solution typically has a separate solution-specific store that contains application-specific metadata. For example, the solution-specific store in a smart building solution would record the room in which a temperature sensor is deployed.

> [AZURE.IMPORTANT] You should only use the device identity registry for device management and provisioning operations. High throughput operations at run time should not depend on performing operations in the device identity registry. For example, checking the connection state of a device before sending a command is not a supported pattern. Make sure to check the [throttling rates](#throttling) for the device identity registry, and the [device heartbeat][lnk-guidance-heartbeat] pattern.

### Disabling devices

You can disable devices by updating the **status** property of an identity in the registry. Typically, you use this in two scenarios:

- During a provisioning orchestration process. For more information, see [Design your solution - Device Provisioning][lnk-guidance-provisioning].
- If, for any reason, you consider a device is compromised or has become unauthorized.

### Import and export device identities <a id="importexport"></a>

You can export device identities in bulk from an IoT hub's identity registry, by using asynchronous operations on the [IoT Hub Resource Provider endpoint](#endpoints). Exports are long-running jobs that use a customer-supplied blob container to save device identity data read from the identity registry.

You can import device identities in bulk to an IoT hub's identity registry, by using asynchronous operations on the [IoT Hub Resource Provider endpoint](#endpoints). Imports are long-running jobs that use data in a customer-supplied blob container to write device identity data into the device identity registry.

- For detailed information about the import and export APIs, see [Azure IoT Hub - Resource Provider APIs][lnk-resource-provider-apis].
- To learn more about running import and export jobs, see [Bulk management of IoT Hub device identities][lnk-bulk-identity].

## Security <a id="security"></a>

This section describes the options for securing Azure IoT Hub.

### Access control <a id="accesscontrol"></a>

IoT Hub uses the following set of *permissions* to grant access to each IoT hub's endpoints. Permissions limit the access to an IoT hub based on functionality.

* **RegistryRead**. Grants read access to the device identity registry. For more information, see [Device identity registry](#device-identity-registry).
* **RegistryReadWrite**. Grants read and write access to the device identity registry. For more information, see [Device identity registry](#device-identity-registry).
* **ServiceConnect**. Grants access to cloud service-facing communication and monitoring endpoints. For example, it grants permission to back-end cloud services to receive device-to-cloud messages, send cloud-to-device messages, and retrieve the corresponding delivery acknowledgments.
* **DeviceConnect**. Grants access to device-facing communication endpoints. For example, it grants permission to send device-to-cloud messages and receive cloud-to-device messages. This permission is used by devices.

You can grant permissions in the following ways:

* **Hub-level shared access policies**. Shared access policies can grant any combination of the permissions listed in the previous section. You can define policies in the [Azure portal][lnk-management-portal], or programmatically by using the [Azure IoT Hub Resource provider APIs][lnk-resource-provider-apis]. A newly created IoT hub has the following default policies:

    - **iothubowner**: Policy with all permissions.
    - **service**: Policy with ServiceConnect permission.
    - **device**: Policy with DeviceConnect permission.
    - **registryRead**: Policy with RegistryRead permission.
    - **registryReadWrite**: Policy with RegistryRead and RegistryWrite permissions.


* **Per-device security credentials**. Each IoT Hub contains a [device identity registry](#device-identity-registry). For each device in this registry, you can configure security credentials that grant **DeviceConnect** permissions scoped to the corresponding device endpoints.

For example, in a typical IoT solution:
- The device management component uses the *registryReadWrite* policy.
- The event processor component uses the *service* policy.
- The runtime device business logic component uses the *service* policy.
- Individual devices connect using credentials stored in the IoT hub's identity registry.

For guidance on IoT Hub security topics, see the security section in [Design your solution][lnk-guidance-security].

### Authentication

Azure IoT Hub grants access to endpoints by verifying a token against the shared access policies and device identity registry security credentials.

Security credentials, such as symmetric keys, are never sent over the wire.

> [AZURE.NOTE] The Azure IoT Hub resource provider is secured through your Azure subscription, as are all providers in the [Azure Resource Manager][lnk-azure-resource-manager].

For more information about how to construct and use security tokens, see [IoT Hub security tokens][lnk-sas-tokens].

#### Protocol specifics

Each supported protocol, such as AMQP, MQTT, and HTTP, transports tokens in different ways.


HTTP implements authentication by including a valid token in the **Authorization** request header.


When using [AMQP][lnk-amqp], IoT Hub supports [SASL PLAIN][lnk-sasl-plain] and [AMQP Claims-Based-Security][lnk-cbs].

In the case of AMQP claims-based-security, the standard specifies how to transmit these tokens.

For SASL PLAIN, the **username** can be:

* `{policyName}@sas.root.{iothubName}` in the case of hub-level tokens.
* `{deviceId}` in the case of device-scoped tokens.

In both cases, the password field contains the token, as described in the [IoT Hub security tokens][lnk-sas-tokens] article.

When using MQTT, the CONNECT packet has the deviceId as the ClientId, {iothubhostname}/{deviceId} in the Username field, and a SAS token in the Password field. {iothubhostname} should be the full CName of the IoT hub (for example, contoso.azure-devices.net).

##### Example: #####

Username (DeviceId is case sensitive):
`iothubname.azure-devices.net/DeviceId`

Password (Generate SAS with Device Explorer): `SharedAccessSignature sr=iothubname.azure-devices.net%2fdevices%2fDeviceId&sig=kPszxZZZZZZZZZZZZZZZZZAhLT%2bV7o%3d&se=1487709501`

> [AZURE.NOTE] The [Azure IoT Hub SDKs][lnk-sdks] automatically generate tokens when connecting to the service. In some cases, the SDKs do not support all the protocols or all the authentication methods.

#### Special considerations for SASL PLAIN

When using SASL PLAIN, a client connecting to an IoT hub can use a single token for each TCP connection. When the token expires, the TCP connection disconnects from the service and triggers a reconnect. This behavior, while not problematic for an application back-end component, is very damaging for a device-side application for the following reasons:

*  Gateways usually connect on behalf of many devices. When using SASL PLAIN, they have to create a distinct TCP connection for each device connecting to an IoT hub. This considerably increases the consumption of power and networking resources, and increases the latency of each device connection.
* Resource-constrained devices are adversely affected by the increased use of resources to reconnect after each token expiration.

### Scope hub-level credentials

You can scope hub-level security policies by creating tokens with a restricted resource URI. For example, the endpoint to send device-to-cloud messages from a device is **/devices/{deviceId}/messages/events**. You can also use a hub-level shared access policy with **DeviceConnect** permissions to sign a token whose resourceURI is **/devices/{deviceId}**. This creates a token that is only usable to send devices on behalf of device **deviceId**.

This mechanism is similar to the [Event Hubs publisher policy][lnk-event-hubs-publisher-policy], and enables you to implement custom authentication methods. For more information, see the security section of [Design your solution][lnk-guidance-security].

## Messaging

IoT Hub provides messaging primitives to communicate:

- [Cloud-to-device](#c2d) from an application back end (*service* or *cloud*).
- [Device-to-cloud](#d2c) from a device to an application back end.
- [File uploads](#fileupload) from a device to an associated Azure Storage account. 

Core properties of IoT Hub messaging functionality are the reliability and durability of messages. This enables resilience to intermittent connectivity on the device side, and to load spikes in event processing on the cloud side. IoT Hub implements *at least once* delivery guarantees for both device-to-cloud and cloud-to-device messaging.

IoT Hub supports multiple device-facing protocols (such as MQTT, AMQP, and HTTP). In order to support seamless interoperability across protocols, IoT Hub defines a common message format that all device-facing protocols support.

### Message format <a id="messageformat"></a>

IoT Hub messages comprise:

* A set of *system properties*. These are properties that IoT Hub interprets or sets. This set is predetermined.
* A set of *application properties*. This is a dictionary of string properties that the application can define and access, without needing to deserialize the message body. IoT Hub never modifies these properties.
* An opaque binary body.

For more information about how the message is encoded in different protocols, see [IoT Hub APIs and SDKs][lnk-sdks].

This is the set of system properties in IoT Hub messages.

| Property | Description |
| -------- | ----------- |
| MessageId | A user-settable identifier for the message, usually used for request-reply patterns. Format: A case-sensitive string (up to 128 characters long) of ASCII 7-bit alphanumeric characters + `{'-', ':',’.', '+', '%', '_', '#', '*', '?', '!', '(', ')', ',', '=', '@', ';', '$', '''}`. |
| Sequence number | A number (unique per device-queue) assigned by IoT Hub to each cloud-to-device message. |
| To | A destination specified in [Cloud-to-Device](#c2d) messages. |
| ExpiryTimeUtc | Date and time of message expiration. |
| EnqueuedTime | Date and time the message was received by IoT Hub. |
| CorrelationId | A string property in a response message that typically contains the MessageId of the request, in request-reply patterns. |
| UserId | An ID used to specify the origin of messages. When messages are generated by IoT Hub, it is set to `{iot hub name}`. |
| Ack | A feedback message generator. This property is used in cloud-to-device messages to request IoT Hub to generate feedback messages as a result of the consumption of the message by the device. Possible values:   **none** (default): no feedback message is generated, **positive**: receive a feedback message if the message was completed, **negative**: receive a feedback message if the message expired (or maximum delivery count was reached) without being completed by the device, or **full**: both positive and negative. For more information, see [Message feedback](#feedback). |
| ConnectionDeviceId | An ID set by IoT Hub on device-to-cloud messages. It contains the **deviceId** of the device that sent the message. |
| ConnectionDeviceGenerationId | An ID set by IoT Hub on device-to-cloud messages. It contains the **generationId** (as per [Device identity properties](#deviceproperties)) of the device that sent the message. |
| ConnectionAuthMethod | An authentication method set by IoT Hub on device-to-cloud messages. This property contains information about the authentication method used to authenticate the device sending the message. For more information, see [Device to cloud anti-spoofing](#antispoofing).|

### Choose your communication protocol <a id="amqpvshttp"></a>

Iot Hub supports [AMQP][lnk-amqp], AMQP over WebSockets, MQTT, and HTTP/1 protocols for device-side communications. Consider the following regarding their uses.

* **Cloud-to-device pattern**. HTTP/1 does not have an efficient way to implement server push. As such, when you are using HTTP/1, devices poll IoT Hub for cloud-to-device messages. This is very inefficient for both the device and IoT Hub. Under current HTTP/1 guidelines, each device polls every 25 minutes or more. On the other hand, AMQP and MQTT support server push when receiving cloud-to-device messages. They enable immediate pushes of messages from IoT Hub to the device. If delivery latency is a concern, AMQP or MQTT is the best protocol to use. For rarely connected devices, HTTP/1 works as well.
* **Field gateways**. When using HTTP/1 and MQTT, you cannot connect multiple devices (each with its own per-device credentials) using the same TLS connection. Thus, for [Field gateway scenarios][lnk-azure-gateway-guidance], these protocols are suboptimal because they require one TLS connection between the field gateway and IoT Hub for each device connected to the field gateway.
* **Low resource devices**. MQTT and HTTP/1 libraries have a smaller footprint than the AMQP libraries. As such, if the device has few resources (for example, less than 1 MB RAM), these protocols might be the only protocol implementation available.
* **Network traversal**. MQTT standard listens on port 8883. This could cause problems in networks that are closed to non-HTTP protocols. Both HTTP and AMQP (over WebSockets) are available to be used in this scenario.
* **Payload size**. AMQP and MQTT are binary protocols, which are significantly more compact than HTTP/1.

Generally, you should use AMQP (or AMQP over WebSockets) whenever possible, and only use MQTT when resource constraints prevent the use of AMQP. HTTP/1 should only be used if both network traversal and network configuration prevent the use of MQTT and AMQP. Moreover, when using HTTP/1, each device should poll for cloud-to-device messages every 25 minutes or more.

> [AZURE.NOTE] During development, it is acceptable to poll more frequently than every 25 minutes.

<a id="mqtt-support">
#### Notes on MQTT support
IoT Hub implements the MQTT v3.1.1 protocol with the following limitations and specific behavior:

  * **QoS 2 is not supported**. When a device client publishes a message with **QoS 2**, IoT Hub closes the network connection. When a device client subscribes to a topic with **QoS 2**, IoT Hub grants maximum QoS level 1 in the **SUBACK** packet.
  * **Retain messages do not persist**. If a device client publishes a message with the RETAIN flag set to 1, IoT Hub adds the **x-opt-retain** application property to the message. This means that IoT Hub does not persist the retain message, but instead passes it to the back-end application.

For more information, see [IoT Hub MQTT support][lnk-mqtt-support].

As a final consideration, you should review the [Azure IoT protocol gateway][lnk-azure-protocol-gateway]. This enables you to deploy a high performance custom protocol gateway that interfaces directly with IoT Hub. The Azure IoT protocol gateway enables you to customize the device protocol to accommodate brownfield MQTT deployments or other custom protocols. This approach does require, however, that you self-host and operate a custom protocol gateway.

### Device to cloud <a id="d2c"></a>

As detailed in the [Endpoints](#endpoints) section, device-to-cloud messages are sent through a device-facing endpoint (**/devices/{deviceId}/messages/events**). The messages are received through a service-facing endpoint (**/messages/events**) that is compatible with [Event Hubs][lnk-event-hubs]. Therefore, you can use standard Event Hubs integration and SDKs to receive device-to-cloud messages.

IoT Hub implements device-to-cloud messaging in a way that is similar to [Event Hubs][lnk-event-hubs]. IoT Hub's device-to-cloud messages are more like Event Hubs *events* than [Service Bus][lnk-servicebus] *messages*.

This implementation has the following implications:

* Similarly to Event Hubs events, device-to-cloud messages are durable and retained in an IoT hub for up to seven days (see [Device-to-cloud configuration options](#d2cconfiguration)).
* Device-to-cloud messages are partitioned across a fixed set of partitions that is set at creation time (see [Device-to-cloud configuration options](#d2cconfiguration)).
* Analogously to Event Hubs, clients reading device-to-cloud messages must handle partitions and checkpointing. See [Event Hubs - Consuming events][lnk-event-hubs-consuming-events].
* Like Event Hubs events, device-to-cloud messages can be at most 256 KB in size, and can be grouped in batches to optimize sends. Batches can be at most 256 KB, and at most 500 messages.

There are, however, a few important distinctions between IoT Hub device-to-cloud messaging and Event Hubs:

* As explained in the [Security](#security) section, IoT Hub allows per-device authentication and access control.
* IoT Hub allows millions of simultaneously connected devices (see [Quotas and throttling](#throttling)), while Event Hubs is limited to 5000 AMQP connections per namespace.
* IoT Hub does not allow arbitrary partitioning using a **PartitionKey**. Device-to-cloud messages are partitioned based on their originating **deviceId**.
* Scaling IoT Hub is slightly different than that for Event Hubs. For more information, see [Scaling IoT Hub][lnk-guidance-scale].

Note that this does not mean that you can substitute IoT Hub for Event Hubs in all scenarios. For example, in some event processing computations, it might be necessary to re-partition events with respect to a different property or field before analyzing the data streams. In this scenario, you could use an Event Hub to decouple two portions of the stream processing pipeline. For more information, see *Partitions* in [Azure Event Hubs Overview][lnk-eventhub-partitions].

For details about how to use device-to-cloud messaging, see [IoT Hub APIs and SDKs][lnk-sdks].

> [AZURE.NOTE] When using HTTP to send device-to-cloud messages, property names and values can only contain ASCII alphanumeric characters, plus ``{'!', '#', '$', '%, '&', "'", '*', '*', '+', '-', '.', '^', '_', '`', '|', '~'}``.

#### Non-telemetry traffic

In many cases, in addition to telemetry data points, devices also send messages and requests that require execution and handling from the application business logic layer. For example, critical alerts that must trigger a specific action in the back end, or device responses to commands sent from the back end.

For more information about the best way to process these kind of messages, see [Device-to-cloud processing][lnk-guidance-d2c-processing].

#### Device-to-cloud configuration options <a id="d2cconfiguration"></a>

An IoT hub exposes the following properties to enable you to control device-to-cloud messaging.

* **Partition count**. Set this property at creation to define the number of partitions for device-to-cloud event ingestion.
* **Retention time**. This property specifies the retention time for device-to-cloud messages. The default is one day, but it can be increased to seven days.

Also, analogously to Event Hubs, IoT Hub enables you to manage consumer groups on the device-to-cloud receive endpoint.

You can modify all these properties, either programmatically through the [Azure IoT Hub - Resource Provider APIs][lnk-resource-provider-apis], or by using the [Azure portal][lnk-management-portal].

#### Anti-spoofing properties <a id="antispoofing"></a>

To avoid device spoofing in device-to-cloud messages, IoT Hub stamps all messages with the following properties:

* **ConnectionDeviceId**
* **ConnectionDeviceGenerationId**
* **ConnectionAuthMethod**

The first two contain the **deviceId** and **generationId** of the originating device, as per [Device identity properties](#deviceproperties).

The **ConnectionAuthMethod** property contains a JSON serialized object, with the following properties:

```
{
  "scope": "{ hub | device}",
  "type": "{ symkey | sas}",
  "issuer": "iothub"
}
```

### Cloud to device <a id="c2d"></a>

As detailed in the [Endpoints](#endpoints) section, you can send cloud-to-device messages through a service-facing endpoint (**/messages/devicebound**). A device can receive them through a device-specific endpoint (**/devices/{deviceId}/messages/devicebound**).

Each cloud-to-device message is targeted at a single device, setting the **to** property to **/devices/{deviceId}/messages/devicebound**.

>[AZURE.IMPORTANT] Each device queue can hold at most 50 cloud-to-device messages. Trying to send more messages to the same device results in an error.

> [AZURE.NOTE] When sending cloud-to-device messages, property names and values can only contain ASCII alphanumeric characters, plus ``{'!', '#', '$', '%, '&', "'", '*', '*', '+', '-', '.', '^', '_', '`', '|', '~'}``.

#### Message lifecycle <a id="message lifecycle"></a>

In order to implement the guarantee of message delivery at least once, cloud-to-device messages are persisted in per-device queues. Devices must explicitly acknowledge *completion* in order for IoT Hub to remove them from the queue. This guarantees resiliency against connectivity and device failures.

The following diagram shows the lifecycle state graph for a cloud-to-device message.

![Cloud-to-device message lifecycle][img-lifecycle]

When the service sends a message, it is considered *Enqueued*. When a device wants to *receive* a message, IoT Hub *locks* the message (sets the state to **Invisible**) in order to allow other threads on the same device to start receiving other messages. When a device thread completes the processing of a message, it notifies IoT Hub by *completing* the message.

A device can also:

- *Reject* the message, which causes IoT Hub to set it to the **Deadlettered** state.
- *Abandon* the message, which causes IoT Hub to put the message back in the queue, with the state set to **Enqueued**.

A thread could fail to process a message without notifying IoT Hub. In this case, messages automatically transition from the **Invisible** state back to the **Enqueued** state after a *visibility (or lock) timeout*. The default value of this timeout is one minute.

A message can transition between the **Enqueued** and **Invisible** states for, at most, the number of times specified in the **max delivery count** property on IoT Hub. After that number of transitions, IoT Hub sets the state of the message to **Deadlettered**. Similarly, IoT Hub sets the state of a message to **Deadlettered** after its expiration time (see [Time to live](#ttl)).

For a tutorial on cloud-to-device messages, see [Get started with Azure IoT Hub cloud-to-device messages][lnk-getstarted-c2d-tutorial]. For reference topics on how different APIs and SDKs expose the cloud-to-device functionality, see [IoT Hub APIs and SDKs][lnk-sdks].

> [AZURE.NOTE] Typically, cloud-to-device messages complete whenever the loss of the message would not affect the application logic. For example, the message content has been successfully persisted in local storage, or an operation has been successfully executed. The message could also be carrying transient information, whose loss would not impact the functionality of the application. Sometimes, for long-running tasks, you can complete the cloud-to-device message after persisting the task description in local storage. Then you can notify the application back end with one or more device-to-cloud message at various stages of progress of the task.

#### Message expiration (time to live) <a id="ttl"></a>

Every cloud-to-device message has an expiration time. This can be explicitly set by the service (in the **ExpiryTimeUtc** property), or it is set by IoT Hub using the default *time to live* specified as an IoT Hub property. See [Cloud-to-device configuration options](#c2dconfiguration).

> [AZURE.NOTE] A common way to take advantage of message expiration is to set short time to live values, in order to avoid sending messages to disconnected devices. This achieves the same result as maintaining the device connection state, while being significantly more efficient. By requesting message acknowledgements, you can be notified by IoT Hub which devices are able to receive messages, and which are not online or have failed.

#### Message feedback <a id="feedback"></a>

When you send a cloud-to-device message, the service can request the delivery of per-message feedback regarding the final state of that message.

- If you set the **Ack** property to **positive**, IoT Hub generates a feedback message if, and only if, the cloud-to-device message reached the **Completed** state.
- If you set the **Ack** property to **negative**, IoT Hub generates a feedback message, if and only if, the cloud-to-device message reaches the **Deadletterd** state.
- If you set the **Ack** property to **full**, IoT Hub generates a feedback message in either case.

> [AZURE.NOTE] If **Ack** is **full**, and you don't receive a feedback message, it means that the feedback message expired. The service can't know what happened to the original message. In practice, a service should ensure that it can process the feedback before it expires. The maximum expiry time is two days, which allows plenty of time to get the service running again if a failure occurs.

As explained in [Endpoints](#endpoints), IoT Hub delivers feedback through a service-facing endpoint (**/messages/servicebound/feedback**) as messages. The semantics for receiving feedback are the same as those for cloud-to-device messages, and have the same [Message lifecycle](#message lifecycle). Whenever possible, message feedback is batched in a single message, with the following format.

Each message retrieved by a device from the feedback endpoint has the following properties:

| Property | Description |
| -------- | ----------- |
| EnqueuedTime | Timestamp indicating when the message was created. |
| UserId | `{iot hub name}` |
| ContentType | `application/vnd.microsoft.iothub.feedback.json` |

The body is a JSON-serialized array of records, each with the following properties:

| Property | Description |
| -------- | ----------- |
| EnqueuedTimeUtc | Timestamp indicating when the outcome of the message happened. For example, the device completed or the message expired. |
| OriginalMessageId | **MessageId** of the cloud-to-device message to which this feedback information pertains. |
| StatusCode | Required integer. Used in feedback messages generated by IoT Hub. <br/> 0 = success <br/> 1 = message expired <br/> 2 = maximum delivery count exceeded <br/> 3 = message rejected |
| Description | String values for **StatusCode**. |
| DeviceId | **DeviceId** of the target device of the cloud-to-device message to which this piece of feedback pertains. |
| DeviceGenerationId | **DeviceGenerationId** of the target device of the cloud-to-device message to which this piece of feedback pertains. |


>[AZURE.IMPORTANT] The service must specify a **MessageId** for the cloud-to-device message to be able to correlate its feedback with the original message.

The following example shows the body of a feedback message.

```
[
  {
    "OriginalMessageId": "0987654321",
    "EnqueuedTimeUtc": "2015-07-28T16:24:48.789Z",
    "StatusCode": 0
    "Description": "Success",
    "DeviceId": "123",
    "DeviceGenerationId": "abcdefghijklmnopqrstuvwxyz"
  },
  {
    ...
  },
  ...
]
```

#### Cloud-to-device configuration options <a id="c2dconfiguration"></a>

Each IoT hub exposes the following configuration options for cloud-to-device messaging.

| Property | Description | Range and default |
| -------- | ----------- | ----------------- |
| defaultTtlAsIso8601 | Default TTL for cloud-to-device messages. | ISO_8601 interval up to 2D (minimum 1 minute). Default: 1 hour. |
| maxDeliveryCount | Maximum delivery count for cloud-to-device per-device queues. | 1 to 100. Default: 10. |
| feedback.ttlAsIso8601 | Retention for service-bound feedback messages. | ISO_8601 interval up to 2D (minimum 1 minute). Default: 1 hour. |
| feedback.maxDeliveryCount | Maximum delivery count for feedback queue. | 1 to 100. Default: 100. |

For more information, see [Manage IoT hubs][lnk-portal].

### File uploads <a id="fileupload"></a>

As detailed in the [Endpoints](#endpoints) section, devices can initiate file uploads by sending a notification through a device-facing endpoint (**/devices/{deviceId}/files**).  When a device notifies IoT Hub of a completed upload, IoT Hub generates file upload notifications which you can receive through a service-facing endpoint (**/messages/servicebound/filenotifications**) as messages.

Instead of brokering messages through IoT Hub itself, IoT Hub instead acts as a dispatcher to an associated Azure Storage account. A device requests a storage token from IoT Hub that is specific to the file the device wishes to upload. The device uses the SAS URI to upload the file to storage, and when the upload is complete the device sends a notification of completion to IoT Hub. IoT Hub verifies that the file was uploaded and then adds a file upload notification to the new service-facing file notification messaging endpoint.

#### Associating an Azure Storage account with IoT Hub

To use the file upload functionality, you must first link an Azure Storage account to the IoT Hub. You can do this either through the [Azure portal][lnk-management-portal], or programmatically through the [Azure IoT Hub - Resource Provider APIs][lnk-resource-provider-apis]. Once you have associated a storage account with your IoT Hub, the service returns a SAS URI to a device when the device initiates a file upload request.

> [AZURE.NOTE] The [Azure IoT Hub SDKs][lnk-sdks] automatically handle retrieving the SAS URI, uploading the file, and notifying IoT Hub of a completed upload.

#### Initialize a file upload

IoT Hub has two REST endpoints to support file upload, one to get the SAS URI for storage and the other to notify the IoT hub of a completed upload. The device initiates the file upload process by sending a GET to the IoT hub at `{iot hub}.azure-devices.net/devices/{deviceId}/files/{filename}`. The hub returns a SAS URI specific to the file to be uploaded, as well as a correlation ID to be used once the upload is completed.

#### Notify IoT Hub of a completed file upload

The device is responsible for uploading the file to storage using the Azure Storage SDKs. Once the upload is completed, the device sends a POST to the IoT hub at `{iot hub}.azure-devices.net/devices/{deviceId}/files/notifications/{correlationId}` using the correlation ID received from the initial GET.

#### File upload notifications

When a device uploads a file and notifies IoT Hub of upload completion, the service optionally generates a notification message that contains the name and storage location of the file.

As explained in [Endpoints](#endpoints), IoT Hub delivers file upload notifications through a service-facing endpoint (**/messages/servicebound/fileuploadnotifications**) as messages. The receive semantics for file upload notifications are the same as for cloud-to-device messages and have the same [Message lifecycle](#message lifecycle). Each message retrieved from the file upload notification endpoint is a JSON record with the following properties:

| Property | Description |
| -------- | ----------- |
| EnqueuedTimeUtc | Timestamp indicating when the notification was created. |
| DeviceId | **DeviceId** of the device which uploaded the file. |
| BlobUri | URI of the uploaded file. |
| BlobName | Name of the uploaded file. |
| LastUpdatedTime | Timestamp indicating when the file was last updated. |
| BlobSizeInBytes | Size of the uploaded file. |

**Example**. This is an example body of a file upload notification message.

```
{
	"deviceId":"mydevice",
	"blobUri":"https://{storage account}.blob.core.windows.net/{container name}/mydevice/myfile.jpg",
	"blobName":"mydevice/myfile.jpg",
	"lastUpdatedTime":"2016-06-01T21:22:41+00:00",
	"blobSizeInBytes":1234,
	"enqueuedTimeUtc":"2016-06-01T21:22:43.7996883Z"
}
```

#### File upload notification configuration options <a id="c2dconfiguration"></a>

Each IoT hub exposes the following configuration options for file upload notifications:

| Property | Description | Range and default |
| -------- | ----------- | ----------------- |
| **enableFileUploadNotifications** | Controls whether or not file upload notifications are written to the file notifications endpoint. | Bool. Default: True. |
| **fileNotifications.ttlAsIso8601** | Default TTL for file upload notifications. | ISO_8601 interval up to 48H (minimum 1 minute). Default: 1 hour. |
| **fileNotifications.lockDuration** | Lock duration for the file upload notifications queue. | 5 to 300 seconds (minimum 5 seconds). Default: 60 seconds. |
| **fileNotifications.maxDeliveryCount** | Maximum delivery count for the file upload notification queue. | 1 to 100. Default: 100. |

For further information, see [Manage IoT hubs][lnk-portal].

## Quotas and throttling <a id="throttling"></a>

Each Azure subscription can have at most 10 IoT hubs.

Each IoT hub is provisioned with a certain number of units in a specific SKU (for more information, see [Azure IoT Hub Pricing][lnk-pricing]). The SKU and number of units determine the maximum daily quota of messages that you can send.

The SKU also determines the throttling limits that IoT Hub enforces on all operations.

### Operation throttles

Operation throttles are rate limitations that are applied in the minute ranges, and are intended to avoid abuse. IoT Hub tries to avoid returning errors whenever possible, but it starts returning exceptions if the throttle is violated for too long.

The following is the list of enforced throttles. Values refer to an individual hub.

| Throttle | Per-hub value |
| -------- | ------------- |
| Identity registry operations (create, retrieve, list, update, delete) | 5000/min/unit (for S3) <br/> 100/min/unit (for S1 and S2). |
| Device connections | 6000/sec/unit (for S3), 120/sec/unit (for S2), 12/sec/unit (for S1). <br/>Minimum of 100/sec. <br/> For example, two S1 units is 2\*12 = 24/sec, but you will have at least 100/sec across your units. With nine S1 units, you have 108/sec (9\*12) across your units. |
| Device-to-cloud sends | 6000/sec/unit (for S3), 120/sec/unit (for S2), 12/sec/unit (for S1). <br/>Minimum of 100/sec. <br/> For example, two S1 units is 2\*12 = 24/sec, but you will have at least 100/sec across your units. With nine S1 units, you have 108/sec (9\*12) across your units. |
| Cloud-to-device sends | 5000/min/unit (for S3), 100/min/unit (for S1 and S2). |
| Cloud-to-device receives | 50000/min/unit (for S3), 1000/min/unit (for S1 and S2). |
| File upload operations | 5000 file upload notifications/min/unit (for S3), 100 file upload notifications/min/unit (for S1 and S2). <br/> 10000 SAS URIs can be out for a storage account at one time.<br/> 10 SAS URIs/device can be out at one time. | 

It is important to clarify that the *device connections* throttle governs the rate at which new device connections can be established with an IoT hub, and not the maximum number of simultaneously connected devices. The throttle is dependent on the number of units that are provisioned for the hub.

For example, if you buy a single S1 unit, you get a throttle of 100 connections per second. This means that to connect 100,000 devices, it takes at least 1000 seconds (approximately 16 minutes). However, you can have as many simultaneously connected devices as you have devices registered in your device identity registry.

For an in-depth discussion of IoT Hub throttling behavior, see the blog post [IoT Hub throttling and you][lnk-throttle-blog].

>[AZURE.NOTE] At any given time, it is possible to increase quotas or throttle limits by increasing the number of provisioned units in an IoT hub.

>[AZURE.IMPORTANT] Identity registry operations are intended for run-time use in device management and provisioning scenarios. Reading or updating a large number of device identities is supported through [import/export jobs](#importexport).

## Next steps

Now that you've seen an overview of developing for IoT Hub, see the following to learn more:

- [File upload from devices (tutorial)][lnk-file upload]
- [Create an IoT hub programatically][lnk-create-hub]
- [Introduction to C SDK][lnk-c-sdk]
- [IoT Hub SDKs][lnk-sdks]

To further explore the capabilities of IoT Hub, see:

- [Designing your solution][lnk-design]
- [Exploring device management using the sample UI][lnk-dmui]
- [Simulating a device with the Gateway SDK][lnk-gateway]
- [Using the Azure Portal to manage IoT Hub][lnk-portal]
- [Secure your IoT solution from the ground up][lnk-securing]



[lnk-eventprocessorhost]: http://blogs.msdn.com/b/servicebus/archive/2015/01/16/event-processor-host-best-practices-part-1.aspx

[img-endpoints]: ./media/iot-hub-devguide/endpoints.png
[img-lifecycle]: ./media/iot-hub-devguide/lifecycle.png
[img-eventhubcompatible]: ./media/iot-hub-devguide/eventhubcompatible.png

[lnk-pricing]: https://azure.microsoft.com/pricing/details/iot-hub
[lnk-resource-provider-apis]: https://msdn.microsoft.com/library/mt548492.aspx

[lnk-sas-tokens]: iot-hub-sas-tokens.md
[lnk-azure-gateway-guidance]: iot-hub-guidance.md#field-gateways
[lnk-guidance-provisioning]: iot-hub-guidance.md#provisioning
[lnk-guidance-scale]: iot-hub-scaling.md
[lnk-guidance-security]: iot-hub-guidance.md#customauth
[lnk-guidance-heartbeat]: iot-hub-guidance.md#heartbeat

[lnk-azure-protocol-gateway]: iot-hub-protocol-gateway.md
[lnk-getstarted-c2d-tutorial]: iot-hub-csharp-csharp-c2d.md

[lnk-amqp]: https://www.amqp.org/
[lnk-mqtt]: http://mqtt.org/
[lnk-websockets]: https://tools.ietf.org/html/rfc6455
[lnk-arm]: ../resource-group-overview.md
[lnk-azure-resource-manager]: https://azure.microsoft.com/documentation/articles/resource-group-overview/
[lnk-cbs]: https://www.oasis-open.org/committees/download.php/50506/amqp-cbs-v1%200-wd02%202013-08-12.doc
[lnk-event-hubs-publisher-policy]: https://code.msdn.microsoft.com/Service-Bus-Event-Hub-99ce67ab
[lnk-event-hubs]: http://azure.microsoft.com/documentation/services/event-hubs/
[lnk-event-hubs-consuming-events]: ../event-hubs/event-hubs-programming-guide.md#event-consumers
[lnk-guidance-d2c-processing]: iot-hub-csharp-csharp-process-d2c.md
[lnk-management-portal]: https://portal.azure.com
[lnk-rfc7232]: https://tools.ietf.org/html/rfc7232
[lnk-sasl-plain]: http://tools.ietf.org/html/rfc4616
[lnk-servicebus]: http://azure.microsoft.com/documentation/services/service-bus/
[lnk-tls]: https://tools.ietf.org/html/rfc5246
[lnk-bulk-identity]: iot-hub-bulk-identity-mgmt.md
[lnk-eventhub-partitions]: ../event-hubs/event-hubs-overview.md#partitions
[lnk-mqtt-support]: iot-hub-mqtt-support.md
[lnk-throttle-blog]: https://azure.microsoft.com/blog/iot-hub-throttling-and-you/
[lnk-servicebus-sdk]: https://www.nuget.org/packages/WindowsAzure.ServiceBus

[lnk-file upload]: iot-hub-csharp-csharp-file-upload.md
[lnk-create-hub]: iot-hub-rm-template-powershell.md
[lnk-c-sdk]: iot-hub-device-sdk-c-intro.md
[lnk-sdks]: iot-hub-sdks-summary.md

[lnk-design]: iot-hub-guidance.md
[lnk-dmui]: iot-hub-device-management-ui-sample.md
[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
[lnk-portal]: iot-hub-manage-through-portal.md
[lnk-securing]: iot-hub-security-ground-up.md