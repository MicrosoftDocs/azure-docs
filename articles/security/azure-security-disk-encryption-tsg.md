---
title: Azure Disk Encryption troubleshooting| Microsoft Docs
description: This article provides troubleshooting tips for Microsoft Azure Disk Encryption for Windows and Linux IaaS VMs.
services: security
documentationcenter: na
author: deventiwari
manager: avibm
editor: yuridio

ms.assetid: ce0e23bd-07eb-43af-a56c-aa1a73bdb747
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/27/2017
ms.author: devtiw

---
# Azure Disk Encryption troubleshooting guide

This guide is for IT professionals, information security analysts, and cloud administrators whose organizations use Azure Disk Encryption and need guidance to troubleshoot disk-encryption-related issues.

## Troubleshooting Linux OS disk encryption

Linux operating system (OS) disk encryption must unmount the OS drive prior to running it through the full disk encryption process. If it cannot unmount the drive, an error message of *failed to unmount after …* is likely to occur.

This error is most likely to happen when OS disk encryption is attempted on a target VM environment that has been modified or changed from its supported stock gallery image. Examples of deviations from the supported image that can interfere with the extension’s ability to unmount the OS drive include the following:
- There are customized images that no longer match a supported file system or partitioning scheme.
- Large applications, such as SAP, MongoDB, or Apache Cassandra, are installed and running in the OS prior to encryption. The extension is unable to properly shut these down. If the applications maintain open file handles to the OS drive, the drive cannot be unmounted, and this causes failure.
- Custom scripts are being run in close time proximity to the encryption being enabled. This can also occur if any other changes are being made on the VM during the encryption process. This can happen when an Azure Resource Manager template defines multiple extensions to execute simultaneously, or when a custom script extension or other action is run simultaneously with disk encryption. Serializing and isolating such steps might resolve the issue.
- Security Enhanced Linux (SELinux) has not been disabled prior to enabling encryption, so the unmount step fails. SELinux can be reenabled after encryption has completed.
- The OS disk uses a Logical Volume Manager (LVM) scheme (although limited LVM data disk support is available, a LVM OS disk is not).
- Minimum memory requirements are not met (7 GB is suggested for OS disk encryption).
- Data drives have been recursively mounted under the /mnt/ directory, or each other (for example, /mnt/data1, /mnt/data2, /data3 + /data3/data4).
- Other Azure Disk Encryption [prerequisites](https://docs.microsoft.com/en-us/azure/security/azure-security-disk-encryption) for Linux are not met.

## Unable to encrypt

In some cases, the Linux disk encryption appears to be stuck at "OS disk encryption started" and SSH is disabled. The encryption process can take between 3-16 hours to complete on a stock gallery image. If multi-terabyte-sized data disks are added, the process might take days. The Linux OS disk encryption sequence unmounts the OS drive temporarily, and then performs block-by-block encryption of the entire OS disk, before it remounts it in its encrypted state. Unlike Azure Disk Encryption on Windows, Linux disk encryption does not allow for concurrent use of the VM while the encryption is in progress. The performance characteristics of the VM, including the size of the disk and whether the storage account is backed by standard or premium (SSD) storage, can make a big difference in the time required to complete encryption.

To check the encryption status, poll the **ProgressMessage** field returned from the [Get-AzureRmVmDiskEncryptionStatus](https://docs.microsoft.com/powershell/module/azurerm.compute/get-azurermvmdiskencryptionstatus) command. While the OS drive is being encrypted, the VM enters a servicing state, and SSH is also disabled to prevent any disruption to the ongoing process. The **EncryptionInProgress** message will be reported for the majority of the time while the encryption is in progress, followed several hours later with a **VMRestartPending** message prompting you to restart the VM. For example:


```
PS > Get-AzureRmVMDiskEncryptionStatus -ResourceGroupName $resourceGroupName -VMName $vmName
OsVolumeEncrypted          : EncryptionInProgress
DataVolumesEncrypted       : EncryptionInProgress
OsVolumeEncryptionSettings : Microsoft.Azure.Management.Compute.Models.DiskEncryptionSettings
ProgressMessage            : OS disk encryption started

PS > Get-AzureRmVMDiskEncryptionStatus -ResourceGroupName $resourceGroupName -VMName $vmName
OsVolumeEncrypted          : VMRestartPending
DataVolumesEncrypted       : Encrypted
OsVolumeEncryptionSettings : Microsoft.Azure.Management.Compute.Models.DiskEncryptionSettings
ProgressMessage            : OS disk successfully encrypted, please reboot the VM
```

After prompted to reboot the VM, and after restarting the VM, you must wait 2-3 minutes for the reboot and for final steps to be performed on the target. When finished, the status message will indicate that encryption has finally completed. After this message is available, the encrypted OS drive is expected to be ready for use and the VM is ready to be used again.

In the following cases, we recommended that you restore the VM back to the snapshot or backup taken immediately prior to encryption:
   - If the sequence described previously does not happen.
   - If the boot information, progress message, or other error indicators report that OS encryption has failed in the middle of this process. For example, if you are seeing the *failed to unmount* error described in this guide.

Prior to the next attempt, we suggest that you reevaluate the characteristics of the VM and ensure that all of the prerequisites are satisfied.

## Troubleshooting Azure Disk Encryption behind a firewall
When connectivity is restricted by a firewall, proxy requirement, or network security group (NSG) settings, the ability of the extension to perform needed tasks can be disrupted. This can result in status messages, such as *Extension status not available on the VM*, and in certain scenarios the encryption will fail to finish. The sections that follow have some common firewall issues that you might investigate.

### Network security groups
Any network security group settings that are applied must still allow the endpoint to meet the documented network configuration [prerequisites](https://docs.microsoft.com/azure/security/azure-security-disk-encryption#prerequisites) for disk encryption.

### Azure Key Vault behind a firewall
The VM must be able to access a key vault. Refer to guidance on access to the key vault from behind a firewall that is maintained by the [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-access-behind-firewall) team.

### Linux package management behind a firewall
At runtime, Azure Disk Encryption for Linux relies on the target distribution’s package management system to install the prerequisite components needed prior to enabling encryption. If the firewall settings prevent the VM from being able to download and install these components, then subsequent failures are expected. The steps to configure this can vary by distribution. On Red Hat, when a proxy is required, it is vital that you ensure that the subscription-manager and yum are set up properly. For further information, see [How to troubleshoot subscription-manager and yum issues](https://access.redhat.com/solutions/189533).  

## Troubleshooting Windows Server 2016 Server Core

On a system with a Windows Server 2016 Server Core installation, the **bdehdcfg** component is not available by default. This component is required by Azure Disk Encryption.

**To add the bdehdcfg component**
   1. Copy the following four files from a Windows Server 2016 data center VM to the **c:\windows\system32** folder of the Server Core image:

```
bdehdcfg.exe
bdehdcfglib.dll
bdehdcfglib.dll.mui
bdehdcfg.exe.mui
```

   2. Then, enter the following command:

```
bdehdcfg.exe -target default
```

   3. This will create a 550 MB system partition. Reboot the system. 
   
   4. Use DiskPart to check the volumes, and then proceed.  

For example:

```
DISKPART> list vol

  Volume ###  Ltr  Label        Fs     Type        Size     Status     Info
  ----------  ---  -----------  -----  ----------  -------  ---------  --------
  Volume 0     C                NTFS   Partition    126 GB  Healthy    Boot
  Volume 1                      NTFS   Partition    550 MB  Healthy    System
  Volume 2     D   Temporary S  NTFS   Partition     13 GB  Healthy    Pagefile
```
## Next steps
In this document, you learned more about some common issues in the Azure Disk Encryption solution and how to troubleshoot those issues. For more information about this service and its capabilities, see the following articles:

- [Apply disk encryption in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-apply-disk-encryption)
- [Encrypt an Azure Virtual Machine](https://docs.microsoft.com/azure/security-center/security-center-disk-encryption)
- [Azure data encryption at rest](https://docs.microsoft.com/azure/security/azure-security-encryption-atrest)
