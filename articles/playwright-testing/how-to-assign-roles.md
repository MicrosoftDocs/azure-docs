---
title: Manage roles in Microsoft Playwright Testing
description: Learn how to access an Microsoft Playwright Testing workspace using Azure role-based access control (Azure RBAC).
services: playwright-testing
ms.service: playwright-testing
ms.topic: how-to
ms.author: nicktrog
author: ntrogh
ms.date: 08/17/2022
---

# Manage access to Microsoft Playwright Testing Preview

In this article, you learn how to manage access (authorization) to an Microsoft Playwright Testing workspace. [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) is used to manage access to Azure resources, such as the ability to create new resources or use existing ones. Users in your Azure Active Directory (Azure AD) are assigned specific roles, which grant access to resources.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

To assign Azure roles, you must have:

* `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator) or [Owner](../role-based-access-control/built-in-roles.md#owner).

## Default roles

Microsoft Playwright Testing workspaces have three built-in roles that are available by default. When you add users to a resource, you can assign one of the built-in roles to grant permissions:

| Role | Access level |
| --- | --- |
| **Reader** | Read-only actions on Microsoft Playwright Testing workspace access keys. Readers can only view access keys. |
| **Contributor** | View, create, or delete workspace access keys. |
| **Owner** | Full access to the Microsoft Playwright Testing workspace, including the ability to view, create, or delete access keys. For example, you can modify or delete the Microsoft Playwright Testing workspace. |

> [!IMPORTANT]
> Role access can be scoped to multiple levels in Azure. For example, someone with owner access to a resource may not have owner access to the resource group that contains the resource. For more information, see [How Azure RBAC works](../role-based-access-control/overview.md#how-azure-rbac-works).

## Manage workspace access

To manage access to the Microsoft Playwright Testing workspace by using the Azure portal:

1. In the [Azure portal](https://portal.azure.com), go to your Microsoft Playwright Testing workspace.

1. On the left pane, select **Access Control (IAM)**, and then select **Add > Add role assignment**.

    If you don't have permissions to assign roles, the Add role assignment option will be disabled.

    :::image type="content" source="media/how-to-assign-roles/add-role-assignment.png" alt-text="Screenshot that shows how to add a role assignment to your workspace in the Azure portal.":::

1. On the **Role** tab, select one of the Microsoft Playwright Testing [built-in roles](#default-roles), and then select **Next**.

    <!-- :::image type="content" source="media/how-to-assign-roles/add-role-assignment.png" alt-text="Screenshot that shows the role assignment screen."::: -->

1. On the **Members** tab, select **User, group, or service principal** to assign the selected role to one or more Azure AD users, groups, or service principals (applications).

1. Select **Select members**, find and select the users, groups, or service principals.

1. Select **Review + assign** to assign the role.

    For more details about how to assign roles, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

Alternatively, you can manage access without using the Azure portal:

- [PowerShell](../role-based-access-control/role-assignments-powershell.md)
- [Azure CLI](../role-based-access-control/role-assignments-cli.md)
- [REST API](../role-based-access-control/role-assignments-rest.md)
- [Azure Resource Manager templates](../role-based-access-control/role-assignments-template.md)

## Next steps

- Learn more about [identifying app issues with web UI tests](./tutorial-identify-issues-with-end-to-end-web-tests.md).
- Learn more about [running existing tests with Microsoft Playwright Testing](./how-to-run-with-playwright-testing.md).
- Learn more about [automating end-to-end tests with GitHub Actions](./tutorial-automate-end-to-end-testing-with-github-actions.md).
