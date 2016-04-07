<properties
   pageTitle="Azure App Service Local Cache overview | Microsoft Azure"
   description="This article describes how to enable, resize, and query the status of the Azure App Service Local Cache feature"
   services="app-service"
   documentationCenter="app-service"
   authors="SyntaxC4"
   manager="yochayk"
   editor=""
   tags="optional"
   keywords=""/>

<tags
   ms.service="app-service"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="03/04/2016"
   ms.author="cfowler"/>

# Azure App Service Local Cache overview

Azure web app content is stored on Azure Storage and is surfaced up in a durable manner as a content share. This design is intended to work with a variety of apps and has the following attributes:  

* The content is shared across multiple virtual machine (VM) instances of the web app.
* The content is durable and can be modified by running web apps.
* Log files and diagnostic data files are available under the same shared content folder.
* Publishing new content directly updates the content folder. You can immediately view the same content through the SCM website and the running web app (typically some technologies such as ASP.NET do initiate a web app restart on some file changes to get the latest content).

While many web apps use one or all of these features, some web apps just need a high-performance, read-only content store that they can run from with high availability. These apps can benefit from a VM instance of a specific local cache.

The Azure App Service Local Cache feature provides a web role view of your content. This content is a write-but-discard cache of your storage content that is created asynchronously on site startup. When the cache is ready, the site is switched to run against the cached content. Web apps that run on Local Cache have the following benefits:

* They are immune to latencies that occur when they access content on Azure Storage.
* They are immune to the planned upgrades or unplanned downtimes and any other disruptions with Azure Storage that occur on servers that serve the content share.
* They have fewer app restarts due to storage share changes.

## How Local Cache changes the behavior of App Service

* The local cache is a copy of the /site and /siteextensions folders of the web app. It is created on the local VM instance on web app startup. The size of the local cache per web app is limited to 300 MB by default, but you can increase it up to 1 GB.
* The local cache is read-write. However, any modifications will be discarded when the web app moves virtual machines or gets restarted. You should not use Local Cache for apps that store mission-critical data in the content store.
* Web apps can continue to write log files and diagnostic data as they do currently. Log files and data, however, are stored locally on the VM. Then they are copied over periodically to the shared content store. The copy to the shared content store is a best-case effort--write backs could be lost due to a sudden crash of a VM instance.
* There is a change in the folder structure of the LogFiles and Data folders for web apps that use Local Cache. There are now subfolders in the storage LogFiles and Data folders that follow the naming pattern of "unique identifier" + time stamp. Each of the subfolders corresponds to a VM instance where the web app is running or has run.  
* Publishing changes to the web app through any of the publishing mechanisms will publish to the shared content store. This is by design because we want the published content to be durable. To refresh the local cache of the web app, it needs to be restarted. Does this seem like an excessive step? To make the lifecycle seamless, see the information later in this article.
* D:\Home will point to the local cache. D:\local will continue pointing to the temporary VM specific storage.
* The default content view of the SCM site will continue to be that of the shared content store.

## Enable Local Cache in App Service

You configure Local Cache by using a combination of reserved app settings. You can configure these app settings by using the following methods:

* [Azure portal](#Configure-Local-Cache-Portal)
* [Azure Resource Manager](#Configure-Local-Cache-ARM)

### Configure Local Cache by using the Azure portal
<a name="Configure-Local-Cache-Portal"></a>

You enable Local Cache on a per-web-app basis by using this app setting:
`WEBSITE_LOCAL_CACHE_OPTION` = `Always`  

![Azure portal app settings: Local Cache](media/app-service-local-cache/app-service-local-cache-configure-portal.png)

### Configure Local Cache by using Azure Resource Manager
<a name="Configure-Local-Cache-ARM"></a>

```
...

{
    "apiVersion": "2015-08-01",
    "type": "config",
    "name": "appsettings",
    "dependsOn": [
        "[resourceId('Microsoft.Web/sites/', variables('siteName'))]"
    ],
    "properties": {
        "WEBSITE_LOCAL_CACHE_OPTION": "Always",
        "WEBSITE_LOCAL_CACHE_SIZEINMB": "300"
    }
}

...
```

## Change the size setting in Local Cache

By default, the local cache size is **300 MB**. This includes the /site and /siteextensions folders that are copied from the content store, as well as any locally created logs and data folders. To increase this limit, use the app setting `WEBSITE_LOCAL_CACHE_SIZEINMB`. You can increase the size up to **1 GB** (1000 MB) per web app.

## Best practices for using App Service Local Cache

We recommend that you use Local Cache in conjunction with the [Staging Environments](../app-service-web/web-sites-staged-publishing.md) feature.

* Add the _sticky_ app setting `WEBSITE_LOCAL_CACHE_OPTION` with the value `Always` to your **Production** slot. If you're using `WEBSITE_LOCAL_CACHE_SIZEINMB`, also add it as a sticky setting to your Production slot.
* Create a **Staging** slot and publish to your Staging slot. You typically don't set the staging slot to use Local Cache to enable a seamless build-deploy-test lifecycle for staging if you get the benefits of Local Cache for the production slot.
*	Test your site against your Staging slot.  
*	When you are ready, issue a [swap operation](../app-service-web/web-sites-staged-publishing.md#to-swap-deployment-slots) between your Staging and Production slots.  
*	Sticky settings include name and sticky to a slot. So when the Staging slot gets swapped into Production, it will inherit the Local Cache app settings. The newly swapped Production slot will run against the local cache after a few minutes and will be warmed up as part of slot warmup after swap. So when the slot swap is complete, your Production slot will be running against the local cache.

## Frequently asked questions (FAQ)

### How can I tell if Local Cache applies to my web app?

If your web app needs a high-performance, reliable content store, does not use the content store to write critical data at runtime, and is less than 1 GB in total size, then the answer is "yes"! To get the total size of your /site and /siteextensions folders, you can use the site extension "Azure Web Apps Disk Usage".  

### How can I tell if my site has switched to using Local Cache?

If you're using the Local Cache feature with Staging Environments, the swap operation will not complete until Local Cache is warmed up. To check if your site is running against Local Cache, you can check the worker process environment variable `WEBSITE_LOCALCACHE_READY`. Use the instructions on the [worker process environment variable](https://github.com/projectkudu/kudu/wiki/Process-Threads-list-and-minidump-gcdump-diagsession#process-environment-variable) page to access the worker process environment variable on multiple instances.  

### I just published new changes, but my web app does not seem to have them. Why?

If your web app uses Local Cache, then you need to restart your site to get the latest changes. Don’t want to publish changes to a production site? See the slot options in the previous best practices section.

### Where are my logs?

With Local Cache, your logs and data folders do look a little different. However, the structure of your subfolders remains the same, except that the subfolders are nestled under a subfolder with the format "unique VM identifier" + time stamp.

### I have Local Cache enabled, but my web app still gets restarted. Why is that? I thought Local Cache helped with frequent app restarts.

Local Cache does help prevent storage-related web app restarts. However, your web app could still undergo restarts during planned infrastructure upgrades of the VM. The overall app restarts that you experience with Local Cache enabled should be fewer.
