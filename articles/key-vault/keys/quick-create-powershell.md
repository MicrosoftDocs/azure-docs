---
title: Create and retrieve attributes of a key in Azure Key Vault – Azure PowerShell
description: Quickstart showing how to set and retrieve a key from Azure Key Vault using Azure PowerShell
services: key-vault
author: msmbaldwin
tags: azure-resource-manager
ms.service: key-vault
ms.subservice: keys
ms.topic: quickstart
ms.date: 01/04/2023
ms.author: mbaldwin
ms.custom: devx-track-azurepowershell, mode-api
#Customer intent: As a security admin who is new to Azure, I want to use Key Vault to securely store keys and passwords in Azure
---
# Quickstart: Set and retrieve a key from Azure Key Vault using Azure PowerShell

In this quickstart, you create a key vault in Azure Key Vault with Azure PowerShell. Azure Key Vault is a cloud service that works as a secure secrets store. You can securely store keys, passwords, certificates, and other secrets. For more information on Key Vault, review the [Overview](../general/overview.md). Azure PowerShell is used to create and manage Azure resources using commands or scripts. Once that you've completed that, you will store a key.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this tutorial requires Azure PowerShell module version 1.0.0 or later. Type `$PSVersionTable.PSVersion` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

```azurepowershell-interactive
Connect-AzAccount
```

## Create a resource group

[!INCLUDE [Create a resource group](../../../includes/powershell-rg-create.md)]

## Create a key vault

[!INCLUDE [Create a key vault](../../../includes/key-vault-powershell-kv-creation.md)]

## Add a key to Key Vault

To add a key to the vault, you just need to take a couple of additional steps. This key could be used by an application. 

Type this command to create a called **ExampleKey** :

```azurepowershell-interactive
Add-AzKeyVaultKey -VaultName "<your-unique-keyvault-name>" -Name "ExampleKey" -Destination "Software"
```

You can now reference this key that you added to Azure Key Vault by using its URI. Use **`https://<your-unique-keyvault-name>.vault.azure.net/keys/ExampleKey`** to get the current version. 

To view previously stored key:

```azurepowershell-interactive
Get-AzKeyVaultKey -VaultName "<your-unique-keyvault-name>" -KeyName "ExampleKey"
```

Now, you've created a Key Vault, stored a key, and retrieved it.

## Clean up resources

[!INCLUDE [Create a key vault](../../../includes/powershell-rg-delete.md)]

## Next steps

In this quickstart, you created a Key Vault and stored a certificate in it. To learn more about Key Vault and how to integrate it with your applications, continue on to these articles.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- See the reference for the [Azure PowerShell Key Vault cmdlets](/powershell/module/az.keyvault/)
- Review the [Key Vault security overview](../general/security-features.md)
.md)
