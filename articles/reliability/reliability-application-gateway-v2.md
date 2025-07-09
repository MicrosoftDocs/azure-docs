---
title: Reliability in Azure Application Gateway v2
description: Configure Azure Application Gateway v2 for maximum reliability. Learn best practices for availability zones, multi-region deployments, and zone redundancy for production workloads.
author: mbender-ms
ms.author: mbender
ms.topic: reliability-article
ms.custom:
  - subject-reliability, references_regions
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:07/09/2025
ms.service: azure-application-gateway
ms.date: 07/09/2025
---

# Reliability in Azure Application Gateway v2

This article describes Azure Application Gateway v2 reliability support, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support). Learn how to configure your Application Gateway v2 for maximum reliability and fault tolerance in production environments.

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

Azure Application Gateway v2 is a web traffic load balancer that enables you to manage traffic to your web applications. It provides advanced features like autoscaling, zone redundancy, static VIP addresses, and Web Application Firewall (WAF) integration to deliver highly available and secure application delivery services.

## Production deployment recommendations

For production deployments, Microsoft recommends you:

- Use the **Standard_v2** SKU for production services because it supports autoscaling, zone redundancy, and provides a 99.95% SLA
- Let **zone redundancy** distribute Application Gateway instances across multiple availability zones for improved fault tolerance
- Set up **autoscaling** with appropriate minimum and maximum instance counts based on your traffic patterns
- Set minimum instance count to at least 2 to ensure redundancy and meet SLA requirements
- Deploy backend resources across multiple availability zones when possible to maintain end-to-end resilience

## Reliability architecture overview

Azure Application Gateway v2 achieves reliability through several architectural components:

- **Autoscaling and High Availability**: Azure Application Gateways are always deployed in a highly available fashion. The service consists of multiple instances that are created as configured (if autoscaling is disabled) or as required by application load (if autoscaling is enabled). Each instance can handle up to 10 Capacity Units, and the platform automatically manages instance creation, health monitoring, and replacement of unhealthy instances.
- **Zone Redundancy**: When configured for zone redundancy, Application Gateway v2 distributes instances across multiple availability zones within a region. This provides protection against zone-level failures while maintaining service availability.
- **Static VIP**: Application Gateway v2 provides a static Virtual IP (VIP) address that doesn't change throughout the lifecycle of the deployment, ensuring consistent DNS resolution and reducing configuration dependencies.
- **Dependencies**: Application Gateway v2 requires a dedicated subnet within a virtual network. The reliability of your overall solution depends on the configuration of these dependent resources. Backend pools can include Azure VMs, Virtual Machine Scale Sets, App Services, and external endpoints, and their availability configurations directly affect your application's resilience.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Azure Application Gateway v2 handles transient faults through built-in resilience mechanisms:

- **Health probes**: Continuous monitoring of backend targets with configurable health probe settings
- **Automatic failover**: Traffic redirection to healthy backend instances when unhealthy targets are detected
- **Connection draining**: Graceful removal of instances during scale-in events with a 5-minute connection drain period
- **Retry logic**: Clients should implement appropriate retry mechanisms for transient connection failures

For applications hosted behind Application Gateway, implement the Health Endpoint Monitoring pattern to expose application health status and enable Application Gateway to make informed routing decisions.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Application Gateway v2 supports zone redundancy, which provides enhanced fault tolerance by distributing gateway instances across multiple availability zones within a region.

### Region support

Zone-redundant Application Gateway v2 resources can be deployed in any region that supports availability zones. For the complete list of supported regions, see [Azure regions with availability zone support](../reliability/availability-zones-region-support.md).

### Requirements

- You must use the **Standard_v2** or **WAF_v2** SKU to enable zone redundancy
- The **Basic** SKU (preview) does not support zone redundancy
- Minimum of 2 instances required for zone redundancy benefits
- Zone redundancy must be configured during gateway creation and can't be changed after deployment

### Considerations

- Zone redundancy distributes instances automatically across available zones in the region
- During zone outages, connections may experience brief interruptions as traffic is redistributed
- Backend pools should also be configured for zone distribution to maintain end-to-end resilience
- New instance provisioning during scaling events may take 3-5 minutes

### Cost

Zone redundancy for Application Gateway v2 doesn't incur extra charges beyond the standard capacity unit pricing. You pay only for the compute capacity (Capacity Units) and fixed costs based on the gateway's operational time. For current pricing details, see [Application Gateway pricing](https://azure.microsoft.com/pricing/details/application-gateway/).

### Configure availability zone support

Zone redundancy can only be configured when creating a new Application Gateway v2 resource. Existing non-zone-redundant gateways can't be converted to use availability zones and must be replaced with new zone-redundant deployments.

To create a zone-redundant Application Gateway v2:

- **Azure portal**: Select zone redundancy during the gateway creation process
- **Azure CLI**: Use the `--zones` parameter when creating the Application Gateway
- **Azure PowerShell**: Use the `-Zone` parameter in the `New-AzApplicationGateway` command
- **Bicep/ARM templates**: Configure the `zones` property in the resource definition

For detailed deployment guidance, see:

- [Create an autoscaling, zone redundant application gateway](../application-gateway/tutorial-autoscale-ps.md)
- [Migrate Application Gateway to availability zone support](../reliability/migrate-app-gateway-v2.md)

### Capacity planning and management

When planning for zone failures, consider that instances in surviving zones can experience increased load. Configure autoscaling with appropriate maximum instance counts to handle potential traffic redistribution during zone outages. Monitor capacity metrics and adjust scaling parameters based on your traffic patterns and performance requirements.

### Normal operations

The following section describes what to expect when Application Gateway v2 is configured for zone redundancy and all availability zones are operational:

- **Traffic routing between zones**: When zone redundancy is enabled, Application Gateway automatically distributes incoming requests across instances in all available zones. This active-active configuration ensures optimal performance and load distribution under normal operating conditions.
- **Instance management**: The platform automatically manages instance placement across zones, replacing failed instances and maintaining the configured instance count. Health monitoring ensures that only healthy instances receive traffic.

### Zone-down experience

The Application Gateway platform automatically detects and responds to zone failures:

- **Detection and response**: Microsoft manages the detection of zone failures and automatically initiates failover. No customer action is required.
- **Notification**: Zone failure events can be monitored through Azure Service Health and Resource Health. Set up alerts on these services to receive notifications of zone-level issues.
- **Active requests**: Requests being processed by instances in the failed zone are terminated and should be retried by clients. New requests are automatically routed to healthy zones.
- **Expected data loss**: Zone failures aren't expected to cause data loss as Application Gateway is a stateless service.
- **Expected downtime**: No service downtime is expected during zone failures as traffic automatically routes to surviving zones.
- **Traffic rerouting**: Application Gateway immediately redistributes traffic to instances in healthy zones. The platform can create other instances in surviving zones if needed to maintain capacity.

### Failback

When the affected availability zone recovers, Application Gateway automatically:

- Restores instances in the recovered zone
- Removes any temporary instances that were created in other zones during the outage
- Returns to normal traffic distribution across all available zones

### Testing for zone failures

The Azure Application Gateway platform fully manages traffic routing, failover, and failback for zone-redundant resources. Because Microsoft manages this feature, you don't need to initiate or validate availability zone failure processes. The platform handles all zone failure scenarios transparently.

## Multi-region support

Azure Application Gateway v2 is a single-region service. If the region becomes unavailable, your Application Gateway resource is also unavailable.

### Alternative multi-region approaches

To achieve multi-region resilience with Application Gateway v2, you need to deploy separate gateway instances in each desired region and implement traffic management across regions:

- **Traffic Manager Integration**: Deploy Application Gateway instances in multiple regions and use Azure Traffic Manager to route traffic based on health checks, geographic proximity, or performance metrics.
- **Azure Front Door Integration**: Use Azure Front Door as a global load balancer to distribute traffic across Application Gateway instances deployed in different regions. This approach provides global load balancing, DDoS protection, and Web Application Firewall capabilities at the edge.
- **DNS-based Failover**: Configure DNS records with health checks to automatically route traffic to healthy regions when a regional outage occurs.

For architecture examples that illustrate multi-region approaches, see:

- [What is Traffic Manager?](../traffic-manager/traffic-manager-overview.md)
- [What is Azure Front Door?](../frontdoor/front-door-overview.md)
- [App Service multi-region architecture](../app-service/overview-hosting-plans.md)

When implementing multi-region deployments:

- Replicate backend applications and data across regions
- Configure consistent Application Gateway rules and policies across regions
- Implement health monitoring for cross-region failover decisions
- Consider regional data residency and compliance requirements

## Backups

Azure Application Gateway v2 is a stateless service that doesn't require traditional backup and restore operations. All configuration data is stored in Azure Resource Manager and can be redeployed using Infrastructure as Code (IaC) approaches.

For configuration management and disaster recovery:

- Export ARM templates or Bicep configurations for your Application Gateway deployments
- Store SSL certificates in Azure Key Vault for secure management and replication
- Document and version control custom configurations, rules, and policies
- Implement automated deployment pipelines for consistent gateway provisioning

> [!NOTE]
> For most solutions, you shouldn't rely exclusively on configuration exports. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, configuration management protects against configuration drift and enables rapid redeployment scenarios.

## Service-level agreement

The service-level agreement (SLA) for Azure Application Gateway v2 describes the expected availability of the service and the conditions that must be met to achieve that availability expectation:

- **Standard_v2 SKU**: Provides 99.95% availability SLA
- **Basic SKU (preview)**: Provides 99.9% availability SLA
- **Zone redundancy**: When enabled, increases the uptime percentage defined in the SLA

Key SLA requirements:

- Deploy a minimum of two instances for the Standard_v2 SKU to qualify for the SLA.
- Enable zone redundancy to receive enhanced SLA benefits.
- Configure health probes for all backend targets to ensure proper health monitoring.
- Ensure network connectivity and all dependent resources meet their respective SLA requirements.

For complete SLA details, see [SLA for Application Gateway](https://azure.microsoft.com/support/legal/sla/application-gateway/).

## Related content

- [Reliability in Azure](../availability-zones/overview.md)
