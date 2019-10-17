---
title: Learn more about orchestration modes for virtual machine scale sets in Azure
description: Learn more about orchestration modes for virtual machine scale sets in Azure.
services: virtual-machine-scale-sets
documentationcenter: ''
author: cynthn
manager: gwallace
 
ms.service: virtual-machine-scale-sets
ms.workload: infrastructure-services
ms.topic: article
ms.date: 10/17/2019
ms.author: vashan
---


# Preview: Orchestration modes

Virtual machines scale sets provide a logical grouping of VMs for scale, easy management, and to keep your infrastructure secure by OS upgrades. 

VMSS currently offers you to create virtual machines using a VM configuration provided at scale set create time. You can use this to scale-out and in using AutoScale. When a scale-out operation occurs, it adds new VMs using the VM configuration. 

Scale sets is adding new functionality (in preview) so you can orchestrate VMs which are created outside of a scale set i.e. not by VMSS VM configuration. As part of this feature you will be able to get high availability by deploying these VMs in fault domains and/or Availability Zones. 

Virtual machine scale sets will support 2 distinct orchestration modes:

1. ScaleSetVMs – In this mode the VMs are create only using a scale set VM configuration. The VMs are tied to scale sets and the lifecycle is dependent on a scale set. 
2. VMs (Virtual machines) – In this mode the VMs are added to the scale set when you create the VM. 

> [!IMPORTANT]
> The orchestration modes are defined when you create the scale set and cannot be changed or updated later. 
> 
> This feature of virtual machine scale sets is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


** VMSS Orchestration Mode **

| | “orchestrationMode”: “VM” (VirtualMachine) | “orchestrationMode”: “ScaleSetVM” (VirtualMachineScaleSetVM) |
|   |   |   |
| Create | VMs are added to a scale set at create time.  Conversely a scale set can be created with this mode at the time of VM creation (using portal). | VMs are created only using VM configuration defined in the scale set. |
| Delete | VMs have to be deleted individually, the scale set will not be deleted if it has any VMs in it. | VMs can be deleted individually, deleting the scale set will delete all of the VM instances. |
| Attach/Detach VMs | Not supported | Not supported |
| Fault domains  | Can define fault domains. 2 or 3 based on regional support and 5 for Availability zone. | Can define fault domains going from 1 through 5 |
| Update domains | N/A. Update domains are automatically mapped to fault domains | N/A. Update domains are automatically mapped to fault domains |
| Availability Zones  | Only one availability zone can be defined in this mode.  | 1 through 3 Availability Zone can be defined in this mode. |
| AutoScale  | Not supported | Supported |
| OS upgrade  | Not supported | Supported |
| Model updates | Not supported | Supported |
| Instance control | Full VM Control, VMs have fully qualified URI that provides management of VM   | VMs are dependent resources of VMSS. Instaces can be accessed for management only through the scale set. |
| Instance Model | Microsoft.Compute/VirtualMachines model definition. | Microsoft.Compute/VirtualMachineScaleSets/VirtualMachines model definition. |
| Instance Lifecycle (Creation through Deletion) | VMs and their artifacts (Disks, NICs etc.) can be managed independently. | Instances and their artifacts (Disks, NICs etc.) are sticky to the scale set instances that create them. |
| Capacity  | An empty scale set can be created  | Scale sets will have VMs at the time of creation |
| VM profile  | N/A | Required |
| Move  | Supported  | Supported |
|Single placement group == false  | Not supported | Supported |

# Next steps

For more information, see the [Overview of availability options](availability.md).