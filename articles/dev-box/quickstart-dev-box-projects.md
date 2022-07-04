---
title: Configure a Microsoft Dev Box project
description: 'This quickstart shows you how to configure a Microsoft Dev Box project and dev box pools and provide access to dev boxes for your users.'
services: dev-box
ms.service: dev-box
ms.topic: quickstart
author: RoseHJM
ms.author: rosemalcolm
ms.date: 07/03/2022
---
<!-- 
  Customer intent:
	As an Dev Box project admin I want to create and configure projects so that I can provide Dev Boxes for my users.
 -->

# Configure a Microsoft Dev Box project

The Microsoft Dev Box service makes it possible for you to delegate administration of projects to the team that uses the resources they hold. Project administrators can assist with the day-to-day management of projects for their team, including creating dev box pools and providing access to users. In this quickstart, you'll explore these tasks.

In this quickstart, you'll perform the following tasks:

* [Create a Dev Box Pool](#create-a-dev-box-pool)
* [Provide access to a Dev Box project](#provide-access-to-a-dev-box-project)

## Create a dev box pool
The following steps show you how to create a dev box pool within a project. You'll use the dev box definition and network connection that you've already created in the DevCenter to configure a specific dev box pool. Dev box users will create their dev boxes from this pool. A dev box pool can be created and managed by the DevCenter owner or project admin.

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/projects). 

1. Select **Projects** and open the project in which you want to create the pool. 
:::image type="content" source="./media/quickstart-dev-box-projects/projects-grid.png" alt-text="Screenshot of the list of existing projects.":::

1. Select **Dev box pools** and then select **+ Add**.
:::image type="content" source="./media/quickstart-dev-box-projects/dev-box-pool-grid-empty.png" alt-text="Screenshot of the list of dev box pools within a project. The list is empty.":::

1. On the **Create a dev box pool** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Name**|Enter a name for the pool. The pool name is visible to developers to select when they're creating dev boxes, and must be unique within a project.|
   |**Dev box definition**|Select an existing dev box definition. The definition determines the base image and size for the dev boxes created within this pool.|
   |**Network connection**|Select an existing network connection. The Network Connection determines the region of the dev boxes created within this pool.|

   :::image type="content" source="./media/quickstart-dev-box-projects/dev-box-pool-create.png" alt-text="Screenshot of the Create dev box pool dialog."::: 

5. Select **Review + Create**.

6. On the **Review** tab, select **Create**.

The Pool will be deployed and health checks will be run to ensure the image and network pass the validation criteria to be used for dev boxes. 

:::image type="content" source="./media/quickstart-dev-box-projects/dev-box-pool-grid-populated.png" alt-text="Screenshot showing a list of existing pools.":::

## Provide access to a Dev Box project
After creating a dev box pool, you can assign the Dev Box User role to your team members so that they can access the pool to create dev boxes from it. Follow the instructions below to add role assignments for this role.

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/projects).

1. Select the Project you want to provide your team members access to.
   :::image type="content" source="./media/quickstart-dev-box-projects/projects-grid.png" alt-text="Screenshot of the list of existing projects.":::

1. Select **Access Control (IAM)** from the left menu.
   :::image type="content" source="./media/quickstart-dev-box-projects/access-control-tab.png" alt-text="Screenshot showing the Project Access control page with the Access Control link highlighted.":::

1. Select **Add** > **Add role assignment**.
   :::image type="content" source="./media/quickstart-dev-box-projects/add-role-assignment.png" alt-text="Screenshot showing the Add menu with Add role assignment highlighted.":::

1. On the Add role assignment page, search for *devcenter*, select the **DevCenter Dev Box User** built-in role, and then select **Next**.
   :::image type="content" source="./media/quickstart-dev-box-projects/dev-box-user-role.png" alt-text="Screenshot showing the Add role assignment search box highlighted.":::

1. On the Members page, select **+ Select Members**.
   :::image type="content" source="./media/quickstart-dev-box-projects/dev-box-user-select-members.png" alt-text="Screenshot showing the Members tab with Select members highlighted.":::

1. On the **Select members** pane, select the Active Directory Users or Groups you want to add, and then select **Select**.
   :::image type="content" source="./media/quickstart-dev-box-projects/select-members-search.png" alt-text="Screenshot showing the Select members pane with a user account highlighted.":::

1. On the Add role assignment page, select **Review + assign**.

The user will now be able to view the Project and all the Pools within it. They can create dev boxes from any of the Pools and manage those dev boxes from the [Developer Portal](https://portal.fidalgo.azure.com).

## Next steps

In this quickstart, you created a dev box pool and assigned a user permission to use it to create dev boxes. 

To learn about how to create to your dev box and connect to it, advance to the next quickstart:

> [!div class="nextstepaction"]
> [Create a dev box](./quickstart-create-dev-box.md)