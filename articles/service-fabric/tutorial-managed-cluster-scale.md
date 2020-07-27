---
title: Scale out a Managed Service Fabric cluster (preview)
description: In this tutorial, learn how to scale out a node type of a Managed Service Fabric cluster.
ms.topic: tutorial
ms.date: 07/31/2020
---

# Tutorial: Scale out a Managed Service Fabric cluster (preview)

In this tutorial series we will discuss:

> [!div class="checklist"]
> * [How to deploy a Managed Service Fabric cluster.](tutorial-managed-cluster-deploy.md)
> * How to scale out a Managed Service Fabric cluster
> * [How to add and remove nodes in a Managed Service Fabric cluster](tutorial-managed-cluster-add-remove-node-type.md)
> * [How to add a certificate to a Managed Service Fabric cluster](tutorial-managed-cluster-certificate.md)
> * [How to upgrade your Managed Service Fabric cluster resources](tutorial-managed-cluster-upgrade.md)

This part of the series covers how to:

> [!div class="checklist"]
> * Scale a Managed Service Fabric cluster node

## Scale a Managed Service Fabric cluster

Get the Azure resource for the target node type, and set the property `vmInstanceCount` to the desired number of nodes. Trigger the changes by setting the resource.

```powershell
$be = Get-AzResource -ResourceId <your-resource-id> -ApiVersion 2020-01-01-preview
$be.Properties
$be.Properties.vmInstanceCount = 5
$be | Set-AzResource
```

The cluster will begin upgrading automatically and after a few minutes you will see the additional nodes.

## Cleaning Up

Congratulations! You've scaled a Managed Service Fabric cluster. When no longer needed, simply delete the cluster resource or the resource group.

## Next steps

In this step we scaled a Managed Service Fabric cluster. To learn more about adding and removing node types, see:

> [!div class="nextstepaction"]
> [Add and remove Managed Service Fabric cluster node types](./tutorial-managed-cluster-add-remove-node-type.md)