---
title: 'Quickstart: Create a Dev Box.'
description: 'This quickstart shows you how to create a Dev Box and connect to it.'
services: dev-box
ms.service: dev-box
ms.topic: quickstart
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/15/2022
---
<!-- 
  Customer intent:
	As a dev box user I want to understand how to create and access a Dev Box so that I can start work.
 -->

# Quickstart: Create a Dev Box

This quickstart describes how to create and connect to your first dev box resource, using the Developer portal. A dev box is created and managed by the [Dev Box User](./how-to-dev-box-user.md) persona.

In this quickstart, you will:

* [Create a dev box](#create-a-dev-box)
* [Connect to a dev box](#connect-to-a-dev-box)

## Prerequisites

- Permissions as [Dev Box User](./how-to-dev-box-user.md) on the Project that has a configured Dev Box Pool. Follow the [Create Dev Box Pool Quickstart](./quickstart-create-dev-box-pool.md) if you do not have an available pool.

## Create a dev box

1. Use the following link to open the [developer portal](https://portal.fidalgo.azure.com).

1. Sign in with your work credentials. Confirm successful login by viewing your profile icon on the top right of the screen.
:::image type="content" source="./media/quickstart-create-dev-box/dev-portal-profile.png" alt-text="Dev portal profile":::

1. Select **+ Add dev box**.
:::image type="content" source="./media/quickstart-create-dev-box/dev-portal-welcome.png" alt-text="Dev portal Welcome":::

1. For **Name**, enter in a name for your dev box. The name is required to be unique within a Project.

1. For **Project**, select a Project from the dropdown list.

1. For **Type**, select a type from the dropdown list. Type maps to Dev Box Pools that were created in the Azure portal. The dropdown will display all Pools within the selected Project.
:::image type="content" source="./media/quickstart-create-dev-box/dev-portal-add.png" alt-text="Dev portal create":::

1. Select the **Add** button. Your dev box will begin creating. You can track the progress of creation in the developer portal home page. Creation will take 60-90 minutes initially.
:::image type="content" source="./media/quickstart-create-dev-box/dev-portal-creating.png" alt-text="Dev portal creating":::

## Connect to a dev box
Once provisioned successfully, your dev box will be running. You can access it in multiple ways. 

### Browser

For quick access in a browser tab, the Developer portal links directly to a browser session through which you can connect to and use your dev box.

1. Open the [developer portal](https://portal.fidalgo.azure.com).

1. Select the **Open in browser** button on your dev box card.
:::image type="content" source="./media/quickstart-create-dev-box/dev-portal-card-browser.png" alt-text="Open in browser":::

A new tab will open with an RD session to your dev box.

### Remote Desktop App

The Microsoft Remote Desktop app lets users access and control any remote PC, including dev boxes. To set up the Remote Desktop client, follow these steps:

1. Open the [developer portal](https://portal.fidalgo.azure.com).

1. Select **Download RDP client** from the dropdown on your dev box card.
:::image type="content" source="./media/quickstart-create-dev-box/dev-portal-card-download.png" alt-text="Download RD client":::

1. Download Microsoft Remote Desktop for Windows
:::image type="content" source="./media/quickstart-create-dev-box/dev-portal-download-rd-app.png" alt-text="Download RD App":::

1. Copy the subscription URL from the popup window
:::image type="content" source="./media/quickstart-create-dev-box/dev-portal-subscription-url.png" alt-text="Get Subscription URL":::

1. In the Remote Desktop App, select the overflow menu from the top right and select **Subscribe with URL**. 
:::image type="content" source="./media/quickstart-create-dev-box/rd-app-overflow-menu.png" alt-text="Subscribe with URL":::

1. Paste the subscription URL to subscribe to the workspace.
:::image type="content" source="./media/quickstart-create-dev-box/rd-app-subscribe.png" alt-text="Subscribe to workspace":::

1. Your dev box will appear in the list under the workspace **Cloud PC Fidalgo plan 1**. Double-click to connect. 