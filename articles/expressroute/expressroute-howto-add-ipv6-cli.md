---
title: 'Azure ExpressRoute: Add IPv6 support using Azure CLI'
description: Learn how to add IPv6 support to connect to Azure deployments using Azure CLI.
services: expressroute
author: duongau
ms.service: expressroute
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 09/27/2021
ms.author: duau
---

# Add IPv6 support for private peering using Azure CLI

This article describes how to add IPv6 support to connect via ExpressRoute to your resources in Azure using Azure CLI.

## Prerequisites

* Review the [prerequisites](expressroute-prerequisites.md) and [workflows](expressroute-workflows.md) before you begin configuration.
* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Install the latest version of the CLI commands (2.0 or later). For information about installing the CLI commands, see [Install the Azure CLI](/cli/azure/install-azure-cli) and [Get Started with Azure CLI](/cli/azure/get-started-with-azure-cli).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Add IPv6 Private Peering to your ExpressRoute circuit

1. [Create an ExpressRoute circuit](howto-circuit-cli.md) or use an existing circuit. View the circuit details by running the following:

    ```azurecli-interactive
    az network express-route show --resource-group "<ExpressRouteResourceGroup>" --name "<MyCircuit>"
    ```

2. View the private peering configuration for the circuit by running the following:

    ```azurecli-interactive
    az network express-route peering show -g "<ExpressRouteResourceGroup>" --circuit-name "<MyCircuit>" --name AzurePrivatePeering
    ```

3. Add an IPv6 Private Peering to your existing IPv4 Private Peering configuration. Provide a pair of /126 IPv6 subnets that you own for your primary link and secondary links. From each of these subnets, you will assign the first usable IP address to your router as Microsoft uses the second usable IP for its router.

    ```azurecli-interactive
    az network express-route peering update -g "<ExpressRouteResourceGroup>" --circuit-name "<MyCircuit>" --name AzurePrivatePeering --ip-version ipv6 --primary-peer-subnet "<X:X:X:X/126>" --secondary-peer-subnet "<Y:Y:Y:Y/126>"
    ```

## Update your connection to an existing virtual network

Follow the steps below if you have an existing environment of Azure resources that you would like to use your IPv6 Private Peering with.

1. Add an IPv6 address space to the virtual network that your ExpressRoute circuit is connected to.

    ```azurecli-interactive
    az network vnet update -g "<MyResourceGroup>" -n "<MyVNet>" --address-prefixes "X:X:X:X::/64"
    ```

3. Add IPv6 address space to your gateway subnet. The gateway IPv6 subnet should be /64 or larger.

    ```azurecli-interactive
    az network vnet subnet update -g "<MyResourceGroup>" -n "<MySubnet>" -vnet-name "<MyVNet>" --address-prefixes "10.0.0.0/26", "X:X:X:X::/64"
    ```

4. If you have an existing zone-redundant gateway, run the following to enable IPv6 connectivity (note that it may take up to 1 hour for changes to reflect). Otherwise, [create the virtual network gateway](expressroute-howto-add-gateway-resource-manager.md) using any SKU. If you plan to use FastPath, use UltraPerformance or ErGw3AZ (note that this is only available for circuits using ExpressRoute Direct).

    ```azurecli-interactive
    az network vnet-gateway update --name "<GatewayName>" --resource-group "<MyResourceGroup>"
    ```
>[!NOTE]
> If you have an existing gateway that is not zone-redundant (meaning it is Standard, High Performance, or Ultra Performance SKU) and uses a public IP address of Basic SKU, you will need to delete and [recreate the gateway](expressroute-howto-add-gateway-resource-manager.md#add-a-gateway) using any SKU and a Standard, Static public IP address.

## Create a connection to a new virtual network

Follow the steps below if you plan to connect to a new set of Azure resources using your IPv6 Private Peering.

1. Create a dual-stack virtual network with both IPv4 and IPv6 address space. For more information, see [Create a virtual network](../virtual-network/quick-create-cli.md).

2. [Create the dual-stack gateway subnet](expressroute-howto-add-gateway-resource-manager.md#add-a-gateway).

3. [Create the virtual network gateway](expressroute-howto-add-gateway-resource-manager.md#add-a-gateway) using any SKU. If you plan to use FastPath, use UltraPerformance or ErGw3AZ (note that this is only available for circuits using ExpressRoute Direct).

4. [Link your virtual network to your ExpressRoute circuit](expressroute-howto-linkvnet-cli.md).

## Limitations
While IPv6 support is available for connections to deployments in global Azure regions, it does not support the following use cases:

* Connections to *existing* ExpressRoute gateways that are not zone-redundant. Note that *newly* created ExpressRoute gateways of any SKU (both zone-redundant and not) using  a Standard, Static IP address can be used for dual-stack ExpressRoute connections
* Global Reach connections between ExpressRoute circuits
* Use of ExpressRoute with virtual WAN
* FastPath with non-ExpressRoute Direct circuits
* FastPath with circuits in the following peering locations: Dubai
* Coexistence with VPN Gateway

## Next steps

To troubleshoot ExpressRoute problems, see the following articles:

* [Verifying ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
* [Troubleshooting network performance](expressroute-troubleshooting-network-performance.md)
