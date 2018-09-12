---
title: Sources of monitoring data in Azure
description: Learn about all the monitoring data sources available on Azure today.
author: johnkemnetz
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 06/12/2018
ms.author: johnkem
ms.component: ""
---
# Consume monitoring data from Azure

Across the Azure platform, we are bringing together monitoring data in a single place with the Azure Monitor pipeline, but practically acknowledge that today not all monitoring data is available in that pipeline yet. In this article, we will summarize the various ways you can programmatically access monitoring data from Azure services.

## Options for data consumption

| Data type | Category | Supported Services | Methods of access |
| --- | --- | --- | --- |
| Azure Monitor platform-level metrics | Metrics | [See list here](monitoring-supported-metrics.md) | <ul><li>**REST API:** [Azure Monitor Metric API](https://docs.microsoft.com/rest/api/monitor/metrics)</li><li>**Storage blob or event hub:** [Diagnostic Settings](monitoring-overview-of-diagnostic-logs.md#diagnostic-settings)</li></ul> |
| Compute guest OS metrics (eg. perf counters) | Metrics | [Windows](../virtual-machines-dotnet-diagnostics.md) and Linux Virtual Machines (v2), [Cloud Services](../cloud-services/cloud-services-dotnet-diagnostics-trace-flow.md), [Service Fabric](../service-fabric/service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md) | <ul><li>**Storage table or blob:** [Windows or Linux Azure diagnostics](../cloud-services/cloud-services-dotnet-diagnostics-storage.md)</li><li>**Event hub:** [Windows Azure diagnostics](../event-hubs/event-hubs-streaming-azure-diags-data.md)</li></ul> |
| Custom or application metrics | Metrics | Any application instrumented with Application Insights | <ul><li>**REST API:** [Application Insights REST API](https://dev.applicationinsights.io/reference)</li></ul> |
| Storage metrics | Metrics | Azure Storage | <ul><li>**Storage table:** [Storage Analytics](https://docs.microsoft.com/rest/api/storageservices/storage-analytics)</li></ul> |
| Billing data | Metrics | All Azure services | <ul><li>**REST API:** [Azure Resource Usage and RateCard APIs](../billing/billing-usage-rate-card-overview.md)</li></ul> |
| Activity Log | Events | All Azure services | <ul><li>**REST API:** [Azure Monitor Events API](https://docs.microsoft.com/rest/api/monitor/eventcategories)</li><li>**Storage blob or event hub:** [Log Profile](monitoring-overview-activity-logs.md#export-the-activity-log-with-a-log-profile)</li></ul> |
| Azure Monitor Diagnostic Logs | Events | [See list here](monitoring-diagnostic-logs-schema.md) | <ul><li>**Storage blob or event hub:** [Diagnostic Settings](monitoring-overview-of-diagnostic-logs.md#diagnostic-settings)</li></ul> |
| Compute guest OS logs (eg. IIS, ETW, syslogs) | Events | [Windows](../virtual-machines-dotnet-diagnostics.md) and Linux Virtual Machines (v2), [Cloud Services](../cloud-services/cloud-services-dotnet-diagnostics-trace-flow.md), [Service Fabric](../service-fabric/service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md) | <ul><li>**Storage table or blob:** [Windows or Linux Azure diagnostics](../cloud-services/cloud-services-dotnet-diagnostics-storage.md)</li><li>**Event hub:** [Windows Azure diagnostics](../event-hubs/event-hubs-streaming-azure-diags-data.md)</li></ul> |
| App Service logs | Events | App services | <ul><li>**File, table, or blob storage:** [Web app diagnostics](../app-service/web-sites-enable-diagnostic-log.md)</li></ul> |
| Storage logs | Events | Azure Storage | <ul><li>**Storage table:** [Storage Analytics](https://docs.microsoft.com/rest/api/storageservices/storage-analytics)</li></ul> |
| Security Center alerts | Events | Azure Security Center | <ul><li>**REST API:** [Security Alerts](https://msdn.microsoft.com/library/mt704050.aspx)</li></ul> |
| Active Directory reporting | Events | Azure Active Directory | <ul><li>**REST API:** [Azure Active Directory graph API](../active-directory/active-directory-reporting-api-getting-started.md)</li></ul> |
| Security Center resource status | Status | [All supported resources](https://msdn.microsoft.com/library/mt704041.aspx#Anchor_1) | <ul><li>**REST API:** [Security Statuses](https://msdn.microsoft.com/library/mt704041.aspx)</li></ul> |
| Resource Health | Status | Supported services | <ul><li>**REST API:** [Resource health REST API](https://azure.microsoft.com/blog/reduce-troubleshooting-time-with-azure-resource-health/)</li></ul> |
| Azure Monitor metric alerts | Notifications | [See list here](monitoring-supported-metrics.md) | <ul><li>**Webhook:** [Azure metric alerts](insights-webhooks-alerts.md)</li></ul> |
| Azure Monitor Activity Log alerts | Notifications | All Azure services | <ul><li>**Webhook:** Azure Activity Log alerts</li></ul> |
| Autoscale notifications | Notifications | [See list here](monitoring-overview-autoscale.md#supported-services-for-autoscale) | <ul><li>**Webhook:** [Autoscale notification webhook payload schema](insights-autoscale-to-webhook-email.md#autoscale-notification-webhook-payload-schema)</li></ul> |
| Log Search Query alerts | Notifications | Log Analytics | <ul><li>**Webhook:** [Webhook action for log alert rules](../monitoring-and-diagnostics/monitor-alerts-unified-log-webhook.md)</li></ul> |
| Application Insights metric alerts | Notifications | Application Insights | <ul><li>**Webhook:** [Application Insights alerts](../application-insights/app-insights-alerts.md)</li></ul> |
| Application Insights web tests | Notifications | Application Insights | <ul><li>**Webhook:** [Application Insights alerts](../application-insights/app-insights-alerts.md)</li></ul> |

## Next steps

- Learn more about [Azure Monitor metrics](monitoring-overview-metrics.md)
- Learn more about [the Azure Activity Log](monitoring-overview-activity-logs.md)
- Learn more about [Azure Diagnostic Logs](monitoring-overview-of-diagnostic-logs.md)
