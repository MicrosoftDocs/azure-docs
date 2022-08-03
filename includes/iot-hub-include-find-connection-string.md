---
title: include file
description: include file
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: include
ms.date: 11/02/2018
ms.author: kgremban
ms.custom: include file
---
<!-- this tells how to get the connection string for your hub -->
<!-- This assumes the user is looking at his hub in the portal. -->

After your hub has been created, retrieve the connection string. This string is used to connect devices and applications to your hub. 

1. Click on your hub to see the IoT Hub pane with Settings, and so on. Click **Shared access policies**.
   
2. In **Shared access policies**, select the **iothubowner** policy. 

3. Under the new pane that opens from the right, copy the **Primary connection string** and save it to be used later.

   :::image type="content" source="./media/iot-hub-include-find-connection-string/iot-hub-get-connection-string.png" alt-text="Screenshot that shows how to get the 'Primary connection string' from your IoT Hub." lightbox="./media/iot-hub-include-find-connection-string/iot-hub-get-connection-string.png":::

   For more information, see [Access control](../articles/iot-hub/iot-hub-devguide-security.md) in the **IoT Hub developer guide**.
