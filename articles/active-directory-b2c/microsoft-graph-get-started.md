---
title: Register a Microsoft Graph application
titleSuffix: Azure AD B2C
description: Prepare for managing Azure AD B2C resources with Microsoft Graph by registering an application that's granted the required Graph API permissions.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: how-to
ms.date: 06/24/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Register a Microsoft Graph application

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

Azure AD B2C authentication service directly supports OAuth 2.0 client credentials grant flow (**currently in public preview**), but you can't use it to manage your Azure AD B2C resources via Microsoft Graph API. However, you can set up [client credential flow](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md) using Microsoft Entra ID and the Microsoft identity platform `/token` endpoint for an application in your Azure AD B2C tenant.

## Register management application

Before your scripts and applications can interact with the [Microsoft Graph API][ms-graph-api] to manage Azure AD B2C resources, you need to create an application registration in your Azure AD B2C tenant that grants the required API permissions.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *managementapp1*.
1. Select **Accounts in this organizational directory only**.
1. Under **Permissions**, clear the *Grant admin consent to openid and offline_access permissions* check box.
1. Select **Register**.
1. Record the **Application (client) ID** that appears on the application overview page. You use this value in a later step.

## Grant API access

For your application to access data in Microsoft Graph, grant the registered application the relevant [application permissions](/graph/permissions-reference). The effective permissions of your application are the full level of privileges implied by the permission. For example, to *create*, *read*, *update*, and *delete* every user in your Azure AD B2C tenant, add the **User.ReadWrite.All** permission. 

> [!NOTE]
> The **User.ReadWrite.All** permission does not include the ability update user account passwords. If your application needs to update user account passwords, [grant user administrator role](#optional-grant-user-administrator-role). When granting [user administrator](../active-directory/roles/permissions-reference.md#user-administrator) role, the **User.ReadWrite.All** is not required. The user administrator role includes everything needed to manage users.

You can grant your application multiple application permissions. For example, if your application also needs to manage groups in your Azure AD B2C tenant, add the **Group.ReadWrite.All** permission as well. 

[!INCLUDE [active-directory-b2c-permissions-directory](../../includes/active-directory-b2c-permissions-directory.md)]


## [Optional] Grant user administrator role

If your application or script needs to update users' passwords, you need to assign the *User administrator* role to your application. The [User administrator](../active-directory/roles/permissions-reference.md#user-administrator) role has a fixed set of permissions you grant to your application. 

To add the *User administrator* role, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. Search for and select **Azure AD B2C**.
1. Under **Manage**, select **Roles and administrators**.
1. Select the **User administrator** role. 
1. Select **Add assignments**.
1. In the **Select** text box, enter the name or the ID of the application you registered earlier, for example, *managementapp1*. When it appears in the search results, select your application.
1. Select **Add**. It might take a few minutes to for the permissions to fully propagate.

## Create client secret

Your application needs a client secret to prove its identity when requesting a token. To add the client secret, follow these steps:

[!INCLUDE [active-directory-b2c-client-secret](../../includes/active-directory-b2c-client-secret.md)]


## Next steps

Now that you've registered your management application and have granted it the required permissions, your applications and services (for example, Azure Pipelines) can use its credentials and permissions to interact with the Microsoft Graph API. 

* [Get an access token from Microsoft Entra ID](/graph/auth-v2-service#4-get-an-access-token)
* [Use the access token to call Microsoft Graph](/graph/auth-v2-service#4-get-an-access-token)
* [B2C operations supported by Microsoft Graph](microsoft-graph-operations.md)
* [Manage Azure AD B2C user accounts with Microsoft Graph](microsoft-graph-operations.md)
* [Get audit logs with the Microsoft Entra reporting API](view-audit-logs.md#get-audit-logs-with-the-azure-ad-reporting-api)

<!-- LINKS -->
[ms-graph]: /graph/
[ms-graph-api]: /graph/api/overview
