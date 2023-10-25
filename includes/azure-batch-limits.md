---
 title: include file
 description: include file
 services: batch
 ms.service: batch
 ms.topic: include
 ms.date: 11/17/2022
 ms.custom: include file
---

| **Resource** | **Default limit** | **Maximum limit** |
| --- | --- | --- |
| Azure Batch accounts per region per subscription | 1-3 | 50 |
| Dedicated cores per Batch account | 0-900<sup>1</sup> | Contact support |
| Low-priority cores per Batch account | 0-100<sup>1</sup> | Contact support |
| **[Active](/rest/api/batchservice/job/get#jobstate)** jobs and job schedules per Batch account (**completed** jobs have no limit) | 100-300 | 1,000<sup>2</sup> |
| Pools per Batch account | 0-100<sup>1</sup> | 500<sup>2</sup> |
| Private endpoint connections per Batch account | 100 | 100 |

<sup>1</sup> For capacity management purposes, the default quotas for new Batch accounts in some regions and for some subscription
types have been reduced from the above range of values. In some cases, these limits have been reduced to zero. When you create a
new Batch account, [check your quotas](../articles/batch/batch-quota-limit.md#view-batch-quotas) and
[request an appropriate core or service quota increase](../articles/batch/batch-quota-limit.md#increase-a-quota), if necessary.
Alternatively, consider reusing Batch accounts that already have sufficient quota or user subscription pool allocation
Batch accounts to maintain core and VM family quota across all Batch accounts on the subscription. Service quotas like
active jobs or pools apply to each distinct Batch account even for user subscription pool allocation Batch accounts.

<sup>2</sup> To request an increase beyond this limit, contact Azure Support.


> [!NOTE]
> Default limits vary depending on the type of subscription you use to create a Batch account. Cores quotas shown are for Batch
> accounts in Batch service mode. [View the quotas in your Batch account](../articles/batch/batch-quota-limit.md#view-batch-quotas).
