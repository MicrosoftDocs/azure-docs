<properties
 pageTitle="Azure IoT Hub Scaling | Microsoft Azure"
 description="Describes how to scale Azure IoT Hub."
 services="iot-hub"
 documentationCenter=".net"
 authors="fsautomata"
 manager="kevinmil"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="tbd"
 ms.date="10/02/2015"
 ms.author="elioda"/>

# Scaling IoT Hub

IoT Hub can support up to a million simultaneously connected devices by increasing the number of IoT Hub S1 or S2 units to 2,000. For more information, see [IoT Hub Pricing][lnk-pricing].

Each IoT Hub unit allows a certain number of device identities in the registry, which can all be simultaneously connected, and a number of daily messages.

In order to properly scale your solution, consider your particular use of IoT Hub. In particular, consider the required peak throughput for the following categories of operations:

* Device to cloud messages
* Cloud to device messages
* Identity registry operations

In addition to this throughput information, please see the [IoT Hub Quotas and Throttles][] and design your solution accordingly.

## Device to cloud and cloud-to-device message throughput

The best way to size an IoT Hub solution is to evaluate the traffic on a per-device basis.

Device-to-cloud messages follow these sustained throughput guidelines.

| Tier | Sustained throughput | Sustained send rate |
| ---- | -------------------- | ------------------- |
| S1 | up to 8kb/hour per device | average of 4 messages/hour per device |
| S2 | up to 4kb/min per device | average of 2 messages/min per device |

When receiving device-to-cloud messages the application back-end can expect the following maximum throughput (across all readers).

| Tier | Sustained throughput |
| ---- | -------------------- |
| S1 | up to 120 Kb/min per unit, with 2 Mb/s minimum. |
| S2 | up to 4 Mb/min per unit, with 2 Mb/s minimum |

Cloud to device messages performance scales per device, with each device receiving up to 5 messages per minute.

## Identity registry operation throughput

IoT Hub identity registry operations are not supposed to be runtime operations, as they are mostly related to device provisioning.

For specific burst performance numbers, see [IoT Hub Quotas and Throttles][].

## Sharding

While a single IoT hub can scale to millions of devices, sometimes your solution requires specific performance characteristics that a single IoT hub cannot guarantee. In that case, it is recommended that you partition your devices into multiple IoT hubs, in order to smooth traffic bursts, and obtain the required throughput or operation rates required.

## Next steps

Follow these links to learn more about Azure IoT Hub:

- [Get started with IoT Hubs (Tutorial)][lnk-get-started]
- [What is Azure IoT Hub?][]

[lnk-pricing]: https://azure.microsoft.com/pricing/details/iot-hub
[IoT Hub Quotas and Throttles]: iot-hub-devguide.md#throttling

[lnk-get-started]: iot-hub-csharp-csharp-getstarted.md
[What is Azure IoT Hub?]: iot-hub-what-is-iot-hub.md