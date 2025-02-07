---
title: Configure multiple monitors for your dev box
titleSuffix: Microsoft Dev Box
description: Learn how to configure multiple monitors in remote desktop clients, so you can use multiple monitors when connecting to a dev box.
services: dev-box
ms.service: dev-box
ms.author: rosemalcolm
author: RoseHJM
ms.date: 08/30/2024
ms.topic: how-to

#Customer intent: As a dev box user, I want to use multiple monitors when connecting to my dev box so that I can have more screen real estate to work with.
---

# Use multiple monitors on a dev box 

In this article, you configure a remote desktop client to use dual or more monitors when you connect to your dev box. Using multiple monitors gives you more screen real estate to work with. You can spread your work across multiple screens, or use one screen for your development environment and another for documentation, email, or messaging.

When you connect to your cloud-hosted developer machine in Microsoft Dev Box by using a remote desktop client, you can take advantage of a multi-monitor setup. The following table lists remote desktop clients that support multiple monitors and provides links to the instructions for configuring multiple monitors in each client.

| Client | Multiple monitor support | Configure multiple monitors |
|--|:-:|--|
| Windows App (recommended) | <sub>:::image type="icon" source="./media/how-to-configure-multiple-monitors/yes.svg" border="false":::</sub> | [Configure display settings in Windows App](/windows-app/display-settings?tabs=windows) |
| Microsoft Remote Desktop client| <sub>:::image type="icon" source="./media/how-to-configure-multiple-monitors/yes.svg" border="false":::</sub> | [Microsoft Remote Desktop client](/azure/dev-box/how-to-configure-multiple-monitors?branch=main&tabs=windows-app#configure-remote-desktop-to-use-multiple-monitors) |
| Microsoft Store Remote Desktop client | <sub>:::image type="icon" source="./media/how-to-configure-multiple-monitors/no.svg" border="false":::</sub> | Does not support multiple monitors |
| Remote Desktop Connection (MSTSC) | <sub>:::image type="icon" source="./media/how-to-configure-multiple-monitors/yes.svg" border="false":::</sub> | [Microsoft Remote Desktop Connection](/azure/dev-box/how-to-configure-multiple-monitors?branch=main&tabs=windows-connection#configure-remote-desktop-to-use-multiple-monitors) |
| Microsoft Remote Desktop for macOS  | <sub>:::image type="icon" source="./media/how-to-configure-multiple-monitors/yes.svg" border="false":::</sub> | [Microsoft Remote Desktop for macOS](/azure/dev-box/how-to-configure-multiple-monitors?branch=main&tabs=macOS#configure-remote-desktop-to-use-multiple-monitors) |


[!INCLUDE [note-windows-app](includes/note-windows-app.md)]

## Prerequisites

To complete the steps in this article, you must install the appropriate Remote Desktop client on your local machine.

## Configure Remote Desktop to use multiple monitors

Use the following steps to configure Remote Desktop to use multiple monitors.

# [Microsoft Remote Desktop client](#tab/windows-client)

1. Open the Remote Desktop client. 
 
   :::image type="content" source="./media/how-to-configure-multiple-monitors/remote-desktop-app.png" alt-text="Screenshot of the Windows 11 start menu with Remote desktop showing and open highlighted.":::
 
1. Right-click the dev box you want to configure, and then select **Settings**.
 
1. On the settings pane, turn off **Use default settings**.
 
   :::image type="content" source="media/how-to-configure-multiple-monitors/turn-off-default-settings.png" alt-text="Screenshot showing the Use default settings slider.":::
 
1. In **Display Settings**, in the **Display configuration** list, select the displays to use and configure the options:
 
   | Value | Description | Options |
   |---|---|---|
   | All displays | Remote desktop uses all available displays. | - Use only a single display when in windowed mode. <br> - Fit the remote session to the window. |
   | Single display | Remote desktop uses a single display. | - Start the session in full screen mode. <br> - Fit the remote session to the window. <br> - Update the resolution on when a window is resized. |
   | Select displays | Remote Desktop uses only the monitors you select. | - Maximize the session to the current displays. <br> - Use only a single display when in windowed mode. <br> - Fit the remote connection session to the window. |

   :::image type="content" source="media/how-to-configure-multiple-monitors/remote-desktop-select-display.png" alt-text="Screenshot showing the Remote Desktop display settings, highlighting the option to select the number of displays.":::

1. Close the settings pane, and then select your dev box to begin the Remote Desktop session.

# [Microsoft Remote Desktop Connection](#tab/windows-connection)

1. Open a Remote Desktop Connection.

   :::image type="content" source="media/how-to-configure-multiple-monitors/remote-desktop-connection-open.png" alt-text="Screenshot of the Start menu showing the Remote Desktop Connection." lightbox="media/how-to-configure-multiple-monitors/remote-desktop-connection-open.png":::

1. In **Computer**, enter the name of your dev box, then select **Show Options**.

   :::image type="content" source="media/how-to-configure-multiple-monitors/remote-desktop-connection-show-options.png" alt-text="Screenshot of the Remote Desktop Connection dialog box with Show options highlighted." lightbox="media/how-to-configure-multiple-monitors/remote-desktop-connection-show-options.png":::

1. On the **Display** tab, select **Use all my monitors for the remote session**.

   :::image type="content" source="media/how-to-configure-multiple-monitors/remote-desktop-connection-all-monitors.png" alt-text="Screenshot of the Remote Desktop Connection Display tab and Use all my monitors for the current session highlighted." lightbox="media/how-to-configure-multiple-monitors/remote-desktop-connection-all-monitors.png":::

1. Select **Connect** to start the Remote Desktop session.

# [Microsoft Remote Desktop for macOS](#tab/macOS)

1. Open Remote Desktop.
 
1. Select **PCs**.

1. On the Connections menu, select **Edit PC**.
 
1. Select **Display**.
 
1. On the Display tab, select **Use all monitors**, and then select **Save**.

   :::image type="content" source="media/how-to-configure-multiple-monitors/remote-desktop-for-mac.png" alt-text="Screenshot showing the Edit PC dialog box with the display configuration options.":::

1. Select your dev box to begin the Remote Desktop session.

--- 

> [!TIP]
> For more information about the Microsoft remote desktop clients currently available, see:
> - [Remote Desktop clients for Azure Virtual Desktop](/azure/virtual-desktop/users/remote-desktop-clients-overview)
> - [Connect to Azure Virtual Desktop with the Remote Desktop client for Windows](/azure/virtual-desktop/users/connect-windows)

## Related content

- [Manage a dev box by using the developer portal](how-to-create-dev-boxes-developer-portal.md)
- Learn how to [connect to a dev box through the browser](./quickstart-create-dev-box.md#connect-to-a-dev-box)
