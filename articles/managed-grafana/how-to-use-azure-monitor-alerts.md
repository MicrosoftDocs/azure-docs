---
title: Use Azure Monitor alerts with Azure Managed Grafana
description: Learn how to set up Azure Monitor alerts and use them with Azure Managed Grafana
ms.service: managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 11/14/2023
--- 

# Use Azure Monitor alerts with Grafana

In this guide, you learn how to set up Azure Monitor alerts and use them with Azure Managed Grafana.

Both Azure Monitor and Grafana provide alerting functions.

> [!NOTE]
> Grafana alerts are only available for instances in the Standard plan.

Grafana provides an alerting function for a number of [supported data sources](https://grafana.com/docs/grafana/latest/alerting/fundamentals/data-source-alerting/#data-sources-and-grafana-alerting). Alert rules are processed in your Azure Managed Grafana workspace and they share the same compute resources and query throttling limits with dashboard rendering. For more information about these limits, refer to [performance considerations and limitations](https://grafana.com/docs/grafana/latest/alerting/set-up/performance-limitations/#performance-considerations-and-limitations).

Azure Monitor has its own [alert system](../azure-monitor/alerts/alerts-overview.md). It offers many advantages:

* Scalability: Azure Monitor alerts are evaluated in the Azure Monitor platform that's been architected to autoscale to your needs.
* Compliance: Azure Monitor alerts and [action groups](../azure-monitor/alerts/action-groups.md) are governed by Azure's compliance standards on privacy, including unsubscribe support.
* Customized notifications and actions: Azure Monitor alerts use action groups to send notifications by email, SMS, voice, and push notifications. These events can be configured to trigger further actions implemented in Functions, Logic apps, webhook, and other supported action types.
* Consistent resource management: Azure Monitor alerts are managed as Azure resources. They can be created, updated and viewed using Azure APIs and tools, such as ARM templates, Azure CLI or SDKs.

For any Azure Monitor service, including Azure Monitor Managed Service for Prometheus, you should define and manage your alert rules in Azure Monitor. You can view fired and resolved alerts in the [Azure Alert Consumption dashboard](https://grafana.com/grafana/dashboards/15128-azure-alert-consumption/) included in Azure Managed Grafana.

> [!IMPORTANT]
> To set up alerts for Azure Monitor, we recommend you directly use Azure Monitor's native alerting function. Using Grafana alerts with an Azure Monitor service isn't officially supported by Microsoft.

## Create Azure Monitor alerts

Define alert rules in Azure Monitor based on the type of alerts:

| Alert Type      | Description                                      |
|-----------------|-----------------------------------------------------------------------------------------|
| Managed service for Prometheus | Use [Prometheus rule groups](../azure-monitor/essentials/prometheus-rule-groups.md). A set of [predefined Prometheus alert rules](../azure-monitor/containers/container-insights-metric-alerts.md) and [recording rules](../azure-monitor/essentials/prometheus-metrics-scrape-default.md#recording-rules) for AKS is available. |
| Other metrics, logs, health | Create new [alert rules](../azure-monitor/alerts/alerts-create-new-alert-rule.md). |

You can view alert state and conditions using the Azure Alert Consumption dashboard in your Azure Managed Grafana workspace.

## Next steps

In this how-to guide, you learned how to set up alerts for Azure Monitor and consume them in Azure Managed Grafana. To learn how to use Grafana alerts for other data sources, see [Grafana alerting](https://grafana.com/docs/grafana/latest/alerting/) and [setting up email notifications in Azure Managed Grafana](how-to-smtp-settings.md).
