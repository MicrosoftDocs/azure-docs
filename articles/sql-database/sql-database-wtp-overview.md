---
title: SaaS in a box (sample SaaS application using Azure SQL Database) | Microsoft Docs 
description: "Build SaaS applications using SQL Database"
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
# Introduction to the Wingtip Tickets Platform (WTP) sample SaaS application

The Wingtip Tickets Platform (WTP) SaaS application is a sample app that demonstrates many unique advantages SQL Database. The app uses a database-per-tenant, SaaS application pattern, to service multiple tenants. The WTP app is designed to showcase features of Azure SQL Database that enable SaaS scenarios, including SaaS design and management patterns. To quickly get up and running, [the WTP app deploys in less than five minutes](sql-database-saas-tutorial.md)!

After deploying the WTP app, explore the provided [collection of tutorials](#sql-database-saas-tutorials) that build upon the initial deployment. Each tutorial focuses on typical tasks that are implemented in SaaS applications. Tasks are implemented following SaaS patterns that take advantage of built-in features of SQL Database, such as provisioning new tenants, restoring tenant databases, running queries and rolling out schema changes across all tenant database. Each tutorial includes reusable scripts with detailed explanations that greatly simplify understanding and implementing the SaaS management patterns in your applications.

While the WTP application is designed to be somewhat complete and compelling as a sample application, it is important to focus on the core SaaS patterns as they relate to the data tier, as opposed to over analyzing the app itself. Understanding the implementation of these core SaaS patterns is key to implementing these patterns in your applications, while considering any necessary modifications for your specific business requirements.


## Application architecture

The WTP app uses the database-per-tenant model, and uses SQL elastic pools to maximize efficiency.
Use of a tenant catalog for provisioning management and connectivity.
Integrated app, pool, and database monitoring, and alerting (OMS).
Cross-tenant schema and reference data management (elastic database jobs).
Cross-tenant query, operational analytics (elastic query).
Using geo-distributed data for expanded reach.
Business continuity
    Single-tenant recovery (PITR)
    DR at scale (geo-restore, geo-replication, auto-DR)
Tenant self-service management (via management APIs)
    PITR to recover from self-inflicted oops.

The core Wingtip application, uses a pool with three sample tenants, plus a catalog database.

![WTP architecture](media/sql-database-wtp-overview/wtp-architecture.png)



## Working with the WTP PowerShell Scripts

The benefits of working with the WTP application comes from diving into the provided scripts and examining how the different SaaS patterns are implemented.

To view the provided scripts and modules, and to facilitate stepping through them for a more complete understanding, use the [Windows PowerShell ISE](https://msdn.microsoft.com/powershell/scripting/core-powershell/ise/introducing-the-windows-powershell-ise). Because most of the scripts prefixed with _Demo-_ contain variables that you can modify before execution, using the PowerShell ISE simplifies working with these scripts.

For each WTP app deployment, there is a **UserConfig.psm1** containing parameters for setting the resource group and user name values that you defined during deployment. After deployment is complete, edit the **UserConfig.psm1** module setting the _ResourceGroupName_ and _Name_  parameters. These values are used by other scripts to succesfully run, so setting them as soon as the deployment completes is recommended!

### Get the WTP scripts

The WTP scripts are located in a convenient .zip file in the git repo. Browse to the  **SaaS in a Box Learning Modules and Utilities.zip**, and download and extract to a convenient folder.

### Execute Scripts by pressing F5

Many scripts use _$PSScriptRoot_ to allow navigation among folders and this variable is only evaluated when the full script is executed by pressing **F5**.  Highlighting and running only a selection (**F8**) can result in errors.

### Stepping through the scripts

The real value in exploring the scripts comes from stepping through them to see what they do. Check out the first-level _Demo-_ scripts that provide an easy to read high-level workflow showing the steps required to accomplish each task. Drill deeper into the individual calls to see implemention details for the different SaaS patterns. 

Tips for working with and [debugging PowerShell scripts](https://msdn.microsoft.com/powershell/scripting/core-powershell/ise/how-to-debug-scripts-in-windows-powershell-ise):

* Open and configure demo- scripts in the PowerShell ISE.
* Execute or continue with **F5** (using F8 is not advised because _$PSScriptRoot_ is not evaluated when running snippets of a script).
* Place breakpoints by clicking in or selecting a line and pressing **F9**.
* Step over a function or script call using **F10**.
* Step into a function or script call using **F11**.
* Step out of the current function or script call using **Shift + F11**.



**PowerShell Tips**

* Open and configure demo- scripts in the PowerShell ISE.
* Use F5 to run the script (using F8 is not advised as the $PSScriptRoot variable is not evaluated when running snippets of a script).
* Use F9 to set a breakpoint to let you trace the script in debug mode to see how it works
* Use F10 to step through the script, F11 to step into a function, and Shift-F11 to step out.

To save time, it’s recommended to **pre-install the batch of tenants** (this is described at the end of the Provision and Catalog tutorial, as well as in this tutorial below).


## SQL Database SaaS tutorials

The following tutorials build upon the initial WTP application and can be done in any order.

| Area | Description | Script location |
|:--|:--|:--|
|[Provision and Catalog](sql-database-saas-tutorial-provision-and-catalog.md)| Provision new tenants and register them in the catalog. | github link |
|Restore Single Tenant| Restore tenant databases showing two recovery patterns. | github link |
|Schema Management| Execute operations across all tenants.  | github link |
|Catalog Sync| desc | github link |
|Performance Monitoring and Management| Monitor and manage databases and pools, and how to respond to variations in workload. | github link |
|Log Analytics| desc | github link |
|Tenant Analytics| Run analytics queries that are distributed across all the tenants.  | github link |
|Ad-hoc Analytics| Create an ad-hoc analytics database and query across tenants to expose hidden insights.  | github link |
|Devops and Support| Search the catalog by venue name to determine the server and database names for each tenant | github link |


## Explore database schema and execute SQL queries directly using SSMS

Use [SQL Server Management Studio (SSMS)](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms) to connect and browse the WTP servers and databases.

The WTP sample app initially has two SQL Database servers you can connect to:

| Fully qualified server name | Description | Admin |
| :-- | :-- | :-- |
| catalog-<User>.database.windows.net | contains the mapping between tenants and their data | developer |
| tenants1-<User>.database.windows.net | contains the tenant databases (in SQL elastic pools)| developer |

1. Open SSMS


## Want to learn more about SaaS applications?

A series of tutorials is provided that accompany the WTP app which each explores a different set of SaaS patterns through hand-on exercises that lead you through sample scripts and templates. Each exercise is quick to do and the tutorials can be followed in any order. To locate the tutorials look in the folders beneath …\\Learning Modules\\ .

Deleting the resources created with this tutorial

When you are finished exploring and working with the WTP app, browse to the application's resource group in the portal and delete it to stop all billing related to this deployment. If you have used any of the accompanying tutorials, any resources they created will also be deleted with the application.

Other resources

* To learn about elastic pools, see [*What is an Azure SQL elastic pool*](https://docs.microsoft.com/azure/sql-database/sql-database-elastic-pool)
* To learn about elastic jobs, see [*Managing scaled-out cloud databases*](https://docs.microsoft.com/azure/sql-database/sql-database-elastic-jobs-overview)
* To learn about multi-tenant SaaS applications, see [*Design patterns for multi-tenant SaaS applications*](https://docs.microsoft.com/azure/sql-database/sql-database-design-patterns-multi-tenancy-saas-applications)
