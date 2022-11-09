---
title: Configure a Microsoft Dev Box Preview project
titleSuffix: Microsoft Dev Box Preview
description: 'This quickstart shows you how to configure a Microsoft Dev Box Preview project, create a dev box pool and provide access to dev boxes for your users.'
services: dev-box
ms.service: dev-box
ms.topic: quickstart
author: RoseHJM
ms.author: rosemalcolm
ms.date: 10/12/2022
---
<!-- 
  Customer intent:
	As a Dev Box Project Admin I want to configure projects so that I can provide Dev Boxes for my users.
 -->

# Quickstart: Configure a Microsoft Dev Box Preview project
To enable developers to self-serve dev boxes in projects, you must configure dev box pools that specify the dev box definitions and network connections used when dev boxes are created. Dev box users create dev boxes using the dev box pool. 

In this quickstart, you'll perform the following tasks:

* [Create a dev box pool](#create-a-dev-box-pool)
* [Provide access to a dev box project](#provide-access-to-a-dev-box-project)

## Create a dev box pool
A dev box pool is a collection of dev boxes that you manage together. You must have a pool before users can create a dev box, and all dev boxes created in the pool will be in the same region. 

The following steps show you how to create a dev box pool associated with a project. You'll use an existing dev box definition and network connection in the dev center to configure a dev box pool. 

If you don't have an available dev center with an existing dev box definition and network connection, follow the steps in [Quickstart: Configure the Microsoft Dev Box Preview service](quickstart-configure-dev-box-service.md) to create them.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box, type *Projects* and then select **Projects** from the list.

    <!--    :::image type="content" source="./media/quickstart-configure-dev-box-projects/discovery-via-azure-portal.png" alt-text="Screenshot showing the Azure portal with the search box highlighted."::: -->

3. Open the project in which you want to create the dev box pool.
  
   :::image type="content" source="./media/quickstart-configure-dev-box-projects/projects-grid.png" alt-text="Screenshot of the list of existing projects.":::

4. Select **Dev box pools** and then select **+ Create**.
 
   :::image type="content" source="./media/quickstart-configure-dev-box-projects/dev-box-pool-grid-empty.png" alt-text="Screenshot of the list of dev box pools within a project. The list is empty.":::

5. On the **Create a dev box pool** page, enter the following values:

   |Name|Value|
   |----|----|
   |**Name**|Enter a name for the pool. The pool name is visible to developers to select when they're creating dev boxes, and must be unique within a project.|
   |**Dev box definition**|Select an existing dev box definition. The definition determines the base image and size for the dev boxes created within this pool.|
   |**Network connection**|Select an existing network connection. The network connection determines the region of the dev boxes created within this pool.|
   |**Dev Box Creator Privileges**|Select Local Administrator or Standard User.|
   |**Licensing**| Select this check box if your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |

   :::image type="content" source="./media/quickstart-configure-dev-box-projects/dev-box-pool-create.png" alt-text="Screenshot of the Create dev box pool dialog."::: 

6. Select **Add**.
 
7. Verify that the new dev box pool appears in the list. You may need to refresh the screen.

The dev box pool will be deployed and health checks will be run to ensure the image and network pass the validation criteria to be used for dev boxes. The screenshot below shows four dev box pools, each with a different status. 

   :::image type="content" source="./media/quickstart-configure-dev-box-projects/dev-box-pool-grid-populated.png" alt-text="Screenshot showing a list of existing pools.":::

## Provide access to a dev box project
Before users can create dev boxes based on the dev box pools in a project, you must provide access for them through a role assignment. The Dev Box User role enables dev box users to create, manage and delete their own dev boxes. You must have sufficient permissions to a project before you can add users to it.

1. Sign in to the [Azure portal](https://portal.azure.com).
 
1. In the search box, type *Projects* and then select **Projects** from the list.

1. Select the project you want to provide your team members access to.
 
   :::image type="content" source="./media/quickstart-configure-dev-box-projects/projects-grid.png" alt-text="Screenshot of the list of existing projects.":::

1. Select **Access Control (IAM)** from the left menu.

   :::image type="content" source="./media/quickstart-configure-dev-box-projects/access-control-tab.png" alt-text="Screenshot showing the Project Access control page with the Access Control link highlighted.":::

1. Select **Add** > **Add role assignment**.

   :::image type="content" source="./media/quickstart-configure-dev-box-projects/add-role-assignment.png" alt-text="Screenshot showing the Add menu with Add role assignment highlighted.":::

1. On the Add role assignment page, search for *devcenter dev box user*, select the **DevCenter Dev Box User** built-in role, and then select **Next**.

   :::image type="content" source="./media/quickstart-configure-dev-box-projects/dev-box-user-role.png" alt-text="Screenshot showing the Add role assignment search box highlighted.":::

1. On the Members page, select **+ Select Members**.

   :::image type="content" source="./media/quickstart-configure-dev-box-projects/dev-box-user-select-members.png" alt-text="Screenshot showing the Members tab with Select members highlighted.":::

1. On the **Select members** pane, select the Active Directory Users or Groups you want to add, and then select **Select**.

   :::image type="content" source="./media/quickstart-configure-dev-box-projects/select-members-search.png" alt-text="Screenshot showing the Select members pane with a user account highlighted.":::

1. On the Add role assignment page, select **Review + assign**.

The user will now be able to view the project and all the pools within it. They can create dev boxes from any of the pools and manage those dev boxes from the [developer portal](https://aka.ms/devbox-portal).

## Project admins

The Microsoft Dev Box service makes it possible for you to delegate administration of projects to a member of the project team. Project administrators can assist with the day-to-day management of projects for their team, like creating and managing dev box pools. To provide users permissions to manage projects, add them to the DevCenter Project Admin role. The tasks in this quickstart can be performed by project admins. To learn how to add a user to the Project Admin role, see [Provide access to projects for project admins](how-to-project-admin.md).

[!INCLUDE [permissions note](./includes/note-permission-to-create-dev-box.md)]
## Next steps

In this quickstart, you created a dev box pool within an existing project and assigned a user permission to create dev boxes based on the new pool. 

To learn about how to create to your dev box and connect to it, advance to the next quickstart:

> [!div class="nextstepaction"]
> [Create a dev box](./quickstart-create-dev-box.md)