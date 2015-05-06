<properties 
   pageTitle="View alerts from Operations Manager"
   description="Learn about managing alerts from Operations Manager for monitored servers in your infrastructure"
   services="operational-insights"
   documentationCenter=""
   authors="bandersmsft"
   manager="jwhit"
   editor="" />
<tags 
   ms.service="operational-insights"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/30/2015"
   ms.author="banders" />



# View Operations Manager alerts

[AZURE.INCLUDE [operational-insights-note-moms](../includes/operational-insights-note-moms.md)]

Before you can use Alert Management in Microsoft Azure Operational Insights, you must have the intelligence pack installed. To read more about installing intelligence packs, see [Use the Gallery to add or remove intelligence packs](operational-insights-add-intelligence-pack.md). The intelligence pack only works when you your servers are monitored by to Operations Manager agents. See [Collect machine data](operational-insights-collect-data.md) for information about using Operations Manager with Operational Insights.

After the intelligence pack is installed, you can view alerts for your monitored servers by using the **Alert Management** tile on the **Overview** dashboard in Operational Insights. 

![image of Alert Management tile](./media/operational-insights-alerts/overview-alert.png)


You can view and manage Microsoft Azure Operational Insights alerts from the **Alerts** dashboard. On the dashboard, alert information is displayed in the following categories:

- Active Alerts
	- Critical Alerts
	- Warning Alerts
	- Alert Sources
- All Active Alerts
	- Shows the percentage of alerts that are critical, warnings, and informational.
- Common Alert Queries
	- This area contains pre-built queries that the Operational Insights software development team has created to help you get started using alerts.


Alerts tell you that an issue was detected, which server the alert affects, the priority, and the name of the alert.

![image of Alert dashboard](./media/operational-insights-alerts/alert-drilldown1.png)

![image of Alert dashboard](./media/operational-insights-alerts/alert-drilldown2.png)


On the **Alert Management** dashboard, you can view all the alerts that Microsoft Azure Operational Insights has found.

## To view Operational Insights alerts

1. On the **Overview** page, click the **Alert Management** tile.

2. On the **Alert Management** dashboard, view the alert categories and choose one to work with.

3. Click a tile or any item to view detailed information about it in the **Search** page.

4. By using the information you've found, you can investigate the alert and determine additional actions you might need to take to resolve it.
