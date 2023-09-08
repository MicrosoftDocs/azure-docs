---
title: Bring groups into Privileged Identity Management 
description: Learn how to bring groups into Privileged Identity Management.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 6/7/2023
ms.author: billmath
ms.reviewer: ilyal
ms.collection: M365-identity-device-management
---

# Bring groups into Privileged Identity Management

In Azure Active Directory (Azure AD), part of Microsoft Entra, you can use Privileged Identity Management (PIM) to manage just-in-time membership in the group or just-in-time ownership of the group. Groups can be used to provide access to Azure AD Roles, Azure roles, and various other scenarios. To manage an Azure AD group in PIM, you must bring it under management in PIM.

## Identify groups to manage

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Before you will start, you need an Azure AD Security group or Microsoft 365 group. To learn more about group management in Azure AD, see [Manage Azure Active Directory groups and group membership](../fundamentals/how-to-manage-groups.md).

Dynamic groups and groups synchronized from on-premises environment cannot be managed in PIM for Groups.

You need appropriate permissions to bring groups in Azure AD PIM. For role-assignable groups, you need to have Global Administrator, Privileged Role Administrator role, or be an Owner of the group. For non-role-assignable groups, you need to have Global Administrator, Directory Writer, Groups Administrator, Identity Governance Administrator, User Administrator role, or be an Owner of the group. Role assignments for administrators should be scoped at directory level (not administrative unit level). 

> [!NOTE]
> Other roles with permissions to manage groups (such as Exchange Administrators for non-role-assignable M365 groups) and administrators with assignments scoped at administrative unit level can manage groups through Groups API/UX and override changes made in Azure AD PIM.


1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Azure AD Privileged Identity Management -> Groups** and view groups that are already enabled for PIM for Groups.

    :::image type="content" source="media/pim-for-groups/pim-group-1.png" alt-text="Screenshot of where to view groups that are already enabled for PIM for Groups." lightbox="media/pim-for-groups/pim-group-1.png":::

1. Select **Discover groups** and select a group that you want to bring under management with PIM.

    :::image type="content" source="media/pim-for-groups/pim-group-2.png" alt-text="Screenshot of where to select a group that you want to bring under management with PIM." lightbox="media/pim-for-groups/pim-group-2.png":::

1. Select **Manage groups** and **OK**.
1. Select **Groups** to return to the list of groups enabled in PIM for Groups.


> [!NOTE]
> Alternatively, you can use the Groups blade to bring group under Privileged Identity Management.

> [!NOTE]
> Once a group is managed, it can't be taken out of management. This prevents another resource administrator from removing PIM settings.

> [!IMPORTANT]
> If a group is deleted from Azure AD, it may take up to 24 hours for the group to be removed from the PIM for Groups blades.

## Next steps

- [Assign eligibility for a group in Privileged Identity Management](groups-assign-member-owner.md)
- [Activate your group membership or ownership in Privileged Identity Management](groups-activate-roles.md)
- [Approve activation requests for group members and owners](groups-approval-workflow.md)
