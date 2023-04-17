---
title: Audit activity history for group assignments (preview) in Privileged Identity Management
description: View activity and audit activity history for group assignments (preview) in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: amsliu
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: article
ms.workload: identity
ms.subservice: pim
ms.date: 01/12/2023
ms.author: amsliu
ms.reviewer: shaunliu
ms.collection: M365-identity-device-management
---
# Audit activity history for group assignments (preview) in Privileged Identity Management

With Privileged Identity Management (PIM), you can view activity, activations, and audit history for group membership or ownership changes done through PIM for groups within your organization in Azure Active Directory (Azure AD), part of Microsoft Entra.

> [!NOTE]
> If your organization has outsourced management functions to a service provider who uses [Azure Lighthouse](../../lighthouse/overview.md), role assignments authorized by that service provider won't be shown here.

Follow these steps to view the audit history for groups in Privileged Identity Management.

## View resource audit history

**Resource audit** gives you a view of all activity associated with groups in PIM.

1. [Sign in to the Azure portal](https://portal.azure.com).

1. Select **Azure AD Privileged Identity Management -> Groups (Preview)**. 

1. Select the group you want to view audit history for.

1. Select **Resource audit**.

    :::image type="content" source="media/pim-for-groups/pim-group-19.png" alt-text="Screenshot of where to select Resource audit." lightbox="media/pim-for-groups/pim-group-19.png":::

1.	Filter the history using a predefined date or custom range.

## View my audit

**My audit** enables you to view your personal role activity for groups in PIM.

1. [Sign in to the Azure portal](https://portal.azure.com).

1. Select **Azure AD Privileged Identity Management -> Groups (Preview)**. 

1. Select the group you want to view audit history for.

1. Select **My audit**.

    :::image type="content" source="media/pim-for-groups/pim-group-20.png" alt-text="Screenshot of where to select My audit." lightbox="media/pim-for-groups/pim-group-20.png":::

1.	Filter the history using a predefined date or custom range.

## Next steps

- [Assign eligibility for a group (preview) in Privileged Identity Management](groups-assign-member-owner.md)
