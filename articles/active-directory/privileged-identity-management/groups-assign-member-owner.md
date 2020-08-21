---
title: Assign eligible owners and members for privileged access groups - Azure Active Directory
description: Learn how to assign eligible owners or members of a role-assignable group in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 07/27/2020
ms.author: curtand
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Assign eligibility for a privileged access group (preview) in Privileged Identity Management

Azure Active Directory (Azure AD) Privileged Identity Management (PIM) can help you manage the eligibility and activation of assignments to privileged access groups in Azure AD. You can assign eligibility to members or owners of the group.

>[!NOTE]
>Every user who is eligible for membership in or ownership of a privileged access group must have an Azure AD Premium P2 license. For more information, see [License requirements to use Privileged Identity Management](subscription-requirements.md).

## Assign an owner or member of a group

Follow these steps to make a user eligible to be a member or owner of a privileged access group.

1. Sign in to [Privileged Identity Management](https://portal.azure.com/) in the Azure portal with  [Privileged role administrator](../users-groups-roles/directory-assign-admin-roles.md#privileged-role-administrator) role permissions.

    For information about how to grant another administrator access to manage Privileged Identity Management, see [Grant access to other administrators to manage Privileged Identity Management](pim-how-to-give-access-to-pim.md).

1. Open **Azure AD Privileged Identity Management**.

1. Select **Privileged access (Preview)**.

1. You can search for a group name and use the **Group type** to filter the list to select the group you want to manage.

    ![List of privileged access groups to manage](./media/groups-assign-member-owner/privileged-access-list.png)

1. Under **Manage**, select **Assignments**.

1. Select **Add assignments**.

    ![New assignment pane](./media/groups-assign-member-owner/groups-add-assignment.png)

1. Select the members or owners you want to make eligible for the privileged access group.

    ![Select a member or group pane](./media/groups-assign-member-owner/add-assignments.png)

1. Select **Next** to set the membership or ownership duration.

    ![Select a member or group pane](./media/groups-assign-member-owner/assignment-duration.png)

1. In the **Assignment type** list, select **Eligible** or **Active**. Privileged access groups provide two distinct assignment types:

    - **Eligible** assignments require the member of the role to perform an action to use the role. Actions might include performing a multi-factor authentication (MFA) check, providing a business justification, or requesting approval from designated approvers.

    - **Active** assignments don't require the member to perform any action to use the role. Members assigned as active have the privileges assigned to the role at all times.

1. If the assignment should be permanent (permanently eligible or permanently assigned), select the **Permanently** checkbox. Depending on your organization's settings, the check box might not appear or might not be editable.

1. When finished, select **Assign**.

1. To create the new role assignment, select **Add**. A notification of the status is displayed.

    ![New assignment - Notification](./media/groups-assign-member-owner/groups-assignment-notification.png)

## Update or remove an existing role assignment

Follow these steps to update or remove an existing role assignment.

1. Open **Azure AD Privileged Identity Management**.

1. Select **Privileged access (Preview)**.

1. You can search for a group name and use the **Group type** to filter the list to select the group you want to manage.

    ![List of privileged access groups to manage](./media/groups-assign-member-owner/privileged-access-list.png)

1. Under **Manage**, select **Assignments**.

1. Select the role that you want to update or remove.

1. Find the role assignment on the **Eligible roles** or **Active roles** tabs.

    ![Update or remove role assignment](./media/groups-assign-member-owner/groups-add-assignment.png)

1. Select **Update** or **Remove** to update or remove the role assignment.

    For information about extending a role assignment, see [Extend or renew Azure resource roles in Privileged Identity Management](pim-resource-roles-renew-extend.md).

## Next steps

- [Extend or renew Azure resource roles in Privileged Identity Management](pim-resource-roles-renew-extend.md)
- [Configure Azure resource role settings in Privileged Identity Management](pim-resource-roles-configure-role-settings.md)
- [Assign Azure AD roles in Privileged Identity Management](pim-how-to-add-role-to-user.md)
