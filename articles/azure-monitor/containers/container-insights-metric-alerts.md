---
title: Create recommended metric alert rules in Container insights (preview)
description: Describes how to create recommended metric alerts rules for a Kubernetes cluster in Container insights.
ms.topic: conceptual
ms.date: 09/16/2022
ms.reviewer: aul
---

# Create metric alert rules in Container insights (preview)

Metric alerts in Azure Monitor proactively identify issues related system resources of your Azure resources, including monitored Kubernetes clusters. Rather than create your own metric alert rules for your Kubernetes cluster, Container insights provides the following options for using pre-configured metric alert rules based on either [Prometheus metrics](#prometheus-metric-alert-rules) or [custom metrics](#custom-metric-alert-rules).

- [Prometheus metrics](#prometheus-metric-alert-rules): Alert rules that use metrics stored in Azure Monitor managed service for Prometheus (preview). You can choose from two sets of alert rules that either matches the set for custom metrics or that are the most common alert rules from the Prometheus community.
- [Custom metrics](#custom-metric-alert-rules): Alert rules that use custom metrics collected for you Kubernetes cluster. You can use the Azure portal to enable and customize a recommended set of rules. 

## Prerequisites

**Prometheus metrics**<br>

- Your cluster must be configured to send metrics to [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md). See [Collect Prometheus metrics from Kubernetes cluster with Container insights](container-insights-prometheus-metrics-addon.md).

**Custom metrics**<br>
- You may need to enable collection of custom metrics for your cluster. See [Metrics collected by Container insights](container-insights-update-metrics.md).
- See the supported regions for custom metrics at [Supported regions](../essentials/metrics-custom-overview.md#supported-regions).



## Enable and configure Prometheus metric alert rules
[Prometheus metric alert rules](../alerts/alerts-types.md#prometheus-alerts-preview) use metric data from your Kubernetes cluster sent to [Azure Monitor manage service for Prometheus](../essentials/prometheus-metrics-overview.md). The only method currently available for creating recommended Prometheus metric alert rules is a Resource Manager template. Two templates are available depending on whether you want to use the community set of alerts or the set equivalent to the recommended custom metric alerts.

1. Download the template that includes a definition for each of the recommended alert rule.
   - [Community alerts](https://github.com/Azure/prometheus-collector/blob/main/GeneratedMonitoringArtifacts/Default/DefaultAlerts.json)
   - [Recommended alerts](https://github.com/Azure/prometheus-collector/blob/main/mixins/kubernetes/rules/recording_and_alerting_rules/templates/ci_recommended_alerts.json).
2. Deploy the template using any standard methods for installing Resource Manager templates. See [Resource Manager template samples for Azure Monitor](../resource-manager-samples.md) for guidance.

> [!NOTE] 
> While the Prometheus metric alert could be created in a different resource group to the target resource, you should use the same resource group as your target resource.

 To edit the Prometheus metric alerts threshold or configure an action group for your AKS cluster, edit the appropriate values in the ARM template and redeploy it using any deployment method.

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

> [!TIP]
> Download the new ConfigMap from [here](https://raw.githubusercontent.com/microsoft/Docker-Provider/ci_prod/kubernetes/container-azm-ms-agentconfig.yaml).


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

## Enable and configure custom metrics alert rules
Custom metric alerts can be enabled with the Azure portal or from Resource Manager templates. 

### [Azure portal](#tab/azure-portal)

1. From the **Insights** menu for your cluster, select **Recommended alerts**.

    :::image type="content" source="media/container-insights-metric-alerts/command-bar-recommended-alerts.png" lightbox="media/container-insights-metric-alerts/command-bar-recommended-alerts.png" alt-text="Screenshot showing recommended alerts option in Container insights.":::


2. Toggle the **Status** for each alert rule to enable. The alert rule is created and the rule name updates to include a link to the new alert resource.

    :::image type="content" source="media/container-insights-metric-alerts/recommended-alerts-pane-enable.png" lightbox="media/container-insights-metric-alerts/recommended-alerts-pane-enable.png" alt-text="Screenshot showing list of recommended alerts and option for enabling each.":::

3. Alert rules are not associated with an [action group](../alerts/action-groups.md) to notify users that an alert has been triggered. Select **No action group assigned** to open the **Action Groups** page, specify an existing or create an action group by selecting **Create action group**.

    :::image type="content" source="media/container-insights-metric-alerts/select-action-group.png" lightbox="media/container-insights-metric-alerts/select-action-group.png" alt-text="Screenshot showing selection of an action group.":::

#### Edit alert rules

You can view and manage Container insights alert rules, to edit its threshold or configure an [action group](../alerts/action-groups.md) for your AKS cluster. While you can perform these actions from the Azure portal and Azure CLI, it can also be done directly from your AKS cluster in Container insights.

1. From Container insights for your cluster, select **Recommended alerts**.
2. Click the **Rule Name** to open the alert rule.
3. See [Create an alert rules](../alerts/alerts-create-new-alert-rule.md?tabs=metric) for details on the alert rule settings.

### [Resource Manager](#tab/resource-manager)
For custom metrics, a separate Resource Manager template is provided for each alert rule.

1. Download one or all of the available templates that describe how to create the alert from [GitHub](https://github.com/microsoft/Docker-Provider/tree/ci_dev/alerts/recommended_alerts_ARM).
2. Create and use a [parameters file](../../azure-resource-manager/templates/parameter-files.md) as a JSON to set the values required to create the alert rule.
3. Deploy the template using any standard methods for installing Resource Manager templates. See [Resource Manager template samples for Azure Monitor](../resource-manager-samples.md) for guidance.


---


## Alert rule details
### Recommended alert rules
The following table lists the recommended alert rules that you can enable for Kubernetes clusters monitored by Container insights. The same rules can be enabled for both custom alert rules and Prometheus metric alert rules except where noted. 

| Prometheus metric alert name | Custom metric alert name | Description | Default threshold |
|:---|:---|:---|:---|
| Average container CPU % | Average container CPU % | Calculates average CPU used per container. | 95% |
| Average container working set memory % | Average container working set memory % | Calculates average working set memory used per container. | 95% |
| Average CPU % | Average CPU % | Calculates average CPU used per node. | 80% |
| Average Disk Usage % | Average Disk Usage % | Calculates average disk usage for a node. | 80% |
| Average Persistent Volume Usage % | Average Persistent Volume Usage % | Calculates average PV usage per pod. | 80% |
| Average Working set memory % | Average Working set memory % | Calculates average Working set memory for a node. | 80% |
| Restarting container count | Restarting container count | Calculates number of restarting containers. | 0 |
| Failed Pod Counts | Failed Pod Counts | Calculates number of restarting containers. | 0 |
| Node NotReady status | Node NotReady status | Calculates if any node is in NotReady state. | 0 |
| OOM Killed Containers | OOM Killed Containers | Calculates number of OOM killed containers. | 0 |
| Pods ready % | Pods ready % | Calculates the average ready state of pods. | 80% |
| Completed job count | Completed job count | Calculates number of jobs completed more than six hours ago. | 0 |
| Daily Data Cap Breach | When data cap is breached| When the total data ingestion to your Log Analytics workspace exceeds the [designated quota](../logs/daily-cap.md). This is a [log alert rule](../alerts/) that is not available with Prometheus metric alerts. |

The following alert-based metrics have unique behavior characteristics:

**Prometheus and Custom metrics**
- `completedJobsCount` metric is only sent when there are jobs that are completed greater than six hours ago.
- `containerRestartCount` metric is only sent when there are containers restarting.
- `oomKilledContainerCount` metric is only sent when there are OOM killed containers.
- `cpuExceededPercentage`, `memoryRssExceededPercentage`, and `memoryWorkingSetExceededPercentage` metrics are sent when the CPU, memory Rss, and Memory Working set values exceed the configured threshold (the default threshold is 95%). cpuThresholdViolated, memoryRssThresholdViolated, and memoryWorkingSetThresholdViolated metrics are equal to 0 is the usage percentage is below the threshold and are equal to 1 if the usage percentage is above the threshold. These thresholds are exclusive of the alert condition threshold specified for the corresponding alert rule.
- `pvUsageExceededPercentage` metric is sent when the persistent volume usage percentage exceeds the configured threshold (the default threshold is 60%). `pvUsageThresholdViolated` metric is equal to 0 when the PV usage percentage is below the threshold and is equal 1 if the usage is above the threshold. This threshold is exclusive of the alert condition threshold specified for the corresponding alert rule.
- `pvUsageExceededPercentage` metric is sent when the persistent volume usage percentage exceeds the configured threshold (the default threshold is 60%). *pvUsageThresholdViolated* metric is equal to 0 when the PV usage percentage is below the threshold and is equal 1 if the usage is above the threshold. This threshold is exclusive of the alert condition threshold specified for the corresponding alert rule. 

 
**Prometheus only**
- If you want to collect `pvUsageExceededPercentage` and analyze it from [metrics explorer](../essentials/metrics-getting-started.md), you should  configure the threshold to a value lower than your alerting threshold. The configuration related to the collection settings for persistent volume utilization thresholds can be overridden in the ConfigMaps file under the section `alertable_metrics_configuration_settings.pv_utilization_thresholds`. See [Configure alertable metrics ConfigMaps](#configure-alertable-metrics-in-configmaps) for details related to configuring your ConfigMap configuration file. Collection of persistent volume metrics with claims in the *kube-system* namespace are excluded by default. To enable collection in this namespace, use the section `[metric_collection_settings.collect_kube_system_pv_metrics]` in the ConfigMap file. See [Metric collection settings](./container-insights-agent-config.md#metric-collection-settings) for details.
- `cpuExceededPercentage`, `memoryRssExceededPercentage`, and `memoryWorkingSetExceededPercentage` metrics are sent when the CPU, memory Rss, and Memory Working set values exceed the configured threshold (the default threshold is 95%). *cpuThresholdViolated*, *memoryRssThresholdViolated*, and *memoryWorkingSetThresholdViolated* metrics are equal to 0 is the usage percentage is below the threshold and are equal to 1 if the usage percentage is above the threshold. These thresholds are exclusive of the alert condition threshold specified for the corresponding alert rule. Meaning, if you want to collect these metrics and analyze them from [Metrics explorer](../essentials/metrics-getting-started.md), we recommend you configure the threshold to a value lower than your alerting threshold. The configuration related to the collection settings for their container resource utilization thresholds can be overridden in the ConfigMaps file under the section `[alertable_metrics_configuration_settings.container_resource_utilization_thresholds]`. See the section [Configure alertable metrics ConfigMaps](#configure-alertable-metrics-in-configmaps) for details related to configuring your ConfigMap configuration file.


### Community alert rules
hand-picked alerts from Prometheus community that we recommend you to try, by manually importing the ARM template found here. Below are the alerts defined in this template. Source code for these mixin alerts can be found here

- KubeJobNotCompleted
- KubeJobFailed
- KubePodCrashLooping
- KubePodNotReady
- KubeDeploymentReplicasMismatch
- KubeStatefulSetReplicasMismatch
- KubeHpaReplicasMismatch
- KubeHpaMaxedOut
- KubeQuotaAlmostFull
- KubeMemoryQuotaOvercommit
- KubeCPUQuotaOvercommit
- KubeVersionMismatch
- KubeNodeNotReady
- KubeNodeReadinessFlapping
- KubeletTooManyPods
- KubeNodeUnreachable

## Custom metric alert rules
This section describes creating [metric alert rules](../alerts/alerts-types.md#metric-alerts) that use [custom metrics](container-insights-update-metrics.md) collected from your Kubernetes cluster.



### Alert rules overview
The following table lists the current set of recommended custom metric alert rules.



There are common properties across all of these alert rules:

- All alert rules are evaluated once per minute and they look back at last 5 minutes of data.
- Alerts rules do not have an action group assigned to them by default. You can add an [action group](../alerts/action-groups.md) to the alert either by selecting an existing action group or creating a new action group while editing the alert rule.

### Thresholds
You can modify the threshold for alert rules by directly editing them. However, refer to the guidance provided in each alert rule before modifying its threshold.



## View alerts
To view alerts created for the enabled rules, in the **Recommended alerts** pane select **View in alerts**. You are redirected to the alert menu for the AKS cluster, where you can see all the alerts currently created for your cluster.



## Next steps

- View [log query examples](container-insights-log-query.md) to see pre-defined queries and examples to evaluate or customize for alerting, visualizing, or analyzing your clusters.
- To learn more about Azure Monitor and how to monitor other aspects of your Kubernetes cluster, see [View Kubernetes cluster performance](container-insights-analyze.md).
