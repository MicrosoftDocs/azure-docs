---
title: Provide administrative access to Microsoft Dev Box projects
description: Learn how to manage multiple Dev Box projects by assigning admin permissions and delegating project administration.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/25/2023
ms.topic: how-to
---

# Provide administrative access to Dev Box projects for project admins

You can create multiple Microsoft Dev Box projects in the dev center to align with each team's specific requirements. By using the built-in DevCenter Project Admin role, you can delegate project administration to a member of a team. Project admins can use the network connections and dev box definitions configured at the dev center level to create and manage dev box pools within their project.

A DevCenter Project Admin can manage a project by:

- Viewing the network connections attached to the dev center.
- Viewing the dev box definitions attached to the dev center.
- Creating, viewing, updating, and deleting dev box pools in the project.

## Assign permissions to project admins

Use the following steps to assign the DevCenter Project Admin role:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Select the project that you want to give your team members access to.

   :::image type="content" source="./media/how-to-project-admin/projects-grid.png" alt-text="Screenshot that shows the list of existing projects.":::

1. On the left menu, select **Access Control (IAM)**.

   :::image type="content" source="./media/how-to-project-admin/access-control-tab.png" alt-text="Screenshot that shows the access control page for a project.":::

1. Select **Add** > **Add role assignment**.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

    | Setting | Value |
    | --- | --- |
    | **Role** | Select **DevCenter Project Admin**. |
    | **Assign access to** | Select **User, group, or service principal**. |
    | **Members** | Select the users or groups that need administrative access to the project. |

    :::image type="content" source="media/how-to-project-admin/add-role-assignment-admin.png" alt-text="Screenshot that shows the pane for adding a role assignment.":::

The users can now manage the project and create dev box pools within it.

[!INCLUDE [permissions note](./includes/note-permission-to-create-dev-box.md)]

## Next steps

- [Quickstart: Configure Microsoft Dev Box](quickstart-configure-dev-box-service.md)
