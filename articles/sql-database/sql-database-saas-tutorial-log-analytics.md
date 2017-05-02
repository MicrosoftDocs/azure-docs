---
title: Setup and run log analytics (sample SaaS application using Azure SQL Database) | Microsoft Docs 
description: "Setup and run log analytics"
keywords: sql database tutorial
services: sql-database
documentationcenter: ''
author: stevestein
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: tutorial
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 04/28/2017
ms.author: billgib; sstein

---
# Log analytics

This tutorial covers setting up and using Log Analytics with the WTP SaaS app. It builds on the Performance Monitoring and Management tutorial, and shows how to use Log Analytics to augment the monitoring and alerting provided in the Azure portal. Log Analytics is particularly suitable for monitoring and alerting at scale – it supports hundreds of pools and hundreds of thousands of databases. It also provides a single pane of glass monitoring solution, which can integrate monitoring of different applications and Azure services, across different Azure subscriptions if required. This tutorial explores the Azure SQL Analytics solution in Log Analytics, for monitoring SQL Database pools and databases.


To complete this tutorial, make sure of the following:

* The WTP app is deployed. To deploy in less than five minutes, see [Deploy and explore the WTP SaaS application](sql-database-saas-tutorial.md).
* Azure PowerShell is installed. For details, see [Getting started with Azure PowerShell](https://docs.microsoft.com/powershell/azure/get-started-azureps).

**SaaS performance management patterns**

See the Performance Monitoring and Management tutorial for a discussion of the SaaS scenarios and patterns and how they affect the requirements on a monitoring solution.

## Monitoring and managing performance with Log Analytics (aka OMS)

The Azure portal provides built-in monitoring and alerting on most resource blades. For SQL Database, monitoring and alerting is available on databases and pools. This built-in monitoring and alerting is resource-specific and convenient for small numbers of resources, but is less well suited to monitoring large installations or for providing a unified view across different resources and subscriptions.

For high-volume scenarios Log Analytics can be used. This is a separate Azure service that provides analytics over emitted diagnostic logs and telemetry gathered in a log analytics workspace, which can collect telemetry from many services and be used to query and set alerts. Log Analytics provides a built-in query language and data visualization tools allowing operational data analytics and visualization. The SQL Analytics solution provides several pre-defined elastic pool and database monitoring and alerting views and queries, and lets you add your own ad-hoc queries and save these as needed. OMS also provides a custom view designer.

Log Analytics workspaces and analytics solutions can be opened both in the Azure portal and in OMS. The Azure portal is the newer access point but may be behind the OMS portal in some areas.

The tutorial walks through installing and using Log Analytics and the Azure SQL Analytics solution and then opening and using the solution in the context of the WTP application.



1. Open …\\Learning Modules\\Performance Monitoring and Management\\Demo-PerformanceMonitoringAndManagement.ps1 in PowerShell ISE. Keep this script open as you may want to run several of the load generation scenarios during this tutorial.

1. If not already done, provision the extra tenants to provide a more interesting monitoring context.

    1. Set **$DemoScenario = 1,** **Provision a batch of tenants**

    1. Execute the script using F5.

1. Make sure the load generator is running. If necessary, restart another session.

    1. Set **$DemoScenario = 2,** **Generate a normal intensity load**. You can experiment with different load scenarios.

    1. Execute the script to start the load generation jobs using F5.

## Installing and configuring Log Analytics and the Azure SQL Analytics solution

Log Analytics is a separate service that needs to be configured. Log Analytics collects log data and telemetry and metrics in a log analytics workspace. A workspace is a resource like others in Azure and must be created. While it doesn’t need to be created in the same resource group as the application(s) it is monitoring, this will often make sense. In the case of the WTP app this works well and allows the workspace to be deleted with the application when the time comes.

1. Open ...\\Learning Modules\\Performance Monitoring and Management\\Log Analytics\\Demo-LogAnalytics.ps1 in **PowerShell ISE **

1. **Execute using F5**

At this point you should be able open either Log Analytics in the Azure portal or the OMS portal. It will take a few minutes for telemetry to be collected in the Log Analytics workspace and to become visible. The longer you leave the system gathering data the more interesting the experience will be. Now’s a good moment to grab a coffee!

## Use Log Analytics and the SQL Analytics solution to monitor pools and databases


In this exercise, you will open Log Analytics and the OMS portal to look at the telemetry being gathered for the WTP databases and pools.

1. Open the Azure portal and locate and click the Log Analaytics option on the menu on the left.

1. Select the workspace named wtploganalytics-&lt;USER&gt;

1. Select Overview to open the Azure SQL Analytics solution in the Azure portal, or select OMS Portal to view it in the OMS portal.
    **IMPORTANT**: It may take a couple of minutes before the solution is active. Be patient!
    ![overview](media/sql-database-saas-tutorial-log-analytics/overview.png)

1. Click on the Azure SQL Analytics solution tile to open it.

    ![analytics](media/sql-database-saas-tutorial-log-analytics/analytics.png)

1. The view in the solution blade scrolls sideways, with its own scroll bar at the bottom (refresh the blade if needed).

1. Explore the various views by clicking on them or on individual resources to open a drill-down explorer, where you can use the time-slider in the top left or click on a vertical bar to focus in on a narrower time slice. With this view, you can select/de-select individual databases or pools to focus in on specific resources (see below).

    ![chart](media/sql-database-saas-tutorial-log-analytics/chart.png)

1. Back on the solution blade, if you scroll to the far right you will see some saved queries that you can click on to open and explore. You can experiment with modifying these, and save any interesting queries you produce, which you can then re-open and use with other resources.

1. Back on the Log Analytics workspace blade, select OMS Portal to open the solution there.

    ![oms](media/sql-database-saas-tutorial-log-analytics/oms.png)

1. In the OMS portal, you can configure alerts. Click on the alert portion of the database DTU view.

1. In the Log Search view that appears you will see a bar graph of the metrics being represented.

    ![log search](media/sql-database-saas-tutorial-log-analytics/log-search.png)

1. If you click on Alert in the toolbar you will be able to see the alert configuration and can change it.

    ![add alert rule](media/sql-database-saas-tutorial-log-analytics/add-alert.png)

The monitoring and alerting in Log Analytics and OMS is based on queries over the data in the workspace, unlike the alerting on each resource blade, which is resource-specific. Thus, you can define an alert that looks over all databases, say, rather than defining one per database. Or write an alert that uses a composite query over multiple resource types. Queries are only limited by the data available in the workspace.

Log Analytics for SQL Database is charged for based on the data volume in the workspace. In this tutorial, you created a Free workspace, which is limited to 500MB per day. Once that limit is reached data is not added to the workspace.

## Next steps

[OMS](https://blogs.technet.microsoft.com/msoms/tag/msoms/)

## Additional resources

[Azure Log Analytics](../log-analytics/log-analytics-azure-sql.md)

[OMS](https://blogs.technet.microsoft.com/msoms/2017/02/21/azure-sql-analytics-solution-public-preview/)
