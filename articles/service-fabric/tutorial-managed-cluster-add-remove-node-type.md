---
title: Add and remove node types of a Managed Service Fabric cluster (preview)
description: In this tutorial, learn how to add and remove node types of a Managed Service Fabric cluster.
ms.topic: tutorial
ms.date: 07/31/2020
---

# Tutorial: Add and remove node types of a Managed Service Fabric cluster (preview)

In this tutorial series we will discuss:

> [!div class="checklist"]
> * [How to deploy a Managed Service Fabric cluster.](tutorial-managed-cluster-deploy.md) 
> * [How to scale out a Managed Service Fabric cluster](tutorial-managed-cluster-scale.md)
> * How to add and remove nodes in a Managed Service Fabric cluster
> * [How to add a certificate to a Managed Service Fabric cluster](tutorial-managed-cluster-certificate.md)
> * [How to upgrade your Managed Service Fabric cluster resources](tutorial-managed-cluster-upgrade.md)

This part of the series covers how to:

> [!div class="checklist"]
> * Add a node type to a Managed Service Fabric cluster
> * Delete a node type from a Managed Service Fabric cluster

## Prerequisites

Before you begin this tutorial:
* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
* [Install the Service Fabric SDK](service-fabric-get-started.md)

## Add a node type to a Managed Service Fabric cluster

To add a node type-

## Delete a node type from a Managed Service Fabric cluster

To delete a node type obtaining the resource ID for the target node type, simply remove the resource.

```powershell
Remove-AzResource -ResourceId <your-resource-id> -ApiVersion 2020-01-01-preview
```

## Cleaning Up

Congratulations! You've learned how to add and remove node types to a Managed Service Fabric cluster. When no longer needed, simply delete the cluster resource or the resource group.

## Next steps

In this step we added and deleted node types. To learn more about how to use client certificates, see:

> [!div class="nextstepaction"]
> [Add a client certificate to a Manged Service Fabric cluster](./tutorial-managed-cluster-certificate.md)