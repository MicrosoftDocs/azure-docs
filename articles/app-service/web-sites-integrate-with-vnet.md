---
title: Integrate an app with an Azure Virtual Network
description: Shows you how to connect an app in Azure App Service to a new or existing Azure virtual network
services: app-service
documentationcenter: ''
author: ccompy
manager: stefsch
ms.assetid: 90bc6ec6-133d-4d87-a867-fcf77da75f5a
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/12/2018
ms.author: ccompy

---
# Integrate your app with an Azure Virtual Network
This document describes the Azure App Service virtual network integration feature and shows how to set it up with apps in [Azure App Service](https://go.microsoft.com/fwlink/?LinkId=529714). [Azure Virtual Networks][VNETOverview] (VNets) allow you to place many of your Azure resources in a non-internet routeable network. These networks can then be connected to your on-premises networks using VPN technologies. 

The Azure App Service has two forms. 

1. The multi-tenant systems that support the full range of pricing plans except Isolated
2. The App Service Environment (ASE), which deploys into your VNet. 

This document goes through the VNet Integration feature, which is meant for use in the multi-tenant App Service.  If your app is in [App Service Environment][ASEintro], then it's already in a VNet and doesn't require use of the VNet Integration feature to reach resources in the same VNet.

VNet Integration gives your web app access to resources in your virtual network but doesn't grant private access to your web app from the virtual network. Private site access refers to making your app only accessible from a private network such as from within an Azure virtual network. Private site access is only available with an ASE configured with an Internal Load Balancer (ILB). For details on using an ILB ASE, start with the article here: [Creating and using an ILB ASE][ILBASE]. 

VNet Integration is often used to enable access from apps to a databases and web services running in your VNet. With VNet Integration, you don't need to expose a public endpoint for applications on your VM but can use the private non-internet routable addresses instead. 

The VNet Integration feature:

* requires a Standard, Premium, or PremiumV2 pricing plan 
* works with Classic or Resource Manager VNet 
* supports TCP and UDP
* works with Web, Mobile, API apps, and Function apps
* enables an app to connect to only 1 VNet at a time
* enables up to five VNets to be integrated with in an App Service Plan 
* allows the same VNet to be used by multiple apps in an App Service Plan
* requires a Virtual Network Gateway that is configured with Point to Site VPN
* supports a 99.9% SLA due to the SLA on the gateway

There are some things that VNet Integration doesn't support including:

* mounting a drive
* AD integration 
* NetBios
* private site access
* accessing resources across ExpressRoute 
* accessing resources across Service Endpoints 

### Getting started
Here are some things to keep in mind before connecting your web app to a virtual network:

* A target virtual network must have point-to-site VPN enabled with a route-based gateway before it can be connected to app. 
* The VNet must be in the same subscription as your App Service Plan(ASP).
* The apps that integrate with a VNet use the DNS that is specified for that VNet.

## Enabling VNet Integration

There is a new version of the VNet Integration feature that is in preview. It doesn't depend on point-to-site VPN and also supports accessing resources across ExpressRoute or Service Endpoints. To learn more about the new preview capability, go to the end of this document. 

### Set up a gateway in your VNet ###

If you already have a gateway configured with point-to-site addresses, you can skip to configuring VNet Integration with your app.  
To create a gateway:

1. [Create a gateway subnet][creategatewaysubnet] in your VNet.  

1. [Create the VPN gateway][creategateway]. Select a route-based VPN type.

1. [Set the point to site addresses][setp2saddresses]. If the gateway isn't in the basic SKU, then IKEV2 must be disabled in the point-to-site configuration and SSTP must be selected. The address space must be in one of the following address blocks:

* 10.0.0.0/8  - This means an IP address range from  10.0.0.0 to 10.255.255.255
* 172.16.0.0/12 - This means an IP address range from  172.16.0.0 to 172.31.255.255 
* 192.168.0.0/16 - This means an IP address range from  192.168.0.0 to 192.168.255.255

If your are just creating the gateway for use with App Service VNet Integration, then you do not need to upload a certificate. Creating the gateway can take 30 minutes. You will not be able to integrate your app with your VNet until the gateway is provisioned. 

### Configure VNet Integration with your app ###

To enable VNet Integration on your app: 

1. Go to your app in the Azure portal and open app settings and select Networking > VNet Integration. Scale your ASP to a Standard SKU or better before you can configure VNet Integration. 
 ![VNet Integration UI][1]

1. Select **Add VNet**. 
 ![Add VNet Integration][2]

1. Select your VNet. 
  ![Select your VNet][8]
  
Your app will be restarted after this last step.  

## How the system works
The VNet Integration feature is built on top of point-to-site VPN technology. Apps in Azure App Service are hosted in a multi-tenant system, which precludes provisioning an app directly in a VNet. The point-to-site technology limits network access to just the virtual machine hosting the app. Apps are restricted to only send traffic out to the internet, through Hybrid Connections or through VNet Integration. 

![How VNet Integration works][3]

## Managing the VNet Integrations
The ability to connect and disconnect to a VNet is at an app level. Operations that can affect the VNet Integration across multiple apps are at the App Service plan level. From the app UID, you can get details on your VNet. The same information is also shown at the ASP level. 

 ![VNet details][4]

From the Network Feature Status page, you can see if your app is connected to your VNet. If your VNet gateway is down for whatever reason, your status shows as not-connected. 

The information you now have available to you in the app level VNet Integration UI is the same as the detail information you get from the ASP. Here are those items:

* VNet Name - links to the virtual network UI
* Location - reflects the location of your VNet. Integrating with a VNet in another location can cause latency issues for your app. 
* Certificate Status - reflects if your certificates are in sync between your App Service plan and your VNet.
* Gateway Status - Should your gateways be down for whatever reason then your app cannot access resources in the VNet. 
* VNet address space - shows the IP address space for your VNet. 
* Point-to-site address space - shows the point to site IP address space for your VNet. When making calls into your VNet, your app FROM address will be one of these addresses. 
* Site-to-site address space - You can use site-to-site VPNs to connect your VNet to your on-premises resources or to other VNet. The IP ranges defined with that VPN connection are shown here.
* DNS Servers - shows the DNS Servers configured with your VNet.
* IP addresses routed to the VNet - shows the address blocks routed used to drive traffic into your VNet 

The only operation you can take in the app view of your VNet Integration is to disconnect your app from the VNet it is currently connected to. To disconnect your app from a VNet, select **Disconnect**. Your app will be restarted when you disconnect from a VNet. Disconnecting doesn't change your VNet. The VNet and its configuration including the gateways remains unchanged. If you then want to delete your VNet, you need to first delete the resources in it including the gateways. 

To reach the ASP VNet Integration UI, open your ASP UI and select **Networking**.  Under VNet Integration, select **Click here to configure** to open the Network Feature Status UI.

![ASP VNet Integration information][5]

The ASP VNet Integration UI will show you all of the VNets that are used by the apps in your ASP. You can have up to 5 VNets connected to by any number of apps in your App Service plan. Each app can have only one integration configured. To see details on each VNet, click on the VNet you are interested in. There are two actions you can perform here.

* **Sync network**. The sync network operation makes sure that your certificates and network information are in sync. If you add or change the DNS of your VNet, you need to perform a **Sync network** operation. This operation will restart any apps using this VNet.
* **Add routes** Adding routes will drive outbound traffic into your VNet.

**Routing** 
The routes that are defined in your VNet are used to direct traffic into your VNet from your app. If you need to send additional outbound traffic into the VNet, then you can add those address blocks here.   

**Certificates**
When VNet Integration enabled, there is a required exchange of certificates to ensure the security of the connection. Along with the certificates are the DNS configuration, routes, and other similar things that describe the network.
If certificates or network information is changed, you need to click "Sync Network". When you click "Sync Network", you cause a brief outage in connectivity between your app and your VNet. While your app isn't restarted, the loss of connectivity could cause your site to not function properly. 

## Accessing on-premises resources
Apps can access on-premises resources by integrating with VNets that have site-to-site connections. To access resources on-premises, you need to update your on-premises VPN gateway routes with your point-to-site address blocks. When the site-to-site VPN is first set up, the scripts used to configure it should set up routes properly. If you add the point-to-site addresses after you create your site-to-site VPN, you need to update the routes manually. Details on how to do that vary per gateway and are not described here. Also, you cannot have BGP configured with a site-to-site VPN connection.

> [!NOTE]
> The VNet Integration feature doesn't integrate an app with a VNet that has an ExpressRoute Gateway. Even if the ExpressRoute Gateway is configured in [coexistence mode][VPNERCoex] the VNet Integration doesn't work. If you need to access resources through an ExpressRoute connection, then you can use an [App Service Environment][ASE], which runs in your VNet. 
> 
> 

## Peering
You can use VNet Integration to access resources in VNets that are peered to the VNet you are connected to. To configure peering to work with your app:

1. Add a peering connection on the VNet your app connects to. When adding the peering connection, enable **Allow virtual network access** and check **Allow forwarded traffic** and **Allow gateway transit**.
1. Add a peering connection on the VNet that is being peered to the VNet you are connected to. When adding the peering connection on the destination VNet, enable **Allow virtual network access** and check **Allow forwarded traffic** and **Allow remote gateways**.
1. Go to the App Service plan > Networking > VNet Integration UI in the portal.  Select the VNet your app connects to. Under the routing section, add the address range of the VNet that is peered with the VNet your app is connected to.  


## Pricing details
There are three related charges to the use of the VNet Integration feature:

* ASP pricing tier requirements
* Data transfer costs
* VPN Gateway costs.

Your apps need to be in a Standard, Premium, or PremiumV2 App Service Plan. You can see more details on those costs here: [App Service Pricing][ASPricing]. 

There is a charge for data egress, even if the VNet is in the same data center. Those charges are described in [Data Transfer Pricing Details][DataPricing]. 

There is a cost to the VNet gateway that is required for the point-to-site VPN. The details are on the [VPN Gateway Pricing][VNETPricing] page.

## Troubleshooting
While the feature is easy to set up, that doesn't mean that your experience will be problem free. Should you encounter problems accessing your desired endpoint there are some utilities you can use to test connectivity from the app console. There are two consoles that you can use. One is the Kudu console and the other is the console in the Azure portal. To reach the Kudu console from your app, go to Tools -> Kudu. This is the same as going to [sitename].scm.azurewebsites.net. Once that opens, go to the Debug console tab. To get to the Azure portal hosted console then from your app go to Tools -> Console. 

#### Tools
The tools **ping**, **nslookup** and **tracert** won’t work through the console due to security constraints. To fill the void,  two separate tools added. In order to test DNS functionality, we added a tool named nameresolver.exe. The syntax is:

    nameresolver.exe hostname [optional: DNS Server]

You can use **nameresolver** to check the hostnames that your app depends on. This way you can test if you have anything mis-configured with your DNS or perhaps don't have access to your DNS server.

The next tool allows you to test for TCP connectivity to a host and port combination. This tool is called **tcpping** and the syntax is:

    tcpping.exe hostname [optional: port]

The **tcpping** utility tells you if you can reach a specific host and port. It only can show success if: there is an application listening at the host and port combination, and there is network access from your app to the specified host and port.

#### Debugging access to VNet hosted resources
There are a number of things that can prevent your app from reaching a specific host and port. Most of the time it is one of three things:

* **A firewall is in the way.** If you have a firewall in the way, you will hit the TCP timeout. The TCP timeout is 21 seconds in this case. Use the **tcpping** tool to test connectivity. TCP timeouts can be due to many things beyond firewalls but start there. 
* **DNS isn't accessible.** The DNS timeout is three seconds per DNS server. If you have two DNS servers, the timeout is 6 seconds. Use nameresolver to see if DNS is working. Remember you can't use nslookup as that doesn't use the DNS your VNet is configured with.
* **The point-to-site address range is invalid.** The point-to-site IP range needs to be in the RFC 1918 private IP ranges (10.0.0.0-10.255.255.255 / 172.16.0.0-172.31.255.255 / 192.168.0.0-192.168.255.255). If the range uses IPs outside of that, then things won't work. 

If those items don't answer your problem, look first for the simple things like: 

* Does the Gateway show as being up in the portal?
* Do certificates show as being in sync?
* Did anybody change the network configuration without doing a "Sync Network" in the affected ASPs? 

If your gateway is down, then bring it back up. If your certificates are out of sync, then go to the ASP view of your VNet Integration and hit "Sync Network". If you suspect that there has been a change made to your VNet configuration that wasn't synced with your ASPs, then hit "Sync Network".  A "Sync Network" operation will restart any apps in the ASP that are integrated with that VNet. 

If all of that is fine, then you need to dig in a bit deeper:

* Are there any other apps using VNet Integration to reach resources in the same VNet? 
* Can you go to the app console and use tcpping to reach any other resources in your VNet? 

If either of the above are true, then your VNet Integration is fine and the problem is somewhere else. This is where it gets to be more of a challenge because there is no simple way to see why you can't reach a host:port. Some of the causes include:

* you have a firewall up on your host preventing access to the application port from your point to site IP range. Crossing subnets often requires Public access.
* your target host is down
* your application is down
* you had the wrong IP or hostname
* your application is listening on a different port than what you expected. You can match your process ID with the listening port by using "netstat -aon" on the endpoint host. 
* your network security groups are configured in such a manner that they prevent access to your application host and port from your point to site IP range

Remember that you don't know what IP in your Point-to-Site IP range that your app will use so you need to allow access from the entire range. 

Additional debug steps include:

* connect to a VM in your VNet and attempt to reach your resource host:port from there. To test for TCP access, use the PowerShell command **test-netconnection**. The syntax is:

      test-netconnection hostname [optional: -Port]

* bring up an application on a VM and test access to that host and port from the console from your app

#### On-premises resources ####

If your app cannot reach a resource on-premises, then check if you can reach the resource from your VNet. Use the **test-netconnection** PowerShell command to check for TCP access. If your VM can't reach your on-premises resource, then make sure your Site to Site VPN connection is working. If it is working, then check the same things noted earlier as well as the on-premises gateway configuration and status. 

If your VNet hosted VM can reach your on-premises system but your app can't, then the cause is likely one of the following reasons:

* your routes are not configured with your point to site IP ranges in your on-premises gateway
* your network security groups are blocking access for your Point-to-Site IP range
* your on-premises firewalls are blocking traffic from your Point-to-Site IP range


## PowerShell automation

You can integrate App Service with an Azure Virtual Network using PowerShell. For a ready-to-run script, see [Connect an app in Azure App Service to an Azure Virtual Network](https://gallery.technet.microsoft.com/scriptcenter/Connect-an-app-in-Azure-ab7527e3).

## Hybrid Connections and App Service Environments
There are three features that enable access to VNet hosted resources. They are:

* VNet Integration
* Hybrid Connections
* App Service Environments

Hybrid Connections requires you to install a relay agent called the Hybrid Connection Manager(HCM) in your network. The HCM needs to be able to connect to Azure and also to your application. Hybrid Connections doesn't require an inbound internet accessible endpoint for your remote network, as is required for a VPN connection. The HCM only runs on Windows and you can have up to five instances running to provide high availability. Hybrid Connections only supports TCP though and each HC endpoint has to match to a specific host:port combination. 

The App Service Environment feature allows you to run a single tenant instance of the Azure App Service in your VNet. If your apps are in an App Service Environment, then your apps can access resources in your VNet without any extra steps. With and App Service Environment your apps run on more powerful workers and can scale up to 100 ASP instances. App Service Environments work with all of the networking features including ExpressRoute and Service Endpoints.  

While there is some use case overlap, none of these features can replace any of the others. Knowing what feature to use is tied to your needs. For example:

* If you are a developer and want to run a site in Azure that can access a database on the workstation under your desk, then the easiest thing to use is Hybrid Connections. 
* If you are a large organization that wants to put a large number of web properties in the public cloud and manage them in your own network, then you want to go with the App Service Environment. 
* If you have multiple apps that need to access resources in your VNet, then VNet Integration is the way to go. 

When your VNet is already connected to your on-premises network, then using VNet Integration or an App Service Environment is an easy way to consume on-premises resources. If your VNet isn't connected to your on-premises network, then it's a lot more overhead to set up a site to site VPN with your VNet compared with installing the HCM. 

Beyond the functional differences, there are also pricing differences. The App Service Environment feature is a Premium service offering but offers the most network configuration possibilities in addition to other great features. VNet Integration can be used with Standard or Premium ASPs and is perfect for securely consuming resources in your VNet from the multi-tenant App Service. Hybrid Connections currently depends on a BizTalk account, which has pricing levels that start free and then get progressively more expensive based on the amount you need. When it comes to working across many networks though, there is no other feature like Hybrid Connections, which can enable you to access resources in well over 100 separate networks. 

## New VNet Integration ##

There is a new version of the VNet Integration capability that doesn't depend on Point-to-Site VPN technology. Unlike the pre-existing feature, the new Preview feature will work with ExpressRoute and Service Endpoints. 

The new capability is only available from newer Azure App Service scale units. If you can scale to PremiumV2, then you are in a newer App Service scale unit. The VNet Integration UI in the portal will tell you if your app can use the new VNet Integration feature. 

The new version is in Preview and has the following characteristics.

* No gateway is required to use the new VNet Integration feature
* You can access resources across ExpressRoute connections without any additional configuration beyond integrating with the ExpressRoute connected VNet.
* The app and the VNet must be in the same region
* The new feature requires an unused subnet in your Resource Manager VNet.
* Your App Service plan must be a Standard, Premium, or PremiumV2 plan
* Production workloads are not supported on the new feature while it is in Preview
* Your app must be in an Azure App Service deployment that is capable of scaling up to Premium v2.
* The new VNet Integration feature doesn't work for apps in an App Service Environment.
* You cannot delete a VNet with an integrated app.  
* Route tables and global peering are not yet available with the new VNet Integration.  
* One address is used for each App Service plan instance. Since subnet size cannot be changed after assignment, use a subnet that can more than cover your maximum scale size. A /27 with 32 addresses is the recommended size as that would accommodate an App Service plan that is scaled to 20 instances.  You can consume Service Endpoint secured resources using the new VNet Integration capability. To do so, enable service endpoints on the subnet used for VNet Integration.

To use the new feature:

1. Go to the Networking UI in the portal. If your app is able to use the new feature, then you will see a capability to use the new preview feature.  

 ![Select the new preview VNet Integration][6]

1. Select **Add VNet (preview)**.  

1. Select the Resource Manager VNet that you want to integrate with and then either create a new subnet or pick an empty pre-existing subnet. The integration takes less than a minute to complete. During the integration, your app is restarted.  When integration is completed, you will see details on the VNet you are integrated with and a banner at the top that tells you the feature is in preview.

 ![Select the VNet and subnet][7]

To enable your app to use the DNS server that your VNet is configured with, create an Application setting for your app where the name is WEBSITE_DNS_SERVER and the value is the IP address of the server.  If you have a secondary DNS server, then create another Application setting where the name is WEBSITE_DNS_ALT_SERVER and the value is the IP address of the server. 

To disconnect your app from the VNet, select **Disconnect**. This will restart your web app. 

The new VNet Integration feature enables you to use service endpoints.  To use service endpoints with your app, use the new VNet Integration to connect to a selected VNet and then configure service endpoints on the subnet you used for the integration. 

<!--Image references-->
[1]: ./media/web-sites-integrate-with-vnet/vnetint-app.png
[2]: ./media/web-sites-integrate-with-vnet/vnetint-addvnet.png
[3]: ./media/web-sites-integrate-with-vnet/vnetint-howitworks.png
[4]: ./media/web-sites-integrate-with-vnet/vnetint-details.png
[5]: ./media/web-sites-integrate-with-vnet/vnetint-aspdetails.png
[6]: ./media/web-sites-integrate-with-vnet/vnetint-newvnet.png
[7]: ./media/web-sites-integrate-with-vnet/vnetint-newvnetdetails.png
[8]: ./media/web-sites-integrate-with-vnet/vnetint-selectvnet.png

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
[creategatewaysubnet]: https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal#gatewaysubnet
[creategateway]: https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal#creategw
[setp2saddresses]: https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal#addresspool
