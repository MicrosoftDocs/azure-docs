---
title: Azure virtual machine is unresponsive when applying policy
description: This article provides steps to resolve issues where the load screen doesn't respond when applying a policy during startup in an Azure VM.
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

# VM is unresponsive when applying Group Policy Local Users and Groups policy

This article provides steps to resolve issues where the load screen doesn't respond when an Azure virtual machine (VM) applies a policy during startup.

## Symptoms

When you're using [boot diagnostics](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/boot-diagnostics) to view a screenshot of the VM, the screen is stuck loading with the message: "Applying Group Policy Local Users and Groups policy."

:::image type="content" source="media//unresponsive-vm-apply-group-policy/applying-group-policy-1.png" alt-text="Screenshot of Applying Group Policy Local Users and Groups policy loading (Windows Server 2012 R2).":::

:::image type="content" source="media/unresponsive-vm-apply-group-policy/applying-group-policy-2.png" alt-text="Screenshot of Applying Group Policy Local Users and Groups policy loading (Windows Server 2012).":::

## Cause

There are conflicting locks when the policy attempts to clean up old user profiles.

> [!NOTE]
> This applies only to Windows Server 2012 and Windows Server 2012 R2.

Here’s the problematic policy:

`Computer Configuration\Policies\Administrative Templates\System/User Profiles\Delete user profiles older than a specified number of days on system restart`

## Resolution

### Process overview

1. [Create and access a repair VM](#step-1-create-and-access-a-repair-vm)
1. [Disable the policy](#step-2-disable-the-policy)
1. [Enable serial console and memory dump collection](#step-3-enable-serial-console-and-memory-dump-collection)
1. [Rebuild the VM](#step-4-rebuild-the-vm)

> [!NOTE]
> If you encounter this boot error, the guest OS isn't operational. You must troubleshoot in Offline mode.

### Step 1: Create and access a repair VM

1. Use [steps 1-3 of the VM repair commands](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/repair-windows-vm-using-azure-virtual-machine-repair-commands#repair-process-example) to prepare a repair VM.
2. Use Remote Desktop Connection to connect to the repair VM.

### Step 2: Disable the policy

1. On the repair VM, open the Registry Editor.
1. Locate the key **HKEY_LOCAL_MACHINE** and select **File** > **Load Hive** from the menu.

    :::image type="content" source="media/unresponsive-vm-apply-group-policy/registry.png" alt-text="Screenshot shows highlighted HKEY_LOCAL_MACHINE and the menu containing Load Hive.":::

    - You can use Load Hive to load registry keys from an offline system. In this case, the system is the broken disk attached to the repair VM.
    - System-wide settings are stored on `HKEY_LOCAL_MACHINE` and can be abbreviated as "HKLM."
1. In the attached disk, go to the `\windows\system32\config\SOFTWARE` file and open it.

    1. When you're prompted for a name, enter BROKENSOFTWARE.
    1. To verify that BROKENSOFTWARE was loaded, expand **HKEY_LOCAL_MACHINE** and look for the added BROKENSOFTWARE key.
1. Go to BROKENSOFTWARE and check if the CleanupProfile key exists in the loaded hive.

    1. If the key exists, the CleanupProfile policy is set. Its value represents the retention policy measured in days. Continue deleting the key.
    1. If the key doesn't exist, the CleanupProfile policy isn't set. [Submit a support ticket](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade), including the memory.dmp file located in the Windows directory of the attached OS disk.

1. Delete the CleanupProfiles key by using this command:

    ```
    reg delete "HKLM\BROKENSOFTWARE\Policies\Microsoft\Windows\System" /v CleanupProfiles /f
    ```
1.	Unload the BROKENSOFTWARE hive by using this command:

    ```
    reg unload HKLM\BROKENSOFTWARE
    ```

### Step 3: Enable serial console and memory dump collection

To enable memory dump collection and the serial console, run this script:

1. Open an elevated command prompt session. (Run as administrator.)
1. Run these commands to enable the serial console:
    
    ```
    bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /ems {<BOOT LOADER IDENTIFIER>} ON
    ```

    ```
    bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /emssettings EMSPORT:1 EMSBAUDRATE:115200
    ```
1. Verify if the free space on the OS disk is at least equal to the VM's memory size (RAM).

    If there isn't enough space on the OS disk, change the memory dump location and refer it to an attached data disk with enough free space. To change the location, replace "%SystemRoot%" with the drive letter (for example, "F:") of the data disk in the following commands.

    **Suggested configuration to enable OS dump**

    Load broken OS disk:

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

Use [step 5 of the VM repair commands](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/repair-windows-vm-using-azure-virtual-machine-repair-commands#repair-process-example) to reassemble the VM.

If the issue is fixed, the policy is now disabled locally. For a permanent solution, don't use the CleanupProfiles policy on VMs. Use a different method to perform profile cleanups.

Don’t use this policy:

`Machine\Admin Templates\System\User Profiles\Delete user profiles older than a specified number of days on system restart`

## Next steps

If you have issues when you apply Windows Update, see [VM is unresponsive with "C01A001D" error when applying Windows Update](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/unresponsive-vm-apply-windows-update).
