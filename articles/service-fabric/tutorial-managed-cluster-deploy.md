---
title: Deploy a Service Fabric managed cluster
description: In this tutorial, you will deploy a Service Fabric managed cluster for testing.
ms.topic: tutorial
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Tutorial: Deploy a Service Fabric managed cluster

In this tutorial series we will discuss:

> [!div class="checklist"]
> * How to deploy a Service Fabric managed cluster 
> * [How to scale out a Service Fabric managed cluster](tutorial-managed-cluster-scale.md)
> * [How to add and remove nodes in a Service Fabric managed cluster](tutorial-managed-cluster-add-remove-node-type.md)
> * [How to deploy an application to a Service Fabric managed cluster](tutorial-managed-cluster-deploy-app.md)

This part of the series covers how to:

> [!div class="checklist"]
> * Connect to your Azure account
> * Create a new resource group
> * Deploy a Service Fabric managed cluster
> * Add a Primary node type to the cluster

## Prerequisites

Before you begin this tutorial:

* Create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have an Azure subscription

* Install the [Service Fabric SDK and PowerShell module](service-fabric-get-started.md).

* Install [Azure PowerShell 4.7.0](/powershell/azure/release-notes-azureps#azservicefabric) (or later).

## Connect to your Azure account

Replace `<your-subscription>` with the subscription string for your Azure account, and connect:

```powershell
Login-AzAccount
Set-AzContext -SubscriptionId <your-subscription>

```

## Create a new resource group

Next, create the resource group for the Managed Service Fabric cluster, replacing `<your-rg>` and `<location>` with the desired group name and location.

```powershell
$resourceGroup = "myResourceGroup"
$location = "EastUS2"

New-AzResourceGroup -Name $resourceGroup -Location $location
```

## Deploy a Service Fabric managed cluster

### Create a Service Fabric managed cluster

In this step, you will create a Service Fabric managed cluster using the New-AzServiceFabricManagedCluster PowerShell command. The following example creates a cluster named myCluster in the resource group named myResourceGroup. This resource group was created in the previous step in the eastus2 region.

For this step, provide your own values for the following  parameters:

* **Cluster Name**: Enter a unique name for your cluster, such as *mysfcluster*.
* **Admin Password**: Enter a password for the admin to be used for RDP on the underlying VMs in the cluster.
* **Client Certificate Thumbprint**: Provide the thumbprint of the client certificate that you would like to use to access your cluster. If you do not have a certificate, follow [set and retrieve a certificate](../key-vault/certificates/quick-create-portal.md) to create a self-signed certificate.
* **Cluster SKU**: Specify the [type of Service Fabric managed cluster](overview-managed-cluster.md#service-fabric-managed-cluster-skus) to deploy. *Basic* SKU clusters are meant for test deployments only, and do not allow for node type addition or removal.

```powershell
$clusterName = "<unique cluster name>"
$password = "Password4321!@#" | ConvertTo-SecureString -AsPlainText -Force
$clientThumbprint = "<certificate thumbprint>"
$clusterSku = "Standard"

New-AzServiceFabricManagedCluster -ResourceGroupName $resourceGroup -Location $location -ClusterName $clusterName -ClientCertThumbprint $clientThumbprint -ClientCertIsAdmin -AdminPassword $password -Sku $clusterSKU -Verbose
```

### Add a primary node type to the Service Fabric managed cluster

In this step, you will add a primary node type to the cluster that you have just created. Every Service Fabric cluster must have at least one primary node type.

For this step, provide your own values for the following  parameters:

* **Node Type Name**: Enter a unique name for the node type to be added to your cluster, such as "NT1".

> [!NOTE]
> If the node type being added is the first or only node type in the cluster, the Primary property must be used.

```powershell
$nodeType1Name = "NT1"

New-AzServiceFabricManagedNodeType -ResourceGroupName $resourceGroup -ClusterName $clusterName -Name $nodeType1Name -Primary -InstanceCount 5
```

This command may take a few minutes to complete.

## Validate the deployment

### Review deployed resources

Once the deployment completes, find the Service Fabric Explorer value in the Service Fabric managed cluster resource overview page in Portal. When prompted for a certificate, use the certificate for which the client thumbprint was provided in the PowerShell command.

## Next steps

In this step we created and deployed our first Service Fabric managed cluster. To learn more about how to scale a cluster, see:

> [!div class="nextstepaction"]
> [Scale out a Service Fabric managed cluster](tutorial-managed-cluster-scale.md)
