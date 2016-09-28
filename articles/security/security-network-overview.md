<properties
   pageTitle="Azure Network Security Overview | Microsoft Azure"
   description=" This article makes it easy for you to understand what Microsoft Azure has to offer in the area of network security. We provide basic explanations for core network security concepts and requirements and information on what Azure has to offer in each of these areas. "
   services="security"
   documentationCenter="na"
   authors="TomShinder"
   manager="MBaldwin"
   editor="TomSh"/>

<tags
   ms.service="security"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/09/2016"
   ms.author="terrylan"/>

# Azure Network Security Overview

Microsoft Azure includes a robust networking infrastructure to support your application and service connectivity requirements. Network connectivity is possible between resources located in Azure, between on-premises and Azure hosted resources, and to and from the Internet and Azure.

The goal of this article is to make it easier for you to understand what Microsoft Azure has to offer in the area of network security. Here we provide basic explanations for core network security concepts and requirements. We also provide you information on what Azure has to offer in each of these areas. There are numerous links to other content that will enable you to get a deeper understanding for the areas in which you’re interested.

This Azure Network Security Overview article will focus on the following:

- Azure networking
- Network access control
- Secure remote access and cross-premises connectivity
- Availability
- Logging
- Name resolution
- DMZ architecture
- Azure Security Center

## Azure Networking

Virtual machines need network connectivity. To support that requirement, Azure requires virtual machines to be connected to an Azure Virtual Network. An Azure Virtual Network is a logical construct built on top of the physical Azure network fabric. Each logical Azure Virtual Network is isolated from all other Azure Virtual Networks. This helps insure that network traffic in your deployments is not accessible to other Microsoft Azure customers.

Learn more:

- [Virtual Network Overview](../virtual-network/virtual-networks-overview.md)

## Network Access Control
Network access control is the act of limiting connectivity to and from specific devices or subnets within an Azure Virtual Network. The goal of network access control is to make sure that your virtual machines and services are accessible to only users and devices to which you want them accessible. Access controls are based on allow or deny decisions for connections to and from your virtual machine or service.

Azure supports several types of network access control. These include:

- Network layer control
- Route control and forced tunneling
- Virtual network security appliances

### Network Layer Control
Any secure deployment requires some measure of network access control. The goal of network access control is to make sure that your virtual machines and the network services that run on those virtual machines can communicate only with other networked devices that they need to communicate with and all other connection attempts are blocked.

If you need basic network level access control (based on IP address and the TCP or UDP protocols), then you can use Network Security Groups. A Network Security Group (NSG) is a basic stateful packet filtering firewall and it enables you to control access based on a [5-tuple](https://www.techopedia.com/definition/28190/5-tuple). NSGs do not provide application layer inspection or authenticated access controls.

Learn more:

- [Network Security Groups](../virtual-network/virtual-networks-nsg.md)

### Route Control and Forced Tunneling
The ability to control routing behavior on your Azure Virtual Networks is a critical network security and access control capability. If routing is configured incorrectly, applications and services hosted on your virtual machine may connect to devices you don’t want them to connect to, including devices owned and operated by potential attackers.

Azure networking supports the ability to customize the routing behavior for network traffic on your Azure Virtual Networks. This enables you to alter the default routing table entries in your Azure Virtual Network. Control of routing behavior helps you make sure that all traffic from a certain device or group of devices enters or leaves your Azure Virtual Network through a specific location.

For example, you might have a virtual network security appliance on your Azure Virtual Network. You want to make sure that all traffic to and from your Azure Virtual Network goes through that virtual security appliance. You can do this by configuring [User Defined Routes](../virtual-network/virtual-networks-udr-overview.md) in Azure.

[Forced tunneling](https://www.petri.com/azure-forced-tunneling) is a mechanism you can use to ensure that your services are not allowed to initiate a connection to devices on the Internet. Note that this is different from accepting incoming connections and then responding to them. Front-end web servers need to respond to request from Internet hosts, and so Internet-sourced traffic is allowed inbound to these web servers and the web servers are allowed to respond.

What you don’t want to allow is a front-end web server to initiate an outbound request. Such requests may represent a security risk because these connections could be used to download malware. Even if you do wish these front-end servers to initiate outbound requests to the Internet, you might want to force them to go through your on-premises web proxies so that you can take advantage of URL filtering and logging.

Instead, you would want to use forced tunneling to prevent this. When you enable forced tunneling, all connections to the Internet are forced through your on-premises gateway. You can configure forced tunneling by taking advantage of User Defined Routes.

Learn more:

- [What are User Defined Routes and IP Forwarding](../virtual-network/virtual-networks-udr-overview.md)

### Virtual Network Security Appliances
While Network Security Groups, User Defined Routes, and forced tunneling provide you a level of security at the network and transport layers of the [OSI model](https://en.wikipedia.org/wiki/OSI_model), there may be times when you want to enable security at levels higher than the network.

For example, your security requirements might include:

- Authentication and authorization prior to allowing access to your application
- Intrusion detection and intrusion response
- Application layer inspection for high-level protocols
- URL filtering
- Network level antivirus and antimalware
- Anti-bot protection
- Application access control
- Additional DDoS protection (above the DDoS protection provided the Azure fabric itself)

You can access these enhanced network security features by using an Azure partner solution. You can find the most current Azure partner network security solutions by visiting the [Azure Marketplace](https://azure.microsoft.com/marketplace/) and searching for “security” and “network security”.

## Secure Remote Access and Cross Premises Connectivity
Setup, configuration and management of your Azure resources needs to be done remotely. In addition, you may want to deploy [hybrid IT](http://social.technet.microsoft.com/wiki/contents/articles/18120.hybrid-cloud-infrastructure-design-considerations.aspx) solutions that have components on-premises and in the Azure public cloud. These scenarios require secure remote access.

Azure networking supports the following secure remote access scenarios:

- Connect individual workstations to an Azure Virtual Network
- Connect your on-premises network to an Azure Virtual Network with a VPN
- Connect your on-premises network to an Azure Virtual Network with a dedicated WAN link
- Connect Azure Virtual Networks to each other

### Connect Individual Workstations to an Azure Virtual Network
There may be times when you want to enable individual developers or operations personnel to manage virtual machines and services in Azure. For example, you need access to a virtual machine on an Azure Virtual Network and your security policy does not allow RDP or SSH remote access to individual virtual machines. In this case, you can use a point-to-site VPN connection.

The point-to-site VPN connection uses the [SSTP VPN](https://technet.microsoft.com/library/cc731352.aspx) protocol to enable you to set up a private and secure connection between the user and the Azure Virtual Network. Once the VPN connection is established, the user will be able to RDP or SSH over the VPN link into any virtual machine on the Azure Virtual Network (assuming that the user can authenticate and is authorized).

Learn more:

- [Configure a Point-to-Site Connection to a Virtual Network using PowerShell](../vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md)

### Connect Your On-Premises Network to an Azure Virtual Network with a VPN
You may want to connect your entire corporate network, or portions of it, to an Azure Virtual Network. This is common in hybrid IT scenarios where companies [extend their on-premises datacenter into Azure](https://gallery.technet.microsoft.com/Datacenter-extension-687b1d84). In many cases companies will host parts of a service in Azure and parts on-premises, such as when a solution includes front-end web servers in Azure and back-end databases on-premises. These kind of “cross-premises” connections also make management of Azure located resources more secure and enable scenarios such as extending Active Directory domain controllers into Azure.

One way to accomplish this is to use a [site-to-site VPN](https://www.techopedia.com/definition/30747/site-to-site-vpn). The difference between a site-to-site VPN and a point-to-site VPN is that a point-to-site VPN connects a single device to an Azure Virtual Network, while a site-to-site VPN connects an entire network (such as your on-premises network) to an Azure Virtual Network. Site-to-site VPNs to an Azure Virtual Network use the highly secure IPsec tunnel mode VPN protocol.

Learn more:

- [Create a Resource Manager VNet with a site-to-site VPN connection using the Azure Portal](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md)
- [Planning and design for VPN gateway](../vpn-gateway/vpn-gateway-plan-design.md)

### Connect Your On-premises Network to an Azure Virtual Network with a Dedicated WAN Link
Point-to-site and site-to-site VPN connections are effective for enabling cross-premises connectivity. However, some organizations consider them to have the following drawbacks:

- VPN connections move data over the Internet – this exposes these connections to potential security issues involved with moving data over a public network. In addition, reliability and availability for Internet connections cannot be guaranteed.
- VPN connections to Azure Virtual Networks may be considered bandwidth constrained for some applications and purposes, as they max out at around 200Mbps.

Organizations that need the highest level of security and availability for their cross-premises connections typically use dedicated WAN links to connect to remote sites. Azure provides you the ability to use a dedicated WAN link that you can use to connect your on-premises network to an Azure Virtual Network. This is enabled through Azure ExpressRoute.

Learn more:

- [ExpressRoute technical overview](../expressroute/expressroute-introduction.md)

### Connect Azure Virtual Networks to Each Other
It is possible for you to use many Azure Virtual Networks for your deployments. There are many reasons why you might do this. One of the reasons might be to simplify management; another might be for security reasons. Regardless of the motivation or rationale for putting resources on different Azure Virtual Networks, there may be times when you want resources on each of the networks to connect with one another.

One option would be for services on one Azure Virtual Network to connect to services on another Azure Virtual Network by “looping back” through the Internet. The connection would start on one Azure Virtual Network, go through the Internet, and then come back to the destination Azure Virtual Network. This option exposes the connection to the security issues inherent to any Internet-based communication.

A better option might be to create an Azure Virtual Network-to-Azure Virtual Network site-to-site VPN. This Azure Virtual Network-to-Azure Virtual Network site-to-site VPN uses the same [IPsec tunnel mode](https://technet.microsoft.com/library/cc786385.aspx) protocol as the cross-premises site-to-site VPN connection mentioned above.

The advantage of using an Azure Virtual Network-to-Azure Virtual Network site-to-site VPN is that the VPN connection is established over the Azure network fabric; it does not connect over the Internet. This provides you an extra layer of security compared to site-to-site VPNs that connect over the Internet.

Learn more:

- [Configure a VNet-to-VNet Connection by using Azure Resource Manager and PowerShell](../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md)

## Availability
Availability is a key component of any security program. If your users and systems can’t access what they need to access over the network, the service can be considered compromised. Azure has networking technologies that support the following high-availability mechanisms:

- HTTP-based load balancing
- Network level load balancing
- Global load balancing

Load balancing is a mechanism designed to equally distribute connections among multiple devices. The goals of load balancing are:

- Increase availability – when you load balance connections across multiple devices, one or more of the devices can become unavailable and the services running on the remaining online devices can continue to serve the content from the service
- Increase performance – when you load balance connections across multiple devices, a single device doesn’t have to take the processor hit. Instead, the processing and memory demands for serving the content is spread across multiple devices.

### HTTP-based Load Balancing
Organizations that run web-based services often desire to have an HTTP-based load balancer in front of those web services to help insure adequate levels of performance and high availability. In contrast to traditional network-based load balancers, the load balancing decisions made by HTTP-based load balancers are based on characteristics of the HTTP protocol, not on the network and transport layer protocols.

To provide you HTTP-based load balancing for your web-based services, Azure provides you the Azure Application Gateway. The Azure Application Gateway supports:

- HTTP-based load balancing – load balancing decisions are made based on characteristic special to the HTTP protocol
- Cookie-based session affinity – this capability makes sure that connections established to one of the servers behind that load balancer stays intact between the client and server. This insures stability of transactions.
- SSL offload – when a client connection is established with the load balancer, that session between the client and the load balancer is encrypted using the HTTPS (SSL/) protocol. However, in order to increase performance, you have the option to have the connection between the load balancer and the web server behind the load balancer use the HTTP (unencrypted) protocol. This is referred to as “SSL offload” because the web servers behind the load balancer don’t experience the processor overhead involved with encryption, and therefore should be able to service requests more quickly.
- URL-based content routing – this feature makes it possible for the load balancer to make decisions on where to forward connections based on the target URL. This provides a lot more flexibility than solutions that make load balancing decisions based on IP addresses.

Learn more:

- [Application Gateway Overview](../application-gateway/application-gateway-introduction.md)

### Network Level Load Balancing
In contrast to HTTP-based load balancing, network level load balancing makes load balancing decisions based on IP address and port (TCP or UDP) numbers.
You can gain the benefits of network level load balancing in Azure by using the Azure Load Balancer. Some key characteristics of the Azure Load Balancer include:

- Network level load balancing based on IP address and port numbers
- Support for any application layer protocol
- Load balances to Azure virtual machines and cloud services role instances
- Can be used for both Internet-facing (external load balancing) and non-Internet facing (internal load balancing) applications and virtual machines
- Endpoint monitoring, which is used to determine if any of the services behind the load balancer have become unavailable

Learn more:

- [Internet Facing load balancer between multiple Virtual Machines or services](../load-balancer/load-balancer-internet-overview.md)
- [Internal Load Balancer Overview](../load-balancer/load-balancer-internal-overview.md)

### Global Load Balancing
Some organizations will want the highest level of availability possible. One way to reach this goal is to host applications in globally distributed datacenters. When an application is hosted in data centers located throughout the world, it’s possible for an entire geopolitical region to become unavailable and still have the application up and running.

In addition to the availability advantages you get by hosting applications in globally distributed datacenters, you also can get performance benefits. These performance benefits can be obtained by using a mechanism that directs requests for the service to the datacenter that is nearest to the device that is making the request.

Global load balancing can provide you both of these benefits. In Azure, you can gain the benefits of global load balancing by using Azure Traffic Manager.

Learn more:

- [What is Traffic Manager?](../traffic-manager/traffic-manager-overview.md)

## Logging
Logging at a network level is a key function for any network security scenario. In Azure, you can log information obtained for Network Security Groups to get network level logging information. With NSG logging, you get information from:

- Audit logs – these logs are used to view all operations submitted to your Azure subscriptions. These logs are enabled by default and can be used within the Azure portal.
- Event logs – these logs provide information about what NSG rules were applied.
- Counter logs – these logs let you know how many times each NSG rule was applied to deny or allow traffic.

You can also use [Microsoft Power BI](https://powerbi.microsoft.com/what-is-power-bi/), a powerful data visualization tool, to view and analyze these logs.

Learn more:

- [Log Analytics for Network Security Groups (NSGs)](../virtual-network/virtual-network-nsg-manage-log.md)

## Name Resolution
Name resolution is a critical function for all services you host in Azure. From a security perspective, compromise of the name resolution function can lead to an attacker redirecting requests from your sites to an attacker’s site. Secure name resolution is a requirement for all your cloud hosted services.

There are two types of name resolution you need to address:

- Internal name resolution – internal name resolution is used by services on your Azure Virtual Networks, your on-premises networks, or both. Names used for internal name resolution are not accessible over the Internet. For optimal security, it’s important that your internal name resolution scheme is not accessible to external users.
- External name resolution – external name resolution is used by people and devices outside of your on-premises and Azure Virtual Networks. These are the names that are visible to the Internet and are used to direct connection to your cloud-based services.

For internal name resolution, you have two options:

- An Azure Virtual Network DNS server – when you create a new Azure Virtual Network, a DNS server is created for you. This DNS server can resolve the names of the machines located on that Azure Virtual Network. This DNS server is not configurable and is managed by the Azure fabric manager, thus making it a secure name resolution solution.
- Bring your own DNS server – you have the option of putting a DNS server of your own choosing on your Azure Virtual Network. This DNS server could be an Active Directory integrated DNS server, or a dedicated DNS server solution provided by an Azure partner, which you can obtain from the Azure Marketplace.

Learn more:

- [Virtual Network Overview](../virtual-network/virtual-networks-overview.md)
- [Manage DNS Servers used by a Virtual Network (VNet)](../virtual-network/virtual-networks-manage-dns-in-vnet.md)

For external DNS resolution, you have two options:

- Host your own external DNS server on-premises
- Host your own external DNS server with a service provider

Many large organizations will host their own DNS servers on-premises. They can do this because they have the networking expertise and global presence to do so.

In most cases, it’s better to host your DNS name resolution services with a service provider. These service providers have the network expertise and global presence to ensure very high availability for your name resolution services. Availability is essential for DNS services because if your name resolution services fail, no one will be able to reach your Internet facing services.

Azure provides you a highly available and performant external DNS solution in the form of Azure DNS. This external name resolution solution takes advantage of the worldwide Azure DNS infrastructure. It allows you to host your domain in Azure using the same credentials, APIs, tools, and billing as your other Azure services. As part of Azure, it also inherits the strong security controls built into the platform.

Learn more:

- [Azure DNS Overview](../dns/dns-overview.md)

## DMZ Architecture
Many enterprise organizations use DMZs to segment their networks to create a buffer-zone between the Internet and their services. The DMZ portion of the network is considered a low-security zone and no high-value assets are placed in that network segment. You’ll typically see network security devices that have a network interface on the DMZ segment and another network interface connected to a network that has virtual machines and services that accept inbound connections from the Internet.

There are a number of variations of DMZ design and the decision to deploy a DMZ, and then what type of DMZ to use if you decide to use one, is based on your network security requirements.

Learn more:

- [Microsoft Cloud Services and Network Security](../best-practices-network-security.md)

## Azure Security Center
Security Center helps you prevent, detect, and respond to threats, and provides you increased visibility into, and control over, the security of your Azure resources. It provides integrated security monitoring and policy management across your Azure subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

Azure Security Center helps you optimize and monitor network security by:

- Providing network security recommendations
- Monitoring the state of your network security configuration
- Alerting you to network based threats both at the endpoint and network levels

Learn more:

- [Introduction to Azure Security Center](../security-center/security-center-intro.md)
