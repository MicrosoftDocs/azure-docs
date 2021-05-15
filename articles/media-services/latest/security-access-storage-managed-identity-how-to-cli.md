---
title: Allow a Media Services account access to a storage account with a Managed Identity
description: Learn how to use the Azure Media Services CLI to access a storage account when the storage account is configured to block requests from unknown IP.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: how-to
ms.date: 05/12/2021
ms.author: inhenkel
---

# Allow a Media Services account access to a storage account with a Managed Identity

If you want Media Services to access a storage account that has blocked requests from the internet, configure Media Services to use a Managed Identity. When this access is used, storage allows Media Services to bypass the normal network ACL restrictions. You'll want to do this especially if you are planning to use Private Link.

## Sign in to Azure

To use any of the commands in this article you first have to be logged in to the subscription that you want to use.

 [!INCLUDE [Sign in to Azure with the CLI](./includes/task-sign-in-azure-cli.md)]

## Resource names

Before you get started, decide on the names of the resources you'll create.  They should be easily identifiable as a set, especially if you are not planning to use them after you are done testing. Naming rules are different for many resource types so it's best to stick with all lower case. For example, "media-test1-rg" for your resource group name and "media-test1-stor" for your storage account name. It isn't required to use hyphens.  However, use the same names for each step in this article.

You'll see these names referenced in the commands below.  The names of resources you'll need are:

- your-resource-group-name
- your-storage-account-name
- your-media-services-account-name
- your-region

### List Azure regions

If you're not sure of what the region name is for the API, use this command to get a listing.

[!INCLUDE [Sign in to Azure with the CLI](./includes/task-sign-in-azure-cli.md)]

## Create a Storage account

[!INCLUDE [Create a Storage account with the CLI](./includes/task-create-storage-account-cli.md)]

## Create a resource group

[!INCLUDE [Create a resource group with the CLI](./includes/task-create-resource-group-cli.md)]

## Create a Media Services account

[!INCLUDE [Create a Media Services account with the CLI](./includes/task-create-media-services-account-cli.md)]

## Grant the Media Services Managed Identity access to the Storage Account

Grant the Media Services Managed Identity access to the Storage account. There are two commands:

### Get (show) the Managed Identity of the Media Services account

The first command below shows the Managed Identity of the Media Services account which is the `mediaServiceId`.

[!INCLUDE [Show the Managed Identity of a Media Services account with the CLI](./includes/task-show-account-managed-identity-cli.md)]

### Assign the Managed Identity the Storage Blog Contributor role

This command gives the Media Services account the *Storage Blog Contributor* role and uses the `mediaServiceId` value for the `assignee` value.

```azurecli-interactive
az role assignment create \
  --assignee the-media-service-id \
  --role "Storage Blob Data Contributor" \
  --scope "/subscriptions/00000000-0000-0000-000000000000/resourceGroups/your-resource-group-name/providers/Microsoft.Storage/storageAccounts/your-storage-account-name"
```

Example JSON response:

```json
jason goes here
```

This command gives the Media Services account the role of *Reader* and also uses the `mediaServiceId` value for the `assignee` value.

```azurecli-interactive
az role assignment create \
  --assignee the-media-service-id \
  --role "Reader" \
  --scope "/subscriptions/00000000-0000-0000-000000000000/resourceGroups/your-resource-group-name/providers/Microsoft.Storage/storageAccounts/your-storage-account-name"
```
Example JSON response:

```json
json goes here
```

## Configure the Media Services account to access the Storage account using the Managed Identity

This command give access to the Storage account using the Managed Identity

az ams account storage set-authentication \
  --storage-auth ManagedIdentity \
  --resource-group your-resource-group-name \
  --account-name your-media-services-account-name

Example JSON response:

## Validation

**MISSING: STEPS FOR TESTING GO HERE.**

## Clean up resources

If you aren't planning to use the resources you created, delete the resource group.

[!INCLUDE [Create a Media Services account with the CLI](./includes/clean-up-resources-cli.md)]
