---
title: Azure Compute Fleet overview
description: Learn about Azure Compute Fleet and how to accelerate your access to Azure's capacity.
author: rajeeshr
ms.author: rajeeshr
ms.topic: overview
ms.service: virtual-machines
ms.custom:
  - build-2024
ms.date: 05/21/2024
ms.reviewer: jushiman
---

# What is Azure Compute Fleet? (Preview)

> [!IMPORTANT]
> Azure Compute Fleet is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

Azure Compute Fleet is a building block that gives you accelerated access to Azure's capacity in a given region. Compute Fleet launches a combination of virtual machines (VMs) at the lowest price and highest capacity. There are many ways you can use this product, whether by running a stateless web service, a big data cluster, or a Continuous Integration pipeline. Workloads such as financial risk analysis, log processing, or image rendering can benefit from the ability to run hundreds of concurrent core instances.

Using Compute Fleet, you can:
- Deploy up to 10,000 VMs with a single API, using [Spot VM](../virtual-machines/spot-vms.md) and [Standard VM](../virtual-machines/overview.md) types together.
- Get superior price-performance ratios by utilizing a blend of diverse pricing models, like Reserved Instances, Savings Plan, Spot instances, and pay-as-you-go (PYG) options.
- Expedite access to Azure capacity by rapidly provisioning instances from a customized SKU list tailored to your preferences.
- Implement personalized Compute Fleet allocation strategies, catering to both Standard and Spot VMs, optimizing for cost, capacity, or a combination of both.
- Embrace the "Fire & Forget-it" model, automating the deployment, management, and monitoring of instances without requiring intricate code frameworks.
    - Streamline the initial setup process, saving valuable time and resources.
    - Alleviate concerns about scripting complexity associated with determining optimal virtual machine (VM) pricing, available capacity, managing Spot evictions, and SKU availability.
- Attempt to maintain your Spot target capacity if your Spot VMs are evicted for price or capacity.

There's no extra charge for using Compute Fleet. You're only charged for the VMs your Compute Fleet launches per hour. For more information on virtual machine billing, see [states and billing status of Azure Virtual Machines](../virtual-machines/states-billing.md).


## Capacity preference 

Preferences are only available when creating your Compute Fleet using Spot VMs. 

### Maintain capacity

Enabling this preference allows for automatic VM replacement in your Compute Fleet. Your running Spot VMs are replaced with any of the VM types or sizes you specified if a Spot eviction for price increase or VM failure occurs. Compute Fleet continues to goal seek replacing your evicted Spot VMs until your target capacity is met. 

You may choose this preference when:
- All qualified availability zones in the region are selected.
- A minimum of three different VM sizes are specified.

Not enabling this preference stops your Compute Fleet from goal seeking to replace evicted Spot VMs even if the target capacity isn't met.


## Compute Fleet strategies 

### Standard Compute Fleet allocation strategies 

**Lowest price (default):** The Compute Fleet launches the lowest price pay-as-you-go VM from the list of VM types and sizes you specified. It attempts to fulfill the pay-as-you-go capacity, followed by the second and third lowest in price VMs until the desired capacity is fulfilled. 

### Spot Fleet allocation strategies 

**Price capacity optimized (recommended):** The Compute Fleet launches qualifying VMs from your selected list of VM types and sizes to fullfil the target capacity. It prioritizes the highest available Spot capacity at the lowest price on Spot VMs in the region. 

If you select multiple VMs that happen to offer the ideal capacity to meet your target, then Compute Fleet prioritizes deploying VMs that offer the lowest price first. Followed by the second and third lowest price if sufficient capacity isn't available with the first lowest price VMs. Compute Fleet considers both price and capacity while configuring this strategy.

**Capacity optimized:** The Compute Fleet launches VM types and sizes from your specified list of VMs that offer the highest available Spot capacity. This strategy prioritizes choosing VMs that fulfill your Spot target capacity over VMs with the lowest prices that don't have enough Spot capacity.

If you select multiple VMs that happen to offer the ideal capacity to meet your target, then Compute Fleet prioritizes deploying VMs that offer the highest capacity first. Followed by the second and third highest capacity if sufficient capacity isn't achieved. 

With this strategy, Compute Fleet doesn't prioritize pricing over capacity, so your costs may be higher.

**Lowest Price:** The Compute Fleet launches VM types and sizes from your specified list of VMs that offer the lowest price for Spot VMs. Followed by the second and third lowest price until the desired capacity is fulfilled.


## Target capacity 

Compute Fleet allows you to set individual target capacity for Spot and pay-as-you-go VM types. This capacity could be managed individually based on your workloads or application requirement.  

You can specify target capacity using VM instances. 

Compute Fleet allows you to modify the target capacity for Spot and pay-as-you-go VMs based on your Compute Fleet configuration. For more information, see [Modify your Compute Fleet](#modify-your-compute-fleet) for details related to modifying target capacity. 


## Minimum starting capacity 

You can set your Compute Fleet to deploy Spot VMs, pay-as-you-go VMs, or a combination of both only if the Compute Fleet can deploy the minimum starting capacity requested against the actual target capacity. The deployment fails if capacity becomes unavailable to fulfill the minimum starting capacity. 

If your requested target capacity is 100 VM instances and minimum starting capacity is set to 20 VM instances, the deployment succeeds only if Compute Fleet can fulfill the starting capacity ask of 20 VM instances. Otherwise, the request fails. 

You may not be able to set the minimum starting capacity if you choose to configure the Compute Fleet with capacity preference type as *Maintain capacity*. 


## Modify your Compute Fleet 

While your Compute Fleet is in a running state, it allows you to modify the target capacity and VM size selection based on how you configured your Compute Fleet. 

### Modify target capacity 

You can update your Spot target capacity of the Compute Fleet while running, if the capacity preference is set to *Maintain capacity*.  

Compute Fleet automatically deploys new Spot VMs from the list of specified SKUs to scale up and attain the new target capacity.

If scaling down occurs to reduce the current target capacity, Compute Fleet doesn't restore Spot VMs that are evicted until the new modified reduced target capacity is met. This process may take time depending on the eviction rate. To scale down faster, it's recommended to delete the running Spot VMs. 

### Modify or replace VM sizes/SKUs

While the Compute Fleet is running, you can add or delete new VM sizes or SKUs to your Compute Fleet. For Spot, you may delete or replace existing VM sizes in your Compute Fleet configuration if the capacity preference is set to *Maintain capacity*. 

In all other scenarios requiring a modification to the running Compute Fleet, you may have to delete the existing Compute Fleet and create a new one.  

#### Max hourly price for Spot  

You can configure your Compute Fleet with Spot VMs to set the max hourly price you agree to pay per hour. Compute Fleet doesn't deploy new Spot VMs in your specified list if the price of the Spot VM increases over the specified Max Hourly price.

#### Spot eviction policy 

**Delete (default):** Compute Fleet deletes your running Spot VM and all other resources attached to the VM. Data stored on persistent disk storage is also deleted.

**Deallocate:** Compute Fleet deletes your running Spot VM, all other resources attached to the VM and data stored on persistent disk storage isn't deleted.

The Deallocated Spot VM adds up to your Spot target capacity and billing continues for resources attached to the deallocated VMs. 

#### Fleet quota 

Azure Compute Fleet has applicable Standard and Spot VMs quotas. 

| Scenario | Quota |
| ------ | ------ |
| The number of **Compute Fleets** per Region in `active`, `deleted_running` | 500 |
| The **target capacity** per Compute Fleet | 10,000 VMs |
| The **target capacity** across all Compute Fleets in a Region | 100,000 VMs |

#### Compute Fleet considerations 

- Compute Fleet launches a combination of VM types that have their own considerations. For more information, see [Spot VMs](../virtual-machines/spot-vms.md) and [Virtual Machines](../virtual-machines/overview.md) for details. 
- Compute Fleet is only available through [ARM template](quickstart-create-rest-api.md) and in [Azure portal](quickstart-create-portal.md).
- Compute Fleet can't span across Azure regions. You have to create a separate Compute Fleet for each region.
- Compute Fleet is available in the following regions: East US, East US2, West US, and West US2.


## Next steps
> [!div class="nextstepaction"]
> [Create an Azure Compute Fleet with Azure portal.](quickstart-create-portal.md)
