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
 ms.date="03/14/2016"
 ms.author="elioda"/>

# Scaling IoT Hub

Azure IoT Hub can support up to a million simultaneously connected devices. For more information, see [IoT Hub pricing][lnk-pricing]. Each IoT Hub unit allows a number of daily messages.

In order to properly scale your solution, consider your particular use of IoT Hub. In particular, consider the required peak throughput for the following categories of operations:

* Device-to-cloud messages
* Cloud-to-device messages
* Identity registry operations

In addition to this throughput information, see [IoT Hub quotas and throttles][] and design your solution accordingly.

## Device-to-cloud and cloud-to-device message throughput

The best way to size an IoT Hub solution is to evaluate the traffic on a per-unit basis.

Device-to-cloud messages follow these sustained throughput guidelines.

| Tier | Sustained throughput | Sustained send rate |
| ---- | -------------------- | ------------------- |
| S1 | Up to 1111 KB/minute per unit<br/>(1.5 GB/day/unit) | Average of 278 messages/minute per unit<br/>(400,000 messages/day per unit) |
| S2 | Up to 16 MB/minute per unit<br/>(22.8 GB/day/unit) | Average of 4167 messages/minute per unit<br/>(6 million messages/day per unit) |
| S3 | Up to 814 MB/minute per unit<br/>(1144.4 GB/day/unit) | Average of 208,333 messages/minute per unit<br/>(300 million messages/day per unit) |

The performance of cloud-to-device messages scales per device, with each device receiving up to 5 messages per minute.

## Identity registry operation throughput

IoT Hub identity registry operations are not supposed to be runtime operations, as they are mostly related to device provisioning.

For specific burst performance numbers, see [IoT Hub quotas and throttles][].

## Sharding

While a single IoT hub can scale to millions of devices, sometimes your solution requires specific performance characteristics that a single IoT hub cannot guarantee. In that case, it is recommended that you partition your devices into multiple IoT hubs. Multiple IoT hubs smooth traffic bursts and obtain the required throughput or operation rates that are required.

## Next steps

To further explore the capabilities of IoT Hub, see:

- [Developer guide][lnk-devguide]
- [Exploring device management using the sample UI][lnk-dmui]
- [Simulating a device with the Gateway SDK][lnk-gateway]
- [Using the Azure Portal to manage IoT Hub][lnk-portal]

[lnk-pricing]: https://azure.microsoft.com/pricing/details/iot-hub
[IoT Hub Quotas and Throttles]: iot-hub-devguide.md#throttling

[lnk-design]: iot-hub-guidance.md
[lnk-mqtt]: iot-hub-mqtt-support.md
[lnk-devices]: iot-hub-tested-configurations.md
[lnk-protocols]: iot-hub-protocol-gateway.md
[lnk-compare]: iot-hub-compare-event-hubs.md
[lnk-scaling]: iot-hub-scaling.md
[lnk-devguide]: iot-hub-devguide.md
[lnk-dmui]: iot-hub-device-management-ui-sample.md
[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
[lnk-portal]: iot-hub-manage-through-portal.md