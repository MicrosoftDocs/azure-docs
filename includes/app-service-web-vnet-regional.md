---
author: ccompy
ms.service: app-service-web
ms.topic: include
ms.date: 10/21/2020
ms.author: ccompy
---
Using regional VNet Integration enables your app to access:

* Resources in a VNet in the same region as your app.
* Resources in VNets peered to the VNet your app is integrated with.
* Service endpoint secured services.
* Resources across Azure ExpressRoute connections.
* Resources in the VNet you're integrated with.
* Resources across peered connections, which includes Azure ExpressRoute connections.
* Private endpoints 

When you use VNet Integration with VNets in the same region, you can use the following Azure networking features:

* **Network security groups (NSGs)**: You can block outbound traffic with an NSG that's placed on your integration subnet. The inbound rules don't apply because you can't use VNet Integration to provide inbound access to your app.
* **Route tables (UDRs)**: You can place a route table on the integration subnet to send outbound traffic where you want.

By default, your app routes only RFC1918 traffic into your VNet. If you want to route all of your outbound traffic into your VNet, apply the app setting WEBSITE_VNET_ROUTE_ALL to your app. To configure the app setting:

1. Go to the **Configuration** UI in your app portal. Select **New application setting**.
1. Enter **WEBSITE_VNET_ROUTE_ALL** in the **Name** box, and enter **1** in the **Value** box.

   ![Provide application setting][4]

1. Select **OK**.
1. Select **Save**.

> [!NOTE]
> If you route all of your outbound traffic into your VNet, it's subject to the NSGs and UDRs that are applied to your integration subnet. When you route all of your outbound traffic into your VNet, your outbound addresses are still the outbound addresses that are listed in your app properties unless you provide routes to send the traffic elsewhere.

There are some limitations with using VNet Integration with VNets in the same region:

* You can't reach resources across global peering connections.
* The feature is available from all App Service scale units in Premium V2 and Premium V3. It is also available in Standard but only from newer App Service scale units. If you are on an older scale unit you can only use the feature from a Premium V2 App Service plan. If you want to be certain of being able to use the feature in a Standard App Service plan, create your app in a Premium V3 App Service plan. Those plans are only supported on our newest scale units. You can scale down if you desire after that.  
* The integration subnet can be used by only one App Service plan.
* The feature can't be used by Isolated plan apps that are in an App Service Environment.
* The feature requires an unused subnet that's a /28 or larger in an Azure Resource Manager VNet.
* The app and the VNet must be in the same region.
* You can't delete a VNet with an integrated app. Remove the integration before you delete the VNet.
* You can only integrate with VNets in the same subscription as the app.
* You can have only one regional VNet Integration per App Service plan. Multiple apps in the same App Service plan can use the same VNet.
* You can't change the subscription of an app or a plan while there's an app that's using regional VNet Integration.
* Your app cannot resolve addresses in Azure DNS Private Zones without configuration changes

VNet Integration depends on use of a dedicated subnet.  When you provision a subnet, the Azure subnet loses 5 IPs for from the start. One address is used from the integration subnet for each plan instance. If you scale your app to four instances, then four addresses are used. The debit of 5 addresses from the subnet size means that the maximum available addresses per CIDR block are:

- /28 has 11 addresses
- /27 has 27 address
- /26 has 59 addresses

If you scale up or down in size, you need double your address need for a short period of time. The limits in size means that the real available supported instances per subnet size is, if your subnet is a:

- /28, your maximum horizontal scale is 5 instances
- /27, your maximum horizontal scale is 13 instances
- /26, your maximum horizontal scale is 29 instances

The limits noted on maximum horizontal scale assumes that you will need to scale up or down in either size or SKU at some point. 

Since subnet size can't be changed after assignment, use a subnet that's large enough to accommodate whatever scale your app might reach. To avoid any issues with subnet capacity, a /26 with 64 addresses is the recommended size.  

If you want your apps in another plan to reach a VNet that's already connected to by apps in another plan, select a different subnet than the one being used by the preexisting VNet Integration.

The feature is fully supported for both Windows and Linux apps, including [custom containers](../articles/app-service/quickstart-custom-container.md). All of the behaviors act the same between Windows apps and Linux apps.

### Service endpoints

Regional VNet Integration enables you to use service endpoints. To use service endpoints with your app, use regional VNet Integration to connect to a selected VNet and then configure service endpoints with the destination service on the subnet you used for the integration. If you then wanted to access a service over service endpoints:

1. configure regional VNet Integration with your web app
1. go to the destination service and configure service endpoints against the subnet used for integration

### Network security groups

You can use network security groups to block inbound and outbound traffic to resources in a VNet. An app that uses regional VNet Integration can use a [network security group][VNETnsg] to block outbound traffic to resources in your VNet or the internet. To block traffic to public addresses, you must have the application setting WEBSITE_VNET_ROUTE_ALL set to 1. The inbound rules in an NSG don't apply to your app because VNet Integration affects only outbound traffic from your app.

To control inbound traffic to your app, use the Access Restrictions feature. An NSG that's applied to your integration subnet is in effect regardless of any routes applied to your integration subnet. If WEBSITE_VNET_ROUTE_ALL is set to 1 and you don't have any routes that affect public address traffic on your integration subnet, all of your outbound traffic is still subject to NSGs assigned to your integration subnet. If WEBSITE_VNET_ROUTE_ALL isn't set, NSGs are only applied to RFC1918 traffic.

### Routes

You can use route tables to route outbound traffic from your app to wherever you want. By default, route tables only affect your RFC1918 destination traffic. If you set WEBSITE_VNET_ROUTE_ALL to 1, all of your outbound calls are affected. Routes that are set on your integration subnet won't affect replies to inbound app requests. Common destinations can include firewall devices or gateways.

If you want to route all outbound traffic on-premises, you can use a route table to send all outbound traffic to your ExpressRoute gateway. If you do route traffic to a gateway, be sure to set routes in the external network to send any replies back.

Border Gateway Protocol (BGP) routes also affect your app traffic. If you have BGP routes from something like an ExpressRoute gateway, your app outbound traffic will be affected. By default, BGP routes affect only your RFC1918 destination traffic. If WEBSITE_VNET_ROUTE_ALL is set to 1, all outbound traffic can be affected by your BGP routes.

### DNS 

After your app integrates with your VNet, it uses the same DNS server that your VNet is configured with. You can override this behavior on your app by configuring the app setting WEBSITE_DNS_SERVER with the address of your desired DNS server. If you had a custom DNS server configured with your VNet but wanted to have your app use Azure DNS private zones, you should set WEBSITE_DNS_SERVER with value 168.63.129.16. 

### Private endpoints

If you want to make calls to [Private Endpoints][privateendpoints], then you need to;

* integrate with Azure DNS Private Zones 
* manage the private endpoint in the DNS server used by your app
* configure your own DNS server to forward to Azure DNS private zones

If you 

<!--Image references-->
[4]: ../includes/media/web-sites-integrate-with-vnet/vnetint-appsetting.png

<!--Links-->
[VNETnsg]: https://docs.microsoft.com/azure/virtual-network/security-overview/
[privateendpoints]: https://docs.microsoft.com/azure/app-service/networking/private-endpoint
