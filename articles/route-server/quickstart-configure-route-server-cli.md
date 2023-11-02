---
title: 'Quickstart: Create and configure Route Server - Azure CLI'
description: In this quickstart, you learn how to create and configure an Azure Route Server using Azure CLI.
author: halkazwini
ms.author: halkazwini
ms.service: route-server
ms.topic: quickstart
ms.date: 08/14/2023
ms.custom: mode-api, devx-track-azurecli
ms.devlang: azurecli
---

# Quickstart: Create and configure Route Server using Azure CLI 

This article helps you configure Azure Route Server to peer with a Network Virtual Appliance (NVA) in your virtual network using Azure PowerShell. Route Server learns routes from your NVA and program them on the virtual machines in the virtual network. Azure Route Server will also advertise the virtual network routes to the NVA. For more information, see [Azure Route Server](overview.md).

:::image type="content" source="media/quickstart-configure-route-server-portal/environment-diagram.png" alt-text="Diagram of Route Server deployment environment using the Azure CLI." border="false":::

[!INCLUDE [route server preview note](../../includes/route-server-note-preview-date.md)]

##  Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal. You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.
- Review the [service limits for Azure Route Server](route-server-faq.md#limitations).

## Create a resource group and a virtual network 

### Create a resource group

Before you can create an Azure Route Server, you have to create a resource group to host the Route Server. Create a resource group with [az group create](/cli/azure/group#az-group-create). This example creates a resource group named **myRouteServerRG** in the **westus** location:

```azurecli-interactive
az group create \
    --name myRouteServerRG \
    --location westus
```

### Create a virtual network

Create a virtual network with [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). This example creates a default virtual network named **myVirtualNetwork**. If you already have a virtual network, you can skip to the next section.

```azurecli-interactive
az network vnet create \
    --name myVirtualNetwork \
    --resource-group myRouteServerRG \
    --address-prefix 10.0.0.0/16 
``` 

### Add a dedicated subnet 

Azure Route Server requires a dedicated subnet named *RouteServerSubnet*. The subnet size has to be at least /27 or shorter prefix (such as /26 or /25), otherwise you may receive an error message when deploying the Route Server. Create a subnet configuration named **RouteServerSubnet** with [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create):

1. Run the following command to add the *RouteServerSubnet* to your virtual network.

    ```azurecli-interactive 
    az network vnet subnet create \
        --name RouteServerSubnet \
        --resource-group myRouteServerRG \
        --vnet-name myVirtualNetwork \
        --address-prefix 10.0.0.0/24
    ``` 

1. Make note of the RouteServerSubnet ID. To obtain and store the resource ID of the *RouteServerSubnet* to the `subnet_id` variable, use [az network vnet subnet show](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-show):

    ```azurecli-interactive 
    subnet_id=$(az network vnet subnet show \
        --name RouteServerSubnet \
        --resource-group myRouteServerRG \
        --vnet-name myVirtualNetwork \
        --query id -o tsv) 

    echo $subnet_id
    ```

## Create the Route Server 

1. To ensure connectivity to the backend service that manages Route Server configuration, assigning a public IP address is required. Create a Standard Public IP named **RouteServerIP** with [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create):

    ```azurecli-interactive
    az network public-ip create \
        --name RouteServerIP \
        --resource-group myRouteServerRG \
        --version IPv4 \
        --sku Standard
    ```

2. Create the Azure Route Server with [az network routeserver create](/cli/azure/network/routeserver#az-network-routeserver-create). This example creates an Azure Route Server named **myRouteServer**. The *hosted-subnet* is the resource ID of the RouteServerSubnet created in the previous section.

    ```azurecli-interactive
    az network routeserver create \
        --name myRouteServer \
        --resource-group myRouteServerRG \
        --hosted-subnet $subnet_id \
        --public-ip-address RouteServerIP
    ``` 

## Create BGP peering with an NVA 

Use [az network routeserver peering create](/cli/azure/network/routeserver/peering#az-network-routeserver-peering-create) to establish BGP peering between the Route Server and the NVA: 

The `peer-ip` is the virtual network IP assigned to the NVA. The `peer-asn` is the Autonomous System Number (ASN) configured in the NVA. The ASN can be any 16-bit number other than the ones in the range of 65515-65520. This range of ASNs are reserved by Microsoft.

```azurecli-interactive 
az network routeserver peering create \
    --name myNVA \
    --peer-ip 192.168.0.1 \
    --peer-asn 65501 \
    --routeserver myRouteServer \
    --resource-group myRouteServerRG
``` 

To set up peering with a different NVA or another instance of the same NVA for redundancy, use the previous command with different *PeerName*, *PeerIp*, and *PeerAsn*.

## Complete the configuration on the NVA 

To complete the configuration on the NVA and enable the BGP sessions, you need the IP and the ASN of Azure Route Server. You can get this information by using [az network routeserver show](/cli/azure/network/routeserver#az-network-routeserver-show):

```azurecli-interactive 
az network routeserver show \
    --name myRouteServer \
    --resource-group myRouteServerRG 
``` 

The output will look like the following:

``` 
RouteServerAsn  : 65515 

RouteServerIps  : {10.5.10.4, 10.5.10.5}  "virtualRouterAsn": 65515, 

  "virtualRouterIps": [ 

    "10.0.0.4", 

    "10.0.0.5" 

  ], 

``` 

[!INCLUDE [NVA peering note](../../includes/route-server-note-nva-peering.md)]

## Configure route exchange 

If you have a virtual network gateway (ExpressRoute or VPN) in the same virtual network, you can enable *b2b traffic* to exchange routes between the gateway and the Route Server.

[!INCLUDE [VPN gateway note](../../includes/route-server-note-vpn-gateway.md)]

[!INCLUDE [downtime note](../../includes/route-server-note-vng-downtime.md)]

1. To enable route exchange between Azure Route Server and the gateway(s), use [az network routerserver update](/cli/azure/network/routeserver#az-network-routeserver-update) with the `--allow-b2b-traffic` flag set to **true**:

    ```azurecli-interactive 
    az network routeserver update \
        --name myRouteServer \
        --resource-group myRouteServerRG \
        --allow-b2b-traffic true 
    ``` 

2. To disable route exchange between Azure Route Server and the gateway(s), use [az network routerserver update](/cli/azure/network/routeserver#az-network-routeserver-update) with the `--allow-b2b-traffic` flag set to **false**:

    ```azurecli-interactive
    az network routeserver update \
        --name myRouteServer \
        --resource-group myRouteServerRG \
        --allow-b2b-traffic false 
    ``` 

## Troubleshooting 

Use the [az network routeserver peering list-advertised-routes](/cli/azure/network/routeserver/peering#az-network-routeserver-peering-list-advertised-routes) to view routes advertised by the Azure Route Server:

```azurecli-interactive 
az network routeserver peering list-advertised-routes \
    --name myNVA \
    --routeserver myRouteServer \
    --resource-group myRouteServerRG
```

Use the [az network routeserver peering list-learned-routes](/cli/azure/network/routeserver/peering#az-network-routeserver-peering-list-learned-routes) to view routes learned by the Azure Route Server:

```azurecli-interactive
az network routeserver peering list-learned-routes \
    --name myNVA \
    --routeserver myRouteServer
    --resource-group myRouteServerRG \
```

[!INCLUDE [azure-cli-troubleshooting.md](../../includes/azure-cli-troubleshooting.md)]

## Clean up resources

If you no longer need the Azure Route Server, use the first command to remove the BGP peering and then the second command to remove the Route Server. 

1. Remove the BGP peering between Azure Route Server and an NVA with [az network routeserver peering delete](/cli/azure/network/routeserver/peering#az-network-routeserver-peering-delete):

    ```azurecli-interactive
    az network routeserver peering delete \
        --name myNVA \
        --routeserver myRouteServer \
        --resource-group myRouteServerRG
    ``` 

2. Remove the Azure Route Server with [az network routeserver delete](/cli/azure/network/routeserver#az-network-routeserver-delete): 

    ```azurecli-interactive 
    az network routeserver delete \
        --name myRouteServer \
        --resource-group myRouteServerRG
    ``` 

## Next steps

After you've created the Azure Route Server, continue on to learn more about how Azure Route Server interacts with ExpressRoute and VPN Gateways: 

> [!div class="nextstepaction"]
> [Azure ExpressRoute and Azure VPN support](expressroute-vpn-support.md)
