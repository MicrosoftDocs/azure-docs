---
title: Assign Azure roles using the Azure portal - Azure RBAC
description: Learn how to grant access to Azure resources for users, groups, service principals, or managed identities using the Azure portal and Azure role-based access control (Azure RBAC).
author: rolyon
ms.author: rolyon
manager: pmwongera
ms.date: 08/01/2025
ms.service: role-based-access-control
ms.topic: how-to
ms.custom:
  - sfi-image-nochange
  - ge-structured-content-pilot
  - subject-rbac-steps
---

# Assign Azure roles using the Azure portal

[!INCLUDE [Azure RBAC definition grant access](../../includes/role-based-access-control/definition-grant.md)] This article describes how to assign roles using the Azure portal.

If you need to assign administrator roles in Microsoft Entra ID, see [Assign Microsoft Entra roles to users](../active-directory/roles/manage-roles-portal.md).

## Prerequisites

[!INCLUDE [Azure role assignment prerequisites](../../includes/role-based-access-control/prerequisites-role-assignments.md)]

## Step 1: Identify the needed scope

[!INCLUDE [Scope for Azure RBAC introduction](../../includes/role-based-access-control/scope-intro.md)] For more information, see [Understand scope](scope-overview.md).

![Diagram that shows the scope levels for Azure RBAC.](../../includes/role-based-access-control/media/scope-levels.png)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Search box at the top, search for the scope you want to grant access to. For example, search for **Management groups**, **Subscriptions**, **Resource groups**, or a specific resource.

1. Click the specific resource for that scope.

   The following shows an example resource group.

   ![Screenshot of resource group overview page.](./media/shared/rg-overview.png)

## Step 2: Open the Add role assignment page

**Access control (IAM)** is the page that you typically use to assign roles to grant access to Azure resources. It's also known as identity and access management (IAM) and appears in several locations in the Azure portal.

1. Click **Access control (IAM)**.

   The following shows an example of the Access control (IAM) page for a resource group.

   ![Screenshot of Access control (IAM) page for a resource group.](./media/shared/rg-access-control.png)

1. Click the **Role assignments** tab to view the role assignments at this scope.

1. Click **Add** > **Add role assignment**.

   If you don't have permissions to assign roles, the Add role assignment option will be disabled.

   ![Screenshot of Add > Add role assignment menu.](./media/shared/add-role-assignment-menu.png)

   The Add role assignment page opens.

## Step 3: Select the appropriate role

To select a role, follow these steps:

1. On the **Role** tab, select a role that you want to use.

   You can search for a role by name or by description. You can also filter roles by type and category.

   ![Screenshot of Add role assignment page with Role tab.](./media/shared/roles.png)

   Note, If you're unsure of which role you need to assign, you can now use Copilot to help you select the appropriate role. (Limited preview. This capability is being deployed in stages, so it might not be available yet in your tenant or your interface might look different.)

1. (Optional) In the **Role** tab, click the **Copilot can help pick role** button. The Copilot dialog box opens.

   ![Screenshot of Copilot button in the Add role assignment page.](./media/role-assignments-portal/copilot-for-role-assignment.png)

   In the dialog box, you can add descriptive prompts to tell Copilot your requirements for the role, and what you need a user to be authorized to do, for example, *"Help me select a role to deploy and manage Azure functions."*, or *"Which role should I use if I want a user to manage and view a workspace?"* Using phrases such as *'Help me select...'* or *'Which role should I use to...'* helps Copilot understand your intent more clearly in order to deliver the best results.

   From the direction of your prompt, Copilot suggests a role, or multiple roles, based on the requirements provided. Copilot asks you to confirm by **Select permissions**. Copilot then recommends a role based on the criteria provided. You can **Select role**, or you can ask Copilot to **Recommend other roles**. If you select **Select role**, you're taken back to the **Add role assignment** page where you can select the recommended role and view its details.

1. If you want to assign a privileged administrator role, select the **Privileged administrator roles** tab to select the role.

   For best practices when using privileged administrator role assignments, see [Best practices for Azure RBAC](best-practices.md#limit-privileged-administrator-role-assignments).

   ![Screenshot of Add role assignment page with Privileged administrator roles tab selected.](./media/shared/privileged-administrator-roles.png)

1. In the **Details** column, click **View** to get more details about a role.

   ![Screenshot of View role details pane with Permissions tab.](./media/role-assignments-portal/select-role-permissions.png)

1. Click **Next**.

## Step 4: Select who needs access

To select who needs access, follow these steps:

1. On the **Members** tab, select **User, group, or service principal** to assign the selected role to one or more Microsoft Entra users, groups, or service principals (applications).

   ![Screenshot of Add role assignment page with Members tab.](./media/shared/members.png)

1. Click **Select members**.

1. Find and select the users, groups, or service principals.

   You can type in the **Select** box to search the directory for display name or email address.

   ![Screenshot of Select members pane.](./media/shared/select-members.png)

1. Click **Select** to add the users, groups, or service principals to the Members list.

1. To assign the selected role to one or more managed identities, select **Managed identity**.

1. Click **Select members**.

1. In the **Select managed identities** pane, select whether the type is [user-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md) or [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md).

1. Find and select the managed identities.

   For system-assigned managed identities, you can select managed identities by Azure service instance.

   ![Screenshot of Select managed identities pane.](./media/role-assignments-portal/select-managed-identity.png)

1. Click **Select** to add the managed identities to the Members list.

1. In the **Description** box enter an optional description for this role assignment.

   Later you can show this description in the role assignments list.

1. Click **Next**.

## Step 5: (Optional) Add condition

If you selected a role that supports conditions, a **Conditions** tab will appear and you have the option to add a condition to your role assignment. A [condition](conditions-overview.md) is an additional check that you can optionally add to your role assignment to provide more fine-grained access control.

The **Conditions** tab will look different depending on the role you selected.

### Delegate condition

If you selected one of the following privileged roles, follow the steps in this section.

- [Owner](built-in-roles.md#owner)
- [Role Based Access Control Administrator](built-in-roles.md#role-based-access-control-administrator)
- [User Access Administrator](built-in-roles.md#user-access-administrator)

1. On the **Conditions** tab under **What user can do**, select the **Allow user to only assign selected roles to selected principals (fewer privileges)** option.

   :::image type="content" source="./media/shared/condition-constrained.png" alt-text="Screenshot of Add role assignment with the Constrained option selected." lightbox="./media/shared/condition-constrained.png":::

1. Click **Select roles and principals** to add a condition that constrains the roles and principals this user can assign roles to.

1. Follow the steps in [Delegate Azure role assignment management to others with conditions](delegate-role-assignments-portal.md#step-3-add-a-condition).

### Storage condition

If you selected one of the following storage roles, follow the steps in this section.

- [Storage Blob Data Contributor](built-in-roles.md#storage-blob-data-contributor)
- [Storage Blob Data Owner](built-in-roles.md#storage-blob-data-owner)
- [Storage Blob Data Reader](built-in-roles.md#storage-blob-data-reader)
- [Storage Queue Data Contributor](built-in-roles.md#storage-queue-data-contributor)
- [Storage Queue Data Message Processor](built-in-roles.md#storage-queue-data-message-processor)
- [Storage Queue Data Message Sender](built-in-roles.md#storage-queue-data-message-sender)
- [Storage Queue Data Reader](built-in-roles.md#storage-queue-data-reader)

1. Click **Add condition** if you want to further refine the role assignments based on storage attributes.

   ![Screenshot of Add role assignment page with Add condition tab.](./media/shared/condition.png)

1. Follow the steps in [Add or edit Azure role assignment conditions](conditions-role-assignments-portal.md#step-3-review-basics).

## Step 6: Select assignment type

If you have a Microsoft Entra ID P2 or Microsoft Entra ID Governance license, an **Assignment type** tab will appear for management group, subscription, and resource group scopes. Use eligible assignments to provide just-in-time access to a role. Users with eligible and/or time-bound assignments must have a valid license.

If you don't want to use the PIM functionality, select the **Active** assignment type and **Permanent** assignment duration options. These settings create a role assignment where the principal always has permissions in the role.

This capability is being deployed in stages, so it might not be available yet in your tenant or your interface might look different. For more information, see [Eligible and time-bound role assignments in Azure RBAC](././pim-integration.md).

1. On the **Assignment type** tab, select the **Assignment type**.

   - **Eligible** - User must perform one or more actions to use the role, such as perform a multifactor authentication check, provide a business justification, or request approval from designated approvers. You can't create eligible role assignments for applications, service principals, or managed identities because they can't perform the activation steps.
   - **Active** -  User doesn't have to perform any action to use the role.

   :::image type="content" source="./media/shared/assignment-type-eligible.png" alt-text="Screenshot of Add role assignment with Assignment type options displayed." lightbox="./media/shared/assignment-type-eligible.png":::

1. Depending on your settings, for **Assignment duration**, select **Permanent** or **Time bound**.

   Select permanent if you want member to always be allowed to activate or use role. Select time bound to specify start and end dates. This option might be disabled if permanent assignments creation is not allowed by PIM policy.

1. If **Time bound** is selected, set **Start date and time** and **Start date and time** to specify when user is allowed to activate or use role.

   It's possible to set the start date in the future. The maximum allowed eligible duration depends on your Privileged Identity Management (PIM) policy.

1. (Optional) Use **Configure PIM Policy** to configure expiration options, role activation requirements (approval, multifactor authentication, or Conditional Access authentication context), and other settings.

   When you select the **Update PIM policy** link, a PIM page is displayed. Select **Settings** to configure PIM policy for roles. For more information, see [Configure Azure resource role settings in Privileged Identity Management](/entra/id-governance/privileged-identity-management/pim-resource-roles-configure-role-settings).

1. Click **Next**.

## Step 7: Assign role

1. On the **Review + assign** tab, review the role assignment settings.

   ![Screenshot of Assign a role page with Review + assign tab.](./media/role-assignments-portal/review-assign.png)

1. Click **Review + assign** to assign the role.

   After a few moments, the security principal is assigned the role at the selected scope.

   ![Screenshot of role assignment list after assigning role.](./media/role-assignments-portal/rg-role-assignments.png)

1. If you don't see the description for the role assignment, click **Edit columns** to add the **Description** column.

## Edit assignment

If you have a Microsoft Entra ID P2 or Microsoft Entra ID Governance license, you can edit your role assignment type settings. For more information, see [Eligible and time-bound role assignments in Azure RBAC](./pim-integration.md).

1. On the **Access control (IAM)** page, click the **Role assignments** tab to view the role assignments at this scope.

1. Find the role assignment that you want to edit.

1. In the **State** column, click the link, such as **Eligible time-bound** or **Active permanent**.

   The **Edit assignment** pane appears where you can update the role assignment type settings. The pane might take a few moments to open.

   :::image type="content" source="./media/shared/assignment-type-edit.png" alt-text="Screenshot of Edit assignment pane with Assignment type options displayed." lightbox="./media/shared/assignment-type-edit.png":::

1. When finished, click **Save**.

   Your updates might take a while to be processed and reflected in the portal.

## Related content

- [Assign a user as an administrator of an Azure subscription](/azure/role-based-access-control/role-assignments-portal-subscription-admin)
- [Remove Azure role assignments](/azure/role-based-access-control/role-assignments-remove)
- [Troubleshoot Azure RBAC](troubleshooting.md)
