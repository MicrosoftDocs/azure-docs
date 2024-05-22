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
| Azure Stack Edge devices |(There is no specific Resource provider for this resource. Because of how Stack edge devices work, **the metrics are retrieved from several resource providers**. You can check this documentation for more details regarding alerts for this resource: [Review alerts on Azure Stack Edge](../../databox-online/azure-stack-edge-alerts.md)) | Yes      | Yes    | Yes |
| Recovery Services vaults |"Microsoft.RecoveryServices/Vaults"| Yes      | No     | No  |
| Azure Database for PostgreSQL - Flexible Server |"Microsoft.DBforPostgreSQL/flexibleServers"| Yes      | Yes    | Yes |
| Bare Metal Machines (Operator Nexus) |"Microsoft.NetworkCloud/bareMetalMachines"| Yes      | Yes    | Yes |
| Storage Appliances (Operator Nexus) |"Microsoft.NetworkCloud/storageAppliances"| Yes      | Yes    | Yes |
| Clusters (Operator Nexus) |"Microsoft.NetworkCloud/clusters"| Yes      | Yes    | Yes |
| Network Devices (Operator Nexus) |Microsoft.NetworkCloud/l2Networks, Microsoft.NetworkCloud/l3Networks| Yes      | Yes    | Yes |
| Data collection rules |"Microsoft.Insights/datacollectionrules"| Yes      | Yes    | Yes |

  > [!NOTE]
  > Multi-resource metric alerts aren't supported for:
  > - Alerting on VM guest metrics.
  > - Alerting on VM network metrics (Network In Total, Network Out Total, Inbound Flows, Outbound Flows, Inbound Flows Maximum Creation Rate, and Outbound Flows Maximum Creation Rate).

You can specify the scope of monitoring with a single metric alert rule in one of three ways. For example, with VMs you can specify the scope as:

- A list of VMs in one Azure region within a subscription.
- All VMs in one Azure region in one or more resource groups in a subscription.
- All VMs in one Azure region in a subscription.

### Apply advanced machine learning with dynamic thresholds

Dynamic thresholds use advanced machine learning to:
- Learn the historical behavior of metrics.
- Identify patterns and adapt to metric changes over time, such as hourly, daily, or weekly patterns.
- Recognize anomalies that indicate possible service issues.
- Calculate the most appropriate threshold for the metric.

Machine learning continuously uses new data to learn more and make the threshold more accurate. Because the system adapts to the metrics' behavior over time, and alerts based on deviations from its pattern, you don't have to know the "right" threshold for each metric.

Dynamic thresholds help you:
- Create scalable alerts for hundreds of metric series with one alert rule. If you have fewer alert rules, you spend less time creating and managing alerts rules.
- Create rules without having to know what threshold to configure.
- Configure metric alerts by using high-level concepts without extensive domain knowledge about the metric.
- Prevent noisy (low precision) or wide (low recall) thresholds that don’t have an expected pattern.
- Handle noisy metrics (such as machine CPU or memory) and metrics with low dispersion (such as availability and error rate).

See [dynamic thresholds](alerts-dynamic-thresholds.md) for detailed instructions on using dynamic thresholds in metric alert rules.

## <a name="log-alerts"></a>Log search alerts

A log search alert rule monitors a resource by using a Log Analytics query to evaluate resource logs at a set frequency. If the conditions are met, an alert is fired. Because you can use Log Analytics queries, you can perform advanced logic operations on your data and use the robust KQL features to manipulate log data.

The target of the log search alert rule can be:
- A single resource, such as a VM. 
- A single container of resources, like a resource group or subscription.
- Multiple resources that use a [cross-resource query](../logs/cross-workspace-query.md).

Log search alerts can measure two different things, which can be used for different monitoring scenarios:
- **Table rows**: The number of rows returned can be used to work with events such as Windows event logs, Syslog, and application exceptions.
- **Calculation of a numeric column**: Calculations based on any numeric column can be used to include any number of resources. An example is CPU percentage.

You can configure if log search alerts are [stateful or stateless](alerts-overview.md#alerts-and-state). This feature is currently in preview. 
Note that stateful log search alerts have these limitations:
- they can trigger up to 300 alerts per evaluation.
- you can have a maximum of 5000 alerts with the `fired` alert condition.

> [!NOTE]
> Log search alerts work best when you're trying to detect specific data in the logs, as opposed to when you're trying to detect a lack of data in the logs. Because logs are semi-structured data, they're inherently more latent than metric data on information like a VM heartbeat. To avoid misfires when you're trying to detect a lack of data in the logs, consider using [metric alerts](#metric-alerts). You can send data to the metric store from logs by using [metric alerts for logs](alerts-metric-logs.md).

### Monitor multiple instances of a resource using dimensions

You can use dimensions when you create log search alert rules to monitor the values of multiple instances of a resource with one rule. For example, you can monitor CPU usage on multiple instances running your website or app. Each instance is monitored individually. Notifications are sent for each instance.

### Monitor the same condition on multiple resources using splitting by dimensions

To monitor for the same condition on multiple Azure resources, you can use splitting by dimensions. When you use splitting by dimensions, you can create resource-centric alerts at scale for a subscription or resource group. Alerts are split into separate alerts by grouping combinations by using numerical or string columns. Splitting on the Azure resource ID column makes the specified resource into the alert target.

You might also decide not to split when you want a condition applied to multiple resources in the scope. For example, you might want to fire an alert if at least five machines in the resource group scope have CPU usage over 80%.

### Use the API for log search alert rules

Manage new rules in your workspaces by using the [ScheduledQueryRules](/rest/api/monitor/scheduledqueryrule-2021-08-01/scheduled-query-rules) API.

> [!NOTE]
> Log search alerts for Log Analytics used to be managed by using the legacy [Log Analytics Alert API](api-alerts.md). Learn more about [switching to the current ScheduledQueryRules API](alerts-log-api-switch.md).

### Log search alerts on your Azure bill

Log search alerts are listed under resource provider `microsoft.insights/scheduledqueryrules` with:
- Log search alerts on Application Insights shown with the exact resource name along with resource group and alert properties.
- Log search alerts on Log Analytics are shown with the exact resource name along with resource group and alert properties when they're created by using the scheduledQueryRules API.
- Log search alerts created from the [legacy Log Analytics API](./api-alerts.md) aren't tracked [Azure resources](../../azure-resource-manager/management/overview.md) and don't have enforced unique resource names. These alerts are still created on `microsoft.insights/scheduledqueryrules` as hidden resources, which have the resource naming structure `<WorkspaceName>|<savedSearchId>|<scheduleId>|<ActionId>`. Log search alerts on the legacy API are shown with the preceding hidden resource name along with resource group and alert properties.

> [!Note]
> Unsupported resource characters like <, >, %, &, \, ? and / are replaced with an underscore (_) in the hidden resource names. This character change is also reflected in the billing information.

## Activity log alerts

An activity log alert monitors a resource by checking the activity logs for a new activity log event that matches the defined conditions.

You might want to use activity log alerts for these types of scenarios:
- When a specific operation occurs on resources in a specific resource group or subscription. For example, you might want to be notified when:
    - A VM in a production resource group is deleted.
    - New roles are assigned to a user in your subscription.
- A Service Health event occurs. Service Health events include notifications of incidents and maintenance events that apply to resources in your subscription.

You can create an activity log alert on:
- Any of the activity log [event categories](../essentials/activity-log-schema.md), other than on alert events. 
- Any activity log event in a top-level property in the JSON object.

Activity log alert rules are Azure resources, so they can be created by using an Azure Resource Manager template. They also can be created, updated, or deleted in the Azure portal.

An activity log alert only monitors events in the subscription in which the alert is created.

### Service Health alerts

Service Health alerts are a type of activity alert. [Service Health](../../service-health/overview.md) lets you know about outages, planned maintenance activities, and other health advisories because the authenticated Service Health experience knows which services and resources you currently use.

The best way to use Service Health is to set up Service Health alerts to notify you by using your preferred communication channels when service issues, planned maintenance, or other changes might affect the Azure services and regions you use.

### Resource Health alerts

Resource Health alerts are a type of activity alert. The [Resource Health overview](../../service-health/resource-health-overview.md) helps you diagnose and get support for service problems that affect your Azure resources. It reports on the current and past health of your resources.

Resource Health relies on signals from different Azure services to assess whether a resource is healthy. If a resource is unhealthy, Resource Health analyzes more information to determine the source of the problem. It also reports on actions that Microsoft is taking to fix the problem and identifies actions you can take to address it.

## Smart detection alerts

After you set up Application Insights for your project and your app generates a certain amount of data, smart detection takes 24 hours to learn the normal behavior of your app. Your app's performance has a typical pattern of behavior. Some requests or dependency calls will be more prone to failure than others, and the overall failure rate might go up as load increases.

Smart detection uses machine learning to find these anomalies. Smart detection monitors the data received from your app, and in particular the failure rates. Application Insights automatically alerts you in near real time if your web app experiences an abnormal rise in the rate of failed requests.

As data comes into Application Insights from your web app, smart detection compares the current behavior with the patterns seen over the past few days. If there's an abnormal rise in failure rate compared to previous performance, an analysis is triggered.

To help you triage and diagnose a problem, an analysis of the characteristics of the failures and related application data is provided in the alert details. There are also links to the Application Insights portal for further diagnosis. The feature doesn't need setup or configuration because it uses machine learning algorithms to predict the normal failure rate.

Although metric alerts tell you there might be a problem, smart detection starts the diagnostic work for you. It performs much of the analysis you would otherwise have to do yourself. You get the results neatly packaged, which helps you to quickly get to the root of the problem.

Smart detection works for web apps hosted in the cloud or on your own servers that generate application requests or dependency data.

## Prometheus alerts

Prometheus alerts are used to monitor metrics stored in [Azure Monitor managed services for Prometheus](../essentials/prometheus-metrics-overview.md). Prometheus alert rules are configured as part of [Prometheus rule groups](/azure/azure-monitor/essentials/prometheus-rule-groups). They fire when the result of a PromQL expression resolves to true. Fired Prometheus alerts are displayed and managed like other alert types.

## Next steps
- Get an [overview of alerts](alerts-overview.md).
- [Create an alert rule](alerts-log.md).
- Learn more about [smart detection](proactive-failure-diagnostics.md).
