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

# Sources of monitoring data for Azure Monitor
Data collected by Azure Monitor is stored as either [Logs](data-platform-logs.md) or [Metrics](data-platform-metrics.md). This article provides a reference of the different sources of data for Azure Monitor. Use this article to determine how your particular application or service is monitored.


## Collection patterns
All data collected by Azure Monitor will fit into one of the patterns described in the following table. Different applications and services will support different patterns. 

| Pattern | Description |
|:---|:---|
| Platform metrics | Platform metrics are automatically collected for Azure services that support them. |
| Diagnostic settings | Diagnostic settings collect platform logs and metrics to Azure Monitor Logs and to send to destinations outside of Azure Monitor. |
| Insights | Insights provide a customized monitoring experience for particular applications and services. They collect and analyze both logs and metrics. |
| Solutions | Solutions are based on log queries and views customized for a particular application or service. They collect and analyze logs only and are being deprecated over time in favor of insights. |
| Agents | Compute resources such as virtual machines require an agent to collect logs and metrics from their guest operating system. |
| API | Separate APIs are available to write data to Azure Monitor Logs and Metrics from any REST API client. |

## Azure services
The following table lists Azure services and the monitoring patterns they support.

| Service | Platform<br>Metrics | Diagnostic<br>Settings | Insight | Solution | Notes |
|:---|:---|:---|:---|:---|:---|
|Active Directory | No | Yes | No | [Yes](../insights/ad-assessment.md)<br>[Yes](../insights/ad-replication-status.md) |
|Active Directory B2C | No | No | No | No |
|Active Directory Domain Services | No | Yes | No | No |
|Advanced Threat Protection | No | No | No | No |
|Advisor | No | No | No | No |
|AI Builder | No | No | No | No |
|Analysis Services | Yes | Yes | No | No |
|API for FHIR | No | No | No | No |
|API Management | Yes | Yes | No | No |
|App Service | Yes | Yes | No | No |
|AppConfig | No | No | No | No |
|Application Gateway | Yes | Yes | No | No |
|Attestation Service | No | No | No | No |
|Automation | Yes | Yes | No | No |
|Azure Service Manager (RDFE) | No | No | No | No |
|Backup | No | Yes | No | [Yes](https://azure.microsoft.com/resources/templates/101-backup-oms-monitoring/) |
|Bastion | No | No | No | No |
|Batch | Yes | Yes | No | No |
|Batch AI | No | No | No | No |
|Blockchain Service | No | No | No | No |
|Blueprints | No | No | No | No |
|Bot Service | No | No | No | No |
|Cloud Services | Yes | Yes | No | No |
|Cloud Shell | No | No | No | No |
|Cognitive Services | Yes | Yes | No | No |
|Container Instances | Yes | No | [Yes](https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-overview) | No |
|Container Registry | Yes | Yes | No | No |
|Content Delivery Network (CDN) | No | Yes | No | No |
|Cosmos DB | Yes | Yes | [Yes](https://docs.microsoft.com/azure/azure-monitor/insights/cosmosdb-insights-overview) | No |
|Cost Management | No | No | No | No |
|Data Box | No | No | No | No |
|Data Catalog Gen2 | No | No | No | No |
|Data Explorer | Yes | Yes | No | No |
|Data Factory | Yes | Yes | No | No |
|Data Factory v2 | No | Yes | No | No |
|Data Share | No | No | No | No |
|Database for MariaDB | Yes | Yes | No | No |
|Database for MySQL | Yes | Yes | No | No |
|Database for PostgreSQL | Yes | Yes | No | No |
|Database Migration Service | No | No | No | No |
|Databricks | No | Yes | No | No |
|DDoS Protection | Yes | Yes | No | No |
|DevOps | No | No | No | No |
|DNS | Yes | No | No | No |
|Domain names - Rob Added | No | No | No | No |
|DPS | No | No | No | No |
|Dynamics 365 Customer Engagement | No | No | No | No |
|Dynamics 365 Finance and Operations | No | No | No | No |
|Event Grid | Yes | No | No | No |
|Event Hubs | Yes | Yes | No | No |
|ExpressRoute | Yes | Yes | No | No |
|Firewall | Yes | Yes | No | No |
|Front Door | Yes | Yes | No | No |
|Functions | Yes | Yes | No | No |
|HDInsight | No | Yes | No | No |
|HPC Cache | No | No | No | No |
|Information Protection | No | No | No | No |
|Intune | No | Yes | No | No |
|IoT Central | No | No | No | No |
|IoT Hub | Yes | Yes | No | No |
|Key Vault | Yes | Yes | Yes | [Yes](../insights/azure-key-vault.md) |
|Kubernetes Service (AKS) | No | No | No | No |
|Load Balancer | Yes | Yes | No | No |
|Logic Apps | Yes | Yes | No | No |
|Machine Learning Service | No | No | No | No |
|Managed Applications  | No | No | No | No |
|Maps  | No | No | No | No |
|Media Services | Yes | Yes | No | No |
|Microsoft Azure portal | No | No | No | No |
|Microsoft Flow | No | No | No | No |
|Microsoft Managed Desktop | No | No | No | No |
|Microsoft PowerApps | No | No | No | No |
|Microsoft Social Engagement | No | No | No | No |
|Microsoft Stream | Yes | Yes | No | No |
|Migrate | No | No | No | No |
|Multi-Factor Authentication | No | Yes | No | No |
|Network Watcher | Yes | Yes | No | No |
|Network Watcher | No | No | No | No |
|Notification Hubs | Yes | No | No | No |
|Open Datasets | No | No | No | No |
|Policy | No | No | No | No |
|Power BI | Yes | Yes | No | No |
|Power BI Embedded | No | No | No | No |
|Power BI Embedded | No | No | No | No |
|Private Link | No | No | No | No |
|Project Spool Communication Platform | No | No | No | No |
|Red Hat OpenShift | No | No | No | No |
|Redis Cache | Yes | Yes | No | No |
|Redis Cache | No | No | No | No |
|Resource Graph | No | No | No | No |
|Resource Manager | No | No | No | No |
|Retail Search – by Bing | No | No | No | No |
|Search | Yes | Yes | No | No |
|Search | No | No | No | No |
|Security Center | No | No | No | No |
|Sentinel | No | No | No | No |
|Service Bus | Yes | Yes | No | No |
|Service Bus | No | No | No | No |
|Service Fabric | No | No | No | [Yes](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-oms-setup) |
|Signup Portal | No | No | No | No |
|Site Recovery | No | No | No | No |
|Spring Cloud Service | No | No | No | No |
|SQL Data Warehouse | Yes | Yes | No | No |
|SQL Database | Yes | Yes | No | [Yes](../insights/azure-sql.md)<br>[Yes](../insights/sql-assessment.md) |
|SQL Server Stretch Database | Yes | Yes | No | No |
|Stack | No | No | No | No |
|Storage | Yes | No | Yes | No |
|Storage Cache | No | No | No | No |
|Storage Sync Services - Rob added | No | No | No | No |
|Stream Analytics | Yes | Yes | No | No |
|Time Series Insights | Yes | Yes | No | No |
|TINA | No | No | No | No |
|Traffic Manager | Yes | Yes | No | No |
|Universal Print | No | No | No | No |
|Virtual Machine Scale Sets | No | Yes | No | No |
|Virtual Machines | Yes | Yes | [Yes](https://docs.microsoft.com/azure/azure-monitor/insights/vminsights-overview) | No |
|Virtual Machines - Classic RDFE | No | No | No | No |
|Virtual Network | Yes | Yes | [Yes](https://docs.microsoft.com/azure/azure-monitor/insights/network-insights-overview) | No |
|Virtual Network - NSG Flow Logs | No | Yes | No | No |
|VPN Gateway | Yes | Yes | No | No |
|Windows Virtual Desktop | No | No | No | No |



## Compute resources

| Resource | Host<br>Logs | Host<br>Metrics | Guest<br>Logs | Guest<br>Metrics | Insights | Solutions | Other |
|:---|:---|:---|:---|:---|:---|:---|:---|
| Virtual machine (Azure) | Diagnostic setting | Automatic | Log Analytics agent (workspace)<br>Diagnostic extension (storage) | Diagnostic extension | Azure Monitor for VMs | None | Connection to SCOM |
| Virtual machine (Other) | None | None | Log Analytics agent (workspace) | None | None | None | Connection to SCOM |
| Virtual machine scale set (Azure) | | | | | | | |
| Service fabric (Azure) | | | | | | | |
| Cloud services (Azure) | | | | | | | |

## Other solutions


- [Activity log analytics](activity-log-collect.md)
- [Agent health](../insights/solution-agenthealth.md)
- [Alert management](alert-management-solution.md)
- [Application Gateway Analytics](../insights/azure-networking-analytics.md)
- [Network Security Group analytics](../insights/azure-networking-analytics.md)
- [Change Tracking](../../automation/change-tracking.md)
- [Containers](../insights/containers.md)
- [SCOM Asessment](../insights/scom-assessment.md)
- [Office 365](../insights/solution-office-365.md)
- [Surface Hub](../insights/surface-hubs.md)
- [Update Management](../../automation/automation-update-management.md)
- [Upgrade readiness](https://docs.microsoft.com/windows/deployment/upgrade/upgrade-readiness-get-started)
- [Wire Data](../insights/wire-data.md)
- [Network performance monitor](../insights/azure-networking-analytics.md)







## Next steps

 
