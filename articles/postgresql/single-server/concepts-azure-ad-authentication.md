---
title: Active Directory authentication - Azure Database for PostgreSQL - Single Server
description: Learn about the concepts of Microsoft Entra ID for authentication with Azure Database for PostgreSQL - Single Server
ms.service: postgresql
ms.subservice: single-server
ms.topic: conceptual
ms.author: sunila
author: sunilagarwal
ms.date: 06/24/2022
---

# Use Microsoft Entra ID for authenticating with PostgreSQL

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

Microsoft Entra authentication is a mechanism of connecting to Azure Database for PostgreSQL using identities defined in Microsoft Entra ID.
With Microsoft Entra authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

Benefits of using Microsoft Entra ID include:

- Authentication of users across Azure Services in a uniform way
- Management of password policies and password rotation in a single place
- Multiple forms of authentication supported by Microsoft Entra ID, which can eliminate the need to store passwords
- Customers can manage database permissions using external (Microsoft Entra ID) groups.
- Microsoft Entra authentication uses PostgreSQL database roles to authenticate identities at the database level
- Support of token-based authentication for applications connecting to Azure Database for PostgreSQL

To configure and use Microsoft Entra authentication, use the following process:

1. Create and populate Microsoft Entra ID with user identities as needed.
2. Optionally associate or change the Active Directory currently associated with your Azure subscription.
3. Create a Microsoft Entra administrator for the Azure Database for PostgreSQL server.
4. Create database users in your database mapped to Microsoft Entra identities.
5. Connect to your database by retrieving a token for a Microsoft Entra identity and logging in.

> [!NOTE]
> To learn how to create and populate Microsoft Entra ID, and then configure Microsoft Entra ID with Azure Database for PostgreSQL, see [Configure and sign in with Microsoft Entra ID for Azure Database for PostgreSQL](how-to-configure-sign-in-azure-ad-authentication.md).

## Architecture

The following high-level diagram summarizes how authentication works using Microsoft Entra authentication with Azure Database for PostgreSQL. The arrows indicate communication pathways.

![authentication flow][1]

## Administrator structure

When using Microsoft Entra authentication, there are two Administrator accounts for the PostgreSQL server; the original PostgreSQL administrator and the Microsoft Entra administrator. Only the administrator based on a Microsoft Entra account can create the first Microsoft Entra ID contained database user in a user database. The Microsoft Entra administrator login can be a Microsoft Entra user or a Microsoft Entra group. When the administrator is a group account, it can be used by any group member, enabling multiple Microsoft Entra administrators for the PostgreSQL server. Using a group account as an administrator enhances manageability by allowing you to centrally add and remove group members in Microsoft Entra ID without changing the users or permissions in the PostgreSQL server. Only one Microsoft Entra administrator (a user or group) can be configured at any time.

![admin structure][2]

 >[!NOTE]
 > Service Principal or Managed Identity cannot act as fully functional Microsoft Entra Administrator in Single Server and this limitation is fixed in our Flexible Server 

## Permissions

To create new users that can authenticate with Microsoft Entra ID, you must have the `azure_ad_admin` role in the database. This role is assigned by configuring the Microsoft Entra Administrator account for a specific Azure Database for PostgreSQL server.

To create a new Microsoft Entra database user, you must connect as the Microsoft Entra administrator. This is demonstrated in [Configure and Login with Microsoft Entra ID for Azure Database for PostgreSQL](how-to-configure-sign-in-azure-ad-authentication.md).

Any Microsoft Entra authentication is only possible if the Microsoft Entra admin was created for Azure Database for PostgreSQL. If the Microsoft Entra admin was removed from the server, existing Microsoft Entra users created previously can no longer connect to the database using their Microsoft Entra credentials.

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
> For more details on how to connect with an Active Directory token, see [Configure and sign in with Microsoft Entra ID for Azure Database for PostgreSQL](how-to-configure-sign-in-azure-ad-authentication.md).

## Additional considerations

- To enhance manageability, we recommend you provision a dedicated Microsoft Entra group as an administrator.
- Only one Microsoft Entra administrator (a user or group) can be configured for an Azure Database for PostgreSQL server at any time.
- Only a Microsoft Entra administrator for PostgreSQL can initially connect to the Azure Database for PostgreSQL using a Microsoft Entra account. The Active Directory administrator can configure subsequent Microsoft Entra database users.
- If a user is deleted from Microsoft Entra ID, that user will no longer be able to authenticate with Microsoft Entra ID, and therefore it will no longer be possible to acquire an access token for that user. In this case, although the matching role will still be in the database, it will not be possible to connect to the server with that role.
> [!NOTE]
> Login with the deleted Microsoft Entra user can still be done till the token expires (up to 60 minutes from token issuing).  If you also remove the user from Azure Database for PostgreSQL this access will be revoked immediately.
- If the Microsoft Entra admin is removed from the server, the server will no longer be associated with a Microsoft Entra tenant, and therefore all Microsoft Entra logins will be disabled for the server. Adding a new Microsoft Entra admin from the same tenant will reenable Microsoft Entra logins.
- Azure Database for PostgreSQL matches access tokens to the Azure Database for PostgreSQL role using the user’s unique Microsoft Entra user ID, as opposed to using the username. This means that if a Microsoft Entra user is deleted in Microsoft Entra ID and a new user created with the same name, Azure Database for PostgreSQL considers that a different user. Therefore, if a user is deleted from Microsoft Entra ID and then a new user with the same name added, the new user will not be able to connect with the existing role. To allow that, the Azure Database for PostgreSQL Microsoft Entra admin must revoke and then grant the role “azure_ad_user” to the user to refresh the Microsoft Entra user ID.

## Next steps

- To learn how to create and populate Microsoft Entra ID, and then configure Microsoft Entra ID with Azure Database for PostgreSQL, see [Configure and sign in with Microsoft Entra ID for Azure Database for PostgreSQL](how-to-configure-sign-in-azure-ad-authentication.md).
- For an overview of logins, users, and database roles Azure Database for PostgreSQL, see [Create users in Azure Database for PostgreSQL - Single Server](how-to-create-users.md).

<!--Image references-->

[1]: ./media/concepts-azure-ad-authentication/authentication-flow.png
[2]: ./media/concepts-azure-ad-authentication/admin-structure.png
