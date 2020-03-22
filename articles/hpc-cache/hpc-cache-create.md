---
title: Create an Azure HPC Cache
description: How to create an Azure HPC Cache instance
author: ekpgh
ms.service: hpc-cache
ms.topic: how-to
ms.date: 11/11/2019
ms.author: rohogue
---

# Create an Azure HPC Cache

Use the Azure portal to create your cache.

![screenshot of cache overview in Azure portal, with create button at the bottom](media/hpc-cache-home-page.png)

## Define basic details

![screenshot of project details page in Azure portal](media/hpc-cache-create-basics.png)

In **Project Details**, select the subscription and resource group that will host the cache. Make sure the subscription is on the [access](hpc-cache-prereqs.md#azure-subscription) list.

In **Service Details**, set the cache name and these other attributes:

* Location - Select one of the [supported regions](hpc-cache-overview.md#region-availability).
* Virtual network - You can select an existing one or create a new virtual network.
* Subnet - Choose or create a subnet with at least 64 IP addresses (/24) that will be used only for this Azure HPC Cache instance.

## Set cache capacity
<!-- referenced from GUI - update aka.ms link if you change this header text -->

On the **Cache** page, you must set the capacity of your cache. The values set here determine how much data your cache can hold and how quickly it can service client requests.

Capacity also affects the cache's cost.

Choose the capacity by setting these two values:

* The maximum data transfer rate for the cache (throughput), in GB/second
* The amount of storage allocated for cached data, in TB

Choose one of the available throughput values and cache storage sizes.

Keep in mind that the actual data transfer rate depends on workload, network speeds, and the type of storage targets. The values you choose set the maximum throughput for the entire cache system, but some of that is used for overhead tasks. For example, if a client requests a file that isn't already stored in the cache, or if the file is marked as stale, your cache uses some of its throughput to fetch it from backend storage.

Azure HPC Cache manages which files are cached and preloaded to maximize cache hit rates. The cache contents are continuously assessed and files are moved to long-term storage when they are less frequently accessed. Choose a cache storage size that can comfortably hold the active set of working files with additional space for metadata and other overhead.

![screenshot of cache sizing page](media/hpc-cache-create-capacity.png)

## Add resource tags (optional)

The **Tags** page lets you add [resource tags](https://go.microsoft.com/fwlink/?linkid=873112) to your Azure HPC Cache instance.

## Finish creating the cache

After configuring the new cache, click the **Review + create** tab. The portal validates your selections and lets you review your choices. If everything is correct, click **Create**.

Cache creation takes about 10 minutes. You can track the progress in the Azure portal's notifications panel.

![screenshot of cache creation "deployment underway" and "notifications" pages in portal](media/hpc-cache-deploy-status.png)

When creation finishes, a notification appears with a link to the new Azure HPC Cache instance, and the cache appears in your subscription's **Resources** list.
<!-- double check on notification -->

![screenshot of Azure HPC Cache instance in Azure portal](media/hpc-cache-new-overview.png)

## Next steps

After your cache appears in the **Resources** list, define storage targets to give your cache access to your data sources.

* [Add storage targets](hpc-cache-add-storage.md)
