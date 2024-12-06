---
title: Modify a Compute Fleet
description: Learn about how to modify your Azure Compute Fleet.
author: rrajeesh
ms.author: rajeeshr
ms.topic: how-to
ms.service: azure-compute-fleet
ms.custom:
  - ignite-2024
ms.date: 11/13/2024
ms.reviewer: jushiman
---

# Modify a Compute Fleet 

> [!IMPORTANT]
> [Azure Compute Fleet](overview.md) is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

While your Compute Fleet is in a running state, it allows you to modify the target capacity and virtual machine (VM) size selection based on how you configured your Compute Fleet. This article explains how you can modify the target capacity and the VM size selection of your Compute Fleet. 

## Modify target capacity 

You can update your Spot VM target capacity of the Compute Fleet while it's running, if the capacity preference is set to *Maintain capacity*.  

Compute Fleet automatically deploys new Spot VMs from the list of specified SKUs to scale up and attain the new target capacity.

If scaling down occurs to reduce the current target capacity, Compute Fleet doesn't restore Spot VMs that are evicted until the new modified reduced target capacity is met. This process takes time depending on the eviction rate. To scale down faster, we recommend that you delete the running Spot VMs. 

### Azure portal

The following steps are for modifying an existing Compute Fleet. To learn how to launch a new fleet, see [Create an Azure Compute Fleet using Azure portal](quickstart-create-portal.md). During the creation process, you must set the **Capacity preference** to *Maintain capacity* in the **Basics** tab to allow for updates after creation. 
   
1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to the **Overview** page of your Compute Fleet.
1. Select **Capacity** under the resource visualizer to modify the **target capacity** for Azure Spot VMs, VM capacity, or both.
1. Select **Apply** to confirm.
1. Your Compute Fleet is now updated with a new target capacity. 

## Modify VM size selection

You can add or delete new VM sizes or SKUs to your Compute Fleet while it's running. For Spot VMs, you may delete or replace existing VM sizes in your Compute Fleet configuration, if the capacity preference is set to *Maintain capacity*. 

In all other scenarios requiring a modification to the running Compute Fleet, you may have to delete the existing Compute Fleet and create a new one.  

### Azure portal

The following steps are for modifying an existing Compute Fleet. To learn how to launch a new fleet, see [Create an Azure Compute Fleet using Azure portal](quickstart-create-portal.md). During the creation process, you must set the **Capacity preference** to *Maintain capacity* in the **Basics** tab to allow for updates after creation. 
   
1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to the **Overview** page of your Compute Fleet.
1. Select **Sizes** under the resource visualizer to add more VM sizes to your running Compute Fleet.
1. Select **Resize** to confirm.
1. Your Compute Fleet is now updated with the new VM sizes.

## Next steps

> [!div class="nextstepaction"]
> [Find answers to frequently asked questions.](faq.yml)
