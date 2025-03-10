---
title: Understand message format
titleSuffix: Azure IoT Hub
description: This article describes the format and expected content of IoT Hub messages for cloud-to-device and device-to-cloud messages.
author: SoniaLopezBravo

ms.service: azure-iot-hub
ms.topic: concept-article
ms.date: 08/22/2024
ms.author: sonialopez
ms.custom: ['Role: Cloud Development', 'Role: IoT Device']
---

# Create and read IoT Hub messages

To support interoperability across protocols, IoT Hub defines a common set of messaging features that are available in all device-facing protocols. These features can be used in both [device-to-cloud messages](iot-hub-devguide-messages-d2c.md) and [cloud-to-device messages](iot-hub-devguide-messages-c2d.md). 

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

IoT Hub implements device-to-cloud messaging using a streaming messaging pattern. IoT Hub's device-to-cloud messages are more like [Event Hubs](../event-hubs/index.yml) *events* than [Service Bus](../service-bus-messaging/index.yml) *messages* in that there's a high volume of events passing through the service that multiple readers can read.

An IoT Hub message consists of:

* A predetermined set of *system properties* as described later in this article.

* A set of *application properties*. A dictionary of string properties that the application can define and access, without needing to deserialize the message body. IoT Hub never modifies these properties.

* A message body, which can be any type of data.

Each device protocol implements setting properties in different ways. For more information, see the [MQTT protocol guide](../iot/iot-mqtt-connect-to-iot-hub.md) and [AMQP protocol guide](./iot-hub-amqp-support.md) developer guides for details.

When you send device-to-cloud messages using the HTTPS protocol or send cloud-to-device messages, property names and values can only contain ASCII alphanumeric characters, plus ``! # $ % & ' * + - . ^ _ ` | ~`` .

Device-to-cloud messaging with IoT Hub has the following characteristics:

* Device-to-cloud messages are durable and retained in an IoT hub's default **messages/events** endpoint for up to seven days.

* Device-to-cloud messages can be at most 256 KB, and can be grouped in batches to optimize sends. Batches can be at most 256 KB.

* IoT Hub doesn't allow arbitrary partitioning. Device-to-cloud messages are partitioned based on their originating **deviceId**.

* As explained in [Control access to IoT Hub](iot-hub-devguide-security.md), IoT Hub enables per-device authentication and access control.

* You can stamp messages with information that goes into the application properties. For more information, see [message enrichments](iot-hub-message-enrichments-overview.md).

> [!NOTE]
> Each IoT Hub protocol provides a message content type property which is respected when routing data to custom endpoints.  To have your data properly handled at the destination (for example, JSON being treated as a parsable string instead of Base64 encoded binary data), provide the appropriate content type and charset for the message.

To use your message body in an IoT Hub routing query, provide a valid JSON object for the message and set the content type property of the message to `application/json;charset=utf-8`.

The following example shows a valid, routable message body:

```json
{
    "timestamp": "2022-02-08T20:10:46Z",
    "tag_name": "spindle_speed",
    "tag_value": 100
}
```

## System properties of device-to-cloud messages

| Property | Description  |User Settable?|Keyword for </br>routing query|
| --- | --- | --- | --- |
| message-id |A user-settable identifier for the message used for request-reply patterns. Format: A case-sensitive string (up to 128 characters long) of ASCII 7-bit alphanumeric characters plus `- : . + % _ # * ? ! ( ) , = @ ; $ '`.  | Yes | messageId |
| iothub-enqueuedtime |Date and time the [Device-to-Cloud](iot-hub-devguide-d2c-guidance.md) message was received by IoT Hub. | No | enqueuedTime |
| user-id |An ID used to specify the origin of messages. | Yes | userId |
| iothub-connection-device-id |An ID set by IoT Hub on device-to-cloud messages. It contains the **deviceId** of the device that sent the message. | No | connectionDeviceId |
| iothub-connection-module-id |An ID set by IoT Hub on device-to-cloud messages. It contains the **moduleId** of the device that sent the message. | No | connectionModuleId |
| iothub-connection-auth-generation-id |An ID set by IoT Hub on device-to-cloud messages. It contains the **connectionDeviceGenerationId** (as per [Device identity properties](iot-hub-devguide-identity-registry.md#device-identity-properties)) of the device that sent the message. | No |connectionDeviceGenerationId |
| iothub-connection-auth-method |An authentication method set by IoT Hub on device-to-cloud messages. This property contains information about the authentication method used to authenticate the device sending the message.| No | connectionAuthMethod |
| iothub-app-iothub-creation-time-utc | Allows the device to send event creation time when sending data in a batch. | Yes | creation-time-utc |
| iothub-creation-time-utc | Allows the device to send event creation time when sending one message at a time. | Yes | creation-time-utc |
| dt-dataschema | This value is set by IoT hub on device-to-cloud messages. It contains the device model ID set in the device connection. | No | $dt-dataschema |
| dt-subject | The name of the component that is sending the device-to-cloud messages. | Yes | $dt-subject |

## Application properties of device-to-cloud messages

A common use of application properties is to send a timestamp from the device using the `iothub-creation-time-utc` property to record when the message was sent by the device. The format of this timestamp must be UTC with no timezone information. For example, `2021-04-21T11:30:16Z` is valid, but `2021-04-21T11:30:16-07:00` is invalid.

```json
{
  "applicationId":"00001111-aaaa-2222-bbbb-3333cccc4444",
  "messageSource":"telemetry",
  "deviceId":"sample-device-01",
  "schema":"default@v1",
  "templateId":"urn:modelDefinition:mkuyqxzgea:e14m1ukpn",
  "enqueuedTime":"2021-01-29T16:45:39.143Z",
  "telemetry":{
    "temperature":8.341033560421833
  },
  "messageProperties":{
    "iothub-creation-time-utc":"2021-01-29T16:45:39.021Z"
  },
  "enrichments":{}
}
```

## System properties of cloud-to-device messages

| Property | Description  |User Settable?|
| --- | --- | --- |
| message-id |A user-settable identifier for the message used for request-reply patterns. Format: A case-sensitive string (up to 128 characters long) of ASCII 7-bit alphanumeric characters plus `- : . + % _ # * ? ! ( ) , = @ ; $ '`.  |Yes|
| sequence-number |A number (unique per device-queue) assigned by IoT Hub to each cloud-to-device message. |No|
| to |A destination specified in [Cloud-to-Device](iot-hub-devguide-c2d-guidance.md) messages. |No|
| absolute-expiry-time |Date and time of message expiration. |Yes| 
| correlation-id |A string property in a response message that typically contains the MessageId of the request, in request-reply patterns. |Yes|
| user-id |An ID used to specify the origin of messages. When messages are generated by IoT Hub, the user ID is the IoT hub name. |Yes|
| iothub-ack |A feedback message generator. This property is used in cloud-to-device messages to request IoT Hub to generate feedback messages as a result of the consumption of the message by the device. Possible values: **none** (default): no feedback message is generated, **positive**: receive a feedback message if the message was completed, **negative**: receive a feedback message if the message expired (or maximum delivery count was reached) without being completed by the device, or **full**: both positive and negative. |Yes|

### System property names

The system property names vary based on the endpoint to which the messages are being routed.

|System property name|Event Hubs|Azure Storage|Service Bus|Event Grid|
|--------------------|----------|-------------|-----------|----------|
|Message ID|message-id|messageId|MessageId|message-id|
|User id|user-id|userId|UserId|user-id|
|Connection device id|iothub-connection-device-id| connectionDeviceId|iothub-connection-device-id|iothub-connection-device-id|
|Connection module id|iothub-connection-module-id|connectionModuleId|iothub-connection-module-id|iothub-connection-module-id|
|Connection auth generation id|iothub-connection-auth-generation-id|connectionDeviceGenerationId| iothub-connection-auth-generation-id|iothub-connection-auth-generation-id|
|Connection auth method|iothub-connection-auth-method|connectionAuthMethod|iothub-connection-auth-method|iothub-connection-auth-method|
|contentType|content-type|contentType|ContentType|iothub-content-type|
|contentEncoding|content-encoding|contentEncoding|ContentEncoding|iothub-content-encoding|
|iothub-enqueuedtime|iothub-enqueuedtime|enqueuedTime| N/A |iothub-enqueuedtime|
|CorrelationId|correlation-id|correlationId|CorrelationId|correlation-id|
|dt-dataschema|dt-dataschema|dt-dataschema|dt-dataschema|dt-dataschema|
|dt-subject|dt-subject|dt-subject|dt-subject|dt-subject|

## Message size

IoT Hub measures message size in a protocol-agnostic way, considering only the actual payload. The size in bytes is calculated as the sum of the following values:

* The body size in bytes.
* The size in bytes of all the values of the message system properties.
* The size in bytes of all user property names and values.

Property names and values are limited to ASCII characters, so the length of the strings equals the size in bytes.

## Anti-spoofing properties

To avoid device spoofing in device-to-cloud messages, IoT Hub stamps all messages with the following properties:

* **iothub-connection-device-id**
* **iothub-connection-auth-generation-id**
* **iothub-connection-auth-method**

The first two contain the **deviceId** and **generationId** of the originating device, as per [Device identity properties](iot-hub-devguide-identity-registry.md#device-identity-properties).

The **iothub-connection-auth-method** property contains a JSON serialized object, with the following properties:

```json
{
  "scope": "{ hub | device | module }",
  "type": "{ symkey | sas | x509 }",
  "issuer": "iothub"
}
```

## Next steps

* For information about message size limits in IoT Hub, see [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md).
* To learn how to create and read IoT Hub messages in various programming languages, see the [Quickstarts](../iot/tutorial-send-telemetry-iot-hub.md?toc=/azure/iot-hub/toc.json&bc=/azure/iot-hub/breadcrumb/toc.json).
* To learn about the structure of non-telemetry events generated by IoT Hub, see [IoT Hub non-telemetry event schemas](iot-hub-non-telemetry-event-schema.md).
