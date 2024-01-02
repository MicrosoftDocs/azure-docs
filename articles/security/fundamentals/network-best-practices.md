---
title: Best practices for network security - Microsoft Azure
description: This article provides a set of best practices for network security using built in Azure capabilities.
author: TerryLanfear
manager: rkarlin

ms.assetid: 7f6aa45f-138f-4fde-a611-aaf7e8fe56d1
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/29/2023
ms.author: terrylan

---
# Azure best practices for network security
This article discusses a collection of Azure best practices to enhance your network security. These best practices are derived from our experience with Azure networking and the experiences of customers like yourself.

For each best practice, this article explains:

* What the best practice is
* Why you want to enable that best practice
* What might be the result if you fail to enable the best practice
* Possible alternatives to the best practice
* How you can learn to enable the best practice

These best practices are based on a consensus opinion, and Azure platform capabilities and feature sets, as they exist at the time this article was written. Opinions and technologies change over time and this article will be updated regularly to reflect those changes.

## Use strong network controls
You can connect [Azure virtual machines (VMs)](https://azure.microsoft.com/services/virtual-machines/) and appliances to other networked devices by placing them on [Azure virtual networks](../../virtual-network/index.yml). That is, you can connect virtual network interface cards to a virtual network to allow TCP/IP-based communications between network-enabled devices. Virtual machines connected to an Azure virtual network can connect to devices on the same virtual network, different virtual networks, the internet, or your own on-premises networks.

As you plan your network and the security of your network, we recommend that you centralize:

- Management of core network functions like ExpressRoute, virtual network and subnet provisioning, and IP addressing.
- Governance of network security elements, such as network virtual appliance functions like ExpressRoute, virtual network and subnet provisioning, and IP addressing.

If you use a common set of management tools to monitor your network and the security of your network, you get clear visibility into both. A straightforward, unified security strategy reduces errors because it increases human understanding and the reliability of automation.

## Logically segment subnets
Azure virtual networks are similar to LANs on your on-premises network. The idea behind an Azure virtual network is that you create a network, based on a single private IP address space, on which you can place all your Azure virtual machines. The private IP address spaces available are in the Class A (10.0.0.0/8), Class B (172.16.0.0/12), and Class C (192.168.0.0/16) ranges.

Best practices for logically segmenting subnets include:

**Best practice**: Don't assign allow rules with broad ranges (for example, allow 0.0.0.0 through 255.255.255.255).  
**Detail**: Ensure troubleshooting procedures discourage or ban setting up these types of rules. These allow rules lead to a false sense of security and are frequently found and exploited by red teams.

**Best practice**: Segment the larger address space into subnets.   
**Detail**: Use [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing)-based subnetting principles to create your subnets.

**Best practice**: Create network access controls between subnets. Routing between subnets happens automatically, and you don't need to manually configure routing tables. By default, there are no network access controls between the subnets that you create on an Azure virtual network.   
**Detail**: Use a [network security group](../../virtual-network/manage-network-security-group.md) to protect against unsolicited traffic into Azure subnets. Network security groups (NSGs) are simple, stateful packet inspection devices. NSGs use the 5-tuple approach (source IP, source port, destination IP, destination port, and layer 4 protocol) to create allow/deny rules for network traffic. You allow or deny traffic to and from a single IP address, to and from multiple IP addresses, or to and from entire subnets.

When you use network security groups for network access control between subnets, you can put resources that belong to the same security zone or role in their own subnets.

**Best practice**: Avoid small virtual networks and subnets to ensure simplicity and flexibility.
**Detail**: Most organizations add more resources than initially planned, and reallocating addresses is labor intensive. Using small subnets adds limited security value, and mapping a network security group to each subnet adds overhead. Define subnets broadly to ensure that you have flexibility for growth.

**Best practice**: Simplify network security group rule management by defining [Application Security Groups](../../virtual-network/application-security-groups.md).  
**Detail**: Define an Application Security Group for lists of IP addresses that you think might change in the future or be used across many network security groups. Be sure to name Application Security Groups clearly so others can understand their content and purpose.

## Adopt a Zero Trust approach
Perimeter-based networks operate on the assumption that all systems within a network can be trusted. But today's employees access their organization's resources from anywhere on various devices and apps, which makes perimeter security controls irrelevant. Access control policies that focus only on who can access a resource aren't enough. To master the balance between security and productivity, security admins also need to factor in *how* a resource is being accessed.

Networks need to evolve from traditional defenses because networks might be vulnerable to breaches: an attacker can compromise a single endpoint within the trusted boundary and then quickly expand a foothold across the entire network. [Zero Trust](https://www.microsoft.com/security/blog/2018/06/14/building-zero-trust-networks-with-microsoft-365/) networks eliminate the concept of trust based on network location within a perimeter. Instead, Zero Trust architectures use device and user trust claims to gate access to organizational data and resources. For new initiatives, adopt Zero Trust approaches that validate trust at the time of access.

Best practices are:

**Best practice**: Give Conditional Access to resources based on device, identity, assurance, network location, and more.  
**Detail**: [Microsoft Entra Conditional Access](../../active-directory/conditional-access/overview.md) lets you apply the right access controls by implementing automated access control decisions based on the required conditions. For more information, see [Manage access to Azure management with Conditional Access](../../active-directory/conditional-access/howto-conditional-access-policy-azure-management.md).

**Best practice**: Enable port access only after workflow approval.  
**Detail**: You can use [just-in-time VM access in Microsoft Defender for Cloud](../../security-center/security-center-just-in-time.md) to lock down inbound traffic to your Azure VMs, reducing exposure to attacks while providing easy access to connect to VMs when needed.

**Best practice**: Grant temporary permissions to perform privileged tasks, which prevents malicious or unauthorized users from gaining access after the permissions have expired. Access is granted only when users need it.  
**Detail**: Use just-in-time access in Microsoft Entra Privileged Identity Management or in a third-party solution to grant permissions to perform privileged tasks.

Zero Trust is the next evolution in network security. The state of cyberattacks drives organizations to take the "assume breach" mindset, but this approach shouldn't be limiting. Zero Trust networks protect corporate data and resources while ensuring that organizations can build a modern workplace by using technologies that empower employees to be productive anytime, anywhere, in any way.

## Control routing behavior
When you put a virtual machine on an Azure virtual network, the VM can connect to any other VM on the same virtual network, even if the other VMs are on different subnets. This is possible because a collection of system routes enabled by default allows this type of communication. These default routes allow VMs on the same virtual network to initiate connections with each other, and with the internet (for outbound communications to the internet only).

Although the default system routes are useful for many deployment scenarios, there are times when you want to customize the routing configuration for your deployments. You can configure the next-hop address to reach specific destinations.

We recommend that you configure [user-defined routes](../../virtual-network/virtual-networks-udr-overview.md#custom-routes) when you deploy a security appliance for a virtual network. We talk about this recommendation in a later section titled [secure your critical Azure service resources to only your virtual networks](network-best-practices.md#secure-your-critical-azure-service-resources-to-only-your-virtual-networks).

> [!NOTE]
> User-defined routes aren't required, and the default system routes usually work.
>
>

## Use virtual network appliances
Network security groups and user-defined routing can provide a certain measure of network security at the network and transport layers of the [OSI model](https://en.wikipedia.org/wiki/OSI_model). But in some situations, you want or need to enable security at high levels of the stack. In such situations, we recommend that you deploy virtual network security appliances provided by Azure partners.

Azure network security appliances can deliver better security than what network-level controls provide. Network security capabilities of virtual network security appliances include:


* Firewalling
* Intrusion detection/intrusion prevention
* Vulnerability management
* Application control
* Network-based anomaly detection
* Web filtering
* Antivirus
* Botnet protection

To find available Azure virtual network security appliances, go to the [Azure Marketplace](https://azure.microsoft.com/marketplace/) and search for "security" and "network security."

## Deploy perimeter networks for security zones
A [perimeter network](/azure/architecture/vdc/networking-virtual-datacenter) (also known as a DMZ) is a physical or logical network segment that provides an extra layer of security between your assets and the internet. Specialized network access control devices on the edge of a perimeter network allow only desired traffic into your virtual network.

Perimeter networks are useful because you can focus your network access control management, monitoring, logging, and reporting on the devices at the edge of your Azure virtual network. A perimeter network is where you typically enable [distributed denial of service (DDoS) protection](../../ddos-protection/ddos-protection-overview.md), intrusion detection/intrusion prevention systems (IDS/IPS), firewall rules and policies, web filtering, network antimalware, and more. The network security devices sit between the internet and your Azure virtual network and have an interface on both networks.

Although this is the basic design of a perimeter network, there are many different designs, like back-to-back, tri-homed, and multi-homed.

Based on the Zero Trust concept mentioned earlier, we recommend that you consider using a perimeter network for all high security deployments to enhance the level of network security and access control for your Azure resources. You can use Azure or a third-party solution to provide an extra layer of security between your assets and the internet:

- Azure native controls. [Azure Firewall](../../firewall/overview.md) and [Azure Web Application Firewall](../../web-application-firewall/overview.md) offer basic security advantages. Advantages are a fully stateful firewall as a service, built-in high availability, unrestricted cloud scalability, FQDN filtering, support for OWASP core rule sets, and simple setup and configuration.
- Third-party offerings. Search the [Azure Marketplace](https://azuremarketplace.microsoft.com/) for next-generation firewall (NGFW) and other third-party offerings that provide familiar security tools and enhanced levels of network security. Configuration might be more complex, but a third-party offering might allow you to use existing capabilities and skillsets.

## Avoid exposure to the internet with dedicated WAN links
Many organizations have chosen the hybrid IT route. With hybrid IT, some of the company's information assets are in Azure, and others remain on-premises. In many cases, some components of a service are running in Azure while other components remain on-premises.

In a hybrid IT scenario, there's usually some type of cross-premises connectivity. Cross-premises connectivity allows the company to connect its on-premises networks to Azure virtual networks. Two cross-premises connectivity solutions are available:

* [Site-to-site VPN](../../vpn-gateway/tutorial-site-to-site-portal.md). It's a trusted, reliable, and established technology, but the connection takes place over the internet. Bandwidth is constrained to a maximum of about 1.25 Gbps. Site-to-site VPN is a desirable option in some scenarios.
* **Azure ExpressRoute**. We recommend that you use [ExpressRoute](../../expressroute/expressroute-introduction.md) for your cross-premises connectivity. ExpressRoute lets you extend your on-premises networks into the Microsoft cloud over a private connection facilitated by a connectivity provider. With ExpressRoute, you can establish connections to Microsoft cloud services like Azure, Microsoft 365, and Dynamics 365. ExpressRoute is a dedicated WAN link between your on-premises location or a Microsoft Exchange hosting provider. Because this is a telco connection, your data doesn't travel over the internet, so it isn't exposed to the potential risks of internet communications.

The location of your ExpressRoute connection can affect firewall capacity, scalability, reliability, and network traffic visibility. You'll need to identify where to terminate ExpressRoute in existing (on-premises) networks. You can:

- Terminate outside the firewall (the perimeter network paradigm). Use this recommendation if you require visibility into the traffic, if you need to continue an existing practice of isolating datacenters, or if you're solely putting extranet resources on Azure.
- Terminate inside the firewall (the network extension paradigm). This is the default recommendation. In all other cases, we recommend treating Azure as another datacenter.

## Optimize uptime and performance
If a service is down, information can't be accessed. If performance is so poor that the data is unusable, you can consider the data to be inaccessible. From a security perspective, you need to do whatever you can to make sure that your services have optimal uptime and performance.

A popular and effective method for enhancing availability and performance is load balancing. Load balancing is a method of distributing network traffic across servers that are part of a service. For example, if you have front-end web servers as part of your service, you can use load balancing to distribute the traffic across your multiple front-end web servers.

This distribution of traffic increases availability because if one of the web servers becomes unavailable, the load balancer stops sending traffic to that server and redirects it to the servers that are still online. Load balancing also helps performance, because the processor, network, and memory overhead for serving requests is distributed across all the load-balanced servers.

We recommend that you employ load balancing whenever you can, and as appropriate for your services. Following are scenarios at both the Azure virtual network level and the global level, along with load-balancing options for each.

**Scenario**: You have an application that:

- Requires requests from the same user/client session to reach the same back-end virtual machine. Examples of this are shopping cart apps and web mail servers.
- Accepts only a secure connection, so unencrypted communication to the server isn't an acceptable option.
- Requires multiple HTTP requests on the same long-running TCP connection to be routed or load balanced to different back-end servers.

**Load-balancing option**: Use [Azure Application Gateway](../../application-gateway/overview.md), an HTTP web traffic load balancer. Application Gateway supports end-to-end TLS encryption and [TLS termination](../../application-gateway/overview.md) at the gateway. Web servers can then be unburdened from encryption and decryption overhead and traffic flowing unencrypted to the back-end servers.

**Scenario**: You need to load balance incoming connections from the internet among your servers located in an Azure virtual network. Scenarios are when you:

- Have stateless applications that accept incoming requests from the internet.
- Don't require sticky sessions or TLS offload. Sticky sessions is a method used with Application Load Balancing, to achieve server-affinity.

**Load-balancing option**: Use the Azure portal to [create an external load balancer](../../load-balancer/quickstart-load-balancer-standard-public-portal.md) that spreads incoming requests across multiple VMs to provide a higher level of availability.

**Scenario**: You need to load balance connections from VMs that are not on the internet. In most cases, the connections that are accepted for load balancing are initiated by devices on an Azure virtual network, such as SQL Server instances or internal web servers.   
**Load-balancing option**: Use the Azure portal to [create an internal load balancer](../../load-balancer/quickstart-load-balancer-standard-public-portal.md) that spreads incoming requests across multiple VMs to provide a higher level of availability.

**Scenario**: You need global load balancing because you:

- Have a cloud solution that is widely distributed across multiple regions and requires the highest level of uptime (availability) possible.
- Need the highest level of uptime possible to make sure that your service is available even if an entire datacenter becomes unavailable.

**Load-balancing option**: Use Azure Traffic Manager. Traffic Manager makes it possible to load balance connections to your services based on the location of the user.

For example, if the user makes a request to your service from the EU, the connection is directed to your services located in an EU datacenter. This part of Traffic Manager global load balancing helps to improve performance because connecting to the nearest datacenter is faster than connecting to datacenters that are far away.

## Disable RDP/SSH Access to virtual machines
It's possible to reach Azure virtual machines by using [Remote Desktop Protocol](https://en.wikipedia.org/wiki/Remote_Desktop_Protocol) (RDP) and the [Secure Shell](https://en.wikipedia.org/wiki/Secure_Shell) (SSH) protocol. These protocols enable the management VMs from remote locations and are standard in datacenter computing.

The potential security problem with using these protocols over the internet is that attackers can use [brute force](https://en.wikipedia.org/wiki/Brute-force_attack) techniques to gain access to Azure virtual machines. After the attackers gain access, they can use your VM as a launch point for compromising other machines on your virtual network or even attack networked devices outside Azure.

We recommend that you disable direct RDP and SSH access to your Azure virtual machines from the internet. After direct RDP and SSH access from the internet is disabled, you have other options that you can use to access these VMs for remote management.

**Scenario**: Enable a single user to connect to an Azure virtual network over the internet.   
**Option**: [Point-to-site VPN](../../vpn-gateway/vpn-gateway-howto-point-to-site-classic-azure-portal.md) is another term for a remote access VPN client/server connection. After the point-to-site connection is established, the user can use RDP or SSH to connect to any VMs located on the Azure virtual network that the user connected to via point-to-site VPN. This assumes that the user is authorized to reach those VMs.

Point-to-site VPN is more secure than direct RDP or SSH connections because the user has to authenticate twice before connecting to a VM. First, the user needs to authenticate (and be authorized) to establish the point-to-site VPN connection. Second, the user needs to authenticate (and be authorized) to establish the RDP or SSH session.

**Scenario**: Enable users on your on-premises network to connect to VMs on your Azure virtual network.   
**Option**: A [site-to-site VPN](../../vpn-gateway/vpn-gateway-howto-site-to-site-classic-portal.md) connects an entire network to another network over the internet. You can use a site-to-site VPN to connect your on-premises network to an Azure virtual network. Users on your on-premises network connect by using the RDP or SSH protocol over the site-to-site VPN connection. You don't have to allow direct RDP or SSH access over the internet.

**Scenario**: Use a dedicated WAN link to provide functionality similar to the site-to-site VPN.   
**Option**: Use [ExpressRoute](../../expressroute/expressroute-introduction.md). It provides functionality similar to the site-to-site VPN. The main differences are:

- The dedicated WAN link doesn't traverse the internet.
- Dedicated WAN links are typically more stable and perform better.

## Secure your critical Azure service resources to only your virtual networks
Use Azure Private Link to access Azure PaaS Services (for example, Azure Storage and SQL Database) over a private endpoint in your virtual network. Private Endpoints allow you to secure your critical Azure service resources to only your virtual networks. Traffic from your virtual network to the Azure service always remains on the Microsoft Azure backbone network. Exposing your virtual network to the public internet is no longer necessary to consume Azure PaaS Services. 

Azure Private Link provides the following benefits:
- **Improved security for your Azure service resources**: With Azure Private Link, Azure service resources can be secured to your virtual network using private endpoint. Securing service resources to a private endpoint in virtual network provides improved security by fully removing public internet access to resources, and allowing traffic only from  private endpoint in your virtual network.
- **Privately access Azure service resources on the Azure platform**: Connect your virtual network to services in Azure using private endpoints. There's no need for a public IP address. The Private Link platform will handle the connectivity between the consumer and services over the Azure backbone network.
- **Access from On-premises and peered networks**: Access services running in Azure from on-premises over ExpressRoute private peering, VPN tunnels, and peered virtual networks using private endpoints. There's no need to configure ExpressRoute Microsoft peering or traverse the internet to reach the service. Private Link provides a secure way to migrate workloads to Azure.
- **Protection against data leakage**: A private endpoint is mapped to an instance of a PaaS resource instead of the entire service. Consumers can only connect to the specific resource. Access to any other resource in the service is blocked. This mechanism provides protection against data leakage risks.
- **Global reach**: Connect privately to services running in other regions. The consumer's virtual network could be in region A and it can connect to services in region B.
- **Simple to set up and manage**: You no longer need reserved, public IP addresses in your virtual networks to secure Azure resources through an IP firewall. There are no NAT or gateway devices required to set up the private endpoints. Private endpoints are configured through a simple workflow. On service side, you can also manage the connection requests on your Azure service resource with ease. Azure Private Link works for consumers and services belonging to different Microsoft Entra tenants too. 
	
To learn more about private endpoints and the Azure services and regions that private endpoints are available for, see [Azure Private Link](../../private-link/private-link-overview.md).


## Next steps
See [Azure security best practices and patterns](best-practices-and-patterns.md) for more security best practices to use when you're designing, deploying, and managing your cloud solutions by using Azure.
