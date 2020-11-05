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

> [!NOTE]
> The Media Services account and all associated storage accounts must be in the same Azure subscription. It is strongly recommended to use storage accounts in the same location as the Media Services account to avoid additional latency and data egress costs.

 You can use either the Azure portal or the CLI to create a Media Services account. Choose the tab for the method you would like to use.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## [Portal](#tab/portal/)

[!INCLUDE [create a media services account in the portal](./includes/task-create-media-services-account-portal.md)]

## [CLI](#tab/cli/)

<!-- NOTE: The following are in the includes file and are reused in other How To articles. All task based content should be in the includes folder with the task- prefix prepended to the file name. -->

### Set the Azure subscription

[!INCLUDE [Set the Azure subscription with CLI](./includes/task-set-azure-subscription-cli.md)]

### Create a resource group

[!INCLUDE [Create a resource group with CLI](./includes/task-create-resource-group-cli.md)]

### Create a storage account

[!INCLUDE [Create a storage account with CLI](./includes/task-create-storage-account-cli.md)]

### Create a Media Services account

[!INCLUDE [Create a Media Services account with CLI](./includes/task-create-media-services-account-cli.md)]

### See also

* [Azure CLI](/cli/azure/ams?view=azure-cli-latest&preserve-view=true)
* [Attach a secondary storage to a Media Services account](/cli/azure/ams/account/storage?view=azure-cli-latest#az-ams-account-storage-add&preserve-view=true)

---

## Next steps

[Stream a file](stream-files-dotnet-quickstart.md)