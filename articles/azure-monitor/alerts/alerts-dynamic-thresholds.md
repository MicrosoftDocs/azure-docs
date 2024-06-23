---
title: Create an Azure Monitor metric alert with dynamic thresholds
description: Get information about creating metric alerts with dynamic thresholds that are based on machine learning.
author: AbbyMSFT
ms.author: abbyweisberg
ms.reviewer: yalavi
ms.topic: conceptual
ms.date: 06/19/2024
---

# Create a metric alert with dynamic thresholds

Dynamic thresholds apply advanced machine learning and use a set of algorithms and methods to:

- Learn the historical behavior of metrics.
- Analyze metrics over time and identify patterns such as hourly, daily, or weekly patterns.
- Recognize anomalies that indicate possible service issues.
- Calculate the most appropriate thresholds for metrics.

When you use dynamic thresholds, you don't have to know the right threshold for each metric. Dynamic thresholds calculate the most appropriate thresholds for you.

We recommend configuring alert rules with dynamic thresholds on these metrics:

- Virtual machine CPU percentage
- Application Insights HTTP request execution time

Dynamic thresholds help you:

- Create scalable alerts for hundreds of metric series with one alert rule. If you have fewer alert rules, you spend less time creating and managing them. Scalable alerts are especially useful for multiple dimensions or for multiple resources, such as all resources in a subscription.
- Create rules without having to know what threshold to configure.
- Configure metric alerts by using high-level concepts without needing extensive domain knowledge about the metric.
- Prevent noisy (low precision) or wide (low recall) thresholds that don't have an expected pattern.

You can use dynamic thresholds on:

- Most Azure Monitor platform and custom metrics.
- Common application and infrastructure metrics.
- Noisy metrics, such as machine CPU or memory.
- Metrics with low dispersion, such as availability and error rate.

You can configure dynamic thresholds by using:

- The [Azure portal](https://portal.azure.com/).
- The fully automated [Azure Resource Manager API](/rest/api/resources/).
- [Metric alert templates](./alerts-metric-create-templates.md).

## Alert threshold calculation and preview

When an alert rule is created, dynamic thresholds use 10 days of historical data to calculate hourly or daily seasonal patterns. The chart that you see in the alert preview reflects that data.

Dynamic thresholds continually use all available historical data to learn, and they make adjustments to be more accurate. After three weeks, dynamic thresholds have enough data to identify weekly patterns, and the model is adjusted to include weekly seasonality.

The system automatically recognizes prolonged outages and removes them from the threshold learning algorithm. If there's a prolonged outage, dynamic thresholds understand the data. They detect system issues with the same level of sensitivity as before the outage occurred.

## Considerations for using dynamic thresholds

- To help ensure accurate threshold calculation, alert rules that use dynamic thresholds don't trigger an alert before collecting three days and at least 30 samples of metric data. New resources or resources that are missing metric data don't trigger an alert until enough data is available.
- Dynamic thresholds need at least three weeks of historical data to detect weekly seasonality. Some detailed patterns, such as bihourly or semiweekly patterns, might not be detected.
- If the behavior of a metric changed recently, the changes aren't immediately reflected in the dynamic threshold's upper and lower bounds. The borders are calculated based on metric data from the last 10 days. When you view the dynamic threshold's borders for a particular metric, look at the metric trend in the last week and not only for recent hours or days.
- Dynamic thresholds are good for detecting significant deviations, as opposed to slowly evolving issues. Slow behavior changes probably won't trigger an alert.

## Known issues with dynamic threshold sensitivity

- If an alert rule that uses dynamic thresholds is too noisy or fires too much, you might need to reduce its sensitivity. Use one of the following options:

  - **Threshold sensitivity**: Set the sensitivity to **Low** to be more tolerant of deviations.
  - **Number of violations** (under **Advanced settings**): Configure the alert rule to trigger only if several deviations occur within a certain period of time. This setting makes the rule less susceptible to transient deviations.

- You might find that an alert rule that uses dynamic thresholds doesn't fire or isn't sensitive enough, even though it's configured with high sensitivity. This scenario can happen when the metric's distribution is highly irregular. Consider one of the following solutions:

  - Move to monitoring a complementary metric that's suitable for your scenario, if applicable. For example, check for changes in success rate rather than failure rate.
  - Try selecting a different value for **Aggregation granularity (Period)**.
  - Check if a drastic change happened in the metric behavior in the last 10 days, such as an outage. An abrupt change can affect the upper and lower thresholds calculated for the metric and make them broader. Wait a few days until the outage is no longer included in the threshold calculation. You can also edit the alert rule to use the **Ignore data before** option in **Advanced settings**.
  - If your data has weekly seasonality, but not enough history is available for the metric, the calculated thresholds can result in broad upper and lower bounds. For example, the calculation can treat weekdays and weekends in the same way and build wide borders that don't always fit the data. This issue should resolve itself after enough metric history is available. Then, the correct seasonality is detected and the calculated thresholds are updated accordingly.

- When a metric value exhibits large fluctuations, dynamic thresholds might build a wide model around the metric values, which can result in a lower or higher boundary than expected. This scenario can happen when:

  - The sensitivity is set to low.
  - The metric exhibits an irregular behavior with high variance, which appears as spikes or dips in the data.

  Consider making the model less sensitive by choosing a higher sensitivity or selecting a larger **Lookback period** value. You can also use the **Ignore data before** option to exclude a recent irregularity from the historical data that's used to build the model.

## Configuration of dynamic thresholds

To configure dynamic thresholds, follow the [procedure for creating an alert rule](alerts-create-new-alert-rule.md#create-or-edit-an-alert-rule-in-the-azure-portal). Use these settings on the **Condition** tab:

- For **Threshold**, select **Dynamic**.
- For **Aggregation type**, we recommend that you don't select **Maximum**.
- For **Operator**, select **Greater than** unless the behavior represents the application usage.
- For **Threshold sensitivity**, select **Medium** or **Low** to reduce alert noise.
- For **Check every**, select how often the alert rule checks if the condition is met. To minimize the business impact of the alert, consider using a lower frequency. Make sure that this value is less than or equal to the **Lookback period** value.
- For **Lookback period**, set the time period to look back at each time that the data is checked. Make sure that this value is greater than or equal to the **Check every** value.
- For **Advanced options**, choose how many violations will trigger the alert within a specific time period. Optionally, set the date from which to start learning the metric historical data and calculate the dynamic thresholds.

> [!NOTE]
> Metric alert rules that you create through the portal are created in the same resource group as the target resource.

## Chart for dynamic thresholds

The following chart shows a metric, its dynamic threshold limits, and some alerts that fired when the value was outside the allowed thresholds.

:::image type="content" source="media/alerts-dynamic-thresholds/threshold-picture-8bit.png" lightbox="media/alerts-dynamic-thresholds/threshold-picture-8bit.png" alt-text="Screenshot of a chart that shows a metric, its dynamic threshold limits, and some alerts that fired.":::

Use the following information to interpret the chart:

- **Blue line**: The metric measured over time.
- **Blue shaded area**: The allowed range for the metric. If the metric values stay within this range, no alert is triggered.
- **Blue dots**: Aggregated metric values. If you select part of the chart and then hover over the blue line, a blue dot appears under your cursor to indicate an individual aggregated metric value.
- **Pop-up box with blue dot**: The measured metric value (blue dot) and the upper and lower values of the allowed range.  
- **Red dot with a black circle**: The first metric value outside the allowed range. This value fires a metric alert and puts it in an active state.
- **Red dots**: Other measured values outside the allowed range. They don't trigger more metric alerts, but the alert stays in the active state.
- **Red area**: The time when the metric value was outside the allowed range. The alert remains in the active state as long as subsequent measured values are outside the allowed range, but no new alerts are fired.
- **End of red area**: A return to allowed values. When the blue line is back inside the allowed values, the red area stops and the measured value line turns blue. The status of the metric alert fired at the time of the red dot with a black circle is set to resolved.

## Metrics not supported by dynamic thresholds

Dynamic thresholds support most metrics, but the following metrics can't use dynamic thresholds:

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

## Related content

- [Manage your alert rules](alerts-manage-alert-rules.md)

If you have feedback about dynamic thresholds, [email us](mailto:azurealertsfeedback@microsoft.com).
