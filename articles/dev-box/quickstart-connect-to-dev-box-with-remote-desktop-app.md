---
title: 'Quickstart: Use a Remote Desktop client to connect to a dev box'
titleSuffix: Microsoft Dev Box Preview
description: In this quickstart, you learn how to download a Remote Desktop client and connect to your dev box. 
services: dev-box
ms.service: dev-box
ms.author: rosemalcolm
author: RoseHJM
ms.date: 11/03/2022
ms.topic: quickstart
---

# Quickstart: Use a Remote Desktop client to connect to a dev box

After you configure the Microsoft Dev Box Preview service and create dev boxes, you can connect to them by using a browser or by using a Remote Desktop client.

Remote Desktop apps let you use and control a dev box from almost any device. For your desktop or laptop, you can choose to download the Remote Desktop client for Windows Desktop or Microsoft Remote Desktop for Mac. You can also download a Remote Desktop app for your mobile device: Microsoft Remote Desktop for iOS or Microsoft Remote Desktop for Android.

In this quickstart, you'll download a Remote Desktop client (Windows and non-Windows). You'll then use that client to connect to a dev box.

## Prerequisites

To complete this quickstart, you must first:

- [Configure Microsoft Dev Box Preview](./quickstart-configure-dev-box-service.md).

- [Create a dev box](./quickstart-create-dev-box.md#create-a-dev-box) on the [developer portal](https://aka.ms/devbox-portal).

## Download the client and connect to your dev box

Remote Desktop clients are available for many different operating systems and devices. In this quickstart, you can view the steps for Windows or the steps for a non-Windows operating system by selecting the appropriate tab.

# [Windows](#tab/windows)

### Download the Remote Desktop client for Windows

To download and set up the Remote Desktop client for Windows:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. Select **Open in RDP client** for the dev box that you want to connect.

   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/windows-open-rdp-client.png" alt-text="Screenshot of the card for a user's dev boxes with the option for opening in an RDP client.":::

1. Select **Download Windows Desktop** to download the client.

   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/download-windows-desktop.png" alt-text="Screenshot of the option to download the Windows Desktop client.":::

1. Monitor the progress of the download in the developer portal. After the client is installed, you'll use the developer portal to connect to your dev box.

   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/install-complete-return-prompt.png" alt-text="Screenshot of the notification that the client download is in progress.":::

### Connect to your dev box

1. To open the Remote Desktop client, sign in to the [developer portal](https://aka.ms/devbox-portal).

1. Select **Open in RDP client** for the dev box that you want to connect.

   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/windows-open-rdp-client.png" alt-text="Screenshot of the option to open a dev box in an RDP client.":::

1. Select **Open Windows Desktop** to connect to your dev box in the Remote Desktop client.

   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/open-windows-desktop.png" alt-text="Screenshot of the option to open the Windows desktop client in the connection dialog.":::

# [Non-Windows](#tab/non-Windows)

### Download the Remote Desktop client 

To use a non-Windows Remote Desktop client to connect to your dev box:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. Select **Configure Remote Desktop** from **Quick actions**.

   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/configure-remote-desktop-non-windows.png" alt-text="Screenshot of the button for configuring Remote Desktop in the area for quick actions.":::

1. In the **Configure Remote Desktop** dialog, select **Download** to download the client.

   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/download-non-windows-rdp-client.png" alt-text="Screenshot of the download button in the dialog for configuring Remote Desktop.":::

1. Copy the subscription feed URL. After the Remote Desktop client is installed, you'll connect to your dev box by using this URL.

   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/copy-subscription-url-non-windows.png" alt-text="Screenshot of the subscription feed URL in the Configure Remote Desktop dialog.":::

### Connect to your dev box

1. Open the Remote Desktop client, select **Add Workspace**, and paste the subscription feed URL in the box.

   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/non-windows-rdp-subscription-feed.png" alt-text="Screenshot of the dialog for adding a workspace URL.":::

1. Your dev box appears in the Remote Desktop client's **Workspaces** area. Double-click it to connect.

   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/non-windows-rdp-connect-dev-box.png" alt-text="Screenshot of a dev box in a non-Windows Remote Desktop client workspace.":::

---

## Clean up resources

Dev boxes incur costs whenever they are running. When you finish using your dev box, shut down or stop it to avoid incurring unnecessary costs.

You can stop a dev box from the developer portal:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. For the dev box you want to stop, select the Actions menu, and then select **Stop**.

   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/stop-dev-box.png" alt-text="Screenshot of the Stop option.":::

1. The dev box may take a few moments to stop.

## Next steps

To learn about managing Microsoft Dev Box Preview, see:

- [Provide access to project admins](./how-to-project-admin.md)
- [Provide access to dev box users](./how-to-dev-box-user.md)