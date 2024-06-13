---
title: Manage a dev box in the developer portal
titleSuffix: Microsoft Dev Box
description: Learn how to create, delete, and connect to a dev box by using the Microsoft Dev Box developer portal.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 01/03/2024
ms.topic: how-to
---

# Manage a dev box by using the Microsoft Dev Box developer portal

In this article, you learn how to manage a dev box by using the Microsoft Dev Box developer portal. Developers can access their dev boxes directly in the developer portal, instead of having to use the Azure portal.

As a developer, you can view information about your dev boxes. You can also connect to, start, stop, restart, and delete them.

## Permissions

As a dev box developer, you can:

- Create, view, and delete dev boxes that you create.
- View pools within a project.
- Connect to dev boxes.

## Create a dev box

You can create as many dev boxes as you need through the Microsoft Dev Box developer portal. You might create a separate dev box for different scenarios, for example:

- **Dev box per workload**. Create a dev box for your front-end work and a separate dev box for your back-end work. You can also create multiple dev boxes for your back-end system.
- **Dev box for bug fixing**. Use a separate dev box for the bug fix to work on the specific task and troubleshoot the issue without impacting your primary machine.

You can create a dev box by using the Microsoft Dev Box developer portal. For more information, see [Quickstart: Create a dev box by using the developer portal](quickstart-create-dev-box.md). 

You can also create a dev box through the Azure CLI dev center extension. For more information, see [Configure Microsoft Dev Box from the command-line with the Azure CLI](how-to-install-dev-box-cli.md).

## Connect to a dev box

After you create your dev box, you can connect to it through a remote application or via the browser.

A **Remote Desktop client application** provides the highest performance and best user experience for heavy workloads. Remote Desktop also supports multi-monitor configuration. For more information, see [Tutorial: Use a Remote Desktop client to connect to a dev box](./tutorial-connect-to-dev-box-with-remote-desktop-app.md).

You can use the **browser** for lighter workloads. When you access your dev box via your phone or laptop, you can use the browser. The browser is useful for tasks such as a quick bug fix or a review of a GitHub pull request. For more information, see the [steps for using a browser to connect to a dev box](./quickstart-create-dev-box.md#connect-to-a-dev-box).

## Shut down, restart, or start a dev box

You can perform many actions on a dev box in the Microsoft Dev Box developer portal by using the actions menu (**...**) on the dev box tile. The available options depend on the state of the dev box and the configuration of the dev box pool it belongs to. For example, you can shut down or restart a running dev box, or start a stopped dev box.

To shut down or restart a dev box:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. On the dev box you that want to shut down or restart, select the actions menu (**...**).
 
   :::image type="content" source="media/how-to-create-dev-boxes-developer-portal/dev-box-actions-shutdown.png" alt-text="Screenshot of the developer portal showing the actions menu for a running dev box." border="false"::: 

1. For a running dev box, you can select **Shut down** or **Restart**.

To start a dev box:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. On the dev box you that want to start, select the actions menu (**...**).
 
   :::image type="content" source="media/how-to-create-dev-boxes-developer-portal/dev-box-actions-start.png" alt-text="Screenshot of the developer portal showing the actions menu for a stopped dev box." border="false"::: 

1. For a stopped dev box, you can select **Start**.

## Get information about a dev box

You can use the Microsoft Dev Box developer portal to view information about a dev box, such as the creation date, and the dev center and dev box pool it belongs to. You can also check the source image in use.

To get more information about your dev box:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. On the dev box that you want to view, select the actions menu (**...**) and then select **More Info**.
 
   :::image type="content" source="media/how-to-create-dev-boxes-developer-portal/dev-box-actions-more-info.png" alt-text="Screenshot of the developer portal showing the actions menu for a dev box and More Info selected." border="false":::

1. In the dev box details pane, you see more information about your dev box, like the following example:
 
   :::image type="content" source="media/how-to-create-dev-boxes-developer-portal/dev-box-details-pane.png" alt-text="Screenshot of the dev box more information pane, showing creation date, dev center, dev box pool, and source image for the dev box." border="false":::

## Delete a dev box

When you no longer need a dev box, you can delete it in the developer portal.

There are many reasons why you might not need a dev box anymore. Maybe you completed your testing, or you finished working on a specific project within your product.

You can delete dev boxes after you finish your tasks. Suppose you finish fixing your bug and merge your pull request. Now, you can delete your dev box and create new dev boxes to work on new items.

> [!IMPORTANT]
> You can't retrieve a dev box after it's deleted. Before you delete a dev box, confirm that neither you nor your team members need the dev box for future tasks. 

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. For the dev box that you want to delete, select the actions menu (**...**) and then select **Delete**.

   :::image type="content" source="media/how-to-create-dev-boxes-developer-portal/dev-box-delete.png" alt-text="Screenshot of the developer portal showing the actions menu for a dev box and Delete selected." border="false":::

1. To confirm the deletion, select **Delete**.

   :::image type="content" source="media/how-to-create-dev-boxes-developer-portal/dev-box-confirm-delete.png" alt-text="Screenshot of the confirmation message after you select to delete a dev box." border="false":::

## Related content

- [Use a remote desktop client to connect to a dev box](./tutorial-connect-to-dev-box-with-remote-desktop-app.md)
- [Use a browser to connect to a dev box](./quickstart-create-dev-box.md#connect-to-a-dev-box)
