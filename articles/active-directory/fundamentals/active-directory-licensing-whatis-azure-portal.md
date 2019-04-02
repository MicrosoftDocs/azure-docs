---
title: What is group-based licensing - Azure Active Directory | Microsoft Docs
description: Learn about Azure Active Directory group-based licensing, including how it works and best practices.
services: active-directory
keywords: Azure AD licensing
author: eross-msft
manager: daveba

ms.service: active-directory
ms.subservice: fundamentals
ms.topic: conceptual
ms.workload: identity
ms.date: 10/29/2018
ms.author: lizross
ms.reviewer: krbain
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# What is group-based licensing in Azure Active Directory?

Microsoft paid cloud services, such as Office 365, Enterprise Mobility + Security, Dynamics 365, and other similar products, require licenses. These licenses are assigned to each user who needs access to these services. To manage licenses, administrators use one of the management portals (Office or Azure) and PowerShell cmdlets. Azure Active Directory (Azure AD) is the underlying infrastructure that supports identity management for all Microsoft cloud services. Azure AD stores information about license assignment states for users.

Until now, licenses could only be assigned at the individual user level, which can make large-scale management difficult. For example, to add or remove user licenses based on organizational changes, such as users joining or leaving the organization or a department, an administrator often must write a complex PowerShell script. This script makes individual calls to the cloud service.

To address those challenges, Azure AD now includes group-based licensing. You can assign one or more product licenses to a group. Azure AD ensures that the licenses are assigned to all members of the group. Any new members who join the group are assigned the appropriate licenses. When they leave the group, those licenses are removed. This licensing management eliminates the need for automating license management via PowerShell to reflect changes in the organization and departmental structure on a per-user basis.

## Licensing requirements
You must have one of the following licenses to use group-based licensing:

- Paid or trial subscription for Azure AD Basic

- Paid or trial edition of Office 365 Enterprise E3 or Office 365 A3 and above

### Required number of licenses
For any groups assigned a license, you must also have a license for each unique member. While you don't have to assign each member of the group a license, you must have at least enough licenses to include all of the members. For example, if you have 1,000 unique members who are part of licensed groups in your tenant, you must have at least 1,000 licenses to meet the licensing agreement.

## Features

Here are the main features of group-based licensing:

- Licenses can be assigned to any security group in Azure AD. Security groups can be synced from on-premises, by using Azure AD Connect. You can also create security groups directly in Azure AD (also called cloud-only groups), or automatically via the Azure AD dynamic group feature.

- When a product license is assigned to a group, the administrator can disable one or more service plans in the product. Typically, this assignment is done when the organization is not yet ready to start using a service included in a product. For example, the administrator might assign Office 365 to a department, but temporarily disable the Yammer service.

- All Microsoft cloud services that require user-level licensing are supported. This support includes all Office 365 products, Enterprise Mobility + Security, and Dynamics 365.

- Group-based licensing is currently available only through the [Azure portal](https://portal.azure.com). If you primarily use other management portals for user and group management, such as the [Microsoft 365 admin center](https://admin.microsoft.com), you can continue to do so. But you should use the Azure portal to manage licenses at group level.

- Azure AD automatically manages license modifications that result from group membership changes. Typically, license modifications are effective within minutes of a membership change.

- A user can be a member of multiple groups with license policies specified. A user can also have some licenses that were directly assigned, outside of any groups. The resulting user state is a combination of all assigned product and service licenses. If a user is assigned same license from multiple sources, the license will be consumed only once.

- In some cases, licenses cannot be assigned to a user. For example, there might not be enough available licenses in the tenant, or conflicting services might have been assigned at the same time. Administrators have access to information about users for whom Azure AD could not fully process group licenses. They can then take corrective action based on that information.

## Your feedback is welcome!

If you have feedback or feature requests, share them with us using [the Azure AD admin forum](https://feedback.azure.com/forums/169401-azure-active-directory?category_id=162510).

## Next steps

To learn more about other scenarios for license management through group-based licensing, see:

* [Assigning licenses to a group in Azure Active Directory](../users-groups-roles/licensing-groups-assign.md)
* [Identifying and resolving license problems for a group in Azure Active Directory](../users-groups-roles/licensing-groups-resolve-problems.md)
* [How to migrate individual licensed users to group-based licensing in Azure Active Directory](../users-groups-roles/licensing-groups-migrate-users.md)
* [How to migrate users between product licenses using group-based licensing in Azure Active Directory](../users-groups-roles/licensing-groups-change-licenses.md)
* [Azure Active Directory group-based licensing additional scenarios](../users-groups-roles/licensing-group-advanced.md)
* [PowerShell examples for group-based licensing in Azure Active Directory](../users-groups-roles/licensing-ps-examples.md)
