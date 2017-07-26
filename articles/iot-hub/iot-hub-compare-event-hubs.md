---
title: Compare Azure IoT Hub to Azure Event Hubs | Microsoft Docs
description: A comparison of the IoT Hub and Event Hubs Azure services highlighting functional differences and use cases. The comparison includes supported protocols, device management, monitoring, and file uploads.
services: iot-hub
documentationcenter: ''
author: fsautomata
manager: timlt
editor: ''

ms.assetid: aeddea62-8302-48e2-9aad-c5a0e5f5abe9
ms.service: iot-hub
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/31/2017
ms.author: elioda

---
# Comparison of Azure IoT Hub and Azure Event Hubs
One of the main use cases for IoT Hub is to gather telemetry from devices. For this reason, IoT Hub is often compared to [Azure Event Hubs][Azure Event Hubs]. Like IoT Hub, Event Hubs is an event processing service that enables event and telemetry ingress to the cloud at massive scale, with low latency and high reliability.

However, the services have many differences, which are detailed in the following table:

| Area | IoT Hub | Event Hubs |
| --- | --- | --- |
| Communication patterns | Enables [device-to-cloud communications][lnk-d2c-guidance] (messaging, file uploads, and reported properties) and [cloud-to-device communications][lnk-c2d-guidance] (direct methods, desired properties, messaging). |Only enables event ingress (usually considered for device-to-cloud scenarios). |
| Device state information | [Device twins][lnk-twins] can store and query device state information. | No device state information can be stored. |
| Device protocol support |Supports MQTT, MQTT over WebSockets, AMQP, AMQP over WebSockets, and HTTP. Additionally, IoT Hub works with the [Azure IoT protocol gateway][lnk-azure-protocol-gateway], a customizable protocol gateway implementation to support custom protocols. |Supports AMQP, AMQP over WebSockets, and HTTP. |
| Security |Provides per-device identity and revocable access control. See the [Security section of the IoT Hub developer guide]. |Provides Event Hubs-wide [shared access policies][Event Hubs - security], with limited revocation support through [publisher's policies][Event Hubs publisher policies]. IoT solutions are often required to implement a custom solution to support per-device credentials and anti-spoofing measures. |
| Operations monitoring |Enables IoT solutions to subscribe to a rich set of device identity management and connectivity events such as individual device authentication errors, throttling, and bad format exceptions. These events enable you to quickly identify connectivity problems at the individual device level. |Exposes only aggregate metrics. |
| Scale |Is optimized to support millions of simultaneously connected devices. |Meters the connections as per [Azure Service Bus quotas][Azure Service Bus quotas]. On the other hand, Event Hubs enables you to specify the partition for each message sent. |
| Device SDKs |Provides [device SDKs][Azure IoT SDKs] for a large variety of platforms and languages, in addition to direct MQTT, AMQP, and HTTP APIs. |Is supported on .NET, Java, and C, in addition to AMQP and HTTP send interfaces. |
| File upload |Enables IoT solutions to upload files from devices to the cloud. Includes a file notification endpoint for workflow integration and an operations monitoring category for debugging support. | Not supported. |
| Route messages to multiple endpoints | Up to 10 custom endpoints are supported. Rules determine how messages are routed to custom endpoints. For more information, see [Send and receive messages with IoT Hub][lnk-devguide-messaging]. | Requires additional code to be written and hosted for message dispatching. |

In summary, even if the only use case is device-to-cloud telemetry ingress, IoT Hub provides a service that is designed for IoT device connectivity. It continues to expand the value propositions for these scenarios with IoT-specific features. Event Hubs is designed for event ingress at a massive scale, both in the context of inter-datacenter and intra-datacenter scenarios.

It is not uncommon to use both IoT Hub and Event Hubs in the same solution. IoT Hub handles the device-to-cloud communication, and Event Hubs handles later-stage event ingress into real-time processing engines.

### Next steps
To learn more about planning your IoT Hub deployment, see [Scaling, HA, and DR][lnk-scaling].

To further explore the capabilities of IoT Hub, see:

* [IoT Hub developer guide][lnk-devguide]
* [Simulating a device with IoT Edge][lnk-iotedge]

[lnk-twins]: iot-hub-devguide-device-twins.md
[lnk-c2d-guidance]: iot-hub-devguide-c2d-guidance.md
[lnk-d2c-guidance]: iot-hub-devguide-d2c-guidance.md

[Azure Event Hubs]: ../event-hubs/event-hubs-what-is-event-hubs.md
[Security section of the IoT Hub developer guide]: iot-hub-devguide-security.md
[Event Hubs - security]: ../event-hubs/event-hubs-authentication-and-security-model-overview.md
[Event Hubs publisher policies]: ../event-hubs/event-hubs-features.md#event-publishers
[Azure Service Bus quotas]: ../service-bus-messaging/service-bus-quotas.md
[Azure IoT SDKs]: https://github.com/Azure/azure-iot-sdks
[lnk-azure-protocol-gateway]: iot-hub-protocol-gateway.md

[lnk-scaling]: iot-hub-scaling.md
[lnk-devguide]: iot-hub-devguide.md
[lnk-iotedge]: iot-hub-linux-iot-edge-simulated-device.md
[lnk-devguide-messaging]: iot-hub-devguide-messaging.md
