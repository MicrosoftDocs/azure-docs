<properties
 pageTitle="Developer guide topics for IoT Hub | Microsoft Azure"
 description="Azure IoT Hub developer guide that includes IoT Hub endpoints, security, device identity registry, and messaging"
 services="iot-hub"
 documentationCenter=".net"
 authors="fsautomata"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/29/2015"
 ms.author="elioda"/>

# Azure IoT Hub developer guide

Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of IoT devices and an application back-end.

Azure IoT Hub enables:

* Secure communications using per-device security credentials and access control,
* Reliable device-to-cloud and cloud-to-device hyper-scale messaging, and
* Easy device connectivity with device libraries for the most popular languages and platforms.

These are the areas covered in this document:

- [Endpoints](#endpoints). This section describes the various endpoints that each IoT hub exposes for runtime and management operations.
- [Device identity registry](#device-identity-registry). This section describes what information is stored in each IoT hub's device identity registry, and how it can be accessed and modified.
- [Security](#security). This section describes the security model for both devices and cloud components used to grant access to IoT Hub functionality.
- [Messaging](#messaging). This section describes the messaging features (device-to-cloud and cloud-to-device) that are exposed by IoT Hub.
- [Quotas and throttling](#throttling). This section summarizes the quotas that apply to your use of IoT Hub.

## Endpoints <a id="endpoints"></a>

Azure IoT Hub is a multi-tenant service, and exposes its functionalities to a variety of actors. The follwing diagram shows the various endpoints that are exposed by IoT Hub.

![IoT Hub endpoints][img-endpoints]

The following is a description of the endpoints:

* **Resource provider**: The IoT Hub resource provider exposes an [Azure Resource Manager][lnk-arm] interface that allows Azure subscription owners to create IoT hubs, update IoT hub properties, and delete IoT hubs. IoT Hub properties govern hub-level security policies (as opposed to device-level access control. See [Access Control](#accesscontrol)) and functional options for cloud-to-device and device-to-cloud messaging. The resource provider also enables you to [export device identities](#importexport).
* **Device identity management**: Each IoT hub exposes a set of HTTP REST endpoints to manage device identities (create, retrieve, update, and delete). Device identities are used for device authentication and access control. See [Device identity registry](#device-identity-registry) for more information.
* **Device endpoints**: For each device provisioned in the device identity registry, IoT Hub exposes a set of endpoints that are used to communicate to and from that device. These endpoints are currently exposed in both HTTP and [AMQP][lnk-amqp]:
    - *Send device-to-cloud messages*. This endpoint is used to send device-to-cloud messages. For more information, see [Device to cloud messaging](#d2c).
    - *Receive cloud-to-device messages*. This endpoint is used by the device to receive targeted cloud-to-device messages. For more information, see [Cloud to device messaging](#c2d).
* **Service endpoints**: Each IoT hub also exposes a set of endpoints used by your application back-end (*service*) to communicate with your devices. These endpoints are currently only exposed using the [AMQP][lnk-amqp] protocol.
    - *Receive device-to-cloud messages*. This endpoint is compatible with [Azure Event Hubs][lnk-event-hubs] and can be used to read all the device-to-cloud messages sent by your devices. For more information, see [Device to cloud messaging](#d2c).
    - *Send cloud-to-device messages and receive delivery acknowledgments*. These endpoints enable your application back-end to send cloud-to-device reliable messages, and receive the corresponding delivery or expiration acknowledgments. For more information, see [Cloud to device messaging](#c2d).

The [IoT Hub APIs and SDKs][lnk-apis-sdks] article describes the various ways that you can access these endpoints.

Finally, it is important to note that all IoT Hub endpoints are exposed over [TLS][lnk-tls], and no endpoint is ever exposed on unencrypted/unsecured channels.

### How to read from Event Hubs-compatible endpoints <a id="eventhubcompatible"></a>

When using the [Azure Service Bus SDK for .NET](https://www.nuget.org/packages/WindowsAzure.ServiceBus) or the [Event Hubs - Event Processor Host][], you can use any IoT Hub connection strings with the correct permissions, and then use `messages/events` as the Event Hub name.

When using SDKs (or product integrations) that are unaware of IoT Hub, you must retrieve an Event Hubs-compatible endpoint and Event Hub name from the IoT Hub settings in the [Azure Preview Portal][]:

1. In the IoT hub blade, click **Settings**, then **Messaging**,
2. In the **Device-to-cloud settings** section, you will find an **Event Hub-compatible endpoint**, **Event Hub-compatible name**, and **Partitions** box.

    ![][img-eventhubcompatible]

> [AZURE.NOTE] Sometimes the SDK requires a **Hostname** or **Namespace** value. In that case, remove the scheme from the **Event Hub-compatible endpoint**. For example, if your Event Hub-compatible endpoint is `sb://iothub-ns-myiothub-1234.servicebus.windows.net/`, the **Hostname** would be `iothub-ns-myiothub-1234.servicebus.windows.net`, and the **Namespace** would be `iothub-ns-myiothub-1234`.

You can then use any shared access security policy that has **ServiceConnect** permissions to connect to the specified Event Hub.

If you must build an Event Hub connection string with the previous information, you can use the following pattern:

        Endpoint={Event Hub-compatible endpoint};SharedAccessKeyName={iot hub policy name};SharedAccessKey={iot hub policy key}


The following is a list of SDKs and integration that can be used with IoT Hub:

* [Java Event Hubs client](https://github.com/hdinsight/eventhubs-client)
* [Apache Storm spout](../hdinsight/hdinsight-storm-develop-csharp-event-hub-topology.md). You can find the link to the spout source [here](https://github.com/apache/storm/tree/master/external/storm-eventhubs)
* [Apache Spark integration](../hdinsight/hdinsight-apache-spark-csharp-apache-zeppelin-eventhub-streaming.md)

## Device identity registry

Each IoT hub has a device identity registry that is used to create per-device resources in the service, such as a queue containing in-flight cloud-to-device messages, and allows access to the device-facing endpoints as explained in the [Access Control](#accesscontrol) section.

At a high level, the device identity registry is a REST-capable collection of device identity resources. The following sections detail the device identity resource properties, and the operations the registry allows on identities.

> [AZURE.NOTE] See [IoT Hub APIs and SDKs][lnk-apis-sdks] for more details about the HTTP protocol and SDKs available to interact with the device identity registry.

### Device identity properties <a id="deviceproperties"></a>

Device identities are represented as JSON documents with the following properties.

| Property | Options | Description |
| -------- | ------- | ----------- |
| deviceId | required, read-only on updates | A case-sensitive string ( up to 128 char long) of ASCII 7-bit alphanumeric chars + `{'-', ':', '.', '+', '&percnt;', '_', '&num;', '&ast;', '?', '!', '(', ')', ',', '=', '&commat;', ';', '&dollar;', '''}`. |
| generationId | required, read-only | A hub-generated case-sensitive string up to 128 characters long. This is used to distinguish devices with the same **deviceId** when they have been deleted and recreated. |
| etag | required, read-only | A string representing a weak etag for the device identity, as per [RFC7232][lnk-rfc7232].|
| auth | optional | A composite object containing authentication information and security materials. |
| auth.symkey | optional | A composite object containing a primary and a secondary key, stored in base64 format. |
| status | required | Can be **Enabled** or **Disabled**. If **Enabled**, the device is allowed to connect. If **Disabled**, this device cannot access any device-facing endpoint. |
| statusReason | optional | A 128 char-long string storing the reason for the device identity status. All UTF-8 characters are allowed. |
| statusUpdateTime | read-only | Date and time of the last status update. |
| connectionState | read-only | **Connected** or **Disconnected**, represents the IoT Hub view of the device connection status. |
| connectionStateUpdatedTime | read-only | Date and last time the connection state was updated. |
| lastActivityTime  | read-only | Date and last time the device connected, received, or sent a message. |

> [AZURE.NOTE] Connection state can only represent the IoT Hub view of the status of the connection. This state can be delayed depending on network conditions and configurations.

### Device identity operations

The IoT Hub device identity registry exposes the following operations:

* Create device identity
* Update device identity
* Retrieve device identity by ID
* Delete device identity
* List up to 1000 identities

All these operations allow the use of optimistic concurrency as specified in [RFC7232][lnk-rfc7232].

> [AZURE.IMPORTANT] The only way to retrieve all identities in a hub's identity registry is to use the [Export](#importexport) functionality.

A hub's device identity registry does not contain any application metadata, can be accessed like a dictionary using the **deviceId** as the key, and has no support for expressive queries. Any IoT solution will have a solution-specific store that contains application-specific metadata, such as the room in which a temperature sensor is deployed in a smart building solution.

### Disabling devices

You can disable devices by updating the **status** property of an identity in the registry. Typically this is used in two scenarios:

1. During a provisioning orchestration process. For more information, see [Azure IoT Hub Guidance - Provisioning][lnk-guidance-provisioning].
2. For any reason, you consider a device compromised or temporarily unauthorized.

### Export device identities <a id="importexport"></a>

Exports are long-running jobs that use a customer-supplied blob container to read and write device identity data.

You can export device identities in bulk from an IoT hub's identity registry, using asynchronous operations on the IoT Hub Resource Provider endpoint ([Endpoints](#endpoints)).

The following operations are possible on export jobs:

* Create an export job
* Retrieve the status of a running job
* Cancel a running job

> [AZURE.NOTE] Each hub can have only a single job running at any given time.

For detailed information about the import and export APIs, see [Azure IoT Hub - Resource Provider APIs][lnk-resource-provider-apis].

#### Jobs

All export jobs have the following properties:

| Property | Options | Description |
| -------- | ------- | ----------- |
| jobId | system-generated, ignored at creation | |
| creationTime | system-generated, ignored at creation | |
| endOfProcessingTime | system-generated, ignored at creation | |
| type | read-only | **Export** |
| status | system-generated, ignored at creation | **Enqueued**, **Started**, **Completed**, **Failed** |
| progress | system-generated, ignored at creation | Integer value of the percentage of completion. |
| outputBlobContainerURI | required for all jobs | Blob Shared Access Signature URI with write access to a blob container (see [Create and Use a SAS with the Blob Service][lnk-createuse-sas] and [Creating a Shared Access Signature in Java][lnk-sas-java]). This is used to output the status of the job and the results. |
| includeKeysInExport | optional | If **true**, keys are included in export output; otherwise keys are exported as **null**. The default is **false**. |
| failureReason | system-generated, ignored at creation | If status is **Failed**, a string containing the reason. |

#### Export jobs

Export jobs take a blob Shared Access Signature URI as a parameter. This grants write access to a blob container. and is used to output the result of the operation.

The output results are written to the specified blob container in a file called `job_{job_id}_devices.txt`. This file contains device identities serialized as JSON, as specified in [Device identity properties](#deviceproperties). The security materials are set to **null** if the **includeKeysInExport** is set to **false**.

**Example**:

    {"deviceId":"devA","auth":{"symKey":{"primaryKey":"123"}},"status":"enabled"}
    {"deviceId":"devB","auth":{"symKey":{"primaryKey":"234"}},"status":"enabled"}
    {"deviceId":"devC","auth":{"symKey":{"primaryKey":"345"}},"status":"enabled"}
    {"deviceId":"devD","auth":{"symKey":{"primaryKey":"456"}},"status":"enabled"}


## Security <a id="security"></a>

This section describes the options for securing Azure IoT Hub.

### Access control <a id="accesscontrol"></a>

IoT Hub uses the following set of *permissions* to grant access to each IoT hub's endpoint. Permissions limit the access to an IoT hub based on functionality.

* **RegistryRead**. This permission grants read access to the device identity registry. For more information, see [Device identity registry](#device-identity-registry).
* **RegistryReadWrite**. Grants read and write access to the device identity registry. For more information, see [Device identity registry](#device-identity-registry).
* **ServiceConnect**. Grants access to cloud service-facing communication and monitoring endpoints. For example, it grants permission to cloud services to receive device-to-cloud messages, send cloud-to-device messages, and retrieve the corresponding delivery acknowledgments.
* **DeviceConnect**. Grants access to device-facing communication endpoints. For example, it grants permission to send device-to-cloud messages and receive cloud-to-device messages. This permission is mostly used by devices.

Permissions are granted in the following ways:

* **Hub-level shared access policies**. *Shared access policies* can grant any combination of the permissions listed in the previous section. You can define policies in the [Azure Management Portal][lnk-management-portal] or programmatically using the [Azure IoT Hub Resource provider APIs][lnk-resource-provider-apis]. A newly created IoT hub has the following default policies:

    - *iothubowner*: Policy with all permissions
    - *service*: Policy with **ServiceConnect** permission
    - *device*: Policy with **DeviceConnect** permission
    - *registryRead*: Policy with **RegistryRead** permission
    - *registryReadWrite*: Policy with **RegistryRead** and **RegistryWrite** permissions

* **Per-device security credentials**. Each IoT Hub contains a [device identity registry](#device-identity-registry). For each device in this registry, you can configure security credentials that grant **DeviceConnect** permissions scoped to the corresponding device endpoints.

**Example**. In an IoT solution, there is usually a device management component that uses the *registryReadWrite* policy, and an event processor component and a runtime device business logic component that both use the *service* policy. Individual devices connect using credentials stored in the IoT hub's identity registry.

For guidance on IoT Hub security topics, see the security section in [Azure IoT Hub Guidance][lnk-guidance-security].

### Authentication

Azure IoT Hub grants access to endpoints by verifying a token against the shared access policies and device identity registry security credentials.

Security credentials, such as symmetric keys, are never sent over the wire.

> [AZURE.NOTE] The Azure IoT Hub resource provider is secured through your Azure subscription, as are all providers in the [Azure Resource Manager][lnk-azure-resource-manager].

#### Security token format <a id="tokenformat"></a>

The security token has the following format:

	SharedAccessSignature sig={signature-string}&se={expiry}&skn={policyName}&sr={URL-encoded-resourceURI}

These are the expected values:

| Value | Description |
| ----- | ----------- |
| {signature} | An HMAC-SHA256 signature string of the form: `{URL-encoded-resourceURI} + "\n" + expiry` |
| {resourceURI} | URI prefix (by segment) of the endpoints that can be accessed with this token. For example, `/events` |
| {expiry} | UTF8 strings for number of seconds since the epoch 00:00:00 UTC on 1 January 1970. |
| {URL-encoded-resourceURI} | URL-encoded resource URI (lower-case) |
| {policyName} | The name of the shared access policy to which this token refers. Absent in the case of tokens referring to device-registry credentials. |

**Note on prefix**: The URI prefix is computed by segment and not by character. For example `/a/b` is a prefix for `/a/b/c` but not for `/a/bc`.

#### Protocol specifics

Each supported protocol (such as AMQP and HTTP) transports tokens in different ways.

HTTP authentication is implemented by including a valid token in the **Authorization** request header. A query parameter called **Authorization** can also transport the token.

When using [AMQP][lnk-amqp], IoT Hub supports [SASL PLAIN][lnk-sasl-plain] and [AMQP Claims-Based-Security][lnk-cbs].

In the case of AMQP claims-based-security, the standard specifies how to transmit these tokens.

For SASL PLAIN, the **username** can be:

* `{policyName}&commat;sas.root.{iothubName}` in the case of hub-level tokens.
* `{deviceId}` in the case of device-scoped tokens.

In both cases, the password field contains the token, as described in the [Token format](#tokenformat) section.

> [AZURE.NOTE] The [Azure IoT Hub SDKs][lnk-apis-sdks] automatically generate tokens when connecting to the service. In some cases, SDKs are limited in the protocol they support or the authentication method available. For more information, see the [Azure IoT Hub SDKs][lnk-apis-sdks] documentation.

#### SASL PLAIN compared to CBS

When using SASL PLAIN, a client connecting to an IoT hub can use a single token for each TCP connection. When the token expires, the TCP connection is disconnected from the service, triggering a reconnect. This behavior, while not problematic for an application back-end component, is very damaging for a device-side application for the following reasons:

*  Gateways usually connect on behalf of many devices. When using SASL PLAIN, they have to create a distinct TCP connection for each device connecting to an IoT hub. This considerably increases the consumption of power and networking resources and increases the latency of each device connection.
* Resource-constrained devices will be mostly impacted by the increased use of resources to reconnect after each token expiration.

### Scoping hub-level credentials

You can scope hub-level security policies by creating tokens with a restricted resource URI. For example, the endpoint to send device-to-cloud messages from a device is `/devices/{deviceId}/events`. You can also use a hub-level shared access policy with **DeviceConnect** permissions to sign a token whose resourceURI is `/devices/{deviceId}`, creating a token that is only usable to send devices on behalf of device **deviceId**.

This mechanism is similar to the [Event Hubs publisher policy][lnk-event-hubs-publisher-policy] and enables the implementation of custom authentication methods as explained in the security section of [Azure IoT Hub Guidance][lnk-guidance-security].

## Messaging

IoT Hub provides messaging primitives to communicate from an application back-end (*service* or *cloud*) to devices, and vice-versa. We refer to these functionalities as [Device-to-Cloud](#d2c) and [Cloud-to-Device](#c2d).

Core properties of IoT Hub messaging functionality are the reliability and durability of messages. This enables resilience to intermittent connectivity on the device side, and to load spikes in event processing on the cloud side. IoT Hub implements *at least once* delivery guarantees for both D2C and C2D messaging.

IoT Hub supports multiple device-facing protocols (such as AMQP and HTTP/1). In order to support seamless interoperability across protocols, IoT Hub defines a common message format that is supported by all device-facing protocols.

### Message format <a id="messageformat"></a>

IoT Hub messages comprise:

* A set of *system properties*. These are properties that are interpreted or set by IoT Hub. This set is predetermined.
* A set of *application properties*. This is a dictionary of string properties that the application can define and access without having to deserialize the body. These properties are never modified by IoT Hub.
* An opaque binary body.

See [IoT Hub APIs and SDKs][lnk-apis-sdks] for more information about how the message is encoded in different protocols.

This is the set of system properties in IoT Hub messages.

| Property | Description |
| -------- | ----------- |
| MessageId | A user-settable identifier for the message, usually used for request-reply patterns. Format: A case-sensitive string (up to 128 char long) of ASCII 7-bit alphanumeric chars + `{'-', ':',’.', '+', '%', '_', '#', '*', '?', '!', '(', ')', ',', '=', '@', ';', '$', '''}`. |
| Sequence number | A number (unique per device-queue) assigned by IoT Hub to each C2D message. |
| To | Used in [Cloud-to-Device](#c2d) for the destination of the message.|
| ExpiryTimeUtc | Date and time of message expiration. |
| EnqueuedTime | Time when the message was received by IoT Hub. |
| CorrelationId | String property usually containing the message ID of the request in request-reply patterns. |
| UserId | Used to specify the origin of messages. When messages are generated by IoT Hub, it is set to `{iot hub name}`. |
| Ack | Used in C2D messages to request IoT Hub to generate feedback messages as a result of the consumption of the message by the device. Possible values: **none** (default): no feedback message is generated, **positive**: receive a feedback message if the message was completed, **negative**: receive a feedback message if the message expired (or max delivery count was reached) without being completed by the device, **full**: both positive and negative. For more information, see [Message feedback](#feedback). |
| ConnectionDeviceId | Set by IoT Hub on D2C messages. It contains the **deviceId** of the device that sent the message. |
| ConnectionDeviceGenerationId | Set by IoT Hub on D2C messages. It contains the **generationId** (as per [Device identity properties](#deviceproperties)) of the device that sent the message. |
| ConnectionAuthMethod | Set by IoT Hub on D2C messages. Information about the authentication method used to authenticate the device sending the message. For more information, see [D2C anti-spoofing](#antispoofing).|

### Choosing your communication protocol <a id="amqpvshttp"></a>

Iot Hub supports both the [AMQP][lnk-amqp] and HTTP/1 protocols for device-side communications. The following is a list of considerations regarding their uses.

* **Cloud-to-device pattern**. HTTP/1 does not have an efficient way to implement server push. As such, when using HTTP/1, devices poll IoT Hub for cloud-to-device messages. This is very inefficient for both the device and IoT Hub. The current guidelines, when using HTTP/1 is to set a polling interval for each device of less than once per 25 minutes. On the other hand, AMQP supports server push when receiving cloud-to-device messages, and it enables immediate pushes of messages from IoT Hub to the device. If delivery latency is a concern, AMQP is the best protocol to use. On the other hand, for scarcely connected devices, HTTP/1 works as well.
* **Field gateways**. Given the HTTP/1 limitations with respect to server push, it is not suitable to be used in [Field gateway scenarios][lnk-azure-gateway-guidance].
* **Low resource devices**. HTTP/1 libraries are significantly smaller than AMQP ones. As such, if the device has few resources (for example , less than 1Mb RAM), HTTP/1 might be the only protocol implementation available.
* **Network traversal**. AMQP standard listens on port 5672. This could cause problems in networks that are closed to non-HTTP protocols.
* **Payload size**. AMQP is a binary protocol, which is significantly more compact than HTTP/1.

At a high level, we recommend that you use AMQP whenever possible, and use HTTP/1 if device resources or network configuration does not allow AMQP. Moreover, when using HTTP/1, polling frequency should be set to less than once every 25 minutes for each device. Clearly during development, it is acceptable to have more frequent polling frequencies.

As a final consideration, it is important to see the [Azure IoT Protocol Gateway][lnk-azure-protocol-gateway], which enables you to deploy a high performance MQTT gateway that interfaces directly with IoT Hub. MQTT supports server push (thus enabling immediate delivery of C2D messages to the device) and is available for very low resource devices. The main disadvantage of this approach is the requirement to self-host and manage a protocol gateway.

### Device to cloud <a id="d2c"></a>

As detailed in the [Endpoints](#endpoints) section, device-to-cloud messages are sent through a device-facing endpoint (in particular `/devices/{deviceId}/messages/events`), and received through a service-facing endpoint (`/messages/events`), that is compatible with [Event Hubs][lnk-event-hubs]. Therefore, you can use standard Event Hubs integration and SDKs to receive messages.

IoT Hub implements device-to-cloud messaging in a way that is similar to [Event Hubs][lnk-event-hubs], with IoT Hub's device-to-cloud messages being more like Event Hubs *events* than [Service Bus][lnk-servicebus] *messages*.

This implementation has the following implications:

* Similarly to Event Hubs *events*, device-to-cloud messages are durable and retained in an IoT hub for up to 7 days (see [Device-to-cloud configuration options](#d2cconfiguration)).
* Device-to-cloud messages are partitioned in a fixed set of partitions that is set at creation time (see [Device-to-cloud configuration options](#d2cconfiguration)).
* Analogously to Event Hubs, clients reading device-to-cloud messages must handle partitions and checkpointing. See [Event Hubs - Consuming events][lnk-event-hubs-consuming-events].
* Like Event Hubs events, device-to-cloud messages can be at most 256Kb in size, and can be grouped in batches to optimize sends. Batches can be at most 256Kb, and at most 500 messages.

There are, however, a few important distinctions between IoT Hub device-to-cloud and Event Hubs:

* As explained in the [Security](#security) section, IoT Hub allows per-device authentication and access control,
* IoT Hub allows millions of simultaneously connected devices (see [Quotas and throttling](#throttling)), while Event Hubs is limited to 5000 AMQP connections per namespace.
* IoT Hub does not allow arbitrary partitioning using a **PartitionKey**. Device-to-cloud messages are partitioned with respect to their originating **deviceId**.
* Scaling IoT Hub is slightly different than Event Hubs. For more information, see [Scaling IoT Hub][lnk-guidance-scale].

Note that this does not mean that IoT Hub substitutes Event Hubs in all scenarios. For example, in some event processing computations, it might be required to re-partition events with respect to a different property or field before analyzing the data streams. In that case, an Event Hub could be used to decouple two portions of the stream processing pipeline.

For details about how to use device-to-cloud messaging, see [IoT Hub APIs and SDKs][lnk-apis-sdks].

#### Non-telemetry traffic

In many cases, devices send not only telemetry data points to the application back-end, but also *interactive* messages and requests that require execution and handling from the application business logic layer. Good examples are critical alerts that have to trigger a specific action in the back-end, or device replies to commands.

See the [Device-to-cloud processing][lnk-guidance-d2c-processing] section of "IoT Hub Guidance" for more information about the best way to process this kind of messages.

#### Device-to-cloud configuration options <a id="d2cconfiguration"></a>

An IoT hub exposes the following properties to control D2C messaging.

* **Partition count**. Set this property at creation to define the number of partitions for D2C event ingestion.
* **Retention time**. This property specifies the retention time for device-to-cloud messages. The default is 1 day, but it can be increased up to 7.

Also, analogously to Event Hubs, IoT Hub allows the management of Consumer Groups on the device-to-cloud receive endpoint.

You can modify all these properties using either the [Azure portal][lnk-management-portal], or programmatically through the [Azure IoT Hub - Resource Provider APIs][lnk-resource-provider-apis].

#### Anti-spoofing properties <a id="antispoofing"></a>

To avoid device spoofing in device-to-cloud messages, IoT Hub stamps all messages with the following properties:

* **ConnectionDeviceId**
* **ConnectionDeviceGenerationId**
* **ConnectionAuthMethod**

The first two contain the **deviceId** and **generationId** of the originating device, as per [Device identity properties](#deviceproperties).

The **ConnectionAuthMethod** property contains a JSON serialized object with the following properties:

    {
        "scope": "{ hub | device}",
        "type": "{ symkey | sas}",
        "issuer": "iothub"
    }

### Cloud to device <a id="c2d"></a>

As already detailed in the [Endpoints](#endpoints) section, cloud-to-device messages are sent through a service-facing endpoint (`/messages/devicebound`), and received through a series of device-facing endpoints (`/devices/{deviceId}/messages/devicebound`).

Each cloud-to-device message is targeted at a single device, setting the **to** property to `/devices/{deviceId}/messages/devicebound`.

**Important**: Each device queue can hold at most 50 cloud-to-device messages. Trying to send more messages to the same device will result in an error.

#### Message lifecycle <a id="message lifecycle"></a>

In order to implement *at least once* delivery guarantee, cloud-to-device messages are persisted in per-device queues, and devices must explicitly acknowledge *completion* in order for IoT Hub to remove them from the queue. This guarantees resiliency against connectivity and device failures.

The following picture shows the lifecycle state graph for a cloud-to-device message.

![Cloud-to-device message lifecycle][img-lifecycle]

When a message is sent by the service, it is considered *Enqueued*. When a device wants to *receive* a message, IoT Hub *locks* the message (state set to **Invisible**), in order to allow other threads on the same device to start receiving other messages. When a device thread has completed the processing of a device, it notifies IoT Hub by *completing* the message. It can also decide to *reject* the message, which sends it to **Deadlettered** state, or *abandon* which puts the message back in the queue (state **Enqueued**).

Since a thread could fail to process a message without notifying IoT Hub, messages will automatically transition from **Invisible** back to **Enqueued** after a *visibility (or lock) timeout* (default: 1 minute). A message can transition between **Enqueued** and **Invisible** states for at most a specified number of times specified in the *max delivery count* property on IoT Hub. After that number of transitions, the message will automatically deadlettered. Similarly, a message will be automatically deadlettered after its expiration time (see [Time to live](#ttl)).

For a tutorial on cloud-to-device messages, see [Get started with Azure IoT Hub cloud-to-device messages][lnk-getstarted-c2d-tutorial]. For reference topics on how different APIs and SDKs expose the cloud-to-device functionality, see [IoT Hub APIs and SDKs][lnk-apis-sdks].

> [AZURE.NOTE] Typically, cloud-to-device messages should be completed whenever the loss of the message would not affect the application logic. This could happen in many different scenarios; for example: the message content has been successfully persisted on local storage, or an operation has been successfully executed, or the message is carrying transient information whose loss would not impact the functionality of the application. Sometimes, for long running tasks, it is common to complete the cloud-to-device message after having persisted the task description on local storage, and then notify the application back-end with one or more device-to-cloud message at various stages of progress of the task.

#### Time to live <a id="ttl"></a>

Every cloud-to-device message has an expiration time. This can be explicitly set by the service (in the **ExpiryTimeUtc** property), or it is set by IoT Hub using the default *time to live* specified as an IoT Hub property. See [Cloud-to-device configuration options](#c2dconfiguration).

#### Message feedback <a id="feedback"></a>

When sending a cloud-to-device message, the service can request the delivery of per-message feedback regarding the final state of that message. When setting the **Ack** property to **positive**, IoT Hub generates a feedback message if and only if the cloud-to-device message reached the **Completed** state. By setting the **Ack** property to **negative**, IoT Hub generates a feedback message if and only if the cloud-to-device message reaches the **Deadletterd** state. By setting the **Ack** property to **full**, IoT Hub generates a feedback message in either case.

As explained in [Endpoints](#endpoints), feedback is delivered through a service-facing endpoint (`/messages/servicebound/feedback`) as messages. The receive semantics for feedback is the same as for cloud-to-device messages with the same [Message lifecycle](#message lifecycle). Whenever possible, message feedback is batched in a single message, with the following format.

Each message retrieved from the feedback endpoint has the following properties.

| Property | Description |
| -------- | ----------- |
| EnqueuedTime | Timestamp indicating when the batch was created. |
| UserId | `{iot hub name}` |
| ContentType | `application/vnd.microsoft.iothub.feedback.json` |

The body is a JSON-serialized array of records, each with the following properties:

| Property | Description |
| -------- | ----------- |
| EnqueuedTime | Timestamp indicating when the outcome of the message happened. For example, the device completed or the message expired. |
| CorrelationId | **MessageId** of the cloud-to-device message to which this feedback information pertains. |
| StatusCode | **0** if success, **1** if the message expired, **2** if the maximum delivery count is exceeded, **3** if the message was rejected. |
| Description | String values for the previous outcomes. |
| DeviceId | **DeviceId** of the target device of the cloud-to-device message to which this piece of feedback pertains. |
| DeviceGenerationId | **DeviceGenerationId** of the target device of the cloud-to-device message to which this piece of feedback pertains. |

**Important**. The service must specify a **MessageId** for the cloud-to-device message in order to be able to correlate its feedback with the original message.

**Example**. This is an example body of a feedback message.

    [
        {
            "CorrelationId": "0987654321",
            "EnqueuedTime": "2015-07-28T16:24:48.789Z",
            "StatusCode": "0",
            "Description": "Success",
            "DeviceId": "123",
            "DeviceGenerationId": "abcdefghijklmnopqrstuvwxyz"
        },
        {
            ...
        },
        ...
    ]

#### Cloud-to-device configuration options <a id="c2dconfiguration"></a>

Each IoT hub exposes the following configuration options for cloud-to-device messaging.

| Property | Description | Range and default |
| -------- | ----------- | ----------------- |
| defaultTtlAsIso8601 | Default TTL for cloud-to-device messages. | ISO_8601 interval up to 2D (minimum 1 minute). Default: 1 hour. |
| maxDeliveryCount | Maximum delivery count for cloud-to-device per-device queues. | 1 to 100. Default: 10. |
| feedback.ttlAsIso8601 | Retention for service-bound feedback messages. | ISO_8601 interval up to 2D (minimum 1 minute). Default: 1 hour. |
| feedback.maxDeliveryCount | Maximum delivery count for feedback queue. | 1 to 100. Default: 100. |

## Quotas and throttling <a id="throttling"></a>

Each Azure subscription can have at most 10 IoT hubs.

Each IoT hub is provisioned with a certain number of units in a specific SKU (for more information, see [Azure IoT Hub Pricing][lnk-pricing]). The SKU and number of units determine the maximum daily quota of messages that can be sent, and the maximum number of device identities in the identity registry. The number of simultaneously connected devices is limited by the number of identities in the registry.

They also determine throttling limits that IoT Hub enforces on operations.

### Device identity registry quota

IoT Hub allows at most 1100 device updates (create, update, delete) per unit (irrespective of SKU) per day.

### Operation throttles

Operation throttles are rate limitations that are applied in the minute ranges, and are intended to avoid abuse. IoT Hub tries to avoid returning errors whenever possible, but it starts returning exceptions if the throttle is violated for too long.

The following is the list of enforced throttles. Values refer to an individual hub.

| Throttle | Per-hub value |
| -------- | ------------- |
| Identity registry operations (create, retrieve, list, update, delete), individual or bulk import/export | 100/min/unit, up to 5000/min |
| Device connections | 100/sec/unit |
| D2C sends | 2000/min/unit (for S2), 60/min/unit (for S1). Maximum of 100/sec. |
| C2D operations (sends, receive, feedback) | 100/min/unit |

**Note**. At any given time, it is possible to increase quotas or throttle limits by increasing the number of provisioned units in an IoT hub.

## Next steps

Now that you've seen an overview of developing for IoT Hub, follow these links to learn more:

- [Get started with IoT Hubs (tutorial)][lnk-get-started]
- [OS Platforms and hardware compatibility][lnk-compatibility]
- [Azure IoT Developer Center][lnk-iotdev]
- [Plan your IoT implementation][lnk-guidance]

[Event Hubs - Event Processor Host]: http://blogs.msdn.com/b/servicebus/archive/2015/01/16/event-processor-host-best-practices-part-1.aspx

[Azure Preview Portal]: https://ms.portal.azure.com

[img-summary]: ./media/iot-hub-devguide/summary.png
[img-endpoints]: ./media/iot-hub-devguide/endpoints.png
[img-lifecycle]: ./media/iot-hub-devguide/lifecycle.png
[img-eventhubcompatible]: ./media/iot-hub-devguide/eventhubcompatible.png

[lnk-compatibility]: https://github.com/Azure/azure-iot-sdks/blob/master/doc/tested_configurations.md
[lnk-apis-sdks]: https://github.com/Azure/azure-iot-sdks/blob/master/readme.md
[lnk-azure-hub-sdks]: https://msdn.microsoft.com/library/mt488521.aspx
[lnk-pricing]: https://azure.microsoft.com/pricing/details/iot-hub
[lnk-resource-provider-apis]: https://msdn.microsoft.com/library/mt548492.aspx
[lnk-reference-architecture]: iot-hub-what-is-azure-iot.md

[lnk-azure-gateway-guidance]: iot-hub-guidance.md#fieldgateways
[lnk-guidance-provisioning]: iot-hub-guidance.md#provisioning
[lnk-guidance-scale]: iot-hub-scaling.md
[lnk-guidance-security]: iot-hub-guidance.md#customauth

[lnk-azure-protocol-gateway]: iot-hub-protocol-gateway.md
[lnk-get-started]: iot-hub-csharp-csharp-getstarted.md
[lnk-guidance]: iot-hub-guidance.md
[lnk-getstarted-c2d-tutorial]: iot-hub-csharp-csharp-c2d.md

[lnk-amqp]: https://www.amqp.org/
[lnk-arm]: ../resource-group-overview.md
[lnk-azure-resource-manager]: https://azure.microsoft.com/documentation/articles/resource-group-overview/
[lnk-cbs]: https://www.oasis-open.org/committees/download.php/50506/amqp-cbs-v1%200-wd02%202013-08-12.doc
[lnk-createuse-sas]: ../storage/storage-dotnet-shared-access-signature-part-2/
[lnk-event-hubs-publisher-policy]: https://code.msdn.microsoft.com/Service-Bus-Event-Hub-99ce67ab
[lnk-event-hubs]: http://azure.microsoft.com/services/event-hubs/
[lnk-event-hubs-consuming-events]: ../event-hubs/event-hubs-programming-guide.md#event-consumers
[lnk-guidance-d2c-processing]: iot-hub-csharp-csharp-process-d2c.md
[lnk-management-portal]: https://portal.azure.com
[lnk-rfc7232]: https://tools.ietf.org/html/rfc7232
[lnk-sas-java]: https://msdn.microsoft.com/library/azure/Hh875756.aspx
[lnk-sasl-plain]: http://tools.ietf.org/html/rfc4616
[lnk-servicebus]: http://azure.microsoft.com/services/service-bus/
[lnk-tls]: https://tools.ietf.org/html/rfc5246
[lnk-iotdev]: https://azure.microsoft.com/develop/iot/
