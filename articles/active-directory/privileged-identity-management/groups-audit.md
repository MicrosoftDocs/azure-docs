---
title: Audit activity history for group assignments in Privileged Identity Management
description: View activity and audit activity history for group assignments in Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: article
ms.workload: identity
ms.subservice: pim
ms.date: 09/12/2023
ms.author: barclayn
ms.reviewer: shaunliu
ms.collection: M365-identity-device-management
---
# Audit activity history for group assignments in Privileged Identity Management

When working with your organization's groups in Privileged Identity Management (PIM), you can view activity, activations, and audit history for Microsoft Entra group membership or ownership changes. 

> [!NOTE]
> If your organization has outsourced management functions to a service provider who uses [Azure Lighthouse](../../lighthouse/overview.md), role assignments authorized by that service provider won't be shown here.

Follow these steps to view the audit history for groups in Privileged Identity Management.

## View resource audit history

**Resource audit** gives you a view of all activity associated with groups in PIM.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Privileged role administrator](../roles/permissions-reference.md#privileged-role-administrator).

1. Browse to **Identity governance** > **Privileged Identity Management** > **Groups**.

1. Select the group you want to view audit history for.

1. Select **Resource audit**.

    :::image type="content" source="media/pim-for-groups/pim-group-19.png" alt-text="Screenshot of where to select Resource audit." lightbox="media/pim-for-groups/pim-group-19.png":::

1. Filter the history using a predefined date or custom range.

## View my audit

**My audit** enables you to view your personal role activity for groups in PIM.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).

1. Browse to **Identity governance** > **Privileged Identity Management** > **Groups**.

1. Select the group you want to view audit history for.

1. Select **My audit**.

    :::image type="content" source="media/pim-for-groups/pim-group-20.png" alt-text="Screenshot of where to select My audit." lightbox="media/pim-for-groups/pim-group-20.png":::

1. Filter the history using a predefined date or custom range.

## Next steps

- [Assign eligibility for a group in Privileged Identity Management](groups-assign-member-owner.md)
