---
title: Connect to Azure SQL on-demand - SSMS | Microsoft Docs
description: Use SQL Server Management Studio (SSMS) to connect to and query Azure SQL on-demand. 
services: sql-data-warehouse
author: azaricstefan 
ms.service: sql-data-warehouse
ms.topic: overview 
ms.subservice: design 
ms.date: 10/21/2019 
ms.author: v-stazar 
ms.reviewer: jrasnick
---

# Connect to SQL on-demand with SQL Server Management Studio (SSMS)
> [!div class="op_single_selector"]
> * [Power BI](sql-data-warehouse-get-started-visualize-with-power-bi.md)
> * [Azure Machine Learning](sql-data-warehouse-get-started-analyze-with-azure-machine-learning.md)
> * [Visual Studio](sql-data-warehouse-query-visual-studio.md)
> * [sqlcmd](sql-data-warehouse-get-started-connect-sqlcmd.md) 
> * [SSMS](sql-data-warehouse-query-ssms.md)
> 
> 

Use SQL Server Management Studio (SSMS) to connect to and query Azure SQL on-demand. 

## Prerequisites
To use this tutorial, you need:

* An existing SQL on-demand. To create one, see [Create a SQL on-demand][Create a SQL on-demand].
* SQL Server Management Studio (SSMS) installed. [Install SSMS][Install SSMS] for free if you don't already have it.
* The fully qualified SQL server name. To find this, see [Connect to SQL on-demand][Connect to SQL on-demand].

## 1. Connect to your SQL on-demand
1. Open SSMS.
2. Open Object Explorer. To do this, select **File** > **Connect Object Explorer**.
   
    ![SQL Server Object Explorer][1]
3. Fill in the fields in the Connect to Server window.
   
    ![Connect to Server][2]
   
   * **Server name**. Enter the **server name** previously identified.
   * **Authentication**. Select **SQL Server Authentication** or **Active Directory Integrated Authentication**.
   * **User Name** and **Password**. Enter user name and password if SQL Server Authentication was selected above.
   * Click **Connect**.
4. To explore, expand your Azure SQL server. You can view the databases associated with the server. Expand demo to see the content in your sample database.
   
    ![Explore AdventureWorksDW][3]

## 2. Run a sample query
Now that a connection has been established to your database, let's write a query.

1. Right-click your database in SQL Server Object Explorer.
2. Select **New Query**. A new query window opens.
   
    ![New query][4]
3. Copy this TSQL query into the query window:
   
    ```sql
    SELECT COUNT(*) FROM demo.dbo.usPopulationView
    ```
4. Run the query. To do this, click `Execute` or use the following shortcut: `F5`.
   
    ![Run query][5]
5. Look at the query results. In this example, the usPopulationView view has 3664512 rows.
   
    ![Query results][6]

## Next steps
Now that you can connect and query, try [visualizing the data with PowerBI][visualizing the data with PowerBI].

To configure your environment for Azure Active Directory authentication, see [Authenticate to SQL on-demand][Authenticate to SQL on-demand].

<!--Arcticles-->
[Connect to SQL on-demand]: sql-analytics-connect-overview.md
[Create a SQL on-demand]: sql-data-warehouse-get-started-provision.md
[Authenticate to SQL on-demand]: sql-data-warehouse-authentication.md
[visualizing the data with PowerBI]: tutorial-bi-professional.md 

<!--Other-->
[Azure portal]: https://portal.azure.com
[Install SSMS]: https://msdn.microsoft.com/library/hh213248.aspx


<!--Image references-->

[1]: media/sql-analytics-query-ssms/connect-object-explorer.png
[2]: media/sql-analytics-query-ssms/connect-object-explorer1.png
[3]: media/sql-analytics-query-ssms/explore-tables.png
[4]: media/sql-analytics-query-ssms/new-query.png
[5]: media/sql-analytics-query-ssms/execute-query.png
[6]: media/sql-analytics-query-ssms/results.png
