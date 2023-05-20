---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 05/19/2023
---

### Design checklist

> [!div class="checklist"]
> - Create availability alert rules for Azure VMs. 
> - Create agent heartbeat alert for hybrid VMs.
> - Configure data collection for monitoring reliability of client workflows.
> - Create alert rules to be proactively notified of potential reliability issues with client workflows.
> - If you have an existing SCOM environment, migrate client workloads to Azure Monitor.

### Configuration recommendations

| Recommendation | Description |
|:---|:---|
| Create availability alert rules for Azure VMs. | For Azure VMs, create an alert rule using the [availability metric](../vm/tutorial-monitor-vm-alert-availability.md) to be notified when the VM is stopped. The easiest way to create this rule for a single machine is using [recommended alerts](../vm/tutorial-monitor-vm-alert-recommended.md), but this will require a separate rule for each VM. [Create alert rules at the resource group or subscription level](../vm/monitor-virtual-machine-alerts.md#scaling-alert-rules) to use a single rule for a set of existing and future VMs.|
| Create agent heartbeat alert for hybrid VMs. | Hybrid machines don't have the [availability metric](../vm/tutorial-monitor-vm-alert-availability.md). For these machines, create an [alert rule using the agent heartbeat](../vm/monitor-virtual-machine-alerts.md#machine-unavailable). |
| Configure data collection for monitoring reliability of client workflows. | Use the information at Monitor virtual machines with [Monitor virtual machines with Azure Monitor: Collect data](../vm/monitor-virtual-machine-data-collection.md) to configure client event collection indicating potential issues with your client workloads. |
| Create alert rules to be proactively notified of potential reliability issues with client workflows. | Use the information at Monitor virtual machines with [Monitor virtual machines with Azure Monitor: Alerts](../vm/monitor-virtual-machine-alerts.md) to create alert rules to be proactively notified of any potential operational issues with your client workloads. |
| Migrate SCOM client workloads to Azure Monitor. | If you have an existing SCOM environment for monitoring client workloads on your Azure or hybrid VMs, migrate as much management pack logic as you can to Azure Monitor using guidance at [Migrate from System Center Operations Manager (SCOM) to Azure Monitor](../vm/monitor-virtual-machine-management-packs.md#migrate-management-pack-logic-for-vm-workloads). |