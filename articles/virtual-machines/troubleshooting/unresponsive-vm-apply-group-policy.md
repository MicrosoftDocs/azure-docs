---
title: Azure virtual machine is unresponsive while applying policy
description: This article provides steps to resolve issues in which the load screen is stuck when applying a policy during boot in an Azure VM.
services: virtual-machines-windows
documentationcenter: ''
author: TobyTu
manager: dcscontentpm
editor: ''
tags: azure-resource-manager
ms.assetid: a97393c3-351d-4324-867d-9329e31b5628
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.topic: troubleshooting
ms.date: 05/07/2020
ms.author: v-mibufo
---

# VM becomes unresponsive while applying ‘Group Policy Local Users & Groups’ policy

This article provides steps to resolve issues where the load screen is stuck when applying a policy during boot in an Azure VM.

## Symptoms

When using [Boot diagnostics](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/boot-diagnostics) to view a screenshot of the VM, the screen is stuck loading with the message: ‘*Applying Group Policy Local Users and Groups policy*’.

:::image type="content" source="media//unresponsive-vm-apply-group-policy/applying-group-policy-1.png" alt-text="Screenshot of Applying Group Policy Local Users and Groups policy loading (Windows Server 2012 R2).":::

:::image type="content" source="media/unresponsive-vm-apply-group-policy/applying-group-policy-2.png" alt-text="Screenshot of Applying Group Policy Local Users and Groups policy loading (Windows Server 2012).":::

## Cause

There are conflicting locks when the policy attempts to cleanup old user profiles.

> [!NOTE]
> This applies only to Windows Server 2012 and Windows Server 2012 R2.

Here’s the problematic policy:

`Computer Configuration\Policies\Administrative Templates\System/User Profiles\Delete user profiles older than a specified number of days on system restart`

## Resolution

### Process overview

1. [Create and access a repair VM](#step-1-create-and-access-a-repair-vm)
2. [Disable the policy](#step-2-disable-the-policy)
3. [Enable Serial Console and memory dump collection](#step-3-enable-serial-console-and-memory-dump-collection)
4. [Rebuild the VM](#step-4-rebuild-the-vm)

> [!NOTE]
> If your encounter this boot error, the Guest OS isn’t operational. You must troubleshoot in Offline mode.

### Step 1: Create and access a repair VM

1. Use [steps 1-3 of the VM repair commands](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/repair-windows-vm-using-azure-virtual-machine-repair-commands#repair-process-example) to prepare a repair VM.
2. Use Remote Desktop Connection connect to the repair VM.

### Step 2: Disable the policy

1. On the repair VM, open the Registry Editor.
2. Locate the key **HKEY_LOCAL_MACHINE** and select **File** > **Load Hive...** from the menu.

    :::image type="content" source="media/unresponsive-vm-apply-group-policy/registry.png" alt-text="Screenshot shows highlighted HKEY_LOCAL_MACHINE and the menu containing Load Hive.":::

    - Load Hive allows you to load registry keys from an offline system, in this case the broken disk attached to the repair VM.
    - System-wide settings are stored on `HKEY_LOCAL_MACHINE` and can be abbreviated as “HKLM”.
3. In the attached disk, go to the `\windows\system32\config\SOFTWARE` file and open it.

    1. You will be prompted for a name. Enter BROKENSOFTWARE.<br/>
    2. To verify that BROKENSOFTWARE was loaded, expand **HKEY_LOCAL_MACHINE** and look for the added BROKENSOFTWARE key.
4. Navigate to BROKENSOFTWARE and check if the CleanupProfile key exists in the loaded hive.

    1. If the key exists, then the CleanupProfile policy is set, its value represents the retention policy in days. Continue deleting the key.<br/>
    2. If the key doesn't exist, the CleanupProfile policy isn't set. [Submit a support ticket](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade), including the memory.dmp file located in the Windows directory of the attached OS disk.

5. Delete the CleanupProfiles key using this command:

    ```
    reg delete "HKLM\BROKENSOFTWARE\Policies\Microsoft\Windows\System" /v CleanupProfiles /f
    ```
6.	Unload the BROKENSOFTWARE hive using this command:

    ```
    reg unload HKLM\BROKENSOFTWARE
    ```

### Step 3: Enable Serial Console and memory dump collection

To enable memory dump collection and Serial Console, run this script:

1. Open an elevated command prompt session (Run as administrator).
2. Run these commands:

    **Enable Serial Console**: 
    
    ```
    bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /ems {<BOOT LOADER IDENTIFIER>} ON
    ```

    ```
    bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /emssettings EMSPORT:1 EMSBAUDRATE:115200 
    ```
3. Verify if the free space on the OS disk is at least equal to the VM’s memory size (RAM).

    If there isn’t enough space on the OS disk, change the memory dump location and refer it to an attached data disk with enough free space. To change the location, replace “%SystemRoot%” with the drive letter (e.g. “F:”) of the data disk in the commands below.

    **Suggested configuration to enable OS dump**:

    Load Broken OS Disk:

    ```
    REG LOAD HKLM\BROKENSYSTEM <VOLUME LETTER OF BROKEN OS DISK>:\windows\system32\config\SYSTEM
    ```

    Enable on ControlSet001:
    
    ```
    REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 1 /f 
    REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v DumpFile /t REG_EXPAND_SZ /d "%SystemRoot%\MEMORY.DMP" /f 
    REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v NMICrashDump /t REG_DWORD /d 1 /f 
    ```

    Enable on ControlSet002:
    
    ```
    REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 1 /f 
    REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v DumpFile /t REG_EXPAND_SZ /d "%SystemRoot%\MEMORY.DMP" /f 
    REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v NMICrashDump /t REG_DWORD /d 1 /f 
    ```
    
    Unload broken OS disk:
    
    ```
    REG UNLOAD HKLM\BROKENSYSTEM
    ```

### Step 4: Rebuild the VM

Use [step 5 of the VM Repair Commands](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/repair-windows-vm-using-azure-virtual-machine-repair-commands#repair-process-example) to reassemble the VM.

If the issue is fixed, the policy has been disabled locally. For a permanent solution, don’t use CleanupProfiles policy on VMs. Use a different method to perform profile cleanups.

Don’t use this policy:

`Machine\Admin Templates\System\User Profiles\Delete user profiles older than a specified number of days on system restart`

## Next steps

If you encounter issues when you apply Windows Update, see [VM is unresponsive with "C01A001D" error when applying Windows Update](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/unresponsive-vm-apply-windows-update).