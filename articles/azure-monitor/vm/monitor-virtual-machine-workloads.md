---
title: 'Monitor virtual machines with Azure Monitor: Workloads'
description: Learn how to monitor the guest workloads of virtual machines in Azure Monitor.
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/10/2023
ms.reviewer: Xema Pathak

---

# Monitor virtual machines with Azure Monitor: Migrate management pack logic
This article is part of the guide [Monitor virtual machines and their workloads in Azure Monitor](monitor-virtual-machine.md). 
> [!NOTE]
> This guide describes how to implement complete monitoring of your Azure and hybrid virtual machine environment. To get started monitoring your first Azure virtual machine, see [Monitor Azure virtual machines](../../virtual-machines/monitor-vm.md) or [Tutorial: Collect guest logs and metrics from Azure virtual machine](tutorial-monitor-vm-guest.md). 

A significant number of customers who implement Azure Monitor currently monitor their virtual machine workloads by using management packs in System Center Operations Manager. There are no migration tools to convert assets from Operations Manager to Azure Monitor because the platforms are fundamentally different. Your migration instead constitutes a standard Azure Monitor implementation while you continue to use Operations Manager. As you customize Azure Monitor to meet your requirements for different applications and components and as it gains more features, then you can start to retire different management packs and agents in Operations Manager.

> [!NOTE]
> [Azure Monitor SCOM Managed Instance (preview)](scom-managed-instance-overview.md) is now in public preview. This allows you to move your existing SCOM environment into the Azure portal with Azure Monitor while continuing to use the same management packs. The rest of the recommendations in this article still apply as you migrate your monitoring logic into Azure Monitor.



## Convert management pack logic

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
A synthetic transaction connects to an application or service running on a machine to simulate a user connection or actual user traffic. If the application is available, you can assume that the machine is running properly. [Application insights](../app/app-insights-overview.md) in Azure Monitor provides this functionality. It only works for applications that are accessible from the internet. For internal applications, you must open a firewall to allow access from specific Microsoft URLs performing the test. Or you can use an alternate monitoring solution, such as System Center Operations Manager.

|Method | Description |
|:---|:---|
| [URL test](../app/monitor-web-app-availability.md) | Ensures that HTTP is available and returning a web page |
| [Multistep test](../app/availability-multistep.md) | Simulates a user session |

## Next steps

* [Learn how to analyze data in Azure Monitor logs using log queries](../logs/get-started-queries.md)
* [Learn about alerts using metrics and logs in Azure Monitor](../alerts/alerts-overview.md)