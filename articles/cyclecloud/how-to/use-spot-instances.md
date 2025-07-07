---
title: Using Spot VMs
description: Using Spot VMs within Azure CycleCloud
author: bwatrous
ms.date: 05/13/2020
ms.author: bewatrou
---

# Using Spot VMs in Azure CycleCloud

Azure CycleCloud supports deploying [Spot VMs](/azure/virtual-machines/windows/spot-vms) in nodearrays to greatly reduce the operational cost of clusters.  

> [!CAUTION]
> Spot VMs are not appropriate for all workloads and cluster types.  They offer no SLA for availability or capacity. They are "preemptible" or "low-priority" instances and may be evicted by the Azure fabric to manage capacity and as the Spot price changes.

## Configuring a Nodearray for Spot

To enable Spot for a nodearray, simply set `Interruptible` to true on the `[[nodearray]]` section.

CycleCloud allows clusters to specify a `MaxPrice` for Spot instances.   Since the Spot price may adjust periodically and may vary significantly between Regions and SKUs, the `MaxPrice` allows users to control the maximum price (in $/hour) that they are willing to pay for a VM.  By default, CycleCloud sets `MaxPrice=-1` when not otherwise specified, which means "do not evict based on Spot price."   With this setting, instances will only be evicted due to changes in capacity demands or other platform-level decisions.  

See [Spot Pricing](/azure/virtual-machines/windows/spot-vms#pricing) for details on variable pricing for Spot instances.

For most HPC applications, `MaxPrice=-1` is a good default choice.   However, if a nodearray supports [multi-select autoscaling](./cluster-templates.md#machine-types) across a range of VM SKUs, then `MaxPrice` may also be customized to create a preference for lower priced SKUs in the multi-select list.

``` ini
[cluster demo]

  [[nodearray execute]]
  Interruptible = true
  MaxPrice = 0.2
```

For full details see [Spot Virtual Machines](./cluster-templates.md#spot-virtual-machines) in the cluster template guide.

## Spot VM Eviction

CycleCloud monitors for spot evictions via the [Scheduled Events](../how-to/scheduled-events.md) feature. When a spot preemption event is detected, CycleCloud is notified by the VM and the instance is moved into a "waiting for eviction" state. 

## Frequently Asked Questions

Using Spot with CycleCloud has some considerations that are specific to HPC workloads and CycleCloud auto-scaling.

### When should I consider using Spot?

* Are your individual jobs relatively short?
  * A good rule of thumb is that jobs that run in under one hour may be a good fit for Spot instances, because relatively little forward progress will be lost if the instance is evicted.
* Does your scheduler automatically retry/requeue jobs on hosts that fail?
* Are your jobs safe to re-run if the host is evicted during execution?
  * In general, spot instances are best for stateless workloads.
* Is minimizing the cost of the run more important than completion time?
  * Spot is often perfect for workloads that might be scheduled in low-priority or back-fill queues on-premise.
  * This is one of the cases where Spot may be appropriate even for short MPI jobs.

### When should I avoid using Spot?

* If your jobs are tightly coupled HPC jobs (for example, MPI jobs) then they are likely not good candidates for Spot.
* If your Job is critical and/or has a deadline for completion, then regular priority instances may be a better fit since evictions and retries may extend the time to completion.
  * *However*, this may be an excellent opportunity to configure your cluster to use a mix of regular-priority and Spot instances to ensure the deadline is met while attempting to reduce runtime and cost by adding Spot instances.
* If your jobs are not safe to re-run, then Spot should be avoided.
  * For example, if your job modifies a database during execution then automatically re-running the job may cause errors or invalid results.
* If your Jobs runtimes are very long, then Spot may not be a good fit.
  * For long processes, both the chance of Spot eviction and dollar and time costs of retries increase.
  * However, this is a case that may require measurement on a case by case basis.

### Eviction / Preemption

See [Spot Eviction Policy](/azure/virtual-machines/windows/spot-vms#eviction-policy) for details on Spot eviction in Azure.

**Q.** Can CycleCloud track Spot instance evictions/preemptions?

**A.** Yes.  A Spot eviction event will generate an Event Log notification in the Clusters UI page.

**Q.** How are users notified of eviction?

**A.** After a CycleCloud node is evicted, users will see a log message in the CycleCloud UI’s event log for the cluster.   Users may also register to receive an Event from CycleCloud via [Azure EventGrid](/azure/cyclecloud/how-to/event-grid) after a spot instance is evicted. 

* Users can check for an eviction notification on the machine 30 seconds prior to eviction.  See [Scheduled Events](/azure/virtual-machines/linux/scheduled-events#why-use-scheduled-events) for details on how to register for the event.
* In general, eviction should be considered similar to pulling the plug on an on-premise machine, and it should be handled in the same ways.
* **IMPORTANT** Event handlers *should not acknowledge* the Spot Eviction Event, since the Cyclecloud event handler may not receive the event if it is acknowledged.
  
**Q.** How frequently does eviction occur?

**A.** The eviction rate is highly variable and largely dependent on changes in demand across the entire region.

**Q.** Why are instances evicted?

**A.** Spot VMs make no guarantees about availability and may evicted at any time.   See [the Spot VM documentation](/azure/virtual-machines/windows/spot-vms) for details.   If a nodearray has set a `MaxPrice` then instances will be evicted if the Spot price rises above the `MaxPrice`.   This tends *to be rare* since the Spot price moves very slowly.  Here are some scenarios that *might* trigger an eviction:

1. Reductions in Spot capacity as demand for regular priority VMs increases.
2. Platform-level events such as planned hardware maintenance.

### How is my workflow impacted by eviction?

**Q.** What happens to my jobs when a Spot instance is evicted?

**A.** Unless the jobs are coded to handle the 30 second eviction notification and handle it appropriately, the node is simply terminated and the job is failed (and hopefully re-tried).

**Q.** Are the nodes deleted from the cluster?

**A.** Yes, the nodes will be cleaned up in the CycleCloud UI.  In supported schedulers, the nodes will also be cleaned up in the scheduler.

**Q.** Do jobs have to be re-run?

**A.** In general, it is the job of the scheduler to re-try / re-run the jobs that are evicted.  However, many classes of job are not tolerant of re-tries (for example if they write partial data to persistent storage as they run).  These jobs may not be good candidate for execution on Spot instances.

**Q.** Can I use a mix of Spot and On-Demand/Regular-Priority VMs?

**A.** Yes.  You can use separate Spot (`Interruptible`) and non-Spot nodearrays to create a mix of Spot and Regular-Priority.  Using a mix of instance types generally requires making some configuration decisions depending on the requirements and the scheduler the user has chosen.   Here are a couple of common configurations:

* Separate Spot and Regular-Priority VMs into separate Queues in the scheduler.
  * This configuration allows the submitter to easily target jobs at the appropriate VM type
* Create a single large resource pool with both Spot and Regular-Priority instances.
  * This configuration can be useful for highly scalable workloads that use a small percentage of regular priority instances to ensure forward progress and a large percentage of Spot to reduce cost and runtime. 

**Q.** Can I change the [Spot Eviction Policy](/azure/virtual-machines/windows/spot-vms#eviction-policy) for CycleCloud nodearrays?

**A.** No.  Setting the `EvictionPolicy` attribute will still result in deleted VMs.

### Scheduler support for Spot eviction in CycleCloud

See the scheduler-specific guide for detailed information on the CycleCloud implementation for your scheduler.

**Q.** How does the autoscaler for my Scheduler handle Spot eviction?

**A.** All of the autoscalers for the built-in/supported schedulers (HTCondor, GridEngine, PBS Professional, Slurm, LSF) attempt to handle Spot evictions gracefully.   In general, the evicted instance will be removed from the  Scheduler and if the capacity demand is higher than the new available capacity after eviction, then the autoscaler will replace the instance.

Custom autoscalers *should* be built to expect Spot evictions or general machine failures and handle them gracefully. 

**Q.** What should I expect to happen to the jobs that were running on the evicted instance?

**A.** This is largely up to the user to configure when submitting the job.  Some schedulers, such as GridEngine, allow the default action to  be configured per queue as well.  By default, all built-in CycleCloud scheduler deployments, with the exception of HTCondor, are configured to mark the jobs as failed when the node they are running on is evicted or unexpectedly terminated.   This behavior is by design since only the user can know if their jobs may be safely retried.
