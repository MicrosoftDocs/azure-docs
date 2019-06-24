---
title: What is Azure AD entitlement management? (Preview) - Azure Active Directory
description: Get an overview of Azure Active Directory entitlement management and how you can use it to manage access to groups, applications, and SharePoint Online sites for internal and external users.
services: active-directory
documentationCenter: ''
author: rolyon
manager: mtillman
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 06/05/2019
ms.author: rolyon
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
- Office 365 groups
- Azure AD enterprise applications, including SaaS application and custom-integrated applications that support federation or provisioning
- SharePoint Online site collections and sites

You can also control access to other resources that rely upon Azure AD security groups or Office 365 groups.  For example:

- You can give users licenses for Microsoft Office 365 by using an Azure AD security group in an access package and configuring [group-based licensing](../users-groups-roles/licensing-groups-assign.md) for that group
- You can give users access to manage Azure resources by using an Azure AD security group in an access package and creating an [Azure role assignment](../../role-based-access-control/role-assignments-portal.md) for that group

## What are access packages and policies?

Entitlement management introduces the concept of an *access package*. An access package is a bundle of all the resources a user needs to work on a project or perform their job. The resources include access to groups, applications, or sites. Access packages are used to govern access for your internal employees, and also users outside your organization. Access packages are defined in containers called *catalogs*.

Access packages also include one or more *policies*. A policy defines the rules or guardrails to access an access package. Enabling a policy enforces that only the right users are granted access, to the right resources, and for the right amount of time.

![Access package and policies](./media/entitlement-management-overview/elm-overview-access-package.png)

With an access package and its policies, the access package manager defines:

- Resources
- Roles the users need for the resources
- Internal users and external users that are eligible to request access
- Approval process and the users that can approve or deny access
- Duration of user's access

The following diagram shows an example of the different elements in entitlement management. It shows two example access packages.

- **Access package 1** includes a single group as a resource. Access is defined with a policy that enables a set of users in the directory to request access.
- **Access package 2** includes a group, an application, and a SharePoint Online site as resources. Access is defined with two different policies. The first policy enables a set of users in the directory to request access. The second policy enables users in an external directory to request access.

![Entitlement management overview](./media/entitlement-management-overview/elm-overview.png)

## External users

When using the [Azure AD business-to-business (B2B)](../b2b/what-is-b2b.md) invite experience, you must already know the email addresses of the external guest users you want to bring into your resource directory and work with. This works great when you're working on a smaller or short-term project and you already know all the participants, but this is harder to manage if you have lots of users you want to work with or if the participants change over time.  For example, you might be working with another organization and have one point of contact with that organization, but over time additional users from that organization will also need access.

With entitlement management, you can define a policy that allows users from organizations you specify, that are also using Azure AD, to be able to request an access package. You can specify whether approval is required and an expiration date for the access. If approval is required, you can also designate as an approver one or more users from the external organization that you previously invited - since they are likely to know which external users from their organization need access. Once you have configured the access package, you can send a link to the access package to your contact person at the external organization. That contact can share with other users in the external organization, and they can use this link to request the access package.  Users from that organization who have already been invited into your directory can also use that link.

When a request is approved, entitlement management will provision the user with the necessary access, which may include inviting the user if they're not already in your directory. Azure AD will automatically create a B2B account for them.  Note that an administrator may have previously limited which organizations are permitted for collaboration, by setting a [B2B allow or deny list](../b2b/allow-deny-list.md) to allow or block invites to other organizations.  If the user is not permitted by the allow or block list, then they will not be invited.

Since you do not want the external user's access to last forever, you specify an expiration date in the policy, such as 180 days. After 180 days, if their access is not renewed, entitlement management will remove all access associated with that access package.  If the user who was invited through entitlement management has no other access package assignments, then when they lose their last assignment, their B2B account will be blocked from sign in for 30 days, and subsequently removed.  This prevents the proliferation of unnecessary accounts.  

## Terminology

To better understand entitlement management and its documentation, you should review the following terms.

| Term or concept | Description |
| --- | --- |
| entitlement management | A service that assigns, revokes, and administers access packages. |
| access package | A collection of permissions and policies to resources that users can request. An access package is always contained in a catalog. |
| access request | A request to access an access package. A request typically goes through a workflow. |
| policy | A set of rules that defines the access lifecycle, such as how users get access, who can approve, and how long users have access. Example policies include employee access and external access. |
| catalog | A container of related resources and access packages. |
| General catalog | A built-in catalog that is always available. To add resources to the General catalog, requires certain permissions. |
| resource | An asset or service (such as a group, application, or site) that a user can be granted permissions to. |
| resource type | The type of resource, which includes groups, applications, and SharePoint Online sites. |
| resource role | A collection of permissions associated with a resource. |
| resource directory | A directory that has one or more resources to share. |
| assigned users | An assignment of an access package to a user or group. |
| enable | The process of making an access package available for users to request. |

## License requirements

[!INCLUDE [Azure AD Premium P2 license](../../../includes/active-directory-p2-license.md)]

Specialized clouds, such as Azure Government, Azure Germany, and Azure China 21Vianet, are not currently available for use in this preview.

## Next steps

- [Tutorial: Create your first access package](entitlement-management-access-package-first.md)
- [Common scenarios](entitlement-management-scenarios.md)
