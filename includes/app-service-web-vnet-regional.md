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
* Resources across peered connections, which include Azure ExpressRoute connections.
* Private endpoints 

When you use VNet Integration with VNets in the same region, you can use the following Azure networking features:

* **Network security groups (NSGs)**: You can block outbound traffic with an NSG that's placed on your integration subnet. The inbound rules don't apply because you can't use VNet Integration to provide inbound access to your app.
* **Route tables (UDRs)**: You can place a route table on the integration subnet to send outbound traffic where you want.

By default, your app routes only RFC1918 traffic into your VNet. If you want to route all of your outbound traffic into your VNet, use the following steps to add the `WEBSITE_VNET_ROUTE_ALL` setting in your app: 

1. Go to the **Configuration** UI in your app portal. Select **New application setting**.
1. Enter `WEBSITE_VNET_ROUTE_ALL` in the **Name** box, and enter `1` in the **Value** box.

   ![Provide application setting][4]

1. Select **OK**.
1. Select **Save**.

> [!NOTE]
> When you route all of your outbound traffic into your VNet, it's subject to the NSGs and UDRs that are applied to your integration subnet. When `WEBSITE_VNET_ROUTE_ALL` is set to `1`, outbound traffic to public IP addresses is still sent from the addresses that are listed in your app properties, unless you provide routes that direct the traffic elsewhere.
> 
> Regional VNet integration isn't able to use port 25.

There are some limitations with using VNet Integration with VNets in the same region:

* You can't reach resources across global peering connections.
* The feature is available from all App Service scale units in Premium V2 and Premium V3. It's also available in Standard but only from newer App Service scale units. If you are on an older scale unit, you can only use the feature from a Premium V2 App Service plan. If you want to make sure you can use the feature in a Standard App Service plan, create your app in a Premium V3 App Service plan. Those plans are only supported on our newest scale units. You can scale down if you desire after that.  
* The integration subnet can be used by only one App Service plan.
* The feature can't be used by Isolated plan apps that are in an App Service Environment.
* The feature requires an unused subnet that's a /28 or larger in an Azure Resource Manager VNet.
* The app and the VNet must be in the same region.
* You can't delete a VNet with an integrated app. Remove the integration before you delete the VNet.
* You can have only one regional VNet Integration per App Service plan. Multiple apps in the same App Service plan can use the same VNet.
* You can't change the subscription of an app or a plan while there's an app that's using regional VNet Integration.
* Your app can't resolve addresses in Azure DNS Private Zones without configuration changes.

VNet Integration depends on a dedicated subnet. When you provision a subnet, the Azure subnet loses five IPs from the start. One address is used from the integration subnet for each plan instance. When you scale your app to four instances, then four addresses are used. 

When you scale up or down in size, the required address space is doubled for a short period of time. This affects the real, available supported instances for a given subnet size. The following table shows both the maximum available addresses per CIDR block and the impact this has on horizontal scale:

| CIDR block size | Max available addresses | Max horizontal scale (instances)<sup>*</sup> |
|-----------------|-------------------------|---------------------------------|
| /28             | 11                      | 5                               |
| /27             | 27                      | 13                              |
| /26             | 59                      | 29                              |

<sup>*</sup>Assumes that you'll need to scale up or down in either size or SKU at some point. 

Since subnet size can't be changed after assignment, use a subnet that's large enough to accommodate whatever scale your app might reach. To avoid any issues with subnet capacity, you should use a /26 with 64 addresses.  

When you want your apps in another plan to reach a VNet that's already connected to by apps in another plan, select a different subnet than the one being used by the pre-existing VNet Integration.

The feature is fully supported for both Windows and Linux apps, including [custom containers](../articles/app-service/quickstart-custom-container.md). All of the behaviors act the same between Windows apps and Linux apps.

### Service endpoints

Regional VNet Integration enables you to reach Azure services that are secured with service endpoints. To access a service endpoint-secured service, you must do the following:

1. Configure regional VNet Integration with your web app to connect to a specific subnet for integration.
1. Go to the destination service and configure service endpoints against the integration subnet.

### Network security groups

You can use network security groups to block inbound and outbound traffic to resources in a VNet. An app that uses regional VNet Integration can use a [network security group][VNETnsg] to block outbound traffic to resources in your VNet or the internet. To block traffic to public addresses, you must have the application setting `WEBSITE_VNET_ROUTE_ALL` set to `1`. The inbound rules in an NSG don't apply to your app because VNet Integration affects only outbound traffic from your app.

To control inbound traffic to your app, use the Access Restrictions feature. An NSG that's applied to your integration subnet is in effect regardless of any routes applied to your integration subnet. If `WEBSITE_VNET_ROUTE_ALL` is set to `1` and you don't have any routes that affect public address traffic on your integration subnet, all of your outbound traffic is still subject to NSGs assigned to your integration subnet. When `WEBSITE_VNET_ROUTE_ALL` isn't set, NSGs are only applied to RFC1918 traffic.

### Routes

You can use route tables to route outbound traffic from your app to wherever you want. By default, route tables only affect your RFC1918 destination traffic. When you set `WEBSITE_VNET_ROUTE_ALL` to `1`, all of your outbound calls are affected. Routes that are set on your integration subnet won't affect replies to inbound app requests. Common destinations can include firewall devices or gateways.

If you want to route all outbound traffic on-premises, you can use a route table to send all outbound traffic to your ExpressRoute gateway. If you do route traffic to a gateway, be sure to set routes in the external network to send any replies back.

Border Gateway Protocol (BGP) routes also affect your app traffic. If you have BGP routes from something like an ExpressRoute gateway, your app outbound traffic is affected. By default, BGP routes affect only your RFC1918 destination traffic. When `WEBSITE_VNET_ROUTE_ALL` is set to `1`, all outbound traffic can be affected by your BGP routes.

### Azure DNS private zones 

After your app integrates with your VNet, it uses the same DNS server that your VNet is configured with. By default, your app won't work with Azure DNS private zones. To work with Azure DNS private zones, you need to add the following app settings:

1. `WEBSITE_DNS_SERVER` with value `168.63.129.16`
1. `WEBSITE_VNET_ROUTE_ALL` with value `1`

These settings send all of your outbound calls from your app into your VNet and enable your app to access an Azure DNS private zone. With these settings, your app can use Azure DNS by querying the DNS private zone at the worker level.  

### Private Endpoints

If you want to make calls to [Private Endpoints][privateendpoints], then you must make sure that your DNS lookups resolve to the private endpoint. You can enforce this behavior in one of the following ways: 

* Integrate with Azure DNS private zones. When your VNet doesn't have a custom DNS server, this is done automatically.
* Manage the private endpoint in the DNS server used by your app. To do this you must know the private endpoint address and then point the endpoint you are trying to reach to that address using an A record.
* Configure your own DNS server to forward to Azure DNS private zones.

<!--Image references-->
[4]: ../includes/media/web-sites-integrate-with-vnet/vnetint-appsetting.png

<!--Links-->
[VNETnsg]: /azure/virtual-network/security-overview/
[privateendpoints]: ../articles/app-service/networking/private-endpoint.md
