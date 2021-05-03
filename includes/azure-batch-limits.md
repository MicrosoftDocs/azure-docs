---
 title: include file
 description: include file
 services: batch
 author: JnHs
 ms.service: batch
 ms.topic: include
 ms.date: 12/16/2020
 ms.author: jenhayes
 ms.custom: include file
---

| **Resource** | **Default limit** | **Maximum limit** |
| --- | --- | --- |
| Azure Batch accounts per region per subscription | 1-3 |50 |
| Dedicated cores per Batch account | 90-900 | Contact support |
| Low-priority cores per Batch account | 10-100 | Contact support |
| **[Active](/rest/api/batchservice/job/get#jobstate)** jobs and job schedules per Batch account (**completed** jobs have no limit) | 100-300 | 1,000<sup>1</sup> |
| Pools per Batch account | 20-100 | 500<sup>1</sup> |

<sup>1</sup>To request an increase beyond this limit, contact Azure Support.

> [!NOTE]
> Default limits vary depending on the type of subscription you use to create a Batch account. Cores quotas shown are for Batch accounts in Batch service mode. [View the quotas in your Batch account](../articles/batch/batch-quota-limit.md#view-batch-quotas).

> [!IMPORTANT]
> To help us better manage capacity during the global health pandemic, the default core quotas for new Batch accounts in some regions and for some types of subscription have been reduced from the above range of values, in some cases to zero cores. When you create a new Batch account, [check your core quota](../articles/batch/batch-quota-limit.md#view-batch-quotas) and [request a core quota increase](../articles/batch/batch-quota-limit.md#increase-a-quota), if required. Alternatively, consider reusing Batch accounts that already have sufficient quota.