---
title: 'Connect your on-premises network to an Azure virtual network: Site-to-Site VPN: PowerShell | Microsoft Docs'
description: Steps to create an IPsec connection from your on-premises network to an Azure virtual network over the public Internet. These steps will help you create a cross-premises Site-to-Site VPN Gateway connection using PowerShell.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 02/14/2019
ms.author: cherylmc

---
# Create a VNet with a Site-to-Site VPN connection using PowerShell

This article shows you how to use PowerShell to create a Site-to-Site VPN gateway connection from your on-premises network to the VNet. The steps in this article apply to the Resource Manager deployment model. You can also create this configuration using a different deployment tool or deployment model by selecting a different option from the following list:

> [!div class="op_single_selector"]
> * [Azure portal](vpn-gateway-howto-site-to-site-resource-manager-portal.md)
> * [PowerShell](vpn-gateway-create-site-to-site-rm-powershell.md)
> * [CLI](vpn-gateway-howto-site-to-site-resource-manager-cli.md)
> * [Azure portal (classic)](vpn-gateway-howto-site-to-site-classic-portal.md)
> 
>

A Site-to-Site VPN gateway connection is used to connect your on-premises network to an Azure virtual network over an IPsec/IKE (IKEv1 or IKEv2) VPN tunnel. This type of connection requires a VPN device located on-premises that has an externally facing public IP address assigned to it. For more information about VPN gateways, see [About VPN gateway](vpn-gateway-about-vpngateways.md).

![Site-to-Site VPN Gateway cross-premises connection diagram](./media/vpn-gateway-create-site-to-site-rm-powershell/site-to-site-diagram.png)

## <a name="before"></a>Before you begin

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Verify that you have met the following criteria before beginning your configuration:

* Make sure you have a compatible VPN device and someone who is able to configure it. For more information about compatible VPN devices and device configuration, see [About VPN Devices](vpn-gateway-about-vpn-devices.md).
* Verify that you have an externally facing public IPv4 address for your VPN device.
* If you are unfamiliar with the IP address ranges located in your on-premises network configuration, you need to coordinate with someone who can provide those details for you. When you create this configuration, you must specify the IP address range prefixes that Azure will route to your on-premises location. None of the subnets of your on-premises network can over lap with the virtual network subnets that you want to connect to.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

### Running PowerShell locally

If you choose to install and use the PowerShell locally, install the latest version of the Azure Resource Manager PowerShell cmdlets. PowerShell cmdlets are updated frequently and you will typically need to update your PowerShell cmdlets to get the latest feature functionality. If you don't update your PowerShell cmdlets, the values specify may fail. 

To find the version you are using, run 'Get-Module -ListAvailable Az'. If you need to upgrade, see [Install the Azure PowerShell module](/powershell/azure/install-az-ps). For more information, see [How to install and configure Azure PowerShell](/powershell/azure/overview).
If you are running PowerShell locally, you also need to run 'Connect-AzAccount' to create a connection with Azure.


### <a name="example"></a>Example values

The examples in this article use the following values. You can use these values to create a test environment, or refer to them to better understand the examples in this article.

```
#Example values

VnetName                = VNet1
ResourceGroup           = TestRG1
Location                = East US 
AddressSpace            = 10.1.0.0/16 
SubnetName              = Frontend 
Subnet                  = 10.1.0.0/24 
GatewaySubnet           = 10.1.255.0/27
LocalNetworkGatewayName = Site1
LNG Public IP           = <On-premises VPN device IP address> 
Local Address Prefixes  = 10.101.0.0/24, 10.101.1.0/24
Gateway Name            = VNet1GW
PublicIP                = VNet1GWPIP
Gateway IP Config       = gwipconfig1 
VPNType                 = RouteBased 
GatewayType             = Vpn 
ConnectionName          = VNet1toSite1

```

## <a name="VNet"></a>1. Create a virtual network and a gateway subnet

If you don't already have a virtual network, create one. When creating a virtual network, make sure that the address spaces you specify don't overlap any of the address spaces that you have on your on-premises network. 

>[!NOTE]
>In order for this VNet to connect to an on-premises location, you need to coordinate with your on-premises network administrator to carve out an IP address range that you can use specifically for this virtual network. If a duplicate address range exists on both sides of the VPN connection, traffic does not route the way you may expect it to. Additionally, if you want to connect this VNet to another VNet, the address space cannot overlap with other VNet. Take care to plan your network configuration accordingly.
>
>

### About the gateway subnet

[!INCLUDE [About gateway subnets](../../includes/vpn-gateway-about-gwsubnet-include.md)]

[!INCLUDE [No NSG warning](../../includes/vpn-gateway-no-nsg-include.md)]

### <a name="vnet"></a>Create a virtual network and a gateway subnet

This example creates a virtual network and a gateway subnet. If you already have a virtual network that you need to add a gateway subnet to, see [To add a gateway subnet to a virtual network you have already created](#gatewaysubnet).

Create a resource group:

```azurepowershell-interactive
New-AzResourceGroup -Name TestRG1 -Location 'East US'
```

Create your virtual network.

1. Set the variables.

   ```azurepowershell-interactive
   $subnet1 = New-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 10.1.255.0/27
   $subnet2 = New-AzVirtualNetworkSubnetConfig -Name 'Frontend' -AddressPrefix 10.1.0.0/24
   ```
2. Create the VNet.

   ```azurepowershell-interactive
   New-AzVirtualNetwork -Name VNet1 -ResourceGroupName TestRG1 `
   -Location 'East US' -AddressPrefix 10.1.0.0/16 -Subnet $subnet1, $subnet2
   ```

### <a name="gatewaysubnet"></a>To add a gateway subnet to a virtual network you have already created

Use the steps in this section if you already have a virtual network, but need to add a gateway subnet.

1. Set the variables.

   ```azurepowershell-interactive
   $vnet = Get-AzVirtualNetwork -ResourceGroupName TestRG1 -Name TestVet1
   ```
2. Create the gateway subnet.

   ```azurepowershell-interactive
   Add-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 10.1.255.0/27 -VirtualNetwork $vnet
   ```
3. Set the configuration.

   ```azurepowershell-interactive
   Set-AzVirtualNetwork -VirtualNetwork $vnet
   ```

## 2. <a name="localnet"></a>Create the local network gateway

The local network gateway (LNG) typically refers to your on-premises location. It is not the same as a virtual network gateway. You give the site a name by which Azure can refer to it, then specify the IP address of the on-premises VPN device to which you will create a connection. You also specify the IP address prefixes that will be routed through the VPN gateway to the VPN device. The address prefixes you specify are the prefixes located on your on-premises network. If your on-premises network changes, you can easily update the prefixes.

Use the following values:

* The *GatewayIPAddress* is the IP address of your on-premises VPN device.
* The *AddressPrefix* is your on-premises address space.

To add a local network gateway with a single address prefix:

  ```azurepowershell-interactive
  New-AzLocalNetworkGateway -Name Site1 -ResourceGroupName TestRG1 `
  -Location 'East US' -GatewayIpAddress '23.99.221.164' -AddressPrefix '10.101.0.0/24'
  ```

To add a local network gateway with multiple address prefixes:

  ```azurepowershell-interactive
  New-AzLocalNetworkGateway -Name Site1 -ResourceGroupName TestRG1 `
  -Location 'East US' -GatewayIpAddress '23.99.221.164' -AddressPrefix @('10.101.0.0/24','10.101.1.0/24')
  ```

To modify IP address prefixes for your local network gateway:

Sometimes your local network gateway prefixes change. The steps you take to modify your IP address prefixes depend on whether you have created a VPN gateway connection. See the [Modify IP address prefixes for a local network gateway](#modify) section of this article.

## <a name="PublicIP"></a>3. Request a Public IP address

A VPN gateway must have a Public IP address. You first request the IP address resource, and then refer to it when creating your virtual network gateway. The IP address is dynamically assigned to the resource when the VPN gateway is created. 

VPN Gateway currently only supports *Dynamic* Public IP address allocation. You cannot request a Static Public IP address assignment. However, this does not mean that the IP address will change after it has been assigned to your VPN gateway. The only time the Public IP address changes is when the gateway is deleted and re-created. It doesn't change across resizing, resetting, or other internal maintenance/upgrades of your VPN gateway.

Request a Public IP address that will be assigned to your virtual network VPN gateway.

```azurepowershell-interactive
$gwpip= New-AzPublicIpAddress -Name VNet1GWPIP -ResourceGroupName TestRG1 -Location 'East US' -AllocationMethod Dynamic
```

## <a name="GatewayIPConfig"></a>4. Create the gateway IP addressing configuration

The gateway configuration defines the subnet (the 'GatewaySubnet') and the public IP address to use. Use the following example to create your gateway configuration:

```azurepowershell-interactive
$vnet = Get-AzVirtualNetwork -Name VNet1 -ResourceGroupName TestRG1
$subnet = Get-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -VirtualNetwork $vnet
$gwipconfig = New-AzVirtualNetworkGatewayIpConfig -Name gwipconfig1 -SubnetId $subnet.Id -PublicIpAddressId $gwpip.Id
```

## <a name="CreateGateway"></a>5. Create the VPN gateway

Create the virtual network VPN gateway.

Use the following values:

* The *-GatewayType* for a Site-to-Site configuration is *Vpn*. The gateway type is always specific to the configuration that you are implementing. For example, other gateway configurations may require -GatewayType ExpressRoute.
* The *-VpnType* can be *RouteBased* (referred to as a Dynamic Gateway in some documentation), or *PolicyBased* (referred to as a Static Gateway in some documentation). For more information about VPN gateway types, see [About VPN Gateway](vpn-gateway-about-vpngateways.md).
* Select the Gateway SKU that you want to use. There are configuration limitations for certain SKUs. For more information, see [Gateway SKUs](vpn-gateway-about-vpn-gateway-settings.md#gwsku). If you get an error when creating the VPN gateway regarding the -GatewaySku, verify that you have installed the latest version of the PowerShell cmdlets.

```azurepowershell-interactive
New-AzVirtualNetworkGateway -Name VNet1GW -ResourceGroupName TestRG1 `
-Location 'East US' -IpConfigurations $gwipconfig -GatewayType Vpn `
-VpnType RouteBased -GatewaySku VpnGw1
```

After running this command, it can take up to 45 minutes for the gateway configuration to complete.

## <a name="ConfigureVPNDevice"></a>6. Configure your VPN device

Site-to-Site connections to an on-premises network require a VPN device. In this step, you configure your VPN device. When configuring your VPN device, you need the following items:

- A shared key. This is the same shared key that you specify when creating your Site-to-Site VPN connection. In our examples, we use a basic shared key. We recommend that you generate a more complex key to use.
- The Public IP address of your virtual network gateway. You can view the public IP address by using the Azure portal, PowerShell, or CLI. To find the Public IP address of your virtual network gateway using PowerShell, use the following example. In this example, VNet1GWPIP is the name of the public IP address resource that you created in an earlier step.

  ```azurepowershell-interactive
  Get-AzPublicIpAddress -Name VNet1GWPIP -ResourceGroupName TestRG1
  ```

[!INCLUDE [Configure VPN device](../../includes/vpn-gateway-configure-vpn-device-rm-include.md)]


## <a name="CreateConnection"></a>7. Create the VPN connection

Next, create the Site-to-Site VPN connection between your virtual network gateway and your VPN device. Be sure to replace the values with your own. The shared key must match the value you used for your VPN device configuration. Notice that the '-ConnectionType' for Site-to-Site is **IPsec**.

1. Set the variables.
   ```azurepowershell-interactive
   $gateway1 = Get-AzVirtualNetworkGateway -Name VNet1GW -ResourceGroupName TestRG1
   $local = Get-AzLocalNetworkGateway -Name Site1 -ResourceGroupName TestRG1
   ```

2. Create the connection.
   ```azurepowershell-interactive
   New-AzVirtualNetworkGatewayConnection -Name VNet1toSite1 -ResourceGroupName TestRG1 `
   -Location 'East US' -VirtualNetworkGateway1 $gateway1 -LocalNetworkGateway2 $local `
   -ConnectionType IPsec -RoutingWeight 10 -SharedKey 'abc123'
   ```

After a short while, the connection will be established.

## <a name="toverify"></a>8. Verify the VPN connection

There are a few different ways to verify your VPN connection.

[!INCLUDE [Verify connection](../../includes/vpn-gateway-verify-connection-ps-rm-include.md)]

## <a name="connectVM"></a>To connect to a virtual machine

[!INCLUDE [Connect to a VM](../../includes/vpn-gateway-connect-vm-s2s-include.md)]


## <a name="modify"></a>To modify IP address prefixes for a local network gateway

If the IP address prefixes that you want routed to your on-premises location change, you can modify the local network gateway. Two sets of instructions are provided. The instructions you choose depend on whether you have already created your gateway connection. When using these examples, modify the values to match your environment.

[!INCLUDE [Modify prefixes](../../includes/vpn-gateway-modify-ip-prefix-rm-include.md)]

## <a name="modifygwipaddress"></a>To modify the gateway IP address for a local network gateway

[!INCLUDE [Modify gateway IP address](../../includes/vpn-gateway-modify-lng-gateway-ip-rm-include.md)]

## Next steps

*  Once your connection is complete, you can add virtual machines to your virtual networks. For more information, see [Virtual Machines](https://docs.microsoft.com/azure/).
* For information about BGP, see the [BGP Overview](vpn-gateway-bgp-overview.md) and [How to configure BGP](vpn-gateway-bgp-resource-manager-ps.md).
* For information about creating a site-to-site VPN connection using Azure Resource Manager template, see [Create a Site-to-Site VPN Connection](https://azure.microsoft.com/resources/templates/101-site-to-site-vpn-create/).
* For information about creating a vnet-to-vnet VPN connection using Azure Resource Manager template, see [Deploy HBase geo replication](https://azure.microsoft.com/resources/templates/101-hdinsight-hbase-replication-geo/).
