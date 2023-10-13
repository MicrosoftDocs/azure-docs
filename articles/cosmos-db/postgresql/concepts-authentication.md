---
title: Active Directory authentication - Azure Cosmos DB for PostgreSQL
description: Learn about the concepts of native PostgreSQL and Microsoft Entra authentication with Azure Cosmos DB for PostgreSQL
author: niklarin
ms.author: nlarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: conceptual
ms.date: 09/19/2023
---

# Microsoft Entra ID and PostgreSQL authentication with Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

> [!IMPORTANT]
> Microsoft Entra authentication in Azure Cosmos DB for PostgreSQL is currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended
> for production workloads. Certain features might not be supported or might have constrained 
> capabilities.
>
> You can see a complete list of other new features in [preview features](product-updates.md#features-in-preview).

Azure Cosmos DB for PostgreSQL supports PostgreSQL authentication and integration with Microsoft Entra ID. Each Azure Cosmos DB for PostgreSQL cluster is created with native PostgreSQL authentication enabled and one built-in PostgreSQL role named `citus`. You can add more native PostgreSQL roles after cluster provisioning is completed.

You can also enable Microsoft Entra authentication on a cluster in addition to the PostgreSQL authentication method or instead of it. You can configure authentication methods on each Azure Cosmos DB for PostgreSQL cluster independently. If you need to change authentication method, you can do it at any time after cluster provisioning is completed. Changing authentication methods doesn't require cluster restart.

## PostgreSQL authentication

The PostgreSQL engine uses
[roles](https://www.postgresql.org/docs/current/sql-createrole.html) to control
access to database objects. A newly created Azure Cosmos DB for PostgreSQL cluster
comes with several roles predefined:

* The [default PostgreSQL roles](https://www.postgresql.org/docs/current/default-roles.html)
* `postgres`
* `citus`

Since Azure Cosmos DB for PostgreSQL is a managed PaaS service, only Microsoft can sign in with the
`postgres` superuser role. For limited administrative access, Azure Cosmos DB for PostgreSQL
provides the `citus` role. 

The managed service needs to replicate all PostgreSQL roles to all nodes in a cluster. To facilitate this requirement, all other PostgreSQL roles need to be created using Azure Cosmos DB for PostgreSQL management capabilities.

### The Citus role

Permissions for the `citus` role:

* Read all configuration variables, even variables normally visible only to
  superusers.
* Read all pg\_stat\_\* views and use various statistics-related
  extensions--even views or extensions normally visible only to superusers.
* Execute monitoring functions that may take ACCESS SHARE locks on tables,
  potentially for a long time.
* [Create PostgreSQL extensions](reference-extensions.md).

Notably, the `citus` role has some restrictions:

* Can't create roles
* Can't create databases

`citus` role can't be deleted but would be disabled if 'Microsoft Entra authentication only' authentication method is selected on cluster.

<a name='azure-active-directory-authentication-preview'></a>

## Microsoft Entra authentication (preview)

[Microsoft Entra ID](./../../active-directory/fundamentals/active-directory-whatis.md) authentication is a mechanism of connecting to Azure Cosmos DB  for PostgreSQL using identities defined in Microsoft Entra ID. With Microsoft Entra authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

Benefits of using Microsoft Entra ID include:

- Authentication of users across Azure Services in a uniform way
- Management of password policies and password rotation in a single place
- Multiple forms of authentication supported by Microsoft Entra ID, which can eliminate the need to store passwords
- Microsoft Entra authentication uses PostgreSQL database roles to authenticate identities at the database level
- Support of token-based authentication for applications connecting to Azure Cosmos DB for PostgreSQL

<a name='manage-postgresql-access-for-azure-ad-principals'></a>

### Manage PostgreSQL access for Microsoft Entra principals

When Microsoft Entra authentication is enabled and Microsoft Entra principal is added as a Microsoft Entra administrator, the account gets the same privileges as [the `citus` role](#the-citus-role). The Microsoft Entra administrator sign-in can be a Microsoft Entra user, Service Principal or Managed Identity. Multiple Microsoft Entra administrators can be configured at any time and you can optionally disable PostgreSQL (password) authentication to the Azure Cosmos DB for PostgreSQL cluster for better auditing and compliance needs.

Additionally, any number of non-admin Microsoft Entra roles can be added to a cluster at any time once Microsoft Entra authentication is enabled. Database permissions for non-admin Microsoft Entra roles are managed similar to regular roles.

<a name='connect-using-azure-ad-identities'></a>

### Connect using Microsoft Entra identities

Microsoft Entra authentication supports the following methods of connecting to a database using Microsoft Entra identities:

- Microsoft Entra Password
- Microsoft Entra integrated
- Microsoft Entra Universal with MFA
- Using Active Directory Application certificates or client secrets
- Managed Identity

Once you've authenticated against the Active Directory, you then retrieve a token. This token is your password for logging in.

### Other considerations

- Multiple Microsoft Entra principals (a user, service principal, or managed identity) can be configured as Microsoft Entra administrator for an Azure Cosmos DB for PostgreSQL cluster at any time.
-  If a Microsoft Entra principal is deleted from Microsoft Entra service, it still remains as a PostgreSQL role on the cluster, but it's no longer able to acquire new access token. In this case, although the matching role still exists in the Postgres database it's unable to authenticate to the cluster nodes. Database administrators need to transfer ownership and drop such roles manually.

> [!NOTE]  
> Login with the deleted Microsoft Entra user can still be done till the token expires (up to 90 minutes from token issuing).  If you also remove the user from Azure Cosmos DB for PostgreSQL cluster this access will be revoked immediately.

- Azure Cosmos DB for PostgreSQL matches access tokens to the database role using the user’s unique Microsoft Entra user ID, as opposed to using the username. If a Microsoft Entra user is deleted and a new user is created with the same name, Azure Cosmos DB for PostgreSQL considers that a different user. Therefore, if a user is deleted from Microsoft Entra ID and a new user is added with the same name the new user would be unable to connect with the existing role.

## Next steps

- Check out [Microsoft Entra ID limits and limitations in Azure Cosmos DB for PostgreSQL](./reference-limits.md#azure-active-directory-authentication)
- [Learn how to configure authentication for Azure Cosmos DB for PostgreSQL clusters](./how-to-configure-authentication.md)
- Set up private network access to the cluster nodes, see [Manage private access](./howto-private-access.md)
- Set up public network access to the cluster nodes, see [Manage public access](./howto-manage-firewall-using-portal.md)
