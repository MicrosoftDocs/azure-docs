<properties
	pageTitle="Overview of alerts in Microsoft Azure | Microsoft Azure"
	description="Alerts all you to monitor Azure resource metrics, events or logs and be notified when a condition you specify is met."
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
	ms.date="09/24/2016"
	ms.author="robb"/>

# Overview of alerts in Microsoft Azure


This article describes what alerts are, their benefits, and how to get started with using them.  

## What are alerts?
Alerts are a method of monitoring Azure resource metrics, events, or logs and then being notified when a condition you specify is met.

You can receive alerts based on:

- **Metric values**--This alert triggers when the value of a specified metric crosses a threshold that you assign in either direction. That is, it triggers both when the condition is first met and then afterwards when that condition is no longer being met.
- **Activity log events**--This alert can trigger on every event or only when a certain number of events occur.

## Alerts in different Azure services

Alerts are available across different services, including:

- **Application Insights**--Enables web test and metric alerts. See [Set alerts in Application Insights](../application-insights/app-insights-alerts.md) and [Monitor availability and responsiveness of any web site](../application-insights/app-insights-monitor-web-app-availability.md).
- **Log Analytics (OMS)**--Enables the routing of diagnostic logs to Log Analytics. OMS allows metric, log, and other alert types. For more information, see [Alerts in Log Analytics](../log-analytics/log-analytics-alerts.md).   
- **Azure Monitor**--Azure Monitor enables alerts based on both metric values and activity log events. Azure Monitor includes the [Azure Insights REST API](https://msdn.microsoft.com/library/dn931943.aspx).  For more information, see [Using the Azure portal, PowerShell or the Command-Line Interface to create alerts](insights-alerts-portal.md)

## Alert actions
You can configure an alert to do the following:

- Send email notifications to the service administrator, co-administrators, or to additional email addresses that you specify.
- Call a webhook, which enables you to launch additional automation actions.

 ![Alerts explained.](./media/monitoring-overview-alerts/AlertsOverviewResource3.png)


## Next steps

Get information about alert rules and configuring them using

- [The Azure portal](insights-alerts-portal.md)
- [PowerShell](insights-alerts-powershell.md)
- [Command-line interface (CLI)](insights-alerts-command-line-interface.md)
- [The Azure Insights REST API](https://msdn.microsoft.com/library/azure/dn931945.aspx)
