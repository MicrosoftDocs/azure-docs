---
title: Windows virtual machine cannot boot due to windows boot manager
description: This article provides steps to resolve issues where Windows Boot Manager prevents the booting of an Azure Virtual Machine.
services: virtual-machines-windows
documentationcenter: ''
author: v-miegge
manager: dcscontentpm
editor: ''
tags: azure-resource-manager
ms.assetid: a97393c3-351d-4324-867d-9329e31b3598
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.topic: troubleshooting
ms.date: 03/26/2020
ms.author: v-mibufo

---

# Windows VM cannot boot due to Windows Boot Manager

This article provides steps to resolve issues where Windows Boot Manager prevents the booting of an Azure Virtual Machine (VM).

## Symptom

The VM is stuck waiting upon a user prompt and doesn't boot unless manually instructed to.

When you use [Boot diagnostics](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/boot-diagnostics) to view the screenshot of the VM, you'll see that the screenshot displays the Windows Boot Manager with the message *Choose an operating system to start, or press TAB to select a tool:*.

Figure 1
 
![Windows Boot Manager stating "Choose an operating system to start, or press TAB to select a tool:"](media/troubleshoot-guide-windows-boot-manager-menu/1.jpg)

## Cause

The error is due to a BCD flag *displaybootmenu* in the Windows Boot Manager. When the flag is enabled, Windows Boot Manager prompts the user, during the booting process, to select which loader they wish to run, causing a boot delay. In Azure, this feature can add to the time it takes to boot a VM.

## Solution

Process Overview:

1. Configure for Faster Boot Time using Serial Console.
2. Create and Access a Repair VM.
3. Configure for Faster Boot Time on a Repair VM.
4. **Recommended**: Before you rebuild the VM, enable serial console and memory dump collection.
5. Rebuild the VM.

### Configure for Faster Boot Time using Serial Console

If you have access to serial console, there are two ways you can achieve faster boot times. Either decrease the *displaybootmenu* wait time, or remove the flag altogether.

1. Follow directions to access [Azure Serial Console for Windows](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/serial-console-windows) to gain access to the text-based console.

   > [!NOTE]
   > If you're unable to access serial console, skip ahead to [Create and Access a Repair VM](#create-and-access-a-repair-vm).

2. **Option A**: Reduce Waiting Time

   a. Waiting time is set at 30 seconds by default but can be changed to a faster time (e.g. 5 seconds).

   b. Use the following command in serial console to adjust the timeout value:

      `bcdedit /set {bootmgr} timeout 5`

3. **Option B**: Remove the BCD Flag

   a. To prevent the Display Boot Menu prompt altogether, enter the following command:

      `bcdedit /deletevalue {bootmgr} displaybootmenu`

      > [!NOTE]
      > If you were unable to use serial console to configure a faster boot time in the steps above, you can instead continue with the following steps. You'll now be troubleshooting in offline mode to resolve this issue.

### Create and Access a Repair VM

1. Use [steps 1-3 of the VM Repair Commands](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/repair-windows-vm-using-azure-virtual-machine-repair-commands) to prepare a Repair VM.
2. Use Remote Desktop Connection connect to the Repair VM.

### Configure for Faster Boot Time on a Repair VM

1. Open an elevated command prompt.
2. Enter the following to enable DisplayBootMenu:

   Use this command for **Generation 1 VMs**:

   `bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /set {bootmgr} displaybootmenu yes`

   Use this command for **Generation 2 VMs**:

   `bcdedit /store <VOLUME LETTER OF EFI SYSTEM PARTITION>:EFI\Microsoft\boot\bcd /set {bootmgr} displaybootmenu yes`

   Replace any greater than or less than symbols as well as the text within them, e.g. "< text here >".

3. Change the timeout value to 5 seconds:

   Use this command for **Generation 1 VMs**:

   `bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /set {bootmgr} timeout 5`

   Use this command for **Generation 2 VMs**:

   `bcdedit /store <VOLUME LETTER OF EFI SYSTEM PARTITION>:EFI\Microsoft\boot\bcd /set {bootmgr} timeout 5`

   Replace any greater than or less than symbols as well as the text within them, e.g. "< text here >".

### Recommended: Before you rebuild the VM, enable serial console and memory dump collection

To enable memory dump collection and Serial Console, run the following script:

1. Open an elevated command prompt session (Run as administrator).
2. Run the following commands:

   Enable Serial Console

   `bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /ems {<BOOT LOADER IDENTIFIER>} ON`

   `bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /emssettings EMSPORT:1 EMSBAUDRATE:115200`

   Replace any greater than or less than symbols as well as the text within them, e.g. "< text here >".

3. Verify that the free space on the OS disk is as much as the memory size (RAM) on the VM.

   If there's not enough space on the OS disk, you should change the location where the memory dump file will be created and refer that to any data disk attached to the VM that has enough free space. To change the location, replace "%SystemRoot%" with the drive letter (for example, "F:") of the data disk in the below commands.

#### Suggested configuration to enable OS Dump

**Load Broken OS Disk**:

`REG LOAD HKLM\BROKENSYSTEM <VOLUME LETTER OF BROKEN OS DISK>:\windows\system32\config\SYSTEM`

**Enable on ControlSet001:**

`REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 1 /f`

`REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v DumpFile /t REG_EXPAND_SZ /d "%SystemRoot%\MEMORY.DMP" /f`

`REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v NMICrashDump /t REG_DWORD /d 1 /f`

**Enable on ControlSet002:**

`REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 1 /f`

`REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v DumpFile /t REG_EXPAND_SZ /d "%SystemRoot%\MEMORY.DMP" /f`

`REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v NMICrashDump /t REG_DWORD /d 1 /f`

**Unload Broken OS Disk:**

`REG UNLOAD HKLM\BROKENSYSTEM`

### Rebuild the Original VM

Use [step 5 of the VM Repair Commands](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/repair-windows-vm-using-azure-virtual-machine-repair-commands#repair-process-example) to reassemble the VM.