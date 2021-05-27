---
title: Monitor virtual machines with Azure Monitor
description: Describes how to collect and analyze monitoring data from virtual machines in Azure using Azure Monitor.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/01/2021

---

# Monitoring Azure virtual machines with Azure Monitor - convert management pack

## System Center Operations Manager
System Center Operations Manager provides granular monitoring of workloads on virtual machines. See the [Cloud Monitoring Guide](/azure/cloud-adoption-framework/manage/monitor/) for a comparison of monitoring platforms and different strategies for implementation.

If you have an existing Operations Manager environment that you intend to keep using, you can integrate it with Azure Monitor to provide additional functionality. The Log Analytics agent used by Azure Monitor is the same one used for Operations Manager so that you have monitored virtual machines send data to both. You still need to add the agent to VM insights and configure the workspace to collect additional data as specified above, but the virtual machines can continue to run their existing management packs in a Operations Manager environment without modification.

Features of Azure Monitor that augment an existing Operations Manager features include the following:

- Use Log Analytics to interactively analyze your log and performance data.
- Use log alerts to define alerting conditions across multiple virtual machines and using long term trends that aren't possible using alerts in Operations Manager.   

See [Connect Operations Manager to Azure Monitor](../agents/om-agents.md) for details on connecting your existing Operations Manager management group to your Log Analytics workspace.


## Converting from management packs
A significant number of customers implementing Azure Monitor currently monitor their virtual machine workloads using management packs in System Center Operations Manager. There are no migration tools to convert assets from Operations Manager to Azure Monitor since the platforms are fundamentally different. Your migration will instead constitute a standard Azure Monitor implementation while you continue to use Operations Manager. As you customize Azure Monitor to meet your requirements for different applications and components and as it gains more features, then you can start to retire different management packs and agents in Operations Manager.

In many cases, you can configure data collection and alert rules in Azure Monitor that will replicate enough functionality that you can retire a particular management pack. Management packs can often include hundreds and even thousands of rules and monitors. Rather than attempting to replicate the entire functionality of a management pack, analyze the critical monitoring provided by the management pack and whether you can replicate those monitoring requirements using on the methods described in the previous sections.

You must configure data collection and an alert rule for any alerting scenarios. In most scenarios SCOM combines data collection and alerting conditions in the same rule or monitor. 

One strategy is to focus on those monitors and rules that have triggered alerts in your environment. Run the following query on the Operations Database to evaluate the most common alerts in your environment. Evaluate the output to identify specific alerts for migration. Ignore any alerts that have been tuned out or known to be problematic. Review your management packs to identify any additional critical alerts of interest that have never fired. Identify 25-50 alerts for a pilot migration.



```sql
select AlertName, COUNT(AlertName) as 'Total Alerts' from
Alert.vAlertResolutionState ars
inner join Alert.vAlertDetail adt on ars.AlertGuid = adt.AlertGuid
inner join Alert.vAlert alt on ars.AlertGuid = alt.AlertGuid
group by AlertName
order by 'Total Alerts' DESC
```



## Next steps

* [Learn how to analyze data in Azure Monitor logs using log queries.](../logs/get-started-queries.md)
* [Learn about alerts using metrics and logs in Azure Monitor.](../alerts/alerts-overview.md)