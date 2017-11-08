---
title:  Migrate AdventureWorks2014 from SQL Server to Azure SQL | Microsoft Docs
description: Migrate AdventureWorks2014 from SQL Server to Azure SQL using Data Migration Assistant and Data Migration Service.
services: database-migration
author: edmacauley
ms.author: edmaca
manager: craigg
ms.reviewer: 
ms.service: database-migration
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 11/02/2017
---

# Migrate AdventureWorks
This article migrates the sample AdventureWorks 2014 database from an on-premises SQL Server instance to an Azure SQL database.  It uses Microsoft Data Migration Assistant to migrate the schema and Azure Data Migration Service to migrate the data.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Prerequisites
- Azure Data Migration Service requires a VNET created by using the Azure Resource Manager deployment model, which provides site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) or [VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways).
- This how-to also requires resources created by the quickstart [Prepare to migrate AdventureWorks](quickstart-prepare-to-migrate.md).  Please complete the quickstart before this how-to article.

## Create a migration project
1. Open Microsoft Data Migration assistant and choose **+** to create a new project.
1. Set **Project type** to "Migration."
1. Give the project a memorable name.
1. Choose "SQL Server" for **Source server type**.
1. For **Target server type**, choose "Azure SQL Database."
1. **Migration scope** must be set to "Schema only."
![Create a new project](media/howto-sql-server-to-azure-sql/DMANewProject.png)
1. Click **Create**.

## Select schema source
1. Enter your server name or IP address.
1. Choose the appropriate **authentication type** for your server.  This example uses SQL Authentication, your screen may look slightly different.
1. Enter your **username** and **password**.
1. Ensure **Encrypt connection** is checked and if you are using a self-signed certificate also check **Trust server certificate**
1. Click **Connect**.
![Select migration source](media/howto-sql-server-to-azure-sql/DMASelectSource.png)
1. Choose AdventureWorks 2014 and click **Next**.

> [!NOTE]
> Credentials used to connect to the source SQL Server instance must have CONTROL SERVER permission.

## Select schema target
1. Enter the name of your Azure SQL server.
1. Choose the appropriate **Authentication type** for your server.  This example uses SQL Authentication, your screen may look slightly different.
1. Ensure **Encrypt connection** is checked.
1. Click **Connect**.
1. Choose your Azure SQL database and then click **Next**.
![Select migration target](media/howto-sql-server-to-azure-sql/DMASelectTarget.png)

> [!NOTE]
> The principal used to connect to the target Azure SQL database must have CONTROL DATABASE permission on the target database.

## Select schema objects
Choose the objects you want to migrate to the target.  By default all of the database objects are selected.  You can click on individual objects and see any issues associated with it.  For purposes of this quickstart, you don't need to be concerned with any of the listed issues.

![Select objects](media/howto-sql-server-to-azure-sql/DMASelectObjects.png)

When you're satisfied that all database objects are selected, click **Generate SQL scripts**.

## Script and deploy schema
You can review potential migration issues by clicking **Next issue** and **Previous issue**.  You should see a total of four instances of these two issues:

- Full-Text Search has changed since SQL Server 2008.
- SERVERPROPERTY('LCID') result differs from SQL Server 2000.

You don't need to be concerned with any of these issues, they are warnings and not errors.  When you're ready, click **Deploy schema**.

## Log in to the Azure portal
Open your web browser, and navigate to the [Microsoft Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

## Select migration service
Select the Database Migration Service instance that you created in the quickstart [Prepare to migrate AdventureWorks](quickstart-prepare-to-migrate.md).

## Create new migration project
1. Click on "New Migration Project."
1. Give the project a memorable name.
1. Select "SQL Server" as the **Source server type**.
1. Set **Target server type** to  "Azure SQL Database."
![New migration](media/howto-sql-server-to-azure-sql/DMSNewMigration.png)
1. Click **Start**.

## Select data target
Setting|Suggested value|Description
---|---|---
Server name |*example-name*|Enter the fully qualified name of your Azure SQL server.
Authentication type||Choose the appropriate type for your server, either "SQL Authentication" or "Windows Authentication."
User name|*myusername*| Your user name
Password |*mypassword*| Your password

![Migration target details](media/howto-sql-server-to-azure-sql/DMSSelectTarget.png)

Ensure **Encrypt connection** is checked and if you are using a self-signed certificate also check **Trust server certificate**.

## Select data source
Setting|Suggested value|Description
---|---|---
Server name |*example-name*|Enter the fully qualified name or IP address of your SQL Server.
Authentication type| |Choose the appropriate type for your server, either "SQL Authentication" or "Windows Authentication"
User name|*myusername*| Your user name
Password |*mypassword*| Your password

![Migration source detail](media/howto-sql-server-to-azure-sql/DMSSelectSource.png)

Ensure **Encrypt connection** is checked and if you are using a self-signed certificate also check **Trust server certificate**.

> [!NOTE]
> If you enter your credentials correctly but still receive an error message, you need to check **Trust server certificate**.

## Select source databases
Check AdventureWorks2014 and select your target database.  You can make a database read only for the duration of the migration.

![Select source databases](media/howto-sql-server-to-azure-sql/DMSSelectSourceDatabases.png)

Click **Save**

## Select tables
If it exists in the source, target, and is empty, a table is automatically checked for migration.  Expand AdventureWorks2014 and review the selected tables. When you are satisfied that they are all selected, click **Save**.

![Select Tables to Migrate](media/howto-sql-server-to-azure-sql/DMSSelectTables.png)


## Run and monitor
To see detailed migration status:

1. Click **Run migration**.
1. Click your migration's name.
1. Click AdventureWorks2014.

![Migration status](media/howto-sql-server-to-azure-sql/DMSMonitor.png)


## Next steps
For information about Database Migration Service, see [Tutorial: Migrate SQL Server on-premises to Azure SQL DB](tutorial-sql-server-to-azure-sql.md)
