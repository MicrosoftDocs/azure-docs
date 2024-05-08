---
title: Troubleshoot Azure Monitor metric alerts
description: Common issues with Azure Monitor metric alerts and possible solutions. 
ms.author: abbyweisberg
ms.topic: troubleshooting
ms.date: 02/28/2024
ms:reviewer: harelbr
---

# Troubleshoot Azure Monitor metric alerts

This article discusses common questions about Azure Monitor [metric alerts](alerts-types.md#metric-alerts) and how to troubleshoot them.

Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. They allow you to identify and address issues before the users of your system notice them. For more information on alerting, see [Overview of alerts in Microsoft Azure](./alerts-overview.md).

## Metric alert didn't fire when it should have

If you believe a metric alert should have fired but it didn't, and it isn't listed in the Azure portal, try the following steps:

1. **Review the metric alert rule configuration.**

    - Check that **Aggregation type** and **Aggregation granularity (Period)** are configured as expected. **Aggregation type** determines how metric values are aggregated. To learn more, see [Azure Monitor Metrics aggregation and display explained](../essentials/metrics-aggregation-explained.md#aggregation-types). **Aggregation granularity (Period)** controls how far back the evaluation aggregates the metric values each time the alert rule runs. 
    - Check that **Threshold value** or **Sensitivity** are configured as expected.
    - For an alert rule that uses Dynamic Thresholds, check if advanced settings are configured. **Number of violations** might filter alerts, and **Ignore data before** can affect how the thresholds are calculated.
    
        > [!NOTE]
        > Dynamic thresholds require at least 3 days and 30 metric samples before they become active.
    
1. **Check if the alert fired but didn't send the notification.**

    Review the [fired alerts list](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/alertsV2) to see if you can locate the fired alert. If you can see the alert in the list but have an issue with some of its actions or notifications, see [Troubleshooting problems in Azure Monitor alerts](./alerts-troubleshoot.md).

1. **Check if the alert is already active.**

    Check if there's already a fired alert on the metric time series for which you expected to get an alert. Metric alerts are stateful, which means that once an alert is fired on a specific metric time series, more alerts on that time series won't be fired until the issue is no longer observed. This design choice reduces noise. The alert is resolved automatically when the alert condition isn't met for three consecutive evaluations.

1. **Check the dimensions used.**

    If you've selected some [dimension values for a metric](./alerts-metric-overview.md#using-dimensions), the alert rule monitors each individual metric time series (as defined by the combination of dimension values) for a threshold breach. To also monitor the aggregate metric time series, without any dimensions selected, configure another alert rule on the metric without selecting dimensions.

1. **Check the aggregation and time granularity.**

    If you're using [metrics charts](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/metrics), ensure that:
    - The selected **Aggregation** in the metric chart is the same as **Aggregation type** in your alert rule.
    - The selected **Time granularity** is the same as **Aggregation granularity (Period)** in your alert rule, and isn't set to **Automatic**.

1. **Check if the alert rule is missing the first evaluation period in a time series.**

    You can reduce the likelihood of missing the first evaluation of added time series by making sure that you choose an **Aggregation granularity (Period)** that's larger than the **Frequency of evaluation**  in the following cases:

    - When a new dimension value combination is added to a metric alert rule that monitors multiple dimensions.
    - When a new resource is added to the scope to a metric alert rule that monitors multiple resources.
    - When the metric is emitted after a period longer than 24 hours in which it wasn't emitted for metric alert rule that monitors a metric that isn't emitted continuously (sparse metric).

## The metric alert is not triggered every time the condition is met

Metric alerts are stateful by default, so other alerts aren't fired if there's already a fired alert on a specific time series. To make a specific metric alert rule stateless and get alerted on every evaluation in which the alert condition is met, use one of these options:

- If you create the alert rule programmatically, for example, via [Azure Resource Manager](./alerts-metric-create-templates.md), [PowerShell](/powershell/module/az.monitor/), [REST](/rest/api/monitor/metricalerts/createorupdate), or the [Azure CLI](/cli/azure/monitor/metrics/alert), set the `autoMitigate` property to `False`.
- If you create the alert rule in the Azure portal, clear the **Automatically resolve alerts** option under the **Alert rule details** section.
The frequency of notifications for stateless metric alerts differs based on the alert rule's configured frequency:

- **Alert frequency of less than 5 minutes**: While the condition continues to be met, a notification is sent somewhere between one and six minutes.
- **Alert frequency of more than 5 minutes**: While the condition continues to be met, a notification is sent between the configured frequency and double the frequency. For example, for an alert rule with a frequency of 15 minutes, a notification is sent somewhere between 15 to 30 minutes.

> [!NOTE]
> Making a metric alert rule stateless prevents fired alerts from becoming resolved. So, even after the condition isn't met anymore, the fired alerts remain in a fired state until the 30-day retention period.

## A metric alert rule with dynamic threshold doesn't fire enough

You may encounter an alert rule that uses dynamic thresholds doesn't fire or isn't sensitive enough, even though it's configured with high sensitivity. This can happen when the metric's distribution is highly irregular. Consider one of the following solutions to fix the issue:
 - Move to monitoring a complementary metric that's suitable for your scenario, if applicable. For example, check for changes in success rate rather than failure rate.
 - Try selecting a different value for **Aggregation granularity (Period)**.
 - Check if there has been a drastic change in the metric behavior in the last 10 days, such as an outage. An abrupt change can affect the upper and lower thresholds calculated for the metric and make them broader. Wait a few days until the outage is no longer taken into the thresholds calculation. You can also edit the alert rule to use the **Ignore data before** option in the **Advanced settings**.
 - If your data has weekly seasonality, but not enough history is available for the metric, the calculated thresholds can result in having broad upper and lower bounds. For example, the calculation can treat weekdays and weekends in the same way and build wide borders that don't always fit the data. This issue should resolve itself after enough metric history is available. Then, the correct seasonality is detected and the calculated thresholds update accordingly.

## A metric alert fired when it shouldn't have

If you believe your metric alert shouldn't have fired but it did, the following steps might help resolve the issue.

1. Review the [fired alerts list](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/alertsV2) to locate the fired alert. Select the alert to view its details. Review the information provided under **Why did this alert fire?** to see the metric chart, **Metric value**, and **Threshold value** at the time when the alert was triggered.

    > [!NOTE]
    > If you're using dynamic thresholds, and think that the thresholds weren't correct, provide feedback by using the frown icon. This feedback affects the machine learning algorithmic research and will help improve future detections.

1. If you've selected multiple dimension values for a metric, the alert is triggered when *any* of the metric time series (as defined by the combination of dimension values) breaches the threshold. For more information about using dimensions in metric alerts, see [Narrow the target using dimensions](./alerts-types.md#narrow-the-target-using-dimensions).

1. Review the alert rule configuration to make sure it's properly configured:
    - Check that **Aggregation type**, **Aggregation granularity (Period)**, and **Threshold value** or **Sensitivity** are configured as expected.
    - For an alert rule that uses dynamic thresholds, check if advanced settings are configured, as **Number of violations** might filter alerts and **Ignore data before** can affect how the thresholds are calculated.

   > [!NOTE]
   > Dynamic thresholds require at least 3 days and 30 metric samples before becoming active.

1. If you're using [metrics charts](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/metrics), ensure that:

    - The selected **Aggregation** in the metric chart is the same as the **Aggregation type** in your alert rule.
    - The selected **Time granularity** is the same as the **Aggregation granularity (Period)** in your alert rule, and that it isn't set to **Automatic**.

1. If the alert fired while there are already fired alerts that monitor the same criteria that aren't resolved, check if the alert rule has been configured not to automatically resolve alerts. This means the alert rule is stateless, and doesn't auto-resolve fired alerts and doesn't require a fired alert to be resolved before firing again on the same time series.
    To check if the alert rule is configured not to auto-resolve:
    - Edit the alert rule in the Azure portal. See if the **Automatically resolve alerts** checkbox under the **Alert rule details** section is cleared.
    - Review the script used to deploy the alert rule or retrieve the alert rule definition. Check if the `autoMitigate` property is set to `false`.

## A metric alert rule with dynamic thresholds fires too much or is too noisy

If an alert rule that uses dynamic thresholds is too noisy or fires too much, you may need to reduce the sensitivity of your dynamic thresholds alert rule. Use one of the following options:
 - **Threshold sensitivity:** Set the sensitivity to **Low** to be more tolerant for deviations.
 - **Number of violations (under Advanced settings):** Configure the alert rule to trigger only if several deviations occur within a certain period of time. This setting makes the rule less susceptible to transient deviations.

## A metric alert rule with dynamic thresholds is showing values that aren't within the range of expected values 

When a metric value exhibits large fluctuations, dynamic thresholds may build a wide model around the metric values, which can result in a lower or higher boundary than expected. This scenario can happen when:
 - The sensitivity is set to low.
 - The metric exhibits an irregular behavior with high variance, which appears as spikes or dips in the data.

    Consider making the model less sensitive by choosing a higher sensitivity or selecting a larger **Lookback period**. You can also use the **Ignore data before** option to exclude a recent irregularity from the historical data used to build the model.

## Issues configuring metric alert rules

### Can't find the metric to alert on

If you want to alert on a specific metric but you can't see it when you create an alert rule, check to determine:

- If you can't see any metrics for the resource, [check if the resource type is supported for metric alerts](./alerts-metric-near-real-time.md).
- If you can see some metrics for the resource but can't find a specific metric, [check if that metric is available](/azure/azure-monitor/reference/supported-metrics/metrics-index). If so, see the metric description to check if it's only available in specific versions or editions of the resource.
- If the metric isn't available for the resource, it might be available in the resource logs and can be monitored by using log alerts. For more information, see how to [collect and analyze resource logs from an Azure resource](../essentials/tutorial-resource-logs.md).

### Can't find the metric to alert on: Virtual machines guest metrics

To alert on guest operating system metrics of virtual machines, such as memory and disk space, ensure you've installed the required agent to collect this data to Azure Monitor Metrics for:

- [Windows VMs](../essentials/collect-custom-metrics-guestos-resource-manager-vm.md)
- [Linux VMs](../essentials/collect-custom-metrics-linux-telegraf.md)

For more information about collecting data from the guest operating system of a virtual machine, see [this website](../vm/monitor-vm-azure.md#guest-operating-system).

> [!NOTE]
> If you configured guest metrics to be sent to a Log Analytics workspace, the metrics appear under the Log Analytics workspace resource and start showing data *only* after you create an alert rule that monitors them. To do so, follow the steps to [configure a metric alert for logs](./alerts-metric-logs.md#configuring-metric-alert-for-logs).

Currently, monitoring a guest metric for multiple virtual machines with a single alert rule isn't supported by metric alerts. But you can use a [log alert rule](./alerts-unified-log.md). To do so, make sure the guest metrics are collected to a Log Analytics workspace and create a log alert rule on the workspace.

### Can't find the metric dimension to alert on

If you want to alert on [specific dimension values of a metric](./alerts-metric-overview.md#using-dimensions) but you can't find these values:

- It might take a few minutes for the dimension values to appear under the **Dimension values** list.
- The displayed dimension values are based on metric data collected in the last day.
- If the dimension value isn't yet emitted or isn't shown, you can use the **Add custom value** option to add a custom dimension value.
- If you want to alert on all possible values of a dimension and even include future values, choose the **Select all current and future values** option.
- Custom metrics dimensions of Application Insights resources are turned off by default. To turn on the collection of dimensions for these custom metrics, see [Log-based and pre-aggregated metrics in Application Insights](../app/pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation).

### You want to configure an alert rule on a custom metric that isn't emitted yet

When you create a metric alert rule, the metric name is validated against the [Metric Definitions API](/rest/api/monitor/metricdefinitions/list) to make sure it exists. In some cases, you want to create an alert rule on a custom metric even before it's emitted. An example is when you use a Resource Manager template to create an Application Insights resource that will emit a custom metric, along with an alert rule that monitors that metric.

To avoid a deployment failure when you try to validate the custom metric's definitions, use the `skipMetricValidation` parameter in the `criteria` section of the alert rule. This parameter causes the metric validation to be skipped. See the following example for how to use this parameter in a Resource Manager template. For more information, see the [complete Resource Manager template samples for creating metric alert rules](./alerts-metric-create-templates.md).

```json
"criteria": {
    "odata.type": "Microsoft.Azure.Monitor.SingleResourceMultipleMetricCriteria",
        "allOf": [
            {
                "name" : "condition1",
                "metricName": "myCustomMetric",
                "metricNamespace": "myCustomMetricNamespace",
                "dimensions":[],
                "operator": "GreaterThan",
                "threshold" : 10,
                "timeAggregation": "Average",
                "skipMetricValidation": true
            }
        ]
    }
```

> [!NOTE]
> Using the `skipMetricValidation` parameter might also be required when you define an alert rule on an existing custom metric that hasn't been emitted in several days.

### Warnings and errors when configuring metric alert rules

#### Dynamic thresholds is currently not available for this metric warning

Dynamic thresholds are supported for most metrics, but not all.
Refer to [Metrics not supported by dynamic thresholds](alerts-dynamic-thresholds.md#metrics-not-supported-by-dynamic-thresholds) for the list of metrics.

#### The metric isn't available for the selected scope. This might happen if the metric only applies to a specific version or SKU error

Review the metric description in [Supported metrics with Azure Monitor](/azure/azure-monitor/reference/supported-metrics/metrics-index) to check if it's only available in specific versions or editions of the resource or this specific type.

For example, in SQL Database resources or Storage file services, there are specific metrics only supported on specific versions of the resource.

#### There are no available signals to display. Try changing the scope of this alert rule error

This error indicates an issue with the alert rule scope. This can happen when editing an alert rule scoped to a resource type that supports multi-resource configuration (like Virtual machine or SQL database), and trying to add another resource of the same type, but from a different region. Alerting on multiple resources of the same type from different regions is not supported in Metric alerts.

## The service limits for metric alert rules is too small

The allowed number of metric alert rules per subscription is subject to [service limits](../service-limits.md).

See [Check the number of metric alert rules in use](alerts-manage-alert-rules.md#check-the-number-of-metric-alert-rules-in-use) to see how many metric alert rules are currently in use.

If you've reached the service limit, the following steps might help resolve the issue:

   1. Try deleting or disabling metric alert rules that aren't used anymore.
   1. Switch to using metric alert rules that monitor multiple resources. With this capability, a single alert rule can monitor multiple resources by using only one alert rule counted against the quota. For more information about this capability and the supported resource types, see [metric-alerts](./alerts-types.md#monitor-the-same-condition-on-multiple-resources-using-splitting-by-dimensions).
   1. If you need the quota limit to be increased, open a support request and provide the:
       - Subscription IDs for which the quota limit needs to be increased.
       - Resource type for the quota increase. Select **Metric alerts**.
       - Requested quota limit.


## Next steps

For general troubleshooting information about alerts and notifications, see [Troubleshooting problems in Azure Monitor alerts](alerts-troubleshoot.md).


