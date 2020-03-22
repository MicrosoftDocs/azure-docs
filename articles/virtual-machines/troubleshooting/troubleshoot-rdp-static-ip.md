---
title: Cannot remote desktop to Azure Virtual Machines because of static IP| Microsoft Docs
description: Learn how to troubleshoot RDP problem that is caused by static IP in Microsoft Azure.| Microsoft Docs
services: virtual-machines-windows
documentationCenter: ''
author: genlin
manager: dcscontentpm
editor: ''

ms.service: virtual-machines-windows

ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 11/08/2018
ms.author: genli
---

#  Cannot remote desktop to Azure Virtual Machines because of static IP

This article describes a problem in which you cannot remote desktop to Azure Windows Virtual Machines (VMs) after a static IP is configured in the VM.


## Symptoms

When you make an RDP connection to a VM in Azure, you receive the following error message:

**Remote Desktop can't connect to the remote computer for one of these reasons:**

1. **Remote access to the server is not enabled**

2. **The remote Computer is turned off**

3. **The remote computer is not available on the network**

**Make sure the remote computer is turned on and connected to the network, and that remote access is enabled.**

When you check the screenshot in the [Boot diagnostics](../troubleshooting/boot-diagnostics.md) in the Azure portal, you see the VM boots normally and waits for credentials in the login screen.

## Cause

The VM has a static IP address that's defined on the network interface within Windows. This IP address differs from the address that's defined in the Azure portal.

## Solution

Before you follow these steps, take a snapshot of the OS disk of the affected VM as a backup. For more information, see [Snapshot a disk](../windows/snapshot-copy-managed-disk.md).

To resolve this issue, use Serial control to enable DHCP or [reset network interface](reset-network-interface.md) for the VM.

### Use Serial control

1. Connect to [Serial Console and open CMD instance](./serial-console-windows.md#use-cmd-or-powershell-in-serial-console
). If the Serial Console is not enabled on your VM, see [Reset network interface](reset-network-interface.md).
2. Check if the DHCP is disabled on the network interface:

        netsh interface ip show config
3. If the DHCP is disabled, revert the configuration of your network interface to use DHCP:

        netsh interface ip set address name="<NIC Name>" source=dhc

    For example, if the interwork interface names "Ethernet 2", run the following command:

        netsh interface ip set address name="Ethernet 2" source=dhc

4. Query the IP configuration again to make sure that the network interface is now correctly set up. The new IP address should match the one that’s provided by the Azure.

        netsh interface ip show config

    You don't have to restart the VM at this point. The VM will be back reachable.

After that, if you want to configure the static IP for the VM, see [Configure static IP addresses for a VM](../../virtual-network/virtual-networks-static-private-ip-arm-pportal.md).