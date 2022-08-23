---
title: 'Quickstart: Create a mesh network topology with Azure Virtual Network Manager via the Azure CLI'
description: Use this quickstart to learn how to create a mesh network topology with Virtual Network Manager using the Azure CLI.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: quickstart
ms.date: 08/23/2022
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

Select the subscription where network manager will be deployed.

```azurecli-interactive
az account set \
    --subscription "<subscription ID>"
```
      
## Create a resource group 

Before you can deploy Azure Virtual Network Manager, you have to create a resource group to host a network manager with [az group create](/cli/azure/group#az-group-create). This example creates a resource group named **myAVNMResourceGroup** in the **westus** location:

```azurecli-interactive
az group create \
    --name "myAVNMResourceGroup" \
    --location "westus"
```

## Create a Virtual Network Manager

Define the scope and access type this Network Manager instance will have. Create the scope by using [az network manager create](/cli/azure/network/manager#az-network-manager-create). Replace the value  *<subscription_id>* with the subscription you want Virtual Network Manager to manage virtual networks for. For management groups, replace *<mgName>* with the management group to manage.

```azurecli-interactive
az network manager create \
    --location "westus" \
    --name "myAVNM" \
    --resource-group "myAVNMResourceGroup" \
    --scope-accesses "Connectivity" "SecurityAdmin" \
    --network-manager-scopes management-groups="/Microsoft.Management/<mgName>" subscriptions="/subscriptions/<subscription_id>"
```
## Create a Network Group

Virtual Network Manager applies configurations to groups of VNets by placing them in **Network Groups.** Create a network group with [az network manager group create](/cli/azure/network/manager/group#az-network-manager-group-create).

```azurecli-interactive
az network manager group create \
    --name "myNetworkGroup" \
    --network-manager-name "myAVNM" \
    --resource-group "myAVNMResourceGroup"
```
## Create three virtual networks

Create three virtual networks with [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). This example creates virtual networks named **VNetA**, **VNetB**,**VNetC** and **VNetD** in the **West US** location. Each virtual network will have a tag of **networkType** used for dynamic membership. If you already have virtual networks you want create a mesh network with, you can skip to the next section.

```azurecli-interactive
az network vnet create \
    --name "VNetA" \
    --resource-group "myAVNMResourceGroup" \
    --address-prefix "10.0.0.0/16"
    --tags "networkType=Prod"

az network vnet create \
    --name "VNetB" \
    --resource-group "myAVNMResourceGroup" \
    --address-prefix "10.1.0.0/16"
    --tags "networkType=Prod"

az network vnet create \
    --name "VNetC" \
    --resource-group "myAVNMResourceGroup" \
    --address-prefix "10.2.0.0/16"
    --tags "networkType=Prod"
```
az network vnet create \
    --name "VNetD" \
    --resource-group "myAVNMResourceGroup" \
    --address-prefix "10.3.0.0/16"
    --tags "networkType=Test"
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
az network vnet subnet create \
    --name "default" \
    --resource-group "myAVNMResourceGroup" \
    --vnet-name "VNetD" \
    --address-prefix "10.3.0.0/24"
```
## Define membership for a mesh configuration

Azure Virtual Network manager allows you two methods for adding membership to a network group. Static membership involves manually adding virtual networks, and dynamic membership involves using Azure Policy to dynamically add virtual networks based on conditions. Choose the option you wish to complete for your mesh configuration membership

### Static membership option

Using **static membership**, you'll manually add 3 VNets for your Mesh configuration to your Network Group with [az network manager group static-member create](/cli/azure/network/manager/group/static-member#az-network-manager-group-static-member-create). Replace <subscription_id> with the subscription these VNets were created under.

```azurecli-interactive
az network manager group static-member create \
    --name "VNetA" \
    --network-group "myNetworkGroup" \
    --network-manager "myAVNM" \
    --resource-group "myAVNMResourceGroup" \
    --resource-id "/subscriptions/<subscription_id>/resourceGroups/myAVNMResourceGroup/providers/Microsoft.Network/virtualnetworks/VNetA"
```

```azurecli-interactive
az network manager group static-member create \
    --name "VNetB" \
    --network-group "myNetworkGroup" \
    --network-manager "myAVNM" \
    --resource-group "managerAVNMResourceGroup" \
    --resource-id "/subscriptions/<subscription_id>/resourceGroups/myAVNMResourceGroup/providers/Microsoft.Network/virtualnetworks/VNetB"
```

```azurecli-interactive
az network manager group static-member create \
    --name "VNetC" \
    --network-group "myNetworkGroup" \
    --network-manager "myAVNM" \
    --resource-group "managerAVNMResourceGroup" \
    --resource-id "/subscriptions/<subscription_id>/resourceGroups/myAVNMResourceGroup/providers/Microsoft.Network/virtualnetworks/VNetC"
```
### Dynamic membership option

Using Azure Policy, you'll dynamically add the three VNets with a tag **networkType** value of *Prod* to the Network Group. These are the three virtual networks to become part of the mesh configuration

> [!NOTE] 
> Policies can be applied to a subscription or management group, and must always be defined *at or above* the level they're created. Only virtual networks within a policy scope are added to a Network Group.

### Create a Policy definition
Create a Policy definition with [az policy definition create](/cli/azure/policy/definition#az-policy-definition-create) for virtual networks tagged as **Prod**. Replace {mg} with the management group you want to apply this policy to. If you want to apply it to a subscription, replace the `--management-group <mgName>` parameter with `--subscription <subscription_id>`.

```azurecli-interactive
az policy definition create \
    --name "ProdVNets" \
    --description "Take only virtual networks with VNet in the name and the tag Color:Red" \
    --rules ""{\"if\":{\"allOf\":[{\"field\":\"tags['networkType']\",\"equals\":\"Prod\"}]},\"then\":{\"effect\":\"addToNetworkGroup\",\"details\":{\"networkGroupId\":\"%networkGroupId%\"}}}"" \
    --management-group "<mgName>" \
    --mode "Microsoft.Network.Data"
```
### Apply a Policy definition

Once a policy is defined, it must also be applied with [az policy assignment create](/cli/azure/policy/assignment#az-policy-assignment-create). Replace *<subscription_id>* with the subscription you want to apply this policy to. If you want to apply it to a management group, replace `--scope "/subscriptions/<subscription_id>"` with `--scope "/providers/Microsoft.Management/managementGroups/<mgName>`, and replace *<mgName>* with your management group.

```azurecli-interactive
az policy assignment create \
    --name "ProdVNets" \
    --description "Take only virtual networks tagged NetworkType:Prod" \
    --scope "/providers/Microsoft.Management/subscriptions/<subscription_id>" \
    --policy "/providers/Microsoft.Management/subscriptions/<subscription_id>/providers/Microsoft.Authorization/policyDefinitions/ProdVNets"
```

## Create a configuration

Now that the Network Group is created, and has the correct VNets, create a mesh network topology configuration with [az network manager connect-config create](/cli/azure/network/manager/connect-config#az-network-manager-connect-config-create). Replace <subscription_id> with your subscription.

```azurecli-interactive
az network manager connect-config create \
    --configuration-name "connectivityconfig" \
    --description "Production Mesh Connectivity Config Example" \
    --applies-to-groups network-group-id="/subscriptions/<subscription_id>/resourceGroups/myAVNMResourceGroup/providers/Microsoft.Network/networkManagers/myAVNM/networkGroups/myNetworkGroup" \
    --connectivity-topology "Mesh" \
    --network-manager-name "myAVNM" \
    --resource-group "managerAVNMResourceGroup"
```
## Commit deployment

For the configuration to take effect, commit the configuration to the target regions with [az network manager post-commit](/cli/azure/network/manager#az-network-manager-post-commit):

```azurecli-interactive
az network manager post-commit \
    --network-manager-name "myAVNM" \
    --commit-type "Connectivity" \
    --configuration-ids "/subscriptions/<subscriptionId>/resourceGroups/myANVMResourceGroup/providers/Microsoft.Network/networkManagers/myAVNM/connectivityConfigurations/connectivityconfig" \
    --target-locations "westus" \
    --resource-group "myAVNMResourceGroup"
```
## Verify configuration
Virtual Networks will display configurations applied to them with [az network manager list-effective-connectivity-config](/cli/azure/network/manager#az-network-manager-list-effective-connectivity-config):

```azurecli-interactive
az network manager list-effective-connectivity-config \
    --resource-group "myAVNMResourceGroup" \
    --virtual-network-name "VNetA"

az network manager list-effective-connectivity-config \
    --resource-group "myAVNMResourceGroup" \
    --virtual-network-name "VNetB"


az network manager list-effective-connectivity-config \
    --resource-group "myAVNMResourceGroup" \
    --virtual-network-name "VNetC"

az network manager list-effective-connectivity-config \
    --resource-group "myAVNMResourceGroup" \
    --virtual-network-name "VNetD"
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
