---
title: Understand Azure IoT Hub cloud-to-device messaging | Microsoft Docs
description: This developer guide discusses how to use cloud-to-device messaging with your IoT hub. It includes information about the message life cycle and configuration options.
author: wesmc7777
manager: philmea
ms.author: wesmc
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 03/15/2018
---

# Send cloud-to-device messages from an IoT hub

To send one-way notifications to a device app from your solution back end, send cloud-to-device messages from your IoT hub to your device. For a discussion of other cloud-to-device options supported by Azure IoT Hub, see [Cloud-to-device communications guidance](iot-hub-devguide-c2d-guidance.md).

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

You send cloud-to-device messages through a service-facing endpoint, */messages/devicebound*. A device then receives the messages through a device-specific endpoint, */devices/{deviceId}/messages/devicebound*.

To target each cloud-to-device message at a single device, your IoT hub sets the **to** property to */devices/{deviceId}/messages/devicebound*.

Each device queue holds, at most, 50 cloud-to-device messages. To try to send more messages to the same device results in an error.

## The cloud-to-device message life cycle

To guarantee at-least-once message delivery, your IoT hub persists cloud-to-device messages in per-device queues. For the IoT hub to remove the messages from the queue, the devices must explicitly acknowledge *completion*. This approach guarantees resiliency against connectivity and device failures.

The life-cycle state graph is displayed in the following diagram:

![Cloud-to-device message life cycle](./media/iot-hub-devguide-messages-c2d/lifecycle.png)

When the IoT hub service sends a message to a device, the service sets the message state to *Enqueued*. When a device wants to *receive* a message, the IoT hub *locks* the message by setting the state to *Invisible*. This state allows other threads on the device to start receiving other messages. When a device thread completes the processing of a message, it notifies the IoT hub by *completing* the message. The IoT hub then sets the state to *Completed*.

A device can also:

* *Reject* the message, which causes the IoT hub to set it to the *Dead lettered* state. Devices that connect over the Message Queuing Telemetry Transport (MQTT) Protocol can't reject cloud-to-device messages.

* *Abandon* the message, which causes the IoT hub to put the message back in the queue, with the state set to *Enqueued*. Devices that connect over the MQTT Protocol can't abandon cloud-to-device messages.

A thread could fail to process a message without notifying the IoT hub. In this case, messages automatically transition from the *Invisible* state back to the *Enqueued* state after a *visibility* time-out (or *lock* time-out). The default value of this time-out is one minute.

The **max delivery count** property on the IoT hub determines the maximum number of times a message can transition between the *Enqueued* and *Invisible* states. After that number of transitions, the IoT hub sets the state of the message to *Dead lettered*. Similarly, the IoT hub sets the state of a message to *Dead lettered* after its expiration time. For more information, see [Time to live](#message-expiration-time-to-live).

The [How to send cloud-to-device messages with IoT Hub](iot-hub-csharp-csharp-c2d.md) article shows you how to send cloud-to-device messages from the cloud and receive them on a device.

A device ordinarily completes a cloud-to-device message when the loss of the message doesn't affect the application logic. An example of this might be when the device has persisted the message content locally or has successfully executed an operation. The message could also carry transient information, whose loss wouldn't impact the functionality of the application. Sometimes, for long-running tasks, you can:

* Complete the cloud-to-device message after the device has persisted the task description in local storage.

* Notify the solution back end with one or more device-to-cloud messages at various stages of progress of the task.

## Message expiration (time to live)

Every cloud-to-device message has an expiration time. This time is set by either of the following:

* The **ExpiryTimeUtc** property in the service
* The IoT hub, by using the default *time to live* that's specified as an IoT hub property

See [Cloud-to-device configuration options](#cloud-to-device-configuration-options).

A common way to take advantage of a message expiration and to avoid sending messages to disconnected devices is to set short *time to live* values. This approach achieves the same result as maintaining the device connection state, but it is more efficient. When you request message acknowledgments, the IoT hub notifies you which devices are:

* Able to receive messages.
* Are not online or have failed.

## Message feedback

When you send a cloud-to-device message, the service can request the delivery of per-message feedback about the final state of that message. You do this by setting the **iothub-ack** application property in the cloud-to-device message that's being sent to one of the following four values:

| Ack property value | Behavior |
| ------------ | -------- |
| none     | The IoT hub doesn't generate a feedback message (default behavior). |
| positive | If the cloud-to-device message reaches the *Completed* state, the IoT hub generates a feedback message. |
| negative | If the cloud-to-device message reaches the *Dead lettered* state, the IoT hub generates a feedback message. |
| full     | The IoT hub generates a feedback message in either case. |

If the **Ack** value is *full*, and you don't receive a feedback message, it means that the feedback message has expired. The service can't know what happened to the original message. In practice, a service should ensure that it can process the feedback before it expires. The maximum expiration time is two days, which leaves time to get the service running again if a failure occurs.

As explained in [Endpoints](iot-hub-devguide-endpoints.md), the IoT hub delivers feedback through a service-facing endpoint, */messages/servicebound/feedback*, as messages. The semantics for receiving feedback are the same as for cloud-to-device messages. Whenever possible, message feedback is batched in a single message, with the following format:

| Property     | Description |
| ------------ | ----------- |
| EnqueuedTime | A timestamp that indicates when the feedback message was received by the hub |
| UserId       | `{iot hub name}` |
| ContentType  | `application/vnd.microsoft.iothub.feedback.json` |

The body is a JSON-serialized array of records, each with the following properties:

| Property           | Description |
| ------------------ | ----------- |
| EnqueuedTimeUtc    | A timestamp that indicates when the outcome of the message happened (for example, the hub received the feedback message or the original message expired) |
| OriginalMessageId  | The *MessageId* of the cloud-to-device message to which this feedback information relates |
| StatusCode         | A required string, used in feedback messages that are generated by the IoT hub: <br/> *Success* <br/> *Expired* <br/> *DeliveryCountExceeded* <br/> *Rejected* <br/> *Purged* |
| Description        | String values for *StatusCode* |
| DeviceId           | The *DeviceId* of the target device of the cloud-to-device message to which this piece of feedback relates |
| DeviceGenerationId | The *DeviceGenerationId* of the target device of the cloud-to-device message to which this piece of feedback relates |

For the cloud-to-device message to correlate its feedback with the original message, the service must specify a *MessageId*.

The body of a feedback message is shown in the following code:

```json
[
  {
    "OriginalMessageId": "0987654321",
    "EnqueuedTimeUtc": "2015-07-28T16:24:48.789Z",
    "StatusCode": 0,
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

## Cloud-to-device configuration options

Each IoT hub exposes the following configuration options for cloud-to-device messaging:

| Property                  | Description | Range and default |
| ------------------------- | ----------- | ----------------- |
| defaultTtlAsIso8601       | Default TTL for cloud-to-device messages | ISO_8601 interval up to 2 days (minimum 1 minute); default: 1 hour |
| maxDeliveryCount          | Maximum delivery count for cloud-to-device per-device queues | 1 to 100; default: 10 |
| feedback.ttlAsIso8601     | Retention for service-bound feedback messages | ISO_8601 interval up to 2 days (minimum 1 minute); default: 1 hour |
| feedback.maxDeliveryCount | Maximum delivery count for the feedback queue | 1 to 100; default: 100 |

For more information about how to set these configuration options, see [Create IoT hubs](iot-hub-create-through-portal.md).

## Next steps

For information about the SDKs that you can use to receive cloud-to-device messages, see [Azure IoT SDKs](iot-hub-devguide-sdks.md).

To try out receiving cloud-to-device messages, see the [Send cloud-to-device](iot-hub-csharp-csharp-c2d.md) tutorial.
