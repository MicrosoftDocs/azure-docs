---
title: Grant access to Microsoft Dev Box projects
description: "Grant administrators and developers access to Microsoft Dev Box projects by assigning DevCenter roles at the project level."
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom: peer-review-program
ms.topic: how-to
ms.date: 09/08/2025

#customer intent: As a platform engineer, I want to assign the correct roles so that team members can manage projects and create dev boxes.

---

# Grant access to Microsoft Dev Box projects

This article explains how to grant administrators and developers access to Microsoft Dev Box projects. Use Azure role-based access control (Azure RBAC) to assign the built-in DevCenter roles at the project level.

Use the DevCenter Project Admin role to delegate project administration. Use the DevCenter Dev Box User role to grant developers the ability to create and manage dev boxes.

## Prerequisites

- You must have an Azure account with permission to assign roles at the project level.
- You must have an existing dev center and at least one project.

## Assign DevCenter Project Admin role

To grant a user project admin permission in Microsoft Dev Box, assign the DevCenter Project Admin role at the project level.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Select the project that you want to give your team members access to.

   :::image type="content" source="./media/how-to-project-admin/projects-grid.png" alt-text="Screenshot of the Projects list showing projects grid and search results in the Azure portal.":::

1. On the left, select **Access Control (IAM)**.

   :::image type="content" source="./media/how-to-project-admin/access-control-tab.png" alt-text="Screenshot of the project's Access Control (IAM) tab showing role assignments in the Azure portal.":::

1. Select **Add** > **Add role assignment**.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](/role-based-access-control/role-assignments-portal.yml).

   | Setting | Value |
   | --- | --- |
   | **Role** | Select **DevCenter Project Admin**. |
   | **Assign access to** | Select **User, group, or service principal**. |
   | **Members** | Select the users or groups that need administrative access to the project. |

   :::image type="content" source="media/how-to-project-admin/add-role-assignment-admin.png" alt-text="Screenshot of the Add role assignment pane with DevCenter Project Admin role selected in the Azure portal.":::

The users can now manage the project and create dev box pools within it.

[!INCLUDE [permissions note](./includes/note-permission-to-create-dev-box.md)]

## Assign DevCenter Dev Box User role

To grant a user access to create and manage a dev box in Microsoft Dev Box, assign the DevCenter Dev Box User role at the project level.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Select the project that you want to give your team members access to.

   :::image type="content" source="./media/how-to-dev-box-user/projects-grid.png" alt-text="Screenshot of the Projects list with a project selected to assign DevCenter roles in the Azure portal.":::

1. On the left menu, select **Access Control (IAM)**.

1. Select **Add** > **Add role assignment**.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](/role-based-access-control/role-assignments-portal.yml).

   | Setting | Value |
   | --- | --- |
   | **Role** | Select **DevCenter Dev Box User**. |
   | **Assign access to** | Select **User, group, or service principal**. |
   | **Members** | Select the users or groups that you want to have access to the project. |

   :::image type="content" source="media/how-to-dev-box-user/add-role-assignment-user.png" alt-text="Screenshot of the Add role assignment pane with DevCenter Dev Box User role selected in the Azure portal.":::

Users can now view the project and all pools within it. Dev box users can create dev boxes from any pool and manage them from the [developer portal](https://aka.ms/devbox-portal).

[!INCLUDE [supported accounts note](./includes/note-supported-accounts.md)]

[!INCLUDE [dev box runs on creation note](./includes/note-dev-box-runs-on-creation.md)]

## Clean up resources

- If you created temporary role assignments for testing, remove them when you finish.

## Related content

- [Quickstart: Configure Microsoft Dev Box](quickstart-configure-dev-box-service.md)
- [Quickstart: Create a dev box by using the developer portal](quickstart-create-dev-box.md)
