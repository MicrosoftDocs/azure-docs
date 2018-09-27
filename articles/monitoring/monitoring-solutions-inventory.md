---
title: Data collection details for management solutions in Azure | Microsoft Docs
description: Management solutions in Azure are a collection of logic, visualization, and data acquisition rules that provide metrics pivoted around a particular problem area.  This article provides a list of management solutions available from Microsoft and details about their method and frequency of data collection.
services: log-analytics
documentationcenter: ''
author: MGoedtel
manager: carmonm
editor: ''
ms.assetid: f029dd6d-58ae-42c5-ad27-e6cc92352b3b
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/26/2018
ms.author: bwren

---
# Data collection details for management solutions in Azure
This article includes a list of [management solutions](monitoring-solutions.md) available from Microsoft with links to their detailed documentation.  It also provides information on their method and frequency of data collection into Log Analytics.  You can use the information in this article to identify the different solutions available and to understand the data flow and connection requirements for different management solutions. 

## List of management solutions

The following table lists the [management solutions](monitoring-solutions.md) in Azure provided by Microsoft. An entry in the column means that the solution collects data into Log Analytics using that method.  If a solution has no columns selected, then it writes directly to Log Analytics from another Azure service. Follow the link for each one to its detailed documentation for more information.

Explanations of the columns are as follows:

- **Microsoft monitoring agent** - Agent used on Windows and Linux to run managements pack from SCOM and management solutions from Azure. In this configuration, the agent is connected directly to Log Analytics without being connected to an Operations Manager management group. 
- **Operations Manager** - Identical agent as Microsoft monitoring agent. In this configuration, it's [connected to an Operations Manager management group](../log-analytics/log-analytics-om-agents.md) that's connected to Log Analytics. 
-  **Azure Storage** - Solution collects data from an Azure storage account. 
- **Operations Manager required?** - A connected Operations Manager management group is required for data collection by the management solution. 
- **Operations Manager agent data sent via management group** - If the agent is [connected to a SCOM management group](../log-analytics/log-analytics-om-agents.md), then data is sent to Log Analytics from the management server. In this case, the agent doesn't need to connect directly to Log Analytics. If this box isn't selected, then data is sent from the agent directly to Log Analytics even if the agent is connected to a SCOM management group. it will either need to be able to communicate to Log Analytics through an [OMS gateway](../log-analytics/log-analytics-oms-gateway.md).
- **Collection frequency** - Specifies the frequency that data is collected by the management solution. 



| **Management solution** | **Platform** | **Microsoft monitoring agent** | **Operations Manager agent** | **Azure storage** | **Operations Manager required?** | **Operations Manager agent data sent via management group** | **Collection frequency** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [Activity Log Analytics](../log-analytics/log-analytics-activity.md) | Azure | | | | | | on notification |
| [AD Assessment](../log-analytics/log-analytics-ad-assessment.md) |Windows |&#8226; |&#8226; | | |&#8226; |7 days |
| [AD Replication Status](../log-analytics/log-analytics-ad-replication-status.md) |Windows |&#8226; |&#8226; | | |&#8226; |5 days |
| [Agent Health](../operations-management-suite/oms-solution-agenthealth.md) | Windows and Linux | &#8226; | &#8226; | | | &#8226; | 1 minute |
| [Alert Management](../log-analytics/log-analytics-solution-alert-management.md) (Nagios) |Linux |&#8226; | | | | |on arrival |
| [Alert Management](../log-analytics/log-analytics-solution-alert-management.md) (Zabbix) |Linux |&#8226; | | | | |1 minute |
| [Alert Management](../log-analytics/log-analytics-solution-alert-management.md) (Operations Manager) |Windows | |&#8226; | |&#8226; |&#8226; |3 minutes |
| [Azure Site Recovery](../site-recovery/site-recovery-overview.md) | Azure | | | | | | n/a |
| [Application Insights Connector (Preview)](../log-analytics/log-analytics-app-insights-connector.md) | Azure | | | |  |  | on notification |
| [Automation Hybrid Worker](../automation/automation-hybrid-runbook-worker.md) | Windows | &#8226; | &#8226; |  |  |  | n/a |
| [Azure Application Gateway Analytics](../log-analytics/log-analytics-azure-networking-analytics.md) | Azure |  |  |  |  |  | on notification |
| **Management solution** | **Platform** | **Microsoft monitoring agent** | **Operations Manager agent** | **Azure storage** | **Operations Manager required?** | **Operations Manager agent data sent via management group** | **Collection frequency** |
| [Azure Network Security Group Analytics (Deprecated)](../log-analytics/log-analytics-azure-networking-analytics.md) | Azure |  |  |  |  |  | on notification |
| [Azure SQL Analytics (Preview)](../log-analytics/log-analytics-azure-sql.md) | Windows | | | | | | 1 minute |
| [Backup](https://azure.microsoft.com/resources/templates/101-backup-oms-monitoring/) | Azure |  |  |  |  |  | on notification |
| [Capacity and Performance (Preview)](../log-analytics/log-analytics-capacity.md) |Windows |&#8226; |&#8226; | | |&#8226; |on arrival |
| [Change Tracking](../log-analytics/log-analytics-change-tracking.md) |Windows |&#8226; |&#8226; | | |&#8226; |hourly |
| [Change Tracking](../log-analytics/log-analytics-change-tracking.md) |Linux |&#8226; | | | | |hourly |
| [Containers](../log-analytics/log-analytics-containers.md) | Windows and Linux | &#8226; | &#8226; |  |  |  | 3 minutes |
| [Key Vault Analytics](../log-analytics/log-analytics-azure-key-vault.md) |Windows | | | | | |on notification |
| [Malware Assessment](../log-analytics/log-analytics-malware.md) |Windows |&#8226; |&#8226; | | |&#8226; |hourly |
| [Network Performance Monitor](../log-analytics/log-analytics-network-performance-monitor.md) | Windows | &#8226; | &#8226; |  |  |  | TCP handshakes every 5 seconds, data sent every 3 minutes |
| [Office 365 Analytics (Preview)](../operations-management-suite/oms-solution-office-365.md) |Windows | | | | | |on notification |
| **Management solution** | **Platform** | **Microsoft monitoring agent** | **Operations Manager agent** | **Azure storage** | **Operations Manager required?** | **Operations Manager agent data sent via management group** | **Collection frequency** |
| [Service Fabric Analytics](../service-fabric/service-fabric-diagnostics-oms-setup.md) |Windows | | |&#8226; | | |5 minutes |
| [Service Map](../operations-management-suite/operations-management-suite-service-map.md) | Windows and Linux | &#8226; | &#8226; |  |  |  | 15 seconds |
| [SQL Assessment](../log-analytics/log-analytics-sql-assessment.md) |Windows |&#8226; |&#8226; | | |&#8226; |7 days |
| [SurfaceHub](../log-analytics/log-analytics-surface-hubs.md) |Windows |&#8226; | | | | |on arrival |
| [System Center Operations Manager Assessment (Preview)](../log-analytics/log-analytics-scom-assessment.md) | Windows | &#8226; | &#8226; |  |  | &#8226; | seven days |
| [Update Management](../operations-management-suite/oms-solution-update-management.md) | Windows |&#8226; |&#8226; | | |&#8226; |at least 2 times per day and 15 minutes after installing an update |
| [Upgrade Readiness](https://docs.microsoft.com/windows/deployment/upgrade/upgrade-readiness-get-started) | Windows | &#8226; |  |  |  |  | 2 days |
| [VMware Monitoring (Deprecated)](../log-analytics/log-analytics-vmware.md) | Linux | &#8226; |  |  |  |  | 3 minutes |
| [Wire Data 2.0 (Preview)](../log-analytics/log-analytics-wire-data.md) |Windows (2012 R2 / 8.1 or later) |&#8226; |&#8226; | | | | 1 minute |




## Next steps
* Learn how to [create queries](../log-analytics/log-analytics-log-searches.md) to analyze data collected by management solutions.
