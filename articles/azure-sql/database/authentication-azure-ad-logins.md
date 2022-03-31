---
title: Azure Active Directory server principals
description: Using Azure Active Directory server principals (logins) in Azure SQL
ms.service: sql-db-mi
ms.subservice: security
ms.topic: conceptual
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto
ms.date: 03/14/2022
---

# Azure Active Directory server principals

[!INCLUDE[appliesto-sqldb-sqlmi-asa-dedicated-only](../includes/appliesto-sqldb-sqlmi-asa-dedicated-only.md)]

> [!NOTE]
> Azure Active Directory (Azure AD) server principals (logins) are currently in public preview for Azure SQL Database. Azure SQL Managed Instance can already utilize Azure AD logins.

You can now create and utilize Azure AD server principals, which are logins in the virtual master database of a SQL Database. There are several benefits of using Azure AD server principals for SQL Database:

- Support [Azure SQL Database server roles for permission management](security-server-roles.md).
- Support multiple Azure AD users with [special roles for SQL Database](/sql/relational-databases/security/authentication-access/database-level-roles#special-roles-for--and-azure-synapse), such as the `loginmanager` and `dbmanager` roles.
- Functional parity between SQL logins and Azure AD logins.
- Increase functional improvement support, such as utilizing [Azure AD-only authentication](authentication-azure-ad-only-authentication.md). Azure AD-only authentication allows SQL authentication to be disabled, which includes the SQL server admin, SQL logins and users.
- Allows Azure AD principals to support geo-replicas. Azure AD principals will be able to connect to the geo-replica of a user database, with a *read-only* permission and *deny* permission to the primary server.
- Ability to use Azure AD service principal logins with special roles to execute a full automation of user and database creation, as well as maintenance provided by Azure AD applications.
- Closer functionality between Managed Instance and SQL Database, as Managed Instance already supports Azure AD logins in the master database.

For more information on Azure AD authentication in Azure SQL, see [Use Azure Active Directory authentication](authentication-aad-overview.md)

## Permissions

The following permissions are required to utilize or create Azure AD logins in the virtual master database.

- Azure AD admin permission or membership in the `loginmanager` server role. The first Azure AD login can only be created by the Azure AD admin.
- Must be a member of Azure AD within the same directory used for Azure SQL Database 

By default, the standard permission granted to newly created Azure AD login in the `master` database is **VIEW ANY DATABASE**. 

## Azure AD logins syntax

New syntax for Azure SQL Database to use Azure AD server principals has been introduced with this feature release.

### Create login syntax

```syntaxsql
CREATE LOGIN login_name { FROM EXTERNAL PROVIDER | WITH <option_list> [,..] }  

<option_list> ::=      
    PASSWORD = {'password'}   
    | , SID = sid, ] 
```

The *login_name* specifies the Azure AD principal, which is an Azure AD user, group, or application.

For more information, see [CREATE LOGIN (Transact-SQL)](/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-current&preserve-view=true).

### Create user syntax

The below T-SQL syntax is already available in SQL Database, and can be used for creating database-level Azure AD principals mapped to Azure AD logins in the virtual master database.

To create an Azure AD user from an Azure AD login, use the following syntax. Only the Azure AD admin can execute this command in the virtual master database.

```syntaxsql
CREATE USER user_name FROM LOGIN login_name
```

For more information, see [CREATE USER (Transact-SQL)](/sql/t-sql/statements/create-user-transact-sql).

### Disable or enable a login using ALTER LOGIN syntax

The [ALTER LOGIN (Transact-SQL)](/sql/t-sql/statements/alter-login-transact-sql?view=azuresqldb-current&preserve-view=true) DDL syntax can be used to enable or disable an Azure AD login in Azure SQL Database.

```syntaxsql
ALTER LOGIN login_name DISABLE 
```

The Azure AD principal `login_name` won't be able to log into any user database in the SQL Database logical server where an Azure AD user principal, `user_name` mapped to login `login_name` was created.

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

## Roles for Azure AD principals

[Special roles for SQL Database](/sql/relational-databases/security/authentication-access/database-level-roles#special-roles-for--and-azure-synapse) can be assigned to *users* in the virtual master database for Azure AD principals, including **dbmanager** and **loginmanager**. 

[Azure SQL Database server roles](security-server-roles.md) can be assigned to *logins* in the virtual master database.

For a tutorial on how to grant these roles, see [Tutorial: Create and utilize Azure Active Directory server logins](authentication-azure-ad-logins-tutorial.md).


## Limitations and remarks

- The SQL server admin can’t create Azure AD logins or users in any databases.
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
- When permissions are altered for an Azure AD login with existing open connections to an Azure SQL Database, permissions aren't effective until the user reconnects. Also [flush the authentication cache and the TokenAndPermUserStore cache](#disable-or-enable-a-login-using-alter-login-syntax). This applies to server role membership change using the [ALTER SERVER ROLE](/sql/t-sql/statements/alter-server-role-transact-sql) statement. 
- Setting an Azure AD login mapped to an Azure AD group as the database owner isn't supported.
- [Azure SQL Database server roles](security-server-roles.md) aren't supported for Azure AD groups.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Create and utilize Azure Active Directory server logins](authentication-azure-ad-logins-tutorial.md)