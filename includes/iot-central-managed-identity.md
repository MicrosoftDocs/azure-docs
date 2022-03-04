---
 title: include file
 description: include file
 services: iot-central
 author: dominicbetts
 ms.service: iot-central
 ms.topic: include
 ms.date: 10/20/2021
 ms.author: dobett
 ms.custom: include file
---

To configure the managed identity that enables your IoT Central application to securely export data to your Azure resource:

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT Central application.

    > [!TIP]
    > By default, IoT Central applications are created in the **IOTC** resource group in your subscription.

1. Select **Identity**. Then on the **System assigned** page, change the status to **On**, and then select **Save**.

1. After a few seconds, the system assigned managed identity for your IoT Central application is enabled and you can select **Azure role assignments**:

    :::image type="content" source="media/iot-central-managed-identity/azure-role-assignments.png" alt-text="Screenshot of identity page for IoT Central application in the Azure portal.":::

1. On the **Azure role assignments** page, select **+ Add role assignment**.
