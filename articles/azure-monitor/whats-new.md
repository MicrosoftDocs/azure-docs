---
title: "What's new in Azure Monitor documentation"
description: "What's new in Azure Monitor documentation"
ms.topic: conceptual
ms.date: 04/04/2022
---

# What's new in Azure Monitor documentation

This article lists significant changes to Azure Monitor documentation.

## March, 2022
### Agents

**Updated articles**

- [Azure Monitor agent overview](agents/azure-monitor-agent-overview.md)
- [Migrate to Azure Monitor agent from Log Analytics agent](agents/azure-monitor-agent-migration.md)

### Alerts

**Updated articles**

- [Create a classic metric alert rule with a Resource Manager template](alerts/alerts-enable-template.md)
- [Overview of alerts in Microsoft Azure](alerts/alerts-overview.md)
- [Alert processing rules](alerts/alerts-action-rules.md)

### Application Insights

**Updated articles**

- [Application Insights API for custom events and metrics](app/api-custom-events-metrics.md)
- [Application Insights for ASP.NET Core applications](app/asp-net-core.md)
- [Application Insights for web pages](app/javascript.md)
- [Application Map: Triage Distributed Applications](app/app-map.md)
- [Configure Application Insights for your ASP.NET website](app/asp-net.md)
- [Export telemetry from Application Insights](app/export-telemetry.md)
- [Migrate to workspace-based Application Insights resources](app/convert-classic-resource.md)
- [React plugin for Application Insights JavaScript SDK](app/javascript-react-plugin.md)
- [Sampling in Application Insights](app/sampling.md)
- [Telemetry processors (preview) - Azure Monitor Application Insights for Java](app/java-standalone-telemetry-processors.md)
- [Tips for updating your JVM args - Azure Monitor Application Insights for Java](app/java-standalone-arguments.md)
- [Unified cross-component transaction diagnostics](app/transaction-diagnostics.md)
- [Visualizations for Application Change Analysis (preview)](app/change-analysis-visualizations.md)

### Containers

**Updated articles**

- [How to create log alerts from Container insights](containers/container-insights-log-alerts.md)

### Essentials

**New articles**

- [Activity logs insights (Preview)](essentials/activity-log.md)

**Updated articles**

- [Create diagnostic settings to send Azure Monitor platform logs and metrics to different destinations](essentials/diagnostic-settings.md)
- [Azure Monitoring REST API walkthrough](essentials/rest-api-walkthrough.md)


### Logs

**New articles**

- [Migrate from Data Collector API and custom fields-enabled tables to DCR-based custom logs](logs/custom-logs-migrate.md)

**Updated articles**

- [Archive data from Log Analytics workspace to Azure storage using Logic App](logs/logs-export-logic-app.md)
- [Azure Monitor Logs Dedicated Clusters](logs/logs-dedicated-clusters.md)
- [Configure Basic Logs in Azure Monitor (Preview)](logs/basic-logs-configure.md)
- [Configure data retention and archive policies in Azure Monitor Logs (Preview)](logs/data-retention-archive.md)
- [Log Analytics Workspace Insights](logs/log-analytics-workspace-insights-overview.md)
- [Move a Log Analytics workspace to different subscription or resource group](logs/move-workspace.md)
- [Query Basic Logs in Azure Monitor (Preview)](logs/basic-logs-query.md)
- [Restore logs in Azure Monitor (preview)](logs/restore.md)
- [Search jobs in Azure Monitor (preview)](logs/search-jobs.md)

### Virtual Machines

**Updated articles**

- [Monitor virtual machines with Azure Monitor: Alerts](vm/monitor-virtual-machine-alerts.md)


## February, 2022

### General

**Updated articles**

- [What is monitored by Azure Monitor?](monitor-reference.md)
### Agents

**New articles**

- [Sample data collection rule - agent](agents/data-collection-rule-sample-agent.md)
- [Using data collection endpoints with Azure Monitor agent (preview)](agents/azure-monitor-agent-data-collection-endpoint.md)

**Updated articles**

- [Azure Monitor agent overview](./agents/azure-monitor-agent-overview.md)
- [Manage the Azure Monitor agent](./agents/azure-monitor-agent-manage.md)

### Alerts

**Updated articles**

- [How to trigger complex actions with Azure Monitor alerts](./alerts/action-groups-logic-app.md)

### Application Insights

**New articles**

- [Migrate from Application Insights instrumentation keys to connection strings](app/migrate-from-instrumentation-keys-to-connection-strings.md)


**Updated articles**

- [Application Monitoring for Azure App Service and Java](./app/azure-web-apps-java.md)
- [Application Monitoring for Azure App Service and Node.js](./app/azure-web-apps-nodejs.md)
- [Enable Snapshot Debugger for .NET apps in Azure App Service](./app/snapshot-debugger-appservice.md)
- [Profile live Azure App Service apps with Application Insights](./app/profiler.md)
- [Visualizations for Application Change Analysis (preview)](/azure/azure-monitor/app/change-analysis-visualizations)

### Autoscale

**New articles**

- [Use predictive autoscale to scale out before load demands in virtual machine scale sets (Preview)](autoscale/autoscale-predictive.md)

### Data collection

**New articles**

- [Data collection endpoints in Azure Monitor (preview)](essentials/data-collection-endpoint-overview.md)
- [Data collection rules in Azure Monitor](essentials/data-collection-rule-overview.md)
- [Data collection rule transformations](essentials/data-collection-rule-transformations.md)
- [Structure of a data collection rule in Azure Monitor (preview)](essentials/data-collection-rule-structure.md)
### Essentials

**Updated articles**

- [Azure Activity log](./essentials/activity-log.md)

### Logs

**Updated articles**

- [Azure Monitor Logs overview](logs/data-platform-logs.md)

**New articles**

- [Configure Basic Logs in Azure Monitor (Preview)](logs/basic-logs-configure.md)
- [Configure data retention and archive in Azure Monitor Logs (Preview)](logs/data-retention-archive.md)
- [Log Analytics workspace overview](logs/log-analytics-workspace-overview.md)
- [Overview of ingestion-time transformations in Azure Monitor Logs](logs/ingestion-time-transformations.md)
- [Query data from Basic Logs in Azure Monitor (Preview)](logs/basic-logs-query.md)
- [Restore logs in Azure Monitor (Preview)](logs/restore.md)
- [Sample data collection rule - custom logs](logs/data-collection-rule-sample-custom-logs.md)
- [Search jobs in Azure Monitor (Preview)](logs/search-jobs.md)
- [Send custom logs to Azure Monitor Logs with REST API](logs/custom-logs-overview.md)
- [Tables that support ingestion-time transformations in Azure Monitor Logs (preview)](logs/tables-feature-support.md)
- [Tutorial - Send custom logs to Azure Monitor Logs (preview)](logs/tutorial-custom-logs.md)
- [Tutorial - Send custom logs to Azure Monitor Logs using resource manager templates](logs/tutorial-custom-logs-api.md)
- [Tutorial - Add ingestion-time transformation to Azure Monitor Logs using Azure portal](logs/tutorial-ingestion-time-transformations.md)
- [Tutorial - Add ingestion-time transformation to Azure Monitor Logs using resource manager templates](logs/tutorial-ingestion-time-transformations-api.md)


## January, 2022

### Agents

**Updated articles**

- [Manage the Azure Monitor agent](agents/azure-monitor-agent-manage.md)

### Alerts

**New articles**

- [Non-common alert schema definitions for Test Action Group (Preview)](alerts/alerts-non-common-schema-definitions.md)

**Updated articles**

- [Create and manage action groups in the Azure portal](alerts/action-groups.md)
- [Upgrade legacy rules management to the current Log Alerts API from legacy Log Analytics Alert API](alerts/alerts-log-api-switch.md)
- [Log alerts in Azure Monitor](alerts/alerts-unified-log.md)

### Application Insights

**Updated articles**

- [Usage analysis with Application Insights](app/usage-overview.md)
- [Tips for updating your JVM args - Azure Monitor Application Insights for Java](app/java-standalone-arguments.md)
- [Configuration options - Azure Monitor Application Insights for Java](app/java-standalone-config.md)
- [Troubleshooting SDK load failure for JavaScript web apps](app/javascript-sdk-load-failure.md)

### Logs

**Updated articles**

- [Azure Monitor customer-managed key](logs/customer-managed-keys.md)
- [Log Analytics workspace data export in Azure Monitor (preview)](logs/logs-data-export.md)

## December, 2021

### General

**Updated articles**

- [What is monitored by Azure Monitor?](monitor-reference.md)

### Agents

**New articles**

- [Sample data collection rule - agent](agents/data-collection-rule-sample-agent.md)


**Updated articles**

- [Install Log Analytics agent on Windows computers](agents/agent-windows.md)
- [Log Analytics agent overview](agents/log-analytics-agent.md)

### Alerts

**New articles**

- [Manage alert rules created in previous versions](alerts/alerts-manage-alerts-previous-version.md)

**Updated articles**

- [Create an action group with a Resource Manager template](alerts/action-groups-create-resource-manager-template.md)
- [Troubleshoot log alerts in Azure Monitor](alerts/alerts-troubleshoot-log.md)
- [Troubleshooting problems in Azure Monitor alerts](alerts/alerts-troubleshoot.md)
- [Create, view, and manage log alerts using Azure Monitor](alerts/alerts-log.md)
- [Create, view, and manage activity log alerts by using Azure Monitor](alerts/alerts-activity-log.md)
- [Create, view, and manage metric alerts using Azure Monitor](alerts/alerts-metric.md)

### Application Insights

**New articles**

- [Analyzing product usage with HEART](app/usage-heart.md)
- [Migrate from Application Insights instrumentation keys to connection strings](app/migrate-from-instrumentation-keys-to-connection-strings.md)


**Updated articles**

- [Tips for updating your JVM args - Azure Monitor Application Insights for Java](app/java-standalone-arguments.md)
- [Troubleshooting guide: Azure Monitor Application Insights for Java](app/java-standalone-troubleshoot.md)
- [Set up Azure Monitor for your Python application](app/opencensus-python.md)
- [Click Analytics Auto-collection plugin for Application Insights JavaScript SDK](app/javascript-click-analytics-plugin.md)


### Logs

**New articles**

- [Access the Azure Monitor Log Analytics API](logs/api/access-api.md)
- [Set Up Authentication and Authorization for the Azure Monitor Log Analytics API](logs/api/authentication-authorization.md)
- [Querying logs for Azure resources](logs/api/azure-resource-queries.md)
- [Batch queries](logs/api/batch-queries.md)
- [Caching](logs/api/cache.md)
- [Cross workspace queries](logs/api/cross-workspace-queries.md)
- [Azure Monitor Log Analytics API Errors](logs/api/errors.md)
- [Azure Monitor Log Analytics API Overview](logs/api/overview.md)
- [Prefer options](logs/api/prefer-options.md)
- [Azure Monitor Log Analytics API request format](logs/api/request-format.md)
- [Azure Monitor Log Analytics API response format](logs/api/response-format.md)
- [Timeouts](logs/api/timeouts.md)

**Updated articles**

- [Log Analytics workspace data export in Azure Monitor (preview)](logs/logs-data-export.md)
- [Resource Manager template samples for Log Analytics workspaces in Azure Monitor](logs/resource-manager-workspace.md)

### Virtual Machines

**Updated articles**

- [Enable VM insights overview](vm/vminsights-enable-overview.md)



## November, 2021

### General

**Updated articles**

- [What is monitored by Azure Monitor?](monitor-reference.md)

### Agents

**Updated articles**

- [Azure Monitor agent overview](agents/azure-monitor-agent-overview.md)

### Alerts

**Updated articles**

- [Troubleshooting problems in Azure Monitor alerts](alerts/alerts-troubleshoot.md)
- [How to update alert rules or alert processing rules when their target resource moves to a different Azure region](alerts/alerts-resource-move.md)
- [Alert processing rules (preview)](alerts/alerts-action-rules.md)

### Application Insights

**Updated articles**

- [Troubleshooting no data - Application Insights for .NET/.NET Core](app/asp-net-troubleshoot-no-data.md)
- [Azure Monitor OpenTelemetry-based auto-instrumentation for Java applications](app/java-in-process-agent.md)
- [Enable Azure Monitor OpenTelemetry Exporter for .NET, Node.js, and Python applications (preview)](app/opentelemetry-enable.md)
- [Release notes for Azure Web App extension for Application Insights](app/web-app-extension-release-notes.md)
- [Tips for updating your JVM args - Azure Monitor Application Insights for Java](app/java-standalone-arguments.md)
- [Configuration options - Azure Monitor Application Insights for Java](app/java-standalone-config.md)
- [Supported languages](app/platforms.md)
- [What is Distributed Tracing?](app/distributed-tracing.md)

### Containers

**New articles**

- [Transition to using Container Insights on Azure Arc-enabled Kubernetes](containers/container-insights-transition-hybrid.md)

**Updated articles**

- [Azure Monitor Container Insights for Azure Arc-enabled Kubernetes clusters](containers/container-insights-enable-arc-enabled-clusters.md)

### Essentials

**Updated articles**

- [Create diagnostic settings to send Azure Monitor platform logs and metrics to different destinations](essentials/diagnostic-settings.md)

### Insights

**New articles**

- [Azure Monitor - Service Bus insights](../service-bus-messaging/service-bus-insights.md)

**Updated articles**

- [Enable SQL Insights (preview)](insights/sql-insights-enable.md)
- [Troubleshoot SQL Insights (preview)](insights/sql-insights-troubleshoot.md)

### Logs

**Updated articles**

- [Configure your Private Link](logs/private-link-configure.md)
- [Design your Private Link setup](logs/private-link-design.md)
- [Use Azure Private Link to connect networks to Azure Monitor](logs/private-link-security.md)
- [Log Analytics workspace data export in Azure Monitor (preview)](logs/logs-data-export.md)
- [Query data in Azure Monitor using Azure Data Explorer](logs/azure-data-explorer-monitor-proxy.md)
- [Log data ingestion time in Azure Monitor](logs/data-ingestion-time.md)

### Virtual Machines

**Updated articles**

- [VM insights guest health alerts (preview)](vm/vminsights-health-alerts.md)


## October, 2021
### General

**New articles**

- [Deploying Azure Monitor - Alerts and automated actions](best-practices-alerts.md)
- [Azure Monitor best practices - Analyze and visualize data](best-practices-analysis.md)
- [Azure Monitor best practices - Configure data collection](best-practices-data-collection.md)
- [Azure Monitor best practices - Planning your monitoring strategy and configuration](best-practices-plan.md)
- [Azure Monitor best practices](best-practices.md)

**Updated articles**

- [What is monitored by Azure Monitor?](monitor-reference.md)
- [Visualize data from Azure Monitor](visualizations.md)
### Agents

**Updated articles**

- [How to troubleshoot issues with the Log Analytics agent for Linux](agents/agent-linux-troubleshoot.md)
- [Overview of Azure Monitor agents](agents/agents-overview.md)
- [Install the Azure Monitor agent](agents/azure-monitor-agent-manage.md)

### Alerts

**Updated articles**

- [Create, view, and manage activity log alerts by using Azure Monitor](alerts/alerts-activity-log.md)
- [Create a log alert with a Resource Manager template](alerts/alerts-log-create-templates.md)
- [Webhook actions for log alert rules](alerts/alerts-log-webhook.md)
- [Resource Manager template samples for log alert rules in Azure Monitor](alerts/resource-manager-alerts-log.md)

### Application Insights

**New articles**

- [Statsbeat in Azure Application Insights](app/statsbeat.md)
- [Enable Azure Monitor OpenTelemetry Exporter for .NET, Node.js, and Python applications (Preview)](app/opentelemetry-enable.md)
- [OpenTelemetry overview](app/opentelemetry-overview.md)

**Updated articles**

- [Deploy Azure Monitor Application Insights Agent for on-premises servers](app/status-monitor-v2-overview.md)
- [Tips for updating your JVM args - Azure Monitor Application Insights for Java](app/java-standalone-arguments.md)
- [Set up Azure Monitor for your Python application](app/opencensus-python.md)
- [Java codeless application monitoring with Azure Monitor Application Insights](app/java-in-process-agent.md)
- [Configuration options - Azure Monitor Application Insights for Java](app/java-standalone-config.md)

### Containers

**Updated articles**

- [Troubleshooting Container insights](containers/container-insights-troubleshoot.md)
- [Recommended metric alerts (preview) from Container insights](containers/container-insights-metric-alerts.md)

### Essentials

**Updated articles**

- [Supported metrics with Azure Monitor](essentials/metrics-supported.md)
- [Supported categories for Azure Monitor resource logs](essentials/resource-logs-categories.md)
- [Azure Monitor Metrics overview](essentials/data-platform-metrics.md)
- [Custom metrics in Azure Monitor (preview)](essentials/metrics-custom-overview.md)
- [Common and service-specific schemas for Azure resource logs](essentials/resource-logs-schema.md)
- [Create diagnostic settings to send platform logs and metrics to different destinations](essentials/diagnostic-settings.md)

### Logs

**Updated articles**

- [Log Analytics workspace data export in Azure Monitor (preview)](logs/logs-data-export.md)
- [Azure Monitor customer-managed key](logs/customer-managed-keys.md)
- [Azure Monitor Logs Dedicated Clusters](logs/logs-dedicated-clusters.md)

### Virtual Machines

**Updated articles**

- [Enable VM insights by using Azure Policy](vm/vminsights-enable-policy.md)

## Visualizations

**Updated articles**

- [Monitor your Azure services in Grafana](visualize/grafana-plugin.md)
## September, 2021
### General

**Updated articles**

- [Deploy Azure Monitor at scale by using Azure Policy](./best-practices.md)
- [Azure Monitor partner integrations](partners.md)
- [Resource Manager template samples for Azure Monitor](resource-manager-samples.md)
- [Roles, permissions, and security in Azure Monitor](roles-permissions-security.md)
- [Monitor usage and estimated costs in Azure Monitor](usage-estimated-costs.md)

### Agents

**Updated articles**

- [Azure Monitor agent overview](agents/azure-monitor-agent-overview.md)

### Application Insights

**New articles**

- [Application Monitoring for Azure App Service and ASP.NET](app/azure-web-apps-net.md)
- [Application Monitoring for Azure App Service and Java](app/azure-web-apps-java.md)
- [Application Monitoring for Azure App Service and ASP.NET Core](app/azure-web-apps-net-core.md)
- [Application Monitoring for Azure App Service and Node.js](app/azure-web-apps-nodejs.md)

**Updated articles**

- [Application Monitoring for Azure App Service and ASP.NET](app/azure-web-apps-net.md)
- [Filter and preprocess telemetry in the Application Insights SDK](app/api-filtering-sampling.md)
- [Release notes for Microsoft.ApplicationInsights.SnapshotCollector](app/snapshot-collector-release-notes.md)
- [What is auto-instrumentation for Azure Monitor application insights?](app/codeless-overview.md)
- [Application Monitoring for Azure App Service Overview](app/azure-web-apps.md)

### Containers

**Updated articles**

- [Enable Container insights](containers/container-insights-onboard.md)

### Essentials

**Updated articles**

- [Supported metrics with Azure Monitor](essentials/metrics-supported.md)
- [Supported categories for Azure Resource Logs](essentials/resource-logs-categories.md)
- [Azure Activity log](essentials/activity-log.md)
- [Azure Monitoring REST API walkthrough](essentials/rest-api-walkthrough.md)


### Insights

**New articles**

- [Manage Application Insights components by using Azure CLI](insights/azure-cli-application-insights-component.md)

**Updated articles**

- [Azure Data Explorer Insights](insights/data-explorer.md)
- [Agent Health solution in Azure Monitor](insights/solution-agenthealth.md)
- [Monitoring solutions in Azure Monitor](insights/solutions.md)
- [Monitor your SQL deployments with SQL Insights (preview)](insights/sql-insights-overview.md)
- [Troubleshoot SQL Insights (preview)](insights/sql-insights-troubleshoot.md)

### Logs

**New articles**

- [Resource Manager template samples for Log Analytics clusters in Azure Monitor](logs/resource-manager-cluster.md)

**Updated articles**

- [Configure your Private Link](logs/private-link-configure.md)
- [Azure Monitor customer-managed key](logs/customer-managed-keys.md)
- [Azure Monitor Logs Dedicated Clusters](logs/logs-dedicated-clusters.md)
- [Log Analytics workspace data export in Azure Monitor (preview)](logs/logs-data-export.md)
- [Move a Log Analytics workspace to another region by using the Azure portal](logs/move-workspace-region.md)

## August, 2021

### Agents

**Updated articles**

- [Migrate from Log Analytics agents](agents/azure-monitor-agent-migration.md)
- [Azure Monitor agent overview](agents/azure-monitor-agent-overview.md)

### Alerts

**Updated articles**

- [Troubleshooting problems in Azure Monitor metric alerts](alerts/alerts-troubleshoot-metric.md)
- [Create metric alert monitors in Azure CLI](azure-cli-metrics-alert-sample.md)
- [Create, view, and manage activity log alerts by using Azure Monitor](alerts/alerts-activity-log.md)


### Application Insights

**Updated articles**

- [Monitoring Azure Functions with Azure Monitor Application Insights](app/monitor-functions.md)
- [Application Monitoring for Azure App Service](app/azure-web-apps.md)
- [Configure Application Insights for your ASP.NET website](app/asp-net.md)
- [Application Insights availability tests](app/availability-overview.md)
- [Application Insights logging with .NET](app/ilogger.md)
- [Geolocation and IP address handling](app/ip-collection.md)
- [Monitor availability with URL ping tests](app/monitor-web-app-availability.md)

### Essentials

**Updated articles**

- [Supported metrics with Azure Monitor](essentials/metrics-supported.md)
- [Supported categories for Azure Resource Logs](essentials/resource-logs-categories.md)
- [Collect custom metrics for a Linux VM with the InfluxData Telegraf agent](essentials/collect-custom-metrics-linux-telegraf.md)

### Insights

**Updated articles**

- [Azure Monitor Network Insights](insights/network-insights-overview.md)

### Logs

**New articles**

- [Azure AD authentication for Logs](logs/azure-ad-authentication-logs.md)
- [Move Log Analytics workspace to another region using the Azure portal](logs/move-workspace-region.md)
- [Availability zones in Azure Monitor](logs/availability-zones.md)
- [Managing Azure Monitor Logs in Azure CLI](logs/azure-cli-log-analytics-workspace-sample.md)

**Updated articles**

- [Design your Private Link setup](logs/private-link-design.md)
- [Azure Monitor Logs Dedicated Clusters](logs/logs-dedicated-clusters.md)
- [Move Log Analytics workspace to another region using the Azure portal](logs/move-workspace-region.md)
- [Configure your Private Link](logs/private-link-configure.md)
- [Use Azure Private Link to connect networks to Azure Monitor](logs/private-link-security.md)
- [Standard columns in Azure Monitor Logs](logs/log-standard-columns.md)
- [Azure Monitor customer-managed key](logs/customer-managed-keys.md)
- [[Azure Monitor Logs data security](logs/data-security.md)
- [Send log data to Azure Monitor by using the HTTP Data Collector API (preview)](logs/data-collector-api.md)
- [Get started with log queries in Azure Monitor](logs/get-started-queries.md)
- [Azure Monitor Logs overview](logs/data-platform-logs.md)
- [Log Analytics tutorial](logs/log-analytics-tutorial.md)

### Virtual Machines

**Updated articles**

- [Monitor virtual machines with Azure Monitor: Alerts](vm/monitor-virtual-machine-alerts.md)

## July, 2021

### General

**Updated articles**

- [Azure Monitor Frequently Asked Questions](faq.yml)
- [Deploy Azure Monitor at scale using Azure Policy](./best-practices.md)

### Agents

**New articles**

- [Migrating from Log Analytics agent](agents/azure-monitor-agent-migration.md)

**Updated articles**

- [Azure Monitor agent overview](agents/azure-monitor-agent-overview.md)

### Alerts

**Updated articles**

- [Common alert schema definitions](alerts/alerts-common-schema-definitions.md)
- [Create a log alert with a Resource Manager template](alerts/alerts-log-create-templates.md)
- [Resource Manager template samples for log alert rules in Azure Monitor](alerts/resource-manager-alerts-log.md)

### Application Insights

**New articles**

- [Standard test](app/availability-standard-tests.md)

**Updated articles**

- [Use Azure Application Insights to understand how customers are using your application](app/tutorial-users.md)
- [Application Insights cohorts](app/usage-cohorts.md)
- [Discover how customers are using your application with Application Insights Funnels](app/usage-funnels.md)
- [Impact analysis with Application Insights](app/usage-impact.md)
- [Usage analysis with Application Insights](app/usage-overview.md)
- [User retention analysis for web applications with Application Insights](app/usage-retention.md)
- [Users, sessions, and events analysis in Application Insights](app/usage-segmentation.md)
- [Troubleshooting Application Insights Agent (formerly named Status Monitor v2)](app/status-monitor-v2-troubleshoot.md)
- [Monitor availability with URL ping tests](app/monitor-web-app-availability.md)

### Containers

**New articles**

- [How to query logs from Container insights](containers/container-insights-log-query.md)
- [Monitoring Azure Kubernetes Service (AKS) with Azure Monitor](../aks/monitor-aks.md)

**Updated articles**

- [How to create log alerts from Container insights](containers/container-insights-log-alerts.md)

### Essentials

**Updated articles**

- [Supported metrics with Azure Monitor](essentials/metrics-supported.md)
- [Supported categories for Azure Resource Logs](essentials/resource-logs-categories.md)

### Insights

**Updated articles**

- [Monitor Surface Hubs with Azure Monitor to track their health](insights/surface-hubs.md)

### Logs

**Updated articles**

- [Azure Monitor Logs Dedicated Clusters](logs/logs-dedicated-clusters.md)
- [Log Analytics workspace data export in Azure Monitor (preview)](logs/logs-data-export.md)

### Virtual Machines

**Updated articles**

- [Monitor virtual machines with Azure Monitor: Configure monitoring](vm/monitor-virtual-machine-configure.md)
- [Monitor virtual machines with Azure Monitor: Security monitoring](vm/monitor-virtual-machine-security.md)
- [Monitor virtual machines with Azure Monitor: Workloads](vm/monitor-virtual-machine-workloads.md)
- [Monitor virtual machines with Azure Monitor](vm/monitor-virtual-machine.md)
- [Monitor virtual machines with Azure Monitor: Alerts](vm/monitor-virtual-machine-alerts.md)
- [Monitor virtual machines with Azure Monitor: Analyze monitoring data](vm/monitor-virtual-machine-analyze.md)

### Visualizations

**Updated articles**

- [Visualizing data from Azure Monitor](best-practices-analysis.md)
## June, 2021
### Agents

**Updated articles**

- [Azure Monitor agent overview](agents/azure-monitor-agent-overview.md)
- [Overview of Azure Monitor agents](agents/agents-overview.md)
- [Configure data collection for the Azure Monitor agent (preview)](agents/data-collection-rule-azure-monitor-agent.md)

### Alerts

**New articles**

- [Migrate Azure Monitor Application Insights smart detection to alerts (Preview)](alerts/alerts-smart-detections-migration.md)

**Updated articles**

- [Create Metric Alerts for Logs in Azure Monitor](alerts/alerts-metric-logs.md)
- [Troubleshoot log alerts in Azure Monitor](alerts/alerts-troubleshoot-log.md)

### Application Insights

**New articles**

- [Azure AD authentication for Application Insights (Preview)](app/azure-ad-authentication.md)
- [Quickstart: Monitor an ASP.NET Core app with Azure Monitor Application Insights](app/dotnet-quickstart.md)

**Updated articles**

- [Work Item Integration](app/work-item-integration.md)
- [Azure AD authentication for Application Insights (Preview)](app/azure-ad-authentication.md)
- [Release annotations for Application Insights](app/annotations.md)
- [Connection strings](app/sdk-connection-string.md)
- [Telemetry processors (preview) - Azure Monitor Application Insights for Java](app/java-standalone-telemetry-processors.md)
- [IP addresses used by Azure Monitor](app/ip-addresses.md)
- [Java codeless application monitoring Azure Monitor Application Insights](app/java-in-process-agent.md)
- [Adding the JVM arg - Azure Monitor Application Insights for Java](app/java-standalone-arguments.md)
- [Application Insights for ASP.NET Core applications](app/asp-net-core.md)
- [Telemetry processor examples - Azure Monitor Application Insights for Java](app/java-standalone-telemetry-processors-examples.md)
- [Application security detection pack (preview)](app/proactive-application-security-detection-pack.md)
- [Smart detection in Application Insights](app/proactive-diagnostics.md)
- [Abnormal rise in exception volume (preview)](app/proactive-exception-volume.md)
- [Smart detection - Performance Anomalies](app/proactive-performance-diagnostics.md)
- [Memory leak detection (preview)](app/proactive-potential-memory-leak.md)
- [Degradation in trace severity ratio (preview)](app/proactive-trace-severity.md)

### Containers

**Updated articles**

- [How to query logs from Container insights](containers/container-insights-log-query.md)

### Essentials

**Updated articles**

- [Supported categories for Azure Resource Logs](essentials/resource-logs-categories.md)
- [Resource Manager template samples for diagnostic settings in Azure Monitor](essentials/resource-manager-diagnostic-settings.md)


### Insights

**Updated articles**

- [Enable SQL Insights (preview)](insights/sql-insights-enable.md)

### Logs

**Updated articles**

- [Log Analytics tutorial](logs/log-analytics-tutorial.md)
- [Use Azure Private Link to securely connect networks to Azure Monitor](logs/private-link-security.md)
- [Azure Monitor Logs Dedicated Clusters](logs/logs-dedicated-clusters.md)
- [Monitor health of Log Analytics workspace in Azure Monitor](logs/monitor-workspace.md)

### Virtual Machines

**New articles**

- [Monitoring virtual machines with Azure Monitor - Alerts](vm/monitor-virtual-machine-alerts.md)
- [Monitoring virtual machines with Azure Monitor - Analyze monitoring data](vm/monitor-virtual-machine-analyze.md)
- [Monitor virtual machines with Azure Monitor - Configure monitoring](vm/monitor-virtual-machine-configure.md)
- [Monitor virtual machines with Azure Monitor - Security monitoring](vm/monitor-virtual-machine-security.md)
- [Monitoring virtual machines with Azure Monitor - Workloads](vm/monitor-virtual-machine-workloads.md)
- [Monitoring virtual machines with Azure Monitor](vm/monitor-virtual-machine.md)

**Updated articles**

- [Troubleshoot VM insights guest health (preview)](vm/vminsights-health-troubleshoot.md)
- [Create interactive reports VM insights with workbooks](vm/vminsights-workbooks.md)
