---
title: Add and remove node types of a Service Fabric managed cluster
description: In this tutorial, learn how to add and remove node types of a Service Fabric managed cluster.
ms.topic: tutorial
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Tutorial: Add and remove node types from a Service Fabric managed cluster

In this tutorial series we will discuss:

> [!div class="checklist"]
> * [How to deploy a Service Fabric managed cluster](tutorial-managed-cluster-deploy.md)
> * [How to scale out a Service Fabric managed cluster](tutorial-managed-cluster-scale.md)
> * How to add and remove nodes in a Service Fabric managed cluster
> * [How to deploy an application to a Service Fabric managed cluster](tutorial-managed-cluster-deploy-app.md)

This part of the series covers how to:

> [!div class="checklist"]
> * Add a node type to a Service Fabric managed cluster
> * Delete a node type from a Service Fabric managed cluster

## Prerequisites

* A Service Fabric managed cluster (see [*Deploy a managed cluster*](tutorial-managed-cluster-deploy.md)).
* [Azure PowerShell 4.7.0](/powershell/azure/release-notes-azureps#azservicefabric) or later (see [*Install Azure PowerShell*](/powershell/azure/install-azure-powershell)).

## Add a node type to a Service Fabric managed cluster

You can add a node type to a Service Fabric managed cluster through an Azure Resource Manager template, PowerShell, or CLI. In this tutorial, we will be adding a node type using the Azure PowerShell.

To create a new node type, you'll need to define three properties:

* **Node Type Name**: Name that is unique from any existing node types in the cluster.
* **Instance Count**: Initial number of nodes of the new node type.
* **VM Size**: VM SKU for the nodes. If not specified, the default value *Standard_D2* is used.

> [!NOTE]
> If the node type being added is the first or only node type in the cluster, the Primary property must be used.

```powershell
$resourceGroup = "myResourceGroup"
$clusterName = "mysfcluster"
$nodeTypeName = "nt2"
$vmSize = "Standard_D2_v2"

New-AzServiceFabricManagedNodeType -ResourceGroupName $resourceGroup -ClusterName $clusterName -Name $nodeTypeName -InstanceCount 3 -vmSize $vmSize
```

## Remove a node type from a Service Fabric managed cluster

To remove a node type from a Service Fabric managed cluster, you must use PowerShell or CLI. In this tutorial, we will remove a node type using Azure PowerShell.

> [!NOTE]
> It is not possible to remove a primary node type if it is the only primary node type in the cluster.  

To remove a node type:

```powershell
$resourceGroup = "myResourceGroup"
$clusterName = "myCluster"
$nodeTypeName = "nt2"

Remove-AzServiceFabricManagedNodeType -ResourceGroupName $resourceGroup -ClusterName $clusterName  -Name $nodeTypeName
```

## Next steps

 In this section, we added and deleted node types. To learn how to deploy an application to a Service Fabric managed cluster, see:

> [!div class="nextstepaction"]
> [Deploy an app to a Service Fabric managed cluster](tutorial-managed-cluster-deploy-app.md)
