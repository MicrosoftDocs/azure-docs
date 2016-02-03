<properties
   pageTitle="Apply disk encryption | Microsoft Azure"
   description="This document helps you implement the Azure Security Center recommendation Apply disk encryption."
   services="security-center"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="StevenPo"
   editor=""/>

<tags
   ms.service="security-center"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="2/2/2015"
   ms.author="terrylan"/>

# Apply disk encryption

[Azure disk encryption](azure-security-disk-encryption.md) lets you encrypt your Windows and Linux IaaS virtual machine (VM) disks. Encryption is recommended for both the OS and data volumes on your VM.

Disk encryption leverages the industry standard [BitLocker](https://technet.microsoft.com/library/cc732774.aspx) feature of Windows and the [DM-Crypt](https://en.wikipedia.org/wiki/Dm-crypt) feature of Linux to provide OS and data encryption to help protect and safeguard your data and meet your organizational security and compliance commitments. Disk encryption is integrated with [Azure Key Vault](https://azure.microsoft.com/documentation/services/key-vault/) to help you control and manage the disk encryption keys and secrets in your key vault subscription, while ensuring that all data in the VM disks are encrypted at rest in your [Azure Storage](https://azure.microsoft.com/documentation/services/storage/).

> [AZURE.NOTE] Azure disk encryption is supported on the following Windows server operating systems - Windows Server 2008 R2, Windows Server 2012, and Windows Server 2012 R2. Disk encryption is supported on the following Linux server operating systems - Ubuntu, CentOS, SUSE and SUSE Linux Enterprise Server (SLES).

## What you need to know about disk encryption

To learn more about disk encryption, see:
- [Prerequisites to enable disk encryption](azure-security-disk-encryption.md## Prerequisites) on Azure IaaS VMs
- [High level steps required to enable disk encryption](azure-security-disk-encryption.md### Encryption Workflow) for Windows and Linux VMs
- [Enable encryption on existing/running IaaS Windows VM](azure-security-disk-encryption.md### Enable encryption on existing/running IaaS Windows VM in Azure) in Azure
- [Enable encryption on existing/running IaaS Linux VM](azure-security-disk-encryption.md### Enable encryption on existing/running IaaS Linux VM in Azure) in Azure
- [Set and configure Azure Key Vault](azure-security-disk-encryption.md### Setting and Configuring Azure Key Vault for Azure disk encryption usage) for disk encryption usage

## Implement the recommendation

1. In the **Recommendations** blade, select **Apply disk encryption**.
2. In the **Apply disk encryption** blade select from the list of VMs missing disk encryption and follow the encryption instructions.

![][1]

## Next steps

Learn more about disk encryption:
- [Encryption and key management with Azure Key Vault](https://azure.microsoft.com/documentation/videos/azurecon-2015-encryption-and-key-management-with-azure-key-vault/) (video, 36 min 39 sec) -- Learn how to use disk encryption management for IaaS VMs and Azure Key Vault to help protect and safeguard your data.

<!--Image references-->
[1]: ./media/security-center-apply-disk-encryption/apply-disk-encryption.png
