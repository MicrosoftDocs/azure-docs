---
title: Troubleshooting Azure metric alerts
description: Common issues with Azure Monitor metric alerts and possible solutions. 
author: harelbr
ms.author: harelbr
ms.topic: reference
ms.date: 06/15/2020
ms.subservice: alerts
---
# Troubleshooting problems in Azure Monitor metric alerts 

This article discusses common problems in Azure Monitor [metric alerts](alerts-metric-overview.md) and how to troubleshoot them.

Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. They allow you to identify and address issues before the users of your system notice them. For more information on alerting, see [Overview of alerts in Microsoft Azure](alerts-overview.md).

## Metric alert should have fired but didn't 

If you believe a metric alert should have fired but it didn’t fire and isn't found in the Azure portal, try the following steps:

1. **Configuration** - Review the metric alert rule configuration to make sure it’s properly configured:
	- Check that the **Aggregation type**, **Aggregation granularity (period)**, and **Threshold value** or **Sensitivity** are configured as expected
	- For an alert rule that uses Dynamic Thresholds, check if advanced settings are configured, as **Number of violations** may filter alerts and **Ignore data before** can impact how the thresholds are calculated

	   > [!NOTE] 
	   > Dynamic Thresholds require at least 3 days and 30 metric samples before becoming active.

2. **Fired but no notification** - Review the [fired alerts list](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/alertsV2) to see if you can locate the fired alert. If you can see the alert in the list, but have an issue with some of its actions or notifications, see more information [here](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-troubleshoot#action-or-notification-on-my-alert-did-not-work-as-expected).

3. **Already active** -  Check if there’s already a fired alert on the metric time series you expected to get an alert for. Metric alerts are stateful, meaning that once an alert is fired on a specific metric time series, additional alerts on that time series are not be fired until the issue is no longer observed. This design choice reduces noise. The alert is resolved automatically when the alert condition is not met for three consecutive evaluations.

4. **Dimensions used** - If you have selected some [dimension values for a metric](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-metric-overview#using-dimensions), the alert rule monitors each individual metric time series (as defined by the combination of dimension values) for a threshold breach. To also monitor the aggregate metric time series (without any dimensions selected), configure an additional alert rule on the metric without selecting dimensions.

5. **Aggregation and time granularity** - If you are visualizing the metric using [metrics charts](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/metrics), ensure that:
    * The selected **Aggregation** in the metric chart is the same as **Aggregation type** in your alert rule
    * The selected **Time granularity** is the same as the **Aggregation granularity (period)** in your alert rule (and not set to 'Automatic')

## Metric alert fired when it shouldn't have

If you believe your metric alert shouldn't have fired but it did, the following steps might help resolve the issue.

1. Review the [fired alerts list](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/alertsV2) to locate the fired alert, and click to view its details. Review the information provided under **Why did this alert fire?** to see the metric chart, **Metric Value**, and **Threshold value** at the time when the alert was triggered.

    > [!NOTE] 
	> If you are using a Dynamic Thresholds condition type and think that the thresholds used were not correct, please provide feedback using the frown icon. This feedback will impact the machine learning algorithmic research and help improve future detections.

2. If you have selected multiple dimension values for a metric, the alert will be triggered when **any** of the metric time series (as defined by the combination of dimension values) breaches the threshold. For more information about using dimensions in metric alerts, see [here](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-metric-overview#using-dimensions).

3. Review the alert rule configuration to make sure it’s properly configured:
    - Check that the **Aggregation type**, **Aggregation granularity (period)**, and **Threshold value** or **Sensitivity** are configured as expected
    - For an alert rule that uses Dynamic Thresholds, check if advanced settings are configured, as **Number of violations** may filter alerts and **Ignore data before** can impact how the thresholds are calculated

   > [!NOTE]
   > Dynamic Thresholds require at least 3 days and 30 metric samples before becoming active.

4. If you are visualizing the metric using [Metrics chart](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/metrics), ensure that:
    - The selected **Aggregation** in the metric chart is the same as **Aggregation type** in your alert rule
    - The selected **Time granularity** is the same as the **Aggregation granularity (period)** in your alert rule (and not set to 'Automatic')

5. If the alert fired while there are already fired alerts that monitor the same criteria (that aren’t resolved), check if the alert rule has been configured with the *autoMitigate* property set to **false** (this property can only be configured via REST/PowerShell/CLI, so check the script used to deploy the alert rule). In such case, the alert rule does not autoresolve fired alerts, and does not require a fired alert to be resolved before firing again.


## Can't find metric to alert on - virtual machines 

To alert on guest metrics on virtual machines (for memory, disk space), ensure you have set up diagnostic settings to send data to an Azure Monitor sink:
    * [For Windows VMs](https://docs.microsoft.com/azure/azure-monitor/platform/collect-custom-metrics-guestos-resource-manager-vm)
    * [For Linux VMs](https://docs.microsoft.com/azure/azure-monitor/platform/collect-custom-metrics-linux-telegraf)
	
> [!NOTE] 
> If you configured guest metrics to be sent to a Log Analytics workspace, the metrics appear under the Log Analytics workspace resource and will start showing data **only** after creating an alert rule that monitors them. To do so, follow the steps to [configure a metric alert for logs](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-metric-logs#configuring-metric-alert-for-logs).

## Can’t find the metric to alert on

If you’re looking to alert on a specific metric but can’t see any metrics for the resource, [check if the resource type is supported for metric alerts](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-metric-near-real-time).
If you can see some metrics for the resource but can’t find a specific metric, [check if that metric is available](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported), and if so, see the metric description to see if it’s only available in specific versions or editions of the resource.

## Can’t find the metric dimension to alert on

If you are looking to alert on [specific dimension values of a metric](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-metric-overview#using-dimensions), but cannot find these values, note the following:

1. It might take a few minutes for the dimension values to appear under the **Dimension values** list
1. The displayed dimension values are based on metric data collected in the last three days
1. If the dimension value isn’t yet emitted, click the '+' sign to add a custom value
1. If you’d like to alert on all possible values of a dimension (including future values), check the 'Select *' checkbox

## Metric alert rules still defined on a deleted resource 

When deleting an Azure resource, associated metric alert rules aren't deleted automatically. To delete alert rules associated with a resource that has been deleted:

1. Open the resource group in which the deleted resource was defined
1. In the list displaying the resources, check the **Show hidden types** checkbox
1. Filter the list by Type == **microsoft.insights/metricalerts**
1. Select the relevant alert rules and select **Delete**

## Make metric alerts occur every time my condition is met

Metric alerts are stateful by default, and therefore additional alerts are not fired if there’s already a fired alert on a given time series. If you wish to make a specific metric alert rule stateless, and get alerted on every evaluation in which the alert condition is met, create the alert rule programmatically (for example, via [Resource Manager](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-metric-create-templates), [PowerShell](https://docs.microsoft.com/powershell/module/az.monitor/?view=azps-3.6.1), [REST](https://docs.microsoft.com/rest/api/monitor/metricalerts/createorupdate), [CLI](https://docs.microsoft.com/cli/azure/monitor/metrics/alert?view=azure-cli-latest)), and set the *autoMitigate* property to 'False'.

> [!NOTE] 
> Making a metric alert rule stateless prevents fired alerts from becoming resolved, so even after the condition isn’t met anymore, the fired alerts will remain in a fired state until the 30 days retention period.


## Metric alert rules quota too small

The allowed number of metric alert rules per subscription is subject to [quota limits](https://docs.microsoft.com/azure/azure-monitor/service-limits).

If you have reached the quota limit, the following steps may help resolve the issue:
1. Try deleting or disabling metric alert rules that aren’t used anymore.

2. Switch to using metric alert rules that monitor multiple resources. With this capability, a single alert rule can monitor multiple resources using only one alert rule counted against the quota. For more information about this capability and the supported resource types, see [here](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-metric-overview#monitoring-at-scale-using-metric-alerts-in-azure-monitor).

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
6. The total number of metric alert rules are be displayed above the rules list

### From API

- PowerShell - [Get-AzMetricAlertRuleV2](https://docs.microsoft.com/powershell/module/az.monitor/get-azmetricalertrulev2?view=azps-3.7.0)
- REST API - [List by subscription](https://docs.microsoft.com/rest/api/monitor/metricalerts/listbysubscription)
- Azure CLI - [az monitor metrics alert list](https://docs.microsoft.com/cli/azure/monitor/metrics/alert?view=azure-cli-latest#az-monitor-metrics-alert-list)

## Managing alert rules using Resource Manager templates, REST API, PowerShell, or Azure CLI

If you are running into issues creating, updating, retrieving, or deleting metric alerts using Resource Manager templates, REST API, PowerShell, or the Azure command-line interface (CLI), the following steps may help resolve the issue.

### Resource Manager templates

- Review [common Azure deployment errors](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-common-deployment-errors) list and troubleshoot accordingly
- Refer to the [metric alerts Azure Resource Manager template examples](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-metric-create-templates) to ensure you are passing the all the parameters correctly

### REST API

Review the [REST API guide](https://docs.microsoft.com/rest/api/monitor/metricalerts/) to verify you are passing the all the parameters correctly

### PowerShell

Make sure that you are using the right PowerShell cmdlets for metric alerts:

- PowerShell cmdlets for metric alerts are available in the [Az.Monitor module](https://docs.microsoft.com/powershell/module/az.monitor/?view=azps-3.6.1)
- Make sure to use the cmdlets ending with 'V2' for new (non-classic) metric alerts (for example, [Add-AzMetricAlertRuleV2](https://docs.microsoft.com/powershell/module/az.monitor/Add-AzMetricAlertRuleV2?view=azps-3.6.1))

### Azure CLI

Make sure that you are using the right CLI commands for metric alerts:

- CLI commands for metric alerts start with `az monitor metrics alert`. Review the [Azure CLI reference](https://docs.microsoft.com/cli/azure/monitor/metrics/alert?view=azure-cli-latest) to learn about the syntax.
- You can see [sample showing how to use metric alert CLI](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-metric#with-azure-cli)
- To alert on a custom metric, make sure to prefix the metric name with the relevant metric namespace: NAMESPACE.METRIC

### General

- If you are receiving a `Metric not found` error:

   - For a platform metric: Make sure that you are using the **Metric** name from [the Azure Monitor supported metrics page](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported), and not the **Metric Display Name**

   - For a custom metric: Make sure that the metric is already being emitted (you cannot create an alert rule on a custom metric that doesn't yet exist), and that you are providing the custom metric's namespace (see an ARM template example [here](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-metric-create-templates#template-for-a-static-threshold-metric-alert-that-monitors-a-custom-metric))

- If you are creating [metric alerts on logs](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-metric-logs), ensure appropriate dependencies are included. See [sample template](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-metric-logs#resource-template-for-metric-alerts-for-logs).

- If you are creating an alert rule that contains multiple criteria, note the following constraints:

   - You can only select one value per dimension within each criterion
   - You cannot use "\*" as a dimension value
   - When metrics that are configured in different criterions support the same dimension, then a configured dimension value must be explicitly set in the same way for all of those metrics (see a Resource Manager  template example [here](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-metric-create-templates#template-for-a-static-threshold-metric-alert-that-monitors-multiple-criteria))


## No permissions to create metric alert rules

To create a metric alert rule, you’ll need to have the following permissions:

- Read permission on the target resource of the alert rule
- Write permission on the resource group in which the alert rule is created (if you’re creating the alert rule from the Azure portal, the alert rule is created in the same resource group in which the target resource resides)
- Read permission on any action group associated to the alert rule (if applicable)


## Naming restrictions for metric alert rules

Please note the following restrictions for metric alert rule names:

- Metric alert rule names can’t be changed (renamed) once created
- Metric alert rule names must be unique within a resource group
- Metric alert rule names can’t contain the following characters: * # & + : < > ? @ % { } \ / 
- Metric alert rule names can’t end with the following character: .
 

## Next steps

- For general troubleshooting information about alerts and notifications, see [Troubleshooting problems in Azure Monitor alerts](alerts-troubleshoot.md).
