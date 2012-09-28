<properties umbraconavihide="0" pagetitle="How to Use Windows Azure Caching from .NET" metakeywords="Windows Azure cache, Windows Azure caching, Azure cache, Azure caching, Azure store session state, Azure cache .NET, Azure cache C#" metadescription="Learn how to use Windows Azure caching: add and remove objects from the cache, store ASP.NET session state in the cache, and enable ASP.NET page output caching." linkid="Contact - Support" urldisplayname="Caching" headerexpose="" footerexpose="" disquscomments="1"></properties>

<div chunk="../chunks/article-left-menu.md" />

# How to Use Windows Azure Caching

This guide shows you how to get started using 
**Windows Azure Caching**. The samples are written in C\# code and
use the .NET API. The scenarios covered include **configuring a cache cluster**, **configuring cache clients**, **adding and removing
objects from the cache, storing ASP.NET session state in the cache**,
and **enabling ASP.NET page output caching using the cache**. For more
information on using Windows Azure Caching, refer to the [Next Steps][] section.

## Table of Contents

-   [What is Windows Azure Caching?][]
-	[Getting Started with Windows Azure Caching]
	-	[Configure the cache cluster][]
	-	[Configure the cache clients][]
-	[Working with caches][]
	-	[How To: Create a DataCache Object][]
	-   [How To: Add and Retrieve an Object from the Cache][]
	-   [How To: Specify the Expiration of an Object in the Cache][]
	-   [How To: Store ASP.NET Session State in the Cache][]
	-   [How To: Store ASP.NET Page Output Caching in the Cache][]
-   [Next Steps][]

<a name="what-is"></a><h2><span class="short-header">What is Windows Azure Caching?</span>What is Windows Azure Caching?</h2>

Windows Azure Caching provides a caching layer to your Windows Azure applications. Caching increases performance by temporarily storing information in-memory from
other backend sources, and can reduce the costs associated with database
transactions in the cloud. Windows Azure Caching includes the following
features:

-   Pre-built ASP.NET providers for session state and page output
    caching, enabling acceleration of web applications without having to
    modify application code.
-   Caches any serializable managed object - for example: CLR objects, rows, XML,
    binary data.
-   Consistent development model across both Windows Azure and Windows
    Server AppFabric.

Windows Azure Caching introduces a new way to perform caching by using a portion of the memory of the virtual machines that host the role instances in your Windows Azure cloud services (also known as hosted services). You have greater flexibility in terms of deployment options, the caches can be very large in size and have no cache specific quota restrictions.

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

This guide provides an overview of getting started with Windows Azure Caching. For more detailed information on these features that are beyond the scope of this getting started guide, see [Overview of Windows Azure Caching][].

>In addition to the new caching on role instances introduced in Windows Azure Caching, you can still create caches using Windows Azure Shared Caching. Windows Azure Shared Caching is the current multi-tenant cache offering that provides several caching tiers from 128MB to 4GB. In addition to memory and cost differences, each tier varies in other resource quotas such as bandwidth, transactions, and client connections, and these are configured using the [Windows Azure Management Portal][]. For more information on using Windows Azure Shared Caching, see [Windows Azure Shared Caching][].

<a name="getting-started-cache-role-instance"></a><h2><span class="short-header">Getting Started with Windows Azure Caching</span>Getting Started with Windows Azure Caching</h2>

Windows Azure Caching provides a way to enable caching using the memory that is on the virtual machines that host your role instances. The role instances that host your caches are known as a **cache cluster**. There are two deployment topologies for caching on role instances:

-	**Dedicated Role** caching - The role instances are used exclusively for caching.
-	**Co-located Role** caching - The cache shares the VM resources (bandwidth, CPU, and memory) with the application.

To use caching on role instances, you need to configure a cache cluster, and then configure the cache clients so they can access the cache cluster.

-	[Configure the cache cluster][]
-	[Configure the cache clients][]

<a name="enable-caching"></a><h2><span class="short-header">Configure the cache cluster</span>Configure the cache cluster</h2>

To configure a **Co-located Role** cache cluster, select the role in which you wish to host the cache cluster. Right-click the role properties in **Solution Explorer** and choose **Properties**.

![RoleCache1][]

Switch to the **Caching** tab, check the **Enable Caching** checkbox, and specify the desired caching options. When caching is enabled in a **Worker Role** or **ASP.NET Web Role**, the default configuration is **Co-located Role** caching with 30% of the memory of the role instances allocated for caching. A default cache is automatically configured, and additional named caches can be created if desired, and these caches will share the allocated memory.

![RoleCache2][]

To configure a **Dedicated Role** cache cluster, add a **Cache Worker Role** to your project.

![RoleCache7][]

When a **Cache Worker Role** is added to a project, the default configuration is **Dedicated Role** caching.

![RoleCache8][]

Once caching is enabled, the cache cluster can be configured.

The size of the cache is determined by a combination of the VM size of the role, the instance count of the role, and whether the cache cluster is configured as a dedicated role or co-located role cache cluster.

>This section provides a simplified overview on configuring the cache size. For more information on cache size and other capacity planning considerations, see [Windows Azure Caching Capacity Planning Considerations][].

To configure the virtual machine size and the number of role instances, right-click the role properties in **Solution Explorer** and choose **Properties**.

![RoleCache1][]

Switch to the **Configuration** tab. The default **Instance count** is 1, and the default **VM size** is **Small**.

![RoleCache3][]

The total memory for the VM sizes is as follows: 

-	**Small**: 1.75 GB
-	**Medium**: 3.5 GB
-	**Large**: 7 GB
-	**ExtraLarge**: 14 GB


> These memory sizes represent the total amount of memory available to the VM which is shared across the OS, cache process, cache data, and application. For more information on configuring Virtual Machine Sizes, see [How to Configure Virtual Machine Sizes][]. Note that cache is unsupported on **ExtraSmall** VM sizes.

When **Co-located Role** caching is specified, the cache size is determined by taking the specified percentage of the virtual machine memory. When **Dedicated Role** caching is specified, all of the available memory of the virtual machine is used for caching. If two role instances are configured, the combined memory of the virtual machines is used. This forms a cache cluster where the available caching memory is distributed across multiple role instances but presented to the clients of the cache as a single resource. Configuring additional role instances increases the cache size in the same manner. To determine the settings needed to provision a cache of the desired size, you can use the Capacity Planning Spreadsheet which is covered in [Windows Azure Caching Capacity Planning Considerations][].

Once the cache cluster is configured, you can configure the cache clients to allow access to the cache.

<a name="NuGet"></a><h2><span class="short-header">Configure the cache clients</span>Configure the cache clients</h2>

To access a Windows Azure Caching cache, the clients must be within the same deployment. If the cache cluster is a dedicated role cache cluster, then the clients are other roles in the deployment. If the cache cluster is a co-located role cache cluster, then the clients could be either  the other roles in the deployment, or the roles themselves that host the cache cluster. A NuGet package is provided that can be used to configure each client role that accesses the cache. To configure a role to access a cache cluster using the Caching NuGet package, right-click the role project in **Solution Explorer** and choose **Manage NuGet Packages**. 

![RoleCache4][]

Select **Windows Azure Caching**, click **Install**, and then click **I Accept**.

>If **Windows Azure Caching** does not appear in the list type **WindowsAzure.Caching** into the **Search Online** text box and select it from the results.

![RoleCache5][]

The NuGet package does several things: it adds the required configuration to the config file of the role, it adds a cache client diagnostic level setting to the ServiceConfiguration.cscfg file of the Windows Azure application, and it adds the required assembly references.

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

>Windows Azure Caching provides both a cache server and a cache client diagnostic level. The diagnostic level is a single setting that configures the level of diagnostic information collected for caching. For more information, see [Troubleshooting and Diagnostics for Windows Azure Caching][]

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

<a name="working-with-caches"></a><h2><span class="short-header">Working with Caches</span>Working with Caches</h2>

The steps in this section describe how to perform common tasks with caching.

-	[How To: Create a DataCache Object][]
-   [How To: Add and Retrieve an Object from the Cache][]
-   [How To: Specify the Expiration of an Object in the Cache][]
-   [How To: Store ASP.NET Session State in the Cache][]
-   [How To: Store ASP.NET Page Output Caching in the Cache][]

<a name="create-cache-object"></a><h2><span class="short-header">Create a DataCache Object</span>How To: Create a DataCache Object</h2>

In order to programatically work with a cache, you need a reference to the cache. Add the following to the top of any file from which you want to use
Windows Azure Caching:

    using Microsoft.ApplicationServer.Caching;

>If Visual Studio doesn't recognize the types in the using
statement even after adding the references, ensure that the target
profile for the project is .NET Framework 2.0 or higher, and be sure to select one of the profiles that do not specify **Client Profile**.

There are two ways to create a DataCache object. To use the first way, create a new **DataCacheFactory** object in your application using the default constructor. This causes the cache client to use the settings in the configuration file. Call either the **GetDefaultCache** method of the new **DataCacheFactory** instance which returns a **DataCache** object, or the **GetCache** method and pass in the name of your cache. These methods return a **DataCache** object that can then be used to programmatically access the cache.

    // Cache client configured by settings in application configuration file.
    DataCacheFactory cacheFactory = new DataCacheFactory();
    DataCache cache = cacheFactory.GetDefaultCache();
    // Or DataCache cache = cacheFactory.GetCache("MyCache");
    // cache can now be used to add and retrieve items.	

The second way uses an abbreviated syntax. Using this method, you do not need to create a **DataCacheFactory**, and you can instead **new** up an instance of a **DataCache** object that references the desired cache.

    DataCache cache = new DataCache("default");

<a name="add-object"></a><h2><span class="short-header">Add and Retrieve an Object from the Cache</span>How To: Add and Retrieve an Object from the Cache</h2>

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

<a name="specify-expiration"></a><h2><span class="short-header">Specify the Expiration of an Object in the Cache</span>How To: Specify the Expiration of an Object in the Cache</h2>

By default items in the cache expire 10 minutes after they are placed in the cache. This can be configured in the **Time to Live (min)** setting in the role properties of the role that hosts the cache cluster.

![RoleCache6][]

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

<a name="store-session"></a><h2><span class="short-header">Store ASP.NET Session State in the Cache</span>How To: Store ASP.NET Session State in the Cache</h2>

The Session State Provider for Windows Azure Caching is an
out-of-process storage mechanism for ASP.NET applications. This provider
enables you to store your session state in a Windows Azure cache rather
than in-memory or in a SQL Server database. To use the caching session
state provider, first configure your cache cluster, and then configure your ASP.NET application for caching as described in [Getting Started with Windows Azure Caching][]. Once these steps are completed, a **sessionState** section can be added to the web.config file. To configure your ASP.NET application to use the
Session State Provider for Windows Azure Caching, paste the following snippet into your web.config file. In this example, the default cache is specified. To use a different cache, specify the desired cache in the **cacheName** attribute.

    <!-- If session state needs to be saved in a Windows Azure cache, add the following to web.config inside system.web. -->
    <sessionState mode="Custom" customProvider="AppFabricCacheSessionStoreProvider">
      <providers>
        <add name="AppFabricCacheSessionStoreProvider"
              type="Microsoft.Web.DistributedCache.DistributedCacheSessionStateStoreProvider, Microsoft.Web.DistributedCache"
              cacheName="default"
              useBlobMode="true"
              dataCacheClientName="default" />
      </providers>
    </sessionState>

For more information about using the Caching service session state
provider, see [Session State Provider for Windows Azure Caching][].

<a name="store-page"></a><h2><span class="short-header">Store ASP.NET Page Output Caching in the Cache</span>How To: Store ASP.NET Page Output Caching in the Cache</h2>

The Output Cache Provider for Windows Azure Caching is an out-of-process storage mechanism for output cache data. This data is specifically for full HTTP
responses (page output caching). The provider plugs into the new output
cache provider extensibility point that was introduced in ASP.NET 4. To
use the output cache provider, first configure your cache cluster, and then configure your ASP.NET application for caching, as described in [Getting Started with Windows Azure Caching][]. Once these steps are completed, a **caching** section can be added to the web.config file. To configure your ASP.NET application to use the output cache provider, paste this snippet into your web.config file. In this example, the default cache is specified. To use a different cache, specify the desired cache in the **cacheName** attribute.

    <!-- If output cache content needs to be saved in a Windows Azure
         cache, add the following to web.config inside system.web. -->
    <caching>
      <outputCache defaultProvider="DistributedCache">
        <providers>
          <add name="DistributedCache"
                type="Microsoft.Web.DistributedCache.DistributedCacheOutputCacheProvider, Microsoft.Web.DistributedCache"
                cacheName="default"
                dataCacheClientName="default" />
        </providers>
      </outputCache>
    </caching>

Add an **OutputCache** directive to each page for which you wish to cache the output.

    <%@ OutputCache Duration="60" VaryByParam="*" %>

In this example the cached page data will remain in the cache for 60 seconds, and a different version of the page will be cached for each parameter combination. For more information on the available options, see [OutputCache Directive][].

For more information about using the Output Cache Provider for Windows Azure Caching, see [Output Cache Provider for Windows Azure Caching][].

<a name="next-steps"></a><h2><span class="short-header">Next Steps</span>Next Steps</h2>

Now that you've learned the basics of Windows Azure Caching,
follow these links to learn how to do more complex caching tasks.

-   See the MSDN Reference:
	-	[Windows Azure Caching][]
-   Visit the [Team Blog][]
-   Watch training videos on [Windows Azure Caching][].

  [Next Steps]: #next-steps
  [What is Windows Azure Caching?]: #what-is
  [Create a Windows Azure Cache]: #create-cache
  [Which type of caching is right for me?]: #choosing-cache
  [Getting Started with the Windows Azure Caching Service]: #getting-started-cache-service
  [Prepare Your Visual Studio Project to Use Windows Azure Caching]: #prepare-vs
  [Configure Your Application to Use Caching]: #configure-app
  [Getting Started with Windows Azure Caching]: #getting-started-cache-role-instance
  [Configure the cache cluster]: #enable-caching
  [Configure the desired cache size]: #cache-size
  [Configure the cache clients]: #NuGet
  [Working with Caches]: #working-with-caches
  [How To: Create a DataCache Object]: #create-cache-object
  [How To: Add and Retrieve an Object from the Cache]: #add-object
  [How To: Specify the Expiration of an Object in the Cache]: #specify-expiration
  [How To: Store ASP.NET Session State in the Cache]: #store-session
  [How To: Store ASP.NET Page Output Caching in the Cache]: #store-page
  [Windows Azure Management Portal]: http://windows.azure.com/
  [Cache1]: ../../../DevCenter/dotNet/Media/cache1.png
  [Cache2]: ../../../DevCenter/dotNet/Media/cache2.png
  [Cache3]: ../../../DevCenter/dotNet/Media/cache3.png
  [Cache4]: ../../../DevCenter/dotNet/Media/cache4.png
  [Cache5]: ../../../DevCenter/dotNet/Media/cache5.png
  [RoleCache1]: ../../../DevCenter/dotNet/Media/cache8.png
  [RoleCache2]: ../../../DevCenter/dotNet/Media/cache9.png
  [RoleCache3]: ../../../DevCenter/dotNet/Media/cache10.png
  [RoleCache4]: ../../../DevCenter/dotNet/Media/cache11.png
  [RoleCache5]: ../../../DevCenter/dotNet/Media/cache12.png
  [RoleCache6]: ../../../DevCenter/dotNet/Media/cache13.png
  [RoleCache7]: ../../../DevCenter/dotNet/Media/cache14.png
  [RoleCache8]: ../../../DevCenter/dotNet/Media/cache15.png
  [RoleCache9]: ../../../DevCenter/dotNet/Media/cache16.png
  [Target a Supported .NET Framework Profile]: #prepare-vs-target-net
  [How to: Configure a Cache Client Programmatically]: http://msdn.microsoft.com/en-us/library/windowsazure/gg618003.aspx
  [Cache6]: ../../../DevCenter/dotNet/Media/cache6.png
  [Cache7]: ../../../DevCenter/dotNet/Media/cache7.png
  [Session State Provider for Windows Azure Caching]: http://msdn.microsoft.com/en-us/library/windowsazure/gg185668.aspx
  [Windows Azure AppFabric Cache: Caching Session State]: http://www.microsoft.com/en-us/showcase/details.aspx?uuid=87c833e9-97a9-42b2-8bb1-7601f9b5ca20
  [Output Cache Provider for Windows Azure Caching]: http://msdn.microsoft.com/en-us/library/windowsazure/gg185662.aspx
  [Windows Azure Shared Caching]: http://msdn.microsoft.com/en-us/library/windowsazure/gg278356.aspx
  [Team Blog]: http://blogs.msdn.com/b/windowsazure/
  [Windows Azure Caching]: http://www.microsoft.com/en-us/showcase/Search.aspx?phrase=azure+caching
  [How to Configure Virtual Machine Sizes]: http://go.microsoft.com/fwlink/?LinkId=164387
  [Windows Azure Caching Capacity Planning Considerations]: http://go.microsoft.com/fwlink/?LinkId=252651
  [Windows Azure Caching]: http://go.microsoft.com/fwlink/?LinkId=252658
  [How to: Set the Cacheability of an ASP.NET Page Declaratively]: http://msdn.microsoft.com/en-us/library/zd1ysf1y.aspx
  [How to: Set a Page's Cacheability Programmatically]: http://msdn.microsoft.com/en-us/library/z852zf6b.aspx
  [Overview of Windows Azure Caching]: http://go.microsoft.com/fwlink/?LinkId=254172
  [OutputCache Directive]: http://go.microsoft.com/fwlink/?LinkId=251979
  [Troubleshooting and Diagnostics for Windows Azure Caching]: http://msdn.microsoft.com/en-us/library/windowsazure/hh914135.aspx