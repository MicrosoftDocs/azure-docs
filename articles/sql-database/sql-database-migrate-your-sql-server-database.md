---
title: Migrate SQL Server DB to  Azure SQL database | Microsoft Docs
description: Learn to migrate your SQL Server databse to Azure SQL database.
services: sql-database
documentationcenter: ''
author: janeng
manager: jstrauss
editor: ''
tags: ''

ms.assetid: 
ms.service: sql-database
ms.custom: tutorial
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: ''
ms.date: 03/30/2017
ms.author: janeng

---

# Migrate your SQL Server database to Azure SQL database

In this tutorial, you use the Azure portal, the SQLPackage command line utility, the [Data Migration Assistant](https://blogs.msdn.microsoft.com/datamigration/dma/), [Visual Studio Data Tools](https://docs.microsoft.com/sql/ssdt/download-sql-server-data-tools-ssdt), and [SQL Server Management Studio](https://msdn.microsoft.com/library/ms174173.aspx) to migrate the [SQL Server 2008R2 AdventureWorks OLTP database](https://msftdbprodsamples.codeplex.com/releases/view/59211) to Azure SQL Database. You start by creating an Azure SQL Database logical server and server-level firewall rule using the Azure portal. Next, you validate the compatibility of your SQL Server database with Azure SQL Database using the Data Migration Assistant, and then fix compatibility issues using Visual Studio Data Tools. Next, you export the database as a BACPAC file to local storage using SQLPackage and then import the BACPAC as a new database on your Azure Database server. Finally, you connect to the migrated database using SQL Server Management Studio. 

To complete this tutorial, make sure you have installed the following:

- The newest version of [SQL Server Management Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms) (this download also installs the newest version of SQLPackage) 
- The [Data Migration Assistant](https://www.microsoft.com/download/details.aspx?id=53595)
- [Visual Studio Data Tools](https://msdn.microsoft.com/mt186501)
- The [SQL Server 2008R2 AdventureWorks OLTP database](https://msftdbprodsamples.codeplex.com/releases/view/59211) on an instance of SQL Server 2008R2 or newer. 

## Step 1: Log in to the Azure portal

Log in to the [Azure portal](https://portal.azure.com/).

## Step 2: Create a SQL Database logical server

An [Azure SQL Database logical server](sql-database-features.md) acts as a central administrative point for multiple databases. Follow these steps to create a SQL Database logical server to contain the migrated Adventure Works OLTP SQL Server database. 

1. Click the **New** button found on the upper left-hand corner of the Azure portal.

2. Type **server** in the search window on the **New** page, and select **SQL database (logical server)** from the filtered list in the Marketplace.

    <img src="./media/sql-database-migrate-your-sql-server-database/logical-server.png" alt="select logical server" style="width: 780px;" />

3. On the **Everything** page, click **SQL server (logical server)** and then click **Create** on the **SQL Server (logical server)** page.

    <img src="./media/sql-database-migrate-your-sql-server-database/logical-server-create.png" alt="create logical server" style="width: 780px;" />

4. Fill out the SQL server (logical server) form with the following information, as shown on the preceding image:     

   - Server name: Specify a globally unique server name
   - Server admin login: Provide a name for the Server admin login
   - Password: specify the password of your choice
   - Resource group: Specify **Create new** and specify **myResourceGroup**
   - Location: Select a data center location

    <img src="./media/sql-database-migrate-your-sql-server-database/logical-server-create-completed.png" alt="create logical server completed form" style="width: 780px;" />

5. Click **Create**  to provision the logical server. Provisioning takes a few minutes. 

## Step 3: Create a server-level firewall rule

The SQL Database service creates a firewall at the server-level preventing external applications and tools from connecting to the server or any databases on the server unless a firewall rule is created to open the firewall for specific IP addresses. Follow these steps to create a [SQL Database server-level firewall rule](sql-database-firewall-configure.md) for your client's IP address and enable external connectivity through the SQL Database firewall for your IP address only. 

1. After the deployment completes, click **All resources** from the left-hand menu and click your new server on the **All resources** page. The overview page for your server opens, showing you the fully qualified server name (such as **mynewserver20170403.database.windows.net**) and provides options for further configuration.

     <img src="./media/sql-database-migrate-your-sql-server-database/logical-server-overview.png" alt="logical server overview" style="width: 780px;" />

2. Click **Firewall** in the left hand menu of the overview page. The **Firewall settings** page for the SQL Database server opens. 

3. Click **Add client IP** on the toolbar and then click **Save**. A server-level firewall rule is created for your current IP address.

     <img src="./media/sql-database-migrate-your-sql-server-database/server-firewall-rule-set.png" alt="set server firewall rule" style="width: 780px;" />

4. Click **OK**.

You can now connect to all databases on this server using SQL Server Management Studio or another tool of your choice from this IP address using the Server admin account created previously.

## Step 4 - Test for compatibility

## Step 5 - Resolve compatibility issues

## Step 6 - Export to BACPAC file 

## Step 7 - Import BACPAC file to Azure SQL Database 

## Step 8 - Connect to imported database using SSMS

## Next Steps 

