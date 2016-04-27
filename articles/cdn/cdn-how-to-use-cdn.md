<properties
	pageTitle="Using Azure CDN"
	description="Learn how to use the Azure Content Delivery Network (CDN) to deliver high-bandwidth content by caching blobs and static content."
	services="cdn"
	documentationCenter=".net"
	authors="camsoper"
	manager="erikre"
	editor=""/>

<tags
	ms.service="cdn"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/15/2016"
	ms.author="casoper"/>


# Using Azure CDN

The Azure Content Delivery Network (CDN) is the fundamental building block to scale any HTTP/HTTPS application in Azure. It offers Azure customers a global solution by caching and delivering content close to end users. As a result, instead of hitting the origin every single time, user requests are intelligently routed to the CDN edge node (POP, or Point of Presence) that provides them with the best response times. This significantly increases the performance and user experience. For a current list of
CDN node locations, see [Azure Content Delivery Network (CDN) POP Locations](cdn-pop-locations.md).

The benefits of using CDN to cache Azure data include:

- Better performance and user experience for end users who are far from a content source and are using applications where many HTTP requests are required to load content.
- Large distributed scale to better handle instantaneous high load, say, at the start of an event such as a product launch.
- By distributing user requests and serving content from global edge POPs, less traffic is sent to the origin.

>[AZURE.TIP] Azure CDN can distrubute content from a variety of origins.  Integrated origins within Azure include App Service, Cloud Services, blob storage, and Media Service.  You can also define a custom origin using any publicly accessible web address.

##How to enable CDN

1. Create a CDN profile with endpoint(s) pointing to your origin

	A CDN profile is a collection of CDN endpoints.  Each profile contains one or more CDN endpoints.  Once you have created a CDN profile, you can create a new CDN endpoint using the origin you have chosen.

	>[AZURE.NOTE] By default, a single Azure subscription is limited to four CDN profiles.  Each CDN profile is limited to ten CDN endpoints.
	>
	> CDN pricing is applied at the CDN profile level.  If you wish to use a mix of Standard and Premium CDN features, you will need multiple CDN profiles.

	For a detailed tutorial on creating CDN profiles and endpoints, see [How to Enable the Content Delivery Network for Azure](cdn-create-new-endpoint.md).   

2. Set up your CDN configuration

	You can enable a number of features for your CDN endpoint, such as [caching policy](cdn-caching-policy.md), [query string caching](cdn-query-string.md), [rules engine](cdn-rules-engine.md), and more.  For details, see the **Manage** menu on the left.  

3. Access CDN content

	To access cached content on the CDN, use the CDN URL provided in the portal. For example, the address for a cached blob will be similar to the following: `http://<identifier>.azureedge.net/<myPublicContainer>/<BlobName>`

## Caching content from Azure storage

Once the CDN is enabled on a Azure storage account, any blobs that are in public containers and are available for anonymous access will be cached via the CDN. Only blobs that are publicly available can be cached with the Azure CDN. To make a blob publicly available for anonymous access, you must denote its container as public. Once you do so, all blobs within that container will be available for anonymous read access. You have the option of making container data public as well, or restricting access only to the blobs within it. See [Manage Access to Azure Storage Resources](../storage/storage-manage-access-to-resources.md) for information on managing access control for containers and blobs.

For best performance, use CDN edge caching for delivering blobs less than 10 GB in size.

When you enable CDN access for a storage account, the Management Portal provides you with a CDN domain name in the following format: `http://<identifier>.azureedge.net/`. This domain name can be used to access blobs in a public container. For example, given a public container, users can access the blobs in that container using either of the following two URLs:

- **Azure Blob service URL**: `http://<account>.blob.core.windows.net/<container>/`
- **Azure CDN URL**: `http://<identifier>.azureedge.net/<container>/`

> [AZURE.TIP] In the above example, we've pointed the CDN endpoint at the *entire* storage account. Accordingly, the CDN URL will need to include the container in the URL.  You can point the root CDN URL to a specific container using the **Origin Path** parameter.

## Caching content from Azure websites

You can enable CDN from your websites to cache your web contents, such as images, scripts, and stylesheets. See [Integrate an Azure Website with Azure CDN](../app-service-web/cdn-websites-with-cdn.md).

When you enable CDN access for a website, the Management Portal provides you with a CDN domain name in the following format: `http://<identifier>.azureedge.net/`. This domain name can be used to retrieve objects from a website. For example, given a public container named cdn and an image file called music.png, users can access the object using either of the following two URLs:

- **Azure Website URL**: `http://mySiteName.azurewebsites.net/cdn/music.png`
- **Azure CDN URL**: `http://<identifier>.azureedge.net/cdn/music.png`

## Caching content from Azure cloud services

You can cache objects to the CDN that are provided by a Azure cloud service.

Caching for cloud services has the following constraints:


- The CDN should be used to cache static content only.

	>[AZURE.WARNING] Caching of highly volatile or truly dynamic content may adversely affect your performance or cause content problems, all at increased cost.
- Your cloud service must be deployed to in a production deployment.
- Your cloud service must provide the object on port 80 using HTTP.
- The cloud service must place the content to be cached in, or delivered from, the /cdn folder on the cloud service.

When you enable CDN access for on a cloud service, the Management Portal provides you with a CDN domain name in the following format: `http://<identifier>.azureedge.net/`. This domain name can be used to retrieve objects from a cloud service. For example, given a cloud service named myHostedService and an ASP.NET web page called music.aspx that delivers content, users can access the object using either of the following two URLs:


- **Azure cloud service URL**: `http://myHostedService.cloudapp.net/music.aspx`
- **Azure CDN URL**: `http://<identifier>.azureedge.net/music.aspx`

## Caching content from custom origins

You can cache objects to the CDN that are provided by any publicly accessible web application.

Caching for custom origins has the following constraints:

- The CDN should be used to cache static content only.

	>[AZURE.WARNING] Caching of highly volatile or truly dynamic content may adversely affect your performance or cause content problems, all at increased cost.
- The content on the custom origin must be hosted on a server with a public IP address.  CDN edge nodes are incapable of retrieving assets from intranet servers behind a firewall.

When you enable CDN access for on a custom origin, the Azure Portal provides you with a CDN domain name in the following format: `http://<identifier>.azureedge.net/`. This domain name can be used to retrieve objects from the custom origin. For example, given a site located at www.contoso.com and an ASP.NET web page called music.aspx that delivers content, users can access the object using either of the following two URLs:


- **Custom origin URL**: `http://www.contoso.com/music.aspx`
- **Azure CDN URL**: `http://<identifier>.azureedge.net/music.aspx`

## Caching specific content with query strings

You can use query strings to differentiate objects retrieved from an origin. For example, if the origin displays a chart that can vary you can pass a query string to retrieve the specific chart required. For example:

`http://<identifier>.azureedge.net/chart.aspx?item=1`

Query strings are passed as string literals. If you have a service that takes two parameters, such as `?area=2&item=1` and make subsequent calls to the origin using `?item=1&area=2`, you will cache two copies of the same object.

For more information on query string caching, see [Controlling caching behavior of CDN requests with query strings](cdn-query-string.md).

## Accessing cached content over HTTPS

Azure allows you to retrieve content from the CDN using HTTPS calls. This allows you to incorporate content cached in the CDN into secure web pages without receiving warnings about mixed security content types.

Accessing CDN content using HTTPS has the following constraints:


- You must use the certificate provided by the CDN. Third party certificates are not supported.
- You must use the CDN domain to access content. HTTPS support is not available for custom domain names (CNAMEs) since the CDN does not support custom certificates at this time.



## Accessing cached content with custom domains

You can map the CDN HTTP endpoint to a custom domain name and use that name to request objects from the CDN.

For more information on mapping a custom domain, see [How to Map Content Delivery Network (CDN) Content to a Custom Domain](cdn-map-content-to-custom-domain.md).

## Managing CDN programmatically

Microsoft Azure CDN can be managed programmatically using the [CDN Resource Provider REST API](https://msdn.microsoft.com/library/mt634456.aspx).


## See also

- [How to Enable the Content Delivery Network for Azure](cdn-create-new-endpoint.md)
- [Overview of the Azure Content Delivery Network (CDN)](cdn-overview.md)
- [Purge an Azure CDN Endpoint](cdn-purge-endpoint.md)
- [CDN Resource Provider REST API](https://msdn.microsoft.com/library/mt634456.aspx)
