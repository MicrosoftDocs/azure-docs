---
title: What's new in Azure Monitor documentation
description: Significant updates to Azure Monitor documentation updated each month.
ms.subservice: 
ms.topic: overview
author: bwren
ms.author: bwren
ms.date: 07/08/2020
---
# What's new in Azure Monitor documentation?

This article provides lists Azure Monitor articles that are either new or have been significantly updated. It will be refreshed the first week of each month to include article updates from the previous month.

## September 2020

### General
- [Azure Monitor FAQ](faq.md) - Added section on OpenTelemetry.

### Agents
- [Azure Monitor agent overview](platform/azure-monitor-agent-overview.md) - Added decision factors for switching to new agent.
- [Overview of the Azure monitoring agents](platform/agents-overview.md) - Added support for Windows 10.

### Alerts
- [Create a log alert with Azure Resource Manager template](platform/alerts-log-create-templates.md) - New article.
- [Troubleshooting Azure metric alerts](platform/alerts-troubleshoot-metric.md) - Added section on exporting ARM template for a metric alert rule.

### Application Insights
- [Create a new Azure Monitor Application Insights workspace-based resource](app/create-workspace-resource.md) - Removed preview designation.
- [Data retention and storage in Azure Application Insights](app/data-retention-privacy.md) - Added details for new support for Mac and Linux data loss protection.
- [Event counters in Application Insights](app/eventcounters.md) - Added note on counters collected by default.
- [Log-based and pre-aggregated metrics in Azure Application Insights](app/pre-aggregated-metrics-log-metrics.md) - Removed preview designation.
- [Migrate an Azure Monitor Application Insights classic resource to a workspace-based resource](app/convert-classic-resource.md) - New article.
- [Monitor Java applications on any environment - Azure Monitor Application Insights](app/java-in-process-agent.md) - Updated for new preview version of agent.
- [Set up web app analytics for ASP.NET with Azure Application Insights](app/asp-net.md) - Article rewritten.
- [Telemetry channels in Azure Application Insights](app/telemetry-channels.md) - Added details for new support for Mac and Linux data loss protection.
- [Troubleshoot Azure Application Insights Snapshot Debugger](app/snapshot-debugger-troubleshoot.md) - Added SSL section to Snapshot Debugger troubleshooting.
- [Use Application Change Analysis in Azure Monitor to find web-app issues](app/change-analysis.md) - Added Virtual Machine and Activity Log.


### Containers
- [Configure Azure Arc enabled Kubernetes cluster with Azure Monitor for containers](insights/container-insights-enable-arc-enabled-clusters.md) - Added guidance for enabling monitoring using service principal.
- [Deployment & HPA metrics with Azure Monitor for containers](insights/container-insights-deployment-hpa-metrics.md) - New article.

### Insights and solutions
- [Azure Monitor for Azure Cache for Redis](insights/redis-cache-insights-overview.md) - Removed preview designation.
- [Azure Monitor for Networks (Preview)](insights/network-insights-overview.md) - Added Connectivity and Traffic sections.
- [IT Service Management Connector - Secure Export in Azure Monitor](platform/it-service-management-connector-secure-webhook-connections.md) - New article.
- [IT Service Management Connector in Azure Monitor](platform/itsmc-connections.md) - Note on Cherwell and Provance ITSM integrations.
- [Monitor Key Vault with Azure Monitor for Key Vault](insights/key-vault-insights-overview.md) - Removed preview designation.

### Logs
- [Audit queries in Azure Monitor log queries](log-query/query-audit.md) - New article.
- [Azure Monitor customer-managed key](platform/customer-managed-keys.md) - Added customer lockbox.
- [Azure Monitor Logs Dedicated Clusters](log-query/logs-dedicated-clusters.md) - New article.
- [Designing your Azure Monitor Logs deployment](platform/design-logs-deployment.md) - Updated scale and ingestion volume rate limit section.
- [Log query scope in Azure Monitor Log Analytics](log-query/scope.md) - Updates to include workspace-based applications.
- [Logs in Azure Monitor](platform/data-platform-logs.md) - Updates to include workspace-based applications.
- [Standard columns in Azure Monitor log records](platform/log-standard-columns.md) - Updates to include workspace-based applications.
- [Azure Monitor service limits](service-limits.md) - Updated limits for user query throttling.
- [Using customer-managed storage accounts in Azure Monitor Log Analytics](platform/private-storage.md) - Article rewritten.
- [Viewing and analyzing data in Azure Log Analytics](./platform/data-platform-logs.md) - Updates to include workspace-based applications.


### Platform logs
- [Azure Activity Log event schema - Azure Monitor](platform/activity-log-schema.md) - Added severity levels.
- [Resource Manager template samples for diagnostic settings](samples/resource-manager-diagnostic-settings.md) - Added sample for Azure storage account.

### Visualizations
- [Azure Monitor workbook chart visualizations](platform/workbooks-chart-visualizations.md) - New article.
- [Azure Monitor workbook composite bar renderer](platform/workbooks-composite-bar.md) - New article.
- [Azure Monitor workbook graph visualizations](platform/workbooks-graph-visualizations.md) - New article.
- [Azure Monitor workbook grid visualizations](platform/workbooks-grid-visualizations.md) - New article.
- [Azure Monitor workbook honey comb visualizations](platform/workbooks-honey-comb.md) - New article.
- [Azure Monitor workbook text visualizations](platform/workbooks-text-visualizations.md) - New article.
- [Azure Monitor workbook tile visualizations](platform/workbooks-tile-visualizations.md) - New article.
- [Azure Monitor workbook tree visualizations](platform/workbooks-tree-visualizations.md) - New article.




## August 2020

### General

- [What is monitored by Azure Monitor](monitor-reference.md) - Updated to include Azure Monitor agent.


### Agents
- [Azure Monitor agent overview](platform/azure-monitor-agent-overview.md) - New article.
- [Enable Azure Monitor for a hybrid environment](insights/vminsights-enable-hybrid.md) - Updated dependency agent version.
- [Overview of the Azure monitoring agents](platform/agents-overview.md) - Added Azure Monitor agent and consolidated OS support table.


#### New and updated articles from restructure of agent content
- [Enable Azure Monitor for VMs overview](insights/vminsights-enable-overview.md)
- [Install Log Analytics agent on Linux computers](platform/agent-linux.md)
- [Install Log Analytics agent on Windows computers](platform/agent-windows.md)
- [Log Analytics agent overview](platform/log-analytics-agent.md)

### Application Insights
- [Azure Application Insights for JavaScript web apps](app/javascript.md) - Added section clarifying client server correlation and configuration for CORS correlation.
- [Create a new Azure Monitor Application Insights workspace-based resource](app/create-workspace-resource.md) - Added capabilities provided by workspace-based applications.
- [IP addresses used by Application Insights and Log Analytics](app/ip-addresses.md) - Updated IP addresses for live metrics stream.
- [Monitor Java applications on any environment - Azure Monitor Application Insights](app/java-in-process-agent.md) - Added table for supported custom telemetry.
- [Native React plugin for Application Insights JavaScript SDK](app/javascript-react-native-plugin.md) - New article.
- [React plugin for Application Insights JavaScript SDK](app/javascript-react-plugin.md) - New article.
- [Resource Manager template sample for creating Azure Function apps with Application Insights monitoring](samples/resource-manager-function-app.md) - New article.
- [Resource Manager template samples for creating Azure App Services web apps with Application Insights monitoring](samples/resource-manager-web-app.md) - New article.
- [Usage analysis with Azure Application Insights](app/usage-overview.md) - Added video.

### Autoscale
- [Get started with autoscale in Azure](platform/autoscale-get-started.md) - Added section on routing to healthy instances for App Service.

### Data collection
- [Configure data collection for the Azure Monitor agent (preview)](platform/data-collection-rule-azure-monitor-agent.md) - New article.
- [Data Collection Rules in Azure Monitor (preview)](platform/data-collection-rule-overview.md) - New article.


### Containers
- [Deployment & HPA metrics with Azure Monitor for containers](insights/container-insights-deployment-hpa-metrics.md) - New article.

### Insights
- [Monitoring solutions in Azure Monitor](insights/solutions.md) - Updated for new UI.
- [Network Performance Monitor solution in Azure](insights/network-performance-monitor.md) - Added supported workspace regions.


### Logs
- [Azure Monitor FAQ](faq.md) - Added entry for deleting data from a workspace. Added entry on 502 and 503 responses.
  - [Designing your Azure Monitor Logs deployment](platform/design-logs-deployment.md) - Updates to Ingestion volume rate limit section.
- [Manage usage and costs for Azure Monitor Logs](platform/manage-cost-storage.md) - Updated usage queries to more efficient query format.
- [Optimize log queries in Azure Monitor](log-query/query-optimization.md) - Added specific values to performance indicators.
- [Resource Manager template samples for diagnostic settings](samples/resource-manager-diagnostic-settings.md) - Added sample for log query audit logs.


### Platform logs
- [Create diagnostic settings to send platform logs and metrics to different destinations](platform/diagnostic-settings.md) - Added regional requirement for diagnostic settings.

### Visualizations
- [Azure Monitor Workbooks Overview](platform/workbooks-overview.md) - Added video.
- [Move an Azure Workbook Template to another region](platform/workbook-templates-move-region.md) - New article.
- [Move an Azure Workbook to another region](platform/workbooks-move-region.md) - New article.



## July 2020

### General
- [Deploy Azure Monitor](deploy-scale.md) - Restructure of Azure Monitor for VMs onboarding content.
- [Use Azure Private Link to securely connect networks to Azure Monitor](platform/private-link-security.md) - Added section on limits.

### Alerts
- [Action rules for Azure Monitor alerts](platform/alerts-action-rules.md) - Added CLI processes.
- [Create and manage action groups in the Azure portal](platform/action-groups.md) - Updated to reflect changes in UI.
- [Saved queries in Azure Monitor Log Analytics](log-query/saved-queries.md) - New article.
- [Troubleshoot log alerts in Azure Monitor](platform/alerts-troubleshoot-log.md) - Added section on alert rule quota.
- [Troubleshooting Azure metric alerts](platform/alerts-troubleshoot-metric.md) - Added section on alert rule on a custom metric that isn't emitted yet.
- [Understand how metric alerts work in Azure Monitor.](platform/alerts-metric-overview.md) - Added recommendation for selecting aggregation granularity.

### Application Insights
- [Release Notes for Azure web app extension - Application Insights](app/web-app-extension-release-notes.md) - New article.
- [Resource Manager template samples for Application Insights Resources](samples/resource-manager-app-resource.md) - New article.
- [Troubleshoot problems with Azure Application Insights Profiler](app/profiler-troubleshooting.md) - Added note on bug running profiler for ASP.NET Core apps on Azure App Service. 

### Containers
- [Log alerts from Azure Monitor for containers](insights/container-insights-log-alerts.md) - New article.
- [Metric alerts from Azure Monitor for containers](insights/container-insights-metric-alerts.md) - New article.

### Logs
- [Azure Monitor customer-managed key](platform/customer-managed-keys.md) - Added error message and section CMK configuration for queries.
- [Azure Monitor HTTP Data Collector API](platform/data-collector-api.md) - Added Python 3 sample.
- [Optimize log queries in Azure Monitor](log-query/query-optimization.md) - Added section on avoiding multiple data scans when using subqueries.
- [Tutorial: Get started with Log Analytics queries](log-query/get-started-portal.md) - Added video.

### Platform logs
- [Create diagnostic settings to send platform logs and metrics to different destinations](platform/diagnostic-settings.md) - Added video.
- [Resource Manager template samples for Azure Monitor](samples/resource-manager-samples.md) - Added ARM sample using Logs destination type. 

### Solutions
- [Monitoring solutions in Azure Monitor](insights/solutions.md) - Added CLI processes.
- [Office 365 management solution in Azure](insights/solution-office-365.md) - Changed retirement date.

### Virtual machines

New and updated articles from restructure of Azure Monitor for VMs content

- [What is Azure Monitor for VMs?](insights/vminsights-overview.md)
- [Configure Log Analytics workspace for Azure Monitor for VMs](insights/vminsights-configure-workspace.md)
- [Connect Linux computers to Azure Monitor](platform/agent-linux.md)
- [Enable Azure Monitor for a hybrid environment](insights/vminsights-enable-hybrid.md)
- [Enable Azure Monitor for single virtual machine or virtual machine scale set in the Azure portal](insights/vminsights-enable-portal.md)
- [Enable Azure Monitor for VMs by using Azure Policy](./insights/vminsights-enable-policy.md)
- [Enable Azure Monitor for VMs overview](insights/vminsights-enable-overview.md)
- [Enable Azure Monitor for VMs using PowerShell](insights/vminsights-enable-powershell.md)
- [Enable Azure Monitor for VMs using Resource Manager templates](insights/vminsights-enable-resource-manager.md)
- [Enable Azure Monitor for VMs with PowerShell or templates](./insights/vminsights-enable-powershell.md)


### Visualizations
- [Upgrading your Log Analytics Dashboard visualizations](log-query/dashboard-upgrade.md) - Updated refresh rate.
- [Visualizing data from Azure Monitor](visualizations.md) - Added video.


## June 2020

### General
- [Deploy Azure Monitor](deploy-scale.md) - New article.
- [Azure Monitor customer-managed key](platform/customer-managed-keys.md) - Updated billingtype property. Added PowerShell commands.

### Agents
- [Log Analytics agent overview](platform/log-analytics-agent.md) - Added Python 2 requirement.

### Alerts
- [How to update alert rules or action rules when their target resource moves to a different Azure region](platform/alerts-resource-move.md) - New article.
- [Troubleshooting Azure metric alerts](platform/alerts-troubleshoot-metric.md) - New article.
- [Troubleshooting log alerts in Azure Monitor](platform/alerts-troubleshoot-metric.md) - New article.
  
### Application Insights
- [Azure Application Insights for JavaScript web apps](app/javascript.md) - Update to JavaScript SDK section. Updated snippet to report load failures.
- [Configure BYOS (Bring Your Own Storage) for Profiler & Snapshot Debugger](app/profiler-bring-your-own-storage.md) - New article.
- [Incoming Request Tracking in Azure Application Insights with OpenCensus Python](app/opencensus-python-request.md) - Updated logging and configuration for OpenCensus.
- [Monitor a live ASP.NET web app with Azure Application Insights](app/monitor-performance-live-website-now.md) - Updated deprecation date for Status Monitor v1.
- [Monitor Node.js services with Azure Application Insights](app/nodejs.md) - Multiple updates including migrating from pervious versions and SDK Configuration
- [Monitor Python applications with Azure Monitor (preview)](app/opencensus-python.md) - Added section on configuring Azure Monitor exporters.
- [Monitor your apps without code changes - auto-instrumentation for Azure Monitor Application Insights](app/codeless-overview.md) - New article.
- [Troubleshooting SDK load failure for JavaScript web applications](app/javascript-sdk-load-failure.md) - New article.

### Containers
- [How to stop monitoring your hybrid Kubernetes cluster](insights/container-insights-optout-hybrid.md) - Added section for Arc enabled Kubernetes.
- [Configure Azure Arc enabled Kubernetes cluster with Azure Monitor for containers](insights/container-insights-enable-arc-enabled-clusters.md) - New article.
- [Configure Azure Red Hat OpenShift v4.x with Azure Monitor for containers](insights/container-insights-azure-redhat4-setup.md) - Updated prerequisites.
- [Set up Azure Monitor for containers Live Data (preview)](insights/container-insights-livedata-setup.md) - Removed note about feature not being available in Azure US Government.

### Insights
- [FAQs - Network Performance Monitor solution in Azure](insights/network-performance-monitor-faq.md) - Added FAQ for ExpressRoute Monitor.

### Logs
- [Delete and recover Azure Log Analytics workspace](platform/delete-workspace.md) - Added PowerShell command. Updated troubleshooting.
- [Manage Log Analytics workspaces in Azure Monitor](platform/manage-access.md) - Added example for unallowed tables in RBAC section.
- [Manage usage and costs for Azure Monitor Logs](platform/manage-cost-storage.md) - Additional detail on calculation of data size. Updated configuring data volume alerts. Details about security data collected by Azure Sentinel. Clarification on data cap.
- [Use Azure Monitor Logs with Azure Logic Apps and Power Automate](platform/logicapp-flow-connector.md) - Added connector limits.

### Metrics
- [Azure Monitor supported metrics by resource type](platform/metrics-supported.md) - Updated SQL Server metrics.


### Platform logs

- [Resource Manager template samples for diagnostic settings](samples/resource-manager-diagnostic-settings.md) - Fix for Activity log diagnostic setting.
- [Send Azure Activity log to Log Analytics workspace using Azure portal](learn/quick-collect-activity-log-portal.md) - New article.
- [Send Azure Activity log to Log Analytics workspace using Azure Resource Manager template](learn/quick-collect-activity-log-arm.md) - New article.

New and updated articles from restructure and consolidation of platform log content

- [Archive Azure resource logs to storage account](./platform/resource-logs.md#send-to-azure-storage)
- [Azure Activity Log event schema](platform/activity-log-schema.md)
- [Azure Activity log](platform/activity-log.md)
- [Azure Monitor CLI samples](samples/cli-samples.md)
- [Azure Monitor PowerShell samples](samples/powershell-samples.md)
- [Azure Monitoring REST API walkthrough](platform/rest-api-walkthrough.md)
- [Azure Resource Logs supported services and schemas](./platform/resource-logs-schema.md)
- [Azure resource logs](platform/resource-logs.md)
- [Collect and analyze Azure activity log in Azure Monitor](./platform/activity-log.md)
- [Collect Azure resource logs in Log Analytics workspace](./platform/resource-logs.md#send-to-log-analytics-workspace)
- [Create diagnostic settings to send platform logs and metrics to different destinations](platform/diagnostic-settings.md)
- [Export the Azure Activity Log](./platform/activity-log.md#legacy-collection-methods)
- [Overview of Azure platform logs](platform/platform-logs-overview.md)
- [Stream Azure platform logs to an event hub](./platform/resource-logs.md#send-to-azure-event-hubs)
- [View Azure Activity log events in Azure Monitor](./platform/activity-log.md#view-the-activity-log)

### Virtual machines
- [Enable Azure Monitor for VMs in the Azure portal](./insights/vminsights-enable-portal.md) - Updated to include Azure Arc.
- [Enable Azure Monitor for VMs overview](insights/vminsights-enable-overview.md) - Updated to include Azure Arc.
- [What is Azure Monitor for VMs?](insights/vminsights-overview.md) - Updated to include Azure Arc.


### Visualizations
- [Azure Monitor workbooks data sources](platform/workbooks-data-sources.md) - Added Alerts and Custom Endpoints section.
- [Troubleshooting Azure Monitor workbook-based insights](insights/troubleshoot-workbooks.md) - New article.
- [Upgrading your Log Analytics Dashboard visualizations](log-query/dashboard-upgrade.md) - New article.



## May 2020

### General

- [Azure Monitor FAQ](faq.md) - Added section for Metrics.
- [Azure Monitor customer-managed key](platform/customer-managed-keys.md) - Various changes in preparation for general availability.
- [Built-in policy definitions for Azure Monitor](./samples/policy-reference.md) - New article.
- [Customer-owned storage accounts for log ingestion](platform/private-storage.md) - New article.
- [Manage usage and costs for Azure Monitor Logs](platform/manage-cost-storage.md) - Added cluster proportional billing.
- [Use Azure Private Link to securely connect networks to Azure Monitor](platform/private-link-security.md) - New article.


#### New Resource Manager template samples 
- [Resource Manager template samples for Azure Monitor](samples/resource-manager-samples.md)
- [Resource Manager template samples for action groups](samples/resource-manager-action-groups.md)
- [Resource Manager template samples for agents](samples/resource-manager-agent.md)
- [Resource Manager template samples for Azure Monitor for containers](samples/resource-manager-container-insights.md)
- [Resource Manager template samples for Azure Monitor for VMs](samples/resource-manager-vminsights.md)
- [Resource Manager template samples for diagnostic settings](samples/resource-manager-diagnostic-settings.md)
- [Resource Manager template samples for Log Analytics workspaces](samples/resource-manager-workspace.md)
- [Resource Manager template samples for log queries](samples/resource-manager-log-queries.md)
- [Resource Manager template samples for log query alert rules](samples/resource-manager-alerts-log.md)
- [Resource Manager template samples for metric alert rules](samples/resource-manager-alerts-metric.md)
- [Resource Manager template samples for workbooks](samples/resource-manager-workbooks.md)

### Agents
- [Install and configure Windows Azure diagnostics extension (WAD)](platform/diagnostics-extension-windows-install.md) - Added detail on configuring diagnostics.
- [Log Analytics agent overview](platform/log-analytics-agent.md) - Added supported Linux versions.

### Application Insights

- [Monitor applications running on Azure Functions with Application Insights - Azure Monitor](app/monitor-functions.md) - New article.
- [Monitor Node.js services with Azure Application Insights](app/nodejs.md) - General updates including new section on migration from prior versions.
- [IP addresses used by Application Insights and Log Analytics](app/ip-addresses.md) - Added IP addresses for webhooks and US Government.
- [Monitor applications on Azure Kubernetes Service (AKS) with Application Insights - Azure Monitor](app/kubernetes-codeless.md) - New article.
- [Troubleshooting no data - Application Insights for .NET](app/asp-net-troubleshoot-no-data.md) - Added section on collecting logs with dotnet-trace.
- [Use Application Change Analysis in Azure Monitor to find web-app issues](app/change-analysis.md) - Multiple updates in the Change Analysis feature.

#### New and updated articles for preview of workspace-based applications
- [Azure Monitor Application Insights workspace-based resource schema](app/apm-tables.md)
- [Create a new Azure Monitor Application Insights workspace-based resource](app/create-workspace-resource.md)
- [app() expression in Azure Monitor log queries](log-query/app-expression.md)
- [Log query scope in Azure Monitor Log Analytics](log-query/scope.md)
- [Query across resources with Azure Monitor](log-query/cross-workspace-query.md)
- [Standard properties in Azure Monitor log records](./platform/log-standard-columns.md)
- [Structure of Azure Monitor Logs](./platform/data-platform-logs.md)





### Containers
- [How to enable Azure Monitor for containers](insights/container-insights-onboard.md) - Updated firewall configuration table.
- [How to update Azure Monitor for containers for metrics](insights/container-insights-update-metrics.md) - Update for using managed identities to collect metrics.
- [Monitoring cost for Azure Monitor for containers](insights/container-insights-cost.md) - New article.
- [Set up Azure Monitor for containers Live Data (preview)](insights/container-insights-livedata-setup.md) - Support for new cluster role binding.

### Insights
- [Azure Monitor for Azure Cache for Redis (preview)](insights/redis-cache-insights-overview.md) - New article.
- [Monitor Key Vault with Azure Monitor for Key Vault (preview)](./insights/key-vault-insights-overview.md) - New article.

### Logs
- [Create & configure Log Analytics with PowerShell](platform/powershell-workspace-configuration.md) - Added troubleshooting section.
- [Create a Log Analytics workspace in the Azure portal](learn/quick-create-workspace.md) - Added troubleshooting section.
- [Create a Log Analytics workspace using Azure CLI](learn/quick-create-workspace-cli.md) - Added troubleshooting section.
- [Delete and recover Azure Log Analytics workspace](platform/delete-workspace.md) - Updated information on recovering a deleted workspace.
- [Functions in Azure Monitor log queries](log-query/functions.md) - Removed note about functions not containing other functions.
- [Structure of Azure Monitor Logs](./platform/data-platform-logs.md) - Clarified property descriptions for Application Insights table.
- [Use Azure Monitor Logs with Azure Logic Apps and Power Automate](platform/logicapp-flow-connector.md) - Added limits section.
- [Use PowerShell to Create and Configure a Log Analytics Workspace](platform/powershell-workspace-configuration.md) - Added troubleshooting section.


### Metrics
- [Azure Monitor supported metrics by resource type](platform/metrics-supported.md) - Clarified guest metrics and metrics routing. 

### Solutions
- [Optimize your Active Directory environment with Azure Monitor](insights/ad-assessment.md) - Added Windows Server 2019 to supported versions.
- [Optimize your SQL Server environment with Azure Monitor](insights/sql-assessment.md) - Added to supported versions of SQL Server.


### Virtual machines
- [Enable Azure Monitor for VMs overview](insights/vminsights-enable-overview.md) - Added to supported versions of Ubuntu Server. Added supported regions for Log Analytics workspace.
- [How to chart performance with Azure Monitor for VMs](insights/vminsights-performance.md) - Added limitations section for unavailable metrics.

### Visualizations
- [Azure Monitor Workbooks and Azure Resource Manager Templates](platform/workbooks-automate.md) - Added Resource Manager update for deploying a workbook template.
- [Azure Monitor Workbooks Groups](platform/workbooks-groups.md) - New article.
- [Azure Monitor Workbooks - Transform JSON data with JSONPath](platform/workbooks-jsonpath.md) - New article.


## April 2020

### General

- [Azure Monitor customer-managed key](platform/customer-managed-keys.md) - Added section on asynchronous operations
- [Manage Log Analytics workspaces in Azure Monitor](platform/manage-access.md) - Updated custom logs sections.

### Alerts

- [Action rules for Azure Monitor alerts](platform/alerts-action-rules.md) - Added video.
- [Overview of alerting and notification monitoring in Azure](platform/alerts-overview.md) - Added video.

### Application Insights

- [Application Map in Azure Application Insights](app/app-map.md) - Added cloud role names config for java agent.
- [Azure Application Insights .NET Agent API reference](app/status-monitor-v2-api-reference.md) - Consolidated API Reference.
- [IP addresses used by Application Insights and Log Analytics](app/ip-addresses.md) - Updated IP addresses for App Insights and Log Analytics APIs, Action group webhooks, Azure US Government.
- [Monitor Java applications anywhere](app/java-standalone-config.md) - New article.
- [Monitor Java applications on any environment](app/java-in-process-agent.md) - New article.
- [Monitor Java applications running in any environment](app/java-standalone-arguments.md) - New article.
- [Monitor Java applications running on premises](app/java-on-premises.md) - New article.
- [Remove Application Insights in Visual Studio](app/remove-application-insights.md) - New article.
- [Telemetry sampling in Azure Application Insights](app/sampling.md) - Fix in fixed-rate sample in Python.

### Containers

- [Configure Azure Red Hat OpenShift v4.x with Azure Monitor for containers](insights/container-insights-azure-redhat4-setup.md) - New article.
- [How to manually fix ServiceNow sync problems](platform/itsmc-resync-servicenow.md) - New article.
- [How to stop monitoring your Azure and Red Hat OpenShift v4 cluster](insights/container-insights-optout-openshift-v4.md) - New article.
- [How to stop monitoring your Azure Red Hat OpenShift v3 cluster](insights/container-insights-optout-openshift-v3.md) - New article.
- [How to stop monitoring your hybrid Kubernetes cluster](insights/container-insights-optout-hybrid.md) - New article.

### Insights

- [Monitor Azure Key Vaults with Azure Monitor for Key Vaults (preview)](insights/key-vault-insights-overview.md) - New article.

### Logs

- [Azure Monitor service limits](service-limits.md) - Added user query throttling.
- [Manage usage and costs for Azure Monitor Logs](platform/manage-cost-storage.md) - Added billing for Logs clusters. Added Kusto query to enable customers with legacy Per Node pricing tier to determine whether they should move to a Per GB or Capacity Reservation tier.

### Metrics

- [Advanced features of Azure Metrics Explorer](platform/metrics-charts.md) - Added aggregation section.

### Workbooks

- [Azure Monitor Workbooks and Azure Resource Manager Templates](platform/workbooks-automate.md) - Added Resource Manager template for deploying a workbook template.

## March 2020

### General

- [Azure Monitor overview](overview.md) - Added Azure Monitor overview video.
- [Azure Monitor customer-managed key configuration](platform/customer-managed-keys.md) - General updates.
- [Azure Monitor data reference](/azure/azure-monitor/reference/) - New site.

### Alerts

- [Create, view, and manage activity log alerts in Azure Monitor](platform/alerts-activity-log.md) - Additional explanation of Resource Manager template.
- [Understand how metric alerts work in Azure Monitor.](platform/alerts-metric-overview.md) - Updated for government support.
- [Troubleshooting Azure Monitor alerts and notifications](platform/alerts-troubleshoot.md) - New article.

### Application Insights

- [Automate Azure Application Insights with PowerShell](app/powershell.md) - Added ARMClient examples.
- [Continuous export of telemetry from Application Insights](app/export-telemetry.md) - Add table with details of export structure.
- [Enable Snapshot Debugger for .NET apps in Azure App Service](app/snapshot-debugger-appservice.md) - Added Resource Manager template example.
- [Manage usage and costs for Azure Application Insights](app/pricing.md) - Added information on data cap alert.
- [Monitor Python applications with Azure Monitor (preview)](app/opencensus-python.md) - Added standard metrics.
- [Source map support for JavaScript applications - Azure Monitor Application Insights](app/source-map-support.md) - New article.

### Containers

- [Azure Monitor FAQ](faq.md) - Update for Azure Monitor for containers.
- [Configure GPU monitoring with Azure Monitor for containers](insights/container-insights-gpu-monitoring.md) - New article.

### Insights

- [Office 365 management solution in Azure](insights/solution-office-365.md) - Updated deprecation date.

### Logs

- [Optimize log queries in Azure Monitor](log-query/query-optimization.md) - Added CPU condition for XML and JSON parsing.
- [Delete and recover Azure Log Analytics workspace](platform/delete-workspace.md) - Added troubleshooting.
- [Use Azure Monitor Logs with Azure Logic Apps and Power Automate](platform/logicapp-flow-connector.md) - Updated for new Azure Monitor connector.

### Metrics

- [Disk metrics deprecation in the Azure portal](platform/portal-disk-metrics-deprecation.md) - New article.
- [Tutorial - Create a metrics chart in Azure Monitor](learn/tutorial-metrics-explorer.md) - Added video.

### Platform logs

- [Collect and analyze Azure activity log in Azure Monitor](./platform/activity-log.md) - Rewrite to better explain collecting Activity log with diagnostic settings.

### Virtual machines

- [Monitor Azure virtual machines with Azure Monitor](insights/monitor-vm-azure.md) - New article.
- [Quickstart: Monitor Azure virtual machines with Azure Monitor](learn/quick-monitor-azure-vm.md) - Updated to add Azure Monitor for VMs.
- [Alerts from Azure Monitor for VMs](insights/vminsights-alerts.md) - New article.
- [Enable Azure Monitor for VMs overview](insights/vminsights-enable-overview.md) - Updated agent download links.

General updates for general availability of Azure Monitor for VMs

- [What is Azure Monitor for VMs?](insights/vminsights-overview.md)
- [Azure Monitor for VMs (GA) frequently asked questions](insights/vminsights-ga-release-faq.md) 
- [Enable Azure Monitor for VMs by using Azure Policy](./insights/vminsights-enable-policy.md) 
- [How to chart performance with Azure Monitor for VMs](insights/vminsights-performance.md)
- [How to Query Logs from Azure Monitor for VMs](insights/vminsights-log-search.md)
- [View app dependencies with Azure Monitor for VMs](insights/vminsights-maps.md) 

### Visualizations

- [Visualizing data from Azure Monitor](visualizations.md) - Updated to note planned deprecation of View Designer.

## February 2020

### Agents

Multiple updates as part of rewrite of diagnostics extension content.

- [Overview of the Azure monitoring agents](platform/agents-overview.md) - Restructured tables to better clarify unique features of each agent.
- [Azure Diagnostics extension overview](platform/diagnostics-extension-overview.md) - Complete rewrite.
- [Use blob storage for IIS and table storage for events in Azure Monitor](platform/diagnostics-extension-logs.md) - General rewrite for update and clarity.
- [Install and configure Windows Azure diagnostics extension (WAD)](platform/diagnostics-extension-windows-install.md) - New article. 
- [Windows diagnostics extension schema](platform/diagnostics-extension-schema-windows.md) - Reorganized.
- [Send data from Windows Azure diagnostics extension to Azure Event Hubs](platform/diagnostics-extension-stream-event-hubs.md) - Completely rewritten and updated.
- [Store and view diagnostic data in Azure Storage](../cloud-services/diagnostics-extension-to-storage.md) - Completely rewritten and updated.
- [Log Analytics virtual machine extension for Windows](../virtual-machines/extensions/oms-windows.md) - Better clarifies relationship with Log Analytics agent.
- [Azure Monitor virtual machine extension for Linux](../virtual-machines/extensions/oms-linux.md) - Better clarifies relationship with Log Analytics agent.

### Application Insights

- [Connection strings in Azure Application Insights](app/sdk-connection-string.md) - New article.

### Insights and solutions

#### Azure Monitor for Containers

- [Integrate Azure Active Directory with Azure Kubernetes Service](../aks/azure-ad-integration-cli.md) - Added note for creating a client application to support RBAC-enabled cluster to support Azure Monitor for containers.

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

Multiple New articles for view designer to workbooks conversion guide.

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
- [Create performance alerts for Azure Monitor for containers](./insights/container-insights-log-alerts.md) - Revised information and updated steps for creating an alert on performance data stored in workspace using workspace-context alerts.
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
- [Use Azure Resource Manager templates to Create and Configure a Log Analytics Workspace](./samples/resource-manager-workspace.md) - Updated template with new pricing tiers.

### Platform logs

- [Collect Azure Activity log with diagnostic settings- Azure Monitor](./platform/activity-log.md) - Additional information on changed properties.
- [Export the Azure Activity Log](./platform/activity-log.md#legacy-collection-methods) - Updated for UI changes. 

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

- [Azure Monitor for containers Frequently Asked Questions](./faq.md) - Added question on Image and Name fields.
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

- [Archive Azure resource logs to storage account](./platform/resource-logs.md#send-to-azure-storage)
- [Azure Activity Log event schema](platform/activity-log-schema.md)
- [Azure Monitor service limits](service-limits.md)
- [Collect and analyze Azure activity logs in Log Analytics workspace](./platform/activity-log.md)
- [Collect Azure Activity log with diagnostic settings (preview) - Azure Monitor](./platform/activity-log.md)
- [Collect Azure Activity logs into a Log Analytics workspace across Azure tenants](./platform/activity-log.md)
- [Collect Azure resource logs in Log Analytics workspace](./platform/resource-logs.md#send-to-log-analytics-workspace)
- [Create diagnostic setting in Azure using Resource Manager template](./samples/resource-manager-diagnostic-settings.md)
- [Create diagnostic setting to collect logs and metrics in Azure](platform/diagnostic-settings.md)
- [Export the Azure Activity Log](./platform/activity-log.md#legacy-collection-methods)
- [Overview of Azure platform logs](platform/platform-logs-overview.md)
- [Stream Azure monitoring data to event hub](platform/stream-monitoring-data-event-hubs.md)
- [Stream Azure platform logs to an event hub](./platform/resource-logs.md#send-to-azure-event-hubs)

### Quickstarts and tutorials

- [Create a metrics chart in Azure Monitor](learn/tutorial-metrics-explorer.md) - New article.
- [Collect resource logs from an Azure Resource and analyze with Azure Monitor](learn/tutorial-resource-logs.md) - New article.
- [Monitor an Azure resource with Azure Monitor](learn/quick-monitor-azure-resource.md) - New article.
   
## Next steps

- If you'd like to contribute to Azure Monitor documentation, see the [Docs Contributor Guide](/contribute/).