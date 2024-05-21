---
title: Recommended alert rules for Kubernetes clusters
description: Describes how to enable recommended metric alerts rules for a Kubernetes cluster in Azure Monitor.
ms.topic: conceptual
ms.date: 03/05/2024
ms.reviewer: aul
---

# Recommended alert rules for Kubernetes clusters
[Alerts](../alerts/alerts-overview.md) in Azure Monitor proactively identify issues related to the health and performance of your Azure resources. This article describes how to enable and edit a set of recommended metric alert rules that are predefined for your Kubernetes clusters. 

## Types of alert rules
There are two types of metric alert rules used with Kubernetes clusters.

| Alert rule type | Description |
|:---|:---|
| [Prometheus metric alert rules](../alerts/alerts-types.md#prometheus-alerts) | Use metric data collected from your Kubernetes cluster in a [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md). These rules require [Prometheus to be enabled on your cluster](./kubernetes-monitoring-enable.md#enable-prometheus-and-grafana) and are stored in a [Prometheus rule group](../essentials/prometheus-rule-groups.md). |
| [Platform metric alert rules](../alerts/alerts-types.md#metric-alerts) | Use metrics that are automatically collected from your AKS cluster and are stored as [Azure Monitor alert rules](../alerts/alerts-overview.md). |

## Enable recommended alert rules
Use one of the following methods to enable the recommended alert rules for your cluster. You can enable both Prometheus and platform metric alert rules for the same cluster.

### [Azure portal](#tab/portal)
Using the Azure portal, the Prometheus rule group will be created in the same region as the cluster.

1.	From the **Alerts** menu for your cluster, select **Set up recommendations**.

    :::image type="content" source="media/kubernetes-metric-alerts/setup-recommendations.png" lightbox="media/kubernetes-metric-alerts/setup-recommendations.png" alt-text="Screenshot of AKS cluster showing Set up recommendations button.":::

2.  The available Prometheus and platform alert rules are displayed with the Prometheus rules organized by pod, cluster, and node level. Toggle a group of Prometheus rules to enable that set of rules. Expand the group to see the individual rules. You can leave the defaults or disable individual rules and edit their name and severity.

    :::image type="content" source="media/kubernetes-metric-alerts/recommended-alert-rules-enable-prometheus.png" lightbox="media/kubernetes-metric-alerts/recommended-alert-rules-enable-prometheus.png" alt-text="Screenshot of enabling Prometheus alert rule.":::

3. Toggle a platform metric rule to enable that rule. You can expand the rule to modify its details such as the name, severity, and threshold.

    :::image type="content" source="media/kubernetes-metric-alerts/recommended-alert-rules-enable-platform.png" lightbox="media/kubernetes-metric-alerts/recommended-alert-rules-enable-platform.png" alt-text="Screenshot of enabling platform metric alert rule.":::

4. Either select one or more notification methods to create a new action group, or select an existing action group with the notification details for this set of alert rules.
5.	Click **Save** to save the rule group.


### [Azure Resource Manager](#tab/arm)
Using an ARM template, you can specify the region for the Prometheus rule group, but you should create it in the same region as the cluster.

Download the required files for the template you're working with and deploy using the parameters in the tables below. For examples of different methods, see [Deploy the sample templates](../resource-manager-samples.md#deploy-the-sample-templates).

### ARM

- Template file: [https://aka.ms/azureprometheus-recommendedmetricalerts](https://aka.ms/azureprometheus-recommendedmetricalerts)

- Parameters:

    | Parameter | Description |
    |:---|:---|
    | clusterResourceId | Resource ID of the cluster. |
    | actionGroupResourceId | Resource ID of action group that defines responses to alerts. |
    | azureMonitorWorkspaceResourceId | Resource ID of the Azure Monitor workspace receiving the cluster's Prometheus metrics. |
    | location | Region to store the alert rule group. |

### Bicep
See the [README](https://github.com/Azure/prometheus-collector/blob/main/AddonBicepTemplate/README.md) for further details.

- Template file: [https://aka.ms/azureprometheus-recommendedmetricalertsbicep](https://aka.ms/azureprometheus-recommendedmetricalertsbicep)
- Parameters:

    | Parameter | Description |
    |:---|:---|
    | aksResourceId | Resource ID of the cluster. |
    | actionGroupResourceId | Resource ID of action group that defines responses to alerts. |
    | monitorWorkspaceName | Name of the Azure Monitor workspace receiving the cluster's Prometheus metrics. |
    | location | Region to store the alert rule group. |
    


---


## Edit recommended alert rules

Once the rule group has been created, you can't use the same page in the portal to edit the rules. For Prometheus metrics, you must edit the rule group to modify any rules in it, including enabling any rules that weren't already enabled. For platform metrics, you can edit each alert rule.

### [Azure portal](#tab/portal)

1.	From the **Alerts** menu for your cluster, select **Set up recommendations**. Any rules or rule groups that have already been created will be labeled as **Already created**.
2. Expand the rule or rule group. Click on **View rule group** for Prometheus and **View alert rule** for platform metrics.

    :::image type="content" source="media/kubernetes-metric-alerts/recommended-alert-rules-already-enabled.png" lightbox="media/kubernetes-metric-alerts/recommended-alert-rules-already-enabled.png" alt-text="Screenshot of view rule group option.":::

3. For Prometheus rule groups:
   1. select **Rules** to view the alert rules in the group. 
   2. Click the **Edit** icon next a rule that you want to modify. Use the guidance in [Create an alert rule](../essentials/prometheus-rule-groups.md#configure-the-rules-in-the-group) to modify the rule.

        :::image type="content" source="media/kubernetes-metric-alerts/edit-prometheus-rule.png" lightbox="media/kubernetes-metric-alerts/edit-prometheus-rule.png" alt-text="Screenshot of option to edit Prometheus alert rules.":::

    3. When you're done editing rules in the group, click **Save** to save the rule group.

4. For platform metrics:

   1. click **Edit** to open the details for the alert rule. Use the guidance in [Create an alert rule](../alerts/alerts-create-metric-alert-rule.yml) to modify the rule.

        :::image type="content" source="media/kubernetes-metric-alerts/edit-platform-metric-rule.png" lightbox="media/kubernetes-metric-alerts/edit-platform-metric-rule.png" alt-text="Screenshot of option to edit platform metric rule.":::

### [Azure Resource Manager](#tab/arm)

Edit the query and threshold or configure an action group for your alert rules in the ARM template described in [Enable recommended alert rules](#enable-recommended-alert-rules) and redeploy it by using any deployment method.

---


## Disable alert rule group
Disable the rule group to stop receiving alerts from the rules in it. 

### [Azure portal](#tab/portal)

1. View the Prometheus alert rule group or platform metric alert rule as described in [Edit recommended alert rules](#edit-recommended-alert-rules).

2. From the **Overview** menu, select **Disable**.

    :::image type="content" source="media/kubernetes-metric-alerts/disable-prometheus-rule-group.png" lightbox="media/kubernetes-metric-alerts/disable-prometheus-rule-group.png" alt-text="Screenshot of option to disable a rule group.":::

### [ARM template](#tab/arm)

Set the **enabled** flag to false for the rule group in the ARM template described in [Enable recommended alert rules](#enable-recommended-alert-rules) and redeploy it by using any deployment method.

---

## Recommended alert rule details

The following tables list the details of each recommended alert rule. Source code for each is available in [GitHub](https://aka.ms/azureprometheus-recommendedmetricalerts) along with [troubleshooting guides](https://aka.ms/aks-alerts/community-runbooks) from the Prometheus community.

### Prometheus community alert rules

#### Cluster level alerts

| Alert name | Description | Default threshold | Timeframe (minutes) |
|:---|:---|:---:|:---:|
| KubeCPUQuotaOvercommit | The CPU resource quota allocated to namespaces exceeds the available CPU resources on the cluster's nodes by more than 50% for the last 5 minutes. | >1.5 | 5 |
| KubeMemoryQuotaOvercommit | The memory resource quota allocated to namespaces exceeds the available memory resources on the cluster's nodes by more than 50% for the last 5 minutes. | >1.5 | 5 |
| Number of OOM killed containers is greater than 0 | One or more containers within pods have been killed due to out-of-memory (OOM) events for the last 5 minutes. | >0 | 5 |
| KubeClientErrors | The rate of client errors (HTTP status codes starting with 5xx) in Kubernetes API requests exceeds 1% of the total API request rate for the last 15 minutes. | >0.01 | 15 |
| KubePersistentVolumeFillingUp | The persistent volume is filling up and is expected to run out of available space evaluated on the available space ratio, used space, and predicted linear trend of available space over the last 6 hours. These conditions are evaluated over the last 60 minutes. | N/A | 60 |
| KubePersistentVolumeInodesFillingUp | Less than 3% of the inodes within a persistent volume are available for the last 15 minutes. | <0.03 | 15 |
| KubePersistentVolumeErrors | One or more persistent volumes are in a failed or pending phase for the last 5 minutes. | >0 | 5 |
| KubeContainerWaiting | One or more containers within Kubernetes pods are in a waiting state for the last 60 minutes. | >0 | 60 |
| KubeDaemonSetNotScheduled | One or more pods are not scheduled on any node for the last 15 minutes. | >0 | 15 |
| KubeDaemonSetMisScheduled | One or more pods are misscheduled within the cluster for the last 15 minutes. | >0 | 15 |
| KubeQuotaAlmostFull | The utilization of Kubernetes resource quotas is between 90% and 100% of the hard limits for the last 15 minutes. | >0.9 <1 | 15 |


#### Node level alerts

| Alert name | Description | Default threshold | Timeframe (minutes) |
|:---|:---|:---:|:---:|
| KubeNodeUnreachable | A node has been unreachable for the last 15 minutes. | 1 | 15 |
| KubeNodeReadinessFlapping | The readiness status of a node has changed more than 2 times for the last 15 minutes. | 2 | 15 |

#### Pod level alerts

| Alert name | Description | Default threshold | Timeframe (minutes) |
|:---|:---|:---:|:---:|
| Average PV usage is greater than 80% | The average usage of Persistent Volumes (PVs) on pod exceeds 80% for the last 15 minutes. | >0.8 | 15 |
| KubeDeploymentReplicasMismatch | There is a mismatch between the desired number of replicas and the number of available replicas for the last 10 minutes. | N/A | 10 |
| KubeStatefulSetReplicasMismatch | The number of ready replicas in the StatefulSet does not match the total number of replicas in the StatefulSet for the last 15 minutes. | N/A | 15 |
| KubeHpaReplicasMismatch | The Horizontal Pod Autoscaler in the cluster has not matched the desired number of replicas for the last 15 minutes. | N/A | 15 |
| KubeHpaMaxedOut | The Horizontal Pod Autoscaler (HPA) in the cluster has been running at the maximum replicas for the last 15 minutes. | N/A | 15 |
| KubePodCrashLooping | One or more pods is in a CrashLoopBackOff condition, where the pod continuously crashes after startup and fails to recover successfully for the last 15 minutes. | >=1 | 15 |
| KubeJobStale | At least one Job instance did not complete successfully for the last 6 hours. | >0 | 360 |
| Pod container restarted in last 1 hour | One or more containers within pods in the Kubernetes cluster have been restarted at least once within the last hour. | >0 | 15 |
| Ready state of pods is less than 80% | The percentage of pods in a ready state falls below 80% for any deployment or daemonset in the Kubernetes cluster for the last 5 minutes. | <0.8 | 5 |
| Number of pods in failed state are greater than 0. | One or more pods is in a failed state for the last 5 minutes.  | >0 | 5 |
| KubePodNotReadyByController | One or more pods are not in a ready state (i.e., in the "Pending" or "Unknown" phase) for the last 15 minutes. | >0 | 15 |
| KubeStatefulSetGenerationMismatch | The observed generation of a Kubernetes StatefulSet does not match its metadata generation for the last 15 minutes. | N/A | 15 |
| KubeJobFailed | One or more Kubernetes jobs have failed within the last 15 minutes. | >0 | 15 |
| Average CPU usage per container is greater than 95% | The average CPU usage per container exceeds 95% for the last 5 minutes. | >0.95 | 5 |
| Average Memory usage per container is greater than 95% | The average memory usage per container exceeds 95% for the last 5 minutes. | >0.95 | 10 |
| KubeletPodStartUpLatencyHigh | The 99th percentile of the pod startup latency exceeds 60 seconds for the last 10 minutes. | >60 | 10 |

### Platform metric alert rules

| Alert name | Description | Default threshold | Timeframe (minutes) |
|:---|:---|:---:|:---:|
| Node cpu percentage is greater than 95% | The node CPU percentage is greater than 95% for the last 5 minutes. | 95 | 5 |
| Node memory working set percentage is greater than 100% | The node memory working set percentage is greater than 95% for the last 5 minutes. | 100 | 5 |


## Legacy Container insights metric alerts (preview)

Metric rules in Container insights will be retired on May 31, 2024 (this was previously announced as March 14, 2026). These rules haven't been available for creation using the portal since August 15, 2023. These rules were in public preview but will be retired without reaching general availability since the new recommended metric alerts described in this article are now available.

If you already enabled these legacy alert rules, you should disable them and enable the new experience. 

### Disable metric alert rules

1. From the **Insights** menu for your cluster, select **Recommended alerts (preview)**.
2. Change the status for each alert rule to **Disabled**.



### Legacy alert mapping
The following table maps each of the legacy Container insights metric alerts to its equivalent recommended Prometheus metric alerts.

| Custom metric recommended alert | Equivalent Prometheus/Platform metric recommended alert | Condition |
|:---|:---|:---|
| Completed job count | KubeJobStale (Pod level alerts) | At least one Job instance did not complete successfully for the last 6 hours. |
| Container CPU % | KubeContainerAverageCPUHigh (Pod level alerts) | The average CPU usage per container exceeds 95% for the last 5 minutes. |
| Container working set memory % | KubeContainerAverageMemoryHigh (Pod level alerts) | The average memory usage per container exceeds 95% for the last 5 minutes. |
| Failed Pod counts | KubePodFailedState (Pod level alerts) | One or more pods is in a failed state for the last 5 minutes. |
| Node CPU % | Node cpu percentage is greater than 95% (Platform metric) | The node CPU percentage is greater than 95% for the last 5 minutes. |
| Node Disk Usage % | N/A | Average disk usage for a node is greater than 80%. |
| Node NotReady status | KubeNodeUnreachable (Node level alerts) | A node has been unreachable for the last 15 minutes. |
| Node working set memory % | Node memory working set percentage is greater than 100% | The node memory working set percentage is greater than 100% for the last 5 minutes. |
| OOM Killed Containers | KubeContainerOOMKilledCount (Cluster level alerts) | One or more containers within pods have been killed due to out-of-memory (OOM) events for the last 5 minutes. |
| Persistent Volume Usage % | KubePVUsageHigh (Pod level alerts) | The average usage of Persistent Volumes (PVs) on pod exceeds 80% for the last 15 minutes. |
| Pods ready % | KubePodReadyStateLow (Pod level alerts) | The percentage of pods in a ready state falls below 80% for any deployment or daemonset in the Kubernetes cluster for the last 5 minutes. |
| Restarting container count | KubePodContainerRestart (Pod level alerts) | One or more containers within pods in the Kubernetes cluster have been restarted at least once within the last hour. |

## Next steps

- Read about the [different alert rule types in Azure Monitor](../alerts/alerts-types.md).
- Read about [alerting rule groups in Azure Monitor managed service for Prometheus](../essentials/prometheus-rule-groups.md).

