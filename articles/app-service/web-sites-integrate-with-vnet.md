---
title: Integrate app with Azure Virtual Network
description: Integrate app in Azure App Service with Azure virtual networks.
author: ccompy
ms.assetid: 90bc6ec6-133d-4d87-a867-fcf77da75f5a
ms.topic: article
ms.date: 06/08/2020
ms.author: ccompy
ms.custom: seodec18

---
# Integrate your app with an Azure virtual network

This article describes the Azure App Service VNet Integration feature and how to set it up with apps in [Azure App Service](https://go.microsoft.com/fwlink/?LinkId=529714). With [Azure Virtual Network][VNETOverview] (VNets), you can place many of your Azure resources in a non-internet-routable network. The VNet Integration feature enables your apps to access resources in or through a VNet. VNet Integration doesn't enable your apps to be accessed privately.

Azure App Service has two variations on the VNet Integration feature:

[!INCLUDE [app-service-web-vnet-types](../../includes/app-service-web-vnet-types.md)]

## Enable VNet Integration

1. Go to the **Networking** UI in the App Service portal. Under **VNet Integration**, select **Click here to configure**.

1. Select **Add VNet**.

   ![Select VNet Integration][1]

1. The drop-down list contains all of the Azure Resource Manager virtual networks in your subscription in the same region. Underneath that is a list of the Resource Manager virtual networks in all other regions. Select the VNet you want to integrate with.

   ![Select the VNet][2]

   * If the VNet is in the same region, either create a new subnet or select an empty preexisting subnet.
   * To select a VNet in another region, you must have a VNet gateway provisioned with point to site enabled.
   * To integrate with a classic VNet, instead of selecting the **Virtual Network** drop-down list, select **Click here to connect to a Classic VNet**. Select the classic virtual network you want. The target VNet must already have a Virtual Network gateway provisioned with point-to-site enabled.

    ![Select Classic VNet][3]

During the integration, your app is restarted. When integration is finished, you'll see details on the VNet you're integrated with.

## Regional VNet Integration

[!INCLUDE [app-service-web-vnet-types](../../includes/app-service-web-vnet-regional.md)]

### How regional VNet Integration works

Apps in App Service are hosted on worker roles. The Basic and higher pricing plans are dedicated hosting plans where there are no other customers' workloads running on the same workers. Regional VNet Integration works by mounting virtual interfaces with addresses in the delegated subnet. Because the from address is in your VNet, it can access most things in or through your VNet like a VM in your VNet would. The networking implementation is different than running a VM in your VNet. That's why some networking features aren't yet available for this feature.

![How regional VNet Integration works][5]

When regional VNet Integration is enabled, your app makes outbound calls to the internet through the same channels as normal. The outbound addresses that are listed in the app properties portal are the addresses still used by your app. What changes for your app are the calls to service endpoint secured services, or RFC 1918 addresses go into your VNet. If WEBSITE_VNET_ROUTE_ALL is set to 1, all outbound traffic can be sent into your VNet.

The feature supports only one virtual interface per worker. One virtual interface per worker means one regional VNet Integration per App Service plan. All of the apps in the same App Service plan can use the same VNet Integration. If you need an app to connect to an additional VNet, you need to create another App Service plan. The virtual interface used isn't a resource that customers have direct access to.

Because of the nature of how this technology operates, the traffic that's used with VNet Integration doesn't show up in Azure Network Watcher or NSG flow logs.

## Gateway-required VNet Integration

Gateway-required VNet Integration supports connecting to a VNet in another region or to a classic virtual network. Gateway-required VNet Integration:

* Enables an app to connect to only one VNet at a time.
* Enables up to five VNets to be integrated within an App Service plan.
* Allows the same VNet to be used by multiple apps in an App Service plan without affecting the total number that can be used by an App Service plan. If you have six apps using the same VNet in the same App Service plan, that counts as one VNet being used.
* Supports a 99.9% SLA due to the SLA on the gateway.
* Enables your apps to use the DNS that the VNet is configured with.
* Requires a Virtual Network route-based gateway configured with an SSTP point-to-site VPN before it can be connected to an app.

You can't use gateway-required VNet Integration:

* With a VNet connected with Azure ExpressRoute.
* From a Linux app
* To access service endpoint secured resources.
* With a coexistence gateway that supports both ExpressRoute and point-to-site or site-to-site VPNs.

### Set up a gateway in your Azure virtual network ###

To create a gateway:

1. [Create a gateway subnet][creategatewaysubnet] in your VNet.  

1. [Create the VPN gateway][creategateway]. Select a route-based VPN type.

1. [Set the point-to-site addresses][setp2saddresses]. If the gateway isn't in the basic SKU, then IKEV2 must be disabled in the point-to-site configuration and SSTP must be selected. The point-to-site address space must be in the RFC 1918 address blocks 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.

If you create the gateway for use with App Service VNet Integration, you don't need to upload a certificate. Creating the gateway can take 30 minutes. You won't be able to integrate your app with your VNet until the gateway is provisioned.

### How gateway-required VNet Integration works

Gateway-required VNet Integration is built on top of point-to-site VPN technology. Point-to-site VPNs limit network access to the virtual machine that hosts the app. Apps are restricted to send traffic out to the internet only through Hybrid Connections or through VNet Integration. When your app is configured with the portal to use gateway-required VNet Integration, a complex negotiation is managed on your behalf to create and assign certificates on the gateway and the application side. The result is that the workers used to host your apps are able to directly connect to the virtual network gateway in the selected VNet.

![How gateway-required VNet Integration works][6]

### Access on-premises resources

Apps can access on-premises resources by integrating with VNets that have site-to-site connections. If you use gateway-required VNet Integration, update your on-premises VPN gateway routes with your point-to-site address blocks. When the site-to-site VPN is first set up, the scripts used to configure it should set up routes properly. If you add the point-to-site addresses after you create your site-to-site VPN, you need to update the routes manually. Details on how to do that vary per gateway and aren't described here. You can't have BGP configured with a site-to-site VPN connection.

No additional configuration is required for the regional VNet Integration feature to reach through your VNet to on-premises resources. You simply need to connect your VNet to on-premises resources by using ExpressRoute or a site-to-site VPN.

> [!NOTE]
> The gateway-required VNet Integration feature doesn't integrate an app with a VNet that has an ExpressRoute gateway. Even if the ExpressRoute gateway is configured in [coexistence mode][VPNERCoex], the VNet Integration doesn't work. If you need to access resources through an ExpressRoute connection, use the regional VNet Integration feature or an [App Service Environment][ASE], which runs in your VNet.
> 
> 

### Peering

If you use peering with the regional VNet Integration, you don't need to do any additional configuration.

If you use gateway-required VNet Integration with peering, you need to configure a few additional items. To configure peering to work with your app:

1. Add a peering connection on the VNet your app connects to. When you add the peering connection, enable **Allow virtual network access** and select **Allow forwarded traffic** and **Allow gateway transit**.
1. Add a peering connection on the VNet that's being peered to the VNet you're connected to. When you add the peering connection on the destination VNet, enable **Allow virtual network access** and select **Allow forwarded traffic** and **Allow remote gateways**.
1. Go to the **App Service plan** > **Networking** > **VNet Integration** UI in the portal. Select the VNet your app connects to. Under the routing section, add the address range of the VNet that's peered with the VNet your app is connected to.

## Manage VNet Integration

Connecting and disconnecting with a VNet is at an app level. Operations that can affect VNet Integration across multiple apps are at the App Service plan level. From the app > **Networking** > **VNet Integration** portal, you can get details on your VNet. You can see similar information at the App Service plan level in the **App Service plan** > **Networking** > **VNet Integration** portal.

The only operation you can take in the app view of your VNet Integration instance is to disconnect your app from the VNet it's currently connected to. To disconnect your app from a VNet, select **Disconnect**. Your app is restarted when you disconnect from a VNet. Disconnecting doesn't change your VNet. The subnet or gateway isn't removed. If you then want to delete your VNet, first disconnect your app from the VNet and delete the resources in it, such as gateways.

The App Service plan VNet Integration UI shows you all of the VNet integrations used by the apps in your App Service plan. To see details on each VNet, select the VNet you're interested in. There are two actions you can perform here for gateway-required VNet Integration:

* **Sync network**: The sync network operation is used only for the gateway-dependent VNet Integration feature. Performing a sync network operation ensures that your certificates and network information are in sync. If you add or change the DNS of your VNet, perform a sync network operation. This operation restarts any apps that use this VNet. This operation will not work if you are using an app and a vnet belonging to different subscriptions.
* **Add routes**: Adding routes drives outbound traffic into your VNet.

### Gateway-required VNet Integration routing
The routes that are defined in your VNet are used to direct traffic into your VNet from your app. To send additional outbound traffic into the VNet, add those address blocks here. This capability only works with gateway-required VNet Integration. Route tables don't affect your app traffic when you use gateway-required VNet Integration the way that they do with regional VNet Integration.

### Gateway-required VNet Integration certificates
When gateway-required VNet Integration is enabled, there's a required exchange of certificates to ensure the security of the connection. Along with the certificates are the DNS configuration, routes, and other similar things that describe the network.

If certificates or network information is changed, select **Sync Network**. When you select **Sync Network**, you cause a brief outage in connectivity between your app and your VNet. While your app isn't restarted, the loss of connectivity could cause your site to not function properly.

## Pricing details
The regional VNet Integration feature has no additional charge for use beyond the App Service plan pricing tier charges.

Three charges are related to the use of the gateway-required VNet Integration feature:

* **App Service plan pricing tier charges**: Your apps need to be in a Standard, Premium, or PremiumV2 App Service plan. For more information on those costs, see [App Service pricing][ASPricing].
* **Data transfer costs**: There's a charge for data egress, even if the VNet is in the same datacenter. Those charges are described in [Data Transfer pricing details][DataPricing].
* **VPN gateway costs**: There's a cost to the virtual network gateway that's required for the point-to-site VPN. For more information, see [VPN gateway pricing][VNETPricing].

## Troubleshooting

[!INCLUDE [app-service-web-vnet-troubleshooting](../../includes/app-service-web-vnet-troubleshooting.md)]

## Automation

CLI support is available for regional VNet Integration. To access the following commands, [install the Azure CLI][installCLI].

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

For gateway-required VNet Integration, you can integrate App Service with an Azure virtual network by using PowerShell. For a ready-to-run script, see [Connect an app in Azure App Service to an Azure virtual network](https://gallery.technet.microsoft.com/scriptcenter/Connect-an-app-in-Azure-ab7527e3).


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
[privateendpoints]: networking/private-endpoint.md
