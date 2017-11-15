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
> * [Azure web content](cdn-manage-expiration-of-cloud-service-content.md)
> * [Azure Blob storage](cdn-manage-expiration-of-blob-content.md)
> 

The files from any publicly accessible origin web server can be cached in Azure Content Delivery Network (CDN) until their time-to-live (TTL) elapses. The TTL is determined by the `Cache-Control` header in the HTTP response from the origin server. This article describes how to set `Cache-Control` headers for the Web Apps feature of Microsoft Azure App Service, Azure Cloud Services, ASP.NET applications, and Internet Information Services (IIS) sites, all of which are configured similarly. You can set the `Cache-Control` header either by using configuration files or programmatically.

> [!TIP]
> You can choose to set no TTL on a file. In this case, Azure CDN automatically applies a default TTL of seven days.
> 
> For more information about how Azure CDN works to speed up access to files and other resources, see [Overview of the Azure Content Delivery Network](cdn-overview.md).
> 

## Setting Cache-Control headers by using configuration files
For static content, such as images and style sheets, you can control the update frequency by modifying the **applicationHost.config** or **Web.config** configuration files for your web application. The `<system.webServer>/<staticContent>/<clientCache>` element in either file sets the `Cache-Control` header for your content.

# Using ApplicationHost.config files
The **ApplicationHost.config** file is the root file of the IIS configuration system. The configuration settings in an **ApplicationHost.config** file affect all applications on the site, but are overridden by the settings of any **Web.config** files that exist for a web application.

# Using Web.config files
With a **Web.config** file, you can customize the way your entire web application or a specific directory on your web application behaves. Typically, you have at least one **Web.config** file in the root folder of your web application. For each **Web.config** file in a specific folder, the configuration settings affect everything in that folder and all its subfolders, unless they are overridden at the subfolder level by another **Web.config** file. For example, you can set a `<clientCache>` element in a **Web.config** file in the root folder of your web application to cache all static content on your web application for three days. You can also add a **Web.config** file in a subfolder with more variable content (for example, `\frequent`) and set its `<clientCache>` element to cache the subfolder's content for six hours. The net result is that content on the entire web site will be cached for three days, except for any content in the `\frequent` directory, which will be cached for only six hours.  

The following XML example shows how to set the `<clientCache>` element in a configuration file to specify a maximum age of three days:  

```xml
<configuration>
    <system.webServer>
        <staticContent>
            <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="3.00:00:00" />
        </staticContent>
    </system.webServer>
</configuration>
```

To use the **cacheControlMaxAge** attribute, you must set the value of the **cacheControlMode** attribute to `UseMaxAge`. This setting caused the HTTP header and directive, `Cache-Control: max-age=<nnn>`, to be added to the response. The format of the timespan value for the **cacheControlMaxAge** attribute is `<days>.<hours>:<min>:<sec>`. Its value is converted to seconds and is used as the value of the `Cache-Control` `max-age` directive. For more information about the `<clientCache>` element, see [Client Cache <clientCache>](http://www.iis.net/ConfigReference/system.webServer/staticContent/clientCache).  

## Setting Cache-Control headers programmatically
For ASP.NET applications, you control the CDN caching behavior programmatically by setting the **HttpResponse.Cache** property of the .NET API. For information about the **HttpResponse.Cache** property, see [HttpResponse.Cache Property](http://msdn.microsoft.com/library/system.web.httpresponse.cache.aspx) and [HttpCachePolicy Class](http://msdn.microsoft.com/library/system.web.httpcachepolicy.aspx).  

To programmatically cache application content in ASP.NET, follow these steps:
   1. Verify that the content is marked as cacheable by setting `HttpCacheability` to `Public`. 
   2. Set a cache validator by calling one of the following `HttpCachePolicy` methods:
      - Call `SetLastModified` to set a timestamp value for the `Last-Modified` header.
      - Call `SetETag` to set a value for the `ETag` header.
   3. Optionally, specify a cache expiration time by calling `SetExpires` to set a value for the `Expires` header. Otherwise, the default cache heuristics described previously in this document apply.

For example, to cache content for one hour, add the following C# code:  

```csharp
// Set the caching parameters.
Response.Cache.SetExpires(DateTime.Now.AddHours(1));
Response.Cache.SetCacheability(HttpCacheability.Public);
Response.Cache.SetLastModified(DateTime.Now);
```

## Testing the Cache-Control header
You can easily verify the TTL settings of your web content. With your browser's [developer tools](https://developer.microsoft.com/microsoft-edge/platform/documentation/f12-devtools-guide/), test that your web content includes the `Cache-Control` response header. You can also use a tool such as **wget**, [Postman](https://www.getpostman.com/), or [Fiddler](http://www.telerik.com/fiddler) to examine the response headers.

## Next Steps
* [Read details about the **clientCache** element](http://www.iis.net/ConfigReference/system.webServer/staticContent/clientCache)
* [Read the documentation for the **HttpResponse.Cache** Property](http://msdn.microsoft.com/library/system.web.httpresponse.cache.aspx) 
* [Read the documentation for the **HttpCachePolicy Class**](http://msdn.microsoft.com/library/system.web.httpcachepolicy.aspx).  

