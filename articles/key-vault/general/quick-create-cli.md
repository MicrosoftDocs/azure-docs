---
title: Quickstart - Create an Azure Key Vault with the Azure CLI
description: Quickstart showing how to create an Azure Key Vault using the Azure CLI
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: quickstart
ms.date: 01/27/2021
ms.author: mbaldwin

#Customer intent: As a security admin who is new to Azure, I want to use Key Vault to securely store keys and passwords in Azure
---
# Quickstart: Create a key vault using the Azure CLI

Azure Key Vault is a cloud service that provides a secure store for [keys](../keys/index.yml), [secrets](../secrets/index.yml), and [certificates](../certificates/index.yml). For more information on Key Vault, see [About Azure Key Vault](overview.md); for more information on what can be stored in a key vault, see [About keys, secrets, and certificates](about-keys-secrets-certificates.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

 - This quickstart requires version 2.0.4 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

[!INCLUDE [Create a resource group](../../../includes/key-vault-cli-rg-creation.md)]

## Create a key vault

[!INCLUDE [Create a key vault](../../../includes/key-vault-cli-kv-creation.md)]

## Clean up resources

[!INCLUDE [Create a key vault](../../../includes/key-vault-cli-delete-resources.md)]

## Next steps

In this quickstart you created a Key Vault and deleted it. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Azure Key Vault](overview.md)
- Review the [Azure Key Vault security overview](security-features.md)
- See the reference for the [Azure CLI az keyvault commands](/cli/azure/keyvault)

