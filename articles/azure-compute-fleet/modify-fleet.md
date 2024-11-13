---
title: Modify a Compute Fleet
description: Learn about how to modify your Azure Compute Fleet.
author: rajeeshr
ms.author: rajeeshr
ms.topic: concept-article
ms.service: azure-compute-fleet
ms.custom:
  - ignite-2024
ms.date: 11/13/2024
ms.reviewer: jushiman
---

# Modify a Compute Fleet 

While your Compute Fleet is in a running state, it allows you to modify the target capacity and virtual machine (VM) size selection based on how you configured your Compute Fleet. 

### Modify target capacity 

You can update your Spot VM target capacity of the Compute Fleet while it's running, if the capacity preference is set to *Maintain capacity*.  

Compute Fleet automatically deploys new Spot VMs from the list of specified SKUs to scale up and attain the new target capacity.

If scaling down occurs to reduce the current target capacity, Compute Fleet doesn't restore Spot VMs that are evicted until the new modified reduced target capacity is met. This process takes time depending on the eviction rate. To scale down faster, we recommend that you delete the running Spot VMs. 

### Modify VM size selection

You can add or delete new VM sizes or SKUs to your Compute Fleet while it's running. For Spot VMs, you may delete or replace existing VM sizes in your Compute Fleet configuration, if the capacity preference is set to *Maintain capacity*. 

In all other scenarios requiring a modification to the running Compute Fleet, you may have to delete the existing Compute Fleet and create a new one.  
