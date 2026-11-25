---
title: Availability zone down drills support matrix for Infrastructure Resiliency Manager
description: Provides a summary regional availability, supported scenarios, and limitations for availability zone down drills in Infrastructure Resiliency Manager.
ms.topic: reference
ms.date: 11/10/2026
ms.service: resiliency
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As an IT administrator, I want to understand the support settings and limitations for Availability Zone Down Drills in Infrastructure Resiliency Manager, so that I can effectively plan and execute drills to assess the resiliency of my applications across availability zones.

---

# Support matrix for Availability Zone Down Drills in Infrastructure Resiliency Manager

This article summarizes the regional availability, supported scenarios, and limitations for Availability Zone Down Drill in Infrastructure Resiliency Manager.

Availability Zone Down Drills are a paid advanced capability and require the service group to be [enrolled in a usage plan](infrastructure-resiliency-manager-pricing.md#enroll-a-service-group-in-a-usage-plan). The usage plan identifies the Azure subscription to charge for the service group's usage. Usage plans don't have tiers. For charge eligibility and hourly proration, see [Billing and pricing](infrastructure-resiliency-manager-pricing.md#when-a-service-group-is-billed).

## Supported regions

Availability Zone Down Drills in Resiliency support all Azure regions that have availability zones, except Sovereign Clouds. 

Availability Zone Down faults supported in Resiliency are powered by Azure Chaos Studio. Hence Chaos Studio Workspace resource that is created as part of Resiliency Drill creation workflow will be in one of the [regions supported by Azure Chaos Studio workspaces](/azure/chaos-studio/chaos-studio-region-availability#regional-availability-of-chaos-studio-workspaces). 

 >[!NOTE]
 > Irrespective of the region in which the Chaos Studio Workspace is created, fault injections can be done against resources in any Azure region. 

## Supported resource types and native faults

The following table lists the resource types that support native Zone Down faults:

| **Resource type**  | **Fault behavior** |
| --- | --- |
| Virtual Machines  | Shuts down the virtual machine. |
| Virtual Machine Scale Sets  | Shuts down all Virtual Machines in the scale set within a single zone. |
| Azure Kubernetes Service  | Shuts down node pools in a single zone.  |
| Azure Database for PostgreSQL flexible servers | Triggers forced failover to switch the server's active zone. |
| Azure Database for MySQL flexible servers | Triggers forced failover to switch the server's active zone. |
| Azure SQL Database | Triggers forced failover to switch the server's active zone. |
| Azure SQL Managed Instance | Triggers forced failover to switch the active zone. |
| Azure Load Balancer | Disables readiness probes in the selected zone by using admin override. |
| Azure Cache for Redis | Restarts the primary node of the cache. |
| App Service | Stops App Service instances in a single zone. |
| Network Security Group (NSG) | Apply NSG rule to simulate outage for any Azure service. Examples are outages of Application Gateway, Public IP Address, Firewall, NAT Gateway, API Management, Key Vault, HDInsight Clusters, Bastion Hosts, Service Fabric Clusters etc. |

Resiliency Manager Drills supports Service Groups containing up to 500 resources.

> [!Tip]
> For unsupported resource types, use custom scripts powered by Azure Runbooks to define fault logic.

## Required roles and permissions

The following table lists the minimum roles required for drill operations: 


| **Scope** | **Role** | **Purpose** |
| --- | --- | --- |
| Service Group | Azure Resilience Management Drills Administrator | Create, update, and execute drills. |
| Service Group | Recovery Plan Contributor | Create and execute Recovery Plans. |
| Subscription (Chaos Workspace) | Azure Resilience Management Drills Assets Administrator | Manage the subscription associated with Chaos Workspace and Azure Automation account. |
| Individual resources | Reader | View the target resources in the Service Group for fault injection. |
| Subscription (Monitoring) | Log Analytics Contributor + Monitoring Contributor + User Access Administrator | Create monitoring infrastructure (Log Analytics workspace, DCE, DCR) and assign roles. |

## Applicable resource providers

Register the following resource providers in the relevant subscriptions:

- **`Microsoft.Chaos`**: Required in the subscription where you create the Chaos Workspace (an [Azure Chaos Studio Workspace](/azure/chaos-studio/chaos-studio-workspaces-overview)).
- **`Microsoft.Insights`**: Required in the subscription where you create the monitoring setup.
- **`Microsoft.OperationalInsights`**: Required in the subscription where you create the monitoring setup.
- **`Microsoft.Automation`**: Required for creation of Automation Accounts for fault injection.


## Next steps

- [Define Availability Zone Down Drill in Infrastructure Resiliency Manager](availability-zone-down-drill-define.md).
- [Execute Availability Zone Down Drill in Infrastructure Resiliency Manager](availability-zone-down-drill-execute.md).