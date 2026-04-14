---
title: Use the developer portal
titleSuffix: Microsoft Dev Box
description: Learn how to create, connect, manage, and get information about a dev box by using the Microsoft Dev Box developer portal.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.update-cycle: 180-days
ms.date: 11/17/2025
ms.topic: how-to

# customer intent: As a developer, I want to learn how to perform tasks through the developer portal so that I can create and manage my dev boxes.
---

# Use the Microsoft Dev Box developer portal

This article shows you how to use the Microsoft Dev Box developer portal as a central location to manage your dev boxes. As a developer, you can access your dev boxes in the developer portal instead of having to use the Azure portal.

You can view information and perform many actions by using the **More actions** menu on a dev box tile in the developer portal. For example, you can shut down or restart a running dev box, or start a stopped dev box. Available options depend on the state of the dev box and the configuration of the dev box pool it belongs to.

## Prerequisites

| Category | Requirements |
|---------|--------------|
| Microsoft Dev Box | Before you can create or access a dev box, your organization must set up Microsoft Dev Box with at least one project and one dev box pool. To set up Microsoft Dev Box for an organization, see [Quickstart: Configure Microsoft Dev Box](quickstart-configure-dev-box-service.md).|
| Permissions | To create or access a dev box, you need [Dev Box User](quickstart-configure-dev-box-service.md#provide-access-to-a-dev-box-project) permissions in a project that has an available dev box pool. If you don't have permissions to a project, contact your admin.|

## Create a dev box

Create a dev box in the Microsoft Dev Box developer portal by following the instructions in [Quickstart: Create a dev box by using the developer portal](quickstart-create-dev-box.md#create-a-dev-box). You can create more dev boxes as needed by selecting **New dev box** at upper left in the portal.

For example, you might create separate dev boxes for the following scenarios:

- **Workloads.** Create separate dev boxes for your frontend work and your backend work, or create multiple dev boxes for your backend system.
- **Bug fixing.** Use separate dev boxes for each bug fix to work on the specific task and troubleshoot the issue without affecting your primary machine.

You can also create dev boxes through the Azure CLI dev center extension. For more information, see [Configure Microsoft Dev Box from the command-line with the Azure CLI](how-to-install-dev-box-cli.md).

## Connect through an app

After you create your dev box, you can connect to it through the Windows App remote desktop application or through a browser.

### Connect through the Windows App

Windows App is the default app for connecting to Microsoft Dev Box from any device, including your phone or laptop. The Windows App is available for Windows, macOS, iOS/iPadOS, Android/Chrome OS (preview), and on web browsers.

[!INCLUDE [connect-with-windows-app](includes/connect-with-windows-app.md)]  

### Connect through a browser

For light workloads, you can use a browser like Microsoft Edge to access your dev box from your phone or laptop. The browser is useful for tasks such as a quick bug fix or reviewing a GitHub pull request.

To connect to a dev box by using the browser:

1. [Sign in to the developer portal](https://aka.ms/devbox-portal), select the caret next to **Connect via app** on the dev box tile, and then select **Open in browser**.

   :::image type="content" source="./media/how-to-create-dev-boxes-developer-portal/dev-portal-open-in-browser.png" alt-text="Screenshot of dev box tile that shows the option for opening in a browser.":::

1. A new browser window opens. Select the **In Session Settings** you want and then select **Connect**.

1. Enter the password for the account you use in the developer portal and then select **Sign In**.

## Configure multiple monitors

[!INCLUDE [configure-multiple-monitors](includes/configure-multiple-monitors.md)]

## Shut down, restart, or start a dev box

To shut down, restart, or start a dev box:

1. [Sign in to the developer portal](https://aka.ms/devbox-portal) and select the **More actions** icon on the dev box tile.

1. For a running dev box, select **Shut down** or **Restart** from the menu.

   :::image type="content" source="media/how-to-create-dev-boxes-developer-portal/dev-box-actions-shutdown.png" alt-text="Screenshot of the developer portal showing the actions menu for a running dev box.":::

   For a stopped dev box, select **Start**.

   :::image type="content" source="media/how-to-create-dev-boxes-developer-portal/dev-box-actions-start.png" alt-text="Screenshot of the developer portal showing the actions menu for a stopped dev box."::: 

## Get information about a dev box

You can use the Microsoft Dev Box developer portal to view information about a dev box, such as its creation date, source image, and region.

To get information about your dev box:

1. [Sign in to the developer portal](https://aka.ms/devbox-portal) and select the **More actions** icon on the dev box tile.

1. Select **More Info** from the menu.
 
   :::image type="content" source="media/how-to-create-dev-boxes-developer-portal/dev-box-actions-more-info.png" alt-text="Screenshot of the developer portal showing the actions menu for a dev box and More Info selected." border="false":::

   The **Dev box details** pane shows information about your dev box like the following example:
 
   :::image type="content" source="media/how-to-create-dev-boxes-developer-portal/dev-box-details-pane.png" alt-text="Screenshot of the dev box more information pane, showing creation date, dev center, dev box pool, and source image for the dev box." border="false":::

## Delete a dev box

There are many reasons you might not need a dev box anymore. You might complete your testing, merge your pull request, or finish working on a specific task or project.

When you no longer need a dev box, you can delete it in the developer portal. You can then create new dev boxes to work on new items.

> [!IMPORTANT]
> You can't retrieve a dev box after deletion. Before you delete a dev box, make sure you don't need it anymore.

To delete a dev box:

1. [Sign in to the developer portal](https://aka.ms/devbox-portal), select the **More actions** icon on the dev box tile, and then select **Delete** from the menu.

   :::image type="content" source="media/how-to-create-dev-boxes-developer-portal/dev-box-actions-delete.png" alt-text="Screenshot of the developer portal showing the actions menu for a dev box and Delete selected." border="false":::

1. To confirm the deletion, select **Delete** on the **Delete dev box** screen.

   :::image type="content" source="media/how-to-create-dev-boxes-developer-portal/dev-box-confirm-delete.png" alt-text="Screenshot of the confirmation message after you select to delete a dev box.":::

## Take other dev box actions

Depending on configuration, you can select other actions from the **More actions** menu on a dev box tile in the developer portal. For example:

- **Hibernate and resume.** Hibernation conserves power by saving the current state of your dev box and then shutting it down. You can resume the dev box to that exact state. If your dev box has hibernation enabled, select **Hibernate** or **Resume** to hibernate or resume the dev box. For more information, see [Hibernate a dev box](how-to-hibernate-your-dev-box.md).

- **Troubleshoot and repair.** If you have issues connecting to your dev box, you can use **Troubleshoot & repair** to troubleshoot. For more information, see [Resolve connectivity issues with the Troubleshoot and Repair tool](how-to-troubleshoot-repair-dev-box.md).

- **Snapshot and restore.** You can capture a snapshot of your dev box state by selecting **Take snapshot**, and later **Restore** your dev box to that state. For more information, see [Restore your dev box from a snapshot](how-to-restore-from-snapshot.md).

## Related content

- [Quickstart: Create a dev box by using the developer portal](quickstart-create-dev-box.md)
- [Configure Microsoft Dev Box from the command line with the Azure CLI](how-to-install-dev-box-cli.md)
- [Use a browser to connect to a dev box](quickstart-create-dev-box.md#connect-to-a-dev-box)
