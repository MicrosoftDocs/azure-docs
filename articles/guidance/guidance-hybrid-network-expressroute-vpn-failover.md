<properties
   pageTitle="Implementing a highly available hybrid network architecture | Microsoft Azure"
   description="How to implement a secure site-to-site network architecture that spans an Azure virtual network and an on-premises network connected by using ExpressRoute with VPN gateway failover."
   services="guidance,virtual-network,vpn-gateway,expressroute"
   documentationCenter="na"
   authors="telmosampaio"
   manager="christb"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/24/2016"
   ms.author="telmos"/>

# Implementing a highly available hybrid network architecture

[AZURE.INCLUDE [pnp-header](../../includes/guidance-pnp-header-include.md)]

This article describes best practices for connecting an on-premises network to virtual networks on Azure by using ExpressRoute, with a site-to-site virtual private network (VPN) as a failover connection. The traffic flows between the on-premises network and an Azure virtual network (VNet) through an ExpressRoute connection.  If there is a loss of connectivity in the ExpressRoute circuit, traffic will be routed through an IPSec VPN tunnel.

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This blueprint uses Resource Manager, which Microsoft recommends for new deployments.

Typical use cases for this architecture include:

- Hybrid applications where workloads are distributed between an on-premises network and Azure.

- Applications running large-scale, mission-critical workloads that require a high degree of scalability.

- Large-scale backup and restore facilities for data that must be saved off-site.

- Handling Big Data workloads.

- Using Azure as a disaster-recovery site.

Note that if the ExpressRoute circuit is unavailable, the VPN route will only handle private peering connections. Public peering and Microsoft peering connections will pass over the Internet.

## Architecture diagram

>[AZURE.NOTE] The [Azure VPN Gateway service][azure-vpn-gateway] implements two types of virtual network gateways; VPN virtual network gateways and ExpressRoute virtual network gateways. Throughout this document, the term *VPN Gateway* refers to the Azure service, while the phrases *VPN virtual network gateway* and *ExpressRoute virtual network gateway* are used to refer to the VPN and ExpressRoute implementations of the gateway respectively.

The following diagram highlights the important components in this architecture:

> A Visio document that includes this architecture diagram is available for download at the [Microsoft download center][visio-download]. This diagram is on the "Hybrid network - ER-VPN" page.

![[0]][0]

- **Azure Virtual Networks (VNets).** Each VNet resides in a single Azure region, and can host multiple application tiers. Application tiers can be segmented using subnets in each VNet  and/or network security groups (NSGs).

- **On-premises corporate network.** This is a network of computers and devices, connected through a private local-area network running within an organization.

- **VPN appliance.** This is a device or service that provides external connectivity to the on-premises network. The VPN appliance may be a hardware device, or it can be a software solution such as the Routing and Remote Access Service (RRAS) in Windows Server 2012.

> [AZURE.NOTE] For a list of supported VPN appliances and information on configuring selected VPN appliances for connecting to an Azure VPN Gateway, see the instructions for the appropriate device in the [list of VPN devices supported by Azure][vpn-appliance].

- **VPN virtual network gateway.** The VPN virtual network gateway enables the VNet to connect to the VPN appliance in the on-premises network. The VPN virtual network gateway is configured to accept requests from the on-premises network only through the VPN appliance. For more information, see [Connect an on-premises network to a Microsoft Azure virtual network][connect-to-an-Azure-vnet].

- **ExpressRoute virtual network gateway.** The ExpressRoute virtual network gateway enables the VNet to connect to the ExpressRoute circuit used for connectivity with your on-premises network.

- **Gateway subnet.** The virtual network gateways are held in the same subnet.

- **VPN connection.** The connection has properties that specify the connection type (IPSec) and the key shared with the on-premises VPN appliance to encrypt traffic.

- **ExpressRoute circuit.** This is a layer 2 or layer 3 circuit supplied by the connectivity provider that joins the on-premises network with Azure through the edge routers. The circuit uses the hardware infrastructure managed by the connectivity provider.

- **N-tier cloud application.** This is the application hosted in Azure. It might include multiple tiers, with multiple subnets connected through Azure load balancers. The traffic in each subnet may be subject to rules defined by using [Azure Network Security Groups][azure-network-security-group](NSGs). For more information, see [Getting started with Microsoft Azure security][getting-started-with-azure-security].

## Recommendations

Azure offers many different resources and resource types, so this reference architecture can be provisioned many different ways. We have provided an Azure Resource Manager template to install the reference architecture that follows these recommendations. If you choose to create your own reference architecture you should follow these recommendations unless you have a specific requirement that a recommendation does not fit.

### VNet and GatewaySubnet

Create the ExpressRoute virtual network gateway and the VPN virtual network gateway in the same VNet. This means that they should share the same subnet named **GatewaySubnet**

If the VNet already includes a subnet named **GatewaySubnet**, ensure that it has a /27 or larger address space. If the existing subnet is too small, then remove it as follows and create a new one as shown in the next bullet:

```powershell
$vnet = Get-AzureRmVirtualNetworkGateway -Name <yourvnetname> -ResourceGroupName <yourresourcegroup>
Remove-AzureRmVirtualNetworkSubnetConfig -Name GatewaySubnet -VirtualNetwork $vnet
```

If the VNet does not contain a subnet named **GatewaySubnet**, then create a new one as follows:

```powershell
$vnet = Get-AzureRmVirtualNetworkGateway -Name <yourvnetname> -ResourceGroupName <yourresourcegroup>
Add-AzureRmVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet -AddressPrefix "10.200.255.224/27"
$vnet = Set-AzureRmVirtualNetwork -VirtualNetwork $vnet
```

### VPN and ExpressRoute gateways

Verify that your organization meets the [ExpressRoute prerequisite requirements][expressroute-prereq] for connecting to Azure.

If you already have a VPN virtual network gateway in your Azure VNet, remove it, as shown below.

```powershell
Remove-AzureRmVirtualNetworkGateway -Name <yourgatewayname> -ResourceGroupName <yourresourcegroup>
```

Follow the instructions in [Implementing a hybrid network architecture with Azure ExpressRoute][implementing-expressroute] to establish your ExpressRoute connection.

Follow the instructions in [Implementing a hybrid network architecture with Azure and On-premises VPN][implementing-vpn] to establish your VPN virtual network gateway connection.

After you have established the virtual network gateway connections, test the environment as following:

1. Make sure you can connect from your on-premises network to your Azure VNet.

2. Contact your provider to stop ExpressRoute connectivity for testing.

3. Verify that the you can still connect from your on-premises network to your Azure VNet using the VPN virtual network gateway connection.

4. Contact your provider to reestabilish ExpressRoute connectivity.

## Considerations

For ExpressRoute considerations, see the [Implementing a Hybrid Network Architecture with Azure ExpressRoute][guidance-expressroute] guidance.

For Site-to-Site VPN considerations, see the [Implementing a Hybrid Network Architecture with Azure and On-premises VPN][guidance-vpn] guidance.

For general Azure security considerations, see [Microsoft cloud services and network security][best-practices-security].

## Solution Deployment

If you have an existing on-premises infrastructure already configured with a suitable network appliance, you can deploy the reference architecture by following these steps:

1. Right click the button below and select either "Open link in new tab" or "Open link in new window":  
[![Deploy to Azure](./media/blueprints/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmspnp%2Freference-architectures%2Fmaster%2Fguidance-hybrid-network-vpn-er%2Fazuredeploy.json)

2. Wait for the link to open in the Azure portal, then enter the follow settings for the template: 
  - The **Resource group** name is already defined in the parameter file, so select **Create New** and enter `ra-hybrid-vpn-er-rg` in the text box.
  - Select the region from the **Location** drop down box.
  - Do not edit the **Template Root Uri** or the **Parameter Root Uri** text boxes.
  - Review the terms and conditions, then click the **I agree to the terms and conditions stated above** checkbox.
  - Click on the **Purchase** button.

3. Wait for the deployment to complete.

4. Right click the button below and select either "Open link in new tab" or "Open link in new window":  
[![Deploy to Azure](./media/blueprints/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmspnp%2Freference-architectures%2Fmaster%2Fguidance-hybrid-network-vpn-er%2Fazuredeploy-expressRouteCircuit.json)

5. Wait for the link to open in the Azure portal, then enter the follow settings for the template: 
  - Select **Use existing** in the **Resource group** section and enter `ra-hybrid-vpn-er-rg` in the text box.
  - Select the region from the **Location** drop down box.
  - Do not edit the **Template Root Uri** or the **Parameter Root Uri** text boxes.
  - Review the terms and conditions, then click the **I agree to the terms and conditions stated above** checkbox.
  - Click on the **Purchase** button.

<!-- links -->

[resource-manager-overview]: ../azure-resource-manager/resource-group-overview.md
[vpn-appliance]: ../vpn-gateway/vpn-gateway-about-vpn-devices.md
[azure-vpn-gateway]: ../vpn-gateway/vpn-gateway-about-vpngateways.md
[connect-to-an-Azure-vnet]: https://technet.microsoft.com/library/dn786406.aspx
[azure-network-security-group]: ../virtual-network/virtual-networks-nsg.md
[getting-started-with-azure-security]: ./../security/azure-security-getting-started.md
[expressroute-prereq]: ../expressroute/expressroute-prerequisites.md
[implementing-expressroute]: ./guidance-hybrid-network-expressroute.md#implementing-this-architecture
[implementing-vpn]: ./guidance-hybrid-network-vpn.md#implementing-this-architecture
[guidance-expressroute]: ./guidance-hybrid-network-expressroute.md
[guidance-vpn]: ./guidance-hybrid-network-vpn.md
[best-practices-security]: ../best-practices-network-security.md
[solution-script]: https://github.com/mspnp/reference-architectures/tree/master/guidance-hybrid-network-vpn-er/Deploy-ReferenceArchitecture.ps1
[solution-script-bash]: https://github.com/mspnp/reference-architectures/tree/master/guidance-hybrid-network-vpn-er/deploy-reference-architecture.sh
[vnet-parameters]: https://github.com/mspnp/reference-architectures/tree/master/guidance-hybrid-network-vpn-er/parameters/virtualNetwork.parameters.json
[virtualnetworkgateway-vpn-parameters]: https://github.com/mspnp/reference-architectures/tree/master/guidance-hybrid-network-vpn-er/parameters/virtualNetworkGateway-vpn.parameters.json
[virtualnetworkgateway-expressroute-parameters]: https://github.com/mspnp/reference-architectures/tree/master/guidance-hybrid-network-vpn-er/parameters/virtualNetworkGateway-expressRoute.parameters.json
[er-circuit-parameters]: https://github.com/mspnp/reference-architectures/tree/master/guidance-hybrid-network-vpn-er/parameters/expressRouteCircuit.parameters.json
[azure-powershell-download]: https://azure.microsoft.com/documentation/articles/powershell-install-configure/
[naming conventions]: ./guidance-naming-conventions.md
[azure-cli]: https://azure.microsoft.com/documentation/articles/xplat-cli-install/
[visio-download]: http://download.microsoft.com/download/1/5/6/1569703C-0A82-4A9C-8334-F13D0DF2F472/RAs.vsdx
[0]: ./media/blueprints/hybrid-network-expressroute-vpn-failover.png "Architecture of a highly available hybrid network architecture using ExpressRoute and VPN gateway"
[ARM-Templates]: https://azure.microsoft.com/documentation/articles/resource-group-authoring-templates/
