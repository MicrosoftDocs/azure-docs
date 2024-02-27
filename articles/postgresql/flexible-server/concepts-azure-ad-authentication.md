---
title: Active Directory authentication
description: Learn about the concepts of Microsoft Entra ID for authentication with Azure Database for PostgreSQL - Flexible Server.
author: kabharati
ms.author: kabharati
ms.reviewer: maghan
ms.date: 12/21/2023
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Microsoft Entra authentication with Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-Flexible-server](../includes/applies-to-postgresql-Flexible-server.md)]


Microsoft Entra authentication is a mechanism of connecting to Azure Database for PostgreSQL flexible server using identities defined in Microsoft Entra ID.
With Microsoft Entra authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

**Benefits of using Microsoft Entra ID include:**

- Authentication of users across Azure Services in a uniform way
- Management of password policies and password rotation in a single place
- Multiple forms of authentication supported by Microsoft Entra ID, which can eliminate the need to store passwords
- Customers can manage database permissions using external (Microsoft Entra ID) groups
- Microsoft Entra authentication uses PostgreSQL database roles to authenticate identities at the database level
- Support of token-based authentication for applications connecting to Azure Database for PostgreSQL flexible server


<a name='azure-active-directory-authentication-single-server-vs-flexible-server'></a>

## Microsoft Entra authentication (Azure Database for PostgreSQL single Server vs Azure Database for PostgreSQL flexible server)

Microsoft Entra authentication for Azure Database for PostgreSQL flexible server is built using our experience and feedback collected from Azure Database for PostgreSQL single server, and supports the following features and improvements over Azure Database for PostgreSQL single server:

The following table provides a list of high-level Microsoft Entra features and capabilities comparisons between Azure Database for PostgreSQL single server and Azure Database for PostgreSQL flexible server.

| **Feature / Capability** | **Azure Database for PostgreSQL single server** | **Azure Database for PostgreSQL flexible server** |
| --- | --- | --- |
| Multiple Microsoft Entra Admins | No | Yes |
| Managed Identities (System & User assigned) | Partial | Full |
| Invited User Support | No | Yes |
| Disable Password Authentication | Not Available | Available |
| Service Principal can act as group member | No | Yes |
| Audit Microsoft Entra Logins | No | Yes |
| PG bouncer support | No | Yes |

<a name='how-azure-ad-works-in-flexible-server'></a>

## How Microsoft Entra ID Works in Azure Database for PostgreSQL flexible server

The following high-level diagram summarizes how authentication works using Microsoft Entra authentication with Azure Database for PostgreSQL flexible server. The arrows indicate communication pathways.

![authentication flow][1]

 Use these steps to configure Microsoft Entra ID with Azure Database for PostgreSQL flexible server [Configure and sign in with Microsoft Entra ID for Azure Database for PostgreSQL - Flexible Server](how-to-configure-sign-in-azure-ad-authentication.md).

## Differences Between PostgreSQL Administrator and Microsoft Entra Administrator

When Microsoft Entra authentication is enabled on your Flexible Server and Microsoft Entra principal is added as a **Microsoft Entra administrator** the account not only gets the same privileges as the original **PostgreSQL administrator** but also it can manage other Microsoft Entra ID enabled roles on the server. Unlike the PostgreSQL administrator, who can only create local password-based users, the Microsoft Entra administrator has the authority to manage both Entra users and local password-based users.

Microsoft Entra administrator can be a Microsoft Entra user, Microsoft Entra group, Service Principal, or Managed Identity. Utilizing a group account as an administrator enhances manageability, as it permits centralized addition and removal of group members in Microsoft Entra ID without changing the users or permissions within the Azure Database for PostgreSQL flexible server instance. Multiple Microsoft Entra administrators can be configured concurrently, and you have the option to deactivate password authentication to an Azure Database for PostgreSQL flexible server instance for enhanced auditing and compliance requirements.

![admin structure][2]

 > [!NOTE]  
 > Service Principal or Managed Identity can now act as fully functional Microsoft Entra Administrator in Azure Database for PostgreSQL flexible server and this was a limitation in Azure Database for PostgreSQL single server.

Microsoft Entra administrators that are created via Portal, API or SQL would have the same permissions as the regular admin user created during server provisioning. Additionally, database permissions for non-admin Microsoft Entra ID enabled roles are managed similar to regular roles.

<a name='connect-using-azure-ad-identities'></a>

## Connect using Microsoft Entra identities

Microsoft Entra authentication supports the following methods of connecting to a database using Microsoft Entra identities:

- Microsoft Entra Password
- Microsoft Entra integrated
- Microsoft Entra Universal with MFA
- Using Active Directory Application certificates or client secrets
- [Managed Identity](how-to-connect-with-managed-identity.md)

Once you've authenticated against the Active Directory, you then retrieve a token. This token is your password for logging in.

> [!NOTE]  
> Use these steps to configure Microsoft Entra ID with Azure Database for PostgreSQL flexible server [Configure and sign in with Microsoft Entra ID for Azure Database for PostgreSQL - Flexible Server](how-to-configure-sign-in-azure-ad-authentication.md).

## Other considerations

- Microsoft user assigned tokens are 
- Multiple Microsoft Entra principals (a user, group, service principal or managed identity) can be configured as Microsoft Entra Administrator for an Azure Database for PostgreSQL flexible server instance at any time.
- Only a Microsoft Entra administrator for PostgreSQL can initially connect to the Azure Database for PostgreSQL flexible server instance using a Microsoft Entra account. The Active Directory administrator can configure subsequent Microsoft Entra database users.
-  If a Microsoft Entra principal is deleted from Microsoft Entra ID, it still remains as PostgreSQL role, but it will no longer be able to acquire new access token. In this case, although the matching role still exists in the database it won't be able to authenticate to the server. Database administrators need to transfer ownership and drop roles manually.

> [!NOTE]  
> Login with the deleted Microsoft Entra user can still be done till the token expires (up to 60 minutes from token issuing).  If you also remove the user from Azure Database for PostgreSQL flexible server this access is revoked immediately.

- Azure Database for PostgreSQL flexible server matches access tokens to the database role using the user’s unique Microsoft Entra user ID, as opposed to using the username. If a Microsoft Entra user is deleted and a new user is created with the same name, Azure Database for PostgreSQL flexible server considers that a different user. Therefore, if a user is deleted from Microsoft Entra ID and a new user is added with the same name the new user won't be able to connect with the existing role.

## Frequently asked questions


* **What are different authentication modes available in Azure Database for PostgreSQL Flexible Server?**
 
   Azure Database for PostgreSQL flexible server supports three modes of authentication namely  **PostgreSQL authentication only**, **Microsoft Entra authentication only**, and  **PostgreSQL and Microsoft Entra authentication**.

* **Can I configure multiple Microsoft Entra administrators on my Flexible Server?**
  
    Yes. You can configure multiple Entra administrators on your flexible server. During provisioning, you can only set a single Microsoft Entra admin but once the server is created you can set as many Microsoft Entra administrators as you want by going to **Authentication** blade. 

* **Is Microsoft Entra administrators only a Microsoft Entra user?****
  
    No. Microsoft Entra administrator can be a user, group, service principal or managed identity.

* **Can Microsoft Entra administrator create local password-based users?**
  
   Unlike the PostgreSQL administrator, who can only create local password-based users, the Microsoft Entra administrator has the authority to manage both Entra users and local password-based users.

* **What happens when I enable Microsoft Entra Authentication on my flexible server?**
  
    When Microsoft Entra Authentication is set at the server level, PGAadAuth extension gets enabled and results in a server restart.

* **How do I log in using Microsoft Entra Authentication?**
  
    You can use client tools such as psql, pgadmin etc. to login to your flexible server. Please use the Microsoft Entra ID as **User name** and use your **Entra token** as your password which is generated using azlogin.

* **How do I generate my token?**
  
   Please use the below steps to generate your token. [Generate Token](how-to-configure-sign-in-azure-ad-authentication.md).

* **What is the difference between group login and individual login?**
  
   The only difference between logging in as **Microsoft Entra group member** and an individual **Entra user** lies in the **Username**, while logging in as an individual user you provide your individual Microsoft Entra ID whereas you'll utilize the group name while logging in as a group member. Regardless, in both scenarios, you'll employ the same individual Entra token as the password.

* **What is the token lifetime?**

     User tokens are valid for up to 1 hour whereas System Assigned Managed Identity tokens are valid for up to 24 hours.


## Next steps

- To learn how to create and populate Microsoft Entra ID, and then configure Microsoft Entra ID with Azure Database for PostgreSQL flexible server, see [Configure and sign in with Microsoft Entra ID for Azure Database for PostgreSQL - Flexible Server](how-to-configure-sign-in-azure-ad-authentication.md).
- To learn how to manage Microsoft Entra users for Flexible Server, see [Manage Microsoft Entra users - Azure Database for PostgreSQL - Flexible Server](how-to-manage-azure-ad-users.md).

<!--Image references-->

[1]: ./media/concepts-azure-ad-authentication/authentication-flow.png
[2]: ./media/concepts-azure-ad-authentication/admin-structure.png
