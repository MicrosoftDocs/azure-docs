---
title: Manage and update Azure HPC Cache
description: How to manage and update Azure HPC Cache using the Azure portal or Azure CLI
author: ekpgh
ms.service: hpc-cache
ms.topic: how-to
ms.date: 03/08/2021
ms.author: v-erkel
---

# Manage your cache

The cache overview page in the Azure portal shows project details, cache status, and basic statistics for your cache. It also has controls to stop or start the cache, delete the cache, flush data to long-term storage, and update software.

This article also explains how to do these basic tasks with the Azure CLI.

To open the overview page, select your cache resource in the Azure portal. For example, load the **All resources** page and click the cache name.

![screenshot of an Azure HPC Cache instance's Overview page](media/hpc-cache-overview.png)

The buttons at the top of the page can help you manage the cache:

* **Start** and [**Stop**](#stop-the-cache) - Resumes or suspends cache operation
* [**Flush**](#flush-cached-data) - Writes changed data to storage targets
* [**Upgrade**](#upgrade-cache-software) - Updates the cache software
* [**Collect diagnostics**](#collect-diagnostics) - Uploads debugging information
* **Refresh** - Reloads the overview page
* [**Delete**](#delete-the-cache) - Permanently destroys the cache

Read more about these options below.

Click the image below to watch a [video](https://azure.microsoft.com/resources/videos/managing-hpc-cache/) that demonstrates cache management tasks.

[![video thumbnail: Azure HPC Cache: Manage (click to visit the video page)](media/video-5-manage.png)](https://azure.microsoft.com/resources/videos/managing-hpc-cache/)

## Stop the cache

You can stop the cache to reduce costs during an inactive period. You are not charged for uptime while the cache is stopped, but you are charged for the cache's allocated disk storage. (See the [pricing](https://aka.ms/hpc-cache-pricing) page for details.)

A stopped cache does not respond to client requests. You should unmount clients before stopping the cache.

### [Portal](#tab/azure-portal)

The **Stop** button suspends an active cache. The **Stop** button is available when a cache's status is **Healthy** or **Degraded**.

![screenshot of the top buttons with Stop highlighted and a pop-up message describing the stop action and asking 'do you want to continue?' with Yes (default) and No buttons](media/stop-cache.png)

After you click Yes to confirm stopping the cache, the cache automatically flushes its contents to the storage targets. This process might take some time, but it ensures data consistency. Finally, the cache status changes to **Stopped**.

To reactivate a stopped cache, click the **Start** button. No confirmation is needed.

![screenshot of the top buttons with Start highlighted](media/start-cache.png)

### [Azure CLI](#tab/azure-cli)

[Set up Azure CLI for Azure HPC Cache](./az-cli-prerequisites.md).

Temporarily suspend a cache with the [az hpc-cache stop](/cli/azure/hpc-cache#az_hpc_cache_stop) command. This action is only valid when a cache's status is **Healthy** or **Degraded**.

The cache automatically flushes its contents to the storage targets before stopping. This process might take some time, but it ensures data consistency.

When the action is complete, the cache status changes to **Stopped**.

Reactivate a stopped cache with [az hpc-cache start](/cli/azure/hpc-cache#az_hpc_cache_start).

When you issue the start or stop command, the command line shows a "Running" status message until the operation completes.

```azurecli
$ az hpc-cache start --name doc-cache0629
 - Running ..
```

At completion, the message updates to "Finished" and shows return codes and other information.

```azurecli
$ az hpc-cache start --name doc-cache0629
{- Finished ..
  "endTime": "2020-07-01T18:46:43.6862478+00:00",
  "name": "c48d320f-f5f5-40ab-8b25-0ac065984f62",
  "properties": {
    "output": "success"
  },
  "startTime": "2020-07-01T18:40:28.5468983+00:00",
  "status": "Succeeded"
}
```

---

## Flush cached data

The **Flush** button on the overview page tells the cache to immediately write all changed data that is stored in the cache to the back-end storage targets. The cache routinely saves data to the storage targets, so it's not necessary to do this manually unless you want to make sure the back-end storage system is up to date. For example, you might use **Flush** before taking a storage snapshot or checking the data set size.

> [!NOTE]
> During the flush process, the cache can't serve client requests. Cache access is suspended and resumes after the operation finishes.

When you start the cache flush operation, the cache stops accepting client requests, and the cache status on the overview page changes to **Flushing**.

Data in the cache is saved to the appropriate storage targets. Depending on how much data needs to be flushed, the process can take a few minutes or over an hour.

After all the data is saved to storage targets, the cache automatically starts taking client requests again. The cache status returns to **Healthy**.

### [Portal](#tab/azure-portal)

To flush the cache, click the **Flush** button and then click **Yes** to confirm the action.

![screenshot of the top buttons with Flush highlighted and a pop-up message describing the flush action and asking 'do you want to continue?' with Yes (default) and No buttons](media/hpc-cache-flush.png)

### [Azure CLI](#tab/azure-cli)

[Set up Azure CLI for Azure HPC Cache](./az-cli-prerequisites.md).

Use [az hpc-cache flush](/cli/azure/hpc-cache#az_hpc_cache_flush) to force the cache to write all changed data to the storage targets.

Example:

```azurecli
$ az hpc-cache flush --name doc-cache0629 --resource-group doc-rg
 - Running ..
```

When the flush finishes, a success message is returned.

```azurecli
{- Finished ..
  "endTime": "2020-07-09T17:26:13.9371983+00:00",
  "name": "c22f8e12-fcf0-49e5-b897-6a6e579b6489",
  "properties": {
    "output": "success"
  },
  "startTime": "2020-07-09T17:25:21.4278297+00:00",
  "status": "Succeeded"
}
$
```

---

## Upgrade cache software

If a new software version is available, the **Upgrade** button becomes active. You also should see a message at the top of the page about updating software.

![screenshot of the top row of buttons with the Upgrade button enabled](media/hpc-cache-upgrade-button.png)

Client access is not interrupted during a software upgrade, but cache performance slows. Plan to upgrade software during non-peak usage hours or in a planned maintenance period.

The software update can take several hours. Caches configured with higher throughput take longer to upgrade than caches with smaller peak throughput values.

When a software upgrade is available, you will have a week or so to apply it manually. The end date is listed in the upgrade message. If you don't upgrade during that time, Azure automatically applies the update to your cache. The timing of the automatic upgrade is not configurable. If you are concerned about the cache performance impact, you should upgrade the software yourself before the time period expires.

If your cache is stopped when the end date passes, the cache will automatically upgrade software the next time it is started. (The update might not start immediately, but it will start in the first hour.)

### [Portal](#tab/azure-portal)

Click the **Upgrade** button to begin the software update. The cache status changes to **Upgrading** until the operation completes.

### [Azure CLI](#tab/azure-cli)

[Set up Azure CLI for Azure HPC Cache](./az-cli-prerequisites.md).

On the Azure CLI, new software information is included at the end of the cache status report. (Use [az hpc-cache show](/cli/azure/hpc-cache#az_hpc_cache_show) to check.) Look for the string "upgradeStatus" in the message.

Use [az hpc-cache upgrade-firmware](/cli/azure/hpc-cache#az_hpc_cache_upgrade-firmware) to apply the update, if any exists.

If no update is available, this operation has no effect.

This example shows the cache status (no update is available) and the results of the upgrade-firmware command.

```azurecli
$ az hpc-cache show --name doc-cache0629
{
  "cacheSizeGb": 3072,
  "health": {
    "state": "Healthy",
    "statusDescription": "The cache is in Running state"
  },

<...>

  "tags": null,
  "type": "Microsoft.StorageCache/caches",
  "upgradeStatus": {
    "currentFirmwareVersion": "5.3.61",
    "firmwareUpdateDeadline": "0001-01-01T00:00:00+00:00",
    "firmwareUpdateStatus": "unavailable",
    "lastFirmwareUpdate": "2020-06-29T22:18:32.004822+00:00",
    "pendingFirmwareVersion": null
  }
}
$ az hpc-cache upgrade-firmware --name doc-cache0629
$
```

---

## Collect diagnostics

The **Collect diagnostics** button manually starts the process to collect system information and upload it to Microsoft Service and Support for troubleshooting. Your cache automatically collects and uploads the same diagnostic information if a serious cache problem occurs.

Use this control if Microsoft Service and Support requests it.

After clicking the button, click **Yes** to confirm the upload.

![screenshot of the 'Start diagnostics collection' pop-up confirmation message. The default button 'yes' is highlighted.](media/diagnostics-confirm.png)

## Delete the cache

The **Delete** button destroys the cache. When you delete a cache, all of its resources are destroyed and no longer incur account charges.

The back-end storage volumes used as storage targets are unaffected when you delete the cache. You can add them to a future cache later, or decommission them separately.

> [!NOTE]
> Azure HPC Cache does not automatically write changed data from the cache to the back-end storage systems before deleting the cache.
>
> To make sure that all data in the cache has been written to long-term storage, [stop the cache](#stop-the-cache) before you delete it. Make sure that it shows the status **Stopped** before deleting.

### [Portal](#tab/azure-portal)

After stopping the cache, click the **Delete** button to permanently remove the cache.

### [Azure CLI](#tab/azure-cli)

[Set up Azure CLI for Azure HPC Cache](./az-cli-prerequisites.md).

Use the Azure CLI command [az hpc-cache delete](/cli/azure/hpc-cache#az_hpc_cache_delete) to permanently remove the cache.

Example:
```azurecli
$ az hpc-cache delete --name doc-cache0629
 - Running ..

<...>

{- Finished ..
  "endTime": "2020-07-09T22:24:35.1605019+00:00",
  "name": "7d3cd0ba-11b3-4180-8298-d9cafc9f22c1",
  "startTime": "2020-07-09T22:13:32.0732892+00:00",
  "status": "Succeeded"
}
$
```

---

## Cache metrics and monitoring

The overview page shows graphs for some basic cache statistics - cache throughput, operations per second, and latency.

![screenshot of three line graphs showing the statistics mentioned above for a sample cache](media/hpc-cache-overview-stats.png)

These charts are part of Azure's built-in monitoring and analytics tools. Additional tools and alerts are available from the pages under the **Monitoring** heading in the portal sidebar. Learn more in the portal section of the [Azure Monitoring documentation](../azure-monitor/essentials/monitor-azure-resource.md#monitoring-in-the-azure-portal).

## View warnings

If the cache goes into an unhealthy state, check the **Warnings** page. This page shows notifications from the cache software that might help you understand its state.

These notifications do not appear in the activity log because they are not controlled by Azure portal. They are often associated with custom settings you might have made.

Kinds of warnings you might see here include:

* The cache can't reach its NTP server
* The cache failed to download Extended Groups username information
* Custom DNS settings have changed on a storage target

![screenshot of the Monitoring > Warnings page showing a message that extended groups usernames could not be downloaded](media/warnings-page.png)

## Next steps

* Learn more about [Azure metrics and statistics tools](../azure-monitor/index.yml)
* Get [help with your Azure HPC Cache](hpc-cache-support-ticket.md)
