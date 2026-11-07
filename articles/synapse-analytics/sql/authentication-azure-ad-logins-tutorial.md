---
title: Create and Use Microsoft Entra Server Logins
titleSuffix: Azure Synapse Analytics
description: Create and use Microsoft Entra logins in the virtual master database of an Azure Synapse Analytics dedicated SQL pool.
author: VanMSFT
ms.author: vanto
ms.reviewer: mathoma
ms.date: 10/07/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: tutorial
---

# Tutorial: Create and use Microsoft Entra server logins

This article guides you through creating and using [logins](authentication-azure-ad-logins.md) backed by Microsoft Entra ID ([formerly Azure Active Directory](/entra/fundamentals/new-name)) within the virtual `master` database of an Azure Synapse Analytics dedicated SQL pool (formerly SQL DW). Dedicated SQL pools in Azure Synapse Analytics workspaces don't use logical SQL servers.

> [!NOTE]
> Microsoft Entra server principals are currently in preview for Azure Synapse Analytics.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create a Microsoft Entra login in the virtual `master` database
> - Create a user mapped to a Microsoft Entra login in the virtual `master` database
> - Use the `WITH OBJECT_ID` syntax for nonunique display names
> - Grant server roles to a Microsoft Entra user
> - Disable a Microsoft Entra login

## Prerequisites

- An Azure Synapse Analytics dedicated SQL pool and a database.
- Microsoft Entra authentication configured for Azure Synapse Analytics. For more information, see [Configure and manage Microsoft Entra authentication with Azure Synapse Analytics](authentication-aad-configure.md).
- This article instructs you on creating a Microsoft Entra login and user within the virtual `master` database. Only a Microsoft Entra admin can create a user within the virtual `master` database, so we recommend you use the Microsoft Entra admin account when going through this tutorial. A Microsoft Entra principal with the `loginmanager` role can create a login, but not a user within the virtual `master` database.

> [!NOTE]
> For organizations dealing with nonunique display names in Microsoft Entra ID (particularly for service principals), ensure you have the Object ID information available for any service principals you plan to create logins for. The `WITH OBJECT_ID` syntax extension can help resolve these scenarios.

<a id="create-azure-ad-login"></a>

## Create Microsoft Entra login

1. Create a login for a Microsoft Entra account. In this example, use `bob@contoso.com` which exists in the Microsoft Entra domain called `contoso`. You can also create a login from a Microsoft Entra group or [service principal (applications)](../synapse-service-identity.md). For more information, see [CREATE LOGIN (Transact-SQL)](/sql/t-sql/statements/create-login-transact-sql?view=azure-sqldw-latest&preserve-view=true).

   > [!NOTE]
   > The first Microsoft Entra login must be created by the Microsoft Entra admin. The Microsoft Entra admin can be a Microsoft Entra user or group. A SQL authentication login can't create Microsoft Entra logins.

   > [!TIP]
   > If you encounter issues with nonunique display names in Microsoft Entra ID, use the `WITH OBJECT_ID` syntax extension. This feature is particularly useful for service principals with duplicate display names. For example:
   >
   > ```sql
   > CREATE LOGIN [myapp4466e] FROM EXTERNAL PROVIDER
   >   WITH OBJECT_ID = 'aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb'
   > ```
   >
   > For more information, see [Name considerations](authentication-aad-configure.md#name-considerations).

1. Using [SQL Server Management Studio (SSMS)](/ssms/sql-server-management-studio-ssms), sign in to your dedicated SQL pool with the Microsoft Entra administrator account.
1. Expand **Databases** > **System Databases**. Right-click the `master` database and select **New Query** to open a new query window in the context of the `master` database.
1. Run the following query:

   ```sql
   CREATE LOGIN [bob@contoso.com] FROM EXTERNAL PROVIDER
   GO
   ```

1. Check the created login in `sys.server_principals`. Execute the following query:

   ```sql
   SELECT name, type_desc, type, is_disabled
   FROM sys.server_principals
   WHERE type_desc like 'external%'
   ```

   You see a similar output to the following:

   ```output
   Name                            type_desc       type   is_disabled
   bob@contoso.com                 EXTERNAL_LOGIN  E      0
   ```

1. The login `bob@contoso.com` is created in the virtual `master` database.

<a id="create-user-from-an-azure-ad-login"></a>

## Create user from a Microsoft Entra login

1. After you create a Microsoft Entra login, create a database-level Microsoft Entra user that maps to the Microsoft Entra login in the virtual `master` database. To show how to add the user to special roles, use our example, `bob@contoso.com`, to create a user in the virtual `master` database. Only a Microsoft Entra admin or SQL server admin can create users in the virtual `master` database.

1. Use the virtual `master` database, but you can reconnect to a database of your choice if you want to create users in other databases. Run the following query.

   ```sql
   CREATE USER [bob@contoso.com] FROM LOGIN [bob@contoso.com]
   ```

   > [!TIP]
   > Although it's not required to use Microsoft Entra user aliases (for example, `bob@contoso.com`), it is a recommended best practice to use the same alias for Microsoft Entra users and Microsoft Entra logins.
   >
   > If you need to create a user directly from an external provider with a specific Object ID (for example, to resolve nonunique display name issues), use the following syntax:
   >
   > ```sql
   > CREATE USER [user_name] FROM EXTERNAL PROVIDER
   >   WITH OBJECT_ID = 'objectid'
   > ```

1. Check the created user in `sys.database_principals`. Execute the following query:

   ```sql
   SELECT name, type_desc, type
   FROM sys.database_principals
   WHERE type_desc like 'external%'
   ```

   You see a similar output to the following:

   ```output
   Name                            type_desc       type
   bob@contoso.com                 EXTERNAL_USER   E
   ```

> [!NOTE]
> The existing syntax to create a Microsoft Entra user without a Microsoft Entra login is still supported. If you run the following syntax, you create a database contained user in the specific database you're connected to. This user isn't associated to any login, even if a login of the same name exists in the virtual `master` database.
>
> For example, `CREATE USER [bob@contoso.com] FROM EXTERNAL PROVIDER`.
>
> You can create a Microsoft Entra login by using a service principal with a nonunique display name. For more information, see [Name considerations](authentication-aad-configure.md#name-considerations).

<a id="grant-server-level-roles-to-azure-ad-logins"></a>

## Grant server-level roles to Microsoft Entra logins

You can add logins to fixed server-level roles, such as the **##MS_DefinitionReader##**, **##MS_ServerStateReader##**, or **##MS_ServerStateManager##** role in the `master` database.

> [!NOTE]
> The server-level roles mentioned here aren't supported for Microsoft Entra groups.

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

To check which Microsoft Entra logins are part of server-level roles, run the following query:

```sql
SELECT roles.principal_id AS RolePID,roles.name AS RolePName,
       server_role_members.member_principal_id AS MemberPID, members.name AS MemberPName
       FROM sys.server_role_members AS server_role_members
       INNER JOIN sys.server_principals AS roles
       ON server_role_members.role_principal_id = roles.principal_id
       INNER JOIN sys.server_principals AS members
       ON server_role_members.member_principal_id = members.principal_id;
```

<a id="grant-special-roles-for-azure-ad-users"></a>

## Grant special roles for Microsoft Entra users

You can assign [special roles for Azure Synapse Analytics](/sql/relational-databases/security/authentication-access/database-level-roles#special-roles-for--and-azure-synapse) to users in the virtual `master` database.

To grant one of the special database roles to a user, the user must exist in the virtual `master` database.

To add a user to a role, run the following query:

```sql
ALTER ROLE [dbmanager] ADD MEMBER [AzureAD_object]
```

To remove a user from a role, run the following query:

```sql
ALTER ROLE [dbmanager] DROP MEMBER [AzureAD_object]
```

`AzureAD_object` can be a Microsoft Entra user, group, or service principal in Microsoft Entra ID.

In the following example, you create the user `bob@contoso.com`. Assign the **dbmanager** and **loginmanager** roles to the user.

1. Run the following query:

   ```sql
   ALTER ROLE [dbmanager] ADD MEMBER [bob@contoso.com]
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

   You see a similar output to the following:

   ```output
   DatabaseRoleName       DatabaseUserName
   dbmanager              bob@contoso.com
   loginmanager           bob@contoso.com
   ```

## Optional - Disable a login

Use the [ALTER LOGIN (Transact-SQL)](/sql/t-sql/statements/alter-login-transact-sql?view=azure-sqldw-latest&preserve-view=true) DDL syntax to enable or disable a Microsoft Entra login in a dedicated SQL pool.

```sql
ALTER LOGIN [bob@contoso.com] DISABLE
```

To make `DISABLE` or `ENABLE` changes take effect immediately, clear the authentication cache and the `TokenAndPermUserStore` cache by using the following T-SQL commands:

```sql
DBCC FLUSHAUTHCACHE
DBCC FREESYSTEMCACHE('TokenAndPermUserStore') WITH NO_INFOMSGS
```

Check that the login is disabled by running the following query:

```sql
SELECT name, type_desc, type
FROM sys.server_principals
WHERE is_disabled = 1
```

## Related content

- [Microsoft Entra server principals](authentication-azure-ad-logins.md)
- [Name considerations for Microsoft Entra principals](authentication-aad-configure.md#name-considerations)
- [CREATE LOGIN (Transact-SQL)](/sql/t-sql/statements/create-login-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [CREATE USER (Transact-SQL)](/sql/t-sql/statements/create-user-transact-sql)
