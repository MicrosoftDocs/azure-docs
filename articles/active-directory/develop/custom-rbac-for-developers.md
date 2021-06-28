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

# Role-based access control for application developers.

Role-based access control (RBAC) allows certain users or groups to have specific permissions regarding which resources they have access to, what they can do with those resources, and who manages which resources. This article explains application-specific role-based access control.

> [!NOTE]
> Application role-based access control differs from [Azure role-based access control](azure/role-based-access-control/overview) and [Azure AD role-based access control](/azure/active-directory/roles/custom-overview#understand-azure-ad-role-based-access-control). Azure custom roles and built-in roles are both part of Azure RBAC, which helps you manage Azure resources. Azure AD RBAC allows you to manage Azure AD resources.



## What are roles?

Role-based access control (RBAC) is a popular mechanism to enforce authorization in applications. When using RBAC, an administrator grants permissions to ***roles***, and not to individual users or groups. The administrator can then assign roles to different users and groups to control who has access to what content and functionality.

RBAC helps you as an app developer manage resources, what areas of an app users have access to and what they can do with those resources. While admins can control which users have access to an app using the ***User assignment*** required property, developers need to account for specific users within the app and what users can do within the app.

As an app developer, you need to first create a role definition within the app’s registration section in the Azure AD admin center. A role definition is a collection of permissions, typically just called a role. A role definition lists the operations that can be performed, such as read, write, and delete. Azure includes several built-in roles that you can use. If the built-in roles don’t meet your specific needs, you can create your own Azure custom roles.


## Options for adding RBAC to apps

There are several considerations that must be managed when including role-based access control authorization in an application. These include:
- Defining the roles that are required by an application’s authorization needs. 
- Applying, storing, and retrieving the pertinent roles for authenticated users. 
- Affecting the desired application behavior based on the roles assigned to the current user. 

Once the roles are defined, the Microsoft identity platform supports several different solutions that can be used to apply, store, and retrieve role information for authenticated users. These include app roles, Azure AD groups, and the use of custom datastores for user role information.

Developers have the flexibility to provide their own implementation for the how role assignments are to be interpreted as application permissions. This can involve leveraging middleware or functionality provided by their applications’ platform and/or related libraries. Apps will typically receive user role information as claims and will decide user permissions based on those claims

### App roles

Azure AD supports declaring App roles for an application registration. When a user signs into an application, Azure AD will include a [roles claim](/azure/active-directory/develop/access-tokens#payload-claims) that includes the name of the role for each role that the user has been granted for that application. Applications that receive tokens containing these claims can then use this information to determine what permissions the user may perform based on the roles they are assigned.

### Groups

Developers can also use [Azure AD Groups](/azure/active-directory/fundamentals/active-directory-manage-groups) to implement RBAC in their applications, where the users’ memberships in specific groups are interpreted as their role memberships. When using Azure AD Groups, Azure AD will include a [groups claim](/azure/active-directory/develop/access-tokens#payload-claims) that will include the identifiers of all of the groups to which the user is assigned within the current Azure AD tenant. Applications that receive tokens containing these claims can then use this information to determine what permissions the user may perform based on the roles they are assigned.

> [!IMPORTANT]
> When working with groups, developers need to be aware of the concept of an [overage claim](/azure/active-directory/develop/access-tokens#payload-claims). By default, if a user is a member of more than the overage limit (150 for SAML tokens, 200 for JWT tokens, 6 if using the implicit flow), Azure AD will not emit a groups claim in the token. Instead, it will include an “overage claim” in the token that indicates the token’s consumer will need to query the Graph API to retrieve the user’s group memberships. For more information about working with overage claims, please see this link. It is possible to only emit groups that are assigned to an application, though group-based assignment does require Azure Active Directory Premium P1 or P2 edition.

Although either app roles or groups can be used for authorization, key differences between them can influence which is the best solution for a given scenario.

|App roles  |Groups   |
|----------|-----------|
| They are specific to an application and are defined in the app registration. They move with the application.|They are not specific to an app, but to an Azure AD tenant.|
|App roles are removed when their app registration is removed.|Groups remain intact even if the app is removed.|
|Provided in the roles claim.|Provided in groups claim.|
|Claim contains role names that are the same from tenant to tenant.|Claim contains group IDs that vary from tenant to tenant.|

Developers can use app roles to control whether a user can sign into an app, or an app can obtain an access token for a web API. To extend this security control to groups, developers and admins can also assign security groups to app roles.

App roles are preferred by developers when they want to describe and control the parameters of authorization in their app themselves. For example, an app using groups for authorization will break in the next tenant as both the group ID and name could be different. An app using app roles remains safe. In fact, assigning groups to app roles is popular with SaaS apps for the same reasons.

### Managing RBAC with a custom data store

App roles and groups both store information about user assignments in the Azure AD directory. Another option available to developers for managing user role information is to maintain the information outside of the directory in a custom data store, for example in a SQL Database or in Azure Storage (or Cosmos DB) Table Storage.

Using custom storage allows developers additional customization and control over how roles are assigned to users and how they are represented. However, there is no mechanism currently available to include this information in tokens returned from Azure AD. If developers maintain role information in a custom datastore, they will need to have the apps retrieve the roles. This is typically done using extensibility points defined in the middleware available to the platform that is being used to develop the application.

> [!NOTE]
> Using [Azure AD B2C Custom policies](azure/active-directory-b2c/custom-policy-overview) it is possible to interact with custom data stores and to include custom claims within a token.

## Choosing an approach

In general, app roles are the recommended solution. App roles provide the simplest programming model and are purpose made for RBAC implementations. However, specific application requirements may indicate that a different approach would be better solution.

## Next steps

- [How to add app roles to your application and receive them in the token](/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps).
- [Azure custom roles](/azure/role-based-access-control/custom-roles).
- [Azure Identity Management and access control security best practices](/azure/security/fundamentals/identity-management-best-practices).
