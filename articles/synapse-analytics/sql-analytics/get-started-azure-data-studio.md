---
title: Connect to SQL on-demand with Azure Data Studio | Microsoft Docs
description: Use Azure Data Studio to connect to and query SQL on-demand.
services: synapse analytics
author: azaricstefan 
ms.service: synapse-analytics
ms.topic: overview 
ms.subservice: 
ms.date: 10/22/2019 
ms.author: v-stazar 
ms.reviewer: jrasnick
---

# Connect to Azure SQL on-demand with Azure Data Studio

> [!div class="op_single_selector"]
> * [Azure Data Studio](get-started-azure-data-studio.md)
> * [Power BI](get-started-power-bi-professional.md)
> * [Visual Studio](../../sql-data-warehouse/sql-data-warehouse-query-visual-studio.md)
> * [sqlcmd](get-started-connect-sqlcmd.md)
> * [SSMS](get-started-ssms.md)
> 
> 

You can use the Azure Data Studio application to connect to and query a SQL on-demand database. 

## 1. Connect using Azure Data Studio
To get started with [Azure Data Studio](get-started-azure-data-studio.md), open the application and select **New Connection**. You'll be prompted to enter the connection details for your SQL on-demand database. 

![Open Azure Data Studio][1]

The connection requires the following parameters:

* **Server:** Server in the form `<`Server Name`>`.database.windows.net
* **Database:** Database name

To use SQL Server Authentication, you need to add the username/password parameters:

* **User:** Server user in the form `<`User`>`
* **Password:** Password associated with the user

As an example, your connection might look like the following Connection Details screenshot:

![SQL Login][2]


To use Windows authentication or Azure Active Directory, you need to choose the needed authentication type.

Example of the Windows authentication connection:

![Windows Authentication][3]

After successful login, you should see a dashboard like the one in the following screenshot:

![Dashboard][4]

## 2. Query using SQL on-demand
After connecting, you can issue any supported [Transact-SQL](https://docs.microsoft.com/sql/t-sql/language-reference?view=sql-server-ver15) (T-SQL) statements against the instance. To start a query, you'll need to select select **"New query"** from the dashboard view.

![New Query][5]

To [query Parquet](query-parquet-files.md) files, you can use the the following example:

```sql
SELECT COUNT(*) 
FROM  
OPENROWSET(
    BULK 'https://azureopendatastorage.blob.core.windows.net/censusdatacontainer/release/us_population_county/year=20*/*.parquet', 
    FORMAT='PARQUET'
)
```

## Next steps 
For more about details about the options available in sqlcmd see [sqlcmd documentation](get-started-connect-sqlcmd.md).

<!--Image references-->
[1]: media/sql-analytics-query-ads/1-start.png
[2]: media/sql-analytics-query-ads/2-database-details.png
[3]: media/sql-analytics-query-ads/3-windows-auth.png
[4]: media/sql-analytics-query-ads/4-dashboard.png
[5]: media/sql-analytics-query-ads/5-new-query.png

 