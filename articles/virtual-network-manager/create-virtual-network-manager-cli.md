---
title: 'Quickstart: Create a mesh network topology with Azure Virtual Network Manager via the Azure CLI'
description: Use this quickstart to learn how to create a mesh network topology with Virtual Network Manager by using the Azure CLI.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: quickstart
ms.date: 03/15/2023
ms.custom: mode-api, devx-track-azurecli 
ms.devlang: azurecli
---

# Quickstart: Create a mesh network topology with Azure Virtual Network Manager by using the Azure CLI

Get started with Azure Virtual Network Manager by using the Azure CLI to manage connectivity for all your virtual networks.

In this quickstart, you deploy three virtual networks and use Azure Virtual Network Manager to create a mesh network topology. Then you verify that the connectivity configuration was applied.

:::image type="content" source="media/create-virtual-network-manager-portal/virtual-network-manager-resources-diagram.png" alt-text="Diagram of resources deployed for a mesh virtual network topology with Azure virtual network manager.":::

> [!IMPORTANT]
> Azure Virtual Network Manager is generally available for Virtual Network Manager and hub-and-spoke connectivity configurations. Mesh connectivity configurations and security admin rules remain in public preview.
>
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- The [latest Azure CLI](/cli/azure/install-azure-cli), or you can use Azure Cloud Shell in the portal.
- The Azure Virtual Network Manager extension. To add it, run `az extension add -n virtual-network-manager`.
- To modify dynamic network groups, you must be [granted access via Azure RBAC role](concept-network-groups.md#network-groups-and-azure-policy) assignment only. Classic Admin/legacy authorization is not supported.

## Sign in to your Azure account and select your subscription

To begin your configuration, sign in to your Azure account. If you use the Cloud Shell **Try It** feature, you're signed in automatically.

```azurecli
az login
```

Select the subscription where Virtual Network Manager is deployed:

```azurecli
az account set \
    --subscription "<subscription_id>"
```

Update the Virtual Network Manager extension for Azure CLI:

```azurecli
az extension update --name virtual-network-manager
```

## Create a resource group

Before you can deploy Azure Virtual Network Manager, you have to create a resource group to host it by using [az group create](/cli/azure/group#az-group-create). This example creates a resource group named *myAVNMResourceGroup* in the West US location:

```azurecli
az group create \
    --name "myAVNMResourceGroup" \
    --location "westus"
```

## Create a Virtual Network Manager instance

Define the scope and access type for this Virtual Network Manager instance. Create the scope by using [az network manager create](/cli/azure/network/manager#az-network-manager-create). Replace the value  `<subscription_id>` with the subscription that you want Virtual Network Manager to manage virtual networks for. Replace `<mgName\>` with the management group that you want to manage.

```azurecli
az network manager create \
    --location "westus" \
    --name "myAVNM" \
    --resource-group "myAVNMResourceGroup" \
    --scope-accesses "Connectivity" "SecurityAdmin" \
    --network-manager-scopes subscriptions="/subscriptions/<subscription_id>"
```

## Create a network group

Virtual Network Manager applies configurations to groups of virtual networks by placing them in network groups. Create a network group by using [az network manager group create](/cli/azure/network/manager/group#az-network-manager-group-create):

```azurecli
az network manager group create \
    --name "myNetworkGroup" \
    --network-manager-name "myAVNM" \
    --resource-group "myAVNMResourceGroup" \
    --description "Network Group for Production virtual networks"
```

## Create virtual networks

Create five virtual networks by using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). This example creates virtual networks named *VNetA*, *VNetB*, *VNetC*, and *VNetD* in the West US location. Each virtual network has a tag of `networkType` that's used for dynamic membership. If you already have virtual networks that you want create a mesh network with, you can skip to the next section.

```azurecli
az network vnet create \
    --name "VNetA" \
    --resource-group "myAVNMResourceGroup" \
    --address-prefix "10.0.0.0/16" \
    --tags "NetworkType=Prod"

az network vnet create \
    --name "VNetB" \
    --resource-group "myAVNMResourceGroup" \
    --address-prefix "10.1.0.0/16" \
    --tags "NetworkType=Prod"

az network vnet create \
    --name "VNetC" \
    --resource-group "myAVNMResourceGroup" \
    --address-prefix "10.2.0.0/16" \
    --tags "NetworkType=Prod"

az network vnet create \
    --name "VNetD" \
    --resource-group "myAVNMResourceGroup" \
    --address-prefix "10.3.0.0/16" \
    --tags "NetworkType=Test"

az network vnet create \
    --name "VNetE" \
    --resource-group "myAVNMResourceGroup" \
    --address-prefix "10.4.0.0/16" \
    --tags "NetworkType=Test"
```

### Add a subnet to each virtual network

Complete the configuration of the virtual networks by adding a */24* subnet to each one. Create a subnet configuration named *default* by using [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create):

```azurecli 
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

az network vnet subnet create \
    --name "default" \
    --resource-group "myAVNMResourceGroup" \
    --vnet-name "VNetD" \
    --address-prefix "10.3.0.0/24"

az network vnet subnet create \
    --name "default" \
    --resource-group "myAVNMResourceGroup" \
    --vnet-name "VNetE" \
    --address-prefix "10.4.0.0/24"
```

## Define membership for a mesh configuration

Azure Virtual Network Manager allows two methods for adding membership to a network group. Static membership involves manually adding virtual networks, and dynamic membership involves using Azure Policy to dynamically add virtual networks based on conditions. Choose the option that you want to complete for your mesh configuration membership.

### Static membership option

By using static membership, you manually add three virtual networks for your mesh configuration to your network group via [az network manager group static-member create](/cli/azure/network/manager/group/static-member#az-network-manager-group-static-member-create). Replace `<subscription_id>` with the subscription that these virtual networks were created under.

```azurecli
az network manager group static-member create \
    --name "VNetA" \
    --network-group "myNetworkGroup" \
    --network-manager "myAVNM" \
    --resource-group "myAVNMResourceGroup" \
    --resource-id "/subscriptions/<subscription_id>/resourceGroups/myAVNMResourceGroup/providers/Microsoft.Network/virtualnetworks/VNetA"
```

```azurecli
az network manager group static-member create \
    --name "VNetB" \
    --network-group "myNetworkGroup" \
    --network-manager "myAVNM" \
    --resource-group "myAVNMResourceGroup" \
    --resource-id "/subscriptions/<subscription_id>/resourceGroups/myAVNMResourceGroup/providers/Microsoft.Network/virtualnetworks/VNetB"
```

```azurecli
az network manager group static-member create \
    --name "VNetC" \
    --network-group "myNetworkGroup" \
    --network-manager "myAVNM" \
    --resource-group "myAVNMResourceGroup" \
    --resource-id "/subscriptions/<subscription_id>/resourceGroups/myAVNMResourceGroup/providers/Microsoft.Network/virtualnetworks/VNetC"
```

### Dynamic membership option

By using [Azure Policy](concept-azure-policy-integration.md), you can dynamically add the three virtual networks with a `networkType` value of `Prod` to the network group. These three virtual networks will become part of the mesh configuration.

You can apply policies to a subscription or a management group, and you must always define them *at or above* the level where you create them. Only virtual networks within a policy scope are added to a network group.

### Create a policy definition

Create a policy definition by using [az policy definition create](/cli/azure/policy/definition#az-policy-definition-create) for virtual networks tagged as `Prod`. Replace `<subscription_id>` with the subscription that you want to apply this policy to. If you want to apply it to a management group, replace `--subscription <subscription_id>` with `--management-group <mgName>`.

```azurecli
az policy definition create \
    --name "ProdVNets" \
    --description "Choose Prod virtual networks only" \
    --rules "{\"if\":{\"allOf\":[{\"field\":\"Name\",\"contains\":\"VNet\"},{\"field\":\"tags['NetworkType']\",\"equals\":\"Prod\"}]},\"then\":{\"effect\":\"addToNetworkGroup\",\"details\":{\"networkGroupId\":\"/subscriptions/<subscription_id>/resourceGroups/myAVNMResourceGroup/providers/Microsoft.Network/networkManagers/myAVNM/networkGroups/myNetworkGroup\"}}}" \
    --subscription <subscription_id> \
    --mode "Microsoft.Network.Data"

```

### Apply a policy definition

After you define a policy, you must apply it by using [az policy assignment create](/cli/azure/policy/assignment#az-policy-assignment-create). Replace `<subscription_id>` with the subscription that you want to apply this policy to. If you want to apply it to a management group, replace `--scope "/subscriptions/<subscription_id>"` with `--scope "/providers/Microsoft.Management/managementGroups/<mgName>`, and replace `<mgName\>` with your management group.

```azurecli


az policy assignment create \
    --name "ProdVNets" \
    --description "Take only virtual networks tagged NetworkType:Prod" \
    --scope "/subscriptions/<subscription_id>" \
    --policy "/subscriptions/<subscription_id>/providers/Microsoft.Authorization/policyDefinitions/ProdVNets"
```

## Create a configuration

Now that you've created the network group and given it the correct virtual networks, create a mesh network topology configuration by using [az network manager connect-config create](/cli/azure/network/manager/connect-config#az-network-manager-connect-config-create). Replace `<subscription_id>` with your subscription.

```azurecli
az network manager connect-config create \
    --configuration-name "connectivityconfig" \
    --description "Production Mesh Connectivity Config Example" \
    --applies-to-groups network-group-id="/subscriptions/<subscription_id>/resourceGroups/myAVNMResourceGroup/providers/Microsoft.Network/networkManagers/myAVNM/networkGroups/myNetworkGroup" \
    --connectivity-topology "Mesh" \
    --network-manager-name "myAVNM" \
    --resource-group "myAVNMResourceGroup"
```

## Commit the deployment

For the configuration to take effect, commit the configuration to the target regions by using [az network manager post-commit](/cli/azure/network/manager#az-network-manager-post-commit):

```azurecli
az network manager post-commit \
    --network-manager-name "myAVNM" \
    --commit-type "Connectivity" \
    --configuration-ids "/subscriptions/<subscription_id>/resourceGroups/myANVMResourceGroup/providers/Microsoft.Network/networkManagers/myAVNM/connectivityConfigurations/connectivityconfig" \
    --target-locations "westus" \
    --resource-group "myAVNMResourceGroup"
```

## Verify the configuration

Virtual networks display configurations applied to them when you use [az network manager list-effective-connectivity-config](/cli/azure/network/manager#az-network-manager-list-effective-connectivity-config):

```azurecli
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

For the virtual networks that are part of the connectivity configuration, you get an output similar to this example:

```json
{
  "skipToken": "",
  "value": [
    {
      "appliesToGroups": [
        {
          "groupConnectivity": "None",
          "isGlobal": "False",
          "networkGroupId": "/subscriptions/<subscription_id>/resourceGroups/myAVNMResourceGroup/providers/Microsoft.Network/networkManagers/myAVNM/networkGroups/myNetworkGroup",
          "useHubGateway": "False"
        }
      ],
      "configurationGroups": [
        {
          "description": "Network Group for Production virtual networks",
          "id": "/subscriptions/<subscription_id>/resourceGroups/myAVNMResourceGroup/providers/Microsoft.Network/networkManagers/myAVNM/networkGroups/myNetworkGroup",
          "provisioningState": "Succeeded",
          "resourceGroup": "myAVNMResourceGroup"
        }
      ],
      "connectivityTopology": "Mesh",
      "deleteExistingPeering": "False",
      "description": "Production Mesh Connectivity Config Example",
      "hubs": [],
      "id": "/subscriptions/<subscription_id>/resourceGroups/myAVNMResourceGroup/providers/Microsoft.Network/networkManagers/myAVNM/connectivityConfigurations/connectivityconfig",
      "isGlobal": "False",
      "provisioningState": "Succeeded",
      "resourceGroup": "myAVNMResourceGroup"
    }
  ]
}
```

For virtual networks that aren't part of the network group, like *VNetD*, an output similar to this example appears:

```json
az network manager list-effective-connectivity-config     --resource-group "myAVNMResourceGroup"     --virtual-network-name "VNetD-test"
{
  "skipToken": "",
  "value": []
}
```

## Clean up resources

If you no longer need the Azure Virtual Network Manager instance, make sure all of the following points are true before you delete the resource:

* There are no deployments of configurations to any region.
* All configurations have been deleted.
* All network groups have been deleted.

To delete the resource:

1. Remove the connectivity deployment by committing no configurations with [az network manager post-commit](/cli/azure/network/manager#az-network-manager-post-commit):

    ```azurecli
    az network manager post-commit \
        --network-manager-name "myAVNM" \
        --commit-type "Connectivity" \
        --target-locations "westus" \
        --resource-group "myAVNMResourceGroup"
    ```

1. Remove the connectivity configuration by using [az network manager connect-config delete](/cli/azure/network/manager/connect-config#az-network-manager-connect-config-delete):

    ```azurecli
    az network manager connect-config delete \
        --configuration-name "connectivityconfig" \
        --name "myAVNM" \
        --resource-group "myAVNMResourceGroup"
    ```

1. Remove the network group by using [az network manager group delete](/cli/azure/network/manager/group#az-network-manager-group-delete):

    ```azurecli
    az network manager group delete \
        --name "myNetworkGroup" \
        --network-manager-name "myAVNM" \
        --resource-group "myAVNMResourceGroup"
    ```

1. Delete the network manager instance by using [az network manager delete](/cli/azure/network/manager#az-network-manager-delete):

    ```azurecli
    az network manager delete \
        --name "myAVNM" \
        --resource-group "myAVNMResourceGroup"
    ```

1. If you no longer need the resource that you created, delete the resource group by using [az group delete](/cli/azure/group#az-group-delete):

    ```azurecli
    az group delete \
        --name "myAVNMResourceGroup"
    ```

## Next steps

Now that you've created an Azure Virtual Network Manager instance, learn how to block network traffic by using a security admin configuration:

> [!div class="nextstepaction"]
> [Block network traffic with Azure Virtual Network Manager](how-to-block-network-traffic-portal.md)
