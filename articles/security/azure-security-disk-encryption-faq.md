---
title: FAQ - Azure Disk Encryption for IaaS VMs | Microsoft Docs
description: This article provides answers to frequently asked questions about Microsoft Azure Disk Encryption for Windows and Linux IaaS VMs.
author: msmbaldwin
ms.service: security
ms.topic: article
ms.author: mbaldwin
ms.date: 04/05/2019
ms.custom: seodec18
---

# Azure Disk Encryption for IaaS VMs FAQ

This article provides answers to frequently asked questions (FAQ) about Azure Disk Encryption for Windows and Linux IaaS VMs. For more information about this service, see [Azure Disk Encryption for Windows and Linux IaaS VMs](azure-security-disk-encryption-overview.md).

## Where is Azure Disk Encryption in general availability (GA)?

Azure Disk Encryption for Windows and Linux IaaS VMs is in general availability in all Azure public regions.

## What user experiences are available with Azure Disk Encryption?

Azure Disk Encryption GA supports Azure Resource Manager templates, Azure PowerShell, and Azure CLI. The different user experiences give you flexibility. You have three different options for enabling disk encryption for your IaaS VMs. For more information on the user experience and step-by-step guidance available in Azure Disk Encryption, see [Enable Azure Disk Encryption for Windows](azure-security-disk-encryption-windows.md) and [Enable Azure Disk Encryption for Linux](azure-security-disk-encryption-linux.md).

## How much does Azure Disk Encryption cost?

There's no charge for encrypting VM disks with Azure Disk Encryption but there are charges associated with the use of Azure Key Vault. For more information on Azure Key Vault costs, see the [Key Vault pricing](https://azure.microsoft.com/pricing/details/key-vault/) page.


## Which virtual machine tiers does Azure Disk Encryption support?

Azure Disk Encryption is available on standard tier VMs including [A, D, DS, G, GS, and F](https://azure.microsoft.com/pricing/details/virtual-machines/) series IaaS VMs. It's also available for VMs with premium storage. It isn't available on basic tier VMs.

## <a name="bkmk_LinuxOSSupport"></a> What Linux distributions does Azure Disk Encryption support?

Azure Disk Encryption is supported on a subset of the [Azure-endorsed Linux distributions](../virtual-machines/linux/endorsed-distros.md), which is itself a subset of all Linux server possible distributions.

 ![Venn Diagram of Linux server distributions that support Azure Disk Encryption](./media/azure-security-disk-encryption-faq/ade-supported-distros.png)

Linux server distributions that are not endorsed by Azure do not support Azure Disk Encryption and, of those that are endorsed, only distributions and versions that meet the following requirements support Azure Disk Encryption:

### RAM

2 GB for 64-bit images

Note: 2GB for standard 30GB disk image with higher amounts of memory for larger disks.

https://www.microsoft.com/en-US/windows/windows-10-specifications

### Volume Size:

Minimum volume size 64 MB
Best practice is to allocate 8-10MB free space of bitlocker metadata in a 20GB volume and leave a proportional additional amount of free space available as the volume size increases.

### Partition:

Windows Server 2016 and above:
Bitlocker can only be enabled in a subset of partition schemas, to meet this requirement bdecfg is a tool that will configure the partition schema to work with bitlocker, below are some of the partition requirements for system partition and WinRE partition.

BitLocker must use a system partition that is separate from the Windows partition, with the following requirements:

- Must be configured as the active partition.
- Must not be encrypted or used to store user files.
- Must have at least 350 megabytes (MB) of space.
- Must have at least 50 MB of free space.
- May be shared with a recovery partition.

For more information, see [BitLocker Drive Encryption](/windows-hardware/manufacture/desktop/bitlocker-drive-encryption).

For VMs with Win RE partition, Bitlocker has minimum partition requirement inherited from WinRE:

- This partition must be at least 300 MB.

The Windows Recovery Environment (Windows RE) tools require additional free space:

- If the partition is less than 500 MB, it must have at least 50 MB of free space.
- If the partition is 500 MB or larger, it must have at least 320 MB of free space.
- If the partition is larger than 1 GB, we recommend that it should have at least 1 GB free.

When calculating free space, note:

- The recovery image, winre.wim, is typically between 250-300MB, depending on what drivers, languages, and customizations you add.
- The file system itself can take up additional space. For example, NTFS may reserve 5-15MB or more on a 750MB partition.
- The recovery tools should be in a separate partition than the Windows partition to support automatic failover and to support booting partitions encrypted with Windows BitLocker Drive Encryption.

We recommend that you place this partition immediately after the Windows partition. This allows Windows to modify and recreate the partition later if future updates require a larger recovery image.

For more information, see [UEFI/GPT-based hard drive partitions](/windows-hardware/manufacture/desktop/configure-uefigpt-based-hard-drive-partitions).

Windows Server  2008:

Please follow the requirements documentated in the [Description of the BitLocker Drive Preparation Tool](https://support.microsoft.com/en-us/help/933246/description-of-the-bitlocker-drive-preparation-tool).

## How can I start using Azure Disk Encryption?

To get started, read the [Azure Disk Encryption overview](azure-security-disk-encryption-overview.md).

## Can I encrypt both boot and data volumes with Azure Disk Encryption?

Yes, you can encrypt boot and data volumes for Windows and Linux IaaS VMs. For Windows VMs, you can't encrypt the data without first encrypting the OS volume. For Linux VMs, it's possible to encrypt the data volume without having to encrypt the OS volume first. After you've encrypted the OS volume for Linux, disabling encryption on an OS volume for Linux IaaS VMs isn't supported. For Linux VMs in a scale set, only the data volume can be encrypted.

## Can I encrypt an unmounted volume with Azure Disk Encryption?

No, Azure Disk Encryption only encrypts mounted volumes.

## How do I rotate secrets or encryption keys?

To rotate secrets, just call the same command you used originally to enable disk encryption, specifying a different Key Vault. To rotate the key encryption key, call the same command you used originally to enable disk encryption, specifying the new key encryption. 

## How do I add or remove a key encryption key if I didn't originally use one?

To add a key encryption key, call the enable command again passing the key encryption key parameter. To remove a key encryption key, call the enable command again without the key encryption key parameter.

## Does Azure Disk Encryption allow you to bring your own key (BYOK)?

Yes, you can supply your own key encryption keys. These keys are safeguarded in Azure Key Vault, which is the key store for Azure Disk Encryption. For more information on the key encryption keys support scenarios, see [Azure Disk Encryption prerequisites](azure-security-disk-encryption-prerequisites.md).

## Can I use an Azure-created key encryption key?

Yes, you can use Azure Key Vault to generate a key encryption key for Azure disk encryption use. These keys are safeguarded in Azure Key Vault, which is the key store for Azure Disk Encryption. For more information on the key encryption key, see [Azure Disk Encryption prerequisites](azure-security-disk-encryption-prerequisites.md).

## Can I use an on-premises key management service or HSM to safeguard the encryption keys?

You can't use the on-premises key management service or HSM to safeguard the encryption keys with Azure Disk Encryption. You can only use the Azure Key Vault service to safeguard the encryption keys. For more information on the key encryption key support scenarios, see [Azure Disk Encryption prerequisites](azure-security-disk-encryption-prerequisites.md).

## What are the prerequisites to configure Azure Disk Encryption?

There are prerequisites for Azure Disk Encryption. See the [Azure Disk Encryption prerequisites](azure-security-disk-encryption-prerequisites.md) article to create a new key vault, or set up an existing key vault for disk encryption access to enable encryption, and safeguard secrets and keys. For more information on the key encryption key support scenarios, see [Azure Disk Encryption overview](azure-security-disk-encryption-overview.md).

## What are the prerequisites to configure Azure Disk Encryption with an Azure AD app (previous release)?

There are prerequisites for Azure Disk Encryption. See the [Azure Disk Encryption prerequisites](azure-security-disk-encryption-prerequisites-aad.md) article to create an Azure Active Directory application, create a new key vault, or set up an existing key vault for disk encryption access to enable encryption, and safeguard secrets and keys. For more information on the key encryption key support scenarios, see [Azure Disk Encryption overview](azure-security-disk-encryption-overview.md).

## Is Azure Disk Encryption using an Azure AD app (previous release) still supported?
Yes. Disk encryption using an Azure AD app is still supported. However, when encrypting new VMs it's recommended that you use the new method rather than encrypting with an Azure AD app. 

## Can I migrate VMs that were encrypted with an Azure AD app to encryption without an Azure AD app?
  Currently, there isn't a direct migration path for machines that were encrypted with an Azure AD app to encryption without an Azure AD app. Additionally, there isn't a direct path from encryption without an Azure AD app to encryption with an AD app. 

## What version of Azure PowerShell does Azure Disk Encryption support?

Use the latest version of the Azure PowerShell SDK to configure Azure Disk Encryption. Download the latest version of [Azure PowerShell](https://github.com/Azure/azure-powershell/releases). Azure Disk Encryption is *not* supported by Azure SDK version 1.1.0.

> [!NOTE]
> The Linux Azure disk encryption preview extension is deprecated. For details, see [Deprecating Azure disk encryption preview extension for Linux IaaS VMs](https://blogs.msdn.microsoft.com/azuresecurity/2017/07/12/deprecating-azure-disk-encryption-preview-extension-for-linux-iaas-vms/).

## Can I apply Azure Disk Encryption on my custom Linux image?

You can't apply Azure Disk Encryption on your custom Linux image. Only the gallery Linux images for the supported distributions called out previously are supported. Custom Linux images aren't currently supported.

## Can I apply updates to a Linux Red Hat VM that uses the yum update?

Yes, you can perform a yum update on a Red Hat Linux VM.  For more information, see [Linux package management behind a firewall](azure-security-disk-encryption-tsg.md#linux-package-management-behind-a-firewall).

## What is the recommended Azure disk encryption workflow for Linux?

The following workflow is recommended to have the best results on Linux:
* Start from the unmodified stock gallery image corresponding to the needed OS distro and version
* Back up any mounted drives that will be encrypted.  This back up allows for recovery if there's a failure, for example if the VM is rebooted before encryption has completed.
* Encrypt (can take several hours or even days depending on VM characteristics and size of any attached data disks)
* Customize, and add software to the image as needed.

If this workflow isn't possible, relying on [Storage Service Encryption](../storage/common/storage-service-encryption.md) (SSE) at the platform storage account layer may be an alternative to full disk encryption using dm-crypt.

## What is the disk "Bek Volume" or "/mnt/azure_bek_disk"?

"Bek volume" for Windows or "/mnt/azure_bek_disk" for Linux is a local data volume that securely stores the encryption keys for Encrypted Azure IaaS VMs.
> [!NOTE]
> Do not delete or edit any contents in this disk. Do not unmount the disk since the encryption key presence is needed for any encryption operations on the IaaS VM.


## What encryption method does Azure Disk Encryption use?

On Windows, ADE uses the BitLocker AES256 encryption method (AES256WithDiffuser on versions prior to Windows Server 2012). 
On Linux, ADE uses the decrypt default of aes-xts-plain64 with a 256-bit volume master key.

## If I use EncryptFormatAll and specify all volume types, will it erase the data on the data drives that we already encrypted?
No, data won't be erased from data drives that are already encrypted using Azure Disk Encryption. Similar to how EncryptFormatAll didn't re-encrypt the OS drive, it won't re-encrypt the already encrypted data drive. For more information, see the [EncryptFormatAll criteria](azure-security-disk-encryption-linux.md#bkmk_EFACriteria).        

## Is XFS filesystem supported?
XFS volumes are supported for data disk encryption only with the EncryptFormalAll. This will reformat the volume, erasing any data previously there. For more information, see the [EncryptFormatAll criteria](azure-security-disk-encryption-linux.md#bkmk_EFACriteria).

## Can I backup and restore an encrypted VM? 

Azure Backup provides a mechanism to backup and restore encrypted VM's within the same subscription and region.  For instructions, please see [Back up and restore encrypted virtual machines with Azure Backup](https://docs.microsoft.com/en-us/azure/backup/backup-azure-vms-encryption).  Restoring an encrypted VM to a different region is not currently supported.  

## Where can I go to ask questions or provide feedback?

You can ask questions or provide feedback on the [Azure Disk Encryption forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureDiskEncryption).

## Next steps
In this document, you learned more about the most frequent questions related to Azure Disk Encryption. For more information about this service, see the following articles:

- [Azure Disk Encryption Overview](azure-security-disk-encryption-overview.md)
- [Apply disk encryption in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-apply-disk-encryption)
- [Azure data encryption at rest](https://docs.microsoft.com/azure/security/azure-security-encryption-atrest)
