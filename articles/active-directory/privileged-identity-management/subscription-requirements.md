---
title: License requirements to use PIM - Azure Active Directory | Microsoft Docs
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
ms.date: 01/16/2019
ms.author: curtand
ms.custom: pim

ms.collection: M365-identity-device-management
---

# License requirements to use PIM

To use Azure Active Directory (Azure AD) Privileged Identity Management (PIM), a directory must have a valid license. Furthermore, licenses must be assigned to relevant users. This article describes the license requirements to use PIM.

## Prerequisites

[!INCLUDE [Azure AD Premium P2 license](../../../includes/active-directory-p2-license.md)]

## Which users must have licenses?

Your directory must have Azure AD Premium P2 licenses for the following users:

- Users assigned as eligible to Azure AD roles managed using PIM
- Users able to approve or reject activation requests in PIM
- Users assigned to an Azure resource role with just-in-time or direct (time-based) assignments  
- Users assigned to an access review
- Users who perform access reviews

Azure AD Premium P2 licenses are **not** required for the following users:

- No licenses are required for users with the Global Administrator or Privileged Role Administrator roles that set up PIM, configures policies, receive alerts, and sets up access reviews.

For information about how to assign licenses to your uses, see [Assign or remove licenses using the Azure Active Directory portal](../fundamentals/license-users-groups.md).

## Example license scenarios

Here are some example license scenarios to help you determine the number of licenses you must have.

| Scenario | Calculation | Required number of licenses |
| --- | --- | --- |
| OrgA has 10 administrators for different departments and 2 Global Administrators that configure and manage PIM. They make 5 administrators eligible. | 5 license for the administrators that are eligible | 5 |
| OrgB has 25 administrators of which 14 are managed through PIM. Role activation requires approval and there are 3 different users in the organization who can approve activations. | 14 licenses for the eligible roles + 3 approvers | 17 |
| OrgC has 50 administrators of which 42 are managed through PIM. Role activation requires approval and there are 5 different users in the organization who can approve activations. OrgC also does monthly reviews of users assigned to administrator roles and reviewers are the users’ managers of which 6 are not in administrator roles managed by PIM. | 42 licenses for the eligible roles + 5 approvers + 6 reviewers | 53 |

## What happens when a license expires?

If an Azure AD Premium P2, EMS E5, or trial license expires, PIM features will no longer be available in your directory:

- Permanent role assignments to Azure AD roles will be unaffected.
- The PIM service in the Azure portal, as well as the Graph API cmdlets and PowerShell interfaces of PIM, will no longer be available for users to activate privileged roles, manage privileged access, or perform access reviews of privileged roles.
- Eligible role assignments of Azure AD roles will be removed, as users will no longer be able to activate privileged roles.
- Any ongoing access reviews of Azure AD roles will end, and PIM configuration settings will be removed.
- PIM will no longer send emails on role assignment changes.

## Next steps

- [Deploy PIM](pim-deployment-plan.md)
- [Start using PIM](pim-getting-started.md)
- [Roles you cannot manage in PIM](pim-roles.md)
