---
title: License requirements to use PIM - Azure Active Directory | Microsoft Docs
description: Describes the licensing requirements to use Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
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
ms.author: rolyon
ms.custom: pim

ms.collection: M365-identity-device-management
---

# License requirements to use PIM

To use Azure Active Directory (Azure AD) Privileged Identity Management (PIM), a directory must have a valid license. Furthermore, licenses must be assigned to the administrators and relevant users. This article describes the license requirements to use PIM.

## Prerequisites

To use PIM, your directory must have one of the following paid or trial licenses:

- Azure AD Premium P2
- Enterprise Mobility + Security (EMS) E5
- Microsoft 365 M5

For more information, see [What is Azure Active Directory?](../fundamentals/active-directory-whatis.md).

## Which users must have licenses?

Each administrator or user who interacts with or receives a benefit from PIM must have a license. Examples include:

- Administrators with Azure AD roles managed using PIM
- Administrators with Azure resource roles managed using PIM
- Administrators assigned to the Privileged Role Administrator role
- Users assigned as eligible to Azure AD roles managed using PIM
- Users able to approve/reject requests in PIM
- Users assigned to an Azure resource role with just-in-time or direct (time-based) assignments  
- Users assigned to an access review
- Users who perform access reviews

For information about how to assign licenses to your uses, see [Assign or remove licenses using the Azure Active Directory portal](../fundamentals/license-users-groups.md).

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
