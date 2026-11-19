---
title: Azure IoT Hub scaling
description: How to choose the correct IoT hub tier and size to support your anticipated message throughput and desired features.
author: Usha-Rathnavel

ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: concept-article
ms.date: 11/11/2026
ms.custom: [amqp, mqtt, 'Role: Cloud Development', 'Role: Operations']
---

# Choose the right IoT Hub tier and size for your solution

Every IoT solution is different, so Azure IoT Hub offers several options based on pricing and scale. This article is meant to help you evaluate your IoT Hub needs. For pricing information about IoT Hub tiers, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub).

> [!IMPORTANT]
> IoT Hub with the MQTT v5 connection profile uses a different scaling model.
> See [Scale an IoT hub with the MQTT v5 connection profile](#scale-an-iot-hub-with-the-mqtt-v5-connection-profile).
> The basic and standard tier comparisons, daily message allowances, partition
> guidance, and tier/unit scaling procedures elsewhere in this article describe
> the classic connection profile. Don't apply them to MQTT v5 throughput units.

To decide which IoT Hub tier is right for your solution, ask yourself two questions:

**What features do I plan to use?**

Azure IoT Hub offers two tiers, basic and standard, that differ in the features that they support. If your IoT solution is based around collecting data from devices and analyzing it centrally, then the basic tier is probably right for you. If you want to use more advanced configurations to control IoT devices remotely or distribute some of your workloads onto the devices themselves, then you should consider the standard tier.

For a detailed breakdown of which features are included in each tier, continue to [Choose your features: basic and standard tiers](#choose-your-features-basic-and-standard-tiers).

**How much data do I plan to move daily?**

Each IoT Hub tier is available in three sizes, based around how much data throughput they can handle in a day. These sizes are numerically identified as 1, 2, and 3. The size determines the baseline daily message limit, and then you can scale out an IoT hub by adding *units*. For example, each unit of a level 1 IoT hub can handle 400,000 messages a day. A level 1 IoT hub with five units can handle 2,000,000 messages a day. Or, go up to a level 2 hub where each unit has a 6,000,000 messages daily limit.

For more details about determining your message requirements and limits, continue to [Choose your size: editions and units](#choose-your-size-editions-and-units).

## Choose your features: basic and standard tiers

The basic tier of IoT Hub enables a subset of available features and is intended for IoT solutions that only need uni-directional communication from devices to the cloud. The standard tier of IoT Hub enables all features, and is meant for IoT solutions that want to make use of the bi-directional communication capabilities. The basic tier enables a subset of the features and is intended for IoT solutions that only need uni-directional communication from devices to the cloud.

Both tiers offer the same security and authentication features.

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
| [Azure IoT Edge](../iot-edge/about-iot-edge.md) |   | Yes |
| [IoT Plug and Play](/previous-versions/azure/iot/overview-iot-plug-and-play) |   | Yes |

IoT Hub also offers a free tier that is meant for testing and evaluation. It has all the capabilities of the standard tier, but includes limited messaging allowances. You can't upgrade from the free tier to either the basic or standard tier.

>[!NOTE]
>The name of a free tier IoT hub might be visible to other free tier users. You can [manage access to your IoT hub by using Microsoft Entra ID and Azure RBAC](authenticate-authorize-azure-ad.md#manage-access-to-iot-hub-by-using-azure-rbac-role-assignment).

### IoT Hub REST APIs

The difference in supported capabilities between the basic and standard tiers of IoT Hub means that some API calls don't work with basic tier IoT hubs. The following table shows which APIs are available:

| API | Basic tier | Standard tier |
| --- | ---------- | ------------- |
| [Create or update device](/rest/api/iothub/service/devices/create-or-update-identity), [Get device](/rest/api/iothub/service/devices/get-identity), [Delete device](/rest/api/iothub/service/devices/delete-identity) | Yes | Yes |
| [Create or update module](/rest/api/iothub/service/modules/create-or-update-identity), [Get module](/rest/api/iothub/service/modules/get-identity), [Delete module](/rest/api/iothub/service/modules/delete-identity) | Yes | Yes |
| [Get registry statistics](/rest/api/iothub/service/statistics/get-device-statistics) | Yes | Yes |
| [Get service statistics](/rest/api/iothub/service/statistics/get-service-statistics) | Yes | Yes |
| [Query IoT Hub](/rest/api/iothub/iot-hub-resource/get) | Yes | Yes |
| [Create file upload SAS URI](/rest/api/iothub/operation-groups) | Yes | Yes |
| [Receive device bound notification](/rest/api/iothub/operation-groups) | Yes | Yes |
| [Send device event](/rest/api/iothub/operation-groups) | Yes | Yes |
| Send module event | AMQP and MQTT only | AMQP and MQTT only |
| [Update file upload status](/rest/api/iothub/iot-hub-resource/update) | Yes | Yes |
| [Bulk device operation](/rest/api/iothub/service/bulk-registry/update-registry) | Yes, except for IoT Edge capabilities | Yes |
| [Create import export job](/rest/api/iothub/service/jobs/createimportexportjob), [Get import export job](/rest/api/iothub/service/jobs/getimportexportjob), [Cancel import export job](/rest/api/iothub/service/jobs/cancelimportexportjob) | Yes | Yes |
| [Get device twin](/rest/api/iothub/service/devices/get-twin), [Update device twin](/rest/api/iothub/service/devices/update-twin) |   | Yes |
| [Get module twin](/rest/api/iothub/service/modules/get-twin), [Update module twin](/rest/api/iothub/service/modules/update-twin) |   | Yes |
| [Invoke device method](/rest/api/iothub/service/devices/invoke-method) |   | Yes |
| [Abandon device bound notification](/rest/api/iothub/service/devices) |   | Yes |
| [Complete device bound notification](/rest/api/iothub/service/devices) |   | Yes |
| [Create job](/rest/api/iothub/service/jobs/create-scheduled-job), [Get job](/rest/api/iothub/service/jobs/get-scheduled-job), [Cancel job](/rest/api/iothub/service/jobs/cancel-scheduled-job) |   | Yes |
| [Query jobs](/rest/api/iothub/service/jobs/query-scheduled-jobs) |   | Yes |

### Partitions

Azure IoT hubs contain many core components from [Azure Event Hubs](../event-hubs/event-hubs-features.md), including [partitions](../event-hubs/event-hubs-features.md#partitions). Event streams for IoT hubs are populated with incoming telemetry data reported by various IoT devices. The partitioning of the event stream is used to reduce contentions that occur when concurrently reading and writing to event streams.

The partition limit is chosen when an IoT hub is created, and can't be changed. The maximum limit of device-to-cloud partitions for basic tier and standard tier IoT hubs is 32. Most IoT hubs only need four partitions. For more information on determining the partitions, see the [How many partitions do I need?](../event-hubs/event-hubs-faq.yml#how-many-partitions-do-i-need-) question in the FAQ for [Azure Event Hubs](../event-hubs/index.yml).

### Upgrade tiers

After you create your IoT hub, you can upgrade from the basic tier to the standard tier without interrupting your existing operations. You can't downgrade from standard tier to basic tier. For more information, see [How to upgrade your IoT hub](iot-hub-upgrade.md).

The partition configuration remains unchanged when you migrate from basic tier to standard tier.

> [!NOTE]
> The free tier doesn't support upgrading to basic or standard tier.

## Choose your size: editions and units

Once you choose the tier that provides the best features for your solution, determine the size that provides the best data capacity for your solution.

Each IoT Hub tier is available in three sizes, based around how much data throughput they can handle in any given day. These sizes are numerically identified as 1, 2, and 3.

A tier-size pair is represented as an *edition*. A basic tier IoT hub of size 2 is represented by the edition **B2**. Similarly, a standard tier IoT hub of size 3 is represented by the edition **S3**. For more information, including pricing details, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/)

Once you choose an edition for your IoT hub, you can multiply its messaging capacity by increasing the number of *units*.

Each IoT hub can only be one edition. For example, you can create an IoT hub with multiple units of S1. However, you can't create an IoT hub with a mix of units from different editions, such as S1 and B3 or S1 and S2.

The following table shows the capacity for device-to-cloud messages for each size.

| Size | Messages per day per unit | Data per day per unit |
| ---- | ------------------------- | --------------------- |
| 1    | 400,000                   | 1.5 GB                |
| 2    | 6,000,000                 | 22.8 GB               |
| 3    | 300,000,000               | 1144.4 GB             |

You can purchase up to 200 units for a size 1 or 2 IoT hub, or up to 10 units for a size 3 IoT hub. Your daily message limit and throttling limits are based on the combined capacity of all units. For example, buying one unit of size 2 gives you the same daily message limit as 15 units of size 1.

For more information on the capacity and limits of each IoT Hub edition, see [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md).

### Upgrade or downgrade editions

After you create your IoT hub, without interrupting your existing operations, you can:

* Change the number of units available within its edition (for example, upgrading from one to three units of B1)
* Upgrade or downgrade between editions within its tier (for example, upgrading from B1 to B2)

For more information, see [How to upgrade your IoT hub](iot-hub-upgrade.md).  

### Auto-scale

If you're approaching the allowed message limit on your IoT hub, you can use these [steps to automatically scale](https://azure.microsoft.com/resources/samples/iot-hub-dotnet-autoscale/) to increment an IoT Hub unit in the same IoT Hub tier.

## Scale an IoT hub with the MQTT v5 connection profile

During preview, IoT Hub with the MQTT v5 connection profile supports only
**Standard S1** hubs. Configure capacity by selecting **throughput units
(TUs)**, from **1 to 25 TUs**. These units aren't the classic S1 units used to
calculate daily message allowances.

The number of TUs you select determines three capacity dimensions:

- **Throughput:** Combined device-to-hub and hub-to-device traffic, measured in
  messages per second and MB per second. For example, telemetry sent by a
  device and a direct method command delivered to a device both count toward
  throughput.
  Both limits apply; whichever you reach first limits throughput.
- **Connected devices:** The maximum number of concurrently connected devices,
  not the number of registered device identities.
- **Connection requests:** The number of connection requests per second.
  Plan for reconnect bursts separately from the steady connected population.

For example, 7 TUs provide capacity for 7,000 messages per second and 7 MB per
second of combined device-to-hub and hub-to-device traffic, 70,000 concurrently connected devices,
and 1,400 connection requests per second. At the maximum of 25 TUs, the hub
supports up to **250,000 concurrently connected devices** during preview.
The number of registered devices can be higher than this concurrent connection
limit, subject to the hub's registered identity capacity.

For per-TU values and maximum capacities, see
[Quotas and throttling for the MQTT v5 connection profile](iot-hub-devguide-quotas-throttling.md#quotas-and-throttling-for-the-mqtt-v5-connection-profile).
The maximum message size is **1 MB** and doesn't increase with TUs.

### Choose throughput units

Choose enough TUs to accommodate each capacity dimension, not just device
count. Estimate both traffic sent by devices and traffic received by devices.
Include peak message rates, message sizes,
concurrent connections, and connection-request bursts in your capacity plan.

Increasing hub capacity doesn't increase destination or consumer capacity.
Evaluate routing destinations and receiving applications separately. Similarly,
Device Provisioning Service (DPS) has its own
[quotas and limits](../iot-dps/about-iot-dps.md#quotas-and-limits).

### Adjust throughput units in the Azure portal

1. Open your MQTT v5 IoT hub in the [Azure portal](https://portal.azure.com).
1. Under **Hub settings**, select **Pricing and scale**.
1. Select **Adjust capacity**.
1. Set **Number of throughput units** to a value from **1 to 25**.
   The **Tier edition** remains **S1**.
1. Review the **Capacity Summary** for throughput, connected devices, and
   connection requests, and then select **Adjust**.

After adjusting capacity, validate steady traffic and reconnect behavior
separately. Compare SDK outcomes, routing results, and destination receipt;
a successful publish acknowledgment doesn't prove application receipt.
See [Monitor a test run](monitor-iot-hub.md#monitor-a-test-run).

## Next steps

* For more information about IoT Hub capabilities and performance details, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub) or [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md).

* To change your IoT Hub tier, follow the steps in [How to upgrade your IoT hub](iot-hub-upgrade.md).
