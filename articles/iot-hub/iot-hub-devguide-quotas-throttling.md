---
title: Understand Azure IoT Hub quotas and throttling | Microsoft Docs
description: Developer guide - description of the quotas that apply to IoT Hub and the expected throttling behavior.
author: robinsh
ms.author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 08/08/2019
---

# Reference - IoT Hub quotas and throttling

This article explains the quotas for an IoT Hub, and provides information to help you understand how throttling works.

## Quotas and throttling

Each Azure subscription can have at most 50 IoT hubs, and at most 1 Free hub.

Each IoT hub is provisioned with a certain number of units in a specific tier. The tier and number of units determine the maximum daily quota of messages that you can send. The message size used to calculate the daily quota is 0.5 KB for a free tier hub and 4KB for all other tiers. For more information, see [Azure IoT Hub Pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

The tier also determines the throttling limits that IoT Hub enforces on all operations.

### IoT Plug and Play

During public preview, IoT Plug and Play devices will send separate messages per interface, which may increase the number of messages counted towards your message quota.

## Operation throttles

Operation throttles are rate limitations that are applied in minute ranges and are intended to prevent abuse. They're also subject to [traffic shaping](#traffic-shaping).

The following table shows the enforced throttles. Values refer to an individual hub.

| Throttle | Free, B1, and S1 | B2 and S2 | B3 and S3 | 
| -------- | ------- | ------- | ------- |
| [Identity registry operations](#identity-registry-operations-throttle) (create, retrieve, list, update, delete) | 1.67/sec/unit (100/min/unit) | 1.67/sec/unit (100/min/unit) | 83.33/sec/unit (5,000/min/unit) |
| [New device connections](#device-connections-throttle) (this limit applies to the rate of _new connections_, not the total number of connections) | Higher of 100/sec or 12/sec/unit <br/> For example, two S1 units are 2\*12 = 24 new connections/sec, but you have at least 100 new connections/sec across your units. With nine S1 units, you have 108 new connections/sec (9\*12) across your units. | 120 new connections/sec/unit | 6,000 new connections/sec/unit |
| Device-to-cloud sends | Higher of 100 send operations/sec or 12 send operations/sec/unit <br/> For example, two S1 units are 2\*12 = 24/sec, but you have at least 100 send operations/sec across your units. With nine S1 units, you have 108 send operations/sec (9\*12) across your units. | 120 send operations/sec/unit | 6,000 send operations/sec/unit |
| Cloud-to-device sends<sup>1</sup> | 1.67 send operations/sec/unit (100 messages/min/unit) | 1.67 send operations/sec/unit (100 send operations/min/unit) | 83.33 send operations/sec/unit (5,000 send operations/min/unit) |
| Cloud-to-device receives<sup>1</sup> <br/> (only when device uses HTTPS)| 16.67 receive operations/sec/unit (1,000 receive operations/min/unit) | 16.67 receive operations/sec/unit (1,000 receive operations/min/unit) | 833.33 receive operations/sec/unit (50,000 receive operations/min/unit) |
| File upload | 1.67 file upload initiations/sec/unit (100/min/unit) | 1.67 file upload initiations/sec/unit (100/min/unit) | 83.33 file upload initiations/sec/unit (5,000/min/unit) |
| Direct methods<sup>1</sup> | 160KB/sec/unit<sup>2</sup> | 480KB/sec/unit<sup>2</sup> | 24MB/sec/unit<sup>2</sup> | 
| Queries | 20/min/unit | 20/min/unit | 1,000/min/unit |
| Twin (device and module) reads<sup>1</sup> | 100/sec | Higher of 100/sec or 10/sec/unit | 500/sec/unit |
| Twin updates (device and module)<sup>1</sup> | 50/sec | Higher of 50/sec or 5/sec/unit | 250/sec/unit |
| Jobs operations<sup>1</sup> <br/> (create, update, list, delete) | 1.67/sec/unit (100/min/unit) | 1.67/sec/unit (100/min/unit) | 83.33/sec/unit (5,000/min/unit) |
| Jobs device operations<sup>1</sup> <br/> (update twin, invoke direct method) | 10/sec | Higher of 10/sec or 1/sec/unit | 50/sec/unit |
| Configurations and edge deployments<sup>1</sup> <br/> (create, update, list, delete) | 0.33/sec/unit (20/min/unit) | 0.33/sec/unit (20/min/unit) | 0.33/sec/unit (20/min/unit) |
| Device stream initiation rate<sup>1</sup> | 5 new streams/sec | 5 new streams/sec | 5 new streams/sec |
| Maximum number of concurrently connected device streams<sup>1</sup> | 50 | 50 | 50 |
| Maximum device stream data transfer<sup>1</sup> (aggregate volume per day) | 300 MB | 300 MB | 300 MB |

<sup>1</sup>This feature is not available in the basic tier of IoT Hub. For more information, see [How to choose the right IoT Hub](iot-hub-scaling.md). <br/><sup>2</sup>Throttling meter size is 4 KB.

### Throttling Details

* The meter size determines at what increments your throttling limit is consumed. If your direct call's payload is between 0 and 4 KB, it is counted as 4 KB. You can make up to 40 calls per second per unit before hitting the limit of 160 KB/sec/unit.

   Similarly, if your payload is between 4 KB and 8 KB, each call accounts for 8 KB and you can make up to 20 calls per second per unit before hitting the max limit.

   Finally, if your payload size is between 156KB and 160 KB, you'll be able to make only 1 call per second per unit in your hub before hitting the limit of 160 KB/sec/unit.

*  For *Jobs device operations (update twin, invoke direct method)* for tier S2, 50/sec/unit only applies to when you invoke methods using jobs. If you invoke direct methods directly, the original throttling limit of 24 MB/sec/unit (for S2) applies.

*  **Quota** is the aggregate number of messages you can send in your hub *per day*. You can find your hub's quota limit under the column **Total number of messages /day** on the [IoT Hub pricing page](https://azure.microsoft.com/pricing/details/iot-hub/).

*  Your cloud-to-device and device-to-cloud throttles determine the maximum *rate* at which you can send messages -- number of messages irrespective of 4 KB chunks. Each message can be up to 256 KB which is the [maximum message size](iot-hub-devguide-quotas-throttling.md#other-limits).

*  It's a good practice to throttle your calls so that you don't hit/exceed the throttling limits. If you do hit the limit, IoT Hub responds with error code 429 and the client should back-off and retry. These limits are per hub (or in some cases per hub/unit). For more information, refer to [Manage connectivity and reliable messaging/Retry patterns](iot-hub-reliability-features-in-sdks.md#retry-patterns).

### Traffic shaping

To accommodate burst traffic, IoT Hub accepts requests above the throttle for a limited time. The first few of these requests are processed immediately. However, if the number of requests continues violate the throttle, IoT Hub starts placing the requests in a queue and processed at the limit rate. This effect is called *traffic shaping*. Furthermore, the size of this queue is limited. If the throttle violation continues, eventually the queue fills up, and IoT Hub starts rejecting requests with `429 ThrottlingException`.

For example, you use a simulated device to send 200 device-to-cloud messages per second to your S1 IoT Hub (which has a limit of 100/sec D2C sends). For the first minute or two, the messages are processed immediately. However, since the device continues to send more messages than the throttle limit, IoT Hub begins to only process 100 messages per second and puts the rest in a queue. You start noticing increased latency. Eventually, you start getting `429 ThrottlingException` as the queue fills up, and the "number of throttle errors" in [IoT Hub's metrics](iot-hub-metrics.md) starts increasing.

### Identity registry operations throttle

Device identity registry operations are intended for run-time use in device management and provisioning scenarios. Reading or updating a large number of device identities is supported through [import and export jobs](iot-hub-devguide-identity-registry.md#import-and-export-device-identities).

### Device connections throttle

The *device connections* throttle governs the rate at which new device connections can be established with an IoT hub. The *device connections* throttle does not govern the maximum number of simultaneously connected devices. The *device connections* rate throttle depends on the number of units that are provisioned for the IoT hub.

For example, if you buy a single S1 unit, you get a throttle of 100 connections per second. Therefore, to connect 100,000 devices, it takes at least 1,000 seconds (approximately 16 minutes). However, you can have as many simultaneously connected devices as you have devices registered in your identity registry.

## Other limits

IoT Hub enforces other operational limits:

| Operation | Limit |
| --------- | ----- |
| Devices | The total number of devices plus modules that can be registered to a single IoT hub is capped at 1,000,000. The only way to increase this limit is to contact [Microsoft Support](https://azure.microsoft.com/support/options/).|
| File uploads | 10 concurrent file uploads per device. |
| Jobs<sup>1</sup> | Maximum concurrent jobs is 1 (for Free and S1), 5 (for S2), and 10 (for S3). However, the max concurrent [device import/export jobs](iot-hub-bulk-identity-mgmt.md) is 1 for all tiers. <br/>Job history is retained up to 30 days. |
| Additional endpoints | Paid SKU hubs may have 10 additional endpoints. Free SKU hubs may have one additional endpoint. |
| Message routing queries | Paid SKU hubs may have 100 routing queries. Free SKU hubs may have five routing queries. |
| Message enrichments | Paid SKU hubs can have up to 10 message enrichments. Free SKU hubs can have up to 2 message enrichments.|
| Device-to-cloud messaging | Maximum message size 256 KB |
| Cloud-to-device messaging<sup>1</sup> | Maximum message size 64 KB. Maximum pending messages for delivery is 50 per device. |
| Direct method<sup>1</sup> | Maximum direct method payload size is 128 KB. |
| Automatic device and module configurations<sup>1</sup> | 100 configurations per paid SKU hub. 20 configurations per free SKU hub. |
| IoT Edge automatic deployments<sup>1</sup> | 50 modules per deployment. 100 deployments (including layered deployments) per paid SKU hub. 10 deployments per free SKU hub. |
| Twins<sup>1</sup> | Maximum size of desired properties and reported properties sections are 32 KB each. Maximum size of tags section is 8 KB. |
| Shared access policies | Maximum number of shared access policies is 16 |

<sup>1</sup>This feature is not available in the basic tier of IoT Hub. For more information, see [How to choose the right IoT Hub](iot-hub-scaling.md).

## Increasing the quota or throttle limit

At any given time, you can increase quotas or throttle limits by [increasing the number of provisioned units in an IoT hub](iot-hub-upgrade.md).

## Latency

IoT Hub strives to provide low latency for all operations. However, due to network conditions and other unpredictable factors it cannot guarantee a certain latency. When designing your solution, you should:

* Avoid making any assumptions about the maximum latency of any IoT Hub operation.
* Provision your IoT hub in the Azure region closest to your devices.
* Consider using Azure IoT Edge to perform latency-sensitive operations on the device or on a gateway close to the device.

Multiple IoT Hub units affect throttling as described previously, but do not provide any additional latency benefits or guarantees.

If you see unexpected increases in operation latency, contact [Microsoft Support](https://azure.microsoft.com/support/options/).

## Next steps

For an in-depth discussion of IoT Hub throttling behavior, see the blog post [IoT Hub throttling and you](https://azure.microsoft.com/blog/iot-hub-throttling-and-you/).

Other reference topics in this IoT Hub developer guide include:

* [IoT Hub endpoints](iot-hub-devguide-endpoints.md)
