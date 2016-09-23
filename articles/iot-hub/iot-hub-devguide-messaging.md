<properties
 pageTitle="Developer guide - messaging | Microsoft Azure"
 description="Azure IoT Hub developer guide - device-to-cloud and cloud-to-device messaging"
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
 ms.date="09/30/2016" 
 ms.author="dobett"/>

# Send and receive messages with IoT Hub

## Overview

IoT Hub provides the following messaging primitives to communicate with a device:

- [Device-to-cloud][lnk-d2c] from a device to an application back end.
- [Cloud-to-device][lnk-c2d] from an application back end (*service* or *cloud*).

Core properties of IoT Hub messaging functionality are the reliability and durability of messages. These properties enable resilience to intermittent connectivity on the device side, and to load spikes in event processing on the cloud side. IoT Hub implements *at least once* delivery guarantees for both device-to-cloud and cloud-to-device messaging.

IoT Hub supports multiple [device-facing protocols][lnk-protocols] (such as MQTT, AMQP, and HTTP). To support seamless interoperability across protocols, IoT Hub defines a [common message format][lnk-message-format] that all device-facing protocols support.

IoT Hub exposes an [Event Hubs-compatible endpoint][lnk-compatible-endpoint] to enable back-end applications to read the device-to-cloud messages received by the hub.

### When to use

Messaging is a core capability of IoT Hub. Use it whenever you need to send messages from your device to your back end, or send messages from your back end to a device.

For a comparison of the IoT Hub and Event Hubs services, see [Comparison of IoT Hub and Event Hubs][lnk-compare].

## Device-to-cloud messages

You send device-to-cloud messages through a device-facing endpoint (**/devices/{deviceId}/messages/events**). Your back-end service receives device-to-cloud messages through a service-facing endpoint (**/messages/events**) that is compatible with [Event Hubs][lnk-event-hubs]. Therefore, you can use standard [Event Hubs integration and SDKs][lnk-compatible-endpoint] to receive device-to-cloud messages.

IoT Hub implements device-to-cloud messaging in a way that is similar to [Event Hubs][lnk-event-hubs]. IoT Hub's device-to-cloud messages are more like Event Hubs *events* than [Service Bus][lnk-servicebus] *messages*.

This implementation has the following implications:

* Similarly to Event Hubs events, device-to-cloud messages are durable and retained in an IoT hub for up to seven days (see [Device-to-cloud configuration options][lnk-d2c-configuration]).
* Device-to-cloud messages are partitioned across a fixed set of partitions that is set at creation time (see [Device-to-cloud configuration options][lnk-d2c-configuration]).
* Analogously to Event Hubs, clients reading device-to-cloud messages must handle partitions and checkpointing. See [Event Hubs - Consuming events][lnk-event-hubs-consuming-events].
* Like Event Hubs events, device-to-cloud messages can be at most 256 KB, and can be grouped in batches to optimize sends. Batches can be at most 256 KB, and at most 500 messages.

There are, however, a few important distinctions between IoT Hub device-to-cloud messaging and Event Hubs:

* As explained in the [Control access to IoT Hub][lnk-devguide-security] section, IoT Hub allows per-device authentication and access control.
* IoT Hub allows millions of simultaneously connected devices (see [Quotas and throttling][lnk-quotas]), while Event Hubs is limited to 5000 AMQP connections per namespace.
* IoT Hub does not allow arbitrary partitioning using a **PartitionKey**. Device-to-cloud messages are partitioned based on their originating **deviceId**.
* Scaling IoT Hub is slightly different than scaling Event Hubs. For more information, see [Scaling IoT Hub][lnk-guidance-scale].

> [AZURE.NOTE] You cannot substitute IoT Hub for Event Hubs in all scenarios. For example, in some event processing computations, it might be necessary to repartition events with respect to a different property or field before analyzing the data streams. In this scenario, you could use an Event Hub to decouple two portions of the stream processing pipeline. For more information, see *Partitions* in [Azure Event Hubs Overview][lnk-eventhub-partitions].

For details about how to use device-to-cloud messaging, see [IoT Hub APIs and SDKs][lnk-sdks].

> [AZURE.NOTE] When using HTTP to send device-to-cloud messages, property names and values can only contain ASCII alphanumeric characters, plus ``{'!', '#', '$', '%, '&', "'", '*', '*', '+', '-', '.', '^', '_', '`', '|', '~'}``.

### Non-telemetry traffic

Often, in addition to telemetry data points, devices also send messages and requests that require execution and handling from the application business logic layer. For example, critical alerts that must trigger a specific action in the back end, or device responses to commands sent from the back end.

For more information about the best way to process this kind of message, see the [Tutorial: How to process IoT Hub device-to-cloud messages][lnk-d2c-tutorial] tutorial.

### Device-to-cloud configuration options

An IoT hub exposes the following properties to enable you to control device-to-cloud messaging.

* **Partition count**. Set this property at creation to define the number of partitions for device-to-cloud event ingestion.
* **Retention time**. This property specifies the retention time for device-to-cloud messages. The default is one day, but it can be increased to seven days.

Also, analogously to Event Hubs, IoT Hub enables you to manage consumer groups on the device-to-cloud receive endpoint.

You can modify all these properties, either programmatically through the [Azure IoT Hub - Resource Provider APIs][lnk-resource-provider-apis], or by using the [Azure portal][lnk-management-portal].

### Anti-spoofing properties

To avoid device spoofing in device-to-cloud messages, IoT Hub stamps all messages with the following properties:

* **ConnectionDeviceId**
* **ConnectionDeviceGenerationId**
* **ConnectionAuthMethod**

The first two contain the **deviceId** and **generationId** of the originating device, as per [Device identity properties][lnk-device-properties].

The **ConnectionAuthMethod** property contains a JSON serialized object, with the following properties:

```
{
  "scope": "{ hub | device}",
  "type": "{ symkey | sas}",
  "issuer": "iothub"
}
```

## Cloud-to-device messages

You send cloud-to-device messages through a service-facing endpoint (**/messages/devicebound**). A device receives them through a device-specific endpoint (**/devices/{deviceId}/messages/devicebound**).

Each cloud-to-device message is targeted at a single device by setting the **to** property to **/devices/{deviceId}/messages/devicebound**.

>[AZURE.IMPORTANT] Each device queue holds at most 50 cloud-to-device messages. Trying to send more messages to the same device results in an error.

> [AZURE.NOTE] When you send cloud-to-device messages, property names and values can only contain ASCII alphanumeric characters, plus ``{'!', '#', '$', '%, '&', "'", '*', '*', '+', '-', '.', '^', '_', '`', '|', '~'}``.

### Message lifecycle

To guarantee  at least once message delivery, IoT Hub persists cloud-to-device messages in per-device queues. Devices must explicitly acknowledge *completion* for IoT Hub to remove them from the queue. This guarantees resiliency against connectivity and device failures.

The following diagram shows the lifecycle state graph for a cloud-to-device message.

![Cloud-to-device message lifecycle][img-lifecycle]

When the service sends a message, it is considered *Enqueued*. When a device wants to *receive* a message, IoT Hub *locks* the message (sets the state to **Invisible**) allowing other threads on the same device to start receiving other messages. When a device thread completes the processing of a message, it notifies IoT Hub by *completing* the message.

A device can also:

- *Reject* the message, which causes IoT Hub to set it to the **Deadlettered** state.
- *Abandon* the message, which causes IoT Hub to put the message back in the queue, with the state set to **Enqueued**.

A thread could fail to process a message without notifying IoT Hub. In this case, messages automatically transition from the **Invisible** state back to the **Enqueued** state after a *visibility (or lock) timeout*. The default value of this timeout is one minute.

A message can transition between the **Enqueued** and **Invisible** states for, at most, the number of times specified in the **max delivery count** property on IoT Hub. After that number of transitions, IoT Hub sets the state of the message to **Deadlettered**. Similarly, IoT Hub sets the state of a message to **Deadlettered** after its expiration time (see [Time to live][lnk-ttl]).

For a tutorial on cloud-to-device messages, see [Tutorial: How to send cloud-to-device messages with IoT Hub][lnk-c2d-tutorial]. For reference topics on how different APIs and SDKs expose the cloud-to-device functionality, see [IoT Hub APIs and SDKs][lnk-sdks].

> [AZURE.NOTE] Typically, cloud-to-device messages complete whenever the loss of the message would not affect the application logic. For example, the message content has been successfully persisted in local storage, or an operation has been successfully executed. The message could also be carrying transient information, whose loss would not impact the functionality of the application. Sometimes, for long-running tasks, you can complete the cloud-to-device message after persisting the task description in local storage. Then you can notify the application back end with one or more device-to-cloud messages at various stages of progress of the task.

### Message expiration (time to live)

Every cloud-to-device message has an expiration time. This time is set either by the service (in the **ExpiryTimeUtc** property), or by IoT Hub using the default *time to live* specified as an IoT Hub property. See [Cloud-to-device configuration options][lnk-c2d-configuration].

> [AZURE.NOTE] A common way to take advantage of message expiration and avoid sending messages to disconnected devices, is to set short time to live values. This approach achieves the same result as maintaining the device connection state, while being more efficient. When you request message acknowledgements, IoT Hub notifies you which devices are able to receive messages, and which devices are not online or have failed.

### Message feedback

When you send a cloud-to-device message, the service can request the delivery of per-message feedback regarding the final state of that message.

- If you set the **Ack** property to **positive**, IoT Hub generates a feedback message if, and only if, the cloud-to-device message reached the **Completed** state.
- If you set the **Ack** property to **negative**, IoT Hub generates a feedback message, if and only if, the cloud-to-device message reaches the **Deadlettered** state.
- If you set the **Ack** property to **full**, IoT Hub generates a feedback message in either case.

> [AZURE.NOTE] If **Ack** is **full**, and you don't receive a feedback message, it means that the feedback message expired. The service can't know what happened to the original message. In practice, a service should ensure that it can process the feedback before it expires. The maximum expiry time is two days, which allows plenty of time to get the service running again if a failure occurs.

As explained in [Endpoints][lnk-endpoints], IoT Hub delivers feedback through a service-facing endpoint (**/messages/servicebound/feedback**) as messages. The semantics for receiving feedback are the same as for cloud-to-device messages, and have the same [Message lifecycle][lnk-lifecycle]. Whenever possible, message feedback is batched in a single message, with the following format:

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

### Cloud-to-device configuration options

Each IoT hub exposes the following configuration options for cloud-to-device messaging.

| Property | Description | Range and default |
| -------- | ----------- | ----------------- |
| defaultTtlAsIso8601 | Default TTL for cloud-to-device messages. | ISO_8601 interval up to 2D (minimum 1 minute). Default: 1 hour. |
| maxDeliveryCount | Maximum delivery count for cloud-to-device per-device queues. | 1 to 100. Default: 10. |
| feedback.ttlAsIso8601 | Retention for service-bound feedback messages. | ISO_8601 interval up to 2D (minimum 1 minute). Default: 1 hour. |
| feedback.maxDeliveryCount | Maximum delivery count for feedback queue. | 1 to 100. Default: 100. |

For more information, see [Create IoT hubs][lnk-portal].

## Read device-to-cloud messages

IoT Hub exposes an endpoint for your back-end services to read the device-to-cloud messages received by your hub. The endpoint is Event Hubs-compatible, which enables you to use any of the mechanisms the Event Hubs service supports for reading messages.

When you use the [Azure Service Bus SDK for .NET][lnk-servicebus-sdk] or the [Event Hubs - Event Processor Host][lnk-eventprocessorhost], you can use any IoT Hub connection strings with the correct permissions. Then use **messages/events** as the Event Hub name.

When you use SDKs (or product integrations) that are unaware of IoT Hub, you must retrieve an Event Hubs-compatible endpoint and Event Hub name from the IoT Hub settings in the [Azure portal][lnk-management-portal]:

1. In the IoT hub blade, click **Messaging**.
2. In the **Device-to-cloud settings** section, you find the following values: **Event Hub-compatible endpoint**, **Event Hub-compatible name**, and **Partitions**.

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

## Reference

### Message format

IoT Hub messages comprise:

* A set of *system properties*. Properties that IoT Hub interprets or sets. This set is predetermined.
* A set of *application properties*. A dictionary of string properties that the application can define and access, without needing to deserialize the message body. IoT Hub never modifies these properties.
* An opaque binary body.

For more information about how the message is encoded in different protocols, see [IoT Hub APIs and SDKs][lnk-sdks].

The following table lists the set of system properties in IoT Hub messages.

| Property | Description |
| -------- | ----------- |
| MessageId | A user-settable identifier for the message, used for request-reply patterns. Format: A case-sensitive string (up to 128 characters long) of ASCII 7-bit alphanumeric characters + `{'-', ':',’.', '+', '%', '_', '#', '*', '?', '!', '(', ')', ',', '=', '@', ';', '$', '''}`. |
| Sequence number | A number (unique per device-queue) assigned by IoT Hub to each cloud-to-device message. |
| To | A destination specified in [Cloud-to-Device][lnk-c2d] messages. |
| ExpiryTimeUtc | Date and time of message expiration. |
| EnqueuedTime | Date and time the message was received by IoT Hub. |
| CorrelationId | A string property in a response message that typically contains the MessageId of the request, in request-reply patterns. |
| UserId | An ID used to specify the origin of messages. When messages are generated by IoT Hub, it is set to `{iot hub name}`. |
| Ack | A feedback message generator. This property is used in cloud-to-device messages to request IoT Hub to generate feedback messages as a result of the consumption of the message by the device. Possible values: **none** (default): no feedback message is generated, **positive**: receive a feedback message if the message was completed, **negative**: receive a feedback message if the message expired (or maximum delivery count was reached) without being completed by the device, or **full**: both positive and negative. For more information, see [Message feedback][lnk-feedback]. |
| ConnectionDeviceId | An ID set by IoT Hub on device-to-cloud messages. It contains the **deviceId** of the device that sent the message. |
| ConnectionDeviceGenerationId | An ID set by IoT Hub on device-to-cloud messages. It contains the **generationId** (as per [Device identity properties][lnk-device-properties]) of the device that sent the message. |
| ConnectionAuthMethod | An authentication method set by IoT Hub on device-to-cloud messages. This property contains information about the authentication method used to authenticate the device sending the message. For more information, see [Device to cloud anti-spoofing][lnk-antispoofing].|

### Communication protocols

Iot Hub supports MQTT, [AMQP][lnk-amqp], AMQP over WebSockets, and HTTP/1 protocols for device-side communications. The following table provides the high-level recommendations for your choice of protocol:

| Protocol | When you should choose this protocol |
| -------- | ------------------------------------ |
| MQTT     | Use on all devices that do not require the use of WebSockets. |
| AMQPS    | Use on field and cloud gateways to take advantage of connection multiplexing across devices. <br/> Use when you need to connect on port 443. |
| HTTPS    | Use for devices that cannot support other protocols. |

Consider the following points when you choose your protocol for device-side communications:

* **Cloud-to-device pattern**. HTTP/1 does not have an efficient way to implement server push. As such, when you are using HTTP/1, devices poll IoT Hub for cloud-to-device messages. This approach is inefficient for both the device and IoT Hub. Under current HTTP/1 guidelines, each device should poll for messages every 25 minutes or more. On the other hand, MQTT and AMQP support server push when receiving cloud-to-device messages. They enable immediate pushes of messages from IoT Hub to the device. If delivery latency is a concern, AMQP or MQTT are the best protocols to use. For rarely connected devices, HTTP/1 works as well.
* **Field gateways**. When using HTTP/1 and MQTT, you cannot connect multiple devices (each with its own per-device credentials) using the same TLS connection. Thus, for [Field gateway scenarios][lnk-azure-gateway-guidance], these protocols are suboptimal because they require one TLS connection between the field gateway and IoT Hub for each device connected to the field gateway.
* **Low resource devices**. The MQTT and HTTP/1 libraries have a smaller footprint than the AMQP libraries. As such, if the device has limited resources (for example, less than 1 MB RAM), these protocols might be the only protocol implementation available.
* **Network traversal**. The MQTT standard listens on port 8883, which could cause problems in networks that are closed to non-HTTP protocols. Both HTTP and AMQP (over WebSockets) are available to be used in this scenario.
* **Payload size**. AMQP and MQTT are binary protocols, which result in more compact payloads than HTTP/1.

> [AZURE.NOTE] When using HTTP/1, each device should poll for cloud-to-device messages every 25 minutes or more. However, during development, it is acceptable to poll more frequently than every 25 minutes.

### Port numbers

Devices can communicate with IoT Hub in Azure using various protocols. Typically, the choice of protocol is driven by the specific requirements of the solution. The following table lists the outbound ports that must be open for a device to be able to use a specific protocol:

| Protocol | Port(s) |
| -------- | ------- |
| MQTT     | 8883    |
| AMQP     | 5671    |
| AMQP over WebSockets | 443    |
| HTTPS    | 443     |
| LWM2M (Device management) | 5684 |

Once you have created an IoT hub in an Azure region, the hub keeps the same IP address for the lifetime of that hub. However, to maintain quality of service, if Microsoft moves the IoT hub to a different scale unit then it is assigned a new IP address.

### Notes on MQTT support

IoT Hub implements the MQTT v3.1.1 protocol with the following limitations and specific behavior:

  * **QoS 2 is not supported**. When a device client publishes a message with **QoS 2**, IoT Hub closes the network connection. When a device client subscribes to a topic with **QoS 2**, IoT Hub grants maximum QoS level 1 in the **SUBACK** packet.
  * **Retain messages do not persist**. If a device client publishes a message with the RETAIN flag set to 1, IoT Hub adds the **x-opt-retain** application property to the message. In this case, IoT Hub does not persist the retain message, but instead passes it to the back-end application.

For more information, see [IoT Hub MQTT support][lnk-devguide-mqtt].

As a final consideration, you should review the [Azure IoT protocol gateway][lnk-azure-protocol-gateway] that enables you to deploy a high-performance custom protocol gateway that interfaces directly with IoT Hub. The Azure IoT protocol gateway enables you to customize the device protocol to accommodate brownfield MQTT deployments or other custom protocols. This approach does require, however, that you self-host and operate a custom protocol gateway.

### Additional reference material

Other reference topics in the Developer Guide include:

- [IoT Hub endpoints][lnk-endpoints] describes the various endpoints that each IoT hub exposes for runtime and management operations.
- [Throttling and quotas][lnk-quotas] describes the quotas that apply to the IoT Hub service and the throttling behavior to expect when you use the service.
- [IoT Hub device and service SDKs][lnk-sdks] lists the various language SDKs you an use when you develop both device and service applications that interact with IoT Hub.
- [Query language for twins, methods, and jobs][lnk-query] describes the query language you can use to retrieve information from IoT Hub about your device twins, methods and jobs.
- [IoT Hub MQTT support][lnk-devguide-mqtt] provides more information about IoT Hub support for the MQTT protocol.

## Next steps

Now you have learned how to send and receive messages with IoT Hub, you may be interested in the following Developer Guide topics:

- [Upload files from a device][lnk-devguide-upload]
- [Manage device identities in IoT Hub][lnk-devguide-identities]
- [Control access to IoT Hub][lnk-devguide-security]
- [Use device twins to synchronize state and configurations][lnk-devguide-device-twins]
- [Invoke a direct method on a device][lnk-devguide-directmethods]
- [Schedule jobs on multiple devices][lnk-devguide-jobs]

If you would like to try out some of the concepts described in this article, you may be interested in the following IoT Hub tutorials:

- [Get started with Azure IoT Hub][lnk-getstarted-tutorial]
- [How to send cloud-to-device messages with IoT Hub][lnk-c2d-tutorial]
- [How to process IoT Hub device-to-cloud messages][lnk-d2c-tutorial]


[img-lifecycle]: ./media/iot-hub-devguide-messaging/lifecycle.png
[img-eventhubcompatible]: ./media/iot-hub-devguide-messaging/eventhubcompatible.png

[lnk-resource-provider-apis]: https://msdn.microsoft.com/library/mt548492.aspx
[lnk-azure-gateway-guidance]: iot-hub-devguide-endpoints.md#field-gateways
[lnk-guidance-scale]: iot-hub-scaling.md
[lnk-azure-protocol-gateway]: iot-hub-protocol-gateway.md
[lnk-amqp]: https://www.amqp.org/
[lnk-event-hubs]: http://azure.microsoft.com/documentation/services/event-hubs/
[lnk-event-hubs-consuming-events]: ../event-hubs/event-hubs-programming-guide.md#event-consumers
[lnk-management-portal]: https://portal.azure.com
[lnk-servicebus]: http://azure.microsoft.com/documentation/services/service-bus/
[lnk-eventhub-partitions]: ../event-hubs/event-hubs-overview.md#partitions
[lnk-portal]: iot-hub-create-through-portal.md

[lnk-endpoints]: iot-hub-devguide-endpoints.md
[lnk-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-sdks]: iot-hub-devguide-sdks.md
[lnk-query]: iot-hub-devguide-query-language.md
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md
[lnk-d2c]: iot-hub-devguide-messaging.md#device-to-cloud-messages
[lnk-c2d]: iot-hub-devguide-messaging.md#cloud-to-device-messages
[lnk-compatible-endpoint]: iot-hub-devguide-messaging.md#read-device-to-cloud-messages
[lnk-protocols]: iot-hub-devguide-messaging.md#communication-protocols
[lnk-message-format]: iot-hub-devguide-messaging.md#message-format
[lnk-d2c-configuration]: iot-hub-devguide-messaging.md#device-to-cloud-configuration-options
[lnk-device-properties]: iot-hub-devguide-identity-registry.md#device-identity-properties
[lnk-ttl]: iot-hub-devguide-messaging.md#message-expiration-time-to-live
[lnk-c2d-configuration]: iot-hub-devguide-messaging.md#cloud-to-device-configuration-options
[lnk-lifecycle]: iot-hub-devguide-messaging.md#message-lifecycle
[lnk-feedback]: iot-hub-devguide-messaging.md#message-feedback
[lnk-antispoofing]: iot-hub-devguide-messaging.md#anti-spoofing-properties
[lnk-compare]: iot-hub-compare-event-hubs.md

[lnk-devguide-upload]: iot-hub-devguide-file-upload.md
[lnk-devguide-identities]: iot-hub-devguide-identity-registry.md
[lnk-devguide-security]: iot-hub-devguide-security.md
[lnk-devguide-device-twins]: iot-hub-devguide-device-twins.md
[lnk-devguide-directmethods]: iot-hub-devguide-direct-methods.md
[lnk-devguide-jobs]: iot-hub-devguide-jobs.md
[lnk-servicebus-sdk]: https://www.nuget.org/packages/WindowsAzure.ServiceBus
[lnk-eventprocessorhost]: http://blogs.msdn.com/b/servicebus/archive/2015/01/16/event-processor-host-best-practices-part-1.aspx


[lnk-getstarted-tutorial]: iot-hub-csharp-csharp-getstarted.md
[lnk-c2d-tutorial]: iot-hub-csharp-csharp-c2d.md
[lnk-d2c-tutorial]: iot-hub-csharp-csharp-process-d2c.md