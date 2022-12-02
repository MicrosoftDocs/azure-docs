---
title: 'Configure forced tunneling for Site-to-Site connections'
description: Learn how to redirect (force) all Internet-bound traffic back to your on-premises location.
services: vpn-gateway
titleSuffix: Azure VPN Gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 03/22/2021
ms.author: cherylmc

---
# Configure forced tunneling

Forced tunneling lets you redirect or "force" all Internet-bound traffic back to your on-premises location via a Site-to-Site VPN tunnel for inspection and auditing. This is a critical security requirement for most enterprise IT policies. If you don't configure forced tunneling, Internet-bound traffic from your VMs in Azure always traverses from the Azure network infrastructure directly out to the Internet, without the option to allow you to inspect or audit the traffic. Unauthorized Internet access can potentially lead to information disclosure or other types of security breaches.

Forced tunneling can be configured by using Azure PowerShell. It can't be configured using the Azure portal. This article helps you configure forced tunneling for virtual networks created using the [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md). If you want to configure forced tunneling for the classic deployment model, see [Forced tunneling - classic](vpn-gateway-about-forced-tunneling.md).

## About forced tunneling

The following diagram illustrates how forced tunneling works.

:::image type="content" source="./media/vpn-gateway-forced-tunneling-rm/forced-tunnel.png" alt-text="Diagram shows forced tunneling.":::

In this example, the Frontend subnet is not force tunneled. The workloads in the Frontend subnet can continue to accept and respond to customer requests from the Internet directly. The Mid-tier and Backend subnets are forced tunneled. Any outbound connections from these two subnets to the Internet will be forced or redirected back to an on-premises site via one of the Site-to-site (S2S) VPN tunnels.

This allows you to restrict and inspect Internet access from your virtual machines or cloud services in Azure, while continuing to enable your multi-tier service architecture required. If there are no Internet-facing workloads in your virtual networks, you also can apply forced tunneling to the entire virtual networks.

## Requirements and considerations

Forced tunneling in Azure is configured using virtual network custom user-defined routes. Redirecting traffic to an on-premises site is expressed as a Default Route to the Azure VPN gateway. For more information about user-defined routing and virtual networks, see [Custom user-defined routes](../virtual-network/virtual-networks-udr-overview.md#user-defined).

* Each virtual network subnet has a built-in, system routing table. The system routing table has the following three groups of routes:
  
  * **Local VNet routes:** Directly to the destination VMs in the same virtual network.
  * **On-premises routes:** To the Azure VPN gateway.
  * **Default route:** Directly to the Internet. Packets destined to the private IP addresses not covered by the previous two routes are dropped.
* Forced tunneling must be associated with a VNet that has a route-based VPN gateway. Your forced tunneling configuration will override the default route for any subnet in its VNet. You need to set a "default site" among the cross-premises local sites connected to the virtual network. Also, the on-premises VPN device must be configured using 0.0.0.0/0 as traffic selectors. 
* ExpressRoute forced tunneling is not configured via this mechanism, but instead, is enabled by advertising a default route via the ExpressRoute BGP peering sessions. For more information, see the [ExpressRoute Documentation](../expressroute/index.yml).

## Configuration overview

The following procedure helps you create a resource group and a VNet. You'll then create a VPN gateway and configure forced tunneling. In this procedure, the virtual network 'MultiTier-VNet' has three subnets: 'Frontend', 'Midtier', and 'Backend', with four cross-premises connections: 'DefaultSiteHQ', and three Branches.

The procedure steps set the 'DefaultSiteHQ' as the default site connection for forced tunneling, and configure the 'Midtier' and 'Backend' subnets to use forced tunneling.

## <a name="before"></a>Before you begin

Install the latest version of the Azure Resource Manager PowerShell cmdlets. See [How to install and configure Azure PowerShell](/powershell/azure/) for more information about installing the PowerShell cmdlets.

> [!IMPORTANT]
> Installing the latest version of the PowerShell cmdlets is required. Otherwise, you may receive validation errors when running some of the cmdlets.
>
>

### To sign in

[!INCLUDE [Sign in](../../includes/vpn-gateway-cloud-shell-ps-login.md)]

## Configure forced tunneling

> [!NOTE]
> You may see warnings saying "The output object type of this cmdlet will be modified in a future release". This is expected behavior and you can safely ignore these warnings.
>
>


1. Create a resource group.

   ```powershell
   New-AzResourceGroup -Name 'ForcedTunneling' -Location 'North Europe'
   ```
2. Create a virtual network and specify subnets.

   ```powershell 
   $s1 = New-AzVirtualNetworkSubnetConfig -Name "Frontend" -AddressPrefix "10.1.0.0/24"
   $s2 = New-AzVirtualNetworkSubnetConfig -Name "Midtier" -AddressPrefix "10.1.1.0/24"
   $s3 = New-AzVirtualNetworkSubnetConfig -Name "Backend" -AddressPrefix "10.1.2.0/24"
   $s4 = New-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -AddressPrefix "10.1.200.0/28"
   $vnet = New-AzVirtualNetwork -Name "MultiTier-VNet" -Location "North Europe" -ResourceGroupName "ForcedTunneling" -AddressPrefix "10.1.0.0/16" -Subnet $s1,$s2,$s3,$s4
   ```
3. Create the local network gateways.

   ```powershell
   $lng1 = New-AzLocalNetworkGateway -Name "DefaultSiteHQ" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -GatewayIpAddress "111.111.111.111" -AddressPrefix "192.168.1.0/24"
   $lng2 = New-AzLocalNetworkGateway -Name "Branch1" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -GatewayIpAddress "111.111.111.112" -AddressPrefix "192.168.2.0/24"
   $lng3 = New-AzLocalNetworkGateway -Name "Branch2" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -GatewayIpAddress "111.111.111.113" -AddressPrefix "192.168.3.0/24"
   $lng4 = New-AzLocalNetworkGateway -Name "Branch3" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -GatewayIpAddress "111.111.111.114" -AddressPrefix "192.168.4.0/24"
   `````
4. Create the virtual network gateway. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU. If you see ValidateSet errors regarding the GatewaySKU value, verify that you have installed the [latest version of the PowerShell cmdlets](#before). The latest version of the PowerShell cmdlets contains the new validated values for the latest Gateway SKUs.

   ```powershell
   $pip = New-AzPublicIpAddress -Name "GatewayIP" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -AllocationMethod Dynamic
   $gwsubnet = Get-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet
   $ipconfig = New-AzVirtualNetworkGatewayIpConfig -Name "gwIpConfig" -SubnetId $gwsubnet.Id -PublicIpAddressId $pip.Id
   New-AzVirtualNetworkGateway -Name "Gateway1" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -IpConfigurations $ipconfig -GatewayType Vpn -VpnType RouteBased -GatewaySku VpnGw1 -EnableBgp $false
   ```
5. Assign a default site to the virtual network gateway. The **-GatewayDefaultSite** is the cmdlet parameter that allows the forced routing configuration to work, so take care to configure this setting properly. 

   ```powershell
   $LocalGateway = Get-AzLocalNetworkGateway -Name "DefaultSiteHQ" -ResourceGroupName "ForcedTunneling"
   $VirtualGateway = Get-AzVirtualNetworkGateway -Name "Gateway1" -ResourceGroupName "ForcedTunneling"
   Set-AzVirtualNetworkGatewayDefaultSite -GatewayDefaultSite $LocalGateway -VirtualNetworkGateway $VirtualGateway
   ```
6. Establish the Site-to-Site VPN connections.

   ```powershell
   $gateway = Get-AzVirtualNetworkGateway -Name "Gateway1" -ResourceGroupName "ForcedTunneling"
   $lng1 = Get-AzLocalNetworkGateway -Name "DefaultSiteHQ" -ResourceGroupName "ForcedTunneling" 
   $lng2 = Get-AzLocalNetworkGateway -Name "Branch1" -ResourceGroupName "ForcedTunneling" 
   $lng3 = Get-AzLocalNetworkGateway -Name "Branch2" -ResourceGroupName "ForcedTunneling" 
   $lng4 = Get-AzLocalNetworkGateway -Name "Branch3" -ResourceGroupName "ForcedTunneling" 
    
   New-AzVirtualNetworkGatewayConnection -Name "Connection1" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -VirtualNetworkGateway1 $gateway -LocalNetworkGateway2 $lng1 -ConnectionType IPsec -SharedKey "preSharedKey"
   New-AzVirtualNetworkGatewayConnection -Name "Connection2" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -VirtualNetworkGateway1 $gateway -LocalNetworkGateway2 $lng2 -ConnectionType IPsec -SharedKey "preSharedKey"
   New-AzVirtualNetworkGatewayConnection -Name "Connection3" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -VirtualNetworkGateway1 $gateway -LocalNetworkGateway2 $lng3 -ConnectionType IPsec -SharedKey "preSharedKey"
   New-AzVirtualNetworkGatewayConnection -Name "Connection4" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -VirtualNetworkGateway1 $gateway -LocalNetworkGateway2 $lng4 -ConnectionType IPsec -SharedKey "preSharedKey"
    
   Get-AzVirtualNetworkGatewayConnection -Name "Connection1" -ResourceGroupName "ForcedTunneling"
   ```
