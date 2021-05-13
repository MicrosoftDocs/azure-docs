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

## Resource names

Before you get started, decide on the names of the resources you will create.  They should be easily identifiable as a set, especially if you are not planning to use them after you are done testing. For example, "myMediaTestRG" for your resource group and "myMediaTestStorageAccount".  The names of resources you'll need are:

- your-resource-group-name
- your-storage-account-name
- your-media-services-account-name

<!--- your-keyvault-name
- your-key-name
- your-region-->

You'll see these names referenced in the commands below. Use the same names for each step.

## Create a resource group

[!INCLUDE [Create a resource group with the CLI](./includes/task-create-resource-group-cli.md)]

## Create a Storage account

[!INCLUDE [Create a Storage account with the CLI](./includes/task-create-storage-account-cli.md)]

## Create a Media Services account

[!INCLUDE [Create a Media Services account with the CLI](./includes/task-create-media-services-account-cli.md)]

## Grant the Media Services Managed Identity access to the Storage Account

Grant the Media Services Managed Identity access to the Storage account. There are two commands:

### Get (show) the Managed Identity of the Media Services account

The first command below shows the Managed Identity of the Media Services account which is the `principalId`. 

```azurecli-interactive
az ams account show --name your-media-services-account-name --resource-group your-resource-group
```

The command returns:

The `principalId` will be used in the next step as the `assignee`. The `scope` is the ID from the storage account creation request.

### Set the Key Vault policy

The second command grants the Principal ID access to the Key Vault. Set `object-id` to the value of `principalId`.

```azurecli-interactive
az keyvault set-policy \
  --name your-keyvault-name \
  --object-id the-prinicpal-id-of-the-Media-Services-account \
  --key-permissions decrypt encrypt get list unwrapKey wrapKey
```

### Set Media Services to use the key from Key Vault

Set Media Services to use the key you've created. The value of the `key-identifier` property comes from the output when the key was created. This command may fail due to the time it takes to propagate access control changes. If this happens, retry after a few minutes.

```azurecli
az ams account encryption set \
  --account-name your-media-services-account-name \
  --resource-group your-resource-group \
  --key-type CustomerKey \
  --key-identifier https://your-keyvault-name.vault.azure.net/keys/mediakey/abc
```

## Test

**MISSING: STEPS FOR TESTING GO HERE.**

## Clean up resources

If you aren't planning to use the resources you created, delete the resource group.

[!INCLUDE [Create a Media Services account with the CLI](./includes/clean-up-resources-cli.md)]
