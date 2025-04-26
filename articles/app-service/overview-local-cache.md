---
title: Local Cache
description: Learn how a local cache works in Azure App Service, and how to enable, resize, and query the status of your app's local cache.
tags: optional

ms.assetid: e34d405e-c5d4-46ad-9b26-2a1eda86ce80
ms.topic: conceptual
ms.date: 04/17/2025
ms.custom: UpdateFrequency3
ms.author: msangapu
author: msangapu-msft
ai-usage: ai-assisted
ms.collection: ce-skilling-ai-copilot
---
# Local cache in Azure App Service

> [!TIP]
>
> You can also ask Microsoft Copilot in Azure these questions:
>
> - *How does a local cache work in Azure App Service?*
> - *What are the benefits of using a local cache in Azure App Service?*
> - *What are the limitations of using a local cache in Azure App Service?*
>
> To find Copilot in Azure, on the [Azure portal](https://portal.azure.com) toolbar, select **Copilot**.

Azure App Service content is stored in Azure Storage and is exposed as a durable content share. This design works with various apps and has the following attributes:  

- The content is shared across multiple virtual machine (VM) instances of the app.
- The content is durable, and running apps can modify it.
- Log files and diagnostic data files are available under the same shared content folder.
- Publishing new content directly updates the content folder. You can immediately view the same content through the Source Control Manager (SCM, also known as Kudu) website and the running app. However, some technologies (such as ASP.NET) might initiate an app restart on certain file changes to load the latest content.

Although many apps use one or more of these features, some apps need a high-performance, read-only content store that they can run from with high availability. Such apps can benefit from running against a local cache on the VM instance.

The local cache feature in Azure App Service provides a web role view of your content. This content is a write-but-discard cache of your storage content that's created asynchronously at site startup. When the cache is ready, the site switches to run against the cached content.

Apps running with a local cache benefit in these ways:

- They're immune to latencies associated with accessing content in Azure Storage.
- Problems with connecting to the storage don't affect them, because the read-only copy is cached locally.
- They experience fewer app restarts from changes in the storage share.

> [!NOTE]
> The local cache feature isn't supported in function apps or containerized App Service apps, such as in [Windows containers](quickstart-custom-container.md?pivots=container-windows) or in built-in or custom Linux containers. A version of the feature that's available for these app types is [App Cache](https://github.com/Azure-App-Service/KuduLite/wiki/App-Cache).
>
> The local cache feature also isn't supported in the F1 and D1 pricing tiers of App Service.
  
## How a local cache changes the behavior of App Service

Configuring a local cache causes these changes:

- `D:\home` now points to the local cache, which is created on the VM instance when the app starts. `D:\local` continues to point to the temporary, VM-specific storage.

- The local cache contains a one-time copy of the `/site` and `/siteextensions` folders from the shared content store. These folders are located at `D:\home\site` and `D:\home\siteextensions`, respectively. These files are copied to the local cache at app startup.

  The size of these two folders is limited to 1 GB by default, but you can increase it to 2 GB. As the cache size increases, it takes longer to load the cache. If you increase the local cache limit to 2 GB and the copied files exceed this maximum size, App Service silently ignores the local cache and reads from the remote file share.
  
  > [!IMPORTANT]
  > When the copied files exceed the defined size limit for the local cache, or when no limit is defined, deployment and swap operations might fail with an error. For details, see the [FAQ about size limits](#what-if-i-exceed-the-size-limit-for-the-local-cache) later in this article.

- The local cache is read/write. However, any modifications are discarded when the app moves between VMs or restarts. Don't use the local cache for storing mission-critical data.

- `D:\home\LogFiles` and `D:\home\Data` contain log files and app data. These folders are stored locally on the VM instance and are periodically copied to the shared content store. Although apps can persist log files and data by writing to these folders, the copy process is best-effort. Log files and data might be lost if a VM instance suddenly stops responding.
- The best-effort copy affects [log streaming](troubleshoot-diagnostic-logs.md#stream-logs). You might observe up to a one-minute delay in streamed logs.
- In the shared content store, the folder structure for `LogFiles` and `Data` changes for apps that use a local cache. There are now subfolders with names that consist of a unique identifier and a time stamp. Each subfolder corresponds to a VM instance where the app is or was running.
- Other folders in `D:\home` remain in the local cache and aren't copied to the shared content store.
- App deployments via any supported method publish directly to the durable shared content store. To refresh the `D:\home\site` and `D:\home\siteextensions` folders in the local cache, you must restart the app. For a seamless life cycle, see the [section about best practices](#best-practices-for-using-app-service-local-cache) later in this article.
- The default content view of the SCM site continues to reflect the shared content store.

> [!NOTE]
> If you're using Java (Java SE, Tomcat, or JBoss EAP), then by default, the Java artifacts (.jar, .war, and .ear files) are copied locally to the worker. If your Java application depends on read-only access to additional files, set `JAVA_COPY_ALL` to `true` so that those files are also copied. If a local cache is enabled, it takes precedence over this Java-specific behavior.

## Methods for enabling a local cache

You configure a local cache by using a combination of reserved app settings. You can set these app settings by using one of the following methods.

### Configure a local cache by using the Azure portal
<a name="Configure-Local-Cache-Portal"></a>

Enable a local cache on a per-web-app basis by adding this app setting:
`WEBSITE_LOCAL_CACHE_OPTION` = `Always`.

### Configure a local cache by using Azure Resource Manager
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

## Changing the size setting in a local cache

By default, the local cache size is 1 GB. This size includes the `/site` and `/siteextensions` folders copied from the content store. It also includes any locally generated logs and data folders.

To increase this limit, use the app setting `WEBSITE_LOCAL_CACHE_SIZEINMB`. You can increase the size up to 2 GB (2,000 MB) per app. Keep in mind that a larger cache size increases the time to load the cache.

## <a name = "best-practices-for-using-app-service-local-cache"></a> Best practices for using a local cache

We recommend using a local cache in conjunction with the [staging environments](../app-service/deploy-staging-slots.md) feature.

The following process represents the best practices for using a local cache:

1. Add the sticky app setting `WEBSITE_LOCAL_CACHE_OPTION` with the value `Always` to your *production* slot. If you're using `WEBSITE_LOCAL_CACHE_SIZEINMB`, also mark that setting as a sticky setting for the production slot.

1. Create a *staging* slot and publish to it. Typically, you don't set the staging slot to use a local cache, which helps enable a seamless build/deploy/test life cycle while still providing local cache benefits for the production slot.

1. Test your site in the staging slot.

1. When you're ready, perform a [swap operation](../app-service/deploy-staging-slots.md#Swap) between the staging and production slots.

Sticky settings are tied to the slot. When the staging slot is swapped into production, it inherits the local cache's app settings. The newly swapped production slot runs against the local cache after a few minutes and is warmed up during slot warmup. After the swap is complete, your production slot runs against the local cache.

## Frequently asked questions

### What if I exceed the size limit for the local cache?

If the copied files exceed the size limit for the local cache, the app reverts to reading from the remote share. The following table shows the details.

| Local cache size | Copied files         | Result                                                                                          |
| -------------------- | ------------------------ | --------------------------------------------------------------------------------------------------- |
| ≤ 2 GB               | ≤ local cache size       | Reads from the local cache.                                                                             |
| ≤ 2 GB               | > local cache size       | Reads from the remote share.<br/><br/> Deployment and swap operations might fail with an error.       |

### How can I tell if my app can benefit from a local cache?

A local cache is a good fit if all these conditions apply:

- Your app requires a high-performance, reliable content store.
- Your app doesn't use the content store for writing critical data at runtime.
- The total size is less than 2 GB.

To check the total size of your `/site` and `/siteextensions` folders, you can use the site extension **Azure Web Apps Disk Usage**.

### How can I tell if my site switched to using a local cache?

When you're using a local cache with staging environments, the swap operation doesn't finish until the local cache is warmed up. To verify that your site is running against the local cache, check the worker process environment variable `WEBSITE_LOCALCACHE_READY`. To inspect this variable across multiple instances, refer to the [Kudu instructions for the worker process environment variable](https://github.com/projectkudu/kudu/wiki/Process-Threads-list-and-minidump-gcdump-diagsession#process-environment-variable).

### Why doesn't my app reflect newly published changes?

If your app uses a local cache, you must restart the site to load the latest changes. If you prefer not to publish changes directly to your production site, consider using deployment slots as described in the [earlier section about best practices](#best-practices-for-using-app-service-local-cache).

> [!NOTE]
> The [run from package](deploy-run-package.md) deployment option isn't compatible with the local cache feature.

### Where are my logs?

When you're using a local cache, the structure of your log and data folders changes slightly. The subfolders are now nested under a folder that's named with the unique VM identifier and a time stamp. Each of these folders corresponds to the VM instance where the app is or was running.

### Why does my app still restart with a local cache enabled?

A local cache helps prevent storage-related app restarts. However, your app might still restart during planned infrastructure upgrades on the VM. Overall, you should observe fewer restarts with a local cache enabled.

### Does a local cache exclude any directories from being copied to the faster local drive?

During the copy process, any folder named `repository` is excluded. This behavior is useful in scenarios where your site content includes a source control repository that you don't need for day-to-day operations.

### How do I flush the local cache logs after a site management operation?

To flush the local cache logs, stop and restart the app. This action clears the previous cache.

### Why does App Service show previously deployed files after a restart when a local cache is enabled?

If previously deployed files reappear after a restart, check for the presence of the app setting [`WEBSITE_DISABLE_SCM_SEPARATION=true`](https://github.com/projectkudu/kudu/wiki/Configurable-settings#use-the-same-process-for-the-user-site-and-the-scm-site). Adding this setting causes deployments via Kudu to write to the local VM instead of persistent storage. To avoid this situation, follow the [best practices mentioned earlier](#best-practices-for-using-app-service-local-cache) and perform deployments to a staging slot that doesn't have a local cache enabled.

## Related content

- [Environment variables and app settings in Azure App Service](reference-app-settings.md)
