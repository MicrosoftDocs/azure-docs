---
title: Migrate from VM insights guest health (preview) to Azure Monitor log alerts
description: Describes how to migrate from VM insights guest health to Azure Monitor log alerts.
ms.topic: conceptual
ms.date: 03/01/2022

---

# Migrate from VM insights guest health to Azure Monitor log alerts
This article walks through migrating from the VM insights guest health (preview) to Azure Monitor log alerts to configure alerts on key VM metrics and offboard VMs from VM insights guest health (preview). [VM insights guest health (preview)](vminsights-health-overview.md) will retire on 30 November 2022. If you are using this feature to configure alerts on VM metrics (CPU utilization, Available memory, Free disk space), make sure to transition to Azure Monitor log alerts before this date. 

## Configure Azure Monitor log alerts
Before you remove VM insights guest health, you should create alert rules to replace its alerting functionality. See [Monitor virtual machines with Azure Monitor: Alerts](monitor-virtual-machine-alerts.md#log-alerts) for instructions on creating Azure Monitor log alerts. 

> [!IMPORTANT]
> Transitioning to log alerts will result in charges according to Azure Monitor log alert rates. See [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) for details.


Alert rules for the key metrics used by VM health include the following:

- [CPU utilization](monitor-virtual-machine-alerts.md#log-alert-rules)
- [Available memory](monitor-virtual-machine-alerts.md#log-alert-rules-1)
- [Free disk space](monitor-virtual-machine-alerts.md#log-query-alert-rules-1)

To create a an alert rule for a single VM that alerts on any of the three conditions, create a [log alert rule](monitor-virtual-machine-alerts.md#log-alerts) with the following details.


| Setting | Value |
|:---|:---|
| **Scope** | |
| Target scope | Select your virtual machine. |
| **Condition** | |
| Signal type | Log |
| Signal name | Custom log search |
| Query | \<Use the query below\> |
| Measurement | Measure: *Table rows*<br>Aggregation type: Count<br>Aggregation granularity: 15 minutes |
| Alert Logic | Operator: Greater than<br>Threshold value: 0<br>Frequency of evaluation: 15 minutes |
| Actions | Select or add an [action group](../alerts/action-groups.md) to notify you when the threshold is exceeded. |
| **Details** | |
| Severity| Warning |
| Alert rule name | Daily data limit reached |

Replace the values in the following query if you want to set different thresholds.

```kusto
InsightsMetrics
| where TimeGenerated >= ago(15m)
| where Origin == "vm.azm.ms"
| where Namespace == "Processor" and Name == "UtilizationPercentage"
| summarize UtilizationPercentage = avg(Val) by Computer, _ResourceId
| where UtilizationPercentage >= 90
| union (
InsightsMetrics
| where TimeGenerated >= ago(15m)
| where Origin == "vm.azm.ms"
| where Namespace == "Memory" and Name == "AvailableMB"
| summarize AvailableMB = avg(Val) by Computer, _ResourceId
| where AvailableMB <= 100)
| union (
InsightsMetrics
| where Origin == "vm.azm.ms"
| where TimeGenerated >= ago(15m)
| where Namespace == "LogicalDisk" and Name == "FreeSpacePercentage"
| summarize FreeSpacePercentage = avg(Val) by Computer, _ResourceId
| where FreeSpacePercentage <= 10)
| summarize UtilizationPercentage = max(UtilizationPercentage), AvailableMB = max(AvailableMB), FreeSpacePercentage = max(FreeSpacePercentage)  by Computer, _ResourceId
```

## Offboard VMs from VM insights guest health
Use the following steps to offboard the VMs from the VM insights guest health (preview) feature. The **Health** tab and the **Guest VM Health** status in VM insights will not be available after retirement.


### 1. Uninstall the VM extension for VM insights guest health
The VM Extension is called *GuestHealthWindowsAgent* for Windows VMs and *GuestHealthLinuxAgent* for Linux VMs. You can remove the extension from the **Extensions + applications** page for the virtual machine in the Azure portal, [Azure PowerShell](/powershell/module/az.compute/remove-azvmextension), or [Azure CLI](/cli/azure/vm/extension#az-vm-extension-delete).


### 2. Delete the Data Collection Rule Association created for VM insights guest health
Before you can remove the data collection rule for VM insights guest health, you need to remove its association with any VMs. If the VM was onboarded to VM insights guest health using the Azure portal, a default DCR with a name similar to *Microsoft-VMInsights-Health-xxxxx* will have been created. If you onboarded with another method, you may have given the DCR a different name.

From the **Monitor** menu in the Azure portal, select **Data Collection Rules**. Click on the DCR for VM insights guest health, and then select **Resources**. Select the VMs to remove and click **Delete**.

You can also remove the Data Collection Rule Association using [Azure PowerShell](../agents/data-collection-rule-azure-monitor-agent.md#create-data-collection-rule-and-association) or [Azure CLI](/cli/azure/monitor/data-collection/rule/association#az-monitor-data-collection-rule-association-delete). 


### 3. Delete Data Collection Rule created for VM insights guest health
To remove the data collection rule, click **Delete** from the DCR page in the Azure portal. You can also delete the Data Collection Rule using [Azure PowerShell](../agents/data-collection-rule-azure-monitor-agent.md#create-data-collection-rule-and-association) or [Azure CLI](/cli/azure/monitor/data-collection/rule#az-monitor-data-collection-rule-delete).


## Next steps

- [Read more about log query alerts for virtual machine](monitor-virtual-machine-alerts.md)
