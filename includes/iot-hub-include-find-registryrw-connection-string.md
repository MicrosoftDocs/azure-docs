---
title: include file
description: include file
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: include
ms.date: 08/07/2019
ms.author: kgremban
ms.custom: include file
---
<!-- This tells how to get the connection string for the registryReadWrite shared access policy of your IoT hub -->

To get the IoT Hub connection string for the **registryReadWrite** policy, follow these steps:

1. In the [Azure portal](https://portal.azure.com), select **Resource groups**. Select the resource group where your hub is located, and then select your hub from the list of resources.

2. On the left-side pane of your hub, select **Shared access policies**.

3. From the list of policies, select the **registryReadWrite** policy.

4. Copy the **Primary connection string** and save the value.

   :::image type="content" source="./media/iot-hub-include-find-registryrw-connection-string/iot-hub-get-connection-vs2019.png" alt-text="Screen capture that shows how to retrieve the connection string" border="true" lightbox="./media/iot-hub-include-find-registryrw-connection-string/iot-hub-get-connection-vs2019.png":::

For more information about IoT Hub shared access policies and permissions, see [Access control and permissions](../articles/iot-hub/iot-hub-dev-guide-sas.md#access-control-and-permissions).
