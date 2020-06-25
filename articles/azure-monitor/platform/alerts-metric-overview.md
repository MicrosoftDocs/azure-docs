---
title: Understand how metric alerts work in Azure Monitor.
description: Get an overview of what you can do with metric alerts and how they work in Azure Monitor.
ms.date: 03/17/2020
ms.topic: conceptual
ms.subservice: alerts

---

# Understand how metric alerts work in Azure Monitor

Metric alerts in Azure Monitor work on top of multi-dimensional metrics. These metrics could be [platform metrics](alerts-metric-near-real-time.md#metrics-and-dimensions-supported), [custom metrics](../../azure-monitor/platform/metrics-custom-overview.md), [popular logs from Azure Monitor converted to metrics](../../azure-monitor/platform/alerts-metric-logs.md) and Application Insights metrics. Metric alerts evaluate at regular intervals to check if conditions on one or more metric time-series are true and notify you when the evaluations are met. Metric alerts are stateful, that is, they only send out notifications when the state changes.

## How do metric alerts work?

You can define a metric alert rule by specifying a target resource to be monitored, metric name, condition type (static or dynamic), and the condition (an operator and a threshold/sensitivity) and an action group to be triggered when the alert rule fires. Condition types affect the way thresholds are determined. [Learn more about Dynamic Thresholds condition type and sensitivity options](alerts-dynamic-thresholds.md).

### Alert rule with static condition type

Let's say you have created a simple static threshold metric alert rule as follows:

- Target Resource (the Azure resource you want to monitor): myVM
- Metric: Percentage CPU
- Condition Type: Static
- Time Aggregation (Statistic that is run over raw metric values. [Supported time aggregations](metrics-charts.md#changing-aggregation) are Min, Max, Avg, Total, Count): Average
- Period (The look back window over which metric values are checked): Over the last 5 mins
- Frequency (The frequency with which the metric alert checks if the conditions are met): 1 min
- Operator: Greater Than
- Threshold: 70

From the time the alert rule is created, the monitor runs every 1 min and looks at metric values for the last 5 minutes and checks if the average of those values exceeds 70. If the condition is met that is, the average Percentage CPU for the last 5 minutes exceeds 70, the alert rule fires an activated notification. If you have configured an email or a web hook action in the action group associated with the alert rule, you will receive an activated notification on both.

When you are using multiple conditions in one rule, the rule "ands" the conditions together. That is, an alert fires when all the conditions in the alert rule evaluate as true and resolve when one of the conditions is no longer true. An example for this type of alert rule would be to monitor an Azure virtual machine and alert when both "Percentage CPU is higher than 90%" and "Queue length is over 300 items".

### Alert rule with dynamic condition type

Let's say you have created a simple Dynamic Thresholds metric alert rule as follows:

- Target Resource (the Azure resource you want to monitor): myVM
- Metric: Percentage CPU
- Condition Type: Dynamic
- Time Aggregation (Statistic that is run over raw metric values. [Supported time aggregations](metrics-charts.md#changing-aggregation) are Min, Max, Avg, Total, Count): Average
- Period (The look back window over which metric values are checked): Over the last 5 mins
- Frequency (The frequency with which the metric alert checks if the conditions are met): 1 min
- Operator: Greater Than
- Sensitivity: Medium
- Look Back Periods: 4
- Number of Violations: 4

Once the alert rule is created, the Dynamic Thresholds machine learning algorithm will acquire historical data that is available, calculate threshold that best fits the metric series behavior pattern and will continuously learn based on new data to make the threshold more accurate.

From the time the alert rule is created, the monitor runs every 1 min and looks at metric values in the last 20 minutes grouped into 5 minutes periods and checks if the average of the period values in each of the 4 periods exceeds the expected threshold. If the condition is met that is, the average Percentage CPU in the last 20 minutes (four 5 minutes periods) deviated from expected behavior four times, the alert rule fires an activated notification. If you have configured an email or a web hook action in the action group associated with the alert rule, you will receive an activated notification on both.

### View and resolution of fired alerts

The above examples of alert rules firing can also be viewed in the Azure portal in the **All Alerts** blade.

Say the usage on "myVM" continues being above the threshold in subsequent checks, the alert rule will not fire again until the conditions are resolved.

After some time, the usage on "myVM" comes back down to normal (goes below the threshold). The alert rule monitors the condition for two more times, to send out a resolved notification. The alert rule sends out a resolved/deactivated message when the alert condition is not met for three consecutive periods to reduce noise in case of flapping conditions.

As the resolved notification is sent out via web hooks or email, the status of the alert instance (called monitor state) in Azure portal is also set to resolved.

### Using dimensions

Metric alerts in Azure Monitor also support monitoring multiple dimensions value combinations with one rule. Let's understand why you might use multiple dimension combinations with the help of an example.

Say you have an App Service plan for your website. You want to monitor CPU usage on multiple instances running your web site/app. You can do that using a metric alert rule as follows:

- Target resource: myAppServicePlan
- Metric: Percentage CPU
- Condition Type: Static
- Dimensions
  - Instance = InstanceName1, InstanceName2
- Time Aggregation: Average
- Period: Over the last 5 mins
- Frequency: 1 min
- Operator: GreaterThan
- Threshold: 70

Like before, this rule monitors if the average CPU usage for the last 5 minutes exceeds 70%. However, with the same rule you can monitor two instances running your website. Each instance will get monitored individually and you will get notifications individually.

Say you have a web app that is seeing massive demand and you will need to add more instances. The above rule still monitors just two instances. However, you can create a rule as follows:

- Target resource: myAppServicePlan
- Metric: Percentage CPU
- Condition Type: Static
- Dimensions
  - Instance = *
- Time Aggregation: Average
- Period: Over the last 5 mins
- Frequency: 1 min
- Operator: GreaterThan
- Threshold: 70

This rule will automatically monitor all values for the instance i.e you can monitor your instances as they come up without needing to modify your metric alert rule again.

When monitoring multiple dimensions, Dynamic Thresholds alerts rule can create tailored thresholds for hundreds of metric series at a time. Dynamic Thresholds results in fewer alert rules to manage and significant time saving on management and creation of alerts rules.

Say you have a web app with many instances and you don't know what the most suitable threshold is. The above rules will always use threshold of 70%. However, you can create a rule as follows:

- Target resource: myAppServicePlan
- Metric: Percentage CPU
- Condition Type: Dynamic
- Dimensions
  - Instance = *
- Time Aggregation: Average
- Period: Over the last 5 mins
- Frequency: 1 min
- Operator: GreaterThan
- Sensitivity: Medium
- Look Back Periods: 1
- Number of Violations: 1

This rule monitors if the average CPU usage for the last 5 minutes exceeds the expected behavior for each instance. The same rule you can monitor instances as they come up without needing to modify your metric alert rule again. Each instance will get a threshold that fits the metric series behavior pattern and will continuously change based on new data to make the threshold more accurate. Like before, each instance will be monitored individually and you will get notifications individually.

Increasing look-back periods and number of violations can also allow filtering alerts to only alert on your definition of a significant deviation. [Learn more about Dynamic Thresholds advanced options](alerts-dynamic-thresholds.md#what-do-the-advanced-settings-in-dynamic-thresholds-mean).

## Monitoring at scale using metric alerts in Azure Monitor

So far, you have seen how a single metric alert could be used to monitor one or many metric time-series related to a single Azure resource. Many times, you might want the same alert rule applied to many resources. Azure Monitor also supports monitoring multiple resources (of the same type) with one metric alert rule, for resources that exist in the same Azure region. 

This feature is currently supported for platform metrics (not custom metrics) for the following services in the following Azure clouds:

| Service | Public Azure | Government | China |
|:--------|:--------|:--------|:--------|
| Virtual machines  | **Yes** | No | No |
| SQL server databases | **Yes** | **Yes** | No |
| SQL server elastic pools | **Yes** | **Yes** | No |
| Data box edge devices | **Yes** | **Yes** | No |

You can specify the scope of monitoring by a single metric alert rule in one of three ways. For example, with virtual machines you can specify the scope as:  

- a list of virtual machines in one Azure region within a subscription
- all virtual machines (in one Azure region) in one or more resource groups in a subscription
- all virtual machines (in one Azure region) in one subscription

Creating metric alert rules that monitor multiple resources is like [creating any other metric alert](alerts-metric.md) that monitors a single resource. Only difference is that you would select all the resources you want to monitor. You can also create these rules through [Azure Resource Manager templates](../../azure-monitor/platform/alerts-metric-create-templates.md#template-for-a-metric-alert-that-monitors-multiple-resources). You will receive individual notifications for each monitored resource.

> [!NOTE]
>
> In a metric alert rule that monitors multiple resources, only one condition is allowed.

## Typical latency

For metric alerts, typically you will get notified in under 5 minutes if you set the alert rule frequency to be 1 min. In cases of heavy load for notification systems, you might see a longer latency.

## Supported resource types for metric alerts

You can find the full list of supported resource types in this [article](../../azure-monitor/platform/alerts-metric-near-real-time.md#metrics-and-dimensions-supported).


## Next steps

- [Learn how to create, view, and manage metric alerts in Azure](alerts-metric.md)
- [Learn how to deploy metric alerts using Azure Resource Manager templates](../../azure-monitor/platform/alerts-metric-create-templates.md)
- [Learn more about action groups](action-groups.md)
- [Learn more about Dynamic Thresholds condition type](alerts-dynamic-thresholds.md)
