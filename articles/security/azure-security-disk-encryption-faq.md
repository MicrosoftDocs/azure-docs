---
title: Azure Disk Encryption FAQ| Microsoft Docs
description: This article provides answers to frequently asked questions about Microsoft Azure Disk Encryption for Windows and Linux IaaS VMs.
author: mestew
ms.service: security
ms.subservice: Azure Disk Encryption
ms.topic: article
ms.author: mstewart
ms.date: 09/10/2018
---

# Azure Disk Encryption FAQ

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

Azure Disk Encryption is supported on the following Linux server distributions and versions:

| Linux distribution | Version | Volume type supported for encryption|
| --- | --- |--- |
| Ubuntu | 16.04-DAILY-LTS | OS and data disk |
| Ubuntu | 14.04.5-DAILY-LTS | OS and data disk |
| RHEL | 7.5 | Data disk* |
| RHEL | 7.4 | Data disk* |
| RHEL | 7.3 | Data disk* |
| RHEL | 7.2 | Data disk* |
| RHEL | 6.8 | Data disk* |
| RHEL | 6.7 | Data disk* |
| CentOS | 7.4 | OS and data disk |
| CentOS | 7.3 | OS and data disk |
| CentOS | 7.2n | OS and data disk |
| CentOS | 6.8 | OS and data disk |
| CentOS | 7.1 | Data disk |
| CentOS | 7.0 | Data disk |
| CentOS | 6.7 | Data disk |
| CentOS | 6.6 | Data disk |
| CentOS | 6.5 | Data disk |
| openSUSE | 13.2 | Data disk |
| SLES | 12 SP1 | Data disk |
| SLES | Priority: 12-SP1 | Data disk |
| SLES | HPC 12 | Data disk |
| SLES | Priority: 11-SP4 | Data disk |
| SLES | 11 SP4 | Data disk |


*__ADE is supported for RHEL for data disk. The current ADE implementation does work for OS disk but isn't currently jointly supported. Both Microsoft and Red Hat are working on a jointly supported solution. In the interim, you can reference the [Azure Disk Encryption for Linux](azure-security-disk-encryption-linux.md) article.__

## How can I start using Azure Disk Encryption?

To get started, read the [Azure Disk Encryption overview](azure-security-disk-encryption-overview.md).

## Can I encrypt both boot and data volumes with Azure Disk Encryption?

Yes, you can encrypt boot and data volumes for Windows and Linux IaaS VMs. For Windows VMs, you can't encrypt the data without first encrypting the OS volume. For Linux VMs, it's possible to encrypt the data volume without having to encrypt the OS volume first. After you've encrypted the OS volume for Linux, disabling encryption on an OS volume for Linux IaaS VMs isn't supported.

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

Yes, you can perform an update or patch a Red Hat Linux VM. For more information, see [Applying updates to an encrypted Azure IaaS Red Hat VM by using the yum update](https://blogs.msdn.microsoft.com/azuresecurity/2017/07/13/applying-updates-to-a-encrypted-azure-iaas-red-hat-vm-using-yum-update/).

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

## If I use EncryptFormatAll and specify all volume types, will it erase the data on the data drives that we already encrypted?
No, data won't be erased from data drives that are already encrypted using Azure Disk Encryption. Similar to how EncryptFormatAll didn't re-encrypt the OS drive, it won't re-encrypt the already encrypted data drive. For more information, see the [EncryptFormatAll criteria](azure-security-disk-encryption-linux.md#bkmk_EFACriteria).        

## Where can I go to ask questions or provide feedback?

You can ask questions or provide feedback on the [Azure Disk Encryption forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureDiskEncryption).

## Next steps
In this document, you learned more about the most frequent questions related to Azure Disk Encryption. For more information about this service, see the following articles:

- [Azure Disk Encryption Overview](azure-security-disk-encryption-overview.md)
- [Apply disk encryption in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-apply-disk-encryption)
- [Azure data encryption at rest](https://docs.microsoft.com/azure/security/azure-security-encryption-atrest)
