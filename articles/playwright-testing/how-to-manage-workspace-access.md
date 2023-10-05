---
title: Manage workspace access
description: Learn how to manage access to a Microsoft Playwright Testing workspace by using Azure role-based access control (Azure RBAC). Grant user permissions for a workspace by assigning roles.
ms.topic: how-to
ms.date: 10/04/2023
ms.custom: playwright-testing-preview
---

# Manage access to a workspace in Microsoft Playwright Testing Preview

In this article, you learn how to manage access to a workspace in Microsoft Playwright Testing Preview. The service uses [Azure role-based access control](/azure/role-based-access-control/overview) (Azure RBAC) to authorize access rights to your workspace. Role assignments are the way you control access to resources using Azure RBAC.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- To assign roles in Azure, your account needs the [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator), [Owner](/azure/role-based-access-control/built-in-roles#owner), or one of the [classic administrator roles](/azure/role-based-access-control/rbac-and-directory-admin-roles#classic-subscription-administrator-roles).

    To verify your permissions in the Azure portal:

    1. In the [Azure portal](https://portal.azure.com), go to your Microsoft Playwright Testing workspace.
    1. On the left pane, select **Access Control (IAM)**, and then select **View my access**.

## Default roles

Microsoft Playwright Testing workspaces uses three Azure built-in roles. To grant users access to a workspace, you assign them one of the following Azure built-in roles:

| Role | Access level |
| --- | --- |
| **Reader** | - Read-only access to the workspace in the Playwright portal.<br/>- View test results for the workspace.<br/>- Can't [create or delete workspace access tokens](./how-to-manage-access-tokens.md).<br/>Can't run Playwright tests on the service. |
| **Contributor** | - Full access to manage the workspace in the Azure portal but can't assign roles in Azure RBAC.<br/>- Full access to the workspace in the Playwright portal.<br/>- [Create and delete their access tokens](./how-to-manage-access-tokens.md).<br/>- Run Playwright tests on the service. |
| **Owner** | - Full access to manage the workspace in the Azure portal, including assigning roles in Azure RBAC.<br/>- Full access to the workspace in the Playwright portal.<br/>- [Create and delete their access tokens](./how-to-manage-access-tokens.md).<br/>- Run Playwright tests on the service. |

> [!IMPORTANT]
> Before you assign an Azure RBAC role, determine the scope of access that is needed. Best practices dictate that it's always best to grant only the narrowest possible scope. Azure RBAC roles defined at a broader scope are inherited by the resources beneath them. For more information about scope for Azure RBAC role assignments, see [Understand scope for Azure RBAC](/azure/role-based-access-control/scope-overview).

## Grant access to a user

You can grant a user access to a Microsoft Playwright Testing workspace by using the Azure portal:

1. Sign in to the [Playwright portal](https://aka.ms/mpt/portal) with your Azure account.

1. Select the workspace settings icon, and then go to the **Users** page.

    :::image type="content" source="media/how-to-manage-workspace-access/playwright-testing-user-settings.png" alt-text="Screenshot that shows the Users page in the workspace settings in the Playwright Testing portal." lightbox="media/how-to-manage-workspace-access/playwright-testing-user-settings.png":::

1. Select **Manage users for your workspace in the Azure portal** to go to your workspace in the Azure portal.

    Alternately, you can go directly to the Azure portal and select your workspace:

    1. Sign in to the [Azure portal](https://portal.azure.com/).
    1. Enter **Playwright Testing** in the search box, and then select **Playwright Testing** in the **Services** category.
    1. Select your Microsoft Playwright Testing workspace from the list.
    1. On the left pane, select **Access Control (IAM)**.

1. On the **Access Control (IAM)** page, select **Add > Add role assignment**.

    If you don't have permissions to assign roles, the **Add role assignment** option is disabled.

    :::image type="content" source="media/how-to-manage-workspace-access/add-role-assignment.png" alt-text="Screenshot that shows how to add a role assignment to your workspace in the Azure portal." lightbox="media/how-to-manage-workspace-access/add-role-assignment.png":::

1. On the **Role** tab, select **Privileged administrator** roles.

1. Select one of the Microsoft Playwright Testing [default roles](#default-roles), and then select **Next**.

    :::image type="content" source="media/how-to-manage-workspace-access/add-role-assignment-select-role.png" alt-text="Screenshot that shows the list of roles when adding a role assignment in the Azure portal." lightbox="media/how-to-manage-workspace-access/add-role-assignment-select-role.png":::

1. On the **Members** tab, make sure **User, group, or service principal** is selected.

1. Select **Select members**, find and select the users, groups, or service principals.

    :::image type="content" source="media/how-to-manage-workspace-access/add-role-assignment-select-members.png" alt-text="Screenshot that shows the member selection interface when adding a role assignment in the Azure portal." lightbox="media/how-to-manage-workspace-access/add-role-assignment-select-members.png":::

1. Select **Review + assign** to assign the role.

    For more information about how to assign roles, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

## Revoke access for a user

You can revoke a user's access to a Microsoft Playwright Testing workspace using the Azure portal:

1. In the [Azure portal](https://portal.azure.com), go to your Microsoft Playwright Testing workspace.

1. On the left pane, select **Access Control (IAM)**, and then select **Role assignments**.

1. In the list of role assignments, add a checkmark next to the user and role you want to remove, and then select **Remove**.

    :::image type="content" source="media/how-to-manage-workspace-access/remove-role-assignment.png" alt-text="Screenshot that shows the list of role assignments and how to delete an assignment in the Azure portal." lightbox="media/how-to-manage-workspace-access/remove-role-assignment.png":::

1. Select **Yes** in the confirmation window to remove the role assignment.

    For more information about how to remove role assignments, see [Remove Azure role assignments](/azure/role-based-access-control/role-assignments-remove).

## (Optional) Use Azure AD security groups to manage workspace access

Instead of granting or revoking access to individual users, you can manage access for groups of users using Azure AD security groups. This approach has the following benefits:

- Avoid the need for granting team or project leaders the Owner role on the workspace. You can grant them access only to the security group to let them manage access to the workspace.
- You can organize, manage and revoke users' permissions on a workspace and other resources as a group, without having to manage permissions on a user-by-user basis.
- Using Azure AD groups helps you to avoid reaching the [subscription limit](/azure/role-based-access-control/troubleshooting#limits) on role assignments.

To use Azure AD security groups:

1. [Create a security group](/azure/active-directory/fundamentals/active-directory-groups-create-azure-portal).

1. [Add a group owner](/azure/active-directory/fundamentals/active-directory-accessmanagement-managing-group-owners). This user has permissions to add or remove group members. The group owner isn't required to be group member, or have direct RBAC role on the workspace.

1. Assign the group an RBAC role on the workspace, such as Reader or Contributor.

1. [Add group members](/azure/active-directory/fundamentals/active-directory-groups-members-azure-portal). The added members can now access to the workspace.

## Create a custom role for restricted tenants

If you're using Azure Active Directory [tenant restrictions](/azure/active-directory/external-identities/tenant-restrictions-v2) and users with temporary access, you can create a custom role in Azure RBAC to manage permissions and grant access to run tests.

Perform the following steps to manage permissions with a custom role:

1. Follow these steps to [create an Azure custom role](/azure/role-based-access-control/custom-roles-portal).

1. Select **Add permissions**, and enter *Playwright* in the search box, and then select **Microsoft.AzurePlaywrightService**.

1. Select the `microsoft.playwrightservice/accounts/write` permission, and then select **Add**.

    :::image type="content" source="media/how-to-manage-workspace-access/custom-role-permissions.png" alt-text="Screenshot that shows the list of permissions for adding to the custom role in the Azure portal, highlighting the permission record to add." lightbox="media/how-to-manage-workspace-access/custom-role-permissions.png":::

1. Follow these steps to [add a role assignment](/azure/role-based-access-control/role-assignments-portal) for the custom role to the user account.

    The user can now continue to run tests in the workspace.

## Troubleshooting

Here are a few things to be aware of while you use Azure role-based access control (Azure RBAC):

- When you create a resource in Azure, such as a workspace, you are not automatically the owner of the resource. Your role is inherited from the highest scope role that you're authorized against in that subscription. As an example, if you're a Contributor for the subscription, you have the permissions to create a Microsoft Playwright Testing workspace. However, you would be assigned the Contributor role against that workspace, and not the Owner role.

- When there are two role assignments to the same Azure Active Directory user with conflicting sections of Actions/NotActions, your operations listed in NotActions from one role might not take effect if they're also listed as Actions in another role. To learn more about how Azure parses role assignments, read [How Azure RBAC determines if a user has access to a resource](/azure/role-based-access-control/overview#how-azure-rbac-determines-if-a-user-has-access-to-a-resource).

- It can sometimes take up to 1 hour for your new role assignments to take effect over cached permissions.

## Related content

- Get started with [running Playwright tests at scale](./quickstart-run-end-to-end-tests.md)

- Learn how to [manage Playwright Testing workspaces](./how-to-manage-playwright-workspace.md)
