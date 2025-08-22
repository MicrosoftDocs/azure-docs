---
title: Reliability in Azure Application Gateway v2
description: Find out about reliability in Azure Application Gateway v2, including availability zones and multi-region deployments.
author: mbender-ms
ms.author: mbender
ms.topic: reliability-article
ms.custom:
  - subject-reliability
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:07/09/2025
ms.service: azure-application-gateway
ms.date: 07/29/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Application Gateway v2 works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations. 
---

# Reliability in Azure Application Gateway v2

This article describes Azure Application Gateway v2 reliability support, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support). Learn how to configure your Application Gateway v2 for maximum reliability and fault tolerance in production environments.

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

> [!IMPORTANT]
> The reliability of your overall solution depends on the configuration of the back-end servers that Application Gateway routes traffic to. Depending on your solution, these might be Azure virtual machines (VMs), Azure virtual machine scale sets, Azure App Services, or external endpoints.
>
> Your back-end servers aren't in scope for this article, but their availability configurations directly affect your application's resilience. Review the reliability guides for all of the Azure services in your solution to understand how each service supports your reliability requirements. By ensuring that your back-end servers are also configured for high availability and zone redundancy, you can achieve end-to-end reliability for your application.

Application Gateway v2 is a web traffic load balancer that you can use to manage traffic to your web applications. It provides advanced features like autoscaling, zone redundancy, static virtual IP (VIP) addresses, and web application firewall (WAF) integration to deliver highly available and secure application delivery services.

## Production deployment recommendations

To learn about how to deploy Application Gateway to support your solution's reliability requirements, and how reliability affects other aspects of your architecture, see [Architecture best practices for Application Gateway in the Azure Well-Architected Framework](/azure/well-architected/service-guides/azure-application-gateway).

## Reliability architecture overview

Application Gateway is a managed service. It's important to understand some key elements of the service architecture so that you can make informed reliability decisions.

- **Instances:** An *instance* is a virtual machine (VM)-level unit of the gateway. Each instance represents a dedicated VM that handles traffic. One instance is equal to one VM.

  You don't see or manage the VMs directly. The platform automatically manages instance creation, health monitoring, and replacement of unhealthy instances. It also manages the graceful removal of instances during scale-in events. This process is known as *connection draining*.

- **Scaling:** An important aspect of a gateway's reliability is how it scales to meet traffic demand. If a gateway isn't scaled appropriately, traffic can't flow and your application can experience downtime. You can configure Application Gateway to use one of the following scaling modes.

  - *Autoscaling:* Automatically adjusts the number of instances within a range that you specify. Autoscaling scales the number of instances based on the current traffic demand.

  - *Manual scaling:* Requires you to specify an exact number of instances. You're responsible for selecting an instance count that meets your traffic demand.

  A *capacity unit* represents an amount of capacity that the gateway can process. A capacity unit is a synthetic measure that incorporates traffic, the number of connections, and compute resources. Each instance can handle at least 10 capacity units. For more information, see [Scale Application Gateway v2 and WAF v2](/azure/application-gateway/application-gateway-autoscaling-zone-redundant).

- **Health probes:** Application Gateway uses [health probes](/azure/application-gateway/application-gateway-probe-overview) to continuously monitor your back-end servers, like individual application servers. Traffic can be automatically redirected to healthy back-end servers when unhealthy servers are detected.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

When you use Application Gateway, consider the following best practices:

- **Implement retry logic.** Clients should implement appropriate retry mechanisms for transient connection failures.

- **Configure health probes with tolerance.** Configure your health probes to allow a grace period for transient faults. Health probes can be configured with an *unhealthy threshold*, which specifies the number of consecutive failed connection attempts that should trigger the back-end server to be marked as unhealthy. The default value of three ensures that transient faults in your back-end servers don't trigger Application Gateway to unnecessarily mark the server as unhealthy.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Application Gateway provides two types of availability zone support when you deploy a Standard_v2 or WAF_v2 gateway in a supported region.

- *Zone-redundant:* Azure automatically distributes the instances across two or more availability zones.

- *Zonal:* Azure deploys all of the Application Gateway instances into a single zone that you select within your chosen Azure region.

    > [!IMPORTANT]
    > Pinning to a single availability zone is only recommended when [cross-zone latency](./availability-zones-overview.md#inter-zone-latency) is too high for your needs and when you verify that the latency doesn't meet your requirements. By itself, a zonal gateway doesn't provide resiliency to an availability zone outage. To improve the resiliency of a zonal Application Gateway deployment, you need to explicitly deploy separate gateways into multiple availability zones and configure traffic routing and failover.

### Region support

Application Gateway supports availability zones for the Standard_v2 and WAF_v2 tiers in all of the [Azure regions that support availability zones](./regions-list.md).

### Requirements

- You must use the Standard_v2 or WAF_v2 SKU to enable availability zone support.

- Your gateway must have a minimum of two instances.

  > [!NOTE]
  > All gateways have a minimum of two instances. Even if the Azure portal indicates that your gateway has a single instance, internally it's always created with a minimum of two instances.

### Considerations

Zone-redundant gateways are spread across two or more availability zones in the region. For example, in a region that has three availability zones, a zone-redundant Application Gateway v2 deployment has instances in at least two of those zones. Depending on regional capacity and platform decisions, instances might be spread across two zones or three zones.

### Cost

Availability zone support for Application Gateway v2 doesn't incur extra charges beyond the standard capacity unit pricing. For pricing details, see [Understand pricing for Application Gateway and WAF](/azure/application-gateway/understanding-pricing) and [Application Gateway pricing](https://azure.microsoft.com/pricing/details/application-gateway/).

### Configure availability zone support

This section explains how to configure availability zone support for your gateways.

- **Create a new gateway with availability zone support.** The approach that you use to configure availability zones depends on whether you want to create a zone-redundant or zonal gateway.

  - *Zone-redundant:* New gateways are created as zone-redundant by default. Instances are spread across multiple availability zones and might use two or more zones in the region.

    To deploy a new gateway, see [Quickstart: Direct web traffic by using Application Gateway - Azure portal](../application-gateway/quick-create-portal.md).

    > [!NOTE]
    > After you deploy a new gateway by using the Azure portal, the portal or other tooling might indicate that the gateway isn't zone-redundant. However, if the gateway is deployed in a region that supports availability zones, it's guaranteed to be zone-redundant.

    When you use the Azure CLI, Azure PowerShell, Bicep, Azure Resource Manager templates (ARM templates), or Terraform, you can optionally specify the availability zones to deploy your gateway into. You can deploy a zone-redundant gateway by specifying two or more zones. However, we recommend that you omit the zone list so that your gateway can use all of the availability zones, unless you have a specific reason not to use a specific zone.

  - *Zonal:* You can deploy a zonal gateway by using the following tooling.

    - *Azure CLI:* You should explicitly select zones by using the `--zones` parameter in the `az network application-gateway create` command. To pin the gateway to a single zone, specify the logical zone number.

    - *Azure PowerShell:* Use the `-Zone` parameter in the `New-AzApplicationGateway` command. To pin the gateway to a single zone, specify the logical zone number.

    - *Bicep and ARM templates:* Configure the `zones` property in the resource definition. To pin the gateway to a single zone, specify the logical zone number.

    > [!NOTE]
    > [!INCLUDE [Availability zone numbering](./includes/reliability-availability-zone-numbering-include.md)]

- **Change the availability zone configuration of an existing Application Gateway v2 instance.** Microsoft is automatically upgrading all existing nonzonal gateways to be zone redundant, with no action from you. This upgrade is expected to be completed in 2025.

  If you need to move from a zone-redundant gateway to a zonal configuration, you need to deploy a new gateway.

- **Disable availability zone support.** Availability zone support can't be disabled. All gateways in regions that support availability zones must be either zone-redundant or zonal.

### Capacity planning and management

When you plan for zone failures for a zone-redundant application gateway or multiple zonal gateways deployed into multiple zones, consider that instances in surviving zones can experience increased load as traffic is redistributed. Connections might experience brief interruptions that can last for a few seconds.

To manage capacity effectively, take the following actions:

- **Use autoscaling.** Configure autoscaling with appropriate maximum instance counts to handle potential traffic redistribution during zone outages.

  If you use manual scaling, to prepare for availability zone failure, consider *over-provisioning* the number of instances in your gateway. Over-provisioning allows the solution to tolerate some degree of capacity loss, while continuing to function without degraded performance. For more information, see [Manage capacity with over-provisioning](/azure/reliability/concept-redundancy-replication-backup#manage-capacity-with-over-provisioning).

- **Respond to changes in traffic patterns.** Monitor capacity metrics and adjust scaling parameters based on your traffic patterns and performance requirements.

### Normal operations

The following section describes what to expect when Application Gateway v2 is configured with availability zone support and all availability zones are operational.

- **Traffic routing between zones:** Application Gateway automatically distributes incoming requests across instances in all of the zones that your gateway uses. This active-active configuration ensures optimal performance and load distribution under normal operating conditions.

- **Instance management:** The platform automatically manages instance placement across the zones that your gateway uses. It replaces failed instances and maintains the configured instance count. Health monitoring ensures that only healthy instances receive traffic.

### Zone-down experience

The following section describes what to expect when Application Gateway v2 is configured with availability zone support and one or more availability zones are unavailable.

- **Detection and response:** Responsibility for detection and response depends on the availability zone configuration that your gateway uses.

  - *Zone-redundant:* Microsoft manages the detection of zone failures and automatically initiates failover. No customer action is required.

  - *Zonal:* You need to detect the loss of an availability zone and initiate a failover to a secondary gateway that you create in another availability zone.

- **Notification:** Zone failure events can be monitored through Azure Service Health and Resource Health. Set up alerts on these services to receive notifications of zone-level problems.

- **Active requests:**  During a zone outage, requests that are being processed by instances in that zone are terminated. Clients should retry the requests by following the guidance for how to [handle transient faults](#transient-faults).

- **Expected data loss:** Zone failures aren't expected to cause data loss because Application Gateway is a stateless service.

- **Expected downtime:** The downtime you can expect depends on the availability zone configuration that your gateway uses.

  - *Zone-redundant:* During zone outages, connections might experience brief interruptions that typically last a few seconds as traffic is redistributed.

  - *Zonal:* When a zone is unavailable, your gateway is unavailable until the availability zone recovers.

- **Instance management:** The instance management behavior depends on the availability zone configuration that your gateway uses. 

  - *Zone-redundant:* The platform attempts to maintain the capacity of your gateway by creating temporary instances in other availability zones.

    Internally, Application Gateway uses virtual machine scale sets, which perform [best-effort zone balancing] [best-effort zone balancing](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones#zone-balancing). Because of this behavior, scaling operations might not occur when the capacity can't be evenly divided between zones (+/- 1 instance).

  - *Zonal:* You're responsible for creating instances in healthy zones if you require them.

- **Traffic rerouting:** The traffic rerouting behavior depends on the availability zone configuration that your gateway uses. 

  - *Zone-redundant:* Application Gateway immediately redistributes traffic to the instances in healthy zones, including any instances that are temporarily created.

  - *Zonal:* When a zone is unavailable, your gateway is unavailable. If you have a secondary gateway in another availability zone, you're responsible for rerouting traffic to that secondary gateway.

### Failback

The failback behavior depends on the availability zone configuration that your gateway uses.

- *Zone-redundant:* When the affected availability zone recovers, Application Gateway automatically takes the following actions:

  - Restores instances in the recovered zone

  - Removes any temporary instances that were created in other zones during the outage

  - Returns to normal traffic distribution across all available zones

- *Zonal:* You're responsible for rerouting traffic to the gateway in the original availability zone after the availability zone recovers.

### Testing for zone failures

The options for testing for zone failures depend on the availability zone configuration that your gateway uses.

- *Zone-redundant:* The Application Gateway platform fully manages traffic routing, failover, and failback for zone-redundant gateways. Because Microsoft manages this feature, you don't need to initiate or validate availability zone failure processes. The platform handles all zone failure scenarios transparently.

- *Zonal:* You can simulate some aspects of the failure of an availability zone by explicitly stopping a gateway. By stopping the gateway, you can test how other systems and load balancers handle an outage in the gateway. For more information, see [How to stop and start Application Gateway](/azure/application-gateway/application-gateway-faq#how-can-i-stop-and-start-application-gateway).

## Multi-region support

Application Gateway v2 is a single-region service. If the region becomes unavailable, your gateway is also unavailable.

### Alternative multi-region approaches

To achieve multi-region resilience by using Application Gateway v2, you need to deploy separate gateways in each desired region and implement traffic management across regions. You're responsible for deploying and configuring each of the gateways, as well as traffic routing and failover. Consider the following points:

- Configure consistent Application Gateway rules and policies across regions. You can define infrastructure as code (IaC) by using tools like Bicep or Terraform to simplify your deployments and configurations across regions.

- Deploy a global load balancing solution that can send traffic between your regional gateways. The global load balancing services in Azure are Azure Traffic Manager and Azure Front Door. Each service routes traffic based on health checks, geographic proximity, or performance metrics. Azure Front Door also provides a range of other capabilities, including distributed denial-of-service (DDoS) attack protection, WAF capabilities, and advanced rules and routing features.

- Beyond the gateway, consider replicating back-end applications and data across regions. Consult the reliability guides for each Azure service to understand multi-region deployment approaches.

For an example approach, see [Use Application Gateway with Traffic Manager](/azure/traffic-manager/traffic-manager-use-with-application-gateway).

## Backups

Application Gateway v2 is a stateless service that doesn't require traditional backup and restore operations. All configuration data is stored in Resource Manager and can be redeployed by using IaC approaches, such as Bicep files or ARM templates.

For configuration management and disaster recovery, you should take the following actions:

- Define your Application Gateway deployment's configuration by using Bicep files or ARM templates, or export an existing gateway's configuration.

- Store transport layer security (TLS) certificates in Azure Key Vault for secure management and replication.

- Document and version control custom configurations, rules, and policies.

- Implement automated deployment pipelines for consistent gateway provisioning.

For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't. For more information, see [Redundancy, replication, and backup](concept-redundancy-replication-backup.md).

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

## Related content

- [Azure reliability overview](/azure/reliability/overview)
