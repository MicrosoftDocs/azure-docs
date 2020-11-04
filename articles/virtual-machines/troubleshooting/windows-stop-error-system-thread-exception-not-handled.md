---
title: Windows Stop Error - 0x0000007E System Thread Exception Not Handled
description: This article provides steps to resolve issues where the Guest OS encounters a problem and wishes to restart your Azure VM. The message will state that "A system thread exception wasn’t handled".
services: virtual-machines-windows
documentationcenter: ''
author: mibufo
editor: ''
tags: azure-resource-manager
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.topic: troubleshooting
ms.date: 11/04/2020
ms.author: v-mibufo

---

# Windows Stop Error - 0x0000007E System Thread Exception Not Handled

This article provides steps to resolve issues where the Guest OS encounters a problem and wishes to restart your Azure VM. The message will state that "A system thread exception wasn’t handled".

## Symptoms

When you use [Boot diagnostics](./boot-diagnostics.md) to view the screenshot of the VM, you'll see that the screenshot displays Windows needing to restart with either the stop code **SYSTEM THREAD EXCEPTION NOT HANDLED** or the error code **0x0000007E**.

![The screenshot shows Windows stuck during boot with the message: “Your PC ran into a problem and needs to restart. We’ll restart for you.” Stop code: “SYSTEM THREAD EXCEPTION NOT HANDLED”](media/windows-stop-error-system-thread-exception-not-handled/windows-stop-error-system-thread-exception-not-handled-1.png)

## Cause

The cause can't be determined until a memory dump file is analyzed. Continue to collect the memory dump file.

## Solution

### Collect the Memory Dump File

To resolve this problem, you first need to gather the memory dump file for the crash and then contact support with the memory dump file. To collect the dump file, follow these steps:

#### Attach the OS disk to a new Repair VM

1. Follow [steps 1-3 of the VM Repair Commands](./repair-windows-vm-using-azure-virtual-machine-repair-commands.md) to prepare a Repair VM.
2. Connect to the Repair VM using Remote Desktop Connection.

#### Locate the dump file and submit a support ticket

1. On the repair VM, go to the Windows folder in the attached OS disk. If the driver letter that is assigned to the attached OS disk is labeled as *F*, then you need to go to `F:\Windows`.
2. Locate the **memory.dmp** file, and then [submit a support ticket](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) with the memory dump file.
3. If you're having trouble locating the **memory.dmp** file, then follow the guide to [generate a crash dump file using non-maskable interrupt (NMI) calls](/windows/client-management/generate-kernel-or-complete-crash-dump).

For more information about NMI calls, see the [non-maskable interrupt (NMI) calls in serial console](./serial-console-windows.md#use-the-serial-console-for-nmi-calls) user guide.

## Next Steps

> [!div class="nextstepaction"]
> [Troubleshoot Azure Virtual Machine Boot Errors](./boot-error-troubleshoot.md)