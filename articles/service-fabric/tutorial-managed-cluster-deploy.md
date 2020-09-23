---
title: Deploy a Service Fabric managed cluster (preview)
description: In this tutorial, you will deploy a Service Fabric managed cluster for testing.
ms.topic: tutorial
ms.date: 08/27/2020
ms.custom: references_regions
#Customer intent: As a Service Fabric customer, I want to learn about managed clusters so that I can deploy clusters without needing to manipulate numerous resources.
---

# Tutorial: Deploy a Service Fabric managed cluster (preview)

In this tutorial series we will discuss:

> [!div class="checklist"]
> * How to deploy a Service Fabric managed cluster 
> * [How to scale out a Service Fabric managed cluster](tutorial-managed-cluster-scale.md)
> * [How to add and remove nodes in a Service Fabric managed cluster](tutorial-managed-cluster-add-remove-node-type.md)
> * [How to add a certificate to a Service Fabric managed cluster](tutorial-managed-cluster-certificate.md)
> * [How to upgrade your Service Fabric managed cluster resources](tutorial-managed-cluster-upgrade.md)

This part of the series covers how to:

> [!div class="checklist"]
> * Connect your Azure account
> * Create a new resource group
> * Deploy a Service Fabric managed cluster

## Prerequisites

Before you begin this tutorial:
* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
* [Install the Service Fabric SDK](service-fabric-get-started.md)

> [!Note]
> This tutorial uses Azure PowerShell commands which have not yet been released. They will become released as part of the Azure PowerShell module on 9/22/2020.

Follow the steps below to use the module before the official release is available:
* [Download and load Modules](https://github.com/a-santamaria/ServiceFabricManagedClustersClients#download-and-load-modules)
* [Documentation and Examples](https://github.com/a-santamaria/ServiceFabricManagedClustersClients#documentation-and-examples). 

## Connect your Azure account

> [!Note]
> Supported regions for the public preview include centraluseuap, eastus2euap, eastasia, northeurope, westcentralus, and eastus2.

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
* **Cluster Name**: Enter a unique name for your cluster, such as *myCluster*.
* **Admin Password**: Enter a password for the admin to be used for RDP on the underlying VMs in the cluster.
* **Client Certificate Thumbprint**: Provide the thumbprint of the client certificate that you would like to use to access your cluster. If you do not have a certificate, follow [set and retrieve a certificate](https://docs.microsoft.com/azure/key-vault/certificates/quick-create-portal) to create a self-signed certificate. 
* **Cluster SKU**: This is the type of Service Fabric cluster being deployed, basic SKU clusters are meant for test deployments only. 

```powershell
$clusterName = "myCluster" 
$password = "Password4321!@#" | ConvertTo-SecureString -AsPlainText -Force
$clientThumbprint = "<Certificate Thumbprint>"
$clusterSku = "Standard"

New-AzServiceFabricManagedCluster -ResourceGroupName $resourceGroup -Location $location -ClusterName $clusterName -ClientCertThumbprint $clientThumbprint -ClientCertIsAdmin -AdminPassword $password -Sku $clusterSKU -Verbose
```

### Add a Primary Node Type to the Service Fabric managed cluster

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
> [Scale out a Service Fabric managed cluster](./tutorial-managed-cluster-scale.md)
