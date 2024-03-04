---
title: Active Directory authentication - Azure Cosmos DB for PostgreSQL
description: Learn about the concepts of native PostgreSQL and Azure Active Directory authentication with Azure Cosmos DB for PostgreSQL
author: niklarin
ms.author: nlarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: conceptual
ms.date: 08/02/2023
---

# Azure Active Directory and PostgreSQL authentication with Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

> [!IMPORTANT]
> Azure Active Directory authentication in Azure Cosmos DB for PostgreSQL is currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended
> for production workloads. Certain features might not be supported or might have constrained 
> capabilities.
>
> [Contact us](mailto:askcosmosdb4postgres@microsoft.com) if you're interested in participating in Azure Active Directory authentication 
> for Azure Cosmos DB for PostgreSQL preview.
>
> You can see a complete list of other new features in [preview features](product-updates.md#features-in-preview).

Azure Cosmos DB for PostgreSQL supports PostgreSQL authentication and integration with Azure Active Directory (Azure AD). Each Azure Cosmos DB for PostgreSQL cluster is created with native PostgreSQL authentication enabled and one built-in PostgreSQL role named `citus`. You can add more native PostgreSQL roles after cluster provisioning is completed.

You can also enable Azure AD authentication on a cluster in addition to the PostgreSQL authentication method or instead of it. You can configure authentication methods on each Azure Cosmos DB for PostgreSQL cluster independently. If you need to change authentication method, you can do it at any time after cluster provisioning is completed. Changing authentication methods doesn't require cluster restart.

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

`citus` role can't be deleted but would be disabled if 'Azure Active Directory authentication only' authentication method is selected on cluster.

## Azure Active Directory authentication (preview)

[Microsoft Azure Active Directory (Azure AD)](./../../active-directory/fundamentals/active-directory-whatis.md) authentication is a mechanism of connecting to Azure Cosmos DB  for PostgreSQL using identities defined in Azure AD. With Azure AD authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

Benefits of using Azure AD include:

- Authentication of users across Azure Services in a uniform way
- Management of password policies and password rotation in a single place
- Multiple forms of authentication supported by Azure Active Directory, which can eliminate the need to store passwords
- Azure AD authentication uses PostgreSQL database roles to authenticate identities at the database level
- Support of token-based authentication for applications connecting to Azure Cosmos DB for PostgreSQL

### Manage PostgreSQL access for Azure AD principals

When Azure AD authentication is enabled and Azure AD principal is added as an Azure AD administrator, the account gets the same privileges as [the `citus` role](#the-citus-role). The Azure AD administrator sign-in can be an Azure AD user, Service Principal or Managed Identity. Multiple Azure AD administrators can be configured at any time and you can optionally disable PostgreSQL (password) authentication to the Azure Cosmos DB for PostgreSQL cluster for better auditing and compliance needs.

Additionally, any number of non-admin Azure AD roles can be added to a cluster at any time once Azure AD authentication is enabled. Database permissions for non-admin Azure AD roles are managed similar to regular roles.

### Connect using Azure AD identities

Azure Active Directory authentication supports the following methods of connecting to a database using Azure AD identities:

- Azure Active Directory Password
- Azure Active Directory Integrated
- Azure Active Directory Universal with MFA
- Using Active Directory Application certificates or client secrets
- Managed Identity

Once you've authenticated against the Active Directory, you then retrieve a token. This token is your password for logging in.

### Other considerations

- Multiple Azure AD principals (a user, service principal, or managed identity) can be configured as Azure AD administrator for an Azure Cosmos DB for PostgreSQL cluster at any time.
-  If an Azure AD principal is deleted from Azure AD service, it still remains as a PostgreSQL role on the cluster, but it's no longer able to acquire new access token. In this case, although the matching role still exists in the Postgres database it's unable to authenticate to the cluster nodes. Database administrators need to transfer ownership and drop such roles manually.

> [!NOTE]  
> Login with the deleted Azure AD user can still be done till the token expires (up to 90 minutes from token issuing).  If you also remove the user from Azure Cosmos DB for PostgreSQL cluster this access will be revoked immediately.

- Azure Cosmos DB for PostgreSQL matches access tokens to the database role using the user’s unique Azure Active Directory user ID, as opposed to using the username. If an Azure AD user is deleted and a new user is created with the same name, Azure Cosmos DB for PostgreSQL considers that a different user. Therefore, if a user is deleted from Azure AD and a new user is added with the same name the new user would be unable to connect with the existing role.

## Next steps

- To learn how to configure authentication for Azure Cosmos DB for PostgreSQL clusters, see [Use Azure Active Directory and native PostgreSQL roles for authentication with Azure Cosmos DB for PostgreSQL](./how-to-configure-authentication.md).
- To set up private network access to the cluster nodes, see [Manage private access](./howto-private-access.md).
- To set up public network access to the cluster nodes, see [Manage public access](./howto-manage-firewall-using-portal.md). 
