---
title: "What's new in Azure Monitor documentation"
description: "What's new in Azure Monitor documentation"
ms.topic: conceptual
ms.date: 10/13/2022
ms.author: edbaynash
---

# What's new in Azure Monitor documentation

This article lists significant changes to Azure Monitor documentation.

## September 2022


### Agents

| Article | Description |
|---|---|
|[Azure Monitor Agent overview](./agents/agents-overview.md)|Added Azure Monitor Agent support for ARM64-based virtual machines for a number of distributions. <br><br>Azure Monitor Agent and legacy agents don't support machines and appliances that run heavily customized or stripped-down versions of  operating system distributions. <br><br>Azure Monitor Agent versions 1.15.2 and higher now support syslog RFC formats, including Cisco Meraki, Cisco ASA, Cisco FTD, Sophos XG, Juniper Networks, Corelight Zeek, CipherTrust, NXLog, McAfee, and Common Event Format (CEF).|

### Alerts

| Article | Description |
|---|---|
|[Convert ITSM actions that send events to ServiceNow to secure webhook actions](./alerts/itsm-convert-servicenow-to-webhook.md)|As of September 2022, we're starting the 3-year process of deprecating support of using ITSM actions to send events to ServiceNow. Learn how to convert ITSM actions that send events to ServiceNow to secure webhook actions|
|[Create a new alert rule](./alerts/alerts-create-new-alert-rule.md)|Added description of all available monitoring services to create a new alert rule and alert processing rules pages. <br><br>Added support for regional processing for metric alert rules that monitor a custom metric with the scope defined as one of the supported regions. <br><br> Clarified that selecting the **Automatically resolve alerts** setting makes log alerts stateful.<|
|[Types of Azure Monitor alerts](https://learn.microsoft.com/azure/azure-monitor/alerts/alerts-types)|Azure Database for PostgreSQL - Flexible Servers  is supported for monitoring multiple resources.|
|[Upgrade legacy rules management to the current Log Alerts API from legacy Log Analytics Alert API](./alerts/alerts-log-api-switch.md)|The process of moving legacy log alert rules management from the legacy API to the current API is now supported by the government cloud.|

### Application insights

| Article | Description |
|---|---|
|[Azure Monitor OpenTelemetry-based auto-instrumentation for Java applications](./app/java-in-process-agent.md)|New OpenTelemetry `@WithSpan` annotation guidance.|
|[Capture Application Insights custom metrics with .NET and .NET Core](./app/tutorial-asp-net-custom-metrics.md)|Tutorial steps and images have been updated.|
|[Configuration options - Azure Monitor Application Insights for Java](/azure/azure-monitor/app/java-in-process-agent)|Connection string guidance updated.|
|[Enable Application Insights for ASP.NET Core applications](./app/tutorial-asp-net-core.md)|Tutorial steps and images have been updated.|
|[Enable Azure Monitor OpenTelemetry Exporter for .NET, Node.js, and Python applications (preview)](./app/opentelemetry-enable.md)|Our product feedback link at the bottom of each document has been fixed.|
|[Filter and preprocess telemetry in the Application Insights SDK](./app/api-filtering-sampling.md)|Added sample initializer to control which client IP gets used as part of geo-location mapping.|
|[Java Profiler for Azure Monitor Application Insights](./app/java-standalone-profiler.md)|Our new Java Profiler was announced at Ignite. Read all about it!|
|[Release notes for Azure Web App extension for Application Insights](./app/web-app-extension-release-notes.md)|Added release notes for 2.8.44 and 2.8.43.|
|[Resource Manager template samples for creating Application Insights resources](./app/resource-manager-app-resource.md)|Fixed inaccurate tagging of workspace-based resources as still in Preview.|
|[Unified cross-component transaction diagnostics](./app/transaction-diagnostics.md)|A complete FAQ section is added to help troubleshoot Azure portal errors, such as "error retrieving data".|
|[Upgrading from Application Insights Java 2.x SDK](./app/java-standalone-upgrade-from-2x.md)|Additional upgrade guidance added. Java 2.x has been deprecated.|
|[Using Azure Monitor Application Insights with Spring Boot](./app/java-spring-boot.md)|Configuration options have been updated.|

### Autoscale
| Article | Description |
|---|---|
|[Autoscale with multiple profiles](./autoscale/autoscale-multiprofile.md)|New article: Using multiple profiles in autoscale with CLI PowerShell and templates.|
|[Flapping in Autoscale](./autoscale/autoscale-flapping.md)|New Article: Flapping in autoscale.|
|[Understand Autoscale settings](./autoscale/autoscale-understanding-settings.md)|Clarified how often autoscale runs.|

### Change analysis
| Article | Description |
|---|---|
|[Troubleshoot Azure Monitor's Change Analysis](./change/change-analysis-troubleshoot.md)|Added section about partial data and how to mitigate to the troubleshooting guide.|

### Essentials
| Article | Description |
|---|---|
|[Structure of transformation in Azure Monitor (preview)](./essentials/data-collection-transformations-structure.md)|New KQL functions supported.|

### Virtual Machines
| Article | Description |
|---|---|
|[Migrate from Service Map to Azure Monitor VM insights](./vm/vminsights-migrate-from-service-map.md)|Added a new article with guidance for migrating from the Service Map solution to Azure Monitor VM insights.|

### Network Insights

| Article | Description |
|---|---|
|[Network Insights](../network-watcher/network-insights-overview.md)| Onboarded the new topology experience to Network Insights in Azure Monitor.|


### Visualizations
| Article | Description |
|---|---|
|[Access deprecated Troubleshooting guides in Azure Workbooks](./visualize/workbooks-access-troubleshooting-guide.md)|New article: Access deprecated Troubleshooting guides in Azure Workbooks.|


## August  2022

### Agents

| Article | Description |
|---|---|
|[Log Analytics agent overview](agents/log-analytics-agent.md)|Restructured the Agents section and rewrote the Agents Overview article to reflect that Azure Monitor Agent is the primary agent for collecting monitoring data.|
|[Dependency analysis in Azure Migrate Discovery and assessment - Azure Migrate](https://learn.microsoft.com/azure/migrate/concepts-dependency-visualization)|Revamped the guidance for migrating from Log Analytics Agent to Azure Monitor Agent.|


### Alerts

| Article | Description |
|:---|:---|
|[Create Azure Monitor alert rules](alerts/alerts-create-new-alert-rule.md)|Added support for data processing in a specified region, for action groups and for metric alert rules that monitor a custom metric.|

### Application insights

| Article | Description |
|---|---|
|[Azure Application Insights Overview Dashboard](app/overview-dashboard.md)|Important information has been added clarifying that moving or renaming resources will break dashboards, with additional instructions on how to resolve this scenario.|
|[Azure Application Insights override default SDK endpoints](app/custom-endpoints.md)|We've clarified that endpoint modification isn't recommended and to use connection strings instead.|
|[Continuous export of telemetry from Application Insights](app/export-telemetry.md)|Important information has been added about avoiding duplicates when saving diagnostic logs in a Log Analytics workspace.|
|[Dependency Tracking in Azure Application Insights with OpenCensus Python](app/opencensus-python-dependency.md)|Updated Django sample application and documentation in the Azure Monitor OpenCensus Python samples repository.|
|[Incoming Request Tracking in Azure Application Insights with OpenCensus Python](app/opencensus-python-request.md)|Updated Django sample application and documentation in the Azure Monitor OpenCensus Python samples repository.|
|[Monitor Python applications with Azure Monitor](app/opencensus-python.md)|Updated Django sample application and documentation in the Azure Monitor OpenCensus Python samples repository.|
|[Configuration options - Azure Monitor Application Insights for Java](app/java-standalone-config.md)|Updated connection string overrides example.|
|[Application Insights SDK for ASP.NET Core applications](app/tutorial-asp-net-core.md)|A new tutorial with step-by-step instructions to use the Application Insights SDK with .NET Core applications.|
|[Application Insights SDK support guidance](app/sdk-support-guidance.md)|Our SDK support guidance has been updated and clarified.|
|[Azure Application Insights - Dependency Auto-Collection](app/auto-collect-dependencies.md)|The latest currently supported node.js modules have been updated.|
|[Application Insights custom metrics with .NET and .NET Core](app/tutorial-asp-net-custom-metrics.md)|A new tutorial with step-by-step instructions on how to enable custom metrics with .NET applications.|
|[Migrate an Application Insights classic resource to a workspace-based resource](app/convert-classic-resource.md)|A comprehensive FAQ section has been added to assist with migration to workspace-based resources.|
|[Configuration options - Azure Monitor Application Insights for Java](app/java-standalone-config.md)|This article has been fully updated for 3.4.0-BETA.|

### Autoscale

| Article | Description |
|---|---|
|[Autoscale in Microsoft Azure](autoscale/autoscale-overview.md)|Updated conceptual diagrams|
|[Use predictive autoscale to scale out before load demands in virtual machine scale sets (preview)](autoscale/autoscale-predictive.md)|Predictive autoscale (preview) is now available in all regions|

### Change analysis

| Article | Description |
|---|---|
|[Enable Change Analysis](change/change-analysis-enable.md)| Added note for slot-level enablement|
|[Tutorial - Track a web app outage using Change Analysis](change/tutorial-outages.md)| Added set up steps to tutorial|
|[Use Change Analysis in Azure Monitor to find web-app issues](change/change-analysis.md)|Updated limitations|
|[Observability data in Azure Monitor](observability-data.md)| Added "Changes" section|
### Containers

| Article | Description |
|---|---|
|[Monitor an Azure Kubernetes Service (AKS) cluster deployed](containers/container-insights-enable-existing-clusters.md)|Added section on using private link with Container insights.|

### Essentials

| Article | Description |
|---|---|
|[Azure activity log](essentials/activity-log.md)|Added instructions for how to stop collecting activity logs using the legacy collection method.|
|[Azure activity log insights](essentials/activity-log-insights.md)|Created a separate Activity Log Insights article in the Insights section.|

### Logs

| Article | Description |
|---|---|
|[Configure data retention and archive in Azure Monitor Logs (Preview)](logs/data-retention-archive.md)|Clarified how data retention and archiving work in Azure Monitor Logs to address repeated customer inquiries.|


## July  2022
### General

| Article | Description |
|:---|:---|
|[Sources of data in Azure Monitor](data-sources.md)|Updated with Azure Monitor agent and Logs ingestion API.|

### Agents

| Article | Description |
|:---|:---|
|[Azure Monitor Agent overview](agents/agents-overview.md)| Restructure of the Agents section. A single Azure Monitor Agent is replacing all of Azure Monitor's legacy monitoring agents.
|[Enable network isolation for the Azure Monitor agent](agents/azure-monitor-agent-data-collection-endpoint.md)|Rewritten to better describe configuration of network isolation.

### Alerts

| Article | Description |
|:---|:---|
|[Azure Monitor Alerts Overview](alerts/alerts-overview.md)|Updated the logic for the time to resolve behavior in stateful log alerts.

### Application Insights

| Article | Description |
|:---|:---|
|[Azure Monitor Application Insights Java](app/java-in-process-agent.md)|OpenTelemetry-based auto-instrumentation for Java applications has an updated Supported Custom Telemetry table.
|[Application Insights API for custom events and metrics](app/api-custom-events-metrics.md)|Clarification has been added that valueCount and itemCount have a minimum value of 1.
|[Telemetry sampling in Azure Application Insights](app/sampling.md)|Sampling documentation has been updated to warn of the potential impact on alerting accuracy.
|[Azure Monitor Application Insights Java (redirect to OpenTelemetry)](app/java-in-process-agent-redirect.md)|Java Auto-Instrumentation now redirects to OpenTelemetry documentation.
|[Azure Application Insights for ASP.NET Core applications](app/asp-net-core.md)|Updated .NET Core FAQ
|[Create a new Azure Monitor Application Insights workspace-based resource](app/create-workspace-resource.md)|We've linked out to Microsoft.Insights components for more information on Properties.
|[Application Insights SDK support guidance](app/sdk-support-guidance.md)|SDK support guidance has been updated and clarified.
|[Azure Monitor Application Insights Java](app/java-in-process-agent.md)|Example code has been updated.
|[IP addresses used by Azure Monitor](app/ip-addresses.md)|The IP/FQDN table has been updated.
|[Continuous export of telemetry from Application Insights](app/export-telemetry.md)|The continuous export notice has been updated and clarified.
|[Set up availability alerts with Application Insights](app/availability-alerts.md)|Custom Alert Rule and Alert Frequency sections have been added.

### Autoscale

| Article | Description |
|:---|:---|
| [How-to guide for setting up autoscale for a web app with a custom metric](autoscale/autoscale-custom-metric.md) |General rewrite to improve clarity.|
[Overview of autoscale in Microsoft Azure](autoscale/autoscale-overview.md)|General rewrite to improve clarity.|

### Containers

| Article | Description |
|:---|:---|
|[Overview of Container insights](containers/container-insights-overview.md)|Added information about deprecation of Docker support.|
|[Enable Container insights](containers/container-insights-onboard.md)|All Container insights content updated for new support of managed identity authentication using Azure Monitor agent.|

### Essentials

| Article | Description |
|:---|:---|
|[Tutorial - Editing Data Collection Rules](essentials/data-collection-rule-edit.md)|New article.|
|[Data Collection Rules in Azure Monitor](essentials/data-collection-rule-overview.md)|General rewrite to improve clarity.|
|[Data collection transformations](essentials/data-collection-transformations.md)|General rewrite to improve clarity.|
|[Data collection in Azure Monitor](essentials/data-collection.md)|New article.|
|[How to Migrate from Diagnostic Settings Storage Retention to Azure Storage Lifecycle Policy](essentials/migrate-to-azure-storage-lifecycle-policy.md)|New article.|

### Logs

| Article | Description |
|:---|:---|
|[Logs ingestion API in Azure Monitor (Preview)](logs/logs-ingestion-api-overview.md)|Custom logs API renamed to Logs ingestion API.
|[Tutorial - Send data to Azure Monitor Logs using REST API (Resource Manager templates)](logs/tutorial-logs-ingestion-api.md)|Custom logs API renamed to Logs ingestion API.
|[Tutorial - Send data to Azure Monitor Logs using REST API (Azure portal)](logs/tutorial-logs-ingestion-portal.md)|Custom logs API renamed to Logs ingestion API.

### Virtual Machines

| Article | Description |
|:---|:---|
|[What is VM insights?](vm/vminsights-overview.md)|All VM insights content updated for new support of Azure Monitor agent.


## June  2022

### General

| Article | Description |
|:---|:---|
| [Tutorial - Editing Data Collection Rules](essentials/data-collection-rule-edit.md) | New article|


### Application Insights

| Article | Description |
|:---|:---|
| [Application Insights logging with .NET](app/ilogger.md) | Connection string sample code has been added.|
| [Application Insights SDK support guidance](app/sdk-support-guidance.md) | Updated SDK supportability guidance. |
| [Azure AD authentication for Application Insights](app/azure-ad-authentication.md) | Azure AD authenticated telemetry ingestion has been reached general availability.|
| [Azure Application Insights for JavaScript web apps](app/javascript.md) | Our Java on-premises page has been retired and redirected to [Azure Monitor OpenTelemetry-based auto-instrumentation for Java applications](app/java-in-process-agent.md).|
| [Azure Application Insights Telemetry Data Model - Telemetry Context](app/data-model-context.md) | Clarified that Anonymous User ID is simply User.Id for easy selection in Intellisense.|
| [Continuous export of telemetry from Application Insights](app/export-telemetry.md) | On February 29, 2024, continuous export will be deprecated as part of the classic Application Insights deprecation.|
| [Dependency Tracking in Azure Application Insights](app/asp-net-dependencies.md) | The EventHub Client SDK and ServiceBus Client SDK information has been updated.|
| [Monitor Azure app services performance .NET Core](app/azure-web-apps-net-core.md) | Updated Linux troubleshooting guidance. |
| [Performance counters in Application Insights](app/performance-counters.md) | A prerequisite section has been added to ensure performance counter data is accessible.|

### Agents

| Article | Description |
|:---|:---|
| [Collect text and IIS logs with Azure Monitor agent (preview)](agents/data-collection-text-log.md) | Added troubleshooting section.|
| [Tools for migrating to Azure Monitor Agent from legacy agents](agents/azure-monitor-agent-migration-tools.md) | New article that explains how to install and use tools for migrating from legacy agents to the new Azure Monitor agent (AMA).|

### Visualizations
Azure Monitor Workbooks documentation previously resided on an external GitHub repository. We've migrated all Azure Workbooks content to the same repo as all other Azure Monitor content. 



## May  2022

### General

| Article | Description |
|:---|:---|
| [Azure Monitor cost and usage](usage-estimated-costs.md) | Added standard web tests to table<br>Added explanation of billable GB calculation |
| [Azure Monitor overview](overview.md) | Updated overview diagram |

### Agents

| Article | Description |
|:---|:---|
| [Azure Monitor agent extension versions](agents/azure-monitor-agent-extension-versions.md) | Update to latest extension version |
| [Azure Monitor agent overview](agents/azure-monitor-agent-overview.md) | Added supported resource types |
| [Collect text and IIS logs with Azure Monitor agent (preview)](agents/data-collection-text-log.md) | Corrected error in data collection rule |
| [Overview of the Azure monitoring agents](agents/agents-overview.md) | Added new OS supported for agent |
| [Resource Manager template samples for agents](agents/resource-manager-agent.md) | Added Bicep examples |
| [Resource Manager template samples for data collection rules](agents/resource-manager-data-collection-rules.md) | Fixed bug in sample parameter file |
| [Rsyslog data not uploaded due to Full Disk space issue on AMA Linux Agent](agents/azure-monitor-agent-troubleshoot-linux-vm-rsyslog.md) | New article |
| [Troubleshoot the Azure Monitor agent on Linux virtual machines and scale sets](agents/azure-monitor-agent-troubleshoot-linux-vm.md) | New article |
| [Troubleshoot the Azure Monitor agent on Windows Arc-enabled server](agents/azure-monitor-agent-troubleshoot-windows-arc.md) | New article |
| [Troubleshoot the Azure Monitor agent on Windows virtual machines and scale sets](agents/azure-monitor-agent-troubleshoot-windows-vm.md) | New article |

### Alerts

| Article | Description |
|:---|:---|
| [IT Service Management Connector | Secure Webhook in Azure Monitor | Azure Configurations](alerts/itsm-connector-secure-webhook-connections-azure-configuration.md) | Added the workflow for ITSM management and removed all references to SCSM. |
| [Overview of Azure Monitor Alerts](alerts/alerts-overview.md) | Complete rewrite |
| [Resource Manager template samples for log query alerts](alerts/resource-manager-alerts-log.md) | Bicep samples for alerting have been added to the Resource Manager template samples articles. |
| [Supported resources for metric alerts in Azure Monitor](alerts/alerts-metric-near-real-time.md) | Added a newly supported resource type. |

### Application Insights

| Article | Description |
|:---|:---|
| [Application Map in Azure Application Insights](app/app-map.md) | Application Maps Intelligent View feature |
| [Azure Application Insights for ASP.NET Core applications](app/asp-net-core.md) | telemetry.Flush() guidance is now available. |
| [Diagnose with Live Metrics Stream](app/live-stream.md) | Updated information on using unsecure control channel. |
| [Migrate an Azure Monitor Application Insights classic resource to a workspace-based resource](app/convert-classic-resource.md) | Schema change documentation is now available here. |
| [Profile production apps in Azure with Application Insights Profiler](profiler/profiler-overview.md) | Profiler documentation now has a new home in the table of contents. |

All references to unsupported versions of .NET and .NET CORE have been scrubbed from Application Insights product documentation. See [.NET and >NET Core Support Policy](https://dotnet.microsoft.com/platform/support/policy/dotnet-core) 
### Change Analysis

| Article | Description |
|:---|:---|
| [Navigate to a change using custom filters in Change Analysis](change/change-analysis-custom-filters.md) | New article |
| [Pin and share a Change Analysis query to the Azure dashboard](change/change-analysis-query.md) | New article |
| [Use Change Analysis in Azure Monitor to find web-app issues](change/change-analysis.md) | Added details  enabling for web app in-guest changes |
### Containers

| Article | Description |
|:---|:---|
| [Configure ContainerLogv2 schema (preview) for Container Insights](containers/container-insights-logging-v2.md) | New article describing new schema for container logs |
| [Enable Container insights](containers/container-insights-onboard.md) | General rewrite to improve clarity |
| [Resource Manager template samples for Container insights](containers/resource-manager-container-insights.md) | Added Bicep examples |
### Insights

| Article | Description |
|:---|:---|
| [Troubleshoot SQL Insights (preview)](/azure/azure-sql/database/sql-insights-troubleshoot) | Added known issue for OS computer name. |
### Logs

| Article | Description |
|:---|:---|
| [Azure Monitor customer-managed key](logs/customer-managed-keys.md) | Update limitations and constraint. |
| [Design a Log Analytics workspace architecture](logs/workspace-design.md) | Complete rewrite to better describe decision criteria and include Sentinel considerations |
| [Manage access to Log Analytics workspaces](logs/manage-access.md) | Consolidated and rewrote all content on configuring workspace access |
| [Restore logs in Azure Monitor (Preview)](logs/restore.md) | Documented new Log Analytics table management configuration UI, which lets you configure a table's log plan and archive and retention policies. |

### Virtual Machines

| Article | Description |
|:---|:---|
| [Migrate from VM insights guest health (preview) to Azure Monitor log alerts](vm/vminsights-health-migrate.md) | New article describing process to replace VM guest health with alert rules |
| [VM insights guest health (preview)](vm/vminsights-health-overview.md) | Added deprecation statement |