---
title: Access storage with a Media Services Managed Identity
description: If you would like to access a storage account when the storage account is configured to block requests from unknown IP addresses, the Media Services account must be granted access to the Storage account. Follow the steps below to create a Managed Identity for the Media Services account and grant this identity access to storage using the Media Services CLI.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: tutorial
ms.date: 05/17/2021
ms.author: inhenkel
---

# Tutorial: Access storage with a Media Services Managed Identity

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

If you would like to access a storage account when the storage account is configured to block requests from unknown IP addresses, the Media Services account must be granted access to the Storage account. Follow the steps below to create a Managed Identity for the Media Services account and grant this identity access to storage using the Media Services CLI.

:::image type="content" source="media/diagrams/managed-identities-scenario-storage-permissions-media-services-account.svg" alt-text="Media Services account uses a Managed Identity to access storage":::

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

## Grant the Media Services Managed Identity access to the Storage account

Grant the Media Services Managed Identity access to the Storage account. There are three commands:

### Get (show) the Managed Identity of the Media Services account

The first command below shows the Managed Identity of the Media Services account which is the `principalId` listed in the JSON returned by the command.

[!INCLUDE [Show the Managed Identity of a Media Services account with the CLI](./includes/task-show-account-managed-identity-cli.md)]

### Create the Storage Blob Contributor role assignment

[!INCLUDE [Create the Storage Blob Contributor role assignment](./includes/task-create-storage-blob-contributor-role-cli.md)]

### Create the Reader role assignment

[!INCLUDE [Create the Reader role assignment](./includes/task-create-reader-role-cli.md)]

## Use the Managed Identity to access the Storage account

[!INCLUDE [Use the Managed Identity to access the Storage account](./includes/task-set-storage-managed-identity-cli.md)]

## Validation

To verify the account is encrypted using a Customer Managed Key, view the account encryption properties:

[!INCLUDE [Set Media Services to use the key from Key Vault](./includes/task-show-account-managed-identity-cli.md)]

The `storageAuthentication` property should show “ManagedIdentity”.

For additional validation, you can check the Azure Storage logs to see which authentication method is used for each request.

## Clean up resources

If you aren't planning to use the resources you created, delete the resource group.

[!INCLUDE [Create a Media Services account with the CLI](./includes/clean-up-resources-cli.md)]
