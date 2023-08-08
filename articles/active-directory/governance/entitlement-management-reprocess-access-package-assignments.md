---
title: Reprocess assignments for an access package in entitlement management
description: Learn how to reprocess assignments for an access package in entitlement management.
services: active-directory
documentationCenter: ''
author: owinfreyatl
manager: amycolannino
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 05/31/2023
ms.author: owinfrey
ms.reviewer: 
ms.collection: M365-identity-device-management

#Customer intent: As a global administrator or access package manager, I want detailed information about how I can reprocess assignments for an access package in the event of a partial delivery, so that requestors have all of the resources they need to perform their job.

---
# Reprocess assignments for an access package in entitlement management

As an access package manager, you can automatically reevaluate and enforce users’ original assignments in an access package using the reprocess functionality. Reprocessing eliminates the need for users to repeat the access package request process if their access to resources was impacted by changes outside of Entitlement Management.

For example, a user may have been removed from a group manually, thereby causing that user to lose access to necessary resources. 

Entitlement Management doesn't block outside updates to the access package’s resources, so the Entitlement Management UI wouldn't accurately display this change. Therefore, the user’s assignment status would be shown as “Delivered” even though the user doesn't have access to the resources anymore. However, if the user’s assignment is reprocessed, they'll be added to the access package’s resources again. Reprocessing ensures that the access package assignments are up to date, that users have access to necessary resources, and that assignments are accurately reflected in the UI.

This article describes how to reprocess assignments in an existing access package.

## Prerequisites

To use entitlement management and assign users to access packages, you must have one of the following licenses:

- Microsoft Azure AD Premium P2 or Microsoft Entra ID Governance
- Enterprise Mobility + Security (EMS) E5 license

## Open an existing access package and reprocess user assignments

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

**Prerequisite role**: Global administrator, Identity Governance administrator, User administrator, Catalog owner, Access package manager or Access package assignment manager

If you have users who are in the "Delivered" state but don't have access to resources that are a part of the access package, you'll likely need to reprocess the assignments to reassign those users to the access package's resources. Follow these steps to reprocess assignments for an existing access package:

1. Sign in to the [Azure portal](https://portal.azure.com).

1.  Select **Azure Active Directory**, and then select **Identity Governance**.

1. In the left menu, select **Access packages** and then open the access package with the user assignment you want to reprocess.

1. Underneath **Manage** on the left side, select **Assignments**.

    ![Entitlement management in the Azure portal](./media/entitlement-management-reprocess-access-package-assignments/reprocess-access-package-assignment.png)

1. Select all users whose assignments you wish to reprocess.

1. Select **Reprocess**.

## Next steps

- [View, add, and remove assignments for an access package](entitlement-management-access-package-assignments.md)
- [View reports and logs](entitlement-management-reports.md)
