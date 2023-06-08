---
title: Creating and configuring a key vault for Azure Disk Encryption
description: This article provides steps for creating and configuring a key vault for use with Azure Disk Encryption
author: ju-shim
ms.author: jushiman
ms.topic: tutorial
ms.service: virtual-machine-scale-sets
ms.subservice: disks
ms.date: 11/22/2022
ms.reviewer: mimckitt
ms.custom: mimckitt, devx-track-azurecli, devx-track-azurepowershell
ms.devlang: azurecli
---

# Create and configure a key vault for Azure Disk Encryption

Azure Disk Encryption uses Azure Key Vault to control and manage disk encryption keys and secrets.  For more information about key vaults, see [Get started with Azure Key Vault](../key-vault/general/overview.md) and [Secure your key vault](../key-vault/general/secure-your-key-vault.md).

Creating and configuring a key vault for use with Azure Disk Encryption involves three steps:

1. Creating a resource group, if needed.
2. Creating a key vault. 
3. Setting key vault advanced access policies.

You may also, if you wish, generate or import a key encryption key (KEK).

## Install tools and connect to Azure

The steps in this article can be completed with the [Azure CLI](/cli/azure/), the [Azure PowerShell Az module](/powershell/azure/), or the [Azure portal](https://portal.azure.com).

[!INCLUDE [disk-encryption-key-vault](../../includes/disk-encryption-key-vault.md)]
 
## Next steps

- [Azure Disk Encryption overview](disk-encryption-overview.md)
- [Encrypt a Virtual Machine Scale Sets using the Azure CLI](disk-encryption-cli.md)
- [Encrypt a Virtual Machine Scale Sets using the Azure PowerShell](disk-encryption-powershell.md)
