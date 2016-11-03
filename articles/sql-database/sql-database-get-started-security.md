---
title: 'SQL Database tutorial: Getting Started with Security'
description: Learn how to create user accounts to access and to manage a database.
keywords: ''
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.service: sql-database
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 08/17/2016
ms.author: carlrab

---
# SQL Database tutorial: Create SQL database user accounts to access and manage a database
> [!div class="op_single_selector"]
> * [Get started tutorial](sql-database-get-started-security.md)
> * [Grant access](sql-database-manage-logins.md)
> 
> 

In this tutorial, you learn how to use SQL Server Management Studio (SSMS) to:

* Log in to SQL Database using a server-level principal login.
* Create a SQL Database user account.
* Grant a SQL Database user [db_owner permissions](https://msdn.microsoft.com/library/ms189121.aspx#Anchor_0).
* Connect to a SQL database with a user account that is not a server-level principal.

[!INCLUDE [Login](../../includes/azure-getting-started-portal-login.md)]

[!INCLUDE [Create SQL Database logical server](../../includes/sql-database-sql-server-management-studio-connect-server-principal.md)]

[!INCLUDE [Create SQL Database database](../../includes/sql-database-create-new-database-user.md)]

[!INCLUDE [Create SQL Database database](../../includes/sql-database-grant-database-user-dbo-permissions.md)]

[!INCLUDE [Create SQL Database database](../../includes/sql-database-sql-server-management-studio-connect-user.md)]

## Next steps
Now that you've completed this SQL Database tutorial and created a user account and granted the user account dbo permissions, you are ready to learn more about 
[SQL Database security](sql-database-manage-logins.md).

