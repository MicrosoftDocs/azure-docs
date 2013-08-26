<properties linkid="manage-services-web-sites-output-caching" urlDisplayName="Page Output Caching" pageTitle="How to use the Cache service for output caching" metaKeywords="" metaDescription="Learn how to use the Windows Azure Cache service for output caching with a Windows Azure web site." metaCanonical="" disqusComments="1" umbracoNaviHide="1" writer="jroth" />

<div chunk="../chunks/article-left-menu.md" />

# How to Use ASP.NET Web Forms Output Caching with Windows Azure Web Sites

This topic explains how to use the Windows Azure Cache Service (Preview) to support ASP.NET page output caching for ASP.NET Web Forms. Page output caching is an optimization that directly returns a cached rendering page for a specific duration of time. This is useful in situations where a page is accessed more frequently than it typically changes. It is important to note that page output caching is not supported for ASP.NET MVC applications.

The Cache Service (Preview) provides a distributed caching service that is external to the web site. This enables all instances of the web site to access the same cached rendering of a page.

The basic steps to use the Cache Service (Preview) for page output caching include:

* [Create the cache.](#createcache)
* [Configure the ASP.NET project to use Windows Azure Cache.](#configureproject)
* [Modify the web.config file.](#configurewebconfig)
* [Use output caching to temporarily return cached versions of a page.](#useoutputcaching)

<h2><a id="createcache"></a>Create the Cache</h2>
1. At the bottom of the Windows Azure Management Portal, click on the **New** icon.

	![NewIcon][]

2. Select **Data Services**, **Cache**, and then click **Quick Create**.

	![NewCacheDialog][]

3. Type a unique name for the cache in the **Endpoint** text box. Then select appropriate values for the other cache properties, and click **Create a New Cache**.

4. Select the **Cache** icon in the Management Portal to view all of your Cache Service endpoints.

	![CacheIcon][]

5. You can then select one of the Cache Service endpoints to view its properties. The following sections will use settings from the **Dashboard** tab to configure Caching for an ASP.NET project.

<h2><a id="configureproject"></a>Configure the ASP.NET project</h2>
1. First, ensure that you have [installed the latest][]  **Windows Azure SDK for .NET**.

2. In Visual Studio, right-click the ASP.NET project in **Solution Explorer**, and then select **Manage NuGet Packages**. (If you are using WebMatrix, click the **NuGet** button on the toolbar instead)

3. Type **WindowsAzure.Caching** in the **Search Online** edit box.

	![NuGetDialog][]

4. Select the **Windows Azure Caching** package, and then click the **Install** button.

<h2><a id="configurewebconfig"></a>Modify the Web.Config File</h2>
In addition to making assembly references for Cache, the NuGet package adds stub entries in the web.config file. To use Cache for ASP.NET page output caching, several modifications must be made to the web.config.

1. Open the **web.config** file for the ASP.NET project.

2. If you have existing **caching** and **outputCache** elements, comment them out (or remove them).

3. Then uncomment the **caching** element that was added by the Windows Azure Caching NuGet package. The end result should look similar to the following screenshot.

	![OutputConfig][]

4. Next, find the **dataCacheClients** section. Uncomment the **securityProperties** child element.

	![CacheConfig][]

5. In the **autoDiscover** element, set the **identifier** attribute to your cache's endpoint URL. To find your endpoint URL, go to the cache properties in the Windows Azure Management Portal. On the **Dashboard** tab, copy the **ENDPOINT URL** value in the **quick glance** section.

	![EndpointURL][]

6. In the **messageSecurity** element, set the **authorizationInfo** attribute to your cache's access key. To find the access key, select your cache in the Windows Azure Management Portal. Then click the **Manage Keys** icon on the bottom bar. Click the copy button next to the **PRIMARY ACCESS KEY** text box.

	![ManageKeys][]

<h2><a id="useoutputcaching"></a>Use Output Caching</h2>
The final step is to configure pages in your ASP.NET Web Forms application to use output caching. This can be done by adding an **OutputCache** attribute to the beginning of the .ASPX source. For example:

	<%@ OutputCache Duration="45" VaryByParam="*" %>

The previous example caches the page for forty-five seconds. Because **VaryByParam** is set to "*", this cached page output does not change even if different query parameters are passed. But the following example does cache a different version of the page for each value of the "UserId" paraemter:

	<%@ OutputCache Duration="45" VaryByParam="UserId" %>	

  [NewIcon]: ../media/CacheScreenshot_NewButton.png
  [NewCacheDialog]: ../media/CachingScreenshot_CreateOptions.png
  [CacheIcon]: ../media/CachingScreenshot_CacheIcon.png
  [installed the latest]: http://www.windowsazure.com/en-us/downloads/?sdk=net
  [NuGetDialog]: ../media/CachingScreenshot_NuGet.png
  [OutputConfig]: ../media/CachingScreenshot_OC_WebConfig.png
  [CacheConfig]: ../media/CachingScreenshot_CacheConfig.png
  [EndpointURL]: ../media/CachingScreenshot_EndpointURL.png
  [ManageKeys]: ../media/CachingScreenshot_ManageAccessKeys.png