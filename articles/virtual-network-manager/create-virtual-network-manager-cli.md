---
title: 'Quickstart: Create a mesh network topology with Azure Virtual Network Manager via the Azure CLI'
description: Use this quickstart to learn how to create a mesh network topology with Virtual Network Manager by using the Azure CLI.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: quickstart
ms.date: 01/15/2025
ms.custom: mode-api, devx-track-azurecli 
ms.devlang: azurecli
---

# Quickstart: Create a mesh network topology with Azure Virtual Network Manager by using the Azure CLI

Get started with Azure Virtual Network Manager by using the Azure CLI to manage connectivity for all your virtual networks.

In this quickstart, you deploy three virtual networks and use Azure Virtual Network Manager to create a mesh network topology. Then you verify that the connectivity configuration was applied.

:::image type="content" source="media/create-virtual-network-manager-portal/virtual-network-manager-resources-diagram.png" alt-text="Diagram of resources deployed for a mesh virtual network topology with Azure virtual network manager." lightbox="media/create-virtual-network-manager-portal/virtual-network-manager-resources-diagram.png":::

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- The [latest Azure CLI](/cli/azure/install-azure-cli), or you can use Azure Cloud Shell in the portal.
- The Azure Virtual Network Manager extension. To add it, run `az extension add -n virtual-network-manager`.
- To modify dynamic network groups, you must be [granted access via Azure RBAC role](concept-network-groups.md#network-groups-and-azure-policy) assignment only. Classic Admin/legacy authorization isn't supported.

## Sign in to your Azure account and select your subscription

To begin your configuration, sign in to your Azure account. If you use the Cloud Shell **Try It** feature, you're signed in automatically.

```azurecli
az login
```

Select the subscription where Virtual Network Manager is deployed:

```azurecli
az account set \
    --subscription "<subscriptionID>"
```

Update the Virtual Network Manager extension for Azure CLI:

```azurecli
az extension update --name virtual-network-manager
```

## Create a resource group

In this task, you create a resource group to host  a network manager instance by using [az group create](/cli/azure/group#az-group-create). This example creates a resource group named *resource-group* in the *(US) West 2* location:

```azurecli
az group create \
    --name "resource-group" \
    --location "westus2"
```

## Create a Virtual Network Manager instance

In this task, define the scope and access type for this Virtual Network Manager instance. Create the scope by using [az network manager create](/cli/azure/network/manager#az-network-manager-create). Replace the value  `<subscriptionID>` with the subscription that you want Virtual Network Manager to manage virtual networks for. Replace `<mgName\>` with the management group that you want to manage.

```azurecli
az network manager create \
    --location "westus2" \
    --name "network-manager" \
    --resource-group "resource-group" \
    --scope-accesses "Connectivity" "SecurityAdmin" \
    --network-manager-scopes subscriptions="/subscriptions/<subscriptionID>"
```

## Create a network group

In this task, create a network group by using [az network manager group create](/cli/azure/network/manager/group#az-network-manager-group-create):

```azurecli
az network manager group create \
    --name "network-group" \
    --network-manager-name "network-manager" \
    --resource-group "resource-group" \
    --description "Network Group for Production virtual networks"
```

## Create virtual networks

In this task, create three virtual networks using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). This example creates virtual networks named three virtual in the *(US) West 2* location. Each virtual network has a tag of `networkType` that's used for dynamic membership. If you already have virtual networks that you want create a mesh network with, you can skip to the next section.

```azurecli
az network vnet create \
    --name "vnet-00" \
    --resource-group "resource-group" \
    --address-prefix "10.0.0.0/16" \
    --tags "NetworkType=Prod"

az network vnet create \
    --name "vnet-01" \
    --resource-group "resource-group" \
    --address-prefix "10.1.0.0/16" \
    --tags "NetworkType=Prod"

az network vnet create \
    --name "vnet-02" \
    --resource-group "resource-group" \
    --address-prefix "10.2.0.0/16" \
    --tags "NetworkType=Prod"
```

### Add a subnet to each virtual network

In this task, complete the configuration of the virtual networks by adding a */24* subnet to each one. Create a subnet configuration named *default* by using [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create):

```azurecli 
az network vnet subnet create \
    --name "default" \
    --resource-group "resource-group" \
    --vnet-name "vnet-00" \
    --address-prefix "10.0.0.0/24"

az network vnet subnet create \
    --name "default" \
    --resource-group "resource-group" \
    --vnet-name "vnet-01" \
    --address-prefix "10.1.0.0/24"

az network vnet subnet create \
    --name "default" \
    --resource-group "resource-group" \
    --vnet-name "vnet-02" \
    --address-prefix "10.2.0.0/24"
```

## Define membership for a mesh configuration

Azure Virtual Network Manager allows two methods for adding membership to a network group. Static membership involves manually adding virtual networks, and dynamic membership involves using Azure Policy to dynamically add virtual networks based on conditions. Choose the option that you want to complete for your mesh configuration membership.

# [Manual membership](#tab/manualmembership)

By using static membership, you manually add three virtual networks for your mesh configuration to your network group via [az network manager group static-member create](/cli/azure/network/manager/group/static-member#az-network-manager-group-static-member-create). Replace `<subscriptionID>` with the subscription that these virtual networks were created under.

```azurecli
az network manager group static-member create \
    --name "vnet-00" \
    --network-group "network-group" \
    --network-manager "network-manager" \
    --resource-group "resource-group" \
    --resource-id "/subscriptions/<subscriptionID>/resourceGroups/resource-group/providers/Microsoft.Network/virtualnetworks/vnet-00"
```

```azurecli
az network manager group static-member create \
    --name "vnet-01" \
    --network-group "network-group" \
    --network-manager "network-manager" \
    --resource-group "resource-group" \
    --resource-id "/subscriptions/<subscriptionID>/resourceGroups/resource-group/providers/Microsoft.Network/virtualnetworks/vnet-01"
```

```azurecli
az network manager group static-member create \
    --name "vnet-02" \
    --network-group "network-group" \
    --network-manager "network-manager" \
    --resource-group "resource-group" \
    --resource-id "/subscriptions/<subscriptionID>/resourceGroups/resource-group/providers/Microsoft.Network/virtualnetworks/vnet-02"
```

# [Azure Policy](#tab/azurepolicy)

By using [Azure Policy](concept-azure-policy-integration.md), you can dynamically add the three virtual networks with a `networkType` value of `Prod` to the network group. These three virtual networks become part of the mesh configuration once deployed.

You can apply policies to a subscription or a management group, and you must always define them *at or above* the level where you create them. Only virtual networks within a policy scope are added to a network group.

## Create a policy definition

In this task, create a policy definition by using [az policy definition create](/cli/azure/policy/definition#az-policy-definition-create) for virtual networks tagged as `Prod`. Replace `<subscriptionID>` with the subscription that you want to apply this policy to. If you want to apply it to a management group, replace `--subscription <subscriptionID>` with `--management-group <mgName>`.

```azurecli
az policy definition create \
    --name "azure-policy" \
    --description "Choose Prod virtual networks only" \
    --rules "{\"if\":{\"allOf\":[{\"field\":\"Name\",\"contains\":\"vnet\"},{\"field\":\"tags['NetworkType']\",\"equals\":\"Prod\"}]},\"then\":{\"effect\":\"addToNetworkGroup\",\"details\":{\"networkGroupId\":\"/subscriptions/<subscriptionID>/resourceGroups/resource-group/providers/Microsoft.Network/networkManagers/network-manager/networkGroups/network-group\"}}}" \
    --subscription <subscriptionID> \
    --mode "Microsoft.Network.Data"
```

## Apply a policy definition

In this task, you apply the previously created policy using [az policy assignment create](/cli/azure/policy/assignment#az-policy-assignment-create). Replace `<subscriptionID>` with the subscription that you want to apply this policy to. If you want to apply it to a management group, replace `--scope "/subscriptions/<subscriptionID>"` with `--scope "/providers/Microsoft.Management/managementGroups/<mgName>`, and replace `<mgName\>` with your management group.

```azurecli

az policy assignment create \
    --name "azure-policy-assignment" \
    --description "Take only virtual networks tagged NetworkType:Prod" \
    --scope "/subscriptions/<subscriptionID>" \
    --policy "/subscriptions/<subscriptionID>/providers/Microsoft.Authorization/azure-policys/azure-policy"
```
---

## Create a configuration

In this task, create a mesh network topology configuration by using [az network manager connect-config create](/cli/azure/network/manager/connect-config#az-network-manager-connect-config-create). Replace `<subscriptionID>` with your subscription ID.

```azurecli
az network manager connect-config create \
    --configuration-name "connectivityconfig" \
    --description "Production Mesh Connectivity Config Example" \
    --applies-to-groups '[{"networkGroupId": "/subscriptions/<subscriptionID>/resourceGroups/resource-group/providers/Microsoft.Network/networkManagers/network-manager/networkGroups/network-group", "groupConnectivity": "None"}]' \
    --connectivity-topology "Mesh" \
    --network-manager-name "network-manager" \
    --resource-group "resource-group"
```

## Commit the deployment

For the configuration to take effect, commit the configuration to the target regions by using [az network manager post-commit](/cli/azure/network/manager#az-network-manager-post-commit):

```azurecli
az network manager post-commit \
    --network-manager-name "network-manager" \
    --commit-type "Connectivity" \
    --configuration-ids "/subscriptions/<subscriptionID>/resourceGroups/resource-group/providers/Microsoft.Network/networkManagers/network-manager/connectivityConfigurations/connectivityconfig" \
    --target-locations "westus2" \
    --resource-group "resource-group"
```

## Verify the configuration

Virtual networks display configurations applied to them when you use [az network manager list-effective-connectivity-config](/cli/azure/network/manager#az-network-manager-list-effective-connectivity-config):

```azurecli
az network manager list-effective-connectivity-config \
    --resource-group "resource-group" \
    --virtual-network-name "vnet-00"

az network manager list-effective-connectivity-config \
    --resource-group "resource-group" \
    --virtual-network-name "vnet-01"


az network manager list-effective-connectivity-config \
    --resource-group "resource-group" \
    --virtual-network-name "vnet-02"
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
          "networkGroupId": "/subscriptions/<subscriptionID>/resourceGroups/resource-group/providers/Microsoft.Network/networkManagers/network-manager/networkGroups/network-group",
          "useHubGateway": "False"
        }
      ],
      "configurationGroups": [
        {
          "description": "Network Group for Production virtual networks",
          "id": "/subscriptions/<subscriptionID>/resourceGroups/resource-group/providers/Microsoft.Network/networkManagers/network-manager/networkGroups/network-group",
          "provisioningState": "Succeeded",
          "resourceGroup": "resource-group"
        }
      ],
      "connectivityTopology": "Mesh",
      "deleteExistingPeering": "False",
      "description": "Production Mesh Connectivity Config Example",
      "hubs": [],
      "id": "/subscriptions/<subscriptionID>/resourceGroups/resource-group/providers/Microsoft.Network/networkManagers/network-manager/connectivityConfigurations/connectivityconfig",
      "isGlobal": "False",
      "provisioningState": "Succeeded",
      "resourceGroup": "resource-group"
    }
  ]
}
```

## Clean up resources

If you no longer need the Azure Virtual Network Manager instance and other resources, delete the resource group by using [az group delete](/cli/azure/group#az-group-delete):

```azurecli
az group delete \
    --name "resource-group"
```

## Next steps

In this step you learn how to block network traffic by using a security admin configuration:

> [!div class="nextstepaction"]
> [Block network traffic with Azure Virtual Network Manager](how-to-block-network-traffic-portal.md)
