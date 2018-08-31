---
title: Manage access to apps and resources using Azure Active Directory groups | Microsoft Docs
description: Learn about managing access to your organization's cloud-based apps, on-premises apps, and resources using Azure Active Directory groups.
services: active-directory
author: eross-msft
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.component: fundamentals
ms.topic: conceptual
ms.date: 08/28/2017
ms.author: lizross
ms.reviewer: piotrci
---

# Manage access to resources using Azure Active Directory groups
Azure Active Directory (Azure AD) helps you to manage your cloud-based apps, on-premises apps, and your resources. Your resources can be part of the directory, such as permissions to manage objects through roles in the directory, or external to the directory, such as for Software as a Service (SaaS) apps, Azure services, SharePoint sites, and on-premises resources.

>[!NOTE]
>To use Azure Active Directory, you need an Azure account. If you don't have an account, you can [sign up for a free Azure account](https://azure.microsoft.com/free/).

If you don't already have a group, you can create a new group using:

- **Azure AD portal.** Follow the steps in the [How to: Create a basic group and add members using the Azure Active Directory portal](active-directory-groups-create-azure-portal.md) article.

- **PowerShell cmdlets.** Follow the steps in the [Azure Active Directory cmdlets for group management](../users-groups-roles/groups-settings-v2-cmdlets.md) article.

## Assign access rights to a user
There are four ways to assign resource access rights to your users:

- **Direct assignment.** The resource owner directly assigns the user to the resource.

- **Group assignment.** The resource owner assigns an Azure AD group to the resource, which automatically gives all of the group members access to the resource. Group membership is managed by the group owner and not the resource owner, so you must work together to add or remove members from a group. For more information about adding or removing group membership, see [How to: Add or remove a group from another group using the Azure Active Directory portal](active-directory-groups-membership-azure-portal.md). 

- **Rule-based assignment.** The resource owner creates and uses a rule that defines which users are assigned to a specific resource. The rule is based on attributes that are assigned to individual users. The resource owner manages the rule, determining which attributes and values are required to allow access the resource. For more information, see [Create a dynamic group and check status](../users-groups-roles/groups-create-rule.md)

- **External authority assignment.** Access comes from an external source, such as an on-premises directory or a SaaS app. In this situation, the resource owner assigns a group to provide access to the resource and then the external source manages the group members.

   ![Overview of access management diagram](./media/active-directory-manage-groups/access-management-overview.png)

## Watch a video that explains access management
You can watch a short video that explains more about this:

**Azure AD: Introduction to dynamic membership for groups**

> [!VIDEO https://channel9.msdn.com/Series/Azure-Active-Directory-Videos-Demos/Azure-AD--Introduction-to-Dynamic-Memberships-for-Groups/player]
>
>

## How does access management in Azure Active Directory work?
At the center of the Azure AD access management solution is the security group. Using a security group to manage access to resources is a well-known paradigm, which allows for a flexible and easily understood way to provide access to a resource for the intended group of users. The resource owner (or the administrator of the directory) can assign a group to provide a certain access right to the resources they own. The members of the group will be provided the access, and the resource owner can delegate the right to manage the members list of a group to someone else, such as a department manager or a helpdesk administrator.

![Azure Active Directory access management diagram](./media/active-directory-manage-groups/active-directory-access-management-works.png)

The owner of a group can also make that group available for self-service requests. In doing so, an end user can search for and find the group and make a request to join, effectively seeking permission to access the resources that are managed through the group. The owner of the group can set up the group so that join requests are approved automatically or require approval by the owner of the group. When a user makes a request to join a group, the join request is forwarded to the owners of the group. If one of the owners approves the request, the requesting user is notified and the user is joined to the group. If one of the owners denies the request, the requesting user is notified but not joined to the group.

## Getting started with access management
Ready to get started? You should try out some of the basic tasks you can do with Azure AD groups. Use these capabilities to provide specialized access to different groups of people for different resources in your organization. A list of basic first steps are listed below.

* [Creating a simple rule to configure dynamic memberships for a group](active-directory-groups-create-azure-portal.md)
* [Using a group to manage access to SaaS applications](../users-groups-roles/groups-saasapps.md)
* [Making a group available for end user self-service](../users-groups-roles/groups-self-service-management.md)
* [Syncing an on-premises group to Azure using Azure AD Connect](../connect/active-directory-aadconnect.md)
* [Managing owners for a group](active-directory-accessmanagement-managing-group-owners.md)

## Next steps
Now that you have understood the basics of access management, here are some additional advanced capabilities available in Azure Active Directory for managing access to your applications and resources.

* [Using attributes to create advanced rules](../users-groups-roles/groups-dynamic-membership.md)
* [Managing security groups in Azure AD](active-directory-groups-create-azure-portal.md)
* [Graph API reference for groups](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/groups-operations#GroupFunctions)
* [Azure Active Directory cmdlets for configuring group settings](../users-groups-roles/groups-settings-cmdlets.md)
