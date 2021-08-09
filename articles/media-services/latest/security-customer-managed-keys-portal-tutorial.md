---
title: Use customer-managed keys or BYOK portal
description: In this tutorial, use the Azure portal to enable customer-managed keys or bring your own key (BYOK) with an Azure Media Services storage account.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: tutorial
ms.date: 10/18/2020
---

# Tutorial: Use the Azure portal to use customer-managed keys or BYOK with Media Services

With the 2020-05-01 API, you can use a customer-managed RSA key with an Azure Media Services account that has a system-managed identity.This tutorial covers the steps in the Azure portal.

The services used are:

- Azure Storage
- Azure Key Vault
- Azure Media Services

In this tutorial, you'll learn to use the Azure portal to:

> [!div class="checklist"]
> - Create a resource group.
> - Create a storage account with a system-managed identity.
> - Create a Media Services account with a system-managed identity.
> - Create a key vault for storing a customer-managed RSA key.

## Prerequisites

An Azure subscription.

If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free/).

## System-managed keys

<!-- Create a resource group -->
[!INCLUDE [create a resource group in the portal](./includes/task-create-resource-group-portal.md)]

> [!IMPORTANT]
> For the following storage account creation steps, you will select the system-managed key choice in Advanced settings.

<!-- Create a media services account -->

[!INCLUDE [create a media services account in the portal](./includes/task-create-media-services-account-portal.md)]

<!-- Create a key vault -->

[!INCLUDE [create a key vaultl](./includes/task-create-key-vault-portal.md)]

<!-- Enable CMK BYOK on the account -->
[!INCLUDE [enable CMK](./includes/task-enable-cmk-byok-portal.md)]

> [!IMPORTANT]
> For the following storage encryption steps, you will select the **customer-managed key choice**.

<!-- Set encryption for storage account -->
[!INCLUDE [Set encryption for storage account](./includes/task-set-storage-encryption-portal.md)]

## Change the key

Media Services automatically detects when the key is changed. OPTIONAL: To test this process, create another key version for the same key. Media Services should detect that the key has been changed.

## Clean up resources

If you're not going to continue to use the resources that you created and *you don't want to continue to be billed*, delete them.

## Next steps

Go to the next article to learn how to:
> [!div class="nextstepaction"]
> [Encode a remote file based on URL and stream the video with REST](stream-files-tutorial-with-rest.md)
