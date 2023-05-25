---
title: License requirements to use Privileged Identity Management
description: Describes the licensing requirements to use Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: amsliu
manager: amycolannino
editor: ''
ms.assetid: 34367721-8b42-4fab-a443-a2e55cdbf33d
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: pim
ms.date: 07/06/2022
ms.author: amsliu
ms.reviewer: ilyal
ms.custom: pim

ms.collection: M365-identity-device-management
---

# License requirements to use Privileged Identity Management

To use Privileged Identity Management (PIM) in Azure Active Directory (Azure AD), part of Microsoft Entra, a tenant must have a valid license. Licenses must also be assigned to the administrators and relevant users. This article describes the license requirements to use Privileged Identity Management.

## Valid licenses

You will need an Azure AD license to use PIM and all of it's settings. Currently, you can scope an access review to service principals with access to Azure AD and Azure resource roles (Preview) with an Azure Active Directory Premium P2 edition active in your tenant. The licensing model for service principals will be finalized for general availability of this feature and additional licenses may be required. [!INCLUDE [Azure AD Premium P2 license](../../../includes/active-directory-p2-license.md)]

## Licenses you must have

Ensure that your directory has Azure AD Premium P2 licenses for the following categories of users:

- Users with eligible and/or time-bound assignments to Azure AD or Azure roles managed using PIM
- Users with eligible and/or time-bound assignments as members or owners of PIM for Groups
- Users able to approve or reject activation requests in PIM
- Users assigned to an access review
- Users who perform access reviews

Azure AD Premium P2 licenses are **not** required for the following tasks:

- No licenses are required for users who set up PIM, configure policies, receive alerts, and set up access reviews.

For more information about licenses, see [Assign or remove licenses using the Azure portal](../fundamentals/license-users-groups.md).

## Example license scenarios

Here are some example license scenarios to help you determine the number of licenses you must have.

| Scenario | Calculation | Number of licenses |
| --- | --- | --- |
| Woodgrove Bank has 10 administrators for different departments and 2 Global Administrators that configure and manage PIM. They make five administrators eligible. | Five licenses for the administrators who are eligible | 5 |
| Graphic Design Institute has 25 administrators of which 14 are managed through PIM. Role activation requires approval and there are three different users in the organization who can approve activations. | 14 licenses for the eligible roles + three approvers | 17 |
| Contoso has 50 administrators of which 42 are managed through PIM. Role activation requires approval and there are five different users in the organization who can approve activations. Contoso also does monthly reviews of users assigned to administrator roles and reviewers are the users’ managers of which six are not in administrator roles managed by PIM. | 42 licenses for the eligible roles + five approvers + six reviewers | 53 |

## When a license expires

If an Azure AD Premium P2, EMS E5, or trial license expires, Privileged Identity Management features will no longer be available in your directory:

- Permanent role assignments to Azure AD roles will be unaffected.
- The Privileged Identity Management service in the Azure portal, as well as the Graph API cmdlets and PowerShell interfaces of Privileged Identity Management, will no longer be available for users to activate privileged roles, manage privileged access, or perform access reviews of privileged roles.
- Eligible role assignments of Azure AD roles will be removed, as users will no longer be able to activate privileged roles.
- Any ongoing access reviews of Azure AD roles will end, and Privileged Identity Management configuration settings will be removed.
- Privileged Identity Management will no longer send emails on role assignment changes.

## Next steps

- [Deploy Privileged Identity Management](pim-deployment-plan.md)
- [Start using Privileged Identity Management](pim-getting-started.md)
- [Roles you can't manage in Privileged Identity Management](pim-roles.md)

