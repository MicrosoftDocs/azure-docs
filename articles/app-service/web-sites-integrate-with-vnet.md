---
title: Integrate app with Azure Virtual Network
description: Integrate apps in Azure App Service with Azure Virtual Networks.
author: ccompy
ms.assetid: 90bc6ec6-133d-4d87-a867-fcf77da75f5a
ms.topic: article
ms.date: 02/27/2020
ms.author: ccompy
ms.custom: seodec18

---
# Integrate your app with an Azure Virtual Network
This document describes the Azure App Service virtual network integration feature and how to set it up with apps in the [Azure App Service](https://go.microsoft.com/fwlink/?LinkId=529714). [Azure Virtual Networks][VNETOverview] (VNets) allow you to place many of your Azure resources in a non-internet routable network.  

The Azure App Service has two variations.

[!INCLUDE [app-service-web-vnet-types](../../includes/app-service-web-vnet-types.md)]

## Enable VNet Integration 

1. Go to the Networking UI in the App Service portal. Under VNet Integration, select *"Click here to configure"*. 

1. Select **Add VNet**.  

   ![Select VNet Integration][1]

1. The drop-down list will contain all of the Resource Manager VNets in your subscription in the same region and below that is a list of all of the Resource Manager VNets in all other regions. Select the VNet you wish to integrate with.

   ![Select the VNet][2]

   * If the VNet is in the same region, then either create a new subnet or pick an empty pre-existing subnet. 

   * To select a VNet in another region, you must have a Virtual Network gateway provisioned with point to site enabled.

   * To integrate with a Classic VNet, instead of clicking the VNet drop down, select **Click here to connect to a Classic VNet**. Select the desired Classic VNet. The target VNet must already have a Virtual Network gateway provisioned with point to site enabled.

    ![Select Classic VNet][3]
    
During the integration, your app is restarted.  When integration is completed, you will see details on the VNet you are integrated with. 

Once your app is integrated with your VNet, it will use the same DNS server that your VNet is configured with, unless it is Azure DNS Private Zones. You currently cannot use VNet Integration with Azure DNS Private Zones.

## Regional VNet Integration

[!INCLUDE [app-service-web-vnet-types](../../includes/app-service-web-vnet-regional.md)]

### How Regional VNet Integration works

Apps in the App Service are hosted on worker roles. The Basic and higher pricing plans are dedicated hosting plans where there are no other customers workloads running on the same workers. Regional VNet Integration works by mounting virtual interfaces with addresses in the delegated subnet. Because the from address is in your VNet, it can access to most things in or through your VNet just like a VM in your VNet would. The networking implementation is different than running a VM in your VNet and that is why some networking features are not yet available while using this feature.

![How regional VNet Integration works][5]

When regional VNet Integration is enabled, your app will still make outbound calls to the internet through the same channels as normal. The outbound addresses that are listed in the app properties portal are still the addresses used by your app. What changes for your app are, calls to service endpoint secured services or RFC 1918 addresses goes into your VNet. If WEBSITE_VNET_ROUTE_ALL is set to 1, then all outbound traffic can be sent into your VNet. 

The feature only supports one virtual interface per worker.  One virtual interface per worker means one regional VNet Integration per App Service plan. All of the apps in the same App Service plan can use the same VNet Integration but if you need an app to connect to an additional VNet, you will need to create another App Service plan. The virtual interface used is not a resource that customers have direct access to.

Due to the nature of how this technology operates, the traffic that is used with VNet Integration does not show up in Network Watcher or NSG flow logs.  

## Gateway required VNet Integration

Gateway required VNet Integration supports connecting to a VNet in another region, or to a Classic VNet. Gateway required VNet Integration: 

* Enables an app to connect to only 1 VNet at a time
* Enables up to five VNets to be integrated within an App Service Plan 
* Allows the same VNet to be used by multiple apps in an App Service Plan without impacting the total number that can be used by an App Service plan.  If you have six apps using the same VNet in the same App Service plan, that counts as 1 VNet being used. 
* Supports a 99.9% SLA due to the SLA on the gateway
* Enables your apps to use the DNS that the VNet is configured with
* Requires a Virtual Network route-based gateway configured with SSTP point-to-site VPN before it can be connected to app. 

You can't use gateway required VNet Integration:

* With Linux apps
* With a VNet connected with ExpressRoute 
* To access Service Endpoints secured resources
* With a coexistence gateway that supports both ExpressRoute and point to site/site to site VPNs

### Set up a gateway in your VNet ###

To create a gateway:

1. [Create a gateway subnet][creategatewaysubnet] in your VNet.  

1. [Create the VPN gateway][creategateway]. Select a route-based VPN type.

1. [Set the point to site addresses][setp2saddresses]. If the gateway isn't in the basic SKU, then IKEV2 must be disabled in the point to site configuration and SSTP must be selected. The point to site address space must be in the RFC 1918 address blocks, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16

If you are just creating the gateway for use with App Service VNet Integration, then you do not need to upload a certificate. Creating the gateway can take 30 minutes. You will not be able to integrate your app with your VNet until the gateway is provisioned. 

### How gateway required VNet Integration works

Gateway required VNet Integration built on top of point to site VPN technology. Point to site VPNs limits network access to just the virtual machine hosting the app. Apps are restricted to only send traffic out to the internet, through Hybrid Connections or through VNet Integration. When your app is configured with the portal to use gateway required VNet Integration, a complex negotiation is managed on your behalf to create and assign certificates on the gateway and the application side. The end result is that the workers used to host your apps are able to directly connect to the virtual network gateway in the selected VNet. 

![How gateway required VNet Integration works][6]

### Accessing on-premises resources

Apps can access on-premises resources by integrating with VNets that have site-to-site connections. If you are using the gateway required VNet Integration, you need to update your on-premises VPN gateway routes with your point-to-site address blocks. When the site-to-site VPN is first set up, the scripts used to configure it should set up routes properly. If you add the point-to-site addresses after you create your site-to-site VPN, you need to update the routes manually. Details on how to do that vary per gateway and are not described here. You cannot have BGP configured with a site-to-site VPN connection.

There is no additional configuration required for the regional VNet Integration feature to reach through your VNet, and to on-premises. You simply need to connect your VNet to on-premises using ExpressRoute or a site-to-site VPN. 

> [!NOTE]
> The gateway required VNet Integration feature doesn't integrate an app with a VNet that has an ExpressRoute Gateway. Even if the ExpressRoute Gateway is configured in [coexistence mode][VPNERCoex] the VNet Integration doesn't work. If you need to access resources through an ExpressRoute connection, then you can use the regional VNet Integration feature or an [App Service Environment][ASE], which runs in your VNet. 
> 
> 

### Peering

If you are using peering with the regional VNet Integration, you do not need to do any additional configuration. 

If you are using the gateway required VNet Integration with peering, you need to configure a few additional items. To configure peering to work with your app:

1. Add a peering connection on the VNet your app connects to. When adding the peering connection, enable **Allow virtual network access** and check **Allow forwarded traffic** and **Allow gateway transit**.
1. Add a peering connection on the VNet that is being peered to the VNet you are connected to. When adding the peering connection on the destination VNet, enable **Allow virtual network access** and check **Allow forwarded traffic** and **Allow remote gateways**.
1. Go to the App Service plan > Networking > VNet Integration UI in the portal.  Select the VNet your app connects to. Under the routing section, add the address range of the VNet that is peered with the VNet your app is connected to.  

## Managing VNet Integration 

Connecting and disconnecting with a VNet is at an app level. Operations that can affect the VNet Integration across multiple apps are at the App Service plan level. From the app > Networking > VNet Integration portal, you can get details on your VNet. You can see similar information at the ASP level in the ASP > Networking > VNet Integration portal.

The only operation you can take in the app view of your VNet Integration is to disconnect your app from the VNet it is currently connected to. To disconnect your app from a VNet, select **Disconnect**. Your app will be restarted when you disconnect from a VNet. Disconnecting doesn't change your VNet. The subnet or gateway is not removed. If you then want to delete your VNet, you need to first disconnect your app from the VNet and delete the resources in it such as gateways. 

The ASP VNet Integration UI will show you all of the VNet integrations used by the apps in your ASP. To see details on each VNet, click on the VNet you are interested in. There are two actions you can perform here for gateway required VNet Integration.

* **Sync network**. The sync network operation is only for the gateway-dependent VNet Integration feature. Performing a sync network operation ensures that your certificates and network information are in sync. If you add or change the DNS of your VNet, you need to perform a **Sync network** operation. This operation will restart any apps using this VNet.
* **Add routes** Adding routes will drive outbound traffic into your VNet. 

**Gateway required VNet Integration Routing** 
The routes that are defined in your VNet are used to direct traffic into your VNet from your app. If you need to send additional outbound traffic into the VNet, then you can add those address blocks here. This capability only works with gateway required VNet Integration. Route tables do not affect your app traffic when using gateway required VNet Integration the way that they do with regional VNet Integration.

**Gateway required VNet Integration Certificates**
When the gateway required VNet Integration enabled, there is a required exchange of certificates to ensure the security of the connection. Along with the certificates are the DNS configuration, routes, and other similar things that describe the network.
If certificates or network information is changed, you need to click "Sync Network". When you click "Sync Network", you cause a brief outage in connectivity between your app and your VNet. While your app isn't restarted, the loss of connectivity could cause your site to not function properly. 

## Pricing details
The regional VNet Integration feature has no additional charge for use beyond the ASP pricing tier charges.

There are three related charges to the use of the gateway required VNet Integration feature:

* ASP pricing tier charges - Your apps need to be in a Standard, Premium, or PremiumV2 App Service Plan. You can see more details on those costs here: [App Service Pricing][ASPricing]. 
* Data transfer costs - There is a charge for data egress, even if the VNet is in the same data center. Those charges are described in [Data Transfer Pricing Details][DataPricing]. 
* VPN Gateway costs - There is a cost to the VNet gateway that is required for the point-to-site VPN. The details are on the [VPN Gateway Pricing][VNETPricing] page.

## Troubleshooting

[!INCLUDE [app-service-web-vnet-troubleshooting](../../includes/app-service-web-vnet-troubleshooting.md)]

## Automation

There is CLI support for regional VNet Integration. To access to the following commands, [Install Azure CLI][installCLI]. 

		az webapp vnet-integration --help

		Group
			az webapp vnet-integration : Methods that list, add, and remove virtual network integrations
			from a webapp.
				This command group is in preview. It may be changed/removed in a future release.
		Commands:
			add    : Add a regional virtual network integration to a webapp.
			list   : List the virtual network integrations on a webapp.
			remove : Remove a regional virtual network integration from webapp.

		az appservice vnet-integration --help

		Group
			az appservice vnet-integration : A method that lists the virtual network integrations used in an
			appservice plan.
				This command group is in preview. It may be changed/removed in a future release.
		Commands:
			list : List the virtual network integrations used in an appservice plan.

For gateway required VNet Integration, you can integrate App Service with an Azure Virtual Network using PowerShell. For a ready-to-run script, see [Connect an app in Azure App Service to an Azure Virtual Network](https://gallery.technet.microsoft.com/scriptcenter/Connect-an-app-in-Azure-ab7527e3).


<!--Image references-->
[1]: ./media/web-sites-integrate-with-vnet/vnetint-app.png
[2]: ./media/web-sites-integrate-with-vnet/vnetint-addvnet.png
[3]: ./media/web-sites-integrate-with-vnet/vnetint-classic.png
[5]: ./media/web-sites-integrate-with-vnet/vnetint-regionalworks.png
[6]: ./media/web-sites-integrate-with-vnet/vnetint-gwworks.png


<!--Links-->
[VNETOverview]: https://azure.microsoft.com/documentation/articles/virtual-networks-overview/ 
[AzurePortal]: https://portal.azure.com/
[ASPricing]: https://azure.microsoft.com/pricing/details/app-service/
[VNETPricing]: https://azure.microsoft.com/pricing/details/vpn-gateway/
[DataPricing]: https://azure.microsoft.com/pricing/details/data-transfers/
[V2VNETP2S]: https://azure.microsoft.com/documentation/articles/vpn-gateway-howto-point-to-site-rm-ps/
[ILBASE]: environment/create-ilb-ase.md
[V2VNETPortal]: ../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md
[VPNERCoex]: ../expressroute/expressroute-howto-coexist-resource-manager.md
[ASE]: environment/intro.md
[creategatewaysubnet]: ../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md#creategw
[creategateway]: https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal#creategw
[setp2saddresses]: https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal#addresspool
[VNETRouteTables]: https://docs.microsoft.com/azure/virtual-network/manage-route-table/
[installCLI]: https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest/
