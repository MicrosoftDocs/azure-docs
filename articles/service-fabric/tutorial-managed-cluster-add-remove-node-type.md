---
title: Add and remove node types of a Service Fabric managed cluster (preview)
description: In this tutorial, learn how to add and remove node types of a Service Fabric managed cluster.
ms.topic: tutorial
ms.date: 09/1/2020
---

# Tutorial: Add and remove node types from a Service Fabric managed cluster (preview)

In this tutorial series we will discuss:

> [!div class="checklist"]
> * [How to deploy a Service Fabric managed cluster](tutorial-managed-cluster-deploy.md) 
> * [How to scale out a Service Fabric managed cluster](tutorial-managed-cluster-scale.md)
> * How to add and remove nodes in a Service Fabric managed cluster
> * [How to add a certificate to a Service Fabric managed cluster](tutorial-managed-cluster-certificate.md)
> * [How to upgrade your Service Fabric managed cluster resources](tutorial-managed-cluster-upgrade.md)

This part of the series covers how to:

> [!div class="checklist"]
> * Add a node type to a Service Fabric managed cluster
> * Delete a node type from a Service Fabric managed cluster

## Prerequisites
> [!Note]
> This tutorial uses Azure PowerShell commands which have not yet been released. They will become released as part of the Azure PowerShell module on 9/22/2020.

Follow the steps below to use the module before the official release is available:
* [Download and load Modules](https://github.com/a-santamaria/ServiceFabricManagedClustersClients#download-and-load-modules)
* [Documentation and Examples](https://github.com/a-santamaria/ServiceFabricManagedClustersClients#documentation-and-examples). 


## Add a node type to a Service Fabric managed cluster

You can add a node type to a Service Fabric managed cluster through an Azure Resource Manager template, PowerShell, or CLI. In this tutorial we will be adding a node type using the Azure PowerShell.

To create a new node type, we will need to define three properties:
* **Node Type Name**: This should be a unique name from any other node types that already exist in the cluster. 
* **Instance Count**: This will be the initial number of nodes in the new node type. 
* **VM Size**: This will be the VM SKU which the nodes are running on. If this property is not specified the default value with be a Standard_D2. 

> [!NOTE]
> If the node type being added is the first or only node type in the cluster, the Primary property must be used.

```powershell
$resourceGroup = "myResourceGroup"
$clusterName = "myCluster"
$nodeTypeName = "nt2"
$vmSize = "Standard_D2_v2"

New-AzServiceFabricManagedNodeType -ResourceGroupName $resourceGroup -ClusterName $clusterName -Name $nodeTypeName -InstanceCount 3 -vmSize $vmSize
```

## Remove a node type from a Service Fabric managed cluster

To remove a node type from a Service Fabric managed cluster, you must use PowerShell or CLI. In this tutorial we will be remove a node type using the Azure PowerShell. 

> [!Note]
> It is not possible to remove a primary node type if it is the only primary node type in the cluster.  

To remove a node type:

```powershell
$resourceGroup = "myResourceGroup"
$clusterName = "myCluster"
$nodeTypeName = "nt2"

Remove-AzServiceFabricManagedNodeType -ResourceGroupName $resourceGroup -ClusterName $clusterName  -Name $nodeTypeName
```

## Next steps

 In this step we added and deleted node types. To learn more about upgrading, see:

> [!div class="nextstepaction"]
> [Upgrade a Service Fabric managed cluster](./tutorial-managed-cluster-upgrade.md)