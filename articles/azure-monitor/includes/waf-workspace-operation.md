---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---

### Design checklist

> [!div class="checklist"]
> - Design workspace strategy

### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| Design a [workspace configuration](../logs/workspace-design.md) with the minimal number of workspaces to meet your business requirements. | A single or at least minimal number of workspaces will maximize your operational efficiency since all of your operational and security data will be located in a single location increasing your visibility into potential issues and making patterns easier to identify. You minimize your requirement for [cross-workspace queries](../logs/cross-workspace-query.md) and need to manage the configuration and data for fewer workspaces.<br><br>You may have requirements for multiple workspaces, such as multiple tenants or regulatory compliance requiring multiple regions, but you should balance those requirements against a goal of creating the minimal number of workspaces. |
| Use Log Analytics workspace insights to track the health and performance of your Log Analytics workspaces.  | [Log Analytics workspace insights](../logs/workspace-design.md) provides a unified view of the usage, performance, health, agents, queries, and change log for all your workspaces. Review this information on a regular basis to track the health and operation of each of your workspaces. |
| Create alert rules to be proactively notified of operational issues in the workspace. | Each workspace has an [operation table](../logs/monitor-workspace.md) that logs important activities affecting workspace. Create alert rules based on this table to be proactively notified when an operational issue occurs. You can use [recommended alerts for the workspace](../logs/log-analytics-workspace-health.md) to simplify the creation of the most critical alert rules. |
| Use [functions](../logs/functions.md#create-a-function) for log queries commonly used by your organization. | Functions can be leveraged by multiple users and can be copied between workspaces saving your users from duplicating effort. |


