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
<!-- This tells how to create a custom shared access policy for your IoT hub and get the connection string for it-->

To create a shared access policy that grants **service connect** and **registry read** permissions and get a connection string for this policy, follow these steps:

1. In the [Azure portal](https://portal.azure.com), select **Resource groups**. Select the resource group where your hub is located, and then select your hub from the list of resources.

1. On the left-side pane of your hub, select **Shared access policies**.

1. From the top menu above the list of policies, select **Add**.

1. Under **Add a shared access policy**, enter a descriptive name for your policy, such as *serviceAndRegistryRead*. Under **Permissions**, select **Registry read** and **Service connect**, and then select **Create**.

    ![Show how to add a new shared access policy](./media/iot-hub-include-find-custom-connection-string/iot-hub-add-custom-policy.png)

1. Select your new policy from the list of policies.

1. Under **Shared access keys**, select the copy icon for the **Connection string -- primary key** and save the value.

    ![Show how to retrieve the connection string](./media/iot-hub-include-find-custom-connection-string/iot-hub-get-connection-string.png)

For more information about IoT Hub shared access policies and permissions, see [Access control and permissions](../articles/iot-hub/iot-hub-dev-guide-sas.md#access-control-and-permissions).
