---
title: 'Quickstart: Create a Dev Box '
description: 'This quickstart shows how to create a Dev Box and connect to it.'
services: dev-box
ms.service: dev-box
ms.topic: quickstart
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/15/2022
---

# Quickstart: Create a Dev Box

This quickstart describes how to create and connect to your first dev box resource, using the Developer portal. A dev box is created and managed by the [Dev Box User](/Documentation/how-to-dev-box-user.md) persona.

In this quickstart, you will:

* [Create a dev box](#create-a-dev-box)
* [Connect to a dev box](#connect-to-a-dev-box)

## Prerequisites

- Permissions as [Dev Box User](/Documentation/how-to-dev-box-user.md) on the Project that has a configured Dev Box Pool. Follow the [Create Dev Box Pool Quickstart](quickstart-create-dev-box-pool.md) if you do not have an available pool.

## Create a dev box

1. Use the following link to open the [developer portal](https://portal.fidalgo.azure.com).

1. Sign in with your work credentials. Confirm successful login by viewing your profile icon on the top right of the screen.
![Dev portal profile](/Documentation/media/Dev_Portal_Profile.png)

1. Select **+ Add dev box**.
![Dev portal Welcome](/Documentation/media/Dev_Portal_Welcome.png)

1. For **Name**, enter in a name for your dev box. The name is required to be unique within a Project.

1. For **Project**, select a Project from the dropdown list.

1. For **Type**, select a type from the dropdown list. Type maps to Dev Box Pools that were created in the Azure portal. The dropdown will display all Pools within the selected Project.
![Dev portal create](/Documentation/media/Dev_Portal_Add.png)

1. Select the **Add** button. Your dev box will begin creating. You can track the progress of creation in the developer portal home page. Creation will take 60-90 minutes initially.

![Dev portal creating](/Documentation/media/Dev_Portal_Creating.png)

## Connect to a dev box
Once provisioned successfully, your dev box will be running. You can access it in multiple ways. 

### Browser

For quick access in a browser tab, the Developer portal links directly to a browser session through which you can connect to and use your dev box.

1. Open the [developer portal](https://portal.fidalgo.azure.com).

1. Select the **Open in browser** button on your dev box card.
![Open in browser](/Documentation/media/Dev_Portal_Card_Browser.png)

A new tab will open with an RD session to your dev box.

### Remote Desktop App

The Microsoft Remote Desktop app lets users access and control any remote PC, including dev boxes. To set up the Remote Desktop client, follow these steps:

1. Open the [developer portal](https://portal.fidalgo.azure.com).

1. Select **Download RDP client** from the dropdown on your dev box card.
![Download RD client](/Documentation/media/Dev_Portal_Card_Download.png)

1. Download Microsoft Remote Desktop for Windows
![Download RD App](/Documentation/media/Dev_Portal_Download_RD_App.png)

1. Copy the subscription URL from the popup window
![Get Subscription URL](/Documentation/media/Dev_Portal_Subscription_URL.png)

1. In the Remote Desktop App, select the overflow menu from the top right and select **Subscribe with URL**. 
![Subscribe with URL](/Documentation/media/RD_App_Overflow_Menu.png)

1. Paste the subscription URL to subscribe to the workspace.
![Subscribe to workspace](/Documentation/media/RD_App_Subscribe.png)

1. Your dev box will appear in the list under the workspace **Cloud PC Fidalgo plan 1**. Double-click to connect. 