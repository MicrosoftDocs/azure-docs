<properties 
	pageTitle="Azure CDN Overview" 
	description="Learn what the Azure Content Delivery Network (CDN) is and how to use it to deliver high-bandwidth content by caching blobs and static content." 
	services="cdn" 
	documentationCenter=".NET" 
	authors="casoper" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="cdn" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/22/2015" 
	ms.author="casoper"/>

#Overview of the Azure Content Delivery Network (CDN)

The Azure Content Delivery Network (CDN) caches Azure blobs and static content used by cloud services at strategically placed locations to provide maximum bandwidth for delivering content to users. 

If you are an existing CDN customer, you can now manage your CDN endpoints through the [Microsoft Azure Management Portal](https://portal.azure.com). 



The CDN offers developers a global solution for delivering high-bandwidth content by caching the content at physical nodes across the world. For a current list of CDN node locations, see [Azure Content Delivery Network (CDN) POP Locations](cdn-pop-locations.md).

The benefits of using the CDN to cache Azure data include:

- Better performance and user experience for end users who are far from a content source, and are using applications where many "internet trips" are required to load content
- Large distributed scale to better handle instantaneous high load, like at the start of a product launch event. 


>[AZURE.IMPORTANT] When you create or enable a CDN endpoint, it may take up to 60 minutes to propagate worldwide.
 
When a request for an object is first made to the CDN, the object is retrieved directly from the object's source origin location.  This origin can be an Azure storage account, web app, cloud service, or any custom origin that accepts public web requests.  When a request is made using the CDN syntax, the request is redirected to the CDN endpoint closest to the location from which the request was made to provide access to the object. If the object is not found at that endpoint, then it is retrieved from the service and cached at the endpoint, where a time-to-live (TTL) setting is maintained for the cached object.
 
##Caching content from Azure storage

Once the CDN is enabled on a Azure storage account, any blobs that are in public containers and are available for anonymous access will be cached via the CDN. Only blobs that are publicly available can be cached with the Azure CDN. To make a blob publicly available for anonymous access, you must denote its container as public. Once you do so, all blobs within that container will be available for anonymous read access. You have the option of making container data public as well, or restricting access only to the blobs within it. See [Manage Access to Azure Storage Resources](../storage/storage-manage-access-to-resources.md) for information on managing access control for containers and blobs.

For best performance, use CDN edge caching for delivering blobs less than 10 GB in size.

When you enable CDN access for a storage account, the Management Portal provides you with a CDN domain name in the following format: `http://<identifier>.azureedge.net/`. This domain name can be used to access blobs in a public container. For example, given a public container named music in a storage account named myaccount, users can access the blobs in that container using either of the following two URLs:

- **Azure Blob service URL**: `http://myAccount.blob.core.windows.net/music/` 
- **Azure CDN URL**: `http://<identifier>.azureedge.net/music/` 

##Caching content from Azure websites

You can enable CDN from your websites to cache your web contents, such as images, scripts, and stylesheets. See [Integrate an Azure Website with Azure CDN](../app-service-web/cdn-websites-with-cdn.md).

When you enable CDN access for a website, the Management Portal provides you with a CDN domain name in the following format: `http://<identifier>.azureedge.net/`. This domain name can be used to retrieve objects from a website. For example, given a public container named cdn and an image file called music.png, users can access the object using either of the following two URLs:

- **Azure Website URL**: `http://mySiteName.azurewebsites.net/cdn/music.png` 
- **Azure CDN URL**: `http://<identifier>.azureedge.net/cdn/music.png`
 
##Caching content from Azure cloud services

You can cache objects to the CDN that are provided by a Azure cloud service. 

Caching for cloud services has the following constraints: 


- The CDN should be used to cache static content only.

	>[AZURE.WARNING] Caching of highly volatile or truly dynamic content may adversely affect your performance or cause content problems, all at increased cost.
- Your cloud service must be deployed to in a production deployment.
- Your cloud service must provide the object on port 80 using HTTP.
- The cloud service must place the content to be cached in, or delivered from, the /cdn folder on the cloud service.

When you enable CDN access for on a cloud service, the Management Portal provides you with a CDN domain name in the following format: `http://<identifier>.azureedge.net/`. This domain name can be used to retrieve objects from a cloud service. For example, given a cloud service named myHostedService and an ASP.NET web page called music.aspx that delivers content, users can access the object using either of the following two URLs:


- **Azure cloud service URL**: `http://myHostedService.cloudapp.net/cdn/music.aspx` 
- **Azure CDN URL**: `http://<identifier>.azureedge.net/music.aspx` 

##Caching content from custom origins

You can cache objects to the CDN that are provided by any publicly accessible web application. 

Caching for custom origins has the following constraints: 


- The CDN should be used to cache static content only.

	>[AZURE.WARNING] Caching of highly volatile or truly dynamic content may adversely affect your performance or cause content problems, all at increased cost.
- Your cloud service must be deployed to in a production deployment.
- Your cloud service must provide the object on port 80 using HTTP.
- The cloud service must place the content to be cached in, or delivered from, the /cdn folder on the cloud service.

When you enable CDN access for on a cloud service, the Management Portal provides you with a CDN domain name in the following format: `http://<identifier>.azureedge.net/`. This domain name can be used to retrieve objects from a cloud service. For example, given a cloud service named myHostedService and an ASP.NET web page called music.aspx that delivers content, users can access the object using either of the following two URLs:


- **Azure cloud service URL**: `http://myHostedService.cloudapp.net/cdn/music.aspx` 
- **Azure CDN URL**: `http://<identifier>.azureedge.net/music.aspx` 

###Caching specific content with query strings

You can use query strings to differentiate objects retrieved from a cloud service. For example, if the cloud service displays a chart that can vary you can pass a query string to retrieve the specific chart required. For example: 

`http://<identifier>.azureedge.net/chart.aspx?item=1`

Query strings are passed as string literals. If you have a service that takes two parameters, such as `?area=2&item=1` and make subsequent call to the service using `?item=1&area=2`, you will cache two copies of the same object.
 

##Accessing cached content over HTTPS


Azure allows you to retrieve content from the CDN using HTTPS calls. This allows you to incorporate content cached in the CDN into secure web pages without receiving warnings about mixed security content types.

Accessing CDN content using HTTPS has the following constraints:


- You must use the certificate provided by the CDN. Third party certificates are not supported.
- You must use the CDN domain to access content. HTTPS support is not available for custom domain names (CNAMEs) since the CDN does not support custom certificates at this time.



Even when HTTPS is enabled, content from the CDN can be retrieved using both HTTP and HTTPS.

For more information on enabling HTTPS for CDN content, see [How to Enable the Content Delivery Network (CDN) for Azure](cdn-create-new-endpoint.md).


##Accessing cached content with custom domains

You can map the CDN HTTP endpoint to a custom domain name and use that name to request objects from the CDN.

For more information on mapping a custom domain, see [How to Map Content Delivery Network (CDN) Content to a Custom Domain](cdn-map-content-to-custom-domain.md).

 