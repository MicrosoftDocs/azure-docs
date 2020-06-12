---
title: Authorize server and database access using logins and user accounts
titleSuffix: Azure SQL Database & SQL Managed Instance & Azure Synapse Analytics
description: Learn about how Azure SQL Database, SQL Managed Instance, and Azure Synapse authenticate users for access using logins and user accounts. Also learn how to grant database roles and explicit permissions to authorize logins and users to perform actions and query data.
keywords: sql database security,database security management,login security,database security,database access
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: sqldbrb=3
ms.devlang: 
ms.topic: conceptual
author: VanMSFT
ms.author: vanto
ms.reviewer: carlrab
ms.date: 03/23/2020
---
# Authorize database access to SQL Database, SQL Managed Instance, and Azure Synapse Analytics
[!INCLUDE[appliesto-sqldb-sqlmi-asa](../includes/appliesto-sqldb-sqlmi-asa.md)]

In this article, you learn about:

- Options for configuring Azure SQL Database, Azure SQL Managed Instance, and Azure Synapse Analytics (formerly Azure SQL Data Warehouse) to enable users to perform administrative tasks and to access the data stored in these databases.
- The access and authorization configuration after initially creating a new server.
- How to add logins and user accounts in the master database and user accounts and then grant these accounts administrative permissions.
- How to add user accounts in user databases, either associated with logins or as contained user accounts.
- Configure user accounts with permissions in user databases by using database roles and explicit permissions.

> [!IMPORTANT]
> Databases in Azure SQL Database, Azure SQL Managed Instance, and Azure Synapse are referred to collectively in the remainder of this article as databases, and the server is referring to the [server](logical-servers.md) that manages databases for Azure SQL Database and Azure Synapse.

## Authentication and authorization

[**Authentication**](security-overview.md#authentication) is the process of proving the user is who they claim to be. A user connects to a database using a user account.
When a user attempts to connect to a database, they provide a user account and authentication information. The user is authenticated using one of the following two authentication methods:

- [SQL authentication](https://docs.microsoft.com/sql/relational-databases/security/choose-an-authentication-mode#connecting-through-sql-server-authentication).

  With this authentication method, the user submits a user account name and associated password to establish a connection. This password is stored in the master database for user accounts linked to a login or stored in the database containing the user accounts *not* linked to a login.
- [Azure Active Directory Authentication](authentication-aad-overview.md)

  With this authentication method, the user submits a user account name and requests that the service use the credential information stored in Azure Active Directory (Azure AD).

**Logins and users**: A user account in a database can be associated with a login that is stored in the master database or can be a user name that is stored in an individual database.

- A **login** is an individual account in the master database, to which a user account in one or more databases can be linked. With a login, the credential information for the user account is stored with the login.
- A **user account** is an individual account in any database that may be, but does not have to be, linked to a login. With a user account that is not linked to a login, the credential information is stored with the user account.

[**Authorization**](security-overview.md#authorization) to access data and perform various actions are managed using database roles and explicit permissions. Authorization refers to the permissions assigned to a user, and determines what that user is allowed to do. Authorization is controlled by your user account's database [role memberships](https://docs.microsoft.com/sql/relational-databases/security/authentication-access/database-level-roles) and [object-level permissions](https://docs.microsoft.com/sql/relational-databases/security/permissions-database-engine). As a best practice, you should grant users the least privileges necessary.

## Existing logins and user accounts after creating a new database

When you first deploy Azure SQL, you specify an admin login and an associated password for that login. This administrative account is called **Server admin**. The following configuration of logins and users in the master and user databases occurs during deployment:

- A SQL login with administrative privileges is created using the login name you specified. A [login](https://docs.microsoft.com/sql/relational-databases/security/authentication-access/principals-database-engine#sa-login) is an individual user account for logging in to SQL Database, SQL Managed Instance, and Azure Synapse.
- This login is granted full administrative permissions on all databases as a [server-level principal](https://docs.microsoft.com/sql/relational-databases/security/authentication-access/principals-database-engine). The login has all available permissions and can't be limited. In a SQL Managed Instance, this login is added to the [sysadmin fixed server role](https://docs.microsoft.com/sql/relational-databases/security/authentication-access/server-level-roles) (this role does not exist in Azure SQL Database).
- A [user account](https://docs.microsoft.com/sql/relational-databases/security/authentication-access/getting-started-with-database-engine-permissions#database-users) called `dbo` is created for this login in each user database. The [dbo](https://docs.microsoft.com/sql/relational-databases/security/authentication-access/principals-database-engine) user has all database permissions in the database and is mapped to the `db_owner` fixed database role. Additional fixed database roles are discussed later in this article.

To identify the administrator accounts for a database, open the Azure portal, and navigate to the **Properties** tab of your server or managed instance.

![SQL Server Admins](./media/logins-create-manage/sql-admins.png)

![SQL Server Admins](./media/logins-create-manage/sql-admins2.png)

> [!IMPORTANT]
> The admin login name can't be changed after it has been created. To reset the password for the server admin, go to the [Azure portal](https://portal.azure.com), click **SQL Servers**, select the server from the list, and then click **Reset Password**. To reset the password for the SQL Managed Instance, go to the Azure portal, click the instance, and click **Reset password**. You can also use PowerShell or the Azure CLI.

## Create additional logins and users having administrative permissions

At this point, your server or managed instance is only configured for access using a single SQL login and user account. To create additional logins with full or partial administrative permissions, you have the following options (depending on your deployment mode):

- **Create an Azure Active Directory administrator account with full administrative permissions**

  Enable Azure Active Directory authentication and create an Azure AD administrator login. One Azure Active Directory account can be configured as an administrator of the Azure SQL deployment with full administrative permissions. This account can be either an individual or security group account. An Azure AD administrator **must** be configured if you want to use Azure AD accounts to connect to SQL Database, SQL Managed Instance, or Azure Synapse. For detailed information on enabling Azure AD authentication for all Azure SQL deployment types, see the following articles:

  - [Use Azure Active Directory authentication for authentication with SQL](authentication-aad-overview.md)
  - [Configure and manage Azure Active Directory authentication with SQL](authentication-aad-configure.md)

- **In SQL Managed Instance, create SQL logins with full administrative permissions**

  - Create an additional SQL login in the master database.
  - Add the login to the [sysadmin fixed server role](https://docs.microsoft.com/sql/relational-databases/security/authentication-access/server-level-roles) using the [ALTER SERVER ROLE](https://docs.microsoft.com/sql/t-sql/statements/alter-server-role-transact-sql) statement. This login will have full administrative permissions.
  - Alternatively, create an [Azure AD login](authentication-aad-configure.md#provision-azure-ad-admin-sql-managed-instance) using the [CREATE LOGIN](/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-mi-current) syntax.

- **In SQL Database, create SQL logins with limited administrative permissions**

  - Create an additional SQL login in the master database.
  - Create a user account in the master database associated with this new login.
  - Add the user account to the `dbmanager`, the `loginmanager` role, or both in the `master` database using the [ALTER SERVER ROLE](https://docs.microsoft.com/sql/t-sql/statements/alter-server-role-transact-sql) statement (for Azure Synapse, use the [sp_addrolemember](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-addrolemember-transact-sql) statement).

  > [!NOTE]
  > `dbmanager` and `loginmanager` roles do **not** pertain to SQL Managed Instance deployments.

  Members of these [special master database roles](https://docs.microsoft.com/sql/relational-databases/security/authentication-access/database-level-roles#special-roles-for--and-) for Azure SQL Database have authority to create and manage databases or to create and manage logins. In databases created by a user that is a member of the `dbmanager` role, the member is mapped to the `db_owner` fixed database role and can log into and manage that database using the `dbo` user account. These roles have no explicit permissions outside of the master database.

  > [!IMPORTANT]
  > You can't create an additional SQL login with full administrative permissions in SQL Database.

## Create accounts for non-administrator users

You can create accounts for non-administrative users using one of two methods:

- **Create a login**

  Create a SQL login in the master database. Then create a user account in each database to which that user needs access and associate the user account with that login. This approach is preferred when the user must access multiple databases and you wish to keep the passwords synchronized. However, this approach has complexities when used with geo-replication as the login must be created on both the primary server and the secondary server(s). For more information, see [Configure and manage Azure SQL Database security for geo-restore or failover](active-geo-replication-security-configure.md).
- **Create a user account**

  Create a user account in the database to which a user needs access (also called a [contained user](/sql/relational-databases/security/contained-database-users-making-your-database-portable).

  - With SQL Database, you can always create this type of user account.
  - With SQL Managed Instance supporting [Azure AD server principals](authentication-aad-configure.md#create-contained-users-mapped-to-azure-ad-identities), you can create user accounts to authenticate to the SQL Managed Instance without requiring database users to be created as a contained database user.

  With this approach, the user authentication information is stored in each database, and replicated to geo-replicated databases automatically. However, if the same account exists in multiple databases and you are using Azure SQL Authentication, you must keep the passwords synchronized manually. Additionally, if a user has an account in different databases with different passwords, remembering those passwords can become a problem.

> [!IMPORTANT]
> To create contained users mapped to Azure AD identities, you must be logged in using an Azure AD account that is an administrator in the database in Azure SQL Database. In SQL Managed Instance, a SQL login with `sysadmin` permissions can also create an Azure AD login or user.

For examples showing how to create logins and users, see:

- [Create login for Azure SQL Database](https://docs.microsoft.com/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-current#examples-1)
- [Create login for Azure SQL Managed Instance](https://docs.microsoft.com/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-mi-current#examples-2)
- [Create login for Azure Synapse](https://docs.microsoft.com/sql/t-sql/statements/create-login-transact-sql?view=azure-sqldw-latest#examples-3)
- [Create user](https://docs.microsoft.com/sql/t-sql/statements/create-user-transact-sql#examples)
- [Creating Azure AD contained users](authentication-aad-configure.md#create-contained-users-mapped-to-azure-ad-identities)

> [!TIP]
> For a security tutorial that includes creating users in Azure SQL Database, see [Tutorial: Secure Azure SQL Database](secure-database-tutorial.md).

## Using fixed and custom database roles

After creating a user account in a database, either based on a login or as a contained user, you can authorize that user to perform various actions and to access data in a particular database. You can use the following methods to authorize access:

- **Fixed database roles**

  Add the user account to a [fixed database role](https://docs.microsoft.com/sql/relational-databases/security/authentication-access/database-level-roles). There are 9 fixed database roles, each with a defined set of permissions. The most common fixed database roles are: **db_owner**, **db_ddladmin**, **db_datawriter**, **db_datareader**, **db_denydatawriter**, and **db_denydatareader**. **db_owner** is commonly used to grant full permission to only a few users. The other fixed database roles are useful for getting a simple database in development quickly, but are not recommended for most production databases. For example, the **db_datareader** fixed database role grants read access to every table in the database, which is more than is strictly necessary.

  - To add a user to a fixed database role:

    - In Azure SQL Database, use the [ALTER ROLE](https://docs.microsoft.com/sql/t-sql/statements/alter-role-transact-sql) statement. For examples, see [ALTER ROLE examples](https://docs.microsoft.com/sql/t-sql/statements/alter-role-transact-sql#examples)
    - Azure Synapse, use the [sp_addrolemember](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-addrolemember-transact-sql) statement. For examples, see [sp_addrolemember examples](https://docs.microsoft.com/sql/t-sql/statements/alter-role-transact-sql).

- **Custom database role**

  Create a custom database role using the [CREATE ROLE](https://docs.microsoft.com/sql/t-sql/statements/create-role-transact-sql) statement. A custom role enables you to create your own user-defined database roles and carefully grant each role the least permissions necessary for the business need. You can then add users to the custom role. When a user is a member of multiple roles, they aggregate the permissions of them all.
- **Grant permissions directly**

  Grant the user account [permissions](https://docs.microsoft.com/sql/relational-databases/security/permissions-database-engine) directly. There are over 100 permissions that can be individually granted or denied in SQL Database. Many of these permissions are nested. For example, the `UPDATE` permission on a schema includes the `UPDATE` permission on each table within that schema. As in most permission systems, the denial of a permission overrides a grant. Because of the nested nature and the number of permissions, it can take careful study to design an appropriate permission system to properly protect your database. Start with the list of permissions at [Permissions (Database Engine)](https://docs.microsoft.com/sql/relational-databases/security/permissions-database-engine) and review the [poster size graphic](https://docs.microsoft.com/sql/relational-databases/security/media/database-engine-permissions.png) of the permissions.

## Using groups

Efficient access management uses permissions assigned to Active Directory security groups and fixed or custom roles instead of to individual users.

- When using Azure Active Directory authentication, put Azure Active Directory users into an Azure Active Directory security group. Create a contained database user for the group. Place one or more database users into a custom database role with specific permissions appropriate to that group of users.

- When using SQL authentication, create contained database users in the database. Place one or more database users into a custom database role with specific permissions appropriate to that group of users.

  > [!NOTE]
  > You can also use groups for non-contained database users.

You should familiarize yourself with the following features that can be used to limit or elevate permissions:

- [Impersonation](https://docs.microsoft.com/dotnet/framework/data/adonet/sql/customizing-permissions-with-impersonation-in-sql-server) and [module-signing](https://docs.microsoft.com/dotnet/framework/data/adonet/sql/signing-stored-procedures-in-sql-server) can be used to securely elevate permissions temporarily.
- [Row-Level Security](https://docs.microsoft.com/sql/relational-databases/security/row-level-security) can be used limit which rows a user can access.
- [Data Masking](dynamic-data-masking-overview.md) can be used to limit exposure of sensitive data.
- [Stored procedures](https://docs.microsoft.com/sql/relational-databases/stored-procedures/stored-procedures-database-engine) can be used to limit the actions that can be taken on the database.

## Next steps

For an overview of all Azure SQL Database and SQL Managed Instance security features, see [Security overview](security-overview.md).
