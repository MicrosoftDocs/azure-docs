---
title: Enable Zone Resiliency for Azure Workloads
description: Learn how to enable zone resilience for Azure workloads. Understand how to prioritize workloads and Azure services for zone resiliency across various services.
author: anaharris-ms
ms.service: azure
ms.subservice: azure-reliability
ms.topic: conceptual
ms.date: 10/29/2025
ms.author: anaharris
ms.custom: subject-reliability
---

# Enable zone resiliency for Azure workloads

To make your applications more resilient to zone-related hardware failures, network disruptions, and natural disasters, it's important that design your Azure workloads for zone resiliency. When you distribute resources across multiple availability zones within a region, you reduce the risk of a single zone outage affecting critical services.

Although it's a best practice to address zone resiliency during the initial planning and deployment of workloads, it's common to want to convert existing non-resilient workloads to zone resilient configurations. In general, the processing of enabling zone resiliency for existing workloads is straightforward, and Microsoft continues to simplify the process. However, any change to your workload can introduce an amount of risk. Once you understand the risks that are involved, you'll then be able to assess and prioritize which workloads and services within those workloads are most vital to your business, then apply zone resiliency to the most impactful resources first.

This article outlines key considerations for enabling zone resiliency in your Azure workloads. It also helps you plan and implement a successful transition to a more resilient architecture.

> [!TIP]
> If you're currently in the process of designing your workloads or plan to do a design review of your current workloads, it's important that you follow the [recommendations for designing for redundancy in the Azure Well-Architected Framework (WAF)](/azure/well-architected/reliability/redundancy). The WAF recommendations guide helps you design workload redundancy across multiple levels, with a focus on critical workflows. To support availability zone adoption, it also outlines strategies like multi-region deployments and deployment stamps.

## What is zone resiliency?

Azure services can be made resilient to availability zone outages in two primary ways:

- **Zone-redundant services:** Many Azure services support zone redundancy. These services automatically replicate data between availability zones, distribute incoming requests, and fail over to different zones during a zone failure. Each service supports these capabilities in a way that makes sense for that specific service. Some services are zone redundant by default, while other services might need you to configure zone redundancy.

- **Zonal services:** Some Azure services are zonal, which means that they can be pinned to a specific availability zone. To achieve zone resiliency by using a zonal service, deploy separate instances of the service in multiple availability zones. You might also need to manage traffic distribution, replication of data, and failover between the instances.

Some services can be deployed in either a zone-redundant or zonal configuration. For most cases, it's best to deploy zone-redundant services when you can.

For more information, see [Types of availability zone support](./availability-zones-overview.md#types-of-availability-zone-support).

## Zone enablement procedure

Use the following steps to systematically review your Azure workloads, prioritize them for zone resiliency, and enable zone resiliency for each component.

### Prerequisites

Before you begin, perform the following actions:

- **Identify each workload.** A *workload* refers to a collection of application resources, data, and supporting infrastructure that function together to achieve defined business outcomes. For more information about workloads and how to define them, see [Well-Architected Framework workloads](/azure/well-architected/workloads).

- **Prioritize each workload's user and system flows.** Understand the critical paths and dependencies of your workloads to determine which components to make zone resilient first. For more information about how to use critical flow analysis to prioritize workflows, see [Prioritize workloads for zone resiliency](/azure/well-architected/reliability/identify-flows).
 
- **Assign a criticality rating to each workload and flow.** This rating helps you understand the impact of a potential outage on your business and guides your decisions about which workloads to prioritize for zone resiliency. Also consider the amount of acceptable downtime while you reconfigure the workloads.

   You can use a taxonomy to classify your workloads based on their criticality. This approach helps you focus your efforts on the most important services.
 
   Consider the following example taxonomy to classify your workloads.

   | Workload type | Description | Effect of disruption |
   |-|-|-|
   | Mission-critical | Critical flows and workloads that must be highly reliable, always available, resilient to failures, and operational | Any disruption to essential functions immediately risks catastrophic business damage or introduces risks to human life. |
   | Business-critical | Essential flows and workloads that operate important business functions | Disruption risks some financial loss or brand damage. |
   | Business‑operational | Contributes to efficiency of business operations, but out of direct line-of-service to customers | Can tolerate some level of disruption. |
   | Administrative | Internal production flows and workloads not aligned to business operations | Can tolerate disruption. |

   For more information about how to classify your workloads according to criticality rating, see [Assign a criticality rating to each flow](/azure/well-architected/reliability/identify-flows#assign-a-criticality-rating-to-each-flow).

- **Verify that the regions where your Azure resources reside support availability zones.** Consult the [Azure regions list](./regions-list.md). If a region doesn't support availability zones, consider relocating your resources to a region that does. For more information, see [Move Azure resources across resource groups, subscriptions, or regions](/azure/azure-resource-manager/management/move-resources-overview).

### Step 1: Prioritize Azure services for zone resilience

After you determine which workload flows are most critical to your business, you can focus on the Azure services that those flows depend on. Some Azure services are more critical to your applications than others. Prioritize these services to help ensure that your applications remain available and resilient if a zone failure occurs.

Use the following guidance to prioritize Azure service groups based on their criticality to your workloads. Consider your specific application architecture and business requirements when you determine the priority of services for zone resiliency.

1. **Start with networking services.** Workloads tend to share networking services, so an increase in the resiliency of these services can improve the resiliency of multiple workloads at once.

   Many core networking services are zone redundant automatically, but you should focus on components like Azure ExpressRoute gateways, Azure VPN Gateway, Azure Application Gateway, Azure Load Balancer, and Azure Firewall.

1. **Improve operational data storage resiliency.** Operational data stores contain valuable data that multiple workloads often use, so improving the availability of those data stores can help many workloads.

   For operational data storage resiliency, focus on services like Azure SQL Database, Azure SQL Managed Instance, Azure Storage, Azure Data Lake Storage, Azure Cosmos DB, Azure PostgreSQL Flexible Server, Azure MySQL Flexible Server, and Azure Cache for Redis.

1. **Prioritize compute services.** These services are often easy to replicate and distribute among zones because they're stateless.

   Compute services include Azure Virtual Machines, Azure Virtual Machine Scale Sets, Azure Kubernetes Service (AKS), Azure App Service, App Service Environment, Azure Functions, Azure Service Fabric, and Azure Container Apps. 

1. **Review remaining business-critical resources that your critical flows use.** These resources might not be as critical as the resources listed previously, but they still play a role in your application's functionality, and you should consider them for zone resiliency.

1. **Review the rest of your business-operational resources.** Make informed decisions about whether to make them zone resilient. This review includes services that might not directly relate to your critical workloads but still contribute to overall application performance and reliability.

### Step 2: Assess zone configuration approaches

After you prioritize your workloads and Azure services, identify the approach required to enable availability zone support for each service, and understand what you need to do to configure zone resiliency. 

Each Azure reliability service guide provides a section that describes how to enable zone resiliency for that service. This section helps you understand the effort required to make each service zone resilient so that you can plan your strategy accordingly. For more information about a specific service, see [Azure reliability service guides](./overview-reliability-guidance.md).

Use the [zone configuration table](#azure-services-by-zone-configuration-approach) to quickly understand approaches for common Azure services.

> [!IMPORTANT]
> If your workload includes components deployed in a zonal (or single-zone) configuration, plan to make these components resilient to zone outages. A common approach is to deploy separate instances into another availability zone and switch between them if necessary.

### Step 3: Test for latency

When you make workloads zone resilient, consider latency between availability zones. Occasionally, some legacy systems can't tolerate the small amount of extra latency that cross-zone traffic introduces, especially when you enable synchronous replication within the data tier. If you suspect that cross-zone latency might affect your workload, run tests before and after you enable zone resiliency.

## Zone configuration approaches for Azure services

Each Azure service supports a specific type of availability zone support, which is based on the service's intended use and internal architecture. If you have a resource that isn't configured to use availability zones (or a *nonzonal* resource), you might want to reconfigure it with availability zone support. The reliability guide for that service provides guidance or links to availability zone configuration instructions.

This section provides an overview of the different types of zone configuration approaches and which approach each service supports.

> [!IMPORTANT]
> When you enable *zone redundancy* on a resource, that resource becomes automatically resilient to zone failures. When you use a *zonal* configuration to pin the resource to a specific availability zone, the resource isn't automatically zone redundant. You must make it resilient to a zone failure. For zonal services, this article reflects the complexity and cost of pinning to a zone. For more information about extra steps to achieve zone resiliency, see the [service's reliability guide](overview-reliability-guidance.md).

The [zone configuration table](#azure-services-by-zone-configuration-approach) lists the supported zone configuration approach for many Azure services and contains a link to each reliability guide for that service. The reliability guide provides information about how to configure nonzonal service resources to enable availability zone support.

The following table describes each zone configuration approach, including the level of effort and downtime required to enable availability zones.

| Approach | Description | Typical level of effort | Might require downtime |
| --- | --- | --- | --- |
| Always zone resilient | The service is zone resilient by default in [regions that support availability zones](./regions-list.md). No action is required. | None | No |
| Enablement | Minimal configuration changes required, such as enabling zone redundancy in settings. The process doesn't affect availability, but consider effects on cost or performance. | Low | No |
| Modification | Likely requires some configuration changes, such as redeploying dependent resources or modifying network settings. | Medium | Yes |
| Redeployment | Significant changes required, such as redeploying entire resources, applications, or services, or migrating data to new services. | High | Yes | 

Understand the cost of enabling availability zone support for a service. For many services, enabling availability zones doesn't add cost. But some services require a specific tier, a specific number of capacity units, or both. Other services charge different rates when you use availability zones. The table in the next section lists the typical cost impact for each service.

> [!NOTE]
> The information in this article summarizes the typical approach to enable availability zone support and outlines the typical cost impact. But some factors might affect how it works for your specific solution. For example, some services are listed as *always zone resilient*, but this designation only applies in specific regions or for specific tiers of the service. Use these tables as a starting point, but review the other resources mentioned to understand the specific details.

### Azure services by zone configuration approach

The following table summarizes the availability zone support for many Azure services and provides an approach, including cost impact, to enable availability zone support for each service.

| Service | Can be zone redundant | Can be zonal | Typical zone configuration approach | Typical cost impact |
|-|-|-|-|-|
| [Azure AI Search](./reliability-ai-search.md#resilience-to-availability-zone-failures) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone resilient | N/A |
| [Azure API Management](./reliability-api-management.md#resilience-to-availability-zone-failures) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Modification | Minimum tier required |
| [Azure App Configuration](migrate-app-configuration.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone resilient | N/A|
| [Azure App Service](reliability-app-service.md#configure-availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement | Minimum tier and instance count required |
| [Azure App Service - App Service Environment](reliability-app-service-environment.md#configure-availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement | Minimum instance count required |
| [Azure Application Gateway](./reliability-application-gateway-v2.md#configure-availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Always zone resilient | N/A|
| [Azure Backup](migrate-recovery-services-vault.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment | Moderate cost increase |
| [Azure Bastion](./reliability-bastion.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Redeployment | No cost impact |
| [Azure Batch](reliability-batch.md#availability-zone-migration) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment | No cost impact for same number of virtual machines (VMs) |
| [Azure Blob Storage](./reliability-storage-blob.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement | Moderate cost increase |
| [Azure Cache for Redis - Enterprise](migrate-cache-redis.md#enabling-zone-redundancy-for-enterprise-and-enterprise-flash-tiers) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment | No cost impact   |
| [Azure Cache for Redis - Standard and Premium](migrate-cache-redis.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement | Minimum tier required |
| [Azure Container Apps](reliability-container-apps.md#resilience-to-availability-zone-failures) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment | Minimum replica count required |
| [Azure Container Instances](./reliability-container-instances.md#availability-zone-support) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Redeployment | No cost impact |
| [Azure Container Registry](/azure/container-registry/zone-redundancy?toc=/azure/reliability) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone resilient | N/A |
| [Azure Cosmos DB for NoSQL](./reliability-cosmos-db-nosql.md#migrate-to-availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Modification | None if using autoscale or multi-region writes |
| [Azure Data Factory](./reliability-data-factory.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone resilient | N/A |
| [Azure Data Lake Storage](reliability-storage-blob.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement | Moderate cost increase |
| [Azure Database for MySQL - Flexible Server](migrate-database-mysql-flex.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment | Requires primary and high availability (HA) instance |
| [Azure Database for PostgreSQL - Flexible Server](./reliability-postgresql-flexible-server.md#availability-zone-redeployment-and-migration) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement | Requires primary and HA instance |
| [Azure Disk Storage (managed disks)](migrate-vm.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Enablement | Moderate cost increase |
| [Azure Elastic SAN](reliability-elastic-san.md#availability-zone-migration) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment | Moderate cost increase |
| [Azure Event Hubs: Dedicated tier](./reliability-event-hubs.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone resilient | Minimum capacity units (CUs) required |
| [Azure Event Hubs: all other tiers](./reliability-event-hubs.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone resilient | N/A |
| [Azure ExpressRoute](/azure/expressroute/expressroute-howto-gateway-migration-portal) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Modification | Depends on tier |
| [Azure Files](./reliability-storage-files.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement | Moderate cost increase |
| [Azure Firewall](./reliability-firewall.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Modification | No cost impact |
| [Azure Functions](reliability-functions.md#availability-zone-migration) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment | Minimum tier and instance count required |
| [Azure HDInsight](reliability-hdinsight.md#availability-zone-migration) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Redeployment | No cost impact for same number of nodes |
| [Azure IoT Hub](./reliability-iot-hub.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone resilient | N/A |
| [Azure Key Vault](./reliability-key-vault.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone resilient | N/A |
| [Azure Kubernetes Service (AKS)](./reliability-aks.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment | No cost impact |
| [Azure Load Balancer](migrate-load-balancer.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Modification | No cost impact |
| [Azure Logic Apps - Consumption tier](./reliability-logic-apps.md?pivots=standard-workflow-service-plan#configure-availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone resilient |N/A |
| [Azure Logic Apps - Standard tier](./reliability-logic-apps.md?pivots=consumption#configure-availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment | Minimum tier and instance count required |
| [Azure Managed Grafana](/azure/managed-grafana/high-availability) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeploy | Moderate cost increase |
| [Azure Monitor: Log Analytics](migrate-monitor-log-analytics.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone resilient | |
| [Azure NetApp Files](./reliability-netapp-files.md#availability-zone-support) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Redeployment | Depends on replication configuration |
| [Azure Queue Storage](./reliability-storage-queue.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement | Moderate cost increase |
| [Azure Service Bus](/azure/service-bus-messaging/service-bus-outages-disasters#availability-zones) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone resilient | N/A |
| [Azure Service Fabric](migrate-service-fabric.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Redeployment | No cost impact for same number of VMs |
| [Azure Site Recovery](migrate-recovery-services-vault.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment | No cost impact for Site Recovery, moderate cost increase for replica storage |
| [Azure SQL Database: Business Critical tier](./reliability-sql-database.md?pivots=business-critical#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement | No cost impact |
| [Azure SQL Database: General Purpose tier](./reliability-sql-database.md?pivots=business-critical#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement | Moderate cost increase |
| [Azure SQL Database: Hyperscale tier](./reliability-sql-database.md?pivots=business-critical#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment | Minimum replica count required |
| [Azure SQL Database: Premium tier](./reliability-sql-database.md?pivots=business-critical#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement | No cost impact |
| [Azure SQL Managed Instance](./reliability-sql-managed-instance.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement | Moderate cost increase |
| [Azure Table Storage](./reliability-storage-table.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement | Moderate cost increase |
| [Azure Virtual Machine Scale Sets](migrate-vm.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Redeployment | No cost impact for same number of VMs |
| [Azure Virtual Machines](./reliability-virtual-machines.md#availability-zone-support) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Redeployment | No cost impact for same number of VMs |
| [Azure Virtual Network](./reliability-virtual-network.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone resilient | N/A |
| [Public IP address](/azure/virtual-network/ip-services/public-ip-addresses#availability-zone) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Always zone resilient | N/A|

## Related resources

- [Azure reliability guides](overview-reliability-guidance.md)
- [Azure services that support availability zones](availability-zones-service-support.md)
- [List of Azure regions](regions-list.md)
