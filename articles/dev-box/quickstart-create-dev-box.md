---
title: 'Quickstart: Create and Access a Dev Box in the Cloud'
titleSuffix: Microsoft Dev Box
description: 'Set up your cloud dev environment: Create a dev box in Microsoft Dev Box and connect remotely. Get started quickly and work on projects from any device.'
services: dev-box
ms.service: dev-box
ms.custom:
  - build-2024
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:05/28/2025
  - ai-gen-description
ms.topic: quickstart
author: RoseHJM
ms.author: rosemalcolm
ms.date: 05/28/2025
---

# Quickstart: Create and connect to a dev box by using the Microsoft Dev Box developer portal

Microsoft Dev Box provides cloud-based developer workstations that you can create and manage on demand. This quickstart shows you how to create a dev box in the Microsoft Dev Box developer portal and connect to it remotely. Follow these steps to quickly set up your cloud development environment and start working on your projects from anywhere.

Create and manage multiple dev boxes as a dev box user. Create a dev box for each task you're working on, and create multiple dev boxes in a single project to streamline your workflow. For example, switch to another dev box to fix a bug in a previous version, or to work on a different part of the application.

## Prerequisites

To complete this quickstart, you need:

| Product | Requirements |
|---------|--------------|
| Microsoft Dev Box | Your organization needs to set up Microsoft Dev Box with at least one project and dev box pool before you create a dev box. <br> - Platform engineers can follow these steps to set up Microsoft Dev Box: [Quickstart: Configure Microsoft Dev Box](quickstart-configure-dev-box-service.md). <br>**Permissions** <br> - You need permissions as a [Dev Box User](quickstart-configure-dev-box-service.md#provide-access-to-a-dev-box-project) for a project that has an available dev box pool. If you don't have permissions to a project, contact your admin.|
| Windows App | To connect to a dev box with the Windows App, install the Windows App on your device. <br> - [Download Windows App](https://apps.microsoft.com/detail/9n1f85v9t8bn?hl=en-us&gl=US) |

## Create a dev box

Microsoft Dev Box enables you to create cloud-hosted developer workstations in a self-service way. You can create and manage dev boxes by using the developer portal.

Depending on the project configuration and your permissions, you might have access to different projects and associated dev box configurations. If you have a choice of projects, images, and regions, select the resources that best fit your needs. For example, you might choose a region located near to you for the least latency.

You can create multiple dev boxes in a single project, and you can create multiple dev boxes in different projects. Project administrators can set limits on the number of dev boxes you can create in a project. If you reach the limit, you can't create any more dev boxes in that project until you delete one or more dev boxes.

> [!IMPORTANT]
> Your organization must configure Microsoft Dev Box with at least one project and dev box pool before you can create a dev box. If you don't see any projects or dev box pools, contact your administrator.

Create a dev box in the Microsoft Dev Box developer portal:

[!INCLUDE [developer-portal-landing-page](includes/developer-portal-landing-page.md)]

4. In **Add a dev box**, enter the following values:

   | Setting | Value |
   |---|---|
   | **Name** | Enter a name for your dev box. Dev box names must be unique within a project. |
   | **Project** | If available, select a project from the list. |
   | **Image** | If available, select an image from the list. Choose an image that contains the tools and code needed for your development tasks.|
   | **Region** | If available, select a region for your dev box. Choose a region close to you for least latency. |

   :::image type="content" source="./media/quickstart-create-dev-box/developer-portal-create-dev-box.png" alt-text="Screenshot of the dialog for adding a dev box in the developer portal." lightbox="./media/quickstart-create-dev-box/developer-portal-create-dev-box.png":::

      After you make your selections, the page shows the following information:

   - How many dev boxes you can create in the selected project, if the project has limits set.
   - Whether *Hibernation* is supported.
   - Whether you can apply *Customizations*.
   - The shutdown time if the pool where you're creating the dev box has a shutdown schedule.
   - A notification that the dev box creation process can take 25 minutes or longer.
   
5. Select **Create** to start creating your dev box.

6. Track the creation progress by using the dev box tile in the developer portal. The status changes from *Creating* to *Running* when the dev box is ready for you to connect.
      
   :::image type="content" source="./media/quickstart-create-dev-box/dev-box-tile-creating.png" alt-text="Screenshot of the developer portal showing the dev box card with a status of Creating." lightbox="./media/quickstart-create-dev-box/dev-box-tile-creating.png":::
   
      > [!Note]
   > If you get a vCPU quota error with a *QuotaExceeded* message, ask your admin to [request an increased quota limit](/azure/dev-box/how-to-request-quota-increase). If your admin can't increase the quota limit now, try selecting another pool with a region close to your location. 

[!INCLUDE [dev box runs on creation note](./includes/note-dev-box-runs-on-creation.md)]

## Connect to a dev box

After you create a dev box, connect to it remotely through the developer portal on your desktop, laptop, tablet, or phone. Microsoft Edge gives you the best experience. The developer portal lets you connect by using Windows App.

### Connect by using Windows App

[!INCLUDE [connect-with-windows-app](includes/connect-with-windows-app.md)]

## Use multiple monitors

[!INCLUDE [configure-multiple-monitors](includes/configure-multiple-monitors.md)]

## Clean up resources

In this quickstart, you created a dev box through the developer portal and connected to it by using a browser. 

When you no longer need your dev box, delete it:

[!INCLUDE [dev box runs on creation note](./includes/clean-up-resources.md)] 

## Related content

In this quickstart, you created a dev box through the developer portal and connected to it by using a browser. 

- Find out [What's new in Microsoft Dev Box](https://aka.ms/devbox/WhatsNew)
- Discover what's coming up next in Microsoft Dev Box: [Microsoft Dev Box roadmap](dev-box-roadmap.md)
- Learn how to [Manage a dev box by using the Microsoft Dev Box developer portal](how-to-create-dev-boxes-developer-portal.md)
