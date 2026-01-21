---
title: 'Quickstart: Configure Microsoft Dev Box'
description: Quickly set up Microsoft Dev Box resources for developers to self-service a cloud-based dev box. Create a dev center, dev box project, and dev box pool.
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

In this quickstart, you set up all the resources in Microsoft Dev Box to enable development teams to self-service their dev boxes. Learn how to create and configure a dev center, select an image for your dev boxes, and create a dev box pool. After you complete this quickstart, developers can use the developer portal to create and connect to a dev box.

A dev box is a daily cloud-based workstation for the developer. It's a virtual machine (VM) preconfigured with the tools and resources the developer needs for a project.

Setting up Microsoft Dev Box has two phases. First, platform engineers set up the necessary Microsoft Dev Box resources in the Azure portal. After this phase, users create and manage their dev boxes in the developer portal. This quickstart shows how to finish the first phase.

The following diagram shows the steps to set up Microsoft Dev Box.

:::image type="content" source="media/quickstart-configure-dev-box-service/dev-box-build-stages.png" alt-text="Diagram that shows the stages to set up Microsoft Dev Box in the Azure portal." lightbox="media/quickstart-configure-dev-box-service/dev-box-build-stages.png":::

First, create a dev center and a project to organize dev box resources. Next, create a dev box pool to define the network connection and marketplace image, custom image, or dev box definition that dev boxes use. Users who have access to a project can create dev boxes from the pools associated with that project.

If you already set up Microsoft Dev Box and want to learn how to create and connect to dev boxes, see [Quickstart: Create a dev box by using the developer portal](quickstart-create-dev-box.md).

## Prerequisites

To complete this quickstart, you need:

| Requirement | Details |
|-------------|---------|
| **Azure account** | An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin. |
| **Permissions** | Owner or Contributor role on an Azure subscription or resource group. |
| **User licenses** | Each user needs a license for Windows 11 Enterprise or Windows 10 Enterprise, Microsoft Intune, and Microsoft Entra ID P1. These licenses are included in:<br>- Microsoft 365 E3, Microsoft 365 E5<br>- Microsoft 365 A3, Microsoft 365 A5<br>- Microsoft 365 Business Premium<br>- Microsoft 365 F3*<br>- Microsoft 365 Education Student Use Benefit<br>**Microsoft 365 F3 doesn't include a Windows Enterprise license, but it does include limited Microsoft Entra ID and Intune capabilities*<br><br>To assign licenses to users, see [Assign Microsoft 365 licenses to users](/microsoft-365/admin/manage/assign-licenses-to-users). |
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

After you create a project in your dev center, create a dev box pool in the project. A dev box pool is a collection of dev boxes with the same settings, like the image, location, and network connection. Developers who have access to the project can create a dev box from a dev box pool. You must associate at least one dev box pool with your project before users can create a dev box.

When creating a dev box pool, you choose an image source. You can select an image definition, custom image, marketplace image, or dev box definition. Image definitions, custom images, and marketplace images offer greater customization opportunities and greater flexibility by letting you independently select compute size and storage.

### Understand image and definition types

Choose from four image options for your dev box pool. For greater customization, use image definitions, custom images, or marketplace images, which let you select compute size and storage separately. The table describes each option and when to use it.

| Type | Description | When to use |
|------|-------------|-------------|
| **Image definition** | YAML-based customization files that define a base image and apply team-specific customizations. Can be built into reusable images. | For team-specific environments with automated software installation and configuration. Best for standardized team setups. |
| **Custom image** | Your organization's custom images stored in Azure Compute Gallery. | For organization-specific configurations. Allows independent selection of compute size and storage. |
| **Marketplace image** | Preconfigured images available from Azure Marketplace, such as Windows 11 Enterprise or Visual Studio images. | For standard configurations with common development tools. Offers flexibility to select compute size and storage independently. |
| **Dev box definition** | Legacy option that bundles a base image with a fixed VM size and storage configuration. | For backward compatibility with existing configurations. Consider migrating to marketplace or custom images for more flexibility. |

- **Azure Compute Gallery** is a service for managing and sharing custom images across your organization. Learn more at [Configure Azure Compute Gallery for Microsoft Dev Box](how-to-configure-azure-compute-gallery.md).
- **Marketplace images** are preconfigured VM images available from the Azure Marketplace. They include common operating systems and development tools.


[!INCLUDE [create-dev-box-pool](includes/create-dev-box-pool.md)]

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

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

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
