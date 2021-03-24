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
ms.date: 11/13/2020
ms.author: kkrishna
ms.reviewer: marsma, kkrishna, jmprieur
ms.custom: aaddev
---

# How to: Add app roles to your application and receive them in the token

Role-based access control (RBAC) is a popular mechanism to enforce authorization in applications. When using RBAC, an administrator grants permissions to roles, and not to individual users or groups. The administrator can then assign roles to different users and groups to control who has access to what content and functionality.

Using RBAC with Application Roles and Role Claims, developers can securely enforce authorization in their apps with less effort.

Another approach is to use Azure AD Groups and Group Claims as shown in the [active-directory-aspnetcore-webapp-openidconnect-v2](https://aka.ms/groupssample) code sample on GitHub. Azure AD Groups and Application Roles are not mutually exclusive; they can be used in tandem to provide even finer-grained access control.

## Declare roles for an application

You define app roles by using the [Azure portal](https://portal.azure.com). App roles are usually defined on an application registration representing a service, app or API. When a user signs in to the application, Azure AD emits a `roles` claim for each role that the user or service principal has been granted individually to the user and from their group membership. This can be used to implement claim-based authorization. App roles can be assigned [to a user or a group of users](../manage-apps/add-application-portal-assign-users.md#assign-users-to-an-app). App roles can also be assigned to the service principal for another application, or [to the service principal for a managed identity](../managed-identities-azure-resources/how-to-assign-app-role-managed-identity-powershell.md).

> [!IMPORTANT]
> Currently if you add a service principal to a group, and then assign an app role to that group, Azure AD does not add the `roles` claim to tokens it issues.

There are two ways to declare app roles by using the Azure portal:

* [App roles UI](#app-roles-ui--preview) | Preview
* [App manifest editor](#app-manifest-editor)

The number of roles you add counts toward application manifest limits enforced by Azure Active Directory. For information about these limits, see the  [Manifest limits](./reference-app-manifest.md#manifest-limits) section of [Azure Active Directory app manifest reference](reference-app-manifest.md).

### App roles UI | Preview

> [!IMPORTANT]
> The app roles portal UI feature [!INCLUDE [PREVIEW BOILERPLATE](../../../includes/active-directory-develop-preview.md)]

To create an app role by using the Azure portal's user interface:

1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>.
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
    | **Do you want to enable this app role?** | Specifies whether the app role is enabled. To delete an app role, deselect this checkbox and apply the change before attempting the delete operation. | *Checked* |

1. Select **Apply** to save your changes.

### App manifest editor

To add roles by editing the manifest directly:

1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>.
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

```json
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

```json
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

Once you've added app roles in your application, you can assign users and groups to the roles. Assignment of users and groups to roles can be done through the portal's UI, or programmatically using [Microsoft Graph](/graph/api/user-post-approleassignments). When the users assigned to the various app roles sign in to the application, their tokens will have their assigned roles in the `roles` claim.

To assign users and groups to roles by using the Azure portal:

1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>.
1. In **Azure Active Directory**, select **Enterprise applications** in the left-hand navigation menu.
1. Select **All applications** to view a list of all your applications. If your application doesn't appear in the list, use the filters at the top of the **All applications** list to restrict the list, or scroll down the list to locate your application.
1. Select the application in which you want to assign users or security group to roles.
1. Under **Manage**, select **Users and groups**.
1. Select **Add user** to open the **Add Assignment** pane.
1. Select the **Users and groups** selector from the **Add Assignment** pane. A list of users and security groups is displayed. You can search for a certain user or group as well as select multiple users and groups that appear in the list.
1. Once you've selected users and groups, select the **Select** button to proceed.
1. Select **Select a role** in the **Add assignment** pane. All the roles that you've defined for the application are displayed.
1. Choose a role and select the **Select** button.
1. Select the **Assign** button to finish the assignment of users and groups to the app.

Confirm that the users and groups you added appear in the **Users and groups** list.

## Assign app roles to applications

Once you've added app roles in your application, you can assign an app role to a client app by using the Azure portal or programmatically by using [Microsoft Graph](/graph/api/user-post-approleassignments).

When you assign app roles to an application, you create *application permissions*. Application permissions are typically used by daemon apps or back-end services that need to authenticate and make authorized API calls as themselves, without the interaction of a user.

To assign app roles to an application by using the Azure portal:

1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>.
1. In **Azure Active Directory**, select **App registrations** in the left-hand navigation menu.
1. Select **All applications** to view a list of all your applications. If your application doesn't appear in the list, use the filters at the top of the **All applications** list to restrict the list, or scroll down the list to locate your application.
1. Select the application to which you want to assign an app role.
1. Select **API permissions** > **Add a permission**.
1. Select the **My APIs** tab, and then select the app for which you defined app roles.
1. Select **Application permissions**.
1. Select the role(s) you want to assign.
1. Select the **Add permissions** button complete addition of the role(s).

The newly added roles should appear in your app registration's **API permissions** pane.

#### Grant admin consent

Because these are *application permissions*, not delegated permissions, an admin must grant consent to use the app roles assigned to the application.

1. In the app registration's **API permissions** pane, select **Grant admin consent for \<tenant name\>**.
1. Select **Yes** when prompted to grant consent for the requested permissions.

The **Status** column should reflect that consent has been **Granted for \<tenant name\>**.

## Use app roles in your web API

Once you've defined app roles and assigned them to a user, group, or application, your next step is to add code to your web API that checks for those roles when the API is called. That is, when a client app requests an API operation you've decided requires authorization, your API's code must verify the scopes are in the access token presented in the client app's call.

To learn how to add authorization to your web API, see [Protected web API: Verify scopes and app roles](scenario-protected-web-api-verification-scope-app-roles.md).

## App roles vs. groups

Though you can use app roles or groups for authorization, key differences between them can influence which you decide to use for your scenario.

| App roles                                                                          | Groups                                                      |
|------------------------------------------------------------------------------------|-------------------------------------------------------------|
| They are specific to an application and are defined in the app registration. They move with the application. | They are not specific to an app, but to an Azure AD tenant. |
| App roles are removed when their app registration is removed.                      | Groups remain intact even if the app is removed.            |
| Provided in the `roles` claim.                                                     | Provided in `groups` claim.                                 |

Developers can use app roles to control whether a user can sign in to an app or an app can obtain an access token for a web API. To extend this security control to groups, developers and admins can also assign security groups to app roles.

App roles are preferred by developers when they want to describe and control the parameters of authorization in their app themselves. For example, an app using groups for authorization will break in the next tenant as both the group ID and name could be different. An app using app roles remains safe. In fact, assigning groups to app roles is popular with SaaS apps for the same reasons.

## Next steps

Learn more about app roles with the following resources.

* Code samples on GitHub
  * [Add authorization using groups and group claims to an ASP.NET Core web app](https://aka.ms/groupssample)
  * [Angular single-page application (SPA) calling a .NET Core web API and using app roles and security groups](https://github.com/Azure-Samples/ms-identity-javascript-angular-spa-dotnetcore-webapi-roles-groups/blob/master/README.md)
* Reference documentation
  * [Azure AD app manifest](./reference-app-manifest.md)
  * [Azure AD access tokens](access-tokens.md)
  * [Azure AD ID tokens](id-tokens.md)
  * [Provide optional claims to your app](active-directory-optional-claims.md)
* Video: [Implement authorization in your applications with Microsoft identity platform](https://www.youtube.com/watch?v=LRoc-na27l0) (1:01:15)
