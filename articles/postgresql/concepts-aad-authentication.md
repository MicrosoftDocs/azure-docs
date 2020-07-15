---
title: Active Directory authentication - Azure Database for PostgreSQL - Single Server
description: Learn about the concepts of Azure Active Directory for authentication with Azure Database for PostgreSQL - Single Server
author: lfittl
ms.author: lufittl
ms.service: postgresql
ms.topic: conceptual
ms.date: 11/04/2019
---

# Use Azure Active Directory for authenticating with PostgreSQL

Microsoft Azure Active Directory (Azure AD) authentication is a mechanism of connecting to Azure Database for PostgreSQL using identities defined in Azure AD.
With Azure AD authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

Benefits of using Azure AD include:

- Authentication of users across Azure Services in a uniform way
- Management of password policies and password rotation in a single place
- Multiple forms of authentication supported by Azure Active Directory, which can eliminate the need to store passwords
- Customers can manage database permissions using external (Azure AD) groups.
- Azure AD authentication uses PostgreSQL database roles to authenticate identities at the database level
- Support of token-based authentication for applications connecting to Azure Database for PostgreSQL

To configure and use Azure Active Directory authentication, use the following process:

1. Create and populate Azure Active Directory with user identities as needed.
2. Optionally associate or change the Active Directory currently associated with your Azure subscription.
3. Create an Azure AD administrator for the Azure Database for PostgreSQL server.
4. Create database users in your database mapped to Azure AD identities.
5. Connect to your database by retrieving a token for an Azure AD identity and logging in.

> [!NOTE]
> To learn how to create and populate Azure AD, and then configure Azure AD with Azure Database for PostgreSQL, see [Configure and sign in with Azure AD for Azure Database for PostgreSQL](howto-configure-sign-in-aad-authentication.md).

## Architecture

The following high-level diagram summarizes how authentication works using Azure AD authentication with Azure Database for PostgreSQL. The arrows indicate communication pathways.

![authentication flow][1]

## Administrator structure

When using Azure AD authentication, there are two Administrator accounts for the PostgreSQL server; the original PostgreSQL administrator and the Azure AD administrator. Only the administrator based on an Azure AD account can create the first Azure AD contained database user in a user database. The Azure AD administrator login can be an Azure AD user or an Azure AD group. When the administrator is a group account, it can be used by any group member, enabling multiple Azure AD administrators for the PostgreSQL server. Using a group account as an administrator enhances manageability by allowing you to centrally add and remove group members in Azure AD without changing the users or permissions in the PostgreSQL server. Only one Azure AD administrator (a user or group) can be configured at any time.

![admin structure][2]

## Permissions

To create new users that can authenticate with Azure AD, you must have the `azure_ad_admin` role in the database. This role is assigned by configuring the Azure AD Administrator account for a specific Azure Database for PostgreSQL server.

To create a new Azure AD database user, you must connect as the Azure AD administrator. This is demonstrated in [Configure and Login with Azure AD for Azure Database for PostgreSQL](howto-configure-sign-in-aad-authentication.md).

Any Azure AD authentication is only possible if the Azure AD admin was created for Azure Database for PostgreSQL. If the Azure Active Directory admin was removed from the server, existing Azure Active Directory users created previously can no longer connect to the database using their Azure Active Directory credentials.

## Connecting using Azure AD identities

Azure Active Directory authentication supports the following methods of connecting to a database using Azure AD identities:

- Azure Active Directory Password
- Azure Active Directory Integrated
- Azure Active Directory Universal with MFA
- Using Active Directory Application certificates or client secrets
- [Managed Identity](howto-connect-with-managed-identity.md)

Once you have authenticated against the Active Directory, you then retrieve a token. This token is your password for logging in.

Please note that management operations, such as adding new users, are only supported for Azure AD user roles at this point.

> [!NOTE]
> For more details on how to connect with an Active Directory token, see [Configure and sign in with Azure AD for Azure Database for PostgreSQL](howto-configure-sign-in-aad-authentication.md).

## Additional considerations

- To enhance manageability, we recommend you provision a dedicated Azure AD group as an administrator.
- Only one Azure AD administrator (a user or group) can be configured for a Azure Database for PostgreSQL server at any time.
- Only an Azure AD administrator for PostgreSQL can initially connect to the Azure Database for PostgreSQL using an Azure Active Directory account. The Active Directory administrator can configure subsequent Azure AD database users.
- If a user is deleted from Azure AD, that user will no longer be able to authenticate with Azure AD, and therefore it will no longer be possible to acquire an access token for that user. In this case, although the matching role will still be in the database, it will not be possible to connect to the server with that role.
> [!NOTE]
> Login with the deleted Azure AD user can still be done till the token expires (up to 60 minutes from token issuing).  If you also remove the user from Azure Database for PostgreSQL this access will be revoked immediately.
- If the Azure AD admin is removed from the server, the server will no longer be associated with an Azure AD tenant, and therefore all Azure AD logins will be disabled for the server. Adding a new Azure AD admin from the same tenant will reenable Azure AD logins.
- Azure Database for PostgreSQL matches access tokens to the Azure Database for PostgreSQL role using the user’s unique Azure AD user ID, as opposed to using the username. This means that if an Azure AD user is deleted in Azure AD and a new user created with the same name, Azure Database for PostgreSQL considers that a different user. Therefore, if a user is deleted from Azure AD and then a new user with the same name added, the new user will not be able to connect with the existing role. To allow that, the Azure Database for PostgreSQL Azure AD admin must revoke and then grant the role “azure_ad_user” to the user to refresh the Azure AD user ID.

## Next steps

- To learn how to create and populate Azure AD, and then configure Azure AD with Azure Database for PostgreSQL, see [Configure and sign in with Azure AD for Azure Database for PostgreSQL](howto-configure-sign-in-aad-authentication.md).
- For an overview of logins, users, and database roles Azure Database for PostgreSQL, see [Create users in Azure Database for PostgreSQL - Single Server](howto-create-users.md).

<!--Image references-->

[1]: ./media/concepts-aad-authentication/authentication-flow.png
[2]: ./media/concepts-aad-authentication/admin-structure.png
