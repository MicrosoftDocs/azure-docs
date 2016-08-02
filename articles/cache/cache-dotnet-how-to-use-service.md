<properties 
	pageTitle="How to Use Azure Managed Cache Service" 
	description="Learn how to improve the performance of your Azure applications with Azure Managed Cache Service" 
	services="cache" 
	documentationCenter="" 
	authors="steved0x" 
	manager="douge" 
	editor=""/>

<tags 
	ms.service="cache" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="06/24/2016" 
	ms.author="sdanie"/>

# How to Use Azure Managed Cache Service

This guide shows you how to get started using 
**Azure Managed Cache Service**. The samples are written in C\# code and
use the .NET API. The scenarios covered include **creating and configuring a cache**, **configuring cache clients**, **adding and removing
objects from the cache, storing ASP.NET session state in the cache**,
and **enabling ASP.NET page output caching using the cache**. For more
information on using Azure Cache, refer to the [Next Steps][] section.

>[AZURE.IMPORTANT]As per last year's [announcement](https://azure.microsoft.com/blog/azure-managed-cache-and-in-role-cache-services-to-be-retired-on-11-30-2016/), Azure Managed Cache Service and Azure In-Role Cache service will be retired on November 30, 2016. Our recommendation is to use [Azure Redis Cache](https://azure.microsoft.com/services/cache/). For information on migrating, please see [Migrate from Managed Cache Service to Azure Redis Cache](../redis-cache/cache-migrate-to-redis.md).

<a name="what-is"></a>
## What is Azure Managed Cache Service?

Azure Managed Cache Service is a distributed, in-memory, scalable solution that enables you to build highly scalable and responsive applications by providing super-fast access to data.

Azure Managed Cache Service includes the following
features:

-   Pre-built ASP.NET providers for session state and page output
    caching, enabling acceleration of web applications without having to
    modify application code.
-   Caches any serializable managed object - for example: CLR objects, rows, XML,
    binary data.
-   Consistent development model across both Azure and Windows
    Server AppFabric.

Managed Cache Service gives you access to a secure, dedicated cache that is managed by Microsoft. A cache created using the Managed Cache Service is accessible from applications within Azure running on Azure Websites, Web & Worker Roles and Virtual Machines.

Managed Cache Service is available in three tiers:

-	Basic - Cache in sizes from 128MB to 1GB
-	Standard - Cache in sizes from 1GB to 10GB
-	Premium - Cache in sizes from 5GB to 150GB

Each tier differs in terms of features and pricing. The features are covered later in this guide, and for more information on pricing, see [Cache Pricing Details][].

This guide provides an overview of getting started with Managed Cache Service. For more detailed information on these features that are beyond the scope of this getting started guide, see [Overview of Azure Managed Cache Service][].

<a name="getting-started-cache-service"></a>
## Getting Started with Cache Service

Getting started with Managed Cache Service is easy. To get started, you provision and configure a cache. Next, you configure the cache clients so they can access the cache. Once the cache clients are configured, you can begin working with them.

-	[Create the cache][]
-	[Configure the cache][]
-	[Configure the cache clients][]

<a name="create-cache"></a>
## Create a cache

Cache instances in Managed Cache Service are created using PowerShell cmdlets. 

>Once a Managed Cache Service instance is created using the PowerShell cmdlets it can be viewed and configured in the [Azure Classic Portal][].

To create a Managed Cache Service instance, open an Azure PowerShell command window.

>For instructions on installing and using Azure PowerShell, see [How to install and configure Azure PowerShell][].

Invoke the [Add-AzureAccount][] cmdlet, and enter the email address and password associated with your account. A subscription is chosen by default and is displayed after you invoke the [Add-AzureAccount][] cmdlet. To change the subscription, invoke the [Select-AzureSubscription][] cmdlet.

>If you have configured Azure PowerShell with a certificate for your account then you can skip this step. For more information about connecting Azure PowerShell with your Azure account, see [How to install and configure Azure PowerShell][].

A subscription is chosen by default and is displayed. To change the subscription, invoke the [Select-AzureSubscription][] cmdlet.

Invoke the [New-AzureManagedCache][] cmdlet and specify the name, region, cache offering, and size for the cache.

For **Name**, enter a subdomain name to use for the cache endpoint. The endpoint must be a string between six and twenty characters, contain only lowercase numbers and letters, and must start with a letter.

For **Location**, specify a region for the cache. For the best performance, create the cache in the same region as the cache client application.

**Sku** and **Memory** work together to determine the size of the cache. Managed Cache Service is available in the three following tiers.

-	Basic - Cache in sizes from 128MB to 1GB in 128MB increments, with one default named cache
-	Standard - Cache in sizes from 1GB to 10GB in 1GB increments, with support for notifications and up to ten named caches
-	Premium - Cache in sizes from 5GB to 150GB in 5GB increments, with support for notifications, high availability, and up to ten named caches

Choose the **Sku** and **Memory** that meets the needs of your application. Note that some cache features, such as notifications and high availability, are only available with certain cache offerings. For more information on choosing the cache offering and size that's best for your application, see [Cache offerings][].

 In the following example, a Basic 128MB cache is created with name contosocache, in the South Central US geographic region.

	New-AzureManagedCache -Name contosocache -Location "South Central US" -Sku Basic -Memory 128MB

>For a complete list of parameters and values that can be used when creating a cache, see the [New-AzureManagedCache][] cmdlet documentation.

Once the PowerShell cmdlet is invoked, it can take a few minutes for the cache to be created. After the cache has been created, your new cache has a `Running` status and is ready for use with default settings, and can be viewed and configured in the [Azure Classic Portal][]. To customize the configuration of your cache, see the following [Configure the cache][] section.

You can monitor the creation progress in the Azure PowerShell window. Once the cache is ready for use, the [New-AzureManagedCache][] cmdlet will display the cache information, as shown in the following example.

	PS C:\> Add-AzureAccount
	VERBOSE: Account "user@domain.com" has been added.
	VERBOSE: Subscription "MySubscription" is selected as the default subscription.
	VERBOSE: To view all the subscriptions, please use Get-AzureSubscription.
	VERBOSE: To switch to a different subscription, please use Select-AzureSubscription.
	PS C:\> New-AzureManagedCache -Name contosocache -Location "South Central US" -Sku Basic -Memory 128MB
	VERBOSE: Intializing parameters...
	VERBOSE: Creating prerequisites...
	VERBOSE: Verify cache service name...
	VERBOSE: Creating cache service...
	VERBOSE: Waiting for cache service to be in ready state...


	Name     : contosocache
	Location : South Central US
	State    : Active
	Sku      : Basic
	Memory   : 128MB



	PS C:\>




<a name="enable-caching"></a>
## Configure the cache

The **Configure** tab for Cache in the Azure Classic Portal is where you configure the options for your cache. Each cache has a **default** named cache, and the Standard and Premium cache offerings support up to nine additional named caches, for a total of ten. Each named cache has its own set of options which allow you to configure your cache in a highly flexible manner.

![NamedCaches][NamedCaches]

To create a named cache, type the name of the new cache into the **Name** box, specify the desired options, click **Save**, and click **Yes** to confirm. To cancel any changes, click **Discard**.

## Expiry Policy and Time (min) ##

The **Expiry Policy** works in conjunction with the **Time (min)** setting to determine when cached items expire. There are three types of expiration policies: **Absolute**, **Sliding**, and **Never**. 

When **Absolute** is specified, the expiration interval specified by **Time (min)** begins when an item is added to the cache. After the interval specified by **Time (min)** elapses, the item expires. 

When **Sliding** is specified, the expiration interval specified by **Time (min)** is reset each time an item is accessed in the cache. The item does not expire until the interval specified by **Time (min)** elapses after the last access to the item.

When **Never** is specified, **Time (min)** must be set to **0**, and items do not expire.

**Absolute** is the default expiration policy and 10 minutes is the default setting for **Time (min)**. The expiration policy is fixed for each item in a named cache, but the **Time (min)** can be customized for each item by using **Add** and **Put** overloads that take a timeout parameter.

For more information about eviction and expiration policies, see [Expiration and Eviction][].

## Notifications ##

Cache notifications that allow your applications to receive asynchronous notifications when a variety of cache operations occur on the cache cluster. Cache notifications also provide automatic invalidation of locally cached objects. For more information, see [Notifications][].

>Notifications are only available in the Standard and Premium cache offerings, and are not available in the Basic cache offering. For more information, see [Cache offerings][].

## High Availability ##

When high availability is enabled, a backup copy is made of each item added to the cache. If an unexpected failure occurs to the primary copy of the item, the backup copy is still available.

By definition, the use of high availability multiplies the amount of required memory for each cached item by two. Consider this memory impact during capacity planning tasks. For more information, see [High Availability][].

>High availability is only available in the Premium cache offering, and is not available in the Basic or Standard cache offerings. For more information, see [Cache offerings][].

## Eviction ##

To maintain the memory capacity available within a cache, least recently used (LRU) eviction is supported. When memory consumption exceeds the memory threshold, objects are evicted from memory, regardless of whether they have expired or not, until the memory pressure is relieved.
Eviction is enabled by default. If eviction is disabled, items will not be evicted from the cache when the capacity is reached, and instead Put and Add operations will fail.

For more information about eviction and expiration policies, see [Expiration and Eviction][].

Once the cache is configured, you can configure the cache clients to allow access to the cache.

<a name="NuGet"></a>
## Configure the cache clients

A cache created using the Managed Cache Service is accessible from Azure applications running on Azure Websites, Web & Worker Roles and Virtual Machines. A NuGet package is provided that simplifies the configuration of cache client applications. 

To configure a client application using the Cache NuGet package, right-click the project in **Solution Explorer** and choose **Manage NuGet Packages**. 

![NuGetPackageMenu][NuGetPackageMenu]

Type **WindowsAzure.Caching** into the **Search Online** text box, and select **Windows**  
**Azure** **Cache** from the results. Click **Install**, and then click **I Accept**.

![NuGetPackage][NuGetPackage]

The NuGet package does several things: it adds the required configuration to the config file of the application, and it adds the required assembly references. For Cloud Services projects, it also adds a cache client diagnostic level setting to the ServiceConfiguration.cscfg file of the Cloud Service.

>For ASP.NET web projects, the Cache NuGet package also adds two commented out sections to web.config. The first section enables session state to be stored in the cache, and the second section enables ASP.NET page output caching. For more information, see [How To: Store ASP.NET Session State in the Cache] and [How To: Store ASP.NET Page Output Caching in the Cache][].

The NuGet package adds the following configuration elements into your application's web.config or app.config. A **dataCacheClients** section and a **cacheDiagnostics** section are added under the **configSections** element. If there is no **configSections** element present, one is created as a child of the **configuration** element.

    <configSections>
      <!-- Existing sections omitted for clarity. -->
      <section name="dataCacheClients" 
        type="Microsoft.ApplicationServer.Caching.DataCacheClientsSection,
              Microsoft.ApplicationServer.Caching.Core" 
        allowLocation="true" 
        allowDefinition="Everywhere" />
  
    <section name="cacheDiagnostics" 
        type="Microsoft.ApplicationServer.Caching.AzureCommon.DiagnosticsConfigurationSection,
              Microsoft.ApplicationServer.Caching.AzureCommon" 
        allowLocation="true" 
        allowDefinition="Everywhere" />


These new sections include references to a **dataCacheClients** element, which is also added to the **configuration** element.

    <dataCacheClients>
      <dataCacheClient name="default">
        <!--To use the in-role flavor of Azure Caching, 
            set identifier to be the cache cluster role name -->
        <!--To use the Azure Caching Service,
            set identifier to be the endpoint of the cache cluster -->
        <autoDiscover isEnabled="true" identifier="[Cache role name or Service Endpoint]" />
        <!--<localCache isEnabled="true" sync="TimeoutBased" objectCount="100000" ttlValue="300" />-->
        <!--Use this section to specify security settings for connecting to your cache. 
            This section is not required if your cache is hosted on a role that is a part
            of your cloud service. -->
        <!--<securityProperties mode="Message" sslEnabled="false">
          <messageSecurity authorizationInfo="[Authentication Key]" />
        </securityProperties>-->
      </dataCacheClient>
    </dataCacheClients>


After the configuration is added, replace the following two items in the newly added configuration.

1. Replace **[Cache role name or Service Endpoint]** with the endpoint, which is displayed on the Dashboard in the Azure Classic Portal.

	![Endpoint][Endpoint]

2. Uncomment the securityProperties section, and replace **[Authentication Key]** with the authentication key, which can be found in the Azure Classic Portal by clicking **Manage Keys** from the cache dashboard.

	![AccessKeys][AccessKeys]

>These settings must be configured properly or clients will not be able to access the cache.

For Cloud Services projects, the NuGet package also adds a **ClientDiagnosticLevel** setting to the **ConfigurationSettings** of the cache client role in ServiceConfiguration.cscfg. The following example is the **WebRole1** section from a ServiceConfiguration.cscfg file with a **ClientDiagnosticLevel** of 1, which is the default **ClientDiagnosticLevel**.

    <Role name="WebRole1">
      <Instances count="1" />
      <ConfigurationSettings>
        <!-- Existing settings omitted for clarity. -->
        <Setting name="Microsoft.WindowsAzure.Plugins.Caching.ClientDiagnosticLevel" 
                 value="1" />
      </ConfigurationSettings>
    </Role>

>The client diagnostic level configures the level of caching diagnostic information collected for cache clients. For more information, see [Troubleshooting and Diagnostics][]

The NuGet package also adds references to the following assemblies:

-   Microsoft.ApplicationServer.Caching.Client.dll
-   Microsoft.ApplicationServer.Caching.Core.dll
-   Microsoft.WindowsFabric.Common.dll
-   Microsoft.WindowsFabric.Data.Common.dll
-   Microsoft.ApplicationServer.Caching.AzureCommon.dll
-   Microsoft.ApplicationServer.Caching.AzureClientHelper.dll

If your project is a web project, the following assembly reference is also added:

-	Microsoft.Web.DistributedCache.dll.

Once your client project is configured for caching, you can use the techniques described in the following sections for working with your cache.

<a name="working-with-caches"></a>
## Working with Caches

The steps in this section describe how to perform common tasks with Cache.

-	[How To: Create a DataCache Object][]
-   [How To: Add and Retrieve an Object from the Cache][]
-   [How To: Specify the Expiration of an Object in the Cache][]
-   [How To: Store ASP.NET Session State in the Cache][]
-   [How To: Store ASP.NET Page Output Caching in the Cache][]

<a name="create-cache-object"></a>
## How To: Create a DataCache Object

In order to programatically work with a cache, you need a reference to the cache. Add the following to the top of any file from which you want to use
Azure Cache:

    using Microsoft.ApplicationServer.Caching;

>If Visual Studio doesn't recognize the types in the using
statement even after installing the Cache NuGet package, which adds the necessary references, ensure that the target
profile for the project is .NET Framework 4 or higher, and be sure to select one of the profiles that does not specify **Client Profile**. For instructions on configuring cache clients, see [Configure the cache clients][].

There are two ways to create a **DataCache** object. The first way is to simply create a **DataCache**, passing in the name of the desired cache.

    DataCache cache = new DataCache("default");

Once the **DataCache** is instantiated, you can use it to interact with the cache, as described in the following sections.

To use the second way, create a new **DataCacheFactory** object in your application using the default constructor. This causes the cache client to use the settings in the configuration file. Call either the **GetDefaultCache** method of the new **DataCacheFactory** instance which returns a **DataCache** object, or the **GetCache** method and pass in the name of your cache. These methods return a **DataCache** object that can then be used to programmatically access the cache.

    // Cache client configured by settings in application configuration file.
    DataCacheFactory cacheFactory = new DataCacheFactory();
    DataCache cache = cacheFactory.GetDefaultCache();
    // Or DataCache cache = cacheFactory.GetCache("MyCache");
    // cache can now be used to add and retrieve items.	

<a name="add-object"></a>
## How To: Add and Retrieve an Object from the Cache

To add an item to the cache, the **Add** method or the **Put** method
can be used. The **Add** method adds the specified object to the cache,
keyed by the value of the key parameter.

    // Add the string "value" to the cache, keyed by "item"
    cache.Add("item", "value");

If an object with the same key is already in the cache, a
**DataCacheException** will be thrown with the following message:

> ErrorCode:SubStatus: An attempt is being made to create an object with
> a Key that already exists in the cache. Caching will only accept
> unique Key values for objects.

To retrieve an object with a specific key, the **Get** method can be used. If the object exists, it is
returned, and if it does not, null is returned.

    // Add the string "value" to the cache, keyed by "key"
    object result = cache.Get("Item");
    if (result == null)
    {
        // "Item" not in cache. Obtain it from specified data source
        // and add it.
        string value = GetItemValue(...);
        cache.Add("item", value);
    }
    else
    {
        // "Item" is in cache, cast result to correct type.
    }

The **Put** method adds the object with the specified key to the cache
if it does not exist, or replaces the object if it does exist.

    // Add the string "value" to the cache, keyed by "item". If it exists,
    // replace it.
    cache.Put("item", "value");

<a name="specify-expiration"></a>
## How To: Specify the Expiration of an Object in the Cache

By default items in the cache expire 10 minutes after they are placed in the cache. This can be configured in the **Time (min)** setting on the Configure tab for Cache in the Azure Classic Portal.

![NamedCaches][NamedCaches]

There are three types of **Expiry Policy**: **Never**, **Absolute**, and **Sliding**. These configure how **Time (min)** is used to determine expiration. The default **Expiration Type** is **Absolute**, which means that the countdown timer for an item's expiration begins when the item is placed into the cache. Once the specified amount of time has elapsed for an item, the item expires. If **Sliding** is specified, then the expiration countdown for an item is reset each time the item is accessed in the cache, and the item will not expire until the specified amount of time has elapsed since its last access. If **Never** is specified, then **Time (min)** must be set to **0**, and items will not expire, and will remain valid as long as they are in the cache.

If a longer or shorter timeout interval than what is configured in the cache properties is desired, a specific duration can be specified when an item is added or updated in the cache by using the
overload of **Add** and **Put** that take a **TimeSpan** parameter. In
the following example, the string **value** is added to cache, keyed by
**item**, with a timeout of 30 minutes.

    // Add the string "value" to the cache, keyed by "item"
    cache.Add("item", "value", TimeSpan.FromMinutes(30));

To view the remaining timeout interval of an item in the cache, the
**GetCacheItem** method can be used to retrieve a **DataCacheItem**
object that contains information about the item in the cache, including
the remaining timeout interval.

    // Get a DataCacheItem object that contains information about
    // "item" in the cache. If there is no object keyed by "item" null
    // is returned. 
    DataCacheItem item = cache.GetCacheItem("item");
    TimeSpan timeRemaining = item.Timeout;

<a name="store-session"></a>
## How To: Store ASP.NET Session State in the Cache

The Session State Provider for Azure Cache is an
out-of-process storage mechanism for ASP.NET applications. This provider
enables you to store your session state in an Azure cache rather
than in-memory or in a SQL Server database. To use the caching session
state provider, first configure your cache, and then configure your ASP.NET application for Cache using the Cache NuGet package as described in [Getting Started with Managed Cache Service][]. When the Cache NuGet package is installed, it adds a commented out section in web.config that contains the required configuration for your ASP.NET application to use the Session State Provider for Azure Cache.

    <!--Uncomment this section to use Azure Caching for session state caching
    <system.web>
      <sessionState mode="Custom" customProvider="AFCacheSessionStateProvider">
        <providers>
          <add name="AFCacheSessionStateProvider" 
            type="Microsoft.Web.DistributedCache.DistributedCacheSessionStateStoreProvider,
                  Microsoft.Web.DistributedCache" 
            cacheName="default" 
            dataCacheClientName="default"/>
        </providers>
      </sessionState>
    </system.web>-->

>If your web.config does not contain this commented out section after installing the Cache NuGet package, ensure that the latest NuGet Package Manager is installed from [NuGet Package Manager Installation][], and then uninstall and reinstall the package.

To enable the Session State Provider for Azure Cache, uncomment the specified section. The default cache is specified in the provided snippet. To use a different cache, specify the desired cache in the **cacheName** attribute.

For more information about using the Managed Cache service session state
provider, see [Session State Provider for Azure Cache][].

<a name="store-page"></a>
## How To: Store ASP.NET Page Output Caching in the Cache

The Output Cache Provider for Azure Cache is an out-of-process storage mechanism for output cache data. This data is specifically for full HTTP
responses (page output caching). The provider plugs into the new output
cache provider extensibility point that was introduced in ASP.NET 4. To
use the output cache provider, first configure your cache cluster, and then configure your ASP.NET application for caching using the Cache NuGet package, as described in [Getting Started with Managed Cache Service][]. When the Caching NuGet package is installed, it adds the following commented out section in web.config that contains the required configuration for your ASP.NET application to use the Output Cache Provider for Azure Caching.

    <!--Uncomment this section to use Azure Caching for output caching
    <caching>
      <outputCache defaultProvider="AFCacheOutputCacheProvider">
        <providers>
          <add name="AFCacheOutputCacheProvider" 
            type="Microsoft.Web.DistributedCache.DistributedCacheOutputCacheProvider,
                  Microsoft.Web.DistributedCache" 
            cacheName="default" 
            dataCacheClientName="default" />
        </providers>
      </outputCache>
    </caching>-->

>If your web.config does not contain this commented out section after installing the Cache NuGet package, ensure that the latest NuGet Package Manager is installed from [NuGet Package Manager Installation][], and then uninstall and reinstall the package.

To enable the Output Cache Provider for Azure Cache, uncomment the specified section. The default cache is specified in the provided snippet. To use a different cache, specify the desired cache in the **cacheName** attribute.

Add an **OutputCache** directive to each page for which you wish to cache the output.

    <%@ OutputCache Duration="60" VaryByParam="*" %>

In this example the cached page data will remain in the cache for 60 seconds, and a different version of the page will be cached for each parameter combination. For more information on the available options, see [OutputCache Directive][].

For more information about using the Output Cache Provider for Azure Cache, see [Output Cache Provider for Azure Cache][].

<a name="next-steps"></a>
## Next Steps

Now that you've learned the basics of Managed Cache Service,
follow these links to learn how to do more complex caching tasks.

-   See the MSDN Reference: [Managed Cache Service][]
-	Learn how to migrate to Managed Cache Service: [Migrate to Managed Cache Service][]
-   Check out the samples: [Managed Cache Service Samples][]

<!-- INTRA-TOPIC LINKS -->
[Next Steps]: #next-steps
[What is Azure Managed Cache Service?]: #what-is
[Create an Azure Cache]: #create-cache
[Which type of caching is right for me?]: #choosing-cache
[Prepare Your Visual Studio Project to Use Azure Caching]: #prepare-vs
[Configure Your Application to Use Caching]: #configure-app
[Getting Started with Managed Cache Service]: #getting-started-cache-service
[Create the cache]: #create-cache
[Configure the cache]: #enable-caching
[Configure the cache clients]: #NuGet
[Working with Caches]: #working-with-caches
[How To: Create a DataCache Object]: #create-cache-object
[How To: Add and Retrieve an Object from the Cache]: #add-object
[How To: Specify the Expiration of an Object in the Cache]: #specify-expiration
[How To: Store ASP.NET Session State in the Cache]: #store-session
[How To: Store ASP.NET Page Output Caching in the Cache]: #store-page
[Target a Supported .NET Framework Profile]: #prepare-vs-target-net
  
<!-- IMAGES -->
[NewCacheMenu]: ./media/cache-dotnet-how-to-use-service/CacheServiceNewCacheMenu.png

[QuickCreate]: ./media/cache-dotnet-how-to-use-service/CacheServiceQuickCreate.png

[Endpoint]: ./media/cache-dotnet-how-to-use-service/CacheServiceEndpoint.png

[AccessKeys]: ./media/cache-dotnet-how-to-use-service/CacheServiceManageAccessKeys.png

[NuGetPackage]: ./media/cache-dotnet-how-to-use-service/CacheServiceManageNuGetPackage.png

[NuGetPackageMenu]: ./media/cache-dotnet-how-to-use-service/CacheServiceManageNuGetPackagesMenu.png

[NamedCaches]: ./media/cache-dotnet-how-to-use-service/CacheServiceNamedCaches.jpg
  
   
<!-- LINKS -->
[Azure Classic Portal]: https://manage.windowsazure.com/
[How to: Configure a Cache Client Programmatically]: http://msdn.microsoft.com/library/windowsazure/gg618003.aspx
[Session State Provider for Azure Cache]: http://go.microsoft.com/fwlink/?LinkId=320835
[Azure AppFabric Cache: Caching Session State]: http://www.microsoft.com/showcase/details.aspx?uuid=87c833e9-97a9-42b2-8bb1-7601f9b5ca20
[Output Cache Provider for Azure Cache]: http://go.microsoft.com/fwlink/?LinkId=320837
[Azure Shared Caching]: http://msdn.microsoft.com/library/windowsazure/gg278356.aspx
[Team Blog]: http://blogs.msdn.com/b/windowsazure/
[Azure Caching]: http://www.microsoft.com/showcase/Search.aspx?phrase=azure+caching
[How to Configure Virtual Machine Sizes]: http://go.microsoft.com/fwlink/?LinkId=164387
[Azure Caching Capacity Planning Considerations]: http://go.microsoft.com/fwlink/?LinkId=320167
[Azure Caching]: http://go.microsoft.com/fwlink/?LinkId=252658
[How to: Set the Cacheability of an ASP.NET Page Declaratively]: http://msdn.microsoft.com/library/zd1ysf1y.aspx
[How to: Set a Page's Cacheability Programmatically]: http://msdn.microsoft.com/library/z852zf6b.aspx
[Overview of Azure Managed Cache Service]: http://go.microsoft.com/fwlink/?LinkId=320830
[Managed Cache Service]: http://go.microsoft.com/fwlink/?LinkId=320830
[OutputCache Directive]: http://go.microsoft.com/fwlink/?LinkId=251979
[Troubleshooting and Diagnostics]: http://go.microsoft.com/fwlink/?LinkId=320839
[NuGet Package Manager Installation]: http://go.microsoft.com/fwlink/?LinkId=240311
[Cache Pricing Details]: http://www.windowsazure.com/pricing/details/cache/
[Cache offerings]: http://go.microsoft.com/fwlink/?LinkId=317277
[Capacity planning]: http://go.microsoft.com/fwlink/?LinkId=320167
[Expiration and Eviction]: http://go.microsoft.com/fwlink/?LinkId=317278
[High Availability]: http://go.microsoft.com/fwlink/?LinkId=317329
[Notifications]: http://go.microsoft.com/fwlink/?LinkId=317276
[Migrate to Managed Cache Service]: http://go.microsoft.com/fwlink/?LinkId=317347
[Managed Cache Service Samples]: http://go.microsoft.com/fwlink/?LinkId=320840
[New-AzureManagedCache]: http://go.microsoft.com/fwlink/?LinkId=400495
[Azure Managed Cache Cmdlets]: http://go.microsoft.com/fwlink/?LinkID=398555
[How to install and configure Azure PowerShell]: http://go.microsoft.com/fwlink/?LinkId=400494
[Add-AzureAccount]: http://msdn.microsoft.com/library/dn495128.aspx
[Select-AzureSubscription]: http://msdn.microsoft.com/library/dn495203.aspx

[Which Azure Cache offering is right for me?]: cache-faq.md#which-azure-cache-offering-is-right-for-me
 
