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
ms.date: 02/17/2017
ms.author: carlrab

---
# SQL Server authentication, access, and database-level firewall rules

In this tutorial, you learn how to use SQL Server Management Studio to work with SQL Server authentication, logins, users, and database roles that grant access and permissions to Azure SQL Database servers and databases. After you complete this tutorial, you will know how to:

- Create logins and users based on SQL Server authentication
- Add users to roles and grant permissions to roles
- Use T-SQL to create a database-level and a server-level firewall rule 
- Connect as a user to a specific database using SSMS
- View user permissions in the master database and in user databases

**Time estimate**: This tutorial takes approximately 45 minutes to complete (assuming you have already met the prerequisites).

> [!NOTE]
> This tutorial helps you to learn the content of these topics: [SQL Database access and control](sql-database-control-access.md), [Logins, users, and database roles](sql-database-manage-logins.md), [Principals](https://msdn.microsoft.com/library/ms181127.aspx), [Database roles](https://msdn.microsoft.com/library/ms189121.aspx), and [SQL Database firewall rules](sql-database-firewall-configure.md). For a tutorial about Azure Active Directory authentication, see [Getting started with Azure AD Authention](sql-database-control-access-aad-authentication-get-started.md).
>  

## Prerequisites

* **An Azure account**. You need an Azure account. You can [open a free Azure account](https://azure.microsoft.com/free/) or [Activate Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits/). 

* **Azure create permissions**. You must be able to connect to the Azure portal using an account that is a member of either the subscription owner or contributor role. For more information on role-based access control (RBAC), see [Getting started with access management in the Azure portal](../active-directory/role-based-access-control-what-is.md).

* **SQL Server Management Studio**. You can download and install the latest version of SQL Server Management Studio (SSMS) at [Download SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx). Always use the latest version of SSMS when connecting to Azure SQL Database as new capabilities are continually being released.

* **Completed the base tutorial**. You have completed the [Get started with Azure SQL Database servers, databases, and firewall rules by using the Azure portal and SQL Server Management Studio](sql-database-get-started.md) or the equivalent [PowerShell version](sql-database-get-started-powershell.md) of this tutorial. If not, either complete this prerequisite tutorial or execute the PowerShell script at the end of the [PowerShell version](sql-database-get-started-powershell.md) of this tutorial before continuing.



## Sign in to the Azure portal using your Azure account
The steps in this procedure show you how to connect to the Azure portal using your Azure account](https://account.windowsazure.com/Home/Index).

1. Open your browser of choice and connect to the [Azure portal](https://portal.azure.com/).
2. Sign in to the [Azure portal](https://portal.azure.com/).
3. On the **Sign in** page, provide the credentials for your subscription.
   
   ![Sign in](./media/sql-database-get-started/login.png)


<a name="create-logical-server-bk"></a>

## View logical server security information in the Azure portal

In this section of the tutorial, you view information about the security configuration for your logical server in the Azure portal.

1. Open the **SQL Server** blade for your logical server and view the information in the **Overview** page.

   ![Server admin account in the Azure portal](./media/sql-database-control-access-sql-authentication-get-started/sql_admin_portal.png)

2. Make note of the name of the Server admin account for the logical server. If you do not remember the password, click **Reset password** to set a new password.

> [!NOTE]
> To review connection information for this server, go to [Manage servers](sql-database-manage-servers-portal.md). For this tutorial series, the fully qualified server name is 'sqldbtutorialserver.database.windows.net'.
>

## Connect to server using the server principal login

1. If you have not already done so, download and install the latest version of SSMS at [Download SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx). To stay up-to-date, the latest version of SSMS prompts you when there is a new version available to download.

2. After installing, type **Microsoft SQL Server Management Studio** in the Windows search box and click **Enter** to open SSMS.

   ![SQL Server Management Studio](./media/sql-database-get-started/ssms.png)

3. In the **Connect to Server** dialog box, enter the necessary information to connect to your SQL server using SQL Server Authentication and the Server admin account.

   ![connect to server](./media/sql-database-get-started/connect-to-server.png)

4. Click **Connect**.

   ![connected to server](./media/sql-database-get-started/connected-to-server.png)

## View the principal login account and its permissions 
In this section of the tutorial, you view information about the server admin account and its permissions in the master database and in user databases.

1. In Object Explorer, expand **Security**, and then expand **Logins** to view the existing logins for your Azure SQL Database server. Notice that a login appears for the Server admin account specified during provisioning - the sqladmin login for this tutorial series.

   ![Server admin login](./media/sql-database-control-access-sql-authentication-get-started/server_admin_login.png)

2. In Object Explorer, expand **Databases**, expand **System databases**, expand **master**, expand **Security**, and then expand **Users**. Notice that a user account has been created in the master database for the Server admin login, with the same name for the user account as the login (the names do not have to match, but it is a best practice to avoid confusion).

   ![master database user account for server admin](./media/sql-database-control-access-sql-authentication-get-started/master_database_user_account_for_server_admin.png)

   > [!NOTE]
   > For information about the other user accounts that appear, see [Principals](https://msdn.microsoft.com/library/ms181127.aspx).
   >

3. In Object Explorer, right-click **master** and then click **New Query** to open a query window connected to the master database.
4. In the query window, execute the following query to return information about the user executing the query. Notice that sqladmin is returned for the user account executing this query (we see a different result when we query a user database later in this procedure).

   ```
   SELECT USER;
   ```

   ![select user query in the master database](./media/sql-database-control-access-sql-authentication-get-started/select_user_query_in_master_database.png)

5. In the query window, execute the following query to return information about the permissions of the sqladmin user. Notice that sqladmin has permissions to connect to the master database, create logins and users, select information from the sys.sql_logins table, and add users to the dbmanager and dbcreator database roles. These permissions are in addition to permissions granted to the public role from which all users inherit permissions (such as permissions to select information from certain tables). See [Permissions](https://msdn.microsoft.com/library/ms191291.aspx) for more information.

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

6. In Object Explorer, expand **blankdb**, expand **Security**, and then expand **Users**. Notice that there is no user account called sqladmin in this database.

   ![user accounts in blankdb](./media/sql-database-control-access-sql-authentication-get-started/user_accounts_in_blankdb.png)

7. In Object Explorer, right-click **blankdb** and then click **New Query**.

8. In the query window, execute the following query to return information about the user executing the query. Notice that dbo is returned for the user account executing this query (by default, the Server admin login is mapped to the dbo user account in each user database).

   ```
   SELECT USER;
   ```

   ![select user query in the blankdb database](./media/sql-database-control-access-sql-authentication-get-started/select_user_query_in_blankdb_database.png)

9. In the query window, execute the following query to return information about the permissions of the dbo user. Notice that dbo is a member of the public role and also a member of the db_owner fixed database role. See [Database-Level Roles](https://msdn.microsoft.com/library/ms189121.aspx) for more information.

   ```
   SELECT prm.permission_name
      , prm.class_desc
      , prm.state_desc
      , p2.name as 'Database role'
      , p3.name as 'Additional database role' 
   FROM sys.database_principals AS p
   JOIN sys.database_permissions AS prm
      ON p.principal_id = prm.grantee_principal_id
      LEFT JOIN sys.database_principals AS p2
      ON prm.major_id = p2.principal_id
      LEFT JOIN sys.database_role_members r
      ON p.principal_id = r.member_principal_id
      LEFT JOIN sys.database_principals AS p3
      ON r.role_principal_id = p3.principal_id
   WHERE p.name = 'dbo';
   ```

   ![server admin permissions in the blankdb database](./media/sql-database-control-access-sql-authentication-get-started/server_admin_permissions_in_blankdb_database.png)

10. Optionally, repeat the previous three steps for the AdventureWorksLT user database.

## Create a new user with SELECT permissions

In this section of the tutorial, you create a user account in the AdventureWorksLT database, test this user's permissions as member of the public role, grant this user SELECT permissions, and then test this user's permissions again.

> [!NOTE]
> Database-level users ([contained users](https://msdn.microsoft.com/library/ff929188.aspx)) increase the portability of your database, a capability that we explore in later tutorials.
>

1. In Object Explorer, right-click **AdventureWorksLT** and then click **New Query** to open a query window connected to the AdventureWorksLT database.
2. Execute the following statement to create a user called user1 in the AdventureWorksLT database.

   ```
   CREATE USER user1
   WITH PASSWORD = 'p@ssw0rd';
   ```
   ![new user user1 AdventureWorksLT](./media/sql-database-control-access-sql-authentication-get-started/new_user_user1_aw.png)

3. In the query window, execute the following query to return information about the permissions of user1. Notice that the only permissions that user1 has are the permissions inherited from the public role.

   ```
   SELECT prm.permission_name
      , prm.class_desc
      , prm.state_desc
      , p2.name as 'Database role'
      , p3.name as 'Additional database role' 
   FROM sys.database_principals AS p
   JOIN sys.database_permissions AS prm
      ON p.principal_id = prm.grantee_principal_id
      LEFT JOIN sys.database_principals AS p2
      ON prm.major_id = p2.principal_id
      LEFT JOIN sys.database_role_members r
      ON p.principal_id = r.member_principal_id
      LEFT JOIN sys.database_principals AS p3
      ON r.role_principal_id = p3.principal_id
   WHERE p.name = 'user1';
   ```

   ![new user permissions in a user database](./media/sql-database-control-access-sql-authentication-get-started/new_user_permissions_in_user_database.png)

4. Execute the following queries to attempt to query a table in the AdventureWorksLT database as user1.

   ```
   EXECUTE AS USER = 'user1';  
   SELECT * FROM [SalesLT].[ProductCategory];
   REVERT;
   ```

   ![no select permissions](./media/sql-database-control-access-sql-authentication-get-started/no_select_permissions.png)

5. Execute the following statement to grant SELECT permissions on the ProductCategory table in the SalesLT schema to user1.

   ```
   GRANT SELECT ON OBJECT::[SalesLT].[ProductCategory] to user1;
   ```

   ![grant select permissions](./media/sql-database-control-access-sql-authentication-get-started/grant_select_permissions.png)

6. Execute the following queries to attempt to query a table in the AdventureWorksLT database as user1.

   ```
   EXECUTE AS USER = 'user1';  
   SELECT * FROM [SalesLT].[ProductCategory];
   REVERT;
   ```

   ![select permissions](./media/sql-database-control-access-sql-authentication-get-started/select_permissions.png)

## Create a database-level firewall rule using T-SQL

In this section of the tutorial, you log attempt to log in from a computer with a different IP address, create a database-level firewall rule as the Server admin, and then log in using this new database-level firewall rule. 

> [!NOTE]
> [Database-level firewall rules](sql-database-firewall-configure.md) increase the portability of your database, a capability that we explore in later tutorials.
>

1. On another computer for which you have not already created a server-level firewall rule, open SQL Server Management Studio.

   > [!IMPORTANT]
   > Always use the latest version of SSMS at [Download SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx). 
   >

2. In the **Connect to Server** window, enter the server name and authentication information to connect using SQL Server authentication with the user1 account. 
    
   ![Connect as user1 without firewall rule1](./media/sql-database-control-access-sql-authentication-get-started/connect-user1_no_rule1.png)

3. Click **Options** to specify the database to which you want to connect and then type **AdventureWorksLT** in the **Connect to Database** drop-down box on the **Connection Properties** tab.
   
   ![Connect as user1 without firewall rule2](./media/sql-database-control-access-sql-authentication-get-started/connect-user1_no_rule2.png)

4. Click **Connect**. A dialog box appears informing you that the computer from which you are attempting to connect to SQL Database does not have a firewall rule enabling access to the database. The dialog box that you receive has two variations depending upon steps you have previously taken with firewalls, but you usually get the first dialog box shown.

   ![Connect as user1 without firewall rule3](./media/sql-database-control-access-sql-authentication-get-started/connect-user1_no_rule3.png)

   ![Connect as user1 without firewall rule4](./media/sql-database-control-access-sql-authentication-get-started/connect-user1_no_rule4.png)

   > [!NOTE]
   > The newest versions of SSMS include the functionality to allow subscription owners and contributors to sign in to Microsoft Azure and create a server-level firewall rule.
   > 

4. Copy the client IP address from this dialog box for use in step 7.
5. Click **Cancel** but do not close the **Connect to Server** dialog box.
6. Switch back to a computer for which you have already created a server-level firewall rule and connect to your server using the Server admin account.
7. In a new query window connected to the AdventureWorksLT database as Server admin, execute the following statement to create a database-level firewall by executing [sp_set_database_firewall_rule](https://msdn.microsoft.com/library/dn270010.aspx) using the IP address from step 4:

   ```
   EXEC sp_set_database_firewall_rule @name = N'AdventureWorksLTFirewallRule', 
     @start_ip_address = 'x.x.x.x', @end_ip_address = 'x.x.x.x';
   ```

   ![add firewall rule](./media/sql-database-control-access-sql-authentication-get-started/user1_add_rule_aw.png)

8. Switch computers again and click **Connect** in the **Connect to Server** dialog box to connect to AdventureWorksLT as user1. 

   ![Connect as user1 with firewall rule1](./media/sql-database-control-access-sql-authentication-get-started/connect-user1_rule1.png)

9. In Object Explorer, expand **Databases**, expand **AdventureWorksLT**, and then expand **Tables**. Notice that user1 only has permission to view a single table, the **SalesLT.ProductCategory** table. 

   ![Connect as user1 and view objects1](./media/sql-database-control-access-sql-authentication-get-started/connect-user1_view_objects1.png)

10. In Object Explorer, right-click **SalesLT.ProductCategory** and click **Select Top 1000 Rows**.   

   ![user1 query1](./media/sql-database-control-access-sql-authentication-get-started/user1_query1.png)

   ![user1 query1 results](./media/sql-database-control-access-sql-authentication-get-started/user1_query1_results.png)

## Create a new user as db_owner and a database-level firewall rule

In this section of the tutorial, you create a user in the blankdb database with db_owner database role permissions and create a database-level firewall for this database using the Server admin account. 

1. Switch to your computer with a connection to SQL Database using the Server admin account.
2. Open a query window connected to the blankdb database and execute the following statement to create a user called blankdbadmin in the blankdb database.

   ```
   CREATE USER blankdbadmin
   WITH PASSWORD = 'p@ssw0rd';
   ```

3. In the same query window, execute the following statement to add the blankdbadmin user to the db_owner database role. This user can now perform all actions necessary to manage the blankdb database.

   ```
   ALTER ROLE db_owner ADD MEMBER blankdbadmin; 
   ```

4. In the same query window, execute the following statement to create a database-level firewall by executing [sp_set_database_firewall_rule](https://msdn.microsoft.com/library/dn270010.aspx) using the IP address from step 4 in the previous procedure (or a range of IP addresses for users of this database):

   ```
   EXEC sp_set_database_firewall_rule @name = N'blankdbFirewallRule', 
     @start_ip_address = 'x.x.x.x', @end_ip_address = 'x.x.x.x';
   ```

5. Switch computers (to one for which you have created a database-level firewall rule) and connect to the blankdb database using the blankdbadmin user account.
6. Open a query window to the blankdb database and execute the following statement to create a user called blankdbuser1 in the blankdb database.

   ```
   CREATE USER blankdbuser1
   WITH PASSWORD = 'p@ssw0rd';
   ```
 
7. As necessary for your learning environment, create an additional database-level firewall rule for this user. 

## Grant dbmanager permissions and create a server-level firewall rule

In this section of the tutorial, you create a login and user in the master database with permissions to create and manage new user databases. You also create an additional server-level firewall rule using Transact-SQL using [sp_set_firewall_rule](https://msdn.microsoft.com/library/dn270017.aspx).

> [!NOTE]
> Creating logins in the master database and creating a user account from a login is required for the Server admin account holder to delegate create database permissions to another user. However, creating logins and users from logins decreases the portability of your environment, the consequences of which we explore in later tutorials - including how to anticipate and handle as part of planning for disaster recovery.
>

1. Switch to your computer with a connection to SQL Database using the Server admin account.
2. Open a query window connected to the master database and execute the following statement to create a login called dbcreator in the master database.

   ```
   CREATE LOGIN dbcreator
   WITH PASSWORD = 'p@ssw0rd';
   ```

3. In the same query window, 

   ```
   CREATE USER dbcreator
   FROM LOGIN dbcreator;
   ```

3. In the same query window, execute the following query to add the dbcreator user to the dbmanager database role. This user can now create and manage databases created by the user.

   ```
   ALTER ROLE dbmanager ADD MEMBER dbcreator; 
   ```

4. In the same query window, execute the following query to create a server-level firewall by executing [sp_set_database_firewall_rule](https://msdn.microsoft.com/library/dn270010.aspx) using an IP address appropriate for your environment:

   ```
   EXEC sp_set_firewall_rule @name = N'dbcreatorFirewallRule', 
     @start_ip_address = 'x.x.x.x', @end_ip_address = 'x.x.x.x';
   ```

5. Switch computers (to one for which you have created a server-level firewall rule) and connect to the master database using the dbcreator user account.
6. Open a query window to the master database and execute the following query to create a database called foo.

   ```
   CREATE DATABASE FOO (EDITION = 'basic');
   ```
 7. Optionally, delete this database to save money using the following statement:

   ```
   DROP DATABASE FOO;
   ```

## Complete script

To create the logins and users, add them to roles, grant them permissions, create database-level firewall rules, and create server-level firewall rules, execute the following statements in the appropriate databases on your server.

### master database
Execute these statements in the master database using the Server admin account, adding the appropriate IP addresses or range.

```
CREATE LOGIN dbcreator WITH PASSWORD = 'p@ssw0rd';
CREATE USER dbcreator FROM LOGIN dbcreator;
ALTER ROLE dbmanager ADD MEMBER dbcreator;
EXEC sp_set_firewall_rule @name = N'dbcreatorFirewallRule', 
     @start_ip_address = 'x.x.x.x', @end_ip_address = 'x.x.x.x';
```

### AdventureWorksLT database
Execute these statements in the AdventureWorksLT database using the Server admin account, adding the appropriate IP addresses or range.

```
CREATE USER user1 WITH PASSWORD = 'p@ssw0rd';
GRANT SELECT ON OBJECT::[SalesLT].[ProductCategory] to user1;
EXEC sp_set_database_firewall_rule @name = N'AdventureWorksLTFirewallRule', 
     @start_ip_address = 'x.x.x.x', @end_ip_address = 'x.x.x.x';
```

### blankdb database
Execute these statements in the blankdb database using the Server admin account, adding the appropriate IP addresses or range.

```
CREATE USER blankdbadmin
   WITH PASSWORD = 'p@ssw0rd';
ALTER ROLE db_owner ADD MEMBER blankdbadmin;
EXEC sp_set_database_firewall_rule @name = N'blankdbFirewallRule', 
     @start_ip_address = 'x.x.x.x', @end_ip_address = 'x.x.x.x';
CREATE USER blankdbuser1
   WITH PASSWORD = 'p@ssw0rd';
```

## Next steps
- For an overview of access and control in SQL Database, see [SQL Database access and control](sql-database-control-access.md).
- For an overview of logins, users, and database roles in SQL Database, see [Logins, users, and database roles](sql-database-manage-logins.md).
- For more information about database principals, see [Principals](https://msdn.microsoft.com/library/ms181127.aspx).
- For more information about database roles, see [Database roles](https://msdn.microsoft.com/library/ms189121.aspx).
- For more information about firewall rules in SQL Database, see [SQL Database firewall rules](sql-database-firewall-configure.md).
- For a tutorial using Azure Active Directory authentication, see [Azure AD authentication and authorization](sql-database-control-access-aad-authentication-get-started.md).

