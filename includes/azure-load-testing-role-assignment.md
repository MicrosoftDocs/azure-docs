---
title: "Include file"
description: "Include file"
services: load-testing
author: ntrogh
ms.service: load-testing
ms.author: nicktrog
ms.custom: "include file"
ms.topic: "include"
ms.date: 02/15/2022
---

Before you can manage load tests in the Azure Load Testing resource, you need to have the right access permissions. [Azure role-based access control (Azure RBAC)](../articles/role-based-access-control/overview.md) is used to manage access to Azure resources, such as the ability to create new resources or use existing ones.

1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.

1. On the left pane, select **Access Control (IAM)**, and then select **Add role assignment**.

    :::image type="content" source="media/azure-load-testing-role-assignment/load-test-access-control.png" alt-text="Screenshot that shows how to configure access control.":::

1. Assign the **Load Test Contributor** or **Load Test Owner** role to your Azure account. For details about how to assign roles, see [Assign Azure roles using the Azure portal](../articles/role-based-access-control/role-assignments-portal.md).

    The role assignments might take a few minutes to become active for your account. Refresh the webpage for the user interface to reflect the updated permissions.

    :::image type="content" source="media/azure-load-testing-role-assignment/add-role-assignment.png" alt-text="Screenshot that shows the role assignment screen.":::

    > [!IMPORTANT]
    > To assign Azure roles, you must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](../articles/role-based-access-control/built-in-roles.md#user-access-administrator) or [Owner](../articles/role-based-access-control/built-in-roles.md#owner).