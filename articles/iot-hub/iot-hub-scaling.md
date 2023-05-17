---
title: Azure IoT Hub scaling
description: How to choose the correct IoT hub tier and size to support your anticipated message throughput and desired features.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: concept-article
ms.date: 02/09/2023
ms.custom: [amqp, mqtt, 'Role: Cloud Development', 'Role: Operations']
---

# Choose the right IoT Hub tier and size for your solution

Every IoT solution is different, so Azure IoT Hub offers several options based on pricing and scale. This article is meant to help you evaluate your IoT Hub needs. For pricing information about IoT Hub tiers, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub).

To decide which IoT Hub tier is right for your solution, ask yourself two questions:

**What features do I plan to use?**

Azure IoT Hub offers two tiers, basic and standard, that differ in the number of features they support. If your IoT solution is based around collecting data from devices and analyzing it centrally, then the basic tier is probably right for you. If you want to use more advanced configurations to control IoT devices remotely or distribute some of your workloads onto the devices themselves, then you should consider the standard tier. For a detailed breakdown of which features are included in each tier, continue to [Basic and standard tiers](#basic-and-standard-tiers).

**How much data do I plan to move daily?**

Each IoT Hub tier is available in three sizes, based around how much data throughput they can handle in any given day. These sizes are numerically identified as 1, 2, and 3. For example, each unit of a level 1 IoT hub can handle 400 thousand messages a day, while a level 3 unit can handle 300 million. For more details about the data guidelines, continue to [Tier editions and units](#tier-editions-and-units).

## Basic and standard tiers

The standard tier of IoT Hub enables all features, and is required for any IoT solutions that want to make use of the bi-directional communication capabilities. The basic tier enables a subset of the features and is intended for IoT solutions that only need uni-directional communication from devices to the cloud. Both tiers offer the same security and authentication features.

| Capability | Basic tier | Standard tier |
| ---------- | ---------- | ------------- |
| [Device-to-cloud telemetry](iot-hub-devguide-messaging.md) | Yes | Yes |
| [Per-device identity](iot-hub-devguide-identity-registry.md) | Yes | Yes |
| [Message routing](iot-hub-devguide-messages-d2c.md), [message enrichments](iot-hub-message-enrichments-overview.md), and [Event Grid integration](iot-hub-event-grid.md) | Yes | Yes |
| [HTTP, AMQP, and MQTT protocols](iot-hub-devguide-protocols.md) | Yes | Yes |
| [Device Provisioning Service](../iot-dps/about-iot-dps.md) | Yes | Yes |
| [Monitoring and diagnostics](monitor-iot-hub.md) | Yes | Yes |
| [Cloud-to-device messaging](iot-hub-devguide-c2d-guidance.md) |   | Yes |
| [Device twins](iot-hub-devguide-device-twins.md), [module twins](iot-hub-devguide-module-twins.md), and [device management](iot-hub-device-management-overview.md) |   | Yes |
| [Device streams (preview)](iot-hub-device-streams-overview.md) |   | Yes |
| [Azure IoT Edge](../iot-edge/about-iot-edge.md) |   | Yes |
| [IoT Plug and Play](../iot-develop/overview-iot-plug-and-play.md) |   | Yes |

IoT Hub also offers a free tier that is meant for testing and evaluation. It has all the capabilities of the standard tier, but includes limited messaging allowances. You can't upgrade from the free tier to either the basic or standard tier.

### IoT Hub REST APIs

The difference in supported capabilities between the basic and standard tiers of IoT Hub means that some API calls don't work with basic tier IoT hubs. The following table shows which APIs are available:

| API | Basic tier | Standard tier |
| --- | ---------- | ------------- |
| [Create or update device](/rest/api/iothub/service/devices/create-or-update-identity), [Get device](/rest/api/iothub/service/devices/get-identity), [Delete device](/rest/api/iothub/service/devices/delete-identity) | Yes | Yes |
| [Create or update module](/rest/api/iothub/service/modules/create-or-update-identity), [Get module](/rest/api/iothub/service/modules/get-identity), [Delete module](/rest/api/iothub/service/modules/delete-identity) | Yes | Yes |
| [Get registry statistics](/rest/api/iothub/service/statistics/get-device-statistics) | Yes | Yes |
| [Get services statistics](/rest/api/iothub/service/statistics/get-service-statistics) | Yes | Yes |
| [Query IoT Hub](/rest/api/iothub/iot-hub-resource/get) | Yes | Yes |
| [Create file upload SAS URI](/rest/api/iothub/device/createfileuploadsasuri) | Yes | Yes |
| [Receive device bound notification](/rest/api/iothub/device/receivedeviceboundnotification) | Yes | Yes |
| [Send device event](/rest/api/iothub/device/senddeviceevent) | Yes | Yes |
| Send module event | AMQP and MQTT only | AMQP and MQTT only |
| [Update file upload status](/rest/api/iothub/device/updatefileuploadstatus) | Yes | Yes |
| [Bulk device operation](/rest/api/iothub/service/bulk-registry/update-registry) | Yes, except for IoT Edge capabilities | Yes |
| [Create import export job](/rest/api/iothub/service/jobs/createimportexportjob), [Get import export job](/rest/api/iothub/service/jobs/getimportexportjob), [Cancel import export job](/rest/api/iothub/service/jobs/cancelimportexportjob) | Yes | Yes |
| [Get device twin](/rest/api/iothub/service/devices/get-twin), [Update device twin](/rest/api/iothub/service/devices/update-twin) |   | Yes |
| [Get module twin](/rest/api/iothub/service/modules/get-twin), [Update module twin](/rest/api/iothub/service/modules/update-twin) |   | Yes |
| [Invoke device method](/rest/api/iothub/service/devices/invoke-method) |   | Yes |
| [Abandon device bound notification](/rest/api/iothub/device/abandondeviceboundnotification) |   | Yes |
| [Complete device bound notification](/rest/api/iothub/device/completedeviceboundnotification) |   | Yes |
| [Create job](/rest/api/iothub/service/jobs/create-scheduled-job), [Get job](/rest/api/iothub/service/jobs/get-scheduled-job), [Cancel job](/rest/api/iothub/service/jobs/cancel-scheduled-job) |   | Yes |
| [Query jobs](/rest/api/iothub/service/jobs/query-scheduled-jobs) |   | Yes |

### Partitions

Azure IoT hubs contain many core components from [Azure Event Hubs](../event-hubs/event-hubs-features.md), including [partitions](../event-hubs/event-hubs-features.md#partitions). Event streams for IoT hubs are populated with incoming telemetry data that is reported by various IoT devices. The partitioning of the event stream is used to reduce contentions that occur when concurrently reading and writing to event streams.

The partition limit is chosen when an IoT hub is created, and can't be changed. The maximum limit of device-to-cloud partitions for basic tier and standard tier IoT hubs is 32. Most IoT hubs only need four partitions. For more information on determining the partitions, see the [How many partitions do I need?](../event-hubs/event-hubs-faq.yml#how-many-partitions-do-i-need-) question in the FAQ for [Azure Event Hubs](../event-hubs/index.yml).

### Upgrade tiers

After you create your IoT hub, you can upgrade from the basic tier to the standard tier without interrupting your existing operations. You can't downgrade from standard tier to basic tier. For more information, see [How to upgrade your IoT hub](iot-hub-upgrade.md).

The partition configuration remains unchanged when you migrate from basic tier to standard tier.

> [!NOTE]
> The free tier does not support upgrading to basic or standard tier.

## Tier editions and units

Once you've chosen the tier that provides the best features for your solution, determine the size that provides the best data capacity for your solution.

Each IoT Hub tier is available in three sizes, based around how much data throughput they can handle in any given day. These sizes are numerically identified as 1, 2, and 3.

Tiers and sizes are represented as *editions*. A basic tier IoT hub of size 2 is represented by the edition **B2**. Similarly, a standard tier IoT hub of size 3 is represented by the edition **S3**.

Only one type of [IoT Hub edition](https://azure.microsoft.com/pricing/details/iot-hub/) within a tier can be chosen per IoT hub. For example, you can create an IoT hub with multiple units of S1. However, you can't create an IoT hub with a mix of units from different editions, such as S1 and B3 or S1 and S2.

The following table shows the capacity for device-to-cloud messages for each size.

| Size | Messages per day per unit | Data per day per unit |
| ---- | ------------------------- | --------------------- |
| 1    | 400,000                   | 1.5 GB                |
| 2    | 6,000,000                 | 22.8 GB               |
| 3    | 300,000,000               | 1144.4 GB             |

You can purchase up to 200 units for a size 1 or 2 IoT hub, or up to 10 units for a size 3 IoT hub. Your daily message limit and throttling limits are based on the combined capacity of all units. For example, buying one unit of size 2 gives you the same daily message limit as fifteen units of size 1.

For more information on the capacity and limits of each IoT Hub edition, see [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md).

### Upgrade or downgrade editions

After you create your IoT hub, without interrupting your existing operations, you can:

* Change the number of units available within its edition (for example, upgrading from one to three units of B1)
* Upgrade or downgrade between editions within its tier (for example, upgrading from B1 to B2)

For more information, see [How to upgrade your IoT hub](iot-hub-upgrade.md).  

## Auto-scale

If you're approaching the allowed message limit on your IoT hub, you can use these [steps to automatically scale](https://azure.microsoft.com/resources/samples/iot-hub-dotnet-autoscale/) to increment an IoT Hub unit in the same IoT Hub tier.

## Next steps

* For more information about IoT Hub capabilities and performance details, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub) or [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md).

* To change your IoT Hub tier, follow the steps in [How to upgrade your IoT hub](iot-hub-upgrade.md).
