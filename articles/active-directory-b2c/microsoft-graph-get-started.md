---
title: Manage Azure AD B2C resources with Microsoft Graph
titleSuffix: Azure AD B2C
description: An introduction to managing Azure AD B2C resources with the Microsoft Graph API.
services: B2C
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 01/31/2020
ms.author: marsma
ms.subservice: B2C
---

# Manage Azure AD B2C with Microsoft Graph

Managing Azure Active Directory B2C (Azure AD B2C) tenants that have thousands or millions of users is often best performed programmatically, and the Microsoft Graph API enables such programmatic support.

A primary example is user management. You might need to migrate an existing user store to a B2C tenant. Or perhaps you want to host user registration on your own page and create user accounts in your Azure AD B2C directory behind the scenes. These kinds of tasks require the ability to create, read, update, and delete user accounts. You can perform such tasks by using the Microsoft Graph API.

## Microsoft Graph API interaction modes

There are two modes of communication you can use when working with the Microsoft Graph API to manage resources in your Azure AD B2C tenant:

- **Interactive** - Appropriate for run-once tasks, you use an administrator account in the B2C tenant to perform the management tasks. This mode requires an administrator to sign in using their credentials before calling the Microsoft Graph API.

- **Automated**  - For scheduled or continuously run tasks, this method uses a service account that you configure with the permissions required to perform management tasks. You create the "service account" in Azure AD B2C by registering an application that your applications and scripts use for authenticating using its *Application (Client) ID* and the OAuth 2.0 client credentials grant. In this case, the application acts as itself to call the Microsoft Graph API, not the administrator user as in the previously described interactive method.

This article helps you prepare for using the **automated** method.

## Register management application

To prepare for using the Microsoft Graph API to manage resources in your B2C tenant, first register an application that your automation scripts and applications will use to access tenant resources.

[!INCLUDE [active-directory-b2c-appreg-mgmt](../../includes/active-directory-b2c-appreg-mgmt.md)]

### Grant API access

Next, grant the registered application permissions to manipulate tenant resources through calls to the Microsoft Graph API.

[!INCLUDE [active-directory-b2c-permissions-directory](../../includes/active-directory-b2c-permissions-directory.md)]

### Create client secret

[!INCLUDE [active-directory-b2c-client-secret](../../includes/active-directory-b2c-client-secret.md)]

You now have an application that has permission to *create*, *read*, and *update* users in your Azure AD B2C tenant. Continue to the next section to add user *delete* and *password update* permissions.

## Add user delete and password update permissions

The *Read and write directory data* permission that you granted earlier does **NOT** include the ability to delete users or update their passwords.

If you want to give your application or script the ability to delete users or update passwords, grant it the *User administrator* role:

1. Sign in to the [Azure portal](https://portal.azure.com) and switch to the directory that contains your Azure AD B2C tenant.
1. Select **Azure AD B2C** in the left menu. Or, select **All services** and then search for and select **Azure AD B2C**.
1. Under **Manage**, select **Roles and administrators**.
1. Select the **User administrator** role.
1. Select **Add assignment**.
1. In the **Select** text box, enter the name of the application you registered earlier, for example, *managementapp1*. Select your application when it appears in the search results.
1. Select **Add**. It might take a few minutes to for the permissions to fully propagate.

Your Azure AD B2C application now has the additional permissions required to delete users or update their passwords in your B2C tenant.

## Next steps

Now that you've registered your management application and have granted it the required permissions, learn how to:

- [Manage users with Microsoft Graph](microsoft-graph-user-management.md)
- [Manage tenant resources with Microsoft Graph](microsoft-graph-tenant-management.md)
