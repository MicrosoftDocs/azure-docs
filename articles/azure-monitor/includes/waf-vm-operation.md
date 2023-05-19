---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---

### Design checklist

> [!div class="checklist"]
> - Migrate from legacy agents to Azure Monitor agent.
> - Consider whether to use VM insights
> - Use Azure Policy to deploy agents and assign data collection rules.
> - Establish a strategy for structure of data collection rules.
> - Use Azure Arc to monitor your hybrid VMs.
> - Migrate management pack logic to Azure Monitor.
> - Migrate SCOM agents to SCOM MI.
> - Target alert rules for VM hosts at subscription or resource group.
> - Configure data collection for monitoring client workflows.


### Configuration recommendations

| Recommendation | Description |
|:---|:---|
| Migrate from legacy agents to Azure Monitor agent. | The Azure Monitor agent is simpler to manage than the legacy Log Analytics agent and allows more flexibility in your [Log Analytics workspace design](). Both the Windows and Linux agents allow multihoming, which means they can connect to multiple workspaces. Data collection rules allow you to manage your data collection settings at scale and define unique, scoped configurations for subsets of machines. See [Migrate to Azure Monitor Agent from Log Analytics agent](../agents/azure-monitor-agent-migration.md) for considerations and migration methods. | 
| Use Azure Arc to monitor your hybrid VMs. | [Azure Arc for servers](../../azure-arc/servers/overview.md) allows you to manage physical servers and virtual machines hosted outside of Azure, on your corporate network, or other cloud provider. With the [Azure Connected machine agent](../../azure-arc/servers/agent-overview.md) in place, you can deploy the Azure Monitor agent to your hybrid VMs using the same method that you do for your Azure VMs and then monitor your entire collection of VMs using the same Azure Monitor tools. |
| Target alert rules for VM hosts at subscription or resource group. | Start with [recommended alerts](../vm/tutorial-monitor-vm-alert-recommended.md), which include the most common alert rules for VM hosts but need to be created for each machine. Replicate these same rules for a subscription or resource group to allow a [single rule to apply to multiple machines](../alerts/alerts-types.md#monitor-multiple-resources), and also be applied immediately to any new machines. |
| Consider whether to use VM insights | VM insights isn't required to monitor your VMs in Azure Monitor. Since there is a cost for the data that it collects, your choice whether to use VM insights depends on your particular requirements. See [Should you use VM insights?](../vm/vminsights-overview.md#who-should-use-vm-insights) for a listing of unique VM insights features that may provide benefit for your environment. |
| Use Azure Policy to deploy agents and assign data collection rules. | [Azure Policy](../../governance/policy/overview.md) allows you to have agents automatically deployed to sets of existing VMs and any new VMs that are created. This ensures that all VMs are monitored with minimal intervention by administrators. If you use VM insights, see [Enable VM insights by using Azure Policy](../vm/vminsights-enable-policy.md). If you want to manage Azure Monitor agent without VM insights, see [Enable Azure Monitor Agent by using Azure Policy](../agents/azure-monitor-agent-manage.md#use-azure-policy). See [Resource Manager template samples for data collection rules in Azure Monitor](../agents/resource-manager-data-collection-rules.md) for a template to create a data collection rule association. |
| Establish a strategy for structure of data collection rules. | Data collection rules define data to collect from virtual machines with the Azure Monitor agent and where to send that data. Each DCR can include multiple collection scenarios and be associated with any number of VMs. [Establish a strategy for configuring DCRs](../essentials/data-collection-rule-best-practices.md) to collect only required data for different groups of VMs while minimizing the number of DCRs that you need to manage. |
| Configure data collection for monitoring client workflows. | Use the information at Monitor virtual machines with [Monitor virtual machines with Azure Monitor: Collect data](../vm/monitor-virtual-machine-data-collection.md) to configure client data collection beyond that collected by VM insights. |
| Create alert rules for client workloads. | Create alerts for your client workloads using information at [Monitor virtual machines with Azure Monitor: Alerts](../vm/monitor-virtual-machine-alerts.md). |
| If you have an existing SCOM environment, migrate it to Azure Monitor. | If you have an existing SCOM environment for monitoring client workloads on your Azure or hybrid VMs, migrate as much management pack logic as you can to Azure Monitor using guidance at Monitor virtual machines with [Migrate from System Center Operations Manager (SCOM) to Azure Monitor](../vm/monitor-virtual-machine-management-packs.md). |
| Migrate your SCOM environment to SCOM MI. If your management packs include required logic that you can't convert, [migrate your SCOM environment to SCOM MI](/system-center/scom/migrate-to-operations-manager-managed-instance) to consolidate your monitoring infrastructure in the cloud. |