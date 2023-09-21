---
title: What is entitlement management?
description: Get an overview of entitlement management and how you can use it to manage access to groups, applications, and SharePoint Online sites for internal and external users.
services: active-directory
documentationCenter: ''
author: owinfreyatl
manager: amycolannino
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: overview
ms.subservice: compliance
ms.date: 05/31/2023
ms.author: owinfrey
ms.reviewer: markwahl-msft
ms.collection: M365-identity-device-management
ms.custom: contperf-fy21q1


#Customer intent: As a administrator, I want learn about entitlement management so that see how I can use it to manage access to resources in my organization.

---
# What is entitlement management?

Entitlement management is an [identity governance](identity-governance-overview.md) feature that  enables organizations to manage identity and access lifecycle at scale, by automating access request workflows, access assignments, reviews, and expiration.

Employees in organizations need access to various groups, applications, and SharePoint Online sites to perform their job. Managing this access is challenging, as requirements change. New applications are added or users need more access rights.  This scenario gets more complicated when you collaborate with outside organizations. You may not know who in the other organization needs access to your organization's resources, and they won't know what applications, groups, or sites your organization is using.

Entitlement management can help you more efficiently manage access to groups, applications, and SharePoint Online sites for internal users, and also for users outside your organization who need access to those resources.

## Why use entitlement management?

Enterprise organizations often face challenges when managing employee access to resources such as:

- Users may not know what access they should have, and even if they do, they may have difficulty locating the right individuals to approve their access
- Once users find and receive access to a resource, they may hold on to access longer than is required for business purposes

These problems are compounded for users who need access from another organization, such as external users that are from supply chain organizations or other business partners. For example:

- No one person may know all of the specific individuals in other organization's directories to be able to invite them
- Even if they were able to invite these users, no one in that organization may remember to manage all of the users' access consistently

Entitlement management can help address these challenges.  To learn more about how customers have been using entitlement management, you can read the [Mississippi Division of Medicaid](https://customers.microsoft.com/story/1509263251891323344-mississippi-medicaid-microsoft-security-solutions), [Storebrand](https://customers.microsoft.com/story/1540760473505561700-storebrand-banking-microsoft-security-solutions) and [Avanade](https://customers.microsoft.com/story/avanade-professional-services-azure-canada) case studies.  This video provides an overview of entitlement management and its value:

>[!VIDEO https://www.youtube.com/embed/_Lss6bFrnQ8]

## What can I do with entitlement management?

Here are some of capabilities of entitlement management:

- Control who can get access to applications, groups, Teams and SharePoint sites, with multi-stage approval, and ensure users don't retain access indefinitely through time-limited assignments and recurring access reviews.
- Give users access automatically to those resources, based on the user's properties like department or cost center, and remove a user's access when those properties change (preview).
- Delegate to non-administrators the ability to create access packages. These access packages contain resources that users can request, and the delegated access package managers can define policies with rules for which users can request, who must approve their access, and when access expires.
- Select connected organizations whose users can request access.  When a user who isn't yet in your directory requests access, and is approved, they're automatically invited into your directory and assigned access.  When their access expires, if they have no other access package assignments, their B2B account in your directory can be automatically removed.

>[!NOTE]
>If you are ready to try Entitlement management you can get started with our [tutorial to create your first access package](entitlement-management-access-package-first.md).

You can also read the [common scenarios](entitlement-management-scenarios.md), or watch videos, including

- [How to deploy entitlement management in your organization](https://www.youtube.com/watch?v=zaaKvaaYwI4)
- [How to monitor and scale your use of entitlement management](https://www.youtube.com/watch?v=omtNJ7ySjS0)
- [How to delegate in entitlement management](https://www.youtube.com/watch?v=Fmp1eBxzrqw)

## What are access packages and what resources can I manage with them?

Entitlement management introduces the concept of an *access package*. An access package is a bundle of all the resources with the access a user needs to work on a project or perform their task. Access packages are used to govern access for your internal employees, and also users outside your organization.

 Here are the types of resources you can manage user's access to, with entitlement management:

- Membership of Microsoft Entra security groups
- Membership of Microsoft 365 Groups and Teams
- Assignment to Microsoft Entra enterprise applications, including SaaS applications and custom-integrated applications that support federation/single sign-on and/or provisioning
- Membership of SharePoint Online sites

You can also control access to other resources that rely upon Microsoft Entra security groups or Microsoft 365 Groups.  For example:

- You can give users licenses for Microsoft 365 by using a Microsoft Entra security group in an access package and configuring [group-based licensing](../enterprise-users/licensing-groups-assign.md) for that group.
- You can give users access to manage Azure resources by using a Microsoft Entra security group in an access package and creating an [Azure role assignment](../../role-based-access-control/role-assignments-portal.md) for that group.
- You can give users access to manage Microsoft Entra roles by using groups assignable to Microsoft Entra roles in an access package and [assigning a Microsoft Entra role to that group](../roles/groups-assign-role.md).

## How do I control who gets access?

With an access package, an administrator or delegated access package manager lists the resources (groups, apps, and sites), and the roles the users need for those resources.

Access packages also include one or more *policies*. A policy defines the rules or guardrails for assignment to access package. Each policy can be used to ensure that only the appropriate users are able to have access assignments, and the access is time-limited and will expire if not renewed.

![Diagram of access package and policies.](./media/entitlement-management-overview/elm-overview-access-package.png)

You can have policies for users to request access. In these kinds of policies, an administrator or access package manager defines

- Either the already-existing users (typically employees or already-invited guests), or the partner organizations of external users that are eligible to request access
- The approval process and the users that can approve or deny access
- The duration of a user's access assignment, once approved, before the assignment expires

You can also have policies for users to be assigned access, either [by an administrator](entitlement-management-access-package-assignments.md#directly-assign-a-user), [automatically based on rules](entitlement-management-access-package-auto-assignment-policy.md), or through lifecycle workflows.

The following diagram shows an example of the different elements in entitlement management. It shows one catalog with two example access packages.

- **Access package 1** includes a single group as a resource. Access is defined with a policy that enables a set of users in the directory to request access.
- **Access package 2** includes a group, an application, and a SharePoint Online site as resources. Access is defined with two different policies. The first policy enables a set of users in the directory to request access. The second policy enables users in an external directory to request access.

![Entitlement management overview diagram](./media/entitlement-management-overview/elm-overview.png)

## When should I use access packages?

Access packages don't replace other mechanisms for access assignment.  They're most appropriate in situations such as:

- Migrating access policy definitions from a third party [enterprise role management](identity-governance-organizational-roles.md) to Microsoft Entra ID.
- Employees need time-limited access for a particular task.  For example, you might use group-based licensing and a dynamic group to ensure all employees have an Exchange Online mailbox, and then use access packages for situations in which employees need more access rights. For example, rights to read departmental resources from another department.
- Access that requires the approval of an employee's manager or other designated individuals.
- Access that should be assigned automatically to people in a particular part of an organization during their time in that job role, but also available for people elsewhere in the organization, or in a business partner organization, to request.
- Departments wish to manage their own access policies for their resources without IT involvement.
- Two or more organizations are collaborating on a project, and as a result, multiple users from one organization will need to be brought in via Microsoft Entra B2B to access another organization's resources.

## How do I delegate access?

 Access packages are defined in containers called *catalogs*.  You can have a single catalog for all your access packages, or you can designate individuals to create and own their own catalogs. An administrator can add resources to any catalog, but a non-administrator can only add to a catalog the resources that they own. A catalog owner can add other users as catalog co-owners, or as access package managers.  These scenarios are described further in the article [delegation and roles in entitlement management](entitlement-management-delegate.md).

## Summary of terminology

To better understand entitlement management and its documentation, you can refer back to the following list of terms.

| Term | Description |
| --- | --- |
| access package | A bundle of resources that a team or project needs and is governed with policies. An access package is always contained in a catalog. You would create a new access package for a scenario in which users need to request access. |
| access request | A request to access the resources in an access package. A request typically goes through an approval workflow. If approved, the requesting user receives an access package assignment. |
| assignment | An assignment of an access package to a user ensures the user has all the resource roles of that access package. Access package assignments typically have a time limit before they expire. |
| catalog | A container of related resources and access packages. Catalogs are used for delegation, so that non-administrators can create their own access packages. Catalog owners can add resources they own to a catalog. |
| catalog creator | A collection of users who are authorized to create new catalogs. When a non-administrator user who is authorized to be a catalog creator creates a new catalog, they automatically become the owner of that catalog. |
| connected organization | An external Microsoft Entra directory or domain that you have a relationship with. The users from a connected organization can be specified in a policy as being allowed to request access. |
| policy | A set of rules that defines the access lifecycle, such as how users get access, who can approve, and how long users have access through an assignment. A policy is linked to an access package. For example, an access package could have two policies - one for employees to request access and a second for external users to request access. |
| resource | An asset, such as an Office group, a security group, an application, or a SharePoint Online site, with a role that a user can be granted permissions to. |
| resource directory | A directory that has one or more resources to share. |
| resource role | A collection of permissions associated with and defined by a resource. A group has two roles - member and owner. SharePoint sites typically have three roles but may have other custom roles. Applications can have custom roles. |


## License requirements

[!INCLUDE [active-directory-p2-governance-license.md](../../../includes/active-directory-p2-governance-license.md)]


## Next steps

- If you're interested in using the Microsoft Entra admin center to manage access to resources, see [Tutorial: Manage access to resources - Microsoft Entra](entitlement-management-access-package-first.md).
- if you're interested in using Microsoft Graph to manage access to resources, see [Tutorial: manage access to resources - Microsoft Graph](/graph/tutorial-access-package-api?toc=/azure/active-directory/governance/toc.json&bc=/azure/active-directory/governance/breadcrumb/toc.json)
- [Common scenarios](entitlement-management-scenarios.md)
