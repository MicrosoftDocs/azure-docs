---
title: Quickstart - View roles assigned to a user using the Azure portal | Microsoft Docs
description: Learn how to view the role-based access control (RBAC) permissions assigned to a user, group, service principal, or managed identity using the Azure portal.
services: role-based-access-control
documentationCenter: ''
author: rolyon
manager: mtillman
editor: ''

ms.service: role-based-access-control
ms.devlang: ''
ms.topic: quickstart
ms.tgt_pltfrm: ''
ms.workload: identity
ms.date: 11/30/2018
ms.author: rolyon
ms.reviewer: bagovind

#Customer intent: As a new user, I want to see how to quickly see how to check what access a user, group, or application has, to make sure they have the appropriate permissions.

---

# Quickstart: View roles assigned to a user using the Azure portal

You can use the **Access control (IAM)** blade in [role-based access control (RBAC)](overview.md) to view the role assignments for multiple users, groups, service principals, and managed identities, but sometimes you just need to quickly view role assignments for a single user, group, service principal, or managed identity. The easiest way to do this is to use the **Check access** feature in the Azure portal.

## View role assignments

Follow these steps to view the role assignments for a single user, group, service principal, or managed identity at the subscription scope.

1. In the Azure portal, click **All services** and then **Subscriptions**.

1. Click your subscription.

1. Click **Access control (IAM)**.

1. Click the **Check access** tab.

    ![Access control - Check access tab](./media/check-access/access-control-check-access.png)

1. In the **Find** list, select the type of security principal you want to check access for.

1. In the search box, enter a string to search the directory for display names, email addresses, or object identifiers.

    ![Check access select list](./media/check-access/check-access-select.png)

1. Click the security principal to open the **assignments** pane.

    ![assignments pane](./media/check-access/check-access-assignments.png)

    On this pane, you can see the roles assigned to the selected security principal and the scope. If there are any deny assignments at this scope or inherited to this scope, they will be listed.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Grant access for a user using RBAC and the Azure portal](quickstart-assign-role-user-portal.md)
