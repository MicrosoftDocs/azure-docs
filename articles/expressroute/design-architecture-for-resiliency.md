---
title: Design and architect Azure ExpressRoute for resiliency
description: Learn how to design and architect Azure ExpressRoute for resiliency to ensure high availability and reliability in your network connections between on-premises and Azure.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 07/16/2024
ms.author: duau
ms.custom: ai-usage
---

# Design and architect Azure ExpressRoute for resiliency

Azure ExpressRoute is an essential hybrid connectivity service widely used for its low latency, resilience, high throughput private connectivity between your on-premises network and Azure workloads. It offers the ability to achieve reliability, resiliency, and disaster recovery in network connections between on-premises and Azure to ensure availability of business and mission-critical workloads. This capability also extends access to Azure resources in a scalable, and cost-effective way.

:::image type="content" source="./media/design-architecture-for-resiliency/standard-vs-maximum-resiliency.png" alt-text="Diagram illustrating a connection between an on-premises network and Azure through ExpressRoute.":::

Network connections that are highly reliable, resilient, and available are fundamental to a well-structured system. Reliability consists of two principles: *resiliency* and *availability*. The goal of resiliency is to prevent failures and, in the event they do occur, to restore your applications to a fully operational state. The objective of availability is to provide consistent access to your application or workloads. It's important to proactively plan for reliability based on your business needs and application requirements.

Users of ExpressRoute rely on the availability and performance of edge sites, WAN, and availability zones to maintain their connectivity to Azure. However, these components or sites might experience failures due to various reasons, such as equipment malfunctioning, network disruptions, weather conditions, or natural disasters. Therefore, it's a joint responsibility between users and their cloud provider, when planning for reliability, resiliency, and availability.

## Site resiliency for ExpressRoute

There are three ExpressRoute resiliency architectures that can be utilized to ensure high availability and resiliency in your network connections between on-premises and Azure. These architecture designs include:

* [Maximum resiliency](#maximum-resiliency)
* [High resiliency](#high-resiliency)
* [Standard resiliency](#standard-resiliency)

### Maximum resiliency

The Maximum resiliency architecture in ExpressRoute is structured to eliminate any single point of failure within the Microsoft network path. This set up is achieved by configuring a pair of circuits across two distinct locations for site diversity with ExpressRoute. The objective of Maximum resiliency is to enhance reliability, resiliency, and availability, as a result ensuring the highest level of resilience for business and/or mission-critical workloads. For such operations, we recommend that you configure maximum resiliency. This architectural design is recommended as part of the [Well Architected Framework](/azure/well-architected/service-guides/azure-expressroute#reliability) under the reliability pillar. The ExpressRoute engineering team developed a [guided portal experience](expressroute-howto-circuit-portal-resource-manager.md?pivots=expressroute-preview) to assist you in configuring maximum resiliency.

:::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/maximum-resiliency.png" alt-text="Diagram of maximum resiliency for an ExpressRoute connection.":::

### High resiliency

High resiliency, also referred to as ExpressRoute Metro, enables the use of multiple sites within the same metropolitan (Metro) area to connect your on-premises network through ExpressRoute to Azure. High resiliency offers site diversity by splitting a single circuit across two sites. The first connection is established at one site and the second connection at a different site. The objective of ExpressRoute Metro is to mitigate the effect of edge-sites isolation and failures by introducing capabilities to enable site diversity. Site diversity is achieved by using a single circuit across paired sites within a metropolitan city, which offers resiliency to failures between edge and region. ExpressRoute Metro provides a higher level of site resiliency than Standard resiliency, but not as much as Maximum resiliency. ExpressRoute Metro architecture can be used for business and mission-critical workloads within a region. For more information, see [ExpressRoute Metro](metro.md)

:::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/high-resiliency.png" alt-text="Diagram of high resiliency for an ExpressRoute connection.":::

### Standard resiliency

Standard resiliency in ExpressRoute is a single circuit with two connections configured at a single site. Built-in redundancy (Active-Active) is configured to facilitate failover across the two connections of the circuit. Today, ExpressRoute offers two connections at a single peering location. If a failure happens at this site, users might experience loss of connectivity to their Azure workloads. This configuration is also known as *single-homed* as it represents users with an ExpressRoute circuit configured with only one peering location. This configuration is considered the *least* resilient and **not recommended** for business or mission-critical workloads because it doesn't provide site resiliency.

:::image type="content" source="./media/design-architecture-for-resiliency/standard-resiliency.png" alt-text="Diagram illustrating a single ExpressRoute circuit, with each link configured at a single peering location.":::

## Zonal resiliency for ExpressRoute

[Azure regions](/azure/cloud-adoption-framework/ready/azure-setup-guide/regions) are an integral part of your ExpressRoute design and resiliency strategy. These regions are geographical locations of data centers that host Azure services. Regions are interconnected through a dedicated low-latency network and are designed to be highly available, fault-tolerant, and scalable.

Azure offers several features to ensure regional resiliency. One such feature is [availability zones](../reliability/availability-zones-overview.md). Availability zones protect applications and data from data center failures by spanning across multiple physical locations within a region. Regions and availability zones are central to your application design and resiliency strategy. By utilizing availability zones, you can achieve higher availability and resilience in your deployments. For more information, see [Regions & availability zones](../reliability/overview.md).

We recommend deploying your [ExpressRoute Virtual Network Gateways](expressroute-about-virtual-network-gateways.md) as zone redundant across availability zones within a region. These availability zones are separate physical locations with independent infrastructure (power, cooling, and networking). The purpose is to protect your on-premises network connectivity to Azure from zone level failures. [Zone-redundant ExpressRoute gateways](../vpn-gateway/about-zone-redundant-vnet-gateways.md?toc=%2Fazure%2Fexpressroute%2Ftoc.json) provide resiliency, scalability, and higher availability for accessing mission-critical services on Azure. 

Equipment failures or disasters in regional and zonal data centers can affect ExpressRoute gateway deployments in virtual networks. If gateways aren't deployed as zone-redundant, such failures within an Azure data center can affect the ability for users to access their Azure workloads.  

If you have an existing non-zone redundant ExpressRoute gateways, there's now the ability to [migrate to an availability zone enabled gateway](gateway-migration.md).

## Recommendations

The following are recommendations to ensure high availability, resiliency, and reliability in your ExpressRoute network architecture:

* [ExpressRoute circuit recommendations](#expressroute-circuit-recommendations)
* [ExpressRoute Gateway recommendations](#expressroute-gateway-recommendations)
* [Disaster recovery and high availability recommendations](#disaster-recovery-and-high-availability-recommendations)
* [Monitoring and alerting recommendations](#monitoring-and-alerting-recommendations)

### ExpressRoute circuit recommendations

#### Plan for ExpressRoute circuit or ExpressRoute Direct

During the initial planning phase, it's crucial to determine whether to configure an [ExpressRoute circuit](expressroute-circuit-peerings.md) or an [ExpressRoute Direct](expressroute-erdirect-about.md) connection. An ExpressRoute circuit allows a private dedicated connection into Azure with the assistance of a connectivity provider. ExpressRoute Direct enables the extension of an on-premises network directly into the Microsoft network at a peering location. It's also necessary to identify the bandwidth requirement and the circuit SKU type requirement to meet your business needs.

#### Evaluate the resiliency of multi-site redundant ExpressRoute circuits

After deploying multi-site redundant ExpressRoute circuits with [maximum resiliency](expressroute-howto-circuit-portal-resource-manager.md), it's essential to ensure that on-premises routes are advertised over the redundant circuits to fully utilize the benefits of multi-site redundancy. To evaluate the resiliency and test the failover of redundant circuits and routes Learn more here. 

#### Plan for active-active configuration

To improve resiliency and availability, Microsoft recommends operating both connections of an ExpressRoute circuit in [active-active mode](designing-for-high-availability-with-expressroute.md#active-active-connections). By allowing two connections to operate in this mode, Microsoft load balances the network traffic across the connections on a per-flow basis. 

#### Physical layer diversity

For better resiliency, plan to establish multiple paths between the on-premises edge and the peering locations (provider/Microsoft edge locations). This configuration can be achieved by utilizing different services providers or by routing through another peering location from the on-premises network. For high availability, it's essential to maintain the redundancy of the ExpressRoute circuit throughout the end-to-end network architecture. This includes maintaining redundancy within your on-premises network and redundancy within your service provider. Ensuring redundancy in these parts of your architecture means you shouldn't have a single point of failure.

#### Ensure BFD (Bidirectional Forwarding Detection) is enabled and configured

Enabling Bidirectional Forwarding Detection (BFD) over ExpressRoute can accelerate the link failure detection between the MSEE devices and the routers on which your ExpressRoute circuit is configured. Microsoft recommends configuring the Customer Premises Edge (CPE) devices with BFD. ExpressRoute can be configured over your edge routing devices or your Partner Edge routing devices. BFD is enabled by default on the MSEE devices on the Microsoft side. 

### ExpressRoute Gateway recommendations

#### Plan for Virtual Network Gateway

Create [zone-redundant Virtual Network Gateways](../vpn-gateway/about-zone-redundant-vnet-gateways.md) for greater resiliency and plan for Virtual Network Gateways in different regions for disaster recovery and high availability. When utilizing zone-redundant gateways, you can benefit from zone-resiliency for accessing your mission-critical and scalable services on Azure.

#### Migrate to zone-redundant ExpressRoute gateways

The [guided gateway migration](gateway-migration.md) experience facilitates your migration from a Non-Az-Enabled SKU to an Az-Enabled SKU gateway. This feature allows for the creation of an additional virtual network gateway within the same gateway subnet. During the migration process, Azure transfers the control plane and data path configurations from your existing gateway to the new one.

### Disaster recovery and high availability recommendations

#### Enable high availability and disaster recovery

To maximize availability, both the customer and service provider segments on your ExpressRoute circuit should be architected for availability & resiliency. For Disaster Recovery, plan for scenarios such as regional service outages due to natural calamities. Implement a robust disaster recovery design for multiple circuits configured through different peering locations in different regions. To learn more, see: [Designing for disaster recovery](designing-for-disaster-recovery-with-expressroute-privatepeering.md).

#### Plan for geo-redundancy

For disaster recovery planning, we recommend setting up ExpressRoute circuits in multiple peering locations and regions. ExpressRoute circuits can be created in the same metropolitan area or different metropolitan areas, and different service providers can be used for diverse paths through each circuit. Geo-redundant ExpressRoute circuits are utilized to create a robust backend network connectivity for disaster recovery. To learn more, see [Designing for high availability](designing-for-high-availability-with-expressroute.md).

> [!NOTE] 
> Using site-to-site VPN as a backup solution for ExpressRoute connectivity is not recommended when dealing with latency-sensitive, mission-critical, or bandwidth-intensive workloads. In such cases, it's advisable to design for disaster recovery with ExpressRoute multi-site resiliency to ensure maximum availability.
>


#### Virtual network peering for connectivity between virtual networks

Virtual Network (VNet) Peering provides a more efficient and direct method, enabling Azure services to communicate across virtual networks without the need of a virtual network gateway, extra hops, or transit over the public internet. To establish connectivity between virtual networks, VNet peering should be implemented for the best performance possible. For more information, see [About Virtual Network Peering](../virtual-network/virtual-network-peering-overview.md) and [Manage VNet peering](../virtual-network/virtual-network-manage-peering.md).


### Monitoring and alerting recommendations 

#### Configure monitoring & alerting for ExpressRoute circuits 

As a baseline, we recommend configuring [Network Insights](expressroute-network-insights.md) within Azure Monitor to view all ExpressRoute circuit metrics, including ExpressRoute Direct and Global Reach. Within the circuits card you can visualize topologies and dependencies for peerings, connections, and gateways. The insights available for circuits include availability, throughput, and packet drops.

#### Configure service health alerts for ExpressRoute circuit maintenance notifications 

ExpressRoute uses [Azure Service Health](/azure/service-health/overview) to notify you of planned and upcoming [ExpressRoute circuit maintenance](maintenance-alerts.md). With Service Health, you can view planned and past maintenance in the Azure portal along with configuring alerts and notifications that best suit your needs. In Service Health, you can see Planned & Past maintenance. You can also set alerts within Service Health to be notified of upcoming maintenance. 

#### Configure connection monitor for ExpressRoute 

[Connection Monitor](how-to-configure-connection-monitor.md) is a cloud-based network monitoring solution that monitors connectivity between Azure cloud deployments and on-premises locations (Branch offices, etc.). Connection Monitor is an agent-based solution.

#### Configure gateway health monitoring & alerting 

[Setup monitoring](monitor-expressroute-reference.md#supported-metrics-for-microsoftnetworkexpressroutegateways) using Azure Monitor for ExpressRoute Gateway availability, performance, and scalability. When you deploy an ExpressRoute gateway, Azure manages the compute and functions of your gateway. There are multiple [gateway metrics](expressroute-monitoring-metrics-alerts.md#expressroute-virtual-network-gateway-metrics) available to you to better understand the performance of your gateway. 

