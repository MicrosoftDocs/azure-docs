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

### New articles

- [Azure Monitor platform metrics exportable via Diagnostic Settings](mplatform/etrics-supported-export-diagnostic-settings.md)
- [Collect Azure Activity log with diagnostic settings (preview)](diagnostic-settings-legacy.md)
- [Collect data from an Azure virtual machine with Azure Monitor](quick-monitor-azure-resource.md)
- [Collect resource logs from an Azure Resource and analyze with Azure Monitor](learn/tutorial-resource-logs.md)
- [Connect Linux computers to Azure Monitor](platform/agent-linux.md)
- [Tutorial - Create a metrics chart in Azure Monitor](learn/tutorial-metrics-explorer.md)


#### Agents
- [Connect Linux computers to Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/agent-linux) - Updated details related to OMS gateway.

#### Alerts
- [Create a metric alert with a Resource Manager template](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-metric-create-templates) - Added example for custom metric.
- [Creating Alerts with Dynamic Thresholds in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-dynamic-thresholds) - Added section on interpreting dynamic threshold charts.
- [Overview of alerting and notification monitoring in Azure](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-overview) - Updated Resource Graph query.
- [Supported resources for metric alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-metric-near-real-time) - Update to metrics and dimensions supported.
- [Switch from legacy Log Analytics alerts API into new Azure Alerts API](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-log-api-switch) - Added note on modified alert name.
- [Understand how metric alerts work in Azure Monitor.](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-metric-overview) - Added supported resource types for monitoring at scale.

#### Application Insights
- [Application Insights for Worker Service apps (non-HTTP apps)](https://docs.microsoft.com/azure/azure-monitor/app/worker-service) - Added default logging level to C# code. Updated package reference version.
- [ApplicationInsights.config reference - Azure](https://docs.microsoft.com/azure/azure-monitor/app/configuration-with-applicationinsights-config) - Updated sample code.
- [Automate Azure Application Insights with PowerShell](https://docs.microsoft.com/azure/azure-monitor/app/powershell) - Update to Resource Manager template.
- [Azure Monitor Application Insights NuGet packages](https://docs.microsoft.com/azure/azure-monitor/app/nuget) - Updated package versions.
- [Create a new Azure Application Insights resource](https://docs.microsoft.com/azure/azure-monitor/app/create-new-resource) - Note added to globally unique name.
- [Diagnose with Live Metrics Stream - Azure Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/live-stream) - Updated ASP.NET Core SDK version requirement.
- [Event counters in Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/eventcounters) - Updated category and table to customMetrics.
- [Explore Java trace logs in Azure Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/java-trace-logs) - Added configuration for Java agent logging threshold.
- [IP addresses used by Application Insights and Log Analytics](https://docs.microsoft.com/azure/azure-monitor/app/ip-addresses) - Updated IP addresses for Live Metrics Stream.
- [Monitor Azure app services performance](https://docs.microsoft.com/azure/azure-monitor/app/azure-web-apps) - Added support for ASP.NET Core 3.0. 
- [Monitor Python applications with Azure Monitor (preview)](https://docs.microsoft.com/azure/azure-monitor/app/opencensus-python) - Added clarification for OpenCensus Python schema mapping to Azure .Monitor schema
- [Release notes for Azure Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/release-notes) - Added notes for older releases.
- [Telemetry channels in Azure Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/telemetry-channels) - Updated duration for discarded data during extended period of lost connection.
- [Telemetry sampling in Azure Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/sampling) - Corrected code snippet for custom TelemetryInitializer.
- [Troubleshoot Application Insights in a Java web project](https://docs.microsoft.com/azure/azure-monitor/app/java-troubleshoot) - Removed statement about not supporting dependency collection in JDK 9.

#### Insights and solutions
- [Azure Monitor for containers Frequently Asked Questions](https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-faq) - Added question on Image and Name fields.
- [Azure SQL Analytics solution in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/insights/azure-sql) - Updated Database waits Managed Instance support.
- [Configure Azure Monitor for containers agent data collection](https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-agent-config) - Added settomg fpr enrich_container_logs.
- [Configure Hybrid Kubernetes clusters with Azure Monitor for containers](https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-hybrid-setup) - Added troubleshooting section.
- [Monitor Active Directory replication status with Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/insights/ad-replication-status) - .NET Framework prerequisite updated.
- [Network Performance Monitor solution in Azure](https://docs.microsoft.com/azure/azure-monitor/insights/network-performance-monitor) - Added supported regions.
- [Optimize your Active Directory environment with Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/insights/ad-assessment) - .NET Framework prerequisite updated.
- [Optimize your SQL Server environment with Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/insights/sql-assessment) - .NET Framework prerequisite updated.
- [Optimize your System Center Operations Manager environment with Azure Log Analytics](https://docs.microsoft.com/azure/azure-monitor/insights/scom-assessment) - .NET Framework prerequisite updated.
- [Supported connections with IT Service Management Connector in Azure Log Analytics](https://docs.microsoft.com/azure/azure-monitor/platform/itsmc-connections) - Added New York to prerequisite client ID and client secret.

#### Logs
- [Delete and recover Azure Log Analytics workspace](https://docs.microsoft.com/azure/azure-monitor/platform/delete-workspace) - Added PowerShell method.
- [Designing your Azure Monitor Logs deployment](https://docs.microsoft.com/azure/azure-monitor/platform/design-logs-deployment) - Ingestion rate for a workspace increased.
  
#### Platform logs
Multiple articles updated as part of restructure of content for platform logs based on new feature for configuring activity log using diagnostic settings.

- [Archive Azure resource logs to storage account](https://docs.microsoft.com/azure/azure-monitor/platform/resource-logs-collect-storage)
- [Azure Activity Log event schema](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-schema)
- [Azure Monitor service limits](https://docs.microsoft.com/azure/azure-monitor/service-limits)
- [Collect and analyze Azure activity logs in Log Analytics workspace](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-collect)
- [Collect Azure Activity log with diagnostic settings (preview) - Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)
- [Collect Azure Activity logs into a Log Analytics workspace across Azure tenants](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-collect-tenants)
- [Collect Azure resource logs in Log Analytics workspace](https://docs.microsoft.com/azure/azure-monitor/platform/resource-logs-collect-workspace)
- [Create diagnostic setting in Azure using Resource Manager template](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-template)
- [Create diagnostic setting to collect logs and metrics in Azure](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings)
- [Export the Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-export)
- [Overview of Azure platform logs](https://docs.microsoft.com/azure/azure-monitor/platform/platform-logs-overview)
- [Stream Azure monitoring data to event hub](https://docs.microsoft.com/azure/azure-monitor/platform/stream-monitoring-data-event-hubs)
- [Stream Azure platform logs to an event hub](https://docs.microsoft.com/azure/azure-monitor/platform/resource-logs-stream-event-hubs)



## Next steps
