---
title: Capacity planning for Azure Batch
description: Learn how to plan capacity for Azure Batch workloads, including the capacity hierarchy, quota planning, proactive monitoring, and strategies to avoid allocation failures.
ms.topic: concept-article
ms.date: 06/04/2026
# Customer intent: As a cloud engineer planning Batch workloads, I want to understand how Azure Batch capacity and quotas fit together, so that I can size my pools, request the right quota, and avoid allocation failures.
---

# Capacity planning for Azure Batch

Effective capacity planning helps ensure that your Azure Batch workloads have the compute resources they need, when they need them. This article explains how Batch capacity is structured, how to plan quota for your workloads, and how to reduce the risk of allocation failures.

A quota is a limit, not a capacity guarantee. Planning ahead helps you request appropriate quota, choose resilient configurations, and react gracefully when capacity is constrained. For the specific default and maximum values, see [Batch service quotas and limits](batch-quota-limit.md).

## Capacity hierarchy

Batch capacity is governed at several layers, where each layer constrains the one below it. Your effective capacity is whatever the most restrictive limit in the chain allows.

At the top, the **Azure region** provides the physical datacenter capacity available for each VM family. Regional capacity isn't a fixed value that you control; it varies over time and by VM series. Your **subscription quota** then sets the allowed core limit per VM family per region. In [user subscription pool allocation mode](batch-quota-limit.md#core-quotas-in-user-subscription-mode), these subscription quotas apply directly to your Batch pools. The **Batch account quota** sets the cores, pools, and active jobs allowed per Batch account. In [Batch service pool allocation mode](batch-quota-limit.md#core-quotas-in-batch-service-mode), these account-level quotas apply. Finally, **pool limits** bound the number of nodes per pool, based on the quota above the pool and the [pool size limits](batch-quota-limit.md#pool-size-limits) set by the Batch service.

Understanding which layer applies to your account depends on your pool allocation mode. For more information, see [Batch accounts and pool allocation modes](accounts.md).

## Plan your capacity requirements

Before you create production pools, estimate the resources your workload needs. Work through the following questions to translate workload characteristics into a quota request:

- **Workload profile.** What's the peak number of concurrent jobs and tasks? What's the average task duration and memory requirement? Do tasks need GPUs or multi-node (MPI) coordination?
- **VM selection.** Which [VM family and size](batch-pool-vm-sizes.md) best matches the workload? How many cores and how much memory does each VM provide?
- **Pool sizing.** How many tasks run concurrently per node ([up to four times the number of node cores](batch-parallel-node-tasks.md), capped at 256 task slots per node)? Given the peak concurrent task count, how many nodes do you need? How do you split capacity between dedicated and [Spot nodes](batch-spot-vms.md)?
- **Quota requirement.** Multiply the maximum node count by the cores per VM to get the total cores needed. Compare that total against your current quota to determine the increase to request.
- **Cost estimate.** Use the VM hourly rate and expected run time to estimate daily and monthly cost. For more information, see [Plan to manage costs for Azure Batch](plan-to-manage-costs.md).

To check your current quotas and request an increase, see [View Batch quotas](batch-quota-limit.md#view-batch-quotas) and [Increase a quota](batch-quota-limit.md#increase-a-quota). Submit quota requests well in advance, and start with modest, incremental increases. Large quota increases might require manual review and can take several days to several weeks.

## Manage capacity proactively

Plan for capacity before it becomes a constraint:

- **Monitor quota usage.** Track core usage against your quota and alert when usage approaches the limit, for example at 70–80%. For more information, see [Monitor Batch solutions](monitor-batch.md).
- **Use autoscale.** Configure [automatic scaling](batch-automatic-scaling.md) so pools grow and shrink with demand instead of holding a fixed, over-provisioned node count. A common pattern maintains a baseline of dedicated nodes for guaranteed progress and bursts onto Spot nodes for additional throughput.
- **Spread across regions and accounts.** Distribute workloads across multiple regions or Batch accounts to access more aggregate capacity. Service quotas such as active jobs and pools apply to each distinct Batch account.

## Handle capacity constraints

Even with planning, you might encounter allocation failures. Design your workflow to be resilient:

- **Retry and diversify.** If a pool can't reach its target size, retry after a few minutes, try a different VM size, or try a different region. Resource availability changes over time.
- **Retarget jobs.** Avoid relying on a single static pool. Ensure you can retarget jobs to a different pool, possibly with a different VM size, if a pool can't grow. For more information, see [Azure Batch best practices](best-practices.md#pools).
- **Build for Spot preemption.** [Spot nodes](batch-spot-vms.md) can be preempted when Azure needs the capacity back. Use Spot nodes only for fault-tolerant work, and combine them with dedicated nodes and autoscale so the pool recovers automatically.

For detailed symptoms, causes, and resolutions of allocation and quota errors, see the troubleshooting guidance:

- [Pool and node errors](batch-pool-node-error-checking.md)
- [Azure Batch pool resizing failure](/troubleshoot/azure/hpc/batch/azure-batch-pool-resizing-failure)
- [Azure Batch pool creation failure](/troubleshoot/azure/hpc/batch/azure-batch-pool-creation-failure)

## Best practices

| Practice | Description |
| --- | --- |
| Request quota early | Submit quota requests well in advance; large increases can take several days to several weeks. |
| Plan for headroom | Request slightly more quota than your current peak to allow for growth. |
| Use multiple regions | Spread workloads across regions to access more aggregate capacity. |
| Monitor usage | Alert when core usage reaches 70–80% of your quota. |
| Right-size VMs | Match the VM family and size to the workload instead of over-provisioning. |
| Use Spot wisely | Reserve Spot nodes for fault-tolerant workloads, and pair them with dedicated nodes. |
| Clean up resources | Delete unused pools to free account quota. |

## Next steps

- [Batch service quotas and limits](batch-quota-limit.md)
- [Azure Batch best practices](best-practices.md)
- [Choose VM sizes and images for pools](batch-pool-vm-sizes.md)
- [Automatically scale compute nodes in a Batch pool](batch-automatic-scaling.md)
- [Plan to manage costs for Azure Batch](plan-to-manage-costs.md)
