---
title: Copy an Azure SQL database | Microsoft Docs
description: Create a copy of an Azure SQL database
services: sql-database
documentationcenter: ''
author: anosov1960
manager: jhubbard
editor: ''

ms.assetid: 5aaf6bcd-3839-49b5-8c77-cbdf786e359b
ms.service: sql-database
ms.devlang: NA
ms.date: 10/24/2016
ms.author: sstein; sashan
ms.workload: data-management
ms.topic: article
ms.tgt_pltfrm: NA

---
# Copy an Azure SQL Database
> [!div class="op_single_selector"]
> * [Overview](sql-database-copy.md)
> * [Azure portal](sql-database-copy-portal.md)
> * [PowerShell](sql-database-copy-powershell.md)
> * [T-SQL](sql-database-copy-transact-sql.md)
> 
> 

You can use the Azure [SQL Database automated backups](sql-database-automated-backups.md) to create a copy of your SQL database. The database copy uses the same technology as the geo-replication feature. But unlike geo-replication it terminates the replication link as once the seeding phase is completed. Therefore, the copy database is a snapshot of the source database as of the time of the copy request.  
You can create the database copy on either the same server or a different server. The service tier and performance level (pricing tier) of the database copy are the same as the source database by default. When using the API, you can select a different performance level within the same service tier (edition). After the copy is complete, the copy becomes a fully functional, independent database. At this point, you can upgrade or downgrade it to any edition. The logins, users, and permissions can be managed independently.  

When you copy a database to the same logical server, the same logins can be used on both databases. The security principal you use to copy the database becomes the database owner (DBO) on the new database. All database users, their permissions, and their security identifiers (SIDs) are copied to the database copy.  

When you copy a database to a different logical server, the security principal on the new server becomes the database owner on the new database. If you use [contained database users](sql-database-manage-logins.md) for data access, ensure that both the primary and secondary databases always have the same user credentials, so after the copy completes you can immediately access it with the same credentials. If you use [Azure Active Directory](../active-directory/active-directory-whatis.md), you can completely eliminate the need for managing credentials in the copy. However, when you copy the database to a new server, the login-based access will generally not work because the logins will not exist on the new server. See [How to manage Azure SQL database security after disaster recovery](sql-database-geo-replication-security-config.md) to learn about managing logins when copying a database to a different logical server. 

To copy a SQL database, you need the following:

* An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
* A SQL database to copy. If you do not have a SQL database, create one following the steps in this article: [Create your first Azure SQL Database](sql-database-get-started.md).

## Next steps
* See [Copy an Azure SQL database using the Azure portal](sql-database-copy-portal.md) to copy a database using the Azure portal.
* See [Copy an Azure SQL database using PowerShell](sql-database-copy-powershell.md) to copy a database using PowerShell.
* See [Copy an Azure SQL database using T-SQL](sql-database-copy-transact-sql.md) to copy a database using Transact-SQL.
* See [How to manage Azure SQL database security after disaster recovery](sql-database-geo-replication-security-config.md) to learn about managing users and logins when copying a database to a different logical server.

## Additional resources
* [Manage logins](sql-database-manage-logins.md)
* [Connect to SQL Database with SQL Server Management Studio and perform a sample T-SQL query](sql-database-connect-query-ssms.md)
* [Export the database to a BACPAC](sql-database-export.md)
* [Business Continuity Overview](sql-database-business-continuity.md)
* [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)

