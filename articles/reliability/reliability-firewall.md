---
title: Reliability in Azure Firewall
description: Find out about reliability in Azure Firewall, including availability zones and multi-region deployments.
author: duongau
ms.author: duau
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ai-usage: ai-assisted
ms.service: azure-firewall
ms.date: 07/23/2025
# Customer intent: As a cloud architect designing a high-availability solution, I want to understand Azure Firewall's reliability features, so that I can ensure my network security infrastructure meets our 99.99% uptime requirements.
---

# Reliability in Azure Firewall

This article describes reliability support in Azure Firewall, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Resiliency is a shared responsibility between you and Microsoft and so this article also covers ways for you to create a resilient solution that meets your needs.

Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources. It's a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability.

## Production deployment recommendations

For the highest availability and reliability, deploy Azure Firewall Standard or Premium tier across multiple availability zones in supported regions for your network security infrastructure.

**Follow reliability design principles**: Apply Well-Architected Framework reliability patterns to ensure your solution can handle component failures gracefully. For more information, see [Reliability patterns](/azure/well-architected/reliability/design-patterns).

**Plan for business continuity**: Use Cloud Adoption Framework guidance to develop comprehensive business continuity and disaster recovery strategies. For more information, see [Business continuity and disaster recovery](/azure/cloud-adoption-framework/ready/landing-zone/design-area/management-business-continuity-disaster-recovery).

## Reliability architecture overview

By default, Azure Firewall achieves redundancy through its built-in high availability architecture. The service automatically distributes firewall instances across multiple fault domains within a region, providing protection against server rack and datacenter failures within a single availability zone.

:::image type="content" source="./media/firewall/high-availability-multi-region.png" alt-text="Diagram showing a high-availability Azure Firewall deployment across multiple regions, with separate firewall instances in each region, centralized policy management, and traffic routing for failover and redundancy.":::

Azure Firewall's reliability architecture includes:

- **Built-in high availability**: No extra load balancers or configuration required
- **Auto-scaling**: Automatically scales out when average throughput and CPU consumption reaches 60% or connection usage reaches 80%
- **Instance distribution**: When deployed with availability zones, firewall instances are distributed across multiple zones as the service scales
- **Fault tolerance**: Designed to handle localized failures with automatic failover capabilities

The service is designed to handle localized failures and provides automatic failover capabilities without requiring manual intervention.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Azure Firewall is designed to handle transient faults gracefully through its built-in resiliency mechanisms. The service automatically manages temporary network issues, brief resource unavailability, and service maintenance operations.

For applications connecting through Azure Firewall, implement retry logic with exponential backoff to handle potential transient connection issues. Azure Firewall's stateful nature ensures that legitimate connections are maintained during brief network interruptions.

During scaling operations, which take 5-7 minutes to complete, existing connections are preserved while new firewall instances are added to handle increased load.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Firewall can be configured during deployment to span multiple Availability Zones for increased availability. When deployed across multiple availability zones, Azure Firewall provides enhanced reliability and uptime guarantees.

Azure Firewall supports both zone-redundant and zonal deployment models:

- **Zone-redundant**: Firewall instances are automatically distributed across multiple availability zones
- **Zonal**: Firewall can be associated with a specific zone for proximity reasons

### Zone-redundant vs zonal deployment models

**Zone-redundant deployments** provide the highest level of reliability:
- Firewall instances are automatically distributed across all available zones in the region
- Azure manages load balancing and failover between zones automatically
- Achieves 99.99% uptime SLA when deployed across multiple zones
- Recommended for production workloads requiring maximum availability

**Zonal deployments** are designed for specific use cases:
- Firewall is deployed in a single, specific availability zone
- Used when you need to keep the firewall close to other resources in the same zone for latency optimization
- Provides 99.95% uptime SLA (single zone reliability)

> [!IMPORTANT]
> A single zonal deployment doesn't increase resiliency compared to a standard deployment. You need to explicitly deploy multiple Azure Firewall resources into different zones to improve resiliency.

### Region support

Azure Firewall Availability Zones are available in regions that support Availability Zones. For the current list of supported regions, see [Azure regions with availability zones](../reliability/availability-zones-region-support.md).

### Requirements

- Azure Firewall Basic, Standard, or Premium tier
- Deployment in a region that supports availability zones
- Standard public IP addresses must be used (zone-redundant by default for zone-redundant deployments)

For zonal deployments:
- Standard public IP addresses can be zone-specific or zone-redundant
- All associated public IPs must have compatible zone configurations
- Virtual network and subnet must support the target availability zone

### Considerations

- **Deployment-time configuration**: Availability zone configuration can only be set during initial deployment. You can't modify zone settings for existing firewalls
- **Public IP compatibility**: When using multiple public IP addresses, ensure they have compatible zone configurations (all zone-redundant or all in the same zone for zonal deployments)
- **Regional capacity constraints**: Some regions have capacity constraints in specific zones (Physical zone 2 in North Europe and Physical zone 3 in South East Asia)
- **Zonal limitations**: A single zonal deployment provides the same reliability as a non-zone deployment. To improve reliability with zonal deployments, you must deploy separate Azure Firewall instances across multiple zones and implement custom traffic routing

### Cost

There's no extra cost for a firewall deployed in more than one Availability Zone. Microsoft doesn't charge for data transfer across availability zones within the same region.

### Configure availability zone support

**Zone-redundant deployment:**
- [Deploy an Azure Firewall with Availability Zones using Azure PowerShell](../firewall/deploy-availability-zone-powershell.md)
- [Deploy Azure Firewall using Azure portal](../firewall/tutorial-firewall-deploy-portal.md) and select multiple availability zones during deployment

**Zonal deployment:**
- Use the same deployment methods but select a single specific availability zone
- Ensure associated public IP addresses are configured for the same zone or are zone-redundant

> [!IMPORTANT]
> Zone redundancy can only be configured during initial deployment. Existing firewalls can't be converted to use availability zones.

### Normal operations

- **Traffic routing between zones**: When zone-redundant, Azure Firewall automatically distributes traffic across instances in all available zones. The platform manages load balancing without user intervention.

- **Instance distribution and data replication**: As the firewall scales, it creates instances in all configured zones. Azure Firewall automatically replicates configuration and state data across these instances to ensure consistent policy enforcement and seamless failover between zones.

- **Zonal deployments**: For zonal deployments, all traffic gets processed by the firewall instance in the specified zone. If you deploy multiple zonal instances across different zones for improved reliability, you must configure traffic routing using external load balancing solutions like Azure Load Balancer or Traffic Manager.

### Zone-down experience

Azure Firewall provides automatic failover capabilities when an availability zone becomes unavailable:

- **Detection and response**: The Azure Firewall platform automatically detects zone failures and manages failover without user intervention
- **Active connections**: Existing connections might experience brief interruption during zone failover, but the stateful nature of Azure Firewall helps maintain session consistency
- **Expected data loss**: No data loss is expected during zone failover as Azure Firewall doesn't store persistent customer data
- **Expected downtime**: Minimal downtime is expected during automatic zone failover. The platform redirects traffic to healthy zones
- **Traffic rerouting**: Traffic is automatically rerouted to healthy availability zones. New firewall instances can be created in surviving zones if needed

For zonal deployments:
- **Single zonal deployment**: Zone failure results in complete firewall unavailability until the zone recovers or you implement failover to backup firewalls in other regions.

### Failback

When the availability zone recovers, Azure Firewall automatically redistributes instances across all available zones and restores normal load balancing across zones.

### Testing

The Azure Firewall platform manages traffic routing, failover, and failback for zone-redundant firewall resources. You don't need to initiate anything. Because this feature is fully managed, you don't need to validate availability zone failure processes.

For zonal deployments with multiple instances across zones, you should regularly test your custom failover and traffic routing mechanisms to ensure they work correctly during zone failures. Consider using Azure Chaos Studio to simulate zone failures and validate your disaster recovery procedures.

## Multi-region support

Azure Firewall is a single-region service. If the region is unavailable, your Azure Firewall resource is also unavailable.

### Alternative multi-region approaches

Since Azure Firewall doesn't have native multi-region capabilities, you must implement a multi-region architecture using separate firewall instances. This approach involves deploying independent Azure Firewall resources in different regions and implementing custom failover logic.

**Architecture pattern:**
1. Deploy separate Azure Firewall instances in each target region
2. Use Azure Firewall Manager for centralized policy management
3. Implement traffic routing using Azure Traffic Manager or Azure Front Door
4. Configure monitoring and automated or manual failover procedures

#### Requirements for multi-region deployments

- Separate Azure Firewall instances must be deployed in each region
- Azure Firewall Policy enables centralized rule management across multiple firewall instances
- Network connectivity between regions must be established using virtual network peering, VPN, or ExpressRoute
- Custom traffic routing and failover mechanisms must be implemented

#### Considerations for multi-region deployments

- Each Azure Firewall instance operates independently within its region
- Firewall rules and policies must be synchronized across regions using Azure Firewall Manager
- User-define routes (UDRs) must be configured to direct traffic to the appropriate regional firewall
- Failover between regions requires manual intervention or custom automation
- Cross-region data transfer charges can apply for traffic between regions

#### Cost implications

You're billed separately for each Azure Firewall instance deployed in different regions. Consider the following cost factors:
- Per-region firewall instance charges
- Cross-region data transfer costs
- Extra networking components (VPN Gateway, ExpressRoute) for inter-region connectivity

For example approaches that illustrate multi-region network security architectures, see:
- [Multi-region load balancing with Traffic Manager, Azure Firewall, and Application Gateway](/azure/architecture/high-availability/reference-architecture-traffic-manager-application-gateway)
- [Hub-spoke network topology in Azure](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke)
- [Network security in a multi-region Azure architecture](/azure/architecture/framework/security/design-network-segmentation)

## Service-level agreement

The service-level agreement (SLA) for Azure Firewall describes the expected availability of the service, and the conditions that must be met to achieve that availability expectation. 

Azure Firewall offers different SLA guarantees based on your deployment configuration:

- **99.95% uptime SLA**: For Azure Firewall deployed in a single availability zone or without availability zone configuration
- **99.99% uptime SLA**: For Azure Firewall deployed across multiple availability zones (two or more zones)

For more information, see [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Related content

- [Azure Firewall overview](../firewall/overview.md)
- [Azure Firewall features](../firewall/choose-firewall-sku.md)
- [Deploy Azure Firewall using Azure portal](../firewall/tutorial-firewall-deploy-portal.md)
- [Azure Firewall Manager](../firewall-manager/overview.md)
- [Azure regions with availability zones](../reliability/availability-zones-region-support.md)
- [Azure Well-Architected Framework - Reliability pillar](/azure/well-architected/reliability/)
- [Cloud Adoption Framework - Business continuity and disaster recovery](/azure/cloud-adoption-framework/ready/landing-zone/design-area/management-business-continuity-disaster-recovery)
- [Azure Firewall best practices for performance](../firewall/firewall-best-practices.md)
- [Using Azure Firewall Workbooks](../firewall/firewall-workbook.md)
