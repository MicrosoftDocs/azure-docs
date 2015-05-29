<properties
	pageTitle="Get started with SQL Database"
	description="Create your first cloud database in minutes with Azure SQL Database, Microsoft's relational database management service (RDBMS) in the cloud, using the Azure Portal and the AdventureWorks sample database."
	services="sql-database"
	documentationCenter=""
	authors="MightyPen"
	manager="jeffreyg"
	editor=""/>


<tags
	ms.service="sql-database"
	ms.workload="data-management" 
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/14/2015"
	ms.author="genemi"/>


# Create your first Azure SQL Database


This article shows you how to create a sample Azure SQL Database in under five minutes. You learn how to:


- Provision a logical server by using the [Azure portal](http://portal.azure.com/).
- Create a database populated with sample data.
- Set a firewall rule for the database to configure which IP addresses can access your database.


This tutorial assumes that you have an Azure Subscription. If you do not, you can sign up for a [free trial](http://azure.microsoft.com/pricing/free-trial/).


## Step 1: Sign in


1. Sign in to the [Azure portal](http://portal.azure.com/).
2. Click **New** > **Data + Storage** > **SQL Database**.


![New SQL Database][1]


## Step 2: Create your logical server



1. In the SQL Database blade, choose a **Name** for your database, in this example **AdventureWorks**.
2. To create the logical server for your database, click **Server**, then **Create a new server**.


## Step 3: Configure your server


1. In the **Server** blade, enter the **Server Name** as a unique name that is easy for you to remember.
2. Enter the **Server Admin Login** as **AdventureAdmin**.
3. Enter the correct value for **Password** and **Confirm Password**.
4. Select the preferred geographic **Location**. Typically the location should be close to where your application runs.
5. Click **OK**.


![Create server][2]


## Step 4: Create your database


1. In the SQL Database blade, specify the source of the database by clicking **Select Source**.
 - If you skip this step, an empty database is created.
2. Select **Sample**.
 - This creates a database that is a copy of the standard sample database named **AdventureWorks**.
 - On Azure SQL Database the *light schema* edition of AdventureWorks is used.
3. Click **Create** at the bottom of the blade.


## Step 5: Configure the firewall


The following steps demonstrate how to specify which IP address ranges are allowed to access your database.


![Browse server][3]


1. In the ribbon on the left-hand side of the screen, click **Browse** and then **SQL Servers**.
2. From the available options, click the SQL server that you created earlier.
3. Click **Settings**, then **Firewall**.
4. Click this link to get your current IP address from [Bing](http://www.bing.com/search?q=my%20ip%20address).
5. In the Firewall Settings, enter a **Rule Name**, and paste your public IP address from the previous step into the **Start IP** and **End IP** fields.
6. When complete, click **Save** at the top of the page.


![Firewall][4]


## Next steps


You are now ready to write a small client program that can connect to your database. For a quick start code sample, click one of the following links:


- [Connect to and query your SQL Database with C#](sql-database-connect-query.md)
- *Coming soon:* Client development and quick start samples to SQL Database


<!-- Media references. -->
[1]: ./media/sql-database-get-started/GettingStarted_NewDB.PNG
[2]: ./media/sql-database-get-started/GettingStarted_CreateServer.png
[3]: ./media/sql-database-get-started/GettingStarted_BrowseServer.png
[4]: ./media/sql-database-get-started/GettingStarted_FireWall.png
