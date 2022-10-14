---
title: Provide access to dev box users
titleSuffix: Microsoft Dev Box Preview
description: Learn how to provide access to projects for dev box users so that they can create and manage dev boxes.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 10/12/2022
ms.topic: how-to
---

# Provide access to projects for dev box users

Team members must have access to a specific Microsoft Dev Box Preview project before they can create dev boxes. By using the built-in DevCenter Dev Box User role, you can assign permissions to Active Directory Users or Groups at the project level. 

A DevCenter Dev Box User can:

- View pools within a project.
- Create dev boxes.
- Connect to a dev box.
- Manage dev boxes that they created.
- Delete dev boxes that they created.

## Assign permissions to dev box users

1. Sign in to the [Azure portal](https://portal.azure.com).
 
1. In the search box, type *Dev box* and select **Projects**. 

1. Select the project you want to provide your team members access to.
 
   :::image type="content" source="./media/how-to-dev-box-user/projects-grid.png" alt-text="Screenshot showing the list of existing projects.":::

1. Select **Access Control (IAM)** from the left menu.
 
   :::image type="content" source="./media/how-to-dev-box-user/access-control-tab.png " alt-text="Screenshot showing the Project Access control page with the Access Control link highlighted.":::

1. Select **Add** > **Add role assignment**.
 
   :::image type="content" source="./media/how-to-dev-box-user/add-role-assignment.png" alt-text="Screenshot showing the Add menu with Add role assignment highlighted.":::

1. On the Add role assignment page, on the Role tab, search for *devcenter dev box user*, select the **DevCenter Dev Box User** built-in role, and then select **Next**.
 
   :::image type="content" source="./media/how-to-dev-box-user/dev-box-user-role.png" alt-text="Screenshot showing the search box.":::

1. On the Members tab, select **+ Select Members**.
 
   :::image type="content" source="./media/how-to-dev-box-user/dev-box-user-select-members.png" alt-text="Screenshot showing the Members tab with Select members highlighted.":::

1. In **Select members**, select the Active Directory Users or Groups you want to add, and then select **Select**.
 
   :::image type="content" source="./media/how-to-dev-box-user/select-members-search.png" alt-text="Screenshot showing the Select members pane with a user account highlighted.":::

1. On the Members tab, select **Review + assign**.

The user will now be able to view the project and all the pools within it. Dev box users can create dev boxes from any of the pools and manage those dev boxes from the [developer portal](https://aka.ms/devbox-portal).

[!INCLUDE [dev box runs on creation note](./includes/note-dev-box-runs-on-creation.md)]
## Next steps

- [Quickstart: Create a dev box by using the developer portal](quickstart-create-dev-box.md)