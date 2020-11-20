---
title: Migrate SQL Server Windows users and groups to SQL Managed Instance using T-SQL
description: Learn about how to migrate Windows users and groups in a SQL Server instance to Azure SQL Managed Instance
services: sql-database
ms.service: sql-managed-instance
ms.subservice: security
ms.custom: seo-lt-2019, sqldbrb=1
ms.topic: tutorial
author: GitHubMirek
ms.author: mireks
ms.reviewer: vanto
ms.date: 10/30/2019
---

# Tutorial: Migrate Windows users and groups in a SQL Server instance to Azure SQL Managed Instance using T-SQL DDL syntax
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

> [!NOTE]
> The syntax used to migrate users and groups to SQL Managed Instance in this article is in **public preview**.

This article takes you through the process of migrating your on-premises Windows users and groups in your SQL Server to Azure SQL Managed Instance using T-SQL syntax.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create logins for SQL Server
> - Create a test database for migration
> - Create logins, users, and roles
> - Backup and restore your database to SQL Managed Instance (MI)
> - Manually migrate users to MI using ALTER USER syntax
> - Testing authentication with the new mapped users

## Prerequisites

To complete this tutorial, the following prerequisites apply:

- The Windows domain is federated with Azure Active Directory (Azure AD).
- Access to Active Directory to create users/groups.
- An existing SQL Server in your on-premises environment.
- An existing SQL Managed Instance. See [Quickstart: Create a SQL Managed Instance](instance-create-quickstart.md).
  - A `sysadmin` in the SQL Managed Instance must be used to create Azure AD logins.
- [Create an Azure AD admin for SQL Managed Instance](../database/authentication-aad-configure.md#provision-azure-ad-admin-sql-managed-instance).
- You can connect to your SQL Managed Instance within your network. See the following articles for additional information:
  - [Connect your application to Azure SQL Managed Instance](connect-application-instance.md)
  - [Quickstart: Configure a point-to-site connection to an Azure SQL Managed Instance from on-premises](point-to-site-p2s-configure.md)
  - [Configure public endpoint in Azure SQL Managed Instance](public-endpoint-configure.md)

## T-SQL DDL syntax

Below are the T-SQL DDL syntax used to support the migration of Windows users and groups from a SQL Server instance to SQL Managed Instance with Azure AD authentication.

```sql
-- For individual Windows users with logins
ALTER USER [domainName\userName] WITH LOGIN = [loginName@domainName.com];

--For individual groups with logins
ALTER USER [domainName\groupName] WITH LOGIN=[groupName]
```

## Arguments

_domainName_</br>
Specifies the domain name of the user.

_userName_</br>
Specifies the name of the user identified inside the database.

_= loginName\@domainName.com_</br>
Remaps a user to the Azure AD login

_groupName_</br>
Specifies the name of the group identified inside the database.

## Part 1: Create logins in SQL Server for Windows users and groups

> [!IMPORTANT]
> The following syntax creates a user and a group login in your SQL Server. You'll need to make sure that the user and group exist inside your Active Directory (AD) before executing the below syntax. </br> </br>
> Users: testUser1, testGroupUser </br>
> Group: migration - testGroupUser needs to belong to the migration group in AD

The example below creates a login in SQL Server for an account named _testUser1_ under the domain _aadsqlmi_.

```sql
-- Sign into SQL Server as a sysadmin or a user that can create logins and databases

use master;  
go

-- Create Windows login
create login [aadsqlmi\testUser1] from windows;
go;

/** Create a Windows group login which contains one user [aadsqlmi\testGroupUser].
testGroupUser will need to be added to the migration group in Active Directory
**/
create login [aadsqlmi\migration] from windows;
go;


-- Check logins were created
select * from sys.server_principals;
go;
```

Create a database for this test.

```sql
-- Create a database called [migration]
create database migration
go
```

## Part 2: Create Windows users and groups, then add roles and permissions

Use the following syntax to create the test user.

```sql
use migration;  
go

-- Create Windows user [aadsqlmi\testUser1] with login
create user [aadsqlmi\testUser1] from login [aadsqlmi\testUser1];
go
```

Check the user permissions:

```sql
-- Check the user in the Metadata
select * from sys.database_principals;
go

-- Display the permissions – should only have CONNECT permissions
select user_name(grantee_principal_id), * from sys.database_permissions;
go
```

Create a role and assign your test user to this role:

```sql
-- Create a role with some permissions and assign the user to the role
create role UserMigrationRole;
go

grant CONNECT, SELECT, View DATABASE STATE, VIEW DEFINITION to UserMigrationRole;
go

alter role UserMigrationRole add member [aadsqlmi\testUser1];
go
```

Use the following query to display user names assigned to a specific role:

```sql
-- Display user name assigned to a specific role
SELECT DP1.name AS DatabaseRoleName,
   isnull (DP2.name, 'No members') AS DatabaseUserName
 FROM sys.database_role_members AS DRM
 RIGHT OUTER JOIN sys.database_principals AS DP1
   ON DRM.role_principal_id = DP1.principal_id
 LEFT OUTER JOIN sys.database_principals AS DP2
   ON DRM.member_principal_id = DP2.principal_id
WHERE DP1.type = 'R'
ORDER BY DP1.name;
```

Use the following syntax to create a group. Then add the group to the role `db_owner`.

```sql
-- Create Windows group
create user [aadsqlmi\migration] from login [aadsqlmi\migration];
go

-- ADD 'db_owner' role to this group
sp_addrolemember 'db_owner', 'aadsqlmi\migration';
go

--Check the db_owner role for 'aadsqlmi\migration' group
select is_rolemember('db_owner', 'aadsqlmi\migration')
go
-- Output  ( 1 means YES)
```

Create a test table and add some data using the following syntax:

```sql
-- Create a table and add data
create table test ( a int, b int);
go

insert into test values (1,10)
go

-- Check the table values
select * from test;
go
```

## Part 3: Backup and restore the individual user database to SQL Managed Instance

Create a backup of the migration database using the article [Copy Databases with Backup and Restore](/sql/relational-databases/databases/copy-databases-with-backup-and-restore), or use the following syntax:

```sql
use master;
go
backup database migration to disk = 'C:\Migration\migration.bak';
go
```

Follow our [Quickstart: Restore a database to a SQL Managed Instance](restore-sample-database-quickstart.md).

## Part 4: Migrate users to SQL Managed Instance

Execute the ALTER USER command to complete the migration process on SQL Managed Instance.

1. Sign into your SQL Managed Instance using the Azure AD admin account for SQL Managed Instance. Then create your Azure AD login in the SQL Managed Instance using the following syntax. For more information, see [Tutorial: SQL Managed Instance security in Azure SQL Database using Azure AD server principals (logins)](aad-security-configure-tutorial.md).

    ```sql
    use master
    go

    -- Create login for AAD user [testUser1@aadsqlmi.net]
    create login [testUser1@aadsqlmi.net] from external provider
    go

    -- Create login for the Azure AD group [migration]. This group contains one user [testGroupUser@aadsqlmi.net]
    create login [migration] from external provider
    go

    --Check the two new logins
    select * from sys.server_principals
    go
    ```

1. Check your migration for the correct database, table, and principals.

    ```sql
    -- Switch to the database migration that is already restored for MI
    use migration;
    go

    --Check if the restored table test exist and contain a row
    select * from test;
    go

    -- Check that the SQL on-premises Windows user/group exists  
    select * from sys.database_principals;
    go
    -- the old user aadsqlmi\testUser1 should be there
    -- the old group aadsqlmi\migration should be there
    ```

1. Use the ALTER USER syntax to map the on-premises user to the Azure AD login.

    ```sql
    /** Execute the ALTER USER command to alter the Windows user [aadsqlmi\testUser1]
    to map to the Azure AD user testUser1@aadsqlmi.net
    **/
    alter user [aadsqlmi\testUser1] with login = [testUser1@aadsqlmi.net];
    go

    -- Check the principal
    select * from sys.database_principals;
    go
    -- New user testUser1@aadsqlmi.net should be there instead
    --Check new user permissions  - should only have CONNECT permissions
    select user_name(grantee_principal_id), * from sys.database_permissions;
    go

    -- Check a specific role
    -- Display Db user name assigned to a specific role
    SELECT DP1.name AS DatabaseRoleName,
    isnull (DP2.name, 'No members') AS DatabaseUserName
    FROM sys.database_role_members AS DRM
    RIGHT OUTER JOIN sys.database_principals AS DP1
    ON DRM.role_principal_id = DP1.principal_id
    LEFT OUTER JOIN sys.database_principals AS DP2
    ON DRM.member_principal_id = DP2.principal_id
    WHERE DP1.type = 'R'
    ORDER BY DP1.name;
    ```

1. Use the ALTER USER syntax to map the on-premises group to the Azure AD login.

    ```sql
    /** Execute ALTER USER command to alter the Windows group [aadsqlmi\migration]
    to the Azure AD group login [migration]
    **/
    alter user [aadsqlmi\migration] with login = [migration];
    -- old group migration is changed to Azure AD migration group
    go

    -- Check the principal
    select * from sys.database_principals;
    go

    --Check the group permission - should only have CONNECT permissions
    select user_name(grantee_principal_id), * from sys.database_permissions;
    go

    --Check the db_owner role for 'aadsqlmi\migration' user
    select is_rolemember('db_owner', 'migration')
    go
    -- Output 1 means 'YES'
    ```

## Part 5: Testing Azure AD user or group authentication

Test authenticating to SQL Managed Instance using the user previously mapped to the Azure AD login using the ALTER USER syntax.

1. Log into the federated VM using your Azure SQL Managed Instance subscription as `aadsqlmi\testUser1`
1. Using SQL Server Management Studio (SSMS), sign into your SQL Managed Instance using **Active Directory Integrated** authentication, connecting
to the database `migration`.
    1. You can also sign in using the testUser1@aadsqlmi.net credentials with the SSMS option **Active Directory – Universal with MFA support**. However, in this case, you can't use the Single Sign On mechanism and you must type a password. You won't need to use a federated VM to log in to your SQL Managed Instance.
1. As part of the role member **SELECT**, you can select from the `test` table

    ```sql
    Select * from test  --  and see one row (1,10)
    ```

Test authenticating to a SQL Managed Instance using a member of a Windows group `migration`. The user `aadsqlmi\testGroupUser` should have been added to the group `migration` before the migration.

1. Log into the federated VM using your Azure SQL Managed Instance subscription as `aadsqlmi\testGroupUser`
1. Using SSMS with **Active Directory Integrated** authentication, connect to the Azure SQL Managed Instance server and the database `migration`
    1. You can also sign in using the testGroupUser@aadsqlmi.net credentials with the SSMS option **Active Directory – Universal with MFA support**. However, in this case, you can't use the Single Sign On mechanism and you must type a password. You won't need to use a federated VM to log into your SQL Managed Instance.
1. As part of the `db_owner` role, you can create a new table.

    ```sql
    -- Create table named 'new' with a default schema
    Create table dbo.new ( a int, b int)
    ```

> [!NOTE]
> Due to a known design issue for Azure SQL Database, a create a table statement executed as a member of a group will fail with the following error: </br> </br>
> `Msg 2760, Level 16, State 1, Line 4
The specified schema name "testGroupUser@aadsqlmi.net" either does not exist or you do not have permission to use it.` </br> </br>
> The current workaround is to create a table with an existing schema in the case above <dbo.new>

## Next steps

[Tutorial: Migrate SQL Server to Azure SQL Managed Instance offline using DMS](../../dms/tutorial-sql-server-to-managed-instance.md?toc=/azure/sql-database/toc.json)
