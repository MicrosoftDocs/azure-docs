---
title: Manage Microsoft Dev Box Preview projects
titleSuffix: Microsoft Dev Box Preview
description: Learn how to manage multiple projects by delegating permissions to project admins.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 10/12/2022
ms.topic: how-to
---

# Provide access to projects for project admins

You can create multiple projects in the dev center to align with each team's specific requirements. By using the built-in DevCenter Project Admin role, you can delegate project administration to a member of a team. Project Admins can use the network connections and dev box definitions configured at the dev center level to create and manage dev box pools within their project.

A Dev Center Project Admin can manage a project by:

- Viewing the network connections attached to the dev center.
- Viewing the dev box definitions attached to the dev center.
- Creating, viewing, updating, deleting dev box pools in the project.

## Assign permissions to project admins
 
Follow the instructions below to add role assignments for this role.

1. Sign in to the [Azure portal](https://portal.azure.com).
 
1. In the search box, type *Dev box* and select **Projects**. 

1. Select the project you want to provide your team members access to.
 
   :::image type="content" source="./media/how-to-project-admin/projects-grid.png" alt-text="Screenshot showing the list of existing projects.":::

1. Select **Access Control (IAM)** from the left menu.
 
   :::image type="content" source="./media/how-to-project-admin/access-control-tab.png" alt-text="Screenshot showing the Project Access control page with the Access Control link highlighted.":::

1. Select **Add** > **Add role assignment**.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).
    
    | Setting | Value |
    | --- | --- |
    | **Role** | Select **DevCenter Dev Box Admin**. |
    | **Assign access to** | Select **User, group, or service principal**. |
    | **Members** | Select the users or groups you want to have administrative access to the project. |

    :::image type="content" source="media/how-to-project-admin/add-role-assignment-admin.png" alt-text="Screenshot that shows the Add role assignment pane.":::

The user will now be able to manage the project and create dev box pools within it.

[!INCLUDE [permissions note](./includes/note-permission-to-create-dev-box.md)]
## Next steps

- [Quickstart: Configure the Microsoft Dev Box Preview service](quickstart-configure-dev-box-service.md)
