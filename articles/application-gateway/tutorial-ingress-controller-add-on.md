---
title: Enable Ingress Controller Add-On for AKS with Azure Application Gateway 
description: Use this tutorial to enable the Ingress Controller Add-On for your AKS cluster with Application Gateway
services: application-gateway
author: caya
ms.service: application-gateway
ms.topic: article
ms.date: 05/19/2019
ms.author: caya
---

# Tutorial: Enable Application Gateway Ingress Controller Add-On for a new AKS Cluster with a new Application Gateway Through Azure CLI 

You can use Azure CLI to enable the [Application Gateway Ingress Controller (AGIC)](ingress-controller-overview.md) add-on for your [Azure Kubernetes Services (AKS)](https://azure.microsoft.com/services/kubernetes-service/) cluster. In this tutorial, you will create an AKS cluster with the  AGIC add-on enabled which will automatically create an Application Gateway to use. You'll then deploy a sample application which will utilize the AGIC add-on to connect the Application Gateway to the AKS cluster. The add-on provides a much faster way of deploying AGIC for your AKS cluster than previously through Helm.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a resource group 
> * Create an AKS cluster with AGIC add-on enabled 
> * Deploy a sample application using AGIC for Ingress on the AKS cluster
> * Check status of Application Gateway connection to AKS cluster 


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

> [!NOTE]
> The AKS cluster that you've created will appear in the resource group you created, *myResourceGroup*. However, the automatically created Application Gateway will live in a separate resource group, which should be called *MC_myResourceGroup_myCluster_canadacentral*. 

## Deploy a sample application using AGIC for Ingress on the AKS cluster

You will now deploy a sample application to the AKS cluster you created that will use the AGIC add-on for Ingress and connect the Application Gateway to the AKS cluster. First, you'll get credentials to the AKS cluster you deployed by running the `az aks get-credentials` command. 

```azurecli-interactive
az aks get-credentials -n myCluster -g myResourceGroup
```

Once you have the credentials to the cluster you created, run the following command to set up a sample application that uses AGIC for Ingress to the cluster. AGIC will communicate to the Application Gateway you set up earlier that there is a change in the cluster and update the backend pool with the new information. 

```azurecli-interactive
kubectl apply -f https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/docs/examples/aspnetapp.yaml 
```

## Check status of Application Gateway connection to AKS cluster 

Now that the Application Gateway is set up to serve traffic to the AKS cluster, let's verify that it's actually connected. You'll first get the IP address of the Ingress. 

```azurecli-interactive
kubectl get ingress
```

Go to the IP address of the Application Gateway that you get from running the above command. It may take Application Gateway to get the update, so if the Application Gateway is still in an "Updating" state on Portal, then let it finish before trying to reach the IP address. 

## Clean up resources

When no longer needed, remove the resource group, application gateway, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup --location canadacentral
```

## Next steps
* [Learn more about which annotations are supported with AGIC](./ingress-controller-annotations.md)
* [Enable multiple namespace support](./ingress-controller-multiple-namespace-support.md)
* [Troubleshoot issues with AGIC](./ingress-controller-troubleshoot.md)

