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
ms.date: 01/23/2017
ms.author: mazha

---
# Integrate an Azure storage account with Azure CDN
CDN can be enabled to cache content from your Azure storage. It offers developers a global solution for delivering high-bandwidth content by caching blobs and static content of compute instances at physical nodes in the United States, Europe, Asia, Australia and South America.

## Step 1: Create a storage account
Use the following procedure to create a new storage account for a
Azure subscription. A storage account gives access to
Azure storage services. The storage account represents the highest level
of the namespace for accessing each of the Azure storage service
components: Blob services, Queue services, and Table services. For more information, refer to the [Introduction to Microsoft Azure Storage](../storage/storage-introduction.md).

To create a storage account, you must be either the service
administrator or a co-administrator for the associated subscription.

> [!NOTE]
> There are several methods you can use to create a storage account, including the Azure Portal and Powershell.  For this tutorial, we'll be using the Azure Portal.  
> 
> 

**To create a storage account for an Azure subscription**

1. Sign in to the [Azure Portal](https://portal.azure.com).
2. In the upper left corner, select **New**. In the **New** Dialog, select **Data  + Storage**, then click **Storage account**.
	
	The **Create storage account** blade appears.   

	![Create Storage Account][create-new-storage-account]  

3. In the **Name** field, type a subdomain name. This entry can contain 3-24 lowercase letters and numbers.
   
    This value becomes the host name within the URI that is used to
    address Blob, Queue, or Table resources for the subscription. To
    address a container resource in the Blob service, you would use a
    URI in the following format, where *&lt;StorageAccountLabel&gt;* refers
    to the value you typed in **Enter a URL**:
   
    http://*&lt;StorageAcountLabel&gt;*.blob.core.windows.net/*&lt;mycontainer&gt;*
   
    **Important:** The URL label forms the subdomain of the storage
    account URI and must be unique among all hosted services in
    Azure.
   
    This value is also used as the name of this storage account in the portal, or when accessing this account programmatically.
4. Leave the defaults for **Deployment model**, **Account kind**, **Performance**, and **Replication**. 
5. Select the **Subscription** that the storage account will be used with.
6. Select or create a **Resource Group**.  For more information on Resource Groups, see [Azure Resource Manager overview](../azure-resource-manager/resource-group-overview.md#resource-groups).
7. Select a location for your storage account.
8. Click **Create**. The process of creating the storage account might take several minutes to complete.

## Step 2: Enable CDN for the storage account

With the newest integration, you can now enable CDN for your storage account without leaving your storage portal extension. 

1. Select the storage account, search "CDN" or scroll down from the left navigation menu, then click "Azure CDN".
	
	The **Azure CDN** blade appears.

	![cdn enable navigation][cdn-enable-navigation]
	
2. Create a new endpoint by entering the required information
	- **CDN Profile**: You can create a new or use an existing profile.
	- **Pricing tier**: You only need to select a pricing tier if you create a new CDN profile.
	- **CDN endpoint name**: Enter an endpoint name per your choice.

	> [!TIP]
   	> The created CDN endpoint uses the hostname of your storage account as origin by default.

	![cdn new endpoint creation][cdn-new-endpoint-creation]

3. After creation, the new endpoint will show up in the endpoint list above.

	![cdn storage new endpoint][cdn-storage-new-endpoint]

> [!NOTE]
> You can also go to Azure CDN extension to enable CDN.[Tutorial](#Tutorial-cdn-create-profile).
> 
> 

[!INCLUDE [cdn-create-profile](../../includes/cdn-create-profile.md)]  

## Step 3: Enable additional CDN features

From storage account "Azure CDN" blade, click the CDN endpoint from the list to open CDN configuration blade. You can enable additional CDN features for your delivery, such as compression, query string, geo filtering. You can also add custom domain mapping to your CDN endpoint and enable custom domain HTTPS.
	
![cdn storage cdn configuration][cdn-storage-cdn-configuration]

## Step 4: Access CDN content
To access cached content on the CDN, use the CDN URL provided in the portal. The address for a cached blob will be similar to the following:

http://<*EndpointName*\>.azureedge.net/<*myPublicContainer*\>/<*BlobName*\>

> [!NOTE]
> Once you enable CDN access to a storage account, all publicly available objects are eligible for CDN edge caching. If you modify an object that is currently cached in the CDN, the new content will not be available via the CDN until the CDN refreshes its content when the cached content time-to-live period expires.
> 
> 

## Step 5: Remove content from the CDN
If you no longer wish to cache an object in the Azure Content
Delivery Network (CDN), you can take one of the following steps:

* You can make the container private instead of public. See [Manage anonymous read access to containers and blobs](../storage/storage-manage-access-to-resources.md) for more information.
* You can disable or delete the CDN endpoint using the Management Portal.
* You can modify your hosted service to no longer respond to requests for the object.

An object already cached in the CDN will remain cached until the time-to-live period for the object expires or until the endpoint is purged. When the time-to-live period expires, the CDN will check to see whether the CDN endpoint is still valid and the object still anonymously accessible. If it is not, then the object will no longer be cached.

## Additional resources
* [How to Map CDN Content to a Custom Domain](cdn-map-content-to-custom-domain.md)
* [Enable HTTPS for your custom domain](cdn-custom-ssl.md)

[create-new-storage-account]: ./media/cdn-create-a-storage-account-with-cdn/CDN_CreateNewStorageAcct.png
[cdn-enable-navigation]: ./media/cdn-create-a-storage-account-with-cdn/cdn-storage-new-endpoint-creation.png
[cdn-storage-new-endpoint]: ./media/cdn-create-a-storage-account-with-cdn/cdn-storage-new-endpoint-list.png
[cdn-storage-cdn-configuration]: ./media/cdn-create-a-storage-account-with-cdn/cdn-storage-endpoint-configuration.png 
