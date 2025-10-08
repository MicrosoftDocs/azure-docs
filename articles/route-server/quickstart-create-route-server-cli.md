---
title: 'Quickstart: Create an Azure Route Server using Azure CLI'
description: Learn how to create and configure Azure Route Server with Border Gateway Protocol (BGP) peering to network virtual appliances using Azure CLI commands for dynamic routing in your virtual network.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: quickstart
ms.date: 09/17/2025
ms.custom: mode-api, devx-track-azurecli
ms.devlang: azurecli
---

# Quickstart: Create an Azure Route Server using Azure CLI

This quickstart shows you how to create an Azure Route Server and configure BGP peering with a network virtual appliance (NVA) using Azure CLI. Azure Route Server enables dynamic routing between your virtual network and network virtual appliances, automatically exchanging routes through BGP protocols.

By completing this quickstart, you have a functioning Route Server that can facilitate dynamic route exchange with network virtual appliances in your Azure virtual network.

:::image type="content" source="./media/route-server-diagram.png" alt-text="Diagram showing Azure Route Server deployment environment with BGP peering to network virtual appliances using Azure CLI.":::

[!INCLUDE [route server preview note](../../includes/route-server-note-preview-date.md)]

## Prerequisites

Before you begin, ensure you have the following requirements:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Familiarity with [Azure Route Server service limits](route-server-faq.md#limitations).
- Access to Azure Cloud Shell or Azure CLI installed locally.

### Azure CLI setup

The steps in this article use Azure CLI commands that you can run interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To use Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block, then select **Copy** to copy the code and paste it into Cloud Shell.

Alternatively, you can [install Azure CLI locally](/cli/azure/install-azure-cli) and run the commands from your local environment. If you use Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

## Create a Route Server

This section walks you through creating the foundational infrastructure for Azure Route Server, including the resource group, virtual network, and Route Server instance.

### Create resource group and virtual network

Route Server requires a dedicated subnet named **RouteServerSubnet** with a minimum size of /26. First, create the resource group and virtual network infrastructure:

1. Create a resource group using the [az group create](/cli/azure/group#az-group-create) command:

    ```azurecli-interactive
    # Create a resource group
    az group create --name 'myResourceGroup' --location 'eastus'
    ```

1. Create a virtual network with the required RouteServerSubnet using the [az network virtual network create](/cli/azure/network/vnet#az-network-vnet-create) command:

    ```azurecli-interactive
    # Create a virtual network and RouteServerSubnet
    az network vnet create --resource-group 'myResourceGroup' --name 'myVirtualNetwork' --subnet-name 'RouteServerSubnet' --subnet-prefixes '10.0.1.0/26'
    
    # Store the subnet ID in a variable for later use
    subnetId=$(az network vnet subnet show --name 'RouteServerSubnet' --resource-group 'myResourceGroup' --vnet-name 'myVirtualNetwork' --query id -o tsv)
    ```

### Create public IP and Route Server

Route Server requires a public IP address to ensure connectivity to the backend management service:

1. Create a Standard public IP address using the [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) command:

    ```azurecli-interactive
    # Create a Standard public IP for Route Server
    az network public-ip create --resource-group 'myResourceGroup' --name 'RouteServerIP' --sku Standard --version 'IPv4'
    ```

1. Create the Route Server using the [az network routeserver create](/cli/azure/network/routeserver#az-network-routeserver-create) command:

    ```azurecli-interactive
    # Create the Route Server
    az network routeserver create --name 'myRouteServer' --resource-group 'myResourceGroup' --hosted-subnet $subnetId --public-ip-address 'RouteServerIP'
    ```

    [!INCLUDE [Deployment note](../../includes/route-server-note-creation-time.md)]

## Configure BGP peering with network virtual appliance

After creating the Route Server, configure BGP peering with your network virtual appliance to enable dynamic route exchange.

### Establish BGP peering

Use the [az network routeserver peering create](/cli/azure/network/routeserver/peering#az-network-routeserver-peering-create) command to create a BGP peering session between Route Server and your NVA:

```azurecli-interactive 
# Create BGP peering with the network virtual appliance
az network routeserver peering create --name 'myNVA' --peer-ip '10.0.0.4' --peer-asn '65001' --routeserver 'myRouteServer' --resource-group 'myResourceGroup'
```

This command creates a peer named **myNVA** with:
- **Peer IP address**: 10.0.0.4 (the NVA's IP address)
- **Autonomous System Number (ASN)**: 65001 (see [supported ASN values](route-server-faq.md#what-autonomous-system-numbers-asns-can-i-use))

> [!NOTE]
> The peer name doesn't need to match the actual NVA name; it's just an identifier for the BGP peering session.
 
### Get Route Server BGP information

To complete the BGP peering configuration on your NVA, you need the Route Server's IP addresses and ASN. Use the [az network routeserver show](/cli/azure/network/routeserver#az-network-routeserver-show) command to retrieve this information:

```azurecli-interactive
# Get Route Server details for NVA configuration
az network routeserver show --resource-group 'myResourceGroup' --name 'myRouteServer'
```

The command returns output similar to the following example. Note the **virtualRouterAsn** and **virtualRouterIps** values needed for your NVA configuration:

```output
{
  "allowBranchToBranchTraffic": false,
  "etag": "W/\"aaaa0000-bb11-2222-33cc-444444dddddd\"",
  "hubRoutingPreference": "ExpressRoute",
  "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualHubs/myRouteServer",
  "kind": "RouteServer",
  "location": "eastus",
  "name": "myRouteServer",
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "routeTable": {
    "routes": []
  },
  "routingState": "Provisioned",
  "sku": "Standard",
  "type": "Microsoft.Network/virtualHubs",
  "virtualHubRouteTableV2s": [],
  "virtualRouterAsn": 65515,
  "virtualRouterAutoScaleConfiguration": {
    "minCapacity": 2
  },
  "virtualRouterIps": [
    "10.0.1.4",
    "10.0.1.5"
  ]
}
```

Use these values to configure BGP on your NVA:
- **ASN**: 65515 (virtualRouterAsn)
- **Peer IP addresses**: 10.0.1.4 and 10.0.1.5 (virtualRouterIps)

[!INCLUDE [NVA peering note](../../includes/route-server-note-nva-peering.md)]

## Clean up resources

When you no longer need the Route Server and associated resources, delete the resource group using the [az group delete](/cli/azure/group#az-group-delete) command:

```azurecli-interactive
# Delete the resource group and all contained resources
az group delete --name 'myResourceGroup' --yes --no-wait
```

## Next step

Now that you've created a Route Server and established BGP peering, learn more about Route Server capabilities:

> [!div class="nextstepaction"]
> [Tutorial: Configure BGP peering between Route Server and network virtual appliance](peer-route-server-with-virtual-appliance.md)
