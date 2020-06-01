---
title: Metric alerts from Azure Monitor for containers | Microsoft Docs
description: This article reviews the pre-defined metric alerts available from Azure Monitor for containers in public preview.
ms.topic: conceptual
ms.date: 06/01/2020

---

# Pre-defined metric alerts (preview) from Azure Monitor for containers

To alert on system resource issues when they are experiencing peak demand and running near capacity, with Azure Monitor for containers you would create a log alert based on performance data stored in Azure Monitor Logs. Azure Monitor for containers now includes pre-configured metric alert rules for your AKS clusters, which is in public preview. 

This article reviews the experience and provides guidance on configuring and managing these alert rules.

## Alert rules overview

To alert on what matters, Azure Monitor for containers includes the following metric alerts for your AKS clusters:

|Name| Description |Default threshold |
|----|-------------|------------------|
|Average container CPU % |Calculates average CPU used per container.|When average CPU usage per container is greater than 95%.| 
|Average container working set memory % |Calculates average working set memory used per container.|When average working set memory usage per container is greater than 95%. |
|Average CPU % |Calculates average CPU used per node. |When average node CPU utilization is greater than 80% |
|Average Disk Usage % |Calculates average disk usage for a node.|When disk usage for a node is greater than 80%. |
|Average Working set memory % |Calculates average Working set memory for a node. |When average Working set memory for a node is greater than 80%. |
|Container restart count |Calculates number of container restarts. | When container restarts are greater than 0. |
|Failed Pod Counts |Calculates if any pod in failed state.|When a number of pods in failed state are greater than 0. |
|Node NotReady status |Calculates if any node is in NotReady state.|When a number of nodes in NotReady state are greater than 0. |
|OOM Killed Containers |Calculates number of OOM killed containers. |When a number of OOM killed containers is greater than 0. |
|Pods ready % |Calculates the average ready state of pods. |When ready state of pods are less than 80%.|
|Stale job count |Calculates number of stale jobs that were completed more than six hours ago. |When number of stale jobs older than six hours is greater than 0.|

There are common properties across all of these alert rules:

* All alert rules are metric based.

* All alert rules are disabled by default.

* All alert rules are evaluated once per minute and they look back at last 5 minutes of data.

* Alerts rules do not have an action group assigned to them by default. You can add an [action group](../platform/action-groups.md) to the alert either by selecting an existing action group or creating a new action group while editing the alert rule.

* You can modify the threshold for alert rules by directly editing them. However, refer to the guidance provided in each alert rule before modifying the threshold.

The following alert-based metrics have unique behavior characteristics compared to the other metrics:

* *completedJobsCount* metric is only sent when there are jobs that are completed greater than six hours ago.

* *containerRestartCount* metric is only sent when there are containers restarting.

* *oomKilledContainerCount* metric is only sent when there are OOM killed containers.

* *cpuExceededPercentage*, *memoryRssExceededPercentage*, and *memoryWorkingSetExceededPercentage* metrics are sent when the CPU, memory Rss, and Memory Working set values exceed the configured threshold (the default threshold is 95%). These thresholds are exclusive of the alert condition threshold specified for the corresponding alert rule. Meaning, if you want to collect these metrics and analyze them from [Metrics explorer](../platform/metrics-getting-started.md), we recommend you configure the threshold to a value lower than your alerting threshold. The configuration related to the collection settings for their container resource utilization thresholds can be overridden in the ConfigMaps file under the section `[alertable_metrics_configuration_settings.container_resource_utilization_thresholds]`. See the section [Configure alertable metrics ConfigMaps](#configure-alertable-metrics-in-configmaps) for details related to configuring your ConfigMap configuration file.

## Metrics collected

The following metrics are enabled and collected, unless otherwise specified, as part of this feature:

|Metric namespace |Metric |Description |
|---------|----|------------|
|Insights.container/nodes |cpuUsageMillicores |CPU utilization in millicores by host.|
|Insights.container/nodes |cpuUsagePercentage |CPU usage percentage by node.|
|Insights.container/nodes |memoryRssBytes |Memory RSS utilization in bytes by host.|
|Insights.container/nodes |memoryRssPercentage |Memory RSS usage percentage by host.|
|Insights.container/nodes |memoryWorkingSetBytes |Memory Working Set utilization in bytes by host.|
|Insights.container/nodes |memoryWorkingSetPercentage |Memory Working Set usage percentage by host.|
|Insights.container/nodes |nodesCount |Count of nodes by status.|
|Insights.container/nodes |diskUsedPercentage |Percentage of disk used on the node by device.|
|Insights.container/pods |podCount |Count of pods by controller, namespace, node, and phase.|
|Insights.container/pods |completedJobsCount |Completed jobs count older user configurable threshold (default is six hours) by controller, Kubernetes namespace. |
|Insights.container/pods |restartingContainerCount |Count of container restarts by controller, Kubernetes namespace.|
|Insights.container/pods | oomKilledContainerCount |Count of OOMkilled containers by controller, Kubernetes namespace.|
|Insights.container/pods |podReadyPercentage |Percentage of pods in ready state by controller, Kubernetes namespace.|
|Insights.container/containers |cpuExceededPercentage |CPU utilization percentage for containers exceeding user configurable threshold (default is 95.0) by container name, controller name, Kubernetes namespace, pod name.<br> Collected  |
|Insights.container/containers |memoryRssExceededPercentage |Memory RSS percentage for containers exceeding user configurable threshold (default is 95.0) by container name, controller name, Kubernetes namespace, pod name.|
|Insights.container/containers |memoryWorkingSetExceededPercentage |Memory Working Set percentage for containers exceeding user configurable threshold (default is 95.0) by container name, controller name, Kubernetes namespace, pod name.|

## Enable alert rules

This section walks through enabling Azure Monitor for containers metric alert (preview).

1. Sign in to the Azure portal using the following URL - https://aka.ms/cialerts. This URL contains the feature flag for accessing the preview from your account.

2. Access to the Azure Monitor for containers metrics alert (preview) feature is available directly from an AKS cluster by selecting **Insights** from the left pane in the Azure portal. Under the **Insights** section, select **Containers**.

3. From the command bar, select **Recommended alerts**.

    ![Recommended alerts option in Azure Monitor for containers](./media/container-insights-metric-alerts/command-bar-recommended-alerts.png)

4. The **Recommended alerts** property pane automatically displays on the right side of the page. By default, all alert rules in the list are disabled. After selecting **Enable**, the alert rule is created and the rule name updates to include a link to the alert resource.

    ![Recommended alerts properties pane](./media/container-insights-metric-alerts/recommended-alerts-pane.png)

After selecting the **Enable/Disable** radio button to enable the alert, an alert rule is created and the rule name updates to include a link to the actual alert resource.

## Edit alert rules

You can view and manage Azure Monitor for containers alert rules, to edit its threshold or configure an [action group](../platform/action-groups.md) for your AKS cluster. While you can perform this through Azure portal and Azure CLI, it can also be done directly from your AKS cluster in Azure Monitor for containers.

1. From the command bar, select **Recommended alerts**.

2. To modify the threshold, on the **Recommended alerts** pane, select the enabled alert. In the **Edit rule**, select the **Alert criteria** you want to edit.

    * To modify the alert rule threshold, select the **Condition**.
    * To specify an existing or create an action group, select **Add** or **Create** under **ACION GROUPS**

To view alerts created for the enabled rules, in the **Recommended alerts** pane select **View in alerts**. This redirects you to the alert menu for the AKS cluster, where you can see all the alerts currently created for your cluster.

## Configure alertable metrics in ConfigMaps

Perform the following steps to configure your ConfigMap configuration file to override the default container resource utilization thresholds. This is only applicable for the following alertable metrics.

* *cpuExceededPercentage*
* *memoryRssExceededPercentage*
* *memoryWorkingSetExceededPercentage* 

1. Edit the ConfigMap yaml file under the section `[alertable_metrics_configuration_settings.container_resource_utilization_thresholds]`.

2. To to modify the *cpuExceededPercentage* threshold to 90% and begin collection of this metric when that threshold is met and exceeded, configure the ConfigMap file using the following example.

    ```
    container_cpu_threshold_percentage = 90.0
    # Threshold for container memoryRss, metric will be sent only when memory rss exceeds or becomes equal to the following percentage
    container_memory_rss_threshold_percentage = 95.0
    # Threshold for container memoryWorkingSet, metric will be sent only when memory working set exceeds or becomes equal to the following percentage
    container_memory_working_set_threshold_percentage = 95.0
    ```

3. Run the following kubectl command: `kubectl apply -f <configmap_yaml_file.yaml>`.

    Example: `kubectl apply -f container-azm-ms-agentconfig.yaml`.

The configuration change can take a few minutes to finish before taking effect, and all omsagent pods in the cluster will restart. The restart is a rolling restart for all omsagent pods, not all restart at the same time. When the restarts are finished, a message is displayed that's similar to the following and includes the result: `configmap "container-azm-ms-agentconfig" created`.

## Next steps

- View [log query examples](container-insights-log-search.md#search-logs-to-analyze-data) to see pre-defined queries and examples to evaluate or customize for alerting, visualizing, or analyzing your clusters.

- To learn more about Azure Monitor and how to monitor other aspects of your Kubernetes cluster, see [View Kubernetes cluster performance](container-insights-analyze.md) and [View Kubernetes cluster health](container-insights-health.md).
