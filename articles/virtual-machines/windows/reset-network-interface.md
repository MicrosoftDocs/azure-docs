---
title: How to reset network interface for Azure Windows VM| Microsoft Docs
description: Shows how to reset network interface for Azure Windows VM
services: virtual-machines-windows, azure-resource-manager
documentationcenter: ''
author: genlin
manager: willchen
editor: ''
tags: top-support-issue, azure-resource-manager

ms.service: virtual-machines-windows
ms.workload: na
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 06/26/2017
ms.author: genli

---
# How to reset network interface for Azure Windows VM 
[!INCLUDE [virtual-machines-troubleshoot-deployment-new-vm-opening](../../../includes/virtual-machines-troubleshoot-deployment-new-vm-opening-include.md)]

[!INCLUDE [support-disclaimer](../../../includes/support-disclaimer.md)]

You cannot remote desktop to a Microsoft Azure Windows Virtual Machine (VM) after you disable the default Network Interface (NIC) or manually sets a static IP for the NIC. This article shows how to reset the network interface for Azure Windows VM, which will resolve this issue.

## Reset network interface

### For Classic VMs

To reset network interface, follow these steps:

1.	Go to the [Azure portal]( https://ms.portal.azure.com).
2.	Select **Virtual Machines (Classic)**.
3.	Select the affected Virtual Machine.
4.	Select **IP addresses**.
5.	If the **Private IP assignment**  is not  **Static**, change it to **Static**.
6.	Change the **IP address** to another IP address that is available in the Subnet.
7.	Select Save.
8.	The virtual machine will restart to initialize the new NIC to the system.
9.	Try to RDP to your machine.	If successful, you can change the Private IP address back to the original if you would like. Otherwise, you can keep it. 

### For VMs deployed in Resource group model

1.	Go to the [Azure portal]( https://ms.portal.azure.com).
2.	Select the affected Virtual Machine.
3.	Select **Network Interfaces**.
4.	Select the Network Interface associated with your machine
5.	Select **IP configurations**.
6.	Select the IP. 
7.	If the the **Private IP assignment**  is not  **Static**, change it to **Static**.
8.	Change the **IP address** to another IP address that is available in the Subnet.
9. The virtual machine will restart to initialize the new NIC to the system.
10.	Try to RDP to your machine.	If successful, you can change the Private IP address back to the original if you would like. Otherwise, you can keep it. 
 


## Delete the unavailable NICs
After you can remote desktop to the machine, you must delete the old NICs to avoid the potential problem:

12.	Open Device Manager.
13.	Select **View** > **Show hidden devices**.
14.	Select **Network Adapters**. 
15.	Here you should see some adapters named as "Microsoft Hyper-V Network Adapter.
16.	You might see one with that name that is grayed out. Right-click the adapter and then select Uninstall.
    ![the image of the NIC](media/reset-network-interface/nicpage.png)

>[NOTE!]
>Only uninstall grayed out adapters that have the name "Microsoft Hyper-V Network Adapter". If you uninstall any of the other hidden adapters, it could cause additional issues.

18.	Now all unavailable NICs should be cleared out from your system, and you should no longer experience the issues.

