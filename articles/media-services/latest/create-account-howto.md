---
title: Create an Azure Media Services account
description: This tutorial walks you through the steps of creating an Azure Media Services account.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 03/15/2020
ms.author: juliako

---
# Create a Media Services account

To start encrypting, encoding, analyzing, managing, and streaming media content in Azure, you need to create a Media Services account. The Media Services account needs to be associated with one or more storage accounts.

> [!NOTE]
> The Media Services account and all associated storage accounts must be in the same Azure subscription. It is strongly recommended to use storage accounts in the same location as the Media Services account to avoid additional latency and data egress costs.

This article describes steps for creating a new Azure Media Services account. Choose from the following tabs.

## Use the Azure portal

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

The Azure portal provides a way to quickly create an Azure Media Services account. You can use your account to access Media Services that enable you to store, encrypt, encode, manage, and stream media content in Azure.

Currently, you can use the [Azure portal](https://portal.azure.com/) to:

* manage Media Services v3 [Live Events](live-events-outputs-concept.md), 
* view (not manage) v3 [Assets](assets-concept.md), 
* [get info about accessing APIs](access-api-portal.md). 

For all other management tasks (for example, [Transforms and Jobs](transforms-jobs-concept.md) and [Content protection](content-protection-overview.md)), use the [REST API](https://aka.ms/ams-v3-rest-ref), [CLI](https://aka.ms/ams-v3-cli-ref), or one of the supported [SDKs](media-services-apis-overview.md#sdks).

This article shows how to create a Media Services account using the Azure portal.

### Create a Media Services account

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

## Use the Azure CLI

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

### Set the Azure subscription

In the following command, provide the Azure subscription ID that you want to use for the Media Services account. You can see a list of subscriptions that you have access to by navigating to [Subscriptions](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade).

```azurecli
az account set --subscription mySubscriptionId
```

### Create a resource group

Create a resource group using the following command. An Azure resource group is a logical container into which resources like Azure Media Services accounts and the associated Storage accounts are deployed and managed.

You can substitute `amsResourceGroup` with your value.

```azurecli
az group create --name amsResourceGroup --location westus2
```

### Create a storage account

When creating a Media Services account, you need to supply the name of an Azure Storage account resource. The specified storage account is attached to your Media Services account. For more information about how storage accounts are used in Media Services, see [Storage accounts](storage-account-concept.md).

You must have one **Primary** storage account and you can have  any number of **Secondary** storage accounts associated with your Media Services account. Media Services supports **General-purpose v2** (GPv2) or **General-purpose v1** (GPv1) accounts. Blob only accounts are not allowed as **Primary**. If you want to learn more about storage accounts, see [Azure Storage account options](../../storage/common/storage-account-options.md). 

In this example, we create a General Purpose v2, Standard LRS account. If you want to experiment with storage accounts, use `--sku Standard_LRS`. However, when picking a SKU for production you should consider, `--sku Standard_RAGRS`, which provides geographic replication for business continuity. For more information, see [storage accounts](https://docs.microsoft.com/cli/azure/storage/account?view=azure-cli-latest).
 
The following command creates a Storage account that is going to be associated with the Media Services account. In the script below, you can substitute `storageaccountforams` with your value. `amsResourceGroup` must match the value you gave for the resource group in the previous step. The storage account name must have length less than 24.

```azurecli
az storage account create --name storageaccountforams \  
  --kind StorageV2 \
  --sku Standard_LRS \
  -l westus2 \
  -g amsResourceGroup
```

### Create a Media Services account

The following Azure CLI command creates a new Media Services account. You can replace the following values: `amsaccount`  `storageaccountforams` (must match the value you gave for your storage account), and `amsResourceGroup` (must match the value you gave for the resource group).

```azurecli
az ams account create --name amsaccount \
   -g amsResourceGroup --storage-account storageaccountforams \
   -l westus2 
```

### See also

* [Azure CLI](https://docs.microsoft.com/cli/azure/ams?view=azure-cli-latest)
* [Attach a secondary storage to a Media Services account](https://docs.microsoft.com/cli/azure/ams/account/storage?view=azure-cli-latest#az-ams-account-storage-add)

---

## Next steps

[Stream a file](stream-files-dotnet-quickstart.md)
