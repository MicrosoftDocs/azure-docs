---
title: Support matrix for Azure Recovery Orchestration Plan
description: Learn about the supported resource types, protection solutions, supported scope, role requirements, and managed identity requirements for Azure Recovery Orchestration Plan in Resiliency in Azure (preview).
ms.topic: overview
ms.service: resiliency
ms.date: 06/02/2026
author: AbhishekMallick-MS
ms.author: v-mallicka
#customer intent: As an IT admin, I want to learn about the supported resource types, protection solutions, supported scope, role requirements, and managed identity requirements for Azure Recovery Orchestration Plan in Resiliency in Azure (preview), so that I can effectively utilize the service for my disaster recovery needs.
---

# Support matrix for Azure Recovery Orchestration Plan (preview)

This article summarizes the supported resource types, protection solutions, supported scope, role requirements, and managed identity requirements for Azure Recovery Orchestration Plan in Resiliency in Azure (preview).

## Supported protection solutions

The following table lists the supported protection solutions and their failover behavior:

| **Protection solution**  | **Description**  | **Failover behavior**  |
|----|----|----|
| Azure Site Recovery  | Replicates VMs and Virtual Machine Scale Sets across availability zones within a region.  | Active failover orchestrated by the Recovery Plan. Resources must be manually included and require cache storage account parameter.  |
| Highly Available (HA) solutions  | Zone-redundant configurations for PaaS services such as SQL database, Cosmos DB, Storage Accounts, and others.  | Automatic failover handled by the service. Resources are automatically excluded from the Recovery Plan.  |

>[!NOTE]
>A recovery plan doesn't orchestrate failover for resources configured with a Highly Available (HA) solution because the resource performs self-managed failover.

## Supported resource types

The following table lists the supported Azure resource types in the Recovery Orchestration Plan:

| **Azure resource type**  | **Protection solution**  | **Failover type**  |
|----|----|----|
| Azure Virtual Machine (VM)  | Azure Site Recovery  | Active failover  |
| Azure Virtual Machine Scale Sets  | Azure Site Recovery  | Active failover  |
| Azure SQL Database  | Zone-redundant configuration (HA)  | Automatic (HA)  |
| Azure SQL Managed Instance  | Zone-redundant configuration (HA)  | Automatic (HA)  |
| Azure Cosmos DB  | Zone-redundant configuration (HA)  | Automatic (HA)  |
| Azure Database for PostgreSQL - Flexible Server  | Zone-redundant configuration (HA)  | Automatic (HA)  |
| Azure Service Bus  | Zone-redundant configuration (HA)  | Automatic (HA)  |
| Azure Container Registry  | Zone-redundant configuration (HA)  | Automatic (HA)  |
| Azure Kubernetes Service (AKS)  | Zone-redundant configuration (HA)  | Automatic (HA)  |
| Azure Storage Account  | Zone-redundant storage (ZRS/GZRS) (HA)  | Automatic (HA)  |
| Azure Load Balancer  | Zone-redundant configuration (HA)  | Automatic (HA)  |
| Azure Application Gateway  | Zone-redundant configuration (HA)  | Automatic (HA)  |
| Azure Public IP Address  | Zone-redundant configuration (HA)  | Automatic (HA)  |
| Azure Firewall  | Zone-redundant configuration (HA)  | Automatic (HA)  |
| Azure App Services  | Zone-redundant configuration (HA)  | Automatic (HA)  |
| Azure ExpressRoute  | Zone-redundant configuration (HA)  | Automatic (HA)  |
| Azure Cache for Redis  | Zone-redundant configuration (HA)  | Automatic (HA)  |
| Azure Database for MySQL  | Zone-redundant configuration (HA)  | Automatic (HA)  |

>[!NOTE]
>Resources protected by HA solutions are automatically excluded from the Recovery Plan and don’t require active failover orchestration. The resources handle zone-level failures automatically.

## Role requirements

The following table lists the various roles required for Azure Recovery Orchestration plan:

| **Role**  | **Description**  |
|----|----|
| Azure Resilience Management Recovery Contributor  | Allows creating and managing Recovery Plans within Service Groups.  |
| Azure Resilience Management Recovery Administrator  | Full administrative access to Recovery Plans within Service Groups.  |

## Managed identity requirements

The following table lists the role and permission requirements for managed identities:

| **Managed identity** | **Description** | **Role requirement** | **Permission requirement** |
|---|---|---|---|
| System-assigned and User-assigned | can be configured during plan creation. | Requires the **Automation Job Operator** role on the managed identity to run Azure Automation Runbook scripts. | Requires permissions to add failed-over resources back to the Service Group and Recovery Plan after failover. |

## Supported scope

The following table lists the supported scope for Azure Recovery Orchestration plan:

| **Scope**          | **Supported**                    |
|--------------------|----------------------------------|
| Zonal recovery     | Yes                              |
| Regional recovery  | No (not supported at this time)  |

## Related content

- [About Azure Recovery Orchestration Plan (preview)](recovery-orchestration-plan-about.md).
- [Create and configure a Recovery Orchestration Plan (preview)](recovery-orchestration-plan-create-configure.md).
- [Execute failover and reprotect operations (preview)](recovery-orchestration-plan-execute.md).
