---
title: Error codes for low-priority VMs and scale sets in Azure | Microsoft Docs
description: Learn about error codes that you could possibly see when using low-priority VMs and scale sets.
services: virtual-machines-windows
author: cynthn
manager: gwallace

ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.topic: article
ms.date: 09/23/2019
ms.author: cynthn
---

# Preview: Error messages for low priority VMs and scale sets

Here are some possible error codes you could receive when using low priority VMs and scale sets.

| Key | Message | Description |
|-----|---------|
| EvictionPolicyCanBeSetOnlyOnLowPriorityVirtualMachines | Eviction policy can be set only on low-priority Virtual Machines. | This VM is not a low-priority VM, so you can't set the eviction policy. |
| LowPriVMNotSupportedInAvailabilitySet | Low-priority Virtual Machine is not supported in Availability Set. | You need to choose to either use a low-priority VM or use a VM in an availability set, you can't choose both. |
| VariablePricingFeatureNotEnabledForSubscription | Subscription not enabled with variable pricing feature. | You need to have a subscription that supports low-priority VMs and you need to have enabled the feature for the public preview. |
| VMPriorityCannotBeApplied | The specified priority value '{0}' cannot be applied to the Virtual Machine '{1}' since no priority was specified when the Virtual Machine was created. | You need to specify the priority when the VM is created.  |
| VariablePriceGreaterThanProvidedMaxPrice | Cannot create this Virtual Machine since the provided max price is lower than the current variable price {0} for low-priority VM size {1}. | Select a higher max price. For more information, see [Pricing]().|
| MaxPriceValueInvalid | Invalid max price value. The only supported values for max price are -1 or a decimal greater than zero. Max price value of -1 indicates the low-priority virtual machine will not be evicted for price reasons. | Enter a valid max price. For more information, see [Low-priority Virtual Machines](). |
| MaxPriceUpdateRequiresVMToBeDeallocated | Max price can be updated only when VM is in deallocated state. | Deallocate the VM so that you can change the max price. |
| VariablePricingIsNotSupportedForThisAPIVersion | Variable pricing is not supported for this API version. | The API version needs to be 2019-03-01. |
| VariablePricingIsNotSupportedForThisVMSize | Variable pricing is not supported for this VM size {0}. | Select another VM size. For more information, see [Low-priority Virtual Machines](low-priority-vms.md). |
| VariablePricingIsSupportedOnlyForLowPriorityVirtualMachines | Variable pricing is supported only for low-priority Virtual Machines. | For more information, see [Low-priority Virtual Machines](low-priority-vms.md). |
| MoveResourcesWithLowPriorityVMNotSupported | The move resources request contains a low priority virtual machine. This is currently not supported. Please check the error details for virtual machine Ids.  | You cannot move low-priority VMs. |
| MoveResourcesWithLowPriorityVmssNotSupported | The Move resources request contains a low priority virtual machine scale set. This is currently not supported. Please check the error details for virtual machine scale set Ids.| You cannot move low-priority instances. |


## Next steps

For more information, see [Low-priority Virtual Machines](low-priority-vms.md).