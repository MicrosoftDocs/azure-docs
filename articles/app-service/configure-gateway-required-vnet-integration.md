---
title: Configure gateway-required virtual network integration for your app
description: Integrate your app in Azure App Service with Azure virtual networks using gateway-required virtual network integration.
author: madsd
ms.topic: how-to
ms.date: 01/01/2023
ms.author: madsd

---
# Configure gateway-required virtual network integration

Gateway-required virtual network integration supports connecting to a virtual network in another region or to a classic virtual network. Gateway-required virtual network integration only works for Windows plans.

>[!NOTE]
> Gateway-required virtual network integration has moved to maintenance mode and will be removed 31. march 2024

Gateway-required virtual network integration:

* Enables an app to connect to only one virtual network at a time.
* Enables up to five virtual networks to be integrated within an App Service plan.
* Allows the same virtual network to be used by multiple apps in an App Service plan without affecting the total number that can be used by an App Service plan. If you have six apps using the same virtual network in the same App Service plan that counts as one virtual network being used.
* SLA on the gateway can affect the overall [SLA](https://azure.microsoft.com/support/legal/sla/).
* Enables your apps to use the DNS that the virtual network is configured with.
* Requires a virtual network route-based gateway configured with an SSTP point-to-site VPN before it can be connected to an app.

You can't use gateway-required virtual network integration:

* With a virtual network connected with ExpressRoute.
* From a Linux app.
* From a [Windows container](./quickstart-custom-container.md).
* To access service endpoint-secured resources.
* To resolve App Settings referencing a network protected Key Vault.
* With a coexistence gateway that supports both ExpressRoute and point-to-site or site-to-site VPNs.

## Set up a gateway in your Azure virtual network

To create a gateway:

1. [Create the VPN gateway and subnet](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md#creategw). Select a route-based VPN type.

1. [Set the point-to-site addresses](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md#addresspool). If the gateway isn't in the basic SKU, then IKEV2 must be disabled in the point-to-site configuration and SSTP must be selected. The point-to-site address space must be in the RFC 1918 address blocks 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.

If you create the gateway for use with gateway-required virtual network integration, you don't need to upload a certificate. Creating the gateway can take 30 minutes. You won't be able to integrate your app with your virtual network until the gateway is created.

## How gateway-required virtual network integration works

Gateway-required virtual network integration is built on top of point-to-site VPN technology. Point-to-site VPNs limit network access to the virtual machine that hosts the app. Apps are restricted to send traffic out to the internet only through hybrid connections or through virtual network integration. When your app is configured with the portal to use gateway-required virtual network integration, a complex negotiation is managed on your behalf to create and assign certificates on the gateway and the application side. The result is that the workers used to host your apps can directly connect to the virtual network gateway in the selected virtual network.

:::image type="content" source="./media/overview-vnet-integration/vnetint-how-gateway-works.png" alt-text="Diagram that shows how gateway-required virtual network integration works.":::

## Access on-premises resources

Apps can access on-premises resources by integrating with virtual networks that have site-to-site connections. If you use gateway-required virtual network integration, update your on-premises VPN gateway routes with your point-to-site address blocks. When the site-to-site VPN is first set up, the scripts used to configure it should set up routes properly. If you add the point-to-site addresses after you create your site-to-site VPN, you need to update the routes manually. Details on how to do that vary per gateway and aren't described here.

BGP routes from on-premises won't be propagated automatically into App Service. You need to manually propagate them on the point-to-site configuration using the steps in this document [Advertise custom routes for P2S VPN clients](../vpn-gateway/vpn-gateway-p2s-advertise-custom-routes.md).

> [!NOTE]
> The gateway-required virtual network integration feature doesn't integrate an app with a virtual network that has an ExpressRoute gateway. Even if the ExpressRoute gateway is configured in [coexistence mode](../expressroute/expressroute-howto-coexist-resource-manager.md), the virtual network integration doesn't work. If you need to access resources through an ExpressRoute connection, use the regional virtual network integration feature or an [App Service Environment](./environment/intro.md), which runs in your virtual network.

## Peering

If you use gateway-required virtual network integration with peering, you need to configure a few more items. To configure peering to work with your app:

1. Add a peering connection on the virtual network your app connects to. When you add the peering connection, enable **Allow virtual network access** and select **Allow forwarded traffic** and **Allow gateway transit**.
1. Add a peering connection on the virtual network that's being peered to the virtual network you're connected to. When you add the peering connection on the destination virtual network, enable **Allow virtual network access** and select **Allow forwarded traffic** and **Allow remote gateways**.
1. Go to **App Service plan** > **Networking** > **VNet integration** in the portal. Select the virtual network your app connects to. Under the routing section, add the address range of the virtual network that's peered with the virtual network your app is connected to.

## Manage virtual network integration

Connecting and disconnecting with a virtual network is at an app level. Operations that can affect virtual network integration across multiple apps are at the App Service plan level. From the app > **Networking** > **VNet integration** portal, you can get details on your virtual network. You can see similar information at the App Service plan level in the **App Service plan** > **Networking** > **VNet integration** portal.

The only operation you can take in the app view of your virtual network integration instance is to disconnect your app from the virtual network it's currently connected to. To disconnect your app from a virtual network, select **Disconnect**. Your app is restarted when you disconnect from a virtual network. Disconnecting doesn't change your virtual network. The subnet or gateway isn't removed. If you then want to delete your virtual network, first disconnect your app from the virtual network and delete the resources in it, such as gateways.

The App Service plan virtual network integration UI shows you all the virtual network integrations used by the apps in your App Service plan. To see details on each virtual network, select the virtual network you're interested in. There are two actions you can perform here for gateway-required virtual network integration:

* **Sync network**: The sync network operation is used only for the gateway-required virtual network integration feature. Performing a sync network operation ensures that your certificates and network information are in sync. If you add or change the DNS of your virtual network, perform a sync network operation. This operation restarts any apps that use this virtual network. This operation won't work if you're using an app and a virtual network belonging to different subscriptions.
* **Add routes**: Adding routes drives outbound traffic into your virtual network.

The private IP assigned to the instance is exposed via the environment variable WEBSITE_PRIVATE_IP. Kudu console UI also shows the list of environment variables available to the web app. This IP is assigned from the address range of the integrated subnet. For regional virtual network integration, the value of WEBSITE_PRIVATE_IP is an IP from the address range of the delegated subnet. For gateway-required virtual network integration, the value is an IP from the address range of the point-to-site address pool configured on the virtual network gateway. This IP will be used by the web app to connect to the resources through the Azure virtual network.

> [!NOTE]
> The value of WEBSITE_PRIVATE_IP is bound to change. However, it will be an IP within the address range of the integration subnet or the point-to-site address range, so you'll need to allow access from the entire address range.
>

## Gateway-required virtual network integration routing

The routes that are defined in your virtual network are used to direct traffic into your virtual network from your app. To send more outbound traffic into the virtual network, add those address blocks here. This capability only works with gateway-required virtual network integration. Route tables don't affect your app traffic when you use gateway-required virtual network integration the way that they do with regional virtual network integration.

## Gateway-required virtual network integration certificates

When gateway-required virtual network integration is enabled, there's a required exchange of certificates to ensure the security of the connection. Along with the certificates are the DNS configuration, routes, and other similar things that describe the network.

If certificates or network information is changed, select **Sync Network**. When you select **Sync Network**, you cause a brief outage in connectivity between your app and your virtual network. Your app isn't restarted, but the loss of connectivity could cause your site to not function properly.

# Pricing details

Three charges are related to the use of the gateway-required virtual network integration feature:

* **App Service plan pricing tier charges**: Your apps need to be in a Basic, Standard, Premium, Premium v2, or Premium v3 App Service plan. For more information on those costs, see [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/).
* **Data transfer costs**: There's a charge for data egress, even if the virtual network is in the same datacenter. Those charges are described in [Data transfer pricing details](https://azure.microsoft.com/pricing/details/data-transfers/).
* **VPN gateway costs**: There's a cost to the virtual network gateway that's required for the point-to-site VPN. For more information, see [VPN gateway pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/).

## Troubleshooting