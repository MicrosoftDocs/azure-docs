---
title: Cannot remote desktop to Azure Virtual Machines because of static IP| Microsoft Docs
description: Learn how to troubleshoot RDP problem that is caused by static IP in Microsoft Azure.| Microsoft Docs
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
ms.date: 11/08/2018
ms.author: genli
---

#  Cannot remote desktop to Azure Virtual Machines because of static IP

This article describes a problem that you cannot remote desktop to Azure Virtual Machines (VMs) because of static IP is configured in the VM.

> [!NOTE] 
> Azure has two different deployment models for creating and working with resources: 
[Resource Manager and classic](../../azure-resource-manager/resource-manager-deployment-model.md). This article covers using the Resource Manager deployment model, which we recommend using for new deployments instead of the classic deployment model. 

## Symptoms 

When you make an RDP connection to a Window VM in Azure, you may receive the following general error message:

**Remote Desktop can't connect to the remote computer for one of these reasons:**

1. **Remote access to the server is not enabled**

2. **The remote Computer is turned off**

3. **The remote computer is not available on the network**

**Make sure the remote computer is turned on and connected to the network, and that remote access is enabled.**

When you check the screenshot in the [Boot diagnostics](../troubleshooting/boot-diagnostics.md) window, you see the VM boots normally and waits for credentials in the login screen.

## Cause

This problem may occur because a static IP is used on the network interface in Windows, and this IP differs from the one in the portal.

## Solution 

Before you follow these steps, take a snapshot of the OS disk of the affected VM as a backup. For more information, see [Snapshot a disk](../windows/snapshot-copy-managed-disk.md).

To troubleshoot this issue, use Serial control to enable DHCP or [reset network interface](reset-network-interface.md) for the VM.

### Method 1: Use Serial control

1. Connect to [Serial Console and open CMD instance](./serial-console-windows.md#open-cmd-or-powershell-in-serial-console
). If the Serial Console is not enabled on your VM, go to the [Reset network interface by using Azure portal](#repair-the-vm-offline) section.
2. Check if the DHCP is disabled on the network interface:

        netsh interface ip show config
3. If the DHCP is not enabled, change the configuration of the network interface back to DHCP:

        netsh interface ip set address name="<NIC Name>" source=dhc
        
    For example, if the interwork interface names "Ethernet 2", run the following command:

        netsh interface ip set address name="Ethernet 2" source=dhc


4. Query the IP configuration again to make sure that the interface is set up properly now, and the new IP address which should match the one given by the Azure portal:

        netsh interface ip show config

5. You don't need to restart the VM. Try to connect to the VM by using remote desktop.

## Method 2: Use Azure portal

To reset network interface by using Azure portal, see [How to reset network interface for Azure Windows VM](reset-network-interface.md)
