---
title: 'SQL auth: Azure SQL Database firewalls, authentication, access | Microsoft Docs'
description: In this getting-started tutorial, you learn how to use SQL Server Management Studio and Transact-SQL to work with server-level and database-level firewall rules, SQL authentication, logins, users, and roles to grant access and control to Azure SQL Database servers and databases.
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
ms.date: 01/17/2017
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

* You need an Azure account. You can [open a free Azure account](/pricing/free-trial/?WT.mc_id=A261C142F) or [Activate Visual Studio subscriber benefits](/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F). 

* You must be able to connect to the Azure portal using an account that is a member of either the subscription owner or contributor role. For more information on role-based access control (RBAC), see [Getting started with access management in the Azure portal](../active-directory/role-based-access-control-what-is.md).

* You have completed the [Get started with Azure SQL Database servers, databases, and firewall rules by using the Azure portal and SQL Server Management Studio](sql-database-get-started.md) or the equivalent [PowerShell version](sql-database-get-started-powershell.md) of this tutorial. If not, either complete this prerequisite tutorial or execute the PowerShell script at the end of the [PowerShell version](sql-database-get-started-powershell.md) of this tutorial before continuing.

> [!NOTE]
> This tutorial helps you to learn the content of these learn topics: [Azure SQL Database access and control](sql-database-control-access.md), [Controlling and greanting database access](sql-database-manage-logins.md), [Principals](https://msdn.microsoft.com/library/ms181127.aspx), [Database-Level Roles](https://msdn.microsoft.com/library/ms189121.aspx), and [Overview of Azure SQL Database firewall rules](sql-database-firewall-configure.md).
>  

## Sign in to the Azure portal using your Azure account
Using your [existing subscription](https://account.windowsazure.com/Home/Index), follow these steps to connect to the Azure portal.

1. Open your browser of choice and connect to the [Azure portal](https://portal.azure.com/).
2. Sign in to the [Azure portal](https://portal.azure.com/).
3. On the **Sign in** page, provide the credentials for your subscription.
   
   ![Sign in](./media/sql-database-get-started/login.png)


<a name="create-logical-server-bk"></a>

## View information about the security configuration for your logical server

In this section of the tutorial, you view information about the security configuration for your logical server in the Azure portal.

1. Open the **SQL Server** blade for your logical server and view the information in the **Overview** page.

   ![SQL admin account in the Azure portal](./media/sql-database-control-access-sql-authentication-get-started/sql_admin_portal.png)

2. Make note of the name of the server admin account for the logical server. If you do not remember the password, click **Rest password** to set a new password.

> [!NOTE]
> To review connection informationn for this server, go to [View or update server settings](sql-database-view-update-server-settings.md).
>

## Connect to SQL server using SQL Server Management Studio (SSMS)

1. If you have not already done so, download and install the latest version of SSMS at [Download SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx). To stay up-to-date, the latest version of SSMS prompts you when there is a new version available to download.

2. After installing, type **Microsoft SQL Server Management Studio** in the Windows search box and click **Enter** to open SSMS:

   ![SQL Server Management Studio](./media/sql-database-get-started/ssms.png)

3. In the Connect to Server dialog box, enter the necessary information to connect to your SQL server using SQL Server Authentication.

   ![connect to server](./media/sql-database-get-started/connect-to-server.png)

4. Click **Connect**.

   ![connected to server](./media/sql-database-get-started/connected-to-server.png)

## View the server admin account and its permissions 
In this section of the tutorial, you view information about the server admin account and its permissions in the master database and in user databases.

1. In Object Explorer, expand **Security**, and then expand **Logins** to view the existing logins for your Azure SQL Database server. Notice that a login appears for the server admin specified during provisioning - the "sqladmin" login for this tutorial series.

   ![server admin login](./media/sql-database-control-access-sql-authentication-get-started/server_admin_login.png)

2. In Object Explorer, expand **Databases**, expand **System databases**, expand **master**, expand **Security**, and then expand **Users**. Notice that a user account has been created in the master database for the server admin login, with the same name for the user account as the login (the names do not have to match, but it is a best practice to avoid confusion).

   ![master database user account for server admin](./media/sql-database-control-access-sql-authentication-get-started/master_database_user_account_for_server_admin.png)

   > [!NOTE]
   > For informataion about the other user accounts that appear, see [Principals](https://msdn.microsoft.com/library/ms181127.aspx).
   >

3. In Object Explorer, right-click **master** and then click **New Query**.
4. In the query window, execute the following query to return information about the user executing the query. Notice that "sqladmin" is returned for the user account executing this query (we will see a different result when we query a user database later in this procedure).

   ```
   SELECT USER
   ```

   ![select user query in the master database](./media/sql-database-control-access-sql-authentication-get-started/select_user_query_in_master_database.png)

5. In the query window, execute the following query to return information about the permissions of the user executing the query. Notice that "sqladmin" has permisisons to connect to the master database, create logins and users, select information from system objects, and grant users permissions to the dbmanager and dbcreator roles. See [Permissions](https://msdn.microsoft.com/library/ms191291.aspx) for more information.

   ```
   SELECT prm.permission_name
      , prm.class_desc
      , prm.state_desc
      , p2.name as 'Database role'
      , p3.name as 'Additional database role' 
   FROM sys.database_principals p
   JOIN sys.database_permissions prm
      ON p.principal_id = prm.grantee_principal_id
      LEFT JOIN sys.database_principals p2
      ON prm.major_id = p2.principal_id
      LEFT JOIN sys.database_role_members r
      ON p.principal_id = r.member_principal_id
      LEFT JOIN sys.database_principals p3
      ON r.role_principal_id = p3.principal_id
   WHERE p.name = 'sqladmin';
   ```

   ![server admin permissions in the master database](./media/sql-database-control-access-sql-authentication-get-started/server_admin_permissions_in_master_database.png)

6. In Object Explorer, expand **blankdb**, expand **Security**, and then expand **Users**. Notice that there is no user account called "sqladmin" in this database.

   ![user accounts in blankdb](./media/sql-database-control-access-sql-authentication-get-started/user_accounts_in_blankdb.png)

7. In Object Explorer, right-click **blankdb** and then click **New Query**.

8. In the query window, execute the following query to return information about the user executing the query. Notice that "dbo" is returned for the user account executing this query (by default, a server admin login is mapped to the dbo account in each user database).

   ```
   SELECT USER
   ```

   ![select user query in the blankdb database](./media/sql-database-control-access-sql-authentication-get-started/select_user_query_in_blankdb_database.png)

9. In the query window, execute the following query to return information about the permissions of the user executing the query. Notice that "dbo" is a member of the public role and also a member of the db_owner fixed database role. See [Database-Level Roles](https://msdn.microsoft.com/library/ms189121.aspx) for more information.

   ```
   SELECT prm.permission_name
      , prm.class_desc
      , prm.state_desc
      , p2.name as 'Database role'
      , p3.name as 'Additional database role' 
   FROM sys.database_principals p
   JOIN sys.database_permissions prm
      ON p.principal_id = prm.grantee_principal_id
      LEFT JOIN sys.database_principals p2
      ON prm.major_id = p2.principal_id
      LEFT JOIN sys.database_role_members r
      ON p.principal_id = r.member_principal_id
      LEFT JOIN sys.database_principals p3
      ON r.role_principal_id = p3.principal_id
   WHERE p.name = 'dbo';
   ```

   ![server admin permissions in the blankdb database](./media/sql-database-control-access-sql-authentication-get-started/server_admin_permissions_in_blankdb_database.png)

10. Optionally, repeat the previous 3 steps for the AdventureWorksLT user database.

## Create a new user in the AdventureWorksLT database with SELECT permissions

In this section of the tutorial, you create a new user in the AdventureWorksLT database, test this user's permissions as member of the public role, grant this user SELECT permissions, and then test this user's permissions again.

## Create a database-level firewall rule for AdventureWorksLT database users

In this section of the tutorial, you log in as the new AdventureWorksLT database user using the same computer for which you created a server-level firewall rule, attempt to log in from a computer with a different IP address, create a database-level firewall rule, and then log in using this new database-level firewall rule. 

## Create a new user in the blankdb database with db_owner permissions

In this section of the tutorial, you create a new user in the blankdb database with db_owner permissions 

## Create a database-level firewall rule for blankdb database users

In this section of the tutorial, you create a database-level firewall rule for blankdb database Users

## Create a new login and user in the master database with dbmanager permissions

In this section of the tutorial, you create a new login and user in the master database with permissions to create new user databases.

## Create a server-level firewall rule for dbmanager user

In this section of the tutorial, you create a new server-level firewall rule for the dbmanager user to enable this user to connect to all databases on the server.


## Next steps
Now that you've completed this SQL Database tutorial and created a user account and granted the user account dbo permissions, you are ready to learn more about 
[SQL Database security](sql-database-manage-logins.md).

