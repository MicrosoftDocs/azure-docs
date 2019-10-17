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


# Orchestration modes

Virtual machines scale sets (VMSS) provide a logical grouping of VMs for scale, easy management, and to keep your infrastructure secure by OS upgrades. 

VMSS currently offers you to create Virtual machines using a VM configuration provided at VMSS create time. You can use this scale out and in using AutoScale, when a scale out operation occurs it adds new VMs using the VM configuration. 

VMSS is adding new functionality (in preview) to be able to orchestrate over VMs which are created outside of VMSS i.e. not by VMSS VM configuration. As part of this feature you will be able to get High Availability by deploying these VMs in fault domains and/or Availability Zones. 

Virtual Machines Scale Sets will support 2 distinct orchestration modes   
1. ScaleSetVMs – In this mode the VMs are create only using VMSS VM configuration. The VMs are tied to VMSS and lifecycle is dependent on VMSS. 
2. VMs (Virtual machines) – In this mode the VMs are added to the VMSS at create time of VM. 

> [!IMPORTANT]
> The orchestration modes are defined at the creation time of VMSS and cannot be changes/updated later. 


** VMSS Orchestration Mode **

| | “orchestrationMode”: “VM” (VirtualMachine) | “orchestrationMode”: “ScaleSetVM” (VirtualMachineScaleSetVM) |
|   |   |   |
| Create | VMs are added to VMSS at create time.  Conversely VMSS can be created with this mode at the time of VM creation (using portal). | VMs are created only using VM configuration defined in VMSS. |
| Delete | VMs have to be deleted individually, VMSS will not be deleted if it has any VMs in it. | VMs can be deleted individually, deleting VMSS will delete all VM instances. |
| Attach/Detach VMs | Not Supported | Not Supported |
| Fault domains  | Can define fault domains. 2 or 3 based on reginal support and 5 for Availability zone. | Can define fault domains going from 1 through 5 |
| Update domains | N/A. Update domains are automatically mapped to fault domains | N/A. Update domains are automatically mapped to fault domains |
| Availability Zones  | Only one availability zone can be defined in this mode.  | 1 through 3 Availability Zone can be defined in this mode. |
| AutoScale  | Not Supported | Supported |
| OS upgrade  | Not Supported | Supported |
| Model updates | Not Supported | Supported |
| Instance Control | Full VM Control, VMs have fully qualified URI that provides management of VM   | VMs are dependent resources of VMSS. Instnaces can be accessed for management through VMSS only. |
| Instance Model | Microsoft.Compute/VirtualMachines model definition. | Microsoft.Compute/VirtualMachineScaleSets/VirtualMachines model definition. |
| Instance Lifecycle (Creation through Deletion) | VMs and their artifacts (Disks, NICs etc.) can be managed independently. | Instances and their artifacts (Disks, NICs etc.) are sticky to the VMSS VMs that instantiates them. |
| Capacity  | An empty VMSS can be created  | VMSS will have VMs at the time of creation |
| VM profile  | N/A | Required |
| Move  | Supported  | Supported |
|Single placement group == false  | Not supported | Supported |

# Next steps

For more information, see the [Overview of vailability options](availability.md).