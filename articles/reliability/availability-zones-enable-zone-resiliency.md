---
title: Enable Zone Resiliency for Azure Workloads
description: Learn how to enable zone resilience for Azure workloads. Understand how to prioritize workloads and Azure services for zone resiliency across various services.
author: anaharris-ms
ms.service: azure
ms.subservice: azure-reliability
ms.topic: conceptual
ms.date: 08/21/2025
ms.author: anaharris
ms.custom: subject-reliability
---

# Enable zone resiliency for Azure workloads

Designing your Azure workloads for zone resiliency helps safeguard your applications against hardware failures, network disruptions, and natural disasters. By distributing resources across multiple availability zones within a region for zone resiliency, you reduce the risk of a single zone outage affecting your critical services.

Zone resiliency is most effectively addressed during the initial planning and deployment of workloads. However, many existing workloads might not yet be configured to support this level of protection. In most cases, enabling zone resiliency for deployed workloads is straightforward, and Microsoft continues to make improvements that further simplify the process. However, because any change to your workload can introduce risk, it's essential to plan carefully. Assess and prioritize which workloads and services within those workloads are most vital to your business. Then apply zone resiliency to the most impactful resources first.

This article outlines key considerations for enabling zone resiliency in your Azure workloads. It also helps you plan and implement a successful transition to a more resilient architecture.

> [!TIP]
> If you're currently in the process of designing your workloads or plan to do a design review of your current workloads, it's important that you follow the [recommendations for designing for redundancy in the Azure Well-Architected Framework](/azure/well-architected/reliability/redundancy). The linked article can help you design workload redundancy across multiple levels, with a focus on critical workflows. To support availability zone adoption, the redundancy recommendations guide in the Well-Architected Framework also outlines strategies like multi-region deployments and deployment stamps.

## What is zone resiliency?

Azure services can be made resilient to availability zone outages in two primary ways:

- **Zone-redundant services:** Many Azure services support *zone redundancy*. These services automatically replicate data between availability zones, distribute incoming requests, and fail over to different zones during a zone failure. Each service supports these capabilities in a way that makes sense for each service. Some services are zone-redundant by default, while other services might need you to configure zone redundancy.

- **Zonal services:** Some Azure services are *zonal*, which means that they can be pinned to a specific availability zone. To achieve zone resiliency by using a zonal service, you need to deploy separate instances of the service in multiple availability zones. You might also need to manage traffic distribution, replication of data, and failover between the instances.

Some services can be deployed in either a zone-redundant or zonal configuration. For most cases, it's best to deploy zone-redundant services when you can.

For more information, see [Types of availability zone support](./availability-zones-overview.md#types-of-availability-zone-support).

## Zone enablement procedure

Use the following steps to systematically review your Azure workloads, prioritize them for zone resiliency, and enable zone resiliency for each component.

### Prerequisites

Before you begin, you must perform the following actions:

- **Identify each workload.** A *workload* refers to a collection of application resources, data, and supporting infrastructure that function together to achieve defined business outcomes. For more information about workloads and how to define them, see [Well-Architected Framework workloads](/azure/well-architected/workloads).

- **Prioritize each workload's user and system flows.** Understanding the critical paths and dependencies of your workloads is essential for determining which components to make zone-resilient first. For more information about how to prioritize workflows by using critical flow analysis, see [Prioritize workloads for zone resiliency](/azure/well-architected/reliability/identify-flows).
 
- **Assign a criticality rating to each workload and flow.** This rating helps you understand the impact of a potential outage on your business and guides your decisions on which workloads to prioritize for zone resiliency. You should also consider the amount of downtime that's acceptable while you reconfigure the workloads.

   You can use a simple taxonomy to classify your workloads based on their criticality. This approach helps you focus your efforts on the most important services.
 
   Consider the following example taxonomy to classify your workloads.

   | Workload type | Description | Effect of disruption |
   |-|-|-|
   | Mission-critical | Critical flows and workloads that must be highly reliable, always available, resilient to failures, and operational | Any disruption to essential functions immediately risks catastrophic business damage or introduces risks to human life. |
   | Business-critical | Essential flows and workloads that operate important business functions | Disruption risks some financial loss or brand damage. |
   | Business-operational | Contributes to efficiency of business operations, but out of direct line-of-service to customers | Some level of disruption can be tolerated. |
   | Administrative | Internal production flows and workloads not aligned to business operations | Disruption can be tolerated. |

   For more information about how to classify your workloads according to criticality rating, see [Assign a criticality rating to each flow](/azure/well-architected/reliability/identify-flows#assign-a-criticality-rating-to-each-flow).

- **Verify that the regions your Azure resources are located in support availability zones.** Consult the [Azure regions list](./regions-list.md). If a region doesn't support availability zones, consider relocating your resources to a region that does. For more information, see [Move Azure resources across resource groups, subscriptions, or regions](/azure/azure-resource-manager/management/move-resources-overview).

### Step 1: Prioritize Azure services for zone resilience

After you determine which workload flows are most critical to your business, you can focus on the Azure services that those flows depend on. Some Azure services are more critical to your applications than others. By prioritizing these services, you can help ensure that your applications remain available and resilient if a zone failure occurs.

Use the following guidance to prioritize Azure service groups based on their criticality to your workloads. It's important to consider your specific application architecture and business requirements when you determine the priority of services for zone resiliency.

1. **Begin with networking services.** Workloads tend to share networking services, so an increase in their resiliency can improve the resiliency of multiple workloads at once.

   Many core networking services are zone-redundant automatically, but you should focus on components like Azure ExpressRoute gateways, Azure VPN Gateway, Azure Application Gateway, Azure Load Balancer, and Azure Firewall.

1. **Operational data storage** contains valuable data that multiple workloads often use, which means that improving the availability of those data stores can help many workloads.

   For operational data storage resiliency, focus on services like Azure SQL Database, Azure SQL Managed Instance, Azure Storage, Azure Data Lake Storage, Azure Cosmos DB, Azure PostgreSQL Flexible Server, Azure MySQL Flexible Server, and Azure Cache for Redis.

1. **Compute services** are often the next priority. Compute services are often easy to replicate and distribute among zones because they're stateless.

   Compute services include Azure Virtual Machines, Azure Virtual Machine Scale Sets, Azure Kubernetes Service (AKS), Azure App Service, App Service Environment, Azure Functions, and Azure Container Apps. 

1. Review all **remaining business-critical** resources that are used in your critical flows. These resources might not be as critical as the resources listed previously, but they still play a role in your application's functionality and should be considered for zone resiliency.

1. Review the rest of your **business-operational resources** and make informed decisions about whether to make them zone-resilient. This review includes services that might not be directly tied to your critical workloads but still contribute to overall application performance and reliability.

### Step 2: Assess zone configuration approaches

After you prioritize your workloads and Azure services, it's important to understand the approach that you can use to enable availability zone support for each service and how to achieve a zone-resilient configuration. 

Each Azure reliability service guide provides a section that describes how to enable zone resiliency for that service. This section helps you understand the effort required to make each service zone-resilient so that you can plan your strategy accordingly. For more information about a specific service, see [Azure reliability service guides](./overview-reliability-guidance.md).

Use the [zone configuration table](#azure-services-by-zone-configuration-approach) to quickly understand the approaches that you can use for common Azure services.

> [!IMPORTANT]
> If your workload includes any components that are deployed in a zonal (or single-zone) configuration, you must plan to make these components resilient to zone outages. Common approaches are to deploy separate instances into another availability zone, and switch between them if required.

### Step 3: Test for latency

When you make workloads zone-resilient, it's important to consider latency between availability zones. Occasionally, some legacy systems can't tolerate the small amount of extra latency that cross-zone traffic introduces, especially when synchronous replication is enabled within the data tier. If you suspect that cross-zone latency might affect your workload, make sure to perform testing both before and after you enable zone resiliency.

## Zone configuration approaches for Azure services

Each Azure service supports a specific type of availability zone support, which is based on the service's intended use and internal architecture. If you currently have a resource that isn't configured to use availability zones (or a *nonzonal* resource), you might want to reconfigure it with availability zone support. The reliability guide for that service provides guidance or links to availability zone configuration instructions.

This section provides a quick overview of the different types of zone configuration approaches and which approach each service supports.

> [!IMPORTANT]
> If you enable *zone redundancy*, the resource is automatically resilient to zone failures. But if you use a *zonal* configuration to pin the resource to a specific availability zone, you're responsible for making it resilient to a zone failure.

The following table describes each zone configuration approach, including the level of effort that's required for enabling availability zones. The table also indicates whether downtime is required during the enabling process.

The [zone configuration table](#azure-services-by-zone-configuration-approach) lists the supported zone configuration approach for many Azure services and contains a link to each reliability guide for that service. The reliability guide provides information about how to configure non-zonal service resources to enable availability zone support.

| Approach | Description | Typical level of effort | Might require downtime |
| --- | --- | --- | --- |
| Always zone-resilient | The service is already zone resilient by default in [regions that support availability zones](./regions-list.md). No action is required. | None | No |
| Enablement | Minimal configuration changes required, such as enabling zone redundancy in settings. There's no effect on availability during the process, but be aware of any effects on cost or performance. | Low | No |
| Modification | Likely requires some configuration changes, such as redeploying dependent resources or modifying network settings. | Medium | Yes |
| Redeployment | Significant changes required, such as redeploying entire resources, applications or services, or migrating data to new services. | High | Yes | 

> [!NOTE]
> The information in this article is a summary of the typical approach that you might use to enable availability zone support. However, there might be factors that affect how it works for your specific solution. For example, some services might be listed as *always zone-resilient*, but this designation only applies in specific regions or for specific tiers of the service. Use these tables as a starting point, but it's important to review the linked documents to understand the specific details.

### Azure services by zone configuration approach

This table summarizes the availability zone support for many Azure services and provides an approach that you can use to enable availability zone support for that service.

| Service | Can be zone redundant | Can be zonal | Typical zone configuration approach |
|-|-|-|-|
| [Azure AI Search](./reliability-ai-search.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone-resilient |
| [Azure API Management](./reliability-api-management.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Modification |
| [Azure App Configuration](migrate-app-configuration.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone-resilient |
| [Azure App Service](reliability-app-service.md#configure-availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement |
| [Azure App Service: App Service Environment](reliability-app-service-environment.md#configure-availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement |
| [Azure Application Gateway](./reliability-application-gateway-v2.md#configure-availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Always zone-resilient |
| [Azure Backup](migrate-recovery-services-vault.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment |
| [Azure Bastion](./reliability-bastion.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Redeployment |
| [Azure Batch](reliability-batch.md#availability-zone-migration) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment |
| [Azure Blob Storage](./reliability-storage-blob.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement |
| [Azure Cache for Redis - Enterprise](migrate-cache-redis.md#enabling-zone-redundancy-for-enterprise-and-enterprise-flash-tiers) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment |
| [Azure Cache for Redis - Standard and Premium](migrate-cache-redis.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement |
| [Azure Container Apps](reliability-azure-container-apps.md#availability-zone-migration) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment |
| [Azure Container Instances](./reliability-containers.md#availability-zone-redeployment-and-migration) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Redeployment |
| [Azure Container Registry](/azure/container-registry/zone-redundancy?toc=/azure/reliability) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone-resilient |
| [Azure Cosmos DB for NoSQL](./reliability-cosmos-db-nosql.md#migrate-to-availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Modification |
| [Azure Data Factory](./reliability-data-factory.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone-resilient |
| [Azure Data Lake Storage](reliability-storage-blob.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement |
| [Azure Database for MySQL - Flexible Server](migrate-database-mysql-flex.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment |
| [Azure Database for PostgreSQL - Flexible Server](./reliability-postgresql-flexible-server.md#availability-zone-redeployment-and-migration) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement |
| [Azure Disk Storage (managed disks)](migrate-vm.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Enablement |
| [Azure Elastic SAN](reliability-elastic-san.md#availability-zone-migration) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment |
| [Azure Event Hubs](./reliability-event-hubs.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone-resilient |
| [Azure ExpressRoute](/azure/expressroute/expressroute-howto-gateway-migration-portal) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Modification |
| [Azure Files](migrate-storage.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement |
| [Azure Firewall](./reliability-firewall.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Modification |
| [Azure Functions](reliability-functions.md#availability-zone-migration) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment |
| [Azure HDInsight](reliability-hdinsight.md#availability-zone-migration) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Redeployment |
| [Azure IoT Hub](./reliability-iot-hub.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone-resilient |
| [Azure Key Vault](./reliability-key-vault.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone-resilient |
| [Azure Kubernetes Service (AKS)](./reliability-aks.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment |
| [Azure Load Balancer](migrate-load-balancer.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Modification |
| [Azure Logic Apps - Consumption tier](./reliability-logic-apps.md?pivots=standard-workflow-service-plan#configure-availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone-resilient |
| [Azure Logic Apps - Standard tier](./reliability-logic-apps.md?pivots=consumption#configure-availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment |
| [Azure Monitor: Log Analytics](migrate-monitor-log-analytics.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone-resilient |
| [Azure NetApp Files](./reliability-netapp-files.md#availability-zone-support) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Redeployment |
| [Azure Queue Storage](./reliability-storage-queue.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement |
| [Azure Service Bus](/azure/service-bus-messaging/service-bus-outages-disasters#availability-zones) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone-resilient |
| [Azure Service Fabric](migrate-service-fabric.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Redeployment |
| [Azure Site Recovery](migrate-recovery-services-vault.md) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Redeployment |
| [Azure SQL Database: Hyperscale tier](/azure/azure-sql/database/enable-zone-redundancy?view=azuresql-db&preserve-view=true&toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Redeployment |
| [Azure SQL Database: other tiers](/azure/azure-sql/database/enable-zone-redundancy?view=azuresql-db&preserve-view=true&toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement |
| [Azure SQL Managed Instance](./reliability-sql-managed-instance.md#configure-availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement |
| [Azure Table Storage](./reliability-storage-table.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Enablement |
| [Azure Virtual Machine Scale Sets](migrate-vm.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Redeployment |
| [Azure Virtual Machines](migrate-vm.md) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Redeployment |
| [Azure Virtual Network](./reliability-virtual-network.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone-resilient |
| [Azure Virtual Network](./reliability-virtual-network.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | | Always zone-resilient |
| [Public IP address](/azure/virtual-network/ip-services/public-ip-addresses#availability-zone) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | Always zone-resilient |

## Next steps

- [Recommendations for using availability zones and regions](/azure/well-architected/reliability/regions-availability-zones)
- [Microsoft commitment to expand Azure availability zones to more regions](https://azure.microsoft.com/blog/our-commitment-to-expand-azure-availability-zones-to-more-regions/)

## Related resources

- [Azure reliability guides](overview-reliability-guidance.md)
- [Azure services that support availability zones](availability-zones-service-support.md)
- [List of Azure regions](regions-list.md)
