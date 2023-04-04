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

| Recommendation | Description |
|:---|:---|
| Design workspace strategy | See [Design a Log Analytics workspace architecture](../logs/workspace-design.md) to design a workspace strategy to optimize functionality for your particular business requirements. A single or at least minimal number of workspaces will maximize your operational efficiency since all of your operational and security data will be located in a single location increasing your visibility into potential issues and making patterns easier to identify. While you may have requirements to increase your number of workspaces such as regional and security, the minimal number of workspaces will maximize your operational efficiency. |
| Use Log Analytics workspace insights to track the health and performance of your Log Analytics workspaces.  | [Log Analytics workspace insights](../logs/workspace-design.md) |
| Create alert rules for operational issues in the workspace | Each workspace has an [operations]() |


