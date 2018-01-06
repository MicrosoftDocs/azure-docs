---
title: Integrate an Azure storage account with Azure CDN | Microsoft Docs
description: Learn how to use the Azure Content Delivery Network (CDN) to deliver high-bandwidth content by caching blobs from Azure Storage.
services: cdn
documentationcenter: ''
author: zhangmanling, dksimpson
manager: erikre
editor: ''

ms.assetid: cbc2ff98-916d-4339-8959-622823c5b772
ms.service: cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/04/2017
ms.author: mazha

---
# Integrate an Azure storage account with Azure CDN
The Azure Content Delivery Network (CDN) can be enabled to cache content from your Azure storage. It offers developers a global solution for delivering high-bandwidth content by caching blobs and static content of compute instances at physical nodes in the United States, Europe, Asia, Australia, and South America.

## Step 1: Create a storage account
Use the following procedure to create a new storage account for an Azure subscription. A storage account gives access to
Azure storage services. The storage account represents the highest level
of the namespace for accessing each of the Azure storage service
components: Blob services, Queue services, and Table services. For more information, see [Introduction to Microsoft Azure Storage](../storage/common/storage-introduction.md).

To create a storage account, you must be either the service
administrator or a co-administrator for the associated subscription.

> [!NOTE]
> There are several methods you can use to create a storage account, including the Azure portal and Powershell. This tutorial uses the Azure portal.   
> 

**To create a storage account for an Azure subscription**

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the upper left corner, select **Create a resource**. In the **New** blade, select **Storage**, then click **Storage account - blob, file, table, queue**.
	
	The **Create storage account** blade appears.   

    ![Create storage account](./media/cdn-create-a-storage-account-with-cdn/cdn-create-new-storage-account.png)

3. In the **Name** box, type a subdomain name. This entry can contain 3-24 lowercase letters and numbers.
   
    This value becomes the host name within the URI that is used to address blob, queue, or table resources for the subscription. For example, to address a container resource for the Blob service, use a URI in the following format, where *&lt;StorageAccountLabel&gt;* refers to the value you entered in the **Name** box:
   
    `http://*&lt;StorageAcountLabel&gt;*.blob.core.windows.net/*&lt;mycontainer&gt;*`
   
    > [!IMPORTANT]    
    > The URL label forms the subdomain of the storage account URI and must be unique among all Azure hosted services.
   
    This value is also used as the name of the storage account in the Azure portal, or when accessing the account programmatically.
    
4. Use the defaults for **Deployment model**, **Account kind**, **Performance**, and **Replication**. 
    
5. Select the **Subscription** to use with the storage account.
    
6. Select or create a **Resource group**. For information about resource groups, see [Azure Resource Manager overview](../azure-resource-manager/resource-group-overview.md#resource-groups).
    
7. Select a location for your storage account from the **Location** list.
    
8. Click **Create**. The process of creating the storage account might take several minutes to complete.

## Step 2: Enable CDN for the storage account

You can enable CDN for your storage account from the storage blad. 

1. Select a storage account from the dashboard, then select **Azure CDN**.
	
	The **Azure CDN** blade appears.

	![Create CDN endpoint](./media/cdn-create-a-storage-account-with-cdn/cdn-storage-new-endpoint-creation.png)
	
2. Create a new endpoint by entering the required information
	- **CDN Profile**: Create a new CDN profile or use an existing CDN profile.
	- **Pricing tier**: Select a pricing tier only if you are creating a CDN profile.
	- **CDN endpoint name**: Enter an CDN endpoint name.

	> [!TIP]
   	> By default, a new CDN endpoint uses the hostname of your storage account as the origin server.

	![cdn new endpoint creation][cdn-new-endpoint-creation]

3. After the endpoint is created, it is displayed in the endpoint list.

	![cdn storage new endpoint][cdn-storage-new-endpoint]

> [!NOTE]
> Alternatively, you can use the [Azure CDN portal](cdn-create-new-endpoint.md) to enable Azure CDN.
> 
> 

[!INCLUDE [cdn-create-profile](../../includes/cdn-create-profile.md)]  

## Step 3: Enable additional CDN features

From storage account "Azure CDN" blade, click the CDN endpoint from the list to open CDN configuration blade. You can enable additional CDN features for your delivery, such as compression, query string, geo filtering. You can also add custom domain mapping to your CDN endpoint and enable custom domain HTTPS.
	
![cdn storage cdn configuration][cdn-storage-cdn-configuration]

## Step 4: Access CDN content
To access cached content on the CDN, use the CDN URL provided in the portal. The address for a cached blob has the following format:

http://<*EndpointName*\>.azureedge.net/<*myPublicContainer*\>/<*BlobName*\>

> [!NOTE]
> After you enable CDN access to a storage account, all publicly available objects are eligible for CDN edge caching. If you modify an object that is currently cached in the CDN, the new content will not be available via the CDN until the CDN refreshes its content after the cached content time-to-live period expires.

## Step 5: Remove content from the CDN
If you no longer want to cache an object in the Azure CDN, follow one of these steps:

* Make the container private instead of public. For more information, see [Manage anonymous read access to containers and blobs](../storage/blobs/storage-manage-access-to-resources.md).
* Disable or delete the CDN endpoint by using the Management portal.
* Set your hosted service to no longer respond to requests for the object.

An object already cached in the CDN remains cached until the time-to-live period for the object expires or until the endpoint is purged. When the time-to-live period expires, the CDN determines whether the CDN endpoint is still valid and the object still anonymously accessible. If it is not, then the object will no longer be cached.

## Additional resources
* [How to Map CDN Content to a Custom Domain](cdn-map-content-to-custom-domain.md)
* [Enable HTTPS for your custom domain](cdn-custom-ssl.md)

[create-new-storage-account]: ./media/cdn-create-a-storage-account-with-cdn/CDN_CreateNewStorageAcct.png
[cdn-enable-navigation]: ./media/cdn-create-a-storage-account-with-cdn/cdn-storage-new-endpoint-creation.png
[cdn-storage-new-endpoint]: ./media/cdn-create-a-storage-account-with-cdn/cdn-storage-new-endpoint-list.png
[cdn-storage-cdn-configuration]: ./media/cdn-create-a-storage-account-with-cdn/cdn-storage-endpoint-configuration.png 
