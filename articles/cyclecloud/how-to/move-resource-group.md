---
title: Move Resource Group For a Cluster
description: How to move Azure resources to another resource group.
author: adriankjohnson
ms.date: 07/01/2025
ms.author: adjohnso
---

# Moving resources in a cluster to another resource group

Azure supports [moving resources to a different resource group](https://aka.ms/MoveAzureResources). As of version 8.4.2, CycleCloud supports this feature as well.

## Background

Each subscription in CycleCloud has one or more associated _credentials_, and each cluster references the credential used to make calls to Azure. You have two options for which resource group to use for a cluster:

* A single shared resource group, which must already exist.
* A dedicated _managed resource group_ for each cluster, which the system creates and deletes automatically.

When you add a subscription to CycleCloud, specify the resource group in the `Resource Group` setting. Set it to the shared resource group that all clusters should use, or set it to `<Create New Per Cluster>` to use a managed resource group. This setting affects all clusters you create with that credential.

> [!NOTE]
> This setting only affects new clusters. When you start a cluster, it stores the resource group it uses and whether the resource group is managed, so credential settings don't affect it. A cluster that you create with a managed resource group deletes the resource group as the last step when you delete the cluster.

## How to move resources

You can only move terminated clusters to a new resource group. While the cluster is running, you can't move the resources in Azure.

When the cluster is terminated, you can use [the Azure portal or the CLI](https://aka.ms/MoveAzureResources) to move the resources. Moving the resources can take up to four hours.

> [!NOTE]
> You must move all the resources for a cluster. Since the cluster is terminated, this requirement is likely just the head node's persistent disk, if any. You can move resources for more than one terminated cluster at the same time.

After the move-resources operation completes, run the following command for each cluster. Provide the cluster name, the name of the resource group it was using, and the name of the new resource group you moved the resources to:

```
/opt/cycle_server/cycle_server clusters update_resource_group CLUSTERNAME SOURCE_RESOURCE_GROUP DESTINATION_RESOURCE_GROUP
```

> [!WARNING]
> Don't specify a CycleCloud managed resource group as the destination resource group. CycleCloud deletes the resource group when you delete the corresponding cluster. This action deletes all resources in the resource group, including resources for other clusters you moved into it.

When the operation succeeds, you can restart the cluster. The cluster uses the new resource group for all resources.

## Frequently Asked Questions

### Can I use this process to change from the resource-group-per-cluster model to the shared-resource-group model?

Yes. First, edit the subscription's credential to use only the resource group you want to share. If the resource group doesn't already exist, you must create it. This step ensures new clusters use that shared resource group. Then, terminate existing clusters and move them to the new shared resource group by using the preceding process.

### Can I use this process to change from the shared-resource-group model to the resource-group-per-cluster model?

Yes, with one limitation. First, edit the subscription's credential to use a new resource group for each cluster. This change ensures that new clusters each get their own resource group. Then, terminate clusters that use the shared resource group. For each terminated cluster, create a new resource group and use the preceding process to move the cluster to its own new resource group.

> [!NOTE]
> Each moved cluster doesn't own its resource group and doesn't delete it when the cluster is deleted (but all resources for that cluster are deleted). You must manually clean up the resource group after the cluster is deleted.

### Can I use this process to move resources to another subscription or region?

Not at this time, no.
