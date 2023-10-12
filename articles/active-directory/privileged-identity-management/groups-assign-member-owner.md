---
title: Assign eligibility for a group in Privileged Identity Management
description: Learn how to assign eligibility for a group in Privileged Identity Management.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 09/12/2023
ms.author: barclayn
ms.reviewer: ilyal
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Assign eligibility for a group in Privileged Identity Management

In Azure Active Directory, formerly known as Microsoft Entra ID, you can use Privileged Identity Management (PIM) to manage just-in-time membership in the group or just-in-time ownership of the group.

When a membership or ownership is assigned, the assignment:

- Can't be assigned for a duration of less than five minutes
- Can't be removed within five minutes of it being assigned

>[!NOTE]
>Every user who is eligible for membership in or ownership of a PIM for Groups must have a Microsoft Entra Premuim P2 or Microsoft Entra ID Governance license. For more information, see [License requirements to use Privileged Identity Management](subscription-requirements.md).

## Assign an owner or member of a group

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Follow these steps to make a user eligible member or owner of a group. You'll need permissions to manage groups. For role-assignable groups, you need to have Global Administrator, Privileged Role Administrator role, or be an Owner of the group. For non-role-assignable groups, you need to have Global Administrator, Directory Writer, Groups Administrator, Identity Governance Administrator, User Administrator role, or be an Owner of the group. Role assignments for administrators should be scoped at directory level (not administrative unit level). 

> [!NOTE]
> Other roles with permissions to manage groups (such as Exchange Administrators for non-role-assignable M365 groups) and administrators with assignments scoped at administrative unit level can manage groups through Groups API/UX and override changes made in Microsoft Entra PIM.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com)

1. Browse to **Identity governance** > **Privileged Identity Management** > **Groups**. 

1. Here you can view groups that are already enabled for PIM for Groups.

    :::image type="content" source="media/pim-for-groups/pim-group-1.png" alt-text="Screenshot of where to view groups that are already enabled for PIM for Groups." lightbox="media/pim-for-groups/pim-group-1.png":::

1. Select the group you need to manage.

1. Select **Assignments**.

1. Use **Eligible assignments** and **Active assignments** blades to review existing membership or ownership assignments for selected group.

    :::image type="content" source="media/pim-for-groups/pim-group-3.png" alt-text="Screenshot of where to review existing membership or ownership assignments for selected group." lightbox="media/pim-for-groups/pim-group-3.png":::

1. Select **Add assignments**.

1. Under **Select role**, choose between **Member** and **Owner** to assign membership or ownership.

1. Select the members or owners you want to make eligible for the group.

    :::image type="content" source="media/pim-for-groups/pim-group-4.png" alt-text="Screenshot of where to select the members or owners you want to make eligible for the group." lightbox="media/pim-for-groups/pim-group-4.png":::

1. Select **Next**.

1. In the Assignment type list, select Eligible or Active. Privileged Identity Management provides two distinct assignment types:
    - Eligible assignment requires member or owner to perform an activation to use the role. Activations may also require providing a multi-factor authentication (MFA), providing a business justification, or requesting approval from designated approvers.
    > [!IMPORTANT]
    > For groups used for elevating into Microsoft Entra roles, Microsoft recommends that you require an approval process for eligible member assignments. Assignments that can be activated without approval can leave you vulnerable to a security risk from another administrator with permission to reset an eligible user's passwords.
    - Active assignments don't require the member to perform any activations to use the role. Members or owners assigned as active have the privileges assigned to the role at all times.

1. If the assignment should be permanent (permanently eligible or permanently assigned), select the **Permanently** checkbox. Depending on the group's settings, the check box might not appear or might not be editable. For more information, check out the [Configure PIM for Groups settings in Privileged Identity Management](groups-role-settings.md#assignment-duration) article.

    :::image type="content" source="media/pim-for-groups/pim-group-5.png" alt-text="Screenshot of where to configure the setting for add assignments." lightbox="media/pim-for-groups/pim-group-5.png":::

1. Select **Assign**.

## Update or remove an existing role assignment

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Follow these steps to update or remove an existing role assignment. You'll need permissions to manage groups. For role-assignable groups, you need to have Global Administrator, Privileged Role Administrator role, or be an Owner of the group. For non-role-assignable groups, you need to have Global Administrator, Directory Writer, Groups Administrator, Identity Governance Administrator, User Administrator role, or be an Owner of the group. Role assignments for administrators should be scoped at directory level (not administrative unit level). 

> [!NOTE]
> Other roles with permissions to manage groups (such as Exchange Administrators for non-role-assignable M365 groups) and administrators with assignments scoped at administrative unit level can manage groups through Groups API/UX and override changes made in Microsoft Entra PIM.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Privileged Role Administrator](../roles/permissions-reference.md#privileged-role-administrator).

1. Browse to **Identity governance** > **Privileged Identity Management** > **Groups**. 

1. Here you can view groups that are already enabled for PIM for Groups.

    :::image type="content" source="media/pim-for-groups/pim-group-1.png" alt-text="Screenshot of where to view groups that are already enabled for PIM for Groups." lightbox="media/pim-for-groups/pim-group-1.png":::

1. Select the group you need to manage.

1. Select **Assignments**.

1. Use **Eligible assignments** and **Active assignments** blades to review existing membership or ownership assignments for selected group.

    :::image type="content" source="media/pim-for-groups/pim-group-3.png" alt-text="Screenshot of where to review existing membership or ownership assignments for selected group." lightbox="media/pim-for-groups/pim-group-3.png":::

1. Select **Update** or **Remove** to update or remove the membership or ownership assignment.

## Next steps

- [Activate your group membership or ownership in Privileged Identity Management](groups-activate-roles.md)
- [Approve activation requests for group members and owners](groups-approval-workflow.md)
