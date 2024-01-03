---
title: Enable Azure Disk Encryption for Windows VMs
description: This article provides instructions on enabling Microsoft Azure Disk Encryption for Windows VMs.
author: msmbaldwin
ms.service: virtual-machines
ms.subservice: disks
ms.collection: windows
ms.topic: conceptual
ms.author: mbaldwin
ms.date: 01/04/2023

ms.custom: seodec18

---

# Azure Disk Encryption for Windows VMs

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets 

Azure Disk Encryption helps protect and safeguard your data to meet your organizational security and compliance commitments. It uses the [BitLocker](https://en.wikipedia.org/wiki/BitLocker) feature of Windows to provide volume encryption for the OS and data disks of Azure virtual machines (VMs), and is integrated with [Azure Key Vault](../../key-vault/index.yml) to help you control and manage the disk encryption keys and secrets.

Azure Disk Encryption is zone resilient, the same way as Virtual Machines. For details, see [Azure Services that support Availability Zones](../../availability-zones/az-region.md).

If you use [Microsoft Defender for Cloud](../../security-center/index.yml), you're alerted if you have VMs that aren't encrypted. The alerts show as High Severity and the recommendation is to encrypt these VMs.

![Microsoft Defender for Cloud disk encryption alert](../media/disk-encryption/security-center-disk-encryption-fig1.png)

> [!WARNING]
> - If you have previously used Azure Disk Encryption with Microsoft Entra ID to encrypt a VM, you must continue use this option to encrypt your VM. See [Azure Disk Encryption with Microsoft Entra ID (previous release)](disk-encryption-overview-aad.md) for details. 
> - Certain recommendations might increase data, network, or compute resource usage, resulting in additional license or subscription costs. You must have a valid active Azure subscription to create resources in Azure in the supported regions.
> - Do not use BitLocker to manually decrypt a VM or disk that was encrypted through Azure Disk Encryption.

You can learn the fundamentals of Azure Disk Encryption for Windows in just a few minutes with the [Create and encrypt a Windows VM with Azure CLI quickstart](disk-encryption-cli-quickstart.md) or the [Create and encrypt a Windows VM with Azure PowerShell quickstart](disk-encryption-powershell-quickstart.md).

## Supported VMs and operating systems

### Supported VMs

Windows VMs are available in a [range of sizes](../sizes-general.md). Azure Disk Encryption is supported on Generation 1 and Generation 2 VMs. Azure Disk Encryption is also available for VMs with premium storage.

Azure Disk Encryption is not available on [Basic, A-series VMs](https://azure.microsoft.com/pricing/details/virtual-machines/series/), or on virtual machines with a less than 2 GB of memory.  For more exceptions, see [Azure Disk Encryption: Restrictions](disk-encryption-windows.md#restrictions).

### Supported operating systems

- Windows client: Windows 8 and later.
- Windows Server: Windows Server 2008 R2 and later.
- Windows 10 Enterprise multi-session and later.  
 
> [!NOTE]
> Windows Server 2022 and Windows 11 do not support an RSA 2048 bit key. For more information, see [FAQ: What size should I use for my key encryption key?](disk-encryption-faq.yml#what-size-should-i-use-for-my-key-encryption-key--kek--)
>
> Windows Server 2008 R2 requires the .NET Framework 4.5 to be installed for encryption; install it from Windows Update with the optional update Microsoft .NET Framework 4.5.2 for Windows Server 2008 R2 x64-based systems ([KB2901983](https://www.catalog.update.microsoft.com/Search.aspx?q=KB2901983)).  
>  
> Windows Server 2012 R2 Core and Windows Server 2016 Core requires the bdehdcfg component to be installed on the VM for encryption.

## Networking requirements
To enable Azure Disk Encryption, the VMs must meet the following network endpoint configuration requirements:
  - To get a token to connect to your key vault, the Windows VM must be able to connect to a Microsoft Entra endpoint, \[login.microsoftonline.com\].
  - To write the encryption keys to your key vault, the Windows VM must be able to connect to the key vault endpoint.
  - The Windows VM must be able to connect to an Azure storage endpoint that hosts the Azure extension repository and an Azure storage account that hosts the VHD files.
  -  If your security policy limits access from Azure VMs to the Internet, you can resolve the preceding URI and configure a specific rule to allow outbound connectivity to the IPs. For more information, see [Azure Key Vault behind a firewall](../../key-vault/general/access-behind-firewall.md).    

## Group Policy requirements

Azure Disk Encryption uses the BitLocker external key protector for Windows VMs. For domain joined VMs, don't push any group policies that enforce TPM protectors. For information about the group policy for "Allow BitLocker without a compatible TPM," see [BitLocker Group Policy Reference](/windows/security/information-protection/bitlocker/bitlocker-group-policy-settings#bkmk-unlockpol1).

BitLocker policy on domain joined virtual machines with custom group policy must include the following setting: [Configure user storage of BitLocker recovery information -> Allow 256-bit recovery key](/windows/security/information-protection/bitlocker/bitlocker-group-policy-settings). Azure Disk Encryption will fail when custom group policy settings for BitLocker are incompatible. On machines that didn't have the correct policy setting, apply the new policy, and force the new policy to update (gpupdate.exe /force).  Restarting may be required.

Microsoft BitLocker Administration and Monitoring (MBAM) group policy features aren't compatible with Azure Disk Encryption.

> [!WARNING]
> Azure Disk Encryption **does not store recovery keys**. If the [Interactive logon: Machine account lockout threshold](/windows/security/threat-protection/security-policy-settings/interactive-logon-machine-account-lockout-threshold) security setting is enabled, machines can only be recovered by providing a recovery key via the serial console. Instructions for ensuring the appropriate recovery policies are enabled can be found in the [Bitlocker recovery guide plan](/windows/security/information-protection/bitlocker/bitlocker-recovery-guide-plan).

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
| BitLocker |[BitLocker](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/hh831713(v=ws.11)) is an industry-recognized Windows volume encryption technology that's used to enable disk encryption on Windows VMs. |
| Key encryption key (KEK) | The asymmetric key (RSA 2048) that you can use to protect or wrap the secret. You can provide a hardware security module (HSM)-protected key or software-protected key. For more information, see the [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) documentation and [Creating and configuring a key vault for Azure Disk Encryption](disk-encryption-key-vault.md). |
| PowerShell cmdlets | For more information, see [Azure PowerShell cmdlets](/powershell/azure/). |

## Next steps

- [Quickstart - Create and encrypt a Windows VM with Azure CLI ](disk-encryption-cli-quickstart.md)
- [Quickstart - Create and encrypt a Windows VM with Azure PowerShell](disk-encryption-powershell-quickstart.md)
- [Azure Disk Encryption scenarios on Windows VMs](disk-encryption-windows.md)
- [Azure Disk Encryption prerequisites CLI script](https://github.com/ejarvi/ade-cli-getting-started) 
- [Azure Disk Encryption prerequisites PowerShell script](https://github.com/Azure/azure-powershell/tree/master/src/Compute/Compute/Extension/AzureDiskEncryption/Scripts)
- [Creating and configuring a key vault for Azure Disk Encryption](disk-encryption-key-vault.md)
