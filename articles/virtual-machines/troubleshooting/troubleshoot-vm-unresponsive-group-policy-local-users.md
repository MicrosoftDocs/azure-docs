---
title: Virtual Machine is unresponsive while applying 'Group Policy Local Users & Groups' policy
description: This article provides steps to resolve issues where the load screen is stuck applying a policy during boot in an Azure Virtual Machine (VM).
services: virtual-machines-windows
documentationcenter: ''
author: v-miegge
manager: dcscontentpm
editor: ''
tags: azure-resource-manager
ms.assetid: ff113268-f5bf-4e6a-986e-63b9b0ceff20
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.topic: troubleshooting
ms.date: 04/02/2020
ms.author: v-mibufo

---

# Virtual Machine is unresponsive while applying 'Group Policy Local Users & Groups' policy

This article provides steps to resolve issues where the load screen is stuck applying a policy, during boot, in an Azure Virtual Machine (VM).

## Symptom

When you use [Boot diagnostics](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/boot-diagnostics) to view the screenshot of the VM, you'll see that the screen is stuck loading with the message: *Applying Group Policy Local Users and Groups policy*.

![Alt text: Screen showing Applying Group Policy Local Users and Groups policy loading (Windows Server 2012).](media/troubleshoot-vm-unresponsive-group-policy-local-users/1.png)

Windows Server 2012

![Alt text: Screen showing Applying Group Policy Local Users and Groups policy loading (Windows Server 2012 R2).](media/troubleshoot-vm-unresponsive-group-policy-local-users/2.png)

Windows Server 2012 R2

## Cause

The symptoms of this freeze are caused by a code defect in the Windows Profile Service Dynamic Link Library (*profsvc.dll*).

> [!NOTE]
> This defect applies only on Windows Server 2012 and Windows Server 2012 R2.

### The policy in question

The policy being applied that won't finish its processes is:

* *Computer Configuration\Policies\Administrative Templates\System/User Profiles\Delete user profiles older than a specified number of days on system restart*

This policy will only hang if the following six conditions are true:

* The *Delete user profiles older than a specified number of days on system restart* policy is enabled.
* You have profiles that have met the age requirements to require cleanup.
* You have components that have registered for delete notification for profiles.
* The components make calls (direct or indirect) that need to acquire data from the Service Control Manager (SCM) components of Windows, such as Start, Stop, or Query information about a service.
* You have a service configured to start as *automatic*.
* This service is set to run under the context of a domain account (as opposed to using a built-in account, such as a local system).

### The code defect

The code defect is due to the Service Control Manager (SCM) and the Profile services attempting to apply locks on one another simultaneously. Locks exist to prevent multiple services from making changes on the same data at the same time, which would cause corruption. Ordinarily, multiple lock requests wouldn't cause an issue. However, since this is happening during boot, neither service can complete their processes, as they are stuck waiting upon one another.

### OS Bug 5880648 - Service Control Manager deadlocks with the "Delete user profiles on restart" policy

There are two actions which overlap so that:

* Action 1 acquires the profile lock but has not yet acquired the SCM lock.

  **AND**

* Action 2 acquires the SCM lock but has not yet acquired the profile lock.

Once this deadlock occurs, the attempt to acquire the second required lock hangs the action.

### Action 1 - Old profile deletion notification (has **Profile Lock**, needs **SCM Lock**)

1. First, the policy set to delete old profiles acquires an internal profile service lock.

   * This lock is there to prevent two threads from interacting with the profiles while the *delete operation* is progress.

2. The policy finds profiles that are old enough to be deleted.
3. As part of the profile deletion, a component that has registered for notifications of the deletions of a profile tries to **start a service**.
4. Prior to starting the service, the Service Control Manager (SCM) needs to acquire an **internal SCM lock** held by threads in **Action 2**.

### Action 2 - Profile load/creation for user specific data (has **SCM Lock**, needs **Profile Lock**)

1. At boot, SCM needs to order all *auto-start* services by their group, as well as any services that those services are dependent upon.

2. **SCM acquires an internal SCM lock** used to control access to starting, stopping, or configuring services as it orders the services.

3. Once the services are in order, the SCM loops through each service and starts it.

4. If the service is running under the context of a domain account, a profile needs to be either loaded or created for the domain account, so that it can store user specific data.

5. This request is sent to the **Profile Service**.

6. The profile service needs access to the **internal lock** acquired in **Action 1**.

## Solution

### Process Overview

1. Create and Access a Repair VM
2. Enable Serial Console and Memory Dump Collection
3. Rebuild the VM
4. Collect the Memory Dump File

   > [!NOTE]
   > When encountering this boot error, the Guest OS is not operational. You'll be troubleshooting in Offline mode to resolve this issue.

### Create and Access a Repair VM

1. Use [steps 1-3 of the VM Repair Commands](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/repair-windows-vm-using-azure-virtual-machine-repair-commands#repair-process-example) to prepare a Repair VM.
2. Using Remote Desktop Connection connect to the Repair VM.

### Enable Serial Console and Memory Dump Collection

To enable memory dump collection and Serial Console, run the script below:

1. Open an elevated command prompt session (Run as administrator).
2. Run the following commands:

   * Enable Serial Console:

     `bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /ems {<BOOT LOADER IDENTIFIER>} ON`

     `bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /emssettings EMSPORT:1 EMSBAUDRATE:115200`

3. Verify that the free space on the OS disk is as much as the memory size (RAM) on the VM.

   * If there's not enough space on the OS disk, you should change the location where the memory dump file will be created and refer that to any data disk attached to the VM that has enough free space. To change the location, replace `%SystemRoot%` with the drive letter (such as "F:") of the data disk in the below commands.

#### Suggested configuration to enable OS Dump

**Load Broken OS Disk:**

`REG LOAD HKLM\BROKENSYSTEM <VOLUME LETTER OF BROKEN OS DISK>:\windows\system32\config\SYSTEM`

**Enable on ControlSet001:**

`REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 1 /f`

`REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v DumpFile /t REG_EXPAND_SZ /d "%SystemRoot%\MEMORY.DMP" /f`

`REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v NMICrashDump /t REG_DWORD /d 1 /f`

**Enable on ControlSet002:**

`REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 1 /f`

`REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v DumpFile /t REG_EXPAND_SZ /d "%SystemRoot%\MEMORY.DMP" /f`

`REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v NMICrashDump /t REG_DWORD /d 1 /f`

### Rebuild the VM

Use [step 5 of the VM Repair Commands](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/repair-windows-vm-using-azure-virtual-machine-repair-commands#repair-process-example) to reassemble the VM.

### Collect the Memory Dump File

To resolve this problem, you would need first to gather the memory dump file for the crash and contact support with the memory dump file. To collect the dump file, follow these steps:

#### Attach the OS disk to a new Repair VM

1. Use steps [1-3 of the VM Repair Commands](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/repair-windows-vm-using-azure-virtual-machine-repair-commands#repair-process-example) to prepare a new Repair VM.

2. Using Remote Desktop Connection connect to the Repair VM.

#### Locate the dump file and submit a support ticket

1. On the repair VM, go to windows folder in the attached OS disk. If the driver letter that is assigned to the attached OS disk is F, you need to go to F:\Windows.

2. Locate the memory.dmp file, and then [submit a support ticket](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) with the memory dump file.

3. If you are having trouble locating the memory.dmp file, you may wish to use [non-maskable interrupt (NMI) calls in serial console](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/serial-console-windows#use-the-serial-console-for-nmi-calls) instead. You can follow the guide to [generate a kernel or complete crash dump](https://docs.microsoft.com/windows/client-management/generate-kernel-or-complete-crash-dump) file using NMI calls.
