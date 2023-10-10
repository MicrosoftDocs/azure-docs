---
title: Repair the connection to Azure, check errors/warnings
description: Learn how to manage an Azure AI Video Indexer account connected to Azure repair the connection, examine errors/warnings.
ms.topic: how-to
ms.date: 01/14/2021
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Repair the connection to Azure, examine errors/warnings

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

This article demonstrates how to manage an Azure AI Video Indexer account that's connected to your Azure subscription and an Azure Media Services account.

> [!NOTE]
> You have to be the Azure AI Video Indexer account owner to do account configuration adjustments discussed in this topic.

## Prerequisites

Connect your Azure AI Video Indexer account to Azure, as described in [Connected to Azure](connect-to-azure.md).

Make sure to follow [Prerequisites](connect-to-azure.md#prerequisites-for-connecting-to-azure) and review [Considerations](connect-to-azure.md#azure-media-services-considerations) in the article.

## Examine account settings

This section examines settings of your Azure AI Video Indexer account.

To view settings:

1. Click on the user icon in the top-right corner and select **Settings**.

    ![Settings in Azure AI Video Indexer](./media/manage-account-connected-to-azure/select-settings.png)

2. On the **Settings** page, select the **Account** tab.

If your Videos Indexer account is connected to Azure, you see the following things:

* The name of the underlying Azure Media Services account.
* The number of indexing jobs running and queued.
* The number and type of allocated reserved units.

If your account needs some adjustments, you'll see relevant errors and warnings about your account configuration on the **Settings** page. The messages contain links to exact places in Azure portal where you need to make changes. For more information, see the [errors and warnings](#errors-and-warnings) section that follows.

## Repair the connection to Azure

In the **Update connection to Azure Media Services** dialog of your [Azure AI Video Indexer](https://www.videoindexer.ai/) page, you're asked to provide values for the following settings:

|Setting|Description|
|---|---|
|Azure subscription ID|The subscription ID can be retrieved from the Azure portal. Click on **All services** in the left panel and search for "subscriptions". Select **Subscriptions** and choose the desired ID from the list of your subscriptions.|
|Azure Media Services resource group name|The name for the resource group in which you created the Media Services account.|
|Application ID|The Azure AD application ID (with permissions for the specified Media Services account) that you created for this Azure AI Video Indexer account. <br/><br/>To get the app ID, navigate to Azure portal. Under the Media Services account, choose your account and go to **API Access**. Select **Connect to Media Services API with service principal** -> **Azure AD App**. Copy the relevant parameters.|
|Application key|The Azure AD application key associated with your Media Services account that you specified above. <br/><br/>To get the app key, navigate to Azure portal. Under the Media Services account, choose your account and go to **API Access**. Select **Connect to Media Services API with service principal** -> **Manage application** -> **Certificates & secrets**. Copy the relevant parameters.|

## Errors and warnings

If your account needs some adjustments, you see relevant errors and warnings about your account configuration on the **Settings** page. The messages contain links to exact places in Azure portal where you need to make changes. This section gives more details about the error and warning messages.

* Event Grid

    You have to register the Event Grid resource provider using the Azure portal. In the [Azure portal](https://portal.azure.com/), go to **Subscriptions** > [subscription] > **ResourceProviders** > **Microsoft.EventGrid**. If not in the **Registered** state, select **Register**. It takes a couple of minutes to register.

* Streaming endpoint

    Make sure the underlying Media Services account has the default **Streaming Endpoint** in a started state. Otherwise, you can't watch videos from this Media Services account or in Azure AI Video Indexer.

* Media reserved units

    You must allocate Media Reserved Units on your Media Service resource in order to index videos. For optimal indexing performance, it's recommended to allocate at least 10 S3 Reserved Units. For pricing information, see the FAQ section of the [Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/) page.

## Next steps

You can programmatically interact with your trial account or Azure AI Video Indexer accounts that are connected to Azure by following the instructions in: [Use APIs](video-indexer-use-apis.md).

Use the same Azure AD user you used when connecting to Azure.
