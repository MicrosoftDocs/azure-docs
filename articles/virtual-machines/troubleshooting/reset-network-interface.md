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
ms.tgt_pltfrm: vm-windows
ms.topic: troubleshooting
ms.date: 05/11/2018
ms.author: genli

---
# How to reset network interface for Azure Windows VM 

[!INCLUDE [learn-about-deployment-models](../../../includes/learn-about-deployment-models-both-include.md)]

You cannot connect to Microsoft Azure Windows Virtual Machine (VM) after you disable the default Network Interface (NIC) or manually sets a static IP for the NIC. This article shows how to reset the network interface for Azure Windows VM, which will resolve the remote connection issue.

[!INCLUDE [support-disclaimer](../../../includes/support-disclaimer.md)]
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
7.	If the **Private IP assignment**  is not  **Static**, change it to **Static**.
8.	Change the **IP address** to another IP address that is available in the Subnet.
9. The virtual machine will restart to initialize the new NIC to the system.
10.	Try to RDP to your machine.	If successful, you can change the Private IP address back to the original if you would like. Otherwise, you can keep it. 

## Delete the unavailable NICs
After you can remote desktop to the machine, you must delete the old NICs to avoid the potential problem:

1.	Open Device Manager.
2.	Select **View** > **Show hidden devices**.
3.	Select **Network Adapters**. 
4.	Check for the adapters named as "Microsoft Hyper-V Network Adapter".
5.	You might see an unavailable adapter that is grayed out. Right-click the adapter and then select Uninstall.

    ![the image of the NIC](media/reset-network-interface/nicpage.png)

    > [!NOTE]
    > Only uninstall the unavailable adapters that have the name "Microsoft Hyper-V Network Adapter". If you uninstall any of the other hidden adapters, it could cause additional issues.
    >
    >

6.	Now all unavailable adapter should be cleared out from your system.
