---
title: 'Tutorial: Enable the Ingress Controller add-on for a new AKS cluster with a new Azure application gateway'
description: Use this tutorial to learn how to enable the Ingress Controller add-on for your new AKS cluster with a new application gateway instance.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: tutorial
ms.date: 02/07/2024
ms.author: greglin
ms.custom: template-tutorial, devx-track-azurecli
---

# Tutorial: Enable the ingress controller add-on for a new AKS cluster with a new application gateway instance

You can use the Azure CLI to enable the [application gateway ingress controller (AGIC)](ingress-controller-overview.md) add-on for a new [Azure Kubernetes Services (AKS)](https://azure.microsoft.com/services/kubernetes-service/) cluster.

In this tutorial, you'll create an AKS cluster with the AGIC add-on enabled. Creating the cluster will automatically create an Azure application gateway instance to use. You'll then deploy a sample application that will use the add-on to expose the application through application gateway. 

The add-on provides a much faster way to deploy AGIC for your AKS cluster than [previously through Helm](ingress-controller-overview.md#difference-between-helm-deployment-and-aks-add-on). It also offers a fully managed experience.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a resource group. 
> * Create a new AKS cluster with the AGIC add-on enabled.
> * Deploy a sample application by using AGIC for ingress on the AKS cluster.
> * Check that the application is reachable through application gateway.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Create a resource group

In Azure, you allocate related resources to a resource group. Create a resource group by using [az group create](/cli/azure/group#az-group-create). The following example creates a resource group named **myResourceGroup** in the **East US** location (region): 

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Deploy an AKS cluster with the add-on enabled

You'll now deploy a new AKS cluster with the AGIC add-on enabled. If you don't provide an existing application gateway instance to use in this process, you'll automatically create and set up a new application gateway instance to serve traffic to the AKS cluster.  

> [!NOTE]
> The application gateway ingress controller add-on supports *only* application gateway v2 SKUs (Standard and WAF), and *not* the application gateway v1 SKUs. When you're deploying a new application gateway instance through the AGIC add-on, you can deploy only an application gateway Standard_v2 SKU. If you want to enable the add-on for an application gateway WAF_v2 SKU, use either of these methods:
>
> - Enable WAF on application gateway through the portal. 
> - Create the WAF_v2 application gateway instance first, and then follow instructions on how to [enable the AGIC add-on with an existing AKS cluster and existing application gateway instance](tutorial-ingress-controller-add-on-existing.md). 

In the following example, you'll deploy a new AKS cluster named *myCluster* by using [Azure CNI](../aks/concepts-network.md#azure-cni-advanced-networking) and [managed identities](../aks/use-managed-identity.md). The AGIC add-on will be enabled in the resource group that you created, **myResourceGroup**. 

Deploying a new AKS cluster with the AGIC add-on enabled without specifying an existing application gateway instance will automatically create a Standard_v2 SKU application gateway instance. You'll need to specify a name and subnet address space for the new application gateway instance. The address space must be from 10.224.0.0/12 prefix used by the AKS virtual network without overlapping with 10.224.0.0/16 prefix used by the AKS subnet. In this tutorial, use *myApplicationGateway* for the application gateway name and *10.225.0.0/16* for its subnet address space.

```azurecli-interactive
az aks create -n myCluster -g myResourceGroup --network-plugin azure --enable-managed-identity -a ingress-appgw --appgw-name myApplicationGateway --appgw-subnet-cidr "10.225.0.0/16" --generate-ssh-keys
```

> [NOTE!] 
> Please ensure the identity used by AGIC has the **Microsoft.Network/virtualNetworks/subnets/join/action** permission delegated to the subnet Application Gateway is deployed into. If a custom role is not defined with this permission, you may use the built-in _Network Contributor_ role, which contains the _Microsoft.Network/virtualNetworks/subnets/join/action_ permission.

```azurecli-interactive
# Get application gateway id from AKS addon profile
appGatewayId=$(az aks show -n myCluster -g myResourceGroup -o tsv --query "addonProfiles.ingressApplicationGateway.config.effectiveApplicationGatewayId")

# Get Application Gateway subnet id
appGatewaySubnetId=$(az network application-gateway show --ids $appGatewayId -o tsv --query "gatewayIPConfigurations[0].subnet.id")

# Get AGIC addon identity
agicAddonIdentity=$(az aks show -n myCluster -g myResourceGroup -o tsv --query "addonProfiles.ingressApplicationGateway.identity.clientId")

# Assign network contributor role to AGIC addon identity to subnet that contains the Application Gateway
az role assignment create --assignee $agicAddonIdentity --scope $appGatewaySubnetId --role "Network Contributor"
```

To configure more parameters for the above command, see [az aks create](/cli/azure/aks#az-aks-create). 

> [!NOTE]
> The AKS cluster that you created will appear in the resource group that you created, **myResourceGroup**. However, the automatically created application gateway instance will be in the node resource group, where the agent pools are. The node resource group is named **MC_resource-group-name_cluster-name_location** by default, but can be modified. 

## Deploy a sample application by using AGIC

You'll now deploy a sample application to the AKS cluster that you created. The application will use the AGIC add-on for ingress and connect the application gateway instance to the AKS cluster. 

First, get credentials to the AKS cluster by running the `az aks get-credentials` command: 

```azurecli-interactive
az aks get-credentials -n myCluster -g myResourceGroup
```

Now that you have credentials, run the following command to set up a sample application that uses AGIC for ingress to the cluster. AGIC will update the application gateway instance that you set up earlier with corresponding routing rules to the sample application you're deploying.  

```azurecli-interactive
kubectl apply -f https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/docs/examples/aspnetapp.yaml 
```

## Check that the application is reachable

Now that the application gateway instance is set up to serve traffic to the AKS cluster, let's verify that your application is reachable. First, get the IP address of the ingress: 

```azurecli-interactive
kubectl get ingress
```

Check that the sample application that you created is running by either:

- Visiting the IP address of the application gateway instance that you got from running the preceding command.
- Using `curl`. 

Application gateway might take a minute to get the update. If application gateway is still in an **Updating** state on the portal, let it finish before you try to reach the IP address. 

## Clean up resources

When you no longer need them, delete all resources created in this tutorial by deleting **myResourceGroup** and **MC_myResourceGroup_myCluster_eastus** resource groups:

```azurecli-interactive
az group delete --name myResourceGroup
az group delete --name MC_myResourceGroup_myCluster_eastus
```

## Next steps

In this tutorial, you:

- Created new AKS cluster with the AGIC add-on enabled
- Deployed a sample application by using AGIC for ingress on the AKS cluster

To learn more about AGIC, see [What is Application Gateway Ingress Controller](ingress-controller-overview.md) and [Disable and re-enable AGIC add-on for your AKS cluster](ingress-controller-disable-addon.md).

To learn how to enable application gateway ingress controller add-on for an existing AKS cluster with an existing application gateway, advance to the next tutorial.

> [!div class="nextstepaction"]
> [Enable AGIC for existing AKS and application gateway](tutorial-ingress-controller-add-on-existing.md)
