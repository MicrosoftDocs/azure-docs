---

title: Blue screen errors when booting an Azure VM| Microsoft Docs
description: Learn how to troubleshoot the issue that the blue screen error is received when booting| Microsoft Docs
services: virtual-machines-windows
documentationCenter: ''
author: genlin
manager: dcscontentpm
editor: ''

ms.service: virtual-machines-windows

ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 09/28/2018
ms.author: genli
---

# Windows shows blue screen error when booting an Azure VM
This article describes blue screen errors that you may encounter when you boot a Windows Virtual Machine (VM) in Microsoft Azure. It provides steps to help you collect data for a support ticket. 

> [!NOTE] 
> Azure has two different deployment models for creating and working with resources: 
[Resource Manager and classic](../../azure-resource-manager/management/deployment-models.md). This article describes using the Resource Manager deployment model, which we recommend using for new deployments instead of the classic deployment model.

## Symptom 

A Windows VM doesn't start. When you check the boot screenshots in [Boot diagnostics](./boot-diagnostics.md), you see one of the following error messages in a blue screen:

- our PC ran into a problem and needs to restart. We're just collecting some error info, and then you can restart.
- Your PC ran into a problem and needs to restart.

This section lists the common error messages you may encounter when managing VMs:

## Cause

There could be multiple reasons as why you would get a stop error. The most common causes are:

- Problem with a driver
- Corrupted system file or memory
- An application accesses to a forbidden sector of the memory

## Collect memory dump file

To resolve this problem, you would need first to gather dump file for the crash and contact support with the dump file. To collect the Dump file, follow these steps:

### Attach the OS disk to a recovery VM

1. Take a snapshot of the OS disk of the affected VM as a backup. For more information, see [Snapshot a disk](../windows/snapshot-copy-managed-disk.md).
2. [Attach the OS disk to a recovery VM](../windows/troubleshoot-recovery-disks-portal.md). 
3. Remote desktop to the recovery VM.

### Locate dump file and submit a support ticket

1. On the recovery VM, go to windows folder in the attached OS disk. If the driver letter that is assigned to the attached OS disk is F, you need to go to F:\Windows.
2. Locate the memory.dmp file, and then [submit a support ticket](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) with the dump file. 

If you cannot find the dump file, move the next step to enable dump log and Serial Console.

### Enable dump log and Serial Console

To enable dump log and Serial Console, run the following script.

1. Open elevated command Prompt session (Run as administrator).
2. Run the following script:

    In this script, we assume that the drive letter that is assigned to the attached OS disk is F.  Replace it with the appropriate value in your VM.

    ```powershell
    reg load HKLM\BROKENSYSTEM F:\windows\system32\config\SYSTEM.hiv

    REM Enable Serial Console
    bcdedit /store F:\boot\bcd /set {bootmgr} displaybootmenu yes
    bcdedit /store F:\boot\bcd /set {bootmgr} timeout 5
    bcdedit /store F:\boot\bcd /set {bootmgr} bootems yes
    bcdedit /store F:\boot\bcd /ems {<BOOT LOADER IDENTIFIER>} ON
    bcdedit /store F:\boot\bcd /emssettings EMSPORT:1 EMSBAUDRATE:115200

    REM Suggested configuration to enable OS Dump
    REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 1 /f
    REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v DumpFile /t REG_EXPAND_SZ /d "%SystemRoot%\MEMORY.DMP" /f
    REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v NMICrashDump /t REG_DWORD /d 1 /f

    REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 1 /f
    REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v DumpFile /t REG_EXPAND_SZ /d "%SystemRoot%\MEMORY.DMP" /f
    REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v NMICrashDump /t REG_DWORD /d 1 /f

    reg unload HKLM\BROKENSYSTEM
    ```

    1. Make sure that there's enough space on the disk to allocate as much memory as the RAM, which depends on the size that you are selecting for this VM.
    2. If there's not enough space or this is a large size VM (G, GS or E series), you could then change the location where this file will be created and refer that to any other data disk which is attached to the VM. To do this, you will need to change the following key:

            reg load HKLM\BROKENSYSTEM F:\windows\system32\config\SYSTEM.hiv

            REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v DumpFile /t REG_EXPAND_SZ /d "<DRIVE LETTER OF YOUR DATA DISK>:\MEMORY.DMP" /f
            REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v DumpFile /t REG_EXPAND_SZ /d "<DRIVE LETTER OF YOUR DATA DISK>:\MEMORY.DMP" /f

            reg unload HKLM\BROKENSYSTEM

3. [Detach the OS disk and then Re-attach the OS disk to the affected VM](../windows/troubleshoot-recovery-disks-portal.md).
4. Start the VM to reproduce the issue, then a dump file will be generated.
5. Attach the OS disk to a recovery VM, collect dump file, and then [submit a support ticket](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) with the dump file.



