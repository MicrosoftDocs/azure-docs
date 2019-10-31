---
title: Connect to Azure SQL analytics with Azure Data Studio | Microsoft Docs
description: Use Azure Data Studio to connect to and query an Azure SQL on-demand.
services: sql-data-warehouse
author: azaricstefan 
ms.service: sql-data-warehouse
ms.topic: overview 
ms.subservice: design 
ms.date: 10/22/2019 
ms.author: v-stazar 
ms.reviewer: jrasnick
---

# Connect to Azure SQL analytics with Azure Data Studio
> [!div class="op_single_selector"]
> * [Azure Data Studio](get-started-azure-data-studio.md)
> * [Power BI](tutorial-power-bi-professional.md)
> * [Visual Studio](../../sql-data-warehouse/sql-data-warehouse-query-visual-studio.md)
> * [sqlcmd](get-started-connect-sqlcmd.md)
> * [SSMS](get-started-ssms.md)
> 
> 

Use Azure Data Studio application to connect to and query an Azure SQL analytics database.

## 1. Connect using Azure Data Studio
To get started with [Azure Data Studio][ads], open application and select **New Connection** followed by the connection details for your SQL on-demand database. 

![Open Azure Data Studio][1]

The connection requires the following parameters:

* **Server:** Server in the form `<`Server Name`>`.database.windows.net
* **Database:** Database name.

To use SQL Server Authentication, you need to add the username/password parameters:

* **User:** Server user in the form `<`User`>`
* **Password:** Password associated with the user.

For example, your connection might look like the following screenshot:

![SQL Login][2]


To use Windows authentication or Azure Active Directory you need to choose needed authentication type.

Example of Windows authentication connection

![Windows Authentication][3]

After successful login, you should see a dashboard like this.
![Dashboard][4]

## 2. Query using SQL Analytics on-demand
After connection, you can issue any supported Transact-SQL statements against the instance.

On the screenshot bellow you can see the dashboard, select **"New query"**
![New Query][5]

In this example, we will query parquet files.

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
[2]: media/sql-analytics-query-ads/2-db-details.png
[3]: media/sql-analytics-query-ads/3-windows-auth.png
[4]: media/sql-analytics-query-ads/4-dashboard.png
[5]: media/sql-analytics-query-ads/5-new-query.png


<!--Article references-->

<!--MSDN references--> 
[ads]: https://docs.microsoft.com/sql/azure-data-studio/download?view=sql-server-ver15
[Azure portal]: https://portal.azure.com

<!--Other Web references-->
