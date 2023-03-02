---
title: include file
description: include file
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: include
ms.date: 10/19/2021
ms.author: kgremban
ms.custom: include file
---

Now that your endpoints and message routes are set up, you can view their configuration in the portal. Sign in to the [Azure portal](https://portal.azure.com) and go to **Resource Groups**. Next, select your resource group, then select your hub  (the hub name starts with `ContosoTestHub` in this tutorial). You see the IoT Hub pane.

:::image type="content" source="./media/iot-hub-include-view-routing-in-portal/01-show-hub-properties.png" alt-text="IoT Hub properties screen" border="true":::

In the options for the IoT Hub, select **Message Routing**. The routes you have set up successfully are displayed.

![The routes you set up](./media/iot-hub-include-view-routing-in-portal/02-show-message-routes.png)

On the **Message routing** screen, select **Custom Endpoints** to see the endpoints you have defined for the routes.

![The endpoints set up for the routes](./media/iot-hub-include-view-routing-in-portal/03-show-routing-endpoints.png)