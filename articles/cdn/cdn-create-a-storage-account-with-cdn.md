---
title: Integrate an Azure storage account with Azure CDN | Microsoft Docs
description: Learn how to use the Azure Content Delivery Network (CDN) to deliver high-bandwidth content by caching blobs from Azure Storage.
services: cdn
documentationcenter: ''
author: zhangmanling
manager: erikre
editor: ''

ms.assetid: cbc2ff98-916d-4339-8959-622823c5b772
ms.service: cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/04/2018
ms.author: mazha

---
# Integrate an Azure storage account with Azure CDN
You can enable Azure Content Delivery Network (CDN) to cache content from Azure storage. Azure CDN offers developers a global solution for delivering high-bandwidth content. It can cache blobs and static content of compute instances at physical nodes in the United States, Europe, Asia, Australia, and South America.

## Step 1: Create a storage account
Use the following procedure to create a new storage account for an Azure subscription. A storage account gives access to
Azure Storage services. The storage account represents the highest level
of the namespace for accessing each of the Azure Storage service components: Azure Blob, Queue, and Table storage. For more information, see [Introduction to Microsoft Azure Storage](../storage/common/storage-introduction.md).

To create a storage account, you must be either the service
administrator or a coadministrator for the associated subscription.

> [!NOTE]
> You can use several methods to create a storage account, including the Azure portal and PowerShell. This tutorial demonstrates how to use the Azure portal.   
> 

**To create a storage account for an Azure subscription**

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the upper-left corner, select **Create a resource**. In the **New** pane, select **Storage**, and then select **Storage account - blob, file, table, queue**.
	
	The **Create storage account** pane appears.   

    ![Create storage account pane](./media/cdn-create-a-storage-account-with-cdn/cdn-create-new-storage-account.png)

3. In the **Name** box, enter a subdomain name. This entry can contain 3-24 lowercase letters and numbers.
   
    This value becomes the host name within the URI that's used to address blob, queue, or table resources for the subscription. To address a container resource in Blob storage, use a URI in the following format:
   
    http://*&lt;StorageAcountLabel&gt;*.blob.core.windows.net/*&lt;mycontainer&gt;*

    where *&lt;StorageAccountLabel&gt;* refers to the value you entered in the **Name** box.
   
    > [!IMPORTANT]    
    > The URL label forms the subdomain of the storage account URI and must be unique among all hosted services in Azure.
   
    This value is also used as the name of the storage account in the portal, or when you're accessing this account programmatically.
    
4. Use the defaults for **Deployment model**, **Account kind**, **Performance**, and **Replication**. 
    
5. For **Subscription**, select the subscription to use with the storage account.
    
6. For **Resource group**, select or create a resource group. For information about resource groups, see [Azure Resource Manager overview](../azure-resource-manager/resource-group-overview.md#resource-groups).
    
7. For **Location**, select a location for your storage account.
    
8. Select **Create**. The process of creating the storage account might take several minutes to finish.

## Step 2: Enable CDN for the storage account

You can enable CDN for your storage account directly from your storage account. 

1. Select a storage account from the dashboard, then select **Azure CDN** from the left pane. If the **Azure CDN** button is not immediately visible, you can enter CDN in the **Search** box of the left pane.
	
	The **Azure Content Delivery Network** pane appears.

	![Create CDN endpoint](./media/cdn-create-a-storage-account-with-cdn/cdn-storage-new-endpoint-creation.png)
	
2. Create a new endpoint by entering the required information:
	- **CDN Profile**: Create a new CDN profile or use an existing CDN profile.
	- **Pricing tier**: Select a pricing tier only if you are creating a CDN profile.
	- **CDN endpoint name**: Enter a CDN endpoint name.

	> [!TIP]
   	> By default, a new CDN endpoint uses the host name of your storage account as the origin server.

3. Select **Create**. After the endpoint is created, it appears in the endpoint list.

	![Storage new CDN endpoint](./media/cdn-create-a-storage-account-with-cdn/cdn-storage-new-endpoint-list.png)

> [!NOTE]
> If you want to specify advanced configuration settings for your CDN endpoint, such as the optimization type, you can instead use the [Azure CDN extension](cdn-create-new-endpoint.md#create-a-new-cdn-endpoint) to create a CDN endpoint, or a CDN profile.

## Step 3: Enable additional CDN features

From the storage account **Azure CDN** pane, select the CDN endpoint from the list to open the CDN configuration pane. You can enable additional CDN features for your delivery, such as compression, query string, and geo filtering. You can also add custom domain mapping to your CDN endpoint and enable custom domain HTTPS.
	
![Storage CDN endpoint configuration](./media/cdn-create-a-storage-account-with-cdn/cdn-storage-endpoint-configuration.png)

## Step 4: Access CDN content
To access cached content on the CDN, use the CDN URL provided in the portal. The address for a cached blob has the following format:

http://<*EndpointName*\>.azureedge.net/<*myPublicContainer*\>/<*BlobName*\>

> [!NOTE]
> After you enable CDN access to a storage account, all publicly available objects are eligible for CDN edge caching. If you modify an object that's currently cached in the CDN, the new content will not be available via CDN until CDN refreshes its content after the time-to-live period for the cached content expires.

## Step 5: Remove content from the CDN
If you no longer want to cache an object in Azure CDN, you can take one of the following steps:

* Make the container private instead of public. For more information, see [Manage anonymous read access to containers and blobs](../storage/blobs/storage-manage-access-to-resources.md).
* Disable or delete the CDN endpoint by using the Azure portal.
* Modify your hosted service to no longer respond to requests for the object.

An object that's already cached in Azure CDN remains cached until the time-to-live period for the object expires or until the endpoint is purged. When the time-to-live period expires, Azure CDN checks whether the CDN endpoint is still valid and the object is still anonymously accessible. If they are not, the object will no longer be cached.

## Additional resources
* [Add a custom domain to your CDN endpoint](cdn-map-content-to-custom-domain.md)
* [Configure HTTPS on an Azure CDN custom domain](cdn-custom-ssl.md)

