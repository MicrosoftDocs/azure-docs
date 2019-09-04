---
title: Error codes for low-priority VMs and scale sets in Azure | Microsoft Docs
description: Learn about error codes that you could possibly see when using low-priority VMs and scale sets.
services: virtual-machines-windows
author: cynthn
manager: gwallace

ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.topic: article
ms.date: 09/03/2019
ms.author: cynthn
---

# Preview: Error messages for low priority VMs and scale sets

Here are some possible error codes you could receive when using low priority VMs and scale sets.

| Key | Message | Description |
|-----|---------|
| EvictionPolicyCanBeSetOnlyOnLowPriorityVirtualMachines | Eviction policy can be set only on spot Virtual Machines. | This VM is not set as a spot VM, so you can't set the eviction policy. For more information, see [Spot Virtual Machines]()|
| LowPriVMNotSupportedInAvailabilitySet | Low-priority Virtual Machine is not supported in Availability Set. | You need to choose to either use a spot VM or use a VM in an availability set, you can't choose both. |
| VariablePricingFeatureNotEnabledForSubscription | Subscription not enabled with variable pricing feature. | You need to have a subscription that supports spot VMs and you need to have enable the feature for the public preview. For more information, see [Spot Virtual Machines](). |
| VMPriorityCannotBeApplied | The specified priority value '{0}' cannot be applied to the Virtual Machine '{1}' since no priority was specified when the Virtual Machine was created. | Change the.... |
| VariablePriceGreaterThanProvidedMaxPrice | Cannot create this Virtual Machine since the provided max price is lower than the current variable price {0} for low-priority VM size {1}. | Select a higher max price. For more information, see [Pricing]().|
| MaxPriceValueInvalid | Invalid max price value. The only supported values for max price are -1 or a decimal greater than zero. Max price value of -1 indicates the low-priority virtual machine will not be evicted for price reasons. | Enter a valid max price. For more information, see [Spot Virtual Machines](). |
| MaxPriceUpdateRequiresVMToBeDeallocated | Max price can be updated only when VM is in deallocated state. | Deallocate the VM so that you can change the max price. For more information, see [Deallocate]().|
| VariablePricingIsNotSupportedForThisAPIVersion | Variable pricing is not supported for this API version. | The API version needs to be xx/xx/xxxx. |
| VariablePricingIsNotSupportedForThisVMSize | Variable pricing is not supported for this VM size {0}. | Select another VM size. For more information, see [Spot Virtual Machines](). |
| VariablePricingIsSupportedOnlyForLowPriorityVirtualMachines | Variable pricing is supported only for low-priority Virtual Machines. | For more information, see [Spot Virtual Machines](). |
| MoveResourcesWithLowPriorityVMNotSupported | The move resources request contains a low priority virtual machine. This is currently not supported. Please check the error details for virtual machine Ids.  | You cannot move spot VMs. For more information, see [Spot Virtual Machines](). |
| MoveResourcesWithLowPriorityVmssNotSupported | The Move resources request contains a low priority virtual machine scale set. This is currently not supported. Please check the error details for virtual machine scale set Ids.| You cannot move spot instances. For more information, see [Virtual machine scale sets](). |


## Next steps

