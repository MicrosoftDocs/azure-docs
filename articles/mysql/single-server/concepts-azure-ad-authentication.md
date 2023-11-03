---
title: Active Directory authentication - Azure Database for MySQL
description: Learn about the concepts of Microsoft Entra ID for authentication with Azure Database for MySQL
ms.service: mysql
ms.subservice: single-server
ms.topic: conceptual
author: SudheeshGH
ms.author: sunaray
ms.date: 06/20/2022
---

# Use Microsoft Entra ID for authenticating with MySQL

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Microsoft Entra authentication is a mechanism of connecting to Azure Database for MySQL using identities defined in Microsoft Entra ID.
With Microsoft Entra authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

Benefits of using Microsoft Entra ID include:

- Authentication of users across Azure Services in a uniform way
- Management of password policies and password rotation in a single place
- Multiple forms of authentication supported by Microsoft Entra ID, which can eliminate the need to store passwords
- Customers can manage database permissions using external (Microsoft Entra ID) groups.
- Microsoft Entra authentication uses MySQL database users to authenticate identities at the database level
- Support of token-based authentication for applications connecting to Azure Database for MySQL

To configure and use Microsoft Entra authentication, use the following process:

1. Create and populate Microsoft Entra ID with user identities as needed.
2. Optionally associate or change the Active Directory currently associated with your Azure subscription.
3. Create a Microsoft Entra administrator for the Azure Database for MySQL server.
4. Create database users in your database mapped to Microsoft Entra identities.
5. Connect to your database by retrieving a token for a Microsoft Entra identity and logging in.

> [!NOTE]
> To learn how to create and populate Microsoft Entra ID, and then configure Microsoft Entra ID with Azure Database for MySQL, see [Configure and sign in with Microsoft Entra ID for Azure Database for MySQL](how-to-configure-sign-in-azure-ad-authentication.md).

## Architecture

The following high-level diagram summarizes how authentication works using Microsoft Entra authentication with Azure Database for MySQL. The arrows indicate communication pathways.

![authentication flow][1]

## Administrator structure

When using Microsoft Entra authentication, there are two Administrator accounts for the MySQL server; the original MySQL administrator and the Microsoft Entra administrator. Only the administrator based on a Microsoft Entra account can create the first Microsoft Entra ID contained database user in a user database. The Microsoft Entra administrator login can be a Microsoft Entra user or a Microsoft Entra group. When the administrator is a group account, it can be used by any group member, enabling multiple Microsoft Entra administrators for the MySQL server. Using a group account as an administrator enhances manageability by allowing you to centrally add and remove group members in Microsoft Entra ID without changing the users or permissions in the MySQL server. Only one Microsoft Entra administrator (a user or group) can be configured at any time.

![admin structure][2]

## Permissions

To create new users that can authenticate with Microsoft Entra ID, you must be the designated Microsoft Entra administrator. This user is assigned by configuring the Microsoft Entra Administrator account for a specific Azure Database for MySQL server.

To create a new Microsoft Entra database user, you must connect as the Microsoft Entra administrator. This is demonstrated in [Configure and Login with Microsoft Entra ID for Azure Database for MySQL](how-to-configure-sign-in-azure-ad-authentication.md).

Any Microsoft Entra authentication is only possible if the Microsoft Entra admin was created for Azure Database for MySQL. If the Microsoft Entra admin was removed from the server, existing Microsoft Entra users created previously can no longer connect to the database using their Microsoft Entra credentials.

<a name='connecting-using-azure-ad-identities'></a>

## Connecting using Microsoft Entra identities

Microsoft Entra authentication supports the following methods of connecting to a database using Microsoft Entra identities:

- Microsoft Entra Password
- Microsoft Entra integrated
- Microsoft Entra Universal with MFA
- Using Active Directory Application certificates or client secrets
- [Managed Identity](how-to-connect-with-managed-identity.md)

Once you have authenticated against the Active Directory, you then retrieve a token. This token is your password for logging in.

Please note that management operations, such as adding new users, are only supported for Microsoft Entra user roles at this point.

> [!NOTE]
> For more details on how to connect with an Active Directory token, see [Configure and sign in with Microsoft Entra ID for Azure Database for MySQL](how-to-configure-sign-in-azure-ad-authentication.md).

## Additional considerations

- Microsoft Entra authentication is only available for MySQL 5.7 and newer.
- Only one Microsoft Entra administrator can be configured for a Azure Database for MySQL server at any time.
- Only a Microsoft Entra administrator for MySQL can initially connect to the Azure Database for MySQL using a Microsoft Entra account. The Active Directory administrator can configure subsequent Microsoft Entra database users.
- If a user is deleted from Microsoft Entra ID, that user will no longer be able to authenticate with Microsoft Entra ID, and therefore it will no longer be possible to acquire an access token for that user. In this case, although the matching user will still be in the database, it will not be possible to connect to the server with that user.
> [!NOTE]
> Login with the deleted Microsoft Entra user can still be done till the token expires (up to 60 minutes from token issuing).  If you also remove the user from Azure Database for MySQL this access will be revoked immediately.
- If the Microsoft Entra admin is removed from the server, the server will no longer be associated with a Microsoft Entra tenant, and therefore all Microsoft Entra logins will be disabled for the server. Adding a new Microsoft Entra admin from the same tenant will re-enable Microsoft Entra logins.
- Azure Database for MySQL matches access tokens to the Azure Database for MySQL user using the user’s unique Microsoft Entra user ID, as opposed to using the username. This means that if a Microsoft Entra user is deleted in Microsoft Entra ID and a new user created with the same name, Azure Database for MySQL considers that a different user. Therefore, if a user is deleted from Microsoft Entra ID and then a new user with the same name added, the new user will not be able to connect with the existing user.

> [!NOTE]  
> The subscriptions of an Azure MySQL with Microsoft Entra authentication enabled cannot be transferred to another tenant or directory.

## Next steps

- To learn how to create and populate Microsoft Entra ID, and then configure Microsoft Entra ID with Azure Database for MySQL, see [Configure and sign in with Microsoft Entra ID for Azure Database for MySQL](how-to-configure-sign-in-azure-ad-authentication.md).
- For an overview of logins, and database users for Azure Database for MySQL, see [Create users in Azure Database for MySQL](how-to-create-users.md).

<!--Image references-->

[1]: ./media/concepts-azure-ad-authentication/authentication-flow.png
[2]: ./media/concepts-azure-ad-authentication/admin-structure.png
