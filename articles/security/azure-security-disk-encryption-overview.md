---
title: Azure Disk Encryption for IaaS VMs Overview| Microsoft Docs
description: This article provides an overview of Microsoft Azure Disk Encryption for IaaS VMs.
author: mestew
ms.service: security
ms.subservice: Azure Disk Encryption
ms.topic: article
ms.author: mstewart
ms.date: 09/14/2018

--- 

# Azure Disk Encryption for IaaS VMs 
Microsoft Azure is committed to ensuring your data privacy, data sovereignty, and enabling you to control your Azure hosted data through a range of advanced technologies to encrypt, control and manage encryption keys, and control & audit access of data. This control provides Azure customers the flexibility to choose the solution that best meets their business needs. This article introduces you to a technology solution, “Azure Disk Encryption for Windows and Linux IaaS VMs”, to help protect and safeguard your data to meet your organizational security and compliance commitments. 

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-dsr-and-stp-note.md)]


## Overview
Azure Disk Encryption (ADE) is a capability that helps you encrypt your Windows and Linux IaaS virtual machine disks. ADE leverages the industry standard [BitLocker](https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-overview) feature of Windows and the [DM-Crypt](https://en.wikipedia.org/wiki/Dm-crypt) feature of Linux to provide volume encryption for the OS and data disks. The solution is integrated with [Azure Key Vault](https://azure.microsoft.com/documentation/services/key-vault/) to help you control and manage the disk-encryption keys and secrets. The solution also ensures that all data on the virtual machine disks are encrypted at rest in your Azure storage.

Azure disk encryption for Windows and Linux IaaS VMs is in **General Availability** in all Azure public regions and AzureGov regions for Standard VMs and VMs with premium storage. When you apply the Azure Disk Encryption-management solution, you can satisfy the following business needs:

* IaaS VMs are secured at rest using industry-standard encryption technology to address organizational security and compliance requirements.
* IaaS VMs boot under customer-controlled keys and policies, and you can audit their usage in your key vault.


If you use Azure Security Center, it  will alert you if you have virtual machines that are not encrypted. These alerts will show as High Severity and the recommendation is to encrypt these virtual machines.
![Azure Security Center disk encryption alert](media/azure-security-disk-encryption/security-center-disk-encryption-fig1.png)

> [!NOTE]
> Certain recommendations might increase data, network, or compute resource usage, resulting in additional license or subscription costs.


## Encryption scenarios
The Azure Disk Encryption solution supports the following customer scenarios:

* Enable encryption on new Windows IaaS VMs created from pre-encrypted VHD and encryption keys 
* Enable encryption on new IaaS VMs created from the supported Azure Gallery images
* Enable encryption on existing IaaS VMs running in Azure
* Enable encryption on Windows virtual machine scale sets
* Enable encryption on data drives for Linux virtual machine scale sets
* Disable encryption on Windows IaaS VMs
* Disable encryption on data drives for Linux IaaS VMs
* Disable encryption on Windows virtual machine scale sets
* Disable encryption on data drives for Linux virtual machine scale sets
* Enable encryption of managed disk VMs
* Update encryption settings of an existing encrypted premium and non-premium storage VM
* Backup and restore of encrypted VMs

The solution supports the following scenarios for IaaS VMs when they're enabled in Microsoft Azure:

* Integration with Azure Key Vault
* Standard tier VMs: [A, D, DS, G, GS, F, and so forth series IaaS VMs](https://azure.microsoft.com/pricing/details/virtual-machines/)
    * [Linux VMs](azure-security-disk-encryption-faq.md#bkmk_LinuxOSSupport) within these tiers must meet the minimum memory requirement of 7 GB
* Enable encryption on Windows and Linux IaaS VMs, managed disk, and scale set VMs from the supported Azure Gallery images
* Disable encryption on OS and data drives for Windows IaaS VMs, scale set VMs, and managed disk VMs
* Disable encryption on data drives for Linux IaaS VMs, scale set VMs, and managed disk VMs
* Enable encryption on IaaS VMs running Windows Client OS
* Enable encryption on volumes with mount paths
* Enable encryption on Linux VMs configured with disk striping (RAID) using mdadm
* Enable encryption on Linux VMs using LVM for data disks
* Enable encryption on Linux VM OS and data disks 
* Enable encryption on Windows VMs configured with Storage Spaces
* Update encryption settings of an existing encrypted premium and non-premium storage VM
* Backup and restore of encrypted VMs, for both no-KEK and KEK scenarios (KEK - Key Encryption Key)
* All Azure Public and AzureGov regions are supported

The solution doesn't support the following scenarios, features, and technology:

* Basic tier IaaS VMs
* Disabling encryption on an OS drive for Linux IaaS VMs
* Disabling encryption on a data drive if the OS drive is encrypted for Linux Iaas VMs
* IaaS VMs that are created by using the classic VM creation method
* Enabling encryption on Linux IaaS VMs customer custom images
* Integration with your on-premises Key Management Service
* Azure Files (shared file system)
* Network File System (NFS)
* Dynamic volumes
* Windows VMs that are configured with software-based RAID systems

## Encryption features
When you enable and deploy Azure Disk Encryption for Azure IaaS VMs, the following capabilities are enabled, depending on the configuration provided:

* Encryption of the OS volume to protect the boot volume at rest in your storage
* Encryption of data volumes to protect the data volumes at rest in your storage
* Disabling encryption on the OS and data drives for Windows IaaS VMs
* Disabling encryption on the data drives for Linux IaaS VMs (only if OS drive isn't encrypted)
* Safeguarding the encryption keys and secrets in your key vault subscription
* Reporting the encryption status of the encrypted IaaS VM
* Removal of disk-encryption configuration settings from the IaaS virtual machine
* Backup and restore of encrypted VMs by using the Azure Backup service

Azure Disk Encryption for IaaS VMS for Windows and Linux solution includes:

* The disk encryption extension for Windows.
* The disk encryption extension for Linux.
* The disk encryption PowerShell cmdlets.
* The disk encryption Azure command-line interface (CLI) cmdlets.
* The disk encryption Azure Resource Manager templates.

The Azure Disk Encryption solution is supported on IaaS VMs that are running Windows or Linux OS. For more information about the supported operating systems, see the [Prerequisites](azure-security-disk-encryption-prerequisites.md) article.

> [!NOTE]
> There is not an additional charge for encrypting VM disks with Azure Disk Encryption. Standard [Key Vault pricing](https://azure.microsoft.com/pricing/details/key-vault/) applies to the key vault used to store the encryption keys. 


## Encryption workflow

 To enable disk encryption for Windows and Linux VMs, do the following steps:

1. Choose an encryption scenario from among the preceding encryption scenarios.
2. Opt in to enabling disk encryption via the Azure Disk Encryption Resource Manager template, PowerShell cmdlets, or CLI command, and specify the encryption configuration.

   * For the customer-encrypted VHD scenario, upload the encrypted VHD to your storage account and the encryption key material to your key vault. Then, provide the encryption configuration to enable encryption on a new IaaS VM.
   * For new VMs that are created from the Marketplace and existing VMs that are already running in Azure, provide the encryption configuration to enable encryption on the IaaS VM.

3. Grant access to the Azure platform to read the encryption-key material (BitLocker encryption keys for Windows systems and Passphrase for Linux) from your key vault to enable encryption on the IaaS VM.

4. Azure updates the VM service model with encryption, the key vault configuration, and sets up your encrypted VM.

 ![Microsoft Antimalware in Azure](./media/azure-security-disk-encryption/disk-encryption-fig1.png)

## Decryption workflow
To disable disk encryption for IaaS VMs, complete the following high-level steps:

1. Choose to disable encryption (decryption) on a running IaaS VM in Azure and specify the decryption configuration. You can disable via the Azure Disk Encryption Resource Manager template, PowerShell cmdlets, or Azure CLI.

 This step disables encryption of the OS or the data volume or both on the running Windows IaaS VM. However, as mentioned in the previous section, disabling OS disk encryption for Linux isn't supported. The decryption step is allowed only for data drives on Linux VMs as long as the OS disk isn't encrypted.
2. Azure updates the VM service model, and the IaaS VM is marked decrypted. The contents of the VM are no longer encrypted at rest.

> [!NOTE]
> The disable-encryption operation does not delete your key vault and the encryption key material (BitLocker encryption keys for Windows systems or Passphrase for Linux).
 > Disabling OS disk encryption for Linux is not supported. The decryption step is allowed only for data drives on Linux VMs.
Disabling data disk encryption for Linux is not supported if the OS drive is encrypted.


## Encryption workflow (previous release)

The new release of Azure disk encryption eliminates the requirement for providing an Azure AD application parameter to enable VM disk encryption. With the new release, you are no longer required to provide an Azure AD credential during the enable encryption step. All new VMs must be encrypted without the Azure AD application parameters using the new release. VMs that were already encrypted with Azure AD application parameters are still supported and should continue to be maintained with the AAD syntax. To enable disk encryption for Windows and Linux VMs (previous release), do the following steps:

1. Choose an encryption scenario from among the preceding encryption scenarios.
2. Opt in to enabling disk encryption via the Azure Disk Encryption Resource Manager template, PowerShell cmdlets, or CLI command, and specify the encryption configuration.

   * For the customer-encrypted VHD scenario, upload the encrypted VHD to your storage account and the encryption key material to your key vault. Then, provide the encryption configuration to enable encryption on a new IaaS VM.
   * For new VMs that are created from the Marketplace and existing VMs that are already running in Azure, provide the encryption configuration to enable encryption on the IaaS VM.

3. Grant access to the Azure platform to read the encryption-key material (BitLocker encryption keys for Windows systems and Passphrase for Linux) from your key vault to enable encryption on the IaaS VM.

4. Provide the Azure Active Directory (Azure AD) application identity to write the encryption key material to your key vault. Doing so enables encryption on the IaaS VM for the scenarios mentioned in step 2.

5. Azure updates the VM service model with encryption and the key vault configuration, and sets up your encrypted VM.


## Terminology
To understand some of the common terms used by this technology, use the following terminology table:

| Terminology | Definition |
| --- | --- |
| Azure AD | Azure AD is [Azure Active Directory](https://azure.microsoft.com/documentation/services/active-directory/). An Azure AD account is used for authenticating, storing, and retrieving secrets from a key vault. |
| Azure Key Vault | Key Vault is a cryptographic, key management service that's based on Federal Information Processing Standards (FIPS) validated hardware security modules, which help safeguard your cryptographic keys and sensitive secrets. For more information, see [Key Vault](https://azure.microsoft.com/services/key-vault/) documentation. |
| BitLocker |[BitLocker](https://technet.microsoft.com/library/hh831713.aspx) is an industry-recognized Windows volume encryption technology that's used to enable disk encryption on Windows IaaS VMs. |
| BEK | BitLocker encryption keys are used to encrypt the OS boot volume and data volumes. The BitLocker keys are safeguarded in a key vault as secrets. |
| CLI | See [Azure command-line interface](/cli/azure/install-azure-cli).|
| DM-Crypt |[DM-Crypt](https://en.wikipedia.org/wiki/Dm-crypt) is the Linux-based, transparent disk-encryption subsystem that's used to enable disk encryption on Linux IaaS VMs. |
| KEK | Key encryption key is the asymmetric key (RSA 2048) that you can use to protect or wrap the secret. You can provide a hardware security module (HSM)-protected key or software-protected key. For more information, see [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) documentation. |
| PS cmdlets | See [Azure PowerShell cmdlets](/powershell/azure/overview). |

## Next steps
> [!div class="nextstepaction"]
> [Azure Disk Encryption Prerequisites](azure-security-disk-encryption-prerequisites.md)
