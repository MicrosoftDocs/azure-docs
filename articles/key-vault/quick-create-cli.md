---
title: Azure Quick start - Create a Key Vault CLI | Microsoft Docs
description: Quick start showing how to create an Azure Key Vault using the CLI
services: key-vault
author: barclayn
manager: mbaldwin
tags: azure-resource-manager

ms.assetid: 
ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.custom: mvc
ms.date: 03/02/2017
ms.author: barclayn

---
# Quickstart: Create an Azure Key Vault using the CLI

Azure CLI is used to create and manage Azure resources using commands or scripts. In this article, you create a Key Vault. Once that you have a Vault, you will store a secret.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

To log in to the Azure using the CLI you can type:

```azurecli-interactive
az login
```

For more information on login options via the CLI take a look at [Log in with Azure CLI 2.0](../cli/azure/authenticate-azure-cli?view=azure-cli-latest.md)

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *ContosoResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name 'ContosoResourceGroup' --location eastus
```

## Create a Key Vault

Next you will create a Key Vault in the resource group created in the previous step. You will need to provide some information:

>[!NOTE]
> Although “ContosoKeyVault” is used as the name for our Key Vault throughout this quickstart, you must use a unique name.

- Vault name **ContosoKeyVault**.
- Resource group name **ContosoResourceGroup**.
- The location **East US**.

```azurecli-interactive 
az keyvault create --name 'ContosoKeyVault' --resource-group 'ContosoResourceGroup' --location eastus
```

The output of this cmdlet shows properties of the newly created Key Vault. Take note of the two properties listed below:

* **Vault Name**: In the example, this is **ContosoKeyVault**. You will use this name for other Key Vault commands.
* **Vault URI**: In the example, this is https://contosokeyvault.vault.azure.net/. Applications that use your vault through its REST API must use this URI.

At this point, your Azure account is the only one authorized to perform any operations on this new vault.

## Adding a secret to Key Vault

To add a secret to the vault, you just need to take a couple of additional steps. This password could be used by an application. The password will be called **SQLPassword** and will store the value of **Pa$$w0rd** in it.

Type the commands below to create a secret in Key Vault called **SQLPassword** that will store the value **Pa$$w0rd** :

```azurecli-interactive 
az keyvault secret set --vault-name 'ContosoKeyVault' --name 'SQLPassword' --value 'Pa$$w0rd'
```

You can now reference this password that you added to Azure Key Vault by using its URI. Use **https://ContosoVault.vault.azure.net/secrets/SQLPassword** to get the current version. 

To view the value contained in the secret as plain text:

```azurecli-interactive
az keyvault secret show --name 'SQLPassword' --vault-name 'ContosoKeyVault'
```

Now, you have created a Key Vault, stored a secret, and retrieved it.

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#delete) command to remove the resource group, VM, and all related resources. Exit the SSH session to your VM, then delete the resources as follows:

```azurecli-interactive
az group delete --name ContosoResourceGroup
```
>[!IMPORTANT]
> Other quickstarts and tutorials in this collection build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave these resources in place.

## Next steps

In this quickstart, you have created a Key Vault and stored a software key in it. To learn more about Key Vault and how you can use it with your applications continue to the tutorial for web applications working with Key Vault.

> [!div class="nextstepaction"]
> [Use Azure Key Vault from a Web Application](key-vault-use-from-web-application.md)
