---
title: Group membership for Azure AD dynamic groups with memberOf
description: How to create a dynamic membership group that can contain members of other groups in Azure Active Directory. 
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.topic: overview
ms.date: 07/15/2022
ms.author: billmath
ms.reviewer: krbain
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Group membership in a dynamic group (preview) in Azure Active Directory

This feature preview in Azure Active Directory (Azure AD), part of Microsoft Entra, enables admins to create dynamic groups and administrative units that populate by adding members of other groups using the memberOf attribute. Apps that couldn't read group-based membership previously in Azure AD can now read the entire membership of these new memberOf groups. Not only can these groups be used for apps, they can also be used for licensing assignments. The following diagram illustrates how you could create Dynamic-Group-A with members of Security-Group-X and Security-Group-Y. Members of the groups inside of Security-Group-X and Security-Group-Y don't become members of Dynamic-Group-A.
 
:::image type="content" source="./media/groups-dynamic-rule-member-of/member-of-diagram.png" alt-text="Diagram showing how the memberOf attribute works.":::

With this preview, admins can configure dynamic groups with the memberOf attribute in the Azure portal, Microsoft Graph, and PowerShell. Security groups, Microsoft 365 groups, groups that are synced from on-premises Active Directory can all be added as members of these dynamic groups, and can all be added to a single group. For example, the dynamic group could be a security group, but you can use Microsoft 365 groups, security groups, and groups that are synced from on-premises to define its membership.

## Prerequisites

Only administrators in the Global Administrator, Intune Administrator, or User Administrator role can use the memberOf attribute to create an Azure AD dynamic group. You must have an Azure AD Premium license for the Azure AD tenant.

## Preview limitations

- Each Azure AD tenant is limited to 500 dynamic groups using the memberOf attribute. memberOf groups do count towards the total dynamic group member quota of 5,000.
- Each dynamic group can have up to 50 member groups. 
- When adding members of security groups to memberOf dynamic groups, only direct members of the security group become members of the dynamic group.
- You can't use one memberOf dynamic group to define the membership of another memberOf dynamic groups. For example, Dynamic Group A, with members of group B and C in it, can't be a member of Dynamic Group D).
- MemberOf can't be used with other rules. For example, a rule that states dynamic group A should contain members of group B and also should contain only users located in Redmond will fail.
- Dynamic group rule builder and validate feature can't be used for memberOf at this time.
- MemberOf can't be used with other operators. For example, you can't create a rule that states “Members Of group A can't be in Dynamic group B.”

## Getting started

This feature can be used in the Azure portal, Microsoft Graph, and in PowerShell. Because memberOf isn't yet supported in the rule builder, you must enter your rule in the rule editor.  

### Steps to create a memberOf dynamic group

1. Sign in to the [Azure portal](https://portal.azure.com) with an account that has Global Administrator, Intune Administrator, or User Administrator role permissions.
1. Select **Azure Active Directory** > **Groups**, and then select **New group**.
1. Fill in group details. The group type can be Security or Microsoft 365, and the membership type can be set to **Dynamic User** or **Dynamic Device**.
1. Select **Add dynamic query**.
1. MemberOf isn't yet supported in the rule builder. Select **Edit** to write the rule in the **Rule syntax** box.
    1. Example user rule: `user.memberof -any (group.objectId -in ['groupId', 'groupId'])`
    1. Example device rule: `device.memberof -any (group.objectId -in ['groupId', 'groupId'])`
1. Select **OK**.
1. Select **Create group**.
