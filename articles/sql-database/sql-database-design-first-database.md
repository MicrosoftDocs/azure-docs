---
title: Design your first Azure SQL database | Microsoft Docs
description: Learn to design your first Azure SQL database.
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
ms.date: 03/23/2017
ms.author: janeng

---

# Design your first Azure SQL database

In this tutorial, you are going to learn how to

* Create a table in the database
* Load data into the table 
* Add an index to the table to optimize query performance
* Restore the database to a point in time 
* Connect to and query the table 

This tutorial uses as its starting point the resources created in one of these quick starts:

- [Create DB - Portal](sql-database-get-started-portal.md)
- [Create DB - CLI](sql-database-get-started-cli.md)
- [Create DB - PowerShell](sql-database-get-started-powershell.md) 

Before you start:

* Make sure you can connect to, and query the SQL Database you created:
[Connect Using SSMS](sql-database-connect-query-ssms.md), [Connect using Visual Studio Code](sql-database-connect-query-vscode.md)
* Install the Bulk Copy (BCP) command-line utility:
[Install For Windows](https://www.microsoft.com/download/details.aspx?id=53591), [Install For Linux](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-setup-tools)


## Step 1 - Log in to the Azure portal

Log in to the [Azure portal](https://portal.azure.com/).

## Step 2 - Create a SQL database

An Azure SQL database is created with a defined set of [compute and storage resources](sql-database-service-tiers.md). The database is created within an [Azure resource group](../azure-resource-manager/resource-group-overview.md) and in an [Azure SQL Database logical server](sql-database-features.md). 

Follow these steps to create a SQL database containing the Adventure Works LT sample data. 

1. Click the **New** button found on the upper left-hand corner of the Azure portal.

2. Select **Databases** from the **New** page, and select **SQL Database** from the **Databases** page.

3. Fill out the SQL Database form with the required information: 
   - Database name: Provide a database name
   - Subscription: Select your subscription
   - Resource group: Select new or existing
   - Source: Select **Sample (AdventureWorksLT)**
   - Server: Create a new server (the **Server** name must be globally unique)
   - Elastic pool: Select **Not now** for this quick start
   - Pricing tier: Select **20 DTUs** and **250** GB of storage
   - Collation: You cannot change this value when importing the sample database 
   - Pin to dashboard: Select this checkbox

      ![create database](./media/sql-database-get-started/create-database-s1.png)

4. Click **Create** when complete. Provisioning takes a few minutes.
5. Once the SQL database deployment has finished, select the **SQL databases** on the dashboard or by selecting **SQL Databases** from the left-hand menu, and click your new database on the **SQL databases** page. An overview page for your database opens, showing you the fully qualified server name (such as **mynewserver20170313.database.windows.net**) and provides options for further configuration.

      ![new-sql database](./media/sql-database-get-started/new-database-s1-overview.png) 

## Step 3 - Create a server-level firewall rule

The SQL Database service creates a firewall preventing external applications and tools from connecting to your server and database. Follow these steps to create a [SQL Database server-level firewall rule](sql-database-firewall-configure.md) for your IP address to enable external connectivity through the SQL Database firewall. 

1. Click **Set server firewall** on the toolbar for your database. The **Firewall settings** page for the SQL Database server opens. 

      ![server firewall rule](./media/sql-database-get-started/server-firewall-rule.png) 

2. Click **Add client IP** on the toolbar and then click **Save**. A server-level firewall rule is created for your current IP address.

3. Click **OK** and then click the **X** to close the Firewall settings page.

You can now connect to the database and its server using SQL Server Management Studio or another tool of your choice.
## Step 1 - Create a table 

## Step 4 - Connect to mySampleDatabase database

Use your SQL editor of choice and connect to mySampleDatabase on your Azure SQL Database server.

* [Connect using SQL Server Management Studio](sql-database-connect-query-ssms.md)
* [Connect using Visual Studio Code](sql-database-connect-query-vscode.md)

## Step 5 - Create a 'Students' table in the database 
In an SSMS query window or in the VS Code editor connected to mySampleDatabase, execute following query:

```sql 
CREATE TABLE [dbo].[Students]
(
  [student_id] int, 
  [name] varchar(30),
  [age] int,
  [email] varchar(40),
  [AddressID] int REFERENCES [SalesLT].[Address] (AddressID)
);
```

Once the query is complete, you have created an empty table in your database called Students.

Execute the following query: 

```sql
SELECT name, age, email 
FROM [dbo].[Students]
```

The Students table returns no data.

## Step 6 - Load data into the table 
* [Download this sample txt file](https://microsoft-my.sharepoint.com/personal/ayolubek_microsoft_com/_layouts/15/guestaccess.aspx?guestaccesstoken=gQYCb16yjnJBDrK5aJaq8CMrlXNxf55ylI%2fi5XVCXQw%3d&docid=2_1b4c3b5ec415349fe9e35fdf4cb7ffb63&rev=1) into your local machine. In this example, we assume it is stored in the following location, *C:\Temp\SampleStudentData.txt*
* Open a command prompt window and run the following command, replacing the values for *ServerName*, *DatabaseName*, *UserName*, and *Password* with your own.

```bcp
bcp Students in C:\Temp\SampleStudentData.txt -S <ServerName> -d <DatabaseName> -U <Username> -P <password> -q -c -t ",""
```

You have now loaded sample data into the table you created earlier.

## Step 3 - Add an index to the table 
To make searching for specific values in the table more efficient, create an index on the Students table. An index organizes the data in such a way, that now all data has to be looked at to find a specific value.

### Add an index to table 
Execute the following query:

```sql 
CREATE NONCLUSTERED INDEX IX_Age ON Students (age);
```

### Query data from table with index 
Execute the following query: 

```sql
SELECT name, age, email 
FROM [dbo].[Students]
WHERE age > 20
```

This query returns the name, age, and email of students who are older than 20 years old.

## Step 7 - Restore database to a point in time before table creation 
Databases in Azure have continuous backups that are taken automatically every 5 - 10 minutes. These backups allow you to restore your database to a previous point in time. Restoring a database to a different point in time creates a duplicate database in the same server as the original database. The following steps restore the sample database to a point before the *Students* table was added. 

## Step  - Restore database 
* Navigate to the sample database you created in the quick start
* Click **Restore** on the database blade 
* Fill out the SQL Database form with the required information:
	* DatabaseName: Provide a database name 
	* Point-in-time: Select the **Point-in-time** tab on the restore blade 
	* Restore point: Input a time that occurs before the database was changed
	* Target server: You cannot change this value when restoring a database 
	* Elastic database pool: Select **None** for this tutorial 
	* Pricing tier: Select **20 DTUs** and **250 GB** of storage.

You have now restored the sample database to a point in time before the *Students* table was added.

## Next Steps 
Samples - [SQL Database PowerShell samples](sql-database-powershell-samples.md)