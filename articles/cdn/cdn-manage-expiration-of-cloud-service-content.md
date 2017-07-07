---
title: Manage expiration of web content in Azure CDN | Microsoft Docs
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
ms.date: 01/23/2017
ms.author: mazha

---
# Manage expiration of Azure Web Apps/Cloud Services, ASP.NET, or IIS content in Azure CDN
> [!div class="op_single_selector"]
> * [Azure Web Apps/Cloud Services, ASP.NET, or IIS](cdn-manage-expiration-of-cloud-service-content.md)
> * [Azure Storage blob service](cdn-manage-expiration-of-blob-content.md)
> 
> 

Files from any publicly accessible origin web server can be cached in Azure CDN until its time-to-live (TTL) elapses.  The TTL is determined by the [*Cache-Control* header](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9) in the HTTP response from the origin server.  This article describes how to set `Cache-Control` headers for Azure Web Apps, Azure Cloud Services, ASP.NET applications, and Internet Information Services sites, all of which are configured similarly.

> [!TIP]
> You may choose to set no TTL on a file.  In this case, Azure CDN automatically applies a default TTL of seven days.
> 
> For more information about how Azure CDN works to speed up access to files and other resources, see the [Azure CDN Overview](cdn-overview.md).
> 
> 

## Setting Cache-Control Headers in configuration
For static content, such as images and style sheets, you can control the update frequency by modifying the **applicationHost.config** or **web.config** files for your web application.  The **system.webServer\staticContent\clientCache** element in the configuration file will set the `Cache-Control` header for your content. For **web.config**, the configuration settings will affect everything in the folder and all subfolders, unless overridden at the subfolder level.  For example, you can set a default time-to-live at the root to have all static content cached for 3 days, but have a subfolder that has more variable content with a cache setting of 6 hours.  For **applicationHost.config**, all applications on the site will be affected, but can be overridden in **web.config** files in the applications.

The following XML shows an example of setting **clientCache** to specify a maximum age of 3 days:  

```xml
<configuration>
    <system.webServer>
        <staticContent>
            <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="3.00:00:00" />
        </staticContent>
    </system.webServer>
</configuration>
```

Specifying **UseMaxAge** adds a `Cache-Control: max-age=<nnn>` header to the response based on the value specified in the **CacheControlMaxAge** attribute. The format of the timespan is for the **cacheControlMaxAge** attribute is <days>.<hours>:<min>:<sec>. For more information on the **clientCache** node, see [Client Cache <clientCache>](http://www.iis.net/ConfigReference/system.webServer/staticContent/clientCache).  

## Setting Cache-Control Headers in Code
For ASP.NET applications, you can set the CDN caching behavior programmatically by setting the **HttpResponse.Cache** property. For more information on the **HttpResponse.Cache** property, see [HttpResponse.Cache Property](http://msdn.microsoft.com/library/system.web.httpresponse.cache.aspx) and [HttpCachePolicy Class](http://msdn.microsoft.com/library/system.web.httpcachepolicy.aspx).  

If you want to programmatically cache application content in ASP.NET, make sure that the content is marked as cacheable by setting HttpCacheability to *Public*. Also, ensure that a cache validator is set. The cache validator can be a Last Modified timestamp set by calling SetLastModified, or an etag value set by calling SetETag. Optionally, you can also specify a cache expiration time by calling SetExpires, or you can rely on the default cache heuristics described earlier in this document.  

For example, to cache content for one hour, add the following:  

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

