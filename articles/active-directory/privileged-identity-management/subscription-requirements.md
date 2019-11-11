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
ms.date: 10/23/2019
ms.author: curtand
ms.custom: pim

ms.collection: M365-identity-device-management
---

# License requirements to use Privileged Identity Management

To use Azure Active Directory (Azure AD) Privileged Identity Management (PIM), a directory must have a valid license. Furthermore, licenses must be assigned to the administrators and relevant users. This article describes the license requirements to use Privileged Identity Management.

## Prerequisites

To use Privileged Identity Management, your directory must have one of the following paid or trial licenses:

- Azure AD Premium P2
- Enterprise Mobility + Security (EMS) E5
- Microsoft 365 M5

For more information, see [What is Azure Active Directory?](../fundamentals/active-directory-whatis.md).

## Which users must have licenses?

Each administrator or user who interacts with or receives a benefit from Privileged Identity Management must have a license. Examples include:

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
