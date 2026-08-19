---
title: Azure Networking Services and Categories
description: Learn about Azure networking services, including foundation, load balancing, hybrid connectivity, network security, and container networking.
author: mbender-ms
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 07/27/2026
ms.author: mbender
ms.custom: sfi-image-nochange
ai-usage: ai-assisted
# Customer intent: "As a cloud architect, I want to understand the various Azure networking services, so that I can design and implement a secure, efficient networking infrastructure for my applications and resources in the cloud."
---

# Azure networking services overview

Azure networking services connect your Azure resources to each other, to on-premises networks, and to the internet. They load balance, secure, and monitor that traffic. Together, these services let you build a private, highly available, and protected network in the cloud without deploying or maintaining physical network hardware.

This article is the entry point to the Azure networking documentation. It groups the services into six categories, summarizes what each service does, and links to each category hub where you can explore that area in depth.

Azure networking services fall into six categories. Select a category to explore its services:

- [**Networking foundation**](./foundations/network-foundations-overview.md): Core connectivity for your resources in Azure - Virtual Network (VNet), Private Link, Azure DNS, Azure Bastion, Route Server, NAT Gateway, and Traffic Manager.
- [**Load balancing and content delivery**](./load-balancer-content-delivery/load-balancing-content-delivery-overview.md): Manage, distribute, and optimize your applications and workloads - Load Balancer, Application Gateway, and Azure Front Door.
- [**Hybrid connectivity**](./hybrid-connectivity/hybrid-connectivity.md): Secure communication to and from your resources in Azure - VPN Gateway, ExpressRoute, Virtual WAN, and Peering Service.
- [**Network security**](./security/network-security.md): Protect your web applications and IaaS services from DDoS attacks and malicious actors - Firewall Manager, Firewall, Web Application Firewall, and DDoS Protection.
- [**Network management and monitoring**](./monitoring-management/index.yml): Manage and monitor your network resources - Network Watcher, Azure Monitor, and Azure Virtual Network Manager.
- [**Container networking**](/azure/aks/advanced-container-networking-services-overview): Enhanced security and observability for containerized workloads on Azure Kubernetes Service (AKS) - Container network security and Container network observability.

The following table summarizes each networking category, its key services, and its primary use case:

| Category | Key services | Primary use case | Learn more |
|---|---|---|---|
| Networking foundation | Virtual Network, Private Link, Azure DNS, Azure Bastion, Route Server, NAT Gateway, Traffic Manager | Core connectivity for resources in Azure | [Azure networking foundation services](./foundations/network-foundations-overview.md) |
| Load balancing and content delivery | Load Balancer, Application Gateway, Azure Front Door | Distribute and optimize application traffic | [Azure load balancing and content delivery services](./load-balancer-content-delivery/load-balancing-content-delivery-overview.md) |
| Hybrid connectivity | VPN Gateway, ExpressRoute, Virtual WAN, Peering Service | Connect on-premises networks to Azure | [Azure hybrid connectivity services](./hybrid-connectivity/hybrid-connectivity.md) |
| Network security | Firewall Manager, Firewall, Web Application Firewall, DDoS Protection | Protect applications and resources from threats | [Azure network security services](./security/network-security.md) |
| Network management and monitoring | Network Watcher, Azure Monitor, Azure Virtual Network Manager | Manage and monitor network resources | [Azure network management and monitoring services](./monitoring-management/index.yml) |
| Container networking | Container network security, Container network observability | Secure and observe AKS container traffic | [Advanced Container Networking Services](/azure/aks/advanced-container-networking-services-overview) |

## <a name="foundation"></a>Azure networking foundation services

This section describes services that provide the building blocks for designing and architecting a network environment in Azure - Virtual Network (VNet), Private Link, Azure DNS, Azure Bastion, Route Server, NAT Gateway, and Traffic Manager.

### <a name="vnet"></a>Virtual network

[Azure Virtual Network (VNet)](../virtual-network/virtual-networks-overview.md) is the fundamental building block for your private network in Azure. Use VNets to:

- **Communicate between Azure resources**: Deploy virtual machines and several other types of Azure resources to a virtual network, such as Azure App Service Environments, Azure Kubernetes Service (AKS), and Azure Virtual Machine Scale Sets. To view a complete list of Azure resources that you can deploy into a virtual network, see [Virtual network service integration](../virtual-network/vnet-integration-for-azure-services.md).
- **Communicate between each other**: Connect virtual networks to each other, enabling resources in either virtual network to communicate with each other, by using virtual network peering or Azure Virtual Network Manager. The virtual networks you connect can be in the same, or different, Azure regions. For more information, see [Virtual network peering](../virtual-network/virtual-network-peering-overview.md) and [Azure Virtual Network Manager](../virtual-network-manager/overview.md).
- **Communicate to the internet**: All resources in a virtual network can communicate outbound to the internet, by default. You can communicate inbound to a resource by assigning a public IP address or a public Load Balancer. You can also use [Public IP addresses](../virtual-network/ip-services/virtual-network-public-ip-address.md) or a public [Load Balancer](../load-balancer/load-balancer-overview.md) to manage your outbound connections.
- **Communicate with on-premises networks**: Connect your on-premises computers and networks to a virtual network by using [VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) or [ExpressRoute](../expressroute/expressroute-introduction.md).
- **Encrypt traffic between resources**: Use [Virtual network encryption](../virtual-network/virtual-network-encryption-overview.md) to encrypt traffic between resources in a virtual network.

#### <a name="nsg"></a>Network security groups

Filter network traffic to and from Azure resources in an Azure virtual network by using a network security group. For more information, see [Network security groups](../virtual-network/network-security-groups-overview.md).

#### <a name="serviceendpoints"></a>Service endpoints

[Virtual Network (VNet) service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) extend your virtual network private address space and the identity of your virtual network to the Azure services, over a direct connection. Endpoints allow you to secure your critical Azure service resources to only your virtual networks. Traffic from your virtual network to the Azure service always remains on the Microsoft Azure backbone network.

:::image type="content" source="./media/networking-overview/vnet-service-endpoints-overview.png" alt-text="Diagram of virtual network service endpoints.":::

### <a name="privatelink"></a>Azure Private Link

[Azure Private Link](../private-link/private-link-overview.md) lets you access Azure PaaS services (for example, Azure Storage and SQL Database) and Azure hosted customer-owned or partner services over a private endpoint in your virtual network.
Traffic between your virtual network and the service travels through the Microsoft backbone network. You no longer need to expose your service to the public internet. You can create your own private link service in your virtual network and deliver it to your customers.

:::image type="content" source="./media/networking-overview/private-endpoint.png" alt-text="Diagram of a private endpoint in a hub virtual network connecting spoke networks privately to Azure PaaS, partner, and customer-owned services.":::

### <a name="dns"></a>Azure DNS

[Azure DNS](../dns/index.yml) provides DNS hosting and resolution by using the Microsoft Azure infrastructure. Azure DNS consists of three services:

- [Azure Public DNS](../dns/dns-overview.md) is a hosting service for DNS domains. By hosting your domains in Azure, you can manage your DNS records by using the same credentials, APIs, tools, and billing as your other Azure services.
- [Azure Private DNS](../dns/private-dns-overview.md) is a DNS service for your virtual networks. Azure Private DNS manages and resolves domain names in the virtual network without configuring a custom DNS solution.
- [Azure DNS Private Resolver](../dns/dns-private-resolver-overview.md) is a service for querying Azure DNS private zones from an on-premises environment and vice versa without deploying VM-based DNS servers.

By using Azure DNS, you can host and resolve public domains, manage DNS resolution in your virtual networks, and enable name resolution between Azure and your on-premises resources.

### <a name="bastion"></a>Azure Bastion

[Azure Bastion](../bastion/bastion-overview.md) is a service that you can deploy in a virtual network to connect to a virtual machine by using your browser and the Azure portal. You can also connect by using the native SSH or RDP client already installed on your local computer. The Azure Bastion service is a fully platform-managed PaaS service that you deploy inside your virtual network. It provides secure and seamless RDP/SSH connectivity to your virtual machines directly from the Azure portal over TLS. When you connect through Azure Bastion, your virtual machines don't need a public IP address, agent, or special client software. Azure Bastion offers four SKU tiers: Developer, Basic, Standard, and Premium. The tier you select affects the available features. For more information, see [About Bastion configuration settings](../bastion/configuration-settings.md).

:::image type="content" source="../bastion/media/bastion-overview/architecture.png" alt-text="Diagram showing Azure Bastion architecture.":::

### <a name="routeserver"></a>Azure Route Server

[Azure Route Server](../route-server/overview.md) simplifies dynamic routing between your network virtual appliance (NVA) and your virtual network. You can exchange routing information directly through Border Gateway Protocol (BGP) routing protocol between any NVA that supports the BGP routing protocol and the Azure Software Defined Network (SDN) in the Azure Virtual Network (VNet) without manually configuring or maintaining route tables.

:::image type="content" source="../route-server/media/overview/route-server-overview.png" alt-text="Diagram showing Azure Route Server configured in a virtual network.":::

### <a name="nat"></a>NAT Gateway

NAT Gateway simplifies outbound-only internet connectivity for virtual networks. When you configure it on a subnet, all outbound connectivity uses your specified static public IP addresses. Outbound connectivity is possible without a load balancer or public IP addresses directly attached to virtual machines.
For more information, see [What is Azure NAT gateway](../nat-gateway/nat-overview.md).

:::image type="content" source="./media/networking-overview/flow-map.png" alt-text="Diagram of a NAT gateway using a public IP and IP prefix to provide outbound connectivity for two subnets in a virtual network.":::

### <a name="trafficmanager"></a>Traffic Manager

[Azure Traffic Manager](../traffic-manager/traffic-manager-routing-methods.md) is a DNS-based traffic load balancer that distributes traffic optimally to services across global Azure regions, while providing high availability and responsiveness. Traffic Manager provides a range of traffic-routing methods to distribute traffic such as priority, weighted, performance, geographic, multivalue, or subnet.

The following diagram shows endpoint priority-based routing with Traffic Manager:

:::image type="content" source="./media/networking-overview/priority.png" alt-text="Diagram of Azure Traffic Manager Priority traffic-routing method.":::

For more information about Traffic Manager, see [What is Azure Traffic Manager?](../traffic-manager/traffic-manager-overview.md)

## <a name="delivery"></a>Azure load balancing and content delivery services

This section describes networking services in Azure that help deliver applications and workloads - Load Balancer, Application Gateway, and Azure Front Door.

### <a name="loadbalancer"></a>Load Balancer

> [!IMPORTANT]
> On September 30, 2025, Basic Load Balancer was retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer/). If you're currently using Basic Load Balancer, upgrade to Standard Load Balancer as soon as possible. For guidance on upgrading, see [Upgrading from Basic Load Balancer - Guidance](../load-balancer/load-balancer-basic-upgrade-guidance.md).

[Azure Load Balancer](../load-balancer/load-balancer-overview.md) provides high-performance, low-latency Layer 4 load-balancing for all UDP and TCP protocols. It manages inbound and outbound connections. You can configure public and internal load-balanced endpoints. You can define rules to map inbound connections to back-end pool destinations by using TCP and HTTP health-probing options to manage service availability.

Azure Load Balancer is available in Standard and Gateway SKUs.

The following diagram shows an internet-facing multitier application that uses both external and internal load balancers:

:::image type="content" source="./media/networking-overview/load-balancer.png" alt-text="Diagram of a public load balancer distributing web-tier traffic and an internal load balancer distributing business-tier traffic in a virtual network.":::

### <a name="applicationgateway"></a>Application Gateway

[Azure Application Gateway](../application-gateway/overview.md) is a web traffic load balancer that you can use to manage traffic to your web applications. It's an Application Delivery Controller (ADC) as a service, offering various Layer 7 load-balancing capabilities for your applications.

The following diagram shows URL path-based routing with Application Gateway.

:::image type="content" source="./media/networking-overview/figure1-720.png" alt-text="Diagram of Application Gateway routing a browser request through an HTTP listener and rule to a backend pool of VMs and servers.":::

### <a name="frontdoor"></a>Azure Front Door

[Azure Front Door](../frontdoor/front-door-overview.md) helps you define, manage, and monitor the global routing for your web traffic by optimizing for best performance and instant global failover for high availability. By using Front Door, you can transform your global (multiregion) consumer and enterprise applications into robust, high-performance personalized modern applications, APIs, and content that reach a global audience with Azure. Use Front Door when you need a global, Layer 7 entry point that combines content delivery network (CDN) caching, SSL offload, and a web application firewall (WAF) in front of multiregion backends.

:::image type="content" source="./media/networking-overview/front-door-visual-diagram.png" alt-text="Diagram of Azure Front Door service with Web Application Firewall.":::

## <a name="hybrid"></a>Azure hybrid connectivity services

This section describes network connectivity services that securely connect your on-premises network and Azure - VPN Gateway, ExpressRoute, Virtual WAN, and Peering Service.

### <a name="vpngateway"></a>VPN Gateway

[VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) helps you create encrypted cross-premises connections to your virtual network from on-premises locations, or create encrypted connections between VNets. Different configurations are available for VPN Gateway connections. Some of the main features include:

- Site-to-site VPN connectivity
- Point-to-site VPN connectivity
- VNet-to-VNet VPN connectivity

The following diagram illustrates multiple site-to-site VPN connections to the same virtual network. To view more connection diagrams, see [VPN Gateway - design](../vpn-gateway/design.md).

:::image type="content" source="../vpn-gateway/media/design/multi-site.png" alt-text="Diagram showing multiple site-to-site Azure VPN Gateway connections.":::

### <a name="expressroute"></a>ExpressRoute

[ExpressRoute](../expressroute/expressroute-introduction.md) extends your on-premises networks into the Microsoft cloud over a private connection that a connectivity provider facilitates. This connection is private. Traffic doesn't go over the internet. By using ExpressRoute, you can connect to Microsoft cloud services such as Microsoft Azure, Microsoft 365, and Dynamics 365.

:::image type="content" source="./media/networking-overview/expressroute-connection-overview.png" alt-text="Diagram of an ExpressRoute circuit connecting a customer network through a partner edge to Microsoft public services and Azure virtual networks." border="false":::

### <a name="virtualwan"></a>Virtual WAN

[Azure Virtual WAN](../virtual-wan/virtual-wan-about.md) is a networking service that brings many networking, security, and routing functionalities together to provide a single operational interface. You connect to Azure VNets by using virtual network connections. Some of the main features include:

- Branch connectivity (via connectivity automation from Virtual WAN Partner devices such as SD-WAN or VPN CPE)
- Site-to-site VPN connectivity
- Remote user VPN connectivity (point-to-site)
- Private connectivity (ExpressRoute)
- Intra-cloud connectivity (transitive connectivity for virtual networks)
- VPN ExpressRoute inter-connectivity
- Routing, Azure Firewall, and encryption for private connectivity

:::image type="content" source="../virtual-wan/media/virtual-wan-about/virtual-wan-diagram.png" alt-text="Diagram of Azure Virtual WAN connecting virtual networks, branch offices, ExpressRoute, and remote users through a central hub." lightbox="../virtual-wan/media/virtual-wan-about/virtual-wan-diagram.png":::

### <a name="azurepeeringservice"></a>Peering Service

[Azure Peering Service](../peering-service/about.md) enhances customer connectivity to Microsoft cloud services such as Microsoft 365, Dynamics 365, software as a service (SaaS), Azure, or any Microsoft services accessible over the public internet. Peering Service partners provide optimized, reliable routing to Microsoft's network edge, which reduces latency and packet loss compared to typical internet transit for traffic bound for Microsoft cloud services.

## <a name="security"></a>Azure network security services

This section describes networking services in Azure that protect and monitor your network resources - Firewall Manager, Firewall, Web Application Firewall, and DDoS Protection.

### <a name="security-center"></a>Firewall Manager

[Azure Firewall Manager](../firewall-manager/overview.md) is a security management service that provides central security policy and routing management for cloud-based security perimeters. Firewall Manager can provide security management for two types of network architecture: secure virtual hub and hub virtual network. Use Azure Firewall Manager to deploy multiple Azure Firewall instances across Azure regions and subscriptions, implement DDoS protection plans, manage web application firewall policies, and integrate with partner security-as-a-service for enhanced security.

:::image type="content" source="./media/networking-overview/trusted-security-partners.png" alt-text="Diagram of multiple Azure Firewalls in a secure virtual hub and hub virtual network.":::

### <a name="firewall"></a>Azure Firewall

[Azure Firewall](../firewall/overview.md) is a managed, cloud-based network security service that protects your Azure Virtual Network resources. By using Azure Firewall, you can centrally create, enforce, and log application and network connectivity policies across subscriptions and virtual networks. Azure Firewall uses a static public IP address for your virtual network resources, so outside firewalls can identify traffic originating from your virtual network.

:::image type="content" source="./media/networking-overview/firewall-threat.png" alt-text="Diagram of Azure Firewall in a central virtual network filtering traffic between spoke networks, on-premises, and the internet.":::

### <a name="waf"></a>Web Application Firewall

[Azure Web Application Firewall](../web-application-firewall/overview.md) (WAF) protects your web applications from common web exploits and vulnerabilities such as SQL injection and cross-site scripting. Azure WAF provides out-of-the-box protection from OWASP Top 10 vulnerabilities via managed rules. Additionally, you can configure custom rules to provide extra protection based on source IP range and request attributes such as headers, cookies, form data fields, or query string parameters.

You can deploy [Azure WAF with Application Gateway](../web-application-firewall/ag/ag-overview.md), which provides regional protection to entities in public and private address space. You can also deploy [Azure WAF with Front Door](../web-application-firewall/afds/afds-overview.md), which provides protection at the network edge to public endpoints.

:::image type="content" source="./media/networking-overview/waf-overview.png" alt-text="Diagram of Web Application Firewall blocking SQL injection, cross-site scripting, and bot attacks while allowing valid requests through.":::

### <a name="ddosprotection"></a>DDoS Protection

[Azure DDoS Protection](../ddos-protection/manage-ddos-protection.md) provides countermeasures against the most sophisticated DDoS threats. The service provides enhanced DDoS mitigation capabilities for your application and resources deployed in your virtual networks. Additionally, with Azure DDoS Protection, you have access to DDoS Rapid Response support to engage DDoS experts during an active attack.

Azure DDoS Protection consists of two tiers:

- [DDoS Network Protection](../ddos-protection/ddos-protection-overview.md#ddos-network-protection), combined with application design best practices, provides enhanced DDoS mitigation features to defend against DDoS attacks. It's automatically tuned to help protect your specific Azure resources in a virtual network.
- [DDoS IP Protection](../ddos-protection/ddos-protection-overview.md#ddos-ip-protection) is a pay-per-protected IP model. DDoS IP Protection contains the same core engineering features as DDoS Network Protection, but differs in the following value-added services: DDoS rapid response support, cost protection, and discounts on WAF.

:::image type="content" source="./media/networking-overview/ddos-protection-overview-architecture.png" alt-text="Diagram of the reference architecture for a DDoS protected PaaS web application.":::

## <a name="management"></a>Azure network management and monitoring services

This section describes network management and monitoring services in Azure - Network Watcher, Azure Monitor, and Azure Virtual Network Manager.

### <a name="networkwatcher"></a>Azure Network Watcher

[Azure Network Watcher](../network-watcher/network-watcher-overview.md?toc=%2fazure%2fnetworking%2ftoc.json) provides tools to monitor, diagnose, view metrics, and enable or disable logs for resources in an Azure virtual network.

:::image type="content" source="../network-watcher/media/network-watcher-overview/network-watcher-capabilities.png" alt-text="Diagram showing Azure Network Watcher's capabilities.":::

### <a name="azuremonitor"></a>Azure Monitor

[Azure Monitor](/azure/azure-monitor/overview?toc=%2fazure%2fnetworking%2ftoc.json) maximizes the availability and performance of your applications by delivering a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments. It helps you understand how your applications are performing and proactively identifies issues affecting them and the resources they depend on.

### <a name="avnm"></a>Azure Virtual Network Manager

[Azure Virtual Network Manager](../virtual-network-manager/overview.md) is a management service that you use to group, configure, deploy, and manage virtual networks globally across subscriptions. By using Virtual Network Manager, you can define [network groups](../virtual-network-manager/concept-network-groups.md) to identify and logically segment your virtual networks. Then you can determine the [connectivity](../virtual-network-manager/concept-connectivity-configuration.md) and [security configurations](../virtual-network-manager/concept-security-admins.md) you want and apply them across all the selected virtual networks in network groups at once.

:::image type="content" source="../virtual-network-manager/media/create-virtual-network-manager-portal/virtual-network-manager-resources-diagram.png" alt-text="Diagram of resources deployed for a mesh virtual network topology with Azure virtual network manager.":::

## <a name="containers"></a>Azure container networking services

This section describes services that secure and monitor network traffic for containerized workloads running on Azure Kubernetes Service (AKS) - Container network security and Container network observability. Both services are part of [Advanced Container Networking Services](/azure/aks/advanced-container-networking-services-overview).

### <a name="container-security"></a>Container network security

Container network security provides enhanced control over AKS network security. By using features like fully qualified domain name (FQDN) filtering, clusters that use Azure CNI Powered by Cilium can implement FQDN-based network policies to achieve a Zero Trust security architecture in AKS.

### <a name="container-monitoring"></a>Container network observability

Container network observability uses Hubble's control plane to provide comprehensive visibility into AKS networking and performance. It offers real-time, detailed insights across node-level, pod-level, TCP, and DNS metrics, ensuring thorough monitoring of your network infrastructure.

:::image type="content" source="./media/networking-overview/advanced-network-observability.png" alt-text="Diagram of Container Network Observability.":::

## Related content

- [Azure networking foundation services](./foundations/network-foundations-overview.md)
- [Azure load balancing and content delivery services](./load-balancer-content-delivery/load-balancing-content-delivery-overview.md)
- [Azure hybrid connectivity services](./hybrid-connectivity/hybrid-connectivity.md)
- [Azure network security services](./security/network-security.md)
- [Azure network management and monitoring services](./monitoring-management/index.yml)
- [Advanced Container Networking Services](/azure/aks/advanced-container-networking-services-overview)
- [Create your first virtual network](../virtual-network/quickstart-create-virtual-network.md?toc=%2fazure%2fnetworking%2ftoc.json)
- [Configure a point-to-site VPN connection](../vpn-gateway/point-to-site-certificate-gateway.md?toc=%2fazure%2fnetworking%2ftoc.json)
- [Create an internet-facing load balancer](../load-balancer/quickstart-load-balancer-standard-public-portal.md?toc=%2fazure%2fnetworking%2ftoc.json)
