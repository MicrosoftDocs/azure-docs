---
title: 'Quickstart: Configure Microsoft Dev Box'
description: Quickly set up Microsoft Dev Box resources for developers to self-service a cloud-based dev box. Create a dev center, dev box definition, and dev box pool.
services: dev-box
ms.service: dev-box
ms.topic: quickstart
author: RoseHJM
ms.author: rosemalcolm
ms.date: 05/02/2025
#Customer intent: As an enterprise admin, I want to understand how to create and configure dev box components so that I can provide dev box projects for my users.
---

# Quickstart: Configure Microsoft Dev Box 

In this quickstart, you set up all the resources in Microsoft Dev Box to enable development teams to self-service their dev boxes. Learn how to create and configure a dev center, specify a dev box definition, and create a dev box pool. After you complete this quickstart, developers can use the developer portal to create and connect to a dev box.

A dev box is a daily cloud-based workstation for the developer. It's a virtual machine (VM) preconfigured with the tools and resources the developer needs for a project.

Setting up Microsoft Dev Box has two phases. First, platform engineers set up the necessary Microsoft Dev Box resources in the Azure portal. After this phase, users create and manage their dev boxes in the developer portal. This quickstart shows how to finish the first phase.

The following diagram shows the steps to set up Microsoft Dev Box in the Azure portal.

:::image type="content" source="media/quickstart-configure-dev-box-service/dev-box-build-stages.png" alt-text="Diagram that shows the stages to set up Microsoft Dev Box in the Azure portal." lightbox="media/quickstart-configure-dev-box-service/dev-box-build-stages.png":::

First, create a dev center and a project to organize dev box resources. Next, create a dev box definition to use when you create dev boxes. Then, create a dev box pool to define the network connection and dev box definition that dev boxes use. Users who have access to a project can create dev boxes from the pools associated with that project.

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

1. On the **Dev box management** tab, make sure **No** is selected.

   Select **Yes** to limit the number of dev boxes per developer, and enter the maximum number a developer can create. The default, **No**, lets developers create an unlimited number of dev boxes.

   To learn more about dev box limits, see [Tutorial: Control costs by setting dev box limits on a project](./tutorial-dev-box-limits.md).

1. (Optional) On the **Tags** tab, enter a name/value pair to assign.

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. Check the notifications to confirm the project is created. Select **Go to resource**.

1. Check that the project appears on the **Projects** page.
 
When you create a project, you might see this informational message about catalogs: *The dev center that contains this project does not have a catalog assigned. Environments cannot be deployed in this project until a catalog containing at least one template has been assigned.*

:::image type="content" source="media/quickstart-configure-dev-box-service/project-catalog-message.png" alt-text="Screenshot showing an information message." lightbox="media/quickstart-configure-dev-box-service/project-catalog-message.png":::

Because you're not setting up Deployment Environments, you can safely ignore this message.

## Create a dev box definition

Create a dev box definition in your dev center. A dev box definition specifies the VM image and VM SKU (compute size and storage) used to create dev boxes. Depending on the development project or developer profile, you might need multiple dev box definitions. For example, some developers need a specific tool set, while others need a cloud workstation with more compute resources.

Dev box definitions in a dev center are available to all projects associated with that dev center. Add at least one dev box definition to your dev center.

To create and set up a dev box definition for your dev center:

1. Open the dev center where you want to create the dev box definition.

1. Select **Dev box definitions**.

1. On the **Dev box definitions** page, select **Create**.

1. On the **Create dev box definition** page, enter the following values:

   | Setting | Value | Note |
   |---|---|---|
   | **Name** | Enter a descriptive name for your dev box definition. | |
   | **Image** | Select the base operating system for the dev box. Select an image from Azure Marketplace or Azure Compute Gallery.</br> If you're creating a dev box definition for testing, consider using the **Visual Studio 2022 Enterprise on Windows 11 Enterprise + Microsoft 365 Apps 24H2 \| Hibernate supported** image. | To use custom images when you create a dev box definition, use Azure Compute Gallery. For more information, see [Configure Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md). |
   | **Image version** | Select a specific, numbered version to make sure all dev boxes in the pool use the same image version. Select **Latest** to let new dev boxes use the latest image available.|Selecting the **Latest** image version lets the dev box pool use the most recent version of your chosen image from the gallery. This approach keeps new dev boxes up to date with the latest tools and code for your image. Existing dev boxes aren't changed when an image version is updated. |
   | **Compute** | Select the compute combination for your dev box definition. | |
   | **Storage** | Select the amount of storage for your dev box definition. | |
   | **Enable hibernation**| Leave this checkbox unselected. | |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/recommended-test-image.png" alt-text="Screenshot of the page for creating a dev box definition." lightbox="./media/quickstart-configure-dev-box-service/recommended-test-image.png":::

1. Select **Create**.

## Create a dev box pool

After you define a dev box definition in your dev center, create a dev box pool in the project. A dev box pool is a collection of dev boxes with the same settings, like the dev box definition and network connection. Developers who have access to the project in the dev center can create a dev box from a dev box pool.

Dev box pools set the location of the dev boxes through the specified network connection. Deploy dev boxes to a Microsoft-hosted network or to a network you manage. If you deploy dev boxes to a network you manage, first [configure a network connection](./how-to-configure-network-connections.md). Organizations that support developers in different geographical locations can create dev box pools for each location by specifying a nearby region.

> [!IMPORTANT]
> Associate at least one dev box pool with your project before users can create a dev box.

To create a dev box pool associated with a project:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Open the project where you want to create the dev box pool.
  
   :::image type="content" source="./media/quickstart-configure-dev-box-service/select-project.png" alt-text="Screenshot that shows the list of existing projects." lightbox="./media/quickstart-configure-dev-box-service/select-project.png":::

1. Select **Dev box pools**, then select **Create**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-pool.png" alt-text="Screenshot of an empty list of dev box pools within a project, along with selections to start creating a pool." lightbox="./media/quickstart-configure-dev-box-service/create-pool.png":::

1. On the **Create a dev box pool** pane, enter the following values:

   | Setting | Value |
   |---|---|
   | **Name** | Enter a name for the pool. The pool name is visible to developers to select when they're creating dev boxes. The name must be unique within a project. |
   | **Dev box definition** | Select an existing dev box definition. The definition determines the base image and size for the dev boxes that are created in this pool. |
   | **Network connection** | 1. Select **Deploy to a Microsoft hosted network**. </br>2. Select your desired deployment region for the dev boxes. Choose a region close to your expected dev box users for the optimal user experience. |
   | **Dev box Creator Privileges** | Select **Local Administrator** or **Standard User**. |
   | **Enable Auto-stop** | **Yes** is the default. Select **No** to disable an autostop schedule. You can configure an autostop schedule after the pool is created. |
   | **Stop time** | Select a time to shut down all the dev boxes in the pool. All dev boxes in this pool shut down at this time every day. |
   | **Time zone** | Select the time zone for the stop time. |
   | **Licensing** | Select this checkbox to confirm that your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-pool-details.png" alt-text="Screenshot of the pane for creating a dev box pool." lightbox="./media/quickstart-configure-dev-box-service/create-pool-details.png":::

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
