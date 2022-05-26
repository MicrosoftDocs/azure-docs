---
title: 'Tutorial: Connect to a Microsoft Dev Box by using a Microsoft Remote Desktop app.'
titleSuffix: 
description: In this tutorial, you learn how to download a Remote Desktop app and connect to a dev box. 
services: dev-box
ms.service: dev-box
ms.author: rosemalcolm
author: RoseHJM
ms.date: 04/21/2022
ms.topic: tutorial
#Customer intent: 
---

# Tutorial: Connect to a Microsoft Dev Box by using a Microsoft Remote Desktop app

In this tutorial, you'll learn how to download a Remote Desktop App straight from the Your Dev Box card in the developer portal. 

Remote Desktop apps let you use and control a dev box from almost any device. For your desktop or laptop, you can choose from Microsoft Remote Desktop for Windows and Microsoft Remote Desktop for Mac. You can also download a remote desktop app for your mobile device: Microsoft Remote Desktop for iOS or Microsoft Remote Desktop for Android.

Microsoft Remote Desktop apps provide workspaces which list the managed resources you can access, including your dev boxes. When you subscribe to a workspace, the resources become available on your local PC. In this tutorial you will subscribe to a workspace by specifying the workspace URL. You can then start your dev box from the workspace.

Learn more about the [key concepts for Microsoft Dev Box](./concept-dev-box-concepts.md).

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Download the Microsoft Remote Desktop app for your platform.
> * Subscribe to a workspace.
> * Use the Remote Desktop App to connect to a dev box.

## Remote Desktop App

To download and install the Remote Desktop app, follow these steps:

1. Sign in to the [developer portal](https://portal.fidalgo.azure.com).

1. In **Your dev box**, from the **Open in browser** dropdown, select **Download RDP client**.
   :::image type="content" source="./media/quickstart-create-dev-box/dev-portal-card-download.png" alt-text="Screenshot of the Your dev box card showing the Download RD client option.":::

1. Download Microsoft Remote Desktop for Windows.
   :::image type="content" source="./media/quickstart-create-dev-box/dev-portal-download-rd-app.png" alt-text="Screenshot of the Microsoft Remote Desktop apps dialog box with options to Download an RD App for Windows, Mac, iOS and Android.":::

1. Copy the subscription URL from the popup window.
   :::image type="content" source="./media/quickstart-create-dev-box/dev-portal-subscription-url.png" alt-text="Screenshot of the Set up Remote Desktop dialog box showing the Subscription URL.":::

1. In the Remote Desktop App, select the more options menu and select **Subscribe with URL**. 
   :::image type="content" source="./media/quickstart-create-dev-box/rd-app-overflow-menu.png" alt-text="Screenshot of Subscribe with URL menu option.":::

1. Paste the subscription URL to subscribe to the workspace.
   :::image type="content" source="./media/quickstart-create-dev-box/rd-app-subscribe.png" alt-text="Screenshot of the Subscribe to a Workspace dialog box showing Email or Workspace box.":::

1. Your dev box will appear in the list under the workspace **Cloud PC Fidalgo plan 1**. Double-click to connect. 