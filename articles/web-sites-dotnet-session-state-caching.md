<properties linkid="video-center-index" urlDisplayName="index" pageTitle="Use ASP.NET session state with Azure Web Sites" metaKeywords="azure cache service session state" description="Learn how to use the Azure Cache Service to support ASP.NET session state caching." metaCanonical="" services="cache" documentationCenter=".NET" title="How to Use ASP.NET Session State with Azure Web Sites" authors="jroth" solutions="" manager="" editor="mollybos" />



# How to Use ASP.NET Session State with Azure Web Sites

This topic explains how to use the Azure Cache Service (Preview) to support ASP.NET session state caching.

Without an external provider, session state is stored in-process on the web server hosting the site. For Azure Web Sites, there are two problems with in-process session state. First, for sites with multiple instances, session state stored on one instance is not accessible to other instances. Because a user request can be routed to any instance, the session information is not guaranteed to be there. Second, any changes in configuration could result in the web site running on a completely different server.

The Cache Service (Preview) provides a distributed caching service that is external to the web site. This solves the problem with in-process session state. For more information about how to use session state, see [ASP.NET Session State Overview][].

The basic steps to use the Cache Service (Preview) for session state caching include:

* [Create the cache.](#createcache)
* [Configure the ASP.NET project to use Azure Cache.](#configureproject)
* [Modify the web.config file.](#configurewebconfig)
* [Use the Session object to store and retrieve cached items.](#usesessionobject)

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
In addition to making assembly references for Cache, the NuGet package adds stub entries in the web.config file. To use Cache for session state, several modifications must be made to the web.config.

1. Open the **web.config** file for the ASP.NET project.

2. Find the existing **sessionState** element and comment it out (or remove it).

3. Then uncomment the **sessionState** element that was added by the Azure Caching NuGet package. The end result should look similar to the following screenshot.

	![SessionStateConfig][SessionStateConfig]

4. Next, find the **dataCacheClients** section. Uncomment the **securityProperties** child element.

	![CacheConfig][CacheConfig]

5. In the **autoDiscover** element, set the **identifier** attribute to your cache's endpoint URL. To find your endpoint URL, go to the cache properties in the Azure Management Portal. On the **Dashboard** tab, copy the **ENDPOINT URL** value in the **quick glance** section.

	![EndpointURL][EndpointURL]

6. In the **messageSecurity** element, set the **authorizationInfo** attribute to your cache's access key. To find the access key, select your cache in the Azure Management Portal. Then click the **Manage Keys** icon on the bottom bar. Click the copy button next to the **PRIMARY ACCESS KEY** text box.

	![ManageKeys][ManageKeys]

<h2><a id="usesessionobject"></a>Use the Session Object in Code</h2>
The final step is to begin using the Session object in your ASP.NET code. You add objects to session state by using the **Session.Add** method. This method uses key-value pairs to store items in the session state cache.

    string strValue = "yourvalue";
	Session.Add("yourkey", strValue);

The following code retrieves this value from session state.

    object objValue = Session["yourkey"];
    if (objValue != null)
       strValue = (string)obj;	

For more details about how to use ASP.NET session state, see [ASP.NET Session State Overview][].

  
  
  
  [installed the latest]: http://www.windowsazure.com/en-us/downloads/?sdk=net  
  [ASP.NET Session State Overview]: http://msdn.microsoft.com/en-us/library/ms178581.aspx

  [NewIcon]: ./media/web-sites-dotnet-session-state-caching/CacheScreenshot_NewButton.png
  [NewCacheDialog]: ./media/web-sites-dotnet-session-state-caching/CachingScreenshot_CreateOptions.png
  [CacheIcon]: ./media/web-sites-dotnet-session-state-caching/CachingScreenshot_CacheIcon.png
  [NuGetDialog]: ./media/web-sites-dotnet-session-state-caching/CachingScreenshot_NuGet.png
  [OutputConfig]: ./media/web-sites-dotnet-session-state-caching/CachingScreenshot_OC_WebConfig.png
  [CacheConfig]: ./media/web-sites-dotnet-session-state-caching/CachingScreenshot_CacheConfig.png
  [EndpointURL]: ./media/web-sites-dotnet-session-state-caching/CachingScreenshot_EndpointURL.png
  [ManageKeys]: ./media/web-sites-dotnet-session-state-caching/CachingScreenshot_ManageAccessKeys.png
