---
title: Azure network security overview
description: Learn about network security concepts and capabilities in Azure, including network access control, Azure Firewall, secure remote access, availability, name resolution, and DDoS protection.
services: security
author: msmbaldwin

ms.assetid: bedf411a-0781-47b9-9742-d524cf3dbfc1
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 11/10/2025
ms.author: mbaldwin
#Customer intent: As an IT Pro or decision maker, I am looking for information on the network security controls available in Azure.

---
# Azure network security overview

Network security protects resources from unauthorized access or attack by controlling network traffic. Azure provides a robust networking infrastructure to support your application and service connectivity requirements, with security controls at every layer.

This article covers key network security capabilities in Azure:

* Network access control
* Azure Firewall
* Secure remote access and cross-premises connectivity
* Availability and load balancing
* Name resolution
* DDoS protection
* Azure Front Door
* Monitoring and threat detection

> [!NOTE]
> For web workloads, we recommend using [Azure DDoS Protection](/azure/ddos-protection/ddos-protection-overview) and a [web application firewall](/azure/web-application-firewall/overview) to protect against DDoS attacks. [Azure Front Door](/azure/frontdoor/web-application-firewall) with a web application firewall provides platform-level protection against network-level DDoS attacks.

## Azure Virtual Network

Azure Virtual Network is the fundamental building block for your private network in Azure. Each virtual network is isolated from other virtual networks, helping ensure that network traffic in your deployments isn't accessible to other Azure customers. Virtual networks enable Azure resources to securely communicate with each other, the internet, and on-premises networks.

Learn more:

* [Azure Virtual Network overview](/azure/virtual-network/virtual-networks-overview)
* [Plan virtual networks](/azure/virtual-network/virtual-network-vnet-plan-design-arm)

## Network access control

Network access control limits connectivity to and from specific devices or subnets within a virtual network. The goal is to restrict access to your virtual machines and services to approved users and devices.

### Network Security Groups

Network Security Groups (NSGs) provide basic, stateful packet filtering based on IP address and TCP/UDP protocols. NSGs control access using a 5-tuple (source IP, source port, destination IP, destination port, protocol).

NSGs include features to simplify management:

* **Augmented security rules**: Create complex rules instead of multiple simple rules to achieve the same result
* **Service tags**: Microsoft-managed labels representing groups of IP addresses that update dynamically
* **Application security groups**: Organize resources into application groups and control access based on those groups

Learn more:

* [Network Security Groups](/azure/virtual-network/network-security-groups-overview)
* [Network security best practices](/azure/security/fundamentals/network-best-practices)

### Service endpoints

Virtual Network service endpoints extend your virtual network private address space to Azure services over a direct connection. Service endpoints keep traffic on the Azure backbone network and restrict communication with supported services to your virtual networks only.

Learn more:

* [Virtual Network service endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview)

### Azure Private Link

Azure Private Link provides private connectivity from a virtual network to Azure PaaS services, customer-owned services, or Microsoft partner services. Private Link traffic remains on the Microsoft Azure backbone network, eliminating exposure to the public internet.

Learn more:

* [What is Azure Private Link?](/azure/private-link/private-link-overview)
* [Private endpoints](/azure/private-link/private-endpoint-overview)

## Azure Firewall

Azure Firewall is a cloud-native, intelligent network firewall security service providing threat protection for cloud workloads. It's a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability.

Azure Firewall is available in three SKUs:

* **Azure Firewall Basic**: Simplified security for small and medium-sized businesses
* **Azure Firewall Standard**: L3-L7 filtering and threat intelligence from Microsoft Cyber Security
* **Azure Firewall Premium**: Advanced capabilities including signature-based IDPS for rapid attack detection

Learn more:

* [What is Azure Firewall?](/azure/firewall/overview)
* [Choose the right Azure Firewall SKU](/azure/firewall/choose-firewall-sku)
* [Threat detection and protection overview](/azure/security/fundamentals/threat-detection)

## Secure remote access and cross-premises connectivity

Azure supports several secure remote access scenarios for managing Azure resources and deploying hybrid IT solutions.

### Point-to-site VPN

Point-to-site VPN connections enable individual users to establish private, secure connections to a virtual network. Users can access virtual machines and services in Azure after authenticating. Point-to-site VPN supports:

* **Secure Socket Tunneling Protocol (SSTP)**: Proprietary SSL-based VPN protocol (Windows devices)
* **IKEv2 VPN**: Standards-based IPsec VPN solution (Mac devices)
* **OpenVPN Protocol**: SSL/TLS-based VPN protocol (Android, iOS, Windows, Linux, and Mac devices)

Learn more:

* [About point-to-site VPN](/azure/vpn-gateway/point-to-site-about)
* [Configure a point-to-site VPN connection](/azure/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal)

### Site-to-site VPN

Site-to-site VPN Gateway connections establish secure cross-premises connectivity between your on-premises network and Azure virtual networks. Site-to-site VPNs use the highly secure IPsec tunnel mode VPN protocol.

VPN Gateway is essential for hybrid IT scenarios where parts of a service are hosted both in Azure and on-premises.

Learn more:

* [About VPN Gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways)
* [Create a site-to-site connection](/azure/vpn-gateway/tutorial-site-to-site-portal)

### ExpressRoute

ExpressRoute provides dedicated WAN links between your on-premises network and Microsoft cloud services. ExpressRoute connections don't traverse the public internet, offering enhanced security, reliability, speed, and lower latency compared to internet connections.

ExpressRoute supports:

* **ExpressRoute Direct**: Direct connectivity to Microsoft global network
* **ExpressRoute Global Reach**: Connectivity between your on-premises sites through ExpressRoute circuits

Learn more:

* [ExpressRoute overview](/azure/expressroute/expressroute-introduction)
* [ExpressRoute connectivity models](/azure/expressroute/expressroute-connectivity-models)

### VNet peering

Virtual Network peering connects two Azure virtual networks, enabling resources in either network to communicate with each other. VNet peering uses the Microsoft backbone infrastructure, bypassing the public internet. Peering supports connections within the same Azure region or across different regions (global VNet peering).

Learn more:

* [Virtual network peering](/azure/virtual-network/virtual-network-peering-overview)
* [Create a VNet peering](/azure/virtual-network/tutorial-connect-virtual-networks-portal)

## Availability and load balancing

Load balancing distributes connections across multiple devices to increase availability and performance. Azure provides several load balancing options.

### Azure Load Balancer

Azure Load Balancer provides high-performance, low-latency Layer 4 load balancing for all UDP and TCP protocols. Load Balancer distributes inbound traffic to backend instances according to configured rules and health probes.

Load Balancer features include:

* Support for internal and external load-balancing scenarios
* Zone redundancy and zonal deployments
* TCP and UDP application support
* Health probes to determine backend instance availability

Learn more:

* [What is Azure Load Balancer?](/azure/load-balancer/load-balancer-overview)
* [Standard Load Balancer and availability zones](/azure/load-balancer/load-balancer-standard-availability-zones)

### Azure Application Gateway

Azure Application Gateway is a web traffic load balancer (Layer 7) that manages traffic to your web applications. Application Gateway makes routing decisions based on HTTP request attributes such as URI path or host headers.

Application Gateway features include:

* Web Application Firewall (WAF) for centralized protection
* TLS termination to reduce encryption overhead on web servers
* Cookie-based session affinity
* URL-based content routing
* Autoscaling and zone redundancy

Learn more:

* [What is Azure Application Gateway?](/azure/application-gateway/overview)
* [Application Gateway components](/azure/application-gateway/application-gateway-components)

### Azure Traffic Manager

Azure Traffic Manager is a DNS-based traffic load balancer that distributes traffic optimally to services across global Azure regions. Traffic Manager provides high availability and responsiveness by routing client requests to the most appropriate service endpoint based on traffic-routing method and endpoint health.

Traffic Manager supports multiple routing methods including priority, weighted, performance, geographic, multivalue, and subnet routing.

Learn more:

* [What is Traffic Manager?](/azure/traffic-manager/traffic-manager-overview)
* [Traffic Manager routing methods](/azure/traffic-manager/traffic-manager-routing-methods)

## Name resolution

Secure name resolution is crucial for all cloud-hosted services. Compromised name resolution functions can redirect requests to malicious sites.

### Azure DNS

Azure DNS provides highly available and performant name resolution using Microsoft Azure infrastructure. Azure DNS supports:

* Public DNS domains hosted on Azure global infrastructure
* Private DNS zones for name resolution within and across virtual networks
* Split-horizon DNS scenarios where the same domain name resolves differently for private and public queries

Learn more:

* [Azure DNS overview](/azure/dns/dns-overview)
* [Azure Private DNS zones](/azure/dns/private-dns-overview)

## DDoS protection

Distributed denial of service (DDoS) attacks are among the largest availability and security concerns for customers moving applications to the cloud. Azure DDoS Protection safeguards Azure resources from DDoS attacks.

Azure DDoS Protection SKUs:

* **DDoS Infrastructure Protection**: Basic protection enabled by default on all Azure properties at no additional cost
* **DDoS Network Protection**: Advanced protection for resources in virtual networks with adaptive tuning, mitigation policies, and monitoring

DDoS Network Protection features include:

* Native platform integration with configuration through the Azure portal
* Always-on traffic monitoring and real-time mitigation
* Attack analytics including mitigation reports and flow logs
* Adaptive tuning based on application traffic patterns
* Cost guarantee including data transfer and application scale-out service credits

Learn more:

* [Azure DDoS Protection overview](/azure/ddos-protection/ddos-protection-overview)
* [Manage DDoS Protection](/azure/ddos-protection/manage-ddos-protection)

## Azure Front Door

Azure Front Door is a global, scalable entry point that uses the Microsoft global edge network to create fast, secure, and widely scalable web applications. Front Door provides Layer 7 load balancing, TLS termination, URL-based routing, and integrated security.

Front Door capabilities include:

* Global HTTP load balancing with instant failover
* TLS termination at the edge
* URL path-based routing
* Cookie-based session affinity
* Web Application Firewall protection
* Platform-level DDoS protection
* Private Link integration to protect backend origins

Learn more:

* [What is Azure Front Door?](/azure/frontdoor/front-door-overview)
* [Front Door routing architecture](/azure/frontdoor/front-door-routing-architecture)

## Monitoring and threat detection

Azure provides tools to monitor network security and detect threats.

### Azure Network Watcher

Azure Network Watcher provides tools to monitor, diagnose, and gain insights into your network in Azure.

Network Watcher capabilities include:

* **Connection Monitor**: Monitors connectivity between Azure resources and endpoints
* **NSG flow logs**: Logs information about IP traffic flowing through Network Security Groups
* **Packet capture**: Captures network traffic to and from virtual machines
* **VPN troubleshoot**: Diagnoses issues with VPN Gateways and connections
* **Network diagnostics**: Validates network configuration and identifies security issues

Learn more:

* [What is Azure Network Watcher?](/azure/network-watcher/network-watcher-overview)
* [Network Watcher monitoring overview](/azure/network-watcher/network-watcher-monitoring-overview)

### Microsoft Defender for Cloud

Microsoft Defender for Cloud helps you prevent, detect, and respond to threats with increased visibility and control over the security of your Azure resources. Defender for Cloud provides network security recommendations, monitors network security configuration, and alerts you to network-based threats.

Learn more:

* [Introduction to Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction)
* [Protect your network resources](/azure/defender-for-cloud/protect-network-resources)
* [Threat detection overview](/azure/security/fundamentals/threat-detection)

## Next steps

* [Azure security best practices and patterns](/azure/security/fundamentals/best-practices-and-patterns)
* [Network security best practices](/azure/security/fundamentals/network-best-practices)
* [Identity management security overview](/azure/security/fundamentals/identity-management-overview)
* [Threat detection and protection](/azure/security/fundamentals/threat-detection)
