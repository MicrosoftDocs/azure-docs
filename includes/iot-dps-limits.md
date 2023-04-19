---
author: kgremban
ms.service: iot-dps
ms.topic: include
ms.date: 10/10/2021	
ms.author: kgremban
---

> [!NOTE]
> Some areas of this service have adjustable limits. This is represented in the tables below with the *Adjustable?* column. When the limit can be adjusted, the *Adjustable?* value is *Yes*.
>
>The actual value to which a limit can be adjusted may vary based on each customer’s deployment. Multiple instances of DPS may be required for very large deployments.
>
> If your business requires raising an adjustable limit or quota above the default limit, you can submit a request for additional resources by [opening a support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).  **Requesting an increase does not guarantee that it will be granted, as it needs to be reviewed on a case-by-case basis.  Please contact Microsoft support as early as possible during your implementation, to be able to determine if your request could be approved and plan accordingly.**

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
> If the hard limit on symmetric key enrollment groups is a blocking issue, it is recommended to use individual enrollments as a workaround.

The Device Provisioning Service has the following rate limits.

| Rate | Per-unit value | Adjustable? |
| --- | --- | --- |
| Operations | 1,000/min/service | Yes |
| Device registrations | 1,000/min/service | Yes |
| Device polling operation | 5/10 sec/device | No |

