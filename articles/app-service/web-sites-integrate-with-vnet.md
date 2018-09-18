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
ms.date: 09/24/2018
ms.author: ccompy

---
# Integrate your app with an Azure Virtual Network
This document describes the Azure App Service virtual network integration feature and shows how to set it up with apps in [Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714). If you are unfamiliar with Azure Virtual Networks (VNets), this is a capability that allows you to place many of your Azure resources in a non-internet routeable network that you control access to. These networks can then be connected to your on-premises networks using a variety of VPN technologies. To learn more about Azure Virtual Networks, start with the information here: [Azure Virtual Network Overview][VNETOverview]. 

The Azure App Service has two forms. 

1. The multi-tenant systems that support the full range of pricing plans
2. The App Service Environment (ASE) premium feature, which deploys into your VNet. 

This document goes through VNet Integration and not App Service Environment. If you want to learn more about the ASE feature, start with the information here: [App Service Environment introduction][ASEintro].

VNet Integration gives your web app access to resources in your virtual network but does not grant private access to your web app from the virtual network. Private site access refers to making your app only accessible from a private network such as from within an Azure virtual network. Private site access is only available with an ASE configured with an Internal Load Balancer (ILB). For details on using an ILB ASE, start with the article here: [Creating and using an ILB ASE][ILBASE]. 

A common scenario where you would use VNet Integration is enabling access from your web app to a database or a web service running on a virtual machine in your Azure virtual network. With VNet Integration, you don't need to expose a public endpoint for applications on your VM but can use the private non-internet routable addresses instead. 

The VNet Integration feature:

* requires a Standard, Premium, or Isolated pricing plan 
* works with Classic or Resource Manager VNet 
* supports TCP and UDP
* works with Web, Mobile, API apps, and Function apps
* enables an app to connect to only 1 VNet at a time
* enables up to five VNets to be integrated with in an App Service Plan 
* allows the same VNet to be used by multiple apps in an App Service Plan
* supports a 99.9% SLA due to the SLA on the VNet Gateway

There are some things that VNet Integration does not support including:

* mounting a drive
* AD integration 
* NetBios
* private site access

### Getting started
Here are some things to keep in mind before connecting your web app to a virtual network:

* VNet Integration only works with apps in a **Standard**, **Premium**, or **Isolated** pricing plan. If you enable the feature, and then scale your App Service Plan to an unsupported pricing plan your apps lose their connections to the VNets they are using. 
* If your target virtual network already exists, it must have point-to-site VPN enabled with a Dynamic routing gateway before it can be connected to an app. If your gateway is configured with Static routing, you cannot enable point-to-site Virtual Private Network (VPN).
* The VNet must be in the same subscription as your App Service Plan(ASP).
* If your gateway already exists with point-to-site enabled, and it is not in the basic SKU, IKEV2 must be disabled in your point-to-site configuration.
* The apps that integrate with a VNet use the DNS that is specified for that VNet.
* By default your integrating apps only route traffic into your VNet based on the routes that are defined in your VNet. 

## Enabling VNet Integration

You have the option to connect your app to a new or existing virtual network. If you create a new network as a part of your integration, then in addition to just creating the VNet, a dynamic routing gateway is pre-configured for you and Point-to-Site VPN is enabled. 

> [!NOTE]
> Configuring a new virtual network integration can take several minutes. 
> 
> 

To enable VNet Integration, open your app settings and select Networking. The UI that opens up offers three networking choices. This guide is only going into VNet Integration though Hybrid Connections and App Service Environments are discussed later in this document. 

If your app is not in the correct pricing plan, the UI enables you to scale your plan to a higher pricing plan of your choice.

![][1]

### Enabling VNet Integration with a pre-existing VNet
The VNet Integration UI allows you to select from a list of your VNets. The Classic VNets indicate that they are such with the word "Classic" in parentheses next to the VNet name. The list is sorted such that the Resource Manager VNets are listed first. In the image shown below, you can see that only one VNet can be selected. There are multiple reasons that a VNet can be grayed out including:

* the VNet is in another subscription that your account has access to
* the VNet does not have Point-to-Site enabled
* the VNet does not have a dynamic routing gateway

![][2]

To enable integration, click on the VNet you wish to integrate with. After you select the VNet, your app is automatically restarted for the changes to take effect. 

##### Enable Point-to-Site in a Classic VNet

If your VNet does not have a gateway nor has Point-to-Site, then you have to set that up first. To configure a gateway for a Classic VNet, go to the portal and bring up the list of Virtual Networks(classic). Select the network you want to integrate with. Select VPN Connections. From here, you can create your point to site VPN and even have it create a gateway. The gateway takes roughly 30 minutes to come up.

![][8]

##### Enabling Point-to-Site in a Resource Manager VNet
To configure a Resource Manager VNet with a gateway and Point-to-Site, you can use either PowerShell as documented here, [Configure a Point-to-Site connection to a virtual network using PowerShell][V2VNETP2S] or use the Azure portal as documented here, [Configure a Point-to-Site connection to a VNet using the Azure portal][V2VNETPortal]. The UI to perform this capability is not yet available. 
You don't need to create certificates for the Point-to-Site configuration. Certificates are automatically created when you connect your WebApp to the VNet using the portal. 

### Creating a pre-configured VNet
If you want to create a new VNet that is configured with a gateway and Point-to-Site, then the App Service networking UI has the capability to do that but only for a Resource Manager VNet. If you wish to create a Classic VNet with a gateway and Point-to-Site, then you need to do this manually through the Networking user interface. 

To create a Resource Manager VNet through the VNet Integration UI, select **Create New Virtual Network** and provide the:

* Virtual Network Name
* Virtual Network Address Block
* Subnet Name
* Subnet Address Block
* Gateway Address Block
* Point-to-Site Address Block

If you want this VNet to connect to any other networks, then you should avoid picking IP address space that overlaps with those networks. 

> [!NOTE]
> Resource Manager VNet creation with a gateway takes about 30 minutes and currently does not integrate the VNet with your app. After your VNet is created with the gateway, you need to come back to your app VNet Integration UI and select your new VNet.
> 
> 

![][3]

Azure VNets normally are created within private network addresses. By default the VNet Integration feature routes any traffic destined for those IP address ranges into your VNet. The private IP address ranges are:

* 10.0.0.0/8 - this is the same as 10.0.0.0 - 10.255.255.255
* 172.16.0.0/12 - this is the same as 172.16.0.0 - 172.31.255.255 
* 192.168.0.0/16 - this is the same as 192.168.0.0 - 192.168.255.255

The VNet address space needs to be specified in CIDR notation. If you are unfamiliar with CIDR notation, it is a method for specifying address blocks using an IP address and an integer that represents the network mask. As a quick reference, consider that 10.1.0.0/24 would be 256 addresses and 10.1.0.0/25 would be 128 addresses. An IPv4 address with a /32 would be just 1 address. 

If you set the DNS server information here, then that is set for your VNet. After VNet creation you can edit this information from the VNet user experiences. If you change the DNS of the VNet, then you need to perform a Sync Network operation.

When you create a Classic VNet using the VNet Integration UI, it creates a VNet in the same resource group as your app. 

## How the system works
Under the covers this feature builds on top of Point-to-Site VPN technology to connect your app to your VNet. Apps in Azure App Service have a multi-tenant system architecture, which precludes provisioning an app directly in a VNet as is done with virtual machines. By building on point-to-site technology we limit network access to just the virtual machine hosting the app. Access to the network is further restricted on the app hosts so that your apps can only access the networks that you configure them to access. 

![][4]

If you haven’t configured a DNS server with your virtual network, your app will need to use IP addresses to reach resource in the VNet. While using IP addresses, remember that the major benefit of this feature is that it enables you to use the private addresses within your private network. If you set your app up to use public IP addresses for one of your VMs, then you aren't using the VNet Integration feature and are communicating over the internet.

## Managing the VNet Integrations
The ability to connect and disconnect to a VNet is at an app level. Operations that can affect the VNet Integration across multiple apps are at an ASP level. From the UI that is shown at the app level, you can get details on your VNet. Most of the same information is also shown at the ASP level. 

![][5]

From the Network Feature Status page, you can see if your app is connected to your VNet. If your VNet gateway is down for whatever reason, then this would show as not-connected. 

The information you now have available to you in the app level VNet Integration UI is the same as the detail information you get from the ASP. Here are those items:

* VNet Name - This link opens the Azure virtual network UI
* Location - This reflects the location of your VNet. It is possible to integrate with a VNet in another location.
* Certificate Status - There are certificates used to secure the VPN connection between the app and the VNet. This reflects a test to ensure they are in sync.
* Gateway Status - Should your gateways be down for whatever reason then your app cannot access resources in the VNet. 
* VNet address space - This is the IP address space for your VNet. 
* Point-to-Site address space - This is the point to site IP address space for your VNet. Your app shows communication as coming from one of the IPs in this address space. 
* Site to site address space - You can use Site to Site VPNs to connect your VNet to your on-premises resources or to other VNet. Should you have that configured then the IP ranges defined with that VPN connection shows here.
* DNS Servers - If you have DNS Servers configured with your VNet, then they are listed here.
* IPs routed to the VNet - There are a list of IP addresses that your VNet has routing defined for, and those addresses show here. 

The only operation you can take in the app view of your VNet Integration is to disconnect your app from the VNet it is currently connected to. To disconnect your app from a VNet, disconnect at the top. This action does not change your VNet. The VNet and its configuration including the gateways remains unchanged. If you then want to delete your VNet, you need to first delete the resources in it including the gateways. 

The App Service Plan view has a number of additional operations. It is also accessed differently than from the app. To reach the ASP Networking UI, open your ASP UI and scroll down. Select "Network Feature Status" to open the Network Feature Status UI. Select "Click here to manage" to list the VNet Integrations in this ASP.

![][6]

The location of the ASP is good to remember when looking at the locations of the VNets you are integrating with. When the VNet is in another location you are far more likely to see latency issues. 

The VNets integrated with is a reminder on how many VNets your apps are integrated with in this ASP and how many you can have. 

To see added details on each VNet, just click on the VNet you are interested in. In addition to the details that were noted earlier, you can also see a list of the apps in this ASP that are using that VNet. 

With respect to actions there are two primary actions. The first is the ability to add routes that drive traffic leaving your app into your VNet. The second action is the ability to sync certificates and network information.

![][7]

**Routing** 
As noted earlier the routes that are defined in your VNet are what is used for directing traffic into your VNet from your app. There are some uses though where customers want to send additional outbound traffic from an app into the VNet and for them this capability is provided. What happens to the traffic after that is up to how the customer configures their VNet. 

**Certificates**
The Certificate Status reflects a check being performed by the App Service to validate that the certificates that we are using for the VPN connection are still good. When VNet Integration enabled, then if this is the first integration to that VNet from any apps in this ASP, there is a required exchange of certificates to ensure the security of the connection. Along with the certificates we get the DNS configuration, routes and other similar things that describe the network.
If those certificates or network information is changed, then you need to click "Sync Network". **NOTE**: When you click "Sync Network" then you cause a brief outage in connectivity between your app and your VNet. While your app is not restarted, the loss of connectivity could cause your site to not function properly. 

## Accessing on-premises resources
One of the benefits of the VNet Integration feature is that if your VNet is connected to your on-premises network with a Site to Site VPN then your apps can have access to your on-premises resources from your app. For this to work though you may need to update your on-premises VPN gateway with the routes for your Point-to-Site IP range. When the Site to Site VPN is first set up then the scripts used to configure it should set up routes including your Point-to-Site VPN. If you add the Point-to-Site VPN after you create your Site to Site VPN, then you need to update the routes manually. Details on how to do that vary per gateway and are not described here. 

> [!NOTE]
> The VNet Integration feature does not integrate an app with a VNet that has an ExpressRoute Gateway. Even if the ExpressRoute Gateway is configured in [coexistence mode][VPNERCoex] the VNet Integration does not work. If you need to access resources through an ExpressRoute connection, then you can use an [App Service Environment][ASE], which runs in your VNet.
> 
> 

## Pricing details
There are a few pricing nuances that you should be aware of when using the VNet Integration feature. There are 3 related charges to the use of this feature:

* ASP pricing tier requirements
* Data transfer costs
* VPN Gateway costs.

For your apps to be able to use this feature, they need to be in a Standard or Premium App Service Plan. You can see more details on those costs here: [App Service Pricing][ASPricing]. 

Due to how Point-to-Site VPNs are handled, you always have a charge for outbound data through your VNet Integration connection even if the VNet is in the same data center. To see what those charges are, take a look here: [Data Transfer Pricing Details][DataPricing]. 

The last item is the cost of the VNet gateways. If you don't need the gateways for something else such as Site to Site VPNs, then you are paying for gateways to support the VNet Integration feature. There are details on those costs here: [VPN Gateway Pricing][VNETPricing]. 

## Troubleshooting
While the feature is easy to set up, that doesn't mean that your experience will be problem free. Should you encounter problems accessing your desired endpoint there are some utilities you can use to test connectivity from the app console. There are two console experiences you can use. One is from the Kudu console and the other is the console that you can reach in the Azure portal. To get to the Kudu console from your app go to Tools -> Kudu. This is the same as going to [sitename].scm.azurewebsites.net. Once that opens, go to the Debug console tab. To get to the Azure portal hosted console then from your app go to Tools -> Console. 

#### Tools
The tools **ping**, **nslookup** and **tracert** won’t work through the console due to security constraints. To fill the void there have been two separate tools added. In order to test DNS functionality we added a tool named nameresolver.exe. The syntax is:

    nameresolver.exe hostname [optional: DNS Server]

You can use **nameresolver** to check the hostnames that your app depends on. This way you can test if you have anything mis-configured with your DNS or perhaps don't have access to your DNS server.

The next tool allows you to test for TCP connectivity to a host and port combination. This tool is called **tcpping** and the syntax is:

    tcpping.exe hostname [optional: port]

The **tcpping** utility tells you if you can reach a specific host and port. It only can show success if: there is an application listening at the host and port combination, and there is network access from your app to the specified host and port.

#### Debugging access to VNet hosted resources
There are a number of things that can prevent your app from reaching a specific host and port. Most of the time it is one of three things:

* **There is a firewall in the way** If you have a firewall in the way, you will hit the TCP timeout. That is 21 seconds in this case. Use the **tcpping** tool to test connectivity. TCP timeouts can be due to many things beyond firewalls but start there. 
* **DNS is not accessible** The DNS timeout is three seconds per DNS server. If you have two DNS servers, the timeout is 6 seconds. Use nameresolver to see if DNS is working. Remember you can't use nslookup as that does not use the DNS your VNet is configured with.
* **Invalid P2S IP range** The point to site IP range needs to be in the RFC 1918 private IP ranges (10.0.0.0-10.255.255.255 / 172.16.0.0-172.31.255.255 / 192.168.0.0-192.168.255.255). If the range uses IPs outside of that, then things won't work. 

If those items don't answer your problem, look first for the simple things like: 

* Does the Gateway show as being up in the portal?
* Do certificates show as being in sync?
* Did anybody change the network configuration without doing a "Sync Network" in the affected ASPs? 

If your gateway is down, then bring it back up. If your certificates are out of sync, then go to the ASP view of your VNet Integration and hit "Sync Network". If you suspect that there has been a change made to your VNet configuration and it wasn't sync'd with your ASPs, then go to the ASP view of your VNet Integration and hit "Sync Network" Just as a reminder, this causes a brief outage with your VNet connection and your apps. 

If all of that is fine, then you need to dig in a bit deeper:

* Are there any other apps using VNet Integration to reach resources in the same VNet? 
* Can you go to the app console and use tcpping to reach any other resources in your VNet? 

If either of the above are true, then your VNet Integration is fine and the problem is somewhere else. This is where it gets to be more of a challenge because there is no simple way to see why you can't reach a host:port. Some of the causes include:

* you have a firewall up on your host preventing access to the application port from your point to site IP range. Crossing subnets often requires Public access.
* your target host is down
* your application is down
* you had the wrong IP or hostname
* your application is listening on a different port than what you expected. You can check this by going onto that host and using "netstat -aon" from the cmd prompt. This shows you what process ID is listening on what port. 
* your network security groups are configured in such a manner that they prevent access to your application host and port from your point to site IP range

Remember that you don't know what IP in your Point-to-Site IP range that your app will use so you need to allow access from the entire range. 

Additional debug steps include:

* connect to a VM in your VNet and attempt to reach your resource host:port from there. To test for TCP access use the PowerShell command **test-netconnection**. The syntax is:

      test-netconnection hostname [optional: -Port]

* bring up an application on a VM and test access to that host and port from the console from your app

#### On-premises resources ####

If your app cannot reach a resource on-premises, then check if you can reach the resource from your VNet. Use the **test-netconnection** PowerShell command to do this. If your VM can't reach your on-premises resource, then make sure your Site to Site VPN connection is working. If it is working, then check the same things noted earlier as well as the on-premises gateway configuration and status. 

If your VNet hosted VM can reach your on-premises system but your app can't then the reason is likely one of the following:

* your routes are not configured with your point to site IP ranges in your on-premises gateway
* your network security groups are blocking access for your Point-to-Site IP range
* your on-premises firewalls are blocking traffic from your Point-to-Site IP range
* you have a User Defined Route(UDR) in your VNet that prevents your Point-to-Site based traffic from reaching your on-premises network

## PowerShell automation

You can integrate App Service with an Azure Virtual Network using PowerShell. For a ready-to-run script, see [Connect an app in Azure App Service to an Azure Virtual Network](https://gallery.technet.microsoft.com/scriptcenter/Connect-an-app-in-Azure-ab7527e3).

## Hybrid Connections and App Service Environments
There are three features that enable access to VNet hosted resources. They are:

* VNet Integration
* Hybrid Connections
* App Service Environments

Hybrid Connections requires you to install a relay agent called the Hybrid Connection Manager(HCM) in your network. The HCM needs to be able to connect to Azure and also to your application. This solution is especially great from a remote network such as your on-premises network or even another cloud hosted network because it does not require an internet accessible endpoint. The HCM only runs on Windows and you can have up to five instances running to provide high availability. Hybrid Connections only supports TCP though and each HC endpoint has to match to a specific host:port combination. 

The App Service Environment feature allows you to run an instance of the Azure App Service in your VNet. This lets your apps access resources in your VNet without any extra steps. Some of the other benefits of an App Service Environment are that you can use Dv2 based workers with up to 14 GB of RAM. Another benefit is that you can scale the system to meet your needs. Unlike the multi-tenant environments where your ASP is limited to 20 instances, in an ASE you can scale up to 100 ASP instances. One of the things you get with an ASE that you don't with VNet Integration is that an App Service Environment can work with an ExpressRoute VPN. 

While there is some use case overlap, none of these features can replace any of the others. Knowing what feature to use is tied to your needs. For example:

* If you are a developer and want to run a site in Azure and have it access the database on the workstation under your desk, then the easiest thing to use is Hybrid Connections. 
* If you are a large organization that wants to put a large number of web properties in the public cloud and manage them in your own network, then you want to go with the App Service Environment. 
* If you have multiple apps that need to access resources in your VNet, then VNet Integration is the way to go. 

If your VNet is already connected to your on-premises network, then using VNet Integration or an App Service Environment is an easy way to consume on-premises resources. If your VNet is not connected to your on-premises network, then it's a lot more overhead to set up a site to site VPN with your VNet compared with installing the HCM. 

Beyond the functional differences, there are also pricing differences. The App Service Environment feature is a Premium service offering but offers the most network configuration possibilities in addition to other great features. VNet Integration can be used with Standard or Premium ASPs and is perfect for securely consuming resources in your VNet from the multi-tenant App Service. Hybrid Connections currently depends on a BizTalk account, which has pricing levels that start free and then get progressively more expensive based on the amount you need. When it comes to working across many networks though, there is no other feature like Hybrid Connections, which can enable you to access resources in well over 100 separate networks. 

## New VNet Integration ##

There is a new version of the VNet Integration capability that does not depend on Point-to-Site VPN technology. This new version is in Preview. The new VNet Integration capability has the following characteristics.

- The new feature requires an unused subnet in your Resource Manager VNet
- One address is used for each App Service plan instance. Since subnet size cannot be changed after assignment, use a subnet  that can more than cover your maximum scale size. A /27 with 32 addresses is the recommended size as that would accommodate an App Service plan that is scaled to 20 instances.
- You can consume Service Endpoint secured resources by using the new VNet Integration capability. Enable access from the subnet assigned to your app to configure Service Endpoints with your app,
- You can access resources across ExpressRoute connections without any additional configuration
- No gateway is required to use the new VNet Integration feature
- Your App Service plan must be a Standard, Premium or PremiumV2 plan
- The new capability is only available from newer Azure App Service scale units. The portal will tell you if your app can use the new VNet Integration feature. 
- The app and the VNet must be in the same region

The new VNet Integration feature is initially only available in North Europe and East US regions.


<!--Image references-->
[1]: ./media/web-sites-integrate-with-vnet/vnetint-upgradeplan.png
[2]: ./media/web-sites-integrate-with-vnet/vnetint-existingvnet.png
[3]: ./media/web-sites-integrate-with-vnet/vnetint-createvnet.png
[4]: ./media/web-sites-integrate-with-vnet/vnetint-howitworks.png
[5]: ./media/web-sites-integrate-with-vnet/vnetint-appmanage.png
[6]: ./media/web-sites-integrate-with-vnet/vnetint-aspmanage.png
[7]: ./media/web-sites-integrate-with-vnet/vnetint-aspmanagedetail.png
[8]: ./media/web-sites-integrate-with-vnet/vnetint-vnetp2s.png

<!--Links-->
[VNETOverview]: http://azure.microsoft.com/documentation/articles/virtual-networks-overview/ 
[AzurePortal]: http://portal.azure.com/
[ASPricing]: http://azure.microsoft.com/pricing/details/app-service/
[VNETPricing]: http://azure.microsoft.com/pricing/details/vpn-gateway/
[DataPricing]: http://azure.microsoft.com/pricing/details/data-transfers/
[V2VNETP2S]: http://azure.microsoft.com/documentation/articles/vpn-gateway-howto-point-to-site-rm-ps/
[ASEintro]: environment/intro.md
[ILBASE]: environment/create-ilb-ase.md
[V2VNETPortal]: ../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md
[VPNERCoex]: ../expressroute/expressroute-howto-coexist-resource-manager.md
[ASE]: environment/intro.md
