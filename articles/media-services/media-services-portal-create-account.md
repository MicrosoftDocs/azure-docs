---
title: Create an Azure Media Services account with the Azure portal | Microsoft Docs
description: This tutorial walks you through the steps of creating an Azure Media Services account with the Azure portal.
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.assetid: c551e158-aad6-47b4-931e-b46260b3ee4c
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 09/03/2017
ms.author: juliako

---
# Create an Azure Media Services account using the Azure portal
> [!div class="op_single_selector"]
> * [Portal](media-services-portal-create-account.md)
> * [PowerShell](media-services-manage-with-powershell.md)
> * [REST](https://docs.microsoft.com/rest/api/media/mediaservice)
> 
> [!NOTE]
> To complete this tutorial, you need an Azure account. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/). 
> 
> 

The Azure portal provides a way to quickly create an Azure Media Services (AMS) account. You can use your account to access Media Services that enable you to store, encrypt, encode, manage, and stream media content in Azure. At the time you create a Media Services account, you also create an associated storage account (or use an existing one) in the same geographic region as the Media Services account.

This article explains some common concepts and shows how to create a Media Services account with the Azure portal.

> [!NOTE]
> For information about availability of Azure Media Services features in different regions, see [availability of AMS features across datacenters](scenarios-and-availability.md#availability).

## Concepts
Accessing Media Services requires two associated accounts:

* A Media Services account. Your account gives you access to a set of cloud-based Media Services that are available in Azure. A Media Services account does not store actual media content. Instead it stores metadata about the media content and media processing jobs in your account. At the time you create the account, you select an available Media Services region. The region you select is a data center that stores the metadata records for your account.
  
* An Azure storage account. Storage accounts must be located in the same geographic region as the Media Services account. When you create a Media Services account, you can either choose an existing storage account in the same region, or you can create a new storage account in the same region. If you delete a Media Services account, the blobs in your related storage account are not deleted.

  > [!NOTE]
  > Media Services restricts the primary storage account to be a **General Purpose Storage** account with Tables, Queues. For more information about storage types, see [About Azure storage accounts](https://docs.microsoft.com/azure/storage/common/storage-create-storage-account).

## Create an AMS account
The steps in this section show how to create an AMS account.

1. Log in at the [Azure portal](https://portal.azure.com/).
2. Click **+New** > **Web + Mobile** > **Media Services**.
   
    ![Media Services Create](./media/media-services-create-account/media-services-new1.png)
3. In **CREATE MEDIA SERVICES ACCOUNT** enter required values.
   
    ![Media Services Create](./media/media-services-create-account/media-services-new3.png)
   
   1. In **Account Name**, enter the name of the new AMS account. A Media Services account name is all lowercase letters or numbers with no spaces, and is 3 to 24 characters in length.
   2. In Subscription, select among the different Azure subscriptions that you have access to.
   3. In **Resource Group**, select the new or existing resource.  A resource group is a collection of resources that share lifecycle, permissions, and policies. Learn more [here](../azure-resource-manager/resource-group-overview.md#resource-groups).
   4. In **Location**,  select the geographic region that will be used to store the media and metadata records for your Media Services account. This  region will be used to process and stream your media. Only the available Media Services regions appear in the drop-down list box. 
   5. In **Storage Account**, select a storage account to provide blob storage of the media content from your Media Services account. You can select an existing storage account in the same geographic region as your Media Services account, or you can create a storage account. A new storage account is created in the same region. The rules for storage account names are the same as for Media Services accounts.
      
       Learn more about storage [here](../storage/common/storage-introduction.md).
   6. Select **Pin to dashboard** to see the progress of the account deployment.
4. Click **Create** at the bottom of the form.
   
    Once the account is successfully created, overview page loads. In the streaming endpoint table the account will have a default streaming endpoint in the **Stopped** state. 

    >[!NOTE]
    >When your AMS account is created a **default** streaming endpoint is added to your account in the **Stopped** state. To start streaming your content and take advantage of dynamic packaging and dynamic encryption, the streaming endpoint from which you want to stream content has to be in the **Running** state. 
   
## To manage your AMS account

To manage your AMS account (for example, connect to the AMS API programmatically, upload videos, encode assets, configure content protection, monitor job progress) select **Settings** on the left side of the portal. From the **Settings**, navigate to one of the available blades (for example: **API access**, **Assets**, **Jobs**, **Content protection**).


## Next steps

You can now upload files into your AMS account. For more information, see [Upload files](media-services-portal-upload-files.md).

If you plan to access AMS API programmatically, see [Access the Azure Media Services API with Azure AD authentication](media-services-use-aad-auth-to-access-ams-api.md).

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

