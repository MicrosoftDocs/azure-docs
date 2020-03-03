---
title: 'Azure VPN Gateway: Configure forced tunneling - Site-to-Site connections: classic'
description: How to redirect or 'force' all Internet-bound traffic back to your on-premises location.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: article
ms.date: 08/01/2017
ms.author: cherylmc

---
# Configure forced tunneling using the classic deployment model

Forced tunneling lets you redirect or "force" all Internet-bound traffic back to your on-premises location via a Site-to-Site VPN tunnel for inspection and auditing. This is a critical security requirement for most enterprise IT policies. Without forced tunneling, Internet-bound traffic from your VMs in Azure will always traverse from Azure network infrastructure directly out to the Internet, without the option to allow you to inspect or audit the traffic. Unauthorized Internet access can potentially lead to information disclosure or other types of security breaches.

[!INCLUDE [vpn-gateway-classic-rm](../../includes/vpn-gateway-classic-rm-include.md)]

This article walks you through configuring forced tunneling for virtual networks created using the classic deployment model. Forced tunneling can be configured by using PowerShell, not through the portal. If you want to configure forced tunneling for the Resource Manager deployment model, select Resource Manager article from the following dropdown list:

> [!div class="op_single_selector"]
> * [PowerShell - Classic](vpn-gateway-about-forced-tunneling.md)
> * [PowerShell - Resource Manager](vpn-gateway-forced-tunneling-rm.md)
> 
> 

## Requirements and considerations
Forced tunneling in Azure is configured via virtual network user-defined routes (UDR). Redirecting traffic to an on-premises site is expressed as a Default Route to the Azure VPN gateway. The following section lists the current limitation of the routing table and routes for an Azure Virtual Network:

* Each virtual network subnet has a built-in, system routing table. The system routing table has the following three groups of routes:

  * **Local VNet routes:** Directly to the destination VMs in the same virtual network.
  * **On-premises routes:** To the Azure VPN gateway.
  * **Default route:** Directly to the Internet. Packets destined to the private IP addresses not covered by the previous two routes will be dropped.
* With the release of user-defined routes, you can create a routing table to add a default route, and then associate the routing table to your VNet subnet(s) to enable forced tunneling on those subnets.
* You need to set a "default site" among the cross-premises local sites connected to the virtual network.
* Forced tunneling must be associated with a VNet that has a dynamic routing VPN gateway (not a static gateway).
* ExpressRoute forced tunneling is not configured via this mechanism, but instead, is enabled by advertising a default route via the ExpressRoute BGP peering sessions. See the [ExpressRoute Documentation](https://azure.microsoft.com/documentation/services/expressroute/) for more information.

## Configuration overview
In the following example, the Frontend subnet is not forced tunneled. The workloads in the Frontend subnet can continue to accept and respond to customer requests from the Internet directly. The Mid-tier and Backend subnets are forced tunneled. Any outbound connections from these two subnets to the Internet will be forced or redirected back to an on-premises site via one of the S2S VPN tunnels.

This allows you to restrict and inspect Internet access from your virtual machines or cloud services in Azure, while continuing to enable your multi-tier service architecture required. You also can apply forced tunneling to the entire virtual networks if there are no Internet-facing workloads in your virtual networks.

![Forced Tunneling](./media/vpn-gateway-about-forced-tunneling/forced-tunnel.png)

## Before you begin
Verify that you have the following items before beginning configuration:

* An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).
* A configured virtual network. 
* [!INCLUDE [vpn-gateway-classic-powershell](../../includes/vpn-gateway-powershell-classic-locally.md)]

### To sign in

1. Open your PowerShell console with elevated rights. To switch to service management, use this command:

   ```powershell
   azure config mode asm
   ```
2. Connect to your account. Use the following example to help you connect:

   ```powershell
   Add-AzureAccount
   ```

## Configure forced tunneling
The following procedure will help you specify forced tunneling for a virtual network. The configuration steps correspond to the VNet network configuration file.

```xml
<VirtualNetworkSite name="MultiTier-VNet" Location="North Europe">
     <AddressSpace>
      <AddressPrefix>10.1.0.0/16</AddressPrefix>
        </AddressSpace>
        <Subnets>
          <Subnet name="Frontend">
            <AddressPrefix>10.1.0.0/24</AddressPrefix>
          </Subnet>
          <Subnet name="Midtier">
            <AddressPrefix>10.1.1.0/24</AddressPrefix>
          </Subnet>
          <Subnet name="Backend">
            <AddressPrefix>10.1.2.0/23</AddressPrefix>
          </Subnet>
          <Subnet name="GatewaySubnet">
            <AddressPrefix>10.1.200.0/28</AddressPrefix>
          </Subnet>
        </Subnets>
        <Gateway>
          <ConnectionsToLocalNetwork>
            <LocalNetworkSiteRef name="DefaultSiteHQ">
              <Connection type="IPsec" />
            </LocalNetworkSiteRef>
            <LocalNetworkSiteRef name="Branch1">
              <Connection type="IPsec" />
            </LocalNetworkSiteRef>
            <LocalNetworkSiteRef name="Branch2">
              <Connection type="IPsec" />
            </LocalNetworkSiteRef>
            <LocalNetworkSiteRef name="Branch3">
              <Connection type="IPsec" />
            </LocalNetworkSiteRef>
        </Gateway>
      </VirtualNetworkSite>
    </VirtualNetworkSite>
```

In this example, the virtual network 'MultiTier-VNet' has three subnets: 'Frontend', 'Midtier', and 'Backend' subnets, with four cross premises connections: 'DefaultSiteHQ', and three Branches. 

The steps will set the 'DefaultSiteHQ' as the default site connection for forced tunneling, and configure the Midtier and Backend subnets to use forced tunneling.

1. Create a routing table. Use the following cmdlet to create your route table.

   ```powershell
   New-AzureRouteTable –Name "MyRouteTable" –Label "Routing Table for Forced Tunneling" –Location "North Europe"
   ```

2. Add a default route to the routing table. 

   The following example adds a default route to the routing table created in Step 1. Note that the only route supported is the destination prefix of "0.0.0.0/0" to the "VPNGateway" NextHop.

   ```powershell
   Get-AzureRouteTable -Name "MyRouteTable" | Set-AzureRoute –RouteTable "MyRouteTable" –RouteName "DefaultRoute" –AddressPrefix "0.0.0.0/0" –NextHopType VPNGateway
   ```

3. Associate the routing table to the subnets. 

   After a routing table is created and a route added, use the following example to add or associate the route table to a VNet subnet. The example adds the route table "MyRouteTable" to the Midtier and Backend subnets of VNet MultiTier-VNet.

   ```powershell
   Set-AzureSubnetRouteTable -VirtualNetworkName "MultiTier-VNet" -SubnetName "Midtier" -RouteTableName "MyRouteTable"
   Set-AzureSubnetRouteTable -VirtualNetworkName "MultiTier-VNet" -SubnetName "Backend" -RouteTableName "MyRouteTable"
   ```

4. Assign a default site for forced tunneling. 

   In the preceding step, the sample cmdlet scripts created the routing table and associated the route table to two of the VNet subnets. The remaining step is to select a local site among the multi-site connections of the virtual network as the default site or tunnel.

   ```powershell
   $DefaultSite = @("DefaultSiteHQ")
   Set-AzureVNetGatewayDefaultSite –VNetName "MultiTier-VNet" –DefaultSite "DefaultSiteHQ"
   ```

## Additional PowerShell cmdlets
### To delete a route table

```powershell
Remove-AzureRouteTable -Name <routeTableName>
```
  
### To list a route table

```powershell
Get-AzureRouteTable [-Name <routeTableName> [-DetailLevel <detailLevel>]]
```

### To delete a route from a route table

```powershell
Remove-AzureRouteTable –Name <routeTableName>
```

### To remove a route from a subnet

```powershell
Remove-AzureSubnetRouteTable –VirtualNetworkName <virtualNetworkName> -SubnetName <subnetName>
```

### To list the route table associated with a subnet

```powershell
Get-AzureSubnetRouteTable -VirtualNetworkName <virtualNetworkName> -SubnetName <subnetName>
```

### To remove a default site from a VNet VPN gateway

```powershell
Remove-AzureVnetGatewayDefaultSite -VNetName <virtualNetworkName>
```
