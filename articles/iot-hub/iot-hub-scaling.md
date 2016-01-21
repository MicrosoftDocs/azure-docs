<properties
 pageTitle="Azure IoT Hub scaling | Microsoft Azure"
 description="Describes how to scale Azure IoT Hub."
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

# Scaling IoT Hub

Azure IoT Hub can support up to a million simultaneously connected devices by increasing the number of IoT Hub S1 tier units or S2 tier units to 2,000. For more information, see [IoT Hub pricing][lnk-pricing].

Each IoT Hub unit allows a certain number of devices in the registry, and these devices can all be simultaneously connected. Each unit also allows a number of daily messages.

In order to properly scale your solution, consider your particular use of IoT Hub. In particular, consider the required peak throughput for the following categories of operations:

* Device-to-cloud messages
* Cloud-to-device messages
* Identity registry operations

In addition to this throughput information, see [IoT Hub quotas and throttles][] and design your solution accordingly.

## Device-to-cloud and cloud-to-device message throughput

The best way to size an IoT Hub solution is to evaluate the traffic on a per-device basis.

Device-to-cloud messages follow these sustained throughput guidelines.

| Tier | Sustained throughput | Sustained send rate |
| ---- | -------------------- | ------------------- |
| S1 | Up to 8 KB/hr per device | Average of 4 messages/hr per device |
| S2 | Up to 4 KB/min per device | Average of 2 messages/min per device |

When receiving device-to-cloud messages, the application back end can expect the following maximum throughput (across all readers).

| Tier | Sustained throughput |
| ---- | -------------------- |
| S1 | Up to 120 KB/min per unit, with 2 MB/s minimum |
| S2 | Up to 4 MB/min per unit, with 2 MB/s minimum |

The performance of cloud-to-device messages scales per device, with each device receiving up to 5 messages per minute.

## Identity registry operation throughput

IoT Hub identity registry operations are not supposed to be runtime operations, as they are mostly related to device provisioning.

For specific burst performance numbers, see [IoT Hub quotas and throttles][].

## Sharding

While a single IoT hub can scale to millions of devices, sometimes your solution requires specific performance characteristics that a single IoT hub cannot guarantee. In that case, it is recommended that you partition your devices into multiple IoT hubs. Multiple IoT hubs smooth traffic bursts and obtain the required throughput or operation rates that are required.

## Next steps

Follow these links to learn more about Azure IoT Hub:

- [Get started with IoT Hub (Tutorial)][lnk-get-started]
- [What is Azure IoT Hub?][]

[lnk-pricing]: https://azure.microsoft.com/pricing/details/iot-hub
[IoT Hub Quotas and Throttles]: iot-hub-devguide.md#throttling

[lnk-get-started]: iot-hub-csharp-csharp-getstarted.md
[What is Azure IoT Hub?]: iot-hub-what-is-iot-hub.md
