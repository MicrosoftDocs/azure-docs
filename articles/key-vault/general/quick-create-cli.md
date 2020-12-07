---
title: Quickstart - Create an Azure Key Vault with the Azure CLI
description: Quickstart showing how to create an Azure Key Vault using the Azure CLI
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: quickstart
ms.date: 07/20/2020
ms.author: mbaldwin

#Customer intent: As a security admin who is new to Azure, I want to use Key Vault to securely store keys and passwords in Azure
---
# Quickstart: Create a key vault using the Azure CLI

Azure Key Vault is a cloud service that provides a secure store for [keys](../keys/index.yml), [secrets](../secrets/index.yml), and [certificates](../certificates/index.yml). For more information on Key Vault, see [About Azure Key Vault](overview.md); for more information on what can be stored in a key vault, see [About keys, secrets, and certificates](about-keys-secrets-certificates.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

 - This quickstart requires version 2.0.4 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *ContosoResourceGroup* in the *eastus* location.

```azurecli
az group create --name "myResourceGroup" -l "EastUS"
```

## Create a key vault

Create a Key Vault in the resource group from the previous step. You will need to provide some information:

- Key vault name: A string of 3 to 24 characters that can contain only numbers (0-9), letters (a-z, A-Z), and hyphens (-)

  > [!Important]
  > Each key vault must have a unique name. Replace <your-unique-keyvault-name> with the name of your key vault in the following examples.

- Resource group name: **myResourceGroup**.
- The location: **EastUS**.

```azurecli
az keyvault create --name "<your-unique-keyvault-name>" --resource-group "myResourceGroup" --location "EastUS"
```

The output of this cmdlet shows properties of the newly created key vault. Take note of the two properties listed below:

- **Vault Name**: The name you provided to the --name parameter above.
- **Vault URI**: In the example, this is https://&lt;your-unique-keyvault-name&gt;.vault.azure.net/. Applications that use your vault through its REST API must use this URI.

At this point, your Azure account is the only one authorized to perform any operations on this new vault.

## Clean up resources

Other quickstarts and tutorials in this collection build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave these resources in place.

When no longer needed, you can use the Azure CLI [az group delete](/cli/azure/group) command to remove the resource group and all related resources:

```azurecli
az group delete --name myResourceGroup
```

## Next steps

In this quickstart you created a Key Vault and deleted it. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Azure Key Vault](overview.md)
- See the reference for the [Azure CLI az keyvault commands](/cli/azure/keyvault?view=azure-cli-latest)
- Review [Azure Key Vault best practices](best-practices.md)
