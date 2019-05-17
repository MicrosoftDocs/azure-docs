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

| **Resource** | **Default limit** | **Maximum limit** |
| --- | --- | --- |
| Azure Batch accounts per region per subscription | 1-3 |50 |
| Dedicated cores per Batch account | 10-100 | N/A<sup>a</sup> |
| Low-priority cores per Batch account | 10-100 | N/A<sup>b</sup> |
| Active jobs and job schedules<sup>c</sup> per Batch account | 100-300 | 1,000<sup>d</sup> |
| Pools per Batch account | 20-100 | 500<sup>d</sup> |

> [!NOTE]
> Default limits vary depending on the type of subscription you use to create a Batch account. Cores quotas shown are for Batch accounts in Batch service mode. [View the quotas in your Batch account](../articles/batch/batch-quota-limit.md#view-batch-quotas). 

<sup>a</sup> The number of dedicated cores per Batch account can be increased, but the maximum number is unspecified. To discuss increase options, contact Azure Support.

<sup>b</sup> The number of low-priority cores per Batch account can be increased, but the maximum number is unspecified. To discuss increase options, contact Azure Support.

<sup>c</sup> Completed jobs and job schedules aren't limited.

<sup>d</sup> To request an increase beyond this limit, contact Azure Support.
