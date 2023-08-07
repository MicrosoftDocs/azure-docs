---
title: Quickstart - Set & view Azure Key Vault certificates with Azure CLI
description: Quickstart showing how to set and retrieve a certificate from Azure Key Vault using Azure CLI
author: msmbaldwin
tags: azure-resource-manager
ms.service: key-vault
ms.subservice: certificates
ms.topic: quickstart
ms.custom: mvc, seo-javascript-september2019, seo-javascript-october2019, devx-track-azurecli, mode-api
ms.date: 11/14/2022
ms.author: mbaldwin
#Customer intent: As a security admin who is new to Azure, I want to use Key Vault to securely store keys and passwords in Azure
---
# Quickstart: Set and retrieve a certificate from Azure Key Vault using Azure CLI

In this quickstart, you create a key vault in Azure Key Vault with Azure CLI. Azure Key Vault is a cloud service that works as a secure secrets store. You can securely store keys, passwords, certificates, and other secrets. For more information on Key Vault you may review the [Overview](../general/overview.md). Azure CLI is used to create and manage Azure resources using commands or scripts. Once that you have completed that, you will store a certificate.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

 - This quickstart requires version 2.0.4 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

[!INCLUDE [Create a resource group](../../../includes/cli-rg-create.md)]

## Create a key vault

[!INCLUDE [Create a key vault](../../../includes/key-vault-cli-kv-creation.md)]

## Add a certificate to Key Vault

To add a certificate to the vault, you just need to take a couple of additional steps. This certificate could be used by an application. 

Type the commands below to create a self-signed certificate with default policy called **ExampleCertificate** :

```azurecli
az keyvault certificate create --vault-name "<your-unique-keyvault-name>" -n ExampleCertificate -p "$(az keyvault certificate get-default-policy)"
```

You can now reference this certificate that you added to Azure Key Vault by using its URI. Use **`https://<your-unique-keyvault-name>.vault.azure.net/certificates/ExampleCertificate`** to get the current version. 

To view previously stored certificate:

```azurecli

az keyvault certificate show --name "ExampleCertificate" --vault-name "<your-unique-keyvault-name>"
```

Now, you have created a Key Vault, stored a certificate, and retrieved it.

## Clean up resources

[!INCLUDE [Create a key vault](../../../includes/cli-rg-delete.md)]

## Next steps

In this quickstart you created a Key Vault and stored a certificate in it. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- See the reference for the [Azure CLI az keyvault commands](/cli/azure/keyvault)
- Review the [Key Vault security overview](../general/security-features.md)
