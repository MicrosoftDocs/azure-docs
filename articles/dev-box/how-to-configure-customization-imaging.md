---
title: Imaging for Dev Box Team Customizations
description: Configure dev box pools to use image definition files, optimizing customizations, and creating reusable images for your team.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: how-to
ms.date: 10/26/2024

#customer intent: As a dev center administrator or Project Admin, I want to configure dev box pools to use image definition files so that my development teams can create customized dev boxes.
---

# Configure imaging for Dev Box Team Customizations
Using a customization file simplifies the creation of dev boxes for your team. With Microsoft Dev Box customizations, you can either apply the customization file directly when creating a dev box or use it to create an image. Creating an image optimizes customizations and provides a reusable image for your team, saving time during dev box creation. In this article, you learn how to configure a pool to use a customization file as an image and create a dev box.

## Prerequisites
To complete the steps in this article, you must have a team customization file that you want to use to create a dev box. If you don't have a customization file, see [Write a customization file](./how-to-write-customization-file.md).
If you don't have an available dev center with an existing dev box definition and network connection, follow the steps in [Quickstart: Configure Microsoft Dev Box](quickstart-configure-dev-box-service.md) to create them.

## Permissions required to configure customizations
  
[!INCLUDE [permissions-for-customizations](includes/permissions-for-customizations.md)]

To manage a dev box pool, you need the following permissions:

| Action | Permissions required |
|---|---|
| _Create, delete, or update a dev box pool_ | - Owner or Contributor permissions on an Azure subscription or a specific resource group. </br> - DevCenter Project Admin permissions for the project. |

Make customizations available to your development teams by configuring a dev box pool to use a customization file (*imagedefinition.yaml*). Store the customization file in a repository linked to a catalog in your dev center or project. Specify this file as the image definition for the pool, and the customizations are applied to new dev boxes.

The following steps show you how to create a dev box pool and specify an image definition. 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **projects**. In the list of results, select **Projects**.
1. Open the Dev Box project with which you want to associate the new dev box pool.
1. Select **Dev box pools**, and then select **Create**.
1. On the **Create a dev box pool** pane, enter the following values:

   | Setting | Value |
   |---|---|
   | **Name** |Enter a name for the pool. The pool name is visible to developers to select when they're creating dev boxes. It must be unique within a project. |
   | **Definition** | Lists image definitions from accessible catalogs and dev box definitions. Select an image definition file. |
   | **Network connection** | Select **Deploy to a Microsoft hosted network**, or use an existing network connection. |
   |**Enable single sign-on** | Select **Yes** to enable single sign-on for the dev boxes in this pool. Single sign-on must be configured for the organization. See [Enable single sign-on for dev boxes](https://aka.ms/dev-box/single-sign-on). |
   | **Dev box Creator Privileges** | Select **Local Administrator** or **Standard User**. |
   | **Enable Auto-stop** | **Yes** is the default. Select **No** to disable an auto-stop schedule. You can configure an auto-stop schedule after the pool is created. |
   | **Stop time** | Select a time to shut down all the dev boxes in the pool. |
   | **Time zone** | Select the time zone that the stop time is in. |
   | **Licensing** | Select this checkbox to confirm that your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |

   :::image type="content" source="./media/how-to-configure-customization-imaging/pool-specify-image-definition.png" alt-text="Screenshot of the pane for creating a dev box pool." lightbox="./media/how-to-configure-customization-imaging/pool-specify-image-definition.png":::

1. Select **Create**.
1. Verify that the new dev box pool appears in the list. You might need to refresh the screen.
 
### Choose to build a reusable image
To optimize customizations and create a reusable image for your team, you can choose to build an image from the customization file. This image can be used to create dev boxes for your team.

1.    Select to build an image from a customization file
2.    Select your image from the list
3.    Check status until done

### Create a dev box by using the developer portal
To verify that customizations from the image definition file are applied, create a dev box in the Microsoft Dev Box developer portal:

1. Sign in to the [Microsoft Dev Box developer portal](https://aka.ms/devbox-portal).
1. Select **New** > **New dev box**.
1. In **Add a dev box**, enter the following values:

   | Setting | Value |
   |---|---|
   | **Name** | Enter a name for your dev box. Dev box names must be unique within a project. |
   | **Project** | Select a project from the dropdown list. |
   | **Dev box pool** | Select the pool that uses your image definition. The dropdown list includes all the dev box pools for the selected project. |
   | **Customizations** | Do not select the Customizations check box. Customizations are applied from the image definition file you specified for the dev box pool. |

   :::image type="content" source="./media/how-to-configure-customization-imaging/create-a-dev-box-customizations.png" alt-text="Screenshot of the dialog for adding a dev box." lightbox="./media/how-to-configure-customization-imaging/create-a-dev-box-customizations.png":::
   
1. Select **Create** to begin creating your dev box.
1. To track the progress of creation, use the dev box tile in the developer portal.
      
   :::image type="content" source="./media/how-to-configure-customization-imaging/create-a-dev-box-customizations-status.png" alt-text="Screenshot of the developer portal that shows the dev box card with a status of Creating." lightbox="./media/how-to-configure-customization-imaging/create-a-dev-box-customizations-status.png":::

When the dev box is created, the customizations from the image definition file are applied to the dev box. You can now connect to the dev box and start working.

## Related content
- [Microsoft Dev Box Team Customizations](concept-what-are-team-customizations.md)
- [Write a customization file](./how-to-write-customization-file.md) 
- [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md)