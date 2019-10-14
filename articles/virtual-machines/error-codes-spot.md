---
title: Error codes for spot VMs and scale sets in Azure | Microsoft Docs
description: Learn about error codes that you could possibly see when using spot VMs and scale sets.
services: virtual-machines-windows
author: cynthn
manager: gwallace

ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.topic: article
ms.date: 10/14/2019
ms.author: cynthn
---

# Preview: Error messages for spot VMs and scale sets


> [!IMPORTANT]
> spot VMs and virtual machine scale sets are currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


Here are some possible error codes you could receive when using spot VMs and scale sets.

| Key | Message | Description |
|-----|---------|
| EvictionPolicyCanBeSetOnlyOnLowPriorityVirtualMachines | Eviction policy can be set only on spot Virtual Machines. | This VM is not a spot VM, so you can't set the eviction policy. |
| LowPriVMNotSupportedInAvailabilitySet | spot Virtual Machine is not supported in Availability Set. | You need to choose to either use a spot VM or use a VM in an availability set, you can't choose both. |
| VariablePricingFeatureNotEnabledForSubscription | Subscription not enabled with variable pricing feature. | You need to have a subscription that supports spot VMs and you need to have enabled the feature for the public preview. |
| VMPriorityCannotBeApplied | The specified priority value '{0}' cannot be applied to the Virtual Machine '{1}' since no priority was specified when the Virtual Machine was created. | You need to specify the priority when the VM is created.  |
| VariablePriceGreaterThanProvidedMaxPrice | Cannot create this Virtual Machine since the provided max price is lower than the current variable price {0} for spot VM size {1}. | Select a higher max price. For more information, see pricing information for [Linux](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) or [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/windows/).|
| MaxPriceValueInvalid | Invalid max price value. The only supported values for max price are -1 or a decimal greater than zero. Max price value of -1 indicates the spot virtual machine will not be evicted for price reasons. | Enter a valid max price. For more information, see pricing for [Linux](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) or [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/windows/). |
| MaxPriceUpdateRequiresVMToBeDeallocated | Max price can be updated only when VM is in deallocated state. | Deallocate the VM so that you can change the max price. |
| VariablePricingIsNotSupportedForThisAPIVersion | Variable pricing is not supported for this API version. | The API version needs to be 2019-03-01. |
| VariablePricingIsNotSupportedForThisVMSize | Variable pricing is not supported for this VM size {0}. | Select another VM size. For more information, see [spot Virtual Machines](./linux/spot-vms.md). |
| VariablePricingIsSupportedOnlyForLowPriorityVirtualMachines | Variable pricing is supported only for spot Virtual Machines. | For more information, see [spot Virtual Machines](./linux/spot-vms.md). |
| MoveResourcesWithLowPriorityVMNotSupported | The move resources request contains a spot virtual machine. This is currently not supported. Please check the error details for virtual machine IDs.  | You cannot move spot VMs. |
| MoveResourcesWithLowPriorityVmssNotSupported | The Move resources request contains a spot virtual machine scale set. This is currently not supported. Please check the error details for virtual machine scale set IDs.| You cannot move spot instances. |


## Next steps

For more information, see [spot Virtual Machines](./linux/spot-vms.md).