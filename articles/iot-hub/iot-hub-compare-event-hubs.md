<properties
 pageTitle="Compare Azure IoT Hub to Azure Event Hubs | Microsoft Azure"
 description="A comparison of the Azure IoT Hub and Azure Event Hubs services highlighting functional differences and use cases."
 services="iot-hub"
 documentationCenter=""
 authors="fsautomata"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="10/02/2015"
 ms.author="elioda"/>

# Comparison of IoT Hub and Event Hubs

One of the main use cases for Azure IoT Hub is to gather telemetry from devices. For this reason, IoT Hub is often compared to [Event Hubs][], which is an event processing service that provides event and telemetry ingress to the cloud at massive scale, with low latency and high reliability.

The services, however, have many differences, that are detailed in the following sections.

| Area | IoT Hub | Event Hubs |
| ---- | ------- | ---------- |
| Communication patterns | Device-to-cloud event ingress and cloud-to-device messaging. | Only event ingress (usually considered for device-to-cloud scenarios). |
| Security | Per-device identity and revocable access control. See [IoT Hub Developer Guide - Security]. | Event Hub-wide [Shared Access Policies][Event Hub - security], with limited revocation support using [publisher's policies][Event Hub publisher policies]. In the context of IoT solutions, it is often required to implement a custom solution to support per-device credentials, and anti-spoofing measures. |
| Scale | IoT Hub is optimized to support millions of simultaneously connected devices. | Event Hubs can support a more limited number of simultaneous connections: up to 5.000 AMQP connection, as per [Service Bus Quotas][]. On the other hand, Event Hubs enables you to specify the partition for each message sent. |
| Device SDKs | IoT Hub provides [device SDKs][Azure IoT Hub SDKs] for a large variety of platforms and languages | Event Hubs is supported on .NET, C, and provides AMQP and HTTP send interfaces. |

In summary, even if the only use case is device-to-cloud telemetry ingress, IoT Hub provides a service that is specifically designed for IoT device connectivity, and will continue to expand the value propositions for these scenarios with IoT-specific features. Event Hubs is designed for event ingress at massive scale, both in the context of inter- and intra-data center scenarios.

It is not uncommon to use IoT Hub and Event Hubs in conjunction, letting the former handle the device-to-cloud communication, and the latter later-stage event ingress into real-time processing engines.

## Next steps

Follow these links to learn more about Azure IoT Hub:

- [Get started with IoT Hubs (Tutorial)][lnk-get-started]
- [What is Azure IoT Hub?][]

[Event Hubs]: ../event-hubs/event-hubs-what-is-event-hubs.md
[IoT Hub Developer Guide - Security]: iot-hub-devguide.md#security
[Event Hub - security]: ../event-hubs/event-hubs-authentication-and-security-model-overview.md
[Event Hub publisher policies]: ../event-hubs/event-hubs-overview.md#common-publisher-tasks
[Service Bus Quotas]: ../service-bus/service-bus-quotas.md
[Azure IoT Hub SDKs]: https://github.com/Azure/azure-iot-sdks/blob/master/readme.md
[lnk-get-started]: iot-hub-csharp-csharp-getstarted.md
[What is Azure IoT Hub?]: iot-hub-what-is-iot-hub.md
