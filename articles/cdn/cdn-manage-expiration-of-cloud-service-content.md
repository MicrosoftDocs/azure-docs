<properties
 pageTitle="How to manage expiration of cloud service content in Azure CDN | Microsoft Azure"
 description="Describes how to manage the expiration of cloud service content in Azure CDN"
 services="cdn"
 documentationCenter=".NET"
 authors="camsoper"
 manager="erikre"
 editor=""/>
<tags
 ms.service="cdn"
 ms.workload="media"
 ms.tgt_pltfrm="na"
 ms.devlang="dotnet"
 ms.topic="article"
 ms.date="07/28/2016"
 ms.author="casoper"/>

# How to Manage Expiration of Cloud Service Content in the Azure Content Delivery Network (CDN)

Objects that benefit the most from Azure CDN caching are those that are accessed frequently during their time-to-live (TTL) period. An object stays in the cache for the TTL period and then is refreshed from the cloud service after that time is elapsed. Then the process repeats.  

If you do not provide cache values, the TTL of an object is 7 days.   

For static content such as images and style sheets you can control the update frequency by including a web.config in the CDN folder containing the content and modifying the **clientCache** settings to control the Cache-Control header for your content. The web.config settings will affect everything in the folder and all subfolders, unless overridden in another subfolder further down.  For example, you can set a default time-to-live at the root to have all static content cached for 3 days, but have a subfolder that has more variable content with a cache setting of 6 hours.  

The following XML shows and example of setting **clientCache** to specify a maximum age of 3 days:  

```xml
<configuration>
	<system.webServer>
		<staticContent>
			<clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="3.00:00:00" />
		</staticContent>
	</system.webServer>
</configuration>
```

Specifying **UseMaxAge** adds a Cache-Control: max-age=<nnn> header to the response based on the value specified in the **CacheControlMaxAge** attribute. The format of the timespan is for the **cacheControlMaxAge** attribute is <days>.<hours>:<min>:<sec>. For more information on the **clientCache** node, see [Client Cache <clientCache>](http://www.iis.net/ConfigReference/system.webServer/staticContent/clientCache).  

For content returned from applications such as .aspx pages, you can set the CDN caching behavior programmatically by setting the **HttpResponse.Cache** property. For more information on the **HttpResponse.Cache** property, see [HttpResponse.Cache Property](http://msdn.microsoft.com/library/system.web.httpresponse.cache.aspx) and [HttpCachePolicy Class](http://msdn.microsoft.com/library/system.web.httpcachepolicy.aspx).  

If you want to programmatically cache application content, make sure that the content is marked as cacheable by setting HttpCacheability to *Public*. Also, ensure that a cache validator is set. The cache validator can be a Last Modified timestamp set by calling SetLastModified, or an etag value set by calling SetETag. Optionally, you can also specify a cache expiration time by calling SetExpires, or you can rely on the default cache heuristics described earlier in this document.  

For example, to cache content for one hour, add the following:  

```csharp
// Set the caching parameters.
Response.Cache.SetExpires(DateTime.Now.AddHours(1));
Response.Cache.SetCacheability(HttpCacheability.Public);
Response.Cache.SetLastModified(DateTime.Now);
```

##See Also

[How to Manage Expiration of Blob Content in the Azure Content Delivery Network (CDN)](./cdn-manage-expiration-of-blob-content.md
)
