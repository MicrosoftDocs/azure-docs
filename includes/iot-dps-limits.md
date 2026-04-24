---
author: cwatson-cat
ms.service: azure-iot-hub
ms.topic: include
ms.date: 04/24/2026
ms.author: cwatson
ms.subservice: azure-iot-hub-dps
---

Some areas of this service have adjustable limits. The tables below include an *Adjustable?* column. If the limit is adjustable, the *Adjustable?* value is *Yes*.

The actual value that you can adjust a limit to might vary based on your deployment. Very large deployments might require multiple instances of DPS.

If your business requires a higher adjustable limit or quota, [open a support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) to request additional resources. An increase request isn't guaranteed because each case requires individual review. Contact Microsoft support as early as possible during your implementation so the team can determine whether to approve your request and help you plan accordingly.

The following table lists the limits that apply to Azure IoT Hub Device Provisioning Service resources.

| Resource | Limit | Adjustable? |
| --- | --- | --- |
| Maximum device provisioning services per Azure subscription | 10 | Yes |
| Maximum number of registrations | 1,000,000 | Yes |
| Maximum number of individual enrollments | 1,000,000 | Yes |
| Maximum number of enrollment groups *(X.509 certificate)* | 100 | Yes |
| Maximum number of enrollment groups *(symmetric key)* | 100 | No |
| Maximum number of CAs | 25 | Yes |
| Maximum number of linked IoT hubs | 50 | No |
| Maximum size of message | 96 KB| No |

> [!TIP]
> If the hard limit on symmetric key enrollment groups is a blocking issue, use individual enrollments as a workaround.

The Device Provisioning Service has the following rate limits.

| Rate | Per-unit value | Adjustable? |
| --- | --- | --- |
| Operations | 1,000/min/service | Yes |
| Device registrations | 1,000/min/service | Yes |
| Device polling operation | 5/10 sec/device | No |

