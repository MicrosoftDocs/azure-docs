---
title: Inventory of management solutions in Azure | Microsoft Docs
description: Management solutions in Azure are a collection of logic, visualization, and data acquisition rules that provide metrics pivoted around a particular problem area.
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
ms.date: 04/10/2018
ms.author: bwren

---
# Data collection details for management solutions in Azure


The following tables show data collection methods and other details about how data is collected for Log Analytics management solutions and data sources. 

The Log Analytics Windows agent and System Center Operations Manager agent are essentially the same. The Windows agent includes additional functionality to allow it to connect to the Log Analytics workspace and route through a proxy. If you use an Operations Manager agent, it must be targeted as an OMS agent to communicate with Log Analytics. Operations Manager agents in this table are OMS agents that are connected to Operations Manager. See [Connect Operations Manager to Log Analytics](log-analytics-om-agents.md) for information about connecting your existing Operations Manager environment to Log Analytics.

> [!NOTE]
> The type of agent that you use determines how data is sent to Log Analytics, with the following conditions:
> - You either use the Windows agent or an Operations Manager-attached OMS agent.
> - When Operations Manager is required, Operations Manager agent data for the solution is always sent to Log Analytics using the Operations Manager management group. Additionally, when Operations Manager is required, only the Operations Manager agent is used by the solution.
> - When Operations Manager is not required and the table shows that Operations Manager agent data is sent to Log Analytics using the management group, then Operations Manager agent data is always sent to Log Analytics using management groups. Windows agents bypass the management group and send their data directly to Log Analytics.
> - When Operations Manager agent data is not sent using a management group, then the data is sent directly to Log Analytics—bypassing the management group.



| Management solution | Platform | Microsoft monitoring agent | Operations Manager agent | Azure storage | Operations Manager required? | Operations Manager agent data sent via management group | Collection frequency |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [Activity Log Analytics](../log-analytics/log-analytics-activity.md) | Azure |   |   |   |   |   | on notification |
| [AD Assessment](../log-analytics/log-analytics-ad-assessment.md) |Windows |&#8226; |&#8226; |  |  |&#8226; |7 days |
| [AD Replication Status](../log-analytics/log-analytics-ad-replication-status.md) |Windows |&#8226; |&#8226; |  |  |&#8226; |5 days |
| [Agent Health](../operations-management-suite/oms-solution-agenthealth.md) | Windows and Linux | &#8226; | &#8226; |   |   | &#8226; | 1 minute |
| [Alert Management](../log-analytics/log-analytics-solution-alert-management.md) (Nagios) |Linux |&#8226; |  |  |  |  |on arrival |
| [Alert Management](../log-analytics/log-analytics-solution-alert-management.md) (Zabbix) |Linux |&#8226; |  |  |  |  |1 minute |
| [Alert Management](../log-analytics/log-analytics-solution-alert-management.md) (Operations Manager) |Windows |  |&#8226; |  |&#8226; |&#8226; |3 minutes |
| [Azure Site Recovery](../site-recovery/site-recovery-overview.md) | Azure |   |   |   |   |   | n/a |
| [Application Insights Connector (Preview)](../log-analytics/log-analytics-app-insights-connector.md) | Azure |   |   |   |   |   | on notification |
| [Automation Hybrid Worker](../automation/automation-hybrid-runbook-worker.md) | Windows | &#8226; | &#8226; |   |   |   | n/a |
| [Azure Application Gateway Analytics](../log-analytics/log-analytics-azure-networking-analytics.md) | Azure |   |   |   |   |   | on notification |
| [Azure Network Security Group Analytics](../log-analytics/log-analytics-azure-networking-analytics.md) | Azure |   |   |   |   |   | on notification |
| [Azure SQL Analytics (Preview)](../log-analytics/log-analytics-azure-sql.md) | Windows |  |  |  |  |  | 10 minutes |
| [Backup](../backup/backup-introduction-to-azure-backup.md) | Azure |   |   |   |   |   | n/a |
| [Capacity and Performance (Preview)](../log-analytics/log-analytics-capacity.md) |Windows |&#8226; |&#8226; |  |  |&#8226; |on arrival |
| [Change Tracking](../log-analytics/log-analytics-change-tracking.md) |Windows |&#8226; |&#8226; |  |  |&#8226; |hourly |
| [Change Tracking](../log-analytics/log-analytics-change-tracking.md) |Linux |&#8226; |  |  |  |  |hourly |
| [Containers](../log-analytics/log-analytics-containers.md) | Windows and Linux | &#8226; | &#8226; |   |   |   | 3 minutes |
| [Key Vault Analytics](../log-analytics/log-analytics-azure-key-vault.md) |Windows |  |  |  |  |  |on notification |
| [Malware Assessment](../log-analytics/log-analytics-malware.md) |Windows |&#8226; |&#8226; |  |  |&#8226; |hourly |
| [Network Performance Monitor](../log-analytics/log-analytics-network-performance-monitor.md) | Windows | &#8226; | &#8226; |   |   |   | TCP handshakes every 5 seconds, data sent every 3 minutes |
| [Office 365 Analytics (Preview)](../operations-management-suite/oms-solution-office-365.md) |Windows |  |  |  |  |  |on notification |
| [Security and Audit](../operations-management-suite/oms-security-getting-started.md)<sup>1</sup> | Windows and Linux | partial | partial | partial |   | partial | various |
| [Service Fabric Analytics (Preview)](log-analytics-service-fabric.md) |Windows |  |  |&#8226; |  |  |5 minutes |
| [Service Map](../operations-management-suite/operations-management-suite-service-map.md) | Windows and Linux | &#8226; | &#8226; |   |   |   | 15 seconds |
| [SQL Assessment](../log-analytics/log-analytics-sql-assessment.md) |Windows |&#8226; |&#8226; |  |  |&#8226; |7 days |
| [SurfaceHub](../log-analytics/log-analytics-surface-hubs.md) |Windows |&#8226; |  |  |  |  |on arrival |
| [System Center Operations Manager Assessment (Preview)](log-analytics-scom-assessment.md) | Windows | &#8226; | &#8226; |   |   | &#8226; | seven days |
| [Update Management](../operations-management-suite/oms-solution-update-management.md) | Windows |&#8226; |&#8226; |  |  |&#8226; |at least 2 times per day and 15 minutes after installing an update |
| [Upgrade Readiness](https://docs.microsoft.com/windows/deployment/upgrade/upgrade-readiness-get-started) | Windows | &#8226; |   |   |   |   | 2 days |
| [VMware Monitoring (Preview)](../log-analytics/log-analytics-vmware.md) | Linux | &#8226; |   |   |   |   | 3 minutes |
| [Wire Data 2.0 (Preview)](../log-analytics/log-analytics-wire-data.md) |Windows (2012 R2 / 8.1 or later) |&#8226; |&#8226; |  |  |  | 1 minute |


<sup>1</sup> The Security and Audit solution can collect logs from Windows, Operations Manager, and Linux agents. See [Data sources](#data-sources) for data collection information about:

- Syslog
- Windows security event logs
- Windows firewall logs
- Windows event logs



## Next steps
* [Search logs](log-analytics-log-searches.md) to view detailed information gathered by management solutions.
