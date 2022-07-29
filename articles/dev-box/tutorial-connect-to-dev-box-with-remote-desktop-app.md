---
title: 'Tutorial: Use the Remote Desktop client to connect to a dev box'
description: In this tutorial, you learn how to download a Remote Desktop client and connect to a dev box. 
services: dev-box
ms.service: dev-box
ms.author: rosemalcolm
author: RoseHJM
ms.date: 07/28/2022
ms.topic: tutorial
---

# Tutorial: Use the Remote Desktop client to connect to a dev box

In this tutorial, you'll learn how to download a remote desktop app from the [developer portal](https://aka.ms/developerportal) and connect to a dev box by using the remote desktop client.

Remote desktop apps let you use and control a dev box from almost any device. For your desktop or laptop, you can choose to download the Remote Desktop client for Windows Desktop or the Microsoft Remote Desktop for Mac. You can also download a Remote Desktop app for your mobile device: Microsoft Remote Desktop for iOS or Microsoft Remote Desktop for Android.

You can view the dev boxes you're connected to in your Remote Desktop client's [Workspaces](/windows-server/remote/remote-desktop-services/clients/windowsdesktop#workspaces).

Learn more about the [key concepts for Microsoft Dev Box](./concept-dev-box-concepts.md).

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Download the Remote Desktop client (Windows and non-Windows).
> * Use the Remote Desktop client to connect to a dev box.

## Prerequisites

- [Add a dev box](./quickstart-create-dev-box.md#create-a-dev-box) on the [developer portal](https://aka.ms/developerportal).

## Download the Remote Desktop client (Windows)

To download and setup the Remote Desktop app for Windows, follow these steps:

1. Sign in to the [developer portal](https://aka.ms/developerportal).

1. Select **Open in RDP client** for the dev box you want to connect.
   
   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/open-rdp-client.png" alt-text="Screenshot of the Your dev box card showing the Open in RDP client option.":::

1. Choose **Download Windows Desktop** to download the Remote Desktop client.
   
   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/download-windows-desktop.png" alt-text="Screenshot of the download windows desktop option on the connect dialog.":::

1. Once install of the Windows Desktop client completes, return to the dev portal and [connect to your dev box](#connect-to-your-dev-box)
   
   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/install-complete-return-prompt.png" alt-text="Screenshot of the return prompt after download and install of the RDP client is completed":::

## Connect to your dev box

1. Sign in to the [developer portal](https://aka.ms/developerportal).

1. Select **Open in RDP client** for the dev box you want to connect.
   
   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/open-rdp-client.png" alt-text="Screenshot of the Your dev box card showing the Open in RDP client option.":::

1. Choose **Open Windows Desktop** to launch the Remote Desktop client.
   
   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/open-windows-desktop.png" alt-text="Screenshot of the  Open Windows Desktop option on the Connect dialog":::

1. Your dev box will appear in the Remote Desktop client. Double-click to connect.

## Download the Remote Desktop client (non-Windows) and connect to your dev box

To use a non-Windows Remote Desktop client to connect to your dev box, follow these steps:

1. Sign in to the [developer portal](https://aka.ms/developerportal).

1. Select **Configure Remote Desktop** from **Quick actions**.
   
   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/configure-remote-desktop-non-windows.png" alt-text="Screenshot of Configure Remote Desktop in Quick actions":::

1. Choose **Download** to download the Remote Desktop client.
   
   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/download-non-windows-rdp-client.png" alt-text="Screenshot of the non-Windows Remote Desktop client download option on the Configure Remote Desktop dialog.":::

1. Copy the subscription feed URL from step(2) of the **Configure Remote Desktop** card. Once Remote Desktop client is installed, you'll connect to your dev box with this subscription URL.

   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/copy-subscription-url-non-windows.png" alt-text="Screenshot of the subscription feed URL copied from the Configure Remote Desktop card.":::

1. Open the Remote Desktop client and subscribe to the feed using the copied subscription URL from previous step.

1. Your dev box will appear in the Remote Desktop client. Double-click to connect.


## Next steps
To learn about managing Microsoft Dev Box, see:

> [!div class="nextstepaction"]
> [Provide access to Project Admins](./how-to-project-admin.md)
> [Provide access to Dev Box users](./how-to-dev-box-user.md)