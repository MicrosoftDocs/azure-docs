---
title: Microsoft Entra Authentication
titleSuffix: Azure Synapse Analytics
description: Learn how to use Microsoft Entra ID for authentication with Synapse SQL in Azure Synapse Analytics.
author: VanMSFT
ms.author: vanto
ms.reviewer: wiassaf
ms.date: 10/08/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: concept-article
---

# Microsoft Entra authentication for Azure Synapse Analytics

This article provides an in-depth overview of using Microsoft Entra authentication with Synapse SQL in Azure Synapse Analytics.

> [!NOTE]
> Microsoft Entra server principals are currently in preview for Azure Synapse Analytics.


To configure Microsoft Entra authentication, see [Configure and manage Microsoft Entra authentication with Azure Synapse Analytics](authentication-aad-configure.md).

## Overview

Microsoft Entra ID allows you to centrally manage the identities of humans and services in your data estate. By integrating Microsoft Entra with Azure Synapse Analytics for authentication, you can simplify identity and permission management while also enabling detailed conditional access and governance over connections to your data.

Using Microsoft Entra authentication includes the following benefits:

- Replaces less secure authentication methods like usernames and passwords.
- Eliminates, or helps stop, the proliferation of user identities across servers.
- Microsoft Entra groups enable database permission management to be abstracted away from individual accounts and into operational groups.
- Allows password rotation in a single place.
- Microsoft Entra-only authentication provides a complete alternative to SQL authentication.
- Managed identities for Azure resources eliminate the need to store passwords for services that connect to your databases, and connections from your databases to other Azure resources.
- Enables modern security controls including strong multifactor authentication with a range of easy verification options, such as a phone call, text message, smart card with pin, or mobile app notification.
- Microsoft Entra ID enables [integration with many modern authentication protocols](/entra/architecture/auth-sync-overview), including OpenID Connect, OAuth2.0, Kerberos Constrained Delegation, and more.
- Enables centralized monitoring of connections to data sources.
- Enables conditional access controls, such as requiring compliant devices or authentication methods for successful connections.

> [!NOTE]
> Microsoft Entra authentication only supports access tokens that originated from Microsoft Entra ID, and not third-party access tokens. Microsoft Entra ID also doesn't support redirecting Microsoft Entra ID queries to third-party endpoints. This limitation applies to all SQL platforms and all operating systems that support Microsoft Entra authentication.

### Configuration steps

The general steps to configure Microsoft Entra authentication are:

1. Create and populate a Microsoft Entra tenant.
1. Create an Azure Synapse workspace or standalone dedicated SQL pool.
1. Assign a Microsoft Entra administrator to the workspace or logical server.
1. Create SQL principals in your database that are mapped to Microsoft Entra identities.
1. Configure your client applications to connect by using Azure Identity libraries and authentication methods.
1. Connect to your database with Microsoft Entra identities.

## Supported identities and authentication methods

Azure Synapse Analytics supports using the following Microsoft Entra identities as logins and users (principals) in Synapse SQL:

- **Microsoft Entra users**: Any [type of user](/entra/fundamentals/how-to-create-delete-users#types-of-users) in a Microsoft Entra tenant, which includes internal users, external users, guests, and members. Members of an Active Directory domain [federated with Microsoft Entra ID](/entra/identity/hybrid/connect/whatis-fed) are also supported, and can be configured for [seamless single sign-on](/entra/identity/hybrid/connect/how-to-connect-sso).
- **Applications**: Applications that exist in Azure can use service principals or managed identities to authenticate directly to Azure Synapse Analytics. Using managed identities is preferable because authentication is passwordless and eliminates the need for developer-managed credentials.
- **Microsoft Entra groups**, which can simplify access management across your organization by managing user and application access based on group membership.

For *user identities*, the following authentication methods are supported:

- **Microsoft Entra Integrated (Windows Authentication)** supported by Microsoft Entra Hybrid Identities with Active Directory [federation].
- **Microsoft Entra MFA**, or multifactor authentication, which requires additional security checks beyond the user's knowledge.
- **Microsoft Entra Password** authentication, which uses user credentials stored and managed in Microsoft Entra ID.
- **Microsoft Entra Default** authentication, which scans various credential caches on the application's machine, and can use user tokens to authenticate to SQL.

For *service or workload identities*, the following authentication methods are supported:

- **Managed identities** for Azure resources, both user-assigned and system-assigned. Managed identity authentication is token-based, in which the identity is assigned to the resource that wants to authenticate using it. The Azure Identity platform validates that relationship, which enables passwordless authentication.
- **Microsoft Entra service principal name and application (client) secret**. This authentication method isn't recommended because of the risk associated with passwords that can be guessed and leaked.
- **Microsoft Entra Default** authentication, which scans various credential caches on the application's machine, and can use application tokens to authenticate to SQL.

## Microsoft Entra administrator

To enable Microsoft Entra authentication, a Microsoft Entra administrator has to be set for your Azure Synapse workspace or logical server. This administrator exists alongside the SQL administrator. The Microsoft Entra administrator can be a user, group, service principal, or managed identity in your Azure tenant. Only one identity can be configured at a time. Removing the Microsoft Entra administrator disables Microsoft Entra authentication-based connections, even for existing Microsoft Entra users with permissions in a database.

> [!TIP]  
> Microsoft Entra groups enables multiple identities to act as the Microsoft Entra administrator on the server. When the administrator is set to a group, all group members inherit the Microsoft Entra administrator role. A Microsoft Entra group admin enhances manageability by shifting admin management from server data plane actions into Microsoft Entra ID and the hands of the group owners. Groups can be used for all Microsoft Entra identities that connect to SQL, allowing for onetime user and permission configuration in the server and databases, leaving all user management to the groups.

The Microsoft Entra admin plays a special role: it's the first account that can create other Microsoft Entra logins and users, collectively referred to as principals. The admin is a contained database user in the `master` database of the server. Administrator accounts are members of the **db_owner** role in every user database, and each user database is entered as the **dbo** user. For more information about administrator accounts, see [Managing Databases and Logins](logins-create-manage.md).

## Microsoft Entra principals

> [!NOTE]
> [Microsoft Entra server principals (logins)](authentication-azure-ad-logins.md) are currently in preview for Azure Synapse Analytics.

You can create Microsoft Entra identities as principals in Azure Synapse Analytics in three ways:

- as server principals or [logins](authentication-azure-ad-logins.md)
- as login-based users (a type of database principal)
- as contained database users

> [!IMPORTANT]  
> Microsoft Entra authentication for Azure SQL doesn't integrate with Azure RBAC. To use Microsoft Entra identities to connect to Azure SQL and execute queries, you need to create those identities as Microsoft Entra principals in the databases they need to access. The `SQL Server Contributor` and `SQL DB Contributor` roles secure management-related deployment operations, not database connectivity access.

### Logins (server principals) in dedicated SQL pools

[Server principals (logins) for Microsoft Entra identities](authentication-azure-ad-logins.md) are in preview for Azure Synapse Analytics dedicated SQL pools.

The following T-SQL shows how to create a Microsoft Entra login:

```sql
CREATE LOGIN [MSEntraUser] FROM EXTERNAL PROVIDER
```

A Microsoft Entra login has the following property values in [sys.server_principals](/sql/relational-databases/system-catalog-views/sys-server-principals-transact-sql):

| Property | Value |
| --- | --- |
| `SID` (Security Identifier) | Binary representation of the Microsoft Entra identity's object ID |
| type | E = External login or application from Microsoft Entra ID<br />X = External group from Microsoft Entra ID |
| type_desc | EXTERNAL_LOGIN for Microsoft Entra login or app<br />EXTERNAL_GROUP for Microsoft Entra group |

### Login-based users

Login-based users inherit the server-level roles and permissions assigned to its Microsoft Entra login.

The following T-SQL shows how to create a login-based user for a Microsoft Entra identity:

```sql
CREATE USER [MSEntraUser] FROM LOGIN [MSEntraUser]
```

The following table details the Microsoft Entra login-based user property values in [sys.database_principals](/sql/relational-databases/system-catalog-views/sys-database-principals-transact-sql):

| Property | Value |
| --- | --- |
| `SID` (Security Identifier) | Binary representation of the Microsoft Entra identity's object ID, plus 'AADE' |
| type | E = External login or application from Microsoft Entra ID<br />X = External group from Microsoft Entra ID |
| type_desc | EXTERNAL_LOGIN for Microsoft Entra login or app<br />EXTERNAL_GROUP for Microsoft Entra group |

### Contained database users

Contained database users are portable with the database. They have no connections to identities defined in the server or instance, and you can easily move them along with the database from one server or instance to another without disruption.

The following T-SQL shows how to create a contained database user for a Microsoft Entra identity:

```sql
CREATE USER [MSEntraUser] FROM EXTERNAL PROVIDER
```

A Microsoft Entra database-based user has the same property values as login-based users in [sys.database_principals](/sql/relational-databases/system-catalog-views/sys-database-principals-transact-sql), except for how the `SID` is constructed:

| Property | Value |
| --- | --- |
| `SID` (Security Identifier) | Binary representation of the Microsoft Entra identity's object ID |
| type | E = External login or application from Microsoft Entra ID<br />X = External group from Microsoft Entra ID |
| type_desc | EXTERNAL_LOGIN for Microsoft Entra login or app<br />EXTERNAL_GROUP for Microsoft Entra group |

To get the original Microsoft Entra GUID that the `SID` is based on, use the following T-SQL conversion:

```sql
SELECT CAST(sid AS UNIQUEIDENTIFIER) AS EntraID FROM sys.database_principals
```

> [!CAUTION]
> You might unintentionally create a contained Microsoft Entra database user with the same name as a Microsoft Entra login at the server or instance level. Since the principals aren't connected to each other, the database user doesn't inherit permissions from the server login. Identities can become conflated in connection requests, resulting in undefined behavior.

Use the following T-SQL query to determine if a database user is a login-based user or a contained database user:

```sql
SELECT CASE
    WHEN CONVERT(VARCHAR(100), sid, 2) LIKE '%AADE' AND len(sid) = 18 THEN 'login-based user'
    ELSE 'contained database user'
    END AS user_type,
    *
FROM sys.database_principals WHERE TYPE = 'E' OR TYPE = 'X'
```

Use the following T-SQL query to view all Microsoft Entra principals in a database:

```sql
SELECT
  name,
  CAST(sid AS UNIQUEIDENTIFIER) AS EntraID,
  CASE WHEN TYPE = 'E' THEN 'App/User' ELSE 'Group' AS user_type,
  sid
FROM sys.database_principals WHERE TYPE = 'E' OR TYPE = 'X'
```

## Microsoft Entra-only authentication

When you enable Microsoft Entra-only authentication, you disable SQL authentication. You can't use SQL authentication to connect to the workspace, SQL pool, or database.

To get started, see [Configure Microsoft Entra-only authentication](authentication-azure-ad-only-authentication.md).

## Multifactor authentication (MFA)

[Microsoft Entra multifactor authentication](/entra/identity/authentication/concept-mfa-howitworks) is a security feature provided by Microsoft's cloud-based identity and access management service. Multifactor authentication enhances the security of user sign-ins by requiring users to provide extra verification steps beyond a password.

Microsoft Entra multifactor authentication helps safeguard access to data and applications while meeting user demand for a simple sign-in process. MFA adds an extra layer of security to user sign-ins by requiring users to provide two or more authentication factors. These factors typically include something the user knows (password), something the user possesses (smartphone or hardware token), and/or something the user is (biometric data). By combining multiple factors, MFA significantly reduces the likelihood of unauthorized access.

Multifactor authentication is a supported authentication method for Azure Synapse Analytics.

To get started, see [Configure Microsoft Entra multifactor authentication](authentication-aad-configure.md#configure-multifactor-authentication).

## Microsoft Entra B2B support

Microsoft Entra authentication in all SQL products also supports [Microsoft Entra B2B collaboration](/entra/external-id/what-is-b2b), which enables businesses to invite guest users to collaborate with their organization. Guest users can connect to databases either as individual users or members of a Microsoft Entra group.

## Trust architecture for Microsoft Entra federation to Active Directory

Microsoft Entra ID also integrates with familiar identity and access management solutions like Active Directory. By hybrid joining your on-premises Active Directory, you enable Windows identities federated through Microsoft Entra ID to use single sign-on credentials to connect to Azure Synapse Analytics.

For federation, Microsoft Entra ID provides two secure authentication methods: pass-through and password hash authentication. If you're considering federating your on-premises Active Directory to Microsoft Entra ID, review [Choose the right authentication method for your Microsoft Entra hybrid identity solution](/entra/identity/hybrid/connect/choose-ad-authn).

For more information on the setup and synchronization of Microsoft Entra hybrid identities, see the following articles:

- [Implement password hash synchronization with Microsoft Entra Connect Sync](/entra/identity/hybrid/connect/how-to-connect-password-hash-synchronization)
- [Microsoft Entra pass-through authentication](/entra/identity/hybrid/connect/how-to-connect-pta-quick-start)
- [Deploying Active Directory Federation Services in Azure](/windows-server/identity/ad-fs/deployment/how-to-connect-fed-azure-adfs) and [Microsoft Entra Connect and federation](/entra/identity/hybrid/connect/how-to-connect-fed-whatis)

Microsoft Entra ID authenticates the token, and the database trusts it and validates the issuer and other details. Customer 1 can represent Microsoft Entra ID with native users or Microsoft Entra ID with federated users. Customer 2 represents a possible solution including imported users, in this example coming from a federated Microsoft Entra ID with ADFS being synchronized with Microsoft Entra ID. It's important to understand that access to a database by using Microsoft Entra authentication requires that the hosting subscription is associated to the Microsoft Entra ID. You must use the same subscription to create the Azure SQL or Azure Synapse resources.

## Permissions

Permissions assigned to the Microsoft Entra administrator differ from the permissions assigned to other principals in Azure Synapse Analytics. In some scenarios, Azure Synapse Analytics also needs Microsoft Graph permissions to use Microsoft Entra authentication.

### Admin permissions

The following permissions and roles are assigned to the Microsoft Entra admin when created:

- **db_owner** of each database

### Azure Synapse Analytics permissions

A principal needs the `ALTER ANY USER` permission in the database to create a user.

By default, server administrator accounts, database users with `CONTROL ON DATABASE`, and members of the `db_owner` database role have the `ALTER ANY USER` permission.

To create a Microsoft Entra principal in Azure SQL, the requesting identity must query Microsoft Graph for details about the principal. On initial deployment, the only identity that can query Microsoft Graph is the Microsoft Entra admin. Therefore, the admin must be the first identity to create other Microsoft Entra principals. After that, the admin can assign `ALTER ANY USER` to other principals so they can create other Microsoft Entra principals.

#### Zero-touch deployments with Microsoft Entra authentication

Because the Microsoft Entra administrator must be the first identity to connect to the database and create other Microsoft Entra users, it can be helpful to add the identity of your deployment infrastructure as the administrator. Your deployments can then do initial setup like creating other Microsoft Entra principals and assigning them permissions. For deployments, use tools like PowerShell ARM templates to script automated principal creation. Azure SQL doesn't support native APIs today to configure user creation and permission management. You can only perform these operations by using a direct connection to the SQL instance.

### Microsoft Graph permissions

For creating Microsoft Entra principals and a few other scenarios, Azure SQL needs to make Microsoft Graph calls to retrieve information about, and validate the existence of, the identity in Microsoft Entra ID. To do this, the SQL process must have or obtain access to Microsoft Graph read permissions within the customer tenant. You can achieve this access in several ways:

- If the SQL principal executing the command is a user identity, you don't need to grant any additional permissions on the SQL instance to query Microsoft Graph.
- If the SQL principal executing the command is a service identity, such as a service principal or managed identity, the Azure SQL instance requires its own permissions to query Microsoft Graph.
  - Assign application permissions to the primary server identity (managed identity) of the logical server or managed instance. The SQL process can use the primary server identity to authenticate to other Azure services in a tenant, such as Microsoft Graph. The following table explains various scenarios and the Microsoft Graph permissions required for the command to execute successfully.

| Scenario | Minimum Permission |
| --- | --- |
| `CREATE USER` or `CREATE LOGIN` for a Microsoft Entra service principal or managed identity | Application.Read.All |
| `CREATE USER` or `CREATE LOGIN` for a Microsoft Entra user | User.Read.All |
| `CREATE USER` or `CREATE LOGIN` for a Microsoft Entra group | GroupMember.Read.All |

> [!TIP]
> The Directory Readers role is the smallest-scoped role that you can assign to an identity and covers all needed permissions. By using roles, you can assign them to Microsoft Entra security groups, which abstracts management away from individual entities and into conceptual groups.

## Tools support

[SQL Server Management Studio (SSMS)](/ssms/sql-server-management-studio-ssms) supports a number of Microsoft Entra authentication connection options, including [multifactor authentication](mfa-authentication.md).

[SQL Server Data Tools (SSDT)](/sql/ssdt/sql-server-data-tools) for Visual Studio, starting with 2015, supports Password, Integrated, and Interactive authentication with Microsoft Entra ID. For more information, see [Microsoft Entra ID support in SQL Server Data Tools (SSDT)](/sql/ssdt/azure-active-directory).
- Currently, SSDT Object Explorer doesn't show Microsoft Entra users. As a workaround, view the users in [sys.database_principals](/sql/relational-databases/system-catalog-views/sys-database-principals-transact-sql).

### Minimum versions

To use Microsoft Entra authentication with Azure Synapse Analytics, you need the following minimum versions when using these tools:

- SQL Server Management Studio (SSMS) 18.6 or later
- SQL Server Data Tools for Visual Studio 2015, version 14.0.60311.1 (April 2016) or later
- **.NET Framework Data Provider for SqlServer**, minimum version .NET Framework 4.6
- Beginning with version 15.0.1, [sqlcmd utility](/sql/tools/sqlcmd-utility) and [bcp utility](/sql/tools/bcp-utility) support Active Directory Interactive authentication with multifactor authentication.
- [Microsoft JDBC Driver 6.0 for SQL Server](/sql/connect/jdbc/microsoft-jdbc-driver-for-sql-server) supports Microsoft Entra authentication. Also, see [Setting the Connection Properties](/sql/connect/jdbc/setting-the-connection-properties).

## Connect with Microsoft Entra to Azure Synapse Analytics

After you configure Microsoft Entra authentication for your Azure SQL resource, you can connect by using [SQL Server Management Studio](authentication-microsoft-entra-connect-to-azure-sql.md#connect-with-ssms-or-ssdt), [SQL Server Data Tools](authentication-microsoft-entra-connect-to-azure-sql.md#connect-with-ssms-or-ssdt), and [a client application](authentication-microsoft-entra-connect-to-azure-sql.md#connect-from-a-client-application).

## Limitations

When using Microsoft Entra authentication with Azure Synapse Analytics, consider the following limitations:

- Microsoft Entra users and service principals (Microsoft Entra applications) that are members of more than 2048 Microsoft Entra security groups aren't supported and can't log into the database.
- The following system functions aren't supported and return `NULL` values when executed by Microsoft Entra principals:

  - `SUSER_ID()`
  - `SUSER_NAME(<ID>)`
  - `SUSER_SNAME(<SID>)`
  - `SUSER_ID(<name>)`
  - `SUSER_SID(<name>)`

- We recommend setting the connection timeout to 30 seconds.
- Microsoft Entra users that are part of a group that is a member of the `db_owner` database role might see the following error when attempting to use [CREATE DATABASE SCOPED CREDENTIAL](/sql/t-sql/statements/create-database-scoped-credential-transact-sql) in Azure Synapse Analytics:

  `SQL Error [2760] [S0001]: The specified schema name 'user@mydomain.com' either doesn't exist or you do not have permission to use it.`

  To mitigate the `CREATE DATABASE SCOPED CREDENTIAL` issue, add the Microsoft Entra user's identity to the `db_owner` role directly.

- Azure Synapse Analytics doesn't create implicit users for users signed in through Microsoft Entra group membership. Because of this, operations that require assigning ownership can fail, even if the Microsoft Entra group is a member of a role with those permissions.

  For example, a user signed into a database via a Microsoft Entra group with the **db_ddladmin** role can't execute `CREATE SCHEMA`, `ALTER SCHEMA`, and other object creation statements without a schema explicitly defined (such as table, view, or type, for example). To resolve this, a Microsoft Entra user must be created for that user, or the Microsoft Entra group must be altered to assign a `DEFAULT_SCHEMA` such as **dbo**.

- Removing the Microsoft Entra administrator prevents Microsoft Entra authentication connections.

## Related content

- [Configure and manage Microsoft Entra authentication with Azure Synapse Analytics](authentication-aad-configure.md)
- [Authorize database access to Azure Synapse Analytics](logins-create-manage.md)
- [Database principals](/sql/relational-databases/security/authentication-access/principals-database-engine)
- [Database roles](/sql/relational-databases/security/authentication-access/database-level-roles)
- [CREATE LOGIN syntax for Microsoft Entra server principals](/sql/t-sql/statements/create-login-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [Azure Synapse Analytics firewall rules](firewall-configure.md)
