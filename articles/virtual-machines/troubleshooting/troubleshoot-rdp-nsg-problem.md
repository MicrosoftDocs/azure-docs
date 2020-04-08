---
title: Cannot connect to Azure VMs because the RDP port is not enabled in NSG | Microsoft Docs
description: Learn how to troubleshoot a problem in which RDP fails because of the NSG configuration in the Azure portal | Microsoft Docs
services: virtual-machines-windows
documentationCenter: ''
author: genlin
manager: dcscontentpm
editor: v-jesits

ms.service: virtual-machines-windows

ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 11/20/2018
ms.author: genli
---

#  Cannot connect remotely to a VM because RDP port is not enabled in NSG

This article explains how to resolve a problem in which you cannot connect to an Azure Windows virtual machine (VM) because the Remote Desktop Protocol (RDP) port is not enabled in the network security group (NSG).


## Symptom

You cannot make an RDP connection to a VM in Azure because the RDP port is not opened in the network security group.

## Solution 

When you create a new VM, all traffic from the Internet is blocked by default. 

To enable the RDP port in an NSG, follow these steps:
1. Sign in to [the Azure portal](https://portal.azure.com).
2. In **Virtual Machines**, select the VM that has the problem. 
3. In **Settings**, select **Networking**. 
4. In **Inbound port rules**, check whether the port for RDP is set correctly. The following is an example of the configuration: 

    **Priority**: 300 </br>
    **Name**: Port_3389 </br>
    **Port(Destination)**: 3389 </br>
    **Protocol**: TCP </br>
    **Source**: Any </br>
    **Destinations**: Any </br>
    **Action**: Allow </br>

If you specify the source IP address, this setting allows traffic only from a specific IP address or range of IP addresses to connect to the VM. Make sure that the computer you are using to start the RDP session is within the range.

For more information about NSGs, see [network security group](../../virtual-network/security-overview.md).

> [!NOTE]
> RDP port 3389 is exposed to the Internet. Therefore, we recommend that you use this port only for recommended for testing. For production environments, we recommend that you use a VPN or private connection.

## Next steps

If the RDP port is already enabled in NSG, see [Troubleshoot an RDP general error in Azure VM](./troubleshoot-rdp-general-error.md).



