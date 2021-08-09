---
title: Custom role-based access control (RBAC) for application developers - Microsoft identity platform
description: Learn about what custom RBAC is and why it's important to implement in your applications.
services: active-directory
author: Chrispine-Chiedo
manager: CelesteDG
 
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity 
ms.date: 06/28/2021
ms.custom: template-concept
ms.author: cchiedo
ms.reviewer: john.garland, maggie.marxen, ian.bennett, marsma

#Customer intent: As a developer, I want to learn about custom RBAC and why I need to use it in my application.
---

# Role-based access control for application developers

Role-based access control (RBAC) allows certain users or groups to have specific permissions regarding which resources they have access to, what they can do with those resources, and who manages which resources. This article explains application-specific role-based access control.

> [!NOTE]
> Application role-based access control differs from [Azure role-based access control](../../role-based-access-control/overview.md) and [Azure AD role-based access control](../roles/custom-overview.md#understand-azure-ad-role-based-access-control). Azure custom roles and built-in roles are both part of Azure RBAC, which helps you manage Azure resources. Azure AD RBAC allows you to manage Azure AD resources.



## What are roles?

Role-based access control (RBAC) is a popular mechanism to enforce authorization in applications. When using RBAC, an application developer defines roles rather than authorizing individual users or groups. An administrator can then assign roles to different users and groups to control who has access to what content and functionality.

RBAC helps you, as an app developer, manage resources and what users can do with those resources. RBAC also allows an app developer to control what areas of an app users have access to. While admins can control which users have access to an app using the *User assignment required* property, developers need to account for specific users within the app and what users can do within the app.

As an app developer, you need to first create a role definition within the app’s registration section in the Azure AD admin center. The role definition includes a value that is returned for users who are assigned to that role. A developer can then use this value to implement application logic to determine what those users can or can't do in an application.

## Options for adding RBAC to apps

There are several considerations that must be managed when including role-based access control authorization in an application. These include:
- Defining the roles that are required by an application’s authorization needs. 
- Applying, storing, and retrieving the pertinent roles for authenticated users. 
- Affecting the desired application behavior based on the roles assigned to the current user. 

Once you define the roles, the Microsoft identity platform supports several different solutions that can be used to apply, store, and retrieve role information for authenticated users. These solutions include app roles, Azure AD groups, and the use of custom datastores for user role information.

Developers have the flexibility to provide their own implementation for how role assignments are to be interpreted as application permissions. This can involve leveraging middleware or other functionality provided by their applications’ platform or related libraries. Apps will typically receive user role information as claims and will decide user permissions based on those claims.

### App roles

Azure AD supports declaring app roles for an application registration. When a user signs into an application, Azure AD will include a [roles claim](./access-tokens.md#payload-claims) for each role that the user has been granted for that application. Applications that receive tokens that contain these claims can then use this information to determine what permissions the user may exercise based on the roles they're assigned.

### Groups

Developers can also use [Azure AD groups](../fundamentals/active-directory-manage-groups.md) to implement RBAC in their applications, where the users’ memberships in specific groups are interpreted as their role memberships. When using Azure AD groups, Azure AD will include a [groups claim](./access-tokens.md#payload-claims) that will include the identifiers of all of the groups to which the user is assigned within the current Azure AD tenant. Applications that receive tokens that contain these claims can then use this information to determine what permissions the user may exercise based on the roles they're assigned.

> [!IMPORTANT]
> When working with groups, developers need to be aware of the concept of an [overage claim](./access-tokens.md#payload-claims). By default, if a user is a member of more than the overage limit (150 for SAML tokens, 200 for JWT tokens, 6 if using the implicit flow), Azure AD will not emit a groups claim in the token. Instead, it will include an “overage claim” in the token that indicates the token’s consumer will need to query the Graph API to retrieve the user’s group memberships. For more information about working with overage claims, see [Claims in access tokens](./access-tokens.md#claims-in-access-tokens). It is possible to only emit groups that are assigned to an application, though [group-based assignment](../manage-apps/assign-user-or-group-access-portal.md) does require Azure Active Directory Premium P1 or P2 edition.

### Custom data store

App roles and groups both store information about user assignments in the Azure AD directory. Another option for managing user role information that is available to developers is to maintain the information outside of the directory in a custom data store. For example, in a SQL Database, Azure Table storage or Azure Cosmos DB Table API.

Using custom storage allows developers extra customization and control over how to assign roles to users and how to represent them. However, the extra flexibility also introduces more responsibility. For example, there's no mechanism currently available to include this information in tokens returned from Azure AD. If developers maintain role information in a custom data store, they'll need to have the apps retrieve the roles. This is typically done using extensibility points defined in the middleware available to the platform that is being used to develop the application. Furthermore, developers are responsible for properly securing the custom data store.

> [!NOTE]
> Using [Azure AD B2C Custom policies](../../active-directory-b2c/custom-policy-overview.md) it is possible to interact with custom data stores and to include custom claims within a token.

## Choosing an approach

In general, app roles are the recommended solution. App roles provide the simplest programming model and are purpose made for RBAC implementations. However, specific application requirements may indicate that a different approach would be better solution.

Developers can use app roles to control whether a user can sign into an app, or an app can obtain an access token for a web API. App roles are preferred over Azure AD groups by developers when they want to describe and control the parameters of authorization in their app themselves. For example, an app using groups for authorization will break in the next tenant as both the group ID and name could be different. An app using app roles remains safe. In fact, assigning groups to app roles is popular with SaaS apps for the same reasons.

Although either app roles or groups can be used for authorization, key differences between them can influence which is the best solution for a given scenario.

|          |App Roles |Azure AD Groups |Custom Data Store|
|----------|-----------|------------|-----------------|
|**Programming model** |**Simplest**. They are specific to an application and are defined in the app registration. They move with the application.|**More complex**. Group IDs vary between tenants and overage claims may need to be considered. Groups aren't specific to an app, but to an Azure AD tenant.|**Most complex**. Developers must implement means by which role information is both stored and retrieved.|
|**Role values are static between Azure AD tenants**|Yes  |No |Depends on the implementation.|
|**Role values can be used in multiple applications**|No. Unless role configuration is duplicated in each app registration.|Yes |Yes |
|**Information stored within directory**|Yes  |Yes |No |
|**Information is delivered via tokens**|Yes (roles claim)  |Yes* (groups claim) |No. Retrieved at runtime via custom code. |
|**Lifetime**|Lives in app registration in directory. Removed when the app registration is removed.|Lives in directory. Remain intact even if the app registration is removed. |Lives in custom data store. Not tied to app registration.|


> [!NOTE]
> Yes* - In the case of an overage, *groups claims* may need to be retrieved at runtime.

## Next steps

- [How to add app roles to your application and receive them in the token](./howto-add-app-roles-in-azure-ad-apps.md).
- [Register an application with the Microsoft identity platform](./quickstart-register-app.md).
- [Azure Identity Management and access control security best practices](../../security/fundamentals/identity-management-best-practices.md).