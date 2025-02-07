---
title: Create a virtual network gateway - CLI
titleSuffix: Azure VPN Gateway
description: Learn how to create a virtual network gateway for VPN Gateway connections using CLI.
author: cherylmc
ms.service: azure-vpn-gateway
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 11/18/2024
ms.author: cherylmc
---

# Create a VPN gateway using CLI

This article helps you create an Azure VPN gateway using Azure CLI. A VPN gateway is used when creating a VPN connection to your on-premises network. You can also use a VPN gateway to connect virtual networks. For more comprehensive information about some of the settings in this article, see [Create a VPN gateway - portal](tutorial-create-gateway-portal.md).

:::image type="content" source="./media/tutorial-create-gateway-portal/gateway-diagram.png" alt-text="Diagram that shows a virtual network and a VPN gateway." lightbox="./media/tutorial-create-gateway-portal/gateway-diagram-expand.png":::

* The left side of the diagram shows the virtual network and the VPN gateway that you create by using the steps in this article.
* You can later add different types of connections, as shown on the right side of the diagram. For example, you can create [site-to-site](tutorial-site-to-site-portal.md) and [point-to-site](point-to-site-about.md) connections. To view different design architectures that you can build, see [VPN gateway design](design.md).

The steps in this article create a virtual network, a subnet, a gateway subnet, and a route-based, zone-redundant active-active mode VPN gateway (virtual network gateway) using the Generation 2 VpnGw2AZ SKU. The steps in this article create a virtual network, a subnet, a gateway subnet, and a route-based, zone-redundant active-active mode VPN gateway (virtual network gateway) using the Generation 2 VpnGw2AZ SKU. Once the gateway is created, you can configure connections.

* If you want to create a VPN gateway using the **Basic** SKU instead, see [Create a Basic SKU VPN gateway](create-gateway-basic-sku-powershell.md).
* We recommend that you create an active-active mode VPN gateway when possible. Active-active mode VPN gateways provide better availability and performance than standard mode VPN gateways. For more information about active-active gateways, see [About active-active mode gateways](about-active-active-gateways.md).
* For information about availability zones and zone redundant gateways, see [What are availability zones](/azure/reliability/availability-zones-overview?toc=%2Fazure%2Fvpn-gateway%2Ftoc.json&tabs=azure-cli#availability-zones)?

> [!NOTE]
> [!INCLUDE [AZ SKU region support note](../../includes/vpn-gateway-az-regions-support-include.md)]

## Before you begin

These steps require an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

* This article requires version 2.0.4 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

Create a resource group using the [az group create](/cli/azure/group) command. A resource group is a logical container into which Azure resources are deployed and managed.

```azurecli-interactive
az group create --name TestRG1 --location eastus
```

## <a name="vnet"></a>Create a virtual network

If you don't already have a virtual network, create one using the [az network vnet create](/cli/azure/network/vnet) command. When you create a virtual network, make sure that the address spaces you specify don't overlap any of the address spaces that you have on your on-premises network. If a duplicate address range exists on both sides of the VPN connection, traffic doesn't route the way you might expect it to. Additionally, if you want to connect this virtual network to another virtual network, the address space can't overlap with other virtual network. Take care to plan your network configuration accordingly.

The following example creates a virtual network named 'VNet1' and a subnet, 'FrontEnd'. The FrontEnd subnet isn't used in this exercise. You can substitute your own subnet name.

```azurecli-interactive
az network vnet create \
  -n VNet1 \
  -g TestRG1 \
  -l eastus \
  --address-prefix 10.1.0.0/16 \
  --subnet-name FrontEnd \
  --subnet-prefix 10.1.0.0/24
```

## <a name="gwsubnet"></a>Add a gateway subnet

[!INCLUDE [About GatewaySubnet with links](../../includes/vpn-gateway-about-gwsubnet-include.md)]


[!INCLUDE [NSG warning](../../includes/vpn-gateway-no-nsg-include.md)]

Use the following example to add a gateway subnet:

```azurecli-interactive
az network vnet subnet create \
  --vnet-name VNet1 \
  -n GatewaySubnet \
  -g TestRG1 \
  --address-prefix 10.1.255.0/27 
```

## <a name="PublicIP"></a>Request public IP addresses

A VPN gateway must have a public IP address. When you create a connection to a VPN gateway, this is the IP address that you specify. For active-active mode gateways, each gateway instance has its own public IP address resource. You first request the IP address resource, and then refer to it when creating your virtual network gateway. Additionally, for any gateway SKU ending in *AZ*, you must also specify the Zone setting. This example specifies a zone-redundant configuration because it specifies all three regional zones.

The IP address is assigned to the resource when the VPN gateway is created. The only time the public IP address changes is when the gateway is deleted and re-created. It doesn't change across resizing, resetting, or other internal maintenance/upgrades of your VPN gateway.

Use the [az network public-ip create](/cli/azure/network/public-ip) command to request a public IP address:

```azurecli-interactive
az network public-ip create --name VNet1GWpip1 --resource-group TestRG1 --allocation-method Static --sku Standard --version IPv4 --zone 1 2 3
```

To create an active-active gateway (recommended), request a second public IP address:

```azurecli-interactive
az network public-ip create --name VNet1GWpip2 --resource-group TestRG1 --allocation-method Static --sku Standard --version IPv4 --zone 1 2 3
```

## <a name="CreateGateway"></a>Create the VPN gateway

Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU. Once the gateway is created, you can create connection between your virtual network and your on-premises location. Or, create a connection between your virtual network and another virtual network.

Create the VPN gateway using the [az network vnet-gateway create](/cli/azure/network/vnet-gateway) command. If you run this command by using the `--no-wait` parameter, you don't see any feedback or output. The `--no-wait` parameter allows the gateway to be created in the background. It doesn't mean that the VPN gateway is created immediately. If you want to create a gateway using a different SKU, see [About Gateway SKUs](about-gateway-skus.md) to determine the SKU that best fits your configuration requirements.

**Active-active mode gateway**

```azurecli-interactive
az network vnet-gateway create --name VNet1GW --public-ip-addresses VNet1GWpip1 VNet1GWpip2 --resource-group TestRG1 --vnet VNet1 --gateway-type Vpn --vpn-type RouteBased --sku VpnGw2AZ --vpn-gateway-generation Generation2 --no-wait
```

**Active-standby mode gateway**

```azurecli-interactive
az network vnet-gateway create --name VNet1GW --public-ip-addresses VNet1GWpip1 --resource-group TestRG1 --vnet VNet1 --gateway-type Vpn --vpn-type RouteBased --sku VpnGw2AZ --vpn-gateway-generation Generation2 --no-wait
```

A VPN gateway can take 45 minutes or more to create.

## <a name="viewgw"></a>View the VPN gateway

```azurecli-interactive
az network vnet-gateway show \
  -n VNet1GW \
  -g TestRG1
```

## View gateway IP addresses

Each VPN gateway instance is assigned a public IP address resource. To view the IP address associated with the resource, use the following command. Repeat for each gateway instance.

```azurecli-interactive
az network public-ip show -g TestRG1 -n VNet1GWpip1
```

## Clean up resources

When you no longer need the resources you created, use [az group delete](/cli/azure/group) to delete the resource group. This deletes the resource group and all of the resources it contains.

```azurecli-interactive
az group delete --name TestRG1 --yes
```

## Next steps

Once the gateway is created, you can configure connections.

* [Create a site-to-site connection](vpn-gateway-howto-site-to-site-resource-manager-cli.md)
* [Create a connection to another virtual network](vpn-gateway-howto-vnet-vnet-cli.md)
* [Create a point-to-site connection](point-to-site-about.md)
