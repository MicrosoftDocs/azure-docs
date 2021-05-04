---
title: Quickstart - Set and retrieve a secret from Azure Key Vault
description: Quickstart showing how to set and retrieve a secret from Azure Key Vault using Azure CLI
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: secrets
ms.topic: quickstart
ms.custom: mvc, seo-javascript-september2019, seo-javascript-october2019, devx-track-azurecli
ms.date: 01/27/2021
ms.author: mbaldwin

#Customer intent:As a security admin who is new to Azure, I want to use Key Vault to securely store keys and passwords in Azure
---
# Quickstart: Set and retrieve a secret from Azure Key Vault using Azure CLI

In this quickstart, you create a key vault in Azure Key Vault with Azure CLI. Azure Key Vault is a cloud service that works as a secure secrets store. You can securely store keys, passwords, certificates, and other secrets. For more information on Key Vault you may review the [Overview](../general/overview.md). Azure CLI is used to create and manage Azure resources using commands or scripts. Once that you have completed that, you will store a secret.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

 - This quickstart requires version 2.0.4 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

[!INCLUDE [Create a resource group](../../../includes/key-vault-cli-rg-creation.md)]

## Create a key vault

[!INCLUDE [Create a key vault](../../../includes/key-vault-cli-kv-creation.md)]

## Add a secret to Key Vault

To add a secret to the vault, you just need to take a couple of additional steps. This password could be used by an application. The password will be called **ExamplePassword** and will store the value of **hVFkk965BuUv** in it.

Use the Azure CLI [az keyvault secret set](/cli/azure/keyvault/secret#az_keyvault_secret_set) command below to create a secret in Key Vault called **ExamplePassword** that will store the value **hVFkk965BuUv** :

```azurecli
az keyvault secret set --vault-name "<your-unique-keyvault-name>" --name "ExamplePassword" --value "hVFkk965BuUv"
```

## Retrieve a secret from Key Vault

You can now reference this password that you added to Azure Key Vault by using its URI. Use **'https://<your-unique-keyvault-name>.vault.azure.net/secrets/ExamplePassword'** to get the current version.

To view the value contained in the secret as plain text:

```azurecli
az keyvault secret show --name "ExamplePassword" --vault-name "<your-unique-keyvault-name>" --query "value"
```

Now, you have created a Key Vault, stored a secret, and retrieved it.

## Clean up resources

[!INCLUDE [Create a key vault](../../../includes/key-vault-cli-delete-resources.md)]

## Next steps

In this quickstart you created a Key Vault and stored a secret in it. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- Learn how to [store multiline secrets in Key Vault](multiline-secrets.md)
- See the reference for the [Azure CLI az keyvault commands](/cli/azure/keyvault)
- Review the [Key Vault security overview](../general/security-features.md)
