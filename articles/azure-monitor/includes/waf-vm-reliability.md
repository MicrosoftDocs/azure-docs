---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---

### Design checklist

> [!div class="checklist"]
> - 

### Configuration recommendations

| Recommendation | Description |
|:---|:---|
| Create availability alert rules for your VMs. | For Azure VMs, create an alert rule using the [availability metric](../vm/tutorial-monitor-vm-alert-availability.md) to be notified when the VM is stopped. The easiest way to create this rule for a single machine is using [recommended alerts](../vm/tutorial-monitor-vm-alert-recommended.md), but this will require a separate rule for each VM. [Create alert rules at the resource group or subscription level](../vm/monitor-virtual-machine-alerts.md#scaling-alert-rules) to use a single rule for a set of existing and future VMs. For hybrid machines and also to be alerted when the agent is unavailable, create an alert rule using the [agent heartbeat](../vm/monitor-virtual-machine-alerts.md#machine-unavailable). |
