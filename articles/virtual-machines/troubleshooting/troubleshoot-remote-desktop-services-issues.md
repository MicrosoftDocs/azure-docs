---
title: Remote Desktop Services is not starting on an Azure VM | Microsoft Docs
description: Learn how to troubleshoot issues with Remote Desktop Services when connecting to a Virtual Machine | Microsoft Docs
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
ms.date: 10/23/2018
ms.author: genli
---

# Remote Desktop Services is not starting on an Azure VM
This article describes how to troubleshoot issues of connecting to an Azure Virtual Machine (VM) when Remote Desktop Services (TermService) is not starting or failing to start.

>[!NOTE]
>Azure has two different deployment models for creating and working with resources: [Resource Manager and classic](../../azure-resource-manager/resource-manager-deployment-model.md). This article describes using the Resource Manager deployment model. We recommend that you use this model for new deployments instead of using the classic deployment model.

## Symptoms

When you try to connect to a VM, you experience the following issues:

- The VM screenshot shows the operating system is fully loaded and waiting for credentials.
- Remote Desktop Services (TermService) is not running on the VM.

## Cause

Remote Desktop Services is not running on the Virtual Machine. The cause can depend on the following scenarios:

- The TermService service was set to **Disabled**.
-	The TermService service is crashing or hanging.

## Solution

To resolve this problem, [back up the OS disk](../windows/snapshot-copy-managed-disk.md), and [attach the OS disk to a rescue VM](../windows/troubleshoot-recovery-disks-portal.md). Then, connect to the rescue VM and run the following scripts on an elevated CMD instance:

>[!NOTE]
>We assume that the drive letter that is assigned to the attached OS disk is F. Replace it with the appropriate value in your VM. After this is done, detach the disk from the recovery VM and [re-create your VM](../windows/create-vm-specialized.md).

```
reg load HKLM\BROKENSYSTEM f:\windows\system32\config\SYSTEM.hiv

REM Enable Serial Console
bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /set {bootmgr} displaybootmenu yes
bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /set {bootmgr} timeout 5 bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /set {bootmgr} bootems yes bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /ems {<BOOT LOADER IDENTIFIER>} ON
bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /emssettings EMSPORT:1 EMSBAUDRATE:115200

REM Get the current ControlSet from where the OS is booting
for /f "tokens=3" %x in ('REG QUERY HKLM\BROKENSYSTEM\Select /v Current') do set ControlSet=%x
set ControlSet=%ControlSet:~2,1%

REM Suggested configuration to enable OS Dump
set key=HKLM\BROKENSYSTEM\ControlSet00%ControlSet%\Control\CrashControl
REG ADD %key% /v CrashDumpEnabled /t REG_DWORD /d 2 /f
REG ADD %key% /v DumpFile /t REG_EXPAND_SZ /d "%SystemRoot%\MEMORY.DMP" /f
REG ADD %key% /v NMICrashDump /t REG_DWORD /d 1 /f

REM Set default values back on the broken service
reg add "HKLM\BROKENSYSTEM\ControlSet001\services\<PROCESS NAME>" /v start /t REG_DWORD /d <STARTUP TYPE> /f
reg add "HKLM\BROKENSYSTEM\ControlSet001\services\<PROCESS NAME>" /v ImagePath /t REG_EXPAND_SZ /d "<IMAGE PATH>" /f
reg add "HKLM\BROKENSYSTEM\ControlSet001\services\<PROCESS NAME>" /v ObjectName /t REG_SZ /d "<STARTUP ACCOUNT>" /f
reg add "HKLM\BROKENSYSTEM\ControlSet001\services\<PROCESS NAME>" /v type /t REG_DWORD /d 16 /f
reg add "HKLM\BROKENSYSTEM\ControlSet002\services\<PROCESS NAME>" /v start /t REG_DWORD /d <STARTUP TYPE> /f
reg add "HKLM\BROKENSYSTEM\ControlSet002\services\<PROCESS NAME>" /v ImagePath /t REG_EXPAND_SZ /d "<STARTUP ACCOUNT>" /f
reg add "HKLM\BROKENSYSTEM\ControlSet002\services\<PROCESS NAME>" /v ObjectName /t REG_SZ /d "<STARTUP ACCOUNT>" /f
reg add "HKLM\BROKENSYSTEM\ControlSet002\services\<PROCESS NAME>" /v type /t REG_DWORD /d 16 /f

REM Enable default dependencies from the broken service
reg add "HKLM\BROKENSYSTEM\ControlSet001\services\<DRIVER/SERVICE NAME>" /v start /t REG_DWORD /d <STARTUP TYPE> /f
reg add "HKLM\BROKENSYSTEM\ControlSet002\services\<DRIVER/SERVICE NAME>" /v start /t REG_DWORD /d <STARTUP TYPE> /f
reg unload HKLM\BROKENSYSTEM
```

## Next steps

If you still cannot resolve this issue, open a support request.
