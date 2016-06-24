<properties
   pageTitle="Azure Network Security Best Practices | Microsoft Azure"
   description="This article provides a set of best practices for network security using built in Azure capabilities."
   services="security"
   documentationCenter="na"
   authors="TomShinder"
   manager="swadhwa"
   editor="TomShinder"/>

<tags
   ms.service="security"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/25/2016"
   ms.author="TomSh"/>

# Azure Network Security Best Practices

Microsoft Azure enables you to connect virtual machines and appliances to other networked devices by placing them on Azure Virtual Networks. An Azure Virtual Network is a virtual network construct that allows you to connect virtual network interface cards to a virtual network to allow TCP/IP-based communications between network enabled devices. Azure Virtual Machines connected to an Azure Virtual Network are able to connect to devices on the same Azure Virtual Network, different Azure Virtual Networks, on the Internet or even on your own on-premises networks.

In this article we will discuss a collection of Azure network security best practices. These best practices are derived from our experience with Azure networking and the experiences of customers like yourself.

For each best practice, we’ll explain:

- What the best practice is
- Why you want to enable that best practice
- What might be the result if you fail to enable the best practice
- Possible alternatives to the best practice
- How you can learn to enable the best practice

This Azure Network Security Best Practices article is based on a consensus opinion, and Azure platform capabilities and feature sets, as they exist at the time this article was written. Opinions and technologies change over time and this article will be updated on a regular basis to reflect those changes.

Azure Network security best practices discussed in this article include:

- Logically segment subnets
- Control routing behavior
- Enable Forced Tunneling
- Use Virtual network appliances
- Deploy DMZs for security zoning
- Avoid exposure to the Internet with dedicated WAN links
- Optimize uptime and performance
- Use global load balancing
- Disable RDP Access to Azure Virtual Machines
- Enable Azure Security Center
- Extend your datacenter into Azure


## Logically segment subnets

[Azure Virtual Networks](https://azure.microsoft.com/documentation/services/virtual-network/) are similar to a LAN on your on-premises network. The idea behind an Azure Virtual Network is that you create a single private IP address space-based network on which you can place all your [Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/). The private IP address spaces available are in the Class A (10.0.0.0/8), Class B (172.16.0.0/12) and Class C (192.168.0.0/16) ranges.

Similar to what you do on-premises, you’ll want to segment the larger address space into subnets. You can use [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) based subnetting principles to create your subnets.

Routing between subnets will happen automatically and you do not need to manually configure routing tables. However, the default setting is that there are no network access controls between the subnets you create on the Azure Virtual Network. In order to create network access controls between subnets, you’ll need to put something between the subnets.

One of the things you can use to accomplish this task is a [Network Security Group](../virtual-network/virtual-networks-nsg.md) (NSG). NSGs are simple stateful packet inspection devices that use the 5-tuple (the source IP, source port, destination IP, destination port, and layer 4 protocol) approach to create allow/deny rules for network traffic. You can allow or deny traffic to and from single IP address, to and from multiple IP addresses or even to and from entire subnets.

Using NSGs for network access control between subnets enables you to put resources that belong to the same security zone or role in their own subnets. For example, think of a simple 3-tier application that has a web tier, an application logic tier and a database tier. You put virtual machines that belong to each of these tiers into their own subnets. Then you use NSGs to control traffic between the subnets:

- Web tier virtual machines can only initiate connections to the application logic machines and can only accept connections from the Internet
- Application logic virtual machines can only initiate connections with database tier and can only accept connections from the web tier
- Database tier virtual machines cannot initiate connection with anything outside of their own subnet and can only accept connections from the application logic tier

To learn more about Network Security Groups and how you can use them to logically segment your Azure Virtual Networks, please read the article [What is a Network Security Group](../virtual-network/virtual-networks-nsg.md) (NSG).

## Control routing behavior

When you put a virtual machine on an Azure Virtual Network, you’ll notice that the virtual machine can connect to any other virtual machine on the same Azure Virtual Network, even if the other virtual machines are on different subnets. The reason why this is possible is that there is a collection of system routes that are enabled by default that allow this type of communication. These default routes allow virtual machines on the same Azure Virtual Network to initiate connections with each other, and with the Internet (for outbound communications to the Internet only).

While the default system routes are useful for many deployment scenarios, there are times when you want to customize the routing configuration for your deployments. These customizations will allow you to configure the next hop address to reach specific destinations.

We recommend that you configure User Defined Routes when you deploy a virtual network security appliance, which we’ll talk about in a later best practice.

> [AZURE.NOTE] user Defined Routes are not required and the default system routes will work in most instances.

You can learn more about User Defined Routes and how to configure them by reading the article [What are User Defined Routes and IP Forwarding](../virtual-network/virtual-networks-udr-overview.md).

## Enable Forced Tunneling

To better understand forced tunneling, it’s useful to understand what “split tunneling” is.
The most common example of split tunneling is seen with VPN connections. Imagine that you establish a VPN connection from your hotel room to your corporate network. This connection allows you to connect to resources on your corporate network and all communications to resources on your corporate network go through the VPN tunnel.

What happens when you want to connect to resources on the Internet? When split tunneling is enabled, those connections go directly to the Internet and not through the VPN tunnel. Some security experts consider this to be a potential risk and therefore recommend that split tunneling be disabled and all connections, those destined for the Internet and those destined for corporate resources, go through the VPN tunnel. The advantage of doing this is that connections to the Internet are then forced through the corporate network security devices, which wouldn’t be the case if the VPN client connected to the Internet outside of the VPN tunnel.

Now let’s bring this back to virtual machines on an Azure Virtual Network. The default routes for an Azure Virtual Network allow virtual machines to initiate traffic to the Internet. This too can represent a security risk, as these outbound connections could increase the attack surface of a virtual machine and be leveraged by attackers.
For this reason, we recommend that you enable forced tunneling on your virtual machines when you have cross-premises connectivity between your Azure Virtual Network and your on-premises network. We will talk about cross premises connectivity later in this Azure networking best practices document.

If you do not have a cross premises connection, make sure you take advantage of Network Security Groups (discussed earlier) or Azure virtual network security appliances (discussed next) to prevent outbound connections to the Internet from your Azure Virtual Machines.

To learn more about forced tunneling and how to enable it, please read the article [Configure Forced Tunneling using PowerShell and Azure Resource Manager](../vpn-gateway/vpn-gateway-forced-tunneling-rm.md).

## Use virtual network appliances

While Network Security Groups and User Defined Routing can provide a certain measure of network security at the network and transport layers of the [OSI model](https://en.wikipedia.org/wiki/OSI_model), there are going to be situations where you’ll want or need to enable security at high levels of the stack. In such situations, we recommend that you deploy virtual network security appliances provided by Azure partners.

Azure network security appliances can deliver significantly enhanced levels of security over what is provided by network level controls. Some of the network security capabilities provided by virtual network security appliances include:

- Firewalling
- Intrusion detection/Intrusion Prevention
- Vulnerability management
- Application control
- Network-based anomaly detection
- Web filtering
- Antivirus
- Botnet protection

If you require a higher level of network security than you can obtain with network level access controls, then we recommend that you investigate and deploy Azure virtual network security appliances.

To learn about what Azure virtual network security appliances are available, and about their capabilities, please visit the [Azure Marketplace](https://azure.microsoft.com/marketplace/) and search for “security” and “network security”.

##Deploy DMZs for security zoning
A DMZ or “perimeter network” is a physical or logical network segment that is designed to provide an additional layer of security between your assets and the Internet. The intent of the DMZ is to place specialized network access control devices on the edge of the DMZ network so that only desired traffic is allowed past the network security device and into your Azure Virtual Network.

DMZs are useful because you can focus your network access control management, monitoring, logging and reporting on the devices at the edge of your Azure Virtual Network. Here you would typically enable DDoS prevention, Intrusion Detection/Intrusion Prevention systems (IDS/IPS), firewall rules and policies, web filtering, network antimalware and more. The network security devices sit between the Internet and your Azure Virtual Network and have an interface on both networks.

While this is the basic design of a DMZ, there are many different DMZ designs, such as back-to-back, tri-homed, multi-homed, and others.

We recommend for all high security deployments that you consider deploying a DMZ to enhance the level of network security for your Azure resources.

To learn more about DMZs and how to deploy them in Azure, please read the article [Microsoft Cloud Services and Network Security](../best-practices-network-security.md).

## Avoid exposure to the Internet with dedicated WAN links
Many organizations have chosen the Hybrid IT route. In hybrid IT, some of the company’s information assets are in Azure, while others remain on-premises. In many cases some components of a service will be running in Azure while other components remain on-premises.

In the hybrid IT scenario, there is usually some type of cross-premises connectivity. This cross-premises connectivity allows the company to connect their on-premises networks to Azure Virtual Networks. There are two cross-premises connectivity solutions available:

- Site-to-site VPN
- ExpressRoute

[Site-to-site VPN](../vpn-gateway/vpn-gateway-site-to-site-create.md) represents a virtual private connection between your on-premises network and an Azure Virtual Network. This connection takes place over the Internet and allows you to “tunnel” information inside an encrypted link between your network and Azure. Site-to-site VPN is a secure, mature technology that has been deployed by enterprises of all sizes for decades. Tunnel encryption is performed using [IPsec tunnel mode](https://technet.microsoft.com/library/cc786385.aspx).

While site-to-site VPN is a trusted, reliable, and established technology, traffic within the tunnel does traverse the Internet. In addition, bandwidth is relatively constrained to a maximum of about 200Mbps.

If you require an exceptional level of security or performance for your cross-premises connections, we recommend that you use Azure ExpressRoute for your cross-premises connectivity. ExpressRoute is a dedicated WAN link between your on-premises location or an Exchange hosting provider. Because this is a telco connection, your data doesn’t travel over the Internet and therefore is not exposed to the potential risks inherent in Internet communications.

To learn more about how Azure ExpressRoute works and how to deploy, please read the article [ExpressRoute Technical Overview](../expressroute/expressroute-introduction.md).

## Optimize uptime and performance
Confidentiality, integrity and availability (CIA) comprise the triad of today’s most influential security model. Confidentiality is about encryption and privacy, integrity is about making sure that data is not changed by unauthorized personnel, and availability is about making sure that authorized individuals are able to access the information they are authorized to access. Failure in any one of these areas represents a potential breach in security.

Availability can be thought of as being about uptime and performance. If a service is down, information can’t be accessed. If performance is so poor as to make the data unusable, then we can consider the data to be inaccessible. Therefore, from a security perspective, we need to do whatever we can to make sure our services have optimal uptime and performance.
A popular and effective method used to enhance availability and performance is to use load balancing. Load balancing is a method of distributing network traffic across servers that are part of a service. For example, if you have front-end web servers as part of your service, you can use load balancing to distribute the traffic across your multiple front-end web servers.

This distribution of traffic increases availability because if one of the web servers becomes unavailable, the load balancer will stop sending traffic to that server and redirect traffic to the servers that are still online. Load balancing also helps performance, because the processor, network and memory overhead for serving requests is distributed across all the load balanced servers.

We recommend that you employ load balancing whenever you can, and as appropriate for your services. We’ll address appropriateness in the following sections.
At the Azure Virtual Network level, Azure provides you with three primary load balancing options:

- HTTP-based load balancing
- External load balancing
- Internal load balancing

## HTTP-based Load Balancing
HTTP-based load balancing bases decisions about what server to send connections using characteristics of the HTTP protocol. Azure has an HTTP load balancer that goes by the name of Application Gateway.

We recommend that you us Azure Application Gateway when:

- Applications that require requests from the same user/client session to reach the same back-end virtual machine. Examples of this would be shopping cart apps and web mail servers.
- Applications that want to free web server farms from SSL termination overhead by taking advantage of Application Gateway’s [SSL offload](https://f5.com/glossary/ssl-offloading) feature.
- Applications, such as a content delivery network, that require multiple HTTP requests on the same long-running TCP connection to be routed or load balanced to different back-end servers.

To learn more about how Azure Application Gateway works and how you can use it in your deployments, please read the article [Application Gateway Overview](../application-gateway/application-gateway-introduction.md).

## External Load Balancing
External load balancing takes place when incoming connections from the Internet are load balanced among your servers located in an Azure Virtual Network. The Azure External Load balancer can provide you this capability and we recommend that you use it when you don’t require the sticky sessions or SSL offload.

In contrast to HTTP-based load balancing, the External Load Balancer uses information at the network and transport layers of the OSI networking model to make decisions on what server to load balance connection to.

We recommend that you use External Load Balancing whenever you have [stateless applications](http://whatis.techtarget.com/definition/stateless-app) accepting incoming requests from the Internet.

To learn more about how the Azure External Load Balancer works and how you can deploy it, please read the article [Get Started Creating an Internet Facing Load Balancer in Resource Manager using PowerShell](../load-balancer/load-balancer-get-started-internet-arm-ps.md).

## Internal Load Balancing
Internal load balancing is similar to external load balancing and uses the same mechanism to load balance connections to the servers behind them. The only difference is that the load balancer in this case is accepting connections from virtual machines that are not on the Internet. In most cases, the connections that are accepted for load balancing are initiated by devices on an Azure Virtual Network.

We recommend that you use internal load balancing for scenarios that will benefit from this capability, such as when you need to load balance connections to SQL Servers or internal web servers.

To learn more about how Azure Internal Load Balancing works and how you can deploy it, please read the article [Get Started Creating an Internal Load Balancer using PowerShell](../load-balancer/load-balancer-get-started-internet-arm-ps.md#update-an-existing-load-balancer).

## Use global load balancing
Public cloud computing makes it possible to deploy globally distributed applications that have components located in datacenters all over the world. This is possible on Microsoft Azure due to Azure’s global datacenter presence. In contrast to the load balancing technologies mentioned earlier, global load balancing makes it possible to make services available even when entire datacenters might become unavailable.

You can get this type of global load balancing in Azure by taking advantage of [Azure Traffic Manager](https://azure.microsoft.com/documentation/services/traffic-manager/). Traffic Manager makes is possible to load balance connections to your services based on the location of the user.

For example, if the user is making a request to your service from the EU, the connection is directed to your services located in an EU datacenter. This part of Traffic Manager global load balancing helps to improve performance because connecting to the nearest datacenter is faster than connecting to datacenters that are far away.

On the availability side, global load balancing makes sure that your service is available even if an entire datacenter should become available.

For example, if an Azure datacenter should become unavailable due to environmental reasons or due to outages (such as regional network failures), connections to your service would be rerouted to the nearest online datacenter. This global load balancing is accomplished by taking advantage of DNS policies that you can create in Traffic Manager.

We recommend that you use Traffic Manager for any cloud solution you develop that has a widely distributed scope across multiple regions and requires the highest level of uptime possible.

To learn more about Azure Traffic Manager and how to deploy it, please read the article [What is Traffic Manager](../traffic-manager/traffic-manager-overview.md).

## Disable RDP/SSH Access to Azure Virtual Machines
It is possible to reach Azure Virtual Machines using the [Remote Desktop Protocol](https://en.wikipedia.org/wiki/Remote_Desktop_Protocol) (RDP)and the [Secure Shell](https://en.wikipedia.org/wiki/Secure_Shell) (SSH) protocols. These protocols make it possible to manage virtual machines from remote locations and are standard in datacenter computing.

The potential security problem with using these protocols over the Internet is that attackers can use various [brute force](https://en.wikipedia.org/wiki/Brute-force_attack) techniques to gain access to Azure Virtual Machines. Once the attackers gain access, they can use your virtual machine as a launch point for compromising other machines on your Azure Virtual Network or even attack networked devices outside of Azure.

Because of this, we recommend that you disable direct RDP and SSH access to your Azure Virtual Machines from the Internet. After direct RDP and SSH access from the Internet is disabled, you have other options you can use to access these virtual machines for remote management:

- Point-to-site VPN
- Site-to-site VPN
- ExpressRoute

[Point-to-site VPN](../vpn-gateway/vpn-gateway-point-to-site-create.md) is another term for a remote access VPN client/server connection. A point-to-site VPN enables a single user to connect to an Azure Virtual Network over the Internet. After the point-to-site connection is established, the user will be able to use RDP or SSH to connect to any virtual machines located on the Azure Virtual Network that the user connected to via point-to-site VPN. This assumes that the user is authorized to reach those virtual machines.

Point-to-site VPN is more secure than direct RDP or SSH connections because the user has to authenticate twice before connecting to a virtual machine. First, the user needs to authenticate (and be authorized) to establish the point-to-site VPN connection; second, the user needs to authenticate (and be authorized) to establish the RDP or SSH session.

A [site-to-site VPN](../vpn-gateway/vpn-gateway-site-to-site-create.md) connects an entire network to another network over the Internet. You can use a site-to-site VPN to connect your on-premises network to an Azure Virtual Network. If you deploy a site-to-site VPN, users on your on-premises network will be able to connect to virtual machines on your Azure Virtual Network by using the RDP or SSH protocol over the site-to-site VPN connection and does not require you to allow direct RDP or SSH access over the Internet.

You can also use a dedicated WAN link to provide functionality similar to the site-to-site VPN. The main differences are 1. the dedicated WAN link doesn’t traverse the Internet, and 2. dedicated WAN links are typically more stable and performant. Azure provides you a dedicated WAN link solution in the form of [ExpressRoute](https://azure.microsoft.com/documentation/services/expressroute/).

## Enable Azure Security Center
Azure Security Center helps you prevent, detect, and respond to threats, and provides you increased visibility into, and control over, the security of your Azure resources. It provides integrated security monitoring and policy management across your Azure subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

Azure Security Center helps you optimize and monitor network security by:

- Providing network security recommendations
- Monitoring the state of your network security configuration
- Alerting you to network based threats both at the endpoint and network levels

We highly recommend that you enable Azure Security Center for all of your Azure deployments.

To learn more about Azure Security Center and how to enable it for your deployments, please read the article [Introduction to Azure Security Center](../security-center/security-center-intro.md).

## Securely extend your datacenter into Azure
Many enterprise IT organizations are looking to expand into the cloud instead of growing their on-premises datacenters. This expansion represents an extension of existing IT infrastructure into the public cloud. By taking advantage of cross-premises connectivity options it’s possible to treat your Azure Virtual Networks as just another subnet on your on-premises network infrastructure.

However, there is a lot of planning and design issues that need to be addressed first. This is especially important in the area of network security. One of the best ways to understand how you approach such a design is to see an example.

Microsoft has created the [Datacenter Extension Reference Architecture Diagram](https://gallery.technet.microsoft.com/Datacenter-extension-687b1d84#content) and supporting collateral to help you understand what such a datacenter extension would look like. This provides an example reference implementation that you can use to plan and design a secure enterprise datacenter extension to the cloud. We recommend that you review this document to get an idea of the key components of a secure solution.

To learn more about how to securely extend your datacenter into Azure, please view the video [Extending Your Datacenter to Microsoft Azure](https://www.youtube.com/watch?v=Th1oQQCb2KA).
