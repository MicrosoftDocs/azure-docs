---
title: Introduction to the Wingtip SaaS application that uses Azure SQL Database | Microsoft Docs 
description: "Learn by using a sample multi-tenant application that uses Azure SQL Database, the Wingtip SaaS app"
keywords: sql database tutorial
services: sql-database
author: stevestein
manager: jhubbard

ms.service: sql-database
ms.custom: tutorial
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/24/2017
ms.author: sstein

---
# Introduction to the Wingtip SaaS application

The *Wingtip SaaS* application is a sample multi-tenant app, that demonstrates the unique advantages of SQL Database. The app uses a database-per-tenant, SaaS application pattern, to service multiple tenants. The app is designed to showcase features of Azure SQL Database that enable SaaS scenarios, including several SaaS design and management patterns. To quickly get up and running, [the Wingtip SaaS app deploys in less than five minutes](sql-database-saas-tutorial.md)!

Application source code and management scripts are available in the [WingtipSaaS](https://github.com/Microsoft/WingtipSaaS) github repo. To run the scripts, [download the Learning Modules folder](#download-the-wingtip-saas-scripts) to your local computer.

## SQL Database Wingtip SaaS tutorials

After deploying the app, explore the following tutorials that build upon the initial deployment. These tutorials step through implementing common SaaS patterns by taking advantage of built-in features of SQL Database. Tutorials include reusable scripts, with detailed explanations that greatly simplify understanding, and implementing the same SaaS management patterns in your applications.


| Tutorial | Description | Script location |
|:--|:--|:--|
|[Provision and catalog tenants](sql-database-saas-tutorial-provision-and-catalog.md)| Learn how the application manages tenants using a catalog database, and how the catalog maps tenants to their data. | [Learning Modules/Provision and Catalog/](https://github.com/Microsoft/WingtipSaaS/tree/master/Learning%20Modules/Provision%20and%20Catalog) |
|[Monitor and manage performance](sql-database-saas-tutorial-performance-monitoring.md)| Learn how to use monitoring features of SQL Database, and how to set alerts when performance thresholds are exceeded. | [Learning Modules/Performance Monitoring and Management/](https://github.com/Microsoft/WingtipSaaS/tree/master/Learning%20Modules/Performance%20Monitoring%20and%20Management) |
|[Restore a single tenant](sql-database-saas-tutorial-restore-single-tenant.md)| Learn how to restore a tenant database to a previous point in time. Steps to restore to a parallel database, leaving the existing tenant database online, are also included. | [Learning Modules/Business Continuity and Disaster Recovery/RestoreTenant/](https://github.com/Microsoft/WingtipSaaS/tree/master/Learning%20Modules/Business%20Continuity%20and%20Disaster%20Recovery/RestoreTenant) |
|[Manage tenant schema](sql-database-saas-tutorial-schema-management.md)| Learn how to update schema and data, across all Wingtip SaaS tenants.  | [Learning Modules/Schema Management/](https://github.com/Microsoft/WingtipSaaS/tree/master/Learning%20Modules/Schema%20Management) |
|[Run ad-hoc analytics](sql-database-saas-tutorial-adhoc-analytics.md) | Create an ad-hoc analytics database and run queries across all tenants  | [Learning Modules/Operational Analytics/Adhoc Analytics/](https://github.com/Microsoft/WingtipSaaS/tree/master/Learning%20Modules/Operational%20Analytics/Adhoc%20Analytics) |
|[Monitor with Log Analytics (OMS)](sql-database-saas-tutorial-log-analytics.md) | Learn about using [Log Analytics](../log-analytics/log-analytics-overview.md) to monitor large amounts of resources, across multiple pools. | [Learning Modules/Performance Monitoring and Management/LogAnalytics/](https://github.com/Microsoft/WingtipSaaS/tree/master/Learning%20Modules/Performance%20Monitoring%20and%20Management/LogAnalytics) |
|[Run tenant analytics](sql-database-saas-tutorial-tenant-analytics.md) |  Run analytics queries against all tenants. | [Learning Modules/Operational Analytics/Tenant Analytics/](https://github.com/Microsoft/WingtipSaaS/tree/master/Learning%20Modules/Operational%20Analytics/Tenant%20Analytics) |



## Application architecture

The Wingtip SaaS app uses the database-per-tenant model, and uses SQL elastic pools to maximize efficiency. For provisioning and mapping tenants to their data, a catalog database is used. The core Wingtip SaaS application, uses a pool with three sample tenants, plus the catalog database. Completing many of the Wingtip SaaS tutorials result in add-ons to the intial deployment, by introducing analytic databases, cross-database schema management, etc.


![Wingtip SaaS architecture](media/sql-database-wtp-overview/app-architecture.png)


While the application is somewhat complete and compelling as a sample application, it is important to focus on the core SaaS patterns as they relate to the data tier. In other words, focus on the data tier, and don't over analyze the app itself. Understanding the implementation of these core SaaS patterns is key to implementing these patterns in your applications, while considering any necessary modifications for your specific business requirements.

## Download the Wingtip SaaS scripts

1. Browse to [the Wingtip SaaS github repo](https://github.com/Microsoft/WingtipSaaS).
1. Click **Clone or download**.
1. Click **Download ZIP** and save the file.

**IMPORTANT**: Executable contents (scripts, dlls) may be blocked by Windows when zip files are downloaded from an external source and extracted. When extracting the repo or Learning Modules from a zip file, make sure you unblock the .zip file before extracting to ensure the scripts are allowed to run:

1. Right-click the **WingtipSaaS-master.zip** file, and select **Properties**.
1. Select **Unblock**, and click **Apply**.
1. Click **OK**.
1. You can now extract the files.

Scripts are located in the *...\\WingtipSaaS-master\\Learning Modules* folder.

## Working with the Wingtip SaaS PowerShell Scripts

The benefits of working with the application comes from diving into the provided scripts and examining how the different SaaS patterns are implemented.

To view the provided scripts and modules, and to facilitate stepping through them for a better understanding, **use the [Windows PowerShell ISE](https://msdn.microsoft.com/powershell/scripting/core-powershell/ise/introducing-the-windows-powershell-ise)**. Because most of the scripts prefixed with *Demo-* contain variables that you can modify before execution, using the PowerShell ISE simplifies working with these scripts.

For each Wingtip SaaS app deployment, there is a **UserConfig.psm1** file containing two parameters for setting the resource group and user name values that you defined during deployment. After deployment is complete, edit the **UserConfig.psm1** module setting the _ResourceGroupName_ and _Name_  parameters. These values are used by other scripts to successfully run, so setting them when the deployment completes is recommended!



### Execute Scripts by pressing F5

Several scripts use *$PSScriptRoot* to allow navigating folders, and this variable is only evaluated when the script is executed by pressing **F5**.  Highlighting and running a selection (**F8**) can result in errors, so press **F5** when running scripts.

### Step through the scripts to examine the implementation

The real value in exploring the scripts comes from stepping through them to see what they do. Check out the first-level _Demo-_ scripts that provide an easy to read high-level workflow showing the steps required to accomplish each task. Drill deeper into the individual calls to see implementation details for the different SaaS patterns.

Tips for working with and [debugging PowerShell scripts](https://msdn.microsoft.com/powershell/scripting/core-powershell/ise/how-to-debug-scripts-in-windows-powershell-ise):

* Open and configure demo- scripts in the PowerShell ISE.
* Execute or continue with **F5**. Using **F8** is not advised because *$PSScriptRoot* is not evaluated when running selections of a script.
* Place breakpoints by clicking or selecting a line and pressing **F9**.
* Step over a function or script call using **F10**.
* Step into a function or script call using **F11**.
* Step out of the current function or script call using **Shift + F11**.




## Explore database schema and execute SQL queries using SSMS

Use [SQL Server Management Studio (SSMS)](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms) to connect and browse the application servers and databases.

The deployment initially has two SQL Database servers to connect to - the *tenants1-&lt;User&gt;* server, and the *catalog-&lt;User&gt;* server. To ensure a successful demo connection, both servers have a [firewall rule](sql-database-firewall-configure.md) allowing all IPs through.


1. Open *SSMS* and connect to the *tenants1-&lt;User&gt;.database.windows.net* server.
1. Click **Connect** > **Database Engine...**:

   ![catalog server](media/sql-database-wtp-overview/connect.png)

1. Demo credentials are: Login = *developer*, Password = *P@ssword1*

   ![connection](media\sql-database-wtp-overview\tenants1-connect.png)

1. Repeat steps 2-3 and connect to the *catalog-&lt;User&gt;.database.windows.net* server.

After successfully connecting you should see both servers. You might see more or less databases depending on how many tenants you provisioned:

![object explorer](media/sql-database-wtp-overview/object-explorer.png)



## Next steps

[Deploy the Wingtip SaaS application](sql-database-saas-tutorial.md)