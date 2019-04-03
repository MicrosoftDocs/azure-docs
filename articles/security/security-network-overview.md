---
title: Network security concepts and requirements in Azure | Microsoft Docs
description: This article provides basic explanations about core network security concepts and requirements, and information on what Azure offers in each of these areas.
services: security
documentationcenter: na
author: TomShinder
manager: barbkess
editor: TomSh

ms.assetid: bedf411a-0781-47b9-9742-d524cf3dbfc1
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/29/2018
ms.author: terrylan
#Customer intent: As an IT Pro or decision maker I am looking for information on the network security controls available in Azure.

---
# Azure network security overview

Network security could be defined as the process of protecting resources from unauthorized access or attack by applying controls to network traffic. The goal is to ensure that only legitimate traffic is allowed. Azure includes a robust networking infrastructure to support your application and service connectivity requirements. Network connectivity is possible between resources located in Azure, between on-premises and Azure hosted resources, and to and from the internet and Azure.

This article covers some of the options that Azure offers in the area of network security. You can learn about:

* Azure networking
* Network access control
* Azure Firewall
* Secure remote access and cross-premises connectivity
* Availability
* Name resolution
* Perimeter network (DMZ) architecture
* Azure DDoS protection
* Azure Front Door
* Traffic manager
* Monitoring and threat detection

## Azure networking

Azure requires virtual machines to be connected to an Azure Virtual Network. A virtual network is a logical construct built on top of the physical Azure network fabric. Each virtual network is isolated from all other virtual networks. This helps ensure that network traffic in your deployments is not accessible to other Azure customers.

Learn more:

* [Virtual network overview](../virtual-network/virtual-networks-overview.md)

## Network access control

Network access control is the act of limiting connectivity to and from specific devices or subnets within a virtual network. The goal of network access control is to limit access to your virtual machines and services to approved users and devices. Access controls are based on decisions to allow or deny connections to and from your virtual machine or service.

Azure supports several types of network access control, such as:

* Network layer control
* Route control and forced tunneling
* Virtual network security appliances

### Network layer control

Any secure deployment requires some measure of network access control. The goal of network access control is to restrict virtual machine communication to the necessary systems. Other communication attempts are blocked.

> [!NOTE]
> Storage Firewalls are covered in the [Azure storage security overview](security-storage-overview.md) article

#### Network security rules (NSGs)

If you need basic network level access control (based on IP address and the TCP or UDP protocols), you can use Network Security Groups (NSGs). An NSG is a basic, stateful, packet filtering firewall, and it enables you to control access based on a [5-tuple](https://www.techopedia.com/definition/28190/5-tuple). NSGs include functionality to simplify management and reduce the chances of configuration mistakes:

* **Augmented security rules** simplify NSG rule definition and allow you to create complex rules rather than having to create multiple simple rules to achieve the same result.
* **Service tags** are Microsoft created labels that represent a group of IP addresses. They update dynamically to include IP ranges that meet the conditions that define inclusion in the label. For example, if you want to create a rule that applies to all Azure storage on the east region you can use Storage.EastUS
* **Application security groups** allow you to deploy resources to application groups and control the access to those resources by creating rules that use those application groups. For example, if you have webservers deployed to the 'Webservers' application group you can create a rule that applies a NSG allowing 443 traffic from the Internet to all systems in the 'Webservers' application group.

NSGs do not provide application layer inspection or authenticated access controls.

Learn more:

* [Network Security Groups](../virtual-network/security-overview.md)

#### ASC just in time VM access

[Azure security center](../security-center/security-center-intro.md) can manage the NSGs on VMs and lock access to the VM until a user with the appropriate role-based access control [RBAC](../role-based-access-control/overview.md) permissions requests access. When the user is successfully authorized ASC makes modifications to the NSGs to allow access to selected ports for the time specified. When the time expires the NSGs are restored to their previous secured state.

Learn more:

* [Azure Security Center Just in Time Access](../security-center/security-center-just-in-time.md)

#### Service endpoints

Service endpoints are another way to apply control over your traffic. You can limit communication with supported services to just your VNets over a direct connection. Traffic from your VNet to the specified Azure service remains on the Microsoft Azure backbone network.  

Learn more:

* [Service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md#securing-azure-services-to-virtual-networks)

### Route control and forced tunneling

The ability to control routing behavior on your virtual networks is critical. If routing is configured incorrectly, applications and services hosted on your virtual machine might connect to unauthorized devices, including systems owned and operated by potential attackers.

Azure networking supports the ability to customize the routing behavior for network traffic on your virtual networks. This enables you to alter the default routing table entries in your virtual network. Control of routing behavior helps you make sure that all traffic from a certain device or group of devices enters or leaves your virtual network through a specific location.

For example, you might have a virtual network security appliance on your virtual network. You want to make sure that all traffic to and from your virtual network goes through that virtual security appliance. You can do this by configuring [User Defined Routes](../virtual-network/virtual-networks-udr-overview.md) (UDRs) in Azure.

[Forced tunneling](https://www.petri.com/azure-forced-tunneling) is a mechanism you can use to ensure that your services are not allowed to initiate a connection to devices on the internet. Note that this is different from accepting incoming connections and then responding to them. Front-end web servers need to respond to requests from internet hosts, and so internet-sourced traffic is allowed inbound to these web servers and the web servers are allowed to respond.

What you don't want to allow is a front-end web server to initiate an outbound request. Such requests might represent a security risk because these connections can be used to download malware. Even if you do want these front-end servers to initiate outbound requests to the internet, you might want to force them to go through your on-premises web proxies. This enables you to take advantage of URL filtering and logging.

Instead, you would want to use forced tunneling to prevent this. When you enable forced tunneling, all connections to the internet are forced through your on-premises gateway. You can configure forced tunneling by taking advantage of UDRs.

Learn more:

* [What are User Defined Routes and IP Forwarding](../virtual-network/virtual-networks-udr-overview.md)

### Virtual network security appliances

While NSGs, UDRs, and forced tunneling provide you a level of security at the network and transport layers of the [OSI model](https://en.wikipedia.org/wiki/OSI_model), you might also want to enable security at levels higher than the network.

For example, your security requirements might include:

* Authentication and authorization before allowing access to your application
* Intrusion detection and intrusion response
* Application layer inspection for high-level protocols
* URL filtering
* Network level antivirus and Antimalware
* Anti-bot protection
* Application access control
* Additional DDoS protection (above the DDoS protection provided by the Azure fabric itself)

You can access these enhanced network security features by using an Azure partner solution. You can find the most current Azure partner network security solutions by visiting the [Azure Marketplace](https://azure.microsoft.com/marketplace/), and searching for "security" and "network security."

## Azure Firewall

Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources. It is a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability. Some features include:

* High availability
* Cloud scalability
* Application FQDN filtering rules
* Network traffic filtering rules

Learn more:

* [Azure Firewall overview](../firewall/overview.md)

## Secure remote access and cross-premises connectivity

Setup, configuration, and management of your Azure resources needs to be done remotely. In addition, you might want to deploy [hybrid IT](https://social.technet.microsoft.com/wiki/contents/articles/18120.hybrid-cloud-infrastructure-design-considerations.aspx) solutions that have components on-premises and in the Azure public cloud. These scenarios require secure remote access.

Azure networking supports the following secure remote access scenarios:

* Connect individual workstations to a virtual network
* Connect your on-premises network to a virtual network with a VPN
* Connect your on-premises network to a virtual network with a dedicated WAN link
* Connect virtual networks to each other

### Connect individual workstations to a virtual network

You might want to enable individual developers or operations personnel to manage virtual machines and services in Azure. For example, let's say you need access to a virtual machine on a virtual network. But your security policy does not allow RDP or SSH remote access to individual virtual machines. In this case, you can use a [point-to-site VPN](../vpn-gateway/point-to-site-about.md) connection.

The point-to-site VPN connection enables you to set up a private and secure connection between the user and the virtual network. When the VPN connection is established, the user can RDP or SSH over the VPN link into any virtual machine on the virtual network. (This assumes that the user can authenticate and is authorized.) Point-to-site VPN supports:

* Secure Socket Tunneling Protocol (SSTP), a proprietary SSL-based VPN protocol. An SSL VPN solution can penetrate firewalls, since most firewalls open TCP port 443, which SSL uses. SSTP is only supported on Windows devices. Azure supports all versions of Windows that have SSTP (Windows 7 and later).

* IKEv2 VPN, a standards-based IPsec VPN solution. IKEv2 VPN can be used to connect from Mac devices (OSX versions 10.11 and above).

* [OpenVPN](https://azure.microsoft.com/updates/openvpn-support-for-azure-vpn-gateways/)

Learn more:

* [Configure a point-to-site connection to a virtual network using PowerShell](../vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md)

### Connect your on-premises network to a virtual network with a VPN

You might want to connect your entire corporate network, or portions of it, to a virtual network. This is common in hybrid IT scenarios, where organizations [extend their on-premises datacenter into Azure](https://gallery.technet.microsoft.com/Datacenter-extension-687b1d84). In many cases, organizations host parts of a service in Azure, and parts on-premises. For example,they might do so when a solution includes front-end web servers in Azure and back-end databases on-premises. These types of "cross-premises" connections also make management of Azure located resources more secure, and enable scenarios such as extending Active Directory domain controllers into Azure.

One way to accomplish this is to use a [site-to-site VPN](https://www.techopedia.com/definition/30747/site-to-site-vpn). The difference between a site-to-site VPN and a point-to-site VPN is that the latter connects a single device to a virtual network. A site-to-site VPN connects an entire network (such as your on-premises network) to a virtual network. Site-to-site VPNs to a virtual network use the highly secure IPsec tunnel mode VPN protocol.

Learn more:

* [Create a Resource Manager VNet with a site-to-site VPN connection using the Azure portal](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md)
* [About VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md)

### Connect your on-premises network to a virtual network with a dedicated WAN link

Point-to-site and site-to-site VPN connections are effective for enabling cross-premises connectivity. However, some organizations consider them to have the following drawbacks:

* VPN connections move data over the internet. This exposes these connections to potential security issues involved with moving data over a public network. In addition, reliability and availability for internet connections cannot be guaranteed.
* VPN connections to virtual networks might not have the bandwidth for some applications and purposes, as they max out at around 200 Mbps.

Organizations that need the highest level of security and availability for their cross-premises connections typically use dedicated WAN links to connect to remote sites. Azure provides you the ability to use a dedicated WAN link that you can use to connect your on-premises network to a virtual network. Azure ExpressRoute, Express route direct, and Express route global reach enable this.

Learn more:

* [ExpressRoute technical overview](../expressroute/expressroute-introduction.md)
* [ExpressRoute direct](../expressroute/expressroute-erdirect-about.md)
* [Express route global reach](..//expressroute/expressroute-global-reach.md)

### Connect virtual networks to each other

It is possible to use many virtual networks for your deployments. There are various reasons why you might do this. You might want to simplify management, or you might want increased security. Regardless of the motivation for putting resources on different virtual networks, there might be times when you want resources on each of the networks to connect with one another.

One option is for services on one virtual network to connect to services on another virtual network, by "looping back" through the internet. The connection starts on one virtual network, goes through the internet, and then comes back to the destination virtual network. This option exposes the connection to the security issues inherent in any internet-based communication.

A better option might be to create a site-to-site VPN that connects between two virtual networks. This method uses the same [IPSec tunnel mode](https://technet.microsoft.com/library/cc786385.aspx) protocol as the cross-premises site-to-site VPN connection mentioned above.

The advantage of this approach is that the VPN connection is established over the Azure network fabric, instead of connecting over the internet. This provides you an extra layer of security, compared to site-to-site VPNs that connect over the internet.

Learn more:

* [Configure a VNet-to-VNet Connection by using Azure Resource Manager and PowerShell](../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md)

Another way to connect your virtual networks is  [VNET peering](../virtual-network/virtual-network-peering-overview.md). This feature allows you to connect two Azure networks so that communication between them happens over the Microsoft backbone infrastructure without it ever going over the Internet. VNET peering can connect two VNETs within the same region or two VNETs across Azure regions. NSGs can be used to limit connectivity between different subnets or systems.

## Availability

Availability is a key component of any security program. If your users and systems can't access what they need to access over the network, the service can be considered compromised. Azure has networking technologies that support the following high-availability mechanisms:

* HTTP-based load balancing
* Network level load balancing
* Global load balancing

Load balancing is a mechanism designed to equally distribute connections among multiple devices. The goals of load balancing are:

* To increase availability. When you load balance connections across multiple devices, one or more of the devices can become unavailable without compromising the service. The services running on the remaining online devices can continue to serve the content from the service.
* To increase performance. When you load balance connections across multiple devices, a single device doesn't have to handle all processing. Instead, the processing and memory demands for serving the content is spread across multiple devices.

### HTTP-based load balancing

Organizations that run web-based services often desire to have an HTTP-based load balancer in front of those web services. This helps ensure adequate levels of performance and high availability. Traditional, network-based load balancers rely on network and transport layer protocols. HTTP-based load balancers, on the other hand, make decisions based on characteristics of the HTTP protocol.

Azure Application Gateway provides HTTP-based load balancing for your web-based services. Application Gateway supports:

* Cookie-based session affinity. This capability makes sure that connections established to one of the servers behind that load balancer stays intact between the client and server. This ensures stability of transactions.
* SSL offload. When a client connects with the load balancer, that session is encrypted by using the HTTPS (SSL) protocol. However, in order to increase performance, you can use the HTTP (unencrypted) protocol to connect between the load balancer and the web server behind the load balancer. This is referred to as "SSL offload," because the web servers behind the load balancer don't experience the processor overhead involved with encryption. The web servers can therefore service requests more quickly.
* URL-based content routing. This feature makes it possible for the load balancer to make decisions about where to forward connections based on the target URL. This provides a lot more flexibility than solutions that make load balancing decisions based on IP addresses.

Learn more:

* [Application Gateway overview](../application-gateway/application-gateway-introduction.md)

### Network level load balancing

In contrast to HTTP-based load balancing, network level load balancing makes decisions based on IP address and port (TCP or UDP) numbers.
You can gain the benefits of network level load balancing in Azure by using Azure Load Balancer. Some key characteristics of Load Balancer include:

* Network level load balancing based on IP address and port numbers.
* Support for any application layer protocol.
* Load balances to Azure virtual machines and cloud services role instances.
* Can be used for both internet-facing (external load balancing) and non-internet facing (internal load balancing) applications and virtual machines.
* Endpoint monitoring, which is used to determine if any of the services behind the load balancer have become unavailable.

Learn more:

* [Internet-facing load balancer between multiple virtual machines or services](../load-balancer/load-balancer-internet-overview.md)
* [Internal load balancer overview](../load-balancer/load-balancer-internal-overview.md)

### Global load balancing

Some organizations want the highest level of availability possible. One way to reach this goal is to host applications in globally distributed datacenters. When an application is hosted in datacenters located throughout the world, it's possible for an entire geopolitical region to become unavailable, and still have the application up and running.

This load-balancing strategy can also yield performance benefits. You can direct requests for the service to the datacenter that is nearest to the device that is making the request.

In Azure, you can gain the benefits of global load balancing by using Azure Traffic Manager.

Learn more:

* [What is Traffic Manager?](../traffic-manager/traffic-manager-overview.md)

## Name resolution

Name resolution is a critical function for all services you host in Azure. From a security perspective, compromise of the name resolution function can lead to an attacker redirecting requests from your sites to an attacker's site. Secure name resolution is a requirement for all your cloud hosted services.

There are two types of name resolution you need to address:

* Internal name resolution. This is used by services on your virtual networks, your on-premises networks, or both. Names used for internal name resolution are not accessible over the internet. For optimal security, it's important that your internal name resolution scheme is not accessible to external users.
* External name resolution. This is used by people and devices outside of your on-premises networks and virtual networks. These are the names that are visible to the internet, and are used to direct connection to your cloud-based services.

For internal name resolution, you have two options:

* A virtual network DNS server. When you create a new virtual network, a DNS server is created for you. This DNS server can resolve the names of the machines located on that virtual network. This DNS server is not configurable, is managed by the Azure fabric manager, and can therefore help you secure your name resolution solution.
* Bring your own DNS server. You have the option of putting a DNS server of your own choosing on your virtual network. This DNS server can be an Active Directory integrated DNS server, or a dedicated DNS server solution provided by an Azure partner, which you can obtain from the Azure Marketplace.

Learn more:

* [Virtual network overview](../virtual-network/virtual-networks-overview.md)
* [Manage DNS Servers used by a virtual network](../virtual-network/manage-virtual-network.md#change-dns-servers)

For external name resolution, you have two options:

* Host your own external DNS server on-premises.
* Host your own external DNS server with a service provider.

Many large organizations host their own DNS servers on-premises. They can do this because they have the networking expertise and global presence to do so.

In most cases, it's better to host your DNS name resolution services with a service provider. These service providers have the network expertise and global presence to ensure very high availability for your name resolution services. Availability is essential for DNS services, because if your name resolution services fail, no one will be able to reach your internet facing services.

Azure provides you with a highly available and high-performing external DNS solution in the form of Azure DNS. This external name resolution solution takes advantage of the worldwide Azure DNS infrastructure. It allows you to host your domain in Azure, using the same credentials, APIs, tools, and billing as your other Azure services. As part of Azure, it also inherits the strong security controls built into the platform.

Learn more:

* [Azure DNS overview](../dns/dns-overview.md)
* [Azure DNS private zones](../dns/private-dns-overview.md) allows you to configure private DNS names for Azure resources rather than the automatically assigned names without the need to add a custom DNS solution.

## Perimeter network architecture

Many large organizations use perimeter networks to segment their networks, and create a buffer-zone between the internet and their services. The perimeter portion of the network is considered a low-security zone, and no high-value assets are placed in that network segment. You'll typically see network security devices that have a network interface on the perimeter network segment. Another network interface is connected to a network that has virtual machines and services that accept inbound connections from the internet.

You can design perimeter networks in a number of different ways. The decision to deploy a perimeter network, and then what type of perimeter network to use if you decide to use one, depends on your network security requirements.

Learn more:

* [Microsoft Cloud Services and Network Security](../best-practices-network-security.md)

## Azure DDoS protection

Distributed denial of service (DDoS) attacks are some of the largest availability and security concerns facing customers that are moving their applications to the cloud. A DDoS attack attempts to exhaust an application's resources, making the application unavailable to legitimate users. DDoS attacks can be targeted at any endpoint that is publicly reachable through the internet.
Microsoft provides DDoS protection known as **Basic** as part of the Azure Platform. This comes at no charge and includes always on monitoring and real-time mitigation of common network level attacks. In addition to the protections included with DDoS protection **Basic** you can enable the **Standard** option. DDoS Protection Standard features include:

* **Native platform integration:** Natively integrated into Azure. Includes configuration through the Azure portal. DDoS Protection Standard understands your resources and resource configuration.
* **Turn-key protection:** Simplified configuration immediately protects all resources on a virtual network as soon as DDoS Protection Standard is enabled. No intervention or user definition is required. DDoS Protection Standard instantly and automatically mitigates the attack, once it is detected.
* **Always-on traffic monitoring:** Your application traffic patterns are monitored 24 hour a day, 7 days a week, looking for indicators of DDoS attacks. Mitigation is performed when protection policies are exceeded.
* **Attack Mitigation Reports** Attack Mitigation Reports use aggregated network flow data to provide detailed information about attacks targeted at your resources.
* **Attack Mitigation Flow Logs** Attack Mitigation Flow Logs allow you to review the dropped traffic, forwarded traffic and other attack data in near real-time during an active DDoS attack.
* **Adaptive tuning:** Intelligent traffic profiling learns your application's traffic over time, and selects and updates the profile that is the most suitable for your service. The profile adjusts as traffic changes over time. Layer 3 to layer 7 protection: Provides full stack DDoS protection, when used with a web application firewall.
* **Extensive mitigation scale:** Over 60 different attack types can be mitigated, with global capacity, to protect against the largest known DDoS attacks.
* **Attack metrics:** Summarized metrics from each attack are accessible through Azure Monitor.
* **Attack alerting:** Alerts can be configured at the start and stop of an attack, and over the attack's duration, using built-in attack metrics. Alerts integrate into your operational software like Microsoft Azure Monitor logs, Splunk, Azure Storage, Email, and the Azure portal.
* **Cost guarantee:**  Data-transfer and application scale-out service credits for documented DDoS attacks.
* **DDoS Rapid responsive** DDoS Protection Standard customers now have access to Rapid Response team during an active attack. DRR can help with attack investigation, custom mitigations during an attack and post-attack analysis.


Learn more:

* [DDOS protection overview](../virtual-network/ddos-protection-overview.md)

## Azure Front Door

Azure Front Door Service enables you to define, manage, and monitor the global routing of your web traffic. It optimizes your traffic's routing for best performance and high availability. Azure Front Door allows you to author custom web application firewall (WAF) rules for access control to protect your HTTP/HTTPS workload from exploitation based on client IP addresses, country code, and http parameters. Additionally, Front Door also enables you to create rate limiting rules to battle malicious bot traffic, it includes SSL offloading and per-HTTP/HTTPS request, application-layer processing.

Front Door platform itself is protected by Azure DDoS Protection Basic. For further protection, Azure DDoS Protection Standard may be enabled at your VNETs and safeguard resources from network layer (TCP/UDP) attacks via auto tuning and mitigation. Front Door is a layer 7 reverse proxy, it only allows web traffic to pass through to back end servers and block other types of traffic by default.

Learn more:

* For more information on the whole set of Azure Front door capabilities you can review the [Azure Front Door overview](../frontdoor/front-door-overview.md)

## Azure Traffic manager

Azure Traffic Manager is a DNS-based traffic load balancer that enables you to distribute traffic optimally to services across global Azure regions, while providing high availability and responsiveness. Traffic Manager uses DNS to direct client requests to the most appropriate service endpoint based on a traffic-routing method and the health of the endpoints. An endpoint is any Internet-facing service hosted inside or outside of Azure. Traffic manager monitors the end points and does not direct traffic to any endpoints that are unavailable.

Learn more:

* [Azure Traffic manager overview](../traffic-manager/traffic-manager-overview.md)

## Monitoring and threat detection

Azure provides capabilities to help you in this key area with early detection, monitoring, and collecting and reviewing network traffic.

### Azure Network Watcher

Azure Network Watcher can help you troubleshoot, and provides a whole new set of tools to assist with the identification of security issues.

[Security Group View](../network-watcher/network-watcher-security-group-view-overview.md) helps with auditing and security compliance of Virtual Machines. Use this feature to perform programmatic audits, comparing the baseline policies defined by your organization to effective rules for each of your VMs. This can help you identify any configuration drift.

[Packet capture](../network-watcher/network-watcher-packet-capture-overview.md) allows you to capture network traffic to and from the virtual machine. You can collect network statistics and troubleshoot application issues, which can be invaluable in the investigation of network intrusions. You can also use this feature together with Azure Functions to start network captures in response to specific Azure alerts.

For more information on Network Watcher and how to start testing some of the functionality in your labs, see [Azure network watcher monitoring overview](../network-watcher/network-watcher-monitoring-overview.md).

> [!NOTE]
> For the most up-to-date notifications on availability and status of this service, check the [Azure updates page](https://azure.microsoft.com/updates/?product=network-watcher).

### Azure Security Center

Azure Security Center helps you prevent, detect, and respond to threats, and provides you increased visibility into, and control over, the security of your Azure resources. It provides integrated security monitoring and policy management across your Azure subscriptions, helps detect threats that might otherwise go unnoticed, and works with a large set of security solutions.

Security Center helps you optimize and monitor network security by:

* Providing network security recommendations.
* Monitoring the state of your network security configuration.
* Alerting you to network based threats, both at the endpoint and network levels.

Learn more:

* [Introduction to Azure Security Center](../security-center/security-center-intro.md)

### Virtual Network TAP

Azure virtual network TAP (Terminal Access Point) allows you to continuously stream your virtual machine network traffic to a network packet collector or analytics tool. The collector or analytics tool is provided by a network virtual appliance partner. You can use the same virtual network TAP resource to aggregate traffic from multiple network interfaces in the same or different subscriptions.

Learn more:

* [Virtual network TAP](../virtual-network/virtual-network-tap-overview.md)

### Logging

Logging at a network level is a key function for any network security scenario. In Azure, you can log information obtained for NSGs to get network level logging information. With NSG logging, you get information from:

* [Activity logs](../azure-monitor/platform/activity-logs-overview.md). Use these logs to view all operations submitted to your Azure subscriptions. These logs are enabled by default, and can be used within the Azure portal. They were previously known as audit or operational logs.
* Event logs. These logs provide information about what NSG rules were applied.
* Counter logs. These logs let you know how many times each NSG rule was applied to deny or allow traffic.

You can also use [Microsoft Power BI](https://powerbi.microsoft.com/what-is-power-bi/), a powerful data visualization tool, to view and analyze these logs.
Learn more:

* [Azure Monitor logs for Network Security Groups (NSGs)](../virtual-network/virtual-network-nsg-manage-log.md)
