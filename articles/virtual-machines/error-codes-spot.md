---
title: Error codes for Azure Spot Virtual Machines and scale sets instances 
description: Learn about error codes that you could possibly see when using Azure Spot Virtual Machines and scale set instances.
author: cynthn
ms.service: virtual-machines
ms.subservice: spot
ms.workload: infrastructure-services
ms.topic: troubleshooting
ms.date: 03/25/2020
ms.author: cynthn
#pmcontact: jagaveer
---

# Error messages for Azure Spot Virtual Machines and scale sets

Here are some possible error codes you could receive when using Azure Spot Virtual Machines and scale sets.


| Key | Message | Description |
|-----|---------|-------------|
| SkuNotAvailable | The requested tier for resource '\<resource\>' is currently not available in location '\<location\>' for subscription '\<subscriptionID\>'. Try another tier or deploy to a different location. | There is not enough Azure Spot Virtual Machine capacity in this location to create your VM or scale set instance. |
| EvictionPolicyCanBeSetOnlyOnAzureSpotVirtualMachines  |  Eviction policy can be set only on Azure Spot Virtual Machines. | This VM is not an Azure Spot Virtual Machine, so you can't set the eviction policy. |
| AzureSpotVMNotSupportedInAvailabilitySet  |  Azure Spot Virtual Machine is not supported in Availability Set. | You need to choose to either use an Azure Spot Virtual Machine or use a VM in an availability set, you can't choose both. |
| AzureSpotFeatureNotEnabledForSubscription  |  Subscription not enabled with Azure Spot Virtual Machine feature. | Use a subscription that supports Azure Spot Virtual Machines. |
| VMPriorityCannotBeApplied  |  The specified priority value '{0}' cannot be applied to the Virtual Machine '{1}' since no priority was specified when the Virtual Machine was created. | Specify the priority when the VM is created. |
| SpotPriceGreaterThanProvidedMaxPrice  |  Unable to perform operation '{0}' since the provided max price '{1} USD' is lower than the current spot price '{2} USD' for Azure Spot Virtual Machine size '{3}'. | Select a higher max price. For more information, see pricing information for [Linux](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) or [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/windows/).|
| MaxPriceValueInvalid  |  Invalid max price value. The only supported values for max price are -1 or a decimal greater than zero. Max price value of -1 indicates the Azure Spot Virtual Machine will not be evicted for price reasons. | Enter a valid max price. For more information, see pricing for [Linux](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) or [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/windows/). |
| MaxPriceChangeNotAllowedForAllocatedVMs | Max price change is not allowed when the VM '{0}' is currently allocated. Deallocate and try again. | Stop\Deallocate the VM so that you can change the max price. |
| MaxPriceChangeNotAllowed | Max price change is not allowed. | You cannot change the max price for this VM. |
| AzureSpotIsNotSupportedForThisAPIVersion  |  Azure Spot Virtual Machine is not supported for this API version. | The API version needs to be 2019-03-01. |
| AzureSpotIsNotSupportedForThisVMSize  |  Azure Spot Virtual Machine is not supported for this VM size {0}. | Select another VM size. For more information, see [Azure Spot Virtual Machines](./spot-vms.md). |
| MaxPriceIsSupportedOnlyForAzureSpotVirtualMachines  |  Max price is supported only for Azure Spot Virtual Machines. | For more information, see [Azure Spot Virtual Machines](./spot-vms.md). |
| MoveResourcesWithAzureSpotVMNotSupported  |  The Move resources request contains an Azure Spot Virtual Machine. Not supported. Check the error details for virtual machine Ids. | You cannot move Azure Spot Virtual Machines. |
| MoveResourcesWithAzureSpotVmssNotSupported  |  The Move resources request contains an Azure Spot virtual machine scale set. Not supported. Check the error details for virtual machine scale set Ids. | You cannot move Azure Spot virtual machine scale set instances. |
| AzureSpotVMNotSupportedInVmssWithVMOrchestrationMode | Azure Spot Virtual Machine is not supported in Virtual machine scale set with VM Orchestration mode. | Set the orchestration mode to virtual machine scale set in order to use Azure Spot Virtual Machine instances. |


**Next steps**
For more information, see [spot Virtual Machines](./spot-vms.md).