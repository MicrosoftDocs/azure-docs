---
title: 'Quickstart: Use the Remote Desktop client to connect to a dev box'
titleSuffix: Microsoft Dev Box Preview
description: In this Quickstart, you learn how to download a Remote Desktop client and connect to a dev box. 
services: dev-box
ms.service: dev-box
ms.author: rosemalcolm
author: RoseHJM
ms.date: 11/2/2022
ms.topic: quickstart
---

# Quickstart: Use the Remote Desktop client to connect to a dev box

In this quickstart, you'll learn how to download a remote desktop app from the [developer portal](https://aka.ms/devbox-portal) and connect to a dev box by using the remote desktop client.

Remote desktop apps let you use and control a dev box from almost any device. For your desktop or laptop, you can choose to download the Remote Desktop client for Windows Desktop or the Microsoft Remote Desktop for Mac. You can also download a Remote Desktop app for your mobile device: Microsoft Remote Desktop for iOS or Microsoft Remote Desktop for Android.

You can view the dev boxes you're connected to in your Remote Desktop client's [Workspaces](/windows-server/remote/remote-desktop-services/clients/windowsdesktop#workspaces).

In this quickstart, you'll learn how to:

> [!div class="checklist"]
> * Download the Remote Desktop client (Windows and non-Windows).
> * Use the Remote Desktop client to connect to a dev box.

## Prerequisites

- [Add a dev box](./quickstart-create-dev-box.md#create-a-dev-box) on the [developer portal](https://aka.ms/devbox-portal).

## Download the Remote Desktop client (Windows)

To download and set up the Remote Desktop app for Windows, follow these steps:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. Select **Open in RDP client** for the dev box you want to connect.
   
   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/windows-open-rdp-client.png" alt-text="Screenshot of the Your dev box card showing the Open in RDP client option.":::

1. Choose **Download Windows Desktop** to download the Remote Desktop client.
   
   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/download-windows-desktop.png" alt-text="Screenshot of the download windows desktop option on the connect dialog.":::

1. Once install of the Windows Desktop client completes, return to the dev portal and [connect to your dev box](#connect-to-your-dev-box)
   
   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/install-complete-return-prompt.png" alt-text="Screenshot of the return prompt after download and install of the RDP client is completed.":::

## Connect to your dev box

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. Select **Open in RDP client** for the dev box you want to connect.
   
   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/windows-open-rdp-client.png" alt-text="Screenshot of the Open in RDP client option.":::

1. Choose **Open Windows Desktop** to connect to your dev box in the Remote Desktop client.
   
   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/open-windows-desktop.png" alt-text="Screenshot of the  Open Windows Desktop option on the Connect dialog.":::

## Download the Remote Desktop client (non-Windows) and connect to your dev box

To use a non-Windows Remote Desktop client to connect to your dev box, follow these steps:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. Select **Configure Remote Desktop** from **Quick actions**.
   
   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/configure-remote-desktop-non-windows.png" alt-text="Screenshot of Configure Remote Desktop in Quick actions.":::

1. Choose **Download** to download the Remote Desktop client.
   
   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/download-non-windows-rdp-client.png" alt-text="Screenshot of the non-Windows Remote Desktop client download option on the Configure Remote Desktop dialog.":::

1. Copy the subscription feed URL from step(2) of the **Configure Remote Desktop** card. Once Remote Desktop client is installed, you'll connect to your dev box with this subscription feed URL.

   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/copy-subscription-url-non-windows.png" alt-text="Screenshot of the subscription feed URL copied from the Configure Remote Desktop card.":::

1. Open the Remote Desktop client, select **Add Workspace** and paste the subscription feed URL.
   
   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/non-windows-rdp-subscription-feed.png" alt-text="Screenshot of the non-Windows Remote Desktop client Add Workspace dialog.":::
   
1. Your dev box will appear in the Remote Desktop client's Workspaces. Double-click to connect.

   :::image type="content" source="./media/quickstart-connect-to-dev-box-with-remote-desktop-app/non-windows-rdp-connect-dev-box.png" alt-text="Screenshot of the non-Windows Remote Desktop client workspace with dev box.":::

## Next steps
To learn about managing Microsoft Dev Box Preview, see:

- [Provide access to project admins](./how-to-project-admin.md)
- [Provide access to dev box users](./how-to-dev-box-user.md)