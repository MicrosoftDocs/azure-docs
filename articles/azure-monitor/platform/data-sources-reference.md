---
title: Sources of data in Azure Monitor | Microsoft Docs
description: Describes the data available to monitor the health and performance of your Azure resources and the applications running on them.
ms.service:  azure-monitor
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 12/28/2019

---

# What is monitored by Azure Monitor
This article describes the different applications and services that are monitored by Azure Monitor. 

## Core insights and solutions
Core insights and solutions are considered part of Azure Monitor and follow the same support and service level agreement. They are supported in all Azure regions where Azure Monitor is available.

### Insights
Insights provide a customized monitoring experience for particular applications and services. They collect and analyze both logs and metrics.

| Insight | Description |
|:---|:---|
| [Application Insights](../app/app-insights-overview.md) | Extensible Application Performance Management (APM) service to monitor your live web application on any platform. |
| [Azure Monitor for Containers](../insights/container-insights-overview.md) | Monitors the performance of container workloads deployed to either Azure Container Instances or managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS). |
| [Azure Monitor for Cosmos DB](../insights/cosmosdb-insights-overview.md) | Provides a view of the overall performance, failures, capacity, and operational health of all your Azure Cosmos DB resources in a unified interactive experience. |
| [Azure Monitor for Networks (preview)](../insights/network-insights-overview.md) | Provides a comprehensive view of health and metrics for all your network resource. The advanced search capability helps you identify resource dependencies, enabling scenarios like identifying resource that are hosting your website, by simply searching for your website name. |
[Azure Monitor for Resource Groups (preview)](../insights/resource-group-insights.md) |  Triage and diagnose any problems your individual resources encounter, while offering context as to the health and performance of the resource group as a whole. |
| [Azure Monitor for Storage](../insights/storage-insights-overview.md) | Provides comprehensive monitoring of your Azure Storage accounts by delivering a unified view of your Azure Storage services performance, capacity, and availability. |
| [Azure Monitor for VMs (preview)](../insights/container-insights-overview.md) | Monitors your Azure virtual machines (VM) and virtual machine scale sets at scale. It analyzes the performance and health of your Windows and Linux VMs, and monitors their processes and dependencies on other resources and external processes. |

### Solutions
Solutions are based on log queries and views customized for a particular application or service. They collect and analyze logs only and are being deprecated over time in favor of insights.

| Solution | Description |
|:---|:---|
| [Activity log analytics](activity-log-view.md#activity-logs-analytics-monitoring-solution) | Analyze Activity log entries using predefined log queries and views. |
| [Agent health](../insights/solution-agenthealth.md) | Analyze the health and configuration of Log Analytics agents. |
| [Alert management](alert-management-solution.md) | Analyze alerts collected from System Center Operations Manager, Nagios, or Zabbix. |
| [Network Performance Monitor](../insights/network-performance-monitor.md) |  Monitor network performance between various points in your network infrastructure, network connectivity to service and application endpoints, and the performance of Azure ExpressRoute. |
| [Service Map](../insights/service-map.md) | Automatically discovers application components on Windows and Linux systems and maps the communication between services. The same functionality is provided in   |
| [Wire Data](../insights/wire-data.md) | Consolidated network and performance data collected from Windows-connected and Linux-connected computers with the Log Analytics agent. |


## Other solutions
Other solutions are available for monitoring different applications and services, but they may not follow the same support and service level agreements as Azure Monitor. 

| Solution | Description |
|:---|:---|
| [Active Directory assessment](../insights/ad-assessment.md) | Assess the risk and health of your Active Directory environments. |
| [Containers](../insights/containers.md) | View and manage Docker and Windows container hosts. |
| [DNS Analytics](../insights/dns-analytics.md) | Collects, analyzes, and correlates Windows DNS analytic and audit logs and other related data from your DNS servers. |
| [ITSM](itsmc-overview.md) | Connect your ITSM product/service and Azure Monitor to centrally manage your work items. |
| [Network Security Group analytics](../insights/azure-networking-analytics.md) | |
| [Office 365](../insights/solution-office-365.md) | Updated version with improved onboarding available through Azure Sentinel. 
| [SCOM Asessment](../insights/scom-assessment.md) | Assess the risk and health of your System Center Operations Manager management group. |
| [SQL assessment](../insights/sql-assessment.md) | Assess the risk and health of your SQL Server environments.  |
| [Surface Hub](../insights/surface-hubs.md) | Track the health and usage of Surface Hub devices. |




## Azure services
The following table lists Azure services and the data they collect into Azure Monitor. 

- **Platform metrics.**  The service automatically collects metrics into Azure Monitor Metrics. 
- **Logs.** The service supports diagnostic settings which can collect platform logs and metrics to Azure Monitor Logs.
- **Insight.** There is an insights available for the service which provides a 

| Service | Platform<br>Metrics | Logs | Insight | Notes |
|:---|:---|:---|:---|:---|
|Active Directory | No | Yes | No |  |
|Active Directory B2C | No | No | No |  |
|Active Directory Domain Services | No | Yes | No |  |
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
|Blockchain Service | No | No | No |  |
|Blueprints | No | No | No |  |
|Bot Service | No | No | No |  |
|Cloud Services | Yes | Yes | No |  |
|Cloud Shell | No | No | No |  |
|Cognitive Services | Yes | Yes | No |  |
|Container Instances | Yes | No | [Yes](https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-overview) |  |
|Container Registry | Yes | Yes | No |  |
|Content Delivery Network (CDN) | No | Yes | No |  |
|Cosmos DB | Yes | Yes | [Yes](https://docs.microsoft.com/azure/azure-monitor/insights/cosmosdb-insights-overview) |  |
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
|Domain names - Rob Added | No | No | No |  |
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
|Information Protection | No | No | No |  |
|Intune | No | Yes | No |  |
|IoT Central | No | No | No |  |
|IoT Hub | Yes | Yes | No |  |
|Key Vault | Yes | Yes | No |  |
|Kubernetes Service (AKS) | No | No | No |  |
|Load Balancer | Yes | Yes | No |  |
|Logic Apps | Yes | Yes | No |  |
|Machine Learning Service | No | No | No |  |
|Managed Applications  | No | No | No |  |
|Maps  | No | No | No |  |
|Media Services | Yes | Yes | No |  |
|Microsoft Azure portal | No | No | No |  |
|Microsoft Flow | No | No | No |  |
|Microsoft Managed Desktop | No | No | No |  |
|Microsoft Managed Desktop | No | No | No |  |
|Microsoft PowerApps | No | No | No |  |
|Microsoft PowerApps | No | No | No |  |
|Microsoft Social Engagement | No | No | No |  |
|Microsoft Stream | Yes | Yes | No |  |
|Migrate | No | No | No |  |
|Multi-Factor Authentication | No | Yes | No |  |
|Network Watcher | Yes | Yes | No |  |
|Network Watcher | No | No | No |  |
|Notification Hubs | Yes | No | No |  |
|Open Datasets | No | No | No |  |
|Policy | No | No | No |  |
|Power BI | Yes | Yes | No |  |
|Power BI Embedded | No | No | No |  |
|Power BI Embedded | No | No | No |  |
|Private Link | No | No | No |  |
|Project Spool Communication Platform | No | No | No |  |
|Red Hat OpenShift | No | No | No |  |
|Redis Cache | Yes | Yes | No |  |
|Redis Cache | No | No | No |  |
|Resource Graph | No | No | No |  |
|Resource Manager | No | No | No |  |
|Retail Search – by Bing | No | No | No |  |
|Search | Yes | Yes | No |  |
|Security Center | No | No | No |  |
|Sentinel | No | No | No |  |
|Service Bus | Yes | Yes | No |  |
|Service Fabric | No | No | No |  |
|Signup Portal | No | No | No |  |
|Site Recovery | No | No | No |  |
|Spring Cloud Service | No | No | No |  |
|SQL Data Warehouse | Yes | Yes | No |  |
|SQL Database | Yes | Yes | No |  |
|SQL Server Stretch Database | Yes | Yes | No |  |
|Stack | No | No | No |  |
|Storage | Yes | No | [Yes](Yes) |  |
|Storage Cache | No | No | No |  |
|Storage Sync Services - Rob added | No | No | No |  |
|Stream Analytics | Yes | Yes | No |  |
|Time Series Insights | Yes | Yes | No |  |
|TINA | No | No | No |  |
|Traffic Manager | Yes | Yes | No |  |
|Universal Print | No | No | No |  |
|Virtual Machine Scale Sets | No | Yes | No |  |
|Virtual Machines | Yes | Yes | [Yes](https://docs.microsoft.com/azure/azure-monitor/insights/vminsights-overview) | Agent required to monitor guest operating system and workflows. |
|Virtual Network | Yes | Yes | [Yes](https://docs.microsoft.com/azure/azure-monitor/insights/network-insights-overview) |  |
|Virtual Network - NSG Flow Logs | No | Yes | No |  |
|VPN Gateway | Yes | Yes | No |  |
|Windows Virtual Desktop | No | No | No |  |




## Product integrations
The services in the table below store their data in a Log Analytics workspace so that it can be analyzed with other log data collected by Azure Monitor.

| Service | Description |
|:---|:---|
| [Azure Automation](/azure/automation/) | Manage operating system updates and track changes on Windows and Linux computers. See [Change Tracking](../../automation/change-tracking.md) and [Update Management](../../automation/automation-update-management.md). |
| [Azure Security Center](/azure/security-center/) | Collect and analyze security events and perform threat analysis. See [Data collection in Azure Security Center](../../security-center/security-center-enable-data-collection.md) |
| [Azure Sentinel](/azure/sentinel/) | Connects to different sources including Office 365 and Amazon Web Services Cloud Trail. See [Connect data sources](/azure/sentinel/connect-data-sources). |
| [Windows Update Compliance](https://docs.microsoft.com/windows/deployment/update/update-compliance-get-started) | Assess your Windows desktop upgrades.
| [On-Demand Assessments](https://docs.microsoft.com/services-hub/health/getting_started_with_on_demand_assessments) | Assess and optimize the availability, security, and performance of your on-premises, hybrid, and cloud Microsoft technology environments. |


## Resources outside of Azure
Azure Monitor can collect data from outside of Azure using the methods listed in the following table.

| Resource | Method |
|:---|:---|
| Virtual machines | Use the Log Analytics agent to collect data from the guest operating system of virtual machines in other cloud environments or on-premises. See [](). |
| System Center Operations Manager | Collect data from Operations Manager agents by connecting their management group to Azure Monitor. See [Connect Operations Manager to Azure Monitor](om-agents.md) |
| REST API Client | Separate APIs are available to write data to Azure Monitor Logs and Metrics from any REST API client. |






## Next steps

 
