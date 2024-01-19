---
title: Metric alert rules for Kubernetes clusters (preview)
description: Describes how to enable recommended metric alerts rules for a Kubernetes cluster in Azure Monitor.
ms.topic: conceptual
ms.date: 01/17/2024
ms.reviewer: aul
---

# Metric alert rules for Kubernetes clusters (preview)

Metric alerts in Azure Monitor proactively identify issues related to system resources of your Azure resources, including monitored Kubernetes clusters. This article describes how to quickly enable a set of recommended alerts for Kubernetes and how to edit them after creation.

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

2. The available Prometheus and platform alert rules are displayed with the Prometheus rules organized by pod, cluster, and node level. 

    :::image type="content" source="media/kubernetes-metric-alerts/recommended-alert-rules.png" lightbox="media/kubernetes-metric-alerts/recommended-alert-rules.png" alt-text="Screenshot of set up recommended alert rules blade.":::

2.	Toggle a group of Prometheus rules to enable that set of rules. Expand the group to see the individual rules. You can leave the defaults or disable individual rules and edit their name and severity.

    :::image type="content" source="media/kubernetes-metric-alerts/recommended-alert-rules-enable-prometheus.png" lightbox="media/kubernetes-metric-alerts/recommended-alert-rules-enable-prometheus.png" alt-text="Screenshot of enabling Prometheus alert rule.":::

3. Toggle a platform metric rule to enable that rule. You can expand the rule to modify its details such as the name, severity, and threshold.

    :::image type="content" source="media/kubernetes-metric-alerts/recommended-alert-rules-enable-platform.png" lightbox="media/kubernetes-metric-alerts/recommended-alert-rules-enable-platform.png" alt-text="Screenshot of enabling platform metric alert rule.":::

4. Either select one or more notification methods to create a new action group, or sel;ect an existing action group with the notification details for this set of alert rules.
5.	Click **Save** to save the rule group.


### [ARM template](#tab/arm)

Download the [Community alerts template.](https://aka.ms/azureprometheus-communityalerts) and deploy using any valid method for deploying Resource Manager templates. For examples of different methods, see [Deploy the sample templates](../resource-manager-samples.md#deploy-the-sample-templates).

The template uses the parameters in the following table:

| Parameter | Description |
|:---|:---|
| clusterName | Name of the cluster. |
| clusterResourceId | Resource ID of the cluster. |
| actionGroupResourceId | Resource ID of action group that defines responses to alerts. |
| azureMonitorWorkspaceResourceId | Resource ID of the Azure Monitor workspace receiving the cluster's Prometheus metrics. |
| location | Region to store the alert rule group. |


### [Bicep](#tab/bicep)

Download the [Community alerts template.](https://aka.ms/azureprometheus-alerts-bicep) and deploy using any valid method for deploying Resource Manager templates. See the [README.md](https://github.com/Azure/prometheus-collector/blob/main/AddonBicepTemplate/README.md) file for more details.

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

    :::image type="content" source="media/kubernetes-metric-alerts/edit-platform-metric-rule.png" lightbox="media/kubernetes-metric-alerts/edit-platform-metric-rule.png" alt-text="Screenshot of option to edit platform metric rule.":::

    3. When you're done editing rules in the group, click **Save** to save the rule group.

4. For platform metrics:

   1. click **Edit** to open the details for the alert rule. Use the guidance in [Create an alert rule](../alerts/alerts-create-metric-alert-rule.md#configure-the-alert-rule-conditions) to modify the rule. 

        :::image type="content" source="media/kubernetes-metric-alerts/edit-platform-metric-rule.png" lightbox="media/kubernetes-metric-alerts/edit-platform-metric-rule.png" alt-text="Screenshot of option to edit platform metric rule.":::

### [ARM template](#tab/arm)

Edit the query and threshold or configure an action group for your alert rules in the ARM template described in [Enable Prometheus alert rules](#enable-prometheus-alert-rules) and redeploy it by using any deployment method.

---

## Apply alert rule group to multiple clusters

Instead of creating multiple Prometheus alert rules for each of your clusters, you can create a single rule group and apply it to all of the clusters that use the same Azure Monitor workspace.

1. View the alert rule group as described in [Edit Prometheus alert rules](#edit-prometheus-alert-rules).
2. From the **Scope** menu, select **All clusters in the workspace** for the **Cluster** setting. 

    :::image type="content" source="media/kubernetes-metric-alerts/prometheus-rule-group-scope.png" lightbox="media/kubernetes-metric-alerts/prometheus-rule-group-scope.png" alt-text="Screenshot of option to edit rule group scope.":::

## Disable alert rule group

### [Azure portal](#tab/portal)

1. View the alert rule group as described in [Edit Prometheus alert rules](#edit-prometheus-alert-rules).
2. From the **Overview** menu, select **Disable**.

    :::image type="content" source="media/kubernetes-metric-alerts/disable-prometheus-rule-group.png" lightbox="media/kubernetes-metric-alerts/disable-prometheus-rule-group.png" alt-text="Screenshot of option to edit rule group scope.":::

### [ARM template](#tab/arm)

Set the **enabled** flag to false for the rule group in the ARM template described in [Enable Prometheus alert rules](#enable-prometheus-alert-rules) and redeploy it by using any deployment method.

---

## Next steps

- Read about the [different alert rule types in Azure Monitor](../alerts/alerts-types.md).
- Read about [alerting rule groups in Azure Monitor managed service for Prometheus](../essentials/prometheus-rule-groups.md).

