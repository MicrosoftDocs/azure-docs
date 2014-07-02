<properties linkid="video-center-detail" urlDisplayName="details" pageTitle="How to Use ASP.NET Web Forms Output Caching with Azure Web Sites" metaKeywords="" description="" metaCanonical="" services="" documentationCenter="" title="How to Use ASP.NET Web Forms Output Caching with Azure Web Sites" authors="jroth" solutions="" manager="" editor="" />



# How to Use ASP.NET Web Forms Output Caching with Azure Web Sites

This topic explains how to use the Azure Cache Service (Preview) to support ASP.NET page output caching for ASP.NET Web Forms. Page output caching is an optimization that directly returns a cached rendering page for a specific duration of time. This is useful in situations where a page is accessed more frequently than it typically changes. It is important to note that page output caching is not supported for ASP.NET MVC applications.

The Cache Service (Preview) provides a distributed caching service that is external to the web site. This enables all instances of the web site to access the same cached rendering of a page.

The basic steps to use the Cache Service (Preview) for page output caching include:

* [Create the cache.](#createcache)
* [Configure the ASP.NET project to use Azure Cache.](#configureproject)
* [Modify the web.config file.](#configurewebconfig)
* [Use output caching to temporarily return cached versions of a page.](#useoutputcaching)

<h2><a id="createcache"></a>Create the Cache</h2>
1. At the bottom of the Azure Management Portal, click on the **New** icon.

	![NewIcon][NewIcon]

2. Select **Data Services**, **Cache**, and then click **Quick Create**.

	![NewCacheDialog][NewCacheDialog]

3. Type a unique name for the cache in the **Endpoint** text box. Then select appropriate values for the other cache properties, and click **Create a New Cache**.

4. Select the **Cache** icon in the Management Portal to view all of your Cache Service endpoints.

	![CacheIcon][CacheIcon]

5. You can then select one of the Cache Service endpoints to view its properties. The following sections will use settings from the **Dashboard** tab to configure Caching for an ASP.NET project.

<h2><a id="configureproject"></a>Configure the ASP.NET project</h2>
1. First, ensure that you have [installed the latest][]  **Azure SDK for .NET**.

2. In Visual Studio, right-click the ASP.NET project in **Solution Explorer**, and then select **Manage NuGet Packages**. (If you are using WebMatrix, click the **NuGet** button on the toolbar instead)

3. Type **WindowsAzure.Caching** in the **Search Online** edit box.

	![NuGetDialog][NuGetDialog]

4. Select the **Azure Caching** package, and then click the **Install** button.

<h2><a id="configurewebconfig"></a>Modify the Web.Config File</h2>
In addition to making assembly references for Cache, the NuGet package adds stub entries in the web.config file. To use Cache for ASP.NET page output caching, several modifications must be made to the web.config.

1. Open the **web.config** file for the ASP.NET project.

2. If you have existing **caching** and **outputCache** elements, comment them out (or remove them).

3. Then uncomment the **caching** element that was added by the Azure Caching NuGet package. The end result should look similar to the following screenshot.

	![OutputConfig][OutputConfig]

4. Next, find the **dataCacheClients** section. Uncomment the **securityProperties** child element.

	![CacheConfig][CacheConfig]

5. In the **autoDiscover** element, set the **identifier** attribute to your cache's endpoint URL. To find your endpoint URL, go to the cache properties in the Azure Management Portal. On the **Dashboard** tab, copy the **ENDPOINT URL** value in the **quick glance** section.

	![EndpointURL][EndpointURL]

6. In the **messageSecurity** element, set the **authorizationInfo** attribute to your cache's access key. To find the access key, select your cache in the Azure Management Portal. Then click the **Manage Keys** icon on the bottom bar. Click the copy button next to the **PRIMARY ACCESS KEY** text box.

	![ManageKeys][ManageKeys]

<h2><a id="useoutputcaching"></a>Use Output Caching</h2>
The final step is to configure pages in your ASP.NET Web Forms application to use output caching. This can be done by adding an **OutputCache** attribute to the beginning of the .ASPX source. For example:

	<%@ OutputCache Duration="45" VaryByParam="*" %>

The previous example caches the page for forty-five seconds. Because **VaryByParam** is set to "*", this cached page output does not change even if different query parameters are passed. But the following example does cache a different version of the page for each value of the "UserId" paraemter:

	<%@ OutputCache Duration="45" VaryByParam="UserId" %>	

  
  
  
[installed the latest]: http://www.windowsazure.com/en-us/downloads/?sdk=net
[NewIcon]: ./media/web-sites-web-forms-output-caching/CacheScreenshot_NewButton.PNG
[NewCacheDialog]: ./media/web-sites-web-forms-output-caching/CachingScreenshot_CreateOptions.PNG
[CacheIcon]: ./media/web-sites-web-forms-output-caching/CachingScreenshot_CacheIcon.PNG
[NuGetDialog]: ./media/web-sites-web-forms-output-caching/CachingScreenshot_NuGet.PNG
[OutputConfig]: ./media/web-sites-web-forms-output-caching/CachingScreenshot_OC_WebConfig.PNG
[CacheConfig]: ./media/web-sites-web-forms-output-caching/CachingScreenshot_CacheConfig.PNG
[EndpointURL]: ./media/web-sites-web-forms-output-caching/CachingScreenshot_EndpointURL.PNG
[ManageKeys]: ./media/web-sites-web-forms-output-caching/CachingScreenshot_ManageAccessKeys.PNG
  
  
  
