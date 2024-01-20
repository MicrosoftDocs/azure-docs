---
title: Metric alert rules for Kubernetes clusters (preview)
description: Describes how to enable recommended metric alerts rules for a Kubernetes cluster in Azure Monitor.
ms.topic: conceptual
ms.date: 01/17/2024
ms.reviewer: aul
---

# Metric alert rules for Kubernetes clusters (preview)

[Alerts](../alerts/alerts-overview.md) in Azure Monitor proactively identify issues related to performance of your Azure resources. This article describes how to enable and edit a set of recommended metric alert rules that are predefined for your Kubernetes clusters. 

## Prerequisites
- Your cluster must be configured to send Prometheus metrics to Azure Monitor managed service for Prometheus. See [Enable monitoring for Kubernetes clusters](./kubernetes-monitoring-enable.md#enable-prometheus-and-grafana).

## Types of alert rules
There are two types of metric alert rules used with Kubernetes clusters.

- [Prometheus metric alert rules](../alerts/alerts-types.md#prometheus-alerts) use metric data collected from your Kubernetes cluster in a [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md). These rules require [Prometheus to be enabled on your cluster](./kubernetes-monitoring-enable.md#enable-prometheus-and-grafana) and are stored in a [Prometheus rule group](../essentials/prometheus-rule-groups.md).
- [Platform metric alert rules](../alerts/alerts-types.md#metric-alerts) use metrics that are automatically collected from your AKS cluster and are stored as [Azure Monitor alert rules](../alerts/alerts-overview.md).

## Enable Prometheus alert rules
Note: Although you can create the Prometheus alert in a resource group different from the target resource, you should use the same resource group.

### [Azure portal](#tab/portal)

1.	From the **Alerts** menu for your cluster, select **Set up recommendations**.

    :::image type="content" source="media/kubernetes-metric-alerts/setup-recommendations.png" lightbox="media/kubernetes-metric-alerts/setup-recommendations.png" alt-text="Screenshot of AKS cluster showing Set up recommendations button.":::

    The available Prometheus and platform alert rules are displayed with the Prometheus rules organized by pod, cluster, and node level. 

    :::image type="content" source="media/kubernetes-metric-alerts/recommended-alert-rules.png" lightbox="media/kubernetes-metric-alerts/recommended-alert-rules.png" alt-text="Screenshot of set up recommended alert rules blade.":::

2.	Toggle a group of Prometheus rules to enable that set of rules. Expand the group to see the individual rules. You can leave the defaults or disable individual rules and edit their name and severity.

    :::image type="content" source="media/kubernetes-metric-alerts/recommended-alert-rules-enable-prometheus.png" lightbox="media/kubernetes-metric-alerts/recommended-alert-rules-enable-prometheus.png" alt-text="Screenshot of enabling Prometheus alert rule.":::

3. Toggle a platform metric rule to enable that rule. You can expand the rule to modify its details such as the name, severity, and threshold.

    :::image type="content" source="media/kubernetes-metric-alerts/recommended-alert-rules-enable-platform.png" lightbox="media/kubernetes-metric-alerts/recommended-alert-rules-enable-platform.png" alt-text="Screenshot of enabling platform metric alert rule.":::

4. Either select one or more notification methods to create a new action group, or select an existing action group with the notification details for this set of alert rules.
5.	Click **Save** to save the rule group.


### [Azure Resource Manager](#tab/arm)

1. Download the required files for the template you're working with.

**ARM**

- Template file: [https://aka.ms/azureprometheus-communityalerts](https://aka.ms/azureprometheus-communityalerts)

**Bicep**

- Template file: [https://aka.ms/azureprometheus-alerts-bicep)](https://aka.ms/azureprometheus-alerts-bicep)
- Further details: [README](https://github.com/Azure/prometheus-collector/blob/main/AddonBicepTemplate/README.md)


2. Provide values for the following parameters:

| ARM Parameter | Bicep Parameter | Description |
|:---|:---|:---|
| clusterName | | Name of the cluster. |
| clusterResourceId | aksResourceId | Resource ID of the cluster. |
| actionGroupResourceId | actionGroupResourceId | Resource ID of action group that defines responses to alerts. |
| azureMonitorWorkspaceResourceId | | Resource ID of the Azure Monitor workspace receiving the cluster's Prometheus metrics. |
| | monitorWorkspaceName | Name of the Azure Monitor workspace receiving the cluster's Prometheus metrics. |
| location | location | Region to store the alert rule group. |


3. Deploy the template with the parameter file by using any valid method for deploying Resource Manager templates. For examples of different methods, see [Deploy the sample templates](../resource-manager-samples.md#deploy-the-sample-templates).

---


## Edit Prometheus alert rules

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

   1. click **Edit** to open the details for the alert rule. Use the guidance in [Create an alert rule](../alerts/alerts-create-metric-alert-rule.md#configure-the-alert-rule-conditions) to modify the rule. 

        :::image type="content" source="media/kubernetes-metric-alerts/edit-platform-metric-rule.png" lightbox="media/kubernetes-metric-alerts/edit-platform-metric-rule.png" alt-text="Screenshot of option to edit platform metric rule.":::

### [Azure Resource Manager](#tab/arm)

Edit the query and threshold or configure an action group for your alert rules in the ARM template described in [Enable Prometheus alert rules](#enable-prometheus-alert-rules) and redeploy it by using any deployment method.

---

## Apply alert rule group to multiple clusters

Instead of creating separate Prometheus alert rule groups for each of your clusters, you can create a single rule group and apply it to all of the clusters that use the same Azure Monitor workspace.

1. View the alert rule group as described in [Edit Prometheus alert rules](#edit-prometheus-alert-rules).
2. From the **Scope** menu, select **All clusters in the workspace** for the **Cluster** setting. 

    :::image type="content" source="media/kubernetes-metric-alerts/prometheus-rule-group-scope.png" lightbox="media/kubernetes-metric-alerts/prometheus-rule-group-scope.png" alt-text="Screenshot of option to edit rule group scope.":::

## Disable alert rule group
Disable the rule group to stop receiving alerts from the rules in it. 

### [Azure portal](#tab/portal)

1. View the Prometheus alert rule group or platform metric alert rule as described in [Edit Prometheus alert rules](#edit-prometheus-alert-rules).

2. From the **Overview** menu, select **Disable**.

    :::image type="content" source="media/kubernetes-metric-alerts/disable-prometheus-rule-group.png" lightbox="media/kubernetes-metric-alerts/disable-prometheus-rule-group.png" alt-text="Screenshot of option to disable a rule group.":::

### [ARM template](#tab/arm)

Set the **enabled** flag to false for the rule group in the ARM template described in [Enable Prometheus alert rules](#enable-prometheus-alert-rules) and redeploy it by using any deployment method.

---

## Alert rule details

The following table lists the details of each Prometheus alert rule. Source code for each is available in [GitHub](https://aka.ms/azureprometheus-communityalerts).

| Alert name | Description | Default threshold | Level |
|:---|:---|:---|:---|
| KubePodCrashLooping | Pod is in CrashLoop which means the app dies or is unresponsive and Kubernetes tries to restart it automatically. | NA | Pod |
| KubePodNotReadyByController | Pod has been in a non-ready state for more than 15 minutes. | NA | Pod |
| KubeDeploymentReplicasMismatch | Deployment has not matched the expected number of replicas. | NA | Cluster |
| KubeStatefulSetReplicasMismatch | StatefulSet has not matched the expected number of replicas. | NA | Cluster |
| KubeJobNotCompleted | Job is taking more than 1h to complete. | NA | Pod |
| KubeJobFailed | Job failed complete. | NA | Pod |
| KubeHpaReplicasMismatch | Horizontal Pod Autoscaler has not matched the desired number of replicas for longer than 15 minutes. | NA | Cluster |
| KubeHpaMaxedOut | Horizontal Pod Autoscaler has been running at max replicas for longer than 15 minutes. | NA | Cluster |
| KubeCPUQuotaOvercommit | Cluster has overcommitted CPU resource requests for Namespaces and cannot tolerate node failure. | 1.5 | Cluster |
| KubeMemoryQuotaOvercommit | Cluster has overcommitted memory resource requests for Namespaces. | 1.5 | Cluster |
| KubeQuotaAlmostFull | Cluster reaches to the allowed limits for given namespace. | Between 0.9 and 1 | Node |
| KubeVersionMismatch | Different semantic versions of Kubernetes components running. | NA | Cluster |
| KubeNodeNotReady | KubeNodeNotReady alert is fired when a Kubernetes node is not in Ready state for a certain period. | NA | Node |
| KubeNodeUnreachable | Kubernetes node is unreachable and some workloads may be rescheduled. | NA | Node |
| KubeNodeReadinessFlapping | The readiness status of node has changed few times in the last 15 minutes. | 2 | Node |
| Average PV usage is greater than 80% | Average PV usage is greater than 80% | 80 | Cluster |
| Average node CPU utilization is greater than 80% | Average node CPU utilization is greater than 80% | 80 | Node |
| Job did not complete in time | Number of stale jobs older than six hours is greater than 0 | 0 | Pod |
| Working set memory for a node is greater than 80% | Working set memory for a node is greater than 80% | 80 | Node |
| Pod container restarted in last 1 hour | Pod container restarted in last 1 hour | NA | Pod |
| Number of OOM killed containers is greater than 0 | Number of OOM killed containers is greater than 0 | 0 | Node |
| Ready state of pods is less than 80% | Ready state of pods is less than 80% | 80 | Pod |
| Number of pods in failed state are greater than 0 | Number of pods in failed state are greater than 0 | 0 | Pod |
| KubeDaemonSetNotScheduled | Pods of DaemonSet are not scheduled. | NA | Node |
| KubePodNotReadyByController | Pod has been in a non-ready state for more than 15 minutes. | NA | Pod |
| KubeStatefulSetGenerationMismatch | StatefulSet generation for {{ $labels.namespace }}/{{ $labels.statefulset }} does not match, this indicates that the StatefulSet has failed but has not been rolled back. | NA | Pod |
| KubeContainerWaiting | Pod on container waiting longer than 1 hour | NA | Node |
| KubeClientErrors | Kubernetes API server client is experiencing errors. | 0.01 | Cluster |
| KubeDaemonSetMisScheduled | DaemonSet pods are misscheduled | 0 | Node |
| Average CPU usage per container is greater than 95% | Average CPU usage per container is greater than 95% | 95 | Pod |
| CPUThrottlingHigh | Processes experience elevated CPU throttling | NA | Cluster |
| KubeletPlegDurationHigh | The Kubelet Pod Lifecycle Event Generator has a 99th percentile duration of {{ $value }} seconds on node {{ $labels.node }}. | 10 | Node |
| Average Memory usage per container is greater than 95% | Average Memory usage per container is greater than 95% | 95 | Pod |
| KubePersistentVolumeFillingUPod | The PersistentVolume claimed by {{ $labels.persistentvolumeclaim }} in Namespace {{ $labels.namespace }} is only {{ $value \| humanizePercentage }} free. | NA | Cluster |
| KubeletClientCertificateExpiratioNode | Client certificate for Kubelet on node {{ $labels.node }} expires in {{ $value \| humanizeDuration }}. | NA | Node |
| KubeletPodStartUpLatencyHigh | Kubelet Pod startup 99th percentile latency is {{ $value }} seconds on node {{ $labels.node }}. \| 60 | Pod |
| KubePersistentVolumeInodesFillingUPod | The PersistentVolume claimed by {{ $labels.persistentvolumeclaim }} in Namespace {{ $labels.namespace }} only has {{ $value \| humanizePercentage }} free inodes. | NA | Cluster |
| KubeletServerCertificateExpiratioNode | Server certificate for Kubelet on node {{ $labels.node }} expires in {{ $value \| humanizeDuration }}. | NA | Node |
| KubePersistentVolumeErrors | The persistent volume {{ $labels.persistentvolume }} has status {{ $labels.phase }} | 0 | Cluster |
| KubeletClientCertificateRenewalErrors | Kubelet has failed to renew its client certificate. | 0 | Node |
| KubeletServerCertificateRenewalErrors | Kubelet has failed to renew its server certificate. | 0 | Node |
| KubeQuotaFullyUsed | Namespace {{ $labels.namespace }} is using {{ $value \| humanizePercentage }} of its {{ $labels.resource }} quota | 1 | Node |
| KubeQuotaExceeded | Namespace {{ $labels.namespace }} is using {{ $value \| humanizePercentage }} of its {{ $labels.resource }} quota. | 1 | Node |

## Legacy Container insights metric alerts (preview)

> [!IMPORTANT]
> Metric rules in Container insights will be retired on May 31, 2024 (this was previously announced as March 14, 2026). If you already enabled these alert rules, you should disable the legacy alerts and enable the new experience. As of August 15, 2023, you can longer configure new custom metric recommended alerts using the portal.

### Disable metric alert rules

1. From the **Insights** menu for your cluster, select **Recommended alerts (preview)**.
2. Change the status for each alert rule to **Disabled**.


## Next steps

- Read about the [different alert rule types in Azure Monitor](../alerts/alerts-types.md).
- Read about [alerting rule groups in Azure Monitor managed service for Prometheus](../essentials/prometheus-rule-groups.md).

