---
title: 'Tutorial: Enable the Ingress Controller add-on for a new AKS cluster with a new Azure Application Gateway'
description: Use this tutorial to learn how to enable the Ingress Controller add-on for your new AKS cluster with a new Application Gateway instance.
services: application-gateway
author: caya
ms.service: application-gateway
ms.topic: tutorial
ms.date: 03/02/2021
ms.author: caya
---

# Tutorial: Enable the Ingress Controller add-on for a new AKS cluster with a new Application Gateway instance

You can use the Azure CLI to enable the [Application Gateway Ingress Controller (AGIC)](ingress-controller-overview.md) add-on for a new [Azure Kubernetes Services (AKS)](https://azure.microsoft.com/services/kubernetes-service/) cluster.

In this tutorial, you'll create an AKS cluster with the AGIC add-on enabled. Creating the cluster will automatically create an Azure Application Gateway instance to use. You'll then deploy a sample application that will use the add-on to expose the application through Application Gateway. 

The add-on provides a much faster way to deploy AGIC for your AKS cluster than [previously through Helm](ingress-controller-overview.md#difference-between-helm-deployment-and-aks-add-on). It also offers a fully managed experience.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a resource group. 
> * Create a new AKS cluster with the AGIC add-on enabled.
> * Deploy a sample application by using AGIC for ingress on the AKS cluster.
> * Check that the application is reachable through Application Gateway.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

## Create a resource group

In Azure, you allocate related resources to a resource group. Create a resource group by using [az group create](/cli/azure/group#az_group_create). The following example creates a resource group named *myResourceGroup* in the *canadacentral* location (region): 

```azurecli-interactive
az group create --name myResourceGroup --location canadacentral
```

## Deploy an AKS cluster with the add-on enabled

You'll now deploy a new AKS cluster with the AGIC add-on enabled. If you don't provide an existing Application Gateway instance to use in this process, we'll automatically create and set up a new Application Gateway instance to serve traffic to the AKS cluster.  

> [!NOTE]
> The Application Gateway Ingress Controller add-on supports *only* Application Gateway v2 SKUs (Standard and WAF), and *not* the Application Gateway v1 SKUs. When you're deploying a new Application Gateway instance through the AGIC add-on, you can deploy only an Application Gateway Standard_v2 SKU. If you want to enable the add-on for an Application Gateway WAF_v2 SKU, use either of these methods:
>
> - Enable WAF on Application Gateway through the portal. 
> - Create the WAF_v2 Application Gateway instance first, and then follow instructions on how to [enable the AGIC add-on with an existing AKS cluster and existing Application Gateway instance](tutorial-ingress-controller-add-on-existing.md). 

In the following example, you'll deploy a new AKS cluster named *myCluster* by using [Azure CNI](../aks/concepts-network.md#azure-cni-advanced-networking) and [managed identities](../aks/use-managed-identity.md). The AGIC add-on will be enabled in the resource group that you created, *myResourceGroup*. 

Deploying a new AKS cluster with the AGIC add-on enabled without specifying an existing Application Gateway instance will mean an automatic creation of a Standard_v2 SKU Application Gateway instance. So, you'll also specify the name and subnet address space of the Application Gateway instance. The name of the Application Gateway instance will be *myApplicationGateway*, and the subnet address space we're using is 10.2.0.0/16.

```azurecli-interactive
az aks create -n myCluster -g myResourceGroup --network-plugin azure --enable-managed-identity -a ingress-appgw --appgw-name myApplicationGateway --appgw-subnet-cidr "10.2.0.0/16" --generate-ssh-keys
```

To configure additional parameters for the `az aks create` command, see [these references](/cli/azure/aks#az_aks_create). 

> [!NOTE]
> The AKS cluster that you created will appear in the resource group that you created, *myResourceGroup*. However, the automatically created Application Gateway instance will be in the node resource group, where the agent pools are. The node resource group by is named *MC_resource-group-name_cluster-name_location* by default, but can be modified. 

## Deploy a sample application by using AGIC

You'll now deploy a sample application to the AKS cluster that you created. The application will use the AGIC add-on for ingress and connect the Application Gateway instance to the AKS cluster. 

First, get credentials to the AKS cluster by running the `az aks get-credentials` command: 

```azurecli-interactive
az aks get-credentials -n myCluster -g myResourceGroup
```

Now that you have credentials, run the following command to set up a sample application that uses AGIC for ingress to the cluster. AGIC will update the Application Gateway instance that you set up earlier with corresponding routing rules to the new sample application that you deployed.  

```azurecli-interactive
kubectl apply -f https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/docs/examples/aspnetapp.yaml 
```

## Check that the application is reachable

Now that the Application Gateway instance is set up to serve traffic to the AKS cluster, let's verify that your application is reachable. First, get the IP address of the ingress: 

```azurecli-interactive
kubectl get ingress
```

Check that the sample application that you created is running by either:

- Visiting the IP address of the Application Gateway instance that you got from running the preceding command.
- Using `curl`. 

Application Gateway might take a minute to get the update. If Application Gateway is still in an **Updating** state on the portal, let it finish before you try to reach the IP address. 

## Clean up resources

When you no longer need them, remove the resource group, the Application Gateway instance, and all related resources:

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

> [!div class="nextstepaction"]
> [Learn about disabling the AGIC add-on](./ingress-controller-disable-addon.md)
