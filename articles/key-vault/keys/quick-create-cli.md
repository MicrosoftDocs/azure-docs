---
title: Create and retrieve attributes of a key in Azure Key Vault - Azure CLI
description: Quickstart showing how to set and retrieve a key from Azure Key Vault using Azure CLI
author: msmbaldwin
ms.service: key-vault
ms.subservice: keys
ms.topic: quickstart
ms.date: 01/30/2024
ms.author: mbaldwin
ms.custom: devx-track-azurecli, mode-api
#Customer intent: As a security admin who is new to Azure, I want to use Key Vault to securely store keys and passwords in Azure
---
# Quickstart: Set and retrieve a key from Azure Key Vault using Azure CLI

In this quickstart, you create a key vault in Azure Key Vault with Azure CLI. Azure Key Vault is a cloud service that works as a secure secrets store. You can securely store keys, passwords, certificates, and other secrets. For more information on Key Vault, review the [Overview](../general/overview.md). Azure CLI is used to create and manage Azure resources using commands or scripts. Once that you've completed that, you will store a key.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

 - This quickstart requires version 2.0.4 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

[!INCLUDE [Create a resource group](../../../includes/cli-rg-create.md)]

## Create a key vault

[!INCLUDE [Create a key vault](../../../includes/key-vault-cli-kv-creation.md)]

## Add a key to Key Vault

To add a key to the vault, you just need to take a couple of additional steps. This key could be used by an application. 

Type this command to create a key called **ExampleKey** :

```azurecli
az keyvault key create --vault-name "<your-unique-keyvault-name>" -n ExampleKey --protection software
```

You can now reference this key that you added to Azure Key Vault by using its URI. Use **`https://<your-unique-keyvault-name>.vault.azure.net/keys/ExampleKey`** to get the current version. 

To view previously stored key:

```azurecli

az keyvault key show --name "ExampleKey" --vault-name "<your-unique-keyvault-name>"
```

Now, you've created a Key Vault, stored a key, and retrieved it.

## Clean up resources

[!INCLUDE [Create a key vault](../../../includes/cli-rg-delete.md)]

## Next steps

In this quickstart, you created a Key Vault and stored a key in it. To learn more about Key Vault and how to integrate it with your applications, continue on to these articles.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- See the reference for the [Azure CLI az keyvault commands](/cli/azure/keyvault)
- Review the [Key Vault security overview](../general/security-features.md)
