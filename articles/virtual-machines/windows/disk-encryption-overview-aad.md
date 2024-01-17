---
title: Azure Disk Encryption with Azure AD (previous release)
description: This article provides prerequisites for using Microsoft Azure Disk Encryption for IaaS VMs.
author: msmbaldwin
ms.service: virtual-machines
ms.subservice: disks
ms.topic: conceptual
ms.author: mbaldwin
ms.date: 01/04/2023

ms.custom: seodec18

---
# Azure Disk Encryption with Azure AD (previous release)

**Applies to:** :heavy_check_mark: Windows VMs

**The new release of Azure Disk Encryption eliminates the requirement for providing a Microsoft Entra application parameter to enable VM disk encryption. With the new release, you are no longer required to provide Microsoft Entra credentials during the enable encryption step. All new VMs must be encrypted without the Microsoft Entra application parameters using the new release. To view instructions to enable VM disk encryption using the new release, see [Azure Disk Encryption for Windows VMs](disk-encryption-overview.md). VMs that were already encrypted with Microsoft Entra application parameters are still supported and should continue to be maintained with the Microsoft Entra syntax.**

This article supplements [Azure Disk Encryption for Windows VMs](disk-encryption-overview.md) with additional requirements and prerequisites for Azure Disk Encryption with Microsoft Entra ID (previous release). The [Supported VMs and operating systems](disk-encryption-overview.md#supported-vms-and-operating-systems) section remains the same.

## Networking and Group Policy

**To enable the Azure Disk Encryption feature using the older Microsoft Entra parameter syntax, the IaaS VMs must meet the following network endpoint configuration requirements:** 
  - To get a token to connect to your key vault, the IaaS VM must be able to connect to a Microsoft Entra endpoint, \[login.microsoftonline.com\].
  - To write the encryption keys to your key vault, the IaaS VM must be able to connect to the key vault endpoint.
  - The IaaS VM must be able to connect to an Azure storage endpoint that hosts the Azure extension repository and an Azure storage account that hosts the VHD files.
  -  If your security policy limits access from Azure VMs to the Internet, you can resolve the preceding URI and configure a specific rule to allow outbound connectivity to the IPs. For more information, see [Azure Key Vault behind a firewall](../../key-vault/general/access-behind-firewall.md).
  - The VM to be encrypted must be configured to use TLS 1.2 as the default protocol. If TLS 1.0 has been explicitly disabled and the .NET version hasn't been updated to 4.6 or higher, the following registry change will enable ADE to select the more recent TLS version:

```console
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319]
"SystemDefaultTlsVersions"=dword:00000001
"SchUseStrongCrypto"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\.NETFramework\v4.0.30319]
"SystemDefaultTlsVersions"=dword:00000001
"SchUseStrongCrypto"=dword:00000001` 
```

**Group Policy:**
 - The Azure Disk Encryption solution uses the BitLocker external key protector for Windows IaaS VMs. For domain joined VMs, don't push any group policies that enforce TPM protectors. For information about the group policy for “Allow BitLocker without a compatible TPM,” see [BitLocker Group Policy Reference](/windows/security/information-protection/bitlocker/bitlocker-group-policy-settings#bkmk-unlockpol1).

-  BitLocker policy on domain joined virtual machines with custom group policy must include the following setting: [Configure user storage of BitLocker recovery information -> Allow 256-bit recovery key](/windows/security/information-protection/bitlocker/bitlocker-group-policy-settings). Azure Disk Encryption will fail when custom group policy settings for BitLocker are incompatible. On machines that didn't have the correct policy setting, apply the new policy, force the new policy to update (gpupdate.exe /force), and then restarting may be required.  

## Encryption key storage requirements  

Azure Disk Encryption requires an Azure Key Vault to control and manage disk encryption keys and secrets. Your key vault and VMs must reside in the same Azure region and subscription.

For details, see [Creating and configuring a key vault for Azure Disk Encryption with Microsoft Entra ID (previous release)](disk-encryption-key-vault-aad.md).
 
## Next steps

- [Creating and configuring a key vault for Azure Disk Encryption with Microsoft Entra ID (previous release)](disk-encryption-key-vault-aad.md)
- [Enable Azure Disk Encryption with Microsoft Entra ID on Windows VMs (previous release)](disk-encryption-windows-aad.md)
- [Azure Disk Encryption prerequisites CLI script](https://github.com/ejarvi/ade-cli-getting-started)
- [Azure Disk Encryption prerequisites PowerShell script](https://github.com/Azure/azure-powershell/tree/master/src/Compute/Compute/Extension/AzureDiskEncryption/Scripts)
