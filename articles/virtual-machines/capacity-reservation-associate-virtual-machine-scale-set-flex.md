---
title: Associate a virtual machine scale set with flexible orchestration to a Capacity Reservation group (preview)
description: Learn how to associate a new virtual machine scale set with flexible orchestration mode to a Capacity Reservation group.
author: bdeforeest
ms.author: bidefore
ms.service: virtual-machines
ms.topic: how-to
ms.date: 11/22/2022
ms.reviewer: cynthn, jushiman
ms.custom: template-how-to
---

# Associate a virtual machine scale set with flexible orchestration to a Capacity Reservation group

**Applies to:** :heavy_check_mark: Flexible scale sets

Virtual Machine Scale Sets have two modes: 

- **Uniform Orchestration Mode:** In this mode, virtual machine scale sets use a VM profile or a template to scale up to the desired capacity. While there is some ability to manage or customize individual VM instances, Uniform uses identical VM instances. These instances are exposed through the virtual machine scale sets VM APIs and are not compatible with the standard Azure IaaS VM API commands. Since the scale set performs all the actual VM operations, reservations are associated with the virtual machine scale set directly. Once the scale set is associated with the reservation, all the subsequent VM allocations will be done against the reservation. 
- **Flexible Orchestration Mode:** In this mode, you get more flexibility managing the individual virtual machine scale set VM instances as they can use the standard Azure IaaS VM APIs instead of using the scale set interface. To use reservations with flexible orchestration mode, define both the virtual machine scale set property and the capacity reservation property on each virtual machine.

To learn more about these modes, go to [Virtual Machine Scale Sets Orchestration Modes](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md). 

This content applies to the flexible orchestration mode. For uniform orchestration mode, go to [Associate a virtual machine scale set with uniform orchestration to a Capacity Reservation group](capacity-reservation-associate-virtual-machine-scale-set.md)


> [!IMPORTANT]
> Capacity Reservations with virtual machine set using flexible orchestration is currently in public preview. This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> During the preview, always attach reserved capacity during creation of new scale sets using flexible orchestration mode. There are known issues attaching capacity reservations to existing scale sets using flexible orchestration. Microsoft will update this page as more options become enabled during preview. 

## Associate a new virtual machine scale set to a Capacity Reservation group

**Option 1: Add to Virtual Machine profile** - If the Scale Set with flexible orchestration includes a VM profile, add the Capacity Reservation group property to the profile during Scale Set creation. Follow the same process used for a Scale Set using uniform orchestration. For sample code, see [Associate a virtual machine scale set with uniform orchestration to a Capacity Reservation group](capacity-reservation-associate-virtual-machine-scale-set.md). 

**Option 2: Add to the first Virtual Machine deployed** - If the Scale Set omits a VM profile, then you must add the Capacity Reservation group to the first Virtual Machine deployed using the Scale Set. Follow the same process used to associate a VM. For sample code, see [Associate a virtual machine to a Capacity Reservation group](capacity-reservation-associate-vm.md). 

## Next steps

> [!div class="nextstepaction"]
> [Learn how to remove a scale set association from a Capacity Reservation](capacity-reservation-remove-virtual-machine-scale-set.md)
