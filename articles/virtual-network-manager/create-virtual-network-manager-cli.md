---
title: 'Quickstart: Create a mesh network topology with Azure Virtual Network Manager via the Azure CLI'
description: Use this quickstart to learn how to create a mesh network topology with Virtual Network Manager using the Azure CLI.
author: duongau
ms.author: duau
ms.service: virtual-network-manager
ms.topic: quickstart
ms.date: 11/16/2021
ms.custom: mode-api, devx-track-azurecli 
ms.devlang: azurecli
---

# Quickstart: Create a mesh network topology with Azure Virtual Network Manager via the Azure CLI

Get started with Azure Virtual Network Manager by using the Azure CLI to manage connectivity for all your virtual networks.

In this quickstart, you'll deploy three virtual networks and use Azure Virtual Network Manager to create a mesh network topology. Then you'll verify if the connectivity configuration got applied.

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Make sure you have the [latest Azure CLI](/cli/azure/install-azure-cli) or you can use Azure Cloud Shell in the portal.
* Run `az extension add -n virtual-network-manager` to add the Azure Virtual Network Manager extension.

##  Sign in to your Azure account and select your subscription

To begin your configuration, sign in to your Azure account. If you use the Cloud Shell "Try It", you're signed in automatically. Use the following examples to help you connect:

```azurecli-interactive
az login
```

Select the subscription for which you want to create an ExpressRoute circuit.

```azurecli-interactive
az account set \
    --subscription "<subscription ID>"
```

## Create a resource group 

Before you can create an Azure Route Server, you have to create a resource group to host the Route Server. Create a resource group with [az group create](/cli/azure/group#az-group-create). This example creates a resource group named **myAVNMResourceGroup** in the **westus** location:

```azurecli-interactive
az group create \
    --name "myAVNMResourceGroup" \
    --location "westus"
```

## Create a Virtual Network Manager

Define the scope and access type this Network Manager instance will have. Create the scope by using [az network manager create](/cli/azure/network/manager#az-network-manager-create). Replace the value *{mgName}* with management group name or *{subscriptionId}* with subscriptions you want Virtual Network Manager to manage virtual networks for.

```azurecli-interactive
az network manager create \
    --location "westus" \
    --name "myAVNM" \
    --resource-group "myAVNMResourceGroup" \
    --scope-accesses "Connectivity" "SecurityAdmin" \
    --network-manager-scopes management-groups="/Microsoft.Management/{mgName}" subscriptions="/subscriptions/{subscriptionId}"
```

## Create three virtual networks

Create three virtual networks with [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). This example creates virtual networks named **VNetA**, **VNetB** and **VNetC** in the **westus** location. If you already have virtual networks you want create a mesh network with, you can skip to the next section.

```azurecli-interactive
az network vnet create \
    --name "VNetA" \
    --resource-group "myAVNMResourceGroup" \
    --address-prefix "10.0.0.0/16"

az network vnet create \
    --name "VNetB" \
    --resource-group "myAVNMResourceGroup" \
    --address-prefix "10.1.0.0/16"

az network vnet create \
    --name "VNetC" \
    --resource-group "myAVNMResourceGroup" \
    --address-prefix "10.2.0.0/16"
```

### Add a subnet to each virtual network

To complete the configuration of the virtual networks add a /24 subnet to each one. Create a subnet configuration named **default** with [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create):

```azurecli-interactive 
az network vnet subnet create \
    --name "default" \
    --resource-group "myAVNMResourceGroup" \
    --vnet-name "VNetA" \
    --address-prefix "10.0.0.0/24"

az network vnet subnet create \
    --name "default" \
    --resource-group "myAVNMResourceGroup" \
    --vnet-name "VNetB" \
    --address-prefix "10.1.0.0/24"

az network vnet subnet create \
    --name "default" \
    --resource-group "myAVNMResourceGroup" \
    --vnet-name "VNetC" \
    --address-prefix "10.2.0.0/24"
```

## Create a network group

Create a network group using static membership with [az network manager group create](/cli/azure/network/manager/group#az-network-manager-group-create). Replace the value *{subscriptionId}* with the subscription the virtual network is in.

```azurecli-interactive
az network manager group create \
    --name "myNetworkGroup" \
    --network-manager-name "myAVNM" \
    --member-type "Microsoft.Network/virtualNetworks" \
    --resource-group "myAVNMResourceGroup"
```

## Create a configuration

Create a mesh network topology configuration with [az network manager connect-config create](/cli/azure/network/manager/connect-config#az-network-manager-connect-config-create):

```azurecli-interactive
az network manager connect-config create \
    --configuration-name "connectivityconfig" \
    --description "CLI Mesh Connectivity Config Example" \
    --applies-to-groups network-group-id="/subscriptions/{subscriptionId}/resourceGroups/myAVNMResourceGroup/providers/Microsoft.Network/networkManagers/myAVNM/networkGroups/myNetworkGroup" \
    --connectivity-topology "Mesh" \
    --delete-existing-peering true \
    --network-manager-name "myAVNM" \
    --resource-group "myAVNMResourceGroup"
```

## Commit deployment

Commit a connectivity configuration with [az network manager post-commit](/cli/azure/network/manager#az-network-manager-post-commit):

```azurecli-interactive
az network manager post-commit \
    --network-manager-name "myAVNM" \
    --commit-type "Connectivity" \
    --configuration-ids "/subscriptions/{subscriptionId}/resourceGroups/myANVMResourceGroup/providers/Microsoft.Network/networkManagers/myAVNM/connectivityConfigurations/connectivityconfig" \
    --target-locations "westus" \
    --resource-group "myAVNMResourceGroup"
```

## Clean up resources

If you no longer need the Azure Virtual Network Manager, you'll need to make sure all of following are true before you can delete the resource:

* There are no deployments of configurations to any region.
* All configurations have been deleted.
* All network groups have been deleted.

1. Remove the connectivity deployment by committing no configurations with [az network manager post-commit](/cli/azure/network/manager#az-network-manager-post-commit):

    ```azurecli-interactive
    az network manager post-commit \
        --network-manager-name "myAVNM" \
        --commit-type "Connectivity" \
        --target-locations "westus" \
        --resource-group "myAVNMResourceGroup"
    ```

1. Remove the connectivity configuration with [az network manager connect-config delete](/cli/azure/network/manager/connect-config#az-network-manager-connect-config-delete):

    ```azurecli-interactive
    az network manager connect-config delete \
        --configuration-name "connectivityconfig" \
        --name "myAVNM" \
        --resource-group "myAVNMResourceGroup"
    ```

1. Remove the network group with [az network manager group delete](/cli/azure/network/manager/group#az-network-manager-group-delete):

    ```azurecli-interactive
    az network manager group delete \
        --name "myNetworkGroup" \
        --network-manager-name "myAVNM" \
        --resource-group "myAVNMResourceGroup"
    ```

1. Delete the network manager instance with [az network manager delete](/cli/azure/network/manager#az-network-manager-delete):

    ```azurecli-interactive
    az network manager delete \
        --name "myAVNM" \
        --resource-group "myAVNMResourceGroup"
    ```

1. If you no longer need the resource created, delete the resource group with [az group delete](/cli/azure/group#az-group-delete):

    ```azurecli-interactive
    az group delete \
        --name "myAVNMResourceGroup"
    ```

## Next steps

After you've created the Azure Virtual Network Manager, continue on to learn how to block network traffic by using the security admin configuration:

> [!div class="nextstepaction"]
> [Block network traffic with security admin rules](how-to-block-network-traffic-portal.md)
