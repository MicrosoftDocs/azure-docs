---
title: Manage users and roles
titleSuffix: Microsoft Playwright Testing
description: Learn how to manage access to a Microsoft Playwright Testing workspace by using Azure role-based access control (Azure RBAC). Grant user permissions for a workspace by assigning roles.
services: playwright-testing
ms.service: playwright-testing
ms.topic: how-to
ms.author: nicktrog
author: ntrogh
ms.date: 08/17/2022
---

# Manage access to a Microsoft Playwright Testing Preview workspace

In this article, you learn how to manage access to a Microsoft Playwright Testing workspace. Azure Active Directory (AAD) authorizes access rights to secured resources through [Azure role-based access control](/azure/role-based-access-control/overview) (Azure RBAC). Microsoft Playwright Testing uses a set of Azure built-in roles that encompass common sets of permissions used to access a workspace.

When an Azure role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. An Azure AD security principal may be a user, a group, an application service principal, or a managed identity for Azure resources.

With role role-based access control, you can grant permissions to view test results and [to manage access keys](./how-to-manage-access-keys.md) for the workspace in the Microsoft Playwright Testing portal.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

To assign Azure roles, you must have:

* `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).

## Default roles

Microsoft Playwright Testing workspaces uses three Azure built-in roles. When you add users to a workspace, you can assign one of the built-in roles to grant permissions:

| Role | Access level |
| --- | --- |
| **Reader** | Have read-only access to the workspace in the Microsoft Playwright Testing portal. Readers can view test results for the workspace. Readers can't [create or delete workspace access keys](./how-to-manage-access-keys.md). |
| **Contributor** | Have full access to manage the workspace in the Azure portal but can't assign roles in Azure RBAC. Contributors have full access to the workspace in the Microsoft Playwright Testing portal and can create and delete their access keys. Contributors can't delete access keys created by others. |
| **Owner** | Have full access to manage the workspace in the Azure portal, including assigning roles in Azure RBAC. Owners have full access to the workspace in the Microsoft Playwright Testing portal and can create and delete all access keys in the workspace. |

> [!IMPORTANT]
> Role access can be scoped to multiple levels in Azure. For example, someone with owner access to a resource may not have owner access to the resource group that contains the resource. For more information, see [How Azure RBAC works](/azure/role-based-access-control/overview#how-azure-rbac-works).

## Assign a role to an existing user

To assign a role to an existing user by using the Azure portal:

1. In the [Azure portal](https://portal.azure.com), go to your Microsoft Playwright Testing workspace.

1. On the left pane, select **Access Control (IAM)**, and then select **Add > Add role assignment**.

    If you don't have permissions to assign roles, the Add role assignment option will be disabled.

    :::image type="content" source="media/how-to-assign-roles/add-role-assignment.png" alt-text="Screenshot that shows how to add a role assignment to your workspace in the Azure portal.":::

1. On the **Role** tab, select one of the Microsoft Playwright Testing [built-in roles](#default-roles), and then select **Next**.

    :::image type="content" source="media/how-to-assign-roles/add-role-assignment-select-role.png" alt-text="Screenshot that shows the list of roles when adding a role assignment in the Azure portal.":::

1. On the **Members** tab, select **User, group, or service principal** to assign the selected role to one or more Azure AD users, groups, or service principals (applications).

1. Select **Select members**, find and select the users, groups, or service principals.

    :::image type="content" source="media/how-to-assign-roles/add-role-assignment-select-members.png" alt-text="Screenshot that shows the member selection interface when adding a role assignment in the Azure portal.":::

1. Select **Review + assign** to assign the role.

    For more information about how to assign roles, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

Alternatively, you can manage access without using the Azure portal:

- [PowerShell](/azure/role-based-access-control/role-assignments-powershell)
- [Azure CLI](/azure/role-based-access-control/role-assignments-cli)
- [REST API](/azure/role-based-access-control/role-assignments-rest)
- [Azure Resource Manager templates](/azure/role-based-access-control/role-assignments-template)

## Remove a role from an existing user

To remove a role from an existing user by using the Azure portal:

1. In the [Azure portal](https://portal.azure.com), go to your Microsoft Playwright Testing workspace.

1. On the left pane, select **Access Control (IAM)**, and then select **Role assignments**.

1. In the list of role assignments, add a checkmark next to the user and role you want to remove, and then select **Remove**.

    :::image type="content" source="media/how-to-assign-roles/remove-role-assignment.png" alt-text="Screenshot that shows the list of role assignments and how to delete an assignment in the Azure portal.":::

1. Select **Yes** in the confirmation window to remove the role assignment.

    For more information about how to remove role assignments, see [Remove Azure role assignments](/azure/role-based-access-control/role-assignments-remove).

## Use Azure AD security groups to manage workspace access

You can use Azure AD security groups to manage access to workspaces. This approach has following benefits:

- Team or project leaders can manage user access to a workspace as security group owners, without needing **Owner** role on the workspace resource directly.
- You can organize, manage and revoke users' permissions on a workspace and other resources as a group, without having to manage permissions on a user-by-user basis.
- Using Azure AD groups helps you to avoid reaching the [subscription limit](/azure/role-based-access-control/troubleshooting#limits) on role assignments.

To use Azure AD security groups:

1. [Create a security group](/azure/active-directory/fundamentals/active-directory-groups-create-azure-portal).
1. [Add a group owner](/azure/active-directory/fundamentals/active-directory-accessmanagement-managing-group-owners). This user has permissions to add or remove group members. The group owner isn't required to be group member, or have direct RBAC role on the workspace.
1. Assign the group an RBAC role on the workspace, such as Reader or Contributor.
1. [Add group members](/azure/active-directory/fundamentals/active-directory-groups-members-azure-portal). The added members can now access to the workspace.

## Troubleshooting

Here are a few things to be aware of while you use Azure role-based access control (Azure RBAC):

- When you create a resource in Azure, such as a workspace, you are not directly the owner of the resource. Your role is inherited from the highest scope role that you are authorized against in that subscription. As an example if you are a Network Administrator, and have the permissions to create a Microsoft Playwright Testing workspace, you would be assigned the Network Administrator role against that workspace, and not the Owner role.
- When there are two role assignments to the same Azure Active Directory user with conflicting sections of Actions/NotActions, your operations listed in NotActions from one role might not take effect if they are also listed as Actions in another role. To learn more about how Azure parses role assignments, read [How Azure RBAC determines if a user has access to a resource](/azure/role-based-access-control/overview#how-azure-rbac-determines-if-a-user-has-access-to-a-resource).
- It can sometimes take up to 1 hour for your new role assignments to take effect over cached permissions across the stack.

## Next steps

- Learn more about [authenticating requests to Microsoft Playwright Testing](./how-to-manage-access-keys.md).
- Learn more about [identifying app issues with web UI tests](./tutorial-identify-issues-with-end-to-end-web-tests.md).
- Learn more about [running existing tests with Microsoft Playwright Testing](./how-to-run-with-playwright-testing.md).
- Learn more about [automating end-to-end tests with GitHub Actions](./tutorial-automate-end-to-end-testing-with-github-actions.md).
