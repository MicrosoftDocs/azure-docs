---
title: Using role-based access control for apps
description: Learn how to define application roles for your customer-facing application and assign those roles to users and groups in customer tenants.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/09/2023
ms.author: mimart
ms.custom: it-pro
---

# Using role-based access control for applications

Role-based access control (RBAC) is a popular mechanism to enforce authorization in applications. When an organization uses RBAC, an application developer defines roles for the application. An administrator can then assign roles to different users and groups to control who has access to content and functionality in the application.

Applications typically receive user role information as claims in a security token. Developers have the flexibility to provide their own implementation for how role claims are to be interpreted as application permissions. This interpretation of permissions can involve using middleware or other options provided by the platform of the applications or related libraries.

## App roles

Azure AD for customers allows you to define application roles for your application and assign those roles to users and groups. The roles you assign to a user or group define their level of access to the resources and operations in your application.

When Azure AD for customers issues a security token for an authenticated user, it includes the names of the roles you've assigned the user or group in the security token's roles claim. An application that receives that security token in a request can then make authorization decisions based on the values in the roles claim.

## Groups

Developers can also use security groups to implement RBAC in their applications, where the memberships of the user in specific groups are interpreted as their role memberships. When an organization uses security groups, a groups claim is included in the token. The groups claim specifies the identifiers of all of the groups to which the user is assigned within the current customer tenant.

## App roles vs. groups

Though you can use app roles or groups for authorization, key differences between them can influence which you decide to use for your scenario.

| App roles| Groups|
| ----- | ----- |
| They're specific to an application and are defined in the app registration. | They aren't specific to an app, but to a customer tenant. |
| Can't be shared across applications.| Can be used in multiple applications.|
| App roles are removed when their app registration is removed.| Groups remain intact even if the app is removed.|
| Provided in the `roles` claim.| Provided in `groups` claim. |

## Declare roles for an application

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a Conditional Access Administrator, Security Administrator, or Global Administrator.
1. Make sure you're using the directory that contains your Azure AD customer tenant: Select the **Directories + subscriptions** icon for switching directories in the toolbar, and then find your customer tenant in the list. If it's not the current directory, select **Switch**.
1. In the left menu, under **Applications**, select **App registrations**, and then select the application you want to define app roles in.
1. Select **App roles**, and then select **Create app role**.
1. In the **Create app role** pane, enter the settings for the role. The following table describes each setting and its parameters.
    
   | Field    | Description | Example |
   | ----- | ----- | ----- |
   | **Display name** | Display name for the app role that appears in the app assignment experiences. This value may contain spaces. | `Orders manager`|
   | **Allowed member types**  | Specifies whether this app role can be assigned to users, applications, or both. | `Users/Groups`                |
   | **Value** | Specifies the value of the roles claim that the application should expect in the token. The value should exactly match the string referenced in the application's code. The value can't contain spaces.| `Orders.Manager`               |
   | **Description** | A more detailed description of the app role displayed during admin app assignment experiences. | `Manage online orders.` |
   | **Do you want to enable this app role?** | Specifies whether the app role is enabled. To delete an app role, deselect this checkbox and apply the change before attempting the delete operation.| _Checked_ |

1. Select **Apply** to create the application role.

### Assign users and groups to roles

Once you've added app roles in your application, administrator can assign users and groups to the roles. Assignment of users and groups to roles can be done through the admin center, or programmatically using [Microsoft Graph](/graph/api/user-post-approleassignments). When the users assigned to the various app roles sign in to the application, their tokens have their assigned roles in the `roles` claim.

To assign users and groups to application roles by using the Azure portal:

1. In the left menu, under **Applications**, select **Enterprise applications**.
1. Select **All applications** to view a list of all your applications. If your application doesn't appear in the list, use the filters at the top of the **All applications** list to restrict the list, or scroll down the list to locate your application.
1. Select the application in which you want to assign users or security group to roles.
1. Under **Manage**, select **Users and groups**.
1. Select **Add user** to open the **Add Assignment** pane.
1. In the **Add Assignment** pane, select **Users and groups**. A list of users and security groups appears. You can select multiple users and groups in the list.
1. Once you've selected users and groups, choose **Select**.
2. In the **Add assignment** pane, choose **Select a role**. All the roles you defined for the application appear.
3. Select a role, and then choose **Select**.
4. Select **Assign** to finish the assignment of users and groups to the app.
5. Confirm that the users and groups you added appear in the **Users and groups** list.
6. To test your application, sign out and sign in again with the user you assigned the roles.

## Add group claims to security tokens

To emit the group membership claims in security tokens, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a Conditional Access Administrator, Security Administrator, or Global Administrator.
1. Make sure you're using the directory that contains your Azure AD customer tenant: Select the **Directories + subscriptions** icon for switching directories in the toolbar, and then find your customer tenant in the list. If it's not the current directory, select **Switch**.
1. In the left menu, under **Applications**, select **App registrations**, and then select the application in which you want to add the groups claim.
1. Under **Manage**, select **Token configuration**.
2. Select **Add groups claim**.
3. Select **group types** to include in the security tokens.
4. For the **Customize token properties by type**, select **Group ID**.
5. Select **Add** to add the groups claim.

### Add members to a group

Now that you've added app groups claim in your application, add users to the security groups. If you don't have security group, [create one](../../fundamentals/how-to-manage-groups.md#create-a-basic-group-and-add-members).

1. In the left menu, select **Groups**, and then select **All groups**.
1. Select the group you want to manage.
1. Select  **Members**.
1. Select **+ Add members**.
1. Scroll through the list or enter a name in the search box. You can choose multiple names. When you're ready, choose **Select**.
2. The **Group Overview** page updates to show the number of members who are now added to the group.
3. To test your application, sign out, and then sign in again with the user you added to the security group.

## Groups and application roles support

A customer tenant follows the Azure AD user and group management model and application assignment. Many of the core Azure AD features are being phased into customer tenants.

The following table shows which features are currently available.

| **Feature** | **Currently available?** |
| ------------ | --------- |
| Create an application role for a resource | Yes, by modifying the application manifest |
| Assign an application role to users | Yes |
| Assign an application role to groups | Yes, via Microsoft Graph only |
| Assign an application role to applications | Yes, via application permissions |
| Assign a user to an application role | Yes |
| Assign an application to an application role (application permission) | Yes |
| Add a group to an application/service principal (groups claim) | Yes, via Microsoft Graph only |
| Create/update/delete a customer (local user) via the Microsoft Entra admin center | Yes |
| Reset a password for a customer (local user) via the Microsoft Entra admin center | Yes |
| Create/update/delete a customer (local user) via Microsoft Graph | Yes |
| Reset a password for a customer (local user) via Microsoft Graph | Yes, only if the service principal is added to the Global administrator role |
| Create/update/delete a security group via the Microsoft Entra admin center | Yes |
| Create/update/delete a security group via the Microsoft Graph API | Yes |
| Change security group members using the Microsoft Entra admin center | Yes |
| Change security group members using the Microsoft Graph API | Yes |
| Scale up to 50,000 users and 50,000 groups | Not currently available |
| Add 50,000 users to at least two groups | Not currently available |
