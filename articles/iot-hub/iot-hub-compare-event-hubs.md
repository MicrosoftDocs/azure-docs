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
 ms.date="06/06/2016"
 ms.author="elioda"/>

# Comparison of IoT Hub and Event Hubs

One of the main use cases for Azure IoT Hub is to gather telemetry from devices. For this reason, IoT Hub is often compared to [Azure Event Hubs][]. Like IoT Hub, Event Hubs is an event processing service that enables event and telemetry ingress to the cloud at massive scale, with low latency and high reliability.

However, the services have many differences, which are detailed in the following table.

| Area | IoT Hub | Event Hubs |
| ---- | ------- | ---------- |
| Communication patterns | Enables device-to-cloud and cloud-to-device messaging. | Only enables event ingress (usually considered for device-to-cloud scenarios). |
| Device protocol support | Supports AMQP, AMQP over WebSockets, MQTT, and HTTP/1. Additionally IoT Hub works with the [Azure IoT Protocol Gateway][lnk-azure-protocol-gateway], a customizable protocol gateway implementation to support custom protocols. | Supports AMQP, AMQP over WebSockets, and HTTP/1. |
| Security | Provides per-device identity and revocable access control. See the [Security section of the IoT Hub developer guide]. | Provides Event Hubs-wide [shared access policies][Event Hub - security], with limited revocation support through [publisher's policies][Event Hub publisher policies]. IoT solutions are often required to implement a custom solution to support per-device credentials and anti-spoofing measures. |
| Operations monitoring | Enables IoT solutions to subscribe to a rich set of device identity management and connectivity events such as individual device authentication errors, throttling, and bad format exceptions. These events enable you to quickly identify connectivity problems at the individual device level. | Exposes only aggregate metrics. |
| Scale | Is optimized to support millions of simultaneously connected devices. | Can support a more limited number of simultaneous connections--up to 5,000 AMQP connections, as per [Azure Service Bus quotas][]. On the other hand, Event Hubs enables you to specify the partition for each message sent. |
| Device SDKs | Provides [device SDKs][Azure IoT Hub SDKs] for a large variety of platforms and languages. | Is supported on .NET, and C. Also provides AMQP and HTTP send interfaces. |
| File upload | Enables IoT solutions to upload files from devices to the cloud. Includes a file notification endpoint for workflow integration and an operations monitoring category for debugging support. | Uses a claim check pattern to manually request files from devices and provide devices with a storage key for the transaction. |

In summary, even if the only use case is device-to-cloud telemetry ingress, IoT Hub provides a service that is specifically designed for IoT device connectivity. It will continue to expand the value propositions for these scenarios with IoT-specific features. Event Hubs is designed for event ingress at a massive scale, both in the context of inter-datacenter and intra-datacenter scenarios.

It is not uncommon to use both IoT Hub and Event Hubs in the same solution--where IoT Hub handles the device-to-cloud communication, and Event Hubs handles later-stage event ingress into real-time processing engines.

## Next steps

To learn more about planning your IoT Hub deployment, see [Scaling, HA and DR][lnk-scaling].

To further explore the capabilities of IoT Hub, see:

- [Developer guide][lnk-devguide]
- [Exploring device management using the sample UI][lnk-dmui]
- [Simulating a device with the Gateway SDK][lnk-gateway]
- [Using the Azure Portal to manage IoT Hub][lnk-portal]

[Azure Event Hubs]: ../event-hubs/event-hubs-what-is-event-hubs.md
[Security section of the IoT Hub developer guide]: iot-hub-devguide.md#security
[Event Hub - security]: ../event-hubs/event-hubs-authentication-and-security-model-overview.md
[Event Hub publisher policies]: ../event-hubs/event-hubs-overview.md#common-publisher-tasks
[Azure Service Bus quotas]: ../service-bus/service-bus-quotas.md
[Azure IoT Hub SDKs]: https://github.com/Azure/azure-iot-sdks/blob/master/readme.md
[lnk-azure-protocol-gateway]: iot-hub-protocol-gateway.md

[lnk-scaling]: iot-hub-scaling.md
[lnk-devguide]: iot-hub-devguide.md
[lnk-dmui]: iot-hub-device-management-ui-sample.md
[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
[lnk-portal]: iot-hub-manage-through-portal.md