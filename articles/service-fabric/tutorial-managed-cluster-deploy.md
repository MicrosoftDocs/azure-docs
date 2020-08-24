---
title: Deploy a Managed Service Fabric cluster (preview)
description: In this tutorial, you will deploy a Managed Service Fabric test cluster.
ms.topic: tutorial
ms.date: 07/31/2020
#Customer intent: As a service fabric customer, I want to learn about Managed SFRP so that I can deploy clusters without needing to manipulate numerous resources.
---

# Tutorial: Deploy a Managed Service Fabric cluster (preview)

In this tutorial series we will discuss:

> [!div class="checklist"]
> * How to deploy a Managed Service Fabric cluster 
> * [How to scale out a Managed Service Fabric cluster](tutorial-managed-cluster-scale.md)
> * [How to add and remove nodes in a Managed Service Fabric cluster](tutorial-managed-cluster-add-remove-node-type.md)
> * [How to add a certificate to a Managed Service Fabric cluster](tutorial-managed-cluster-certificate.md)
> * [How to upgrade your Managed Service Fabric cluster resources](tutorial-managed-cluster-upgrade.md)

This part of the series covers how to:

> [!div class="checklist"]
> * Connect your Azure account
> * Create a new resource group
> * Deploy a Managed Service Fabric cluster

## Prerequisites

Before you begin this tutorial:
* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
* [Install the Service Fabric SDK](service-fabric-get-started.md)
* [Download the Managed Service Fabric cluster template](PLACEHOLDER.json)

> [!Note]
> This tutorial uses Azure PowerShell commands which have not yet been released. They will become released as part of the Azure PowerShell module on 9/16/2020.

Follow the steps below to use the module before the official release is available:
* [Download and load Modules](https://github.com/a-santamaria/ServiceFabricManagedClustersClients#download-and-load-modules)
* [Documentation and Examples](https://github.com/a-santamaria/ServiceFabricManagedClustersClients#documentation-and-examples). 

## Connect your Azure account

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

## Deploy a Managed Service Fabric cluster

Create a password for the admin account, and deploy a new Managed Service Fabric cluster using the downloaded template, filling in the variables appropriately. Ues this [sample template](https://github.com/peterpogorski/azure-quickstart-templates/tree/managed-sfrp-sample-templates/101-managed-service-fabric-cluster-standard-1-nt) which contains a Standard SKU managed Service Fabric cluster with one node type. The following example shows how to deploy this template using PowerShell. 

Create a managed Service Fabric cluster using New-AzServiceFabricManagedCluster. The following example creates a cluster named myCluster in the resource group named myResourceGroup. This resource group was created in the previous step in the eastus2 region. 

For this quickstart, provide your own values for the following  parameters: 
* **Cluster Name**: Enter a unique name for your cluster, such as *myCluster*.
* **Admin Password**: Enter a password for the admin to be used for RDP on the underlying VMs in the cluster.
* **Client Certificate Thumbprint**: Provide the thumprint of the client certificate that you would like to use to access your cluster. If you do not have a certificate, follow [steps]() to create a self-signed certificate. 
* **Cluster SKU**: This is the type of Service Fabric cluster being deployed, basic SKU clusters are meant for test deployments only. 

```powershell
$clusterName = "myCluster" 
$password = "Password4321!@#" | ConvertTo-SecureString -AsPlainText -Force
$thumbprint = "<Certificate Thumbprint>"
$clusterSku = "Standard"

New-AzServiceFabricManagedCluster -ResourceGroupName $resourceGroup -Location $location -ClusterName $clusterName -ClientCertThumbprint $thumbprint -ClientCertIsAdmin -AdminPassword $password -Sku $clusterSKU -Verbose
```

This command may take a few minutes to complete.

## Validate the deployment 

### Review deployed resources 

Once the deployment completes, find the Service Fabric Explorer value in the output and open the address in a web browser to view your cluster in Service Fabric Explorer. When prompted for a certificate, use the certificate for which the client thumbprint was provided in the template. 

> [!NOTE]
> You can find the output of the deployment in Azure Portal under the resource group deployments tab.

## Next steps

In this step we created and deployed our first Managed Service Fabric cluster. To learn more about how to scale a cluster, see:

> [!div class="nextstepaction"]
> [Scale out a Managed Service Fabric cluster](./tutorial-managed-cluster-scale.md)
