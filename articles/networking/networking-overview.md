---
title: Azure networking services overview
description: Learn about networking services in Azure, including connectivity, application protection, application delivery, and network monitoring services.
services: networking
documentationcenter: na
author: KumudD
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.workload: infrastructure-services
ms.date: 10/28/2020
ms.author: kumud

---

# Azure networking services overview

The networking services in Azure provide a variety of networking capabilities that can be used together or separately. Click any of the following key capabilities to learn more about them:
- [**Connectivity services**](#connect): Connect Azure resources and on-premises resources using any or a combination of these networking services in Azure - Virtual Network (VNet), Virtual WAN, ExpressRoute, VPN Gateway, Virtual network NAT Gateway, Azure DNS, Peering service, and Azure Bastion.
- [**Application protection services**](#protect): Protect your applications  using any or a combination of these networking services in Azure - Private Link, DDoS protection, Firewall, Network Security Groups, Web Application Firewall, and Virtual Network Endpoints.
- [**Application delivery services**](#deliver): Deliver applications in the Azure network using any or a combination of these networking services in Azure - Content Delivery Network (CDN), Azure Front Door Service, Traffic Manager, Application Gateway, Internet Analyzer, and Load Balancer.
- [**Network monitoring**](#monitor): Monitor your network resources using any or a combination of these networking services in Azure - Network Watcher, ExpressRoute Monitor, Azure Monitor, or VNet Terminal Access Point (TAP).

## <a name="connect"></a>Connectivity services
 
This section describes services that provide connectivity between Azure resources, connectivity from an on-premises network to Azure resources, and branch to branch connectivity in Azure - Virtual Network (VNet), ExpressRoute, VPN Gateway, Virtual WAN, Virtual network NAT Gateway, Azure DNS, Azure Peering service, and Azure Bastion.


### <a name="vnet"></a>Virtual network

Azure Virtual Network (VNet) is the fundamental building block for your private network in Azure. You can use a VNets to:
- **Communicate between Azure resources**: You can deploy VMs, and several other types of Azure resources to a virtual network, such as Azure App Service Environments, the Azure Kubernetes Service (AKS), and Azure Virtual Machine Scale Sets. To view a complete list of Azure resources that you can deploy into a virtual network, see [Virtual network service integration](../virtual-network/virtual-network-for-azure-services.md).
- **Communicate between each other**: You can connect virtual networks to each other, enabling resources in either virtual network to communicate with each other, using virtual network peering. The virtual networks you connect can be in the same, or different, Azure regions. For more information, see [Virtual network peering](../virtual-network/virtual-network-peering-overview.md).
- **Communicate to the internet**: All resources in a VNet can communicate outbound to the internet, by default. You can communicate inbound to a resource by assigning a public IP address or a public Load Balancer. You can also use [Public IP addresses](../virtual-network/virtual-network-public-ip-address.md) or public [Load Balancer](../load-balancer/load-balancer-overview.md) to manage your outbound connections.
- **Communicate with on-premises networks**: You can connect your on-premises computers and networks to a virtual network using [VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) or [ExpressRoute](../expressroute/expressroute-introduction.md).

For more information, see [What is Azure Virtual Network?](../virtual-network/virtual-networks-overview.md).

### <a name="expressroute"></a>ExpressRoute
ExpressRoute enables you to extend your on-premises networks into the Microsoft cloud over a private connection facilitated by a connectivity provider. This connection is private. Traffic does not go over the internet. With ExpressRoute, you can establish connections to Microsoft cloud services, such as Microsoft Azure, Microsoft 365, and Dynamics 365.  For more information, see [What is ExpressRoute?](../expressroute/expressroute-introduction.md).

:::image type="content" source="./media/networking-overview/expressroute-connection-overview.png" alt-text="Azure ExpressRoute" border="false":::

### <a name="vpngateway"></a>VPN Gateway
VPN Gateway helps you create encrypted cross-premises connections to your virtual network from on-premises locations, or create encrypted connections between VNets. There are different configurations available for VPN Gateway connections, such as, site-to-site, point-to-site, or VNet-to-VNet.
The following diagram illustrates multiple site-to-site VPN connections to the same virtual network.

:::image type="content" source="./media/networking-overview/vpngateway-multisite-connection-diagram.png" alt-text="Site-to-Site Azure VPN Gateway connections":::

For more information about different types of VPN connections, see [VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md).

### <a name="virtualwan"></a>Virtual WAN
Azure Virtual WAN is a networking service that provides optimized and automated branch connectivity to, and through, Azure. Azure regions serve as hubs that you can choose to connect your branches to. You can leverage the Azure backbone to also connect branches and enjoy branch-to-VNet connectivity. 
Azure Virtual WAN brings together many Azure cloud connectivity services such as site-to-site VPN, ExpressRoute, point-to-site user VPN into a single operational interface. Connectivity to Azure VNets is established by using virtual network connections. For more information, see [What is Azure virtual WAN?](../virtual-wan/virtual-wan-about.md).

:::image type="content" source="./media/networking-overview/virtualwan1.png" alt-text="Virtual WAN diagram":::

### <a name="dns"></a>Azure DNS
Azure DNS is a hosting service for DNS domains that provides name resolution by using Microsoft Azure infrastructure. By hosting your domains in Azure, you can manage your DNS records by using the same credentials, APIs, tools, and billing as your other Azure services. For more information, see [What is Azure DNS?](../dns/dns-overview.md).

### <a name="bastion"></a>Azure Bastion
The Azure Bastion service is a new fully platform-managed PaaS service that you provision inside your virtual network. It provides secure and seamless RDP/SSH connectivity to your virtual machines directly in the Azure portal over TLS. When you connect via Azure Bastion, your virtual machines do not need a public IP address. For more information, see [What is Azure Bastion?](../bastion/bastion-overview.md).

:::image type="content" source="./media/networking-overview/architecture.png" alt-text="Azure Bastion architecture":::

### <a name="nat"></a>Virtual network NAT Gateway
Virtual Network NAT (network address translation) simplifies outbound-only Internet connectivity for virtual networks. When configured on a subnet, all outbound connectivity uses your specified static public IP addresses. Outbound connectivity is possible without load balancer or public IP addresses directly attached to virtual machines. 
For more information, see [What is virtual network NAT gateway?](../virtual-network/nat-overview.md).

:::image type="content" source="./media/networking-overview/flow-map.png" alt-text="Virtual network NAT gateway":::

### <a name="azurepeeringservice"></a> Azure Peering Service
Azure Peering service enhances customer connectivity to Microsoft cloud services such as Microsoft 365, Dynamics 365, software as a service (SaaS) services, Azure, or any Microsoft services accessible via the public internet. For more information, see [What is Azure Peering Service?](../peering-service/about.md).

### <a name="edge-zones"></a>Azure Edge Zones

Azure Edge Zone is a family of offerings from Microsoft Azure that enables data processing close to the user. You can deploy VMs, containers, and other selected Azure services into Edge Zones to address the low latency and high throughput requirements of applications. For more information, see [What is Azure Edge Zones?](edge-zones-overview.md).

### <a name="orbital"></a>Azure Orbital

Azure Orbital is a fully managed cloud-based ground station as a service that lets you communicate with your spacecraft or satellite constellations, downlink and uplink data, process your data in the cloud, chain services with Azure services in unique scenarios, and generate products for your customers. This system is built on top of the Azure global infrastructure and low-latency global fiber network. For more information, see [What is Azure Orbital?](azure-orbital-overview.md).

:::image type="content" source="./media/azure-orbital-overview/orbital-communications-use-flow.png" alt-text="Azure Orbital communications diagram":::

## <a name="protect"></a>Application protection services

This section describes networking services in Azure that help protect your network resources - Protect your applications  using any or a combination of these networking services in Azure - DDoS protection, Private Link, Firewall, Web Application Firewall, Network Security Groups, and Virtual Network Service Endpoints.

### <a name="ddosprotection"></a>DDoS Protection 
[Azure DDoS Protection](../virtual-network/manage-ddos-protection.md) provides countermeasures against the most sophisticated DDoS threats. The service provides enhanced DDoS mitigation capabilities for your application and resources deployed in your virtual networks. Additionally, customers using Azure DDoS Protection have access to DDoS Rapid Response support to engage DDoS experts during an active attack.

:::image type="content" source="./media/networking-overview/ddos-protection.png" alt-text="DDoS Protection":::

### <a name="privatelink"></a>Azure Private Link
[Azure Private Link](../private-link/private-link-overview.md) enables you to access Azure PaaS Services (for example, Azure Storage and SQL Database) and Azure hosted customer-owned/partner services over a private endpoint in your virtual network.
Traffic between your virtual network and the service travels the Microsoft backbone network. Exposing your service to the public internet is no longer necessary. You can create your own private link service in your virtual network and deliver it to your customers.

:::image type="content" source="./media/networking-overview/private-endpoint.png" alt-text="Private endpoint overview":::

### <a name="firewall"></a>Azure Firewall
Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources. Using Azure Firewall, you can centrally create, enforce, and log application and network connectivity policies across subscriptions and virtual networks. Azure Firewall uses a static public IP address for your virtual network resources allowing outside firewalls to identify traffic originating from your virtual network. 

For more information about Azure Firewall, see the [Azure Firewall documentation](../firewall/overview.md).

:::image type="content" source="./media/networking-overview/firewall-threat.png" alt-text="Firewall overview":::

### <a name="waf"></a>Web Application Firewall
[Azure Web Application Firewall](../web-application-firewall/overview.md) (WAF) provides protection to your web applications from common web exploits and vulnerabilities such as SQL injection, and cross site scripting. Azure WAF provides out of box protection from OWASP top 10 vulnerabilities via managed rules. Additionally customers can also configure custom rules, which are customer managed rules to provide additional protection based on source IP range, and request attributes such as headers, cookies, form data fields or query string parameters.

Customers can choose to deploy [Azure WAF with Application Gateway](../application-gateway/waf-overview.md) which provides regional protection to entities in public and private address space. Customers can also choose to deploy [Azure WAF with Front Door](../frontdoor/waf-overview.md) which provides protection at the network edge to public endpoints.

:::image type="content" source="./media/networking-overview/waf-overview.png" alt-text="Web Application Firewall":::

### <a name="nsg"></a>Network security groups
You can filter network traffic to and from Azure resources in an Azure virtual network with a network security group. For more information, see [Network security groups](../virtual-network/network-security-groups-overview.md).

### <a name="serviceendpoints"></a>Service endpoints
Virtual Network (VNet) service endpoints extend your virtual network private address space and the identity of your VNet to the Azure services, over a direct connection. Endpoints allow you to secure your critical Azure service resources to only your virtual networks. Traffic from your VNet to the Azure service always remains on the Microsoft Azure backbone network. For more information, see [Virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).

:::image type="content" source="./media/networking-overview/vnet-service-endpoints-overview.png" alt-text="Virtual network service endpoints":::

## <a name="deliver"></a>Application delivery services

This section describes networking services in Azure that help deliver applications - Content Delivery Network, Azure Front Door Service, Traffic Manager, Load Balancer, and Application Gateway.

### <a name="cdn"></a>Content Delivery Network
Azure Content Delivery Network (CDN) offers developers a global solution for rapidly delivering high-bandwidth content to users by caching their content at strategically placed physical nodes across the world. For more information about Azure CDN, see [Azure Content Delivery Network](../cdn/cdn-overview.md).

:::image type="content" source="./media/networking-overview/cdn-overview.png" alt-text="Azure CDN":::

### <a name="frontdoor"></a>Azure Front Door Service
Azure Front Door Service enables you to define, manage, and monitor the global routing for your web traffic by optimizing for best performance and instant global failover for high availability. With Front Door, you can transform your global (multi-region) consumer and enterprise applications into robust, high-performance personalized modern applications, APIs, and content that reach a global audience with Azure. For more information, see [Azure Front Door](../frontdoor/front-door-overview.md).

:::image type="content" source="./media/networking-overview/front-door-visual-diagram.png" alt-text="Front Door Service overview":::

### <a name="trafficmanager"></a>Traffic Manager

Azure Traffic Manager is a DNS-based traffic load balancer that enables you to distribute traffic optimally to services across global Azure regions, while providing high availability and responsiveness. Traffic Manager provides a range of traffic-routing methods to distribute traffic such as priority, weighted, performance, geographic, multi-value, or subnet. For more information about traffic routing methods, see [Traffic Manager routing methods](../traffic-manager/traffic-manager-routing-methods.md).

The following diagram shows endpoint priority-based routing with Traffic Manager:

:::image type="content" source="./media/networking-overview/priority.png" alt-text="Azure Traffic Manager 'Priority' traffic-routing method":::

For more information about Traffic Manager, see [What is Azure Traffic Manager?](../traffic-manager/traffic-manager-overview.md)

### <a name="loadbalancer"></a>Load Balancer
The Azure Load Balancer provides high-performance, low-latency Layer 4 load-balancing for all UDP and TCP protocols. It manages inbound and outbound connections. You can configure public and internal load-balanced endpoints. You can define rules to map inbound connections to back-end pool destinations by using TCP and HTTP health-probing options to manage service availability. To learn more about Load Balancer, read the [Load Balancer overview](../load-balancer/load-balancer-overview.md) article.

The following picture shows an Internet-facing multi-tier application that utilizes both external and internal load balancers:

:::image type="content" source="./media/networking-overview/load-balancer.png" alt-text="Azure Load Balancer example":::

### <a name="applicationgateway"></a>Application Gateway
Azure Application Gateway is a web traffic load balancer that enables you to manage traffic to your web applications. It is an Application Delivery Controller (ADC) as a service, offering various layer 7 load-balancing capabilities for your applications. For more information, see [What is Azure Application Gateway?](../application-gateway/overview.md).

The following diagram shows url path-based routing with Application Gateway.

:::image type="content" source="./media/networking-overview/figure1-720.png" alt-text="Application Gateway example":::

## <a name="monitor"></a>Network monitoring services
This section describes networking services in Azure that help monitor your network resources - Network Watcher, Azure Monitor for Networks, ExpressRoute Monitor, Azure Monitor, and Virtual Network TAP.

### <a name="networkwatcher"></a>Network Watcher
Azure Network Watcher provides tools to monitor, diagnose, view metrics, and enable or disable logs for resources in an Azure virtual network. For more information, see [What is Network Watcher?](../network-watcher/network-watcher-monitoring-overview.md?toc=%2fazure%2fnetworking%2ftoc.json).

### Azure Monitor for Networks Preview
Azure Monitor for Networks provides a comprehensive view of health and metrics for all deployed network resources, without requiring any configuration. It also provides access to network monitoring capabilities like [Connection Monitor](../network-watcher/connection-monitor-preview.md), [flow logging for network security groups](../network-watcher/network-watcher-nsg-flow-logging-overview.md), and [Traffic Analytics](../network-watcher/traffic-analytics.md). For more information, see [Azure Monitor for Networks Preview](../azure-monitor/insights/network-insights-overview.md?toc=%2fazure%2fnetworking%2ftoc.json).

### <a name="expressroutemonitor"></a>ExpressRoute Monitor
To learn about how view ExpressRoute circuit metrics, resource logs and alerts, see [ExpressRoute monitoring, metrics, and alerts](../expressroute/expressroute-monitoring-metrics-alerts.md?toc=%2fazure%2fnetworking%2ftoc.json).
### <a name="azuremonitor"></a>Azure Monitor
Azure Monitor maximizes the availability and performance of your applications by delivering a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments. It helps you understand how your applications are performing and proactively identifies issues affecting them and the resources they depend on. For more information, see [Azure Monitor Overview](../azure-monitor/overview.md?toc=%2fazure%2fnetworking%2ftoc.json).
### <a name="vnettap"></a>Virtual Network TAP
Azure virtual network TAP (Terminal Access Point) allows you to continuously stream your virtual machine network traffic to a network packet collector or analytics tool. The collector or analytics tool is provided by a [network virtual appliance](https://azure.microsoft.com/solutions/network-appliances/) partner.

The following image shows how virtual network TAP works:

:::image type="content" source="./media/networking-overview/virtual-network-tap-architecture.png" alt-text="How virtual network TAP works":::

For more information, see [What is Virtual Network TAP](../virtual-network/virtual-network-tap-overview.md).

## Next steps

- Create your first virtual network, and connect a few VMs to it, by completing the steps in the [Create your first virtual network](../virtual-network/quick-create-portal.md?toc=%2fazure%2fnetworking%2ftoc.json) article.
- Connect your computer to a virtual network by completing the steps in the [Configure a point-to-site connection article](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md?toc=%2fazure%2fnetworking%2ftoc.json).
- Load balance Internet traffic to public servers by completing the steps in the [Create an Internet-facing load balancer](../load-balancer/load-balancer-get-started-internet-portal.md?toc=%2fazure%2fnetworking%2ftoc.json) article.
