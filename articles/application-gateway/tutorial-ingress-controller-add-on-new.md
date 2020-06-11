---
title: Enable Ingress Controller Add-On for new AKS cluster with new Azure Application Gateway 
description: Use this tutorial to enable the Ingress Controller Add-On for your new AKS cluster with a new Application Gateway
services: application-gateway
author: caya
ms.service: application-gateway
ms.topic: article
ms.date: 06/10/2020
ms.author: caya
---

# Tutorial: Enable Application Gateway Ingress Controller add-on for a new AKS cluster with a new Application Gateway through Azure CLI (Preview)

You can use Azure CLI to enable the [Application Gateway Ingress Controller (AGIC)](ingress-controller-overview.md) add-on, which is currently in preview, for your [Azure Kubernetes Services (AKS)](https://azure.microsoft.com/services/kubernetes-service/) cluster. In this tutorial, you will create an AKS cluster with the AGIC add-on enabled which will automatically create an Application Gateway to use. You'll then deploy a sample application, which will utilize the AGIC add-on to expose the application through the Application Gateway. The add-on provides a much faster way of deploying AGIC for your AKS cluster than [previously through Helm](ingress-controller-overview.md#difference-between-helm-deployment-and-aks-add-on) and also offers a fully managed experience.    

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a resource group 
> * Create a new AKS cluster with AGIC add-on enabled 
> * Deploy a sample application using AGIC for Ingress on the AKS cluster
> * Check that the application is reachable through Application Gateway

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires you to run the Azure CLI version 2.0.4 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

Register the *AKS-IngressApplicationGatewayAddon* feature flag using the [az feature register](https://docs.microsoft.com/cli/azure/feature#az-feature-register) command as shown in the following example; you'll only need to do this once per subscription while the add-on is still in preview:
```azurecli-interactive
az feature register --name AKS-IngressApplicationGatewayAddon --namespace microsoft.containerservice
```

It might take a few minutes for the status to show Registered. You can check on the registration status using the [az feature list](https://docs.microsoft.com/cli/azure/feature#az-feature-register) command:
```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/AKS-IngressApplicationGatewayAddon')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the Microsoft.ContainerService resource provider using the [az provider register](https://docs.microsoft.com/cli/azure/provider#az-provider-register) command:
```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

Be sure to install/update the aks-preview extension for this tutorial; use the following Azure CLI commands
```azurecli-interactive
az extension add --name aks-preview
az extension list
```
```azurecli-interactive
az extension update --name aks-preview
az extension list
```

## Create a resource group

In Azure, you allocate related resources to a resource group. Create a resource group by using [az group create](/cli/azure/group#az-group-create). The following example creates a resource group named *myResourceGroup* in the *canadacentral* location (region). 

```azurecli-interactive
az group create --name myResourceGroup --location canadacentral
```

## Deploy a new AKS cluster with AGIC add-on enabled

You will now deploy a new AKS cluster with the AGIC add-on enabled. When you deploy a new AKS cluster with the AGIC add-on enabled and don't provide an existing Application Gateway to use, we will automatically create and set up a new Application Gateway to serve traffic to the AKS cluster.  

> [!NOTE]
> Application Gateway Ingress Controller (AGIC) add-on **only** supports Application Gateway v2 SKUs (Standard and WAF), and **not** the Application Gateway v1 SKUs. When deploying a new Application Gateway through the AGIC add-on, you can only deploy an Application Gateway Standard_v2 SKU. If you want to enable the AGIC add-on for an Application Gateway WAF_v2 SKU, please either enable WAF on the Application Gateway through Portal or create the WAF_v2 Application Gateway first and then follow instructions on how to [enable AGIC add-on with an existing AKS cluster and existing Application Gateway](tutorial-ingress-controller-add-on-existing.md). 

In the following example, you'll be deploying a new AKS cluster named *myCluster* using [Azure CNI](https://docs.microsoft.com/azure/aks/concepts-network#azure-cni-advanced-networking) and [Managed Identities](https://docs.microsoft.com/azure/aks/use-managed-identity) with the AGIC add-on enabled in the resource group you created, *myResourceGroup*. Since deploying a new AKS cluster with the AGIC add-on enabled without specifying an existing Application Gateway will mean an automatic creation of a Standard_v2 SKU Application Gateway, you'll also be specifying the name and subnet address space of the Application Gateway. The name of the Application Gateway will be *myApplicationGateway* and the subnet address space we're using is 10.2.0.0/16. Make sure you've added/updated the aks-preview extension at the beginning of this tutorial. 

```azurecli-interactive
az aks create -n myCluster -g myResourceGroup --network-plugin azure --enable-managed-identity -a ingress-appgw --appgw-name myApplicationGateway --appgw-subnet-prefix "10.2.0.0/16" 
```

To configure additional parameters for the `az aks create` command, visit references [here](https://docs.microsoft.com/cli/azure/aks?view=azure-cli-latest#az-aks-create). 

> [!NOTE]
> The AKS cluster that you've created will appear in the resource group you created, *myResourceGroup*. However, the automatically created Application Gateway will live in the node resource group, where the agent pools are. The node resource group by default will be named *MC_resource-group-name_cluster-name_location*, but can be modified. 

## Deploy a sample application using AGIC

You will now deploy a sample application to the AKS cluster you created that will use the AGIC add-on for Ingress and connect the Application Gateway to the AKS cluster. First, you'll get credentials to the AKS cluster you deployed by running the `az aks get-credentials` command. 

```azurecli-interactive
az aks get-credentials -n myCluster -g myResourceGroup
```

Once you have the credentials to the cluster you created, run the following command to set up a sample application that uses AGIC for Ingress to the cluster. AGIC will update the Application Gateway you set up earlier with corresponding routing rules to the new sample application you deployed.  

```azurecli-interactive
kubectl apply -f https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/docs/examples/aspnetapp.yaml 
```

## Check that the application is reachable

Now that the Application Gateway is set up to serve traffic to the AKS cluster, let's verify that your application is reachable. You'll first get the IP address of the Ingress. 

```azurecli-interactive
kubectl get ingress
```

Check that the sample application you created is up and running by either visiting the IP address of the Application Gateway that you got from running the above command or check with `curl`. It may take Application Gateway a minute to get the update, so if the Application Gateway is still in an "Updating" state on Portal, then let it finish before trying to reach the IP address. 

## Clean up resources

When no longer needed, remove the resource group, application gateway, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps
* [Learn more about disabling the AGIC add-on](./ingress-controller-disable-addon.md)
* [Learn more about which annotations are supported with AGIC](./ingress-controller-annotations.md)
* [Troubleshoot issues with AGIC](./ingress-controller-troubleshoot.md)

