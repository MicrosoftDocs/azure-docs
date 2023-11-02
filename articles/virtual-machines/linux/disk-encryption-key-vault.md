---
title: Creating and configuring a key vault for Azure Disk Encryption
description: This article provides steps for creating and configuring a key vault for use with Azure Disk Encryption on a Linux VM.
ms.service: virtual-machines
ms.collection: linux
ms.subservice: disks
ms.topic: conceptual
author: msmbaldwin
ms.author: mbaldwin
ms.date: 01/04/2023
ms.custom: seodec18, devx-track-azurecli, devx-track-azurepowershell
---

# Creating and configuring a key vault for Azure Disk Encryption

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

Azure Disk Encryption uses Azure Key Vault to control and manage disk encryption keys and secrets.  For more information about key vaults, see [Get started with Azure Key Vault](../../key-vault/general/overview.md) and [Secure your key vault](../../key-vault/general/security-features.md). 


> [!WARNING]
> - If you have previously used Azure Disk Encryption with Microsoft Entra ID to encrypt a VM, you must continue use this option to encrypt your VM. See [Creating and configuring a key vault for Azure Disk Encryption with Microsoft Entra ID (previous release)](disk-encryption-key-vault-aad.md) for details.

Creating and configuring a key vault for use with Azure Disk Encryption involves three steps:

1. Creating a resource group, if needed.
2. Creating a key vault. 
3. Setting key vault advanced access policies.

These steps are illustrated in the following quickstarts:

- [Create and encrypt a Linux VM with Azure CLI](disk-encryption-cli-quickstart.md)
- [Create and encrypt a Linux VM with Azure PowerShell](disk-encryption-powershell-quickstart.md)

You may also, if you wish, generate or import a key encryption key (KEK).

> [!Note]
> The steps in this article are automated in the [Azure Disk Encryption prerequisites CLI script](https://github.com/ejarvi/ade-cli-getting-started) and [Azure Disk Encryption prerequisites PowerShell script](https://github.com/Azure/azure-powershell/tree/master/src/Compute/Compute/Extension/AzureDiskEncryption/Scripts).

## Install tools and connect to Azure

The steps in this article can be completed with the [Azure CLI](/cli/azure/), the [Azure PowerShell Az PowerShell module module](/powershell/azure/), or the [Azure portal](https://portal.azure.com). 

While the portal is accessible through your browser, Azure CLI and Azure PowerShell require local installation; see [Azure Disk Encryption for Linux: Install tools](disk-encryption-linux.md#install-tools-and-connect-to-azure) for details.

### Connect to your Azure account

Before using the Azure CLI or Azure PowerShell, you must first connect to your Azure subscription. You do so by [Signing in with Azure CLI](/cli/azure/authenticate-azure-cli), [Signing in with Azure PowerShell](/powershell/azure/authenticate-azureps), or supplying your credentials to the Azure portal when prompted.

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
- Learn [Azure Disk Encryption scenarios on Linux VMs](disk-encryption-linux.md)
- Learn how to [troubleshoot Azure Disk Encryption](disk-encryption-troubleshooting.md)
- Read the [Azure Disk Encryption sample scripts](disk-encryption-sample-scripts.md)
