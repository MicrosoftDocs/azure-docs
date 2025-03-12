---
title: Create S2S VPN connection - shared key authentication - Azure PowerShell
description: Learn how to create a site-to-site VPN Gateway IPsec connection between your on-premises network and a virtual network using shared key authentication and PowerShell.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 12/02/2024
ms.author: cherylmc 
ms.custom: devx-track-azurepowershell

---
# Create a site-to-site VPN connection - Azure PowerShell

This article shows you how to use PowerShell to create a site-to-site VPN gateway connection from your on-premises network to a virtual network (VNet).

A site-to-site VPN gateway connection is used to connect your on-premises network to an Azure virtual network over an IPsec/IKE (IKEv1 or IKEv2) VPN tunnel. This type of connection requires a VPN device located on-premises that has an externally facing public IP address assigned to it. The steps in this article create a connection between the VPN gateway and the on-premises VPN device using a shared key. For more information about VPN gateways, see [About VPN gateway](vpn-gateway-about-vpngateways.md).

:::image type="content" source="./media/tutorial-site-to-site-portal/diagram.png" alt-text="Diagram of site-to-site VPN Gateway cross-premises connections." lightbox="./media/tutorial-site-to-site-portal/diagram.png":::

## Before you begin

Verify that your environment meets the following criteria before beginning configuration:

* Verify that you have a functioning route-based VPN gateway. To create a VPN gateway, see [Create a VPN gateway](create-gateway-powershell.md).

* If you're unfamiliar with the IP address ranges located in your on-premises network configuration, you need to coordinate with someone who can provide those details for you. When you create this configuration, you must specify the IP address range prefixes that Azure routes to your on-premises location. None of the subnets of your on-premises network can overlap with the virtual network subnets that you want to connect to.

* VPN devices:
  * Make sure you have a compatible VPN device and someone who can configure it. For more information about compatible VPN devices and device configuration, see [About VPN devices](vpn-gateway-about-vpn-devices.md).
  * Determine if your VPN device supports active-active mode gateways. This article creates an active-active mode VPN gateway, which is recommended for highly available connectivity. Active-active mode specifies that both gateway VM instances are active. This mode requires two public IP addresses, one for each gateway VM instance. You configure your VPN device to connect to the IP address for each gateway VM instance.<br>If your VPN device doesn't support this mode, don't enable this mode for your gateway. For more information, see [Design highly available connectivity for cross-premises and VNet-to-VNet connections](vpn-gateway-highlyavailable.md) and [About active-active mode VPN gateways](about-active-active-gateways.md).

### Azure PowerShell

[!INCLUDE [powershell](../../includes/vpn-gateway-cloud-shell-powershell-about.md)]

## <a name="localnet"></a>Create a local network gateway

The local network gateway (LNG) typically refers to your on-premises location. It isn't the same as a virtual network gateway. You give the site a name by which Azure can refer to it, then specify the IP address of the on-premises VPN device to which you'll create a connection. You also specify the IP address prefixes that are routed through the VPN gateway to the VPN device. The address prefixes you specify are the prefixes located on your on-premises network. If your on-premises network changes, you can easily update the prefixes.

Select one of the following examples. The values used in the examples are:

* The *GatewayIPAddress* is the IP address of your on-premises VPN device, not your Azure VPN gateway.
* The *AddressPrefix* is your on-premises address space.

**Single address prefix example**

  ```azurepowershell-interactive
  New-AzLocalNetworkGateway -Name Site1 -ResourceGroupName TestRG1 `
  -Location 'East US' -GatewayIpAddress '[IP address of your on-premises VPN device]' -AddressPrefix '10.0.0.0/24'
  ```

**Multiple address prefix example**

  ```azurepowershell-interactive
  New-AzLocalNetworkGateway -Name Site1 -ResourceGroupName TestRG1 `
  -Location 'East US' -GatewayIpAddress '[IP address of your on-premises VPN device]' -AddressPrefix @('10.3.0.0/16','10.0.0.0/24')
  ```

## <a name="ConfigureVPNDevice"></a>Configure your VPN device

Site-to-site connections to an on-premises network require a VPN device. In this step, you configure your VPN device. When configuring your VPN device, you need the following items:

* **Shared key**: This shared key is the same one that you specify when you create your site-to-site VPN connection. In our examples, we use a simple shared key. We recommend that you generate a more complex key to use.
* **Public IP addresses of your virtual network gateway instances**: Obtain the IP address for each VM instance. If your gateway is in active-active mode, you'll have an IP address for each gateway VM instance. Be sure to configure your device with both IP addresses, one for each active gateway VM. Active-standby mode gateways have only one IP address. In the example, VNet1GWpip1 is the name of the public IP address resource.

  ```azurepowershell-interactive
  Get-AzPublicIpAddress -Name VNet1GWpip1 -ResourceGroupName TestRG1
  ```

[!INCLUDE [Configure VPN device](../../includes/vpn-gateway-configure-vpn-device-rm-include.md)]

## <a name="CreateConnection"></a>Create the VPN connection

Create a site-to-site VPN connection between your virtual network gateway and your on-premises VPN device. If you're using an active-active mode gateway (recommended), each gateway VM instance has a separate IP address. To properly configure [highly available connectivity](vpn-gateway-highlyavailable.md), you must establish a tunnel between each VM instance and your VPN device. Both tunnels are part of the same connection.

The shared key must match the value you used for your VPN device configuration. Notice that the '-ConnectionType' for site-to-site is **IPsec**.

1. Set the variables.

   ```azurepowershell-interactive
   $gateway1 = Get-AzVirtualNetworkGateway -Name VNet1GW -ResourceGroupName TestRG1
   $local = Get-AzLocalNetworkGateway -Name Site1 -ResourceGroupName TestRG1
   ```

1. Create the connection.

   ```azurepowershell-interactive
   New-AzVirtualNetworkGatewayConnection -Name VNet1toSite1 -ResourceGroupName TestRG1 `
   -Location 'East US' -VirtualNetworkGateway1 $gateway1 -LocalNetworkGateway2 $local `
   -ConnectionType IPsec -SharedKey 'abc123'
   ```

## <a name="toverify"></a>Verify the VPN connection

There are a few different ways to verify your VPN connection.

[!INCLUDE [Verify connection](../../includes/vpn-gateway-verify-connection-ps-rm-include.md)]

## <a name="modify"></a>To modify IP address prefixes for a local network gateway

If the IP address prefixes that you want routed to your on-premises location change, you can modify the local network gateway. When using these examples, modify the values to match your environment.

[!INCLUDE [Modify prefixes](../../includes/vpn-gateway-modify-ip-prefix-rm-include.md)]

## <a name="modifygwipaddress"></a>To modify the gateway IP address for a local network gateway

[!INCLUDE [Modify gateway IP address](../../includes/vpn-gateway-modify-lng-gateway-ip-rm-include.md)]

## <a name="deleteconnection"></a>To delete a gateway connection

If you don't know the name of your connection, you can find it by using the 'Get-AzVirtualNetworkGatewayConnection' cmdlet.

```azurepowershell-interactive
Remove-AzVirtualNetworkGatewayConnection -Name VNet1toSite1 `
-ResourceGroupName TestRG1
```

## Next steps

* Once your connection is complete, you can add virtual machines to your virtual networks. For more information, see [Virtual Machines](../index.yml).
* For information about BGP, see the [BGP Overview](vpn-gateway-bgp-overview.md) and [How to configure BGP](vpn-gateway-bgp-resource-manager-ps.md).
* For information about creating a site-to-site VPN connection using Azure Resource Manager template, see [Create a site-to-site VPN Connection](https://azure.microsoft.com/resources/templates/site-to-site-vpn-create/).
* For information about creating a vnet-to-vnet VPN connection using Azure Resource Manager template, see [Deploy HBase geo replication](https://azure.microsoft.com/resources/templates/hdinsight-hbase-replication-geo/).
