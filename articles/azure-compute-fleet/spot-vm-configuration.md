---
title: Spot VM configuration
description: Learn about Spot VM configuration on your Compute Fleet.
author: rajeeshr
ms.author: rajeeshr
ms.topic: overview
ms.service: azure-compute-fleet
ms.custom:
  - ignite-2024
ms.date: 11/10/2024
ms.reviewer: jushiman
---

## Spot VM specific fleet configuration 

## Capacity preference 

Preferences are only available when creating your Compute Fleet using Spot VMs. 

### Maintain capacity

Enabling this preference allows for automatic VM replacement in your Compute Fleet. Your running Spot VMs are replaced with any of the VM types or sizes you specified if a Spot eviction for price increase or VM failure occurs. Compute Fleet continues to goal seek replacing your evicted Spot VMs until your target capacity is met. 

You may choose this preference when:
- All qualified availability zones in the region are selected.
- A minimum of three different VM sizes are specified.

Not enabling this preference stops your Compute Fleet from goal seeking to replace evicted Spot VMs even if the target capacity isn't met.

## Max hourly price for Spot  

You can configure your Compute Fleet with Spot VMs to set the max hourly price you agree to pay per hour. Compute Fleet doesn't deploy new Spot VMs in your specified list if the price of the Spot VM increases over the specified Max Hourly price.

## Spot eviction policy 

**Delete (default):** Compute Fleet deletes your running Spot VM and all other resources attached to the VM. Data stored on persistent disk storage is also deleted.

**Deallocate:** Compute Fleet deletes your running Spot VM, all other resources attached to the VM and data stored on persistent disk storage isn't deleted.

The Deallocated Spot VM adds up to your Spot target capacity and billing continues for resources attached to the deallocated VMs. 

#### Next topic: Fleet allocation stratergies
#### Previous Topic: Configuring Compute Fleet
