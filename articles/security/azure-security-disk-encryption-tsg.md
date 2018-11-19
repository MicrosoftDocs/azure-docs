---
title: Azure Disk Encryption troubleshooting| Microsoft Docs
description: This article provides troubleshooting tips for Microsoft Azure Disk Encryption for Windows and Linux IaaS VMs.
author: mestew
ms.service: security
ms.subservice: Azure Disk Encryption
ms.topic: article
ms.author: mstewart
ms.date: 09/10/2018

---
# Azure Disk Encryption troubleshooting guide

This guide is for IT professionals, information security analysts, and cloud administrators whose organizations use Azure Disk Encryption. This article is to help with troubleshooting disk-encryption-related problems.

## Troubleshooting Linux OS disk encryption

Linux operating system (OS) disk encryption must unmount the OS drive before running it through the full disk encryption process. If it can't unmount the drive, an error message of "failed to unmount after …" is likely to occur.

This error can occur when OS disk encryption is tried on a target VM environment that has been changed from the supported stock gallery image. Deviations from the supported image can interfere with the extension’s ability to unmount the OS drive. Examples of deviations can include the following items:
- Customized images no longer match a supported file system or partitioning scheme.
- Large applications such as SAP, MongoDB, Apache Cassandra, and Docker aren't supported when they're installed and running in the OS before encryption. Azure Disk Encryption is unable to shut down these processes safely as required in preparation of the OS drive for disk encryption. If there are still active processes holding open file handles to the OS drive, the OS drive can't be unmounted, resulting in a failure to encrypt the OS drive. 
- Custom scripts that run in close time proximity to the encryption being enabled, or if any other changes are being made on the VM during the encryption process. This conflict can happen when an Azure Resource Manager template defines multiple extensions to execute simultaneously, or when a custom script extension or other action runs simultaneously to disk encryption. Serializing and isolating such steps might resolve the issue.
- Security Enhanced Linux (SELinux) hasn't been disabled before enabling encryption, so the unmount step fails. SELinux can be reenabled after encryption is complete.
- The OS disk uses a Logical Volume Manager (LVM) scheme. Although limited LVM data disk support is available, an LVM OS disk isn't.
- Minimum memory requirements aren't met (7 GB is suggested for OS disk encryption).
- Data drives are recursively mounted under the /mnt/ directory, or each other (for example, /mnt/data1, /mnt/data2, /data3 + /data3/data4).
- Other Azure Disk Encryption [prerequisites](azure-security-disk-encryption-prerequisites.md) for Linux aren't met.

## Unable to encrypt

In some cases, the Linux disk encryption appears to be stuck at "OS disk encryption started" and SSH is disabled. The encryption process can take between 3-16 hours to finish on a stock gallery image. If multi-terabyte-sized data disks are added, the process might take days.

The Linux OS disk encryption sequence unmounts the OS drive temporarily. It then performs block-by-block encryption of the entire OS disk, before it remounts it in its encrypted state. Unlike Azure Disk Encryption on Windows, Linux Disk Encryption doesn't allow for concurrent use of the VM while the encryption is in progress. The performance characteristics of the VM can make a significant difference in the time required to complete encryption. These characteristics include the size of the disk and whether the storage account is standard or premium (SSD) storage.

To check the encryption status, poll the **ProgressMessage** field returned from the [Get-AzureRmVmDiskEncryptionStatus](/powershell/module/azurerm.compute/get-azurermvmdiskencryptionstatus) command. While the OS drive is being encrypted, the VM enters a servicing state, and disables SSH to prevent any disruption to the ongoing process. The **EncryptionInProgress** message reports for the majority of the time while the encryption is in progress. Several hours later, a **VMRestartPending** message prompts you to restart the VM. For example:


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

After you're prompted to reboot the VM, and after the VM restarts, you must wait 2-3 minutes for the reboot and for the final steps to be performed on the target. The status message changes when the encryption is finally complete. After this message is available, the encrypted OS drive is expected to be ready for use and the VM is ready to be used again.

In the following cases, we recommend that you restore the VM back to the snapshot or backup taken immediately before encryption:
   - If the reboot sequence, described previously, doesn't happen.
   - If the boot information, progress message, or other error indicators report that OS encryption has failed in the middle of this process. An example of a message is the "failed to unmount" error that is described in this guide.

Before the next attempt, reevaluate the characteristics of the VM and make sure that all of the prerequisites are satisfied.

## Troubleshooting Azure Disk Encryption behind a firewall
When connectivity is restricted by a firewall, proxy requirement, or network security group (NSG) settings, the ability of the extension to perform needed tasks might be disrupted. This disruption can result in status messages such as "Extension status not available on the VM." In expected scenarios, the encryption fails to finish. The sections that follow have some common firewall problems that you might investigate.

### Network security groups
Any network security group settings that are applied must still allow the endpoint to meet the documented network configuration [prerequisites](azure-security-disk-encryption-prerequisites.md#bkmk_GPO) for disk encryption.

### Azure Key Vault behind a firewall
The VM must be able to access a key vault. Refer to guidance on access to the key vault from behind a firewall that the [Azure Key Vault](../key-vault/key-vault-access-behind-firewall.md) team maintains. 

### Linux package management behind a firewall

At runtime, Azure Disk Encryption for Linux relies on the target distribution’s package management system to install needed prerequisite components before enabling encryption. If the firewall settings prevent the VM from being able to download and install these components, then subsequent failures are expected. The steps to configure this package management system can vary by distribution. On Red Hat, when a proxy is required, you must make sure that the subscription-manager and yum are set up properly. For more information, see [How to troubleshoot subscription-manager and yum problems](https://access.redhat.com/solutions/189533).  


## Troubleshooting Windows Server 2016 Server Core

On Windows Server 2016 Server Core, the bdehdcfg component isn't available by default. This component is required by Azure Disk Encryption. It's used to split the system volume from OS volume, which is done only once for the life time of the VM. These binaries aren't required during later encryption operations.

To work around this issue, copy the following four files from a Windows Server 2016 Data Center VM to the same location on Server Core:

   ```
   \windows\system32\bdehdcfg.exe
   \windows\system32\bdehdcfglib.dll
   \windows\system32\en-US\bdehdcfglib.dll.mui
   \windows\system32\en-US\bdehdcfg.exe.mui
   ```

   2. Enter the following command:

   ```
   bdehdcfg.exe -target default
   ```

   3. This command creates a 550-MB system partition. Reboot the system.

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
<!-- ## Troubleshooting encryption status

If the expected encryption state does not match what is being reported in the portal, see the following support article:
[Encryption status is displayed incorrectly on the Azure Management Portal](https://support.microsoft.com/en-us/help/4058377/encryption-status-is-displayed-incorrectly-on-the-azure-management-por) --> 

## Next steps

In this document, you learned more about some common problems in Azure Disk Encryption and how to troubleshoot those problems. For more information about this service and its capabilities, see the following articles:

- [Apply disk encryption in Azure Security Center](../security-center/security-center-apply-disk-encryption.md)
- [Azure data encryption at rest](azure-security-encryption-atrest.md)
