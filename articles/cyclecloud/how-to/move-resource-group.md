---
title: Move Resource Group For a Cluster
description: How to move Azure resources to another resource group.
author: adriankjohnson
ms.date: 02/29/2020
ms.author: adjohnso
---

# Moving resources in a cluster to another resource group

Azure supports [moving resources to a different resource group](https://aka.ms/MoveAzureResources). As of 8.4.2, CycleCloud supports this feature as well.

## Background

Each subscription has one or more _credentials_ associated with it in CycleCloud, and each cluster references the credential used to make calls to Azure. There are two options for which resource group is used for a cluster: 

* A single shared resource group, which must already exist.
* A dedicated _managed resource group_ per cluster, created and deleted automatically for each cluster.
 
This is specified on the credential set up when a subscription is added to CycleCloud, via the `Resource Group` setting. Set it to the shared resource group that all clusters should use, or set it to `<Create New Per Cluster>` to use a managed resource group. This setting affects all clusters created using that credential.

> [!NOTE]
> This setting only affects new clusters. When a cluster is started, it stores this resource group it is using and whether or not it is managed, so it is not affected by the credential settings. A cluster created with a managed resource group will delete the resource group as the last step of deleting the cluster.

## How to move resources

Only terminated clusters can be moved to a new resource group. While the cluster is running, moving the resources in Azure is not supported.

Once the cluster is terminated, the resources can be moved using [the Azure portal or the CLI](https://aka.ms/MoveAzureResources). Moving the resources may take up to 4 hours. 

> [!NOTE]
> You must move all the resources for a cluster. Since the cluster is terminated, this is likely just the head node's persistent disk, if any. You can move resources for more than one terminated cluster at the same time.

After the move-resources operation completes, run the following command for each cluster, supplying the correct cluster name, as well as the name of the resource group it was using and the name of the new resource group the resources were moved to:

```
/opt/cycle_server/cycle_server clusters update_resource_group CLUSTERNAME SOURCE_RESOURCE_GROUP DESTINATION_RESOURCE_GROUP
```

> [!WARNING]
> Do *not* specify a CycleCloud managed resource group as the destination resource group! CycleCloud will delete the resource group when the corresponding cluster is deleted. This will delete all resources in it, including the ones for other clusters you moved into it.

Once this succeeds, the cluster may be restarted, and it will use the new resource group for all resources.

## Frequently Asked Questions

### Can I use this to change from the resource-group-per-cluster model to the shared-resource-group model?

Yes. First, edit the subscription's credential to use only the resource group you want to share. (If it does not exist already, you must create it.) This will ensure new clusters use that shared resource group. Then, terminate existing clusters and move them to the new shared group using the above process. 

### Can I use this to change from shared-resource-group model to the resource-group-per-cluster model?

Yes, with one limitation. First, edit the subscription's credential to use a new resource group per cluster. This will ensure new clusters each get their own resource group. Then, terminate clusters and create a new resource group for each, and move them each to their own new group using the above process.  

> [!NOTE]
> Each moved cluster will not own its resource group, and will not delete it when its is deleted (but all resources for that cluster will be deleted). The resource group itself must be manually cleaned up after the cluster is deleted.

### Can I use this to move resources to another subscription or region?

Not at this time, no.
