---
title: Azure VM is unresponsive while applying Security Policy to the system
description: This article provides steps to resolve issues where the load screen is stuck when VM is unresponsive while applying security policy to the system in an Azure VM.
services: virtual-machines-windows
documentationcenter: ''
author: TobyTu
manager: dcscontentpm
editor: ''
tags: azure-resource-manager
ms.assetid: a97393c3-351d-4324-867d-9329e31b5629
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.topic: troubleshooting
ms.date: 06/15/2020
ms.author: v-mibufo
---

# Azure VM is unresponsive while applying Security Policy to the system

This article provides steps to resolve issues where the OS hangs and becomes unresponsive while it is applying a security policy in an Azure VM.

## Symptoms

When you use [Boot diagnostics](boot-diagnostics.md) to view the screenshot of the VM, you will see that the screenshot displays the OS stuck while booting with the message:

> 'Applying security policy to the system'.

:::image type="content" source="media/unresponsive-vm-apply-security-policy/apply-policy.png" alt-text="Screenshot of Windows Server 2012 R2 startup screen is stuck.":::

:::image type="content" source="media/unresponsive-vm-apply-security-policy/apply-policy-2.png" alt-text="Screenshot of OS startup screen is stuck.":::

## Cause

There is a plethora of potential causes of this issue. You will not be able to know the source until after a memory dump analysis is performed.

## Resolution

### Process Overview

1. [Create and Access a Repair VM](#create-and-access-a-repair-vm)
2. [Enable Serial Console and Memory Dump Collection](#enable-serial-console-and-memory-dump-collection)
3. [Rebuild the VM](#rebuild-the-vm)
4. [Collect the Memory Dump File](#collect-the-memory-dump-file)

### Create and Access a Repair VM

1. Use [steps 1-3 of the VM Repair Commands](repair-windows-vm-using-azure-virtual-machine-repair-commands.md#repair-process-example) to prepare a Repair VM.
2. Use Remote Desktop Connection connect to the Repair VM.

### Enable Serial Console and Memory Dump Collection

To enable memory dump collection and Serial Console, run this script:

1. Open an elevated command prompt session (Run as administrator).
2. List the BCD store data and determine the boot loader identifier, which you will use in the next step.

     1. For a Generation 1 VM, enter the following command and note the identifier listed:

        ```console
        bcdedit /store <BOOT PARTITON>:\boot\bcd /enum
        ```

        In the command, replace \<BOOT PARTITON> with the letter of the partition in the attached disk that contains the boot folder.

        :::image type="content" source="media/unresponsive-vm-apply-security-policy/store-data.png" alt-text="Diagram shows the output of listing the BCD store in a Generation 1 VM, which lists under Windows Boot Loader the identifier number.":::

     2. For a Generation 2 VM, enter the following command and note the identifier listed:

        ```console
        bcdedit /store <LETTER OF THE EFI SYSTEM PARTITION>:EFI\Microsoft\boot\bcd /enum
        ```

        - In the command, replace \<LETTER OF THE EFI SYSTEM PARTITION> with the letter of the EFI System Partition.
        - It may be helpful to launch the Disk Management console to identify the appropriate system partition labeled as "EFI System Partition".
        - The identifier may be a unique GUID or it could be the default "bootmgr".
3. Run the following commands to enable Serial Console:

    ```console
    bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /ems {<BOOT LOADER IDENTIFIER>} ON
    ```

    ```console
    bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /emssettings EMSPORT:1 EMSBAUDRATE:115200
    ```

    - In the command, replace \<VOLUME LETTER WHERE THE BCD FOLDER IS> with the letter of the BCD folder.
    - In the command, replace \<BOOT LOADER IDENTIFIER> with the identifier you found in the previous step.
4. Verify that the free space on the OS disk is greater than the memory size (RAM) on the VM.

    1. If there's not enough space on the OS disk, you should change the location where the memory dump file will be created. Rather than creating the file on the OS disk, you can refer it to any other data disk attached to the VM that has enough free space. To change the location, replace "%SystemRoot%" with the drive letter (for example "F:") of the data disk in the commands listed below.
    2. Enter the commands below (suggested dump configuration):

        Load Broken OS Disk:

        ```console
        REG LOAD HKLM\BROKENSYSTEM <VOLUME LETTER OF BROKEN OS DISK>:\windows\system32\config\SYSTEM
        ```

        Enable on ControlSet001:

        ```console
        REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 1 /f
        REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v DumpFile /t REG_EXPAND_SZ /d "%SystemRoot%\MEMORY.DMP" /f
        REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v NMICrashDump /t REG_DWORD /d 1 /f
        ```

        Enable on ControlSet002:

        ```console
        REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 1 /f
        REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v DumpFile /t REG_EXPAND_SZ /d "%SystemRoot%\MEMORY.DMP" /f
        REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v NMICrashDump /t REG_DWORD /d 1 /f
        ```

        Unload Broken OS Disk:

        ```console
        REG UNLOAD HKLM\BROKENSYSTEM
        ```

### Rebuild the VM

Use [step 5 of the VM Repair Commands](repair-windows-vm-using-azure-virtual-machine-repair-commands.md#repair-process-example) to reassemble the VM.

### Collect the Memory Dump File

To resolve this problem, you would need first to gather the memory dump file for the crash and contact support with the memory dump file. To collect the dump file, follow these steps:

1. Attach the OS disk to a new Repair VM:

    - Use [steps 1-3 of the VM Repair Commands](repair-windows-vm-using-azure-virtual-machine-repair-commands.md#repair-process-example) to prepare a new Repair VM.
    - Use Remote Desktop Connection connect to the Repair VM.

2. Locate the dump file and submit a support ticket:

    - On the repair VM, go to windows folder in the attached OS disk. If the driver letter that is assigned to the attached OS disk is `F`, you need to go to `F:\Windows`.
    - Locate the memory.dmp file, and then [submit a support ticket](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) with the memory dump file.
    - If you are having trouble locating the memory.dmp file, you may wish to use [non-maskable interrupt (NMI) calls in serial console](serial-console-windows.md#use-the-serial-console-for-nmi-calls) instead. You can follow the guide to [generate a crash dump file using NMI calls](/windows/client-management/generate-kernel-or-complete-crash-dump).

## Next steps

If you have issues when you apply Local Users and Groups policy see [VM is unresponsive when applying Group Policy Local Users and Groups policy](unresponsive-vm-apply-group-policy.md)