---
title: Create an Azure Media Services account
description: This tutorial walks you through the steps of creating an Azure Media Services account.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: how-to
ms.date: 03/04/2022
ms.author: inhenkel
---
# Create a Media Services account

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

To start encrypting, encoding, analyzing, managing, and streaming media content in Azure, you need to create a Media Services account. The Media Services account needs to be associated with one or more storage accounts. This article describes steps for creating a new Azure Media Services account.

[!INCLUDE [note 2020-05-01 API](./includes/note-2020-05-01-account-creation.md)]

## Prerequisites

If you aren't familiar with the Azure Managed Identity platform, take some time to understand the platform and the differences between identity types.  A Media Services account default managed identity type is a user-managed identity.

- Read about the [Microsoft identity platform](../../active-directory/develop/app-objects-and-service-principals.md). 
- Read about [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).
- You might also want to take a few moments to read about [applications and service principals](../../active-directory/develop/app-objects-and-service-principals.md).

## Create an account
 
You can use either the Azure portal or the CLI to create a Media Services account. Choose the tab for the method you would like to use.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

<!-- NOTE: The following are in the includes folder and are reused in other How To articles. All task based content should be in the includes folder with the task- prefix prepended to the file name. -->

[!INCLUDE [the media services account and storage account must be in the same subscription](./includes/note-account-storage-same-subscription.md)]

## [Portal](#tab/portal/)

[!INCLUDE [create a media services account in the portal](./includes/task-create-media-services-account-portal.md)]

[!INCLUDE [enable a system-assigned managed identity](./includes/task-create-media-services-system-managed-identity.md)]

[!INCLUDE [add system assigned managed identity in the portal](./includes/task-storage-system-managed-identity-portal.md)]

[!INCLUDE [add encryption to media services account](./includes/task-security-encryption-managed-identity-portal.md)]

## [CLI](#tab/cli/)

<!-- Set the subscription -->

[!INCLUDE [Set the Azure subscription with CLI](./includes/task-set-azure-subscription-cli.md)]

<!-- Create a storage account -->

[!INCLUDE [Create a storage account with CLI](./includes/task-create-storage-account-cli.md)]

## Create a Media Services account

[!INCLUDE [Create a Media Services account with CLI](./includes/task-create-media-services-account-cli.md)]

## [REST](#tab/rest/)

See the Media Services [REST API](/rest/api/media/mediaservices/create-or-update).

---
