---
title: Create S2S VPN connection - shared key authentication - Azure CLI
description: Learn how to create a site-to-site VPN Gateway IPsec connection between your on-premises network and a virtual network using shared key authentication and Azure CLI.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: azure-vpn-gateway
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 11/14/2024
ms.author: cherylmc
---
# Create a site-to-site VPN connection - shared key authentication -  Azure CLI

This article shows you how to use the Azure CLI to create a site-to-site (S2S) VPN gateway connection from your on-premises network to a virtual network. You can also create this configuration using a different deployment tool by selecting a different option from the following list:<br>

> [!div class="op_single_selector"]
> * [Azure portal](tutorial-site-to-site-portal.md)
> * [PowerShell](vpn-gateway-create-site-to-site-rm-powershell.md)

:::image type="content" source="./media/tutorial-site-to-site-portal/diagram.png" alt-text="Site-to-site VPN Gateway cross-premises connection diagram for CLI article." lightbox="./media/tutorial-site-to-site-portal/diagram.png":::

A site-to-site VPN gateway connection is used to connect your on-premises network to an Azure virtual network over an IPsec/IKE (IKEv1 or IKEv2) VPN tunnel. This type of connection requires a VPN device located on-premises that has an externally facing public IP address assigned to it. For more information about VPN gateways, see [About VPN gateway](vpn-gateway-about-vpngateways.md).

## Before you begin

Verify that your environment meets the following criteria before beginning configuration:

* You have an Azure account with an active subscription. If you don't have one, you can [create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
* If you're unfamiliar with the IP address ranges located in your on-premises network configuration, you need to coordinate with someone who can provide those details for you. When you create this configuration, you must specify the IP address range prefixes that Azure routes to your on-premises location. None of the subnets of your on-premises network can overlap with the virtual network subnets that you want to connect to.
* VPN devices:
  * Make sure you have a compatible VPN device and someone who can configure it. For more information about compatible VPN devices and device configuration, see [About VPN devices](vpn-gateway-about-vpn-devices.md).
  * Verify whether your VPN device supports active-active mode gateways. This article creates an active-active mode VPN gateway, which is recommended for highly available connectivity. Active-active mode specifies that both gateway VM instances are active. This mode requires two public IP addresses, one for each gateway VM instance. You configure your VPN device to connect to the IP address for each gateway VM instance.<br>If your VPN device doesn't support this mode, don't enable this mode for your gateway. For more information, see [Design highly available connectivity for cross-premises and VNet-to-VNet connections](vpn-gateway-highlyavailable.md) and [About active-active mode VPN gateways](about-active-active-gateways.md).

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]
* This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## <a name="Login"></a>Connect to your subscription

If you choose to run CLI locally, connect to your subscription. If you're using Azure Cloud Shell in the browser, you don't need to connect to your subscription. However, you might want to verify that you're using the correct subscription after you connect.

[!INCLUDE [CLI login](../../includes/vpn-gateway-cli-login-include.md)]

## <a name="rg"></a>Create a resource group

The following example creates a resource group named 'TestRG1' in the 'eastus' location. If you already have a resource group in the region that you want to create your virtual network, you can use that one instead.

```azurecli-interactive
az group create --name TestRG1 --location eastus
```

## <a name="VNet"></a>Create a virtual network

If you don't already have a virtual network, create one using the [az network vnet create](/cli/azure/network/vnet) command. When creating a virtual network, make sure that the address spaces you specify don't overlap any of the address spaces that you have on your on-premises network.

> [!NOTE]
> In order for this virtual network to connect to an on-premises location, you need to coordinate with your on-premises network administrator to carve out an IP address range that you can use specifically for this virtual network. If a duplicate address range exists on both sides of the VPN connection, traffic does not route the way you may expect it to. Additionally, if you want to connect this virtual network to another virtual network, the address space cannot overlap with other virtual network. Take care to plan your network configuration accordingly.

The following example creates a virtual network named 'VNet1' and a subnet, 'Subnet1'.

```azurecli-interactive
az network vnet create --name VNet1 --resource-group TestRG1 --address-prefix 10.1.0.0/16 --location eastus --subnet-name Subnet1 --subnet-prefix 10.1.0.0/24
```

## <a name="gwsub"></a>Create the gateway subnet

[!INCLUDE [About gateway subnets](../../includes/vpn-gateway-about-gwsubnet-include.md)]

Use the [az network vnet subnet create](/cli/azure/network/vnet/subnet) command to create the gateway subnet.

```azurecli-interactive
az network vnet subnet create --address-prefix 10.1.255.0/27 --name GatewaySubnet --resource-group TestRG1 --vnet-name VNet1
```

[!INCLUDE [vpn-gateway-no-nsg](../../includes/vpn-gateway-no-nsg-include.md)]

## <a name="localnet"></a>Create the local network gateway

The local network gateway typically refers to your on-premises location. You give the site a name by which Azure can refer to it, then specify the IP address of the on-premises VPN device to which you'll create a connection. You also specify the IP address prefixes that will be routed through the VPN gateway to the VPN device. The address prefixes you specify are the prefixes located on your on-premises network. If your on-premises network changes, you can easily update the prefixes.

Use the following values:

* The *--gateway-ip-address* is the IP address of your on-premises VPN device.
* The *--local-address-prefixes* are your on-premises address spaces.

Use the [az network local-gateway create](/cli/azure/network/local-gateway) command to add a local network gateway with multiple address prefixes:

```azurecli-interactive
az network local-gateway create --gateway-ip-address 203.0.133.8 --name Site1 --resource-group TestRG1 --local-address-prefixes 192.168.1.0/24 192.168.3.0/24
```

## <a name="PublicIP"></a>Request a public IP address

A VPN gateway must have a public IP address. If you want to create an active-active gateway (recommended), you must request two public IP addresses. For more information about active-active gateway configurations, see  You first request the IP address resource, and then refer to it when creating your virtual network gateway. The IP address is assigned to the resource when the VPN gateway is created. The only time the public IP address changes is when the gateway is deleted and re-created. It doesn't change across resizing, resetting, or other internal maintenance/upgrades of your VPN gateway. If you want to create a VPN Gateway using the Basic gateway SKU, request a public IP address with the following values `--allocation-method Dynamic --sku Basic`.

Use the [az network public-ip create](/cli/azure/network/public-ip) command to request a public IP address.

```azurecli-interactive
az network public-ip create --name VNet1GWpip1 --resource-group TestRG1 --allocation-method Static --sku Standard --version IPv4 --zone 1 2 3
```

To create an active-active gateway (recommended), request a second public IP address:

```azurecli-interactive
az network public-ip create --name VNet1GWpip2 --resource-group TestRG1 --allocation-method Static --sku Standard --version IPv4 --zone 1 2 3
```

## <a name="CreateGateway"></a>Create the VPN gateway

Create the virtual network VPN gateway. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU.

Use the following values:

* The *--gateway-type* for a site-to-site configuration is *Vpn*. The gateway type is always specific to the configuration that you're implementing. For more information, see [Gateway types](vpn-gateway-about-vpn-gateway-settings.md#gwtype).
* The *--vpn-type* is *RouteBased*.
* Select the Gateway SKU that you want to use. There are configuration limitations for certain SKUs. For more information, see [Gateway SKUs](vpn-gateway-about-vpn-gateway-settings.md#gwsku).

Create the VPN gateway using the [az network vnet-gateway create](/cli/azure/network/vnet-gateway) command. If you run this command using the '--no-wait' parameter, you don't see any feedback or output. This parameter allows the gateway to create in the background. It takes 45 minutes or more to create a gateway, depending on the SKU.

**Active-active mode gateway**

```azurecli-interactive
az network vnet-gateway create --name VNet1GW --public-ip-addresses VNet1GWpip1 VNet1GWpip2 --resource-group TestRG1 --vnet VNet1 --gateway-type Vpn --vpn-type RouteBased --sku VpnGw2AZ --vpn-gateway-generation Generation2 --no-wait
```

**Active-standby mode gateway**

```azurecli-interactive
az network vnet-gateway create --name VNet1GW --public-ip-addresses VNet1GWpip1 --resource-group TestRG1 --vnet VNet1 --gateway-type Vpn --vpn-type RouteBased --sku VpnGw2AZ --vpn-gateway-generation Generation2 --no-wait
```

## <a name="VPNDevice"></a>Configure your VPN device

Site-to-site connections to an on-premises network require a VPN device. In this step, you configure your VPN device. When you configure your VPN device, you need the following values:

* **Shared key**: This shared key is the same one that you specify when you create your site-to-site VPN connection. In our examples, we use a simple shared key. We recommend that you generate a more complex key to use.
* **Public IP addresses of your virtual network gateway instances**: Obtain the IP address for each VM instance. If your gateway is in active-active mode, you'll have an IP address for each gateway VM instance. Be sure to configure your device with both IP addresses, one for each active gateway VM. Active-standby mode gateways have only one IP address.

  > [!NOTE]
  > [!INCLUDE [active-active establish two tunnels](../../includes/vpn-gateway-active-active-tunnel.md)]

  To find the public IP address of your virtual network gateway, use the [az network public-ip list](/cli/azure/network/public-ip) command. For easy reading, the output is formatted to display the list of public IPs in table format.

  ```azurecli-interactive
  az network public-ip list --resource-group TestRG1 --output table
  ```

[!INCLUDE [Configure VPN device](../../includes/vpn-gateway-configure-vpn-device-rm-include.md)]

## <a name="CreateConnection"></a>Create the VPN connection

Create the site-to-site VPN connection between your virtual network gateway and your on-premises VPN device. Pay particular attention to the shared key value, which must match the configured shared key value for your VPN device.

Create the connection using the [az network vpn-connection create](/cli/azure/network/vpn-connection) command. Create additional connections if you're creating a highly available gateway configuration such as active-active mode.

```azurecli-interactive
az network vpn-connection create --name VNet1toSite1 --resource-group TestRG1 --vnet-gateway1 VNet1GW -l eastus --shared-key abc123 --local-gateway2 Site1
```

After a short while, the connection will be established.

## <a name="toverify"></a>Verify the VPN connection

[!INCLUDE [verify connection](../../includes/vpn-gateway-verify-connection-cli-rm-include.md)]

If you want to use another method to verify your connection, see [Verify a VPN Gateway connection](vpn-gateway-verify-connection-resource-manager.md).

## <a name="tasks"></a>Common tasks

This section contains common commands that are helpful when working with site-to-site configurations. For the full list of CLI networking commands, see [Azure CLI - Networking](/cli/azure/network).

[!INCLUDE [local network gateway common tasks](../../includes/vpn-gateway-common-tasks-cli-include.md)]

## Next steps

* For information about BGP, see the [BGP overview](vpn-gateway-bgp-overview.md) and [How to configure BGP](vpn-gateway-bgp-resource-manager-ps.md).
* For information about forced tunneling, see [About forced tunneling](vpn-gateway-forced-tunneling-rm.md).
* For information about highly available active-active connections, see [Highly Available cross-premises and VNet-to-VNet connectivity](vpn-gateway-highlyavailable.md).
* For a list of networking Azure CLI commands, see [Azure CLI](/cli/azure/network).
* For information about creating a site-to-site VPN connection using Azure Resource Manager template, see [Create a site-to-site VPN connection](https://azure.microsoft.com/resources/templates/site-to-site-vpn-create/).
* For information about creating a VNet-to-VNet VPN connection using Azure Resource Manager template, see [Deploy HBase geo replication](https://azure.microsoft.com/resources/templates/hdinsight-hbase-replication-geo/).
