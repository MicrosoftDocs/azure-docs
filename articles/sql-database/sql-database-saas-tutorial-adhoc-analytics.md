---
title: Run ad-hoc analytics queries across multiple Azure SQL databases | Microsoft Docs 
description: "Run ad-hoc analytics queries across multiple databases in a multi-tenant application"
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
ms.date: 05/10/2017
ms.author: billgib; sstein

---
# Run ad-hoc analytics queries across all WTP tenants

In this tutorial, you create an ad-hoc analytics database and run several queries across all tenants. These queries can extract insights buried in the day-to-day operational data of the WTP app.

To run ad-hoc analytics queries (across multiple tenants), the WTP app uses [Elastic Query](sql-database-elastic-query-overview.md) along with an analytics database.


In this tutorial you learn how to:

> [!div class="checklist"]

> * Deploy an ad-hoc analytics database
> * Run distributed queries across all tenant databases



To complete this tutorial, make sure the following prerequisites are completed:

* The WTP app is deployed. To deploy in less than five minutes, see [Deploy and explore the WTP SaaS application](sql-database-saas-tutorial.md)
* Azure PowerShell is installed. For details, see [Getting started with Azure PowerShell](https://docs.microsoft.com/powershell/azure/get-started-azureps)


## Ad-hoc Analytics pattern

One of the great opportunities with SaaS applications is to use the vast amount of tenant data you have stored centrally in the cloud. Use this data to gain insights into the operation and usage of your applications, your tenants, their users, and their preferences and behaviors. The insights you find can guide feature development, usability improvements and other investments in your apps and services.

Accessing this data in a single multi-tenant database is easy, but not so easy when distributed at scale across potentially thousands of databases. One approach is to use Elastic Query, which enables ad-hoc querying across a distributed set of databases with common schema. Elastic Query uses a single *head* database in which external tables are defined that mirror tables in the distributed (tenant) databases. Queries submitted to this head database are compiled to produce a distributed query plan, with portions of the query pushed down to the tenant databases as needed. Elastic Query uses the shard map in the catalog database to provide the location of the tenant databases. Setup and query are straightforward using normal T-SQL, and supports ad-hoc querying from tools like Power BI and Excel.

## Get the Wingtip application scripts

The Wingtip Tickets scripts and application source code are available in the [WingtipSaaS](https://github.com/Microsoft/WingtipSaaS) github repo. Script files are located in the [Learning Modules folder](https://github.com/Microsoft/WingtipSaaS/tree/master/Learning%20Modules). Download the **Learning Modules** folder to your local computer, maintaining its folder structure.

## Deploy the database used for ad-hoc analytics queries

This exercise deploys the Ad-hoc Analytics database that contains the schema used for issuing ad-hoc queries that span all the tenant databases.

1. Open ...\\Learning Modules\\Operational Analytics\\Adhoc Analytics\\*Demo-AdhocAnalytics.ps1* in the *PowerShell ISE* and set the following values:
   * **$DemoScenario** = 2, **Deploy Ad-hoc analytics database**.

1. Press **F5** to run the script and create a new SQL database for ad-hoc analytics and add it to the WTP catalog. TicketPurchases, Tickets, and Venues tables are added as external tables that can be queried.
   It's ok if you encounter warnings here about *The RPC server is unavailable*.


You now have an *adhocanalytics* database, that can be used to run distributed queries, and gather insights across all tenants!

## Run Ad-hoc analytics queries

This exercise runs ad-hoc analytics queries to uncover tenant insights from the WTP application.

1. Open ...\\Learning Modules\\Operational Analytics\\Adhoc Analytics\\*Demo-AdhocAnalyticsQueries.sql* in SSMS.
1. Ensure you are connected to the **adhocanalytics** database
1. Select the individual query you want to run, and press **F5**:

    ![query](media/sql-database-saas-tutorial-adhoc-analytics/query.png)




## Next steps

In this tutorial you learned how to:

> [!div class="checklist"]

> * Deploy an ad-hoc analytics database
> * Run distributed queries across all tenant databases

[Log Analytics (OMS) tutorial](sql-database-saas-tutorial-log-analytics.md)

## Additional resources

* [Additional tutorials that build upon the initial Wingtip Tickets Platform (WTP) application deployment](sql-database-wtp-overview.md#sql-database-wtp-saas-tutorials)
* [Elastic Query](sql-database-elastic-query-overview.md)
