---
title: Troubleshooting Azure metric alerts
description: Common issues with Azure Monitor metric alerts and possible solutions. 
author: harelbr
ms.author: harelbr
ms.topic: troubleshooting
ms.date: 04/12/2021
---
# Troubleshooting problems in Azure Monitor metric alerts 

This article discusses common problems in Azure Monitor [metric alerts](alerts-metric-overview.md) and how to troubleshoot them.

Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. They allow you to identify and address issues before the users of your system notice them. For more information on alerting, see [Overview of alerts in Microsoft Azure](./alerts-overview.md).

## Metric alert should have fired but didn't 

If you believe a metric alert should have fired but it didn’t fire and isn't found in the Azure portal, try the following steps:

1. **Configuration** - Review the metric alert rule configuration to make sure it’s properly configured:
    - Check that the **Aggregation type** and **Aggregation granularity (period)** are configured as expected. **Aggregation type** determines how metric values are aggregated (learn more [here](../essentials/metrics-aggregation-explained.md#aggregation-types)), and **Aggregation granularity (period)** controls how far back the evaluation aggregates the metric values each time the alert rule runs.
    -  Check that the **Threshold value** or **Sensitivity** are configured as expected.
    - For an alert rule that uses Dynamic Thresholds, check if advanced settings are configured, as **Number of violations** may filter alerts and **Ignore data before** can impact how the thresholds are calculated.

       > [!NOTE] 
       > Dynamic Thresholds require at least 3 days and 30 metric samples before becoming active.

2. **Fired but no notification** - Review the [fired alerts list](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/alertsV2) to see if you can locate the fired alert. If you can see the alert in the list, but have an issue with some of its actions or notifications, see more information [here](./alerts-troubleshoot.md#action-or-notification-on-my-alert-did-not-work-as-expected).

3. **Already active** -  Check if there’s already a fired alert on the metric time series you expected to get an alert for. Metric alerts are stateful, meaning that once an alert is fired on a specific metric time series, additional alerts on that time series will not be fired until the issue is no longer observed. This design choice reduces noise. The alert is resolved automatically when the alert condition is not met for three consecutive evaluations.

4. **Dimensions used** - If you've selected some [dimension values for a metric](./alerts-metric-overview.md#using-dimensions), the alert rule monitors each individual metric time series (as defined by the combination of dimension values) for a threshold breach. To also monitor the aggregate metric time series (without any dimensions selected), configure an additional alert rule on the metric without selecting dimensions.

5. **Aggregation and time granularity** - If you're visualizing the metric using [metrics charts](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/metrics), ensure that:
    * The selected **Aggregation** in the metric chart is the same as **Aggregation type** in your alert rule
    * The selected **Time granularity** is the same as the **Aggregation granularity (period)** in your alert rule (and not set to 'Automatic')

## Metric alert fired when it shouldn't have

If you believe your metric alert shouldn't have fired but it did, the following steps might help resolve the issue.

1. Review the [fired alerts list](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/alertsV2) to locate the fired alert, and click to view its details. Review the information provided under **Why did this alert fire?** to see the metric chart, **Metric Value**, and **Threshold value** at the time when the alert was triggered.

    > [!NOTE] 
    > If you're using a Dynamic Thresholds condition type and think that the thresholds used were not correct, please provide feedback using the frown icon. This feedback will impact the machine learning algorithmic research and help improve future detections.

2. If you've selected multiple dimension values for a metric, the alert will be triggered when **any** of the metric time series (as defined by the combination of dimension values) breaches the threshold. For more information about using dimensions in metric alerts, see [here](./alerts-metric-overview.md#using-dimensions).

3. Review the alert rule configuration to make sure it’s properly configured:
    - Check that the **Aggregation type**, **Aggregation granularity (period)**, and **Threshold value** or **Sensitivity** are configured as expected
    - For an alert rule that uses Dynamic Thresholds, check if advanced settings are configured, as **Number of violations** may filter alerts and **Ignore data before** can impact how the thresholds are calculated

   > [!NOTE]
   > Dynamic Thresholds require at least 3 days and 30 metric samples before becoming active.

4. If you're visualizing the metric using [Metrics chart](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/metrics), ensure that:
    - The selected **Aggregation** in the metric chart is the same as **Aggregation type** in your alert rule
    - The selected **Time granularity** is the same as the **Aggregation granularity (period)** in your alert rule (and not set to 'Automatic')

5. If the alert fired while there are already fired alerts that monitor the same criteria (that aren’t resolved), check if the alert rule has been configured with the *autoMitigate* property set to **false** (this property can only be configured via REST/PowerShell/CLI, so check the script used to deploy the alert rule). In such case, the alert rule does not autoresolve fired alerts, and does not require a fired alert to be resolved before firing again.


## Can't find the metric to alert on - virtual machines guest metrics

To alert on guest operating system metrics of virtual machines (for example: memory, disk space), ensure you've installed the required agent to collect this data to Azure Monitor Metrics:
- [For Windows VMs](../essentials/collect-custom-metrics-guestos-resource-manager-vm.md)
- [For Linux VMs](../essentials/collect-custom-metrics-linux-telegraf.md)

For more information about collecting data from the guest operating system of a virtual machine, see [here](../vm/monitor-vm-azure.md#guest-operating-system).

> [!NOTE] 
> If you configured guest metrics to be sent to a Log Analytics workspace, the metrics appear under the Log Analytics workspace resource and will start showing data **only** after creating an alert rule that monitors them. To do so, follow the steps to [configure a metric alert for logs](./alerts-metric-logs.md#configuring-metric-alert-for-logs).

> [!NOTE] 
> Monitoring a guest metric for multiple virtual machines with a single alert rule isn't supported by metric alerts currently. You can achieve this with a [log alert rule](./alerts-unified-log.md). To do so, make sure the guest metrics are collected to a Log Analytics workspace, and create a log alert rule on the workspace.

## Can’t find the metric to alert on

If you’re looking to alert on a specific metric but can’t see it when creating an alert rule, check the following:
- If you can't see any metrics for the resource, [check if the resource type is supported for metric alerts](./alerts-metric-near-real-time.md).
- If you can see some metrics for the resource, but can’t find a specific metric, [check if that metric is available](../essentials/metrics-supported.md), and if so, see the metric description to check if it’s only available in specific versions or editions of the resource.
- If the metric isn't available for the resource, it might be available in the resource logs, and can be monitored using log alerts. See here for more information on how to [collect and analyze resource logs from an Azure resource](../essentials/tutorial-resource-logs.md).

## Can’t find the metric dimension to alert on

If you're looking to alert on [specific dimension values of a metric](./alerts-metric-overview.md#using-dimensions), but cannot find these values, note the following:

1. It might take a few minutes for the dimension values to appear under the **Dimension values** list
2. The displayed dimension values are based on metric data collected in the last day
3. If the dimension value isn’t yet emitted or isn't shown, you can use the 'Add custom value' option to add a custom dimension value
4. If you’d like to alert on all possible values of a dimension (including future values), choose the 'Select all current and future values' option
5. Custom metrics dimensions of Application Insights resources are turned off by default. To turn on the collection of dimensions for these custom metrics, see [here](../app/pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation).

## Metric alert rules still defined on a deleted resource 

When deleting an Azure resource, associated metric alert rules aren't deleted automatically. To delete alert rules associated with a resource that has been deleted:

1. Open the resource group in which the deleted resource was defined
1. In the list displaying the resources, check the **Show hidden types** checkbox
1. Filter the list by Type == **microsoft.insights/metricalerts**
1. Select the relevant alert rules and select **Delete**

## Make metric alerts occur every time my condition is met

Metric alerts are stateful by default, and therefore additional alerts are not fired if there’s already a fired alert on a given time series. If you wish to make a specific metric alert rule stateless, and get alerted on every evaluation in which the alert condition is met, create the alert rule programmatically (for example, via [Resource Manager](./alerts-metric-create-templates.md), [PowerShell](/powershell/module/az.monitor/), [REST](/rest/api/monitor/metricalerts/createorupdate), [CLI](/cli/azure/monitor/metrics/alert)), and set the *autoMitigate* property to 'False'.

> [!NOTE] 
> Making a metric alert rule stateless prevents fired alerts from becoming resolved, so even after the condition isn’t met anymore, the fired alerts will remain in a fired state until the 30 days retention period.

## Define an alert rule on a custom metric that isn't emitted yet

When creating a metric alert rule, the metric name is validated against the [Metric Definitions API](/rest/api/monitor/metricdefinitions/list) to make sure it exists. In some cases, you'd like to create an alert rule on a custom metric even before it’s emitted. For example, when creating (using a Resource Manager template) an Application Insights resource that will emit a custom metric, along with an alert rule that monitors that metric.

To avoid having the deployment fail when trying to validate the custom metric’s definitions, you can use the *skipMetricValidation* parameter in the criteria section of the alert rule, which will cause the metric validation to be skipped. See the example below for how to use this parameter in a Resource Manager template. For more information, see the [complete Resource Manager template samples for creating metric alert rules](./alerts-metric-create-templates.md).

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

## Export the Azure Resource Manager template of a metric alert rule via the Azure portal

Exporting the Resource Manager template of a metric alert rule helps you understand its JSON syntax and properties, and can be used to automate future deployments.
1. In the Azure portal, open the alert rule to view its details.
2. Click **Properties**.
3. Under **Automation**, select **Export template**.

## Metric alert rules quota too small

The allowed number of metric alert rules per subscription is subject to [quota limits](../service-limits.md).

If you've reached the quota limit, the following steps may help resolve the issue:
1. Try deleting or disabling metric alert rules that aren’t used anymore.

2. Switch to using metric alert rules that monitor multiple resources. With this capability, a single alert rule can monitor multiple resources using only one alert rule counted against the quota. For more information about this capability and the supported resource types, see [here](./alerts-metric-overview.md#monitoring-at-scale-using-metric-alerts-in-azure-monitor).

3. If you need the quota limit to be increased, open a support request, and provide the following information:

    - Subscription Id(s) for which the quota limit needs to be increased
    - Resource type for the quota increase: **Metric alerts** or **Metric alerts (Classic)**
    - Requested quota limit

## Check total number of metric alert rules

To check the current usage of metric alert rules, follow the steps below.

### From the Azure portal

1. Open the **Alerts** screen, and click **Manage alert rules**
2. Filter to the relevant subscription, by using the **Subscription** dropdown control
3. Make sure NOT to filter to a specific resource group, resource type, or resource
4. In the **Signal type** dropdown control, select **Metrics**
5. Verify that the **Status** dropdown control is set to **Enabled**
6. The total number of metric alert rules are displayed above the alert rules list

### From API

- PowerShell - [Get-AzMetricAlertRuleV2](/powershell/module/az.monitor/get-azmetricalertrulev2)
- REST API - [List by subscription](/rest/api/monitor/metricalerts/listbysubscription)
- Azure CLI - [az monitor metrics alert list](/cli/azure/monitor/metrics/alert#az_monitor_metrics_alert_list)

## Managing alert rules using Resource Manager templates, REST API, PowerShell, or Azure CLI

If you're running into issues creating, updating, retrieving, or deleting metric alerts using Resource Manager templates, REST API, PowerShell, or the Azure command-line interface (CLI), the following steps may help resolve the issue.

### Resource Manager templates

- Review [common Azure deployment errors](../../azure-resource-manager/templates/common-deployment-errors.md) list and troubleshoot accordingly
- Refer to the [metric alerts Azure Resource Manager template examples](./alerts-metric-create-templates.md) to ensure you're passing the all the parameters correctly

### REST API

Review the [REST API guide](/rest/api/monitor/metricalerts/) to verify you're passing the all the parameters correctly

### PowerShell

Make sure that you're using the right PowerShell cmdlets for metric alerts:

- PowerShell cmdlets for metric alerts are available in the [Az.Monitor module](/powershell/module/az.monitor/)
- Make sure to use the cmdlets ending with 'V2' for new (non-classic) metric alerts (for example, [Add-AzMetricAlertRuleV2](/powershell/module/az.monitor/add-azmetricalertrulev2))

### Azure CLI

Make sure that you're using the right CLI commands for metric alerts:

- CLI commands for metric alerts start with `az monitor metrics alert`. Review the [Azure CLI reference](/cli/azure/monitor/metrics/alert) to learn about the syntax.
- You can see [sample showing how to use metric alert CLI](./alerts-metric.md#with-azure-cli)
- To alert on a custom metric, make sure to prefix the metric name with the relevant metric namespace: NAMESPACE.METRIC

### General

- If you're receiving a `Metric not found` error:

   - For a platform metric: Make sure that you're using the **Metric** name from [the Azure Monitor supported metrics page](../essentials/metrics-supported.md), and not the **Metric Display Name**

   - For a custom metric: Make sure that the metric is already being emitted (you cannot create an alert rule on a custom metric that doesn't yet exist), and that you're providing the custom metric's namespace (see a Resource Manager template example [here](./alerts-metric-create-templates.md#template-for-a-static-threshold-metric-alert-that-monitors-a-custom-metric))

- If you're creating [metric alerts on logs](./alerts-metric-logs.md), ensure appropriate dependencies are included. See [sample template](./alerts-metric-logs.md#resource-template-for-metric-alerts-for-logs).

- If you're creating an alert rule that contains multiple criteria, note the following constraints:

   - You can only select one value per dimension within each criterion
   - You cannot use "\*" as a dimension value
   - When metrics that are configured in different criterions support the same dimension, then a configured dimension value must be explicitly set in the same way for all of those metrics (see a Resource Manager  template example [here](./alerts-metric-create-templates.md#template-for-a-static-threshold-metric-alert-that-monitors-multiple-criteria))


## No permissions to create metric alert rules

To create a metric alert rule, you’ll need to have the following permissions:

- Read permission on the target resource of the alert rule
- Write permission on the resource group in which the alert rule is created (if you’re creating the alert rule from the Azure portal, the alert rule is created by default in the same resource group in which the target resource resides)
- Read permission on any action group associated to the alert rule (if applicable)


## Naming restrictions for metric alert rules

Consider the following restrictions for metric alert rule names:

- Metric alert rule names can’t be changed (renamed) once created
- Metric alert rule names must be unique within a resource group
- Metric alert rule names can’t contain the following characters: * # & + : < > ? @ % { } \ / 
- Metric alert rule names can’t end with a space or a period

> [!NOTE] 
> If the alert rule name contains characters that aren't alphabetic or numeric (for example: spaces, punctuation marks or symbols), these characters may be URL-encoded when retrieved by certain clients.

## Restrictions when using dimensions in a metric alert rule with multiple conditions

Metric alerts support alerting on multi-dimensional metrics as well as support defining multiple conditions (up to 5 conditions per alert rule).

Consider the following constraints when using dimensions in an alert rule that contains multiple conditions:
- You can only select one value per dimension within each condition.
- You can't use the option to "Select all current and future values" (Select \*).
- When metrics that are configured in different conditions support the same dimension, then a configured dimension value must be explicitly set in the same way for all of those metrics (in the relevant conditions).
For example:
    - Consider a metric alert rule that is defined on a storage account and monitors two conditions:
        * Total **Transactions** > 5
        * Average **SuccessE2ELatency** > 250 ms
    - I'd like to update the first condition, and only monitor transactions where the **ApiName** dimension equals *"GetBlob"*
    - Because both the **Transactions** and **SuccessE2ELatency** metrics support an **ApiName** dimension, I'll need to update both conditions, and have both of them specify the **ApiName** dimension with a *"GetBlob"* value.

## Setting the alert rule's Period and Frequency

We recommend choosing an *Aggregation granularity (Period)* that is larger than the *Frequency of evaluation*, to reduce the likelihood of missing the first evaluation of added time series in the following cases:
-	Metric alert rule that monitors multiple dimensions – When a new dimension value combination is added
-	Metric alert rule that monitors multiple resources – When a new resource is added to the scope
-	Metric alert rule that monitors a metric that isn’t emitted continuously (sparse metric) –  When the metric is emitted after a period longer than 24 hours in which it wasn’t emitted

## The Dynamic Thresholds borders don't seem to fit the data

If the behavior of a metric changed recently, the changes won't necessarily become reflected in the Dynamic Threshold borders (upper and lower bounds) immediately, as those are calculated based on metric data from the last 10 days. When viewing the Dynamic Threshold borders for a given metric, make sure to look at the metric trend in the last week, and not only for recent hours or days.

## Why is weekly seasonality not detected by Dynamic Thresholds?

To identify weekly seasonality, the Dynamic Thresholds model requires at least three weeks of historical data. Once enough historical data is available, any weekly seasonality that exists in the metric data will be identified and the model would be adjusted accordingly. 

## Dynamic Thresholds shows a negative lower bound for a metric even though the metric always has positive values

When a metric exhibits large fluctuation, Dynamic Thresholds will build a wider model around the metric values, which can result in the lower border being below zero. Specifically, this can happen in the following cases:
1. The sensitivity is set to low 
2. The median values are close to zero
3. The metric exhibits an irregular behavior with high variance (there are spikes or dips in the data)

When the lower bound has a negative value, this means that it's plausible for the metric to reach a zero value given the metric's irregular behavior. You may consider choosing a higher sensitivity or a larger *Aggregation granularity (Period)* to make the model less sensitive, or using the *Ignore data before* option to exclude a recent irregulaity from the historical data used to build the model.

## Next steps

- For general troubleshooting information about alerts and notifications, see [Troubleshooting problems in Azure Monitor alerts](alerts-troubleshoot.md).
