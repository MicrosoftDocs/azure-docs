---
title: How to verify encryption status for Linux 
description: This article provides instructions on verifying the encryption status from platform and OS level.
author: kailashmsft
ms.service: security
ms.topic: article
ms.author: kaib
ms.date: 03/11/2020

ms.custom: seodec18

---



# How to verify encryption status for Linux 

**This scenario is applicable to ADE dual-pass and single-pass extensions.**  
This Document scope is to validate the encryption status of a virtual machine using different methods.

### Environment

- Linux distributions

### Procedure

1. A virtual machine has been encrypted using dual-pass or single-pass.
2. Once the encryption process is triggered (in progress) or has been completed, we can validate the encryption status using different methods defined below

### Verification

The encryption status validation can be done from the Portal, PowerShell, AZ CLI and/or within the VM (OS side). Below the different validations methods:

## Using the Portal:

- You can validate the encryption status of a virtual machine by taking a look at the extensions blade in the corresponding virtual machine from the Portal.
Inside the **Extensions** blade, you will see the ADE extension listed. You can click it and take a look at the **status message** which will indicate the current encryption status:

![Portal check number 1](./media/disk-encryption/verify-encryption-linux/portal-check-001.png)

In the list of extensions, you will also be able to see the corresponding ADE extension version. Version 0.x corresponds to ADE Dual-Pass and version 1.x corresponds to ADE Single-pass
You can also get further details clicking on the extension and then on *View detailed status*, once that's done, you will be able to see a more detailed status of the encryption process in json format as shown in the image below:

![Portal check number 2](./media/disk-encryption/verify-encryption-linux/portal-check-002.png)

![Portal check number 3](./media/disk-encryption/verify-encryption-linux/portal-check-003.png)

- Another way of validating the encryption status is by taking a look at the **Disks** blade. Over there, you get to see if encryption is enabled on each disk attached to a particular VM.

![Portal check number 4](./media/disk-encryption/verify-encryption-linux/portal-check-004.png)

>[!NOTE] 
> As a warning, this status is not too accurate. This just means the disks have encryption settings stamped but not that they were actually encrypted at OS level. Unfortunately by the way the ADE extension design works today, the disks get stamped first and encrypted later. If the encryption process fails, the disks may end up stamped but not encrypted. To confirm if the disks are truly encrypted, you can double check the encryption of each disk at OS level, following instructions in one of the upcoming sections.

## Using PowerShell:

You can validate the **general** encryption status of an encrypted VM using the following PowerShell commands:

```azurepowershell
   $VMNAME="VMNAME"
   $RGNAME="RGNAME"
   Get-AzVmDiskEncryptionStatus -ResourceGroupName  ${RGNAME} -VMName ${VMNAME}
```

>[!NOTE]
> Replace the "VMNAME" and "RGNAME" variables accordingly

![verify status PowerShell 1](./media/disk-encryption/verify-encryption-linux/verify-status-ps-01.png)

You can capture the encryption settings from each individual disk using the following PowerShell commands:

**Single-Pass:**
In the case of single-pass the encryption settings are stamped in each of the disks (OS and Data).
You can capture the OS disk encryption settings in single pass as follows:

``` powershell
$RGNAME = "RGNAME"
$VMNAME = "VMNAME"

$VM = Get-AzVM -Name ${VMNAME} -ResourceGroupName ${RGNAME}  
 $Sourcedisk = Get-AzDisk -ResourceGroupName ${RGNAME} -DiskName $VM.StorageProfile.OsDisk.Name
 Write-Host "============================================================================================================================================================="
 Write-Host "Encryption Settings:"
 Write-Host "============================================================================================================================================================="
 Write-Host "Enabled:" $Sourcedisk.EncryptionSettingsCollection.Enabled
 Write-Host "Version:" $Sourcedisk.EncryptionSettingsCollection.EncryptionSettingsVersion
 Write-Host "Source Vault:" $Sourcedisk.EncryptionSettingsCollection.EncryptionSettings.DiskEncryptionKey.SourceVault.Id
 Write-Host "Secret URL:" $Sourcedisk.EncryptionSettingsCollection.EncryptionSettings.DiskEncryptionKey.SecretUrl
 Write-Host "Key URL:" $Sourcedisk.EncryptionSettingsCollection.EncryptionSettings.KeyEncryptionKey.KeyUrl
 Write-Host "============================================================================================================================================================="
```

![Verify OS Single pass 01](./media/disk-encryption/verify-encryption-linux/verify-os-single-ps-001.png)

In case the disk does not have encryption settings stamped, the output will be empty as shown below:

![OS Encryption settings 2](./media/disk-encryption/verify-encryption-linux/os-encryption-settings-2.png)

>[!NOTE]
> Replace the $VMNAME and $RGNAME variables accordingly

Capture Data disk(s) encryption settings:

```azurepowershell
$RGNAME = "RGNAME"
$VMNAME = "VMNAME"

$VM = Get-AzVM -Name ${VMNAME} -ResourceGroupName ${RGNAME}
 clear
 foreach ($i in $VM.StorageProfile.DataDisks|ForEach-Object{$_.Name})
 {
 Write-Host "============================================================================================================================================================="
 Write-Host "Encryption Settings:"
 Write-Host "============================================================================================================================================================="
 Write-Host "Checking Disk:" $i
 $Disk=(Get-AzDisk -ResourceGroupName ${RGNAME} -DiskName $i)
 Write-Host "Encryption Enable: " $Sourcedisk.EncryptionSettingsCollection.Enabled
 Write-Host "Encryption KeyEncryptionKey: " $Sourcedisk.EncryptionSettingsCollection.EncryptionSettings.KeyEncryptionKey.KeyUrl;
 Write-Host "Encryption DiskEncryptionKey: " $Sourcedisk.EncryptionSettingsCollection.EncryptionSettings.DiskEncryptionKey.SecretUrl;
 Write-Host "============================================================================================================================================================="
 }
```

![Verify data single ps 001](./media/disk-encryption/verify-encryption-linux/verify-data-single-ps-001.png)

>[!NOTE]
> Replace the "VMNAME" and "RGNAME" variables accordingly

**Dual-Pass**:
In the case of dual pass, the encryption settings are stamped in the VM model and not on in individual disk.

To verify the encryption settings were stamped in dual-pass you can use the following commands:

```azurepowershell
$RGNAME = "RGNAME"
$VMNAME = "VMNAME"

$vm = Get-AzVm -ResourceGroupName ${RGNAME} -Name ${VMNAME};
$Sourcedisk = Get-AzDisk -ResourceGroupName ${RGNAME} -DiskName $VM.StorageProfile.OsDisk.Name
clear
Write-Host "============================================================================================================================================================="
Write-Host "Encryption Settings:"
Write-Host "============================================================================================================================================================="
Write-Host "Enabled:" $Sourcedisk.EncryptionSettingsCollection.Enabled
Write-Host "Version:" $Sourcedisk.EncryptionSettingsCollection.EncryptionSettingsVersion
Write-Host "Source Vault:" $Sourcedisk.EncryptionSettingsCollection.EncryptionSettings.DiskEncryptionKey.SourceVault.Id
Write-Host "Secret URL:" $Sourcedisk.EncryptionSettingsCollection.EncryptionSettings.DiskEncryptionKey.SecretUrl
Write-Host "Key URL:" $Sourcedisk.EncryptionSettingsCollection.EncryptionSettings.KeyEncryptionKey.KeyUrl
Write-Host "============================================================================================================================================================="
```

>[!NOTE]
> Replace the "VMNAME" and "RGNAME" variables accordingly

![Verify dual pass PowerShell  1](./media/disk-encryption/verify-encryption-linux/verify-dual-ps-001.png)

## Using AZ CLI:

You can validate the **general** encryption status of an encrypted VM using the following AZ CLI commands:

```bash
VMNAME="VMNAME"
RGNAME="RGNAME"
az vm encryption show --name ${VMNAME} --resource-group ${RGNAME} --query "substatus"
```

>[!NOTE] 
> Replace the "VMNAME" and "RGNAME" variables accordingly

![Verify general using CLI ](./media/disk-encryption/verify-encryption-linux/verify-gen-cli.png)

Single Pass:
You can validate the encryption settings from each individual disk using the following AZ CLI commands:

```bash
az vm encryption show -g ${RGNAME} -n ${VMNAME} --query "disks[*].[name, statuses[*].displayStatus]"  -o table
```

>[!NOTE]
> Replace the $VMNAME and $RGNAME variables accordingly

![Data encryption settings](./media/disk-encryption/verify-encryption-linux/data-encryption-settings-2.png)

>[!IMPORTANT]
> In case the disk does not have encryption settings stamped, it will be shown as 
  "Disk is  not encrypted"

Detailed Status and Encryption settings:

OS Disk:

```bash
RGNAME="RGNAME"
VMNAME="VNAME"

disk=`az vm show -g ${RGNAME} -n ${VMNAME} --query storageProfile.osDisk.name -o tsv`
for disk in $disk; do \
echo "============================================================================================================================================================="
echo -ne "Disk Name: "; az disk show -g ${RGNAME} -n ${disk} --query name -o tsv; \
echo -ne "Encryption Enabled: "; az disk show -g ${RGNAME} -n ${disk} --query encryptionSettingsCollection.enabled -o tsv; \
echo -ne "Disk Encryption Key: "; az disk show -g ${RGNAME} -n ${disk} --query encryptionSettingsCollection.encryptionSettings[].diskEncryptionKey.secretUrl -o tsv; \
echo -ne "key Encryption Key: "; az disk show -g ${RGNAME} -n ${disk} --query encryptionSettingsCollection.encryptionSettings[].keyEncryptionKey.keyUrl -o tsv; \
echo "============================================================================================================================================================="
done
```

![OSSingleCLI](./media/disk-encryption/verify-encryption-linux/os-single-cli.png)

Data Disks:

```bash
RGNAME="RGNAME"
VMNAME="VMNAME"
az vm encryption show --name ${VMNAME} --resource-group ${RGNAME} --query "substatus"

for disk in `az vm show -g ${RGNAME} -n ${VMNAME} --query storageProfile.dataDisks[].name -o tsv`; do \
echo "============================================================================================================================================================="
echo -ne "Disk Name: "; az disk show -g ${RGNAME} -n ${disk} --query name -o tsv; \
echo -ne "Encryption Enabled: "; az disk show -g ${RGNAME} -n ${disk} --query encryptionSettingsCollection.enabled -o tsv; \
echo -ne "Disk Encryption Key: "; az disk show -g ${RGNAME} -n ${disk} --query encryptionSettingsCollection.encryptionSettings[].diskEncryptionKey.secretUrl -o tsv; \
echo -ne "key Encryption Key: "; az disk show -g ${RGNAME} -n ${disk} --query encryptionSettingsCollection.encryptionSettings[].keyEncryptionKey.keyUrl -o tsv; \
echo "============================================================================================================================================================="
done
```

![Data single CLI ](./media/disk-encryption/verify-encryption-linux/data-single-cli.png)

Dual Pass:

``` bash
az vm encryption show --name ${VMNAME} --resource-group ${RGNAME} -o table
```

![Verify general dual using CLI ](./media/disk-encryption/verify-encryption-linux/verify-gen-dual-cli.png)
You can also check the Encryption settings on the VM Model Storage profile of the OS disk:

```bash
disk=`az vm show -g ${RGNAME} -n ${VMNAME} --query storageProfile.osDisk.name -o tsv`
for disk in $disk; do \
echo "============================================================================================================================================================="
echo -ne "Disk Name: "; az disk show -g ${RGNAME} -n ${disk} --query name -o tsv; \
echo -ne "Encryption Enabled: "; az disk show -g ${RGNAME} -n ${disk} --query encryptionSettingsCollection.enabled -o tsv; \
echo -ne "Disk Encryption Key: "; az disk show -g ${RGNAME} -n ${disk} --query encryptionSettingsCollection.encryptionSettings[].diskEncryptionKey.secretUrl -o tsv; \
echo -ne "key Encryption Key: "; az disk show -g ${RGNAME} -n ${disk} --query encryptionSettingsCollection.encryptionSettings[].keyEncryptionKey.keyUrl -o tsv; \
echo "============================================================================================================================================================="
done
```

![Verify vm profile dual using CLI ](./media/disk-encryption/verify-encryption-linux/verify-vm-profile-dual-cli.png)

## From the Linux VM OS:
Validate if the data disk partitions are encrypted (and the OS disk is not). When a partition/disk is encrypted it's displayed as **crypt** type, when it's not encrypted it is displayed as **part/disk** type

``` bash
lsblk
```

![Os Crypt layer ](./media/disk-encryption/verify-encryption-linux/verify-os-crypt-layer.png)

You can get further details using the following "lsblk" variant. Using this one, you'll see a **crypt** type layer that is mounted by the extension, the following example shows Logical Volumes and normal disks having a **crypto\_LUKS FSTYPE**.

```bash
lsblk -o NAME,TYPE,FSTYPE,LABEL,SIZE,RO,MOUNTPOINT
```
![Os Crypt layer 2](./media/disk-encryption/verify-encryption-linux/verify-os-crypt-layer-2.png)

As an extra step, you can also validate if the data disk has any dmcrypt keys loaded

``` bash
cryptsetup luksDump /dev/VGNAME/LVNAME
```

``` bash
cryptsetup luksDump /dev/sdd1
```

And which dm devices are listed as crypt

```bash
dmsetup ls --target crypt
```

## Next Steps

- [Azure Disk Encryption troubleshooting](disk-encryption-troubleshooting.md)