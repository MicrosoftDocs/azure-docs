---
title: Metric alert rules for Kubernetes clusters (legacy)
description: Describes how to create recommended metric alerts rules for a Kubernetes cluster in Container insights.
ms.topic: conceptual
ms.date: 03/13/2023
ms.reviewer: aul
---

# Metric alert rules for Kubernetes clusters (legacy)

Metric alerts in Azure Monitor proactively identify issues related to system resources of your Azure resources, including monitored Kubernetes clusters. Container insights provides preconfigured alert rules so that you don't have to create your own. This article describes the different types of alert rules you can create and how to enable and configure them.

> [!IMPORTANT]
> Azure Monitor now supports alerts based on Prometheus metrics, and metric rules in Container insights will be retired on May 31, 2024 (this was previously announced as March 14, 2026). If you already use alerts based on custom metrics, you should migrate to Prometheus alerts and disable the equivalent custom metric alerts. As of August 15, 2023, you are no longer be able to configure new custom metric recommended alerts using the portal.


> [!IMPORTANT]
> Metric alerts (preview) are retiring and no longer recommended. As of August 15, 2023, you will no longer be able to configure new custom metric recommended alerts using the portal. Please refer to the migration guidance at [Migrate from Container insights recommended alerts to Prometheus recommended alert rules (preview)](#migrate-from-metric-rules-to-prometheus-rules-preview).

### Prerequisites

You might need to enable collection of custom metrics for your cluster. See [Metrics collected by Container insights](container-insights-custom-metrics.md).
  
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
If you're using metric alert rules to monitor your Kubernetes cluster, you should transition to Prometheus recommended alert rules (preview) before May 31, 2024 when metric alerts are retired.

1. Follow the steps at [Enable Prometheus alert rules](#enable-prometheus-alert-rules) to configure Prometheus recommended alert rules (preview).
2. Follow the steps at [Disable metric alert rules](#disable-metric-alert-rules) to remove metric alert rules from your clusters.


## View alerts

View fired alerts for your cluster from **Alerts** in the **Monitor** menu in the Azure portal with other fired alerts in your subscription. You can also select **View in alerts** on the **Recommended alerts** pane to view alerts from custom metrics.

## Next steps

- Read about the [different alert rule types in Azure Monitor](../alerts/alerts-types.md).
- Read about [alerting rule groups in Azure Monitor managed service for Prometheus](../essentials/prometheus-rule-groups.md).

