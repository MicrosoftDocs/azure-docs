<properties 
	pageTitle="Network Architecture Overview of App Service Environments" 
	description="Architectural overview of network topology ofApp Service Environments." 
	services="app-service" 
	documentationCenter="" 
	authors="stefsch" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/13/2016" 
	ms.author="stefsch"/>	

# Network Architecture Overview of App Service Environments

## Introduction ##
App Service Environments are always created within a subnet of a [virtual network][virtualnetwork] - apps running in an App Service Environment can communicate with private endpoints located within the same virtual network topology.  Since customers may lock down parts of their virtual network infrastructure, it is important to understand the types of network communication flows that occur with an App Service Environment.

## General Network Flow ##
 
When an App Service Environment (ASE) uses a public virtual IP address (VIP) for apps, all inbound traffic arrives on that public VIP.  This includes HTTP and HTTPS traffic for apps, as well as other traffic for FTP, remote debugging functionality, and Azure management operations.  For a full list of the specific ports (both required and optional) that are available on the public VIP see the article on [controlling inbound traffic][controllinginboundtraffic] to an App Service Environment. 

App Service Environments also support running apps that are bound only to a virtual network internal address, also referred to as an ILB (internal load balancer) address.  On an ILB enabled ASE, HTTP and HTTPS traffic for apps as well as remote debugging calls, arrive on the ILB address.  For most common ILB-ASE configurations, FTP/FTPS traffic will also arrive on the ILB address.  However Azure management operations will still flow to ports 454/455 on the public VIP of an ILB enabled ASE.

The diagram below shows an overview of the various inbound and outbound network flows for an App Service Environment where the apps are bound to a public virtual IP address:

![General Network Flows][GeneralNetworkFlows]

An App Service Environment can communicate with a variety of private customer endpoints.  For example, apps running in the App Service Environment can connect to database server(s) running on IaaS virtual machines in the same virtual network topology.

>[AZURE.IMPORTANT] Looking at the network diagram, the "Other Compute Resources" are deployed in a different Subnet from the App Service Environment. Deploying resources in the same Subnet with the ASE will block connectivity from ASE to those resources (except for specific intra-ASE routing). Deploy to a different Subnet instead (in the same VNET). The App Service Environment will then be able to connect. No additional configuration is necessary.

App Service Environments also communicate with Sql DB and Azure Storage resources necessary for managing and operating an App Service Environment.  Some of the Sql and Storage resources that an App Service Environment communicates with are located in the same region as the App Service Environment, while others are located in remote Azure regions.  As a result, outbound connectivity to the Internet is always required for an App Service Environment to function properly. 

Since an App Service Environment is deployed in a subnet, network security groups can be used to control inbound traffic to the subnet.  For details on how to control inbound traffic to an App Service Environment, see the following [article][controllinginboundtraffic].

For details on how to allow outbound Internet connectivity from an App Service Environment, see the following article about working with [Express Route][ExpressRoute].  The same approach described in the article applies when working with Site-to-Site connectivity and using forced tunneling.

## Outbound Network Addresses ##
When an App Service Environment makes outbound calls, an IP Address is always associated with the outbound calls.  The specific IP address that is used depends on whether the endpoint being called is located within the virtual network topology, or outside of the virtual network topology.

If the endpoint being called is **outside** of the virtual network topology, then the outbound address (aka the outbound NAT address) that is used is the public VIP of the App Service Environment.  This address can be found in the portal user interface for the App Service Environment in Properties blade.
 
![Outbound IP Address][OutboundIPAddress]

This address can also be determined for ASEs that only have a public VIP by creating an app in the App Service Environment, and then performing an *nslookup* on the app's address. The resultant IP address is both the public VIP, as well as the App Service Environment's outbound NAT address.

If the endpoint being called is **inside** of the virtual network topology, the outbound address of the calling app will be the internal IP address of the individual compute resource running the app.  However there is not a persistent mapping of virtual network internal IP addresses to apps.  Apps can move around across different compute resources, and the pool of available compute resources in an App Service Environment can change due to scaling operations.

However, since an App Service Environment is always located within a subnet, you are guaranteed that the internal IP address of a compute resource running an app will always lie within the CIDR range of the subnet.  As a result, when fine-grained ACLs or network security groups are used to secure access to other endpoints within the virtual network, the subnet range containing the App Service Environment needs to be granted access.

The following diagram shows these concepts in more detail:

![Outbound Network Addresses][OutboundNetworkAddresses]

In the above diagram:

- Since the public VIP of the App Service Environment is 192.23.1.2, that is the outbound IP address used when making calls to "Internet" endpoints.
- The CIDR range of the containing subnet for the App Service Environment is 10.0.1.0/26.  Other endpoints within the same virtual network infrastructure will see calls from apps as originating from somewhere within this address range.

## Calls Between App Service Environments ##
A more complex scenario can occur if you deploy multiple App Service Environments in the same virtual network, and make outbound calls from one App Service Environment to another App Service Environment.  These types of cross App Service Environment calls will also be treated as "Internet" calls.

The following diagram shows an example of a layered architecture with apps on one App Service Environment (e.g. "Front door" web apps) calling apps on a second App Service Environment (e.g. internal back-end API apps not intended to be accessible from the Internet). 

![Calls Between App Service Environments][CallsBetweenAppServiceEnvironments] 

In the example above the App Service Environment "ASE One" has an outbound IP address of 192.23.1.2.  If an app running on this App Service Environment makes an outbound call to an app running on a second App Service Environment ("ASE Two") located in the same virtual network, the outbound call will be treated as an "Internet" call.  As a result the network traffic arriving on the second App Service Environment will show as originating from 192.23.1.2 (i.e. not the subnet address range of the first App Service Environment).

Even though calls between different App Service Environments are treated as "Internet" calls, when both App Service Environments are located in the same Azure region the network traffic will remain on the regional Azure network and will not physically flow over the public Internet.  As a result you can use a network security group on the subnet of the second App Service Environment to only allow inbound calls from the first App Service Environment (whose outbound IP address is 192.23.1.2), thus ensuring secure communication between the App Service Environments.

## Additional Links and Information ##
All articles and How-To's for App Service Environments are available in the [README for Application Service Environments](../app-service/app-service-app-service-environments-readme.md).

Details on inbound ports used by App Service Environments and using network security groups to control inbound traffic is available [here][controllinginboundtraffic].

Details on using user defined routes to grant outbound Internet access to App Service Environments is available in this [article][ExpressRoute]. 


<!-- LINKS -->
[virtualnetwork]: http://azure.microsoft.com/services/virtual-network/
[controllinginboundtraffic]:  http://azure.microsoft.com/documentation/articles/app-service-app-service-environment-control-inbound-traffic/
[ExpressRoute]:  http://azure.microsoft.com/documentation/articles/app-service-app-service-environment-network-configuration-expressroute/

<!-- IMAGES -->
[GeneralNetworkFlows]: ./media/app-service-app-service-environment-network-architecture-overview/NetworkOverview-1.png
[OutboundIPAddress]: ./media/app-service-app-service-environment-network-architecture-overview/OutboundIPAddress-1.png
[OutboundNetworkAddresses]: ./media/app-service-app-service-environment-network-architecture-overview/OutboundNetworkAddresses-1.png
[CallsBetweenAppServiceEnvironments]: ./media/app-service-app-service-environment-network-architecture-overview/CallsBetweenEnvironments-1.png

