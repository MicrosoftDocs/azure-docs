---
 title: include file
 description: include file
 services: batch
 author: dlepow
 ms.service: batch
 ms.topic: include
 ms.date: 10/11/2018
 ms.author: danlep
 ms.custom: include file
---

| **Resource** | **Default Limit** | **Maximum Limit** |
| --- | --- | --- |
| Batch accounts per region per subscription | 1 - 3 |50 |
| Dedicated cores per Batch account | 10 - 100 | N/A<sup>1</sup> |
| Low-priority cores per Batch account | 10 - 100 | N/A<sup>2</sup> |
| Active jobs and job schedules<sup>3</sup> per Batch account | 100 - 300 | 1000<sup>4</sup> |
| Pools per Batch account | 20 - 100 | 500<sup>4</sup> |

> [!NOTE]
> Default limits vary depending on the type of subscription you use to create a Batch account. Cores quotas shown are for Batch accounts in Batch service mode. [View the quotas in your Batch account](../articles/batch/batch-quota-limit.md#view-batch-quotas). 

<sup>1</sup> The number of dedicated cores per Batch account can be increased, but the maximum number is unspecified. Contact Azure support to discuss increase options.

<sup>2</sup> The number of low-priority cores per Batch account can be increased, but the maximum number is unspecified. Contact Azure support to discuss increase options.

<sup>3</sup> Completed jobs and job schedules are not limited.

<sup>4</sup> Contact Azure support if you want to request an increase beyond this limit.
