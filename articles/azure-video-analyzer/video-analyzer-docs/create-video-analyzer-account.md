---
title: Create an Azure Video Analyzer account 
description: This topic explains how to create an account for Azure Video Analyzer. 
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 05/01/2021
---

# Create a Video Analyzer account

To start using Azure Video Analyzer, you will need to create a Video Analyzer account. The account needs to be associated with a storage account and [user-assigned managed identity][docs-uami]. This article describes the steps for creating a new Video Analyzer account.

 You can use either the Azure portal or an Azure Resource Manager template to create a Video Analzyer account. Choose the tab for the method you would like to use.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## [Portal](#tab/portal/)

[!INCLUDE [the video analyzer account and storage account must be in the same subscription](./includes/note-account-storage-same-subscription.md)]

<!-- Use the portal to create a Video Analyzer account. -->

## Create a Video Analyzer account

1. Sign in at the [Azure portal](https://portal.azure.com/).
1. Using the search bar at the top, enter **Video Analyzer**.
1. Click on *Video Analyzers* under *Services*.
1. Click **Add**.
1. In the **Create Video Analyzer account** section enter required values.

    | Name | Description |
    | ---|---|
    |**Subscription**|If you have more than one subscription, select one from the list of Azure subscriptions that you have access to.|
    |**Resource Group**|Select the new or existing resource. A resource group is a collection of resources that share lifecycle, permissions, and policies. Learn more [here](../../../azure-resource-manager/management/overview.md#resource-groups).|
    |**Account Name**|Enter the name of the new Video Analyzer account. A Video Analyzer account name is all lowercase letters or numbers with no spaces, and is 3 to 24 characters in length.|
    |**Location**|Select the geographic region that will be used to store the video and metadata records for your Video Analyzer account. Only the available Video Analyzer regions appear in the drop-down list box. |
    |**Storage Account**|Select a storage account to provide blob storage of the video content from your Video Analyzer account. You can select an existing storage account in the same geographic region as your Video Analyzer account, or you can create a new storage account. A new storage account is created in the same region. The rules for storage account names are the same as for Video Analyzer accounts.<br/><br/>The Video Analyzer account and all associated storage accounts must be in the same Azure subscription. It is strongly recommended to use storage accounts in the same location as the Video Analyzer account to avoid additional latency and data egress costs.|
    |**TODO**| *Add content for managed identities*

1. Click **Review + ceate** at the bottom of the form.

## [CLI](#tab/template/)

[!INCLUDE [the video analyzer account and storage account must be in the same subscription](./includes/note-account-storage-same-subscription.md)]

<!-- links -->
[docs-uami]: /azure/active-directory/managed-identities-azure-resources/overview