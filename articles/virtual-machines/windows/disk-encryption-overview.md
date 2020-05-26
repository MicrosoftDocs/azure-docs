---
title: Enable Azure Disk Encryption for Windows VMs
description: This article provides instructions on enabling Microsoft Azure Disk Encryption for Windows VMs.
author: msmbaldwin
ms.service: virtual-machines-windows
ms.subservice: security
ms.topic: article
ms.author: mbaldwin
ms.date: 10/05/2019

ms.custom: seodec18

---

# Azure Disk Encryption for Windows VMs 

Azure Disk Encryption helps protect and safeguard your data to meet your organizational security and compliance commitments. It uses the [Bitlocker](https://en.wikipedia.org/wiki/BitLocker) feature of Windows to provide volume encryption for the OS and data disks of Azure virtual machines (VMs), and is integrated with [Azure Key Vault](../../key-vault/index.yml) to help you control and manage the disk encryption keys and secrets. 

If you use [Azure Security Center](../../security-center/index.yml), you're alerted if you have VMs that aren't encrypted. The alerts show as High Severity and the recommendation is to encrypt these VMs.

![Azure Security Center disk encryption alert](../media/disk-encryption/security-center-disk-encryption-fig1.png)

> [!WARNING]
> - If you have previously used Azure Disk Encryption with Azure AD to encrypt a VM, you must continue use this option to encrypt your VM. See [Azure Disk Encryption with Azure AD (previous release)](disk-encryption-overview-aad.md) for details. 
> - Certain recommendations might increase data, network, or compute resource usage, resulting in additional license or subscription costs. You must have a valid active Azure subscription to create resources in Azure in the supported regions.

You can learn the fundamentals of Azure Disk Encryption for Windows in just a few minutes with the [Create and encrypt a Windows VM with Azure CLI quickstart](disk-encryption-cli-quickstart.md) or the [Create and encrypt a Windows VM with Azure Powershell quickstart](disk-encryption-powershell-quickstart.md).

## Supported VMs and operating systems

### Supported VMs

Windows VMs are available in a [range of sizes](sizes-general.md). Azure Disk Encryption is not available on [Basic, A-series VMs](https://azure.microsoft.com/pricing/details/virtual-machines/series/), or on virtual machines with a less than 2 GB of memory.

Azure Disk Encryption is also available for VMs with premium storage.

Azure Disk Encryption is not available on [Generation 2 VMs](generation-2.md#generation-1-vs-generation-2-capabilities) and [Lsv2-series VMs](../lsv2-series.md). For more exceptions, see [Azure Disk Encryption: Unsupported scenarios](disk-encryption-windows.md#unsupported-scenarios).

### Supported operating systems

- Windows client: Windows 8 and later.
- Windows Server: Windows Server 2008 R2 and later.  
 
> [!NOTE]
> Windows Server 2008 R2 requires the .NET Framework 4.5 to be installed for encryption; install it from Windows Update with the optional update Microsoft .NET Framework 4.5.2 for Windows Server 2008 R2 x64-based systems ([KB2901983](https://www.catalog.update.microsoft.com/Search.aspx?q=KB2901983)).  
>  
> Windows Server 2012 R2 Core and Windows Server 2016 Core requires the bdehdcfg component to be installed on the VM for encryption.


## Networking requirements
To enable Azure Disk Encryption, the VMs must meet the following network endpoint configuration requirements:
  - To get a token to connect to your key vault, the Windows VM must be able to connect to an Azure Active Directory endpoint, \[login.microsoftonline.com\].
  - To write the encryption keys to your key vault, the Windows VM must be able to connect to the key vault endpoint.
  - The Windows VM must be able to connect to an Azure storage endpoint that hosts the Azure extension repository and an Azure storage account that hosts the VHD files.
  -  If your security policy limits access from Azure VMs to the Internet, you can resolve the preceding URI and configure a specific rule to allow outbound connectivity to the IPs. For more information, see [Azure Key Vault behind a firewall](../../key-vault/general/access-behind-firewall.md).    


## Group Policy requirements

Azure Disk Encryption uses the BitLocker external key protector for Windows VMs. For domain joined VMs, don't push any group policies that enforce TPM protectors. For information about the group policy for "Allow BitLocker without a compatible TPM," see [BitLocker Group Policy Reference](/windows/security/information-protection/bitlocker/bitlocker-group-policy-settings#bkmk-unlockpol1).

BitLocker policy on domain joined virtual machines with custom group policy must include the following setting: [Configure user storage of BitLocker recovery information -> Allow 256-bit recovery key](/windows/security/information-protection/bitlocker/bitlocker-group-policy-settings). Azure Disk Encryption will fail when custom group policy settings for BitLocker are incompatible. On machines that didn't have the correct policy setting, apply the new policy, force the new policy to update (gpupdate.exe /force), and then restarting may be required.

Azure Disk Encryption will fail if domain level group policy blocks the AES-CBC algorithm, which is used by BitLocker.

## Encryption key storage requirements  

Azure Disk Encryption requires an Azure Key Vault to control and manage disk encryption keys and secrets. Your key vault and VMs must reside in the same Azure region and subscription.

For details, see [Creating and configuring a key vault for Azure Disk Encryption](disk-encryption-key-vault.md).

## Terminology
The following table defines some of the common terms used in Azure disk encryption documentation:

| Terminology | Definition |
| --- | --- |
| Azure Key Vault | Key Vault is a cryptographic, key management service that's based on Federal Information Processing Standards (FIPS) validated hardware security modules. These standards help to safeguard your cryptographic keys and sensitive secrets. For more information, see the [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) documentation and [Creating and configuring a key vault for Azure Disk Encryption](disk-encryption-key-vault.md). |
| Azure CLI | [The Azure CLI](/cli/azure/install-azure-cli) is optimized for managing and administering Azure resources from the command line.|
| BitLocker |[BitLocker](https://technet.microsoft.com/library/hh831713.aspx) is an industry-recognized Windows volume encryption technology that's used to enable disk encryption on Windows VMs. |
| Key encryption key (KEK) | The asymmetric key (RSA 2048) that you can use to protect or wrap the secret. You can provide a hardware security module (HSM)-protected key or software-protected key. For more information, see the [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) documentation and [Creating and configuring a key vault for Azure Disk Encryption](disk-encryption-key-vault.md). |
| PowerShell cmdlets | For more information, see [Azure PowerShell cmdlets](/powershell/azure/overview). |


## Next steps

- [Quickstart - Create and encrypt a Windows VM with Azure CLI ](disk-encryption-cli-quickstart.md)
- [Quickstart - Create and encrypt a Windows VM with Azure Powershell](disk-encryption-powershell-quickstart.md)
- [Azure Disk Encryption scenarios on Windows VMs](disk-encryption-windows.md)
- [Azure Disk Encryption prerequisites CLI script](https://github.com/ejarvi/ade-cli-getting-started)
- [Azure Disk Encryption prerequisites PowerShell script](https://github.com/Azure/azure-powershell/tree/master/src/Compute/Compute/Extension/AzureDiskEncryption/Scripts)
- [Creating and configuring a key vault for Azure Disk Encryption](disk-encryption-key-vault.md)


