---
title: Create a server-level firewall rule
description: Create an server-level firewall rule
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: quickstart
author: sachinpMSFT
ms.author: sachinp
ms.reviewer: vanto, carlrab
ms.date: 02/11/2019
---
# Quickstart: Create a server-level firewall rule using the Azure portal
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

This quickstart walks through how to create a [server-level firewall rule](firewall-configure.md) in Azure SQL Database using the Azure portal to enable you to connect to [logical SQL servers](logical-servers.md), single databases, and elastic pools and their databases. A firewall rule is required to connect from other Azure resources and from on-premises resources. Server-level firewall rules do not apply to Azure SQL Managed Instance.

## Prerequisites

This quickstart uses the resources created in [Create a single database using the Azure portal](single-database-create-quickstart.md) as its starting point.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create a server-level IP firewall rule

 SQL Database creates a firewall at the  server level for single and pooled databases. This firewall prevents client applications from connecting to the server or any of its single or pooled databases unless you create an IP firewall rule to open the firewall. For a connection from an IP address outside Azure, create a firewall rule for a specific IP address or range of addresses that you want to be able to connect. For more information about server-level and database-level IP firewall rules, see [Server-level and database-level IP firewall rules](firewall-configure.md).

> [!NOTE]
> Azure SQL Database communicates over port 1433. If you're trying to connect from within a corporate network, outbound traffic over port 1433 might not be allowed by your network's firewall. If so, you can't connect to your server unless your IT department opens port 1433.
> [!IMPORTANT]
> A firewall rule of 0.0.0.0 enables all Azure services to pass through the server-level firewall rule and attempt to connect to a single or pooled database through the server.

Follow these steps to create a server-level IP firewall rule for your client's IP address and enable external connectivity through the Azure SQL Database firewall for your IP address only.

1. After the [database](#prerequisites) deployment completes, select **SQL databases** from the left-hand menu and then choose **mySampleDatabase** on the **SQL databases** page. The overview page for your database opens, showing you the fully qualified server name (such as **mynewserver-20170824.database.windows.net**) and provides options for further configuration.

2. Copy this fully qualified server name to use when connecting to your server and its databases in other quickstarts.

   ![server name](./media/firewall-create-server-level-portal-quickstart/server-name.png)

3. Select **Set server firewall** on the toolbar. The **Firewall settings** page for the server opens.

   ![server-level IP firewall rule](./media/firewall-create-server-level-portal-quickstart/server-firewall-rule.png)

4. Choose **Add client IP** on the toolbar to add your current IP address to a new server-level IP firewall rule. A server-level IP firewall rule can open port 1433 for a single IP address or a range of IP addresses.

   > [!IMPORTANT]
   > By default, access through the Azure SQL Database firewall is disabled for all Azure services. Choose **ON** on this page if you want to enable access for all Azure services.
   >

5. Select **Save**. A server-level IP firewall rule is created for your current IP address opening port 1433 on the server.

6. Close the **Firewall settings** page.

Using SQL Server Management Studio or another tool of your choice, you can now connect to the server and its databases from this IP address using the server admin account created previously.

## Clean up resources

Save these resources if you want to go to [Next steps](#next-steps) and learn how to connect and query your database using a number of different methods. If, however, you want to delete the resources that you created in this quickstart, use the following steps.

1. From the left-hand menu in the Azure portal, select **Resource groups** and then select **myResourceGroup**.
2. On your resource group page, select **Delete**, type **myResourceGroup** in the text box, and then select **Delete**.

## Next steps

- Now that you have a database, you can [connect and query](connect-query-content-reference-guide.md) using one of your favorite tools or languages, including
  - [Connect and query using SQL Server Management Studio](connect-query-ssms.md)
  - [Connect and query using Azure Data Studio](/sql/azure-data-studio/quickstart-sql-database?toc=/azure/sql-database/toc.json)
- To learn how to design your first database, create tables, and insert data, see one of these tutorials:
  - [Design your first single database in Azure SQL Database using SSMS](design-first-database-tutorial.md)
  - [Design a single database in Azure SQL Database and connect with C# and ADO.NET](design-first-database-csharp-tutorial.md)
