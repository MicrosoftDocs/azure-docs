<properties urlDisplayName="index" pageTitle="Use ASP.NET session state with Azure Websites" metaKeywords="azure cache service session state" description="Learn how to use the Azure Cache Service to support ASP.NET session state caching." metaCanonical="" services="cache" documentationCenter=".net" title="" authors="riande" solutions="" manager="wpickett" editor="mollybos"/>

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="dotnet" ms.topic="article" ms.date="10/13/2014" ms.author="riande" />


# How to Use ASP.NET Session State with Azure Websites

*By [Rick Anderson](https://twitter.com/RickAndMSFT). Updated 1 July 2014.*

This topic explains how to use the Azure Redis Cache Service (Preview) for session state.

If your ASP.NET web app uses session state, you will need to configure an external session state provider (either the Redis Cache Service or a SQL Server session state provider). If you use session state, and don't use an external provider, you will be limited to one instance of your web app. The Redis Cache Service is the fastest and simplest to enable.

The basic steps to use the Cache Service (Preview) for session state caching include:

* [Create the cache.](#createcache)
* [Add the RedisSessionStateProvider NuGet package to your web app.](#configureproject)
* [Modify the web.config file.](#configurewebconfig)
* [Use the Session object to store and retrieve cached items.](#usesessionobject)

<h2><a id="createcache"></a>Create the Cache</h2>
Follow [these directions](http://azure.microsoft.com/en-us/documentation/articles/cache-dotnet-how-to-use-azure-redis-cache/#create-cache) to create the cache.

<h2><a id="configureproject"></a>Add the RedisSessionStateProvider NuGet package to your web app</h2>
Install the NuGet `RedisSessionStateProvider` package.  Use the following command to install from the package manager console (**Tools** > **NuGet Package Manager** > **Package Manager Console**):

  `PM> Install-Package RedisSessionStateProvider -IncludePrerelease`
  
To install from **Tools** > **NuGet Package Manager** > **Manage NugGet Packages for Solution**, search for `RedisSessionStateProvider` and be sure to specify **Include Prerelease**.

For more information see the [NuGet RedisSessionStateProvider page](http://www.nuget.org/packages/Microsoft.Web.RedisSessionStateProvider/ ) and [Configure the cache client](http://azure.microsoft.com/en-us/documentation/articles/cache-dotnet-how-to-use-azure-redis-cache/#NuGet).

<h2><a id="configurewebconfig"></a>Modify the Web.Config File</h2>
In addition to making assembly references for Cache, the NuGet package adds stub entries in the *web.config* file. 

1. Open the *web.config* and find the the **sessionState** element.

1. Enter the values for `host`, `accessKey`, `port` (the SSL port should be 6380), and set `SSL` to `true`. These values can be obtained from the Azure management preview portal blade for your cache instance. For more information, see [Connect to the cache](http://azure.microsoft.com/en-us/documentation/articles/cache-dotnet-how-to-use-azure-redis-cache/#connect-to-cache).
The following markup shows the changes to the *web.config* file.


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
       strValue = (string)obj;	

You can also use the Redis Cache to cache objects in your web app. For more info see [MVC movie app with Azure Redis Cache in 15 minutes](http://azure.microsoft.com/blog/2014/06/05/mvc-movie-app-with-azure-redis-cache-in-15-minutes/).
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
