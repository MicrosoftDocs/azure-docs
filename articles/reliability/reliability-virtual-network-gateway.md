---
title: Reliability in Azure virtual network gateways
description: Learn how to make Azure virtual network gateways resilient to a variety of potential outages and problems, including transient faults, availability zone outages, and region outages. Also, learn about the virtual network gateway service-level agreement.
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

An Azure virtual network gateway is a component that provides secure connectivity between your Azure Virtual Network (VNet) and other networks—either your on-premises network or another VNet in Azure. There are two types of virtual network gateways: [Azure ExpressRoute gateway](/azure/expressroute/expressroute-about-virtual-network-gateways), which uses private connections that don't traverse the public internet, and [Azure VPN gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways), which uses encrypted tunnels over the internet. As an Azure service, a virtual network gateway provides a range of capabilities to support your reliability requirements.

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

This article describes how to make a virtual network gateway resilient to a variety of potential outages and problems, including transient faults, availability zone outages, region outages, and planned service maintenance. It also highlights some key information about the virtual network gateway service level agreement (SLA).

::: zone pivot="expressroute"

To view information about VPN Gateway, be sure to select the appropriate virtual network gateway type at the beginning of this page.

> [!IMPORTANT]
> This article covers the reliability of ExpressRoute virtual network gateways, which are the Azure-based parts of the ExpressRoute system.
>
> However, when you use ExpressRoute, it's critical that you design your *entire network architecture* - not just the gateway - to meet your resiliency requirements. Typically, you must use multiple sites (peering locations), as well as enable high availability and fast failover for your on-premises components. For more information, see [Design and architect Azure ExpressRoute for resiliency](../expressroute/design-architecture-for-resiliency.md).

::: zone-end

:::zone pivot="vpn"

To view information about ExpressRoute gateways, be sure to select the appropriate virtual network gateway type at the beginning of this page.

> [!IMPORTANT]
> This article covers the reliability of virtual network gateways, which are the Azure-based parts of the Azure VPN Gateway service.
>
> However, when you use VPNs, it's critical that you design your *entire network architecture* - not just the gateway - to meet your resiliency requirements. You're responsible for managing the reliability of your side of the VPN connection, including client devices for point-to-site configurations and remote VPN devices for site-to-site configurations.  For more information about how to configure your infrastructure for high availability, see [Design highly available gateway connectivity for cross-premises and VNet-to-VNet connections](../vpn-gateway/vpn-gateway-highlyavailable.md).

::: zone-end

## Production deployment recommendations

::: zone pivot="expressroute"

The Azure Well-Architected Framework provides recommendations across reliability, performance, security, cost, and operations. To understand how these areas influence each other and contribute to a reliable ExpressRoute solution, see [Architecture best practices for Azure ExpressRoute in the Azure Well-Architected Framework](/azure/well-architected/service-guides/azure-expressroute).

::: zone-end

::: zone pivot="vpn"

To ensure high reliability for your production virtual network gateways, we recommend that you:

> [!div class="checklist"]
> - **Enable zone redundancy** if your Azure VPN Gateway resources are in a supported region. Deploy VPN Gateway using supported SKUs (VpnGw1AZ or higher) to ensure access to zone redundancy features.
> - **Use Standard SKU public IP addresses.**
> - **Configure active-active mode** for higher availability, when supported by your remote VPN devices.
> - **Implement proper monitoring** using [Azure Monitor VPN Gateway metrics](../vpn-gateway/monitor-vpn-gateway.md).

::: zone-end

## Reliability architecture overview

::: zone pivot="expressroute"

With ExpressRoute, you must deploy components in the on-premises environment, peering locations, and within Azure. These components include:

- *Circuits and connections*: An [ExpressRoute *circuit*](/azure/expressroute/expressroute-circuit-peerings#circuits) consists of two *connections* through a single peering location to the Microsoft Enterprise Edge. By using two connections, you can achieve active-active connectivity. However, this configuration doesn't protect against site-level failures.

- *Customer premises equipment* (CPE) includes your edge routers and client devices. You need to ensure that your CPE is designed to be resilient to problems, and that it can quickly recover when problems happen in other parts of your ExpressRoute infrastructure.

- *Sites:* Circuits are established through a *site*, which is a physical peering location. Sites are designed to be highly available and have built-in redundancy across all layers, but because they represent a single physical location, there is a possibility of sites having problems. To mitigate the risk of site outages, ExpressRoute offers different site resiliency options that vary in their level of protection.

- *Azure virtual network gateway:* In Azure, you create a *virtual network gateway* that acts as the termination point for one or more ExpressRoute circuits within your Azure virtual network.

The following diagram shows two different ExpressRoute configurations, each with a single virtual network gateway, configured for different levels of resiliency across sites:

:::image type="content" source="../expressroute/media/design-architecture-for-resiliency/standard-vs-maximum-resiliency.png" alt-text="Diagram illustrating ExpressRoute connection options between on-premises network and Azure, showing different resiliency levels." border="false":::

::: zone-end

::: zone pivot="vpn"

A VPN requires components to be deployed in both the on-premises environment and within Azure:

- *On-premises components*: The components you deploy depend on whether you deploy a point-to-site or site-to-site configuration.

   - *Site-to-site* configurations require an on-premises VPN device, which you're responsible for deploying, configuring, and managing.
   - *Point-to-site* configurations require you to deploy a VPN client application in a remote device like a laptop or desktop, and import the user profile into the VPN client. Each point-to-site connection has its own user profile. You're responsible for deploying and configuring the client devices.

   To learn more about the differences, see [VPN Gateway topology and design](../vpn-gateway/design.md).

- *Azure virtual network gateway*: In Azure, you create a *virtual network gateway*, also called a *VPN gateway*, which acts as the termination point for VPN connections.

- *Local network gateway:* A site-to-site VPN configuration also requires a local network gateway, which represents the remote VPN device. The local network gateway stores the public IP address associated with the VPN device to establish the IKE phase 1 and phase2, the on-premises IP networks (for static routing), BGP IP address of the remote peer (in case of dynamic routing).

    - The public IP address of the on-premises VPN device to establish the IKE phase 1 and phase 2 connections
    - The on-premises IP networks, for static routing
    - The BGP IP address of the remote peer, for dynamic routing

The following diagram illustrates some key components in a VPN that connects from an on-premises environment to Azure:

:::image type="content" source="media/reliability-virtual-network-gateway/vpn-reliability-architecture.svg" alt-text="Diagram that shows Azure VPN Gateway, on-premises site-to-site, and point-to-site networks." border="false":::

::: zone-end

### Virtual network gateway

::: zone pivot="expressroute"

An ExpressRoute gateway contains two or more *gateway virtual machines (VMs)*, which are the underlying VMs that your gateway uses to process ExpressRoute traffic.

::: zone-end

::: zone pivot="vpn"

A VPN virtual network gateway contains exactly two *gateway virtual machines (VMs)*, which are the underlying VMs that your gateway uses to process VPN traffic.

::: zone-end

You don't see or manage the gateway VMs directly. The platform automatically manages gateway VM creation, health monitoring, and the replacement of unhealthy gateway VMs. To achieve protection against server and server rack failures, Azure automatically distributes gateway VMs across multiple fault domains within a region. If a server rack fails, any gateway VM on that cluster is automatically migrated to another cluster by the Azure platform.

::: zone pivot="expressroute"

You configure the gateway SKU. Each SKU supports a different level of throughput, and a different number of circuits. When you use the ErGwScale SKU (preview), ExpressRoute automatically scales the gateway by adding more gateway VMs. For more information, see [About ExpressRoute virtual network gateways](../expressroute/expressroute-about-virtual-network-gateways.md).

A gateway runs in *active-active* mode by default, which supports high availability of your circuit. You can optionally switch to use *active-passive* mode, but this configuration increases the risk of a failure affecting your connectivity. For more information, see [Active-active connections](../expressroute/designing-for-high-availability-with-expressroute.md#active-active-connections).

Ordinarily, traffic is routed through your virtual network gateway. However, if you use [FastPath](../expressroute/about-fastpath.md), traffic from your on-premises environment bypasses the gateway, which improves throughput and reduces latency. The gateway is still important, because it's used to configure routing for your traffic.

::: zone-end

::: zone pivot="vpn"

You configure the gateway SKU. Each SKU supports a different level of throughput, and a different number of VPN connections. For more information, see [About gateway SKUs](../vpn-gateway/about-gateway-skus.md).

Depending on your high availability requirements, you can configure your gateway as *active-standby*, which means that one gateway VM processes traffic and the other is a standby gateway VM, or as *active-active*, which means that both gateway VMs process traffic at the same time. Active-active isn't always possible due to the asymmetric nature of connection flows. For more information, see [Design highly available gateway connectivity for cross-premises and VNet-to-VNet connections](../vpn-gateway/vpn-gateway-highlyavailable.md).

::: zone-end

You can protect against availability zone failures by distributing gateway VMs across multiple zones, providing automatic failover within the region, and maintaining connectivity during zone maintenance or outages. For more information, see [Resilience to availability zone failures](#resilience-to-availability-zone-failures).

## Resilience to transient faults

[!INCLUDE [Resilience to transient faults](includes/reliability-transient-fault-description-include.md)]

For applications that connect through a virtual network gateway, implement retry logic with exponential backoff to handle potential transient connection problems. The stateful nature of virtual network gateways ensures that legitimate connections are maintained during brief network interruptions.

In a distributed networking environment, transient faults can occur at multiple layers, including:

- In your on-premises environment.

::: zone pivot="expressroute"

- In an edge site.

::: zone-end

::: zone pivot="vpn"

- In the internet.

::: zone-end

- Within Azure.

::: zone pivot="expressroute"

ExpressRoute reduces the effect of transient faults by using redundant connection paths, fast fault detection, and automated failover. However, it's important that your applications and on-premises components are configured correctly to be resilient to a variety of issues. For comprehensive fault handling strategies, see [Designing for high availability with ExpressRoute](../expressroute/designing-for-high-availability-with-expressroute.md).

::: zone-end

::: zone pivot="vpn"

If the IP routing on the on-premises device is configured correctly, data traffic like TCP flows automatically transits through active IPsec tunnels in the event of a disconnection.

Transient faults can sometimes affect IPsec tunnels or TCP data flows. In the event of a disconnection, IKE (Internet Key Exchange) renegotiates the Security Associations (SAs) for both Phase 1 and Phase 2 to re-establish the IPsec tunnel.

::: zone-end

## Resilience to availability zone failures

[!INCLUDE [Resilience to availability zone failures](includes/reliability-availability-zone-description-include.md)]

Virtual network gateways are automatically *zone-redundant* when they meet the requirements. Zone redundancy eliminates any single zone as a point of failure and provides the highest level of zone resiliency. Zone-redundant gateways provide automatic failover within the region, and maintain connectivity during zone maintenance or outages.

::: zone pivot="expressroute"

Zone-redundant ExpressRoute gateway VMs are automatically distributed across at least three availability zones.

The following diagram shows a zone-redundant virtual network gateway with three gateway VMs that are distributed across different availability zones:

:::image type="content" source="media/reliability-virtual-network-gateway/expressroute-zone-redundant.svg" alt-text="Diagram that shows an ExpressRoute virtual network gateway with three gateway VMs distributed across availability zones." border="false":::

> [!NOTE]
> There's no availability zone configuration for circuits or connections. These resources are located in network edge facilities, which aren't designed to use availability zones.

::: zone-end

::: zone pivot="vpn"

In Azure VPN Gateway, zone redundancy means that the gateway VMs are automatically distributed across multiple availability zones.

The following diagram shows a zone-redundant virtual network gateway with two gateway VMs that are distributed across different availability zones:

:::image type="content" source="media/reliability-virtual-network-gateway/vpn-zone-redundant.svg" alt-text="Diagram that shows a VPN virtual network gateway with two gateway VMs distributed across availability zones." border="false":::

> [!NOTE]
> There's no availability zone configuration for local network gateways, because they're automatically zone-resilient.

::: zone-end

When you use a [supported SKU](#requirements), any newly created gateway is automatically zone-redundant. Zone redundancy is recommended for all production workloads.

### Requirements

- **Region support:** Zone-redundant virtual network gateways are available in [all regions that support availability zones](./regions-list.md).

::: zone pivot="expressroute"

- **SKU:** For a virtual network gateway to be zone-redundant, it must use a SKU that supports zone redundancy. The following table shows which SKUs support zone redundancy:

    [!INCLUDE [skus-with-az](../expressroute/includes/sku-availability-zones.md)]

::: zone-end

::: zone pivot="vpn"

- **SKU:** For a virtual network gateway to be zone-redundant, it must use a SKU that supports zone redundancy. All tiers of Azure VPN Gateway support zone redundancy except the Basic SKU, which is only for development environments. For more information about SKU options, see [About Gateway SKUs](../vpn-gateway/about-gateway-skus.md#workloads)

- **Public IP addresses:** You must also use standard SKU public IP addresses and configure them to be zone-redundant.

::: zone-end

### Cost

::: zone pivot="expressroute"

Zone-redundant gateways for ExpressRoute require specific SKUs, which can have higher hourly rates compared to standard gateway SKUs due to their enhanced capabilities and performance characteristics. For pricing information, see [Azure ExpressRoute pricing](https://azure.microsoft.com/pricing/details/expressroute/).

::: zone-end

::: zone pivot="vpn"

There's no extra cost for a gateway deployed across multiple availability zones, as long as you use a supported SKU. For pricing information, see [VPN Gateway pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/).

::: zone-end

### Configure availability zone support

This section explains how to configure zone redundancy for your virtual network gateways.

::: zone pivot="expressroute"

- **Create a new virtual network gateway with availability zone support.** Any new virtual network gateways you create are automatically zone-redundant, if they meet the requirements listed above. For detailed configuration steps, see [Create a zone-redundant virtual network gateway in availability zones](../vpn-gateway/create-zone-redundant-vnet-gateway.md?toc=%2Fazure%2Fexpressroute%2Ftoc.json).

::: zone-end

::: zone pivot="vpn"

- **Create a new virtual network gateway with availability zone support.** Any new virtual network gateways you create are automatically zone-redundant, if they meet the requirements listed above. For detailed configuration steps, see [Create a zone-redundant virtual network gateway in availability zones](../vpn-gateway/create-zone-redundant-vnet-gateway.md).

::: zone-end

::: zone pivot="expressroute"

- **Change the availability zone configuration of an existing virtual network gateway.** Virtual network gateways that you already created might not be zone-redundant. You can migrate a nonzonal gateway to a zone-redundant gateway with minimal downtime. For more information, see [Migrate ExpressRoute gateways to availability zone-enabled SKUs](../expressroute/gateway-migration.md).

::: zone-end

::: zone pivot="vpn"

- **Change the availability zone configuration of an existing virtual network gateway.** Virtual network gateways that you already created might not be zone-redundant. You can migrate a nonzonal gateway to a zone-redundant gateway with minimal downtime. For more information, see [About SKU consolidation & migration](../vpn-gateway/gateway-sku-consolidation.md).

::: zone-end

### Behavior when all zones are healthy

The following section describes what to expect when your virtual network gateway is configured for zone redundancy and all availability zones are operational.

::: zone pivot="expressroute"

- **Traffic routing between zones:** Traffic from your on-premises environment is distributed among gateway VMs in all of the zones that your gateway uses. This active-active configuration ensures optimal performance and load distribution under normal operating conditions.

    However, if you use FastPath for optimized performance, traffic from your on-premises environment bypasses the gateway, which improves throughput and reduces latency. For more information, see [About ExpressRoute FastPath](../expressroute/about-fastpath.md).

- **Data replication between zones:** No data replication occurs between zones because the virtual network gateway doesn't store persistent customer data.

::: zone-end

::: zone pivot="vpn"

- **Traffic routing between zones:** Zone redundancy doesn't affect how traffic is routed. Traffic is routed between the gateway VMs of your gateway based on the configuration of your clients. If your gateway uses active-active configuration and uses two public IP addresses, both gateway VMs might receive traffic, and for active-standby configuration, traffic is routed to a single primary gateway VM selected by Azure.

- **Data replication between zones:** Azure VPN Gateway doesn't need to synchronize connection state across availability zones. In active-active mode, the gateway VM that processes the VPN connection is responsible for managing the connection's state.

::: zone-end

- **Gateway VM management:** The platform automatically selects the zones for your gateway VMs, and manages placement across the zones. Health monitoring ensures that only healthy gateway VMs receive traffic.

### Behavior during a zone failure

The following section describes what to expect when your virtual network gateway is configured for zone redundancy and there's an availability zone outage.

- **Detection and response:** The Azure platform detects and responds to a failure in an availability zone. You don't need to initiate a zone failover.

[!INCLUDE [Availability zone down notification (Service Health and Resource Health)](./includes/reliability-availability-zone-down-notification-service-resource-include.md)]

- **Active requests:** Any active requests connected through gateway VMs in the failing zone are terminated. Client applications should retry the requests by following the guidance for how to [handle transient faults](#resilience-to-transient-faults).

- **Expected data loss:** Zone failures aren't expected to cause data loss because virtual network gateways don't store persistent customer data.

- **Expected downtime:** During zone outages, connections might experience brief interruptions that typically last up to one minute as traffic is redistributed. Client applications should retry the requests by following the guidance for how to [handle transient faults](#resilience-to-transient-faults).

::: zone pivot="expressroute"

- **Traffic rerouting:** The platform automatically distributes traffic to gateway VMs in healthy zones.

    FastPath-enabled connections maintain optimized routing throughout the failover process, ensuring minimal effect on application performance.

::: zone-end

::: zone pivot="vpn"

- **Traffic rerouting:** Traffic automatically reroutes to the other gateway VM, which is in a different availability zone.

::: zone-end

### Zone recovery

When the affected availability zone recovers, Azure automatically restores any gateway VMs in the recovered zone, and returns to normal traffic distribution across all zones that the gateway uses.

### Test for zone failures

The Azure platform manages traffic routing, failover, and failback for zone-redundant virtual network gateways. This feature is fully managed, so you don't need to initiate or validate availability zone failure processes.

## Resilience to region-wide failures

A virtual network gateway is a single-region resource. If the region becomes unavailable, your gateway is also unavailable.

::: zone pivot="expressroute"

> [!NOTE]
> You can use the Premium ExpressRoute SKU when you have Azure resources that are spread across multiple regions. However, the Premium SKU doesn't affect how your gateway is configured, and it's still deployed into one region. For more information, see [What is Azure ExpressRoute?](../expressroute/expressroute-introduction.md).

::: zone-end

### Custom multi-region solutions for resiliency

::: zone pivot="expressroute"

You can create independent connectivity paths to your Azure environment by using one or more of the following approaches:

- Create multiple ExpressRoute circuits, which connect to gateways in different Azure regions.
- Use a site-to-site VPN as a backup for private peering traffic.
- Use Internet connectivity as a backup for Microsoft peering traffic.

For detailed guidance, see [Designing for disaster recovery with ExpressRoute private peering](../expressroute/designing-for-disaster-recovery-with-expressroute-privatepeering.md).

::: zone-end

::: zone pivot="vpn"

You can deploy separate VPN Gateways in two or more different regions. However, each gateway is attached to a different virtual network, and the gateways operate independently. There's no interaction, or replication of configuration or state between them. You're also responsible for configuring your clients and remote devices to connect to the correct VPN, or to switch between VPNs as required.

::: zone-end

## Resilience to service maintenance

Azure performs regular maintenance on virtual network gateways to ensure optimal performance and security. During these maintenance windows, some service disruptions can occur, but Azure designs these activities to minimize effect on your connectivity. 

During planned maintenance operations on virtual network gateways, the process is executed on gateway VMs sequentially, never simultaneously. This process ensures that there's always one gateway VM active during maintenance, minimizing the impact on your active connections.

You can configure gateway maintenance windows to align with your operational requirements, reducing the likelihood of unexpected disruptions.

::: zone pivot="expressroute"

For more information, see [Configure customer-controlled maintenance for ExpressRoute gateways](../expressroute/customer-controlled-gateway-maintenance.md).

::: zone-end

::: zone pivot="vpn"

For more information, see [Configure maintenance windows for your VNet gateways](../vpn-gateway/customer-controlled-gateway-maintenance.md).

::: zone-end

## Service level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

::: zone pivot="expressroute"

ExpressRoute provides a strong availability SLA that guarantees high uptime for your connections. Different availability SLAs apply if you deploy across multiple peering locations (sites), if you use ExpressRoute Metro, or if you have a single-site configuration.

::: zone-end

::: zone pivot="vpn"

All VPN Gateway SKUs other than Basic are eligible for a higher availability SLA. The Basic SKU provides a lower availability SLA and limited capabilities and should only be used for testing and development. For more information, see [Gateway SKUs - Production vs. Dev-Test workloads](../vpn-gateway/about-gateway-skus.md#workloads)

::: zone-end

## Related content

::: zone pivot="expressroute"

- [Azure ExpressRoute overview](../expressroute/expressroute-introduction.md)
- [Design and architect Azure ExpressRoute for resiliency](../expressroute/design-architecture-for-resiliency.md)
- [Designing for high availability with ExpressRoute](../expressroute/designing-for-high-availability-with-expressroute.md)
- [Designing for disaster recovery with ExpressRoute private peering](../expressroute/designing-for-disaster-recovery-with-expressroute-privatepeering.md)

::: zone-end

::: zone pivot="vpn"

- [About zone-redundant VNet gateway in Azure availability zones](../vpn-gateway/about-zone-redundant-vnet-gateways.md)
- [Create a zone-redundant VNet gateway](../vpn-gateway/create-zone-redundant-vnet-gateway.md)
- [Monitor VNet gateway](../vpn-gateway/monitor-vpn-gateway.md)
- [Design highly available gateway connectivity for cross-premises and VNet-to-VNet connections](../vpn-gateway/vpn-gateway-highlyavailable.md)

::: zone-end
