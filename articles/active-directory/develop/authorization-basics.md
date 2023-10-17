---
title: Authorization basics
description: Learn about the basics of authorization in the Microsoft identity platform.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity 
ms.date: 01/06/2023
ms.custom: template-concept
ms.author: davidmu
ms.reviewer: johngarland, mamarxen, ianbe
#Customer intent: As an application developer, I want to understand the basic concepts of authorization in the Microsoft identity platform.
---

# Authorization basics

**Authorization** (sometimes abbreviated as *AuthZ*) is used to set permissions that enable evaluation of access to resources or functionality. In contrast, **authentication** (sometimes abbreviated as *AuthN*) is focused on proving that an entity like a user or service is indeed who they claim to be.

Authorization can include specifying the functionality, resources, or data an entity is allowed to access. Authorization also specifies what can be done with the data. This authorization action is often referred to as *access control*.

Authentication and authorization are concepts that aren't limited to only users. Services or daemon applications are often built to make requests for resources as themselves rather than on behalf of a specific user. In this article, the term "entity" is used to refer to either a user or an application.

## Authorization approaches

There are several common approaches to handle authorization. [Role-based access control](./custom-rbac-for-developers.md) is currently the most common approach using Microsoft identity platform.

### Authentication as authorization

Possibly the simplest form of authorization is to grant or deny access based on whether the entity making a request has been authenticated. If the requestor can prove they're who they claim to be, they can access the protected resources or functionality.

### Access control lists

Authorization by using access control lists (ACLs) involves maintaining explicit lists of specific entities who do or don't have access to a resource or functionality. ACLs offer finer control over authentication-as-authorization but become difficult to manage as the number of entities increases.

### Role-based access control

Role-based access control (RBAC) is possibly the most common approach to enforcing authorization in applications. When using RBAC, roles are defined to describe the kinds of activities an entity may perform. An application developer grants access to roles rather than to individual entities. An administrator can then assign roles to different entities to control which ones have access to what resources and functionality.

In advanced RBAC implementations, roles may be mapped to collections of permissions, where a permission describes a granular action or activity that can be performed. Roles are then configured as combinations of permissions. Compute the overall permission set for an entity by combining the permissions granted to the various roles the entity is assigned. A good example of this approach is the RBAC implementation that governs access to resources in Azure subscriptions.

> [!NOTE]
> [Application RBAC](./custom-rbac-for-developers.md) differs from [Azure RBAC](/azure/role-based-access-control/overview) and [Microsoft Entra RBAC](../roles/custom-overview.md#understand-azure-ad-role-based-access-control). Azure custom roles and built-in roles are both part of Azure RBAC, which helps manage Azure resources. Microsoft Entra RBAC allows management of Microsoft Entra resources.

### Attribute-based access control

Attribute-based access control (ABAC) is a more fine-grained access control mechanism. In this approach, rules are applied to the entity, the resources being accessed, and the current environment. The rules determine the level of access to resources and functionality. An example might be only allowing users who are managers to access files identified with a metadata tag of "managers during working hours only" during the hours of 9AM - 5PM on working days. In this case, access is determined by examining the attribute (status as manager) of the user, the attribute (metadata tag on a file) of the resource, and also an environment attribute (the current time).

One advantage of ABAC is that more granular and dynamic access control can be achieved through rule and condition evaluations without the need to create large numbers of specific roles and RBAC assignments.

One method for achieving ABAC with Microsoft Entra ID is using [dynamic groups](../enterprise-users/groups-create-rule.md). Dynamic groups allow administrators to dynamically assign users to groups based on specific user attributes with desired values.  For example, an Authors group could be created where all users with the job title Author are dynamically assigned to the Authors group. Dynamic groups can be used in combination with RBAC for authorization where you map roles to groups and dynamically assign users to groups.

[Azure ABAC](/azure/role-based-access-control/conditions-overview) is an example of an ABAC solution that is available today. Azure ABAC builds on Azure RBAC by adding role assignment conditions based on attributes in the context of specific actions.

## Implementing authorization

Authorization logic is often implemented within the applications or solutions where access control is required. In many cases, application development platforms offer middleware or other API solutions that simplify the implementation of authorization. Examples include use of the [AuthorizeAttribute](/aspnet/core/security/authorization/simple?view=aspnetcore-5.0&preserve-view=true) in ASP.NET or [Route Guards](./scenario-spa-sign-in.md?tabs=angular2#sign-in-with-a-pop-up-window) in Angular.

For authorization approaches that rely on information about the authenticated entity, an application evaluates information exchanged during authentication. For example, by using the information that was provided within a [security token](./security-tokens.md). If you are planning on using information from tokens for authorization, we recommend following [this guidance on properly securing apps through claims validation](./claims-validation.md). in For information not contained in a security token, an application might make extra calls to external resources.

It's not strictly necessary for developers to embed authorization logic entirely within their applications. Instead, dedicated authorization services can be used to centralize authorization implementation and management.


## Next steps

- To learn about custom role-based access control implementation in applications, see [Role-based access control for application developers](./custom-rbac-for-developers.md).
- To learn about the process of registering your application so it can integrate with the Microsoft identity platform, see [Application model](./application-model.md).
- For an example of configuring simple authentication-based authorization, see [Configure your App Service or Azure Functions app to use Microsoft Entra login](/azure/app-service/configure-authentication-provider-aad).
- To learn about proper authorization using token claims, see [Secure applications and APIs by validating claims](./claims-validation.md)
