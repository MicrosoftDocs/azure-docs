---
title: Azure IoT Hub scaling | Microsoft Docs
description: How to scale your IoT hub to support your anticipated message throughput and desired features. Includes a summary of the supported throughput for each tier and options for sharding.
author: wesmc7777
manager: timlt
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 06/28/2019
ms.author: wesmc
ms.custom: [amqp, mqtt]
---
# Choose the right IoT Hub tier for your solution

Every IoT solution is different, so Azure IoT Hub offers several options based on pricing and scale. This article is meant to help you evaluate your IoT Hub needs. For pricing information about IoT Hub tiers, see [IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub).

To decide which IoT Hub tier is right for your solution, ask yourself two questions:

**What features do I plan to use?**

Azure IoT Hub offers two tiers, basic and standard, that differ in the number of features they support. If your IoT solution is based around collecting data from devices and analyzing it centrally, then the basic tier is probably right for you. If you want to use more advanced configurations to control IoT devices remotely or distribute some of your workloads onto the devices themselves, then you should consider the standard tier. For a detailed breakdown of which features are included in each tier continue to [Basic and standard tiers](#basic-and-standard-tiers).

**How much data do I plan to move daily?**

Each IoT Hub tier is available in three sizes, based around how much data throughput they can handle in any given day. These sizes are numerically identified as 1, 2, and 3. For example, each unit of a level 1 IoT hub can handle 400 thousand messages a day, while a level 3 unit can handle 300 million. For more details about the data guidelines, continue to [Message throughput](#message-throughput).

## Basic and standard tiers

The standard tier of IoT Hub enables all features, and is required for any IoT solutions that want to make use of the bi-directional communication capabilities. The basic tier enables a subset of the features and is intended for IoT solutions that only need uni-directional communication from devices to the cloud. Both tiers offer the same security and authentication features.

Only one type of [edition](https://azure.microsoft.com/pricing/details/iot-hub/) within a tier can be chosen per IoT Hub. For example, you can create an IoT Hub with multiple units of S1, but not with a mix of units from different editions, such as S1 and S2.

| Capability | Basic tier | Free/Standard tier |
| ---------- | ---------- | ------------- |
| [Device-to-cloud telemetry](iot-hub-devguide-messaging.md) | Yes | Yes |
| [Per-device identity](iot-hub-devguide-identity-registry.md) | Yes | Yes |
| [Message routing](iot-hub-devguide-messages-read-custom.md), [message enrichments](iot-hub-message-enrichments-overview.md), and [Event Grid integration](iot-hub-event-grid.md) | Yes | Yes |
| [HTTP, AMQP, and MQTT protocols](iot-hub-devguide-protocols.md) | Yes | Yes |
| [Device Provisioning Service](../iot-dps/about-iot-dps.md) | Yes | Yes |
| [Monitoring and diagnostics](iot-hub-monitor-resource-health.md) | Yes | Yes |
| [Cloud-to-device messaging](iot-hub-devguide-c2d-guidance.md) |   | Yes |
| [Device twins](iot-hub-devguide-device-twins.md), [Module twins](iot-hub-devguide-module-twins.md), and [Device management](iot-hub-device-management-overview.md) |   | Yes |
| [Device streams (preview)](iot-hub-device-streams-overview.md) |   | Yes |
| [Azure IoT Edge](../iot-edge/about-iot-edge.md) |   | Yes |
| [IoT Plug and Play Preview](../iot-pnp/overview-iot-plug-and-play.md) |   | Yes |

IoT Hub also offers a free tier that is meant for testing and evaluation. It has all the capabilities of the standard tier, but limited messaging allowances. You cannot upgrade from the free tier to either basic or standard.

## Partitions

Azure IoT Hubs contain many core components of [Azure Event Hubs](../event-hubs/event-hubs-features.md), including [Partitions](../event-hubs/event-hubs-features.md#partitions). Event streams for IoT Hubs are generally populated with incoming telemetry data that is reported by various IoT devices. The partitioning of the event stream is used to reduce contentions that occur when concurrently reading and writing to event streams.

The partition limit is chosen when IoT Hub is created, and cannot be changed. The maximum partition limit for basic tier IoT Hub and standard tier IoT Hub is 32. Most IoT hubs only need 4 partitions. For more information on determining the partitions, see the Event Hubs FAQ [How many partitions do I need?](../event-hubs/event-hubs-faq.md#how-many-partitions-do-i-need)

## Tier upgrade

Once you create your IoT hub, you can upgrade from the basic tier to the standard tier without interrupting your existing operations. For more information, see [How to upgrade your IoT hub](iot-hub-upgrade.md).

The partition configuration remains unchanged when you migrate from basic tier to standard tier.

> [!NOTE]
> The free tier does not support upgrading to basic or standard.

## IoT Hub REST APIs

The difference in supported capabilities between the basic and standard tiers of IoT Hub means that some API calls do not work with basic tier hubs. The following table shows which APIs are available:

| API | Basic tier | Free/Standard tier |
| --- | ---------- | ------------- |
| [Delete device](https://docs.microsoft.com/rest/api/iothub/service/registrymanager/deletedevice) | Yes | Yes |
| [Get device](https://docs.microsoft.com/rest/api/iothub/service/registrymanager/getdevice) | Yes | Yes |
| [Delete module](https://docs.microsoft.com/rest/api/iothub/service/registrymanager/deletemodule) | Yes | Yes |
| [Get module](https://docs.microsoft.com/rest/api/iothub/service/registrymanager/getmodule) | Yes | Yes |
| [Get registry statistics](https://docs.microsoft.com/rest/api/iothub/service/registrymanager/getdevicestatistics) | Yes | Yes |
| [Get services statistics](https://docs.microsoft.com/rest/api/iothub/service/registrymanager/getservicestatistics) | Yes | Yes |
| [Create or update device](https://docs.microsoft.com/rest/api/iothub/service/registrymanager/createorupdatedevice) | Yes | Yes |
| [Create or update module](https://docs.microsoft.com/rest/api/iothub/service/registrymanager/createorupdatemodule) | Yes | Yes |
| [Query IoT Hub](https://docs.microsoft.com/rest/api/iothub/service/registrymanager/queryiothub) | Yes | Yes |
| [Create file upload SAS URI](https://docs.microsoft.com/rest/api/iothub/device/createfileuploadsasuri) | Yes | Yes |
| [Receive device bound notification](https://docs.microsoft.com/rest/api/iothub/device/receivedeviceboundnotification) | Yes | Yes |
| [Send device event](https://docs.microsoft.com/rest/api/iothub/device/senddeviceevent) | Yes | Yes |
| Send module event | AMQP and MQTT only | AMQP and MQTT only |
| [Update file upload status](https://docs.microsoft.com/rest/api/iothub/device/updatefileuploadstatus) | Yes | Yes |
| [Bulk device operation](https://docs.microsoft.com/rest/api/iothub/service/registrymanager/bulkdevicecrud) | Yes, except for IoT Edge capabilities | Yes |
| [Cancel import export job](https://docs.microsoft.com/rest/api/iothub/service/jobclient/cancelimportexportjob) | Yes | Yes |
| [Create import export job](https://docs.microsoft.com/rest/api/iothub/service/jobclient/createimportexportjob) | Yes | Yes |
| [Get import export job](https://docs.microsoft.com/rest/api/iothub/service/jobclient/getimportexportjob) | Yes | Yes |
| [Get import export jobs](https://docs.microsoft.com/rest/api/iothub/service/jobclient/getimportexportjobs) | Yes | Yes |
| [Purge command queue](https://docs.microsoft.com/rest/api/iothub/service/registrymanager/purgecommandqueue) |   | Yes |
| [Get device twin](https://docs.microsoft.com/rest/api/iothub/service/twin/getdevicetwin) |   | Yes |
| [Get module twin](https://docs.microsoft.com/rest/api/iothub/service/twin/getmoduletwin) |   | Yes |
| [Invoke device method](https://docs.microsoft.com/rest/api/iothub/service/devicemethod/invokedevicemethod) |   | Yes |
| [Update device twin](https://docs.microsoft.com/rest/api/iothub/service/twin/updatedevicetwin) |   | Yes |
| [Update module twin](https://docs.microsoft.com/rest/api/iothub/service/twin/updatemoduletwin) |   | Yes |
| [Abandon device bound notification](https://docs.microsoft.com/rest/api/iothub/device/abandondeviceboundnotification) |   | Yes |
| [Complete device bound notification](https://docs.microsoft.com/rest/api/iothub/device/completedeviceboundnotification) |   | Yes |
| [Cancel job](https://docs.microsoft.com/rest/api/iothub/service/jobclient/canceljob) |   | Yes |
| [Create job](https://docs.microsoft.com/rest/api/iothub/service/jobclient/createjob) |   | Yes |
| [Get job](https://docs.microsoft.com/rest/api/iothub/service/jobclient/getjob) |   | Yes |
| [Query jobs](https://docs.microsoft.com/rest/api/iothub/service/jobclient/queryjobs) |   | Yes |

## Message throughput

The best way to size an IoT Hub solution is to evaluate the traffic on a per-unit basis. In particular, consider the required peak throughput for the following categories of operations:

* Device-to-cloud messages
* Cloud-to-device messages
* Identity registry operations

Traffic is measured for your IoT hub on a per-unit basis. When you create an IoT hub, you choose its tier and edition, and set the number of units available. You can purchase up to 200 units for the B1, B2, S1, or S2 edition, or up to 10 units for the B3 or S3 edition. After your IoT hub is created, you can change the number of units available within its edition, upgrade or downgrade between editions within its tier (B1 to B2), or upgrade from the basic to the standard tier (B1 to S1) without interrupting your existing operations. For more information, see [How to upgrade your IoT hub](iot-hub-upgrade.md).  

As an example of each tier's traffic capabilities, device-to-cloud messages follow these sustained throughput guidelines:

| Tier edition | Sustained throughput | Sustained send rate |
| --- | --- | --- |
| B1, S1 |Up to 1111 KB/minute per unit<br/>(1.5 GB/day/unit) |Average of 278 messages/minute per unit<br/>(400,000 messages/day per unit) |
| B2, S2 |Up to 16 MB/minute per unit<br/>(22.8 GB/day/unit) |Average of 4,167 messages/minute per unit<br/>(6 million messages/day per unit) |
| B3, S3 |Up to 814 MB/minute per unit<br/>(1144.4 GB/day/unit) |Average of 208,333 messages/minute per unit<br/>(300 million messages/day per unit) |

Device-to-cloud throughput is only one of the metrics you need to consider when designing an IoT solution. For more comprehensive information, see [IoT Hub quotas and throttles](iot-hub-devguide-quotas-throttling.md).

### Identity registry operation throughput

IoT Hub identity registry operations are not supposed to be run-time operations, as they are mostly related to device provisioning.

For specific burst performance numbers, see [IoT Hub quotas and throttles](iot-hub-devguide-quotas-throttling.md).

## Auto-scale

If you are approaching the allowed message limit on your IoT hub, you can use these [steps to automatically scale](https://azure.microsoft.com/resources/samples/iot-hub-dotnet-autoscale/) to increment an IoT Hub unit in the same IoT Hub tier.

## Next steps

* For more information about IoT Hub capabilities and performance details, see [IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub) or [IoT Hub quotas and throttles](iot-hub-devguide-quotas-throttling.md).

* To change your IoT Hub tier, follow the steps in [Upgrade your IoT hub](iot-hub-upgrade.md).
