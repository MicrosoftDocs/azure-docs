---
title: "What's new in Azure Monitor documentation"
description: "What's new in Azure Monitor documentation"
ms.topic: conceptual
ms.date: 01/06/2023
ms.author: edbaynash
---

# What's new in Azure Monitor documentation

This article lists significant changes to Azure Monitor documentation. 

## February 2023  
  
|Subservice| Article | Description |
|---|---|---|
Agents|[Azure Monitor agent extension versions](agents/azure-monitor-agent-extension-versions.md)|Added release notes for the Azure Monitor Agent Linux 1.25 release.|
Agents|[Migrate to Azure Monitor Agent from Log Analytics agent](agents/azure-monitor-agent-migration.md)|Updated guidance for migrating from Log Analytics Agent to Azure Monitor Agent.|
Alerts|[Manage your alert rules](alerts/alerts-manage-alert-rules.md)|Included limitation and workaround for resource health alerts. If you apply a target resource type scope filter to the alerts rules page, the alerts rules list doesn’t include resource health alert rules.|
Alerts|[Customize alert notifications by using Logic Apps](alerts/alerts-logic-apps.md)|Added instructions for additional customizations that you can include when using Logic Apps to create alert notifications. You can extracting information about the affected resource from  resource's tags, and then include the resource tags in the alert payload and use the information in your logical expressions used for creating the notifications.|
Alerts|[Create and manage action groups in the Azure portal](alerts/action-groups-create-resource-manager-template.md)|Combined two articles about creating action groups into one article.|
Alerts|[Create and manage action groups in the Azure portal](alerts/action-groups.md)|Clarified that you can't pass security certificates in a webhook action in action groups.|
Alerts|[Create a new alert rule](alerts/alerts-create-new-alert-rule.md)|Add information about adding custom properties to the alert payload when you use action groups.|
Alerts|[Manage your alert instances](alerts/alerts-manage-alert-instances.md)|Removed option for managing alert instances using the CLI.|
Application-Insights|[Migrate to workspace-based Application Insights resources](app/convert-classic-resource.md)|The continuous export deprecation notice has been added to this article for more visibility. It's recommended to migrate to workspace-based Application Insights resources as soon as possible to take advantage of new features.|
Application-Insights|[Application Insights API for custom events and metrics](app/api-custom-events-metrics.md)|Client-side JavaScript SDK extensions have been consolidated into two new articles called "Framework extensions" and "Feature Extensions". We've additionally created new stand-alone Upgrade and Troubleshooting articles.|
Application-Insights|[Create an Application Insights resource](app/create-new-resource.md)|Classic workspace documentation has been moved to the Legacy and Retired Features section of our table of contents and we've made both the feature retirement and upgrade path clearer. It's recommended to migrate to workspace-based Application Insights resources as soon as possible to take advantage of new features.|
Application-Insights|[Monitor Azure Functions with Azure Monitor Application Insights](app/monitor-functions.md)|We've overhauled our documentation on Azure Functions integration with Application Insights.|
Application-Insights|[Enable Azure Monitor OpenTelemetry for .NET, Node.js, Python and Java applications](app/opentelemetry-enable.md)|Java OpenTelemetry examples have been updated.|
Application-Insights|[Application Monitoring for Azure App Service and Java](app/azure-web-apps-java.md)|We updated and separated out the instructions to manually deploy the latest Application Insights Java version.|
Containers|[Enable Container insights for Azure Kubernetes Service (AKS) cluster](containers/container-insights-enable-aks.md)|Added section for enabling private link without managed identity authentication.|
Containers|[Syslog collection with Container Insights (preview)](containers/container-insights-syslog.md)|Added use of ARM templates for enabling syslog collection|
Essentials|[Data collection transformations in Azure Monitor](essentials/data-collection-transformations.md)|Added section and sample for using transformations to send to multiple destinations.|
Essentials|[Custom metrics in Azure Monitor (preview)](essentials/metrics-custom-overview.md)|Added reference to the limit of 64 KB on the combined length of all custom metrics names|
Essentials|[Azure monitoring REST API walkthrough](essentials/rest-api-walkthrough.md)|Refresh REST API walkthrough|
Essentials|[Collect Prometheus metrics from AKS cluster (preview)](essentials/prometheus-metrics-enable.md)|Added Enabling Prometheus metric collection using Azure policy and Bicep|
Essentials|[Send Prometheus metrics to multiple Azure Monitor workspaces (preview)](essentials/prometheus-metrics-multiple-workspaces.md)|Updated sending metrics to multiple Azure Monitor workspaces|
General|[Analyzing and visualize data](best-practices-analysis.md)|Revised the article about analyzing and visualizing monitoring data to  provide a comparison of the different visualization tools and guide customers when they would choose each tool for their implementation. |
Logs|[Tutorial: Send data to Azure Monitor Logs using REST API (Resource Manager templates)](logs/tutorial-logs-ingestion-api.md)|Minor fixes and updated sample data.|
Logs|[Analyze usage in a Log Analytics workspace](logs/analyze-usage.md)|Added query for data that has the IsBillable indicator set incorrectly, which could result in incorrect billing.|
Logs|[Add or delete tables and columns in Azure Monitor Logs](logs/create-custom-table.md)|Added custom column naming limitations.|
Logs|[Enhance data and service resilience in Azure Monitor Logs with availability zones](logs/availability-zones.md)|Clarified availability zone support for data resilience and service resilience and added new supported regions.|
Logs|[Monitor Log Analytics workspace health](logs/log-analytics-workspace-health.md)|New article that explains how to monitor the service and resource health of a Log Analytics workspace.|
Logs|[Feature extensions for Application Insights JavaScript SDK (Click Analytics)](app/javascript-click-analytics-plugin.md)|You can now launch Power BI and create a dataset and report connected to a Log Analytics query with one click.|
Logs|[Set a table's log data plan to Basic or Analytics](logs/basic-logs-configure.md)|Added new tables to the list of tables that support Basic logs.|
Logs|[Manage tables in a Log Analytics workspace]()|Refreshed all Log Analytics workspace images with the new left-hand menu (ToC).|
Security-Fundamentals|[Monitoring App Service](../../articles/app-service/monitor-app-service.md)|Revised the Azure Monitor Overview to improve usability. The article has been cleaned up and streamlined, and better reflects the product architecture as well as the customer experience. |
Snapshot-Debugger|[host.json reference for Azure Functions 2.x and later](../../articles/azure-functions/functions-host-json.md)|Removing the TSG from the AzMon TOC and adding to the support TOC|
Snapshot-Debugger|[Configure Bring Your Own Storage (BYOS) for Application Insights Profiler and Snapshot Debugger](profiler/profiler-bring-your-own-storage.md)|Removing the TSG from the AzMon TOC and adding to the support TOC|
Snapshot-Debugger|[Release notes for Microsoft.ApplicationInsights.SnapshotCollector](snapshot-debugger/snapshot-collector-release-notes.md)|Removing the TSG from the AzMon TOC and adding to the support TOC|
Snapshot-Debugger|[Enable Snapshot Debugger for .NET apps in Azure App Service](snapshot-debugger/snapshot-debugger-app-service.md)|Removing the TSG from the AzMon TOC and adding to the support TOC|
Snapshot-Debugger|[Enable Snapshot Debugger for .NET and .NET Core apps in Azure Functions](snapshot-debugger/snapshot-debugger-function-app.md)|Removing the TSG from the AzMon TOC and adding to the support TOC|
Snapshot-Debugger|[ Troubleshoot problems enabling Application Insights Snapshot Debugger or viewing snapshots](snapshot-debugger/snapshot-debugger-troubleshoot.md)|Removing the TSG from the AzMon TOC and adding to the support TOC|
Snapshot-Debugger|[Enable Snapshot Debugger for .NET apps in Azure Service Fabric, Cloud Service, and Virtual Machines](snapshot-debugger/snapshot-debugger-vm.md)|Removing the TSG from the AzMon TOC and adding to the support TOC|
Snapshot-Debugger|[Debug snapshots on exceptions in .NET apps](snapshot-debugger/snapshot-debugger.md)|Removing the TSG from the AzMon TOC and adding to the support TOC|
Virtual-Machines|[Monitor virtual machines with Azure Monitor: Analyze monitoring data](vm/monitor-virtual-machine-analyze.md)|New article|
Visualizations|[Use JSONPath to transform JSON data in workbooks](visualize/workbooks-jsonpath.md)|Added information about using JSONPath to convert data types in Azure Workbooks.|
Containers|[Configure Container insights cost optimization data collection rules]()|New article on preview of cost optimization settings.|


## January 2023  
  
|Subservice| Article | Description |
|---|---|---|
Agents|[Tutorial: Transform text logs during ingestion in Azure Monitor Logs](agents/azure-monitor-agent-transformation.md)|New tutorial on how to write a KQL query that transforms text log data and add the transformation to a data collection rule.|
Agents|[Azure Monitor Agent overview](agents/agents-overview.md)|SQL Best Practices Assessment now available with Azure Monitor Agent.|
Alerts|[Create a new alert rule](alerts/alerts-create-new-alert-rule.md)|Streamlined alerts documentation, added the common schema definition to the common schema article, and moving sample ARM templates for alerts to the Samples section.|
Alerts|[Non-common alert schema definitions for Test Action Group (Preview)](alerts/alerts-non-common-schema-definitions.md)|Added a sample payload for the Actual Cost and Forecasted Budget schemas.|
Application-Insights|[Live Metrics: Monitor and diagnose with 1-second latency](app/live-stream.md)|Updated Live Metrics troubleshooting section.|
Application-Insights|[Application Insights for Azure VMs and Virtual Machine Scale Sets](app/azure-vm-vmss-apps.md)|Easily monitor your IIS-hosted .NET Framework and .NET Core applications running on Azure VMs and Virtual Machine Scale Sets using a new App Insights Extension.|
Application-Insights|[Sampling in Application Insights](app/sampling.md)|We've added embedded links to assist with looking up type definitions. (Dependency, Event, Exception, PageView, Request, Trace)|
Application-Insights|[Configuration options: Azure Monitor Application Insights for Java](app/java-standalone-config.md)|Instructions are now available on how to set the http proxy using an environment variable, which overrides the JSON configuration. We've also provided a sample to configure connection string at runtime.|
Application-Insights|[Application Insights for Java 2.x](/previous-versions/azure/azure-monitor/app/deprecated-java-2x)|The Java 2.x retirement notice is available at https://azure.microsoft.com/updates/application-insights-java-2x-retirement.|
Autoscale|[Diagnostic settings in Autoscale](autoscale/autoscale-diagnostics.md)|Updated and expanded content|
Autoscale|[Overview of common autoscale patterns](autoscale/autoscale-common-scale-patterns.md)|Clarification of weekend profiles|
Autoscale|[Autoscale with multiple profiles](autoscale/autoscale-multiprofile.md)|Added clarifications for profile end times|
Change-Analysis|[Scenarios for using Change Analysis in Azure Monitor](change/change-analysis-custom-filters.md)|Merged two low engagement docs into Visualizations article and removed from TOC|
Change-Analysis|[Scenarios for using Change Analysis in Azure Monitor](change/change-analysis-query.md)|Merged two low engagement docs into Visualizations article and removed from TOC|
Change-Analysis|[Scenarios for using Change Analysis in Azure Monitor](change/change-analysis-visualizations.md)|Merged two low engagement docs into Visualizations article and removed from TOC|
Change-Analysis|[Track a web app outage using Change Analysis](change/tutorial-outages.md)|Added new section on virtual network changes to the tutorial|
Containers|[Azure Monitor container insights for Azure Kubernetes Service (AKS) hybrid clusters (preview)](containers/container-insights-enable-provisioned-clusters.md)|New article.|
Containers|[Syslog collection with Container Insights (preview)](containers/container-insights-syslog.md)|New article.|
Essentials|[Query Prometheus metrics using Azure workbooks (preview)](essentials/prometheus-workbooks.md)|New article.|
Essentials|[Azure Workbooks data sources](visualize/workbooks-data-sources.md)|Added section for Prometheus metrics.|
Essentials|[Query Prometheus metrics using Azure workbooks (preview)](essentials/prometheus-workbooks.md)|New article|
Essentials|[Azure Monitor workspace (preview)](essentials/azure-monitor-workspace-overview.md)|Updated design considerations|
Essentials|[Supported metrics with Azure Monitor](essentials/metrics-supported.md)|Updated and refreshed the list of supported metrics|
Essentials|[Supported categories for Azure Monitor resource logs](essentials/resource-logs-categories.md)|Updated and refreshed the list of supported logs|
General|[Multicloud monitoring with Azure Monitor](best-practices-multicloud.md)|New article.|
Logs|[Set daily cap on Log Analytics workspace](logs/daily-cap.md)|Clarified special case for daily cap logic.|
Logs|[Send custom metrics for an Azure resource to the Azure Monitor metric store by using a REST API](essentials/metrics-store-custom-rest-api.md)|Updated and refreshed how to send custom metrics|
Logs|[Migrate from Splunk to Azure Monitor Logs](logs/migrate-splunk-to-azure-monitor-logs.md)|New article that explains how to migrate your Splunk Observability deployment to Azure Monitor Logs for logging and log data analysis.|
Logs|[Manage access to Log Analytics workspaces](logs/manage-access.md)|Added permissions required to run a search job and restore archived data.|
Logs|[Set a table's log data plan to Basic or Analytics](logs/basic-logs-configure.md)|Added information about how to modify a table schema using the API.|
Snapshot-Debugger|[Enable Snapshot Debugger for .NET apps in Azure App Service](snapshot-debugger/snapshot-debugger-app-service.md)|Per customer feedback, added new note that Consumption plan isn't supported|
Virtual-Machines|[Collect IIS logs with Azure Monitor Agent](agents/data-collection-iis.md)|Added sample log queries.|
Virtual-Machines|[Collect text logs with Azure Monitor Agent](agents/data-collection-text-log.md)|Added sample log queries.|
Virtual-Machines|[Monitor virtual machines with Azure Monitor: Deploy agent](vm/monitor-virtual-machine-agent.md)|Rewritten for Azure Monitor agent.|
Virtual-Machines|[Monitor virtual machines with Azure Monitor: Alerts](vm/monitor-virtual-machine-alerts.md)|Rewritten for Azure Monitor agent.|
Virtual-Machines|[Monitor virtual machines with Azure Monitor: Analyze monitoring data](vm/monitor-virtual-machine-analyze.md)|Rewritten for Azure Monitor agent.|
Virtual-Machines|[Monitor virtual machines with Azure Monitor: Collect data](vm/monitor-virtual-machine-data-collection.md)|Rewritten for Azure Monitor agent.|
Virtual-Machines|[Monitor virtual machines with Azure Monitor: Migrate management pack logic](vm/monitor-virtual-machine-management-packs.md)|Rewritten for Azure Monitor agent.|
Virtual-Machines|[Monitor virtual machines with Azure Monitor](vm/monitor-virtual-machine.md)|Rewritten for Azure Monitor agent.|
Virtual-Machines|[Monitor Azure virtual machines](../../articles/virtual-machines/monitor-vm.md)|VM scenario updates for AMA|

## December 2022  
  
|Subservice| Article | Description |
|---|---|---|
General|[Azure Monitor for existing Operations Manager customers](azure-monitor-operations-manager.md)|Updated for AMA and SCOM managed instance.|
Application-Insights|[Create an Application Insights resource](app/create-new-resource.md)|Classic Application Insights resources are deprecated and support will end on February 29, 2024. Migrate to workspace-based resources to take advantage of new capabilities.|
Application-Insights|[Enable Azure Monitor OpenTelemetry for .NET, Node.js, and Python applications (preview)](app/opentelemetry-enable.md)|Updated Node.js sample code for JavaScript and TypeScript.|
Application-Insights|[System performance counters in Application Insights](app/performance-counters.md)|Updated code samples for .NET 6/7.|
Application-Insights|[Sampling in Application Insights](app/sampling.md)|Updated code samples for .NET 6/7.|
Application-Insights|[Availability alerts](app/availability-alerts.md)|This article has been rewritten with new guidance and screenshots.|
Change-Analysis|[Tutorial: Track a web app outage using Change Analysis](change/tutorial-outages.md)|Change tutorial content to reflect changes to repo; remove and replace a few sections.|
Containers|[Configure Azure CNI networking in Azure Kubernetes Service (AKS)](../../articles/aks/configure-azure-cni.md)|Added steps to enable IP subnet usage|
Containers|[Reports in Container insights](containers/container-insights-reports.md)|Updated the documents to reflect the steps to enable IP subnet Usage|
Essentials|[Best practices for data collection rule creation and management in Azure Monitor](essentials/data-collection-rule-best-practices.md)|New article|
Essentials|[Configure self-managed Grafana to use Azure Monitor managed service for Prometheus (preview) with Azure Active Directory.](essentials/prometheus-self-managed-grafana-azure-active-directory.md)|New Article: Configure self-managed Grafana to use Azure Monitor managed service for Prometheus (preview) with Azure Active Directory.|
Logs|[Azure Monitor SCOM Managed Instance (preview)](vm/scom-managed-instance-overview.md)|New article|
Logs|[Set a table's log data plan to Basic or Analytics](logs/basic-logs-configure.md)|Updated the list of tables that support Basic logs.|
Virtual-Machines|[Tutorial: Create availability alert rule for Azure virtual machine (preview)](vm/tutorial-monitor-vm-alert-availability.md)|New article|
Virtual-Machines|[Tutorial: Enable recommended alert rules for Azure virtual machine](vm/tutorial-monitor-vm-alert-recommended.md)|New article|
Virtual-Machines|[Tutorial: Enable monitoring with VM insights for Azure virtual machine](vm/tutorial-monitor-vm-enable-insights.md)|New article|
Virtual-Machines|[Monitor Azure virtual machines](../../articles/virtual-machines/monitor-vm.md)|Updated for AMA and availability metric.|
Virtual-Machines|[Enable VM insights by using Azure Policy](vm/vminsights-enable-policy.md)|Updated flow for enabling VM insights with Azure Monitor Agent by using Azure Policy.|
Visualizations|[Creating an Azure Workbook](visualize/workbooks-create-workbook.md)|added Tutorial - resource centric logs queries in workbooks|

## November 2022  
  
  
  
|Subservice| Article | Description |
|---|---|---|
General|[Cost optimization and Azure Monitor](best-practices-cost.md)|Complete rewrite to align with Well Architected Framework. Detailed content moved to other articles and linked from here.|
Agents|[Collect SNMP trap data with Azure Monitor Agent](agents/data-collection-snmp-data.md)|New tutorial that explains how to collect Simple Network Management Protocol (SNMP) traps using Azure Monitor Agent.|
Alerts|[Create a new alert rule](alerts/alerts-create-new-alert-rule.md)|Resource Health alerts and Service Health alerts are created using the same simplified workflow as all other alert types.|
Alerts|[Manage your alert rules](alerts/alerts-manage-alert-rules.md)|Recommended alert rules are enabled for AKS and Log Analytics workspace resources in addition to VMs.|
Application-insights|[Sampling in Application Insights](app/sampling.md)|ASP.NET Core applications may be configured in code or through the `appsettings.json` file. Conflicting information was removed.|
Application-insights|[How many Application Insights resources should I deploy?](app/separate-resources.md)|Clarification has been added on setting iKey dynamically in code.|
Application-insights|[Application Map: Triage distributed applications](app/app-map.md)|App Map Filters, an exciting new feature, has been documented.|
Application-insights|[Enable Application Insights for ASP.NET Core applications](app/tutorial-asp-net-core.md)|The Azure Café sample app is now hosted and linked on Git.|
Application-insights|[What is auto-instrumentation for Azure Monitor Application Insights?](app/codeless-overview.md)|Our auto-instrumentation supported languages chart has been updated.|
Application-insights|[Application Monitoring for Azure App Service and ASP.NET](app/azure-web-apps-net.md)|Links to check versions have been corrected.|
Application-insights|[Sampling overrides (preview) - Azure Monitor Application Insights for Java](app/java-standalone-sampling-overrides.md)|Updated OpenTelemetry Span information for Java.|
Autoscale|[Understand autoscale settings](autoscale/autoscale-understanding-settings.md)|Refresh and update|
Autoscale|[Overview of common autoscale patterns](autoscale/autoscale-common-scale-patterns.md)|Refreshed and updated.|
Essentials|[Azure Monitor managed service for Prometheus (preview)](essentials/prometheus-metrics-scrape-default.md)|General restructure of Prometheus content.|
Essentials|[Configure remote write for Azure Monitor managed service for Prometheus using Azure Active Directory authentication (preview)](essentials/prometheus-remote-write.md)|New article|
Essentials|[Azure Monitor workspace (preview)](essentials/azure-monitor-workspace-overview.md)|Added Bicep example.|
Essentials|[Migrate from diagnostic settings storage retention to Azure Storage lifecycle management](essentials/migrate-to-azure-storage-lifecycle-policy.md)|Deprecation note added|
Essentials|[Diagnostic settings in Azure Monitor](essentials/diagnostic-settings.md)|All destination endpoints support TLS 1.2.|
Logs|[Cost optimization and Azure Monitor](best-practices-cost.md)|Added cost information and removed preview label.|
Logs|[Diagnostic settings in Azure Monitor](essentials/diagnostic-settings.md)|Added section on controlling costs with transformations.|
Logs|[Analyze usage in a Log Analytics workspace](logs/analyze-usage.md)|Added KQL query that retrieves data volumes for charged data types.|
Logs|[Access the Azure Monitor Log Analytics API](logs/api/timeouts.md)|Refresh and update|
Logs|[Collect text logs with the Log Analytics agent in Azure Monitor](agents/data-sources-custom-logs.md)|New table management section with new articles on table configuration options, schema management, and custom table creation.|
Logs|[Azure Monitor Metrics overview](essentials/data-platform-metrics.md)| Added a new Azure SDK client library for Go.|
Logs|[Azure Monitor Log Analytics API Overview](logs/api/overview.md)| Added a new Azure SDK client library for Go.|
Logs|[Azure Monitor Logs overview](logs/data-platform-logs.md)| Added a new Azure SDK client library for Go.|
Logs|[Log queries in Azure Monitor](logs/log-query-overview.md)| Added a new Azure SDK client library for Go.|
Logs|[Set a table's log data plan to Basic or Analytics](logs/basic-logs-configure.md)|Added new tables to the list of tables that support the Basic log data plan.|
Visualizations|[Monitor your Azure services in Grafana](visualize/grafana-plugin.md)|The Grafana integration is GA, and is no longer in preview.|
Visualizations|[Get started with Azure Workbooks](visualize/workbooks-getting-started.md)|Added instructions for how to share Workbooks.|

  

## October 2022  
  
  
  
|Sub-service| Article | Description |
|---|---|---|
|General|Table of contents|We have updated the Azure Monitor Table of Contents. The new TOC structure better reflects the customer experience and makes it easier for users to navigate and discover our content.|
Alerts|[Connect Azure to ITSM tools by using IT Service Management](./alerts/itsmc-definition.md)|Deprecating support for sending ITSM actions and events to ServiceNow. Instead, use ITSM actions in action groups based on Azure alerts to create work items in your ITSM tool.|
Alerts|[Create a new alert rule](./alerts/alerts-create-new-alert-rule.md)|New PowerShell commands to create and manage log alerts.|
Alerts|[Types of Azure Monitor alerts](alerts/alerts-types.md)|Updated to include Prometheus alerts.|
Alerts|[Customize alert notifications using Logic Apps](./alerts/alerts-logic-apps.md)|New: How to use alerts to send emails or Teams posts using logic apps|
Application-insights|[Sampling in Application Insights](./app/sampling.md)|The  "When to use sampling" and "How sampling works" sections have been prioritized as prerequisite information for the rest of the article.|
Application-insights|[What is auto-instrumentation for Azure Monitor Application Insights?](./app/codeless-overview.md)|The auto-instrumentation overview has been visually overhauled with links and footnotes.|
Application-insights|[Enable Azure Monitor OpenTelemetry for .NET, Node.js, and Python applications (preview)](./app/opentelemetry-enable.md)|Open Telemetry Metrics are now available for .NET, Node.js and Python applications.|
Application-insights|[Find and diagnose performance issues with Application Insights](./app/tutorial-performance.md)|The URL Ping (Classic) Test has been replaced with the Standard Test step-by-step instructions.|
Application-insights|[Application Insights API for custom events and metrics](./app/api-custom-events-metrics.md)|Flushing information was added to the FAQ.|
Application-insights|[Azure AD authentication for Application Insights](./app/azure-ad-authentication.md)|We updated the `TelemetryConfiguration` code sample using .NET.|
Application-insights|[Using Azure Monitor Application Insights with Spring Boot](./app/java-spring-boot.md)|Spring Boot information was updated to 3.4.2.|
Application-insights|[Configuration options: Azure Monitor Application Insights for Java](./app/java-standalone-config.md)|New features include Capture Log4j Markers and Logback Markers as custom properties on the corresponding trace (log message) telemetry.|
Application-insights|[Create custom KPI dashboards using Application Insights](./app/tutorial-app-dashboards.md)|This article has been refreshed with new screenshots and instructions.|
Application-insights|[Share Azure dashboards by using Azure role-based access control](../azure-portal/azure-portal-dashboard-share-access.md)|This article has been refreshed with new screenshots and instructions.|
Application-insights|[Application Monitoring for Azure App Service and ASP.NET](./app/azure-web-apps-net.md)|Important notes added regarding System.IO.FileNotFoundException after 2.8.44 auto-instrumentation upgrade.|
Application-insights|[Geolocation and IP address handling](./app/ip-collection.md)| Geolocation lookup information has been updated.|
Containers|[Metric alert rules in Container insights (preview)](./containers/container-insights-metric-alerts.md)|Container insights metric Alerts|
Containers|[Custom metrics collected by Container insights](containers/container-insights-custom-metrics.md?tabs=portal)|New article.|
Containers|[Overview of Container insights in Azure Monitor](containers/container-insights-overview.md)|Rewritten to simplify onboarding options.|
Containers|[Enable Container insights for Azure Kubernetes Service (AKS) cluster](containers/container-insights-enable-aks.md?tabs=azure-cli)|Updated to combine new and existing clusters.|
Containers Prometheus|[Query logs from Container insights](containers/container-insights-log-query.md)|Now includes log queries for Prometheus data.|
Containers Prometheus|[Collect Prometheus metrics with Container insights](containers/container-insights-prometheus.md?tabs=cluster-wide)|Updated to include Azure Monitor managed service for Prometheus.|
Essentials Prometheus|[Metrics in Azure Monitor](essentials/data-platform-metrics.md)|Updated to include Azure Monitor managed service for Prometheus|
Essentials Prometheus|<ul> <li>  [Azure Monitor workspace overview (preview)](essentials/azure-monitor-workspace-overview.md?tabs=azure-portal) </li><li> [Overview of Azure Monitor Managed Service for Prometheus (preview)](essentials/prometheus-metrics-overview.md) </li><li>[Rule groups in Azure Monitor Managed Service for Prometheus (preview)](essentials/prometheus-rule-groups.md)</li><li>[Remote-write in Azure Monitor Managed Service for Prometheus (preview)](essentials/prometheus-remote-write-managed-identity.md)  </li><li>[Use Azure Monitor managed service for Prometheus (preview) as data source for Grafana](essentials/prometheus-grafana.md)</li><li>[Troubleshoot collection of Prometheus metrics in Azure Monitor (preview)](essentials/prometheus-metrics-troubleshoot.md)</li><li>[Default Prometheus metrics configuration in Azure Monitor (preview)](essentials/prometheus-metrics-scrape-default.md)</li><li>[Scrape Prometheus metrics at scale in Azure Monitor (preview)](essentials/prometheus-metrics-scrape-scale.md)</li><li>[Customize scraping of Prometheus metrics in Azure Monitor (preview)](essentials/prometheus-metrics-scrape-configuration.md)</li><li>[Create, validate and troubleshoot custom configuration file for Prometheus metrics in Azure Monitor (preview)](essentials/prometheus-metrics-scrape-validate.md)</li><li>[Minimal Prometheus ingestion profile in Azure Monitor (preview)](essentials/prometheus-metrics-scrape-configuration-minimal.md)</li><li>[Collect Prometheus metrics from AKS cluster (preview)](essentials/prometheus-metrics-enable.md)</li><li>[Send Prometheus metrics to multiple Azure Monitor workspaces (preview)](essentials/prometheus-metrics-multiple-workspaces.md) </li></ul>   |New articles. Public preview of Azure Monitor managed service for Prometheus|
Essentials Prometheus|[Azure Monitor managed service for Prometheus remote write - managed identity (preview)](./essentials/prometheus-remote-write-managed-identity.md)|Addition: Verify Prometheus remote write is working correctly|
Essentials|[Azure resource logs](./essentials/resource-logs.md)|Clarification: Which blobs logs are written to, and when|
Essentials|[Resource Manager template samples for Azure Monitor](resource-manager-samples.md?tabs=portal)|Added template deployment methods.|
Essentials|[Azure Monitor service limits](service-limits.md)|Added Azure Monitor managed service for Prometheus|
Logs|[Manage access to Log Analytics workspaces](./logs/manage-access.md)|Table-level role-based access control (RBAC) lets you give specific users or groups read access to particular tables.|
Logs|[Configure Basic Logs in Azure Monitor](./logs/basic-logs-configure.md)|General availability of the Basic Logs data plan, retention and archiving, search job, and the table management user experience in the Azure portal.|
Logs|[Guided project - Analyze logs in Azure Monitor with KQL - Training](/training/modules/analyze-logs-with-kql/)|New Learn module. Learn to write KQL queries to retrieve and transform log data to answer common business and operational questions.|
Logs|[Detect and analyze anomalies with KQL in Azure Monitor](logs/kql-machine-learning-azure-monitor.md)|New tutorial. Walkthrough of how to use KQL for time series analysis and anomaly detection in Azure Monitor Log Analytics. |
Virtual-machines|[Enable VM insights for a hybrid virtual machine](./vm/vminsights-enable-hybrid.md)|Updated versions of standalone installers.|
Visualizations|[Retrieve legacy Application Insights workbooks](./visualize/workbooks-retrieve-legacy-workbooks.md)|New article about how to access legacy workbooks in the Azure portal.|
Visualizations|[Azure Workbooks](./visualize/workbooks-overview.md)|New video to see how you can use Azure Workbooks to get insights and visualize your data. |

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
|[Types of Azure Monitor alerts](alerts/alerts-types.md)|Azure Database for PostgreSQL - Flexible Servers  is supported for monitoring multiple resources.|
|[Upgrade legacy rules management to the current Log Alerts API from legacy Log Analytics Alert API](./alerts/alerts-log-api-switch.md)|The process of moving legacy log alert rules management from the legacy API to the current API is now supported by the government cloud.|

### Application insights

| Article | Description |
|---|---|
|[Azure Monitor OpenTelemetry-based auto-instrumentation for Java applications](./app/opentelemetry-enable.md?tabs=java)|New OpenTelemetry `@WithSpan` annotation guidance.|
|[Capture Application Insights custom metrics with .NET and .NET Core](./app/tutorial-asp-net-custom-metrics.md)|Tutorial steps and images have been updated.|
|[Configuration options - Azure Monitor Application Insights for Java](./app/opentelemetry-enable.md)|Connection string guidance updated.|
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
|[Dependency analysis in Azure Migrate Discovery and assessment - Azure Migrate](../migrate/concepts-dependency-visualization.md)|Revamped the guidance for migrating from Log Analytics Agent to Azure Monitor Agent.|


### Alerts

| Article | Description |
|:---|:---|
|[Create Azure Monitor alert rules](alerts/alerts-create-new-alert-rule.md)|Added support for data processing in a specified region, for action groups and for metric alert rules that monitor a custom metric.|

### Application insights

| Article | Description |
|---|---|
|[Azure Application Insights Overview Dashboard](app/overview-dashboard.md)|Important information has been added clarifying that moving or renaming resources will break dashboards, with additional instructions on how to resolve this scenario.|
|[Azure Application Insights override default SDK endpoints](app/create-new-resource.md#override-default-endpoints)|We've clarified that endpoint modification isn't recommended and to use connection strings instead.|
|[Continuous export of telemetry from Application Insights](app/export-telemetry.md)|Important information has been added about avoiding duplicates when saving diagnostic logs in a Log Analytics workspace.|
|[Dependency Tracking in Azure Application Insights with OpenCensus Python](app/opencensus-python-dependency.md)|Updated Django sample application and documentation in the Azure Monitor OpenCensus Python samples repository.|
|[Incoming Request Tracking in Azure Application Insights with OpenCensus Python](app/opencensus-python-request.md)|Updated Django sample application and documentation in the Azure Monitor OpenCensus Python samples repository.|
|[Monitor Python applications with Azure Monitor](app/opencensus-python.md)|Updated Django sample application and documentation in the Azure Monitor OpenCensus Python samples repository.|
|[Configuration options - Azure Monitor Application Insights for Java](app/java-standalone-config.md)|Updated connection string overrides example.|
|[Application Insights SDK for ASP.NET Core applications](app/tutorial-asp-net-core.md)|A new tutorial with step-by-step instructions to use the Application Insights SDK with .NET Core applications.|
|[Application Insights SDK support guidance](app/sdk-support-guidance.md)|Our SDK support guidance has been updated and clarified.|
|[Azure Application Insights - Dependency Auto-Collection](app/asp-net-dependencies.md#dependency-auto-collection)|The latest currently supported node.js modules have been updated.|
|[Application Insights custom metrics with .NET and .NET Core](app/tutorial-asp-net-custom-metrics.md)|A new tutorial with step-by-step instructions on how to enable custom metrics with .NET applications.|
|[Migrate an Application Insights classic resource to a workspace-based resource](app/convert-classic-resource.md)|A comprehensive FAQ section has been added to assist with migration to workspace-based resources.|
|[Configuration options - Azure Monitor Application Insights for Java](app/java-standalone-config.md)|This article has been fully updated for 3.4.0-BETA.|

### Autoscale

| Article | Description |
|---|---|
|[Autoscale in Microsoft Azure](autoscale/autoscale-overview.md)|Updated conceptual diagrams|
|[Use predictive autoscale to scale out before load demands in Virtual Machine Scale Sets (preview)](autoscale/autoscale-predictive.md)|Predictive autoscale (preview) is now available in all regions|

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
|[Azure Monitor Application Insights Java](app/opentelemetry-enable.md?tabs=java)|OpenTelemetry-based auto-instrumentation for Java applications has an updated Supported Custom Telemetry table.
|[Application Insights API for custom events and metrics](app/api-custom-events-metrics.md)|Clarification has been added that valueCount and itemCount have a minimum value of 1.
|[Telemetry sampling in Azure Application Insights](app/sampling.md)|Sampling documentation has been updated to warn of the potential impact on alerting accuracy.
|[Azure Monitor Application Insights Java (redirect to OpenTelemetry)](app/java-in-process-agent-redirect.md)|Java Auto-Instrumentation now redirects to OpenTelemetry documentation.
|[Azure Application Insights for ASP.NET Core applications](app/asp-net-core.md)|Updated .NET Core FAQ
|[Create a new Azure Monitor Application Insights workspace-based resource](app/create-workspace-resource.md)|We've linked out to Microsoft Insights components for more information on Properties.
|[Application Insights SDK support guidance](app/sdk-support-guidance.md)|SDK support guidance has been updated and clarified.
|[Azure Monitor Application Insights Java](app/opentelemetry-enable.md?tabs=java)|Example code has been updated.
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
| [Azure Application Insights for JavaScript web apps](app/javascript.md) | Our Java on-premises page has been retired and redirected to [Azure Monitor OpenTelemetry-based auto-instrumentation for Java applications](app/opentelemetry-enable.md?tabs=java).|
| [Azure Application Insights Telemetry Data Model - Telemetry Context](app/data-model-context.md) | Clarified that Anonymous User ID is simply User.Id for easy selection in Intellisense.|
| [Continuous export of telemetry from Application Insights](app/export-telemetry.md) | On February 29, 2024, continuous export will be deprecated as part of the classic Application Insights deprecation.|
| [Dependency Tracking in Azure Application Insights](app/asp-net-dependencies.md) | The Event Hubs Client SDK and ServiceBus Client SDK information has been updated.|
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
