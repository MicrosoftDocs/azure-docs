---
title: Reliability in Azure Application Gateway v2
description: Configure Azure Application Gateway v2 for maximum reliability. Learn best practices for availability zones, multi-region deployments, and zone redundancy for production workloads.
author: mbender-ms
ms.author: mbender
ms.topic: reliability-article
ms.custom:
  - subject-reliability
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:07/09/2025
ms.service: azure-application-gateway
ms.date: 07/09/2025
---

# Reliability in Azure Application Gateway v2

Azure Application Gateway v2 is a web traffic load balancer that enables you to manage traffic to your web applications. It provides advanced features like autoscaling, zone redundancy, static VIP addresses, and Web Application Firewall (WAF) integration to deliver highly available and secure application delivery services.

This article describes Azure Application Gateway v2 reliability support, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support). Learn how to configure your Application Gateway v2 for maximum reliability and fault tolerance in production environments.

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

> [!IMPORTANT]
> The reliability of your overall solution depends on the configuration of the backend resources that Application Gateway routes traffic to. Depending on your solution these might be Azure VMs, Virtual Machine Scale Sets, App Services, and external endpoints.
>
> Your backend resources aren't in the scope of this article, but their availability configurations directly affect your application's resilience. Review the reliability guides for all of the Azure services in your solution to understand how each service supports your reliability requirements. By ensuring that your backend resources are also configured for high availability and zone redundancy, you can achieve end-to-end reliability for your application.

## Production deployment recommendations

To learn about how to deploy Azure API Management to support your solution's reliability requirements, and how reliability affects other aspects of your architecture, see [Architecture best practices for Azure Application Gateway in the Azure Well-Architected Framework](/azure/well-architected/service-guides/azure-application-gateway).

## Reliability architecture overview

An *instance* is a virtual machine (VM)-level unit of the gateway. Each instance represents a dedicated virtual machine that handles traffic. One instance is equal to one VM. You don't see or manage the VMs directly.

A *capacity unit* represents an amount of capacity that the gateway can process. A capacity unit is a synthetic measure that incorporates traffic, the number of connections, and compute resources. Each instance can handle at least 10 capacity units.

You configure Azure Application Gateway to use one of the following scaling modes:

- **Autoscaling:** Automatically adjusts the number of instances within a range that you specify. Autoscaling scales the number of instances based on how many capacity units are needed to meet the current traffic demand.
- **Manual scaling:** Requires you to specify an exact number of instances. You're responsible for selecting an instance count that meets your demand for capacity units.

For more information, see [Scaling Application Gateway v2 and WAF v2](/azure/application-gateway/application-gateway-autoscaling-zone-redundant).

The platform automatically manages instance creation, health monitoring, and replacement of unhealthy instances. It also manages gracefully removing instances during scale-in events (connection draining).

Azure Application Gateway uses [health probes](/azure/application-gateway/application-gateway-probe-overview) to continuously monitor your backend servers, like individual application servers. Traffic can be automatically redirected to healthy backend servers when unhealthy servers are detected.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

When you use Azure Application Gateway:

- Clients should implement appropriate retry mechanisms for transient connection failures.

- Configure your health probes to allow a grace period for transient faults. Health probes can be configured with an *unhealthy threshold*, which specifies the number of consecutive failed connection attempts that should trigger the backend server to be marked as unhealthy. The default value of 3 ensures that transient faults in your backend servers don't trigger Application Gateway to unnecessarily mark the server as unhealthy.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Application Gateway offers two types of availability zone support when you deploy a Standard_v2 or WAF_v2 gateway in a supported region:
	
- *Zone-redundant*: Provides automatic redundancy for service components. Azure automatically replicates the service components across two or more availability zones.

- *Zonal*: The Application Gateway service components are deployed in a single zone that you select within an Azure region. All of the instances are placed into the same availability zone.

    > [!IMPORTANT]
    > Pinning to a single availability zone is only recommended when [cross-zone latency](./availability-zones-overview.md#inter-zone-latency) is too high for your needs, and when you have verified that the latency doesn't meet your requirements. By itself, a zonal gateway doesn’t provide resiliency to an availability zone outage. To improve the resiliency of a zonal Application Gateway deployment, you need to explicitly deploy separate gateways into multiple availability zones and configure traffic routing and failover.

### Region support

Azure Application Gateway supports availability zones for the Standard_v2 and WAF_v2 tiers in all of the [Azure regions that support availability zones](./regions-list.md).

### Requirements

- You must use the Standard_v2 or WAF_v2 SKU to enable availability zone support.

- Your gateway must have at least two instances.

  > [!NOTE]
  > All gateways have at least two instances. Even if the Azure portal indicates that your gateway has a single instance, internally it's always created with at least two instances.

### Considerations

Zone-redundant gateways are spread across two or more availability zones in the region. For example, in a region with three availability zones, a zone-redundant Application Gateway v2 deployment will have instances in at least two of those zones. Depending on region capacity and platform decisions, it may be only two zones, or it may be all three zones.

### Cost

Availability zone support for Application Gateway v2 doesn't incur extra charges beyond the standard capacity unit pricing. For pricing details, see [Understanding Pricing for Azure Application Gateway and Web Application Firewall](/azure/application-gateway/understanding-pricing) and [Application Gateway pricing](https://azure.microsoft.com/pricing/details/application-gateway/).

### Configure availability zone support

This section explains how to configure availability zone support for your gateways.

- **Create a new Application Gateway v2 resource with availability zone support:** The approach you use to configure availability zones depends on whether you want to create a zone-redundant or zonal gateway.

  - *Zone-redundant:* New Application Gateway v2 resources are created as zone-redundant by default. Instances are spread across multiple availability zones and can use all zones in the region.

    To deploy a new gateway, see [Quickstart: Direct web traffic with Azure Application Gateway - Azure portal](../application-gateway/quick-create-portal.md).

    > [!NOTE]
    > When you deploy a new gateway, the gateway might appear not to be zone-redundant when you check in the Azure portal or in other tooling. However, if it's deployed in a region that supports availability zones, it is guaranteed to be zone-redundant by default.

    When you use the Azure CLI, Azure PowerShell, Bicep, ARM templates, or Terraform, you can optionally specify the availability zones to deploy your gateway into. You can deploy a zone-redundant gateway by specifying two or more zones. However, we recommend that you omit the zone list so that your gateway can use all of the availability zones, unless you have a specific reason not to use a particular zone.

  - *Zonal:* You can deploy a zonal gateway by using the following tooling:

    - *Azure CLI:* You should explicitly select zones by using the `--zones` parameter in the `az network application-gateway create` command. To pin the gateway to a single zone, specify the logical zone number.
    - *Azure PowerShell:* Use the `-Zone` parameter in the `New-AzApplicationGateway` command. To pin the gateway to a single zone, specify the logical zone number.
    - *Bicep/ARM templates:*: Configure the `zones` property in the resource definition. To pin the gateway to a single zone, specify the logical zone number.

    > [!NOTE]
    > [!INCLUDE [Availability zone numbering](./includes/reliability-availability-zone-numbering-include.md)]

- **Change the availability zone configuration of an existing Application Gateway v2 resource:** Microsoft is automatically upgrading all existing nonzonal gateways to be zone redundant, with no action from you. This upgrade is expected to be completed in 2025.

- **Disable availability zone support:** Availability zone support can't be disabled.

### Capacity planning and management

When planning for zone failures for a zone-redundant application gateway or multiple zonal gateways deployed into multiple zones, consider that instances in surviving zones can experience increased load, and connections may experience brief interruptions, usually a few seconds, as traffic is redistributed.

To manage capacity effectively:

- **We recommend using autoscaling.** Configure autoscaling with appropriate maximum instance counts to handle potential traffic redistribution during zone outages.

  If you use manual scaling, to prepare for availability zone failure, consider *over-provisioning* the number of instances in your gateway. Over-provisioning allows the solution to tolerate some degree of capacity loss and continue to function without degraded performance. For more information, see [Manage capacity with over-provisioning](/azure/reliability/concept-redundancy-replication-backup#manage-capacity-with-over-provisioning).

- **Monitor capacity metrics** and adjust scaling parameters based on your traffic patterns and performance requirements.

### Normal operations

The following section describes what to expect when Application Gateway v2 is configured with availability zone support and all availability zones are operational:

- **Traffic routing between zones**: Application Gateway automatically distributes incoming requests across instances in all of the zones that your gateway uses. This active-active configuration ensures optimal performance and load distribution under normal operating conditions.

- **Instance management**: The platform automatically manages instance placement across the zones your gateway uses, replacing failed instances and maintaining the configured instance count. Health monitoring ensures that only healthy instances receive traffic.

### Zone-down experience

The following section describes what to expect when Application Gateway v2 is configured with availability zone support and one or more availability zones are unavailable:

- **Detection and response**: Responsibility for detection and response depends on the availability zone configuration your gateway uses.

  - *Zone-redundant:* Microsoft manages the detection of zone failures and automatically initiates failover. No customer action is required.

  - *Zonal:* You need to detect the loss of an availability zone and initiate a failover to a secondary gateway that you create in another availability zone.

- **Notification**: Zone failure events can be monitored through Azure Service Health and Resource Health. Set up alerts on these services to receive notifications of zone-level issues.

- **Active requests**: Requests being processed by instances in the failed zone are terminated and should be retried by clients, following the guidance for [handling transient faults](#transient-faults).

- **Expected data loss**: Zone failures aren't expected to cause data loss as Application Gateway is a stateless service.

- **Expected downtime**: The downtime you can expect depends on the availability zone configuration your gateway uses:

  - *Zone-redundant:* During zone outages, connections may experience brief interruptions, typically lasting a few seconds, as traffic is redistributed.

  - *Zonal:* When a zone is unavailable, your gateway is unavailable until the availability zone recovers.

- **Instance management:** The instance management behavior depends on the availability zone configuration that your gateway uses. 

  - *Zone-redundant:* The platform attempts to maintain the capacity of your gateway by creating temporary instances in other availability zones.

    Internally, Application Gateway uses virtual machine scale sets, which performs [best-effort zone balancing](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones#zone-balancing). Because of this behavior, scaling operations might not occur when the capacity can't be evenly divided between zones (+/- 1 instance).

  - *Zonal:* You're responsible for creating instances in healthy zones if you require them.

- **Traffic rerouting**: The traffic rerouting behavior depends on the availability zone configuration that your gateway uses. 

  - *Zone-redundant:* Application Gateway immediately redistributes traffic to the instances in healthy zones, including any instances that are temporarily created.

  - *Zonal:* When a zone is unavailable, your gateway is unavailable. If you have a secondary gateway in another availability zone, you're responsible for rerouting traffic to that secondary gateway.

### Failback

The failback behavior depends on the availability zone configuration that your gateway uses:

- *Zone-redundant:* When the affected availability zone recovers, Application Gateway automatically:

  - Restores instances in the recovered zone
  - Removes any temporary instances that were created in other zones during the outage
  - Returns to normal traffic distribution across all available zones

- *Zonal:* You're responsible for rerouting traffic to the gateway in the original availability zone after the availability zone recovers.

### Testing for zone failures

The options for testing for zone failures depend on the availability zone configuration that your gateway uses:

- *Zone-redundant:* The Azure Application Gateway platform fully manages traffic routing, failover, and failback for zone-redundant resources. Because Microsoft manages this feature, you don't need to initiate or validate availability zone failure processes. The platform handles all zone failure scenarios transparently.

- *Zonal:* You can simulate some aspects of the failure of an availability zone by explicitly stopping an Application Gateway resource. By stopping the Application Gateway, you can test how other systems and load balancers handle an outage in the gateway. For more information, see [How can I stop and start Application Gateway?](/azure/application-gateway/application-gateway-faq#how-can-i-stop-and-start-application-gateway).

## Multi-region support

Azure Application Gateway v2 is a single-region service. If the region becomes unavailable, your Application Gateway resource is also unavailable.

### Alternative multi-region approaches

To achieve multi-region resilience with Application Gateway v2, you need to deploy separate gateways in each desired region and implement traffic management across regions. You're responsible for deploying and configuring each of the gateways, as well as traffic routing and failover. Consider the following points:

- Configure consistent Application Gateway rules and policies across regions. You can define infrastructure as code by using tools like Bicep or Terraform to simplify your deployments and configurations across regions.

- Deploy a global load balancing solution that can send traffic between your regional gateways. The global load balancing services in Azure are Azure Traffic Manager and Azure Front Door. Each service routes traffic based on health checks, geographic proximity, or performance metrics. Azure Front Door also provides a range of other capabilities including DDoS protection, web application firewall capabilities, and advanced rules and routing features.

- Beyond the gateway, consider replicating backend applications and data across regions. Consult the reliability guides for each Azure service to understand multi-region deployment approaches.

For an example approach, see [Use Azure App Gateway with Azure Traffic Manager](/azure/traffic-manager/traffic-manager-use-with-application-gateway).

## Backups

Azure Application Gateway v2 is a stateless service that doesn't require traditional backup and restore operations. All configuration data is stored in Azure Resource Manager and can be redeployed using Infrastructure as Code (IaC) approaches, such as Bicep files or Azure Resource Manager templates (ARM templates).

For configuration management and disaster recovery:

- Define your Application Gateway deployment's configuration by using Bicep files or ARM templates, or export an existing gateway's configuration
- Store TLS certificates in Azure Key Vault for secure management and replication
- Document and version control custom configurations, rules, and policies
- Implement automated deployment pipelines for consistent gateway provisioning

> [!NOTE]
> For most solutions, you shouldn't rely exclusively on configuration exports. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, configuration management protects against configuration drift and enables rapid redeployment scenarios.

## Service-level agreement

The service-level agreement (SLA) for Azure Application Gateway describes the expected availability of the service. It also describes the conditions that must be met to achieve that availability expectation. To understand those conditions, it's important that you review the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Related content
