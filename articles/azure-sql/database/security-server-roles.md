---
title: Server roles
titleSuffix: Azure SQL Database
description: This article provides an overview of server roles for the logical server of Azure SQL Database
ms.service: sql-database
ms.subservice: security
author: AndreasWolter
ms.author: anwolter
ms.topic: conceptual
ms.date: 09/02/2021
ms.reviewer: "vanto"
---

# Azure SQL Database server roles for permission management

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

In Azure SQL Database, the server is a logical concept and permissions cannot be granted on a server level. To simplify permission management, Azure SQL Database provides a set of fixed server-level roles to help you manage the permissions on a [logical server](logical-servers.md). Roles are security principals that group logins.

> [!NOTE]
> The *roles* concept in this article are like *groups* in the Windows operating system.

These special fixed server-level roles use the prefix **##MS_** and the suffix **##** to distinguish from other regular user-created principals.

Like SQL Server on-premise, server permissions are organized hierarchically. The permissions that are held by these server-level roles can propagate to database permissions. For the permissions to be effectively propagated to the database, a login needs to have a user account in the database.

For example, the server-level role **##MS_ServerStateReader##** holds the permission **VIEW SERVER STATE**. If a login who is member of this role has a user account in the databases *master* and *WideWorldImporters*, this user will have the permission, **VIEW DATABASE STATE** in those two databases. 

> [!NOTE]
> Any permission can be denied within user databases, in effect, overriding the server-wide grant via role membership. However, in the system database *master*, permissions cannot be granted or denied.

Azure SQL Database currently provides three fixed server roles. The permissions that are granted to the fixed server roles cannot be changed and these roles can't have other fixed roles as members. You can add server-level SQL logins as members to server-level roles.

> [!IMPORTANT]
> Each member of a fixed server role can add other logins to that same role.

For more information on Azure SQL Database logins and users, see [Authorize database access to SQL Database, SQL Managed Instance, and Azure Synapse Analytics](logins-create-manage.md).
  
## Built-in server-level roles

The following table shows the fixed server-level roles and their capabilities.  
  
|Built-in server-level role|Description|  
|------------------------------|-----------------|  
|**##MS_DefinitionReader##**|Members of the **##MS_DefinitionReader##** fixed server role can read all catalog views that are covered by **VIEW ANY DEFINITION**, respectively **VIEW DEFINITION** on any database on which the member of this role has a user account.|  
|**##MS_ServerStateReader##**|Members of the **##MS_ServerStateReader##** fixed server role can read all dynamic management views (DMVs) and functions that are covered by **VIEW SERVER STATE**, respectively **VIEW DATABASE STATE** on any database on which the member of this role has a user account.|
|**##MS_ServerStateManager##**|Members of the **##MS_ServerStateManager##** fixed server role have the same permissions as the **##MS_ServerStateReader##** role. Also, it holds the **ALTER SERVER STATE** permission, which allows access to several management operations, such as: `DBCC FREEPROCCACHE`, `DBCC FREESYSTEMCACHE ('ALL')`, `DBCC SQLPERF()`; |  


## Permissions of fixed server roles

Each built-in server-level role has certain permissions assigned to it. The following table shows the permissions assigned to the server-level roles. It also shows the database-level permissions inherited if a user account exist in the database.
  
|Fixed server-level role|Server-level permissions|Database-level permissions (if database user exist)  
|-------------|----------|-----------------|  
|**##MS_DefinitionReader##**|VIEW ANY DATABASE, VIEW ANY DEFINITION, VIEW ANY SECURITY DEFINITION|VIEW DEFINITION, VIEW SECURITY DEFINITION|  
|**##MS_ServerStateReader##**|VIEW SERVER STATE, VIEW SERVER PERFORMANCE STATE, VIEW SERVER SECURITY STATE|VIEW DATABASE STATE, VIEW DATABASE PERFORMANCE STATE, VIEW DATABASE SECURITY STATE|  
|**##MS_ServerStateManager##**|ALTER SERVER STATE, VIEW SERVER STATE, VIEW SERVER PERFORMANCE STATE, VIEW SERVER SECURITY STATE|VIEW DATABASE STATE, VIEW DATABASE PERFORMANCE STATE, VIEW DATABASE SECURITY STATE|   
  
  
## Working with server-level roles

The following table explains the system views, and functions that you can use to work with server-level roles in Azure SQL Database.  
  
|Feature|Type|Description|  
|-------------|----------|-----------------|  
|[IS_SRVROLEMEMBER &#40;Transact-SQL&#41;](/sql/t-sql/functions/is-srvrolemember-transact-sql)|Metadata|Indicates whether a SQL login is a member of the specified server-level role.|  
|[sys.server_role_members &#40;Transact-SQL&#41;](/sql/relational-databases/system-catalog-views/sys-server-role-members-transact-sql)|Metadata|Returns one row for each member of each server-level role.|
|[sys.sql_logins &#40;Transact-SQL&#41;](/sql/relational-databases/system-catalog-views/sys-sql-logins-transact-sql)|Metadata|Returns one row for each SQL login.|
|[ALTER SERVER ROLE &#40;Transact-SQL&#41;](/sql/t-sql/statements/alter-server-role-transact-sql)|Command|Changes the membership of a server role.| 

## <a name="_examples"></a> Examples

The examples in this section show how to work with server-level roles in Azure SQL Database.  

### A. Adding a SQL login to a server-level role

The following example adds the SQL login 'Jiao' to the server-level role ##MS_ServerStateReader##.  
  
```sql  
ALTER SERVER ROLE ##MS_ServerStateReader##
	ADD MEMBER Jiao;  
GO
```  

### B. Listing all principals (SQL authentication) which are members of a server-level role

The following statement returns all members of any fixed server-level role using the `sys.server_role_members` and `sys.sql_logins` catalog views.  
  
```sql  
SELECT
		sql_logins.principal_id			AS MemberPrincipalID
	,	sql_logins.name					AS MemberPrincipalName
	,	roles.principal_id				AS RolePrincipalID
	,	roles.name						AS RolePrincipalName
FROM sys.server_role_members AS server_role_members
INNER JOIN sys.server_principals AS roles
    ON server_role_members.role_principal_id = roles.principal_id
INNER JOIN sys.sql_logins AS sql_logins 
    ON server_role_members.member_principal_id = sql_logins.principal_id
;  
GO  
```  

## Limitations of server-level roles

- Role assignments may take up to 5 minutes to become effective. Also for existing sessions, changes to server role assignments don't take effect until the connection is closed and reopened. This is due to the distributed architecture between the *master* database and other databases on the same logical server.
  - Partial workaround: to reduce the waiting period and ensure that server role assignments are current in a database, a server administrator, or an Azure AD administrator can run `DBCC FLUSHAUTHCACHE` in the user database(s) on which the login has access. Current logged on users still have to reconnect after running `DBCC FLUSHAUTHCACHE` for the membership changes to take effect on them.

- Server-level roles in Azure SQL Database can be assigned to SQL logins only. Azure AD logins aren't supported.

- `IS_SRVROLEMEMBER()` isn't supported in the *master* database.


## See also

- [Database-Level Roles](/sql/relational-databases/security/authentication-access/database-level-roles)   
- [Security Catalog Views &#40;Transact-SQL&#41;](/sql/relational-databases/system-catalog-views/security-catalog-views-transact-sql)   
- [Security Functions &#40;Transact-SQL&#41;](/sql/t-sql/functions/security-functions-transact-sql)   
- [Permissions &#40;Database Engine&#41;](/sql/relational-databases/security/permissions-database-engine)
- [DBCC FLUSHAUTHCACHE (Transact-SQL)](/sql/t-sql/database-console-commands/dbcc-flushauthcache-transact-sql)
