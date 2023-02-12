---
title: Create alerts with dynamic thresholds in Azure Monitor metric alerts
description: Create metric alerts with machine learning-based dynamic thresholds.
author: AbbyMSFT
ms.author: abbyweisberg
ms.reviewer: yalavi
ms.topic: conceptual
ms.date: 2/23/2022
---

# Dynamic thresholds in metric alerts

Dynamic thresholds applies advanced machine learning, and uses a set of algorithms and methods to:
- Learn the historical behavior of metrics
- Analyze metrics over time and identify patterns such as hourly, daily or weekly patterns. 
- Recognize anomalies that indicate possible service issues
- Calculate the most appropriate threshold for the metric 
When you use dynamic thresholds, you don't have to know the "right" threshold for each metric, because dynamic thresholds calculates the most appropriate thresholds for you.

Dynamic thresholds help you:
- Create scalable alerts for hundreds of metric series with one alert rule. If you have fewer alert rules, you spend less time creating and managing alerts rules. Scalable alerting is especially useful for multiple dimensions or for multiple resources, such as to all resources in a subscription.
- Create rules without having to know what threshold to configure. Using dynamic thresholds, you can configure metric alerts using high-level concepts, without having extensive domain knowledge about the metric.
- Configure up metric alerts using high-level concepts without extensive domain knowledge about the metric
- Prevent noisy (low precision) or wide (low recall) thresholds that don’t have an expected pattern
- Handle noisy metrics (such as machine CPU or memory) and metrics with low dispersion (such as availability and error rate).

Dynamic Thresholds can be applied to:
- most Azure Monitor platform and custom metrics
- common application and infrastructure metrics
- noisy metrics, such as machine CPU or memory
- metrics with low dispersion, such as availability and error rate.
See [metrics not supported by dynamic thresholds](#metrics-not-supported-by-dynamic-thresholds) for a list of metrics that are not supported by dynamic thresholds.

The system automatically recognizes prolonged outages and removes them from the threshold learning algorithm. If there is a prolonged outage, dynamic thresholds understands the data, and detects system issues with the same level of sensitivity as before the outage occurred.

You can configure dynamic thresholds using:
- the Azure portal
- the fully automated Azure Resource Manager API
- [metric alert templates](./alerts-metric-create-templates.md).

## Alert threshold preview and calculation

When an alert rule is first created, dynamic thresholds uses ten days of historical data to calculate hourly or daily seasonal patterns. The chart that you see in the alert preview reflects that data. After an alert rule is created, dynamic thresholds continually uses all available historical data to learn, and adjusts the thresholds to be more accurate. After three weeks, dynamic thresholds has enough data to identify weekly patterns as well, and the model is adjusted to include weekly seasonality.
Alert rules that use dynamic thresholds won't trigger an alert before collecting three days and at least 30 samples of metric data.

## Interpret Dynamic Thresholds charts

The following chart shows a metric, its dynamic thresholds limits, and some alerts that fired when the value was outside the allowed thresholds.

![Screenshot that shows a metric, its dynamic thresholds limits, and some alerts that fired.](media/alerts-dynamic-thresholds/threshold-picture-8bit.png)

Use the following information to interpret the chart:

- **Blue line**: The actual measured metric over time.
- **Blue shaded area**: Shows the allowed range for the metric. If the metric values stay within this range, no alert will occur.
- **Blue dots**: If you left select on part of the chart and then hover over the blue line, a blue dot appears under your cursor that shows an individual aggregated metric value.
- **Pop-up with blue dot**: Shows the measured metric value (the blue dot) and the upper and lower values of the allowed range.  
- **Red dot with a black circle**: Shows the first metric value out of the allowed range. This value fires a metric alert and puts it in an active state.
- **Red dots**: Indicate other measured values outside of the allowed range. They won't fire more metric alerts, but the alert stays in the active state.
- **Red area**: Shows the time when the metric value was outside of the allowed range. The alert remains in the active state as long as subsequent measured values are out of the allowed range, but no new alerts are fired.
- **End of red area**: When the blue line is back inside the allowed values, the red area stops and the measured value line turns blue. The status of the metric alert fired at the time of the red dot with black outline is set to resolved.

## Limitations of dynamic thresholds

- Dynamic thresholds are good for detecting significant deviations, as opposed to slowly evolving issues. Slow behavior changes will probably not trigger an alert.
- To ensure accurate threshold calculation, alerts using dynamic thresholds won't trigger an alert before collecting three days and at least 30 samples of metric data. Therefore, new resources or resources missing metric data will not trigger an alert until enough data is available.
- Dynamic thresholds needs at least three weeks of historical data to detect weekly seasonality. Some detailed patterns, such as bi-hourly or semi-weekly patterns may not be detected.
- If the behavior of a metric changed recently, the changes won't be immediately reflected in the Dynamic Threshold upper and lower bounds. The borders are calculated based on metric data from the last ten days. When you view the Dynamic Threshold borders for a given metric, look at the metric trend in the last week and not only for recent hours or days.
- When a metric value exhibits large fluctuations, dynamic thresholds may build a wide model around the metric values, which can result in a lower or higher boundary than expected. This scenario can happen when:
    - The sensitivity is set to low.
    - The metric exhibits an irregular behavior with high variance, which appears as spikes or dips in the data.

    Consider making the model less sensitive by choosing a higher sensitivity or selecting a larger **Aggregation granularity (Period)**.  You can also use the **Ignore data before** option to exclude a recent irregularity from the historical data used to build the model.

## Tips for configuring dynamic thresholds

We recommend configuring alert rules with dynamic thresholds on these metrics:
- Virtual machine CPU percentage
- Application Insights HTTP request execution time

When configuring alert rules in the [Azure portal](https://portal.azure.com), follow the procedure to [Create a new alert rule in the Azure portal](alerts-create-new-alert-rule.md#create-a-new-alert-rule-in-the-azure-portal), with these settings
1. In the **Conditions** tab, 
        1. In the **Thresholds** field, select **Dynamic**.
        1. In the **Aggregation type**, we recommend that you do not select **Maximum**.
        1. In the **Operator** field, select **Greater than** unless behavior represents the application usage.
        1. In **Threshold Sensitivity**, select **Medium** or **Low** to reduce alert noise.
        1. In the **Check every** field, consider lowering the frequency based on the business impact of the alert.
        1. In the **Lookback period**, set the look-back window to at least 15 minutes. For example, if the **check every** field is set to 5 minutes, the lookback period should be at least 3 minutes or more.
1. Continue with the rest of the process to create an alert rule.

> [!NOTE]
> Metric alert rules created through the portal are created in the same resource group as the target resource.

## Troubleshoot dynamic thresholds

- If an alert rule that uses dynamic thresholds is too noisy or fires too much, you may need to reduce the sensitivity of your dynamic thresholds alert rule. Use one of the following options:
    - **Threshold sensitivity:** Set the sensitivity to **Low** to be more tolerant for deviations.
    - **Number of violations (under Advanced settings):** Configure the alert rule to trigger only if several deviations occur within a certain period of time. This setting makes the rule less susceptible to transient deviations.

- If an alert rule that uses dynamic thresholds doesn't fire or is not sensitive enough, even though it is configured with high sensitivity. This scenario usually happens when the metric's distribution is highly irregular. Consider one of the following solutions to fix the issue:
    - Move to monitoring a complementary metric that's suitable for your scenario, if applicable. For example, check for changes in success rate rather than failure rate.
    - Try selecting a different value for **Aggregation granularity (Period)**.
    - Check if there has been a drastic change in the metric behavior in the last ten days, such as an outage. An abrupt change can affect the upper and lower thresholds calculated for the metric and make them broader. Wait a few days until the outage is no longer taken into the thresholds calculation. You can also edit the alert rule to use the **Ignore data before** option in the **Advanced settings**.
    - If your data has weekly seasonality, but not enough history is available for the metric, the calculated thresholds can result in having broad upper and lower bounds. For example, the calculation can treat weekdays and weekends in the same way and build wide borders that don't always fit the data. This issue should resolve itself after enough metric history is available. Then, the correct seasonality will be detected and the calculated thresholds will update accordingly.

## Metrics not supported by Dynamic Thresholds

Dynamic thresholds are supported for most metrics, but some metrics can't use dynamic thresholds.

The following table lists the metrics that aren't supported by dynamic thresholds.

| Resource type | Metric name |
| --- | --- |
| Microsoft.ClassicStorage/storageAccounts | UsedCapacity |
| Microsoft.ClassicStorage/storageAccounts/blobServices | BlobCapacity |
| Microsoft.ClassicStorage/storageAccounts/blobServices | BlobCount |
| Microsoft.ClassicStorage/storageAccounts/blobServices | IndexCapacity |
| Microsoft.ClassicStorage/storageAccounts/fileServices | FileCapacity |
| Microsoft.ClassicStorage/storageAccounts/fileServices | FileCount |
| Microsoft.ClassicStorage/storageAccounts/fileServices | FileShareCount |
| Microsoft.ClassicStorage/storageAccounts/fileServices | FileShareSnapshotCount |
| Microsoft.ClassicStorage/storageAccounts/fileServices | FileShareSnapshotSize |
| Microsoft.ClassicStorage/storageAccounts/fileServices | FileShareQuota |
| Microsoft.Compute/disks | Composite Disk Read Bytes/sec |
| Microsoft.Compute/disks | Composite Disk Read Operations/sec |
| Microsoft.Compute/disks | Composite Disk Write Bytes/sec |
| Microsoft.Compute/disks | Composite Disk Write Operations/sec |
| Microsoft.ContainerService/managedClusters | NodesCount |
| Microsoft.ContainerService/managedClusters | PodCount |
| Microsoft.ContainerService/managedClusters | CompletedJobsCount |
| Microsoft.ContainerService/managedClusters | RestartingContainerCount |
| Microsoft.ContainerService/managedClusters | OomKilledContainerCount |
| Microsoft.Devices/IotHubs | TotalDeviceCount |
| Microsoft.Devices/IotHubs | ConnectedDeviceCount |
| Microsoft.Devices/IotHubs | TotalDeviceCount |
| Microsoft.Devices/IotHubs | ConnectedDeviceCount |
| Microsoft.DocumentDB/databaseAccounts | CassandraConnectionClosures |
| Microsoft.EventHub/clusters | Size |
| Microsoft.EventHub/namespaces | Size |
| Microsoft.IoTCentral/IoTApps | connectedDeviceCount |
| Microsoft.IoTCentral/IoTApps | provisionedDeviceCount |
| Microsoft.Kubernetes/connectedClusters | NodesCount |
| Microsoft.Kubernetes/connectedClusters | PodCount |
| Microsoft.Kubernetes/connectedClusters | CompletedJobsCount |
| Microsoft.Kubernetes/connectedClusters | RestartingContainerCount |
| Microsoft.Kubernetes/connectedClusters | OomKilledContainerCount |
| Microsoft.MachineLearningServices/workspaces/onlineEndpoints | RequestsPerMinute |
| Microsoft.MachineLearningServices/workspaces/onlineEndpoints/deployments | DeploymentCapacity |
| Microsoft.Maps/accounts | CreatorUsage |
| Microsoft.Media/mediaservices/streamingEndpoints | EgressBandwidth |
| Microsoft.Network/applicationGateways | Throughput |
| Microsoft.Network/azureFirewalls | Throughput |
| Microsoft.Network/expressRouteGateways | ExpressRouteGatewayPacketsPerSecond |
| Microsoft.Network/expressRouteGateways | ExpressRouteGatewayNumberOfVmInVnet |
| Microsoft.Network/expressRouteGateways | ExpressRouteGatewayFrequencyOfRoutesChanged |
| Microsoft.Network/virtualNetworkGateways | ExpressRouteGatewayBitsPerSecond |
| Microsoft.Network/virtualNetworkGateways | ExpressRouteGatewayPacketsPerSecond |
| Microsoft.Network/virtualNetworkGateways | ExpressRouteGatewayNumberOfVmInVnet |
| Microsoft.Network/virtualNetworkGateways | ExpressRouteGatewayFrequencyOfRoutesChanged |
| Microsoft.ServiceBus/namespaces | Size |
| Microsoft.ServiceBus/namespaces | Messages |
| Microsoft.ServiceBus/namespaces | ActiveMessages |
| Microsoft.ServiceBus/namespaces | DeadletteredMessages |
| Microsoft.ServiceBus/namespaces | ScheduledMessages |
| Microsoft.ServiceFabricMesh/applications | AllocatedCpu |
| Microsoft.ServiceFabricMesh/applications | AllocatedMemory |
| Microsoft.ServiceFabricMesh/applications | ActualCpu |
| Microsoft.ServiceFabricMesh/applications | ActualMemory |
| Microsoft.ServiceFabricMesh/applications | ApplicationStatus |
| Microsoft.ServiceFabricMesh/applications | ServiceStatus |
| Microsoft.ServiceFabricMesh/applications | ServiceReplicaStatus |
| Microsoft.ServiceFabricMesh/applications | ContainerStatus |
| Microsoft.ServiceFabricMesh/applications | RestartCount |
| Microsoft.Storage/storageAccounts | UsedCapacity |
| Microsoft.Storage/storageAccounts/blobServices | BlobCapacity |
| Microsoft.Storage/storageAccounts/blobServices | BlobCount |
| Microsoft.Storage/storageAccounts/blobServices | BlobProvisionedSize |
| Microsoft.Storage/storageAccounts/blobServices | IndexCapacity |
| Microsoft.Storage/storageAccounts/fileServices | FileCapacity |
| Microsoft.Storage/storageAccounts/fileServices | FileCount |
| Microsoft.Storage/storageAccounts/fileServices | FileShareCount |
| Microsoft.Storage/storageAccounts/fileServices | FileShareSnapshotCount |
| Microsoft.Storage/storageAccounts/fileServices | FileShareSnapshotSize |
| Microsoft.Storage/storageAccounts/fileServices | FileShareCapacityQuota |
| Microsoft.Storage/storageAccounts/fileServices | FileShareProvisionedIOPS |

## What do the Advanced settings in Dynamic Thresholds mean?

**Failing periods**. You can configure a minimum number of deviations required within a certain time window for the system to raise an alert by using dynamic thresholds. The default is four deviations in 20 minutes. You can configure failing periods and choose what to be alerted on by changing the failing periods and time window. These configurations reduce alert noise generated by transient spikes. For example:

To trigger an alert when the issue is continuous for 20 minutes, four consecutive times in a period grouping of 5 minutes, use the following settings:

![Screenshot that shows failing periods settings for continuous issue for 20 minutes, four consecutive times in a period grouping of 5 minutes.](media/alerts-dynamic-thresholds/0008.png)

To trigger an alert when there was a violation from Dynamic Thresholds in 20 minutes out of the last 30 minutes with a period of 5 minutes, use the following settings:

![Screenshot that shows failing periods settings for issue for 20 minutes out of the last 30 minutes with a period grouping of 5 minutes.](media/alerts-dynamic-thresholds/0009.png)

**Ignore data before**. You can optionally define a start date from which the system should begin calculating the thresholds. A typical use case might occur when a resource was running in a testing mode and is promoted to serve a production workload. As a result, the behavior of any metric during the testing phase should be disregarded.


## Contact us

Send us feedback about dynamic thresholds by mailing <azurealertsfeedback@microsoft.com>.