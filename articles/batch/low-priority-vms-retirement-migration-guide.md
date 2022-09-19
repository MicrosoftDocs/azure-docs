---
title: Low priority vms retirement migration guide
description: Describes the migration steps for the low priority vms retirement and the end of support details.
author: harperche
ms.author: harpercheng
ms.service: batch
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 08/10/2022
---
# Low Priority VMs Retirement Migration Guide

Azure Batch offers Low priority and Spot virtual machines (VMs). The virtual machines are computing instances allocated from spare capacity, offered at a highly discounted rate compared to "on-demand" VMs.

Low priority VMs enable the customer to take advantage of unutilized capacity. The amount of available unutilized capacity can vary based on size, region, time of day, and more. At any point in time when Azure needs the capacity back, we'll evict low-priority VMs. Therefore, the low-priority offering is excellent for flexible workloads, like large processing jobs, dev/test environments, demos, and proofs of concept. In addition, low-priority VMs can easily be deployed through our virtual machine scale set offering.

Low priority VMs are a deprecated feature, and it will never become Generally Available (GA). Spot VMs are the official preemptible offering from the Compute platform, and is generally available. Therefore, we'll retire Low Priority VMs on **30 September 2025**. After that, we'll stop supporting Low priority VMs. The existing Low priority pools may no longer work or be provisioned.

## Retirement alternative

As of May 2020, Azure offers Spot VMs in addition to Low Priority VMs. Like Low Priority, the Spot option allows the customer to purchase spare capacity at a deeply discounted price in exchange for the possibility that the VM may be evicted. Unlike Low Priority, you can use the Azure Spot option for single VMs and scale sets. Virtual machine scale sets scale up to meet demand, and when used with Spot VMs, will only allocate when capacity is available. 

The Spot VMs can be evicted when Azure needs the capacity or when the price goes above your maximum price. In addition, the customer can choose to get a 30-second eviction notice and attempt to redeploy. 

The other key difference is that Azure Spot pricing is variable and based on the capacity for size or SKU in an Azure region. Prices change slowly to provide stabilization. The price will never go above pay-as-you-go rates.

When it comes to eviction, you have two policy options to choose between:

* Stop/Deallocate (default) – when evicted, the VM is deallocated, but you keep (and pay for) underlying disks. This is ideal for cases where the state is stored on disks.
* Delete – when evicted, the VM and underlying disks are deleted.

While similar in idea, there are a few key differences between these two purchasing options:

| | **Low Priority VMs** | **Spot VMs** |
|---|---|---|
| **Availability** | **Azure Batch** | **Single VMs, Virtual machine scale sets** |
| **Pricing** | **Fixed pricing** | **Variable pricing with ability to set maximum price** |
| **Eviction/Preemption** | **Preempted when Azure needs the capacity. Tasks on preempted node VMs are re-queued and run again.** | **Evicted when Azure needs the capacity or if the price exceeds your maximum. If evicted for price and afterward the price goes below your maximum, the VM will not be automatically restarted.** |

## Migration steps

Customers in User Subscription mode have the option to include Spot VMs using the following the steps below:

1. In the Azure portal, select the Batch account and view the existing pool or create a new pool.
2. Under **Scale**, users can choose 'Target dedicated nodes' or 'Target Spot/low-priority nodes.'

  ![Scale Target Nodes](../batch/media/certificates/lowpriorityvms-scale-target-nodes.png)

3. Navigate to the existing Pool and select 'Scale' to update the number of Spot nodes required based on the job scheduled. 
4. Click **Save**.

Customers in Batch Managed mode must recreate the Batch account, pool, and jobs under User Subscription mode to take advantage of spot VMs.

## FAQ

* How to create a new Batch account /job/pool?

    Refer to the quick start [link](./batch-account-create-portal.md) on creating a new Batch account/pool/task.

* Are Spot VMs available in Batch Managed mode?

    No, Spot VMs are available in User Subscription mode - Batch accounts only.

* What is the pricing and eviction policy of Spot VMs? Can I view pricing history and eviction rates?

    Refer to [Spot VMs](../virtual-machines/spot-vms.md) for more information on using Spot VMs. Yes, you can see historical pricing and eviction rates per size in a region in the portal.

## Next steps

Use the [CLI](../virtual-machines/linux/spot-cli.md), [portal](../virtual-machines/spot-portal.md), [ARM template](../virtual-machines/linux/spot-template.md), or [PowerShell](../virtual-machines/windows/spot-powershell.md) to deploy Azure Spot Virtual Machines.

You can also deploy a [scale set with Azure Spot Virtual Machine instances](../virtual-machine-scale-sets/use-spot.md).
