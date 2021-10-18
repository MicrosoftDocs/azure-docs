---
title: Integrate app with Azure virtual network
description: Integrate app in Azure App Service with Azure virtual networks.
author: madsd
ms.topic: conceptual
ms.date: 10/20/2021
ms.author: madsd

---
# Integrate your app with an Azure virtual network

This article describes the Azure App Service VNet Integration feature and how to set it up with apps in [Azure App Service](./overview.md). With [Azure Virtual Network](../virtual-network/virtual-networks-overview.md) (VNets), you can place many of your Azure resources in a non-internet-routable network. The VNet Integration feature enables your apps to access resources in or through a VNet. VNet Integration doesn't enable your apps to be accessed privately.

Azure App Service has two variations:

[!INCLUDE [app-service-web-vnet-types](../../includes/app-service-web-vnet-types.md)]

Learn [how to enable VNet Integration](./configure-vnet-integration-enable.md).

## Regional VNet Integration

Regional VNet Integration supports connecting to a VNet in the same region and doesn't require a gateway. Using regional VNet Integration enables your app to access:

* Resources in the VNet you're integrated with.
* Resources in VNets peered to the VNet your app is integrated with including global peering connections.
* Resources across Azure ExpressRoute connections.
* Service endpoint secured services.
* Private endpoint enabled services.

When you use regional VNet Integration, you can use the following Azure networking features:

* **Network security groups (NSGs)**: You can block outbound traffic with an NSG that's placed on your integration subnet. The inbound rules don't apply because you can't use VNet Integration to provide inbound access to your app.
* **Route tables (UDRs)**: You can place a route table on the integration subnet to send outbound traffic where you want.

The feature is fully supported for both Windows and Linux apps, including [custom containers](./quickstart-custom-container.md). All of the behaviors act the same between Windows apps and Linux apps.

### How regional VNet Integration works

Apps in App Service are hosted on worker roles. Regional VNet Integration works by mounting virtual interfaces to the worker roles with addresses in the delegated subnet. Because the from address is in your VNet, it can access most things in or through your VNet like a VM in your VNet would. The networking implementation is different than running a VM in your VNet. That's why some networking features aren't yet available for this feature.

:::image type="content" source="./media/overview-vnet-integration/vnetint-how-regional-works.png" alt-text="How regional VNet Integration works":::

When regional VNet Integration is enabled, your app makes outbound calls through your VNet. The outbound addresses that are listed in the app properties portal are the addresses still used by your app. However, if your outbound call is to a virtual machine or private endpoint in the integration VNet or peered VNet, the outbound address will be an address from the integration subnet. The private IP assigned to an instance is exposed via the environment variable, ```WEBSITE_PRIVATE_IP```.

When all traffic routing is enabled, all outbound traffic is sent into your VNet. If all traffic routing is not enabled, only private traffic (RFC1918) and service endpoints configured on the integration subnet will be sent into the VNet and outbound traffic to the internet will go through the same channels as normal.

The feature supports only one virtual interface per worker. One virtual interface per worker means one regional VNet Integration per App Service plan. All of the apps in the same App Service plan can use the same VNet Integration. If you need an app to connect to an another VNet, you need to create another App Service plan. The virtual interface used isn't a resource that customers have direct access to.

Because of the nature of how this technology operates, the traffic that's used with VNet Integration doesn't show up in Azure Network Watcher or NSG flow logs.

### Subnet requirements

VNet Integration depends on a dedicated subnet. When you create a subnet, the Azure subnet loses five IPs from the start. One address is used from the integration subnet for each plan instance. If you scale your app to four instances, then four addresses are used.

When you scale up or down in size, the required address space is doubled for a short period of time. This affects the real, available supported instances for a given subnet size. The following table shows both the maximum available addresses per CIDR block and the effect this has on horizontal scale:

| CIDR block size | Max available addresses | Max horizontal scale (instances)<sup>*</sup> |
|-----------------|-------------------------|---------------------------------|
| /28             | 11                      | 5                               |
| /27             | 27                      | 13                              |
| /26             | 59                      | 29                              |

<sup>*</sup>Assumes that you'll need to scale up or down in either size or SKU at some point. 

Since subnet size can't be changed after assignment, use a subnet that's large enough to accommodate whatever scale your app might reach. To avoid any issues with subnet capacity, you should use a /26 with 64 addresses.

When you want your apps in your plan to reach a VNet that's already connected to by apps in another plan, select a different subnet than the one being used by the pre-existing VNet Integration.

### Routes

There are two types of routing to consider when configuring regional VNet Integration. Application routing defines what traffic is routed from your application and into the VNet. Network routing is the ability to control how traffic is routed from your VNet and out.

#### Application routing

When configuring application routing, you can either route all traffic or only private traffic (also known as [RFC1918](https://datatracker.ietf.org/doc/html/rfc1918#section-3) traffic) into your VNet. You configure this behavior through the Route All setting. If Route All is disabled, your app only routes private traffic into your VNet. If you want to route all of your outbound traffic into your VNet, make sure that Route All is enabled.

> [!NOTE]
> * When Route All is enabled, all traffic is subject to the NSGs and UDRs that are applied to your integration subnet. When all traffic routing is enabled, outbound traffic is still sent from the addresses that are listed in your app properties, unless you provide routes that direct the traffic elsewhere.
> * Windows Containers do not support Route All.
> * Windows Containers do not support routing App Service Key Vault references or pulling custom container images over VNet Integration.
> * Regional VNet Integration isn't able to use port 25.

Learn [how to configure application routing](./configure-vnet-integration-routing.md).

The Route All configuration setting is the recommended way of enabling routing of all traffic. Using the configuration setting will allow you to audit the behavior with [a built-in policy](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F33228571-70a4-4fa1-8ca1-26d0aba8d6ef). The existing `WEBSITE_VNET_ROUTE_ALL` App Setting can still be used and you can enable all traffic routing with either setting.

#### Network routing

You can use route tables to route outbound traffic from your app to wherever you want. Route tables affect your destination traffic. When Route All is disabled in [application routing](#application-routing), only private traffic (RFC1918) is affected by your route tables. Common destinations can include firewall devices or gateways. Routes that are set on your integration subnet won't affect replies to inbound app requests. 

When you want to route all outbound traffic on-premises, you can use a route table to send all outbound traffic to your ExpressRoute gateway. If you do route traffic to a gateway, be sure to set routes in the external network to send any replies back.

Border Gateway Protocol (BGP) routes also affect your app traffic. If you have BGP routes from something like an ExpressRoute gateway, your app outbound traffic is affected. Similar to user defined routes, BGP routes affect traffic according to your routing scope setting.

### Network security groups

An app that uses regional VNet Integration can use a [network security group](../virtual-network/security-overview/) to block outbound traffic to resources in your VNet or the Internet. To block traffic to public addresses, you must ensure you enable [Route All](#application-routing) to the VNet. When Route All is not enabled, NSGs are only applied to RFC1918 traffic.

An NSG that's applied to your integration subnet is in effect regardless of any route tables applied to your integration subnet. 

The inbound rules in an NSG do not apply to your app because VNet Integration affects only outbound traffic from your app. To control inbound traffic to your app, use the Access Restrictions feature.

### Service endpoints

Regional VNet Integration enables you to reach Azure services that are secured with service endpoints. To access a service endpoint-secured service, you must do the following steps:

* Configure regional VNet Integration with your web app to connect to a specific subnet for integration.
* Go to the destination service and configure service endpoints against the integration subnet.

### Private endpoints

If you want to make calls to [private endpoints](./networking/private-endpoint.md), then you must make sure that your DNS lookups resolve to the private endpoint. You can enforce this behavior in one of the following ways: 

* Integrate with Azure DNS private zones. When your VNet doesn't have a custom DNS server, the integration is done automatically when the zones are linked to the VNet.
* Manage the private endpoint in the DNS server used by your app. To manage the configuration, you must know the private endpoint IP address and then point the endpoint you are trying to reach to that address using an A record.
* Configure your own DNS server to forward to Azure DNS private zones.

### Azure DNS private zones 

After your app integrates with your VNet, it uses the same DNS server that your VNet is configured with, and if no custom DNS is specified it will use Azure default DNS and any private zones linked to the VNet.

> [!NOTE]
> For Linux Apps Azure DNS private zones only works if Route All is enabled.

### Limitations

There are some limitations with using regional VNet Integration:

* The feature is available from all App Service scale units in Premium V2 and Premium V3. It's also available in Standard but only from newer App Service scale units. If you are on an older scale unit, you can only use the feature from a Premium V2 App Service plan. If you want to make sure you can use the feature in a Standard App Service plan, create your app in a Premium V3 App Service plan. Those plans are only supported on our newest scale units. You can scale down if you desire after the plan is created.
* The feature can't be used by Isolated plan apps that are in an App Service Environment.
* You can't reach resources across peering connections with Classic Virtual Networks.
* The feature requires an unused subnet that's a /28 or larger in an Azure Resource Manager VNet.
* The app and the VNet must be in the same region.
* The integration VNet cannot have IPv6 address spaces defined.
* The integration subnet can be used by only one App Service plan.
* You can't delete a VNet with an integrated app. Remove the integration before you delete the VNet.
* You can have only one regional VNet Integration per App Service plan. Multiple apps in the same App Service plan can use the same VNet.
* You can't change the subscription of an app or a plan while there's an app that's using regional VNet Integration.
* Your app can't resolve addresses in Azure DNS Private Zones on Linux plans without Route All enabled.

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
* From a Linux app.
* From a [Windows container](./quickstart-custom-container.md).
* To access service endpoint secured resources.
* With a coexistence gateway that supports both ExpressRoute and point-to-site or site-to-site VPNs.

### Set up a gateway in your Azure virtual network

To create a gateway:

1. [Create the VPN gateway and subnet](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md#creategw). Select a route-based VPN type.

1. [Set the point-to-site addresses](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md#addresspool). If the gateway isn't in the basic SKU, then IKEV2 must be disabled in the point-to-site configuration and SSTP must be selected. The point-to-site address space must be in the RFC 1918 address blocks 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.

If you create the gateway for use with App Service VNet Integration, you don't need to upload a certificate. Creating the gateway can take 30 minutes. You won't be able to integrate your app with your VNet until the gateway is created.

### How gateway-required VNet Integration works

Gateway-required VNet Integration is built on top of point-to-site VPN technology. Point-to-site VPNs limit network access to the virtual machine that hosts the app. Apps are restricted to send traffic out to the internet only through Hybrid Connections or through VNet Integration. When your app is configured with the portal to use gateway-required VNet Integration, a complex negotiation is managed on your behalf to create and assign certificates on the gateway and the application side. The result is that the workers used to host your apps are able to directly connect to the virtual network gateway in the selected VNet.

:::image type="content" source="./media/overview-vnet-integration/vnetint-how-gateway-works.png" alt-text="How gateway-required VNet Integration works":::

### Access on-premises resources

Apps can access on-premises resources by integrating with VNets that have site-to-site connections. If you use gateway-required VNet Integration, update your on-premises VPN gateway routes with your point-to-site address blocks. When the site-to-site VPN is first set up, the scripts used to configure it should set up routes properly. If you add the point-to-site addresses after you create your site-to-site VPN, you need to update the routes manually. Details on how to do that vary per gateway and aren't described here. You can't have BGP configured with a site-to-site VPN connection.

No extra configuration is required for the regional VNet Integration feature to reach through your VNet to on-premises resources. You simply need to connect your VNet to on-premises resources by using ExpressRoute or a site-to-site VPN.

> [!NOTE]
> The gateway-required VNet Integration feature doesn't integrate an app with a VNet that has an ExpressRoute gateway. Even if the ExpressRoute gateway is configured in [coexistence mode](../expressroute/expressroute-howto-coexist-resource-manager.md), the VNet Integration doesn't work. If you need to access resources through an ExpressRoute connection, use the regional VNet Integration feature or an [App Service Environment](./environment/intro.md), which runs in your VNet.

### Peering

If you use peering with the regional VNet Integration, you don't need to do any additional configuration.

If you use gateway-required VNet Integration with peering, you need to configure a few more items. To configure peering to work with your app:

1. Add a peering connection on the VNet your app connects to. When you add the peering connection, enable **Allow virtual network access** and select **Allow forwarded traffic** and **Allow gateway transit**.
1. Add a peering connection on the VNet that's being peered to the VNet you're connected to. When you add the peering connection on the destination VNet, enable **Allow virtual network access** and select **Allow forwarded traffic** and **Allow remote gateways**.
1. Go to the **App Service plan** > **Networking** > **VNet Integration** UI in the portal. Select the VNet your app connects to. Under the routing section, add the address range of the VNet that's peered with the VNet your app is connected to.

## Manage VNet Integration

Connecting and disconnecting with a VNet is at an app level. Operations that can affect VNet Integration across multiple apps are at the App Service plan level. From the app > **Networking** > **VNet Integration** portal, you can get details on your VNet. You can see similar information at the App Service plan level in the **App Service plan** > **Networking** > **VNet Integration** portal.

The only operation you can take in the app view of your VNet Integration instance is to disconnect your app from the VNet it's currently connected to. To disconnect your app from a VNet, select **Disconnect**. Your app is restarted when you disconnect from a VNet. Disconnecting doesn't change your VNet. The subnet or gateway isn't removed. If you then want to delete your VNet, first disconnect your app from the VNet and delete the resources in it, such as gateways.

The App Service plan VNet Integration UI shows you all of the VNet Integrations used by the apps in your App Service plan. To see details on each VNet, select the VNet you're interested in. There are two actions you can perform here for gateway-required VNet Integration:

* **Sync network**: The sync network operation is used only for the gateway-dependent VNet Integration feature. Performing a sync network operation ensures that your certificates and network information are in sync. If you add or change the DNS of your VNet, perform a sync network operation. This operation restarts any apps that use this VNet. This operation will not work if you are using an app and a vnet belonging to different subscriptions.
* **Add routes**: Adding routes drives outbound traffic into your VNet.

The private IP assigned to the instance is exposed via the environment variable, **WEBSITE_PRIVATE_IP**. Kudu console UI also shows the list of environment variables available to the Web App. This IP is assigned from the address range of the integrated subnet. For regional VNet Integration, the value of WEBSITE_PRIVATE_IP is an IP from the address range of the delegated subnet, and for Gateway-required VNet Integration, the value is an IP from the address range of the Point-to-site address pool configured on the Virtual Network Gateway. This is the IP that will be used by the Web App to connect to the resources through the Virtual Network. 

> [!NOTE]
> The value of WEBSITE_PRIVATE_IP is bound to change. However, it will be an IP within the address range of the integration subnet or the point-to-site address range, so you will need to allow access from the entire address range.
>

### Gateway-required VNet Integration routing
The routes that are defined in your VNet are used to direct traffic into your VNet from your app. To send additional outbound traffic into the VNet, add those address blocks here. This capability only works with gateway-required VNet Integration. Route tables don't affect your app traffic when you use gateway-required VNet Integration the way that they do with regional VNet Integration.

### Gateway-required VNet Integration certificates
When gateway-required VNet Integration is enabled, there's a required exchange of certificates to ensure the security of the connection. Along with the certificates are the DNS configuration, routes, and other similar things that describe the network.

If certificates or network information is changed, select **Sync Network**. When you select **Sync Network**, you cause a brief outage in connectivity between your app and your VNet. While your app isn't restarted, the loss of connectivity could cause your site to not function properly.

## Pricing details
The regional VNet Integration feature has no extra charge for use beyond the App Service plan pricing tier charges.

Three charges are related to the use of the gateway-required VNet Integration feature:

* **App Service plan pricing tier charges**: Your apps need to be in a Standard, Premium, PremiumV2, or PremiumV3 App Service plan. For more information on those costs, see [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/).
* **Data transfer costs**: There's a charge for data egress, even if the VNet is in the same datacenter. Those charges are described in [Data Transfer pricing details](https://azure.microsoft.com/pricing/details/data-transfers/).
* **VPN gateway costs**: There's a cost to the virtual network gateway that's required for the point-to-site VPN. For more information, see [VPN gateway pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/).

## Troubleshooting

> [!NOTE]
> VNET Integration is not supported for Docker Compose scenarios in App Service.
> Access Restrictions are ignored if their is a private endpoint present.

[!INCLUDE [app-service-web-vnet-troubleshooting](../../includes/app-service-web-vnet-troubleshooting.md)]
