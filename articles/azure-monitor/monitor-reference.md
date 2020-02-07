---
title: What is monitored by Azure Monitor
description: Reference of all services and other resources monitored by Azure Monitor.
ms.service:  azure-monitor
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/17/2020

---

# What is monitored by Azure Monitor?
This article describes the different applications and services that are monitored by Azure Monitor. 

## Insights and core solutions
Core insights and solutions are considered part of Azure Monitor and follow the support and service level agreements for Azure. They are supported in all Azure regions where Azure Monitor is available.

### Insights

Insights provide a customized monitoring experience for particular applications and services. They collect and analyze both logs and metrics.

| Insight | Description |
|:---|:---|
| [Application Insights](app/app-insights-overview.md) | Extensible Application Performance Management (APM) service to monitor your live web application on any platform. |
| [Azure Monitor for Containers](insights/container-insights-overview.md) | Monitors the performance of container workloads deployed to either Azure Container Instances or managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS). |
| [Azure Monitor for Cosmos DB (preview)](insights/cosmosdb-insights-overview.md) | Provides a view of the overall performance, failures, capacity, and operational health of all your Azure Cosmos DB resources in a unified interactive experience. |
| [Azure Monitor for Networks (preview)](insights/network-insights-overview.md) | Provides a comprehensive view of health and metrics for all your network resource. The advanced search capability helps you identify resource dependencies, enabling scenarios like identifying resource that are hosting your website, by simply searching for your website name. |
[Azure Monitor for Resource Groups (preview)](insights/resource-group-insights.md) |  Triage and diagnose any problems your individual resources encounter, while offering context as to the health and performance of the resource group as a whole. |
| [Azure Monitor for Storage (preview)](insights/storage-insights-overview.md) | Provides comprehensive monitoring of your Azure Storage accounts by delivering a unified view of your Azure Storage services performance, capacity, and availability. |
| [Azure Monitor for VMs (preview)](insights/container-insights-overview.md) | Monitors your Azure virtual machines (VM) and virtual machine scale sets at scale. It analyzes the performance and health of your Windows and Linux VMs, and monitors their processes and dependencies on other resources and external processes. |

### Core solutions

Solutions are based on log queries and views customized for a particular application or service. They collect and analyze logs only and are being deprecated over time in favor of insights.

| Solution | Description |
|:---|:---|
| [Agent health](insights/solution-agenthealth.md) | Analyze the health and configuration of Log Analytics agents. |
| [Alert management](platform/alert-management-solution.md) | Analyze alerts collected from System Center Operations Manager, Nagios, or Zabbix. |
| [Service Map](insights/service-map.md) | Automatically discovers application components on Windows and Linux systems and maps the communication between services. The same functionality is provided in   |



## Azure services
The following table lists Azure services and the data they collect into Azure Monitor. 

- Metrics - The service automatically collects metrics into Azure Monitor Metrics. 
- Logs - The service supports diagnostic settings which can collect platform logs and metrics to Azure Monitor Logs.
- Insight - There is an insight available for the service which provides a customized monitoring experience for the service.

| Service | Metrics | Logs | Insight | Notes |
|:---|:---|:---|:---|:---|
|Active Directory | No | Yes | [Yes](../active-directory/reports-monitoring/howto-use-azure-monitor-workbooks.md) |  |
|Active Directory B2C | No | No | No |  |
|Active Directory Domain Services | No | Yes | No |  |
|Activity log | No | Yes | No | |
|Advanced Threat Protection | No | No | No |  |
|Advisor | No | No | No |  |
|AI Builder | No | No | No |  |
|Analysis Services | Yes | Yes | No |  |
|API for FHIR | No | No | No |  |
|API Management | Yes | Yes | No |  |
|App Service | Yes | Yes | No |  |
|AppConfig | No | No | No |  |
|Application Gateway | Yes | Yes | No |  |
|Attestation Service | No | No | No |  |
|Automation | Yes | Yes | No |  |
|Azure Service Manager (RDFE) | No | No | No |  |
|Backup | No | Yes | No |  |
|Bastion | No | No | No |  |
|Batch | Yes | Yes | No |  |
|Batch AI | No | No | No |  |
|Blockchain Service | No | Yes | No |  |
|Blueprints | No | No | No |  |
|Bot Service | No | No | No |  |
|Cloud Services | Yes | Yes | No | Agent required to monitor guest operating system and workflows.  |
|Cloud Shell | No | No | No |  |
|Cognitive Services | Yes | Yes | No |  |
|Container Instances | Yes | No | No |  |
|Container Registry | Yes | Yes | No |  |
|Content Delivery Network (CDN) | No | Yes | No |  |
|Cosmos DB | Yes | Yes | [Yes](insights/cosmosdb-insights-overview.md) |  |
|Cost Management | No | No | No |  |
|Data Box | No | No | No |  |
|Data Catalog Gen2 | No | No | No |  |
|Data Explorer | Yes | Yes | No |  |
|Data Factory | Yes | Yes | No |  |
|Data Factory v2 | No | Yes | No |  |
|Data Share | No | No | No |  |
|Database for MariaDB | Yes | Yes | No |  |
|Database for MySQL | Yes | Yes | No |  |
|Database for PostgreSQL | Yes | Yes | No |  |
|Database Migration Service | No | No | No |  |
|Databricks | No | Yes | No |  |
|DDoS Protection | Yes | Yes | No |  |
|DevOps | No | No | No |  |
|DNS | Yes | No | No |  |
|Domain names | No | No | No |  |
|DPS | No | No | No |  |
|Dynamics 365 Customer Engagement | No | No | No |  |
|Dynamics 365 Finance and Operations | No | No | No |  |
|Event Grid | Yes | No | No |  |
|Event Hubs | Yes | Yes | No |  |
|ExpressRoute | Yes | Yes | No |  |
|Firewall | Yes | Yes | No |  |
|Front Door | Yes | Yes | No |  |
|Functions | Yes | Yes | No |  |
|HDInsight | No | Yes | No |  |
|HPC Cache | No | No | No |  |
|Information Protection | No | Yes | No |  |
|Intune | No | Yes | No |  |
|IoT Central | No | No | No |  |
|IoT Hub | Yes | Yes | No |  |
|Key Vault | Yes | Yes | No |  |
|Kubernetes Service (AKS) | No | No | [Yes](insights/container-insights-overview.md)  |  |
|Load Balancer | Yes | Yes | No |  |
|Logic Apps | Yes | Yes | No |  |
|Machine Learning Service | No | No | No |  |
|Managed Applications  | No | No | No |  |
|Maps  | No | No | No |  |
|Media Services | Yes | Yes | No |  |
|Microsoft Flow | No | No | No |  |
|Microsoft Managed Desktop | No | No | No |  |
|Microsoft PowerApps | No | No | No |  |
|Microsoft Social Engagement | No | No | No |  |
|Microsoft Stream | Yes | Yes | No |  |
|Migrate | No | No | No |  |
|Multi-Factor Authentication | No | Yes | No |  |
|Network Watcher | Yes | Yes | No |  |
|Notification Hubs | Yes | No | No |  |
|Open Datasets | No | No | No |  |
|Policy | No | No | No |  |
|Power BI | Yes | Yes | No |  |
|Power BI Embedded | No | No | No |  |
|Private Link | No | No | No |  |
|Project Spool Communication Platform | No | No | No |  |
|Red Hat OpenShift | No | No | No |  |
|Redis Cache | Yes | Yes | No |  |
|Resource Graph | No | No | No |  |
|Resource Manager | No | No | No |  |
|Retail Search – by Bing | No | No | No |  |
|Search | Yes | Yes | No |  |
|Service Bus | Yes | Yes | No |  |
|Service Fabric | No | Yes | No | Agent required to monitor guest operating system and workflows.  |
|Signup Portal | No | No | No |  |
|Site Recovery | No | Yes | No |  |
|Spring Cloud Service | No | No | No |  |
|SQL Data Warehouse | Yes | Yes | No |  |
|SQL Database | Yes | Yes | No |  |
|SQL Server Stretch Database | Yes | Yes | No |  |
|Stack | No | No | No |  |
|Storage | Yes | No | [Yes](insights/storage-insights-overview.md) |  |
|Storage Cache | No | No | No |  |
|Storage Sync Services | No | No | No |  |
|Stream Analytics | Yes | Yes | No |  |
|Time Series Insights | Yes | Yes | No |  |
|TINA | No | No | No |  |
|Traffic Manager | Yes | Yes | No |  |
|Universal Print | No | No | No |  |
|Virtual Machine Scale Sets | No | Yes | [Yes](insights/vminsights-overview.md) | Agent required to monitor guest operating system and workflows. |
|Virtual Machines | Yes | Yes | [Yes](insights/vminsights-overview.md) | Agent required to monitor guest operating system and workflows. |
|Virtual Network | Yes | Yes | [Yes](insights/network-insights-overview.md) |  |
|Virtual Network - NSG Flow Logs | No | Yes | No |  |
|VPN Gateway | Yes | Yes | No |  |
|Windows Virtual Desktop | No | No | No |  |


## Product integrations
The services and solutions in the following table store their data in a Log Analytics workspace so that it can be analyzed with other log data collected by Azure Monitor.

| Product/Service | Description |
|:---|:---|
| [Azure Automation](/azure/automation/) | Manage operating system updates and track changes on Windows and Linux computers. See [Change Tracking](../automation/change-tracking.md) and [Update Management](../automation/automation-update-management.md). |
| [Azure Information Protection ](https://docs.microsoft.com/azure/information-protection/) | Classify and optionally protect documents and emails. See [Central reporting for Azure Information Protection](https://docs.microsoft.com/azure/information-protection/reports-aip#configure-a-log-analytics-workspace-for-the-reports). |
| [Azure Security Center](/azure/security-center/) | Collect and analyze security events and perform threat analysis. See [Data collection in Azure Security Center](/azure/security-center/security-center-enable-data-collection) |
| [Azure Sentinel](/azure/sentinel/) | Connects to different sources including Office 365 and Amazon Web Services Cloud Trail. See [Connect data sources](/azure/sentinel/connect-data-sources). |
| [Key Vault Analytics](insights/azure-key-vault.md) | Analyze Azure Key Vault AuditEvent logs. |
| [Microsoft Intune](https://docs.microsoft.com/intune/) | Create a diagnostic setting to send logs to Azure Monitor. See [Send log data to storage, event hubs, or log analytics in Intune (preview)](https://docs.microsoft.com/intune/fundamentals/review-logs-using-azure-monitor).  |
| Network  | [Network Performance Monitor](insights/network-performance-monitor.md) - Monitor network connectivity and performance to service and application endpoints.<br>[Azure Application Gateway](insights/azure-networking-analytics.md#azure-application-gateway-analytics-solution-in-azure-monitor) - Analyze logs and metrics from Azure Application Gateway.<br>[Traffic Analytics](/azure/network-watcher/traffic-analytics) - Analyzes Network Watcher network security group (NSG) flow logs to provide insights into traffic flow in your Azure cloud. |
| [Office 365](insights/solution-office-365.md) | Monitor your Office 365 environment. Updated version with improved onboarding available through Azure Sentinel. |
| [SQL Analytics](insights/azure-sql.md) | Monitor performance of Azure SQL databases, elastic pools, and managed instances at scale and across multiple subscriptions. |
| [Surface Hub](insights/surface-hubs.md) | Track the health and usage of Surface Hub devices. |
| [System Center Operations Manager](https://docs.microsoft.com/system-center/scom) | Collect data from Operations Manager agents by connecting their management group to Azure Monitor. See [Connect Operations Manager to Azure Monitor](platform/om-agents.md)<br> Assess the risk and health of your System Center Operations Manager management group with [Operations Manager Assessment](insights/scom-assessment.md) solution. |
| [Microsoft Teams Rooms](https://docs.microsoft.com/microsoftteams/room-systems/azure-monitor-deploy) | Integrated, end-to-end management of Microsoft Teams Rooms devices. |
| [Visual Studio App Center](https://docs.microsoft.com/appcenter/) | Build, test, and distribute applications and then monitor their status and usage. See [Start analyzing your mobile app with App Center and Application Insights](learn/mobile-center-quickstart.md). |
| Windows | [Windows Update Compliance](https://docs.microsoft.com/windows/deployment/update/update-compliance-get-started) - Assess your Windows desktop upgrades.<br>[Desktop Analytics](https://docs.microsoft.com/configmgr/desktop-analytics/overview) - Integrates with Configuration Manager to provide insight and intelligence to make more informed decisions about the update readiness of your Windows clients. |



## Other solutions
Other solutions are available for monitoring different applications and services, but active development has stopped and they may not be available in all regions. They are covered by the Azure Log Analytics data ingestion service level agreement.

| Solution | Description |
|:---|:---|
| [Active Directory assessment](insights/ad-assessment.md) | Assess the risk and health of your Active Directory environments. |
| [Active Directory replication status](insights/ad-replication-status.md) | Regularly monitors your Active Directory environment for any replication failures. |
| [Activity log analytics](platform/activity-log-view.md#activity-logs-analytics-monitoring-solution) | Analyze Activity log entries using predefined log queries and views. |
| [DNS Analytics (preview)](insights/dns-analytics.md) | Collects, analyzes, and correlates Windows DNS analytic and audit logs and other related data from your DNS servers. |
| [Cloud Foundry](../cloudfoundry/cloudfoundry-oms-nozzle.md) | Collect, view, and analyze your Cloud Foundry system health and performance metrics, across multiple deployments. |
| [Containers](insights/containers.md) | View and manage Docker and Windows container hosts. |
| [On-Demand Assessments](https://docs.microsoft.com/services-hub/health/getting_started_with_on_demand_assessments) | Assess and optimize the availability, security, and performance of your on-premises, hybrid, and cloud Microsoft technology environments. |
| [SQL assessment](insights/sql-assessment.md) | Assess the risk and health of your SQL Server environments.  |
| [Wire Data](insights/wire-data.md) | Consolidated network and performance data collected from Windows-connected and Linux-connected computers with the Log Analytics agent. |


## Third party integration

| Solution | Description |
|:---|:---|
| [ITSM](platform/itsmc-overview.md) | The IT Service Management Connector (ITSMC) allows you to connect Azure and a supported IT Service Management (ITSM) product/service.  |


## Resources outside of Azure
Azure Monitor can collect data from resources outside of Azure using the methods listed in the following table.

| Resource | Method |
|:---|:---|
| Applications | Monitor web applications outside of Azure using Application Insights. See [What is Application Insights?](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview). |
| Virtual machines | Use the Log Analytics agent to collect data from the guest operating system of virtual machines in other cloud environments or on-premises. See [Collect log data with the Log Analytics agent](platform/log-analytics-agent.md). |
| REST API Client | Separate APIs are available to write data to Azure Monitor Logs and Metrics from any REST API client. See [Send log data to Azure Monitor with the HTTP Data Collector API](platform/data-collector-api.md) for Logs and [Send custom metrics for an Azure resource to the Azure Monitor metric store by using a REST API](platform/metrics-store-custom-rest-api.md) for Metrics. |



## Next steps

- Read more about the [Azure Monitor data platform which stores the logs and metrics collected by insights and solutions](platform/data-platform.md).
- Complete a [tutorial on monitoring an Azure resource](learn/tutorial-resource-logs.md).
- Complete a [tutorial on writing a log query to analyze data in Azure Monitor Logs](learn/tutorial-resource-logs.md).
- Complete a [tutorial on creating a metrics chart to analyze data in Azure Monitor Metrics](learn/tutorial-metrics-explorer.md).

 
