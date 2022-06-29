---
title: Manage roles in Azure Load Testing
description: Learn how to access to an Azure Load Testing resource using Azure role-based access control (Azure RBAC).
author: ntrogh
ms.author: nicktrog
services: load-testing
ms.service: load-testing
ms.topic: how-to 
ms.date: 03/15/2022
ms.custom: template-how-to
---

# Manage access to Azure Load Testing

In this article, you learn how to manage access (authorization) to an Azure Load Testing resource. [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) is used to manage access to Azure resources, such as the ability to create new resources or use existing ones. Users in your Azure Active Directory (Azure AD) are assigned specific roles, which grant access to resources.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

To assign Azure roles, you must have:

* `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator) or [Owner](../role-based-access-control/built-in-roles.md#owner).

## Default roles

Azure Load Testing resources have three built-in roles that are available by default. When you add users to a resource, you can assign one of the built-in roles to grant permissions:

| Role | Access level |
| --- | --- |
| **Load Test Reader** | Read-only actions in the Load Testing resource. Readers can list and view tests and test runs in the resource. Readers can't create, update, or run tests. |
| **Load Test Contributor** | View, create, edit, or delete (where applicable) tests and test runs in a Load Testing resource. |
| **Load Test Owner** | Full access to the Load Testing resource, including the ability to view, create, edit, or delete (where applicable) assets in a resource. For example, you can modify or delete the Load Testing resource. |

If you have the **Owner**, **Contributor**, or **Load Test Owner** role at the subscription level, you automatically have the same permissions as the **Load Test Owner** at the resource level.

You'll encounter this message if your account doesn't have the necessary permissions to manage tests.

:::image type="content" source="media/how-to-assign-roles/azure-load-testing-not-authorized.png" lightbox="media/how-to-assign-roles/azure-load-testing-not-authorized.png" alt-text="Screenshot that shows an error message in the Azure portal that you're not authorized to use the Azure Load Testing resource.":::

> [!IMPORTANT]
> Role access can be scoped to multiple levels in Azure. For example, someone with owner access to a resource may not have owner access to the resource group that contains the resource. For more information, see [How Azure RBAC works](../role-based-access-control/overview.md#how-azure-rbac-works).

## Manage resource access

You can manage access to the Azure Load Testing resource by using the Azure portal:

1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.

1. On the left pane, select **Access Control (IAM)**, and then select **Add role assignment**.

    :::image type="content" source="media/how-to-assign-roles/load-test-access-control.png" alt-text="Screenshot that shows how to configure access control.":::

1. Assign one of the Azure Load Testing [built-in roles](#default-roles). For details about how to assign roles, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

    The role assignments might take a few minutes to become active for your account. Refresh the webpage for the user interface to reflect the updated permissions.

    :::image type="content" source="media/how-to-assign-roles/add-role-assignment.png" alt-text="Screenshot that shows the role assignment screen.":::

Alternatively, you can manage access without using the Azure portal:

- [PowerShell](../role-based-access-control/role-assignments-powershell.md)
- [Azure CLI](../role-based-access-control/role-assignments-cli.md)
- [REST API](../role-based-access-control/role-assignments-rest.md)
- [Azure Resource Manager templates](../role-based-access-control/role-assignments-template.md)

## Next steps

* Learn more about [Using managed identities](./how-to-use-a-managed-identity.md).
* Learn more about [Identifying performance bottlenecks (tutorial)](./tutorial-identify-bottlenecks-azure-portal.md).
