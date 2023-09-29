---
title: What is group-based licensing
description: Learn about Microsoft Entra group-based licensing, including how it works, key features, and best practices.
services: active-directory
keywords: Azure AD licensing
author: barclayn
manager: amycolannino

ms.service: active-directory
ms.subservice: fundamentals
ms.topic: conceptual
ms.workload: identity
ms.date: 09/28/2023
ms.author: barclayn
ms.reviewer: krbain

# Customer intent: As an IT admin, I want to understand group-based licensing, so I can effectively assign licenses to users in my organization.
---

# What is group-based licensing in Microsoft Entra ID?

Microsoft paid cloud services, such as Microsoft 365, Enterprise Mobility + Security, Dynamics 365, and other similar products, require licenses. These licenses are assigned to each user who needs access to these services. To manage licenses, administrators use one of the management portals (Office or Azure) and PowerShell cmdlets. Microsoft Entra ID is the underlying infrastructure that supports identity management for all Microsoft cloud services. Microsoft Entra ID stores information about license assignment states for users.

Microsoft Entra ID includes group-based licensing, which allows you to assign one or more product licenses to a group. Microsoft Entra ID ensures that the licenses are assigned to all members of the group. Any new members who join the group are assigned the appropriate licenses. When they leave the group, those licenses are removed. This licensing management eliminates the need for automating license management via PowerShell to reflect changes in the organization and departmental structure on a per-user basis.

## Licensing requirements

You must have one of the following licenses **for every user who benefits from** group-based licensing:

- Paid or trial subscription for Microsoft Entra ID P1 and above

- Paid or trial edition of Microsoft 365 Business Premium or Office 365 Enterprise E3 or Office 365 A3 or Office 365 GCC G3 or Office 365 E3 for GCCH or Office 365 E3 for DOD and above

### Required number of licenses

For any groups assigned a license, you must also have a license for each unique member. While you don't have to assign each member of the group a license, you must have at least enough licenses to include all of the members. For example, if you have 1,000 unique members who are part of licensed groups in your tenant, you must have at least 1,000 licenses to meet the licensing agreement.

## Features

Here are the main features of group-based licensing:

- Licenses can be assigned to any security group in Microsoft Entra ID. Security groups can be synced from on-premises, by using [Microsoft Entra Connect](../hybrid/connect/whatis-azure-ad-connect.md). You can also create security groups directly in Microsoft Entra ID (also called cloud-only groups), or automatically via the [Microsoft Entra dynamic group feature](../enterprise-users/groups-create-rule.md).

- When a product license is assigned to a group, the administrator can disable one or more service plans in the product. Typically, this assignment is done when the organization is not yet ready to start using a service included in a product. For example, the administrator might assign Microsoft 365 to a department, but temporarily disable the Yammer service.

- All Microsoft cloud services that require user-level licensing are supported. This support includes all Microsoft 365 products, Enterprise Mobility + Security, and Dynamics 365.

- Group-based licensing is currently available through the [Azure portal](https://portal.azure.com) and through the [Microsoft Admin center](https://admin.microsoft.com/). 

- Microsoft Entra ID automatically manages license modifications that result from group membership changes. Typically, license modifications are effective within minutes of a membership change.

- A user can be a member of multiple groups with license policies specified. A user can also have some licenses that were directly assigned, outside of any groups. The resulting user state is a combination of all assigned product and service licenses. If a user is assigned same license from multiple sources, the license will be consumed only once.

- In some cases, licenses can't be assigned to a user. For example, there might not be enough available licenses in the tenant, or conflicting services might have been assigned at the same time. Administrators have access to information about users for whom Microsoft Entra ID couldn't fully process group licenses. They can then take corrective action based on that information.

## Your feedback is welcome!

If you have feedback or feature requests, share them with us using [the Microsoft Entra admin forum](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789).

## Next steps

To learn more about other scenarios for license management through group-based licensing, see:

* [Assigning licenses to a group in Microsoft Entra ID](../enterprise-users/licensing-groups-assign.md)
* [Identifying and resolving license problems for a group in Microsoft Entra ID](../enterprise-users/licensing-groups-resolve-problems.md)
* [How to migrate individual licensed users to group-based licensing in Microsoft Entra ID](../enterprise-users/licensing-groups-migrate-users.md)
* [How to migrate users between product licenses using group-based licensing in Microsoft Entra ID](../enterprise-users/licensing-groups-change-licenses.md)
* [Microsoft Entra group-based licensing additional scenarios](../enterprise-users/licensing-group-advanced.md)
* [PowerShell examples for group-based licensing in Microsoft Entra ID](../enterprise-users/licensing-ps-examples.md)
