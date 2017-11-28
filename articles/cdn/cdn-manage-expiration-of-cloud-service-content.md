---
title: Manage expiration of web content in Azure Content Delivery Network | Microsoft Docs
description: Learn how to manage expiration of Azure Web Apps/Cloud Services, ASP.NET, or IIS content in Azure CDN.
services: cdn
documentationcenter: .NET
author: zhangmanling
manager: erikre
editor: ''

ms.assetid: bef53fcc-bb13-4002-9324-9edee9da8288
ms.service: cdn
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 11/10/2017
ms.author: mazha

---
# Manage expiration of web content in Azure Content Delivery Network
 in Azure CDN
> [!div class="op_single_selector"]
> * [Azure Web Apps/Cloud Services, ASP.NET, or IIS](cdn-manage-expiration-of-cloud-service-content.md)
> * [Azure Blob storage](cdn-manage-expiration-of-blob-content.md)
> 

Files from any publicly accessible origin web server can be cached in Azure Content Delivery Network (CDN) until their time-to-live (TTL) elapses. The TTL is determined by the [`Cache-Control` header](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9) in the HTTP response from the origin server. This article describes how to set `Cache-Control` headers for the Web Apps feature of Microsoft Azure App Service, Azure Cloud Services, ASP.NET applications, and Internet Information Services sites, all of which are configured similarly.

> [!TIP]
> You can choose to set no TTL on a file. In this case, Azure CDN automatically applies a default TTL of seven days.
> 
> For more information about how Azure CDN works to speed up access to files and other resources, see [Overview of the Azure Content Delivery Network](cdn-overview.md).
> 

## Setting Cache-Control headers in configuration files
For static content, such as images and style sheets, you can control the update frequency by modifying the **applicationHost.config** or **web.config** files for your web application. The **system.webServer\staticContent\clientCache** element in the configuration file sets the `Cache-Control` header for your content. For **web.config** files, the configuration settings affect everything in the folder and all its subfolders, unless they are overridden at the subfolder level. For example, you can set a default TTL setting at the root folder to cache all static content for three days, and set a subfolder with more variable content to cache its content for only six hours. Although **applicationHost.config** file settings affect all applications on the site, they are overridden by the settings of any existing **web.config** files in the applications.

The following XML example shows how to set **clientCache** to specify a maximum age of three days:  

```xml
<configuration>
    <system.webServer>
        <staticContent>
            <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="3.00:00:00" />
        </staticContent>
    </system.webServer>
</configuration>
```

Specifying **UseMaxAge** causes a `Cache-Control: max-age=<nnn>` header to be added to the response based on the value specified in the **CacheControlMaxAge** attribute. The format of the timespan for the **cacheControlMaxAge** attribute is `<days>.<hours>:<min>:<sec>`. For more information about the **clientCache** node, see [Client Cache <clientCache>](http://www.iis.net/ConfigReference/system.webServer/staticContent/clientCache).  

## Setting Cache-Control headers in code
For ASP.NET applications, you can control the CDN caching behavior programmatically by setting the **HttpResponse.Cache** property. For more information about the **HttpResponse.Cache** property, see [HttpResponse.Cache Property](http://msdn.microsoft.com/library/system.web.httpresponse.cache.aspx) and [HttpCachePolicy Class](http://msdn.microsoft.com/library/system.web.httpcachepolicy.aspx).  

To programmatically cache application content in ASP.NET, follow these steps:
   1. Verify that the content is marked as cacheable by setting `HttpCacheability` to *Public*. 
   2. Set a cache validator by calling one of the following methods:
      - Call `SetLastModified` to set a LastModified timestamp.
      - Call `SetETag` to set an `ETag` value.
   3. Optionally, specify a cache expiration time by calling `SetExpires`. Otherwise, the default cache heuristics described previously in this document apply.

For example, to cache content for one hour, add the following C# code:  

```csharp
// Set the caching parameters.
Response.Cache.SetExpires(DateTime.Now.AddHours(1));
Response.Cache.SetCacheability(HttpCacheability.Public);
Response.Cache.SetLastModified(DateTime.Now);
```

## Next Steps
* [Read details about the **clientCache** element](http://www.iis.net/ConfigReference/system.webServer/staticContent/clientCache)
* [Read the documentation for the **HttpResponse.Cache** Property](http://msdn.microsoft.com/library/system.web.httpresponse.cache.aspx) 
* [Read the documentation for the **HttpCachePolicy Class**](http://msdn.microsoft.com/library/system.web.httpcachepolicy.aspx).  

