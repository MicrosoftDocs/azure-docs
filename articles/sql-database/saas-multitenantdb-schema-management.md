---
title: Manage Azure SQL Database schema in a multi-tenant app | Microsoft Docs
description: "Manage Schema for multiple tenants in a multi-tenant application that uses Azure SQL Database"
keywords: sql database tutorial
services: sql-database
documentationcenter: ''
author: MightyPen
manager: craigg
editor: ''

ms.service: sql-database
ms.custom: scale out apps
ms.workload: "Inactive"
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/03/2018
ms.reviewers: billgib
ms.author: genemi
---
# Manage schema for multiple tenants in a multi-tenant application that uses Azure SQL Database

This tutorial examines the challenges in maintaining a potentially massive fleet of databases in a Software as a Service (SaaS) application in the cloud. Solutions are demonstrated for managing the schema enhancements that are developed and implemented during the life of an app.

As any application evolves, changes might occur to its table columns or other schema, or to its reference data, or to performance related items. With a SaaS app, these changes must be deployed in a coordinated manner across numerous existing tenant databases. And these changes must be included in future tenant databases that will be added to the app. Therefore the changes also must be incorporated into the process that provisions new databases.

#### Two scenarios

This tutorial explores the following two scenarios:
- Deploy reference data updates for all tenants.
- Retuning an index on the table that contains the reference data.

The [Elastic Jobs](sql-database-elastic-jobs-overview.md) feature of Azure SQL Database is used to execute these operations across tenant databases. The jobs also operate on the golden template tenant database. This template is used when new databases are provisioned.

In this tutorial you learn how to:

> [!div class="checklist"]
> * Create a job account.
> * Query across multiple tenants.
> * Update data in all tenant databases.
> * Create an index on a table in all tenant databases.

## Prerequisites

- The Wingtip Tickets app must already be deployed:
    - For instructions, see the first tutorial, which introduces the *Wingtip Tickets* SaaS multi-tenant database app:<br />[Deploy and explore a sharded multi-tenant application that uses Azure SQL Database](saas-multitenantdb-get-started-deploy.md).
        - The deploy process runs for less than five minutes.
    - You must have the *sharded multi-tenant* version of Wingtip installed. The versions for *Standalone* and *Database per tenant* do not support the present tutorial.

- The latest version of SQL Server Management Studio (SSMS) must be installed. [Download and Install SSMS](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms).

- Azure PowerShell must be installed. For details, see [Getting started with Azure PowerShell](https://docs.microsoft.com/powershell/azure/get-started-azureps).

> [!NOTE]
> This tutorial uses features of the Azure SQL Database service that are in a limited preview ([Elastic Database jobs](sql-database-elastic-database-client-library.md)). If you wish to do this tutorial, provide your subscription ID to *SaaSFeedback@microsoft.com* with subject=Elastic Jobs Preview. After you receive confirmation that your subscription has been enabled, [download and install the latest pre-release jobs cmdlets](https://github.com/jaredmoo/azure-powershell/releases). This preview is limited, so contact *SaaSFeedback@microsoft.com* for related questions or support.

## Introduction to SaaS schema management patterns

The sharded multi-tenant database model used in this sample enables a tenants database to contain one or more tenants. This sample explores the potential to use a mix of a many-tenant and one-tenant databases, enabling a *hybrid* tenant management model. Managing these databases is complicated. [Elastic Jobs](sql-database-elastic-jobs-overview.md) facilitates administration and management of the SQL data tier. Jobs enable you to securely and reliably run Transact-SQL scripts as tasks, against a group of tenant databases. The tasks are independent of user interaction or input. This method can be used to deploy changes to schema or to common reference data, across all tenants in an application. Elastic Jobs can also be used to maintain a golden template copy of the database. The template is used to create new tenants, always ensuring the latest schema and reference data are in use.

![screen](media/saas-multitenantdb-schema-management/schema-management.png)

## Elastic Jobs limited preview

There is a new version of Elastic Jobs that is now an integrated feature of Azure SQL Database. By integrated we mean it requires no additional services or components. This new version of Elastic Jobs is currently in limited preview. The limited preview currently supports PowerShell to create job accounts, and T-SQL to create and manage jobs.

## Get the Wingtip Tickets SaaS Multi-tenant Database application source code and scripts

The Wingtip Tickets SaaS Multi-tenant Database scripts and application source code are available in the [WingtipTicketsSaaS-MultitenantDB](https://github.com/microsoft/WingtipTicketsSaaS-MultiTenantDB) repository on Github. See the [general guidance](saas-tenancy-wingtip-app-guidance-tips.md) for steps to download and unblock the Wingtip Tickets SaaS scripts. 

## Create a job account database and new job account

This tutorial requires that you use PowerShell to create the job account database and job account. Like the MSDB database used by SQL Agent, Elastic Jobs uses an Azure SQL database to store job definitions, job status, and history. After the job account is created, you can create and monitor jobs immediately.

1. In **PowerShell ISE**, open *...\\Learning Modules\\Schema Management\\Demo-SchemaManagement.ps1*.
2. Press **F5** to run the script.

The *Demo-SchemaManagement.ps1* script calls the *Deploy-SchemaManagement.ps1* script to create a tier *S2* database named **jobaccount** on the catalog server. The script then creates the job account, passing the jobaccount database as a parameter to the job account creation call.

## Create a job to deploy new reference data to all tenants

#### Prepare

Each tenants database includes a set of venue types in the **VenueTypes** table. The venue types define the kind of events that are hosted at a venue. In this exercise, you deploy an update to all databases to add two additional venue types: *Motorcycle Racing* and *Swimming Club*. These venue types correspond to the background image you see in the tenant events app.

Before you deploy the new reference data, note the number of venue types that already exist, which might be 10. Take note by clicking the following link to the Wingtip web UI, and then clicking the **Venue Type** drop-down menu:
- http://events.wingtip-mt.<USER>.trafficmanager.net

Now you can count the number of original venue types. In particular, note that neither *Motorcycle Racing* nor *Swimming Club* yet exist.

#### Steps

Now you create a job to update the **VenueTypes** table in each tenants database, by adding the two new venue types.

To create a new job, you use the set of jobs system stored procedures that were created in the *jobaccount* database. The procedures were created when the job account was created.

1. In SSMS, connect to the tenant server: tenants1-mt-\<user\>.database.windows.net

2. Browse to the *tenants1* database on the *tenants1-mt-\<user\>.database.windows.net* server.

3. Query the *VenueTypes* table to confirm that *Motorcycle Racing* and *Swimming Club* are not yet in the results list.

4. Connect to the catalog server, which is *catalog-mt-\<user\>.database.windows.net*.

5. Connect to the *jobaccount* database in the catalog server.

6. In SSMS, open the file *...\\Learning Modules\\Schema Management\\DeployReferenceData.sql*.

7. Modify the statement: set @User = &lt;user&gt; and substitute the User value used when you deployed the Wingtip Tickets SaaS Multi-tenant Database application.

8. Press **F5** to run the script.

#### Observe

Observe the following items in the *DeployReferenceData.sql* script:

- **sp\_add\_target\_group** creates the target group name *DemoServerGroup*, and adds target members to the group.

- **sp\_add\_target\_group\_member** adds the following items:
    - A *server* target member type.
        - This is the *tenants1-mt-&lt;user&gt;* server that contains the tenants databases.
        - Thus all databases in the server are included in the job when the job executes.
    - A *database* target member type for the golden database (*basetenantdb*) that resides on *catalog-mt-&lt;user&gt;* server,
    - A *database* target member type to include the *adhocreporting* database that is used in a later tutorial.

- **sp\_add\_job** creates a job called *Reference Data Deployment*.

- **sp\_add\_jobstep** creates the job step containing T-SQL command text to update the reference table, VenueTypes.

- The remaining views in the script display the existence of the objects and monitor job execution. Use these queries to review the status value in the **lifecycle** column to determine when the job has successfully finished. The job updates the tenants database, and updates the two additional databases that contain the reference table.

In SSMS, browse to the tenant database on the *tenants1-mt-&lt;user&gt;* server. Query the *VenueTypes* table to confirm that *Motorcycle Racing* and *Swimming Club* are now added to the table. The total count of venue types should have increased by two.

## Create a job to manage the reference table index

This exercise is similar to the previous exercise. This exercise creates a job to rebuild the index on the reference table primary key. An index rebuild is a typical database management operation that an administrator might run after a large data load into a table, to improve performance.

1. In SSMS, connect to *jobaccount* database in *catalog-mt-&lt;User&gt;.database.windows.net* server.

2. In SSMS, open *...\\Learning Modules\\Schema Management\\OnlineReindex.sql*.

3. Press **F5** to run the script.

#### Observe

Observe the following items in the *OnlineReindex.sql* script:

* **sp\_add\_job** creates a new job called *Online Reindex PK\_\_VenueTyp\_\_265E44FD7FD4C885*.

* **sp\_add\_jobstep** creates the job step containing T-SQL command text to update the index.

* The remaining views in the script monitor job execution. Use these queries to review the status value in the **lifecycle** column to determine when the job has successfully finished on all target group members.

## Additional resources

<!-- TODO: Additional tutorials that build upon the Wingtip Tickets SaaS Multi-tenant Database application deployment (*Tutorial link to come*)
(saas-multitenantdb-wingtip-app-overview.md#sql-database-wingtip-saas-tutorials)
-->
* [Managing scaled-out cloud databases](sql-database-elastic-jobs-overview.md)
* [Create and manage scaled-out cloud databases](sql-database-elastic-jobs-create-and-manage.md)

## Next steps

In this tutorial you learned how to:

> [!div class="checklist"]
> - Create a job account to query across multiple tenants.
> - Update data in all tenant databases.
> - Create an index on a table in all tenant databases.

Next, try the [Ad-hoc reporting tutorial](saas-multitenantdb-adhoc-reporting.md).

