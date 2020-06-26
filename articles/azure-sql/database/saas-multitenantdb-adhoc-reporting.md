---
title: Ad hoc reporting queries across multiple databases
description: "Run ad hoc reporting queries across multiple Azure SQL Databases in a multi-tenant app example."
services: sql-database
ms.service: sql-database
ms.subservice: scenario
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: 
ms.date: 10/30/2018
---
# Run ad hoc analytics queries across multiple databases (Azure SQL Database)
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

In this tutorial, you run distributed queries across the entire set of tenant databases to enable ad hoc interactive reporting. These queries can extract insights buried in the day-to-day operational data of the Wingtip Tickets SaaS app. To do these extractions, you deploy an additional analytics database to the catalog server and use Elastic Query to enable distributed queries.


In this tutorial you learn:

> [!div class="checklist"]
> 
> * How to deploy an ad hoc reporting database
> * How to run distributed queries across all tenant databases


To complete this tutorial, make sure the following prerequisites are completed:

* The Wingtip Tickets SaaS Multi-tenant Database app is deployed. To deploy in less than five minutes, see [Deploy and explore the Wingtip Tickets SaaS Multi-tenant Database application](saas-multitenantdb-get-started-deploy.md)
* Azure PowerShell is installed. For details, see [Getting started with Azure PowerShell](https://docs.microsoft.com/powershell/azure/get-started-azureps)
* SQL Server Management Studio (SSMS) is installed. To download and install SSMS, see [Download SQL Server Management Studio (SSMS)](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms).


## Ad hoc reporting pattern

![adhoc reporting pattern](./media/saas-multitenantdb-adhoc-reporting/adhocreportingpattern_shardedmultitenantDB.png)

SaaS applications can analyze the vast amount of tenant data that is stored centrally in the cloud. The analyses reveal insights into the operation and usage of your application. These insights can guide feature development, usability improvements, and other investments in your apps and services.

Accessing this data in a single multi-tenant database is easy, but not so easy when distributed at scale across potentially thousands of databases. One approach is to use [Elastic Query](elastic-query-overview.md), which enables querying across a distributed set of databases with common schema. These databases can be distributed across different resource groups and subscriptions. Yet one common login must have access to extract data from all the databases. Elastic Query uses a single *head* database in which external tables are defined that mirror tables or views in the distributed (tenant) databases. Queries submitted to this head database are compiled to produce a distributed query plan, with portions of the query pushed down to the tenant databases as needed. Elastic Query uses the shard map in the catalog database to determine the location of all tenant databases. Setup and query are straightforward using standard [Transact-SQL](https://docs.microsoft.com/sql/t-sql/language-reference), and support ad hoc querying from tools like Power BI and Excel.

By distributing queries across the tenant databases, Elastic Query provides immediate insight into live production data. However, as Elastic Query pulls data from potentially many databases, query latency can sometimes be higher than for equivalent queries submitted to a single multi-tenant database. Be sure to design queries to minimize the data that is returned. Elastic Query is often best suited for querying small amounts of real-time data, as opposed to building frequently used or complex analytics queries or reports. If queries do not perform well, look at the [execution plan](https://docs.microsoft.com/sql/relational-databases/performance/display-an-actual-execution-plan) to see what part of the query has been pushed down to the remote database. And assess how much data is being returned. Queries that require complex analytical processing might be better served by saving the extracted tenant data into a database that is optimized for analytics queries. SQL Database and SQL Data Warehouse could host such the analytics database.

This pattern for analytics is explained in the [tenant analytics tutorial](saas-multitenantdb-tenant-analytics.md).

## Get the Wingtip Tickets SaaS Multi-tenant Database application source code and scripts

The Wingtip Tickets SaaS Multi-tenant Database scripts and application source code are available in the [WingtipTicketsSaaS-MultitenantDB](https://github.com/microsoft/WingtipTicketsSaaS-MultiTenantDB) GitHub repo. Check out the [general guidance](saas-tenancy-wingtip-app-guidance-tips.md) for steps to download and unblock the Wingtip Tickets SaaS scripts.

## Create ticket sales data

To run queries against a more interesting data set, create ticket sales data by running the ticket-generator.

1. In the *PowerShell ISE*, open the ...\\Learning Modules\\Operational Analytics\\Adhoc Reporting\\*Demo-AdhocReporting.ps1* script and set the following values:
   * **$DemoScenario** = 1, **Purchase tickets for events at all venues**.
2. Press **F5** to run the script and generate ticket sales. While the script is running, continue the steps in this tutorial. The ticket data is queried in the *Run ad hoc distributed queries* section, so wait for the ticket generator to complete.

## Explore the tenant tables 

In the Wingtip Tickets SaaS Multi-tenant Database application, tenants are stored in a hybrid tenant management model - where tenant data is either stored in a multi-tenant database or a single tenant database and can be moved between the two. When querying across all tenant databases, it's important that Elastic Query can treat the data as if it is part of a single logical database sharded by tenant. 

To achieve this pattern, all tenant tables include a *VenueId* column that identifies which tenant the data belongs to. The *VenueId* is computed as a hash of the Venue name, but any approach could be used to introduce a unique value for this column. This approach is similar to the way the tenant key is computed for use in the catalog. Tables containing *VenueId* are used by Elastic Query to parallelize queries and push them down to the appropriate remote tenant database. This dramatically reduces the amount of data that is returned and results in an increase in performance especially when there are multiple tenants whose data is stored in single tenant databases.

## Deploy the database used for ad hoc distributed queries

This exercise deploys the *adhocreporting* database. This is the head database that contains the schema used for querying across all tenant databases. The database is deployed to the existing catalog server, which is the server used for all management-related databases in the sample app.

1. Open ...\\Learning Modules\\Operational Analytics\\Adhoc Reporting\\*Demo-AdhocReporting.ps1* in the *PowerShell ISE* and set the following values:
   * **$DemoScenario** = 2, **Deploy Ad hoc analytics database**.

2. Press **F5** to run the script and create the *adhocreporting* database.

In the next section, you add schema to the database so it can be used to run distributed queries.

## Configure the 'head' database for running distributed queries

This exercise adds schema (the external data source and external table definitions) to the ad hoc reporting database that enables querying across all tenant databases.

1. Open SQL Server Management Studio, and connect to the Adhoc reporting database you created in the previous step. The name of the database is *adhocreporting*.
2. Open ...\Learning Modules\Operational Analytics\Adhoc Reporting\ *Initialize-AdhocReportingDB.sql* in SSMS.
3. Review the SQL script and note the following:

   Elastic Query uses a database-scoped credential to access each of the tenant databases. This credential needs to be available in all the databases and should normally be granted the minimum rights required to enable these ad hoc queries.

    ![create credential](./media/saas-multitenantdb-adhoc-reporting/create-credential.png)

   By using the catalog database as the external data source, queries are distributed to all databases registered in the catalog when the query is run. Because server names are different for each deployment, this initialization script gets the location of the catalog database by retrieving the current server (@@servername) where the script is executed.

    ![create external data source](./media/saas-multitenantdb-adhoc-reporting/create-external-data-source.png)

   The external tables that reference tenant tables are defined with **DISTRIBUTION = SHARDED(VenueId)**. This routes a query for a particular *VenueId* to the appropriate database and improves performance for many scenarios as shown in the next section.

    ![create external tables](./media/saas-multitenantdb-adhoc-reporting/external-tables.png)

   The local table *VenueTypes* that is created and populated. This reference data table is common in all tenant databases, so it can be represented here as a local table and populated with the common data. For some queries, this may reduce the amount of data moved between the tenant databases and the *adhocreporting* database.

    ![create table](./media/saas-multitenantdb-adhoc-reporting/create-table.png)

   If you include reference tables in this manner, be sure to update the table schema and data whenever you update the tenant databases.

4. Press **F5** to run the script and initialize the *adhocreporting* database. 

Now you can run distributed queries, and gather insights across all tenants!

## Run ad hoc distributed queries

Now that the *adhocreporting* database is set up, go ahead and run some distributed queries. Include the execution plan for a better understanding of where the query processing is happening. 

When inspecting the execution plan, hover over the plan icons for details. 

1. In *SSMS*, open ...\\Learning Modules\\Operational Analytics\\Adhoc Reporting\\*Demo-AdhocReportingQueries.sql*.
2. Ensure you are connected to the **adhocreporting** database.
3. Select the **Query** menu and click **Include Actual Execution Plan**
4. Highlight the *Which venues are currently registered?* query, and press **F5**.

   The query returns the entire venue list, illustrating how quick and easy it is to query across all tenants and return data from each tenant.

   Inspect the plan and see that the entire cost is the remote query because we're simply going to each tenant database and selecting the venue information.

   ![SELECT * FROM dbo.Venues](./media/saas-multitenantdb-adhoc-reporting/query1-plan.png)

5. Select the next query, and press **F5**.

   This query joins data from the tenant databases and the local *VenueTypes* table (local, as it's a table in the *adhocreporting* database).

   Inspect the plan and see that the majority of cost is the remote query because we query each tenant's venue info (dbo.Venues), and then do a quick local join with the local *VenueTypes* table to display the friendly name.

   ![Join on remote and local data](./media/saas-multitenantdb-adhoc-reporting/query2-plan.png)

6. Now select the *On which day were the most tickets sold?* query, and press **F5**.

   This query does a bit more complex joining and aggregation. What's important to note is that most of the processing is done remotely, and once again, we bring back only the rows we need, returning just a single row for each venue's aggregate ticket sale count per day.

   ![query](./media/saas-multitenantdb-adhoc-reporting/query3-plan.png)


## Next steps

In this tutorial you learned how to:

> [!div class="checklist"]
> 
> * Run distributed queries across all tenant databases
> * Deploy an ad hoc reporting database and add schema to it to run distributed queries.

Now try the [Tenant Analytics tutorial](saas-multitenantdb-tenant-analytics.md) to explore extracting data to a separate analytics database for more complex analytics processing.

## Additional resources

<!-- ??
* Additional [tutorials that build upon the Wingtip Tickets SaaS Multi-tenant Database application](saas-multitenantdb-wingtip-app-overview.md#sql-database-wingtip-saas-tutorials)
-->

* [Elastic Query](elastic-query-overview.md)
