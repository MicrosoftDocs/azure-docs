---
title: Understand admin roles for Enterprise in Azure | Microsoft Docs
description: Learn about Enterprise administrator roles in Azure.
services: 'billing'
documentationcenter: ''
author: adpick
manager: dougeby
editor: ''

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/16/2018
ms.author: cwatson
---
# Understand Azure Enterprise Agreement administrative roles in Azure

To help manage your organization's usage and spend, Azure customers with an Enterprise Agreement (EA) can assign five distinct administrative roles:

- Enterprise Administrator
- Enterprise Administrator (read only)
- Department Administrator
- Department Administrator (read only)
- Account Owner
 
These roles are specific to managing Azure Enterprise Agreements and are in addition to the built-in roles Azure has to control access to resources. For more information, see [Built-in roles for Azure resources](../role-based-access-control/built-in-roles.md).

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
|---|---|---|---|
|View, add, or remove Enterprise Administrators|✔|✔<sup>2</sup>|✘|✘|✘|
|View, add, or remove Notification Contacts<sup>4</sup> |✔|✔<sup>2</sup>|✘|✘|✘|
|Create and manage Departments |✔|✘|✘|✘|✘|
|View, add, or remove Department Administrators|✔|✔<sup>2</sup>|✔|✔<sup>2</sup>|✘|
|View Accounts in the enrollment |✔|✔|✔<sup>3</sup>|✔<sup>3</sup>|✘|
|Add Accounts to the enrollment & change Account Owner|✔|✘|✔<sup>3</sup>|✘|✘|
|View subscriptions in your scope |✔|✔|✔|✔|✔|
|Create and manage subscriptions & subscription permissions|✘|✘|✘|✘|✔|

<sup>2</sup> View only.
<sup>3</sup> Department scope only.
<sup>4</sup> Notification contacts are sent all the email communications about the Azure Enterprise Agreement.

## Usage and costs access by role

|Tasks| Enterprise Administrator|Department Administrator|Account Owner|
|---|---|---|---|
|View credit balance including monetary commitment|✔|✘|✘|
|Set and view department spending limits|✔|✘|✘|
|View organization's EA price sheet|✔|✘|✘|
|View usage and cost details|✔|✔<sup>5</sup>|✔<sup>6</sup>|
|Manage resources in Azure portal|✘|✘|✔|

- <sup>5</sup> Requires that the Enterprise Administrator enable **DA view charges** policy in the Enterprise portal. The Department Administrator can then see cost details for the department.
- <sup>6</sup> Requires that the Enterprise Administrator enable **AO view charges** policy in the Enterprise portal. The Account Owner can then see cost details for the account.


## Pricing in Azure portal

You may see different pricing in the Azure portal depending on your administrative role and how the view charges policies are set by the Enterprise Administrator. The two policies in the Enterprise portal that affect the pricing you see in the Azure portal are:

- DA view charges
- AO view charges

To learn how to set these policies, see [Manage access to billing information for Azure](billing-manage-access.md).

The following table shows the relationship between the Enterprise Agreement admin role, the view charges policy, the role-based access control (RBAC) role in the Azure portal, and the pricing that you see in the Azure portal. The Enterprise Administrator always sees usage details based on the organization's EA pricing. However, the Department Administrator and Account Owner see different pricing views based on the view charge policy and their RBAC role.

|Enterprise Agreement admin role|View charges policy for role|RBAC role|Pricing view|
|---|---|---|---|
|Account Owner OR Department Admin|✔ Enabled|Owner|Organization's EA pricing|
|Account Owner OR Department Admin|✘ Disabled|Owner|Retail pricing|
|Account Owner OR Department Admin|✔ Enabled |none|No pricing|
|Account Owner OR Department Admin|✘ Disabled |none|No pricing|
|None|Not applicable |Owner|Retail pricing|

You set the Enterprise admin role and view charges policies in the Enterprise portal. The RBAC role can be updated in the Azure portal. For more information, see [Manage access using RBAC and the Azure portal](../role-based-access-control/role-assignments-portal.md).

## Next steps

- [Manage access to billing information for Azure](billing-manage-access.md)
- [Manage access using RBAC and the Azure portal](../role-based-access-control/role-assignments-portal.md)
- [Built-in roles for Azure resources](../role-based-access-control/built-in-roles.md)
