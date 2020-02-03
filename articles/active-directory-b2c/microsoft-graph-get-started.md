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
ms.date: 02/08/2020
ms.author: marsma
ms.subservice: B2C
---

# Manage Azure AD B2C with Microsoft Graph

Before your scripts and applications can interact with the [Microsoft Graph](https://docs.microsoft.com/graph/) API to manage Azure AD B2C resources, you need to create an application registration in your Azure AD B2C tenant that grants the required API permissions.

You might need to migrate an existing user store to a B2C tenant. Or perhaps you want to host user registration on your own page, and create user accounts in your Azure AD B2C directory behind the scenes. If you use custom policies, you might want to include them in a CI/CD pipeline for testing and validation, or you might want to automate the provisioning of new Azure AD B2C tenants. These kinds of tasks require the ability to create, read, update, and delete Azure AD B2C resources by using a script or application instead of the Azure portal, often in an automated or otherwise unattended manner.

The following sections walk you through setting up the application registration that your management scripts and applications can use to interact with Azure AD B2C resources.

## Microsoft Graph API interaction modes

There are two modes of communication you can use when working with the Microsoft Graph API to manage resources in your Azure AD B2C tenant:

- **Interactive** - Appropriate for run-once tasks, you use an administrator account in the B2C tenant to perform the management tasks. This mode requires an administrator to sign in using their credentials before calling the Microsoft Graph API.

- **Automated**  - For scheduled or continuously run tasks, this method uses a service account that you configure with the permissions required to perform management tasks. You create the "service account" in Azure AD B2C by registering an application that your applications and scripts use for authenticating using its *Application (Client) ID* and the OAuth 2.0 client credentials grant. In this case, the application acts as itself to call the Microsoft Graph API, not the administrator user as in the previously described interactive method.

Both modes are supported by an application registration that you create in Azure AD B2C.

## Register management application

To prepare for using the Microsoft Graph API to manage resources in your B2C tenant, first create the application registration that your scripts and applications can use to access tenant resources.

[!INCLUDE [active-directory-b2c-appreg-mgmt](../../includes/active-directory-b2c-appreg-mgmt.md)]

### Grant API access

Next, grant the registered application permissions to manipulate tenant resources through calls to the Microsoft Graph API.

[!INCLUDE [active-directory-b2c-permissions-directory](../../includes/active-directory-b2c-permissions-directory.md)]

In addition to the **Directory.ReadWrite.All** permission, several others are commonly used by management applications:

### Create client secret

[!INCLUDE [active-directory-b2c-client-secret](../../includes/active-directory-b2c-client-secret.md)]

You now have an application that has permission to *create*, *read*, *update*, and *delete* users in your Azure AD B2C tenant. Continue to the next section to add *password update* permissions.

## Add password update permissions

The *Read and write directory data* permission that you granted earlier does **NOT** include the ability to update their passwords.

If you want your application or script to update user's passwords, grant it the *User administrator* role:

1. Sign in to the [Azure portal](https://portal.azure.com) and use the **Directory + Subscription** filter to switch to your Azure AD B2C tenant.
1. Search for and select **Azure AD B2C**.
1. Under **Manage**, select **Roles and administrators**.
1. Select the **User administrator** role.
1. Select **Add assignment**.
1. In the **Select** text box, enter the name of the application you registered earlier, for example, *managementapp1*. Select your application when it appears in the search results.
1. Select **Add**. It might take a few minutes to for the permissions to fully propagate.

Your Azure AD B2C application now has the permissions required to update their passwords in your B2C tenant.

## Next steps

Now that you've registered your management application and have granted it the required permissions, learn how to:

- [Manage users with Microsoft Graph](microsoft-graph-user-management.md)
- [Manage tenant resources with Microsoft Graph](microsoft-graph-tenant-management.md)
