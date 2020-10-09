---
title: Create an Azure Media Services account
description: This tutorial walks you through the steps of creating an Azure Media Services account.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 08/31/2020
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

## Use the Azure portal

<!-- Move this section. This section should be moved to conceptual.  It doesn't belong in task based -->
The Azure portal provides a way to quickly create an Azure Media Services account. You can use your account to access Media Services that enable you to store, encrypt, encode, manage, and stream media content in Azure.

Currently, you can use the [Azure portal](https://portal.azure.com/) to:

* manage Media Services v3 [Live Events](live-events-outputs-concept.md), 
* view (not manage) v3 [Assets](assets-concept.md), 
* [get info about accessing APIs](./access-api-howto.md). 

For all other management tasks (for example, [Transforms and Jobs](transforms-jobs-concept.md) and [Content protection](content-protection-overview.md)), use the [REST API](https://aka.ms/ams-v3-rest-ref), [CLI](https://aka.ms/ams-v3-cli-ref), or one of the supported [SDKs](media-services-apis-overview.md#sdks).
<!-- Move this section. This section should be moved to conceptual.  It doesn't belong in task based -->

### Use the Azure portal to create a Media Services account

1. Sign in at the [Azure portal](https://portal.azure.com/).
1. Click **+Create a resource** > **Media** > **Media Services**.
1. In the **Create a Media Services account** section enter required values.

    | Name | Description |
    | ---|---|
    |**Account Name**|Enter the name of the new Media Services account. A Media Services account name is all lowercase letters or numbers with no spaces, and is 3 to 24 characters in length.|
    |**Subscription**|If you have more than one subscription, select one from the list of Azure subscriptions that you have access to.|
    |**Resource Group**|Select the new or existing resource. A resource group is a collection of resources that share lifecycle, permissions, and policies. Learn more [here](../../azure-resource-manager/management/overview.md#resource-groups).|
    |**Location**|Select the geographic region that will be used to store the media and metadata records for your Media Services account. This  region will be used to process and stream your media. Only the available Media Services regions appear in the drop-down list box. |
    |**Storage Account**|Select a storage account to provide blob storage of the media content from your Media Services account. You can select an existing storage account in the same geographic region as your Media Services account, or you can create a new storage account. A new storage account is created in the same region. The rules for storage account names are the same as for Media Services accounts.<br/><br/>You must have one **Primary** storage account and you can have any number of **Secondary** storage accounts associated with your Media Services account. You can use the Azure portal to add secondary storage accounts. For more information, see [Azure Storage accounts with Azure Media Services accounts](storage-account-concept.md).<br/><br/>The Media Services account and all associated storage accounts must be in the same Azure subscription. It is strongly recommended to use storage accounts in the same location as the Media Services account to avoid additional latency and data egress costs.|

1. Select **Pin to dashboard** to see the progress of the account deployment.
1. Click **Create** at the bottom of the form.

    When your Media Services account is created a **default** streaming endpoint is added to your account in the **Stopped** state. To start streaming your content and take advantage of [dynamic packaging](dynamic-packaging-overview.md) and [dynamic encryption](content-protection-overview.md), the streaming endpoint from which you want to stream content has to be in the **Running** state. 

## [CLI](#tab/cli/)

## Use the Azure CLI

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

* [Azure CLI](/cli/azure/ams?view=azure-cli-latest)
* [Attach a secondary storage to a Media Services account](/cli/azure/ams/account/storage?view=azure-cli-latest#az-ams-account-storage-add)

---

## Next steps

[Stream a file](stream-files-dotnet-quickstart.md)
