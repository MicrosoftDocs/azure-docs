---
title: "What's new in Azure Monitor documentation"
description: "What's new in Azure Monitor documentation"
author: EdB-MSFT
ms.topic: conceptual
ms.date: 06/06/2023
ms.author: edbaynash
---

# What's new in Azure Monitor documentation

This article lists significant changes to Azure Monitor documentation.

> [!TIP]
> Get notified when this page is updated by copying and pasting the following URL into your feed reader:
>
> !["An rss icon"](./media//whats-new/rss.png)  https://aka.ms/azmon/rss

## August 2023

|Subservice| Article | Description |
|---|---|---|
General|[Azure Monitor cost and usage](usage-estimated-costs.md)|Added section detailing billing meter names.|
Application-Insights|[Add, modify, and filter OpenTelemetry](app/opentelemetry-add-modify.md)|A caution has been added about using community libraries with additional information on how to request we include them in our distro.|
Application-Insights|[Add, modify, and filter OpenTelemetry](app/opentelemetry-add-modify.md)|Support and feedback options are now available across all of our OpenTelemetry pages.|
Application-Insights|[How many Application Insights resources should I deploy?](app/separate-resources.md)|We added an important warning about additional network costs when monitoring across regions.|
Application-Insights|[Use Search in Application Insights](app/diagnostic-search.md)|We clarified that URL query strings are not logged by Azure Functions and that URL query strings won't show up in searches.|
Application-Insights|[Migrating from OpenCensus Python SDK and Azure Monitor OpenCensus exporter for Python to Azure Monitor OpenTelemetry Python Distro](app/opentelemetry-python-opencensus-migrate.md)|Migrate from OpenCensus to OpenTelemetry with this step-by-step guidance.|
Application-Insights|[Application Insights overview](app/app-insights-overview.md)|We've added an illustration to convey how Azure Monitor Application Insights works at a high level.|
Containers|[Troubleshoot collection of Prometheus metrics in Azure Monitor](containers/prometheus-metrics-troubleshoot.md)|Added the *Troubleshoot using PowerShell script* section.|
Containers|[Monitor Kubernetes clusters using Azure services and cloud native tools](containers/monitor-kubernetes.md)|Updated previous scenario for hybrid Kubernetes clusters and managed Prometheus.|
Containers|[Monitor Azure Kubernetes Service (AKS)](/azure/aks/monitor-aks)|New article providing simplified introduction to monitoring AKS cluster.|
Containers|[Container insights overview](containers/container-insights-overview.md)|Rewritten for to include new features and managed services.|
Essentials|[Send Prometheus metrics to Log Analytics workspace with Container insights](containers/container-insights-prometheus-logs.md)|Updated to simplify article to only legacy method of sending Prometheus metrics to Log Analytics workspace.|
Essentials|[Collect Prometheus metrics from an AKS cluster](containers/prometheus-metrics-enable.md)|Updated to include additional onboarding methods.|
Essentials|[Azure Monitor managed service for Prometheus rule groups](essentials/prometheus-rule-groups.md)|Expanded "Limiting rules to a specific cluster"|
Logs|[Enable cost optimization settings](containers/container-insights-cost-config.md)|Updated for portal updates and additional details on workspace tables.|
Logs|[Enable the ContainerLogV2 schema](containers/container-insights-logging-v2.md)|Updated configuration section.|
Logs|[Manage access to Log Analytics workspaces](logs/manage-access.md)|Simplified flow for setting table-level access.|
Logs|[Query data in Azure Data Explorer and Azure Resource Graph from Azure Monitor](logs/azure-monitor-data-explorer-proxy.md)|Azure Monitor now lets you query data in Azure Resource Graph from your Log Analytics workspace. |


## July 2023

|Subservice| Article | Description |
|---|---|---|
Agents|[Azure Monitor Agent Health (Preview)](agents/azure-monitor-agent-health.md)|Introduced a new Azure Monitor Agent Health workbook, which monitors the health of agents deployed across your organization. |
Alerts|[Manage your alert instances](alerts/alerts-manage-alert-instances.md)|View alerts as a timeline (preview)|
Alerts|[Upgrade to the Log Alerts API from the legacy Log Analytics alerts API](alerts/alerts-log-api-switch.md)|Changes to the log alert rule creation experience|
Application-Insights|[Migrate to workspace-based Application Insights resources](app/convert-classic-resource.md)|We now support migrating classic components to workspace-based components via PowerShell cmdlet. |
Application-Insights|[EventCounters introduction](app/eventcounters.md)|Code samples have been provided for the latest .NET versions.|
Application-Insights|[Enable a framework extension for Application Insights JavaScript SDK](app/javascript-framework-extensions.md)|We've added a section for the React Native Manual Device Plugin, and clarified exception tracking and device info collection.|
Application-Insights|[Migrate availability tests](app/availability-test-migration.md)|Migrate your classic URL ping tests to the new standard availability tests using this prescriptive guidance.|
Application-Insights|[Enable a framework extension for Application Insights JavaScript SDK](app/javascript-framework-extensions.md)|The  'What does the plug-in enable?' and 'Add configuration' sections have been rewritten to align across all of our JavaScript documentation.|
Application-Insights|[Microsoft Azure Monitor Application Insights JavaScript SDK configuration](app/javascript-sdk-configuration.md)|The  'What does the plug-in enable?' and 'Add configuration' sections have been rewritten to align across all of our JavaScript documentation.|
Application-Insights|[Enable Azure Monitor OpenTelemetry for .NET, Node.js, Python and Java applications](app/opentelemetry-enable.md)|Clarification of the term "Distro" has been provided.|
Application-Insights|[Data Collection Basics of Azure Monitor Application Insights](app/opentelemetry-overview.md)|We've added a new article to clarify both manual and automatic instrumentation options to enable Application Insights.|
Application-Insights|[Enable a framework extension for Application Insights JavaScript SDK](app/javascript-framework-extensions.md)|The "Explore your data" section has been improved.|
Application-Insights|[Sampling overrides (preview) - Azure Monitor Application Insights for Java](app/java-standalone-sampling-overrides.md)|We've documented steps for troubleshooting sampling.|
Logs|[Set a table's log data plan to Basic or Analytics](logs/basic-logs-configure.md)|Additional Azure tables now support low-cost basic logs, including tables for the Bare Metal Machines, Managed Lustre, Nexus Clusters, and Nexus Storage Appliances services. |
Logs|[Create and manage a dedicated cluster in Azure Monitor Logs](logs/logs-dedicated-clusters.md)|The minimum ingestion commitment for a dedicated cluster is now 100 GB per day (previously 500 GB). |
Logs|[Query Basic Logs in Azure Monitor](logs/basic-logs-query.md)|Basic log queries are now billable.|
Logs|[Restore logs in Azure Monitor](logs/restore.md)|Restored logs are now billable.|
Logs|[Run search jobs in Azure Monitor](logs/search-jobs.md)|Search jobs are now billable.|
Logs|[Tutorial: Ingest events from Azure Event Hubs into Azure Monitor Logs (Preview)](logs/ingest-logs-event-hub.md)|New article that explains how to ingest data directly from Azure Event Hubs, Azure's big data streaming platform, into Azure Monitor Logs.|
Optimization-Insights|[Monitor and analyze runtime behavior with Code Optimizations (Preview)](insights/code-optimizations.md)|PM added a demo video for Code Optimizations|
Virtual-Machines|[Migrate from deprecated VM insights policies](vm/vminsights-migrate-deprecated-policies.md)|We're deprecating the VM insights DCR deployment policies and replacing them with new policies because of a race condition issue. This article explains how to migrate from deprecated VM insights policies to their replacement policies.|

## June 2023

|Subservice| Article | Description |
|---|---|---|
General|[What's new in Azure Monitor documentation](whats-new.md)| Subscribe to "What's New" using the new RSS link|
Application-Insights|[Filter and preprocess telemetry in the Application Insights SDK](app/api-filtering-sampling.md)|An Azure Monitor Telemetry Data Types Reference has been added for quick reference.|
Application-Insights|[Add and modify OpenTelemetry](app/opentelemetry-add-modify.md)|We've simplified the OpenTelemetry onboarding process by moving instructions to add and modify telemetry in this new document.|
Application-Insights|[Application Map: Triage distributed applications](app/app-map.md)|Application Map Intelligent View has reached general availability. Enjoy this powerful tool that harnesses machine learning to aid in service health investigations.|
Application-Insights|[Usage analysis with Application Insights](app/usage-overview.md)|Code samples have been updated for the latest versions of .NET.|
Application-Insights|[Enable a framework extension for Application Insights JavaScript SDK](app/javascript-framework-extensions.md)|All JavaScript SDK documentation has been updated and simplified, including documentation for feature and framework extensions.|
Autoscale|[Use autoscale actions to send email and webhook alert notifications in Azure Monitor](autoscale/autoscale-webhook-email.md)|Article updated and refreshed|
Containers|[Query logs from Container insights](containers/container-insights-log-query.md#container-logs)|New section: Container logs, with sample queries|
Containers|[Authentication for Container Insights](containers/container-insights-authentication.md)|New article: Configure agent authentication for the Container Insights agent|
Essentials|[Azure monitoring REST API walkthrough](essentials/rest-api-walkthrough.md)|Added multi resource request examples|
Essentials|[Azure Monitor managed service for Prometheus rule groups](essentials/prometheus-rule-groups.md)| Added CLI & PowerShell reference and examples|
Logs|[Set up resources required to send data to Azure Monitor Logs using the Logs Ingestion API](logs/set-up-logs-ingestion-api-prerequisites.md)|New article. Run a PowerShell script to set up resources required to send data to Azure Monitor using the Logs Ingestion API.|
Logs|[Migrate from the HTTP Data Collector API to the Log Ingestion API to send data to Azure Monitor Logs](logs/custom-logs-migrate.md)|Updated guidance for migrating from the legacy Azure Monitor Data Collector API to the Log Ingestion API.|
Logs|[Detect and mitigate potential issues using AIOps and machine learning in Azure Monitor](logs/aiops-machine-learning.md)|New article. Lists Azure Monitor AIOps features and explains how to implement a machine learning pipeline on data in Azure Monitor Logs.|
Logs|[Tutorial: Analyze data in Azure Monitor Logs using a notebook](logs/notebooks-azure-monitor-logs.md)|New tutorial. Explains how to integrate a notebook with a Log Analytics workspace to create a machine learning pipeline or perform advanced analysis on data in Azure Monitor Logs. |
Virtual-Machines|[Tutorial: Create availability alert rule for multiple Azure virtual machines (preview)](vm/tutorial-monitor-vm-alert-availability.md)|New article with consolidated list of best practices for monitoring VMs organized by WAF pillar.|

## May 2023

|Subservice| Article | Description |
|---|---|---|
Agents|[Azure Monitor Agent overview](agents/agents-overview.md)|Mma ama migration update|
Agents|[Azure Monitor Agent overview](agents/agents-overview.md)|Azure Monitoring Agent for Linux now officially supports various hardening standards for Linux operating systems and distros.|
Agents|[Migrate from MMA custom text log to AMA DCR based custom text logs](agents/azure-monitor-agent-custom-text-log-migration.md)|New article that explains how to migrate from the HTTP Data Collector API to the Log Ingestion API.|
Agents|[Azure Monitor Agent overview](agents/agents-overview.md)|Azure Monitor Agent now supports Azure Stack HCI. |
Alerts|[Create a new alert rule](alerts/alerts-create-new-alert-rule.md)|Log alert rules support using managed identities to send the log query.|
Alerts|[Monitor Azure AD B2C with Azure Monitor](/azure/active-directory-b2c/azure-monitor)|Articles on action groups have been updated.|
Alerts|[Create a new alert rule](alerts/alerts-create-new-alert-rule.md)|Alert rules that use action groups support custom properties to add custom information to the alert notification payload.|
Application-Insights|[Feature extensions for the Application Insights JavaScript SDK (Click Analytics)](app/javascript-feature-extensions.md)|Most of our JavaScript SDK documentation has been updated and overhauled.|
Application-Insights|[Analyze product usage with HEART](app/usage-heart.md)|Updated and overhauled HEART framework documentation.|
Application-Insights|[Dependency tracking in Application Insights](app/asp-net-dependencies.md)|All new documentation supports the Azure Monitor OpenTelemetry Distro public preview release announced on May 10, 2023. [Public Preview: Azure Monitor OpenTelemetry Distro for ASP.NET Core, JavaScript (Node.js), Python](https://azure.microsoft.com/updates/public-preview-azure-monitor-opentelemetry-distro-for-aspnet-core-javascript-nodejs-python)|
Application-Insights|[Application Monitoring for Azure App Service and Java](app/azure-web-apps-java.md)|Added CATALINA_OPTS for Tomcat.|
Essentials|[Configure remote write for Azure Monitor managed service for Prometheus using Microsoft Azure Active Directory pod identity (preview)](essentials/prometheus-remote-write-azure-ad-pod-identity.md)|New article: Configure remote write for Azure Monitor managed service for Prometheus using Microsoft Azure Active Directory pod identity|
Essentials|[Use private endpoints for Managed Prometheus and Azure Monitor workspace](essentials/azure-monitor-workspace-private-endpoint.md)|New article: Use private endpoints for Managed Prometheus and Azure Monitor workspace|
Essentials|[Private Link for data ingestion for Managed Prometheus and Azure Monitor workspace](essentials/private-link-data-ingestion.md)|New article: Private Link for data ingestion for Managed Prometheus and Azure Monitor workspace|
Essentials|[Collect Prometheus metrics from an Arc-enabled Kubernetes cluster (preview)](essentials/prometheus-metrics-from-arc-enabled-cluster.md)|New article: Collect Prometheus metrics from an Arc-enabled Kubernetes cluster (preview)|
Essentials|[How to migrate from the metrics API to the getBatch API](essentials/migrate-to-batch-api.md)|Migrate from the metrics API to the getBatch API|
Essentials|[Azure Active Directory authorization proxy](essentials/prometheus-authorization-proxy.md)|Microsoft Azure Active Directory (Azure AD) auth proxy|
Essentials|[Integrate KEDA with your Azure Kubernetes Service cluster](essentials/integrate-keda.md)|New Article: Integrate KEDA with AKS and Prometheus|
Essentials|[General Availability: Azure Monitor managed service for Prometheus](https://techcommunity.microsoft.com/t5/azure-observability-blog/general-availability-azure-monitor-managed-service-for/ba-p/3817973)|General Availability: Azure Monitor managed service for Prometheus |
Insights|[Monitor and analyze runtime behavior with Code Optimizations (Preview)](insights/code-optimizations.md)|New doc for public preview release of Code Optimizations feature.|
Logs|[Set a table's log data plan to Basic or Analytics](logs/basic-logs-configure.md)|Added Azure Active Directory, Communication Services, Container Apps Environments, and Data Manager for Energy to the list of tables that support Basic logs.|
Logs|[Export data from a Log Analytics workspace to a storage account by using Logic Apps](logs/logs-export-logic-app.md)|Added an Azure Resource Manager template for exporting data from a Log Analytics workspace to a storage account by using Logic Apps.|
Logs|[Set daily cap on Log Analytics workspace](logs/daily-cap.md)|Starting September 18, 2023, the Log Analytics Daily Cap will no longer exclude a set of data types from the daily cap, and all billable data types will be capped if the daily cap is met.|


## April 2023

|Subservice| Article | Description |
|---|---|---|
Agents|[Azure Monitor Agent Performance Benchmark](agents/azure-monitor-agent-performance.md)|Added performance benchmark data for the scenario of using Azure Monitor Agent to forward data to a gateway.|
Agents|[Troubleshoot issues with the Log Analytics agent for Windows](agents/agent-windows-troubleshoot.md)|Log Analytics will no longer accept connections from MMA versions that use old root CAs (MMA versions prior to the Winter 2020 release for Log Analytics agent, and prior to Microsoft System Center Operations Manager 2019 UR3 for Operations Manager). |
Agents|[Azure Monitor Agent overview](agents/agents-overview.md)|Log Analytics agent supports Windows Server 2022. |
Alerts|[Common alert schema](alerts/alerts-common-schema.md)|Updated alert payload common schema to include custom properties.|
Alerts|[Create and manage action groups in the Azure portal](alerts/action-groups.md)|Clarified use of basic auth in webhook.|
Application-Insights|[Application Insights logging with .NET](app/ilogger.md)|We've made it easier to understand where to find iLogger telemetry.|
Application-Insights|[Set up Azure Monitor for your Python application](/previous-versions/azure/azure-monitor/app/opencensus-python)|Updated telemetry type mappings code sample.|
Application-Insights|[Feature extensions for the Application Insights JavaScript SDK (Click Analytics)](app/javascript-feature-extensions.md)|Code samples updated to use connection strings.|
Application-Insights|[Connection strings](app/sdk-connection-string.md)|Code samples updated for .NET 6/7.|
Application-Insights|[Live Metrics: Monitor and diagnose with 1-second latency](app/live-stream.md)|Code samples updated for .NET 6/7.|
Application-Insights|[Geolocation and IP address handling](app/ip-collection.md)|The PowerShell 'Update-AzApplicationInsights' code sample to disable IP masking has been updated.|
Application-Insights|[Application Insights for Worker Service applications (non-HTTP applications)](app/worker-service.md)|The .NET Core app scenario chart has been updated.|
Application-Insights|[Azure AD authentication for Application Insights](app/azure-ad-authentication.md)|Linked information on how to query Application Insights using Azure AD Authentication.|
Application-Insights|[Enable Azure Monitor OpenTelemetry for .NET, Node.js, Python and Java applications](app/opentelemetry-enable.md)|Java guidance and code samples have been updated.|
Autoscale|[Configure autoscale with PowerShell](autoscale/autoscale-using-powershell.md)|New Article:  Configure autoscale using PowerShell|
Autoscale|[Get started with autoscale in Azure](autoscale/autoscale-get-started.md)|Refreshed article|
Containers|[Monitor an Azure Kubernetes Service cluster using Container insights in Azure Monitor](/training/modules/aks-monitor/)|New Learn module: Monitor an Azure Kubernetes Service cluster using Container insights in Azure Monitor.|
Containers|[Manage the Container insights agent](containers/container-insights-manage-agent.md)|Semantic version update of container insights agent version|
Essentials|[Azure Monitor Metrics overview](essentials/data-platform-metrics.md)|New Batch Metrics API that allows multiple resource requests and reducing throttling found in the non-batch version. |
General|[Cost optimization in Azure Monitor](best-practices-cost.md)|Rewritten to match organization of Well Architected Framework service guides|
General|[Best practices for Azure Monitor Logs](best-practices-logs.md)|New article with consolidated list of best practices for Logs organized by WAF pillar.|
General|[Migrate from Operations Manager to Azure Monitor](azure-monitor-operations-manager.md)|Migrate from Operations Manager to Azure Monitor|
Logs|[Application Insights API Access with Microsoft Azure Active Directory (Azure AD) Authentication](app/app-insights-azure-ad-api.md)|New article that explains how to authenticate and access the Azure Monitor Application Insights APIs using Azure AD.|
Logs|[Tutorial: Replace custom fields in Log Analytics workspace with KQL-based custom columns](logs/custom-fields-migrate.md)|Guidance for migrate legacy custom fields to KQL-based custom columns using transformations.|
Logs|[Monitor Log Analytics workspace health](logs/log-analytics-workspace-health.md)|View Log Analytics workspace health metrics, including query success metrics, directly from the Log Analytics workspace screen in the Azure portal.|
Logs|[Set a table's log data plan to Basic or Analytics](logs/basic-logs-configure.md)|Dedicated SQL Pool tables and Kubernetes services tables now support Basic logs.|
Logs|[Set daily cap on Log Analytics workspace](logs/daily-cap.md)|Updated daily cap functionality for workspace-based Application Insights.|
Profiler|[View Application Insights Profiler data](profiler/profiler-data.md)|Clarified this section based on user feedback.|
Snapshot-Debugger|[Debug snapshots on exceptions in .NET apps](snapshot-debugger/snapshot-collector-release-notes.md)|Removed "how to view" sections and move into its own doc.|
Snapshot-Debugger|[Enable Snapshot Debugger for .NET apps in Azure App Service](snapshot-debugger/snapshot-debugger-app-service.md)|Updated link for release notes to the "Release notes" section in the Snapshot Debugger overview.|
Snapshot-Debugger|[View Application Insights Snapshot Debugger data](snapshot-debugger/snapshot-debugger-data.md)|Created this new doc for viewing snapshots from content taken from the overview.|
Snapshot-Debugger|[Enable Snapshot Debugger for .NET and .NET Core apps in Azure Functions](snapshot-debugger/snapshot-debugger-function-app.md)|Updated link for release notes to the "Release notes" section in the Snapshot Debugger overview.|
Snapshot-Debugger|[Troubleshoot problems enabling Application Insights Snapshot Debugger or viewing snapshots](snapshot-debugger/snapshot-debugger-troubleshoot.md)|Updated link for release notes to the "Release notes" section in the Snapshot Debugger overview.|
Snapshot-Debugger|[Enable Snapshot Debugger for .NET apps in Azure Service Fabric, Cloud Service, and Virtual Machines](snapshot-debugger/snapshot-debugger-vm.md)|Updated link for release notes to the "Release notes" section in the Snapshot Debugger overview.|
Snapshot-Debugger|[Debug snapshots on exceptions in .NET apps](snapshot-debugger/snapshot-debugger.md)|Moved the release notes to the end of the Snapshot Debugger overview doc to improve page metrics.|
Snapshot-Debugger|[What's new in Azure Monitor documentation](whats-new.md)|Updated link for release notes to the "Release notes" section in the Snapshot Debugger overview.|
Snapshot-Debugger|[Debug snapshots on exceptions in .NET apps](snapshot-debugger/snapshot-debugger.md)|Updated .NET availability for Snapshot Debugger to avoid ".NET Core" and "LTS" language.|
Snapshot-Debugger|[Debug snapshots on exceptions in .NET apps](snapshot-debugger/snapshot-debugger.md)|Added release notes for the 1.4.4 point release addressing user-reported bugs.|

## March 2023  
  
|Subservice| Article | Description |
|---|---|---|
Alerts|[Manage your alert rules](alerts/alerts-manage-alert-rules.md)|Updated article to reflect that the user can duplicate an existing alert rule.|
Alerts|[Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster by using the Azure portal](../aks/learn/quick-kubernetes-deploy-portal.md)|You can enable recommended alert rules when you create an AKS cluster in the Azure portal. |
Alerts|[Monitor Log Analytics workspace health](logs/log-analytics-workspace-health.md)|If you have a Log Analytics workspace without any configured alert rules, you can enable recommended alert rules from the **Alerts** page of a Log Analytics workspace.|
Alerts|[Connect Azure to ITSM tools by using IT Service Management](alerts/itsmc-definition.md)|Updated the workflow for creating ServiceNow ITSM tickets from an Azure Monitor alert. The article now specifies separate workflows for ITSM actions, incidents, and events.|
Alerts|[Manage your alert rules](alerts/alerts-manage-alert-rules.md)|Recommended alert rules are now enabled for all customers and are no longer in public preview.|
Alerts|[Create a new alert rule](alerts/alerts-create-new-alert-rule.md)|Updated to reflect the updated **Create new alert rule** UI. The alert rule creation wizard clearly indicates the most commonly used resources and signals for their alerts to help users more easily create alert rules.|
Alerts|[Understanding Azure Active Directory Application Proxy Complex application scenario (preview)](../active-directory/app-proxy/application-proxy-configure-complex-application.md)| Updated the documentation for the common schema used in the alerts payload to contain the detailed information about the fields in the payload of each alert type.  |
Alerts|[Supported resources for metric alerts in Azure Monitor](alerts/alerts-metric-near-real-time.md)|Updated list of metrics supported by metric alert rules.|
Alerts|[Create and manage action groups in the Azure portal](alerts/action-groups.md)|Updated the documentation explaining the retry logic used in action groups that use webhooks.|
Alerts|[Create and manage action groups in the Azure portal](alerts/action-groups.md)|Added list of countries/regions supported by voice notifications.|
Alerts|[Connect ServiceNow to Azure Monitor](alerts/itsmc-secure-webhook-connections-servicenow.md)|Added Tokyo to list of supported ServiceNow webhook integrations.|
Application-Insights|[Application Insights SDK support guidance](app/sdk-support-guidance.md)|Release notes are now available for each SDK.|
Application-Insights|[What is distributed tracing and telemetry correlation?](app/distributed-tracing-telemetry-correlation.md)|Merged our documents related to distributed tracing and telemetry correlation.|
Application-Insights|[Application Insights availability tests](app/availability-overview.md)|Separated and called out the two Classic Tests, which are older versions of availability tests.|
Application-Insights|[Microsoft Azure Monitor Application Insights JavaScript SDK configuration](app/javascript-sdk-configuration.md)|JavaScript SDK configuration now includes npm setup, cookie configuration and management, source map un-minify support, and tree shaking optimized code.|
Application-Insights|[Microsoft Azure Monitor Application Insights JavaScript SDK](app/javascript-sdk.md)|Our introductory article to the JavaScript SDK now provides only the fast and easy code-snippet method of getting started.|
Application-Insights|[Geolocation and IP address handling](app/ip-collection.md)|Updated code samples for .NET 6/7.|
Application-Insights|[Application Insights logging with .NET](app/ilogger.md)|Updated code samples for .NET 6/7.|
Application-Insights|[Azure Monitor overview](overview.md)|Updated Azure Monitor overview graphics along with related content.|
Containers|[Metric alert rules in Container insights (preview)](containers/container-insights-metric-alerts.md)|Updated to indicate deprecation of metric alerts.|
Containers|[Azure Monitor Container insights for Azure Arc-enabled Kubernetes clusters](containers/container-insights-enable-arc-enabled-clusters.md)|Added option for Azure Monitor Private Link Scope (AMPLS) + Proxy.|
Essentials|[Collect Prometheus metrics from an AKS cluster (preview)](essentials/prometheus-metrics-enable.md)|Enabled Windows metric collection metrics add-on.|
Essentials|[Query Prometheus metrics by using the API and PromQL](essentials/prometheus-api-promql.md)|New article: Query Azure Monitor workspaces by using REST and PromQL.|
Essentials|[Configure remote write for Azure Monitor managed service for Prometheus by using Azure Active Directory authentication (preview)](essentials/prometheus-remote-write-active-directory.md)|Added Prometheus remote write Active Directory relabel.|
Essentials|[Built-in policies for Azure Monitor](essentials/diagnostics-settings-policies-deployifnotexists.md)|Added new built-in policies to create diagnostic settings in Azure Monitor with deploy-if-not-exists defaults.|
Logs|[Logs Ingestion API in Azure Monitor](logs/logs-ingestion-api-overview.md)|Updated to include client libraries.|
Logs|[Tutorial: Send data to Azure Monitor by using the Logs Ingestion API (Azure Resource Manager templates)](logs/tutorial-logs-ingestion-api.md)|Rewritten to be more consistent with related tutorial.|
Logs|[Sample code to send data to Azure Monitor by using the Logs Ingestion API](logs/tutorial-logs-ingestion-code.md)|New article: Sample code to send data by using the Logs Ingestion API, including new client ingestion libraries for Python, .NET, Java, and JavaScript.|
Logs|[Tutorial: Send data to Azure Monitor Logs with the Logs Ingestion API (Azure portal)](logs/tutorial-logs-ingestion-portal.md)|Rewritten to be more consistent with related tutorial.|
Snapshot-Debugger|[Enable Profiler for ASP.NET Core web applications hosted in Linux on Azure App Service](profiler/profiler-aspnetcore-linux.md)|Updated code snippets from .NET 5 to .NET 6.|
Snapshot-Debugger|[Enable Snapshot Debugger for .NET apps in Azure Service Fabric, Azure Cloud Services, and Azure Virtual Machines](snapshot-debugger/snapshot-debugger-vm.md)|Updated code snippets from .NET 5 to .NET 6.|

|Subservice| Article | Description |
|---|---|---|
Agents|[Azure Monitor Agent extension versions](agents/azure-monitor-agent-extension-versions.md)|Added release notes for the Azure Monitor Agent Linux 1.25 release.|
Agents|[Migrate to Azure Monitor Agent from the Log Analytics agent](agents/azure-monitor-agent-migration.md)|Updated guidance for migrating from Log Analytics agent to Azure Monitor Agent.|
Alerts|[Manage your alert rules](alerts/alerts-manage-alert-rules.md)|Included limitation and workaround for resource health alerts. If you apply a target resource type scope filter to the **Alerts rules** page, the alerts rules list doesn’t include resource health alert rules.|
Alerts|[Customize alert notifications by using Azure Logic Apps](alerts/alerts-logic-apps.md)|Added instructions for other customizations that you can include when you use Logic Apps to create alert notifications. You can extract information about the affected resource from the resource's tags. Then you can include the resource tags in the alert payload and use the information in your logical expressions that are used for creating the notifications.|
Alerts|[Create and manage action groups in the Azure portal](alerts/action-groups-create-resource-manager-template.md)|Combined two articles about creating action groups into one article.|
Alerts|[Create and manage action groups in the Azure portal](alerts/action-groups.md)|Clarified that you can't pass security certificates in a webhook action in action groups.|
Alerts|[Create a new alert rule](alerts/alerts-create-new-alert-rule.md)|Added information about adding custom properties to the alert payload when you use action groups.|
Alerts|[Manage your alert instances](alerts/alerts-manage-alert-instances.md)|Removed option for managing alert instances by using the Azure CLI.|
Application-Insights|[Migrate to workspace-based Application Insights resources](app/convert-classic-resource.md)|Added the continuous export deprecation notice to this article for more visibility. We recommend migrating to workspace-based Application Insights resources as soon as possible to take advantage of new features.|
Application-Insights|[Application Insights API for custom events and metrics](app/api-custom-events-metrics.md)|Consolidated client-side JavaScript SDK extensions into two new articles called *Framework extensions* and *Feature extensions*. We've also created new standalone *Upgrade* and *Troubleshooting* articles.|
Application-Insights|[Monitor Azure Functions with Azure Monitor Application Insights](app/monitor-functions.md)|Overhauled the documentation on Azure Functions integration with Application Insights.|
Application-Insights|[Enable Azure Monitor OpenTelemetry for .NET, Node.js, Python, and Java applications](app/opentelemetry-enable.md)|Updated Java OpenTelemetry examples.|
Application-Insights|[Application monitoring for Azure App Service and Java](app/azure-web-apps-java.md)|Updated and separated out the instructions to manually deploy the latest Application Insights Java version.|
Containers|[Enable Container insights for Azure Kubernetes Service (AKS) clusters](containers/container-insights-enable-aks.md)|Added a section for enabling a private link without managed identity authentication.|
Containers|[Syslog collection with Container insights (preview)](containers/container-insights-syslog.md)|Added use of Azure Resource Manager templates for enabling Syslog collection.|
Containers|[Enable cost-optimization settings (preview)](containers/container-insights-cost-config.md)|New article: Enable cost-optimization settings.|
Essentials|[Data collection transformations in Azure Monitor](essentials/data-collection-transformations.md)|Added section and sample for using transformations to send to multiple destinations.|
Essentials|[Custom metrics in Azure Monitor (preview)](essentials/metrics-custom-overview.md)|Added reference to the limit of 64 KB on the combined length of all custom metrics names.|
Essentials|[Azure monitoring REST API walkthrough](essentials/rest-api-walkthrough.md)|Refreshed REST API walkthrough.|
Essentials|[Collect Prometheus metrics from AKS cluster (preview)](essentials/prometheus-metrics-enable.md)|Added enabling Prometheus metric collection by using Azure Policy and Bicep.|
Essentials|[Send Prometheus metrics to multiple Azure Monitor workspaces (preview)](essentials/prometheus-metrics-multiple-workspaces.md)|Updated sending metrics to multiple Azure Monitor workspaces.|
General|[Analyze and visualize data](best-practices-analysis.md)|Revised the article about analyzing and visualizing monitoring data to provide a comparison of the different visualization tools and guide customers on when to choose each tool for their implementation. |
Logs|[Tutorial: Send data to Azure Monitor Logs by using the REST API (Resource Manager templates)](logs/tutorial-logs-ingestion-api.md)|Made minor fixes and updated sample data.|
Logs|[Analyze usage in a Log Analytics workspace](logs/analyze-usage.md)|Added query for data that has the IsBillable indicator set incorrectly, which could result in incorrect billing.|
Logs|[Add or delete tables and columns in Azure Monitor Logs](logs/create-custom-table.md)|Added custom column naming limitations.|
Logs|[Enhance data and service resilience in Azure Monitor Logs with availability zones](logs/availability-zones.md)|Clarified availability zone support for data resilience and service resilience and added new supported regions.|
Logs|[Monitor Log Analytics workspace health](logs/log-analytics-workspace-health.md)|New article: Explains how to monitor the service and resource health of a Log Analytics workspace.|
Logs|[Feature extensions for Application Insights JavaScript SDK (Click Analytics)](app/javascript-click-analytics-plugin.md)|You can now launch Power BI and create a dataset and report connected to a Log Analytics query with one click.|
Logs|[Set a table's log data plan to Basic or Analytics](logs/basic-logs-configure.md)|Added new tables to the list of tables that support Basic Logs.|
Logs|[Manage tables in a Log Analytics workspace]()|Refreshed all Log Analytics workspace images with the new TOC on the left.|
Security-Fundamentals|[Monitoring Azure App Service](../../articles/app-service/monitor-app-service.md)|Revised the Azure Monitor overview to improve usability. The article is cleaned up, streamlined, and better reflects the product architecture and the customer experience. |
Snapshot-Debugger|[host.json reference for Azure Functions 2.x and later](../../articles/azure-functions/functions-host-json.md)|Removing the TSG from the Azure Monitor TOC and adding to the support TOC.|
Snapshot-Debugger|[Configure Bring Your Own Storage (BYOS) for Application Insights Profiler and Snapshot Debugger](profiler/profiler-bring-your-own-storage.md)|Removing the TSG from the Azure Monitor TOC and adding to the support TOC.|
Snapshot-Debugger|[Release notes for Microsoft.ApplicationInsights.SnapshotCollector](./snapshot-debugger/snapshot-debugger.md#release-notes-for-microsoftapplicationinsightssnapshotcollector)|Removing the TSG from the Azure Monitor TOC and adding to the support TOC.|
Snapshot-Debugger|[Enable Snapshot Debugger for .NET apps in Azure App Service](snapshot-debugger/snapshot-debugger-app-service.md)|Removing the TSG from the Azure Monitor TOC and adding to the support TOC.|
Snapshot-Debugger|[Enable Snapshot Debugger for .NET and .NET Core apps in Azure Functions](snapshot-debugger/snapshot-debugger-function-app.md)|Removing the TSG from the Azure Monitor TOC and adding to the support TOC.|
Snapshot-Debugger|[Troubleshoot problems enabling Application Insights Snapshot Debugger or viewing snapshots](/troubleshoot/azure/azure-monitor/app-insights/snapshot-debugger-troubleshoot)|Removing the TSG from the Azure Monitor TOC and adding to the support TOC.|
Snapshot-Debugger|[Enable Snapshot Debugger for .NET apps in Azure Service Fabric, Azure Cloud Services, and Virtual Machines](snapshot-debugger/snapshot-debugger-vm.md)|Removing the TSG from the Azure Monitor TOC and adding to the support TOC.|
Snapshot-Debugger|[Debug snapshots on exceptions in .NET apps](snapshot-debugger/snapshot-debugger.md)|Removing the TSG from the Azure Monitor TOC and adding to the support TOC.|
Virtual-Machines|[Monitor virtual machines with Azure Monitor: Analyze monitoring data](vm/monitor-virtual-machine-analyze.md)|New article.|
Visualizations|[Use JSONPath to transform JSON data in workbooks](visualize/workbooks-jsonpath.md)|Added information about using JSONPath to convert data types in Azure Workbooks.|
Containers|[Configure Container insights cost-optimization data collection rules](containers/container-insights-cost-config.md)|New article: Preview of cost-optimization settings.|

## January 2023

|Subservice| Article | Description |
|---|---|---|
Agents|[Tutorial: Transform text logs during ingestion in Azure Monitor Logs](agents/azure-monitor-agent-transformation.md)|New tutorial: How to write a KQL query that transforms text log data and add the transformation to a data collection rule.|
Agents|[Azure Monitor Agent overview](agents/agents-overview.md)|SQL Best Practices Assessment now available with Azure Monitor Agent.|
Alerts|[Create a new alert rule](alerts/alerts-create-new-alert-rule.md)|Streamlined alerts documentation added the common schema definition to the common schema article, and moved sample Resource Manager templates for alerts to the "Samples" section.|
Alerts|[Non-common alert schema definitions for Test Action Group (preview)](alerts/alerts-non-common-schema-definitions.md)|Added a sample payload for the Actual Cost and Forecasted Budget schemas.|
Application-Insights|[Live Metrics: Monitor and diagnose with 1-second latency](app/live-stream.md)|Updated Live Metrics "Troubleshooting" section.|
Application-Insights|[Application Insights for Azure Virtual Machines and Azure Virtual Machine Scale Sets](app/azure-vm-vmss-apps.md)|Easily monitor your IIS-hosted .NET Framework and .NET Core applications running on Azure Virtual Machines and Azure Virtual Machine Scale Sets by using a new App Insights extension.|
Application-Insights|[Sampling in Application Insights](app/sampling.md)|Added embedded links to assist with looking up type definitions (dependency, event, exception, PageView, request, and trace).|
Application-Insights|[Configuration options: Azure Monitor Application Insights for Java](app/java-standalone-config.md)|Instructions are now available on how to set the HTTP proxy by using an environment variable, which overrides the JSON configuration. We've also provided a sample to configure connection string at runtime.|
Application-Insights|[Application Insights for Java 2.x](/previous-versions/azure/azure-monitor/app/deprecated-java-2x)|The Java 2.x retirement notice is available at [https://azure.microsoft.com/updates/application-insights-java-2x-retirement](https://azure.microsoft.com/updates/application-insights-java-2x-retirement).|
Autoscale|[Diagnostic settings in autoscale](autoscale/autoscale-diagnostics.md)|Updated and expanded content.|
Autoscale|[Overview of common autoscale patterns](autoscale/autoscale-common-scale-patterns.md)|Clarification of weekend profiles.|
Autoscale|[Autoscale with multiple profiles](autoscale/autoscale-multiprofile.md)|Added clarifications for profile end times.|
Change-Analysis|[Scenarios for using Change Analysis in Azure Monitor](change/change-analysis-custom-filters.md)|Merged two low-engagement docs into Visualizations article and removed from TOC.|
Change-Analysis|[Scenarios for using Change Analysis in Azure Monitor](change/change-analysis-query.md)|Merged two low-engagement docs into Visualizations article and removed from TOC.|
Change-Analysis|[Scenarios for using Change Analysis in Azure Monitor](change/change-analysis-visualizations.md)|Merged two low-engagement docs into Visualizations article and removed from TOC.|
Change-Analysis|[Track a web app outage by using Change Analysis](change/tutorial-outages.md)|Added new section on virtual network changes to the tutorial.|
Containers|[Azure Monitor container insights for Azure Kubernetes Service hybrid clusters (preview)](containers/container-insights-enable-provisioned-clusters.md)|New article.|
Containers|[Syslog collection with Container insights (preview)](containers/container-insights-syslog.md)|New article.|
Essentials|[Query Prometheus metrics by using Azure Workbooks (preview)](essentials/prometheus-workbooks.md)|New article.|
Essentials|[Azure Workbooks data sources](visualize/workbooks-data-sources.md)|Added section for Prometheus metrics.|
Essentials|[Query Prometheus metrics by using Azure Workbooks (preview)](essentials/prometheus-workbooks.md)|New article.|
Essentials|[Azure Monitor workspace (preview)](essentials/azure-monitor-workspace-overview.md)|Updated design considerations.|
Essentials|[Supported metrics with Azure Monitor](essentials/metrics-supported.md)|Updated and refreshed the list of supported metrics.|
Essentials|[Supported categories for Azure Monitor resource logs](essentials/resource-logs-categories.md)|Updated and refreshed the list of supported logs.|
General|[Multicloud monitoring with Azure Monitor](best-practices-multicloud.md)|New article.|
Logs|[Set daily cap on Log Analytics workspace](logs/daily-cap.md)|Clarified special case for daily cap logic.|
Logs|[Send custom metrics for an Azure resource to the Azure Monitor metric store by using a REST API](essentials/metrics-store-custom-rest-api.md)|Updated and refreshed how to send custom metrics.|
Logs|[Migrate from Splunk to Azure Monitor Logs](logs/migrate-splunk-to-azure-monitor-logs.md)|New article: Explains how to migrate your Splunk Observability deployment to Azure Monitor Logs for logging and log data analysis.|
Logs|[Manage access to Log Analytics workspaces](logs/manage-access.md)|Added permissions required to run a search job and restore archived data.|
Logs|[Set a table's log data plan to Basic or Analytics](logs/basic-logs-configure.md)|Added information about how to modify a table schema by using the API.|
Snapshot-Debugger|[Enable Snapshot Debugger for .NET apps in Azure App Service](snapshot-debugger/snapshot-debugger-app-service.md)|Per customer feedback, added new note that Consumption plan isn't supported.|
Virtual-Machines|[Collect IIS logs with Azure Monitor Agent](agents/data-collection-iis.md)|Added sample log queries.|
Virtual-Machines|[Collect text logs with Azure Monitor Agent](agents/data-collection-text-log.md)|Added sample log queries.|
Virtual-Machines|[Monitor virtual machines with Azure Monitor: Deploy agent](vm/monitor-virtual-machine-agent.md)|Rewritten for Azure Monitor Agent.|
Virtual-Machines|[Monitor virtual machines with Azure Monitor: Alerts](vm/monitor-virtual-machine-alerts.md)|Rewritten for Azure Monitor Agent.|
Virtual-Machines|[Monitor virtual machines with Azure Monitor: Analyze monitoring data](vm/monitor-virtual-machine-analyze.md)|Rewritten for Azure Monitor Agent.|
Virtual-Machines|[Monitor virtual machines with Azure Monitor: Collect data](vm/monitor-virtual-machine-data-collection.md)|Rewritten for Azure Monitor Agent.|
Virtual-Machines|[Monitor virtual machines with Azure Monitor: Migrate management pack logic](vm/monitor-virtual-machine-management-packs.md)|Rewritten for Azure Monitor Agent.|
Virtual-Machines|[Monitor virtual machines with Azure Monitor](vm/monitor-virtual-machine.md)|Rewritten for Azure Monitor Agent.|
Virtual-Machines|[Monitor Azure virtual machines](../../articles/virtual-machines/monitor-vm.md)|VM scenario updates for Azure Monitor Agent.|

## December 2022

|Subservice| Article | Description |
|---|---|---|
General|[Azure Monitor for existing Operations Manager customers](azure-monitor-operations-manager.md)|Updated for Azure Monitor Agent and System Center Operations Manager managed instance.|
Application-Insights|[Create an Application Insights resource](/previous-versions/azure/azure-monitor/app/create-new-resource)|Classic Application Insights resources are deprecated. Support ends on February 29, 2024. Migrate to workspace-based resources to take advantage of new capabilities.|
Application-Insights|[Enable Azure Monitor OpenTelemetry for .NET, Node.js, and Python applications (preview)](app/opentelemetry-enable.md)|Updated Node.js sample code for JavaScript and TypeScript.|
Application-Insights|[System performance counters in Application Insights](app/performance-counters.md)|Updated code samples for .NET 6/7.|
Application-Insights|[Sampling in Application Insights](app/sampling.md)|Updated code samples for .NET 6/7.|
Application-Insights|[Availability alerts](app/availability-alerts.md)|Rewritten with new guidance and screenshots.|
Change-Analysis|[Tutorial: Track a web app outage by using Change Analysis](change/tutorial-outages.md)|Changed tutorial content to reflect changes to repo and removed and replaced sections.|
Containers|[Configure Azure CNI networking in Azure Kubernetes Service](../../articles/aks/configure-azure-cni.md)|Added steps to enable IP subnet usage.|
Containers|[Reports in Container insights](containers/container-insights-reports.md)|Updated to reflect the steps to enable IP subnet usage.|
Essentials|[Best practices for data collection rule creation and management in Azure Monitor](essentials/data-collection-rule-best-practices.md)|New article.|
Essentials|[Configure self-managed Grafana to use Azure Monitor managed service for Prometheus (preview) with Azure Active Directory](essentials/prometheus-self-managed-grafana-azure-active-directory.md)|New article: Configured self-managed Grafana to use Azure Monitor managed service for Prometheus (preview) with Azure Active Directory.|
Logs|[Azure Monitor SCOM Managed Instance (preview)](vm/scom-managed-instance-overview.md)|New article.|
Logs|[Set a table's log data plan to Basic or Analytics](logs/basic-logs-configure.md)|Updated the list of tables that support Basic Logs.|
Virtual-Machines|[Tutorial: Create availability alert rule for Azure virtual machine (preview)](vm/tutorial-monitor-vm-alert-availability.md)|New article.|
Virtual-Machines|[Tutorial: Enable recommended alert rules for Azure virtual machine](vm/tutorial-monitor-vm-alert-recommended.md)|New article.|
Virtual-Machines|[Tutorial: Enable monitoring with VM insights for Azure virtual machine](vm/tutorial-monitor-vm-enable-insights.md)|New article.|
Virtual-Machines|[Monitor Azure virtual machines](../../articles/virtual-machines/monitor-vm.md)|Updated for Azure Monitor Agent and availability metric.|
Virtual-Machines|[Enable VM insights by using Azure Policy](vm/vminsights-enable-policy.md)|Updated flow for enabling VM insights with Azure Monitor Agent by using Azure Policy.|
Visualizations|[Creating an Azure Workbook](visualize/workbooks-create-workbook.md)|Added tutorial on resource-centric log queries in workbooks.|

## November 2022

|Subservice| Article | Description |
|---|---|---|
General|[Cost optimization and Azure Monitor](best-practices-cost.md)|Rewritten to align with Azure Well-Architected Framework. Moved detailed content to other articles and linked from here.|
Agents|[Collect SNMP trap data with Azure Monitor Agent](agents/data-collection-snmp-data.md)|New tutorial: Explains how to collect Simple Network Management Protocol (SNMP) traps by using Azure Monitor Agent.|
Alerts|[Create a new alert rule](alerts/alerts-create-new-alert-rule.md)|Resource Health alerts and Service Health alerts are created by using the same simplified workflow as all other alert types.|
Alerts|[Manage your alert rules](alerts/alerts-manage-alert-rules.md)|Recommended alert rules are enabled for Azure Kubernetes Service and Log Analytics workspace resources in addition to VMs.|
Application-insights|[Sampling in Application Insights](app/sampling.md)|ASP.NET Core applications can be configured in code or through the `appsettings.json` file. Removed conflicting information.|
Application-insights|[How many Application Insights resources should I deploy?](app/separate-resources.md)|Added clarification on setting iKey dynamically in code.|
Application-insights|[Application Map: Triage distributed applications](app/app-map.md)|Documented App Map Filters, an exciting new feature.|
Application-insights|[Enable Application Insights for ASP.NET Core applications](app/tutorial-asp-net-core.md)|The Azure Café sample app is now hosted and linked on Git.|
Application-insights|[What is auto-instrumentation for Azure Monitor Application Insights?](app/codeless-overview.md)|Updated the auto-instrumentation supported languages chart.|
Application-insights|[Application monitoring for Azure App Service and ASP.NET](app/azure-web-apps-net.md)|Corrected links to check versions.|
Application-insights|[Sampling overrides (preview) - Azure Monitor Application Insights for Java](app/java-standalone-sampling-overrides.md)|Updated OpenTelemetry Span information for Java.|
Autoscale|[Understand autoscale settings](autoscale/autoscale-understanding-settings.md)|Refreshed and updated.|
Autoscale|[Overview of common autoscale patterns](autoscale/autoscale-common-scale-patterns.md)|Refreshed and updated.|
Essentials|[Azure Monitor managed service for Prometheus (preview)](essentials/prometheus-metrics-scrape-default.md)|Restructured Prometheus content.|
Essentials|[Configure remote write for Azure Monitor managed service for Prometheus by using Azure Active Directory authentication (preview)](essentials/prometheus-remote-write.md)|New article.|
Essentials|[Azure Monitor workspace (preview)](essentials/azure-monitor-workspace-overview.md)|Added Bicep example.|
Essentials|[Migrate from diagnostic settings storage retention to Azure Storage lifecycle management](essentials/migrate-to-azure-storage-lifecycle-policy.md)|Added deprecation note.|
Essentials|[Diagnostic settings in Azure Monitor](essentials/diagnostic-settings.md)|All destination endpoints support TLS 1.2.|
Logs|[Cost optimization and Azure Monitor](best-practices-cost.md)|Added cost information and removed preview label.|
Logs|[Diagnostic settings in Azure Monitor](essentials/diagnostic-settings.md)|Added section on controlling costs with transformations.|
Logs|[Analyze usage in a Log Analytics workspace](logs/analyze-usage.md)|Added Kusto Query Language query that retrieves data volumes for charged data types.|
Logs|[Access the Azure Monitor Log Analytics API](logs/api/timeouts.md)|Refreshed and updated.|
Logs|[Collect text logs with the Log Analytics agent in Azure Monitor](agents/data-sources-custom-logs.md)|Added new table management section with new articles on table configuration options, schema management, and custom table creation.|
Logs|[Azure Monitor Metrics overview](essentials/data-platform-metrics.md)| Added a new Azure SDK client library for Go.|
Logs|[Azure Monitor Log Analytics API overview](logs/api/overview.md)| Added a new Azure SDK client library for Go.|
Logs|[Azure Monitor Logs overview](logs/data-platform-logs.md)| Added a new Azure SDK client library for Go.|
Logs|[Log queries in Azure Monitor](logs/log-query-overview.md)| Added a new Azure SDK client library for Go.|
Logs|[Set a table's log data plan to Basic or Analytics](logs/basic-logs-configure.md)|Added new tables to the list of tables that support the Basic Log data plan.|
Visualizations|[Monitor your Azure services in Grafana](visualize/grafana-plugin.md)|The Grafana integration is generally available and is no longer in preview.|
Visualizations|[Get started with Azure Workbooks](visualize/workbooks-getting-started.md)|Added instructions for how to share workbooks.|

## October 2022

|Subservice| Article | Description |
|---|---|---|
|General|Table of contents|Updated the Azure Monitor table of contents (TOC). The new TOC structure better reflects the customer experience and makes it easier for users to navigate and discover our content.|
Alerts|[Connect Azure to ITSM tools by using IT Service Management](./alerts/itsmc-definition.md)|Deprecating support for sending ITSM actions and events to ServiceNow. Instead, use ITSM actions in action groups based on Azure alerts to create work items in your ITSM tool.|
Alerts|[Create a new alert rule](./alerts/alerts-create-new-alert-rule.md)|New PowerShell commands to create and manage log alerts.|
Alerts|[Types of Azure Monitor alerts](alerts/alerts-types.md)|Updated to include Prometheus alerts.|
Alerts|[Customize alert notifications by using Logic Apps](./alerts/alerts-logic-apps.md)|New article: Use alerts to send emails or Teams posts by using Logic Apps.|
Application-insights|[Sampling in Application Insights](./app/sampling.md)|Prioritized the "When to use sampling" and "How sampling works" sections as prerequisite information for the article.|
Application-insights|[What is auto-instrumentation for Azure Monitor Application Insights?](./app/codeless-overview.md)|Overhauled the auto-instrumentation overview with links and footnotes.|
Application-insights|[Enable Azure Monitor OpenTelemetry for .NET, Node.js, and Python applications (preview)](./app/opentelemetry-enable.md)|Open Telemetry Metrics are now available for .NET, Node.js and Python applications.|
Application-insights|[Find and diagnose performance issues with Application Insights](./app/tutorial-performance.md)|Replaced the URL Ping (Classic) Test with Standard Test step-by-step instructions.|
Application-insights|[Application Insights API for custom events and metrics](./app/api-custom-events-metrics.md)|Added flushing information to the FAQ.|
Application-insights|[Azure AD authentication for Application Insights](./app/azure-ad-authentication.md)|Updated the `TelemetryConfiguration` code sample by using .NET.|
Application-insights|[Using Azure Monitor Application Insights with Spring Boot](./app/java-spring-boot.md)|Updated the Spring Boot information to 3.4.2.|
Application-insights|[Configuration options: Azure Monitor Application Insights for Java](./app/java-standalone-config.md)|Added new features on Capture Log4j Markers and Logback Markers as custom properties on the corresponding trace (log message) telemetry.|
Application-insights|[Create custom KPI dashboards by using Application Insights](./app/tutorial-app-dashboards.md)|Refreshed with new screenshots and instructions.|
Application-insights|[Share Azure dashboards by using Azure role-based access control](../azure-portal/azure-portal-dashboard-share-access.md)|Refreshed with new screenshots and instructions.|
Application-insights|[Application monitoring for Azure App Service and ASP.NET](./app/azure-web-apps-net.md)|Added important notes about System.IO.FileNotFoundException after an 2.8.44 auto-instrumentation upgrade.|
Application-insights|[Geolocation and IP address handling](./app/ip-collection.md)| Updated geolocation lookup information.|
Containers|[Metric alert rules in Container insights (preview)](./containers/container-insights-metric-alerts.md)|Updated to include Container insights metric alerts.|
Containers|[Custom metrics collected by Container insights](containers/container-insights-custom-metrics.md?tabs=portal)|New article.|
Containers|[Overview of Container insights in Azure Monitor](containers/container-insights-overview.md)|Rewritten to simplify onboarding options.|
Containers|[Enable Container insights for Azure Kubernetes Service cluster](containers/container-insights-enable-aks.md?tabs=azure-cli)|Updated to combine new and existing clusters.|
Containers Prometheus|[Query logs from Container insights](containers/container-insights-log-query.md)|Updated to include log queries for Prometheus data.|
Containers Prometheus|[Collect Prometheus metrics with Container insights](containers/container-insights-prometheus.md?tabs=cluster-wide)|Updated to include Azure Monitor managed service for Prometheus.|
Essentials Prometheus|[Metrics in Azure Monitor](essentials/data-platform-metrics.md)|Updated to include Azure Monitor managed service for Prometheus.|
Essentials Prometheus|<ul> <li> [Azure Monitor workspace overview (preview)](essentials/azure-monitor-workspace-overview.md?tabs=azure-portal) </li><li> [Overview of Azure Monitor managed service for Prometheus (preview)](essentials/prometheus-metrics-overview.md) </li><li>[Rule groups in Azure Monitor managed service for Prometheus (preview)](essentials/prometheus-rule-groups.md)</li><li>[Remote-write in Azure Monitor managed service for Prometheus (preview)](essentials/prometheus-remote-write-managed-identity.md) </li><li>[Use Azure Monitor managed service for Prometheus (preview) as data source for Grafana](essentials/prometheus-grafana.md)</li><li>[Troubleshoot collection of Prometheus metrics in Azure Monitor (preview)](essentials/prometheus-metrics-troubleshoot.md)</li><li>[Default Prometheus metrics configuration in Azure Monitor (preview)](essentials/prometheus-metrics-scrape-default.md)</li><li>[Scrape Prometheus metrics at scale in Azure Monitor (preview)](essentials/prometheus-metrics-scrape-scale.md)</li><li>[Customize scraping of Prometheus metrics in Azure Monitor (preview)](essentials/prometheus-metrics-scrape-configuration.md)</li><li>[Create, validate, and troubleshoot custom configuration file for Prometheus metrics in Azure Monitor (preview)](essentials/prometheus-metrics-scrape-validate.md)</li><li>[Minimal Prometheus ingestion profile in Azure Monitor (preview)](essentials/prometheus-metrics-scrape-configuration-minimal.md)</li><li>[Collect Prometheus metrics from AKS cluster (preview)](essentials/prometheus-metrics-enable.md)</li><li>[Send Prometheus metrics to multiple Azure Monitor workspaces (preview)](essentials/prometheus-metrics-multiple-workspaces.md) </li></ul> |New articles: Public preview of Azure Monitor managed service for Prometheus.|
Essentials Prometheus|[Azure Monitor managed service for Prometheus remote write - managed identity (preview)](./essentials/prometheus-remote-write-managed-identity.md)|Added information that verifies Prometheus remote write is working correctly.|
Essentials|[Azure resource logs](./essentials/resource-logs.md)|Clarified which blob's logs are written to, and when.|
Essentials|[Resource Manager template samples for Azure Monitor](resource-manager-samples.md?tabs=portal)|Added template deployment methods.|
Essentials|[Azure Monitor service limits](service-limits.md)|Added Azure Monitor managed service for Prometheus.|
Logs|[Manage access to Log Analytics workspaces](./logs/manage-access.md)|Table-level role-based access control lets you give specific users or groups read access to particular tables.|
Logs|[Configure Basic Logs in Azure Monitor](./logs/basic-logs-configure.md)|Added information on general availability of the Basic Logs data plan, retention and archiving, search job, and the table management user experience in the Azure portal.|
Logs|[Guided project - Analyze logs in Azure Monitor with KQL - Training](/training/modules/analyze-logs-with-kql/)|New Learn module: Learn to write KQL queries to retrieve and transform log data to answer common business and operational questions.|
Logs|[Detect and analyze anomalies with KQL in Azure Monitor](logs/kql-machine-learning-azure-monitor.md)|New tutorial: Walkthrough of how to use KQL for time-series analysis and anomaly detection in Azure Monitor Log Analytics. |
Virtual-machines|[Enable VM insights for a hybrid virtual machine](./vm/vminsights-enable-hybrid.md)|Updated versions of standalone installers.|
Visualizations|[Retrieve legacy Application Insights workbooks](./visualize/workbooks-retrieve-legacy-workbooks.md)|New article: Access legacy workbooks in the Azure portal.|
Visualizations|[Azure Workbooks](./visualize/workbooks-overview.md)|New video to see how you can use Azure Workbooks to get insights and visualize your data. |

## September 2022

### Agents

| Article | Description |
|---|---|
|[Azure Monitor Agent overview](./agents/agents-overview.md)|Added Azure Monitor Agent support for ARM64-based virtual machines for a number of distributions. <br><br>Azure Monitor Agent and legacy agents don't support machines and appliances that run heavily customized or stripped-down versions of operating system distributions. <br><br>Azure Monitor Agent versions 1.15.2 and higher now support Syslog RFC formats, including Cisco Meraki, Cisco ASA, Cisco FTD, Sophos XG, Juniper Networks, Corelight Zeek, CipherTrust, NXLog, McAfee, and Common Event Format (CEF).|

### Alerts

| Article | Description |
|---|---|
|[Convert ITSM actions that send events to ServiceNow to Secure Webhook actions](./alerts/itsm-convert-servicenow-to-webhook.md)|As of September 2022, we're starting the three-year process of deprecating support of using ITSM actions to send events to ServiceNow. Learn how to convert ITSM actions that send events to ServiceNow to Secure Webhook actions.|
|[Create a new alert rule](./alerts/alerts-create-new-alert-rule.md)|Added description of all available monitoring services to **Create a new alert rule** and **Alert processing rules** pages. <br><br>Added support for regional processing for metric alert rules that monitor a custom metric with the scope defined as one of the supported regions. <br><br> Clarified that selecting the **Automatically resolve alerts** setting makes log alerts stateful.|
|[Types of Azure Monitor alerts](alerts/alerts-types.md)|Azure Database for PostgreSQL - Flexible Servers is supported for monitoring multiple resources.|
|[Upgrade legacy rules management to the current Log Alerts API from legacy Log Analytics Alert API](./alerts/alerts-log-api-switch.md)|The process of moving legacy log alert rules management from the legacy API to the current API is now supported by the government cloud.|

### Application Insights

| Article | Description |
|---|---|
|[Azure Monitor OpenTelemetry-based auto-instrumentation for Java applications](./app/opentelemetry-enable.md?tabs=java)|Added new OpenTelemetry `@WithSpan` annotation guidance.|
|[Capture Application Insights custom metrics with .NET and .NET Core](./app/tutorial-asp-net-custom-metrics.md)|Updated tutorial steps and images.|
|[Configuration options: Azure Monitor Application Insights for Java](./app/opentelemetry-enable.md)|Updated connection string guidance.|
|[Enable Application Insights for ASP.NET Core applications](./app/tutorial-asp-net-core.md)|Updated tutorial steps and images.|
|[Enable Azure Monitor OpenTelemetry Exporter for .NET, Node.js, and Python applications (preview)](./app/opentelemetry-enable.md)|Fixed the product feedback link at the bottom of each document.|
|[Filter and preprocess telemetry in the Application Insights SDK](./app/api-filtering-sampling.md)|Added sample initializer to control which client IP gets used as part of geo-location mapping.|
|[Java Profiler for Azure Monitor Application Insights](./app/java-standalone-profiler.md)|Announced the new Java Profiler at Ignite. Read all about it.|
|[Release notes for Azure Web App extension for Application Insights](./app/web-app-extension-release-notes.md)|Added release notes for 2.8.44 and 2.8.43.|
|[Resource Manager template samples for creating Application Insights resources](./app/resource-manager-app-resource.md)|Fixed inaccurate tagging of workspace-based resources as still in preview.|
|[Unified cross-component transaction diagnostics](./app/transaction-diagnostics.md)|Added a FAQ section to help troubleshoot Azure portal errors like "error retrieving data."|
|[Upgrading from Application Insights Java 2.x SDK](./app/java-standalone-upgrade-from-2x.md)|Added more upgrade guidance. Java 2.x is deprecated.|
|[Using Azure Monitor Application Insights with Spring Boot](./app/java-spring-boot.md)|Updated configuration options.|

### Autoscale
| Article | Description |
|---|---|
|[Autoscale with multiple profiles](./autoscale/autoscale-multiprofile.md)|New article: Using multiple profiles in autoscale with CLI PowerShell and templates.|
|[Flapping in autoscale](./autoscale/autoscale-flapping.md)|New article: Flapping in autoscale.|
|[Understand autoscale settings](./autoscale/autoscale-understanding-settings.md)|Clarified how often autoscale runs.|

### Change Analysis
| Article | Description |
|---|---|
|[Troubleshoot Azure Monitor's Change Analysis](./change/change-analysis-troubleshoot.md)|Added section about partial data and how to mitigate to the troubleshooting guide.|

### Essentials
| Article | Description |
|---|---|
|[Structure of transformation in Azure Monitor (preview)](./essentials/data-collection-transformations-structure.md)|Added information about new KQL functions that are supported.|

### Virtual machines
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
|[Access deprecated troubleshooting guides in Azure Workbooks](./visualize/workbooks-access-troubleshooting-guide.md)|New article: Access deprecated troubleshooting guides in Azure Workbooks.|

## August 2022

### Agents

| Article | Description |
|---|---|
|[Log Analytics agent overview](agents/log-analytics-agent.md)|Restructured the "Agents" section and rewrote the *Agents overview* article to reflect that Azure Monitor Agent is the primary agent for collecting monitoring data.|
|[Dependency analysis in Azure Migrate Discovery and assessment - Azure Migrate](../migrate/concepts-dependency-visualization.md)|Revamped the guidance for migrating from the Log Analytics agent to Azure Monitor Agent.|

### Alerts

| Article | Description |
|:---|:---|
|[Create Azure Monitor alert rules](alerts/alerts-create-new-alert-rule.md)|Added support for data processing in a specified region, for action groups, and for metric alert rules that monitor a custom metric.|

### Application Insights

| Article | Description |
|---|---|
|[Application Insights Overview dashboard](app/overview-dashboard.md)|Added important information clarifying that moving or renaming resources breaks dashboards, with more instructions on how to resolve this scenario.|
|[Application Insights override default SDK endpoints](/previous-versions/azure/azure-monitor/app/create-new-resource#override-default-endpoints)|Clarified that endpoint modification isn't recommended and to use connection strings instead.|
|[Continuous export of telemetry from Application Insights](/previous-versions/azure/azure-monitor/app/export-telemetry)|Added important information about avoiding duplicates when you save diagnostic logs in a Log Analytics workspace.|
|[Dependency tracking in Application Insights with OpenCensus Python](/previous-versions/azure/azure-monitor/app/opencensus-python-dependency)|Updated Django sample application and documentation in the Azure Monitor OpenCensus Python samples repository.|
|[Incoming request tracking in Application Insights with OpenCensus Python](/previous-versions/azure/azure-monitor/app/opencensus-python-request)|Updated Django sample application and documentation in the Azure Monitor OpenCensus Python samples repository.|
|[Monitor Python applications with Azure Monitor](/previous-versions/azure/azure-monitor/app/opencensus-python)|Updated Django sample application and documentation in the Azure Monitor OpenCensus Python samples repository.|
|[Configuration options: Azure Monitor Application Insights for Java](app/java-standalone-config.md)|Updated connection string overrides example.|
|[Application Insights SDK for ASP.NET Core applications](app/tutorial-asp-net-core.md)|Added a new tutorial with step-by-step instructions on how to use the Application Insights SDK with .NET Core applications.|
|[Application Insights SDK support guidance](app/sdk-support-guidance.md)|Updated and clarified the SDK support guidance.|
|[Application Insights: Dependency autocollection](app/asp-net-dependencies.md#dependency-auto-collection)|Updated the latest currently supported node.js modules.|
|[Application Insights custom metrics with .NET and .NET Core](app/tutorial-asp-net-custom-metrics.md)|Added a new tutorial with step-by-step instructions on how to enable custom metrics with .NET applications.|
|[Migrate an Application Insights classic resource to a workspace-based resource](app/convert-classic-resource.md)|Added a comprehensive FAQ section to assist with migration to workspace-based resources.|
|[Configuration options: Azure Monitor Application Insights for Java](app/java-standalone-config.md)| Updated this article for 3.4.0-BETA.|

### Autoscale

| Article | Description |
|---|---|
|[Autoscale in Microsoft Azure](autoscale/autoscale-overview.md)|Updated conceptual diagrams.|
|[Use predictive autoscale to scale out before load demands in Virtual Machine Scale Sets (preview)](autoscale/autoscale-predictive.md)|Predictive autoscale (preview) is now available in all regions.|

### Change Analysis

| Article | Description |
|---|---|
|[Enable Change Analysis](change/change-analysis-enable.md)| Added a note for slot-level enablement.|
|[Tutorial: Track a web app outage by using Change Analysis](change/tutorial-outages.md)| Added setup steps to the tutorial.|
|[Use Change Analysis in Azure Monitor to find web-app issues](change/change-analysis.md)|Updated limitations.|
|[Observability data in Azure Monitor](observability-data.md)| Added a "Changes" section.|

### Containers

| Article | Description |
|---|---|
|[Monitor a deployed Azure Kubernetes Service cluster](containers/container-insights-enable-existing-clusters.md)|Added section on using a private link with Container insights.|

### Essentials

| Article | Description |
|---|---|
|[Azure activity log](essentials/activity-log.md)|Added instructions for how to stop collecting activity logs by using the legacy collection method.|
|[Azure activity log insights](essentials/activity-log-insights.md)|Created a separate activity log insights article in the "Insights" section.|

### Logs

| Article | Description |
|---|---|
|[Configure data retention and archive in Azure Monitor Logs (preview)](logs/data-retention-archive.md)|Clarified how data retention and archiving work in Azure Monitor Logs to address repeated customer inquiries.|

## July 2022
### General

| Article | Description |
|:---|:---|
|[Sources of data in Azure Monitor](data-sources.md)|Updated with Azure Monitor Agent and the Logs Ingestion API.|

### Agents

| Article | Description |
|:---|:---|
|[Azure Monitor Agent overview](agents/agents-overview.md)| Restructured the "Agents" section. A single Azure Monitor Agent is replacing all of Azure Monitor's legacy monitoring agents.
|[Enable network isolation for Azure Monitor Agent](agents/azure-monitor-agent-data-collection-endpoint.md)|Rewritten to better describe configuration of network isolation.

### Alerts

| Article | Description |
|:---|:---|
|[Azure Monitor alerts overview](alerts/alerts-overview.md)|Updated the logic for the time to resolve behavior in stateful log alerts.

### Application Insights

| Article | Description |
|:---|:---|
|[Azure Monitor Application Insights Java](app/opentelemetry-enable.md?tabs=java)|Updated the Supported Custom Telemetry table in OpenTelemetry-based auto-instrumentation for Java applications.
|[Application Insights API for custom events and metrics](app/api-custom-events-metrics.md)|Added clarification that valueCount and itemCount have a minimum value of 1.
|[Telemetry sampling in Application Insights](app/sampling.md)|Updated sampling documentation to warn of the potential impact on alerting accuracy.
|[Azure Monitor Application Insights Java (redirect to OpenTelemetry)](app/java-in-process-agent-redirect.md)|Java auto-instrumentation now redirects to OpenTelemetry documentation.
|[Application Insights for ASP.NET Core applications](app/asp-net-core.md)|Updated .NET Core FAQ.
|[Create a new Azure Monitor Application Insights workspace-based resource](app/create-workspace-resource.md)|Linked to Microsoft Insights components for more information on properties.
|[Application Insights SDK support guidance](app/sdk-support-guidance.md)|Updated and clarified SDK support guidance.
|[Azure Monitor Application Insights Java](app/opentelemetry-enable.md?tabs=java)|Updated example code.
|[IP addresses used by Azure Monitor](app/ip-addresses.md)|Updated the IP/FQDN table.
|[Continuous export of telemetry from Application Insights](/previous-versions/azure/azure-monitor/app/export-telemetry)|Updated and clarified the continuous export notice.
|[Set up availability alerts with Application Insights](app/availability-alerts.md)|Added "Custom Alert Rule" and "Alert Frequency" sections.

### Autoscale

| Article | Description |
|:---|:---|
| [Set up autoscale for a web app with a custom metric](autoscale/autoscale-custom-metric.md) |Rewritten to improve clarity.|
[Overview of autoscale in Azure](autoscale/autoscale-overview.md)|Rewritten to improve clarity.|

### Containers

| Article | Description |
|:---|:---|
|[Overview of Container insights](containers/container-insights-overview.md)|Added information about deprecation of Docker support.|
|[Enable Container insights](containers/container-insights-onboard.md)|Updated all Container insights content for new support of managed identity authentication by using Azure Monitor Agent.|

### Essentials

| Article | Description |
|:---|:---|
|[Tutorial: Editing data collection rules](essentials/data-collection-rule-edit.md)|New article.|
|[Data collection rules in Azure Monitor](essentials/data-collection-rule-overview.md)|Rewritten to improve clarity.|
|[Data collection transformations](essentials/data-collection-transformations.md)|Rewritten to improve clarity.|
|[Data collection in Azure Monitor](essentials/data-collection.md)|New article.|
|[Migrate from diagnostic settings storage retention to Azure Storage lifecycle policy](essentials/migrate-to-azure-storage-lifecycle-policy.md)|New article.|

### Logs

| Article | Description |
|:---|:---|
|[Logs Ingestion API in Azure Monitor (preview)](logs/logs-ingestion-api-overview.md)|Custom logs API renamed to Logs Ingestion API.
|[Tutorial: Send data to Azure Monitor Logs by using the REST API (Resource Manager templates)](logs/tutorial-logs-ingestion-api.md)|Custom logs API renamed to Logs Ingestion API.
|[Tutorial: Send data to Azure Monitor Logs by using the REST API (Azure portal)](logs/tutorial-logs-ingestion-portal.md)|Custom logs API renamed to Logs Ingestion API.

### Virtual machines

| Article | Description |
|:---|:---|
|[What is VM insights?](vm/vminsights-overview.md)|Updated all VM insights content for new support of Azure Monitor Agent.

## June 2022

### General

| Article | Description |
|:---|:---|
| [Tutorial: Editing data collection rules](essentials/data-collection-rule-edit.md) | New article.|

### Application Insights

| Article | Description |
|:---|:---|
| [Application Insights logging with .NET](app/ilogger.md) | Added connection string sample code.|
| [Application Insights SDK support guidance](app/sdk-support-guidance.md) | Updated SDK supportability guidance. |
| [Azure AD authentication for Application Insights](app/azure-ad-authentication.md) | Azure AD authenticated telemetry ingestion reached general availability.|
| [Application Insights for JavaScript web apps](app/javascript.md) | Our Java on-premises page is retired and redirected to [Azure Monitor OpenTelemetry-based auto-instrumentation for Java applications](app/opentelemetry-enable.md?tabs=java).|
| [Application Insights Telemetry Data Model: Telemetry context](app/data-model-complete.md#context) | Clarified that Anonymous User ID is simply User.Id for easy selection in IntelliSense.|
| [Continuous export of telemetry from Application Insights](/previous-versions/azure/azure-monitor/app/export-telemetry) | On February 29, 2024, continuous export will be deprecated as part of the classic Application Insights deprecation.|
| [Dependency tracking in Application Insights](app/asp-net-dependencies.md) | Updated the Azure Event Hubs Client SDK and Azure Service Bus Client SDK information.|
| [Monitor Azure App Service performance and .NET Core](app/azure-web-apps-net-core.md) | Updated Linux troubleshooting guidance. |
| [Performance counters in Application Insights](app/performance-counters.md) | Added a prerequisite section to ensure performance counter data is accessible.|

### Agents

| Article | Description |
|:---|:---|
| [Collect text and IIS logs with Azure Monitor Agent (preview)](agents/data-collection-text-log.md) | Added "Troubleshooting" section.|
| [Tools for migrating to Azure Monitor Agent from legacy agents](agents/azure-monitor-agent-migration-tools.md) | New article: Explains how to install and use tools for migrating from legacy agents to the new Azure Monitor Agent.|

### Visualizations
Azure Monitor Workbooks documentation previously resided on an external GitHub repository. We've migrated all Azure Workbooks content to the same repo as all other Azure Monitor content.

## May 2022

### General

| Article | Description |
|:---|:---|
| [Azure Monitor cost and usage](usage-estimated-costs.md) | Added standard web tests to table.<br>Added explanation of billable GB calculation. |
| [Azure Monitor overview](overview.md) | Updated overview diagram. |

### Agents

| Article | Description |
|:---|:---|
| [Azure Monitor Agent extension versions](agents/azure-monitor-agent-extension-versions.md) | Updated to latest extension version. |
| [Azure Monitor Agent overview](agents/azure-monitor-agent-overview.md) | Added supported resource types. |
| [Collect text and IIS logs with Azure Monitor Agent (preview)](agents/data-collection-text-log.md) | Corrected error in data collection rule. |
| [Overview of the Azure monitoring agents](agents/agents-overview.md) | Added new OS supported for agent. |
| [Resource Manager template samples for agents](agents/resource-manager-agent.md) | Added Bicep examples. |
| [Resource Manager template samples for data collection rules](agents/resource-manager-data-collection-rules.md) | Fixed bug in sample parameter file. |
| [Rsyslog data not uploaded due to Full Disk space issue on Azure Monitor Agent Linux Agent](agents/azure-monitor-agent-troubleshoot-linux-vm-rsyslog.md) | New article. |
| [Troubleshoot the Azure Monitor Agent on Linux virtual machines and scale sets](agents/azure-monitor-agent-troubleshoot-linux-vm.md) | New article. |
| [Troubleshoot the Azure Monitor Agent on Windows Arc-enabled server](agents/azure-monitor-agent-troubleshoot-windows-arc.md) | New article. |
| [Troubleshoot the Azure Monitor Agent on Windows virtual machines and scale sets](agents/azure-monitor-agent-troubleshoot-windows-vm.md) | New article. |

### Alerts

| Article | Description |
|:---|:---|
| [Configure Azure to connect ITSM tools by using Secure Webhook](alerts/itsm-connector-secure-webhook-connections-azure-configuration.md) | Added the workflow for ITSM management and removed all references to System Center Service Manager. |
| [Overview of Azure Monitor Alerts](alerts/alerts-overview.md) | Complete rewrite. |
| [Resource Manager template samples for log query alerts](alerts/resource-manager-alerts-log.md) | Added Bicep samples for alerting to the Resource Manager template samples articles. |
| [Supported resources for metric alerts in Azure Monitor](alerts/alerts-metric-near-real-time.md) | Added a newly supported resource type. |

### Application Insights

| Article | Description |
|:---|:---|
| [Application Map in Application Insights](app/app-map.md) | Application Maps Intelligent View feature. |
| [Application Insights for ASP.NET Core applications](app/asp-net-core.md) | The `telemetry.Flush()` guidance is now available. |
| [Diagnose with Live Metrics Stream](app/live-stream.md) | Updated information on using unsecure control channel. |
| [Migrate an Azure Monitor Application Insights classic resource to a workspace-based resource](app/convert-classic-resource.md) | Schema change documentation is now available. |
| [Profile production apps in Azure with Application Insights Profiler](profiler/profiler-overview.md) | Profiler documentation now has a new home in the TOC. |

All references to unsupported versions of .NET and .NET CORE are scrubbed from Application Insights product documentation. See [.NET and .NET Core Support Policy](https://dotnet.microsoft.com/platform/support/policy/dotnet-core).

### Change Analysis

| Article | Description |
|:---|:---|
| [Navigate to a change by using custom filters in Change Analysis](change/change-analysis-custom-filters.md) | New article. |
| [Pin and share a Change Analysis query to the Azure dashboard](change/change-analysis-query.md) | New article. |
| [Use Change Analysis in Azure Monitor to find web app issues](change/change-analysis.md) | Added details for enabling web app in-guest changes. |

### Containers

| Article | Description |
|:---|:---|
| [Configure ContainerLogv2 schema (preview) for Container insights](containers/container-insights-logging-v2.md) | New article: Describes new schema for container logs. |
| [Enable Container insights](containers/container-insights-onboard.md) | Rewritten to improve clarity. |
| [Resource Manager template samples for Container insights](containers/resource-manager-container-insights.md) | Added Bicep examples. |
### Insights

| Article | Description |
|:---|:---|
| [Troubleshoot SQL Insights (preview)](/azure/azure-sql/database/sql-insights-troubleshoot) | Added known issue for OS computer name. |
### Logs

| Article | Description |
|:---|:---|
| [Azure Monitor customer-managed key](logs/customer-managed-keys.md) | Updated limitations and constraint. |
| [Design a Log Analytics workspace architecture](logs/workspace-design.md) | Rewritten to better describe decision criteria and include Microsoft Sentinel considerations. |
| [Manage access to Log Analytics workspaces](logs/manage-access.md) | Consolidated and rewrote all content on configuring workspace access. |
| [Restore logs in Azure Monitor (preview)](logs/restore.md) | Documented new Log Analytics table management configuration UI, which lets you configure a table's log plan and archive and retention policies. |

### Virtual machines

| Article | Description |
|:---|:---|
| [Migrate from VM insights guest health (preview) to Azure Monitor log alerts](vm/vminsights-health-migrate.md) | New article: Describes process to replace VM guest health with alert rules. |
| [VM insights guest health (preview)](vm/vminsights-health-overview.md) | Added deprecation statement. |
