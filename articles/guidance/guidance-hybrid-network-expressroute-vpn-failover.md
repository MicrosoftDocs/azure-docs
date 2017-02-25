---
title: Implementing a highly available hybrid network architecture | Microsoft Docs
description: How to implement a secure site-to-site network architecture that spans an Azure virtual network and an on-premises network connected using ExpressRoute with VPN gateway failover.
services: guidance,virtual-network,vpn-gateway,expressroute
documentationcenter: na
author: telmosampaio
manager: christb
editor: ''
tags: azure-resource-manager

ms.assetid: c0a6f115-ec55-4f98-8cca-606d5a98a3cd
ms.service: guidance
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/28/2016
ms.author: telmos

---
# Implementing a highly available hybrid network architecture
[!INCLUDE [pnp-header](../../includes/guidance-pnp-header-include.md)]

This article describes how to connect an on-premises network to an Azure virtual network (VNet) using ExpressRoute, with a site-to-site virtual private network (VPN) as a failover connection. 

Traffic flows between the on-premises network and the Azure VNet through an ExpressRoute connection. ExpressRoute connections are made using a private dedicated connection through a third-party connectivity provider. If there is a loss of connectivity in the ExpressRoute circuit, traffic will be routed through an IPSec VPN tunnel.

Note that if the ExpressRoute circuit is unavailable, the VPN route will only handle private peering connections. Public peering and Microsoft peering connections will pass over the Internet.


> [!NOTE]
> Azure has two different deployment models: [Resource Manager](../azure-resource-manager/resource-group-overview.md) and classic. This blueprint uses Resource Manager, which Microsoft recommends for new deployments.
> 
> 

Typical use cases for this architecture include:

* Hybrid applications where workloads are distributed between an on-premises network and Azure.
* Applications running large-scale, mission-critical workloads that require a high degree of scalability.
* Large-scale backup and restore facilities for data that must be saved off-site.
* Handling big data workloads.
* Using Azure as a disaster-recovery site.


## Architecture diagram

The following diagram highlights the important components in this architecture:

> A Visio document that includes this architecture diagram is available for download from the [Microsoft download center][visio-download]. This diagram is on the "Hybrid network - ER-VPN" page.
> 
> 

![[0]][0]

* **On-premises network**. A private local-area network running within an organization.

* **VPN appliance**. A device or service that provides external connectivity to the on-premises network. The VPN appliance may be a hardware device, or it can be a software solution such as the Routing and Remote Access Service (RRAS) in Windows Server 2012.

    > [!NOTE]
    > For a list of supported VPN appliances and information on configuring selected VPN appliances for connecting to Azure, see [About VPN devices for Site-to-Site VPN Gateway connections][vpn-appliance].
    > 
    > 

* **ExpressRoute circuit**. A layer 2 or layer 3 circuit supplied by the connectivity provider that joins the on-premises network with Azure through the edge routers. The circuit uses the hardware infrastructure managed by the connectivity provider.

* **ExpressRoute virtual network gateway**. The ExpressRoute virtual network gateway enables the VNet to connect to the ExpressRoute circuit used for connectivity with your on-premises network.

* **VPN virtual network gateway**. The VPN virtual network gateway enables the VNet to connect to the VPN appliance in the on-premises network. The VPN virtual network gateway is configured to accept requests from the on-premises network only through the VPN appliance. For more information, see [Connect an on-premises network to a Microsoft Azure virtual network][connect-to-an-Azure-vnet].

* **VPN connection**. The connection has properties that specify the connection type (IPSec) and the key shared with the on-premises VPN appliance to encrypt traffic.

* **Azure Virtual Network (VNet)**. Each VNet resides in a single Azure region, and can host multiple application tiers. Application tiers can be segmented using subnets in each VNet.

* **Gateway subnet**. The virtual network gateways are held in the same subnet.

* **Cloud application**. The application hosted in Azure. It might include multiple tiers, with multiple subnets connected through Azure load balancers. The traffic in each subnet may be subject to rules defined using [network security groups][azure-network-security-group](NSGs). For more information, see [Getting started with Microsoft Azure security][getting-started-with-azure-security].


## Recommendations

The following recommendations apply for most scenarios. Follow these recommendations unless you have a specific requirement that overrides them.

### VNet and GatewaySubnet

Create the ExpressRoute virtual network gateway and the VPN virtual network gateway in the same VNet. This means that they should share the same subnet named *GatewaySubnet*.

If the VNet already includes a subnet named *GatewaySubnet*, ensure that it has a /27 or larger address space. If the existing subnet is too small, use the following PowerShell command to remove the subnet: 

```powershell
$vnet = Get-AzureRmVirtualNetworkGateway -Name <yourvnetname> -ResourceGroupName <yourresourcegroup>
Remove-AzureRmVirtualNetworkSubnetConfig -Name GatewaySubnet -VirtualNetwork $vnet
```

If the VNet does not contain a subnet named **GatewaySubnet**, create a new one using the following Powershell command:

```powershell
$vnet = Get-AzureRmVirtualNetworkGateway -Name <yourvnetname> -ResourceGroupName <yourresourcegroup>
Add-AzureRmVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet -AddressPrefix "10.200.255.224/27"
$vnet = Set-AzureRmVirtualNetwork -VirtualNetwork $vnet
```

### VPN and ExpressRoute gateways

Verify that your organization meets the [ExpressRoute prerequisite requirements][expressroute-prereq] for connecting to Azure.

If you already have a VPN virtual network gateway in your Azure VNet, use the following  Powershell command to remove it:

```powershell
Remove-AzureRmVirtualNetworkGateway -Name <yourgatewayname> -ResourceGroupName <yourresourcegroup>
```

Follow the instructions in [Implementing a hybrid network architecture with Azure ExpressRoute][implementing-expressroute] to establish your ExpressRoute connection.

Follow the instructions in [Implementing a hybrid network architecture with Azure and On-premises VPN][implementing-vpn] to establish your VPN virtual network gateway connection.

After you have established the virtual network gateway connections, test the environment as follows:

1. Make sure you can connect from your on-premises network to your Azure VNet.
2. Contact your provider to stop ExpressRoute connectivity for testing.
3. Verify that you can still connect from your on-premises network to your Azure VNet using the VPN virtual network gateway connection.
4. Contact your provider to reestablish ExpressRoute connectivity.

## Considerations

For ExpressRoute considerations, see the [Implementing a Hybrid Network Architecture with Azure ExpressRoute][guidance-expressroute] guidance.

For site-to-site VPN considerations, see the [Implementing a Hybrid Network Architecture with Azure and On-premises VPN][guidance-vpn] guidance.

For general Azure security considerations, see [Microsoft cloud services and network security][best-practices-security].

## Solution Deployment

If you have an existing on-premises infrastructure already configured with a suitable network appliance, you can deploy the reference architecture by following these steps:

1. Open [this link](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmspnp%2Freference-architectures%2Fmaster%2Fguidance-hybrid-network-vpn-er%2Fazuredeploy.json) in a new tab or browser window. The link takes you to the Azure Portal.
2. Wait for the link to open in the Azure portal, then follow these steps:
   
   * The **Resource group** name is already defined in the parameter file, so select **Create New** and enter `ra-hybrid-vpn-er-rg` in the text box.
   * Select the region from the **Location** drop down box.
   * Do not edit the **Template Root Uri** or the **Parameter Root Uri** text boxes.
   * Review the terms and conditions, then click the **I agree to the terms and conditions stated above** checkbox.
   * Click the **Purchase** button.
3. Wait for the deployment to complete.
4. Open [this link](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmspnp%2Freference-architectures%2Fmaster%2Fguidance-hybrid-network-vpn-er%2Fazuredeploy-expressRouteCircuit.json) in a new tab or browser window. 
5. Wait for the link to open in the Azure portal, then enter then follow these steps:
   
   * Select **Use existing** in the **Resource group** section and enter `ra-hybrid-vpn-er-rg` in the text box.
   * Select the region from the **Location** drop down box.
   * Do not edit the **Template Root Uri** or the **Parameter Root Uri** text boxes.
   * Review the terms and conditions, then click the **I agree to the terms and conditions stated above** checkbox.
   * Click the **Purchase** button.

<!-- links -->

[resource-manager-overview]: ../azure-resource-manager/resource-group-overview.md
[vpn-appliance]: ../vpn-gateway/vpn-gateway-about-vpn-devices.md
[azure-vpn-gateway]: ../vpn-gateway/vpn-gateway-about-vpngateways.md
[connect-to-an-Azure-vnet]: https://technet.microsoft.com/library/dn786406.aspx
[azure-network-security-group]: ../virtual-network/virtual-networks-nsg.md
[getting-started-with-azure-security]: ./../security/azure-security-getting-started.md
[expressroute-prereq]: ../expressroute/expressroute-prerequisites.md
[implementing-expressroute]: ./guidance-hybrid-network-expressroute.md
[implementing-vpn]: ./guidance-hybrid-network-vpn.md
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