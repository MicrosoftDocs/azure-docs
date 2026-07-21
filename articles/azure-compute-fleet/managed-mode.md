---
title: Managed mode for Azure Compute Fleet
description: Learn how Managed mode for Azure Compute Fleet maintains VM capacity over time, including modifying a running fleet's target capacity and VM sizes.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: concept-article
ms.service: azure-compute-fleet
ms.date: 07/19/2026
ms.reviewer: cynthn
# Customer intent: As a cloud operations manager, I want the fleet to maintain my Spot capacity and let me modify a running fleet, so that I can keep my desired capacity over time and manage costs effectively.
---

# Managed mode for Azure Compute Fleet

Azure Compute Fleet supports two modes that determine how the fleet manages the virtual machines (VMs) it provisions:

- **Managed mode** (`mode: Managed`, the default) keeps the fleet in place to manage VM capacity over time. When you configure the fleet to maintain Spot capacity, the fleet replaces evicted Spot VMs to keep your target capacity. You can also modify a running fleet's target capacity and VM sizes.
- **Launch mode** (`mode: Launch`) provisions VMs in a single request and then hands off control. For more information, see [What is Launch mode for Azure Compute Fleet? (Preview)](launch-mode.md).

If you don't specify a mode, the fleet uses Managed mode.

## Maintain capacity preference

In Managed mode, you can configure a **capacity preference** of *Maintain capacity* for your Spot VMs (`spotPriorityProfile.maintain: true`). With this preference, Compute Fleet attempts to maintain your Spot target capacity by deploying replacement Spot VMs from your specified VM sizes when Spot VMs are evicted for price or capacity reasons.

> [!NOTE]
> *Maintain capacity* is a Spot **capacity preference** within Managed mode. It is distinct from the fleet **mode**. The *Maintain capacity* preference isn't available in [Launch mode](launch-mode.md).

For more information about configuring Spot VMs, see [Spot VM configuration](spot-vm-configuration.md).

## Modify a running fleet

While your Compute Fleet is in a running state, Managed mode allows you to modify the target capacity and VM size selection based on how you configured your fleet.

### Modify target capacity

You can update your Spot VM target capacity while the fleet is running if you set the capacity preference to *Maintain capacity*.

Compute Fleet automatically deploys new Spot VMs from the list of specified SKUs to scale up and reach the new target capacity.

When you reduce target capacity, Compute Fleet doesn't replace evicted Spot VMs until the fleet reaches the new target. The time required depends on the eviction rate. To scale down faster, delete running Spot VMs.

#### Azure portal

The following steps show how to modify an existing Compute Fleet. To learn how to launch a new fleet, see [Create an Azure Compute Fleet using Azure portal](quickstart-create-portal.md). During the creation process, set the **Capacity preference** to *Maintain capacity* in the **Basics** tab to allow for updates after creation.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the **Overview** page of your Compute Fleet.
1. Under the resource visualizer, select **Capacity** to modify the **target capacity** for Azure Spot VMs, VM capacity, or both.
1. Select **Apply** to confirm.
1. Your Compute Fleet is now updated with a new target capacity.

### Modify VM size selection

You can add or delete VM sizes or SKUs in your Compute Fleet while it's running. For Spot VMs, you can delete or replace existing VM sizes in your Compute Fleet configuration if you set the capacity preference to *Maintain capacity*.

For other changes to a running Compute Fleet, you might need to delete the existing fleet and create a new one.

#### Azure portal

The following steps show how to modify an existing Compute Fleet. To learn how to launch a new fleet, see [Create an Azure Compute Fleet using Azure portal](quickstart-create-portal.md). During the creation process, set the **Capacity preference** to *Maintain capacity* in the **Basics** tab to allow for updates after creation.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the **Overview** page of your Compute Fleet.
1. Select **Sizes** under the resource visualizer to add more VM sizes to your running Compute Fleet.
1. Select **Resize** to confirm.
1. Your Compute Fleet is now updated with the new VM sizes.

## Next steps

- [Spot VM configuration](spot-vm-configuration.md)
- [Allocation strategies](allocation-strategies.md)
- [Create a Compute Fleet with an ARM template](quickstart-create-rest-api.md)
