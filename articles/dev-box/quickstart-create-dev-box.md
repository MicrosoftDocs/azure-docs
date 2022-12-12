---
title: Create a Microsoft Dev Box Preview
titleSuffix: Microsoft Dev Box Preview
description: This quickstart shows you how to create a Microsoft Dev Box Preview and connect to it through a browser.
services: dev-box
ms.service: dev-box
ms.topic: quickstart
author: RoseHJM
ms.author: rosemalcolm
ms.date: 10/12/2022
---
<!-- 
  Customer intent:
	As a Dev Box User I want to understand how to create and access a dev box so that I can start work.
 -->

# Quickstart: Create a dev box by using the developer portal

Get started with Microsoft Dev Box Preview by creating a dev box through the developer portal. After creating the dev box, you connect to it with a remote desktop (RD) session through a browser, or through a remote desktop app. 

You can create and manage multiple dev boxes as a dev box user. Create a dev box for each task that you're working on, and create multiple dev boxes within a single project to help streamline your workflow. 

In this quickstart, you will:

* [Create a dev box](#create-a-dev-box)
* [Connect to a dev box](#connect-to-a-dev-box)

## Prerequisites

- Permissions as a [Dev Box User](./quickstart-configure-dev-box-project.md#provide-access-to-a-dev-box-project) for a project that has an available dev box pool. If you don't have permissions to a project, contact your administrator.

## Create a dev box

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

2. Select **+ Add dev box**.
   :::image type="content" source="./media/quickstart-create-dev-box/dev-portal-welcome.png" alt-text="Screenshot of the developer portal showing the Add dev box button.":::

3. In **Add a dev box**, enter the following values:

   |Name|Value|
   |----|----|
   |**Name**|A name for your dev box. Dev box names must be unique within a project.|
   |**Project**|Select a project from the dropdown list. |
   |**Dev box pool**|Select a pool from the dropdown list. The dev box pool dropdown lists all the dev box pools for the selected project. |
 
   :::image type="content" source="./media/quickstart-create-dev-box/add-dev-box.png" alt-text="Screenshot of the Add a dev box dialog box.":::

4. Select **Add** to begin creating your dev box. 

5. You can track the progress of creation in the developer portal home page. 

   :::image type="content" source="./media/quickstart-create-dev-box/dev-portal-creating.png" alt-text="Screenshot of the developer portal showing the dev box card with the status Creating.":::

[!INCLUDE [dev box runs on creation note](./includes/note-dev-box-runs-on-creation.md)]   
## Connect to a dev box
Once you've provisioned your dev box, you can access it in multiple ways. 

### Browser

For quick access in a browser tab, the developer portal links directly to a browser session through which you can connect to and use your dev box.

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. To connect to a dev box, select **Open in browser**.

   :::image type="content" source="./media/quickstart-create-dev-box/dev-portal-card-rdp.png" alt-text="Screenshot of dev box card showing the Open in browser option.":::

A new tab will open with an RD session to your dev box.

## Clean up resources

When no longer needed, you can delete your dev box.
1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. For the dev box you want to delete, from the setting menu, select **Delete**.
   :::image type="content" source="./media/quickstart-create-dev-box/dev-portal-delete-dev-box.png" alt-text="Screenshot of the dev box Settings menu with the Delete option highlighted."::: 

1. To confirm the deletion, select **Delete**.
   :::image type="content" source="./media/quickstart-create-dev-box/dev-portal-delete-dev-box-confirm.png" alt-text="Screenshot of the Delete dev box confirmation message with the Delete button highlighted.":::  

## Next steps

In this quickstart, you created a dev box through the developer portal. To learn how to connect to a dev box using a remote desktop app, see [Quickstart: Use a remote desktop client to connect to a dev box](./quickstart-connect-to-dev-box-with-remote-desktop-app.md).
