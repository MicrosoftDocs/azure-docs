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
 
   :::image type="content" source="./media/how-to-project-admin/add-role-assignment.png" alt-text="Screenshot showing the Add menu with Add role assignment highlighted.":::

1. On the Add role assignment page, on the Role tab, search for *devcenter project admin*, select the **DevCenter Project Admin** built-in role, and then select **Next**.
 
   :::image type="content" source="./media/how-to-project-admin/project-admin-role.png" alt-text="Screenshot showing the search box highlighted.":::

1. On the Members tab, select **+ Select Members**.
 
   :::image type="content" source="./media/how-to-project-admin/project-admin-select-members.png" alt-text="Screenshot showing the Members tab with Select members highlighted.":::

1. In **Select members**, select the Active Directory Users or Groups you want to add, and then select **Select**.
 
   :::image type="content" source="./media/how-to-project-admin/select-members-search.png" alt-text="Screenshot showing the Select members pane with a user account highlighted.":::

1. On the Members tab, select **Review + assign**.

The user will now be able to manage the project and create dev box pools within it.

[!INCLUDE [permissions note](./includes/note-permission-to-create-dev-box.md)]
## Next steps

- [Quickstart: Configure the Microsoft Dev Box Preview service](quickstart-configure-dev-box-service.md)
