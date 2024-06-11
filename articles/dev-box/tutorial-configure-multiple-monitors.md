---
title: 'Tutorial: Configure multiple monitors for your dev box'
titleSuffix: Microsoft Dev Box
description: In this tutorial, you configure an RDP client to use multiple monitors when connecting to a dev box.
services: dev-box
ms.service: dev-box
ms.author: rosemalcolm
author: RoseHJM
ms.date: 05/30/2024
ms.topic: tutorial

#Customer intent: As a dev box user, I want to use multiple monitors when connecting to my dev box so that I can have more screen real estate to work with.
---

# Tutorial: Use multiple monitors on a dev box 

In this tutorial, you configure a remote desktop protocol (RDP) client to use dual or more monitors when you connect to your dev box.

Using multiple monitors gives you more screen real estate to work with. You can spread your work across multiple screens, or use one screen for your development environment and another for documentation, email, or messaging. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure the remote desktop client for multiple monitors.

## Prerequisites

To complete this tutorial, you must [install the Remote desktop app](tutorial-connect-to-dev-box-with-remote-desktop-app.md#download-the-remote-desktop-client-for-windows) on your local machine.

## Configure Remote Desktop to use multiple monitors

When you connect to your cloud-hosted developer machine in Microsoft Dev Box by using a remote desktop app, you can take advantage of a multi-monitor setup. Microsoft Remote Desktop for Windows and Microsoft Remote Desktop for Mac both support up to 16 monitors.

Use the following steps to configure Remote Desktop to use multiple monitors.

# [Microsoft Remote Desktop app](#tab/windows-app)

1. Open the Remote Desktop app. 
 
   :::image type="content" source="./media/tutorial-configure-multiple-monitors/remote-desktop-app.png" alt-text="Screenshot of the Windows 11 start menu with Remote desktop showing and open highlighted.":::
 
1. Right-click the dev box you want to configure, and then select **Settings**.
 
1. On the settings pane, turn off **Use default settings**.
 
   :::image type="content" source="media/tutorial-configure-multiple-monitors/turn-off-default-settings.png" alt-text="Screenshot showing the Use default settings slider.":::
 
1. In **Display Settings**, in the **Display configuration** list, select the displays to use and configure the options:
 
   | Value | Description | Options |
   |---|---|---|
   | All displays | Remote desktop uses all available displays. | - Use only a single display when in windowed mode. <br> - Fit the remote session to the window. |
   | Single display | Remote desktop uses a single display. | - Start the session in full screen mode. <br> - Fit the remote session to the window. <br> - Update the resolution on when a window is resized. |
   | Select displays | Remote Desktop uses only the monitors you select. | - Maximize the session to the current displays. <br> - Use only a single display when in windowed mode. <br> - Fit the remote connection session to the window. |

   :::image type="content" source="media/tutorial-configure-multiple-monitors/remote-desktop-select-display.png" alt-text="Screenshot showing the Remote Desktop display settings, highlighting the option to select the number of displays.":::

1. Close the settings pane, and then select your dev box to begin the Remote Desktop session.

# [Microsoft Remote Desktop Connection](#tab/windows-connection)

1. Open a Remote Desktop Connection.

   :::image type="content" source="media/tutorial-configure-multiple-monitors/remote-desktop-connection-open.png" alt-text="Screenshot of the Start menu showing the Remote Desktop Connection." lightbox="media/tutorial-configure-multiple-monitors/remote-desktop-connection-open.png":::

1. In **Computer**, enter the name of your dev box, then select **Show Options**.

   :::image type="content" source="media/tutorial-configure-multiple-monitors/remote-desktop-connection-show-options.png" alt-text="Screenshot of the Remote Desktop Connection dialog box with Show options highlighted." lightbox="media/tutorial-configure-multiple-monitors/remote-desktop-connection-show-options.png":::

1. On the **Display** tab, select **Use all my monitors for the remote session**.

   :::image type="content" source="media/tutorial-configure-multiple-monitors/remote-desktop-connection-all-monitors.png" alt-text="Screenshot of the Remote Desktop Connection Display tab and Use all my monitors for the current session highlighted." lightbox="media/tutorial-configure-multiple-monitors/remote-desktop-connection-all-monitors.png":::

1. Select **Connect** to start the Remote Desktop session.

# [Non-Windows](#tab/non-Windows)

1. Open Remote Desktop.
 
1. Select **PCs**.

1. On the Connections menu, select **Edit PC**.
 
1. Select **Display**.
 
1. On the Display tab, select **Use all monitors**, and then select **Save**.

   :::image type="content" source="media/tutorial-configure-multiple-monitors/remote-desktop-for-mac.png" alt-text="Screenshot showing the Edit PC dialog box with the display configuration options.":::

1. Select your dev box to begin the Remote Desktop session.

--- 

> [!TIP]
> For more information about the Microsoft remote desktop clients currently available, see:
> - [Remote Desktop clients for Remote Desktop Services and remote PCs](https://aka.ms/rdapps)
> - [Connect to Azure Virtual Desktop with the Remote Desktop client for Windows](/azure/virtual-desktop/users/connect-windows)

## Clean up resources

Dev boxes incur costs whenever they're running. When you finish using your dev box, shut down or stop it to avoid incurring unnecessary costs.

You can stop a dev box from the developer portal:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. For the dev box that you want to stop, select More options (**...**), and then select **Stop**.

   :::image type="content" source="./media/tutorial-configure-multiple-monitors/stop-dev-box.png" alt-text="Screenshot of the menu command to stop a dev box.":::

The dev box might take a few moments to stop.

## Related content

- [Manage a dev box by using the developer portal](how-to-create-dev-boxes-developer-portal.md)
- Learn how to [connect to a dev box through the browser](./quickstart-create-dev-box.md#connect-to-a-dev-box)

