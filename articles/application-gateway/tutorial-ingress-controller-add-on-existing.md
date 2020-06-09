---
title: Enable Ingress Controller Add-On for existing AKS cluster with existing Azure Application Gateway 
description: Use this tutorial to enable the Ingress Controller Add-On for your existing AKS cluster with an existing Application Gateway
services: application-gateway
author: caya
ms.service: application-gateway
ms.topic: article
ms.date: 06/8/2020
ms.author: caya
---

# Tutorial: Enable Application Gateway Ingress Controller Add-On for an existing AKS Cluster with an existing Application Gateway Through Azure CLI (Preview)

You can use Azure CLI to enable the [Application Gateway Ingress Controller (AGIC)](ingress-controller-overview.md) add-on, which is currently in preview, for your [Azure Kubernetes Services (AKS)](https://azure.microsoft.com/services/kubernetes-service/) cluster. In this tutorial, you will create an AKS cluster, create an Application Gateway, and then enable the AGIC add-on using those two existing components. You'll then deploy a sample application which will utilize the AGIC add-on to connect the Application Gateway to the AKS cluster. The add-on provides a much faster way of deploying AGIC for your AKS cluster than previously through Helm and also offers a fully managed experience.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a resource group 
> * Create an AKS cluster 
> * Create an Application Gateway 
> * Enable the AGIC add-on in the existing AKS cluster with the existing Application Gateway 
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

## Deploy a new AKS cluster

You will now deploy a new AKS cluster, to simulate having an existing AKS cluster that you want to enable the AGIC add-on on.  

In the following example, you'll be deploying a new AKS cluster named *myCluster* using [Azure CNI](https://docs.microsoft.com/azure/aks/concepts-network#azure-cni-advanced-networking) and [Managed Identities](https://docs.microsoft.com/azure/aks/use-managed-identity) in the resource group we just created, *myResourceGroup*.    

```azurecli-interactive
az aks create -n myCluster -g myResourceGroup --network-plugin azure --enable-managed-identity 
```

To configure additional parameters for the `az aks create` command, visit references [here](https://docs.microsoft.com/cli/azure/aks?view=azure-cli-latest#az-aks-create). 

## Deploy a new Application Gateway 

You will now deploy a new Application Gateway, to simulate having an existing Application Gateway that you want to use to load balance traffic to your AKS cluster, *myCluster*. The name of the Application Gateway will be *myApplicationGateway*, but you will need to first create a public IP resource, named *myPublicIp*, and a new Virtual Network called *myVnet* with address space 11.0.0.0/8, and a subnet with address space 11.1.0.0/16 called *mySubnet*, and deploy your Application Gateway in *mySubnet* using *myPublicIp*. 

```azurecli-interactive
az network public-ip create -n myPublicIp -g MyResourceGroup --allocation-method Static --sku Standard
az network vnet create -n myVnet -g myResourceGroup --address-prefix 11.0.0.0/8 --subnet-name mySubnet --subnet-prefix 11.1.0.0/16 
az network application-gateway create -n myApplicationGateway -l canadacentral -g myResourceGroup --sku Standard_v2 --public-ip-address myPublicIp --vnet-name myVnet --subnet mySubnet
```

> [!NOTE]
> Application Gateway Ingress Controller (AGIC) add-on **only** supports Application Gateway v2 SKUs (Standard and WAF), and **not** the Application Gateway v1 SKUs. 

## Enable the AGIC add-on for the AKS cluster

Now, you'll enable the AGIC add-on in the AKS cluster you created, *myCluster*, and specify the AGIC add-on to use the existing Application Gateway you created, *myApplicationGateway*. If the first command `az extension add -n aks-preview` returns `Extension 'aks-preview' is already installed`, then run `az extension`**`update`**`-n aks-preview` instead. Make sure that the subnet prefix you provide matches the subnet prefix that the Application Gateway is deployed in. 

```azurecli-interactive
az extension add -n aks-preview
appgwId=$(az network application-gateway show -n myApplicationGateway -g myResourceGroup -o tsv --query "id") 
az aks enable-addons -n myCluster -g myResourceGroup -a ingress-appgw --appgw-id $appgwId
```

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

Check that the sample app you created is up and running by either visiting the IP address of the Application Gateway that you got from running the above command in your browser or check with `curl`. It may take Application Gateway a minute to get the update, so if the Application Gateway is still in an "Updating" state on Portal, then let it finish before trying to reach the IP address. 

## Clean up resources

When no longer needed, remove the resource group, application gateway, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup --location canadacentral
```

## Next steps
* [Learn more about disabling the AGIC add-on]()
* [Learn more about which annotations are supported with AGIC](./ingress-controller-annotations.md)
* [Enable multiple namespace support](./ingress-controller-multiple-namespace-support.md)
* [Troubleshoot issues with AGIC](./ingress-controller-troubleshoot.md)

