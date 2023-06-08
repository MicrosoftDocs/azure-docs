---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 05/19/2023
---

### Design checklist

> [!div class="checklist"]
> - Create availability alert rules for individual Azure VMs.
> - Create agent heartbeat alert for sets of VMs.
> - Configure data collection and alerting for monitoring reliability of client workflows.

### Configuration recommendations

| Recommendation | Description |
|:---|:---|
| Create availability alert rules for Azure VMs. | Use the [availability metric](../vm/tutorial-monitor-vm-alert-availability.md) to track when a VM is running. While you can quickly enable an availability alert rule for an individual machine using [recommended alerts](../vm/tutorial-monitor-vm-alert-recommended.md), a single alert rule targeting a resource group or subscription enables availability alerting for all VMs in that scope for a particular region. This is easier to manage than creating an alert rule for each VM and ensures that any new VMs created in the scope are automatically monitored. |
| Create agent heartbeat alert rule to verify agent health. | The Azure Monitor agent sends a heartbeat to the Log Analytics workspace every minute. Use a log query alert rule [using the agent heartbeat](../vm/monitor-virtual-machine-alerts.md#agent-heartbeat) to be alerted when an agent stops sending heartbeats, which is an indicator that the agent is unhealthy and the VM isn't being monitored. |
to use a single rule for all your VMs. This includes hybrid machines don't have the [availability metric](../vm/tutorial-monitor-vm-alert-availability.md). This alert rule does require that the Azure Monitor agent is installed on the VM. |
| Configure data collection and alerting for monitoring reliability of client workflows. | Use the information at Monitor virtual machines with [Monitor virtual machines with Azure Monitor: Collect data](../vm/monitor-virtual-machine-data-collection.md) to configure client event collection indicating potential issues with your client workloads. Use the information at Monitor virtual machines with [Monitor virtual machines with Azure Monitor: Alerts](../vm/monitor-virtual-machine-alerts.md) to create alert rules to be proactively notified of any potential operational issues with your client workloads. |
