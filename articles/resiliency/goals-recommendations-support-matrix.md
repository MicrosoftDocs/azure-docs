---
title: Infrastructure Resiliency Manager support matrix for goals and recommendations
description: Learn about the supported scenarios, limitations, and Azure RBAC roles for goals and recommendations in Infrastructure Resiliency Manager.
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 11/11/2026
ms.topic: reference
ms.service: resiliency
#customer intent: As an IT admin, I want to learn which Azure RBAC roles are required for goals and recommendations, so that I can grant the right permissions to my team.
---

# Support Matrix for goals and recommendations in Infrastructure Resiliency Manager

This article summarizes the supported scenarios, limitations, and Azure role-based access control (RBAC) roles for goals and recommendations in the Infrastructure Resiliency Manager.

## Supported resource types and detected solutions

The following table lists the Azure-supported solutions recognized by the service for each resource type:

| Resource Type | Detected Zonal Resiliency Solution |
|---|---|
| App Service Environment | Azure App Service Environment Zone-redundancy |
| App Service Plan | Azure App Service Plan Zone-redundancy |
| Application Gateway | Azure App Gateway Zone-redundancy |
| Azure API Management | Azure API Management Zone-redundancy |
| Azure Cache for Redis | Azure Redis Cache Zone-redundancy |
| Azure Cognitive Services | Azure Cognitive Services Zone-redundancy |
| Azure Container Registry | Azure Container Registry Zone-redundancy |
| Azure Container Registry replication | Azure Container Registry Replications Zone-redundancy |
| Azure Cosmos DB | Azure Cosmos DB Zone-redundancy |
| Azure Data Explorer | Azure Data Explorer Zone-redundancy |
| Azure Firewall | Azure Firewall Zone-redundancy |
| Azure HDInsight cluster | Azure HDInsight Clusters Zone-redundancy |
| Azure Kubernetes Service | Azure Kubernetes Service Zone-redundancy |
| Azure Load Balancer | Azure Load Balancer Zone-redundancy |
| Azure Managed Grafana | Azure Managed Grafana Zone-redundancy |
| Azure PostgreSQL flexible server/elastic cluster | Azure PostgreSQL Zone-redundancy |
| Azure SQL Database | Azure SQL DB Zone-redundancy |
| Azure SQL elastic pool | Azure SQL Elastic Pools Zone-redundancy |
| Azure SQL Managed Instance | Azure SQL MI Zone-redundancy |
| Azure Web PubSub | Azure Web PubSub Zone-redundancy |
| Container Apps environment | Azure Managed Environments Zone-redundancy |
| Event Hubs cluster | Azure Event Hub Clusters Zone-redundancy |
| Event Hubs namespace | Azure Event Hub Namespaces Zone-redundancy |
| ExpressRoute Gateway | Zone-redundant ExpressRoute Gateway |
| Host group | Azure Host Groups Zone-redundancy |
| Managed Disk | Zone redundant storage for managed disk |
| MySQL Flexible Server | Azure MySQL Zone-redundant High Availability |
| NAT Gateway | Azure NAT Gateways Zone-redundancy |
| Public IP Address | Azure IP Address Standard SKU Zone-redundancy |
| Public IP Prefix | Azure Public IP Prefixes Zone-redundancy |
| Service Fabric cluster | Azure Service Fabric Clusters Zone-redundancy |
| Service Fabric managed cluster | Azure Service Fabric Managed Clusters Zone-redundancy |
| SQL virtual machine | Azure SQL Virtual Machines Zone-redundancy |
| Storage Account | Zone-redundant storage |
| Virtual Machine | VM in Multi-Zone VMSS |
| Virtual Machine | VM with cross-zone recovery |
| Virtual Machine | Zone-pinned VM with ZRS data disks |
| Virtual Machine Scale Set | Azure VMSS Zone-redundant deployment |

## Service group limits

A single service group can contain a maximum of **500 resources**.

## Excluded resource types

Certain resource types are excluded from resiliency service's discovery. When resources are added to a service group via subscription or resource group membership, the following categories of resource types are automatically filtered out:

- **Networking primitives** - such as:

  - Network interfaces (microsoft.network/networkinterfaces)
  - Network security groups (microsoft.network/networksecuritygroups)
  - Route tables (microsoft.network/routetables)
  - Private endpoints (microsoft.network/privateendpoints)
  - Private DNS zones (microsoft.network/privatednszones)

- **Identity and access** - such as managed identities (microsoft.managedidentity/userassignedidentities).

- **Monitoring and diagnostics** - such as:

  - Log Analytics workspaces (microsoft.operationalinsights/workspaces)
  - Action groups (microsoft.insights/actiongroups)
  - Metric alerts (microsoft.insights/metricalerts)
  - Activity log alerts

- **Automation and management** - such as:

  - Automation accounts (microsoft.automation/automationaccounts)
  - Maintenance configurations (microsoft.maintenance/maintenanceconfigurations)
  - Solutions (microsoft.operationsmanagement/solutions)

- **Security** - such as:

  - Security assessments (microsoft.security/assessments)
  - Policies
  - Microsoft Defender plans

- **Policy and governance** - such as:

  - Resource group-level policy assignments
  - Remediations

- **Storage subresources** - such as:

  - Blob services
  - File services
  - Queue services
  - Table services under storage accounts

  Only the top-level resource (for example, storage account) is considered to avoid duplicate counting.

- **Compute subresources** - such as:

  - VM extensions
  - Disk access permissions
  - Disk encryption sets

  Only the top-level resource (for example, VM) is considered to avoid duplicate counting.

- **Database subresources** - such as:

  - SQL firewall rules
  - Failover groups
  - Transparent data encryption settings
  - Cosmos DB subresources (sql databases, tables, Cassandra keyspaces)

  Only the top-level resource is considered to avoid duplicate counting.

- **Other infrastructure resources** - such as:

  - Virtual network gateways
  - Availability sets
  - SSH public keys
  - Proximity placement groups
  - Capacity reservation groups
  - Usage Plans

## RBAC requirements for Goals and Recommendations

| Scenario | Required Roles |
|----|----|
| Assign goals to service group | Service Group Contributor + Microsoft.Relationship/ServiceGroupMember/read on resources |
| View counts of resilient / nonresilient / not-evaluated resources | Service Group Reader |
| View resource list with zonal resiliency status | Service Group Reader + Reader on resources |
| Include / Exclude / Attest resources | Service Group Contributor |
| Rediscover resources | Service Group Contributor + Microsoft.Relationship/ServiceGroupMember/read on resources |
| View service group–level recommendations | Service Group Reader |
| View resource-level recommendations | Service Group Reader + Reader on resources |
| Postpone / Dismiss recommendations | Contributor on the target resources |

## RBAC requirements for service group management

| Scenario | Required Roles |
|----|----|
| Create service group and add/remove members | Microsoft.Relationship/ServiceGroupMember/write on resources + Service Group Contributor |

## Related content

- [About goals and recommendations in Infrastructure Resiliency Manager](goals-recommendations-about.md).
- [Assign goals and view resiliency posture in Infrastructure Resiliency Manager](goals-recommendations-assign-goals-view-posture.md).
- [Review recommendations in Infrastructure Resiliency Manager](goals-recommendations-review-recommendations.md).
- [Use the Resiliency agent (preview) in Infrastructure Resiliency Manager](goals-recommendations-use-agent.md).