---
author: rothja
ms.service: iot-dps
ms.topic: include
ms.date: 11/09/2018	
ms.author: jroth
---
The following table lists the limits that apply to Azure IoT Hub Device Provisioning Service resources.

| Resource | Limit |
| --- | --- |
| Maximum device provisioning services per Azure subscription | 10 |
| Maximum number of enrollments | 1,000,000 |
| Maximum number of registrations | 1,000,000 |
| Maximum number of enrollment groups | 100 |
| Maximum number of CAs | 25 |
| Maximum number of linked IoT hubs | 50 |
| Maximum size of message | 96 KB|

> [!NOTE]
> To increase the number of enrollments and registrations on your provisioning service, contact [Microsoft Support](https://azure.microsoft.com/support/options/).

> [!NOTE]
> Increasing the maximum number of CAs is not supported.

The Device Provisioning Service throttles requests when the following quotas are exceeded.

| Throttle | Per-unit value |
| --- | --- |
| Operations | 200/min/service |
| Device registrations | 200/min/service |
| Device polling operation | 5/10 sec/device |
