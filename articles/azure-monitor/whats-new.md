---
title: What's new in Azure Monitor documentation
description: Significant updates to Azure Monitor documentation
ms.service:  azure-monitor
ms.subservice: 
ms.topic: overview
author: bwren
ms.author: bwren
ms.date: 01/5/20

---

# What's new in Azure Monitor documentation

## December, 2019

### Agents
- [Connect Linux computers to Azure Monitor](platform/agent-linux) - New article.

### Alerts
- [Create a metric alert with a Resource Manager template](platform/alerts-metric-create-templates) - Added example for custom metric.
- [Creating Alerts with Dynamic Thresholds in Azure Monitor](platform/alerts-dynamic-thresholds) - Added section on interpreting dynamic threshold charts.
- [Overview of alerting and notification monitoring in Azure](platform/alerts-overview) - Updated Resource Graph query.
- [Supported resources for metric alerts in Azure Monitor](platform/alerts-metric-near-real-time) - Update to metrics and dimensions supported.
- [Switch from legacy Log Analytics alerts API into new Azure Alerts API](platform/alerts-log-api-switch) - Added note on modified alert name.
- [Understand how metric alerts work in Azure Monitor.](platform/alerts-metric-overview) - Added supported resource types for monitoring at scale.

### Application Insights
- [Application Insights for Worker Service apps (non-HTTP apps)](app/worker-service) - Added default logging level to C# code. Updated package reference version.
- [ApplicationInsights.config reference - Azure](app/configuration-with-applicationinsights-config) - Updated sample code.
- [Automate Azure Application Insights with PowerShell](app/powershell) - Update to Resource Manager template.
- [Azure Monitor Application Insights NuGet packages](app/nuget) - Updated package versions.
- [Create a new Azure Application Insights resource](app/create-new-resource) - Note added to globally unique name.
- [Diagnose with Live Metrics Stream - Azure Application Insights](app/live-stream) - Updated ASP.NET Core SDK version requirement.
- [Event counters in Application Insights](app/eventcounters) - Updated category and table to customMetrics.
- [Explore Java trace logs in Azure Application Insights](app/java-trace-logs) - Added configuration for Java agent logging threshold.
- [IP addresses used by Application Insights and Log Analytics](app/ip-addresses) - Updated IP addresses for Live Metrics Stream.
- [Monitor Azure app services performance](app/azure-web-apps) - Added support for ASP.NET Core 3.0. 
- [Monitor Python applications with Azure Monitor (preview)](app/opencensus-python) - Added clarification for OpenCensus Python schema mapping to Azure .Monitor schema
- [Release notes for Azure Application Insights](app/release-notes) - Added notes for older releases.
- [Telemetry channels in Azure Application Insights](app/telemetry-channels) - Updated duration for discarded data during extended period of lost connection.
- [Telemetry sampling in Azure Application Insights](app/sampling) - Corrected code snippet for custom TelemetryInitializer.
- [Troubleshoot Application Insights in a Java web project](app/java-troubleshoot) - Removed statement about not supporting dependency collection in JDK 9.

### Insights and solutions
- [Azure Monitor for containers Frequently Asked Questions](insights/container-insights-faq) - Added question on Image and Name fields.
- [Azure SQL Analytics solution in Azure Monitor](insights/azure-sql) - Updated Database waits Managed Instance support.
- [Configure Azure Monitor for containers agent data collection](insights/container-insights-agent-config) - Added settomg fpr enrich_container_logs.
- [Configure Hybrid Kubernetes clusters with Azure Monitor for containers](insights/container-insights-hybrid-setup) - Added troubleshooting section.
- [Monitor Active Directory replication status with Azure Monitor](insights/ad-replication-status) - .NET Framework prerequisite updated.
- [Network Performance Monitor solution in Azure](insights/network-performance-monitor) - Added supported regions.
- [Optimize your Active Directory environment with Azure Monitor](insights/ad-assessment) - .NET Framework prerequisite updated.
- [Optimize your SQL Server environment with Azure Monitor](insights/sql-assessment) - .NET Framework prerequisite updated.
- [Optimize your System Center Operations Manager environment with Azure Log Analytics](insights/scom-assessment) - .NET Framework prerequisite updated.
- [Supported connections with IT Service Management Connector in Azure Log Analytics](platform/itsmc-connections) - Added New York to prerequisite client ID and client secret.

### Logs
- [Delete and recover Azure Log Analytics workspace](platform/delete-workspace) - Added PowerShell method.
- [Designing your Azure Monitor Logs deployment](platform/design-logs-deployment) - Ingestion rate for a workspace increased.

### Metrics
- [Azure Monitor platform metrics exportable via Diagnostic Settings](platform/metrics-supported-export-diagnostic-settings.md) - New article

### Platform logs
Multiple articles updated as part of restructure of content for platform logs based on new feature for configuring activity log using diagnostic settings.

- [Archive Azure resource logs to storage account](platform/resource-logs-collect-storage)
- [Azure Activity Log event schema](platform/activity-log-schema)
- [Azure Monitor service limits](service-limits)
- [Collect and analyze Azure activity logs in Log Analytics workspace](platform/activity-log-collect)
- [Collect Azure Activity log with diagnostic settings (preview) - Azure Monitor](platform/diagnostic-settings-legacy)
- [Collect Azure Activity logs into a Log Analytics workspace across Azure tenants](platform/activity-log-collect-tenants)
- [Collect Azure resource logs in Log Analytics workspace](platform/resource-logs-collect-workspace)
- [Create diagnostic setting in Azure using Resource Manager template](platform/diagnostic-settings-template)
- [Create diagnostic setting to collect logs and metrics in Azure](platform/diagnostic-settings)
- [Export the Azure Activity Log](platform/activity-log-export)
- [Overview of Azure platform logs](platform/platform-logs-overview)
- [Stream Azure monitoring data to event hub](platform/stream-monitoring-data-event-hubs)
- [Stream Azure platform logs to an event hub](platform/resource-logs-stream-event-hubs)

### Quickstarts and tutorials

- [Create a metrics chart in Azure Monitor](learn/tutorial-metrics-explorer.md) - New article
- [Collect resource logs from an Azure Resource and analyze with Azure Monitor](learn/tutorial-resource-logs.md) - New article
- [Monitor an Azure resource with Azure Monitor](learn/quick-monitor-azure-resource.md) - New article
   
## Next steps
