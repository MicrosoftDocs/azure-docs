---
title: What's new in Azure Monitor documentation
description: Significant updates to Azure Monitor documentation updated each month.
ms.subservice: 
ms.topic: overview
author: bwren
ms.author: bwren
ms.date: 02/10/2021
---
# What's new in Azure Monitor documentation?

This article provides lists Azure Monitor articles that are either new or have been significantly updated. It will be refreshed the first week of each month to include article updates from the previous month.

## January 2021 

### General	
- [Azure Monitor FAQ](faq.md) - Added entry on device information for Application Insights.
### Agents	
- [Collecting Event Tracing for Windows (ETW) Events for analysis Azure Monitor Logs](./agents/data-sources-event-tracing-windows.md) - New article.
- [Data Collection Rules in Azure Monitor (preview)](./agents/data-collection-rule-overview.md) - Added links to PowerShell and CLI samples.

### Alerts	
- [Configure Azure to connect ITSM tools using Secure Export](./alerts/itsm-connector-secure-webhook-connections-azure-configuration.md) - New article.
- [Connector status errors in the ITSMC dashboard](./alerts/itsmc-dashboard-errors.md) - New article.
- [Investigate errors by using the ITSMC dashboard](./alerts/itsmc-dashboard.md) - New article.
- [Troubleshooting Azure metric alerts](./alerts/alerts-troubleshoot-metric.md) - Added sections for dynamic thresholds.
- [Troubleshoot problems in IT Service Management Connector](./alerts/itsmc-troubleshoot-overview.md) - New article.

### Application Insights
- [Azure Application Insights telemetry correlation](app/correlation.md) - Added trace correlation when one module calls another in OpenCensus Python.
- [Application Insights for web pages](app/javascript.md) - New article.
- [Click Analytics Auto-collection plugin for Application Insights JavaScript SDK](app/javascript-click-analytics-plugin.md) - New article.
- [Monitor your apps without code changes - auto-instrumentation for Azure Monitor Application Insights](app/codeless-overview.md) - Added Python column.
- [React plugin for Application Insights JavaScript SDK](app/javascript-react-plugin.md) - New article.
- [Telemetry processors (preview) - Azure Monitor Application Insights for Java](app/java-standalone-telemetry-processors.md) - Rewritten.
- [Usage analysis with Azure Application Insights](app/usage-overview.md) - New article.
- [Use Application Change Analysis in Azure Monitor to find web-app issues](app/change-analysis.md) - Added error messges.


### Insights	
- [Azure Monitor for Azure Data Explorer (preview)](insights/data-explorer.md) - New article.

### Logs	
- [Azure Monitor customer-managed key](./logs/customer-managed-keys.md) - Introduce user assigned managed identity.
- [Azure Monitor Logs Dedicated Clusters](./logs/logs-dedicated-clusters.md) - Updated reponse code.
- [Cross service query - Azure Monitor and Azure Data Explorer (Preview)](/azure/azure-monitor/platform/azure-data-explorer-monitor-cross-service-query) - New article.

### Metrics
- [Azure Monitor Metrics metrics aggregation and display explained](./essentials/metrics-aggregation-explained.md) - New article.

### Platform Logs
- [Azure Monitor Resource Logs supported services and categories](./essentials/resource-logs-categories.md) - New article.

### Visualizations
- [Azure Monitor workbooks data sources](./visualize/workbooks-data-sources.md) - Added merge and change analysis.


## December 2020

### General
- [Azure Monitor customer-managed key](logs/customer-managed-keys.md) - Added error messages.
- [Partners who integrate with Azure Monitor](/partners.md) - Added section on Event Hub integration.

### Agents
- [Cross-resource query Azure Data Explorer by using Azure Monitor](logs/azure-monitor-data-explorer-proxy.md) - New article.
- [Overview of the Azure monitoring agents](agents/agents-overview.md) - Added Oracle 8 support.

### Alerts
- [Troubleshooting Azure metric alerts](alerts/alerts-troubleshoot-metric.md) - Added troubleshooting for dynamic thresholds.
- [IT Service Management Connector in Log Analytics](alerts/itsmc-definition.md) - New article.
- [IT Service Management Connector overview](alerts/itsmc-overview.md) - Restructured troubleshooting information.
- [Connect Cherwell with IT Service Management Connector](alerts/itsmc-connections-cherwell.md) - New article.
- [Connect Provance with IT Service Management Connector](alerts/itsmc-connections-provance.md) - New article.
- [Connect SCSM with IT Service Management Connector](alerts/itsmc-connections-scsm.md) - New article.
- [Connect ServiceNow with IT Service Management Connector](alerts/itsmc-connections-servicenow.md) - New article.
- [How to manually fix ServiceNow sync problems](alerts/itsmc-resync-servicenow.md) - Restructured troubleshooting information.




### Application Insights
- [Azure Application Insights for JavaScript web apps](app/javascript.md) - Added connection string setup.
- [Azure Application Insights standard metrics](app/standard-metrics.md) - New article.
- [Azure Monitor Application Insights Java](app/java-in-process-agent.md) - Additional information on sending custom telemetry from your application.
- [Continuous export of telemetry from Application Insights](app/export-telemetry.md) - Added diagnostic  settings based export.
- [Enable Snapshot Debugger for .NET and .NET Core apps in Azure Functions](app/snapshot-debugger-function-app.md) - New article.
- [IP addresses used by Application Insights and Log Analytics](app/ip-addresses.md) - Added IP addresses for Azure Government.
- [Troubleshoot problems with Azure Application Insights Profiler](app/profiler-troubleshooting.md) - Added information on Diagnostic Services site extension' status page.
- [Troubleshoot your Azure Application Insights availability tests](app/troubleshoot-availability.md) - Updates to troubleshooting for ping tests.
- [Troubleshooting Azure Monitor Application Insights for Java](app/java-standalone-troubleshoot.md) - New article.

### Containers
- [Reports in Container insights](insights/container-insights-reports.md) - New article.

### Logs
- [Azure Monitor Logs Dedicated Clusters](logs/logs-dedicated-clusters.md) - Added automated commands, methods to unlink and remove, and troubleshooting.
- [Cross service query between Azure Monitor and Azure Data Explorer (preview)](logs/azure-data-explorer-monitor-cross-service-query.md) - New article.
- [Log Analytics workspace data export in Azure Monitor (preview)](logs/logs-data-export.md) - Added ARM templates.

### Metrics
- [Advanced features of Azure Metrics Explorer](essentials/metrics-charts.md) - Added information on resource scope picker.
- [Viewing multiple resources in Metrics Explorer](essentials/metrics-dynamic-scope.md) - New article.

### Networks
- [Azure Networking Analytics solution in Azure Monitor](insights/azure-networking-analytics.md) - Added information on Network Insights workbook.

### Virtual Machines
- [Enable Azure Monitor for a hybrid environment](vm/vminsights-enable-hybrid.md) - New version of dependency agent.


### Visualizations
- [Azure Monitor workbook map visualizations](visualize/workbooks-map-visualizations.md) - New article.
- [Azure Monitor Workbooks bring your own storage](visualize/workbooks-bring-your-own-storage.md) - New article.


## November 2020

### General
- [Azure Monitor service limits](service-limits.md) - Updated for Azure Arc support.

### Agents
- [Overview of the Azure monitoring agents](agents/agents-overview.md) - Updated for Azure Arc support.
- [Install the Azure Monitor agent](agents/azure-monitor-agent-install.md) - New article.
- [Azure Monitor agent overview](agents/azure-monitor-agent-overview.md) - Updated for Azure Arc support.
- [Resource Manager template samples for agents](agents/resource-manager-agent.md) - Updated for Azure Arc support.

### Alerts
- [Create and manage action groups in the Azure portal](alerts/action-groups.md) - Added source IP addresses for webhooks.

### Application Insights
- [Java codeless application monitoring Azure Monitor Application Insights](app/java-in-process-agent.md) - Added configuration example.
- [React plugin for Application Insights JavaScript SDK](app/javascript-react-plugin.md) - Added section on using React hooks.
- [Upgrading from Application Insights Java 2.x SDK](app/java-standalone-upgrade-from-2x.md) - New article.
- [Release notes for Microsoft.ApplicationInsights.SnapshotCollector](app/snapshot-collector-release-notes.md) - New article.

### Autoscale
- [Get started with autoscale in Azure](autoscale/autoscale-get-started.md) - Added section on moving Autoscale to a different region.

### Data collection
- [Configure data collection for the Azure Monitor agent (preview)](agents/data-collection-rule-azure-monitor-agent.md) - Updated for Azure Arc support.
- [Data Collection Rules in Azure Monitor (preview)](agents/data-collection-rule-overview.md) - Updated for Azure Arc support.
- [Resource Manager template samples for data collection rules](agents/resource-manager-data-collection-rules.md) - New article.

### Insights and solutions
- [Connect Azure to ITSM tools by using Secure Export](alerts/it-service-management-connector-secure-webhook-connections.md) - Added section on connecting to ServiceNow.

### Logs
- [Integrate Log Analytics and Excel](logs/log-excel.md) - New article.
- [Log Analytics data security](logs/data-security.md) - Added section on additional security features.
- [Log Analytics integration with Power BI](logs/log-powerbi.md) - New article.
- [Standard columns in Azure Monitor log records](logs/log-standard-columns.md) - Added _SubscriptionId column.

New and updated articles from restructure of log query content.

- [Log Analytics tutorial](logs/log-analytics-tutorial.md)
- [Log queries in Azure Monitor](logs/log-query-overview.md)
- [Overview of Log Analytics in Azure Monitor](logs/log-analytics-overview.md)
- [Samples for queries for Azure Data Explorer and Azure Monitor](/azure/data-explorer/kusto/query/samples?pivots=azuremonitor)
- [Tutorial: Use Kusto queries in Azure Data Explorer and Azure Monitor](/azure/data-explorer/kusto/query/tutorial?pivots=azuremonitor)



### Virtual machines

- [Enable VM insights overview](vm/vminsights-enable-overview.md) - Added supported regions.

New articles for VM insights guest health (preview)

- [VM insights guest health (preview)](vm/vminsights-health-overview.md)
- [VM insights guest health alerts (preview)](vm/vminsights-health-alerts.md)
- [Configure monitoring in VM insights guest health (preview)](vm/vminsights-health-configure.md)
- [Configure monitoring in VM insights guest health using data collection rules (preview)](vm/vminsights-health-configure-dcr.md)
- [Enable VM insights guest health (preview)](vm/vminsights-health-enable.md)
- [Troubleshoot VM insights guest health (preview)](vm/vminsights-health-troubleshoot.md)





## October 2020

### General
- [Azure Monitor API retirement](logs/operationalinsights-api-retirement.md) - New article.

### Agents
- [What is monitored by Azure Monitor](monitor-reference.md) - Added section on agents.

### Alerts
- [Create and manage action groups in the Azure portal](alerts/action-groups.md) - Added section on service tag.
- [Resource Manager template samples for metric alerts](alerts/resource-manager-alerts-metric.md) - Added content match parameter and test locations.
- [Troubleshooting Azure metric alerts](alerts/alerts-troubleshoot-metric.md) - Added best practice for rule configuration.

### Application Insights
- [Angular plugin for Application Insights JavaScript SDK](app/javascript-angular-plugin.md) - New article.
- [Azure Application Insights for ASP.NET Core applications](app/asp-net-core.md) - Added FAQ about ILogger logs.
- [Configure monitoring for ASP.NET with Azure Application Insights](app/asp-net.md) - Article rewritten.
- [Log-based and pre-aggregated metrics in Azure Application Insights](app/pre-aggregated-metrics-log-metrics.md) - Added tables with pre-aggregated metrics.
- [Monitor availability and responsiveness of any web site](app/monitor-web-app-availability.md) - Added section on location population tags.
- [Monitor Java applications anywhere - Azure Monitor Application Insights](app/java-standalone-config.md) - Added configuration example.
- [Monitor Java applications anywhere - Azure Monitor Application Insights](app/java-standalone-telemetry-processors.md) - New article.
- [Use Application Change Analysis in Azure Monitor to find web-app issues](app/change-analysis.md) - Added sections on virtual machines and Activity log.
  
### Autoscale
- [Get started with autoscale in Azure](autoscale/autoscale-get-started.md) - Added section on moving Autoscale to different region.

### Containers
- [Configure PV monitoring with Container insights](containers/container-insights-persistent-volumes.md) - New article.
- [How to manage the Container insights agent](containers/container-insights-manage-agent.md) -  Added support for Azure Arc enabled Kubernetes cluster.
- [Metric alerts from Container insights](containers/container-insights-metric-alerts.md) -  Added support for Azure Arc enabled Kubernetes cluster.

### Insights and solutions
- [IT Service Management Connector - Secure Export in Azure Monitor](alerts/it-service-management-connector-secure-webhook-connections.md) - Added section on ServiceNow.

### Logs
- [Archive data from Log Analytics workspace to Azure storage using Logic App](logs/logs-export-logic-app.md) - New article.
- [Log Analytics workspace data export in Azure Monitor (preview)](logs/logs-data-export.md) - Added sample body for REST request for event hub.
- [Manage usage and costs for Azure Monitor Logs](logs/manage-cost-storage.md) - Added information on relation between Azure Monitor Logs and Azure Security Center billing. Added query for node counts if using the Per Node pricing tier. 
- [Monitor health of Log Analytics workspace in Azure Monitor](logs/monitor-workspace.md) - New article.
- [Query data in Azure Monitor using Azure Data Explorer (preview)](logs/azure-data-explorer-monitor-proxy.md) - New article.
- [Query exported data from Azure Monitor using Azure Data Explorer (preview)](logs/azure-data-explorer-query-storage.md) - New article.

### Networks
- [Azure Monitor for Networks Preview](insights/network-insights-overview.md) - Added troubleshooting section. Added section on connectivity.

### Platform logs
- [Azure Activity Log event schema](essentials/activity-log-schema.md) - Added description of severity levels.

### Virtual machines
- [Change analysis in Azure Monitor for VMs](vm/vminsights-change-analysis.md) - New article.
- [Enable Azure Monitor for VMs overview](vm/vminsights-enable-overview.md) - Added supported regions.
- [How to update Container insights for metrics](containers/container-insights-update-metrics.md) -  Added support for Azure Arc enabled Kubernetes cluster.



## September 2020

### General
- [Azure Monitor FAQ](faq.md) - Added section on OpenTelemetry.

### Agents
- [Azure Monitor agent overview](agents/azure-monitor-agent-overview.md) - Added decision factors for switching to new agent.
- [Overview of the Azure monitoring agents](agents/agents-overview.md) - Added support for Windows 10.

### Alerts
- [Create a log alert with Azure Resource Manager template](alerts/alerts-log-create-templates.md) - New article.
- [Troubleshooting Azure metric alerts](alerts/alerts-troubleshoot-metric.md) - Added section on exporting ARM template for a metric alert rule.

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
- [Configure Azure Arc enabled Kubernetes cluster with Container insights](containers/container-insights-enable-arc-enabled-clusters.md) - Added guidance for enabling monitoring using service principal.
- [Deployment & HPA metrics with Container insights](containers/container-insights-deployment-hpa-metrics.md) - New article.

### Insights and solutions
- [Azure Monitor for Azure Cache for Redis](insights/redis-cache-insights-overview.md) - Removed preview designation.
- [Azure Monitor for Networks (Preview)](insights/network-insights-overview.md) - Added Connectivity and Traffic sections.
- [IT Service Management Connector - Secure Export in Azure Monitor](alerts/it-service-management-connector-secure-webhook-connections.md) - New article.
- [IT Service Management Connector in Azure Monitor](alerts/itsmc-connections.md) - Note on Cherwell and Provance ITSM integrations.
- [Monitor Key Vault with Azure Monitor for Key Vault](insights/key-vault-insights-overview.md) - Removed preview designation.

### Logs
- [Audit queries in Azure Monitor log queries](logs/query-audit.md) - New article.
- [Azure Monitor customer-managed key](logs/customer-managed-keys.md) - Added customer lockbox.
- [Azure Monitor Logs Dedicated Clusters](logs/logs-dedicated-clusters.md) - New article.
- [Designing your Azure Monitor Logs deployment](logs/design-logs-deployment.md) - Updated scale and ingestion volume rate limit section.
- [Log query scope in Azure Monitor Log Analytics](logs/scope.md) - Updates to include workspace-based applications.
- [Logs in Azure Monitor](logs/data-platform-logs.md) - Updates to include workspace-based applications.
- [Standard columns in Azure Monitor log records](logs/log-standard-columns.md) - Updates to include workspace-based applications.
- [Azure Monitor service limits](service-limits.md) - Updated limits for user query throttling.
- [Using customer-managed storage accounts in Azure Monitor Log Analytics](logs/private-storage.md) - Article rewritten.
- [Viewing and analyzing data in Azure Log Analytics](./logs/data-platform-logs.md) - Updates to include workspace-based applications.


### Platform logs
- [Azure Activity Log event schema - Azure Monitor](essentials/activity-log-schema.md) - Added severity levels.
- [Resource Manager template samples for diagnostic settings](essentials/resource-manager-diagnostic-settings.md) - Added sample for Azure storage account.

### Visualizations
- [Azure Monitor workbook chart visualizations](visualize/workbooks-chart-visualizations.md) - New article.
- [Azure Monitor workbook composite bar renderer](visualize/workbooks-composite-bar.md) - New article.
- [Azure Monitor workbook graph visualizations](visualize/workbooks-graph-visualizations.md) - New article.
- [Azure Monitor workbook grid visualizations](visualize/workbooks-grid-visualizations.md) - New article.
- [Azure Monitor workbook honey comb visualizations](visualize/workbooks-honey-comb.md) - New article.
- [Azure Monitor workbook text visualizations](visualize/workbooks-text-visualizations.md) - New article.
- [Azure Monitor workbook tile visualizations](visualize/workbooks-tile-visualizations.md) - New article.
- [Azure Monitor workbook tree visualizations](visualize/workbooks-tree-visualizations.md) - New article.




## August 2020

### General

- [What is monitored by Azure Monitor](monitor-reference.md) - Updated to include Azure Monitor agent.


### Agents
- [Azure Monitor agent overview](agents/azure-monitor-agent-overview.md) - New article.
- [Enable Azure Monitor for a hybrid environment](vm/vminsights-enable-hybrid.md) - Updated dependency agent version.
- [Overview of the Azure monitoring agents](agents/agents-overview.md) - Added Azure Monitor agent and consolidated OS support table.


#### New and updated articles from restructure of agent content
- [Enable VM insights overview](vm/vminsights-enable-overview.md)
- [Install Log Analytics agent on Linux computers](agents/agent-linux.md)
- [Install Log Analytics agent on Windows computers](agents/agent-windows.md)
- [Log Analytics agent overview](agents/log-analytics-agent.md)

### Application Insights
- [Azure Application Insights for JavaScript web apps](app/javascript.md) - Added section clarifying client server correlation and configuration for CORS correlation.
- [Create a new Azure Monitor Application Insights workspace-based resource](app/create-workspace-resource.md) - Added capabilities provided by workspace-based applications.
- [IP addresses used by Application Insights and Log Analytics](app/ip-addresses.md) - Updated IP addresses for live metrics stream.
- [Monitor Java applications on any environment - Azure Monitor Application Insights](app/java-in-process-agent.md) - Added table for supported custom telemetry.
- [Native React plugin for Application Insights JavaScript SDK](app/javascript-react-native-plugin.md) - New article.
- [React plugin for Application Insights JavaScript SDK](app/javascript-react-plugin.md) - New article.
- [Resource Manager template sample for creating Azure Function apps with Application Insights monitoring](app/resource-manager-function-app.md) - New article.
- [Resource Manager template samples for creating Azure App Services web apps with Application Insights monitoring](app/resource-manager-web-app.md) - New article.
- [Usage analysis with Azure Application Insights](app/usage-overview.md) - Added video.

### Autoscale
- [Get started with autoscale in Azure](autoscale/autoscale-get-started.md) - Added section on routing to healthy instances for App Service.

### Data collection
- [Configure data collection for the Azure Monitor agent (preview)](agents/data-collection-rule-azure-monitor-agent.md) - New article.
- [Data Collection Rules in Azure Monitor (preview)](agents/data-collection-rule-overview.md) - New article.


### Containers
- [Deployment & HPA metrics with Container insights](containers/container-insights-deployment-hpa-metrics.md) - New article.

### Insights
- [Monitoring solutions in Azure Monitor](insights/solutions.md) - Updated for new UI.
- [Network Performance Monitor solution in Azure](insights/network-performance-monitor.md) - Added supported workspace regions.


### Logs
- [Azure Monitor FAQ](faq.md) - Added entry for deleting data from a workspace. Added entry on 502 and 503 responses.
  - [Designing your Azure Monitor Logs deployment](logs/design-logs-deployment.md) - Updates to Ingestion volume rate limit section.
- [Manage usage and costs for Azure Monitor Logs](logs/manage-cost-storage.md) - Updated usage queries to more efficient query format.
- [Optimize log queries in Azure Monitor](logs/query-optimization.md) - Added specific values to performance indicators.
- [Resource Manager template samples for diagnostic settings](essentials/resource-manager-diagnostic-settings.md) - Added sample for log query audit logs.


### Platform logs
- [Create diagnostic settings to send platform logs and metrics to different destinations](essentials/diagnostic-settings.md) - Added regional requirement for diagnostic settings.

### Visualizations
- [Azure Monitor Workbooks Overview](visualize/workbooks-overview.md) - Added video.
- [Move an Azure Workbook Template to another region](visualize/workbook-templates-move-region.md) - New article.
- [Move an Azure Workbook to another region](visualize/workbooks-move-region.md) - New article.



## July 2020

### General
- [Deploy Azure Monitor](deploy-scale.md) - Restructure of VM insights onboarding content.
- [Use Azure Private Link to securely connect networks to Azure Monitor](logs/private-link-security.md) - Added section on limits.

### Alerts
- [Action rules for Azure Monitor alerts](alerts/alerts-action-rules.md) - Added CLI processes.
- [Create and manage action groups in the Azure portal](alerts/action-groups.md) - Updated to reflect changes in UI.
- [Example queries in Azure Monitor Log Analytics](logs/example-queries.md) - New article.
- [Troubleshoot log alerts in Azure Monitor](alerts/alerts-troubleshoot-log.md) - Added section on alert rule quota.
- [Troubleshooting Azure metric alerts](alerts/alerts-troubleshoot-metric.md) - Added section on alert rule on a custom metric that isn't emitted yet.
- [Understand how metric alerts work in Azure Monitor.](alerts/alerts-metric-overview.md) - Added recommendation for selecting aggregation granularity.

### Application Insights
- [Release Notes for Azure web app extension - Application Insights](app/web-app-extension-release-notes.md) - New article.
- [Resource Manager template samples for Application Insights Resources](app/resource-manager-app-resource.md) - New article.
- [Troubleshoot problems with Azure Application Insights Profiler](app/profiler-troubleshooting.md) - Added note on bug running profiler for ASP.NET Core apps on Azure App Service. 

### Containers
- [Log alerts from Container insights](containers/container-insights-log-alerts.md) - New article.
- [Metric alerts from Container insights](containers/container-insights-metric-alerts.md) - New article.

### Logs
- [Azure Monitor customer-managed key](logs/customer-managed-keys.md) - Added error message and section CMK configuration for queries.
- [Azure Monitor HTTP Data Collector API](logs/data-collector-api.md) - Added Python 3 sample.
- [Optimize log queries in Azure Monitor](logs/query-optimization.md) - Added section on avoiding multiple data scans when using subqueries.
- [Tutorial: Get started with Log Analytics queries](./logs/log-analytics-tutorial.md) - Added video.

### Platform logs
- [Create diagnostic settings to send platform logs and metrics to different destinations](essentials/diagnostic-settings.md) - Added video.
- [Resource Manager template samples for Azure Monitor](/resource-manager-samples.md) - Added ARM sample using Logs destination type. 

### Solutions
- [Monitoring solutions in Azure Monitor](insights/solutions.md) - Added CLI processes.
- [Office 365 management solution in Azure](insights/solution-office-365.md) - Changed retirement date.

### Virtual machines

New and updated articles from restructure of VM insights content

- [What is VM insights?](vm/vminsights-overview.md)
- [Configure Log Analytics workspace for VM insights](vm/vminsights-configure-workspace.md)
- [Connect Linux computers to Azure Monitor](agents/agent-linux.md)
- [Enable Azure Monitor for a hybrid environment](vm/vminsights-enable-hybrid.md)
- [Enable Azure Monitor for single virtual machine or virtual machine scale set in the Azure portal](vm/vminsights-enable-portal.md)
- [Enable VM insights by using Azure Policy](./vm/vminsights-enable-policy.md)
- [Enable VM insights overview](vm/vminsights-enable-overview.md)
- [Enable VM insights using PowerShell](vm/vminsights-enable-powershell.md)
- [Enable VM insights using Resource Manager templates](vm/vminsights-enable-resource-manager.md)
- [Enable VM insights with PowerShell or templates](./vm/vminsights-enable-powershell.md)


### Visualizations
- [Upgrading your Log Analytics Dashboard visualizations](logs/dashboard-upgrade.md) - Updated refresh rate.
- [Visualizing data from Azure Monitor](visualizations.md) - Added video.


## June 2020

### General
- [Deploy Azure Monitor](deploy-scale.md) - New article.
- [Azure Monitor customer-managed key](logs/customer-managed-keys.md) - Updated billingtype property. Added PowerShell commands.

### Agents
- [Log Analytics agent overview](agents/log-analytics-agent.md) - Added Python 2 requirement.

### Alerts
- [How to update alert rules or action rules when their target resource moves to a different Azure region](alerts/alerts-resource-move.md) - New article.
- [Troubleshooting Azure metric alerts](alerts/alerts-troubleshoot-metric.md) - New article.
- [Troubleshooting log alerts in Azure Monitor](alerts/alerts-troubleshoot-metric.md) - New article.
  
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
- [How to stop monitoring your hybrid Kubernetes cluster](containers/container-insights-optout-hybrid.md) - Added section for Arc enabled Kubernetes.
- [Configure Azure Arc enabled Kubernetes cluster with Container insights](containers/container-insights-enable-arc-enabled-clusters.md) - New article.
- [Configure Azure Red Hat OpenShift v4.x with Container insights](containers/container-insights-azure-redhat4-setup.md) - Updated prerequisites.
- [Set up Container insights Live Data (preview)](containers/container-insights-livedata-setup.md) - Removed note about feature not being available in Azure US Government.

### Insights
- [FAQs - Network Performance Monitor solution in Azure](insights/network-performance-monitor-faq.md) - Added FAQ for ExpressRoute Monitor.

### Logs
- [Delete and recover Azure Log Analytics workspace](logs/delete-workspace.md) - Added PowerShell command. Updated troubleshooting.
- [Manage Log Analytics workspaces in Azure Monitor](logs/manage-access.md) - Added example for unallowed tables in Azure RBAC section.
- [Manage usage and costs for Azure Monitor Logs](logs/manage-cost-storage.md) - Additional detail on calculation of data size. Updated configuring data volume alerts. Details about security data collected by Azure Sentinel. Clarification on data cap.
- [Use Azure Monitor Logs with Azure Logic Apps and Power Automate](logs/logicapp-flow-connector.md) - Added connector limits.

### Metrics
- [Azure Monitor supported metrics by resource type](essentials/metrics-supported.md) - Updated SQL Server metrics.


### Platform logs

- [Resource Manager template samples for diagnostic settings](essentials/resource-manager-diagnostic-settings.md) - Fix for Activity log diagnostic setting.
- [Send Azure Activity log to Log Analytics workspace using Azure portal](essentials/quick-collect-activity-log-portal.md) - New article.
- [Send Azure Activity log to Log Analytics workspace using Azure Resource Manager template](essentials/quick-collect-activity-log-arm.md) - New article.

New and updated articles from restructure and consolidation of platform log content

- [Archive Azure resource logs to storage account](./essentials/resource-logs.md#send-to-azure-storage)
- [Azure Activity Log event schema](essentials/activity-log-schema.md)
- [Azure Activity log](essentials/activity-log.md)
- [Azure Monitor CLI samples](/cli-samples.md)
- [Azure Monitor PowerShell samples](/powershell-samples.md)
- [Azure Monitoring REST API walkthrough](essentials/rest-api-walkthrough.md)
- [Azure Resource Logs supported services and schemas](./essentials/resource-logs-schema.md)
- [Azure resource logs](essentials/resource-logs.md)
- [Collect and analyze Azure activity log in Azure Monitor](./essentials/activity-log.md)
- [Collect Azure resource logs in Log Analytics workspace](./essentials/resource-logs.md#send-to-log-analytics-workspace)
- [Create diagnostic settings to send platform logs and metrics to different destinations](essentials/diagnostic-settings.md)
- [Export the Azure Activity Log](./essentials/activity-log.md#legacy-collection-methods)
- [Overview of Azure platform logs](essentials/platform-logs-overview.md)
- [Stream Azure platform logs to an event hub](./essentials/resource-logs.md#send-to-azure-event-hubs)
- [View Azure Activity log events in Azure Monitor](./essentials/activity-log.md#view-the-activity-log)

### Virtual machines
- [Enable VM insights in the Azure portal](./vm/vminsights-enable-portal.md) - Updated to include Azure Arc.
- [Enable VM insights overview](vm/vminsights-enable-overview.md) - Updated to include Azure Arc.
- [What is VM insights?](vm/vminsights-overview.md) - Updated to include Azure Arc.


### Visualizations
- [Azure Monitor workbooks data sources](visualize/workbooks-data-sources.md) - Added Alerts and Custom Endpoints section.
- [Troubleshooting Azure Monitor workbook-based insights](insights/troubleshoot-workbooks.md) - New article.
- [Upgrading your Log Analytics Dashboard visualizations](logs/dashboard-upgrade.md) - New article.



## May 2020

### General

- [Azure Monitor FAQ](faq.md) - Added section for Metrics.
- [Azure Monitor customer-managed key](logs/customer-managed-keys.md) - Various changes in preparation for general availability.
- [Built-in policy definitions for Azure Monitor](./policy-reference.md) - New article.
- [Customer-owned storage accounts for log ingestion](logs/private-storage.md) - New article.
- [Manage usage and costs for Azure Monitor Logs](logs/manage-cost-storage.md) - Added cluster proportional billing.
- [Use Azure Private Link to securely connect networks to Azure Monitor](logs/private-link-security.md) - New article.


#### New Resource Manager template samples 
- [Resource Manager template samples for Azure Monitor](/resource-manager-samples.md)
- [Resource Manager template samples for action groups](alerts/resource-manager-action-groups.md)
- [Resource Manager template samples for agents](agents/resource-manager-agent.md)
- [Resource Manager template samples for Container insights](containers/resource-manager-container-insights.md)
- [Resource Manager template samples for VM insights](vm/resource-manager-vminsights.md)
- [Resource Manager template samples for diagnostic settings](essentials/resource-manager-diagnostic-settings.md)
- [Resource Manager template samples for Log Analytics workspaces](logs/resource-manager-workspace.md)
- [Resource Manager template samples for log queries](logs/resource-manager-log-queries.md)
- [Resource Manager template samples for log query alert rules](alerts/resource-manager-alerts-log.md)
- [Resource Manager template samples for metric alert rules](alerts/resource-manager-alerts-metric.md)
- [Resource Manager template samples for workbooks](visualize/resource-manager-workbooks.md)

### Agents
- [Install and configure Windows Azure diagnostics extension (WAD)](agents/diagnostics-extension-windows-install.md) - Added detail on configuring diagnostics.
- [Log Analytics agent overview](agents/log-analytics-agent.md) - Added supported Linux versions.

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
- [app() expression in Azure Monitor log queries](logs/app-expression.md)
- [Log query scope in Azure Monitor Log Analytics](logs/scope.md)
- [Query across resources with Azure Monitor](logs/cross-workspace-query.md)
- [Standard properties in Azure Monitor log records](./logs/log-standard-columns.md)
- [Structure of Azure Monitor Logs](./logs/data-platform-logs.md)





### Containers
- [How to enable Container insights](containers/container-insights-onboard.md) - Updated firewall configuration table.
- [How to update Container insights for metrics](containers/container-insights-update-metrics.md) - Update for using managed identities to collect metrics.
- [Monitoring cost for Container insights](containers/container-insights-cost.md) - New article.
- [Set up Container insights Live Data (preview)](containers/container-insights-livedata-setup.md) - Support for new cluster role binding.

### Insights
- [Azure Monitor for Azure Cache for Redis (preview)](insights/redis-cache-insights-overview.md) - New article.
- [Monitor Key Vault with Azure Monitor for Key Vault (preview)](./insights/key-vault-insights-overview.md) - New article.

### Logs
- [Create & configure Log Analytics with PowerShell](logs/powershell-workspace-configuration.md) - Added troubleshooting section.
- [Create a Log Analytics workspace in the Azure portal](logs/quick-create-workspace.md) - Added troubleshooting section.
- [Create a Log Analytics workspace using Azure CLI](logs/quick-create-workspace-cli.md) - Added troubleshooting section.
- [Delete and recover Azure Log Analytics workspace](logs/delete-workspace.md) - Updated information on recovering a deleted workspace.
- [Functions in Azure Monitor log queries](logs/functions.md) - Removed note about functions not containing other functions.
- [Structure of Azure Monitor Logs](./logs/data-platform-logs.md) - Clarified property descriptions for Application Insights table.
- [Use Azure Monitor Logs with Azure Logic Apps and Power Automate](logs/logicapp-flow-connector.md) - Added limits section.
- [Use PowerShell to Create and Configure a Log Analytics Workspace](logs/powershell-workspace-configuration.md) - Added troubleshooting section.


### Metrics
- [Azure Monitor supported metrics by resource type](essentials/metrics-supported.md) - Clarified guest metrics and metrics routing. 

### Solutions
- [Optimize your Active Directory environment with Azure Monitor](insights/ad-assessment.md) - Added Windows Server 2019 to supported versions.
- [Optimize your SQL Server environment with Azure Monitor](insights/sql-assessment.md) - Added to supported versions of SQL Server.


### Virtual machines
- [Enable VM insights overview](vm/vminsights-enable-overview.md) - Added to supported versions of Ubuntu Server. Added supported regions for Log Analytics workspace.
- [How to chart performance with VM insights](vm/vminsights-performance.md) - Added limitations section for unavailable metrics.

### Visualizations
- [Azure Monitor Workbooks and Azure Resource Manager Templates](visualize/workbooks-automate.md) - Added Resource Manager update for deploying a workbook template.
- [Azure Monitor Workbooks Groups](./visualize/workbooks-groups.md) - New article.
- [Azure Monitor Workbooks - Transform JSON data with JSONPath](visualize/workbooks-jsonpath.md) - New article.


## April 2020

### General

- [Azure Monitor customer-managed key](logs/customer-managed-keys.md) - Added section on asynchronous operations
- [Manage Log Analytics workspaces in Azure Monitor](logs/manage-access.md) - Updated custom logs sections.

### Alerts

- [Action rules for Azure Monitor alerts](alerts/alerts-action-rules.md) - Added video.
- [Overview of alerting and notification monitoring in Azure](alerts/alerts-overview.md) - Added video.

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

- [Configure Azure Red Hat OpenShift v4.x with Container insights](containers/container-insights-azure-redhat4-setup.md) - New article.
- [How to manually fix ServiceNow sync problems](alerts/itsmc-resync-servicenow.md) - New article.
- [How to stop monitoring your Azure and Red Hat OpenShift v4 cluster](containers/container-insights-optout-openshift-v4.md) - New article.
- [How to stop monitoring your Azure Red Hat OpenShift v3 cluster](containers/container-insights-optout-openshift-v3.md) - New article.
- [How to stop monitoring your hybrid Kubernetes cluster](containers/container-insights-optout-hybrid.md) - New article.

### Insights

- [Monitor Azure Key Vaults with Azure Monitor for Key Vaults (preview)](insights/key-vault-insights-overview.md) - New article.

### Logs

- [Azure Monitor service limits](service-limits.md) - Added user query throttling.
- [Manage usage and costs for Azure Monitor Logs](logs/manage-cost-storage.md) - Added billing for Logs clusters. Added Kusto query to enable customers with legacy Per Node pricing tier to determine whether they should move to a Per GB or Capacity Reservation tier.

### Metrics

- [Advanced features of Azure Metrics Explorer](essentials/metrics-charts.md) - Added aggregation section.

### Workbooks

- [Azure Monitor Workbooks and Azure Resource Manager Templates](visualize/workbooks-automate.md) - Added Resource Manager template for deploying a workbook template.

## March 2020

### General

- [Azure Monitor overview](overview.md) - Added Azure Monitor overview video.
- [Azure Monitor customer-managed key configuration](logs/customer-managed-keys.md) - General updates.
- [Azure Monitor data reference](/azure/azure-monitor/reference/) - New site.

### Alerts

- [Create, view, and manage activity log alerts in Azure Monitor](alerts/alerts-activity-log.md) - Additional explanation of Resource Manager template.
- [Understand how metric alerts work in Azure Monitor.](alerts/alerts-metric-overview.md) - Updated for government support.
- [Troubleshooting Azure Monitor alerts and notifications](alerts/alerts-troubleshoot.md) - New article.

### Application Insights

- [Automate Azure Application Insights with PowerShell](app/powershell.md) - Added ARMClient examples.
- [Continuous export of telemetry from Application Insights](app/export-telemetry.md) - Add table with details of export structure.
- [Enable Snapshot Debugger for .NET apps in Azure App Service](app/snapshot-debugger-appservice.md) - Added Resource Manager template example.
- [Manage usage and costs for Azure Application Insights](app/pricing.md) - Added information on data cap alert.
- [Monitor Python applications with Azure Monitor (preview)](app/opencensus-python.md) - Added standard metrics.
- [Source map support for JavaScript applications - Azure Monitor Application Insights](app/source-map-support.md) - New article.

### Containers

- [Azure Monitor FAQ](faq.md) - Update for Container insights.
- [Configure GPU monitoring with Container insights](containers/container-insights-gpu-monitoring.md) - New article.

### Insights

- [Office 365 management solution in Azure](insights/solution-office-365.md) - Updated deprecation date.

### Logs

- [Optimize log queries in Azure Monitor](logs/query-optimization.md) - Added CPU condition for XML and JSON parsing.
- [Delete and recover Azure Log Analytics workspace](logs/delete-workspace.md) - Added troubleshooting.
- [Use Azure Monitor Logs with Azure Logic Apps and Power Automate](logs/logicapp-flow-connector.md) - Updated for new Azure Monitor connector.

### Metrics

- [Disk metrics deprecation in the Azure portal](essentials/portal-disk-metrics-deprecation.md) - New article.
- [Tutorial - Create a metrics chart in Azure Monitor](essentials/tutorial-metrics-explorer.md) - Added video.

### Platform logs

- [Collect and analyze Azure activity log in Azure Monitor](./essentials/activity-log.md) - Rewrite to better explain collecting Activity log with diagnostic settings.

### Virtual machines

- [Monitor Azure virtual machines with Azure Monitor](vm/monitor-vm-azure.md) - New article.
- [Quickstart: Monitor Azure virtual machines with Azure Monitor](vm/quick-monitor-azure-vm.md) - Updated to add VM insights.
- [Alerts from VM insights](vm/vminsights-alerts.md) - New article.
- [Enable VM insights overview](vm/vminsights-enable-overview.md) - Updated agent download links.

General updates for general availability of VM insights

- [What is VM insights?](vm/vminsights-overview.md)
- [VM insights (GA) frequently asked questions](vm/vminsights-ga-release-faq.md) 
- [Enable VM insights by using Azure Policy](./vm/vminsights-enable-policy.md) 
- [How to chart performance with VM insights](vm/vminsights-performance.md)
- [How to Query Logs from VM insights](vm/vminsights-log-search.md)
- [View app dependencies with VM insights](vm/vminsights-maps.md) 

### Visualizations

- [Visualizing data from Azure Monitor](visualizations.md) - Updated to note planned deprecation of View Designer.

## February 2020

### Agents

Multiple updates as part of rewrite of diagnostics extension content.

- [Overview of the Azure monitoring agents](agents/agents-overview.md) - Restructured tables to better clarify unique features of each agent.
- [Azure Diagnostics extension overview](agents/diagnostics-extension-overview.md) - Complete rewrite.
- [Use blob storage for IIS and table storage for events in Azure Monitor](essentials/diagnostics-extension-logs.md) - General rewrite for update and clarity.
- [Install and configure Windows Azure diagnostics extension (WAD)](agents/diagnostics-extension-windows-install.md) - New article. 
- [Windows diagnostics extension schema](agents/diagnostics-extension-schema-windows.md) - Reorganized.
- [Send data from Windows Azure diagnostics extension to Azure Event Hubs](agents/diagnostics-extension-stream-event-hubs.md) - Completely rewritten and updated.
- [Store and view diagnostic data in Azure Storage](../cloud-services/diagnostics-extension-to-storage.md) - Completely rewritten and updated.
- [Log Analytics virtual machine extension for Windows](../virtual-machines/extensions/oms-windows.md) - Better clarifies relationship with Log Analytics agent.
- [Azure Monitor virtual machine extension for Linux](../virtual-machines/extensions/oms-linux.md) - Better clarifies relationship with Log Analytics agent.

### Application Insights

- [Connection strings in Azure Application Insights](app/sdk-connection-string.md) - New article.

### Insights and solutions

#### Container insights

- [Integrate Azure Active Directory with Azure Kubernetes Service](../aks/azure-ad-integration-cli.md) - Added note for creating a client application to support Kubernetes RBAC-enabled cluster to support Container insights.

#### VM insights

- [VM insights (GA) frequently asked questions](vm/vminsights-ga-release-faq.md) - Change to how performance data is stored.

#### Office 365

- [Office 365 management solution in Azure](insights/solution-office-365.md) - Updated deprecation date.


### Logs

- [Optimize log queries in Azure Monitor](logs/query-optimization.md) - New article.
- [Manage usage and costs for Azure Monitor Logs](logs/manage-cost-storage.md) - Improved sample queries to help understand your usage.

### Metrics

- [Azure Monitor platform metrics exportable via Diagnostic Settings](essentials/metrics-supported-export-diagnostic-settings.md) - Added section on change to behavior for nulls and zero values.

### Visualizations

Multiple New articles for view designer to workbooks conversion guide.

- [Azure Monitor view designer to workbooks transition guide](visualize/view-designer-conversion-overview.md) - New article.
- [Azure Monitor view designer to workbooks conversion options](visualize/view-designer-conversion-options.md) - New article.
- [Azure Monitor view designer to workbooks tile conversions](visualize/view-designer-conversion-tiles.md) - New article.
- [Azure Monitor view designer to workbooks conversion summary and access](visualize/view-designer-conversion-access.md) - New article.
- [Azure Monitor view designer to workbooks conversion common tasks](visualize/view-designer-conversion-tasks.md) - New article.
- [Azure Monitor view designer to workbooks conversion examples](visualize/view-designer-conversion-examples.md) - New article.

## January 2020

### General

- [What is monitored by Azure Monitor?](monitor-reference.md) - New article.

### Agents

- [Collect log data with Azure Log Analytics agent](agents/log-analytics-agent.md) - Updated network firewall requirements table.

### Alerts

- [Create and manage action groups in the Azure portal](alerts/action-groups.md) - Setting removed for v2 functions that is no longer required.
- [Create a metric alert with a Resource Manager template](alerts/alerts-metric-create-templates.md) - Added example for the *ignoreDataBefore* parameter.  Added constraints about multi-criteria rules.
- [Using Log Analytics Alert REST API](alerts/api-alerts.md) - JSON example corrected.

### Application Insights

- [IP addresses used by Application Insights and Log Analytics](app/ip-addresses.md) - Updated the Availability test section with how to add an inbound port rule to allow traffic using Azure Network Security Groups.
- [Troubleshoot problems with Azure Application Insights Profiler](app/profiler-troubleshooting.md) - Updated general troubleshooting.
- [Telemetry sampling in Azure Application Insights](app/sampling.md) - Updated and restructured to  improve readability based on customer feedback.

### Data security

- [Azure Monitor customer-managed key configuration](logs/customer-managed-keys.md) - New article.

### Insights and solutions

#### Container insights

- [Configure Container insights agent data collection](containers/container-insights-agent-config.md) - Added details for upgrading agent on Azure Red Hat OpenShift, and added additional information to distinguish the methods for upgrading agent.
- [Create performance alerts for Container insights](./containers/container-insights-log-alerts.md) - Revised information and updated steps for creating an alert on performance data stored in workspace using workspace-context alerts.
- [Kubernetes monitoring with Container insights](containers/container-insights-analyze.md) - Updated both the overview article and the analyze article regarding support of Windows Kubernetes clusters.
- [Configure Azure Red Hat OpenShift clusters with Container insights](containers/container-insights-azure-redhat-setup.md) - Added details for upgrading agent on Azure Red Hat OpenShift, and added additional information to distinguish the methods for upgrading agent.
- [Configure Hybrid Kubernetes clusters with Container insights](containers/container-insights-hybrid-setup.md) - Updated to reflect added support for secure port:10250 with the Kubelet's cAdvisor.
- [How to manage the Container insights agent](containers/container-insights-manage-agent.md) - Updated details related to behavior and config of metric scraping with Azure Red Hat OpenShift compared to other types of Kubernetes clusters.
- [Configure Container insights Prometheus Integration](containers/container-insights-prometheus-integration.md) - Updated details related to behavior and config of metric scraping with Azure Red Hat OpenShift compared to other types of Kubernetes clusters.
- [How to update Container insights for metrics](containers/container-insights-update-metrics.md) - Updated details related to behavior and config of metric scraping with Azure Red Hat OpenShift compared to other types of Kubernetes clusters.

#### VM insights

- [VM insights (GA) frequently asked questions](vm/vminsights-ga-release-faq.md) - Added information on upgrading workspace and agents to new version.

#### Office 365

- [Office 365 management solution in Azure](insights/solution-office-365.md) - Added details and FAQ on migrating to Office 365 solution in Azure Sentinel. Removed onboarding section.

### Logs

- [Manage Log Analytics workspaces in Azure Monitor](logs/manage-access.md) - Updates to Not actions.
- [Manage usage and costs for Azure Monitor Logs](logs/manage-cost-storage.md) - Added clarification on calculation of data volume in the Pricing Model section.
- [Use Azure Resource Manager templates to Create and Configure a Log Analytics Workspace](./logs/resource-manager-workspace.md) - Updated template with new pricing tiers.

### Platform logs

- [Collect Azure Activity log with diagnostic settings- Azure Monitor](./essentials/activity-log.md) - Additional information on changed properties.
- [Export the Azure Activity Log](./essentials/activity-log.md#legacy-collection-methods) - Updated for UI changes. 

## December 2019

### Agents

- [Connect Linux computers to Azure Monitor](agents/agent-linux.md) - New article.

### Alerts

- [Create a metric alert with a Resource Manager template](alerts/alerts-metric-create-templates.md) - Added example for custom metric.
- [Creating Alerts with Dynamic Thresholds in Azure Monitor](alerts/alerts-dynamic-thresholds.md) - Added section on interpreting dynamic threshold charts.
- [Overview of alerting and notification monitoring in Azure](alerts/alerts-overview.md) - Updated Resource Graph query.
- [Supported resources for metric alerts in Azure Monitor](alerts/alerts-metric-near-real-time.md) - Update to metrics and dimensions supported.
- [Switch from legacy Log Analytics alerts API into new Azure Alerts API](alerts/alerts-log-api-switch.md) - Added note on modified alert name.
- [Understand how metric alerts work in Azure Monitor.](alerts/alerts-metric-overview.md) - Added supported resource types for monitoring at scale.

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

- [Container insights Frequently Asked Questions](./faq.md) - Added question on Image and Name fields.
- [Azure SQL Analytics solution in Azure Monitor](insights/azure-sql.md) - Updated Database waits Managed Instance support.
- [Configure Container insights agent data collection](containers/container-insights-agent-config.md) - Added setting for enrich_container_logs.
- [Configure Hybrid Kubernetes clusters with Container insights](containers/container-insights-hybrid-setup.md) - Added troubleshooting section.
- [Monitor Active Directory replication status with Azure Monitor](insights/ad-replication-status.md) - .NET Framework prerequisite updated.
- [Network Performance Monitor solution in Azure](insights/network-performance-monitor.md) - Added supported regions.
- [Optimize your Active Directory environment with Azure Monitor](insights/ad-assessment.md) - .NET Framework prerequisite updated.
- [Optimize your SQL Server environment with Azure Monitor](insights/sql-assessment.md) - .NET Framework prerequisite updated.
- [Optimize your System Center Operations Manager environment with Azure Log Analytics](insights/scom-assessment.md) - .NET Framework prerequisite updated.
- [Supported connections with IT Service Management Connector in Azure Log Analytics](alerts/itsmc-connections.md) - Added New York to prerequisite client ID and client secret.

### Logs

- [Delete and recover Azure Log Analytics workspace](logs/delete-workspace.md) - Added PowerShell method.
- [Designing your Azure Monitor Logs deployment](logs/design-logs-deployment.md) - Ingestion rate for a workspace increased.

### Metrics

- [Azure Monitor platform metrics exportable via Diagnostic Settings](essentials/metrics-supported-export-diagnostic-settings.md) - New article.

### Platform logs

Multiple articles updated as part of restructure of content for platform logs based on new feature for configuring activity log using diagnostic settings.

- [Archive Azure resource logs to storage account](./essentials/resource-logs.md#send-to-azure-storage)
- [Azure Activity Log event schema](essentials/activity-log-schema.md)
- [Azure Monitor service limits](service-limits.md)
- [Collect and analyze Azure activity logs in Log Analytics workspace](./essentials/activity-log.md)
- [Collect Azure Activity log with diagnostic settings (preview) - Azure Monitor](./essentials/activity-log.md)
- [Collect Azure Activity logs into a Log Analytics workspace across Azure tenants](./essentials/activity-log.md)
- [Collect Azure resource logs in Log Analytics workspace](./essentials/resource-logs.md#send-to-log-analytics-workspace)
- [Create diagnostic setting in Azure using Resource Manager template](./essentials/resource-manager-diagnostic-settings.md)
- [Create diagnostic setting to collect logs and metrics in Azure](essentials/diagnostic-settings.md)
- [Export the Azure Activity Log](./essentials/activity-log.md#legacy-collection-methods)
- [Overview of Azure platform logs](essentials/platform-logs-overview.md)
- [Stream Azure monitoring data to event hub](essentials/stream-monitoring-data-event-hubs.md)
- [Stream Azure platform logs to an event hub](./essentials/resource-logs.md#send-to-azure-event-hubs)

### Quickstarts and tutorials

- [Create a metrics chart in Azure Monitor](essentials/tutorial-metrics-explorer.md) - New article.
- [Collect resource logs from an Azure Resource and analyze with Azure Monitor](essentials/tutorial-resource-logs.md) - New article.
- [Monitor an Azure resource with Azure Monitor](essentials/quick-monitor-azure-resource.md) - New article.
   
## Next steps

- If you'd like to contribute to Azure Monitor documentation, see the [Docs Contributor Guide](/contribute/).