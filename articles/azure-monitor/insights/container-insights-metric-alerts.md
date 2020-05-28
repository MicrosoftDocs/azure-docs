---
title: Metric alerts from Azure Monitor for containers | Microsoft Docs
description: This article reviews the pre-defined metric alerts available from Azure Monitor for containers in public preview.
ms.topic: conceptual
ms.date: 05/28/2020

---

# Pre-defined metric alerts (preview) from Azure Monitor for containers

To alert on performance issues with Azure Monitor for containers, you would create a log alert based on performance data stored in Azure Monitor Logs. Azure Monitor for containers now includes pre-configured metric alert rules for your AKS clusters, which is in public preview. This article reviews the experience and provides guidance on configuring and managing these alert rules.

## Alert rules overview

To alert on what matters, Azure Monitor for containers includes the following metric alerts for your AKS clusters:

|Namespace|Name|Description |
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
|Insights.container/pods |containerRestartCount |Count of container restarts by controller, Kubernetes namespace.|
|Insights.container/pods | oomKilledContainerCount |Count of OOMkilled containers by controller, Kubernetes namespace.|
|Insights.container/pods |podReadyPercentage |Percentage of pods in ready state by controller, Kubernetes namespace.|
|Insights.container/containers |cpuExceededPercentage |CPU utilization percentage for containers exceeding user configurable threshold (default is 95.0) by container name, controller name, Kubernetes namespace, pod name. |
|Insights.container/containers |memoryRssExceededPercentage |Memory RSS percentage for containers exceeding user configurable threshold (default is 95.0) by container name, controller name, Kubernetes namespace, pod name.|
|Insights.container/containers |memoryWorkingSetExceededPercentage |Memory Working Set percentage for containers exceeding user configurable threshold (default is 95.0) by container name, controller name, Kubernetes namespace, pod name.|

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

* *cpuExceededPercentage*, *memoryRssExceededPercentage*, and *memoryWorkingSetExceededPercentage* metrics are sent when the CPU, memory Rss, and Memory Working set values exceed the configured threshold (the default threshold is 95%).

These settings can be overridden in the ConfigMaps file under the section [alertable_metrics_configuration_settings.container_resource_utilization_thresholds](https://github.com/microsoft/OMS-docker/blob/ci_feature_prod/Kubernetes/container-azm-ms-agentconfig.yaml). 

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

