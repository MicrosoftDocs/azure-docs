---
title: Migrate low-priority VMs to spot VMs
description: Learn how to migrate Azure Batch low-priority VMs to spot VMs and plan for feature end of support.
author: harperche
ms.author: harpercheng
ms.service: batch
ms.topic: how-to
ms.date: 08/10/2022
---

# Migrate low-priority VMs to spot VMs in Batch (feature retirement)

Low-priority VMs in Azure Batch will be retired on *September 30, 2025*. After that date, we'll stop supporting low-priority VMs in Batch. Learn how to migrate your Batch low-priority VMs to spot VMs in Azure Batch.

## VM options in Azure Batch

Currently, Azure Batch offers low-priority VMs and spot VMs. The VMs are computing instances that are allocated from spare capacity, offered at a highly discounted rate compared to "on-demand" VMs.

Low-priority VMs enable the customer to take advantage of unutilized capacity. The amount of available unutilized capacity can vary based on size, region, time of day, and more. At any point in time when Azure needs the capacity back, we'll evict low-priority VMs. Therefore, the low-priority offering is excellent for flexible workloads, like large processing jobs, dev/test environments, demos, and proofs of concept. In addition, low-priority VMs can easily be deployed through our virtual machine scale set offering.

## End of support for low-priority VMs

Low-priority VMs are a deprecated feature, and it will never be General Availability (GA). Spot VMs are the official preemptible offering from the Azure Compute platform, and are generally available. Therefore, we'll retire low-priority VMs on *September 30, 2025*. After that date, we'll stop supporting low- priority VMs. Existing low-priority pools in Batch might no longer work and you can't provision new low-priority VM.

## Migrate low-priority VMs to spot VMs

As of May 2020, Azure offers Spot VMs in addition to Low Priority VMs. Like Low Priority, the Spot option allows the customer to purchase spare capacity at a deeply discounted price in exchange for the possibility that the VM may be evicted. Unlike Low Priority, you can use the Azure Spot option for single VMs and scale sets. Virtual machine scale sets scale up to meet demand, and when used with Spot VMs, will only allocate when capacity is available. 

The Spot VMs can be evicted when Azure needs the capacity or when the price goes above your maximum price. In addition, the customer can choose to get a 30-second eviction notice and attempt to redeploy. 

The other key difference is that Azure Spot pricing is variable and based on the capacity for size or SKU in an Azure region. Prices change slowly to provide stabilization. The price will never go above pay-as-you-go rates.

When it comes to eviction, you have two policy options to choose between:

- **Stop/Deallocate** (default): When evicted, the VM is deallocated, but you keep (and pay for) underlying disks. This is the ideal for cases where the state is stored on disks.

- **Delete**: When evicted, the VM and underlying disks are deleted.

Although similar in idea, there are a few key differences between these two purchasing options:

| Aspect | Low-priority VMs | Spot VMs |
|---|---|---|
| Availability | Azure Batch | Single VMs, virtual machine scale sets |
| Pricing | Fixed pricing | Variable pricing with ability to set maximum price |
| Eviction or preemption | Preempted when Azure needs the capacity. Tasks on preempted node VMs are requeued and run again. | Evicted when Azure needs the capacity or if the price exceeds your maximum. If evicted for price and afterward the price goes below your maximum, the VM isn't automatically restarted. |

## Update a low-priority VM pool or create a spot VM pool

Customers in User Subscription mode can include Spot VMs using the following the steps below:

1. In the Azure portal, select the Batch account and view the existing pool or create a new pool.

1. Under **Scale**, select either **Target dedicated nodes** or **Target Spot/low-priority nodes**.

   :::image type="content" source="media/certificates/low-priority-vms-scale-target-nodes.png" alt-text="Screenshot that shows how to scale target nodes.":::

1. Go to the existing pool and select **Scale** to update the number of spot nodes required based on the job scheduled.

1. Select **Save**.

Customers in Batch Managed mode must re-create the Batch account, pool, and jobs under User Subscription mode to take advantage of spot VMs.

## FAQs

- How do I create a new Batch account, job, or pool?

   See the [quickstart](./batch-account-create-portal.md) to create a new Batch account, job, or pool.

- Are spot VMs available in Batch managed mode?

  No. In Batch accounts, spot VMs are available only in user subscription mode.

- What is the pricing and eviction policy of spot VMs? Can I view pricing history and eviction rates?

   Yes. In the Azure portal, you can see historical pricing and eviction rates per size in a region.

   For more information about using spot VMs, see [Spot VMs](../virtual-machines/spot-vms.md).

## Next steps

Use the [CLI](../virtual-machines/linux/spot-cli.md), [portal](../virtual-machines/spot-portal.md), [ARM template](../virtual-machines/linux/spot-template.md), or [PowerShell](../virtual-machines/windows/spot-powershell.md) to deploy Azure Spot Virtual Machines.

You can also deploy a [scale set with Azure Spot Virtual Machine instances](../virtual-machine-scale-sets/use-spot.md).
