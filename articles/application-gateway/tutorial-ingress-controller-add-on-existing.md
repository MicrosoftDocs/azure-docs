---
title: 'Tutorial: Enable ingress controller add-on for existing AKS cluster with existing Azure application gateway'
description: Use this tutorial to enable the Ingress Controller Add-On for your existing AKS cluster with an existing Application Gateway
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: tutorial
ms.date: 11/28/2023
ms.author: greglin
ms.custom: template-tutorial, devx-track-azurecli
---

# Tutorial: Enable application gateway ingress controller add-on for an existing AKS cluster with an existing application gateway

You can use Azure CLI or portal to enable the [application gateway ingress controller (AGIC)](ingress-controller-overview.md) add-on for an existing [Azure Kubernetes Services (AKS)](https://azure.microsoft.com/services/kubernetes-service/) cluster. In this tutorial, you'll learn how to use AGIC add-on to expose your Kubernetes application in an existing AKS cluster through an existing application gateway deployed in separate virtual networks. You'll start by creating an AKS cluster in one virtual network and an application gateway in a separate virtual network to simulate existing resources. You'll then enable the AGIC add-on, peer the two virtual networks together, and deploy a sample application that will be exposed through the application gateway using the AGIC add-on. If you're enabling the AGIC add-on for an existing application gateway and existing AKS cluster in the same virtual network, then you can skip the peering step below. The add-on provides a much faster way of deploying AGIC for your AKS cluster than [through Helm](ingress-controller-overview.md#difference-between-helm-deployment-and-aks-add-on) and also offers a fully managed experience.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a resource group 
> * Create a new AKS cluster 
> * Create a new application gateway 
> * Enable the AGIC add-on in the existing AKS cluster through Azure CLI 
> * Enable the AGIC add-on in the existing AKS cluster through Azure portal 
> * Peer the application gateway virtual network with the AKS cluster virtual network
> * Deploy a sample application using AGIC for ingress on the AKS cluster
> * Check that the application is reachable through application gateway

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Create a resource group

In Azure, you allocate related resources to a resource group. Create a resource group by using [az group create](/cli/azure/group#az-group-create). The following example creates a resource group named **myResourceGroup** in the **East US** location (region): 

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Deploy a new AKS cluster

You'll now deploy a new AKS cluster, to simulate having an existing AKS cluster that you want to enable the AGIC add-on for.  

In the following example, you'll be deploying a new AKS cluster named **myCluster** using [Azure CNI](../aks/concepts-network.md#azure-cni-advanced-networking) and [Managed Identities](../aks/use-managed-identity.md) in the resource group you created, **myResourceGroup**.

```azurecli-interactive
az aks create -n myCluster -g myResourceGroup --network-plugin azure --enable-managed-identity --generate-ssh-keys
```

To configure more parameters for the above command, see [az aks create](/cli/azure/aks#az-aks-create). 

> [!NOTE]
> A node resource group will be created with the name **MC_resource-group-name_cluster-name_location**.

## Deploy a new application gateway 

You'll now deploy a new application gateway, to simulate having an existing application gateway that you want to use to load balance traffic to your AKS cluster, **myCluster**. The name of the application gateway will be **myApplicationGateway**, but you'll need to first create a public IP resource, named **myPublicIp**, and a new virtual network called **myVnet** with address space 10.0.0.0/16, and a subnet with address space 10.0.0.0/24 called **mySubnet**, and deploy your application gateway in **mySubnet** using **myPublicIp**. 

> [!CAUTION]
> When you use an AKS cluster and application gateway in separate virtual networks, the address spaces of the two virtual networks must not overlap. The default address space that an AKS cluster deploys in is 10.224.0.0/12.


```azurecli-interactive
az network public-ip create -n myPublicIp -g myResourceGroup --allocation-method Static --sku Standard
az network vnet create -n myVnet -g myResourceGroup --address-prefix 10.0.0.0/16 --subnet-name mySubnet --subnet-prefix 10.0.0.0/24 
az network application-gateway create -n myApplicationGateway -g myResourceGroup --sku Standard_v2 --public-ip-address myPublicIp --vnet-name myVnet --subnet mySubnet --priority 100
```

> [!NOTE]
> The application gateway ingress controller (AGIC) add-on **only** supports application gateway v2 SKUs (Standard and WAF), and **not** the application gateway v1 SKUs. 

## Enable the AGIC add-on in existing AKS cluster through Azure CLI 

If you'd like to continue using Azure CLI, you can continue to enable the AGIC add-on in the AKS cluster you created, **myCluster**, and specify the AGIC add-on to use the existing application gateway you created, **myApplicationGateway**.

```azurecli-interactive
appgwId=$(az network application-gateway show -n myApplicationGateway -g myResourceGroup -o tsv --query "id") 
az aks enable-addons -n myCluster -g myResourceGroup -a ingress-appgw --appgw-id $appgwId
```

## Enable the AGIC add-on in existing AKS cluster through Azure portal 

If you'd like to use Azure portal to enable AGIC add-on, go to [(https://aka.ms/azure/portal/aks/agic)](https://aka.ms/azure/portal/aks/agic) and navigate to your AKS cluster through the portal link. From there, go to the Networking tab within your AKS cluster. You'll see an application gateway ingress controller section, which allows you to enable/disable the ingress controller add-on using the Azure portal. Select the box next to **Enable ingress controller**, and then select the application gateway you created, **myApplicationGateway** from the dropdown menu. Select **Save**.

> [!IMPORTANT]
> When you use an application gateway in a different resource group than the AKS cluster resource group, the managed identity **_ingressapplicationgateway-{AKSNAME}_** that is created must have **Contributor** and **Reader** roles set in the application gateway resource group.

:::image type="content" source="./media/tutorial-ingress-controller-add-on-existing/portal-ingress-controller-add-on.png" alt-text="Screenshot showing how to enable application gateway ingress controller from the networking page of the Azure Kubernetes Service.":::

## Peer the two virtual networks together

Since you deployed the AKS cluster in its own virtual network and the Application gateway in another virtual network, you'll need to peer the two virtual networks together in order for traffic to flow from the Application gateway to the pods in the cluster. Peering the two virtual networks requires running the Azure CLI command two separate times, to ensure that the connection is bi-directional. The first command will create a peering connection from the Application gateway virtual network to the AKS virtual network; the second command will create a peering connection in the other direction.

```azurecli-interactive
nodeResourceGroup=$(az aks show -n myCluster -g myResourceGroup -o tsv --query "nodeResourceGroup")
aksVnetName=$(az network vnet list -g $nodeResourceGroup -o tsv --query "[0].name")

aksVnetId=$(az network vnet show -n $aksVnetName -g $nodeResourceGroup -o tsv --query "id")
az network vnet peering create -n AppGWtoAKSVnetPeering -g myResourceGroup --vnet-name myVnet --remote-vnet $aksVnetId --allow-vnet-access

appGWVnetId=$(az network vnet show -n myVnet -g myResourceGroup -o tsv --query "id")
az network vnet peering create -n AKStoAppGWVnetPeering -g $nodeResourceGroup --vnet-name $aksVnetName --remote-vnet $appGWVnetId --allow-vnet-access
```

> [!NOTE]
> In the "Deploy a new AKS cluster" step above we created AKS with Azure CNI, in case you have an existing AKS cluster using [Kubenet mode](../aks/configure-kubenet.md) you need to update the route table to help the packets destined for a POD IP reach the node which is hosting the pod.
> A simple way to achieve this is by associating the same route table created by AKS to the Application Gateway's subnet. 


## Deploy a sample application using AGIC 

You'll now deploy a sample application to the AKS cluster you created that will use the AGIC add-on for Ingress and connect the application gateway to the AKS cluster. First, you'll get credentials to the AKS cluster you deployed by running the `az aks get-credentials` command. 

```azurecli-interactive
az aks get-credentials -n myCluster -g myResourceGroup
```

Once you have the credentials to the cluster you created, run the following command to set up a sample application that uses AGIC for Ingress to the cluster. AGIC will update the application gateway you set up earlier with corresponding routing rules to the new sample application you deployed.  

```azurecli-interactive
kubectl apply -f https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/docs/examples/aspnetapp.yaml 
```

## Check that the application is reachable

Now that the application gateway is set up to serve traffic to the AKS cluster, let's verify that your application is reachable. You'll first get the IP address of the Ingress. 

```azurecli-interactive
kubectl get ingress
```

Check that the sample application you created is up and running by either visiting the IP address of the application gateway that you got from running the above command or check with `curl`. It may take application gateway a minute to get the update, so if the application gateway is still in an "Updating" state on Azure portal, then let it finish before trying to reach the IP address. 

## Clean up resources

When no longer needed, delete all resources created in this tutorial by deleting **myResourceGroup** and **MC_myResourceGroup_myCluster_eastus** resource groups:

```azurecli-interactive
az group delete --name myResourceGroup 
az group delete --name MC_myResourceGroup_myCluster_eastus
```

## Next steps

> [!div class="nextstepaction"]
> [Learn more about disabling the AGIC add-on](./ingress-controller-disable-addon.md)
