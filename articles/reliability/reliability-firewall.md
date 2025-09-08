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
# Customer intent: As a cloud architect designing a high-availability solution, I want to understand Azure Firewall reliability features to ensure that my network security infrastructure meets our 99.99% uptime requirements.
---

# Reliability in Azure Firewall

Azure Firewall is a managed, cloud-based network security service that protects Azure Virtual Network resources. It's a fully stateful firewall service that includes built-in high availability and unrestricted cloud scalability.

This article describes reliability support in Azure Firewall, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

## Production deployment recommendations

To learn about how to deploy Azure Firewall to support your solution's reliability requirements and how reliability affects other aspects of your architecture, see [Architecture best practices for Azure Firewall in the Azure Well-Architected Framework](/azure/well-architected/service-guides/azure-firewall).

## Reliability architecture overview

An *instance* refers to a virtual machine (VM)-level unit of the firewall. Each instance represents the infrastructure that handles traffic and performs firewall checks.

To achieve high availability of a firewall, Azure Firewall automatically provides at least two instances, without requiring your intervention or configuration. The firewall automatically scales out when average throughput, CPU consumption, and connection usage reach predefined thresholds. For more information, see [Azure Firewall performance](/azure/firewall/firewall-performance). The platform automatically manages instance creation, health monitoring, and the replacement of unhealthy instances.

To achieve protection against server and server rack failures, Azure Firewall automatically distributes instances across multiple fault domains within a region. 

To increase redundancy and availability during datacenter failures, you can enable zone redundancy to distribute instances across multiple availability zones.

> [!NOTE]
> If you create your firewall in the Azure portal, zone redundancy is automatically enabled.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

For applications that connect through Azure Firewall, implement retry logic with exponential backoff to handle potential transient connection problems. Azure Firewall's stateful nature ensures that legitimate connections are maintained during brief network interruptions.

During scaling operations, which take 5 to 7 minutes to complete, existing connections are preserved while new firewall instances are added to handle increased load.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Firewall is automatically deployed across availability zones in supported regions when created through the Azure portal. For advanced zone configuration options, you must use Azure PowerShell, the Azure CLI, Bicep, or Azure Resource Manager templates (ARM templates).

Azure Firewall supports both zone-redundant and zonal deployment models:

- **Zone-redundant:** When enabled for zone redundancy, Azure distributes firewall instances across multiple availability zones in the region. Azure manages load balancing and failover between zones automatically.

    Zone-redundant firewalls achieve the highest uptime service-level agreement (SLA). They are recommended for production workloads that require maximum availability.

- **Zonal:** If your solution is unusually sensitive to cross-zone latency, you can associate Azure Firewall with a specific availability zone. You can use a zonal deployment to deploy in closer proximity to your back-end servers. All of the instances of a zonal firewall are deployed within that zone.

    > [!IMPORTANT]
    > We recommend that you pin to a single availability zone only when [cross-zone latency](./availability-zones-overview.md#inter-zone-latency) exceeds acceptable limits and you have confirmed that the latency doesn't meet your requirements. A zonal firewall alone doesn't provide resiliency to an availability zone outage. To improve the resiliency of a zonal Azure Firewall deployment, you must manually deploy separate firewalls into multiple availability zones and configure traffic routing and failover.

If you don't configure a firewall to be zone-redundant or zonal, it's considered *nonzonal* or *regional*. Nonzonal firewalls can be placed in any availability zone within the region. If an availability zone in the region experiences an outage, nonzonal firewalls might be in the affected zone and could experience downtime.

### Region support

Azure Firewall supports availability zones in [all regions that support availability zones](../reliability/availability-zones-region-support.md), where the Azure Firewall service is available.

### Requirements

- All tiers of Azure Firewall support availability zones.
- For zone-redundant firewalls, you must use standard public IP addresses and configure them to be zone-redundant.
- For zonal firewalls, you must use standard public IP addresses and can configure them to either be zone-redundant or zonal in the same zone as the firewall.

### Cost

There's no extra cost for a firewall deployed in more than one availability zone.

### Configure availability zone support

This section explains how to configure availability zone support for your firewalls.

- **Create a new firewall with availability zone support:** The approach that you use to configure availability zones depends on whether you want to create a zone-redundant or zonal firewall, and the tooling that you use.

  > [!IMPORTANT]
  > Zone redundancy is automatically enabled when you deploy through the Azure portal. To configure specific zones, you must use another tool, such as the Azure CLI, Azure PowerShell, Bicep, or ARM templates.

  - *Zone-redundant:* When you deploy a new firewall by using the Azure portal, your firewall is zone-redundant by default. For more information, see [Deploy Azure Firewall by using the Azure portal](../firewall/tutorial-firewall-deploy-portal.md).

    When you use the Azure CLI, Azure PowerShell, Bicep, ARM templates, or Terraform, you can optionally specify the availability zones for deployment. To deploy a zone-redundant firewall, specify two or more zones. We recommend that you select all zones so that your firewall can use every availability zone, unless you have a specific reason to exclude a zone.
    
    For more information about Azure PowerShell, see [Deploy an Azure Firewall with availability zones by using Azure PowerShell](../firewall/deploy-availability-zone-powershell.md).

  - *Zonal:* You can deploy a zonal firewall by using the Azure CLI, Azure PowerShell, Bicep, ARM templates, or Terraform. Select a single specific availability zone.

    > [!NOTE]
    > [!INCLUDE [Availability zone numbering](./includes/reliability-availability-zone-numbering-include.md)]

- **Enable availability zone support on an existing firewall:** You can enable availability zones on an existing firewall if it meets specific criteria. The process requires you to stop (deallocate) the firewall and reconfigure it. Expect some downtime. For more information, see [Configure availability zones after deployment](/azure/firewall/firewall-faq#how-can-i-configure-availability-zones-after-deployment).

- **Change the availability zone configuration of an existing firewall:** To change the availability zone configuration, you need to first stop (deallocate) the firewall, a process that involves some amount of downtime. For more information, see [Configure availability zones after deployment](/azure/firewall/firewall-faq#how-can-i-configure-availability-zones-after-deployment).

- **Disable availability zone support:** You can change the availability zones that a firewall uses, but you can't convert a zone-redundant or zonal firewall to a nonzonal configuration.

### Normal operations

This section describes what to expect when Azure Firewall is configured with availability zone support and all availability zones are operational.

- **Traffic routing between zones:** The traffic routing behavior depends on the availability zone configuration that your firewall uses.

  - *Zone-redundant:* Azure Firewall automatically distributes incoming requests across instances in all zones that your firewall uses. This active-active configuration ensures optimal performance and load distribution under normal operating conditions.

  - *Zonal:* If you deploy multiple zonal instances across different zones, you must configure traffic routing by using external load balancing solutions like Azure Load Balancer or Azure Traffic Manager.

- **Instance management:** The platform automatically manages instance placement across the zones your firewall uses, replacing failed instances and maintaining the configured instance count. Health monitoring ensures that only healthy instances receive traffic.

- **Data replication between zones:** Azure Firewall doesn't need to synchronize connection state across availability zones. The instance that processes the request maintains each connection's state.

### Zone-down experience

This section describes what to expect when Azure Firewall is configured with availability zone support and one or more availability zones are unavailable.

- **Detection and response:** Responsibility for detection and response depends on the availability zone configuration that your firewall uses.

    - *Zone-redundant:* For instances configured to use zone redundancy, the Azure Firewall platform detects and responds to a failure in an availability zone. You don't need to initiate a zone failover.

    - *Zonal:* For firewalls configured to be zonal, you need to detect the loss of an availability zone and initiate a failover to a secondary firewall that you create in another availability zone.

- **Notification**: Azure Firewall doesn't notify you when a zone is down. However, you can use [Azure Service Health](/azure/service-health/overview) to understand the overall health of the Azure Firewall service, including any zone failures.

    Set up alerts to receive notifications of zone-level problems. For more information, see [Create Service Health alerts in the Azure portal](/azure/service-health/alerts-activity-log-service-notifications-portal).

- **Active connections:** When an availability zone is unavailable, requests in progress connected to a firewall instance in the faulty availability zone might terminate and require retries.

- **Expected data loss:** No data loss is expected during zone failover because Azure Firewall doesn't store persistent customer data.

- **Expected downtime:** Downtime depends on the availability zone configuration that your firewall uses.

    - *Zone-redundant:* Expect minimal downtime (typically a few seconds) during an availability zone outage. Client applications should follow practices for [transient fault handling](#transient-faults), including implementing retry policies with exponential backoff.

    - *Zonal:* When a zone is unavailable, your firewall remains unavailable until the availability zone recovers.

- **Traffic rerouting:** The traffic rerouting behavior depends on the availability zone configuration that your firewall uses. 

    - *Zone-redundant:* Traffic automatically reroutes to healthy availability zones. If needed, the platform creates new firewall instances in healthy zones.
    
    - *Zonal:* When a zone is unavailable, your zonal firewall is also unavailable. If you have a secondary firewall in another availability zone, you're responsible for rerouting traffic to that firewall.

### Failback

The failback behavior depends on the availability zone configuration that your firewall uses.

- *Zone-redundant:* After the availability zone recovers, Azure Firewall automatically redistributes instances across all zones that your firewall uses and restores normal load balancing across zones.

- *Zonal:* After the availability zone recovers, you're responsible for rerouting traffic to the firewall in the original availability zone.

### Testing

The options for zone failure testing depend on your firewall's availability zone configuration.

- *Zone-redundant:* The Azure Firewall platform manages traffic routing, failover, and failback for zone-redundant firewall resources. This feature is fully managed, so you don't need to initiate or validate availability zone failure processes.

- *Zonal:* You can simulate aspects of the failure of an availability zone by stopping a firewall. Use this approach to test how other systems and load balancers handle an outage in the firewall. For more information, see [Stop and start Azure Firewall](/azure/firewall/firewall-faq#how-can-i-stop-and-start-azure-firewall).

## Multi-region support

Azure Firewall is a single-region service. If the region is unavailable, your Azure Firewall resource is also unavailable.

### Alternative multi-region approaches

To implement a multi-region architecture, use separate firewalls. This approach requires you to deploy an independent Azure Firewall into each region, route traffic to the appropriate regional firewall, and implement custom failover logic. Consider the following points:

- **Use Azure Firewall Manager** for centralized policy management across multiple firewalls. Use the [Firewall Policy](/azure/firewall-manager/policy-overview) method for centralized rule management across multiple firewall instances.

- **Implement traffic routing** by using Traffic Manager or Azure Front Door.

For an example architecture that illustrates multi-region network security architectures, see [Multi-region load balancing by using Traffic Manager, Azure Firewall, and Application Gateway](/azure/architecture/high-availability/reference-architecture-traffic-manager-application-gateway).

## Reliability during service maintenance

Azure Firewall performs regular service upgrades and other forms of maintenance.

You can configure daily maintenance windows to align upgrade schedules with your operational needs. For more information, see [Configure customer-controlled maintenance for Azure Firewall](/azure/firewall/customer-controlled-maintenance).

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

Azure Firewall provides a higher availability SLA for firewalls deployed across two or more availability zones.

## Related content

- [Azure Firewall overview](../firewall/overview.md)
- [Azure Firewall features](../firewall/choose-firewall-sku.md)
- [Azure Firewall best practices for performance](../firewall/firewall-best-practices.md)
- [Firewall Manager](../firewall-manager/overview.md)
