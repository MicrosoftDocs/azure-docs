---
title: Use a Key Vault key to encrypt data into a Media Services account
description: If you'd like Media Services to encrypt data using a key from your Key Vault, the Media Services account must be granted *access* to the Key Vault. Follow the steps below to create a Managed Identity for the Media Services account and grant this identity access to their Key Vault using the Media Services CLI.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: tutorial
ms.date: 05/14/2021
ms.author: inhenkel
---

# Tutorial: Use a Key Vault key to encrypt data into a Media Services account

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

If you'd like Media Services to encrypt data using a key from your Key Vault, the Media Services account must be granted *access* to the Key Vault. Follow the steps below to create a Managed Identity for the Media Services account and grant this identity access to your Key Vault using the Media Services CLI.

:::image type="content" source="media/diagrams/managed-identities-scenario-keyvault-media-services-account.svg" alt-text="Media Services account uses Key Vault with a Managed Identity":::



This tutorial uses the 2020-05-01 Media Services API.

## Sign in to Azure

To use any of the commands in this article, you first have to be signed in to the subscription that you want to use.

 [!INCLUDE [Sign in to Azure with the CLI](./includes/task-sign-in-azure-cli.md)]

### Set subscription

Use this command to set the subscription that you want to work with.

[!INCLUDE [Sign in to Azure with the CLI](./includes/task-set-azure-subscription-cli.md)]

## Resource names

Before you get started, decide on the names of the resources you'll create.  They should be easily identifiable as a set, especially if you are not planning to use them after you are done testing. Naming rules are different for many resource types so it's best to stick with all lower case. For example, "mediatest1rg" for your resource group name and "mediatest1stor" for your storage account name. Use the same names for each step in this article.

You'll see these names referenced in the commands below.  The names of resources you'll need are:

- your-resource-group-name
- your-storage-account-name
- your-media-services-account-name
- your-keyvault-name
- your-key-name
- your-region

> [!NOTE]
> The hyphens above are only used to separate guidance words. Because of the inconsistency of naming resources in Azure services, don't use hyphens when you name your resources.
> Also, you don't create the region name.  The region name is determined by Azure.

### List Azure regions

If you're not sure of the actual region name to use, use this command to get a listing:

[!INCLUDE [List Azure regions with the CLI](./includes/task-list-azure-regions-cli.md)]

## Sequence

Each of the steps below is done in a particular order because one or more values from the JSON responses are used in the next step in the sequence.

## Create a resource group

The resources you'll create must belong to a resource group. Create the resource group first. You'll use `your-resource-group-name` for the Media Services account creation step, and subsequent steps.

[!INCLUDE [Create a resource group with the CLI](./includes/task-create-resource-group-cli.md)]

## Create a Storage account

The Media Services account you'll create must have a storage account associated with it. Create the storage account for the Media Services account first. You'll use `your-storage-account-name` for subsequent steps.

[!INCLUDE [Create a Storage account with the CLI](./includes/task-create-storage-account-cli.md)]

## Create a Media Services account with a Service Principal (Managed Identity)

Now create the Media Services account with a Service Principal, otherwise known as a Managed Identity.

> [!IMPORTANT]
> It is important that you remember to use the --mi flag in the command.  Otherwise you will not be able to find the `principalId` for a later step.

[!INCLUDE [Create a Media Services account with the CLI](./includes/task-create-media-services-account-managed-identity-cli.md)]

## Create a Key Vault

Create the Key Vault.  The Key Vault is used to encrypt media data. You'll use `your-keyvault-name` to create your key and for later steps.

[!INCLUDE [Create a Media Services account with the CLI](./includes/task-create-key-vault-cli.md)]

## Grant the Media Services System Assigned Managed Identity access to the Key Vault

Grant the Media Services Managed Identity access to the Key Vault. There are two commands:

### Get (show) the Managed Identity of the Media Services account

The first command below shows the Managed Identity of the Media Services account which is the `principalId` listed in the JSON returned by the command.

[!INCLUDE [Show the Managed Identity of a Media Services account with the CLI](./includes/task-show-account-managed-identity-cli.md)]

### Set the Key Vault policy

The second command grants the Principal ID access to the Key Vault. Set `object-id` to the value of `principalId` which you got from the previous step.

[!INCLUDE [Set the Key Vault policy with the CLI](./includes/task-set-key-vault-policy-cli.md)]

### Set Media Services to use the key from Key Vault

Set Media Services to use the key you've created. The value of the `key-identifier` property comes from the output when the key was created. This command may fail because of the time it takes to propagate access control changes. If this happens, retry after a few minutes.

[!INCLUDE [Set Media Services to use the key from Key Vault](./includes/task-set-encryption-cli.md)]

## Validation

To verify the account is encrypted using a Customer Managed Key, view the account encryption properties:

[!INCLUDE [Set Media Services to use the key from Key Vault](./includes/task-show-account-encryption-cli.md)]

The `type` property should show `CustomerKey` and the `currentKeyIdentifier` should be set to the path of a key in the customer’s Key Vault.

## Clean up resources

If you aren't planning to use the resources you created, delete the resource group.

[!INCLUDE [Create a Media Services account with the CLI](./includes/clean-up-resources-cli.md)]
