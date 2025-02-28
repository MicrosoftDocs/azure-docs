---
title: 'Quickstart: Create a dev box'
titleSuffix: Microsoft Dev Box
description: In this quickstart, learn how developers can create a dev box in the Microsoft Dev Box developer portal, and remotely connect to it through the browser.
services: dev-box
ms.service: dev-box
ms.custom:
  - build-2024
ms.topic: quickstart
author: RoseHJM
ms.author: rosemalcolm
ms.date: 02/27/2025
#Customer intent: As a dev box user, I want to understand how to create and access a dev box so that I can start work.
---

# Quickstart: Create and connect to a dev box by using the Microsoft Dev Box developer portal

In this quickstart, you get started with Microsoft Dev Box by creating a dev box through the developer portal. After you create the dev box, you can connect to it through a browser or through a Remote Desktop client like Windows App.

You can create and manage multiple dev boxes as a dev box user. Create a dev box for each task that you're working on, and create multiple dev boxes within a single project to help streamline your workflow. For example, you might switch to another dev box to fix a bug in a previous version, or if you need to work on a different part of the application.

## Prerequisites

To complete this quickstart, you need:

| Product | Requirements |
|---------|--------------|
| Microsoft Dev Box | Your organization must configure Microsoft Dev Box with at least one project and dev box pool before you can create a dev box. <br> - Platform engineers can follow these steps to configure Microsoft Dev Box: [Quickstart: Configure Microsoft Dev Box](quickstart-configure-dev-box-service.md). <br>**Permissions** <br> - You must have permissions as a [Dev Box User](quickstart-configure-dev-box-service.md#provide-access-to-a-dev-box-project) for a project that has an available dev box pool. If you don't have permissions to a project, contact your administrator.|
| Windows App | To connect to a dev box by using the Windows App, you need to install the Windows App on your device. <br> - [Download Windows App](https://apps.microsoft.com/detail/9n1f85v9t8bn?hl=en-us&gl=US) |

## Create a dev box

Microsoft Dev Box enables you to create cloud-hosted developer workstations in a self-service way. You can create and manage dev boxes by using the developer portal.

Depending on the project configuration and your permissions, you have access to different projects and associated dev box configurations. If you have a choice of projects and dev box pools, select the project and dev box pool that best fits your needs. For example, you might choose a project that has a dev box pool located near to you for least latency.

> [!IMPORTANT]
> Your organization must configure Microsoft Dev Box with at least one project and dev box pool before you can create a dev box. If you don't see any projects or dev box pools, contact your administrator.

To create a dev box in the Microsoft Dev Box developer portal:

[!INCLUDE [developer-portal-landing-page](includes/developer-portal-landing-page.md)]

3. In **Add a dev box**, enter the following values:

   | Setting | Value |
   |---|---|
   | **Name** | Enter a name for your dev box. Dev box names must be unique within a project. |
   | **Project** | Select a project from the dropdown list. |
   | **Dev box pool** | Select a pool from the dropdown list, which includes all the dev box pools for that project. Choose a dev box pool near to you for least latency.|

   :::image type="content" source="./media/quickstart-create-dev-box/developer-portal-create-dev-box.png" alt-text="Screenshot of the dialog for adding a dev box." lightbox="./media/quickstart-create-dev-box/developer-portal-create-dev-box.png":::

   After you make your selections, the page shows you the following information:

   - How many dev boxes you can create in the project that you selected, if the project has limits configured.
   - Whether *Hibernation* is supported or not.
   - Whether *Customizations* is enabled or not.
   - A shutdown time if the pool where you're creating the dev box has a shutdown schedule.
   - A notification that the dev box creation process can take 25 minutes or longer.
   
4. Select **Create** to begin creating your dev box.

5. To track the creation process, use the dev box tile in the developer portal.
      
   :::image type="content" source="./media/quickstart-create-dev-box/dev-box-tile-creating.png" alt-text="Screenshot of the developer portal that shows the dev box card with a status of Creating." lightbox="./media/quickstart-create-dev-box/dev-box-tile-creating.png":::
   
   > [!Note]
   > If you encounter a vCPU quota error with a *QuotaExceeded* message, ask your administrator to [request an increased quota limit](/azure/dev-box/how-to-request-quota-increase). If your admin can't increase the quota limit at this time, try selecting another pool with a region close to your location. 

[!INCLUDE [dev box runs on creation note](./includes/note-dev-box-runs-on-creation.md)]

## Connect to a dev box

After you create a dev box, you can connect to it remotely through the developer portal on your desktop, laptop, tablet, or phone. The developer portal provides the option to connect by using Windows App.

### Connect by using Windows App

To connect to a dev box by using the Windows App:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. Select **Connect via app**.

   :::image type="content" source="./media/quickstart-create-dev-box/dev-box-connect-via-app.png" alt-text="Screenshot of dev box tile, showing the Connect via app option." lightbox="./media/quickstart-create-dev-box/dev-box-connect-via-app.png":::

   > [!Note]
   > Make sure that you have installed the Windows App on your device. [Download Windows App](https://aka.ms/devbox-windows-app).

## Use multiple monitors

To use multiple monitors with your dev box, you need to configure your developer portal user settings.

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. Select the user settings icon in the top right corner.
 
   :::image type="content" source="media/quickstart-create-dev-box/dev-box-user-settings-icon.png" alt-text="Screenshot of the developer portal, showing the user settings icon in the top right corner.":::

1. In **User settings**, select **Use multiple monitors**.
 
   :::image type="content" source="media/quickstart-create-dev-box/dev-box-user-settings-multiple-monitors.png" alt-text="Screenshot of the dev box user settings, showing the option for using multiple monitors.":::

## Clean up resources

When you no longer need your dev box, you can delete it:

[!INCLUDE [dev box runs on creation note](./includes/clean-up-resources.md)] 

## Related content

In this quickstart, you created a dev box through the developer portal and connected to it by using a browser. 

- Learn how to [Manage a dev box by using the Microsoft Dev Box developer portal](how-to-create-dev-boxes-developer-portal.md)