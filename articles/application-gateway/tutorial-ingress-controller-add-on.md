---
title: Tutorial: Enable Ingress Controller Add-On for AKS with Application Gateway 
description: Use this tutorial to enable the Ingress Controller Add-On for your AKS cluster with Application Gateway
author: caya
ms.service: application-gateway
ms.topic: tutorial 
ms.date: 2/19/20
---
<!---Tutorials are scenario-based procedures for the top customer tasks
identified in milestone one of the
[Content + Learning content model](contribute-get-started-mvc.md).
You only use tutorials to show the single best procedure for completing
an approved top 10 customer task.
--->

# Tutorial: Enable Application Gateway Ingress Controller Add-On for an Existing AKS Cluster with an Existing Application Gateway with Azure CLI 

You can use Azure CLI to enable the [Application Gateway Ingress Controller (AGIC)](ingress-controller-overview.md) add-on for your [Azure Kubernetes Services (AKS)](https://azure.microsoft.com/services/kubernetes-service/) cluster. In this tutorial, you will create an AKS cluster, an Application Gateway, and enable the AGIC add-on for the AKS cluster using the Application Gateway you created. The add-on provides a much faster way of deploying AGIC for your AKS cluster than previously.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy an Application Gateway v2
> * Create an AKS Cluster
> * Enable the Application Gateway Ingress Controller Add-On

<!---Required:
The outline of the tutorial should be included in the beginning and at
the end of every tutorial. These will align to the **procedural** H2
headings for the activity. You do not need to include all H2 headings.
Leave out the prerequisites, clean-up resources and next steps--->

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires you to run the Azure CLI version 2.0.4 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Prerequisites

### Resource group

In Azure, you allocate related resources to a resource group. Create a resource group by using [az group create](/cli/azure/group#az-group-create). The following example creates a resource group named *myResourceGroup* in the *canadacentral* location (region). 

```azurecli-interactive
az group create --name myResourceGroup --location canadacentral
```

### Public IP Address

In order to deploy an Application Gateway, it must have at least a public IP address. The following example creates a public IP resource named *myPublicIPAddress* in the resource group you just created. 

```azurecli-interactive
az network public-ip create --resource-group myResourceGroup --name myPublicIPAddress --allocation-method Static --sku Standard
```

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com)

## Deploy an Application Gateway v2 

Using the public IP address and the resource group created in the prerequisites step, we will deploy an Application Gateway v2 WAF SKU through Azure CLI. It is important to note that the Application Gateway Ingress Controller (AGIC) add-on **only** supports Application Gateway v2 SKUs (Standard and WAF), and **not** the Application Gateway v1 SKUs. In the following example, you'll be deploying an Application Gateway v2 WAF SKU named *myApplicationGateway* using the previously created public IP address and resource group. 

```azurecli-interactive
az network application-gateway create --name myApplicationGateway --location canadacentral --resource-group myResourceGroup --sku WAF_v2 --public-ip-address myPublicIPAddress
```

To configure additional parameters for the `az network application-gateway create` command, visit references [here](https://docs.microsoft.com/cli/azure/network/application-gateway?view=azure-cli-latest#az-network-application-gateway-create). 

## Create an AKS Cluster

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