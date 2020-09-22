---
title: Add app roles and get them from a token | Azure
titleSuffix: Microsoft identity platform
description: Learn how to add app roles to an application registered in Azure Active Directory, assign users and groups to these roles, and receive them in the 'roles' claim in the token.
services: active-directory
author: kalyankrishna1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: how-to
ms.date: 09/15/2020
ms.author: kkrishna
ms.reviewer: kkrishna, jmprieur
ms.custom: aaddev
---

# How to: Add app roles in your application and receive them in the token

Role-based access control (RBAC) is a popular mechanism to enforce authorization in applications. When using RBAC, an administrator grants permissions to roles, and not to individual users or groups. The administrator can then assign roles to different users and groups to control who has access to what content and functionality.

Using RBAC with Application Roles and Role Claims, developers can securely enforce authorization in their apps with less effort on their part.

Another approach is to use Azure AD Groups and Group Claims, as shown in the [WebApp-GroupClaims-DotNet](https://github.com/Azure-Samples/WebApp-GroupClaims-DotNet) code sample on GitHub. Azure AD Groups and Application Roles are not mutually exclusive; they can be used in tandem to provide even finer grained access control.

## Declare roles for an application

Application roles are defined in the [Azure portal](https://portal.azure.com).  When a user signs into the application, Azure AD emits a `roles` claim for each role that the user has been granted individually to the user and from their group membership.  Assignment of users and groups to roles can be done through the portal's UI, or programmatically using [Microsoft Graph](/graph/azuread-identity-access-management-concept-overview).

To create an app role:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in top menu, and then choose the Azure Active Directory tenant that contains the app registration to which you want to add an app role.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations**, and then select the application you want to define app roles in.
1. Select **App roles | Preview**, and then select **Create app role**.

   :::image type="content" source="media/howto-add-app-roles-in-azure-ad-apps/app-roles-overview-pane.png" alt-text="An app registration's app roles pane in the Azure portal":::
1. In the **Create app role** pane, enter the settings for the role. The table following the image describes each setting and their parameters.

    :::image type="content" source="media/howto-add-app-roles-in-azure-ad-apps/app-roles-create-context-pane.png" alt-text="An app registration's app roles create context pane in the Azure portal":::

    | Field | Description | Example |
    |-------|-------------|---------|
    | **Display name** | Display name for the app role that appears in the admin consent and app assignment experiences. This value may contain spaces.  | `Survey Writer` |
    | **Allowed member types** | Specifies whether this app role can be assigned to users, applications, or both. | `Users/Groups` |
    | **Value** | Specifies the value of the roles claim that the application should expect in the token. The value should exactly match the string referenced in the application's code. The value cannot contain spaces. | `Survey.Create` |
    | **Description** | A more detailed description of the app role displayed during admin app assignment and consent experiences. | `Writers can create surveys.` |
    | **Do you want to enable this app role?** | Whether the app role is enabled. To delete an app role, deselect this checkbox and apply the change before attempting the delete operation. | *Checked* |

1. Select **Apply** to save your changes.

> [!NOTE]
> The number of roles you add counts toward limits defined for an application manifest. For information about these limits, see the  [Manifest limits](./reference-app-manifest.md#manifest-limits) section of [Azure Active Directory app manifest reference](reference-app-manifest.md).

## Assign users and groups to roles

Once you've added app roles in your application, you can assign users and groups to the roles.

1. In **Azure Active Directory** in the Azure portal, select **Enterprise applications** in the left-hand navigation menu.
1. Select **All applications** to view a list of all your applications.

     If your application doesn't appear in the list, use the filters at the top of the **All applications** list to restrict the list, or scroll down the list to locate your application.

1. Select the application in which you want to assign users or security group to roles.
1. Under **Manage**, select **Users and groups**.
1. Select **Add user** to open the **Add Assignment** pane.
1. Select the **Users and groups** selector from the **Add Assignment** pane.

     A list of users and security groups is displayed. You can search for a certain user or group as well as select multiple users and groups that appear in the list.

1. Once you've selected users and groups, select the **Select** button to proceed.
1. Select **Select Role** in the **Add assignment** pane. All the roles that you've defined for the application are displayed.
1. Choose a role and select the **Select** button.
1. Select the **Assign** button to finish the assignment of users and groups to the app.
1. Confirm that the users and groups you added are appear in the **Users and groups** list.

## Receive roles in tokens

When the users assigned to the various app roles sign in to the application, their tokens will have their assigned roles in the `roles` claim.

## Web API application permissions

You can define app roles that target **Users/Groups**, **Applications**, or **Both**. When you select **Applications** or **Both**, the app role appears as an application permission in a client app's **API permissions**.

To select the application permission in a client app registration after you've defined a role that targets **Applications** or **Both**:

1. In **Azure Active Directory** in the Azure portal, select **App registrations**, and then select the client app's registration.
1. Under **Manage**, select **API permissions**.
1. Select **Add a permission** > **My APIs**.
1. Select the app to which you added the application role, and then select **Application permissions**.

## Next steps

Learn more about app roles with the following resources:

- Code sample: [Add authorization using app roles & roles claims to an ASP.NET Core web app](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/5-WebApp-AuthZ/5-1-Roles) (GitHub)
- Video: [Implement authorization in your applications with Microsoft identity platform ](https://www.youtube.com/watch?v=LRoc-na27l0) (1:01:15)
- [Azure Active Directory app manifest](./reference-app-manifest.md)
- [Azure AD Access tokens](access-tokens.md)
- [Azure AD `id_tokens`](id-tokens.md)
