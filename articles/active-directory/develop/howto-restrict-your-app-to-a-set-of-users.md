---
title: Restrict Azure AD app to a set of users
description: Learn how to restrict access to your apps registered in Azure AD to a selected set of users.
services: active-directory
author: kalyankrishna1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: how-to
ms.date: 10/18/2021
ms.author: kkrishna
ms.reviewer: jmprieur
ms.custom: aaddev
#Customer intent: As a tenant administrator, I want to restrict an application that I have registered in Azuren-e AD to a select set of users available in my Azure AD tenant
---

# Restrict your Azure AD app to a set of users in an Azure AD tenant

Applications registered in an Azure Active Directory (Azure AD) tenant are, by default, available to all users of the tenant who authenticate successfully.

Similarly, in a [multi-tenant](howto-convert-app-to-be-multi-tenant.md) application, all users in the Azure AD tenant where the application is provisioned can access the application once they successfully authenticate in their respective tenant.

Tenant administrators and developers often have requirements where an application must be restricted to a certain set of users. There are two ways to restrict an application to a certain set of users or security groups:

- Developers can use popular authorization patterns like [Azure role-based access control (Azure RBAC)](howto-implement-rbac-for-apps.md).
- Tenant administrators and developers can use built-in feature of Azure AD.

## Supported app configurations

The option to restrict an app to a specific set of users or security groups in a tenant works with the following types of applications:

- Applications configured for federated single sign-on with SAML-based authentication.
- Application proxy applications that use Azure AD pre-authentication.
- Applications built directly on the Azure AD application platform that use OAuth 2.0/OpenID Connect authentication after a user or admin has consented to that application.

## Update the app to require user assignment

To update an application to require user assignment, you must be owner of the application under Enterprise apps, or be assigned one of **Global administrator**, **Application administrator**, or **Cloud application administrator** directory roles.

1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>.
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="./media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch the tenant in which you want to register an application.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **Enterprise Applications** > **All applications**.
1. Select the application you want to configure to require assignment. Use the filters at the top of the window to search for a specific application.
1. On the application's **Overview** page, under **Manage**, select **Properties**.
1. Locate the setting **User assignment required?** and set it to **Yes**. When this option is set to **Yes**, users and services attempting to access the application or services must first be assigned for this application, or they won't be able to sign-in or obtain an access token.
1. Select **Save**.

When an application requires assignment, user consent for that application isn't allowed. This is true even if users consent for that app would have otherwise been allowed. Be sure to [grant tenant-wide admin consent](../manage-apps/grant-admin-consent.md) to apps that require assignment.

## Assign the app to users and groups

Once you've configured your app to enable user assignment, you can go ahead and assign the app to users and groups.

1. Under **Manage**, select the **Users and groups** > **Add user/group** .
1. Select the **Users** selector.

   A list of users and security groups will be shown along with a textbox to search and locate a certain user or group. This screen allows you to select multiple users and groups in one go.

1. Once you're done selecting the users and groups, select **Select**.
1. (Optional) If you have defined app roles in your application, you can use the **Select role** option to assign the app role to the selected users and groups.
1. Select **Assign** to complete the assignments of the app to the users and groups.
1. Confirm that the users and groups you added are showing up in the updated **Users and groups** list.

## More information

For more information about roles and security groups, see:

- [How to: Add app roles in your application](./howto-add-app-roles-in-azure-ad-apps.md)
- [Using Security Groups and Application Roles in your apps (Video)](https://www.youtube.com/watch?v=LRoc-na27l0)
- [Azure Active Directory app manifest](./reference-app-manifest.md)
