---
title: Create & configure a dev box by using the developer portal
titleSuffix: Microsoft Dev Box
description: Learn how to create, delete, and connect to Microsoft Dev Box dev boxes by using the developer portal.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/25/2023
ms.topic: how-to
---

# Manage a dev box by using the developer portal

You can preconfigure a dev box to manage all of your tools, services, source code, and prebuilt binaries that are specific to your project. Microsoft Dev Box provides an environment that's ready to build on, so you can run your app in minutes.

## Permissions

As a dev box developer, you can:

- Create, view, and delete dev boxes that you create.
- View pools within a project.
- Connect to dev boxes.

## Create a dev box

Create a dev box through the developer portal. You can create as many dev boxes as you need, but there are common ways to split up your workload.

You could create a dev box for your front-end work and a separate dev box for your back-end work. You could also create multiple dev boxes for your back end.

For example, say you're working on a bug. You could use a separate dev box for the bug fix to work on the specific task and troubleshoot the issue without poisoning your primary machine.

To create a dev box:

[!INCLUDE [create a dev box](./includes/create-dev-box.md)]

## Connect to a dev box

After you create your dev box, you can connect to it through a Remote Desktop app or through a browser.

:::image type="content" source="./media/how-to-manage-dev-boxes/open-rdp-client.jpg" alt-text="Screenshot of the option to open a dev box in an RDP client.":::

For most cases, use the Remote Desktop app when you're accessing a dev box. Remote Desktop provides the highest performance and best user experience for heavy workloads. For more information, see [Tutorial: Use a Remote Desktop client to connect to a dev box](./tutorial-connect-to-dev-box-with-remote-desktop-app.md).

Use the browser for lighter workloads. When you access your dev box via your phone or laptop, you can use the browser. The browser is useful for tasks such as a quick bug fix or a review of a GitHub pull request. For more information, see the [steps for using a browser to connect to a dev box](./quickstart-create-dev-box.md#connect-to-a-dev-box).

## Delete a dev box

When you no longer need a dev box, you can delete it.

There are many reasons why you might not need a dev box anymore. Maybe you finished testing, or you finished working on a specific project within your product.

You can delete dev boxes after you finish your tasks. Say you finished fixing your bug and merged your pull request. Now, you can delete your dev box and create new dev boxes to work on new items.

> [!NOTE]
> Ensure that neither you nor your team members need the dev box before deleting. You can't retrieve dev boxes after deletion.

[!INCLUDE [clean up resources](./includes/clean-up-resources.md)] 

## Next steps

- [Use a remote desktop client to connect to a dev box](./tutorial-connect-to-dev-box-with-remote-desktop-app.md)
- [Use a browser to connect to a dev box](./quickstart-create-dev-box.md#connect-to-a-dev-box)
