---
title: Local cache
description: Learn how local cache works in Azure App Service, and how to enable, resize, and query the status of your app's local cache.
tags: optional

ms.assetid: e34d405e-c5d4-46ad-9b26-2a1eda86ce80
ms.topic: article
ms.date: 02/28/2025
ms.custom: UpdateFrequency3
ms.author: msangapu
author: msangapu-msft
ai-usage: ai-assisted
ms.collection: ce-skilling-ai-copilot
---
# Azure App Service local cache overview

> [!TIP]
>
> You can also ask Azure Copilot these questions:
>
> - *How does local cache work in app service?*
> - *What are the benefits of using local cache in Azure App Service?*
> - *What are the limitations of using local cache in Azure App Service?*
>
> To find Azure Copilot, on the [Azure portal](https://portal.azure.com) toolbar, select **Copilot**.

> [!NOTE]
> Local cache isn't supported in function apps or containerized App Service apps, such as in [Windows Containers](quickstart-custom-container.md?pivots=container-windows) or in [App Service on Linux](overview.md#app-service-on-linux). A version of local cache available for these app types is [App Cache](https://github.com/Azure-App-Service/KuduLite/wiki/App-Cache).

Azure App Service content is stored on Azure Storage and is exposed as a durable content share. This design is intended to work with various apps and has the following attributes:  

* The content is shared across multiple virtual machine (VM) instances of the app.
* The content is durable and can be modified by running apps.
* Log files and diagnostic data files are available under the same shared content folder.
* Publishing new content directly updates the content folder. You can immediately view the same content through the SCM website and the running app (although some technologies such as ASP.NET may initiate an app restart on certain file changes to load the latest content).

While many apps use one or more of these features, some apps need a high-performance, read-only content store that they can run from with high availability. Such apps can benefit from running against a local cache on the VM instance.

The Azure App Service local cache feature provides a web role view of your content. This content is a write-but-discard cache of your storage content that is created asynchronously at site startup. Once the cache is ready, the site switches to run against the cached content. Apps running with local cache benefit in several ways:

* They are immune to latencies associated with accessing content on Azure Storage.
* They aren’t affected by connection issues to the storage, since the read-only copy is cached locally.
* They experience fewer app restarts due to changes in the storage share.
  
> [!NOTE]
> If you are using Java (Java SE, Tomcat, or JBoss EAP), then by default the Java artifacts—.jar, .war, and .ear files—are copied locally to the worker. If your Java application depends on read-only access to additional files, set `JAVA_COPY_ALL` to `true` so that those files are also copied. If local cache is enabled, it takes precedence over this Java-specific behavior.

## How local cache changes the behavior of App Service

* **D:\home** now points to the local cache, which is created on the VM instance when the app starts. **D:\local** continues to point to the temporary, VM-specific storage.
* The local cache contains a one-time copy of the **/site** and **/siteextensions** folders from the shared content store, located at **D:\home\site** and **D:\home\siteextensions**, respectively. These files are copied to the local cache at app startup. The size of these two folders is limited to 1 GB by default but can be increased to 2 GB. As the cache size increases, it takes longer to load the cache. If you increase the local cache limit to 2 GB and the copied files exceed this maximum size, App Service silently ignores the local cache and reads from the remote file share.
> [!IMPORTANT]
> When the copied files exceed the defined local cache size limit—or when no limit is defined—deployment and swap operations may fail with an error. See the [FAQ](#frequently-asked-questions) for more details.
> 
* The local cache is read-write; however, any modifications are discarded when the app moves between VMs or restarts. Do not use the local cache for storing mission-critical data.
* **D:\home\LogFiles** and **D:\home\Data** contain log files and app data. These folders are stored locally on the VM instance and are periodically copied to the shared content store. While apps can persist log files and data by writing to these folders, the copy process is best-effort. Consequently, log files and data may be lost if a VM instance crashes suddenly.
* [Log streaming](troubleshoot-diagnostic-logs.md#stream-logs) is impacted by this best-effort copy, and you might observe up to a one-minute delay in streamed logs.
* In the shared content store, the folder structure for **LogFiles** and **Data** changes for apps using local cache. There are now subfolders with names following the pattern "unique identifier" + timestamp, each corresponding to a VM instance where the app is or has been running.
* Other folders in **D:\home** remain in the local cache and aren’t copied to the shared content store.
* App deployments via any supported method publish directly to the durable shared content store. To refresh the **D:\home\site** and **D:\home\siteextensions** folders in the local cache, the app must be restarted. For a seamless lifecycle, see the information later in this article.
* The default content view of the SCM site continues to reflect the shared content store.

## Enable local cache in App Service 

> [!NOTE]
> Local cache isn't supported in the **F1** or **D1** tiers.

Local cache is configured using a combination of reserved app settings. You can set these app settings using one of the following methods:

* [Azure portal](#Configure-Local-Cache-Portal)
* [Azure Resource Manager](#Configure-Local-Cache-ARM)

### Configure local cache using the Azure portal
<a name="Configure-Local-Cache-Portal"></a>

Enable local cache on a per-web-app basis by adding this app setting:
`WEBSITE_LOCAL_CACHE_OPTION` = `Always`  

### Configure local cache using Azure Resource Manager
<a name="Configure-Local-Cache-ARM"></a>

```jsonc
{
    "apiVersion": "2015-08-01",
    "type": "config",
    "name": "appsettings",
    "dependsOn": [
        "[resourceId('Microsoft.Web/sites/', variables('siteName'))]"
    ],

    "properties": {
        "WEBSITE_LOCAL_CACHE_OPTION": "Always",
        "WEBSITE_LOCAL_CACHE_SIZEINMB": "1000"
    }
}

```


## Change the size setting in local cache

By default, the local cache size is **1 GB**. This size includes the **/site** and **/siteextensions** folders copied from the content store, as well as any locally generated logs and data folders. To increase this limit, use the app setting `WEBSITE_LOCAL_CACHE_SIZEINMB`. You can increase the size up to **2 GB** (2000 MB) per app. Note that a larger cache size results in a longer cache load time.

## Best practices for using App Service local cache

We recommend using local cache in conjunction with the [Staging Environments](../app-service/deploy-staging-slots.md) feature.

* Add the sticky app setting `WEBSITE_LOCAL_CACHE_OPTION` with the value `Always` to your **Production** slot. If you're using `WEBSITE_LOCAL_CACHE_SIZEINMB`, mark it as a sticky setting for the Production slot as well.
* Create a **Staging** slot and publish to it. Typically, you do not set the Staging slot to use local cache, which helps enable a seamless build-deploy-test lifecycle while still providing local cache benefits for the Production slot.
* Test your site in the Staging slot.
* When ready, perform a [swap operation](../app-service/deploy-staging-slots.md#Swap) between the Staging and Production slots.
* Sticky settings are tied to the slot. Thus, when the Staging slot is swapped into Production, it inherits the local cache app settings. The newly swapped Production slot will run against the local cache after a few minutes and will be warmed up during slot warmup. Once the swap is complete, your Production slot will be running against the local cache.

## Frequently Asked Questions

### What if the local cache size limit is exceeded?
If the copied files exceed the local cache size limit, the app will revert to reading from the remote share. However, deployment and swap operations may then fail with an error. See the table below for details.

| **local cache Size** | **Copied Files**         | **Result**                                                                                          |
| -------------------- | ------------------------ | --------------------------------------------------------------------------------------------------- |
| ≤ 2 GB               | ≤ local cache size       | Reads from local cache.                                                                             |
| ≤ 2 GB               | > local cache size       | Reads from remote share.<br/> **Note:** Deployment and swap operations may fail with an error.       |

### How can I tell if local cache applies to my app?
If your app requires a high-performance, reliable content store, does not use the content store for writing critical data at runtime, and the total size is less than 2 GB, then local cache is a good fit. To check the total size of your **/site** and **/siteextensions** folders, you can use the site extension "Azure Web Apps Disk Usage."

### How can I tell if my site has switched to using local cache?
When using local cache with Staging Environments, the swap operation won’t complete until the local cache is warmed up. To verify that your site is running against local cache, check the worker process environment variable `WEBSITE_LOCALCACHE_READY`. Refer to the instructions on the [worker process environment variable](https://github.com/projectkudu/kudu/wiki/Process-Threads-list-and-minidump-gcdump-diagsession#process-environment-variable) page to inspect this variable across multiple instances.

### I published new changes, but my app doesn’t reflect them. Why?
If your app uses local cache, you must restart the site to load the latest changes. If you prefer not to publish changes directly to your production site, consider using deployment slots as described in the best practices section above.

> [!NOTE]
> The [run from package](deploy-run-package.md) deployment option isn’t compatible with local cache.

### Where are my logs?
When using local cache, the structure of your log and data folders changes slightly. The subfolders are now nested under a folder named with the "unique VM identifier" and timestamp, corresponding to the VM instance where the app is or has been running.

### My app still gets restarted even with local cache enabled. Why?
local cache helps prevent storage-related app restarts; however, your app may still restart during planned infrastructure upgrades on the VM. Overall, you should observe fewer restarts with local cache enabled.

### Does local cache exclude any directories from being copied to the faster local drive?
During the copy process, any folder named **repository** is excluded. This is useful in scenarios where your site content includes a source control repository that isn’t needed for day-to-day operations.

### How do I flush the local cache logs after a site management operation?
To flush the local cache logs, stop and restart the app. This action clears the previous cache.

### Why does App Service show previously deployed files after a restart when local cache is enabled?
If previously deployed files reappear after a restart, check for the presence of the App Setting `[WEBSITE_DISABLE_SCM_SEPARATION=true](https://github.com/projectkudu/kudu/wiki/Configurable-settings#use-the-same-process-for-the-user-site-and-the-scm-site)`. Adding this setting causes deployments via KUDU to write to the local VM instead of persistent storage. To avoid this, follow the best practices above and perform deployments to a staging slot that does not have local cache enabled.

## More resources

[Environment variables and app settings reference](reference-app-settings.md)
