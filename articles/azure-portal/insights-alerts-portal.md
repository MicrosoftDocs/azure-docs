<properties
	pageTitle="Use Azure portal to create alerts for Azure services | Microsoft Azure"
	description="Use the Azure portal to create Azure alerts, which can trigger notifications or automation when the conditions you specify are met."
	authors="rboucher"
	manager=""
	editor=""
	services="monitoring-and-diagnostics"
	documentationCenter="monitoring-and-diagnostics"/>

<tags
	ms.service="monitoring-and-diagnostics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/23/2016"
	ms.author="robb"/>

# Use Azure portal to create alerts for Azure services

> [AZURE.SELECTOR]
- [Portal](insights-alerts-portal.md)
- [PowerShell](insights-alerts-powershell.md)
- [CLI](insights-alerts-command-line-interface.md) 

## Overview

This article shows you how to set up Azure alerts using the Azure portal.   

You can receive an alert based on monitoring metrics for, or events on, your Azure services.

- **Metric values** - The alert triggers when the value of a specified metric crosses a threshold you assign in either direction. That is, it triggers both when the condition is first met and then afterwards when that condition is no longer being met.    
- **Activity log events** - An alert can trigger on *every* event, or, only when a certain number of events occur.


You can configure an alert to do the following when it triggers: 

- send email notifications to the service administrator and co-administrators
- send email to additional emails that you specify.
- call a webhook
- start execution of an Azure runbook (only from the Azure portal) 

You can configure and get information about alert rules using 

- [Azure portal](insights-alerts-portal.md)
- [PowerShell](insights-alerts-powershell.md) 
- [command-line interface (CLI)](insights-alerts-command-line-interface.md) 
- [Azure Insights REST API](https://msdn.microsoft.com/library/azure/dn931945.aspx)
 

## Create an alert rule on a metric with the Azure portal

1. In the [portal](https://portal.azure.com/), locate the resource you are interested in monitoring and select it.

2. Select **Alerts** or **Alert rules** under the MONITORING section. The text and icon may vary slightly for different resources.  

	![Monitoring](./media/insights-alerts-portal/AlertRulesButton.png)


3. Select the **Add alert** command and fill in the fields.

	![Add Alert](./media/insights-alerts-portal/AddAlertOnlyParamsPage.png)

4. **Name** your alert rule, and choose a **Description**, which also shows notification emails.
5. Select the **Metric** you want to monitor, then choose a **Condition** and **Threshold** value for the metric. Also chose the **Period** of time that the metric rule must be satisfied before the alert triggers. So for example, if you use the period "PT5M" and your alert looks for CPU above 80%, the alert triggers when the CPU has been consistently above 80% for 5 minutes. Once the first trigger occurs, it again triggers when the CPU stays below 80% for 5 minutes. The CPU measurement occurs every 1 minute.   

6. Check **Email owners...** if you want administrators and co-administrators to be emailed when the alert fires.

7. If you want additional emails to receive a notification when the alert fires, add them in the **Additional Administrator email(s)** field. Separate multiple emails with semi-colons - *email@contoso.com;email2@contoso.com* 

8. Put in a valid URI in the **Webhook** field if you want it called when the alert fires.

9. If you use Azure Automation, you can select a Runbook to be run when the alert fires. 

10. Select **OK** when done to create the alert.   

Within a few minutes, the alert is active and triggers as previously described.

## Managing your alerts

Once you have created an alert, you can select it and:

- View a graph showing the metric threshold and the actual values from the previous day. 
- Edit or delete it. 
- **Disable** or **Enable** it if you want to temporarily stop or resume receiving notifications for that alert. 



## Next steps

* [Get an overview of Azure monitoring](monitoring-overview.md) including the types of information you can collect and monitor.
* Learn more about [configuring webhooks in alerts](insights-webhooks-alerts.md).
* Learn more about [Azure Automation Runbooks](..\automation\automation-starting-a-runbook.md).
* Get an [overview of diagnostic logs](monitoring-overview-of-diagnostic-logs.md) and collect detailed high-frequency metrics on your service.
* Get an [overview of metrics collection](insights-how-to-customize-monitoring.md) to make sure your service is available and responsive.
