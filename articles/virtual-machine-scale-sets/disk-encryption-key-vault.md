---
title: Creating and configuring a key vault for Azure Disk Encryption
description: This article provides steps for creating and configuring a key vault for use with Azure Disk Encryption
author: ju-shim
ms.author: jushiman
ms.topic: tutorial
ms.service: virtual-machine-scale-sets
ms.subservice: disks
ms.date: 10/10/2019
ms.reviewer: mimckitt
ms.custom: mimckitt

---

# Creating and configuring a key vault for Azure Disk Encryption

Azure Disk Encryption uses Azure Key Vault to control and manage disk encryption keys and secrets.  For more information about key vaults, see [Get started with Azure Key Vault](../key-vault/key-vault-get-started.md) and [Secure your key vault](../key-vault/general/secure-your-key-vault.md).

Creating and configuring a key vault for use with Azure Disk Encryption involves three steps:

1. Creating a resource group, if needed.
2. Creating a key vault. 
3. Setting key vault advanced access policies.

These steps are illustrated in the following quickstarts:

You may also, if you wish, generate or import a key encryption key (KEK).

## Install tools and connect to Azure

The steps in this article can be completed with the [Azure CLI](/cli/azure/), the [Azure PowerShell Az module](/powershell/azure/overview), or the [Azure portal](https://portal.azure.com).

### Connect to your Azure account

Before using the Azure CLI or Azure PowerShell, you must first connect to your Azure subscription. You do so by [Signing in with Azure CLI](/cli/azure/authenticate-azure-cli?view=azure-cli-latest), [Signing in with Azure PowerShell](/powershell/azure/authenticate-azureps?view=azps-2.5.0), or supplying your credentials to the Azure portal when prompted.

```azurecli-interactive
az login
```

```azurepowershell-interactive
Connect-AzAccount
```

[!INCLUDE [disk-encryption-key-vault](../../includes/disk-encryption-key-vault.md)]
 
## Next steps

- [Azure Disk Encryption overview](disk-encryption-overview.md)
- [Encrypt a virtual machine scale sets using the Azure CLI](disk-encryption-cli.md)
- [Encrypt a virtual machine scale sets using the Azure PowerShell](disk-encryption-powershell.md)
