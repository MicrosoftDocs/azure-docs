---
title: Move an Azure HPC Cache to a different region
description: Information about how to move or recreate an Azure HPC Cache in another region
author: ronhogue
ms.service: hpc-cache
ms.topic: how-to
ms.custom: subject-moving-resources
ms.date: 03/03/2022
ms.author: rohogue
#Customer intent: As an HPC Cache administrator, I want to move a cache to another region so that it can be used with different services or provide failover for another cache instance.
---

# How to move an Azure HPC Cache to another region

This article describes how to move Azure HPC Cache resources to a different Azure region. You might want to move your workflow to a different region in order to take advantage of different services that are available there, or to access storage accounts in that region. Moving also can be necessary to meet policy requirements or for capacity planning.

Each HPC Cache is tied to the region where it was created, so it can't be moved directly. Instead, you can create a duplicate HPC Cache in the new region and delete the original cache.

A duplicate HPC Cache in a different Azure region also can be part of a failover recovery strategy, as explained in [Use multiple caches for regional failover recovery](hpc-region-recovery.md).

## Prerequisites

Before you create a replacement HPC Cache in another region, make careful notes of these items from the original cache so that you can replicate them in the new cache.

* Details of the virtual network and subnet structure
* Storage target details, names, and namespace paths
* The mount command used by cache clients
* Structure and names of blob storage containers, if you also need to move them to the new region
* Details of any Azure Monitor alerts configured for your cache

## Prepare

To prepare to create a copy of an Azure HPC Cache in a new region, you can download an [Azure Resource Manager template](../azure-resource-manager/templates/overview.md) from your existing cache. In the Azure portal, use the **Export template** page in the **Automation** section of the left menu to create a template.

If you originally created the cache from script or from an existing template, you also can reuse those methods to create a replica cache in the new region.

### Create network and storage infrastructure (if needed)

In the new region, move or recreate the infrastructure needed for the cache.

Make sure your new region has a virtual network to hold the cache, and the required subnets. Depending on your configuration, you might need to move or re-create Blob containers for your storage targets.

Confirm that the new resources meet all of the requirements described in the cache [Prerequisites](hpc-cache-prerequisites.md) article.

### Shut down the cache

Before moving the cache, stop the cache and disconnect clients. Follow these steps:

1. Allow client workloads to complete, if needed.
1. Unmount client machines from the cache.
1. [Stop the cache](hpc-cache-manage.md#stop-the-cache).
    1. The cache will synchronize its data with long-term storage systems, which can take some time depending on your cache settings and storage infrastructure.
    1. Wait until the cache status changes to **Stopped**.

> [!TIP]
> If you need to move or copy data to the new region, you can begin that process as soon as the original cache is stopped.

## Move

Follow these basic steps to decommission and re-create the HPC Cache in a different region.

1. If you have not already done so, follow the steps above to [shut down the cache](#shut-down-the-cache).
1. Update the Azure Resource Manager template from the old cache to include the correct information for the new cache. Check both the parameters file and the template file for updates. Or, if you will use a different deployment script, update the information there.
1. If needed, move Blob storage containers to the new region, or copy data from your old region to new containers. (You can begin this process any time after stopping the original cache.)

   Refer to [Move an Azure Storage account to another region](../storage/common/storage-account-move.md) for help.

   > [!NOTE]
   >
   > If you move an NFS-enabled blob container (ADLS-NFS storage target), be aware of the risk of mixing blob-style writes with NFS writes. Read more about this in [Use NFS-mounted blob storage with Azure HPC Cache](nfs-blob-considerations.md#pre-load-data-with-nfs-protocol).

1. Create a new cache in your target region using a convenient method. Read [Template deployment](../azure-resource-manager/templates/overview.md#template-deployment-process) to learn how to use your saved template. Read [Create an HPC Cache](hpc-cache-create.md) to learn about other methods.
1. Wait until the cache has been created and appears in your subscription's **Resources** list with a status of **Healthy**.
1. Follow the documentation instructions to re-create storage targets and configure other cache settings.
1. When you are ready, mount clients to the new cache using its IP addresses.

## Verify

Use the Azure Portal to inspect the new cache and storage resources in the new region. Verify that all items from the list in [Prerequisites](#prerequisites) have been created.

## Clean up source resources

If you haven't already done so, [delete](hpc-cache-manage.md?#delete-the-cache) the original cache. Also delete its virtual networks and any other resources in the original region that are no longer needed.

If you deployed all of your cache's resources in a unique resource group *and will not use the same resource group in new region*, you can delete the resource group to remove all cache resources from the old region.
