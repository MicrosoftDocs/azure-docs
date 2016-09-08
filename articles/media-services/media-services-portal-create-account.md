<properties
	pageTitle=" Create an Azure Media Services account with the Azure portal | Microsoft Azure"
	description="This tutorial walks you through the steps of creating an Azure Media Services account with the Azure portal."
	services="media-services"
	documentationCenter=""
	authors="Juliako"
	manager="erikre"
	editor=""/>

<tags
	ms.service="media-services"
	ms.workload="media"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="09/07/2016"
	ms.author="juliako"/>


# Create an Azure Media Services account with the Azure portal

> [AZURE.SELECTOR]
- [Portal](media-services-portal-create-account.md)
- [PowerShell](media-services-manage-with-powershell.md)
- [REST](http://msdn.microsoft.com/library/azure/dn194267.aspx)

> [AZURE.NOTE] To complete this tutorial, you need an Azure account. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/). 

The Azure portal provides a way to quickly create an Azure Media Services (AMS) account. You can use your account to access Media Services that enable you to store, encrypt, encode, manage, and stream media content in Azure. At the time you create a Media Services account, you also create an associated storage account (or use an existing one) in the same geographic region as the Media Services account.

This article explains some common concepts and shows how to create a Media Services account with the Azure portal.

## Concepts

Accessing Media Services requires two associated accounts:

- A Media Services account. Your account gives you access to a set of cloud-based Media Services that are available in Azure. A Media Services account does not store actual media content. Instead it stores metadata about the media content and media processing jobs in your account. At the time you create the account, you select an available Media Services region. The region you select is a data center that stores the metadata records for your account.

	Available Media Services (AMS) regions include the following: North Europe, West Europe, West US, East US, Southeast Asia, East Asia, Japan West, Japan East. Media Services does not use affinity groups.
	
	AMS is now also available in the following data centers: Brazil South, India West, India South, and India Central. You can now use the Azure  portal to create Media Service accounts and perform various tasks described here. However, Live Encoding is not enabled in these data centers. Further, not all types of Encoding Reserved Units are available in these data centers.
	
	- Brazil South: Only Standard and Basic Encoding Reserved Units are available.
	- India West, India South: Provide storage blobs for media files; storage accounts must be located in the same geographic region as the Media Services account. When you create a Media Services account, you can either choose an existing storage account in the same region, or you can create a new storage account in the same region. If you delete a Media Services account, the blobs in your related storage account are not deleted.

## Create an AMS account

The steps in this section show how to create an AMS account.

1. Log in at the [Azure portal](https://portal.azure.com/).
2. Click **+New** > **Media + CDN** > **Media Services**.

	![Media Services Create](./media/media-services-portal-vod-get-started/media-services-new1.png)

3. In **CREATE MEDIA SERVICES ACCOUNT** enter required values.

	![Media Services Create](./media/media-services-portal-vod-get-started/media-services-new3.png)
	
	1. In **Account Name**, enter the name of the new AMS account. A Media Services account name is all lowercase numbers or letters with no spaces, and is 3 to 24 characters in length.
	2. In Subscription, select among the different Azure subscriptions that you have access to.
	
	2. In **Resource Group**, select the new or existing resource.  A resource group is a collection of resources that share lifecycle, permissions, and policies. Learn more [here](resource-group-overview.md#resource-groups).
	3. In **Location**,  select the geographic region that will be used to store the media and metadata records for your Media Services account. This  region will be used to process and stream your media. Only the available Media Services regions appear in the drop-down list box. 
	
	3. In **Storage Account**, select a storage account to provide blob storage of the media content from your Media Services account. You can select an existing storage account in the same geographic region as your Media Services account, or you can create a storage account. A new storage account is created in the same region. The rules for storage account names are the same as for Media Services accounts.

		Learn more about storage [here](storage-introduction.md).

	4. Select **Pin to dashboard** to see the progress of the account deployment.
	
7. Click **Create** at the bottom of the form.

	Once the account is successfully created, the status changes to **Running**. 

	![Media Services settings](./media/media-services-portal-vod-get-started/media-services-settings.png)

	To manage your AMS account (for example, upload videos, encode assets, monitor job progress) use the **Settings** window.

## Manage Keys

You need the account name and the primary key information to programmatically access the Media Services account.

1. In the Azure portal, select your account. 

	The **Settings** window appears on the right. 

2. In the **Settings** window, select **Keys**. 

	The **Manage keys** windows shows the account name and the primary and secondary keys is displayed. 
3. Press the copy button to copy the values.
	
	![Media Services Keys](./media/media-services-portal-vod-get-started/media-services-keys.png)

## Next steps

You can now upload files into your AMS account. For more information, see [Upload files](media-services-portal-upload-files.md).

## Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]


