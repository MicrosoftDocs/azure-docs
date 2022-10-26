---
title: Migrate low-priority VMs to spot VMs in Batch
description: Learn how to migrate Azure Batch low-priority VMs to Azure Spot Virtual Machines and plan for feature end of support.
author: harperche
ms.author: harpercheng
ms.service: batch
ms.topic: how-to
ms.date: 08/10/2022
---

# Migrate Batch low-priority VMs to Azure Spot Virtual Machines

The Azure Batch feature low-priority virtual machines (VMs) is being retired on *September 30, 2025*. Learn how to migrate your Batch low-priority VMs to Azure Spot Virtual Machines.

## About the feature

Currently, in Azure Batch, you can use a low-priority VM or a spot VM. Both types of VMs are Azure computing instances that are allocated from spare capacity and offered at a highly discounted rate compared to dedicated, on-demand VMs.

You can use low-priority VMs to take advantage of unused capacity in Azure. The amount of unused capacity that's available varies depending on factors like VM size, the region, and the time of day. At any time, when Microsoft needs the capacity back, we evict low-priority VMs. Therefore, the low-priority feature is excellent for flexible workloads like large processing jobs, dev and test environments, demos, and proofs of concept. It's easy to deploy low-priority VMs by using a virtual machine scale set.

## Feature end of support

Low-priority VMs are a deprecated preview feature and won't be generally available. Spot VMs offered through the Azure Spot Virtual Machines service are the official, preemptible offering from the Azure compute platform. Spot Virtual Machines is generally available. On September 30, 2025, we'll retire the low-priority VMs feature. After that date, existing low-priority pools in Batch might no longer work and you can't provision new low-priority VMs.

## Alternative: Use Azure Spot Virtual Machines

As of May 2020, Azure offers spot VMs in Batch in addition to low-priority VMs. Like low-priority VMs, you can use the spot VM option to purchase spare capacity at a deeply discounted price in exchange for the possibility that the VM will be evicted. Unlike low-priority VMs, you can use the spot VM option for single VMs and scale sets. Virtual machine scale sets scale up to meet demand. When used with a spot VM, a virtual machine scale set allocates only when capacity is available.

A spot VM in Batch can be evicted when Azure needs the capacity or when the cost goes above your set maximum price. You also can choose to receive a 30-second eviction notice and attempt to redeploy.

Spot VM pricing is variable and based on the capacity of a VM size or SKU in an Azure region. Prices change slowly to provide stabilization. The price will never go above pay-as-you-go rates.

For VM eviction policy, you can choose from two options:

- **Stop/Deallocate** (default): When a VM is evicted, the VM is deallocated, but you keep (and pay for) underlying disks. This option is ideal when you store state on disks.

- **Delete**: When a VM is evicted, the VM and underlying disks are deleted.

Although the two purchasing options are similar, be aware of a few key differences:

| Factor | Low-priority VMs | Spot VMs |
|---|---|---|
| Availability | Azure Batch | Single VMs, virtual machine scale sets |
| Pricing | Fixed pricing | Variable pricing with ability to set maximum price |
| Eviction or preemption | Preempted when Azure needs the capacity. Tasks on preempted node VMs are requeued and run again. | Evicted when Azure needs the capacity or if the price exceeds your maximum. If evicted for price and afterward the price goes below your maximum, the VM isn't automatically restarted. |

## Migrate a low-priority VM pool or create a spot VM pool

To include spot VMs when you scale in user subscription mode:

1. In the Azure portal, select the Batch account and view an existing pool or create a new pool.

1. Under **Scale**, select either **Target dedicated nodes** or **Target Spot/low-priority nodes**.

   :::image type="content" source="media/certificates/low-priority-vms-scale-target-nodes.png" alt-text="Screenshot that shows how to scale target nodes.":::

1. For an existing pool, select the pool, and then select **Scale** to update the number of spot nodes required based on the job scheduled.

1. Select **Save**.

You can't use spot VMs in Batch managed mode. Instead, switch to user subscription mode and re-create the Batch account, pool, and jobs.

## FAQs

- How do I create a new Batch account, job, or pool?

   See the [quickstart](./batch-account-create-portal.md) to create a new Batch account, job, or pool.

- Are spot VMs available in Batch managed mode?

  No. In Batch accounts, spot VMs are available only in user subscription mode.

- What is the pricing and eviction policy of spot VMs? Can I view pricing history and eviction rates?

   Yes. In the Azure portal, you can see historical pricing and eviction rates per size in a region.

   For more information about using spot VMs, see [Spot Virtual Machines](../virtual-machines/spot-vms.md).

## Next steps

Use the [CLI](../virtual-machines/linux/spot-cli.md), [Azure portal](../virtual-machines/spot-portal.md), [ARM template](../virtual-machines/linux/spot-template.md), or [PowerShell](../virtual-machines/windows/spot-powershell.md) to deploy Azure Spot Virtual Machines.

You can also deploy a [scale set that has Azure Spot Virtual Machines instances](../virtual-machine-scale-sets/use-spot.md).
