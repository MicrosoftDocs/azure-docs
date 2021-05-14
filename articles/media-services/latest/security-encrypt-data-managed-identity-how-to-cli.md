---
title: Encrypt data into a Media Services account using a key in Key Vault
description: Learn how to use the Azure Media Services CLI to encrypt data into a Media Services account using a key in Key Vault
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: tutorial
ms.date: 05/12/2021
ms.author: inhenkel
---

# Tutorial: Encrypt data into a Media Services account using a key in Key Vault

If you'd like Media Services to encrypt data using a key from your Key Vault, the Media Services account must be granted *access* to the Key Vault. Follow the steps below to create a Managed Identity for the Media Services account and grant this identity access to their Key Vault using the Media Services CLI.

This tutorial uses the 2020-05-01 Media Services API.

<!-- testing button -->
<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.storage%2Fstorage-account-create%2Fazuredeploy.json" target="_blank">
  <img src="https://aka.ms/deploytoazurebutton"/>
</a>
<!-- end testing button -->

## Sign in to Azure

To use any of the commands in this article you first have to be logged in to the subscription that you want to use.

 [!INCLUDE [Sign in to Azure with the CLI](./includes/task-sign-in-azure-cli.md)]

## Set subscription

Use this command to set the subscription that you want to work with.

[!INCLUDE [Sign in to Azure with the CLI](./includes/task-set-azure-subscription-cli.md)]

## Resource names

Before you get started, decide on the names of the resources you'll create.  They should be easily identifiable as a set, especially if you are not planning to use them after you are done testing. Naming rules are different for many resource types so it's best to stick with all lower case. For example, "media-test1-rg" for your resource group name and "media-test1-stor" for your storage account name. It isn't required to use hyphens.  However, use the same names for each step in this article.

You'll see these names referenced in the commands below.  The names of resources you'll need are:

- your-resource-group-name
- your-storage-account-name
- your-media-services-account-name
- your-keyvault-name
- your-key-name
- your-region

### List Azure regions

If you're not sure of what the region name is for the API, use this command to get a listing.

[!INCLUDE [Sign in to Azure with the CLI](./includes/task-sign-in-azure-cli.md)]

## Create a resource group

[!INCLUDE [Create a resource group with the CLI](./includes/task-create-resource-group-cli.md)]

## Create a Storage account

[!INCLUDE [Create a Storage account with the CLI](./includes/task-create-storage-account-cli.md)]

## Create a Media Services account

[!INCLUDE [Create a Media Services account with the CLI](./includes/task-create-media-services-account-cli.md)]

## Create a Key Vault

Key Vault is used to encrypt media data.

[!INCLUDE [Create a Media Services account with the CLI](./includes/task-create-key-vault-cli.md)]

## Grant the Media Services System Assigned Managed Identity access to the Key Vault

Grant the Media Services Managed Identity access to the Key Vault. There are two commands:

### Get (show) the Managed Identity of the Media Services account

The first command below shows the Managed Identity of the Media Services account which is the `mediaServiceId`.

[!INCLUDE [Show the Managed Identity of a Media Services account with the CLI](./includes/task-show-account-managed-identity-cli.md)]

### Set the Key Vault policy

The second command grants the Principal ID access to the Key Vault. Set `object-id` to the value of `principalId`.

[!INCLUDE [Set the Key Vault policy with the CLI](./includes/task-key-vault-policy-cli.md)]

### Set Media Services to use the key from Key Vault

Set Media Services to use the key you've created. The value of the `key-identifier` property comes from the output when the key was created. This command may fail because of the time it takes to propagate access control changes. If this happens, retry after a few minutes.

[!INCLUDE [Set Media Services to use the key from Key Vault](./includes/task-set-encryption-cli.md)]

## Validation

To verify the account is encrypted using a Customer Managed Key, view the account encryption properties.

```azurecli
az ams account encryption show --account-name your-media-services-account-name --resource-group your-resource-group-name
```
The command returns:

```json
jason goes here
```

The `type` property should show `CustomerKey` and the `currentKeyIdentifier` should be set to the path of a key in the customer’s Key Vault.

## Clean up resources

If you aren't planning to use the resources you created, delete the resource group.

[!INCLUDE [Create a Media Services account with the CLI](./includes/clean-up-resources-cli.md)]
