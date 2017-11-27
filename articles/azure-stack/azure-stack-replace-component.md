---
title: Replace a hardware component on an Azure Stack scale unit node | Microsoft Docs
description: Learn how to replace a hardware component on an Azure Stack integrated system.
services: azure-stack
documentationcenter: ''
author: troettinger
manager: byronr
editor: ''

ms.assetid: c6e036bf-8c80-48b5-b2d2-aa7390c1b7c9
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/20/2017
ms.author: twooley

---

# Replace a hardware component on an Azure Stack scale unit node

*Applies to: Azure Stack integrated systems*

This article describes the general process to replace hardware components that are non hot-swappable. Actual replacement steps will vary based on your original equipment manufacturer (OEM) hardware vendor. See your vendor’s field replaceable unit (FRU) documentation for detailed steps that are specific to your Azure Stack integrated system.

Non hot-swappable components include the following:

- CPU*
- Memory*
- Motherboard/baseboard management controller (BMC)/video card
- Disk controller/host bus adapter (HBA)/backplane
- Network adapter (NIC)
- Operating system disk*
- Data drives (drives that don't support hot swap, for example PCI-e add-in cards)*

*These components may support hot swap, but can vary based on vendor implementation. See your OEM vendor’s FRU documentation for detailed steps.

The following flow diagram shows the general FRU process to replace a non hot-swappable hardware component.

![Flow diagram showing component replacement flow](media/azure-stack-replace-component/ReplaceComponentFlow.PNG)

*This action may not be required based on the physical condition of the hardware.

**Whether your OEM hardware vendor performs the component replacement and updates the firmware could vary based on you support contract.

## Review alert information

The Azure Stack health and monitoring system monitors the health of network adapters and data drives that are controlled by Storage Spaces Direct. It does not monitor other hardware components. For all other hardware components, alerts are raised in the vendor-specific hardware monitoring solution that runs on the hardware lifecycle host.

## Component replacement process

The following steps are provided as a high-level overview of the component replacement process. Do not follow these steps without referring to your OEM-provided FRU documentation.

1. Use the [Drain](azure-stack-node-actions.md#scale-unit-node-actions) action to put the scale unit node into maintenance mode. This action may not be required based on the physical condition of the hardware.
2. After the scale unit node is in maintenance mode, use the [Power off](azure-stack-node-actions.md#scale-unit-node-actions) action. This action may not be required based on the physical condition of the hardware.
 
   > [!NOTE]
   > In the unlikely case that the power off action doesn't work, use the baseboard management controller (BMC) web interface instead.

3. Replace the damaged hardware component. Whether your OEM hardware vendor performs the component replacement could vary based on your support contract.  
4. Update the firmware. Follow your vendor-specific firmware update process using the hardware lifecycle host to make sure the replaced hardware component has the approved firmware level applied. Whether your OEM hardware vendor performs this step could vary based on your support contract.  
5. Use the [Repair](azure-stack-node-actions.md#scale-unit-node-actions) action to bring the scale unit node back into the scale unit.
6. Use the privileged endpoint to [check the status of virtual disk repair](azure-stack-replace-disk.md#check-the-status-of-virtual-disk-repair). With new data drives, a full storage repair job can take multiple hours depending on system load and consumed space.
7. After the repair action has finished, validate that all active alerts have been automatically closed.

## Next steps

- For information about replacing a hot-swappable physical disk, see [Replace a disk](azure-stack-replace-disk.md).
- For information about replacing a physical node, see [Replace a scale unit node](azure-stack-replace-node.md). 