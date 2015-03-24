<properties 
	pageTitle="Use Content from a CDN in Your Web Application" 
	description="A tutorial that teaches you how to use content from a CDN to improve the performance of your Web application." 
	services="cdn" 
	documentationCenter=".net" 
	authors="cephalin" 
	manager="wpickett" 
	editor="tysonn"/>

<tags 
	ms.service="cdn" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/20/2015" 
	ms.author="cephalin"/>

# Serve Content from Azure CDN in Your Web Application #

This tutorial shows you how to take advantage of Azure CDN to improve the reach and performance of your Web application. Azure CDN can help improve the performance of your Web application when:

- You have many links to static or semi-static content on your pages
- Your application is accessed by clients globally
- You want to offload traffic from your Web server
- You want to reduce the number of concurrent client connections to your Web server (there is a great discussion on this at [Bundling and Minification](http://www.asp.net/mvc/tutorials/mvc-4/bundling-and-minification)) 
- You want to increase the perceived load/refresh time of your pages

## What you will learn ##

In this tutorial, you will learn how to do the following:

-	[Serve static content from an Azure CDN endpoint](#deploy)
-	[Automate content upload from your ASP.NET application to your CDN endpoint](#upload)
-	[Configure the CDN cache to reflect the desired content update](#update)
-	[Serve fresh content immediately using query strings](#query)

## What you will need ##

This tutorial has the following prerequisites:

-	An active [Microsoft Azure account](/account/). You can sign up for a trial account
-	Visual Studio 2013 with [Azure SDK](http://go.microsoft.com/fwlink/p/?linkid=323510&clcid=0x409) for blob management GUI
-	[Azure PowerShell](http://go.microsoft.com/?linkid=9811175&clcid=0x409) (used by [Automate content upload from your ASP.NET application to your CDN endpoint](#upload))

> [AZURE.NOTE] You need an Azure account to complete this tutorial:
> + You can [open an Azure account for free](/pricing/free-trial/?WT.mc_id=A261C142F) - You get credits you can use to try out paid Azure services, and even after they're used up you can keep the account and use free Azure services, such as Websites.
> + You can [activate MSDN subscriber benefits](/pricing/member-offers/msdn-benefits-details/) - Your MSDN subscription gives you credits every month that you can use for paid Azure services.

<a name="static"></a>
## Serve static content from an Azure CDN endpoint ##

In this tutorial section, you will learn how to create a CDN and use it to serve your static content. The major steps involved are:

1. Create a storage account
2. Create a CDN linked to the storage account
3. Create a blob container in your storage account
4. Upload content to your blob container
5. Link to the the content you uploaded using its CDN URL

Let's get to it. Follow the steps below to start using the Azure CDN:

1. To create a CDN endpoint, log into your [Azure management portal](http://manage.windowsazure.com/). 
1. Create a storage account by clicking **New > Data Services > Storage > Quick Create**. Specify a URL, a location, and click **Create Storage Account**. 

	![](media/cdn-serve-content-from-cdn-in-your-web-application/cdn-static-1.PNG)

	>[AZURE.NOTE] Note that I'm using East Asia as the region as it is far enough away for me to test my CDN from North America later.

2. Once the new storage account's status is **Online**, create a new CDN endpoint that's tied to the storage account you created. Click **New > App Services > CDN > Quick Create**. Select the storage account you created and click **Create**.

	![](media/cdn-serve-content-from-cdn-in-your-web-application/cdn-static-2.PNG)

	>[AZURE.NOTE] Once your CDN is created, the Azure portal will show you its URL and the origin domain that it's tied to. However, it can take awhile for the CDN endpoint's configuration to be fully propagated to all the node locations.  

3. Test your CDN endpoint to make sure that it's online by pinging it. If your CDN endpoint has not propagated to all the nodes, you will see a message similar to the one below.

	![](media/cdn-serve-content-from-cdn-in-your-web-application/cdn-static-3-fail.PNG)

	Wait another hour and test again. Once your CDN endpoint has finished propagating to the nodes, it should respond to your pings.

	![](media/cdn-serve-content-from-cdn-in-your-web-application/cdn-static-3-succeed.PNG)

4. At this point, you can already see where the CDN endpoint determines to be the closest CDN node to you. From my desktop computer, the responding IP address is **93.184.215.201**. Plug it into a site like [www.ip-address.org](http://www.ip-address.org) and see that the server is located in Washington D.C.

	![](media/cdn-serve-content-from-cdn-in-your-web-application/cdn-static-4.PNG)

	For a list of all CDN node locations, see [Azure Content Delivery Network (CDN) Node Locations](http://msdn.microsoft.com/library/azure/gg680302.aspx).

3. Back in the Azure portal, in the **CDN** tab, click the name of the CDN endpoint you just created.

	![](media/cdn-serve-content-from-cdn-in-your-web-application/cdn-static-2-enablequerya.PNG)

3. Click **Enable Query String** to enable query strings in the Azure CDN cache. Once you enable this, the same link accessed with different query strings will be cached as separate entries.

	![](media/cdn-serve-content-from-cdn-in-your-web-application/cdn-static-2-enablequeryb.PNG)

	>[AZURE.NOTE] While enabling the query string is not necessary for this part of the tutorial, you want to do this as early as possible for convenience sake since any change here is going to take time to propagate to the rest of the nodes, and you don't want any non-query-string-enabled content to clog up the CDN cache (updating CDN content will be discussed later). You will find out how to take advantage of this in [Serve fresh content immediately through query strings](#query).

6. In Visual Studio 2013, in Server Explorer, click the **Connect to Microsoft Azure** button.

	![](media/cdn-serve-content-from-cdn-in-your-web-application/cdn-static-5.PNG)

7.  Follow the prompt to sign into your Azure account. 
8.  Once you sign in, expand the **Microsoft Azure > Storage > your storage account**. Right-click **Blob** and select **Create Blob Container**.

	![](media/cdn-serve-content-from-cdn-in-your-web-application/cdn-static-6.PNG)

8.	Specify a blob container name and click **OK**.

	![](media/cdn-serve-content-from-cdn-in-your-web-application/cdn-static-7.PNG)

9.	In Server Explorer, double-click the blob container you created to manage it. You should see the management interface in the center pane.

	![](media/cdn-serve-content-from-cdn-in-your-web-application/cdn-static-8.PNG)

10.	Click the **Upload Blob** button to upload images, scripts, or stylesheets that are used by your Web pages into the blob container. The upload progress will be shown in the **Azure Activity Log**, and the blobs will appear in the container view when they are uploaded. 

	![](media/cdn-serve-content-from-cdn-in-your-web-application/cdn-static-9.PNG)

11.	Now that you have uploaded the blobs, you must make them public for you to access them. In Server Explorer, right-click the container and select **Properties**. Set the **Public Read Access** property to **Blob**.

	![](media/cdn-serve-content-from-cdn-in-your-web-application/cdn-static-10.PNG)

12.	Test the public access of your blobs by navigating to the URL for one of the blobs in a browser. For example, I can test the first image in my uploaded list with `http://cephalinstorage.blob.core.windows.net/cdn/cephas_lin.png`.

	Note that I'm not using the HTTPS address given in the blob management interface in Visual Studio. By using HTTP, you test whether the content is publicly accessible, which is a requirement for Azure CDN.

13.	If you can see the blob rendered properly in your browser, change the URL from `http://<yourStorageAccountName>.blob.core.windows.net` to the URL of your Azure CDN. In my case, to test the first image at my CDN endpoint, I would use `http://az623979.vo.msecnd.net/cdn/cephas_lin.png`.

	>[AZURE.NOTE] You can find the CDN endpoint's URL in the Azure management portal, in the CDN tab.

	If you compare the performance of direct blob access and CDN access, you can see the performance gain from using Azure CDN. Below is the Internet Explorer 11 F12 developer tools screenshot for blob URL access of my image:

	![](media/cdn-serve-content-from-cdn-in-your-web-application/cdn-static-11-blob.PNG)

	And for CDN URL access of the same image 

	![](media/cdn-serve-content-from-cdn-in-your-web-application/cdn-static-11-cdn.PNG)

 	Pay attention to the numbers for the **Request** timing, which is the time to first byte, or the time taken to send the request and receive the first response from the server. When I access the blob, which is hosted in the East Asia region, it takes 266 ms for me - since the request must traverse the entire Pacific Ocean just to get to the server. However, when I access the Azure CDN, it takes only 16 ms, which is nearly a **20-fold gain in performance**!
	
15.	Now, it's just a matter of using the new link in your Web page. For example, I can add the following image tag:

		<img alt="Mugshot" src="http://az623979.vo.msecnd.net/cdn/cephas_lin.png" />

In this section, you have learned how to create a CDN endpoint, upload content to it, and link to CDN contentfrom any Web page.

<a name="upload"></a>
## Automate content upload from your ASP.NET application to your CDN endpoint ##

If you want to easily upload all of the static content in your ASP.NET Web application to your CDN endpoint, or if your deploy your Web application using continuous delivery (for an example, see [Continuous Delivery for Cloud Services in Azure](cloud-services-dotnet-continuous-delivery.md)), you can use Azure PowerShell to automate the synchronization of the latest content files to Azure blobs every time you deploy your Web application. For example, you can run the script at [Upload Content Files from ASP.NET Application to Azure Blobs](http://gallery.technet.microsoft.com/scriptcenter/Upload-Content-Files-from-41c2142a) upload all the content files in an ASP.NET application. To use this script:

4. From the **Start** menu, run **Microsoft Azure PowerShell**.
5. In the Azure PowerShell window, run `Get-AzurePublishSettingsFile` to download a publish settings file for your Azure account.
6. Once you have downloaded your publish settings file, run the following: 

		Import-AzurePublishSettingsFile "<yourDownloadedFilePath>"

	>[AZURE.NOTE] Once you import your publish settings file, it will be the default Azure account used for all Azure PowerShell sessions. This means that the above steps only need to be done once.
	
1. Download the script from the [download page](http://gallery.technet.microsoft.com/scriptcenter/Upload-Content-Files-from-41c2142a). Save it into your ASP.NET application's project folder.
2. Right-click the downloaded script and click **Properties**.
3. Click **Unblock**.
4. Open a PowerShell window and run the following:

		cd <ProjectFolder>
		.\UploadContentToAzureBlobs.ps1 -StorageAccount "<yourStorageAccountName>" -StorageContainer "<yourContainerName>"

This script uploads all files from your *\Content* and *\Scripts* folders to the specified storage account and container. It has the following advantages:

-	Automatically replicate the file structure of your Visual Studio project
-	Automatically create blob containers as needed
-	Reuse the same Azure storage account and CDN endpoint for multiple Web applications, each in a separate blob container
-	Easily update the Azure CDN with new content. For more information on updating content, see [Configure the CDN cache to reflect the desired content update](#update).

For the `-StorageContainer` parameter, it makes sense to use the name of your Web application, or the Visual Studio project name. Whereas I used the generic "cdn" as the container name previously, using the name of your Web application allows related content to be organized into the same easily identifiable container.

Once the content has finished uploading, you can link to anything in your *\Content* and *\Scripts* folder in your HTML code, such as in your .cshtml files, using `http://<yourCDNName>.vo.msecnd.net/<containerName>`. Here is an example of something I can use in a Razor view: 

	<img alt="Mugshot" src="http://az623979.vo.msecnd.net/MyMvcApp/Content/cephas_lin.png" />

For an example of integrating PowerShell scripts into your continuous delivery configuration, see [Continuous Delivery for Cloud Services in Azure](cloud-services-dotnet-continuous-delivery.md). 

<a name="update"></a>
## Configure the CDN cache to reflect the desired content update ##

Now, suppose after you have uploaded the static files from your Web app in a blob container, you make a change to one of the files in your project and upload it to the blob container again. You may think that it's automatically updated to your CDN endpoint, but are actually puzzled why you don't see the update reflected when you access the content's CDN URL. 

The truth is that the CDN does indeed automatically update from your blob storage, but it does so by applying a default 7-day caching rule to the content. This means that once a CDN node pulls your content from blob storage, the same content is not refreshed until it expires in the cache.

The good news is that you can customize cache expiration. Similar to most browsers, Azure CDN respects the expiration time specified in the content's Cache-Control header. You can specify a custom Cache-Control header value by navigating to the blob container in the Azure portal and editing the blob properties. The screenshot below shows cache expiration set to 1 hour (3600 seconds). 

![](media/cdn-serve-content-from-cdn-in-your-web-application/cdn-updates-1.PNG)

You can also do this in your PowerShell script to set all blobs' Cache-Control headers. For the script in [Automate content upload from your ASP.NET application to your CDN endpoint](#upload), find the following code snippet:

    Set-AzureStorageBlobContent `
        -Container $StorageContainer `
        -Context $context `
        -File $file.FullName `
        -Blob $blobFileName `
        -Properties @{ContentType=$contentType} `
        -Force

and modify it as follows:  

    Set-AzureStorageBlobContent `
        -Container $StorageContainer `
        -Context $context `
        -File $file.FullName `
        -Blob $blobFileName `
        -Properties @{ContentType=$contentType; CacheControl="public, max-age=3600"} `
        -Force

You may still need to wait for the full 7-day cached content on your Azure CDN to expire before it pulls the new content, with the new Cache-Control header. This illustrates the fact that custom caching values do not help if you want your content update to go live immediately, such as JavaScript or CSS updates. However, you can work around this issue by renamiving the files or versioning them through query strings. For more information, see [Serve fresh content immediately using query strings](#query).

There is, of course, a time and place for caching. For example, you may have content that does not require the frequent update, such as the upcoming World Cup games that can be refreshed every 3 hours, but gets enough global traffic that you want to offload it from your own Web server. That can be a good candidate to use the Azure CDN caching.

<a name="query"></a>
## Serve fresh content immediately using query strings ##

In Azure CDN, you can enable query strings so that content from URLs with specific query strings are cached separately. This is a great feature to use if you want to push certain content updates to the client browsers immediately instead of waiting for the cached CDN content to expire. Suppose I publish my Web page with a version number in the URL.  
<pre class="prettyprint">
&lt;link href=&quot;http://az623979.vo.msecnd.net/MyMvcApp/Content/bootstrap.css<mark>?v=3.0.0</mark>&quot; rel=&quot;stylesheet&quot;/&gt;
</pre>

When I publish a CSS update and use a different version number in my CSS URL:  
<pre class="prettyprint">
&lt;link href=&quot;http://az623979.vo.msecnd.net/MyMvcApp/Content/bootstrap.css<mark>?v=3.1.1</mark>&quot; rel=&quot;stylesheet&quot;/&gt;
</pre>

To a CDN endpoint that has query strings enabled, the two URLs are unique to each other, and it will make a new request to my Web server to retrieve the new *bootstrap.css*. To a CDN endpoint that doesn't have query strings enabled, however, these are the same URL, and it will simply serve the cached *bootstrap.css*. 

The trick then is to update the version number automatically. In Visual Studio, this is easy to do. In a .cshtml file where I would use the link above, I can specify a version number based on the assembly number.  
<pre class="prettyprint">
@{
    <mark>var cdnVersion = System.Reflection.Assembly.GetAssembly(
        typeof(MyMvcApp.Controllers.HomeController))
        .GetName().Version.ToString();</mark>
}

...

&lt;link href=&quot;http://az623979.vo.msecnd.net/MyMvcApp/Content/bootstrap.css<mark>?v=@cdnVersion</mark>&quot; rel=&quot;stylesheet&quot;/&gt;
</pre>

If you change the assembly number as part of every publish cycle, then you can likewise be sure to get a unique version number every time you publish your Web app, which will remain the same until the next publish cycle. Or, you can make Visual Studio automatically increment the assembly version number every time the Web app builds by opening *Properties\AssemblyInfo.cs* in your Visual Studio project and use `*` in `AssemblyVersion`. For example:

	[assembly: AssemblyVersion("1.0.0.*")]

## What about bundled scripts and stylesheets in ASP.NET? ##

With [Azure Websites](/services/websites/) and [Azure Cloud Services](/services/cloud-services/), you get the best Azure CDN integration with [ASP.NET bundling and minification](http://www.asp.net/mvc/tutorials/mvc-4/bundling-and-minification). 

Integrating Azure Websites or Azure Cloud Services with Azure CDN gives you the following advantages:

- Integrate content deployment (images, scripts, and stylesheets) as part of your Azure website's [continuous deployment](web-sites-publish-source-control.md) process
- Easily upgrade your CDN-served NuGet packages, such as jQuery or Bootstrap versions 
- Manage your Web application and your CDN-served content from the same Visual Studio interface

For related tutorials, see:
- [Integrate an Azure Website with Azure CDN](cdn-websites-with-cdn.md)
- [Integrate a cloud service with Azure CDN](cdn-cloud-service-with-cdn.md)

Without integration with Azure Websites or Azure Cloud Services, it is possible to use Azure CDN for your script bundles, with the following caveats:

- You must manually upload the bundled scripts to blob storage. A programmatic solution is proposed at [stackoverflow](http://stackoverflow.com/a/13736433).
- In your .cshtml files, transform the rendered script/CSS tags to use the Azure CDN. For example:

		@Html.Raw(Styles.Render("~/Content/css").ToString().Insert(0, "http://<yourCDNName>.vo.msecnd.net"))

# More Information #
- [Overview of the Azure Content Delivery Network (CDN)](http://msdn.microsoft.com/library/azure/ff919703.aspx)
- [Integrate an Azure Website with Azure CDN](cdn-websites-with-cdn.md)
- [Integrate a cloud service with Azure CDN](cdn-cloud-service-with-cdn.md)
- [How to Map Content Delivery Network (CDN) Content to a Custom Domain](http://msdn.microsoft.com/library/azure/gg680307.aspx)
- [Using CDN for Azure](cdn-how-to-use.md)
