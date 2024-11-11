---
title: Azure Compute Fleet overview
description: Learn about configuring capacity preference on your Compute Fleet.
author: rajeeshr
ms.author: rajeeshr
ms.topic: overview
ms.service: azure-compute-fleet
ms.custom:
  - ignite-2024
ms.date: 11/10/2024
ms.reviewer: jushiman
---

# Capacity preference 

Preferences are only available when creating your Compute Fleet using Spot VMs. 

## Maintain capacity

Enabling this preference allows for automatic VM replacement in your Compute Fleet. Your running Spot VMs are replaced with any of the VM types or sizes you specified if a Spot eviction for price increase or VM failure occurs. Compute Fleet continues to goal seek replacing your evicted Spot VMs until your target capacity is met. 

You may choose this preference when:
- All qualified availability zones in the region are selected.
- A minimum of three different VM sizes are specified.

Not enabling this preference stops your Compute Fleet from goal seeking to replace evicted Spot VMs even if the target capacity isn't met.

#### Next topic: Fleet Allocation Stratergies
#### Previous Topic: Spot Virtual Machines
