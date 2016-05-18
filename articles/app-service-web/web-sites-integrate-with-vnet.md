<properties 
	pageTitle="Integrate an app with an Azure Virtual Network" 
	description="Shows you how to connect an app in Azure App Service to a new or existing Azure virtual network" 
	services="app-service" 
	documentationCenter="" 
	authors="ccompy" 
	manager="wpickett" 
	editor="cephalin"/>

<tags 
	ms.service="app-service" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/13/2016" 
	ms.author="ccompy"/>

# Integrate your app with an Azure Virtual Network #

This document describes the Azure App Service virtual network integration feature and shows how to set it up with apps in [Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714).  If you are unfamiliar with Azure Virtual Networks (VNETs), this is a capability that allows you to place many of your Azure resources in a non-internet routeable network that you control access to.  These networks can then be connected to your on premise networks using a variety of VPN technologies.  To learn more about Azure Virtual Networks start with the information here: [Azure Virtual Network Overview][VNETOverview].  

The Azure App Service has two forms.  

1. The multi-tenant systems that support the full range of pricing plans
1. The App Service Environment (ASE) premium feature which deploys into your VNET.  

This article does not describe putting an ASE in a V2 VNET.  That is still not yet supported and is unrelated to this article.  This article is about enabling your apps to consume resources in a V1 or V2 VNET.

VNET Integration gives your web app access to resources in your virtual network but does not grant private access to your web app from the virtual network.  A common scenario where you would use this feature is enabling your web app access to a database or a web services that are running in a virtual machine in your Azure virtual network.  With VNET Integration you don't need to expose a public endpoint for applications on your VM but can use the private non-internet routable addresses instead.  

The VNET Integration feature:

- requires a Standard or Premium pricing plan 
- will work with V1(Classic) or V2(Resource Manager) VNET 
- supports TCP and UDP
- works with Web, Mobile and API apps
- enables an app to connect to only 1 VNET at a time
- enables up to 5 VNETs to be integrated with in an App Service Plan 
- allows the same VNET to be used by multiple apps in an App Service Plan
- supports a 99.9% SLA due to a reliance on the VNET Gateway

There are some things that VNET Integration does not support including:

- mounting a drive
- AD integration 
- NetBios
- private site access

### Getting started ###
Here are some things to keep in mind before connecting your web app to a virtual network:

- VNET Integration only works with apps in a **Standard** or **Premium** pricing plan.  If you enable the feature and then scale your App Service Plan to an unsupported pricing plan your apps will lose their connections to the VNETs they are using.  
- If your target virtual network already exists, it must have point-to-site VPN enabled with a Dynamic routing gateway before it can be connected to an app.  You cannot enable point-to-site Virtual Private Network (VPN) if your gateway is configured with Static routing.
- The VNET must be in the same subscription as your App Service Plan(ASP).  
- The apps that integrate with a VNET will use the DNS that is specified for that VNET.
- By default your integrating apps will only route traffic into your VNET based on the routes that are defined in your VNET.  


## Enabling VNET Integration ##

This document is focused primarily on using the Azure Portal for VNET Integration.  To enable VNET Integration with your app using PowerShell, follow the directions here: [Connect your app to your virtual network by using PowerShell][IntPowershell].

You have the option to connect your app to a new or existing virtual network.  If you create a new network as a part of your integration then in addition to just creating the VNET, a dynamic routing gateway will be pre-configured for you and Point to Site VPN will be enabled.  

>[AZURE.NOTE] Configuring a new virtual network integration can take several minutes.  

To enable VNET Integration open your app Settings and then select Networking.  The UI that opens up offers three networking choices.  This guide is only going into VNET Integration though Hybrid Connections and App Service Environments are discussed later in this document.  

If your app is not in the correct pricing plan the UI will helpfully enable you to scale your plan to a higher pricing plan of your choice.


![][1]
 
###Enabling VNET Integration with a pre-existing VNET###
The VNET Integration UI allows you to select from a list of your VNETs.  The V1 VNETs will indicate that they are such with the word "Classic" in parenthesis next to the VNET name.  The list is sorted such that the V2 VNETs are listed first.  In the image shown below you can see that only one VNET can be selected.  There are multiple reasons that a VNET will be greyed out including:

- the VNET is in another subscription that your account has access to
- the VNET does not have Point to Site enabled
- the VNET does not have a dynamic routing gateway


![][2]

To enable integration simply click on the VNET you wish to integrate with.  After you select the VNET, your app will be automatically restarted for the changes to take effect.  

##### Enable Point to Site in a V1 VNET #####
If your VNET does not have a gateway nor has Point to Site then you have to set that up first.  To do this for a V1 VNET, go to the [Azure Portal][AzurePortal] and bring up the list of Virtual Networks(classic).  From here click on the network you want to integrate with and click on the big box under Essentials called VPN Connections.  From here you can create your point to site VPN and even have it create a gateway.  After you go through the point to site with gateway creation experience it will be about 30 minutes before it is ready.  

![][8]

##### Enabling Point to Site in a V2 VNET #####

To configure a V2 VNET with a gateway and Point to Site you need to use PowerShell as documented here, [Configure a Point-to-Site connection to a virtual network using PowerShell][V2VNETP2S].  The UI to perform this capability is not yet available. 

### Creating a pre-configured VNET ###
If you want to create a new VNET that is configured with a gateway and Point-to-Site, then the App Service networking UI has the capability to do that but only for a V2 VNET.  If you wish to create a V1 VNET with a gateway and Point-to-Site then you need to do this manually through the Networking user interface. 

To create a V2 VNET through the VNET Integration UI, simply select **Create New Virtual Network** and provide the:

- Virtual Network Name
- Virtual Network Address Block
- Subnet Name
- Subnet Address Block
- Gateway Address Block
- Point-to-Site Address Block

If you want this VNET to connect to any of your other network then you should avoid picking IP address space that overlaps with those networks.  

>[AZURE.NOTE] V2 VNET creation with a gateway takes about 30 minutes and currently will not integrate the VNET with your app.  After your VNET is created with the gateway you need to come back to your app VNET Integration UI and select your new VNET.

![][3]

Azure VNETs normally are created within private network addresses.  By default the VNET Integration feature will route any traffic destined for those IP address ranges into your VNET.  The private IP address ranges are:

- 10.0.0.0/8 - this is the same as 10.0.0.0 - 10.255.255.255
- 172.16.0.0/12 - this is the same as 172.16.0.0 - 172.31.255.255 
- 192.168.0.0/16 - this is the same as 192.168.0.0 - 192.168.255.255
 
The VNET address space needs to be specified in CIDR notation.  If you are unfamiliar with CIDR notation, it is a method for specifying address blocks using an IP address and an integer that represents the network mask. As a quick reference, consider that 10.1.0.0/24 would be 256 addresses and 10.1.0.0/25 would be 128 addresses.  An IPv4 address with a /32 would be just 1 address.  

If you set the DNS server information here then that will be set for your VNET.  After VNET creation you can edit this information from the VNET user experiences.

When you create a V1 VNET using the VNET Integration UI, it will create a VNET in the same resource group as your app. 

## How the system works ##
Under the covers this feature builds on top of Point-to-Site VPN technology to connect your app to your VNET.   Apps in Azure App Service have a multi-tenant system architecture which precludes provisioning an app directly in a VNET as is done with virtual machines.  By building on point-to-site technology we limit network access to just the virtual machine hosting the app.  Access to the network is further restricted on those app hosts so that your apps can only access the networks that you configure them to access.  

![][4]
 
If you haven’t configured a DNS server with your virtual network you will need to use IP addresses.  While using IP addresses, remember that the major benefit of this feature is that it enables you to use the private addresses within your private network.  If you set your app up to use public IP addresses for one of your VMs then you aren't using the VNET Integration feature and are communicating over the internet.


##Managing the VNET Integrations##

The ability to connect and disconnect to a VNET is at an app level.  Operations that can affect the VNET Integration across multiple apps are at an ASP level.  From the UI that is shown at the app level you can get  details on your VNET.  Most of the same information is also shown at the ASP level.  

![][5]

From the Network Feature Status page you can see if your app is connected to your VNET.  If your VNET gateway is down for whatever reason then this would show as not-connected.  

The information you now have available to you in the app level VNET Integration UI is the same as the detail  information you get from the ASP.  Here are those items:

- VNET Name - This link opens the the network UI
- Location - This reflects the location of your VNET.  It is possible to integrate with a VNET in another location.
- Certificate Status - There are certificates used to secure the VPN connection between the app and the VNET.  This reflects a test to ensure they are in sync.
- Gateway Status - Should your gateways be down for whatever reason then your app cannot access resources in the VNET.  
- VNET address space - This is the IP address space for your VNET.  
- Point to Site address space - This is the point to site IP address space for your VNET.  Your app will show communication as coming from one of the IPs in this address space.  
- Site to site address space - You can use Site to Site VPNs to connect your VNET to your on premise resources or to other VNETs.  Should you have that configured then the IP ranges defined with that VPN connection will show here.
- DNS Servers - If you have DNS Servers configured with your VNET then they are listed here.
- IPs routed to the VNET - There are a list of IP addresses that your VNET has routing defined for.  Those addresses will show here.  

The only operation you can take in the app view of your VNET Integration is to disconnect your app from the VNET it is currently connected to.  To do this simply click Disconnect at the top.  This action does not change your VNET.  The VNET and it's configuration including the gateways remains unchanged.  If you then want to delete your VNET you need to first delete the resources in it including the gateways.  

The App Service Plan view has a number of additional operations.  It is also accessed differently than from the app.  To reach the ASP Networking UI simply open your ASP UI and scroll down.  There is a UI element called Network Feature Status.  It will give some minor details around your VNET Integration.  Clicking on this UI opens the Network Feature Status UI.  If you then click on "Click here to manage" you will open up UI that lists the VNET Integrations in this ASP.

![][6]

The location of the ASP is good to remember when looking at the locations of the VNETs you are integrating with.  When the VNET is in another location you are far more likely to see latency issues.  

The VNETs integrated with is a reminder on how many VNETs your apps are integrated with in this ASP and how many you can have.  

To see added details on each VNET, just click on the VNET you are interested in.  In addition to the details that were noted earlier you will also see a list of the apps in this ASP that are using that VNET.  

With respect to actions there are two primary actions.  The first is the ability to add routes that drive traffic leaving your app into your VNET.  The second action is the ability to sync certificates and network information.

![][7]

**Routing** 
As noted earlier the routes that are defined in your VNET are what is used for directing traffic into your VNET from your app.  There are some uses though where customers want to send additional outbound traffic from an app into the VNET and for them this capability is provided.  What happens to the traffic after that is up to how the customer configures their VNET.  

**Certificates**
The Certificate Status reflects a check being performed by the App Service to validate that the certificates that we are using for the VPN connection are still good.  When VNET Integration enabled, then if this is the first integration to that VNET from any apps in this ASP, there is a required exchange of certificates to ensure the security of the connection.  Along with the certificates we get the DNS configuration, routes and other similar things that describe the network.
If those certificates or network information is changed then you will need to click "Sync Network".  **NOTE**: When you click "Sync Network" then you will cause a brief outage in connectivity between your app and your VNET.  While your app will not be restarted the loss of connectivity could cause your site to not function properly.  

##Accessing on premise resources##

One of the benefits of the VNET Integration feature is that if your VNET is connected to your on premise network with a Site to Site VPN then your apps can have access to your on premise resources from your app.  For this to work though you may need to update your on premise VPN gateway with the routes for your Point to Site IP range.  When the Site to Site VPN is first set up then the scripts used to configure it should set up routes including your Point to Site VPN.  If you add the Point to Site VPN after your create your Site to Site VPN then you will need to update the routes manually.  Details on how to do that will vary per gateway and are not described here.  

>[AZURE.NOTE] While the VNET Integration feature will work with a Site to Site VPN to access on premise resources it currently will not work with an ExpressRoute VPN to do the same.  This is true when integrating with either a V1 or V2 VNET.  If you need to access resources through an ExpressRoute VPN then you can use an ASE which can run in your VNET. 

##Pricing details##
There are a few pricing nuances that you should be aware of when using the VNET Integration feature.  There are 3 related charges to the use of this feature:

- ASP pricing tier requirements
- Data transfer costs
- VPN Gateway costs.

For your apps to be able to use this feature, they need to be in a Standard or Premium App Service Plan.  You can see more details on those costs here: [App Service Pricing][ASPricing]. 

Due to the way Point to Site VPNs are handled, you always have a charge for outbound data through your VNET Integration connection even if the VNET is in the same data center.  To see what those charges are take a look here: [Data Transfer Pricing Details][DataPricing].  

The last item is the cost of the VNET gateways.  If you don't need the gateways for something else such as Site to Site VPNs then you are paying for gateways to support the VNET Integration feature.  There are details on those costs here: [VPN Gateway Pricing][VNETPricing].  

##Troubleshooting##

While the feature is easy to set up that doesn't mean that your experience will be problem free.  Should you encounter problems accessing your desired endpoint there are some utilities you can use to test connectivity from the app console.  There are two console experiences you can use.  One is from the Kudu console and the other is the console that you can reach in the Azure Portal.  To get to the Kudu console from your app go to Tools -> Kudu.  This is the same as going to [sitename].scm.azurewebsites.net.  Once that opens simply go to the Debug console tab.  To get to the Azure portal hosted console then from your app go to Tools -> Console.  


####Tools####

The tools ping, nslookup and tracert won’t work through the console due to security constraints.  To fill the void there have been two separate tools added.  In order to test DNS functionality we added a tool named nameresolver.exe.  The syntax is:

    nameresolver.exe hostname [optional: DNS Server]

You can use nameresolver to check the hostnames that your app depends on.  This way you can test if you have anything mis-configured with your DNS or perhaps don't have access to your DNS server.

The next tool allows you to test for TCP connectivity to a host and port combination.  This tool is called  tcpping.exe and the syntax is:

    tcpping.exe hostname [optional: port]

This tool will tell you if you can reach a specific host and port but will not perform the same task you get with the ICMP based ping utility.  The ICMP ping utility will tell you if your host is up.  With tcpping you find out if you can access a specific port on a host.  


####Debugging access to VNET hosted resources####

There are a number of things that can prevent your app from reaching a specific host and port.  To break the problem down start with the easy things like:  

- Does the Gateway show as being up in the Portal?
- Do certificates show as being in sync?
- Did anybody change the network configuration without doing a "Sync Network" in the affected ASPs?

If your gateway is down then bring it back up.  If your certificates are out of sync then go to the ASP view of your VNET Integration and hit "Sync Network".  If you suspect that there has been a change made to your VNET configuration and it wasn't sync'd with your ASPs then go to the ASP view of your VNET Integration and hit "Sync Network"  Just as a reminder, this will cause a brief outage with your VNET connection and your apps.  

If all of that is fine then you need to dig in a bit deeper:

- Are there any other apps using this VNET successfully to reach a remote resource? 
- Can you go to the app console and use tcpping to reach any resources in your VNET?  

If either of the above are true then your VNET Integration is fine and the problem is somewhere else.  You also may simply not have an answer from the above two items because you don't have something else in your VNET to hit.  This is where it gets to be more of a challenge because there is no simple way to see why you can't reach a host:port.  Some of the causes include:

- your target host is down
- your application is down
- you had the wrong IP or hostname
- your application is listening on a different port than what you expected.  You can check this by going onto that host and using "netstat -aon" from the cmd prompt.  This will show you what process ID is listening on what port.  
- you have a firewall up on your host preventing access to the application port from your point to site IP range
- your network security groups are configured in such a manner that they prevent access to your application host and port from your point to site IP range

Remember that you don't know what IP in your Point to Site IP range that your app will use so you need to allow access from the entire range.  

Additional debug steps include:

- log onto another VM in your VNET and attempt to reach your resource host:port from there.  There are some TCP ping utilities that you can use for this purpose or can even use telnet if need be.  The purpose here is just to determine if connectivity is there from this other VM. 
- bring up an application on another VM and test access to that host and port from the console from your app  

####On premise resources####
If your cannot reach resources on premise then the first thing you should check is if you can reach a resource in your VNET.  If that is working then the next steps are pretty easy.  From a VM in your VNET you need to try to reach the on premise application.  You can use telnet or a TCP ping utility.  If your VM can't reach your on premise resource then first make sure your Site to Site VPN connection is working.  If it is working then check the same things noted earlier as well as the on premise gateway configuration and status.  

Now if your VNET hosted VM can reach your on premise system but your app can't then the reason is likely one of the following:
- your routes are not configured with your point to site IP ranges in your on premise gateway
- your network security groups are blocking access for your Point to Site IP range
- your on premise firewalls are blocking traffic from your Point to Site IP range
- you have a User Defined Route(UDR) in your VNET that prevents your Point to Site based traffic from reaching your on premise network

## Hybrid Connections and App Service Environments##
There are 3 features that enable access to VNET hosted resources.  They are:

- VNET Integration
- Hybrid Connections
- App Service Environments

Hybrid Connections requires you to install a relay agent called the Hybrid Connection Manager(HCM) in your network.  The HCM needs to be able to connect to Azure and also to your application.  This solution is especially great from a remote network such as your on premise network or even another cloud hosted network because it does not require an internet accessible endpoint.  The HCM only runs on Windows and you can have up to 5 instances running to provide high availability.  Hybrid Connections only supports TCP though and each HC endpoint has to match to a specific host:port combination.  

The App Service Environment feature allows you to run an instance of the Azure App Service in your VNET.  This lets your apps access resources in your VNET without any extra steps.  Some of the other benefits of an App Service Environment is that you can use 8 core dedicated workers with 14 GB of RAM.  Another benefit is that you can scale the system to meet your needs.  Unlike the multi-tenant environments where your ASP is limited in size, in an ASE you control how many resources you want to give to the system.  With respect to the network focus of this document though, one of the things you get with an ASE that you don't with VNET Integration is that it can work with an ExpressRoute VPN.  

While there is some use case overlap, none of these feature can replace any of the others.  Knowing what feature to use is tied to your needs and how you will want to use it.  For example:

- If you are a developer and simply want to run a site in Azure and have it access the database on the workstation under your desk then the easiest thing to use is Hybrid Connections.  
- If you are a large organization that wants to put a large number of web properties in the public cloud and manage them in your own network then you want to go with the App Service Environment.  
- If you have a number of App Service hosted apps and simply want to access resources in your VNET then VNET Integration is the way to go.  

Beyond the use cases there are some simplicity related aspects.  If your VNET is already connected to your on premise network then using VNET Integration or an App Service Environment is an easy way to consume on premise resources.  On the other hand, if your VNET is not connected to your on premise network then it's a lot more overhead to set up a site to site VPN with your VNET compared with installing the HCM.  

Beyond the functional differences there are also pricing differences.  The App Service Environment feature is a Premium service offering but offers the most network configuration possibilities in addition to other great features.  VNET Integration can be used with Standard or Premium ASPs and is perfect for securely consuming resources in your VNET from the multi-tenant App Service.  Hybrid Connections currently depends on a BizTalk account which has pricing levels that start free and then get progressively more expensive based on the amount you need.  When it comes to working across many networks though, there is no other feature like Hybrid Connections which can enable you to access resources in well over 100 separate networks.    


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
[IntPowershell]: http://azure.microsoft.com/documentation/articles/app-service-vnet-integration-powershell/
