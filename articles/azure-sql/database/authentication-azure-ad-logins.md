---
title: Azure Active Directory server principals
description: Using Azure Active Directory server principals (logins) in Azure SQL
ms.service: sql-db-mi
ms.subservice: security
ms.topic: conceptual
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto
ms.date: 03/11/2022
---

# Azure Active Directory server principals

[!INCLUDE[appliesto-sqldb-sqlmi-asa-dedicated-only](../includes/appliesto-sqldb-sqlmi-asa-dedicated-only.md)]

> [!NOTE]
> Azure Active Directory (Azure AD) server principals (logins) are currently in public preview for Azure SQL Database. Azure SQL Managed Instance can already utilize Azure AD logins.

You can now create and utilize Azure AD server principals, which are logins in the master database of a SQL Database. There are several benefits of using Azure AD server principals for SQL Database:

- Support multiple Azure AD login accounts with high privileged server roles for SQL Database, such as the `loginmanager` and `dbmanager` roles.
- Increase functional improvement support, such as utilizing [Azure AD-only authentication](authentication-azure-ad-only-authentication.md). Azure AD-only authentication allows SQL authentication to be disabled, which includes the SQL server admin, SQL logins, and users.
- Allows Azure AD principals to support geo-replicas. Azure AD principals will be able to connect to the geo-replica of a user database, with a *read-only* permission and *deny* permission to the primary server.
- Ability to use Azure AD service principal logins with high privilege server roles to execute a full automation of user and database creation, as well as maintenance provided by Azure AD applications.
- Closer functionality between Managed Instance and SQL Database, as Managed Instance already supports Azure AD logins in the master database.

For more information on Azure AD authentication in Azure SQL, see [Use Azure Active Directory authentication](authentication-aad-overview.md)

## Permissions

The following permissions are required to utilize or create Azure AD logins in the master database.

- Azure AD admin permission or membership in the `loginmanager` server role.  
- Must be a member of Azure AD within the same directory used for Azure SQL Database 

By default, the standard permission granted to newly created Azure AD login in the `master` database is **VIEW ANY DATABASE**. 

## Azure AD logins syntax

New syntax for Azure SQL Database to use Azure AD server principals has been introduced with this feature release.

### Create login syntax

```syntaxsql
CREATE LOGIN login_name { FROM EXTERNAL PROVIDER [WITH OBJECT_ID = 'objectid'] | WITH <option_list> [,..] }  

<option_list> ::=      
    PASSWORD = {'password'}   
    | , SID = sid, ] 
```

For more information, see [CREATE LOGIN (Transact-SQL)](/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-current&preserve-view=true).

### Create user syntax

The below T-SQL syntax is already available in SQL Database, and can be used for creating database-level Azure AD principals mapped to Azure AD logins in the master database. 

To create an Azure AD user from an Azure AD login, use the following syntax:

```syntaxsql
CREATE USER user_name FROM LOGIN login_name
```

For more information, see [CREATE USER (Transact-SQL)](/sql/t-sql/statements/create-user-transact-sql).

### Disable or enable a login using ALTER LOGIN syntax

The [ALTER LOGIN (Transact-SQL)](/sql/t-sql/statements/alter-login-transact-sql?view=azuresqldb-current&preserve-view=true) DDL syntax can be used to enable or disable an Azure AD login in Azure SQL Database.

```syntaxsql
ALTER LOGIN login_name DISABLE 
```

The Azure AD principal `login_name` won't be able to log into any user database in the SQL Database server where an Azure AD user principal, `user_name` mapped to login `login_name` was created.

> [!NOTE]
> - `ALTER LOGIN login_name DISABLE` is not supported for contained users.
> - `ALTER LOGIN login_name DISABLE` is not supported for Azure AD groups.
> - An individual disabled login cannot belong to a user who is part of a login group created in the master database (for example, an Azure AD admin group). 
> - For the `DISABLE` or `ENABLE` changes to take immediate effect, the authentication cache and the **TokenAndPermUserStore** cache must be cleared using the T-SQL commands.
>
>   ```sql
>   DBCC FLUSHAUTHCACHE
>   DBCC FREESYSTEMCACHE('TokenAndPermUserStore') WITH NO_INFOMSGS 
>   ```

## Server-level roles for Azure AD principals

[Special roles for SQL Database](/sql/relational-databases/security/authentication-access/database-level-roles#special-roles-for--and-azure-synapse) can be assigned to users in the virtual master database for Azure AD principals, including **dbmanager** and **loginmanager**. For more server roles, see [Azure SQL Database server roles for permission management](security-server-roles.md).

For a tutorial on how to grant these roles to a user, see [Tutorial: Create and utilize Azure Active Directory server logins](authentication-azure-ad-logins-tutorial.md).

## Azure AD logins and users with non-unique display names

It's possible to create Azure AD resources with the same display names. For example, creating an [Azure AD application (service principal)](authentication-aad-service-principal.md) with the same name. In this release, we're also introducing the ability to create logins and users using the **Object ID**. 

```sql
CREATE LOGIN login_name FROM EXTERNAL PROVIDER WITH OBJECT_ID = 'objectid'
```

- To execute the above query, the specified Object ID must exist in Azure AD where the Azure SQL resides.
- Most non-unique display names in Azure AD are related to service principals. Group names can also be non-unique as well. All Azure AD user display names are unique. 

Using the display name of a service principal that isn't unique in Azure AD could lead to errors when creating the login or user in Azure SQL. For example, if `myapp` isn't unique, you may run into the following error when executing the following query:

```sql
CREATE LOGIN [myapp] FROM EXTERNAL PROVIDER 
```

```output
Msg 33131, Level 16, State 1, Line 4 
Principal 'myapp' has a duplicate display name. Make the display name unique in Azure Active Directory and execute this statement again. 
```

With the T-SQL DDL extension to create logins or users with the Object ID, you can avoid this error and also specify an alias for the login or user created with the Object ID. For example, the following will create a login `myapp4466e` using the application Object ID `4466e2f8-0fea-4c61-a470-xxxxxxxxxxxx`.

```sql
CREATE LOGIN [myapp4466e] FROM EXTERNAL PROVIDER 
  WITH OBJECT_ID='4466e2f8-0fea-4c61-a470-xxxxxxxxxxxx' 
```

For more information on obtaining the Object ID of a service principal, see [Service principal object](/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object.)

To get the Object ID of the application, you can execute the following query:

```sql
SELECT CAST(sid as uniqueidentifier) ApplicationID from sys.server_principals WHERE NAME = 'myapp4466e'
```

## Limitations and remarks

- The SQL server admin can’t create Azure AD logins in the master database
- Changing a database ownership to an Azure AD group as database owner isn't supported.
  - `ALTER AUTHORIZATION ON database::<mydb> TO [my_aad_group]` fails with an error message:
    ```output
    Msg 33181, Level 16, State 1, Line 4
    The new owner cannot be Azure Active Directory group.
    ```
  - Changing a database ownership to an individual user is supported.
- A SQL admin or SQL user can’t execute the following Azure AD operations: 
  - `CREATE LOGIN [bob@contoso.com] FROM EXTERNAL PROVIDER` 
  - `CREATE USER [bob@contoso.com] FROM EXTERNAL PROVIDER` 
  - `EXECUTE AS USER [bob@contoso.com]`
  - `ALTER AUTHORIZATION ON securable::name TO [bob@contoso.com]`
- Impersonation of Azure AD server-level principals (logins) isn't supported: 
  - [EXECUTE AS Clause (Transact-SQL)](/sql/t-sql/statements/execute-as-clause-transact-sql)
  - [EXECUTE AS (Transact-SQL)](/sql/t-sql/statements/execute-as-transact-sql)
  - Impersonation of Azure AD database-level principals (users) at a user database-level is still supported.
- Azure AD logins overlapping with Azure AD administrator aren't supported. Azure AD admin takes precedence over any login. If an Azure AD account already has access to the server as an Azure AD admin, either directly or as a member of the admin group, the login created for this user won't have any effect. The login creation isn't blocked through T-SQL. After the account authenticates to the server, the login will have the effective permissions of an Azure AD admin, and not of a newly created login.
- Changing permissions on specific Azure AD login object isn't supported:
  - `GRANT <PERMISSION> ON LOGIN :: <Azure AD account> TO <Any other login> `
- When permissions are altered for an Azure AD login with existing open connections to an Azure SQL Database, permissions aren't effective until the user reconnects. This applies to server role membership change using the [ALTER SERVER ROLE](/sql/t-sql/statements/alter-server-role-transact-sql) statement. 
- [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms) doesn't display the login names in **Object Explorer**.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Create and utilize Azure Active Directory server logins](authentication-azure-ad-logins-tutorial.md)