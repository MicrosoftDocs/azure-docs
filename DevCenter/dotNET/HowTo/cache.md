<properties umbraconavihide="0" pagetitle="How to Use the Caching Service from .NET" metakeywords="Windows Azure cache, Windows Azure caching, Azure cache, Azure caching, Azure store session state, Azure cache .NET, Azure cache C#" metadescription="Learn how to use the Windows Azure caching service: add and remove objects from the cache, store ASP.NET session state in the cache, and enable ASP.NET page output caching." linkid="Contact - Support" urldisplayname="Caching" headerexpose footerexpose disquscomments="1"></properties>

# How to Use the Caching Service

This guide will show you how to perform common scenarios using the
Windows Azure Caching service. The samples are written in C\# code and
use the .NET API. The scenarios covered include **adding and removing
objects from the cache, storing ASP.NET session state in the cache**,
and **enabling ASP.NET page output caching using the cache**. For more
information on using the Windows Azure Caching service, refer to the
[Next Steps][] section.

## Table of Contents

-   [What is the Caching Service?][]
-   [Create a Windows Azure Cache][]
-   [Prepare Your Visual Studio Project to Use Windows Azure Caching][]
-   [Configure Your Application to Use Caching][]
-   [How To: Add and Retrieve an Object from the Cache][]
-   [How To: Specify the Expiration of an Object in the Cache][]
-   [How To: Store ASP.NET Session State in the Cache][]
-   [How To: Store ASP.NET Page Output Caching in the Cache][]
-   [Next Steps][]

## <a name="what-is"> </a>What is the Caching Service?

The Windows Azure Caching service provides a distributed, in-memory,
application cache service for Windows Azure and SQL Azure applications.
Caching increases performance by temporarily storing information from
other backend sources, and can reduce the costs associated with database
transactions in the cloud. The Caching service includes the following
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

Getting started with the Caching service is easy. It has a simple
provisioning model, and there is no complex infrastructure to install or
manage.

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
Navigate to C:\\Program Files\\Windows Azure SDK\\v1.6\\Cache\\ref\\ and
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
    **DataCache**object that can then be used to programmatically access
    the cache.

        // Cache client configured by settings in application configuration file.
        DataCacheFactory cacheFactory = new DataCacheFactory();
        DataCache cache = cacheFactory.GetDefaultCache();
        // cache can now be used to add and retrieve items.	

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

By default items in the cache expire after 48 hours. If a longer or
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

The Windows Azure Caching service session state provider is an
out-of-process storage mechanism for ASP.NET applications. This provider
enables you to store your session state in a Windows Azure cache rather
than in-memory or in a SQL Server database. To use the Caching session
state provider, first ensure that the steps described in the previous
[Prepare Your Visual Studio Project to Use Windows Azure Caching][] and
[Configure Your Application to Use Caching][] sections are completed.
Once these steps are completed, a **sessionState** section can be added
to the web.config file. The client configuration snippets from the
Management Portal contain a preconfigured **sessionState** section
snippet that can be pasted into the web.config file. This snippet is
configured to use the non-SSL endpoint. If the **SslEndpoint** is
desired, replace the **cacheName** of default in the snippet to
**SslEndpoint**. To configure your ASP.NET application to use the
Caching service session state provider, paste this snippet into your
web.config file.

    <!-- If session state needs to be saved in AppFabric Caching service, add the following to web.config inside system.web. If SSL is required, then change dataCacheClientName to "SslEndpoint". -->
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
provider, see [Session State Provider (AppFabric)][]. For a demo of an
ASP.NET application that uses the Caching session state provider, see
[Windows Azure AppFabric Cache: Caching Session State][].

## <a name="store-page"> </a>How To: Store ASP.NET Page Output Caching in the Cache

The Windows Azure output cache provider is an out-of-process storage
mechanism for output cache data. This data is specifically for full HTTP
responses (page output caching). The provider plugs into the new output
cache provider extensibility point that was introduced in ASP.NET 4. To
use the output cache provider, first ensure that the steps described in
the previous [Prepare Your Visual Studio Project to Use Windows Azure
Caching][] and [Configure Your Application to Use Caching][] sections
are completed. Once these steps are completed, a **caching** section can
be added to the web.config file. The client configuration snippets from
the Management Portal contain a preconfigured **caching** section
snippet that can be pasted into the web.config file. This snippet is
configured to use the non-SSL endpoint. If the **SslEndpoint** is
desired, replace the **cacheName** of default in the snippet to
**SslEndpoint**. To configure your ASP.NET application to use the output
cache provider, paste this snippet into your web.config file.

    <!-- If output cache content needs to be saved in AppFabric Caching service, add the following to web.config inside system.web. -->
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

For more information about using the Windows Azure output cache
provider, see [Output Cache Provider (AppFabric)][].

## <a name="next-steps"> </a>Next Steps

Now that you've learned the basics of the Windows Azure Caching service,
follow these links to learn how to do more complex caching tasks.

-   See the MSDN Reference: [Caching Service][]
-   Visit the [Team Blog][]
-   Watch training videos on [Windows Azure Caching][].

  [Next Steps]: #next-steps
  [What is the Caching Service?]: #what-is
  [Create a Windows Azure Cache]: #create-cache
  [Prepare Your Visual Studio Project to Use Windows Azure Caching]: #prepare-vs
  [Configure Your Application to Use Caching]: #configure-app
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
  [Target a Supported .NET Framework Profile]: #prepare-vs-target-net
  [How to: Configure a Cache Client Programmatically]: http://msdn.microsoft.com/en-us/library/windowsazure/gg618003.aspx
  [Cache6]: ../../../DevCenter/dotNet/Media/cache6.png
  [Cache7]: ../../../DevCenter/dotNet/Media/cache7.png
  [Session State Provider (AppFabric)]: http://msdn.microsoft.com/en-us/library/windowsazure/gg185668.aspx
  [Windows Azure AppFabric Cache: Caching Session State]: http://www.microsoft.com/en-us/showcase/details.aspx?uuid=87c833e9-97a9-42b2-8bb1-7601f9b5ca20
  [Output Cache Provider (AppFabric)]: http://msdn.microsoft.com/en-us/library/windowsazure/gg185662.aspx
  [Caching Service]: http://msdn.microsoft.com/en-us/library/windowsazure/gg278356.aspx
  [Team Blog]: http://blogs.msdn.com/b/windowsazure/
  [Windows Azure Caching]: http://www.microsoft.com/en-us/showcase/Search.aspx?phrase=azure+caching
