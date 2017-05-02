---
title: Run analytics queries against multiple tenants (sample SaaS application using Azure SQL Database) | Microsoft Docs 
description: "Run analytics queries against multiple tenants"
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
ms.date: 04/21/2017
ms.author: billgib; sstein

---
# Tenant analytics

This tutorial shows one way of using the catalog database to run analytics queries. In this tutorial, an elastic job will be created to run queries on each tenant in the WTP catalog to retrieve data and load it into a separate analytics database created on the catalog server. This database can then be queried to extract insights buried in the day-to-day operational data of all the tenants. As an output of the job, a table will be created from the results-returning queries inside the tenant analytics database created as part of getting started.


To complete this tutorial, make sure of the following:

* The WTP app is deployed. To deploy in less than five minutes, see [Deploy and explore the WTP SaaS application](sql-database-saas-tutorial.md).
* Azure PowerShell is installed. For details, see [Getting started with Azure PowerShell](https://docs.microsoft.com/powershell/azure/get-started-azureps).

## Tenant Operational Analytics pattern

One of the great opportunities with SaaS applications is to leverage the rich tenant data that is stored in the cloud to gain insights into the operation and usage of your application, and your tenants. This can guide feature development, usability improvements and other investments in the app and platform. Accessing this data when it’s in a single multi-tenant database is easy, but not so easy when distributed at scale across potentially thousands of databases. One approach to accessing this data is to use Elastic jobs, which enables result-returning query results from job execution to be captured in an output database and table.



## Walkthrough

Getting Started - Deploy a database that will be used for tenant analytics results

This tutorial requires you to have a database deployed to capture the results from job execution of scripts which contain results-returning queries. Let’s create a database called tenantanalytics for this purpose.

1. Open …\\Learning Modules\\Provision and Catalog\\Operational Analytics\\Tenant Analytics\\**Demo-TenantAnalyticsDB**.ps1 in PowerShell ISE.
1. Execute the script using **F5**.
    * This calls the Deploy-TenantAnalyticsDB.ps1 script which creates the tenant analytics database.

## Create a scheduled job to retrieve tenant analytics about ticket purchases

This script creates a job to retrieve ticket purchase information from all tenants. Once aggregated into a single table, you can gain rich insightful metrics about ticket purchasing patterns across the tenants.

1. Open SSMS and connect to the catalog-&lt;USER&gt;.database.windows.net server
1. Open the file …\\Learning Modules\\Provision and Catalog\\Operational Analytics\\Tenant Analytics\\TicketPurchasesfromAllTenants.sql
1. Modify &lt;WtpUser&gt;, use the user name used when you deployed the WTP app in two locations in the script, sp\_add\_target\_group\_member and sp\_add\_jobstep
1. Right click, select **Connection**, and connect to the catalog-&lt;WtpUser&gt;.database.windows.net server, if not already connected
1. Ensure you are connected to the jobaccount database and press **F5** to run the script

* **sp\_add\_target\_group** creates the target group name TenantGroup, now we need to add target members.
* **sp\_add\_target\_group\_member** adds a *server* target member type which deems all databases within that server (note this is the customer1-&lt;WtpUser&gt; server containing the tenant databases) at time of job execution should be included in the job.
* **sp\_add\_job** creates a new weekly scheduled job called “Ticket Purchases from all Tenants”
* **sp\_add\_jobstep** creates the job step containing T-SQL command text to retrieve all the ticket purchase information from all tenants and copy the returning result set into a table called AllTicketsPurchasesfromAllTenants
* The remaining views in the script display the existence of the objects and monitor job execution. Review the status value from the **lifecycle** column to monitor the status. Once, Succeeded, the job has successfully finished on all tenant databases and the two additional databases containing the reference table.

## Create a job to retrieve a summary count of ticket purchases from all tenants

This script creates a job to retrieve sum of all ticket purchases from all tenants.

1. Open SSMS and connect to the catalog-&lt;USER&gt;.database.windows.net server
1. Open the file …\\Learning Modules\\Provision and Catalog\\Operational Analytics\\Tenant Analytics\\CountOfTicketsPurchasedResults.sql
1. Modify &lt;WtpUser&gt;, use the user name used when you deployed the WTP app in the script, in the sp\_add\_jobstep sproc
1. Right click, select **Connection**, and connect to the catalog-&lt;WtpUser&gt;.database.windows.net server, if not already connected
1. Ensure you are connected to the jobaccount database and press **F5** to run the script

* **sp\_add\_job** creates a new weekly scheduled job called “ResultsTicketsOrders”

* **sp\_add\_jobstep** creates the job step containing T-SQL command text to retrieve all the ticket purchase information from all tenants and copy the returning result set into a table called CountofTicketOrders

* The remaining views in the script display the existence of the objects and monitor job execution. Review the status value from the **lifecycle** column to monitor the status. Once, Succeeded, the job has successfully finished on all tenant databases and the two additional databases containing the reference table.


## Next steps

## Additional resources

[Elastic Jobs](sql-database-elastic-jobs-overview.md)