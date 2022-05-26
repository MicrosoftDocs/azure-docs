---
title: Create a Microsoft Dev Box.
description: This quickstart shows you how to create a Microsoft Dev Box and connect to it through RDP.
services: dev-box
ms.service: dev-box
ms.topic: quickstart
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/15/2022
---
<!-- 
  Customer intent:
	As a dev box user I want to understand how to create and access a Dev Box so that I can start work.
 -->

# Quickstart: Create a dev box by using the developer portal

Get started with Microsoft Dev Box by creating a dev box through the developer portal. After creating the dev box, you connect to it with a remote desktop (RD) session through a browser, or through the Microsoft Remote Desktop app. 

You can create and manage multiple dev boxes as a dev box user. Create a dev box for each project that you have access to, and create multiple dev boxes within a single project to help streamline work workflow. 

In this quickstart, you will:

* [Create a dev box](#create-a-dev-box)
* [Connect to a dev box](#connect-to-a-dev-box)

## Prerequisites

- Permissions as a [Dev Box User](./how-to-dev-box-user.md) on the Project that has a configured Dev Box Pool. Follow the [Create Dev Box Pool Quickstart](./quickstart-create-dev-box-pool.md) if you do not have an available pool.

## Create a dev box

1. Sign in to the [developer portal](https://portal.fidalgo.azure.com).

<!-- 1. Verify that you've logged on successfully by selecting your profile picture on the top right of the screen and viewing the user profile menu.
   :::image type="content" source="./media/quickstart-create-dev-box/dev-portal-profile.png" alt-text="Screenshot of the developer portal showing the user profile menu."::: -->

1. Select **+ Add dev box**.
   :::image type="content" source="./media/quickstart-create-dev-box/dev-portal-welcome.png" alt-text="Screenshot of the developer portal showing the Add dev box button.":::

1. In **Add a dev box**, enter the following values:

   |Name|Value|
   |----|----|
   |**Name**|A name for your dev box. Dev box names must be unique within a project.|
   |**Project**|Select a project from the dropdown list. |
   |**Dev box type**|Select a type from the dropdown list. The Dev box type dropdown lists all the dev box pools for the selected project. |
 
   :::image type="content" source="./media/quickstart-create-dev-box/dev-portal-add.png" alt-text="Screenshot of the Add a dev box dialog box.":::

1. To begin creating your dev box, select the **Add** button. You can track the progress of creation in the developer portal home page. 
   :::image type="content" source="./media/quickstart-create-dev-box/dev-portal-creating.png" alt-text="Screenshot of the developer portal showing the Your dev box card with the status Creating.":::
   >!NOTE
   >The dev box creation can take between 60 and 90 minutes.

## Connect to a dev box
Once provisioned successfully, your dev box will be running. You can access it in multiple ways. 

### Browser

For quick access in a browser tab, the Developer portal links directly to a browser session through which you can connect to and use your dev box.

1. Sign in to the [developer portal](https://portal.fidalgo.azure.com).

1. On the **Your dev box** card, select **Open in browser**.
   :::image type="content" source="./media/quickstart-create-dev-box/dev-portal-card-browser.png" alt-text="Screenshot of the Your dev box card showing the Open in browser button.":::

A new tab will open with an RD session to your dev box.

## Clean up resources

When no longer needed, you can delete your dev box.
1. Sign in to the [developer portal](https://portal.fidalgo.azure.com).

1. In **Your dev box**, from the setting menu, select **Delete**.
    :::image type="content" source="./media/quickstart-create-dev-box/dev-portal-delete-dev-box.png" alt-text="Screenshot of the Your dev box card Settings menu showing the Delete option."::: 

## Next steps

In this quickstart, you created a dev box through the developer portal. To learn more about Dev Box concepts, see [Concepts: Microsoft Dev Box key concepts](dev-box-concepts.md).