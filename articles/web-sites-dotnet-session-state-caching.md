<properties 
	pageTitle="Session state with Azure Redis cache in Azure App Service" 
	description="Learn how to use the Azure Cache Service to support ASP.NET session state caching." 
	services="app-service\web" 
	documentationCenter=".net" 
 	authors="Rick-Anderson" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="03/24/2015" 
	ms.author="riande"/>


# Session state with Azure Redis cache in Azure App Service


This topic explains how to use the Azure Redis Cache Service for session state.

If your ASP.NET web app uses session state, you will need to configure an external session state provider (either the Redis Cache Service or a SQL Server session state provider). If you use session state, and don't use an external provider, you will be limited to one instance of your web app. The Redis Cache Service is the fastest and simplest to enable.

<h2><a id="createcache"></a>Create the Cache</h2>
Follow [these directions](cache-dotnet-how-to-use-azure-redis-cache.md#create-cache) to create the cache.

<h2><a id="configureproject"></a>Add the RedisSessionStateProvider NuGet package to your web app</h2>
Install the NuGet `RedisSessionStateProvider` package.  Use the following command to install from the package manager console (**Tools** > **NuGet Package Manager** > **Package Manager Console**):

  `PM> Install-Package Microsoft.Web.RedisSessionStateProvider`
  
To install from **Tools** > **NuGet Package Manager** > **Manage NugGet Packages for Solution**, search for `RedisSessionStateProvider`.

For more information see the [NuGet RedisSessionStateProvider page](http://www.nuget.org/packages/Microsoft.Web.RedisSessionStateProvider/ ) and [Configure the cache client](cache-dotnet-how-to-use-azure-redis-cache.md#NuGet).

<h2><a id="configurewebconfig"></a>Modify the Web.Config File</h2>
In addition to making assembly references for Cache, the NuGet package adds stub entries in the *web.config* file. 

1. Open the *web.config* and find the the **sessionState** element.

1. Enter the values for `host`, `accessKey`, `port` (the SSL port should be 6380), and set `SSL` to `true`. These values can be obtained from the [Azure Portal](http://go.microsoft.com/fwlink/?LinkId=529715) blade for your cache instance. For more information, see [Connect to the cache](cache-dotnet-how-to-use-azure-redis-cache.md#connect-to-cache). Note that the non-SSL port is disabled by default for new caches. For more information about enabling the non-SSL port, see the [Access Ports](https://msdn.microsoft.com/library/azure/dn793612.aspx#AccessPorts) section in the [Configure a cache in Azure Redis Cache](https://msdn.microsoft.com/library/azure/dn793612.aspx) topic. The following markup shows the changes to the *web.config* file.


  <pre class="prettyprint">  
    &lt;system.web&gt;
    &lt;customErrors mode="Off" /&gt;
    &lt;authentication mode="None" /&gt;
    &lt;compilation debug="true" targetFramework="4.5" /&gt;
    &lt;httpRuntime targetFramework="4.5" /&gt;
  &lt;sessionState mode="Custom" customProvider="RedisSessionProvider"&gt;
      &lt;providers&gt;  
          &lt;!--&lt;add name="RedisSessionProvider" 
            host = "127.0.0.1" [String]
            port = "" [number]
            accessKey = "" [String]
            ssl = "false" [true|false]
            throwOnError = "true" [true|false]
            retryTimeoutInMilliseconds = "0" [number]
            databaseId = "0" [number]
            applicationName = "" [String]
          /&gt;--&gt;
         &lt;add name="RedisSessionProvider" 
              type="Microsoft.Web.Redis.RedisSessionStateProvider" 
              <mark>port="6380"
              host="movie2.redis.cache.windows.net" 
              accessKey="m7PNV60CrvKpLqMUxosC3dSe6kx9nQ6jP5del8TmADk=" 
              ssl="true"</mark> /&gt;
      &lt;!--&lt;add name="MySessionStateStore" type="Microsoft.Web.Redis.RedisSessionStateProvider" host="127.0.0.1" accessKey="" ssl="false" /&gt;--&gt;
      &lt;/providers&gt;
    &lt;/sessionState&gt;
  &lt;/system.web&gt;</pre>


<h2><a id="usesessionobject"></a>Use the Session Object in Code</h2>
The final step is to begin using the Session object in your ASP.NET code. You add objects to session state by using the **Session.Add** method. This method uses key-value pairs to store items in the session state cache.

    string strValue = "yourvalue";
	Session.Add("yourkey", strValue);

The following code retrieves this value from session state.

    object objValue = Session["yourkey"];
    if (objValue != null)
       strValue = (string)objValue;	

You can also use the Redis Cache to cache objects in your web app. For more info, see [MVC movie app with Azure Redis Cache in 15 minutes](http://azure.microsoft.com/blog/2014/06/05/mvc-movie-app-with-azure-redis-cache-in-15-minutes/).
For more details about how to use ASP.NET session state, see [ASP.NET Session State Overview][].

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the old portal to the new portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)

  *By [Rick Anderson](https://twitter.com/RickAndMSFT)*
  
  [installed the latest]: http://www.windowsazure.com/downloads/?sdk=net  
  [ASP.NET Session State Overview]: http://msdn.microsoft.com/library/ms178581.aspx

  [NewIcon]: ./media/web-sites-dotnet-session-state-caching/CacheScreenshot_NewButton.png
  [NewCacheDialog]: ./media/web-sites-dotnet-session-state-caching/CachingScreenshot_CreateOptions.png
  [CacheIcon]: ./media/web-sites-dotnet-session-state-caching/CachingScreenshot_CacheIcon.png
  [NuGetDialog]: ./media/web-sites-dotnet-session-state-caching/CachingScreenshot_NuGet.png
  [OutputConfig]: ./media/web-sites-dotnet-session-state-caching/CachingScreenshot_OC_WebConfig.png
  [CacheConfig]: ./media/web-sites-dotnet-session-state-caching/CachingScreenshot_CacheConfig.png
  [EndpointURL]: ./media/web-sites-dotnet-session-state-caching/CachingScreenshot_EndpointURL.png
  [ManageKeys]: ./media/web-sites-dotnet-session-state-caching/CachingScreenshot_ManageAccessKeys.png
