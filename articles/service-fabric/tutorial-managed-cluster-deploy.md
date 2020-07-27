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

## Connect your Azure account

Replace `<your-subscription>` with the subscription string for your Azure account, and connect:

```powershell
Login-AzAccount
Set-AzContext -SubscriptionId <your-subscription>

```

## Create a new resource group

Next, create the resource group for the Managed Service Fabric cluster, replacing `<your-rg>` and `<location>` with the desired group name and location.

```powershell
New-AzResourceGroup -Name <your-rg> -Location <location>
```

## Deploy a Managed Service Fabric cluster

Finally, create a password for the admin account, and deploy a new Managed Service Fabric cluster using the downloaded template, filling in the variables appropriately. The following example creates a new cluster with two node types:

```powershell
$password="Password4321!@#" | ConvertTo-SecureString -AsPlainText -Force
New-AzResourceGroupDeployment -Name <your-resource-name> -ResourceGroupName <your-rg> -TemplateFile .\template-cluster-default-2nt.json -clusterName <your-cluster-name> -nodeType1Name FE -nodeType2Name BE -nodeType1vmInstanceCount 5 -nodeType2vmInstanceCount 3 -adminPassword $password -Verbose
```

After a few minutes, you'll see your cluster in the Azure portal.

## Cleaning Up

Congratulations! You've deployed a Managed Service Fabric cluster to Azure. When no longer needed, simply delete the cluster resource or the resource group.

## Next steps

In this step we created and deployed our first Managed Service Fabric cluster. To learn more about how to scale a cluster, see:

> [!div class="nextstepaction"]
> [Scale out a Managed Service Fabric cluster](./tutorial-managed-cluster-scale.md)
