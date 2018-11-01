---
title: Azure IoT Hub scaling | Microsoft Docs
description: How to scale your IoT hub to support your anticipated message throughput and desired features. Includes a summary of the supported throughput for each tier and options for sharding.
author: kgremban
manager: timlt
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/02/2018
ms.author: kgremban
---

# Choose the right IoT Hub tier for your solution

Every IoT solution is different, so Azure IoT Hub offers several options based on pricing and scale. This article is meant to help you evaluate your IoT Hub needs. For pricing information about IoT Hub tiers refer to [IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub). 

To decide which IoT Hub tier is right for your solution, ask yourself two questions:

**What features do I plan to use?**
Azure IoT Hub offers two tiers, basic and standard, that differ in the number of features they support. If your IoT solution is based around collecting data from devices and analyzing it centrally then the basic tier is probably right for you. If you want to use more advanced configurations to control IoT devices remotely or distribute some of your workloads onto the devices themselves then you should consider the standard tier. For a detailed breakdown of which features are included in each tier continue to [Basic and standard tiers](#basic-and-standard-tiers).

**How much data do I plan to move daily?**
Each IoT Hub tier is available in three sizes, based around how much data throughput they can handle in any given day. These sizes are numerically identified as 1, 2, and 3. For example, each unit of a level 1 IoT hub can handle 400 thousand messages a day, while a level 3 unit can handle 300 million. For more details about the data guidelines, continue to [Message throughput](#message-throughput).

## Basic and standard tiers

The standard tier of IoT Hub enables all features, and is required for any IoT solutions that want to make use of the bi-directional communication capabilities. The basic tier enables a subset of the features and is intended for IoT solutions that only need uni-directional communication from devices to the cloud. Both tiers offer the same security and authentication features.

Once you create your IoT hub you can upgrade from the basic tier to the standard tier without interrupting your existing operations. For more information, see [How to upgrade your IoT hub](iot-hub-upgrade.md). Note that the maximum partition limit for basic tier IoT Hub is 8 and for standard tier is 32. Most IoT hubs only need 4 partitions. The partition limit is chosen when IoT Hub is created, and relates the device-to-cloud messages to the number of simultaneous readers of these messages. This value remains unchanged when you migrate from basic tier to standard tier. Also note that only one type of [edition](https://azure.microsoft.com/pricing/details/iot-hub/) within a tier can be chosen per IoT Hub. For example, you can create an IoT Hub with multiple units of S1, but not with a mix of units from different editions, such as S1 and B3, or S1 and S2.

| Capability | Basic tier | Standard tier |
| ---------- | ---------- | ------------- |
| [Device-to-cloud telemetry](iot-hub-devguide-messaging.md) | Yes | Yes |
| [Per-device identity](iot-hub-devguide-identity-registry.md) | Yes | Yes |
| [Message routing](iot-hub-devguide-messages-read-custom.md) and [Event Grid integration](iot-hub-event-grid.md) | Yes | Yes |
| [HTTP, AMQP, and MQTT protocols](iot-hub-devguide-protocols.md) | Yes | Yes |
| [Device Provisioning Service](../iot-dps/about-iot-dps.md) | Yes | Yes |
| [Monitoring and diagnostics](iot-hub-monitor-resource-health.md) | Yes | Yes |
| [Cloud-to-device messaging](iot-hub-devguide-c2d-guidance.md) |   | Yes |
| [Device twins](iot-hub-devguide-device-twins.md), [Module twins](iot-hub-devguide-module-twins.md) and [Device management](iot-hub-device-management-overview.md) |   | Yes |
| [Azure IoT Edge](../iot-edge/about-iot-edge.md) |   | Yes |

IoT Hub also offers a free tier that is meant for testing and evaluation. It has all the capabilities of the standard tier, but limited messaging allowances. You cannot upgrade from the free tier to either basic or standard. 

### IoT Hub REST APIs

The difference in supported capabilities between the basic and standard tiers of IoT Hub means that some API calls do not work with basic tier hubs. The following table shows which APIs are available: 

| API | Basic tier | Standard tier |
| --- | ---------- | ------------- |
| [Delete device](https://docs.microsoft.com/rest/api/iothub/service/deletedevice) | Yes | Yes |
| [Get device](https://docs.microsoft.com/rest/api/iothub/service/getdevice) | Yes | Yes |
| Delete module | Yes | Yes |
| Get module | Yes | Yes |
| [Get registry statistics](https://docs.microsoft.com/rest/api/iothub/service/getdeviceregistrystatistics) | Yes | Yes |
| [Get services statistics](https://docs.microsoft.com/rest/api/iothub/service/getservicestatistics) | Yes | Yes |
| [Create Or Update Device](https://docs.microsoft.com/rest/api/iothub/service/createorupdatedevice) | Yes | Yes |
| Put module | Yes | Yes |
| [Query IoT Hub](https://docs.microsoft.com/rest/api/iothub/service/queryiothub) | Yes | Yes |
| Query modules | Yes | Yes |
| [Create file upload SAS URI](https://docs.microsoft.com/rest/api/iothub/device/createfileuploadsasuri) | Yes | Yes |
| [Receive device bound notification](https://docs.microsoft.com/rest/api/iothub/device/receivedeviceboundnotification) | Yes | Yes |
| [Send device event](https://docs.microsoft.com/rest/api/iothub/device/senddeviceevent) | Yes | Yes |
| Send module event | Yes | Yes |
| [Update file upload status](https://docs.microsoft.com/rest/api/iothub/device/updatefileuploadstatus) | Yes | Yes |
| [Bulk device operation](https://docs.microsoft.com/rest/api/iot-dps/deviceenrollment/bulkoperation) | Yes, except for IoT Edge capabilites | Yes | 
| [Purge command queue](https://docs.microsoft.com/rest/api/iothub/service/purgecommandqueue) |   | Yes |
| [Get device twin](https://docs.microsoft.com/rest/api/iothub/service/gettwin) |   | Yes |
| Get module twin |   | Yes |
| [Invoke device method](https://docs.microsoft.com/rest/api/iothub/service/invokedevicemethod) |   | Yes |
| [Update device twin](https://docs.microsoft.com/rest/api/iothub/service/updatetwin) |   | Yes | 
| Update module twin |   | Yes | 
| [Abandon device bound notification](https://docs.microsoft.com/rest/api/iothub/device/abandondeviceboundnotification) |   | Yes |
| [Complete device bound notification](https://docs.microsoft.com/rest/api/iothub/device/completedeviceboundnotification) |   | Yes |
| [Cancel job](https://docs.microsoft.com/rest/api/iothub/service/canceljob) |   | Yes |
| [Create job](https://docs.microsoft.com/rest/api/iothub/service/createjob) |   | Yes |
| [Get job](https://docs.microsoft.com/rest/api/iothub/service/getjob) |   | Yes |
| [Query jobs](https://docs.microsoft.com/rest/api/iothub/service/queryjobs) |   | Yes |

## Message throughput

The best way to size an IoT Hub solution is to evaluate the traffic on a per-unit basis. In particular, consider the required peak throughput for the following categories of operations:

* Device-to-cloud messages
* Cloud-to-device messages
* Identity registry operations

Traffic is measured on a per-unit basis, not per hub. A level 1 or 2 IoT Hub instance can have as many as 200 units associated with it. A level 3 IoT Hub instance can have up to 10 units. Once you create your IoT hub you can change the number of units or move between the 1, 2, and 3 sizes within a specific tier without interrupting your existing operations. For more information, see [How to upgrade your IoT Hub](iot-hub-upgrade.md).

As an example of each tier's traffic capabilities, device-to-cloud messages follow these sustained throughput guidelines:

| Tier | Sustained throughput | Sustained send rate |
| --- | --- | --- |
| B1, S1 |Up to 1111 KB/minute per unit<br/>(1.5 GB/day/unit) |Average of 278 messages/minute per unit<br/>(400,000 messages/day per unit) |
| B2, S2 |Up to 16 MB/minute per unit<br/>(22.8 GB/day/unit) |Average of 4,167 messages/minute per unit<br/>(6 million messages/day per unit) |
| B3, S3 |Up to 814 MB/minute per unit<br/>(1144.4 GB/day/unit) |Average of 208,333 messages/minute per unit<br/>(300 million messages/day per unit) |

In addition to this throughput information, see [IoT Hub quotas and throttles][IoT Hub quotas and throttles] and design your solution accordingly.

### Identity registry operation throughput
IoT Hub identity registry operations are not supposed to be run-time operations, as they are mostly related to device provisioning.

For specific burst performance numbers, see [IoT Hub quotas and throttles][IoT Hub quotas and throttles].

## Auto-scale
If you are approaching the allowed message limit on your IoT Hub, you can use these [steps to automatically scale](https://azure.microsoft.com/resources/samples/iot-hub-dotnet-autoscale/) to increment an IoT Hub unit in the same IoT Hub tier.

## Sharding
While a single IoT hub can scale to millions of devices, sometimes your solution requires specific performance characteristics that a single IoT hub cannot guarantee. In that case you can partition your devices across multiple IoT hubs. Multiple IoT hubs smooth traffic bursts and obtain the required throughput or operation rates that are required.

## Next steps

* For additional information about IoT Hub capabilities and performance details, see [IoT Hub pricing][link-pricing] or [IoT Hub quotas and throttles][IoT Hub quotas and throttles].
* To change your IoT Hub tier, follow the steps in [Upgrade your IoT hub](iot-hub-upgrade.md).

[lnk-pricing]: https://azure.microsoft.com/pricing/details/iot-hub
[IoT Hub quotas and throttles]: iot-hub-devguide-quotas-throttling.md

[lnk-devguide]: iot-hub-devguide.md
[lnk-iotedge]: ../iot-edge/tutorial-simulate-device-linux.md
