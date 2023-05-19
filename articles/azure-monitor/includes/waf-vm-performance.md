---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---

### Design checklist

> [!div class="checklist"]
> - Use dashboards in VM insights to inspect performance trends of your VMs.

### Configuration recommendations

| Recommendation | Description |
|:---|:---|
| Collect client performance data | The Azure Monitor agent allows you to collect performance data from the client operating system and workloads of your VMs. [Enable VM insights](../vm/vminsights-enable-overview.md) or [create a data collection to deploy](../agents/data-collection-rule-azure-monitor-agent.md) the agent and collect performance data from the client. |
