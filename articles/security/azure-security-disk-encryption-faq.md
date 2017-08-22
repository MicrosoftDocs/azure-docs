---
title: Azure Disk Encryption FAQ| Microsoft Docs
description: This article provides answers to frequently asked questions for Microsoft Azure Disk Encryption for Windows and Linux IaaS VMs.
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
# Azure Disk Encryption Frequently Asked Questions (FAQ)

This FAQ answers questions about Azure disk encryption for Windows and Linux IaaS VMs, for more information about this service, read [Azure Disk Encryption for Windows and Linux IaaS VMs](https://docs.microsoft.com/azure/security/azure-security-disk-encryption).

## General questions
**Q.** Which region is Azure disk encryption in GA?

**A:** Azure disk encryption for Windows and Linux IaaS VMs is available in GA in all Azure public regions.

**Q:** What user experiences are available with Azure Disk Encryption?

**A:** Azure Disk Encryption GA supports Azure Resource Manager templates, Azure PowerShell, Azure CLI. This gives you a lot of flexibility in that you have three different options for enabling disk encryption for your IaaS VMs. More details on the user experience and step by step guidance is available in the Azure Disk Encryption deployment scenarios and experiences.

**Q:** How much does Azure Disk Encryption cost?

**A:** There is no charge for encrypting VM disks with Azure Disk Encryption.

**Q:** What virtual machine tiers can I use Azure Disk Encryption with?

**A:** Azure Disk Encryption is available only on Standard Tier VMs including [A, D, DS, G, GS, F](https://azure.microsoft.com/pricing/details/virtual-machines/) and so forth series IaaS VMs including VMs with premium storage. It is not available on Basic Tier VMs.

**Q:** What Linux distributions are supported by Azure Disk Encryption?

**A:** Azure Disk Encryption is supported on the following Linux server distributions and versions:

| Linux Distribution | Version | Volume Type Supported for Encryption|
| --- | --- |--- |
| Ubuntu | 16.04-DAILY-LTS | OS and Data disk |
| Ubuntu | 14.04.5-DAILY-LTS | OS and Data disk |
| RHEL | 7.3 | OS and Data disk |
| RHEL | 7.2 | OS and Data disk |
| RHEL | 6.8 | OS and Data disk |
| RHEL | 6.7 | Data disk |
| CentOS | 7.3 | OS and Data disk |
| CentOS | 7.2n | OS and Data disk |
| CentOS | 6.8 | OS and Data disk |
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

**Q:** How can I get started using Azure Disk Encryption?

**A:** Customers can learn how to get started by reading the Azure Disk Encryption whitepaper located [here](https://docs.microsoft.com/azure/security/azure-security-disk-encryption)

**Q:** Can I encrypt both boot and data volumes with Azure Disk Encryption?

**A:** Yes, you can encrypt boot and data volumes for Windows and Linux IaaS VMs. For Windows VMs, you cannot encrypt the data without first encrpting the OS volume. For Linux VMs, you can encrypt the data volume without encryptinng the OS volume first. Once you have encrypted the OS volume for Liux, disabling encryption on an OS volume for Linux IaaS VMs is not supported

**Q:** Does Azure Disk Encryption enable a “bring your own key” (BYOK) capability?

**A:** Yes, you can supply your own key encryption keys. Those keys are safeguarded in Azure Key Vault, which is the key store for Azure Disk Encryption. For more details on the key encryption key support scenarios, see the Azure Disk Encryption deployment scenarios and experiences

**Q:** Can I use a Azure-created key encryption key?

**A:** Yes, you can use Azure Key vault to generate key encryption key for Azure disk encryption use. Those keys are safeguarded in Azure Key Vault, which is the key store for Azure Disk Encryption. For more details on the key encryption key support scenarios, see the Azure Disk Encryption deployment scenarios and experiences

**Q:** Can I use on-premises key management service/HSM to safeguard the encryption keys?

**A:** You cannot use the on-premises key management service/HSM to safeguard the encryption keys with Azure disk encryption. You can only use the Azure key vault service to safeguard the encryption keys. For more details on the key encryption key support scenarios, see the Azure Disk Encryption deployment scenarios and experiences

**Q:** What are the prerequisites to configure Azure disk encryption?

**A:** The Azure disk encryption prerequisite PowerShell script to create AAD application, create new key vault or setup existing key vault for disk encryption access to enable encryption and safeguard secrets and key.  For more details on the key encryption key support scenarios, see the Azure Disk Encryption prerequisites and deployment scenarios and experiences

**Q:** Where can I get more information on how to use PowerShell for configuring Azure Disk Encryption?

**A:** We have some great articles on how you can perform basic Azure Disk Encryption tasks, as well as more advanced scenarios. For the basic tasks, check out Explore [Azure Disk Encryption with Azure PowerShell - Part 1](https://blogs.msdn.microsoft.com/azuresecurity/2015/11/16/explore-azure-disk-encryption-with-azure-powershell/). For more advanced scenarios, see Explore [Azure Disk Encryption with Azure PowerShell – Part 2](https://blogs.msdn.microsoft.com/azuresecurity/2015/11/21/explore-azure-disk-encryption-with-azure-powershell-part-2/)

**Q:** What version of Azure PowerShell is supported by Azure Disk Encryption?

**A:** Use the latest version of Azure PowerShell SDK version to configure Azure Disk Encryption. Download the latest version of [Azure PowerShell](https://github.com/Azure/azure-powershell/releases). Azure Disk Encryption is NOT supported by Azure SDK version 1.1.0.

> [!NOTE]
> The Linux Azure disk encryption preview extension is deprecated. For details, refer to documentation [here](https://blogs.msdn.microsoft.com/azuresecurity/2017/07/12/deprecating-azure-disk-encryption-preview-extension-for-linux-iaas-vms/)

**Q:** Can I apply Azure disk encryption on my custom Linux image?

**A:** You cannot apply Azure disk encryption on your custom Linux image. We support only the gallery Linux images for the supported distros called out above. We do not support custom Linux images currently

**Q:** Can I apply updates to a Linux Red Hat VM using Yum update?

**A:** Yes, you can perform update and or patch a Red Hat Linnux VM following guidance documented [here](https://blogs.msdn.microsoft.com/azuresecurity/2017/07/13/applying-updates-to-a-encrypted-azure-iaas-red-hat-vm-using-yum-update/)

**Q:** Where can I go to ask question or provide feedback

**A:** You can provide ask questions or feedback on the Azure disk encryption forum [here](https://social.msdn.microsoft.com/Forums/home?forum=AzureDiskEncryption)

## See also
In this document, you learned more about the most frequent questions related to Azure disk encryption, for more information about this service and its capability read:

- [Apply disk encryption in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-apply-disk-encryption)
- [Encrypt an Azure Virtual Machine](https://docs.microsoft.com/azure/security-center/security-center-disk-encryption)
- [Azure Data Encryption-at-Rest](https://docs.microsoft.com/azure/security/azure-security-encryption-atrest)
