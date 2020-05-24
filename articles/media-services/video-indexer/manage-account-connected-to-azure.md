---
title: Manage a Video Indexer account
titleSuffix: Azure Media Services
description: Learn how to manage a Video Indexer account connected to Azure.
services: media-services
author: Juliako
manager: femila
ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 12/16/2019
ms.author: juliako
---

# Manage a Video Indexer account connected to Azure

This article demonstrates how to manage a Video Indexer account that's connected to your Azure subscription and an Azure Media Services account.

> [!NOTE]
> You have to be the Video Indexer account owner to do account configuration adjustments discussed in this topic.

## Prerequisites

Connect your Video Indexer account to Azure, as described in [Connected to Azure](connect-to-azure.md).

Make sure to follow [Prerequisites](connect-to-azure.md#prerequisites) and review [Considerations](connect-to-azure.md#considerations) in the article.

## Examine account settings

This section examines settings of your Video Indexer account.

To view settings:

1. Click on the user icon in the top-right corner and select **Settings**.

    ![Settings in Video Indexer](./media/manage-account-connected-to-azure/select-settings.png)

2. On the **Settings** page, select the **Account** tab.

If your Videos Indexer account is connected to Azure, you see the following things:

* The name of the underlying Azure Media Services account.
* The number of indexing jobs running and queued.
* The number and type of allocated reserved units.

If your account needs some adjustments, you'll see relevant errors and warnings about your account configuration on the **Settings** page. The messages contain links to exact places in Azure portal where you need to make changes. For more information, see the [errors and warnings](#errors-and-warnings) section that follows.

## Repair the connection to Azure

In the **Update connection to Azure Media Services** dialog of your [Video Indexer](https://www.videoindexer.ai/) page, you're asked to provide values for the following settings:

|Setting|Description|
|---|---|
|Azure subscription ID|The subscription ID can be retrieved from the Azure portal. Click on **All services** in the left panel and search for "subscriptions". Select **Subscriptions** and choose the desired ID from the list of your subscriptions.|
|Azure Media Services resource group name|The name for the resource group in which you created the Media Services account.|
|Application ID|The Azure AD application ID (with permissions for the specified Media Services account) that you created for this Video Indexer account. <br/><br/>To get the app ID, navigate to Azure portal. Under the Media Services account, choose your account and go to **API Access**. Select **Connect to Media Services API with service principal** -> **Azure AD App**. Copy the relevant parameters.|
|Application key|The Azure AD application key associated with your Media Services account that you specified above. <br/><br/>To get the app key, navigate to Azure portal. Under the Media Services account, choose your account and go to **API Access**. Select **Connect to Media Services API with service principal** -> **Manage application** -> **Certificates & secrets**. Copy the relevant parameters.|

## Autoscale reserved units

The **Settings** page enables you to set the autoscaling of media reserved units (RU). If the option is **On**, you can allocate the maximum number of RUs and be sure that Video Indexer stops/starts RUs automatically. With this option, you don't pay extra money for idle time but also don't wait for indexing jobs to complete a long time when the indexing load is high.

Autoscale doesn't scale below 1 RU or above the default limit of the Media Services account. To increase the limit, create a service request. For information about quotas and limitations and how to open a support ticket, see [Quotas and limitations](../../media-services/previous/media-services-quotas-and-limitations.md).

![Autoscale reserved units Video Indexer](./media/manage-account-connected-to-azure/autoscale-reserved-units.png)

## Errors and warnings

If your account needs some adjustments, you see relevant errors and warnings about your account configuration on the **Settings** page. The messages contain links to exact places in Azure portal where you need to make changes. This section gives more details about the error and warning messages.

* EventGrid

    You have to register the EventGrid resource provider using the Azure portal. In the [Azure portal](https://portal.azure.com/), go to **Subscriptions** > [subscription] > **ResourceProviders** > **Microsoft.EventGrid**. If not in the **Registered** state, select **Register**. It takes a couple of minutes to register.

* Streaming endpoint

    Make sure the underlying Media Services account has the default **Streaming Endpoint** in a started state. Otherwise, you can't watch videos from this Media Services account or in Video Indexer.

* Media reserved units

    You must allocate Media Reserved Units on your Media Service resource in order to index videos. For optimal indexing performance, it's recommended to allocate at least 10 S3 Reserved Units. For pricing information, see the FAQ section of the [Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/) page.

## Next steps

You can programmatically interact with your trial account or Video Indexer accounts that are connected to Azure by following the instructions in: [Use APIs](video-indexer-use-apis.md).

Use the same Azure AD user you used when connecting to Azure.
