---
title: Run ad-hoc analytics queries across all tenants (sample SaaS application using Azure SQL Database) | Microsoft Docs 
description: "Run ad-hoc analytics queries across all tenants"
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
ms.date: 05/01/2017
ms.author: billgib; sstein

---
# Ad-hoc analytics

In this tutorial, you create an ad-hoc analytics database, and then run several queries across all tenants (or a subset of tenants you define). These queries can extract insights buried in the day-to-day operational data of the WTP app.

To facilitate running ad-hoc analytics queries across multiple tenants, the WTP app uses [Elastic Query](sql-database-elastic-query-overview.md) in conjunction with an analytics database.

To complete this tutorial, make sure of the following:

* The WTP app is deployed. To deploy in less than five minutes, see [Deploy and explore the WTP SaaS application](sql-database-saas-tutorial.md).
* Azure PowerShell is installed. For details, see [Getting started with Azure PowerShell](https://docs.microsoft.com/powershell/azure/get-started-azureps).

## Ad-hoc Analytics pattern

One of the great opportunities with SaaS applications is to leverage the vast amount of tenant data you have stored centrally in the cloud, to gain insights into the operation and usage of your applications, your tenants, their users, and their preferences and behavior. This can guide feature development, usability improvements and other investments in your apps and services.

Accessing this data when its in a single multi-tenant database is easy, but not so easy when distributed at scale across potentially thousands of databases. One approach is to use Elastic Query, which enables ad-hoc querying across a distributed set of databases with common schema. Elastic Query uses a single *head* database in which external tables are defined that mirror tables in the distributed (tenant) databases. Queries submitted to this head database are compiled to produce a distributed query plan, with portions of the query pushed down to the tenant databases as needed. Elastic Query uses the shard map in the catalog database to provide the location of the tenant databases. Setup and query is straightforward using normal T-SQL, and supports ad hoc query from tools like Power BI and Excel.



## Deploy the database used for ad-hoc analytics queries

This exercise deploys the Ad-hoc Analytics database that contains the schema used for issuing ad-hoc queries that span all the tenant databases.

1. Navigate to Learning Modules\\Operational Analytics\\*Demo-AdhocAnalytics.ps1* in the **PowerShell ISE** and set the following values:
   * **$DemoScenario** = 2, **Deploy Ad-hoc analytics database**.

1. Press **F5** to run the script and create a new SQL database for ad-hoc analytics and add it to the WTP catalog. TicketPurchases, Tickets, and Venues tenant tables are added as external tables that can be queried. If the database already exists this step is skipped.
   Note that it's ok if you encounter warnings here about *The RPC server is unavailable*.


You now have an *adhocanalytics* database, that can be used to submit queries and gather insights across all tenants!

## Run Ad-hoc analytics queries

This exercise will run ad-hoc analytics queries to uncover tenant insights from the WTP application.

1. Open *Demo-AdhocAnalyticsQueries.sql* in SSMS.
1. Select the individual query you want to run and press *F5*.

    ![query](media/sql-database-saas-tutorial-adhoc-analytics/query.png)

Congratulations, you just ran some sample distributed queries across all the tenant databases in the WTP app using Elastic Query!


## Next steps

Try the [Tenant Analytics tutorial](sql-database-saas-tutorial-tenant-analytics.md) which explores another way to run analytics over your tenants (by extracting tenant data into a separate database and querying it there).

## Additional resources

[Elastic Query](sql-database-elastic-query-overview.md)
