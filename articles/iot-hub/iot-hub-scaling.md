---
title: Azure IoT Hub scaling | Microsoft Docs
description: How to scale your IoT hub to support your anticipated message throughput. Includes a summary of the supported throughput for each tier and options for sharding.
services: iot-hub
documentationcenter: ''
author: fsautomata
manager: timlt
editor: ''

ms.assetid: e7bd4968-db46-46cf-865d-9c944f683832
ms.service: iot-hub
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/19/2016
ms.author: elioda
ms.custom: H1Hack27Feb2017

---
# Scale your IoT hub solution
Azure IoT Hub can support up to a million simultaneously connected devices. For more information, see [IoT Hub pricing][lnk-pricing]. Each IoT Hub unit allows a certain number of daily messages.

To properly scale your solution, consider your particular use of IoT Hub. In particular, consider the required peak throughput for the following categories of operations:

* Device-to-cloud messages
* Cloud-to-device messages
* Identity registry operations

In addition to this throughput information, see [IoT Hub quotas and throttles][IoT Hub quotas and throttles] and design your solution accordingly.

## Device-to-cloud and cloud-to-device message throughput
The best way to size an IoT Hub solution is to evaluate the traffic on a per-unit basis.

Device-to-cloud messages follow these sustained throughput guidelines.

| Tier | Sustained throughput | Sustained send rate |
| --- | --- | --- |
| S1 |Up to 1111 KB/minute per unit<br/>(1.5 GB/day/unit) |Average of 278 messages/minute per unit<br/>(400,000 messages/day per unit) |
| S2 |Up to 16 MB/minute per unit<br/>(22.8 GB/day/unit) |Average of 4,167 messages/minute per unit<br/>(6 million messages/day per unit) |
| S3 |Up to 814 MB/minute per unit<br/>(1144.4 GB/day/unit) |Average of 208,333 messages/minute per unit<br/>(300 million messages/day per unit) |

## Identity registry operation throughput
IoT Hub identity registry operations are not supposed to be run-time operations, as they are mostly related to device provisioning.

For specific burst performance numbers, see [IoT Hub quotas and throttles][IoT Hub quotas and throttles].

## Sharding
While a single IoT hub can scale to millions of devices, sometimes your solution requires specific performance characteristics that a single IoT hub cannot guarantee. In that case, it is recommended that you partition your devices into multiple IoT hubs. Multiple IoT hubs smooth traffic bursts and obtain the required throughput or operation rates that are required.

## Next steps
To further explore the capabilities of IoT Hub, see:

* [IoT Hub developer guide][lnk-devguide]
* [Simulating a device with the IoT Gateway SDK][lnk-gateway]

[lnk-pricing]: https://azure.microsoft.com/pricing/details/iot-hub
[IoT Hub quotas and throttles]: iot-hub-devguide-quotas-throttling.md

[lnk-devguide]: iot-hub-devguide.md
[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
