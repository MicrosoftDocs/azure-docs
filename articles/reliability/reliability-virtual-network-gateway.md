---
title: Reliability in Azure Virtual Network Gateways
description: Learn how to make Azure virtual network gateways resilient to problems like transient faults, availability zone outages, and region outages.
ms.author: anaharris
author: anaharris-ms
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-vpn-gateway
ms.date: 11/18/2025
zone_pivot_groups: virtual-network-gateway-types
ai-usage: ai-assisted
---

# Reliability in Azure virtual network gateways

An Azure virtual network gateway provides secure connectivity between an Azure virtual network and other networks, either an on-premises network or another virtual network in Azure.

Azure provides two types of virtual network gateways:

- [Azure ExpressRoute gateways](/azure/expressroute/expressroute-about-virtual-network-gateways) use private connections that don't traverse the public internet.

- [Azure virtual private network (VPN) gateways](/azure/vpn-gateway/vpn-gateway-about-vpngateways) use encrypted tunnels over the internet. 

As an Azure component, a virtual network gateway provides diverse capabilities to support your reliability requirements.

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

This article describes how to make a virtual network gateway resilient to various potential outages and problems, including transient faults, availability zone outages, region outages, and planned service maintenance. It also highlights key information about the virtual network gateway service-level agreement (SLA).

::: zone pivot="expressroute"

To view information about Azure VPN Gateway, select the appropriate virtual network gateway type at the beginning of this page.

> [!IMPORTANT]
> This article covers the reliability of ExpressRoute virtual network gateways, which are the Azure-based components of the ExpressRoute system.
>
> But when you use ExpressRoute, you must design your *entire network architecture*—not only the gateway—to meet your resiliency requirements. Typically, you use multiple sites, also known as *peering locations*, and enable high availability and fast failover for your on-premises components. For more information, see [Design and architect ExpressRoute for resiliency](../expressroute/design-architecture-for-resiliency.md).

::: zone-end

:::zone pivot="vpn"

To view information about ExpressRoute gateways, select the appropriate virtual network gateway type at the beginning of this page.

> [!IMPORTANT]
> This article covers the reliability of virtual network gateways, which are the Azure-based components of the Azure VPN Gateway service.
>
> But when you use VPNs, you must design your *entire network architecture*—not only the gateway—to meet your resiliency requirements. You're responsible for managing the reliability of your side of the VPN connection, including client devices for point-to-site configurations and remote VPN devices for site-to-site configurations. For more information about how to configure your infrastructure for high availability, see [Design highly available gateway connectivity for cross-premises and virtual network-to-virtual network connections](../vpn-gateway/vpn-gateway-highlyavailable.md).

::: zone-end

::: zone pivot="expressroute"

The Azure Well-Architected Framework provides recommendations across reliability, performance, security, cost, and operations. To understand how these areas influence each other and contribute to a reliable ExpressRoute solution, see [Architecture best practices for ExpressRoute in the Well-Architected Framework](/azure/well-architected/service-guides/azure-expressroute).

::: zone-end

::: zone pivot="vpn"

To ensure high reliability for your production virtual network gateways, apply the following practices:

> [!div class="checklist"]
> - **Enable zone redundancy** if your VPN Gateway resources reside in a supported region. Deploy VPN Gateway by using supported SKUs (VpnGw1AZ or higher) to ensure access to zone redundancy features.
>
> - **Use Standard SKU public IP addresses.**
> - **Configure active-active mode** for higher availability when your remote VPN devices support this mode.
> - **Implement proper monitoring** by using [Azure Monitor to collect and view VPN Gateway metrics](../vpn-gateway/monitor-vpn-gateway.md).

::: zone-end

## Reliability architecture overview

::: zone pivot="expressroute"

With ExpressRoute, you must deploy components in the on-premises environment, peering locations, and within Azure. These components include the following items:

- **Circuits and connections:** An [ExpressRoute *circuit*](/azure/expressroute/expressroute-circuit-peerings#circuits) consists of two *connections* through a single peering location to the Microsoft Enterprise Edge. When you use two connections, you can achieve active-active connectivity. But this configuration doesn't protect against site-level failures.

- **Customer premises equipment (CPE):** This equipment includes edge routers and client devices. Ensure that your CPE is designed to be resilient and can recover quickly when other parts of your ExpressRoute infrastructure experience problems.

- **Sites:** Circuits are established through a *site*, which is a physical peering location. Sites are designed to be highly available and have built-in redundancy across all layers. But sites represent a single physical location, so problems can occur. To mitigate the risk of site outages, ExpressRoute provides site resiliency options that have different levels of protection.

- **Azure virtual network gateway:** In Azure, you create a *virtual network gateway* that acts as the termination point for one or more ExpressRoute circuits within your Azure virtual network.

The following diagram shows two different ExpressRoute configurations, each with a single virtual network gateway, configured for different levels of resiliency across sites.

:::image type="complex" source="media/reliability-virtual-network-gateway/expressroute-resiliency.png" alt-text="Diagram that shows ExpressRoute connection options between an on-premises network and Azure. The configurations show different resiliency levels." lightbox="media/reliability-virtual-network-gateway/expressroute-resiliency.png" border="false":::
    The diagram shows two sections: a standard resiliency ExpressRoute circuit and maximum resiliency ExpressRoute circuits. Both sections contain an ExpressRoute virtual network gateway inside a customer virtual network. In the standard resiliency section, the gateway connects to peering location 1, which includes routers and an ExpressRoute circuit. The peering location connects to an on-premises environment. In the maximum resiliency section, the gateway connects to peering location 1 and peering location 2. Both peering locations include routers and an ExpressRoute circuit. The peering locations connect to an on-premises environment.
:::image-end:::

::: zone-end

::: zone pivot="vpn"

A VPN requires you to deploy components in both the on-premises environment and within Azure:

- **On-premises components:** The components that you deploy depend on whether you use a point-to-site or site-to-site configuration.

   - *Site-to-site* configurations require an on-premises VPN device that you're responsible for deploying, configuring, and managing.

   - *Point-to-site* configurations require you to deploy a VPN client application in a remote device, like a laptop or desktop, and import the user profile into the VPN client. Each point-to-site connection has its own user profile. You're responsible for deploying and configuring the client devices.

   For more information about the differences, see [VPN Gateway topology and design](../vpn-gateway/design.md).

- **Azure virtual network gateway:** In Azure, you create a virtual network gateway, also called a *VPN gateway*, which acts as the termination point for VPN connections.

- **Local network gateway:** A site-to-site VPN configuration also requires a local network gateway, which represents the remote VPN device. The local network gateway stores the following information:

    - The public IP address of the on-premises VPN device to establish the Internet Key Exchange (IKE) phase 1 and phase 2 connections

    - The on-premises IP networks, for static routing
    - The Border Gateway Protocol (BGP) IP address of the remote peer, for dynamic routing

The following diagram shows key components in a VPN that connects from an on-premises environment to Azure.

:::image type="complex" source="media/reliability-virtual-network-gateway/vpn-reliability-architecture.svg" alt-text="Diagram that shows VPN Gateway, on-premises site-to-site, and point-to-site networks." border="false":::
The diagram has two sections: an on-premises environment and Azure. The on-premises environment contains a point-to-site VPN and a site-to-site VPN. Each VPN contains three clients that point to a virtual network gateway in Azure. This connection in the site-to-site VPN also passes through a VPN device that connects to a local network gateway in Azure. The local network gateway connects to the virtual network gateway in Azure. The virtual network gateway contains two public IP addresses and two gateway VMs.
:::image-end:::

::: zone-end

### Virtual network gateway

::: zone pivot="expressroute"

An ExpressRoute gateway contains two or more *gateway virtual machines (VMs)*, which are the underlying VMs that your gateway uses to process ExpressRoute traffic.

::: zone-end

::: zone pivot="vpn"

A VPN virtual network gateway contains exactly two *gateway virtual machines (VMs)*, which are the underlying VMs that your gateway uses to process VPN traffic.

::: zone-end

You don't see or manage the gateway VMs directly. The platform automatically manages gateway VM creation, health monitoring, and the replacement of unhealthy gateway VMs. To achieve protection against server and server rack failures, Azure automatically distributes gateway VMs across multiple fault domains within a region. If a server rack fails, the Azure platform automatically migrates gateway VMs on that cluster to another cluster.

::: zone pivot="expressroute"

You configure the gateway SKU. Each SKU supports a different level of throughput and a different number of circuits. When you use the ErGwScale SKU (preview), ExpressRoute automatically scales the gateway by adding more gateway VMs. For more information, see [ExpressRoute virtual network gateways](../expressroute/expressroute-about-virtual-network-gateways.md).

A gateway runs in *active-active* mode by default, which supports high availability of your circuit. You can optionally switch to *active-passive* mode, but this configuration increases the risk of a failure affecting your connectivity. For more information, see [Active-active connections](../expressroute/designing-for-high-availability-with-expressroute.md#active-active-connections).

Typically, traffic routes through your virtual network gateway. But if you use [FastPath](../expressroute/about-fastpath.md), traffic from your on-premises environment bypasses the gateway. This approach improves throughput and reduces latency. The gateway remains essential because it configures routing for your traffic.

::: zone-end

::: zone pivot="vpn"

You configure the gateway SKU. Each SKU supports a different level of throughput and a different number of VPN connections. For more information, see [Gateway SKUs](../vpn-gateway/about-gateway-skus.md).

Depending on your high availability requirements, you can configure your gateway in one of two modes:

- *Active-standby:* One gateway VM processes traffic, and the other gateway VM stays on standby.

- *Active-active:* Both gateway VMs process traffic at the same time. This mode isn't always possible because connection flows can be asymmetric.

For more information, see [Design highly available gateway connectivity for cross-premises and virtual network-to-virtual network connections](../vpn-gateway/vpn-gateway-highlyavailable.md).

::: zone-end

You can protect against availability zone failures by distributing gateway VMs across multiple zones. This distribution provides automatic failover within the region and maintains connectivity during zone maintenance or outages. For more information, see [Resilience to availability zone failures](#resilience-to-availability-zone-failures).

## Resilience to transient faults

[!INCLUDE [Resilience to transient faults](includes/reliability-transient-fault-description-include.md)]

For applications that connect through a virtual network gateway, implement retry logic with exponential backoff to handle potential transient connection problems. The stateful nature of virtual network gateways ensures that legitimate connections are maintained during brief network interruptions.

In a distributed networking environment, transient faults can occur at multiple layers, including the following locations:

- Your on-premises environment

::: zone pivot="expressroute"

- An edge site

::: zone-end

::: zone pivot="vpn"

- The internet

::: zone-end

- Azure

::: zone pivot="expressroute"

ExpressRoute reduces the effect of transient faults by using redundant connection paths, fast fault detection, and automated failover. But you must configure your applications and on-premises components correctly to be resilient to various problems. For comprehensive fault handling strategies, see [Design for high availability by using ExpressRoute](../expressroute/designing-for-high-availability-with-expressroute.md).

::: zone-end

::: zone pivot="vpn"

If you configure the IP address routing on the on-premises device correctly, data traffic like Transmission Control Protocol (TCP) flows automatically transits through active Internet Protocol Security (IPsec) tunnels when a disconnection occurs.

Transient faults can sometimes affect IPsec tunnels or TCP data flows. When a disconnection occurs, IKE renegotiates the security associations (SAs) for both phase 1 and phase 2 to reestablish the IPsec tunnel.

::: zone-end

## Resilience to availability zone failures

[!INCLUDE [Resilience to availability zone failures](includes/reliability-availability-zone-description-include.md)]

Virtual network gateways are automatically *zone redundant* when they meet the requirements. Zone redundancy eliminates any single zone as a point of failure and provides the highest level of zone resiliency. Zone-redundant gateways provide automatic failover within the region and maintain connectivity during zone maintenance or outages.

::: zone pivot="expressroute"

Zone-redundant ExpressRoute gateway VMs are automatically distributed across at least three availability zones.

The following diagram shows a zone-redundant virtual network gateway with three gateway VMs distributed across different availability zones.

:::image type="content" source="media/reliability-virtual-network-gateway/expressroute-zone-redundant.svg" alt-text="Diagram that shows an ExpressRoute virtual network gateway with three gateway VMs distributed across three availability zones." border="false":::

> [!NOTE]
> Circuits or connections don't include availability zone configuration. These resources reside in network edge facilities, which aren't designed to use availability zones.

::: zone-end

::: zone pivot="vpn"

In VPN Gateway, zone redundancy means that the gateway VMs are automatically distributed across multiple availability zones.

The following diagram shows a zone-redundant virtual network gateway with two gateway VMs distributed across different availability zones.

:::image type="content" source="media/reliability-virtual-network-gateway/vpn-zone-redundant.svg" alt-text="Diagram that shows a VPN virtual network gateway with two gateway VMs distributed across two availability zones. A third availability zone doesn't have a gateway VM." border="false":::

> [!NOTE]
> Local network gateways don't require availability zone configuration because they're automatically zone resilient.

::: zone-end

When you use a [supported SKU](#requirements), newly created gateways are automatically zone redundant. We recommend zone redundancy for all production workloads.

### Requirements

- **Region support:** Zone-redundant virtual network gateways are available in [all regions that support availability zones](./regions-list.md).

::: zone pivot="expressroute"

- **SKU:** For a virtual network gateway to be zone redundant, it must use a SKU that supports zone redundancy. The following table shows which SKUs support zone redundancy.

    [!INCLUDE [skus-with-az](../expressroute/includes/sku-availability-zones.md)]

::: zone-end

::: zone pivot="vpn"

- **SKU:** For a virtual network gateway to be zone redundant, it must use a SKU that supports zone redundancy. All tiers of VPN Gateway support zone redundancy except the Basic SKU, which is only for development environments. For more information about SKU options, see [Gateway SKUs](../vpn-gateway/about-gateway-skus.md#workloads).

- **Public IP addresses:** You must use standard SKU public IP addresses and configure them to be zone redundant.

::: zone-end

### Cost

::: zone pivot="expressroute"

Zone-redundant gateways for ExpressRoute require specific SKUs, which can have higher hourly rates compared to standard gateway SKUs because of their enhanced capabilities and performance characteristics. For more information, see [ExpressRoute pricing](https://azure.microsoft.com/pricing/details/expressroute/).

::: zone-end

::: zone pivot="vpn"

There's no extra cost for a gateway deployed across multiple availability zones if you use a supported SKU. For more information, see [VPN Gateway pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/).

::: zone-end

### Configure availability zone support

This section explains how to configure zone redundancy for your virtual network gateways.

::: zone pivot="expressroute"

- **Create a new virtual network gateway that supports availability zones.** New virtual network gateways are automatically zone redundant if they meet the requirements listed earlier. For more information, see [Create a zone-redundant virtual network gateway in availability zones](../vpn-gateway/create-zone-redundant-vnet-gateway.md).

::: zone-end

::: zone pivot="vpn"

- **Create a new virtual network gateway that supports availability zones.** New virtual network gateways are automatically zone redundant if they meet the requirements listed earlier. For more information, see [Create a zone-redundant virtual network gateway in availability zones](../vpn-gateway/create-zone-redundant-vnet-gateway.md).

::: zone-end

::: zone pivot="expressroute"

- **Change the availability zone configuration of an existing virtual network gateway.** Virtual network gateways that you already created might not be zone redundant. You can migrate a nonzonal gateway to a zone-redundant gateway with minimal downtime. For more information, see [Migrate ExpressRoute gateways to availability zone-enabled SKUs](../expressroute/gateway-migration.md).

::: zone-end

::: zone pivot="vpn"

- **Change the availability zone configuration of an existing virtual network gateway.** Virtual network gateways that you already created might not be zone redundant. You can migrate a nonzonal gateway to a zone-redundant gateway with minimal downtime. For more information, see [SKU consolidation and migration](../vpn-gateway/gateway-sku-consolidation.md).

::: zone-end

### Behavior when all zones are healthy

The following section describes what to expect when your virtual network gateway is configured for zone redundancy and all availability zones are operational.

::: zone pivot="expressroute"

- **Traffic routing between zones:** Traffic from your on-premises environment is distributed among gateway VMs in all zones that your gateway uses. This active-active configuration ensures optimal performance and load distribution under normal operating conditions.

    If you use FastPath for optimized performance, traffic from your on-premises environment bypasses the gateway, which improves throughput and reduces latency. For more information, see [ExpressRoute FastPath](../expressroute/about-fastpath.md).

- **Data replication between zones:** No data replication occurs between zones because the virtual network gateway doesn't store persistent customer data.

::: zone-end

::: zone pivot="vpn"

- **Traffic routing between zones:** Zone redundancy doesn't affect how traffic is routed. Traffic is routed between the gateway VMs of your gateway based on the configuration of your clients. If your gateway uses active-active configuration and uses two public IP addresses, both gateway VMs might receive traffic. For active-standby configuration, traffic is routed to a single primary gateway VM that Azure selects.

- **Data replication between zones:** VPN Gateway doesn't need to synchronize connection state across availability zones. In active-active mode, the gateway VM that processes the VPN connection is responsible for managing the connection's state.

::: zone-end

- **Gateway VM management:** The platform automatically selects the zones for your gateway VMs and manages placement across the zones. Health monitoring ensures that only healthy gateway VMs receive traffic.

### Behavior during a zone failure

The following section describes what to expect when your virtual network gateway is configured for zone redundancy and there's an availability zone outage.

- **Detection and response:** The Azure platform detects and responds to a failure in an availability zone. You don't need to initiate a zone failover.

[!INCLUDE [Availability zone down notification (Service Health and Resource Health)](./includes/reliability-availability-zone-down-notification-service-resource-include.md)]

- **Active requests:** Any active requests connected through gateway VMs in the failing zone are terminated. Client applications should retry the requests by following the [guidance to handle transient faults](#resilience-to-transient-faults).

- **Expected data loss:** Zone failures shouldn't cause data loss because virtual network gateways don't store persistent customer data.

- **Expected downtime:** During zone outages, connections might experience brief interruptions that typically last up to one minute when traffic is redistributed. Client applications should retry the requests by following the [guidance to handle transient faults](#resilience-to-transient-faults).

::: zone pivot="expressroute"

- **Traffic rerouting:** The platform automatically distributes traffic to gateway VMs in healthy zones.

    FastPath-enabled connections maintain optimized routing throughout the failover process, which ensures minimal effect on application performance.

::: zone-end

::: zone pivot="vpn"

- **Traffic rerouting:** Traffic automatically reroutes to the other gateway VM in a different availability zone.

::: zone-end

### Zone recovery

When the affected availability zone recovers, Azure automatically restores gateway VMs in the recovered zone and returns to normal traffic distribution across all zones that the gateway uses.

### Test for zone failures

The Azure platform manages traffic routing, failover, and failback for zone-redundant virtual network gateways. This feature is fully managed, so you don't need to initiate or validate availability zone failure processes.

## Resilience to region-wide failures

A virtual network gateway is a single-region resource. If the region becomes unavailable, your gateway is also unavailable.

::: zone pivot="expressroute"

> [!NOTE]
> You can use the Premium ExpressRoute SKU when your Azure resources are spread across multiple regions. But the Premium SKU doesn't affect how your gateway is configured, and it's still deployed into one region. For more information, see [ExpressRoute overview](../expressroute/expressroute-introduction.md).

::: zone-end

### Custom multi-region solutions for resiliency

::: zone pivot="expressroute"

You can create independent connectivity paths to your Azure environment by using one or more of the following approaches:

- Create multiple ExpressRoute circuits that connect to gateways in different Azure regions.

- Use a site-to-site VPN as a backup for private peering traffic.
- Use internet connectivity as a backup for Microsoft peering traffic.

For more information, see [Design for disaster recovery by using ExpressRoute private peering](../expressroute/designing-for-disaster-recovery-with-expressroute-privatepeering.md).

::: zone-end

::: zone pivot="vpn"

You can deploy separate VPN gateways in two or more different regions. Each gateway is attached to a different virtual network, and the gateways operate independently. There's no interaction or replication of configuration or state between them. You're also responsible for configuring your clients and remote devices to connect to the correct VPN or switch between VPNs when required.

::: zone-end

## Resilience to service maintenance

Azure does regular maintenance on virtual network gateways to ensure optimal performance and security. During these maintenance windows, some service disruptions can occur, but Azure designs these activities to minimize the effect on connectivity. 

During planned maintenance operations on virtual network gateways, the process runs on gateway VMs sequentially, not simultaneously. This process ensures that one gateway VM always remains active during maintenance, which minimizes the impact on your active connections.

To reduce the likelihood of unexpected disruptions, you can configure gateway maintenance windows to align with your operational requirements.

::: zone pivot="expressroute"

For more information, see [Configure customer-controlled maintenance for ExpressRoute gateways](../expressroute/customer-controlled-gateway-maintenance.md).

::: zone-end

::: zone pivot="vpn"

For more information, see [Configure maintenance windows for your virtual network gateways](../vpn-gateway/customer-controlled-gateway-maintenance.md).

::: zone-end

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

::: zone pivot="expressroute"

ExpressRoute provides a strong availability SLA that guarantees high uptime for your connections. Different availability SLAs apply if you deploy across multiple peering locations (sites), if you use ExpressRoute Metro, or if you have a single-site configuration.

::: zone-end

::: zone pivot="vpn"

All VPN Gateway SKUs other than the Basic SKU are eligible for a higher availability SLA. The Basic SKU provides a lower availability SLA and limited capabilities, and you should only use it for testing and development. For more information, see [Gateway SKUs: Production versus dev-test workloads](../vpn-gateway/about-gateway-skus.md#workloads)

::: zone-end

## Related content

::: zone pivot="expressroute"

- [ExpressRoute overview](../expressroute/expressroute-introduction.md)
- [Design and architect ExpressRoute for resiliency](../expressroute/design-architecture-for-resiliency.md)
- [Design for high availability by using ExpressRoute](../expressroute/designing-for-high-availability-with-expressroute.md)
- [Design for disaster recovery by using ExpressRoute private peering](../expressroute/designing-for-disaster-recovery-with-expressroute-privatepeering.md)

::: zone-end

::: zone pivot="vpn"

- [Create a zone-redundant virtual network gateway](../vpn-gateway/create-zone-redundant-vnet-gateway.md)
- [Monitor VPN Gateway](../vpn-gateway/monitor-vpn-gateway.md)
- [Design highly available gateway connectivity for cross-premises and virtual network-to-virtual network connections](../vpn-gateway/vpn-gateway-highlyavailable.md)

::: zone-end
