---
title: What is Azure AD entitlement management? (Preview) - Azure Active Directory
description: Get an overview of Azure Active Directory entitlement management and how you can use it to manage access to groups, applications, and SharePoint Online sites for internal and external users.
services: active-directory
documentationCenter: ''
author: msaburnley
manager: daveba
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 09/03/2019
ms.author: ajburnle
ms.reviewer: mwahl
ms.collection: M365-identity-device-management


#Customer intent: As a administrator, I want learn about entitlement management so that see if I can use it to manage access to resources in my organization.

---
# What is Azure AD entitlement management? (Preview)

> [!IMPORTANT]
> Azure Active Directory (Azure AD) entitlement management is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Employees in organizations need access to various groups, applications, and sites to perform their job. Managing this access is challenging. In most cases, there is no organized list of all the resources a user needs for a project. The project manager has a good understanding of the resources needed, the individuals involved, and how long the project will last. However, the project manager typically does not have permissions to approve or grant access to others. This scenario gets more complicated when you try to work with external individuals or companies.

Azure Active Directory (Azure AD) entitlement management can help you manage access to groups, applications, and SharePoint Online sites for internal users and also users outside your organization.

This video provides an overview of entitlement management and its business value:

>[!VIDEO https://www.youtube.com/embed/_Lss6bFrnQ8]

## Why use entitlement management?

Enterprise organizations often face challenges when managing access to resources such as:

- Users may not know what access they should have
- Users may have difficulty locating the right individuals or right resources
- Once users find and receive access to a resource, they may hold on to access longer than is required for business purposes

These problems are compounded for users who need access from another directory, such as external users that are from supply chain organizations or other business partners. For example:

- Organizations may not know all of the specific individuals in other directories to be able to invite them
- Even if organizations were able to invite these users, organizations may not remember to manage all of the user's access consistently

Azure AD entitlement management can help address these challenges.

## What can I do with entitlement management?

Here are some of capabilities of entitlement management:

- Create packages of related resources that users can request
- Define rules for how to request resources and when access expires
- Govern the lifecycle of access for both internal and external users
- Delegate management of resources
- Designate approvers to approve requests
- Create reports to track history

For an overview of Identity Governance and entitlement management, watch the following video from the Ignite 2018 conference:

>[!VIDEO https://www.youtube.com/embed/aY7A0Br8u5M]

## What resources can I manage?

Here are the types of resources you can manage access to with entitlement management:

- Azure AD security groups
- Office 365 Groups
- Azure AD enterprise applications, including SaaS application and custom-integrated applications that support federation or provisioning
- SharePoint Online site collections and sites

You can also control access to other resources that rely upon Azure AD security groups or Office 365 Groups.  For example:

- You can give users licenses for Microsoft Office 365 by using an Azure AD security group in an access package and configuring [group-based licensing](../users-groups-roles/licensing-groups-assign.md) for that group
- You can give users access to manage Azure resources by using an Azure AD security group in an access package and creating an [Azure role assignment](../../role-based-access-control/role-assignments-portal.md) for that group

## What are access packages and policies?

Entitlement management introduces the concept of an *access package*. An access package is a bundle of all the resources a user needs to work on a project or perform their job. The resources include access to groups, applications, or sites. Access packages are used to govern access for your internal employees, and also users outside your organization. Access packages are defined in containers called *catalogs*.

Access packages also include one or more *policies*. A policy defines the rules or guardrails to access an access package. Enabling a policy enforces that only the right users are granted access, to the right resources, and for the right amount of time.

![Access package and policies](./media/entitlement-management-overview/elm-overview-access-package.png)

With an access package and its policies, the access package manager defines:

- Resources
- Roles the users need for the resources
- Internal users and partner organizations of external users that are eligible to request access
- Approval process and the users that can approve or deny access
- Duration of user's access

The following diagram shows an example of the different elements in entitlement management. It shows two example access packages.

- **Access package 1** includes a single group as a resource. Access is defined with a policy that enables a set of users in the directory to request access.
- **Access package 2** includes a group, an application, and a SharePoint Online site as resources. Access is defined with two different policies. The first policy enables a set of users in the directory to request access. The second policy enables users in an external directory to request access.

![Entitlement management overview](./media/entitlement-management-overview/elm-overview.png)

## Terminology

To better understand entitlement management and its documentation, you should review the following terms.

| Term or concept | Description |
| --- | --- |
| entitlement management | A service that assigns, revokes, and administers access packages. |
| access package | A bundle of resources that a team or project needs and is governed with policies. An access package is always contained in a catalog. |
| access request | A request to access the resources in an access package. A request typically goes through a workflow. |
| policy | A set of rules that defines the access lifecycle, such as how users get access, who can approve, and how long users have access. Example policies include employee access and external access. |
| catalog | A container of related resources and access packages. |
| General catalog | A built-in catalog that is always available. To add resources to the General catalog, requires certain permissions. |
| resource | An asset or service (such as an Office group, a security group, an application, or a SharePoint Online site) that a user can be granted permissions to. |
| resource type | The type of resource, which includes groups, applications, and SharePoint Online sites. |
| resource role | A collection of permissions associated with a resource. |
| resource directory | A directory that has one or more resources to share. |
| connected organization | An external Azure AD directory or domain that you have a relationship with. |
| assigned users | An assignment of an access package to a user, so that the user has all the resource roles of that access package. |
| enable | The process of making an access package available for users to request. |

## License requirements

[!INCLUDE [Azure AD Premium P2 license](../../../includes/active-directory-p2-license.md)]

Specialized clouds, such as Azure Government, Azure Germany, and Azure China 21Vianet, are not currently available for use in this preview.

### Which users must have licenses?

Your tenant must have at least as many Azure AD Premium P2 licenses as you have active member users. Active member users in entitlement management include:

- A user that initiates or approves a request for an access package.
- A user that has been assigned an access package. 
- A user that manages access packages.

As part of the licenses for member users, you can also allow a number of guest users to interact with entitlement management. For information about how to calculate the number of guest users you can include, see [Azure Active Directory B2B collaboration licensing guidance](../b2b/licensing-guidance.md).

For information about how to assign licenses to your users, see [Assign or remove licenses using the Azure Active Directory portal](../fundamentals/license-users-groups.md).

## Next steps

- [Tutorial: Create your first access package](entitlement-management-access-package-first.md)
- [Common scenarios](entitlement-management-scenarios.md)
