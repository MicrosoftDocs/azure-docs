---
title: Error codes for Azure Spot VMs and scale sets instances 
description: Learn about error codes that you could possibly see when using Spot VMs and scale set instances.
author: cynthn
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: troubleshooting
ms.date: 03/25/2020
ms.author: cynthn
#pmcontact: jagaveer
---

# Error messages for Spot VMs and scale sets

Here are some possible error codes you could receive when using Spot VMs and scale sets.


| Key | Message | Description |
|-----|---------|-------------|
| SkuNotAvailable | The requested tier for resource '\<resource\>' is currently not available in location '\<location\>' for subscription '\<subscriptionID\>'. Please try another tier or deploy to a different location. | There is not enough Azure Spot capacity in this location to create your VM or scale set instance. |
| EvictionPolicyCanBeSetOnlyOnAzureSpotVirtualMachines  |  Eviction policy can be set only on Azure Spot Virtual Machines. | This VM is not a Spot VM, so you can't set the eviction policy. |
| AzureSpotVMNotSupportedInAvailabilitySet  |  Azure Spot Virtual Machine is not supported in Availability Set. | You need to choose to either use a Spot VM or use a VM in an availability set, you can't choose both. |
| AzureSpotFeatureNotEnabledForSubscription  |  Subscription not enabled with Azure Spot feature. | Use a subscription that supports Spot VMs. |
| VMPriorityCannotBeApplied  |  The specified priority value '{0}' cannot be applied to the Virtual Machine '{1}' since no priority was specified when the Virtual Machine was created. | Specify the priority when the VM is created. |
| SpotPriceGreaterThanProvidedMaxPrice  |  Unable to perform operation '{0}' since the provided max price '{1} USD' is lower than the current spot price '{2} USD' for Azure Spot VM size '{3}'. | Select a higher max price. For more information, see pricing information for [Linux](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) or [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/windows/).|
| MaxPriceValueInvalid  |  Invalid max price value. The only supported values for max price are -1 or a decimal greater than zero. Max price value of -1 indicates the Azure Spot virtual machine will not be evicted for price reasons. | Enter a valid max price. For more information, see pricing for [Linux](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) or [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/windows/). |
| MaxPriceChangeNotAllowedForAllocatedVMs | Max price change is not allowed when the VM '{0}' is currently allocated. Please deallocate and try again. | Stop\Deallocate the VM so that you can change the max price. |
| MaxPriceChangeNotAllowed | Max price change is not allowed. | You cannot change the max price for this VM. |
| AzureSpotIsNotSupportedForThisAPIVersion  |  Azure Spot is not supported for this API version. | The API version needs to be 2019-03-01. |
| AzureSpotIsNotSupportedForThisVMSize  |  Azure Spot is not supported for this VM size {0}. | Select another VM size. For more information, see [Spot Virtual Machines](./linux/spot-vms.md). |
| MaxPriceIsSupportedOnlyForAzureSpotVirtualMachines  |  Max price is supported only for Azure Spot Virtual Machines. | For more information, see [Spot Virtual Machines](./linux/spot-vms.md). |
| MoveResourcesWithAzureSpotVMNotSupported  |  The Move resources request contains an Azure Spot virtual machine. This is currently not supported. Please check the error details for virtual machine Ids. | You cannot move Spot VMs. |
| MoveResourcesWithAzureSpotVmssNotSupported  |  The Move resources request contains an Azure Spot virtual machine scale set. This is currently not supported. Please check the error details for virtual machine scale set Ids. | You cannot move Spot scale set instances. |
| EphemeralOSDisksNotSupportedForSpotVMs | Ephemeral OS disks are not supported for Spot VMs. | Use a regular OS disk for your Spot VM. |
| AzureSpotVMNotSupportedInVmssWithVMOrchestrationMode | Azure Spot Virtual Machine is not supported in Virtual Machine Scale Set with VM Orchestration mode. | Set the orchestration mode to virtual machine scale set in order to use Spot instances. |


**Next steps**
For more information, see [spot Virtual Machines](./linux/spot-vms.md).