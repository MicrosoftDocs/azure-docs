---
title: Migrate from VM guest health to Azure Monitor Log alerts
description: Describes how to migrate from VM insights guest health to Azure Monitor Log alerts.
ms.topic: conceptual
ms.date: 03/01/2022

---

# Migrate from VM guest health to Azure Monitor Log alerts
This article walks through migrating from the VM guest health (preview) to Azure Monitor Log alerts to configure alerts on key VM metrics and offboard VMs from VM guest health (preview). [VM guest health (preview)](vminsights-health-overview.md) will retire on 30 September 2023. If you are using this feature to configure alerts on VM metrics (Percentage CPU utilization, Available Memory, Free Disk space), make sure to transition to Azure Monitor Log alerts before this date. 

## Configure Azure Monitor Log alerts
See [Monitor virtual machines with Azure Monitor: Alerts](monitor-virtual-machine-alerts.md#log-alerts) for instructions on creating Azure Monitor log alerts. Alert rules for the key metrics used by VM health include the following:

- [CPU utilization](monitor-virtual-machine-alerts.md#log-alert-rules)
- [Available Memory](monitor-virtual-machine-alerts.md#log-alert-rules-1)
- [Disk free space](monitor-virtual-machine-alerts.md#log-query-alert-rules-1)

> [!IMPORTANT]
> Transitioning to Log alerts will result in charges according to Azure Monitor log alert rates. See [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) for details.

## Offboard VMs from VM guest health
Use the following steps to offboard the VMs from the VM guest health (preview) feature. The **Health** tab and the **Guest VM Health** status in VM insights will not be available after retirement.


### 1. Uninstall the VM extension for VM guest health
The VM Extension is called *GuestHealthWindowsAgent* for Windows VMs and *GuestHealthLinuxAgent* for Linux VMs. You can remove the extension from the **Extensions + applications** page for the virtual machine in the Azure portal, [Azure PowerShell](/powershell/module/az.compute/remove-azvmextension), or [Azure CLI](/cli/azure/vm/extension#az-vm-extension-delete).


### 2. Delete the Data Collection Rule Association created for VM guest health
Before you can remove the data collection rule for VM guest health, you need to remove its association with any VMs. If the VM was onboarded to VM guest health using the Azure portal, a default DCR with a name similar to *Microsoft-VMInsights-Health-xxxxx* will have been created. If you onboarded with another method, you may have given the DCR a different name.

From the **Monitor** menu in the Azure portal, select **Data Collection Rules**. Click on the DCR for VM guest health, and then select **Resources**. Select the VMs to remove and click **Delete**.

You can also remove the Data Collection Rule Association using [Azure PowerShell](../agents/data-collection-rule-azure-monitor-agent.md#manage-rules-and-association-using-powershell) or [Azure CLI](/cli/azure/monitor/data-collection/rule/association#az-monitor-data-collection-rule-association-delete). 


### 3. Delete Data Collection Rule created for VM guest health
To remove the data collection rule, click **Delete** from the DCR page in the Azure portal. You can also delete the Data Collection Rule using [Azure PowerShell](../agents/data-collection-rule-azure-monitor-agent.md#manage-rules-and-association-using-powershell) or [Azure CLI](/cli/azure/monitor/data-collection/rule#az-monitor-data-collection-rule-delete).


## Next steps

- [Read more about log query alerts for virtual machine](monitor-virtual-machine-alerts.md)
