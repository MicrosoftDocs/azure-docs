---
title: Configure ExpressRoute and S2S VPN coexisting connections with Azure PowerShell
description: Configure ExpressRoute and a site-to-site VPN connection that can coexist for the Resource Manager model using Azure PowerShell.
services: expressroute
author: duongau
ms.service: expressroute
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 06/15/2023
ms.author: duau
---
# Configure ExpressRoute and site-to-site coexisting connections using PowerShell
> [!div class="op_single_selector"]
> * [PowerShell - Resource Manager](expressroute-howto-coexist-resource-manager.md)
> * [PowerShell - Classic](expressroute-howto-coexist-classic.md)
> 

This article helps you configure ExpressRoute and site-to-site VPN connections that coexist. Having the ability to configure site-to-site VPN and ExpressRoute has several advantages. You can configure site-to-site VPN as a secure failover path for ExpressRoute, or use site-to-site VPNs to connect to sites that aren't connected through ExpressRoute. We cover the steps to configure both scenarios in this article. This article applies to the Resource Manager deployment model.

Configuring site-to-site VPN and ExpressRoute coexisting connections has several advantages:

* You can configure a site-to-site VPN as a secure failover path for ExpressRoute. 
* Alternatively, you can use site-to-site VPNs to connect to sites that aren't connected through ExpressRoute. 

The steps to configure both scenarios are covered in this article. This article applies to the Resource Manager deployment model and uses PowerShell. You can also configure these scenarios using the Azure portal, although documentation isn't yet available. You can configure either gateway first. Typically, you don't experience any downtime when adding a new gateway or gateway connection.

> [!NOTE]
> If you want to create a site-to-site VPN over an ExpressRoute circuit, see [**site-to-site VPN over Microsoft peering**](site-to-site-vpn-over-microsoft-peering.md).
>

## Limits and limitations

* **Only route-based VPN gateway is supported.** You must use a route-based [VPN gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md). You also can use a route-based VPN gateway with a VPN connection configured for 'policy-based traffic selectors' as described in [Connect to multiple policy-based VPN devices](../vpn-gateway/vpn-gateway-connect-multiple-policybased-rm-ps.md).
* ExpressRoute-VPN Gateway coexist configurations are **not supported on the Basic SKU**.
* If you want to use transit routing between ExpressRoute and VPN, **the ASN of Azure VPN Gateway must be set to 65515, and Azure Route Server should be used.** Azure VPN Gateway supports the BGP routing protocol. For ExpressRoute and Azure VPN to work together, you must keep the Autonomous System Number of your Azure VPN gateway at its default value, 65515. If you previously selected an ASN other than 65515 and you change the setting to 65515, you must reset the VPN gateway for the setting to take effect.
* **The gateway subnet must be /27 or a shorter prefix**, such as /26, /25, or you receive an error message when you add the ExpressRoute virtual network gateway.
* **Coexistence in a dual-stack virtual network is not supported.** If you're using ExpressRoute IPv6 support and a dual-stack ExpressRoute gateway, coexistence with VPN Gateway isn't possible.

## Configuration designs

### Configure a site-to-site VPN as a failover path for ExpressRoute

You can configure a site-to-site VPN connection as a backup for your ExpressRoute connection. This connection applies only to virtual networks linked to the Azure private peering path. There's no VPN-based failover solution for services accessible through Azure Microsoft peering. The ExpressRoute circuit is always the primary link. Data flows through the site-to-site VPN path only if the ExpressRoute circuit fails. To avoid asymmetrical routing, your local network configuration should also prefer the ExpressRoute circuit over the site-to-site VPN. You can prefer the ExpressRoute path by setting higher local preference for the routes received the ExpressRoute. 

> [!NOTE]
> * If you have ExpressRoute Microsoft peering enabled, you can receive the public IP address of your Azure VPN gateway on the ExpressRoute connection. To set up your site-to-site VPN connection as a backup, you must configure your on-premises network so that the VPN connection is routed to the Internet.
>
> * While the ExpressRoute circuit path is preferred over the site-to-site VPN when both routes are the same, Azure uses the longest prefix match to choose the route towards the packet's destination.
> 

![Diagram that shows a site-to-site VPN connection as a backup for ExpressRoute.](media/expressroute-howto-coexist-resource-manager/scenario1.jpg)

### Configure a site-to-site VPN to connect to sites not connected through ExpressRoute

You can configure your network where some sites connect directly to Azure over site-to-site VPN, and some sites connect through ExpressRoute. 

![Coexist](media/expressroute-howto-coexist-resource-manager/scenario2.jpg)

## Selecting the steps to use

There are two different sets of procedures to choose from. The configuration procedure that you select depends on whether you have an existing virtual network that you want to connect to, or you want to create a new virtual network.

* I don't have a VNet and need to create one.
  
    If you don’t already have a virtual network, this procedure walks you through creating a new virtual network using Resource Manager deployment model and creating new ExpressRoute and site-to-site VPN connections.

* I already have a Resource Manager deployment model VNet.
  
    You may already have a virtual network in place with an existing site-to-site VPN connection or ExpressRoute connection. In this scenario if the gateway subnet prefix is /28 or longer (/29, /30, etc.), you have to delete the existing gateway. The steps to configure coexisting connections for an already existing VNet section walks you through deleting the gateway, and then creating new ExpressRoute and site-to-site VPN connections.
  
    If you delete and recreate your gateway, you experience downtime for your cross-premises connections. However, your VMs and services can connect through the internet while you configure your gateway if they're configured to do so.

## Before you begin

[!INCLUDE [updated-for-az](../../includes/hybrid-az-ps.md)]

[!INCLUDE [working with cloud shell](../../includes/expressroute-cloudshell-powershell-about.md)]


#### [New virtual network and coexisting connections](#tab/new-virtual-network)

This procedure walks you through creating a VNet and site-to-site and ExpressRoute connections that coexist. The cmdlets that you use for this configuration may be slightly different than what you might be familiar with. Be sure to use the cmdlets specified in these instructions.

1. Sign in and select your subscription.

   [!INCLUDE [sign in](../../includes/expressroute-cloud-shell-connect.md)]

2. Define variables and create resource group.

   ```azurepowershell-interactive
   $location = "Central US"
   $resgrp = New-AzResourceGroup -Name "ErVpnCoex" -Location $location
   $VNetASN = 65515
   ```
3. Create a virtual network including the `GatewaySubnet`. For more information about creating a virtual network, see [Create a virtual network](../virtual-network/manage-virtual-network.md#create-a-virtual-network). For more information about creating subnets, see [Create a subnet](../virtual-network/virtual-network-manage-subnet.md#add-a-subnet)
   
   > [!IMPORTANT]
   > The **GatewaySubnet** must be a /27 or a shorter prefix, such as /26 or /25.
   > 
   
    Create a new virtual network.

   ```azurepowershell-interactive
   $vnet = New-AzVirtualNetwork -Name "CoexVnet" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -AddressPrefix "10.200.0.0/16"
   ```
   
    Add two subnets named **App** and **GatewaySubnet**.

   ```azurepowershell-interactive
   Add-AzVirtualNetworkSubnetConfig -Name "App" -VirtualNetwork $vnet -AddressPrefix "10.200.1.0/24"
   Add-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet -AddressPrefix "10.200.255.0/24"
   ```
   
    Save the virtual network configuration.

   ```azurepowershell-interactive
   $vnet = Set-AzVirtualNetwork -VirtualNetwork $vnet
   ```
4. <a name="vpngw"></a>Next, create your site-to-site VPN gateway. For more information about the VPN gateway configuration, see [Configure a VNet with a site-to-site connection](../vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell.md). The GatewaySku is only supported for *VpnGw1*, *VpnGw2*, *VpnGw3*, *Standard*, and *HighPerformance* VPN gateways. ExpressRoute-VPN Gateway coexist configurations aren't supported on the Basic SKU. The VpnType must be **RouteBased**.

   ```azurepowershell-interactive
   $gwSubnet = Get-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet
   $gwIP = New-AzPublicIpAddress -Name "VPNGatewayIP" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -AllocationMethod Dynamic
   $gwConfig = New-AzVirtualNetworkGatewayIpConfig -Name "VPNGatewayIpConfig" -SubnetId $gwSubnet.Id -PublicIpAddressId $gwIP.Id
   New-AzVirtualNetworkGateway -Name "VPNGateway" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -IpConfigurations $gwConfig -GatewayType "Vpn" -VpnType "RouteBased" -GatewaySku "VpnGw1"
   ```
   
   The Azure VPN gateway supports BGP routing protocol. You can specify ASN (AS Number) for the virtual network by adding the `-Asn` flag in the following command. Not specifying the `Asn` parameter defaults to the AS number to **65515**.

   ```azurepowershell-interactive
   $azureVpn = New-AzVirtualNetworkGateway -Name "VPNGateway" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -IpConfigurations $gwConfig -GatewayType "Vpn" -VpnType "RouteBased" -GatewaySku "VpnGw1"
   ```

   > [!NOTE]
   > For coexisting gateways, you must use the default ASN of 65515. For more information, see [limits and limitations](#limits-and-limitations).
   > 

    You can find the BGP peering IP and the AS number that Azure uses for the VPN gateway by running `$azureVpn.BgpSettings.BgpPeeringAddress` and `$azureVpn.BgpSettings.Asn`. For more information, see [Configure BGP](../vpn-gateway/vpn-gateway-bgp-resource-manager-ps.md) for Azure VPN gateway.

5. Create a local site VPN gateway entity. This command doesn’t configure your on-premises VPN gateway. Rather, it allows you to provide the local gateway settings, such as the public IP and the on-premises address space, so that the Azure VPN gateway can connect to it.
   
    If your local VPN device only supports static routing, you can configure the static routes in the following way:

   ```azurepowershell-interactive
   $MyLocalNetworkAddress = @("10.100.0.0/16","10.101.0.0/16","10.102.0.0/16")
   $localVpn = New-AzLocalNetworkGateway -Name "LocalVPNGateway" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -GatewayIpAddress *<Public IP>* -AddressPrefix $MyLocalNetworkAddress
   ```
   
    If your local VPN device supports the BGP and you want to enable dynamic routing, you need to know the BGP peering IP and the AS number of your local VPN device.

   ```azurepowershell-interactive
   $localVPNPublicIP = "<Public IP>"
   $localBGPPeeringIP = "<Private IP for the BGP session>"
   $localBGPASN = "<ASN>"
   $localAddressPrefix = $localBGPPeeringIP + "/32"
   $localVpn = New-AzLocalNetworkGateway -Name "LocalVPNGateway" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -GatewayIpAddress $localVPNPublicIP -AddressPrefix $localAddressPrefix -BgpPeeringAddress $localBGPPeeringIP -Asn $localBGPASN
   ```
6. Configure your local VPN device to connect to the new Azure VPN gateway. For more information about VPN device configuration, see [VPN Device Configuration](../vpn-gateway/vpn-gateway-about-vpn-devices.md).

7. Link the site-to-site VPN gateway on Azure to the local gateway.

   ```azurepowershell-interactive
   $azureVpn = Get-AzVirtualNetworkGateway -Name "VPNGateway" -ResourceGroupName $resgrp.ResourceGroupName
   New-AzVirtualNetworkGatewayConnection -Name "VPNConnection" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -VirtualNetworkGateway1 $azureVpn -LocalNetworkGateway2 $localVpn -ConnectionType IPsec -SharedKey <yourkey>
   ```
 

8. If you're connecting to an existing ExpressRoute circuit, skip steps 8 & 9 and, jump to step 10. Configure ExpressRoute circuits. For more information about configuring ExpressRoute circuit, see [create an ExpressRoute circuit](expressroute-howto-circuit-arm.md).


9. Configure Azure private peering over the ExpressRoute circuit. For more information about configuring Azure private peering over the ExpressRoute circuit, see  [configure peering](expressroute-howto-routing-arm.md)

10. <a name="gw"></a>Create an ExpressRoute gateway. For more information about the ExpressRoute gateway configuration, see [ExpressRoute gateway configuration](expressroute-howto-add-gateway-resource-manager.md). The GatewaySKU must be *Standard*, *HighPerformance*, or *UltraPerformance*.

    ```azurepowershell-interactive
    $gwSubnet = Get-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet
    $gwIP = New-AzPublicIpAddress -Name "ERGatewayIP" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -AllocationMethod Dynamic
    $gwConfig = New-AzVirtualNetworkGatewayIpConfig -Name "ERGatewayIpConfig" -SubnetId $gwSubnet.Id -PublicIpAddressId $gwIP.Id
    $gw = New-AzVirtualNetworkGateway -Name "ERGateway" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -IpConfigurations $gwConfig -GatewayType "ExpressRoute" -GatewaySku Standard
    ```
11. Link the ExpressRoute gateway to the ExpressRoute circuit. After this step has been completed, the connection between your on-premises network and Azure, through ExpressRoute, is established. For more information about the link operation, see [Link VNets to ExpressRoute](expressroute-howto-linkvnet-arm.md).

    ```azurepowershell-interactive
    $ckt = Get-AzExpressRouteCircuit -Name "YourCircuit" -ResourceGroupName "YourCircuitResourceGroup"
    New-AzVirtualNetworkGatewayConnection -Name "ERConnection" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -VirtualNetworkGateway1 $gw -PeerId $ckt.Id -ConnectionType ExpressRoute
    ```

#### [Existing virtual network with a gateway](#tab/existing-virtual-network)

If you have a virtual network that has only one virtual network gateway and you want to add another gateway of a different type, first check the gateway subnet size. If the gateway subnet is /27 or larger, you can skip the steps in this section and follow the steps in the previous section to add either a site-to-site VPN gateway or an ExpressRoute gateway. If the gateway subnet is /28 or /29, you have to first delete the virtual network gateway and increase the gateway subnet size. The steps in this section show you how to do that.

1. Delete the existing ExpressRoute or site-to-site VPN gateway.

   ```azurepowershell-interactive 
   Remove-AzVirtualNetworkGateway -Name <yourgatewayname> -ResourceGroupName <yourresourcegroup>
   ```
2. Delete Gateway Subnet.

   ```azurepowershell-interactive
   $vnet = Get-AzVirtualNetwork -Name <yourvnetname> -ResourceGroupName <yourresourcegroup> Remove-AzVirtualNetworkSubnetConfig -Name GatewaySubnet -VirtualNetwork $vnet
   ```
3. Add a Gateway Subnet that is /27 or larger.
   
   > [!NOTE]
   > If you don't have enough IP addresses left in your virtual network to increase the gateway subnet size, you need to add more IP address space.
   > 

   ```azurepowershell-interactive
   $vnet = Get-AzVirtualNetwork -Name <yourvnetname> -ResourceGroupName <yourresourcegroup>
   Add-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet -AddressPrefix "10.200.255.0/24"
   ```
   
    Save the VNet configuration.

   ```azurepowershell-interactive
   $vnet = Set-AzVirtualNetwork -VirtualNetwork $vnet
   ```
4. At this point, you have a virtual network with no gateways. To create new gateways and set up the connections, use the following examples:

   Set the variables.

    ```azurepowershell-interactive
   $gwSubnet = Get-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet
   $gwIP = New-AzPublicIpAddress -Name "ERGatewayIP" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -AllocationMethod Dynamic
   $gwConfig = New-AzVirtualNetworkGatewayIpConfig -Name "ERGatewayIpConfig" -SubnetId $gwSubnet.Id -PublicIpAddressId $gwIP.Id
   ```

   Create the gateway.

   ```azurepowershell-interactive
   $gw = New-AzVirtualNetworkGateway -Name <yourgatewayname> -ResourceGroupName <yourresourcegroup> -Location <yourlocation> -IpConfigurations $gwConfig -GatewayType "ExpressRoute" -GatewaySku Standard
   ```

   Create the connection.

   ```azurepowershell-interactive
   $ckt = Get-AzExpressRouteCircuit -Name "YourCircuit" -ResourceGroupName "YourCircuitResourceGroup"
   New-AzVirtualNetworkGatewayConnection -Name "ERConnection" -ResourceGroupName $resgrp.ResourceGroupName -Location $location -VirtualNetworkGateway1 $gw -PeerId $ckt.Id -ConnectionType ExpressRoute
   ```

---

## To add point-to-site configuration to the VPN gateway

You can follow these steps to add a point-to-site configuration to your VPN gateway in a coexistence setup. To upload the VPN root certificate, you must either install PowerShell locally to your computer, or use the Azure portal.

1. Add VPN Client address pool.

   ```azurepowershell-interactive
   $azureVpn = Get-AzVirtualNetworkGateway -Name "VPNGateway" -ResourceGroupName $resgrp.ResourceGroupName
   Set-AzVirtualNetworkGateway -VirtualNetworkGateway $azureVpn -VpnClientAddressPool "10.251.251.0/24"
   ```
2. Upload the VPN [root certificate](../vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md#Certificates) to Azure for your VPN gateway. In this example, we assume the root certificate gets stored in the local machine where the following PowerShell cmdlets run and that you're running PowerShell locally. You can also upload the certificate using the Azure portal.

   ```powershell
   $p2sCertFullName = "RootErVpnCoexP2S.cer" 
   $p2sCertMatchName = "RootErVpnCoexP2S" 
   $p2sCertToUpload=get-childitem Cert:\CurrentUser\My | Where-Object {$_.Subject -match $p2sCertMatchName} 
   if ($p2sCertToUpload.count -eq 1){write-host "cert found"} else {write-host "cert not found" exit} 
   $p2sCertData = [System.Convert]::ToBase64String($p2sCertToUpload.RawData) 
   Add-AzVpnClientRootCertificate -VpnClientRootCertificateName $p2sCertFullName -VirtualNetworkGatewayname $azureVpn.Name -ResourceGroupName $resgrp.ResourceGroupName -PublicCertData $p2sCertData
   ```
For more information on Point-to-Site VPN, see [Configure a Point-to-Site connection](../vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md).

## To enable transit routing between ExpressRoute and Azure VPN

If you want to enable connectivity between one of your local networks that is connected to ExpressRoute and another of your local network that is connected to a site-to-site VPN connection, you need to set up [Azure Route Server](../route-server/expressroute-vpn-support.md).

## Next steps

For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).
