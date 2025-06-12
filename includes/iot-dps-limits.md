---
author: SoniaLopezBravo
ms.service: azure-iot-hub
ms.topic: include
ms.date: 03/06/2024
ms.author: sonialopez
ms.subservice: azure-iot-hub-dps
---

The following table lists the limits that apply to Azure IoT Hub Device Provisioning Service resources.

| Resource | Limit |
| --- | --- |
| Maximum device provisioning services per Azure subscription | 10 |
| Maximum number of registrations | 1,000,000 |
| Maximum number of individual enrollments | 1,000,000 |
| Maximum number of enrollment groups *(X.509 certificate)* | 100 |
| Maximum number of enrollment groups *(symmetric key)* | 100 |
| Maximum number of CAs | 25 |
| Maximum number of linked IoT hubs | 50 |
| Maximum size of message | 96 KB|

> [!TIP]
> If the hard limit on symmetric key enrollment groups is a blocking issue, use individual enrollments as a workaround.

The Device Provisioning Service has the following rate limits.

| Rate | Per-unit value |
| --- | --- |
| Operations | 1,000/min/service |
| Device registrations | 1,000/min/service |
| Device polling operation | 5/10 sec/device |

