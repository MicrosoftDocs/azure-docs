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
ms.date: 04/28/2017
ms.author: billgib; sstein

---
# Ad-hoc analytics

This tutorial uses Elastic Query in conjunction with an analytics database to run ad-hoc analytics queries that are distributed across all the tenants in the Wingtip catalog. These queries can extract insights buried in the day-to-day operational data of the WTP app. In this tutorial, you'll create an ad-hoc analytics database, with external tables mirroring tables in the tenant database schema, and which use the catalog to define the list of tenants to be queried. You’ll then run several queries across the tenants to uncover hidden insights.

To complete this tutorial, make sure of the following:

* The WTP app is deployed. To deploy in less than five minutes, see [Deploy and explore the WTP SaaS application](sql-database-saas-tutorial.md).
* Azure PowerShell is installed. For details, see [Getting started with Azure PowerShell](https://docs.microsoft.com/powershell/azure/get-started-azureps).

## Ad-hoc Analytics pattern


One of the great opportunities with SaaS applications is to leverage the vast amount of tenant data you have stored centrally in the cloud, to gain insights into the operation and usage of your applications, your tenants and their users, and their preferences and behavior. This can guide feature development, usability improvements and other investments in your apps and services.

Accessing this data when it’s in a single multi-tenant database is easy, but not so easy when distributed at scale across potentially thousands of databases. One approach is to use Elastic Query, which enables ad-hoc query across a distributed set of databases with common schema. Elastic Query uses a single ‘head’ database in which external tables are defined that mirror tables in the distributed (tenant) databases. Queries submitted to this head database are compiled to produce a distributed query plan, with portions of the query pushed down to the tenant databases as needed. Elastic Query uses the shard map in the catalog database to provide the location of the tenant databases. Setup and query is straightforward using normal T-SQL, and supports ad hoc query from tools like Power BI and Excel.


2.  Open the following scripts in **PowerShell ISE**

    1.  ...\\Learning Modules\\Operational Analytics\\Adhoc Analytics\\Demo-AdhocAnalytics.ps1

    2.  …\\Learning Modules\\Operational Analytics\\Adhoc Analytics\\Deploy-AdhocAnalyticsDB.ps1

3.  Open the following file in **SSMS**

    1.  ...\\Learning Modules\\Operational Analytics\\Adhoc Analytics\\Demo-AdhocAnalyticsQueries.sql

## Deploy the database that will be used for ad-hoc analytics queries

This exercise deploys the Ad-hoc Analytics database that contains the schema used for issuing ad-hoc queries that span all the tenant databases.

1.  Complete the steps in the ‘Getting Started’ section first.

2.  Navigate to …\\Deploy-AdhocAnalyticsDB.ps1 in PowerShell ISE

3.  Scroll down and review the SQL script that gets submitted to define the ad hoc analytics database. Note:

    1.  The external data source which refers to the shard map in the catalog. This ensures the queries are distributed to all registered tenants.

    2.  The set of external tables that are included: Events, Tickets, TicketPurchases, Venues. These are a subset of the tables in the tenant database schema.

    3.  The definition of the local reference data table, VenueTypes, with its initial data. Having this locally avoids having to go to the remote table to fetch this data, which is the same in every tenant database.

4.  Navigate to …\\Demo-AdhocAnalytics.ps1 in PowerShell ISE

5.  Run the script using F5.

    1.  This script creates a new SQL database that will be used for ad-hoc analytics and adds the WTP catalog, TicketPurchases, Tickets, and Venues tenant tables as external tables that can be queried for data. If the database already exists this step is skipped.

You have now created the ad-hoc analytics database and initialized it with tables and it can be used to submit queries.

## Run Ad-hoc analytics queries

This exercise will run ad-hoc analytics queries to uncover tenant insights from the WTP application.

1. Complete the steps in the ‘Getting Started’ section and Exercise 1 before this exercise.
1. Open Demo-AdhocAnalyticsQueries.sql in SSMS
1. Selectively execute the included demo queries

    * Select the query you want to execute and use F5 to execute (see a sample selection in the screenshot below).

    ![query](media/sql-database-saas-tutorial-adhoc-analytics/query.png)

Congratulations, you have now created an ad-hoc analytics database and run some sample distributed queries across using Elastic Query across all the tenant databases in the WTP app.

## Next steps

Try the [Tenant Analytics tutorial](sql-database-saas-tutorial-tenant-analytics.md) which explores another way to run analytics over your tenants (by extracting tenant data into a separate database and querying it there).

## Additional resources

[Elastic Query](sql-database-elastic-query-overview.md)

