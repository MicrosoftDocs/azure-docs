---
author: robinsh
ms.author: robinsh
ms.service: iot-hub
ms.topic: include
ms.date: 10/26/2018
---
The following table lists the limits associated with the different service tiers S1, S2, S3, and F1. For information about the cost of each *unit* in each tier, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

| Resource | S1 Standard | S2 Standard | S3 Standard | F1 Free |
| --- | --- | --- | --- | --- |
| Messages/day |400,000 |6,000,000 |300,000,000 |8,000 |
| Maximum units |200 |200 |10 |1 |

> [!NOTE]
> If you anticipate using more than 200 units with an S1 or S2 tier hub or 10 units with an S3 tier hub, contact Microsoft Support.
> 
> 

The following table lists the limits that apply to IoT Hub resources.

| Resource | Limit |
| --- | --- |
| Maximum paid IoT hubs per Azure subscription |50 |
| Maximum free IoT hubs per Azure subscription |1 |
| Maximum number of characters in a device ID | 128 |
| Maximum number of device identities<br/> returned in a single call |1,000 |
| IoT Hub message maximum retention for device-to-cloud messages |7 days |
| Maximum size of device-to-cloud message |256 KB |
| Maximum size of device-to-cloud batch |AMQP and HTTP: 256 KB for the entire batch <br/>MQTT: 256 KB for each message |
| Maximum messages in device-to-cloud batch |500 |
| Maximum size of cloud-to-device message |64 KB |
| Maximum TTL for cloud-to-device messages |2 days |
| Maximum delivery count for cloud-to-device <br/> messages |100 |
| Maximum cloud-to-device queue depth per device |50 |
| Maximum delivery count for feedback messages <br/> in response to a cloud-to-device message |100 |
| Maximum TTL for feedback messages in <br/> response to a cloud-to-device message |2 days |
| [Maximum size of device twin](../articles/iot-hub/iot-hub-devguide-device-twins.md#device-twin-size) | 8 KB for tags section, and 32 KB for desired and reported properties sections each |
| Maximum length of device twin string key | 1 KB |
| Maximum length of device twin string value | 4 KB |
| [Maximum depth of object in device twin](../articles/iot-hub/iot-hub-devguide-device-twins.md#tags-and-properties-format) | 10 |
| Maximum size of direct method payload | 128 KB |
| Job history maximum retention | 30 days |
| Maximum concurrent jobs | 10 (for S3), 5 for (S2), 1 (for S1) |
| Maximum additional endpoints | 10 (for S1, S2, and S3) |
| Maximum message routing rules | 100 (for S1, S2, and S3) |
| Maximum number of concurrently connected device streams | 50 (for S1, S2, S3, and F1 only) |
| Maximum device stream data transfer | 300 MB per day (for S1, S2, S3, and F1 only) |

> [!NOTE]
> If you need more than 50 paid IoT hubs in an Azure subscription, contact Microsoft Support.

> [!NOTE]
> Currently, the total number of devices plus modules that can be registered to a single IoT hub is capped at 1,000,000. If you want to increase this limit, contact [Microsoft Support](https://azure.microsoft.com/support/options/).

IoT Hub throttles requests when the following quotas are exceeded.

| Throttle | Per-hub value |
| --- | --- |
| Identity registry operations <br/> (create, retrieve, list, update, and delete), <br/> individual or bulk import/export |83.33/sec/unit (5,000/min/unit) (for S3). <br/> 1.67/sec/unit (100/min/unit) (for S1 and S2). |
| Device connections |6,000/sec/unit (for S3), 120/sec/unit (for S2), 12/sec/unit (for S1). <br/>Minimum of 100/sec. |
| Device-to-cloud sends |6,000/sec/unit (for S3), 120/sec/unit (for S2), 12/sec/unit (for S1). <br/>Minimum of 100/sec. |
| Cloud-to-device sends | 83.33/sec/unit (5,000/min/unit) (for S3), 1.67/sec/unit (100/min/unit) (for S1 and S2). |
| Cloud-to-device receives |833.33/sec/unit (50,000/min/unit) (for S3), 16.67/sec/unit (1,000/min/unit) (for S1 and S2). |
| File upload operations |83.33 file upload initiations/sec/unit (5,000/min/unit) (for S3), 1.67 file upload initiations/sec/unit (100/min/unit) (for S1 and S2). <br/> 10,000 SAS URIs can be out for an Azure Storage account at one time.<br/> 10 SAS URIs/device can be out at one time. |
| Direct methods | 24 MB/sec/unit (for S3), 480 KB/sec/unit (for S2), 160 KB/sec/unit (for S1).<br/> Based on 8-KB throttling meter size. |
| Device twin reads | 500/sec/unit (for S3), Maximum of 100/sec or 10/sec/unit (for S2), 100/sec (for S1) |
| Device twin updates | 250/sec/unit (for S3), Maximum of 50/sec or 5/sec/unit (for S2), 50/sec (for S1) |
| Jobs operations <br/> (create, update, list, and delete) | 83.33/sec/unit (5,000/min/unit) (for S3), 1.67/sec/unit (100/min/unit) (for S2), 1.67/sec/unit (100/min/unit) (for S1). |
| Jobs per-device operation throughput | 50/sec/unit (for S3), maximum of 10/sec or 1/sec/unit (for S2), 10/sec (for S1). |
| Device stream initiation rate | 5 new streams/sec (for S1, S2, S3, and F1 only). |
