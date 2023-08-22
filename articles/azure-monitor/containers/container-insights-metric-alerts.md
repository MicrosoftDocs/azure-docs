---
title: Create metric alert rules in Container insights (preview)
description: Describes how to create recommended metric alerts rules for a Kubernetes cluster in Container insights.
ms.topic: conceptual
ms.date: 03/13/2023
ms.reviewer: aul
---

# Metric alert rules in Container insights (preview)

Metric alerts in Azure Monitor proactively identify issues related to system resources of your Azure resources, including monitored Kubernetes clusters. Container insights provides preconfigured alert rules so that you don't have to create your own. This article describes the different types of alert rules you can create and how to enable and configure them.

> [!IMPORTANT]
> Container insights in Azure Monitor now supports alerts based on Prometheus metrics, and metric rules will be retired on March 14, 2026. If you already use alerts based on custom metrics, you should migrate to Prometheus alerts and disable the equivalent custom metric alerts. As of August 15, 2023, you will no longer be able to configure new custom metric recommended alerts using the portal.
## Types of metric alert rules

There are two types of metric rules used by Container insights based on either Prometheus metrics or custom metrics. See a list of the specific alert rules for each at [Alert rule details](#alert-rule-details).

| Alert rule type | Description |
|:---|:---|
| [Prometheus rules](#prometheus-alert-rules) | Alert rules that use metrics stored in [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md). There are two sets of Prometheus alert rules that you can choose to enable.<br><br>- *Community alerts* are handpicked alert rules from the Prometheus community. Use this set of alert rules if you don't have any other alert rules enabled.<br>- *Recommended alerts* are the equivalent of the custom metric alert rules. Use this set if you're migrating from custom metrics to Prometheus metrics and want to retain identical functionality.
| [Metric rules](#metric-alert-rules) | Alert rules that use [custom metrics collected for your Kubernetes cluster](container-insights-custom-metrics.md). Use these alert rules if you're not ready to move to Prometheus metrics yet or if you want to manage your alert rules in the Azure portal. Metric rules will be retired on March 14, 2026. |

## Prometheus alert rules

[Prometheus alert rules](../alerts/alerts-types.md#prometheus-alerts) use metric data from your Kubernetes cluster sent to [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md).

### Prerequisites

Your cluster must be configured to send metrics to [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md). For more information, see [Collect Prometheus metrics with Container insights](container-insights-prometheus-metrics-addon.md).

### Enable Prometheus alert rules

The methods currently available for creating Prometheus alert rules are Azure Resource Manager template (ARM template) and Bicep template.

> [!NOTE]
> Although you can create the Prometheus alert in a resource group different from the target resource, you should use the same resource group.

### [ARM template](#tab/arm-template)

1. Download the template that includes the set of alert rules you want to enable. For a list of the rules for each, see [Alert rule details](#alert-rule-details).

   - [Community alerts](https://aka.ms/azureprometheus-communityalerts)
   - [Recommended alerts](https://aka.ms/azureprometheus-recommendedalerts)

2. Deploy the template by using any standard methods for installing ARM templates. For guidance, see [ARM template samples for Azure Monitor](../resource-manager-samples.md#deploy-the-sample-templates).

### [Bicep template](#tab/bicep)

1. To deploy community and recommended alerts, follow this [template](https://aka.ms/azureprometheus-alerts-bicep) and follow the README.md file in the same folder for how to deploy.


---

### Edit Prometheus alert rules

 To edit the query and threshold or configure an action group for your alert rules, edit the appropriate values in the ARM template and redeploy it by using any deployment method.

### Configure alertable metrics in ConfigMaps

Perform the following steps to configure your ConfigMap configuration file to override the default utilization thresholds. These steps only apply to the following alertable metrics:

- cpuExceededPercentage
- cpuThresholdViolated
- memoryRssExceededPercentage
- memoryRssThresholdViolated
- memoryWorkingSetExceededPercentage
- memoryWorkingSetThresholdViolated
- pvUsageExceededPercentage
- pvUsageThresholdViolated

> [!TIP]
> Download the new ConfigMap from [this GitHub content](https://raw.githubusercontent.com/microsoft/Docker-Provider/ci_prod/kubernetes/container-azm-ms-agentconfig.yaml).

1. Edit the ConfigMap YAML file under the section `[alertable_metrics_configuration_settings.container_resource_utilization_thresholds]` or `[alertable_metrics_configuration_settings.pv_utilization_thresholds]`.

   - **Example:** Use the following ConfigMap configuration to modify the `cpuExceededPercentage` threshold to 90%:

     ```
     [alertable_metrics_configuration_settings.container_resource_utilization_thresholds]
         # Threshold for container cpu, metric will be sent only when cpu utilization exceeds or becomes equal to the following percentage
         container_cpu_threshold_percentage = 90.0
         # Threshold for container memoryRss, metric will be sent only when memory rss exceeds or becomes equal to the following percentage
         container_memory_rss_threshold_percentage = 95.0
         # Threshold for container memoryWorkingSet, metric will be sent only when memory working set exceeds or becomes equal to the following percentage
         container_memory_working_set_threshold_percentage = 95.0
     ```

   - **Example:** Use the following ConfigMap configuration to modify the `pvUsageExceededPercentage` threshold to 80%:

     ```
     [alertable_metrics_configuration_settings.pv_utilization_thresholds]
         # Threshold for persistent volume usage bytes, metric will be sent only when persistent volume utilization exceeds or becomes equal to the following percentage
         pv_usage_threshold_percentage = 80.0
     ```

1. Run the following kubectl command: `kubectl apply -f <configmap_yaml_file.yaml>`.

    Example: `kubectl apply -f container-azm-ms-agentconfig.yaml`.

The configuration change can take a few minutes to finish before it takes effect. Then all omsagent pods in the cluster will restart. The restart is a rolling restart for all omsagent pods, so they don't all restart at the same time. When the restarts are finished, a message similar to the following example includes the result: `configmap "container-azm-ms-agentconfig" created`.

## Metric alert rules

> [!IMPORTANT]
> Metric alerts (preview) are retiring and no longer recommended. As of August 15, 2023, you will no longer be able to configure new custom metric recommended alerts using the portal. Please refer to the migration guidance at [Migrate from Container insights recommended alerts to Prometheus recommended alert rules (preview)](#migrate-from-metric-rules-to-prometheus-rules-preview).
### Prerequisites

  - You might need to enable collection of custom metrics for your cluster. See [Metrics collected by Container insights](container-insights-custom-metrics.md).
  - See the supported regions for custom metrics at [Supported regions](../essentials/metrics-custom-overview.md#supported-regions).

### Enable and configure metric alert rules

#### [Azure portal](#tab/azure-portal)

#### Enable metric alert rules

1. On the **Insights** menu for your cluster, select **Recommended alerts**.

    :::image type="content" source="media/container-insights-metric-alerts/command-bar-recommended-alerts.png" lightbox="media/container-insights-metric-alerts/command-bar-recommended-alerts.png" alt-text="Screenshot that shows recommended alerts option in Container insights.":::

1. Toggle the **Status** for each alert rule to enable. The alert rule is created and the rule name updates to include a link to the new alert resource.

    :::image type="content" source="media/container-insights-metric-alerts/recommended-alerts-pane-enable.png" lightbox="media/container-insights-metric-alerts/recommended-alerts-pane-enable.png" alt-text="Screenshot that shows a list of recommended alerts and options for enabling each.":::

1. Alert rules aren't associated with an [action group](../alerts/action-groups.md) to notify users that an alert has been triggered. Select **No action group assigned** to open the **Action Groups** page. Specify an existing action group or create an action group by selecting **Create action group**.

    :::image type="content" source="media/container-insights-metric-alerts/select-action-group.png" lightbox="media/container-insights-metric-alerts/select-action-group.png" alt-text="Screenshot that shows selecting an action group.":::

#### Edit metric alert rules

To edit the threshold for a rule or configure an [action group](../alerts/action-groups.md) for your Azure Kubernetes Service (AKS) cluster.

1. From Container insights for your cluster, select **Recommended alerts**.
2. Select the **Rule Name** to open the alert rule.
3. See [Create an alert rule](../alerts/alerts-create-new-alert-rule.md?tabs=metric) for information on the alert rule settings.

#### Disable metric alert rules

1. From Container insights for your cluster, select **Recommended alerts**.
1. Change the status for the alert rule to **Disabled**.

### [Resource Manager](#tab/resource-manager)

For custom metrics, a separate ARM template is provided for each alert rule.

#### Enable metric alert rules

1. Download one or all of the available templates that describe how to create the alert from [GitHub](https://github.com/microsoft/Docker-Provider/tree/ci_dev/alerts/recommended_alerts_ARM).
1. Create and use a [parameters file](../../azure-resource-manager/templates/parameter-files.md) as a JSON to set the values required to create the alert rule.
1. Deploy the template by using any standard methods for installing ARM templates. For guidance, see [ARM template samples for Azure Monitor](../resource-manager-samples.md).

#### Disable metric alert rules

To disable custom alert rules, use the same ARM template to create the rule, but change the `isEnabled` value in the parameters file to `false`.

---



## Migrate from metric rules to Prometheus rules (preview)
If you're using metric alert rules to monitor your Kubernetes cluster, you should transition to Prometheus recommended alert rules (preview) before March 14, 2026 when metric alerts are retired.

1. Follow the steps at [Enable Prometheus alert rules](#enable-prometheus-alert-rules) to configure Prometheus recommended alert rules (preview).
2. Follow the steps at [Disable metric alert rules](#disable-metric-alert-rules) to remove metric alert rules from your clusters.

## Alert rule details

The following sections present information on the alert rules provided by Container insights.

### Community alert rules

These handpicked alerts come from the Prometheus community. Source code for these mixin alerts can be found in [GitHub](https://aka.ms/azureprometheus-communityalerts):

| Alert name | Description | Default threshold |
|:---|:---|:---|
| NodeFilesystemSpaceFillingUp | An extrapolation algorithm predicts that disk space usage for a node on a device in a cluster will run out of space within the upcoming 24 hours. | NA |
| NodeFilesystemSpaceUsageFull85Pct | Disk space usage for a node on a device in a cluster is greater than 85%. | 85% |
| KubePodCrashLooping | Pod is in CrashLoop which means the app dies or is unresponsive and kubernetes tries to restart it automatically. | NA |
| KubePodNotReady | Pod has been in a non-ready state for more than 15 minutes. | NA |
| KubeDeploymentReplicasMismatch  | Deployment has not matched the expected number of replicas.  | NA |
| KubeStatefulSetReplicasMismatch | StatefulSet has not matched the expected number of replicas. | NA |
| KubeJobNotCompleted | Job is taking more than 1h to complete. | NA |
| KubeJobFailed | Job failed complete. | NA |
| KubeHpaReplicasMismatch | Horizontal Pod Autoscaler has not matched the desired number of replicas for longer than 15 minutes. | NA |
| KubeHpaMaxedOut | Horizontal Pod Autoscaler has been running at max replicas for longer than 15 minutes. | NA |
| KubeCPUQuotaOvercommit | Cluster has overcommitted CPU resource requests for Namespaces and cannot tolerate node failure. | 1.5 |
| KubeMemoryQuotaOvercommit | Cluster has overcommitted memory resource requests for Namespaces. | 1.5 |
| KubeQuotaAlmostFull | Cluster reaches to the allowed limits for given namespace. | Between 0.9 and 1 |
| KubeVersionMismatch | Different semantic versions of Kubernetes components running. | NA |
| KubeNodeNotReady | KubeNodeNotReady alert is fired when a Kubernetes node is not in Ready state for a certain period.  | NA |
| KubeNodeUnreachable | Kubernetes node is unreachable and some workloads may be rescheduled. | NA |
| KubeletTooManyPods | The alert fires when a specific node is running >95% of its capacity of pods  | 0.95 |
| KubeNodeReadinessFlapping | The readiness status of node has changed few times in the last 15 minutes. | 2 |

### Recommended alert rules

The following table lists the recommended alert rules that you can enable for either Prometheus metrics or custom metrics.
Source code for the recommended alerts can be found in [GitHub](https://github.com/Azure/prometheus-collector/blob/68ab5b195a77d72b0b8e36e5565b645c3d1e2d5d/mixins/kubernetes/rules/recording_and_alerting_rules/templates/ci_recommended_alerts.json):

| Prometheus alert name | Custom metric alert name | Description | Default threshold |
|:---|:---|:---|:---|
| Average container CPU % | Average container CPU % | Calculates average CPU used per container. | 95% |
| Average container working set memory % | Average container working set memory % | Calculates average working set memory used per container. | 95% |
| Average CPU % | Average CPU % | Calculates average CPU used per node. | 80% |
| Average Disk Usage % | Average Disk Usage % | Calculates average disk usage for a node. | 80% |
| Average Persistent Volume Usage % | Average Persistent Volume Usage % | Calculates average persistent volume usage per pod. | 80% |
| Average Working set memory % | Average Working set memory % | Calculates average Working set memory for a node. | 80% |
| Restarting container count | Restarting container count | Calculates number of restarting containers. | 0 |
| Failed Pod Counts | Failed Pod Counts | Calculates number of pods in failed state. | 0 |
| Node NotReady status | Node NotReady status | Calculates if any node is in NotReady state. | 0 |
| OOM Killed Containers | OOM Killed Containers | Calculates number of OOM killed containers. | 0 |
| Pods ready % | Pods ready % | Calculates the average ready state of pods. | 80% |
| Completed job count | Completed job count | Calculates number of jobs completed more than six hours ago. | 0 |

> [!NOTE]
> The recommended alert rules in the Azure portal also include a log alert rule called *Daily Data Cap Breach*. This rule alerts when the total data ingestion to your Log Analytics workspace exceeds the [designated quota](../logs/daily-cap.md). This alert rule isn't included with the Prometheus alert rules.
>
> You can create this rule on your own by creating a [log alert rule](../alerts/alerts-types.md#log-alerts) that uses the query `_LogOperation | where Operation == "Data collection Status" | where Detail contains "OverQuota"`.

Common properties across all these alert rules include:

- All alert rules are evaluated once per minute, and they look back at the last five minutes of data.
- All alert rules are disabled by default.
- Alerts rules don't have an action group assigned to them by default. To add an [action group](../alerts/action-groups.md) to the alert, either select an existing action group or create a new action group while you edit the alert rule.
- You can modify the threshold for alert rules by directly editing the template and redeploying it. Refer to the guidance provided in each alert rule before you modify its threshold.

The following metrics have unique behavior characteristics:

**Prometheus and custom metrics**

- The `completedJobsCount` metric is only sent when there are jobs that are completed greater than six hours ago.
- The `containerRestartCount` metric is only sent when there are containers restarting.
- The `oomKilledContainerCount` metric is only sent when there are OOM killed containers.
- The `cpuExceededPercentage`, `memoryRssExceededPercentage`, and `memoryWorkingSetExceededPercentage` metrics are sent when the CPU, memory RSS, and memory working set values exceed the configured threshold. The default threshold is 95%. The `cpuThresholdViolated`, `memoryRssThresholdViolated`, and `memoryWorkingSetThresholdViolated` metrics are equal to 0 if the usage percentage is below the threshold and are equal to 1 if the usage percentage is above the threshold. These thresholds are exclusive of the alert condition threshold specified for the corresponding alert rule.
- The `pvUsageExceededPercentage` metric is sent when the persistent volume usage percentage exceeds the configured threshold. The default threshold is 60%. The `pvUsageThresholdViolated` metric is equal to 0 when the persistent volume usage percentage is below the threshold and is equal to 1 if the usage is above the threshold. This threshold is exclusive of the alert condition threshold specified for the corresponding alert rule.

**Prometheus only**

- If you want to collect `pvUsageExceededPercentage` and analyze it from [metrics explorer](../essentials/metrics-getting-started.md), configure the threshold to a value lower than your alerting threshold. The configuration related to the collection settings for persistent volume utilization thresholds can be overridden in the ConfigMaps file under the section `alertable_metrics_configuration_settings.pv_utilization_thresholds`. For details related to configuring your ConfigMap configuration file, see [Configure alertable metrics ConfigMaps](#configure-alertable-metrics-in-configmaps). Collection of persistent volume metrics with claims in the `kube-system` namespace are excluded by default. To enable collection in this namespace, use the section `[metric_collection_settings.collect_kube_system_pv_metrics]` in the ConfigMap file. For more information, see [Metric collection settings](./container-insights-agent-config.md#metric-collection-settings).
- The `cpuExceededPercentage`, `memoryRssExceededPercentage`, and `memoryWorkingSetExceededPercentage` metrics are sent when the CPU, memory RSS, and Memory Working set values exceed the configured threshold. The default threshold is 95%. The `cpuThresholdViolated`, `memoryRssThresholdViolated`, and `memoryWorkingSetThresholdViolated` metrics are equal to 0 if the usage percentage is below the threshold and are equal to 1 if the usage percentage is above the threshold. These thresholds are exclusive of the alert condition threshold specified for the corresponding alert rule. If you want to collect these metrics and analyze them from [metrics explorer](../essentials/metrics-getting-started.md), configure the threshold to a value lower than your alerting threshold. The configuration related to the collection settings for their container resource utilization thresholds can be overridden in the ConfigMaps file under the section `[alertable_metrics_configuration_settings.container_resource_utilization_thresholds]`. For details related to configuring your ConfigMap configuration file, see the section [Configure alertable metrics ConfigMaps](#configure-alertable-metrics-in-configmaps).

## View alerts

View fired alerts for your cluster from **Alerts** in the **Monitor** menu in the Azure portal with other fired alerts in your subscription. You can also select **View in alerts** on the **Recommended alerts** pane to view alerts from custom metrics.

> [!NOTE]
> Currently, Prometheus alerts won't be displayed when you select **Alerts** from your AKS cluster because the alert rule doesn't use the cluster as its target.

## Next steps

- Read about the [different alert rule types in Azure Monitor](../alerts/alerts-types.md).
- Read about [alerting rule groups in Azure Monitor managed service for Prometheus](../essentials/prometheus-rule-groups.md).

