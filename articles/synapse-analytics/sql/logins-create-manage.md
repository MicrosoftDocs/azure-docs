---
title: Authorize Server and Database Access Using Logins and User Accounts
description: Learn how Azure Synapse Analytics authenticates users for access using logins and user accounts. Also learn how to grant database roles and explicit permissions to authorize logins and users to perform actions and query data.
author: joannapea
ms.author: joanpo
ms.reviewer: wiassaf
ms.date: 05/28/2026
ms.service: azure-synapse-analytics
ms.subservice: security
ms.topic: concept-article
---
# Authorize database access to Azure Synapse Analytics

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]

In this article, you learn about:

- Configuration options for Azure Synapse Analytics that enable users to perform administrative tasks and access data stored in these databases.
- Access and authorization configuration after creating a new [logical server](logical-servers.md) for your standalone dedicated SQL pool (formerly SQL DW).
    - Dedicated SQL pools in Azure Synapse Analytics workspaces do not use logical SQL servers.
- How to add logins and user accounts in the `master` database and grant these accounts administrative permissions.
- How to add user accounts in user databases, either associated with logins or as contained user accounts.
- How to configure user accounts with permissions in user databases by using database roles and explicit permissions.

## Authentication and authorization

Authentication is the process of proving the user is who they claim to be. A user connects to a database by using a user account.

When a user attempts to connect to a database, they provide a user account and authentication information. The user is authenticated by using one of the following two authentication methods:

- [SQL authentication](/sql/relational-databases/security/choose-an-authentication-mode#connecting-through-sql-server-authentication)

  By using this authentication method, the user submits a user account name and associated password to establish a connection. The password is stored in the `master` database for user accounts linked to a login or stored in the database containing the user accounts *not* linked to a login.

- Microsoft Entra ID authentication

  By using this authentication method, the user submits a user account name and requests that the service use the credential information stored in Microsoft Entra ID ([formerly Azure Active Directory](/entra/fundamentals/new-name)).

- A **login** is an account in the `master` database, to which a user account in one or more databases can be linked. With a login, the credential information for the user account is stored with the login.
- A **user account** is an individual account in any database that might be, but doesn't have to be, linked to a login. With a user account that isn't linked to a login, the credential information is stored with the user account.

**Authorization** to access data and perform various actions are managed using database roles and explicit permissions. Authorization refers to the permissions assigned to a user, and determines what that user is allowed to do. Authorization is controlled by your user account's database [role memberships](/sql/relational-databases/security/authentication-access/database-level-roles) and [object-level permissions](/sql/relational-databases/security/permissions-database-engine). As a best practice, you should grant users the least privileges necessary. For more information, see [Azure Synapse workspace access control overview](../security/synapse-workspace-access-control-overview.md).

## Existing logins and user accounts after creating a new database

When you first deploy an Azure SQL resource, specify a login name and a password for a special type of administrative login, the **Server admin**. During deployment, the following configuration of logins and users in the `master` and user databases occurs:

> [!IMPORTANT]
> Don't include any personal, sensitive, or confidential information in the server admin login name field. Data entered in this field isn't considered *customer data*.

- The deployment process creates a SQL authentication login with administrative privileges by using the login name you specified. A [login](/sql/relational-databases/security/authentication-access/principals-database-engine?view=azure-sqldw-latest&preserve-view=true#sa-login) is an individual account for signing in to Azure Synapse Analytics.
- The deployment process grants this login full administrative permissions on all databases as a [server-level principal](/sql/relational-databases/security/authentication-access/principals-database-engine?view=azure-sqldw-latest&preserve-view=true). The login has all available permissions and can't be limited.
- When this account signs into a database, it matches to the special user account `dbo` ([user account](/sql/relational-databases/security/authentication-access/getting-started-with-database-engine-permissions?view=azure-sqldw-latest&preserve-view=true#database-users)), which exists in each user database. The [dbo](/sql/relational-databases/security/authentication-access/principals-database-engine?view=azure-sqldw-latest&preserve-view=true) user has all database permissions in the database and is member of the `db_owner` fixed database role. The article discusses additional fixed database roles later.

To identify the **Server admin** account:

1. Go to the [Azure portal](https://portal.azure.com).
1. In the resource menu, go to your Synapse workspace.
1. On the **Overview** page, view the values for **SQL admin username**.

> [!IMPORTANT]  
> You can't change the name of the **Server admin** account after you create it. To reset the password for the server admin, go to the [Azure portal](https://portal.azure.com), go to your Synapse workspace, and then select **Reset SQL admin password**.

## Create additional logins and users with administrative permissions

At this point, your logical server is only configured for access by using a single SQL authentication login and user account. To create additional logins with full or partial administrative permissions, use the following options, depending on your deployment mode:

- **Create a Microsoft Entra administrator account with full administrative permissions**

  Enable Microsoft Entra authentication and add a **Microsoft Entra admin**. You can configure one Microsoft Entra account as an administrator of the deployment with full administrative permissions. This account can be either an individual or security group account. You *must* configure a **Microsoft Entra admin** if you want to use Microsoft Entra accounts to connect to Azure Synapse. 

- **In Azure Synapse dedicated SQL pool, create SQL logins with limited administrative permissions**

  - Create an additional SQL authentication login in the `master` database.
  - Create a user account in the `master` database associated with this new login.
  - Add the user account to the `dbmanager`, the `loginmanager` role, or both in the `master` database by using the [sp_addrolemember](/sql/relational-databases/system-stored-procedures/sp-addrolemember-transact-sql?view=azure-sqldw-latest&preserve-view=true) statement.

- **In Azure Synapse serverless SQL pool, create SQL logins with limited administrative permissions**

  - Create an additional SQL authentication login in the `master` database.
  - Alternatively, create a Microsoft Entra authentication login by using the [CREATE LOGIN](/sql/t-sql/statements/create-login-transact-sql?view=azure-sqldw-latest&preserve-view=true) syntax.

## Create accounts for nonadministrator users

For example, see [How to set up access control for your Azure Synapse workspace](../security/how-to-set-up-access-control.md).

Familiarize yourself with the following features that you can use to limit or elevate permissions:

- [Impersonation](/dotnet/framework/data/adonet/sql/customizing-permissions-with-impersonation-in-sql-server) and [module-signing](/dotnet/framework/data/adonet/sql/signing-stored-procedures-in-sql-server) can be used to securely elevate permissions temporarily.
- [Row-Level Security](/sql/relational-databases/security/row-level-security?view=azure-sqldw-latest&preserve-view=true) can be used to limit which rows a user can access.
- [Dynamic data masking](/azure/azure-sql/database/dynamic-data-masking-overview) can be used to limit exposure of sensitive data.
- [Stored procedures](/sql/relational-databases/stored-procedures/stored-procedures-database-engine?view=azure-sqldw-latest&preserve-view=true) can be used to limit the actions that can be taken on the database.
 
## Related content

- [Connection strings for SQL pools in Azure Synapse](../sql-data-warehouse/sql-data-warehouse-connection-strings.md)
- [Azure Synapse Analytics connectivity settings](../security/connectivity-settings.md)
- [Azure Synapse IP firewall rules](firewall-configure.md)
