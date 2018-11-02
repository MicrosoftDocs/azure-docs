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
ms.date: 10/24/2018
ms.author: cwatson
---
# Understand Azure Enterprise Agreement administrative roles in Azure

To help manage your organization's usage and spend, Azure customers with an Enterprise Agreement (EA customer) have three distinct administrative roles:

- Enterprise Administrator
- Department Administrator
- Account Owner
 
Those roles are specific to managing Enterprise Agreements in the Azure portal. Azure has additional built-in roles to control access to resources. For more information, see [Build-in roles for Azure resources](../role-based-access-control/built-in-roles.md).

The following sections describe the user limits for each role, the tasks the roles have permissions to do, and what portal and pricing tools those roles have access to. For all the tasks, Enterprise Administrators and Department Administrators may be granted read-only access.

## User limit for admin roles

|Role| User limit|
|---|---|
|Enterprise Administrator|Unlimited|
|Department Administrator|Unlimited|
|Account Owner|1 per account<sup>1</sup>|

<sup>1</sup> Each account requires a unique Microsoft account, or work or school account.

## Enterprise hierarchy and permissions by role

|Tasks| Enterprise Administrator|Department Administrator|Account Owner|
|---|---|---|---|
|View, add, or remove Enterprise Administrators|✓|✗|✗|
|View, add, or remove  Notification Contacts<sup>2</sup> |✓|✗|✗|
|View/add/remove Department Administrators|✓|✓|✗|
|View, add, or remove  Account Owners|✓|✓|✗|
|View, add, or remove  Service Administrators|✗|✗|✓|
|Create or cancel subscription|✗|✗|✓|

<sup>2</sup> Notification contacts are sent all the email communications about the Azure Enterprise Agreement.

## Usage and costs access by role

|Tasks| Enterprise Administrator|Department Administrator|Account Owner|
|---|---|---|---|
|View credit balance or monetary commitment|✓|✗|✗|
|Set department spending limits|✓|✗|✗|
|View enterprise's price sheet|✓|✗|✗|
|View usage and cost details in the Enterprise portal|✓|✓<sup>3</sup>|✓<sup>4</sup>|
|View forecasts in Azure portal|✓|✓<sup>3</sup>|✓<sup>4</sup> |
|Manage resources in Azure portal|✗|✗|✓|
|Manage subscription permissions including role-based access control|✗|✗|✓|

- <sup>3</sup> Requires that the Enterprise Admin enable **Department Administrator can view charges** policy in the Azure portal. The Department Administrator can then see details for the department.
- <sup>4</sup> Requires that the Enterprise Admin enable **Account Owner can view charges** policy in the Azure portal. The Account Owner can then see details for the account.

## Portal and pricing access by role

|Role|Azure portal|Enterprise portal|Pricing calculator with enterprise’s pricing |
|---|---|---|---|
|Enterprise Administrator|✔|✔|✔|
|Department Administrator|✔|✔|✔<sup>5</sup>|
|Account Owner|✔|✔|✔<sup>6</sup> |

- <sup>5</sup> Requires that the Enterprise Admin enable **Department Administrator can view charges** policy in the Azure portal.
- <sup>6</sup> Requires that the Enterprise Admin enable **Account Owner can view charges** policy in the Azure portal.

## Pricing in Azure portal

You may see different pricing in the Azure portal depending on your administrative role and how the view charges policies are set. The two policies in the EA portal that affect the pricing you see in the Azure portal are:

- Department admins can view charges
- Account owners can view charges

To learn how to set these policies, see [Manage access to billing information for Azure](billing-manage-access.md).

The following table shows the relationship between the Enterprise admin role, the view charges policy, the role-based access control (RBAC) role in the Azure portal, and the pricing that you see in the Azure portal.

|Enterprise admin role|View charges policy for role|RBAC role|Pricing view|
|---|---|---|---|
|Account owner|✔|Owner|Enterprise's pricing|
|Account owner|✘ |Owner|No pricing|
|Account owner|✔ |none|No pricing|
|Account owner|✘ |none|No pricing|
|None|n/a |Owner|Retail pricing|

You set the Enterprise admin role and view charges policies in the EA portal. The RBAC role can be updated in the Azure portal. For more information, see [Manage access using RBAC and the Azure portal](../role-based-access-control/role-assignments-portal.md).

## Next steps

- [Manage access to billing information for Azure](billing-manage-access.md)
- [Manage access using RBAC and the Azure portal](../role-based-access-control/role-assignments-portal.md)
- [Built-in roles for Azure resources](../role-based-access-control/built-in-roles.md)