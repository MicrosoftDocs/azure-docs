---
title: 'Tutorial: Access a dev box with a remote desktop client'
titleSuffix: Microsoft Dev Box
description: In this tutorial, you learn how to connect to and access your dev box in Microsoft Dev Box by using a remote desktop (RDP) client app.
services: dev-box
ms.service: dev-box
ms.author: rosemalcolm
author: RoseHJM
ms.date: 01/30/2024
ms.topic: tutorial
---

# Tutorial: Use a remote desktop client to connect to a dev box 

In this tutorial, you download and use a remote desktop (RDP) client application to connect to and access a dev box.

Remote desktop apps let you use and control a dev box from almost any device. For your desktop or laptop, you can choose to download the Remote Desktop client for Windows Desktop or Microsoft Remote Desktop for Mac. You can also download a remote desktop app for your mobile device: Microsoft Remote Desktop for iOS or Microsoft Remote Desktop for Android. 

> [!TIP]
> Many remote desktops apps allow you to [use multiple monitors](tutorial-configure-multiple-monitors.md) when you connect to your dev box.

Alternately, you can access your dev box through the browser from the Microsoft Dev Box developer portal.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Download a remote desktop client.
> * Connect to a dev box by using a subscription URL.
> * Connect to an existing dev box.

## Prerequisites

To complete this tutorial, you must have access to a dev box through the developer portal.

## Download the remote desktop client and connect to your dev box

You can use a remote desktop client application to access your dev box in Microsoft Dev Box. Remote desktop clients are available for many operating systems and devices, including mobile devices running iOS, iPadOS or Android. 

Select the relevant tab to view the steps to download and use the Remote Desktop client application from Windows or non-Windows operating systems.

# [Windows](#tab/windows)

### Download the Remote Desktop client for Windows

To download and set up the Remote Desktop client for Windows:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. Select **Open in RDP client** for the dev box that you want to connect.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/windows-open-rdp-client.png" alt-text="Screenshot of the card for a user's dev boxes with the option for opening in an RDP client.":::

1. In the **Connect with the Remote Desktop Client** window, under **New to Microsoft Dev Box?**, select your platform configuration in the dropdown list: Windows 64 bit, Windows 32 bit, or Windows ARM 64.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/connect-remote-desktop-client.png" alt-text="Screenshot that shows how to select your platform configuration for the Windows Remote Desktop client.":::

1. After you select your platform configuration, select the platform configuration to start the download process for the Remote Desktop client.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/download-windows-desktop.png" alt-text="Screenshot that shows how to select the platform configuration again to download the Windows Remote Desktop client.":::

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

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/configure-remote-desktop-non-windows.png" alt-text="Screenshot of the button for configuring Remote Desktop in the area for quick actions." lightbox="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/configure-remote-desktop-non-windows.png":::

1. In the **Configure Remote Desktop** dialog, select **Download** to download the client.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/download-non-windows-rdp-client.png" alt-text="Screenshot of the download button in the dialog for configuring Remote Desktop." lightbox="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/download-non-windows-rdp-client.png":::

1. Copy the subscription feed URL. After the Remote Desktop client installs, you'll connect to your dev box by using this URL.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/copy-subscription-url-non-windows.png" alt-text="Screenshot of the subscription feed URL in the Configure Remote Desktop dialog." lightbox="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/copy-subscription-url-non-windows.png":::

### Connect to your dev box

1. Open the Remote Desktop client, select **Add Workspace**, and paste the subscription feed URL in the box.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/non-windows-rdp-subscription-feed.png" alt-text="Screenshot of the dialog for adding a Workspace URL." lightbox="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/non-windows-rdp-subscription-feed.png":::

1. Your dev box appears in the Remote Desktop client's **Workspaces** area. Double-click the dev box to connect.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/non-windows-rdp-connect-dev-box.png" alt-text="Screenshot of a dev box in a non-Windows Remote Desktop client Workspace." lightbox="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/non-windows-rdp-connect-dev-box.png":::
---

## Clean up resources

Dev boxes incur costs whenever they're running. When you finish using your dev box, shut down or stop it to avoid incurring unnecessary costs.

You can stop a dev box from the developer portal:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. For the dev box that you want to stop, select More options (**...**), and then select **Stop**.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/stop-dev-box.png" alt-text="Screenshot of the menu command to stop a dev box.":::

The dev box might take a few moments to stop.

## Related content

- Learn how to [configure multiple monitors](./tutorial-configure-multiple-monitors.md) for your Remote Desktop client.
- [Manage a dev box by using the developer portal](how-to-create-dev-boxes-developer-portal.md)