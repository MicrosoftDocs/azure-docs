<properties
   pageTitle="Azure App Service Local Cache Overview"
   description="This article describes how to enable, resize and query the status of the Azure App Service Local Cache feature"
   services="app-service"
   documentationCenter="app-service"
   authors="SyntaxC4"
   manager="yochayk"
   editor=""
   tags="optional"
   keywords="For use by SEO champs only. Separate terms with commas. Check with your SEO champ before you change content in this article containing these terms."/>

<tags
   ms.service="app-service"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="03/04/2016"
   ms.author="cfowler"/>

# Azure App Service Local Cache Overview

Azure web applications' content is stored on Azure Storage and surfaced up in a durable manner as a content share. This design is intended to work with a variety of applications and has the following attributes:  

* The content is shared across multiple VM instances of the web application. 
* Content is durable and can be modified by running web applications. 
* Log files and diagnostic data files are available under the same shared content folder. 
* Publishing new content directly updates the content folder and the same can be viewed through the SCM web site and the running web app immediately (typically some technologies such as ASP.NET do initiate a web application restart on some file changes to pick the latest content). 

While many web applications use one or all of these features, some web applications just want a high performant read only content store from which they can run with high availability. These applications can benefit from a VM instance specific copy of the content hereby referred to as "Local Cache". _Local Cache_ provides a web role view of your content and this content is a write-but-discard cache of your storage content that is created asynchronously on site startup. When the cache is ready, the site is switched to run against the cached content. 
Web applications running on Local Cache enjoy the following benefits: 

* They are immune to latencies experienced when accessing content on Azure storage 
* They are immune to the servers serving the content share undergoing planned upgrades or unplanned downtimes and any other disruptions with Azure Storage. 
* Fewer app restarts due to storage share changes. 

## How Does Local Cache Change the behaviour of App Service

* The local cache is a copy of the /site and /siteextensions folders of the web application and is created on the local VM instance on web application startup. The size of the local cache per web application is limited to 300 MB by default but can be increased up to 1 GB. 
* The local cache is read-write however any modifications will be discarded when the web application moves virtual machines or gets restarted. The local cache should not be used for applications that persist mission critical data in the content store. 
* Web applications can continue to write log files and diagnostic data as they do currently. Log files and data however are stored locally on the VM and are then copied over periodically to the shared content store. The copy over to the shared content store is a best case effort and write backs could be lost due to a sudden crash of a VM instance. 
* There is a change in the folder structure of the LogFiles and Data folders for web apps that use Local Cache.  There are now sub-folders in the storage "LogFiles" and "Data" folders following the naming pattern of "unique identifier" + timestamp. Each of the sub folders correspond to a VM instance where the web application is running or has run on.  
* Publishing changes to the web application through any of the publishing mechanisms will publish to the shared content store. This is by design as we want the published content to be durable. To refresh the local cache of the web application, it needs to be restarted. Seems like an excessive step? See below to make the lifecycle seamless.
* D:\Home will point to Local Cache. D:\local will continue pointing to the temporary VM specific storage. 
* The default content view of the SCM site will continue to be that of the shared content store. To look at what your local cache folder looks like you can navigate to https://[site-name].scm.azurewebsites.net/VFS/LocalSiteRoot/LocalCache

## How to Enable Local Cache in Azure App Service

Local Cache is configured using a combination of reserved App Settings. These App Settings can be configured using the following methods:

* [Azure Portal](#Configure-Local-Cache-Portal)
* [Azure Resource Manager](#Configure-Local-Cache-ARM)

### How to: Configure Local Cache using the Azure Portal
<a name="Configure-Local-Cache-Portal"></a>

Local Cache is enabled on a per web application basis by using an AppSetting. `WEBSITE_LOCAL_CACHE_OPTION` = `Always`  

![Azure Portal App Settings: Local Cache](media/app-service-local-cache/app-service-local-cache-configure-portal.png)

### How to: Configure Local Cache using Azure Resource Manager
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

## How to Change the Size of App Service Local Cache?

By default local cache size is **300 MB**. This includes the Site, SiteExtensions folders that are copied from content store as well as any locally created logs and data folders. To increase this limit use the AppSetting `WEBSITE_LOCAL_CACHE_SIZEINMB`. The size can be increased up to **1 GB** (1000 MB) per web application.

## Best Practices for using App Service Local Cache

It is recommended that Local Cache is used in conjunction with the [Staging Environments](../app-service-web/web-sites-staged-publishing.md) feature.

* Add a _sticky_ Appsetting `WEBSITE_LOCAL_CACHE_OPTION` with value `Always` to your **Production slot**. If using `WEBSITE_LOCAL_CACHE_SIZEINMB`, also add it as a sticky setting to your production  slot. 
* Create a Staging slot and publish to your Staging slot.  The staging slot typically does not use local cache to enable a seamless build-deploy-test lifecycle for staging while getting the benefits of Local Cache for the production slot. 
*	Test your site against your Staging slot.  
*	Once you are ready, issue a [swap operation](../app-service-web/web-sites-staged-publishing.md#to-swap-deployment-slots) between your **Staging** and **Production** slots.  
*	Sticky settings are by name and sticky to a slot. So when the Staging slot gets swapped into Production, it will inherit the Local Cache App settings. The newly swapped Production slot will run against the Local Cache after a few minutes and will be warmed up as part of slot warmup after swap. So when slot swap is complete, your production slot will be running against Local Cache.

## Frequently Asked Questions

### How can I tell if Local Cache applicable for my web application? 

If your web application need high performant, reliable content store and does not use the content store to write critical data at runtime and is <1 GB in total size- then the answer is Yes! To get the total size of your "site" and "site extensions" folders you can use the site extension "Azure Web Apps Disk Usage".  
 
### How do I enable Local Cache? 

See above section on Best Practices when using Local Cache. 
 
### How can I tell if my site has switched to using local cache? 

If using the Local Cache feature with Staging Environments, the swap operation will not complete till Local Cache is warmed up. To check if your site is running against local cache, you can check the worker process environment variable `WEBSITE_LOCALCACHE_READY`. Use the instructions here to access the worker process environment variable on multiple instances.  
 
### I just published new changes- but my web application does not seem to have them. Why? 
If your web application uses Local Cache, then you need to restart your site to get the latest changes. Don’t want to that to a production site? See slot options above. 
 
### Where are my logs? 

With local cache, your logs and data folders do look a little different. However, the structure of your sub folders remain the same except that they are nestled under a sub folder of the format "unique VM identifier" + timestamp. 
 
### I have Local Cache enabled but my web application still gets restarted. Why is that? I thought Local Cache helped with frequent app restarts. 

Local Cache does help prevent storage related web application restarts. However, your web application could still undergo restarts during planned infrastructure upgrades of the VM. The overall app restarts experienced with Local Cache enabled should be fewer.
