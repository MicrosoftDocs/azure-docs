---
title: Microsoft Entra server principals
titleSuffix: Azure Synapse Analytics
description: Learn how to use Microsoft Entra server principals (logins) in Azure Synapse Analytics dedicated SQL pools.
author: VanMSFT
ms.author: vanto
ms.reviewer: vanto
ms.date: 10/07/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: concept-article
---

# Microsoft Entra server principals

You can create and use server principals from Microsoft Entra ID ([formerly Azure Active Directory](/entra/fundamentals/new-name)) as logins in the virtual `master` database of an Azure Synapse Analytics dedicated SQL pool. 

> [!NOTE]
> Microsoft Entra server principals are currently in preview for Azure Synapse Analytics.

There are several benefits of using Microsoft Entra server principals with a dedicated SQL pool:

- Support [server roles for permission management](authentication-azure-ad-logins-tutorial.md#grant-server-level-roles-to-microsoft-entra-logins).
- Support multiple Microsoft Entra users with [special roles for Azure Synapse Analytics](/sql/relational-databases/security/authentication-access/database-level-roles#special-roles-for--and-azure-synapse), such as the `loginmanager` and `dbmanager` roles.
- Functional parity between SQL logins and Microsoft Entra logins.
- Increase functional improvement support, such as by using [Microsoft Entra-only authentication](authentication-azure-ad-only-authentication.md). Microsoft Entra-only authentication allows you to disable SQL authentication, which includes the SQL server admin, SQL logins, and users.
- Use Microsoft Entra service principal logins with special roles to fully automate user and database creation and maintenance with Microsoft Entra applications.

For more information, see [Microsoft Entra authentication for Azure Synapse Analytics](authentication-aad-overview.md).

## Permissions

To use or create Microsoft Entra logins in the virtual `master` database, you need the following permissions:

- Microsoft Entra admin permission or membership in the `loginmanager` server role. Only the Microsoft Entra admin can create the first Microsoft Entra login.
- Must be a member of Microsoft Entra ID within the same directory used by Azure Synapse Analytics.

By default, newly created Microsoft Entra logins in the `master` database are granted the **VIEW ANY DATABASE** permission.

<a name='azure-ad-logins-syntax'></a>

## Microsoft Entra principals syntax

Use the following syntax to create and manage Microsoft Entra server and database principals.

### Create login

This syntax creates a server-level login based on a Microsoft Entra identity. Only the Microsoft Entra admin can run this command in the virtual `master` database.

```syntaxsql
CREATE LOGIN login_name
  { 
    FROM EXTERNAL PROVIDER [WITH OBJECT_ID = 'objectid'] 
    | WITH <option_list> [,..] 
  }

<option_list> ::=
    PASSWORD = { 'password' }
    [ , SID = sid ]
```

The *login_name* specifies the Microsoft Entra principal, which is a Microsoft Entra user, group, or application.

For more information, see [CREATE LOGIN (Transact-SQL)](/sql/t-sql/statements/create-login-transact-sql?view=azure-sqldw-latest&preserve-view=true).

### Create user from login

The following T-SQL syntax creates a database-level Microsoft Entra principal mapped to a Microsoft Entra login in the virtual `master` database. Similar to the syntax for creating a database contained Microsoft Entra user, the only difference is specifying `FROM LOGIN [login_name]` rather than `FROM EXTERNAL PROVIDER`.

To create a Microsoft Entra user from a Microsoft Entra login, use the following syntax.

```syntaxsql
CREATE USER [user_name] FROM LOGIN [login_name]
```

You can use the `SID` column from **sys.database_principals** to distinguish between a Microsoft Entra contained database user and a Microsoft Entra user created from a login. For a contained database user, the `SID` is a binary string of length 16. For a login-based user, the `SID` is of length 18 with an `AADE` suffix.

> [!NOTE]
> Appending the `AADE` suffix to the SID is how you identify a Microsoft Entra user as being created from a login. However, this also means that the SIDs for the login and its users don't match between `sys.server_principals` and `sys.database_principals`. To correlate the user back to its login, you must first remove the `AADE` suffix.

To understand the conceptual difference between login-based users and contained database users, see [contained database users](/sql/relational-databases/security/contained-database-users-making-your-database-portable).

For more information on all create user syntax, see [CREATE USER (Transact-SQL)](/sql/t-sql/statements/create-user-transact-sql).

<a id="disable-or-enable-a-login-using-alter-login"></a>

### Disable or enable a login by using ALTER LOGIN

Use the [ALTER LOGIN (Transact-SQL)](/sql/t-sql/statements/alter-login-transact-sql?view=azure-sqldw-latest&preserve-view=true) DDL syntax to enable or disable a Microsoft Entra login in an Azure Synapse Analytics dedicated SQL pool.

```syntaxsql
ALTER LOGIN [login_name] DISABLE
```

When you disable a login, the server principal can't connect anymore. Disabling a login also prevents all database principals (users) that you created from that login from connecting to their respective databases.

> [!NOTE]
> - `ALTER LOGIN login_name DISABLE` can't affect *contained* database users, because they aren't associated with logins.
> - `ALTER LOGIN login_name DISABLE` isn't supported for Microsoft Entra groups.
> - An individual disabled login can't belong to a user who is part of a login group that you created in the `master` database (for example, a Microsoft Entra admin group).
> - To make the `DISABLE` or `ENABLE` changes take effect immediately, clear the authentication cache and the `TokenAndPermUserStore` cache by using the following T-SQL commands:
>
>   ```sql
>   DBCC FLUSHAUTHCACHE
>   DBCC FREESYSTEMCACHE('TokenAndPermUserStore') WITH NO_INFOMSGS
>   ```

<a name='roles-for-azure-ad-principals'></a>


## Limitations and remarks

- The SQL server admin can't create Microsoft Entra logins or users in any databases.
- Dedicated SQL pools in Azure Synapse Analytics workspaces don't use logical SQL servers.
- A SQL admin or SQL user can't execute the following Microsoft Entra operations:
  - `CREATE LOGIN [bob@contoso.com] FROM EXTERNAL PROVIDER`
  - `CREATE USER [bob@contoso.com] FROM EXTERNAL PROVIDER`
  - `EXECUTE AS USER [bob@contoso.com]`
  - `ALTER AUTHORIZATION ON securable::name TO [bob@contoso.com]`
- Impersonation of Microsoft Entra server principals (logins) isn't supported for Azure Synapse Analytics:
  - [EXECUTE AS Clause (Transact-SQL)](/sql/t-sql/statements/execute-as-clause-transact-sql)
  - [EXECUTE AS (Transact-SQL)](/sql/t-sql/statements/execute-as-transact-sql)
  - Impersonation of Microsoft Entra database principals (users) in a user database is supported.
- Microsoft Entra logins can't overlap with the Microsoft Entra administrator. The Microsoft Entra admin takes precedence over any login. If a Microsoft Entra account already has access to the server as a Microsoft Entra admin, individually or as part of a group, any login created for this account won't have any effect. However, the login creation isn't blocked through T-SQL. After the account authenticates to the server, the login has the effective permissions of a Microsoft Entra admin, and not of a newly created login.
- Changing permissions on a specific Microsoft Entra login object isn't supported:
  - `GRANT <PERMISSION> ON LOGIN :: <Microsoft Entra account> TO <Any other login>`
- When you alter permissions for a Microsoft Entra login, by default the changes only take effect the next time the login connects to the dedicated SQL pool. Any existing open connections with the login aren't affected. To force permissions changes to take immediate effect, you can manually clear the authentication and TokenAndPermUserStore, as described earlier in [disable or enable a login using ALTER LOGIN](#disable-or-enable-a-login-using-alter-login). This behavior also applies when making server role membership changes with [ALTER SERVER ROLE](/sql/t-sql/statements/alter-server-role-transact-sql).
- In SQL Server Management Studio, the scripting command to create a user doesn't check if there's already a Microsoft Entra login in `master` with the same name. It always generates the T-SQL for a contained database Microsoft Entra user.
- An error might occur if you're trying to create a login or user from a service principal with a nonunique display name. For more information about mitigating this error, see [Name considerations](authentication-aad-configure.md#name-considerations).
- Database users created by using Microsoft Entra logins can experience delays when being granted roles and permissions. If you encounter this issue, use the following commands:
  - [Drop the user](/sql/t-sql/statements/drop-user-transact-sql) from the user database.
  - Execute `DBCC FREESYSTEMCACHE('TokenAndPermUserStore')` to clear security caches on the database.
  - Execute `DBCC FLUSHAUTHCACHE` to clear the federated authentication context cache.
  - [Create the user](authentication-azure-ad-logins.md#create-user-from-login) based on the login.
### Microsoft Entra group server principal limitations

The following limitations apply to Microsoft Entra group logins in Azure Synapse Analytics:

- Server roles aren't supported for Microsoft Entra groups.
- If your SQL admin is a Microsoft Entra group, users of that group encounter some limitations when they connect. Each Microsoft Entra user isn't individually listed in the `sys.server_principals` table. This limitation has various consequences, including calls to `SUSER_SID` returning `NULL`.
- Microsoft Entra user logins that are part of Microsoft Entra group logins aren't created implicitly. These users don't have a default schema and can't perform operations like `CREATE SCHEMA` until you create a login for the Microsoft Entra user or assign a default schema to the group.
- You can't change a database's ownership to a Microsoft Entra group as database owner.
  - `ALTER AUTHORIZATION ON database::<mydb> TO [my_aad_group]` fails with an error message:

    ```output
    Msg 33181, Level 16, State 1, Line 4
    The new owner cannot be Azure Active Directory group.
    ```

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Create and use Microsoft Entra server logins](authentication-azure-ad-logins-tutorial.md)
