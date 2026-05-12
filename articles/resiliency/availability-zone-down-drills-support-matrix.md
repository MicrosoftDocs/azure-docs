---
title: Availability zone down drills support matrix for Infrastructure Resiliency Manager
description: Provides a summary regional availability, supported scenarios, and limitations for availability zone down drills in Infrastructure Resiliency Manager.
ms.topic: reference
ms.date: 06/02/2026
ms.service: resiliency
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As an IT administrator, I want to understand the support settings and limitations for Availability Zone Down Drills in Infrastructure Resiliency Manager, so that I can effectively plan and execute drills to assess the resiliency of my applications across availability zones.

---

# Support matrix for Availability Zone Down Drills in Infrastructure Resiliency Manager (preview)

This article summarizes the regional availability, supported scenarios, and limitations for Availability Zone Down Drill in Infrastructure Resiliency Manager (preview).

## Supported regions

Availability Zone Down Drills in Resiliency support all Azure regions that have availability zones, except Sovereign Clouds. 

## Supported resource types and native faults

The following table lists the resource types that support native Zone Down faults:

| **Resource type**  | **Fault behavior** |
| --- | --- |
| Virtual Machines  | Shuts down the virtual machine. |
| Virtual Machine Scale Sets  | Shuts down all Virtual Machines in the scale set within a single zone. |
| Azure Kubernetes Service  | Shuts down node pools in a single zone.  |
| Azure Database for PostgreSQL flexible servers | Triggers a forced failover to switch the server's active zone. |
| Azure Database for MySQL flexible servers | Triggers a forced failover to switch the server's active zone. |
| Azure SQL Database | Triggers a forced failover to switch the server's active zone. |
| Azure Load Balancer | Disables readiness probes in the selected zone by using admin override. |
| Azure Cache for Redis | Restarts the primary node of the cache. |
| App Service | Stops App Service instances in a single zone. |

The preview release supports Service Groups containing up to 500 resources.

> [!Tip]
> For unsupported resource types, use custom scripts powered by Azure Runbooks to define fault logic.

## Required roles and permissions

The following table lists the minimum roles required for drill operations: 


| **Scope** | **Role** | **Purpose** |
| --- | --- | --- |
| Service Group | SG Drill Contributor | Create, update, and execute drills. |
| Service Group | Recovery Plan Contributor | Create and execute Recovery Plans. |
| Subscription (Chaos Workspace) | Drill Assets Contributor | Manage the subscription associated with Automation account and Chaos Workspace. |
| Individual resources | Drill Resource Fault Contributor | Manage the target resources for fault injection. |
| Subscription (Monitoring) | Log Analytics Contributor + Monitoring Contributor + User Access Administrator | Create monitoring infrastructure (Log Analytics workspace, DCE, DCR) and assign roles. |

## Applicable resource providers

Register the following resource providers in the relevant subscriptions:

- `Microsoft.Chaos`: Required in the subscription where you create the Chaos Workspace.
- `Microsoft.Insights`: Required in the subscription where you create the monitoring setup.
- `Microsoft.OperationalInsights`: Required in the subscription where you create the monitoring setup.
- `Microsoft.Automation`: Required for creation of Automation Accounts for fault injection.


## Next steps

