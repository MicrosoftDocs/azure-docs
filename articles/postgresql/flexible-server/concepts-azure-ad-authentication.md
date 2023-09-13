---
title: Active Directory authentication - Azure Database for PostgreSQL - Flexible Server
description: Learn about the concepts of Azure Active Directory for authentication with Azure Database for PostgreSQL - Flexible Server
author: kabharati
ms.author: kabharati
ms.reviewer: maghan
ms.date: 11/03/2022
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Azure Active Directory Authentication with PostgreSQL Flexible Server

[!INCLUDE [applies-to-postgresql-Flexible-server](../includes/applies-to-postgresql-Flexible-server.md)]


Microsoft Azure Active Directory (Azure AD) authentication is a mechanism of connecting to Azure Database for PostgreSQL using identities defined in Azure AD.
With Azure AD authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

Benefits of using Azure AD include:

- Authentication of users across Azure Services in a uniform way
- Management of password policies and password rotation in a single place
- Multiple forms of authentication supported by Azure Active Directory, which can eliminate the need to store passwords
- Customers can manage database permissions using external (Azure AD) groups.
- Azure AD authentication uses PostgreSQL database roles to authenticate identities at the database level
- Support of token-based authentication for applications connecting to Azure Database for PostgreSQL

## Azure Active Directory Authentication (Single Server VS Flexible Server)

Azure Active Directory Authentication for Flexible Server is built using our experience and feedback we've collected from Azure Database for PostgreSQL Single Server, and supports the following features and improvements over single server:

The following table provides a list of high-level Azure AD features and capabilities comparisons between Single Server and Flexible Server

| **Feature / Capability** | **Single Server** | **Flexible Server** |
| --- | --- | --- |
| Multiple Azure AD Admins | No | Yes |
| Managed Identities (System & User assigned) | Partial | Full |
| Invited User Support | No | Yes |
| Disable Password Authentication | Not Available | Available |
| Service Principal can act as group member | No | Yes |
| Audit Azure AD Logins | No | Yes |
| PG bouncer support | No | Yes |

## How Azure AD Works In Flexible Server

The following high-level diagram summarizes how authentication works using Azure AD authentication with Azure Database for PostgreSQL. The arrows indicate communication pathways.

![authentication flow][1]

 Use these steps to configure Azure AD with Azure Database for PostgreSQL Flexible Server [Configure and sign in with Azure AD for Azure Database for PostgreSQL Flexible Server](how-to-configure-sign-in-azure-ad-authentication.md).

## Manage PostgreSQL Access For AD Principals

When Azure AD authentication is enabled and Azure AD principal is added as an Azure AD administrator the account gets the same privileges as the original PostgreSQL administrator. Only Azure AD administrator can manage other Azure AD enabled roles on the server using Azure portal or Database API. The Azure AD administrator sign-in can be an Azure AD user, Azure AD group, Service Principal or Managed Identity. Using a group account as an administrator enhances manageability by allowing you to centrally add and remove group members in Azure AD without changing the users or permissions in the PostgreSQL server. Multiple Azure AD administrators can be configured at any time and you can optionally disable password authentication to an Azure Database for PostgreSQL Flexible Server for better auditing and compliance needs.

![admin structure][2]

 > [!NOTE]  
 > Service Principal or Managed Identity can now act as fully functional Azure AD Administrator in Flexible Server and this was a limitation in our Single Server.

Azure AD administrators that are created via Portal, API or SQL would have the same permissions as the regular admin user created during server provisioning. Additionally, database permissions for non-admin Azure AD enabled roles are managed similar to regular roles.

## Connect using Azure AD identities

Azure Active Directory authentication supports the following methods of connecting to a database using Azure AD identities:

- Azure Active Directory Password
- Azure Active Directory Integrated
- Azure Active Directory Universal with MFA
- Using Active Directory Application certificates or client secrets
- [Managed Identity](how-to-connect-with-managed-identity.md)

Once you've authenticated against the Active Directory, you then retrieve a token. This token is your password for logging in.

> [!NOTE]  
> Use these steps to configure Azure AD with Azure Database for PostgreSQL Flexible Server [Configure and sign in with Azure AD for Azure Database for PostgreSQL Flexible Server](how-to-configure-sign-in-azure-ad-authentication.md).

## Other considerations

- Multiple Azure AD principals (a user, group, service principal or managed identity) can be configured as Azure AD Administrator for an Azure Database for PostgreSQL server at any time.
- Only an Azure AD administrator for PostgreSQL can initially connect to the Azure Database for PostgreSQL using an Azure Active Directory account. The Active Directory administrator can configure subsequent Azure AD database users.
-  If an Azure AD principal is deleted from Azure AD, it still remains as PostgreSQL role, but it will no longer be able to acquire new access token. In this case, although the matching role still exists in the database it won't be able to authenticate to the server. Database administrators need to transfer ownership and drop roles manually.

> [!NOTE]  
> Login with the deleted Azure AD user can still be done till the token expires (up to 60 minutes from token issuing).  If you also remove the user from Azure Database for PostgreSQL this access will be revoked immediately.

- Azure Database for PostgreSQL Flexible Server matches access tokens to the database role using the user’s unique Azure Active Directory user ID, as opposed to using the username. If an Azure AD user is deleted and a new user is created with the same name, Azure Database for PostgreSQL Flexible Server considers that a different user. Therefore, if a user is deleted from Azure AD and a new user is added with the same name the new user won't be able to connect with the existing role.


## Next steps

- To learn how to create and populate Azure AD, and then configure Azure AD with Azure Database for PostgreSQL, see [Configure and sign in with Azure AD for Azure Database for PostgreSQL](how-to-configure-sign-in-azure-ad-authentication.md).
- To learn how to manage Azure AD users for Flexible Server, see [Manage Azure Active Directory users - Azure Database for PostgreSQL - Flexible Server](how-to-manage-azure-ad-users.md).

<!--Image references-->

[1]: ./media/concepts-azure-ad-authentication/authentication-flow.png
[2]: ./media/concepts-azure-ad-authentication/admin-structure.png
