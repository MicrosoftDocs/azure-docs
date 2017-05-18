---
title: Dynamic groups and Azure Active Directory B2B collaboration | Microsoft Docs
description: Azure Active Directory B2B collaboration can be used with Azure AD dynamic groups
services: active-directory
documentationcenter: ''
author: sasubram
manager: femila
editor: ''
tags: ''

ms.assetid:
ms.service: active-directory
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: identity
ms.date: 05/04/2017
ms.author: sasubram

---

# Dynamic groups and Azure Active Directory B2B collaboration

## What are dynamic groups?
Dynamic configuration of security group membership for Azure Active Directory (Azure AD) is available in [the Azure portal](https://portal.azure.com). Administrators can set rules to populate groups that are created in Azure Active Directory based on user attributes (such as userType, department, or country). This allows members to be automatically added to or removed from a security group based on changes to their attributes. These groups can be used to provide access to applications or cloud resources (such as SharePoint sites and documents) and to assign licenses to members. Read more about dynamic groups in [Dedicated groups in Azure Active Directory](active-directory-accessmanagement-dedicated-groups.md).

With an AAD Premium P1 or P2 subscription, the Azure portal now provides you with the ability to create advanced rules to enable more complex attribute-based dynamic memberships for Azure Active Directory groups. Learn more about creating advanced rules in [Using attributes to create advanced rules for group membership in Azure Active Directory](active-directory-groups-dynamic-membership-azure-portal.md).

## What are the built-in dynamic groups?
The **All users** dynamic group enables tenant admins to create a group containing all users in the tenant with a single click. By default, the **All users** group includes all users in the directory, including Members and Guests.
Within the new Azure Active Directory admin portal, you can choose to enable the **All users** group in the Group Settings view.

![built-in groups](media/active-directory-b2b-dynamic-groups/built-in-groups.png)

Hardening the All users dynamic group
By default, the **All users** group contains your B2B collaboration (guest) users as well. If you want to further secure your **All users** group by removing guest users, you can accomplish this easily by modifying the **All users** group's attribute-based rule. The illustration below shows the **All users** group modified to exclude guests.

![enable all users group](media/active-directory-b2b-dynamic-groups/enable-all-users-group.png)

You might also find it useful to create a new dynamic group that only contains Guest users. This can be quite handy in targeting policies (such as Conditional Access policies) to Guest users.
Here's an illustration of what such a group might look like:

![exclude guest users](media/active-directory-b2b-dynamic-groups/exclude-guest-users.png)

## Next steps

Browse our other articles on Azure AD B2B collaboration:

* [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
* [B2B collaboration user properties](active-directory-b2b-user-properties.md)
* [Adding a B2B collaboration user to a role](active-directory-b2b-add-guest-to-role.md)
* [Delegate B2bB collaboration invitations](active-directory-b2b-delegate-invitations.md)
* [B2B collaboration code and PowerShell samples](active-directory-b2b-code-samples.md)
* [Configure SaaS apps for B2B collaboration](active-directory-b2b-configure-saas-apps.md)
* [B2B collaboration user tokens](active-directory-b2b-user-token.md)
* [B2B collaboration user claims mapping](active-directory-b2b-claims-mapping.md)
* [Office 365 external sharing](active-directory-b2b-o365-external-user.md)
* [B2B collaboration current limitations](active-directory-b2b-current-limitations.md)
