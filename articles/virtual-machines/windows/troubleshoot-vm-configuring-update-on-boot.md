---
title: VM startup is stuck on "Getting Windows Ready. Don't turn off your computer" in Azure | Microsoft Docs
description: Introduce the steps to troubleshoot the issue in which VM startup is stuck on "Getting Windows Ready. Don't turn off your computer".
services: virtual-machines-windows
documentationcenter: ''
author: Deland-Han
manager: willchen
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 9/18/2018
ms.author: delhan
---

# VM startup is stuck on "Getting Windows Ready. Don't turn off your computer" in Azure

## Symptoms

When you use **Boot diagnostics** to get the screenshot of a Virtual Machine (VM), you find the operating system does not fully start up. Additionally, the VM is displaying **Getting Windows Ready. Don't turn off your computer** message.

![Message example](..\media\troubleshoot-vm-configuring-update-on-boot\Message1.png)
![Message example](..\media\troubleshoot-vm-configuring-update-on-boot\Message2.png)

## Cause

Usually this issue occurs when the server is doing the final reboot after the configuration was changed. The configuration change could be initialized by Windows updates, or by the changes on the roles/feature of the server. In the case of the Windows Update, if the amount of the updates was big, the OS will need more time till it finishes to reconfigure the changes.

## Back up the OS disk

Before you try to fix the issue, back up the OS disk:

### For encrypted disk, you need to unlock it first

Validate if this VM is an encrypted VM. To do this, follow these steps:

1. On the portal, open your VM, and then browse to the disks.

2. You will see a column call 'Encryption" which will tell you whether the encryption is enabled or not.

If the OS Disk is encrypted, unlock the encrypted disk. To do this, follow these steps:

1. Create a Recovery VM located in the same Resource Group, Storage Account and Location of the impacted VM.

2. In Azure Portal, delete the affected VM and keep the disk.

3. Run PowerShell as administrator.

4. Run the following cmdlet to get the secret name.

    ```Powershell
    Login-AzureRmAccount
 
    $vmName = “VirtualMachineName”
    $vault = “AzureKeyVaultName”
 
    # Get the Secret for the C drive from Azure Key Vault
    Get-AzureKeyVaultSecret -VaultName $vault | where {($_.Tags.MachineName -eq $vmName) -and ($_.Tags.VolumeLetter -eq “C:\”) -and ($_.ContentType -eq ‘BEK‘)}

    # OR Use the below command to get BEK keys for all the Volumes
    Get-AzureKeyVaultSecret -VaultName $vault | where {($_.Tags.MachineName -eq   $vmName) -and ($_.ContentType -eq ‘BEK’)}
    ```

5. Once you have the Secret Name, run the following commands in PowerShell:

    ```Powershell
    $secretName = 'SecretName'
    $keyVaultSecret = Get-AzureKeyVaultSecret -VaultName $vault -Name $secretname
    $bekSecretBase64 = $keyVaultSecret.SecretValueText
    ```

6. Then, convert the Base64 encoded value to Bytes and write the output to a file. 

    **Note** The BEK file name must match the original BEK GUID if you use the USB unlock option. Also, you will need to create a folder on your C drive named BEK before the following steps will work.
   
    ```Powershell
    New-Item -ItemType directory -Path C:\BEK
    $bekFileBytes = [Convert]::FromBase64String($bekSecretbase64)
    $path = “c:\BEK\$secretName.BEK”
    [System.IO.File]::WriteAllBytes($path,$bekFileBytes)
    ```

7. Once the BEK file is created on your PC, copy it to the recovery VM you have the locked OS disk attached to Run the following using the BEK file location.

    ```Powershell
    manage-bde -status F:
    manage-bde -unlock F: -rk C:\BEKFILENAME.BEK
    ```
    **Optional** in some scenarios may be necessary also decrypting the disk with this command.
   
    ```Powershell
    manage-bde -off F:
    ```

    **Note** This is considering that the disk to encrypt is on letter F:

8. You can gather the logs by navigating to the following path: **DRIVE LETTER:\Windows\System32\winevt\Logs**.

9. Detach the drive from the recovery machine.

### Create a snapshot

To create a snapshot, follow the steps in [Snapshot a disk](snapshot-copy-managed-disk.md).

## Collect the OS dump

1. Attach the snapshot disk on a rescue VM. To do this, follow the steps in [Attach the OS disk to a recovery VM](.\troubleshoot-recovery-disks-portal.md). 

2. Check whether the OS memory dump was already created. To do this, look for the **<DRIVE>:\windows\memory.dmp** file. If there’s one with the timestamp current from the last crash, collect that file out and go the Next Step section filing a case with Microsoft and uploading that file.

3. If there’s no current memory dump file created, continue with next step.

4. Open an elevated CMD and run the following script:

    ```Bat
    reg load HKLM\BROKENSYSTEM f:\windows\system32\config\SYSTEM.hiv

    REM Enable the OS to create a memory dump file upon crash
    REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v DumpFile /t REG_EXPAND_SZ /d "%SystemRoot%\MEMORY.DMP" /f
    REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v DumpFile /t REG_EXPAND_SZ /d "%SystemRoot%\MEMORY.DMP" /f
    REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v NMICrashDump /t REG_DWORD /d 1 /f
    REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v NMICrashDump /t REG_DWORD /d 1 /f

    REM For Full memory dump
    REG ADD "HKLM\BROKENSYSTEM\ControlSet001\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 1 /f
    REG ADD "HKLM\BROKENSYSTEM\ControlSet002\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 1 /f

    REM Extra setting - Enable Serial Console
    bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /set {bootmgr} displaybootmenu yes
    bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /set {bootmgr} timeout 10
    bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /set {bootmgr} bootems yes
    bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /ems {<BOOT LOADER IDENTIFIER>} ON
    bcdedit /store <VOLUME LETTER WHERE THE BCD FOLDER IS>:\boot\bcd /emssettings EMSPORT:1 EMSBAUDRATE:115200

    reg unload HKLM\BROKENSYSTEM
    ```

    **Note** The commands assume that the disk is drive F:, if this is not your case, update the letter assignment

    For big VMs, you must ensure you don't end up in a capacity issue on the C drive because the memory.dmp size = Total memory of VM. For example E64_v3 VM = 432 GB memory dump. To fix this issue you can change the key name DumpFile above to create the file in any other drive that has enough space to hold the dump file.

5. Detach the disk.

3. After that, run the following commands in Azure PowerShell to exchange the original OS disk with the fixed disk.

    **For non-managed disks**

    ```PowerShell
    $subscriptionID = "<Subscription ID>"
    $rgname = "<Resource Group name>"
    $vmname = "<VM Name>"
    $vhduri = '<VHD URI of the fixed OS disk>'

    Add-AzureRmAccount
    Select-AzureRmSubscription -SubscriptionID $subscriptionID
    Set-AzureRmContext -SubscriptionID $subscriptionID

    $vm = Get-AzureRMVM -ResourceGroupName $rgname -Name $vmname
    $vm.StorageProfile.OsDisk.Vhd.Uri = $vhduri
    Update-AzureRmVM -ResourceGroupName $rgname -VM $vm
    ```

    **For managed disks**

    ```PowerShell
    $name = '<VM Name>'
    $resourceGroupName = '<Resource Group name>'
    $diskname='<Disk Name>'
    $diskResourceInstanceID="<Resource instance ID of the fixed disk>"
 
    #Get the VM details
    $vm = get-azurermvm -ResourceGroupName $resourceGroupName -Name $name
 
    #Set the new disk properties and update the VM
    Set-AzureRmVMOSDisk -VM $vm -Name $diskname  -ManagedDiskId $diskResourceInstanceID | Update-AzureRmVM
    ```

    **Note** The resource instance ID has the following format /subscriptions/8fbf2eee-f108-4560-9998-64e97d546777/resourceGroups/winmanagetest/providers/Microsoft.Compute/disks/swapmanagedwindows

7. Then, restart the VM and collect the dump file.

## Rebuild the VM using PowerShell

**For non-managed disks**

```PowerShell
# To login to Azure Resource Manager
Login-AzureRmAccount

# To view all subscriptions for your account
Get-AzureRmSubscription

# To select a default subscription for your current session
Get-AzureRmSubscription –SubscriptionID “SubscriptionID” | Select-AzureRmSubscription

$rgname = "RGname"
$loc = "Location"
$vmsize = "VmSize"
$vmname = "VmName"
$vm = New-AzureRmVMConfig -VMName $vmname -VMSize $vmsize;

$nic = Get-AzureRmNetworkInterface -Name ("NicName") -ResourceGroupName $rgname;
$nicId = $nic.Id;

$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nicId;

$osDiskName = "OSdiskName"
$osDiskVhdUri = "OSdiskURI"

$vm = Set-AzureRmVMOSDisk -VM $vm -VhdUri $osDiskVhdUri -name $osDiskName -CreateOption attach -Windows

New-AzureRmVM -ResourceGroupName $rgname -Location $loc -VM $vm -Verbose
```

**For managed disk**

```PowerShell
# To login to Azure Resource Manager
Login-AzureRmAccount

# To view all subscriptions for your account
Get-AzureRmSubscription

# To select a default subscription for your current session
Get-AzureRmSubscription –SubscriptionID "SubscriptionID" | Select-AzureRmSubscription

#Fill in all variables
$subid = "SubscriptionID"
$rgName = "ResourceGroupName";
$loc = "Location";
$vmSize = "VmSize";
$vmName = "VmName";
$nic1Name = "FirstNetworkInterfaceName";
#$nic2Name = "SecondNetworkInterfaceName";
$avName = "AvailabilitySetName";
$osDiskName = "OsDiskName";
$DataDiskName = "DataDiskName"

#This can be found by selecting the Managed Disks you wish you use in the Azure Portal if the format below does not match
$osDiskResouceId = "/subscriptions/$subid/resourceGroups/$rgname/providers/Microsoft.Compute/disks/$osDiskName";
$dataDiskResourceId = "/subscriptions/$subid/resourceGroups/$rgname/providers/Microsoft.Compute/disks/$DataDiskName";

$vm = New-AzureRmVMConfig -VMName $vmName -VMSize $vmSize;

#Uncomment to add Availabilty Set
#$avSet = Get-AzureRmAvailabilitySet –Name $avName –ResourceGroupName $rgName;
#$vm = New-AzureRmVMConfig -VMName $vmName -VMSize $vmSize -AvailabilitySetId $avSet.Id;

#Get NIC Resource Id and add
$nic1 = Get-AzureRmNetworkInterface -Name $nic1Name -ResourceGroupName $rgName;
$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic1.Id -Primary;

#Uncomment to add a secondary NIC
#$nic2 = Get-AzureRmNetworkInterface -Name $nic2Name -ResourceGroupName $rgName;
#$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic2.Id;

#Windows VM
$vm = Set-AzureRmVMOSDisk -VM $vm -ManagedDiskId $osDiskResouceId -name $osDiskName -CreateOption Attach -Windows;

#Linux VM
#$vm = Set-AzureRmVMOSDisk -VM $vm -ManagedDiskId $osDiskResouceId -name $osDiskName -CreateOption Attach -Linux;

#Uncomment to add additnal Data Disk
#Add-AzureRmVMDataDisk -VM $vm -ManagedDiskId $dataDiskResourceId -Name $dataDiskName -Caching None -DiskSizeInGB 1024 -Lun 0 -CreateOption Attach;

New-AzureRmVM -ResourceGroupName $rgName -Location $loc -VM $vm;
```

## Next steps

After you collect the dump file, contact [Microsoft support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to analysis the root cause.