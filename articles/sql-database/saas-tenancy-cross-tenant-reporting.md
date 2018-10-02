---
title: Run reporting queries across multiple Azure SQL databases | Microsoft Docs
description: "Cross-tenant reporting using distributed queries."
services: sql-database
ms.service: sql-database
ms.subservice: scenario
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewers: billgib,AyoOlubeko
manager: craigg
ms.date: 04/01/2018
---
# Cross-tenant reporting using distributed queries

In this tutorial, you run distributed queries across the entire set of tenant databases for reporting. These queries can extract insights buried in the day-to-day operational data of the Wingtip Tickets SaaS tenants. To do this, you deploy an additional reporting database to the catalog server and use Elastic Query to enable distributed queries.


In this tutorial you learn:

> [!div class="checklist"]

> * How to deploy an reporting database
> * How to run distributed queries across all tenant databases
> * How global views in each database can enable efficient querying across tenants


To complete this tutorial, make sure the following prerequisites are completed:


* The Wingtip Tickets SaaS Database Per Tenant app is deployed. To deploy in less than five minutes, see [Deploy and explore the Wingtip Tickets SaaS Database Per Tenant application](saas-dbpertenant-get-started-deploy.md)
* Azure PowerShell is installed. For details, see [Getting started with Azure PowerShell](https://docs.microsoft.com/powershell/azure/get-started-azureps)
* SQL Server Management Studio (SSMS) is installed. To download and install SSMS, see [Download SQL Server Management Studio (SSMS)](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms).


## Cross-tenant reporting pattern

![cross-tenant distributed query pattern](media/saas-tenancy-cross-tenant-reporting/cross-tenant-distributed-query.png)

One opportunity with SaaS applications is to use the vast amount of tenant data stored  in the cloud to gain insights into the operation and usage of your application. These insights can guide feature development, usability improvements, and other investments in your apps and services.

Accessing this data in a single multi-tenant database is easy, but not so easy when distributed at scale across potentially thousands of databases. One approach is to use [Elastic Query](sql-database-elastic-query-overview.md), which enables querying across a distributed set of databases with common schema. These databases can be distributed across different resource groups and subscriptions, but need to share a common login. Elastic Query uses a single *head* database in which external tables are defined that mirror tables or views in the distributed (tenant) databases. Queries submitted to this head database are compiled to produce a distributed query plan, with portions of the query pushed down to the tenant databases as needed. Elastic Query uses the shard map in the catalog database to determine the location of all tenant databases. Setup and query of the head database are straightforward using standard [Transact-SQL](https://docs.microsoft.com/sql/t-sql/language-reference), and support querying from tools like Power BI and Excel.

By distributing queries across the tenant databases, Elastic Query provides immediate insight into live production data. As Elastic Query pulls data from potentially many databases, query latency can be higher than equivalent queries submitted to a single multi-tenant database. Design queries to minimize the data that is returned to the head database. Elastic Query is often best suited for querying small amounts of real-time data, as opposed to building frequently used or complex analytics queries or reports. If queries don't perform well, look at the [execution plan](https://docs.microsoft.com/sql/relational-databases/performance/display-an-actual-execution-plan) to see what part of the query is pushed down to the remote database and how much data is being returned. Queries that require complex aggregation or analytical processing may be better handles by extracting tenant data into a database or data warehouse optimized for analytics queries. This pattern is explained in the [tenant analytics tutorial](saas-tenancy-tenant-analytics.md). 

## Get the Wingtip Tickets SaaS Database Per Tenant application scripts

The Wingtip Tickets SaaS Multi-tenant Database scripts and application source code are available in the [WingtipTicketsSaaS-DbPerTenant](https://github.com/Microsoft/WingtipTicketsSaaS-DbPerTenant) GitHub repo. Check out the [general guidance](saas-tenancy-wingtip-app-guidance-tips.md) for steps to download and unblock the Wingtip Tickets SaaS scripts.

## Create ticket sales data

To run queries against a more interesting data set, create ticket sales data by running the ticket-generator.

1. In the *PowerShell ISE*, open the ...\\Learning Modules\\Operational Analytics\\Adhoc Reporting\\*Demo-AdhocReporting.ps1* script and set the following value:
   * **$DemoScenario** = 1, **Purchase tickets for events at all venues**.
2. Press **F5** to run the script and generate ticket sales. While the script is running, continue the steps in this tutorial. The ticket data is queried in the *Run ad-hoc distributed queries* section, so wait for the ticket generator to complete.

## Explore the global views

In the Wingtip Tickets SaaS Database Per Tenant application, each tenant is given a database. Thus, the data contained in the database tables is scoped to the perspective of a single tenant. However, when querying across all databases, it's important that Elastic Query can treat the data as if it is part of a single logical database sharded by tenant. 

To simulate this pattern, a set of 'global' views are added to the tenant database that project a tenant ID into each of the tables that are queried globally. For example, the *VenueEvents* view adds a computed *VenueId* to the columns projected from the *Events* table. Similarly, the *VenueTicketPurchases* and *VenueTickets* views add a computed *VenueId* column projected from their respective tables. These views are used by Elastic Query to parallelize queries and push them down to the appropriate remote tenant database when a *VenueId* column is present. This dramatically reduces the amount of data that is returned and results in a substantial increase in performance for many queries. These global views have been pre-created in all tenant databases.

1. Open SSMS and [connect to the tenants1-&lt;USER&gt; server](saas-tenancy-wingtip-app-guidance-tips.md#explore-database-schema-and-execute-sql-queries-using-ssms).
1. Expand **Databases**, right-click _contosoconcerthall_, and select **New Query**.
1. Run the following queries to explore the difference between the single-tenant tables and the global views:

   ```T-SQL
   -- The base Venue table, that has no VenueId associated.
   SELECT * FROM Venue

   -- Notice the plural name 'Venues'. This view projects a VenueId column.
   SELECT * FROM Venues

   -- The base Events table, which has no VenueId column.
   SELECT * FROM Events

   -- This view projects the VenueId retrieved from the Venues table.
   SELECT * FROM VenueEvents
   ```

In these views, the *VenueId* is computed as a hash of the Venue name, but any approach could be used to introduce a unique value. This approach is similar to the way the tenant key is computed for use in the catalog.

To examine the definition of the *Venues* view:

1. In **Object Explorer**, expand **contosoconcerthall** > **Views**:

   ![views](media/saas-tenancy-cross-tenant-reporting/views.png)

2. Right-click **dbo.Venues**.
3. Select **Script View as** > **CREATE To** > **New Query Editor Window**

Script any of the other *Venue* views to see how they add the *VenueId*.

## Deploy the database used for distributed queries

This exercise deploys the _adhocreporting_ database. This is the head database that contains the schema used for querying across all tenant databases. The database is deployed to the existing catalog server, which is the server used for all management-related databases in the sample app.

1. in *PowerShell ISE*, open ...\\Learning Modules\\Operational Analytics\\Adhoc Reporting\\*Demo-AdhocReporting.ps1*. 

1. Set **$DemoScenario = 2**, _Deploy Ad-hoc reporting database_.

1. Press **F5** to run the script and create the *adhocreporting* database.

In the next section, you add schema to the database so it can be used to run distributed queries.

## Configure the 'head' database for running distributed queries

This exercise adds schema (the external data source and external table definitions) to the _adhocreporting_ database to enable querying across all tenant databases.

1. Open SQL Server Management Studio, and connect to the Adhoc Reporting database you created in the previous step. The name of the database is *adhocreporting*.
2. Open ...\Learning Modules\Operational Analytics\Adhoc Reporting\ _Initialize-AdhocReportingDB.sql_ in SSMS.
3. Review the SQL script and note:

   Elastic Query uses a database-scoped credential to access each of the tenant databases. This credential needs to be available in all the databases and should normally be granted the minimum rights required to enable these queries.

    ![create credential](media/saas-tenancy-cross-tenant-reporting/create-credential.png)

   With the catalog database as the external data source, queries are distributed to all databases registered in the catalog at the time the query runs. As server names are different for each deployment, this script gets the location of the catalog database from the current server (@@servername) where the script is executed.

    ![create external data source](media/saas-tenancy-cross-tenant-reporting/create-external-data-source.png)

   The external tables that reference the global views described in the previous section, and defined with **DISTRIBUTION = SHARDED(VenueId)**. Because each *VenueId* maps to a single database, this improves performance for many scenarios as shown in the next section.

    ![create external tables](media/saas-tenancy-cross-tenant-reporting/external-tables.png)

   The local table _VenueTypes_ that is created and populated. This reference data table is common in all tenant databases, so it can be represented here as a local table and populated with the common data. For some queries, having this table defined in the head database can reduce the amount of data that needs to be moved to the head database.

    ![create table](media/saas-tenancy-cross-tenant-reporting/create-table.png)

   If you include reference tables in this manner, be sure to update the table schema and data whenever you update the tenant databases.

4. Press **F5** to run the script and initialize the *adhocreporting* database. 

Now you can run distributed queries, and gather insights across all tenants!

## Run distributed queries

Now that the *adhocreporting* database is set up, go ahead and run some distributed queries. Include the execution plan for a better understanding of where the query processing is happening. 

When inspecting the execution plan, hover over the plan icons for details. 

Important to note, is that setting **DISTRIBUTION = SHARDED(VenueId)** when the external data source is defined improves performance for many scenarios. As each *VenueId* maps to a single database, filtering is easily done remotely, returning only the data needed.

1. Open ...\\Learning Modules\\Operational Analytics\\Adhoc Reporting\\*Demo-AdhocReportingQueries.sql* in SSMS.
2. Ensure you are connected to the **adhocreporting** database.
3. Select the **Query** menu and click **Include Actual Execution Plan**
4. Highlight the *Which venues are currently registered?* query, and press **F5**.

   The query returns the entire venue list, illustrating how quick, and easy it is to query across all tenants and return data from each tenant.

   Inspect the plan and see that the entire cost is in the remote query.Each tenant database executes the query remotely and returns its venue information to the head database.

   ![SELECT * FROM dbo.Venues](media/saas-tenancy-cross-tenant-reporting/query1-plan.png)

5. Select the next query, and press **F5**.

   This query joins data from the tenant databases and the local *VenueTypes* table (local, as it's a table in the *adhocreporting* database).

   Inspect the plan and see that the majority of cost is the remote query. Each tenant database returns its venue info and performs a local join with the local *VenueTypes* table to display the friendly name.

   ![Join on remote and local data](media/saas-tenancy-cross-tenant-reporting/query2-plan.png)

6. Now select the *On which day were the most tickets sold?* query, and press **F5**.

   This query does a bit more complex joining and aggregation. Most of the processing occurs remotely.  Only single rows, containing each venue's daily ticket sale count per day, are returned to the head database.

   ![query](media/saas-tenancy-cross-tenant-reporting/query3-plan.png)


## Next steps

In this tutorial you learned how to:

> [!div class="checklist"]

> * Run distributed queries across all tenant databases
> * Deploy a reporting database and define the schema required to run distributed queries.


Now try the [Tenant Analytics tutorial](saas-tenancy-tenant-analytics.md) to explore extracting data to a separate analytics database for more complex analytics processing.

## Additional resources

* Additional [tutorials that build upon the Wingtip Tickets SaaS Database Per Tenant application](saas-dbpertenant-wingtip-app-overview.md#sql-database-wingtip-saas-tutorials)
* [Elastic Query](sql-database-elastic-query-overview.md)
