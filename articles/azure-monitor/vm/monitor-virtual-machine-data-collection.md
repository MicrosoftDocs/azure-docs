---
title: 'Monitor virtual machines with Azure Monitor: Configure monitoring'
description: Learn how to configure virtual machines for monitoring in Azure Monitor. Monitor virtual machines and their workloads with an Azure Monitor scenario.
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/21/2021
ms.reviewer: Xema Pathak

---

# Monitor virtual machines with Azure Monitor: Collect data
This article is part of the scenario [Monitor virtual machines and their workloads in Azure Monitor](monitor-virtual-machine.md). It describes how to configure monitoring of your Azure and hybrid virtual machines in Azure Monitor.

> [!NOTE]
> This scenario describes how to implement complete monitoring of your Azure and hybrid virtual machine environment. To get started monitoring your first Azure virtual machine, see [Monitor Azure virtual machines](../../virtual-machines/monitor-vm.md).


## No configuration
Azure Monitor provides a basic level of monitoring for Azure virtual machines at no cost and with no configuration.

- Platform metrics for Azure virtual machines include important metrics such as CPU, network, and disk utilization. They can be viewed on the [Overview page](monitor-virtual-machine-analyze.md#single-machine-experience) for the machine in the Azure portal and support metric alerts. See [Enable recommended alert rules for Azure virtual machine](../azure-monitor/vm/tutorial-monitor-vm-alert-recommended.md).
- The Activity log is collected automatically and includes the recent activity of the machine, such as any configuration changes and when it was stopped and started.

## Send Activity log to a Log Analytics workspace
You can view the platform metrics and Activity log collected for each virtual machine host in the Azure portal. Send this data into the same Log Analytics workspace as VM insights to analyze it with the other monitoring data collected for the virtual machine. You might have already done this task when you configured monitoring for other Azure resources because there's a single Activity log for all resources in an Azure subscription.

There's no cost for ingestion or retention of Activity log data. For details on how to create a diagnostic setting to send the Activity log to your Log Analytics workspace, see [Create diagnostic settings](../essentials/diagnostic-settings.md).



## Configure data collection
Data collection from the Azure Monitor agent is done with one or more [data collection rules](../essentials/data-collection-rule-overview.md) that are associated with your virtual machines. You can view the DCRs in your Azure subscription from the **Data Collection Rules** from the **Monitor** menu in the Azure portal. DCRs support other data collection scenarios in Azure Monitor, so all of your DCRs won't necessarily be for virtual machines.

[VM insights](vminsights-enable-overview.md) will create a DCR that collects common performance data from the guest operating system. It will optionally collect details for processes running on the machine and dependencies with other systems. This data is all sent to Azure Monitor Logs where it can be used with log queries and log alerts.

Create additional DCRs to collect other telemetry such as Windows and Syslog events and to send performance data to Azure Monitor Metrics. See the following for guidance on creating DCRs to collect different types of data. For a list of the data sources available and details on how to configure them, see [Agent data sources in Azure Monitor](../agents/agent-data-sources.md).

- [Events and performance data](../agents/data-collection-rule-azure-monitor-agent.md)
- [IISlogs](agents/data-collection-iis.md)
- [Text logs](agents/data-collection-text-log.md)
- [SNMP traps](agents/data-collection-snmp-data.md)


## Transformations
Use [transformations](../essentials/data-collection-transformations.md) to filter and modify data that you collect from your virtual machines to minimize your cost and increase the richness of your data. You should first filter data using xpath queries as described in [Filter events using XPath queries]()../agents/data-collection-rule-azure-monitor-agent.md#filter-events-using-xpath-queries). Use transformations where you need more complex logic to filter records or to remove data from columns that you don't need. 

## DCR strategy
A common set of DCRs may not be sufficient for your entire environment, but you may have unique monitoring requirements for different sets of machines. As your monitoring environment grows, you should establish a strategy for structuring your DCRs. See [Best practices for data collection rule creation and management in Azure Monitor](../essentials/data-collection-rule-best-practices.md) for guidance on how to structure and manage your DCRs.


## Next steps

* [Analyze monitoring data collected for virtual machines](monitor-virtual-machine-analyze.md)
* [Create alerts from collected data](monitor-virtual-machine-alerts.md)
* [Monitor workloads running on virtual machines](monitor-virtual-machine-workloads.md)

