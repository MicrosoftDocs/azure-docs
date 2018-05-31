---
title: Create a Video Indexer account connected to Azure | Microsoft Docs
description: This article shows how to create a Video Indexer account connected to Azure.
services: cognitive services
documentationcenter: ''
author: juliako
manager: erikre

ms.service: cognitive-services
ms.topic: article
ms.date: 05/30/2018
ms.author: juliako

---
# Create a Video Indexer account connected to Azure

Customers who have a Video Indexer free trial account are limited by the quota and the number of videos they can index. Video Indexer now enables customers to create a new Video Indexer account that is connected to their Azure subscriptions, which does not have these limitations and offers a pay as you go pricing.

This article shows how to create a Video Indexer account connected to Azure.

## Prerequisites

1. An Azure subscription. 

    If you don't have an account, you can create a free trial subscription in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/).

2. An Azure Active Directory domain. 

    If you don't have an Azure Active Directory, you can create it in your subscription.

3. A user in the Azure Active Directory, that will be used when connecting your Video Indexer account to Azure.

    This user should:

    * Be a member of your Azure Active Directory domain.

        Non-Azure AD users, such as outlook.com, live.com or hotmail.com users cannot be used for connecting to Azure.
        
        ![all AAD users](./media/create-account/all-aad-users.png)

    * Be a member of your subscription, with either an Owner role, or both Contributor and User Access Administrator roles.

        ![access control](./media/create-account/access-control-iam.png)

## Connect to Azure

To connect to Azure, sign in with that user and click on the **Connect to Azure** button:

![connect to Azure](./media/create-account/connect-to-azure.png)

A dialog with a list of user subscriptions appears.

![connect Video Indexer to Azure](./media/create-account/connect-vi-to-azure-subscription.png)

1. Select the one that you want to use.
2. Select the Azure region, which you want to use.

    Currently supported locations are: West US 2, North Europe, and East Asia.
3. Choose if you to use an existing Media Services account or provision a new Media Services account into your Azure subscription.

    * If you prefer a new Media Services account provisioned to your Azure subscription, click on **Create a new resource group** and provide a name for the resource group to be created. 

        The new Media services account will be created with a new Storage account and with a default initial configuration of a Streaming Endpoint and 10 S3 Reserved Units.     
    * If you prefer to use an existing Media Services account, it must reside in the same region as the Video Indexer account.

        It is recommended to adjust the type and number of Reserved Units of your Media Services account to "10 S3 Reserved Units", otherwise indexing might run for a long duration and with a low throughput.
        
You may also connect to an existing Media Services account using the manual configuration, by clicking on "Switch to manual configuration", where you can provide the following necessary information:

![connect Video Indexer to Azure](./media/create-account/connect-vi-to-azure-subscription-2.png)

To connect to Azure, click **Connect**. This operation may take up to a few minutes.

Once you connect to Azure, you see your new Video Indexer account in the accounts drop down:

![new account](./media/create-account/new-account.png)

Navigate to your new account:  

![Video Indexer account](./media/create-account/vi-account.png)

## Considerations

The following Azure Media Services related considerations apply:

* If you connected to a new Media Services account, you will see a new Resource Group, Media Services account, and a Storage account in your Azure subscription.
* If you connected to a new Media Services account, Video Indexer will set the media **Reserved Units** to 10 S3 units:

    ![Media Services reserved units](./media/create-account/ams-reserved-units.png)

* If you connected to an existing Media Services account, Video Indexer does not change the existing media **Reserved Units** configuration.

    You might need to adjust the type and number of media **Reserved Units**, according to your planned load. Keep in mind that if your load is high and you don’t have enough units or speed, videos processing can result in timeout failures.

* If you connected to a new Media Services account, Video Indexer automatically starts a **Streaming Endpoint** in it:

    ![Media Services streaming endpoint](./media/create-account/ams-streaming-endpoint.png)

* If you connected to an existing Media Services account, Video Indexer does not change the streaming endpoints configuration. If there is no running **Streaming Endpoint**, you will not be able to watch videos from this Media Services account or in Video Indexer.

## Use Video Indexer APIs v2

You can programmatically interact with your trial account and/or with your Video Indexer accounts that are connected to azure by following the instructions in: [Use APIs](video-indexer-use-apis.md).

You should use the same Azure Active Directory user you used when connecting to Azure.

## Next steps

[Examine details of the output JSON](video-indexer-output-json-v2.md).

