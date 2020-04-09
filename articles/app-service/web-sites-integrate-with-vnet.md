---
title: Integrate app with Azure Virtual Network
description: Integrate apps in Azure App Service with Azure Virtual Networks.
author: ccompy
ms.assetid: 90bc6ec6-133d-4d87-a867-fcf77da75f5a
ms.topic: article
ms.date: 04/08/2020
ms.author: ccompy
ms.custom: seodec18

---
# Integrate your app with an Azure Virtual Network
This document describes the Azure App Service VNet Integration feature and how to set it up with apps in the [Azure App Service](https://go.microsoft.com/fwlink/?LinkId=529714). [Azure Virtual Networks][VNETOverview] (VNets) allow you to place many of your Azure resources in a non-internet routable network.  

The Azure App Service has two variations. 

1. The multi-tenant systems that support the full range of pricing plans except Isolated
2. The App Service Environment (ASE), which deploys into your VNet and supports Isolated pricing plan apps

This document goes through the VNet Integration feature, which is for use in the multi-tenant App Service. If your app is in [App Service Environment][ASEintro], then it's already in a VNet and doesn't require use of the VNet Integration feature to reach resources in the same VNet. For details on all of the App Service networking features, read [App Service networking features](networking-features.md)

VNet Integration gives your web app access to resources in your VNet but doesn't grant inbound private access to your web app from the VNet. Private site access refers to making your app only accessible from a private network such as from within an Azure virtual network. VNet Integration is only for making outbound calls from your app into your VNet. The VNet Integration feature behaves differently when used with VNets in the same region and with VNets in other regions. The VNet Integration feature has two variations.

1. Regional VNet Integration - When connecting to Resource Manager VNets in the same region, you must have a dedicated subnet in the VNet you are integrating with. 
2. Gateway required VNet Integration - When connecting to VNets in other regions or to a Classic VNet in the same region you need a Virtual Network gateway provisioned in the target VNet.

The VNet Integration features:

* require a Standard, Premium, PremiumV2, or Elastic Premium pricing plan 
* support TCP and UDP
* work with App Service apps, and Function apps

There are some things that VNet Integration doesn't support including:

* mounting a drive
* AD integration 
* NetBios

Gateway required VNet Integration only provides access to resources in the target VNet or in networks connected to the target VNet with peering or VPNs. Gateway required VNet Integration doesn't enable access to resources available across ExpressRoute connections or works with service endpoints. 

Regardless of the version used, VNet Integration gives your web app access to resources in your VNet but doesn't grant inbound private access to your web app from the VNet. Private site access refers to making your app only accessible from a private network such as from within an Azure virtual network. VNet Integration is only for making outbound calls from your app into your VNet. 

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

Using regional VNet Integration enables your app to access:

* resources in the VNet in the same region that you integrate with 
* resources in VNets peered to your VNet that are in the same region
* service endpoint secured services
* resources across ExpressRoute connections
* resources in the VNet you are connected to
* resources across peered connections including ExpressRoute connections
* private endpoints 

When using VNet Integration with VNets in the same region, you can use the following Azure Networking features:

* Network Security Groups(NSGs) - You can block outbound traffic with a Network Security Group that is placed on your integration subnet. The inbound rules do not apply as you cannot use VNet Integration to provide inbound access to your web app.
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
* You can only integrate with VNets in the same subscription as the web app
* You can have only one regional VNet Integration per App Service plan. Multiple apps in the same App Service plan can use the same VNet. 
* You cannot change the subscription of an app or an App Service plan while there is an app that is using Regional VNet Integration
* Your app cannot resolve addresses in Azure DNS Private Zones

One address is used for each App Service plan instance. If you scale your app to five instances, then five addresses are used. Since subnet size cannot be changed after assignment, you must use a subnet that is large enough to accommodate whatever scale your app may reach. A /26 with 64 addresses is the recommended size. A /26 with 64 addresses will accommodate a Premium App Service plan with 30 instances. When you scale an App Service plan up or down, you need twice as many addresses for a short period of time. 

If you want your apps in another App Service plan to reach a VNet that is connected to already by apps in another App Service plan, you need to select a different subnet than the one being used by the pre-existing VNet Integration.  

The feature is in preview for Linux. The Linux form of the feature only supports making calls to RFC 1918 addresses (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16).

### Web App for Containers

If you use App Service on Linux with the built-in images, regional VNet Integration works without additional changes. If you use Web App for Containers, you need to modify your docker image in order to use VNet Integration. In your docker image, use the PORT environment variable as the main web server’s listening port, instead of using a hardcoded port number. The PORT environment variable is automatically set by App Service platform at the container startup time. If you are using SSH, then the SSH daemon must be configured to listen on the port number specified by the SSH_PORT environment variable when using regional VNet integration.  There is no support for gateway required VNet Integration on Linux. 

### Service Endpoints

Regional VNet Integration enables you to use service endpoints.  To use service endpoints with your app, use regional VNet Integration to connect to a selected VNet and then configure service endpoints on the subnet you used for the integration. 

### Network Security Groups

Network Security Groups enable you to block inbound and outbound traffic to resources in a VNet. A web app using regional VNet Integration can use [Network Security Group][VNETnsg] to block outbound traffic to resources in your VNet or the internet. To block traffic to public addresses, you must have the application setting WEBSITE_VNET_ROUTE_ALL set to 1. The inbound rules in an NSG do not apply to your app as VNet Integration only affects outbound traffic from your app. To control inbound traffic to your web app, use the Access Restrictions feature. An NSG that is applied to your integration subnet will be in effect regardless of any routes applied to your integration subnet. If WEBSITE_VNET_ROUTE_ALL was set to 1 and you did not have any routes affecting public address traffic on your integration subnet, all of your outbound traffic would still be subject to NSGs assigned to your integration subnet. If WEBSITE_VNET_ROUTE_ALL was not set, NSGs would only be applied to RFC1918 traffic.

### Routes

Route Tables enable you to route outbound traffic from your app to wherever you want. By default, route tables will only affect your RFC1918 destination traffic.  If you set WEBSITE_VNET_ROUTE_ALL to 1, then all of your outbound calls will be affected. Routes that are set on your integration subnet will not affect replies to inbound app requests. Common destinations can include firewall devices or gateways. If you want to route all outbound traffic on-premises, you can use a route table to send all outbound traffic to your ExpressRoute gateway. If you do route traffic to a gateway, be sure to set routes in the external network to send any replies back.

Border Gateway Protocol (BGP) routes will also affect your app traffic. If you have BGP routes from something like an ExpressRoute gateway, your app outbound traffic will be affected. By default, BGP routes will only affect your RFC1918 destination traffic. If WEBSITE_VNET_ROUTE_ALL is set to 1, then all outbound traffic can be affected by your BGP routes. 

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

## Migration

If your app is using gateway required VNet Integration to a VNet in the same region, and the VNet is in the same subscription as the app, then you can switch to regional VNet Integration. To switch from gateway required VNet Integration to regional VNet Integration:

1. Make sure you do not have any networking configuration, such as NSGs, that are filtering on the point-to-site address blocks. If they are, you need to remove those rules or, create a new integration subnet to make new NSG allow rules against.
1. In the app portal, disconnect your app from the VNet. Doing this will cause your app to lose connectivity to resources in your VNet and restart. 
1. Select **Add VNet** and add a regional VNet Integration per normal. If you created a new integration subnet in step 1 to satisfy your NSG needs, select that subnet during VNet Integration. Adding the integration will restart your app again.

## Pricing details
The regional VNet Integration feature has no additional charge for use beyond the ASP pricing tier charges.

There are three related charges to the use of the gateway required VNet Integration feature:

* ASP pricing tier charges - Your apps need to be in a Standard, Premium, or PremiumV2 App Service Plan. You can see more details on those costs here: [App Service Pricing][ASPricing]. 
* Data transfer costs - There is a charge for data egress, even if the VNet is in the same data center. Those charges are described in [Data Transfer Pricing Details][DataPricing]. 
* VPN Gateway costs - There is a cost to the VNet gateway that is required for the point-to-site VPN. The details are on the [VPN Gateway Pricing][VNETPricing] page.

## Troubleshooting
While the feature is easy to set up, that doesn't mean that your experience will be problem free. Should you encounter problems accessing your desired endpoint there are some utilities you can use to test connectivity from the app console. There are two consoles that you can use. One is the Kudu console and the other is the console in the Azure portal. To reach the Kudu console from your app, go to Tools -> Kudu. You can also reach the Kudo console at [sitename].scm.azurewebsites.net. Once the website loads, go to the Debug console tab. To get to the Azure portal hosted console then from your app go to Tools -> Console. 

#### Tools
The tools **ping**, **nslookup**, and **tracert** won’t work through the console due to security constraints. To fill the void, two separate tools added. In order to test DNS functionality, we added a tool named nameresolver.exe. The syntax is:

    nameresolver.exe hostname [optional: DNS Server]

You can use **nameresolver** to check the hostnames that your app depends on. This way you can test if you have anything mis-configured with your DNS or perhaps don't have access to your DNS server. You can see the DNS server that your app will use in the console by looking at the environmental variables WEBSITE_DNS_SERVER and WEBSITE_DNS_ALT_SERVER.

The next tool allows you to test for TCP connectivity to a host and port combination. This tool is called **tcpping** and the syntax is:

    tcpping.exe hostname [optional: port]

The **tcpping** utility tells you if you can reach a specific host and port. It only can show success if: there is an application listening at the host and port combination, and there is network access from your app to the specified host and port.

#### Debugging access to VNet hosted resources
There are a number of things that can prevent your app from reaching a specific host and port. Most of the time it is one of three things:

* **A firewall is in the way.** If you have a firewall in the way, you will hit the TCP timeout. The TCP timeout is 21 seconds in this case. Use the **tcpping** tool to test connectivity. TCP timeouts can be due to many things beyond firewalls but start there. 
* **DNS isn't accessible.** The DNS timeout is three seconds per DNS server. If you have two DNS servers, the timeout is 6 seconds. Use nameresolver to see if DNS is working. Remember you can't use nslookup as that doesn't use the DNS your VNet is configured with. If inaccessible, you could have a firewall or NSG blocking access to DNS or it could be down.

If those items don't answer your problems, look first for things like: 

**regional VNet Integration**
* is your destination a non-RFC1918 address and you do not have WEBSITE_VNET_ROUTE_ALL set to 1
* is there an NSG blocking egress from your integration subnet
* if going across ExpressRoute or a VPN, is your on-premises gateway configured to route traffic back up to Azure? If you can reach endpoints in your VNet but not on-premises, check your routes.
* do you have enough permissions to set delegation on the integration subnet? During regional VNet Integration configuration, your integration subnet will be delegated to Microsoft.Web. The VNet Integration UI will delegate the subnet to Microsoft.Web automatically. If your account does not have sufficient networking permissions to set delegation, you will need someone who can set attributes on your integration subnet to delegate the subnet. To manually delegate the integration subnet, go to the Azure Virtual Network subnet UI and set delegation for Microsoft.Web. 

**gateway required VNet Integration**
* is the point-to-site address range in the RFC 1918 ranges (10.0.0.0-10.255.255.255 / 172.16.0.0-172.31.255.255 / 192.168.0.0-192.168.255.255)?
* Does the Gateway show as being up in the portal? If your gateway is down, then bring it back up.
* Do certificates show as being in sync or do you suspect that the network configuration was changed?  If your certificates are out of sync or you suspect that there has been a change made to your VNet configuration that wasn't synced with your ASPs, then hit "Sync Network".
* if going across a VPN, is the on-premises gateway configured to route traffic back up to Azure? If you can reach endpoints in your VNet but not on-premises, check your routes.
* are you trying to use a coexistence gateway that supports both point to site and ExpressRoute? Coexistence gateways are not supported with VNet Integration 

Debugging networking issues is a challenge because there you cannot see what is blocking access to a specific host:port combination. Some of the causes include:

* you have a firewall up on your host preventing access to the application port from your point to site IP range. Crossing subnets often requires Public access.
* your target host is down
* your application is down
* you had the wrong IP or hostname
* your application is listening on a different port than what you expected. You can match your process ID with the listening port by using "netstat -aon" on the endpoint host. 
* your network security groups are configured in such a manner that they prevent access to your application host and port from your point to site IP range

Remember that you don't know what address your app will actually use. It could be any address in the integration subnet or point-to-site address range, so you need to allow access from the entire address range. 

Additional debug steps include:

* connect to a VM in your VNet and attempt to reach your resource host:port from there. To test for TCP access, use the PowerShell command **test-netconnection**. The syntax is:

      test-netconnection hostname [optional: -Port]

* bring up an application on a VM and test access to that host and port from the console from your app using **tcpping**

#### On-premises resources ####

If your app cannot reach a resource on-premises, then check if you can reach the resource from your VNet. Use the **test-netconnection** PowerShell command to check for TCP access. If your VM can't reach your on-premises resource, your VPN or ExpressRoute connection may not be configured properly.

If your VNet hosted VM can reach your on-premises system but your app can't, then the cause is likely one of the following reasons:

* your routes are not configured with your subnet or point to site address ranges in your on-premises gateway
* your network security groups are blocking access for your Point-to-Site IP range
* your on-premises firewalls are blocking traffic from your Point-to-Site IP range
* you are trying to reach a non-RFC 1918 address using the regional VNet Integration feature


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
[4]: ./media/web-sites-integrate-with-vnet/vnetint-appsetting.png
[5]: ./media/web-sites-integrate-with-vnet/vnetint-regionalworks.png
[6]: ./media/web-sites-integrate-with-vnet/vnetint-gwworks.png


<!--Links-->
[VNETOverview]: https://azure.microsoft.com/documentation/articles/virtual-networks-overview/ 
[AzurePortal]: https://portal.azure.com/
[ASPricing]: https://azure.microsoft.com/pricing/details/app-service/
[VNETPricing]: https://azure.microsoft.com/pricing/details/vpn-gateway/
[DataPricing]: https://azure.microsoft.com/pricing/details/data-transfers/
[V2VNETP2S]: https://azure.microsoft.com/documentation/articles/vpn-gateway-howto-point-to-site-rm-ps/
[ASEintro]: environment/intro.md
[ILBASE]: environment/create-ilb-ase.md
[V2VNETPortal]: ../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md
[VPNERCoex]: ../expressroute/expressroute-howto-coexist-resource-manager.md
[ASE]: environment/intro.md
[creategatewaysubnet]: ../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md#creategw
[creategateway]: https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal#creategw
[setp2saddresses]: https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal#addresspool
[VNETnsg]: https://docs.microsoft.com/azure/virtual-network/security-overview/
[VNETRouteTables]: https://docs.microsoft.com/azure/virtual-network/manage-route-table/
[installCLI]: https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest/
