---
title: Manage a Video Indexer account connected to Azure | Microsoft Docs
description: This article shows how to manage a Video Indexer account connected to Azure.
services: cognitive services
documentationcenter: ''
author: juliako
manager: erikre

ms.service: cognitive-services
ms.topic: article
ms.date: 08/21/2018
ms.author: juliako

---
# Manage a Video Indexer account connected to Azure

This article demonstrates how to manage a Video Indexer account that is connected to your Azure subscription and an Azure Media Services account.

## Prerequisites

Connect your Video Indexer account to Azure, as described in [Connected to Azure](connect-to-azure.md). 

Make sure to follow [Prerequisites](connect-to-azure.md#prerequisites) described and review [Considerations](connect-to-azure.md#considerations) in the article.

## Examine account settings

This section examines settings of your Video Indexer account.

To view settings:

1. Click on the user icon in the right top corner and select settings.

    ![Settings](./media/manage-account-connected-to-azure/select-settings.png)

2. On the **Settings** page, select the **Account** tab.

If your Videos Indexer account is connected to Azure, you see the following:

* The name of the underlying Azure Media Services account.
* The number of indexing jobs running and queued.
* The number and type of allocated Reserved Units.

If your account needs some adjustments, you will see relevant errors and warnings about your account configuration on the **Settings** page. The messages contain links to exact places in Azure portal where you need to make changes. For more information, see the [errors and warnings](#errors-and-warnings) section that follows.

## Auto-scale reserved units

The **Settings** page enables you to set the autoscaling of reserved units. If the option is **On**, you can allocate the maximum number of Reserved Units and Video Indexer will stop and start them automatically. With this option, you don't pay extra money for idle time but also do not wait for indexing jobs to complete a long time when the indexing load is high.

![Sign up](./media/manage-account-connected-to-azure/autoscale-reserved-units.png)

## Errors and warnings

If your account needs some adjustments, you will see relevant errors and warnings about your account configuration on the **Settings** page. The messages contain links to exact places in Azure portal where you need to make changes. This sections gives more details about the error and warning messages.

* Event Grid not registered

    You have to register the EventGrid resource provider using the Azure portal, as described in [xxx]().

* Streaming Endpoint disabled
* Reserved units configuration issues 

## Billing for Media Reserved Units

You are charged based on actual minutes of usage of Media Reserved Units. For a detailed explanation, see the FAQ section of the [Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/) page.   

## Next steps

You can programmatically interact with your trial account and/or with your Video Indexer accounts that are connected to azure by following the instructions in: [Use APIs](video-indexer-use-apis.md).

You should use the same Azure AD user you used when connecting to Azure.
