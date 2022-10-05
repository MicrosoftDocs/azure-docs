---
title: Create metric alert rules in Container insights (preview)
description: Describes how to create recommended metric alerts rules for a Kubernetes cluster in Container insights.
ms.topic: conceptual
ms.date: 09/28/2022
ms.reviewer: aul
---

# Metric alert rules in Container insights (preview)

Metric alerts in Azure Monitor proactively identify issues related to system resources of your Azure resources, including monitored Kubernetes clusters. Container insights provides pre-configured alert rules so that you don't have to create your own. This article describes the different types of alert rules you can create and how to enable and configure them.

> [!IMPORTANT]
> Container insights in Azure Monitor now supports alerts based on Prometheus metrics. If you already use alerts based on custom metrics, you should migrate to Prometheus alerts and disable the equivalent custom metric alerts.
## Types of metric alert rules
There are two types of metric rules used by Container insights based on either Prometheus metrics or custom metrics. See a list of the specific alert rules for each at [Alert rule details](#alert-rule-details).

| Alert rule type | Description |
|:---|:---|
| [Prometheus rules](#prometheus-alert-rules) | Alert rules that use metrics stored in [Azure Monitor managed service for Prometheus (preview)](../essentials/prometheus-metrics-overview.md). There are two sets of Prometheus alert rules that you can choose to enable.<br><br>- *Community alerts* are hand-picked alert rules from the Prometheus community. Use this set of alert rules if you don't have any other alert rules enabled.<br>-*Recommended alerts* are the equivalent of the custom metric alert rules. Use this set if you're migrating from custom metrics to Prometheus metrics and want to retain identical functionality.
| [Metric rules](#metrics-alert-rules) | Alert rules that use [custom metrics collected for your Kubernetes cluster](container-insights-custom-metrics.md). Use these alert rules if you're not ready to move to Prometheus metrics yet or if you want to manage your alert rules in the Azure portal. |


## Prometheus alert rules
[Prometheus alert rules](../alerts/alerts-types.md#prometheus-alerts-preview) use metric data from your Kubernetes cluster sent to [Azure Monitor manage service for Prometheus](../essentials/prometheus-metrics-overview.md). 

### Prerequisites
- Your cluster must be configured to send metrics to [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md). See [Collect Prometheus metrics from Kubernetes cluster with Container insights](container-insights-prometheus-metrics-addon.md).

### Enable alert rules

The only method currently available for creating Prometheus alert rules is a Resource Manager template. 

1. Download the template that includes the set of alert rules that you want to enable. See [Alert rule details](#alert-rule-details) for a listing of the rules for each.

   - [Community alerts](https://aka.ms/azureprometheus-communityalerts)
   - [Recommended alerts](https://aka.ms/azureprometheus-recommendedalerts)

2. Deploy the template using any standard methods for installing Resource Manager templates. See [Resource Manager template samples for Azure Monitor](../resource-manager-samples.md#deploy-the-sample-templates) for guidance.

> [!NOTE] 
> While the Prometheus alert could be created in a different resource group to the target resource, you should use the same resource group as your target resource.

### Edit alert rules

 To edit the query and threshold or configure an action group for your alert rules, edit the appropriate values in the ARM template and redeploy it using any deployment method.

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

   - **Example**. Use the following ConfigMap configuration to modify the *cpuExceededPercentage* threshold to 90%:

     ```
     [alertable_metrics_configuration_settings.container_resource_utilization_thresholds]
         # Threshold for container cpu, metric will be sent only when cpu utilization exceeds or becomes equal to the following percentage
         container_cpu_threshold_percentage = 90.0
         # Threshold for container memoryRss, metric will be sent only when memory rss exceeds or becomes equal to the following percentage
         container_memory_rss_threshold_percentage = 95.0
         # Threshold for container memoryWorkingSet, metric will be sent only when memory working set exceeds or becomes equal to the following percentage
         container_memory_working_set_threshold_percentage = 95.0
     ```

   - **Example**. Use the following ConfigMap configuration to modify the *pvUsageExceededPercentage* threshold to 80%:

     ```
     [alertable_metrics_configuration_settings.pv_utilization_thresholds]
         # Threshold for persistent volume usage bytes, metric will be sent only when persistent volume utilization exceeds or becomes equal to the following percentage
         pv_usage_threshold_percentage = 80.0
     ```

2. Run the following kubectl command: `kubectl apply -f <configmap_yaml_file.yaml>`.

    Example: `kubectl apply -f container-azm-ms-agentconfig.yaml`.

The configuration change can take a few minutes to finish before taking effect, and all omsagent pods in the cluster will restart. The restart is a rolling restart for all omsagent pods; they don't all restart at the same time. When the restarts are finished, a message is displayed that's similar to the following example and includes the result: `configmap "container-azm-ms-agentconfig" created`.

## Metrics alert rules
[Metric alert rules](../alerts/alerts-types.md#metric-alerts) use [custom metric data from your Kubernetes cluster](container-insights-custom-metrics.md). 


### Prerequisites
  - You may need to enable collection of custom metrics for your cluster. See [Metrics collected by Container insights](container-insights-custom-metrics.md).
  - See the supported regions for custom metrics at [Supported regions](../essentials/metrics-custom-overview.md#supported-regions).


### Enable and configure alert rules

#### [Azure portal](#tab/azure-portal)

#### Enable alert rules

1. From the **Insights** menu for your cluster, select **Recommended alerts**.

    :::image type="content" source="media/container-insights-metric-alerts/command-bar-recommended-alerts.png" lightbox="media/container-insights-metric-alerts/command-bar-recommended-alerts.png" alt-text="Screenshot showing recommended alerts option in Container insights.":::


2. Toggle the **Status** for each alert rule to enable. The alert rule is created and the rule name updates to include a link to the new alert resource.

    :::image type="content" source="media/container-insights-metric-alerts/recommended-alerts-pane-enable.png" lightbox="media/container-insights-metric-alerts/recommended-alerts-pane-enable.png" alt-text="Screenshot showing list of recommended alerts and option for enabling each.":::

3. Alert rules aren't associated with an [action group](../alerts/action-groups.md) to notify users that an alert has been triggered. Select **No action group assigned** to open the **Action Groups** page, specify an existing or create an action group by selecting **Create action group**.

    :::image type="content" source="media/container-insights-metric-alerts/select-action-group.png" lightbox="media/container-insights-metric-alerts/select-action-group.png" alt-text="Screenshot showing selection of an action group.":::

#### Edit alert rules

To edit the threshold for a rule or configure an [action group](../alerts/action-groups.md) for your AKS cluster.

1. From Container insights for your cluster, select **Recommended alerts**.
2. Click the **Rule Name** to open the alert rule.
3. See [Create an alert rule](../alerts/alerts-create-new-alert-rule.md?tabs=metric) for details on the alert rule settings.

#### Disable alert rules
1. From Container insights for your cluster, select **Recommended alerts**.
2. Change the status for the alert rule to **Disabled**.

### [Resource Manager](#tab/resource-manager)
For custom metrics, a separate Resource Manager template is provided for each alert rule.

#### Enable alert rules

1. Download one or all of the available templates that describe how to create the alert from [GitHub](https://github.com/microsoft/Docker-Provider/tree/ci_dev/alerts/recommended_alerts_ARM).
2. Create and use a [parameters file](../../azure-resource-manager/templates/parameter-files.md) as a JSON to set the values required to create the alert rule.
3. Deploy the template using any standard methods for installing Resource Manager templates. See [Resource Manager template samples for Azure Monitor](../resource-manager-samples.md) for guidance.

#### Disable alert rules
To disable custom alert rules, use the same Resource Manager template to create the rule, but change the `isEnabled` value in the parameters file to `false`.

---


## Alert rule details
The following sections provide details on the alert rules provided by Container insights.

### Community alert rules
These are hand-picked alerts from Prometheus community. Source code for these mixin alerts can be found in [GitHub](https://aka.ms/azureprometheus-mixins).

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
### Recommended alert rules
The following table lists the recommended alert rules that you can enable for either Prometheus metrics or custom metrics.

| Prometheus alert name | Custom metric alert name | Description | Default threshold |
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

> [!NOTE]
> The recommended alert rules in the Azure portal also include a log alert rule called *Daily Data Cap Breach*. This rule alerts when the total data ingestion to your Log Analytics workspace exceeds the [designated quota](../logs/daily-cap.md). This alert rule is not included with the Prometheus alert rules.
> 
> You can create this rule on your own by creating a [log alert rule](../alerts/alerts-types.md#log-alerts) using the query `_LogOperation | where Operation == "Data collection Status" | where Detail contains "OverQuota"`.


Common properties across all of these alert rules include:

- All alert rules are evaluated once per minute and they look back at last 5 minutes of data.
- All alert rules are disabled by default.
- Alerts rules don't have an action group assigned to them by default. You can add an [action group](../alerts/action-groups.md) to the alert either by selecting an existing action group or creating a new action group while editing the alert rule.
- You can modify the threshold for alert rules by directly editing the template and redeploying it. Refer to the guidance provided in each alert rule before modifying its threshold.

The following metrics have unique behavior characteristics:

**Prometheus and custom metrics**
- `completedJobsCount` metric is only sent when there are jobs that are completed greater than six hours ago.
- `containerRestartCount` metric is only sent when there are containers restarting.
- `oomKilledContainerCount` metric is only sent when there are OOM killed containers.
- `cpuExceededPercentage`, `memoryRssExceededPercentage`, and `memoryWorkingSetExceededPercentage` metrics are sent when the CPU, memory Rss, and Memory Working set values exceed the configured threshold (the default threshold is 95%). cpuThresholdViolated, memoryRssThresholdViolated, and memoryWorkingSetThresholdViolated metrics are equal to 0 is the usage percentage is below the threshold and are equal to 1 if the usage percentage is above the threshold. These thresholds are exclusive of the alert condition threshold specified for the corresponding alert rule.
- `pvUsageExceededPercentage` metric is sent when the persistent volume usage percentage exceeds the configured threshold (the default threshold is 60%). `pvUsageThresholdViolated` metric is equal to 0 when the PV usage percentage is below the threshold and is equal 1 if the usage is above the threshold. This threshold is exclusive of the alert condition threshold specified for the corresponding alert rule.
- `pvUsageExceededPercentage` metric is sent when the persistent volume usage percentage exceeds the configured threshold (the default threshold is 60%). *pvUsageThresholdViolated* metric is equal to 0 when the PV usage percentage is below the threshold and is equal 1 if the usage is above the threshold. This threshold is exclusive of the alert condition threshold specified for the corresponding alert rule. 

 
**Prometheus only**
- If you want to collect `pvUsageExceededPercentage` and analyze it from [metrics explorer](../essentials/metrics-getting-started.md), you should  configure the threshold to a value lower than your alerting threshold. The configuration related to the collection settings for persistent volume utilization thresholds can be overridden in the ConfigMaps file under the section `alertable_metrics_configuration_settings.pv_utilization_thresholds`. See [Configure alertable metrics ConfigMaps](#configure-alertable-metrics-in-configmaps) for details related to configuring your ConfigMap configuration file. Collection of persistent volume metrics with claims in the *kube-system* namespace are excluded by default. To enable collection in this namespace, use the section `[metric_collection_settings.collect_kube_system_pv_metrics]` in the ConfigMap file. See [Metric collection settings](./container-insights-agent-config.md#metric-collection-settings) for details.
- `cpuExceededPercentage`, `memoryRssExceededPercentage`, and `memoryWorkingSetExceededPercentage` metrics are sent when the CPU, memory Rss, and Memory Working set values exceed the configured threshold (the default threshold is 95%). *cpuThresholdViolated*, *memoryRssThresholdViolated*, and *memoryWorkingSetThresholdViolated* metrics are equal to 0 is the usage percentage is below the threshold and are equal to 1 if the usage percentage is above the threshold. These thresholds are exclusive of the alert condition threshold specified for the corresponding alert rule. Meaning, if you want to collect these metrics and analyze them from [Metrics explorer](../essentials/metrics-getting-started.md), we recommend you configure the threshold to a value lower than your alerting threshold. The configuration related to the collection settings for their container resource utilization thresholds can be overridden in the ConfigMaps file under the section `[alertable_metrics_configuration_settings.container_resource_utilization_thresholds]`. See the section [Configure alertable metrics ConfigMaps](#configure-alertable-metrics-in-configmaps) for details related to configuring your ConfigMap configuration file.



## View alerts
View fired alerts for your cluster from [**Alerts** in the **Monitor menu** in the Azure portal] with other fired alerts in your subscription. You can also select **View in alerts** from the **Recommended alerts** pane to view alerts from custom metrics.

> [!NOTE]
> Prometheus alerts will not currently be displayed when you select **Alerts** from your AKs cluster since the alert rule doesn't use the cluster as its target.


## Next steps

- [Read about the different alert rule types in Azure Monitor](../alerts/alerts-types.md).
- [Read about alerting rule groups in Azure Monitor managed service for Prometheus](../essentials/prometheus-rule-groups.md).