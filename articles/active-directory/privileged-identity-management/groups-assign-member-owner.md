---
title: Assign eligible owners and members for privileged access groups - Azure Active Directory
description: Learn how to assign eligible owners or members of a role-assignable group in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: amsliu
manager: amycolannino
ms.service: active-directory
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 07/29/2022
ms.author: amsliu
ms.reviewer: shaunliu
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Assign eligibility for a privileged access group (preview) in Privileged Identity Management

Privileged Identity Management (PIM) in Azure Active Directory (Azure AD), part of Microsoft Entra, can help you manage the eligibility and activation of assignments to privileged access groups in Azure AD. You can assign eligibility to members or owners of the group.

When a role is assigned, the assignment:
- Can't be assigned for a duration of less than five minutes
- Can't be removed within five minutes of it being assigned

>[!NOTE]
>Every user who is eligible for membership in or ownership of a privileged access group must have an Azure AD Premium P2 license. For more information, see [License requirements to use Privileged Identity Management](subscription-requirements.md).

## Assign an owner or member of a group

Follow these steps to make a user eligible to be a member or owner of a privileged access group.

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com/) with a user in the [Global Administrator](../roles/permissions-reference.md#global-administrator) role, the Privileged Role Administrator role, or the group Owner role.

1. Select **Groups** and then select the [role-assignable group](concept-privileged-access-versus-role-assignable.md) you want to manage. You can search or filter the list.

    ![find a role-assignable group to manage in PIM](./media/groups-assign-member-owner/groups-list-in-azure-ad.png)

1. Open the group and select **Privileged access (Preview)**.

    ![Open the Privileged Identity Management experience](./media/groups-assign-member-owner/groups-discover-groups.png)

1. Select **Add assignments**.

    ![New assignment pane](./media/groups-assign-member-owner/groups-add-assignment.png)

1. Select the members or owners you want to make eligible for the privileged access group.

    ![Screenshot that shows the "Add assignments" page with the "Select a member or group" pane open and the "Select" button highlighted.](./media/groups-assign-member-owner/add-assignments.png)

1. Select **Next** to set the membership or ownership duration.

    ![Select a member or group pane](./media/groups-assign-member-owner/assignment-duration.png)

1. In the **Assignment type** list, select **Eligible** or **Active**. Privileged access groups provide two distinct assignment types:

    - **Eligible** assignments require the member of the role to perform an action to use the role. Actions might include performing a multi-factor authentication (MFA) check, providing a business justification, or requesting approval from designated approvers. 

      > [!Important]
      > For privileged access groups used for elevating into Azure AD roles, Microsoft recommends that you require an approval process for eligible member assignments. Assignments that can be activated without approval can leave you vulnerable to a security risk from another administrator with permission to reset an eligible user's passwords.

    - **Active** assignments don't require the member to perform any action to use the role. Members assigned as active have the privileges assigned to the role at all times.

1. If the assignment should be permanent (permanently eligible or permanently assigned), select the **Permanently** checkbox. Depending on your organization's settings, the check box might not appear or might not be editable. For more information, check out the [Configure privileged access group settings](groups-role-settings.md#assignment-duration) article.

1. When finished, select **Assign**.

1. To create the new role assignment, select **Add**. A notification of the status is displayed.

    ![New assignment - Notification](./media/groups-assign-member-owner/groups-assignment-notification.png)

## Update or remove an existing role assignment

Follow these steps to update or remove an existing role assignment.

1. [Sign in to Azure AD](https://aad.portal.azure.com) with Global Administrator or group Owner permissions.
1. Select **Groups** and then select the role-assignable group you want to manage. You can search or filter the list.

    ![find a role-assignable group to manage in PIM](./media/groups-assign-member-owner/groups-list-in-azure-ad.png)

1. Open the group and select **Privileged access (Preview)**.

    ![Open the Privileged Identity Management experience](./media/groups-assign-member-owner/groups-discover-groups.png)

1. Select the role that you want to update or remove.

1. Find the role assignment on the **Eligible roles** or **Active roles** tabs.

    ![Update or remove role assignment](./media/groups-assign-member-owner/groups-bring-under-management.png)

1. Select **Update** or **Remove** to update or remove the role assignment.

    For information about extending a role assignment, see [Extend or renew Azure resource roles in Privileged Identity Management](pim-resource-roles-renew-extend.md).

## Next steps

- [Extend or renew Azure resource roles in Privileged Identity Management](pim-resource-roles-renew-extend.md)
- [Configure Azure resource role settings in Privileged Identity Management](pim-resource-roles-configure-role-settings.md)
- [Assign Azure AD roles in Privileged Identity Management](pim-how-to-add-role-to-user.md)
