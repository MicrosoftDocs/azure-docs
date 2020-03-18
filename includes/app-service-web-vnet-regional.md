---
author: ccompy
ms.service: app-service-web
ms.topic: include
ms.date: 02/27/2020
ms.author: ccompy
---
Using regional VNet Integration enables your app to access:

* resources in the VNet in the same region that you integrate with 
* resources in VNets peered to your VNet that are in the same region
* service endpoint secured services
* resources across ExpressRoute connections
* resources in the VNet you are connected to
* resources across peered connections including ExpressRoute connections
* private endpoints 

When using VNet Integration with VNets in the same region, you can use the following Azure Networking features:

* Network Security Groups(NSGs) - You can block outbound traffic with a Network Security Group that is placed on your integration subnet. The inbound rules do not apply as you cannot use VNet Integration to provide inbound access to your app.
* Route Tables (UDRs) - You can place a route table on the integration subnet to send outbound traffic where you want. 

By default, your app will only route RFC1918 traffic into your VNet. If you want to route all of your outbound traffic into your VNet, apply the app setting WEBSITE_VNET_ROUTE_ALL to your app. To configure the app setting:

1. Go to the Configuration UI in your app portal. Select **New application setting**
1. Type **WEBSITE_VNET_ROUTE_ALL** in the Name field and **1** in the Value field

   ![Provide application setting][4]

1. Select **OK**
1. Select **Save**

If you route all of your outbound traffic into your VNet, then it will be subject to the NSGs and UDRs that are applied to your integration subnet. When you route all of your outbound traffic into your VNet, your outbound addresses will still be the outbound addresses that are listed in your app properties unless you provide routes to send the traffic elsewhere. 

There are some limitations with using VNet Integration with VNets in the same region:

* You cannot reach resources across global peering connections
* The feature is only available from newer App Service scale units that support PremiumV2 App Service plans.
* The integration subnet can only be used by only one App Service plan
* The feature cannot be used by Isolated plan apps that are in an App Service Environment
* The feature requires an unused subnet that is a /27 with 32 addresses or larger in a Resource Manager VNet
* The app and the VNet must be in the same region
* You cannot delete a VNet with an integrated app. Remove the integration before deleting the VNet. 
* You can only integrate with VNets in the same subscription as the app
* You can have only one regional VNet Integration per App Service plan. Multiple apps in the same App Service plan can use the same VNet. 
* You cannot change the subscription of an app or a plan while there is an app that is using Regional VNet Integration

One address is used for each plan instance. If you scale your app to five instances, then five addresses are used. Since subnet size cannot be changed after assignment, you must use a subnet that is large enough to accommodate whatever scale your app may reach. A /26 with 64 addresses is the recommended size. A /26 with 64 addresses will accommodate a Premium plan with 30 instances. When you scale a plan up or down, you need twice as many addresses for a short period of time. 

If you want your apps in another plan to reach a VNet that is connected to already by apps in another plan, you need to select a different subnet than the one being used by the pre-existing VNet Integration.  

The feature is in preview for Linux. The Linux form of the feature only supports making calls to RFC 1918 addresses (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16).

### Web / Function App for Containers

If you host your app on Linux with the built-in images, regional VNet Integration works without additional changes. If you use Web / Function App for Containers, you need to modify your docker image in order to use VNet Integration. In your docker image, use the PORT environment variable as the main web server’s listening port, instead of using a hardcoded port number. The PORT environment variable is automatically set by the platform at the container startup time. If you are using SSH, then the SSH daemon must be configured to listen on the port number specified by the SSH_PORT environment variable when using regional VNet integration.  There is no support for gateway required VNet Integration on Linux. 

### Service Endpoints

Regional VNet Integration enables you to use service endpoints.  To use service endpoints with your app, use regional VNet Integration to connect to a selected VNet and then configure service endpoints on the subnet you used for the integration. 

### Network Security Groups

Network Security Groups enable you to block inbound and outbound traffic to resources in a VNet. An app using regional VNet Integration can use [Network Security Group][VNETnsg] to block outbound traffic to resources in your VNet or the internet. To block traffic to public addresses, you must have the application setting WEBSITE_VNET_ROUTE_ALL set to 1. The inbound rules in an NSG do not apply to your app as VNet Integration only affects outbound traffic from your app. To control inbound traffic to your app, use the Access Restrictions feature. An NSG that is applied to your integration subnet will be in effect regardless of any routes applied to your integration subnet. If WEBSITE_VNET_ROUTE_ALL was set to 1 and you did not have any routes affecting public address traffic on your integration subnet, all of your outbound traffic would still be subject to NSGs assigned to your integration subnet. If WEBSITE_VNET_ROUTE_ALL was not set, NSGs would only be applied to RFC1918 traffic.

### Routes

Route Tables enable you to route outbound traffic from your app to wherever you want. By default, route tables will only affect your RFC1918 destination traffic.  If you set WEBSITE_VNET_ROUTE_ALL to 1, then all of your outbound calls will be affected. Routes that are set on your integration subnet will not affect replies to inbound app requests. Common destinations can include firewall devices or gateways. If you want to route all outbound traffic on-premises, you can use a route table to send all outbound traffic to your ExpressRoute gateway. If you do route traffic to a gateway, be sure to set routes in the external network to send any replies back.

Border Gateway Protocol (BGP) routes will also affect your app traffic. If you have BGP routes from something like an ExpressRoute gateway, your app outbound traffic will be affected. By default, BGP routes will only affect your RFC1918 destination traffic. If WEBSITE_VNET_ROUTE_ALL is set to 1, then all outbound traffic can be affected by your BGP routes. 


<!--Image references-->
[4]: ../includes/media/web-sites-integrate-with-vnet/vnetint-appsetting.png

<!--Links-->
[VNETnsg]: https://docs.microsoft.com/azure/virtual-network/security-overview/