---
title: View deny assignments using the Azure portal | Microsoft Docs
description: Learn how to view the users, groups, service principals, and managed identities that have been denied access to specific actions at particular scope using the Azure portal.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.assetid: 8078f366-a2c4-4fbb-a44b-fc39fd89df81
ms.service: role-based-access-control
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/30/2018
ms.author: rolyon
ms.reviewer: bagovind
---

# View deny assignments using the Azure portal

[Deny assignments](deny-assignments.md) block users from performing specific actions even if a role assignment grants them access. Some resource providers in Azure now include deny assignments. Even though you can't create your own deny assignments, you still need to be able to view deny assignments because they might affect your overall permissions. This article describes how to use the Azure portal to view deny assignments.

> [!NOTE]
> At this time, deny assignments are read-only and can only be set by Azure.

## View deny assignments

Follow these steps to view deny assignments at the subscription or management group scope.

1. In the Azure portal, click **All services** and then **Management groups** or **Subscriptions**.

1. Click the management group or subscription you want to view.

1. Click **Access control (IAM)**.

1. Click the **Deny assignments** tab (or click the **View** button on the View deny assignments tile).

    If there are any deny assignments at this scope or inherited to this scope, they will be listed.

    ![Access control - Deny assignments tab](./media/deny-assignments-portal/access-control-deny-assignments.png)

1. To display additional columns, click **Edit Columns**.

    ![Deny assignments - Columns](./media/deny-assignments-portal/deny-assignments-columns.png)

    |  |  |
    | --- | --- |
    | **Name** | Name of the deny assignment. |
    | **Principal type** | User, group, system-defined group, or service principal. |
    | **Denied**  | Name of the security principal that is included in the deny assignment. |
    | **Id** | Unique identifier for the deny assignment. |
    | **Excluded principals** | Whether there are security principals that are excluded from the deny assignment. |
    | **Does not apply to children** | Whether the deny assignment is inherited to subscopes. |
    | **System protected** | Whether the deny assignment is managed by Azure. Currently, always Yes. |
    | **Scope** | Management group, subscription, resource group, or resource. |

1. Add a checkmark to any of the enabled items and then click **OK** to display the selected columns.

## View details about a deny assignment

Follow these steps to view additional details about a deny assignment.

1. Open the **Deny assignments** pane as described in the previous section.

1. Click the deny assignment name to open the **Users** blade.

    ![Deny assignment - Users](./media/deny-assignments-portal/deny-assignment-users.png)

    The **Users** blade includes the following two sections.

    |  |  |
    | --- | --- |
    | **Deny assignment applies to**  | Security principals that the deny assignment applies to. |
    | **Deny assignment excludes** | Security principals that are excluded from the deny assignment. |

    **All principals** represents all users, groups, service principals, and managed identities in an Azure AD directory.

1. To see a list of the permissions that are denied, click **Denied Permissions**.

    ![Deny assignment - Denied Permissions](./media/deny-assignments-portal/deny-assignment-denied-permissions.png)

    | Action type | Description |
    | --- | --- |
    | **Actions**  | Denied management operations. |
    | **NotActions** | Management operations excluded from denied management operation. |
    | **DataActions**  | Denied data operations. |
    | **NotDataActions** | Data operations excluded from denied data operation. |

    For the example shown in the previous screenshot, the following are the effective permissions:

    - All storage operations on the data plane are denied except for compute operations.

1. To see the properties for a deny assignment, click **Properties**.

    ![Deny assignment - Properties](./media/deny-assignments-portal/deny-assignment-properties.png)

    On the **Properties** blade, you can see the deny assignment name, ID, description, and scope. The **Does not apply to children** switch indicates whether the deny assignment is inherited to subscopes. The **System protected** switch indicates whether this deny assignment is managed by Azure. Currently, this is **Yes** in all cases.

## Next steps

* [Understand deny assignments](deny-assignments.md)
* [List deny assignments using RBAC and the REST API](deny-assignments-rest.md)
