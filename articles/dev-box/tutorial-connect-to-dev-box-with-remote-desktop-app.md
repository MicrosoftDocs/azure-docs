---
title: 'Tutorial: Use a Remote Desktop client to connect to a dev box'
titleSuffix: Microsoft Dev Box
description: In this tutorial, you download and use a remote desktop client to connect to a dev box in Microsoft Dev Box. Configure the RDP client for a multi-monitor setup.
services: dev-box
ms.service: dev-box
ms.author: rosemalcolm
author: RoseHJM
ms.date: 12/15/2023
ms.topic: tutorial
---

# Tutorial: Use a remote desktop client to connect to a dev box 

In this tutorial, you download and use a remote desktop client application to connect to a dev box in Microsoft Dev Box. Learn how to configure the application to take advantage of a multi-monitor setup.

Remote Desktop apps let you use and control a dev box from almost any device. For your desktop or laptop, you can choose to download the Remote Desktop client for Windows Desktop or Microsoft Remote Desktop for Mac. You can also download a Remote Desktop app for your mobile device: Microsoft Remote Desktop for iOS or Microsoft Remote Desktop for Android.

Alternately, you can also connect to your dev box through the browser from the Microsoft Dev Box developer portal.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Download a remote desktop client.
> * Connect to an existing dev box.
> * Configure the remote desktop client for multiple monitors.

## Prerequisites

To complete this tutorial, you must first:

- [Configure Microsoft Dev Box](./quickstart-configure-dev-box-service.md).
- [Create a dev box](./quickstart-create-dev-box.md#create-a-dev-box) on the [developer portal](https://aka.ms/devbox-portal).

## Download the remote desktop client and connect to your dev box

You can use a remote desktop client application to connect to your dev box in Microsoft Dev Box. Remote desktop clients are available for many operating systems and devices. 

Select the relevant tab to view the steps to download and use the Remote Desktop client application from Windows or non-Windows operating systems.

# [Windows](#tab/windows)

### Download the Remote Desktop client for Windows

To download and set up the Remote Desktop client for Windows:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. Select **Open in RDP client** for the dev box that you want to connect.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/windows-open-rdp-client.png" alt-text="Screenshot of the card for a user's dev boxes with the option for opening in an RDP client.":::

1. In the **Connect with the Remote Desktop Client** window, under **New to Microsoft Dev Box**, select your platform configuration in the dropdown list: Windows 64 bit, Windows 32 bit, or Windows ARM 64.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/connect-remote-desktop-client.png" alt-text="Screenshot that shows how to select your platform configuration for the Windows Remote Desktop client." lightbox="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/connect-remote-desktop-client.png":::

1. After you select your platform configuration, click the platform configuration to start the download process for the Remote Desktop client.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/download-windows-desktop.png" alt-text="Screenshot that shows how to click the platform configuration again to download the Windows Remote Desktop client." lightbox="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/download-windows-desktop.png":::

1. After the Remote Desktop MSI file downloads to your computer, open the file and follow the prompts to install the Remote Desktop app. 

### Connect to a dev box by using a subscription URL

Each dev box project is represented as a Workspace in Remote Desktop. When you're working with multiple dev boxes, across multiple projects, you can use Remote Desktop to switch between them. To make a switch, you need to add the subscription URL for each Workspace to Remote Desktop. With the Remote Desktop app, you can subscribe to multiple Workspaces, allowing you to view and connect to all your dev boxes.  

To get the subscription URL for your Workspace:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).
 
1. Open help (**?**), and then select **Configure Remote Desktop**. 
 
   :::image type="content" source="media/tutorial-connect-to-dev-box-with-remote-desktop-app/dev-box-rdp-get-subscription-url.png" alt-text="Screenshot showing the developer portal help pane with subscription URL highlighted.":::

1. In **Configure Remote Desktop**, next to the subscription feed URL, select **Copy**.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/dev-box-rdp-subscription-windows.png" alt-text="Screenshot of the Configure Remote Desktop dialog with the subscription feed URL highlighted.":::

1. Open the Remote Desktop app. 
 
   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/remote-desktop-app.png" alt-text="Screenshot of the Windows 11 start menu with Remote desktop showing and open highlighted.":::

   1. If you're using the Remote Desktop app for the first time, you see the **Let's get started** page. Select **Subscribe with URL**.

      :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/remote-desktop-app-get-started.png" alt-text="Screenshot of the Remote Desktop Let's get started page."::: 

   1. If you previously used the Remote Desktop app, you see your Workspaces. Select More options (**...**), and then select **Subscribe with URL**.

      :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/remote-desktop-app-more-options.png" alt-text="Screenshot of the Remote Desktop app with the More options menu highlighted.":::

1. In the **Email or Workspace URL** box, paste the Workspace URL you copied in step 3.

   After the system confirms your Workspace URL, you can continue by selecting **Next**.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/remote-desktop-app-add-subscription-with-url.png" alt-text="Screenshot of the Remote Desktop Subscribe with URL dialog.":::

1. Remote Desktop gets the information from your Workspace and adds it to the Workspaces list.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/remote-desktop-app-workspace.png" alt-text="Screenshot of the Remote Desktop Workspace.":::

1. To start the connection with the Remote Desktop app, double-click the dev box that you want to connect to from your Workspace.

### Connect to your dev box from the developer portal

In addition to connecting through the Remote Desktop app, you can also connect to your dev boxes from the developer portal. 

To open the Remote Desktop client:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. Select **Open in RDP client** for the dev box that you want to connect.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/windows-open-rdp-client.png" alt-text="Screenshot of the option to open a dev box in a Windows Remote Desktop client.":::

1. Under **Already set up?**, select **Connect** to connect to your dev box in the Remote Desktop client.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/open-windows-desktop.png" alt-text="Screenshot of the option to open the Windows Remote Desktop client in the connection dialog.":::

# [Non-Windows](#tab/non-Windows)

### Download the Remote Desktop client 

To use a non-Windows Remote Desktop client to connect to your dev box:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. Under **Quick actions**, select **Configure Remote Desktop**.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/configure-remote-desktop-non-windows.png" alt-text="Screenshot of the button for configuring Remote Desktop in the area for quick actions.":::

1. In the **Configure Remote Desktop** dialog, select **Download** to download the client.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/download-non-windows-rdp-client.png" alt-text="Screenshot of the download button in the dialog for configuring Remote Desktop.":::

1. Copy the subscription feed URL. After the Remote Desktop client installs, you'll connect to your dev box by using this URL.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/copy-subscription-url-non-windows.png" alt-text="Screenshot of the subscription feed URL in the Configure Remote Desktop dialog.":::

### Connect to your dev box

1. Open the Remote Desktop client, select **Add Workspace**, and paste the subscription feed URL in the box.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/non-windows-rdp-subscription-feed.png" alt-text="Screenshot of the dialog for adding a Workspace URL.":::

1. Your dev box appears in the Remote Desktop client's **Workspaces** area. Double-click the dev box to connect.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/non-windows-rdp-connect-dev-box.png" alt-text="Screenshot of a dev box in a non-Windows Remote Desktop client Workspace.":::

---

## Configure Remote Desktop to use multiple monitors

When you connect to your cloud-hosted developer machine in Microsoft Dev Box, you can take advantage of a multi-monitor setup. Microsoft Remote Desktop for Windows and Microsoft Remote Desktop for Mac both support up to 16 monitors.

Use the following steps to configure Remote Desktop to use multiple monitors.

# [Windows](#tab/windows)

1. Open Remote Desktop.
 
1. Right-click the dev box you want to configure, and then select **Settings**.
 
1. On the settings pane, turn off **Use default settings**.
 
   :::image type="content" source="media/tutorial-connect-to-dev-box-with-remote-desktop-app/turn-off-default-settings.png" alt-text="Screenshot showing the Use default settings slider.":::
 
1. In **Display Settings**, in the **Display configuration** list, select the displays to use and configure the options:
 
   | Value | Description | Options |
   |---|---|---|
   | All displays | Remote desktop uses all available displays. | - Use only a single display when in windowed mode. <br> - Fit the remote session to the window. |
   | Single display | Remote desktop uses a single display. | - Start the session in full screen mode. <br> - Fit the remote session to the window. <br> - Update the resolution on when a window is resized. |
   | Select displays | Remote Desktop uses only the monitors you select. | - Maximize the session to the current displays. <br> - Use only a single display when in windowed mode. <br> - Fit the remote connection session to the window. |

   :::image type="content" source="media/tutorial-connect-to-dev-box-with-remote-desktop-app/remote-desktop-select-display.png" alt-text="Screenshot showing the Remote Desktop display settings, highlighting the option to select the number of displays.":::

1. Close the settings pane, and then select your dev box to begin the Remote Desktop session.

# [Non-Windows](#tab/non-Windows)

1. Open Remote Desktop.
 
1. Select **PCs**.

1. On the Connections menu, select **Edit PC**.
 
1. Select **Display**.
 
1. On the Display tab, select **Use all monitors**, and then select **Save**.

   :::image type="content" source="media/tutorial-connect-to-dev-box-with-remote-desktop-app/remote-desktop-for-mac.png" alt-text="Screenshot showing the Edit PC dialog box with the display configuration options.":::

1. Select your dev box to begin the Remote Desktop session.

--- 

## Clean up resources

Dev boxes incur costs whenever they're running. When you finish using your dev box, shut down or stop it to avoid incurring unnecessary costs.

You can stop a dev box from the developer portal:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. For the dev box that you want to stop, select More options (**...**) > **Stop**.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/stop-dev-box.png" alt-text="Screenshot of the menu command to stop a dev box.":::

The dev box might take a few moments to stop.

## Related content

- [Manage a dev box by using the developer portal](how-to-create-dev-boxes-developer-portal.md)
- Learn how to [connect to a dev box through the browser](./quickstart-create-dev-box.md#connect-to-a-dev-box)
