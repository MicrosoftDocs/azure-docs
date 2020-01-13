---
title: Use groups to assign roles in Azure Active Directory | Microsoft Docs
description: Preview custom Azure AD roles for delegating identity management. Manage Azure roles in the Azure portal, PowerShell, or Graph API.
services: active-directory
author: curtand
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 01/07/2020
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Use groups to assign roles in Azure Active Directory (preview)

In the past, Azure Active Directory (Azure AD) hasn’t assigning a group to Azure AD roles. In your Azure AD organization you would have to do some custom development to manage bulk role assignments or assign roles individually, increasing costs. With this public preview, you can assign a role-eligible group to Azure AD built-in roles. Use it, for example, to assign the Helpdesk administrator role to a group of your Tier I helpdesk personnel.

Then members can be added to the group and they get the role indirectly. The existing governance workflow then takes care of the approval process and auditing of the group’s membership to ensure that only legitimate users are member of the group and thus the Helpdesk Administrator role.

As you can see in example above, with this feature you can use groups to grant admin access in Azure AD. And this requires minimal effort from your Global Administrators (GA) or Privileged Role Administrators (PRA) who might have other pressing things to take care of.

##  How does this feature work? 

· Create a new Office or security group with ‘isAssignableToRole’ property set to ‘true’. This is a new property that we have introduced. You can enable this property in UI by switching on the toggle ‘Eligible for role assignment’ when creating a new group. More details in subsequent sections.
· Assign this group to one or more Azure AD roles in the same way as you assign to users.

## Why we enforce creation of a special group for assigning it to a role

If a group is assigned a role, any IT admin who can manage group membership can indirectly manage the membership of that role. For example, assume that a group Contoso_User_Administrators is assigned to User Account Administrator role. An Exchange Admin who can modify group membership can add himself to the Contoso_User_Administrators group and become a User Account Administrator. As you can see, an Exchange Admin could elevate his/her privilege in a way you did not intend. The groups assigned to roles feature is designed to prevent this from happening.

To block this from happening, we have to "protect" the group assigned to role. We have done this by introducing a new property called isAssignableToRole for groups. Only new cloud groups with the isAssignableToRole property set to ‘true’ can be assigned a role. This property is immutable; once a 
group has been created with this property set to ‘true’, it can’t be changed. You cannot set this property on a previously created group. 

Below are important points about groups that have this property set: 
1. Only Global Administrator and Privileged Role Administrator can create a group with "isAssignableToRole" property enabled. 
1. It can only have “assigned” membership type. It cannot be dynamic. This is because dynamic groups can also lead to unexpected people being able to manage the group membership, thus assignments to the role. 
1. There can't be an owner of this group. Only Global Administrator and Privileged Role Administrator can manage the membership of this group by default. We will bring the ability to delegate the management of such groups to other people in future. 
1. No nesting. A group cannot be added as a member of this group. 

Important: If you use Office groups to assign to roles, they can expire. And since these groups cannot have owners, the expiration email will be sent to the alternate email address you provide. So, provide an email address that you monitor. Read this - Set Office 365 groups to expire in Azure Active Directory. Otherwise use a security group for assigning to roles. 

## Required license plan 

Using this feature requires an Azure AD Premium P1 license. To find the right license for your requirements, see Comparing generally available features of the Free, Basic, and Premium editions. 

## Supported in this preview?

Scenario Azure AD Portal MS Graph API PowerShell 
Create a new Office 365 cloud group with 
isAssignableToRole property set to true. Supported Supported Not supported (ETA: November) 
Assign new Office 365 cloud group with 
isAssignableToRole set to true to a built-in Azure AD 
role. Supported Supported Supported 
Create a new security cloud group with 
isAssignableToRole property set to true. Supported Supported Not supported (ETA: November) 
Assign new security group with isAssignableToRole 
set to true to a built-in Azure AD role. Supported Supported Supported 
Put users into a group and assign it to a built-in 
Azure AD role (assuming the group can be assigned 
to a role) Supported Supported Supported 
Put service principals into a group and assign it to a 
built-in Azure AD role (assuming the group can be 
assigned to a role) Supported Supported Not supported (ETA: November) 
Assign groups with isAssignableToRole set to true to 
built-in roles scoped to Admin Units. CY2020 H1 CY2020 H1 CY2020 H1 
Delegate the management of group that has been 
assigned to a built-in role. CY2020 H1 CY2020 H1 CY2020 H1 
Assign a new on-prem security group to an Azure AD role (no Office 365 group on-prem). CY2020 H1 CY2020 H1 CY2020 H1 
Assign an existing on-prem security group to an 
Azure AD role (no Office 365 group on-prem). CY2020 H1 CY2020 H1 CY2020 H1 
Nest another group with isAssignableToRole set to 
true into a group that is assigned a role. CY2020 H1 CY2020 H1 CY2020 H1 
Assign a group (on-prem or cloud) to custom Azure 
AD role CY2020 H1 CY2020 H1 CY2020 H1 
Use an existing Office 365 cloud group and assign it 
to a role Out of scope Out of scope Out of scope 
U
se an existing security cloud group and assign it to 
a role
Out of scope Out of scope Out of scope


