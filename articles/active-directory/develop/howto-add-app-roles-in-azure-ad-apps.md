---
title: Add app roles and get them from a token | Azure
titleSuffix: Microsoft identity platform
description: Learn how to add app roles in an application registered in Azure Active Directory, assign users and groups to these roles and receive them in the `roles` claim in the token.
services: active-directory
author: kkrishna
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: how-to
ms.date: 09/24/2018
ms.author: kkrishna
ms.reviewer: kkrishna, jmprieur
ms.custom: aaddev
---

# How to: Add app roles in your application and receive them in the token

Role-based access control (RBAC) is a popular mechanism to enforce authorization in applications. When using RBAC, an administrator grants permissions to roles, and not to individual users or groups. The administrator can then assign roles to different users and groups to control who has access to what content and functionality.

Using RBAC with Application Roles and Role Claims, developers can securely enforce authorization in their apps with little effort on their part.

Another approach is to use Azure AD Groups and Group Claims, as shown in [WebApp-GroupClaims-DotNet](https://github.com/Azure-Samples/WebApp-GroupClaims-DotNet). Azure AD Groups and Application Roles are by no means mutually exclusive; they can be used in tandem to provide even finer grained access control.

## Declare roles for an application

These application roles are defined in the [Azure portal](https://portal.azure.com) in the application's registration manifest.  When a user signs into the application, Azure AD emits a `roles` claim for each role that the user has been granted individually to the user and from their group membership.  Assignment of users and groups to roles can be done through the portal's UI, or programmatically using [Microsoft Graph](https://developer.microsoft.com/graph/docs/concepts/azuread-identity-access-management-concept-overview).

### Declare app roles using Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon in the portal toolbar.
1. In the **Favorites** or **All Directories** list, choose the Active Directory tenant where you wish to register your application.
1. In the Azure portal, search for and select **Azure Active Directory**.
1. In the  **Azure Active Directory** pane, select **App registrations** to view a list of all your applications.
1. Select the application you want to define app roles in. Then select **Manifest**.
1. Edit the app manifest by locating the `appRoles` setting and adding all your Application Roles.

     > [!NOTE]
     > Each app role definition in this manifest must have a different valid GUID within the context of the manifest for the `id` property.
     >
     > The `value` property of each app role definition should exactly match the strings that are used in the code in the application. The `value` property can't contain spaces. If it does, you'll receive an error when you save the manifest.

1. Save the manifest.

### Examples

The following example shows the `appRoles` that you can assign to `users`.

> [!NOTE]
>The `id` must be a unique GUID.

```Json
"appId": "8763f1c4-f988-489c-a51e-158e9ef97d6a",
"appRoles": [
    {
      "allowedMemberTypes": [
        "User"
      ],
      "displayName": "Writer",
      "id": "d1c2ade8-98f8-45fd-aa4a-6d06b947c66f",
      "isEnabled": true,
      "description": "Writers Have the ability to create tasks.",
      "value": "Writer"
    }
  ],
"availableToOtherTenants": false,
```

> [!NOTE]
>The `displayName` cannot contain spaces.

You can define app roles to target `users`, `applications`, or both. When available to `applications`, app roles appear as application permissions in the **Required Permissions** blade. The following example shows an app role targeted towards an `Application`.

```Json
"appId": "8763f1c4-f988-489c-a51e-158e9ef97d6a",
"appRoles": [
    {
      "allowedMemberTypes": [
        "Application"
      ],
      "displayName": "ConsumerApps",
      "id": "47fbb575-859a-4941-89c9-0f7a6c30beac",
      "isEnabled": true,
      "description": "Consumer apps have access to the consumer data.",
      "value": "Consumer"
    }
  ],
"availableToOtherTenants": false,
```

The number of roles defined affects the limits that the application manifest has. They have been discussed in detail on the [manifest limits](https://docs.microsoft.com/azure/active-directory/develop/reference-app-manifest#manifest-limits) page.

### Assign users and groups to roles

Once you've added app roles in your application, you can assign users and groups to these roles.

1. In the **Azure Active Directory** pane, select **Enterprise applications** from the **Azure Active Directory** left-hand navigation menu.
1. Select **All applications** to view a list of all your applications.

     If you do not see the application you want show up here, use the various filters at the top of the **All applications** list to restrict the list or scroll down the list to locate your application.

1. Select the application in which you want to assign users or security group to roles.
1. Select the **Users and groups** pane in the application's left-hand navigation menu.
1. At the top of the **Users and groups** list, select the **Add user** button to open the **Add Assignment** pane.
1. Select the **Users and groups** selector from the **Add Assignment** pane.

     A list of users and security groups will be shown along with a textbox to search and locate a certain user or group. This screen allows you to select multiple users and groups in one go.

1. Once you are done selecting the users and groups, press the **Select** button on bottom to move to the next part.
1. Choose the **Select Role** selector from the **Add assignment** pane. All the roles declared earlier in the app manifest will show up.
1. Choose a role and press the **Select** button.
1. Press the **Assign** button on the bottom to finish the assignments of users and groups to the app.
1. Confirm that the users and groups you added are showing up in the updated **Users and groups** list.

## More information

- [Add authorization using app roles & roles claims to an ASP.NET Core web app](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/5-WebApp-AuthZ/5-1-Roles)
- [Using Security Groups and Application Roles in your apps (Video)](https://www.youtube.com/watch?v=V8VUPixLSiM)
- [Azure Active Directory, now with Group Claims and Application Roles](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Azure-Active-Directory-now-with-Group-Claims-and-Application/ba-p/243862)
- [Azure Active Directory app manifest](https://docs.microsoft.com/azure/active-directory/develop/reference-app-manifest)
- [AAD Access tokens](access-tokens.md)
- [AAD `id_tokens`](id-tokens.md)
