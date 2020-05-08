---
title: Tutorial: Enable Ingress Controller Add-On for AKS with Application Gateway 
description: Use this tutorial to enable the Ingress Controller Add-On for your AKS cluster with Application Gateway
author: caya
ms.service: application-gateway
ms.topic: tutorial 
ms.date: 5/19/20
---

# Tutorial: Enable Application Gateway Ingress Controller Add-On for an new AKS Cluster with an new Application Gateway with Azure CLI 

You can use Azure CLI to enable the [Application Gateway Ingress Controller (AGIC)](ingress-controller-overview.md) add-on for your [Azure Kubernetes Services (AKS)](https://azure.microsoft.com/services/kubernetes-service/) cluster. In this tutorial, you will create an AKS cluster, an Application Gateway, and enable the AGIC add-on for the AKS cluster using the Application Gateway you created. The add-on provides a much faster way of deploying AGIC for your AKS cluster than previously through Helm.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a resource group 
> * Create an AKS cluster with AGIC add-on enabled 
> * Deploy a sample application using AGIC for Ingress on the AKS cluster
> * Check status of Application Gateway connection to AKS cluster 

<!---Required:
The outline of the tutorial should be included in the beginning and at
the end of every tutorial. These will align to the **procedural** H2
headings for the activity. You do not need to include all H2 headings.
Leave out the prerequisites, clean-up resources and next steps--->

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires you to run the Azure CLI version 2.0.4 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Create a resource group

In Azure, you allocate related resources to a resource group. Create a resource group by using [az group create](/cli/azure/group#az-group-create). The following example creates a resource group named *myResourceGroup* in the *canadacentral* location (region). 

```azurecli-interactive
az group create --name myResourceGroup --location canadacentral
```

## Deploy a new AKS cluster with AGIC add-on enabled

You will now deploy a new AKS cluster with the AGIC add-on enabled. When you deploy a new AKS cluster with the AGIC add-on enabled and don't provide an existing Application Gateway to use, we will automatically create and set up a new Application Gateway to serve traffic to the AKS cluster.  

> [!NOTE]
> Application Gateway Ingress Controller (AGIC) add-on **only** supports Application Gateway v2 SKUs (Standard and WAF), and **not** the Application Gateway v1 SKUs. 

In the following example, you'll be deploying a new AKS cluster named *myCluster* using [Azure CNI](https://docs.microsoft.com/azure/aks/concepts-network#azure-cni-advanced-networking) and [Managed Identities](https://docs.microsoft.com/azure/aks/use-managed-identity) with the AGIC add-on enabled in the resource group we just created, *myResourceGroup*. Since deploying a new AKS cluster with the AGIC add-on enabled without specifying an existing Application Gateway will mean an automatic creation of an Application Gateway, you'll also be specifying the name and subnet address space of the Application Gateway. The name of the Application Gateway will be *myApplicationGateway* and the subnet address space we're using is 10.2.0.0/16.  

```azurecli-interactive
az aks create -n myCluster -g myResourceGroup --network-plugin azure --enable-managed-identity -a myApplicationGateway --appgw-subnet-prefix "10.2.0.0/16" 
```

To configure additional parameters for the `az aks create` command, visit references [here](https://docs.microsoft.com/cli/azure/aks?view=azure-cli-latest#az-aks-create). 

## Deploy a sample application using AGIC for Ingress on the AKS cluster

You will now deploy an AKS cluster to serve as the backend to our Application Gateway through Azure CLI. If you already have an existing AKS cluster that you would like to use  The following example 



## Procedure 3

Include a sentence or two to explain only what is needed to complete the
procedure.
<!---Code requires specific formatting. Here are a few useful examples of
commonly used code blocks. Make sure to use the interactive functionality
where possible.

For the CLI or PowerShell based procedures, don't use bullets or
numbering.
--->

Here is an example of a code block for Java:

```java
cluster = Cluster.build(new File("src/remote.yaml")).create();
...
client = cluster.connect();
```

or a code block for Azure CLI:

```azurecli-interactive 
az vm create --resource-group myResourceGroup --name myVM --image win2016datacenter --admin-username azureuser --admin-password myPassword12
```

or a code block for Azure PowerShell:

```azurepowershell-interactive
New-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer -Image microsoft/iis:nanoserver -OsType Windows -IpAddressType Public
```


## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
2. ...click Delete, type...and then click Delete

<!---Required:
To avoid any costs associated with following the tutorial procedure, a
Clean up resources (H2) should come just before Next steps (H2)
--->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-get-started-mvc.md)

<!--- Required:
Tutorials should always have a Next steps H2 that points to the next
logical tutorial in a series, or, if there are no other tutorials, to
some other cool thing the customer can do. A single link in the blue box
format should direct the customer to the next article - and you can
shorten the title in the boxes if the original one doesn't fit.
Do not use a "More info section" or a "Resources section" or a "See also
section". --->