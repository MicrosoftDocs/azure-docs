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

When you use dynamic thresholds, you don't have to know the "right" threshold for each metric.

Dynamic thresholds use a set of algorithms and methods with advanced machine learning (ML) to:
- Learn the historical behavior of metrics
- Identify patterns and adapt to metric changes over time, such as hourly, daily or weekly patterns. 
- Recognize anomalies that indicate possible service issues
- Calculate the most appropriate threshold for the metric 

Dynamic thresholds use algorithms and methods to create models that reflect the metrics' expected behavior  Using continuously updated data, they adapt and refine the thresholds to reflect the metrics’ behavior over time. Dynamic thresholds can detect hourly, daily, or weekly patterns. A deviation from the metrics' pattern indicates an anomaly in the metric behavior, and can trigger an alerts.

You need at least three weeks of historical data to detect weekly seasonality. Some patterns, such as bi-hourly or semi-weekly patterns may not be detected.

Dynamic thresholds work with noisy metrics, such as machine CPU or memory, and metrics with low dispersion, such as availability and error rate.

Dynamic thresholds help you:
- Create scalable alerts for hundreds of metric series with one alert rule. If you have fewer alert rules, you spend less time creating and managing alerts rules. Scalable alerting is especially useful for multiple dimensions or for multiple resources, such as to all resources in a subscription.
- Create rules without having to know what threshold to configure. Using dynamic thresholds, you can configure metric alerts using high-level concepts, without having extensive domain knowledge about the metric.
- Configure up metric alerts using high-level concepts without extensive domain knowledge about the metric
- Prevent noisy (low precision) or wide (low recall) thresholds that don’t have an expected pattern
- Handle noisy metrics (such as machine CPU or memory) and metrics with low dispersion (such as availability and error rate).

You can configure dynamic thresholds using:
- the Azure portal
- the fully automated Azure Resource Manager API
- [metric alert templates](./alerts-metric-create-templates.md).


## Recommended alerts that use dynamic thresholds

Dynamic Thresholds can be applied to most platform and custom metrics in Azure Monitor, and to common application and infrastructure metrics.

We recommend configuring these alert rules with dynamic thresholds on these metrics:
- Virtual machine CPU percentage
- Application Insights HTTP request execution time

## Configure dynamic thresholds on virtual machine CPU percentage metrics

1. In the [Azure portal](https://portal.azure.com), follow the procedure to [Create a new alert rule in the Azure portal](alerts-create-new-alert-rule.md#create-a-new-alert-rule-in-the-azure-portal), with these settings: 
    - In the **Condition** section, select the **CPU Percentage**.
    - We do not recommend using the **Maximum** aggregation for this metric type.
    1. **Condition Type**: Select the **Dynamic** option.
    1. **Sensitivity**: Select **Medium/Low** sensitivity to reduce alert noise.
    1. **Operator**: Select **Greater Than** unless behavior represents the application usage.
    1. **Frequency**: Consider lowering the frequency based on the business impact of the alert.
    1. **Failing Periods** (advanced option): The look-back window should be at least 15 minutes. For example, if the period is set to 5 minutes, failing periods should be at least 3 minutes or more.

1. Continue with the rest of the process to create an alert rule.

> [!NOTE]
> Metric alert rules created through the portal are created in the same resource group as the target resource.

## Configure dynamic thresholds on Application Insights HTTP request execution time

1. In the [Azure portal](https://portal.azure.com), select **Monitor**. The **Monitor** view consolidates all your monitoring settings and data in one view.

1. Select **Alerts** > **+ New alert rule**.

    > [!TIP]
    > Most resource panes also have **Alerts** in their resource menu under **Monitoring**. You can also create alerts from there.

1. Choose **Select target**. In the pane that opens, select a target resource that you want to alert on. Use the **Subscription** and **Application Insights Resource type** dropdowns to find the resource you want to monitor. You can also use the search bar to find your resource.

1. After you've selected a target resource, select **Add condition**.

1. Select the **HTTP request execution time**.

1. Optionally, refine the metric by adjusting **Period** and **Aggregation**. We discourage using the **Maximum** aggregation for this metric type because it's less representative of behavior. Static thresholds might be more appropriate for the **Maximum** aggregation type.

1. You'll see a chart for the metric for the last 6 hours. Define the alert parameters:
    1. **Condition Type**: Select the **Dynamic** option.
    1. **Operator**: Select **Greater Than** to reduce alerts fired on improvement in duration.
    1. **Frequency**: Consider lowering the frequency based on the business impact of the alert.

1. The metric chart displays the calculated thresholds based on recent data.

1. Select **Done**.

1. Fill in **Alert details** like **Alert Rule Name**, **Description**, and **Severity**.

1. Add an action group to the alert either by selecting an existing action group or creating a new action group.

1. Select **Done** to save the metric alert rule.

> [!NOTE]
> Metric alert rules created through the portal are created in the same resource group as the target resource.



## Troubleshooting dynamic thresholds
 
### Will slow behavior changes in the metric trigger an alert?

Probably not. Dynamic thresholds are good for detecting significant deviations rather than slowly evolving issues.

### How much data is used to preview and then calculate thresholds?

When an alert rule is first created, the thresholds appearing in the chart are calculated based on enough historical data to calculate hourly or daily seasonal patterns (10 days). After an alert rule is created, Dynamic Thresholds uses all needed historical data that's available and continuously learns and adapts based on new data to make the thresholds more accurate. After this calculation, the chart also displays weekly patterns.

### How much data is needed to trigger an alert?

If you have a new resource or missing metric data, Dynamic Thresholds won't trigger alerts before three days and at least 30 samples of metric data are available, to ensure accurate thresholds. For existing resources with sufficient metric data, Dynamic Thresholds can trigger alerts immediately.

### How do prolonged outages affect the calculated thresholds?

The system automatically recognizes prolonged outages and removes them from the threshold learning algorithm. As a result, despite prolonged outages, dynamic thresholds understand the data. Service issues are detected with the same sensitivity as before an outage occurred.

### The Dynamic Thresholds borders don't seem to fit the data

If the behavior of a metric changed recently, the changes won't necessarily be reflected in the Dynamic Threshold upper and lower bounds immediately. The borders are calculated based on metric data from the last 10 days. When you view the Dynamic Threshold borders for a given metric, look at the metric trend in the last week and not only for recent hours or days.

### Why is weekly seasonality not detected by Dynamic Thresholds?

To identify weekly seasonality, the Dynamic Thresholds model requires at least three weeks of historical data. When enough historical data is available, any weekly seasonality that exists in the metric data is identified and the model is adjusted accordingly.

### Dynamic Thresholds is showing values that are not within the range of expected values

When a metric value exhibits large fluctuations, dynamic thresholds may build a wide model around the metric values, which can result in a lower or higher boundary than expected. This scenario can happen when:

- The sensitivity is set to low.
- The metric exhibits an irregular behavior with high variance, which appears as spikes or dips in the data.

Consider making the model less sensitive by choosing a higher sensitivity or selecting a larger **Aggregation granularity (Period)**.  You can also use the **Ignore data before** option to exclude a recent irregularity from the historical data used to build the model.

### The Dynamic Thresholds alert rule is too noisy or fires too much

To reduce the sensitivity of your Dynamic Thresholds alert rule, use one of the following options:

- **Threshold sensitivity:** Set the sensitivity to **Low** to be more tolerant for deviations.
- **Number of violations (under Advanced settings):** Configure the alert rule to trigger only if several deviations occur within a certain period of time. This setting makes the rule less susceptible to transient deviations.

### The Dynamic Thresholds alert rule doesn't fire or is not sensitive enough

Sometimes an alert rule won't trigger, even when a high sensitivity is configured. This scenario usually happens when the metric's distribution is highly irregular.
Consider one of the following options:

* Move to monitoring a complementary metric that's suitable for your scenario, if applicable. For example, check for changes in success rate rather than failure rate.
* Try selecting a different value for **Aggregation granularity (Period)**.
* Check if there was a drastic change in the metric behavior in the last 10 days, for example, an outage. An abrupt change can affect the upper and lower thresholds calculated for the metric and make them broader. Wait for a few days until the outage is no longer taken into the thresholds calculation. Or use the **Ignore data before** option under **Advanced settings**.
* If your data has weekly seasonality, but not enough history is available for the metric, the calculated thresholds can result in having broad upper and lower bounds. For example, the calculation can treat weekdays and weekends in the same way and build wide borders that don't always fit the data. This issue should resolve itself after enough metric history is available. Then, the correct seasonality will be detected and the calculated thresholds will update accordingly.

## Metrics not supported by Dynamic Thresholds

Dynamic thresholds are supported for most metrics, but some metrics can't use dynamic thresholds.

The following table lists the metrics that aren't supported by Dynamic Thresholds.

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


## Contact us

Send us feedback about dynamic thresholds by mailing <azurealertsfeedback@microsoft.com>.