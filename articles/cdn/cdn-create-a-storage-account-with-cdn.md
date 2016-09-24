<properties
	pageTitle="Integrate a Storage Account with CDN | Microsoft Azure"
	description="Learn how to use the Azure Content Delivery Network (CDN) to deliver high-bandwidth content by caching blobs from Azure Storage."
	services="cdn"
	documentationCenter=""
	authors="camsoper"
	manager="erikre"
	editor=""/>

<tags
	ms.service="cdn"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/28/2016"
	ms.author="casoper"/>


# Integrate a Storage Account with CDN

CDN can be enabled to cache content from your Azure storage. It offers developers a global solution for delivering high-bandwidth content by caching blobs and static content of compute instances at physical nodes in the United States, Europe, Asia, Australia and South America.


## Step 1: Create a storage account

Use the following procedure to create a new storage account for a
Azure subscription. A storage account gives access to
Azure storage services. The storage account represents the highest level
of the namespace for accessing each of the Azure storage service
components: Blob services, Queue services, and Table services. For more information, refer to the [Introduction to Microsoft Azure Storage](../storage/storage-introduction.md).

To create a storage account, you must be either the service
administrator or a co-administrator for the associated subscription.

> [AZURE.NOTE] There are several methods you can use to create a storage account, including the Azure Portal and Powershell.  For this tutorial, we'll be using the Azure Portal.  

**To create a storage account for an Azure subscription**

1.  Sign in to the [Azure Portal](https://portal.azure.com).
2.  In the upper left corner, select **New**. In the **New** Dialog, select **Data  + Storage**, then click **Storage account**.

    The **Create storage account** blade appears.

    ![Create Storage Account][create-new-storage-account]

4. In the **Name** field, type a subdomain name. This entry can contain 3-24 lowercase letters and numbers.

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

5. Leave the defaults for **Deployment model**, **Account kind**, **Performance**, and **Replication**. 

6. Select the **Subscription** that the storage account will be used with.

7. Select or create a **Resource Group**.  For more information on Resource Groups, see [Azure Resource Manager overview](resource-group-overview.md#resource-groups).

8. Select a location for your storage account.

8. Click **Create**. The process of creating the storage account might take several minutes to complete.


## Step 2: Create a new CDN profile

A CDN profile is a collection of CDN endpoints.  Each profile contains one or more CDN endpoints.  You may wish to use multiple profiles to organize your CDN endpoints by internet domain, web application, or some other criteria.

> [AZURE.TIP] If you already have a CDN profile that you want to use for this tutorial, proceed to [Step 3](#step-3-create-a-new-cdn-endpoint).

[AZURE.INCLUDE [cdn-create-profile](../../includes/cdn-create-profile.md)]

## Step 3: Create a new CDN endpoint

**To create a new CDN endpoint for your storage account**

1. In the [Azure Management Portal](https://portal.azure.com), navigate to your CDN profile.  You may have pinned it to the dashboard in the previous step.  If you not, you can find it by clicking **Browse**, then **CDN profiles**, and clicking on the profile you plan to add your endpoint to.

    The CDN profile blade appears.

    ![CDN profile][cdn-profile-settings]

2. Click the **Add Endpoint** button.

    ![Add endpoint button][cdn-new-endpoint-button]

    The **Add an endpoint** blade appears.

    ![Add endpoint blade][cdn-add-endpoint]

3. Enter a **Name** for this CDN endpoint.  This name will be used to access your cached resources at the domain `<endpointname>.azureedge.net`.

4. In the **Origin type** dropdown, select *Storage*.  

5. In the **Origin hostname** dropdown, select your storage account.

6. Leave the defaults for **Origin path**, **Origin host header**, and **Protocol/Origin port**.  You must specify at least one protocol (HTTP or HTTPS).

    > [AZURE.NOTE] This configuration enables all of your publicly visible containers in your storage account for caching in the CDN.  If you want to limit the scope to a single container, use **Origin path**.  Note the container must have its visibility set to public.

7. Click the **Add** button to create the new endpoint.

8. Once the endpoint is created, it appears in a list of endpoints for the profile. The list view shows the URL to use to access cached content, as well as the origin domain.

    ![CDN endpoint][cdn-endpoint-success]

    > [AZURE.NOTE] The endpoint will not immediately be available for use.  It can take up to 90 minutes for the registration to propagate through the CDN network. Users who try to use the CDN domain name immediately may receive status code 404 until the content is available via the CDN.


## Step 4: Access CDN content

To access cached content on the CDN, use the CDN URL provided in the portal. The address for a cached blob will be similar to the following:

http://<*EndpointName*\>.azureedge.net/<*myPublicContainer*\>/<*BlobName*\>

> [AZURE.NOTE] Once you enable CDN access to a storage account or hosted service, all publicly available objects are eligible for CDN edge caching. If you modify an object that is currently cached in the CDN, the new content will not be available via the CDN until the CDN refreshes its content when the cached content time-to-live period expires.

## Step 5: Remove content from the CDN

If you no longer wish to cache an object in the Azure Content
Delivery Network (CDN), you can take one of the following steps:

-   You can make the container private instead of public. See [Manage anonymous read access to containers and blobs](../storage/storage-manage-access-to-resources.md) for more information.
-   You can disable or delete the CDN endpoint using the Management Portal.
-   You can modify your hosted service to no longer respond to requests for the object.

An object already cached in the CDN will remain cached until the time-to-live period for the object expires or until the endpoint is purged. When the time-to-live period expires, the CDN will check to see whether the CDN endpoint is still valid and the object still anonymously accessible. If it is not, then the object will no longer be cached.


## Additional resources

-   [How to Map CDN Content to a Custom Domain](cdn-map-content-to-custom-domain.md)

[create-new-storage-account]: ./media/cdn-create-a-storage-account-with-cdn/CDN_CreateNewStorageAcct.png

[cdn-profile-settings]: ./media/cdn-create-a-storage-account-with-cdn/cdn-profile-settings.png
[cdn-new-endpoint-button]: ./media/cdn-create-a-storage-account-with-cdn/cdn-new-endpoint-button.png
[cdn-add-endpoint]: ./media/cdn-create-a-storage-account-with-cdn/cdn-add-endpoint.png
[cdn-endpoint-success]: ./media/cdn-create-a-storage-account-with-cdn/cdn-endpoint-success.png
