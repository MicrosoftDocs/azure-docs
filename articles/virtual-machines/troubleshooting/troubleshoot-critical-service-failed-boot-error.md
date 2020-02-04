---
title: CRITICAL SERVICE FAILED when booting an Azure VM | Microsoft Docs
description: Learn how to troubleshoot the "0x0000005A-CRITICAL SERVICE FAILED" error that occurs when booting | Microsoft Docs
services: virtual-machines-windows
documentationCenter: ''
author: genlin
manager: dcscontentpm
editor: ''

ms.service: virtual-machines-windows

ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 10/08/2018
ms.author: genli
---

# Windows shows "CRITICAL SERVICE FAILED" on blue screen when booting an Azure VM
This article describes the "CRITICAL SERVICE FAILED" error that you may experience when you boot a Windows Virtual Machine (VM) in Microsoft Azure. It provides troubleshooting steps to help resolve the issues. 

> [!NOTE] 
> Azure has two different deployment models for creating and working with resources: 
[Resource Manager and classic](../../azure-resource-manager/management/deployment-models.md). This article describes using the Resource Manager deployment model, which we recommend using for new deployments instead of the classic deployment model.

## Symptom 

A Windows VM doesn't start. When you check the boot screenshots in [Boot diagnostics](./boot-diagnostics.md), you see one of the following error messages on a blue screen:

- "Your PC ran into a problem and needs to restart. You can restart. For more information about this issue and possible fixes, visit https://windows.com/stopcode. If you call a support person, give them this info: Stop code: CRITICAL SERVICE FAILED" 
- "Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you. 
If you'd like to know more, you can search online later for this error: CRITICAL_SERVICE_FAILED"

## Cause

There are various causes for stop errors. The most common causes are:
- Problem with a driver
- Corrupted system file or memory
- Application accesses a forbidden sector of the memory

## Solution 

To resolve this problem, [contact support and submit a dump file](./troubleshoot-common-blue-screen-error.md#collect-memory-dump-file), which will help us diagnose the problem more quickly, or try the following self-help solution.

### Attach the OS disk to a recovery VM

1. Take a snapshot of the OS disk of the affected VM as a backup. For more information, see [Snapshot a disk](../windows/snapshot-copy-managed-disk.md).
2. [Attach the OS disk to a recovery VM](./troubleshoot-recovery-disks-portal-windows.md). 
3. Establish a remote desktop connection to the recovery VM.

### Enable dump logs and Serial Console

The dump log and [Serial Console](./serial-console-windows.md) will help us to do further troubleshooting.

To enable dump logs and Serial Console, run the following script.

1. Open an elevated command prompt session (run as administrator).
2. Run the following script:

    In this script, we assume that the drive letter that's assigned to the attached OS disk is F. You should replace it with the appropriate value for your VM.

    ```powershell
    reg load HKLM\BROKENSYSTEM F:\windows\system32\config\SYSTEM.hiv

    REM Enable Serial Console
    bcdedit /store F:\boot\bcd /set {bootmgr} displaybootmenu yes
    bcdedit /store F:\boot\bcd /set {bootmgr} timeout 10
    bcdedit /store F:\boot\bcd /set {bootmgr} bootems yes
    bcdedit /store F:\boot\bcd /ems {<BOOT LOADER IDENTIFIER>} ON
    bcdedit /store F:\boot\bcd /emssettings EMSPORT:1 EMSBAUDRATE:115200

    REM Suggested configuration to enable OS Dump
    REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 2 /f
    REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v DumpFile /t REG_EXPAND_SZ /d "%SystemRoot%\MEMORY.DMP" /f
    REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v NMICrashDump /t REG_DWORD /d 1 /f

    REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 2 /f
    REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v DumpFile /t REG_EXPAND_SZ /d "%SystemRoot%\MEMORY.DMP" /f
    REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v NMICrashDump /t REG_DWORD /d 1 /f

    reg unload HKLM\BROKENSYSTEM
    ```

### Replace the unsigned drivers

1. On the recovery VM, run the following command from an elevated command prompt. This command sets the affected OS disk to start into safe mode at the next boot:

        bcdedit /store <OS DISK you attached>:\boot\bcd /set {default} safeboot minimal

    For example, if the OS disk that you attached is drive F, run the following command:

        bcdedit /store F: boot\bcd /set {default} safeboot minimal

2. [Detach the OS disk and then re-attach the OS disk to the affected VM](troubleshoot-recovery-disks-portal-windows.md). The VM will boot into Safe mode. If you still experience the error, go to the optional step.
3. Open the **Run** box and run **verifier** to start the Driver Verifier Manager tool.
4. Select **Automatically select unsigned drivers**, and then click **Next**.
5. You will get the list of the driver files that are unsigned. Remember the file names.
6. Copy the same versions of these files from a working VM, and then replace these unsigned files. 

7. Remove the safe boot settings:

        bcdedit /store <OS DISK LETTER>:\boot\bcd /deletevalue {default} safeboot
8.	Restart the VM. 

### Optional: Analyze the dump logs in Dump Crash mode

To analyze the dump logs yourself, follow these steps:

1. Attach the OS disk to a recovery VM.
2. On the OS disk that you attached, browse to **\windows\system32\config**. Copy all the files as a backup in case a rollback is required.
3. Start **Registry Editor** (regedit.exe).
4. Select the **HKEY_LOCAL_MACHINE** key. On the menu, select **File** > **Load Hive**.
5. Browse to the **\windows\system32\config\SYSTEM** folder on the OS disk that you attached. For the name of the hive, enter **BROKENSYSTEM**. The new registry hive is displayed under the **HKEY_LOCAL_MACHINE** key.
6. Browse to **HKEY_LOCAL_MACHINE\BROKENSYSTEM\ControlSet00x\Control\CrashControl** and make the following changes:

    Autoreboot = 0

    CrashDumpEnabled = 2
7.	Select **BROKENSYSTEM**. From the menu, select **File** > **Unload Hive**.
8.	Modify the BCD setup to boot into debug mode. Run the following commands from an elevated command prompt:

    ```cmd
    REM Setup some debugging flags on the boot manager
    bcdedit /store <OS DISK LETTER>:\boot\bcd /set {bootmgr} default {<IDENTIFIER OF THE WINDOWS BOOT LOADER>}
    bcdedit /store <OS DISK LETTER>:\boot\bcd /set {bootmgr} nointegritychecks on
    bcdedit /store <OS DISK LETTER>:\boot\bcd /set {bootmgr} integrityservices disable

    REM Setup some debugging flags on the boot loader
    bcdedit /store <OS DISK LETTER>:\boot\bcd /set {default} bootlog yes
    bcdedit /store <OS DISK LETTER>:\boot\bcd /set {default} bootstatuspolicy displayallfailures
    bcdedit /store <OS DISK LETTER>:\boot\bcd /set {default} nointegritychecks on
    bcdedit /store <OS DISK LETTER>:\boot\bcd /set {default} testsigning off
    bcdedit /store <OS DISK LETTER>:\boot\bcd /set {default} recoveryenabled no
    bcdedit /store <OS DISK LETTER>:\boot\bcd /set {default} integrityservices disable
    ```
9. [Detach the OS disk and then re-attach the OS disk to the affected VM](troubleshoot-recovery-disks-portal-windows.md).
10.	Boot the VM to see if it shows dump analysis. Find the file that fails to load. You need to replace this file with a file from the working VM. 

    The following is sample of dump analysis. You can see that the **FAILURE** is on filecrypt.sys: "FAILURE_BUCKET_ID: 0x5A_c0000428_IMAGE_filecrypt.sys".

    ```
    kd> !analyze -v 

    ******************************************************************************* 
    * * * Bugcheck Analysis * * * 

    ******************************************************************************* 
    CRITICAL_SERVICE_FAILED (5a) Arguments: Arg1: 0000000000000001 Arg2: ffffd80f4bfe7070 Arg3: ffffb00b0513d320 Arg4: ffffffffc0000428 Debugging 
    Details: ------------------ 
    DUMP_CLASS: 1 DUMP_QUALIFIER: 401 BUILD_VERSION_STRING: 10.0.14393.1770 (rs1_release.170917-1700) 
    DUMP_TYPE: 1 BUGCHECK_P1: 1 BUGCHECK_P2: ffffd80f4bfe7070 BUGCHECK_P3: ffffb00b0513d320 BUGCHECK_P4: ffffffffc0000428 BUGCHECK_STR: 0x5A_c0000428 
    CPU_COUNT: 1 CPU_MHZ: a22 CPU_VENDOR: GenuineIntel CPU_FAMILY: 6 CPU_MODEL: 3d CPU_STEPPING: 4 DEFAULT_BUCKET_ID: WIN8_DRIVER_FAULT 
    PROCESS_NAME: System CURRENT_IRQL: 0 ANALYSIS_SESSION_HOST: MININT-6RMM091 ANALYSIS_SESSION_TIME: 11-15-2017 19:32:42.0841 
    ANALYSIS_VERSION: 10.0.16361.1001 amd64fre STACK_TEXT: ffffc701`1dc74948 fffff803`b2ff4b4a : 00000000`0000005a 00000000`00000001 ffffd80f`4bfe7070 ffffb00b`0513d320 : nt!KeBugCheckEx [d:\rs1\minkernel\ntos\ke\amd64\procstat.asm @ 127] ffffc701`1dc74950 fffff803`b3205df3 : ffffd80f`4bba9f58 ffffd80f`4bba9f58 ffffc701`1dc74b80 ffffd80f`00000006 : nt!IopLoadDriver+0x19f8e6 [d:\rs1\minkernel\ntos\ke\amd64\threadbg.asm @ 81] 
    RETRACER_ANALYSIS_TAG_STATUS: DEBUG_FLR_FAULTING_IP is not found THREAD_SHA1_HASH_MOD_FUNC: eb79608c07faa1af62c0e61f25ff6bc1d6dfdb25 THREAD_SHA1_HASH_MOD_FUNC_OFFSET: 96a3a314834bb4e8443a8b7201525fc5dfc1878b THREAD_SHA1_HASH_MOD: 30a3e915496deaace47137d5b90c3ecc03746bf6 FOLLOWUP_NAME: wintriag
    MODULE_NAME: filecrypt IMAGE_NAME: filecrypt.sys DEBUG_FLR_IMAGE_TIMESTAMP: 0 IMAGE_VERSION: STACK_COMMAND: .thread ; .cxr ; kb FAILURE_BUCKET_ID: 0x5A_c0000428_IMAGE_filecrypt.sys BUCKET_ID: 0x5A_c0000428_IMAGE_filecrypt.sys PRIMARY_PROBLEM_CLASS: 0x5A_c0000428_IMAGE_filecrypt.sys TARGET_TIME: 2017-11-13T20:51:04.000Z OSBUILD: 14393 OSSERVICEPACK: 1770 SERVICEPACK_NUMBER: 0 OS_REVISION: 0 SUITE_MASK: 144 PRODUCT_TYPE: 3 OSPLATFORM_TYPE: x64 OSNAME: Windows 10 OSEDITION: Windows 10 Server TerminalServer DataCenter OS_LOCALE: USER_LCID: 0 OSBUILD_TIMESTAMP: 2017-09-17 19:16:08 BUILDDATESTAMP_STR: 170917-1700 BUILDLAB_STR: rs1_release BUILDOSVER_STR: 10.0.14393.1770 ANALYSIS_SESSION_ELAPSED_TIME: bfc ANALYSIS_SOURCE: KM FAILURE_ID_HASH_STRING: km:0x5a_c0000428_image_filecrypt.sys FAILURE_ID_HASH: {35f25777-b01e-70a1-c502-f690dab6cb3a} FAILURE_ID_REPORT_LINK: https://go.microsoft.com/fwlink/?LinkID=397724&FailureHash=35f25777-b01e-70a1-c502-f690dab6cb3a
    ```

11.	Once the VM is working and booting normally, remove the Dump Crash settings:

    ```cmd
    REM Restore the boot manager to default values
    bcdedit /store <OS DISK LETTER>:\boot\bcd /deletevalue {bootmgr} nointegritychecks
    bcdedit /store <OS DISK LETTER>:\boot\bcd /set {bootmgr} integrityservices enable

    REM Restore the boot loader to default values for an azure VM
    bcdedit /store <OS DISK LETTER>:\boot\bcd /deletevalue {default} bootlog
    bcdedit /store <OS DISK LETTER>:\boot\bcd /set {default} bootstatuspolicy ignoreallfailures
    bcdedit /store <OS DISK LETTER>:\boot\bcd /deletevalue {default} nointegritychecks
    bcdedit /store <OS DISK LETTER>:\boot\bcd /deletevalue {default} testsigning
    bcddit /store <OS DISK LETTER>:\boot\bcd /set {default} recoveryenabled no
    bcdedit /store <OS DISK LETTER>:\boot\bcd /set {default} integrityservicesenable
    ```
