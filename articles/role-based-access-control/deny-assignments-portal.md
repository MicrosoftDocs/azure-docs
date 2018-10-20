---
title: View deny assignments using the Azure portal | Microsoft Docs
description: Learn how to view the users, groups, and service principals that have been denied access to specific actions at particular scope using the Azure portal.
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
ms.date: 10/20/2018
ms.author: rolyon
ms.reviewer: bagovind
---

# View deny assignments using the Azure portal

[Deny assignments](deny-assignments.md) block users from performing specific actions event if a role assignment grants them access. At this time, deny assignments are read-only and can only be set by Azure. Some resource providers in Azure now include deny assignments. Even though you can't create your own deny assignments, you still need to be able to view deny assignments because they might affect your overall permissions. This article describes how to use the Azure portal to view deny assignments.

## View deny assignments

Follow these steps to view deny assignments at the subscription or management group scope.

1. In the Azure portal, click **All services** and then **Subscriptions** or **Management groups**.

1. If you using management groups, navigate to the management group you want to use.

1. Click your subscription.

1. Click **Access control (IAM)**.

1. Click the **View deny assignments** tile or click the **Deny assignments** tab.

    If there are any deny assignments at this scope, they will be listed.

    ![Access control - Deny assignments blade for a subscription](./media/deny-assignments-portal/access-control-deny-assignments.png)

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

    **All principals** represents all users, groups, and service principals in an Azure AD directory.

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
