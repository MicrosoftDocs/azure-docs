---
title: What's new in Azure Monitor documentation
description: Significant updates to Azure Monitor documentation updated each month.
ms.service:  azure-monitor
ms.subservice: 
ms.topic: overview
author: bwren
ms.author: bwren
ms.date: 01/05/2020

---

# What's new in Azure Monitor documentation

## December, 2019

### Agents
- [Connect Linux computers to Azure Monitor](platform/agent-linux.md) - New article.

### Alerts
- [Create a metric alert with a Resource Manager template](platform/alerts-metric-create-templates.md) - Added example for custom metric.
- [Creating Alerts with Dynamic Thresholds in Azure Monitor](platform/alerts-dynamic-thresholds.md) - Added section on interpreting dynamic threshold charts.
- [Overview of alerting and notification monitoring in Azure](platform/alerts-overview.md) - Updated Resource Graph query.
- [Supported resources for metric alerts in Azure Monitor](platform/alerts-metric-near-real-time.md) - Update to metrics and dimensions supported.
- [Switch from legacy Log Analytics alerts API into new Azure Alerts API](platform/alerts-log-api-switch.md) - Added note on modified alert name.
- [Understand how metric alerts work in Azure Monitor.](platform/alerts-metric-overview.md) - Added supported resource types for monitoring at scale.

### Application Insights
- [Application Insights for Worker Service apps (non-HTTP apps)](app/worker-service.md) - Added default logging level to C# code. Updated package reference version.
- [ApplicationInsights.config reference - Azure](app/configuration-with-applicationinsights-config.md) - Updated sample code.
- [Automate Azure Application Insights with PowerShell](app/powershell.md) - Update to Resource Manager template.
- [Azure Monitor Application Insights NuGet packages](app/nuget.md) - Updated package versions.
- [Create a new Azure Application Insights resource](app/create-new-resource.md) - Note added to globally unique name.
- [Diagnose with Live Metrics Stream - Azure Application Insights](app/live-stream.md) - Updated ASP.NET Core SDK version requirement.
- [Event counters in Application Insights](app/eventcounters.md) - Updated category and table to customMetrics.
- [Explore Java trace logs in Azure Application Insights](app/java-trace-logs.md) - Added configuration for Java agent logging threshold.
- [IP addresses used by Application Insights and Log Analytics](app/ip-addresses.md) - Updated IP addresses for Live Metrics Stream.
- [Monitor Azure app services performance](app/azure-web-apps.md) - Added support for ASP.NET Core 3.0. 
- [Monitor Python applications with Azure Monitor (preview)](app/opencensus-python.md) - Added clarification for OpenCensus Python schema mapping to Azure .Monitor schema
- [Release notes for Azure Application Insights](app/release-notes.md) - Added notes for older releases.
- [Telemetry channels in Azure Application Insights](app/telemetry-channels.md) - Updated duration for discarded data during extended period of lost connection.
- [Telemetry sampling in Azure Application Insights](app/sampling.md) - Corrected code snippet for custom TelemetryInitializer.
- [Troubleshoot Application Insights in a Java web project](app/java-troubleshoot.md) - Removed statement about not supporting dependency collection in JDK 9.

### Insights and solutions
- [Azure Monitor for containers Frequently Asked Questions](insights/container-insights-faq.md) - Added question on Image and Name fields.
- [Azure SQL Analytics solution in Azure Monitor](insights/azure-sql.md) - Updated Database waits Managed Instance support.
- [Configure Azure Monitor for containers agent data collection](insights/container-insights-agent-config.md) - Added setting for enrich_container_logs.
- [Configure Hybrid Kubernetes clusters with Azure Monitor for containers](insights/container-insights-hybrid-setup.md) - Added troubleshooting section.
- [Monitor Active Directory replication status with Azure Monitor](insights/ad-replication-status.md) - .NET Framework prerequisite updated.
- [Network Performance Monitor solution in Azure](insights/network-performance-monitor.md) - Added supported regions.
- [Optimize your Active Directory environment with Azure Monitor](insights/ad-assessment.md) - .NET Framework prerequisite updated.
- [Optimize your SQL Server environment with Azure Monitor](insights/sql-assessment.md) - .NET Framework prerequisite updated.
- [Optimize your System Center Operations Manager environment with Azure Log Analytics](insights/scom-assessment.md) - .NET Framework prerequisite updated.
- [Supported connections with IT Service Management Connector in Azure Log Analytics](platform/itsmc-connections.md) - Added New York to prerequisite client ID and client secret.

### Logs
- [Delete and recover Azure Log Analytics workspace](platform/delete-workspace.md) - Added PowerShell method.
- [Designing your Azure Monitor Logs deployment](platform/design-logs-deployment.md) - Ingestion rate for a workspace increased.

### Metrics
- [Azure Monitor platform metrics exportable via Diagnostic Settings](platform/metrics-supported-export-diagnostic-settings.md) - New article.

### Platform logs
Multiple articles updated as part of restructure of content for platform logs based on new feature for configuring activity log using diagnostic settings.

- [Archive Azure resource logs to storage account](platform/resource-logs-collect-storage.md)
- [Azure Activity Log event schema](platform/activity-log-schema.md)
- [Azure Monitor service limits](service-limits.md)
- [Collect and analyze Azure activity logs in Log Analytics workspace](platform/activity-log-collect.md)
- [Collect Azure Activity log with diagnostic settings (preview) - Azure Monitor](platform/diagnostic-settings-legacy.md)
- [Collect Azure Activity logs into a Log Analytics workspace across Azure tenants](platform/activity-log-collect-tenants.md)
- [Collect Azure resource logs in Log Analytics workspace](platform/resource-logs-collect-workspace.md)
- [Create diagnostic setting in Azure using Resource Manager template](platform/diagnostic-settings-template.md)
- [Create diagnostic setting to collect logs and metrics in Azure](platform/diagnostic-settings.md)
- [Export the Azure Activity Log](platform/activity-log-export.md)
- [Overview of Azure platform logs](platform/platform-logs-overview.md)
- [Stream Azure monitoring data to event hub](platform/stream-monitoring-data-event-hubs.md)
- [Stream Azure platform logs to an event hub](platform/resource-logs-stream-event-hubs.md)

### Quickstarts and tutorials

- [Create a metrics chart in Azure Monitor](learn/tutorial-metrics-explorer.md) - New article.
- [Collect resource logs from an Azure Resource and analyze with Azure Monitor](learn/tutorial-resource-logs.md) - New article.
- [Monitor an Azure resource with Azure Monitor](learn/quick-monitor-azure-resource.md) - New article.
   
## Next steps

- If you'd like to contribute to Azure Monitor documentation, see the [Docs Contributor Guide](https://docs.microsoft.com/contribute/).