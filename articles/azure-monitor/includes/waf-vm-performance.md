---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---

### Design checklist

> [!div class="checklist"]
> - Configure data collection for monitoring performance of client workflows.
> - Create alert rules to be proactively notified of potential performance issues with client workflows.
> - If you have an existing SCOM environment, migrate client workloads to Azure Monitor.

### Configuration recommendations

| Recommendation | Description |
|:---|:---|
| Configure data collection for monitoring performance of client workflows. | Use the information at Monitor virtual machines with [Monitor virtual machines with Azure Monitor: Collect data](../vm/monitor-virtual-machine-data-collection.md) to configure client data collection measuring performance of your client workloads. |
| Create alert rules to be proactively notified of potential performance issues with client workflows. | Use the information at Monitor virtual machines with [Monitor virtual machines with Azure Monitor: Alerts](../vm/monitor-virtual-machine-alerts.md) to create alert rules to be proactively notified of any potential performance issues with your client workloads. |
| Migrate SCOM client workloads to Azure Monitor. | If you have an existing SCOM environment for monitoring client workloads on your Azure or hybrid VMs, migrate as much management pack logic as you can to Azure Monitor using guidance at [Migrate from System Center Operations Manager (SCOM) to Azure Monitor](../vm/monitor-virtual-machine-management-packs.md#migrate-management-pack-logic-for-vm-workloads). |