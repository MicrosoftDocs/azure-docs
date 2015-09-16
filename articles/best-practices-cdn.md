<properties
   pageTitle="Content Delivery Network (CDN) guidance | Microsoft Azure"
   description="Guidance on Content Delivery Network (CDN) to deliver high bandwidth content hosted in Azure."
   services=""
   documentationCenter="na"
   authors="dragon119"
   manager="masimms"
   editor=""
   tags=""/>

<tags
   ms.service="best-practice"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/28/2015"
   ms.author="masashin"/>

# Content Delivery Network (CDN) guidance

![](media/best-practices-cdn/pnp-logo.png)

## Overview

The Microsoft Azure Content Delivery Network (CDN) offers developers a global solution for delivering high-bandwidth content that is hosted in Azure. The CDN caches publicly available objects loaded from Azure blob storage or an application folder at strategically placed locations to provide maximum bandwidth for delivering content to users. It is typically used for delivering static content such as images, style sheets, documents, files, client-side scripts, and HTML pages.

The major advantages of using the CDN are lower latency and faster delivery of content to users irrespective of their geographical location in relation to the datacenter where the application is hosted, and a reduction in the load on the application itself because it is relieved of the processing required to access and deliver the content. This reduction in load can help to increase the performance and scalability of the application, as well as minimizing hosting cost by reducing the processing resources required to achieve a specific level of performance and availability.

You may be able to use other content delivery network systems that are not implemented by Azure in your applications if the Azure CDN does not meet your needs. Alternatively, you may be able to use the Azure CDN for applications hosted with other providers by exposing the static content in Azure storage or in Azure compute instances.  
![](media/best-practices-cdn/CDN.png)

## How and why the CDN is used

Typical uses for the CDN include:  

- Delivering static resources for client applications, often from a website. These can be images, style sheets, documents, files, client-side scripts, HTML pages, HTML fragments, or any other content that the server does not need to modify for each request. The application can create items at runtime and make them available to the CDN (for example, by creating a list of current news headlines), but it does not do so for each request.

- Delivering public static and shared content to devices such as mobile phones and tablet computers where the application itself is a web service that offers an API to clients. In addition to other content that the server does not need to modify for each request, the CDN can deliver static datasets for the client to use - perhaps to generate the client UI. For example, it could be used to deliver JSON or XML documents.

- Serving entire websites that consist of only public static content to clients, without requiring any dedicated compute resources.

- Streaming video files to the client on demand. Video benefits from the low latency and reliable connectivity available from the globally located datacenters that offer CDN connections.

- Generally improving the experience for users, especially those located far from the application’s datacenter location who would otherwise suffer higher latency. A large proportion of the total size of the content in a web application is often static, and using the CDN can help to maintain performance and overall user experience while eliminating the requirement to deploy the application to multiple data centers.

- Coping with the growing load on applications that service mobile and fixed devices that are part of the Internet of Things (IoT). The huge numbers of such devices and appliances could easily overwhelm the application if it was required to process broadcast messages and manage firmware update distribution directly.

- Coping with peaks and surges in demand without requiring the application to scale, avoiding the consequent increase running costs. For example, when an update is released to an operating system, for a hardware device such as a specific model of router, or for a consumer device such as a smart TV, there will be a huge peak in demand as it is downloaded by millions of users and devices over a short period.  

- The following table shows examples of the median time to first byte from various geographic locations. The target web role is deployed to Azure West US. There is a strong correlation between greater boost due to the CDN and proximity to a CDN node. A list of Azure CDN node locations is available at [Azure Content Delivery Network (CDN) Node Locations](http://msdn.microsoft.com/library/azure/gg680302.aspx).  



|City |Time to First Byte (Origin) |Time to First Byte (CDN) | % faster for CDN|
|---|---|---|---|
|San Jose, CA<sub>1</sub> |47.5 |46.5 |2%|
|Dulles, VA<sub>2</sub> |109 |40.5 |169%|
|Buenos Aires,AR |210 |151 |39%|
|London, UK<sub>1</sub> |195 |44 |343%|
|Shanghai, CN |242 |206 |17%|
|Singapore<sub>1</sub> |214 |74 |189%|
|Tokyo, JP<sub>1</sub> |163 |48 |240%|
|Seoul, KR |190 |190 |0%|

Has an Azure CDN node in the same city.<sub>1</sub>  
Has an Azure CDN node in a neighboring city.<sub>2</sub>  


## Challenges  

There are several challenges to take into account when planning to use the CDN:  

- **Deployment** You must decide where to load content for the CDN from (the origin from which the CDN will fetch the content), and whether you need to deploy the content in more than one storage system (such as on the CDN and in an alternative location).

- Your application deployment mechanism must take into account deploying static content and resources as well as deploying the application files such as ASPX pages. For example, it may require a separate step to load content into Azure blob storage.

- **Versioning and cache-control** You must consider how you will update static content and deploy new versions. The CDN does not currently provide a mechanism for flushing content so that new versions are available. This is a similar challenge to managing client side caching, such as in a web browser.

- **Testing** It can be difficult to perform local testing of your CDN settings when developing and testing an application locally or in staging.

- **SEO** Content such as images and documents are served from a different domain when you use they CDN, which will have an effect on SEO for this content.

- **Security** Many CDN services such as Azure CDN do not currently offer any type of access control for the content.

- **Resiliency** CDN is a potential single point of failure for an application. It has a lower availability SLA than blob storage (which can be used to deliver content directly) so you may need to consider implementing a fallback mechanism for critical content.

- Clients may be connecting from an environment that does not allow access to resources on the CDN. This could be a security-constrained environment that limits access to only a set of known sources, or one that prevents loading of resources from anything other than the page origin. Therefore, a fallback implementation will be required.

- You should implement a mechanism to monitor your content availability through the CDN.

Scenarios where CDN may be less useful include:  

- When the content has a low hit rate and so may be accessed few times, or just once, during the time-to-live validity period. The first time an item is downloaded you incur two transaction charges (from the origin to the CDN, and then from the CDN to the customer).

- When the data is private, such as for large enterprises or supply chain ecosystems.


## General guidelines and good practices

Using the CDN is a good way to minimize the load on your application, and maximize availability and performance. You should consider this for all of the appropriate content and resources you application uses. Consider the following points when designing your strategy to use the CDN:  

- **Origin** Deploying content through the CDN simply requires you to specify an HTTP (port 80) endpoint that the CDN service will use to access and cache the content. + The endpoint can specify an Azure blob storage container that holds the static content you want to deliver through the CDN. The container must be marked as public. Only blobs in a public container that have public read access will be available through the CDN.

- The endpoint can specify a folder named **cdn** in the root of one of application’s compute layers (such as a web role or a virtual machine). The results from requests for resources, including dynamic resources such as ASPX pages, will be cached on the CDN. The minimum cacheability period is 300 seconds. Any shorter period will prevent the content from being deployed to the CDN (see the section "<a href="#cachecontrol" xmlns:dt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:MSHelp="http://msdn.microsoft.com/mshelp">Cache control</a>" for more information).

- If you are using Azure Web Sites, the endpoint is set to the root folder of the site by selecting the site when creating the CDN instance. All of the content for the site will be available through the CDN.

- In most cases, pointing your CDN endpoint at a folder within one of the compute layers of your application will offer more flexibility and control. For instance, it makes it easier to manage current and future routing requirements, and dynamically generate static content such as image thumbnails.

- You can use query strings to differentiate objects in the cache when content is delivered from dynamic sources such as ASPX pages. However, this behavior can be disabled by a setting in the management portal when you specify the CDN endpoint. When delivering content from blob storage, query strings are treated as string literals so two items that have the same name but different query strings will be stored as separate items on the CDN.

- You can utilize URL rewriting for resources such as scripts and other content to avoid moving your files to the CDN origin folder.

- When using Azure storage blobs to hold content for the CDN, the URL of the resources in blobs is case sensitive for the container and blob name.

- When using Azure Web Sites, you specify the path to the CDN instance in the links to resources. For example, the following specifies an image file in the **Images** folder of the site that will be delivered through the CDN:

  ```
  <img src="http://[your-cdn-instance].vo.msecnd.net/Images/image.jpg" />
  ```

- **Deployment** Static content may need to be provisioned and deployed independently from the application if you do not include it in the application deployment package or process. Consider how this will affect the versioning approach you use to manage both the application components and the static resource content.

- Consider how bundling (combining several files into one file) and minification (removing unnecessary characters such as white space, new line characters, comments, and other characters) for script and CSS files will be handled. These commonly used techniques can reduce load times for clients, and are compatible with delivering content through the CDN. For more information, see [Bundling and Minification](http://www.asp.net/mvc/tutorials/mvc-4/bundling-and-minification).

- If you need to deploy the content to an additional location, this will be an extra step in the deployment process. If the application updates the content for the CDN, perhaps at regular intervals or in response to an event, it must store the updated content in any additional locations as well as the endpoint for the CDN.

- You cannot set up a CDN endpoint for an application deployed in Azure staging, or in the local Azure emulator in Visual Studio. This will affect unit testing, functional testing, and final pre-deployment testing. You must allow for this by implementing an alternative mechanism. For example, you could pre-deploy the content to the CDN using a temporary custom application or utility, and perform testing during the period it is cached. Alternatively, use compile directives or global constants to control where the application loads the resources from. For example, when running in debug mode it could load resources such as client-side script bundles and other content from a local folder, and use the CDN when running in release mode.

- The CDN does not support any native compression capabilities. However, it will deliver content that is already compressed, such as zip and gzip files. When using an application folder as the CDN endpoint, the server may compress some content by default in the same way as when delivering it directly to a web browser or other type of client. This relies on the **Accept-Encoding** value sent from the client. In Azure the default is to automatically compress content when CPU utilization is below 50%. Changing the settings and may require use of a startup task to turn on compression of dynamic output in IIS if you are using Cloud Services to host the application. See [Enabling gzip compression with Azure CDN through a Web Role](http://blogs.msdn.com/b/avkashchauhan/archive/2012/03/05/enableing-gzip-compression-with-windows-azure-cdn-through-web-role.aspx) for more information.

- **Routing and versioning** You may need to use different CDN instances; for example, when you deploy a new version of the application you may want to use a different CDN. If you use Azure blob storage as the content origin, you can simply create a separate storage account or a separate container and point the CDN endpoint to it. If you use the **cdn** root folder within the application as the CDN endpoint you can use URL rewriting techniques to direct requests to a different folder.

- Do not use the query string to denote different versions of the application in links to resources on the CDN because, when drawing content from Azure blob storage, the query string is part of the resource name (the blob name). It can also affect how the client caches the resources.

- Deploying new versions of static content when you update an application can be a challenge if the previous resources are cached on the CDN. For more information, see the section "<a href="#cachecontrol" xmlns:dt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:MSHelp="http://msdn.microsoft.com/mshelp">Cache control</a>".

<a name="cachecontrol" href="#" xmlns:xlink="http://www.w3.org/1999/xlink"><span /></a>**Cache control**+ Consider how you want to manage caching, and at what layers of the application. For example, when using a folder as the CDN origin you can specify the cacheability of pages that generate the content, and the content expiry for all the resources in a specific folder. You can also specify cache properties for the CDN, and for the client using standard HTTP headers. Although you should already be managing caching on the server and client, using the CDN will help to make you more aware of how your content is cached, and where.

- To prevent objects from being available on the CDN you can delete them from the origin (blob container or application **cdn** root folder), remove or delete the CDN endpoint, or—in the case of blob storage—make the container or blob private. However, items will be removed from the CDN only when their time-to-live (TTL) expires.

- If no cache expiry period is specified (such as when content is loaded from blob storage), it will be cached on the CDN for up to 72 hours.

- In a web application, you can set the caching and expiry for all content by using the **clientCache** element in the **system.webServer/staticContent** section of a web.config file. You can place a web.config file in any folder so that it affects the files in that folder and the files in all subfolders.

- If you use a dynamic technique such as ASP.NET to create the content for the CDN, ensure that you specify the **Cache.SetExpires** property on each page. The CDN will not cache the output from pages that use the default cacheability setting of public.  Set the cache expiry period to a suitable value to ensure that the content is not discarded and reloaded from the application at very short intervals.  

- **Security** The CDN can deliver content over HTTPS (SSL) using the certificate provided by the CDN, but it will also be available over HTTP as well. You cannot block HTTP access to items in the CDN. You may need to use HTTPS to request static content that is displayed in pages loaded through HTTPS (such as a shopping cart) to avoid browser warnings about mixed content.

- Many CDN services, such as the Azure CDN, do not presently offer any facilities for access control to secure access to the content. You cannot use Shared Access Signatures (SAS) with the CDN.

- If you deliver client-side scripts using the CDN, you may encounter issues if these scripts use an **XMLHttpRequest** call to make HTTP requests for other resources such as data, images, or fonts in a different domain. Many web browsers prevent cross-origin resource sharing (CORS) unless the web server is configured to set the appropriate response headers. For more information about CORS, see the section "Threat mitigation" in the guide <span class="highlight" xmlns:dt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:MSHelp="http://msdn.microsoft.com/mshelp">API security considerations</span>. You can configure the CDN to support CORS:+ If the origin from which you are delivering content is Azure blob storage, you can add a **CorsRule** to the service properties. The rule can specify the allowed origins for CORS requests, the allowed methods such as GET, and the maximum age in seconds for the rule (the period within which the client must request the linked resources after loading the original content). For more information, see [Cross-Origin Resource Sharing (CORS) Support for the Azure Storage Services](http://msdn.microsoft.com/library/azure/dn535601.aspx).

- If the origin from which you are delivering content is a folder within the application, such as the **cdn** root folder, you can configure outbound rules in the application configuration file to set an **Access-Control-Allow-Origin** header on all responses. For more information about using rewrite rules, see [URL Rewrite Module](http://www.iis.net/learn/extensions/url-rewrite-module). Note that this technique is not possible when using Azure Web Sites.

- **Custom domains**+ Most CDNs, including the Azure CDN, allow you to specify a custom domain name and use it to access resources through the CDN. You can also set up a custom subdomain name using a **CNAME** record in your DNS. Using this approach can provide an additional layer of abstraction and control.

- If you use a **CNAME**, you cannot (at the time this guide was written) also use SSL because the CDN uses its own single SSL certificate, and this will not match your custom domain/subdomain names.

- **CDN fallback** You should consider how your application will cope with a failure or temporary unavailability of the CDN. Client applications may be able to use copies of the resources that were cached locally (on the client) during previous requests, or they can use code that detects failures and instead requests resources from the origin (the application folder or Azure blob container that holds the resources) if the CDN is unavailable.

- **SEO** If SEO is an important consideration in your application, make sure you:+ Include a **Rel** canonical header in each page or resource.

- Use a **CNAME** subdomain record and access the resources using this name.

- Consider the impact of the fact that the IP address of the CDN may be a country or region that differs from that of the application itself.

- When using Azure blob storage as the origin, maintain the same file structure for resources on the CDN as in the application folders.


- **Monitoring & Logging** Include the CDN as part of your application monitoring strategy to detect and measure failures or extended latency occurrences.

- Enable logging for the CDN and include it as part of your daily operations.

- **Cost implication** You are charged for both outbound data transfers from the CDN and for storage transactions when the CDN loads data from your application. You should set realistic cache expiry periods for content to ensure freshness, but not so short as to cause repeated reloading of content from the application or blob storage to the CDN. However, very long expiry periods make it more difficult to remove items from the CDN because you must wait for them to expire.

- Items that are rarely downloaded will incur the two transaction charges without providing any significant reduction in server load.  



## Example code
This section contains some examples of code and techniques for working with the CDN.  


## URL rewriting
The following except from a Web.config file in the root of a Cloud Services hosted application demonstrates how to perform URL rewriting when using the CDN. Requests from the CDN for content it will cache are redirected to specific folders within the application root based on the type of the resource (such as scripts and images).  

```XML
<system.webServer>
  ...
  <rewrite>
    <rules>
      <rule name="VersionedResource" stopProcessing="false">
        <match url="(.*)_v(.*)\.(.*)" ignoreCase="true" />
        <action type="Rewrite" url="{R:1}.{R:3}" appendQueryString="true" />
      </rule>
      <rule name="CdnImages" stopProcessing="true">
        <match url="cdn/Images/(.*)" ignoreCase="true" />
        <action type="Rewrite" url="/Images/{R:1}" appendQueryString="true" />
      </rule>
      <rule name="CdnContent" stopProcessing="true">
        <match url="cdn/Content/(.*)" ignoreCase="true" />
        <action type="Rewrite" url="/Content/{R:1}" appendQueryString="true" />
      </rule>
      <rule name="CdnScript" stopProcessing="true">
        <match url="cdn/Scripts/(.*)" ignoreCase="true" />
        <action type="Rewrite" url="/Scripts/{R:1}" appendQueryString="true" />
      </rule>
      <rule name="CdnScriptBundles" stopProcessing="true">
        <match url="cdn/bundles/(.*)" ignoreCase="true" />
        <action type="Rewrite" url="/bundles/{R:1}" appendQueryString="true" />
      </rule>
    </rules>
  </rewrite>
  ...
</system.webServer>
```

The addition of the rewrite rules performs the following redirections:  

- The first rule allows you to embed a version in the file name of a resource, which is then ignored. For example, **Filename_v123.jpg** is rewritten as **Filename.jpg**.

- The next four rules show how to redirect requests if you do not want to store the resources in a folder named **cdn** in the root of the web role. The rules map the **cdn/Images**, **cdn/Content**, **cdn/Scripts**, and **cdn/bundles** URLs to their respective root folders in the web role.
Using URL rewriting requires you to make some changes to the bundling of resources.  


## Bundling and minification ##

Bundling and minification can be handled by ASP.NET. In an MVC project, you define your bundles in **BundleConfig.cs**. A reference to the minified script bundle is created by calling the **Script.Render** method, typically in code in the view class. This reference contains a query string that includes a hash, which is based on the content of the bundle. If the bundle contents change, the generated hash will also change.  
By default, Azure CDN instances have the **Query String Status** setting disabled. In order for updated script bundles to be handled properly by the CDN, you must enable the **Query String Status** setting for the CDN instance. Note that it may be an hour or more before creating the CDN and changing the settings takes effect.  


## More information
+ [Azure CDN](http://azure.microsoft.com/services/cdn/)
+ [Overview of the Azure Content Delivery Network (CDN)](http://msdn.microsoft.com/library/azure/ff919703.aspx)
+ [Serve Content from Azure CDN in Your Web Application](cdn-serve-content-from-cdn-in-your-web-application.md)
+ [Integrate a cloud service with Azure CDN](cdn-cloud-service-with-cdn.md)
+ [Best Practices for the Azure Content Delivery Network](http://azure.microsoft.com/blog/2011/03/18/best-practices-for-the-windows-azure-content-delivery-network/)
