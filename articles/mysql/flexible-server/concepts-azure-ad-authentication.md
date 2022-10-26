---
title: Active Directory authentication - Azure Database for MySQL - Flexible Server Preview
description: Learn about the concepts of Azure Active Directory for authentication with Azure Database for MySQL flexible server
author: vivgk
ms.author: vivgk
ms.reviewer: maghan
ms.date: 09/21/2022
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Active Directory authentication - Azure Database for MySQL - Flexible Server Preview

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Microsoft Azure Active Directory (Azure AD) authentication is a mechanism of connecting to Azure Database for MySQL Flexible server using identities defined in Azure AD. With Azure AD authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management. 

## Benefits

- Authentication of users across Azure Services in a uniform way 
- Management of password policies and password rotation in a single place 
- Multiple forms of authentication supported by Azure Active Directory, which can eliminate the need to store passwords 
- Customers can manage database permissions using external (Azure AD) groups. 
- Azure AD authentication uses MySQL database users to authenticate identities at the database level 
- Support of token-based authentication for applications connecting to Azure Database for MySQL Flexible server

## Use the steps below to configure and use Azure AD authentication

1.	Select your preferred authentication method for accessing the MySQL flexible server. By default, the authentication selected will be MySQL authentication only. Select Azure Active Directory authentication only or MySQL and Azure Active Directory authentication to enabled Azure AD authentication.
2.	Select the user managed identity (UMI) with the following privileges: _User.Read.All, GroupMember.Read.All_ and _Application.Read.ALL_, which can be used to configure Azure AD authentication.
3.	Add Azure AD Admin. It can be Azure AD Users or Groups, which will have access to Azure Database for MySQL flexible server.
4. Create database users in your database mapped to Azure AD identities. 
5. Connect to your database by retrieving a token for an Azure AD identity and logging in. 

> [!Note]
> For detailed, step-by-step instructions about how to configure Azure AD authentication with Azure Database for MySQL flexible server, see [Learn how to set up Azure Active Directory authentication for Azure Database for MySQL flexible Server](how-to-azure-ad.md)

## Architecture

User-managed identities are required for Azure Active Directory authentication. When a User-Assigned Identity is linked to the flexible server, the Managed Identity Resource Provider (MSRP) issues a certificate internally to that identity, and when the managed identity is deleted, the corresponding service principal is automatically removed. The service then uses the managed identity to request access tokens for services that support Azure AD authentication. Only a User-assigned Managed Identity (UMI) is currently supported by Azure Database for MySQL-Flexible Server. For more information, see [Managed identity types](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) in Azure.

The following high-level diagram summarizes how authentication works using Azure AD authentication with Azure Database for MySQL. The arrows indicate communication pathways.

:::image type="content" source="media/concepts-azure-ad-authentication/azure-ad-authentication-flow.jpg" alt-text="Diagram of how Azure ad authentication works.":::

1. Your application can request a token from the Azure Instance Metadata Service identity endpoint. 
2. Using the client ID and certificate, a call is made to Azure AD to request an access token.  
3. A JSON Web Token (JWT) access token is returned by Azure AD. Your application sends the access token on a call to Azure Database for MySQL flexible server. 
4. MySQL flexible server validates the token with Azure AD.

## Administrator structure
 
When using Azure AD authentication, there are two Administrator accounts for the MySQL server; the original MySQL administrator and the Azure AD administrator. Only the administrator based on an Azure AD account can create the first Azure AD contained database user in a user database. The Azure AD administrator login can be an Azure AD user or an Azure AD group. When the administrator is a group account, it can be used by any group member, enabling multiple Azure AD administrators for the MySQL Flexible server. Using a group account as an administrator enhances manageability by allowing you to centrally add and remove group members in Azure AD without changing the users or permissions in the MySQL Flexible server. Only one Azure AD administrator (a user or group) can be configured at a time. 

:::image type="content" source="media/concepts-azure-ad-authentication/azure-ad-admin-structure.jpg" alt-text="Diagram of Azure ad admin structure.":::

Methods of authentication for accessing the MySQL flexible server include: 
- MySQL Authentication only - This is the default option. This is the default option.  Only native MySQL Authentication with a MySQL login and password will be used to access Azure Database for MySQL flexible server. 
- Only Azure AD authentication - MySQL Native authentication will be disabled, and users will be able to authenticate using only their Azure AD user and token. To enable this mode, the server parameter **aad_auth_only** will be _enabled_. 
- Authentication with MySQL and Azure AD - Both native MySQL authentication and Azure AD authentication are supported. To enable this mode, the server parameter **aad_auth_only** will be _disabled_. 

## Permissions

To allow the UMI to read from Microsoft Graph as the server identity, the following permissions are required. Alternatively, give the UMI the [Directory Readers](../../active-directory/roles/permissions-reference.md#directory-readers) role.

> [!IMPORTANT]
> Only a [Global Administrator](../../active-directory/roles/permissions-reference.md#global-administrator) or [Privileged Role Administrator](../../active-directory/roles/permissions-reference.md#privileged-role-administrator) can grant these permissions.

- [User.Read.All](/graph/permissions-reference#user-permissions): Allows access to Azure AD user information.
- [GroupMember.Read.All](/graph/permissions-reference#group-permissions): Allows access to Azure AD group information.
- [Application.Read.ALL](/graph/permissions-reference#application-resource-permissions): Allows access to Azure AD service principal (application) information.

For guidance about how to grant and use the permissions, refer [Microsoft Graph permissions](/graph/permissions-reference)

After you grant the permissions to the UMI, they're enabled for all servers or instances that are created with the UMI assigned as a server identity.

To create a new Azure AD database user, you must connect as the Azure AD administrator.
 
Any Azure AD authentication is only possible if the Azure AD admin was created for Azure Database for MySQL Flexible server. If the Azure Active Directory admin was removed from the server, existing Azure Active Directory users created previously can no longer connect to the database using their Azure Active Directory credentials.  

## Token Validation

Azure AD authentication in Azure Database for MySQL flexible server ensures that the user exists in the MySQL server, and it checks the validity of the token by validating the contents of the token. The following token validation steps are performed:

-	Token is signed by Azure AD and has not been tampered with.
-	Token was issued by Azure AD for the tenant associated with the server.
-	Token has not expired.
-	Token is for the Azure Database for MySQL flexible server resource (and not another Azure resource).

## Connecting using Azure AD identities

Azure Active Directory authentication supports the following methods of connecting to a database using Azure AD identities:

- Azure Active Directory Password
- Azure Active Directory Integrated
- Azure Active Directory Universal with MFA
- Using Active Directory Application certificates or client secrets
- Managed Identity

Once you have authenticated against the Active Directory, you then retrieve a token. This token is your password for logging in.

Please note that management operations, such as adding new users, are only supported for Azure AD user roles at this point.

> [!NOTE]
> For more details on how to connect with an Active Directory token, see [Configure and sign in with Azure AD for Azure Database for MySQL flexible server](how-to-azure-ad.md).

## Additional considerations

- Only one Azure AD administrator can be configured for an Azure Database for MySQL Flexible server at any time. 
- Only an Azure AD administrator for MySQL can initially connect to the Azure Database for MySQL Flexible server using an Azure Active Directory account. The Active Directory administrator can configure subsequent Azure AD database users or an Azure AD group. When the administrator is a group account, it can be used by any group member, enabling multiple Azure AD administrators for the MySQL Flexible server. Using a group account as an administrator enhances manageability by allowing you to centrally add and remove group members in Azure AD without changing the users or permissions in the MySQL Flexible server.  
- If a user is deleted from Azure AD, that user will no longer be able to authenticate with Azure AD, and therefore it will no longer be possible to acquire an access token for that user. In this case, although the matching user will still be in the database, it will not be possible to connect to the server with that user. 

> [!NOTE]
> Login with the deleted Azure AD user can still be done till the token expires (up to 60 minutes from token issuing).  If you also remove the user from Azure Database for MySQL this access will be revoked immediately.

- If the Azure AD admin is removed from the server, the server will no longer be associated with an Azure AD tenant, and therefore all Azure AD logins will be disabled for the server. Adding a new Azure AD admin from the same tenant will re-enable Azure AD logins. 
- Azure Database for MySQL Flexible server matches access tokens to the Azure Database for MySQL user using the user’s unique Azure AD user ID, as opposed to using the username. This means that if an Azure AD user is deleted in Azure AD and a new user created with the same name, Azure Database for MySQL considers that a different user. Therefore, if a user is deleted from Azure AD and then a new user with the same name added, the new user will not be able to connect with the existing user. 

## Next steps

- To learn how to configure Azure AD with Azure Database for MySQL, see [Set up Azure Active Directory authentication for Azure Database for MySQL flexible server](how-to-azure-ad.md)