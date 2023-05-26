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
| Create availability alert rules for individual Azure VMs. | For individual Azure VMs, you can create an alert rule using the [availability metric](../vm/tutorial-monitor-vm-alert-availability.md) to be notified when the VM is stopped. The easiest way to create this rule for a single machine is using [recommended alerts](../vm/tutorial-monitor-vm-alert-recommended.md). This does require a separate rule for each VM since this metric is currently io public preview and does not yet support [multiple resource alert rules](../alerts/alerts-types.md#monitor-multiple-resources). This alert rule does not require that the Azure Monitor agent is installed on the VM. |
| Create agent heartbeat alert for sets of VMs. | Use a log query alert rule [using the agent heartbeat](../vm/monitor-virtual-machine-alerts.md#agent-heartbeat) to use a single rule for all your VMs. This includes hybrid machines don't have the [availability metric](../vm/tutorial-monitor-vm-alert-availability.md). This alert rule does require that the Azure Monitor agent is installed on the VM. |
| Configure data collection and alerting for monitoring reliability of client workflows. | Use the information at Monitor virtual machines with [Monitor virtual machines with Azure Monitor: Collect data](../vm/monitor-virtual-machine-data-collection.md) to configure client event collection indicating potential issues with your client workloads. Use the information at Monitor virtual machines with [Monitor virtual machines with Azure Monitor: Alerts](../vm/monitor-virtual-machine-alerts.md) to create alert rules to be proactively notified of any potential operational issues with your client workloads. |
