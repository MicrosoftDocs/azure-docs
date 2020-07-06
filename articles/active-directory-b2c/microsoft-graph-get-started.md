---
title: Manage resources with Microsoft Graph
titleSuffix: Azure AD B2C
description: Prepare for managing Azure AD B2C resources with Microsoft Graph by registering an application that's granted the required Graph API permissions.
services: B2C
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 02/14/2020
ms.author: mimart
ms.subservice: B2C
---

# Manage Azure AD B2C with Microsoft Graph

[Microsoft Graph][ms-graph] allows you to manage many of the resources within your Azure AD B2C tenant, including customer user accounts and custom policies. By writing scripts or applications that call the [Microsoft Graph API][ms-graph-api], you can automate tenant management tasks like:

* Migrate an existing user store to an Azure AD B2C tenant
* Deploy custom policies with an Azure Pipeline in Azure DevOps, and manage custom policy keys
* Host user registration on your own page, and create user accounts in your Azure AD B2C directory behind the scenes
* Automate application registration
* Obtain audit logs

The following sections help you prepare for using the Microsoft Graph API to automate the management of resources in your Azure AD B2C directory.

## Microsoft Graph API interaction modes

There are two modes of communication you can use when working with the Microsoft Graph API to manage resources in your Azure AD B2C tenant:

* **Interactive** - Appropriate for run-once tasks, you use an administrator account in the B2C tenant to perform the management tasks. This mode requires an administrator to sign in using their credentials before calling the Microsoft Graph API.

* **Automated** - For scheduled or continuously run tasks, this method uses a service account that you configure with the permissions required to perform management tasks. You create the "service account" in Azure AD B2C by registering an application that your applications and scripts use for authenticating using its *Application (Client) ID* and the **OAuth 2.0 client credentials** grant. In this case, the application acts as itself to call the Microsoft Graph API, not the administrator user as in the previously described interactive method.

You enable the **Automated** interaction scenario by creating an application registration shown in the following sections.

Although the OAuth 2.0 client credentials grant flow is not currently directly supported by the Azure AD B2C authentication service, you can set up client credential flow using Azure AD and the Microsoft identity platform /token endpoint for an application in your Azure AD B2C tenant. An Azure AD B2C tenant shares some functionality with Azure AD enterprise tenants.

## Register management application

Before your scripts and applications can interact with the [Microsoft Graph API][ms-graph-api] to manage Azure AD B2C resources, you need to create an application registration in your Azure AD B2C tenant that grants the required API permissions.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *managementapp1*.
1. Select **Accounts in this organizational directory only**.
1. Under **Permissions**, clear the *Grant admin consent to openid and offline_access permissions* check box.
1. Select **Register**.
1. Record the **Application (client) ID** that appears on the application overview page. You use this value in a later step.

### Grant API access

Next, grant the registered application permissions to manipulate tenant resources through calls to the Microsoft Graph API.

[!INCLUDE [active-directory-b2c-permissions-directory](../../includes/active-directory-b2c-permissions-directory.md)]

### Create client secret

[!INCLUDE [active-directory-b2c-client-secret](../../includes/active-directory-b2c-client-secret.md)]

You now have an application that has permission to *create*, *read*, *update*, and *delete* users in your Azure AD B2C tenant. Continue to the next section to add *password update* permissions.

## Enable user delete and password update

The *Read and write directory data* permission does **NOT** include the ability delete users or update user account passwords.

If your application or script needs to delete users or update their passwords, assign the *User administrator* role to your application:

1. Sign in to the [Azure portal](https://portal.azure.com) and use the **Directory + Subscription** filter to switch to your Azure AD B2C tenant.
1. Search for and select **Azure AD B2C**.
1. Under **Manage**, select **Roles and administrators**.
1. Select the **User administrator** role.
1. Select **Add assignments**.
1. In the **Select** text box, enter the name of the application you registered earlier, for example, *managementapp1*. Select your application when it appears in the search results.
1. Select **Add**. It might take a few minutes to for the permissions to fully propagate.

## Next steps
Now that you've registered your management application and have granted it the required permissions, your applications and services (for example, Azure Pipelines) can use its credentials and permissions to interact with the Microsoft Graph API. 

* [Get an access token from Azure AD](https://docs.microsoft.com/graph/auth-v2-service#4-get-an-access-token)
* [Use the access token to call Microsoft Graph](https://docs.microsoft.com/graph/auth-v2-service#4-get-an-access-token)
* [B2C operations supported by Microsoft Graph](microsoft-graph-operations.md)
* [Manage Azure AD B2C user accounts with Microsoft Graph](manage-user-accounts-graph-api.md)
* [Get audit logs with the Azure AD reporting API](view-audit-logs.md#get-audit-logs-with-the-azure-ad-reporting-api)

<!-- LINKS -->
[ms-graph]: https://docs.microsoft.com/graph/
[ms-graph-api]: https://docs.microsoft.com/graph/api/overview