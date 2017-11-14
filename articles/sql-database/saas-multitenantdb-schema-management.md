---
title: Manage Azure SQL Database schema in a multi-tenant app | Microsoft Docs
description: "Manage Schema for multiple tenants in a multi-tenant application that uses Azure SQL Database"
keywords: sql database tutorial
services: sql-database
documentationcenter: ''
author: stevestein
manager: craigg
editor: ''

ms.assetid:
ms.service: sql-database
ms.custom: scale out apps
ms.workload: "Inactive"
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/28/2017
ms.author: billgib; sstein

---
# Manage Schema for multiple tenants in a multi-tenant application that uses Azure SQL Database

The [first Wingtip Tickets SaaS Multi-tenant Database tutorial](saas-multitenantdb-get-started-deploy.md) shows how the app can provision a sharded multi-tenant database and register it in the catalog. Like any application, the Wingtip Tickets SaaS app will evolve over time, and at times will require changes to the database. Changes may include new or changed schema, new or changed reference data, and routine database maintenance tasks to ensure optimal app performance. With a SaaS application, these changes need to be deployed in a coordinated manner across a potentially massive fleet of tenant databases. For these changes to be in future tenant databases, they need to be incorporated into the provisioning process.

This tutorial explores two scenarios - deploying reference data updates for all tenants, and retuning an index on the table containing the reference data. The [Elastic jobs](sql-database-elastic-jobs-overview.md) feature is used to execute these operations across tenant database(s), and the *golden* tenant database that is used as a template for new databases.

In this tutorial you learn how to:

> [!div class="checklist"]

> * Create a job account
> * Query across multiple tenants
> * Update data in all tenant databases
> * Create an index on a table in all tenant databases


To complete this tutorial, make sure the following prerequisites are met:

* The Wingtip Tickets SaaS Multi-tenant Database application is deployed. To deploy in less than five minutes, see [Deploy and explore the Wingtip Tickets SaaS Multi-tenant Database  application](saas-multitenantdb-get-started-deploy.md)
* Azure PowerShell is installed. For details, see [Getting started with Azure PowerShell](https://docs.microsoft.com/powershell/azure/get-started-azureps)
* The latest version of SQL Server Management Studio (SSMS) is installed. [Download and Install SSMS](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms)

*This tutorial uses features of the SQL Database service that are in a limited preview (Elastic Database jobs). If you wish to do this tutorial, provide your subscription id to SaaSFeedback@microsoft.com with subject=Elastic Jobs Preview. After you receive confirmation that your subscription has been enabled, [download and install the latest pre-release jobs cmdlets](https://github.com/jaredmoo/azure-powershell/releases). This preview is limited, so contact SaaSFeedback@microsoft.com for related questions or support.*


## Introduction to SaaS Schema Management patterns

The sharded multi-tenant database model used in this sample enables a tenants database to contain any number of tenants. This sample explores the potential to use a mix of a multi-tenant and single-tenant databases, enabling a 'hybrid' tenant management model. Maintaining and Managing these databases is complicated. [Elastic Jobs](sql-database-elastic-jobs-overview.md) facilitates administration and management of the SQL data tier. Jobs enable you to securely and reliably, run tasks (T-SQL scripts) independent of user interaction or input, against a group of databases. This method can be used to deploy schema and common reference data changes across all tenants in an application. Elastic Jobs can also be used to maintain a *golden* copy of the database used to create new tenants, ensuring it always has the latest schema and reference data.

![screen](media/saas-multitenantdb-schema-management/schema-management.png)

## Elastic Jobs limited preview

There is a new version of Elastic Jobs that is now an integrated feature of Azure SQL Database (that requires no additional services or components). This new version of Elastic Jobs is currently in limited preview. This limited preview currently supports PowerShell to create job accounts, and T-SQL to create and manage jobs.

> [!NOTE]
> *This tutorial uses features of the SQL Database service that are in a limited preview (Elastic Database jobs). If you wish to do this tutorial, provide your subscription id to SaaSFeedback@microsoft.com with subject=Elastic Jobs Preview. After you receive confirmation that your subscription has been enabled, [download and install the latest pre-release jobs cmdlets](https://github.com/jaredmoo/azure-powershell/releases). This preview is limited, so contact SaaSFeedback@microsoft.com for related questions or support.*

## Get the Wingtip Tickets SaaS Multi-tenant Database application scripts

The Wingtip Tickets SaaS Multi-tenant Database scripts and application source code are available in the [WingtipTicketsSaaS-MultiTenantDB](https://github.com/Microsoft/WingtipTicketsSaaS-MultiTenantDB) GitHub repository. Steps to download the Wingtip Tickets SaaS Multi-tenant Database scripts (*Tutorial link to come*). <!-- (saas-multitenantdb-wingtip-app-guidance-tips.md#download-and-unblock-the-wingtip-saas-scripts)-->

## Create a job account database and new job account

This tutorial requires you use PowerShell to create the job account database and job account. Like MSDB and SQL Agent, Elastic Jobs uses an Azure SQL database to store job definitions, job status, and history. Once the job account is created, you can create and monitor jobs immediately.

1. In **PowerShell ISE**, open *…\\Learning Modules\\Schema Management\\Demo-SchemaManagement.ps1*.
1. Press **F5** to run the script.

The *Demo-SchemaManagement.ps1* script calls the *Deploy-SchemaManagement.ps1* script to create an *S2* database named **jobaccount** on the catalog server. It then creates the job account, passing the jobaccount database as a parameter to the job account creation call.

## Create a job to deploy new reference data to all tenants

Each tenants database includes a set of venue types in table **VenueTypes** that define the kind of events that are hosted at a venue. In this exercise, you deploy an update to all the databases to add two additional venue types: *Motorcycle Racing* and *Swimming Club*. These venue types correspond to the background image you see in the tenant events app.

Click the Venue Type drop down menu and validate that only 10 venue type options are available, and specifically that ‘Motorcycle Racing’ and ‘Swimming Club’ are not included in the list.

Now let’s create a job to update the **VenueTypes** table in all the tenants database(s) and add the new venue types.

To create a new job, we use a set of jobs system stored procedures created in the jobaccount database when the job account was created.

1. In SSMS, connect to the tenant server: tenants1-mt-\<user\>.database.windows.net
2. Browse to the *tenants1* database on the *tenants1-mt-\<user\>.database.windows.net* server and query the *VenueTypes* table to confirm that *Motorcycle Racing* and *Swimming Club* are **not** in the results list.
2. Connect to the catalog server: catalog-mt-\<user\>.database.windows.net
3. Connect to the jobaccount database in the catalog server.
4. In SSMS, open the file …\\Learning Modules\\Schema Management\\DeployReferenceData.sql
5. Modify the statement: set @User = &lt;user&gt; and substitute the User value used when you deployed the Wingtip Tickets SaaS Multi-tenant Database application.
6. Press **F5** to run the script.

* **sp\_add\_target\_group** creates the target group name DemoServerGroup, now add target members to the group.
* **sp\_add\_target\_group\_member** adds a *server* target member type, which deems all databases within that server (note this is the tenants1-mt-&lt;user&gt; server containing the tenants database) at time of job execution to be included in the job, a *database* target member type, for the ‘golden’ database (basetenantdb) that resides on catalog-mt-&lt;user&gt; server, and lastly a *database* target member type to include the adhocreporting database that is used in a later tutorial.
* **sp\_add\_job** creates a job called “Reference Data Deployment”.
* **sp\_add\_jobstep** creates the job step containing T-SQL command text to update the reference table, VenueTypes.
* The remaining views in the script display the existence of the objects and monitor job execution. Use these queries to review the status value in the **lifecycle** column to determine when the job has successfully finished on tenants database and the two additional databases containing the reference table.

1. In SSMS, browse to the tenant database on the *tenants1-mt-&lt;user&gt;* server and query the *VenueTypes* table to confirm that *Motorcycle Racing* and *Swimming Club* are now **added* to the table.


## Create a job to manage the reference table index

Similar to the previous exercise, this exercise creates a job to rebuild the index on the reference table primary key, a typical database management operation an administrator might perform after a large data load into a table.


1. In SSMS, connect to jobaccount database in catalog-mt-&lt;User&gt;.database.windows.net server.
2. In SSMS, open …\\Learning Modules\\Schema Management\\OnlineReindex.sql.
3. Press **F5** to run the script

* **sp\_add\_job** creates a new job called “Online Reindex PK\_\_VenueTyp\_\_265E44FD7FD4C885”.
* **sp\_add\_jobstep** creates the job step containing T-SQL command text to update the index.
* The remaining views in the script monitor job execution. Use these queries to review the status value in the **lifecycle** column to determine when the job has successfully finished on on all target group members.

## Next steps

In this tutorial you learned how to:

> [!div class="checklist"]

> * Create a job account to query across multiple tenants
> * Update data in all tenant databases
> * Create an index on a table in all tenant databases

[Ad-hoc analytics tutorial](saas-multitenantdb-adhoc-reporting.md)


## Additional resources

* Additional tutorials that build upon the Wingtip Tickets SaaS Multi-tenant Database application deployment (*Tutorial link to come*)
<!--(saas-multitenantdb-wingtip-app-overview.md#sql-database-wingtip-saas-tutorials)-->
* [Managing scaled-out cloud databases](sql-database-elastic-jobs-overview.md)
* [Create and manage scaled-out cloud databases](sql-database-elastic-jobs-create-and-manage.md)
