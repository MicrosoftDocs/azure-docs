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
| Migrate from legacy agents to Azure Monitor agent. | The Azure Monitor agent is simpler to manage than the legacy Log Analytics agent and allows more flexibility in your [Log Analytics workspace design](). Both the Windows and Linux agents allow multihoming, which means they can connect to multiple workspaces. Data collection rules allow you to manage your data collection settings at scale and define unique, scoped configurations for subsets of machines. See [Migrate to Azure Monitor Agent from Log Analytics agent](../agents/azure-monitor-agent-migration.md) for considerations and migration methods. | 
| Consider whether to use VM insights | VM insights isn't required to monitor your VMs in the Azure Monitor. Your choice to use it depends on your particular requirements. If you don't use VM insights features, then you can save cost by not enabling it. See [Should you use VM insights?](../vm/vminsights-overview.md#who-should-use-vm-insights) for a listing of unique VM insights features. |
| Use Azure Policy to deploy agents and assign data collection rules. | [Azure Policy](../../governance/policy/overview.md) allows you to have agents automatically deployed to sets of existing VMs and any new VMs that are created. This ensures that all VMs are monitored with minimal intervention by administrators. If you use VM insights, see [Enable VM insights by using Azure Policy](../vm/vminsights-enable-policy.md). If you want to manage Azure Monitor agent without VM insights, see [Enable Azure Monitor Agent by using Azure Policy](../agents/azure-monitor-agent-manage.md#use-azure-policy). |
| Establish a strategy for structure of data collection rules. | Data collection rules define data to collect from virtual machines with the Azure Monitor agent and where to send that data. Each DCR can include multiple collection scenarios and be associated with any number of VMs. [Establish a strategy for configuring DCRs](../essentials/data-collection-rule-best-practices.md) to collect only required data for different groups of VMs while minimizing the number of DCRs that you need to manage.
| Use Azure Arc to monitor your hybrid VMs. | [Azure Arc for servers](../../azure-arc/servers/overview.md) you manage Windows and Linux physical servers and virtual machines hosted outside of Azure, on your corporate network, or other cloud provider. With the [Azure Connected machine agent](../../azure-arc/servers/agent-overview.md) in place, you can deploy the Azure Monitor agent to your hybrid VMs using the same method that you do for your Azure VMs and then monitor your entire collection of VMs using the same Azure Monitor tools. |
| Migrate management pack logic to Azure Monitor. | If you have an existing SCOM environment, migrate as much management pack logic as you can to Azure Monitor using guidance at Monitor virtual machines with [Migrate from System Center Operations Manager (SCOM) to Azure Monitor](../vm/monitor-virtual-machine-management-packs.md). |
| Migrate SCOM agents to SCOM MI. | If you have an existing SCOM installation for monitoring client workloads on your Azure or hybrid VMs, [migrate to SCOM MI](/system-center/scom/migrate-to-operations-manager-managed-instance) to consolidate your monitoring infrastructure in the cloud while continuing to leverage the same management packs. |
| Target alert rules for VM hosts at subscription or resource group. | Start with [recommended alerts](../vm/tutorial-monitor-vm-alert-recommended.md), which include the most common alert rules for VM hosts but need to be created for each machine. VMs support multi-instance monitoring. Replicating these same rules for a subscription or resource group allow a single rule to apply to multiple machines, and apply immediately to any new machines. |
| Configure data collection for monitoring client workflows. | Use the information at Monitor virtual machines with [Monitor virtual machines with Azure Monitor: Collect data](../vm/monitor-virtual-machine-data-collection.md) to configure data collection beyond that collected by VM insights. |
| Create alert rules for client workloads. | Create alerts for your client workloads using information at [Monitor virtual machines with Azure Monitor: Alerts](../vm/monitor-virtual-machine-alerts.md). |


