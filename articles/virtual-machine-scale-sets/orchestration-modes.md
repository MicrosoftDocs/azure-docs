---
title: Learn more about orchestration modes for virtual machine scale sets in Azure
description: Learn more about orchestration modes for virtual machine scale sets in Azure.
author: mimckitt
ms.author: mimckitt
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.subservice: management
ms.date: 10/23/2019
ms.reviewer: jushiman
ms.custom: mimckitt

---


# Orchestration modes (preview)

> [!CAUTION]
> Thank you to everyone who participated in this public preview. We were able to gather valuable feedback from our community. This preview is now **closed** for any new participants, in order to integrate feedback. We will update this space with any new information.

Virtual machines scale sets provide a logical grouping of platform-managed virtual machines. With scale sets, you create a virtual machine configuration model, automatically add or remove additional instances based on CPU or memory load, and automatically upgrade to the latest OS version. Traditionally, scale sets allow you to create virtual machines using a VM configuration model provided at time of scale set creation, and the scale set can only manage virtual machines that are implicitly created based on the configuration model.

With the scale set orchestration mode (preview), you can now choose whether the scale set should orchestrate virtual machines which are created explicitly outside of a scale set configuration model, or virtual machine instances created implicitly based on the configuration model. Scale set orchestration mode also helps you design your VM infrastructure for high availability by deploying these VMs in fault domains and Availability Zones.


Virtual machine scale sets will support 2 distinct orchestration modes:

- ScaleSetVM – Virtual machine instances added to the scale set are based on the scale set configuration model. The virtual machine instance lifecycle - creation, update, deletion - is managed by the scale set.
- VM (virtual machines) – Virtual machines created outside of the scale set can be explicitly added to the scaleset. 
 

> [!IMPORTANT]
> The orchestration mode is defined when you create the scale set and cannot be changed or updated later. 
> 
> This feature of virtual machine scale sets is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Orchestration modes

|                             | “orchestrationMode”: “VM” (VirtualMachine) | “orchestrationMode”: “ScaleSetVM” (VirtualMachineScaleSetVM) |
|-----------------------------|--------------------------------------------|--------------------------------------------------------------|
| VM configuration model      | None                                       | Required |
| Adding new VM to Scale Set  | VMs are explicitly added to the scale set when the VM is created. | VMs are implicitly created and added to the scale set based on the VM configuration model, instance count, and AutoScaling rules | |
| Delete VM                   | VMs have to be deleted individually, the scale set will not be deleted if it has any VMs in it. | VMs can be deleted individually, deleting the scale set will delete all of the VM instances.  |
| Attach/Detach VMs           | Not supported                              | Not supported |
| Instance Lifecycle (Creation through Deletion) | VMs and their artifacts (like disks and NICs) can be managed independently. | Instances and their artifacts (like disks and NICs) are implicit to the scale set instances that create them. They cannot be detached or managed separately outside the scale set |
| Fault domains               | Can define fault domains. 2 or 3 based on regional support and 5 for Availability zone. | Can define fault domains going from 1 through 5 |
| Update domains              | Update domains are automatically mapped to fault domains | Update domains are automatically mapped to fault domains |
| Availability Zones          | Supports regional deployment or VMs in one Availability Zone | Supports regional deployment or multiple Availability Zones; Can define the zone balancing strategy |
| AutoScale                   | Not supported                              | Supported |
| OS upgrade                  | Not supported                              | Supported |
| Model updates               | Not supported                              | Supported |
| Instance control            | Full VM Control. VMs have fully qualified URI that support the full range of Azure VM management capabilities (like Azure Policy, Azure Backup, and Azure Site Recovery) | VMs are dependent resources of the scale set. Instances can be accessed for management only through the scale set. |
| Instance Model              | Microsoft.Compute/VirtualMachines model definition. | Microsoft.Compute/VirtualMachineScaleSets/VirtualMachines model definition. |
| Capacity                    | An empty scale set can be created; up to 200 VMs can be added to the scale set | Scale sets can be defined with an instance count 0 - 1000 |
| Move                        | Supported                                  | Supported |
| Single placement group == false | Not supported                          | Supported |


## Next steps

For more information, see the [Overview of availability options](availability.md).
