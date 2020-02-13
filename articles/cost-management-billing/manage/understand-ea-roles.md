---
title: Understand admin roles for Enterprise in Azure | Microsoft Docs
description: Learn about Enterprise administrator roles in Azure.
services: 'billing'
documentationcenter: ''
author: adpick
manager: adpick
editor: ''

ms.service: cost-management-billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/02/2020
ms.author: banders
---
# Understand Azure Enterprise Agreement administrative roles in Azure

To help manage your organization's usage and spend, Azure customers with an Enterprise Agreement (EA) can assign five distinct administrative roles:

- Enterprise Administrator
- Enterprise Administrator (read only)
- Department Administrator
- Department Administrator (read only)
- Account Owner
 
These roles are specific to managing Azure Enterprise Agreements and are in addition to the built-in roles Azure has to control access to resources. For more information, see [Built-in roles for Azure resources](../../role-based-access-control/built-in-roles.md).

The following sections describe the limitations and capabilities of each role.

## User limit for admin roles

|Role| User limit|
|---|---|
|Enterprise Administrator|Unlimited|
|Enterprise Administrator (read only)|Unlimited|
|Department Administrator|Unlimited|
|Department Administrator (read only)|Unlimited|
|Account Owner|1 per account<sup>1</sup>|

<sup>1</sup> Each account requires a unique Microsoft account, or work or school account.

## Organization structure and permissions by role

|Tasks| Enterprise Administrator|Enterprise Administrator (read only)|Department Administrator|Department Administrator (read only)|Account Owner|
|---|---|---|---|---|---|
|View Enterprise Administrators|✔|✔|✘|✘|✘|
|Add or remove Enterprise Administrators|✔|✘|✘|✘|✘|
|View Notification Contacts<sup>2</sup> |✔|✔|✘|✘|✘|
|Add or remove Notification Contacts<sup>2</sup> |✔|✘|✘|✘|✘|
|Create and manage Departments |✔|✘|✘|✘|✘|
|View Department Administrators|✔|✔|✔|✔|✘|
|Add or remove Department Administrators|✔|✘|✔|✘|✘|
|View Accounts in the enrollment |✔|✔|✔<sup>3</sup>|✔<sup>3</sup>|✘|
|Add Accounts to the enrollment and change Account Owner|✔|✘|✔<sup>3</sup>|✘|✘|
|Create and manage subscriptions and subscription permissions|✘|✘|✘|✘|✔|

- <sup>2</sup> Notification contacts are sent email communications about the Azure Enterprise Agreement.
- <sup>3</sup> Task is limited to accounts in your department.


## Usage and costs access by role

|Tasks| Enterprise Administrator|Enterprise Administrator (read only)|Department Administrator|Department Administrator (read only) |Account Owner|
|---|---|---|---|---|---|
|View credit balance including monetary commitment|✔|✔|✘|✘|✘|
|View department spending quotas|✔|✔|✘|✘|✘|
|Set department spending quotas|✔|✘|✘|✘|✘|
|View organization's EA price sheet|✔|✔|✘|✘|✘|
|View usage and cost details|✔|✔|✔<sup>4</sup>|✔<sup>4</sup>|✔<sup>5</sup>|
|Manage resources in Azure portal|✘|✘|✘|✘|✔|

- <sup>4</sup> Requires that the Enterprise Administrator enable **DA view charges** policy in the Enterprise portal. The Department Administrator can then see cost details for the department.
- <sup>5</sup> Requires that the Enterprise Administrator enable **AO view charges** policy in the Enterprise portal. The Account Owner can then see cost details for the account.


## Pricing in Azure portal

You may see different pricing in the Azure portal depending on your administrative role and how the view charges policies are set by the Enterprise Administrator. The two policies in the Enterprise portal that affect the pricing you see in the Azure portal are:

- DA view charges
- AO view charges

To learn how to set these policies, see [Manage access to billing information for Azure](manage-billing-access.md).

The following table shows the relationship between the Enterprise Agreement admin roles, the view charges policy, the role-based access control (RBAC) role in the Azure portal, and the pricing that you see in the Azure portal. The Enterprise Administrator always sees usage details based on the organization's EA pricing. However, the Department Administrator and Account Owner see different pricing views based on the view charge policy and their RBAC role. The Department Admin role listed in the following table refers to both Department Admin and Department Admin (read only) roles.

|Enterprise Agreement admin role|View charges policy for role|RBAC role|Pricing view|
|---|---|---|---|
|Account Owner OR Department Admin|✔ Enabled|Owner|Organization's EA pricing|
|Account Owner OR Department Admin|✘ Disabled|Owner|Retail pricing|
|Account Owner OR Department Admin|✔ Enabled |none|No pricing|
|Account Owner OR Department Admin|✘ Disabled |none|No pricing|
|None|Not applicable |Owner|Retail pricing|

You set the Enterprise admin role and view charges policies in the Enterprise portal. The RBAC role can be updated in the Azure portal. For more information, see [Manage access using RBAC and the Azure portal](../../role-based-access-control/role-assignments-portal.md).

## Next steps

- [Manage access to billing information for Azure](manage-billing-access.md)
- [Manage access using RBAC and the Azure portal](../../role-based-access-control/role-assignments-portal.md)
- [Built-in roles for Azure resources](../../role-based-access-control/built-in-roles.md)
