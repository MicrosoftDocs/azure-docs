<properties linkid="video-center-detail" urlDisplayName="details" pageTitle="Video Center Details" metaKeywords="" description="" metaCanonical="" services="" documentationCenter="" title="How to Use ASP.NET Web Forms Output Caching with Azure Websites" authors="sdanie" solutions="" manager="wpickett" editor="" />

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="dotnet" ms.topic="article" ms.date="01/01/1900" ms.author="sdanie" />



# How to Use ASP.NET Web Forms Output Caching with Azure Websites

This topic explains how to use the Azure Cache Service (Preview) to support ASP.NET page output caching for ASP.NET Web Forms. Page output caching is an optimization that directly returns a cached rendering page for a specific duration of time. This is useful in situations where a page is accessed more frequently than it typically changes. It is important to note that page output caching is not supported for ASP.NET MVC applications.

The Cache Service (Preview) provides a distributed caching service that is external to the website. This enables all instances of the website to access the same cached rendering of a page.

The basic steps to use the Cache Service (Preview) for page output caching include:

* [Create the cache.](#createcache)
* [Configure the ASP.NET project to use Azure Cache.](#configureproject)
* [Modify the web.config file.](#configurewebconfig)
* [Use output caching to temporarily return cached versions of a page.](#useoutputcaching)

<h2><a id="createcache"></a>Create the Cache</h2>
Cache instances in Managed Cache Service are created using PowerShell cmdlets. 

>Once a Managed Cache Service instance is created using the PowerShell cmdlets it can be viewed and configured in the [Azure Management Portal][].

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

Once the PowerShell cmdlet is invoked, it can take a few minutes for the cache to be created. After the cache has been created, your new cache has a `Running` status and is ready for use with default settings, and can be viewed and configured in the [Azure Management Portal][].

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





The following sections will use settings from the **Dashboard** tab to configure Caching for an ASP.NET project.

<h2><a id="configureproject"></a>Configure the ASP.NET project</h2>
1. First, ensure that you have [installed the latest][]  **Azure SDK for .NET**.

2. In Visual Studio, right-click the ASP.NET project in **Solution Explorer**, and then select **Manage NuGet Packages**. (If you are using WebMatrix, click the **NuGet** button on the toolbar instead)

3. Type **WindowsAzure.Caching** in the **Search Online** edit box.

	![NuGetDialog][NuGetDialog]

4. Select the **Azure Caching** package, and then click the **Install** button.

<h2><a id="configurewebconfig"></a>Modify the Web.Config File</h2>
In addition to making assembly references for Cache, the NuGet package adds stub entries in the web.config file. To use Cache for ASP.NET page output caching, several modifications must be made to the web.config.

1. Open the **web.config** file for the ASP.NET project.

2. If you have existing **caching** and **outputCache** elements, comment them out (or remove them).

3. Then uncomment the **caching** element that was added by the Azure Caching NuGet package. The end result should look similar to the following screenshot.

	![OutputConfig][OutputConfig]

4. Next, find the **dataCacheClients** section. Uncomment the **securityProperties** child element.

	![CacheConfig][CacheConfig]

5. In the **autoDiscover** element, set the **identifier** attribute to your cache's endpoint URL. To find your endpoint URL, go to the cache properties in the Azure Management Portal. On the **Dashboard** tab, copy the **ENDPOINT URL** value in the **quick glance** section.

	![EndpointURL][EndpointURL]

6. In the **messageSecurity** element, set the **authorizationInfo** attribute to your cache's access key. To find the access key, select your cache in the Azure Management Portal. Then click the **Manage Keys** icon on the bottom bar. Click the copy button next to the **PRIMARY ACCESS KEY** text box.

	![ManageKeys][ManageKeys]

<h2><a id="useoutputcaching"></a>Use Output Caching</h2>
The final step is to configure pages in your ASP.NET Web Forms application to use output caching. This can be done by adding an **OutputCache** attribute to the beginning of the .ASPX source. For example:

	<%@ OutputCache Duration="45" VaryByParam="*" %>

The previous example caches the page for forty-five seconds. Because **VaryByParam** is set to "*", this cached page output does not change even if different query parameters are passed. But the following example does cache a different version of the page for each value of the "UserId" paraemter:

	<%@ OutputCache Duration="45" VaryByParam="UserId" %>	

  
  
  
[installed the latest]: http://www.windowsazure.com/en-us/downloads/?sdk=net
[NewIcon]: ./media/web-sites-web-forms-output-caching/CacheScreenshot_NewButton.PNG
[NewCacheDialog]: ./media/web-sites-web-forms-output-caching/CachingScreenshot_CreateOptions.PNG
[CacheIcon]: ./media/web-sites-web-forms-output-caching/CachingScreenshot_CacheIcon.PNG
[NuGetDialog]: ./media/web-sites-web-forms-output-caching/CachingScreenshot_NuGet.PNG
[OutputConfig]: ./media/web-sites-web-forms-output-caching/CachingScreenshot_OC_WebConfig.PNG
[CacheConfig]: ./media/web-sites-web-forms-output-caching/CachingScreenshot_CacheConfig.PNG
[EndpointURL]: ./media/web-sites-web-forms-output-caching/CachingScreenshot_EndpointURL.PNG
[ManageKeys]: ./media/web-sites-web-forms-output-caching/CachingScreenshot_ManageAccessKeys.PNG
  
[New-AzureManagedCache]: http://go.microsoft.com/fwlink/?LinkId=400495
[Azure Managed Cache Cmdlets]: http://go.microsoft.com/fwlink/?LinkID=398555
[How to install and configure Azure PowerShell]: http://go.microsoft.com/fwlink/?LinkId=400494
[Add-AzureAccount]: http://msdn.microsoft.com/en-us/library/dn495128.aspx
[Select-AzureSubscription]: http://msdn.microsoft.com/en-us/library/dn495203.aspx
[Azure Management Portal]: https://manage.windowsazure.com/
  
  
  
