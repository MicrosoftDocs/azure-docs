---
title: include file
description: include file
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: include
ms.date: 11/02/2018
ms.author: robinsh
ms.custom: include file
---
<!-- this tells how to get the connection string for your hub -->
<!-- it used to be part of iot-hub-get-started-create-hub, but I'm separating it out so the -->
<!-- "base" include file for creating a hub only creates a hub -->
<!-- This assumes the user is looking at his hub in the portal. -->

1. After your hub has been created, you can retrieve the connection string you use to connect devices and applications to your hub. To find the connection string, click on your hub to see the property window. Click **Shared access policies**.
   
1. In **Shared access policies**, select the **iothubowner** policy. 

1. Copy the IoT Hub **Connection string---primary key** to use later. 

    ![Show how to retrieve the connection string](./media/iot-hub-find-connection-string-include/iot-hub-get-connection-string.png)

    For more information, see [Access control](../articles/iot-hub/iot-hub-devguide-security.md) in the "IoT Hub developer guide."
