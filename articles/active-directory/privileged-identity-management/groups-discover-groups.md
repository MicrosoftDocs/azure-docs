---
title: Bring groups into Privileged Identity Management (preview) - Azure Active Directory
description: Learn how to bring groups into Privileged Identity Management (preview).
services: active-directory
documentationcenter: ''
author: amsliu
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 01/12/2023
ms.author: amsliu
ms.reviewer: ilyal
ms.collection: M365-identity-device-management
---

# Bring groups into Privileged Identity Management (preview)

In Azure Active Directory (Azure AD), part of Microsoft Entra, you can use Privileged Identity Management (PIM) to manage just-in-time membership in the group or just-in-time ownership of the group. Groups can be used to provide access to Azure AD Roles, Azure roles, and various other scenarios. To manage an Azure AD group in PIM, you must bring it under management in PIM.

## Identify groups to manage

Before you will start, you need an Azure AD Security group or Microsoft 365 group. To learn more about group management in Azure AD, see [Manage Azure Active Directory groups and group membership](../fundamentals/how-to-manage-groups.md).

Dynamic groups and groups synchronized from on-premises environment cannot be managed in PIM for Groups.

You should either be a group Owner, have Global Administrator role, or Privileged Role Administrator role to bring the group under management with PIM.


1. [Sign in to the Azure portal](https://portal.azure.com).

1. Select **Azure AD Privileged Identity Management -> Groups (Preview)** and view groups that are already enabled for PIM for Groups.

    :::image type="content" source="media/pim-for-groups/pim-group-1.png" alt-text="Screenshot of where to view groups that are already enabled for PIM for Groups." lightbox="media/pim-for-groups/pim-group-1.png":::

1.	Select **Discover groups** and select a group that you want to bring under management with PIM.

    :::image type="content" source="media/pim-for-groups/pim-group-2.png" alt-text="Screenshot of where to select a group that you want to bring under management with PIM." lightbox="media/pim-for-groups/pim-group-2.png":::

1. Select **Manage groups** and **OK**.
1. Select **Groups (Preview)** to return to the list of groups enabled in PIM for Groups.


> [!NOTE]
> Alternatively, you can use the Groups blade to bring group under Privileged Identity Management.

> [!NOTE]
> Once a group is managed, it can't be taken out of management. This prevents another resource administrator from removing PIM settings.

> [!IMPORTANT]
> If a group is deleted from Azure AD, it may take up to 24 hours for the group to be removed from the PIM for Groups blades.

## Next steps

- [Assign eligibility for a group (preview) in Privileged Identity Management](groups-assign-member-owner.md)
- [Activate your group membership or ownership in Privileged Identity Management](groups-activate-roles.md)
- [Approve activation requests for group members and owners (preview)](groups-approval-workflow.md)