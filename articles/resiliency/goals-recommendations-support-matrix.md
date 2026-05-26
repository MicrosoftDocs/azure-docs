---
title: Infrastructure Resiliency Manager support matrix for goals and recommendations
description: Learn about the supported scenarios, limitations, and Azure RBAC roles for goals and recommendations in Infrastructure Resiliency Manager (preview).
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 06/02/2026
ms.topic: reference
ms.service: resiliency
#customer intent: As an IT admin, I want to learn which Azure RBAC roles are required for goals and recommendations, so that I can grant the right permissions to my team.
---

# Support Matrix for goals and recommendations in Infrastructure Resiliency Manager (preview)

This article summarizes the supported scenarios, limitations, and Azure role-based access control (RBAC) roles for goals and recommendations in the Infrastructure Resiliency Manager (preview).

## Supported resource types and detected solutions

The following table lists the Azure-supported solutions recognized by the service for each resource type:

| Resource Type | Detected Zonal Resiliency Solution |
|---|---|
| Azure VM | - Azure Site Recovery with zonal disaster recovery<br> - Zone-pinned VM attached to a Zone-redundant storage (ZRS) disk <br> - Zone-pinned VM attached to multi-zone Virtual Machine Scale Sets <br> - Manual attestation |
| Azure SQL Database | Azure SQL Database zone-redundant deployment |
| Azure SQL Managed Instance | Azure SQL Managed Instance zone-redundant deployment |
| Azure Cosmos DB | Azure Cosmos DB zone-redundant account configuration |
| Azure Database for PostgreSQL – Flexible Server | Azure Database for PostgreSQL high availability with zone redundancy |
| Azure Storage Account | ZRS / Geo-zone-redundant storage (GZRS) / RA-GZRS |
| Azure Disk | Zone-redundant managed disk |
| Azure Service Bus | Premium tier zone-redundant namespace |
| Azure Kubernetes Service (AKS) | Zone-redundant node pools |
| Azure Container Registry | Zone-redundant replication |
| Azure Load Balancer | Standard SKU zone-redundant frontend |
| Azure Application Gateway | Zone-redundant deployment |
| Azure Firewall | Zone-redundant deployment |
| Azure Public IP Address | Standard SKU zone-redundant |
| Azure Database for MySQL – Flexible Server | HA with zone redundancy |
| Azure Cache for Redis | Zone-redundant deployment |
| ExpressRoute Gateway | ErGw1AZ / ErGw2AZ / ErGw3AZ |
| Azure Virtual Machine Scale Sets | Multi-zone deployment |
| Azure App Service Plan | Zone-redundant |
| Azure App Service Environment | Zone-redundant |

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
  - Naintenance configurations (microsoft.maintenance/maintenanceconfigurations)
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

  - Key vaults (evaluated separately)
  - Virtual network gateways
  - Availability sets
  - SSH public keys
  - Proximity placement groups
  - Capacity reservation groups

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

- [About goals and recommendations in Infrastructure Resiliency Manager (preview)](goals-recommendations-about.md).
- [Assign goals and view resiliency posture in Infrastructure Resiliency Manager (preview)](goals-recommendations-assign-goals-view-posture.md).
- [Review recommendations in Infrastructure Resiliency Manager (preview)](goals-recommendations-review-recommendations.md).
- [Use the Resiliency agent in Infrastructure Resiliency Manager (preview)](goals-recommendations-use-agent.md).