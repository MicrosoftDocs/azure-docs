---
title: Bring groups into Privileged Identity Management 
description: Learn how to bring groups into Privileged Identity Management.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 09/12/2023
ms.author: barclayn
ms.reviewer: ilyal
ms.collection: M365-identity-device-management
---

# Bring groups into Privileged Identity Management

In Microsoft Entra ID, you can use Privileged Identity Management (PIM) to manage just-in-time membership in the group or just-in-time ownership of the group. Groups can be used to provide access to Microsoft Entra roles, Azure roles, and various other scenarios. To manage a Microsoft Entra group in PIM, you must bring it under management in PIM.

## Identify groups to manage

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Before starting, you need a Microsoft Entra Security group or Microsoft 365 group. To learn more about group management in Microsoft Entra ID, see [Manage Microsoft Entra groups and group membership](../fundamentals/how-to-manage-groups.md).

Dynamic groups and groups synchronized from on-premises environment cannot be managed in PIM for Groups.

You need appropriate permissions to bring groups in Microsoft Entra PIM. For role-assignable groups, you need to have Global Administrator, Privileged Role Administrator role, or be an Owner of the group. For non-role-assignable groups, you need to have Global Administrator, Directory Writer, Groups Administrator, Identity Governance Administrator, User Administrator role, or be an Owner of the group. Role assignments for administrators should be scoped at directory level (not administrative unit level). 

> [!NOTE]
> Other roles with permissions to manage groups (such as Exchange Administrators for non-role-assignable M365 groups) and administrators with assignments scoped at administrative unit level can manage groups through Groups API/UX and override changes made in Microsoft Entra PIM.


1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Privileged Role Administrator](../roles/permissions-reference.md#privileged-role-administrator).

1. Browse to **Identity governance** > **Privileged Identity Management** > **Groups**.

1. Here you can view groups that are already enabled for PIM for Groups.

    :::image type="content" source="media/pim-for-groups/pim-group-1.png" alt-text="Screenshot of where to view groups that are already enabled for PIM for Groups." lightbox="media/pim-for-groups/pim-group-1.png":::

1. Select **Discover groups** and select a group that you want to bring under management with PIM.

    :::image type="content" source="media/pim-for-groups/pim-group-2.png" alt-text="Screenshot of where to select a group that you want to bring under management with PIM." lightbox="media/pim-for-groups/pim-group-2.png":::

1. Select **Manage groups** and **OK**.
1. Select **Groups** to return to the list of groups enabled in PIM for Groups.


> [!NOTE]
> Alternatively, you can use the Groups pane to bring group under Privileged Identity Management.

> [!NOTE]
> Once a group is managed, it can't be taken out of management. This prevents another resource administrator from removing PIM settings.

> [!IMPORTANT]
> If a group is deleted from Microsoft Entra ID, it may take up to 24 hours for the group to be removed from the PIM for Groups blades.

## Next steps

- [Assign eligibility for a group in Privileged Identity Management](groups-assign-member-owner.md)
- [Activate your group membership or ownership in Privileged Identity Management](groups-activate-roles.md)
- [Approve activation requests for group members and owners](groups-approval-workflow.md)
