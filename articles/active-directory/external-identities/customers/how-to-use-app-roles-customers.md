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
ms.date: 06/13/2023
ms.author: mimart
ms.custom: it-pro
---

# Using role-based access control for applications

Role-based access control (RBAC) is a popular mechanism to enforce authorization in applications. When an organization uses RBAC, an application developer defines roles for the application. An administrator can then assign roles to different users and groups to control who has access to content and functionality in the application.

Applications typically receive user role information as claims in a security token. Developers have the flexibility to provide their own implementation for how role claims are to be interpreted as application permissions. This interpretation of permissions can involve using middleware or other options provided by the platform of the applications or related libraries.

## App roles

Microsoft Entra ID for customers allows you to define application roles for your application and assign those roles to users and groups. The roles you assign to a user or group define their level of access to the resources and operations in your application.

When Microsoft Entra ID for customers issues a security token for an authenticated user, it includes the names of the roles you've assigned the user or group in the security token's roles claim. An application that receives that security token in a request can then make authorization decisions based on the values in the roles claim.

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

## Create a security group

[!INCLUDE [ciam-security-group](./includes/access-control/add-security-group.md)]

Microsoft Entra ID for customers can include a user's group membership information in tokens for use within applications. You learn how to add the group claim to tokens in [Assign users and groups to roles](#assign-users-and-groups-to-roles) section.

## Declare roles for an application

[!INCLUDE [ciam-declare-roles](./includes/access-control/declare-app-roles.md)]

### Assign users and groups to roles

[!INCLUDE [ciam-assign-user-and-groups-to-roles](./includes/access-control/assign-users-groups-roles.md)]

To test your application, sign out and sign in again with the user you assigned the roles. Inspect the security token to make sure that it contains the user's role. 

## Add group claims to security tokens

[!INCLUDE [ciam-add-group-claim-to-token](./includes/access-control/add-group-claim-in-token.md)]

### Add members to a group

[!INCLUDE [ciam-add-member-to-group](./includes/access-control/add-member-to-group.md)]

To test your application, sign out, and then sign in again with the user you added to the security group. Inspect the security token to make sure that it contains the user's group membership. 

## Groups and application roles support

A customer tenant follows the Microsoft Entra user and group management model and application assignment. Many of the core Microsoft Entra features are being phased into customer tenants.

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

## Next steps

- Learn how to [Use role-based access control in your web application](how-to-web-app-role-based-access-control.md).
