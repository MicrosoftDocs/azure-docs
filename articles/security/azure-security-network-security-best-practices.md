---
title: Azure Network Security Best Practices | Microsoft Docs
description: This article provides a set of best practices for network security using built in Azure capabilities.
services: security
documentationcenter: na
author: TomShinder
manager: mbaldwin
editor: TomShinder

ms.assetid: 7f6aa45f-138f-4fde-a611-aaf7e8fe56d1
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/17/2018
ms.author: TomSh

---
# Azure Network Security Best Practices
You can connect [Azure virtual machines (VMs)](https://azure.microsoft.com/services/virtual-machines/) and appliances to other networked devices by placing them on [Azure virtual networks](https://azure.microsoft.com/documentation/services/virtual-network/). That is, you can connect virtual network interface cards to a virtual network to allow TCP/IP-based communications between network-enabled devices. Virtual machines connected to an Azure virtual network can connect to devices on the same virtual network, different virtual networks, the internet, or your own on-premises networks.

This article discusses a collection of Azure network security best practices. These best practices are derived from our experience with Azure networking and the experiences of customers like yourself.

For each best practice, this article explains:

* What the best practice is
* Why you want to enable that best practice
* What might be the result if you fail to enable the best practice
* Possible alternatives to the best practice
* How you can learn to enable the best practice

This Azure Network Security Best Practices article is based on a consensus opinion, and Azure platform capabilities and feature sets, as they exist at the time this article was written. Opinions and technologies change over time and this article will be updated on a regular basis to reflect those changes.

The following sections describe best practices for network security.

## Logically segment subnets
Azure virtual networks are similar to a LAN on your on-premises network. The idea behind an Azure virtual network is that you create a single private IP address space–based network on which you can place all your Azure virtual machines. The private IP address spaces available are in the Class A (10.0.0.0/8), Class B (172.16.0.0/12), and Class C (192.168.0.0/16) ranges.

Best practices for logically segmenting subnets include:

**Best practice**: Segment the larger address space into subnets.   
**Detail**: Use [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing)-based subnetting principles to create your subnets.

**Best practice**: Create network access controls between subnets. Routing between subnets happens automatically, and you don’t need to manually configure routing tables. By default, there are no network access controls between the subnets that you create on the Azure virtual network.   
**Detail**: Use a [network security group](../virtual-network/virtual-networks-nsg.md) (NSG). NSGs are simple, stateful packet inspection devices that use the 5-tuple (the source IP, source port, destination IP, destination port, and layer 4 protocol) approach to create allow/deny rules for network traffic. You allow or deny traffic to and from a single IP address, to and from multiple IP addresses, or to and from entire subnets.

When you use NSGs for network access control between subnets, you can put resources that belong to the same security zone or role in their own subnets.

## Control routing behavior
When you put a virtual machine on an Azure virtual network, the VM can connect to any other VM on the same virtual network, even if the other VMs are on different subnets. This is possible because a collection of system routes enabled by default allows this type of communication. These default routes allow VMs on the same virtual network to initiate connections with each other, and with the internet (for outbound communications to the internet only).

Although the default system routes are useful for many deployment scenarios, there are times when you want to customize the routing configuration for your deployments. You can configure the next-hop address to reach specific destinations.

We recommend that you configure [user-defined routes](../virtual-network/virtual-networks-udr-overview.md) when you deploy a security appliance for a virtual network. We talk about this in a later section titled [secure your critical Azure service resources to only your virtual networks](azure-security-network-security-best-practices.md#secure-your-critical-azure-service-resources-to-only-your-virtual-networks).

> [!NOTE]
> User-defined routes are not required, and the default system routes usually work.
>
>

## Enable forced tunneling
To better understand forced tunneling, it’s useful to understand what “split tunneling” is. The most common example of split tunneling is seen with virtual private network (VPN) connections. Imagine that you establish a VPN connection from your hotel room to your corporate network. This connection allows you to access corporate resources. All communications to your corporate network go through the VPN tunnel.

What happens when you want to connect to resources on the internet? When split tunneling is enabled, those connections go directly to the internet and not through the VPN tunnel. Some security experts consider this to be a potential risk. They recommend disabling split tunneling and making sure that all connections, those destined for the internet and those destined for corporate resources, go through the VPN tunnel. The advantage of disabling split tunneling is that connections to the internet are then forced through the corporate network’s security devices. That wouldn’t be the case if the VPN client connected to the internet outside the VPN tunnel.

Now let’s bring this back to VMs on an Azure virtual network. The default routes for an Azure virtual network allow VMs to initiate traffic to the internet. This too can represent a security risk, because these outbound connections might increase the attack surface of a VM and be used by attackers. For this reason, we recommend that you [enable forced tunneling](../vpn-gateway/vpn-gateway-forced-tunneling-rm.md) on your VMs when you have cross-premises connectivity between your Azure virtual network and your on-premises network. We talk about cross-premises connectivity later in the networking best practices.

If you don’t have a cross-premises connection, be sure to take advantage of NSGs (discussed earlier) or Azure virtual network security appliances (discussed next) to prevent outbound connections to the internet from your Azure virtual machines.

## Use virtual network appliances
NSGs and user-defined routing can provide a certain measure of network security at the network and transport layers of the [OSI model](https://en.wikipedia.org/wiki/OSI_model). But in some situations, you want or need to enable security at high levels of the stack. In such situations, we recommend that you deploy virtual network security appliances provided by Azure partners.

Azure network security appliances can deliver better security than what network-level controls provide. Network security capabilities of virtual network security appliances include:


* Firewalling
* Intrusion detection/intrusion prevention
* Vulnerability management
* Application control
* Network-based anomaly detection
* Web filtering
* Antivirus
* Botnet protection

To find available Azure virtual network security appliances, go to the [Azure Marketplace](https://azure.microsoft.com/marketplace/) and search for “security” and “network security.”

## Deploy perimeter networks for security zones
A [perimeter network](https://docs.microsoft.com/azure/best-practices-network-security) (also known as a DMZ) is a physical or logical network segment that provides an additional layer of security between your assets and the internet. Specialized network access control devices on the edge of a perimeter network allow only desired traffic into your virtual network.

Perimeter networks are useful because you can focus your network access control management, monitoring, logging, and reporting on the devices at the edge of your Azure virtual network. Here you typically enable distributed denial of service (DDoS) prevention, intrusion detection/intrusion prevention systems (IDS/IPS), firewall rules and policies, web filtering, network antimalware, and more. The network security devices sit between the internet and your Azure virtual network and have an interface on both networks.

Although this is the basic design of a perimeter network, there are many different designs, such as back-to-back, tri-homed, and multi-homed.

We recommend for all high security deployments that you consider using a perimeter network to enhance the level of network security for your Azure resources.

## Avoid exposure to the Internet with dedicated WAN links
Many organizations have chosen the hybrid IT route. In hybrid IT, some of the company’s information assets are in Azure, while others remain on-premises. In many cases, some components of a service are running in Azure while other components remain on-premises.

In the hybrid IT scenario, there is usually some type of cross-premises connectivity. Cross-premises connectivity allows the company to connect its on-premises networks to Azure virtual networks. Two cross-premises connectivity solutions are available:

* **Site-to-site VPN**: It’s a trusted, reliable, and established technology, but the connection takes place over the internet. Bandwidth is constrained to a maximum of about 200 Mbps. Site-to-site VPN is a desirable option in some scenarios and is discussed further in the section [Disable RDP/SSH access to virtual machines](#disable-rdpssh-access-to-virtual-machines).
* **Azure ExpressRoute**: We recommend that you use [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) for your cross-premises connectivity. ExpressRoute is a dedicated WAN link between your on-premises location or an Exchange hosting provider. Because this is a telco connection, your data doesn’t travel over the internet and therefore is not exposed to the potential risks of internet communications.

## Optimize uptime and performance
If a service is down, information can’t be accessed. If performance is so poor that the data is unusable, you can consider the data to be inaccessible. From a security perspective, you need to do whatever you can to make sure that your services have optimal uptime and performance.

A popular and effective method for enhancing availability and performance is load balancing. Load balancing is a method of distributing network traffic across servers that are part of a service. For example, if you have front-end web servers as part of your service, you can use load balancing to distribute the traffic across your multiple front-end web servers.

This distribution of traffic increases availability because if one of the web servers becomes unavailable, the load balancer stops sending traffic to that server and redirects it to the servers that are still online. Load balancing also helps performance, because the processor, network, and memory overhead for serving requests is distributed across all the load-balanced servers.

We recommend that you employ load balancing whenever you can, and as appropriate for your services. Following are scenarios at both the Azure virtual network level and the global level, along with load-balancing options for each.

**Scenario**: You have an application that:

- Requires requests from the same user/client session to reach the same back-end virtual machine. Examples of this are shopping cart apps and web mail servers.
- Accepts only a secure connection, so unencrypted communication to the server is not an acceptable option.
- Requires multiple HTTP requests on the same long-running TCP connection to be routed or load balanced to different back-end servers.

**Load-balancing option**: Use [Azure Application Gateway](../application-gateway/application-gateway-introduction.md), an HTTP web traffic load balancer. Application Gateway supports end-to-end SSL encryption and [SSL termination](../application-gateway/application-gateway-introduction.md) at the gateway. Web servers can then be unburdened from encryption and decryption overhead and traffic flowing unencrypted to the back-end servers.

**Scenario**: You need to load balance incoming connections from the internet among your servers located in an Azure virtual network. Scenarios are when you:

- Have stateless applications that accept incoming requests from the internet.
- Don’t require sticky sessions or SSL offload. Sticky sessions is a method used with Application Load Balancing, to achieve server-affinity.

**Load-balancing option**: Use the Azure portal to [create an external load balancer](../load-balancer/quickstart-create-basic-load-balancer-portal.md) that spreads incoming requests across multiple VMs to provide a higher level of availability.

**Scenario**: You need to load balance connections from VMs that are not on the internet. In most cases, the connections that are accepted for load balancing are initiated by devices on an Azure virtual network, such as SQL Server instances or internal web servers.   
**Load-balancing option**: Use the Azure portal to [create an internal load balancer](../load-balancer/quickstart-create-basic-load-balancer-powershell.md) that spreads incoming requests across multiple VMs to provide a higher level of availability.

**Scenario**: You need global load balancing because you:

- Have a cloud solution that is widely distributed across multiple regions and requires the highest level of uptime (availability) possible.
- Need the highest level of uptime possible to make sure that your service is available even if an entire datacenter becomes unavailable.

**Load-balancing option**: Use Azure Traffic Manager. Traffic Manager makes it possible to load balance connections to your services based on the location of the user.

For example, if the user makes a request to your service from the EU, the connection is directed to your services located in an EU datacenter. This part of Traffic Manager global load balancing helps to improve performance because connecting to the nearest datacenter is faster than connecting to datacenters that are far away.

## Disable RDP/SSH Access to virtual machines
It’s possible to reach Azure virtual machines by using [Remote Desktop Protocol](https://en.wikipedia.org/wiki/Remote_Desktop_Protocol) (RDP) and the [Secure Shell](https://en.wikipedia.org/wiki/Secure_Shell) (SSH) protocol. These protocols enable the management VMs from remote locations and are standard in datacenter computing.

The potential security problem with using these protocols over the internet is that attackers can use [brute force](https://en.wikipedia.org/wiki/Brute-force_attack) techniques to gain access to Azure virtual machines. After the attackers gain access, they can use your VM as a launch point for compromising other machines on your virtual network or even attack networked devices outside Azure.

We recommend that you disable direct RDP and SSH access to your Azure virtual machines from the internet. After direct RDP and SSH access from the internet is disabled, you have other options that you can use to access these VMs for remote management.

**Scenario**: Enable a single user to connect to an Azure virtual network over the internet.   
**Option**: [Point-to-site VPN](../vpn-gateway/vpn-gateway-point-to-site-create.md) is another term for a remote access VPN client/server connection. After the point-to-site connection is established, the user can use RDP or SSH to connect to any VMs located on the Azure virtual network that the user connected to via point-to-site VPN. This assumes that the user is authorized to reach those VMs.

Point-to-site VPN is more secure than direct RDP or SSH connections because the user has to authenticate twice before connecting to a VM. First, the user needs to authenticate (and be authorized) to establish the point-to-site VPN connection. Second, the user needs to authenticate (and be authorized) to establish the RDP or SSH session.

**Scenario**: Enable users on your on-premises network to connect to VMs on your Azure virtual network.   
**Option**: A [site-to-site VPN](../vpn-gateway/vpn-gateway-site-to-site-create.md) connects an entire network to another network over the internet. You can use a site-to-site VPN to connect your on-premises network to an Azure virtual network. Users on your on-premises network connect by using the RDP or SSH protocol over the site-to-site VPN connection. You don’t have to allow direct RDP or SSH access over the internet.

**Scenario**: Use a dedicated WAN link to provide functionality similar to the site-to-site VPN.   
**Option**: Use [ExpressRoute](https://azure.microsoft.com/documentation/services/expressroute/). It provides functionality similar to the site-to-site VPN. The main differences are:

- The dedicated WAN link doesn’t traverse the internet.
- Dedicated WAN links are typically more stable and perform better.

## Secure your critical Azure service resources to only your virtual networks
Use virtual network service endpoints to extend your virtual network private address space, and the identity of your virtual network to the Azure services, over a direct connection. Endpoints allow you to secure your critical Azure service resources to only your virtual networks. Traffic from your virtual network to the Azure service always remains on the Microsoft Azure backbone network.

Service endpoints provide the following benefits:

- **Improved security for your Azure service resources**: With service endpoints, Azure service resources can be secured to your virtual network. Securing service resources to a virtual network provides improved security by fully removing public internet access to resources, and allowing traffic only from your virtual network.
- **Optimal routing for Azure service traffic from your virtual network**: Any routes in your virtual network that force internet traffic to your on-premises and/or virtual appliances, known as forced tunneling, also force Azure service traffic to take the same route as the internet traffic. Service endpoints provide optimal routing for Azure traffic.

  Endpoints always take service traffic directly from your virtual network to the service on the Azure backbone network. Keeping traffic on the Azure backbone network allows you to continue auditing and monitoring outbound internet traffic from your virtual networks, through forced tunneling, without affecting service traffic. Learn more about [user-defined routes and forced tunneling](../virtual-network/virtual-networks-udr-overview.md).

- **Simple to set up with less management overhead**: You no longer need reserved, public IP addresses in your virtual networks to secure Azure resources through an IP firewall. There are no NAT or gateway devices required to set up the service endpoints. Service endpoints are configured through a simple click on a subnet. There is no additional overhead to maintain the endpoints.

To learn more about service endpoints and the Azure services and regions that service endpoints are available for, see [Virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).

## Next step
See [Azure security best practices and patterns](security-best-practices-and-patterns.md) for more security best practices to use when you’re designing, deploying, and managing your cloud solutions by using Azure.
