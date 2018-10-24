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

This article describes how to troubleshoot issues of connecting to an Azure Virtual Machine (VM) when Remote Desktop Services (TermService) isn't starting or failing to start.

>[!NOTE]
>Azure has two different deployment models for creating and working with resources: [Resource Manager and classic](../../azure-resource-manager/resource-manager-deployment-model.md). This article describes using the Resource Manager deployment model. We recommend that you use this model for new deployments instead of using the classic deployment model.

## Symptoms

When you try to connect to a VM, you experience the following scenarios:

- The VM screenshot shows the operating system is fully loaded and waiting for credentials.
- All applications on the VM are working as expected and accessible.
- The VM is responding to the TCP connectivity on the Microsoft Remote Desktop Protocol (RDP) port (default 3389).
- You aren't prompted for credentials when you try to make an RDP connection.

## Cause

This problem occurs because Remote Desktop Services isn't running on the Virtual Machine. The cause can depend on the following scenarios:

- The TermService service was set to **Disabled**.
- The TermService service is crashing or hanging.

## Solution

To resolve this problem, use one of the following solutions or try the solutions one by one:

### Solution 1: Using the Serial Console

1. Access the Serial Console by selecting **Support & Troubleshooting** > **Serial console (Preview)**. If the feature is enabled on the VM, you can connect the VM successfully.

2. Create a new channel for a CMD instance. Type **CMD** to start the channel to get the channel name.

3. Switch to the channel that running the CMD instance, in this case it should be channel 1.

   ```
   ch -si 1
   ```

4. Press **Enter** again and type a valid username and password (local or domain ID) for the VM.

5. Query the status of the TermService service.

   ```
   sc query TermService
   ```

6. If the service status shows **Stopped**, try to start the service.

   ```
   sc start TermService
   ```

7. Query the service again to make sure that the service is started successfully.

   ```
   sc query TermService
   ```

### Solution 2: Using a recovery VM to enable the service

[Back up the OS disk](../windows/snapshot-copy-managed-disk.md) and [attach the OS disk to a rescue VM](../windows/troubleshoot-recovery-disks-portal.md). Then, open an elevated CMD instance and run the following scripts on the rescue VM:

>[!NOTE]
>We assume that the drive letter that is assigned to the attached OS disk is F. Replace it with the appropriate value in your VM. After this is done, detach the disk from the recovery VM and [re-create your VM](../windows/create-vm-specialized.md). For further troubleshooting, you can use **Solution 1** because the Serial Console has been enabled.

```
reg load HKLM\BROKENSYSTEM f:\windows\system32\config\SYSTEM

REM Enable Serial Console
bcdedit /store <Volume Letter Where The BCD Folder Is>:\boot\bcd /set {bootmgr} displaybootmenu yes
bcdedit /store <Volume Letter Where The BCD Folder Is>:\boot\bcd /set {bootmgr} timeout 10
bcdedit /store <Volume Letter Where The BCD Folder Is>:\boot\bcd /set {bootmgr} bootems yes
bcdedit /store <Volume Letter Where The BCD Folder Is>:\boot\bcd /ems {<Boot Loader Identifier>} ON
bcdedit /store <Volume Letter Where The BCD Folder Is>:\boot\bcd /emssettings EMSPORT:1 EMSBAUDRATE:115200

REM Get the current ControlSet from where the OS is booting
for /f "tokens=3" %x in ('REG QUERY HKLM\BROKENSYSTEM\Select /v Current') do set ControlSet=%x
set ControlSet=%ControlSet:~2,1%

REM Suggested configuration to enable OS Dump
set key=HKLM\BROKENSYSTEM\ControlSet00%ControlSet%\Control\CrashControl
REG ADD %key% /v CrashDumpEnabled /t REG_DWORD /d 2 /f
REG ADD %key% /v DumpFile /t REG_EXPAND_SZ /d "%SystemRoot%\MEMORY.DMP" /f
REG ADD %key% /v NMICrashDump /t REG_DWORD /d 1 /f

REM Set default values back on the broken service
reg add "HKLM\BROKENSYSTEM\ControlSet001\services\<Process Name>" /v start /t REG_DWORD /d <Startup Type> /f
reg add "HKLM\BROKENSYSTEM\ControlSet001\services\<Process Name>" /v ImagePath /t REG_EXPAND_SZ /d "<Image Path>" /f
reg add "HKLM\BROKENSYSTEM\ControlSet001\services\<Process Name>" /v ObjectName /t REG_SZ /d "<Startup Account>" /f
reg add "HKLM\BROKENSYSTEM\ControlSet001\services\<Process Name>" /v type /t REG_DWORD /d 16 /f
reg add "HKLM\BROKENSYSTEM\ControlSet002\services\<Process Name>" /v start /t REG_DWORD /d <Startup Type> /f
reg add "HKLM\BROKENSYSTEM\ControlSet002\services\<Process Name>" /v ImagePath /t REG_EXPAND_SZ /d "<Startup Account>" /f
reg add "HKLM\BROKENSYSTEM\ControlSet002\services\<Process Name>" /v ObjectName /t REG_SZ /d "<Startup Account>" /f
reg add "HKLM\BROKENSYSTEM\ControlSet002\services\<Process Name>" /v type /t REG_DWORD /d 16 /f

REM Enable default dependencies from the broken service
reg add "HKLM\BROKENSYSTEM\ControlSet001\services\<Driver/Service Name>" /v start /t REG_DWORD /d <Startup Type> /f
reg add "HKLM\BROKENSYSTEM\ControlSet002\services\<Driver/Service Name>" /v start /t REG_DWORD /d <Startup Type> /f
reg unload HKLM\BROKENSYSTEM
```

## Need help? Contact support

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
