---
title: Active Directory authentication - Azure Database for MySQL - Flexible Server
description: Learn about the concepts of Azure Active Directory for authentication with Azure Database for MySQL - Flexible Server.
author: SudheeshGH
ms.author: sunaray
ms.reviewer: maghan
ms.date: 11/21/2022
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Active Directory authentication for Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Microsoft Azure Active Directory (Azure AD) authentication is a mechanism of connecting to Azure Database for MySQL - Flexible Server using identities defined in Azure AD. With Azure AD authentication, you can manage database user identities and other Microsoft services in a central location, simplifying permission management.

## Benefits

- Authentication of users across Azure Services in a uniform way
- Management of password policies and password rotation in a single place
- Multiple forms of authentication supported by Azure Active Directory, which can eliminate the need to store passwords
- Customers can manage database permissions using external (Azure AD) groups.
- Azure AD authentication uses MySQL database users to authenticate identities at the database level
- Support of token-based authentication for applications connecting to Azure Database for MySQL flexible server

## Use the steps below to configure and use Azure AD authentication

1. Select your preferred authentication method for accessing the flexible server. By default, the authentication selected is set to MySQL authentication only. Select Azure Active Directory authentication only or MySQL and Azure Active Directory authentication to enable Azure AD authentication.
1. Select the user managed identity (UMI) with the following privileges to configure Azure AD authentication:
    - [User.Read.All](/graph/permissions-reference#user-permissions): Allows access to Azure AD user information.
    - [GroupMember.Read.All](/graph/permissions-reference#group-permissions): Allows access to Azure AD group information.
    - [Application.Read.ALL](/graph/permissions-reference#application-resource-permissions): Allows access to Azure AD service principal (application) information.

1. Add Azure AD Admin. It can be Azure AD Users or Groups, which has access to a flexible server.
1. Create database users in your database mapped to Azure AD identities.
1. Connect to your database by retrieving a token for an Azure AD identity and logging in.

> [!NOTE]  
> For detailed, step-by-step instructions about how to configure Azure AD authentication with Azure Database for MySQL - Flexible Server, see [Learn how to set up Azure Active Directory authentication for Azure Database for MySQL - Flexible Server](how-to-azure-ad.md)

## Architecture

User-managed identities are required for Azure Active Directory authentication. When a User-Assigned Identity is linked to the flexible server, the Managed Identity Resource Provider (MSRP) issues a certificate internally to that identity. When the managed identity is deleted, the corresponding service principal is automatically removed.

The service then uses the managed identity to request access tokens for services that support Azure AD authentication. Azure Database currently supports only a User-assigned Managed Identity (UMI) for Azure Database for MySQL - Flexible Server. For more information, see [Managed identity types](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) in Azure.

The following high-level diagram summarizes how authentication works using Azure AD authentication with Azure Database for MySQL. The arrows indicate communication pathways.

:::image type="content" source="media/concepts-azure-ad-authentication/azure-ad-authentication-flow.jpg" alt-text="Diagram of how Azure AD authentication works.":::

1. Your application can request a token from the Azure Instance Metadata Service identity endpoint.
1. When you use the client ID and certificate, a call is made to Azure AD to request an access token.
1. A JSON Web Token (JWT) access token is returned by Azure AD. Your application sends the access token on a call to your flexible server.
1. The flexible server validates the token with Azure AD.

## Administrator structure

There are two Administrator accounts for the MySQL server when using Azure AD authentication: the original MySQL administrator and the Azure AD administrator.

Only the administrator based on an Azure AD account can create the first Azure AD contained database user in a user database. The Azure AD administrator sign-in can be an Azure AD user or an Azure AD group. When the administrator is a group account, it can be used by any group member, enabling multiple Azure AD administrators for the flexible server. Using a group account as an administrator enhances manageability by allowing you to centrally add and remove group members in Azure AD without changing the users or permissions in the Flexible server. Only one Azure AD administrator (a user or group) can be configured at a time.

:::image type="content" source="media/concepts-azure-ad-authentication/azure-ad-admin-structure.jpg" alt-text="Diagram of Azure AD admin structure.":::

Methods of authentication for accessing the flexible server include:  
- MySQL authentication only - This is the default option. Only the native MySQL authentication with a MySQL sign-in and password can be used to access the flexible server.
- Only Azure AD authentication - MySQL native authentication is disabled, and users are able to authenticate using only their Azure AD user and token. To enable this mode, the server parameter **aad_auth_only** is set to _**ON**_.

- Authentication with MySQL and Azure AD - Both native MySQL authentication and Azure AD authentication are supported. To enable this mode, the server parameter **aad_auth_only** is set to _**OFF**_.

## Permissions

The following permissions are required to allow the UMI to read from the Microsoft Graph as the server identity. Alternatively, give the UMI the [Directory Readers](../../active-directory/roles/permissions-reference.md#directory-readers) role.

> [!IMPORTANT]  
> Only a [Global Administrator](../../active-directory/roles/permissions-reference.md#global-administrator) or [Privileged Role Administrator](../../active-directory/roles/permissions-reference.md#privileged-role-administrator) can grant these permissions.

- [User.Read.All](/graph/permissions-reference#user-permissions): Allows access to Azure AD user information.
- [GroupMember.Read.All](/graph/permissions-reference#group-permissions): Allows access to Azure AD group information.
- [Application.Read.ALL](/graph/permissions-reference#application-resource-permissions): Allows access to Azure AD service principal (application) information.

For guidance about how to grant and use the permissions, refer to [Overview of Microsoft Graph permissions](/graph/permissions-overview)

After you grant the permissions to the UMI, they're enabled for all servers created with the UMI assigned as a server identity.

## Token Validation

Azure AD authentication in Azure Database for MySQL - Flexible Server ensures that the user exists in the MySQL server and checks the token's validity by validating the token's contents. The following token validation steps are performed:

- Token is signed by Azure AD and hasn't been tampered.
- Token was issued by Azure AD for the tenant associated with the server.
- Token hasn't expired.
- Token is for the flexible server resource (and not another Azure resource).

## Connect using Azure AD identities

Azure Active Directory authentication supports the following methods of connecting to a database using Azure AD identities:

- Azure Active Directory Password
- Azure Active Directory Integrated
- Azure Active Directory Universal with MFA
- Using Active Directory Application certificates or client secrets
- Managed Identity

Once you authenticate against the Active Directory, you retrieve a token. This token is your password for logging in.

> [!NOTE]  
> That management operation, such as adding new users, is only supported for Azure AD user roles.

> [!NOTE]  
> For more information on how to connect with an Active Directory token, see [Configure and sign in with Azure AD for Azure Database for MySQL - Flexible Server](how-to-azure-ad.md).

## Other considerations

- You can only configure one Azure AD administrator per flexible server at any time.

- Only an Azure AD administrator for MySQL can initially connect to the flexible server using an Azure Active Directory account. The Active Directory administrator can configure subsequent Azure AD database users or an Azure AD group. When the administrator is a group account, it can be used by any group member, enabling multiple Azure AD administrators for the flexible server. Using a group account as an administrator enhances manageability by allowing you to centrally add and remove group members in Azure AD without changing the users or permissions in the flexible server.

- If a user is deleted from Azure AD, that user can no longer authenticate with Azure AD. Therefore, acquiring an access token for that user is no longer possible. Although the matching user is still in the database, connecting to the server with that user isn't possible.

> [!NOTE]  
> Log in with the deleted Azure AD user can still be done until the token expires (up to 60 minutes from token issuing). If you remove the user from Azure Database for MySQL, this access is revoked immediately.

- If the Azure AD admin is removed from the server, the server is no longer associated with an Azure AD tenant, and therefore all Azure AD logins are disabled for the server. Adding a new Azure AD admin from the same tenant re-enables Azure AD logins.

- A flexible server matches access tokens to the Azure Database for MySQL users using the user's unique Azure AD user ID instead of the username. This means that if an Azure AD user is deleted in Azure AD and a new user is created with the same name, the flexible server considers that a different user. Therefore, if a user is deleted from Azure AD and then a new user with the same name is added, the new user isn't able to connect with the existing user.

> [!NOTE]  
> The subscriptions of a flexible server with Azure AD authentication enabled can't be transferred to another tenant or directory.

## Next steps

- To learn how to configure Azure AD with Azure Database for MySQL, see [Set up Azure Active Directory authentication for Azure Database for MySQL - Flexible Server](how-to-azure-ad.md)


