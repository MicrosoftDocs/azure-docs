---
title: How to manage a dev box project
titleSuffix: Microsoft Dev Box Preview
description: This article describes how to create, and delete Microsoft Dev Box Preview dev box projects.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 10/26/2022
ms.topic: how-to
---

<!-- Intent: As a dev infrastructure manager, I want to be able to manage dev box projects so that I can provide appropriate dev boxes to my users. -->

# Manage a dev box project
A project is the point of access to Microsoft Dev Box Preview for the development team members. A project contains dev box pools, which specify the dev box definitions and network connections used when dev boxes are created. Dev managers can configure the project with dev box pools that specify dev box definitions appropriate for their team's workloads. Dev box users create dev boxes from the dev box pools they have access to through their project memberships.

Each project is associated with a single dev center. When you associate a project with a dev center, all the settings at the dev center level will be applied to the project automatically. 

## Project admins

Microsoft Dev Box makes it possible for you to delegate administration of projects to a member of the project team. Project administrators can assist with the day-to-day management of projects for their team, like creating and managing dev box pools. To provide users permissions to manage projects, add them to the DevCenter Project Admin role. The tasks in this quickstart can be performed by project admins. 

To learn how to add a user to the Project Admin role, see [Provide access to a dev box project](#provide-access-to-a-dev-box-project).

[!INCLUDE [permissions note](./includes/note-permission-to-create-dev-box.md)]

## Permissions
To manage a dev box project, you need the following permissions:

|Action|Permission required|
|-----|-----|
|Create or delete dev box project|Owner, Contributor, or Write permissions on the dev center in which you want to create the project. |
|Update a dev box project|Owner, Contributor, or Write permissions on the project.|
|Create, delete, and update dev box pools in the project|Owner, Contributor, or DevCenter Project Admin.|
|Manage a dev box within the project|Owner, Contributor, or DevCenter Project Admin.|
|Add a dev box user to the project|Owner permissions on the project.|

## Create a dev box project

The following steps show you how to create and configure a project in dev box.

1. In the [Azure portal](https://portal.azure.com), in the search box, type *Projects* and then select **Projects** from the list. 

1. On the Projects page, select **+Create**.
 
1. On the **Create a project** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which you want to create the project.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group.|
   |**Dev center**|Select the dev center to which you want to associate this project. All the dev center level settings will be applied to the project.|
   |**Name**|Enter a name for your project. |
   |**Description**|Enter a brief description of the project. |

   :::image type="content" source="./media/how-to-manage-dev-box-projects/dev-box-project-create.png" alt-text="Screenshot of the Create a dev box project basics tab.":::

1. [Optional] On the **Tags** tab, enter a name and value pair that you want to assign.

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. Confirm that the project is created successfully by checking the notifications. Select **Go to resource**.

1. Verify that you see the **Project** page.
## Delete a dev box project
You can delete a dev box project when you're no longer using it. Deleting a project is permanent and cannot be undone. You cannot delete a project that has dev box pools associated with it.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type *Projects* and then select **Projects** from the list.

1. Open the project you want to delete.
  
1. Select the dev box project you want to delete and then select **Delete**.
 
   :::image type="content" source="./media/how-to-manage-dev-box-projects/delete-project.png" alt-text="Screenshot of the list of existing dev box pools, with the one to be deleted selected.":::

1.  In the confirmation message, select **Confirm**.

    :::image type="content" source="./media/how-to-manage-dev-box-projects/confirm-delete-project.png" alt-text="Screenshot of the Delete dev box pool confirmation message.":::


## Provide access to a dev box project
Before users can create dev boxes based on the dev box pools in a project, you must provide access for them through a role assignment. The Dev Box User role enables dev box users to create, manage and delete their own dev boxes. You must have sufficient permissions to a project before you can add users to it.

1. Sign in to the [Azure portal](https://portal.azure.com).
 
1. In the search box, type *Projects* and then select **Projects** from the list.

1. Select the project you want to provide your team members access to.
 
   :::image type="content" source="./media/how-to-manage-dev-box-projects/projects-grid.png" alt-text="Screenshot of the list of existing projects.":::

1. Select **Access Control (IAM)** from the left menu.

   :::image type="content" source="./media/how-to-manage-dev-box-projects/access-control-tab.png" alt-text="Screenshot showing the Project Access control page with the Access Control link highlighted.":::

1. Select **Add** > **Add role assignment**.

   :::image type="content" source="./media/how-to-manage-dev-box-projects/add-role-assignment.png" alt-text="Screenshot showing the Add menu with Add role assignment highlighted.":::

1. On the Add role assignment page, search for *devcenter dev box user*, select the **DevCenter Dev Box User** built-in role, and then select **Next**.

   :::image type="content" source="./media/how-to-manage-dev-box-projects/dev-box-user-role.png" alt-text="Screenshot showing the Add role assignment search box highlighted.":::

1. On the Members page, select **+ Select Members**.

   :::image type="content" source="./media/how-to-manage-dev-box-projects/dev-box-user-select-members.png" alt-text="Screenshot showing the Members tab with Select members highlighted.":::

1. On the **Select members** pane, select the Active Directory Users or Groups you want to add, and then select **Select**.

   :::image type="content" source="./media/how-to-manage-dev-box-projects/select-members-search.png" alt-text="Screenshot showing the Select members pane with a user account highlighted.":::

1. On the Add role assignment page, select **Review + assign**.

The user will now be able to view the project and all the pools within it. They can create dev boxes from any of the pools and manage those dev boxes from the [developer portal](https://aka.ms/devbox-portal).

## Next steps

- [Manage dev box pools](./how-to-manage-dev-box-pools.md)
- [Create dev box definitions](./quickstart-configure-dev-box-service.md#create-a-dev-box-definition)
- [Configure an Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md)