---
title: 'Monitor virtual machines with Azure Monitor: Migrate management pack logic'
description: Includes a general approach that existing customers of System Center Operations Manager (SCOM) might take to translate critical logic in their management packs to Azure Monitor.
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/10/2023
ms.reviewer: Xema Pathak

---

# Monitor virtual machines with Azure Monitor: Migrate management pack logic
This article is part of the guide [Monitor virtual machines and their workloads in Azure Monitor](monitor-virtual-machine.md). It discusses a general approach that existing customers of System Center Operations Manager (SCOM) might take to translate critical logic in their management packs to Azure Monitor.

> [!NOTE]
> [Azure Monitor SCOM Managed Instance (preview)](scom-managed-instance-overview.md) is now in public preview. This allows you to move your existing SCOM environment into the Azure portal with Azure Monitor while continuing to use the same management packs. The rest of the recommendations in this article still apply as you migrate your monitoring logic into Azure Monitor.


## Translating logic
You may currently use SCOM to monitor your virtual machines and their workloads and are starting to consider which monitoring you can move to Azure Monitor. As described in [Azure Monitor for existing Operations Manager customer](../azure-monitor-operations-manager.md), you may continue using SCOM for some period of time until you no longer require the extensive monitoring that SCOM provides. See [Cloud monitoring guide: Monitoring platforms overview](/azure/cloud-adoption-framework/manage/monitor/platform-overview) for a complete comparison of Azure Monitor and SCOM.

There are no migration tools to convert SCOM management packs to Azure Monitor because the platforms are fundamentally different. Your migration instead constitutes a standard Azure Monitor implementation while you continue to use SCOM. As you customize Azure Monitor to meet your requirements for different applications and components and as it gains more features, then you can start to retire different management packs and agents in Operations Manager.

Management packs in SCOM contain rules and monitors that combine collection of data and the resulting alert into a single end-to-end workflow. Data that's already been collected by SCOM is rarely used for alerting. Azure Monitor separates data collection and alerts into separate processes. Alert rules access data from Azure Monitor Logs and Azure Monitor Metrics that has already been collected from agents. Also, rules and monitors are typically narrowly focused on very specific data such as a particular event or performance counter. Data collection rules in Azure Monitor are typically more broad collecting multiple sets of events and performance counters in a single DCR.



- Data that you need to collect to support alerting, analysis, and visualization. See [Monitor virtual machines with Azure Monitor: Data collection](monitor-virtual-machine-data-collection.md)
- Alerts rules that analyze the collected data to proactively notify of you of issues. See [Monitor virtual machines with Azure Monitor: Alerts](monitor-virtual-machine-alerts.md)


## Identify critical management pack logic

Instead of attempting to replicate the entire functionality of a management pack, analyze the critical monitoring provided by the management pack. Decide whether you can replicate those monitoring requirements by using the methods described in the previous sections. In many cases, you can configure data collection and alert rules in Azure Monitor that replicate enough functionality that you can retire a particular management pack. Management packs can often include hundreds and even thousands of rules and monitors.

In most scenarios, Operations Manager combines data collection and alerting conditions in the same rule or monitor. In Azure Monitor, you must configure data collection and an alert rule for any alerting scenarios.

One strategy is to focus on those monitors and rules that triggered alerts in your environment. Refer to [existing reports available in Operations Manager](/system-center/scom/manage-reports-installed-during-setup), such as **Alerts** and **Most Common Alerts**, which can help you identify alerts over time. You can also run the following query on the Operations Database to evaluate the most common recent alerts.

```sql
select AlertName, COUNT(AlertName) as 'Total Alerts' from
Alert.vAlertResolutionState ars
inner join Alert.vAlertDetail adt on ars.AlertGuid = adt.AlertGuid
inner join Alert.vAlert alt on ars.AlertGuid = alt.AlertGuid
group by AlertName
order by 'Total Alerts' DESC
```

Evaluate the output to identify specific alerts for migration. Ignore any alerts that were tuned out or are known to be problematic. Review your management packs to identify any critical alerts of interest that never fired.



## Synthetic transactions
Management packs often make use of synthetic transactions that connect to an application or service running on a machine to simulate a user connection or actual user traffic. If the application is available, you can assume that the machine is running properly. [Application insights](../app/app-insights-overview.md) in Azure Monitor provides this functionality. It only works for applications that are accessible from the internet. For internal applications, you must open a firewall to allow access from specific Microsoft URLs performing the test. Or you can use an alternate monitoring solution, such as System Center Operations Manager.

|Method | Description |
|:---|:---|
| [URL test](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability) | Ensures that HTTP is available and returning a web page |
| [Multistep test](/previous-versions/azure/azure-monitor/app/availability-multistep) | Simulates a user session |

## Next steps

* [Learn how to analyze data in Azure Monitor logs using log queries](../logs/get-started-queries.md)
* [Learn about alerts using metrics and logs in Azure Monitor](../alerts/alerts-overview.md)