---
title: Error codes for low-priority VMs and scale sets in Azure | Microsoft Docs
description: Learn about error codes that you could possibly see when using low-priority VMs and scale sets.
services: virtual-machines-windows
author: cynthn
manager: gwallace

ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.topic: article
ms.date: 08/06/2019
ms.author: cynthn
---

# Preview: Error messages for low priority VMs and scale sets

Here are some possible error codes you could receive when using low priority VMs and scale sets.

| No | Key | Message |
|----|-----|---------|
| 1 | EvictionPolicyCanBeSetOnlyOnLowPriorityVirtualMachines | "Eviction policy can be set only on low-priority Virtual Machines. For more information, see https://aka.ms/low-priority/errormessages." |
| 2 | LowPriVMNotSupportedInAvailabilitySet | "Low-priority Virtual Machine is not supported in Availability Set. For more information, see https://aka.ms/low-priority/errormessages." |
| 3 | VariablePricingFeatureNotEnabledForSubscription | "Subscription not enabled with variable pricing feature. For more information, see https://aka.ms/low-priority/errormessages." |
| 4 | VMPriorityCannotBeApplied | "The specified priority value '{0}' cannot be applied to the Virtual Machine '{1}' since no priority was specified when the Virtual Machine was created. For more information, see https://aka.ms/low-priority/errormessages." |
| 5 | VariablePriceGreaterThanProvidedMaxPrice | Cannot create this Virtual Machine since the provided max price is lower than the current variable price {0} for low-priority VM size {1}. |
| 6 | MaxPriceValueInvalid | Invalid max price value. The only supported values for max price are -1 or a decimal greater than zero. Max price value of -1 indicates the low-priority virtual machine will not be evicted for price reasons. |
| 7 | MaxPriceUpdateRequiresVMToBeDeallocated | Max price can be updated only when VM is in deallocated state. |
| 8 | VariablePricingIsNotSupportedForThisAPIVersion | Variable pricing is not supported for this API version. |
| 9 | VariablePricingIsNotSupportedForThisVMSize | Variable pricing is not supported for this VM size {0}. |
| 10 | VariablePricingIsSupportedOnlyForLowPriorityVirtualMachines | Variable pricing is supported only for low-priority Virtual Machines. |
| 11 | MoveResourcesWithLowPriorityVMNotSupported | "The Move resources request contains a low priority virtual machine. This is currently not supported. Please check the error details for virtual machine Ids. For more information, see https://aka.ms/low-priority/errormessages." |
| 12 | MoveResourcesWithLowPriorityVmssNotSupported | "The Move resources request contains a low priority virtual machine scale set. This is currently not supported. Please check the error details for virtual machine scale set Ids. For more information, see https://aka.ms/low-priority/errormessages." |


##Next steps

