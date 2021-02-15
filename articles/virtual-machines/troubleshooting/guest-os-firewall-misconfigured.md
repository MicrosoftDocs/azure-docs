---
title: Azure VM Guest OS firewall is misconfigured | Microsoft Docs
description: Learn how to use the Serial Console or offline method to diagnose and fix a misconfigured guest operating system firewall on a remote Azure VM.
services: virtual-machines-windows
documentationcenter: ''
author: Deland-Han
manager: dcscontentpm
editor: ''
tags: ''

ms.service: virtual-machines
ms.topic: troubleshooting
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: azurecli
ms.date: 11/22/2018
ms.author: delhan

---

# Azure VM guest OS firewall is misconfigured

This article introduce how to fix misconfigured guest operating system firewall on Azure VM.

## Symptoms

1.	The virtual machine (VM) Welcome screen shows that the VM is fully loaded.

2.	Depending on how the guest operating system is configured, there could be some or no network traffic reaching the VM.

## Cause

A misconfiguration of the guest system firewall can block some or all kinds of network traffic to the VM.

## Solution

Before you follow these steps, take a snapshot of the system disk of the affected VM as a backup. For more information, see [Snapshot a disk](../windows/snapshot-copy-managed-disk.md).

To troubleshoot this issue, use the Serial Console or [repair the VM offline](troubleshoot-rdp-internal-error.md#repair-the-vm-offline) by attaching the system disk of the VM to a recovery VM.

## Online mitigations

Connect to the [Serial Console, and then open a PowerShell instance](serial-console-windows.md#use-cmd-or-powershell-in-serial-console). If the Serial Console is not enabled on the VM, go to the "Repair the VM Offline" section of the following Azure article:

 [An internal error occurs when you try to connect to an Azure VM through Remote Desktop](troubleshoot-rdp-internal-error.md#repair-the-vm-offline)

The following rules can be edited to either enable access to the VM (through RDP) or to provide an easier troubleshooting experience:

*   Remote Desktop (TCP-In): This is the standard rule that provides primary access to the VM by allowing RDP in Azure.

*   Windows Remote Management (HTTP-In): This rule enables you to connect to the VM by using PowerShell., In Azure, this kind of access lets you use the scripting aspect of remote scripting and troubleshooting.

*   File and Printer Sharing (SMB-In): This rule enables network share access as a troubleshooting option.

*   File and Printer Sharing (Echo Request - ICMPv4-In): This rule enables you to ping the VM.

In the Serial Console Access instance, you can query the current status of the firewall rule.

*   Query by using the Display Name as a parameter:

    ```cmd
    netsh advfirewall firewall show rule dir=in name=all | select-string -pattern "(DisplayName.*<FIREWALL RULE NAME>)" -context 9,4 | more
    ```

*   Query by using the Local Port that the application uses:

    ```cmd
    netsh advfirewall firewall show rule dir=in name=all | select-string -pattern "(LocalPort.*<APPLICATION PORT>)" -context 9,4 | more
    ```

*   Query by using the Local IP address that the application uses:

    ```cmd
    netsh advfirewall firewall show rule dir=in name=all | select-string -pattern "(LocalIP.*<CUSTOM IP>)" -context 9,4 | more
    ```

*   If you see that the rule is disabled, you can enable it by running the following command:

    ```cmd
    netsh advfirewall firewall set rule name="<RULE NAME>" new enable=yes
    ```

*   For troubleshooting, you can turn the firewall profiles OFF:

    ```cmd
    netsh advfirewall set allprofiles state off
    ```

    If you do this to set the firewall correctly, re-enable the firewall after you finish your troubleshooting.

    > [!Note]
    > You don't have to restart the VM to apply this change.

*   Try again to connect to the VM through RDP.

### Offline Mitigations

1.	To enable or disable firewall rules, refer to [Enable or disable a firewall rule on an Azure VM Guest OS](enable-disable-firewall-rule-guest-os.md).

2.	Check whether you are in the [Guest OS firewall blocking inbound traffic scenario](guest-os-firewall-blocking-inbound-traffic.md).

3.	If you are still in doubt about whether the firewall is blocking your access, refer to [Disable the guest OS Firewall in Azure VM](disable-guest-os-firewall-windows.md), and then re-enable the guest system firewall by using the correct rules.

