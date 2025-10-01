---
title: 'Quickstart: Configure Microsoft Dev Box'
description: Quickly set up Microsoft Dev Box resources for developers to self-service a cloud-based dev box. Create a dev center, dev box definition, and dev box pool.
services: dev-box
ms.service: dev-box
ms.topic: quickstart
author: RoseHJM
ms.author: rosemalcolm
ms.update-cycle: 90-days
ms.date: 09/23/2025
#Customer intent: As an enterprise admin, I want to understand how to create and configure dev box components so that I can provide dev box projects for my users.
---

# Quickstart: Configure Microsoft Dev Box 

In this quickstart, you set up all the resources in Microsoft Dev Box to enable development teams to self-service their dev boxes. Learn how to create and configure a dev center, specify a dev box definition, and create a dev box pool. After you complete this quickstart, developers can use the developer portal to create and connect to a dev box.

A dev box is a daily cloud-based workstation for the developer. It's a virtual machine (VM) preconfigured with the tools and resources the developer needs for a project.

Setting up Microsoft Dev Box has two phases. First, platform engineers set up the necessary Microsoft Dev Box resources in the Azure portal. After this phase, users create and manage their dev boxes in the developer portal. This quickstart shows how to finish the first phase.

The following diagram shows the steps to set up Microsoft Dev Box.

:::image type="content" source="media/quickstart-configure-dev-box-service/dev-box-build-stages.png" alt-text="Diagram that shows the stages to set up Microsoft Dev Box in the Azure portal." lightbox="media/quickstart-configure-dev-box-service/dev-box-build-stages.png":::

First, create a dev center and a project to organize dev box resources. Next, create a dev box pool to define the network connection and dev box definition that dev boxes use. Users who have access to a project can create dev boxes from the pools associated with that project.

If you already set up Microsoft Dev Box and want to learn how to create and connect to dev boxes, see [Quickstart: Create a dev box by using the developer portal](quickstart-create-dev-box.md).

## Prerequisites

To complete this quickstart, you need:

| Requirement | Details |
|-------------|---------|
| **Azure account** | An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. |
| **Permissions** | Owner or Contributor role on an Azure subscription or resource group. |
| **User licenses** | Each user needs a license for Windows 11 Enterprise or Windows 10 Enterprise, Microsoft Intune, and Microsoft Entra ID P1. These licenses are included in:<br>- Microsoft 365 E3, Microsoft 365 E5<br>- Microsoft 365 A3, Microsoft 365 A5<br>- Microsoft 365 Business Premium<br>- Microsoft 365 F3*<br>- Microsoft 365 Education Student Use Benefit<br>**Microsoft 365 F3 doesn't include a Windows Enterprise license, but it does include limited Microsoft Entra ID and Intune capabilities* |
| **Device management** | Microsoft Intune. Your organization must use Microsoft Intune for device management.  |
| **Identity** | Microsoft Entra ID. Your organization must use Microsoft Entra ID for identity and access management. |
| **Resource provider** | Register the *Microsoft.DevCenter* resource provider. For more information, see [Register resource provider](/azure/azure-resource-manager/management/resource-providers-and-types#register-resource-provider-1). |

## Create a dev center

To get started with Microsoft Dev Box, first create a dev center. A dev center in Microsoft Dev Box is a central place to manage projects, set up available dev box images and sizes, and configure networking settings so you can access organizational resources.

Follow these steps to create a dev center and manage your dev box resources:

[!INCLUDE [create-dev-center-steps](includes/create-dev-center-steps.md)]

### View a dev box definition

When you select the **Create a default dev box definition (recommended)** option as you create a dev center, Dev Box creates a dev box definition. A dev box definition specifies the VM image and VM SKU (compute size and storage) used to create dev boxes. Depending on the development project or developer profile, you might need multiple dev box definitions. For example, some developers need a specific tool set, while others need a cloud workstation with more compute resources. Dev box definitions in a dev center are available to all projects associated with that dev center. 

To view the dev box definitions for your dev center:

1. Open the dev center where you want to create the dev box definition.

1. Select **Dev box definitions**.

1. On the **Dev box definitions** page, you see a list of all dev box definitions associated with this dev center, along with their details.

You can edit a dev box definition to change the VM image or VM SKU, or to enable hibernation. For more information, see [How to manage dev box definitions](./how-to-manage-dev-box-definitions.md).

## Create a project

Dev box projects let you manage team-level settings. These settings include giving access to development teams so developers can create dev boxes. Each dev center needs at least one project.

To create and set up a project in a dev box:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. On the **Projects** page, select **Create**.

1. On the **Create a project** pane, on the **Basics** tab, enter the following values:

   | Setting | Value |
   |---|---|
   | **Subscription** | Select the subscription in which you want to create the project. |
   | **Resource group** | Select an existing resource group, or select **Create new**, then enter a name for the new resource group. |
   | **Dev center** | Select the dev center to associate with this project. All settings at the dev center level apply to the project. |
   | **Name** | Enter a name for the project. |
   | **Description** | Enter a short description of the project. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-project-create.png" alt-text="Screenshot that shows the Basics tab on the pane for creating a dev box project." lightbox="./media/quickstart-configure-dev-box-service/dev-box-project-create.png":::

1. On the **Dev box settings** tab, enter the following values:

   | Setting | Value |
   |---|---|
   | **User customizations** | Select to enable users to customize their dev boxes on creation. |
   | **Dev box limits** | Ensure the checkbox is cleared to let developers create an unlimited number of dev boxes. </br>Select **Enable** to limit the number of dev boxes per developer, and enter the maximum number a developer can create. </br> To learn more about dev box limits, see [Tutorial: Control costs by setting dev box limits on a project](./tutorial-dev-box-limits.md). |
  
   :::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-project-create-settings.png" alt-text="Screenshot that shows the Dev box settings tab on the pane for creating a dev box project." lightbox="./media/quickstart-configure-dev-box-service/dev-box-project-create-settings.png":::

1. On the **Catalogs** tab, enter the following values:

   | Setting | Value |
   |---|---|
   | **Deployment environment definitions** | Select to enable Dev Box to sync deployment environments definitions from a catalog attached to the project. |
   | **Image definitions** |  Select to enable Dev Box to sync image definitions from a catalog attached to the project. |
  
   :::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-project-create-catalogs.png" alt-text="Screenshot that shows the Catalogs tab on the pane for creating a dev box project." lightbox="./media/quickstart-configure-dev-box-service/dev-box-project-create-catalogs.png":::

1. (Optional) On the **Tags** tab, enter a name/value pair to assign.

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. Check the notifications to confirm the project is created. Select **Go to resource**.


## Create a dev box pool

After you create a project in your dev center, create a dev box pool in the project. A dev box pool is a collection of dev boxes with the same settings, like the definition, location and network connection. Developers who have access to the project can create a dev box from a dev box pool.

> [!IMPORTANT]
> Associate at least one dev box pool with your project before users can create a dev box.

To create a dev box pool associated with a project:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Open the project where you want to create the dev box pool.
  
   :::image type="content" source="./media/quickstart-configure-dev-box-service/select-project.png" alt-text="Screenshot that shows the list of existing projects." lightbox="./media/quickstart-configure-dev-box-service/select-project.png":::

1. Select **Dev box pools**, then select **Create**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-pool.png" alt-text="Screenshot of an empty list of dev box pools within a project, along with selections to start creating a pool." lightbox="./media/quickstart-configure-dev-box-service/create-pool.png":::

1. On the **Create a dev box pool** pane, on the **Basics** tab, enter the following values:

   | Setting | Value |
   |---|---|
   | **Name** | Enter a name for the pool. The pool name is visible to developers to select when they're creating dev boxes. The name must be unique within a project. |
   | **Definition** | Select an existing dev box definition or image definition. </br>A dev box definition determines the base image and size for the dev boxes that are created. </br>An image definition allows you to specify your required Compute and SKU.  |
   | **Compute** | Image definitions only. Select the VM size for the dev boxes in this pool. |
   | **Storage** | Image definition only. Select the storage size for the dev boxes in this pool. |
   | **Hibernation** | Shows whether hibernation is supported or not. |
   | **Region** |  |
   | **Network connection** | 1. Select **Deploy to a Microsoft hosted network**. </br>2. Select your desired deployment region for the dev boxes. Choose a region close to your expected dev box users for the optimal user experience. |
   | **Licensing** | Select this checkbox to confirm that your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-pool-create-basics-hibernation.png" alt-text="Screenshot of the Basics pane for creating a dev box pool." lightbox="./media/quickstart-configure-dev-box-service/dev-box-pool-create-basics-hibernation.png":::

1. on the **Management** tab, enter the following values:

   | Setting | Value |
   |---|---|
   | **Roles** | |
   | **Dev box Creator Privileges** | Select **Local Administrator** or **Standard User**. |
   | **Access** | |
   | **Enable single sign-on (SSO)** | Select to enable users to sign in to their dev boxes by using their organizational credentials. |
   | **Headless connections** | Select to enable developers to open a dev box in Visual Studio Code without a full desktop experience. |
   | **Cost controls** | |
   | **Auto-stop on schedule** | Select the checkbox to enable an autostop schedule. You can also configure an autostop schedule after the pool is created. |
   | **Stop time** | Select a time to shut down all the dev boxes in the pool. Dev boxes that support hibernation will hibernate at the specified time. Dev Boxes that don't support hibernation shut down.  |
   | **Time zone** | Select the time zone for the stop time. |
   | **Hibernate on disconnect** | Hibernates dev boxes that no one is connected to after a specified grace period. |
   | **Grace period** | Hibernates dev boxes that have never been connected to after a specified grace period. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-pool-create-management-hibernation.png" alt-text="Screenshot of the Management pane for creating a dev box pool." lightbox="./media/quickstart-configure-dev-box-service/dev-box-pool-create-management-hibernation.png":::

1. Select **Create**.

1. Check that the new dev box pool appears in the list. You might need to refresh the screen.

The Azure portal deploys the dev box pool and runs health checks to make sure the image and network pass the validation criteria for dev boxes. The following screenshot shows four dev box pools, each with a different status.

:::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-pool-grid-populated.png" alt-text="Screenshot that shows a list of dev box pools and status information." lightbox="./media/quickstart-configure-dev-box-service/dev-box-pool-grid-populated.png":::

## Provide access to a dev box project

Before users can create dev boxes from the dev box pools in a project, you need to give users access through role assignments. The Dev Box User role lets users create, manage, and delete their own dev boxes. Grant access at the project level.

> [!IMPORTANT]
> Make sure you have enough permissions to the project before adding users.

To assign roles:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Select the project you want to give team members access to.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/select-project.png" alt-text="Screenshot of the list of existing projects.":::

1. In the left menu, select **Access control (IAM)**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/project-permissions.png" alt-text="Screenshot that shows the page for project access control." lightbox="./media/quickstart-configure-dev-box-service/project-permissions.png":::

1. In the command bar, select **Add** > **Add role assignment**.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml).

   | Setting | Value |
   |---|---|
   | **Role** | Select **DevCenter Dev Box User**. |
   | **Assign access to** | Select **User, group, or service principal**. |
   | **Members** | Select the users or groups you want to let access the project. |

   :::image type="content" source="media/how-to-dev-box-user/add-role-assignment-user.png" alt-text="Screenshot that shows the pane for adding a role assignment." lightbox="media/how-to-dev-box-user/add-role-assignment-user.png":::

   Now, the user can view the project and all the pools in it. The user can create dev boxes from any pool and manage those dev boxes from the [developer portal](https://aka.ms/devbox-portal).

[!INCLUDE [supported accounts note](./includes/note-supported-accounts.md)]

## Delegate to project administrators

Microsoft Dev Box lets you delegate project admin tasks to a team member. Project admins help manage projects for their teams. They create and manage [dev box pools](./how-to-manage-dev-box-pools.md), set [dev box limits](./tutorial-dev-box-limits.md), and configure [autostop schedules](./how-to-configure-stop-schedule.md). The DevCenter Project Admin role doesn't let the project admin add users to the project.

To let users manage projects, assign them the DevCenter Project Admin role. Follow the steps in [Provide access to a dev box project](#provide-access-to-a-dev-box-project), but select the **DevCenter Project Admin** role instead of the Dev Box User role. For more info, see [Provide access to projects for project admins](how-to-project-admin.md).

[!INCLUDE [permissions note](./includes/note-permission-to-create-dev-box.md)]

## Discover more about Microsoft Dev Box

- Find out [What's new in Microsoft Dev Box](https://aka.ms/devbox/WhatsNew)
- Discover what's coming up next in Microsoft Dev Box: [Microsoft Dev Box roadmap](dev-box-roadmap.md)
- [Learn how Microsoft Dev Box impacts developer productivity](https://azure.microsoft.com/blog/study-showcases-how-microsoft-dev-box-impacts-developer-productivity/)

## Next step

In this quickstart, you set up the Microsoft Dev Box resources that let users create their own dev boxes. To learn how to create and connect to a dev box, go to the next quickstart:

> [!div class="nextstepaction"]
> [Create a dev box](./quickstart-create-dev-box.md)
