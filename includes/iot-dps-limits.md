---
author: kgremban
ms.service: iot-dps
ms.topic: include
ms.date: 03/06/2024
ms.author: kgremban
---

The following table lists the limits that apply to Azure IoT Hub Device Provisioning Service resources.

| Resource | Limit | Adjustable? |
| --- | --- | --- |
| Maximum device provisioning services per Azure subscription | 10 | No |
| Maximum number of registrations | 1,000,000 | No |
| Maximum number of individual enrollments | 1,000,000 | No |
| Maximum number of enrollment groups *(X.509 certificate)* | 100 | No |
| Maximum number of enrollment groups *(symmetric key)* | 100 | No |
| Maximum number of CAs | 25 | No |
| Maximum number of linked IoT hubs | 50 | No |
| Maximum size of message | 96 KB| No |

> [!TIP]
> If the hard limit on symmetric key enrollment groups is a blocking issue, it is recommended to use individual enrollments as a workaround.

The Device Provisioning Service has the following rate limits.

| Rate | Per-unit value | Adjustable? |
| --- | --- | --- |
| Operations | 1,000/min/service | No |
| Device registrations | 1,000/min/service | No |
| Device polling operation | 5/10 sec/device | No |

