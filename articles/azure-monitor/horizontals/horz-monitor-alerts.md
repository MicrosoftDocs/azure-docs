---
author: rboucher
ms.author: robb
ms.service: azure-monitor
ms.topic: include
ms.date: 03/29/2024
---

## Alerts

Azure Monitor alerts proactively notify you when specific conditions are found in your monitoring data. Alerts allow you to identify and address issues in your system before your customers notice them. For more information, see [Azure Monitor alerts](/azure/azure-monitor/alerts/alerts-overview).

There are many sources of common alerts for Azure resources. For examples of common alerts for Azure resources, see [Sample log alert queries](/azure/azure-monitor/alerts/alerts-log-alert-query-samples). The [Azure Monitor Baseline Alerts (AMBA)](https://aka.ms/amba) site provides a semi-automated method of implementing important platform metric alerts, dashboards, and guidelines. The site applies to a continually expanding subset of Azure services, including all services that are part of the Azure Landing Zone (ALZ).

The common alert schema standardizes the consumption of Azure Monitor alert notifications. For more information, see [Common alert schema](/azure/azure-monitor/alerts/alerts-common-schema).

### Types of alerts

You can alert on any metric or log data source in the Azure Monitor data platform. There are many different types of alerts depending on the services you're monitoring and the monitoring data you're collecting. Different types of alerts have various benefits and drawbacks. For more information, see [Choose the right monitoring alert type](/azure/azure-monitor/alerts/alerts-types).

The following list describes the types of Azure Monitor alerts you can create:

- [Metric alerts](/azure/azure-monitor/alerts/alerts-types#metric-alerts) evaluate resource metrics at regular intervals. Metrics can be platform metrics, custom metrics, logs from Azure Monitor converted to metrics, or Application Insights metrics. Metric alerts can also apply multiple conditions and dynamic thresholds.
- [Log alerts](/azure/azure-monitor/alerts/alerts-types#log-alerts) allow users to use a Log Analytics query to evaluate resource logs at a predefined frequency.
- [Activity log alerts](/azure/azure-monitor/alerts/alerts-types#activity-log-alerts) trigger when a new activity log event occurs that matches defined conditions. Resource Health alerts and Service Health alerts are activity log alerts that report on your service and resource health.

Some Azure services also support [smart detection alerts](/azure/azure-monitor/alerts/alerts-types#smart-detection-alerts), [Prometheus alerts](/azure/azure-monitor/alerts/alerts-types#prometheus-alerts), or [recommended alert rules](/azure/azure-monitor/alerts/alerts-manage-alert-rules#enable-recommended-alert-rules-in-the-azure-portal).

For some services, you can monitor at scale by applying the same metric alert rule to multiple resources of the same type that exist in the same Azure region. Individual notifications are sent for each monitored resource. For supported Azure services and clouds, see [Monitor multiple resources with one alert rule](/azure/azure-monitor/alerts/alerts-types#monitor-multiple-resources-with-one-alert-rule).

