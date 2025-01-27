---
title: 'Quickstart: Create an Azure Route Server - Azure CLI'
description: In this quickstart, you learn how to create an Azure Route Server using the Azure CLI.
author: halkazwini
ms.author: halkazwini
ms.service: azure-route-server
ms.topic: quickstart
ms.date: 09/23/2024
ms.custom: mode-api, devx-track-azurecli
ms.devlang: azurecli
---

# Quickstart: Create an Azure Route Server using the Azure CLI 

In this quickstart, you learn how to create an Azure Route Server to peer with a network virtual appliance (NVA) in your virtual network using the Azure CLI.

:::image type="content" source="media/quickstart-create-route-server-portal/environment-diagram.png" alt-text="Diagram of Route Server deployment environment using the Azure CLI." lightbox="media/quickstart-create-route-server-portal/environment-diagram.png":::

[!INCLUDE [route server preview note](../../includes/route-server-note-preview-date.md)]

##  Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Review the [service limits for Azure Route Server](route-server-faq.md#limitations).

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

## Create a route server

In this section, you create a route server. Prior to creating the route server, create a resource group to host all resources including the route server. You'll also need to create a virtual network with a dedicated subnet for the route server.

1. Create a resource group using [az group create](/cli/azure/group#az-group-create) command. The following example creates a resource group named **RouteServerRG** in the **WestUS** region:

    ```azurecli-interactive
    # Create a resource group.
    az group create --name 'RouteServerRG' --location 'westus'
    ```

1. Create a virtual network using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) command. The following example creates a default virtual network named **myRouteServerVNet** in the **WestUS** region with **RouteServerSubnet** subnet. The route server requires a dedicated subnet named *RouteServerSubnet*. The subnet size has to be at least /27 or shorter prefix (such as /26 or /25) or you'll receive an error message when deploying the route server. 

    ```azurecli-interactive
    # Create a virtual network and a route server subnet. 
    az network vnet create --resource-group 'RouteServerRG' --name 'myRouteServerVNet' --subnet-name 'RouteServerSubnet' --subnet-prefixes '10.0.1.0/27'
    # Place the subnet ID into a variable.
    subnetId=$(az network vnet subnet show --name 'RouteServerSubnet' --resource-group 'RouteServerRG' --vnet-name 'myRouteServerVNet' --query id -o tsv)
    ``` 

1. To ensure connectivity to the backend service that manages Route Server configuration, assigning a public IP address is required. Create a Standard Public IP named **RouteServerIP** using [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) command.

    ```azurecli-interactive
    # Create a Standard public IP.
    az network public-ip create --resource-group 'RouteServerRG' --name 'RouteServerIP' --sku Standard --version 'IPv4'
    ```

1. Create the route server using [az network routeserver create](/cli/azure/network/routeserver#az-network-routeserver-create) command. The following example creates a route server named **myRouteServer** in the **WestUS** region. The *HostedSubnet* is the resource ID of the RouteServerSubnet created in the previous steps.

    ```azurecli-interactive
    # Create the route server.
    az network routeserver create --name 'myRouteServer' --resource-group 'RouteServerRG' --hosted-subnet $subnetId --public-ip-address 'RouteServerIP'
    ``` 

    [!INCLUDE [Deployment note](../../includes/route-server-note-creation-time.md)]

## Set up peering with NVA

In this section, you learn how to configure BGP peering with a network virtual appliance (NVA). Use [az network routeserver peering create](/cli/azure/network/routeserver/peering#az-network-routeserver-peering-create) command to establish BGP peering from the route server to your NVA. The following example adds a peer named **myNVA** that has an IP address of **10.0.0.4** and an ASN of **65001**. For more information, see [What Autonomous System Numbers (ASNs) can I use?](route-server-faq.md#what-autonomous-system-numbers-asns-can-i-use)

```azurecli-interactive 
# Add a peer.
az network routeserver peering create --name 'myNVA' --peer-ip '10.0.0.4' --peer-asn '65001' --routeserver 'myRouteServer' --resource-group 'RouteServerRG'
``` 

## Complete the configuration on the NVA 

To complete the peering setup, you must configure the NVA to establish a BGP session with the route server's peer IPs and ASN. Use [az network routeserver show](/cli/azure/network/routeserver#az-network-routeserver-show) command to get the IP and ASN of the route server.

```azurecli-interactive
# Get the route server details.
az network routeserver show --resource-group 'RouteServerRG' --name 'myRouteServer'
``` 

The output should look similar to the following example:

```output
{
  "allowBranchToBranchTraffic": false,
  "etag": "W/\"aaaa0000-bb11-2222-33cc-444444dddddd\"",
  "hubRoutingPreference": "ExpressRoute",
  "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/RouteServerRG/providers/Microsoft.Network/virtualHubs/myRouteServer",
  "kind": "RouteServer",
  "location": "westus",
  "name": "myRouteServer",
  "provisioningState": "Succeeded",
  "resourceGroup": "RouteServerRG",
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

[!INCLUDE [NVA peering note](../../includes/route-server-note-nva-peering.md)]

## Clean up resources

When no longer needed, delete the resource group and all of the resources it contains using [az group delete](/cli/azure/group#az-group-delete) command.

```azurecli-interactive
# Delete the resource group and all the resources it contains. 
az group delete --name 'RouteServerRG' --yes --no-wait
```

## Next step

> [!div class="nextstepaction"]
> [Configure peering between a route server and NVA](peer-route-server-with-virtual-appliance.md)
