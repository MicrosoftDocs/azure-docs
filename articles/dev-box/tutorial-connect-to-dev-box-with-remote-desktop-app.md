---
title: 'Tutorial: Use the Microsoft Remote Desktop client to connect to a dev box'
titleSuffix: Azure Dev Box
description: In this tutorial, you learn how to download a Remote Desktop client and connect to a dev box. 
services: dev-box
ms.service: dev-box
ms.author: rosemalcolm
author: RoseHJM
ms.date: 07/28/2022
ms.topic: tutorial
#Customer intent: 
---

# Tutorial: Use the Microsoft Remote Desktop client to connect to a dev box

In this tutorial, you'll learn how to download a remote desktop app from the Microsoft [developer portal](https://aka.ms/developerportal) and connect to a dev box by using the remote desktop app.

Remote desktop apps let you use and control a dev box from almost any device. For your desktop or laptop, you can choose to download the Microsoft Remote Desktop for Windows or the Microsoft Remote Desktop for Mac. You can also download a Remote Desktop app for your mobile device: Microsoft Remote Desktop for iOS or Microsoft Remote Desktop for Android.

Workspaces in the Microsoft Remote Desktop client list the managed resources you can access, including your dev boxes. You can view the dev boxes you're connected to in your Remote Desktop client Workspaces.

Learn more about the [key concepts for Microsoft Dev Box](./concept-dev-box-concepts.md).

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Download the Microsoft Remote Desktop client.
> * Use the Remote Desktop client to connect to a dev box.

## Prerequisites

- [Add a dev box](./quickstart-create-dev-box.md#create-a-dev-box) on the developer portal.

## Download the Remote Desktop client

To download and setup the Remote Desktop app, follow these steps:

1. Sign in to the [developer portal](https://aka.ms/developerportal).

1. Select **Open in RDP client** for the dev box you want to connect to.
   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/open-rdp-client.png" alt-text="Screenshot of the Your dev box card showing the Open in RDP client option.":::

1. Choose **Download Windows Desktop** to download the Remote Desktop client.
   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/download-remote-desktop-client.png" alt-text="Screenshot of the "How would you like to connect to with the Remote Desktop client" dialog download windows desktop option":::

1. Once install of the RDP client completes, return to the dev portal to [connect to your dev box](#connect-to-your-dev-box)
   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/install-complete-return-prompt.png" alt-text="Screenshot of the return prompt after download and install of the RDP client is completed":::

## Connect to your dev box

1. Sign in to the [developer portal](https://aka.ms/developerportal).

1. Select **Open in RDP client** for the dev box you want to connect to.
   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/open-rdp-client.png" alt-text="Screenshot of the Your dev box card showing the Open in RDP client option.":::

1. Choose **Open Windows Desktop** to launch the Remote Desktop client.
   :::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/download-remote-desktop-client.png" alt-text="Screenshot of the "How would you like to connect to with the Remote Desktop client" dialog Open Windows Desktop option":::

1. Your dev box will appear in the Workspaces list of the Remote Desktop client. Double-click to connect.

## Next steps
To learn about managing Microsoft Dev Box, see:

> [!div class="nextstepaction"]
> [Provide access to Project Admins](./how-to-project-admin.md)
> [Provide access to Dev Box users](./how-to-dev-box-user.md)