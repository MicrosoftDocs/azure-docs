---
title: Grant access to Azure Deployment Environments
description: Assign built-in roles so team leads and developers can manage projects and create deployment environments.
ms.service: azure-deployment-environments
ms.author: rosemalcolm
author: RoseHJM
ms.custom: peer-review-program
ms.topic: how-to
ms.date: 09/12/2025

#customer intent: As a platform engineer, I want to assign and verify project and environment-type roles so team leads and developers can manage and use projects.
---

# Configure access to Azure Deployment Environments resources

This article shows how to assign the built-in DevCenter Project Admin role for project administrators and the Deployment Environments User role for developers. Assign roles at the project level or at a specific environment-type scope to control access.

The following built-in roles are commonly used with Azure Deployment Environments:

| Role | Description |
| --- | --- |
| **DevCenter Project Admin** | Full project-level management for Deployment Environments projects. Project admins can manage project settings, environment types, and perform administrative actions across all environments in the project. |
| **Deployment Environments User** | Allows users to create, start, stop, and manage their own environments within a project. Intended for developers who need to provision and work with environments. |
| **Deployment Environments Reader** | Read-only access to environment and project resources. Use this role to grant users or service principals visibility into environments without modification rights. |

> [!NOTE]
> To delegate administration of a dev center that hosts your Deployment Environments projects, you can use the DevCenter Owner role at the dev center scope. DevCenter Owner can manage Microsoft.DevCenter resources for that dev center and manage access to those resources by assigning or removing the DevCenter Project Admin and DevCenter Dev Box roles. For details about dev center permissions, see [Manage a dev center for Dev Box](../dev-box/how-to-manage-dev-center.md#assign-dev-center-permissions-to-users).

You can create multiple projects that are associated with your dev center to align with each team's requirements. By using the built-in DevCenter Project Admin role, you can delegate project administration to a member of a team. DevCenter Project Admin users can configure project environment types to enable developers to create various types of environments. They can also apply settings to each environment type.

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

## Grant permissions for dev team leads

Assign the DevCenter Project Admin role to a team lead either at the project level or at one or more environment-type scopes. Project-level assignment grants admin rights across all environment types in that project; environment-type assignment limits admin rights to only the selected environment type.

### Assign project-level role
Assign the DevCenter Project Admin role at the project level to team leads who manage the project, its environment types, and the environments within it.

1. Sign in to the [Azure portal](https://portal.azure.com) and go to Azure Deployment Environments.
1. In the left menu, select **Projects**, then select the project you want to manage.
1. Select **Access control (IAM)** in the left menu.
1. Select **Add** > **Add role assignment**.
1. In the **Add role assignment** pane, set the following:

   | Setting | Value |
   | --- | --- |
   | **Role** | Select **DevCenter Project Admin**. |
   | **Assign access to** | Select **User, group, or service principal**. |
   | **Members** | Select the users or groups to grant administrative access. |

1. Select **Save**.

   :::image type="content" source="media/configure-project-admin/add-role-assignment-admin.png" alt-text="Screenshot of the Add role assignment pane with DevCenter Project Admin selected." lightbox="media/configure-project-admin/add-role-assignment-admin.png":::

### Assign environment type-level role

Assign the role at the environment type scope so a team lead can manage only environments of that type.

1. In the project, select **Environment types**.
1. Select the ellipsis (**...**) next to the environment type, and choose **Access control**.
1. Select **Add** > **Add role assignment**.
1. Assign **DevCenter Project Admin** to the desired users or groups and select **Save**.

   :::image type="content" source="media/configure-project-admin/project-environment-types.png" alt-text="Screenshot of the Environment types page showing how to assign DevCenter Project Admin to a specific environment type." lightbox="media/configure-project-admin/project-environment-types.png":::

## Grant permissions for developers

Assign the DevCenter Deployment Environments User or DevCenter Deployment Environments Reader role to a developer either at the project level or at one or more environment-type scopes. Project-level assignment grants permissions across all environment types in that project; environment-type assignment limits permissions to only the selected environment type.

### Assign roles at the project-level

Assign DevCenter Deployment Environments User role to developers who need to create and manage their own environments.

Assign DevCenter Deployment Environments Reader role to developers who need to view environments of a specific environment type.

1. Sign in to the [Azure portal](https://portal.azure.com) and go to Azure Deployment Environments.
1. In the left menu, select **Projects**, then select the project your developers need to access.
1. Select **Access control (IAM)** in the left menu.
1. Select **Add role assignment**.
1. In the **Add role assignment** pane, set the following:

   | Setting | Value |
   | --- | --- |
   | **Role** | Select **Deployment Environments User**. |
   | **Assign access to** | Select **User, group, or service principal**. |
   | **Members** | Select the users or groups to grant access. |

1. Select **Save**.

   :::image type="content" source="media/configure-deployment-environments-user/add-role-assignment.png" alt-text="Screenshot of the Add role assignment pane with Deployment Environments User selected." lightbox="media/configure-deployment-environments-user/add-role-assignment.png":::

### Assign roles for a specific environment type

Assign DevCenter Deployment Environments User role to developers who need to create and manage environments of a specific environment type.

Assign DevCenter Deployment Environments Reader role to developers who need to view environments of a specific environment type.

1. In the project, select **Environment types**.
1. Select the ellipsis (**...**) next to the environment type and choose **Access control**.
1. Select **Add** > **Add role assignment**.
1. Assign **Deployment Environments User** to the desired users or groups and select **Save**.

   :::image type="content" source="media/configure-deployment-environments-user/project-environment-types.png" alt-text="Screenshot of the Environment types page showing how to assign Deployment Environments User to a specific environment type." lightbox="media/configure-deployment-environments-user/project-environment-types.png":::

[!INCLUDE [note-deployment-environments-user](includes/note-deployment-environments-user.md)]

## Troubleshooting

- Role assignment propagation can take up to a minute; refresh the portal.
- If you get an authorization error, confirm your account has Microsoft.Authorization/roleAssignments/write at the project scope or a parent scope.
- Prefer assigning roles to groups rather than individuals for easier lifecycle management.
- If a role doesn't appear, confirm you're viewing the correct scope (project vs. environment type) and that the role definition exists in the subscription.

## Clean up resources

If you created test role assignments that you no longer need:

1. In the project's **Access control (IAM)** pane, locate the role assignment.
1. Select **Remove** and confirm.

## Related content

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)
