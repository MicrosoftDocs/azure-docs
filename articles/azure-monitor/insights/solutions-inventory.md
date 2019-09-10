---
title: Inventory of monitoring solutions in Azure | Microsoft Docs
description: Monitoring solutions in Azure Monitor are a collection of logic, visualization, and data acquisition rules that provide metrics pivoted around a particular problem area.  This article provides a list of monitoring solutions available from Microsoft and details about their method and frequency of data collection.
services: log-analytics
documentationcenter: ''
author: MGoedtel
manager: carmonm
editor: ''
ms.assetid: f029dd6d-58ae-42c5-ad27-e6cc92352b3b
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 06/26/2018
ms.author: bwren
---
# Inventory and data collection details for monitoring solutions in Azure
[Monitoring solutions](solutions.md) leverage services in Azure to provide additional insight into the operation of a particular application or service. Monitoring solutions typically collect log data and provide queries and views to analyze collected data. You can add monitoring solutions to Azure Monitor for any applications and services that you use. They are typically available at no cost but collect data that could invoke usage charges.

This article includes a list of [montioring solutions](solutions.md) available from Microsoft with links to their detailed documentation.  It also provides information on their method and frequency of data collection into Azure Monitor.  You can use the information in this article to identify the different solutions available and to understand the data flow and connection requirements for different monitoring solutions.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-log-analytics-rebrand.md)]

## List of monitoring solutions

The following table lists the [monitoring solutions](solutions.md) in Azure provided by Microsoft. An entry in the column means that the solution collects data into Azure Monitor using that method.  If a solution has no columns selected, then it writes directly to Azure Monitor from another Azure service. Follow the link for each one to its detailed documentation for more information.

Explanations of the columns are as follows:

- **Microsoft monitoring agent** - Agent used on Windows and Linux to run managements pack from SCOM and monitoring solutions from Azure. In this configuration, the agent is connected directly to Azure Monitor without being connected to an Operations Manager management group. 
- **Operations Manager** - Identical agent as Microsoft monitoring agent. In this configuration, it's [connected to an Operations Manager management group](../platform/om-agents.md) that's connected to Azure Monitor. 
-  **Azure Storage** - Solution collects data from an Azure storage account. 
- **Operations Manager required?** - A connected Operations Manager management group is required for data collection by the monitoring solution. 
- **Operations Manager agent data sent via management group** - If the agent is [connected to a SCOM management group](../platform/om-agents.md), then data is sent to Azure Monitor from the management server. In this case, the agent doesn't need to connect directly to Azure Monitor. If this box isn't selected, then data is sent from the agent directly to Azure Monitor even if the agent is connected to a SCOM management group. It will need to be able to communicate to Azure Monitor through the [Log Analytics gateway](../platform/gateway.md).
- **Collection frequency** - Specifies the frequency that data is collected by the monitoring solution. 



| **Monitoring solution** | **Platform** | **Microsoft monitoring agent** | **Operations Manager agent** | **Azure storage** | **Operations Manager required?** | **Operations Manager agent data sent via management group** | **Collection frequency** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [Activity Log analytics](../platform/activity-log-collect.md) | Azure | | | | | | on notification |
| [AD Assessment](ad-assessment.md) |Windows |&#8226; |&#8226; | | |&#8226; |7 days |
| [AD Replication Status](ad-replication-status.md) |Windows |&#8226; |&#8226; | | |&#8226; |5 days |
| [Agent Health](solution-agenthealth.md) | Windows and Linux | &#8226; | &#8226; | | | &#8226; | 1 minute |
| [Alert Management](../platform/alert-management-solution.md) (Nagios) |Linux |&#8226; | | | | |on arrival |
| [Alert Management](../platform/alert-management-solution.md) (Zabbix) |Linux |&#8226; | | | | |1 minute |
| [Alert Management](../platform/alert-management-solution.md) (Operations Manager) |Windows | |&#8226; | |&#8226; |&#8226; |3 minutes |
| [Azure Site Recovery](../../site-recovery/site-recovery-overview.md) | Azure | | | | | | n/a |
| [Application Insights Connector (Deprecated)](../platform/app-insights-connector.md) | Azure | | | |  |  | on notification |
| [Automation Hybrid Worker](../../automation/automation-hybrid-runbook-worker.md) | Windows | &#8226; | &#8226; |  |  |  | n/a |
| [Azure Application Gateway Analytics](azure-networking-analytics.md) | Azure |  |  |  |  |  | on notification |
| **Monitoring solution** | **Platform** | **Microsoft monitoring agent** | **Operations Manager agent** | **Azure storage** | **Operations Manager required?** | **Operations Manager agent data sent via management group** | **Collection frequency** |
| [Azure Network Security Group Analytics (Deprecated)](azure-networking-analytics.md) | Azure |  |  |  |  |  | on notification |
| [Azure SQL Analytics (Preview)](azure-sql.md) | Windows | | | | | | 1 minute |
| [Backup](https://azure.microsoft.com/resources/templates/101-backup-oms-monitoring/) | Azure |  |  |  |  |  | on notification |
| [Capacity and Performance (Preview)](capacity-performance.md) |Windows |&#8226; |&#8226; | | |&#8226; |on arrival |
| [Change Tracking](../../automation/change-tracking.md) |Windows |&#8226; |&#8226; | | |&#8226; |[varies](../../automation/change-tracking.md#change-tracking-data-collection-details) |
| [Change Tracking](../../automation/change-tracking.md) |Linux |&#8226; | | | | |[varies](../../automation/change-tracking.md#change-tracking-data-collection-details) |
| [Containers](containers.md) | Windows and Linux | &#8226; | &#8226; |  |  |  | 3 minutes |
| [Key Vault Analytics](azure-key-vault.md) |Windows | | | | | |on notification |
| [Malware Assessment](../../security-center/security-center-install-endpoint-protection.md) |Windows |&#8226; |&#8226; | | |&#8226; |hourly |
| [Network Performance Monitor](network-performance-monitor.md) | Windows | &#8226; | &#8226; |  |  |  | TCP handshakes every 5 seconds, data sent every 3 minutes |
| [Office 365 Analytics (Preview)](solution-office-365.md) |Windows | | | | | |on notification |
| **Monitoring solution** | **Platform** | **Microsoft monitoring agent** | **Operations Manager agent** | **Azure storage** | **Operations Manager required?** | **Operations Manager agent data sent via management group** | **Collection frequency** |
| [Service Fabric Analytics](../../service-fabric/service-fabric-diagnostics-oms-setup.md) |Windows | | |&#8226; | | |5 minutes |
| [Service Map](service-map.md) | Windows and Linux | &#8226; | &#8226; |  |  |  | 15 seconds |
| [SQL Assessment](sql-assessment.md) |Windows |&#8226; |&#8226; | | |&#8226; |7 days |
| [SurfaceHub](surface-hubs.md) |Windows |&#8226; | | | | |on arrival |
| [System Center Operations Manager Assessment (Preview)](scom-assessment.md) | Windows | &#8226; | &#8226; |  |  | &#8226; | seven days |
| [Update Management](../../automation/automation-update-management.md) | Windows |&#8226; |&#8226; | | |&#8226; |at least 2 times per day and 15 minutes after installing an update |
| [Upgrade Readiness](https://docs.microsoft.com/windows/deployment/upgrade/upgrade-readiness-get-started) | Windows | &#8226; |  |  |  |  | 2 days |
| [VMware Monitoring (Deprecated)](vmware.md) | Linux | &#8226; |  |  |  |  | 3 minutes |
| [Wire Data 2.0 (Preview)](wire-data.md) |Windows (2012 R2 / 8.1 or later) |&#8226; |&#8226; | | | | 1 minute |




## Next steps
* Learn how to [install and use monitoring solutions](solutions.md).
* Learn how to [create queries](../log-query/log-query-overview.md) to analyze data collected by monitoring solutions.
