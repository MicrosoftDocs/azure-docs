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

Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources. It's a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability.

This article describes reliability support in Azure Firewall, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

## Production deployment recommendations

To learn about how to deploy Azure Firewall to support your solution's reliability requirements, and how reliability affects other aspects of your architecture, see [Architecture best practices for Azure Firewall in the Azure Well-Architected Framework](/azure/well-architected/service-guides/azure-firewall).

## Reliability architecture overview

An *instance* is a virtual machine (VM)-level unit of the firewall. Each instance represents the infrastructure that handles traffic and performs firewall checks. You don't specify the number of instances. Azure Firewall automatically scales out when average throughput, CPU consumption, and connection usage reach predefined thresholds. For more information, see [Azure Firewall performance](/azure/firewall/firewall-performance). The platform automatically manages instance creation, health monitoring, and replacement of unhealthy instances.

Azure Firewall achieves redundancy through its built-in high availability architecture. The service automatically distributes firewall instances across multiple fault domains within a region, providing protection against server and server rack failures. You can enable zone redundancy to distribute instances across multiple availability zones and protect against datacenter failures.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

For applications connecting through Azure Firewall, implement retry logic with exponential backoff to handle potential transient connection issues. Azure Firewall's stateful nature ensures that legitimate connections are maintained during brief network interruptions.

During scaling operations, which take 5-7 minutes to complete, existing connections are preserved while new firewall instances are added to handle increased load.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Firewall can be configured during deployment to span multiple Availability Zones for increased availability. When deployed across multiple availability zones, Azure Firewall provides enhanced reliability and uptime guarantees.

Azure Firewall supports both zone-redundant and zonal deployment models:

- **Zone-redundant**: Firewall instances are automatically distributed across multiple availability zones in the region, and Azure manages load balancing and failover between zones automatically.

    Zone-redundant firewalls achieve the highest uptime SLA, and are recommended for production workloads requiring maximum availability

- **Zonal**: Firewall can be associated with a specific zone, to ensure the firewall is close in proximity to backend servers in order to optimize latency.

    > [!IMPORTANT]
    > Pinning to a single availability zone is only recommended when [cross-zone latency](./availability-zones-overview.md#inter-zone-latency) is too high for your needs, and when you have verified that the latency doesn't meet your requirements. By itself, a zonal firewall doesn’t provide resiliency to an availability zone outage. To improve the resiliency of a zonal Azure Firewall deployment, you need to explicitly deploy separate firewalls into multiple availability zones and configure traffic routing and failover.

If you don't configure a firewall to be zone-redundant or zonal then it's considered to be *nonzonal* or *regional*. Nonzonal firewalls might be placed in any availability zone within the region. If any availability zone in the region experiences an outage, nonzonal firewalls might be in the affected zone and could experience downtime.

### Region support

Azure Firewall supports availability zones in [all regions that support availability zones](../reliability/availability-zones-region-support.md), where the Azure Firewall service is available.

### Requirements

- All tiers of Azure Firewall support availabiity zones.
- For zone-redundant firewalls, you must use standard public IP addresses and you must configure them to be zone-redundant.
- For zonal firewalls, you must use standard public IP addresses and can configure them to either be zone-redundant or zonal in the same zone as the firewall.

### Considerations

- **Deployment-time configuration**: Availability zone configuration can only be set during initial deployment. You can't modify zone settings for existing firewalls.
- **Regional capacity constraints**: Some regions have capacity constraints in specific zones (Physical zone 2 in North Europe and Physical zone 3 in Southeast Asia).

### Cost

There's no extra cost for a firewall deployed in more than one availability zone.

### Configure availability zone support

This section explains how to configure availability zone support for your firewalls.

- **Create a new firewall with availability zone support:** The approach you use to configure availability zones depends on whether you want to create a zone-redundant or zonal firewall.

  - *Zone-redundant:* When you deploy a new firewall, specify two or more availability zones. We recommend that you select all zones so that your firewall can use all of the availability zones, unless you have a specific reason not to use a particular zone.

    For guidance on deploying a new firewall, see these resources:
    - [Deploy an Azure Firewall with Availability Zones using Azure PowerShell](../firewall/deploy-availability-zone-powershell.md)
    - [Deploy Azure Firewall using Azure portal](../firewall/tutorial-firewall-deploy-portal.md) and select multiple availability zones during deployment

  - *Zonal:* You can deploy a zonal firewall by following the same deployment methods as for a zone-redundant deployment, but select a single specific availability zone.

    > [!NOTE]
    > [!INCLUDE [Availability zone numbering](./includes/reliability-availability-zone-numbering-include.md)]

- **Change the availability zone configuration of an existing firewall:** Availability zones can only be configured during initial deployment. Existing firewalls can't be converted to use availability zones.

- **Disable availability zone support:** Availability zone support can't be disabled.

### Normal operations

The following section describes what to expect when Azure Firewall is configured with availability zone support and all availability zones are operational:

- **Traffic routing between zones**: The traffic routing behavior depends on the availability zone configuration your firewall uses:

  - *Zone-redundant:* Azure Firewall automatically distributes incoming requests across instances in all of the zones that your firewall uses. This active-active configuration ensures optimal performance and load distribution under normal operating conditions.

  - *Zonal:* If you deploy multiple zonal instances across different zones, you must configure traffic routing using external load balancing solutions like Azure Load Balancer or Traffic Manager.

- **Instance management**: The platform automatically manages instance placement across the zones your firewall uses, replacing failed instances and maintaining the configured instance count. Health monitoring ensures that only healthy instances receive traffic.

- **Data replication between zones:** The data replication behavior depends on the availability zone configuration your firewall uses:

  - *Zone-redundant:* Azure Firewall automatically replicates configuration and state data across instances to ensure consistent policy enforcement and seamless failover between instances.

  - *Zonal:* If you deploy multiple zonal instances across different zones, you're responsible for synchronizing configuration across each firewall. Consider using Azure Firewall Manager to keep your firewall configuration consistent.

### Zone-down experience

The following section describes what to expect when Azure Firewall is configured with availability zone support and one or more availability zones are unavailable:

- **Detection and response:** Responsibility for detection and response depends on the availability zone configuration your firewall uses.

    - *Zone-redundant:* For instances that are configured to use zone redundancy, the Azure Firewall platform is responsible for detecting a failure in an availability zone and responding. You don't need to do anything to initiate a zone failover.

    - *Zonal:* For firewalls that are configured to be zonal, you need to detect the loss of an availability zone and initiate a failover to a secondary firewall that you create in another availability zone.

- **Active connections:** When an availability zone is unavailable, any requests in progress that are connected to a firewall instance in the faulty availability zone might be terminated and need to be retried.

- **Notification:** Zone failure events can be monitored through Azure Service Health. Set up alerts on Azure Search Health to receive notifications of zone-level issues.

- **Expected data loss**: No data loss is expected during zone failover as Azure Firewall doesn't store persistent customer data.

- **Expected downtime**: The downtime you can expect depends on the availability zone configuration your firewall uses:

    - *Zone-redundant:* Zone-redundant firewalls are expected to have no downtime during an availability zone outage.

    - *Zonal:* For zonal firewalls, when a zone is unavailable, your firewall is unavailable until the availability zone recovers.

- **Traffic rerouting:** The traffic rerouting behavior depends on the availability zone configuration that your firewall uses. 

    - *Zone-redundant:* Traffic is automatically rerouted to healthy availability zones. New firewall instances are created in surviving zones if the platform needs them.
    
    - *Zonal*: For zonal firewalls, when a zone is unavailable, your firewall is unavailable. If you have a secondary firewall in another availability zone, you're responsible for rerouting traffic to that secondary firewall.

### Failback

The failback behavior depends on the availability zone configuration that your firewall uses:

- *Zone-redundant:* When the availability zone recovers, Azure Firewall automatically redistributes instances across all zones used by your firewall and restores normal load balancing across zones.

- *Zonal:* You're responsible for rerouting traffic to the firewall in the original availability zone after the availability zone recovers.

### Testing

The options for testing for zone failures depend on the availability zone configuration that your gateway uses:

- *Zone-redundant:* The Azure Firewall platform manages traffic routing, failover, and failback for zone-redundant firewall resources. You don't need to initiate anything. Because this feature is fully managed, you don't need to validate availability zone failure processes.

- *Zonal:* For zonal deployments with multiple instances across zones, you should regularly test your custom failover and traffic routing mechanisms to ensure they work correctly during zone failures. Consider using Azure Chaos Studio to simulate zone failures and validate your disaster recovery procedures.

## Multi-region support

Azure Firewall is a single-region service. If the region is unavailable, your Azure Firewall resource is also unavailable.

### Alternative multi-region approaches

You can implement multi-region architecture by using separate firewalls. This approach requires you to deploy an independent Azure Firewall into each region you use, route traffic to the approriate regional firewall, and implement custom failover logic. Consider the following points:

- **Use Azure Firewall Manager** for centralized policy management across multiple firewalls. Use [Firewall Policy](/azure/firewall-manager/policy-overview) for centralized rule management across multiple firewall instances.

- **Implement traffic routing** by using Azure Traffic Manager or Azure Front Door.

For an example archirecture that illustrate multi-region network security architectures, see [Multi-region load balancing with Traffic Manager, Azure Firewall, and Application Gateway](/azure/architecture/high-availability/reference-architecture-traffic-manager-application-gateway).

## Reliability during service maintenance

Azure Firewall performs regular service upgrades and other forms of maintenance.

You can configure daily maintenance windows, allowing you to align upgrade schedules with your operational needs. For more information, see [Configure customer-controlled maintenance for Azure Firewall](/azure/firewall/customer-controlled-maintenance).

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-sla-include.md)]

Azure Firewall offers a higher availability SLA for firewalls that are deployed across two or more availability zones.

## Related content

- [Azure Firewall overview](../firewall/overview.md)
- [Azure Firewall features](../firewall/choose-firewall-sku.md)
- [Azure Firewall Manager](../firewall-manager/overview.md)
- [Azure Firewall best practices for performance](../firewall/firewall-best-practices.md)
