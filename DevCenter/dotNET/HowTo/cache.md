<properties
umbracoNaviHide=0
pageTitle=How to Use the Caching Service from .NET
metaKeywords=Windows Azure cache, Windows Azure caching, Azure cache, Azure caching, Azure store session state, Azure cache .NET, Azure cache C#
metaDescription=Learn how to use the Windows Azure caching service: add and remove objects from the cache, store ASP.NET session state in the cache, and enable ASP.NET page output caching.
linkid=Contact - Support
urlDisplayName=Caching
headerExpose=
footerExpose=
disqusComments=1
/>
<h1>How to Use the Caching Service</h1>
<p>This guide will show you how to perform common scenarios using the Windows Azure Caching service. The samples are written in C# code and use the .NET API. The scenarios covered include <strong>adding and removing objects from the cache, storing ASP.NET session state in the cache</strong>, and <strong>enabling ASP.NET page output caching using the cache</strong>. For more information on using the Windows Azure Caching service, refer to the <a href="#next-steps">Next Steps</a> section.</p>
<h2>Table of Contents</h2>
<ul>
<li><a href="#what-is">What is the Caching Service?</a></li>
<li><a href="#create-cache">Create a Windows Azure Cache</a></li>
<li><a href="#prepare-vs">Prepare Your Visual Studio Project to Use Windows Azure Caching</a></li>
<li><a href="#configure-app">Configure Your Application to Use Caching</a></li>
<li><a href="#add-object">How To: Add and Retrieve an Object from the Cache</a></li>
<li><a href="#specify-expiration">How To: Specify the Expiration of an Object in the Cache</a></li>
<li><a href="#store-session">How To: Store ASP.NET Session State in the Cache</a></li>
<li><a href="#store-page">How To: Store ASP.NET Page Output Caching in the Cache</a></li>
<li><a href="#next-steps">Next Steps</a></li>
</ul>
<h2><a name="what-is"></a>What is the Caching Service?</h2>
<p>The Windows Azure Caching service provides a distributed, in-memory, application cache service for Windows Azure and SQL Azure applications. Caching increases performance by temporarily storing information from other backend sources, and can reduce the costs associated with database transactions in the cloud. The Caching service includes the following features:</p>
<ul>
<li>Pre-built ASP.NET providers for session state and page output caching, enabling acceleration of web applications without having to modify application code.</li>
<li>Caches any managed object - for example: CLR objects, rows, XML, binary data.</li>
<li>Consistent development model across both Windows Azure and Windows Server AppFabric.</li>
<li>Secured access and authorization provided by the Access Control Service (ACS).</li>
</ul>
<p>Getting started with the Caching service is easy. It has a simple provisioning model, and there is no complex infrastructure to install or manage.</p>
<h2><a name="create-cache"></a>Create a Windows Azure Cache</h2>
<p>To use the Windows Azure Caching service, you need a cache. You can create a cache in the Windows Azure Platform Management Portal as shown below:</p>
<ol>
<li>
<p>Log into the <a href="http://windows.azure.com/" target="_blank">Windows Azure Management Portal</a>. <br /><img src="/media/net/how-to-cache1.png" alt="Cache1"/></p>
</li>
<li>
<p>In the lower left navigation pane of the Management Portal, click <strong>Service Bus, Access Control &amp; Caching</strong>. <br /><img src="/media/net/how-to-cache2.png" alt="Cache2"/></p>
</li>
<li>
<p>In the upper left navigation pane of the Management Portal, click <strong>Cache</strong>, and the click <strong>New</strong>. <br /><img src="/media/net/how-to-cache3.png" alt="Cache3"/></p>
</li>
<li>
<p>In <strong>Create a new Service Namespace</strong>, enter a namespace, and then to make sure that it is unique, click <strong>Check Availability</strong>. <br /><img src="/media/net/how-to-cache4.png" alt="Cache4"/></p>
</li>
<li>
<p>If it is available, choose the country or region in which your storage account is (or will be) located, the subscription for the storage account, the cache size, and then click <strong>Create Namespace</strong>.</p>
<p>The namespace appears in the Management Portal and takes a moment to activate. Wait until the status is <strong>Active</strong> before moving on.</p>
</li>
<li>
<p>Select the newly created namespace, and take note of the <strong>Properties</strong> in the right hand column. You will need these in subsequent steps to access the cache: Service URL, Service Port, and Authentication Token. <br /><img src="/media/net/how-to-cache5.png" alt="Cache5"/></p>
</li>
</ol>
<h2><a name="prepare-vs"></a>Prepare Your Visual Studio Project to Use Windows Azure Caching</h2>
<p>Before you can perform operations with Windows Azure Caching, you need to target one of the supported .NET Framework Profiles, add a reference to the Caching assemblies, and include the corresponding namespaces.</p>
<h3><a name="prepare-vs-target-net"></a>Target a Supported .NET Framework Profile</h3>
<ol>
<li>
<p>In Solution Explorer, right-click the desired project name, and then click <strong>Properties</strong>.</p>
</li>
<li>
<p>Select the <strong>Application</strong> tab of the <strong>Project Properties</strong> dialog.</p>
</li>
<li>
<p>Verify that the target framework version is .NET Framework 2.0 or higher (non-client profile).<br /><strong>Note</strong>: Be sure to select one of the profiles that do not specify <strong>Client Profile</strong>.</p>
</li>
</ol>
<h3>Add a Reference to the Caching Assemblies</h3>
<ol>
<li>
<p>In Solution Explorer, right-click the desired project name, and then click <strong>Add Reference</strong>.</p>
</li>
<li>
<p>In the Add Reference dialog, select the <strong>Browse</strong> tab.</p>
</li>
<li>
<p>Navigate to C:\Program Files\Windows Azure SDK\v1.6\Cache\ref\ and select the following assemblies:</p>
</li>
<ul>
<li>Microsoft.ApplicationServer.Caching.Client.dll</li>
<li>Microsoft.ApplicationServer.Caching.Core.dll</li>
<li>Microsoft.WindowsFabric.Common.dll</li>
<li>Microsoft.WindowsFabric.Data.Common.dll</li>
</ul>
<li>
<p>For ASP.NET projects, also add a reference to the Microsoft.Web.DistributedCache.dll.</p>
</li>
<li>
<p>Click <strong>OK</strong>.</p>
</li>
</ol>
<h3>Import the Caching Namespaces</h3>
<p>Add the following to the top of any file from which you want to use Windows Azure Caching:</p>
<pre class="prettyprint">using Microsoft.ApplicationServer.Caching;</pre>
<p><strong>Note</strong>: If Visual Studio doesn't recognize the types in the using statement even after adding the references, ensure that the target profile for the project is set to one of the profiles that does not have Client Profile in the name. For more information, see <a href="#prepare-vs-target-net">Target a Supported .NET Framework Profile</a>.</p>
<h2><a name="configure-app"></a>Configure Your Application to Use Caching</h2>
<p>You can configure your application to use caching in code, or by using configuration files. The guide covers using configuration files. For information on configuring your application to use caching in code, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg618003.aspx">How to: Configure a Cache Client Programmatically</a>.</p>
<ol>
<li>
<p>In the Management Portal, select the desired cache, and then click <strong>View Client Configuration</strong>: <br /><img src="/media/net/how-to-cache6.png" alt="Cache6"/></p>
<p>This brings up the Client Configuration window, which contains sections of XML snippets to copy into the appropriate sections in the configuration file of your application. <br /><img src="/media/net/how-to-cache7.png" alt="Cache7"/></p>
</li>
<li>
<p>Copy the <strong>dataCacheClients</strong> section into the <strong>configSections</strong> of your configuration file. If your configuration file does not have a <strong>configSections</strong>, then add one.</p>
<pre class="prettyprint">&lt;configSections&gt;
  &lt;!-- Append below entry to configSections. Do not overwrite the full section.--&gt;
  &lt;section name="dataCacheClients" 
           type="Microsoft.ApplicationServer.Caching.DataCacheClientsSection,
 Microsoft.ApplicationServer.Caching.Core"
           allowLocation="true" 
           allowDefinition="Everywhere"/&gt;
&lt;/configSections&gt;
</pre>
</li>
<li>
<p>Copy either the default or the ssl <strong>dataCacheClient</strong> section, depending on your security needs. In this example the default section is copied.</p>
<pre class="prettyprint">&lt;!-- Cache exposes two endpoints: one simple and other SSL endpoint. Choose the appropriate endpoint depending on your security needs. --&gt;
&lt;dataCacheClients&gt;
  &lt;dataCacheClient name="default"&gt;
    &lt;hosts&gt;
      &lt;host name="MyCacheNamespace.cache.windows.net" cachePort="22233" /&gt;
    &lt;/hosts&gt;

    &lt;securityProperties mode="Message"&gt;
      &lt;messageSecurity 
        authorizationInfo="Your authorization token will be here."&gt;
      &lt;/messageSecurity&gt;
    &lt;/securityProperties&gt;
  &lt;/dataCacheClient&gt;
&lt;/dataCacheClients&gt;</pre>
<p><strong>Important: </strong>If you are not developing an ASP.NET project, do not paste in the <strong>sessionState</strong> and <strong>outputCache</strong> elements into your configuration file. These sections will be covered in <a href="#store-session">How to Store ASP.NET Session State in the Cache</a> and <a href="#store-page">How to Store ASP.NET Page Output Caching in the Cache</a>.</p>
</li>
<li>
<p>In your application, create a new <strong>DataCacheFactory</strong> object using the default constructor. This causes the cache client to use the settings in the configuration file. Call the <strong>GetDefaultCache</strong> method of the new <strong>DataCacheFactory</strong> instance which returns a <strong>DataCache </strong>object that can then be used to programmatically access the cache.</p>
<pre class="prettyprint">// Cache client configured by settings in application configuration file.
DataCacheFactory cacheFactory = new DataCacheFactory();
DataCache cache = cacheFactory.GetDefaultCache();
// cache can now be used to add and retrieve items.	
</pre>
</li>
</ol>
<h2><a name="add-object"></a>How To: Add and Retrieve an Object from the Cache</h2>
<p>To add an item to the cache, the <strong>Add</strong> method or the <strong>Put</strong> method can be used. The <strong>Add</strong> method adds the specified object to the cache, keyed by the value of the key parameter.</p>
<pre class="prettyprint">// Add the string "value" to the cache, keyed by "item"
cache.Add("item", "value");
</pre>
<p>If an object with the same key is already in the cache, a <strong>DataCacheException </strong>will be thrown with the following message:</p>
<blockquote>ErrorCode:SubStatus: An attempt is being made to create an object with a Key that already exists in the cache. Caching will only accept unique Key values for objects.</blockquote>
<p>To check to see if an object with a specific key is already in the cache, the <strong>Get</strong> method can be used. If the object exists, it is returned, and if it does not, null is returned.</p>
<pre class="prettyprint">// Add the string "value" to the cache, keyed by "key"
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
</pre>
<p>The <strong>Put</strong> method adds the object with the specified key to the cache if it does not exist, or replaces the object if it does exist.</p>
<pre class="prettyprint">// Add the string "value" to the cache, keyed by "item". If it exists,
// replace it.
cache.Put("item", "value");
</pre>
<h2><a name="specify-expiration"></a>How To: Specify the Expiration of an Object in the Cache</h2>
<p>By default items in the cache expire after 48 hours. If a longer or shorter timeout interval is desired, a specific duration can be specified when an item is added or updated in the cache by using the overload of <strong>Add</strong> and <strong>Put</strong> that take a <strong>TimeSpan</strong> parameter. In the following example, the string <strong>value</strong> is added to cache, keyed by <strong>item</strong>, with a timeout of 30 minutes.</p>
<pre class="prettyprint">// Add the string "value" to the cache, keyed by "item"
cache.Add("item", "value", TimeSpan.FromMinutes(30));
</pre>
<p>To view the remaining timeout interval of an item in the cache, the <strong>GetCacheItem</strong> method can be used to retrieve a <strong>DataCacheItem</strong> object that contains information about the item in the cache, including the remaining timeout interval.</p>
<pre class="prettyprint">// Get a DataCacheItem object that contains information about
// "item" in the cache. If there is no object keyed by "item" null
// is returned. 
DataCacheItem item = cache.GetCacheItem("item");
TimeSpan timeRemaining = item.Timeout;
</pre>
<h2><a name="store-session"></a>How To: Store ASP.NET Session State in the Cache</h2>
<p>The Windows Azure Caching service session state provider is an out-of-process storage mechanism for ASP.NET applications. This provider enables you to store your session state in a Windows Azure cache rather than in-memory or in a SQL Server database. To use the Caching session state provider, first ensure that the steps described in the previous <a href="#prepare-vs">Prepare Your Visual Studio Project to Use Windows Azure Caching</a> and <a href="#configure-app">Configure Your Application to Use Caching</a> sections are completed. Once these steps are completed, a <strong>sessionState</strong> section can be added to the web.config file. The client configuration snippets from the Management Portal contain a preconfigured <strong>sessionState</strong> section snippet that can be pasted into the web.config file. This snippet is configured to use the non-SSL endpoint. If the <strong>SslEndpoint</strong> is desired, replace the <strong>cacheName</strong> of default in the snippet to <strong>SslEndpoint</strong>. To configure your ASP.NET application to use the Caching service session state provider, paste this snippet into your web.config file.</p>
<pre class="prettyprint">&lt;!-- If session state needs to be saved in AppFabric Caching service, add the following to web.config inside system.web. If SSL is required, then change dataCacheClientName to "SslEndpoint". --&gt;
&lt;sessionState mode="Custom" customProvider="AppFabricCacheSessionStoreProvider"&gt;
  &lt;providers&gt;
    &lt;add name="AppFabricCacheSessionStoreProvider"
          type="Microsoft.Web.DistributedCache.DistributedCacheSessionStateStoreProvider, Microsoft.Web.DistributedCache"
          cacheName="default"
          useBlobMode="true"
          dataCacheClientName="default" /&gt;
  &lt;/providers&gt;
&lt;/sessionState&gt;
</pre>
<p>For more information about using the Caching service session state provider, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg185668.aspx">Session State Provider (AppFabric)</a>. For a demo of an ASP.NET application that uses the Caching session state provider, see <a href="http://www.microsoft.com/en-us/showcase/details.aspx?uuid=87c833e9-97a9-42b2-8bb1-7601f9b5ca20" target="_blank">Windows Azure AppFabric Cache: Caching Session State</a>.</p>
<h2><a name="store-page"></a>How To: Store ASP.NET Page Output Caching in the Cache</h2>
<p>The Windows Azure output cache provider is an out-of-process storage mechanism for output cache data. This data is specifically for full HTTP responses (page output caching). The provider plugs into the new output cache provider extensibility point that was introduced in ASP.NET 4. To use the output cache provider, first ensure that the steps described in the previous <a href="#prepare-vs">Prepare Your Visual Studio Project to Use Windows Azure Caching</a> and <a href="#configure-app">Configure Your Application to Use Caching</a> sections are completed. Once these steps are completed, a <strong>caching</strong> section can be added to the web.config file. The client configuration snippets from the Management Portal contain a preconfigured <strong>caching</strong> section snippet that can be pasted into the web.config file. This snippet is configured to use the non-SSL endpoint. If the <strong>SslEndpoint</strong> is desired, replace the <strong>cacheName</strong> of default in the snippet to <strong>SslEndpoint</strong>. To configure your ASP.NET application to use the output cache provider, paste this snippet into your web.config file.</p>
<pre class="prettyprint">&lt;!-- If output cache content needs to be saved in AppFabric Caching service, add the following to web.config inside system.web. --&gt;
&lt;caching&gt;
  &lt;outputCache defaultProvider="DistributedCache"&gt;
    &lt;providers&gt;
      &lt;add name="DistributedCache"
            type="Microsoft.Web.DistributedCache.DistributedCacheOutputCacheProvider, Microsoft.Web.DistributedCache"
            cacheName="default"
            dataCacheClientName="default" /&gt;
    &lt;/providers&gt;
  &lt;/outputCache&gt;
&lt;/caching&gt;
</pre>
<p>For more information about using the Windows Azure output cache provider, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg185662.aspx">Output Cache Provider (AppFabric)</a>.</p>
<h2><a name="next-steps"></a>Next Steps</h2>
<p>Now that you've learned the basics of the Windows Azure Caching service, follow these links to learn how to do more complex caching tasks.</p>
<ul>
<li>See the MSDN Reference: <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg278356.aspx">Caching Service</a></li>
<li>Visit the <a href="http://blogs.msdn.com/b/windowsazure/" target="_blank">Team Blog</a></li>
<li>Watch training videos on <a href="http://www.microsoft.com/en-us/showcase/Search.aspx?phrase=azure+caching" target="_blank">Windows Azure Caching</a>.</li>
</ul>