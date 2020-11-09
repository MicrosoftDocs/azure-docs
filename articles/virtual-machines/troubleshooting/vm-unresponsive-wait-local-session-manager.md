---
title: VM is unresponsive while waiting for the Local Session Manager service
description: This article provides steps to resolve issues where the guest OS is stuck waiting for Local Session Manager to finish processing while it's booting an Azure VM.
services: virtual-machines-windows
documentationcenter: ''
author: mibufo
editor: ''
tags: azure-resource-manager
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.topic: troubleshooting
ms.date: 10/22/2020
ms.author: v-mibufo

---

# VM is unresponsive while waiting for the Local Session Manager service

This article provides steps to resolve issues where the guest operating system (guest OS) is stuck waiting for Local Session Manager to finish processing while it boots an Azure virtual machine (VM).

## Symptoms

When you use [boot diagnostics](./boot-diagnostics.md) to view a screenshot of the VM's output, you'll see that the screenshot displays a prompt with a "Please wait for the Local Session Manager" message.

![Screenshot showing the stuck guest OS in Windows Server 2012 R2, with a "Please wait for the Local Session Manager" message.](media/vm-unresponsive-wait-local-session-manager/vm-unresponsive-wait-local-session-manager-1.png)

## Cause

There could be multiple reasons for a VM to be stuck waiting for Local Session Manager. If this issue persists, you need to collect a memory dump for analysis.

## Solution

In some cases, simply waiting for the process to finish will resolve the issue. If your VM hangs on the wait screen for over an hour, you first need to gather the memory dump file for the crash and then send the file to Microsoft support. To collect the dump file, follow the instructions in the next two sections.

### Attach the OS disk to a new repair VM

1. To prepare a repair VM, follow steps 1-3 of the [VM repair commands](./repair-windows-vm-using-azure-virtual-machine-repair-commands.md).
1. Connect to the repair VM by using Remote Desktop Connection.

### Locate the dump file and submit a support ticket

1. On the repair VM, go to the Windows folder on the attached OS disk. For example, if the drive letter that's assigned to the attached OS disk is labeled *F*, go to `F:\Windows`.
1. Look for the *memory.dmp* file, and then [submit a support ticket](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) with the memory dump file attached.
1. If you're having trouble locating the *memory.dmp* file, follow the guide to [generate a crash dump file using non-maskable interrupt (NMI) calls](/windows/client-management/generate-kernel-or-complete-crash-dump).

For more information about NMI calls, see the [NMI calls in Azure Serial Console](./serial-console-windows.md#use-the-serial-console-for-nmi-calls) user guide.

## Next steps

> [!div class="nextstepaction"]
> [Troubleshoot Azure Virtual Machine boot errors](boot-error-troubleshoot.md)