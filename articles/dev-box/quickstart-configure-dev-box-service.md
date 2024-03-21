---
title: 'Quickstart: Configure Microsoft Dev Box'
description: Quickly set up Microsoft Dev Box resources for developers to self-service a cloud-based dev box. Create a dev center, dev box definition, and dev box pool.
services: dev-box
ms.service: dev-box
ms.topic: quickstart
author: RoseHJM
ms.author: rosemalcolm
ms.date: 12/15/2023
#Customer intent: As an enterprise admin, I want to understand how to create and configure dev box components so that I can provide dev box projects for my users.
---

# Quickstart: Configure Microsoft Dev Box 

In this quickstart, you set up all the resources in Microsoft Dev Box to enable development teams to self-service their dev boxes. Learn how to create and configure a dev center, specify a dev box definition, and create a dev box pool. After you complete this quickstart, developers can use the developer portal to create and connect to a dev box.

A dev box acts as a day-to-day cloud-based workstation for the developer. A dev box is a virtual machine (VM) preconfigured with the tools and resources the developer needs for a project.

The process of setting up Microsoft Dev Box involves two distinct phases. In the first phase, platform engineers configure the necessary Microsoft Dev Box resources through the Azure portal. After this phase is complete, users can proceed to the next phase, creating and managing their dev boxes through the developer portal. This quickstart shows you how to complete the first phase.

The following graphic shows the steps required to configure Microsoft Dev Box in the Azure portal. 

:::image type="content" source="media/quickstart-configure-dev-box-service/dev-box-build-stages.png" alt-text="Image that shows the stages required to configure Microsoft Dev Box." lightbox="media/quickstart-configure-dev-box-service/dev-box-build-stages.png":::

First, create a dev center and a project to organize dev box resources. Next, create a dev box definition to use when creating dev boxes. Then, create a dev box pool to define the network connection and dev box definition that dev boxes use. Users who have access to a project can create dev boxes from the pools associated with that project.

If you already have a Microsoft Dev Box configured and you want to learn how to create and connect to dev boxes, see [Quickstart: Create a dev box by using the developer portal](quickstart-create-dev-box.md).

## Prerequisites

To complete this quickstart, you need:

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Owner or Contributor role on an Azure subscription or resource group.
- Microsoft Entra ID. Your organization must use Microsoft Entra ID for identity and access management.
- Microsoft Intune. Your organization must use Microsoft Intune for device management.
- User licenses. To use Dev Box, each user must be licensed for Windows 11 Enterprise or Windows 10 Enterprise, Microsoft Intune, and Microsoft Entra ID P1. These licenses are available independently and are included in the following subscriptions:
  - Microsoft 365 F3
  - Microsoft 365 E3, Microsoft 365 E5
  - Microsoft 365 A3, Microsoft 365 A5
  - Microsoft 365 Business Premium
  - Microsoft 365 Education Student Use Benefit
- If your organization routes egress traffic through a firewall, open the appropriate ports. For more information, see [Network requirements](/windows-365/enterprise/requirements-network).

## Create a dev center

To get started with Microsoft Dev Box, you first create a dev center. A dev center in Microsoft Dev Box provides a centralized place to manage a collection of projects, the configuration of available dev box images and sizes, and the networking settings to enable access to organizational resources.

Use the following steps to create a dev center so you can manage your dev box resources: 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev centers**. In the list of results, select **Dev centers**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/discover-dev-centers.png" alt-text="Screenshot that shows the Azure portal with the search box and the result for dev centers." lightbox="./media/quickstart-configure-dev-box-service/discover-dev-centers.png":::

1. On the **Dev centers** page, select **Create**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-dev-center.png" alt-text="Screenshot that shows the Azure portal with the Create button on the page for dev centers." lightbox="./media/quickstart-configure-dev-box-service/create-dev-center.png":::

1. On the **Create a dev center** pane, on the **Basics** tab, enter the following values:

   | Setting | Value |
   |---|---|
   | **Subscription** | Select the subscription in which you want to create the dev center. |
   | **ResourceGroup** | Select an existing resource group, or select **Create new** and then enter a name for the new resource group. |
   | **Name** | Enter a name for your dev center. |
   | **Location** | Select the location or region where you want the dev center to be created. |
   | **Attach a quick start catalog** | Clear both checkboxes. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-dev-center-not-selected.png" alt-text="Screenshot that shows the Basics tab on the pane for creating a dev center." lightbox="./media/quickstart-configure-dev-box-service/create-dev-center-not-selected.png":::

   For a list of the currently supported Azure locations with capacity, see [Frequently asked questions about Microsoft Dev Box](https://aka.ms/devbox_acom).

1. (Optional) On the **Tags** tab, enter a name/value pair that you want to assign.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-dev-center-tags.png" alt-text="Screenshot that shows the Tags tab on the page for creating a dev center." lightbox="./media/quickstart-configure-dev-box-service/create-dev-center-tags.png":::

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. Track the progress of the dev center creation from any page in the Azure portal by opening the **Notifications** pane.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/notifications-pane.png" alt-text="Screenshot that shows the Notifications pane in the Azure portal." lightbox="./media/quickstart-configure-dev-box-service/notifications-pane.png":::

1. When the deployment completes, select **Go to resource**. Confirm that the dev center page appears.

### Create a project

Dev box projects enable you to manage team-level settings. These settings include providing access to development teams so developers can create dev boxes. Each dev center needs at least one project.

To create and configure a project in a dev box:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. On the **Projects** page, select **Create**.

1. On the **Create a project** pane, on the **Basics** tab, enter the following values:

   | Setting | Value |
   |---|---|
   | **Subscription** | Select the subscription in which you want to create the project. |
   | **Resource group** | Select an existing resource group, or select **Create new** and then enter a name for the new resource group. |
   | **Dev center** | Select the dev center that you want to associate with this project. All the settings at the dev center level apply to the project. |
   | **Name** | Enter a name for the project. |
   | **Description** | Enter a brief description of the project. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-project-create.png" alt-text="Screenshot that shows the Basics tab on the pane for creating a dev box project." lightbox="./media/quickstart-configure-dev-box-service/dev-box-project-create.png":::

1. On the **Dev box management** tab, ensure **No** is selected.

   You can select **Yes** to limit the number of dev boxes per developer, and specify the maximum number of dev boxes a developer can create. The default, **No**, means developers can create an unlimited number of dev boxes.

   To learn more about dev box limits, see [Tutorial: Control costs by setting dev box limits on a project](./tutorial-dev-box-limits.md).

1. (Optional) On the **Tags** tab, enter a name/value pair that you want to assign.

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. Confirm that the project is created successfully by checking the notifications. Select **Go to resource**.

1. Verify that the project appears on the **Projects** page.
 
As you create a project, you might see this informational message about catalogs: 

:::image type="content" source="media/quickstart-configure-dev-box-service/project-catalog-message.png" alt-text="Screenshot of the informational message, The dev center that contains this project does not have a catalog assigned. Environments cannot be deployed in this project until a catalog containing at least one template has been assigned." lightbox="media/quickstart-configure-dev-box-service/project-catalog-message.png":::

Because you're not configuring Deployment Environments, you can safely ignore this message.

## Create a dev box definition

Next, you create a dev box definition in your dev center. A dev box definition defines the VM image and the VM SKU (compute size + storage) that are used in the creation of the dev boxes. Depending on the type of development project or developer profiles, you can create multiple dev box definitions. For example, some developers might need a specific developer tool set, whereas others need a cloud workstation that has more compute resources.

The dev box definitions you create in a dev center are available for all projects associated with that dev center. You need to add at least one dev box definition to your dev center.

To create and configure a dev box definition for your dev center:

1. Open the dev center in which you want to create the dev box definition.

1. Select **Dev box definitions**.

1. On the **Dev box definitions** page, select **Create**.

1. On the **Create dev box definition** page, enter the following values:

   | Setting | Value | Note |
   |---|---|---|
   | **Name** | Enter a descriptive name for your dev box definition. | |
   | **Image** | Select the base operating system for the dev box. You can select an image from Azure Marketplace or from Azure Compute Gallery. </br> If you're creating a dev box definition for testing purposes, consider using the **Visual Studio 2022 Enterprise on Windows 11 Enterprise + Microsoft 365 Apps 22H2** image. | To access custom images when you create a dev box definition, you can use Azure Compute Gallery. For more information, see [Configure Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md). |
   | **Image version** | Select a specific, numbered version to ensure that all the dev boxes in the pool always use the same version of the image. Select **Latest** to ensure that new dev boxes use the latest image available.|Selecting the **Latest** image version enables the dev box pool to use the most recent version of your chosen image from the gallery. This approach ensures the created dev boxes stay up to date with the latest tools and code for your image. Existing dev boxes aren't modified when an image version is updated. |
   | **Compute** | Select the compute combination for your dev box definition. | |
   | **Storage** | Select the amount of storage for your dev box definition. | |
   | **Enable hibernation**| Leave this checkbox unselected. | |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/recommended-test-image.png" alt-text="Screenshot that shows the page for creating a dev box definition." lightbox="./media/quickstart-configure-dev-box-service/recommended-test-image.png":::

1. Select **Create**.

## Create a dev box pool

Now that you defined a dev box definition in your dev center, you can create a dev box pool in the project. A dev box pool is the collection of dev boxes that have the same settings, such as the dev box definition and network connection. Developers that have access to the project in the dev center, can then choose to create a dev box from a dev box pool.

Dev box pools define the location of the dev boxes through the specified network connection. You can choose to deploy dev boxes to a Microsoft-hosted network or to a network that you manage. If you choose to deploy dev boxes to a network that you manage, you must first [configure a network connection](./how-to-configure-network-connections.md). Organizations that support developers in multiple geographical locations can create dev box pools for each location by specifying a nearby region.

> [!IMPORTANT]
> You must associate at least one dev box pool with your project before users can create a dev box.

To create a dev box pool associated with a project:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Open the project in which you want to create the dev box pool.
  
   :::image type="content" source="./media/quickstart-configure-dev-box-service/select-project.png" alt-text="Screenshot that shows the list of existing projects." lightbox="./media/quickstart-configure-dev-box-service/select-project.png":::

1. Select **Dev box pools**, and then select **Create**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-pool.png" alt-text="Screenshot of an empty list of dev box pools within a project, along with selections to start creating a pool." lightbox="./media/quickstart-configure-dev-box-service/create-pool.png":::

1. On the **Create a dev box pool** pane, enter the following values:

   | Setting | Value |
   |---|---|
   | **Name** | Enter a name for the pool. The pool name is visible to developers to select when they're creating dev boxes. The name must be unique within a project. |
   | **Dev box definition** | Select an existing dev box definition. The definition determines the base image and size for the dev boxes that are created in this pool. |
   | **Network connection** | 1. Select **Deploy to a Microsoft hosted network**. </br>2. Select your desired deployment region for the dev boxes. Choose a region close to your expected dev box users for the optimal user experience. |
   | **Dev box Creator Privileges** | Select **Local Administrator** or **Standard User**. |
   | **Enable Auto-stop** | **Yes** is the default. Select **No** to disable an auto-stop schedule. You can configure an auto-stop schedule after the pool is created. |
   | **Stop time** | Select a time to shut down all the dev boxes in the pool. All dev boxes in this pool shut down at this time every day. |
   | **Time zone** | Select the time zone for the stop time. |
   | **Licensing** | Select this checkbox to confirm that your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-pool-details.png" alt-text="Screenshot of the pane for creating a dev box pool." lightbox="./media/quickstart-configure-dev-box-service/create-pool-details.png":::

1. Select **Create**.

1. Verify that the new dev box pool appears in the list. You might need to refresh the screen.

The Azure portal deploys the dev box pool and runs health checks to ensure that the image and network pass the validation criteria for dev boxes. The following screenshot shows four dev box pools, each with a different status.

:::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-pool-grid-populated.png" alt-text="Screenshot that shows a list of dev box pools and status information." lightbox="./media/quickstart-configure-dev-box-service/dev-box-pool-grid-populated.png":::

## Provide access to a dev box project

Before users can create dev boxes based on the dev box pools in a project, you must provide access for users through role assignments. The Dev Box User role enables dev box users to create, manage, and delete their own dev boxes. You grant access for the user at the level of the project.

> [!IMPORTANT]
> You must have sufficient permissions to a project before you can add users to it.

To assign roles:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Select the project that you want to give team members access to.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/select-project.png" alt-text="Screenshot of the list of existing projects.":::

1. On the left menu, select **Access control (IAM)**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/project-permissions.png" alt-text="Screenshot that shows the page for project access control." lightbox="./media/quickstart-configure-dev-box-service/project-permissions.png":::

1. On the command bar, select **Add** > **Add role assignment**.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml).

   | Setting | Value |
   |---|---|
   | **Role** | Select **DevCenter Dev Box User**. |
   | **Assign access to** | Select **User, group, or service principal**. |
   | **Members** | Select the users or groups that you want to be able to access to the project. |

   :::image type="content" source="media/how-to-dev-box-user/add-role-assignment-user.png" alt-text="Screenshot that shows the pane for adding a role assignment." lightbox="media/how-to-dev-box-user/add-role-assignment-user.png":::

   The user can now view the project and all the pools within it. The user can create dev boxes from any of the pools and manage those dev boxes from the [developer portal](https://aka.ms/devbox-portal).

[!INCLUDE [supported accounts note](./includes/note-supported-accounts.md)]

## Delegate to project administrators

Microsoft Dev Box makes it possible for you to delegate administration of projects to a member of the project team. Project administrators can assist with the day-to-day management of projects for their teams. They can create and manage [dev box pools](./how-to-manage-dev-box-pools.md), set [dev box limits](./tutorial-dev-box-limits.md), and configure [auto-stop schedules](./how-to-configure-stop-schedule.md). Currently, the DevCenter Project Admin role doesn't allow the project admin to add users to the project.

To give users permissions to manage projects, assign the DevCenter Project Admin role to them. You can assign the DevCenter Project Admin role by using the steps described earlier in [Provide access to a dev box project](#provide-access-to-a-dev-box-project) and select the **DevCenter Project Admin** role instead of the Dev Box User role. For more information, see [Provide access to projects for project admins](how-to-project-admin.md).

[!INCLUDE [permissions note](./includes/note-permission-to-create-dev-box.md)]

## Next step

In this quickstart, you configured the Microsoft Dev Box resources that are required to enable users to create their own dev boxes. To learn how to create and connect to a dev box, advance to the next quickstart:

> [!div class="nextstepaction"]
> [Create a dev box](./quickstart-create-dev-box.md)
