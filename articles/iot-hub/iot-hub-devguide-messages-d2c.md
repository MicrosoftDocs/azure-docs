---
title: Understand Azure IoT Hub device-to-cloud messaging | Microsoft Docs
description: Developer guide - how to use device-to-cloud messaging with IoT Hub. Includes information about sending both telemetry and non-telemtry data, and using routing to deliver messages.
services: iot-hub
documentationcenter: .net
author: dominicbetts
manager: timlt
editor: ''

ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/25/2017
ms.author: dobett

---
# Send device-to-cloud messages to IoT Hub

To send time-series telemetry and alerts from your devices to your solution back end, send device-to-cloud messages from your device to your IoT hub. For a discussion of other device-to-cloud options supported by IoT Hub, see [Device-to-cloud communications guidance][lnk-d2c-guidance].

You send device-to-cloud messages through a device-facing endpoint (**/devices/{deviceId}/messages/events**). Routing rules then route your messages to one of the service-facing endpoints on your IoT hub. Routing rules use the headers and body of the device-to-cloud messages flowing through your hub to determine where to route them. By default, messages are routed to the built-in service-facing endpoint (**messages/events**), that is compatible with [Event Hubs][lnk-event-hubs]. Therefore, you can use standard [Event Hubs integration and SDKs][lnk-compatible-endpoint] to receive device-to-cloud messages in your solution back end.

IoT Hub implements device-to-cloud messaging using a streaming messaging pattern. IoT Hub's device-to-cloud messages are more like [Event Hubs][lnk-event-hubs] *events* than [Service Bus][lnk-servicebus] *messages* in that there is a high volume of events passing through the service that can be read by multiple readers.

Device-to-cloud messaging with IoT Hub has the following characteristics:

* Device-to-cloud messages are durable and retained in an IoT hub's default **messages/events** endpoint for up to seven days.
* Device-to-cloud messages can be at most 256 KB, and can be grouped in batches to optimize sends. Batches can be at most 256 KB.
* As explained in the [Control access to IoT Hub][lnk-devguide-security] section, IoT Hub enables per-device authentication and access control.
* IoT Hub allows you to create up to 10 custom endpoints. Messages are delivered to the endpoints based on routes configured on your IoT hub. For more information, see [Routing rules](#routing-rules).
* IoT Hub enables millions of simultaneously connected devices (see [Quotas and throttling][lnk-quotas]).
* IoT Hub does not allow arbitrary partitioning. Device-to-cloud messages are partitioned based on their originating **deviceId**.

For more information about the differences between the IoT Hub and Event Hubs services, see [Comparison of Azure IoT Hub and Azure Event Hubs][lnk-comparison].

## Send non-telemetry traffic

Often, in addition to telemetry data points, devices send messages and requests that require separate execution and handling in the solution back end. For example, critical alerts that must trigger a specific action in the back end. You can easily write a [routing rule][lnk-devguide-custom] to send these types of messages to an endpoint dedicated to their processing based on either a header on the message or a value in the message body.

For more information about the best way to process this kind of message, see the [Tutorial: How to process IoT Hub device-to-cloud messages][lnk-d2c-tutorial] tutorial.

## Route device-to-cloud messages

You have two options for routing device-to-cloud messages to your back-end apps:

* Use the built-in [Event Hub-compatible endpoint][lnk-compatible-endpoint] to enable back-end apps to read the device-to-cloud messages received by the hub. To learn about the built-in Event Hub-compatible endpoint, see [Read device-to-cloud messages from the built-in endpoint][lnk-devguide-builtin].
* Use routing rules to send messages to custom endpoints in your IoT hub. Custom endpoints enable your back-end apps to read device-to-cloud messages using Event Hubs, Service Bus queues, or Service Bus topics. To learn about routing and custom endpoints, see [Use custom endpoints and routing rules for device-to-cloud messages][lnk-devguide-custom].

## Anti-spoofing properties

To avoid device spoofing in device-to-cloud messages, IoT Hub stamps all messages with the following properties:

* **ConnectionDeviceId**
* **ConnectionDeviceGenerationId**
* **ConnectionAuthMethod**

The first two contain the **deviceId** and **generationId** of the originating device, as per [Device identity properties][lnk-device-properties].

The **ConnectionAuthMethod** property contains a JSON serialized object, with the following properties:

```json
{
  "scope": "{ hub | device}",
  "type": "{ symkey | sas}",
  "issuer": "iothub"
}
```

## Next steps

For information about the SDKs you can use to send device-to-cloud messages, see [Azure IoT SDKs][lnk-sdks].

The [Get Started][lnk-get-started] tutorials show you how to send device-to-cloud messages from both simulated and physical devices. For more detail, see the [Process IoT Hub device-to-cloud messages using routes][lnk-d2c-tutorial] tutorial.

[lnk-devguide-builtin]: iot-hub-devguide-messages-read-builtin.md
[lnk-devguide-custom]: iot-hub-devguide-messages-read-custom.md
[lnk-comparison]: iot-hub-compare-event-hubs.md
[lnk-d2c-guidance]: iot-hub-devguide-d2c-guidance.md
[lnk-get-started]: iot-hub-get-started.md

[lnk-event-hubs]: http://azure.microsoft.com/documentation/services/event-hubs/
[lnk-servicebus]: http://azure.microsoft.com/documentation/services/service-bus/
[lnk-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-sdks]: iot-hub-devguide-sdks.md
[lnk-compatible-endpoint]: iot-hub-devguide-messages-read-builtin.md
[lnk-device-properties]: iot-hub-devguide-identity-registry.md#device-identity-properties
[lnk-devguide-security]: iot-hub-devguide-security.md
[lnk-d2c-tutorial]: iot-hub-csharp-csharp-process-d2c.md
