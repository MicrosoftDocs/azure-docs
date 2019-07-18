---
title: Azure Quickstart - Set and retrieve a secret from Key Vault using Azure CLI | Microsoft Docs
description: Quickstart showing how to set and retrieve a secret from Azure Key Vault using Azure CLI
services: key-vault
author: barclayn
manager: barbkess
tags: azure-resource-manager

ms.service: key-vault
ms.topic: quickstart
ms.custom: mvc
ms.date: 01/08/2019
ms.author: barclayn
#Customer intent:As a security admin who is new to Azure, I want to use Key Vault to securely store keys and passwords in Azure
---
# Quickstart: Set and retrieve a secret from Azure Key Vault using Azure CLI

Azure Key Vault is a cloud service that works as a secure secrets store. You can securely store keys, passwords, certificates, and other secrets. For more information on Key Vault you may review the [Overview](key-vault-overview.md). Azure CLI is used to create and manage Azure resources using commands or scripts. In this quickstart, you create a key vault. Once that you have completed that, you will store a secret.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

To sign in to Azure using the CLI you can type:

```azurecli
az login
```

For more information on login options via the CLI take a look at [sign in with Azure CLI](https://docs.microsoft.com/cli/azure/authenticate-azure-cli?view=azure-cli-latest)

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *ContosoResourceGroup* in the *eastus* location.

```azurecli
az group create --name "ContosoResourceGroup" --location eastus
```

## Create a Key Vault

Next you will create a Key Vault in the resource group created in the previous step. You will need to provide some information:

- For this quickstart we use **Contoso-vault2**. You must provide a unique name in your testing.
- Resource group name **ContosoResourceGroup**.
- The location **East US**.

```azurecli
az keyvault create --name "Contoso-Vault2" --resource-group "ContosoResourceGroup" --location eastus
```

The output of this cmdlet shows properties of the newly created Key Vault. Take note of the two properties listed below:

- **Vault Name**: In the example, this is **Contoso-Vault2**. You will use this name for other Key Vault commands.
- **Vault URI**: In the example, this is https://contoso-vault2.vault.azure.net/. Applications that use your vault through its REST API must use this URI.

At this point, your Azure account is the only one authorized to perform any operations on this new vault.

## Add a secret to Key Vault

To add a secret to the vault, you just need to take a couple of additional steps. This password could be used by an application. The password will be called **ExamplePassword** and will store the value of **hVFkk965BuUv** in it.

Type the commands below to create a secret in Key Vault called **ExamplePassword** that will store the value **hVFkk965BuUv** :

```azurecli
az keyvault secret set --vault-name "Contoso-Vault2" --name "ExamplePassword" --value "hVFkk965BuUv"
```

You can now reference this password that you added to Azure Key Vault by using its URI. Use **https://ContosoVault.vault.azure.net/secrets/ExamplePassword** to get the current version. 

To view the value contained in the secret as plain text:

```azurecli
az keyvault secret show --name "ExamplePassword" --vault-name "Contoso-Vault2"
```

Now, you have created a Key Vault, stored a secret, and retrieved it.

## Clean up resources

Other quickstarts and tutorials in this collection build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave these resources in place.
When no longer needed, you can use the [az group delete](/cli/azure/group) command to remove the resource group, and all related resources. You can delete the resources as follows:

```azurecli
az group delete --name ContosoResourceGroup
```

## Next steps

In this quickstart, you have created a Key Vault and stored a secret in it. To learn more about Key Vault and how you can use it with your applications continue to the tutorial for web applications working with Key Vault.

> [!div class="nextstepaction"]
> To learn how to read a secret from Key Vault from a web application using managed identities for Azure resources, continue with the following tutorial [Configure an Azure web application to read a secret from Key vault](quick-create-net.md)
