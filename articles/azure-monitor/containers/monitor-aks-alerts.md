---
title: Monitor Azure Kubernetes Service (AKS) with Azure Monitor - Alerts
description: Describes how to create alerts from your AKS cluster using Azure Monitor.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/02/2021

---

# Monitoring Azure Kubernetes Service (AKS) - Alerts
This article is part of the [Monitoring AKS with Azure Monitor scenario](monitor-aks.md). It provides guidance on creating alert rules for your AKS clusters and their components. [Alerts in Azure Monitor](../alerts/alerts-overview.md) proactively notify you of interesting data and patterns in your monitoring data. They allow you to identify and address issues in your system before your customers notice them. There are no preconfigured alert rules for virtual machines, but you can create your own based on data collected by Container insights.

> [!IMPORTANT]
> Most alert rules have a cost that's dependent on the type of rule, how many dimensions it includes, and how frequently it's run. Refer to **Alert rules** in [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) before you create any alert rules.


## Choosing the alert type
The most common types of alert rules in Azure Monitor are [metric alerts](../alerts/alerts-metric.md) and [log query alerts](../alerts/alerts-log-query.md). The type of alert rule that you create for a particular scenario will depend on where the data is located that you're alerting on. You may have cases though where data for a particular alerting scenario is available in both Metrics and Logs, and you need to determine which rule type to use. 

It's typically the best strategy to use metric alerts instead of log alerts when possible since they're more responsive and stateful. You can create a metric alert on any values you can analyze in metrics explorer. If the logic for your alert rule requires data in Logs, or if it requires more complex logic, then you can use a log query alert rule.

## Metric alert rules
Metric alert rules use the same metric values as metrics explorer. In fact, you can create an alert rule directly from metrics explorer with the data you're currently analyzing. You can use any of the values in [AKS data reference metrics](monitor-aks-reference.md#metrics) for metric alert rules.

Container insights includes a feature in public preview that creates metric alert rules for your AKS cluster. Ths feature creates new metric values (also in preview) used by the alert rules that you can also use in metrics explorer. See [Recommended metric alerts (preview) from Container insights](container-insights-metric-alerts.md) for details on this feature and on creating metric alerts for AKS.


## Log alerts rules
Log alerts can perform two different measurements of the result of a log query, each of which support distinct scenarios for monitoring virtual machines.






The following sections provide log queries for different alert rules. 

View your AKS cluster in the Azure portal and select **Logs** from the **Monitoring** menu. 

Paste the script into query window and click **Run** to verify the results. You may need to temporarily adjust the threshold values to return data for testing.

Click **New alert rule**.


```









## Next steps

* [Analyze monitoring data collected for AKS cluster.](monitor-aks-analyze.md)
* 