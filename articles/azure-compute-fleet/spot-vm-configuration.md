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

This article covers everything you need to know for Spot virtual machine (VM) configuration for your Compute Fleet. 

To learn more about Spot VMs and their configuration, see [spot overview](something.md). Some important considerations to note about Spot VMs when it comes to using Compute Fleet are:
- Capacity preferences is the same (see section below), but Maintain capacity (a subset of preference) is unique to Fleet.
- Max hourly price is outlined in spot, not unique to compute fleet.
- eviction is same stuff, but the default is different for fleet. 

## Capacity preference 

Capacity preferences are only available when creating your Compute Fleet using Spot virtual machines (VMs) and can't be adjusted after the fleet is running. 

### Maintain capacity

Enabling the capacity preference allows for automatic VM replacement in your Compute Fleet. Running Spot VMs are replaced with any of the VM types or sizes you specified if a Spot eviction for price increase or VM failure occurs. Compute Fleet continues to goal-seek to replace your evicted Spot VMs until your target capacity is met. 

Choose this preference when:
- All qualified availability zones in the region are selected.
- A minimum of three different VM sizes are specified.

Not enabling this preference stops your Compute Fleet from goal-seeking to replace evicted Spot VMs, even if the target capacity isn't met.

## Max hourly price

Same as Spot Overview == https://learn.microsoft.com/en-us/azure/virtual-machines/spot-vms#eviction-policy
all info is the same. 

Set the maximum hourly price you agree to pay per hour when you configure your Compute Fleet with Spot VMs. Compute Fleet doesn't deploy new Spot VMs in your specified list if the price of the Spot VM increases over the specified maximum hourly price.

## Spot eviction policy 

Same as Spot overview, but DELETE is the default, not Deallocate when it comes to Fleet. 

**Delete (default):** Compute Fleet deletes your running Spot VM and all other resources attached to the VM. Data stored on persistent disk storage is also deleted.

**Deallocate:** Compute Fleet deletes your running Spot VM, all other resources attached to the VM and data stored on persistent disk storage isn't deleted.

The Deallocated Spot VM adds up to your Spot target capacity and billing continues for resources attached to the deallocated VMs. 

## Next steps

> [!div class="nextstepaction"]
> [Find answers to frequently asked questions.](faq.yml)
