<properties umbraconavihide="0" pagetitle="How to Use Windows Azure Caching from .NET" metakeywords="Windows Azure cache, Windows Azure caching, Azure cache, Azure caching, Azure store session state, Azure cache .NET, Azure cache C#" metadescription="Learn how to use the Windows Azure caching service: add and remove objects from the cache, store ASP.NET session state in the cache, and enable ASP.NET page output caching." linkid="Contact - Support" urldisplayname="Caching" headerexpose footerexpose disquscomments="1"></properties>

# How to Use Windows Azure Caching

This guide will show you how to perform common scenarios using the
**Windows Azure Caching service** and **Windows Azure Dedicated Cache (Preview)**. The samples are written in C\# code and
use the .NET API. The scenarios covered include **adding and removing
objects from the cache, storing ASP.NET session state in the cache**,
and **enabling ASP.NET page output caching using the cache**. For more
information on using the Windows Azure Caching service and Windows Azure Caching on role instances, refer to the [Next Steps][] section.

## Table of Contents

-   [What is Windows Azure Caching?][]
	-	[Which type of caching is right for me?][]
-	[Getting Started with the Windows Azure Caching Service][]
	-   [Create a Windows Azure Cache][]
	-   [Prepare Your Visual Studio Project to Use Windows Azure Caching][]
	-   [Configure Your Application to Use Caching][]
-	[Getting Started with Windows Azure Dedicated Cache (Preview)]
	-	[Configure the cache cluster][]
	-	[Configure the desired cache size][]
	-	[Configure the cache clients][]
-	[Working with caches][]
	-	[How To: Create a DataCache Object][]
	-   [How To: Add and Retrieve an Object from the Cache][]
	-   [How To: Specify the Expiration of an Object in the Cache][]
	-   [How To: Store ASP.NET Session State in the Cache][]
	-   [How To: Store ASP.NET Page Output Caching in the Cache][]
-   [Next Steps][]

## <a name="what-is"> </a>What is Windows Azure Caching?

Windows Azure Caching comes in two flavors: the **Windows Azure Caching service**, and **Windows Azure Dedicated Caching (Preview)**. The Windows Azure Caching service is a Windows Azure service that provides caching services. Windows Azure Dedicated Caching (Preview) provides caching on role instances by using a portion of the memory from the virtual machines that host your role instances. The differences between the two are described in the next section, [Which type of caching is right for me?][], but both of these cache offerings provide a distributed, in-memory, application cache for Windows Azure and SQL Azure applications.
Caching increases performance by temporarily storing information from
other backend sources, and can reduce the costs associated with database
transactions in the cloud. Windows Azure Caching includes the following
features:

-   Pre-built ASP.NET providers for session state and page output
    caching, enabling acceleration of web applications without having to
    modify application code.
-   Caches any managed object - for example: CLR objects, rows, XML,
    binary data.
-   Consistent development model across both Windows Azure and Windows
    Server AppFabric.
-   Secured access and authorization provided by the Access Control
    Service (ACS).

## <a name="choosing-cache"> </a>Which type of caching is right for me?

The Windows Azure Caching service has the following features:

-	Simple configuration and management using the [Windows Azure Management Portal][].
-	Multi-tenant service
-	Cache sizes from 128 MB through 4 GB
-	Ideal for small caches with simple use cases
-	The caching service is accessible to applications both within the current deployment and external to the deployment
-	To get started, see [Getting Started with the Windows Azure Caching Service][]

Windows Azure Dedicated Cache (Preview) has the following features:

-	No usage quotas
-	Higher performance
-	More control and isolation
-	Lower cost; Uses the memory and processing of your role instances
-	Ideal for very large cache sizes
-	The cache is accessible to clients in the same deployment
-	To get started, see [Getting Started with Windows Azure Dedicated Cache (Preview)][]


# <a name="getting-started-cache-service"> </a>Getting Started with the Windows Azure Caching Service

Getting started with the Caching service is easy. It has a simple
provisioning model, and there is no complex infrastructure to install or
manage. To get started you create a cache, configure your application to access it, and then you can begin using it.

-   [Create a Windows Azure Cache][]
-   [Prepare Your Visual Studio Project to Use Windows Azure Caching][]
-   [Configure Your Application to Use Caching][]

## <a name="create-cache"> </a>Create a Windows Azure Cache

To use the Windows Azure Caching service, you need a cache. You can
create a cache in the Windows Azure Platform Management Portal as shown
below:

1.  Log into the [Windows Azure Management Portal][].   
    ![Cache1][]

2.  In the lower left navigation pane of the Management Portal, click
    **Service Bus, Access Control & Caching**.   
    ![Cache2][]

3.  In the upper left navigation pane of the Management Portal, click
    **Cache**, and the click **New**.   
    ![Cache3][]

4.  In **Create a new Service Namespace**, enter a namespace, and then
    to make sure that it is unique, click **Check Availability**.   
    ![Cache4][]

5.  If it is available, choose the country or region in which your
    storage account is (or will be) located, the subscription for the
    storage account, the cache size, and then click **Create
    Namespace**.

    The namespace appears in the Management Portal and takes a moment to
    activate. Wait until the status is **Active** before moving on.

6.  Select the newly created namespace, and take note of the
    **Properties** in the right hand column. You will need these in
    subsequent steps to access the cache: Service URL, Service Port, and
    Authentication Token.   
    ![Cache5][]

## <a name="prepare-vs"> </a>Prepare Your Visual Studio Project to Use Windows Azure Caching

Before you can perform operations with Windows Azure Caching, you need
to target one of the supported .NET Framework Profiles, add a reference
to the Caching assemblies, and include the corresponding namespaces.

### <a name="prepare-vs-target-net"> </a>Target a Supported .NET Framework Profile

1.  In Solution Explorer, right-click the desired project name, and then
    click **Properties**.

2.  Select the **Application** tab of the **Project Properties** dialog.

3.  Verify that the target framework version is .NET Framework 2.0 or
    higher (non-client profile).  
    **Note**: Be sure to select one of the profiles that do not specify
    **Client Profile**.

### Add a Reference to the Caching Assemblies

<ol>
<li>
In Solution Explorer, right-click the desired project name, and then
click **Add Reference**.

</li>
<li>
In the Add Reference dialog, select the **Browse** tab.

</li>
<li>
Navigate to C:\Program Files\Microsoft SDKs\Windows Azure\.NET SDK\2012-06\ref\ and
select the following assemblies:

</li>
-   Microsoft.ApplicationServer.Caching.Client.dll
-   Microsoft.ApplicationServer.Caching.Core.dll
-   Microsoft.WindowsFabric.Common.dll
-   Microsoft.WindowsFabric.Data.Common.dll

<li>
For ASP.NET projects, also add a reference to the
Microsoft.Web.DistributedCache.dll.

</li>
<li>
Click **OK**.

</li>
</ol>
### Import the Caching Namespaces

Add the following to the top of any file from which you want to use
Windows Azure Caching:

    using Microsoft.ApplicationServer.Caching;

**Note**: If Visual Studio doesn't recognize the types in the using
statement even after adding the references, ensure that the target
profile for the project is set to one of the profiles that does not have
Client Profile in the name. For more information, see [Target a
Supported .NET Framework Profile][].

## <a name="configure-app"> </a>Configure Your Application to Use Caching

You can configure your application to use caching in code, or by using
configuration files. The guide covers using configuration files. For
information on configuring your application to use caching in code, see
[How to: Configure a Cache Client Programmatically][].

1.  In the Management Portal, select the desired cache, and then click
    **View Client Configuration**:   
    ![Cache6][]

    This brings up the Client Configuration window, which contains
    sections of XML snippets to copy into the appropriate sections in
    the configuration file of your application.   
    ![Cache7][]

2.  Copy the **dataCacheClients** section into the **configSections** of
    your configuration file. If your configuration file does not have a
    **configSections**, then add one.

        <configSections>
          <!-- Append below entry to configSections. Do not overwrite the full section.-->
          <section name="dataCacheClients" 
                   type="Microsoft.ApplicationServer.Caching.DataCacheClientsSection,
         Microsoft.ApplicationServer.Caching.Core"
                   allowLocation="true" 
                   allowDefinition="Everywhere"/>
        </configSections>

3.  Copy either the default or the ssl **dataCacheClient** section,
    depending on your security needs. In this example the default
    section is copied.

        <!-- Cache exposes two endpoints: one simple and other SSL endpoint. Choose the appropriate endpoint depending on your security needs. -->
        <dataCacheClients>
          <dataCacheClient name="default">
            <hosts>
              <host name="MyCacheNamespace.cache.windows.net" cachePort="22233" />
            </hosts>
    
            <securityProperties mode="Message">
              <messageSecurity 
                authorizationInfo="Your authorization token will be here.">
              </messageSecurity>
            </securityProperties>
          </dataCacheClient>
        </dataCacheClients>

    **Important:**If you are not developing an ASP.NET project, do not
    paste in the **sessionState** and **outputCache** elements into your
    configuration file. These sections will be covered in [How to Store
    ASP.NET Session State in the Cache][How To: Store ASP.NET Session
    State in the Cache] and [How to Store ASP.NET Page Output Caching in
    the Cache][How To: Store ASP.NET Page Output Caching in the Cache].

4.  In your application, create a new **DataCacheFactory** object using
    the default constructor. This causes the cache client to use the
    settings in the configuration file. Call the **GetDefaultCache**
    method of the new **DataCacheFactory** instance which returns a
    **DataCache** object that can then be used to programmatically access
    the cache.

        // Cache client configured by settings in application configuration file.
        DataCacheFactory cacheFactory = new DataCacheFactory();
        DataCache cache = cacheFactory.GetDefaultCache();
        // cache can now be used to add and retrieve items.	

# <a name="getting-started-cache-role-instance"> </a>Getting Started with Windows Azure Dedicated Cache (Preview)

Windows Azure Dedicated Cache (Preview) provides a way to enable caching using the memory that is on the virtual machines that host your role instances. The role instances that host your caches are known as a **cache cluster**. There are two deployment topologies for caching on role instances:

-	**Dedicated Role** caching - The role instances are used exclusively for caching
-	**Co-located Role** caching - A portion of the memory of the role instances is allocated for caching 

To use caching on role instances, you need to configure a cache cluster, configure the cache size, and then configure the cache clients so they can access the cache cluster.

-	[Configure the cache cluster][]
-	[Configure the desired cache size][]
-	[Configure the cache clients][]

## <a name="enable-caching"> </a>Configure the cache cluster

To configure a cache cluster, select the role in which you wish to host the cache cluster. Right-click the role properties in **Solution Explorer** and choose **Properties**.

![RoleCache1][]

Switch to the **Caching** tab, check the **Enable Caching (Preview)** checkbox, and specify the desired caching options. There are two deployment topologies for the cache cluster: **Dedicated Role** and **Co-located Role**. When **Dedicated Role** is selected, the role instances are used exclusively for caching. When **Co-located Role** is selected, the specified portion of the memory of the role instances is used for caching. If your cache cluster is hosted in a **Worker Role** or **ASP.NET Web Role**, the default configuration is **Co-located Role** caching with 30% of the memory of the role instances allocated for caching. If your cache cluster is hosted in a **Cache Worker Role**, the default configuration is **Dedicated Role** caching. A default cache is automatically configured, and additional named caches can be created if desired, and these caches will share the allocated memory.

![RoleCache2][]

Once caching is enabled, the cache size can be configured.

## <a name="cache-size"> </a> Configure the desired cache size

The size of the cache is determined by a combination of the VM size of the role, the instance count of the role, and whether the cache cluster is configured as a dedicated role or co-located role cache cluster.

>This section provides a simplified overview on configuring the cache size. For more information on cache size and other capacity planning considerations, see [Windows Azure Dedicated Cache (Preview) Capacity Planning Considerations][].

To configure the virtual machine size and the number of role instances, right-click the role properties in **Solution Explorer** and choose **Properties**.

![RoleCache1][]

Switch to the **Configuration** tab. The default **Instance count** is 1, and the default **VM size** is **Small**.

![RoleCache3][]

The memory for the VM sizes is as follows: 

-	**ExtraSmall**: 768 MB
-	**Small**: 1.75 GB
-	**Medium**: 3.5 GB
-	**Large**: 7 GB
-	**ExtraLarge**: 14 GB


>For more information on configuring Virtual Machine Sizes, see [How to Configure Virtual Machine Sizes][].

When **Co-located Role** caching is specified, the cache size is determined by taking the specified percentage of the virtual machine memory and multiplying this by the number of role instances. If all of the defaults are chosen (30% role memory allocated to caching, Small VM Size (1.75 GB memory), and one role instance), then the cache size would be approximately .5 GB. If two role instances are configured, the combined memory available for caching would be 1 GB. This forms a cache cluster where the available caching memory is distributed across multiple role instances but presented to the clients of the cache as a single resource. Configuring additional role instances increases the cache size in the same manner.

If **Dedicated Role** caching is specified, then the amount of memory listed  below is available for the cache on each instance of the role hosted on the specified virtual machine size.

-	**ExtraSmall**: 0.27 GB
-	**Small**: 1.12 GB
-	**Medium**: 2.54 GB
-	**Large**: 5.45 GB
-	**ExtraLarge**: 11.22 GB

>Note that these memory sizes are approximate and may vary based on the memory needed by the operating system and caching overhead. For more details on configuring cache size when using dedicated role caching, see [Windows Azure Dedicated Cache (Preview) Capacity Planning Considerations][].

To determine the size of the cache, multiply the amount of memory available based on the VM size by the amount of role instances.

>**Backup Copies** is a feature that provides high availability for the cache. If one of the role instances goes offline, the objects in the cache will still be available in the backup copy. If **Backup Copies** are specified, the total memory available required for eached cached item is doubled. this should be taken into consideration when estimating the memory requirements for the cache. For more information, see [Windows Azure Dedicated Cache (Preview) Capacity Planning Considerations][].

Once the cache cluster is configured, you can configure the cache clients to allow access to the cache.

## <a name="NuGet"> </a>Configure the cache clients

To access a Windows Azure Dedicated Cache (Preview) cache, the clients must be within the same deployment. If the cache cluster is a dedicated role cache cluster, then the clients are other roles in the deployment. If the cache cluster is a co-located role cache cluster, then the clients could be either  the other roles in the deployment, or the roles themselves that host the cache cluster. A NuGet package is provided that can be used to configure each client role that accesses the cache. To configure a role to access a cache cluster using the Caching NuGet package, right-click the role project in Solution Explorer and choose Manage NuGet Packages. 

![RoleCache4][]

Select **Windows Azure Distributed Cache**, click **Install**, and then click **I Accept**.

>If **Windows Azure Distributed Cache** does not appear in the list type Windows Azure Distributed Cache into the **Search Online** text box and select it from the results.

![RoleCache5][]

The NuGet package does two things: it adds the required configuration to the config file of the role, and it adds the required assembly references.

The NuGet package adds the following two configuration elements into your role's web.config or app.config. The first element is added under the **configSections** element. If there is no **configSections** element present, one is created as a child of the **configuration** element.

    <configSections>
      <section name="dataCacheClients"   type="Microsoft.ApplicationServer.Caching.DataCacheClientsSection,    Microsoft.ApplicationServer.Caching.Core"
                allowLocation="true" allowDefinition="Everywhere"/>
    </configSections>

This adds a reference to **dataCacheClients** element. This **dataCacheClients** element is then added to the **configuration** element.

    <dataCacheClients>
      <tracing sinkType="DiagnosticSink" traceLevel="Verbose" />
      <dataCacheClient name="default">
        <autoDiscover isEnabled="true" identifier="[cache cluster role name]" />
        <!--<localCache isEnabled="true" sync="TimeoutBased" objectCount="100000" ttlValue="300" />-->
      </dataCacheClient>
    </dataCacheClients>

Replace **[cache cluster role name]** with the name of the role that hosts the cache cluster.

The NuGet package also adds references to the following assemblies:

-   Microsoft.ApplicationServer.Caching.Client.dll
-   Microsoft.ApplicationServer.Caching.Core.dll
-   Microsoft.WindowsFabric.Common.dll
-   Microsoft.WindowsFabric.Data.Common.dll

If your role is an ASP.NET Web Role, the following assembly reference is also added:

-	Microsoft.Web.DistributedCache.dll.

>These assemblies are located in the C:\Program Files\Microsoft SDKs\Windows Azure\.NET SDK\2012-06\ref\ folder.

Once your client project is configured for caching, you can use the techniques described in the following sections for working with your cache.

>To configure your clients to access the cache cluster without using the NuGet caching package, manually update the configuration and add the assembly references described in this previous section.

# <a name="working-with-caches"> </a>Working with Caches

The steps in this section describe how to perform common tasks with caching. These steps are applicable for both the Windows Azure Caching service and Caching on role instances.

-	[How To: Create a DataCache Object][]
-   [How To: Add and Retrieve an Object from the Cache][]
-   [How To: Specify the Expiration of an Object in the Cache][]
-   [How To: Store ASP.NET Session State in the Cache][]
-   [How To: Store ASP.NET Page Output Caching in the Cache][]

## <a name="create-cache-object"> </a>How To: Create a DataCache Object

In order to programatically work with a cache, you need a reference to the cache. Add the following to the top of any file from which you want to use
Windows Azure Caching:

    using Microsoft.ApplicationServer.Caching;

**Note**: If Visual Studio doesn't recognize the types in the using
statement even after adding the references, ensure that the target
profile for the project is set to one of the profiles that does not have
Client Profile in the name. For more information, see [Target a
Supported .NET Framework Profile][].

There are two ways to create a DataCache object. The first way works for both accessing a Windows Azure Caching service cache and a Dedicated Cache (Preview) cache. In your application, create a new **DataCacheFactory** object using the default constructor. This causes the cache client to use the settings in the configuration file. Call the **GetDefaultCache** method of the new **DataCacheFactory** instance which returns a **DataCache** object that can then be used to programmatically access the cache.

    // Cache client configured by settings in application configuration file.
    DataCacheFactory cacheFactory = new DataCacheFactory();
    DataCache cache = cacheFactory.GetDefaultCache();
    // cache can now be used to add and retrieve items.	

The second way uses an abbreviated syntax and is supported only for Caching on role instances. Using this method, you do not need to create a DataCacheFactory, and you can instead new up an instance of a Cache object that references the desired cache.

    DataCache cache = new DataCache("default");

## <a name="add-object"> </a>How To: Add and Retrieve an Object from the Cache

To add an item to the cache, the **Add** method or the **Put** method
can be used. The **Add** method adds the specified object to the cache,
keyed by the value of the key parameter.

    // Add the string "value" to the cache, keyed by "item"
    cache.Add("item", "value");

If an object with the same key is already in the cache, a
**DataCacheException**will be thrown with the following message:

> ErrorCode:SubStatus: An attempt is being made to create an object with
> a Key that already exists in the cache. Caching will only accept
> unique Key values for objects.

To check to see if an object with a specific key is already in the
cache, the **Get** method can be used. If the object exists, it is
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

## <a name="specify-expiration"> </a>How To: Specify the Expiration of an Object in the Cache

By default items in a Windows Azure Caching service cache expire after 48 hours, and for a Dedicated Cache (Preview) cache they expire after 10 minutes. If a longer or
shorter timeout interval is desired, a specific duration can be
specified when an item is added or updated in the cache by using the
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

## <a name="store-session"> </a>How To: Store ASP.NET Session State in the Cache

The Session State Provider for Windows Azure Caching is an
out-of-process storage mechanism for ASP.NET applications. This provider
enables you to store your session state in a Windows Azure cache rather
than in-memory or in a SQL Server database. To use the caching session
state provider, first ensure that your ASP.NET application is configured to access the desired cache, as described in either [Getting Started with the Windows Azure Caching Service][] or [Getting Started with Windows Azure Dedicated Cache (Preview)][]. Once these steps are completed, a **sessionState** section can be added
to the web.config file. To configure your ASP.NET application to use the
Session State Provider for Windows Azure Caching, paste the following snippet into your web.config file. In this snippet, the default cache is specified. To use a different cache, specify the desired the cache in the **cacheName** attribute.

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

>If you are using the Windows Azure Caching service, the client configuration snippets from the
Management Portal contain a preconfigured **sessionState** section
snippet that can be pasted into the web.config file. This snippet is
configured to use the non-SSL endpoint. If the **SslEndpoint** is
desired, replace the **dataCacheClientName** of default in the snippet to
**SslEndpoint**. For more information, see [Configure Your Application to Use Caching][].

For more information about using the Caching service session state
provider, see [Session State Provider for Windows Azure Caching][]. For a demo of an
ASP.NET application that uses the Caching session state provider, see
[Windows Azure AppFabric Cache: Caching Session State][].

## <a name="store-page"> </a>How To: Store ASP.NET Page Output Caching in the Cache

The Output Cache Provider for Windows Azure Caching is an out-of-process storage mechanism for output cache data. This data is specifically for full HTTP
responses (page output caching). The provider plugs into the new output
cache provider extensibility point that was introduced in ASP.NET 4. To
use the output cache provider, first ensure that your ASP.NET application is configured to access the desired cache, as described in either [Getting Started with the Windows Azure Caching Service][] or [Getting Started with Windows Azure Dedicated Cache (Preview)][]. Once these steps are completed, a **caching** section can be added to the web.config file. To configure your ASP.NET application to use the output cache provider, paste this snippet into your web.config file. In this snippet, the default cache is specified. To use a different cache, specify the desired the cache in the **cacheName** attribute.

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

>If you are using the Windows Azure Caching service, the client configuration snippets from the
Management Portal contain a preconfigured **caching** section
snippet that can be pasted into the web.config file. This snippet is
configured to use the non-SSL endpoint. If the **SslEndpoint** is
desired, replace the **dataCacheClientName** of default in the snippet to
**SslEndpoint**. For more information, see [Configure Your Application to Use Caching][].

For more information about using the Output Cache Provider for Windows Azure Caching, see [Output Cache Provider for Windows Azure Caching][].

## <a name="next-steps"> </a>Next Steps

Now that you've learned the basics of Windows Azure Caching,
follow these links to learn how to do more complex caching tasks.

-   See the MSDN Reference:
	-	[Windows Azure Caching Service][]
	-	[Windows Azure Dedicated Cache (Preview)][]
-   Visit the [Team Blog][]
-   Watch training videos on [Windows Azure Caching][].

  [Next Steps]: #next-steps
  [What is Windows Azure Caching?]: #what-is
  [Create a Windows Azure Cache]: #create-cache
  [Which type of caching is right for me?]: #choosing-cache
  [Getting Started with the Windows Azure Caching Service]: #getting-started-cache-service
  [Prepare Your Visual Studio Project to Use Windows Azure Caching]: #prepare-vs
  [Configure Your Application to Use Caching]: #configure-app
  [Getting Started with Windows Azure Dedicated Cache (Preview)]: #getting-started-cache-role-instance
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
  [Target a Supported .NET Framework Profile]: #prepare-vs-target-net
  [How to: Configure a Cache Client Programmatically]: http://msdn.microsoft.com/en-us/library/windowsazure/gg618003.aspx
  [Cache6]: ../../../DevCenter/dotNet/Media/cache6.png
  [Cache7]: ../../../DevCenter/dotNet/Media/cache7.png
  [Session State Provider for Windows Azure Caching]: http://msdn.microsoft.com/en-us/library/windowsazure/gg185668.aspx
  [Windows Azure AppFabric Cache: Caching Session State]: http://www.microsoft.com/en-us/showcase/details.aspx?uuid=87c833e9-97a9-42b2-8bb1-7601f9b5ca20
  [Output Cache Provider for Windows Azure Caching]: http://msdn.microsoft.com/en-us/library/windowsazure/gg185662.aspx
  [Windows Azure Caching Service]: http://msdn.microsoft.com/en-us/library/windowsazure/gg278356.aspx
  [Team Blog]: http://blogs.msdn.com/b/windowsazure/
  [Windows Azure Caching]: http://www.microsoft.com/en-us/showcase/Search.aspx?phrase=azure+caching
  [How to Configure Virtual Machine Sizes]: http://go.microsoft.com/fwlink/?LinkId=164387
  [Windows Azure Dedicated Cache (Preview) Capacity Planning Considerations]: http://go.microsoft.com/fwlink/?LinkId=252651
  [Windows Azure Dedicated Cache (Preview)]: http://go.microsoft.com/fwlink/?LinkId=252658
