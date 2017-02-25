---
title: Copy an Azure SQL database using the Azure portal | Microsoft Docs
description: Create a copy of an Azure SQL database
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: daa6f079-13ed-462f-b346-e201aa61681b
ms.service: sql-database
ms.custom: migrate and move
ms.devlang: NA
ms.date: 02/07/2017
ms.author: carlrab
ms.workload: data-management
ms.topic: article
ms.tgt_pltfrm: NA

---
# Copy an Azure SQL Database using the Azure portal

The following steps show you how to copy a SQL database with the [Azure portal](https://portal.azure.com) to the same server or a different server. 

> [!NOTE]
> You can also copy a SQL database using [PowerShell](sql-database-copy-powershell.md) or [Transact-SQL](sql-database-copy-transact-sql.md).
>

To copy a SQL database, you need the following items:

* An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
* A SQL database to copy. If you do not have a SQL database, create one following the steps in this article: [Create your first Azure SQL Database](sql-database-get-started.md).

## Copy your SQL database
Open the SQL database page for the database you want to copy:

1. Go to the [Azure portal](https://portal.azure.com).
2. Click **More services** > **SQL databases**, and then click the desired database.
3. On the SQL database page, click **Copy**:
   
   ![SQL Database](./media/sql-database-copy-portal/sql-database-copy.png)
4. On the **Copy** page, a default database name is provided. Type a different name if you want (all databases on a server must have unique names).
5. Select a **Target server**. The target server is where the database copy is created. You can copy the database to the same server, or a different server. You can create a server or select an existing server from the list. 
6. After selecting the **Target server**, the **elastic pool**, and **Pricing tier** options will be enabled. If the server has a pool, you can copy the database into it.
7. Click **OK** to start the copy process.
   
   ![SQL Database](./media/sql-database-copy-portal/copy-page.png)

## Monitor the progress of the copy operation
* After starting the copy, click the portal notification for details.
  
    ![notification][3]
  
    ![monitor][4]

## Verify the database is live on the server
* Click **More services** > **SQL databases** and verify the new database is **Online**.

## Resolve logins
To resolve logins after the copy operation completes, see [Resolve logins](sql-database-copy-transact-sql.md#resolve-logins-after-the-copy-operation-completes)

## Next steps
* To learn about managing users and logins when copying a database to a different logical server, see [How to manage Azure SQL database security after disaster recovery](sql-database-geo-replication-security-config.md).
* To export a database to a BACPAC file using the Azure portal, see [Export the database to a BACPAC using the Azure portal](sql-database-export-portal.md).
* [Business Continuity Overview](sql-database-business-continuity.md)
* [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)

<!--Image references-->
[1]: ./media/sql-database-copy-portal/copy.png
[2]: ./media/sql-database-copy-portal/copy-ok.png
[3]: ./media/sql-database-copy-portal/copy-notification.png
[4]: ./media/sql-database-copy-portal/monitor-copy.png

