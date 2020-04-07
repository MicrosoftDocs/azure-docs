---
title: What's new in Azure Monitor documentation
description: Significant updates to Azure Monitor documentation updated each month.
ms.subservice: 
ms.topic: overview
author: bwren
ms.author: bwren
ms.date: 03/05/2020

---

# What's new in Azure Monitor documentation?
This article provides lists Azure Monitor articles that are either new or have been significantly updated. It will be refreshed the first week of each month to include article updates from the previous month.

## February 2020

### Agents
Multiple updates as part of rewrite of diagnostics extension content.

- [Overview of the Azure monitoring agents](platform/agents-overview.md) - Restructured tables to better clarify unique features of each agent.
- [Azure Diagnostics extension overview](platform/diagnostics-extension-overview.md) - Complete rewrite.
- [Use blob storage for IIS and table storage for events in Azure Monitor](platform/diagnostics-extension-logs.md) - General rewrite for update and clarity.
- [Install and configure Windows Azure diagnostics extension (WAD)](platform/diagnostics-extension-windows-install.md) - New article. 
- [Windows diagnostics extension schema](platform/diagnostics-extension-schema-windows.md) - Reorganized.
- [Send data from Windows Azure diagnostics extension to Azure Event Hubs](platform/diagnostics-extension-stream-event-hubs.md) - Completely rewritten and updated.
- [Store and view diagnostic data in Azure Storage](/azure/cloud-services/diagnostics-extension-to-storage) - Completely rewritten and updated.
- [Log Analytics virtual machine extension for Windows](../virtual-machines/extensions/oms-windows.md) - Better clarifies relationship with Log Analytics agent.
- [Azure Monitor virtual machine extension for Linux](../virtual-machines/extensions/oms-linux.md) - Better clarifies relationship with Log Analytics agent.




### Application Insights
- [Connection strings in Azure Application Insights](app/sdk-connection-string.md) - New article.

### Insights and solutions

#### Azure Monitor for Containers
- [Integrate Azure Active Directory with Azure Kubernetes Service](../aks/azure-ad-integration.md) - Added note for creating a client application to support RBAC-enabled cluster to support Azure Monitor for containers.

#### Azure Monitor for VMs
- [Azure Monitor for VMs (GA) frequently asked questions](insights/vminsights-ga-release-faq.md) - Change to how performance data is stored.

#### Office 365
- [Office 365 management solution in Azure](insights/solution-office-365.md) - Updated deprecation date.


### Logs
- [Optimize log queries in Azure Monitor](log-query/query-optimization.md) - New article.
- [Manage usage and costs for Azure Monitor Logs](platform/manage-cost-storage.md) - Improved sample queries to help understand your usage.

### Metrics
- [Azure Monitor platform metrics exportable via Diagnostic Settings](platform/metrics-supported-export-diagnostic-settings.md) - Added section on change to behavior for nulls and zero values.


### Visualizations
Multiple new articles for view designer to workbooks conversion guide.

- [Azure Monitor view designer to workbooks transition guide](platform/view-designer-conversion-overview.md) - New article.
- [Azure Monitor view designer to workbooks conversion options](platform/view-designer-conversion-options.md) - New article.
- [Azure Monitor view designer to workbooks tile conversions](platform/view-designer-conversion-tiles.md) - New article.
- [Azure Monitor view designer to workbooks conversion summary and access](platform/view-designer-conversion-access.md) - New article.
- [Azure Monitor view designer to workbooks conversion common tasks](platform/view-designer-conversion-tasks.md) - New article.
- [Azure Monitor view designer to workbooks conversion examples](platform/view-designer-conversion-examples.md) - New article.




## January 2020

### General
- [What is monitored by Azure Monitor?](monitor-reference.md) - New article.

### Agents
- [Collect log data with Azure Log Analytics agent](platform/log-analytics-agent.md) - Updated network firewall requirements table.


### Alerts
- [Create and manage action groups in the Azure portal](platform/action-groups.md) - Setting removed for v2 functions that is no longer required.
- [Create a metric alert with a Resource Manager template](platform/alerts-metric-create-templates.md) - Added example for the *ignoreDataBefore* parameter.  Added constraints about multi-criteria rules.
- [Using Log Analytics Alert REST API](platform/api-alerts.md) - JSON example corrected.


### Application Insights
- [IP addresses used by Application Insights and Log Analytics](app/ip-addresses.md) - Updated the Availability test section with how to add an inbound port rule to allow traffic using Azure Network Security Groups.
- [Troubleshoot problems with Azure Application Insights Profiler](app/profiler-troubleshooting.md) - Updated general troubleshooting.
- [Telemetry sampling in Azure Application Insights](app/sampling.md) - Updated and restructured to  improve readability based on customer feedback.


### Data security
- [Azure Monitor customer-managed key configuration](platform/customer-managed-keys.md) - New article.

### Insights and solutions

#### Azure Monitor for Containers
- [Configure Azure Monitor for containers agent data collection](insights/container-insights-agent-config.md) - Added details for upgrading agent on Azure Red Hat OpenShift, and added additional information to distinguish the methods for upgrading agent.
- [Create performance alerts for Azure Monitor for containers](insights/container-insights-alerts.md) - Revised information and updated steps for creating an alert on performance data stored in workspace using workspace-context alerts.
- [Kubernetes monitoring with Azure Monitor for containers](insights/container-insights-analyze.md) - Updated both the overview article and the analyze article regarding support of Windows Kubernetes clusters.
- [Configure Azure Red Hat OpenShift clusters with Azure Monitor for containers](insights/container-insights-azure-redhat-setup.md) - Added details for upgrading agent on Azure Red Hat OpenShift, and added additional information to distinguish the methods for upgrading agent.
- [Configure Hybrid Kubernetes clusters with Azure Monitor for containers](insights/container-insights-hybrid-setup.md) - Updated to reflect added support for secure port:10250 with the Kubelet's cAdvisor.
- [How to manage the Azure Monitor for containers agent](insights/container-insights-manage-agent.md) - Updated details related to behavior and config of metric scraping with Azure Red Hat OpenShift compared to other types of Kubernetes clusters.
- [Configure Azure Monitor for containers Prometheus Integration](insights/container-insights-prometheus-integration.md) - Updated details related to behavior and config of metric scraping with Azure Red Hat OpenShift compared to other types of Kubernetes clusters.
- [How to update Azure Monitor for containers for metrics](insights/container-insights-update-metrics.md) - Updated details related to behavior and config of metric scraping with Azure Red Hat OpenShift compared to other types of Kubernetes clusters.


#### Azure Monitor for VMs
- [Azure Monitor for VMs (GA) frequently asked questions](insights/vminsights-ga-release-faq.md) - Added information on upgrading workspace and agents to new version.

#### Office 365
- [Office 365 management solution in Azure](insights/solution-office-365.md) - Added details and FAQ on migrating to Office 365 solution in Azure Sentinel. Removed onboarding section.



### Logs
- [Manage Log Analytics workspaces in Azure Monitor](platform/manage-access.md) - Updates to Not actions.
- [Manage usage and costs for Azure Monitor Logs](platform/manage-cost-storage.md) - Added clarification on calculation of data volume in the Pricing Model section.
- [Use Azure Resource Manager templates to Create and Configure a Log Analytics Workspace](platform/template-workspace-configuration.md) - Updated template with new pricing tiers.


### Platform logs
- [Collect Azure Activity log with diagnostic settings- Azure Monitor](platform/diagnostic-settings-legacy.md) - Additional information on changed properties.
- [Export the Azure Activity Log](platform/activity-log-export.md) - Updated for UI changes. 





## December 2019

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