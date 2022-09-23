---
title: Create recommended metric alert rules in Container insights (preview)
description: Describes how to create recommended metric alerts rules for a Kubernetes cluster in Container insights.
ms.topic: conceptual
ms.date: 09/16/2022
ms.reviewer: aul
---

# Create recommended metric alert rules in Container insights (preview)

Container insights includes pre-configured metric alert rules to alert on issues related system resources of your monitored Kubernetes clusters. Instead of creating your own rules, you can enable these rules for the most common alerting conditions. There are currently two types of recommended metric alert rules for Container insights based on either [Prometheus metrics](#prometheus-metric-alert-rules) or [custom metrics](#custom-metric-alert-rules).


## Prometheus metric alert rules
This section describes creating [Prometheus metric alert rules](../alerts/alerts-types.md#prometheus-alerts-preview) that use metric data from your Kubernetes cluster sent to [Azure Monitor manage service for Prometheus](../essentials/prometheus-metrics-overview.md).

### Prerequisites

- Your cluster must be configured to send metrics to [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md). See [Collect Prometheus metrics from Kubernetes cluster with Container insights](container-insights-prometheus-metrics-addon.md).

### Create Prometheus metric alert rules
The only method currently available for creating recommended Prometheus metric alert rules is a Resource Manager template. To edit the Prometheus metric alerts threshold or configure an action group for your AKS cluster, edit the appropriate values in the ARM template and redeploy it using any deployment method.

1. Download the template that includes a definition for each of the recommended alert rules from [Github](https://github.com/Azure/prometheus-collector/blob/main/mixins/kubernetes/rules/recording_and_alerting_rules/templates/ci_recommended_alerts.json). 
2. Deploy this template using any standard methods for installing Resource Manager templates. See [Resource Manager template samples for Azure Monitor](../resource-manager-samples.md) for guidance

> [!NOTE] 
> While the Prometheus metric alert could be created in a different resource group to the target resource, you should use the same resource group as your target resource.


### Alert rules overview
The following table lists the Prometheus metric alert rules that are included in the recommended set of Prometheus metric alert rules.

| Prometheus metric alert name | Custom metric alert name | Description | Default threshold |
|:---|:---|:---|:---|
| (Prom)Average container CPU % | Average container CPU % | Calculates average CPU used per container. | 95% |
| (Prom)Average container working set memory % | Average container working set memory % | Calculates average working set memory used per container. | 95% |
| (Prom)Average CPU % | Average CPU % | Calculates average CPU used per node. | 80% |
| (Prom)Average Disk Usage % | Average Disk Usage % | Calculates average disk usage for a node. | 80% |
| (Prom)Average Persistent Volume Usage % | Average Persistent Volume Usage % | Calculates average PV usage per pod. | 80% |
| (Prom)Average Working set memory % | Average Working set memory % | Calculates average Working set memory for a node. | 80% |
| (Prom)Restarting container count | Restarting container count | Calculates number of restarting containers. | 0 |
| (Prom)Failed Pod Counts | Failed Pod Counts | Calculates number of restarting containers. | 0 |
| (Prom)Node NotReady status | Node NotReady status | Calculates if any node is in NotReady state. | 0 |
| (Prom)OOM Killed Containers | OOM Killed Containers | Calculates number of OOM killed containers. | 0 |
| (Prom)Pods ready % | Pods ready % | Calculates the average ready state of pods. | 80% |
| (Prom)Completed job count | Completed job count | Calculates number of jobs completed more than six hours ago. | 0 |

The following alert-based metrics have unique behavior characteristics:

- `completedJobsCount` metric is only sent when there are jobs that are completed greater than six hours ago.
- `containerRestartCount` metric is only sent when there are containers restarting.
- `oomKilledContainerCount` metric is only sent when there are OOM killed containers.
- `cpuExceededPercentage`, `memoryRssExceededPercentage`, and `memoryWorkingSetExceededPercentage` metrics are sent when the CPU, memory Rss, and Memory Working set values exceed the configured threshold (the default threshold is 95%). cpuThresholdViolated, memoryRssThresholdViolated, and memoryWorkingSetThresholdViolated metrics are equal to 0 is the usage percentage is below the threshold and are equal to 1 if the usage percentage is above the threshold. These thresholds are exclusive of the alert condition threshold specified for the corresponding alert rule
- `pvUsageExceededPercentage` metric is sent when the persistent volume usage percentage exceeds the configured threshold (the default threshold is 60%). `pvUsageThresholdViolated` metric is equal to 0 when the PV usage percentage is below the threshold and is equal 1 if the usage is above the threshold. This threshold is exclusive of the alert condition threshold specified for the corresponding alert rule.



## Custom metric alert rules
This section describes creating [metric alert rules](../alerts/alerts-types.md#metric-alerts) that use [custom metrics](container-insights-update-metrics.md) collected from your Kubernetes cluster.

### Prerequisites

- You may need to enable collection of custom metrics for your cluster. See [Metrics collected by Container insights](container-insights-update-metrics.md).
- See the supported regions for custom metrics at [Supported regions](../essentials/metrics-custom-overview.md#supported-regions).

> [!TIP]
> Download the new ConfigMap from [here](https://raw.githubusercontent.com/microsoft/Docker-Provider/ci_prod/kubernetes/container-azm-ms-agentconfig.yaml).

### Alert rules overview
The following table lists the current set of recommended custom metric alert rules.

|Name| Description |Default threshold |
|----|-------------|------------------|
|**(New)Average container CPU %** |Calculates average CPU used per container.|When average CPU usage per container is greater than 95%.| 
|**(New)Average container working set memory %** |Calculates average working set memory used per container.|When average working set memory usage per container is greater than 95%. |
|Average CPU % |Calculates average CPU used per node. |When average node CPU utilization is greater than 80% |
| Daily Data Cap Breach | When data cap is breached| When the total data ingestion to your Log Analytics workspace exceeds the [designated quota](../logs/daily-cap.md) |
|Average Disk Usage % |Calculates average disk usage for a node.|When disk usage for a node is greater than 80%. |
|**(New)Average Persistent Volume Usage %** |Calculates average PV usage per pod. |When average PV usage per pod is greater than 80%.|
|Average Working set memory % |Calculates average Working set memory for a node. |When average Working set memory for a node is greater than 80%. |
|Restarting container count |Calculates number of restarting containers. | When container restarts are greater than 0. |
|Failed Pod Counts |Calculates if any pod in failed state.|When a number of pods in failed state are greater than 0. |
|Node NotReady status |Calculates if any node is in NotReady state.|When a number of nodes in NotReady state are greater than 0. |
|OOM Killed Containers |Calculates number of OOM killed containers. |When a number of OOM killed containers is greater than 0. |
|Pods ready % |Calculates the average ready state of pods. |When ready state of pods is less than 80%.|
|Completed job count |Calculates number of jobs completed more than six hours ago. |When number of stale jobs older than six hours is greater than 0.|

There are common properties across all of these alert rules:

- All alert rules are evaluated once per minute and they look back at last 5 minutes of data.
- Alerts rules do not have an action group assigned to them by default. You can add an [action group](../alerts/action-groups.md) to the alert either by selecting an existing action group or creating a new action group while editing the alert rule.

### Thresholds
You can modify the threshold for alert rules by directly editing them. However, refer to the guidance provided in each alert rule before modifying its threshold.

The following alert-based metrics have unique behavior characteristics compared to the other metrics:

- `completedJobsCount` metric is only sent when there are jobs that are completed greater than six hours ago.
- `containerRestartCount` metric is only sent when there are containers restarting.
- `oomKilledContainerCount` metric is only sent when there are OOM killed containers.
- `cpuExceededPercentage`, `memoryRssExceededPercentage`, and `memoryWorkingSetExceededPercentage` metrics are sent when the CPU, memory Rss, and Memory Working set values exceed the configured threshold (the default threshold is 95%). *cpuThresholdViolated*, *memoryRssThresholdViolated*, and *memoryWorkingSetThresholdViolated* metrics are equal to 0 is the usage percentage is below the threshold and are equal to 1 if the usage percentage is above the threshold. These thresholds are exclusive of the alert condition threshold specified for the corresponding alert rule. Meaning, if you want to collect these metrics and analyze them from [Metrics explorer](../essentials/metrics-getting-started.md), we recommend you configure the threshold to a value lower than your alerting threshold. The configuration related to the collection settings for their container resource utilization thresholds can be overridden in the ConfigMaps file under the section `[alertable_metrics_configuration_settings.container_resource_utilization_thresholds]`. See the section [Configure alertable metrics ConfigMaps](#configure-alertable-metrics-in-configmaps) for details related to configuring your ConfigMap configuration file.
- `pvUsageExceededPercentage` metric is sent when the persistent volume usage percentage exceeds the configured threshold (the default threshold is 60%). *pvUsageThresholdViolated* metric is equal to 0 when the PV usage percentage is below the threshold and is equal 1 if the usage is above the threshold. This threshold is exclusive of the alert condition threshold specified for the corresponding alert rule. Meaning, if you want to collect these metrics and analyze them from [Metrics explorer](../essentials/metrics-getting-started.md), we recommend you configure the threshold to a value lower than your alerting threshold. The configuration related to the collection settings for persistent volume utilization thresholds can be overridden in the ConfigMaps file under the section `[alertable_metrics_configuration_settings.pv_utilization_thresholds]`. See the section [Configure alertable metrics ConfigMaps](#configure-alertable-metrics-in-configmaps) for details related to configuring your ConfigMap configuration file. Collection of persistent volume metrics with claims in the *kube-system* namespace are excluded by default. To enable collection in this namespace, use the section `[metric_collection_settings.collect_kube_system_pv_metrics]` in the ConfigMap file. See [Metric collection settings](./container-insights-agent-config.md#metric-collection-settings) for details.

### Enable alert rules
Follow these steps to enable the metric alerts in Azure Monitor from the Azure portal. 

### [Azure portal](#tab/azure-portal)

1. From the **Insights** menu for your cluster, select **Recommended alerts**.

    :::image type="content" source="media/container-insights-metric-alerts/command-bar-recommended-alerts.png" lightbox="media/container-insights-metric-alerts/command-bar-recommended-alerts.png" alt-text="Screenshot showing recommended alerts option in Container insights.":::


2. Toggle the **Status** for each alert rule to enable. The alert rule is created and the rule name updates to include a link to the new alert resource.

    :::image type="content" source="media/container-insights-metric-alerts/recommended-alerts-pane-enable.png" lightbox="media/container-insights-metric-alerts/recommended-alerts-pane-enable.png" alt-text="Screenshot showing list of recommended alerts and option for enabling each.":::

3. Alert rules are not associated with an [action group](../alerts/action-groups.md) to notify users that an alert has been triggered. Select **No action group assigned** to open the **Action Groups** page, specify an existing or create an action group by selecting **Create action group**.

    :::image type="content" source="media/container-insights-metric-alerts/select-action-group.png" lightbox="media/container-insights-metric-alerts/select-action-group.png" alt-text="Screenshot showing selection of an action group.":::


## [Resource Manager](#tab/resource-manager)

1. Download one or all of the available templates that describe how to create the alert from [GitHub](https://github.com/microsoft/Docker-Provider/tree/ci_dev/alerts/recommended_alerts_ARM).
2. Create and use a [parameters file](../../azure-resource-manager/templates/parameter-files.md) as a JSON to set the values required to create the alert rule.
3. Deploy the template from the Azure portal, PowerShell, or Azure CLI.

---

### Edit alert rules

You can view and manage Container insights alert rules, to edit its threshold or configure an [action group](../alerts/action-groups.md) for your AKS cluster. While you can perform these actions from the Azure portal and Azure CLI, it can also be done directly from your AKS cluster in Container insights.

1. From Container insights for your cluster, select **Recommended alerts**.
2. Click the **Rule Name** to open the alert rule.
3. See [Create an alert rules](../alerts/alerts-create-new-alert-rule.md?tabs=metric) for details on 

### View alerts
To view alerts created for the enabled rules, in the **Recommended alerts** pane select **View in alerts**. You are redirected to the alert menu for the AKS cluster, where you can see all the alerts currently created for your cluster.

### Configure alertable metrics in ConfigMaps

Perform the following steps to configure your ConfigMap configuration file to override the default utilization thresholds. These steps are applicable only for the following alertable metrics:

- *cpuExceededPercentage*
- *cpuThresholdViolated*
- *memoryRssExceededPercentage*
- *memoryRssThresholdViolated*
- *memoryWorkingSetExceededPercentage*
- *memoryWorkingSetThresholdViolated*
- *pvUsageExceededPercentage*
- *pvUsageThresholdViolated*

1. Edit the ConfigMap YAML file under the section `[alertable_metrics_configuration_settings.container_resource_utilization_thresholds]` or `[alertable_metrics_configuration_settings.pv_utilization_thresholds]`.

   - To modify the *cpuExceededPercentage* threshold to 90% and begin collection of this metric when that threshold is met and exceeded, configure the ConfigMap file using the following example:

     ```
     [alertable_metrics_configuration_settings.container_resource_utilization_thresholds]
         # Threshold for container cpu, metric will be sent only when cpu utilization exceeds or becomes equal to the following percentage
         container_cpu_threshold_percentage = 90.0
         # Threshold for container memoryRss, metric will be sent only when memory rss exceeds or becomes equal to the following percentage
         container_memory_rss_threshold_percentage = 95.0
         # Threshold for container memoryWorkingSet, metric will be sent only when memory working set exceeds or becomes equal to the following percentage
         container_memory_working_set_threshold_percentage = 95.0
     ```

   - To modify the *pvUsageExceededPercentage* threshold to 80% and begin collection of this metric when that threshold is met and exceeded, configure the ConfigMap file using the following example:

     ```
     [alertable_metrics_configuration_settings.pv_utilization_thresholds]
         # Threshold for persistent volume usage bytes, metric will be sent only when persistent volume utilization exceeds or becomes equal to the following percentage
         pv_usage_threshold_percentage = 80.0
     ```

2. Run the following kubectl command: `kubectl apply -f <configmap_yaml_file.yaml>`.

    Example: `kubectl apply -f container-azm-ms-agentconfig.yaml`.

The configuration change can take a few minutes to finish before taking effect, and all omsagent pods in the cluster will restart. The restart is a rolling restart for all omsagent pods; they don't all restart at the same time. When the restarts are finished, a message is displayed that's similar to the following example and includes the result: `configmap "container-azm-ms-agentconfig" created`.


## Next steps

- View [log query examples](container-insights-log-query.md) to see pre-defined queries and examples to evaluate or customize for alerting, visualizing, or analyzing your clusters.
- To learn more about Azure Monitor and how to monitor other aspects of your Kubernetes cluster, see [View Kubernetes cluster performance](container-insights-analyze.md).
