---
title: Azure Disk Encryption FAQ| Microsoft Docs
description: This article provides answers to frequently asked questions about Microsoft Azure Disk Encryption for Windows and Linux IaaS VMs.
services: security
documentationcenter: na
author: deventiwari
manager: avibm
editor: yuridio

ms.assetid: 7188da52-5540-421d-bf45-d124dee74979
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/11/2017
ms.author: devtiw

---
# Azure Disk Encryption FAQ

This article provides answers to frequently asked questions (FAQ) about Azure Disk Encryption for Windows and Linux IaaS VMs. For more information about this service, see [Azure Disk Encryption for Windows and Linux IaaS VMs](https://docs.microsoft.com/azure/security/azure-security-disk-encryption).

## General questions
**Q:** Where is Azure Disk Encryption in general availability (GA)?

**A:** Azure Disk Encryption for Windows and Linux IaaS VMs is in general availability in all Azure public regions.

**Q:** What user experiences are available with Azure Disk Encryption?

**A:** Azure Disk Encryption GA supports Azure Resource Manager templates, Azure PowerShell, and Azure CLI. This gives you a lot of flexibility. You have three different options for enabling disk encryption for your IaaS VMs. For more information on the user experience and step-by-step guidance available in Azure Disk Encryption, see Azure Disk Encryption deployment scenarios and experiences.

**Q:** How much does Azure Disk Encryption cost?

**A:** There is no charge for encrypting VM disks with Azure Disk Encryption.

**Q:** Which virtual machine tiers does Azure Disk Encryption support?

**A:** Azure Disk Encryption is available on standard tier VMs including [A, D, DS, G, GS, and F](https://azure.microsoft.com/pricing/details/virtual-machines/) series IaaS VMs. It is also available for VMs with premium storage. It is not available on basic tier VMs.

**Q:** What Linux distributions does Azure Disk Encryption support?

**A:** Azure Disk Encryption is supported on the following Linux server distributions and versions:

| Linux distribution | Version | Volume type supported for encryption|
| --- | --- |--- |
| Ubuntu | 16.04-DAILY-LTS | OS and data disk |
| Ubuntu | 14.04.5-DAILY-LTS | OS and data disk |
| RHEL | 7.3 | OS and data disk |
| RHEL | 7.2 | OS and data disk |
| RHEL | 6.8 | OS and data disk |
| RHEL | 6.7 | Data disk |
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
| SLES | Priority:12-SP1 | Data disk |
| SLES | HPC 12 | Data disk |
| SLES | Priority:11-SP4 | Data disk |
| SLES | 11 SP4 | Data disk |

**Q:** How can I start using Azure Disk Encryption?

**A:** To get started, read the [Azure Disk Encryption for Windows and Linux IaaS VMs](https://docs.microsoft.com/azure/security/azure-security-disk-encryption) white paper.

**Q:** Can I encrypt both boot and data volumes with Azure Disk Encryption?

**A:** Yes, you can encrypt boot and data volumes for Windows and Linux IaaS VMs. For Windows VMs, you cannot encrypt the data without first encrypting the OS volume. For Linux VMs, you can encrypt the data volume without having to encrypt the OS volume first. After you have encrypted the OS volume for Linux, disabling encryption on an OS volume for Linux IaaS VMs is not supported.

**Q:** Does Azure Disk Encryption allow you to bring your own key (BYOK) capability?

**A:** Yes, you can supply your own key encryption keys. These keys are safeguarded in Azure Key Vault, which is the key store for Azure Disk Encryption. For more information on the key encryption keys support scenarios, see Azure Disk Encryption deployment scenarios and experiences.

**Q:** Can I use an Azure-created key encryption key?

**A:** Yes, you can use Azure Key Vault to generate a key encryption key for Azure disk encryption use. These keys are safeguarded in Azure Key Vault, which is the key store for Azure Disk Encryption. For more information on the key encryption key support scenarios, see Azure Disk Encryption deployment scenarios and experiences.

**Q:** Can I use an on-premises key management service or HSM to safeguard the encryption keys?

**A:** You cannot use the on-premises key management service or HSM to safeguard the encryption keys with Azure Disk Encryption. You can only use the Azure Key Vault service to safeguard the encryption keys. For more information on the key encryption key support scenarios, see Azure Disk Encryption deployment scenarios and experiences.

**Q:** What are the prerequisites to configure Azure Disk Encryption?

**A:** There is a prerequisite PowerShell script. With this script, you can create an Azure Active Directory application, create a new key vault, or set up an existing key vault for disk encryption access to enable encryption and safeguard secrets and keys. For more information on the key encryption key support scenarios, see Azure Disk Encryption prerequisites and deployment scenarios and experiences.

**Q:** Where can I get more information on how to use PowerShell for configuring Azure Disk Encryption?

**A:** We have some great articles on how you can perform basic Azure Disk Encryption tasks, as well as more advanced scenarios. For the basic tasks, see [Explore Azure Disk Encryption with Azure PowerShell – Part 1](https://blogs.msdn.microsoft.com/azuresecurity/2015/11/16/explore-azure-disk-encryption-with-azure-powershell/). For more advanced scenarios, see [Explore Azure Disk Encryption with Azure PowerShell – Part 2](https://blogs.msdn.microsoft.com/azuresecurity/2015/11/21/explore-azure-disk-encryption-with-azure-powershell-part-2/).

**Q:** What version of Azure PowerShell does Azure Disk Encryption support?

**A:** Use the latest version of the Azure PowerShell SDK to configure Azure Disk Encryption. Download the latest version of [Azure PowerShell](https://github.com/Azure/azure-powershell/releases). Azure Disk Encryption is *not* supported by Azure SDK version 1.1.0.

> [!NOTE]
> The Linux Azure disk encryption preview extension is deprecated. For details, see [Deprecating Azure disk encryption preview extension for Linux IaaS VMs](https://blogs.msdn.microsoft.com/azuresecurity/2017/07/12/deprecating-azure-disk-encryption-preview-extension-for-linux-iaas-vms/).

**Q:** Can I apply Azure Disk Encryption on my custom Linux image?

**A:** You cannot apply Azure Disk Encryption on your custom Linux image. We support only the gallery Linux images for the supported distributions called out previously. We do not currently support custom Linux images.

**Q:** Can I apply updates to a Linux Red Hat VM that uses the yum update?

**A:** Yes, you can perform an update or patch a Red Hat Linux VM. For more information, see [Applying updates to an encrypted Azure IaaS Red Hat VM by using the yum update](https://blogs.msdn.microsoft.com/azuresecurity/2017/07/13/applying-updates-to-a-encrypted-azure-iaas-red-hat-vm-using-yum-update/).

**Q:** What is the recommended Azure disk encryption workflow for Linux?

**A:** The following workflow is recommended to have the best results on Linux:
* Start from the unmodified stock gallery image corresponding to the desired OS distro and version
* Back up any mounted drives that will be encrypted.  This permits recovery in case of failure, for example if the VM is rebooted before encryption has completed.
* Encrypt (can take multiple hours or even days depending on vm characteristics and size of any attached data disks)
* Customize, and add software to the image as needed.

If this workflow is not possible, relying on [Storage Service Encryption](https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption) (SSE) at the platform storage account layer may be an alternative to full disk encryption using dm-crypt.

**Q:** What is the disk "Bek Volume" or "/mnt/azure_bek_disk"?

**A:** "Bek volume" for Windows or "/mnt/azure_bek_disk" for Linux is a temporary storage which stores the encryption keys for Encrypted Azure IaaS VMs.
> [!NOTE]
> Do not delete or edit any contents in this disk. Do not unmount the disk since the encryption key presence is needed for any encryption operations on the IaaS VM.

**Q:** Where can I go to ask questions or provide feedback?

**A:** You can ask questions or provide feedback on the [Azure Disk Encryption forum](https://social.msdn.microsoft.com/Forums/home?forum=AzureDiskEncryption).

## Next steps
In this document, you learned more about the most frequent questions related to Azure Disk Encryption. For more information about this service and its capabilities, see the following articles:

- [Apply disk encryption in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-apply-disk-encryption)
- [Encrypt an Azure virtual machine](https://docs.microsoft.com/azure/security-center/security-center-disk-encryption)
- [Azure data encryption at rest](https://docs.microsoft.com/azure/security/azure-security-encryption-atrest)
