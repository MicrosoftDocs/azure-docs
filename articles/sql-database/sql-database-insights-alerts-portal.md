---
title: Use Azure portal to create SQL Database alerts | Microsoft Docs
description: Use the Azure portal to create SQL Database alerts, which can trigger notifications or automation when the conditions you specify are met.
author: CarlRabeler
manager: jhubbard
editor: ''
services: sql-database
documentationcenter: ''

ms.assetid: f7457655-ced6-4102-a9dd-7ddf2265c0e2
ms.service: sql-database
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/23/2016
ms.author: carlrab

---
# Use Azure portal to create alerts for Azure SQL Database

## Overview
This article shows you how to set up Azure SQL Database alerts using the Azure portal. This article also provides best practices for values and thresholds.    

You can receive an alert based on monitoring metrics for, or events on, your Azure services.

* **Metric values** - The alert triggers when the value of a specified metric crosses a threshold you assign in either direction. That is, it triggers both when the condition is first met and then afterwards when that condition is no longer being met.    
* **Activity log events** - An alert can trigger on *every* event, or, only when a certain number of events occur.

You can configure an alert to do the following when it triggers:

* send email notifications to the service administrator and co-administrators
* send email to additional emails that you specify.
* call a webhook
* start execution of an Azure runbook (only from the Azure portal)

You can configure and get information about alert rules using

* [Azure portal](../monitoring-and-diagnostics/insights-alerts-portal.md)
* [PowerShell](../monitoring-and-diagnostics/insights-alerts-powershell.md)
* [command-line interface (CLI)](../monitoring-and-diagnostics/insights-alerts-command-line-interface.md)
* [Azure Monitor REST API](https://msdn.microsoft.com/library/azure/dn931945.aspx)

## Create an alert rule on a metric with the Azure portal
1. In the [portal](https://portal.azure.com/), locate the resource you are interested in monitoring and select it.
2. Select **Alerts** or **Alert rules** under the MONITORING section. The text and icon may vary slightly for different resources.  
   
    ![Monitoring](../monitoring-and-diagnostics/media/insights-alerts-portal/AlertRulesButton.png)
3. Select the **Add alert** command and fill in the fields.
   
    ![Add Alert](../monitoring-and-diagnostics/media/insights-alerts-portal/AddAlertOnlyParamsPage.png)
4. **Name** your alert rule, and choose a **Description**, which also shows in notification emails.
5. Select the **Metric** you want to monitor, then choose a **Condition** and **Threshold** value for the metric. Also chose the **Period** of time that the metric rule must be satisfied before the alert triggers. So for example, if you use the period "PT5M" and your alert looks for CPU above 80%, the alert triggers when the CPU has been consistently above 80% for 5 minutes. Once the first trigger occurs, it again triggers when the CPU stays below 80% for 5 minutes. The CPU measurement occurs every 1 minute.   
6. Check **Email owners...** if you want administrators and co-administrators to be emailed when the alert fires.
7. If you want additional emails to receive a notification when the alert fires, add them in the **Additional Administrator email(s)** field. Separate multiple emails with semi-colons - *email@contoso.com;email2@contoso.com*
8. Put in a valid URI in the **Webhook** field if you want it called when the alert fires.
9. If you use Azure Automation, you can select a Runbook to be run when the alert fires.
10. Select **OK** when done to create the alert.   

Within a few minutes, the alert is active and triggers as previously described.

## Managing your alerts
Once you have created an alert, you can select it and:

* View a graph showing the metric threshold and the actual values from the previous day.
* Edit or delete it.
* **Disable** or **Enable** it if you want to temporarily stop or resume receiving notifications for that alert.


## SQL Database alert values and thresholds

| Resource Type	| Metric Name | Friendly Name | Aggregation Type | Minimum alert time window|
| --- | --- | --- | --- | --- |
| databases | cpu_percent | CPU percentage | Average | 5 minutes |
| databases | physical_data_read_percent | Data IO percentage | Average | 5 minutes |
| databases | log_write_percent | Log IO percentage | Average | 5 minutes |
| databases | dtu_consumption_percent | DTU percentage | Average | 5 minutes |
| databases | storage | Total database size | Maximum | 30 minutes |
| databases | connection_successful | Successful Connections | Total | 10 minutes |
| databases | connection_failed | Failed Connections | Total | 10 minutes |
| databases | blocked_by_firewall | Blocked by Firewall | Total | 10 minutes |
| databases | deadlock | Deadlocks | Total | 10 minutes |
| databases | storage_percent | Database size percentage | Maximum | 30 minutes |
| databases | xtp_storage_percent | In-Memory OLTP storage percent(Preview) | Average | 5 minutes |
| databases | workers_percent | Workers percentage | Average | 5 minutes |
| databases | sessions_percent | Sessions percent | Average | 5 minutes |
| databases | dtu_limit | DTU limit | Average | 5 minutes |
| databases | dtu_used | DTU used | Average | 5 minutes |
||||||	 	 	 
| dw | cpu_percent | CPU percentage | Average | 10 minutes |
| dw | physical_data_read_percent | Data IO percentage | Average | 10 minutes |
| dw | storage | Total database size | Maximum | 10 minutes |
| dw | connection_successful | Successful Connections | Total | 10 minutes |
| dw | connection_failed | Failed Connections | Total | 10 minutes |
| dw | blocked_by_firewall | Blocked by Firewall | Total | 10 minutes |
| dw | service_level_objective | Service level objective of the database | Total | 10 minutes |
| dw | dwu_limit | dwu limit | Maximum | 10 minutes |
| dw | dwu_consumption_percent | DWU percentage | Average | 10 minutes |
| dw | dwu_used | DWU used | Average | 10 minutes |
|||||| 	 	 	 	 
| elastic pool | cpu_percent | CPU percentage | Average | 5 minutes |
| elastic pool | physical_data_read_percent | Data IO percentage | Average | 5 minutes |
| elastic pool | log_write_percent | Log IO percentage | Average | 5 minutes |
| elastic pool | dtu_consumption_percent | DTU percentage | Average | 5 minutes |
| elastic pool | storage_percent | Storage percentage | Average | 5 minutes |
| elastic pool | workers_percent | Workers percentage | Average | 5 minutes |
| elastic pool | eDTU_limit | eDTU limit | Average | 5 minutes |
| elastic pool | storage_limit | Storage limit | Average | 5 minutes |
| elastic pool | eDTU_used | eDTU used | Average | 5 minutes |
| elastic pool | storage_used | Storage used | Average | 5 minutes |
||||||


## Next steps
* [Get an overview of Azure monitoring](monitoring-overview.md) including the types of information you can collect and monitor.
* Learn more about [configuring webhooks in alerts](insights-webhooks-alerts.md).
* Learn more about [Azure Automation Runbooks](../automation/automation-starting-a-runbook.md).
* Get an [overview of diagnostic logs](monitoring-overview-of-diagnostic-logs.md) and collect detailed high-frequency metrics on your service.
* Get an [overview of metrics collection](insights-how-to-customize-monitoring.md) to make sure your service is available and responsive.

