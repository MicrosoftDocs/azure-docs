---
title: Understand Azure IoT Hub quotas and throttling
description: This article provides a description of the quotas that apply to IoT Hub and the expected throttling behavior.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: concept-article
ms.date: 02/09/2023
ms.custom: ['Role: Cloud Development', 'Role: Operations', 'Role: Technical Support', 'contperf-fy21q4']
---

# IoT Hub quotas and throttling

This article explains the quotas for an IoT Hub, and provides information to help you understand how throttling works.

Each Azure subscription can have at most 50 IoT hubs, and at most 1 Free hub.

Each IoT hub is provisioned with units in a specific tier. The tier and number of units determine the maximum daily quota of messages that you can send in your hub per day. The message size used to calculate the daily quota is 0.5 KB for a free tier hub and 4KB for all other tiers. For more information, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/) or [Choose the right IoT Hub tier for your solution].

You can find your hub's quota limit under the column **Total number of messages /day** on the [IoT Hub pricing page](https://azure.microsoft.com/pricing/details/iot-hub/) in the Azure portal.

The tier also determines the throttling limits that IoT Hub enforces on all operations.

## Operation throttles

Operation throttles are rate limitations that are applied in minute ranges and are intended to prevent abuse. They're also subject to [traffic shaping](#traffic-shaping).

It's a good practice to throttle your calls so that you don't hit/exceed the throttling limits. If you do hit the limit, IoT Hub responds with error code 429 and the client should back-off and retry. These limits are per hub (or in some cases per hub/unit). For more information, see [Retry patterns](../iot-develop/concepts-manage-device-reconnections.md#retry-patterns).

### Basic and standard tier operations

The following table shows the enforced throttles for operations that are available in all IoT Hub tiers. Values refer to an individual hub.

| Throttle | Free, B1, and S1 | B2 and S2 | B3 and S3 |
| -------- | ------- | ------- | ------- |
| [Identity registry operations](#identity-registry-operations-throttle) (create, retrieve, list, update, delete) | 1.67/sec/unit (100/min/unit) | 1.67/sec/unit (100/min/unit) | 83.33/sec/unit (5,000/min/unit) |
| [New device connections](#device-connections-throttle) (this limit applies to the rate of *new connections*, not the total number of connections) | Higher of 100/sec or 12/sec/unit <br/> For example, two S1 units are 2\*12 = 24 new connections/sec, but you have at least 100 new connections/sec across your units. With nine S1 units, you have 108 new connections/sec (9\*12) across your units. | 120 new connections/sec/unit | 6,000 new connections/sec/unit |
| Device-to-cloud sends | Higher of 100 send operations/sec or 12 send operations/sec/unit <br/> For example, two S1 units are 2\*12 = 24/sec, but you have at least 100 send operations/sec across your units. With nine S1 units, you have 108 send operations/sec (9\*12) across your units. | 120 send operations/sec/unit | 6,000 send operations/sec/unit |
| File upload | 1.67 file upload initiations/sec/unit (100/min/unit) | 1.67 file upload initiations/sec/unit (100/min/unit) | 83.33 file upload initiations/sec/unit (5,000/min/unit) |
| Queries | 20/min/unit | 20/min/unit | 1,000/min/unit |

### Standard tier operations

The following table shows the enforced throttles for operations that are available in standard tiers only. Values refer to an individual hub.

| Throttle | Free and S1 | S2 | S3 |
| -------- | ------- | ------- | ------- |
| Cloud-to-device sends | 1.67 send operations/sec/unit (100 messages/min/unit) | 1.67 send operations/sec/unit (100 send operations/min/unit) | 83.33 send operations/sec/unit (5,000 send operations/min/unit) |
| Cloud-to-device receives <br/> (only when device uses HTTPS)| 16.67 receive operations/sec/unit (1,000 receive operations/min/unit) | 16.67 receive operations/sec/unit (1,000 receive operations/min/unit) | 833.33 receive operations/sec/unit (50,000 receive operations/min/unit) |
| Direct methods | 160KB/sec/unit<sup>1</sup> | 480KB/sec/unit<sup>1</sup> | 24MB/sec/unit<sup>1</sup> | 
| Twin (device and module) reads | 100/sec | Higher of 100/sec or 10/sec/unit | 500/sec/unit |
| Twin updates (device and module) | 50/sec | Higher of 50/sec or 5/sec/unit | 250/sec/unit |
| Jobs operations <br/> (create, update, list, delete) | 1.67/sec/unit (100/min/unit) | 1.67/sec/unit (100/min/unit) | 83.33/sec/unit (5,000/min/unit) |
| Jobs device operations <br/> (update twin, invoke direct method) | 10/sec | Higher of 10/sec or 1/sec/unit | 50/sec/unit |
| Configurations and edge deployments <br/> (create, update, list, delete) | 0.33/sec/unit (20/min/unit) | 0.33/sec/unit (20/min/unit) | 0.33/sec/unit (20/min/unit) |
| Device stream initiation rate | 5 new streams/sec | 5 new streams/sec | 5 new streams/sec |
| Maximum number of concurrently connected device streams | 50 | 50 | 50 |
| Maximum device stream data transfer (aggregate volume per day) | 300 MB | 300 MB | 300 MB |

<sup>1</sup>Throttling meter size is 4 KB. Throttling is based on request payload size only.

### Throttling details

* The meter size determines at what increments your throttling limit is consumed. If your direct call's payload is between 0 KB and 4 KB, it's counted as 4 KB. You can make up to 40 calls per second per unit before hitting the limit of 160 KB/sec/unit.

   Similarly, if your payload is between 4 KB and 8 KB, each call accounts for 8 KB and you can make up to 20 calls per second per unit before hitting the max limit.

   Finally, if your payload size is between 156 KB and 160 KB, you can make only one call per second per unit in your hub before hitting the limit of 160 KB/sec/unit.

* For *Jobs device operations (update twin, invoke direct method)* for tier S3, 50/sec/unit only applies to when you invoke methods using jobs. If you invoke direct methods directly, the original throttling limit of 24 MB/sec/unit (for S3) applies.

* Your cloud-to-device and device-to-cloud throttles determine the maximum *rate* at which you can send messages irrespective of 4 KB chunks. Device-to-cloud messages can be up to 256 KB; cloud-to-device messages can be up to 64 KB. These are the maximum message sizes for each type of message.

### Traffic shaping

To accommodate burst traffic, IoT Hub accepts requests above the throttle for a limited time. The first few of these requests are processed immediately. However, if the number of requests continues to violate the throttle, IoT Hub starts placing the requests in a queue and requests are processed at the limit rate. This effect is called *traffic shaping*. Furthermore, the size of this queue is limited. If the throttle violation continues, eventually the queue fills up, and IoT Hub starts rejecting requests with `429 ThrottlingException`.

For example, you use a simulated device to send 200 device-to-cloud messages per second to your S1 IoT Hub (which has a limit of 100/sec device-to-cloud sends). For the first minute or two, the messages are processed immediately. However, since the device continues to send more messages than the throttle limit, IoT Hub begins to only process 100 messages per second and puts the rest in a queue. You start noticing increased latency. Eventually, you start getting `429 ThrottlingException` as the queue fills up, and the ["Number of throttling errors" IoT Hub metric](monitor-iot-hub-reference.md#device-telemetry-metrics) starts increasing. To learn how to create alerts and charts based on metrics, see [Monitor IoT Hub](monitor-iot-hub.md).

### Identity registry operations throttle

Device identity registry operations are intended for run-time use in device management and provisioning scenarios. Reading or updating a large number of device identities is supported through [import and export jobs](iot-hub-devguide-identity-registry.md#import-and-export-device-identities).

When initiating identity operations through [bulk registry update operations](/rest/api/iothub/service/bulkregistry/updateregistry) (*not* bulk import and export jobs), the same throttle limits apply. For example, if you want to submit bulk operation to create 50 devices, and you have a S1 IoT Hub with one unit, only two of these bulk requests are accepted per minute. This limitation is because the identity operation throttle for an S1 IoT Hub with one unit is 100/min/unit. Also in this case, a third request (and beyond) in the same minute would be rejected because the limit has been reached.

### Device connections throttle

The *device connections* throttle governs the rate at which new device connections can be established with an IoT hub. The *device connections* throttle doesn't govern the maximum number of simultaneously connected devices. The *device connections* rate throttle depends on the number of units that are provisioned for the IoT hub.

For example, if you buy a single S1 unit, you get a throttle of 100 connections per second. Therefore, to connect 100,000 devices, it takes at least 1,000 seconds (approximately 16 minutes). However, you can have as many simultaneously connected devices as you have devices registered in your identity registry.

## Other limits

IoT Hub enforces other operational limits:

| Operation | Limit |
| --------- | ----- |
| Devices | The total number of devices plus modules that can be registered to a single IoT hub is capped at 1,000,000. The only way to increase this limit is to contact [Microsoft Support](https://azure.microsoft.com/support/options/).|
| File uploads | 10 concurrent file uploads per device. |
| Jobs<sup>1</sup> | Maximum concurrent jobs are 1 (for Free and S1), 5 (for S2), and 10 (for S3). However, the max concurrent [device import/export jobs](iot-hub-bulk-identity-mgmt.md) is 1 for all tiers. <br/>Job history is retained up to 30 days. |
| Additional endpoints | Basic and standard SKU hubs may have 10 additional endpoints. Free SKU hubs may have one additional endpoint. |
| Message routing queries | Basic and standard SKU hubs may have 100 routing queries. Free SKU hubs may have five routing queries. |
| Message enrichments | Basic and standard SKU hubs can have up to 10 message enrichments. Free SKU hubs can have up to two message enrichments.|
| Device-to-cloud messaging | Maximum message size 256 KB |
| Cloud-to-device messaging<sup>1</sup> | Maximum message size 64 KB. Maximum pending messages for delivery is 50 per device. |
| Direct method<sup>1</sup> | Maximum direct method payload size is 128 KB for the request and 128 KB for the response. |
| Automatic device and module configurations<sup>1</sup> | 100 configurations per basic or standard SKU hub. 10 configurations per free SKU hub. |
| IoT Edge automatic deployments<sup>1</sup> | 50 modules per deployment. 100 deployments (including layered deployments) per basic or standard SKU hub. 10 deployments per free SKU hub. |
| Twins<sup>1</sup> | Maximum size of desired properties and reported properties sections are 32 KB each. Maximum size of tags section is 8 KB. Maximum size of each individual property in every section is 4 KB. |
| Shared access policies | Maximum number of shared access policies is 16. Within that limit, the maximum number of shared access policies that grant *service connect* access is 10. |
| Restrict outbound network access | Maximum number of allowed FQDNs is 20. |
| x509 CA certificates | Maximum number of x509 CA certificates that can be registered on IoT Hub is 25. |

<sup>1</sup>This feature isn't available in the basic tier of IoT Hub. For more information, see [How to choose the right IoT Hub](iot-hub-scaling.md).

## Increasing the quota or throttle limit

At any given time, you can increase quotas or throttle limits by [increasing the number of provisioned units in an IoT hub](iot-hub-upgrade.md).

## Latency

IoT Hub strives to provide low latency for all operations. However, due to network conditions and other unpredictable factors it can't guarantee a certain latency. When designing your solution, you should:

* Avoid making any assumptions about the maximum latency of any IoT Hub operation.
* Provision your IoT hub in the Azure region closest to your devices.
* Consider using Azure IoT Edge to perform latency-sensitive operations on the device or on a gateway close to the device.

Multiple IoT Hub units affect throttling as described previously, but don't provide any additional latency benefits or guarantees.

If you see unexpected increases in operation latency, contact [Microsoft Support](https://azure.microsoft.com/support/options/).

## Next steps

For an in-depth discussion of IoT Hub throttling behavior, see the blog post [IoT Hub throttling and you](https://azure.microsoft.com/blog/iot-hub-throttling-and-you/).
