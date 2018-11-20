---
title: Cannot connect to Azure Virtual Machines because RDP port is not enabled in NSG | Microsoft Docs
description: Learn how to troubleshoot a problem in which RDP fails because of NSG configuration in Azure portal| Microsoft Docs
services: virtual-machines-windows
documentationCenter: ''
author: genlin
manager: cshepard
editor: ''

ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 11/20/2018
ms.author: genli
---

#  Cannot RDP to a VM because RDP port is not enabled in NSG

This article shows how to resolve a problem in which you cannot connect to Azure Windows Virtual Machines (VMs) because the port is not enabled in the network security group.


> [!NOTE] 
> Azure has two different deployment models for creating and working with resources: 
[Resource Manager and classic](../../azure-resource-manager/resource-manager-deployment-model.md). This article covers using the Resource Manager deployment model, which we recommend using for new deployments instead of the classic deployment model. 

## Symptom

You cannot make a Remote Desktop Protocol (RDP) connection to a VM in Azure because of the RDP port is not opened in the network security group.

## Solution 

When you create a new VM, all traffic from the Internet is blocked by default. 

To enable the RPD port in Network security group, follow these steps:
1. Sign in to [Azure portal](https://portal.azure.com).
2. In **Virtual Machines**, the VM that has problem. 
3. In **Settings**, select **Networking**. 
4. In **Inbound port rules**, check if the port for RDP is set correctly. The following is sample of the configuration. 

    **Priority**: 300 </br>
    **Port**: 3389 </br>
    **Name**: Port_3389 </br>
    **Port**: 3389 </br>
    **Protocol**: TCP </br>
    **Source**: Any </br>
    **Destinations**: Any </br>
    **Action**: Allow </br>

In you specify the source IP address, this setting allows traffic only from a specific IP or range of IPs to connect to the VM. Make sure the computer you are using to initialize the RDP session is in the range.

For more information about network security group, see [network security group](../../virtual-network/security-overview.md).

> [!NOTE]
> RDP port 3389 is exposed to the Internet. This is only recommended for testing. For production environments, we recommend using a VPN or private connection.

Next steps

If the RDP port is already enabled in network security group,  see [Troubleshoot an RDP general error in Azure VM](./troubleshoot-rdp-general-error.md).



