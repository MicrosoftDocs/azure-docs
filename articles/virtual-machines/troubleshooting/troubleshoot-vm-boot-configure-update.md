---
title: VM startup is stuck on "Getting Windows ready. Don't turn off your computer" in Azure | Microsoft Docs
description: Introduce the steps to troubleshoot the issue in which VM startup is stuck on "Getting Windows ready. Don't turn off your computer."
services: virtual-machines-windows
documentationcenter: ''
author: Deland-Han
manager: dcscontentpm
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows

ms.topic: article
ms.date: 09/18/2018
ms.author: delhan
---

# VM startup is stuck on "Getting Windows ready. Don't turn off your computer" in Azure

This article describes the "Getting ready" and "Getting Windows ready" screens that you may encounter when you boot a Windows virtual machine (VM) in Microsoft Azure. It provides steps to help you collect data for a support ticket.

[!INCLUDE [updated-for-az.md](../../../includes/updated-for-az.md)]

## Symptoms

A Windows VM does not boot. When you use **Boot diagnostics** to get the screenshot of the VM, you may see that the VM displays the message "Getting ready" or "Getting Windows ready".

![Message example for Windows Server 2012 R2](./media/troubleshoot-vm-configure-update-boot/message1.png)

![Message example](./media/troubleshoot-vm-configure-update-boot/message2.png)

## Cause

Usually this issue occurs when the server is doing the final reboot after the configuration was changed. The configuration change might be initialized by Windows updates or by the changes on the roles/feature of the server. For Windows Update, if the size of the updates was large, the operating system needs more time to reconfigure the changes.

## Back up the OS disk

Before you try to fix the issue, back up the OS disk.

### For VMs with an encrypted disk, you must unlock the disks first

Follow these steps to determine whether the VM is an encrypted VM.

1. On the Azure portal, open your VM, and then browse to the disks.

2. Look at the **Encryption** column to see whether encryption is enabled.

If the OS disk is encrypted, unlock the encrypted disk. To unlock the disk, follow these steps.

1. Create a Recovery VM that's located in the same Resource Group, Storage Account, and Location as the affected VM.

2. In the Azure portal, delete the affected VM and keep the disk.

3. Run PowerShell as an administrator.

4. Run the following cmdlet to get the secret name.

    ```Powershell
    Login-AzAccount
 
    $vmName = “VirtualMachineName”
    $vault = “AzureKeyVaultName”
 
    # Get the Secret for the C drive from Azure Key Vault
    Get-AzureKeyVaultSecret -VaultName $vault | where {($_.Tags.MachineName -eq $vmName) -and ($_.Tags.VolumeLetter -eq “C:\”) -and ($_.ContentType -eq ‘BEK‘)}

    # OR Use the below command to get BEK keys for all the Volumes
    Get-AzureKeyVaultSecret -VaultName $vault | where {($_.Tags.MachineName -eq   $vmName) -and ($_.ContentType -eq ‘BEK’)}
    ```

5. After you have the secret name, run the following commands in PowerShell.

    ```Powershell
    $secretName = 'SecretName'
    $keyVaultSecret = Get-AzureKeyVaultSecret -VaultName $vault -Name $secretname
    $bekSecretBase64 = $keyVaultSecret.SecretValueText
    ```

6. Convert the Base64-encoded value to bytes, and write the output to a file. 

    > [!Note]
    > If you use the USB unlock option, the BEK file name must match the original BEK GUID. Create a folder on your C drive named "BEK" before you follow these steps.
    
    ```Powershell
    New-Item -ItemType directory -Path C:\BEK
    $bekFileBytes = [Convert]::FromBase64String($bekSecretbase64)
    $path = “c:\BEK\$secretName.BEK”
    [System.IO.File]::WriteAllBytes($path,$bekFileBytes)
    ```

7. After the BEK file is created on your PC, copy the file to the recovery VM you have the locked OS disk attached to. Run the following commands by using the BEK file location.

    ```Powershell
    manage-bde -status F:
    manage-bde -unlock F: -rk C:\BEKFILENAME.BEK
    ```
    **Optional**: In some scenarios, it might be necessary to decrypt the disk by using this command.
   
    ```Powershell
    manage-bde -off F:
    ```

    > [!Note]
    > The previous command assumes the disk to encrypt is on letter F.

8. If you need to collect logs, go to the path **DRIVE LETTER:\Windows\System32\winevt\Logs**.

9. Detach the drive from the recovery machine.

## Collect an OS memory dump

If the issue does not resolve after waiting for the changes to process, you would need to collect a memory dump file and contact support. To collect the Dump file, follow these steps:

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
4. Start the VM and access the Serial Console.
5. Select **Send Non-Maskable Interrupt(NMI)** to trigger the memory dump.
    ![the image about where to send Non-Maskable Interrupt](./media/troubleshoot-vm-configure-update-boot/run-nmi.png)
6. Attach the OS disk to a recovery VM again, collect dump file.

## Contact Microsoft support

After you collect the dump file, contact [Microsoft support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to analyze the root cause.