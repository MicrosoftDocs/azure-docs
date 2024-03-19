---
title: Types of Azure Monitor alerts
description: This article explains the different types of Azure Monitor alerts and when to use each type.
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 03/10/2024
ms.custom: template-concept
ms.reviewer: harelbr
---

# Choosing the right type of alert rule

This article describes the kinds of Azure Monitor alerts you can create. It helps you understand when to use each type of alert.
For more information about pricing, see the [pricing page](https://azure.microsoft.com/pricing/details/monitor/).

The types of alerts are:
- [Metric alerts](#metric-alerts)
- [Log search alerts](#log-alerts)
- [Activity log alerts](#activity-log-alerts)
    - [Service Health alerts](#service-health-alerts)
    - [Resource Health alerts](#resource-health-alerts)
- [Smart detection alerts](#smart-detection-alerts)
- [Prometheus alerts](#prometheus-alerts)

##  Types of Azure Monitor alerts

|Alert type |When to use |Pricing information|
|---------|---------|---------|
|Metric alert|Metric data is stored in the system already pre-computed. Metric alerts are useful when you want to be alerted about data that requires little or no manipulation. Use metric alerts if the data you want to monitor is available in metric data.|Each metric alert rule is charged based on the number of time series that are monitored. |
|Log search alert|You can use log search alerts to perform advanced logic operations on your data. If the data you want to monitor is available in logs, or requires advanced logic, you can use the robust features of Kusto Query Language (KQL) for data manipulation by using log search alerts.|Each log search alert rule is billed based on the interval at which the log query is evaluated. More frequent query evaluation results in a higher cost. For log search alerts configured for at-scale monitoring using splitting by dimensions, the cost also depends on the number of time series created by the dimensions resulting from your query. |
|Activity log alert|Activity logs provide auditing of all actions that occurred on resources. Use activity log alerts to be alerted when a specific event happens to a resource like a restart, a shutdown, or the creation or deletion of a resource. Service Health alerts and Resource Health alerts let you know when there's an issue with one of your services or resources.|For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/monitor/).|
|Prometheus alerts|Prometheus alerts are used for alerting on Prometheus metrics stored in [Azure Monitor managed services for Prometheus](../essentials/prometheus-metrics-overview.md). The alert rules are based on the PromQL open-source query language. |Prometheus alert rules are only charged on the data queried by the rules.  For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/monitor/). |

## Metric alerts

A metric alert rule monitors a resource by evaluating conditions on the resource metrics at regular intervals. If the conditions are met, an alert is fired. A metric time-series is a series of metric values captured over a period of time.

You can create rules by using these metrics:
- [Platform metrics](alerts-metric-near-real-time.md#metrics-and-dimensions-supported)
- [Custom metrics](../essentials/metrics-custom-overview.md)
- [Application Insights custom metrics](../app/api-custom-events-metrics.md)
- [Selected logs from a Log Analytics workspace converted to metrics](alerts-metric-logs.md)

Metric alert rules include these features:
- You can use multiple conditions on an alert rule for a single resource.
- You can add granularity by [monitoring multiple metric dimensions](#narrow-the-target-using-dimensions). 
- You can use [dynamic thresholds](#apply-advanced-machine-learning-with-dynamic-thresholds), which are driven by machine learning. 
- You can configure if metric alerts are [stateful or stateless](alerts-overview.md#alerts-and-state). Metric alerts are stateful by default.

The target of the metric alert rule can be:
- A single resource, such as a virtual machine (VM). For supported resource types, see [Supported resources for metric alerts in Azure Monitor](alerts-metric-near-real-time.md).
- [Multiple resources](#monitor-multiple-resources-with-one-alert-rule) of the same type in the same Azure region, such as a resource group.

### Applying multiple conditions to a metric alert rule

When you create an alert rule for a single resource, you can apply multiple conditions. For example, you could create an alert rule to monitor an Azure virtual machine and alert when both "Percentage CPU is higher than 90%" and "Queue length is over 300 items". When an alert rule has multiple conditions, the alert fires when all the conditions in the alert rule are true and is resolved when at least one of the conditions is no longer true for three consecutive checks.

### Narrow the target using dimensions

For instructions on using dimensions in metric alert rules, see [Monitor multiple time series in a single metric alert rule](alerts-metric-multiple-time-series-single-rule.md).

### Monitor the same condition on multiple resources using splitting by dimensions

To monitor for the same condition on multiple Azure resources, you can use splitting by dimensions. When you use splitting by dimensions, you can create resource-centric alerts at scale for a subscription or resource group. Alerts are split into separate alerts by grouping combinations. Splitting on an Azure resource ID column makes the specified resource into the alert target.

You might also decide not to split when you want a condition applied to multiple resources in the scope. For example, you might want to fire an alert if at least five machines in the resource group scope have CPU usage over 80%.

### Monitor multiple resources with one alert rule

You can monitor at scale by applying the same metric alert rule to multiple resources of the same type for resources that exist in the same Azure region. Individual notifications are sent for each monitored resource.

The platform metrics for these services in the following Azure clouds are supported:

| Service           | Resource Provider           | Global Azure | Government | China   |
|:------------------|:------------|:-------------|:-----------|:--------|
| Virtual machines |"Microsoft.Compute/virtualMachines"| Yes      |Yes     | Yes |
| SQL Server databases |"Microsoft.Sql/servers/databases"| Yes      | Yes    | Yes |
| SQL Server elastic pools |"Microsoft.Sql/servers/elasticpools"| Yes      | Yes    | Yes |
| NetApp files capacity pools |"Microsoft.NetApp/netAppAccounts/capacityPools"| Yes      | Yes    | Yes |
| NetApp files volumes |"Microsoft.NetApp/netAppAccounts/capacityPools/volumes"| Yes      | Yes    | Yes |
| Azure Key Vault |"Microsoft.KeyVault/vaults"| Yes      | Yes    | Yes |
| Azure Cache for Redis |"Microsoft.Cache/redis"| Yes      | Yes    | Yes |
| Azure Stack Edge devices |(There is no specific Resource provider for this resource. Because of how Stack edge devices work, **the metrics are retrieved from several resource providers**. You can check this documentation for more details regarding alerts for this resource: [Review alerts on Azure Stack Edge](https://learn.microsoft.com/en-us/azure/databox-online/azure-stack-edge-alerts)) | Yes      | Yes    | Yes |
| Recovery Services vaults |"Microsoft.RecoveryServices/Vaults"| Yes      | No     | No  |
| Azure Database for PostgreSQL - Flexible Server |"Microsoft.DBforPostgreSQL/flexibleServers"| Yes      | Yes    | Yes |
| Bare Metal Machines (Operator Nexus) |"Microsoft.NetworkCloud/bareMetalMachines"| Yes      | Yes    | Yes |
| Storage Appliances (Operator Nexus) |"Microsoft.NetworkCloud/storageAppliances"| Yes      | Yes    | Yes |
| Clusters (Operator Nexus) |"Microsoft.NetworkCloud/clusters"| Yes      | Yes    | Yes |
| Network Devices (Operator Nexus) |Microsoft.NetworkCloud/l2Networks, Microsoft.NetworkCloud/l3Networks| Yes      | Yes    | Yes |
| Data collection rules |"Microsoft.Insights/datacollectionrules"| Yes      | Yes    | Yes |

  > [!NOTE]
  > Multi-resource metric alerts aren't supported for:
  > - VM guest metrics.
  > - VM network metrics (Network In Total, Network Out Total, Inbound Flows, Outbound Flows, Inbound Flows Maximum Creation Rate, and Outbound Flows Maximum Creation Rate).

