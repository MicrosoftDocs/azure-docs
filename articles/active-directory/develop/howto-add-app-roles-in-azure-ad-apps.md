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
ms.date: 10/21/2020
ms.author: kkrishna
ms.reviewer: kkrishna, jmprieur
ms.custom: aaddev
---

# How to: Add app roles to your application and receive them in the token

Role-based access control (RBAC) is a popular mechanism to enforce authorization in applications. When using RBAC, an administrator grants permissions to roles, and not to individual users or groups. The administrator can then assign roles to different users and groups to control who has access to what content and functionality.

Using RBAC with Application Roles and Role Claims, developers can securely enforce authorization in their apps with less effort.

Another approach is to use Azure AD Groups and Group Claims, as shown in the [WebApp-GroupClaims-DotNet](https://github.com/Azure-Samples/WebApp-GroupClaims-DotNet) code sample on GitHub. Azure AD Groups and Application Roles are not mutually exclusive; they can be used in tandem to provide even finer-grained access control.

## Declare roles for an application

You define app roles by using the [Azure portal](https://portal.azure.com). When a user signs in to the application, Azure AD emits a `roles` claim for each role that the user has been granted individually to the user and from their group membership.

There are two ways to declare app roles by using the the Azure portal:

* [App roles UI](#app-roles-ui--preview) | Preview
* [App manifest editor](#app-manifest-editor)

The number of roles you add counts toward limits defined for an application manifest. For information about these limits, see the  [Manifest limits](./reference-app-manifest.md#manifest-limits) section of [Azure Active Directory app manifest reference](reference-app-manifest.md).

### App roles UI | Preview

> [!IMPORTANT]
> This preview feature is provided without a service level agreement and is not recommended for production workloads. Certain functionality might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To create an app role by using the Azure portal's user interface:

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
    | **Display name** | Display name for the app role that appears in the admin consent and app assignment experiences. This value may contain spaces. | `Survey Writer` |
    | **Allowed member types** | Specifies whether this app role can be assigned to users, applications, or both.<br/><br/>When available to `applications`, app roles appear as application permissions in an app registration's **Manage** section > **API permissions > Add a permission > My APIs > Choose an API > Application permissions**. | `Users/Groups` |
    | **Value** | Specifies the value of the roles claim that the application should expect in the token. The value should exactly match the string referenced in the application's code. The value cannot contain spaces. | `Survey.Create` |
    | **Description** | A more detailed description of the app role displayed during admin app assignment and consent experiences. | `Writers can create surveys.` |
    | **Do you want to enable this app role?** | Whether the app role is enabled. To delete an app role, deselect this checkbox and apply the change before attempting the delete operation. | *Checked* |

1. Select **Apply** to save your changes.

### App manifest editor

To add roles by editing the manifest directly:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in top menu, and then choose the Azure Active Directory tenant that contains the app registration to which you want to add an app role.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations**, and then select the application you want to define app roles in.
1. Again under **Manage**, select **Manifest**.
1. Edit the app manifest by locating the `appRoles` setting and adding your application roles. You can define app roles that target `users`, `applications`, or both. The following JSON snippets show examples of both.
1. Save the manifest.

Each app role definition in the manifest must have a unique GUID for its `id` value.

The `value` property of each app role definition should exactly match the strings that are used in the code in the application. The `value` property can't contain spaces. If it does, you'll receive an error when you save the manifest.

#### Example: User app role

This example defines an app role named `Writer` that you can assign to a `User`:

```Json
"appId": "8763f1c4-0000-0000-0000-158e9ef97d6a",
"appRoles": [
    {
      "allowedMemberTypes": [
        "User"
      ],
      "displayName": "Writer",
      "id": "d1c2ade8-0000-0000-0000-6d06b947c66f",
      "isEnabled": true,
      "description": "Writers Have the ability to create tasks.",
      "value": "Writer"
    }
  ],
"availableToOtherTenants": false,
```

#### Example: Application app role

When available to `applications`, app roles appear as application permissions in an app registration's **Manage** section > **API permissions > Add a permission > My APIs > Choose an API > Application permissions**.

This example shows an app role targeted to an `Application`:

```Json
"appId": "8763f1c4-0000-0000-0000-158e9ef97d6a",
"appRoles": [
    {
      "allowedMemberTypes": [
        "Application"
      ],
      "displayName": "ConsumerApps",
      "id": "47fbb575-0000-0000-0000-0f7a6c30beac",
      "isEnabled": true,
      "description": "Consumer apps have access to the consumer data.",
      "value": "Consumer"
    }
  ],
"availableToOtherTenants": false,
```


## Assign users and groups to roles

Once you've added app roles in your application, you can assign users and groups to the roles. Assignment of users and groups to roles can be done through the portal's UI, or programmatically using [Microsoft Graph](/graph/azuread-identity-access-management-concept-overview).

To assign users and groups to roles by using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In **Azure Active Directory**, select **Enterprise applications** in the left-hand navigation menu.
1. Select **All applications** to view a list of all your applications. If your application doesn't appear in the list, use the filters at the top of the **All applications** list to restrict the list, or scroll down the list to locate your application.
1. Select the application in which you want to assign users or security group to roles.
1. Under **Manage**, select **Users and groups**.
1. Select **Add user** to open the **Add Assignment** pane.
1. Select the **Users and groups** selector from the **Add Assignment** pane. A list of users and security groups is displayed. You can search for a certain user or group as well as select multiple users and groups that appear in the list.
1. Once you've selected users and groups, select the **Select** button to proceed.
1. Select **Select Role** in the **Add assignment** pane. All the roles that you've defined for the application are displayed.
1. Choose a role and select the **Select** button.
1. Select the **Assign** button to finish the assignment of users and groups to the app.
1. Confirm that the users and groups you added are appear in the **Users and groups** list.

## Receive roles in tokens

When the users assigned to the various app roles sign in to the application, their tokens will have their assigned roles in the `roles` claim.

> [!WARNING]
> TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO

## Next steps

Learn more about app roles with the following resources:

- Code sample: [Add authorization using app roles & roles claims to an ASP.NET Core web app](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/5-WebApp-AuthZ/5-1-Roles) (GitHub)
- Video: [Implement authorization in your applications with Microsoft identity platform ](https://www.youtube.com/watch?v=LRoc-na27l0) (1:01:15)
- [Azure Active Directory app manifest](./reference-app-manifest.md)
- [Azure AD Access tokens](access-tokens.md)
- [Azure AD `id_tokens`](id-tokens.md)
