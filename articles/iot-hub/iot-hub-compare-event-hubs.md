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
ms.date: 04/01/2018
ms.author: elioda

---
# Comparison of Azure IoT Hub and Azure Event Hubs

Both Azure IoT Hub and Azure Event Hubs are cloud servics that can ingest large amounts of data and process or store that data for business insights. From that perspective, it may seem like the two services are similar. However, only IoT Hub was developed with the specific capabilities needed to support at-scale internet of things scenarios in mind. 

One of the key differentiators between the two services is that IoT Hub 

Azure IoT Hub is the cloud gateway that connects devices and gathers data for business insights and automation. It makes it easy to stream data to the cloud and manage your devices at scale. IoT Hub also offers rich bi-directional communication capabilities, device-level security, and distributed computing on edge devices.

[Azure Event Hubs][Azure Event Hubs] is an event ingestion service that can process and store large amounts of data and telemetry. From that perspective, but implements different capabilities than IoT Hub.

Some of the key differences between the two services are detailed in the following table:

| Area | IoT Hub | Event Hubs |
| --- | --- | --- |
| Communication patterns | Enables [device-to-cloud communications][lnk-d2c-guidance] (messaging, file uploads, and reported properties) and [cloud-to-device communications][lnk-c2d-guidance] (direct methods, desired properties, messaging).<sup>1</sup> | Enables event ingress (usually considered for device-to-cloud scenarios). |
| Device state information | [Device twins][lnk-twins] can store and query device state information.<sup>1</sup> | No device state information can be stored. |
| Distributed edge computing | IoT Hub enables creation and management of [Azure IoT Edge](../iot-edge/how-iot-edge-works.md) devices and deployments.<sup>1</sup> | Event Hubs does not support moving workloads to devices. |
| Device protocol support |Supports MQTT, MQTT over WebSockets, AMQP, AMQP over WebSockets, and HTTPS. Additionally, IoT Hub works with the [Azure IoT protocol gateway][lnk-azure-protocol-gateway], a customizable protocol gateway implementation to support custom protocols. |Supports AMQP, AMQP over WebSockets, and HTTPS. |
| Security |Provides per-device identity and revocable access control. See the [Security section of the IoT Hub developer guide]. |Provides Event Hubs-wide [shared access policies][Event Hubs - security], with limited revocation support through [publisher's policies][Event Hubs publisher policies]. IoT solutions are often required to implement a custom solution to support per-device credentials and anti-spoofing measures. |
| Operations monitoring |Enables IoT solutions to subscribe to a rich set of device identity management and connectivity events such as individual device authentication errors, throttling, and bad format exceptions. These events enable you to quickly identify connectivity problems at the individual device level. |Exposes only aggregate metrics. |
| Scale |Is optimized to support millions of simultaneously connected devices. |Meters the connections as per [Azure Event Hubs quotas][Azure Event Hubs quotas]. On the other hand, Event Hubs enables you to specify the partition for each message sent. |
| Device SDKs |Provides [device SDKs][Azure IoT SDKs] for a large variety of platforms and languages, in addition to direct MQTT, AMQP, and HTTPS APIs. |Is supported on .NET, Java, and C, in addition to AMQP and HTTPS send interfaces. |
| File upload |Enables IoT solutions to upload files from devices to the cloud. Includes a file notification endpoint for workflow integration and an operations monitoring category for debugging support. | Not supported. |
| Route messages to multiple endpoints | Up to 10 custom endpoints are supported. Rules determine how messages are routed to custom endpoints. For more information, see [Send and receive messages with IoT Hub][lnk-devguide-messaging]. | Requires additional code to be written and hosted for message dispatching. |
<sup>1</sup> Cloud-to-device communication, device twins and device management, and Azure IoT Edge are only included in the standard tier of IoT Hub. For more information about basic and standard IoT hubs, see [Choose the right IoT Hub](iot-hub-scaling.md).


In summary, even if the only use case is device-to-cloud telemetry ingress, IoT Hub provides a service that is designed for IoT device connectivity. It continues to expand the value propositions for these scenarios with IoT-specific features. Event Hubs is designed for event ingress at a massive scale, both in the context of inter-datacenter and intra-datacenter scenarios.

It is not uncommon to use both IoT Hub and Event Hubs in the same solution. IoT Hub handles the device-to-cloud communication, and Event Hubs handles later-stage event ingress into real-time processing engines.

### Next steps
To learn more about planning your IoT Hub deployment, see [Scaling, HA, and DR][lnk-scaling].

To further explore the capabilities of IoT Hub, see:

* [IoT Hub developer guide][lnk-devguide]
* [Deploying AI to edge devices with Azure IoT Edge][lnk-iotedge]

[lnk-twins]: iot-hub-devguide-device-twins.md
[lnk-c2d-guidance]: iot-hub-devguide-c2d-guidance.md
[lnk-d2c-guidance]: iot-hub-devguide-d2c-guidance.md

[Azure Event Hubs]: ../event-hubs/event-hubs-what-is-event-hubs.md
[Security section of the IoT Hub developer guide]: iot-hub-devguide-security.md
[Event Hubs - security]: ../event-hubs/event-hubs-authentication-and-security-model-overview.md
[Event Hubs publisher policies]: ../event-hubs/event-hubs-features.md#event-publishers
[Azure Event Hubs quotas]: ../event-hubs/event-hubs-quotas.md
[Azure IoT SDKs]: https://github.com/Azure/azure-iot-sdks
[lnk-azure-protocol-gateway]: iot-hub-protocol-gateway.md

[lnk-scaling]: iot-hub-scaling.md
[lnk-devguide]: iot-hub-devguide.md
[lnk-iotedge]: ../iot-edge/tutorial-simulate-device-linux.md
[lnk-devguide-messaging]: iot-hub-devguide-messaging.md
