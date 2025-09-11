---
title: Configure access to Azure Deployment Environments projects
description: Assign built-in roles so team leads and developers can manage projects and create deployment environments.
ms.service: azure-deployment-environments
ms.author: rosemalcolm
author: RoseHJM
ms.topic: how-to
ms.date: 09/09/2025

#customer intent: As a platform engineer, I want to assign and verify project and environment-type roles so team leads and developers can manage and use projects.
---

# Configure access to Azure Deployment Environments projects

This article shows how to assign the built-in DevCenter Project Admin role for project administrators (team leads) and the Deployment Environments User role for developers. Assign roles at the project level or at a specific environment-type scope to control access.

## Prerequisites

- An Azure account with permission to create role assignments at the project, resource-group, or subscription scope.
- Access to the Azure portal: https://portal.azure.com.
- A project created in Azure Deployment Environments.

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

## Assign DevCenter Project Admin (project administrators)

Use this role for dev team leads who manage project environment types.

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

Verify the role assignment: On the project's Access control (IAM) page, confirm the new member appears for the DevCenter Project Admin role.

### Assign DevCenter Project Admin for a specific environment type

1. In the project, select **Environment types**.
1. Select the ellipsis (**...**) next to the environment type, and choose **Access control**.
1. Select **Add** > **Add role assignment**.
1. Assign **DevCenter Project Admin** to the desired users or groups and select **Save**.

:::image type="content" source="media/configure-project-admin/project-environment-types.png" alt-text="Screenshot of the environment types associated with a project." lightbox="media/configure-project-admin/project-environment-types.png":::

## Assign Deployment Environments User (developers)

Use this role for developers who need to create and manage their own environments.

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

Verify the role assignment: On the project's Access control (IAM) page, confirm the new member appears for the Deployment Environments User role.

### Assign Deployment Environments User for a specific environment type

1. In the project, select **Environment types**.
1. Select the ellipsis (**...**) next to the environment type and choose **Access control**.
1. Select **Add** > **Add role assignment**.
1. Assign **Deployment Environments User** to the desired users or groups and select **Save**.

:::image type="content" source="media/configure-deployment-environments-user/project-environment-types.png" alt-text="Screenshot of the environment types associated with a project." lightbox="media/configure-deployment-environments-user/project-environment-types.png":::

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

* [Provide access for dev team leads to Deployment Environments projects](./how-to-configure-project-admin.md)
* [Provide access for developers to Deployment Environments projects](./how-to-configure-deployment-environments-user.md)
* [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml)
