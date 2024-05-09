---
title: Microsoft Entra authentication with Azure Database for PostgreSQL - Flexible Server
description: Learn about the concepts of Microsoft Entra ID for authentication with Azure Database for PostgreSQL - Flexible Server.
author: kabharati
ms.author: kabharati
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Microsoft Entra authentication with Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-Flexible-server](../includes/applies-to-postgresql-Flexible-server.md)]

Microsoft Entra authentication is a mechanism of connecting to Azure Database for PostgreSQL flexible server by using identities defined in Microsoft Entra ID. With Microsoft Entra authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

Benefits of using Microsoft Entra ID include:

- Authentication of users across Azure services in a uniform way.
- Management of password policies and password rotation in a single place.
- Support for multiple forms of authentication, which can eliminate the need to store passwords.
- The ability of customers to manage database permissions by using external (Microsoft Entra ID) groups.
- The use of PostgreSQL database roles to authenticate identities at the database level.
- Support of token-based authentication for applications that connect to Azure Database for PostgreSQL flexible server.

<a name='azure-active-directory-authentication-single-server-vs-flexible-server'></a>

## Microsoft Entra ID feature and capability comparisons between deployment options

Microsoft Entra authentication for Azure Database for PostgreSQL flexible server incorporates our experience and feedback collected from Azure Database for PostgreSQL single server.

The following table lists high-level comparisons of Microsoft Entra ID features and capabilities between Azure Database for PostgreSQL single server and Azure Database for PostgreSQL flexible server.

| Feature/Capability | Azure Database for PostgreSQL single server | Azure Database for PostgreSQL flexible server |
| --- | --- | --- |
| Multiple Microsoft Entra admins | No | Yes |
| Managed identities (system and user assigned) | Partial | Full |
| Invited user support | No | Yes |
| Ability to turn off password authentication | Not available | Available |
| Ability of a service principal to act as a group member | No | Yes |
| Audits of Microsoft Entra sign-ins | No | Yes |
| PgBouncer support | No | Yes |

<a name='how-azure-ad-works-in-flexible-server'></a>

## How Microsoft Entra ID works in Azure Database for PostgreSQL flexible server

The following high-level diagram summarizes how authentication works when you use Microsoft Entra authentication with Azure Database for PostgreSQL flexible server. The arrows indicate communication pathways.

![authentication flow][1]

For the steps to configure Microsoft Entra ID with Azure Database for PostgreSQL flexible server, see [Configure and sign in with Microsoft Entra ID for Azure Database for PostgreSQL - Flexible Server](how-to-configure-sign-in-azure-ad-authentication.md).

## Differences between a PostgreSQL administrator and a Microsoft Entra administrator

When you turn on Microsoft Entra authentication for your flexible server and add a Microsoft Entra principal as a Microsoft Entra administrator, the account:

- Gets the same privileges as the original PostgreSQL administrator.
- Can manage other Microsoft Entra roles on the server.

The PostgreSQL administrator can create only local password-based users. But the Microsoft Entra administrator has the authority to manage both Microsoft Entra users and local password-based users.

The Microsoft Entra administrator can be a Microsoft Entra user, Microsoft Entra group, service principal, or managed identity. Using a group account as an administrator enhances manageability. It permits the centralized addition and removal of group members in Microsoft Entra ID without changing the users or permissions within the Azure Database for PostgreSQL flexible server instance.

You can configure multiple Microsoft Entra administrators concurrently. You have the option to deactivate password authentication to an Azure Database for PostgreSQL flexible server instance for enhanced auditing and compliance requirements.

![admin structure][2]

> [!NOTE]  
> A service principal or managed identity can act as fully functional Microsoft Entra administrator in Azure Database for PostgreSQL flexible server. This was a limitation in Azure Database for PostgreSQL single server.

Microsoft Entra administrators that you create via the Azure portal, an API, or SQL have the same permissions as the regular admin user that you created during server provisioning. Database permissions for non-admin Microsoft Entra roles are managed similarly to regular roles.

<a name='connect-using-azure-ad-identities'></a>

## Connection via Microsoft Entra identities

Microsoft Entra authentication supports the following methods of connecting to a database by using Microsoft Entra identities:

- Microsoft Entra password authentication
- Microsoft Entra integrated authentication
- Microsoft Entra universal with multifactor authentication
- Active Directory application certificates or client secrets
- [Managed identity](how-to-connect-with-managed-identity.md)

After you authenticate against Active Directory, you retrieve a token. This token is your password for signing in.

To configure Microsoft Entra ID with Azure Database for PostgreSQL flexible server, follow the steps in [Configure and sign in with Microsoft Entra ID for Azure Database for PostgreSQL - Flexible Server](how-to-configure-sign-in-azure-ad-authentication.md).

## Other considerations

- If you want the Microsoft Entra principals to assume ownership of the user databases within any deployment procedure, add explicit dependencies within your deployment (Terraform or Azure Resource Manager) module to ensure that Microsoft Entra authentication is turned on before you create any user databases.
- Multiple Microsoft Entra principals (user, group, service principal, or managed identity) can be configured as a Microsoft Entra administrator for an Azure Database for PostgreSQL flexible server instance at any time.
- Only a Microsoft Entra administrator for PostgreSQL can initially connect to the Azure Database for PostgreSQL flexible server instance by using a Microsoft Entra account. The Active Directory administrator can configure subsequent Microsoft Entra database users.
- If a Microsoft Entra principal is deleted from Microsoft Entra ID, it remains as a PostgreSQL role but can no longer acquire a new access token. In this case, although the matching role still exists in the database, it can't authenticate to the server. Database administrators need to transfer ownership and drop roles manually.

  > [!NOTE]  
  > The deleted Microsoft Entra user can still sign in until the token expires (up to 60 minutes from token issuing). If you also remove the user from Azure Database for PostgreSQL flexible server, this access is revoked immediately.

- Azure Database for PostgreSQL flexible server matches access tokens to the database role by using the user's unique Microsoft Entra user ID, as opposed to using the username. If a Microsoft Entra user is deleted and a new user is created with the same name, Azure Database for PostgreSQL flexible server considers that a different user. Therefore, if a user is deleted from Microsoft Entra ID and a new user is added with the same name, the new user can't connect with the existing role.

## Frequently asked questions

- **What are the available authentication modes in Azure Database for PostgreSQL flexible server?**

  Azure Database for PostgreSQL flexible server supports three modes of authentication: PostgreSQL authentication only, Microsoft Entra authentication only, and  both PostgreSQL and Microsoft Entra authentication.

- **Can I configure multiple Microsoft Entra administrators on my flexible server?**

  Yes. You can configure multiple Microsoft Entra administrators on your flexible server. During provisioning, you can set only a single Microsoft Entra administrator. But after the server is created, you can set as many Microsoft Entra administrators as you want by going to the **Authentication** pane.

- **Is a Microsoft Entra administrator just a Microsoft Entra user?**

  No. A Microsoft Entra administrator can be a user, group, service principal, or managed identity.

- **Can a Microsoft Entra administrator create local password-based users?**

  A Microsoft Entra administrator has the authority to manage both Microsoft Entra users and local password-based users.

- **What happens when I enable Microsoft Entra authentication on my flexible server?**

  When you set Microsoft Entra authentication at the server level, the PGAadAuth extension is enabled and the server restarts.

- **How do I sign in by using Microsoft Entra authentication?**

  You can use client tools like psql or pgAdmin to sign in to your flexible server. Use your Microsoft Entra user ID as the username and your Microsoft Entra token as your password.

- **How do I generate my token?**

  You generate the token by using `az login`. For more information, see [Retrieve the Microsoft Entra access token](how-to-configure-sign-in-azure-ad-authentication.md).

- **What's the difference between group login and individual login?**

  The only difference between signing in as a Microsoft Entra group member and signing in as an individual Microsoft Entra user lies in the username. Signing in as an individual user requires an individual Microsoft Entra user ID. Signing in as a group member requires the group name. In both scenarios, you use the same individual Microsoft Entra token as the password.

- **What's the token lifetime?**

  User tokens are valid for up to 1 hour. Tokens for system-assigned managed identities are valid for up to 24 hours.

## Next steps

- To learn how to create and populate a Microsoft Entra ID instance, and then configure Microsoft Entra ID with Azure Database for PostgreSQL flexible server, see [Configure and sign in with Microsoft Entra ID for Azure Database for PostgreSQL - Flexible Server](how-to-configure-sign-in-azure-ad-authentication.md).
- To learn how to manage Microsoft Entra users for Azure Database for PostgreSQL flexible server, see [Manage Microsoft Entra roles in Azure Database for PostgreSQL - Flexible Server](how-to-manage-azure-ad-users.md).

<!--Image references-->

[1]: ./media/concepts-azure-ad-authentication/authentication-flow.png
[2]: ./media/concepts-azure-ad-authentication/admin-structure.png
