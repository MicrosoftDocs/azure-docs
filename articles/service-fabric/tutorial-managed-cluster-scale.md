---
title: Scale out a Managed Service Fabric cluster (preview)
description: In this tutorial, learn how to scale out a node type of a Managed Service Fabric cluster.
ms.topic: tutorial
ms.date: 09/1/2020
---

# Tutorial: Scale out a Managed Service Fabric cluster (preview)

In this tutorial series we will discuss:

> [!div class="checklist"]
> * [How to deploy a Managed Service Fabric cluster.](tutorial-managed-cluster-deploy.md)
> * How to scale out a Managed Service Fabric cluster
> * [How to add and remove node types in a Managed Service Fabric cluster](tutorial-managed-cluster-add-remove-node-type.md)
> * [How to add a certificate to a Managed Service Fabric cluster](tutorial-managed-cluster-certificate.md)
> * [How to upgrade your Managed Service Fabric cluster resources](tutorial-managed-cluster-upgrade.md)

This part of the series covers how to:

> [!div class="checklist"]
> * Scale a Managed Service Fabric cluster node

## Prerequisites
> [!Note]
> This tutorial uses Azure PowerShell commands which have not yet been released. They will become released as part of the Azure PowerShell module on 9/16/2020.

Follow the steps below to use the module before the official release is available:
* [Download and load Modules](https://github.com/a-santamaria/ServiceFabricManagedClustersClients#download-and-load-modules)
* [Documentation and Examples](https://github.com/a-santamaria/ServiceFabricManagedClustersClients#documentation-and-examples). 

## Scale a Managed Service Fabric cluster
Change the instance count to increase or decrease the number of nodes on the node type that you would like to scale. You can find node type names in the Azure Resource Manager template (ARM template) from your cluster deployment, or in the Service Fabric Explorer.  

> [!Note]
> If the node type is primary you will not be able to go below 3 nodes for a Basic SKU cluster, and 5 nodes for a Standard SKU cluster. 

```powershell
$resourceGroup = "myResourceGroup" 
$clusterName = "myCluster"
$nodeTypeName = "FE" 
$instanceCount = "7"

Set-AzServiceFabricManagedNodeType -ResourceGroupName $resourceGroup -ClusterName $clusterName -name $nodeTypeName -InstanceCount $instanceCount -Verbose
```

The cluster will begin upgrading automatically and after a few minutes you will see the additional nodes.

## Next steps

In this step we scaled a node type on a managed Service Fabric cluster. To learn more about adding and removing node types, see:

> [!div class="nextstepaction"]
> [Add and remove Managed Service Fabric cluster node types](./tutorial-managed-cluster-add-remove-node-type.md)
