---
 title: include file
 description: include file
 services: batch
 author: laurenhughes
 ms.service: batch
 ms.topic: include
 ms.date: 05/28/2019
 ms.author: lahugh
 ms.custom: include file
---

| **Resource** | **Default limit** | **Maximum limit** |
| --- | --- | --- |
| Azure Batch accounts per region per subscription | 1-3 |50 |
| Dedicated cores per Batch account | 90-900 | Contact support |
| Low-priority cores per Batch account | 10-100 | Contact support |
| **[Active](https://docs.microsoft.com/rest/api/batchservice/job/get#jobstate)** jobs and job schedules per Batch account (**completed** jobs have no limit) | 100-300 | 1,000<sup>1</sup> |
| Pools per Batch account | 20-100 | 500<sup>1</sup> |

> [!NOTE]
> Default limits vary depending on the type of subscription you use to create a Batch account. Cores quotas shown are for Batch accounts in Batch service mode. [View the quotas in your Batch account](../articles/batch/batch-quota-limit.md#view-batch-quotas).

<sup>1</sup>To request an increase beyond this limit, contact Azure Support.
