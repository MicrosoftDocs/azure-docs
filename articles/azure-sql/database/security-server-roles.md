---
title: Server roles
titleSuffix: Azure SQL Database
description: This article provides an overview of server roles for Azure SQL Database
ms.service: sql-db-mi
ms.subservice: security
ms.custom: sqldbrb=2
author: AndreasWolter
ms.author: anwolter
ms.topic: article
ms.date: 09/01/2021
ms.reviewer: ""
---

# Server roles for permission-management on logical server scope

In Azure SQL Database, the server is a logical concept and permissions cannot be granted on a server-level.
To simplify permission-management Azure SQL Database provides a set of fixed server-level roles to help you manage the permissions on a logical server. Roles are security principals that group Logins. (*Roles* are like *groups* in the Windows operating system.)

These special fixed server-level roles use the prefix **##MS_** and the suffix **##** to distinguish from other regular user-created principals.

Since in SQL Server permissions are organized hierarchically, the permissions that are held by these server-roles can propagate to database-permissions. To have effect, a Login needs to have a User-account in a database.</br>
For example, the server-role **##MS_ServerStateReader##** holds the permission **VIEW SERVER STATE**. If a Login who is member of this role has a User-account in the databases *master* and *WideWorldImporters*, this user will have the permission **VIEW DATABASE STATE** in those two databases. 

> [!NOTE]
Any permission can be denied within user-databases, in effect overriding the server-wide grant via role-membership. However, in the system database *master*, permissions cannot be granted or denied.

Azure SQL Database currently provides three fixed server roles. The permissions that are granted to the fixed server roles cannot be changed and these roles cannot have other fixed roles as members.
You can add server-level SQL Logins as members to server-level roles.

> [!IMPORTANT]
>  Each member of a fixed server role can add other logins to that same role.
  
## Built-in Server-Level Roles  
 The following table shows the fixed server-level roles and their capabilities.  
  
|Built-in server-level role|Description|  
|------------------------------|-----------------|  
|**##MS_DefinitionReader##**|Members of the **##MS_DefinitionReader##** fixed server role can read all catalogue views that are covered by **VIEW ANY DEFINITION**, respectively **VIEW DEFINITION** on any database on which the member of this role has a User-account.|  
|**##MS_ServerStateReader##**|Members of the **##MS_ServerStateReader##** fixed server role can read all dynamic management views (DMVs) and functions that are covered by **VIEW SERVER STATE**, respectively **VIEW DATABASE STATE** on any database on which the member of this role has a User-account.|
|**##MS_ServerStateManager##**|Members of the **##MS_ServerStateManager##** fixed server has the same permissions as the **##MS_ServerStateReader##** role. In addition to that it holds the **ALTER SERVER STATE**-permission which allows access to several management operations, such as: `DBCC FREEPROCCACHE`, `DBCC FREESYSTEMCACHE ('ALL')`, `DBCC SQLPERF()`; |  


## Permissions of Fixed Server Roles  
 Each built-in server level role has certain permissions assigned to it. The following table shows the permissions assigned to the server roles.   
  
|fixed server-role|Server-level permissions|Database-level permissions (if Database-User present)  
|-------------|----------|-----------------|  
|**##MS_DefinitionReader##**|VIEW ANY DATABASE, VIEW ANY DEFINITION, VIEW ANY SECURITY DEFINITION|VIEW DEFINITION, VIEW SECURITY DEFINITION|  
|**##MS_ServerStateReader##**|VIEW SERVER STATE, VIEW SERVER PERFORMANCE STATE, VIEW SERVER SECURITY STATE|VIEW DATABASE STATE, VIEW DATABASE PERFORMANCE STATE, VIEW DATABASE SECURITY STATE|  
|**##MS_ServerStateManager##**|ALTER SERVER STATE, VIEW SERVER STATE, VIEW SERVER PERFORMANCE STATE, VIEW SERVER SECURITY STATE|VIEW DATABASE STATE, VIEW DATABASE PERFORMANCE STATE, VIEW DATABASE SECURITY STATE|   
  
  
## Working with Server-Level Roles  
 The following table explains the system views, and functions that you can use to work with server-level roles in Azure SQL Database.  
  
|Feature|Type|Description|  
|-------------|----------|-----------------|  
|[IS_SRVROLEMEMBER &#40;Transact-SQL&#41;](../../../t-sql/functions/is-srvrolemember-transact-sql.md)|Metadata|Indicates whether a [!INCLUDE[ssNoVersion](../../../includes/ssnoversion-md.md)] login is a member of the specified server-level role.|  
|[sys.server_role_members &#40;Transact-SQL&#41;](../../../relational-databases/system-catalog-views/sys-server-role-members-transact-sql.md)|Metadata|Returns one row for each member of each server-level role.|
|[sys.sql_logins &#40;Transact-SQL&#41;](../../../relational-databases/system-catalog-views/sys-sql-logins-transact-sql.md)|Metadata|Returns one row for each SQL login.|
|[ALTER SERVER ROLE &#40;Transact-SQL&#41;](../../../t-sql/statements/alter-server-role-transact-sql.md)|Command|Changes the membership of a server role.|  
|[IS_SRVROLEMEMBER &#40;Transact-SQL&#41;](../../../t-sql/functions/is-srvrolemember-transact-sql.md)|Function|Determines membership of server role.|  
  
#  <a name="_examples"></a> Examples  
 The examples in this section show how to work with server-level roles.  
  
  
### A. Adding a SQL Login to the a server-role  
 The following example adds the SQL Login 'Jiao' to the server-role ##MS_ServerStateReader##.  
  
```sql  
ALTER SERVER ROLE ##MS_ServerStateReader##
	ADD MEMBER Jiao;  
GO    
```  

### B. Listing all principals (SQL Auth) which are members of a server-role  
 The following statement returns all members of any fixed server-role using the `sys.server_role_members` and `sys.sql_logins` catalogue views.  
  
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

## Current limitations of Server-Level Roles
Role assignments may take up to 5 minutes to become effective. In addition, for existing sessions, changes to server role assignments do not take effect until the connection is closed and re-opened. This is due to distributed architecture between the master database and other databases on the same logical server.</br>
Partial workaround: to reduce the up to 5-minute waiting period and ensure that server role assignments are current in a database, a Server Admin/AAD Admin can run `DBCC FLUSHAUTHCACHE` in the user database(s) on which the login has access. Currently logged on users still have to reconnect after this for the membership-changes to take effect on them.

Server-roles in Azure SQL Database can be assigned to SQL Logins only – AAD Logins are not yet supported.


## See Also  
 [Database-Level Roles](../../../relational-databases/security/authentication-access/database-level-roles.md)   
 [Security Catalog Views &#40;Transact-SQL&#41;](../../../relational-databases/system-catalog-views/security-catalog-views-transact-sql.md)   
 [Security Functions &#40;Transact-SQL&#41;](../../../t-sql/functions/security-functions-transact-sql.md)   
[Permissions &#40;Database Engine&#41;](../../../relational-databases/security/permissions-database-engine.md)
[DBCC FLUSHAUTHCACHE (Transact-SQL) - SQL Server | Microsoft Docs
https://docs.microsoft.com/en-us/sql/t-sql/database-console-commands/dbcc-flushauthcache-transact-sql?view=azuresqldb-current