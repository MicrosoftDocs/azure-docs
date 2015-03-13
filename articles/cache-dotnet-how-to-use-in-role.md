<properties 
	pageTitle="How to use In-Role Cache (.NET) - Azure feature guide" 
	description="Learn how to use Azure In-Role Cache. The samples are written in C# code and use the .NET API." 
	services="cache" 
	documentationCenter=".net" 
	authors="steved0x" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="cache" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/24/2015" 
	ms.author="sdanie"/>






# How to Use In-Role Cache for Azure Cache

This guide shows you how to get started using 
**In-Role Cache for Azure Cache**. The samples are written in C\# code and
use the .NET API. The scenarios covered include **configuring a cache cluster**, **configuring cache clients**, **adding and removing
objects from the cache, storing ASP.NET session state in the cache**,
and **enabling ASP.NET page output caching using the cache**. For more
information on using In-Role Cache, refer to the [Next Steps][] section.

>For guidance on choosing the right Azure Cache offering for your application, see [Which Azure Cache offering is right for me?][].

<a name="what-is"></a>
## What is In-Role Cache?

In-Role Cache provides a caching layer to your Azure applications. Caching increases performance by temporarily storing information in-memory from
other backend sources, and can reduce the costs associated with database
transactions in the cloud. In-Role Cache includes the following
features:

-   Pre-built ASP.NET providers for session state and page output
    caching, enabling acceleration of web applications without having to
    modify application code.
-   Caches any serializable managed object - for example: CLR objects, rows, XML,
    binary data.
-   Consistent development model across both Azure and Windows
    Server AppFabric.

In-Role Cache introduces a new way to perform caching by using a portion of the memory of the virtual machines that host the role instances in your Azure cloud services (also known as hosted services). You have greater flexibility in terms of deployment options, the caches can be very large in size and have no cache specific quota restrictions.

Caching on role instances has the following advantages:

-	Pay no premium for caching. You pay only for the compute resources that host the cache.
-	Eliminates cache quotas and throttling.
-	Offers greater control and isolation. 
-	Improved performance.
-	Automatically sizes caches when roles are scaled in or out. Effectively scales the memory that is available for caching up or down when role instances are added or removed.
-	Provides full-fidelity development time debugging. 
-	Supports the memcache protocol.

In addition, caching on role instances offers these configurable options:

-	Configure a dedicated role for caching, or co-locate caching on existing roles. 
-	Make your cache available to multiple clients in the same cloud service deployment.
-	Create multiple named caches with different properties.
-	Optionally configure high availability on individual caches.
-	Use expanded caching capabilities such as regions, tagging, and notifications.

This guide provides an overview of getting started with In-Role Cache. For more detailed information on these features that are beyond the scope of this getting started guide, see [Overview of In-Role Cache][].

<a name="getting-started-cache-role-instance"></a>
## Getting Started with In-Role Cache

In-Role Cache provides a way to enable caching using the memory that is on the virtual machines that host your role instances. The role instances that host your caches are known as a **cache cluster**. There are two deployment topologies for caching on role instances:

-	**Dedicated Role** caching - The role instances are used exclusively for caching.
-	**Co-located Role** caching - The cache shares the VM resources (bandwidth, CPU, and memory) with the application.

To use caching on role instances, you need to configure a cache cluster, and then configure the cache clients so they can access the cache cluster.

-	[Configure the cache cluster][]
-	[Configure the cache clients][]

<a name="enable-caching"></a>
## Configure the cache cluster

To configure a **Co-located Role** cache cluster, select the role in which you wish to host the cache cluster. Right-click the role properties in **Solution Explorer** and choose **Properties**.

![RoleCache1][RoleCache1]

Switch to the **Caching** tab, check the **Enable Caching** checkbox, and specify the desired caching options. When caching is enabled in a **Worker Role** or **ASP.NET Web Role**, the default configuration is **Co-located Role** caching with 30% of the memory of the role instances allocated for caching. A default cache is automatically configured, and additional named caches can be created if desired, and these caches will share the allocated memory.

![RoleCache2][RoleCache2]

To configure a **Dedicated Role** cache cluster, add a **Cache Worker Role** to your project.

![RoleCache7][RoleCache7]

When a **Cache Worker Role** is added to a project, the default configuration is **Dedicated Role** caching.

![RoleCache8][RoleCache8]

Once caching is enabled, the cache cluster storage account can be configured. In-Role Cache requires an Azure storage account. This storage account is used to hold configuration data about the cache cluster that is accessed from all virtual machines that make up the cache cluster. This storage account is specified on the **Caching** tab of the cache cluster role property page, just above the **Named Cache Settings**.

![RoleCache10][RoleCache10]

>If this storage account is not configured the roles will fail to start. 

The size of the cache is determined by a combination of the VM size of the role, the instance count of the role, and whether the cache cluster is configured as a dedicated role or co-located role cache cluster.

>This section provides a simplified overview on configuring the cache size. For more information on cache size and other capacity planning considerations, see [In-Role Cache Capacity Planning Considerations][].

To configure the virtual machine size and the number of role instances, right-click the role properties in **Solution Explorer** and choose **Properties**.

![RoleCache1][RoleCache1]

Switch to the **Configuration** tab. The default **Instance count** is 1, and the default **VM size** is **Small**.

![RoleCache3][RoleCache3]

The total memory for the VM sizes is as follows: 

-	**Small**: 1.75 GB
-	**Medium**: 3.5 GB
-	**Large**: 7 GB
-	**ExtraLarge**: 14 GB


> These memory sizes represent the total amount of memory available to the VM which is shared across the OS, cache process, cache data, and application. For more information on configuring Virtual Machine Sizes, see [How to Configure Virtual Machine Sizes][]. Note that cache is unsupported on **ExtraSmall** VM sizes.

When **Co-located Role** caching is specified, the cache size is determined by taking the specified percentage of the virtual machine memory. When **Dedicated Role** caching is specified, all of the available memory of the virtual machine is used for caching. If two role instances are configured, the combined memory of the virtual machines is used. This forms a cache cluster where the available caching memory is distributed across multiple role instances but presented to the clients of the cache as a single resource. Configuring additional role instances increases the cache size in the same manner. To determine the settings needed to provision a cache of the desired size, you can use the Capacity Planning Spreadsheet which is covered in [In-Role Cache Capacity Planning Considerations][].

Once the cache cluster is configured, you can configure the cache clients to allow access to the cache.

<a name="NuGet"></a>
## Configure the cache clients

To access a In-Role Cache cache, the clients must be within the same deployment. If the cache cluster is a dedicated role cache cluster, then the clients are other roles in the deployment. If the cache cluster is a co-located role cache cluster, then the clients could be either  the other roles in the deployment, or the roles themselves that host the cache cluster. A NuGet package is provided that can be used to configure each client role that accesses the cache. To configure a role to access a cache cluster using the Caching NuGet package, right-click the role project in **Solution Explorer** and choose **Manage NuGet Packages**. 

![RoleCache4][RoleCache4]

Select **In-Role Cache**, click **Install**, and then click **I Accept**.

>If **In-Role Cache** does not appear in the list type **WindowsAzure.Caching** into the **Search Online** text box and select it from the results.

![RoleCache5][RoleCache5]

The NuGet package does several things: it adds the required configuration to the config file of the role, it adds a cache client diagnostic level setting to the ServiceConfiguration.cscfg file of the Azure application, and it adds the required assembly references.

>For ASP.NET web roles, the Caching NuGet package also adds two commented out sections to web.config. The first section enables session state to be stored in the cache, and the second section enables ASP.NET page output caching. For more information, see [How To: Store ASP.NET Session State in the Cache] and [How To: Store ASP.NET Page Output Caching in the Cache][].

The NuGet package adds the following configuration elements into your role's web.config or app.config. A **dataCacheClients** section and a **cacheDiagnostics** section are added under the **configSections** element. If there is no **configSections** element present, one is created as a child of the **configuration** element.

    <configSections>
      <!-- Existing sections omitted for clarity. -->

      <section name="dataCacheClients" 
               type="Microsoft.ApplicationServer.Caching.DataCacheClientsSection, Microsoft.ApplicationServer.Caching.Core" 
               allowLocation="true" 
               allowDefinition="Everywhere" />
    
      <section name="cacheDiagnostics" 
               type="Microsoft.ApplicationServer.Caching.AzureCommon.DiagnosticsConfigurationSection, Microsoft.ApplicationServer.Caching.AzureCommon" 
               allowLocation="true" 
               allowDefinition="Everywhere" />
    </configSections>

These new sections include references to a **dataCacheClients** element and a **cacheDiagnostics** element. These elements are also added to the **configuration** element.

    <dataCacheClients>
      <dataCacheClient name="default">
        <autoDiscover isEnabled="true" identifier="[cache cluster role name]" />
        <!--<localCache isEnabled="true" sync="TimeoutBased" objectCount="100000" ttlValue="300" />-->
      </dataCacheClient>
    </dataCacheClients>
    <cacheDiagnostics>
      <crashDump dumpLevel="Off" dumpStorageQuotaInMB="100" />
    </cacheDiagnostics>

After the configuration is added, replace **[cache cluster role name]** with the name of the role that hosts the cache cluster.

>If **[cache cluster role name]** is not replaced with the name of the role that hosts the cache cluster, then a **TargetInvocationException** will be thrown when the cache is accessed with an inner **DatacacheException** with the message "No such role exists".

The NuGet package also adds a **ClientDiagnosticLevel** setting to the **ConfigurationSettings** of the cache client role in ServiceConfiguration.cscfg. The following example is the **WebRole1** section from a ServiceConfiguration.cscfg file with a **ClientDiagnosticLevel** of 1, which is the default **ClientDiagnosticLevel**.

    <Role name="WebRole1">
      <Instances count="1" />
      <ConfigurationSettings>
        <!-- Existing settings omitted for clarity. -->
        <Setting name="Microsoft.WindowsAzure.Plugins.Caching.ClientDiagnosticLevel" 
                 value="1" />
      </ConfigurationSettings>
    </Role>

>In-Role Cache provides both a cache server and a cache client diagnostic level. The diagnostic level is a single setting that configures the level of diagnostic information collected for caching. For more information, see [Troubleshooting and Diagnostics for In-Role Cache][]

The NuGet package also adds references to the following assemblies:

-   Microsoft.ApplicationServer.Caching.Client.dll
-   Microsoft.ApplicationServer.Caching.Core.dll
-   Microsoft.WindowsFabric.Common.dll
-   Microsoft.WindowsFabric.Data.Common.dll
-   Microsoft.ApplicationServer.Caching.AzureCommon.dll
-   Microsoft.ApplicationServer.Caching.AzureClientHelper.dll

If your role is an ASP.NET Web Role, the following assembly reference is also added:

-	Microsoft.Web.DistributedCache.dll.

>These assemblies are located in the C:\\Program Files\\Microsoft SDKs\\Windows Azure\\.NET SDK\\2012-10\\ref\\Caching\\ folder.

Once your client project is configured for caching, you can use the techniques described in the following sections for working with your cache.

<a name="working-with-caches"></a>
## Working with Caches

The steps in this section describe how to perform common tasks with caching.

-	[How To: Create a DataCache Object][]
-   [How To: Add and Retrieve an Object from the Cache][]
-   [How To: Specify the Expiration of an Object in the Cache][]
-   [How To: Store ASP.NET Session State in the Cache][]
-   [How To: Store ASP.NET Page Output Caching in the Cache][]

<a name="create-cache-object"></a>
## How To: Create a DataCache Object

In order to programatically work with a cache, you need a reference to the cache. Add the following to the top of any file from which you want to use
In-Role Cache:

    using Microsoft.ApplicationServer.Caching;

>If Visual Studio doesn't recognize the types in the using
statement even after installing the Caching NuGet package, which adds the necessary references, ensure that the target
profile for the project is .NET Framework 4.0 or higher, and be sure to select one of the profiles that does not specify **Client Profile**. For instructions on configuring cache clients, see [Configure the cache clients][].

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

By default items in the cache expire 10 minutes after they are placed in the cache. This can be configured in the **Time to Live (min)** setting in the role properties of the role that hosts the cache cluster.

![RoleCache6][RoleCache6]

There are three types of **Expiration Type**: **None**, **Absolute**, and **Sliding Window**. These configure how **Time to Live (min)** is used to determine expiration. The default **Expiration Type** is **Absolute**, which means that the countdown timer for an item's expiration begins when the item is placed into the cache. Once the specified amount of time has elapsed for an item, the item expires. If **Sliding Window** is specified, then the expiration countdown for an item is reset each time the item is accessed in the cache, and the item will not expire until the specified amount of time has elapsed since its last access. If **None** is specified, then **Time to Live (min)** must be set to **0**, and items will not expire, and will remain valid as long as they are in the cache.

If a longer or shorter timeout interval than what is configured in the role properties is desired, a specific duration can be specified when an item is added or updated in the cache by using the
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

The Session State Provider for In-Role Cache is an
out-of-process storage mechanism for ASP.NET applications. This provider
enables you to store your session state in an Azure cache rather
than in-memory or in a SQL Server database. To use the caching session
state provider, first configure your cache cluster, and then configure your ASP.NET application for caching using the Caching NuGet package as described in [Getting Started with In-Role Cache][]. When the Caching NuGet package is installed, it adds a commented out section in web.config that contains the required configuration for your ASP.NET application to use the Session State Provider for In-Role Cache.

    <!--Uncomment this section to use In-Role Cache for session state caching
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

>If your web.config does not contain this commented out section after installing the Caching NuGet package, ensure that the latest NuGet Package Manager is installed from [NuGet Package Manager Installation][], and then uninstall and reinstall the package.

To enable the Session State Provider for In-Role Cache, uncomment the specified section. The default cache is specified in the provided snippet. To use a different cache, specify the desired cache in the **cacheName** attribute.

For more information about using the Caching service session state
provider, see [Session State Provider for In-Role Cache][].

<a name="store-page"></a>
## How To: Store ASP.NET Page Output Caching in the Cache

The Output Cache Provider for In-Role Cache is an out-of-process storage mechanism for output cache data. This data is specifically for full HTTP
responses (page output caching). The provider plugs into the new output
cache provider extensibility point that was introduced in ASP.NET 4. To
use the output cache provider, first configure your cache cluster, and then configure your ASP.NET application for caching using the Caching NuGet package, as described in [Getting Started with In-Role Cache][]. When the Caching NuGet package is installed, it adds the following commented out section in web.config that contains the required configuration for your ASP.NET application to use the Output Cache Provider for In-Role Cache.

    <!--Uncomment this section to use In-Role Cache for output caching
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

>If your web.config does not contain this commented out section after installing the Caching NuGet package, ensure that the latest NuGet Package Manager is installed from [NuGet Package Manager Installation][], and then uninstall and reinstall the package.

To enable the Output Cache Provider for In-Role Cache, uncomment the specified section. The default cache is specified in the provided snippet. To use a different cache, specify the desired cache in the **cacheName** attribute.

Add an **OutputCache** directive to each page for which you wish to cache the output.

    <%@ OutputCache Duration="60" VaryByParam="*" %>

In this example the cached page data will remain in the cache for 60 seconds, and a different version of the page will be cached for each parameter combination. For more information on the available options, see [OutputCache Directive][].

For more information about using the Output Cache Provider for In-Role Cache, see [Output Cache Provider for In-Role Cache][].

<a name="next-steps"></a>
## Next Steps

Now that you've learned the basics of In-Role Cache,
follow these links to learn how to do more complex caching tasks.

-   See the MSDN Reference: [In-Role Cache][]
-   Learn how to migrate to In-Role Cache: [Migrate to In-Role Cache][]
-   Check out the samples: [In-Role Cache Samples][]
-	Watch the [Maximum Performance: Accelerate Your Cloud Services Applications with Azure Caching][] session from TechEd 2013 on In-Role Cache

<!-- INTRA-TOPIC LINKS -->
[Next Steps]: #next-steps
[What is In-Role Cache?]: #what-is
[Create an Azure Cache]: #create-cache
[Which type of caching is right for me?]: #choosing-cache
[Getting Started with the In-Role Cache Service]: #getting-started-cache-service
[Prepare Your Visual Studio Project to Use In-Role Cache]: #prepare-vs
[Configure Your Application to Use Caching]: #configure-app
[Getting Started with In-Role Cache]: #getting-started-cache-role-instance
[Configure the cache cluster]: #enable-caching
[Configure the desired cache size]: #cache-size
[Configure the cache clients]: #NuGet
[Working with Caches]: #working-with-caches
[How To: Create a DataCache Object]: #create-cache-object
[How To: Add and Retrieve an Object from the Cache]: #add-object
[How To: Specify the Expiration of an Object in the Cache]: #specify-expiration
[How To: Store ASP.NET Session State in the Cache]: #store-session
[How To: Store ASP.NET Page Output Caching in the Cache]: #store-page
[Target a Supported .NET Framework Profile]: #prepare-vs-target-net
 
<!-- IMAGES --> 
[RoleCache1]: ./media/cache-dotnet-how-to-use-in-role/cache8.png
[RoleCache2]: ./media/cache-dotnet-how-to-use-in-role/cache9.png
[RoleCache3]: ./media/cache-dotnet-how-to-use-in-role/cache10.png
[RoleCache4]: ./media/cache-dotnet-how-to-use-in-role/cache11.png
[RoleCache5]: ./media/cache-dotnet-how-to-use-in-role/cache12.png
[RoleCache6]: ./media/cache-dotnet-how-to-use-in-role/cache13.png
[RoleCache7]: ./media/cache-dotnet-how-to-use-in-role/cache14.png
[RoleCache8]: ./media/cache-dotnet-how-to-use-in-role/cache15.png
[RoleCache10]: ./media/cache-dotnet-how-to-use-in-role/cache17.png
  
<!-- LINKS -->
[How to Configure Virtual Machine Sizes]: http://go.microsoft.com/fwlink/?LinkId=164387
[How to: Configure a Cache Client Programmatically]: http://msdn.microsoft.com/library/windowsazure/gg618003.aspx
[How to: Set a Page's Cacheability Programmatically]: http://msdn.microsoft.com/library/z852zf6b.aspx
[How to: Set the Cacheability of an ASP.NET Page Declaratively]: http://msdn.microsoft.com/library/zd1ysf1y.aspx
[In-Role Cache Capacity Planning Considerations]: http://go.microsoft.com/fwlink/?LinkId=252651
[In-Role Cache Samples]: http://msdn.microsoft.com/library/jj189876.aspx
[In-Role Cache]: http://go.microsoft.com/fwlink/?LinkId=252658
[In-Role Cache]: http://www.microsoft.com/showcase/Search.aspx?phrase=azure+caching
[Maximum Performance: Accelerate Your Cloud Services Applications with Azure Caching]: http://channel9.msdn.com/Events/TechEd/NorthAmerica/2013/WAD-B326#fbid=kmrzkRxQ6gU
[Migrate to In-Role Cache]: http://msdn.microsoft.com/library/hh914163.aspx
[NuGet Package Manager Installation]: http://go.microsoft.com/fwlink/?LinkId=240311
[Output Cache Provider for In-Role Cache]: http://msdn.microsoft.com/library/windowsazure/gg185662.aspx
[OutputCache Directive]: http://go.microsoft.com/fwlink/?LinkId=251979
[Overview of In-Role Cache]: http://go.microsoft.com/fwlink/?LinkId=254172
[Session State Provider for In-Role Cache]: http://msdn.microsoft.com/library/windowsazure/gg185668.aspx
[Team Blog]: http://blogs.msdn.com/b/windowsazure/
[Troubleshooting and Diagnostics for In-Role Cache]: http://msdn.microsoft.com/library/windowsazure/hh914135.aspx
[Azure AppFabric Cache: Caching Session State]: http://www.microsoft.com/showcase/details.aspx?uuid=87c833e9-97a9-42b2-8bb1-7601f9b5ca20
[Azure Management Portal]: http://windows.azure.com/
[Azure Shared Caching]: http://msdn.microsoft.com/library/windowsazure/gg278356.aspx

[Which Azure Cache offering is right for me?]: http://msdn.microsoft.com/library/azure/dn766201.aspx
