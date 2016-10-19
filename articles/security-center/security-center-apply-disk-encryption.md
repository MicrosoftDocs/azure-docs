<properties
   pageTitle="Apply disk encryption in Azure Security Center | Microsoft Azure"
   description="This document shows you how to implement the Azure Security Center recommendation **Apply disk encryption**."
   services="security-center"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="MBaldwin"
   editor=""/>

<tags
   ms.service="security-center"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/29/2016"
   ms.author="terrylan"/>

# Apply disk encryption in Azure Security Center

Azure Security Center will recommend that you apply disk encryption if you have Windows or Linux VM disks that are not encrypted using Azure Disk Encryption. Disk Encryption lets you encrypt your Windows and Linux IaaS VM disks.  Encryption is recommended for both the OS and data volumes on your VM.


Disk Encryption leverages the industry standard [BitLocker](https://technet.microsoft.com/library/cc732774.aspx) feature of Windows and the [DM-Crypt](https://en.wikipedia.org/wiki/Dm-crypt) feature of Linux to provide OS and data encryption to help protect and safeguard your data and meet your organizational security and compliance commitments. Disk Encryption is integrated with [Azure Key Vault](https://azure.microsoft.com/documentation/services/key-vault/) to help you control and manage the disk encryption keys and secrets in your Key Vault subscription, while ensuring that all data in the VM disks are encrypted at rest in your [Azure Storage](https://azure.microsoft.com/documentation/services/storage/).

> [AZURE.NOTE] Azure Disk Encryption is supported on the following Windows server operating systems - Windows Server 2008 R2, Windows Server 2012, and Windows Server 2012 R2. Disk encryption is supported on the following Linux server operating systems - Ubuntu, CentOS, SUSE and SUSE Linux Enterprise Server (SLES).

## Implement the recommendation

1. In the **Recommendations** blade, select **Apply disk encryption**.
2. In the **Apply disk encryption** blade, you will see a list of VMs for which Disk Encryption is recommended.
3. Follow the instructions to apply encryption to these VMs.

![][1]

To encrypt Azure Virtual Machines that have been identified by Security Center as needing encryption, we recommend the following steps:

- Install and configure Azure PowerShell. This will enable you to run the PowerShell commands required to set up the prerequisites required to encrypt Azure Virtual Machines.
- Obtain and run the Azure Disk Encryption Prerequisites Azure PowerShell script.
- Encrypt your virtual machines.

[Encrypt an Azure Virtual Machine](security-center-disk-encryption.md) will walk you through these steps.  This topic assumes you are using Windows 10 as the client machine from which you will configure disk encryption.

There are many approaches that can be used to setup the prerequisites and to configure encryption for Azure Virtual Machines. If you are already well-versed in Azure PowerShell or Azure CLI, then you may prefer to use alternate approaches. To learn about these other approaches see [Azure disk encryption](../security/azure-security-disk-encryption.md).



## See also

This document showed you how to implement the Security Center recommendation "Apply disk encryption." To learn more about disk encryption, see the following:

- [Encryption and key management with Azure Key Vault](https://azure.microsoft.com/documentation/videos/azurecon-2015-encryption-and-key-management-with-azure-key-vault/) (video, 36 min 39 sec) -- Learn how to use disk encryption management for IaaS VMs and Azure Key Vault to help protect and safeguard your data.
- [Encrypt an Azure Virtual Machine](security-center-disk-encryption.md) (document) -- Learn how to encrypt Azure Virtual Machines.
- [Azure disk encryption](../security/azure-security-disk-encryption.md) (document) -- Learn how to enable disk encryption for Windows and Linux VMs.

To learn more about Security Center, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies.
- [Security health monitoring in Azure Security Center](security-center-monitoring.md) -- Learn how to monitor the health of your Azure resources.
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
- [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
- [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
- [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) -- Find blog posts about Azure security and compliance.



<!--Image references-->
[1]: ./media/security-center-apply-disk-encryption/apply-disk-encryption.png
