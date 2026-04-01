---
title: Configure a Site-to-site VPN Connection in IPv4 and IPv6 Dual Stack - Azure CLI
titleSuffix: Azure VPN Gateway
description: Learn how to configure a site-to-site VPN connection with IPv4 and IPv6 dual stack for VPN Gateway using Azure CLI.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 03/25/2026
ms.author: cherylmc
# Customer intent: "As a network administrator, I want to configure IPv6 in dual-stack mode for Azure VPN Gateway, so that I can support seamless IPv6 traffic alongside IPv4 within my organization's VPN infrastructure."
---

# Create a site-to-site IPv6 VPN connection in dual stack using Azure CLI - Preview

This article helps you create a site-to-site VPN gateway connection in IPv4 and IPv6 dual stack from your on-premises network to a virtual network (VNet) using the Azure CLI.

:::image type="content" source="media/site-to-site-ipv6-azure-cli/site-to-site-connection.png" alt-text="Diagram showing site-to-site VPN gateway connection in dual stack.":::

A site-to-site VPN gateway connection is used to connect your on-premises network to an Azure virtual network over an IPsec/IKE VPN tunnel. This type of connection requires a VPN device located on-premises that has an externally facing public IP addresses assigned to it. The current site-to-site VPN configuration with dual-stack support allows only IPv6 traffic in the inner tunnel. IPv6 inner traffic is supported exclusively with IKEv2.

The steps in this article create two connections between the VPN gateway and the on-premises VPN device using a shared key. For more information about VPN gateways, see [About VPN gateway](vpn-gateway-about-vpngateways.md).

> [!IMPORTANT]
> IPv6 in dual stack configuration is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Before you begin

> [!NOTE]
> During Preview, you can opt in to configure IPv6 in dual stack. To opt in, send your subscription ID to **vpngwipv6preview@microsoft.com** and request your subscription to be enabled for IPv6.

Verify that your environment meets the following criteria before beginning configuration:

* Verify that you have a functioning route-based VPN gateway. To create a VPN gateway, see [Create a VPN gateway](create-gateway-powershell.md).

* If you're unfamiliar with the IP address ranges located in your on-premises network configuration, you need to coordinate with someone who can provide those details for you. When you create this configuration, you must specify the IP address range prefixes that Azure routes to your on-premises location. None of the subnets of your on-premises network can overlap with the virtual network subnets that you want to connect to.

* VPN devices:

  * Make sure you have a compatible VPN device and someone who can configure it. For more information about compatible VPN devices and device configuration, see [About VPN devices](vpn-gateway-about-vpn-devices.md).

  * Determine if your VPN device supports active-active mode gateways. This article creates an active-active mode VPN gateway, which is recommended for highly available connectivity. Active-active mode specifies that both gateway VM instances are active. This mode requires two public IP addresses, one for each gateway VM instance. You configure your VPN device to connect to the IP address for each gateway VM instance.
    If your VPN device doesn't support this mode, don't enable this mode for your gateway. For more information, see [Design highly available connectivity for cross-premises and VNet-to-VNet connections](vpn-gateway-highlyavailable.md) and [About active-active mode VPN gateways](about-active-active-gateways.md).

* If your virtual network gateway and local network gateway reside in different subscriptions and different tenants, you'll need to use slightly different steps. Review the [Connections with different tenants and different subscriptions](vpn-gateway-create-site-to-site-rm-powershell.md#tenants).

## Azure CLI

This article uses Azure CLI commands. To run the commands, you can use Azure Cloud Shell or Azure CLI installed locally on your computer. The syntax of commands is in bash shell but can be converted to PowerShell.

Assign the variables used in the configuration:

```bash
ResourceGroup="resource-group-name"
Location="name-of-the-azure-region"
vnetName="VNet1"
VNetAddressPrefixIPv4="10.1.0.0/16"
VNetAddressPrefixIPv6="fd:0:1::/48"
GatewaySubnetPrefix1="10.1.0.0/24"
GatewaySubnetPrefix2="fd:0:1:e::/64"
GatewayName="VNet1GW"

# Name of the first public IP address of the gateway
PublicIP1="${GatewayName}-pip1"
PublicIP2="${GatewayName}-pip2"

# VPN type Route based
VPNType="RouteBased"
GatewayType="Vpn"
```

## Create an Azure virtual network

```bash
# create a Resource Group
az group create --name "$ResourceGroup" --location "$location"

# create an Azure VNet
az network vnet create \
  --name "$vnetName" \
  --resource-group "$ResourceGroup" \
  --location "$Location" \
  --address-prefixes "$VNetAddressPrefixIPv4" "$VNetAddressPrefixIPv6"

# create the GatewaySubnet
az network vnet subnet create \
  --name "GatewaySubnet" \
  --vnet-name "$vnetName" \
  --resource-group "$ResourceGroup" \
  --address-prefixes "$GatewaySubnetPrefixIPv4" "$GatewaySubnetPrefixIPv6"
```

## Create the Azure VPN gateway

The Azure VPN Gateway is deployed with a zonal SKU in the GatewaySubnet. In active-active mode, it requires two public IP addresses with Standard SKU:

```bash
# create the first public IP of the VPN Gateway
az network public-ip create \
  --name "$PublicIP1" \
  --resource-group "$ResourceGroup" \
  --location "$Location" \
  --allocation-method Static \
  --sku Standard \
  --tier Regional \
  --zone 1 2 3

# create the second public IP of the VPN Gateway
az network public-ip create \
  --name "$PublicIP2" \
  --resource-group "$ResourceGroup" \
  --location "$Location" \
  --allocation-method Static \
  --sku Standard \
  --tier Regional \
  --zone 1 2 3

# Create the VPN Gateway with VpnGw2AZ SKU in active-active mode
az network vnet-gateway create \
  --name "$GatewayName" \
  --resource-group "$ResourceGroup" \
  --location "$Location" \
  --vnet "$vnetName" \
  --gateway-type "$GatewayType" \
  --vpn-type "$VPNType" \
  --sku VpnGw2AZ \
  --public-ip-addresses "$PublicIP1" "$PublicIP2"
```

## View the VPN gateway

You can view the VPN gateway using the [az network vnet-gateway show](/cli/azure/network/vnet-gateway#az-network-vnet-gateway-show) command.

```bash
az network vnet-gateway show \
  --name "$GatewayName" \
  --resource-group "$ResourceGroup"
```

## Create a local network gateway

The local network gateway (LNG) refers to your on-premises location. It isn't the same as a virtual network gateway. VPN Gateway support static routing and dynamic routing through BGP. In this article, the static routing is configured in IPsec tunnels. You give the site a name by which Azure can refer to it, then specify the IP address of the on-premises VPN device to which you'll create a connection. You also specify the IP address prefixes that are routed through the VPN gateway to the VPN device. The address prefixes you specify are the prefixes located on your on-premises network. If your on-premises network changes, you can easily update the prefixes.

Select one of the following examples. The values used in the examples are:

* The **OnpremDevPubIPv4Address1** is the IP address 1 of your on-premises VPN device, not your Azure VPN gateway.

* The **OnpremDevPubIPv4Address2** is the IP address 2 of your on-premises VPN device, not your Azure VPN gateway.

```bash
# Collect the first public IP assigned to the on-premises VPN device
# replace 'public-IPv4Address1-onpremises-device' with the IPv4 of the first address of your on-premises device
OnpremDevPubIPv4Address1="public-IPv4Address1-onpremises-device"

# Collect the second public IP assigned to the on-premises VPN device
# replace 'public-IPv4Address2-onpremises-device' with the IPv4 of the second address of your on-premises device
OnpremDevPubIPv4Address2="public-IPv4Address2-onpremises-device"

# Local Network Gateway to use to create the IPsec tunnel1
LocalNetworkGatewayName1="lngSite11"

# Local Network Gateway to use to create the IPsec tunnel2
LocalNetworkGatewayName2="lngSite12"

# Specify the list of IPv4 and IPv6 on-premises networks
OnpremIPv4AddressPrefix1="10.2.0.0/16"
OnpremIPv6AddressPrefix1="fd:0:2::/48"
OnpremIPv6AddressPrefix2="fd:0:3::/48"

# local Network Gateway for tunnel1
az network local-gateway create \
  --name "$LocalNetworkGatewayName1" \
  --resource-group "$ResourceGroup" \
  --location "$Location" \
  --gateway-ip-address "$OnpremDevPubIPv4Address1" \
  --local-address-prefixes "$OnpremIPv4AddressPrefix1" "$OnpremIPv6AddressPrefix1" "$OnpremIPv6AddressPrefix2"

# local Network Gateway for tunnel2
az network local-gateway create \
  --name "$LocalNetworkGatewayName2" \
  --resource-group "$ResourceGroup" \
  --location "$Location" \
  --gateway-ip-address "$OnpremDevPubIPv4Address2" \
  --local-address-prefixes "$OnpremIPv4AddressPrefix1" "$OnpremIPv6AddressPrefix1" "$OnpremIPv6AddressPrefix2"
```

## Configure your VPN device

Site-to-site connections to an on-premises network require a VPN device. For information to help you configure your device, see [Configure your VPN device](vpn-gateway-howto-site-to-site-resource-manager-cli.md#VPNDevice). Make sure to configure your VPN device to connect to both gateway IP addresses of the active-active mode VPN gateway. If your VPN device doesn't support active-active mode, you can still connect to both gateway IP addresses, but only one connection will be active at a time. For more information, see [Design highly available connectivity for cross-premises and VNet-to-VNet connections](vpn-gateway-highlyavailable.md) and [About active-active mode VPN gateways](about-active-active-gateways.md).

## Create the VPN connections

Create a site-to-site VPN connection between your virtual network gateway and your on-premises VPN device. When you use an active-active mode gateway, each gateway VM instance has a separate IP address. To properly configure [highly available connectivity](vpn-gateway-highlyavailable.md), you must establish a tunnel between each VM instance and your VPN device. Both tunnels are part of the same connection. If your local network gateway and virtual network gateway reside in different subscriptions and different tenants, see the [Connections with different tenants and different subscriptions](vpn-gateway-create-site-to-site-rm-powershell.md#tenants) section.

The shared key must match the value you used for your VPN device configuration.

Set the variables.

```bash
LocalNetworkGatewayName1="lngSite11"
LocalNetworkGatewayName2="lngSite22"
Gateway1Name="VNet1GW"
ConnectionName1="conn11"
ConnectionName2="conn12"
sharedKey='abc123'
```

Create the connections.

```bash
# Create the VPN connection for the S2S tunnel1
az network vpn-connection create \
  --name "$ConnectionName1" \
  --resource-group "$ResourceGroup" \
  --location "$Location" \
  --vnet-gateway1 "$Gateway1Name" \
  --local-gateway2 "$LocalNetworkGatewayName1" \
  --shared-key "$sharedKey"

az network vpn-connection create \
  --name "$ConnectionName2" \
  --resource-group "$ResourceGroup" \
  --location "$Location" \
  --vnet-gateway1 "$Gateway1Name" \
  --local-gateway2 "$LocalNetworkGatewayName2" \
  --shared-key "$sharedKey"
```

## Verify the VPN connection

To get the list of VPN Connection in a Resource Group:

```bash
az network vpn-connection list \
  --resource-group "$ResourceGroup" \
  --output table
```

You can verify that your connection succeeded by using the `az network vpn-connection show` command.

```bash
az network vpn-connection show \
  --name "$ConnectionName1" \
  --resource-group "$ResourceGroup"
```

The command output can be filtered to extract only the **ConnectionStatus** and **ProvisioningState**:

```bash
az network vpn-connection show \
  --name "$ConnectionName1" \
  --resource-group "$ResourceGroup" \
  --query "{ProvisioningState:provisioningState, ConnectionStatus:connectionStatus}"
```

A successful deployment and correct setting should return:

```json
{
  "ConnectionStatus": "Connected",
  "ProvisioningState": "Succeeded"
}
```

## Modify IP address prefixes for a local network gateway

If the IP address prefixes that you want routed to your on-premises location change, you can modify the local network gateway. When using these examples, modify the values to match your environment.

### To add more address prefixes

The **--local-address-prefixes** parameter replaces all existing prefixes with the new values. Make sure to include all prefixes you want to keep. In this example, we add two new prefixes:

```bash
az network local-gateway update \
  --name "$LocalNetworkGatewayName1" \
  --resource-group "$ResourceGroup" \
  --local-address-prefixes "10.2.0.0/16" "10.5.0.0/16" "fd:0:2::/48" "fd:0:3::/48" "fd:0:5::/48"
```

### To remove address prefixes

Leave out the prefixes that you no longer need. In this example, we no longer need prefixes '10.5.0.0/16' and 'fd:0:5::/48' (from the previous example), so we update the local network gateway and exclude that prefix.

Check the network prefixes specified in Local Network Gateway.

```bash
# View current prefixes
az network local-gateway show \
  --name "$LocalNetworkGatewayName1" \
  --resource-group "$ResourceGroup" \
  --query "localNetworkAddressSpace.addressPrefixes"
```

Update with the modified list.

```bash
# Then update with the modified list
az network local-gateway update \
  --name "$LocalNetworkGatewayName1" \
  --resource-group "$ResourceGroup" \
  --local-address-prefixes "10.2.0.0/16" "fd:0:2::/48" "fd:0:3::/48"
```

## Modify the gateway IP address for a local network gateway

If you change the public IP address for your VPN device, you need to modify the local network gateway with the updated IP address. When modifying, be sure to use the existing name of your local network gateway.

```bash
# get the public IP of Local network Gateway
az network local-gateway show \
  --name "$LocalNetworkGatewayName1" \
  --resource-group "$ResourceGroup" \
  --query "gatewayIpAddress" -o tsv

# change the gateway IP address of the Local Network Gateway
az network local-gateway update \
  --name "$LocalNetworkGatewayName1" \
  --resource-group "$ResourceGroup" \
  --gateway-ip-address "198.51.100.1"
```

## Delete a gateway connection

If you don't know the name of your connection, you can find it by using the `az network vpn-connection delete` command.

```bash
# Delete connection 1
az network vpn-connection delete \
  --name "$ConnectionName1" \
  --resource-group "$ResourceGroup"
```

## Next steps

* Once your connection is complete, you can add virtual machines to your virtual networks. For more information, see [Virtual Machines](https://azure.microsoft.com/products/virtual-machines/).

* For information about BGP, see the [BGP Overview](vpn-gateway-bgp-overview.md) and [How to configure BGP](vpn-gateway-bgp-resource-manager-ps.md).

* For information about creating a site-to-site VPN connection using Azure Resource Manager template, see [Create a site-to-site VPN Connection](https://azure.microsoft.com/resources/templates/site-to-site-vpn-create/).

* For information about creating a vnet-to-vnet VPN connection using Azure Resource Manager template, see [Deploy HBase geo replication](https://azure.microsoft.com/resources/templates/hdinsight-hbase-replication-geo/).