---
title: 'T-SQL: Create and manage single Azure SQL databases | Microsoft Docs'
description: Quick reference on how to create and manage single Azure SQL database using the Azure portal
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: single databases
ms.devlang: NA
ms.workload: data-management
ms.topic: article
ms.tgt_pltfrm: NA
ms.date: 02/06/2017
ms.author: carlrab

---
# Create and manage single Azure SQL databases with Transact-SQL

You can create and manage single Azure SQL databases with the [Azure portal](https://portal.azure.com/), PowerShell, Transact-SQL, the REST API, or C#. This topic is about using the Azure portal. For PowerShell, see [Create and manage single databases with Powershell](scripts/sql-database-create-and-configure-database-powershell.md). For Transact-SQL, see [Create and manage single databases with Transact-SQL](sql-database-manage-single-databases-tsql.md). 

## Create an Azure SQL database using Transact-SQL in SQL Server Management Studio

To create a SQL Database using Transact-SQL in SQL Server Management Studio:

1. Using SQL Server Management Studio, connect to the Azure Database server using the server-level principal login or a login that is a member of the **dbmanager** role. For more information on logins, see [Manage logins](sql-database-manage-logins.md).
2. In Object Explorer, open the Databases node, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.
3. Use the **CREATE DATABASE** statement to create a database. For
  more information, see [CREATE DATABASE (SQL Database)](https://msdn.microsoft.com/library/dn268335.aspx). The following statement creates a database named **myTestDB** and specifies that it is a Standard S0 Edition database with a default maximum size of 250 GB.
  
      CREATE DATABASE myTestDB
      (EDITION='Standard',
       SERVICE_OBJECTIVE='S0');

4. Click **Execute** to run the query.
5. In Object Explorer, right-click the Databases node and click **Refresh** to view the new database in Object Explorer. 


## Change the service tier and performance level of a single database
Change your database max size using [Transact-SQL (T-SQL)](https://msdn.microsoft.com/library/mt574871.aspx)

> [!TIP]
> For a tutorial creating a database using Transact-SQL, see [Create a database - Azure portal](sql-database-get-started.md).
>

## Next steps
* For an overview of management tools, see [Overview of management tools](sql-database-manage-overview.md).
* To see how to perform management tasks using the Azure portal, see [Manage Azure SQL Databases using the Azure portal](sql-database-manage-portal.md).
* To see how to perform management tasks using PowerShell, see [Manage Azure SQL Databases using PowerShell](sql-database-manage-powershell.md).
* To see how to perform management tasks using SQL Server Management Studio, see [SQL Server Management Studio](sql-database-manage-azure-ssms.md).
* For information about the SQL Database service, see [What is SQL Database](sql-database-technical-overview.md). 
* For information about Azure Database servers and database features, see [Features](sql-database-features.md).
