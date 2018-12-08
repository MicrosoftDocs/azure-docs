---
title: 'Azure portal: Create a SQL Database firwall rule| Microsoft Docs'
description: Create a SQL Database server-level firewall rule
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: 
ms.devlang: 
ms.topic: quickstart
author: sachinpMSFT
ms.author: sachinp
ms.reviewer: vanto, carlrab
manager: craigg
ms.date: 12/01/2018
---
# Quickstart: Create a server-level firewall rule for your SQL database using the Azure portal

This quickstart walks through how to create a server-level firewall rule for an Azure SQL database to enable you to connect to it from an on-premises resource.

## Prerequisites

This quickstart uses the resources created in [Create an Azure SQL database in the Azure portal](sql-database-get-started-portal.md) as its starting point.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create a server-level firewall rule

The SQL Database service creates a firewall at the server level. This firewall prevents applications and tools from connecting to the server or any server databases unless you create a firewall rule to open the firewall. For a connection from an IP address outside Azure, create a firewall rule for a specific IP address or range of addresses. For more information about firewall rules, see [SQL Database server-level firewall rule](sql-database-firewall-configure.md).

> [!NOTE]
> SQL Database communicates over port 1433. If you're trying to connect from within a corporate network, outbound traffic over port 1433 might not be allowed by your network's firewall. If so, you can't connect to your Azure SQL Database server unless your IT department opens port 1433.
>

Follow these steps to create a server-level firewall rule for your client's IP address and enable external connectivity through the SQL Database firewall for your IP address only.

1. After the [prerequisite Azure SQL database](#prerequisites) deployment completes, select **SQL databases** from the left-hand menu and then choose **mySampleDatabase** on the **SQL databases** page. The overview page for your database opens, showing you the fully qualified server name (such as **mynewserver-20170824.database.windows.net**) and provides options for further configuration.

2. Copy this fully qualified server name to use when connecting to your server and its databases in other quickstarts.

   ![server name](./media/sql-database-get-started-portal/server-name.png)

3. Select **Set server firewall** on the toolbar. The **Firewall settings** page for the SQL Database server opens.

   ![server firewall rule](./media/sql-database-get-started-portal/server-firewall-rule.png)

4. Choose **Add client IP** on the toolbar to add your current IP address to a new firewall rule. A firewall rule can open port 1433 for a single IP address or a range of IP addresses.

   > [!IMPORTANT]
   > By default, access through the SQL Database firewall is enabled for all Azure services. Choose **OFF** on this page to disable for all Azure services.
   >

5. Select **Save**. A server-level firewall rule is created for your current IP address opening port 1433 on the logical server.

6. Close the **Firewall settings** page.

Using SQL Server Management Studio or another tool of your choice, you can now connect to the SQL Database server and its databases from this IP address using the server admin account created previously.

## Clean up resources

Save these resources if you want to go to [Next steps](#next-steps) and learn how to connect and query your database using a number of different methods. If, however, you want to delete the resources that you created in this quickstart, use the following steps.


1. From the left-hand menu in the Azure portal, select **Resource groups** and then select **myResourceGroup**.
2. On your resource group page, select **Delete**, type **myResourceGroup** in the text box, and then select **Delete**.

## Next steps

- Now that you have a database, you can [connect and query](sql-database-connect-query.md) using one of your favorite tools or languages, including
  - [Connect and query using SQL Server Management Studio](sql-database-connect-query-ssms.md)
  - [Connect and query using Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/quickstart-sql-database?toc=/azure/sql-database/toc.json)
- To learn how to design your first database, create tables, and insert data, see one of these tutorials:
  - [Design your first Azure SQL database using SSMS](sql-database-design-first-database.md)
  - [Design an Azure SQL database and connect with C# and ADO.NET](sql-database-design-first-database-csharp.md)
