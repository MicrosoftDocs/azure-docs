---
title: include file
description: include file
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: include
ms.date: 04/03/2020
ms.author: kgremban
ms.custom: include file
---
<!-- This tells how to create a custom shared access policy that has service connect and registry RW permissions for your IoT hub and get the connection string for it-->

To create a shared access policy that grants **service connect** and **registry write** permissions and to get a connection string for this policy, follow these steps:

1. In the [Azure portal](https://portal.azure.com), select **Resource groups**. Select the resource group where your hub is located, and then select your hub from the list of resources.

1. On the left-side pane of your hub, select **Shared access policies**.

1. From the menu above the list of policies, select **Add shared access policy**.

1. Under **Add shared access policy**, enter a descriptive name for your policy, such as *serviceAndRegistryReadWrite*. Under **Permissions**, select **Registry Write** and **Service Connect**, and then select **Add**. (The **Registry Read** permission is included automatically when you select **Registry Write**.)

    :::image type="content" source="./media/iot-hub-include-find-service-regrw-connection-string/iot-hub-add-svc-regrw-policy.png" alt-text="Screen capture that shows how to add a new shared access policy" border="true":::

1. Select your new policy from the list of policies.

1. Under **Shared access keys**, select the copy icon for the **Primary connection string** and save the value.

    :::image type="content" source="./media/iot-hub-include-find-service-regrw-connection-string/iot-hub-get-connection-string.png" alt-text="Screen capture that shows how to retrieve the connection string" border="true":::

For more information about IoT Hub shared access policies and permissions, see [Access control and permissions](../articles/iot-hub/iot-hub-dev-guide-sas.md#access-control-and-permissions).
