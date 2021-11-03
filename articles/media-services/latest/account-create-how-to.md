---
title: Create an Azure Media Services account
description: This tutorial walks you through the steps of creating an Azure Media Services account.
services: media-services
author: IngridAtMicrosoft
manager: femila

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 11/4/2020
ms.author: inhenkel
ms.custom: devx-track-azurecli

---
# Create a Media Services account

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

To start encrypting, encoding, analyzing, managing, and streaming media content in Azure, you need to create a Media Services account. The Media Services account needs to be associated with one or more storage accounts. This article describes steps for creating a new Azure Media Services account.

[!INCLUDE [note 2020-05-01 API](./includes/note-2020-05-01-account-creation.md)]

 You can use either the Azure portal or the CLI to create a Media Services account. Choose the tab for the method you would like to use.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

<!-- NOTE: The following are in the includes folder and are reused in other How To articles. All task based content should be in the includes folder with the task- prefix prepended to the file name. -->

## [Portal](#tab/portal/)

[!INCLUDE [the media services account and storage account must be in the same subscription](./includes/note-account-storage-same-subscription.md)]

[!INCLUDE [create a media services account in the portal](./includes/task-create-media-services-account-portal.md)]

## [CLI](#tab/cli/)

[!INCLUDE [the media services account and storage account must be in the same subscription](./includes/note-account-storage-same-subscription.md)]

## Set the Azure subscription

[!INCLUDE [Set the Azure subscription with CLI](./includes/task-set-azure-subscription-cli.md)]

## Create a resource group

[!INCLUDE [Create a resource group with CLI](./includes/task-create-resource-group-cli.md)]

## Create a storage account

When creating a Media Services account, you need to supply the name of an Azure Storage account resource. The specified storage account is attached to your Media Services account. For more information about how storage accounts are used in Media Services, see [Storage accounts](storage-account-concept.md).

You must have one **Primary** storage account and you can have  any number of **Secondary** storage accounts associated with your Media Services account. Media Services supports **General-purpose v2** (GPv2) or **General-purpose v1** (GPv1) accounts. Blob only accounts are not allowed as **Primary**. If you want to learn more about storage accounts, see [Azure Storage account options](../../storage/common/storage-account-overview.md).

In this example, we create a General Purpose v2, Standard LRS account. If you want to experiment with storage accounts, use `--sku Standard_LRS`. However, when picking a SKU for production you should consider, `--sku Standard_RAGRS`, which provides geographic replication for business continuity. For more information, see [storage accounts](/cli/azure/storage/account).

[!INCLUDE [Create a storage account with CLI](./includes/task-create-storage-account-cli.md)]

## Create a Media Services account

[!INCLUDE [Create a Media Services account with CLI](./includes/task-create-media-services-account-cli.md)]

---

## Next steps

[Stream a file](stream-files-dotnet-quickstart.md)