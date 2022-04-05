---
title: Create and utilize Azure Active Directory server logins
description: This article guides you through creating and utilizing Azure Active Directory logins in the virtual master database of Azure SQL
ms.service: sql-db-mi
ms.subservice: security
ms.topic: tutorial
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto
ms.date: 03/14/2022
---

# Tutorial: Create and utilize Azure Active Directory server logins

[!INCLUDE[appliesto-sqldb-sqlmi-asa-dedicated-only](../includes/appliesto-sqldb-sqlmi-asa-dedicated-only.md)]

> [!NOTE]
> Azure Active Directory (Azure AD) server principals (logins) are currently in public preview for Azure SQL Database. Azure SQL Managed Instance can already utilize Azure AD logins.

This article guides you through creating and utilizing [Azure Active Directory (Azure AD) principals (logins)](authentication-azure-ad-logins.md) in the virtual master database of Azure SQL.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create an Azure AD login in the virtual master database with the new syntax extension for Azure SQL Database
> - Create a user mapped to an Azure AD login in the virtual master database
> - Grant server roles to an Azure AD user
> - Disable an Azure AD login

## Prerequisites

- A SQL Database or SQL Managed Instance with a database. See [Quickstart: Create an Azure SQL Database single database](single-database-create-quickstart.md) if you haven't already created an Azure SQL Database, or [Quickstart: Create an Azure SQL Managed Instance](../managed-instance/instance-create-quickstart.md).
- Azure AD authentication set up for SQL Database or Managed Instance. For more information, see [Configure and manage Azure AD authentication with Azure SQL](authentication-aad-configure.md).
- This article instructs you on creating an Azure AD login and user within the virtual master database. Only an Azure AD admin can create a user within the virtual master database, so we recommend you use the Azure AD admin account when going through this tutorial. An Azure AD principal with the `loginmanager` role can create a login, but not a user within the virtual master database.

## Create Azure AD login

1. Create an Azure SQL Database login for an Azure AD account. In our example, we'll use `bob@contoso.com` that exists in our Azure AD domain called `contoso`. A login can also be created from an Azure AD group or [service principal (applications)](authentication-aad-service-principal.md). For example, `mygroup` that is an Azure AD group consisting of Azure AD accounts that are a member of that group. For more information, see [CREATE LOGIN (Transact-SQL)](/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-current&preserve-view=true).

   > [!NOTE]
   > The first Azure AD login must be created by the Azure Active Directory admin. A SQL login cannot create Azure AD logins.

1. Using [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms), log into your SQL Database with the Azure AD admin account set up for the server.
1. Run the following query:

   ```sql
   Use master
   CREATE LOGIN [bob@contoso.com] FROM EXTERNAL PROVIDER
   GO
   ```

1. Check the created login in `sys.server_principals`. Execute the following query:

   ```sql
   SELECT name, type_desc, type, is_disabled 
   FROM sys.server_principals
   WHERE type_desc like 'external%'  
   ```

   You would see a similar output to the following:

   ```output
   Name                            type_desc       type   is_disabled 
   bob@contoso.com                 EXTERNAL_LOGIN  E      0 
   ```

1. The login `bob@contoso.com` has been created in the virtual master database.

## Create user from an Azure AD login

1. Now that we've created an Azure AD login, we can create a database-level Azure AD user that is mapped to the Azure AD login in the virtual master database. We'll continue to use our example, `bob@contoso.com` to create a user in the virtual master database, as we want to demonstrate adding the user to special roles. Only an Azure AD admin or SQL server admin can create users in the virtual master database.

1. We're using the virtual master database, but you can switch to a database of your choice if you want to create users in other databases. Run the following query.

   ```sql
   Use master
   CREATE USER [bob@contoso.com] FROM LOGIN [bob@contoso.com]
   ```

   > [!TIP]
   > Although it is not required to use Azure AD user aliases (for example, `bob@contoso.com`), it is a recommended best practice to use the same alias for Azure AD users and Azure AD logins. 

1. Check the created user in `sys.database_principals`. Execute the following query:

   ```sql
   SELECT name, type_desc, type 
   FROM sys.database_principals 
   WHERE type_desc like 'external%'
   ```

   You would see a similar output to the following:

   ```output
   Name                            type_desc       type
   bob@contoso.com                 EXTERNAL_USER   E
   ```

> [!NOTE]
> The existing syntax to create an Azure AD user without an Azure AD login is still supported, and requires the creation of a contained user inside SQL Database (without login).
>
> For example, `CREATE USER [bob@contoso.com] FROM EXTERNAL PROVIDER`.

## Grant server-level roles to Azure AD logins

You can add logins to the [built-in server-level roles](security-server-roles.md#built-in-server-level-roles), such as the **##MS_DefinitionReader##**, **##MS_ServerStateReader##**, or **##MS_ServerStateManager##** role.

> [!NOTE]
> The server-level roles mentioned here are not supported for Azure AD groups.

```sql
ALTER SERVER ROLE ##MS_DefinitionReader## ADD MEMBER [AzureAD_object];
```

```sql
ALTER SERVER ROLE ##MS_ServerStateReader## ADD MEMBER [AzureAD_object];
```

```sql
ALTER SERVER ROLE ##MS_ServerStateManager## ADD MEMBER [AzureAD_object];
```

Permissions aren't effective until the user reconnects. Flush the DBCC cache as well:

```sql
DBCC FLUSHAUTHCACHE
DBCC FREESYSTEMCACHE('TokenAndPermUserStore') WITH NO_INFOMSGS 
```

To check which Azure AD logins are part of server-level roles, run the following query:

```sql
SELECT roles.principal_id AS RolePID,roles.name AS RolePName,
       server_role_members.member_principal_id AS MemberPID, members.name AS MemberPName
       FROM sys.server_role_members AS server_role_members
       INNER JOIN sys.server_principals AS roles
       ON server_role_members.role_principal_id = roles.principal_id
       INNER JOIN sys.server_principals AS members 
       ON server_role_members.member_principal_id = members.principal_id;
```

## Grant special roles for Azure AD users

[Special roles for SQL Database](/sql/relational-databases/security/authentication-access/database-level-roles#special-roles-for--and-azure-synapse) can be assigned to users in the virtual master database.

In order to grant one of the special database roles to a user, the user must exist in the virtual master database. 

To add a user to a role, you can run the following query:

```sql
ALTER ROLE [dbamanger] ADD MEMBER [AzureAD_object] 
```

To remove a user from a role, run the following query:

```sql
ALTER ROLE [dbamanger] DROP MEMBER [AzureAD_object] 
```

`AzureAD_object` can be an Azure AD user, group, or service principal in Azure AD.

In our example, we created the user `bob@contoso.com`. Let's give the user the **dbmanager** and **loginmanager** roles.

1. Run the following query:

   ```sql
   ALTER ROLE [dbamanger] ADD MEMBER [bob@contoso.com] 
   ALTER ROLE [loginmanager] ADD MEMBER [bob@contoso.com] 
   ```

1. Check the database role assignment by running the following query:

   ```sql
   SELECT DP1.name AS DatabaseRoleName,    
     isnull (DP2.name, 'No members') AS DatabaseUserName    
   FROM sys.database_role_members AS DRM   
   RIGHT OUTER JOIN sys.database_principals AS DP1   
     ON DRM.role_principal_id = DP1.principal_id   
   LEFT OUTER JOIN sys.database_principals AS DP2   
     ON DRM.member_principal_id = DP2.principal_id   
   WHERE DP1.type = 'R'and DP2.name like 'bob%' 
   ```

   You would see a similar output to the following:

   ```output
   DatabaseRoleName	   DatabaseUserName 
   dbmanager              bob@contoso.com
   loginmanager	       bob@contoso.com
   ```

## Optional - Disable a login

The [ALTER LOGIN (Transact-SQL)](/sql/t-sql/statements/alter-login-transact-sql?view=azuresqldb-current&preserve-view=true) DDL syntax can be used to enable or disable an Azure AD login in Azure SQL Database.

```sql
ALTER LOGIN [bob@contoso.com] DISABLE
```

For the `DISABLE` or `ENABLE` changes to take immediate effect, the authentication cache and the **TokenAndPermUserStore** cache must be cleared using the following T-SQL commands:

```sql
DBCC FLUSHAUTHCACHE
DBCC FREESYSTEMCACHE('TokenAndPermUserStore') WITH NO_INFOMSGS 
```

Check that the login has been disabled by executing the following query:

```sql
SELECT name, type_desc, type 
FROM sys.server_principals 
WHERE is_disabled = 1
```

A use case for this would be to allow read-only on [geo-replicas](active-geo-replication-overview.md), but deny connection on a primary server.

## See also

For more information and examples, see:

- [Azure Active Directory server principals](authentication-azure-ad-logins.md)
- [CREATE LOGIN (Transact-SQL)](/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-current&preserve-view=true)
- [CREATE USER (Transact-SQL)](/sql/t-sql/statements/create-user-transact-sql)