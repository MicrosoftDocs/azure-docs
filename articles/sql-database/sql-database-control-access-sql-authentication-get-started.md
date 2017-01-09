---
title: 'Azure SQL Database tutorial: SQL authentication and access | Microsoft Docs'
description: In this getting-started tutorial, you learn how to use SQL Server Management Studio to work with SQL authentication, logins, users, and role to grant access and permissions to Azure SQL Database servers and databases.
keywords: ''
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 67797b09-f5c3-4ec2-8494-fe18883edf7f
ms.service: sql-database
ms.custom: authentication and authorization
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 08/17/2016
ms.author: carlrab

---
# SQL Database tutorial: Create SQL database user accounts to access and manage a database
In this getting-started tutorial, you learn how to use SQL Server Management Studio to work with SQL authentication, logins, users, and role to grant access and permissions to Azure SQL Database servers and databases. You learn to:

- View user permissions in the master database and in user databases
- Create users and logins 
- Grant server-wide and database-specific permissions to users
- Log in to a user database as a non-admin user
- Create database-level firewall rules for database users

**Time estimate**: This tutorial takes approximately 30 minutes to complete (assuming you have already met the prerequisites).


## Prerequisites

* You, or someone else, has completed the [Get started with Azure SQL Database servers, databases, and firewall rules by using the Azure portal and SQL Server Management Studio](sql-database-get-started.md) or the equivalent [PowerShell version](sql-database-get-started-powershell.md) of this tutorial. If not, either complete this prerequisite tutorial or execute the PowerShell script at the end of the [PowerShell version](sql-database-get-started-powershell.md) of this tutorial before continuing.

## Sign in by using your existing account
Using your [existing subscription](https://account.windowsazure.com/Home/Index), follow these steps to connect to the Azure portal.

1. Open your browser of choice and connect to the [Azure portal](https://portal.azure.com/).
2. Sign in to the [Azure portal](https://portal.azure.com/).
3. On the **Sign in** page, provide the credentials for your subscription.
   
   ![Sign in](./media/sql-database-get-started/login.png)


<a name="create-logical-server-bk"></a>

## Connect to SQL server using SQL Server Management Studio (SSMS)

1. If you have not already done so, download and install the latest version of SSMS at [Download SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx). To stay up-to-date, the latest version of SSMS prompts you when there is a new version available to download.

2. After installing, type **Microsoft SQL Server Management Studio** in the Windows search box and click **Enter** to open SSMS:

   ![SQL Server Management Studio](./media/sql-database-get-started/ssms.png)
3. In the Connect to Server dialog box, enter the necessary information to connect to your SQL server using SQL Server Authentication.

   ![connect to server](./media/sql-database-get-started/connect-to-server.png)
4. Click **Connect**.

   ![connected to server](./media/sql-database-get-started/connected-to-server.png)


## View master database and user database permission for a user 
In this section of the tutorial, you view information about an existing user in the master and the user databases created in the previous tutorial.

1. In Object Explorer, expand Security, and then expand Logins to view the existing logins for your Azure SQL Database server. For a newly created server that is not integrated with Azure Active Directory, only the SQL login specified when the server was provisioned appears.

   ![existing logins](./media/sql-database-control-access-sql-authentication-get-started/existing_logins.png)
2. 


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

