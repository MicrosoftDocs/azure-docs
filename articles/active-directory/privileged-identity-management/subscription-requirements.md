---
title: License requirements to use Privileged Identity Management - Azure Active Directory | Microsoft Docs
description: Describes the licensing requirements to use Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman
editor: markwahl-msft
ms.assetid: 34367721-8b42-4fab-a443-a2e55cdbf33d
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: pim
ms.date: 01/10/2020
ms.author: curtand
ms.custom: pim

ms.collection: M365-identity-device-management
---

# License requirements to use Privileged Identity Management

To use Azure Active Directory (Azure AD) Privileged Identity Management (PIM), a directory must have a valid license. Furthermore, licenses must be assigned to the administrators and relevant users. This article describes the license requirements to use Privileged Identity Management.

## Valid licenses

[!INCLUDE [Azure AD Premium P2 license](../../../includes/active-directory-p2-license.md)]

## How many licenses must you have?

Ensure that your directory has at least as many Azure AD Premium P2 licenses as you have employees that will be performing the following tasks:

- Users assigned as eligible to Azure AD roles managed using PIM
- Users able to approve or reject activation requests in PIM
- Users assigned to an Azure resource role with just-in-time or direct (time-based) assignments  
- Users assigned to an access review
- Users who perform access reviews

Azure AD Premium P2 licenses are **not** required for the following tasks:

- No licenses are required for users with the Global Administrator or Privileged Role Administrator roles that set up PIM, configure policies, receive alerts, and set up access reviews.

For more information about licenses, see [Assign or remove licenses using the Azure Active Directory portal](../fundamentals/license-users-groups.md).

## Example license scenarios

Here are some example license scenarios to help you determine the number of licenses you must have.

| Scenario | Calculation | Number of licenses |
| --- | --- | --- |
| Woodgrove Bank has 10 administrators for different departments and 2 Global Administrators that configure and manage PIM. They make five administrators eligible. | Five licenses for the administrators who are eligible | 5 |
| Graphic Design Institute has 25 administrators of which 14 are managed through PIM. Role activation requires approval and there are three different users in the organization who can approve activations. | 14 licenses for the eligible roles + three approvers | 17 |
| Contoso has 50 administrators of which 42 are managed through PIM. Role activation requires approval and there are five different users in the organization who can approve activations. Contoso also does monthly reviews of users assigned to administrator roles and reviewers are the users’ managers of which six are not in administrator roles managed by PIM. | 42 licenses for the eligible roles + five approvers + six reviewers | 53 |

## What happens when a license expires?

If an Azure AD Premium P2, EMS E5, or trial license expires, Privileged Identity Management features will no longer be available in your directory:

- Permanent role assignments to Azure AD roles will be unaffected.
- The Privileged Identity Management service in the Azure portal, as well as the Graph API cmdlets and PowerShell interfaces of Privileged Identity Management, will no longer be available for users to activate privileged roles, manage privileged access, or perform access reviews of privileged roles.
- Eligible role assignments of Azure AD roles will be removed, as users will no longer be able to activate privileged roles.
- Any ongoing access reviews of Azure AD roles will end, and Privileged Identity Management configuration settings will be removed.
- Privileged Identity Management will no longer send emails on role assignment changes.

## Next steps

- [Deploy Privileged Identity Management](pim-deployment-plan.md)
- [Start using Privileged Identity Management](pim-getting-started.md)
- [Roles you cannot manage in Privileged Identity Management](pim-roles.md)
