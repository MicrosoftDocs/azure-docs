---
title: Types of Azure Monitor alerts
description: This article explains the different types of Azure Monitor alerts and when to use each type. 
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 09/14/2022
ms.custom: template-concept, ignite-2022
ms.reviewer: harelbr
---

# Types of Azure Monitor alerts

This article describes the kinds of Azure Monitor alerts you can create, and helps you understand when to use each type of alert.

There are five types of alerts:
- [Metric alerts](#metric-alerts)
- [Log alerts](#log-alerts)
- [Activity log alerts](#activity-log-alerts)
- [Smart detection alerts](#smart-detection-alerts)
- [Prometheus alerts](#prometheus-alerts-preview)
- 
## Choosing the right alert type

This table can help you decide when to use what type of alert. For more detailed information about pricing, see the [pricing page](https://azure.microsoft.com/pricing/details/monitor/).

|Alert Type  |When to Use |Pricing Information|
|---------|---------|---------|
|Metric alert|Metric data is stored in the system already pre-computed. Metric alerts are useful when you want to be alerted about data that requires little or no manipulation. We recommend using metric alerts if the data you want to monitor is available in metric data.|Each metric alert rule is charged based on the number of time-series that are monitored. |
|Log alert|Log alerts allow you to perform advanced logic operations on your data. If the data you want to monitor is available in logs, or requires advanced logic, you can use the robust features of KQL for data manipulation using log alerts.|Each log alert rule is billed based on the interval at which the log query is evaluated (more frequent query evaluation results in a higher cost). Additionally, for log alerts configured for [at scale monitoring](#splitting-by-dimensions-in-log-alert-rules), the cost also depends on the number of time series created by the dimensions resulting from your query. | 
|Activity Log alert|Activity logs provide auditing of all actions that occurred on resources. Use activity log alerts to be alerted when a specific event happens to a resource, for example, a restart, a shutdown, or the creation or deletion of a resource.|For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/monitor/).|
|Prometheus alerts (preview)| Prometheus alerts are primarily used for alerting on performance and health of Kubernetes clusters (including AKS). The alert rules are based on PromQL, which is an open source query language. | There is no charge for Prometheus alerts during the preview period. |
## Metric alerts

A metric alert rule monitors a resource by evaluating conditions on the resource metrics at regular intervals. If the conditions are met, an alert is fired. A metric time-series is a series of metric values captured over a period of time.

You can create rules using these metrics:
- [Platform metrics](alerts-metric-near-real-time.md#metrics-and-dimensions-supported)
- [Custom metrics](../essentials/metrics-custom-overview.md)
- [Application Insights custom metrics](../app/api-custom-events-metrics.md)
- [Selected logs from a Log Analytics workspace converted to metrics](alerts-metric-logs.md)

Metric alert rules include these features:
- You can use multiple conditions on an alert rule for a single resource.
- You can add granularity by [monitoring multiple metric dimensions](#narrow-the-target-using-dimensions). 
- You can use [Dynamic thresholds](#dynamic-thresholds) driven by machine learning. 
- You can configure if metric alerts are [stateful or stateless](alerts-overview.md#alerts-and-state). Metric alerts are stateful by default.

The target of the metric alert rule can be:
- A single resource, such as a VM. See [this article](alerts-metric-near-real-time.md) for supported resource types.
- [Multiple resources](#monitor-multiple-resources) of the same type in the same Azure region, such as a resource group.

### Multiple conditions

When you create an alert rule for a single resource, you can apply multiple conditions. For example, you could create an alert rule to monitor an Azure virtual machine and alert when both "Percentage CPU is higher than 90%" and "Queue length is over 300 items". When an alert rule has multiple conditions, the alert fires when all the conditions in the alert rule are true and is resolved when at least one of the conditions is no longer true for three consecutive checks.
### Narrow the target using Dimensions

Dimensions are name-value pairs that contain more data about the metric value. Using dimensions allows you to filter the metrics and monitor specific time-series, instead of monitoring the aggregate of all the dimensional values. 
For example, the Transactions metric of a storage account can have an API name dimension that contains the name of the API called by each transaction (for example, GetBlob, DeleteBlob, PutPage). You can choose to have an alert fired when there's a high number of transactions in any API name (which is the aggregated data), or you can use dimensions to further break it down to alert only when the number of transactions is high for specific API names.
If you use more than one dimension, the metric alert rule can monitor multiple dimension values from different dimensions of a metric. 
The alert rule separately monitors all the dimensions value combinations.
See [this article](alerts-metric-multiple-time-series-single-rule.md) for detailed instructions on using dimensions in metric alert rules.

### Create resource-centric alerts using splitting by dimensions

To monitor for the same condition on multiple Azure resources, you can use splitting by dimensions. Splitting by dimensions allows you to create resource-centric alerts at scale for a subscription or resource group.  Alerts are split into separate alerts by grouping combinations. Splitting on Azure resource ID column makes the specified resource into the alert target.

You may also decide not to split when you want a condition applied to multiple resources in the scope. For example, if you want to fire an alert if at least five machines in the resource group scope have CPU usage over 80%.

### Monitor multiple resources

You can monitor at scale by applying the same metric alert rule to multiple resources of the same type for resources that exist in the same Azure region. Individual notifications are sent for each monitored resource.

The platform metrics for these services in the following Azure clouds are supported:

| Service                      | Global Azure | Government | China   |
|:-----------------------------|:-------------|:-----------|:--------|
| Virtual machines*            | Yes      |Yes     | Yes |
| SQL server databases         | Yes      | Yes    | Yes |
| SQL server elastic pools     | Yes      | Yes    | Yes |
| NetApp files capacity pools  | Yes      | Yes    | Yes |
| NetApp files volumes         | Yes      | Yes    | Yes |
| Key vaults                   | Yes      | Yes    | Yes |
| Azure Cache for Redis        | Yes      | Yes    | Yes |
| Azure Stack Edge devices     | Yes      | Yes    | Yes |
| Recovery Services vaults     | Yes      | No     | No  |
| Azure Database for PostgreSQL - Flexible Servers     | Yes      | Yes    | Yes |

  > [!NOTE]
  > Multi-resource metric alerts are not supported for the following scenarios:
  > - Alerting on virtual machines' guest metrics
  > - Alerting on virtual machines' network metrics (Network In Total, Network Out Total, Inbound Flows, Outbound Flows, Inbound Flows Maximum Creation Rate, Outbound Flows Maximum Creation Rate).

You can specify the scope of monitoring with a single metric alert rule in one of three ways. For example, with virtual machines you can specify the scope as:  

- a list of virtual machines (in one Azure region) within a subscription
- all virtual machines (in one Azure region) in one or more resource groups in a subscription
- all virtual machines (in one Azure region) in a subscription

### Dynamic thresholds

Dynamic thresholds use advanced machine learning (ML) to:
- Learn the historical behavior of metrics
- Identify patterns and adapt to metric changes over time, such as hourly, daily or weekly patterns. 
- Recognize anomalies that indicate possible service issues
- Calculate the most appropriate threshold for the metric 

Machine Learning continuously uses new data to learn more and make the threshold more accurate. Because the system adapts to the metrics’ behavior over time, and alerts based on deviations from its pattern, you don't have to know the "right" threshold for each metric. 

Dynamic thresholds help you:
- Create scalable alerts for hundreds of metric series with one alert rule. If you have fewer alert rules, you spend less time creating and managing alerts rules.
- Create rules without having to know what threshold to configure
- Configure up metric alerts using high-level concepts without extensive domain knowledge about the metric
- Prevent noisy (low precision) or wide (low recall) thresholds that don’t have an expected pattern
- Handle noisy metrics (such as machine CPU or memory) and metrics with low dispersion (such as availability and error rate).

See [this article](alerts-dynamic-thresholds.md) for detailed instructions on using dynamic thresholds in metric alert rules.

## Log alerts

A log alert rule monitors a resource by using a Log Analytics query to evaluate resource logs at a set frequency. If the conditions are met, an alert is fired. Because you can use Log Analytics queries, you can perform advanced logic operations on your data and use the robust KQL features to manipulate log data.

The target of the log alert rule can be:
- A single resource, such as a VM. 
- Multiple resources of the same type in the same Azure region, such as a resource group. This is currently available for selected resource types.
- Multiple resources using [cross-resource query](../logs/cross-workspace-query.md#querying-across-log-analytics-workspaces-and-from-application-insights). 

Log alerts can measure two different things, which can be used for different monitoring scenarios:
- Table rows: The number of rows returned can be used to work with events such as Windows event logs, syslog, application exceptions.
- Calculation of a numeric column: Calculations based on any numeric column can be used to include any number of resources. For example, CPU percentage.

You can configure if log alerts are [stateful or stateless](alerts-overview.md#alerts-and-state) (currently in preview).

> [!NOTE]
> Log alerts work best when you are trying to detect specific data in the logs, as opposed to when you are trying to detect a **lack** of data in the logs. Since logs are semi-structured data, they are inherently more latent than metric data on information like a VM heartbeat. To avoid misfires when you are trying to detect a lack of data in the logs, consider using [metric alerts](#metric-alerts). You can send data to the metric store from logs using [metric alerts for logs](alerts-metric-logs.md).

### Dimensions in log alert rules

You can use dimensions when creating log alert rules to monitor the values of multiple instances of a resource with one rule. For example, you can monitor CPU usage on multiple instances running your website or app. Each instance is monitored individually notifications are sent for each instance.

### Splitting by dimensions in log alert rules

To monitor for the same condition on multiple Azure resources, you can use splitting by dimensions. Splitting by dimensions allows you to create resource-centric alerts at scale for a subscription or resource group.  Alerts are split into separate alerts by grouping combinations using numerical or string columns. Splitting on the Azure resource ID column makes the specified resource into the alert target.
You may also decide not to split when you want a condition applied to multiple resources in the scope. For example, if you want to fire an alert if at least five machines in the resource group scope have CPU usage over 80%.

### Using the API

Manage new rules in your workspaces using the [ScheduledQueryRules](/rest/api/monitor/scheduledqueryrule-2021-08-01/scheduled-query-rules) API. 

> [!NOTE]
> Log alerts for Log Analytics used to be managed using the legacy [Log Analytics Alert API](api-alerts.md). Learn more about [switching to the current ScheduledQueryRules API](alerts-log-api-switch.md).
## Log alerts on your Azure bill

Log Alerts are listed under resource provider microsoft.insights/scheduledqueryrules with:
- Log Alerts on Application Insights shown with exact resource name along with resource group and alert properties.
- Log Alerts on Log Analytics shown with exact resource name along with resource group and alert properties; when created using scheduledQueryRules API.
- Log alerts created from [legacy Log Analytics API](./api-alerts.md) aren't tracked [Azure Resources](../../azure-resource-manager/management/overview.md) and don't have enforced unique resource names. These alerts are still created on `microsoft.insights/scheduledqueryrules` as hidden resources, which have this resource naming structure `<WorkspaceName>|<savedSearchId>|<scheduleId>|<ActionId>`. Log Alerts on legacy API are shown with above hidden resource name along with resource group and alert properties.

> [!Note]
> Unsupported resource characters such as <, >, %, &, \, ?, / are replaced with _ in the hidden resource names and this will also reflect in the billing information.
## Activity log alerts

An activity log alert monitors a resource by checking the activity logs for a new activity log event that matches the defined conditions. 

You may want to use activity log alerts for these types of scenarios: 
- When a specific operation occurs on resources in a specific resource group or subscription. For example, you may want to be notified when:
    - Any virtual machine in a production resource group is deleted. 
    - Any new roles are assigned to a user in your subscription.
- A service health event occurs. Service health events include notifications of incidents and maintenance events that apply to resources in your subscription.

You can create an activity log alert on:
- Any of the activity log [event categories](../essentials/activity-log-schema.md), other than on alert events. 
- Any activity log event in top-level property in the JSON object.

Activity log alert rules are Azure resources, so they can be created by using an Azure Resource Manager template. They also can be created, updated, or deleted in the Azure portal. 

An activity log alert only monitors events in the subscription in which the alert is created.

## Smart Detection alerts

After setting up Application Insights for your project, when your app generates a certain minimum amount of data, Smart Detection takes 24 hours to learn the normal behavior of your app. Your app's performance has a typical pattern of behavior. Some requests or dependency calls will be more prone to failure than others; and the overall failure rate may go up as load increases. Smart Detection uses machine learning to find these anomalies. Smart Detection monitors the data received from your app, and in particular the failure rates. Application Insights automatically alerts you in near real time if your web app experiences an abnormal rise in the rate of failed requests.

As data comes into Application Insights from your web app, Smart Detection compares the current behavior with the patterns seen over the past few days. If there's an abnormal rise in failure rate compared to previous performance, an analysis is triggered. To help you triage and diagnose the problem, an analysis of the characteristics of the failures and related application data is provided in the alert details. There are also links to the Application Insights portal for further diagnosis. The feature needs no set-up nor configuration, as it uses machine learning algorithms to predict the normal failure rate.

While metric alerts tell you there might be a problem, Smart Detection starts the diagnostic work for you, performing much of the analysis you would otherwise have to do yourself. You get the results neatly packaged, helping you to get quickly to the root of the problem.

Smart detection works for web apps hosted in the cloud or on your own servers that generate application requests or dependency data.

## Prometheus alerts (preview)

Prometheus alerts are based on metric values stored in [Azure Monitor managed services for Prometheus](../essentials/prometheus-metrics-overview.md). They fire when the results of a PromQL query resolves to true. Prometheus alerts are displayed and managed like other alert types when they fire, but they are configured with a Prometheus rule group. See [Rule groups in Azure Monitor managed service for Prometheus](../essentials/prometheus-rule-groups.md) for details.

## Next steps
- Get an [overview of alerts](alerts-overview.md).
- [Create an alert rule](alerts-log.md).
- Learn more about [Smart Detection](proactive-failure-diagnostics.md).
