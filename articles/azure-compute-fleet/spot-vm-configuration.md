---
title: Spot VM configuration for Azure Compute Fleet
description: Learn about Spot virtual machine (VM) configuration on your Compute Fleet.
author: rrajeesh
ms.author: rajeeshr
ms.topic: concept-article
ms.service: azure-compute-fleet
ms.custom:
  - ignite-2024
ms.date: 11/13/2024
ms.reviewer: jushiman
---

# Spot VM configuration for Azure Compute Fleet

> [!IMPORTANT]
> [Azure Compute Fleet](overview.md) is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

Compute Fleet has a few important configuration options to consider when it comes to Spot virtual machines (VMs). 

To learn general information about Spot VMs and their configuration, see [Use Azure Spot Virtual Machines](/azure/virtual-machines/spot-vms). This article covers some important configuration considerations to note about Spot VMs when it comes to using Compute Fleet. 

## Maintain capacity 

The capacity preference configuration for Compute Fleet offers a **Maintain capacity** option, which is unique to Compute Fleet.

Capacity preferences are only available when creating your Compute Fleet using Spot VMs and can't be adjusted after the fleet is running. If you are [creating a Compute Fleet in the Azure portal](quickstart-create-portal.md), during the creation process, set the **Capacity preference** to *Maintain capacity* in the **Basics** tab to allow for updates after creation.

Enabling the capacity preference allows for automatic VM replacement in your Compute Fleet. Running Spot VMs are replaced with any of the VM types or sizes you specified if a Spot eviction for price increase or VM failure occurs. Compute Fleet continues to goal-seek to replace your evicted Spot VMs until your target capacity is met. 

Choose this preference when:
- All qualified availability zones in the region are selected.
- A minimum of three different VM sizes are specified.

Not enabling this preference stops your Compute Fleet from goal-seeking to replace evicted Spot VMs, even if the target capacity isn't met.

## Max hourly price

Set the maximum hourly price you agree to pay per hour when you configure your Compute Fleet with Spot VMs. Compute Fleet doesn't deploy new Spot VMs in your specified list if the price of the Spot VM increases over the specified maximum hourly price. For a table with more information about max hourly price, see [Spot VMs - eviction policy](/azure/virtual-machines/spot-vms#eviction-policy).

## Spot eviction policy 

For regular Spot VMs, the default [eviction policy](/azure/architecture/guide/spot/spot-eviction#eviction-policy) is set to *Deallocate*. However, when it comes to Compute Fleet, the **Spot eviction policy** default is *Delete*. 

- **Delete (default):** Compute Fleet deletes your running Spot VM and all other resources attached to the VM. Data stored on persistent disk storage is also deleted.
- **Deallocate:** Compute Fleet deletes your running Spot VM, all other resources attached to the VM and data stored on persistent disk storage isn't deleted. The deallocated Spot VM adds up to your Spot target capacity, and billing continues for resources attached to the deallocated VM. 

## Next steps

> [!div class="nextstepaction"]
> [Find answers to frequently asked questions.](faq.yml)
