---
title: Run Batch workloads on cost-effective Spot VMs
description: Learn how to provision Spot VMs to reduce the cost of Azure Batch workloads.
ms.topic: how-to
ms.date: 04/11/2023
ms.custom: seodec18, devx-track-linux
---

# Use Spot VMs with Batch workloads

Azure Batch offers Spot virtual machines (VMs) to reduce the cost of Batch workloads. Spot VMs make new types of Batch workloads possible by enabling a large amount of compute power to be used for a low cost.

Spot VMs take advantage of surplus capacity in Azure. When you specify Spot VMs in your pools, Azure Batch can use this surplus, when available.

The tradeoff for using Spot VMs is that those VMs might not always be available, or they might get preempted at any time, depending on available capacity. For this reason, Spot VMs are most suitable for batch and asynchronous processing workloads where the job completion time is flexible and the work is distributed across many VMs.

Spot VMs are offered at a reduced price compared with dedicated VMs. To learn more about pricing, see [Batch pricing](https://azure.microsoft.com/pricing/details/batch/).

## Differences between Spot and low-priority VMs

Batch offers two types of low-cost preemptible VMs:

- [Spot VMs](../virtual-machines/spot-vms.md), a modern Azure-wide offering also available as single-instance VMs or Virtual Machine Scale Sets.
- Low-priority VMs, a legacy offering only available through Azure Batch.

The type of node you get depends on your Batch account's pool allocation mode, which can be set during account creation. Batch accounts that use the **user subscription** pool allocation mode always get Spot VMs. Batch accounts that use the **Batch managed** pool allocation mode always get low-priority VMs.

> [!WARNING]
> Low-priority VMs will be retired after **30 September 2025**. Please [migrate to Spot VMs in Batch](low-priority-vms-retirement-migration-guide.md) before then.

Azure Spot VMs and Batch low-priority VMs are similar but have a few differences in behavior.

| | Spot VMs | Low-priority VMs |
|-|-|-|
| **Supported Batch accounts** | User-subscription Batch accounts | Batch-managed Batch accounts |
| **Supported Batch pool configurations** | Virtual Machine Configuration | Virtual Machine Configuration and Cloud Service Configuration (deprecated) |
| **Available regions** | All regions that support [Spot VMs](../virtual-machines/spot-vms.md) | All regions except Microsoft Azure operated by 21Vianet |
| **Customer eligibility** | Not available for some subscription offer types. See more about [Spot limitations](../virtual-machines/spot-vms.md#limitations). | Available for all Batch customers |
| **Possible reasons for eviction** | Capacity | Capacity |
| **Pricing Model** | Variable discounts relative to standard VM prices | Fixed discounts relative to standard VM prices |
| **Quota model** | Subject to core quotas on your subscription | Subject to core quotas on your Batch account |
| **Availability SLA** | None | None |

## Batch support for Spot VMs

Azure Batch provides several capabilities that make it easy to consume and benefit from Spot VMs:

- Batch pools can contain both dedicated VMs and Spot VMs. The number of each type of VM can be specified when a pool is created, or changed at any time for an existing pool, by using the explicit resize operation or by using autoscale. Job and task submission can remain unchanged, regardless of the VM types in the pool. You can also configure a pool to completely use Spot VMs to run jobs as cheaply as possible, but spin up dedicated VMs if the capacity drops below a minimum threshold, to keep jobs running.
- Batch pools automatically seek the target number of Spot VMs. If VMs are preempted or unavailable, Batch attempts to replace the lost capacity and return to the target.
- When tasks are interrupted, Batch detects and automatically requeues tasks to run again.
- Spot VMs have a separate vCPU quota that differs from the one for dedicated VMs. The quota for Spot VMs is higher than the quota for dedicated VMs, because Spot VMs cost less. For more information, see [Batch service quotas and limits](batch-quota-limit.md#resource-quotas).

## Considerations and use cases

Many Batch workloads are a good fit for Spot VMs. Consider using Spot VMs when jobs are broken into many parallel tasks, or when you have many jobs that are scaled out and distributed across many VMs.

Some examples of batch processing use cases that are well suited for Spot VMs are:

- **Development and testing**: In particular, if large-scale solutions are being developed, significant savings can be realized. All types of testing can benefit, but large-scale load testing and regression testing are great uses.
- **Supplementing on-demand capacity**: Spot VMs can be used to supplement regular dedicated VMs. When available, jobs can scale and therefore complete quicker for lower cost; when not available, the baseline of dedicated VMs remains available.
- **Flexible job execution time**: If there's flexibility in the time jobs have to complete, then potential drops in capacity can be tolerated. However, with the addition of Spot VMs, jobs frequently run faster and for a lower cost.

Batch pools can be configured to use Spot VMs in a few ways:

- A pool can use only Spot VMs. In this case, Batch recovers any preempted capacity when available. This configuration is the cheapest way to execute jobs.
- Spot VMs can be used with a fixed baseline of dedicated VMs. The fixed number of dedicated VMs ensures there's always some capacity to keep a job progressing.
- A pool can use a dynamic mix of dedicated and Spot VMs, so that the cheaper Spot VMs are solely used when available, but the full-priced dedicated VMs scale up when required. This configuration keeps a minimum amount of capacity available to keep jobs progressing.

Keep in mind the following practices when planning your use of Spot VMs:

- To maximize the use of surplus capacity in Azure, suitable jobs can scale out.
- Occasionally, VMs might not be available or are preempted, which results in reduced capacity for jobs and could lead to task interruption and reruns.
- Tasks with shorter execution times tend to work best with Spot VMs. Jobs with longer tasks might be impacted more if interrupted. If long-running tasks implement checkpointing to save progress as they execute, this impact might be reduced.
- Long-running MPI jobs that utilize multiple VMs aren't well suited for Spot VMs, because one preempted VM can lead to the whole job having to run again.
- Spot nodes may be marked as unusable if [network security group (NSG) rules](batch-virtual-network.md#general-virtual-network-requirements) are configured incorrectly.

## Create and manage pools with Spot VMs

A Batch pool can contain both dedicated and Spot VMs (also referred to as compute nodes). You can set the target number of compute nodes for both dedicated and Spot VMs. The target number of nodes specifies the number of VMs you want to have in the pool.

The following example creates a pool using Azure virtual machines, in this case Linux VMs, with a target of 5 dedicated VMs and 20 Spot VMs:

```csharp
ImageReference imageRef = new ImageReference(
    publisher: "Canonical",
    offer: "UbuntuServer",
    sku: "20.04-LTS",
    version: "latest");

// Create the pool
VirtualMachineConfiguration virtualMachineConfiguration =
    new VirtualMachineConfiguration("batch.node.ubuntu 20.04", imageRef);

pool = batchClient.PoolOperations.CreatePool(
    poolId: "vmpool",
    targetDedicatedComputeNodes: 5,
    targetLowPriorityComputeNodes: 20,
    virtualMachineSize: "Standard_D2_v2",
    virtualMachineConfiguration: virtualMachineConfiguration);
```

You can get the current number of nodes for both dedicated and Spot VMs:

```csharp
int? numDedicated = pool1.CurrentDedicatedComputeNodes;
int? numLowPri = pool1.CurrentLowPriorityComputeNodes;
```

Pool nodes have a property to indicate if the node is a dedicated or Spot VM:

```csharp
bool? isNodeDedicated = poolNode.IsDedicated;
```

Spot VMs might occasionally be preempted. When preemption happens, tasks that were running on the preempted node VMs are requeued and run again when capacity returns.

For Virtual Machine Configuration pools, Batch also performs the following behaviors:

- The preempted VMs have their state updated to *Preempted*.
- The VM is effectively deleted, leading to loss of any data stored locally on the VM.
- A list nodes operation on the pool still returns the preempted nodes.
- The pool continually attempts to reach the target number of Spot nodes available. When replacement capacity is found, the nodes keep their IDs, but are reinitialized, going through *Creating* and *Starting* states before they're available for task scheduling.
- Preemption counts are available as a metric in the Azure portal.

## Scale pools containing Spot VMs

As with pools solely consisting of dedicated VMs, it's possible to scale a pool containing Spot VMs by calling the `Resize` method or by using autoscale.

The pool resize operation takes a second optional parameter that updates the value of `targetLowPriorityNodes`:

```csharp
pool.Resize(targetDedicatedComputeNodes: 0, targetLowPriorityComputeNodes: 25);
```

The pool autoscale formula supports Spot VMs as follows:

- You can get or set the value of the service-defined variable `$TargetLowPriorityNodes`.
- You can get the value of the service-defined variable `$CurrentLowPriorityNodes`.
- You can get the value of the service-defined variable `$PreemptedNodeCount`. This variable returns the number of nodes in the preempted state and allows you to scale up or down the number of dedicated nodes, depending on the number of preempted nodes that are unavailable.

## Configure jobs and tasks

Jobs and tasks may require some extra configuration for Spot nodes:

- The `JobManagerTask` property of a job has an `AllowLowPriorityNode` property. When this property is true, the job manager task can be scheduled on either a dedicated or Spot node. If it's false, the job manager task is scheduled to a dedicated node only.
- The `AZ_BATCH_NODE_IS_DEDICATED` [environment variable](batch-compute-node-environment-variables.md) is available to a task application so that it can determine whether it's running on a Spot or on a dedicated node.

## View metrics for Spot VMs

New metrics are available in the [Azure portal](https://portal.azure.com) for Spot nodes. These metrics are:

- Low-Priority Node Count
- Low-Priority Core Count
- Preempted Node Count

To view these metrics in the Azure portal:

1. Navigate to your Batch account in the Azure portal.
2. Select **Metrics** from the **Monitoring** section.
3. Select the metrics you desire from the **Metric** list.

## Limitations

- Spot VMs in Batch don't support setting a max price and don't support price-based evictions. They can only be evicted for capacity reasons.
- Spot VMs are only available for Virtual Machine Configuration pools and not for Cloud Service Configuration pools, which are [deprecated](https://azure.microsoft.com/updates/azure-batch-cloudserviceconfiguration-pools-will-be-retired-on-29-february-2024/).
- Spot VMs aren't available for some clouds, VM sizes, and subscription offer types. See more about [Spot VM limitations](../virtual-machines/spot-vms.md#limitations).
- Currently, [ephemeral OS disks](create-pool-ephemeral-os-disk.md) aren't supported with Spot VMs due to the service-managed eviction policy of *Stop-Deallocate*.

## Next steps

- Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
- Learn about the [Batch APIs and tools](batch-apis-tools.md) available for building Batch solutions.
- Start to plan the move from low-priority VMs to Spot VMs. If you use low-priority VMs with *Cloud Services Configuration* pools (which are [deprecated](https://azure.microsoft.com/updates/azure-batch-cloudserviceconfiguration-pools-will-be-retired-on-29-february-2024)), plan to migrate to [Virtual Machine Configuration pools](nodes-and-pools.md#configurations) instead.
