---
title: Run Batch workloads on cost-effective Spot VMs
description: Learn how to provision Spot VMs to reduce the cost of Azure Batch workloads.
ms.topic: how-to
ms.date: 04/14/2026
ms.custom:
# Customer intent: "As a cloud solutions architect, I want to deploy Batch workloads using Spot VMs, so that I can reduce costs while managing jobs with flexible completion times and efficient resource allocation."
---

# Use Spot VMs with Batch workloads

Azure Batch offers Spot virtual machines (VMs) to reduce the cost of Batch workloads. Spot VMs make new types of Batch workloads possible by enabling a large amount of compute power to be used for a low cost.

Spot VMs take advantage of surplus capacity in Azure. The amount of surplus capacity that is available varies depending on factors such as VM family, VM size, region, and time of day. When you specify Spot VMs in your pools, Azure Batch can use this surplus, when available.

The tradeoff for using Spot VMs is that these VMs have no SLA and no availability guarantees. Spot VMs can be preempted at any time, including immediately upon VM creation. For this reason, Spot VMs are most suitable for batch and asynchronous processing workloads where the job completion time is flexible and the work is distributed across many VMs.

If a preemption occurs, the Spot compute node will be evicted and all work that wasn't appropriately checkpointed will be lost. Checkpointing is optional and is up to the Batch end-user to implement. The running Batch task that was interrupted due to preemption will be automatically requeued for execution by a different compute node. A preempted VM may later be restored by the Azure platform, but restoration is only attempted for the first 48 hours after preemption and is not guaranteed to eventually succeed.

Spot VMs are offered at a reduced price compared with dedicated VMs. To learn more about pricing, see [Batch pricing](https://azure.microsoft.com/pricing/details/batch/).

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

Spot VMs might occasionally be preempted. When preemption happens, tasks that were running on the preempted node VMs are requeued and run again when capacity returns. Batch also performs the following behaviors:

- The preempted VMs have their state updated to *Preempted*.
- The VM is effectively deleted, leading to loss of any data stored locally on the VM.
- A list nodes operation on the pool still returns the preempted nodes.
- The pool continually attempts to reach the target number of Spot nodes available. When replacement capacity is found, the nodes keep their IDs, but are reinitialized, going through *Creating* and *Starting* states before they're available for task scheduling.
- Preemption counts are available as a metric in the Azure portal.

### Azure Batch SDK

The following example creates a pool using Azure virtual machines, in this case Linux VMs, with a target of 5 dedicated VMs and 20 Spot VMs:

```csharp
ImageReference imageRef = new ImageReference(
    publisher: "Canonical",
    offer: "ubuntu-24_04-lts",
    sku: "server",
    version: "latest");

// Create the pool
VirtualMachineConfiguration virtualMachineConfiguration =
    new VirtualMachineConfiguration("batch.node.ubuntu 24.04", imageRef);

pool = batchClient.PoolOperations.CreatePool(
    poolId: "vmpool",
    targetDedicatedComputeNodes: 5,
    targetLowPriorityComputeNodes: 20,
    virtualMachineSize: "Standard_D4s_v3",
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

As with pools solely consisting of dedicated VMs, it's possible to scale a pool containing Spot VMs by calling the `Resize` method or by using autoscale.

The pool resize operation takes a second optional parameter that updates the value of `targetLowPriorityNodes`:

```csharp
pool.Resize(targetDedicatedComputeNodes: 0, targetLowPriorityComputeNodes: 25);
```

### Azure CLI

#### Create a new pool with Spot instances:
```azurecli-interactive
az batch pool create \
  --id "vmpool" \
  --vm-size "Standard_D4s_v3" \
  --target-dedicated-nodes 5 \
  --target-low-priority-nodes 20 \
  --enable-inter-node-communication false \
  --image "Canonical:ubuntu-24_04-lts:server" \
  --node-agent-sku-id "batch.node.ubuntu 24.04" \
  --account-name <your-batch-account-name> \
  --account-endpoint "https://<your-batch-account-name>.<region>.batch.azure.com"
```

#### Scale existing pool to use Spot instances:
```azurecli-interactive
az batch pool resize \
  --pool-id <existing-pool-id> \
  --target-dedicated-nodes 5 \
  --target-low-priority-nodes 20 \
  --account-name <your-batch-account-name> \
  --account-endpoint "https://<your-batch-account-name>.<region>.batch.azure.com"
```

#### Check pool state and node allocation
```azurecli-interactive
az batch pool show \
  --account-name <your-batch-account-name> \
  --account-endpoint "https://<your-batch-account-name>.<region>.batch.azure.com" \
  --pool-id <your-pool-id> \
  --query "{State:state, CurrentSpotNodes:currentLowPriorityNodes, TargetSpotNodes:scaleSettings.targetLowPriorityNodes, ResizeErrors:resizeErrors}"
```

### Azure PowerShell

#### Create pool with Spot instances:
```powershell
New-AzBatchPool `
  -Id "vmpool" `
  -VirtualMachineSize "Standard_D4s_v3" `
  -TargetDedicatedComputeNodes 5 `
  -TargetLowPriorityComputeNodes 20 `
  -VirtualMachineImageId "/subscriptions/{subscription}/resourceGroups/{rg}/providers/Microsoft.Compute/images/{image}" `
  -BatchContext $context
```

#### Validate with PowerShell:
```powershell
$pool = Get-AzBatchPool -Id "vmpool" -BatchContext $context
$pool | Select-Object Id, VmSize, @{Name="SpotNodes";Expression={$_.TargetLowPriorityComputeNodes}}, State
```

### Azure portal

1. In the Azure portal, select the Batch account and view an existing pool or create a new pool.
2. Under **Scale**, select either **Target dedicated nodes** or **Target Spot/low-priority nodes**.

   :::image type="content" source="media/certificates/low-priority-vms-scale-target-nodes.png" alt-text="Screenshot that shows how to scale target nodes.":::

3. For an existing pool, select the pool, and then select **Scale** to update the number of Spot nodes required.
4. Select **Save**.

### Autoscale with Spot VMs

Besides setting target VM counts directly, you may optionally define an autoscale formula for your pool. The pool autoscale formula supports Spot VMs as follows:

- You can get or set the value of the service-defined variable `$TargetLowPriorityNodes`.
- You can get the value of the service-defined variable `$CurrentLowPriorityNodes`.
- You can get the value of the service-defined variable `$PreemptedNodeCount`. This variable returns the number of nodes in the preempted state and allows you to scale up or down the number of dedicated nodes, depending on the number of preempted nodes that are unavailable.

For more information, see the [Batch Autoscale Guide](batch-automatic-scaling.md).

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
- Spot VMs aren't available for some clouds, VM sizes, and subscription offer types. See more about [Spot VM limitations](/azure/virtual-machines/spot-vms#limitations).
- Currently, [ephemeral OS disks](create-pool-ephemeral-os-disk.md) aren't supported with Spot VMs due to the service-managed eviction policy of *Stop-Deallocate*.

## Next steps

- Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
- Learn about the [Batch APIs and tools](batch-apis-tools.md) available for building Batch solutions.
- For more information about Spot VMs in Azure, including how to view historical pricing and eviction rates, see [Spot Virtual Machines](/azure/virtual-machines/spot-vms).
