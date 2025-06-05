---
title: Network security concepts and requirements in Azure | Microsoft Docs
description: This article provides basic explanations about core network security concepts and requirements, and information on what Azure offers in each of these areas.
services: security
author: msmbaldwin
manager: rkarlin

ms.assetid: bedf411a-0781-47b9-9742-d524cf3dbfc1
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 02/18/2025
ms.author: mbaldwin
#Customer intent: As an IT Pro or decision maker, I am looking for information on the network security controls available in Azure.

---
# Overview of Azure network security 

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

> [!NOTE]
> For web workloads, we highly recommend utilizing [**Azure DDoS protection**](../../ddos-protection/ddos-protection-overview.md) and a [**web application firewall**](../../web-application-firewall/overview.md) to safeguard against emerging DDoS attacks. Another option is to deploy [**Azure Front Door**](../../frontdoor/web-application-firewall.md) along with a web application firewall. Azure Front Door offers platform-level [**protection against network-level DDoS attacks**](../../frontdoor/front-door-ddos.md).

## Azure networking

Azure requires virtual machines to be connected to an Azure Virtual Network. A virtual network is a logical construct built on top of the physical Azure network fabric. Each virtual network is isolated from all other virtual networks. This helps ensure that network traffic in your deployments is not accessible to other Azure customers.

Learn more:

* [Virtual network overview](../../virtual-network/virtual-networks-overview.md)

## Network access control

Network access control is the act of limiting connectivity to and from specific devices or subnets within a virtual network. The goal of network access control is to limit access to your virtual machines and services to approved users and devices. Access controls are based on decisions to allow or deny connections to and from your virtual machine or service.

Azure supports several types of network access control, such as:

* Network layer control
* Route control and forced tunneling
* Virtual network security appliances

### Network layer control

Any secure deployment requires some measure of network access control. The goal of network access control is to restrict virtual machine communication to the necessary systems. Other communication attempts are blocked.

> [!NOTE]
> Storage Firewalls are covered in the [Azure storage security overview](../../storage/blobs/security-recommendations.md) article

#### Network security rules (NSGs)

If you need basic network level access control (based on IP address and the TCP or UDP protocols), you can use Network Security Groups (NSGs). An NSG is a basic, stateful, packet filtering firewall, and it enables you to control access based on a [5-tuple](https://www.techopedia.com/definition/28190/5-tuple). NSGs include functionality to simplify management and reduce the chances of configuration mistakes:

* **Augmented security rules** simplify NSG rule definition and allow you to create complex rules rather than having to create multiple simple rules to achieve the same result.
* **Service tags** are Microsoft created labels that represent a group of IP addresses. They update dynamically to include IP ranges that meet the conditions that define inclusion in the label. For example, if you want to create a rule that applies to all Azure storage on the east region you can use Storage.EastUS
* **Application security groups** allow you to deploy resources to application groups and control the access to those resources by creating rules that use those application groups. For example, if you have webservers deployed to the 'Webservers' application group you can create a rule that applies a NSG allowing 443 traffic from the Internet to all systems in the 'Webservers' application group.

NSGs do not provide application layer inspection or authenticated access controls.

Learn more:

* [Network Security Groups](../../virtual-network/network-security-groups-overview.md)

#### Defender for Cloud just in time VM access

[Microsoft Defender for Cloud](../../security-center/security-center-introduction.md) can manage the NSGs on VMs and lock access to the VM until a user with the appropriate Azure role-based access control [Azure RBAC](../../role-based-access-control/overview.md) permissions requests access. When the user is successfully authorized Defender for Cloud makes modifications to the NSGs to allow access to selected ports for the time specified. When the time expires the NSGs are restored to their previous secured state.

Learn more:

* [Microsoft Defender for Cloud Just in Time Access](../../security-center/security-center-just-in-time.md)

#### Service endpoints

Service endpoints are another way to apply control over your traffic. You can limit communication with supported services to just your VNets over a direct connection. Traffic from your VNet to the specified Azure service remains on the Microsoft Azure backbone network.  

Learn more:

* [Service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md#secure-azure-services-to-virtual-networks)

### Route control and forced tunneling

The ability to control routing behavior on your virtual networks is critical. If routing is configured incorrectly, applications and services hosted on your virtual machine might connect to unauthorized devices, including systems owned and operated by potential attackers.

Azure networking supports the ability to customize the routing behavior for network traffic on your virtual networks. This enables you to alter the default routing table entries in your virtual network. Control of routing behavior helps you make sure that all traffic from a certain device or group of devices enters or leaves your virtual network through a specific location.

For example, you might have a virtual network security appliance on your virtual network. You want to make sure that all traffic to and from your virtual network goes through that virtual security appliance. You can do this by configuring [User Defined Routes (UDRs)](../../virtual-network/virtual-networks-udr-overview.md#custom-routes) in Azure.

[Forced tunneling](../../vpn-gateway/vpn-gateway-about-forced-tunneling.md) is a mechanism you can use to ensure that your services are not allowed to initiate a connection to devices on the internet. Note that this is different from accepting incoming connections and then responding to them. Front-end web servers need to respond to requests from internet hosts, and so internet-sourced traffic is allowed inbound to these web servers and the web servers are allowed to respond.

What you don't want to allow is a front-end web server to initiate an outbound request. Such requests might represent a security risk because these connections can be used to download malware. Even if you do want these front-end servers to initiate outbound requests to the internet, you might want to force them to go through your on-premises web proxies. This enables you to take advantage of URL filtering and logging.

Instead, you would want to use forced tunneling to prevent this. When you enable forced tunneling, all connections to the internet are forced through your on-premises gateway. You can configure forced tunneling by taking advantage of UDRs.

Learn more:

* [Virtual network traffic routing](../../virtual-network/virtual-networks-udr-overview.md)

### Virtual network security appliances

While NSGs, UDRs, and forced tunneling provide you a level of security at the network and transport layers of the OSI model, you might also want to enable security at the application layer.

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

Azure Firewall is a cloud-native and intelligent network firewall security service that provides threat protection for your cloud workloads running in Azure. It is a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability. Azure Firewall inspects both east-west and north-south traffic.

Azure Firewall is available in three SKUs: Basic, Standard, and Premium. 

* [Azure Firewall Basic](../../firewall/basic-features.md) offers simplified security similar to the Standard SKU but without advanced features.
* [Azure Firewall Standard](../../firewall/features.md) provides L3-L7 filtering and threat intelligence feeds directly from Microsoft Cyber Security.
* [Azure Firewall Premium](../../firewall/premium-features.md) includes advanced capabilities such as signature-based IDPS for rapid attack detection by identifying specific patterns.

Learn more:

* [What is Azure Firewall](../../firewall/overview.md)

## Secure remote access and cross-premises connectivity

Setup, configuration, and management of your Azure resources needs to be done remotely. In addition, you might want to deploy [hybrid IT](https://social.technet.microsoft.com/wiki/contents/articles/18120.hybrid-cloud-infrastructure-design-considerations.aspx) solutions that have components on-premises and in the Azure public cloud. These scenarios require secure remote access.

Azure networking supports the following secure remote access scenarios:

* Connect individual workstations to a virtual network
* Connect your on-premises network to a virtual network with a VPN
* Connect your on-premises network to a virtual network with a dedicated WAN link
* Connect virtual networks to each other

### Connect individual workstations to a virtual network

You might want to enable individual developers or operations personnel to manage virtual machines and services in Azure. For instance, if you need access to a virtual machine on a virtual network but your security policy prohibits RDP or SSH remote access to individual virtual machines, you can use a [point-to-site VPN](../../vpn-gateway/point-to-site-about.md) connection.

A point-to-site VPN connection allows you to establish a private and secure connection between the user and the virtual network. Once the VPN connection is established, the user can RDP or SSH over the VPN link into any virtual machine on the virtual network, provided they are authenticated and authorized. Point-to-site VPN supports:

* **Secure Socket Tunneling Protocol (SSTP):** A proprietary SSL-based VPN protocol that can penetrate firewalls since most firewalls open TCP port 443, which TLS/SSL uses. SSTP is supported on Windows devices (Windows 7 and later).
* **IKEv2 VPN:** A standards-based IPsec VPN solution that can be used to connect from Mac devices (OSX versions 10.11 and above).
* **OpenVPN Protocol:** An SSL/TLS-based VPN protocol that can penetrate firewalls since most firewalls open TCP port 443 outbound, which TLS uses. OpenVPN can be used to connect from Android, iOS (versions 11.0 and above), Windows, Linux, and Mac devices (macOS versions 10.13 and above). Supported versions are TLS 1.2 and TLS 1.3 based on the TLS handshake.

Learn more:

* [About Point-to-site VPN routing](../../vpn-gateway/vpn-gateway-about-point-to-site-routing.md)

### Connect your on-premises network to a virtual network with a VPN Gateway

To connect your entire corporate network or specific segments to a virtual network, consider using a site-to-site VPN. This approach is common in hybrid IT scenarios where parts of a service are hosted both in Azure and on-premises. For example, you might have front-end web servers in Azure and back-end databases on-premises. Site-to-site VPNs enhance the security of managing Azure resources and enable scenarios like extending Active Directory domain controllers into Azure.

A site-to-site VPN differs from a point-to-site VPN in that it connects an entire network (such as your on-premises network) to a virtual network, rather than just a single device. Site-to-site VPNs use the highly secure IPsec tunnel mode VPN protocol to establish these connections.

Learn more:

* [About VPN Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md)

### Connect your on-premises network to a virtual network with a dedicated WAN link

Point-to-site and site-to-site VPN connections are useful for enabling cross-premises connectivity. However, they have some limitations:

* VPN connections transmit data over the internet, exposing them to potential security risks associated with public networks. Additionally, the reliability and availability of internet connections cannot be guaranteed.
* VPN connections to virtual networks may not provide sufficient bandwidth for certain applications, typically maxing out at around 200 Mbps.

For organizations requiring the highest levels of security and availability for their cross-premises connections, dedicated WAN links are often preferred. Azure offers solutions such as ExpressRoute, ExpressRoute Direct, and ExpressRoute Global Reach to facilitate these dedicated connections between your on-premises network and Azure virtual networks.

Learn more:

* [ExpressRoute overview](../../expressroute/expressroute-introduction.md)
* [ExpressRoute Direct](../../expressroute/expressroute-erdirect-about.md)
* [ExpressRoute Global Reach](../../expressroute/expressroute-global-reach.md)

### Connect virtual networks to each other

It is possible to use multiple virtual networks for your deployments for various reasons, such as simplifying management or increasing security. Regardless of the motivation, there might be times when you want resources on different virtual networks to connect with each other.

One option is to have services on one virtual network connect to services on another virtual network by "looping back" through the internet. This means the connection starts on one virtual network, goes through the internet, and then reaches the destination virtual network. However, this exposes the connection to the security risks inherent in internet-based communication.


A better option is to create a site-to-site VPN that connects the two virtual networks. This method uses the same IPsec tunnel mode protocol as the cross-premises site-to-site VPN connection mentioned earlier.


The advantage of this approach is that the VPN connection is established over the Azure network fabric, providing an extra layer of security compared to site-to-site VPNs that connect over the internet.

Learn more:

* [Configure a VNet-to-VNet connection by using the Azure portal](../../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md)

Another method to connect your virtual networks is through [VNet peering](../../virtual-network/virtual-network-peering-overview.md). VNet peering enables direct communication between two Azure virtual networks over the Microsoft backbone infrastructure, bypassing the public Internet. This feature supports peering within the same region or across different Azure regions. You can also use Network Security Groups (NSGs) to control and restrict connectivity between subnets or systems within the peered networks.

## Availability

Availability is crucial for any security program. If users and systems can't access necessary resources, the service is effectively compromised. Azure offers networking technologies that support high-availability mechanisms, including:

* HTTP-based load balancing
* Network-level load balancing
* Global load balancing

Load balancing distributes connections evenly across multiple devices, aiming to:

* **Increase availability:** By distributing connections, the service remains operational even if one or more devices become unavailable. The remaining devices continue to serve the content.
* **Enhance performance:** Distributing connections reduces the load on any single device, spreading processing and memory demands across multiple devices.
* **Facilitate scaling:** As demand increases, you can add more devices to the load balancer, allowing it to handle more connections.

### HTTP-based load balancing

Organizations that run web-based services often benefit from using an HTTP-based load balancer to ensure high performance and availability. Unlike traditional network-based load balancers that rely on network and transport layer protocols, HTTP-based load balancers make decisions based on HTTP protocol characteristics.

Azure Application Gateway and Azure Front Door offer HTTP-based load balancing for web services. Both services support:

* **Cookie-based session affinity:** Ensures that connections established to one server remain consistent between the client and server, maintaining transaction stability.
* **TLS offload:** Encrypts sessions between the client and the load balancer using HTTPS (TLS). To enhance performance, the connection between the load balancer and the web server can use HTTP (unencrypted), reducing the encryption overhead on web servers and allowing them to handle requests more efficiently.
* **URL-based content routing:** Allows the load balancer to forward connections based on the target URL, providing greater flexibility than IP address-based decisions.
* **Web Application Firewall:** Offers centralized protection for web applications against common threats and vulnerabilities.

Learn more:

* [Application Gateway overview](../../application-gateway/overview.md)
* [Azure Front Door overview](../../frontdoor/front-door-overview.md)
* [Web Application Firewall overview](../../web-application-firewall/overview.md)

### Network level load balancing

In contrast to HTTP-based load balancing, network-level load balancing makes decisions based on IP address and port (TCP or UDP) numbers. Azure Load Balancer provides network-level load balancing with the following key characteristics:

* Balances traffic based on IP address and port numbers.
* Supports any application layer protocol.
* Distributes traffic to Azure virtual machines and cloud service role instances.
* Can be used for both internet-facing (external load balancing) and non-internet-facing (internal load balancing) applications and virtual machines.
* Includes endpoint monitoring to detect and respond to service unavailability.

Learn more:

* [Internal load balancer overview](../../load-balancer/load-balancer-overview.md)

### Global load balancing

Some organizations want the highest level of availability possible. One way to reach this goal is to host applications in globally distributed datacenters. When an application is hosted in datacenters located throughout the world, it's possible for an entire geopolitical region to become unavailable, and still have the application up and running.

This load-balancing strategy can also yield performance benefits. You can direct requests for the service to the datacenter that is nearest to the device that is making the request.

In Azure, you can gain the benefits of global load balancing by using Azure Traffic Manager for DNS-based load balancing, Global Load Balancer for transport layer load balancing, or Azure Front Door for HTTP-based load balancing.

Learn more:

* [What is Traffic Manager?](../../traffic-manager/traffic-manager-overview.md)
* [Azure Front Door overview](../../frontdoor/front-door-overview.md)
* [Global Load Balancer overview](../../load-balancer/cross-region-overview.md)

## Name resolution
Name resolution is essential for all services hosted in Azure. From a security standpoint, compromising the name resolution function can allow attackers to redirect requests from your sites to malicious sites. Therefore, secure name resolution is crucial for all your cloud-hosted services.

There are two types of name resolution to consider:

* **Internal name resolution:** Used by services within your virtual networks, on-premises networks, or both. These names are not accessible over the internet. For optimal security, ensure that your internal name resolution scheme is not exposed to external users.
* **External name resolution:** Used by people and devices outside your on-premises and virtual networks. These names are visible on the internet and direct connections to your cloud-based services.

For internal name resolution, you have two options:

* **Virtual network DNS server:** When you create a new virtual network, Azure provides a DNS server that can resolve the names of machines within that virtual network. This DNS server is managed by Azure and is not configurable, helping to secure your name resolution.
* **Bring your own DNS server:** You can deploy a DNS server of your choice within your virtual network. This can be an Active Directory integrated DNS server or a dedicated DNS server solution from an Azure partner, available in the Azure Marketplace.

Learn more:

* [Virtual network overview](../../virtual-network/virtual-networks-overview.md)
* [Manage DNS Servers used by a virtual network](../../virtual-network/manage-virtual-network.yml#change-dns-servers)

For external name resolution, you have two options:

* Host your own external DNS server on-premises.
* Use an external DNS service provider.

Large organizations often host their own DNS servers on-premises due to their networking expertise and global presence.

However, for most organizations, using an external DNS service provider is preferable. These providers offer high availability and reliability for DNS services, which is crucial because DNS failures can make your internet-facing services unreachable.

Azure DNS offers a highly available and high-performing external DNS solution. It leverages Azure's global infrastructure, allowing you to host your domain in Azure with the same credentials, APIs, tools, and billing as your other Azure services. Additionally, it benefits from Azure's robust security controls.

Learn more:

* [Azure DNS overview](../../dns/dns-overview.md)
* [Azure DNS private zones](../../dns/private-dns-privatednszone.md) allows you to configure private DNS names for Azure resources rather than the automatically assigned names without the need to add a custom DNS solution.

## Perimeter network architecture

Many large organizations use perimeter networks to segment their networks, and create a buffer-zone between the internet and their services. The perimeter portion of the network is considered a low-security zone, and no high-value assets are placed in that network segment. You'll typically see network security devices that have a network interface on the perimeter network segment. Another network interface is connected to a network that has virtual machines and services that accept inbound connections from the internet.

You can design perimeter networks in a number of different ways. The decision to deploy a perimeter network, and then what type of perimeter network to use if you decide to use one, depends on your network security requirements.

Learn more:

* [Perimeter networks for security zones](network-best-practices.md#deploy-perimeter-networks-for-security-zones)

## Azure DDoS protection

Distributed denial of service (DDoS) attacks are significant availability and security threats for cloud applications. These attacks aim to deplete an application's resources, rendering it inaccessible to legitimate users. Any publicly reachable endpoint can be a target.

DDoS Protection features include:

* **Native platform integration:** Fully integrated into Azure with configuration available through the Azure portal. It understands your resources and their configurations.
* **Turn-key protection:** Automatically protects all resources on a virtual network as soon as DDoS Protection is enabled, without requiring user intervention. Mitigation begins instantly upon attack detection.
* **Always-on traffic monitoring:** Monitors your application traffic 24/7 for signs of DDoS attacks and initiates mitigation when protection policies are breached.
* **Attack Mitigation Reports:** Provides detailed information about attacks using aggregated network flow data.
* **Attack Mitigation Flow Logs:** Offers near real-time logs of dropped and forwarded traffic during an active DDoS attack.
* **Adaptive tuning:** Learns your application's traffic patterns over time and adjusts the protection profile accordingly. Provides Layer 3 to Layer 7 protection when used with a web application firewall.
* **Extensive mitigation scale:** Can mitigate over 60 different attack types with global capacity to handle the largest known DDoS attacks.
* **Attack metrics:** Summarized metrics from each attack are available through Azure Monitor.
* **Attack alerting:** Configurable alerts for the start, stop, and duration of an attack, integrating with tools like Azure Monitor logs, Splunk, Azure Storage, Email, and the Azure portal.
* **Cost guarantee:** Offers data-transfer and application scale-out service credits for documented DDoS attacks.
* **DDoS Rapid Response:** Provides access to a Rapid Response team during an active attack for investigation, custom mitigations, and post-attack analysis.

Learn more:

* [DDOS protection overview](../../ddos-protection/ddos-protection-overview.md)

## Azure Front Door

Azure Front Door allows you to define, manage, and monitor the global routing of your web traffic, optimizing it for performance and high availability. It enables you to create custom web application firewall (WAF) rules to protect your HTTP/HTTPS workloads from exploitation based on client IP addresses, country codes, and HTTP parameters. Additionally, Front Door supports rate limiting rules to combat malicious bot traffic, includes TLS offloading, and provides per-HTTP/HTTPS request application-layer processing.

The Front Door platform is protected by Azure infrastructure-level DDoS protection. For enhanced protection, you can enable Azure DDoS Network Protection at your VNets to safeguard resources from network layer (TCP/UDP) attacks through auto-tuning and mitigation. As a layer 7 reverse proxy, Front Door only allows web traffic to pass through to backend servers, blocking other types of traffic by default.

> [!NOTE]
> For web workloads, we highly recommend utilizing [**Azure DDoS protection**](../../ddos-protection/ddos-protection-overview.md) and a [**web application firewall**](../../web-application-firewall/overview.md) to safeguard against emerging DDoS attacks. Another option is to deploy [**Azure Front Door**](../../frontdoor/web-application-firewall.md) along with a web application firewall. Azure Front Door offers platform-level [**protection against network-level DDoS attacks**](../../frontdoor/front-door-ddos.md).

Learn more:

* For more information on the whole set of Azure Front door capabilities you can review the [Azure Front Door overview](../../frontdoor/front-door-overview.md)

## Azure Traffic manager

Azure Traffic Manager is a DNS-based traffic load balancer that distributes traffic to services across global Azure regions, ensuring high availability and responsiveness. It uses DNS to route client requests to the most suitable service endpoint based on a traffic-routing method and the health of the endpoints. An endpoint can be any Internet-facing service hosted inside or outside of Azure. Traffic Manager continuously monitors the endpoints and avoids directing traffic to any that are unavailable.

Learn more:

* [Azure Traffic manager overview](../../traffic-manager/traffic-manager-overview.md)

## Monitoring and threat detection

Azure provides capabilities to help you in this key area with early detection, monitoring, and collecting and reviewing network traffic.

### Azure Network Watcher

Azure Network Watcher provides tools to help troubleshoot and identify security issues.

* [Security Group View](../../network-watcher/network-watcher-security-group-view-overview.md): Audits and ensures security compliance of Virtual Machines by comparing baseline policies to effective rules, helping identify configuration drift.
* [Packet capture](../../network-watcher/network-watcher-packet-capture-overview.md): Captures network traffic to and from virtual machines, aiding in network statistics collection and application issue troubleshooting. It can also be triggered by Azure Functions in response to specific alerts.

For more information, see [Azure Network Watcher monitoring overview](../../network-watcher/network-watcher-monitoring-overview.md).

> [!NOTE]
> For the latest updates on service availability and status, visit the [Azure updates page](https://azure.microsoft.com/updates/?product=network-watcher).

### Microsoft Defender for Cloud

Microsoft Defender for Cloud helps you prevent, detect, and respond to threats, and provides you increased visibility into, and control over, the security of your Azure resources. It provides integrated security monitoring and policy management across your Azure subscriptions, helps detect threats that might otherwise go unnoticed, and works with a large set of security solutions.

Defender for Cloud helps you optimize and monitor network security by:

* Providing network security recommendations.
* Monitoring the state of your network security configuration.
* Alerting you to network based threats, both at the endpoint and network levels.

Learn more:

* [Introduction to Microsoft Defender for Cloud](../../security-center/security-center-introduction.md)

### Virtual Network TAP

Azure virtual network TAP (Terminal Access Point) allows you to continuously stream your virtual machine network traffic to a network packet collector or analytics tool. The collector or analytics tool is provided by a network virtual appliance partner. You can use the same virtual network TAP resource to aggregate traffic from multiple network interfaces in the same or different subscriptions.

Learn more:

* [Virtual network TAP](../../virtual-network/virtual-network-tap-overview.md)

### Logging

Logging at a network level is a key function for any network security scenario. In Azure, you can log information obtained for NSGs to get network level logging information. With NSG logging, you get information from:

* [Activity logs](/azure/azure-monitor/essentials/platform-logs-overview). Use these logs to view all operations submitted to your Azure subscriptions. These logs are enabled by default and can be used within the Azure portal. They were previously known as audit or operational logs.
* Event logs. These logs provide information about what NSG rules were applied.
* Counter logs. These logs let you know how many times each NSG rule was applied to deny or allow traffic.

You can also use Microsoft Power BI, a powerful data visualization tool, to view and analyze these logs.
Learn more:

* [Azure Monitor logs for Network Security Groups (NSGs)](../../virtual-network/virtual-network-nsg-manage-log.md)
