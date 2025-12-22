---
title: Grant access to Microsoft Dev Box
description: Assign built-in roles so team leads and developers can manage projects and create dev boxes.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom: peer-review-program
ms.topic: how-to
ms.date: 09/12/2025

#customer intent: As a platform engineer, I want to assign the correct roles so that team members can manage projects and create dev boxes.

---

# Configure access to Microsoft Dev Box projects

This article explains how to grant administrators and developers access to Microsoft Dev Box projects. Use Azure role-based access control (Azure RBAC) to assign the built-in DevCenter roles at the project level.

Dev Box has the following built-in roles:

| Role | Description |
|---|---|
| **DevCenter Project Admin** | - View network connections attached to the dev center<br>- View dev box definitions attached to the dev center<br>- Create, view, update, and delete dev box pools in the project |
| **DevCenter Dev Box User**  | - View pools within a project<br>- Create dev boxes<br>- Connect to a dev box<br>- Manage dev boxes they created<br>- Delete dev boxes they created |

You can create multiple Microsoft Dev Box projects in the dev center to align with each team's specific requirements. By using the built-in DevCenter Project Admin role, you can delegate project administration to a member of a team. Project admins can use the network connections and dev box definitions configured at the dev center level to create and manage dev box pools within their project.

Team members must have access to a specific Microsoft Dev Box project before they can create dev boxes. Use the built-in DevCenter Dev Box User role to assign permissions to Active Directory users or groups. You assign the role at the project level in Microsoft Dev Box.

## Prerequisites

- You must have an Azure account with permission to create role assignments on the project. 
- You must have a dev center and at least one project.

## Permissions required

To create role assignments, you need permission to create role assignments on the target resource. Specifically:

- Required permission actions:
  - Microsoft.Authorization/roleAssignments/write
  - Microsoft.Authorization/roleAssignments/read (for verification)
  - Microsoft.Authorization/roleDefinitions/read (to list available roles)

- Recommended built-in roles that include these actions:
  - Owner
  - User Access Administrator

If your organization uses custom roles, ensure the role includes Microsoft.Authorization/roleAssignments/write for the intended scope.

## Assign DevCenter Project Admin role

To grant a user project admin permission in Microsoft Dev Box, assign the DevCenter Project Admin role at the project level.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Select the project that you want to give your team members access to.

   :::image type="content" source="./media/how-to-project-admin/projects-grid.png" alt-text="Screenshot of the Projects list showing projects grid and search results in the Azure portal.":::

1. On the left, select **Access Control (IAM)**.

   :::image type="content" source="./media/how-to-project-admin/access-control-tab.png" alt-text="Screenshot of the project's Access Control (IAM) tab showing role assignments in the Azure portal.":::

1. Select **Add** > **Add role assignment**.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

   | Setting | Value |
   | --- | --- |
   | **Role** | Select **DevCenter Project Admin**. |
   | **Assign access to** | Select **User, group, or service principal**. |
   | **Members** | Select the users or groups that need admin access to the project. |

   :::image type="content" source="media/how-to-project-admin/add-role-assignment-admin.png" alt-text="Screenshot of the Add role assignment pane with DevCenter Project Admin role selected in the Azure portal.":::

The users can now manage the project and create dev box pools within it.

[!INCLUDE [permissions note](./includes/note-permission-to-create-dev-box.md)]

Verify the role assignment: On the project's Access Control (IAM) page, confirm the new member appears for the DevCenter Project Admin role.

## Assign DevCenter Dev Box User role

To grant a user access to create and manage dev boxes in Microsoft Dev Box, assign the DevCenter Dev Box User role at the project level.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Select the project that you want to give your team members access to.

   :::image type="content" source="./media/how-to-dev-box-user/projects-grid.png" alt-text="Screenshot of the Projects list with a project selected to assign DevCenter roles in the Azure portal.":::

1. On the left menu, select **Access Control (IAM)**.

1. Select **Add** > **Add role assignment**.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

   | Setting | Value |
   | --- | --- |
   | **Role** | Select **DevCenter Dev Box User**. |
   | **Assign access to** | Select **User, group, or service principal**. |
   | **Members** | Select the users or groups that you want to have access to the project. |

   :::image type="content" source="media/how-to-dev-box-user/add-role-assignment-user.png" alt-text="Screenshot of the Add role assignment pane with DevCenter Dev Box User role selected in the Azure portal.":::

Users can now view the project and all pools within it. Dev box users can create dev boxes from any pool and manage them from the [developer portal](https://aka.ms/devbox-portal).

[!INCLUDE [supported accounts note](./includes/note-supported-accounts.md)]

[!INCLUDE [dev box runs on creation note](./includes/note-dev-box-runs-on-creation.md)]


## Troubleshooting

- Role assignment propagation can take a minute; refresh the portal and wait a short time before retrying.
- If you get an authorization error, confirm your account has Microsoft.Authorization/roleAssignments/write at the project or parent scope.
- If the user doesn't see the project or pools after a successful assignment, check that the assignment was made at the correct scope (project vs. subscription/resource group) and that the user has a supported account type.

## Clean up resources

If you created test role assignments that you no longer need:

1. In the project's **Access control (IAM)** pane, locate the role assignment.
1. Select **Remove** and confirm.

## Related content

- [Quickstart: Configure Microsoft Dev Box](quickstart-configure-dev-box-service.md)
- [Quickstart: Create a dev box by using the developer portal](quickstart-create-dev-box.md)
