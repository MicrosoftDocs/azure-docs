---
title: Create & configure a dev box by using the developer portal
titleSuffix: Microsoft Dev Box
description: Learn how to create, delete, and connect to Microsoft Dev Box dev boxes by using the developer portal.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 09/11/2023
ms.topic: how-to
---

# Manage a dev box by using the developer portal

Developers can manage their dev boxes through the developer portal. As a developer, you can view information about your dev boxes. You can also connect to, start, stop, restart, and delete them.

## Permissions

As a dev box developer, you can:

- Create, view, and delete dev boxes that you create.
- View pools within a project.
- Connect to dev boxes.

## Create a dev box

You can create as many dev boxes as you need through the developer portal, but there are common ways to split up your workload.

You could create a dev box for your front-end work and a separate dev box for your back-end work. You could also create multiple dev boxes for your back end.

For example, say you're working on a bug. You could use a separate dev box for the bug fix to work on the specific task and troubleshoot the issue without impacting your primary machine.

You can create a dev box by using:

- Developer portal. For more information, see [Quickstart: Create a dev box by using the developer portal](quickstart-create-dev-box.md)
- Azure CLI dev center extension. For more information, see [Configure Microsoft Dev Box from the command-line with the Azure CLI](how-to-install-dev-box-cli.md)

## Connect to a dev box

After you create your dev box, you can connect to it through a Remote Desktop app or through a browser.

Remote Desktop provides the highest performance and best user experience for heavy workloads. Remote Desktop also supports multi-monitor configuration. For more information, see [Tutorial: Use a Remote Desktop client to connect to a dev box](./tutorial-connect-to-dev-box-with-remote-desktop-app.md).

Use the browser for lighter workloads. When you access your dev box via your phone or laptop, you can use the browser. The browser is useful for tasks such as a quick bug fix or a review of a GitHub pull request. For more information, see the [steps for using a browser to connect to a dev box](./quickstart-create-dev-box.md#connect-to-a-dev-box).

## Shutdown, restart or start a dev box

You can perform many actions on a dev box through the developer portal by using the actions menu on the dev box tile. The options you see depend on the state of the dev box, and the configuration of the dev box pool it belongs to. For example, you can shut down or restart a running dev box, or start a stopped dev box.

To shut down or restart a dev box.

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).
1. On the dev box you want to shut down or restart, select actions.
 
   :::image type="content" source="media/how-to-create-dev-boxes-developer-portal/dev-box-actions-shutdown.png" alt-text="Screenshot of developer portal showing the dev box tile for a running dev box with the actions menu highlighted."::: 

1. For a dev box that is running, you can select **Shut down** or **Restart**.

To start a dev box:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).
1. On the dev box you want to start, select actions.
 
   :::image type="content" source="media/how-to-create-dev-boxes-developer-portal/dev-box-actions-start.png" alt-text="Screenshot of developer portal showing the dev box tile for a stopped dev box with the actions menu highlighted."::: 

1. For a dev box that is stopped, you can select **Start**.

## Get information about a dev box

You can view information about a dev box, like the creation date, the dev center it belongs to, and the dev box pool it belongs to. You can also check the source image in use.

To get more information about your dev box:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).
1. On the dev box you want to view, select actions > **More info**.
 
   :::image type="content" source="media/how-to-create-dev-boxes-developer-portal/dev-box-actions-more-info.png" alt-text="Screenshot of developer portal showing a dev box tile with the actions menu selected, and more info highlighted.":::

1. In the dev box details pane, you see more information about your dev box, like the following example:
 
   :::image type="content" source="media/how-to-create-dev-boxes-developer-portal/dev-box-details-pane.png" alt-text="Screenshot of the dev box more information pane, showing creation date, dev center, dev box pool, and source image for the dev box.":::

## Delete a dev box

When you no longer need a dev box, you can delete it.

There are many reasons why you might not need a dev box anymore. Maybe you finished testing, or you finished working on a specific project within your product.

You can delete dev boxes after you finish your tasks. Say you finished fixing your bug and merged your pull request. Now, you can delete your dev box and create new dev boxes to work on new items.

> [!NOTE]
> Ensure that neither you nor your team members need the dev box before deleting. You can't retrieve dev boxes after deletion.

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. For the dev box that you want to delete, select actions > **Delete**.

   :::image type="content" source="media/how-to-create-dev-boxes-developer-portal/dev-box-delete.png" alt-text="Screenshot of the dev box actions menu with the Delete option.":::

1. To confirm the deletion, select **Delete**.

   :::image type="content" source="media/how-to-create-dev-boxes-developer-portal/dev-box-confirm-delete.png" alt-text="Screenshot of the confirmation message about deleting a dev box.":::

## Related content

- [Use a remote desktop client to connect to a dev box](./tutorial-connect-to-dev-box-with-remote-desktop-app.md)
- [Use a browser to connect to a dev box](./quickstart-create-dev-box.md#connect-to-a-dev-box)
