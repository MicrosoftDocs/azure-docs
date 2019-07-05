---
title: 'Create a server-level firewall rule - Azure SQL Database| Microsoft Docs'
description: Create a SQL Database server-level firewall rule for single and pooled databases
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
ms.date: 02/11/2019
---
# Quickstart: Create a server-level firewall rule for single and pooled databases using the Azure portal

This quickstart walks through how to create a [server-level firewall rule](sql-database-firewall-configure.md) for single and pooled databases in Azure SQL Database using the Azure portal to enable you to connect to database servers, single databases, and elastic pools and their databases. A firewall rule is required to connect from other Azure resources and from on-premises resources.

## Prerequisites

This quickstart uses the resources created in [Create a single database using the Azure portal](sql-database-single-database-get-started.md) as its starting point.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create a server-level IP firewall rule

The SQL Database service creates a firewall at the database server level for single and pooled databases. This firewall prevents client applications from connecting to the server or any of its single or pooled databases unless you create an IP firewall rule to open the firewall. For a connection from an IP address outside Azure, create a firewall rule for a specific IP address or range of addresses that you want to be able to connect. For more information about server-level and database-level IP firewall rules, see [SQL Database server-level and database-level IP firewall rules](sql-database-firewall-configure.md).

> [!NOTE]
> SQL Database communicates over port 1433. If you're trying to connect from within a corporate network, outbound traffic over port 1433 might not be allowed by your network's firewall. If so, you can't connect to your Azure SQL Database server unless your IT department opens port 1433.
> [!IMPORTANT]
> A firewall rule of 0.0.0.0 enables all Azure services to pass through the server-level firewall rule and attempt to connect to a single or pooled database through the server. To learn about using virtual network rules, see [Virtual network rules as alternatives to IP rules](sql-database-firewall-configure.md#virtual-network-rules-as-alternatives-to-ip-rules).

Follow these steps to create a server-level IP firewall rule for your client's IP address and enable external connectivity through the SQL Database firewall for your IP address only.

1. After the [prerequisite Azure SQL database](#prerequisites) deployment completes, select **SQL databases** from the left-hand menu and then choose **mySampleDatabase** on the **SQL databases** page. The overview page for your database opens, showing you the fully qualified server name (such as **mynewserver-20170824.database.windows.net**) and provides options for further configuration.

2. Copy this fully qualified server name to use when connecting to your server and its databases in other quickstarts.

   ![server name](./media/sql-database-get-started-portal/server-name.png)

3. Select **Set server firewall** on the toolbar. The **Firewall settings** page for the database server opens.

   ![server-level IP firewall rule](./media/sql-database-get-started-portal/server-firewall-rule.png)

4. Choose **Add client IP** on the toolbar to add your current IP address to a new server-level IP firewall rule. A server-level IP firewall rule can open port 1433 for a single IP address or a range of IP addresses.

   > [!IMPORTANT]
   > By default, access through the SQL Database firewall is enabled for all Azure services. Choose **OFF** on this page to disable for all Azure services.
   >

5. Select **Save**. A server-level IP firewall rule is created for your current IP address opening port 1433 on the SQL Database server.

6. Close the **Firewall settings** page.

Using SQL Server Management Studio or another tool of your choice, you can now connect to the SQL Database server and its databases from this IP address using the server admin account created previously.

## Clean up resources

Save these resources if you want to go to [Next steps](#next-steps) and learn how to connect and query your database using a number of different methods. If, however, you want to delete the resources that you created in this quickstart, use the following steps.

1. From the left-hand menu in the Azure portal, select **Resource groups** and then select **myResourceGroup**.
2. On your resource group page, select **Delete**, type **myResourceGroup** in the text box, and then select **Delete**.

## Next steps

- Now that you have a database, you can [connect and query](sql-database-connect-query.md) using one of your favorite tools or languages, including
  - [Connect and query using SQL Server Management Studio](sql-database-connect-query-ssms.md)
  - [Connect and query using Azure Data Studio](/sql/azure-data-studio/quickstart-sql-database?toc=/azure/sql-database/toc.json)
- To learn how to design your first database, create tables, and insert data, see one of these tutorials:
  - [Design your first single database in Azure SQL Database using SSMS](sql-database-design-first-database.md)
  - [Design a single database in Azure SQL Database and connect with C# and ADO.NET](sql-database-design-first-database-csharp.md)
