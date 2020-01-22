---
title: Active Directory authentication - Azure Database for MySQL - Single Server
description: Learn about the concepts of Azure Active Directory for authentication with Azure Database for MySQL - Single Server
author: lfittl-msft
ms.author: lufittl
ms.service: mysql
ms.topic: conceptual
ms.date: 01/22/2019
---

# Use Azure Active Directory for authenticating with MySQL

Microsoft Azure Active Directory (Azure AD) authentication is a mechanism of connecting to Azure Database for MySQL using identities defined in Azure AD.
With Azure AD authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

> [!IMPORTANT]
> Azure AD authentication for Azure Database for MySQL is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Benefits of using Azure AD include:

- Authentication of users across Azure Services in a uniform way
- Management of password policies and password rotation in a single place
- Multiple forms of authentication supported by Azure Active Directory, which can eliminate the need to store passwords
- Customers can manage database permissions using external (Azure AD) groups.
- Azure AD authentication uses MySQL database users to authenticate identities at the database level
- Support of token-based authentication for applications connecting to Azure Database for MySQL

To configure and use Azure Active Directory authentication, use the following process:

1. Create and populate Azure Active Directory with user identities as needed.
2. Optionally associate or change the Active Directory currently associated with your Azure subscription.
3. Create an Azure AD administrator for the Azure Database for MySQL server.
4. Create database users in your database mapped to Azure AD identities.
5. Connect to your database by retrieving a token for an Azure AD identity and logging in.

> [!NOTE]
> To learn how to create and populate Azure AD, and then configure Azure AD with Azure Database for MySQL, see [Configure and sign in with Azure AD for Azure Database for MySQL](howto-configure-sign-in-azure-ad-authentication.md).

## Architecture

The following high-level diagram summarizes how authentication works using Azure AD authentication with Azure Database for MySQL. The arrows indicate communication pathways.

![authentication flow][1]

## Administrator structure

When using Azure AD authentication, there are two Administrator accounts for the MySQL server; the original MySQL administrator and the Azure AD administrator. Only the administrator based on an Azure AD account can create the first Azure AD contained database user in a user database. The Azure AD administrator login can be an Azure AD user or an Azure AD group. When the administrator is a group account, it can be used by any group member, enabling multiple Azure AD administrators for the MySQL server. Using a group account as an administrator enhances manageability by allowing you to centrally add and remove group members in Azure AD without changing the users or permissions in the MySQL server. Only one Azure AD administrator (a user or group) can be configured at any time.

![admin structure][2]

## Permissions

To create new users that can authenticate with Azure AD, you must be the designed Azure AD administrator. This user is assigned by configuring the Azure AD Administrator account for a specific Azure Database for MySQL server.

To create a new Azure AD database user, you must connect as the Azure AD administrator. This is demonstrated in [Configure and Login with Azure AD for Azure Database for MySQL](howto-configure-sign-in-azure-ad-authentication.md).

Any Azure AD authentication is only possible if the Azure AD admin was created for Azure Database for MySQL. If the Azure Active Directory admin was removed from the server, existing Azure Active Directory users created previously can no longer connect to the database using their Azure Active Directory credentials.

## Connecting using Azure AD identities

Azure Active Directory authentication supports the following methods of connecting to a database using Azure AD identities:

- Azure Active Directory Password
- Azure Active Directory Integrated
- Azure Active Directory Universal with MFA
- Using Active Directory Application certificates or client secrets

Once you have authenticated against the Active Directory, you then retrieve a token. This token is your password for logging in.

> [!NOTE]
> For more details on how to connect with an Active Directory token, see [Configure and sign in with Azure AD for Azure Database for MySQL](howto-configure-sign-in-azure-ad-authentication.md).

## Additional considerations

- Only one Azure AD administrator can be configured for a Azure Database for MySQL server at any time.
- Only an Azure AD administrator for MySQL can initially connect to the Azure Database for MySQL using an Azure Active Directory account. The Active Directory administrator can configure subsequent Azure AD database users.
- If a user is deleted from Azure AD, that user will no longer be able to authenticate with Azure AD, and therefore it will no longer be possible to acquire an access token for that user. In this case, although the matching user will still be in the database, it will not be possible to connect to the server with that user.
> [!NOTE]
> Login with the deleted Azure AD user can still be done till the token expires (up to 60 minutes from token issuing).  If you also remove the user from Azure Database for MySQL this access will be revoked immediately.
- If the Azure AD admin is removed from the server, the server will no longer be associated with an Azure AD tenant, and therefore all Azure AD logins will be disabled for the server. Adding a new Azure AD admin from the same tenant will re-enable Azure AD logins.
- Azure Database for MySQL matches access tokens to the Azure Database for MySQL user using the user’s unique Azure AD user ID, as opposed to using the username. This means that if an Azure AD user is deleted in Azure AD and a new user created with the same name, Azure Database for MySQL considers that a different user. Therefore, if a user is deleted from Azure AD and then a new user with the same name added, the new user will not be able to connect with the existing user.

## Next steps

- To learn how to create and populate Azure AD, and then configure Azure AD with Azure Database for MySQL, see [Configure and sign in with Azure AD for Azure Database for MySQL](howto-configure-sign-in-azure-ad-authentication.md).
- For an overview of logins, and database users for Azure Database for MySQL, see [Create users in Azure Database for MySQL - Single Server](howto-create-users.md).

<!--Image references-->

[1]: ./media/concepts-azure-ad-authentication/authentication-flow.png
[2]: ./media/concepts-azure-ad-authentication/admin-structure.png
