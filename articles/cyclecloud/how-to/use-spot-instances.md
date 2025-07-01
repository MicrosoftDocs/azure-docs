---
title: Using Spot VMs
description: Using Spot VMs within Azure CycleCloud
author: bwatrous
ms.date: 07/01/2025
ms.author: bewatrou
---

# Using Spot VMs in Azure CycleCloud

Azure CycleCloud supports deploying [Spot VMs](/azure/virtual-machines/windows/spot-vms) in node arrays to greatly reduce the operational cost of clusters.  

> [!CAUTION]
> Spot VMs aren't appropriate for all workloads and cluster types. They offer no SLA for availability or capacity. They're "preemptible" or "low-priority" instances. Azure might evict them to manage capacity and as the Spot price changes.

## Configuring a node array for Spot

To enable Spot for a node array, set `Interruptible` to true in the `[[nodearray]]` section.

CycleCloud allows clusters to specify a `MaxPrice` for Spot instances. Since the Spot price adjusts periodically and varies significantly between regions and SKUs, the `MaxPrice` setting controls the maximum price (in $/hour) that you want to pay for a VM. By default, CycleCloud sets `MaxPrice=-1` when not otherwise specified, which means "don't evict based on Spot price." With this setting, instances are only evicted due to changes in capacity demands or other platform-level decisions.

For more information about variable pricing for Spot instances, see [Spot Pricing](/azure/virtual-machines/windows/spot-vms#pricing).

For most HPC applications, `MaxPrice=-1` works well as the default choice. If a node array supports [multi-select autoscaling](./cluster-templates.md#machine-types) across a range of VM versions, you can customize `MaxPrice` to prefer lower priced versions in the multi-select list.

``` ini
[cluster demo]

  [[nodearray execute]]
  Interruptible = true
  MaxPrice = 0.2
```

For more information, see [Spot Virtual Machines](./cluster-templates.md#spot-virtual-machines) in the cluster template guide.

## Spot VM Eviction

CycleCloud uses the [Scheduled Events](../how-to/scheduled-events.md) feature to watch for spot evictions. When a spot preemption event happens, the VM lets CycleCloud know. CycleCloud then moves the instance into a "waiting for eviction" state.

## Frequently asked questions

Using Spot with CycleCloud involves some considerations that are specific to HPC workloads and CycleCloud auto-scaling.

### When should I consider using Spot?

* Are your individual jobs relatively short?
  * Jobs that run in under one hour might be a good fit for Spot instances, because the eviction of the instance causes relatively little lost forward progress.
* Does your scheduler automatically retry or requeue jobs on hosts that fail?
* Are your jobs safe to rerun if the host is evicted during execution?
  * In general, spot instances are best for stateless workloads.
* Is minimizing the cost of the run more important than completion time?
  * Spot is often perfect for workloads that might be scheduled in low-priority or back-fill queues on-premises.
  * This concern is one of the cases where Spot might be appropriate even for short MPI jobs.

### When should I avoid using Spot?

* If your jobs are tightly coupled HPC jobs (for example, MPI jobs), then they're likely not good candidates for Spot.
* If your job is critical and/or has a deadline for completion, then regular priority instances might be a better fit since evictions and retries can extend the time to completion.
  * *However*, this situation might be an excellent opportunity to configure your cluster to use a mix of regular-priority and Spot instances. This configuration ensures the deadline is met while attempting to reduce runtime and cost by adding Spot instances.
* If your jobs aren't safe to re-run, then avoid using Spot.
  * For example, if your job modifies a database during execution, then automatically re-running the job might cause errors or invalid results.
* If your jobs runtimes are very long, then Spot might not be a good fit.
  * For long processes, both the chance of Spot eviction and dollar and time costs of retries increase.
  * However, you might need to measure this case on a case-by-case basis.

### Eviction and preemption

For details about Spot eviction in Azure, see [Spot Eviction Policy](/azure/virtual-machines/windows/spot-vms#eviction-policy).

**Q.** Can CycleCloud track Spot instance evictions and preemptions?

**A.** Yes. A Spot eviction event generates an Event Log notification in the Clusters UI page.

**Q.** How are users notified of eviction?

**A.** After CycleCloud evicts a node, users see a log message in the CycleCloud UI’s event log for the cluster. Users can also register to receive an Event from CycleCloud via [Azure EventGrid](/azure/cyclecloud/how-to/event-grid) after a spot instance is evicted.

* Users can check for an eviction notification on the machine 30 seconds before eviction. For details on how to register for the event, see [Scheduled Events](/azure/virtual-machines/linux/scheduled-events#why-use-scheduled-events).
* In general, treat eviction like pulling the plug on an on-premises machine. Handle it in the same ways.
* **IMPORTANT** Event handlers *should not acknowledge* the Spot Eviction Event, since the Cyclecloud event handler might not receive the event if it's acknowledged.
  
**Q.** How often does eviction happen?

**A.** The eviction rate changes a lot. It depends on changes in demand across the entire region.

**Q.** Why does the system evict instances?

**A.** Spot VMs don't guarantee availability and can be evicted at any time. For more information, see [the Spot VM documentation](/azure/virtual-machines/windows/spot-vms). If a node array sets a `MaxPrice`, the system evicts instances when the Spot price goes above the `MaxPrice`. This eviction is usually rare because the Spot price changes slowly. However, eviction can happen in these scenarios:

1. Spot capacity decreases when demand for regular priority VMs goes up.
1. Platform-level events, like planned hardware maintenance.

### How is my workflow impacted by eviction?

**Q.** What happens to my jobs when a Spot instance is evicted?

**A.** When a Spot instance is evicted, the node gets terminated unless your jobs are coded to handle the 30-second eviction notification and take appropriate action. If the node terminates without handling the eviction, the job fails (but it can be retried).

**Q.** Are the nodes deleted from the cluster?

**A.** Yes, the nodes are cleaned up in the CycleCloud UI. In supported schedulers, the scheduler also cleans up the nodes.

**Q.** Do jobs have to be re-run?

**A.** Generally, the scheduler takes care of retrying and rerunning jobs that get evicted. However, many types of jobs can't tolerate retries. For example, jobs that write partial data to persistent storage as they run. Avoid running these jobs on Spot instances.

**Q.** Can I use a mix of Spot and On-Demand or Regular-Priority VMs?

**A.** Yes. You can use separate Spot (`Interruptible`) and non-Spot node arrays to create a mix of Spot and Regular-Priority VMs. Using a mix of instance types usually requires making some configuration decisions based on your requirements and the scheduler you choose. Here are a couple of common configurations:

* Separate Spot and Regular-Priority VMs into separate queues in the scheduler.
  * With this configuration, the submitter can easily target jobs at the appropriate VM type.
* Create a single large resource pool with both Spot and Regular-Priority instances.
  * This configuration works well for highly scalable workloads that use a small percentage of regular priority instances to ensure forward progress and a large percentage of Spot instances to reduce cost and runtime.

**Q.** Can I change the [Spot Eviction Policy](/azure/virtual-machines/windows/spot-vms#eviction-policy) for CycleCloud node arrays?

**A.** No. If you set the `EvictionPolicy` attribute, the VMs are still deleted.

### Scheduler support for Spot eviction in CycleCloud

For detailed information on the CycleCloud implementation for your scheduler, see the scheduler-specific guide.

**Q.** How does the autoscaler for my scheduler handle Spot eviction?

**A.** All of the autoscalers for the built-in and supported schedulers (HTCondor, GridEngine, PBS Professional, Slurm, LSF) try to handle Spot evictions gracefully. In general, the autoscaler removes the evicted instance from the scheduler. If the capacity demand is higher than the new available capacity after eviction, the autoscaler replaces the instance.

You should build custom autoscalers to expect Spot evictions or general machine failures and handle them gracefully.

**Q.** What happens to the jobs that run on the evicted instance?

**A.** When you submit the job, you decide how to handle this issue. Some schedulers, like GridEngine, let you set the default action for each queue. By default, all built-in CycleCloud scheduler deployments, except for HTCondor, mark the jobs as failed when the node they're running on is evicted or unexpectedly terminated. This behavior is by design since only the user knows if their jobs can be safely retried.
