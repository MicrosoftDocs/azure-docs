---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 08/24/2023
---

### Design checklist

> [!div class="checklist"]
> - Design a workspace architecture with the minimal number of workspaces to meet your business requirements.
> - Use Infrastructure as Code (IaC) when managing multiple workspaces.
> - Use Log Analytics workspace insights to track the health and performance of your Log Analytics workspaces.
> - Create alert rules to be proactively notified of operational issues in the workspace.
> - Ensure that you have a well-defined operational process for data segregation.

### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| Design a workspace strategy to meet your business requirements. | See [Design a Log Analytics workspace architecture](../logs/workspace-design.md) for guidance on designing a strategy for your Log Analytics workspaces including how many to create and where to place them.<br><br>A single or at least minimal number of workspaces will maximize your operational efficiency since it limits the distribution of your operational and security data, increasing your visibility into potential issues, making patterns easier to identify, and minimizing your maintenance requirements.<br><br>You might have requirements for multiple workspaces such as multiple tenants, or you might need workspaces in multiple regions to support your availability requirements. In these cases, ensure that you have appropriate processes in place to manage this increased complexity. |
| Use Infrastructure as Code (IaC) when managing multiple workspaces. | Use Infrastructure as Code (IaC) to define the details of your workspaces in [ARM](../logs/resource-manager-workspace.md), [BICEP](../logs/resource-manager-workspace.md), or [Terraform](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/log_analytics_workspace.html). This allows you to you leverage your existing DevOps processes to deploy new workspaces and [Azure Policy](../../governance/policy/overview.md) to enforce their configuration. |
| Use Log Analytics workspace insights to track the health and performance of your Log Analytics workspaces.  | [Log Analytics workspace insights](../logs/workspace-design.md) provides a unified view of the usage, performance, health, agents, queries, and change log for all your workspaces. Review this information on a regular basis to track the health and operation of each of your workspaces. |
| Create alert rules to be proactively notified of operational issues in the workspace. | Each workspace has an [operation table](../logs/monitor-workspace.md) that logs important activities affecting workspace. Create alert rules based on this table to be proactively notified when an operational issue occurs. You can use [recommended alerts for the workspace](../logs/log-analytics-workspace-health.md) to simplify the creation of the most critical alert rules. |
| Ensure that you have a well-defined operational process for data segregation. | You may have different requirements for different types of data stored in your workspace. Make sure that you clearly understand such requirements as data retention and security when [designing your workspace strategy](../logs/workspace-design.md) and configuring settings such as [permissions](../roles-permissions-security.md) and [archiving](../logs/data-retention-archive.md). You should also have a clearly defined process for occasionally [purging](../logs/personal-data-mgmt.md#exporting-and-deleting-personal-data) data with personal information that's accidentally collected. |

