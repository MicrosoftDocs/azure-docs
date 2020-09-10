---
title: Add app roles and get them from a token | Azure
titleSuffix: Microsoft identity platform
description: Learn how to add app roles in an application registered in Azure Active Directory, assign users and groups to these roles and receive them in the `roles` claim in the token.
services: active-directory
author: kalyankrishna1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: how-to
ms.date: 07/15/2020
ms.author: kkrishna
ms.reviewer: kkrishna, jmprieur
ms.custom: aaddev
---

# How to: Add app roles in your application and receive them in the token

Role-based access control (RBAC) is a popular mechanism to enforce authorization in applications. When using RBAC, an administrator grants permissions to roles, and not to individual users or groups. The administrator can then assign roles to different users and groups to control who has access to what content and functionality.

Using RBAC with Application Roles and Role Claims, developers can securely enforce authorization in their apps with little effort on their part.

Another approach is to use Azure AD Groups and Group Claims, as shown in [WebApp-GroupClaims-DotNet](https://github.com/Azure-Samples/WebApp-GroupClaims-DotNet). Azure AD Groups and Application Roles are by no means mutually exclusive; they can be used in tandem to provide even finer grained access control.

## Declare roles for an application

These application roles are defined in the [Azure portal](https://portal.azure.com) in the application's registration manifest.  When a user signs into the application, Azure AD emits a `roles` claim for each role that the user has been granted individually to the user and from their group membership.  Assignment of users and groups to roles can be done through the portal's UI, or programmatically using [Microsoft Graph](/graph/azuread-identity-access-management-concept-overview).

### Declare app roles using Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon in the portal toolbar.
1. In the **Favorites** or **All Directories** list, choose the Active Directory tenant where you wish to register your application.
1. In the Azure portal, search for and select **Azure Active Directory**.
1. In the  **Azure Active Directory** pane, select **App registrations** to view a list of all your applications.
1. Select the application you want to define app roles in. Select **App roles** > **Preview**, and then select **Create app role**.

   :::image type="content" source="media/howto-add-app-roles-in-azure-ad-apps/approles-overview-blade.png" alt-text="An app registration's app roles pane in the Azure portal":::
1. Fill in the appropriate values for each textbox. For descriptions and requirements for each field, see the following table.

   :::image type="content" source="media/howto-add-app-roles-in-azure-ad-apps/approles-create-contextpane.png" alt-text="An app registration's app roles create context pane in the Azure portal":::
1. Select **Apply** to save your changes.
  
  Use the following table to ensure the values match the requirements for each field.

  | Field | Description | Example |
  |-------|-------------|---------|
  | **Display name** | Display name for the app role that appears in the admin consent and app assignment experiences. This value may contain spaces.  | `Writer` |
  | **Allowed member type** | Specifies whether this app role can be assigned to users, applications or both. | `Users/Groups` |
  | **Value** | Specifies the value of the roles claim that the application should expect in the token. The value should exactly match the strings that are used in the application's code and cannot contain spaces. | `Survey.Create` |
  | **Description** | A more detailed description of the app role that will show up during admin app assignment and consent experiences. | `Writers can create surveys.` |
  | **Enabled** | Denotes if an app role is enabled. In order to delete an app role, this flag should be unchecked first before attempting to delete. | `Checked` |

>[!Note]
>You can define app roles to target `users`, `applications`, or both. When available to `applications`, app roles appear as application permissions under **Manage** section > **API permissions > Add a permission > My APIs > Choose an API > Application permissions**.
>
>The number of roles defined affects the limits that the application manifest has. They have been discussed in detail on the [manifest limits](./reference-app-manifest.md#manifest-limits) page.

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

### Receive roles in tokens

When the users assigned to the various app roles sign in to the application, their tokens will have their assigned roles in the `roles` claim.

## More information

- [Add authorization using app roles & roles claims to an ASP.NET Core web app](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/5-WebApp-AuthZ/5-1-Roles)
- [Implement authorization in your applications with Microsoft identity platform (Video)](https://www.youtube.com/watch?v=LRoc-na27l0)
- [Azure Active Directory, now with Group Claims and Application Roles](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Azure-Active-Directory-now-with-Group-Claims-and-Application/ba-p/243862)
- [Azure Active Directory app manifest](./reference-app-manifest.md)
- [Azure AD Access tokens](access-tokens.md)
- [Azure AD `id_tokens`](id-tokens.md)
