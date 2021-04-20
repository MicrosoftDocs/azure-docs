---
title: Creating and configuring a key vault for Azure Disk Encryption on a Windows VM
description: This article provides steps for creating and configuring a key vault for use with Azure Disk Encryption on a Windows VM.
ms.service: virtual-machines
ms.subservice: disks
ms.collection: windows
ms.topic: how-to
author: msmbaldwin
ms.author: mbaldwin
ms.date: 08/06/2019
ms.custom: seodec18
---

# Create and configure a key vault for Azure Disk Encryption on a Windows VM

Azure Disk Encryption uses Azure Key Vault to control and manage disk encryption keys and secrets.  For more information about key vaults, see [Get started with Azure Key Vault](../../key-vault/general/overview.md) and [Secure your key vault](../../key-vault/general/security-overview.md). 

> [!WARNING]
> - If you have previously used Azure Disk Encryption with Azure AD to encrypt a VM, you must continue use this option to encrypt your VM. See [Creating and configuring a key vault for Azure Disk Encryption with Azure AD (previous release)](disk-encryption-key-vault-aad.md) for details.

Creating and configuring a key vault for use with Azure Disk Encryption involves three steps:

> [!Note]
> You must select the option in the Azure Key Vault access policy settings to enable access to Azure Disk Encryption for volume encryption. If you have enabled the firewall on the key vault, you must go to the Networking tab on the key vault and enable access to Microsoft Trusted Services. 

1. Creating a resource group, if needed.
2. Creating a key vault. 
3. Setting key vault advanced access policies.

These steps are illustrated in the following quickstarts:

- [Create and encrypt a Windows VM with Azure CLI](disk-encryption-cli-quickstart.md)
- [Create and encrypt a Windows VM with Azure PowerShell](disk-encryption-powershell-quickstart.md)

You may also, if you wish, generate or import a key encryption key (KEK).

> [!Note]
> The steps in this article are automated in the [Azure Disk Encryption prerequisites CLI script](https://github.com/ejarvi/ade-cli-getting-started) and [Azure Disk Encryption prerequisites PowerShell script](https://github.com/Azure/azure-powershell/tree/master/src/Compute/Compute/Extension/AzureDiskEncryption/Scripts).

## Install tools and connect to Azure

The steps in this article can be completed with the [Azure CLI](/cli/azure/), the [Azure PowerShell Az module](/powershell/azure/), or the [Azure portal](https://portal.azure.com).

While the portal is accessible through your browser, Azure CLI and Azure PowerShell require local installation; see [Azure Disk Encryption for Windows: Install tools](disk-encryption-windows.md#install-tools-and-connect-to-azure) for details.

### Connect to your Azure account

Before using the Azure CLI or Azure PowerShell, you must first connect to your Azure subscription. You do so by [Signing in with Azure CLI](/cli/azure/authenticate-azure-cli), [Signing in with Azure Powershell](/powershell/azure/authenticate-azureps), or supplying your credentials to the Azure portal when prompted.

```azurecli-interactive
az login
```

```azurepowershell-interactive
Connect-AzAccount
```

[!INCLUDE [disk-encryption-key-vault](../../../includes/disk-encryption-key-vault.md)]
 
## Next steps

- [Azure Disk Encryption prerequisites CLI script](https://github.com/ejarvi/ade-cli-getting-started)
- [Azure Disk Encryption prerequisites PowerShell script](https://github.com/Azure/azure-powershell/tree/master/src/Compute/Compute/Extension/AzureDiskEncryption/Scripts)
- Learn [Azure Disk Encryption scenarios on Windows VMs](disk-encryption-windows.md)
- Learn how to [troubleshoot Azure Disk Encryption](disk-encryption-troubleshooting.md)
- Read the [Azure Disk Encryption sample scripts](disk-encryption-sample-scripts.md)
