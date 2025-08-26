---
title: Reliability in Azure Firewall
description: Find out about reliability in Azure Firewall, including availability zones and multi-region deployments.
author: duongau
ms.author: duau
ms.topic: reliability-article
ms.custom: subject-reliability
ai-usage: ai-assisted
ms.service: azure-firewall
ms.date: 08/27/2025
# Customer intent: As a cloud architect designing a high-availability solution, I want to understand Azure Firewall's reliability features, so that I can ensure my network security infrastructure meets our 99.99% uptime requirements.
---

# Reliability in Azure Firewall

Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources. It's a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability.

This article describes reliability support in Azure Firewall, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

## Production deployment recommendations

To learn about how to deploy Azure Firewall to support your solution's reliability requirements, and how reliability affects other aspects of your architecture, see [Architecture best practices for Azure Firewall in the Azure Well-Architected Framework](/azure/well-architected/service-guides/azure-firewall).

## Reliability architecture overview

An *instance* is a virtual machine (VM)-level unit of the firewall. Each instance represents the infrastructure that handles traffic and performs firewall checks.

To achieve high availability of your firewall, Azure Firewall automatically provides a minimum of two instances, without any intervention or configuration by you. Also, your firewall automatically scales out when average throughput, CPU consumption, and connection usage reach predefined thresholds. For more information, see [Azure Firewall performance](/azure/firewall/firewall-performance). The platform automatically manages instance creation, health monitoring, and replacement of unhealthy instances.

To achieve redundancy, Azure Firewall automatically distributes instances across multiple fault domains within a region, providing protection against server and server rack failures. However, to increase redundancy and availability during datacenter failures, you can enable zone redundancy to distribute instances across multiple availability zones.

>[!NOTE]
>If you create your firewall using the Azure portal, zone-redundancy is automatically enabled.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

For applications that connect through Azure Firewall, implement retry logic with exponential backoff to handle potential transient connection issues. Azure Firewall's stateful nature ensures that legitimate connections are maintained during brief network interruptions.

During scaling operations, which take 5-7 minutes to complete, existing connections are preserved while new firewall instances are added to handle increased load.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Firewall is automatically deployed across availability zones in supported regions when created through the Azure portal. For advanced zone configuration options, you must use Azure PowerShell, Azure CLI, or ARM templates.

Azure Firewall supports both zone-redundant and zonal deployment models:

- **Zone-redundant**: When enabled for zone redundancy, firewall instances are distributed across multiple availability zones in the region, and Azure manages load balancing and failover between zones automatically.

    Zone-redundant firewalls achieve the highest uptime SLA, and are recommended for production workloads requiring maximum availability

- **Zonal**: Azure Firewall can be associated with a specific zone, to ensure the firewall is close in proximity to backend servers in order to optimize latency. All firewall instances are deployed within that zone.

    > [!IMPORTANT]
    > Pinning to a single availability zone is only recommended when [cross-zone latency](./availability-zones-overview.md#inter-zone-latency) is too high for your needs, and when you have verified that the latency doesn't meet your requirements. By itself, a zonal firewall doesn’t provide resiliency to an availability zone outage. To improve the resiliency of a zonal Azure Firewall deployment, you need to explicitly deploy separate firewalls into multiple availability zones and configure traffic routing and failover.

If you don't configure a firewall to be zone-redundant or zonal then it's considered to be *nonzonal* or *regional*. Nonzonal firewalls might be placed in any availability zone within the region. If any availability zone in the region experiences an outage, nonzonal firewalls might be in the affected zone and could experience downtime.

### Region support

Azure Firewall supports availability zones in [all regions that support availability zones](../reliability/availability-zones-region-support.md), where the Azure Firewall service is available.

### Requirements

- All tiers of Azure Firewall support availability zones.
- For zone-redundant firewalls, you must use standard public IP addresses and you must configure them to be zone-redundant.
- For zonal firewalls, you must use standard public IP addresses and can configure them to either be zone-redundant or zonal in the same zone as the firewall.

### Cost

There's no extra cost for a firewall deployed in more than one availability zone.

### Configure availability zone support

This section explains how to configure availability zone support for your firewalls.

- **Create a new firewall with availability zone support:** The approach you use to configure availability zones depends on whether you want to create a zone-redundant or zonal firewall, and the tooling you use.

  > [!IMPORTANT]
  > Zone redundancy is automatically enabled when deploying through the Azure portal. To configure specific zones, you must use another tool, like the Azure CLI, Azure PowerShell, Bicep, or ARM templates.

  - *Zone-redundant:* When you deploy a new firewall by using the Azure portal, your firewall is automatically zone redundant by default. For detailed guidance, see [Deploy Azure Firewall using Azure portal](../firewall/tutorial-firewall-deploy-portal.md).

    When you use the Azure CLI, Azure PowerShell, Bicep, ARM templates, or Terraform, you can optionally specify the availability zones to deploy your firewall into. You can deploy a zone-redundant firewall by specifying two or more zones. We recommend that you select all zones so that your firewall can use all of the availability zones, unless you have a specific reason not to use a particular zone.
    
    For detailed guidance for Azure PowerShell, see [Deploy an Azure Firewall with availability zones using Azure PowerShell](../firewall/deploy-availability-zone-powershell.md).

  - *Zonal:* You can deploy a zonal firewall by using the Azure CLI, Azure PowerShell, Bicep, ARM templates, or Terraform. Select a single specific availability zone.

    > [!NOTE]
    > [!INCLUDE [Availability zone numbering](./includes/reliability-availability-zone-numbering-include.md)]

- **Enable availability zone support on an existing firewall:** You can enable availability zones on an existing firewall as long as it meets some specific criteria. The process requires stopping (deallocating) the firewall and reconfiguring it, and involves some downtime. For more information, see [How can I configure availability zones after deployment?](/azure/firewall/firewall-faq#how-can-i-configure-availability-zones-after-deployment).

- **Change the availability zone configuration of an existing firewall:** You can reconfigure the availability zones used for a firewall. This process requires stopping (deallocating) the firewall and reconfiguring it, which involves some downtime. For more information, see [How can I configure availability zones after deployment?](/azure/firewall/firewall-faq#how-can-i-configure-availability-zones-after-deployment).

- **Disable availability zone support:** You can change the availability zones used by a firewall, but you can't convert a zone-redundant or zonal firewall to nonzonal.

### Normal operations

The following section describes what to expect when Azure Firewall is configured with availability zone support and all availability zones are operational:

- **Traffic routing between zones**: The traffic routing behavior depends on the availability zone configuration your firewall uses:

  - *Zone-redundant:* Azure Firewall automatically distributes incoming requests across instances in all of the zones that your firewall uses. This active-active configuration ensures optimal performance and load distribution under normal operating conditions.

  - *Zonal:* If you deploy multiple zonal instances across different zones, you must configure traffic routing using external load balancing solutions like Azure Load Balancer or Traffic Manager.

- **Instance management**: The platform automatically manages instance placement across the zones your firewall uses, replacing failed instances and maintaining the configured instance count. Health monitoring ensures that only healthy instances receive traffic.

- **Data replication between zones:** Azure Firewall doesn't need to synchronize connection state across availability zones. Each connection's state is maintained by the instance that processes the request.

### Zone-down experience

The following section describes what to expect when Azure Firewall is configured with availability zone support and one or more availability zones are unavailable:

- **Detection and response:** Responsibility for detection and response depends on the availability zone configuration your firewall uses.

    - *Zone-redundant:* For instances that are configured to use zone redundancy, the Azure Firewall platform is responsible for detecting a failure in an availability zone and responding. You don't need to do anything to initiate a zone failover.

    - *Zonal:* For firewalls that are configured to be zonal, you need to detect the loss of an availability zone and initiate a failover to a secondary firewall that you create in another availability zone.

- **Notification:** Zone failure events can be monitored through Azure Service Health. Set up alerts on Azure Search Health to receive notifications of zone-level issues.

- **Active connections:** When an availability zone is unavailable, any requests in progress that are connected to a firewall instance in the faulty availability zone might be terminated and need to be retried.

- **Expected data loss**: No data loss is expected during zone failover as Azure Firewall doesn't store persistent customer data.

- **Expected downtime**: The downtime you can expect depends on the availability zone configuration your firewall uses:

    - *Zone-redundant:* Zone-redundant firewalls are expected to have a small amount of downtime (typically, a few seconds) during an availability zone outage. Client applications should follow practices for [transient fault handling](#transient-faults), including implementing retry policies with exponential back-off.

    - *Zonal:* For zonal firewalls, when a zone is unavailable, your firewall is unavailable until the availability zone recovers.

- **Traffic rerouting:** The traffic rerouting behavior depends on the availability zone configuration that your firewall uses. 

    - *Zone-redundant:* Traffic is automatically rerouted to healthy availability zones. New firewall instances are created in surviving zones if the platform needs them.
    
    - *Zonal*: For zonal firewalls, when a zone is unavailable, your firewall is unavailable. If you have a secondary firewall in another availability zone, you're responsible for rerouting traffic to that secondary firewall.

### Failback

The failback behavior depends on the availability zone configuration that your firewall uses:

- *Zone-redundant:* When the availability zone recovers, Azure Firewall automatically redistributes instances across all zones used by your firewall and restores normal load balancing across zones.

- *Zonal:* You're responsible for rerouting traffic to the firewall in the original availability zone after the availability zone recovers.

### Testing

The options for zone failure testing depend on your firewall's availability zone configuration:

- *Zone-redundant:* The Azure Firewall platform manages traffic routing, failover, and failback for zone-redundant firewall resources.  Because this feature is fully managed, you don't need to initiate any process or validate availability zone failure processes.

- *Zonal:* You can simulate some aspects of the failure of an availability zone by explicitly stopping a firewall. By stopping the Azure Firewall, you can test how other systems and load balancers handle an outage in the firewall. For more information, see [How can I stop and start Azure Firewall?](/azure/firewall/firewall-faq#how-can-i-stop-and-start-azure-firewall).

## Multi-region support

Azure Firewall is a single-region service. If the region is unavailable, your Azure Firewall resource is also unavailable.

### Alternative multi-region approaches

You can implement multi-region architecture by using separate firewalls. This approach requires you to deploy an independent Azure Firewall into each region you use, route traffic to the appropriate regional firewall, and implement custom failover logic. Consider the following points:

- **Use Azure Firewall Manager** for centralized policy management across multiple firewalls. Use [Firewall Policy](/azure/firewall-manager/policy-overview) for centralized rule management across multiple firewall instances.

- **Implement traffic routing** by using Azure Traffic Manager or Azure Front Door.

For an example architecture that illustrates multi-region network security architectures, see [Multi-region load balancing with Traffic Manager, Azure Firewall, and Application Gateway](/azure/architecture/high-availability/reference-architecture-traffic-manager-application-gateway).

## Reliability during service maintenance

Azure Firewall performs regular service upgrades and other forms of maintenance.

You can configure daily maintenance windows, allowing you to align upgrade schedules with your operational needs. For more information, see [Configure customer-controlled maintenance for Azure Firewall](/azure/firewall/customer-controlled-maintenance).

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

Azure Firewall offers a higher availability SLA for firewalls that are deployed across two or more availability zones.

## Related content

- [Azure Firewall overview](../firewall/overview.md)
- [Azure Firewall features](../firewall/choose-firewall-sku.md)
- [Azure Firewall Manager](../firewall-manager/overview.md)
- [Azure Firewall best practices for performance](../firewall/firewall-best-practices.md)
